#!/usr/bin/env bash
# ONIA — VIGIA DE SEGURIDAD DEL VPS. Reemplaza a /opt/onia/security-watch.sh.
#
# POR QUE SE REESCRIBIO (2026-09-24, goal de cerrar la 1.0). El de /opt estuvo CIEGO ~41
# dias: apuntaba a `dentalgest-staging-supabase-db`, un contenedor que ya no existe, y su
# sql() tiraba el error a /dev/null. Cada manana mandaba "Hay  tablas SIN RLS ( objetos)",
# con el numero VACIO, y el mismo 24-sep aparecieron 4 tablas backup_* en `public` que
# anon podia leer, modificar y borrar por la API REST. No las vio porque no miraba nada.
# Un vigia que grita vacio todos los dias es lo mismo que uno callado: nadie lo lee.
#
# QUE MIRA (cron diario 08:00):
#   1. Defensas del servidor: ufw activo, las 4 reglas ONIA-BLOCK en DOCKER-USER, fail2ban.
#   2. UNA CLASE, no una lista: toda tabla SIN RLS, en un esquema que sirve la API, que anon
#      o authenticated pueden tocar. Es la exposicion de los backup_*: PostgREST sirve lo
#      que el rol puede tocar y, sin RLS, "puede tocar" es "todas las filas".
#      Por que clase: la base tiene DEFAULT PRIVILEGES que le dan a anon y authenticated
#      arwdDxt sobre TODA tabla nueva en public (medido 2026-09-24). Cada CREATE TABLE
#      nace expuesto hasta que alguien le prende RLS; una lista de tablas no lo ve venir.
#      authenticated cuenta igual que anon: el alta esta abierta, un JWT de usuario lo
#      saca cualquiera.
#   3. Toda vista (o materializada) de esos esquemas que anon o authenticated pueden leer.
#      Una vista corre con los permisos de su dueno y se saltea el RLS de lo que lee
#      (salvo security_invoker, que se excluye).
#
# LOS ESQUEMAS SALEN DE LA API, no de una lista: PGRST_DB_SCHEMAS de supabase-rest (el 24-sep:
# public, storage, graphql_public, onia_center). `public` va siempre. Si no se puede leer,
# se avisa y se mira solo `public`.
#
# QUE YA NO MIRA, y por que: "cero grants a anon/authenticated en public". Con RLS prendido
# y sin politica un grant no expone nada, y por los default privileges el conteo nunca
# queda en 0 (hoy: 2 tablas del producto, con RLS y sin politicas). Esa alarma iba a
# sonar todos los dias por nada, que es como se aprende a no leerla.
#
# FALLA RUIDOSO: si no puede correr los chequeos de la base (contenedor caido o renombrado,
# psql con error o colgado, rol anon ausente, `public` sin tablas = base equivocada) lo dice.
# "No pude mirar" nunca mas sale con cara de "esta todo bien".
#
# UN AVISO POR INCIDENTE, DIRECTO a Telegram (ONIA_TG_DIRECTO=1). La lista de problemas
# avisada queda en $ESTADO/abierto y se escribe SOLO si Telegram confirmo. Misma lista al
# dia siguiente = silencio (queda en el log); lista distinta = aviso nuevo; lista vacia con
# incidente abierto = aviso de recuperacion. Directo y no al tablero: una tabla expuesta al
# publico toca la base de produccion, no la arregla un loop solo.
#
# SOLO LECTURA: un SELECT sobre el catalogo. No revoca nada.
#
# Cron propuesto (reemplaza la linea de /opt/onia/security-watch.sh):
# 0 8 * * * /root/bin/onia-security-watch.sh >> /var/log/onia-security-watch.log 2>&1
set -uo pipefail

TG="${ONIA_TG:-/root/bin/onia-tg.sh}"
ESTADO="${ONIA_SECWATCH_ESTADO:-/var/lib/onia-security-watch}"
DB="${ONIA_SECWATCH_DB:-supabase-db}"
REST="${ONIA_SECWATCH_REST:-supabase-rest}"
ABIERTO="$ESTADO/abierto"   # la lista de problemas ya avisada; existe = incidente abierto

