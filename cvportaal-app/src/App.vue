<script setup>
import { ref, watch, onMounted } from 'vue'
import { 
  slaGegevensOp, haalGegevensOp, 
  stuurInlogLink, voltooiInloggen, 
  logUit, luisterNaarInlogStatus 
} from './databaseService.js'

// --- AUTHENTICATIE & STATUS VARIABELEN ---
const gebruiker = ref(null)
const isLaden = ref(true)
const loginEmail = ref('')
const linkVerstuurd = ref(false)
const toonMenu = ref(false)

// --- CV DATA VARIABELEN ---
const voornaam = ref('')
const achternaam = ref('')
const adres = ref('')
const postcode = ref('')
const email = ref('')
const telefoon = ref('')
const profieltekst = ref('')
const heeftRijbewijs = ref(false)
const heeftAuto = ref(false)
const profielfoto = ref(null)
const toonFotoOpCv = ref(true)
const gekozenKleur = ref('#4A90E2')

// Dynamische blokken en hun weergave-status
const werkervaringen = ref([])
const toonSterkePunten = ref(true)
const sterkePunten = ref([])
const toonOpleidingen = ref(true)
const opleidingen = ref([])
const toonTalen = ref(true)
const talen = ref([])

const kleuren = [
  '#4A90E2', '#E24A4A', '#2ECC71', '#9B59B6', '#F1C40F',
  '#E67E22', '#FF85A2', '#1ABC9C', '#34495E'
]

// --- LIFECYCLE & INLOG LOGICA ---
onMounted(async () => {
  try {
    await voltooiInloggen();
  } catch (error) {
    console.error("Fout bij voltooiInloggen:", error);
  }

  luisterNaarInlogStatus(async (user) => {
    try {
      if (user) {
        gebruiker.value = user;
        const data = await haalGegevensOp();
        if (data) {
          voornaam.value = data.voornaam || '';
          achternaam.value = data.achternaam || '';
          adres.value = data.adres || '';
          postcode.value = data.postcode || '';
          email.value = data.email || '';
          telefoon.value = data.telefoon || '';
          profieltekst.value = data.profieltekst || '';
          heeftRijbewijs.value = data.heeftRijbewijs || false;
          heeftAuto.value = data.heeftAuto || false;
          profielfoto.value = data.profielfoto || null;
          toonFotoOpCv.value = data.toonFotoOpCv !== undefined ? data.toonFotoOpCv : true;
          gekozenKleur.value = data.gekozenKleur || '#4A90E2';
          toonTalen.value = data.toonTalen !== undefined ? data.toonTalen : true;
          talen.value = (data.talen || []).map(t => ({ id: t.id || Date.now() + Math.random(), ...t }));
          
          // Data inladen én oude data voorzien van een uniek ID als ze dat nog niet hadden
          werkervaringen.value = (data.werkervaringen || []).map(w => ({ id: w.id || Date.now() + Math.random(), ...w }));
          opleidingen.value = (data.opleidingen || []).map(o => ({ id: o.id || Date.now() + Math.random(), ...o }));
          
          toonSterkePunten.value = data.toonSterkePunten !== undefined ? data.toonSterkePunten : true;
          sterkePunten.value = data.sterkePunten || [];
          toonOpleidingen.value = data.toonOpleidingen !== undefined ? data.toonOpleidingen : true;
        }
      } else {
        gebruiker.value = null;
        maakCvLeeg(false);
        toonTalen.value = true; talen.value = [];
      }
    } catch (error) {
      console.error("Fout bij het inladen:", error);
    } finally {
      isLaden.value = false;
    }
  });
})

// Acties
async function loginMetLink() {
  if (!loginEmail.value) return;
  isLaden.value = true;
  try {
    await stuurInlogLink(loginEmail.value);
    linkVerstuurd.value = true;
  } catch (error) {
    alert("Er ging iets mis: " + error.message);
  } finally {
    isLaden.value = false;
  }
}

async function logMijUit() {
  toonMenu.value = false;
  isLaden.value = true;
  await logUit();
}

function resetMijnCV() {
  toonMenu.value = false;
  if (confirm("Weet je zeker dat je helemaal opnieuw wilt beginnen?")) {
    maakCvLeeg(true);
  }
}

function maakCvLeeg(forceerDatabaseOpslag = false) {
  voornaam.value = ''; achternaam.value = ''; adres.value = ''; postcode.value = '';
  email.value = ''; telefoon.value = ''; profieltekst.value = '';
  heeftRijbewijs.value = false; heeftAuto.value = false; profielfoto.value = null;
  gekozenKleur.value = '#4A90E2'; werkervaringen.value = [];
  toonSterkePunten.value = true; sterkePunten.value = [];
  toonOpleidingen.value = true; opleidingen.value = [];
  toonTalen.value = true; talen.value = [];
  
  if (forceerDatabaseOpslag) triggerOpslaan();
}

