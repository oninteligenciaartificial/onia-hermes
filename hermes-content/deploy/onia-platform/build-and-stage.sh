#!/usr/bin/env bash
# Build de onia-platform (app.onia.com.bo) como IMAGEN Docker autocontenida, dejada
# STAGED en /opt/onia-platform/releases/<sha8>-<yyyymmdd>/ SIN tocar produccion.
# El swap es el paso siguiente y vive aparte: swap-imagen.sh <sha>.
#
# POR QUE IMAGEN. Hasta el 2026-09-24 esto compilaba en el HOST dentro de
# build-<sha>/ y el swap copiaba el standalone a runtime-next/, montado en un
# node:20-alpine. Ese dia produccion paso a `onia-platform:release-7bcd0a83`
# (Node 22, usuario nextjs, WORKDIR /app, sin bind mount) y Sergio Urcullo decidio
# que esta es la UNICA receta de deploy desde ahora. La receta vieja quedo con dos
# trampas: el publicador salia cerrado para siempre ("BUILD_ID vivo sin par en
# disco") y recreate-container.sh habria devuelto produccion al build del 19-sep.
#
# Lo que el release deja, y quien lo lee:
#   SHA          el commit entero                 -> deploy-vivo.mjs (que sha corre)
#   BUILD_ID     se escribe AL FINAL, tras gates  -> deploy-vivo.mjs (staged integro)
#   source.tar.gz, src/, build.log, build.exit    -> diagnostico (claude-guardia)
#
# Uso:  build-and-stage.sh <sha|ref> [--dry-run]     (default: origin/master)
# Sale 0 solo si la imagen quedo armada y paso TODOS los gates (o si el seco no
# encontro nada que lo frene). Sale 1 si no se armo, 2 si se llamo mal.
say()   { echo "[$(date -u +%H:%M:%S)] $*"; }
fatal() { echo "FATAL: $*"; exit 1; }

esperar_otro_build() {
  local espera=${ONIA_BUILD_ESPERA_SEG:-1200} intervalo=${ONIA_BUILD_INTERVALO_SEG:-30}
  local inicio=$SECONDS transcurrido siguiente_log=0 pausa
  [[ "$espera" =~ ^[1-9][0-9]{0,8}$ && "$intervalo" =~ ^[1-9][0-9]{0,8}$ ]] \
    || fatal "ONIA_BUILD_ESPERA_SEG y ONIA_BUILD_INTERVALO_SEG deben ser segundos enteros positivos (hasta 9 digitos)"
  # ONIA_PS_CMD: SOLO para tests, ruta de un ejecutable que sustituye ps;
  # recibe los mismos argumentos (-eo args). No se evalua como codigo shell.
  while "${ONIA_PS_CMD:-ps}" -eo args 2>/dev/null | grep -E 'next build|npm ci|docker build|docker buildx' | grep -v grep >/dev/null; do
    transcurrido=$((SECONDS - inicio))
    if (( transcurrido >= espera )); then
      fatal "hay otro build corriendo (next build / npm ci / docker build): no encimo otro"
    fi
    if (( transcurrido >= siguiente_log )); then
      say "espero a que termine otro build: $transcurrido s"
      siguiente_log=$(( (transcurrido / 60 + 1) * 60 ))
    fi
    pausa=$intervalo
    (( pausa > espera - transcurrido )) && pausa=$((espera - transcurrido))
    sleep "$pausa" || fatal "no pude esperar al otro build"
  done
}

# Permite probar solo el chequeo con: source build-and-stage.sh; esperar_otro_build
[[ "${BASH_SOURCE[0]}" != "$0" ]] && return 0
set -uo pipefail

REPO=${ONIA_PLATFORM_REPO:-/root/loops/onia-platform}
BASE=${ONIA_PLATFORM_BASE:-/opt/onia-platform}
ENVFILE=${ONIA_PLATFORM_ENV:-$BASE/app.env}
LOCK=${ONIA_DEPLOY_LOCK:-$BASE/.deploy.lock}
MEMINFO=${ONIA_MEMINFO:-/proc/meminfo}
DOCKER_ROOT=${ONIA_DOCKER_ROOT:-/var/lib/docker}
CONTENEDOR=onia-platform
APP_URL=https://app.onia.com.bo
SUPABASE_URL=$APP_URL/supabase
RAM_MIN_GB=6
DISCO_MIN_GB=20

REF=""; DRY=""
for a in "$@"; do
  case "$a" in
    --dry-run) DRY=1 ;;
    -*) echo "uso: build-and-stage.sh <sha|ref> [--dry-run]" >&2; exit 2 ;;
    *) REF=$a ;;
  esac
done
REF=${REF:-origin/master}

[ -d "$BASE" ] || fatal "no existe $BASE"

