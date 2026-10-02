\pset pager off
\t on
select 'A', now(), (select sessions from pg_stat_database where datname='postgres'), (select sum(calls) from extensions.pg_stat_statements s join pg_roles r on r.oid=s.userid where r.rolname='supabase_auth_admin'), (select sum(calls) from extensions.pg_stat_statements s join pg_roles r on r.oid=s.userid where r.rolname='postgres'), (select sum(calls) from extensions.pg_stat_statements s join pg_roles r on r.oid=s.userid where r.rolname='authenticator');
select pg_sleep(330);
select 'B', now(), (select sessions from pg_stat_database where datname='postgres'), (select sum(calls) from extensions.pg_stat_statements s join pg_roles r on r.oid=s.userid where r.rolname='supabase_auth_admin'), (select sum(calls) from extensions.pg_stat_statements s join pg_roles r on r.oid=s.userid where r.rolname='postgres'), (select sum(calls) from extensions.pg_stat_statements s join pg_roles r on r.oid=s.userid where r.rolname='authenticator');
