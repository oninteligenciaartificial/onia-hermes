#!/usr/bin/env bash
# Publica solo lo que pasa TODOS los gates. AVISA en vez de preguntar.
#
# POR QUE EXISTE. Medido el 2026-09-08: se publicaron 45 arreglos a las 17:31 y
# para las 22:30 —menos de cinco horas— ya habia ONCE nuevos esperando. Los loops
# producen ~2 arreglos por hora en la plataforma; la firma de Sergio Urcullo
# ocurre cada varios dias. Por eso el item "hay arreglos verdes esperando UN ok"
# de plataforma-v1.md NO PUEDE quedarse cerrado: se reabre solo cada pocas horas,
# para siempre. Se cerro a mano ese mismo dia y volvio a abrirse mientras se
# hablaba de el. Un cuello de botella que se mide en horas no se arregla pidiendo
# la firma mas seguido: se arregla sacandola del camino de lo que la maquina ya
# verifico.
#
# LO QUE SIGUE NECESITANDO SU FIRMA. Si un commit varado toca una fuente de
# PRECIO, este guion NO publica ese destino: avisa y sigue con los demas. Es la
# regla "una sola fuente de verdad por tema" de CLAUDE.md vuelta guarda
# ejecutable — el repo llego a tener CUATRO precios vivos del mismo chatbot, y
# eso empieza con un cambio que nadie miro.
#
# LOS GATES NO SON DE ESTE GUION, y es a proposito. Cada publicar.sh ya mide, se
# niega si hay otro build corriendo, corre sus gates (standalone integro,
# BUILD_ID nuevo contra el vivo LEIDO, cero 127.0.0.1 horneado), respalda y
# REVIERTE solo si el swap falla. Esto es el disparador y el aviso, no una
# segunda opinion que se desincronice de la primera el dia que una cambie.
#
#   bash onia-publicar-solo.sh --dry-run   # dice que haria, no toca nada
set -uo pipefail

TG=${ONIA_TG:-/root/bin/onia-tg.sh}
LOCK=/var/lock/onia-publicar-solo.lock
REPO_HERMES=${ONIA_LOOPS_REPO:-/root/loops/onia-hermes}
REPO_PLATFORM=${ONIA_PLATFORM_REPO:-/root/loops/onia-platform}
SECO=""
[ "${1:-}" = "--dry-run" ] && SECO=1

# Fuentes de precio. CLAUDE.md nombra DOS archivos y cada uno manda sobre lo
# suyo: subscription-plans.ts son los montos de los planes (es el que valida el
# pago), pricing.ts son los add-ons. El catalogo dice QUE se vende. El knowledge
# del bot lleva los precios que el bot dice en voz alta.
FIRMA_HUMANA='lib/pricing\.ts|lib/subscription-plans\.ts|ONIA_CATALOGO_DE_VENTA\.md|knowledge\.onia\.json'

# Un solo publicador a la vez. La leccion de los builds encimados que tumbaron el
# VPS el 2026-08-22 (load 18, npm de 40 min) vale igual cuando el que encima los
# builds es un cron y no una persona.
exec 9>"$LOCK"
flock -n 9 || { echo "ya hay una corrida en curso; salgo"; exit 0; }

avisar() {
  if [ -n "$SECO" ]; then echo "  [seco] avisaria: $1"; return; fi
  # HTML, nunca Markdown: un guion bajo suelto hace que el mensaje NO llegue.
  "$TG" "$1" >/dev/null 2>&1 || true
}

# Los archivos que tocan los commits varados de un destino. Se le PREGUNTA al
# mismo medidor que usa el publicador: dos derivaciones distintas de "que falta"
# se contradicen el dia que una cambia.
archivos_varados() {  # $1=cwd  $2=modulo  $3=repo-del-codigo
  local shas f
  shas=$(cd "$1" && node "$2" --json 2>/dev/null \
         | grep -oE '"sha": *"[0-9a-f]+"' | cut -d'"' -f4)
  [ -z "$shas" ] && return 0
  for f in $shas; do git -C "$3" show --name-only --format= "$f" 2>/dev/null; done
}

