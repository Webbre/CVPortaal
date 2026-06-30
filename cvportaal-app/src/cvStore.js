import { ref, watch, computed } from 'vue'
import { 
  aiBrug, slaGegevensOp, haalGegevensOp, 
  stuurInlogLink, voltooiInloggen, 
  logUit, luisterNaarInlogStatus 
} from './databaseService.js'

export const gebruiker = ref(null)
export const isLaden = ref(true)
export const loginEmail = ref('')
export const linkVerstuurd = ref(false)
export const toonMenu = ref(false)

export const voornaam = ref('')
export const achternaam = ref('')
export const woonplaats = ref('') 
export const email = ref('')
export const telefoon = ref('')
export const geboorteJaar = ref('')
export const profieltekst = ref('')
export const heeftRijbewijs = ref(false)
export const heeftAuto = ref(false)
export const profielfoto = ref(null)
export const toonFotoOpCv = ref(true)
export const gekozenKleur = ref('#4A90E2')
export const gekozenSjabloon = ref('TemplateBasis')

export const toonWerkervaring = ref(false)
export const werkervaringen = ref([])
export const toonSterkePunten = ref(false)
export const sterkePunten = ref([])
export const toonOpleidingen = ref(false)
export const opleidingen = ref([])
export const toonTalen = ref(false)
export const talen = ref([])
export const toonHobbys = ref(false) 
export const hobbys = ref([]) 
export const toonMeerOverMij = ref(false)
export const meerOverMijTekst = ref('')

// NIEUW: E-mail validatie
export const emailFout = computed(() => {
  if (!email.value) return false;
  return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
})

// NIEUW: Karaktertellers (zonder spaties)
export const profielLengte = computed(() => profieltekst.value.replace(/\s/g, '').length)
export const meerOverMijLengte = computed(() => meerOverMijTekst.value.replace(/\s/g, '').length)

export const kleuren = [
  '#4A90E2', '#E24A4A', '#2ECC71', '#9B59B6', '#F1C40F',
  '#E67E22', '#FF85A2', '#1ABC9C', '#34495E',
  '#0F172A', '#64748B', '#0EA5E9', '#14B8A6', '#10B981', 
  '#8B5CF6', '#EC4899', '#F43F5E', '#D97706'
]

export const jarenLijst = []
for (let i = new Date().getFullYear() + 5; i >= 1980; i--) { jarenLijst.push(i) }
export const geboorteJarenLijst = []
for (let i = new Date().getFullYear() - 15; i >= 1950; i--) { geboorteJarenLijst.push(i) }

// AI Status voor Profiel
export const isAiLaden = ref(false)
export const origineleProfieltekst = ref('')
export const isAiToegepast = ref(false)

// NIEUW: AI Status voor Meer over mij
export const isAiLadenMeerOverMij = ref(false)
export const origineleMeerOverMijTekst = ref('')
export const isAiToegepastMeerOverMij = ref(false)

export const toonOpgeslagenFeedback = ref(false)
export const heeftOngeslagenWijzigingen = ref(false)
let opslaanTimer = null
let isAanHetOpslaan = false

export async function initialiseerApp() {
  try { await voltooiInloggen(); } catch (error) { console.error("Fout:", error); }

  luisterNaarInlogStatus(async (user) => {
    try {
      if (user) {
        gebruiker.value = user;
        const data = await haalGegevensOp();
        if (data) {
          voornaam.value = data.voornaam || ''; achternaam.value = data.achternaam || '';
          woonplaats.value = data.woonplaats || ''; email.value = data.email || '';
          telefoon.value = data.telefoon || ''; geboorteJaar.value = data.geboorteJaar || '';
          profieltekst.value = data.profieltekst || '';
          heeftRijbewijs.value = data.heeftRijbewijs || false; heeftAuto.value = data.heeftAuto || false;
          profielfoto.value = data.profielfoto || null; toonFotoOpCv.value = data.toonFotoOpCv !== undefined ? data.toonFotoOpCv : true;
          gekozenKleur.value = data.gekozenKleur || '#4A90E2'; gekozenSjabloon.value = data.gekozenSjabloon || 'TemplateBasis';
          
          toonWerkervaring.value = data.toonWerkervaring !== undefined ? data.toonWerkervaring : false;
          werkervaringen.value = (data.werkervaringen || []).map(w => ({ id: w.id || crypto.randomUUID(), ...w }));
          toonSterkePunten.value = data.toonSterkePunten !== undefined ? data.toonSterkePunten : false;
          sterkePunten.value = (data.sterkePunten || []).map(p => ({ id: p.id || crypto.randomUUID(), ...p }));
          toonOpleidingen.value = data.toonOpleidingen !== undefined ? data.toonOpleidingen : false;
          opleidingen.value = (data.opleidingen || []).map(o => ({ id: o.id || crypto.randomUUID(), ...o }));
          toonTalen.value = data.toonTalen !== undefined ? data.toonTalen : false;
          talen.value = (data.talen || []).map(t => ({ id: t.id || crypto.randomUUID(), ...t }));
          toonHobbys.value = data.toonHobbys !== undefined ? data.toonHobbys : false;
          hobbys.value = (data.hobbys || []).map(h => ({ id: h.id || crypto.randomUUID(), ...h }));
          toonMeerOverMij.value = data.toonMeerOverMij !== undefined ? data.toonMeerOverMij : false;
          meerOverMijTekst.value = data.meerOverMijTekst || '';
        }
      } else {
        gebruiker.value = null; maakCvLeeg(false);
      }
    } catch (error) { console.error("Fout bij inladen:", error); } 
    finally {
      isLaden.value = false;
      watch(verzamelData, () => { triggerOpslaan(); }, { deep: true });
    }
  });
}

