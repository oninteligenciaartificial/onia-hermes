#!/usr/bin/env bash
# Congela loops en el crontab del VPS: comenta su linea, con el motivo adelante.
# NO borra nada — prompt, rama y worktree quedan intactos; se revive descomentando.
#
# 🔴 ORDEN OBLIGATORIO, no se puede invertir:
#   `hermes-content/docs/cola/loops.md` tiene que estar EN `origin/main` SIN esos
#   loops en la tabla de activos ANTES de correr esto. El "Chequeo de arranque"
#   pegado en los 15 prompts SOLO AGREGA: si la tabla todavia los lista como
#   activos, el primer loop que arranque los reinstala y el congelamiento se
#   revierte solo, sin que nadie lo decida.
#
# Este guion VERIFICA ese orden y se niega a seguir si no se cumple.
#
# Uso:   bash scripts/loops/extras/congelar-loops-vps.sh lucia supervisor kpis-semanal
#        bash scripts/loops/extras/congelar-loops-vps.sh --seco lucia    # no aplica nada
#
# Delimitador de sed: '%'. No '#' (aparece en patrones y reemplazo) ni '@'
# (bash expandiria "$@" dentro de comillas dobles).
set -u

SECO=0
[ "${1:-}" = "--seco" ] && { SECO=1; shift; }
[ $# -gt 0 ] || { echo "uso: $0 [--seco] <id> [<id>...]"; exit 1; }

LLAVE=${ONIA_VPS_KEY:-/root/.ssh/onia_hermes_vps_ed25519}
VPS=${ONIA_VPS:-root@187.77.16.63}
REPO=${ONIA_LOOPS_REPO:-/root/loops/onia-hermes}
SELLO=$(date -u '+%Y-%m-%d')
MOTIVO=${ONIA_MOTIVO:-foco v1.0}
IDS="$*"

# ── Guarda de orden: la tabla de main NO puede listarlos como activos ────────
echo "== guarda: loops.md en origin/main ya NO los lista como activos? =="
git -C "$REPO" fetch -q origin main || { echo "  no pude traer main"; exit 1; }
DOC=$(git -C "$REPO" show origin/main:hermes-content/docs/cola/loops.md 2>/dev/null) \
  || { echo "  no pude leer loops.md de origin/main"; exit 1; }

MAL=""
for id in $IDS; do
  # Fila de la tabla de activos: | `id` | **VPS** | ...
  if printf '%s' "$DOC" | grep -qE "^\| \`$id\` \| \*\*(VPS|casa)\*\*"; then
    MAL="$MAL $id"
    printf '  %-18s TODAVIA activo en la tabla de main\n' "$id"
  else
    printf '  %-18s ok, ya no esta en la tabla\n' "$id"
  fi
done
if [ -n "$MAL" ]; then
  echo
  echo "🔴 PARO. Estos siguen en la tabla de activos de origin/main:$MAL"
  echo "   Comentar su cron ahora hace que el proximo loop los REINSTALE."
  echo "   Primero que el integrador mergee loops.md; despues se corre esto."
  exit 1
fi

# ── Aplicar ──────────────────────────────────────────────────────────────────
echo
[ "$SECO" = 1 ] && echo "== EN SECO: no se instala ningun crontab =="

ssh -i "$LLAVE" -o StrictHostKeyChecking=accept-new "$VPS" "bash -s $SECO '$SELLO' '$MOTIVO' $IDS" <<'REMOTO'
set -u
SECO=$1; SELLO=$2; MOTIVO=$3; shift 3
PAT=$(printf '%s|' "$@"); PAT=${PAT%|}

ANTES=/root/crontab.antes-de-congelar-$SELLO.txt
crontab -l > "$ANTES" 2>/dev/null
N1=$(wc -l < "$ANTES")
echo "  respaldo: $ANTES ($N1 lineas)"


NUEVO=$(crontab -l 2>/dev/null | sed -E "s%^([^#].*onia-loop\.sh ($PAT)( |\$).*)%# CONGELADO ${SELLO} (${MOTIVO}) — \1%")

# Que cambia, sacado del DIFF real entre el antes y el despues — no de un grep
# aparte con su propio patron. Ese grep salio MUDO el 2026-09-05 mientras el sed
# si sustituia: el informe decia "no cambia nada" justo cuando cambiaba tres
# lineas. No rompio la operacion, pero un informe que no muestra lo que va a
# pasar es exactamente el silencio que este guion existe para evitar.
# El informe se saca de lo mismo que se va a aplicar, o no es un informe.
TMPN=$(mktemp)
printf '%s\n' "$NUEVO" > "$TMPN"
CAMBIOS=$(diff "$ANTES" "$TMPN" | grep -c '^>')
echo "  lineas que se comentan: $CAMBIOS"
diff "$ANTES" "$TMPN" | grep '^>' | sed 's/^> /    /' 
[ "$CAMBIOS" = 0 ] && echo "    (ninguna — nada que congelar)"
rm -f "$TMPN"

# ── Lo que este guion NO puede apagar, dicho en voz alta ─────────────────────
# El patron es `onia-loop.sh <id>`. Un carril que ademas tiene un cron PROPIO
# con otro nombre de script queda vivo, y quien congela se va creyendo que apago
# el carril entero.
#
# Paso el 2026-09-05 con lucia: la linea `onia-loop.sh lucia` quedo comentada y
# `/root/bin/lucia-cierre.sh` siguio disparando todos los dias a las 11:10,
# corriendo `claude -p --max-turns 60`. Su cabecera dice "Cero creditos" y es
# FALSO — gasta cuota, que es justo el recurso por el que se congela. No fue un
# descuido de quien lo corrio: la herramienta no podia verlo y tampoco lo decia.
SUELTAS=$(printf '%s
' "$NUEVO" | grep -E "^[^#]" | grep -iE "($PAT)" | grep -vE "onia-loop\.sh ")
if [ -n "$SUELTAS" ]; then
  echo
  echo "  !! SIGUEN VIVAS otras lineas de cron que nombran estos carriles y que"
  echo "     este guion NO comenta (no tienen la forma 'onia-loop.sh <id>'):"
  printf '%s
' "$SUELTAS" | sed 's/^/       /'
  echo "     Miralas a mano: congelar el loop NO apaga el carril entero."
fi

if [ "$SECO" = 1 ]; then
  echo "  --- como quedaria ---"
  printf '%s\n' "$NUEVO" | grep -nE "onia-loop\.sh ($PAT)( |\$)" | sed 's/^/    /'
  echo "  lineas antes=$N1 despues=$(printf '%s\n' "$NUEVO" | wc -l)"
  exit 0
fi

printf '%s\n' "$NUEVO" | crontab -
N2=$(crontab -l 2>/dev/null | wc -l)
echo "  lineas  antes: $N1   despues: $N2   (iguales = no se perdio ninguna)"

echo "  ACTIVAS que quedan con esos ids (tiene que estar vacio):"
if crontab -l 2>/dev/null | grep -qE "^[^#].*onia-loop\.sh ($PAT)( |\$)"; then
  crontab -l | grep -E "^[^#].*onia-loop\.sh ($PAT)( |\$)" | sed 's/^/    ¡QUEDO VIVA! /'
  exit 1
fi
echo "    (vacio) OK"
echo "  loops activos que quedan en el VPS: $(crontab -l 2>/dev/null | grep -cE '^[^#].*onia-loop\.sh ')"
REMOTO
