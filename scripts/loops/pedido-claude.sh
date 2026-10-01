#!/usr/bin/env bash
# ONIA — Hermes le pasa un pedido de Sergio Urcullo a Claude Code en la nube.
#
# POR QUÉ EXISTE (2026-10-01). Sergio Urcullo: «¿hermes ya nos funciona? quiero que mejores
# también eso, que ya podamos manejar todo desde ahí». El 30-sep había elegido «que Hermes también
# ejecute», y la forma acordada (handoff/hermes-jarvis.md §6.3) es esta: Hermes NO programa —es un
# modelo barato que ya inventó una agenda entera—; le muestra el pedido exacto y, con su sí, dispara
# una RUTINA de Claude Code en la nube que hace el trabajo con las reglas de la casa y devuelve el
# link de la sesión. Diseño completo: hermes-content/docs/TELEGRAM_COMMAND_CENTER.md.
#
# DE DÓNDE: la rutina «Pedidos de Sergio Urcullo desde Hermes» de claude.ai, con disparador por
# API. Su URL y su token viven en /root/.config/onia/pedidos.env (600), nunca en el repo; los
# instala hermes-content/deploy/hermes-jarvis/aplicar.sh.
#
# Uso:
#   onia-pedido-claude.sh <carril> <pedido…>        vista previa: no manda nada, sale 3
#   onia-pedido-claude.sh <carril> <pedido…> --si   lo manda (solo después de su sí a ESE texto)
#   onia-pedido-claude.sh --lista [AAAA-MM-DD]      los pedidos del día, con su estado
#   onia-pedido-claude.sh --estado                  ¿está configurado? (no manda nada)
#
# Carriles: plataforma · ventas · marca · lucia · hermes · consulta
#
# 🔴 SIN `--si` NO MANDA NADA, y CON `--si` tampoco si ese mismo texto no pasó antes por la vista
# previa en la última hora. Es la regla de la skill pedir-a-claude puesta donde un modelo no se la
# puede saltar: lo que Claude recibe es, palabra por palabra, lo que Sergio Urcullo vio y aprobó.
#
# Salidas: 0 mandado · 3 vista previa · 64 uso · 65 carril o texto inválido · 66 falta la vista
# previa · 69 sin configurar · 75 tope del día o repetido · 1 la rutina no respondió.
set -uo pipefail
export LC_ALL=C.UTF-8

CONF="${ONIA_PEDIDOS_CONF:-/root/.config/onia/pedidos.env}"
ESTADO="${ONIA_PEDIDOS_ESTADO:-/var/lib/onia-pedidos}"
CURL="${ONIA_PEDIDOS_CURL:-curl}"
TOPE="${ONIA_PEDIDOS_TOPE:-8}"            # pedidos por día de La Paz
MAX_TEXTO=2000
VIGENCIA_PREVIA=3600                      # segundos que vale una vista previa
CARRILES="plataforma ventas marca lucia hermes consulta"
BETA="experimental-cc-routine-2026-04-01"

AHORA=$(date -u +%s)
HOY=$(date -u -d "@$((AHORA - 14400))" +%F)   # Bolivia: UTC-4 todo el año
mkdir -p "$ESTADO/previas" 2>/dev/null; chmod 700 "$ESTADO" 2>/dev/null
REGISTRO="$ESTADO/pedidos.tsv"            # ts_utc id carril hash session_id url
RESPUESTAS="$ESTADO/respuestas.tsv"       # ts_utc id estado (lo escribe responder.sh)

uso() { sed -n '/^# Uso/,/^# 🔴/p' "$0" | sed '$d; s/^# \{0,1\}//' >&2; exit 64; }

cargar_conf() {
  ONIA_RUTINA_URL=""; ONIA_RUTINA_TOKEN=""
  # shellcheck disable=SC1090
  [ -r "$CONF" ] && . "$CONF"
  [[ "${ONIA_RUTINA_URL:-}" =~ ^https://api\.anthropic\.com/v1/claude_code/routines/trig_[A-Za-z0-9]+/fire$ ]] \
    && [ -n "${ONIA_RUTINA_TOKEN:-}" ]
}

estado_de() {  # estado_de <id> -> el último estado que respondió Claude, o «sin respuesta»
  [ -f "$RESPUESTAS" ] || { echo "sin respuesta"; return; }
  awk -F'\t' -v id="$1" '$2 == id { e = $3 } END { print (e == "" ? "sin respuesta" : e) }' "$RESPUESTAS"
}

case "${1:-}" in
  --estado)
    if cargar_conf; then echo "✅ pedidos a Claude: configurado (${ONIA_RUTINA_URL%/fire})"; exit 0; fi
    echo "pedidos a Claude: falta $CONF con ONIA_RUTINA_URL y ONIA_RUTINA_TOKEN" >&2; exit 69 ;;
  --lista)
    DIA="${2:-$HOY}"
    [ -f "$REGISTRO" ] || exit 0
    while IFS=$'\t' read -r ts id carril _hash _sid url; do
      [ "$(date -u -d "@$((ts - 14400))" +%F)" = "$DIA" ] || continue
      printf '%s\t%s\t%s\t%s\t%s\n' "$(date -u -d "@$((ts - 14400))" +%H:%M)" "$id" "$carril" "$(estado_de "$id")" "$url"
    done < "$REGISTRO"
    exit 0 ;;
  ""|-h|--help) uso ;;
esac

