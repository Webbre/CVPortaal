// cvRepository.js
// ---------------------------------------------------------------------------
// DE "BALIE" (repository-laag).
//
// Dit bestand is de enige plek die de stores gebruiken om data op te halen,
// op te slaan, in te loggen en uit te loggen. De stores weten niet welke
// dienst erachter zit.
//
// Sinds de migratie loopt alles via Supabase (supabaseService.js). De oude
// Firebase-uitvoering staat nog in databaseService.js; die wordt nergens meer
// gebruikt en kan vervallen zodra de overstap zich bewezen heeft.
// ---------------------------------------------------------------------------

import {
  stuurInlogLink,
  luisterNaarInlogStatus,
  logUit,
  haalProfielOp,
  haalGegevensOp,
  slaGegevensOp,
  verbeterTekst,
  bevestigCode,
} from './supabaseService.js'

export const cvRepository = {
  // --- Data ---
  async laadCv() {
    return await haalGegevensOp()
  },

  async slaCvOp(data) {
    return await slaGegevensOp(data)
  },

  // --- Profiel ---
  async laadProfiel() {
    return await haalProfielOp()
  },

  // --- AI ---
  async verbeterTekst(payload) {
    return await verbeterTekst(payload)
  },

  // --- Authenticatie ---
  async stuurInlogLink(email) {
    return await stuurInlogLink(email)
  },

async bevestigCode(email, code) {
    return await bevestigCode(email, code)
  },

  async logUit() {
    return await logUit()
  },

  luisterNaarInlogStatus(callback) {
    return luisterNaarInlogStatus(callback)
  },
}