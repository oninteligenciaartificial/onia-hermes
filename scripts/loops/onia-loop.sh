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
    # RETIRADO el 17-oct (PR #226): a main solo se llega por PR con CI verde y
    # revisión de Codex, y lo une la jefa. Este loop mergeaba directo a main.
    echo "onia-loop: onia-cola está retirado; main solo por PR (AGENTS.md §4)" >&2
    exit 0
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
  contenido-cola)
    # Ahorro 2026-09-04: Sergio pidió enfocar la cuota en lo vendible. Este carril no
    # escribe código de producto (mide, publica o redacta), así que no necesita el
    # modelo más caro: 13 de 15 loops corrían en opus/max y 3 se llevaban el 58 %%.
    MODELO=claude-sonnet-5
    ESFUERZO=medium
    # Carril CONTENIDO (Lucia, @oniahq, marca personal). Vivia en la app de Claude
    # Code de la laptop de Sergio y se mudo al VPS el 2026-09-02, con su OK.
    #
    # POR QUE: midiendo si el sistema aguanta sin la PC aparecio que este era uno
    # de los DOS unicos loops que morian al apagarla — y el VPS tenia PROHIBIDO
    # rearmarlo, porque la tabla de loops.md lo marcaba como `Windows` y el bloque
    # de auto-cura dice textual que a esos no se los toca. O sea: se apagaba con la
    # laptop, nada lo reponia y nada avisaba. El modo de falla mas silencioso que
    # tiene el sistema.
    #
    # Trabaja sobre `claude/ads-creatividades-publicos`, NO sobre
    # `claude/carril-contenido` — esa es la rama que Sergio maneja en su propia
    # sesion y su prompt tiene prohibido escribir ahi.
    WT=/root/loops/onia-hermes-contenido-cola
    RAMA=claude/ads-creatividades-publicos
    TOPE=2700
    TOOLS=Read,Write,Edit,Grep,Glob,Bash
    ;;
  lucia)
    # Ahorro 2026-09-04: Sergio pidió enfocar la cuota en lo vendible. Este carril no
    # escribe código de producto (mide, publica o redacta), así que no necesita el
    # modelo más caro: 13 de 15 loops corrían en opus/max y 3 se llevaban el 58 %%.
    MODELO=claude-sonnet-5
    ESFUERZO=medium
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
    # Ahorro 2026-09-04: Sergio pidió enfocar la cuota en lo vendible. Este carril no
    # escribe código de producto (mide, publica o redacta), así que no necesita el
    # modelo más caro: 13 de 15 loops corrían en opus/max y 3 se llevaban el 58 %%.
    MODELO=claude-sonnet-5
    ESFUERZO=medium
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
    # Ahorro 2026-09-04: Sergio pidió enfocar la cuota en lo vendible. Este carril no
    # escribe código de producto (mide, publica o redacta), así que no necesita el
    # modelo más caro: 13 de 15 loops corrían en opus/max y 3 se llevaban el 58 %%.
    MODELO=claude-sonnet-5
    ESFUERZO=medium
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
    # Ahorro 2026-09-04: Sergio pidió enfocar la cuota en lo vendible. Este carril no
    # escribe código de producto (mide, publica o redacta), así que no necesita el
    # modelo más caro: 13 de 15 loops corrían en opus/max y 3 se llevaban el 58 %%.
    MODELO=claude-sonnet-5
    ESFUERZO=medium
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
    # Ahorro 2026-09-04: Sergio pidió enfocar la cuota en lo vendible. Este carril no
    # escribe código de producto (mide, publica o redacta), así que no necesita el
    # modelo más caro: 13 de 15 loops corrían en opus/max y 3 se llevaban el 58 %%.
    MODELO=claude-sonnet-5
    ESFUERZO=medium
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
# Un worktree que falta ya no detiene el carril: se rehace. Nace del 2026-09-04,
# cuando el disco del VPS estaba al 85 % con 72 GB en /root/loops y borrar un
# worktree de un carril pausado significaba dejarlo muerto hasta que alguien lo
# recreara a mano. El repo base es el mismo del que salen todos; la rama ya la
# fija el `case` de arriba. Si tampoco se puede rehacer, ahi si se avisa y se sale.
if [ ! -d "$WT/.git" ] && [ ! -f "$WT/.git" ]; then
  BASE_REPO=${ONIA_LOOPS_REPO:-/root/loops/onia-hermes}
  log "no existe el worktree $WT — lo rehago desde $BASE_REPO en la rama $RAMA"
  rm -rf "$WT"
  if git -C "$BASE_REPO" fetch origin --quiet 2>/dev/null &&
     { git -C "$BASE_REPO" worktree add "$WT" "$RAMA" >/dev/null 2>&1 ||
       git -C "$BASE_REPO" worktree add -b "$RAMA" "$WT" "origin/$RAMA" >/dev/null 2>&1 ||
       git -C "$BASE_REPO" worktree add -b "$RAMA" "$WT" origin/main >/dev/null 2>&1; }; then
    log "worktree rehecho en $WT ($RAMA)"
  else
    avisar "no existe el worktree $WT y no pude rehacerlo desde $BASE_REPO"
    exit 2
  fi
