#!/usr/bin/env bash
# Vigia del embudo — cada 6 h. Chequea las piezas del circuito de venta y avisa
# a Telegram SOLO en transiciones (se cayo / volvio), nunca en cada corrida.
# Cron: 19 */6 * * *   Log: /var/log/onia-vigia-embudo.log
set -uo pipefail
ESTADO_DIR=/root/loops/estado
mkdir -p "$ESTADO_DIR"

chequear() {  # chequear <id> <descripcion> <comando que sale 0 si esta vivo>
  local id="$1" desc="$2"; shift 2
  local f="$ESTADO_DIR/vigia-$id.estado" ahora antes
  if "$@" >/dev/null 2>&1; then ahora=OK; else ahora=CAIDO; fi
  antes=$(cat "$f" 2>/dev/null || echo NUEVO)
  echo "$ahora" > "$f"
  echo "$(date -u +%FT%TZ) $id: $ahora (antes: $antes)"
  if [ "$antes" != "$ahora" ] && [ "$antes" != "NUEVO" ]; then
    if [ "$ahora" = CAIDO ]; then
      /root/bin/onia-tg.sh "🔴 <b>Embudo</b>: $desc esta CAIDO" >/dev/null
    else
      /root/bin/onia-tg.sh "🟢 <b>Embudo</b>: $desc volvio a responder" >/dev/null
    fi
  fi
}

http_vivo() { # vivo si responde con codigo < 500
  local code
  code=$(curl -sk -o /dev/null -w '%{http_code}' --max-time 15 "$1" || echo 000)
  [ "$code" != 000 ] && [ "$code" -lt 500 ]
}

chequear landing "onia.com.bo (landing)" http_vivo https://onia.com.bo
chequear cal "cal.onia.com.bo (agenda de demos)" http_vivo https://cal.onia.com.bo
chequear postiz "Postiz (contenedor)" docker inspect -f '{{.State.Running}}' postiz