# ── [1/7] UN build a la vez ─────────────────────────────────────────────────
# Dos builds encimados tumbaron el VPS el 2026-08-22 (load 18, npm de 40 min) y el
# 2026-09-03 uno ajeno dejo un artefacto a medias que otro proceso publico. El
# cerrojo es el MISMO que usa swap-imagen.sh: nadie arma mientras alguien publica.
esperar_otro_build
if [ -z "$DRY" ]; then
  command -v flock >/dev/null || fatal "no hay flock: sin cerrojo no armo"
  exec 8>"$LOCK" || fatal "no puedo abrir el cerrojo $LOCK"
  flock -n 8 || fatal "otro build o swap tiene el cerrojo ($LOCK)"
fi

# ── [2/7] recursos: un next build se come ~5 GB y la imagen ocupa varios ─────
RAM=$(awk '/^MemAvailable:/ { print int($2 / 1048576) }' "$MEMINFO" 2>/dev/null)
[ -n "$RAM" ] || fatal "no pude leer la RAM disponible ($MEMINFO)"
[ "$RAM" -ge "$RAM_MIN_GB" ] || fatal "RAM disponible ${RAM}GB < ${RAM_MIN_GB}GB: un build ahora tumba el VPS"
for d in "$BASE" "$DOCKER_ROOT"; do
  [ -d "$d" ] || continue   # DOCKER_ROOT puede vivir en otro lado; BASE ya se exigio arriba
  LIBRE=$(df -Pk "$d" 2>/dev/null | awk 'NR==2 { print int($4 / 1048576) }')
  [ -n "$LIBRE" ] || fatal "no pude medir el disco libre de $d"
  [ "$LIBRE" -ge "$DISCO_MIN_GB" ] || fatal "disco libre en $d ${LIBRE}GB < ${DISCO_MIN_GB}GB"
done
say "recursos: RAM ${RAM}GB libre, disco ok"

# ── [3/7] que commit ────────────────────────────────────────────────────────
git -C "$REPO" fetch --quiet origin 2>/dev/null || echo "aviso: fetch fallo, uso $REF como esta"
SHA=$(git -C "$REPO" rev-parse --verify --quiet "$REF^{commit}") || fatal "ref desconocida: $REF"
SHA8=${SHA:0:8}
TAG=$CONTENEDOR:release-$SHA8
# Se arma como CANDIDATO y recien tras los gates pasa a release-<sha8>: swap-imagen.sh
# publica cualquier release-<sha8> que exista, asi que esa etiqueta tiene que significar
# "paso los gates". Antes se etiquetaba release primero y una imagen rechazada (QA
# horneado, 127.0.0.1, sin anon key) quedaba lista para un swap a mano.
CAND=$CONTENEDOR:candidato-$SHA8
R=$BASE/releases/$SHA8-$(date +%Y%m%d)

# La imagen que corre produccion no se vuelve a etiquetar encima: el rollback y el
# medidor la nombran por esa etiqueta.
VIVA=$(docker inspect --format '{{.Config.Image}}' "$CONTENEDOR" 2>/dev/null)
[ "$VIVA" = "$TAG" ] && fatal "produccion ya corre $TAG: no hay nada que armar"

# ── [4/7] los valores PUBLICOS, leidos de app.env sin mostrarlos ─────────────
# Solo estos viajan al build: Next los hornea en el bundle del navegador. El
# resto de app.env (service role, claves) entra en RUNTIME por --env-file y nunca
# toca la imagen.
#
# La clave publica de push (2026-09-24): sin ella horneada, "Activar notificaciones
# push" no hace nada y push_subscriptions queda en 0 filas. Tiene que ser la MISMA
# que VAPID_PUBLIC_KEY, con la que firma el servidor: si difieren, cada suscripcion
# nace rota. Si app.env solo trae la del servidor, se usa esa.
#
# Push se exige SOLO si el Dockerfile del commit declara el ARG (la plataforma lo
# acepta desde 617631d5). Un commit anterior se arma como antes: docker ignora un
# build-arg que no declara, no se hornea nada y vapid-no-horneada frenaba TODOS los
# releases del publicador si este guion llegaba al VPS antes que ese merge.
# Y se exigen las TRES del servidor: lib/push.ts no manda nada si falta una, y calla.
[ -r "$ENVFILE" ] || fatal "no puedo leer $ENVFILE"
PUSH=""
git -C "$REPO" show "$SHA:Dockerfile" 2>/dev/null \
  | grep -Eq '^[[:space:]]*ARG[[:space:]]+NEXT_PUBLIC_VAPID_PUBLIC_KEY([[:space:]=]|$)' && PUSH=1
