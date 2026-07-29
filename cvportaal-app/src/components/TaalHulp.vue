<script setup>
// Uitklapbare hulp bij de knop "Verbeter met AI": laat in meerdere talen zien
// dat de gebruiker in zijn eigen taal mag schrijven.
//
// Herbruikbaar: staat naast élke AI-knop. De teksten staan in taalTeksten.js,
// zodat vertalingen kunnen worden bijgewerkt zonder dit bestand aan te raken.
import { ref, onMounted, onUnmounted } from 'vue'
import { taalTeksten } from '../taalTeksten.js'

const open = ref(false)
const wrapper = ref(null)

function sluitBijKlikBuiten(gebeurtenis) {
  if (open.value && wrapper.value && !wrapper.value.contains(gebeurtenis.target)) {
    open.value = false
  }
}

function sluitBijEscape(gebeurtenis) {
  if (gebeurtenis.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('click', sluitBijKlikBuiten)
  document.addEventListener('keydown', sluitBijEscape)
})

onUnmounted(() => {
  document.removeEventListener('click', sluitBijKlikBuiten)
  document.removeEventListener('keydown', sluitBijEscape)
})
</script>

<template>
  <div class="taalhulp" ref="wrapper">
    <button
      class="taalhulp-knop"
      :class="{ 'is-open': open }"
      @click="open = !open"
      :aria-expanded="open"
      aria-label="Uitleg in andere talen"
      title="Uitleg in andere talen"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
           stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true">
        <circle cx="12" cy="12" r="9"></circle>
        <path d="M3 12h18"></path>
        <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z"></path>
      </svg>
    </button>

    <div v-if="open" class="taalhulp-paneel" role="dialog" aria-label="Uitleg in andere talen">
      <div class="taalhulp-kop">
        <span>Schrijven in je eigen taal</span>
        <button class="taalhulp-sluiten" @click="open = false" aria-label="Sluiten">✕</button>
      </div>

      <div class="taalhulp-lijst">
        <div v-for="taal in taalTeksten" :key="taal.code" class="taalhulp-blok" :dir="taal.richting">
          <p class="taalhulp-naam">{{ taal.naam }}</p>
          <p class="taalhulp-tekst">{{ taal.uitleg }}</p>
          <p class="taalhulp-letop">{{ taal.let_op }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.taalhulp { position: relative; display: inline-flex; }

.taalhulp-knop {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #2ECC71;
  background: var(--kleur-wit);
  color: #2ECC71;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}
.taalhulp-knop:hover,
.taalhulp-knop.is-open {
  border-color: #27AE60;
  color: var(--kleur-wit);
  background: #2ECC71;
}

.taalhulp-paneel {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 60;
  width: min(360px, calc(100vw - 40px));
  max-height: 420px;
  display: flex;
  flex-direction: column;
  background: var(--kleur-wit);
  border: 1px solid var(--kleur-rand);
  border-radius: var(--radius-groot);
  box-shadow: var(--schaduw-menu);
  text-align: left;
  overflow: hidden;
}

.taalhulp-kop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--kleur-rand);
  background: var(--kleur-achtergrond-zacht);
  font-size: 13px;
  font-weight: 700;
  color: var(--kleur-tekst-sterk);
  flex-shrink: 0;
}
.taalhulp-sluiten {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--kleur-tekst-flauw);
  font-size: 14px;
  line-height: 1;
  padding: 4px;
}
.taalhulp-sluiten:hover { color: var(--kleur-tekst-gedempt); }

.taalhulp-lijst { overflow-y: auto; padding: 4px 0; }

.taalhulp-blok {
  padding: 12px 16px;
  border-bottom: 1px solid var(--kleur-scheiding);
}
.taalhulp-blok:last-child { border-bottom: none; }

.taalhulp-naam {
  font-size: 13px;
  font-weight: 700;
  color: var(--kleur-accent);
  margin: 0 0 5px 0;
}
.taalhulp-tekst {
  font-size: 13px;
  line-height: 1.5;
  color: var(--kleur-tekst-gedempt);
  margin: 0 0 5px 0;
}
.taalhulp-letop {
  font-size: 12px;
  line-height: 1.5;
  color: var(--kleur-tekst-zacht);
  margin: 0;
  font-style: italic;
}
</style>