#!/usr/bin/env bash
# ONIA — el ENRUTADOR de avisos. Decide si algo merece interrumpir a Sergio Urcullo
# o si es trabajo que el sistema tiene que arreglar solo.
#
# POR QUE CAMBIO (2026-09-08). Sergio Urcullo, medido y con razon:
#   "solo quiero que hermes me escriba para preguntas de desarrollo, para terminar
#    un enfoque o para poner una nueva tarea, si no que no me escriba; y si se
#    friega el CI o los loops, que el lo arregle y que solo diga que esta todo en orden"
#
# El numero que le da la razon, del registro de este mismo script:
#   2026-09-04: 443 mensajes · 09-05: 256 · 09-06: 242 · 09-07: 226
# Dieciocho scripts le escribian por aca. Un aviso cada tres minutos no es un aviso:
# es ruido, y el ruido esconde justo el mensaje que si importaba.
#
# LA REGLA NUEVA:
#   - Por defecto, un aviso NO se manda: se convierte en TAREA del tablero, que es
#     de donde los loops sacan trabajo. Un CI roto o un loop caido ahora se arregla,
#     no se avisa.
#   - Solo con ONIA_TG_DIRECTO=1 sale a Telegram. Eso queda para el circuito de
#     aprobaciones (donde el TIENE que decidir) y para las preguntas de Hermes.
#   - Una vez al dia, `onia-parte-diario.sh` manda UN mensaje: "todo en orden", o la
#     lista corta de lo que el sistema no pudo arreglar solo.
#
# Uso:
#   onia-tg.sh "mensaje"                      -> tarea en el tablero
#   ONIA_TG_DIRECTO=1 onia-tg.sh "mensaje"    -> Telegram, como antes
set -uo pipefail

MSG="${1:?uso: onia-tg.sh \"mensaje\"}"
LOG="${ONIA_TG_LOG:-/var/log/onia-tg.log}"
TABLERO="${ONIA_TABLERO:-/root/bin/onia-tablero.sh}"

