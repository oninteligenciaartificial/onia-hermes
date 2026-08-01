-- rotate-db-passwords.sql — rota los passwords de los roles internos del stack (Fase 2.1).
-- El compose oficial solo setea passwords en el PRIMER boot del volumen; como el volumen
-- de staging ya existe, la rotacion se hace por SQL con el POSTGRES_PASSWORD nuevo.
--
-- Uso (con SOLO el servicio db arriba):
--   docker exec -i <db_container> psql -U postgres -v NEW_PASSWORD="'<POSTGRES_PASSWORD_NUEVO>'" \
--     -f - < rotate-db-passwords.sql
--
-- Despues de correr esto: docker compose up -d (el resto de servicios leen el .env nuevo).

ALTER USER postgres                  WITH PASSWORD :NEW_PASSWORD;
ALTER USER supabase_admin            WITH PASSWORD :NEW_PASSWORD;
ALTER USER authenticator             WITH PASSWORD :NEW_PASSWORD;
ALTER USER pgbouncer                 WITH PASSWORD :NEW_PASSWORD;
ALTER USER supabase_auth_admin       WITH PASSWORD :NEW_PASSWORD;
ALTER USER supabase_functions_admin  WITH PASSWORD :NEW_PASSWORD;
ALTER USER supabase_storage_admin    WITH PASSWORD :NEW_PASSWORD;

-- Verificacion: reconectar con el password nuevo y listar roles
--   \du
