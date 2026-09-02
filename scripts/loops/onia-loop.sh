#!/usr/bin/env bash
# ONIA — corredor de loops de carril en el VPS, con Claude Code headless.
#
# Los loops vivian dentro de la app de Claude Code en Windows y SOLO disparaban
# cuando la app estaba quieta. La sesion madre encadenaba trabajo sin parar, asi
# que nunca hubo ventana: medido el 2026-09-01, tres loops tenian el MISMO
# lastRunAt al milisegundo (la rafaga de recuperacion al abrir la app) y desde
# entonces ninguno habia corrido. Y con la laptop apagada no corren nunca.
# Por eso se mudan a cron acá.
#
# Uso:  onia-loop.sh <canario-visual|chatbot-cola|marca-personal|kpis-semanal|onia-cola|docs-auditoria|web-venta>
# APAGAR: crontab -e y comentar la linea del loop.
#
# Forma copiada de /root/bin/claude-guardia.sh (secretos por .hermes/.env, unset
# de la API key, timeout duro, permisos por --allowedTools, log rotado, aviso a
# Telegram al morirse). Lo que se le AGREGA, porque al guardian le falta y con un
# loop horario duele: un flock, y un `cd` que se verifica antes de correr nada
# (el guardian lleva semanas diagnosticando desde /root porque su carpeta
# desaparecio y `set -uo pipefail` sin `-e` no lo freno).
set -uo pipefail

NOMBRE="${1:-}"

# 🔴 `tg` se define ACA ARRIBA, antes del `case`, y no junto a `avisar`.
# El 2026-09-02 `investigacion` y `kpis-semanal` perdieron su `case` (alguien
# reescribio este archivo hacia atras) y sus crons los llamaron durante horas:
# cada corrida moria en el `*)` con exit 64 — ANTES de que `avisar` existiera —
# asi que no salio ni un aviso. Un loop registrado, con prompt en disco y cron
# perfecto, que no corria y no lo decia. Todo lo que falle antes de esta linea
# falla MUDO, y por eso esta linea va lo mas arriba posible.
tg() { /root/bin/onia-tg.sh "$1" >/dev/null 2>&1 || true; }

# Los ids conocidos se leen del `case` de abajo, no de una lista a mano: la que
# habia escrita nombraba 7 y ya se habia olvidado de `kpis-semanal`. Un mensaje
# de uso que miente sobre que loops existen manda a buscar el problema al lugar
# equivocado.
IDS=$(sed -n 's/^  \([a-z][a-z0-9-]*\))$/\1/p' "$0" 2>/dev/null | paste -sd'|' -)

