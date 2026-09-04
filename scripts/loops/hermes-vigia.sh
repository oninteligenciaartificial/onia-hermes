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

# Un trabajo "roto" es el que fallo RECIENTEMENTE. La fecha no es un detalle: es
# la diferencia entre un incidente y un cadaver.
#
# 🔴 Nace del 2026-09-02, y lo cazo Sergio: "Yo al Hermes solo me envia errores y
# errores, no veo que este mejorando". Tenia razon, y la culpa era de este script.
#
# `hermes cron list` muestra el ULTIMO resultado de cada trabajo, sin importar
# cuando fue. Medido ese dia: 8 trabajos con error, fechados 27-ago, 28-ago,
# 30-ago, 31-ago, 1-sep y 2-sep-13:00 — todos ANTERIORES al arreglo del proxy
# LiteLLM. Los 6 que corrieron DESPUES del arreglo dieron ok. O sea: Hermes ya
# andaba, y este vigia seguia reportando muertos de hace una semana.
#
# Y peor que repetir: la firma es el CONJUNTO de rotos, asi que cada vez que un
# trabajo se recuperaba y salia de la lista, la firma cambiaba y se disparaba un
# aviso NUEVO con los que quedaban. Mejorar generaba mas mensajes de error. Ese es
# exactamente el "errores y errores" que veia Sergio: el sistema curandose sonaba
# igual que el sistema rompiendose.
#
# Ventana de 26 h (24 + 2 de colchon): las fechas vienen con offsets distintos
# (+00:00 y -04:00) y se comparan como texto, asi que el colchon cubre el desfase
# sin necesidad de normalizar zonas.
LIMITE=$(date -u -d '26 hours ago' '+%Y-%m-%dT%H:%M:%S' 2>/dev/null || date -u '+%Y-%m-%dT%H:%M:%S')
ROTOS=$(printf '%s\n' "$LISTA" | awk -v limite="$LIMITE" '
  /Name:/      { nombre=$2 }
  /Last run:/  {
    if ($0 ~ /error:/) {
      # "Last run:  2026-09-02T13:00:23.209020+00:00  error: ..." -> el sello ISO
      if (match($0, /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/)) {
        sello = substr($0, RSTART, RLENGTH)
        if (sello >= limite) print nombre
      } else {
        print nombre   # sin fecha legible: se avisa igual, mejor pecar de aviso
      }
    }
  }
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
