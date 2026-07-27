// authStore.js
// ---------------------------------------------------------------------------
// Auth-store: alles rond inloggen, uitloggen en de ingelogde gebruiker.
//
// Inloggen gaat in twee stappen: eerst een e-mailadres opgeven, daarna de
// zescijferige code invullen die per e-mail binnenkomt. Zo maakt het niet uit
// op welk apparaat de gebruiker zijn e-mail leest.
//
// Naast de gebruiker houdt deze store ook het profiel bij: de rol en de
// organisatie waartoe iemand behoort.
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
export const inlogCode = ref('')
export const codeVerstuurd = ref(false)
export const toonMenu = ref(false)
export const inlogFout = ref('')

// --- Acties ---

// Stap 1: vraag een inlogcode aan voor het opgegeven e-mailadres.
export async function vraagCodeAan() {
  if (!loginEmail.value) return
  isLaden.value = true
  inlogFout.value = ''
  inlogCode.value = ''
  try {
    await cvRepository.stuurInlogLink(loginEmail.value)
    codeVerstuurd.value = true
  } catch (error) {
    inlogFout.value = 'Versturen is niet gelukt. Controleer het e-mailadres en je verbinding.'
  } finally {
    isLaden.value = false
  }
}

// Stap 2: controleer de ingevulde code.
export async function bevestigCode() {
  if (!inlogCode.value) return
  isLaden.value = true
  inlogFout.value = ''
  try {
    await cvRepository.bevestigCode(loginEmail.value, inlogCode.value.trim())
    // Bij succes neemt de inlog-luisteraar het over en laadt de app verder.
  } catch (error) {
    inlogFout.value = 'Deze code klopt niet of is verlopen. Vraag een nieuwe code aan.'
    isLaden.value = false
  }
}

// Terug naar het e-mailscherm, bijvoorbeeld bij een typefout in het adres.
export function terugNaarEmail() {
  codeVerstuurd.value = false
  inlogCode.value = ''
  inlogFout.value = ''
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
  codeVerstuurd.value = false
  inlogCode.value = ''
  await cvRepository.logUit()
}