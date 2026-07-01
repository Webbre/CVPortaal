<script setup>
import {
gekozenSjabloon, voornaam, achternaam, woonplaats, email, telefoon, geboorteJaar, profieltekst,
  heeftRijbewijs, heeftAuto, profielfoto, toonFotoOpCv, gekozenKleur,
  toonWerkervaring, werkervaringen, toonSterkePunten, sterkePunten,
  toonOpleidingen, opleidingen, toonTalen, talen, toonHobbys, hobbys,
  toonMeerOverMij, meerOverMijTekst, kleuren, jarenLijst, geboorteJarenLijst,
  isAiLaden, isAiToegepast, origineleProfieltekst,
  toonOpgeslagenFeedback, heeftOngeslagenWijzigingen,
  gebruiker, toonMenu, logMijUit, resetMijnCV, verwerkFoto, verwijderFoto, veranderKleur,
  voegWerkervaringToe, verwijderWerkervaring, voegSterkPuntToe, verwijderSterkPunt,
  voegOpleidingToe, verwijderOpleiding, voegTaalToe, verwijderTaal, zetTaalNiveau,
  voegHobbyToe, verwijderHobby, verbeterMetAI,
  triggerOpslaan, forceerOpslaan,
  emailFout, profielLengte, meerOverMijLengte,
  isAiLadenMeerOverMij, isAiToegepastMeerOverMij, origineleMeerOverMijTekst
} from '../cvStore.js'
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
              <h1 class="app-titel">CVPortaal. Jouw cv, simpel & snel.</h1>
          </div>
          
          <div style="display: flex; gap: 10px; align-items: center;">
              <button class="opslaan-knop" 
                      :class="{ 
                          'succes': toonOpgeslagenFeedback, 
                          'actief': heeftOngeslagenWijzigingen && !toonOpgeslagenFeedback, 
                          'inactief': !heeftOngeslagenWijzigingen && !toonOpgeslagenFeedback 
                      }" 
                      @click="forceerOpslaan" 
                      :aria-disabled="!heeftOngeslagenWijzigingen || toonOpgeslagenFeedback"
                      aria-label="Gegevens opslaan">
                      
                  <svg v-if="!toonOpgeslagenFeedback" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                      <polyline points="17 21 17 13 7 13 7 21"></polyline>
                      <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                      <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  
                  <span v-if="toonOpgeslagenFeedback">Opgeslagen!</span>
                  <span v-else>Opslaan</span>
              </button>

              <div class="menu-container-header relative">
                  <button class="tandwiel-knop" @click="toonMenu = !toonMenu" aria-label="Menu openen">
                      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                          <circle cx="12" cy="12" r="3"></circle>
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                      </svg>
                  </button>
                  <div v-if="toonMenu" class="dropdown-menu-header">
                      <p class="dropdown-header">Ingelogd als {{ gebruiker.email }}</p>
                      <button class="dropdown-item" @click="resetMijnCV">❌ Cv leegmaken</button>
                      <button class="dropdown-item" @click="logMijUit">📴 Uitloggen</button>
                  </div>
              </div>
          </div>
      </div>

      <h2 class="hoofdtitel" style="margin-top: 10px;">Kies je cv variant</h2>
      <div class="varianten-grid">
          <div class="variant-kaart" :class="{ actief: gekozenSjabloon === 'TemplateBasis' }" @click="gekozenSjabloon = 'TemplateBasis'">Basis</div>
          <div class="variant-kaart" :class="{ actief: gekozenSjabloon === 'TemplateKlassiek' }" @click="gekozenSjabloon = 'TemplateKlassiek'">Klassiek</div>
          <div class="variant-kaart" :class="{ actief: gekozenSjabloon === 'TemplateModern' }" @click="gekozenSjabloon = 'TemplateModern'">Modern</div>
      </div>

      <p style="font-size: 13px; font-weight:600; color:#718096; margin-bottom:8px;">Kies je kleur</p>
      <div class="kleur-kiezer">
          <button v-for="kleur in kleuren" :key="kleur" class="kleur-rondje" :class="{ actief: gekozenKleur === kleur }" :style="{ backgroundColor: kleur }" @click="veranderKleur(kleur)" :aria-label="`Kies kleur ${kleur}`"></button>
      </div>

      <h2 class="hoofdtitel">Kies je cv onderdelen</h2>
      <div class="onderdelen-grid">
          <button class="onderdeel-knop" :class="{ 'knop-uit': !toonSterkePunten }" @click="toonSterkePunten = !toonSterkePunten">Mijn sterke punten</button>
          <button class="onderdeel-knop" :class="{ 'knop-uit': !toonWerkervaring }" @click="toonWerkervaring = !toonWerkervaring">Waar heb ik gewerkt?</button>
          <button class="onderdeel-knop" :class="{ 'knop-uit': !toonOpleidingen }" @click="toonOpleidingen = !toonOpleidingen">Welke opleiding of cursus heb ik gedaan?</button>
          <button class="onderdeel-knop" :class="{ 'knop-uit': !toonTalen }" @click="toonTalen = !toonTalen">Talen die ik spreek</button>
          <button class="onderdeel-knop" :class="{ 'knop-uit': !toonHobbys }" @click="toonHobbys = !toonHobbys">Dit vind ik leuk</button>
          <button class="onderdeel-knop" :class="{ 'knop-uit': !toonMeerOverMij }" @click="toonMeerOverMij = !toonMeerOverMij">Meer over mij</button>
      </div>

      <h2 class="hoofdtitel">Mijn gegevens</h2>
      <div class="dynamisch-blok">
          <div class="form-grid">
            <div class="form-groep"><label>Voornaam</label><input type="text" v-model="voornaam" placeholder="Je voornaam"></div>
            <div class="form-groep"><label>Achternaam</label><input type="text" v-model="achternaam" placeholder="Je achternaam"></div>
            <div class="form-groep volledige-breedte"><label>Woonplaats</label><input type="text" v-model="woonplaats" placeholder="Je woonplaats"></div>
            <div class="form-groep">
    <label>E-mail</label>
    <div class="form-groep">
    <label>E-mail</label>
    <input type="email" v-model="email" placeholder="Je e-mailadres" :style="{ borderColor: emailFout ? '#e53e3e' : '' }">
    <span v-if="emailFout" style="color: #e53e3e; font-size: 11px; margin-top: 4px; display: block; font-weight: 600;">Vul een geldig e-mailadres in (bijv. naam@mail.nl).</span>
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

            <div class="form-groep">
                <label>Vervoer</label>
                <div class="toggle-container"><span class="toggle-label">Ik heb een rijbewijs</span><label class="toggle-switch"><input type="checkbox" v-model="heeftRijbewijs" aria-label="Ik heb een rijbewijs"><span class="toggle-slider"></span></label></div>
                <div class="toggle-container"><span class="toggle-label">Ik heb een eigen auto</span><label class="toggle-switch"><input type="checkbox" v-model="heeftAuto" aria-label="Ik heb een auto"><span class="toggle-slider"></span></label></div>
            </div>
          </div>
      </div>

      <h2 class="hoofdtitel">Dit ben ik</h2>
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
    <textarea v-model="profieltekst" @input="isAiToegepast = false" rows="5" placeholder="Denk aan je dagelijks leven, wat je leuk vindt of wat je graag wilt gaan doen..." :disabled="isAiLaden" :style="{ opacity: isAiLaden ? 0.6 : 1, borderColor: profielLengte > 400 ? '#e53e3e' : '' }"></textarea>
