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

# 🔴 CUÁNDO lo decide la aduana, no este script (2026-09-29). Sergio Urcullo eligió que de
# 22:00 a 06:30 no suene nada y que en sus bloques (colegio, 🔒, 🎬, «sin celular») tampoco.
# Esto manda fotos y videos con curl propio, así que no puede pasar POR la aduana: le
# PREGUNTA. «Esperá» (75) = esta vuelta no manda nada y no marca nada; la primera vuelta
# después del bloque pregunta lo que quedó. Cualquier otra respuesta —aduana ausente o
# rota— manda como siempre: una aduana caída no puede callar lo que espera su ok.
ONIA_AVISO_PUEDO=1 "${ONIA_TG:-/root/bin/onia-tg.sh}" >/dev/null 2>&1
if [ $? -eq 75 ]; then echo "$(date -u +%FT%TZ) espera: silencio o bloque de su calendario"; exit 0; fi

H="/usr/local/lib/hermes-agent/venv/bin/python -m hermes_cli.main kanban --board ${ONIA_TABLERO:-onia}"
ESTADO="/var/lib/onia-aprobaciones"
AVISADAS="$ESTADO/avisadas"          # una linea por id ya avisado
mkdir -p "$ESTADO"; touch "$AVISADAS"
set -a; . /root/.hermes/.env 2>/dev/null; set +a
: "${TELEGRAM_BOT_TOKEN:?}" "${TELEGRAM_HOME_CHANNEL:?}"
API="https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}"

