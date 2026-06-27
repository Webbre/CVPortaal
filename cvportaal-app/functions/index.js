const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { VertexAI } = require("@google-cloud/vertexai");

// De Cloud Function zelf woont veilig in Nederland (Eemshaven)
const FUNCTION_REGION = "europe-west4"; 
// De AI-rekenkracht halen we uit de Europese hoofd-hub (Frankfurt)
const AI_REGION = "europe-west3"; 

exports.verbeterProfiel = onCall({ region: FUNCTION_REGION }, async (request) => {
  const inputTekst = request.data.tekst;

  if (!inputTekst) {
    throw new HttpsError("invalid-argument", "Er is geen tekst meegestuurd.");
  }

  try {
    const projectId = process.env.GCLOUD_PROJECT;
    
    // Connectie met de AI-hub in Frankfurt
    const vertexAi = new VertexAI({ project: projectId, location: AI_REGION });
    
    // DE FIX: We gebruiken nu het nieuwste Gemini 3.5 Flash model!
    const model = vertexAi.preview.getGenerativeModel({
      model: "gemini-3.5-flash", 
      generationConfig: {
        response_mime_type: "application/json",
      },
    });

    // ... Jouw code vanaf 'const prompt = `Rol: ...`' blijft hieronder exact hetzelfde!

    const prompt = `
    Rol: Je bent een no-nonsense expert in het schrijven van cv-profielteksten. Je weet precies wat werkgevers zoeken en schrijft glashelder.

    Taak: Analyseer de input, herken automatisch de brontaal en schrijf op basis hiervan een foutloze profieltekst in eenvoudig Nederlands op B1-niveau. Filter daarnaast de belangrijkste 3 tot 5 kwaliteiten (sterke punten) uit de tekst.

    Instructies en randvoorwaarden:
    - Vertaalslag: Is de input in een andere taal geschreven? Vertaal de inhoud dan eerst naar het Nederlands.
    - Taalniveau (B1): Gebruik uitsluitend alledaagse woorden en korte zinnen. Vermijd vaktaal en woorden met meer dan 3 lettergrepen.
    - Toon en stijl: Schrijf nuchter, eerlijk en recht door zee (de 'Groningse' stijl). Gebruik geen poespas, marketingtaal of holle containerwoorden zoals 'passie'.
    - Inhoudelijke trouw: Werk alleen met feiten uit de tekst. Benoem concrete vaardigheden, maar verzin er absoluut niets bij.
    - Lengte en verhouding: Maximaal 150 woorden. Vormt de input slechts een paar zinnen? Houd de output dan beknopt. Maak het niet mooier of groter dan het is.
    - Format: Geef je antwoord uitsluitend in JSON formaat met exact deze twee sleutels: "verbeterdeTekst" (string) en "kwaliteiten" (array met strings).

    Input: ${inputTekst}
    `;

    const requestVertex = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
    const response = await model.generateContent(requestVertex);
    const aiAntwoord = response.response.candidates[0].content.parts[0].text;

    // Stuur de JSON veilig terug naar de applicatie
    return JSON.parse(aiAntwoord);

  } catch (error) {
    console.error("Fout in Vertex AI:", error);
    throw new HttpsError("internal", "Kan de AI niet bereiken. Probeer het later opnieuw.");
  }
});