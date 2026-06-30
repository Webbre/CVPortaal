const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { GoogleGenAI } = require("@google/genai");

const REGION = "europe-west3"; 
const PROJECT_ID = "cvportaal-ae317";

exports.verbeterProfiel = onCall({ region: REGION }, async (request) => {
  const ai = new GoogleGenAI({ 
    vertexai: true,
    project: PROJECT_ID, 
    location: REGION 
  });

  const inputTekst = request.data.tekst;
  const type = request.data.type || 'profiel'; // Welk blokje zijn we aan het verbeteren?

  if (!inputTekst) {
    throw new HttpsError("invalid-argument", "Er is geen tekst meegestuurd.");
  }

  try {
    const taakOmschrijving = type === 'profiel' 
      ? "Taak: Schrijf op basis van de input een foutloze cv-profieltekst. Filter daarnaast de belangrijkste 3 tot 5 kwaliteiten (sterke punten) uit de tekst."
      : "Taak: Schrijf op basis van de input een foutloze, bondige sectie 'extra informatie'. (Extraheer GEEN kwaliteiten, laat de kwaliteiten array leeg).";

    const prompt = `
    Rol: Je bent een no-nonsense expert in het schrijven van cv-teksten. Je weet precies wat werkgevers zoeken en schrijft glashelder.

    ${taakOmschrijving}

    Instructies en randvoorwaarden:
    - Vertaalslag: Vertaal de inhoud naar het Nederlands indien de input in een andere taal is.
    - Taalniveau (B1): Gebruik alledaagse woorden en korte zinnen.
    - Toon en stijl: Schrijf nuchter, eerlijk en recht door zee (de 'Groningse' stijl). Geen containerwoorden.
    - Inhoudelijke trouw: Werk alleen met feiten uit de tekst. Verzin niets bij.
    - LENGTE (CRUCIAAL): Maximaal 400 karakters (spaties NIET meegerekend). Wees uiterst bondig!
    - Format: Geef je antwoord uitsluitend in JSON formaat met exact deze twee sleutels: "verbeterdeTekst" (string) en "kwaliteiten" (array met strings).

    Input: ${inputTekst}
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
    });

    return JSON.parse(response.text);

  } catch (error) {
    console.error("Fout in GenAI:", error);
    throw new HttpsError("internal", "Kan de AI niet bereiken. Probeer het later opnieuw.");
  }
});