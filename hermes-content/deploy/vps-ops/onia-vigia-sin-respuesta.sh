#!/usr/bin/env bash
# Vigia del desconocido colgado — avisa a Telegram cuando alguien escribio al bot y nadie le
# contesto. El porque, medido, esta en la cabecera de `scripts/vigia_sin_respuesta.mjs`.
# Solo LECTURA sobre Chatwoot. Avisa una vez por mensaje: si la persona insiste, vuelve a avisar.
# Cron: 39 */2 * * *   Log: /var/log/onia-vigia-sin-respuesta.log
#
# POR QUE BUSCA EL SCRIPT EN DOS LADOS Y NO EN UNO: el clon de `main` (`/root/loops/onia-hermes`)
# es el que manda, pero se actualiza cuando el integrador mergea. Hasta ese momento el archivo
# solo existe en el worktree del carril. Un cron que apunte a un solo path arranca roto y —peor—
# se queda roto en silencio, que es justo el modo de falla que este vigia vino a cerrar.
set -uo pipefail

CANDIDATOS=(
  /root/loops/onia-hermes/scripts/vigia_sin_respuesta.mjs
  /root/loops/onia-hermes-chatbot/scripts/vigia_sin_respuesta.mjs
)

SCRIPT=""
for c in "${CANDIDATOS[@]}"; do
  [ -f "$c" ] && { SCRIPT="$c"; break; }
done

if [ -z "$SCRIPT" ]; then
  echo "$(date -u +%FT%TZ) FALLO: no encontre vigia_sin_respuesta.mjs en ninguno de los candidatos"
  /root/bin/onia-tg.sh "🔴 <b>Vigia sin-respuesta</b>: no encuentro su script — nadie esta mirando si un desconocido quedo colgado" >/dev/null 2>&1
  exit 1
fi

echo "$(date -u +%FT%TZ) usando $SCRIPT"
node "$SCRIPT" --emit
