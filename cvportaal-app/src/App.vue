<script setup>
import { onMounted } from 'vue'
import { 
  gebruiker, isLaden, loginEmail, linkVerstuurd, 
  loginMetLink, initialiseerApp 
} from './cvStore.js'
import CvFormulier from './components/CvFormulier.vue'
import CvPapier from './components/CvPapier.vue'

onMounted(() => {
  initialiseerApp()
})
</script>

<template>
  <div v-if="isLaden" class="volledig-scherm center-inhoud">
    <div class="loader"></div>
    <p style="margin-top: 15px; color: #4a5568; font-weight: 600;">Even geduld...</p>
  </div>

  <div v-else-if="!gebruiker" class="volledig-scherm center-inhoud inlog-achtergrond">
    <div class="inlog-box">
      <h1 style="color: #333; margin-bottom: 10px; font-size: 24px;">CVPortaal</h1>
      <div v-if="!linkVerstuurd">
        <p style="color: #718096; font-size: 14px; margin-bottom: 25px; line-height: 1.5;">Log in met een magische link.</p>
        <div class="form-groep" style="text-align: left;">
          <label>E-mailadres</label>
          <input type="email" v-model="loginEmail" placeholder="jouw@email.nl" @keyup.enter="loginMetLink">
        </div>
        <button class="hoofd-knop" style="width: 100%; margin-top: 15px;" @click="loginMetLink">Stuur inloglink</button>
      </div>
      <div v-else>
        <div style="font-size: 40px; margin-bottom: 15px;" role="status">✉️</div>
        <h2 style="color: #4A90E2; margin-bottom: 10px; font-size: 18px;">Check je mailbox!</h2>
        <p style="color: #718096; font-size: 14px;">Link gestuurd naar <strong>{{ loginEmail }}</strong></p>
      </div>
    </div>
  </div>

  <div v-else class="container relative">
    <CvFormulier />
    <CvPapier />
  </div>
