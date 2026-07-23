<script setup>
import { onMounted } from 'vue'
import { 
  gebruiker, isLaden, loginEmail, linkVerstuurd, 
  loginMetLink, initialiseerApp,
  vraagInlogEmail, inlogFout, bevestigInlogEmail
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

<div v-else-if="vraagInlogEmail" class="volledig-scherm center-inhoud inlog-achtergrond">
    <div class="inlog-box">
      <h1 style="color: #333; margin-bottom: 10px; font-size: 24px;">Nog één stap</h1>
      <p style="color: #718096; font-size: 14px; margin-bottom: 25px; line-height: 1.5;">
        Vul ter bevestiging het e-mailadres in waarmee je de inloglink hebt aangevraagd.
      </p>
      <div class="form-groep" style="text-align: left;">
        <label>E-mailadres</label>
        <input type="email" v-model="loginEmail" placeholder="jouw@email.nl" @keyup.enter="bevestigInlogEmail">
      </div>
      <p v-if="inlogFout" style="color: #c53030; font-size: 13px; font-weight: 600; margin-top: 12px;">{{ inlogFout }}</p>
      <button class="hoofd-knop" style="width: 100%; margin-top: 15px;" @click="bevestigInlogEmail">Inloggen</button>
    </div>
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
        <p v-if="inlogFout" style="color: #c53030; font-size: 13px; font-weight: 600; margin-top: 12px;">{{ inlogFout }}</p>
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
body { background-color: var(--kleur-achtergrond); overflow-x: hidden; color: var(--kleur-tekst); }

/* LAYOUT STRUCTUUR */
.volledig-scherm { height: 100vh; width: 100vw; display: flex; flex-direction: column; }
.center-inhoud { justify-content: center; align-items: center; text-align: center; }
.container { display: flex; height: 100vh; }
.relative { position: relative; }
.inlog-achtergrond { background-color: var(--kleur-accent-licht); }
.inlog-box { background: var(--kleur-wit); padding: 40px; border-radius: var(--radius-groot); width: 100%; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }

/* HEADER & MENU */
.app-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; border-bottom: 2px solid var(--kleur-scheiding); padding-bottom: 20px; margin-bottom: 20px; }
.app-header + .hoofdtitel { border-top: none; padding-top: 0; }
.app-logo-groep { display: flex; align-items: center; gap: 10px; }
.app-titel { font-size: 20px; font-weight: 800; color: var(--kleur-tekst-sterk); letter-spacing: -0.5px; margin: 0; }
.menu-container-header { position: relative; }
.tandwiel-knop { background: var(--kleur-wit); border: 1px solid var(--kleur-rand); border-radius: 50%; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center; cursor: pointer; transition: transform 0.3s, border-color 0.2s; color: var(--kleur-tekst-gedempt);}
.tandwiel-knop:hover { transform: rotate(45deg); border-color: var(--kleur-accent); color: var(--kleur-accent); }
.dropdown-menu-header { position: absolute; top: 50px; right: 0; background: var(--kleur-wit); border-radius: var(--radius-middel); box-shadow: var(--schaduw-menu); width: 220px; z-index: 100; border: 1px solid var(--kleur-rand); text-align: left; }
.dropdown-header { padding: 15px; background: var(--kleur-achtergrond-zacht); font-size: 12px; color: var(--kleur-tekst-zacht); border-bottom: 1px solid var(--kleur-rand); word-break: break-all; margin: 0;}
.dropdown-item { width: 100%; text-align: left; background: none; border: none; padding: 12px 15px; font-size: 13px; font-weight: 600; cursor: pointer; color: var(--kleur-tekst-gedempt); transition: background 0.2s;}
.dropdown-item:hover { background: var(--kleur-scheiding); color: var(--kleur-tekst-sterk);}

