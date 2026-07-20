<script setup>
// Sectie "Mijn sterke punten": een lijst van korte teksten die de gebruiker
// kan toevoegen en verwijderen (maximaal 6). Onderdeel van het CV-formulier.
import {
  sterkePunten,
  voegSterkPuntToe,
  verwijderSterkPunt,
} from '../../cvStore.js'
</script>

<template>
  <div class="hoofdtitel-wrapper">
    <svg class="hoofdtitel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
    <h2 class="hoofdtitel">Mijn sterke punten</h2>
  </div>

  <div class="dynamisch-blok">
    <div v-for="(punt, index) in sterkePunten" :key="punt.id" class="lijst-item-rij">
      <input type="text" v-model="punt.tekst" placeholder="Bijv. Klantvriendelijk" class="lijst-input">
      <button class="verwijder-knop-klein" @click="verwijderSterkPunt(index)" aria-label="Verwijder dit sterk punt">✕</button>
    </div>
    <button v-if="sterkePunten.length < 6" class="toevoeg-knop toevoeg-knop-marge" @click="voegSterkPuntToe">+ Voeg een sterk punt toe</button>
    <p v-else class="maximum-bereikt">Maximum bereikt</p>
  </div>
</template>

<style scoped>
.hoofdtitel-wrapper { display: flex; align-items: center; gap: 10px; margin-top: 35px; margin-bottom: 15px; }
.hoofdtitel { margin-top: 0; margin-bottom: 0; }
.hoofdtitel-icon { width: 24px; height: 24px; color: #4A90E2; flex-shrink: 0; }
.lijst-item-rij { display: flex; gap: 10px; margin-bottom: 15px; align-items: center; }
.lijst-input { flex: 1; padding: 12px; border: 1px solid #cbd5e0; border-radius: 6px; background: #ffffff; font-size: 14px; outline: none; transition: all 0.2s; }
.toevoeg-knop-marge { margin-bottom: 0; margin-top: 0; }
.maximum-bereikt { font-size: 13px; color: #718096; font-weight: 600; text-align: center; margin: 10px 0 0 0; }
</style>