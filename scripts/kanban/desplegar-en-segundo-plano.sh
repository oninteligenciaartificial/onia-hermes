#!/usr/bin/env bash
# Corre un publicador de produccion SUELTO del proceso que lo lanzo, y cuenta
# como termino: Telegram + un comentario en la tarea que lo aprobo.
#
# Uso (lo invoca publicar-aprobado.mjs, no una persona):
#   bash desplegar-en-segundo-plano.sh <ruta-del-publicador> <id-de-tarea> [--dry-run]
#
# POR QUE EN SEGUNDO PLANO. Un build de Next tarda minutos y quien nos llama
# corta antes: telegram-entrada.py mata al publicador a los 360 s, y el gateway
# de Hermes tiene su propio tope. Matar un swap A MITAD deja produccion en un
# estado que nadie pidio — peor que no desplegar. Asi que el deploy se suelta y
# la respuesta a Sergio es "arranco", no "listo".
#
# POR QUE AVISA. Un deploy que termina en silencio es el mismo agujero que esto
# viene a tapar, un paso mas adelante: Sergio contesta `ok`, el circuito arranca,
# falla el build, y nadie se entera. El resultado va SIEMPRE, salga bien o mal.
set -uo pipefail

SCRIPT=${1:?falta la ruta del publicador}
TAREA=${2:?falta el id de la tarea}
SECO=${3:-}
LOG=/var/log/onia-deploy-aprobado.log
TG=/root/bin/onia-tg.sh
TABLERO=/root/bin/onia-tablero.sh

# La ruta la elige una lista blanca del codigo que nos llama, nunca el cuerpo de
# la tarea. Se vuelve a comprobar aca: este script tambien se puede correr solo.
case "$SCRIPT" in
  /opt/onia-landing/_deploy/publicar.sh|/opt/onia-platform/_deploy/publicar.sh) ;;
  *) echo "$(date -u '+%F %T') ERR destino fuera de la lista blanca: $SCRIPT" >> "$LOG"; exit 1 ;;
esac

QUE=$([ "$SCRIPT" = "/opt/onia-landing/_deploy/publicar.sh" ] && echo "onia.com.bo" || echo "app.onia.com.bo")
INICIO=$(date -u '+%F %T')
{
  echo "════ $INICIO UTC — arranca deploy de $QUE (tarea $TAREA${SECO:+ $SECO})"
} >> "$LOG"

# shellcheck disable=SC2086 # $SECO es "" o "--dry-run", ninguna otra cosa
bash "$SCRIPT" $SECO >> "$LOG" 2>&1
CODIGO=$?

FIN=$(date -u '+%F %T')
COLA=$(tail -n 6 "$LOG" | sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g')
echo "════ $FIN UTC — termino con codigo $CODIGO" >> "$LOG"

case "$CODIGO" in
  0) TITULO="✅ <b>$QUE publicado</b>"; NOTA="DEPLOY EJECUTADO tras el ok de Sergio Urcullo: $QUE publicado (codigo 0)." ;;
  2) TITULO="⚠️ <b>$QUE: no se pudo medir</b>"; NOTA="DEPLOY NO EJECUTADO: el publicador no pudo medir el estado (codigo 2). Produccion NO se toco." ;;
  *) TITULO="🔴 <b>$QUE NO se publico</b>"; NOTA="DEPLOY FALLIDO (codigo $CODIGO). Produccion quedo como estaba o a medias: mirar $LOG." ;;
esac

[ -x "$TG" ] && "$TG" "$TITULO
Tarea <code>$TAREA</code>${SECO:+ (simulacro, no se toco produccion)}

<pre>$COLA</pre>

Log completo: <code>$LOG</code>" >/dev/null 2>&1

# El veredicto tambien queda en la tarea: el chat se scrollea, la tarea no.
[ -x "$TABLERO" ] && "$TABLERO" comment "$TAREA" "$NOTA Arranco $INICIO UTC, termino $FIN UTC." >/dev/null 2>&1

exit "$CODIGO"
