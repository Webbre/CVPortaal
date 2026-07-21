<script setup>
// Sectie "Dit ben ik": het profieltekstveld met AI-verbeterknop en tekenteller.
// Deze sectie is altijd zichtbaar (geen aan/uit-schakelaar).
import {
  profieltekst,
  profielLengte,
  isAiLaden,
  isAiToegepast,
  verbeterMetAI,
} from '../../cvStore.js'
</script>

<template>
  <div class="hoofdtitel-wrapper">
    <svg class="hoofdtitel-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
    <h2 class="hoofdtitel">Dit ben ik</h2>
  </div>

  <div class="dynamisch-blok">
    <div class="form-groep" style="margin-bottom: 0;">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 8px;">
        <label style="margin-bottom: 0;">Vertel iets over jezelf</label>

        <div style="display: flex; align-items: center; gap: 15px;">
          <span :style="{ color: profielLengte > 400 ? '#e53e3e' : '#718096', fontSize: '11px', fontWeight: '600' }">
            {{ profielLengte }} / 400 tekens
          </span>
          <button class="ai-knop" @click="verbeterMetAI('profiel')" :disabled="isAiLaden">
            <svg v-if="!isAiToegepast && !isAiLaden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            <svg v-if="isAiToegepast && !isAiLaden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg>
            <svg v-if="isAiLaden" class="spin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
            {{ isAiLaden ? 'Even nadenken...' : (isAiToegepast ? 'Ongedaan maken' : 'Verbeter met AI') }}
          </button>
        </div>
      </div>

      <div class="autogrow-wrapper" :data-value="(profieltekst || '') + ' '">
        <textarea v-model="profieltekst" @input="isAiToegepast = false" placeholder="Denk aan je dagelijks leven, wat je leuk vindt of wat je graag wilt gaan doen..." :disabled="isAiLaden" :style="{ opacity: isAiLaden ? 0.6 : 1, borderColor: profielLengte > 400 ? '#e53e3e' : '' }"></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hoofdtitel-wrapper { display: flex; align-items: center; gap: 10px; margin-top: 35px; margin-bottom: 15px; }
.hoofdtitel { margin-top: 0; margin-bottom: 0; }
.hoofdtitel-icon { width: 24px; height: 24px; color: #4A90E2; flex-shrink: 0; }
/* Meegroeiend tekstvak (grid-replicator + field-sizing fallback) */
.autogrow-wrapper {
  display: grid;
  width: 100%;
}

.autogrow-wrapper::after,
.autogrow-wrapper > textarea {
  width: 100%;
  grid-area: 1 / 1;
  font-family: inherit;
  font-size: 14px;
  padding: 12px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  box-sizing: border-box;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  min-height: 100px;
}

.autogrow-wrapper > textarea {
  resize: none;
  overflow: hidden;
  background: #ffffff;
  transition: border-color 0.2s;
}

.autogrow-wrapper > textarea:focus {
  border-color: #4A90E2;
  outline: none;
}

.autogrow-wrapper::after {
  content: attr(data-value) " ";
  visibility: hidden;
}

.form-groep .autogrow-wrapper textarea {
  margin-bottom: 0;
}

@supports (field-sizing: content) {
  .autogrow-wrapper { display: block; }
  .autogrow-wrapper::after { display: none; }
  .autogrow-wrapper > textarea {
    field-sizing: content;
  }
}
</style>