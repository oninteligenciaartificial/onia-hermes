#!/usr/bin/env bash
# VIGIA de Hermes Agent — avisa cuando sus trabajos programados fallan.
#
# 🔴 POR QUE EXISTE. Hermes corrio 9 dias con 12 de sus 13 trabajos fallando TODOS
# los dias (`RuntimeError: Connection error.`), y nadie se entero — ni Sergio ni
# yo. Sus dos API keys daban 401: tenia el cerebro muerto y seguia arrancando
# puntual cada dia. Se descubrio de casualidad, mirando otra cosa.
#
# Es el mismo modo de falla que ya mordio tres veces en este proyecto: algo
# programado que corre, falla y no avisa. La regla del bloque
# "TU CARRIL TIENE QUE PODER FALLAR A LA VISTA" (scripts/loops/) vale para
# Hermes igual que para los loops — este script es su mitad mecanica.
#
# Condicion que Sergio acepto al encenderlo el 2026-09-02: "encendelo con el aviso".
#
# Corre por cron cada hora. Idempotente: si no hay fallos nuevos, no escribe nada.
set -uo pipefail

HERMES="${HERMES_BIN:-/usr/local/lib/hermes-agent/venv/bin/python -m hermes_cli.main}"
TG="${ONIA_TG:-/root/bin/onia-tg.sh}"
ESTADO="${HERMES_VIGIA_ESTADO:-/var/lib/hermes-vigia}"
export HOME=/root
mkdir -p "$ESTADO"

log() { printf '%s %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$*"; }

LISTA=$(timeout 120 $HERMES cron list 2>&1) || { log "no pude listar los trabajos de Hermes"; exit 1; }

# Un trabajo "roto" es el que tiene `error:` en su ultima corrida. Se cuentan por
# nombre para poder avisar UNA vez por incidente y no una por hora.
ROTOS=$(printf '%s\n' "$LISTA" | awk '
  /Name:/      { nombre=$2 }
  /Last run:/  { if ($0 ~ /error:/) print nombre }
' | sort -u)

N=$(printf '%s' "$ROTOS" | grep -c . || true)
MARCA="$ESTADO/incidente"

if [ "$N" -eq 0 ]; then
  # Recuperado: si habia incidente abierto, avisar UNA vez y cerrarlo.
  if [ -f "$MARCA" ]; then
    rm -f "$MARCA"
    "$TG" "✅ <b>Hermes</b> — todos los trabajos programados vuelven a correr bien." >/dev/null 2>&1 || true
    log "recuperado: cero trabajos con error"
  fi
  exit 0
fi

# Hay fallos. Avisar solo si el CONJUNTO de rotos cambio (o no habia incidente):
# asi un fallo nuevo se ve, y el mismo fallo repetido no hace ruido cada hora.
FIRMA=$(printf '%s' "$ROTOS" | md5sum | cut -d' ' -f1)
PREVIA=""; [ -f "$MARCA" ] && PREVIA=$(cat "$MARCA" 2>/dev/null)

if [ "$FIRMA" != "$PREVIA" ]; then
  printf '%s' "$FIRMA" > "$MARCA"
  # El motivo del primero, que casi siempre es el motivo de todos.
  MOTIVO=$(printf '%s\n' "$LISTA" | grep -m1 -oE 'error: .*' | cut -c1-120)
  LISTADO=$(printf '%s' "$ROTOS" | head -6 | sed 's/^/• /')
  "$TG" "🔴 <b>Hermes: $N trabajo(s) programados fallando</b>
$LISTADO
<code>$MOTIVO</code>
Mirá el panel: <code>ssh -N -L 9119:127.0.0.1:9119 root@187.77.16.63</code> y abrí http://127.0.0.1:9119" >/dev/null 2>&1 || true
  log "AVISADO: $N trabajo(s) con error — $MOTIVO"
else
  log "sin novedad: los mismos $N trabajo(s) siguen fallando (ya avisado)"
fi

exit 0
