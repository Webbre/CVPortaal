<script setup>
// Sectie "Talen die ik spreek": een lijst van talen met een niveau van 1 tot 5
// (aanklikbare sterren) en een bijbehorend niveaulabel. Maximaal 5 talen.
import {
  talen,
  voegTaalToe,
  verwijderTaal,
  zetTaalNiveau,
} from '../../cvStore.js'
</script>

<template>
  <div class="hoofdtitel-wrapper">
    <svg class="hoofdtitel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>
    <h2 class="hoofdtitel">Talen die ik spreek</h2>
  </div>

  <div class="dynamisch-blok">
    <div v-for="(taal, index) in talen" :key="taal.id"
         :style="{
             marginBottom: index < talen.length - 1 ? '20px' : '15px',
             paddingBottom: index < talen.length - 1 ? '20px' : '0px',
             borderBottom: index < talen.length - 1 ? '1px solid #e2e8f0' : 'none'
         }">
      <div class="lijst-item-rij">
        <input type="text" v-model="taal.naam" placeholder="Bijv. Engels of Spaans" class="lijst-input">
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
    <button v-if="talen.length < 5" class="toevoeg-knop toevoeg-knop-marge" @click="voegTaalToe">+ Voeg een taal toe</button>
    <p v-else class="maximum-bereikt">Maximum bereikt</p>
  </div>
</template>
