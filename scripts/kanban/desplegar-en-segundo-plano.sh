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

# ── Veredicto ────────────────────────────────────────────────────────────────
# Traduce (codigo de salida, simulacro) en lo que se le cuenta a Sergio Urcullo:
# TITULO para el aviso de Telegram y NOTA para el comentario de la tarea.
#
# Esta aparte y con autotest porque aca vivio un bug: en simulacro el aviso de
# Telegram avisaba "(simulacro, no se toco produccion)" y la NOTA no, asi que la
# tarea quedaba diciendo "publicado" sobre un deploy que no ocurrio. El chat se
# scrollea y la tarea no: el unico registro que sobrevive era el falso.
veredicto() {
  local codigo=$1 seco=${2:-}
  if [ -n "$seco" ]; then
    TITULO="🧪 <b>$QUE: simulacro</b>"
    NOTA="SIMULACRO ($seco): produccion NO se toco y el sitio sigue sirviendo el build viejo. El circuito se recorrio entero y salio con codigo $codigo. Esto NO es un deploy: el pedido sigue esperando."
    return
  fi
  case "$codigo" in
    0) TITULO="✅ <b>$QUE publicado</b>"; NOTA="DEPLOY EJECUTADO tras el ok de Sergio Urcullo: $QUE publicado (codigo 0)." ;;
    2) TITULO="⚠️ <b>$QUE: no se pudo medir</b>"; NOTA="DEPLOY NO EJECUTADO: el publicador no pudo medir el estado (codigo 2). Produccion NO se toco." ;;
    *) TITULO="🔴 <b>$QUE NO se publico</b>"; NOTA="DEPLOY FALLIDO (codigo $codigo). Produccion quedo como estaba o a medias: mirar $LOG." ;;
  esac
}

# Gate: un simulacro NO puede quedar escrito como un deploy. Corre solo, sin
# tocar produccion ni el tablero: `bash desplegar-en-segundo-plano.sh --autotest`
autotest() {
  QUE=onia.com.bo
  LOG=/tmp/autotest-deploy.log
  local fallas=0
  contiene() { case "$1" in *"$2"*) return 0 ;; *) return 1 ;; esac; }
  afirmar() { # <descripcion> <codigo de la condicion>
    if [ "$2" = 0 ]; then echo "  ok    $1"; else echo "  FALLA $1"; fallas=$((fallas + 1)); fi
  }

  # Lo que Sergio Urcullo tiene que poder distinguir de un vistazo.
  veredicto 0 "--dry-run"
  ! contiene "$NOTA" "DEPLOY EJECUTADO"; afirmar "simulacro: la nota NO puede decir DEPLOY EJECUTADO" $?
  ! contiene "$NOTA" "publicado";       afirmar "simulacro: la nota NO puede decir publicado" $?
  contiene "$NOTA" "SIMULACRO";         afirmar "simulacro: la nota tiene que decir SIMULACRO" $?
  ! contiene "$TITULO" "✅";            afirmar "simulacro: el titulo NO puede llevar el tilde verde" $?

  # Y los tres veredictos reales tienen que seguir diciendo lo suyo.
  veredicto 0 ""
  contiene "$NOTA" "DEPLOY EJECUTADO";  afirmar "deploy real: la nota dice DEPLOY EJECUTADO" $?
  veredicto 2 ""
  contiene "$NOTA" "NO EJECUTADO";      afirmar "codigo 2: la nota dice NO EJECUTADO" $?
  veredicto 1 ""
  contiene "$NOTA" "FALLIDO";           afirmar "codigo 1: la nota dice FALLIDO" $?

  [ "$fallas" = 0 ] && { echo "autotest OK"; return 0; }
  echo "autotest: $fallas falla(s)"; return 1
}

[ "${1:-}" = "--autotest" ] && { autotest; exit $?; }

SCRIPT=${1:?falta la ruta del publicador}
TAREA=${2:?falta el id de la tarea}
SECO=${3:-}
LOG=/var/log/onia-deploy-aprobado.log
TG=/root/bin/onia-tg.sh
TABLERO=/root/bin/onia-tablero.sh

# La ruta la elige una lista blanca del codigo que nos llama, nunca el cuerpo de
# la tarea. Se vuelve a comprobar aca: este script tambien se puede correr solo.
case "$SCRIPT" in
  /opt/onia-landing/_deploy/publicar.sh|/opt/onia-platform/_deploy/publicar.sh|/opt/onia/bot/_deploy/publicar.sh) ;;
  *) echo "$(date -u '+%F %T') ERR destino fuera de la lista blanca: $SCRIPT" >> "$LOG"; exit 1 ;;
esac

# El nombre que ve Sergio en el aviso. Son TRES destinos desde el 2026-09-05, asi
# que un ternario ya no alcanza: con dos ramas, el bot se anunciaba como
# "app.onia.com.bo" — el aviso mentiria sobre que se publico.
case "$SCRIPT" in
  /opt/onia-landing/_deploy/publicar.sh)  QUE="onia.com.bo" ;;
  /opt/onia-platform/_deploy/publicar.sh) QUE="app.onia.com.bo" ;;
  /opt/onia/bot/_deploy/publicar.sh)      QUE="el bot de WhatsApp" ;;
esac
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

veredicto "$CODIGO" "$SECO"

[ -x "$TG" ] && "$TG" "$TITULO
Tarea <code>$TAREA</code>${SECO:+ (simulacro, no se toco produccion)}

<pre>$COLA</pre>

Log completo: <code>$LOG</code>" >/dev/null 2>&1

# El veredicto tambien queda en la tarea: el chat se scrollea, la tarea no.
[ -x "$TABLERO" ] && "$TABLERO" comment "$TAREA" "$NOTA Arranco $INICIO UTC, termino $FIN UTC." >/dev/null 2>&1

exit "$CODIGO"
