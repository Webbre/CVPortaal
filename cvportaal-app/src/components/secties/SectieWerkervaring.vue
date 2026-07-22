<script setup>
// Sectie "Waar heb ik gewerkt?": een lijst van werkervaringen met functie,
// organisatie, periode (van/tot met maand+jaar), een "ik werk hier nog"-optie
// en een korte omschrijving. Zichtbaar wanneer de gebruiker de sectie aanzet.
import {
  werkervaringen,
  opleidingen,
  jarenLijst,
  voegWerkervaringToe,
  verwijderWerkervaring,
} from '../../cvStore.js'
</script>

<template>
  <div class="hoofdtitel-wrapper">
    <svg class="hoofdtitel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
    <h2 class="hoofdtitel">Waar heb ik gewerkt?</h2>
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
          <div class="autogrow-wrapper" :data-value="(werk.omschrijving || '') + ' '">
            <textarea v-model="werk.omschrijving" placeholder="Wat waren je taken?"></textarea>
          </div>
        </div>
      </div>
    </div>

    <div v-if="werkervaringen.length + opleidingen.length > 5" class="waarschuwing-rood">
      <p class="waarschuwing-tekst-rood">⚠️ Let op: Je hebt veel informatie toegevoegd. Kijk aan de rechterkant of je cv nog op één pagina past. Past het niet? Dan verdwijnt er tekst als je het cv opslaat als PDF.</p>
    </div>
    <button class="toevoeg-knop toevoeg-knop-marge" @click="voegWerkervaringToe">+ Voeg een werkervaring toe</button>
  </div>
</template>

<style scoped>
.hoofdtitel-wrapper { display: flex; align-items: center; gap: 10px; margin-top: 35px; margin-bottom: 15px; }
.hoofdtitel { margin-top: 0; margin-bottom: 0; }
.hoofdtitel-icon { width: 24px; height: 24px; color: #4A90E2; flex-shrink: 0; }

/* Meegroeiend tekstvak (grid-replicator + field-sizing fallback) */
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
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  min-height: 100px;
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
  content: attr(data-value) " ";
  visibility: hidden;
}

.form-groep .autogrow-wrapper textarea {
  margin-bottom: 0;
}

@supports (field-sizing: content) {
  .autogrow-wrapper { display: block; }
  .autogrow-wrapper::after { display: none; }
  .autogrow-wrapper > textarea {
    field-sizing: content;
  }
}
</style>