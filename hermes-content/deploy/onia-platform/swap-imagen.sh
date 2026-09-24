#!/usr/bin/env bash
# Publica en app.onia.com.bo una imagen YA armada por build-and-stage.sh:
# canario -> swap -> verificacion contra lo vivo -> rollback automatico.
#
# Es la receta del 2026-09-24 (canary-start.sh + swap.sh de ese dia, probados en
# produccion) vuelta un solo guion que no nombra un sha a mano. Reemplaza a
# deploy-gates-swap.sh, que copiaba un standalone a runtime-next/ y reiniciaba un
# node:20: desde ese dia produccion es una imagen sin bind mount y ese rsync ya no
# llega a nada.
#
# El viejo NUNCA se borra: se RENOMBRA a onia-platform-prev-<build8>-<fecha>. El
# rollback es renombrarlo de vuelta y arrancarlo, y cuesta cero. Se guardan los 2
# prev mas nuevos.
#
# Uso:
#   swap-imagen.sh <sha|ref> [--dry-run]   publica onia-platform:release-<sha8>
#   swap-imagen.sh --recrear [--dry-run]   recrea con la MISMA imagen que corre
#                                          (lo llama recreate-container.sh)
# Salidas: 0 publicado y verificado (o ya corria) · 1 no publicado: produccion
#          intacta o restaurada sola · 2 se llamo mal.
set -uo pipefail

REPO=${ONIA_PLATFORM_REPO:-/root/loops/onia-platform}
BASE=${ONIA_PLATFORM_BASE:-/opt/onia-platform}
ENVFILE=${ONIA_PLATFORM_ENV:-$BASE/app.env}
LOCK=${ONIA_DEPLOY_LOCK:-$BASE/.deploy.lock}
URL=${ONIA_PLATFORM_URL:-https://app.onia.com.bo}
PAUSA=${ONIA_SWAP_PAUSA:-1}          # segundos entre reintentos (los tests usan 0)
NAME=onia-platform
RED_PRINCIPAL=supabase_default                       # donde viven auth, db y kong
REDES_EXTRA=(easypanel dentalgest-staging-supabase_default)
CANARIO_PUERTO=127.0.0.1:3101                        # loopback: Traefik no lo ve
PREV_A_GUARDAR=2
IMAGENES_A_GUARDAR=3

REF=""; DRY=""; RECREAR=""
for a in "$@"; do
  case "$a" in
    --dry-run) DRY=1 ;;
    --recrear) RECREAR=1 ;;
    -*) echo "uso: swap-imagen.sh <sha|ref> | --recrear  [--dry-run]" >&2; exit 2 ;;
    *) REF=$a ;;
  esac
done
[ -n "$RECREAR$REF" ] || { echo "uso: swap-imagen.sh <sha|ref> | --recrear  [--dry-run]" >&2; exit 2; }

say()   { echo "[$(date -u +%H:%M:%S)] $*"; }
fatal() { say "FATAL: $*"; exit 1; }

[ -r "$ENVFILE" ] || fatal "no puedo leer $ENVFILE"

# ── que imagen ──────────────────────────────────────────────────────────────
if [ -n "$RECREAR" ]; then
  # Recrear NUNCA vuelve a node:20 + runtime-next: se usa la imagen EXACTA que
  # corre (su id), con su etiqueta si todavia apunta a ella, para que el medidor
  # siga leyendo el sha en el nombre.
  IMG=$(docker inspect --format '{{.Image}}' "$NAME" 2>/dev/null) || fatal "no puedo leer la imagen de $NAME"
  [ -n "$IMG" ] || fatal "no puedo leer la imagen de $NAME"
  MONTAJES=$(docker inspect --format '{{range .Mounts}}{{.Destination}} {{end}}' "$NAME" 2>/dev/null)
  case " $MONTAJES " in *" /app "*)
    fatal "$NAME monta /app (receta vieja runtime-next): recrearlo sin el bind lo dejaria vacio. Publica una imagen con swap-imagen.sh <sha>." ;;
  esac
  ETIQUETA=$(docker inspect --format '{{.Config.Image}}' "$NAME" 2>/dev/null)
  [ -n "$ETIQUETA" ] && [ "$(docker image inspect --format '{{.Id}}' "$ETIQUETA" 2>/dev/null)" = "$IMG" ] && IMG=$ETIQUETA
  SUFIJO=recrear
else
  SHA=$(git -C "$REPO" rev-parse --verify --quiet "$REF^{commit}") || fatal "ref desconocida: $REF"
  IMG=$NAME:release-${SHA:0:8}
  SUFIJO=${SHA:0:8}