/* Styling voor Dynamische Opslaan knop */
.opslaan-knop { border-radius: var(--radius-blok); padding: 0 16px; height: 40px; display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; outline: none; border: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.opslaan-knop.inactief { background-color: var(--kleur-scheiding); color: var(--kleur-tekst-flauw); border: 1px solid var(--kleur-rand); cursor: not-allowed; opacity: 0.5; }
.opslaan-knop.actief { background-color: var(--kleur-accent); color: var(--kleur-wit); border: 1px solid var(--kleur-accent); cursor: pointer; box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3); opacity: 1; }
.opslaan-knop.actief:hover { background-color: var(--kleur-accent-hover); transform: translateY(-1px); }
.opslaan-knop.actief:active { transform: scale(0.95); }
.opslaan-knop.succes { background-color: var(--kleur-succes); color: var(--kleur-wit); border: 1px solid var(--kleur-succes); opacity: 1; cursor: default; animation: knopPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

@keyframes knopPop { 0% { transform: scale(0.8); opacity: 0.5; } 50% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }

/* FORMULIER & LINKERKOLOM */
.linkerkolom { width: 50%; padding: 40px; background: var(--kleur-achtergrond-kolom); overflow-y: auto; border-right: 1px solid var(--kleur-rand); }
.hoofdtitel { font-size: 18px; font-weight: 700; color: var(--kleur-tekst-titel); margin-top: 35px; margin-bottom: 15px; letter-spacing: 0px; text-transform: none; }

/* VARIANTEN EN KLEUREN */
.varianten-grid { display: flex; gap: 15px; margin-bottom: 20px; }
.variant-kaart { flex: 1; border: 2px solid var(--kleur-scheiding); border-radius: var(--radius-klein); padding: 15px; text-align: center; cursor: pointer; font-size: 12px; font-weight: 600; color: var(--kleur-tekst-flauw); background-color: #fafbfe; }
.variant-kaart.actief { border-color: var(--kleur-accent); color: var(--kleur-accent); background-color: var(--kleur-wit); }
.variant-kaart.inactief { opacity: 0.5; cursor: not-allowed; background-color: var(--kleur-achtergrond-zacht); border-color: var(--kleur-rand); color: var(--kleur-rand-sterk); }

.kleur-kiezer { display: flex; gap: 12px; margin-bottom: 25px; flex-wrap: nowrap; overflow-x: auto; padding-bottom: 8px; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
.kleur-kiezer::-webkit-scrollbar { display: none; }
.kleur-rondje { width: 26px; height: 26px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: transform 0.1s ease; flex-shrink: 0;}
.kleur-rondje:hover { transform: scale(1.1); }
.kleur-rondje.actief { border-color: var(--kleur-tekst); }

/* ONDERDELEN KNOPPEN */
.onderdelen-grid { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 30px; border-bottom: 2px solid var(--kleur-scheiding); padding-bottom: 25px; }
.onderdeel-knop { background: var(--kleur-accent); color: var(--kleur-wit); border: 1px solid var(--kleur-accent); padding: 10px 18px; border-radius: var(--radius-blok); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.onderdeel-knop:hover { background-color: var(--kleur-accent-hover); border-color: var(--kleur-accent-hover); }
.knop-uit { background: var(--kleur-accent-licht); color: var(--kleur-accent); border-color: transparent; }
.knop-uit:hover { background: var(--kleur-accent-licht-hover); }

/* GRID & INPUTS */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;}
.volledige-breedte { grid-column: span 2; }
.form-groep label { display: block; margin-bottom: 8px; font-size: 13px; font-weight: 600; color: var(--kleur-tekst-gedempt); text-align: left;}
.form-groep input, .form-groep textarea, .form-groep select { width: 100%; padding: 12px; border: 1px solid var(--kleur-rand-sterk); border-radius: var(--radius-klein); font-size: 14px; background: var(--kleur-wit); transition: all 0.2s;}
.form-groep input:focus, .form-groep textarea:focus, .form-groep select:focus { border-color: var(--kleur-accent); outline: none; background: var(--kleur-wit); }

/* TOGGLES (SCHUIFJES) */
.toggle-container { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; }
.toggle-label { font-size: 14px; color: var(--kleur-tekst-gedempt); }
.toggle-switch { position: relative; display: inline-block; width: 44px; height: 24px; }
.toggle-switch input { opacity: 0; width: 0; height: 0; }
.toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--kleur-rand-sterk); transition: .3s; border-radius: 24px; }
.toggle-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: var(--kleur-wit); transition: .3s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
.toggle-switch input:checked + .toggle-slider { background-color: var(--kleur-accent); }
.toggle-switch input:checked + .toggle-slider:before { transform: translateX(20px); }

/* FOTO UPLOAD */
.foto-upload-sectie { display: flex; flex-direction: column; gap: 10px; }
.foto-preview-container { display: flex; align-items: center; gap: 20px; }
.foto-preview { width: 110px; height: 110px; border-radius: 50%; background-color: var(--kleur-achtergrond-zacht); border: 2px dashed var(--kleur-rand-sterk); background-size: cover; background-position: center; display: flex; justify-content: center; align-items: center; overflow: hidden; }
.foto-acties { display: flex; flex-direction: column; gap: 5px; }
.foto-upload-knop { color: var(--kleur-accent); font-size: 13px; font-weight: 600; cursor: pointer; transition: color 0.2s; }
.foto-upload-knop:hover { color: var(--kleur-accent-donker); text-decoration: underline; }
.foto-verwijder-knop { background: none; border: none; color: var(--kleur-fout); font-size: 13px; font-weight: 600; cursor: pointer; text-align: left; padding: 0; }
.foto-verwijder-knop:hover { text-decoration: underline; }

/* DYNAMISCHE BLOKKEN EN ALGEMENE KNOPPEN */
.dynamisch-blok { 
    background-color: var(--kleur-wit);
    border: none;
    border-radius: var(--radius-blok); 
    padding: 30px; 
    margin-bottom: 25px; 
    box-shadow: var(--schaduw-kaart);
    transition: transform 0.2s ease, box-shadow 0.2s ease; 
}
.hoofd-knop { background: var(--kleur-accent); color: var(--kleur-wit); border: none; padding: 12px; border-radius: var(--radius-middel); font-size: 14px; font-weight: 600; cursor: pointer; }
.toevoeg-knop { background: var(--kleur-accent-zacht); color: var(--kleur-accent); border: none; padding: 12px; border-radius: var(--radius-groot); font-size: 14px; font-weight: 600; cursor: pointer; width: 100%; margin-top: 10px; margin-bottom: 30px; transition: all 0.2s ease; }
.toevoeg-knop:hover { background: var(--kleur-accent-licht); transform: translateY(-1px); }
.toevoeg-knop-sec { background: transparent; color: var(--kleur-accent); border: none; font-size: 13px; font-weight: 600; cursor: pointer; }
.verwijder-knop { background: none; border: none; color: var(--kleur-fout); font-size: 12px; font-weight: 600; cursor: pointer; }
.verwijder-knop:hover { text-decoration: underline; }
.verwijder-knop-klein { background: var(--kleur-fout-vlak-sterk); border: none; color: var(--kleur-fout); width: 42px; height: 44px; border-radius: var(--radius-klein); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px;}

/* AI KNOP STYLING */
.ai-knop { background: linear-gradient(135deg, var(--kleur-accent-donker) 0%, #2c5282 100%); color: var(--kleur-wit); border: none; padding: 6px 12px; border-radius: var(--radius-klein); font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 5px; }
.ai-knop:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 10px rgba(43, 108, 176, 0.3); }
.ai-knop:disabled { opacity: 0.6; cursor: not-allowed; }

/* LOADER */
.loader { border: 4px solid #f3f3f3; border-top: 4px solid var(--kleur-accent); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* =========================================
   CV PAPIER RECHTERKOLOM & STYLING
   ========================================= */

.rechterkolom { 
    width: 50%; 
    padding: 40px; 
    background: var(--kleur-rand-sterk); 
    display: flex; 
    justify-content: center; 
    align-items: flex-start; 
    overflow-y: auto; 
    padding-bottom: 80px !important; 
}

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
    background: var(--kleur-wit); 
    display: flex; 
    flex-direction: row;
    align-items: stretch !important; 
    box-sizing: border-box;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08); 
    overflow: hidden !important; 
    transform: scale(var(--scale));
    transform-origin: top left;
}

/* Zorgt dat interne kolommen (zoals de zijbalk) altijd de volledige hoogte vullen */
.cv-papier > * {
    min-height: 100%;
}

/* Voorkomt dubbele schaling als een sjabloon zelf ook de class .cv-papier heeft */
.cv-papier .cv-papier {
    transform: none !important;
    width: 100% !important;
    height: 100% !important;
    min-width: 0 !important;
    box-shadow: none !important;
    margin: 0 !important;
}

/* Tekst netjes uitvullen in de sjablonen */
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
    color: var(--kleur-wit); 
    padding: 40px 25px; 
    transition: background-color 0.3s ease; 
    text-align: left; 
}

