const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { GoogleGenAI } = require("@google/genai");

const REGION = "europe-west3"; 
const PROJECT_ID = "cvportaal-ae317";

exports.verbeterProfiel = onCall({ region: REGION, timeoutSeconds: 120 }, async (request) => {
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
    let taakOmschrijving = "";

    if (type === 'profiel') {
        taakOmschrijving = "Taak: Schrijf op basis van de input een foutloze cv-profieltekst. Filter daarnaast de belangrijkste 3 tot 5 kwaliteiten (sterke punten) uit de tekst.";
    } else {
        // Specifieke prompt voor 'Meer over mij' met de ik-vorm
        taakOmschrijving = `Taak: Schrijf op basis van de input een foutloze, bondige sectie 'extra informatie'. (Extraheer GEEN kwaliteiten, laat de kwaliteiten array leeg).
        
        BELANGRIJKE EXTRA INSTRUCTIES VOOR DEZE SECTIE:
        1. Behoud absoluut de ik-vorm (1e persoon enkelvoud). 
        2. Maak er lopende zinnen van, géén losse opsomming of steekwoorden.
        3. Houd het vriendelijk en nuchter.`;
    }

    const prompt = `
    Rol: Je bent een no-nonsense expert in het schrijven van cv-teksten. Je weet precies wat werkgevers zoeken en schrijft glashelder.

    ${taakOmschrijving}

    Instructies en randvoorwaarden:
    - Vertaalslag: Vertaal de inhoud naar het Nederlands indien de input in een andere taal is.
    - Taalniveau (B1): Gebruik alledaagse woorden en korte zinnen.
    - Toon en stijl: Schrijf nuchter, eerlijk en recht door zee (de 'Groningse' stijl). Geen containerwoorden.
    - Inhoudelijke trouw: Werk alleen met feiten uit de tekst. Verzin niets bij.
    - LENGTE (CRUCIAAL): De output mag absoluut niet langer zijn dan 350 karakters (spaties meegerekend). Wees uiterst bondig!
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