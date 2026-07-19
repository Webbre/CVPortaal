// databaseService.js
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

export async function voltooiInloggen() {
    if (isSignInWithEmailLink(auth, window.location.href)) {
        const email = window.localStorage.getItem('emailForSignIn');

        // Geen hardcoded fallback meer. Kan het e-mailadres niet worden bepaald
        // (bijv. link geopend op een ander apparaat), dan stoppen we netjes.
        if (!email) {
            throw new Error("Open de inloglink op hetzelfde apparaat waarop je hem hebt aangevraagd.");
        }

        await signInWithEmailLink(auth, email, window.location.href);
        window.localStorage.removeItem('emailForSignIn');
    }
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