fi
ACTUAL=$(git -C "$WT" branch --show-current 2>/dev/null || echo '?')
[ "$ACTUAL" = "$RAMA" ] || { avisar "el worktree $WT esta en '$ACTUAL' y se esperaba '$RAMA'"; exit 2; }
cd "$WT" || { avisar "no se pudo entrar a $WT"; exit 2; }

# ── el arbol contra `main`: no medir una version vieja del producto ----------
# Pedido textual de Sergio Urcullo, 2026-09-08, al subir las cadencias: *"que
# revise si no esta sobreescribiendo o haciendo algo que ya esta hecho, se tiene
# que verificar eso"*.
#
# EL MECANISMO, medido ese dia: `recorrido-cliente` estaba **251 commits atras de
# main**. Ese loop recorre el producto y dice en que paso se rompe — con ese
# atraso recorre una version vieja y reporta como roto lo que ya se arreglo. Es
# el generador estructural de items fantasma, y encaja con el 25-46% de
# pendientes que las colas declaraban y no existian. Y el riesgo no es solo
# reportar de mas: un merge desde un arbol viejo puede DESHACER el arreglo ajeno.
#
# El prompt de cada loop ya le pide sincronizarse al arrancar. **No alcanza: es
# una instruccion, y 251 commits dicen que no se cumplio.** Esto es el cerrojo.
# Y subir la cadencia sin esto multiplica el problema: mas vueltas midiendo un
# arbol viejo son mas hallazgos falsos por hora.
#
# Dos cosas que NO hace, y las dos por casos ya pagados:
#   · si el arbol tiene cambios sin commitear, avisa y NO mergea. Cambiar el
#     checkout debajo de trabajo sin guardar es como se pierden cosas (hoy mismo
#     `onia-hermes-recorrido` tenia dos capturas sin commitear).
#   · si el merge da conflicto, ABORTA y sigue con el arbol viejo. Un merge a
#     medias que sobrevive al turno es peor que un arbol atrasado: el 2026-08-20
#     `add -A` convirtio 17 archivos con marcadores `<<<<<<<` en un "resuelto"
#     que hizo fast-forward a main.
git fetch origin --quiet 2>/dev/null || true

# 🔴 La rama base NO es siempre `main`. Medido el 2026-09-08 en nodo-casa:
# `onia-platform` usa **master**, asi que `HEAD..origin/main` moria con
# "unknown revision", el `|| echo 0` lo convertia en CERO, y la guarda quedaba
# MUDA justo donde mas hacia falta: ese worktree estaba **12 commits atras** y
# nunca sincronizaba. Una guarda que no puede fallar ruidosamente no es una
# guarda: es un comentario. Se pregunta cual es la base en vez de suponerla.
BASE=$(git symbolic-ref --quiet --short refs/remotes/origin/HEAD 2>/dev/null || true)
if [ -z "$BASE" ]; then
  for C in origin/main origin/master; do
    git rev-parse --verify --quiet "$C" >/dev/null 2>&1 && { BASE="$C"; break; }
  done
