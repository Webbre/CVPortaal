// authStore.js
// ---------------------------------------------------------------------------
// Auth-store: alles rond inloggen, uitloggen en de ingelogde gebruiker.
//
// Naast de gebruiker houdt deze store ook het profiel bij: de rol en de
// organisatie waartoe iemand behoort. Dat is nodig omdat een cv altijd aan
// een organisatie hangt.
//
// Alle handelingen lopen via de balie (cvRepository.js).
// ---------------------------------------------------------------------------

import { ref } from 'vue'
import { cvRepository } from './cvRepository.js'

// --- Reactieve toestand ---
export const gebruiker = ref(null)
export const profiel = ref(null)
export const isLaden = ref(true)
export const loginEmail = ref('')
export const linkVerstuurd = ref(false)
export const toonMenu = ref(false)
export const inlogFout = ref('')

// --- Acties ---

// Verstuurt de inloglink. De link van Supabase draagt de sleutel zelf mee en
// werkt daardoor op elk apparaat, ongeacht waar hij is aangevraagd.
export async function loginMetLink() {
  if (!loginEmail.value) return
  isLaden.value = true
  inlogFout.value = ''
  try {
    await cvRepository.stuurInlogLink(loginEmail.value)
    linkVerstuurd.value = true
  } catch (error) {
    inlogFout.value = 'Versturen is niet gelukt. Controleer het e-mailadres en je verbinding.'
  } finally {
    isLaden.value = false
  }
}

// Registreert een luisteraar die reageert op inlog- en uitlogwijzigingen.
export function luisterNaarInlogStatus(callback) {
  return cvRepository.luisterNaarInlogStatus(callback)
}

// Haalt rol en organisatie op van de ingelogde gebruiker.
export async function laadProfiel() {
  profiel.value = await cvRepository.laadProfiel()
  return profiel.value
}

export async function logUit() {
  profiel.value = null
  await cvRepository.logUit()
}