</div>
      </div>

      <div v-if="toonSterkePunten">
          <h2 class="hoofdtitel">Mijn sterke punten</h2>
          <div class="dynamisch-blok">
              <div v-for="(punt, index) in sterkePunten" :key="punt.id" style="display: flex; gap: 10px; margin-bottom: 15px; align-items: center;">
                  <input type="text" v-model="punt.tekst" placeholder="Bijv. Klantvriendelijk" style="flex: 1; padding: 12px; border: 1px solid #cbd5e0; border-radius: 6px; background: #ffffff; font-size: 14px; outline: none; transition: all 0.2s;">
                  <button class="verwijder-knop-klein" @click="verwijderSterkPunt(index)" aria-label="Verwijder dit sterk punt">✕</button>
              </div>
              <button class="toevoeg-knop" @click="voegSterkPuntToe" style="margin-bottom: 0; margin-top: 0;">+ Voeg een sterk punt toe</button>
          </div>
      </div>

      <div v-if="toonWerkervaring">
          <h2 class="hoofdtitel">Werkervaring</h2>
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
                          <textarea v-model="werk.omschrijving" rows="3" placeholder="Wat waren je taken?"></textarea>
                      </div>
                  </div>
              </div>
              <button class="toevoeg-knop" @click="voegWerkervaringToe" style="margin-bottom: 0; margin-top: 0;">+ Voeg een werkervaring toe</button>
          </div>
      </div>

      <div v-if="toonOpleidingen">
          <h2 class="hoofdtitel">Opleidingen & cursussen</h2>
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
              <button class="toevoeg-knop" @click="voegOpleidingToe" style="margin-bottom: 0; margin-top: 0;">+ Voeg een opleiding of cursus toe</button>
          </div>
      </div>

      <div v-if="toonTalen">
          <h2 class="hoofdtitel">Talen die ik spreek</h2>
          <div class="dynamisch-blok">
              <div v-for="(taal, index) in talen" :key="taal.id" 
                   :style="{ 
                       marginBottom: index < talen.length - 1 ? '20px' : '15px', 
                       paddingBottom: index < talen.length - 1 ? '20px' : '0px', 
                       borderBottom: index < talen.length - 1 ? '1px solid #e2e8f0' : 'none' 
                   }">
                  <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 10px;">
                      <input type="text" v-model="taal.naam" placeholder="Bijv. Engels of Spaans" style="flex: 1; padding: 12px; border: 1px solid #cbd5e0; border-radius: 6px; font-size: 14px; background: #ffffff;">
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
              <button class="toevoeg-knop" @click="voegTaalToe" style="margin-bottom: 0; margin-top: 0;">+ Voeg een taal toe</button>
          </div>
      </div>

      <div v-if="toonHobbys">
          <h2 class="hoofdtitel">Dit vind ik leuk</h2>
          <div class="dynamisch-blok">
              <div v-for="(hobby, index) in hobbys" :key="hobby.id" style="display: flex; gap: 10px; margin-bottom: 15px; align-items: center;">
                  <input type="text" v-model="hobby.tekst" placeholder="Bijv. Fotografie, reizen of koken" style="flex: 1; padding: 12px; border: 1px solid #cbd5e0; border-radius: 6px; background: #ffffff; font-size: 14px; outline: none; transition: all 0.2s;">
                  <button class="verwijder-knop-klein" @click="verwijderHobby(index)" aria-label="Verwijder dit item">✕</button>
              </div>
              <button class="toevoeg-knop" @click="voegHobbyToe" style="margin-bottom: 0; margin-top: 0;">+ Voeg een item toe</button>
          </div>
      </div>

<div v-if="toonMeerOverMij">
    <h2 class="hoofdtitel">Meer over mij</h2>
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
            <textarea v-model="meerOverMijTekst" @input="isAiToegepastMeerOverMij = false" rows="3" placeholder="Bijv. Ik ben vrijwilliger bij de voetbalclub van mijn dochter..." :disabled="isAiLadenMeerOverMij" :style="{ opacity: isAiLadenMeerOverMij ? 0.6 : 1, borderColor: meerOverMijLengte > 400 ? '#e53e3e' : '' }"></textarea>
        </div>
    </div>
</div>
</div>
</div>
</template>