</template>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
body { background-color: #f5f7fb; overflow-x: hidden; color: #333; }

/* LAYOUT STRUCTUUR */
.volledig-scherm { height: 100vh; width: 100vw; display: flex; flex-direction: column; }
.center-inhoud { justify-content: center; align-items: center; text-align: center; }
.container { display: flex; height: 100vh; }
.relative { position: relative; }
.inlog-achtergrond { background-color: #DBEAFE; }
.inlog-box { background: white; padding: 40px; border-radius: 12px; width: 100%; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }

/* HEADER & MENU */
.app-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; border-bottom: 2px solid #edf2f7; padding-bottom: 20px; margin-bottom: 20px; }
.app-header + .hoofdtitel { border-top: none; padding-top: 0; }
.app-logo-groep { display: flex; align-items: center; gap: 10px; }
.app-titel { font-size: 20px; font-weight: 800; color: #1a202c; letter-spacing: -0.5px; margin: 0; }
.menu-container-header { position: relative; }
.tandwiel-knop { background: white; border: 1px solid #e2e8f0; border-radius: 50%; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center; cursor: pointer; transition: transform 0.3s, border-color 0.2s; color: #4a5568;}
.tandwiel-knop:hover { transform: rotate(45deg); border-color: #4A90E2; color: #4A90E2; }
.dropdown-menu-header { position: absolute; top: 50px; right: 0; background: white; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); width: 220px; z-index: 100; border: 1px solid #e2e8f0; text-align: left; }
.dropdown-header { padding: 15px; background: #f8fafc; font-size: 12px; color: #718096; border-bottom: 1px solid #e2e8f0; word-break: break-all; margin: 0;}
.dropdown-item { width: 100%; text-align: left; background: none; border: none; padding: 12px 15px; font-size: 13px; font-weight: 600; cursor: pointer; color: #4a5568; transition: background 0.2s;}
.dropdown-item:hover { background: #edf2f7; color: #1a202c;}

/* Styling voor Dynamische Opslaan knop */
.opslaan-knop { border-radius: 20px; padding: 0 16px; height: 40px; display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; outline: none; border: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.opslaan-knop.inactief { background-color: #edf2f7; color: #a0aec0; border: 1px solid #e2e8f0; cursor: not-allowed; opacity: 0.5; }
.opslaan-knop.actief { background-color: #4A90E2; color: white; border: 1px solid #4A90E2; cursor: pointer; box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3); opacity: 1; }
.opslaan-knop.actief:hover { background-color: #357ABD; transform: translateY(-1px); }
.opslaan-knop.actief:active { transform: scale(0.95); }
.opslaan-knop.succes { background-color: #2ECC71; color: white; border: 1px solid #2ECC71; opacity: 1; cursor: default; animation: knopPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

@keyframes knopPop { 0% { transform: scale(0.8); opacity: 0.5; } 50% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }

/* FORMULIER & LINKERKOLOM */
.linkerkolom { width: 50%; padding: 40px; background: #f0f4f8; overflow-y: auto; border-right: 1px solid #e2e8f0; }
.hoofdtitel { font-size: 18px; font-weight: 700; color: #2d3748; margin-top: 35px; margin-bottom: 15px; letter-spacing: 0px; text-transform: none; }

/* VARIANTEN EN KLEUREN */
.varianten-grid { display: flex; gap: 15px; margin-bottom: 20px; }
.variant-kaart { flex: 1; border: 2px solid #edf2f7; border-radius: 6px; padding: 15px; text-align: center; cursor: pointer; font-size: 12px; font-weight: 600; color: #a0aec0; background-color: #fafbfe; }
.variant-kaart.actief { border-color: #4A90E2; color: #4A90E2; background-color: #ffffff; }
.variant-kaart.inactief { opacity: 0.5; cursor: not-allowed; background-color: #f8fafc; border-color: #e2e8f0; color: #cbd5e0; }

.kleur-kiezer { display: flex; gap: 12px; margin-bottom: 25px; flex-wrap: nowrap; overflow-x: auto; padding-bottom: 8px; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
.kleur-kiezer::-webkit-scrollbar { display: none; }
.kleur-rondje { width: 26px; height: 26px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: transform 0.1s ease; flex-shrink: 0;}
.kleur-rondje:hover { transform: scale(1.1); }
.kleur-rondje.actief { border-color: #333; }

/* ONDERDELEN KNOPPEN */
.onderdelen-grid { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 30px; border-bottom: 2px solid #edf2f7; padding-bottom: 25px; }
.onderdeel-knop { background: #4A90E2; color: white; border: 1px solid #4A90E2; padding: 10px 18px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.onderdeel-knop:hover { background-color: #357ABD; border-color: #357ABD; }
.knop-uit { background: #DBEAFE; color: #4A90E2; border-color: transparent; }
.knop-uit:hover { background: #BFDBFE; }

/* GRID & INPUTS */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;}
.volledige-breedte { grid-column: span 2; }
.form-groep label { display: block; margin-bottom: 8px; font-size: 13px; font-weight: 600; color: #4a5568; text-align: left;}
.form-groep input, .form-groep textarea, .form-groep select { width: 100%; padding: 12px; border: 1px solid #cbd5e0; border-radius: 6px; font-size: 14px; background: #ffffff; transition: all 0.2s;}
.form-groep input:focus, .form-groep textarea:focus, .form-groep select:focus { border-color: #4A90E2; outline: none; background: white; }

/* TOGGLES (SCHUIFJES) */
.toggle-container { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; }
.toggle-label { font-size: 14px; color: #4a5568; }
.toggle-switch { position: relative; display: inline-block; width: 44px; height: 24px; }
.toggle-switch input { opacity: 0; width: 0; height: 0; }
.toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e0; transition: .3s; border-radius: 24px; }
.toggle-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
.toggle-switch input:checked + .toggle-slider { background-color: #4A90E2; }
.toggle-switch input:checked + .toggle-slider:before { transform: translateX(20px); }

/* FOTO UPLOAD */
.foto-upload-sectie { display: flex; flex-direction: column; gap: 10px; }
.foto-preview-container { display: flex; align-items: center; gap: 20px; }
.foto-preview { width: 110px; height: 110px; border-radius: 50%; background-color: #f8fafc; border: 2px dashed #cbd5e0; background-size: cover; background-position: center; display: flex; justify-content: center; align-items: center; overflow: hidden; }
.foto-acties { display: flex; flex-direction: column; gap: 5px; }
.foto-upload-knop { color: #4A90E2; font-size: 13px; font-weight: 600; cursor: pointer; transition: color 0.2s; }
.foto-upload-knop:hover { color: #2b6cb0; text-decoration: underline; }
.foto-verwijder-knop { background: none; border: none; color: #e53e3e; font-size: 13px; font-weight: 600; cursor: pointer; text-align: left; padding: 0; }
.foto-verwijder-knop:hover { text-decoration: underline; }

/* DYNAMISCHE BLOKKEN EN ALGEMENE KNOPPEN */
.dynamisch-blok { 
    background-color: #ffffff;
    border: none;
    border-radius: 20px; 
    padding: 30px; 
    margin-bottom: 25px; 
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease; 
}
.hoofd-knop { background: #4A90E2; color: white; border: none; padding: 12px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
.toevoeg-knop { background: #eff6ff; color: #4A90E2; border: none; padding: 12px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; width: 100%; margin-top: 10px; margin-bottom: 30px; transition: all 0.2s ease; }
.toevoeg-knop:hover { background: #DBEAFE; transform: translateY(-1px); }
.toevoeg-knop-sec { background: transparent; color: #4A90E2; border: none; font-size: 13px; font-weight: 600; cursor: pointer; }
.verwijder-knop { background: none; border: none; color: #e53e3e; font-size: 12px; font-weight: 600; cursor: pointer; }
.verwijder-knop:hover { text-decoration: underline; }
.verwijder-knop-klein { background: #fee2e2; border: none; color: #e53e3e; width: 42px; height: 44px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px;}

/* AI KNOP STYLING */
.ai-knop { background: linear-gradient(135deg, #2b6cb0 0%, #2c5282 100%); color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 5px; }
.ai-knop:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 10px rgba(43, 108, 176, 0.3); }
.ai-knop:disabled { opacity: 0.6; cursor: not-allowed; }

/* LOADER */
.loader { border: 4px solid #f3f3f3; border-top: 4px solid #4A90E2; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* =========================================
   CV PAPIER RECHTERKOLOM & STYLING
   ========================================= */

.rechterkolom { 
    width: 50%; 
    padding: 40px; 
    background: #cbd5e0; 
    display: flex; 
    justify-content: center; 
    align-items: flex-start; 
    overflow-y: auto; 
    /* Het grijze kussen aan de onderkant, zodat hij nooit de taakbalk raakt */
    padding-bottom: 80px !important; 
}

/* De schaal-wrapper (Claude's techniek) */
.cv-scaler {
    width: calc(210mm * var(--scale));
    height: calc(297mm * var(--scale));
    flex-shrink: 0;
    position: relative;
}

.cv-papier { 
    width: 210mm !important; 
    min-width: 210mm !important; 
    height: 297mm !important; 
    background: white; 
    display: flex; 
    flex-direction: row;
    /* Forceert de flex-kinderen (zijbalk) om mee te rekken */
    align-items: stretch !important; 
    box-sizing: border-box;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08); 
    /* Kapt genadeloos alles af wat buiten het A4'tje valt */
    overflow: hidden !important; 
    
    /* Het schalen */
    transform: scale(var(--scale));
    transform-origin: top left;
}

/* DE FIX: Zorgt dat interne kolommen (zoals de blauwe zijbalk) ALTIJD de 297mm vullen */
.cv-papier > * {
    min-height: 100%;
}

/* FIX: Voorkom dubbele schaling als een sjabloon zelf ook de class .cv-papier heeft */
.cv-papier .cv-papier {
    transform: none !important;
    width: 100% !important;
    height: 100% !important;
    min-width: 0 !important;
    box-shadow: none !important;
    margin: 0 !important;
}

/* FIX: Tekst netjes uitvullen (justified) in de sjablonen */
.cv-papier p, 
.cv-papier .cv-p, 
.cv-papier .cv-info-kaart {
    text-align: justify !important;
    hyphens: auto;
    -webkit-hyphens: auto;
    word-wrap: break-word;
}

.cv-zijbalk { 
    width: 35%; 
    color: white; 
    padding: 40px 25px; 
    transition: background-color 0.3s ease; 
    text-align: left; 
}

.cv-hoofdkolom { width: 65%; padding: 40px 35px; text-align: left; }
.cv-profielfoto { width: 130px; height: 130px; background-color: #e2e8f0; border-radius: 50%; margin: 0 auto 30px auto; border: 4px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.cv-sectie-titel-zijbalk { font-size: 13px; font-weight: 700; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid rgba(255, 255, 255, 0.3); padding-bottom: 5px; }
.cv-tekst-zijbalk { font-size: 12px; margin-bottom: 12px; line-height: 1.4; }
.cv-naam { font-size: 32px; font-weight: 700; text-transform: uppercase; text-align: center; margin-bottom: 25px; color: #333; letter-spacing: 1px;}
.cv-sectie-titel-hoofd { font-size: 14px; font-weight: 700; text-transform: uppercase; border-bottom: 2px solid #edf2f7; padding-bottom: 5px; margin-top: 25px; margin-bottom: 10px; letter-spacing: 1px; transition: color 0.3s ease;}
.cv-item { margin-bottom: 20px; }
.cv-item-titel { font-size: 14px; font-weight: 700; color: #333; }
.cv-item-sub { font-size: 13px; font-weight: 600; color: #718096; margin-bottom: 4px; }
.cv-p { font-size: 13px; line-height: 1.5; color: #4a5568; }
.cv-p-italic { font-size: 13px; color: #a0aec0; font-style: italic; margin-bottom: 20px;}
.cv-lijst { padding-left: 20px; margin-bottom: 25px; font-size: 13px; color: #4a5568; line-height: 1.6; }
.cv-tag { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; background-color: #ffffff; }
.cv-info-kaart { padding: 12px 18px; border-radius: 12px; border-top: 1.5px solid #edf2f7; border-right: 1.5px solid #edf2f7; border-bottom: 1.5px solid #edf2f7; border-left: 4px solid; font-size: 13px; color: #4a5568; line-height: 1.5; margin-bottom: 25px; background-color: #ffffff; }

/* =========================================
   WYSIWYG SCHALING & RESPONSIVE DESIGN
   ========================================= */

:root { 
  --scale: 1; 
}

@media (max-width: 1700px) and (min-width: 1367px) { :root { --scale: 0.85; } }
@media (max-width: 1366px) and (min-width: 1025px) { :root { --scale: 0.70; } }
@media (max-width: 1024px) { 
    :root { --scale: 0.80; } 
    .container { flex-direction: column; height: auto; min-height: 100vh; }
    .linkerkolom { width: 100%; border-right: none; border-bottom: 2px solid #e2e8f0; }
    .rechterkolom { width: 100%; padding: 40px 20px; background-color: #cbd5e0; }
}
@media (max-width: 600px) { 
    :root { --scale: 0.42; } 
    .linkerkolom { padding: 20px 15px; }
    .form-grid { grid-template-columns: 1fr; }
    .volledige-breedte { grid-column: span 1; }
    .varianten-grid { flex-direction: column; gap: 10px; }
    .rechterkolom { padding: 30px 10px; }
}

/* =========================================
   PRINT STYLING VOOR DE PERFECTE PDF
   ========================================= */
@media print {
    :root { --scale: 1 !important; }
    
    .linkerkolom, .app-header, .zwevende-pdf-knop, .opslaan-knop, .download-knop, .menu-container-header, .inlog-achtergrond {
        display: none !important;
    }
    
    body, html { background: white !important; margin: 0 !important; padding: 0 !important; }
    .container { display: block !important; }
    .rechterkolom { width: 100% !important; padding: 0 !important; background: none !important; overflow: visible !important; display: block !important; }
    
    .cv-papier {
        margin: 0 !important; box-shadow: none !important;
        page-break-after: avoid !important; page-break-before: avoid !important;
    }

    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    @page { size: A4 portrait; margin: 0mm; }
}
</style>