fi

if [ -z "$BASE" ]; then
  # Sin base no se puede medir el atraso. Se DICE, no se pasa por alto en silencio.
  log "AVISO: no encontre la rama base (ni origin/HEAD, ni origin/main, ni origin/master) — mido sin sincronizar"
else
  ATRAS=$(git rev-list --count "HEAD..$BASE" 2>/dev/null || echo 0)
  if [ "${ATRAS:-0}" -gt 0 ]; then
    if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
      log "AVISO: $ATRAS commit(s) atras de $BASE y hay cambios sin commitear — NO sincronizo, mido sobre el arbol viejo"
    elif git merge --no-edit "$BASE" >/dev/null 2>&1; then
      log "sincronizado con $BASE antes de medir: +$ATRAS commit(s)"
    else
      git merge --abort >/dev/null 2>&1
      log "AVISO: conflicto al mergear $BASE ($ATRAS atras) — abortado, mido sobre el arbol viejo"
      avisar "⚠️ <b>$NOMBRE no pudo sincronizar con $BASE</b>: conflicto a $ATRAS commit(s) de atraso.
Va a medir sobre un arbol viejo, asi que sus hallazgos pueden ser de defectos YA arreglados.
Se destraba en <code>$WT</code> con <code>git merge $BASE</code> y resolviendo a mano."
    fi
  fi
fi

