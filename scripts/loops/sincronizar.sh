#!/usr/bin/env bash
# Despliega el corredor y los prompts DESDE `main` a /root/bin, en el VPS mismo.
#
# 🔴 POR QUE, y son dos razones distintas:
#
# 1. **Sin esto, el sistema de loops depende de la laptop de Sergio.** Un prompt
#    mejorado se commitea, se mergea a `main`… y sigue sin correr, porque lo que
#    se ejecuta vive en /root/bin y nadie lo copia. Ya pasó: el canario estuvo un
#    día entero mirando CINCO pantallas mientras `main` tenía la versión de DIEZ,
#    commiteada y mergeada. Commitear una mejora NO la enciende.
#
# 2. **Copiar desde Windows mete CRLF.** Los prompts escritos en la laptop llegan
#    con fin de línea de Windows, el checkout del VPS los tiene con LF, y la
#    guarda anti-drift del corredor (`cmp -s`) los ve distintos para siempre:
#    avisa de un drift que no existe, cada 6 h, hasta que nadie le crea. Copiando
#    desde el propio checkout, los dos lados salen del mismo git y son idénticos
#    por construcción.
#
# Escribe a un temporal y hace `mv` — atómico. Un loop que esté corriendo se
# queda con el inodo viejo hasta terminar; la vuelta siguiente arranca con el
# nuevo. Editar en caliente el mismo inodo YA rompió una vuelta (ver la trampa 5
# de hermes-content/docs/COMO_SE_ARMA_UN_LOOP.md).
#
# Corre por cron unos minutos después del integrador: lo que se mergea a `main`
# queda desplegado en la vuelta siguiente, sin que nadie toque nada.
set -uo pipefail

REPO=${ONIA_LOOPS_REPO:-/root/loops/onia-hermes}
DESTINO_BIN=${ONIA_LOOPS_BIN:-/root/bin}
FUENTE="$REPO/scripts/loops"
CAMBIOS=0
# Indirecto para poder PROBAR este script sin mandarle un Telegram falso a Sergio.
# Una guarda que no se puede ejercitar es una guarda que nadie sabe si anda.
TG=${ONIA_TG:-/root/bin/onia-tg.sh}

log() { printf '%s %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$*"; }

[ -d "$FUENTE/prompts" ] || { log "FALLO: no existe $FUENTE/prompts"; exit 2; }

# `main` al día. Sólo fast-forward: si el árbol del integrador quedó con trabajo
# propio a medias, esto NO lo pisa — se queja y sale.
if ! git -C "$REPO" fetch origin --quiet; then log "aviso: fetch fallo, sincronizo con lo que hay"; fi
RAMA=$(git -C "$REPO" branch --show-current 2>/dev/null)
if [ "$RAMA" = "main" ]; then
  git -C "$REPO" merge --ff-only origin/main --quiet 2>/dev/null || log "aviso: main no avanzo por ff (el integrador tiene trabajo local)"
else
  log "aviso: $REPO esta en '$RAMA', no en main — sincronizo igual desde el arbol tal cual esta"
fi

poner() {  # poner <origen> <destino>
  local origen="$1" destino="$2" tmp="$2.nuevo.$$"
  cmp -s "$origen" "$destino" 2>/dev/null && return 0
  cp -- "$origen" "$tmp" || { log "FALLO copiando $destino"; return 1; }
  # Un corredor roto NO reemplaza a uno que anda.
  case "$destino" in
    *.sh) bash -n "$tmp" || { rm -f "$tmp"; log "RECHAZADO (sintaxis): $destino"; return 1; }
          chmod 755 "$tmp" ;;
    *)    chmod 644 "$tmp" ;;
  esac
  mv -f -- "$tmp" "$destino" || { rm -f "$tmp"; log "FALLO renombrando $destino"; return 1; }
  log "actualizado $destino"
  CAMBIOS=$((CAMBIOS + 1))
}

