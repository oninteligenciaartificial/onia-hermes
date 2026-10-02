#!/usr/bin/env bash
# ONIA — Hermes le pasa un pedido de Sergio Urcullo a Claude Code en la nube.
#
# POR QUÉ EXISTE (2026-10-01). Sergio Urcullo: «¿hermes ya nos funciona? quiero que mejores
# también eso, que ya podamos manejar todo desde ahí». El 30-sep había elegido «que Hermes también
# ejecute», y la forma acordada (handoff/hermes-jarvis.md §6.3) es esta: Hermes NO programa —es un
# modelo barato que ya inventó una agenda entera—; le pasa el pedido exacto y, con su confirmación,
# dispara una RUTINA de Claude Code en la nube que hace el trabajo con las reglas de la casa y
# devuelve el link de la sesión. Diseño completo: hermes-content/docs/TELEGRAM_COMMAND_CENTER.md.
#
# DE DÓNDE: la rutina «Pedidos de Sergio Urcullo desde Hermes» de claude.ai, con disparador por
# API. Su URL y su token viven en /root/.config/onia/pedidos.env (600), nunca en el repo; los
# instala hermes-content/deploy/hermes-jarvis/aplicar.sh.
#
# Uso (el pedido va SOLO por la ENTRADA ESTÁNDAR, con un heredoc entre comillas cuyo delimitador
# nadie escribe en un pedido: así ningún caracter del texto —$, `, comillas, ni una línea que diga
# «PEDIDO»— pasa por la shell. Como argumento sale 64):
#   onia-pedido-claude.sh <carril> <<'FIN_PEDIDO_ONIA_7f3c'          vista previa: le manda a Sergio
#   …el pedido…                                                       Urcullo el texto y un CÓDIGO
#   FIN_PEDIDO_ONIA_7f3c                                              directo por Telegram, y sale 3.
#   onia-pedido-claude.sh <carril> --si <código> <<'FIN_PEDIDO_ONIA_7f3c'   lo manda, solo con el
#   …el mismo pedido…                                                       código que él recibió
#   FIN_PEDIDO_ONIA_7f3c                                                    y contestó
#   onia-pedido-claude.sh --lista [AAAA-MM-DD]      los pedidos del día, con su estado
#   onia-pedido-claude.sh --estado                  ¿está configurado? (no manda nada)
#
# Carriles: plataforma · ventas · marca · lucia · hermes · consulta
#
# 🔴 EL «SÍ» ES UN CÓDIGO QUE HERMES NO VE. La vista previa le manda a Sergio Urcullo el texto y un
# código de 6 dígitos DIRECTO por la aduana (no por la salida que lee Hermes), y `--si` exige ese
# código. Cada código sirve una vez, para ESE texto, por una hora, y con tres errores se anula.
# Frena el error de un modelo (mandar sin preguntar, o mandar otro texto); no frena a alguien con
# root en el VPS (revisión de la sesión madre, 1-oct).
#
# Salidas: 0 mandado · 3 vista previa · 64 uso (o el texto como argumento) · 65 carril o texto
# inválido · 66 sin el código correcto · 69 sin configurar · 75 tope del día, repetido o demasiadas
# vistas previas en una hora · 1 no salió o no se sabe (lo dice).
set -uo pipefail
export LC_ALL=C.UTF-8

CONF="${ONIA_PEDIDOS_CONF:-/root/.config/onia/pedidos.env}"
ESTADO="${ONIA_PEDIDOS_ESTADO:-/var/lib/onia-pedidos}"
CURL="${ONIA_PEDIDOS_CURL:-curl}"
TG="${ONIA_TG:-/root/bin/onia-tg.sh}"
TOPE="${ONIA_PEDIDOS_TOPE:-8}"            # pedidos por día de La Paz
MAX_TEXTO=2000
VIGENCIA_PREVIA=3600                      # segundos que vale un código
MAX_ERRORES=3
# Cada vista previa le suena a él aunque sea de noche o esté en un bloque (es la respuesta a lo que
# él mismo está pidiendo): con un tope, un modelo en bucle no lo despierta (revisión de la madre, 2-oct).
TOPE_VISTAS="${ONIA_PEDIDOS_TOPE_VISTAS:-3}"   # vistas previas por hora
CARRILES="plataforma ventas marca lucia hermes consulta"
BETA="experimental-cc-routine-2026-04-01"