# ── el prompt que corre vs el versionado en main -----------------------------
# El prompt que se ejecuta vive en /root/bin/loops/; su fuente versionada vive
# en el repo. Si divergen, el loop corre una version vieja y NADIE se entera:
# el 2026-09-02 el canario llevaba un dia entero mirando 5 pantallas mientras
# `main` ya tenia la version de 10 con umbrales medidos. Avisa, no frena: un
# prompt viejo sigue trabajando; uno que no arranca, no.
FUENTE=/root/loops/onia-hermes/scripts/loops/prompts/$NOMBRE.md
if [ -f "$FUENTE" ] && ! diff -q --strip-trailing-cr "$FUENTE" "$PROMPT" >/dev/null 2>&1; then
  # 🔴 Solo es "version vieja" si main sabe algo que el desplegado NO. Al reves
  # —el desplegado tiene una capacidad que main todavia no mergeo— el que va
  # atras es main, y avisar "puede estar corriendo una version vieja" es FALSO.
  # Medido el 2026-09-03: 15 prompts con el bloque de memoria compartida
  # desplegados a mano, main una hora atras, y cada loop mando un rojo a Sergio
  # en su primera vuelta. Sergio: "apaga los fallos falsos". La marca es la misma
  # que usa el sincronizador para negarse a degradar: si el sync no lo pisaria,
  # el runner no tiene por que gritar.
  MARCA_PROMPT="MEMORIA COMPARTIDA — la leés al arrancar"
  if grep -q "$MARCA_PROMPT" "$PROMPT" 2>/dev/null && ! grep -q "$MARCA_PROMPT" "$FUENTE" 2>/dev/null; then
    log "prompt mas nuevo que main (main aun sin '$MARCA_PROMPT'): no es drift, se espera al integrador"
  else
    avisar "el prompt desplegado (<code>$PROMPT</code>) difiere del versionado en main: puede estar corriendo una version vieja"
  fi
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
# ── memoria compartida: el loop arranca sabiendo lo que el sistema ya sabe ----
# Sergio, 2026-09-03: "que los loops usen la memoria de hermes tambien". Hasta
# aca cada loop arrancaba "sin memoria: todo esta en los archivos" — y volvia a
# descubrir por su cuenta que onia.com.bo no es Vercel, que soul_2 no existe, o
# que Sergio quiere las horas en La Paz. Ahora el prompt que entra a claude es
# MEMORIA + PROMPT: lo que Hermes sabe de Onia (MEMORY.md), lo que aprendio de
# Sergio (USER.md), y recien despues las instrucciones del carril. Pesa ~2.000
# tokens: nada, contra una vuelta de 120 turnos que repite un error ya conocido.
# Se arma en un temporal para no tocar $PROMPT, que es lo que la guarda de
# arriba compara contra main.
MEMORIA_DIR=/root/.hermes/memories
PROMPT_FINAL=$(mktemp /tmp/onia-prompt-$NOMBRE-XXXXXX.md)
# El temporal se borra tambien si el corredor mismo muere (reboot, OOM, kill -9):
# el `rm -f` de abajo solo corre si el script llega vivo hasta ahi. /tmp aca es
# disco, no tmpfs — un sobrante sobrevive reinicios.
trap 'rm -f "$PROMPT_FINAL"' EXIT
{
  if [ -s "$MEMORIA_DIR/MEMORY.md" ] || [ -s "$MEMORIA_DIR/USER.md" ]; then
    echo "# MEMORIA COMPARTIDA DEL SISTEMA — es contexto, no es tu cola"
    echo
    echo "Lo que Onia ya aprendio, a veces caro. Leelo antes de trabajar y NO lo vuelvas a"
    echo "descubrir. Si algo de aca contradice un doc del repo, medi cual esta vigente y"
    echo "avisá. Al cerrar la vuelta, lo que aprendiste que le sirva a otro carril va con"
    echo "\`/root/bin/onia-aprender.sh \"<hecho>\"\` (ver tu bloque de memoria compartida)."
    echo
    if [ -s "$MEMORIA_DIR/MEMORY.md" ]; then
      echo "## Lo que el sistema sabe de Onia"; echo
      cat "$MEMORIA_DIR/MEMORY.md"; echo
    fi
    if [ -s "$MEMORIA_DIR/USER.md" ]; then
      echo "## Lo que el sistema sabe de Sergio"; echo
      cat "$MEMORIA_DIR/USER.md"; echo
    fi
    echo; echo "---"; echo; echo "# TU CARRIL"; echo
  fi
  # Sergio, 2026-09-03: "¿no se supone que aprenden de si mismos y solucionan sus
  # errores?". No: un modelo no cambia al correr; "aprende" solo por lo que le
  # entra en contexto. Hasta aca cada vuelta arrancaba sin ver la anterior, y
  # repetia el mismo callejon (46 % de vueltas sin commit, medido hoy). Ahora ve
  # su ULTIMA vuelta: OBJETIVO/RAZON/LECCION que dejo escritas y como termino.
  # Es la penultima ARRANCA del log (la ultima es la de ahora, ya escrita arriba).
  #
  # El `s/^[*_#> -]*//` del sed NO es adorno: los loops escriben markdown, y sin el la linea
  # `**OBJETIVO:** ...` no pasaba el grep. Medido el 2026-09-04 (t_0314b1bb): contenido-cola
  # avanzo de "publicadas 1" a "publicadas 2" y el corredor le mostro la vieja como si fuera la
  # ultima, asi que se leia a si mismo estancado — y la regla del sistema le ordena cambiar un
  # metodo que estaba funcionando. Es la misma limpieza que ya hacia la linea de mas abajo que
  # manda las LECCION: a la memoria; la asimetria entre las dos ERA el defecto.
  # Blindado por scripts/ultima-vuelta-visible.test.mjs (`npm run test:ultima-vuelta`).
  PREV_INI=$(grep -n "===== ARRANCA $NOMBRE" "$LOG" 2>/dev/null | tail -2 | head -1 | cut -d: -f1)
  PREV_FIN=$(grep -n "===== ARRANCA $NOMBRE" "$LOG" 2>/dev/null | tail -1 | cut -d: -f1)
  if [ -n "$PREV_INI" ] && [ -n "$PREV_FIN" ] && [ "$PREV_INI" != "$PREV_FIN" ]; then
    echo "# TU ULTIMA VUELTA (lo que vos mismo dejaste escrito; si fallo, cambia el metodo)"; echo
    sed -n "${PREV_INI},${PREV_FIN}p" "$LOG"       | sed -E 's/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9:]+Z //; s/^[*_#> -]*//'       | grep -E "^(OBJETIVO|RAZ[OÓ]N|LECCI[OÓ]N):|===== (ARRANCA|TERMINA) "       | tail -12
    echo; echo "---"; echo
  fi
  cat "$PROMPT"
} > "$PROMPT_FINAL"
# `grep -c` imprime "0" Y sale con 1 en un archivo vacio: con `|| echo 0` salian DOS
# ceros en lineas distintas, y la segunda —sin timestamp— pasaba el filtro del
# reporte a Telegram como si fuera "el informe" de la vuelta.
HECHOS=$(grep -c '^§$' "$MEMORIA_DIR/MEMORY.md" 2>/dev/null || true)
log "memoria inyectada: $(wc -c < "$PROMPT_FINAL") bytes de prompt (${HECHOS:-0} hechos de MEMORY.md)"