.cv-hoofdkolom { width: 65%; padding: 40px 35px; text-align: left; }
.cv-profielfoto { width: 130px; height: 130px; background-color: var(--kleur-rand); border-radius: 50%; margin: 0 auto 30px auto; border: 4px solid var(--kleur-wit); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.cv-sectie-titel-zijbalk { font-size: 13px; font-weight: 700; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid rgba(255, 255, 255, 0.3); padding-bottom: 5px; }
.cv-tekst-zijbalk { font-size: 12px; margin-bottom: 12px; line-height: 1.4; }
.cv-naam { font-size: 32px; font-weight: 700; text-transform: uppercase; text-align: center; margin-bottom: 25px; color: var(--kleur-tekst); letter-spacing: 1px;}
.cv-sectie-titel-hoofd { font-size: 14px; font-weight: 700; text-transform: uppercase; border-bottom: 2px solid var(--kleur-scheiding); padding-bottom: 5px; margin-top: 25px; margin-bottom: 10px; letter-spacing: 1px; transition: color 0.3s ease;}
.cv-item { margin-bottom: 20px; }
.cv-item-titel { font-size: 14px; font-weight: 700; color: var(--kleur-tekst); }
.cv-item-sub { font-size: 13px; font-weight: 600; color: var(--kleur-tekst-zacht); margin-bottom: 4px; }
.cv-p { font-size: 13px; line-height: 1.5; color: var(--kleur-tekst-gedempt); }
.cv-p-italic { font-size: 13px; color: var(--kleur-tekst-flauw); font-style: italic; margin-bottom: 20px;}
.cv-lijst { padding-left: 20px; margin-bottom: 25px; font-size: 13px; color: var(--kleur-tekst-gedempt); line-height: 1.6; }
.cv-tag { display: inline-block; padding: 6px 14px; border-radius: var(--radius-blok); font-size: 12px; font-weight: 600; background-color: var(--kleur-wit); }
.cv-info-kaart { padding: 12px 18px; border-radius: var(--radius-groot); border-top: 1.5px solid var(--kleur-scheiding); border-right: 1.5px solid var(--kleur-scheiding); border-bottom: 1.5px solid var(--kleur-scheiding); border-left: 4px solid; font-size: 13px; color: var(--kleur-tekst-gedempt); line-height: 1.5; margin-bottom: 25px; background-color: var(--kleur-wit); }

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
    .linkerkolom { width: 100%; border-right: none; border-bottom: 2px solid var(--kleur-rand); }
    .rechterkolom { width: 100%; padding: 40px 20px; background-color: var(--kleur-rand-sterk); }
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