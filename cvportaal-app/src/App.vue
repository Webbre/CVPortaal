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
const werkervaringen = ref([])
const toonSterkePunten = ref(true)
const sterkePunten = ref([])

const kleuren = [
  '#4A90E2', '#E24A4A', '#2ECC71', '#9B59B6', '#F1C40F',
  '#E67E22', '#FF85A2', '#1ABC9C', '#34495E'
]

// --- LIFECYCLE & INLOG LOGICA ---
onMounted(async () => {
  try {
    // 1. Check direct of iemand via een magische link de app opent
    await voltooiInloggen();
  } catch (error) {
    console.error("Fout bij voltooiInloggen:", error);
  }

  // 2. Luister constant of we ingelogd zijn of niet
  luisterNaarInlogStatus(async (user) => {
    try {
      if (user) {
        gebruiker.value = user;
        
        // Haal bewaarde gegevens op uit de kluis
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
          werkervaringen.value = data.werkervaringen || [];
          toonSterkePunten.value = data.toonSterkePunten !== undefined ? data.toonSterkePunten : true;
          sterkePunten.value = data.sterkePunten || [];
        }
      } else {
        gebruiker.value = null;
        maakCvLeeg(false);
      }
    } catch (error) {
      console.error("Fout bij het inladen van de CV-gegevens:", error);
    } finally {
      isLaden.value = false; // Schakel de preloader ALTIJD uit, ook bij een fout!
    }
  });
})

// Actie: Verstuur inloglink
async function loginMetLink() {
  if (!loginEmail.value) return;
  isLaden.value = true;
  try {
    await stuurInlogLink(loginEmail.value);
    linkVerstuurd.value = true;
  } catch (error) {
    console.error("Firebase Auth Fout:", error);
    alert("Er ging iets mis: " + error.message);
  } finally {
    isLaden.value = false; // Schakel de preloader ALTIJD uit
  }
}

// Actie: Uitloggen
async function logMijUit() {
  toonMenu.value = false;
  isLaden.value = true;
  await logUit();
}

// Actie: Reset CV (Maakt alles leeg na waarschuwing)
function resetMijnCV() {
  toonMenu.value = false;
  if (confirm("Weet je zeker dat je helemaal opnieuw wilt beginnen? Al je ingevulde gegevens worden permanent gewist!")) {
    maakCvLeeg(true);
  }
}