CARRIL="$1"; shift
SI=0; PARTES=()
for a in "$@"; do [ "$a" = "--si" ] && SI=1 || PARTES+=("$a"); done
TEXTO="${PARTES[*]:-}"
TEXTO="$(printf '%s' "$TEXTO" | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')"

if ! printf ' %s ' "$CARRILES" | grep -qF " $CARRIL "; then
  if [ "$CARRIL" = pc ] || [ "$CARRIL" = madre ]; then
    echo "Eso necesita la PC de Sergio Urcullo: no va a la nube. Dejalo en el tablero para la sesión madre (onia-tablero.sh create \"[madre] …\")." >&2
  else
    echo "carril desconocido: «$CARRIL». Válidos: $CARRILES" >&2
  fi
  exit 65
fi
[ -n "$TEXTO" ] || { echo "falta el pedido" >&2; exit 65; }
[ "${#TEXTO}" -le "$MAX_TEXTO" ] || { echo "el pedido es muy largo (${#TEXTO} > $MAX_TEXTO caracteres): resumilo" >&2; exit 65; }

HASH=$(printf '%s\n%s' "$CARRIL" "$TEXTO" | md5sum | cut -c1-12)

if [ "$SI" = 0 ]; then
  printf '%s\n' "$AHORA" > "$ESTADO/previas/$HASH"
  printf 'Esto le mando a Claude (carril %s):\n«%s»\n' "$CARRIL" "$TEXTO"
  cargar_conf || printf '⚠️ Todavía no está configurado: aunque digas que sí, no lo puedo mandar.\n'
  exit 3
fi

# ── Con --si ─────────────────────────────────────────────────────────────────
VISTA=$(cat "$ESTADO/previas/$HASH" 2>/dev/null || echo 0)
if [ $((AHORA - VISTA)) -gt "$VIGENCIA_PREVIA" ]; then
  echo "Primero mostrale el pedido (el mismo comando sin --si) y esperá su sí a ESE texto." >&2
  exit 66
fi
cargar_conf || { echo "pedidos a Claude: falta $CONF con ONIA_RUTINA_URL y ONIA_RUTINA_TOKEN" >&2; exit 69; }

if [ -f "$REGISTRO" ]; then
  REPE=$(awk -F'\t' -v h="$HASH" -v desde=$((AHORA - 3600)) '$4 == h && $1 >= desde { print $6 }' "$REGISTRO" | tail -1)
  [ -n "$REPE" ] && { echo "Ese mismo pedido ya salió hace menos de una hora: $REPE" >&2; exit 75; }
  HECHOS=$(while IFS=$'\t' read -r ts _r; do
             [ "$(date -u -d "@$((ts - 14400))" +%F)" = "$HOY" ] && echo x
           done < "$REGISTRO" | grep -c x)
  [ "$HECHOS" -ge "$TOPE" ] && { echo "Ya van $HECHOS pedidos hoy (tope $TOPE). Si es urgente, que lo vea la sesión madre." >&2; exit 75; }
fi

ID="p_$(printf '%s%s' "$HASH" "$AHORA" | md5sum | cut -c1-8)"
HORA_LP=$(date -u -d "@$((AHORA - 14400))" '+%F %H:%M')
CUERPO=$(TEXTO="$TEXTO" ID="$ID" CARRIL="$CARRIL" HORA="$HORA_LP" python3 -c '
import json, os
t = ("PEDIDO {id} · carril: {carril} · {hora} (La Paz)\n"
     "Pedido de Sergio Urcullo por Telegram, que él confirmó con un «sí» después de ver este texto exacto:\n"
     "«{texto}»").format(id=os.environ["ID"], carril=os.environ["CARRIL"], hora=os.environ["HORA"], texto=os.environ["TEXTO"])
print(json.dumps({"text": t}, ensure_ascii=False))')

TMP=$(mktemp -d) || exit 1
trap 'rm -rf "$TMP"' EXIT
umask 077
printf 'Authorization: Bearer %s\n' "$ONIA_RUTINA_TOKEN" > "$TMP/h"
# Sin -S y sin -v: un error de curl no tiene que imprimir los encabezados (el token).
if ! "$CURL" -s -f --max-time 40 -X POST "$ONIA_RUTINA_URL" -H @"$TMP/h" \
      -H "anthropic-beta: $BETA" -H "anthropic-version: 2023-06-01" -H "Content-Type: application/json" \
      --data-binary "$CUERPO" > "$TMP/r" 2>/dev/null; then
  echo "La rutina de Claude no respondió: el pedido NO salió. Probá de nuevo en unos minutos." >&2
  exit 1
fi
IFS='|' read -r SID URL < <(python3 -c '
import json, sys
try:
    r = json.load(open(sys.argv[1]))
except ValueError:
    r = {}
print(str(r.get("claude_code_session_id", "")) + "|" + str(r.get("claude_code_session_url", "")))' "$TMP/r")
if [[ ! "$URL" =~ ^https://claude\.ai/ ]]; then
  echo "La rutina contestó algo raro (sin link de sesión): el pedido puede no haber salido." >&2
  exit 1
fi
printf '%s\t%s\t%s\t%s\t%s\t%s\n' "$AHORA" "$ID" "$CARRIL" "$HASH" "$SID" "$URL" >> "$REGISTRO"
rm -f "$ESTADO/previas/$HASH"
printf '✅ Lo tomó Claude (pedido %s). Lo podés seguir acá: %s\nCuando termine te escribo por acá.\n' "$ID" "$URL"
