-- ONIA Center REST grants for server-side Supabase API access.
-- RLS stays enabled. These grants allow the service_role API route to reach
-- the private onia_center schema through PostgREST.

grant usage on schema onia_center to service_role;

grant select, insert, update, delete
on all tables in schema onia_center
to service_role;

grant execute
on all functions in schema onia_center
to service_role;

alter default privileges in schema onia_center
grant select, insert, update, delete on tables to service_role;

alter default privileges in schema onia_center
grant execute on functions to service_role;
