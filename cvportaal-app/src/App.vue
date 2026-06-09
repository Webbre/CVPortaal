<script setup>
import { ref, watch } from 'vue'
import { slaGegevensOp } from './databaseService.js'

// 1. Basisgegevens
const voornaam = ref('')
const achternaam = ref('')
const adres = ref('')
const postcode = ref('')
const email = ref('')
const telefoon = ref('')
const profieltekst = ref('')

// Vervoer en Profielfoto
const heeftRijbewijs = ref(false)
const heeftAuto = ref(false)
const profielfoto = ref(null)

// Functie om de gekozen foto in te laden
function verwerkFoto(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      profielfoto.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// 2. Kleurenkiezer
const gekozenKleur = ref('#4A90E2')
const kleuren = [
  '#4A90E2', '#E24A4A', '#2ECC71', '#9B59B6', '#F1C40F',
  '#E67E22', '#FF85A2', '#1ABC9C', '#34495E'
]

function veranderKleur(kleur) {
  gekozenKleur.value = kleur
}

// 3. Dynamische Werkervaring
const werkervaringen = ref([])

function voegWerkervaringToe() {
  werkervaringen.value.push({
    functie: '', bedrijf: '', periode: '', omschrijving: ''
  })
}

function verwijderWerkervaring(index) {
  werkervaringen.value.splice(index, 1)
}

// 4. Database koppeling
watch(
  [voornaam, achternaam, adres, postcode, email, telefoon, profieltekst, gekozenKleur, werkervaringen, heeftRijbewijs, heeftAuto, profielfoto],
  () => {
    slaGegevensOp({
      voornaam: voornaam.value,
      achternaam: achternaam.value,
      adres: adres.value,
      postcode: postcode.value,
      email: email.value,
      telefoon: telefoon.value,
      heeftRijbewijs: heeftRijbewijs.value,
      heeftAuto: heeftAuto.value,
      profielfoto: profielfoto.value,
      profieltekst: profieltekst.value,
      gekozenKleur: gekozenKleur.value,
      werkervaringen: werkervaringen.value
    })
    console.log("Gegevens opgeslagen, inclusief grotere foto en strakke checkboxes!")
  },
  { deep: true } 
)
</script>

<template>
  <div class="container">
    
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
          <button class="onderdeel-knop">Mijn sterke punten</button>
          <button class="onderdeel-knop">Waar heb ik gewerkt?</button>
          <button class="onderdeel-knop">Welke opleidingen of cursus heb ik gedaan?</button>
          <button class="onderdeel-knop">Talen die ik spreek</button>
          <button class="onderdeel-knop">Dit vind ik leuk</button>
          <button class="onderdeel-knop">Meer over mij</button>
      </div>

      <h3 class="sectie-titel">Mijn Gegevens</h3>
      
      <div class="form-grid">
        <div class="form-groep"><label>Voornaam</label><input type="text" v-model="voornaam" placeholder="Bijv. Elin"></div>
        <div class="form-groep"><label>Achternaam</label><input type="text" v-model="achternaam" placeholder="Bijv. Baanzicht"></div>
        <div class="form-groep"><label>Adres</label><input type="text" v-model="adres" placeholder="Straat en huisnummer"></div>
        <div class="form-groep"><label>Postcode en Plaats</label><input type="text" v-model="postcode" placeholder="Bijv. 1234 AB Amsterdam"></div>
        <div class="form-groep"><label>E-mail</label><input type="email" v-model="email" placeholder="jouwadres@mail.com"></div>
        <div class="form-groep"><label>Telefoon</label><input type="tel" v-model="telefoon" placeholder="06 - 12345678"></div>
        
        <div class="form-groep">
            <div class="foto-upload-container">
                <div class="foto-preview" :style="{ backgroundImage: profielfoto ? `url(${profielfoto})` : '' }">
                    <svg v-if="!profielfoto" viewBox="0 0 24 24" fill="#cbd5e0" width="60" height="60">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                </div>
                
                <label class="foto-upload-knop">
                    + Foto uploaden
                    <input type="file" accept="image/*" @change="verwerkFoto" style="display: none;">
                </label>
            </div>
        </div>

        <div class="form-groep">
            <label>Vervoer</label>
            <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 5px;">
                <label class="checkbox-label">
                    <input type="checkbox" v-model="heeftRijbewijs">
                    <span>Ik heb een rijbewijs</span>
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" v-model="heeftAuto">
                    <span>Ik heb een eigen auto</span>
                </label>
            </div>
        </div>

      </div>

      <h3 class="sectie-titel">Dit ben ik</h3>
      <div class="form-groep" style="margin-bottom: 20px;">
          <label>Vertel iets over jezelf</label>
          <textarea v-model="profieltekst" rows="5" placeholder="Ik ben een enthousiaste werknemer..."></textarea>
      </div>

      <h3 class="sectie-titel">Werkervaring</h3>
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
                <div class="cv-profielfoto" :style="{ backgroundImage: profielfoto ? `url(${profielfoto})` : '', backgroundSize: 'cover', backgroundPosition: 'center' }"></div>
                
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
                <div class="cv-naam" style="margin-bottom: 25px;">{{ voornaam || 'Ewout' }} {{ achternaam }}</div>
                
                <div class="cv-sectie-titel-hoofd" :style="{ color: gekozenKleur }">Dit ben ik</div>
                <p style="font-size: 13px; line-height: 1.6; color: #4a5568;">
                    {{ profieltekst || 'Hier verschijnt straks automatisch jouw profieltekst...' }}
                </p>
                
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
body { background-color: #f5f7fb; color: #333; }
.container { display: flex; height: 100vh; }
.linkerkolom { width: 50%; padding: 40px; background-color: #ffffff; overflow-y: auto; border-right: 1px solid #e2e8f0; }
.rechterkolom { width: 50%; padding: 40px; background-color: #DBEAFE; display: flex; justify-content: center; align-items: flex-start; overflow-y: auto; }
.cv-papier { width: 100%; max-width: 210mm; height: 297mm; background-color: white; box-shadow: 0 10px 30px rgba(0,0,0,0.15); padding: 0; overflow: hidden; display: flex; flex-shrink: 0; }
.cv-zijbalk { width: 35%; color: white; padding: 40px 25px; transition: background-color 0.3s ease; }
.cv-hoofdkolom { width: 65%; background-color: white; padding: 40px 35px; }

.cv-profielfoto { width: 130px; height: 130px; background-color: #e2e8f0; border-radius: 50%; margin: 0 auto 30px auto; border: 4px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }

.cv-sectie-titel-zijbalk { font-size: 13px; font-weight: 700; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid rgba(255, 255, 255, 0.3); padding-bottom: 5px; }
.cv-sectie-titel-hoofd { font-size: 14px; font-weight: 700; margin-bottom: 10px; margin-top: 25px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #edf2f7; padding-bottom: 5px; transition: color 0.3s ease; }
.cv-tekst-zijbalk { font-size: 12px; margin-bottom: 12px; line-height: 1.4; }
.cv-naam { font-size: 32px; font-weight: 700; color: #333; text-transform: uppercase; letter-spacing: 1px; }
.hoofdtitel { font-size: 18px; font-weight: 700; color: #4a5568; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 30px; margin-bottom: 15px; }
.sectie-titel { color: #718096; font-size: 14px; font-weight: 600; margin-top: 25px; margin-bottom: 15px; text-transform: uppercase; border-bottom: 2px solid #edf2f7; padding-bottom: 5px; }
.varianten-grid { display: flex; gap: 15px; margin-bottom: 20px; }
.variant-kaart { flex: 1; border: 2px solid #edf2f7; border-radius: 6px; padding: 15px; text-align: center; cursor: pointer; font-size: 12px; font-weight: 600; color: #a0aec0; background-color: #fafbfe; }
.variant-kaart.actief { border-color: #4A90E2; color: #4A90E2; background-color: #ffffff; }
.kleur-kiezer { display: flex; gap: 10px; margin-bottom: 25px; flex-wrap: wrap; }
.kleur-rondje { width: 24px; height: 24px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: transform 0.1s ease; }
.kleur-rondje:hover { transform: scale(1.1); }
.kleur-rondje.actief { border-color: #333; }
.onderdelen-grid { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 30px; border-bottom: 2px solid #edf2f7; padding-bottom: 25px; }
.onderdeel-knop { background-color: #4A90E2; color: white; border: none; padding: 10px 18px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background-color 0.2s; }
.onderdeel-knop:hover { background-color: #357ABD; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
.volledige-breedte { grid-column: span 2; }
.form-groep label { display: block; margin-bottom: 8px; color: #4a5568; font-size: 13px; font-weight: 600; }
.form-groep input[type="text"], .form-groep input[type="email"], .form-groep input[type="tel"], .form-groep textarea { width: 100%; padding: 12px; border: 1px solid #cbd5e0; border-radius: 6px; font-size: 14px; background-color: #f8fafc; transition: border-color 0.2s, background-color 0.2s; }
.form-groep input:focus, .form-groep textarea:focus { outline: none; border-color: #4A90E2; background-color: #ffffff; }

/* CHECKBOXES - Strak uitgelijnd via flexbox */
.checkbox-label {
    display: flex; align-items: center; gap: 10px; font-size: 14px; color: #4a5568; font-weight: 400; cursor: pointer;
}
.checkbox-label input[type="checkbox"] {
    width: 18px; height: 18px; cursor: pointer; accent-color: #4A90E2; margin: 0; padding: 0;
}

/* FOTO UPLOAD - Avatar groter gemaakt (110px) */
.foto-upload-container { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
.foto-preview {
    width: 110px; height: 110px; border-radius: 50%; background-color: #f8fafc;
    border: 2px dashed #cbd5e0; background-size: cover; background-position: center;
    display: flex; justify-content: center; align-items: center; overflow: hidden;
}
.foto-upload-knop {
    color: #4A90E2; font-size: 13px; font-weight: 600; cursor: pointer; transition: color 0.2s; margin-top: 5px;
}
.foto-upload-knop:hover { color: #2b6cb0; text-decoration: underline; }

.dynamisch-blok { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
.toevoeg-knop { background-color: transparent; color: #4A90E2; border: 2px dashed #4A90E2; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; width: 100%; margin-bottom: 30px; transition: all 0.2s; }
.toevoeg-knop:hover { background-color: #eff6ff; }
.verwijder-knop { background-color: transparent; color: #e53e3e; border: none; font-size: 12px; font-weight: 600; cursor: pointer; }
.verwijder-knop:hover { text-decoration: underline; }

@media (max-width: 1024px) {
    .container { flex-direction: column; height: auto; }
    .linkerkolom, .rechterkolom { width: 100%; padding: 20px; }
    .rechterkolom { overflow-y: visible; }
}
@media (max-width: 600px) {
    .cv-papier { flex-direction: column; height: auto; }
    .cv-zijbalk, .cv-hoofdkolom { width: 100%; padding: 20px; }
    .form-grid { grid-template-columns: 1fr; } 
    .volledige-breedte { grid-column: span 1; }
}
</style>