timeout "$TOPE" claude -p --model "$MODELO" --effort "$ESFUERZO" --max-turns "$TURNOS" \
  --allowedTools "$TOOLS" < "$PROMPT_FINAL" >> "$LOG" 2>&1
RC=$?
rm -f "$PROMPT_FINAL"

# Lo que este loop aprendio en la vuelta entra a la memoria compartida ahora, no
# "en algun momento": el consolidador es idempotente y con cerrojo, asi que es
# seguro llamarlo desde 15 loops. Si no hay nada en la bandeja, no hace nada.
# Sergio, 2026-09-03 22:40 La Paz: "¿los loops están trabajando?". Dos vueltas (contenido-cola,
# tendencias) murieron con "You've hit your session limit" y el log las contaba como
# "vuelta valida": los loops corren con la MISMA suscripcion de Claude que la sesion de
# control, asi que se pisan la cuota. Queda escrito como RAZON en el log: la proxima vuelta
# lo ve en TU ULTIMA VUELTA y el supervisor lo cuenta como perdida, no como trabajo.
CUR_INI=$(grep -n "===== ARRANCA $NOMBRE" "$LOG" 2>/dev/null | tail -1 | cut -d: -f1)
if tail -n +"${CUR_INI:-1}" "$LOG" 2>/dev/null | grep -q "hit your session limit"; then
  log "RAZON: vuelta PERDIDA por limite de uso de Claude (cuota compartida con la sesion de control); no es un fallo del loop"
fi

# Lo que el loop escribio como `LECCION: ...` en ESTA vuelta va solo a la memoria
# compartida: asi la leccion no depende de que el loop se acuerde de llamar a
# onia-aprender.sh. Tope 5 por vuelta; el consolidador deduplica.
#
# 🔴 El `</dev/null` de adentro del bucle no es cosmetico: sin el, el tope real es UNO.
# En nodo-casa `/root/bin/onia-aprender.sh` es un shim que hace `exec ssh`, y ssh SIN `-n`
# consume el stdin que le queda al bucle — o sea se traga las lecciones 2 a 5, el `while`
# termina normal y el exit es 0. Falla ABIERTO: no hay error, no hay log, y la vuelta
# reporta que aprendio. Medido el 2026-09-07 con el bucle real: de 3 lecciones se envio 1.
# Toca a todo bucle `while read` que adentro llame a un shim de este nodo (docker, tablero,
# telegram, aprender, vps): la llamada va con `</dev/null` o el barrido pierde el resto.
CUR_INI=$(grep -n "===== ARRANCA $NOMBRE" "$LOG" 2>/dev/null | tail -1 | cut -d: -f1)
tail -n +"${CUR_INI:-1}" "$LOG" 2>/dev/null   | sed -E 's/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9:]+Z //; s/^[*_#> -]*//'   | grep -E "^LECCI[OÓ]N: ." | cut -c1-600 | head -5   | while IFS= read -r LEC; do /root/bin/onia-aprender.sh "[$NOMBRE] ${LEC#LECCI*N: }" </dev/null >/dev/null 2>&1 || true; done
/root/bin/onia-consolidar-memoria.sh >> "$LOG" 2>&1 || true

