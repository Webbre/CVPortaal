<script setup>
import {
gekozenSjabloon, voornaam, achternaam, woonplaats, email, telefoon, geboorteJaar, profieltekst,
  heeftRijbewijs, heeftAuto, profielfoto, toonFotoOpCv, gekozenKleur,
  toonWerkervaring, werkervaringen, toonSterkePunten, sterkePunten,
  toonOpleidingen, opleidingen, toonTalen, talen, toonHobbys, hobbys,
  toonMeerOverMij, meerOverMijTekst, kleuren, jarenLijst, geboorteJarenLijst,
  isLaden, isAiLaden, isAiToegepast, origineleProfieltekst,
  toonOpgeslagenFeedback, heeftOngeslagenWijzigingen,
  gebruiker, toonMenu, logMijUit, resetMijnCV, verwerkFoto, verwijderFoto, veranderKleur,
  voegWerkervaringToe, verwijderWerkervaring, voegSterkPuntToe, verwijderSterkPunt,
  voegOpleidingToe, verwijderOpleiding, voegTaalToe, verwijderTaal, zetTaalNiveau,
  voegHobbyToe, verwijderHobby, verbeterMetAI,
  triggerOpslaan, forceerOpslaan,
  emailFout, profielLengte, meerOverMijLengte,
  isAiLadenMeerOverMij, isAiToegepastMeerOverMij, origineleMeerOverMijTekst, downloadPDF
} from '../cvStore.js'
import SectieMeerOverMij from './secties/SectieMeerOverMij.vue'
import SectieSterkePunten from './secties/SectieSterkePunten.vue'
import SectieHobbys from './secties/SectieHobbys.vue'
import SectieTalen from './secties/SectieTalen.vue'
import SectieProfiel from './secties/SectieProfiel.vue'
import SectieGegevens from './secties/SectieGegevens.vue'
import SectieWerkervaring from './secties/SectieWerkervaring.vue'
import SectieWerkervaring from './secties/SectieWerkervaring.vue'
</script>

<template>
  <div class="linkerkolom">

    <div class="app-header" :style="{ borderBottomColor: gekozenKleur }">
<div class="app-logo-groep">
    <img src="/LogoCVP.png" alt="CVPortaal logo" class="app-logo" width="40" height="40">
    <h1 class="app-titel app-titel-lang">CVPortaal. Jouw cv, simpel en snel.</h1>
<h1 class="app-titel app-titel-kort">CVPortaal</h1>
</div>
          
          <div class="header-acties">
              <div class="header-knoppen-links">
                  <button class="opslaan-knop" 
                          :class="{ 'succes': toonOpgeslagenFeedback, 'actief': heeftOngeslagenWijzigingen && !toonOpgeslagenFeedback, 'inactief': !heeftOngeslagenWijzigingen && !toonOpgeslagenFeedback }" 
                          @click="forceerOpslaan" :aria-disabled="!heeftOngeslagenWijzigingen || toonOpgeslagenFeedback">
                      <svg v-if="!toonOpgeslagenFeedback" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <span v-if="toonOpgeslagenFeedback">Opgeslagen!</span><span v-else>Opslaan</span>
                  </button>

                  <button class="download-knop" @click="downloadPDF" aria-label="Download als PDF">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                      <span>PDF</span>
                  </button>
              </div>

              <div class="menu-container-header relative">
                  <button class="tandwiel-knop" @click="toonMenu = !toonMenu" aria-label="Menu openen">
                      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                  </button>
                  <div v-if="toonMenu" class="dropdown-menu-header">
                      <button class="menu-sluiten-knop" @click="toonMenu = false" aria-label="Menu sluiten">✕</button>
                      
                      <p class="dropdown-header">{{ gebruiker.email }}</p>
                      
                      <button class="dropdown-item" @click="resetMijnCV">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" class="menu-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                          Cv leegmaken
                      </button>
                      <button class="dropdown-item" @click="logMijUit">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" class="menu-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" /></svg>
                          Uitloggen
                      </button>
                  </div>
              </div>
          </div>
      </div>

      <div class="instellingen-kaart">
          <div class="instellingen-header">
              <h2 class="instellingen-titel">CV INSTELLINGEN</h2>
          </div>

          <p class="instellingen-label">1. Kies je variant</p>
          <div class="varianten-grid instellingen-marge">
              <div class="variant-kaart" :class="{ actief: gekozenSjabloon === 'TemplateBasis' }" @click="gekozenSjabloon = 'TemplateBasis'">Basis</div>
              <div class="variant-kaart" :class="{ actief: gekozenSjabloon === 'TemplateKlassiek' }" @click="gekozenSjabloon = 'TemplateKlassiek'">Klassiek</div>
              <div class="variant-kaart" :class="{ actief: gekozenSjabloon === 'TemplateModern' }" @click="gekozenSjabloon = 'TemplateModern'">Modern</div>
          </div>

          <p class="instellingen-label">2. Kies je kleur</p>
          
          <div class="kleur-container-wrapper instellingen-marge">
              <div class="kleur-kiezer">
                  <button v-for="kleur in kleuren" :key="kleur" class="kleur-rondje" :class="{ actief: gekozenKleur === kleur }" :style="{ backgroundColor: kleur }" @click="veranderKleur(kleur)" :aria-label="`Kies kleur ${kleur}`"></button>
              </div>
          </div>

          <p class="instellingen-label">3. Kies je onderdelen</p>
          <div class="onderdelen-grid onderdelen-grid-instellingen">
              <button class="onderdeel-knop" :class="{ 'knop-uit': !toonSterkePunten }" @click="toonSterkePunten = !toonSterkePunten">Mijn sterke punten</button>
              <button class="onderdeel-knop" :class="{ 'knop-uit': !toonWerkervaring }" @click="toonWerkervaring = !toonWerkervaring">Waar heb ik gewerkt?</button>
              <button class="onderdeel-knop" :class="{ 'knop-uit': !toonOpleidingen }" @click="toonOpleidingen = !toonOpleidingen">Welke opleiding of cursus heb ik gedaan?</button>
              <button class="onderdeel-knop" :class="{ 'knop-uit': !toonTalen }" @click="toonTalen = !toonTalen">Talen die ik spreek</button>
              <button class="onderdeel-knop" :class="{ 'knop-uit': !toonHobbys }" @click="toonHobbys = !toonHobbys">Dit vind ik leuk</button>
              <button class="onderdeel-knop" :class="{ 'knop-uit': !toonMeerOverMij }" @click="toonMeerOverMij = !toonMeerOverMij">Meer over mij</button>
          </div>
      </div>

