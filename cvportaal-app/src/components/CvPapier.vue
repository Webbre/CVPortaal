<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { gekozenSjabloon, downloadPDF } from '../cvStore.js'
import TemplateBasis from './sjablonen/TemplateBasis.vue'
import TemplateKlassiek from './sjablonen/TemplateKlassiek.vue'
import TemplateModern from './sjablonen/TemplateModern.vue'

const cvInhoud = ref(null)
const cvIsTeLang = ref(false)
let resizeObserver = null

const observePaper = async () => {
  await nextTick() 
  if (resizeObserver) resizeObserver.disconnect()
  
  const paperElement = cvInhoud.value?.querySelector('.cv-papier') || cvInhoud.value
  
  if (paperElement) {
    resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        cvIsTeLang.value = entry.target.scrollHeight > (entry.target.clientHeight + 2)
      }
    })
    resizeObserver.observe(paperElement)
  }
}

onMounted(() => setTimeout(observePaper, 100))
watch(gekozenSjabloon, () => setTimeout(observePaper, 100))
onUnmounted(() => { if (resizeObserver) resizeObserver.disconnect() })
</script>

<template>
  <div class="rechterkolom">
    <div class="cv-scaler">
        <div class="cv-papier" ref="cvInhoud" style="height: 100%; width: 100%;">
            <component :is="gekozenSjabloon === 'TemplateKlassiek' ? TemplateKlassiek : (gekozenSjabloon === 'TemplateModern' ? TemplateModern : TemplateBasis)" />
        </div>
    </div>

    <div v-if="cvIsTeLang" class="smart-waarschuwing">
      ⚠️ Let op: Je cv is te lang! Tekst aan de onderkant wordt nu onzichtbaar afgekapt.
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
  border-radius: 50%; background-color: #4A90E2; color: white; border: none;
  box-shadow: 0 6px 16px rgba(74, 144, 226, 0.4); cursor: pointer; display: flex;
  justify-content: center; align-items: center; transition: all 0.2s ease; z-index: 100;
}
.zwevende-pdf-knop:hover { transform: translateY(-4px) scale(1.05); box-shadow: 0 10px 25px rgba(74, 144, 226, 0.6); }

.smart-waarschuwing {
  position: fixed; bottom: 115px; right: 40px; background-color: #e53e3e; color: white;
  padding: 15px 20px; border-radius: 8px; font-size: 14px; font-weight: 600;
  box-shadow: 0 10px 25px rgba(229, 62, 62, 0.4); z-index: 100; animation: slideIn 0.3s ease-out;
}
@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

/* Dit is de CSS-regel die de knop verbergt op mobiele apparaten */
@media (max-width: 600px) { 
  .zwevende-pdf-knop { 
    display: none; 
  } 
}

@media print { .smart-waarschuwing, .zwevende-pdf-knop { display: none !important; } }
</style>