// databaseService.js
// We importeren de specifieke Firebase code (Alles nu via dezelfde gstatic web-links)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-functions.js";

// Jouw unieke Firebase configuratie
const firebaseConfig = {
  apiKey: "AIzaSyCq7wkccap6BpPFRXzF6rr1BckKM4czSQA",
  authDomain: "cvportaal-ae317.firebaseapp.com",
  projectId: "cvportaal-ae317",
  storageBucket: "cvportaal-ae317.firebasestorage.app",
  messagingSenderId: "1031290268222",
  appId: "1:1031290268222:web:166f3243ac6340991bbf6f"
};

// We starten de applicatie, database en authenticatie
export const app = initializeApp(firebaseConfig);
const functions = getFunctions(app, 'europe-west3');
export const aiBrug = httpsCallable(functions, 'verbeterProfiel');
const db = getFirestore(app);
const auth = getAuth(app);

// --- 1. AUTHENTICATIE FUNCTIES ---

// Functie om de e-mail met de link te versturen
export async function stuurInlogLink(email) {
    const actionCodeSettings = {
        url: window.location.href, // Zorgt dat de gebruiker na het klikken terugkeert naar deze exacte pagina
        handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    // We slaan het emailadres tijdelijk op om de inlog straks af te ronden
    window.localStorage.setItem('emailForSignIn', email); 
}

// Functie om te checken of iemand via een inlog-link op de site komt
export async function voltooiInloggen() {
    if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
            // Soms opent een gebruiker de link op een ander apparaat, we vragen dan opnieuw het adres
            email = window.prompt('Bevestig je e-mailadres voor de zekerheid:');
        }
        await signInWithEmailLink(auth, email, window.location.href);
        window.localStorage.removeItem('emailForSignIn');
    }
}

// Functie om uit te loggen
export async function logUit() {
    await signOut(auth);
}

// Functie die in de gaten houdt of we ingelogd zijn of niet
export function luisterNaarInlogStatus(callback) {
    return onAuthStateChanged(auth, callback);
}

// --- 2. DATABASE FUNCTIES ---

// Slaat gegevens realtime op, gekoppeld aan de ingelogde gebruiker (1 CV per account)
export async function slaGegevensOp(data) {
    const user = auth.currentUser;
    if (!user) return; // Als er niemand is ingelogd, sla niets op
    
    try {
        const docRef = doc(db, "cv_documenten", user.uid); // Koppel het document aan de User ID
        await setDoc(docRef, data);
        console.log("Succes! CV opgeslagen voor: ", user.email);
    } catch (error) {
        console.error("Er is een fout opgetreden bij het opslaan: ", error);
    }
}

// Haalt het opgeslagen CV op uit de database bij het inloggen
export async function haalGegevensOp() {
    const user = auth.currentUser;
    if (!user) return null;

    try {
        const docRef = doc(db, "cv_documenten", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data(); // Geef de bewaarde gegevens terug aan Vue
        } else {
            return null; // Gebruiker heeft nog geen cv
        }
    } catch (error) {
        console.error("Fout bij het ophalen van het cv: ", error);
        return null;
    }
}