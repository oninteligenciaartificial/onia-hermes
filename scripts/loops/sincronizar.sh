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

# 🔴 GUARDA: `main` NO puede apagar un loop que el cron sigue llamando.
#
# Nace del 2026-09-02 20:32 UTC, medido por el loop supervisor. Este script copia
# el corredor DESDE main, siempre, en una direccion sola. Ese dia main estaba CINCO
# commits atras (los `case` de supervisor, web-factory-dev, recorrido-cliente,
# tendencias y calidad-generado vivian solo en `claude/git-status-935f47`, sin
# mergear) mientras los cinco ya tenian linea de cron, prompt en disco y worktree
# vivo. La corrida de las :44 los habria borrado del corredor sin decir una palabra,
# y cada uno habria muerto en el `*)` con exit 64 — cinco carriles apagados por un
# merge que faltaba, no por una decision de nadie.
#
# `loops.md` ya avisaba del riesgo ("reinstalar desde el repo habria bajado el modelo
# de todos los loops y borrado dos carriles") y anotaba lo que faltaba: que el propio
# corredor avise de la diferencia, como ya hace con los prompts. Esto es eso.
#
# El criterio NO es "main nunca puede sacar un case" — retirar un loop tiene que
# seguir siendo posible. Es: **si el cron lo sigue llamando, sacarle el case lo mata**.
# Un loop retirado de verdad se saca primero del crontab; entonces esta guarda lo deja
# pasar sola. Asi la unica cosa que bloquea es la unica que rompe.
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

if [ -n "$PERDIDOS" ]; then
  log "RECHAZADO: el corredor de main no conoce a$PERDIDOS, y el cron los sigue llamando — dejo el desplegado"
  "$TG" "🔴 <b>Sync de loops frenado</b>: el corredor de <code>main</code> no conoce a <code>$(echo "$PERDIDOS" | sed 's/^ //; s/ /<\/code>, <code>/g')</code>, pero el cron los llama igual. Los habria matado con exit 64. Falta mergear su rama a main; mientras tanto dejo el corredor que anda." >/dev/null 2>&1 || true
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

# El lector de Telegram, por la misma razon que el tablero: es una herramienta del
# VPS, no un archivo de carril. Si no se despliega solo, es el unico camino de
# ENTRADA de Sergio y solo se actualiza a mano — justo lo contrario de lo que
# existe para lograr (que pueda apagar la laptop).
poner "$REPO/scripts/kanban/telegram-entrada.py" "$DESTINO_BIN/onia-tg-entrada.py"

mkdir -p "$DESTINO_BIN/loops"
for f in "$FUENTE"/prompts/*.md; do
  [ -f "$f" ] || continue
  poner "$f" "$DESTINO_BIN/loops/$(basename "$f")"
done

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