unset NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY NEXT_PUBLIC_APP_URL NEXT_PUBLIC_VAPID_PUBLIC_KEY
VAPID_SERVIDOR=""; VAPID_PRIVADA=""; VAPID_CONTACTO=""
while IFS='=' read -r k v; do
  v=${v%$'\r'}; v=${v#\"}; v=${v%\"}
  case "$k" in
    NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY|NEXT_PUBLIC_APP_URL|NEXT_PUBLIC_VAPID_PUBLIC_KEY) export "$k=$v" ;;
    VAPID_PUBLIC_KEY) VAPID_SERVIDOR=$v ;;
    VAPID_PRIVATE_KEY) VAPID_PRIVADA=$v ;;
    VAPID_CONTACT) VAPID_CONTACTO=$v ;;
  esac
done < "$ENVFILE"
if [ "${NEXT_PUBLIC_APP_URL:-}" != "$APP_URL" ] || [ "${NEXT_PUBLIC_SUPABASE_URL:-}" != "$SUPABASE_URL" ] \
   || [ -z "${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}" ]; then
  # CLAUDE.md: un valor publico equivocado se hornea y le llega al cliente (127.0.0.1).
  fatal "app.env no trae los tres valores publicos esperados (URL $APP_URL, supabase, anon key) — no los muestro"
fi
ARG_PUSH=""
if [ -n "$PUSH" ]; then
  if [ -n "${NEXT_PUBLIC_VAPID_PUBLIC_KEY:-}" ] && [ -n "$VAPID_SERVIDOR" ] \
     && [ "$NEXT_PUBLIC_VAPID_PUBLIC_KEY" != "$VAPID_SERVIDOR" ]; then
    fatal "app.env: NEXT_PUBLIC_VAPID_PUBLIC_KEY y VAPID_PUBLIC_KEY no coinciden — cada suscripcion push naceria rota (no las muestro)"
  fi
  export NEXT_PUBLIC_VAPID_PUBLIC_KEY=${NEXT_PUBLIC_VAPID_PUBLIC_KEY:-$VAPID_SERVIDOR}
  [ -n "$NEXT_PUBLIC_VAPID_PUBLIC_KEY" ] \
    || fatal "app.env no trae la clave publica de push (VAPID_PUBLIC_KEY): sin ella nadie puede activar avisos — no muestro nada"
  FALTA=""
  [ -n "$VAPID_PRIVADA" ] || FALTA="$FALTA VAPID_PRIVATE_KEY"
  [ -n "$VAPID_CONTACTO" ] || FALTA="$FALTA VAPID_CONTACT"
  [ -z "$FALTA" ] || fatal "app.env no trae${FALTA}: lib/push.ts no manda ningun push sin las tres, y la gente se suscribiria igual — no muestro valores"
  ARG_PUSH="--build-arg NEXT_PUBLIC_VAPID_PUBLIC_KEY"
else
  unset NEXT_PUBLIC_VAPID_PUBLIC_KEY
  say "el Dockerfile de $SHA8 no declara ARG NEXT_PUBLIC_VAPID_PUBLIC_KEY: armo sin push (ni la exijo ni la paso)"
fi

if [ -n "$DRY" ]; then
  echo "[dry-run] armaria $TAG desde $SHA"
  echo "[dry-run]   release: $R (SHA, source.tar.gz, src/ sin n8n-mcp-server/node_modules .agents .obsidian .opencode .claude)"
  echo "[dry-run]   docker build --tag $CAND con los NEXT_PUBLIC_* de $ENVFILE (sin mostrarlos)${PUSH:+, incluida la clave de push}"
  echo "[dry-run]   gates: BUILD_ID, node 22, server.js, 0 .env, URL publica + anon key${PUSH:+ + clave de push} horneadas, 0 valores QA"
  echo "[dry-run]   solo si pasan: docker tag $CAND $TAG"
  echo "[dry-run] no arme nada."
  exit 0
fi

# ── [5/7] el codigo sale del clon (LF), nunca de un tarball hecho a mano ─────
say "BUILD $SHA8 -> $R ($TAG)"
rm -rf "${BASE:?}/releases/${SHA8:?}-"*   # un solo release por sha; el vivo ya se descarto arriba
mkdir -p "$R/src" || fatal "no puedo crear $R"
echo "$SHA" > "$R/SHA"
git -c core.autocrlf=false -C "$REPO" archive --format=tar "$SHA" | gzip -n > "$R/source.tar.gz" \
  || fatal "no pude exportar el codigo de $SHA"
gzip -dc "$R/source.tar.gz" | tar -x -C "$R/src" --exclude='n8n-mcp-server/node_modules' \
  --exclude='.agents' --exclude='.obsidian' --exclude='.opencode' --exclude='.claude' \
  || fatal "no pude desempaquetar el codigo de $SHA"
MALOS=$(find "$R/src" -maxdepth 1 -name '.env*' ! -name '*.example' -printf '%f ' 2>/dev/null)
[ -z "$MALOS" ] || fatal "env files en el source: $MALOS"
[ -f "$R/src/Dockerfile" ] || fatal "el source de $SHA8 no tiene Dockerfile"

