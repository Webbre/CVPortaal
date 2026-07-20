<script setup>
// Sectie "Meer over mij": een optioneel tekstveld met AI-verbeterknop en tellertje.
// Onderdeel van het CV-formulier; haalt zijn gegevens en acties uit de store.
import {
  meerOverMijTekst,
  meerOverMijLengte,
  isAiLadenMeerOverMij,
  isAiToegepastMeerOverMij,
  verbeterMetAI,
} from '../../cvStore.js'
</script>

<template>
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

      <div class="autogrow-wrapper" :data-value="(meerOverMijTekst || '') + ' '">
        <textarea v-model="meerOverMijTekst" @input="isAiToegepastMeerOverMij = false" placeholder="Bijv. Ik ben vrijwilliger bij de voetbalclub van mijn dochter..." :disabled="isAiLadenMeerOverMij" :style="{ opacity: isAiLadenMeerOverMij ? 0.6 : 1, borderColor: meerOverMijLengte > 400 ? '#e53e3e' : '' }"></textarea>
      </div>
    </div>
  </div>
</template>