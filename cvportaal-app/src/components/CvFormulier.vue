<script setup>
import { watch, nextTick } from 'vue'
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

// De autoResize functie om tekstvakken te laten meegroeien MET extra 15px ademruimte
const autoResize = (event) => {
  event.target.style.height = 'auto';
  event.target.style.height = (event.target.scrollHeight + 15) + 'px';
}

// FIX: Zorgt dat bestaande tekst direct de juiste hoogte krijgt bij inladen (Mobiel)
watch(isLaden, async (nieuwLaden) => {
  if (!nieuwLaden) {
    await nextTick();
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(ta => {
      if (ta.value) { // Alleen uitrekken als er daadwerkelijk tekst in staat
        ta.style.height = 'auto';
        ta.style.height = (ta.scrollHeight + 15) + 'px';
      }
    });
  }
});
</script>

<template>
  <div class="linkerkolom">

    <div class="app-header">
          <div class="app-logo-groep">
               <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="#4A90E2" stroke-width="2" width="28" height="28">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <h1 class="app-titel">CVPortaal. Jouw cv, simpel en snel.</h1>
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
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="menu-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                          Cv leegmaken
                      </button>
                      <button class="dropdown-item" @click="logMijUit">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="menu-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" /></svg>
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
              <button class="onderdeel-knop" :class="{ 'knop-uit': !toonWerkervaring }" @click="toonWerkervaring = !toonWerkervaring">Werkervaring</button>
              <button class="onderdeel-knop" :class="{ 'knop-uit': !toonOpleidingen }" @click="toonOpleidingen = !toonOpleidingen">Opleidingen & cursussen</button>
              <button class="onderdeel-knop" :class="{ 'knop-uit': !toonTalen }" @click="toonTalen = !toonTalen">Talen die ik spreek</button>
              <button class="onderdeel-knop" :class="{ 'knop-uit': !toonHobbys }" @click="toonHobbys = !toonHobbys">Dit vind ik leuk</button>
              <button class="onderdeel-knop" :class="{ 'knop-uit': !toonMeerOverMij }" @click="toonMeerOverMij = !toonMeerOverMij">Meer over mij</button>
          </div>
      </div>

      <div class="hoofdtitel-wrapper">
          <svg class="hoofdtitel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
          <h2 class="hoofdtitel">Mijn gegevens</h2>
      </div>
      
      <div class="dynamisch-blok">
          <div class="form-grid">
            <div class="form-groep"><label>Voornaam</label><input type="text" v-model="voornaam" placeholder="Je voornaam"></div>
            <div class="form-groep"><label>Achternaam</label><input type="text" v-model="achternaam" placeholder="Je achternaam"></div>
            <div class="form-groep volledige-breedte"><label>Woonplaats</label><input type="text" v-model="woonplaats" placeholder="Je woonplaats"></div>
            
            <div class="form-groep">
                <label>E-mail</label>
                <input type="email" v-model="email" placeholder="Je e-mailadres" :style="{ borderColor: emailFout ? '#e53e3e' : '' }">
                <span v-if="emailFout" class="waarschuwing-tekst-rood" style="font-size: 11px; margin-top: 4px; display: block;">Vul een geldig e-mailadres in.</span>
            </div>

            <div class="form-groep"><label>Telefoon</label><input type="tel" v-model="telefoon" placeholder="Je telefoonnummer"></div>
            
            <div class="form-groep">
                <label>Geboortejaar (optioneel)</label>
                <input type="text" list="jarenLijstId" v-model="geboorteJaar" placeholder="Bijv. 1990" maxlength="4">
                <datalist id="jarenLijstId">
                    <option v-for="jaar in geboorteJarenLijst" :key="jaar" :value="jaar"></option>
                </datalist>
            </div>

            <div class="form-groep">
                <label>Vervoer</label>
                <div class="toggle-container"><span class="toggle-label">Ik heb een rijbewijs</span><label class="toggle-switch"><input type="checkbox" v-model="heeftRijbewijs" aria-label="Ik heb een rijbewijs"><span class="toggle-slider"></span></label></div>
                <div class="toggle-container"><span class="toggle-label">Ik heb een eigen auto</span><label class="toggle-switch"><input type="checkbox" v-model="heeftAuto" aria-label="Ik heb een auto"><span class="toggle-slider"></span></label></div>
            </div>

            <div class="form-groep">
                <div class="foto-upload-sectie">
                    <div class="foto-preview-container">
                        <div class="foto-preview" :style="{ backgroundImage: profielfoto ? `url(${profielfoto})` : '' }">
                            <svg aria-hidden="true" focusable="false" v-if="!profielfoto" viewBox="0 0 24 24" fill="#cbd5e0" width="100" height="100"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                        </div>
                        <div class="foto-acties">
                            <label class="foto-upload-knop"> {{ profielfoto ? 'Foto wijzigen' : 'Foto uploaden' }} <input type="file" accept="image/*" @change="verwerkFoto" style="display: none;"> </label>
                            <button v-if="profielfoto" class="foto-verwijder-knop" @click="verwijderFoto">Verwijder foto</button>
                        </div>
                    </div>
                    <div class="toggle-container" v-if="profielfoto" style="margin-top: 15px;">
                        <span class="toggle-label">Foto op cv tonen</span>
                        <label class="toggle-switch"><input type="checkbox" v-model="toonFotoOpCv" aria-label="Toon foto op CV"><span class="toggle-slider"></span></label>
                    </div>
                </div>
            </div>

          </div>
      </div>

      <div class="hoofdtitel-wrapper">
          <svg class="hoofdtitel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
          <h2 class="hoofdtitel">Dit ben ik</h2>
      </div>
      
      <div class="dynamisch-blok">
          <div class="form-groep" style="margin-bottom: 0;">
              <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 8px;">
                  <label style="margin-bottom: 0;">Vertel iets over jezelf</label>
                  
                  <div style="display: flex; align-items: center; gap: 15px;">
                      <span :style="{ color: profielLengte > 400 ? '#e53e3e' : '#718096', fontSize: '11px', fontWeight: '600' }">
                          {{ profielLengte }} / 400 tekens
                      </span>
                      <button class="ai-knop" @click="verbeterMetAI('profiel')" :disabled="isAiLaden">
                          <svg v-if="!isAiToegepast && !isAiLaden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                          <svg v-if="isAiToegepast && !isAiLaden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg>
                          <svg v-if="isAiLaden" class="spin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
                          {{ isAiLaden ? 'Even nadenken...' : (isAiToegepast ? 'Ongedaan maken' : 'Verbeter met AI') }}
                      </button>
                  </div>
              </div>
              
              <textarea v-model="profieltekst" @input="isAiToegepast = false; autoResize($event)" rows="5" placeholder="Denk aan je dagelijks leven, wat je leuk vindt of wat je graag wilt gaan doen..." :disabled="isAiLaden" style="overflow: hidden; resize: none;" :style="{ opacity: isAiLaden ? 0.6 : 1, borderColor: profielLengte > 400 ? '#e53e3e' : '' }" class="profieltekst mobiel-marge-fix"></textarea>
          </div>
      </div>

      <div v-if="toonSterkePunten">
          <div class="hoofdtitel-wrapper">
              <svg class="hoofdtitel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
              <h2 class="hoofdtitel">Mijn sterke punten</h2>
          </div>
          
          <div class="dynamisch-blok">
              <div v-for="(punt, index) in sterkePunten" :key="punt.id" class="lijst-item-rij">
                  <input type="text" v-model="punt.tekst" placeholder="Bijv. Klantvriendelijk" class="lijst-input">
                  <button class="verwijder-knop-klein" @click="verwijderSterkPunt(index)" aria-label="Verwijder dit sterk punt">✕</button>
              </div>
              <button v-if="sterkePunten.length < 6" class="toevoeg-knop toevoeg-knop-marge" @click="voegSterkPuntToe">+ Voeg een sterk punt toe</button>
              <p v-else class="maximum-bereikt">Maximum bereikt</p>
          </div>
      </div>

      <div v-if="toonWerkervaring || toonOpleidingen">
          <div class="waarschuwing-blauw">
              <p class="waarschuwing-tekst-blauw">
                  💡 Werkgevers houden van een cv van maximaal 1 pagina. Kies daarom je belangrijkste werkervaring en opleidingen. Of laat alles weg van meer dan 10 jaar geleden.
              </p>
          </div>
      </div>

      <div v-if="toonWerkervaring">
          <div class="hoofdtitel-wrapper">
              <svg class="hoofdtitel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
              <h2 class="hoofdtitel">Werkervaring</h2>
          </div>
          
          <div class="dynamisch-blok">
              <div v-for="(werk, index) in werkervaringen" :key="werk.id" 
                   :style="{ 
                       marginBottom: index < werkervaringen.length - 1 ? '25px' : '15px', 
                       paddingBottom: index < werkervaringen.length - 1 ? '25px' : '0px', 
                       borderBottom: index < werkervaringen.length - 1 ? '1px solid #e2e8f0' : 'none' 
                   }">
                  <div style="display: flex; justify-content: flex-end; align-items: center; margin-bottom: 10px;">
                      <button class="verwijder-knop" @click="verwijderWerkervaring(index)">Verwijderen</button>
                  </div>
                  <div class="form-grid">
                      <div class="form-groep volledige-breedte">
                          <label>Functie</label>
                          <input type="text" v-model="werk.functie" placeholder="Bijv. Automonteur">
                      </div>
                      <div class="form-groep volledige-breedte">
                          <label>Organisatie</label>
                          <input type="text" v-model="werk.bedrijf" placeholder="Bijv. Vakgarage Jansen">
                      </div>
                      
                      <div class="form-groep">
                          <label>Van</label>
                          <div style="display: flex; gap: 8px;">
                              <select v-model="werk.vanMaand" style="width: 50%;" aria-label="Van maand">
                                  <option value="">Maand</option>
                                  <option v-for="m in 12" :key="m" :value="m">{{ m }}</option>
                              </select>
                              <select v-model="werk.vanJaar" style="width: 50%;" aria-label="Van jaar">
                                  <option value="">Jaar</option>
                                  <option v-for="jaar in jarenLijst" :key="jaar" :value="jaar">{{ jaar }}</option>
                              </select>
                          </div>
                      </div>

                      <div class="form-groep">
                          <label>Tot</label>
                          <div style="display: flex; gap: 8px;" v-if="!werk.isHuidigeBaan">
                              <select v-model="werk.totMaand" style="width: 50%;" aria-label="Tot maand">
                                  <option value="">Maand</option>
                                  <option v-for="m in 12" :key="m" :value="m">{{ m }}</option>
                              </select>
                              <select v-model="werk.totJaar" style="width: 50%;" aria-label="Tot jaar">
                                  <option value="">Jaar</option>
                                  <option v-for="jaar in jarenLijst" :key="jaar" :value="jaar">{{ jaar }}</option>
                              </select>
                          </div>
                          <div v-else style="display: flex; align-items: center; height: 46px; color: #718096; font-size: 14px; font-weight: 600;">
                              Heden
                          </div>
                      </div>

                      <div class="form-groep volledige-breedte">
                          <div class="toggle-container" style="justify-content: flex-start; gap: 10px;">
                              <label class="toggle-switch">
                                  <input type="checkbox" v-model="werk.isHuidigeBaan" aria-label="Ik werk hier nu nog">
                                  <span class="toggle-slider"></span>
                              </label>
                              <span class="toggle-label" style="font-weight: 600;">Ik werk hier nu nog</span>
                          </div>
                      </div>

                      <div class="form-groep volledige-breedte">
                          <label>Korte omschrijving</label>
                          <textarea v-model="werk.omschrijving" @input="autoResize($event)" rows="3" style="overflow: hidden; resize: none;" placeholder="Wat waren je taken?" class="mobiel-marge-fix"></textarea>
                      </div>
                  </div>
              </div>
              
              <div v-if="werkervaringen.length + opleidingen.length > 5" class="waarschuwing-rood">
                  <p class="waarschuwing-tekst-rood">⚠️ Let op: Je hebt veel informatie toegevoegd. Kijk aan de rechterkant of je cv nog op één pagina past. Past het niet? Dan verdwijnt er tekst als je het cv opslaat als PDF.</p>
              </div>
              <button class="toevoeg-knop toevoeg-knop-marge" @click="voegWerkervaringToe">+ Voeg een werkervaring toe</button>
          </div>
      </div>

      <div v-if="toonOpleidingen">
          <div class="hoofdtitel-wrapper">
              <svg class="hoofdtitel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>
              <h2 class="hoofdtitel">Opleidingen & cursussen</h2>
          </div>
          
          <div class="dynamisch-blok">
              <div v-for="(opl, index) in opleidingen" :key="opl.id" 
                   :style="{ 
                       marginBottom: index < opleidingen.length - 1 ? '25px' : '15px', 
                       paddingBottom: index < opleidingen.length - 1 ? '25px' : '0px', 
                       borderBottom: index < opleidingen.length - 1 ? '1px solid #e2e8f0' : 'none' 
                   }">
                <div style="display: flex; justify-content: flex-end; align-items: center; margin-bottom: 10px;">
                    <button class="verwijder-knop" @click="verwijderOpleiding(index)">Verwijderen</button>
                </div>
                <div class="form-grid">
                    
                    <div class="form-groep volledige-breedte">
                        <label>Wat wil je toevoegen?</label>
                        <select v-model="opl.type" style="font-weight: 600;">
                            <option value="Opleiding">Opleiding</option>
                            <option value="Cursus">Cursus of praktijkverklaring</option>
                        </select>
                    </div>

                    <div class="form-groep volledige-breedte">
                        <label>{{ opl.type === 'Cursus' ? 'Naam cursus of verklaring' : 'Naam opleiding' }}</label>
                        <input type="text" v-model="opl.studie" :placeholder="opl.type === 'Cursus' ? 'Bijv. BHV of VCA' : 'Bijv. Assistent Logistiek (mbo BBL)'">
                    </div>
                    <div class="form-groep volledige-breedte">
                        <label>School of instituut</label>
                        <input type="text" v-model="opl.instelling" placeholder="Bijv. Noorderpoort">
                    </div>

                    <div class="form-groep">
                        <label>Van</label>
                        <div style="display: flex; gap: 8px;">
                            <select v-model="opl.vanMaand" style="width: 50%;" aria-label="Van maand">
                                <option value="">Maand</option>
                                <option v-for="m in 12" :key="m" :value="m">{{ m }}</option>
                            </select>
                            <select v-model="opl.vanJaar" style="width: 50%;" aria-label="Van jaar">
                                <option value="">Jaar</option>
                                <option v-for="jaar in jarenLijst" :key="jaar" :value="jaar">{{ jaar }}</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-groep">
                        <label>Tot</label>
                        <div style="display: flex; gap: 8px;" v-if="!opl.isHuidigeOpleiding">
                            <select v-model="opl.totMaand" style="width: 50%;" aria-label="Tot maand">
                                <option value="">Maand</option>
                                <option v-for="m in 12" :key="m" :value="m">{{ m }}</option>
                            </select>
                            <select v-model="opl.totJaar" style="width: 50%;" aria-label="Tot jaar">
                                <option value="">Jaar</option>
                                <option v-for="jaar in jarenLijst" :key="jaar" :value="jaar">{{ jaar }}</option>
                            </select>
                        </div>
                        <div v-else style="display: flex; align-items: center; height: 46px; color: #718096; font-size: 14px; font-weight: 600;">
                            Heden
                        </div>
                    </div>

                    <div class="form-groep volledige-breedte" v-if="!opl.isHuidigeOpleiding">
                        <div class="toggle-container" style="justify-content: flex-start; gap: 10px;">
                            <label class="toggle-switch">
                                <input type="checkbox" v-model="opl.isBehaald" aria-label="Diploma behaald">
                                <span class="toggle-slider"></span>
                            </label>
                            <span class="toggle-label" style="font-weight: 600;">
                                {{ opl.type === 'Cursus' ? 'Certificaat behaald' : 'Diploma behaald' }}
                            </span>
                        </div>
                    </div>

                    <div class="form-groep volledige-breedte">
                        <div class="toggle-container" style="justify-content: flex-start; gap: 10px;">
                            <label class="toggle-switch">
                                <input type="checkbox" v-model="opl.isHuidigeOpleiding" aria-label="Ik volg dit momenteel nog">
                                <span class="toggle-slider"></span>
                            </label>
                            <span class="toggle-label" style="font-weight: 600;">Ik volg dit momenteel nog</span>
                        </div>
                    </div>
                </div>
              </div>
              
              <div v-if="werkervaringen.length + opleidingen.length > 5" class="waarschuwing-rood">
                  <p class="waarschuwing-tekst-rood">⚠️ Let op: Je hebt veel informatie toegevoegd. Kijk aan de rechterkant of je cv nog op één pagina past. Past het niet? Dan verdwijnt er tekst als je het cv opslaat als PDF.</p>
              </div>
              <button class="toevoeg-knop toevoeg-knop-marge" @click="voegOpleidingToe">+ Voeg een opleiding of cursus toe</button>
          </div>
      </div>

      <div v-if="toonTalen">
          <div class="hoofdtitel-wrapper">
              <svg class="hoofdtitel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>
              <h2 class="hoofdtitel">Talen die ik spreek</h2>
          </div>
          
          <div class="dynamisch-blok">
              <div v-for="(taal, index) in talen" :key="taal.id" 
                   :style="{ 
                       marginBottom: index < talen.length - 1 ? '20px' : '15px', 
                       paddingBottom: index < talen.length - 1 ? '20px' : '0px', 
                       borderBottom: index < talen.length - 1 ? '1px solid #e2e8f0' : 'none' 
                   }">
                  <div class="lijst-item-rij">
                      <input type="text" v-model="taal.naam" placeholder="Bijv. Engels of Spaans" class="lijst-input">
                      <button class="verwijder-knop-klein" @click="verwijderTaal(index)" aria-label="Verwijder deze taal">✕</button>
                  </div>
                  
                  <div style="display: flex; align-items: center; gap: 10px;">
                      <span style="font-size: 13px; font-weight: 600; color: #4a5568; min-width: 50px;">Niveau:</span>
                      <div style="display: flex; gap: 4px; cursor: pointer;">
                          <svg v-for="ster in 5" :key="ster" @click="zetTaalNiveau(taal, ster)" 
                               role="button" tabindex="0" :aria-label="`Niveau ${ster} van 5`" @keydown.enter="zetTaalNiveau(taal, ster)"
                               :fill="ster <= taal.niveau ? '#FFD700' : 'none'" 
                               stroke="#FFD700" viewBox="0 0 24 24" stroke-width="2" width="28" height="28" style="transition: all 0.2s; outline: none;">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                      </div>
                      <span style="font-size: 12px; color: #718096; font-weight: 600; margin-left: 10px;">
                          {{ taal.niveau === 5 ? 'Moedertaal' : taal.niveau === 4 ? 'Vloeiend' : taal.niveau === 3 ? 'Goed' : taal.niveau === 2 ? 'Basis' : taal.niveau === 1 ? 'Beginner' : 'Kies je niveau' }}
                      </span>
                  </div>
              </div>
              <button v-if="talen.length < 5" class="toevoeg-knop toevoeg-knop-marge" @click="voegTaalToe">+ Voeg een taal toe</button>
              <p v-else class="maximum-bereikt">Maximum bereikt</p>
          </div>
      </div>

      <div v-if="toonHobbys">
          <div class="hoofdtitel-wrapper">
              <svg class="hoofdtitel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
              <h2 class="hoofdtitel">Dit vind ik leuk</h2>
          </div>
          
          <div class="dynamisch-blok">
              <div v-for="(hobby, index) in hobbys" :key="hobby.id" class="lijst-item-rij">
                  <input type="text" v-model="hobby.tekst" placeholder="Bijv. Fotografie, reizen of koken" class="lijst-input">
                  <button class="verwijder-knop-klein" @click="verwijderHobby(index)" aria-label="Verwijder dit item">✕</button>
              </div>
              <button v-if="hobbys.length < 6" class="toevoeg-knop toevoeg-knop-marge" @click="voegHobbyToe">+ Voeg een item toe</button>
              <p v-else class="maximum-bereikt">Maximum bereikt</p>
          </div>
      </div>

      <div v-if="toonMeerOverMij">
          <div class="hoofdtitel-wrapper">
              <svg class="hoofdtitel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
              <h2 class="hoofdtitel">Meer over mij</h2>
          </div>
          
          <div class="dynamisch-blok">
              <div class="form-groep" style="margin-bottom: 0;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 8px;">
                      <label style="margin-bottom: 0;">Is er nog iets extra's dat je wilt delen?</label>
                      
                      <div style="display: flex; align-items: center; gap: 15px;">
                          <span :style="{ color: meerOverMijLengte > 400 ? '#e53e3e' : '#718096', fontSize: '11px', fontWeight: '600' }">
                              {{ meerOverMijLengte }} / 400 tekens
                          </span>
                          <button class="ai-knop" @click="verbeterMetAI('meerOverMij')" :disabled="isAiLadenMeerOverMij">
                              <svg v-if="!isAiToegepastMeerOverMij && !isAiLadenMeerOverMij" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                              <svg v-if="isAiToegepastMeerOverMij && !isAiLadenMeerOverMij" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg>
                              <svg v-if="isAiLadenMeerOverMij" class="spin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
                              {{ isAiLadenMeerOverMij ? 'Nadenken...' : (isAiToegepastMeerOverMij ? 'Ongedaan maken' : 'Verbeter met AI') }}
                          </button>
                      </div>
                  </div>
                  
                  <textarea v-model="meerOverMijTekst" @input="isAiToegepastMeerOverMij = false; autoResize($event)" rows="3" placeholder="Bijv. Ik ben vrijwilliger bij de voetbalclub van mijn dochter..." :disabled="isAiLadenMeerOverMij" style="overflow: hidden; resize: none;" :style="{ opacity: isAiLadenMeerOverMij ? 0.6 : 1, borderColor: meerOverMijLengte > 400 ? '#e53e3e' : '' }" class="mobiel-marge-fix"></textarea>
              </div>
          </div>
      </div>
      
  </div>
