// ---------------------------------------------------------------------------
// Test van de toegangsregels (RLS) van CVPortaal.
//
// Logt in als drie testgebruikers en controleert per handeling of de database
// die toestaat of weigert. Bedoeld om na elke wijziging aan de database
// opnieuw te draaien: regels die niet getest zijn, zijn schijnveiligheid.
//
// Draaien met:  node test-toegangsregels.mjs
//
// LET OP: dit script hoort bij de TESTOMGEVING. De accounts hieronder zijn
// wegwerpaccounts; gebruik hier nooit gegevens van echte personen.
// ---------------------------------------------------------------------------

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://dkaxthpqwywpbwfhfewi.supabase.co'
const PUBLISHABLE_KEY = 'sb_publishable_c3f4QzTmP-WBkhPzwwUpTg_bcIUmDzG'
const WACHTWOORD = 'Tbontbtitq1447!'

const EMAIL_CLIENT_A = 'clienta@test.nl'
const EMAIL_CLIENT_B = 'clientb@test.nl'
const EMAIL_COACH = 'coach@test.nl'

let aantalGoed = 0
let aantalFout = 0

function meld(omschrijving, isGoed, toelichting = '') {
  if (isGoed) {
    console.log(`  \x1b[32m✔\x1b[0m ${omschrijving}`)
    aantalGoed++
  } else {
    console.log(`  \x1b[31m✘\x1b[0m ${omschrijving}${toelichting ? ` — ${toelichting}` : ''}`)
    aantalFout++
  }
}

async function logIn(email) {
  const client = createClient(SUPABASE_URL, PUBLISHABLE_KEY)
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password: WACHTWOORD,
  })
  if (error) {
    throw new Error(`Inloggen als ${email} mislukt: ${error.message}`)
  }
  return {
    client,
    id: data.user.id,
    pasje: leesPasje(data.session.access_token),
  }
}

// Leest de rol en organisatie uit het toegangspasje (JWT). Als hier niets in
// staat, werkt de Auth Hook niet en falen alle rol-afhankelijke regels.
function leesPasje(token) {
  const inhoud = JSON.parse(
    Buffer.from(token.split('.')[1], 'base64').toString('utf8')
  )
  return { rol: inhoud.app_rol ?? null, organisatie: inhoud.app_organisatie ?? null }
}

// Een select die door RLS wordt geblokkeerd geeft geen foutmelding, maar een
// lege uitkomst. Beide gevallen tellen als "geen toegang".
async function magLezen(client, tabel, kolom, waarde) {
  const { data, error } = await client.from(tabel).select('*').eq(kolom, waarde)
  if (error) return { toegang: false, reden: error.message }
  return { toegang: (data?.length ?? 0) > 0, aantal: data?.length ?? 0 }
}

async function magWijzigen(client, inwonerId, nieuweTekst) {
  const { data, error } = await client
    .from('cv_documenten')
    .update({ inhoud: { profieltekst: nieuweTekst } })
    .eq('inwoner_id', inwonerId)
    .select()
  if (error) return { toegang: false, reden: error.message }
  return { toegang: (data?.length ?? 0) > 0 }
}

async function magVerwijderen(client, inwonerId) {
  const { data, error } = await client
    .from('cv_documenten')
    .delete()
    .eq('inwoner_id', inwonerId)
    .select()
  if (error) return { toegang: false, reden: error.message }
  return { toegang: (data?.length ?? 0) > 0 }
}

