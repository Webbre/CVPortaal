<script setup>
// Sectie "Dit vind ik leuk": een lijst van hobby's/interesses die de gebruiker
// kan toevoegen en verwijderen (maximaal 6). Onderdeel van het CV-formulier.
import {
  hobbys,
  voegHobbyToe,
  verwijderHobby,
} from '../../cvStore.js'
</script>

<template>
  <div class="hoofdtitel-wrapper">
    <svg class="hoofdtitel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
    <h2 class="hoofdtitel">Dit vind ik leuk</h2>
  </div>

  <div class="dynamisch-blok">
    <div v-for="(hobby, index) in hobbys" :key="hobby.id" class="lijst-item-rij">
      <input type="text" v-model="hobby.tekst" placeholder="Bijv. Fotografie, reizen of koken" class="lijst-input">
      <button class="verwijder-knop-klein" @click="verwijderHobby(index)" aria-label="Verwijder dit item">✕</button>
    </div>
    <button v-if="hobbys.length < 6" class="toevoeg-knop toevoeg-knop-marge" @click="voegHobbyToe">+ Voeg een item toe</button>
    <p v-else class="maximum-bereikt">Maximum bereikt</p>
  </div>
</template>