AHORA=$(date -u +%s)
HOY=$(date -u -d "@$((AHORA - 14400))" +%F)   # Bolivia: UTC-4 todo el año
REGISTRO="$ESTADO/pedidos.tsv"            # ts_utc id carril hash session_id url
VISTAS="$ESTADO/vistas.log"               # ts_utc de cada código que se le mandó (para el tope por hora)
RESPUESTAS="$ESTADO/respuestas.tsv"       # ts_utc id estado (lo escribe respuestas-pedidos.sh)

uso() { sed -n '/^# Uso/,/^# Carriles/p' "$0" | sed '$d; s/^# \{0,1\}//' >&2; exit 64; }
esc() { sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g'; }

cargar_conf() {
  ONIA_RUTINA_URL=""; ONIA_RUTINA_TOKEN=""
  # shellcheck disable=SC1090
  [ -r "$CONF" ] && . "$CONF"
  [[ "${ONIA_RUTINA_URL:-}" =~ ^https://api\.anthropic\.com/v1/claude_code/routines/trig_[A-Za-z0-9]+/fire$ ]] \
    && [[ "${ONIA_RUTINA_TOKEN:-}" =~ ^[A-Za-z0-9._-]+$ ]]   # la misma forma que exige aplicar.sh
}

estado_de() {  # estado_de <id> -> el último estado que respondió Claude, o «sin respuesta»
  [ -f "$RESPUESTAS" ] || { echo "sin respuesta"; return; }
  awk -F'\t' -v id="$1" '$2 == id { e = $3 } END { print (e == "" ? "sin respuesta" : e) }' "$RESPUESTAS"
}

# --estado y --lista son de SOLO LECTURA (los usa diagnostico.sh): no crean nada en el disco.
case "${1:-}" in
  --estado)
    if cargar_conf; then echo "✅ pedidos a Claude: configurado (${ONIA_RUTINA_URL%/fire})"; exit 0; fi
    echo "pedidos a Claude: falta $CONF con ONIA_RUTINA_URL y ONIA_RUTINA_TOKEN" >&2; exit 69 ;;
  --lista)
    DIA="${2:-$HOY}"
    [ -f "$REGISTRO" ] || exit 0
    while IFS=$'\t' read -r ts id carril _hash _sid url; do
      [ "$(date -u -d "@$((ts - 14400))" +%F)" = "$DIA" ] || continue
      printf '%s\t%s\t%s\t%s\t%s\n' "$(date -u -d "@$((ts - 14400))" +%H:%M)" "$id" "$carril" "$(estado_de "$id")" "${url:-(sin confirmar)}"
    done < "$REGISTRO"
    exit 0 ;;
  ""|-h|--help) uso ;;
esac

mkdir -p "$ESTADO/previas" 2>/dev/null; chmod 700 "$ESTADO" 2>/dev/null

CARRIL="$1"; shift
SI=0; CODIGO=""
case "${1:-}" in
  "") ;;
  --si) SI=1; CODIGO="${2:-}"; [ "$#" -le 2 ] || { echo "sobran argumentos: el pedido va por la entrada estándar, con el heredoc de la skill" >&2; exit 64; } ;;
  *) echo "el pedido va por la entrada estándar (heredoc <<'FIN_PEDIDO_ONIA_7f3c' de la skill), nunca como argumento: así pasaría por la shell" >&2; exit 64 ;;
esac
# El pedido, SOLO por la entrada estándar. timeout: una entrada que nunca se cierra no lo cuelga, y
# un texto cortado a medias no sale.
TEXTO=""
if [ ! -t 0 ]; then
  TEXTO=$(timeout "${ONIA_PEDIDOS_ESPERA_ENTRADA:-5}" cat) || { echo "no pude leer el pedido completo de la entrada estándar: no salió" >&2; exit 65; }
