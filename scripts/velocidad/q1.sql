\pset pager off
select now();
select datname, sessions, sessions_abandoned, sessions_fatal, sessions_killed, round(session_time/1000) as sess_s, stats_reset from pg_stat_database where datname is not null order by sessions desc;
select usename, application_name, client_addr, state, count(*), min(backend_start) from pg_stat_activity where backend_type='client backend' group by 1,2,3,4 order by 5 desc;
select pg_sleep(30);
select datname, sessions from pg_stat_database where datname is not null order by sessions desc;
select usename, application_name, client_addr, backend_start from pg_stat_activity where backend_type='client backend' and backend_start > now() - interval '40 seconds';
