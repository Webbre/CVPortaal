-- ---------------------------------------------------------------------------
-- Basisstructuur CVPortaal
--
-- Maakt de vijf kerntabellen aan, schakelt Row Level Security in op alle
-- tabellen en verleent de minimale rechten aan ingelogde gebruikers.
--
-- LET OP: deze migratie bevat nog GEEN toegangsregels (policies). Met RLS aan
-- en geen policies is alles standaard afgesloten. Dat is de veilige volgorde:
-- de volgende migratie opent gericht wat open mag.
-- ---------------------------------------------------------------------------

-- --- Rollen ----------------------------------------------------------------

create type public.gebruiker_rol as enum (
  'super_admin',
  'organisatie_beheerder',
  'werkcoach',
  'inwoner'
);

-- --- Organisaties ----------------------------------------------------------

create table public.organisaties (
  id                  uuid primary key default gen_random_uuid(),
  naam                text not null,
  slug                text not null unique,
  accentkleur         text not null default '#4A90E2',
  logo_pad            text,
  email_afzendernaam  text,
  email_extra_tekst   text,
  actief              boolean not null default true,
  aangemaakt_op       timestamptz not null default now()
);

comment on table public.organisaties is
  'Afnemende organisatie: gemeente, sociaal ontwikkelbedrijf, re-integratiebureau, UWV.';

-- --- Gebruikers ------------------------------------------------------------
-- Profiel bij een inlogaccount. Het inloggen zelf beheert Supabase in een
-- eigen afgeschermd schema; deze tabel hangt daaraan vast.

create table public.gebruikers (
  id                   uuid primary key references auth.users (id) on delete cascade,
  organisatie_id       uuid references public.organisaties (id) on delete restrict,
  rol                  public.gebruiker_rol not null,
  voornaam             text,
  achternaam           text,
  email                text not null,
  telefoon             text,
  actief               boolean not null default true,
  is_sessie_account    boolean not null default false,
  verwijderverzoek_op  timestamptz,
  aangemaakt_op        timestamptz not null default now(),
  laatst_actief_op     timestamptz
);

comment on column public.gebruikers.is_sessie_account is
  'Gereserveerd voor toekomstige groepssessies: tijdelijk account binnen een sessie.';

-- Een super_admin staat los van een organisatie; alle andere rollen horen er
-- juist verplicht bij. De database bewaakt dat zelf.
alter table public.gebruikers
  add constraint gebruikers_organisatie_past_bij_rol check (
    (rol = 'super_admin' and organisatie_id is null)
    or (rol <> 'super_admin' and organisatie_id is not null)
  );

-- --- Coach-toewijzingen ----------------------------------------------------

create table public.coach_toewijzingen (
  id               uuid primary key default gen_random_uuid(),
  coach_id         uuid not null references public.gebruikers (id) on delete cascade,
  inwoner_id       uuid not null references public.gebruikers (id) on delete cascade,
  organisatie_id   uuid not null references public.organisaties (id) on delete restrict,
  toegewezen_op    timestamptz not null default now(),
  toegewezen_door  uuid references public.gebruikers (id) on delete set null,
  beeindigd_op     timestamptz
);

comment on table public.coach_toewijzingen is
  'Welke coach mag welke client inzien. Nooit verwijderen, alleen beeindigen: zo blijft achteraf verantwoordbaar wie wanneer toegang had.';

-- Een client kan maar één lopende toewijzing tegelijk hebben. Beeindigde
-- toewijzingen blijven onbeperkt bestaan.
create unique index coach_toewijzingen_een_lopende_per_client
  on public.coach_toewijzingen (inwoner_id)
  where beeindigd_op is null;

-- --- CV-documenten ---------------------------------------------------------

create table public.cv_documenten (
  id              uuid primary key default gen_random_uuid(),
  inwoner_id      uuid not null unique references public.gebruikers (id) on delete cascade,
  organisatie_id  uuid not null references public.organisaties (id) on delete restrict,
  voornaam        text,
  achternaam      text,
  inhoud          jsonb not null default '{}'::jsonb,
  foto_pad        text,
  is_klaar        boolean not null default false,
  aangemaakt_op   timestamptz not null default now(),
  bijgewerkt_op   timestamptz not null default now()
);

comment on table public.cv_documenten is
  'Eén cv per client. De cv-gegevens staan als geheel in "inhoud"; voornaam en achternaam apart voor zoeken en sorteren in het beheerportaal.';

comment on column public.cv_documenten.is_klaar is
  'Markering door de client: cv is af. Statusinformatie voor de coach, geen inhoud.';

-- --- Auditlog --------------------------------------------------------------

create table public.auditlog (
  id                    bigint generated always as identity primary key,
  tijdstip              timestamptz not null default now(),
  actor_id              uuid references public.gebruikers (id) on delete set null,
  actor_rol             public.gebruiker_rol,
  organisatie_id        uuid references public.organisaties (id) on delete set null,
  actie                 text not null,
  betreft_gebruiker_id  uuid,
  details               jsonb
);

comment on table public.auditlog is
  'Alleen toevoegen, nooit wijzigen of verwijderen. Bewust geen verwijzing op betreft_gebruiker_id, zodat een logregel blijft bestaan nadat een account is verwijderd.';

-- --- Zoekindexen -----------------------------------------------------------

create index gebruikers_organisatie_idx
  on public.gebruikers (organisatie_id);

create index gebruikers_achternaam_idx
  on public.gebruikers (achternaam);

create index coach_toewijzingen_lopend_per_coach_idx
  on public.coach_toewijzingen (coach_id)
  where beeindigd_op is null;

create index cv_documenten_organisatie_idx
  on public.cv_documenten (organisatie_id);

create index cv_documenten_achternaam_idx
  on public.cv_documenten (achternaam);

create index auditlog_tijdstip_idx
  on public.auditlog (tijdstip desc);

create index auditlog_organisatie_idx
  on public.auditlog (organisatie_id);

-- --- Bijwerkdatum automatisch bijhouden ------------------------------------

create function public.zet_bijgewerkt_op()
returns trigger
language plpgsql
as $$
begin
  new.bijgewerkt_op = now();
  return new;
end;
$$;

create trigger cv_documenten_bijgewerkt_op
  before update on public.cv_documenten
  for each row execute function public.zet_bijgewerkt_op();

-- --- Beveiliging inschakelen -----------------------------------------------
-- Vanaf hier is elke tabel afgesloten totdat er toegangsregels bij komen.

alter table public.organisaties        enable row level security;
alter table public.gebruikers          enable row level security;
alter table public.coach_toewijzingen  enable row level security;
alter table public.cv_documenten       enable row level security;
alter table public.auditlog            enable row level security;

-- --- Rechten voor ingelogde gebruikers -------------------------------------
-- Expliciet nodig omdat nieuwe tabellen bewust niet automatisch worden
-- opengesteld. Niet-ingelogde bezoekers krijgen nergens toegang toe.
-- De auditlog krijgt met opzet geen enkel recht: die is alleen bereikbaar
-- vanaf de serverkant.

grant select                          on public.organisaties       to authenticated;
grant select                          on public.gebruikers         to authenticated;
grant select                          on public.coach_toewijzingen to authenticated;
grant select, insert, update, delete  on public.cv_documenten      to authenticated;