// Hulpfunctie om variabelen lokaal leeg te maken
function maakCvLeeg(forceerDatabaseOpslag = false) {
  voornaam.value = ''; achternaam.value = ''; adres.value = ''; postcode.value = '';
  email.value = ''; telefoon.value = ''; profieltekst.value = '';
  heeftRijbewijs.value = false; heeftAuto.value = false; profielfoto.value = null;
  gekozenKleur.value = '#4A90E2'; werkervaringen.value = [];
  toonSterkePunten.value = true; sterkePunten.value = [];
  
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
function voegWerkervaringToe() { werkervaringen.value.push({ functie: '', bedrijf: '', periode: '', omschrijving: '' }) }
function verwijderWerkervaring(index) { werkervaringen.value.splice(index, 1) }
function voegSterkPuntToe() { sterkePunten.value.push({ tekst: '' }) }
function verwijderSterkPunt(index) { sterkePunten.value.splice(index, 1) }

// Database trigger
function triggerOpslaan() {
  if (!gebruiker.value || isLaden.value) return; // Sla niet op tijdens het inladen
  slaGegevensOp({
    voornaam: voornaam.value, achternaam: achternaam.value, adres: adres.value,
    postcode: postcode.value, email: email.value, telefoon: telefoon.value,
    heeftRijbewijs: heeftRijbewijs.value, heeftAuto: heeftAuto.value,
    profielfoto: profielfoto.value, toonFotoOpCv: toonFotoOpCv.value,
    profieltekst: profieltekst.value, gekozenKleur: gekozenKleur.value,
    werkervaringen: werkervaringen.value, toonSterkePunten: toonSterkePunten.value,
    sterkePunten: sterkePunten.value
  });
}

// Houd alle wijzigingen in de gaten om realtime op te slaan
watch(
  [voornaam, achternaam, adres, postcode, email, telefoon, profieltekst, gekozenKleur, werkervaringen, heeftRijbewijs, heeftAuto, profielfoto, toonFotoOpCv, toonSterkePunten, sterkePunten],
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
        <p style="color: #718096; font-size: 14px; margin-bottom: 25px; line-height: 1.5;">
          Log in of maak een account aan met een magische link. Geen wachtwoord nodig!
        </p>
        <div class="form-groep" style="text-align: left;">
          <label>E-mailadres</label>
          <input type="email" v-model="loginEmail" placeholder="jouw@email.nl" @keyup.enter="loginMetLink">
        </div>
        <button class="hoofd-knop" style="width: 100%; margin-top: 15px;" @click="loginMetLink">Stuur inloglink</button>
      </div>

      <div v-else>
        <div style="font-size: 40px; margin-bottom: 15px;">✉️</div>
        <h2 style="color: #4A90E2; margin-bottom: 10px; font-size: 18px;">Check je mailbox!</h2>
        <p style="color: #718096; font-size: 14px; line-height: 1.5;">
          We hebben een magische link gestuurd naar <strong>{{ loginEmail }}</strong>.<br>Klik op de link in de mail om in te loggen.
        </p>
      </div>
    </div>
  </div>

  <div v-else class="container relative">
    
    <div class="menu-container">
        <button class="tandwiel-knop" @click="toonMenu = !toonMenu" title="Instellingen">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
        </button>
        <div v-if="toonMenu" class="dropdown-menu">
            <p class="dropdown-header">Ingelogd als<br><strong>{{ gebruiker.email }}</strong></p>
            <button class="dropdown-item" @click="resetMijnCV">⚠️ CV Leegmaken</button>
            <button class="dropdown-item" @click="logMijUit">Uitloggen</button>
        </div>
    </div>

    <div class="linkerkolom">
      
      <h2 class="hoofdtitel">Kies je cv variant</h2>
      <div class="varianten-grid">
          <div class="variant-kaart actief">Elin Baanzicht<br>(Basis)</div>
          <div class="variant-kaart">Klassiek<br>(Zonder Balk)</div>
          <div class="variant-kaart">Modern<br>(Gekleurd)</div>
      </div>

      <p style="font-size: 13px; font-weight:600; color:#718096; margin-bottom:8px;">Kies je kleur</p>
      <div class="kleur-kiezer">
          <div v-for="kleur in kleuren" :key="kleur" class="kleur-rondje"
            :class="{ actief: gekozenKleur === kleur }" :style="{ backgroundColor: kleur }"
            @click="veranderKleur(kleur)"></div>
      </div>

      <h2 class="hoofdtitel">Kies je cv onderdelen</h2>
      <div class="onderdelen-grid">
          <button class="onderdeel-knop" :style="toonSterkePunten ? {} : { backgroundColor: '#e2e8f0', color: '#a0aec0' }" @click="toonSterkePunten = !toonSterkePunten">Mijn sterke punten</button>
          <button class="onderdeel-knop">Waar heb ik gewerkt?</button>
          <button class="onderdeel-knop">Welke opleidingen of cursus heb ik gedaan?</button>
          <button class="onderdeel-knop">Talen die ik spreek</button>
          <button class="onderdeel-knop">Dit vind ik leuk</button>
          <button class="onderdeel-knop">Meer over mij</button>
      </div>

      <h2 class="hoofdtitel">Mijn Gegevens</h2>
      <div class="form-grid">
        <div class="form-groep"><label>Voornaam</label><input type="text" v-model="voornaam" placeholder="Bijv. Elin"></div>
        <div class="form-groep"><label>Achternaam</label><input type="text" v-model="achternaam" placeholder="Bijv. Baanzicht"></div>
        <div class="form-groep"><label>Adres</label><input type="text" v-model="adres" placeholder="Straat en huisnummer"></div>
        <div class="form-groep"><label>Postcode en Plaats</label><input type="text" v-model="postcode" placeholder="Bijv. 1234 AB Amsterdam"></div>
        <div class="form-groep"><label>E-mail</label><input type="email" v-model="email" placeholder="jouwadres@mail.com"></div>
        <div class="form-groep"><label>Telefoon</label><input type="tel" v-model="telefoon" placeholder="06 - 12345678"></div>
        
        <div class="form-groep">
            <div class="foto-upload-sectie">
                <div class="foto-preview-container">
                    <div class="foto-preview" :style="{ backgroundImage: profielfoto ? `url(${profielfoto})` : '' }">
                        <svg v-if="!profielfoto" viewBox="0 0 24 24" fill="#cbd5e0" width="100" height="100">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                    </div>
                    <div class="foto-acties">
                        <label class="foto-upload-knop">
                            {{ profielfoto ? 'Foto wijzigen' : 'Foto uploaden' }}
                            <input type="file" accept="image/*" @change="verwerkFoto" style="display: none;">
                        </label>
                        <button v-if="profielfoto" class="foto-verwijder-knop" @click="verwijderFoto">Verwijder foto</button>
                    </div>
                </div>

                <div class="toggle-container" v-if="profielfoto" style="margin-top: 15px;">
                    <span class="toggle-label">Foto op cv tonen</span>
                    <label class="toggle-switch">
                        <input type="checkbox" v-model="toonFotoOpCv">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
        </div>

        <div class="form-groep">
            <label>Vervoer</label>
            <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 10px;">
                <div class="toggle-container">
                    <span class="toggle-label">Ik heb een rijbewijs</span>
                    <label class="toggle-switch">
                        <input type="checkbox" v-model="heeftRijbewijs">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="toggle-container">
                    <span class="toggle-label">Ik heb een eigen auto</span>
                    <label class="toggle-switch">
                        <input type="checkbox" v-model="heeftAuto">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
        </div>
      </div>

      <h2 class="hoofdtitel">Dit ben ik</h2>
      <div class="form-groep" style="margin-bottom: 20px;">
          <label>Vertel iets over jezelf</label>
          <textarea v-model="profieltekst" rows="5" placeholder="Ik ben een enthousiaste werknemer..."></textarea>
      </div>

      <div v-if="toonSterkePunten">
          <h2 class="hoofdtitel">Mijn sterke punten</h2>
          <div v-for="(punt, index) in sterkePunten" :key="index" style="display: flex; gap: 10px; margin-bottom: 10px; align-items: center;">
              <input type="text" v-model="punt.tekst" placeholder="Bijv. Klantvriendelijk of Flexibel" style="flex: 1; padding: 12px; border: 1px solid #cbd5e0; border-radius: 6px; font-size: 14px;">
              <button class="verwijder-knop" @click="verwijderSterkPunt(index)" style="background: #fee2e2; width: 42px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 16px; height: 44px;">✕</button>
          </div>
          <button class="toevoeg-knop" style="margin-bottom: 20px;" @click="voegSterkPuntToe">+ Voeg sterk punt toe</button>
      </div>

      <h2 class="hoofdtitel">Werkervaring</h2>
      <div v-for="(werk, index) in werkervaringen" :key="index" class="dynamisch-blok">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <strong style="font-size: 14px; color: #4A90E2;">Ervaring {{ index + 1 }}</strong>
            <button class="verwijder-knop" @click="verwijderWerkervaring(index)">Verwijderen</button>
        </div>
        <div class="form-grid">
            <div class="form-groep volledige-breedte"><label>Functie</label><input type="text" v-model="werk.functie" placeholder="Bijv. Verkoopmedewerker"></div>
            <div class="form-groep"><label>Bedrijf of Organisatie</label><input type="text" v-model="werk.bedrijf" placeholder="Bijv. Supermarkt De Boer"></div>
            <div class="form-groep"><label>Periode</label><input type="text" v-model="werk.periode" placeholder="Bijv. 2020 - Heden"></div>
            <div class="form-groep volledige-breedte"><label>Korte Omschrijving</label><textarea v-model="werk.omschrijving" rows="3" placeholder="Wat waren je taken?"></textarea></div>
        </div>
      </div>

      <button class="toevoeg-knop" @click="voegWerkervaringToe">+ Voeg werkervaring toe</button>

    </div>

    <div class="rechterkolom">
        <div class="cv-papier">
            
            <div class="cv-zijbalk" :style="{ backgroundColor: gekozenKleur }">
                
                <div v-if="profielfoto && toonFotoOpCv" class="cv-profielfoto" :style="{ backgroundImage: `url(${profielfoto})`, backgroundSize: 'cover', backgroundPosition: 'center' }"></div>
                <div v-else style="height: 40px;"></div>

                <div class="cv-sectie-titel-zijbalk">Mijn Gegevens</div>
                <div class="cv-tekst-zijbalk">{{ adres || 'Jouw adres' }}</div>
                <div class="cv-tekst-zijbalk">{{ postcode || 'Postcode & Plaats' }}</div>
                <div class="cv-tekst-zijbalk" style="margin-top: 12px;">{{ email || 'E-mailadres' }}</div>
                <div class="cv-tekst-zijbalk">{{ telefoon || 'Telefoonnummer' }}</div>

                <div v-if="heeftRijbewijs || heeftAuto" style="margin-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.3); padding-top: 15px;">
                    <div class="cv-tekst-zijbalk" v-if="heeftRijbewijs" style="font-weight: 600;">✓ Rijbewijs B</div>
                    <div class="cv-tekst-zijbalk" v-if="heeftAuto" style="font-weight: 600;">✓ In bezit van auto</div>
                </div>
            </div>

            <div class="cv-hoofdkolom">
                <div class="cv-naam" style="margin-bottom: 25px;">{{ voornaam || 'Jouw' }} {{ achternaam || 'Naam' }}</div>
                
                <div class="cv-sectie-titel-hoofd" :style="{ color: gekozenKleur }">Dit ben ik</div>
                <p style="font-size: 13px; line-height: 1.6; color: #4a5568;">
                    {{ profieltekst || 'Hier verschijnt straks automatisch jouw profieltekst...' }}
                </p>
                
                <div v-if="toonSterkePunten && sterkePunten.length > 0">
                    <div class="cv-sectie-titel-hoofd" :style="{ color: gekozenKleur }">Mijn sterke punten</div>
                    <ul style="padding-left: 20px; margin-bottom: 25px; font-size: 13px; color: #4a5568; line-height: 1.6;">
                        <li v-for="(punt, index) in sterkePunten" :key="index" v-show="punt.tekst">
                            {{ punt.tekst }}
                        </li>
                    </ul>
                </div>
                
                <div class="cv-sectie-titel-hoofd" :style="{ color: gekozenKleur }">Werkervaring</div>
                <div v-if="werkervaringen.length === 0">
                    <p style="font-size: 13px; color: #a0aec0; font-style: italic; margin-bottom: 20px;">Nog geen werkervaring toegevoegd.</p>
                </div>
                <div v-else>
                    <div v-for="(werk, index) in werkervaringen" :key="index" style="margin-bottom: 20px;">
                        <div style="font-weight: 700; font-size: 14px; color: #333;">{{ werk.functie || 'Vul functie in' }}</div>
                        <div style="font-size: 13px; font-weight: 600; color: #718096; margin-bottom: 4px;">{{ werk.bedrijf || 'Bedrijfsnaam' }} | {{ werk.periode || 'Periode' }}</div>
                        <p style="font-size: 13px; line-height: 1.5; color: #4a5568;">{{ werk.omschrijving }}</p>
                    </div>
                </div>

                <div class="cv-sectie-titel-hoofd" :style="{ color: gekozenKleur }">Opleiding, cursus en certificaten</div>
                <p style="font-size: 13px; color: #a0aec0; font-style: italic;">Nog geen opleiding toegevoegd.</p>
            </div>
            
        </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', system-ui, sans-serif; }
body { background-color: #f5f7fb; color: #333; overflow-x: hidden; }

/* NIEUW: LAYOUT STRUCTUUR */
.volledig-scherm { height: 100vh; width: 100vw; display: flex; flex-direction: column; }
.center-inhoud { justify-content: center; align-items: center; text-align: center; }
.relative { position: relative; }
.container { display: flex; height: 100vh; }

/* NIEUW: INLOG SCHERM STYLING */
.inlog-achtergrond { background-color: #DBEAFE; }
.inlog-box { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); width: 100%; max-width: 400px; }
.hoofd-knop { background-color: #4A90E2; color: white; border: none; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background-color 0.2s; }
.hoofd-knop:hover { background-color: #357ABD; }

/* NIEUW: TANDWIEL MENU */
.menu-container { position: absolute; top: 20px; right: 20px; z-index: 100; }
.tandwiel-knop { background: white; border: 1px solid #e2e8f0; border-radius: 50%; width: 45px; height: 45px; display: flex; justify-content: center; align-items: center; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.05); transition: transform 0.3s; color: #4a5568; }
.tandwiel-knop:hover { transform: rotate(45deg); color: #4A90E2; }
.dropdown-menu { position: absolute; top: 55px; right: 0; background: white; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); width: 220px; overflow: hidden; border: 1px solid #e2e8f0; text-align: left; }
.dropdown-header { padding: 15px; background: #f8fafc; font-size: 12px; color: #718096; border-bottom: 1px solid #e2e8f0; word-break: break-all; }
.dropdown-item { width: 100%; text-align: left; background: none; border: none; padding: 12px 15px; font-size: 13px; font-weight: 600; color: #4a5568; cursor: pointer; transition: background 0.2s; }
.dropdown-item:hover { background: #edf2f7; color: #1a202c; }

/* NIEUW: LAAD SPINNER */
.loader { border: 4px solid #f3f3f3; border-top: 4px solid #4A90E2; border-radius: 50%; width: 40px; height: 40px; animation: draai 1s linear infinite; }
@keyframes draai { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* BESTAANDE CSS (Invoer kolommen en CV weergave) */
.linkerkolom { width: 50%; padding: 40px; background-color: #ffffff; overflow-y: auto; border-right: 1px solid #e2e8f0; }
.hoofdtitel { font-size: 18px; font-weight: 700; color: #4a5568; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 30px; margin-bottom: 15px; }

.varianten-grid { display: flex; gap: 15px; margin-bottom: 20px; }
.variant-kaart { flex: 1; border: 2px solid #edf2f7; border-radius: 6px; padding: 15px; text-align: center; cursor: pointer; font-size: 12px; font-weight: 600; color: #a0aec0; background-color: #fafbfe; }
.variant-kaart.actief { border-color: #4A90E2; color: #4A90E2; background-color: #ffffff; }

.kleur-kiezer { display: flex; gap: 10px; margin-bottom: 25px; flex-wrap: wrap; text-align: center; }
.kleur-rondje { width: 24px; height: 24px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: transform 0.1s ease; }
.kleur-rondje:hover { transform: scale(1.1); }
.kleur-rondje.actief { border-color: #333; }

.onderdelen-grid { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 30px; border-bottom: 2px solid #edf2f7; padding-bottom: 25px; }
.onderdeel-knop { background-color: #4A90E2; color: white; border: none; padding: 10px 18px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background-color 0.2s; }
.onderdeel-knop:hover { background-color: #357ABD; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
.volledige-breedte { grid-column: span 2; }
.form-groep label { display: block; margin-bottom: 8px; color: #4a5568; font-size: 13px; font-weight: 600; text-align: left; }
.form-groep input[type="text"], .form-groep input[type="email"], .form-groep input[type="tel"], .form-groep textarea { width: 100%; padding: 12px; border: 1px solid #cbd5e0; border-radius: 6px; font-size: 14px; background-color: #f8fafc; transition: border-color 0.2s, background-color 0.2s; }
.form-groep input:focus, .form-groep textarea:focus { outline: none; border-color: #4A90E2; background-color: #ffffff; }

/* MODERNE TOGGLES (Schuifjes) */
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

.dynamisch-blok { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
.toevoeg-knop { background-color: transparent; color: #4A90E2; border: 2px dashed #4A90E2; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; width: 100%; margin-bottom: 30px; transition: all 0.2s; }
.toevoeg-knop:hover { background-color: #eff6ff; }
.verwijder-knop { background-color: transparent; color: #e53e3e; border: none; font-size: 12px; font-weight: 600; cursor: pointer; }
.verwijder-knop:hover { text-decoration: underline; }

/* CV RECHTERKOLOM */
.rechterkolom { width: 50%; padding: 40px; background-color: #DBEAFE; display: flex; justify-content: center; align-items: flex-start; overflow-y: auto; }
.cv-papier { width: 210mm; min-width: 210mm; height: 297mm; background-color: white; box-shadow: 0 10px 30px rgba(0,0,0,0.15); padding: 0; overflow: hidden; display: flex; flex-shrink: 0; transition: transform 0.4s ease-in-out, margin-bottom 0.4s ease-in-out; }
.cv-zijbalk { width: 35%; color: white; padding: 40px 25px; transition: background-color 0.3s ease; text-align: left; }
.cv-hoofdkolom { width: 65%; background-color: white; padding: 40px 35px; text-align: left; }
.cv-profielfoto { width: 130px; height: 130px; background-color: #e2e8f0; border-radius: 50%; margin: 0 auto 30px auto; border: 4px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.cv-sectie-titel-zijbalk { font-size: 13px; font-weight: 700; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid rgba(255, 255, 255, 0.3); padding-bottom: 5px; }
.cv-sectie-titel-hoofd { font-size: 14px; font-weight: 700; margin-bottom: 10px; margin-top: 25px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #edf2f7; padding-bottom: 5px; transition: color 0.3s ease; }
.cv-tekst-zijbalk { font-size: 12px; margin-bottom: 12px; line-height: 1.4; }
.cv-naam { font-size: 32px; font-weight: 700; color: #333; text-transform: uppercase; letter-spacing: 1px; text-align: center; }

/* RESPONSIVE DESIGN & WYSIWYG CV SCHALING */
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
    .menu-container { position: fixed; top: 15px; right: 15px; } /* Vast in hoekje op mobiel */
}
@media (max-width: 600px) {
    .form-grid { grid-template-columns: 1fr; } 
    .volledige-breedte { grid-column: span 1; }
    .rechterkolom { padding: 10px; } 
    .cv-papier { transform: scale(0.44); transform-origin: top center; margin-bottom: -630px; }
}
</style>