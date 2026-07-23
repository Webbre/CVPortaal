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
