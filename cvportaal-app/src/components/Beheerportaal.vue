<script setup>
// Beheerportaal: het scherm voor coaches, keyusers en de administrator.
// Cliënten zien dit nooit — die krijgen de cv-maker.
//
// Voorlopig is alleen het coach-gedeelte ingericht: een overzicht van de eigen
// cliënten en een formulier om er een toe te voegen.
//
// Na het aanmaken verschijnt een kant-en-klare tekst die de coach kan kopiëren
// en doorsturen. Bewust geen automatische e-mail: bij dienstverlening aan tafel
// vertelt de coach het zelf, en of een automatische mail nodig is moet uit de
// testfase blijken.
import { ref, computed, onMounted } from 'vue'
import { profiel, logMijUit } from '../cvStore.js'
import { cvRepository } from '../cvRepository.js'

const rolNamen = {
  super_admin: 'Administrator',
  organisatie_beheerder: 'Keyuser',
  coach: 'Coach',
}

const clienten = ref([])
const bezig = ref(true)
const fout = ref('')

const toonFormulier = ref(false)
const nieuw = ref({ voornaam: '', achternaam: '', email: '' })
const bezigMetOpslaan = ref(false)
const formulierFout = ref('')

// Gegevens van de zojuist aangemaakte cliënt, voor het kopieerblok.
const zojuistToegevoegd = ref(null)
const kopieerMelding = ref('')

