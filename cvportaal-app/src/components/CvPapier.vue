<script setup>
import { gekozenSjabloon } from '../cvStore.js'
import TemplateBasis from './sjablonen/TemplateBasis.vue'
import TemplateKlassiek from './sjablonen/TemplateKlassiek.vue'
import TemplateModern from './sjablonen/TemplateModern.vue'
</script>

<template>
  <div class="rechterkolom">
    <component :is="gekozenSjabloon === 'TemplateKlassiek' ? TemplateKlassiek : (gekozenSjabloon === 'TemplateModern' ? TemplateModern : TemplateBasis)" />
  </div>
</template>