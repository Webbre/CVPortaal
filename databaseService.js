// databaseService.js
// We importeren de specifieke Firebase code
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Vervang dit blokje later met jouw eigen unieke sleutels uit het Firebase dashboard
const firebaseConfig = {
    apiKey: "JOUW_API_KEY",
    authDomain: "jouw-project.firebaseapp.com",
    projectId: "jouw-project-id",
    storageBucket: "jouw-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "JOUW_APP_ID"
};

// We starten de databaseverbinding (de 'motor')
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DIT IS HET GEHEIM: We exporteren een algemene functie.
// Als we later overstappen naar een andere database, veranderen we alleen de code hierbinnen!
export async function slaGegevensOp(collectieNaam, data) {
    try {
        const docRef = await addDoc(collection(db, collectieNaam), data);
        console.log("Succes! Document is opgeslagen met ID: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Er is een fout opgetreden bij het opslaan: ", error);
    }
}