fi
docker image inspect "$IMG" >/dev/null 2>&1 || fatal "no existe la imagen $IMG (¿corrio build-and-stage.sh?)"

NEW_BUILD=$(docker run --rm --network none --entrypoint cat "$IMG" /app/.next/BUILD_ID 2>/dev/null | tr -d '[:space:]')
[ -n "$NEW_BUILD" ] || fatal "la imagen $IMG no tiene BUILD_ID"
OLD_BUILD=$(docker exec "$NAME" cat /app/.next/BUILD_ID 2>/dev/null | tr -d '[:space:]')
if [ -n "$RECREAR" ]; then
  # Parado o roto: igual se puede recrear, y la imagen es la misma por construccion.
  OLD_BUILD=${OLD_BUILD:-$NEW_BUILD}
  [ "$OLD_BUILD" = "$NEW_BUILD" ] || fatal "el vivo sirve $OLD_BUILD y la imagen $IMG trae $NEW_BUILD: no es la misma"
else
  [ -n "$OLD_BUILD" ] || fatal "no puedo leer el BUILD_ID vivo de $NAME: no publico a ciegas"
  if [ "$OLD_BUILD" = "$NEW_BUILD" ]; then say "YA CORRE $IMG (build $NEW_BUILD): nada que publicar"; exit 0; fi
fi

PREV=$NAME-prev-${OLD_BUILD:0:8}-$(date +%Y%m%d-%H%M%S)
CANARIO=$NAME-canary-$SUFIJO
docker ps -a --format '{{.Names}}' | grep -qx "$PREV" && fatal "ya existe $PREV"

if [ -n "$DRY" ]; then
  cat <<FIN
[dry-run] imagen: $IMG (build $NEW_BUILD) · vivo: build $OLD_BUILD
[dry-run] canario: docker create --name $CANARIO --env-file $ENVFILE -p $CANARIO_PUERTO:3000 --network $RED_PRINCIPAL $IMG (sin easypanel)
[dry-run]   smoke sin sesion: http://$CANARIO_PUERTO/login 200 con el formulario y el build $NEW_BUILD · nc auth/db/kong
[dry-run] swap: docker stop $NAME · docker rename $NAME $PREV
[dry-run]   docker run -d --name $NAME --env-file $ENVFILE --network $RED_PRINCIPAL --restart unless-stopped $IMG
[dry-run]   docker network connect ${REDES_EXTRA[*]}
[dry-run] verificaria: listo, nc auth/db/kong, BUILD_ID $NEW_BUILD, $URL/login sirve $NEW_BUILD con el formulario
[dry-run]   cualquier falla -> rollback automatico a $PREV
[dry-run] produccion NO se toco.
FIN
  exit 0
fi

# ── desde aca se toca el VPS: un deploy a la vez ─────────────────────────────
command -v flock >/dev/null || fatal "no hay flock: sin cerrojo no publico"
exec 8>"$LOCK" || fatal "no puedo abrir el cerrojo $LOCK"
flock -n 8 || fatal "otro build o swap tiene el cerrojo ($LOCK)"

# Los canarios se llaman asi y nunca son produccion: uno viejo retiene el nombre o
# el puerto. Se barren al entrar y al salir, por cualquier camino.
barrer_canarios() {
  docker ps -a --format '{{.Names}}' | grep '^onia-platform-canary-' | while read -r c; do
    docker rm -f "$c" >/dev/null 2>&1
  done
}
trap barrer_canarios EXIT
barrer_canarios

# ── [1/4] canario: la imagen nueva contra la base de produccion, SIN ruta ────
# Otro nombre, sin la red easypanel (Traefik no lo enruta) y puerto solo en
# loopback. Si no levanta aca, produccion ni se entera.
say "canario $CANARIO en $CANARIO_PUERTO"
docker create --name "$CANARIO" --env-file "$ENVFILE" -p "$CANARIO_PUERTO:3000" \
  --restart no --network "$RED_PRINCIPAL" "$IMG" >/dev/null || fatal "no pude crear el canario"
for r in "${REDES_EXTRA[@]}"; do
  [ "$r" = easypanel ] && continue
  docker network connect "$r" "$CANARIO" || fatal "no pude conectar el canario a $r"
done
docker start "$CANARIO" >/dev/null || fatal "el canario no arranca"
CUERPO=$(mktemp)
CODIGO=""
for _ in $(seq 1 60); do
  CODIGO=$(curl -s -o "$CUERPO" -w '%{http_code}' --max-time 5 "http://$CANARIO_PUERTO/login" || true)
  [ "$CODIGO" = 200 ] && break
  sleep "$PAUSA"