// Het adres van de app zoals de coach het nu voor zich heeft. Zo klopt de
// tekst altijd, ook wanneer het domein straks verandert.
const appAdres = computed(() => window.location.origin.replace(/^https?:\/\//, ''))

const uitnodigingsTekst = computed(() => {
  if (!zojuistToegevoegd.value) return ''
  return `Hallo ${zojuistToegevoegd.value.voornaam},

Er staat een account voor je klaar om je cv te maken.

Ga naar: ${appAdres.value}
Vul dit e-mailadres in: ${zojuistToegevoegd.value.email}

Je krijgt dan een code van 6 cijfers per e-mail. Vul die code in en je kunt beginnen.

Krijg je geen e-mail? Kijk dan ook in je map ongewenste e-mail (spam).`
})

async function kopieerTekst() {
  try {
    await navigator.clipboard.writeText(uitnodigingsTekst.value)
    kopieerMelding.value = 'Gekopieerd'
  } catch {
    kopieerMelding.value = 'Kopiëren lukte niet — selecteer de tekst handmatig'
  }
  setTimeout(() => { kopieerMelding.value = '' }, 3000)
}

async function laadClienten() {
  bezig.value = true
  fout.value = ''
  try {
    clienten.value = await cvRepository.haalMijnClienten()
  } catch (error) {
    fout.value = 'De lijst kon niet worden geladen. Ververs de pagina of probeer het later opnieuw.'
  } finally {
    bezig.value = false
  }
}

async function voegClientToe() {
  formulierFout.value = ''

  if (!nieuw.value.voornaam.trim() || !nieuw.value.achternaam.trim() || !nieuw.value.email.trim()) {
    formulierFout.value = 'Vul alle velden in.'
    return
  }

  bezigMetOpslaan.value = true
  try {
    await cvRepository.maakAccount({
      rol: 'inwoner',
      voornaam: nieuw.value.voornaam.trim(),
      achternaam: nieuw.value.achternaam.trim(),
      email: nieuw.value.email.trim(),
    })
    zojuistToegevoegd.value = {
      voornaam: nieuw.value.voornaam.trim(),
      email: nieuw.value.email.trim().toLowerCase(),
    }
    nieuw.value = { voornaam: '', achternaam: '', email: '' }
    toonFormulier.value = false
    await laadClienten()
  } catch (error) {
    formulierFout.value = error.message || 'Het account kon niet worden aangemaakt.'
  } finally {
    bezigMetOpslaan.value = false
  }
}

function datumKort(waarde) {
  if (!waarde) return 'nog niet ingelogd'
  return new Date(waarde).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(() => {
  if (profiel.value?.rol === 'coach') laadClienten()
  else bezig.value = false
})
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
      <div class="beheer-welkomregel">
        <div>
          <p class="beheer-welkom">Welkom{{ profiel?.voornaam ? `, ${profiel.voornaam}` : '' }}</p>
          <p class="beheer-rol">Ingelogd als {{ rolNamen[profiel?.rol] || profiel?.rol }}</p>
        </div>
        <button v-if="profiel?.rol === 'coach' && !toonFormulier"
                class="hoofd-knop" @click="toonFormulier = true">
          + Cliënt toevoegen
        </button>
      </div>

      <!-- Kant-en-klare uitnodiging na het aanmaken -->
      <div v-if="zojuistToegevoegd" class="uitnodiging-kaart">
        <div class="uitnodiging-kop">
          <span>Account aangemaakt — stuur dit door</span>
          <button class="uitnodiging-sluiten" @click="zojuistToegevoegd = null" aria-label="Sluiten">✕</button>
        </div>
        <p class="uitnodiging-uitleg">
          Er is geen e-mail verstuurd. Geef onderstaande tekst door via e-mail,
          WhatsApp of persoonlijk.
        </p>
        <pre class="uitnodiging-tekst">{{ uitnodigingsTekst }}</pre>
        <div class="knoppen-rij">
          <button class="hoofd-knop" @click="kopieerTekst">Tekst kopiëren</button>
          <span v-if="kopieerMelding" class="kopieer-melding">{{ kopieerMelding }}</span>
        </div>
      </div>

      <!-- Toevoegformulier -->
      <div v-if="toonFormulier" class="beheer-kaart">
        <h2 class="kaart-titel">Nieuwe cliënt</h2>
        <p class="kaart-uitleg">
          Vul de gegevens in. Na het opslaan krijg je een tekst die je kunt
          doorsturen, zodat de cliënt weet hoe hij kan inloggen.
        </p>

        <div class="form-grid">
          <div class="form-groep">
            <label>Voornaam</label>
            <input type="text" v-model="nieuw.voornaam" placeholder="Voornaam">
          </div>
          <div class="form-groep">
            <label>Achternaam</label>
            <input type="text" v-model="nieuw.achternaam" placeholder="Achternaam">
          </div>
          <div class="form-groep volledige-breedte">
            <label>E-mailadres</label>
            <input type="email" v-model="nieuw.email" placeholder="naam@voorbeeld.nl"
                   @keyup.enter="voegClientToe">
          </div>
        </div>

        <p v-if="formulierFout" class="melding-fout">{{ formulierFout }}</p>

        <div class="knoppen-rij">
          <button class="hoofd-knop" @click="voegClientToe" :disabled="bezigMetOpslaan">
            {{ bezigMetOpslaan ? 'Bezig...' : 'Cliënt toevoegen' }}
          </button>
          <button class="annuleer-knop" @click="toonFormulier = false; formulierFout = ''">
            Annuleren
          </button>
        </div>
      </div>

      <!-- Cliëntenlijst -->
      <div v-if="profiel?.rol === 'coach'" class="beheer-kaart">
        <h2 class="kaart-titel">Mijn cliënten</h2>

        <p v-if="bezig" class="kaart-uitleg">Bezig met laden...</p>
        <p v-else-if="fout" class="melding-fout">{{ fout }}</p>
        <p v-else-if="clienten.length === 0" class="kaart-uitleg">
          Je hebt nog geen cliënten. Voeg er een toe met de knop hierboven.
        </p>

        <table v-else class="clienten-tabel">
          <thead>
            <tr>
              <th>Naam</th>
              <th>E-mailadres</th>
              <th>Laatst actief</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="client in clienten" :key="client.id">
              <td class="cel-naam">{{ client.voornaam }} {{ client.achternaam }}</td>
              <td class="cel-email">{{ client.email }}</td>
              <td class="cel-datum">{{ datumKort(client.laatst_actief_op) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Andere rollen: nog niet ingericht -->
      <div v-if="profiel?.rol !== 'coach'" class="beheer-kaart">
        <p class="kaart-uitleg">Het beheer voor deze rol wordt nog ingericht.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.beheer-scherm { min-height: 100vh; background: var(--kleur-achtergrond-kolom); padding: 20px; }

.beheer-header {
  display: flex; justify-content: space-between; align-items: center; gap: 15px;
  background: var(--kleur-wit); border-radius: var(--radius-kaart);
  padding: 18px 24px; box-shadow: var(--schaduw-kaart);
  border-bottom: 3px solid var(--kleur-accent); margin-bottom: 30px;
}
.beheer-merk { display: flex; align-items: center; gap: 12px; min-width: 0; }
.beheer-logo { object-fit: contain; flex-shrink: 0; }
.beheer-titel {
  font-size: 18px; font-weight: 800; color: var(--kleur-tekst-sterk); margin: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.beheer-uitlog {
  background: none; border: 1px solid var(--kleur-rand); border-radius: var(--radius-blok);
  padding: 8px 16px; font-size: 13px; font-weight: 600; color: var(--kleur-tekst-gedempt);
  cursor: pointer; flex-shrink: 0; transition: all 0.2s ease;
}
.beheer-uitlog:hover { border-color: var(--kleur-accent); color: var(--kleur-accent); }

.beheer-inhoud { max-width: 900px; margin: 0 auto; }

.beheer-welkomregel {
  display: flex; justify-content: space-between; align-items: flex-end;
  gap: 15px; flex-wrap: wrap; margin-bottom: 25px;
}
.beheer-welkom { font-size: 20px; font-weight: 700; color: var(--kleur-tekst-sterk); margin: 0 0 4px 0; }
.beheer-rol { font-size: 13px; color: var(--kleur-tekst-zacht); margin: 0; }

.beheer-kaart {
  background: var(--kleur-wit); border-radius: var(--radius-kaart);
  padding: 28px; box-shadow: var(--schaduw-kaart); margin-bottom: 25px;
}
.kaart-titel { font-size: 16px; font-weight: 800; color: var(--kleur-tekst-sterk); margin: 0 0 8px 0; }
.kaart-uitleg { font-size: 14px; line-height: 1.6; color: var(--kleur-tekst-zacht); margin: 0 0 20px 0; }

/* Kant-en-klare uitnodiging */
.uitnodiging-kaart {
  background: var(--kleur-wit); border-radius: var(--radius-kaart);
  border-left: 5px solid var(--kleur-succes);
  padding: 24px 28px; box-shadow: var(--schaduw-kaart); margin-bottom: 25px;
}
.uitnodiging-kop {
  display: flex; justify-content: space-between; align-items: center; gap: 10px;
  font-size: 15px; font-weight: 700; color: var(--kleur-tekst-sterk); margin-bottom: 6px;
}
.uitnodiging-sluiten {
  background: none; border: none; cursor: pointer;
  color: var(--kleur-tekst-flauw); font-size: 14px; padding: 4px; line-height: 1;
}
.uitnodiging-sluiten:hover { color: var(--kleur-tekst-gedempt); }
.uitnodiging-uitleg { font-size: 13px; color: var(--kleur-tekst-zacht); margin: 0 0 16px 0; line-height: 1.5; }
.uitnodiging-tekst {
  background: var(--kleur-achtergrond-zacht);
  border: 1px solid var(--kleur-rand);
  border-radius: var(--radius-middel);
  padding: 16px; margin: 0 0 16px 0;
  font-family: inherit; font-size: 13px; line-height: 1.6;
  color: var(--kleur-tekst-gedempt);
  white-space: pre-wrap; word-wrap: break-word;
}
.kopieer-melding { font-size: 13px; font-weight: 600; color: var(--kleur-succes); }

.knoppen-rij { display: flex; gap: 12px; align-items: center; margin-top: 10px; flex-wrap: wrap; }
.annuleer-knop {
  background: none; border: none; color: var(--kleur-tekst-zacht);
  font-size: 14px; font-weight: 600; cursor: pointer;
}
.annuleer-knop:hover { text-decoration: underline; }

.melding-fout {
  background: var(--kleur-fout-vlak); border-left: 4px solid var(--kleur-fout);
  padding: 12px 16px; border-radius: var(--radius-middel);
  font-size: 13px; color: var(--kleur-fout-tekst); font-weight: 600; margin: 15px 0 0 0;
}

.clienten-tabel { width: 100%; border-collapse: collapse; }
.clienten-tabel th {
  text-align: left; font-size: 12px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.5px; color: var(--kleur-tekst-zacht);
  padding: 0 12px 10px 0; border-bottom: 2px solid var(--kleur-rand);
}
.clienten-tabel td {
  padding: 14px 12px 14px 0; border-bottom: 1px solid var(--kleur-scheiding); font-size: 14px;
}
.cel-naam { font-weight: 600; color: var(--kleur-tekst-sterk); }
.cel-email { color: var(--kleur-tekst-gedempt); word-break: break-all; }
.cel-datum { color: var(--kleur-tekst-zacht); white-space: nowrap; }

@media (max-width: 600px) {
  .beheer-scherm { padding: 12px; }
  .beheer-kaart, .uitnodiging-kaart { padding: 20px; }
  .clienten-tabel thead { display: none; }
  .clienten-tabel tr { display: block; padding: 12px 0; border-bottom: 1px solid var(--kleur-scheiding); }
  .clienten-tabel td { display: block; padding: 2px 0; border: none; }
}
</style>