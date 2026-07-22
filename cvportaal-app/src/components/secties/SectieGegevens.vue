<script setup>
// Sectie "Mijn gegevens": naam, woonplaats, contactgegevens, geboortejaar,
// vervoer (rijbewijs/auto) en de profielfoto met upload. Altijd zichtbaar.
import {
  voornaam,
  achternaam,
  woonplaats,
  email,
  telefoon,
  geboorteJaar,
  geboorteJarenLijst,
  heeftRijbewijs,
  heeftAuto,
  profielfoto,
  toonFotoOpCv,
  emailFout,
  verwerkFoto,
  verwijderFoto,
} from '../../cvStore.js'
</script>

<template>
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
</template>

<style scoped>
.hoofdtitel-wrapper { display: flex; align-items: center; gap: 10px; margin-top: 35px; margin-bottom: 15px; }
.hoofdtitel { margin-top: 0; margin-bottom: 0; }
.hoofdtitel-icon { width: 24px; height: 24px; color: #4A90E2; flex-shrink: 0; }
.waarschuwing-tekst-rood { font-size: 13px; color: #c53030; margin: 0; font-weight: 600; line-height: 1.5; }
</style>