# Tope de turnos por vuelta. 120 alcanza para cerrar UN item de cola; el
# integrador necesita mas, porque cada carril son fetch + merge + gates + push.
TURNOS=120
# Modelo y esfuerzo por loop. Default: lo caro, porque la mayoria de los carriles
# decide algo. Sergio, 2026-09-02: "me parece que tenemos que bajar el uso de
# claude opus 5 max en algunas tareas, mira las menos usables o que no necesitan
# mucho razonamiento". Se baja SOLO donde el trabajo es mecanico: abrir, comparar,
# contar. Donde hay que decidir que esta mal y por que, sigue Opus.
MODELO=claude-opus-5
ESFUERZO=max
case "$NOMBRE" in
  canario-visual)
    # Abre 10 pantallas, compara contra baseline y escribe la diferencia. El juicio
    # duro (si un defecto es real) lo hace el carril dueño cuando lo toma; aca el
    # trabajo es mecanico. Sonnet alcanza y cuesta una fraccion.
    MODELO=claude-sonnet-5
    ESFUERZO=medium
    WT=/root/loops/onia-hermes-canario
    RAMA=claude/canario-visual
    # 5 pantallas con Playwright + mirar 5 capturas. Cada 6 h: sobra margen.
    TOPE=2700
    TOOLS=Read,Write,Edit,Grep,Glob,Bash
    ;;
  chatbot-cola)
    WT=/root/loops/onia-hermes-chatbot
    RAMA=claude/chatbots-platform-review-0d1d09
    # El cron es HORARIO: el tope tiene que ser < 60 min o la vuelta siguiente
    # llega con esta viva. 50 min deja 10 de colchon. El flock cubre el resto.
    TOPE=3000
    TOOLS=Read,Write,Edit,Grep,Glob,Bash
    ;;
  marca-personal)
    WT=/root/loops/onia-hermes-marca-personal
    RAMA=claude/marca-personal-loop
    # Drop del dia siguiente + 1 pieza de produccion. Corre 1 vez al dia (21:00
    # UTC = 17:00 La Paz), asi el drop de las 19:00 esta listo con 2 h de colchon.
    TOPE=3000
    TOOLS=Read,Write,Edit,Grep,Glob,Bash
    ;;
  onia-cola)
    # 120 turnos lo cortaron a mitad de un merge el 2026-09-02 y dejaron
    # MERGE_HEAD abierto sobre main, con el indice entero montado.
    TURNOS=260
    # EL INTEGRADOR. Es el unico que mergea ramas de carril a main; si no corre,
    # nada llega a main y main alimenta el deploy del VPS y el de Vercel.
    # Vivia en Windows y por eso llevaba dias sin integrar: las tareas de la app
    # solo disparan cuando la app esta quieta.
    WT=/root/loops/onia-hermes
    RAMA=main
    # Cron HORARIO: tope < 60 min o la vuelta siguiente llega con esta viva.
    TOPE=3000
    TOOLS=Read,Write,Edit,Grep,Glob,Bash
    ;;
  docs-auditoria)
    # Carril docs/infra: que lo escrito sea cierto. Un doc falso manda a la
    # proxima sesion al archivo equivocado. Combustible que no se agota.
    WT=/root/loops/onia-hermes-docs
    RAMA=claude/docs-auditoria
    TOPE=2400
    TOOLS=Read,Write,Edit,Grep,Glob,Bash
    ;;
  kpis-semanal)
    # Junta numeros y los presenta. No decide nada: no necesita Opus.
    MODELO=claude-sonnet-5
    ESFUERZO=medium
    # KPIs de lunes del carril marca personal. Mismo worktree que marca-personal;
    # corre lunes 13:07 UTC, lejos de las corridas :56 de ese loop.
    WT=/root/loops/onia-hermes-marca-personal
    RAMA=claude/marca-personal-loop
    TOPE=1800
    TOOLS=Read,Write,Edit,Grep,Glob,Bash
    ;;
  web-venta)
    # Dueno de onia.com.bo/ y /empezar — la puerta de entrada del producto, que
    # hasta el 2026-09-02 no tenia carril: el canario dejaba defectos ahi y nadie
    # los consumia. Zona: web-factory/apps/onia-platform/ y nada mas.
    WT=/root/loops/onia-hermes-web-venta
    RAMA=claude/web-venta
    TOPE=3000
    TOOLS=Read,Write,Edit,Grep,Glob,Bash
    ;;
  investigacion)
    # Carril investigacion/radar: cotiza las decisiones que esperan a Sergio y
    # cierra las que ya se resolvieron solas.
    # RESTAURADO 2026-09-02 09:20 UTC. Su `case` desaparecio cuando se reescribio
    # este script a las 05:44 (el que agrego web-venta y la guarda de MERGE_HEAD).
    # Desde entonces el cron `26 3,9,15,21` lo llamaba y moria en el `*)` con
    # exit 64, ANTES de la funcion `avisar`: un loop muerto que no avisa nadie.
    # Los tres valores salen del log de su unica vuelta viva (03:00:20Z), no de
    # memoria: "rama claude/investigacion — tope 2400s", y el worktree figura en
    # `git worktree list`. TOOLS es el valor uniforme del resto del archivo.
    WT=/root/loops/onia-hermes-investigacion
    RAMA=claude/investigacion
    TOPE=2400
    TOOLS=Read,Write,Edit,Grep,Glob,Bash
    ;;
  lucia)
    # Carril Lucia / modelos (Higgsfield). Era una sesion de Windows: se mudo al
    # VPS el 2026-09-02 para que corra con la laptop apagada.
    # 🔴 Es el UNICO carril que puede quemar plata solo. Su prompt le prohibe
    # generar video y dar de alta plataformas: deja todo listo y Sergio dispara.
    WT=/root/loops/onia-hermes-lucia
    RAMA=claude/lucia-vps
    TOPE=2700
    TOOLS=Read,Write,Edit,Grep,Glob,Bash
    ;;
  recorrido-cliente)
    # Recorre el producto de punta a punta como un cliente real: home -> alta ->
    # rubro -> cargar un dato -> pantalla de cobro -> bandeja. El canario mira
    # pantallas SUELTAS; este mira el CAMINO, que es donde se pierde la plata.
    # Playwright como root necesita --no-sandbox: sin eso no abre y la vuelta se
    # pierde creyendo que el sitio esta caido.
    WT=/root/loops/onia-hermes-recorrido
    RAMA=claude/recorrido-cliente
    TOPE=2700
    TOOLS=Read,Write,Edit,Grep,Glob,Bash
    ;;
  tendencias)
    # Investiga que funciona AHORA (formatos, ganchos, estructura de carrusel) y
    # lo convierte en recetas EJECUTABLES para los carriles de contenido. El
    # radar viejo era solo de la marca personal; para producto y ads no habia
    # nada. Solo fuentes publicas: no se loguea a ninguna red ni gasta.
    WT=/root/loops/onia-hermes-tendencias
    RAMA=claude/tendencias
    TOPE=2400
    TOOLS=Read,Write,Edit,Grep,Glob,Bash
    ;;
  web-factory-dev)
    # Webs de cliente. Se APAGO el 2026-09-02 por quedarse sin cola y se volvio a
    # encender el MISMO dia al medir que LOOP_COLA.md tenia 7 items reales otra
    # vez. Un carril con trabajo y sin nadie que lo haga es lo contrario de
    # "todo el tiempo trabajando".
    WT=/root/loops/onia-hermes-webfactory
    RAMA=claude/web-factory-dev
    TOPE=2700
    TOOLS=Read,Write,Edit,Grep,Glob,Bash
    ;;
  calidad-generado)
    # Juzga lo que Higgsfield genera y cuida que Lucia sea SIEMPRE la misma cara.
    # No genera nada: abre las piezas del ultimo lote, las mira contra la rubrica,
    # y escribe en la bitacora POR QUE salio bien la que salio bien — eso es lo
    # que hace que la proxima no sea suerte. La deriva de un rasgo no se nota
    # hasta que ya se publicaron veinte piezas.
    WT=/root/loops/onia-hermes-calidad
    RAMA=claude/calidad-generado
    TOPE=2400
    TOOLS=Read,Write,Edit,Grep,Glob,Bash
    ;;
  supervisor)
    # Audita a los OTROS loops: abre sus commits y dice si el trabajo sirve.
    # Ninguno se mira a si mismo, y un loop que produce basura no falla — commitea,
    # reporta bien, y se ve igual que uno que sirve. Contar commits mide actividad;
    # abrirlos mide valor.
    WT=/root/loops/onia-hermes-supervisor
    RAMA=claude/supervisor
    TOPE=2400
    TOOLS=Read,Write,Edit,Grep,Glob,Bash
    ;;
  *)
    # Este es el camino por el que un loop muere sin que nadie se entere: el cron
    # lo sigue llamando cada hora y el unico rastro es un exit 64 en un log que
    # nadie abre. Ahora grita.
    echo "uso: $0 <${IDS:-?}>" >&2
    tg "🔴 <b>Loop sin <code>case</code></b>: <code>${NOMBRE:-(vacio)}</code> no existe en <code>$0</code>, pero algo lo esta llamando (su cron). Muere con exit 64 en cada corrida. Conocidos: <code>${IDS:-?}</code>"
    exit 64 ;;