log() { printf '%s %s\n' "$(date -u +%FT%TZ)" "$*"; }
esc() { sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g'; }
directo() { ONIA_TG_DIRECTO=1 "$TG" "$1" >/dev/null 2>&1; }

mkdir -p "$ESTADO" || { log "FALLO: no puedo escribir $ESTADO"; exit 1; }

PROBLEMAS=()
DETALLE=""   # texto variable (errores): va en el mensaje, NO en la firma del incidente

# ── 1. Defensas del servidor ────────────────────────────────────────────────
[ "$(ufw status 2>/dev/null | head -1)" = "Status: active" ] || PROBLEMAS+=("El firewall (ufw) NO esta activo")
REGLAS=$(iptables -L DOCKER-USER -n 2>/dev/null | grep -c ONIA-BLOCK)
[ "${REGLAS:-0}" -ge 4 ] || PROBLEMAS+=("Faltan reglas de puertos Docker (hay ${REGLAS:-0} ONIA-BLOCK, deberian ser 4)")
systemctl is-active --quiet fail2ban || PROBLEMAS+=("fail2ban NO esta corriendo")

# ── 2 y 3. La base: que expone la API ───────────────────────────────────────
ESQUEMAS="public"
DE_LA_API=$(docker inspect "$REST" --format '{{range .Config.Env}}{{println .}}{{end}}' 2>/dev/null \
  | sed -n 's/^PGRST_DB_SCHEMAS=//p' | head -1)
if [ -z "$DE_LA_API" ]; then
  PROBLEMAS+=("NO PUDE leer que esquemas sirve la API (PGRST_DB_SCHEMAS de $REST): miro solo public")
fi
IFS=', ' read -ra LISTA <<< "$DE_LA_API"
for e in "${LISTA[@]}"; do
  if [[ "$e" =~ ^[a-z_][a-z0-9_]*$ ]]; then
    case " $ESQUEMAS " in *" $e "*) ;; *) ESQUEMAS+=" $e" ;; esac
  else
    PROBLEMAS+=("Esquema de la API con nombre inesperado, no lo miro: $(printf '%s' "$e" | esc)")
  fi
done
ARRAY=$(printf "'%s'," $ESQUEMAS)   # validados arriba (solo [a-z0-9_]): van literales al SQL
ARRAY=${ARRAY%,}

PRIV="'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER'"
PRIV_COL="'SELECT,INSERT,UPDATE,REFERENCES'"
SQL="with rel as (
  select n.nspname as esquema, c.relname, c.relkind in ('r', 'p') as es_tabla, c.relrowsecurity as rls,
    coalesce(array_to_string(c.reloptions, ','), '') ~* 'security_invoker=(true|on|yes|1)' as invoker,
    has_schema_privilege('anon', n.oid, 'USAGE') and (has_table_privilege('anon', c.oid, $PRIV)
      or has_any_column_privilege('anon', c.oid, $PRIV_COL)) as anon,
    has_schema_privilege('authenticated', n.oid, 'USAGE') and (has_table_privilege('authenticated', c.oid, $PRIV)
      or has_any_column_privilege('authenticated', c.oid, $PRIV_COL)) as auth
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = any (array[$ARRAY]) and c.relkind in ('r', 'p', 'v', 'm')
)
select 'total', count(*)::text, '' from rel where es_tabla and esquema = 'public'
union all
select 'tabla', esquema || '.' || relname, concat_ws(', ', case when anon then 'anon' end, case when auth then 'authenticated' end)
  from rel where es_tabla and not rls and (anon or auth)
union all
select 'vista', esquema || '.' || relname, concat_ws(', ', case when anon then 'anon' end, case when auth then 'authenticated' end)
  from rel where not es_tabla and not invoker and (anon or auth)"

