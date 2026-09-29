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
#
# ── LA ADUANA (2026-09-29) ───────────────────────────────────────────────────
# Sergio Urcullo, 2026-09-29: "que me envíe poquitas cosas… me manda puros errores".
# Ese día eligió lo que le llega (hermes-content/docs/ONIA_CEREBRO.md, «La regla de
# entrega»): un resumen a las 06:30, un cierre a las 22:00, y en el medio SOLO cuatro
# interrupciones. Este script pasa a ser la aduana única, con tres categorías:
#
#   ONIA_AVISO=sistema     (por defecto) lo de siempre: problema -> tarea, resto -> log.
#   ONIA_AVISO=resumen     no interrumpe: se encola para el resumen/cierre del día.
#   ONIA_AVISO=interrumpe  le llega al momento… salvo que caiga en el silencio.
#   ONIA_TG_DIRECTO=1      = interrumpe (compatibilidad con los emisores viejos).
#
# Modificadores de `interrumpe`:
#   ONIA_AVISO_CLAVE=x     clave estable (OBLIGATORIA para usar RECUPERADO).
#   ONIA_AVISO_ESPERA=30   minutos que la condición tiene que SEGUIR para avisar: el
#                          emisor llama en cada vuelta; si se arregla antes, no suena.
#   ONIA_AVISO_RECUPERADO=1  la condición terminó: si se había avisado, avisa que volvió;
#                          si nunca se avisó, se calla y limpia.
#   ONIA_AVISO_AHORA=1     ignora el silencio y los bloques (lo usan el resumen y el cierre,
#                          que son justamente los mensajes agendados por él).
#   ONIA_AVISO_EMISOR=x    quién avisa, para el resumen.
#
# ── LOS BLOQUES DE SU CALENDARIO (2026-09-29) ────────────────────────────────
# Sergio Urcullo eligió ese día: durante Colegio, los bloques 🔒 («celular fuera»), los 🎬
# de grabación y los «sin celular» NO suena nada; lo que llegue se le manda JUNTO apenas
# termina el bloque. Su calendario pasa a decidir cuándo se lo puede molestar.
#   $ESTADO/bloques-hoy.tsv   fecha<TAB>HHMM<TAB>HHMM<TAB>título  (hora La Paz; lo escribe el
#                             lector de su calendario). Sin archivo, no hay bloques.
#   ONIA_AVISO_SOLTAR=1       (cron cada 5 min, sin mensaje) si ya no está en un bloque, manda
#                             lo retenido en UN mensaje; si terminó en el silencio de la noche,
#                             lo pasa al resumen de las 06:30.
#
# 🔴 El silencio y la cola del resumen están detrás de un interruptor:
# $ONIA_AVISO_ESTADO/activo. Sin él, `interrumpe` sale como siempre. Motivo: si la aduana
# llegara al VPS (el sincronizador la copia sola) antes que el resumen de las 06:30, lo que
# pase de noche se encolaría para un resumen que no existe — callado por construcción.
# El archivo lo crea el mismo paso que instala el resumen, y nadie más.
set -uo pipefail

if [ "${ONIA_AVISO_SOLTAR:-0}" = "1" ]; then MSG="${1:-}"; else MSG="${1:?uso: onia-tg.sh \"mensaje\"}"; fi
LOG="${ONIA_TG_LOG:-/var/log/onia-tg.log}"
TABLERO="${ONIA_TABLERO:-/root/bin/onia-tablero.sh}"
ESTADO="${ONIA_AVISO_ESTADO:-/var/lib/onia-aviso}"

ahora() { date -u +%FT%TZ; }
titulo_de() { printf '%s' "$1" | head -1 | sed 's/<[^>]*>//g; s/^[[:space:]]*//; s/[[:space:]]*$//' | cut -c1-90; }
clave_de() { printf '%s' "$1" | sed 's/[0-9][0-9]*/N/g' | md5sum | cut -c1-6; }

CATEGORIA="${ONIA_AVISO:-}"
if [ -z "$CATEGORIA" ]; then
  if [ "${ONIA_TG_DIRECTO:-0}" = "1" ]; then CATEGORIA=interrumpe; else CATEGORIA=sistema; fi
fi
case "$CATEGORIA" in
  interrumpe|resumen|sistema) ;;
  *) printf '%s CATEGORIA-DESCONOCIDA %s -> sistema\n' "$(ahora)" "$CATEGORIA" >> "$LOG"; CATEGORIA=sistema ;;
esac
POLITICA=0
[ -f "$ESTADO/activo" ] && POLITICA=1

