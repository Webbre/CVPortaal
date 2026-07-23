<script setup>
// Sectie "Waar heb ik gewerkt?": een lijst van werkervaringen met functie,
// organisatie, periode (van/tot met maand+jaar), een "ik werk hier nog"-optie
// en een korte omschrijving. Zichtbaar wanneer de gebruiker de sectie aanzet.
import {
  werkervaringen,
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
            <textarea dir="auto" v-model="werk.omschrijving" placeholder="Wat waren je taken?"></textarea>
          </div>
        </div>
      </div>
    </div>

    <button class="toevoeg-knop toevoeg-knop-marge" @click="voegWerkervaringToe">+ Voeg een werkervaring toe</button>
  </div>
</template>