# 🔴 DOS GUARDAS contra que `main` DEGRADE el corredor. Son dos casos distintos,
# medidos en dias distintos, y hacen falta las dos:
#
# GUARDA 1 — main NO puede apagar un loop que el cron sigue llamando.
# Nace del 2026-09-02 20:32 UTC, medido por el loop supervisor. Este script copia
# el corredor DESDE main, siempre, en una direccion sola. Ese dia main estaba CINCO
# commits atras (los `case` de supervisor, web-factory-dev, recorrido-cliente,
# tendencias y calidad-generado vivian solo en `claude/git-status-935f47`, sin
# mergear) mientras los cinco ya tenian linea de cron, prompt en disco y worktree
# vivo. La corrida de las :44 los habria borrado del corredor sin decir una palabra,
# y cada uno habria muerto en el `*)` con exit 64.
# El criterio NO es "main nunca puede sacar un case" — retirar un loop tiene que
# seguir siendo posible. Es: **si el cron lo sigue llamando, sacarle el case lo mata**.
# Un loop retirado de verdad se saca primero del crontab; entonces pasa sola.
#
# GUARDA 2 — main NO puede quitarle una CAPACIDAD al corredor desplegado.
# Nace del 2026-09-03: el runner con la inyeccion de memoria compartida se
# desplego a mano al VPS a las 11:5x y main todavia no lo tenia. La corrida de las
# 12:44 lo habria pisado con la version vieja y los 15 loops habrian vuelto a
# arrancar sin memoria, sin alerta. "Sincronizar desde main" es correcto cuando
# main va ADELANTE; cuando va atras, es borrar trabajo. La marca se elige por
# capacidad, no por fecha: si el desplegado sabe algo que el de main no, se espera.
ids_case() { grep -oE '^  [a-z0-9-]+\)' "$1" 2>/dev/null | tr -d ' )' | sort -u; }

PERDIDOS=""
if [ -f "$DESTINO_BIN/onia-loop.sh" ] && [ -f "$FUENTE/onia-loop.sh" ]; then
  while read -r id; do
    [ -n "$id" ] || continue
    if crontab -l 2>/dev/null | grep -qE "onia-loop\.sh +${id}([[:space:]]|\$)"; then
      PERDIDOS="$PERDIDOS $id"
    fi
  done < <(comm -13 <(ids_case "$FUENTE/onia-loop.sh") <(ids_case "$DESTINO_BIN/onia-loop.sh"))
fi

MARCA_RUNNER="memoria inyectada"
DEGRADA=0
if grep -q "$MARCA_RUNNER" "$DESTINO_BIN/onia-loop.sh" 2>/dev/null \
   && ! grep -q "$MARCA_RUNNER" "$FUENTE/onia-loop.sh" 2>/dev/null; then
  DEGRADA=1
fi

if [ -n "$PERDIDOS" ]; then
  log "RECHAZADO: el corredor de main no conoce a$PERDIDOS, y el cron los sigue llamando — dejo el desplegado"
  "$TG" "🔴 <b>Sync de loops frenado</b>: el corredor de <code>main</code> no conoce a <code>$(echo "$PERDIDOS" | sed 's/^ //; s/ /<\/code>, <code>/g')</code>, pero el cron los llama igual. Los habria matado con exit 64. Falta mergear su rama a main; mientras tanto dejo el corredor que anda." >/dev/null 2>&1 || true
elif [ "$DEGRADA" = 1 ]; then
  log "RECHAZADO onia-loop.sh: main esta ATRAS del VPS (le falta '$MARCA_RUNNER') — se espera al integrador"
  if [ ! -f /var/lib/onia-sync-degradacion.avisado ] || [ $(( $(date +%s) - $(stat -c %Y /var/lib/onia-sync-degradacion.avisado) )) -gt 21600 ]; then
    "$TG" "⚠️ <b>Sync</b>: <code>main</code> tiene un corredor MAS VIEJO que el desplegado (sin memoria compartida). No lo pisé. Falta que el integrador mergee la rama que lo trae." >/dev/null 2>&1 || true
    touch /var/lib/onia-sync-degradacion.avisado
  fi
else
  poner "$FUENTE/onia-loop.sh" "$DESTINO_BIN/onia-loop.sh"
fi

# El sincronizador se despliega A SI MISMO. Sin esta linea es el unico archivo del
# sistema que hay que copiar a mano, y por lo tanto el unico cuyas mejoras nunca se
# encienden solas — el mismo bug que este script existe para resolver, aplicado a
# si mismo. Medido el 2026-09-02: se le agrego el despliegue del tablero, corrio, y
# desplego los 8 prompts pero NO el tablero, porque el que corria era el viejo.
# Es seguro auto-reemplazarse: `poner` hace `mv`, que cambia el inodo, y bash sigue
# leyendo el inodo viejo que ya tiene abierto hasta terminar esta corrida.
poner "$FUENTE/sincronizar.sh" "$DESTINO_BIN/onia-loops-sync.sh"