# ── Camino por defecto: no interrumpir, dar trabajo ──────────────────────────
if [ "${ONIA_TG_DIRECTO:-0}" != "1" ]; then
  # El titulo es la primera linea sin HTML ni emojis de adorno, recortada.
  TITULO=$(printf '%s' "$MSG" | head -1 | sed 's/<[^>]*>//g; s/^[[:space:]]*//; s/[[:space:]]*$//' | cut -c1-90)
  [ -n "$TITULO" ] || TITULO="aviso sin titulo"

  # 🔴 SOLO los PROBLEMAS se vuelven tarea. Lo demas se registra y se calla.
  #
  # Medido a la hora de encender esto (2026-09-08): el tablero se lleno de
  # "✅ chatbot-cola · 980s · 1 commit(s)" y "🛟 Rescatado un mensaje perdido".
  # Eso no es trabajo: es un loop diciendo que le fue bien. Convertirlo en tarea
  # mudo el ruido de Telegram al tablero — que es de donde los loops sacan que
  # hacer — y ahi molesta MAS, porque compite con el trabajo de verdad.
  #
  # Sergio Urcullo lo dijo asi: "si se friega el CI o los loops, que el lo
  # arregle". Lo que no se frego, no hay que arreglarlo.
  #
  # El log guarda TODO igual (grep -a /var/log/onia-tg.log), asi que nada se
  # pierde: lo que cambia es que solo lo roto ocupa un lugar en el tablero.
  # 🔴 Se clasifica por la PRIMERA LINEA, no por el mensaje entero. Medido el
  # 2026-09-08 16:37: "🛟 Rescatado un mensaje perdido" creo tarea igual, porque su
  # CUERPO nombraba el error del que rescato. Un aviso que cuenta un problema ya
  # resuelto no es un problema: mirar el cuerpo entero convierte cada relato en
  # tarea. La primera linea es el titular — todos estos scripts ponen ahi su emoji.
  PRIMERA=$(printf '%s' "$MSG" | head -1)

  # 🔴 «Nada roto» NO es un problema. Medido el 2026-09-10: el clasificador de arriba
  # funciona —casi todo sale INFORMATIVO— y aun asi entraron 4 tareas de EXITO ese dia
  # (t_7c1c0612, t_3ef94060, t_154ce16c, t_14cc85d0). La regla "se clasifica por la
  # primera linea" SUPONE que el aviso tiene varias lineas; cuando es UN parrafo —que es
  # como escriben recorrido-cliente y el integrador— la primera linea ES el mensaje
  # entero y el filtro vuelve a mirar el cuerpo, sin que nada se ponga rojo.
  #
  # Ahi la palabra llega NEGADA, y la negacion es justo lo que escribe un carril al que
  # le fue bien: "Nada roto", "sin nada roto", "sin errores". El resultado es una tarea
  # que dice que algo esta roto porque el loop dijo que NO lo estaba.
  #
  # Se BORRA la negacion antes de buscar, nunca se saca la palabra del patron: un aviso
  # que niega una cosa y reporta otra ("Nada roto en el recorrido, pero el emisor SIAT
  # FALLO") tiene que seguir abriendo tarea. Ese es el caso que ancla el gate.
  SIN_NEGACION=$(printf '%s' "$PRIMERA" | sed -E '
    s/\b(nada|ning[uú]n[ao]?s?|cero|sin( nada)?)[[:space:]]+(m[aá]s[[:space:]]+)?(rot[oa]s?|errores?|fall[aoeáéó][a-z]*|conflictos?|problemas?|abortad[oa]s?)\b/ /gI
    s/\bno[[:space:]]+(se[[:space:]]+)?(est[aá]|estaba|estuvo|hay|hubo|fue)[[:space:]]+(nada[[:space:]]+)?(rot[oa]s?|abortad[oa]s?)\b/ /gI
    s/\bno[[:space:]]+fall[aoeáéó][a-z]*\b/ /gI
  ')

  if ! printf '%s' "$SIN_NEGACION" | grep -qaiE '⚠️|🔴|❌|🚨|\bFALL|\berror|\bno pud|\bcaido|\bcaida|\broto\b|\bconflicto|\btimeout|\babortad'; then
    printf '%s INFORMATIVO (sin tarea) %s\n' "$(date -u +%FT%TZ)" "$(printf '%s' "$PRIMERA" | cut -c1-90)" >> "$LOG"
    exit 0
  fi

  # Clave estable para deduplicar: el mismo aviso repetido no crea 144 tareas al dia.
  # Va al PRINCIPIO del titulo a proposito: la lista del tablero recorta el final.
  #
  # 🔴 La clave se calcula sobre el titulo NORMALIZADO, nunca sobre el crudo. Medido el
  # 2026-09-08, dos horas despues de que este enrutador entrara: de las 28 tareas [auto:]
  # vivas, 19 eran el MISMO aviso repetido. El emisor dominante es el aviso de fin de
  # vuelta de los loops, y lleva su duracion adentro del titulo:
  #     "✅ chatbot-cola · 929s · 1 commit(s)"  -> clave 8d79f2
  #     "✅ chatbot-cola · 954s · 1 commit(s)"  -> clave c3ad73
  # Hashean distinto, asi que la dedup no los veia: 4 loops x ~24 vueltas = ~96 tareas
  # al dia del mismo aviso — exactamente las "144 tareas al dia" que la linea de arriba
  # dice querer evitar, mudadas de Telegram al tablero, que es de donde los carriles
  # sacan trabajo y lo leen ANTES que su cola.
  # Colapsar las corridas de digitos deja la clave estable entre vueltas. Lo que NO se
  # toca es el TITULO: la tarea sigue mostrando el numero de la primera vez.
  CLAVE=$(printf '%s' "$TITULO" | sed 's/[0-9][0-9]*/N/g' | md5sum | cut -c1-6)
  MARCA="[auto:$CLAVE]"

  # Si ya hay una tarea abierta con esta clave, no se duplica: se anota y se sale.
  #
  # 🔴 Nada de `grep -q` aca dentro. Con `pipefail`, `grep -q` corta al primer match,
  # el productor muere con SIGPIPE (141) y la tuberia entera se reporta como FALLIDA
  # aunque haya encontrado la linea. Medido el 2026-09-08: la prueba dijo "no creo la
  # tarea" con la tarea creada y visible en el tablero. Con esa forma, la dedup habria
  # dicho SIEMPRE "no existe" y este script crearia 144 tareas iguales por dia — el
  # mismo ruido que vino a sacar, mudado de Telegram al tablero.
  # `grep -c` no corta al primer match, asi que no hay SIGPIPE.
  # EL ID DE LA TAREA SE LE DEVUELVE AL QUE LLAMA, no solo al log.
  #
  # Sin esto, el que avisa el rojo no se entera de QUE tarea lo representa, asi que
  # cuando la cosa se recupera no tiene como cerrarla: manda un mensaje nuevo de
  # "recuperado" y deja viva la tarea roja que ya no es cierta. Medido el 2026-09-10
  # (t_c8a2d7d5 afirmaba "master esta roto" con el CI verde desde hacia ~21 h) y el
  # 2026-09-24 (cuatro tareas "Loop callado en la PC de casa" del 19-sep, con los
  # cuatro loops corriendo). El tablero es de donde los carriles sacan trabajo ANTES
  # que su cola, asi que una tarea roja falsa no es ruido: es trabajo inventado.
  #
  # Va a stdout en UNA linea estable `TAREA <id>`, para que el llamador la capture
  # con `$(...)`. El log sigue igual: esto es aditivo, y quien no mire stdout —que
  # es casi todo el mundo, con `>/dev/null`— no cambia en nada.
  PENDIENTES=$("$TABLERO" list 2>/dev/null | grep -F "$MARCA" | grep -v '^✓' || true)
  if [ -n "$PENDIENTES" ]; then
    # Ya hay una tarea abierta con esta clave: no se duplica, pero se devuelve SU id.
    # Un episodio que vuelve a avisar mientras su tarea sigue viva tiene que poder
    # adoptarla; si no, la marca queda sin id y el verde no cierra nada.
    YA=$(printf '%s' "$PENDIENTES" | grep -oE 't_[0-9a-f]{8}' | head -1)
    printf '%s TAREA-YA-EXISTE %s clave=%s titulo=%s\n' "$(date -u +%FT%TZ)" "${YA:-?}" "$CLAVE" "$TITULO" >> "$LOG"
    [ -n "$YA" ] && printf 'TAREA %s\n' "$YA"
    exit 0
  fi

  SALIDA=$("$TABLERO" create "$MARCA $TITULO" --body "$MSG" --priority 2 2>&1)
  if printf '%s' "$SALIDA" | grep -qE 't_[0-9a-f]{8}'; then
    ID=$(printf '%s' "$SALIDA" | grep -oE 't_[0-9a-f]{8}' | head -1)
    printf '%s TAREA %s clave=%s titulo=%s\n' "$(date -u +%FT%TZ)" "$ID" "$CLAVE" "$TITULO" >> "$LOG"
    printf 'TAREA %s\n' "$ID"
    exit 0
  fi

  # Si el tablero no acepta la tarea, el aviso NO se manda igual a Telegram: eso
  # devolveria el ruido que este cambio existe para sacar. Queda en el log, y el
  # parte diario lo delata porque el tablero no va a tener la tarea.
  printf '%s TABLERO-FALLO titulo=%s resp=%s\n' "$(date -u +%FT%TZ)" "$TITULO" "$(printf '%s' "$SALIDA" | head -c 200)" >> "$LOG"
  echo "onia-tg.sh: el tablero no acepto la tarea: $(printf '%s' "$SALIDA" | head -c 200)" >&2
  exit 1
fi

# ── Camino directo: Telegram, con la verificacion de siempre ─────────────────
# Hasta el 2026-09-03 esto tiraba la respuesta (-o /dev/null): un HTML mal formado o un
# timeout se perdia en silencio y el que llamaba creia que aviso (tarea t_2f7ac300).
# Ahora: exit 1 si no vuelve "ok":true, y cada envio deja su linea en el log.
set -a; . /root/.hermes/.env 2>/dev/null; set +a
RESP=$(curl -s --max-time 20 \
  "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -d chat_id="${TELEGRAM_HOME_CHANNEL}" \
  -d parse_mode=HTML \
  --data-urlencode text="$MSG" 2>&1)
if printf "%s" "$RESP" | grep -q "\"ok\":true"; then
  MID=$(printf "%s" "$RESP" | grep -o "\"message_id\":[0-9]*" | head -1 | cut -d: -f2)
  printf "%s OK message_id=%s bytes=%s\n" "$(date -u +%FT%TZ)" "${MID:-?}" "${#MSG}" >> "$LOG"
  exit 0
fi
printf "%s FALLO bytes=%s resp=%s\n" "$(date -u +%FT%TZ)" "${#MSG}" "$(printf "%s" "$RESP" | head -c 300)" >> "$LOG"
echo "onia-tg.sh: Telegram no acepto el mensaje: $(printf "%s" "$RESP" | head -c 200)" >&2
exit 1
