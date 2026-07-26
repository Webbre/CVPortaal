// ---------------------------------------------------------------------------
// Test van de toegangsregels (RLS) van CVPortaal.
//
// Logt in als vijf testgebruikers, verdeeld over twee organisaties, en
// controleert per handeling of de database die toestaat of weigert.
// Bedoeld om na elke wijziging aan de database opnieuw te draaien: regels
// die niet getest zijn, zijn schijnveiligheid.
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

const ORGANISATIE_1 = '11111111-1111-1111-1111-111111111111'
const ORGANISATIE_2 = '22222222-2222-2222-2222-222222222222'

// Organisatie 1: client A en B, coach toegewezen aan A.
const EMAIL_CLIENT_A = 'clienta@test.nl'
const EMAIL_CLIENT_B = 'clientb@test.nl'
const EMAIL_COACH_1 = 'coach@test.nl'

// Organisatie 2: client C, coach toegewezen aan C.
const EMAIL_CLIENT_C = 'clientc@test.nl'
const EMAIL_COACH_2 = 'coach2@test.nl'

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
  const coach1 = await logIn(EMAIL_COACH_1)
  const clientC = await logIn(EMAIL_CLIENT_C)
  const coach2 = await logIn(EMAIL_COACH_2)

  // --- Het toegangspasje -----------------------------------------------------
  // Zonder rol en organisatie op het pasje werken de rol-regels niet. Dit is
  // de eerste controle, omdat alle andere tests erop leunen.
  console.log('Toegangspasje (JWT-claims)')
  meld(
    'client A heeft rol "inwoner"',
    clientA.pasje.rol === 'inwoner',
    `gevonden: ${clientA.pasje.rol}`
  )
  meld(
    'coach 1 heeft rol "coach"',
    coach1.pasje.rol === 'coach',
    `gevonden: ${coach1.pasje.rol}`
  )
  meld(
    'coach 1 hoort bij organisatie 1',
    coach1.pasje.organisatie === ORGANISATIE_1,
    `gevonden: ${coach1.pasje.organisatie}`
  )
  meld(
    'coach 2 hoort bij organisatie 2',
    coach2.pasje.organisatie === ORGANISATIE_2,
    `gevonden: ${coach2.pasje.organisatie}`
  )

  // --- Client A --------------------------------------------------------------
  console.log('\nClient A (organisatie 1)')
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
  console.log('\nClient B (organisatie 1)')
  {
    const eigen = await magLezen(clientB.client, 'cv_documenten', 'inwoner_id', clientB.id)
    meld('mag het eigen cv lezen', eigen.toegang, eigen.reden)

    const ander = await magLezen(clientB.client, 'cv_documenten', 'inwoner_id', clientA.id)
    meld('mag het cv van client A NIET lezen', !ander.toegang)
  }

  // --- Coach binnen de eigen organisatie -------------------------------------
  // Coach 1 is toegewezen aan client A, niet aan client B. Dat verschil is
  // de kern van deze test.
  console.log('\nCoach 1 (toegewezen aan client A, niet aan client B)')
  {
    const toegewezen = await magLezen(coach1.client, 'cv_documenten', 'inwoner_id', clientA.id)
    meld('mag het cv van client A inzien', toegewezen.toegang, toegewezen.reden)

    const nietToegewezen = await magLezen(coach1.client, 'cv_documenten', 'inwoner_id', clientB.id)
    meld('mag het cv van client B NIET inzien', !nietToegewezen.toegang)

    const wijzigen = await magWijzigen(coach1.client, clientA.id, 'Wijziging door coach')
    meld('mag het cv van client A NIET wijzigen', !wijzigen.toegang)

    const verwijderen = await magVerwijderen(coach1.client, clientA.id)
    meld('mag het cv van client A NIET verwijderen', !verwijderen.toegang)

    const toewijzingen = await magLezen(coach1.client, 'coach_toewijzingen', 'coach_id', coach1.id)
    meld('mag de eigen toewijzingen lezen', toewijzingen.toegang, toewijzingen.reden)

    const clientsInOrganisatie = await magLezen(coach1.client, 'gebruikers', 'id', clientB.id)
    meld('mag profielen binnen de eigen organisatie lezen', clientsInOrganisatie.toegang)
  }

  // --- Scheiding tussen organisaties -----------------------------------------
  // De belangrijkste test voor een multi-tenant opzet: organisatie 1 en 2
  // delen dezelfde database en mogen elkaar op geen enkele manier zien.
  // Dit is de vraag waar een gemeentelijke inkoper op doorvraagt.
  console.log('\nScheiding tussen organisaties')
  {
    // Positieve controles: binnen de eigen organisatie werkt alles normaal.
    const eigenOrg1 = await magLezen(coach1.client, 'organisaties', 'id', ORGANISATIE_1)
    meld('coach 1 mag de eigen organisatie lezen', eigenOrg1.toegang, eigenOrg1.reden)

    const eigenOrg2 = await magLezen(coach2.client, 'organisaties', 'id', ORGANISATIE_2)
    meld('coach 2 mag de eigen organisatie lezen', eigenOrg2.toegang, eigenOrg2.reden)

    const coach2EigenClient = await magLezen(coach2.client, 'cv_documenten', 'inwoner_id', clientC.id)
    meld('coach 2 mag het cv van de eigen client C inzien', coach2EigenClient.toegang, coach2EigenClient.reden)

    // De grens: niets van de andere organisatie is zichtbaar.
    const org2ZietOrg1 = await magLezen(coach2.client, 'organisaties', 'id', ORGANISATIE_1)
    meld('coach 2 mag organisatie 1 NIET lezen', !org2ZietOrg1.toegang)

    const org1ZietOrg2 = await magLezen(coach1.client, 'organisaties', 'id', ORGANISATIE_2)
    meld('coach 1 mag organisatie 2 NIET lezen', !org1ZietOrg2.toegang)

    const coach2ZietCvA = await magLezen(coach2.client, 'cv_documenten', 'inwoner_id', clientA.id)
    meld('coach 2 mag het cv van client A (andere organisatie) NIET inzien', !coach2ZietCvA.toegang)

    const coach1ZietCvC = await magLezen(coach1.client, 'cv_documenten', 'inwoner_id', clientC.id)
    meld('coach 1 mag het cv van client C (andere organisatie) NIET inzien', !coach1ZietCvC.toegang)

    const coach2ZietProfielA = await magLezen(coach2.client, 'gebruikers', 'id', clientA.id)
    meld('coach 2 mag het profiel van client A NIET lezen', !coach2ZietProfielA.toegang)

    const coach1ZietProfielC = await magLezen(coach1.client, 'gebruikers', 'id', clientC.id)
    meld('coach 1 mag het profiel van client C NIET lezen', !coach1ZietProfielC.toegang)

    const coach2WijzigtCvA = await magWijzigen(coach2.client, clientA.id, 'Poging vanuit andere organisatie')
    meld('coach 2 mag het cv van client A NIET wijzigen', !coach2WijzigtCvA.toegang)

    const clientCZietCvA = await magLezen(clientC.client, 'cv_documenten', 'inwoner_id', clientA.id)
    meld('client C mag het cv van client A NIET lezen', !clientCZietCvA.toegang)

    const coach2ZietToewijzingen1 = await magLezen(
      coach2.client, 'coach_toewijzingen', 'coach_id', coach1.id
    )
    meld('coach 2 mag de toewijzingen van coach 1 NIET lezen', !coach2ZietToewijzingen1.toegang)
  }

  // --- Auditlog --------------------------------------------------------------
  // Mag via de browser volledig onbereikbaar zijn, voor iedereen.
  console.log('\nAuditlog (moet voor iedereen onbereikbaar zijn)')
  {
    const lezen = await magLezen(coach1.client, 'auditlog', 'actie', 'test')
    meld('coach mag de auditlog NIET lezen', !lezen.toegang)

    const { error } = await coach1.client
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
