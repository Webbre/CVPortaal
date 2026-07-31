// ---------------------------------------------------------------------------
// maak-account — Supabase Edge Function
//
// Maakt een nieuw account aan. Dit kan niet vanuit de browser, omdat er een
// sleutel voor nodig is die alle beveiligingsregels omzeilt.
//
// Deze functie bewaakt zelf de deur:
//   - super_admin           mag keyusers aanmaken (organisatie meegeven)
//   - organisatie_beheerder mag keyusers en coaches aanmaken (eigen organisatie)
//   - coach                 mag cliënten aanmaken (eigen organisatie, wordt
//                           meteen aan zichzelf toegewezen)
//   - inwoner               mag niets
//
// De rol van de aanvrager wordt uit de DATABASE gelezen, niet uit het
// toegangspasje. Een pasje kan verouderd zijn; de database is de waarheid.
// ---------------------------------------------------------------------------

import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Wie mag welke rollen aanmaken.
const MAG_AANMAKEN: Record<string, string[]> = {
  super_admin: ['organisatie_beheerder'],
  organisatie_beheerder: ['organisatie_beheerder', 'coach'],
  coach: ['inwoner'],
  inwoner: [],
}

function antwoord(inhoud: unknown, status = 200) {
  return new Response(JSON.stringify(inhoud), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  let nieuweGebruikerId: string | null = null
  let beheerder: ReturnType<typeof createClient> | null = null

  try {
    // --- Wie belt er? -------------------------------------------------------
    const autorisatie = req.headers.get('Authorization')
    if (!autorisatie) {
      return antwoord({ fout: 'Je moet ingelogd zijn.' }, 401)
    }

    const alsGebruiker = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: autorisatie } } },
    )

    const { data: { user }, error: authFout } = await alsGebruiker.auth.getUser()
    if (authFout || !user) {
      return antwoord({ fout: 'Je moet ingelogd zijn.' }, 401)
    }

    // --- Mag deze persoon dit? ---------------------------------------------
    beheerder = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

const { data: aanvrager, error: aanvragerFout } = await beheerder
      .from('gebruikers')
      .select('id, rol, organisatie_id, actief')
      .eq('id', user.id)
      .maybeSingle()

    if (aanvragerFout) {
      console.error('Kon aanvrager niet ophalen:', aanvragerFout.message)
      return antwoord({ fout: 'Je gegevens konden niet worden opgehaald.' }, 500)
    }
    if (!aanvrager) {
      return antwoord({ fout: 'Er is geen profiel gevonden bij je account.' }, 403)
    }
    if (!aanvrager.actief) {
      return antwoord({ fout: 'Je account staat op inactief.' }, 403)
    }

    const verzoek = await req.json()
    const rol = String(verzoek?.rol ?? '')
    const voornaam = String(verzoek?.voornaam ?? '').trim()
    const achternaam = String(verzoek?.achternaam ?? '').trim()
    const nieuwEmail = String(verzoek?.email ?? '').trim().toLowerCase()

    const toegestaan = MAG_AANMAKEN[aanvrager.rol] ?? []
    if (!toegestaan.includes(rol)) {
      return antwoord({ fout: `Je mag geen account met rol "${rol}" aanmaken (jouw rol: ${aanvrager.rol}).` }, 403)
    }

    // --- Klopt de invoer? ---------------------------------------------------
    if (!voornaam || !achternaam) {
      return antwoord({ fout: 'Vul een voornaam en achternaam in.' }, 400)
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nieuwEmail)) {
      return antwoord({ fout: 'Vul een geldig e-mailadres in.' }, 400)
    }

    // De organisatie komt van de aanvrager, nooit uit het verzoek — anders zou
    // iemand een account in een andere organisatie kunnen plaatsen.
    const organisatieId = aanvrager.rol === 'super_admin'
      ? String(verzoek?.organisatie_id ?? '')
      : aanvrager.organisatie_id

    if (!organisatieId) {
      return antwoord({ fout: 'Er is geen organisatie bekend.' }, 400)
    }

    // --- Aanmaken -----------------------------------------------------------
    const { data: gemaakt, error: maakFout } = await beheerder.auth.admin.createUser({
      email: nieuwEmail,
      email_confirm: true,
    })

    if (maakFout || !gemaakt?.user) {
      const bestaatAl = (maakFout?.message ?? '').toLowerCase().includes('already')
      return antwoord({
        fout: bestaatAl
          ? 'Er bestaat al een account met dit e-mailadres.'
          : 'Het account kon niet worden aangemaakt.',
      }, 400)
    }

    nieuweGebruikerId = gemaakt.user.id

    const { error: profielFout } = await beheerder.from('gebruikers').insert({
      id: nieuweGebruikerId,
      organisatie_id: organisatieId,
      rol,
      voornaam,
      achternaam,
      email: nieuwEmail,
    })

    if (profielFout) throw new Error(profielFout.message)

    // Een cliënt wordt meteen toegewezen aan de coach die hem aanmaakt.
    if (rol === 'inwoner' && aanvrager.rol === 'coach') {
      const { error: toewijzingFout } = await beheerder.from('coach_toewijzingen').insert({
        coach_id: aanvrager.id,
        inwoner_id: nieuweGebruikerId,
        organisatie_id: organisatieId,
        toegewezen_door: aanvrager.id,
      })
      if (toewijzingFout) throw new Error(toewijzingFout.message)
    }

    await beheerder.from('auditlog').insert({
      actor_id: aanvrager.id,
      actor_rol: aanvrager.rol,
      organisatie_id: organisatieId,
      actie: 'account_aangemaakt',
      betreft_gebruiker_id: nieuweGebruikerId,
      details: { rol },
    })

    return antwoord({
      gelukt: true,
      gebruiker: { id: nieuweGebruikerId, voornaam, achternaam, email: nieuwEmail, rol },
    })
  } catch (fout) {
    // Mislukt er iets ná het aanmaken van het inlogaccount, dan halen we dat
    // weer weg. Anders blijft er een account zonder profiel achter, en dat kan
    // wel inloggen maar nergens bij.
    if (nieuweGebruikerId && beheerder) {
      await beheerder.auth.admin.deleteUser(nieuweGebruikerId)
    }
    console.error('Fout bij aanmaken account:', (fout as Error).message)
    return antwoord({ fout: 'Het account kon niet worden aangemaakt.' }, 500)
  }
})