publicar_destino() {  # $1=nombre  $2=publicar.sh  $3=archivos-tocados
  local nombre=$1 guion=$2 tocados=$3 riesgo
  riesgo=$(printf '%s\n' "$tocados" | grep -aE "$FIRMA_HUMANA" | sort -u | head -3)
  if [ -n "$riesgo" ]; then
    echo "  $nombre: NO publico solo — toca una fuente de precio"
    avisar "<b>Onia — publicacion detenida a proposito</b>
<b>$nombre</b> tiene un arreglo que toca una fuente de PRECIO:
<code>$riesgo</code>
Eso no sale sin tu firma. El resto se publico solo."
    return 0
  fi
  if [ -n "$SECO" ]; then echo "  $nombre: publicaria (nada toca precio)"; return 0; fi
  if bash "$guion" >"/tmp/pub-$nombre.log" 2>&1; then
    echo "  $nombre: PUBLICADO"
    avisar "<b>Onia — publicado solo</b>
<b>$nombre</b> quedo al dia.
<code>$(tail -1 "/tmp/pub-$nombre.log" | head -c 160)</code>"
  else
    echo "  $nombre: FALLO"
    avisar "<b>Onia — la publicacion de $nombre FALLO</b>
<code>$(tail -3 "/tmp/pub-$nombre.log" | head -c 300)</code>
Produccion no cambio, o volvio sola. Log: /tmp/pub-$nombre.log"
  fi
}

echo "== $(TZ=America/La_Paz date '+%F %H:%M') La Paz =="

# 🔴 La salida se CAPTURA entera y se compara con `case`, nunca `... | head -1 |
# grep -q`. Con `set -o pipefail`, `head` cierra el cano, el publicador muere con
# SIGPIPE (141) y ese 141 pasa a ser el estado de TODO el `if` aunque el grep
# haya encontrado el texto. Escrito asi la primera vez (2026-09-08), este guion
# dijo "al dia" con ONCE arreglos varados delante: no habria publicado nunca, y
# el aviso de exito habria sonado igual de tranquilo. Un falso negativo que se
# ve como salud es peor que una caida.
hay_varados() { case "$1" in *"hay que publicar"*) return 0 ;; *) return 1 ;; esac; }

SALIDA_PLAT=$(bash /opt/onia-platform/_deploy/publicar.sh --dry-run 2>&1) || true
if hay_varados "$SALIDA_PLAT"; then
  publicar_destino plataforma /opt/onia-platform/_deploy/publicar.sh \
    "$(archivos_varados "$REPO_HERMES" hermes-content/deploy/onia-platform/deploy-vivo.mjs "$REPO_PLATFORM")"
else
  echo "  plataforma: al dia"
fi

SALIDA_LAND=$(bash /opt/onia-landing/_deploy/publicar.sh --dry-run 2>&1) || true
if hay_varados "$SALIDA_LAND"; then
  publicar_destino landing /opt/onia-landing/_deploy/publicar.sh \
    "$(archivos_varados "$REPO_HERMES" web-factory/apps/onia-platform/scripts/deploy-vivo.mjs "$REPO_HERMES")"
else
  echo "  landing: al dia"
fi

# El bot no tiene medidor por commits: su publicador lista los archivos que
# cambian, asi que la guarda se aplica sobre esa lista tal cual.
SALIDA_BOT=$(bash /opt/onia/bot/_deploy/publicar.sh --dry-run 2>&1)
if echo "$SALIDA_BOT" | grep -q "nada que desplegar"; then
  echo "  bot: al dia"
else
  publicar_destino bot /opt/onia/bot/_deploy/publicar.sh "$SALIDA_BOT"
fi
