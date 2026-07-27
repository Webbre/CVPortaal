// supabaseService.js
// ---------------------------------------------------------------------------
// De Supabase-uitvoering áchter de balie (cvRepository.js).
//
// LET OP: importeer de functies uit dit bestand NIET rechtstreeks in stores
// of componenten. Ga altijd via cvRepository.js.
//
// De toegangsregels in de database bepalen wat is toegestaan; deze laag
// vraagt alleen netjes. Een geweigerde opvraging geeft geen foutmelding maar
// een lege uitkomst — dat is normaal gedrag van Row Level Security.
// ---------------------------------------------------------------------------

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

// Het profiel verandert niet tijdens een sessie, dus we onthouden het na de
// eerste keer ophalen. Bij uitloggen wordt het gewist.
let profiel = null

async function huidigeGebruiker() {
  const { data } = await supabase.auth.getSession()
  return data.session?.user ?? null
}

// --- Authenticatie ---------------------------------------------------------

// Verstuurt een inloglink. Anders dan bij Firebase draagt deze link de
// sleutel zelf mee, waardoor hij op elk apparaat werkt zonder dat de app
// het e-mailadres opnieuw hoeft te vragen.
export async function stuurInlogLink(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin,
      // Alleen bestaande accounts kunnen inloggen. In CVPortaal worden
      // accounts aangemaakt door een coach, niet door de gebruiker zelf.
      shouldCreateUser: false,
    },
  })
  if (error) throw error
}

// Reageert op in- en uitloggen. Vuurt ook direct bij het laden van de pagina,
// zodat een bestaande sessie meteen wordt opgepikt.
export function luisterNaarInlogStatus(callback) {
  const { data } = supabase.auth.onAuthStateChange((_gebeurtenis, sessie) => {
    if (!sessie) profiel = null
    callback(sessie?.user ?? null)
  })
  return () => data.subscription.unsubscribe()
}

export async function logUit() {
  profiel = null
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// --- Profiel ---------------------------------------------------------------

// Haalt rol en organisatie op van de ingelogde gebruiker. Nodig omdat een
// cv altijd aan een organisatie hangt.
//
// Geeft null terug wanneer er geen profiel bestaat. Dat gebeurt als iemand
// wel een inlogaccount heeft maar niet door een coach is aangemeld — die
// hoort de app niet te kunnen gebruiken.
export async function haalProfielOp() {
  if (profiel) return profiel

  const gebruiker = await huidigeGebruiker()
  if (!gebruiker) return null

  const { data, error } = await supabase
    .from('gebruikers')
    .select('id, organisatie_id, rol, voornaam, achternaam, email')
    .eq('id', gebruiker.id)
    .maybeSingle()

  if (error) throw error
  profiel = data
  return data
}

// --- Cv-gegevens -----------------------------------------------------------

export async function haalGegevensOp() {
  const gebruiker = await huidigeGebruiker()
  if (!gebruiker) return null

  const { data, error } = await supabase
    .from('cv_documenten')
    .select('inhoud')
    .eq('inwoner_id', gebruiker.id)
    .maybeSingle()

  if (error) throw error
  return data?.inhoud ?? null
}

// Slaat het cv op. De volledige gegevens gaan als geheel in "inhoud";
// voornaam en achternaam worden daarnaast apart weggeschreven, zodat het
// beheerportaal daarop kan zoeken en sorteren zonder in het cv te kijken.
export async function slaGegevensOp(gegevens) {
  const gebruiker = await huidigeGebruiker()
  if (!gebruiker) return

  const eigenProfiel = await haalProfielOp()
  if (!eigenProfiel) {
    throw new Error('Geen profiel gevonden. Vraag je begeleider om je account te controleren.')
  }

  const { error } = await supabase
    .from('cv_documenten')
    .upsert(
      {
        inwoner_id: gebruiker.id,
        organisatie_id: eigenProfiel.organisatie_id,
        voornaam: gegevens.voornaam || null,
        achternaam: gegevens.achternaam || null,
        inhoud: gegevens,
      },
      { onConflict: 'inwoner_id' }
    )

  if (error) throw error
}

// --- AI --------------------------------------------------------------------

// Roept de Edge Function aan die de tekst verbetert. Het toegangspasje van de
// ingelogde gebruiker gaat automatisch mee.
export async function verbeterTekst(payload) {
  const { data, error } = await supabase.functions.invoke('verbeter-profiel', {
    body: payload,
  })
  if (error) throw error
  if (data?.fout) throw new Error(data.fout)
  return { data }
}