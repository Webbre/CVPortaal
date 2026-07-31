-- ---------------------------------------------------------------------------
-- Rechten voor de serverkant.
--
-- Omdat nieuwe tabellen bewust NIET automatisch worden opengesteld (de optie
-- "Automatically expose new tables" staat uit), moet elke tabel expliciet
-- toestemming krijgen. In de eerste migratie is dat gedaan voor ingelogde
-- gebruikers; de serverrol was toen nog niet in gebruik.
--
-- De serverrol wordt alleen gebruikt door Edge Functions die zelf controleren
-- wie er belt en wat is toegestaan. Deze rol komt nooit in de browser.
-- ---------------------------------------------------------------------------

grant usage on schema public to service_role;

grant all on public.organisaties       to service_role;
grant all on public.gebruikers         to service_role;
grant all on public.coach_toewijzingen to service_role;
grant all on public.cv_documenten      to service_role;
grant all on public.auditlog           to service_role;

grant usage, select on all sequences in schema public to service_role;