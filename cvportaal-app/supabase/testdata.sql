-- ---------------------------------------------------------------------------
-- TESTGEGEVENS CVPortaal — GEEN MIGRATIE.
--
-- Bewust buiten de map migrations/ gehouden: deze rijen mogen NOOIT in een
-- productiedatabase terechtkomen. Handmatig uitvoeren in de SQL Editor van
-- een testomgeving.
--
-- Vooraf aanmaken in Authentication → Users (met "Auto Confirm User" aan,
-- allemaal hetzelfde wachtwoord):
--   clienta@test.nl   clientb@test.nl   coach@test.nl
--   clientc@test.nl   coach2@test.nl
-- Kopieer daarna de vijf UUID's en vul ze hieronder in.
--
-- Opzet: twee organisaties die elkaar niet mogen zien.
--   Organisatie 1: client A + client B, coach 1 toegewezen aan A (niet aan B)
--   Organisatie 2: client C, coach 2 toegewezen aan C
--
-- Dit bestand kan veilig opnieuw worden uitgevoerd; bestaande rijen worden
-- overgeslagen.
-- ---------------------------------------------------------------------------


-- === ORGANISATIE 1 =========================================================

insert into public.organisaties (id, naam, slug, accentkleur)
values ('11111111-1111-1111-1111-111111111111', 'Testorganisatie', 'test-org', '#4A90E2')
on conflict do nothing;

insert into public.gebruikers (id, organisatie_id, rol, voornaam, achternaam, email)
values
  ('57196bd3-0f8a-446a-ab16-07f8b261ff82', '11111111-1111-1111-1111-111111111111', 'inwoner', 'Aisha', 'Testclient', 'clienta@test.nl'),
  ('7cce3e5e-8c04-4cfd-97c8-1f344b0a7d73', '11111111-1111-1111-1111-111111111111', 'inwoner', 'Bram',  'Testclient', 'clientb@test.nl'),
  ('a0e9926c-4a00-4c25-9f61-fc0e1ecf0508',  '11111111-1111-1111-1111-111111111111', 'coach',   'Carla', 'Testcoach',  'coach@test.nl')
on conflict do nothing;

-- Coach 1 is alleen aan client A toegewezen, bewust niet aan client B.
insert into public.coach_toewijzingen (coach_id, inwoner_id, organisatie_id)
values (
  'a0e9926c-4a00-4c25-9f61-fc0e1ecf0508',
  '57196bd3-0f8a-446a-ab16-07f8b261ff82',
  '11111111-1111-1111-1111-111111111111'
)
on conflict do nothing;

insert into public.cv_documenten (inwoner_id, organisatie_id, voornaam, achternaam, inhoud)
values
  ('57196bd3-0f8a-446a-ab16-07f8b261ff82', '11111111-1111-1111-1111-111111111111', 'Aisha', 'Testclient', '{"profieltekst": "Dit is het cv van client A"}'),
  ('7cce3e5e-8c04-4cfd-97c8-1f344b0a7d73', '11111111-1111-1111-1111-111111111111', 'Bram',  'Testclient', '{"profieltekst": "Dit is het cv van client B"}')
on conflict do nothing;


-- === ORGANISATIE 2 =========================================================
-- Bestaat om te bewijzen dat organisaties elkaar niet kunnen zien.

insert into public.organisaties (id, naam, slug, accentkleur)
values ('22222222-2222-2222-2222-222222222222', 'Tweede Testorganisatie', 'test-org-2', '#E67E22')
on conflict do nothing;

insert into public.gebruikers (id, organisatie_id, rol, voornaam, achternaam, email)
values
  ('db01eedc-5037-44e8-9f0c-7e51064d8e75', '22222222-2222-2222-2222-222222222222', 'inwoner', 'Chantal', 'Testclient', 'clientc@test.nl'),
  ('21aecebd-35a5-4a71-9766-d35810ac3966',  '22222222-2222-2222-2222-222222222222', 'coach',   'Dennis',  'Testcoach',  'coach2@test.nl')
on conflict do nothing;

insert into public.coach_toewijzingen (coach_id, inwoner_id, organisatie_id)
values (
  '21aecebd-35a5-4a71-9766-d35810ac3966',
  'db01eedc-5037-44e8-9f0c-7e51064d8e75',
  '22222222-2222-2222-2222-222222222222'
)
on conflict do nothing;

insert into public.cv_documenten (inwoner_id, organisatie_id, voornaam, achternaam, inhoud)
values (
  'db01eedc-5037-44e8-9f0c-7e51064d8e75',
  '22222222-2222-2222-2222-222222222222',
  'Chantal', 'Testclient',
  '{"profieltekst": "Dit is het cv van client C"}'
)
on conflict do nothing;