esac

LOG=/var/log/onia-loop-$NOMBRE.log
PROMPT=/root/bin/loops/$NOMBRE.md
LOCK=/run/onia-loop-$NOMBRE.lock
AVISADO=/root/loops/estado/$NOMBRE.ultimo-aviso
mkdir -p /root/loops/estado

set -a; . /root/.hermes/.env 2>/dev/null; set +a
# Claude Code usa la SUSCRIPCION (/root/.claude/.credentials.json). Una
# ANTHROPIC_API_KEY en el entorno la pisaria, y la de .hermes/.env esta vacia.
unset ANTHROPIC_API_KEY ANTHROPIC_TOKEN
export HOME=/root
# El hook .githooks/pre-push del repo lee esto: solo el caso onia-cola puede
# empujar a main/master, el resto de los loops de carril queda bloqueado.
export ONIA_LOOP_ID="$NOMBRE"

log() { printf '%s %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$*" >> "$LOG"; }

# (`tg` ya quedo definida arriba del `case`, a proposito: ver el comentario ahi.)

# Un monitor que se muere en silencio es peor que no tener monitor. Pero avisar
# cada vuelta de lo mismo es ruido: como mucho un aviso cada 6 h por loop.
avisar() {
  log "FALLO $*"
  local ahora; ahora=$(date +%s)
  local ult=0; [ -f "$AVISADO" ] && ult=$(cat "$AVISADO" 2>/dev/null || echo 0)
  if [ $((ahora - ult)) -ge 21600 ]; then
    echo "$ahora" > "$AVISADO"
    tg "🔴 <b>Loop $NOMBRE</b> (VPS) no pudo correr: $1
Log: <code>$LOG</code>"
  fi
}

# ── flock: si la vuelta anterior sigue viva, esta NO arranca. -----------------
exec 9>"$LOCK"
if ! flock -n 9; then
  log "SALTEADA — la vuelta anterior sigue corriendo (lock $LOCK)"
  exit 0
fi

# ── barandas verificadas ANTES de gastar una sesion --------------------------
[ -f "$PROMPT" ]      || { avisar "falta el prompt $PROMPT"; exit 2; }
[ -d "$WT/.git" ] || [ -f "$WT/.git" ] || { avisar "no existe el worktree $WT"; exit 2; }
ACTUAL=$(git -C "$WT" branch --show-current 2>/dev/null || echo '?')
[ "$ACTUAL" = "$RAMA" ] || { avisar "el worktree $WT esta en '$ACTUAL' y se esperaba '$RAMA'"; exit 2; }
cd "$WT" || { avisar "no se pudo entrar a $WT"; exit 2; }

# ── el prompt que corre vs el versionado en main -----------------------------
# El prompt que se ejecuta vive en /root/bin/loops/; su fuente versionada vive
# en el repo. Si divergen, el loop corre una version vieja y NADIE se entera:
# el 2026-09-02 el canario llevaba un dia entero mirando 5 pantallas mientras
# `main` ya tenia la version de 10 con umbrales medidos. Avisa, no frena: un
# prompt viejo sigue trabajando; uno que no arranca, no.
FUENTE=/root/loops/onia-hermes/scripts/loops/prompts/$NOMBRE.md
if [ -f "$FUENTE" ] && ! diff -q --strip-trailing-cr "$FUENTE" "$PROMPT" >/dev/null 2>&1; then
  avisar "el prompt desplegado (<code>$PROMPT</code>) difiere del versionado en main: puede estar corriendo una version vieja"
fi

# ── la vuelta ----------------------------------------------------------------
ANTES=$(git rev-parse --short HEAD)
T0=$(date +%s)
log "===== ARRANCA $NOMBRE — rama $RAMA — HEAD $ANTES — tope ${TOPE}s ====="

# El prompt entra por STDIN, no como argumento posicional. Dos razones medidas:
#  1) `--allowedTools` es variadic y se COME el argumento que le sigue: el prompt
#     entero se partia en "reglas" de permiso basura ("Ignoring --allowedTools
#     rule ...") y el permiso real quedaba en nada. Por eso los tools van en UNA
#     cadena separada por comas.
#  2) sin redirigir stdin, `claude` se traga lo que quede en la entrada del shell
#     que lo invoco. Corriendo dos loops seguidos por ssh, el primero se comio el
#     script del segundo y la segunda vuelta nunca ocurrio.
# Modelo y esfuerzo: decision de Sergio el 2026-09-02 — "cambialos todos a opus 5
# en max, pero quiero que terminen de una vez". Antes era claude-sonnet-5 sin
# --effort. Cuesta mas por vuelta; el rendimiento por vuelta es lo que se compra.
timeout "$TOPE" claude -p --model "$MODELO" --effort "$ESFUERZO" --max-turns "$TURNOS" \
  --allowedTools "$TOOLS" < "$PROMPT" >> "$LOG" 2>&1
RC=$?

T=$(( $(date +%s) - T0 ))
DESPUES=$(git rev-parse --short HEAD)
if [ "$ANTES" = "$DESPUES" ]; then
  HECHO="sin commit (vuelta valida si lo dijo)"
else
  HECHO="commiteo $ANTES..$DESPUES — $(git log --oneline "$ANTES..$DESPUES" | wc -l) commit(s)"
fi
SINPUSH=$(git log --oneline "@{u}..HEAD" 2>/dev/null | wc -l)

log "===== TERMINA $NOMBRE — ${T}s — exit $RC — $HECHO — sin pushear: $SINPUSH ====="

# 124 = lo corto el timeout. Es un fallo: la vuelta quedo a medias.
if [ "$RC" = 124 ]; then
  avisar "la vuelta paso el tope de ${TOPE}s y la corto el timeout"
elif [ "$RC" != 0 ]; then
  # "Not logged in" = la credencial de la suscripcion en el VPS esta muerta.
  if tail -n 20 "$LOG" | grep -qi "not logged in"; then
    avisar "Claude no esta autenticado en el VPS (correr <code>claude</code> y /login como root)"
  else
    avisar "claude salio con codigo $RC"
  fi
elif [ "$SINPUSH" != 0 ]; then
  avisar "quedaron $SINPUSH commit(s) SIN pushear en $RAMA"
fi

# ── un merge abierto NO se deja pasar en silencio ----------------------------
# El 2026-09-02 el integrador se quedo sin turnos a mitad de un merge y dejo
# MERGE_HEAD con todo el indice montado. No habia ni un marcador de conflicto
# —git habia resuelto solo— pero es un estado que el `add -A` de cualquier hook
# convierte en un commit a ciegas. Es el modo de falla que CLAUDE.md prohibe, y
# ya llego una vez a main con 17 archivos con marcadores adentro.
GITDIR=$(git -C "$WT" rev-parse --git-dir 2>/dev/null || echo /dev/null)
if [ -f "$GITDIR/MERGE_HEAD" ]; then
  CONF=$(git -C "$WT" diff --name-only --diff-filter=U | wc -l)
  avisar "quedo un MERGE ABIERTO en $RAMA ($CONF archivo(s) en conflicto). No lo cierra nadie solo: hay que resolver a mano en <code>$WT</code>"
fi

# ── reporte a Sergio por Telegram, TODAS las vueltas -------------------------
# Sergio, 2026-09-02: "quiero revisar cada que hagan algo, que me lo envien por
# telegram". Antes solo avisaba cuando algo FALLABA: el trabajo bueno era
# invisible y habia que entrar al VPS a leer un log para saber que hizo un loop.
#
# Se manda la PRIMERA linea util que escribio el agente — la regla de todos los
# prompts es empezar con una linea en castellano llano para Sergio, asi que esa
# es exactamente la que sirve. REPORTE A SERGIO.
LINEA=$(sed -n "/===== ARRANCA $NOMBRE/,\$p" "$LOG" 2>/dev/null \
  | grep -vE "^[0-9]{4}-[0-9]{2}-[0-9]{2}T|^\s*$|^={3,}" \
  | sed 's/^[*_#> -]*//' \
  | grep -vE "^(Detalle|Resumen|Vuelta|##)" \
  | head -1 | cut -c1-450)

if [ -n "$LINEA" ]; then
  ESTADO="✅"; [ "$RC" != 0 ] && ESTADO="⚠️"
  COMMITS=""; [ "$ANTES" != "$DESPUES" ] && COMMITS=" · $(git log --oneline "$ANTES..$DESPUES" | wc -l) commit(s)"
  tg "$ESTADO <b>$NOMBRE</b> · ${T}s${COMMITS}
$LINEA"
else
  # Sin linea no se manda nada: mejor silencio que un mensaje vacio cada vuelta.
  log "(sin linea para Sergio en esta vuelta)"
fi

# ── rotacion: 24 vueltas por dia llenan un disco -----------------------------
if [ "$(wc -l < "$LOG")" -gt 6000 ]; then
  tail -n 3000 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
  log "(log rotado: se dejaron las ultimas 3000 lineas)"
fi

exit 0
