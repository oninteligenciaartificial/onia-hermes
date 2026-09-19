#!/bin/sh
# Backup diario de la base de PRODUCCION de Onia Platform (Supabase self-hosted
# del VPS, contenedor dentalgest-staging-supabase-db — el nombre engana, ES prod).
# Guarda 7 dias. El otro script (backup-dentalgest-cloud.sh) respalda la cloud
# VIEJA; este respalda la base que usa la app en vivo.
set -e
DEST=/opt/backups/onia-db
STAMP=$(date +%Y%m%d-%H%M)
docker exec dentalgest-staging-supabase-db pg_dump -U supabase_admin -d postgres --no-owner | gzip > "$DEST/onia-db-$STAMP.sql.gz"
# Verificacion minima: un dump vacio o roto no cuenta como backup
test "$(stat -c%s "$DEST/onia-db-$STAMP.sql.gz")" -gt 10000
ls -1t "$DEST"/onia-db-*.sql.gz | tail -n +8 | xargs -r rm -f
echo "$(date -Iseconds) OK onia-db-$STAMP.sql.gz $(stat -c%s "$DEST/onia-db-$STAMP.sql.gz") bytes"