# El tablero, como herramienta del VPS y NO como archivo del worktree.
#
# Nace del 2026-09-02: el prompt de los nueve loops dice "el tablero va primero" e
# invocaba `scripts/kanban/tablero.sh`, ruta RELATIVA al worktree de cada carril.
# Pero cada carril esta parado en SU rama, y el script se creo en `main` ese mismo
# dia: en `onia-hermes-chatbot`, `-canario` y `-web-venta` el archivo directamente
# NO EXISTIA. La regla mas importante del arranque fallaba con "No such file".
#
# El corredor no mergea `main` hacia las ramas de carril (a proposito: le arrancaria
# el arbol de abajo a un loop en curso), asi que una herramienta compartida NO puede
# vivir en una rama — llega solo a quien casualmente este actualizado. Va a /root/bin
# junto a onia-tg.sh, que es exactamente el mismo caso y por eso nunca fallo.
poner "$REPO/scripts/kanban/tablero.sh" "$DESTINO_BIN/onia-tablero.sh"

# El lector de Telegram de RESPALDO, por la misma razon que el tablero: es una
# herramienta del VPS, no un archivo de carril.
#
# ⚠️ Acá decía que es "el unico camino de ENTRADA de Sergio", y es FALSO —
# corregido el 2026-09-03. El camino de entrada vivo es el gateway de Hermes
# (`hermes_cli.main gateway run`), que pollea ese mismo bot: verificado con
# `ss -tnp | grep 149.154` (socket abierto, PID del gateway) y con dos actos
# suyos, la tarea t_13eaa0ae nacida de un mensaje de Sergio y t_04baed70
# desbloqueada con su veredicto a las 18:42:55.
#
# La frase importa porque manda al revés: leerla lleva a programar el script
# "para que por fin ande", y eso le PARTE el circuito a Sergio en vez de
# arreglarlo — Telegram entrega cada mensaje una sola vez, al que lo pida
# primero. El script ya se niega solo si el gateway está vivo; esto es para que
# nadie llegue hasta ahí. Lo cubre `npm run test:telegram-un-consumidor`.
poner "$REPO/scripts/kanban/telegram-entrada.py" "$DESTINO_BIN/onia-tg-entrada.py"

# La memoria compartida: el corredor la inyecta y los loops le escriben por estos
# dos. Si no se despliegan solos, el corredor de main llama a un script que no
# existe en /root/bin y los 15 loops fallan mudos en la primera linea.
poner "$FUENTE/aprender.sh"            "$DESTINO_BIN/onia-aprender.sh"
poner "$FUENTE/consolidar-memoria.sh"  "$DESTINO_BIN/onia-consolidar-memoria.sh"
# Los vigias y el renovador de horarios, por la misma razon: existian solo en
# /root/bin y una reinstalacion desde el repo los borraba sin avisar.
poner "$FUENTE/vigia-disco.sh"             "$DESTINO_BIN/onia-vigia-disco.sh"
poner "$FUENTE/aligerar-worktrees.sh"      "$DESTINO_BIN/onia-aligerar-worktrees.sh"
poner "$FUENTE/respaldar-memoria-hermes.sh" "$DESTINO_BIN/onia-respaldar-memoria.sh"
poner "$FUENTE/renovar-slots-bot.py"       "$DESTINO_BIN/onia-renovar-slots.py"
poner "$FUENTE/hermes-vigia.sh"            "$DESTINO_BIN/hermes-vigia.sh"
# El vigia de aprobaciones: cada pregunta de un loop le llega a Sergio al instante,
# con la foto. Es la mitad del circuito "el loop pregunta -> Sergio contesta ok"
# que faltaba del lado de Sergio (2026-09-03).
poner "$FUENTE/vigia-aprobaciones.sh"      "$DESTINO_BIN/onia-vigia-aprobaciones.sh"
# Renovar la sesion OAuth de Higgsfield desde un VPS sin navegador (2026-09-03:
# el servidor la revoco sin que venciera; el CLI solo sabe abrir un navegador).
# Reinicio del gateway de Hermes con SUS comandos (gateway stop / run), nunca
# pkill: el 2026-09-03 pkill dejaba vivo al supervisor de Hermes, que relanzaba
# al hijo -> "Gateway (re)started 6 times in 120s", dos instancias peleando.
poner "$FUENTE/hermes-gateway-restart.sh"  "$DESTINO_BIN/hermes-gateway-restart.sh"
poner "$FUENTE/hf-login-start.sh"          "$DESTINO_BIN/hf-login-start.sh"
poner "$FUENTE/hf-login-finish.sh"         "$DESTINO_BIN/hf-login-finish.sh"

