#!/usr/bin/env bash
# ONIA — WATCHDOG del servidor de webhook del chatbot.
#
# EL PROBLEMA QUE RESUELVE: `webhook-server.sh start` arranca el proceso con `docker exec -d`.
# Eso lo cuelga del contenedor `onia-center`, NO de un supervisor. Si el contenedor reinicia
# (deploy, reboot del VPS, OOM), el proceso se va y NADIE lo vuelve a levantar: Chatwoot sigue
# mandando webhooks a un puerto muerto y el bot deja de contestarle a prospectos reales, en
# silencio y sin que nadie se entere.
#
# Corre por cron cada 2 minutos. Es idempotente: si /health responde, no hace nada.
#
#   */2 * * * * /opt/onia/bot/webhook-watchdog.sh >> /var/log/onia-bot-watchdog.log 2>&1
#
# Deliberadamente tonto PARA REPARAR: no reintenta en loop. Lo que si escala es el AVISO —
# ver el bloque de Telegram mas abajo: una caida larga vuelve a avisar en vez de callarse.
set -uo pipefail

CONTAINER="${ONIA_BOT_CONTAINER:-onia-center}"
PORT="${ONIA_WEBHOOK_PORT:-3020}"
BOT_DIR="${ONIA_BOT_DIR:-/opt/onia/bot}"
STAMP="$(date -Iseconds)"

log() { echo "[$STAMP] $*"; }

# --- Telegram: SOLO errores (decision Sergio 2026-08-28) ---------------------
# Un aviso de caida + uno de recuperacion. El marcador evita 30 mensajes/hora
# mientras dure la caida (el cron corre cada 2 min).
#
# CORREGIDO 2026-09-21. Aca decia "un incidente = UN aviso" a secas, y ese "UN" costo dos
# dias de bot mudo (19-sep 19:00 UTC -> 21-sep 19:34). Conviene decirlo claro porque la
# version que circulo en los handoffs es falsa: el watchdog NO estaba mudo. Detecto la caida
# al primer minuto, escribio 800 KB de log, y mando su alarma. UNA, un viernes a las 19:00, a
# un Telegram donde Sergio Urcullo ya tiene decenas de tareas abiertas. Despues se callo 1.440
# ciclos seguidos, porque el mismo marcador que evita el spam evitaba tambien el segundo aviso.
#
# O sea: no faltaba una sonda. Las sondas andaban. Faltaba INSISTIR.
#
# Lo que NO se hace: repetir cada 2 minutos — eso silencia el canal igual, pero peor, y la
# leccion ya esta escrita dos veces en este archivo (los strikes existen justamente por eso).
# Lo que se hace: ESCALAR. Se re-avisa a los 15 min, 1 h, 6 h y despues una vez por dia, y
# cada re-aviso dice hace cuanto esta asi. Una caida de 5 minutos sigue costando UN mensaje.
ALERT_ENV="${ONIA_WATCHDOG_ALERT_ENV:-/root/.config/onia/backup.env}"
# Prefijo de los marcadores de estado. Inyectable SOLO para poder ejecutar este
# script de verdad en un test (ver webhook-watchdog.test.mjs); el default es el
# de produccion y no cambia, asi que un incidente ya declarado se sigue
# reconociendo despues de este cambio.
ESTADO="${ONIA_WATCHDOG_ESTADO:-/var/lib/onia-bot-watchdog}"
INCIDENTE="$ESTADO.incidente"
tg_error() {
  [ -f "$ALERT_ENV" ] && . "$ALERT_ENV"
  [ -n "${TG_BOT_TOKEN:-}" ] && [ -n "${TG_CHAT_ID:-}" ] || return 0
  curl -sf -m 20 -X POST "https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage"     -d chat_id="${TG_CHAT_ID}" -d parse_mode=HTML --data-urlencode text="$1" >/dev/null || true
}

# Hitos de re-aviso, en segundos: inmediato, 15 min, 1 h, 6 h y despues uno por dia.
hito_alcanzado() {
  if   [ "$1" -ge 86400 ]; then echo $(( ($1 / 86400) * 86400 ))
  elif [ "$1" -ge 21600 ]; then echo 21600
  elif [ "$1" -ge 3600 ];  then echo 3600
  elif [ "$1" -ge 900 ];   then echo 900
  else echo 0
  fi
}

