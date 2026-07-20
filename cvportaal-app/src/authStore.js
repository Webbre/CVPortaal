// authStore.js
// ---------------------------------------------------------------------------
// Auth-store: alles rond inloggen, uitloggen en de ingelogde gebruiker.
//
// Bewust gescheiden van de cv-document-logica (cvStore.js). Deze scheiding is
// de voorbereiding op het coach-scenario: straks kan een werkcoach het CV van
// een cliënt inladen zonder als die cliënt ingelogd te zijn — "wie ben ik" en
// "welk CV toon ik" zijn dan losgekoppeld.
//
// Alle data-handelingen lopen via de balie (cvRepository.js), nooit
// rechtstreeks via Firebase.
// ---------------------------------------------------------------------------

import { ref } from 'vue'
import { cvRepository } from './cvRepository.js'

// --- Reactieve toestand ---
export const gebruiker = ref(null)
export const isLaden = ref(true)
export const loginEmail = ref('')
export const linkVerstuurd = ref(false)
export const toonMenu = ref(false)

// --- Acties ---

// Verstuurt de inloglink naar het opgegeven e-mailadres.
export async function loginMetLink() {
  if (!loginEmail.value) return
  isLaden.value = true
  try {
    await cvRepository.stuurInlogLink(loginEmail.value)
    linkVerstuurd.value = true
  } catch (error) {
    alert("Er ging iets mis: " + error.message)
  } finally {
    isLaden.value = false
  }
}

// Rondt een inlog via een geopende link af (indien van toepassing).
export async function voltooiInloggen() {
  await cvRepository.voltooiInloggen()
}

// Registreert een luisteraar die reageert op inlog-/uitlogwijzigingen.
export function luisterNaarInlogStatus(callback) {
  return cvRepository.luisterNaarInlogStatus(callback)
}

// Logt de gebruiker uit.
export async function logUit() {
  await cvRepository.logUit()
}