T=$(( $(date +%s) - T0 ))
DESPUES=$(git rev-parse --short HEAD)
if [ "$ANTES" = "$DESPUES" ]; then
  HECHO="sin commit (vuelta valida si lo dijo)"
else
  HECHO="commiteo $ANTES..$DESPUES — $(git rev-list --count --first-parent "$ANTES..$DESPUES") commit(s)"
fi
# Cuantos commits quedaron sin publicar. OJO con el instrumento: `@{u}..HEAD`
# cuenta contra la rama propia, asi que incluye TODO lo que entro por un merge de
# main y ya esta publicado en origin — laburo que no corre ningun riesgo. El
# 2026-09-03 docs-auditoria avisaba "34 commits SIN pushear" y los huerfanos
# reales eran DOS: los otros 32 ya vivian en origin/main. Un aviso inflado 17x se
# deja de leer, que es el modo de falla del vigia que ya conocemos.
# Lo que de verdad se puede PERDER es lo que no esta en ningun ref del remoto.
HUERFANOS=$(git -C "$WT" log --oneline HEAD --not --remotes=origin 2>/dev/null | wc -l)

log "===== TERMINA $NOMBRE — ${T}s — exit $RC — $HECHO — sin publicar en ningun remoto: $HUERFANOS ====="

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
elif [ "$HUERFANOS" != 0 ]; then
  # Por que no se pudo pushear importa mas que cuantos quedaron: si la rama
  # remota fue reescrita debajo del carril (divergencia), TODOS los push futuros
  # se rechazan por non-fast-forward y el loop sigue commiteando al vacio vuelta
  # tras vuelta. Nombrarlo es la diferencia entre un arreglo de 2 minutos y un
  # carril que produce para nadie durante horas.
  if git -C "$WT" rev-parse --verify -q "origin/${RAMA#origin/}" >/dev/null 2>&1 &&
     ! git -C "$WT" merge-base --is-ancestor "origin/${RAMA#origin/}" HEAD 2>/dev/null; then
    avisar "$RAMA DIVERGIO de su remota (la reescribieron debajo): el push viene rechazado y hay $HUERFANOS commit(s) en ningun lado. Se arregla en <code>$WT</code> con <code>git merge origin/${RAMA#origin/}</code> y push"
  else
    avisar "quedaron $HUERFANOS commit(s) SIN pushear en $RAMA"
  fi
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
#
# Desde la ULTIMA vuelta, no la primera: `sed -n "/ARRANCA/,$p"` arranca en la
# PRIMERA coincidencia del archivo, y el log acumula TODAS las vueltas del dia.
# Resultado medido el 2026-09-02, con los mensajes en la mano de Sergio:
# "✅ canario-visual · 252s · 1 commit(s)" venia acompanado de "Not logged in ·
# Please run /login", y onia-cola reportaba un "Reached max turns" fechado a las
# 02:38 — lineas de vueltas viejas presentadas como el informe de esta. El loop
# habia trabajado bien; el reporte decia otra cosa. Un informe que miente es peor
# que no tener informe, porque Sergio actua sobre el.
INICIO=$(grep -n "===== ARRANCA $NOMBRE" "$LOG" 2>/dev/null | tail -1 | cut -d: -f1)
LINEA=$(tail -n +"${INICIO:-1}" "$LOG" 2>/dev/null \
  | grep -vE "^[0-9]{4}-[0-9]{2}-[0-9]{2}T|^\s*$|^={3,}" \
  | sed 's/^[*_#> -]*//' \
  | grep -vE "^(Detalle|Resumen|Vuelta|##)" \
  | grep -vE "^(Not logged in|Please run|Error: Reached max turns|Execution error|API Error|Credit balance)" \
  | head -1 | cut -c1-450)

if [ -n "$LINEA" ]; then
  ESTADO="✅"; [ "$RC" != 0 ] && ESTADO="⚠️"
  COMMITS=""; [ "$ANTES" != "$DESPUES" ] && COMMITS=" · $(git rev-list --count --first-parent "$ANTES..$DESPUES") commit(s)"
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