duracion_humana() {
  if   [ "$1" -ge 86400 ]; then echo "$(( $1 / 86400 ))d $(( ($1 % 86400) / 3600 ))h"
  elif [ "$1" -ge 3600 ];  then echo "$(( $1 / 3600 ))h $(( ($1 % 3600) / 60 ))min"
  else echo "$(( $1 / 60 )) min"
  fi
}

# Las tres sondas (contenedor, webhook, camino a Chatwoot) comparten estas dos funciones a
# proposito: el bug de "un aviso y despues silencio" estaba en las TRES, escrito tres veces.
#
# Cada marcador guarda "<epoch de inicio> <ultimo hito avisado>". Un marcador del formato viejo
# (el `touch` vacio) se lee como incidente nuevo: se pierde la antiguedad real una sola vez, en
# la corrida del deploy, y nunca un aviso.
avisar_caida() {  # $1 = archivo marcador, $2 = texto
  ahora="$(date +%s)"; inicio=""; ultimo=""
  [ -f "$1" ] && read -r inicio ultimo < "$1" 2>/dev/null
  case "${inicio:-}" in ''|*[!0-9]*) inicio="$ahora"; ultimo="" ;; esac
  edad=$(( ahora - inicio ))
  hito="$(hito_alcanzado "$edad")"
  printf '%s %s\n' "$inicio" "$hito" > "$1"
  [ "$hito" = "${ultimo:-}" ] && return 0   # este hito ya se aviso: callar hasta el proximo
  if [ "$edad" -lt 60 ]; then
    tg_error "$2"
  else
    tg_error "$2

Lleva <b>$(duracion_humana "$edad")</b> asi, y el watchdog no puede solo."
  fi
}

avisar_recuperacion() {  # $1 = archivo marcador, $2 = texto
  [ -f "$1" ] || return 0
  ahora="$(date +%s)"; inicio=""
  read -r inicio _ < "$1" 2>/dev/null
  rm -f "$1"
  case "${inicio:-}" in ''|*[!0-9]*) tg_error "$2"; return 0 ;; esac
  tg_error "$2 Estuvo asi $(duracion_humana $(( ahora - inicio )))."
}

# 1. ¿Existe el contenedor? Sin el no hay nada que levantar — y el bot esta 100% mudo, en el
# widget Y en WhatsApp. Hasta el 2026-09-18 esta rama solo escribia el log y salia 0 (que para
# el cron es exito), asi que el dano MAYOR era el unico que no le llegaba a nadie, mientras el
# webhook caido con el contenedor vivo si disparaba la alarma 🚨.
#
# Strike de una corrida, mismo criterio que el camino a Chatwoot: durante un reinicio de docker
# el contenedor desaparece unos segundos y eso no es un incidente.
INCIDENTE_CONT="$ESTADO.incidente-contenedor"
STRIKE_CONT="$ESTADO.strike-contenedor"
if ! docker ps --format '{{.Names}}' | grep -qx "$CONTAINER"; then
  if [ ! -f "$STRIKE_CONT" ] && [ ! -f "$INCIDENTE_CONT" ]; then
    touch "$STRIKE_CONT"
    log "AVISO: no veo el contenedor $CONTAINER — espero la corrida siguiente antes de declarar el incidente"
  else
    log "ERROR: el contenedor $CONTAINER no esta corriendo — el bot esta mudo y no hay que levantar"
    avisar_caida "$INCIDENTE_CONT" "🚨 <b>Bot Onia SIN CONTENEDOR</b> — $CONTAINER no esta corriendo: el chatbot esta mudo en el widget Y en WhatsApp, y el watchdog no tiene nada que levantar. Hay que arrancarlo a mano. Log: /var/log/onia-bot-watchdog.log"
  fi
  exit 0
fi
# El strike no se acumula entre parpadeos lejanos: un exito lo borra.
rm -f "$STRIKE_CONT"
if [ -f "$INCIDENTE_CONT" ]; then
  log "OK: el contenedor $CONTAINER volvio a estar corriendo"
  avisar_recuperacion "$INCIDENTE_CONT" "✅ <b>Bot Onia</b> — el contenedor $CONTAINER volvio: el chatbot puede recibir mensajes de nuevo."
fi


