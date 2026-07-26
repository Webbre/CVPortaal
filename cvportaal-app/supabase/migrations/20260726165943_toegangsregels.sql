-- ---------------------------------------------------------------------------
-- Toegangsregels (RLS-policies) CVPortaal
--
-- Vult het toegangspasje (JWT) bij het inloggen met rol en organisatie, en
-- legt daarna per tabel vast wie wat mag. Uitgangspunt: alles is dicht;
-- deze regels openen alleen wat aantoonbaar nodig is.
--
-- Rollen: super_admin (alleen serverkant), organisatie_beheerder (keyuser),
-- coach (inzien, nooit wijzigen), inwoner (client, alleen eigen cv).
-- ---------------------------------------------------------------------------

-- De rol heet 'coach', niet 'werkcoach' (terminologie CVPortaal).
alter type public.gebruiker_rol rename value 'werkcoach' to 'coach';

-- --- Deel 1: rol en organisatie op het toegangspasje -----------------------
-- Draait automatisch zodra Supabase een pasje uitgeeft of ververst.
-- Leest de rol en organisatie uit public.gebruikers en zet ze in het pasje,
-- zodat de regels hieronder ze direct kunnen uitlezen zonder de tabel te
-- hoeven raadplegen (sneller, en voorkomt een kip-ei-probleem).

create or replace function public.vul_toegangspasje(event jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  claims jsonb;
  gebruiker_rol text;
  gebruiker_org uuid;
begin
  select rol::text, organisatie_id
    into gebruiker_rol, gebruiker_org
    from public.gebruikers
    where id = (event->>'user_id')::uuid;

  claims := event->'claims';

  if gebruiker_rol is not null then
    claims := jsonb_set(claims, '{app_rol}', to_jsonb(gebruiker_rol));
  else
    claims := jsonb_set(claims, '{app_rol}', 'null'::jsonb);
  end if;

  if gebruiker_org is not null then
    claims := jsonb_set(claims, '{app_organisatie}', to_jsonb(gebruiker_org::text));
  else
    claims := jsonb_set(claims, '{app_organisatie}', 'null'::jsonb);
  end if;

  return jsonb_set(event, '{claims}', claims);
end;
$$;

-- Alleen Supabase's eigen pasjes-uitgever mag deze functie aanroepen.
grant usage on schema public to supabase_auth_admin;
grant execute on function public.vul_toegangspasje to supabase_auth_admin;
revoke execute on function public.vul_toegangspasje from authenticated, anon, public;
grant select on table public.gebruikers to supabase_auth_admin;

-- --- Deel 2: hulpfuncties om het pasje te lezen ----------------------------
-- Kleine leesfuncties die de regels hieronder gebruiken. Ze kijken alleen
-- naar het pasje van de ingelogde gebruiker, nooit naar tabellen.

create or replace function public.mijn_rol()
returns text
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claims', true)::jsonb->>'app_rol', 'null');
$$;

create or replace function public.mijn_organisatie()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claims', true)::jsonb->>'app_organisatie', 'null')::uuid;
$$;

-- --- Deel 3: de regels per tabel -------------------------------------------

-- ORGANISATIES ---------------------------------------------------------------
-- Iedereen die is ingelogd mag de gegevens van zijn EIGEN organisatie lezen
-- (nodig voor huisstijl: accentkleur, logo). Niemand mag er via de browser
-- iets aan wijzigen; dat gebeurt alleen vanaf de serverkant.

create policy organisaties_lezen_eigen
  on public.organisaties
  for select
  to authenticated
  using (id = public.mijn_organisatie());

-- GEBRUIKERS -----------------------------------------------------------------
-- Iedereen mag zijn eigen profiel lezen. Een keyuser mag daarnaast alle
-- profielen binnen de eigen organisatie lezen; een coach ook (nodig om
-- clients te kunnen zien in het beheerportaal). Wijzigen gebeurt alleen
-- vanaf de serverkant.

create policy gebruikers_lezen_zichzelf
  on public.gebruikers
  for select
  to authenticated
  using (id = (select auth.uid()));

create policy gebruikers_lezen_binnen_organisatie
  on public.gebruikers
  for select
  to authenticated
  using (
    public.mijn_rol() in ('organisatie_beheerder', 'coach')
    and organisatie_id = public.mijn_organisatie()
  );

-- COACH-TOEWIJZINGEN ---------------------------------------------------------
-- Een coach ziet zijn eigen toewijzingen; een keyuser ziet alle toewijzingen
-- binnen de organisatie. Aanmaken en beëindigen gebeurt alleen vanaf de
-- serverkant (met auditlog-regel).

create policy toewijzingen_lezen_eigen_coach
  on public.coach_toewijzingen
  for select
  to authenticated
  using (
    public.mijn_rol() = 'coach'
    and coach_id = (select auth.uid())
  );

create policy toewijzingen_lezen_keyuser
  on public.coach_toewijzingen
  for select
  to authenticated
  using (
    public.mijn_rol() = 'organisatie_beheerder'
    and organisatie_id = public.mijn_organisatie()
  );

-- CV-DOCUMENTEN --------------------------------------------------------------
-- Het hart van de beveiliging.
--
-- De client: volledige controle over uitsluitend zijn eigen cv.

create policy cv_client_lezen
  on public.cv_documenten
  for select
  to authenticated
  using (inwoner_id = (select auth.uid()));

create policy cv_client_aanmaken
  on public.cv_documenten
  for insert
  to authenticated
  with check (
    inwoner_id = (select auth.uid())
    and organisatie_id = public.mijn_organisatie()
  );

create policy cv_client_wijzigen
  on public.cv_documenten
  for update
  to authenticated
  using (inwoner_id = (select auth.uid()))
  with check (
    inwoner_id = (select auth.uid())
    and organisatie_id = public.mijn_organisatie()
  );

create policy cv_client_verwijderen
  on public.cv_documenten
  for delete
  to authenticated
  using (inwoner_id = (select auth.uid()));

-- De coach: uitsluitend LEZEN, uitsluitend van clients met een LOPENDE
-- toewijzing aan deze coach. Geen aparte wijzig- of verwijderregel = kan niet.

create policy cv_coach_inzien
  on public.cv_documenten
  for select
  to authenticated
  using (
    public.mijn_rol() = 'coach'
    and exists (
      select 1
      from public.coach_toewijzingen t
      where t.inwoner_id = cv_documenten.inwoner_id
        and t.coach_id = (select auth.uid())
        and t.beeindigd_op is null
    )
  );

-- AUDITLOG -------------------------------------------------------------------
-- Geen enkele regel. In combinatie met het ontbreken van grants betekent dit:
-- via de browser volledig onbereikbaar, ook voor lezen. Alleen de serverkant
-- schrijft en leest hier.