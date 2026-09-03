#!/usr/bin/env bash
# ONIA — DEPLOY del bot: del repo a /opt/onia/bot.
#
# EL PROBLEMA QUE RESUELVE: el bot vivo corre los archivos de /opt/onia/bot, que se copiaron a
# mano. Commitear NO despliega. Nadie escribio nunca este paso, asi que cada arreglo dependia de
# que alguien se acordara del `cp` — y el 2026-09-03 el integrador midio SEIS archivos derivados,
# no los dos que la tarea nombraba: config.mjs, reply-builder.mjs (el motor de respuestas),
# knowledge.test.mjs, rescate-run.test.mjs, mas config.test.mjs y knowledge.onia.json que ni
# existian en produccion. El mas caro salia a la cara del cliente del cliente: "fuera de horario
# de oficina. la encargada te confirma", con el cargo en minuscula a mitad de frase.
#
# POR QUE NO ES UN `rsync -a --delete`: en /opt/onia/bot viven archivos que NO estan en git y que
# el bot necesita — `knowledge.json` (el conocimiento cargado) y `webhook.env` (los secretos).
# Un espejo ciego los borra y deja el bot sin base y sin credenciales. Por eso se copia por lista
# blanca desde el repo, nunca al reves, y nunca se borra nada del destino.
#
# POR QUE ES DRY-RUN POR DEFECTO: desplegar el bot lo ve un cliente real en la respuesta
# siguiente, y `CLAUDE.md` exige OK explicito de Sergio para tocar produccion. Sin `--aplicar`
# este script solo MIDE y muestra; no puede desplegar por accidente ni por un dedo torcido.
#
#   ./deploy-bot.sh              # que cambiaria (no toca nada)
#   ./deploy-bot.sh --aplicar    # despliega, con backup y reinicio verificado
#
set -uo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="${ONIA_BOT_DEST:-/opt/onia/bot}"
APLICAR=0
[ "${1:-}" = "--aplicar" ] && APLICAR=1

# Lista blanca: el codigo y los datos de ejemplo que SI vienen del repo. Todo lo que no este
# aca se queda como esta en produccion — es la unica proteccion de knowledge.json y webhook.env.
PATRONES=("*.mjs" "*.sh" "knowledge.example.json" "knowledge.onia.json" "plantillas-humo.json")

echo "== deploy del bot =="
echo "   repo:   $REPO_DIR"
echo "   destino: $DEST"
[ "$APLICAR" = 1 ] || echo "   modo:   DRY-RUN (agrega --aplicar para desplegar de verdad)"

[ -d "$DEST" ] || { echo "ERROR: no existe $DEST" >&2; exit 1; }

# --- 1. El gate. Un bot roto desplegado es peor que un bot viejo -------------------------------
echo
echo "-- gate: node --test sobre el arbol del repo"
if ! ( cd "$REPO_DIR" && node --test >/tmp/deploy-bot-test.log 2>&1 ); then
  echo "ERROR: los tests del bot NO pasan. No se despliega." >&2
  tail -n 20 /tmp/deploy-bot-test.log >&2
  exit 1
fi
echo "   $(grep -E '^# (pass|fail)' /tmp/deploy-bot-test.log | tr '\n' ' ')"

# --- 2. Que cambiaria ------------------------------------------------------------------------
echo
echo "-- diferencias repo -> produccion"
CAMBIOS=()
cd "$REPO_DIR" || exit 1
for patron in "${PATRONES[@]}"; do
  for f in $patron; do
    [ -f "$f" ] || continue
    if [ ! -e "$DEST/$f" ]; then
      echo "   NUEVO    $f"
      CAMBIOS+=("$f")
    elif ! cmp -s "$f" "$DEST/$f"; then
      echo "   CAMBIA   $f  ($(diff "$DEST/$f" "$f" | grep -c '^[<>]') lineas)"
      CAMBIOS+=("$f")
    fi
  done
done

if [ "${#CAMBIOS[@]}" -eq 0 ]; then
  echo "   (nada que desplegar: produccion ya coincide con el repo)"
  exit 0
fi
echo "   total: ${#CAMBIOS[@]} archivo(s)"

if [ "$APLICAR" != 1 ]; then
  echo
  echo "DRY-RUN: no se toco nada. Para desplegar: $0 --aplicar"
  exit 0
fi

# --- 3. Backup de lo que se va a pisar --------------------------------------------------------
SELLO="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP="$DEST/backups/deploy-$SELLO"
mkdir -p "$BACKUP" || exit 1
echo
echo "-- backup en $BACKUP"
for f in "${CAMBIOS[@]}"; do
  [ -e "$DEST/$f" ] && cp -p "$DEST/$f" "$BACKUP/$f"
done

# --- 4. Copiar ------------------------------------------------------------------------------
echo "-- copiando"
for f in "${CAMBIOS[@]}"; do
  cp -p "$f" "$DEST/$f" || { echo "ERROR copiando $f" >&2; exit 1; }
  echo "   ok  $f"
done

# --- 5. Reiniciar. webhook-server.sh es el que sincroniza /opt/onia/bot hacia el contenedor ----
echo
echo "-- reinicio del webhook"
if ! "$DEST/webhook-server.sh" restart; then
  echo "ERROR: el reinicio fallo. Los archivos viejos estan en $BACKUP" >&2
  exit 1
fi

# --- 6. Verificar que quedo vivo. El PID puede existir con el puerto mudo ----------------------
echo
echo "-- /health"
if ! "$DEST/webhook-server.sh" health; then
  echo "ERROR: el bot no responde tras el deploy. Backup en $BACKUP" >&2
  exit 1
fi

echo
echo "OK: ${#CAMBIOS[@]} archivo(s) desplegados y el bot responde. Backup: $BACKUP"
