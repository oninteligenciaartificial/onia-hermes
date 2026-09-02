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

poner "$FUENTE/onia-loop.sh" "$DESTINO_BIN/onia-loop.sh"
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
  /root/bin/onia-tg.sh "🔄 <b>Loops</b>: $CAMBIOS archivo(s) desplegados desde <code>main</code> en el VPS" >/dev/null 2>&1 || true
fi
exit 0