# Hora de La Paz sin depender de tzdata: Bolivia es UTC-4 todo el año, sin horario de verano.
hm_lapaz() { if [ -n "${ONIA_AVISO_HM:-}" ]; then printf '%s' "$ONIA_AVISO_HM"; else date -u -d '-4 hours' +%H%M; fi; }
en_silencio() {
  local hm desde hasta
  hm=$((10#$(hm_lapaz))); desde=$((10#${ONIA_SILENCIO_DESDE:-2200})); hasta=$((10#${ONIA_SILENCIO_HASTA:-0630}))
  [ "$hm" -ge "$desde" ] || [ "$hm" -lt "$hasta" ]
}
encolar() {  # encolar <tipo> <clave> <titulo>
  mkdir -p "$ESTADO" 2>/dev/null
  printf '%s\t%s\t%s\t%s\t%s\t%s\n' "$(ahora)" "${ONIA_AVISO_EMISOR:-?}" "$1" "$2" "$3" \
    "$(printf '%s' "$MSG" | sed 's/<[^>]*>//g' | tr '\n\t' '  ' | cut -c1-300)" >> "$ESTADO/resumen.log"
}
edad_min() { local f="$1"; echo $(( ( $(date +%s) - $(cat "$f" 2>/dev/null || echo 0) ) / 60 )); }
esc() { sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g'; }
fecha_lapaz() { if [ -n "${ONIA_AVISO_FECHA:-}" ]; then printf '%s' "$ONIA_AVISO_FECHA"; else date -u -d '-4 hours' +%F; fi; }
# Imprime el título del bloque en curso y devuelve 0 si ahora cae adentro de uno.
en_bloque() {
  local f="$ESTADO/bloques-hoy.tsv"
  [ -f "$f" ] || return 1
  awk -F'\t' -v hoy="$(fecha_lapaz)" -v hm="$((10#$(hm_lapaz)))" \
    '$1 == hoy && hm >= ($2 + 0) && hm < ($3 + 0) { print $4; hallado = 1; exit } END { exit !hallado }' "$f"
}

# ── soltar: lo retenido durante un bloque sale junto, cuando el bloque termina ──
if [ "${ONIA_AVISO_SOLTAR:-0}" = "1" ]; then
  R="$ESTADO/retenidos.log"
  { [ "$POLITICA" = 1 ] && [ -s "$R" ]; } || exit 0
  en_bloque >/dev/null && exit 0            # sigue ocupado: se espera al final del bloque
  N=$(grep -c . "$R")
  if en_silencio; then
    # El bloque terminó adentro del silencio de la noche: va al resumen de las 06:30.
    awk -F'\t' 'BEGIN { OFS = "\t" } { print $1, $2, "noche", $3, $5, $6 }' "$R" >> "$ESTADO/resumen.log"
    rm -f "$R" "$ESTADO"/retenidos/* 2>/dev/null
    printf '%s SOLTADO-AL-RESUMEN %s aviso(s)\n' "$(ahora)" "$N" >> "$LOG"
    exit 0
  fi
  BLOQUE=$(head -1 "$R" | cut -f4 | esc)
  LISTA=$(cut -f5 "$R" | head -8 | esc | sed 's/^/• /')
  [ "$N" -gt 8 ] && LISTA="$LISTA
… y $((N - 8)) más."
  DIGEST="🔔 <b>Mientras estabas en ${BLOQUE}</b>

$LISTA"
  if ONIA_AVISO=interrumpe ONIA_AVISO_AHORA=1 ONIA_AVISO_CLAVE="soltar-$(date +%s)" ONIA_AVISO_EMISOR=aduana \
       ONIA_AVISO_SOLTAR=0 bash "$0" "$DIGEST" >/dev/null; then
    # Cada aviso retenido cuenta como entregado: su enfriamiento de 6 h arranca ahora.
    mkdir -p "$ESTADO/enviados" 2>/dev/null
    cut -f3 "$R" | while read -r k; do [ -n "$k" ] && date +%s > "$ESTADO/enviados/$k"; done
    rm -f "$R" "$ESTADO"/retenidos/* 2>/dev/null
    printf '%s SOLTADO %s aviso(s) bloque=%s\n' "$(ahora)" "$N" "$BLOQUE" >> "$LOG"
    exit 0
  fi
  exit 1   # Telegram no lo aceptó: lo retenido queda, y la próxima vuelta lo reintenta.
fi

# ── resumen: al resumen del día, nunca al teléfono ───────────────────────────
if [ "$CATEGORIA" = resumen ]; then
  TITULO=$(titulo_de "$MSG"); [ -n "$TITULO" ] || TITULO="aviso sin titulo"
  if [ "$POLITICA" = 1 ]; then
    encolar resumen "${ONIA_AVISO_CLAVE:-$(clave_de "$TITULO")}" "$TITULO"
    printf '%s RESUMEN %s titulo=%s\n' "$(ahora)" "${ONIA_AVISO_EMISOR:-?}" "$TITULO" >> "$LOG"
  else
    printf '%s INFORMATIVO (sin tarea) %s\n' "$(ahora)" "$TITULO" >> "$LOG"
  fi
  exit 0
fi

# ── interrumpe: al teléfono, pero con reglas ─────────────────────────────────
if [ "$CATEGORIA" = interrumpe ]; then
  TITULO=$(titulo_de "$MSG"); [ -n "$TITULO" ] || TITULO="aviso sin titulo"
  CLAVE="${ONIA_AVISO_CLAVE:-$(clave_de "$TITULO")}"
  CLAVE=$(printf '%s' "$CLAVE" | tr -c 'A-Za-z0-9._-' '_')
  ENVIADO="$ESTADO/enviados/$CLAVE"; PENDIENTE="$ESTADO/pendientes/$CLAVE"; NOCTURNO="$ESTADO/nocturnos/$CLAVE"

  if [ "${ONIA_AVISO_RECUPERADO:-0}" = "1" ]; then
    if [ -f "$ESTADO/retenidos/$CLAVE" ]; then
      # Se cayó y volvió mientras él estaba en un bloque: la caída ya no es cierta, así que
      # sale de lo retenido (si no, al terminar el bloque le avisaría algo que ya pasó) y
      # queda como dato del cierre del día.
      awk -F'\t' -v k="$CLAVE" '$3 != k' "$ESTADO/retenidos.log" > "$ESTADO/retenidos.log.$$" 2>/dev/null \
        && mv "$ESTADO/retenidos.log.$$" "$ESTADO/retenidos.log"
      rm -f "$ESTADO/retenidos/$CLAVE" "$PENDIENTE" 2>/dev/null
      encolar resumen "$CLAVE" "$TITULO"
      printf '%s RECUPERADO-EN-BLOQUE clave=%s titulo=%s\n' "$(ahora)" "$CLAVE" "$TITULO" >> "$LOG"
      exit 0
    fi
    if [ ! -f "$ENVIADO" ] && [ ! -f "$NOCTURNO" ]; then
      # Nunca se le aviso la caida: tampoco se le avisa que volvio. Se limpia y se calla.
      rm -f "$PENDIENTE" 2>/dev/null
      printf '%s RECUPERADO-SIN-AVISO clave=%s titulo=%s\n' "$(ahora)" "$CLAVE" "$TITULO" >> "$LOG"
      exit 0
    fi
    rm -f "$ENVIADO" "$PENDIENTE" "$NOCTURNO" 2>/dev/null
  elif [ "${ONIA_AVISO_ESPERA:-0}" -gt 0 ] 2>/dev/null; then
    if [ ! -f "$PENDIENTE" ]; then
      mkdir -p "$ESTADO/pendientes" 2>/dev/null; date +%s > "$PENDIENTE"
      printf '%s ESPERANDO clave=%s 0/%s min titulo=%s\n' "$(ahora)" "$CLAVE" "$ONIA_AVISO_ESPERA" "$TITULO" >> "$LOG"
      exit 0
    fi
    LLEVA=$(edad_min "$PENDIENTE")
    if [ "$LLEVA" -lt "$ONIA_AVISO_ESPERA" ]; then
      printf '%s ESPERANDO clave=%s %s/%s min titulo=%s\n' "$(ahora)" "$CLAVE" "$LLEVA" "$ONIA_AVISO_ESPERA" "$TITULO" >> "$LOG"
      exit 0
    fi
  fi

  # El enfriamiento vale con la politica encendida, o para cualquier emisor NUEVO (el que
  # ya declara ONIA_AVISO): sin esto, un emisor con ESPERA que sigue llamando cada 5 min
  # con la politica apagada repetiria el aviso en cada vuelta.
  if { [ "$POLITICA" = 1 ] || [ -n "${ONIA_AVISO:-}" ]; } && [ "${ONIA_AVISO_RECUPERADO:-0}" != "1" ]; then
    # El mismo aviso no se repite antes de ONIA_AVISO_ENFRIAR minutos (6 h por defecto).
    if [ -f "$ENVIADO" ] && [ "$(edad_min "$ENVIADO")" -lt "${ONIA_AVISO_ENFRIAR:-360}" ]; then
      printf '%s REPETIDO-CALLADO clave=%s titulo=%s\n' "$(ahora)" "$CLAVE" "$TITULO" >> "$LOG"
      exit 0
    fi
  fi
  if [ "$POLITICA" = 1 ] && [ "${ONIA_AVISO_AHORA:-0}" != "1" ] && en_silencio; then
    # De 22:00 a 06:30 no suena nada: va al resumen de la manana, UNA vez por clave.
    if [ -f "$NOCTURNO" ]; then
      printf '%s NOCHE-REPETIDO clave=%s titulo=%s\n' "$(ahora)" "$CLAVE" "$TITULO" >> "$LOG"
    else
      mkdir -p "$ESTADO/nocturnos" 2>/dev/null; date +%s > "$NOCTURNO"
      encolar noche "$CLAVE" "$TITULO"
      printf '%s NOCHE-AL-RESUMEN clave=%s titulo=%s\n' "$(ahora)" "$CLAVE" "$TITULO" >> "$LOG"
    fi
    exit 0
  fi
  if [ "$POLITICA" = 1 ] && [ "${ONIA_AVISO_AHORA:-0}" != "1" ] && BLOQUE_ACTIVO=$(en_bloque); then
    # En clase, en un bloque 🔒/🎬 o «sin celular»: se retiene UNA vez por clave y sale
    # junto al terminar el bloque (ONIA_AVISO_SOLTAR, por cron).
    if [ -f "$ESTADO/retenidos/$CLAVE" ]; then
      printf '%s BLOQUE-REPETIDO clave=%s titulo=%s\n' "$(ahora)" "$CLAVE" "$TITULO" >> "$LOG"
    else
      mkdir -p "$ESTADO/retenidos" 2>/dev/null; date +%s > "$ESTADO/retenidos/$CLAVE"
      printf '%s\t%s\t%s\t%s\t%s\t%s\n' "$(ahora)" "${ONIA_AVISO_EMISOR:-?}" "$CLAVE" "$BLOQUE_ACTIVO" "$TITULO" \
        "$(printf '%s' "$MSG" | sed 's/<[^>]*>//g' | tr '\n\t' '  ' | cut -c1-300)" >> "$ESTADO/retenidos.log"
      printf '%s BLOQUE-RETENIDO clave=%s bloque=%s titulo=%s\n' "$(ahora)" "$CLAVE" "$BLOQUE_ACTIVO" "$TITULO" >> "$LOG"
    fi
    exit 0
  fi
  # Sigue abajo, por el camino directo de siempre.
fi

# ── Camino por defecto: no interrumpir, dar trabajo ──────────────────────────
if [ "$CATEGORIA" = sistema ]; then
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
set -a; . "${ONIA_TG_ENV:-/root/.hermes/.env}" 2>/dev/null; set +a
RESP=$(curl -s --max-time 20 \
  "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -d chat_id="${TELEGRAM_HOME_CHANNEL}" \
  -d parse_mode=HTML \
  --data-urlencode text="$MSG" 2>&1)
if printf "%s" "$RESP" | grep -q "\"ok\":true"; then
  MID=$(printf "%s" "$RESP" | grep -o "\"message_id\":[0-9]*" | head -1 | cut -d: -f2)
  # El titulo va en el log desde el 2026-09-29: antes la linea OK solo tenia message_id y
  # bytes, y medir QUE le llego a Sergio Urcullo obligaba a adivinarlo por los emisores.
  printf "%s OK message_id=%s bytes=%s cat=%s emisor=%s titulo=%s\n" "$(date -u +%FT%TZ)" "${MID:-?}" "${#MSG}" \
    "$CATEGORIA" "${ONIA_AVISO_EMISOR:-?}" "$(titulo_de "$MSG")" >> "$LOG"
  # Recien con la entrega confirmada se marca como avisado: una marca antes del envio
  # callaria el reintento de un envio que fallo.
  if [ "$CATEGORIA" = interrumpe ] && [ "${ONIA_AVISO_RECUPERADO:-0}" != "1" ]; then
    mkdir -p "$ESTADO/enviados" 2>/dev/null && date +%s > "$ESTADO/enviados/$CLAVE"
  fi
  exit 0
fi
printf "%s FALLO bytes=%s resp=%s\n" "$(date -u +%FT%TZ)" "${#MSG}" "$(printf "%s" "$RESP" | head -c 300)" >> "$LOG"
echo "onia-tg.sh: Telegram no acepto el mensaje: $(printf "%s" "$RESP" | head -c 200)" >&2
exit 1
