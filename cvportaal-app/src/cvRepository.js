// cvRepository.js
// ---------------------------------------------------------------------------
// DE "BALIE" (repository-laag).
//
// Dit bestand is de enige plek die de store gebruikt om data op te halen,
// op te slaan, in te loggen en uit te loggen. De store weet NIET dat er
// Firebase achter zit — hij praat alleen met deze balie.
//
// Nu zit Firebase erachter (via databaseService.js). Bij de latere migratie
// naar Supabase vervangen we ALLEEN de binnenkant van dit bestand; de store
// en de componenten hoeven dan niet aangeraakt te worden.
// ---------------------------------------------------------------------------

import {
  aiBrug,
  slaGegevensOp,
  haalGegevensOp,
  stuurInlogLink,
  voltooiInloggen,
  logUit,
  luisterNaarInlogStatus,
} from './databaseService.js'

export const cvRepository = {
  // --- Data ---
  async laadCv() {
    return await haalGegevensOp();
  },

  async slaCvOp(data) {
    return await slaGegevensOp(data);
  },

  // --- AI ---
  async verbeterTekst(payload) {
    return await aiBrug(payload);
  },

  // --- Authenticatie ---
  async stuurInlogLink(email) {
    return await stuurInlogLink(email);
  },

  async voltooiInloggen() {
    return await voltooiInloggen();
  },

  async logUit() {
    return await logUit();
  },

  luisterNaarInlogStatus(callback) {
    return luisterNaarInlogStatus(callback);
  },
}