done
[ "$CODIGO" = 200 ] || { rm -f "$CUERPO"; fatal "canario: /login devolvio ${CODIGO:-nada}. Produccion intacta."; }
grep -q 'Iniciar sesi' "$CUERPO" || { rm -f "$CUERPO"; fatal "canario: /login sin el formulario. Produccion intacta."; }
grep -qF "$NEW_BUILD" "$CUERPO" || { rm -f "$CUERPO"; fatal "canario: /login no sirve el build $NEW_BUILD. Produccion intacta."; }
rm -f "$CUERPO"
docker exec "$CANARIO" sh -c 'nc -z auth 9999 && nc -z db 54329 && nc -z kong 8000' \
  || fatal "canario: no llega a auth/db/kong. Produccion intacta."
say "canario ok: login 200 con formulario, build $NEW_BUILD, auth/db/kong"
docker stop "$CANARIO" >/dev/null 2>&1   # libera RAM antes del swap; el trap lo borra

# ── [2/4] swap ──────────────────────────────────────────────────────────────
say "stop + rename $NAME -> $PREV"
docker stop "$NAME" >/dev/null || fatal "no pude parar $NAME"
if ! docker rename "$NAME" "$PREV"; then
  docker start "$NAME" >/dev/null
  fatal "no pude renombrar; arranque el vivo de nuevo"
fi
rollback() {
  say "!! ROLLBACK: $1"
  docker rm -f "$NAME" >/dev/null 2>&1
  docker rename "$PREV" "$NAME" && docker start "$NAME" >/dev/null \
    && say "produccion restaurada desde $PREV (build $OLD_BUILD)"
  exit 1
}
say "run $IMG"
docker run -d --name "$NAME" --env-file "$ENVFILE" --network "$RED_PRINCIPAL" \
  --restart unless-stopped "$IMG" >/dev/null || rollback "docker run fallo"
for r in "${REDES_EXTRA[@]}"; do
  docker network connect "$r" "$NAME" || rollback "no pude conectar la red $r"
done

# ── [3/4] verificar: adentro, y despues contra lo que ve el cliente ──────────
LISTO=""
for _ in $(seq 1 40); do
  docker exec "$NAME" wget -q -O /dev/null http://127.0.0.1:3000/login 2>/dev/null && { LISTO=1; break; }
  sleep "$PAUSA"
done
[ -n "$LISTO" ] || rollback "la app no respondio en 40 intentos"
for destino in auth:9999 db:54329 kong:8000; do
  docker exec "$NAME" nc -z "${destino%:*}" "${destino#*:}" || rollback "no llega a $destino"
done
[ "$(docker exec "$NAME" cat /app/.next/BUILD_ID 2>/dev/null | tr -d '[:space:]')" = "$NEW_BUILD" ] \
  || rollback "el contenedor nuevo no sirve el build $NEW_BUILD"
PUBLICO=""
for _ in $(seq 1 20); do
  CUERPO_PUB=$(curl -s --max-time 15 "$URL/login?cb=$(date +%s)" || true)
  case "$CUERPO_PUB" in *"$NEW_BUILD"*) PUBLICO=1; break ;; esac
  sleep "$((PAUSA * 2))"
done
[ -n "$PUBLICO" ] || rollback "$URL/login no sirve el build $NEW_BUILD"
case "$CUERPO_PUB" in *"Iniciar sesi"*) ;; *) rollback "$URL/login sin el formulario" ;; esac
say "SWAP OK — $IMG (build $NEW_BUILD) en $URL; rollback guardado como $PREV"

# ── [4/4] limpiar: 2 prev y 3 imagenes de release ───────────────────────────
# `docker ps -a` lista del mas nuevo al mas viejo. Un prev se creo cuando esa
# version salio en vivo, asi que los primeros son los rollbacks mas recientes.
docker ps -a --format '{{.Names}}' | grep '^onia-platform-prev-' | tail -n +$((PREV_A_GUARDAR + 1)) \
  | while read -r c; do docker rm "$c" >/dev/null 2>&1 && say "prev viejo borrado: $c"; done
# Sin -f: docker se niega a borrar una imagen que usa CUALQUIER contenedor (el
# vivo o un prev parado), asi que esto nunca le quita el piso a un rollback. Sin
# esta poda el disco cae bajo los 20 GB y build-and-stage.sh deja de armar.
docker images --format '{{.Repository}}:{{.Tag}}' "$NAME" | grep ':release-' | tail -n +$((IMAGENES_A_GUARDAR + 1)) \
  | while read -r i; do docker image rm "$i" >/dev/null 2>&1 && say "imagen vieja borrada: $i"; done
exit 0
