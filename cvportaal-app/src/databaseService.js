// databaseService.js
// ---------------------------------------------------------------------------
// LET OP: importeer de functies uit dit bestand NIET rechtstreeks in stores
// of componenten. Ga altijd via cvRepository.js (de "balie").
//
// Dit bestand is de Firebase-uitvoering áchter de balie. Bij de migratie naar
// Supabase (Fase 3) wordt alleen de binnenkant van cvRepository.js vervangen;
// dit bestand kan dan komen te vervallen. Rechtstreeks importeren hieruit zou
// die scheiding doorbreken en Firebase opnieuw door de hele app laten lekken.
// ---------------------------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-functions.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app-check.js";

// Config uit omgevingsvariabelen (Vite: alles met VITE_ prefix is beschikbaar in de client).
// Deze Firebase web-keys zijn niet geheim, maar horen niet hardcoded in de repo.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
// App Check: zorgt dat alleen deze eigen app de Firebase-diensten mag aanroepen.
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
  isTokenAutoRefreshEnabled: true,
});
const functions = getFunctions(app, 'europe-west3');
export const aiBrug = httpsCallable(functions, 'verbeterProfiel');
const db = getFirestore(app);
const auth = getAuth(app);

// --- 1. AUTHENTICATIE FUNCTIES ---

export async function stuurInlogLink(email) {
    const actionCodeSettings = {
        url: window.location.href,
        handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
}

// Geeft aan of de huidige pagina is geopend via een inloglink uit een e-mail.
export function isInlogLink() {
    return isSignInWithEmailLink(auth, window.location.href);
}

// Het e-mailadres dat bij het aanvragen van de link op dit apparaat is onthouden.
// Leeg wanneer de link op een ander apparaat wordt geopend.
export function onthoudenInlogEmail() {
    return window.localStorage.getItem('emailForSignIn') || '';
}

// Rondt het inloggen af met het opgegeven e-mailadres.
export async function voltooiInloggen(email) {
    if (!isSignInWithEmailLink(auth, window.location.href)) return;

    await signInWithEmailLink(auth, email, window.location.href);
    window.localStorage.removeItem('emailForSignIn');

    // Verwijder de inloggegevens uit de adresbalk, zodat een verversing niet
    // opnieuw een inmiddels verbruikte link probeert te gebruiken.
    window.history.replaceState({}, document.title, window.location.pathname);
}

export async function logUit() {
    await signOut(auth);
}

export function luisterNaarInlogStatus(callback) {
    return onAuthStateChanged(auth, callback);
}

// --- 2. DATABASE FUNCTIES ---

// Slaat gegevens op. GOOIT NU DE FOUT DOOR zodat de store dit eerlijk kan tonen.
export async function slaGegevensOp(data) {
    const user = auth.currentUser;
    if (!user) return;

    const docRef = doc(db, "cv_documenten", user.uid);
    await setDoc(docRef, data);
    console.log("CV opgeslagen voor gebruiker.");
}

export async function haalGegevensOp() {
    const user = auth.currentUser;
    if (!user) return null;

    try {
        const docRef = doc(db, "cv_documenten", user.uid);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
        console.error("Fout bij het ophalen van het cv:", error.message);
        return null;
    }
}