#!/usr/bin/env bash
# ONIA — wrapper del ALTA DE UN CLIENTE EN CHATWOOT (chatwoot-onboard.mjs).
#
# ENTRADA : no usa stdin. Todo va por argumentos, que se pasan tal cual al .mjs.
# SALIDA  : texto legible · --json una línea JSON por STDOUT.
#           EXIT CODE: 0 si el alta quedó bien, 1 si NO. A diferencia de los barridos
#           (followup/reminder/usage, que salen 0 siempre para que n8n no reintente), esto se
#           corre A MANO al dar de alta un cliente: acá un fallo silencioso es el problema, no el
#           reintento. Y como el .mjs es idempotente, reintentar no rompe nada.
#
# POR QUÉ NO COPIA NADA AL CONTENEDOR (a diferencia de reminder-run.sh / usage-run.sh): esos corren
# DENTRO de onia-center porque necesitan las credenciales de Supabase. Este script sólo habla HTTPS
# con Chatwoot, así que corre con el node del host (v20) y se ahorra el docker cp.
#
# EL TOKEN: sale de la base de Chatwoot, igual que en webhook-server.sh / reminder-run.sh — nunca
# de un archivo del repo ni de n8n. OJO, tiene que ser el token de un usuario ADMINISTRADOR
# (account_users.role = 1): con el token del bot (rol agente) los POST de agentes/inboxes devuelven
# 403 y el alta falla a mitad. Si ya tenés CHATWOOT_API_TOKEN exportado, ese gana y no se consulta
# la base. El valor NUNCA se imprime.
#
# Uso (ver el plan sin escribir nada — así se prueba contra la instalación real):
#   bash chatwoot-onboard.sh --account-id 2 --inbox "Onia WhatsApp" --dry-run
#
# Alta de verdad de un cliente:
#   bash chatwoot-onboard.sh --account-id 2 --inbox "Ferretería X WhatsApp" \
#        --agent "Juan Pérez:juan@ferreteriax.bo" --agent "Ana:ana@ferreteriax.bo"
#
# Desde el dev (sin VPS): exportá CHATWOOT_API_TOKEN y corré `node chatwoot-onboard.mjs ...`.
set -uo pipefail

BOT_DIR="$(cd "$(dirname "$0")" 2>/dev/null && pwd)"
[ -f "$BOT_DIR/chatwoot-onboard.mjs" ] || BOT_DIR="/opt/onia/bot"
if [ ! -f "$BOT_DIR/chatwoot-onboard.mjs" ]; then
  echo '{"ok":false,"errors":["no se encontro chatwoot-onboard.mjs (esperado en /opt/onia/bot)"]}'
  exit 1
fi

# La cuenta, para pedirle a la base un admin DE ESA cuenta (y no de otra).
ACCOUNT_ID="${CHATWOOT_ACCOUNT_ID:-}"
prev=""
for arg in "$@"; do
  case "$arg" in
    --account-id=*) ACCOUNT_ID="${arg#--account-id=}" ;;
    *) [ "$prev" = "--account-id" ] && ACCOUNT_ID="$arg" ;;
  esac
  prev="$arg"
done

if [ -z "${CHATWOOT_API_TOKEN:-}" ]; then
  CWDB="$(docker ps -qf name=onia-chatbot_chatwoot-db 2>/dev/null | head -n1)"
  if [ -n "$CWDB" ]; then
    WHERE="au.role = 1"
    [ -n "$ACCOUNT_ID" ] && WHERE="$WHERE and au.account_id = $ACCOUNT_ID"
    CHATWOOT_API_TOKEN="$(docker exec "$CWDB" psql -U postgres -d 'onia-chatbot' -tAc \
      "select t.token from access_tokens t join account_users au on au.user_id = t.owner_id \
       where t.owner_type = 'User' and $WHERE order by t.created_at desc limit 1" 2>/dev/null \
      | tr -d ' \t\n' || true)"
    export CHATWOOT_API_TOKEN
  fi
fi
if [ -z "${CHATWOOT_API_TOKEN:-}" ]; then
  echo '{"ok":false,"errors":["sin CHATWOOT_API_TOKEN: no se pudo leer un token de administrador de la base de Chatwoot; exportalo a mano"]}'
  exit 1
fi

# Desde el host el nombre de red de docker (onia-chatbot_chatwoot) no resuelve: va la URL pública.
export CHATWOOT_BASE_URL="${CHATWOOT_BASE_URL:-https://onia-chatbot-chatwoot.hqdqgh.easypanel.host}"
# Opcional y hoy inexistente: el token de una "platform app" (tabla `platform_apps` vacía). Sólo
# hace falta para CREAR cuentas nuevas; sin él se trabaja con --account-id.
export CHATWOOT_PLATFORM_TOKEN="${CHATWOOT_PLATFORM_TOKEN:-}"

node "$BOT_DIR/chatwoot-onboard.mjs" "$@"
exit $?
