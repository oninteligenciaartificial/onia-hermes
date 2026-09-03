#!/usr/bin/env bash
# ONIA — respalda la memoria VIVA de Hermes, sin pisarla.
#
# POR QUE EXISTE, y por que NO es un sincronizador al reves:
#
# Hermes tiene la memoria integrada encendida (`memory status` -> injection ✓,
# user profile ✓, memory tool ✓) y lee dos archivos en /root/.hermes/memories/:
# MEMORY.md (lo que sabe del negocio) y USER.md (lo que aprendio de Sergio).
# Hasta el 2026-09-03 MEMORY.md NO EXISTIA: el mecanismo estaba prendido y el
# archivo vacio, asi que cada corrida arrancaba sin nada. Por eso Hermes no
# mejoraba — no era malo, no tenia donde guardar lo aprendido.
#
# 🔴 Y por eso este script COPIA HACIA AFUERA, nunca hacia adentro. La semilla
# vive en el repo (hermes-content/deploy/hermes-agent/MEMORY.md), pero el archivo
# VIVO es el del VPS, porque Hermes escribe en el: `memory tool: enabled` le
# permite agregar lo que aprende. Un sincronizador que copiara del repo al VPS
# —como hace onia-loops-sync.sh con los prompts— le BORRARIA todo lo aprendido en
# cada vuelta, que es exactamente el problema que la memoria vino a resolver.
#
# Se guarda una copia con fecha sólo cuando el contenido CAMBIO. Si Hermes no
# aprendio nada nuevo, no se escribe un archivo identico mas.
set -uo pipefail

ORIGEN="/root/.hermes/memories"
DESTINO="/root/backups/hermes-memory"
RETENER=30   # copias por archivo; a ~1 cambio por dia son unos 30 dias

mkdir -p "$DESTINO" || exit 1
SELLO="$(date -u '+%Y%m%dT%H%M%SZ')"
CAMBIOS=0

for f in "$ORIGEN"/MEMORY.md "$ORIGEN"/USER.md; do
  [ -f "$f" ] || continue
  n=$(basename "$f" .md)
  ULTIMA=$(ls -1t "$DESTINO/$n"-*.md 2>/dev/null | head -1)
  # Sin cambios respecto de la ultima copia: no se guarda nada.
  if [ -n "$ULTIMA" ] && cmp -s "$f" "$ULTIMA"; then continue; fi
  cp -a "$f" "$DESTINO/$n-$SELLO.md" && chmod 600 "$DESTINO/$n-$SELLO.md"
  CAMBIOS=$((CAMBIOS + 1))
  echo "respaldado $n ($(wc -c < "$f") bytes)"
  # Rotacion: se conservan las ultimas $RETENER de cada archivo.
  ls -1t "$DESTINO/$n"-*.md 2>/dev/null | tail -n +$((RETENER + 1)) | xargs -r rm -f
done

# Guarda contra el modo de falla mas silencioso que tiene esto: que MEMORY.md
# desaparezca o quede vacio y nadie se entere hasta que Hermes vuelva a decir
# pavadas. Un archivo de memoria de 0 bytes se ve igual que uno que anda.
if [ ! -s "$ORIGEN/MEMORY.md" ]; then
  ULTIMA=$(ls -1t "$DESTINO/MEMORY"-*.md 2>/dev/null | head -1)
  /root/bin/onia-tg.sh "🔴 <b>La memoria de Hermes desaparecio</b>
<code>$ORIGEN/MEMORY.md</code> no existe o esta vacio: Hermes vuelve a arrancar cada corrida sin saber nada de Onia.
Ultima copia buena: <code>${ULTIMA:-NINGUNA}</code>" >/dev/null 2>&1 || true
  echo "ALERTA: MEMORY.md vacio o ausente"
  exit 1
fi

[ "$CAMBIOS" -gt 0 ] && echo "$CAMBIOS archivo(s) con cambios respaldados"
exit 0
