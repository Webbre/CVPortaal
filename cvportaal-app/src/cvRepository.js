// cvRepository.js
// ---------------------------------------------------------------------------
// DE "BALIE" (repository-laag).
//
// Dit bestand is de enige plek die de stores gebruiken om data op te halen,
// op te slaan, in te loggen en uit te loggen. De stores weten niet dat er
// Firebase achter zit — ze praten alleen met deze balie.
//
// Bij de latere migratie naar Supabase vervangen we alleen de binnenkant van
// dit bestand; de stores en componenten hoeven dan niet aangeraakt te worden.
// ---------------------------------------------------------------------------

import {
  aiBrug,
  slaGegevensOp,
  haalGegevensOp,
  stuurInlogLink,
  voltooiInloggen,
  isInlogLink,
  onthoudenInlogEmail,
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

  isInlogLink() {
    return isInlogLink();
  },

  onthoudenInlogEmail() {
    return onthoudenInlogEmail();
  },

  async voltooiInloggen(email) {
    return await voltooiInloggen(email);
  },

  async logUit() {
    return await logUit();
  },

  luisterNaarInlogStatus(callback) {
    return luisterNaarInlogStatus(callback);
  },
}