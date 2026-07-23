<script setup>
// Sectie "Welke opleiding of cursus heb ik gedaan?": een lijst van opleidingen
// en cursussen met naam, instelling, periode (van/tot met maand+jaar), een
// "diploma/certificaat behaald"-optie en een "ik volg dit nog"-optie.
import {
  opleidingen,
  jarenLijst,
  voegOpleidingToe,
  verwijderOpleiding,
} from '../../cvStore.js'
</script>

<template>
  <div class="hoofdtitel-wrapper">
    <svg class="hoofdtitel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>
    <h2 class="hoofdtitel">Welke opleiding of cursus heb ik gedaan?</h2>
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

    <button class="toevoeg-knop toevoeg-knop-marge" @click="voegOpleidingToe">+ Voeg een opleiding of cursus toe</button>
  </div>
</template>