</template>

<style scoped>
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

/* NIEUWE STYLING VOOR DE TITELS EN ICOONTJES */
.hoofdtitel-wrapper { display: flex; align-items: center; gap: 10px; margin-top: 35px; margin-bottom: 15px; }
.hoofdtitel { margin-top: 0; margin-bottom: 0; }
.hoofdtitel-icon { width: 24px; height: 24px; color: #4A90E2; flex-shrink: 0; }

/* NIEUWE MENU STYLING (Icons en Kruisje) */
.menu-sluiten-knop { position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 16px; color: #a0aec0; cursor: pointer; padding: 5px; line-height: 1; transition: color 0.2s; }
.menu-sluiten-knop:hover { color: #4a5568; }
.dropdown-header { padding: 15px 30px 15px 15px; } /* Extra ruimte rechts voor het kruisje */
.dropdown-item { display: flex; align-items: center; }
.menu-icon { margin-right: 8px; color: #718096; }

/* NIEUWE HEADER STYLING */
.header-acties { display: flex; width: 100%; justify-content: space-between; align-items: center; }
.header-knoppen-links { display: flex; gap: 10px; }

/* NIEUWE KLEUR-KIEZER FADE WRAPPER */
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

@media (max-width: 768px) {
  .instellingen-kaart { padding: 15px; }
}

@media (max-width: 600px) {
  .app-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  /* MOBIELE PADDING FIX */
  .mobiel-marge-fix {
    padding-bottom: 15px !important;
  }
}
</style>