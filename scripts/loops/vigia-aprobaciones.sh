#!/usr/bin/env bash
# ONIA — cada pregunta que un loop le hace a Sergio le llega a Telegram AL INSTANTE,
# con la foto si la hay.
#
# POR QUE EXISTE. Sergio, 2026-09-03: "como yo verifico si esta bien? se supone que
# por telegram me tiene que enviar hermes los resultados". Medido ese dia:
#   - 11 tareas bloqueadas esperando su decision en el tablero,
#   - el unico que se las contaba era el job de Hermes cada 2 HORAS, en un resumen,
#   - 0 scripts avisaban al bloquear, y 0 de 15 prompts mandaban una imagen:
#     a Lucia le decian "pone la RUTA en el cuerpo" y Sergio recibia... una ruta.
# O sea: el circuito "el loop pregunta -> Sergio contesta ok <id>" existia en los
# prompts y en la constitucion de Hermes, y del lado de Sergio no llegaba nada
# que pudiera contestar desde el telefono.
#
# QUE HACE. Cada 2 minutos mira las tareas en `blocked` cuyo ultimo evento sea
# `kind: needs_input` (asi las bloquea el bloque de los prompts y SOUL.md). Las
# que no aviso antes, las manda: titulo, motivo, un extracto del cuerpo, y como
# contestar. Si el cuerpo o el motivo traen la ruta de una imagen o un video que
# existe en disco, va como FOTO/VIDEO con el texto de pie — que es lo unico que
# permite aprobar una pieza de Lucia mirandola, sin abrir nada.
#
# La primera corrida NO dispara 11 mensajes: manda UN resumen con las que ya
# estaban esperando y a partir de ahi avisa de a una. Un aviso por tarea, nunca
# dos: la marca vive en un archivo de estado.
set -uo pipefail

export HOME=/root
H="/usr/local/lib/hermes-agent/venv/bin/python -m hermes_cli.main kanban --board ${ONIA_TABLERO:-onia}"
ESTADO="/var/lib/onia-aprobaciones"
AVISADAS="$ESTADO/avisadas"          # una linea por id ya avisado
mkdir -p "$ESTADO"; touch "$AVISADAS"
set -a; . /root/.hermes/.env 2>/dev/null; set +a
: "${TELEGRAM_BOT_TOKEN:?}" "${TELEGRAM_HOME_CHANNEL:?}"
API="https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}"

tg_texto() { curl -s -o /dev/null --max-time 20 "$API/sendMessage" -d chat_id="$TELEGRAM_HOME_CHANNEL" -d parse_mode=HTML --data-urlencode text="$1"; }
tg_foto()  { curl -s -o /dev/null --max-time 60 "$API/sendPhoto"   -F chat_id="$TELEGRAM_HOME_CHANNEL" -F parse_mode=HTML -F photo=@"$1" -F caption="$2"; }
tg_video() { curl -s -o /dev/null --max-time 120 "$API/sendVideo"  -F chat_id="$TELEGRAM_HOME_CHANNEL" -F parse_mode=HTML -F video=@"$1" -F caption="$2"; }
esc() { sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g'; }

# Las bloqueadas de ahora, con motivo y kind del ULTIMO evento (ahi lo guarda el
# tablero; `show --json` no lo expone arriba, verificado el 2026-09-03).
LISTA=$($H list --status blocked --json 2>/dev/null) || exit 0
IDS=$(printf '%s' "$LISTA" | python3 -c 'import sys,json; [print(t["id"]) for t in json.load(sys.stdin)]' 2>/dev/null)
[ -n "$IDS" ] || exit 0

# Primera corrida: resumen unico de lo que ya esperaba, y se marcan todas.
if [ ! -s "$AVISADAS" ]; then
  RES=$(printf '%s' "$LISTA" | python3 -c '
import sys,json
ts=json.load(sys.stdin)
print("\n".join(f"• <code>{t[\"id\"]}</code> — {t[\"title\"][:70]}" for t in ts))')
  tg_texto "📋 <b>Ya había $(printf '%s\n' "$IDS" | wc -l) tareas esperando tu decisión</b> (de antes de este aviso):
$RES

Desde ahora te llega cada una al instante. Contestás <code>ok &lt;id&gt;</code> o <code>no &lt;id&gt; motivo</code>."
  printf '%s\n' "$IDS" >> "$AVISADAS"
  exit 0
fi

N=0
for id in $IDS; do
  grep -qx "$id" "$AVISADAS" && continue
  DET=$($H show "$id" --json 2>/dev/null) || continue
  # Los cinco campos salen de python ya citados para bash (shlex.quote): titulos
  # y motivos traen comillas, acentos y saltos de linea, y partirlos a mano con
  # read/IFS es como se pierde media pregunta.
  eval "$(printf '%s' "$DET" | python3 -c '
import sys,json,re,os,shlex
d=json.load(sys.stdin); t=d["task"]; ev=[e for e in d.get("events",[]) if e.get("kind")=="blocked"]
p=(ev[-1].get("payload") or {}) if ev else {}
kind=p.get("kind") or ""; motivo=(p.get("reason") or ""); cuerpo=(t.get("body") or "")
ruta=""
for m in re.findall(r"(/[\w./@+:-]+\.(?:png|jpe?g|webp|mp4|mov))", cuerpo+" "+motivo, flags=re.I):
    if os.path.isfile(m) and os.path.getsize(m)>1024: ruta=m; break
print("KIND="+shlex.quote(kind)); print("TITULO="+shlex.quote(t.get("title","")))
print("MOTIVO="+shlex.quote(motivo)); print("CUERPO="+shlex.quote(cuerpo[:600])); print("RUTA="+shlex.quote(ruta))')"
  # Solo lo que espera a Sergio. Un bloqueo tecnico (dependency, capability) es
  # de los loops, no suyo: mandarselo es ruido con cara de pregunta.
  [ "$KIND" = "needs_input" ] || { echo "$id" >> "$AVISADAS"; continue; }

  TXT="❓ <b>$(printf '%s' "$TITULO" | esc)</b>
<code>$id</code>

$(printf '%s' "$MOTIVO" | esc)

$(printf '%s' "$CUERPO" | esc)

Contestá: <code>ok $id</code> · <code>no $id motivo</code>"
  case "${RUTA##*.}" in
    png|jpg|jpeg|webp|PNG|JPG|JPEG|WEBP) tg_foto "$RUTA" "$(printf '%s' "$TXT" | head -c 1000)" ;;
    mp4|mov|MP4|MOV)                     tg_video "$RUTA" "$(printf '%s' "$TXT" | head -c 1000)" ;;
    *)                                   tg_texto "$TXT" ;;
  esac
  echo "$id" >> "$AVISADAS"; N=$((N+1))
  echo "avisada $id${RUTA:+ (con archivo: $RUTA)}"
done
[ "$N" -gt 0 ] && echo "$N pregunta(s) nueva(s) enviada(s) a Sergio"
exit 0