# 1.5. La excepcion de firewall que el bot necesita para su base (PostgREST escucha en 3000
# y ONIA-BLOCK-3000 en DOCKER-USER corta contenedor<->contenedor). Se perdio en el reinicio
# del 2026-08-24 y el bot quedo 4 dias sin base. Idempotente: si la regla esta, no hace nada.
# ponytail: se re-inserta aca cada 2 min porque el que re-aplica los DROP tras un reinicio
# sigue sin identificarse; si algun dia se encuentra, mover la excepcion a ese mismo lugar.
if ! iptables -C DOCKER-USER -s 172.16.0.0/12 -d 172.16.0.0/12 -p tcp -m conntrack --ctorigdstport 3000 -m comment --comment ONIA-ALLOW-3000-INTERNO -j RETURN 2>/dev/null; then
  iptables -I DOCKER-USER 1 -s 172.16.0.0/12 -d 172.16.0.0/12 -p tcp -m conntrack --ctorigdstport 3000 -m comment --comment ONIA-ALLOW-3000-INTERNO -j RETURN     && log "firewall: re-inserte ONIA-ALLOW-3000-INTERNO (se habia perdido)"
fi

# 2. ¿Contesta /health? Es la unica prueba que vale: el PID puede existir y el puerto estar mudo.
if docker exec "$CONTAINER" sh -c "wget -qO- --timeout=5 http://127.0.0.1:$PORT/health" >/dev/null 2>&1; then
  if [ -f "$INCIDENTE" ]; then
    log "OK: el webhook volvio a responder solo — incidente cerrado"
    avisar_recuperacion "$INCIDENTE" "✅ <b>Bot Onia recuperado</b> — el webhook volvio a responder."
  fi
  # 2.b. El /health NO ve el camino bot->Chatwoot (la base va por otro puerto): el 2026-08-28
  # el bot estuvo 4 dias calculando respuestas que Chatwoot nunca recibio (attachment overlay
  # rancio tras el reboot). Chequeo directo; fix manual documentado en el handoff del carril:
  # docker network disconnect easypanel onia-center && docker network connect --alias onia-center easypanel onia-center
  #
  # DOS CORRIDAS, NO UNA (2026-09-17). Esta sonda es un unico `timeout 5` y el que la
  # falla dispara la alarma 🚨 maxima. Medido en el log de produccion: los tres ERROR de
  # los ultimos 15 dias (03-sep, 05-sep, 17-sep) son de UNA linea cada uno — con el cron
  # cada 2 min, una caida de verdad escribe una linea cada 2 min. O sea, tres parpadeos,
  # seis mensajes al Telegram de Sergio Urcullo y cero incidentes. Un strike de una
  # corrida cuesta 2 minutos de deteccion sobre una caida que ya duro 4 dias, y le saca
  # los falsos positivos al unico canal por el que avisamos algo grave.
  INCIDENTE_CW="$ESTADO.incidente-chatwoot"
  STRIKE_CW="$ESTADO.strike-chatwoot"
  if docker exec "$CONTAINER" sh -c "timeout 5 wget -qO- http://onia-chatbot_chatwoot:3000/ >/dev/null 2>&1"; then
    # El strike no se acumula entre parpadeos lejanos: un exito lo borra.
    rm -f "$STRIKE_CW"
    if [ -f "$INCIDENTE_CW" ]; then
      log "OK: el camino a Chatwoot volvio — las respuestas salen de nuevo"
      avisar_recuperacion "$INCIDENTE_CW" "✅ <b>Bot Onia</b> — el camino a Chatwoot volvio: las respuestas salen de nuevo."
    fi
  elif [ ! -f "$STRIKE_CW" ] && [ ! -f "$INCIDENTE_CW" ]; then
    touch "$STRIKE_CW"
    log "AVISO: una sonda al camino a Chatwoot fallo — espero la corrida siguiente antes de declarar el incidente"
  else
    log "ERROR: el bot NO llega a Chatwoot (respuestas mudas aunque /health este ok)"
    avisar_caida "$INCIDENTE_CW" "🚨 <b>Bot Onia MUDO</b> — el proceso vive pero NO llega a Chatwoot: calcula respuestas que nadie recibe. Fix: reconectar onia-center a la red easypanel (comando en el watchdog y en el handoff del carril chatbot)."
  fi
  exit 0
fi