async function main() {
  console.log('\n=== Toegangsregels CVPortaal ===\n')

  const clientA = await logIn(EMAIL_CLIENT_A)
  const clientB = await logIn(EMAIL_CLIENT_B)
  const coach = await logIn(EMAIL_COACH)

  // --- Het toegangspasje -----------------------------------------------------
  // Zonder rol en organisatie op het pasje werken de rol-regels niet. Dit is
  // de eerste controle, omdat alle andere tests erop leunen.
  console.log('Toegangspasje (JWT-claims)')
  meld(
    `client A heeft rol "inwoner"`,
    clientA.pasje.rol === 'inwoner',
    `gevonden: ${clientA.pasje.rol}`
  )
  meld(
    `coach heeft rol "coach"`,
    coach.pasje.rol === 'coach',
    `gevonden: ${coach.pasje.rol}`
  )
  meld(
    'coach heeft een organisatie op het pasje',
    coach.pasje.organisatie !== null,
    'Auth Hook waarschijnlijk niet actief'
  )

  // --- Client A --------------------------------------------------------------
  console.log('\nClient A')
  {
    const eigen = await magLezen(clientA.client, 'cv_documenten', 'inwoner_id', clientA.id)
    meld('mag het eigen cv lezen', eigen.toegang, eigen.reden)

    const ander = await magLezen(clientA.client, 'cv_documenten', 'inwoner_id', clientB.id)
    meld('mag het cv van client B NIET lezen', !ander.toegang)

    const eigenWijzigen = await magWijzigen(clientA.client, clientA.id, 'Bijgewerkt door client A')
    meld('mag het eigen cv wijzigen', eigenWijzigen.toegang, eigenWijzigen.reden)

    const anderWijzigen = await magWijzigen(clientA.client, clientB.id, 'Ongeoorloofde wijziging')
    meld('mag het cv van client B NIET wijzigen', !anderWijzigen.toegang)

    const anderVerwijderen = await magVerwijderen(clientA.client, clientB.id)
    meld('mag het cv van client B NIET verwijderen', !anderVerwijderen.toegang)

    const eigenProfiel = await magLezen(clientA.client, 'gebruikers', 'id', clientA.id)
    meld('mag het eigen profiel lezen', eigenProfiel.toegang, eigenProfiel.reden)

    const andermansProfiel = await magLezen(clientA.client, 'gebruikers', 'id', clientB.id)
    meld('mag het profiel van client B NIET lezen', !andermansProfiel.toegang)
  }

  // --- Client B --------------------------------------------------------------
  console.log('\nClient B')
  {
    const eigen = await magLezen(clientB.client, 'cv_documenten', 'inwoner_id', clientB.id)
    meld('mag het eigen cv lezen', eigen.toegang, eigen.reden)

    const ander = await magLezen(clientB.client, 'cv_documenten', 'inwoner_id', clientA.id)
    meld('mag het cv van client A NIET lezen', !ander.toegang)
  }

  // --- Coach -----------------------------------------------------------------
  // De coach is toegewezen aan client A, niet aan client B. Dat verschil is
  // de kern van deze test.
  console.log('\nCoach (toegewezen aan client A, niet aan client B)')
  {
    const toegewezen = await magLezen(coach.client, 'cv_documenten', 'inwoner_id', clientA.id)
    meld('mag het cv van client A inzien', toegewezen.toegang, toegewezen.reden)

    const nietToegewezen = await magLezen(coach.client, 'cv_documenten', 'inwoner_id', clientB.id)
    meld('mag het cv van client B NIET inzien', !nietToegewezen.toegang)

    const wijzigen = await magWijzigen(coach.client, clientA.id, 'Wijziging door coach')
    meld('mag het cv van client A NIET wijzigen', !wijzigen.toegang)

    const verwijderen = await magVerwijderen(coach.client, clientA.id)
    meld('mag het cv van client A NIET verwijderen', !verwijderen.toegang)

    const toewijzingen = await magLezen(coach.client, 'coach_toewijzingen', 'coach_id', coach.id)
    meld('mag de eigen toewijzingen lezen', toewijzingen.toegang, toewijzingen.reden)

    const clientsInOrganisatie = await magLezen(coach.client, 'gebruikers', 'id', clientB.id)
    meld('mag profielen binnen de eigen organisatie lezen', clientsInOrganisatie.toegang)
  }

  // --- Auditlog --------------------------------------------------------------
  // Mag via de browser volledig onbereikbaar zijn, voor iedereen.
  console.log('\nAuditlog (moet voor iedereen onbereikbaar zijn)')
  {
    const lezen = await magLezen(coach.client, 'auditlog', 'actie', 'test')
    meld('coach mag de auditlog NIET lezen', !lezen.toegang)

    const { error } = await coach.client
      .from('auditlog')
      .insert({ actie: 'ongeoorloofde_regel' })
    meld('coach mag NIET in de auditlog schrijven', error !== null)
  }

  // --- Uitkomst --------------------------------------------------------------
  console.log('\n' + '─'.repeat(48))
  if (aantalFout === 0) {
    console.log(`\x1b[32mAlle ${aantalGoed} controles geslaagd.\x1b[0m`)
  } else {
    console.log(
      `\x1b[31m${aantalFout} van de ${aantalGoed + aantalFout} controles gefaald.\x1b[0m`
    )
    console.log('Los deze op voordat de app op deze database wordt aangesloten.')
  }
  console.log('')

  process.exit(aantalFout === 0 ? 0 : 1)
}

main().catch((fout) => {
  console.error(`\n\x1b[31mFout tijdens de test:\x1b[0m ${fout.message}\n`)
  process.exit(1)
})
