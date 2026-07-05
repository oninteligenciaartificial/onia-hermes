#!/bin/sh
# ONIA VPS daily backup. On-VPS + 7-day rotation. Off-site (R2) = pendiente.
# Emits one JSON line for the n8n workflow "ONIA - Backup diario".
DIR=/opt/onia/backups
mkdir -p "$DIR"
TS=$(date +%Y%m%d-%H%M%S)
errs=""

# 1. DentalGest Supabase (client data) — dump to temp, verify non-empty, then keep.
DB=dentalgest-staging-supabase-db
if docker exec "$DB" sh -c 'PGPASSWORD=$POSTGRES_PASSWORD pg_dumpall -U $POSTGRES_USER' > "$DIR/.tmp-sup-$TS.sql" 2>/dev/null && [ -s "$DIR/.tmp-sup-$TS.sql" ]; then
  gzip -f "$DIR/.tmp-sup-$TS.sql"
  mv "$DIR/.tmp-sup-$TS.sql.gz" "$DIR/dentalgest-supabase-$TS.sql.gz"
  sup=$(wc -c < "$DIR/dentalgest-supabase-$TS.sql.gz")
else
  rm -f "$DIR/.tmp-sup-$TS.sql"
  errs="$errs supabase-dump"; sup=0
fi

# 2. n8n workflows (all) + credentials (encrypted, safe at rest).
N8N=$(docker ps --format '{{.Names}}' | grep -i n8n | head -1)
if [ -n "$N8N" ] && docker exec "$N8N" n8n export:workflow --all --output=/tmp/n8n-wf.json >/dev/null 2>&1; then
  docker cp "$N8N:/tmp/n8n-wf.json" "/tmp/n8n-wf-$TS.json" >/dev/null 2>&1
  gzip -cf "/tmp/n8n-wf-$TS.json" > "$DIR/n8n-workflows-$TS.json.gz" 2>/dev/null
  rm -f "/tmp/n8n-wf-$TS.json"
  docker exec "$N8N" rm -f /tmp/n8n-wf.json 2>/dev/null || true
  wf=$(wc -c < "$DIR/n8n-workflows-$TS.json.gz")
else
  errs="$errs n8n-workflows"; wf=0
fi
if [ -n "$N8N" ] && docker exec "$N8N" n8n export:credentials --all --output=/tmp/n8n-cred.json >/dev/null 2>&1; then
  docker cp "$N8N:/tmp/n8n-cred.json" "/tmp/n8n-cred-$TS.json" >/dev/null 2>&1
  gzip -cf "/tmp/n8n-cred-$TS.json" > "$DIR/n8n-credentials-enc-$TS.json.gz" 2>/dev/null
  rm -f "/tmp/n8n-cred-$TS.json"
  docker exec "$N8N" rm -f /tmp/n8n-cred.json 2>/dev/null || true
else
  errs="$errs n8n-credentials"
fi

# 3. Rotation: keep 7 days on the VPS.
find "$DIR" -name '*.gz' -mtime +7 -delete 2>/dev/null || true
count=$(ls -1 "$DIR"/*.gz 2>/dev/null | wc -l | xargs)
total=$(du -sh "$DIR" 2>/dev/null | awk '{print $1}')

ok=true; [ -n "$errs" ] && ok=false
printf '{"ok":%s,"ts":"%s","supabaseBytes":%s,"n8nBytes":%s,"files":%s,"totalSize":"%s","errors":"%s"}\n' "$ok" "$TS" "$sup" "$wf" "$count" "$total" "$(echo $errs | xargs)"
