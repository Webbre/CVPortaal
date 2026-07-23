<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { gekozenSjabloon, downloadPDF, verzamelData } from '../cvStore.js'
import TemplateBasis from './sjablonen/TemplateBasis.vue'
import TemplateKlassiek from './sjablonen/TemplateKlassiek.vue'
import TemplateModern from './sjablonen/TemplateModern.vue'

// Speling in pixels voordat we alarm slaan. De sjablonen houden zelf al een
// marge van ongeveer 40 pixels onderaan aan, gelijk aan de zijkanten. Hoger
// getal = de melding verschijnt later, lager = eerder.
const SPELING_PX = 2

const cvInhoud = ref(null)
const cvIsTeLang = ref(false)
let formaatBewaker = null

// Kijkt alleen naar het papier als geheel: de buitenrand en het sjabloon dat
// erin zit. Bewust NIET naar elk onderdeel apart, want sommige sjablonen laten
// iets met opzet buiten zijn vak vallen — zoals de profielfoto die in Modern
// over de rand van de kopbalk hangt.
function meetOverloop() {
  const papier = cvInhoud.value
  if (!papier) return

  const paginas = [papier, papier.firstElementChild].filter(Boolean)
  cvIsTeLang.value = paginas.some(
    (el) => el.scrollHeight > el.clientHeight + SPELING_PX
  )
}

// Houdt de afmetingen van het cv in de gaten en meet opnieuw zodra er iets
// verandert.
async function startBewaking() {
  await nextTick()
  if (formaatBewaker) formaatBewaker.disconnect()

  const papier = cvInhoud.value
  if (!papier) return

  formaatBewaker = new ResizeObserver(() => meetOverloop())
  formaatBewaker.observe(papier)
  Array.from(papier.children).forEach((kolom) => formaatBewaker.observe(kolom))

  meetOverloop()
}

onMounted(() => {
  setTimeout(startBewaking, 100)
  // Lettertypen laden soms later; daarna kan de tekst iets hoger uitvallen.
  if (document.fonts?.ready) document.fonts.ready.then(meetOverloop)
})

// Bij een ander sjabloon verandert de hele opbouw: opnieuw instellen.
watch(gekozenSjabloon, () => setTimeout(startBewaking, 150))

// Bij elke inhoudelijke wijziging opnieuw meten, nadat het cv is bijgetekend.
watch(verzamelData, async () => {
  await nextTick()
  meetOverloop()
}, { deep: true })

onUnmounted(() => { if (formaatBewaker) formaatBewaker.disconnect() })
</script>

<template>
  <div class="rechterkolom">
    <div class="cv-scaler">
        <div class="cv-papier" ref="cvInhoud" style="height: 100%; width: 100%;">
            <component :is="gekozenSjabloon === 'TemplateKlassiek' ? TemplateKlassiek : (gekozenSjabloon === 'TemplateModern' ? TemplateModern : TemplateBasis)" />
        </div>
    </div>

    <div v-if="cvIsTeLang" class="overloop-melding" role="status">
      <div class="overloop-icoon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" aria-hidden="true">
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </div>
      <div class="overloop-inhoud">
        <p class="overloop-kop">Je cv past niet meer op één pagina</p>
        <p class="overloop-tekst">De onderste tekst valt weg zodra je het cv opslaat. Maak een tekst korter of zet een onderdeel uit.</p>
      </div>
    </div>

    <button class="zwevende-pdf-knop" @click="downloadPDF" aria-label="Download CV als PDF" title="Sla je cv op als PDF">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
    </button>
  </div>
</template>

<style scoped>
.rechterkolom { position: relative; display: flex; justify-content: center; align-items: flex-start; padding-bottom: 80px; }

.zwevende-pdf-knop {
  position: fixed; bottom: 40px; right: 40px; width: 60px; height: 60px;
  border-radius: 50%; background-color: var(--kleur-accent); color: var(--kleur-wit); border: none;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25); cursor: pointer; display: flex;
  justify-content: center; align-items: center; transition: all 0.2s ease; z-index: 100;
}
.zwevende-pdf-knop:hover { transform: translateY(-4px) scale(1.05); box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3); }

/* Melding wanneer het cv niet meer op één pagina past */
.overloop-melding {
  position: fixed;
  bottom: 120px;
  right: 40px;
  max-width: 340px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: var(--kleur-fout);
  color: var(--kleur-wit);
  padding: 18px 22px;
  border-radius: var(--radius-groot);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.22);
  z-index: 100;
  animation: meldingIn 0.3s ease-out;
}
.overloop-icoon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
}
.overloop-kop { font-size: 14px; font-weight: 700; margin: 0 0 4px 0; }
.overloop-tekst { font-size: 13px; font-weight: 400; margin: 0; line-height: 1.5; color: rgba(255, 255, 255, 0.92); }

@keyframes meldingIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

@media (max-width: 600px) {
  .zwevende-pdf-knop { display: none; }
  .overloop-melding { left: 15px; right: 15px; bottom: 20px; max-width: none; }
}

@media print { .overloop-melding, .zwevende-pdf-knop { display: none !important; } }
</style>