# 3. No contesta: levantarlo.
log "el webhook NO responde en :$PORT — reiniciando"
# Se llega aca con el webhook YA caido, asi que rendirse en silencio deja al bot mudo sin que
# nadie se entere. El 2026-09-18 el deploy de las 03:47 UTC dejo en 644 a reminder-run.sh,
# postdemo-run.sh y a este mismo watchdog: el mismo accidente sobre webhook-server.sh cae justo
# en esta rama. Por eso el aviso nombra la causa probable, que es la que se arregla en 5 s.
if [ ! -x "$BOT_DIR/webhook-server.sh" ]; then
  log "ERROR: no puedo ejecutar $BOT_DIR/webhook-server.sh (falta, o viajo sin el bit de ejecucion)"
  avisar_caida "$INCIDENTE" "🚨 <b>Bot Onia CAIDO</b> — el webhook no responde y el watchdog NO puede levantarlo: $BOT_DIR/webhook-server.sh no se puede ejecutar (suele ser un deploy que lo dejo en 644). El chatbot esta mudo hasta que alguien mire."
  exit 1
fi

"$BOT_DIR/webhook-server.sh" restart >/dev/null 2>&1

# 3.bis "No responde" y "no arranca" son fallas distintas, y hasta hoy se trataban igual.
#
# Del 19 al 21-sep el arbol del bot dentro del contenedor quedo anidado un nivel de mas
# (/tmp/onia-bot/bot/) y el arranque moria con MODULE_NOT_FOUND. Reiniciar no devuelve un archivo
# que no esta, asi que este watchdog corrio el MISMO arranque roto 1.440 veces seguidas. Peor: el
# `.stamp` marcaba el arbol como sincronizado, asi que ningun sync posterior iba a re-copiarlo.
#
# La causa de ESE anidamiento ya se arreglo en el sync (copia a `$DEST.new` y recien ahi hace el
# swap), pero un arbol puede quedar roto por otros motivos — un deploy cortado a la mitad, disco
# lleno, permisos. Lo que falta es que el watchdog sepa SALIR de ahi: borrar el arbol invalida el
# stamp, y el proximo arranque re-copia de cero. Es idempotente y cuesta una copia.
if ! docker exec "$CONTAINER" sh -c "wget -qO- --timeout=5 http://127.0.0.1:$PORT/health" >/dev/null 2>&1; then
  ARRANQUE="$(docker exec "$CONTAINER" sh -c "tail -n 40 /tmp/onia-bot-webhook.log 2>/dev/null" 2>/dev/null || true)"
  if printf '%s' "$ARRANQUE" | grep -qE "MODULE_NOT_FOUND|Cannot find module"; then
    # AVISO y no ERROR a proposito, siguiendo la convencion del script: ERROR es la falla dura que
    # despierta a Sergio Urcullo; AVISO es la observacion que el watchdog intenta reparar solo.
    # Esto se repara aca mismo, y si el re-sync no alcanza el paso 4 lo grita con su 🚨.
    log "AVISO: el arbol del bot en el contenedor esta roto (falta un modulo) — fuerzo re-sync limpio"
    docker exec "$CONTAINER" rm -rf /tmp/onia-bot /tmp/onia-bot.new /tmp/onia-bot.old >/dev/null 2>&1
    "$BOT_DIR/webhook-server.sh" restart >/dev/null 2>&1
  fi
fi

# 4. Confirmar que el reinicio sirvio (si no, el log tiene que gritarlo).
sleep 3
if docker exec "$CONTAINER" sh -c "wget -qO- --timeout=5 http://127.0.0.1:$PORT/health" >/dev/null 2>&1; then
  log "OK: webhook de vuelta arriba"
  if [ -f "$INCIDENTE" ]; then
    log "OK: incidente cerrado — el watchdog lo levanto"
    avisar_recuperacion "$INCIDENTE" "✅ <b>Bot Onia recuperado</b> — el watchdog lo levanto y responde de nuevo."
  fi
else
  log "ERROR: el webhook sigue caido despues del reinicio — mirar ./webhook-server.sh logs"
  avisar_caida "$INCIDENTE" "🚨 <b>Bot Onia CAIDO</b> — el webhook no responde en :$PORT y el watchdog NO pudo levantarlo. El chatbot (widget + WhatsApp) esta mudo hasta que alguien mire. Log: /var/log/onia-bot-watchdog.log"
fi