// --- FUNCTIES VOOR DE CV BOUWER ---
function verwerkFoto(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => { profielfoto.value = e.target.result }
    reader.readAsDataURL(file)
  }
}

function verwijderFoto() { profielfoto.value = null }
function veranderKleur(kleur) { gekozenKleur.value = kleur }

// Functies voor dynamische lijsten
function voegWerkervaringToe() { 
  werkervaringen.value.push({ 
    id: Date.now(),
    functie: '', bedrijf: '', 
    vanMaand: '', vanJaar: '', 
    totMaand: '', totJaar: '', 
    isHuidigeBaan: false, omschrijving: '' 
  }) 
}
function verwijderWerkervaring(index) { werkervaringen.value.splice(index, 1) }

function voegSterkPuntToe() { sterkePunten.value.push({ tekst: '' }) }
function verwijderSterkPunt(index) { sterkePunten.value.splice(index, 1) }

function voegOpleidingToe() { 
  opleidingen.value.push({ 
    id: Date.now(),
    type: 'Opleiding', 
    studie: '', instelling: '', 
    vanMaand: '', vanJaar: '', 
    totMaand: '', totJaar: '', 
    isHuidigeOpleiding: false, 
    isBehaald: false, 
    omschrijving: '' 
  }) 
}
function verwijderOpleiding(index) { opleidingen.value.splice(index, 1) }
function voegTaalToe() { talen.value.push({ id: Date.now(), naam: '', niveau: 0 }) }
function verwijderTaal(index) { talen.value.splice(index, 1) }
function zetTaalNiveau(taal, niveau) { taal.niveau = niveau; triggerOpslaan(); }

// --- SORTEER FUNCTIES ---
function sorteerErvaringen() {
  werkervaringen.value.sort((a, b) => {
    if (a.isHuidigeBaan && !b.isHuidigeBaan) return -1;
    if (!a.isHuidigeBaan && b.isHuidigeBaan) return 1;
    const jaarA = parseInt(a.vanJaar) || 0;
    const jaarB = parseInt(b.vanJaar) || 0;
    if (jaarB !== jaarA) return jaarB - jaarA;
    const maandA = parseInt(a.vanMaand) || 0;
    const maandB = parseInt(b.vanMaand) || 0;
    return maandB - maandA;
  });
}

function sorteerOpleidingen() {
  opleidingen.value.sort((a, b) => {
    if (a.isHuidigeOpleiding && !b.isHuidigeOpleiding) return -1;
    if (!a.isHuidigeOpleiding && b.isHuidigeOpleiding) return 1;
    const jaarA = parseInt(a.vanJaar) || 0;
    const jaarB = parseInt(b.vanJaar) || 0;
    if (jaarB !== jaarA) return jaarB - jaarA;
    const maandA = parseInt(a.vanMaand) || 0;
    const maandB = parseInt(b.vanMaand) || 0;
    return maandB - maandA;
  });
}

// Database trigger
function triggerOpslaan() {
  if (!gebruiker.value || isLaden.value) return;
  slaGegevensOp({
    voornaam: voornaam.value, achternaam: achternaam.value, adres: adres.value,
    postcode: postcode.value, email: email.value, telefoon: telefoon.value,
    heeftRijbewijs: heeftRijbewijs.value, heeftAuto: heeftAuto.value,
    profielfoto: profielfoto.value, toonFotoOpCv: toonFotoOpCv.value,
    profieltekst: profieltekst.value, gekozenKleur: gekozenKleur.value,
    werkervaringen: werkervaringen.value,
    toonSterkePunten: toonSterkePunten.value, sterkePunten: sterkePunten.value,
    toonOpleidingen: toonOpleidingen.value, opleidingen: opleidingen.value,
    toonTalen: toonTalen.value, talen: talen.value
  });
}

watch(
  [voornaam, achternaam, adres, postcode, email, telefoon, profieltekst, gekozenKleur, werkervaringen, sterkePunten, toonSterkePunten, opleidingen, toonOpleidingen, heeftRijbewijs, heeftAuto, profielfoto, toonFotoOpCv, toonTalen, talen],
  () => { triggerOpslaan(); },
  { deep: true } 
)
</script>