# El runbook de deploy de la LANDING (onia.com.bo). Vivia solo en
# /opt/onia-landing/_deploy: build-and-stage.sh sin versionar, y
# swap-and-verify.sh con el bit de ejecucion perdido ("Permission denied" el
# 2026-09-03, a mitad de un deploy). `poner` hace bash -n y chmod 755 en cada
# copia: un runbook que no se puede ejecutar no vuelve a pasar en silencio.
if [ -d /opt/onia-landing/_deploy ]; then
  poner "$REPO/hermes-content/deploy/onia-landing/build-and-stage.sh"  /opt/onia-landing/_deploy/build-and-stage.sh
  poner "$REPO/hermes-content/deploy/onia-landing/swap-and-verify.sh"  /opt/onia-landing/_deploy/swap-and-verify.sh
fi

# El runbook de deploy de la PLATAFORMA (app.onia.com.bo). Mismo agujero que la
# landing, en la mitad de al lado: deploy-gates-swap.sh estaba scripteado y el
# BUILD no. Habia un build-<sha>.sh suelto por deploy (copias identicas salvo el
# sha) y el deploy del 2026-09-03 se hizo entero a mano, sin dejar script. Un
# paso a mano en el medio de la cadena es por que un commit verde pasa dias sin
# llegar al cliente. deploy-gates-swap.sh NO se sincroniza: sigue siendo el
# unico paso que pide OK de Sergio, y se edita en el VPS a proposito.
if [ -d /opt/onia-platform ]; then
  poner "$REPO/hermes-content/deploy/onia-platform/build-and-stage.sh"    /opt/onia-platform/build-and-stage.sh
  poner "$REPO/hermes-content/deploy/onia-platform/recreate-container.sh" /opt/onia-platform/recreate-container.sh
fi

mkdir -p "$DESTINO_BIN/loops"
# La misma guarda que el corredor, para los prompts. Medido el 2026-09-03 a las
# 12:04: la guarda de arriba salvo onia-loop.sh, y en la MISMA corrida el sync
# piso los 15 prompts con la version de main, que no tenia el bloque de memoria
# compartida — los loops seguian recibiendo la memoria (la inyecta el runner)
# pero perdieron las instrucciones de como ESCRIBIRLE. Un prompt desplegado que
# sabe algo que el de main no sabe, no se reemplaza.
MARCA_PROMPT="MEMORIA COMPARTIDA — la leés al arrancar"
RECHAZADOS_PROMPT=0
for f in "$FUENTE"/prompts/*.md; do
  [ -f "$f" ] || continue
  dest="$DESTINO_BIN/loops/$(basename "$f")"
  if grep -q "$MARCA_PROMPT" "$dest" 2>/dev/null && ! grep -q "$MARCA_PROMPT" "$f" 2>/dev/null; then
    RECHAZADOS_PROMPT=$((RECHAZADOS_PROMPT + 1))
    continue
  fi
  poner "$f" "$dest"
done
[ "$RECHAZADOS_PROMPT" -gt 0 ] && log "RECHAZADOS $RECHAZADOS_PROMPT prompt(s): main esta ATRAS del VPS (sin '$MARCA_PROMPT') — se espera al integrador"

# Un prompt que quedo en /root/bin/loops y ya no existe en el repo es un loop
# borrado a medias: el corredor lo seguiria encontrando. Se avisa, no se borra
# solo — borrar sin que nadie mire es como se pierden cosas.
for f in "$DESTINO_BIN"/loops/*.md; do
  [ -f "$f" ] || continue
  n=$(basename "$f")
  [ -f "$FUENTE/prompts/$n" ] || log "aviso: $n esta desplegado y NO existe en el repo — sobra o falta commitear"
done

if [ "$CAMBIOS" -gt 0 ]; then
  log "sincronizados $CAMBIOS archivo(s) desde main"
  "$TG" "🔄 <b>Loops</b>: $CAMBIOS archivo(s) desplegados desde <code>main</code> en el VPS" >/dev/null 2>&1 || true
fi
exit 0