<SectieGegevens />

<SectieProfiel />

<SectieSterkePunten v-if="toonSterkePunten" />

      <div v-if="toonWerkervaring || toonOpleidingen">
          <div class="waarschuwing-blauw">
              <p class="waarschuwing-tekst-blauw">
                  💡 Werkgevers houden van een cv van maximaal 1 pagina. Kies daarom alleen je belangrijkste werkervaring en opleidingen. Laat alles weg van meer dan 10 jaar geleden.
              </p>
          </div>
      </div>

<SectieOpleidingen v-if="toonOpleidingen" />

<SectieTalen v-if="toonTalen" />
<SectieHobbys v-if="toonHobbys" />
<SectieMeerOverMij v-if="toonMeerOverMij" />
      
  </div>
</template>

<style scoped>
/* Nette header-balk met merk-lijntje in de accentkleur */
.app-header {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px 25px;
  margin-top: 10px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05);
  border-bottom: 3px solid #4A90E2; /* valt terug op blauw; wordt overschreven door de gekozen kleur */
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}
.app-logo-groep { gap: 14px; }
.instellingen-kaart { background-color: #ffffff; border-radius: 16px; padding: 25px; margin-bottom: 30px; margin-top: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05); }
.instellingen-header { margin-bottom: 20px; border-bottom: 2px solid #edf2f7; padding-bottom: 15px; }
.instellingen-titel { font-size: 16px; font-weight: 800; color: #1a202c; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
.instellingen-label { font-size: 13px; font-weight: 700; color: #4a5568; margin-bottom: 12px; }
.instellingen-marge { margin-bottom: 25px; }
.onderdelen-grid-instellingen { margin-bottom: 0; border-bottom: none; padding-bottom: 0; }
.waarschuwing-rood { background-color: #fff5f5; border-left: 4px solid #e53e3e; padding: 12px; border-radius: 8px; margin-top: 10px; margin-bottom: 15px; }
.waarschuwing-tekst-rood { font-size: 13px; color: #c53030; margin: 0; font-weight: 600; line-height: 1.5; }
.waarschuwing-blauw { background-color: #ebf8ff; border-left: 4px solid #4A90E2; padding: 15px; border-radius: 8px; margin-bottom: 20px; margin-top: 35px; }
.waarschuwing-tekst-blauw { font-size: 13px; color: #2b6cb0; margin: 0; font-weight: 600; line-height: 1.5; }
.lijst-item-rij { display: flex; gap: 10px; margin-bottom: 15px; align-items: center; }
.lijst-input { flex: 1; padding: 12px; border: 1px solid #cbd5e0; border-radius: 6px; background: #ffffff; font-size: 14px; outline: none; transition: all 0.2s; }
.toevoeg-knop-marge { margin-bottom: 0; margin-top: 0; }
.maximum-bereikt { font-size: 13px; color: #718096; font-weight: 600; text-align: center; margin: 10px 0 0 0; }
.download-knop { background: white; color: #4A90E2; border: 2px solid #4A90E2; border-radius: 20px; padding: 0 16px; height: 40px; display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
.download-knop:hover { background: #eff6ff; transform: translateY(-1px); }
.app-logo { width: 40px; height: 40px; object-fit: contain; flex-shrink: 0; }
.app-titel-kort { display: none; }
.app-titel-lang { display: block; }

@media (max-width: 600px) {
  .app-logo { width: 34px; height: 34px; }
}
.hoofdtitel-wrapper { display: flex; align-items: center; gap: 10px; margin-top: 35px; margin-bottom: 15px; }
.hoofdtitel { margin-top: 0; margin-bottom: 0; }
.hoofdtitel-icon { width: 24px; height: 24px; color: #4A90E2; flex-shrink: 0; }

.menu-sluiten-knop { position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 16px; color: #a0aec0; cursor: pointer; padding: 5px; line-height: 1; transition: color 0.2s; }
.menu-sluiten-knop:hover { color: #4a5568; }
.dropdown-header { padding: 15px 30px 15px 15px; } 
.dropdown-item { display: flex; align-items: center; }
.menu-icon { margin-right: 8px; color: #718096; }

.header-acties { display: flex; width: 100%; justify-content: space-between; align-items: center; }
.header-knoppen-links { display: flex; gap: 10px; }

.kleur-container-wrapper { position: relative; width: 100%; }
.kleur-container-wrapper::before,
.kleur-container-wrapper::after { content: ""; position: absolute; top: 0; bottom: 0; width: 25px; z-index: 2; pointer-events: none; }
.kleur-container-wrapper::before { left: 0; background: linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%); }
.kleur-container-wrapper::after { right: 0; background: linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%); }

.kleur-kiezer { position: relative; z-index: 1; display: flex; gap: 12px; margin-bottom: 0; flex-wrap: nowrap; overflow-x: auto; padding: 5px 15px 15px 15px; -webkit-overflow-scrolling: touch; scrollbar-width: none; width: 100%; }
.kleur-kiezer::-webkit-scrollbar { display: none; }
.kleur-rondje { width: 26px; height: 26px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: transform 0.1s ease; flex-shrink: 0; position: relative; z-index: 3;}
.kleur-rondje:hover { transform: scale(1.1); }
.kleur-rondje.actief { border-color: #333; }

/* =========================================
   CLAUDE'S GRID REPLICATOR (AUTO-RESIZE CSS FIX)
   ========================================= */
.autogrow-wrapper {
  display: grid;
  width: 100%;
}

.autogrow-wrapper::after,
.autogrow-wrapper > textarea {
  width: 100%;
  grid-area: 1 / 1;
  font-family: inherit;
  font-size: 14px;
  padding: 12px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  box-sizing: border-box;
  line-height: 1.5; /* Zorgt voor perfecte uitlijning tussen replica en textarea */
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  min-height: 100px; /* Base height in plaats van rows="5" */
}

.autogrow-wrapper > textarea {
  resize: none;
  overflow: hidden;
  background: #ffffff;
  transition: border-color 0.2s;
}

.autogrow-wrapper > textarea:focus {
  border-color: #4A90E2;
  outline: none;
}

.autogrow-wrapper::after {
  content: attr(data-value) " "; /* De geniale trailing space fix van Claude */
  visibility: hidden;
}

/* Formulier groep margin fix om oude textarea styles te overschrijven */
.form-groep .autogrow-wrapper textarea {
  margin-bottom: 0;
}

/* Laag 1: field-sizing voor de allernieuwste browsers (zoals de nieuwste Chrome en Samsung Internet) */
@supports (field-sizing: content) {
  .autogrow-wrapper { display: block; }
  .autogrow-wrapper::after { display: none; }
  .autogrow-wrapper > textarea {
    field-sizing: content;
  }
}

@media (max-width: 768px) {
  .instellingen-kaart { padding: 15px; }
}

@media (max-width: 600px) {
  .app-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .app-logo { width: 34px; height: 34px; }
  .app-titel-lang { display: none; }
  .app-titel-kort { display: block; }
}
</style>