<template>
  <div v-if="isLaden" class="volledig-scherm center-inhoud">
    <div class="loader"></div>
    <p style="margin-top: 15px; color: #4a5568; font-weight: 600;">Even geduld...</p>
  </div>

  <div v-else-if="!gebruiker" class="volledig-scherm center-inhoud inlog-achtergrond">
    <div class="inlog-box">
      <h1 style="color: #333; margin-bottom: 10px; font-size: 24px;">CVPortaal</h1>
      <div v-if="!linkVerstuurd">
        <p style="color: #718096; font-size: 14px; margin-bottom: 25px; line-height: 1.5;">Log in met een magische link.</p>
        <div class="form-groep" style="text-align: left;">
          <label>E-mailadres</label>
          <input type="email" v-model="loginEmail" placeholder="jouw@email.nl" @keyup.enter="loginMetLink">
        </div>
        <button class="hoofd-knop" style="width: 100%; margin-top: 15px;" @click="loginMetLink">Stuur inloglink</button>
      </div>
      <div v-else>
        <div style="font-size: 40px; margin-bottom: 15px;">✉️</div>
        <h2 style="color: #4A90E2; margin-bottom: 10px; font-size: 18px;">Check je mailbox!</h2>
        <p style="color: #718096; font-size: 14px;">Link gestuurd naar <strong>{{ loginEmail }}</strong></p>
      </div>
    </div>
  </div>

  <div v-else class="container relative">
    <div class="linkerkolom">
      
      <div class="app-header">
          <div class="app-logo-groep">
              <svg viewBox="0 0 24 24" fill="none" stroke="#4A90E2" stroke-width="2" width="28" height="28">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <h1 class="app-titel">CVPortaal. Je cv simpel & snel.</h1>
          </div>
          <div class="menu-container-header relative">
              <button class="tandwiel-knop" @click="toonMenu = !toonMenu">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
              </button>
              <div v-if="toonMenu" class="dropdown-menu-header">
                  <p class="dropdown-header">Ingelogd als {{ gebruiker.email }}</p>
                  <button class="dropdown-item" @click="resetMijnCV">⚠️ CV Leegmaken</button>
                  <button class="dropdown-item" @click="logMijUit">Uitloggen</button>
              </div>
          </div>
      </div>

      <h2 class="hoofdtitel" style="margin-top: 10px;">Kies je cv variant</h2>
      <div class="varianten-grid">
          <div class="variant-kaart actief">Basis</div>
          <div class="variant-kaart inactief">Klassiek</div>
          <div class="variant-kaart inactief">Modern</div>
      </div>

      <p style="font-size: 13px; font-weight:600; color:#718096; margin-bottom:8px;">Kies je kleur</p>
      <div class="kleur-kiezer">
          <div v-for="kleur in kleuren" :key="kleur" class="kleur-rondje" :class="{ actief: gekozenKleur === kleur }" :style="{ backgroundColor: kleur }" @click="veranderKleur(kleur)"></div>
      </div>

      <h2 class="hoofdtitel">Kies je cv onderdelen</h2>
      <div class="onderdelen-grid">
          <button class="onderdeel-knop" :class="{ 'knop-uit': !toonSterkePunten }" @click="toonSterkePunten = !toonSterkePunten">Mijn sterke punten</button>
          <button class="onderdeel-knop">Waar heb ik gewerkt?</button>
          <button class="onderdeel-knop" :class="{ 'knop-uit': !toonOpleidingen }" @click="toonOpleidingen = !toonOpleidingen">Welke opleiding of cursus heb ik gedaan?</button>
          <button class="onderdeel-knop" :class="{ 'knop-uit': !toonTalen }" @click="toonTalen = !toonTalen">Talen die ik spreek</button>
          <button class="onderdeel-knop">Dit vind ik leuk</button>
          <button class="onderdeel-knop">Meer over mij</button>
      </div>

      <h2 class="hoofdtitel">Mijn gegevens</h2>
      <div class="form-grid">
        <div class="form-groep"><label>Voornaam</label><input type="text" v-model="voornaam" placeholder="Je voornaam"></div>
        <div class="form-groep"><label>Achternaam</label><input type="text" v-model="achternaam" placeholder="Je achternaam"></div>
        <div class="form-groep"><label>Adres</label><input type="text" v-model="adres" placeholder="Je straat en huisnummer"></div>
        <div class="form-groep"><label>Postcode en plaats</label><input type="text" v-model="postcode" placeholder="Je postcode en plaats"></div>
        <div class="form-groep"><label>E-mail</label><input type="email" v-model="email" placeholder="Je e-mailadres"></div>
        <div class="form-groep"><label>Telefoon</label><input type="tel" v-model="telefoon" placeholder="Je telefoonnummer"></div>
        
        <div class="form-groep">
            <div class="foto-upload-sectie">
                <div class="foto-preview-container">
                    <div class="foto-preview" :style="{ backgroundImage: profielfoto ? `url(${profielfoto})` : '' }">
                        <svg v-if="!profielfoto" viewBox="0 0 24 24" fill="#cbd5e0" width="100" height="100"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    </div>
                    <div class="foto-acties">
                        <label class="foto-upload-knop"> {{ profielfoto ? 'Foto wijzigen' : 'Foto uploaden' }} <input type="file" accept="image/*" @change="verwerkFoto" style="display: none;"> </label>
                        <button v-if="profielfoto" class="foto-verwijder-knop" @click="verwijderFoto">Verwijder foto</button>
                    </div>
                </div>
                <div class="toggle-container" v-if="profielfoto" style="margin-top: 15px;">
                    <span class="toggle-label">Foto op cv tonen</span>
                    <label class="toggle-switch"><input type="checkbox" v-model="toonFotoOpCv"><span class="toggle-slider"></span></label>
                </div>
            </div>
        </div>

        <div class="form-groep">
            <label>Vervoer</label>
            <div class="toggle-container"><span class="toggle-label">Ik heb een rijbewijs</span><label class="toggle-switch"><input type="checkbox" v-model="heeftRijbewijs"><span class="toggle-slider"></span></label></div>
            <div class="toggle-container"><span class="toggle-label">Ik heb een eigen auto</span><label class="toggle-switch"><input type="checkbox" v-model="heeftAuto"><span class="toggle-slider"></span></label></div>
        </div>
      </div>

      <h2 class="hoofdtitel">Dit ben ik</h2>
      <div class="form-groep" style="margin-bottom: 20px;"><label>Vertel iets over jezelf</label><textarea v-model="profieltekst" rows="5" placeholder="Ik ben een enthousiaste werknemer..."></textarea></div>

      <div v-if="toonSterkePunten">
          <h2 class="hoofdtitel">Mijn sterke punten</h2>
          <div v-for="(punt, index) in sterkePunten" :key="index" style="display: flex; gap: 10px; margin-bottom: 10px; align-items: center;">
              <input type="text" v-model="punt.tekst" placeholder="Bijv. Klantvriendelijk" style="flex: 1; padding: 12px; border: 1px solid #cbd5e0; border-radius: 6px;">
              <button class="verwijder-knop-klein" @click="verwijderSterkPunt(index)">✕</button>
          </div>
          <button class="toevoeg-knop" @click="voegSterkPuntToe">+ Voeg een sterk punt toe</button>
      </div>

      <h2 class="hoofdtitel">Werkervaring</h2>
      <div v-for="(werk, index) in werkervaringen" :key="werk.id" class="dynamisch-blok">
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
                    <select v-model="werk.vanMaand" @change="sorteerErvaringen" style="width: 50%; padding: 12px; border: 1px solid #cbd5e0; border-radius: 6px; background: #f8fafc;">
                        <option value="">Maand</option>
                        <option v-for="m in 12" :key="m" :value="m">{{ m }}</option>
                    </select>
                    <input type="text" v-model.lazy="werk.vanJaar" @change="sorteerErvaringen" placeholder="Jaar (Bijv. 2020)" style="width: 50%;">
                </div>
            </div>

            <div class="form-groep">
                <label>Tot</label>
                <div style="display: flex; gap: 8px;" v-if="!werk.isHuidigeBaan">
                    <select v-model="werk.totMaand" @change="sorteerErvaringen" style="width: 50%; padding: 12px; border: 1px solid #cbd5e0; border-radius: 6px; background: #f8fafc;">
                        <option value="">Maand</option>
                        <option v-for="m in 12" :key="m" :value="m">{{ m }}</option>
                    </select>
                    <input type="text" v-model.lazy="werk.totJaar" @change="sorteerErvaringen" placeholder="Jaar (Bijv. 2023)" style="width: 50%;">
                </div>
                <div v-else style="display: flex; align-items: center; height: 46px; color: #718096; font-size: 14px; font-weight: 600;">
                    Heden
                </div>
            </div>

            <div class="form-groep volledige-breedte">
                <div class="toggle-container" style="justify-content: flex-start; gap: 10px;">
                    <label class="toggle-switch">
                        <input type="checkbox" v-model="werk.isHuidigeBaan" @change="sorteerErvaringen">
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
      <button class="toevoeg-knop" @click="voegWerkervaringToe">+ Voeg een werkervaring toe</button>

      <div v-if="toonOpleidingen">
          <h2 class="hoofdtitel">Opleidingen & cursussen</h2>
          <div v-for="(opl, index) in opleidingen" :key="opl.id" class="dynamisch-blok">
            <div style="display: flex; justify-content: flex-end; align-items: center; margin-bottom: 10px;">
                <button class="verwijder-knop" @click="verwijderOpleiding(index)">Verwijderen</button>
            </div>
            <div class="form-grid">
                
                <div class="form-groep volledige-breedte">
                    <label>Wat wil je toevoegen?</label>
                    <select v-model="opl.type" @change="triggerOpslaan" style="width: 100%; padding: 12px; border: 1px solid #cbd5e0; border-radius: 6px; background: #f8fafc; font-weight: 600; font-size: 14px;">
                        <option value="Opleiding">Opleiding</option>
                        <option value="Cursus">Cursus of praktijkverklaring</option>
                    </select>
                </div>

                <div class="form-groep volledige-breedte">
                    <label>{{ opl.type === 'Cursus' ? 'Naam cursus of verklaring' : 'Naam opleiding' }}</label>
                    <input type="text" v-model="opl.studie" :placeholder="opl.type === 'Cursus' ? 'Bijv. BHV of VCA' : 'Bijv. MBO Verkoopmedewerker'">
                </div>
                <div class="form-groep volledige-breedte">
                    <label>School of Instituut</label>
                    <input type="text" v-model="opl.instelling" placeholder="Bijv. ROC Amsterdam">
                </div>

                <div class="form-groep">
                    <label>Van</label>
                    <div style="display: flex; gap: 8px;">
                        <select v-model="opl.vanMaand" @change="sorteerOpleidingen" style="width: 50%; padding: 12px; border: 1px solid #cbd5e0; border-radius: 6px; background: #f8fafc;">
                            <option value="">Maand</option>
                            <option v-for="m in 12" :key="m" :value="m">{{ m }}</option>
                        </select>
                        <input type="text" v-model.lazy="opl.vanJaar" @change="sorteerOpleidingen" placeholder="Jaar (Bijv. 2018)" style="width: 50%;">
                    </div>
                </div>

                <div class="form-groep">
                    <label>Tot</label>
                    <div style="display: flex; gap: 8px;" v-if="!opl.isHuidigeOpleiding">
                        <select v-model="opl.totMaand" @change="sorteerOpleidingen" style="width: 50%; padding: 12px; border: 1px solid #cbd5e0; border-radius: 6px; background: #f8fafc;">
                            <option value="">Maand</option>
                            <option v-for="m in 12" :key="m" :value="m">{{ m }}</option>
                        </select>
                        <input type="text" v-model.lazy="opl.totJaar" @change="sorteerOpleidingen" placeholder="Jaar (Bijv. 2020)" style="width: 50%;">
                    </div>
                    <div v-else style="display: flex; align-items: center; height: 46px; color: #718096; font-size: 14px; font-weight: 600;">
                        Heden
                    </div>
                </div>

                <div class="form-groep volledige-breedte" v-if="!opl.isHuidigeOpleiding">
                    <div class="toggle-container" style="justify-content: flex-start; gap: 10px;">
                        <label class="toggle-switch">
                            <input type="checkbox" v-model="opl.isBehaald" @change="triggerOpslaan">
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
                            <input type="checkbox" v-model="opl.isHuidigeOpleiding" @change="sorteerOpleidingen">
                            <span class="toggle-slider"></span>
                        </label>
                        <span class="toggle-label" style="font-weight: 600;">Ik volg dit momenteel nog</span>
                    </div>
                </div>
            </div>
          </div>
          <button class="toevoeg-knop" @click="voegOpleidingToe">+ Voeg een opleiding of cursus toe</button>
      </div>

      <div v-if="toonTalen">
          <h2 class="hoofdtitel">Talen die ik spreek</h2>
          <div v-for="(taal, index) in talen" :key="taal.id" style="margin-bottom: 15px; padding: 15px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
              <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 10px;">
                  <input type="text" v-model="taal.naam" placeholder="Bijv. Engels of Spaans" style="flex: 1; padding: 12px; border: 1px solid #cbd5e0; border-radius: 6px; font-size: 14px;">
                  <button class="verwijder-knop-klein" @click="verwijderTaal(index)">✕</button>
              </div>
              
              <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 13px; font-weight: 600; color: #4a5568; min-width: 50px;">Niveau:</span>
                  <div style="display: flex; gap: 4px; cursor: pointer;">
                      <svg v-for="ster in 5" :key="ster" @click="zetTaalNiveau(taal, ster)" 
                           :fill="ster <= taal.niveau ? '#FFD700' : 'none'" 
                           stroke="#FFD700" viewBox="0 0 24 24" stroke-width="2" width="28" height="28" style="transition: all 0.2s;">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                  </div>
                  <span style="font-size: 12px; color: #718096; font-weight: 600; margin-left: 10px;">
                      {{ taal.niveau === 5 ? 'Moedertaal' : taal.niveau === 4 ? 'Vloeiend' : taal.niveau === 3 ? 'Goed' : taal.niveau === 2 ? 'Basis' : taal.niveau === 1 ? 'Beginner' : 'Kies je niveau' }}
                  </span>
              </div>
          </div>
          <button class="toevoeg-knop" @click="voegTaalToe">+ Voeg een taal toe</button>
      </div>

    </div>

    <div class="rechterkolom">
        <div class="cv-papier">
            <div class="cv-zijbalk" :style="{ backgroundColor: gekozenKleur }">
                <div v-if="profielfoto && toonFotoOpCv" class="cv-profielfoto" :style="{ backgroundImage: `url(${profielfoto})`, backgroundSize: 'cover' }"></div>
                <div v-else style="height: 40px;"></div>
                <div class="cv-sectie-titel-zijbalk">Mijn gegevens</div>
                <div class="cv-tekst-zijbalk">{{ adres || 'Adres' }}<br>{{ postcode || 'Plaats' }}</div>
                <div class="cv-tekst-zijbalk" style="margin-top: 12px;">{{ email || 'E-mail' }}<br>{{ telefoon || 'Telefoon' }}</div>
                <div v-if="heeftRijbewijs || heeftAuto" style="margin-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.3); padding-top: 15px;">
                    <div class="cv-tekst-zijbalk" v-if="heeftRijbewijs">✓ Rijbewijs B</div>
                    <div class="cv-tekst-zijbalk" v-if="heeftAuto">✓ Eigen auto</div>
                </div>

                <div v-if="toonTalen && talen.length > 0" style="margin-top: 25px; border-top: 1px solid rgba(255, 255, 255, 0.3); padding-top: 20px;">
                    <div class="cv-sectie-titel-zijbalk">Talen</div>
                    <div v-for="taal in talen" :key="taal.id" v-show="taal.naam" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span class="cv-tekst-zijbalk" style="margin-bottom: 0; font-weight: 600;">{{ taal.naam }}</span>
                        <div style="display: flex; gap: 3px;">
                            <svg v-for="ster in 5" :key="ster" :fill="ster <= taal.niveau ? '#FFD700' : 'none'" stroke="#FFD700" viewBox="0 0 24 24" stroke-width="1.5" width="14" height="14">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                        </div>
                    </div>
                </div>

            </div>
            <div class="cv-hoofdkolom">
                <div class="cv-naam">{{ voornaam || 'Jouw' }} {{ achternaam || 'Naam' }}</div>
                
                <div class="cv-sectie-titel-hoofd" :style="{ color: gekozenKleur }">Dit ben ik</div>
                <p class="cv-p">{{ profieltekst || 'Jouw profieltekst...' }}</p>
                
                <div v-if="toonSterkePunten && sterkePunten.length > 0">
                    <div class="cv-sectie-titel-hoofd" :style="{ color: gekozenKleur }">Mijn sterke punten</div>
                    <ul class="cv-lijst"><li v-for="p in sterkePunten" v-show="p.tekst">{{ p.tekst }}</li></ul>
                </div>
                
                <div class="cv-sectie-titel-hoofd" :style="{ color: gekozenKleur }">Werkervaring</div>
                <div v-if="werkervaringen.length === 0"><p class="cv-p-italic">Nog geen werkervaring toegevoegd.</p></div>
                <div v-for="w in werkervaringen" :key="w.id" class="cv-item">
                    <div class="cv-item-titel">{{ w.functie || 'Functie' }}</div>
                    <div class="cv-item-sub">
                            {{ o.instelling || 'School of Instituut' }} | 
                            <span v-if="o.vanMaand && o.vanJaar">{{ o.vanMaand.toString().padStart(2, '0') }}/{{ o.vanJaar }}</span>
                            <span v-if="o.isHuidigeOpleiding"> - Heden</span>
                            <span v-else-if="o.totMaand && o.totJaar"> - {{ o.totMaand.toString().padStart(2, '0') }}/{{ o.totJaar }}</span>
                            
                            <span v-if="!o.isHuidigeOpleiding && o.isBehaald" style="font-weight: 700; margin-left: 5px;">
                                | <span :style="{ color: gekozenKleur }">✓</span> {{ o.type === 'Cursus' ? 'Certificaat' : 'Diploma' }}
                            </span>
                        </div>
                    <p class="cv-p">{{ w.omschrijving }}</p>
                </div>

                <div v-if="toonOpleidingen && opleidingen.length > 0">
                    <div class="cv-sectie-titel-hoofd" :style="{ color: gekozenKleur }">Opleidingen en cursussen</div>
                    <div v-for="o in opleidingen" :key="o.id" class="cv-item">
                        <div class="cv-item-titel">{{ o.studie || 'Opleiding of cursus' }}</div>
                        <div class="cv-item-sub">
                            {{ o.instelling || 'School of Instituut' }} | 
                            <span v-if="o.vanMaand && o.vanJaar">{{ o.vanMaand.toString().padStart(2, '0') }}/{{ o.vanJaar }}</span>
                            <span v-if="o.isHuidigeOpleiding"> - Heden</span>
                            <span v-else-if="o.totMaand && o.totJaar"> - {{ o.totMaand.toString().padStart(2, '0') }}/{{ o.totJaar }}</span>
                            
                            <span v-if="!o.isHuidigeOpleiding && o.isBehaald" style="font-weight: 700; margin-left: 5px;">
                                | <span :style="{ color: gekozenKleur }">✓</span> {{ o.type === 'Cursus' ? 'Certificaat' : 'Diploma' }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
body { background-color: #f5f7fb; overflow-x: hidden; color: #333; }

/* LAYOUT STRUCTUUR */
.volledig-scherm { height: 100vh; width: 100vw; display: flex; flex-direction: column; }
.center-inhoud { justify-content: center; align-items: center; text-align: center; }
.container { display: flex; height: 100vh; }
.relative { position: relative; }
.inlog-achtergrond { background-color: #DBEAFE; }
.inlog-box { background: white; padding: 40px; border-radius: 12px; width: 100%; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }

/* HEADER & MENU */
.app-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #edf2f7; padding-bottom: 20px; margin-bottom: 20px; }
.app-logo-groep { display: flex; align-items: center; gap: 10px; }
.app-titel { font-size: 20px; font-weight: 800; color: #1a202c; letter-spacing: -0.5px; margin: 0; }
.menu-container-header { position: relative; }
.tandwiel-knop { background: white; border: 1px solid #e2e8f0; border-radius: 50%; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center; cursor: pointer; transition: transform 0.3s, border-color 0.2s; color: #4a5568;}
.tandwiel-knop:hover { transform: rotate(45deg); border-color: #4A90E2; color: #4A90E2; }
.dropdown-menu-header { position: absolute; top: 50px; right: 0; background: white; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); width: 220px; z-index: 100; border: 1px solid #e2e8f0; text-align: left; }
.dropdown-header { padding: 15px; background: #f8fafc; font-size: 12px; color: #718096; border-bottom: 1px solid #e2e8f0; word-break: break-all; margin: 0;}
.dropdown-item { width: 100%; text-align: left; background: none; border: none; padding: 12px 15px; font-size: 13px; font-weight: 600; cursor: pointer; color: #4a5568; transition: background 0.2s;}
.dropdown-item:hover { background: #edf2f7; color: #1a202c;}

/* FORMULIER & LINKERKOLOM */
.linkerkolom { width: 50%; padding: 40px; background: white; overflow-y: auto; border-right: 1px solid #e2e8f0; }
.hoofdtitel { font-size: 16px; font-weight: 700; color: #4a5568; text-transform: uppercase; margin-top: 30px; margin-bottom: 15px; letter-spacing: 0.5px; }

/* VARIANTEN EN KLEUREN */
.varianten-grid { display: flex; gap: 15px; margin-bottom: 20px; }
.variant-kaart { flex: 1; border: 2px solid #edf2f7; border-radius: 6px; padding: 15px; text-align: center; cursor: pointer; font-size: 12px; font-weight: 600; color: #a0aec0; background-color: #fafbfe; }
.variant-kaart.actief { border-color: #4A90E2; color: #4A90E2; background-color: #ffffff; }
.variant-kaart.inactief { opacity: 0.5; cursor: not-allowed; background-color: #f8fafc; border-color: #e2e8f0; color: #cbd5e0; }

.kleur-kiezer { display: flex; gap: 10px; margin-bottom: 25px; flex-wrap: wrap; text-align: center; }
.kleur-rondje { width: 24px; height: 24px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: transform 0.1s ease; }
.kleur-rondje:hover { transform: scale(1.1); }
.kleur-rondje.actief { border-color: #333; }

/* ONDERDELEN KNOPPEN */
.onderdelen-grid { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 30px; border-bottom: 2px solid #edf2f7; padding-bottom: 25px; }
.onderdeel-knop { background: #4A90E2; color: white; border: none; padding: 10px 18px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background-color 0.2s; }
.onderdeel-knop:hover { background-color: #357ABD; }
.knop-uit { background: #e2e8f0; color: #a0aec0; }
.knop-uit:hover { background: #cbd5e0; }

/* GRID & INPUTS */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;}
.volledige-breedte { grid-column: span 2; }
.form-groep label { display: block; margin-bottom: 8px; font-size: 13px; font-weight: 600; color: #4a5568; text-align: left;}
.form-groep input, .form-groep textarea { width: 100%; padding: 12px; border: 1px solid #cbd5e0; border-radius: 6px; font-size: 14px; background: #f8fafc; transition: all 0.2s;}
.form-groep input:focus, .form-groep textarea:focus { border-color: #4A90E2; outline: none; background: white; }

/* TOGGLES (SCHUIFJES) */
.toggle-container { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; }
.toggle-label { font-size: 14px; color: #4a5568; }
.toggle-switch { position: relative; display: inline-block; width: 44px; height: 24px; }
.toggle-switch input { opacity: 0; width: 0; height: 0; }
.toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e0; transition: .3s; border-radius: 24px; }
.toggle-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
.toggle-switch input:checked + .toggle-slider { background-color: #4A90E2; }
.toggle-switch input:checked + .toggle-slider:before { transform: translateX(20px); }

/* FOTO UPLOAD */
.foto-upload-sectie { display: flex; flex-direction: column; gap: 10px; }
.foto-preview-container { display: flex; align-items: center; gap: 20px; }
.foto-preview { width: 110px; height: 110px; border-radius: 50%; background-color: #f8fafc; border: 2px dashed #cbd5e0; background-size: cover; background-position: center; display: flex; justify-content: center; align-items: center; overflow: hidden; }
.foto-acties { display: flex; flex-direction: column; gap: 5px; }
.foto-upload-knop { color: #4A90E2; font-size: 13px; font-weight: 600; cursor: pointer; transition: color 0.2s; }
.foto-upload-knop:hover { color: #2b6cb0; text-decoration: underline; }
.foto-verwijder-knop { background: none; border: none; color: #e53e3e; font-size: 13px; font-weight: 600; cursor: pointer; text-align: left; padding: 0; }
.foto-verwijder-knop:hover { text-decoration: underline; }

/* DYNAMISCHE BLOKKEN EN ALGEMENE KNOPPEN */
.dynamisch-blok { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
.hoofd-knop { background: #4A90E2; color: white; border: none; padding: 12px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
.toevoeg-knop { background: white; color: #4A90E2; border: 2px dashed #4A90E2; padding: 12px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; width: 100%; margin-top: 10px; margin-bottom: 30px; transition: 0.2s;}.toevoeg-knop:hover { background: #eff6ff;}
.toevoeg-knop-sec { background: transparent; color: #4A90E2; border: none; font-size: 13px; font-weight: 600; cursor: pointer; }
.verwijder-knop { background: none; border: none; color: #e53e3e; font-size: 12px; font-weight: 600; cursor: pointer; }
.verwijder-knop:hover { text-decoration: underline; }
.verwijder-knop-klein { background: #fee2e2; border: none; color: #e53e3e; width: 42px; height: 44px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px;}

/* CV PAPIER RECHTERKOLOM */
.rechterkolom { width: 50%; padding: 40px; background: #DBEAFE; display: flex; justify-content: center; align-items: flex-start; overflow-y: auto; }
.cv-papier { width: 210mm; min-width: 210mm; height: 297mm; background: white; display: flex; box-shadow: 0 10px 30px rgba(0,0,0,0.15); flex-shrink: 0; transition: transform 0.4s ease-in-out, margin-bottom 0.4s ease-in-out;}
.cv-zijbalk { width: 35%; color: white; padding: 40px 25px; transition: background-color 0.3s ease; text-align: left; }
.cv-hoofdkolom { width: 65%; padding: 40px 35px; text-align: left; }
.cv-profielfoto { width: 130px; height: 130px; background-color: #e2e8f0; border-radius: 50%; margin: 0 auto 30px auto; border: 4px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.cv-sectie-titel-zijbalk { font-size: 13px; font-weight: 700; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid rgba(255, 255, 255, 0.3); padding-bottom: 5px; }
.cv-tekst-zijbalk { font-size: 12px; margin-bottom: 12px; line-height: 1.4; }
.cv-naam { font-size: 32px; font-weight: 700; text-transform: uppercase; text-align: center; margin-bottom: 25px; color: #333; letter-spacing: 1px;}
.cv-sectie-titel-hoofd { font-size: 14px; font-weight: 700; text-transform: uppercase; border-bottom: 2px solid #edf2f7; padding-bottom: 5px; margin-top: 25px; margin-bottom: 10px; letter-spacing: 1px; transition: color 0.3s ease;}
.cv-item { margin-bottom: 20px; }
.cv-item-titel { font-size: 14px; font-weight: 700; color: #333; }
.cv-item-sub { font-size: 13px; font-weight: 600; color: #718096; margin-bottom: 4px; }
.cv-p { font-size: 13px; line-height: 1.5; color: #4a5568; }
.cv-p-italic { font-size: 13px; color: #a0aec0; font-style: italic; margin-bottom: 20px;}
.cv-lijst { padding-left: 20px; margin-bottom: 25px; font-size: 13px; color: #4a5568; line-height: 1.6; }

/* WYSIWYG SCHALING */
@media (max-width: 1700px) and (min-width: 1367px) {
    .rechterkolom { overflow-x: hidden; }
    .cv-papier { transform: scale(0.85); transform-origin: top center; margin-bottom: -170px; }
}
@media (max-width: 1366px) and (min-width: 1025px) {
    .rechterkolom { overflow-x: hidden; }
    .cv-papier { transform: scale(0.70); transform-origin: top center; margin-bottom: -340px; }
}
@media (max-width: 1024px) {
    .container { flex-direction: column; height: auto; }
    .linkerkolom { width: 100%; padding: 20px; }
    .rechterkolom { width: 100%; padding: 20px; overflow: hidden; } 
    .cv-papier { transform: scale(0.85); transform-origin: top center; margin-bottom: -170px; }
    .menu-container-header { position: absolute; right: 20px; top: 20px; } 
}
@media (max-width: 600px) {
    .form-grid { grid-template-columns: 1fr; } 
    .volledige-breedte { grid-column: span 1; }
    .rechterkolom { padding: 10px; } 
    .cv-papier { transform: scale(0.44); transform-origin: top center; margin-bottom: -630px; }
}

/* LOADER */
.loader { border: 4px solid #f3f3f3; border-top: 4px solid #4A90E2; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>