export async function loginMetLink() { /* ... Blijft hetzelfde ... */
  if (!loginEmail.value) return;
  isLaden.value = true;
  try { await stuurInlogLink(loginEmail.value); linkVerstuurd.value = true; } 
  catch (error) { alert("Er ging iets mis: " + error.message); } 
  finally { isLaden.value = false; }
}

export async function logMijUit() { toonMenu.value = false; isLaden.value = true; await logUit(); }
export function resetMijnCV() { toonMenu.value = false; if (confirm("Weet je zeker dat je helemaal opnieuw wilt beginnen?")) { maakCvLeeg(true); } }

export function maakCvLeeg(forceerDatabaseOpslag = false) {
  voornaam.value = ''; achternaam.value = ''; woonplaats.value = ''; email.value = ''; telefoon.value = ''; geboorteJaar.value = '';
  profieltekst.value = ''; heeftRijbewijs.value = false; heeftAuto.value = false; profielfoto.value = null;
  gekozenKleur.value = '#4A90E2'; gekozenSjabloon.value = 'TemplateBasis';
  toonWerkervaring.value = false; werkervaringen.value = []; toonSterkePunten.value = false; sterkePunten.value = [];
  toonOpleidingen.value = false; opleidingen.value = []; toonTalen.value = false; talen.value = [];
  toonHobbys.value = false; hobbys.value = []; toonMeerOverMij.value = false; meerOverMijTekst.value = '';
  if (forceerDatabaseOpslag) triggerOpslaan();
}

export function verwerkFoto(event) {
  const file = event.target.files[0];
  if (file) { const reader = new FileReader(); reader.onload = (e) => { profielfoto.value = e.target.result }; reader.readAsDataURL(file); }
}
export function verwijderFoto() { profielfoto.value = null }
export function veranderKleur(kleur) { gekozenKleur.value = kleur }

export function voegWerkervaringToe() { werkervaringen.value.push({ id: crypto.randomUUID(), functie: '', bedrijf: '', vanMaand: '', vanJaar: '', totMaand: '', totJaar: '', isHuidigeBaan: false, omschrijving: '' }) }
export function verwijderWerkervaring(index) { werkervaringen.value.splice(index, 1) }
export function voegSterkPuntToe() { sterkePunten.value.push({ id: crypto.randomUUID(), tekst: '' }) }
export function verwijderSterkPunt(index) { sterkePunten.value.splice(index, 1) }
export function voegOpleidingToe() { opleidingen.value.push({ id: crypto.randomUUID(), type: 'Opleiding', studie: '', instelling: '', vanMaand: '', vanJaar: '', totMaand: '', totJaar: '', isHuidigeOpleiding: false, isBehaald: false, omschrijving: '' }) }
export function verwijderOpleiding(index) { opleidingen.value.splice(index, 1) }
export function voegTaalToe() { talen.value.push({ id: crypto.randomUUID(), naam: '', niveau: 0 }) }
export function verwijderTaal(index) { talen.value.splice(index, 1) }
export function zetTaalNiveau(taal, niveau) { taal.niveau = niveau; }
export function voegHobbyToe() { hobbys.value.push({ id: crypto.randomUUID(), tekst: '' }) }
export function verwijderHobby(index) { hobbys.value.splice(index, 1) }

