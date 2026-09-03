#!/usr/bin/env bash
# Rescate del mensaje perdido — reinyecta por el webhook lo que Chatwoot disparo contra un
# puerto muerto. El porque, medido, esta en la cabecera de `bot/rescate-run.mjs`.
# Cron: 4,14,24,34,44,54 * * * *   Log: /var/log/onia-rescate-mensaje-perdido.log
#
# EL AGUJERO QUE TAPA: el webhook cuelga de `docker exec -d` sobre `onia-center`; cuando el
# contenedor reinicia se va con el, y el watchdog tarda hasta 2 min en levantarlo. En esa
# ventana Chatwoot dispara su UNICO webhook contra un puerto muerto y **no reintenta**: el
# mensaje no se contesta nunca. Veinte reinicios entre el 28-ago y el 3-sep, ~3 por dia.
#
# POR QUE ESTO NO ES UN DEPLOY, QUE ES LO QUE LO TENIA FRENADO:
# la cola daba por hecho que el barrido tenia que viajar a `/opt/onia/bot` —rsync, con OK de
# Sergio— para poder correr. Es falso, y se probo ejecutandolo: el barrido no es parte del
# motor, es un CLIENTE suyo. Lee Chatwoot por `docker exec` y postea al webhook por HTTP a
# 127.0.0.1, leyendo el secreto de `/opt/onia/bot/webhook.env` (que ya esta ahi). Corrido desde
# el repo el 2026-09-03 contra produccion devolvio `{"ok":true,"duplicate":true,"sent":[]}` —
# el circuito entero anda sin copiar un solo archivo al bot.
#
# ⚠️ `/opt/onia/bot/rescate-run.mjs` NO esta en los candidatos A PROPOSITO. Hay una copia vieja
# ahi (3-sep 01:58) sin el arreglo del 401 ni `clasificarRespuesta`: apuntarle seria cablear la
# version rota. Los candidatos son git, que es lo que se puede verificar.
#
# POR QUE BUSCA EL SCRIPT EN DOS LADOS Y NO EN UNO: el clon de `main` es el que manda, pero se
# actualiza cuando el integrador mergea; hasta ese momento el archivo solo existe en el worktree
# del carril. Un cron que apunte a un solo path arranca roto y se queda roto en silencio.
set -uo pipefail

CANDIDATOS=(
  /root/loops/onia-hermes/hermes-content/deploy/vps-ops/bot/rescate-run.mjs
  /root/loops/onia-hermes-chatbot/hermes-content/deploy/vps-ops/bot/rescate-run.mjs
)

SCRIPT=""
for c in "${CANDIDATOS[@]}"; do
  [ -f "$c" ] && { SCRIPT="$c"; break; }
done

if [ -z "$SCRIPT" ]; then
  echo "$(date -u +%FT%TZ) FALLO: no encontre rescate-run.mjs en ninguno de los candidatos"
  /root/bin/onia-tg.sh "🔴 <b>Rescate del mensaje perdido</b>: no encuentro su script — un mensaje que llegue con el webhook caido se pierde para siempre" >/dev/null 2>&1
  exit 1
fi

echo "$(date -u +%FT%TZ) usando $SCRIPT"
node "$SCRIPT" --emit