# Cada envio se COMPRUEBA contra la respuesta de Telegram ("ok":true). Tirarla a
# /dev/null —como hace onia-tg.sh— convierte un token vencido o un archivo muy
# pesado en una pregunta que Sergio nunca recibe y que este script da por
# entregada. Si falla, se dice en el log y la tarea NO se marca avisada, para que
# la proxima corrida lo reintente.
_tg() { local r; r=$(curl -s --max-time "$1" "${@:2}") || { echo "  telegram: sin respuesta (curl)"; return 1; }; printf '%s' "$r" | grep -q '"ok":true' && return 0; echo "  telegram rechazo: $(printf '%s' "$r" | cut -c1-160)"; return 1; }
tg_texto() { _tg 20  "$API/sendMessage" -d chat_id="$TELEGRAM_HOME_CHANNEL" -d parse_mode=HTML --data-urlencode text="$1"; }
tg_foto()  { _tg 60  "$API/sendPhoto"   -F chat_id="$TELEGRAM_HOME_CHANNEL" -F parse_mode=HTML -F photo=@"$1" -F caption="$2"; }
tg_video() { _tg 120 "$API/sendVideo"   -F chat_id="$TELEGRAM_HOME_CHANNEL" -F parse_mode=HTML -F video=@"$1" -F caption="$2"; }
esc() { sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g'; }

# Las bloqueadas de ahora, con motivo y kind del ULTIMO evento (ahi lo guarda el
# tablero; `show --json` no lo expone arriba, verificado el 2026-09-03).
LISTA=$($H list --status blocked --json 2>/dev/null) || exit 0
IDS=$(printf '%s' "$LISTA" | python3 -c 'import sys,json; [print(t["id"]) for t in json.load(sys.stdin)]' 2>/dev/null)
[ -n "$IDS" ] || exit 0

# Primera corrida: resumen unico de lo que ya esperaba, y se marcan todas.
if [ ! -s "$AVISADAS" ]; then
  # Sin f-strings con comillas escapadas: el 2026-09-03 un \" adentro de un
  # f-string, adentro de un python -c, adentro de comillas simples de bash, dio
  # SyntaxError — y el resumen de las 11 tareas nunca salio mientras las 11
  # quedaban marcadas como avisadas. .format() con comillas dobles no necesita
  # escapar nada.
  RES=$(printf '%s' "$LISTA" | python3 -c '
import sys,json,html
ts=json.load(sys.stdin)
print("\n".join("• <code>{}</code> — {}".format(t["id"], html.escape(t["title"][:70])) for t in ts))')
  if tg_texto "📋 <b>Ya había $(printf '%s\n' "$IDS" | wc -l) tareas esperando tu decisión</b> (de antes de este aviso):
$RES

Desde ahora te llega cada una al instante. Contestás <code>ok &lt;id&gt;</code> o <code>no &lt;id&gt; motivo</code>."; then
    printf '%s\n' "$IDS" >> "$AVISADAS"
    echo "resumen inicial enviado ($(printf '%s\n' "$IDS" | wc -l) tareas)"
  else
    echo "resumen inicial NO enviado: se reintenta en la proxima corrida"
  fi
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
# TODAS las rutas validas, en orden y sin repetir: un carrusel son 5-7 laminas y
# Sergio tiene que verlas todas para aprobarlo (2026-09-03: "para ver como haces
# los carruseles"). Hasta 10, que es el tope de un album de Telegram.
rutas=[]
for m in re.findall(r"(/[\w./@+:-]+\.(?:png|jpe?g|webp|mp4|mov))", cuerpo+" "+motivo, flags=re.I):
    if m not in rutas and os.path.isfile(m) and os.path.getsize(m)>1024: rutas.append(m)
rutas=rutas[:10]
print("KIND="+shlex.quote(kind)); print("TITULO="+shlex.quote(t.get("title","")))
print("MOTIVO="+shlex.quote(motivo)); print("CUERPO="+shlex.quote(cuerpo[:600]))
print("RUTA="+shlex.quote(rutas[0] if rutas else ""))
print("RUTAS=("+" ".join(shlex.quote(r) for r in rutas)+")")')"
  # Solo lo que espera a Sergio. Un bloqueo tecnico (dependency, capability) es
  # de los loops, no suyo: mandarselo es ruido con cara de pregunta.
  [ "$KIND" = "needs_input" ] || { echo "$id" >> "$AVISADAS"; continue; }

  TXT="❓ <b>$(printf '%s' "$TITULO" | esc)</b>
<code>$id</code>

$(printf '%s' "$MOTIVO" | esc)

$(printf '%s' "$CUERPO" | esc)

Contestá: <code>ok $id</code> · <code>no $id motivo</code>"
  OK=0
  # Dos o mas imagenes = un carrusel: va como ALBUM (sendMediaGroup), con el
  # texto de pie en la primera lamina. Se arma en python para no pelear con las
  # comillas del JSON de Telegram dentro de bash.
  if [ "${#RUTAS[@]}" -ge 2 ] && ! printf '%s\n' "${RUTAS[@]}" | grep -qiE '\.(mp4|mov)$'; then
    if python3 - "$API" "$TELEGRAM_HOME_CHANNEL" "$(printf '%s' "$TXT" | head -c 1000)" "${RUTAS[@]}" <<'PYA'
import sys, json, subprocess
api, chat, pie, *rutas = sys.argv[1:]
media = [{"type": "photo", "media": "attach://f%d" % i} for i in range(len(rutas))]
media[0]["caption"] = pie; media[0]["parse_mode"] = "HTML"
args = ["curl", "-s", "--max-time", "180", api + "/sendMediaGroup", "-F", "chat_id=" + chat, "-F", "media=" + json.dumps(media)]
for i, r in enumerate(rutas): args += ["-F", "f%d=@%s" % (i, r)]
out = subprocess.run(args, capture_output=True, text=True).stdout
ok = '"ok":true' in out
if not ok: print("  telegram rechazo el album: " + out[:160])
sys.exit(0 if ok else 1)
PYA
    then OK=1; RUTA="${#RUTAS[@]} laminas"; fi
  fi
  if [ "$OK" = 0 ]; then
    case "${RUTA##*.}" in
      png|jpg|jpeg|webp|PNG|JPG|JPEG|WEBP) tg_foto "$RUTA" "$(printf '%s' "$TXT" | head -c 1000)" && OK=1 ;;
      mp4|mov|MP4|MOV)                     tg_video "$RUTA" "$(printf '%s' "$TXT" | head -c 1000)" && OK=1 ;;
      *)                                   tg_texto "$TXT" && OK=1 ;;
    esac
  fi
  # Si el archivo no paso (muy pesado, formato raro), la pregunta va igual en
  # texto: Sergio tiene que enterarse aunque no vea la foto.
  if [ "$OK" = 0 ] && [ -n "$RUTA" ]; then
    tg_texto "$TXT
⚠️ (no pude adjuntar el archivo: <code>$(printf '%s' "$RUTA" | esc)</code>)" && OK=1
  fi
  if [ "$OK" = 1 ]; then
    echo "$id" >> "$AVISADAS"; N=$((N+1))
    echo "avisada $id${RUTA:+ (con archivo: $RUTA)}"
  else
    echo "NO avisada $id: fallo el envio, se reintenta en la proxima corrida"
  fi
done
[ "$N" -gt 0 ] && echo "$N pregunta(s) nueva(s) enviada(s) a Sergio"
exit 0