fi
# Se recortan solo el principio y el final del texto ENTERO: la sangría de adentro llega igual.
TEXTO="${TEXTO#"${TEXTO%%[![:space:]]*}"}"
TEXTO="${TEXTO%"${TEXTO##*[![:space:]]}"}"

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
PREVIA="$ESTADO/previas/$HASH"

if [ "$SI" = 0 ]; then
  cargar_conf || { echo "Los pedidos a Claude todavía no están configurados: no le mandé nada." >&2; exit 69; }
  # Contar, mandar y anotar van bajo UN candado (revisión de la madre, 2-oct): sin él, 8 vistas
  # previas en paralelo contaban «0 en la última hora» las 8 y le mandaban 8 códigos. El candado se
  # suelta solo al salir.
  exec 9>"$ESTADO/vistas.lock"
  flock -w 60 9 || { echo "Hay otra vista previa en curso y no terminó: probá de nuevo en un momento." >&2; exit 75; }
  RECIENTES=$(awk -v desde=$((AHORA - 3600)) '$1 >= desde' "$VISTAS" 2>/dev/null | grep -c .)
  if [ "$RECIENTES" -ge "$TOPE_VISTAS" ]; then
    echo "Ya le mandé $RECIENTES códigos a Sergio Urcullo en la última hora (tope $TOPE_VISTAS): no le mando otro. Que conteste uno de esos, o probá en un rato." >&2
    exit 75
  fi
  CODE=$(python3 -c 'import secrets; print("%06d" % secrets.randbelow(10**6))')
  MSG="🔐 <b>¿Le mando esto a Claude?</b> (carril $CARRIL)

«$(printf '%s' "$TEXTO" | esc)»

Si es lo que pediste, contestale a Hermes con el código <b>$CODE</b>. Si no, no contestes nada."
  # DIRECTO a él (la salida de este comando la lee Hermes, el código NO va ahí).
  if ! ONIA_AVISO=interrumpe ONIA_AVISO_AHORA=1 ONIA_AVISO_CLAVE="pedido-codigo-$HASH-$AHORA" ONIA_AVISO_EMISOR=pedidos \
       "$TG" "$MSG" </dev/null >/dev/null 2>&1; then
    echo "No le pude mandar el código a Sergio Urcullo: el pedido no puede salir." >&2
    exit 1
  fi
  ( umask 077; printf '%s %s 0\n' "$AHORA" "$CODE" > "$PREVIA" )
  # Solo la última hora: el archivo no crece.
  { awk -v desde=$((AHORA - 3600)) '$1 >= desde' "$VISTAS" 2>/dev/null; echo "$AHORA"; } > "$VISTAS.$$" && mv -f "$VISTAS.$$" "$VISTAS"
  printf 'Le mandé a Sergio Urcullo el pedido (carril %s) y un código por Telegram.\nMandalo solo si te contesta con ese código: el mismo comando con --si <código>.\n' "$CARRIL"
  exit 3
fi

# ── Con --si: el código que le llegó a él, para ESTE texto ─────────────────────
# 2>/dev/null ANTES de «<»: si no, el error de una previa inexistente imprime su ruta, y en esa ruta
# está guardado el código (revisión de la madre, 2-oct).
read -r VISTA GUARDADO ERRORES 2>/dev/null < "$PREVIA" || { VISTA=0; GUARDADO=""; ERRORES=0; }
if [ -z "$GUARDADO" ] || [ $((AHORA - VISTA)) -gt "$VIGENCIA_PREVIA" ]; then
  rm -f "$PREVIA"
  echo "No hay un código vigente para este pedido: no salió." >&2
  exit 66
fi
if [ "$CODIGO" != "$GUARDADO" ]; then
  ERRORES=$((ERRORES + 1))
  if [ "$ERRORES" -ge "$MAX_ERRORES" ]; then
    rm -f "$PREVIA"; echo "Código equivocado $ERRORES veces: el pedido se anuló." >&2
  else
    printf '%s %s %s\n' "$VISTA" "$GUARDADO" "$ERRORES" > "$PREVIA"; echo "Ese no es el código que le llegó a Sergio Urcullo: no salió." >&2
  fi
  exit 66
fi
cargar_conf || { echo "pedidos a Claude: falta $CONF con ONIA_RUTINA_URL y ONIA_RUTINA_TOKEN" >&2; exit 69; }

if [ -f "$REGISTRO" ]; then
  REPE=$(awk -F'\t' -v h="$HASH" -v desde=$((AHORA - 3600)) '$4 == h && $1 >= desde { print ($6 == "" ? "(sin link: mirá --lista)" : $6) }' "$REGISTRO" | tail -1)
  [ -n "$REPE" ] && { rm -f "$PREVIA"; echo "Ese mismo pedido ya salió hace menos de una hora: $REPE" >&2; exit 75; }
  HECHOS=$(while IFS=$'\t' read -r ts _r; do
             [ "$(date -u -d "@$((ts - 14400))" +%F)" = "$HOY" ] && echo x
           done < "$REGISTRO" | grep -c x)
  [ "$HECHOS" -ge "$TOPE" ] && { echo "Ya van $HECHOS pedidos hoy (tope $TOPE). Si es urgente, que lo vea la sesión madre." >&2; exit 75; }
fi

ID="p_$(printf '%s%s' "$HASH" "$AHORA" | md5sum | cut -c1-8)"
HORA_LP=$(date -u -d "@$((AHORA - 14400))" '+%F %H:%M')
TMP=$(mktemp -d) || exit 1
trap 'rm -rf "$TMP"' EXIT
umask 077
TEXTO="$TEXTO" ID="$ID" CARRIL="$CARRIL" HORA="$HORA_LP" python3 -c '
import json, os
t = ("PEDIDO {id} · carril: {carril} · {hora} (La Paz)\n"
     "Pedido de Sergio Urcullo por Telegram, que él confirmó con un código después de ver este texto exacto:\n"
     "«{texto}»").format(id=os.environ["ID"], carril=os.environ["CARRIL"], hora=os.environ["HORA"], texto=os.environ["TEXTO"])
print(json.dumps({"text": t}, ensure_ascii=False))' > "$TMP/cuerpo.json"
printf 'Authorization: Bearer %s\n' "$ONIA_RUTINA_TOKEN" > "$TMP/h"

# Sin -S y sin -v: un error de curl no tiene que imprimir los encabezados (el token).
HTTP=$("$CURL" -s --max-time 40 -o "$TMP/r" -w '%{http_code}' -X POST "$ONIA_RUTINA_URL" -H @"$TMP/h" \
       -H "anthropic-beta: $BETA" -H "anthropic-version: 2023-06-01" -H "Content-Type: application/json" \
       --data-binary @"$TMP/cuerpo.json" 2>/dev/null); RC=$?
IFS='|' read -r SID URL < <(python3 -c '
import json, sys
try:
    r = json.load(open(sys.argv[1]))
except Exception:
    r = {}
r = r if isinstance(r, dict) else {}
print(str(r.get("claude_code_session_id", "")) + "|" + str(r.get("claude_code_session_url", "")))' "$TMP/r")

# Tres resultados, y solo uno se puede reintentar sin miedo a duplicar:
if [ "$RC" = 6 ] || [ "$RC" = 7 ] || [[ "${HTTP:-}" =~ ^4[0-9][0-9]$ ]]; then
  # Sin conexión (6/7) o la rutina lo rechazó (4xx): NO salió. El código sigue sirviendo.
  echo "El pedido NO salió ($([ -n "${HTTP:-}" ] && [ "$HTTP" != 000 ] && echo "la rutina contestó $HTTP" || echo "sin conexión con la rutina")). Probá de nuevo en unos minutos con el mismo código." >&2
  exit 1
fi
rm -f "$PREVIA"
if [ "$RC" = 0 ] && [[ "${HTTP:-}" =~ ^2[0-9][0-9]$ ]] && [[ "$URL" =~ ^https://claude\.ai/ ]]; then
  printf '%s\t%s\t%s\t%s\t%s\t%s\n' "$AHORA" "$ID" "$CARRIL" "$HASH" "$SID" "$URL" >> "$REGISTRO"
  printf '✅ Lo tomó Claude (pedido %s). Lo podés seguir acá: %s\nCuando termine te escribo por acá.\n' "$ID" "$URL"
  exit 0
fi
# Ambiguo (se cortó, 5xx, o contestó sin link): pudo haber salido. Se registra para no duplicarlo.
printf '%s\t%s\t%s\t%s\t\t\n' "$AHORA" "$ID" "$CARRIL" "$HASH" >> "$REGISTRO"
echo "Puede haber salido (la rutina no lo confirmó): NO lo reintentes. Mirá --lista o tus sesiones en claude.ai/code." >&2
exit 1
