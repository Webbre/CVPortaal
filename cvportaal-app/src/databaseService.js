// databaseService.js
// We importeren de specifieke Firebase code
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Vervang dit blokje later met jouw eigen unieke sleutels uit het Firebase dashboard
const firebaseConfig = {
  apiKey: "AIzaSyCq7wkccap6BpPFRXzF6rr1BckKM4czSQA",
  authDomain: "cvportaal-ae317.firebaseapp.com",
  projectId: "cvportaal-ae317",
  storageBucket: "cvportaal-ae317.firebasestorage.app",
  messagingSenderId: "1031290268222",
  appId: "1:1031290268222:web:166f3243ac6340991bbf6f"
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