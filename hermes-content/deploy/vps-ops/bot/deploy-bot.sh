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

# --- 4.bis Limpiar el arbol DENTRO del contenedor antes de re-sincronizar ---------------------
#
# Los 8 scripts de runtime (webhook-server, chatwoot-adapter, run-turn y los cuatro *-run.sh)
# sincronizan con `mkdir -p` + `docker cp "$BOT_DIR/." ...`, que copia ENCIMA y no borra lo que
# ya no existe en el repo. Eso es a proposito: cualquiera de ellos puede arrancar mientras otro
# esta copiando —los crons se solapan (:17, :32, :47, cada 30 min) y el watchdog reinicia cada
# 2 minutos— y la version con `rm -rf` abria una ventana en la que el segundo `docker cp` veia
# el destino ya creado y metia la carpeta ADENTRO (/tmp/onia-bot/bot/). Eso mato al bot dos dias
# enteros, del 19-sep 19:00 UTC al 21-sep 19:34, con el .stamp mintiendo que estaba sincronizado.
#
# El costo de no borrar es que un archivo renombrado deja su version vieja en el contenedor.
# Es inofensivo mientras nadie la importe, pero no queremos que se acumule para siempre: la
# limpieza va ACA, en el deploy explicito, que lo corre una persona y no compite con ningun cron.
# Borrar tambien se lleva el .stamp, asi que el restart de abajo re-copia todo de cero.
CONTENEDOR="${ONIA_BOT_CONTAINER:-onia-center}"
CONTENEDOR_DEST="${ONIA_BOT_CONTENEDOR_DEST:-/tmp/onia-bot}"
echo
echo "-- limpiando el arbol del contenedor ($CONTENEDOR:$CONTENEDOR_DEST)"
if docker ps --format '{{.Names}}' | grep -qx "$CONTENEDOR"; then
  docker exec "$CONTENEDOR" rm -rf "$CONTENEDOR_DEST" >/dev/null 2>&1     && echo "   ok  borrado; el restart lo re-sincroniza de cero"     || echo "   AVISO: no se pudo borrar $CONTENEDOR_DEST (sigo igual: el sync copia encima)"
else
  echo "   AVISO: el contenedor $CONTENEDOR no esta corriendo — me salteo la limpieza"
fi

# --- 5. Reiniciar. webhook-server.sh es el que sincroniza /opt/onia/bot hacia el contenedor ----
echo
echo "-- reinicio del webhook"
if ! "$DEST/webhook-server.sh" restart; then
  echo "ERROR: el reinicio fallo. Los archivos viejos estan en $BACKUP" >&2
  exit 1
fi

# --- 6. Verificar que quedo vivo. El PID puede existir con el puerto mudo ----------------------
#
# SE MIRA EL JSON, NO EL CODIGO DE SALIDA, y las dos mitades de eso costaron un susto el
# 2026-09-04: aca decia `if ! "$DEST/webhook-server.sh" health`, y `health` no existe
# (los subcomandos son start|stop|restart|status|logs|knowledge). El script imprimia la
# linea de uso y cantaba "el bot no responde tras el deploy" sobre un bot sano, con el
# backup en pantalla invitando a revertir un deploy bueno.
#
# Y cambiarlo por `status` a secas tampoco sirve: `status` hace `wget ... || echo
# '{"ok":false}'` y termina en `exit 0` SIEMPRE, asi que un `if !` sobre el no puede
# ponerse rojo nunca — falla ABIERTO. La salud esta en el cuerpo de la respuesta.
echo
echo "-- /health"
SALUD="$("$DEST/webhook-server.sh" status 2>&1)"
echo "$SALUD"
if ! printf '%s' "$SALUD" | grep -q '"ok":true'; then
  echo "ERROR: el bot no responde tras el deploy. Backup en $BACKUP" >&2
  exit 1
fi

# --- 7. Aplicar el CONOCIMIENTO. Desplegar el codigo NO alcanza -------------------------------
#
# `knowledge.onia.json` esta en git y viaja con la copia de arriba, pero el archivo que el bot LEE
# es `knowledge.json`, y pasar de uno al otro era un SEGUNDO comando a mano. Nadie lo corria.
#
# Medido el 2026-09-12 en /opt/onia/bot: la fuente era del 6-sep y el conocimiento vivo del 4-sep.
# Seis dias contestandole a desconocidos que la facturacion en linea es obligatoria "desde el 30
# de septiembre" -la fecha que CLAUDE.md prohibe por nombre- teniendo la correccion ("1 de octubre
# de 2026, RND 102600000007") en el mismo directorio. Es la misma causa que dejo el conocimiento
# de agosto sin precios, y la que hizo que la escalera C barriera landing y plataforma y dejara al
# bot cotizando Bs 750 y Bs 1.500.
#
# VA DESPUES DEL /health a proposito: el subcomando entra al contenedor por `docker cp`, asi que
# corrido sobre un bot caido falla con un error que no es el de fondo y manda a diagnosticar mal.
#
# CORTAR EN ROJO ACA ES SEGURO: la compuerta de publicacion vive en webhook-server.sh, que valida
# adentro del contenedor y, si el archivo esta mal, NO lo aplica y el bot sigue con lo anterior.
echo
echo "-- conocimiento"
if ! ONIA_BOT_KNOWLEDGE_FILE="$DEST/knowledge.onia.json" "$DEST/webhook-server.sh" knowledge; then
  echo "ERROR: el codigo se desplego pero el CONOCIMIENTO no." >&2
  echo "       El bot responde, con el texto anterior: precios y plazos viejos. Backup: $BACKUP" >&2
  exit 1
fi

echo
echo "OK: ${#CAMBIOS[@]} archivo(s) desplegados, conocimiento aplicado y el bot responde. Backup: $BACKUP"
