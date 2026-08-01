#!/usr/bin/env bash
# gen-secrets.sh — genera los secretos nuevos del stack (Fase 2.1 del runbook).
# Imprime a stdout; NO escribe archivos. Copiar a mano al .env del stack (root-only).
# Los secretos de staging estan QUEMADOS: no reusar ninguno.
set -euo pipefail

command -v openssl >/dev/null || { echo "falta openssl" >&2; exit 1; }

POSTGRES_PASSWORD="$(openssl rand -hex 24)"            # 48 chars, URL-safe
JWT_SECRET="$(openssl rand -hex 32)"                   # 64 chars (>40 requerido por GoTrue)
DASHBOARD_PASSWORD="$(openssl rand -hex 16)"
SECRET_KEY_BASE="$(openssl rand -hex 32)"
VAULT_ENC_KEY="$(openssl rand -hex 16)"                # 32 chars exactos (Supavisor)

cat <<EOF
# === Pegar en /opt/dentalgest-supabase/supabase/docker/.env (chmod 600) ===
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
JWT_SECRET=${JWT_SECRET}
DASHBOARD_PASSWORD=${DASHBOARD_PASSWORD}
SECRET_KEY_BASE=${SECRET_KEY_BASE}
VAULT_ENC_KEY=${VAULT_ENC_KEY}

# Siguiente paso — firmar las API keys con el JWT_SECRET de arriba:
#   node /root/bin/gen-jwt-keys.mjs ${JWT_SECRET}
# Y rotar los passwords de los roles internos (volumen ya inicializado):
#   docker compose up -d db
#   docker exec -i \$(docker ps -qf name=db) psql -U postgres -v NEW_PASSWORD="'${POSTGRES_PASSWORD}'" -f - < /root/bin/rotate-db-passwords.sql
EOF