export function sorteerErvaringen() {
  werkervaringen.value.sort((a, b) => {
    if (a.isHuidigeBaan && !b.isHuidigeBaan) return -1;
    if (!a.isHuidigeBaan && b.isHuidigeBaan) return 1;
    const jaarA = parseInt(a.vanJaar) || 0; const jaarB = parseInt(b.vanJaar) || 0;
    if (jaarB !== jaarA) return jaarB - jaarA;
    const maandA = parseInt(a.vanMaand) || 0; const maandB = parseInt(b.vanMaand) || 0;
    return maandB - maandA;
  });
}
export function sorteerOpleidingen() {
  opleidingen.value.sort((a, b) => {
    if (a.isHuidigeOpleiding && !b.isHuidigeOpleiding) return -1;
    if (!a.isHuidigeOpleiding && b.isHuidigeOpleiding) return 1;
    const jaarA = parseInt(a.vanJaar) || 0; const jaarB = parseInt(b.vanJaar) || 0;
    if (jaarB !== jaarA) return jaarB - jaarA;
    const maandA = parseInt(a.vanMaand) || 0; const maandB = parseInt(b.vanMaand) || 0;
    return maandB - maandA;
  });
}

// NIEUW: Één krachtige AI-functie voor beide velden
export async function verbeterMetAI(type = 'profiel') {
  const isProfiel = type === 'profiel';
  const tekstRef = isProfiel ? profieltekst : meerOverMijTekst;
  const isToegepastRef = isProfiel ? isAiToegepast : isAiToegepastMeerOverMij;
  const origineleRef = isProfiel ? origineleProfieltekst : origineleMeerOverMijTekst;
  const isLadenRef = isProfiel ? isAiLaden : isAiLadenMeerOverMij;

  if (isToegepastRef.value) { 
    tekstRef.value = origineleRef.value; 
    isToegepastRef.value = false; 
    return; 
  }
  if (!tekstRef.value) { alert("Typ eerst een stukje tekst zodat de AI iets heeft om mee te werken."); return; }
  
  isLadenRef.value = true;
  origineleRef.value = tekstRef.value;

  try {
    const resultaat = await aiBrug({ tekst: tekstRef.value, type: type });
    const aiData = resultaat.data; 
    if (aiData.verbeterdeTekst) { tekstRef.value = aiData.verbeterdeTekst; }
    
    // Alleen kwaliteiten toevoegen als het om het hoofdprofiel gaat
    if (isProfiel && aiData.kwaliteiten && Array.isArray(aiData.kwaliteiten)) {
      sterkePunten.value = [];
      aiData.kwaliteiten.forEach(punt => { sterkePunten.value.push({ id: crypto.randomUUID(), tekst: punt }); });
      toonSterkePunten.value = true;
    }
    isToegepastRef.value = true;
  } catch (error) {
    console.error("Fout bij het ophalen van AI:", error);
    alert("Oeps, de AI is even niet bereikbaar. Controleer je verbinding.");
  } finally {
    isLadenRef.value = false;
  }
}

function verzamelData() {
  return {
    voornaam: voornaam.value, achternaam: achternaam.value, woonplaats: woonplaats.value, email: email.value, telefoon: telefoon.value, geboorteJaar: geboorteJaar.value, heeftRijbewijs: heeftRijbewijs.value, heeftAuto: heeftAuto.value, profielfoto: profielfoto.value, toonFotoOpCv: toonFotoOpCv.value, profieltekst: profieltekst.value, gekozenKleur: gekozenKleur.value, gekozenSjabloon: gekozenSjabloon.value, toonWerkervaring: toonWerkervaring.value, werkervaringen: werkervaringen.value, toonSterkePunten: toonSterkePunten.value, sterkePunten: sterkePunten.value, toonOpleidingen: toonOpleidingen.value, opleidingen: opleidingen.value, toonTalen: toonTalen.value, talen: talen.value, toonHobbys: toonHobbys.value, hobbys: hobbys.value, toonMeerOverMij: toonMeerOverMij.value, meerOverMijTekst: meerOverMijTekst.value
  };
}

export async function voerOpslaanUit() {
  if (!gebruiker.value || isAanHetOpslaan) return;
  isAanHetOpslaan = true; heeftOngeslagenWijzigingen.value = false; toonOpgeslagenFeedback.value = true;
  try { await slaGegevensOp(verzamelData()); } 
  catch (error) { console.error("Fout bij opslaan:", error); heeftOngeslagenWijzigingen.value = true; } 
  finally {
    isAanHetOpslaan = false;
    setTimeout(() => { if (!heeftOngeslagenWijzigingen.value) { toonOpgeslagenFeedback.value = false; } }, 2000);
  }
}

export function triggerOpslaan() {
  if (!gebruiker.value || isLaden.value) return;
  heeftOngeslagenWijzigingen.value = true; toonOpgeslagenFeedback.value = false;
  clearTimeout(opslaanTimer); opslaanTimer = setTimeout(() => { voerOpslaanUit(); }, 1500); 
}

export async function forceerOpslaan() {
  if (!heeftOngeslagenWijzigingen.value || !gebruiker.value || isLaden.value || toonOpgeslagenFeedback.value) return;
  clearTimeout(opslaanTimer); await voerOpslaanUit(); 
}