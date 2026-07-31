// cvRepository.js
// ---------------------------------------------------------------------------
// DE "BALIE" (repository-laag).
//
// Dit bestand is de enige plek die de stores gebruiken om data op te halen,
// op te slaan, in te loggen en uit te loggen. De stores weten niet welke
// dienst erachter zit.
//
// Alles loopt via Supabase (supabaseService.js).
// ---------------------------------------------------------------------------

import {
  stuurInlogLink,
  bevestigCode,
  luisterNaarInlogStatus,
  logUit,
  haalProfielOp,
  haalGegevensOp,
  slaGegevensOp,
  verbeterTekst,
  maakAccount,
  haalMijnClienten,
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

  // --- Beheer ---
  async maakAccount(gegevens) {
    return await maakAccount(gegevens)
  },

  async haalMijnClienten() {
    return await haalMijnClienten()
  },
}