<script setup>
// Beheerportaal: het scherm voor coaches, keyusers en de administrator.
// Cliënten zien dit nooit — die krijgen de cv-maker.
//
// Voorlopig een schil; de dashboards per rol worden stapsgewijs ingevuld.
import { profiel, logMijUit } from '../cvStore.js'

const rolNamen = {
  super_admin: 'Administrator',
  organisatie_beheerder: 'Keyuser',
  coach: 'Coach',
}
</script>

<template>
  <div class="beheer-scherm">
    <div class="beheer-header">
      <div class="beheer-merk">
        <img src="/LogoCVP.png" alt="CVPortaal logo" class="beheer-logo" width="36" height="36">
        <h1 class="beheer-titel">CVPortaal — beheer</h1>
      </div>
      <button class="beheer-uitlog" @click="logMijUit">Uitloggen</button>
    </div>

    <div class="beheer-inhoud">
      <div class="beheer-kaart">
        <p class="beheer-welkom">Welkom{{ profiel?.voornaam ? `, ${profiel.voornaam}` : '' }}</p>
        <p class="beheer-rol">Je bent ingelogd als <strong>{{ rolNamen[profiel?.rol] || profiel?.rol }}</strong>.</p>
        <p class="beheer-toelichting">
          Het beheerportaal wordt stap voor stap ingericht. Binnenkort kun je hier
          accounts aanmaken en de voortgang van je cliënten volgen.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.beheer-scherm {
  min-height: 100vh;
  background: var(--kleur-achtergrond-kolom);
  padding: 20px;
}

.beheer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  background: var(--kleur-wit);
  border-radius: var(--radius-kaart);
  padding: 18px 24px;
  box-shadow: var(--schaduw-kaart);
  border-bottom: 3px solid var(--kleur-accent);
  margin-bottom: 30px;
}
.beheer-merk { display: flex; align-items: center; gap: 12px; min-width: 0; }
.beheer-logo { object-fit: contain; flex-shrink: 0; }
.beheer-titel {
  font-size: 18px;
  font-weight: 800;
  color: var(--kleur-tekst-sterk);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.beheer-uitlog {
  background: none;
  border: 1px solid var(--kleur-rand);
  border-radius: var(--radius-blok);
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: var(--kleur-tekst-gedempt);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
}
.beheer-uitlog:hover { border-color: var(--kleur-accent); color: var(--kleur-accent); }

.beheer-inhoud { max-width: 900px; margin: 0 auto; }
.beheer-kaart {
  background: var(--kleur-wit);
  border-radius: var(--radius-kaart);
  padding: 30px;
  box-shadow: var(--schaduw-kaart);
}
.beheer-welkom { font-size: 20px; font-weight: 700; color: var(--kleur-tekst-sterk); margin: 0 0 6px 0; }
.beheer-rol { font-size: 14px; color: var(--kleur-tekst-gedempt); margin: 0 0 20px 0; }
.beheer-toelichting { font-size: 14px; line-height: 1.6; color: var(--kleur-tekst-zacht); margin: 0; }
</style>