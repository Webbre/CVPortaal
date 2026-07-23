// authStore.js
// ---------------------------------------------------------------------------
// Auth-store: alles rond inloggen, uitloggen en de ingelogde gebruiker.
//
// Bewust gescheiden van de cv-document-logica (cvStore.js), als voorbereiding
// op het coach-scenario waarin "wie ben ik" en "welk CV toon ik" losstaan.
//
// Alle handelingen lopen via de balie (cvRepository.js), nooit rechtstreeks
// via Firebase.
// ---------------------------------------------------------------------------

import { ref } from 'vue'
import { cvRepository } from './cvRepository.js'

// --- Reactieve toestand ---
export const gebruiker = ref(null)
export const isLaden = ref(true)
export const loginEmail = ref('')
export const linkVerstuurd = ref(false)
export const toonMenu = ref(false)

// Wordt waar wanneer iemand een inloglink opent op een apparaat dat het
// e-mailadres niet kent. De gebruiker vult het dan zelf in ter bevestiging.
export const vraagInlogEmail = ref(false)
export const inlogFout = ref('')

// --- Acties ---

// Verstuurt de inloglink naar het opgegeven e-mailadres.
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

// Verwerkt een geopende inloglink. Kent dit apparaat het e-mailadres niet
// (bijvoorbeeld omdat de link op een andere telefoon of computer wordt
// geopend), dan vragen we het aan de gebruiker in plaats van af te breken.
export async function verwerkInlogLink() {
  if (!cvRepository.isInlogLink()) return

  const onthouden = cvRepository.onthoudenInlogEmail()
  if (!onthouden) {
    vraagInlogEmail.value = true
    isLaden.value = false
    return
  }

  try {
    await cvRepository.voltooiInloggen(onthouden)
  } catch (error) {
    inlogFout.value = 'Deze inloglink werkt niet meer. Vraag hieronder een nieuwe aan.'
    isLaden.value = false
  }
}

// Rondt het inloggen af met het e-mailadres dat de gebruiker net invulde.
export async function bevestigInlogEmail() {
  if (!loginEmail.value) return
  inlogFout.value = ''
  isLaden.value = true
  try {
    await cvRepository.voltooiInloggen(loginEmail.value)
    vraagInlogEmail.value = false
  } catch (error) {
    inlogFout.value = 'Dit e-mailadres hoort niet bij deze inloglink, of de link is verlopen.'
    isLaden.value = false
  }
}

// Registreert een luisteraar die reageert op inlog- en uitlogwijzigingen.
export function luisterNaarInlogStatus(callback) {
  return cvRepository.luisterNaarInlogStatus(callback)
}

// Logt de gebruiker uit.
export async function logUit() {
  await cvRepository.logUit()
}