ERR=$(mktemp)
trap 'rm -f "$ERR"' EXIT
# timeout: una base colgada es una base que no se pudo mirar, no un cron trabado para siempre.
SALIDA=$(timeout 120 docker exec "$DB" psql -U postgres -d postgres -AtqX -v ON_ERROR_STOP=1 -F $'\t' -c "$SQL" 2>"$ERR")
RC=$?
TOTAL=""
if [ "$RC" -ne 0 ]; then
  PROBLEMAS+=("NO PUDE correr los chequeos de la base (contenedor $DB): no se sabe si hay tablas expuestas")
  DETALLE="rc=$RC $(head -c 200 "$ERR" | tr -d '\000-\037' | esc)"
else
  while IFS=$'\t' read -r TIPO NOMBRE ROLES; do
    NOMBRE=$(printf '%s' "$NOMBRE" | esc)
    case "$TIPO" in
      total) TOTAL=$NOMBRE ;;
      tabla) PROBLEMAS+=("Tabla SIN RLS abierta por la API: <code>$NOMBRE</code> ($ROLES)") ;;
      vista) PROBLEMAS+=("Vista abierta por la API (se saltea el RLS): <code>$NOMBRE</code> ($ROLES)") ;;
    esac
  done <<< "$SALIDA"
  if ! [[ "$TOTAL" =~ ^[0-9]+$ ]] || [ "$TOTAL" -eq 0 ]; then
    PROBLEMAS+=("NO PUDE correr los chequeos de la base: <code>public</code> de $DB no tiene tablas (base equivocada?)")
  fi
fi

# ── Resumen de accesos: solo log ────────────────────────────────────────────
# Decision de Sergio Urcullo 2026-08-28: Telegram solo para errores; fail2ban trabajando no lo es.
FALLIDOS=$(journalctl -u ssh -u sshd --since "24 hours ago" 2>/dev/null | grep -ciE 'Failed password|Invalid user')
F2B=$(fail2ban-client status sshd 2>/dev/null)
BAN=$(printf '%s' "$F2B" | sed -n 's/.*Currently banned:[[:space:]]*\([0-9][0-9]*\).*/\1/p' | head -1)
BAN_TOTAL=$(printf '%s' "$F2B" | sed -n 's/.*Total banned:[[:space:]]*\([0-9][0-9]*\).*/\1/p' | head -1)
UFW=$(grep -c "UFW BLOCK" /var/log/ufw.log 2>/dev/null)
log "SSH fallidos 24h: ${FALLIDOS:-0} | IPs bloqueadas ahora: ${BAN:-0} (total ${BAN_TOTAL:-0}) | paquetes frenados por ufw: ${UFW:-0} | tablas en public: ${TOTAL:-?} | esquemas: $ESQUEMAS"

# ── Aviso: uno por incidente ────────────────────────────────────────────────
if [ ${#PROBLEMAS[@]} -gt 0 ]; then
  ACTUAL=$(printf '%s\n' "${PROBLEMAS[@]}" | sort)
  if [ -f "$ABIERTO" ] && [ "$(cat "$ABIERTO")" = "$ACTUAL" ]; then
    log "sigue igual, ya avisado: $(printf '%s' "$ACTUAL" | tr '\n' ';')"
    exit 1
  fi
  MSG="🔴 <b>Seguridad del servidor</b>
$(printf '%s\n' "$ACTUAL" | sed 's/^/• /')${DETALLE:+
Detalle: <code>$DETALLE</code>}"
  case "$ACTUAL" in *"abierta por la API"*) MSG+="
Cerrar: <code>alter table X enable row level security;</code> o <code>revoke all on X from anon, authenticated;</code>" ;; esac
  if directo "$MSG"; then
    printf '%s\n' "$ACTUAL" > "$ABIERTO"
    log "ALERTA enviada: $(printf '%s' "$ACTUAL" | tr '\n' ';')"
  else
    log "FALLO Telegram con la alerta (se reintenta en la proxima vuelta): $(printf '%s' "$ACTUAL" | tr '\n' ';')"
  fi
  exit 1
fi

if [ -f "$ABIERTO" ]; then
  if directo "🟢 <b>Seguridad del servidor</b>: todo en orden de nuevo (defensas puestas, nada abierto por la API)."; then
    rm -f "$ABIERTO"
    log "recuperado: se aviso"
  else
    log "FALLO Telegram con la recuperacion (se reintenta en la proxima vuelta)"
  fi
fi
exit 0