# ── [6/7] docker build ──────────────────────────────────────────────────────
# `--build-arg NOMBRE` sin valor lo toma del entorno: los valores no aparecen en
# la linea de comando (ps) ni en este log.
say "docker build (log: $R/build.log)"
# El candidato se suelta al salir por cualquier camino. Si paso, ya tiene la etiqueta
# release y esto solo la desetiqueta; si no, la imagen rechazada queda sin nombre.
trap 'docker image rm "$CAND" >/dev/null 2>&1' EXIT
INICIO=$(date +%s)
docker build --pull=false --progress=plain --tag "$CAND" \
  --build-arg NEXT_PUBLIC_SUPABASE_URL --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY --build-arg NEXT_PUBLIC_APP_URL \
  $ARG_PUSH \
  "$R/src" > "$R/build.log" 2>&1
CODIGO=$?
echo "$CODIGO $(( $(date +%s) - INICIO ))s" > "$R/build.exit"
if [ "$CODIGO" != 0 ]; then tail -20 "$R/build.log"; fatal "docker build fallo ($CODIGO)"; fi

# ── [7/7] gates sobre la IMAGEN, sin red ─────────────────────────────────────
CONF=$(docker image inspect --format '{{.Config.User}}|{{.Config.WorkingDir}}|{{json .Config.Cmd}}' "$CAND" 2>/dev/null)
[ "$CONF" = 'nextjs|/app|["node","server.js"]' ] || fatal "config de la imagen inesperada: $CONF"
G=$(K="$NEXT_PUBLIC_SUPABASE_ANON_KEY" U="$NEXT_PUBLIC_SUPABASE_URL" V="${NEXT_PUBLIC_VAPID_PUBLIC_KEY:-sin-push}" \
  docker run --rm --network none -e K -e U -e V --entrypoint sh "$CAND" -c '
    echo "build=$(cat .next/BUILD_ID 2>/dev/null)"
    echo "node=$(node --version)"
    test -f server.js && echo server=ok || echo server=falta
    test -d node_modules && echo node_modules=ok || echo node_modules=falta
    echo "static=$(find .next/static -type f 2>/dev/null | wc -l)"
    echo "envfiles=$(find /app -name ".env*" -not -path "*/node_modules/*" | wc -l)"
    echo "publica=$(grep -rlF "$U" .next/static 2>/dev/null | wc -l)"
    echo "anon=$(grep -rlF "$K" .next/static 2>/dev/null | wc -l)"
    echo "vapid=$(grep -rlF "$V" .next/static 2>/dev/null | wc -l)"
    echo "qa=$(grep -rlE "127\.0\.0\.1:(3100|3196|543[0-9]{2})|localhost:(3100|3196|543[0-9]{2})|onia_no_database|onia-qa" .next/static .next/server 2>/dev/null | wc -l)"
  ')
echo "$G" | sed 's/^/  gate /'
g() { printf '%s\n' "$G" | sed -n "s/^$1=//p" | head -1 | tr -d '[:space:]'; }
BID=$(g build)
FALLA=""
[ -n "$BID" ] || FALLA="$FALLA sin-BUILD_ID"
case "$(g node)" in v22.*) ;; *) FALLA="$FALLA node=$(g node)" ;; esac
[ "$(g server)" = ok ] || FALLA="$FALLA server.js"
[ "$(g node_modules)" = ok ] || FALLA="$FALLA node_modules"
[ "$(g static)" -gt 0 ] 2>/dev/null || FALLA="$FALLA sin-static"
[ "$(g envfiles)" = 0 ] || FALLA="$FALLA envfiles=$(g envfiles)"
[ "$(g publica)" -gt 0 ] 2>/dev/null || FALLA="$FALLA url-publica-no-horneada"
[ "$(g anon)" -gt 0 ] 2>/dev/null || FALLA="$FALLA anon-key-no-horneada"
[ -z "$PUSH" ] || [ "$(g vapid)" -gt 0 ] 2>/dev/null || FALLA="$FALLA vapid-no-horneada"
[ "$(g qa)" = 0 ] || FALLA="$FALLA valores-QA=$(g qa)"
[ -z "$FALLA" ] || fatal "la imagen $CAND NO pasa los gates:$FALLA"
docker tag "$CAND" "$TAG" || fatal "no pude etiquetar $TAG"

# El BUILD_ID es lo ULTIMO que se escribe: sin el, deploy-vivo.mjs no da este
# release por staged, asi que un build cortado a la mitad nunca se publica.
echo "$BID" > "$R/BUILD_ID"
say "STAGED_OK sha=$SHA8 build_id=$BID image=$TAG"
echo "siguiente paso: $BASE/swap-imagen.sh $SHA8"
