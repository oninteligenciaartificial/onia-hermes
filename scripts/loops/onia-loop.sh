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
# Uso:  onia-loop.sh <canario-visual|chatbot-cola|marca-personal|onia-cola|docs-auditoria>
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
case "$NOMBRE" in
  canario-visual)
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
    RAMA=claude/git-status-935f47
    TOPE=2400
    TOOLS=Read,Write,Edit,Grep,Glob,Bash
    ;;
  *)
    echo "uso: $0 <canario-visual|chatbot-cola|marca-personal|onia-cola|docs-auditoria>" >&2; exit 64 ;;
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

log() { printf '%s %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$*" >> "$LOG"; }

tg() { /root/bin/onia-tg.sh "$1" >/dev/null 2>&1 || true; }

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
timeout "$TOPE" claude -p --model claude-sonnet-5 --max-turns 120 \
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

# ── rotacion: 24 vueltas por dia llenan un disco -----------------------------
if [ "$(wc -l < "$LOG")" -gt 6000 ]; then
  tail -n 3000 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
  log "(log rotado: se dejaron las ultimas 3000 lineas)"
fi

exit 0
