#!/usr/bin/env bash
# ONIA — recoge la respuesta de Claude a un pedido de Sergio Urcullo y la entrega por la aduana.
#
# POR QUÉ EXISTE (2026-10-02). Un pedido sale de Hermes a una rutina de Claude en la nube
# (pedido-claude.sh). Hasta hoy la respuesta volvía con un workflow que la sesión despachaba con
# GH_ACTIONS_TOKEN, y ese token despacha CUALQUIER workflow manual del repo: también `hermes-jarvis`
# (aplicar / revertir en el VPS) y el deploy con swap. Los revisores obligatorios que lo frenarían no
# existen en un repo privado de cuenta personal. Decisión de la sesión madre, 2-oct: la vuelta va
# SIN ningún token de Actions. La sesión deja la respuesta en GitHub y el VPS la busca.
#
# CÓMO VIAJA. La sesión del pedido deja la respuesta como el MENSAJE de un commit SIN archivos (árbol
# vacío, sin padre) en la rama `respuesta/<id>` de onia-hermes:
#     C=$(git commit-tree "$(git mktree </dev/null)" -F /tmp/respuesta.txt)
#     git push origin "$C:refs/heads/respuesta/<id>"
# Este script corre por cron cada 2 minutos. Solo consulta GitHub si hay pedidos abiertos. Lista esas
# ramas, baja SOLO el commit (`--depth=1 --filter=tree:0`) y entrega el texto por la aduana. Nunca
# baja archivos: aunque la rama traiga el repo entero, transfiere solo el commit (medido: 2 KB contra
# 5 MB). Al entregarla, borra la rama.
#
# POR QUÉ `respuesta/` Y NO `claude/`. El integrador (onia-cola, scripts/loops/prompts/onia-cola.md)
# y ramas_varadas.mjs enumeran SOLO `origin/claude/*`; lo que no empieza así no lo ven (medido el 2-oct).
# Y el commit no tiene padre: `git merge` lo rechaza («unrelated histories») aunque alguien lo intente.
#
# LO QUE TRAE ES TEXTO, NO ÓRDENES. El mensaje se lee con `git cat-file`, se parsea en Python y se
# le pasa a la aduana como UN argumento. Nada de él se evalúa ni se ejecuta. Se exige:
#   - un pedido de ESTE VPS (el id está en pedidos.tsv), de menos de 48 h y todavía no cerrado;
#   - el commit con árbol vacío, sin padre y de 16 KB como mucho;
#   - la primera línea `respuesta <id> <listo|necesita-ok|no-se-pudo>`, con el mismo id que la rama;
#   - el texto se recorta a 1500 caracteres y se escapa para el HTML de Telegram.
# Cada commit se mira UNA vez, y cada estado se entrega una vez por pedido.
#
# Uso: onia-respuestas-pedidos.sh            (cron) recoge y entrega
#      onia-respuestas-pedidos.sh --probar   ¿llega a GitHub? No entrega nada. Lo usa aplicar.sh.
# Salidas: 0 bien o nada que hacer · 1 no pudo consultar GitHub · 64 uso
set -uo pipefail
export LC_ALL=C.UTF-8 GIT_TERMINAL_PROMPT=0
export GIT_SSH_COMMAND="${GIT_SSH_COMMAND:-ssh -o BatchMode=yes -o ConnectTimeout=20}"

ESTADO="${ONIA_PEDIDOS_ESTADO:-/var/lib/onia-pedidos}"
REPO_URL="${ONIA_PEDIDOS_REPO_URL:-git@github.com:oninteligenciaartificial/onia-hermes.git}"
TG="${ONIA_TG:-/root/bin/onia-tg.sh}"
BORRAR="${ONIA_RESPUESTAS_BORRAR:-1}"     # 0 = no borra la rama al entregarla
GITDIR="$ESTADO/respuestas.git"           # repo vacío y propio: nunca el clon del integrador
REGISTRO="$ESTADO/pedidos.tsv"            # ts_utc id carril hash session_id url (pedido-claude.sh)
RESPUESTAS="$ESTADO/respuestas.tsv"       # ts_utc id estado (lo escribe este script)
MIRADAS="$ESTADO/respuestas-miradas.tsv"  # ts_utc sha id resultado: cada commit se mira una vez
VENTANA=172800                            # 48 h
MAX_COMMIT=16384                          # bytes del commit entero (con la firma de la sesión)
MAX_TEXTO=1500
VACIO=4b825dc642cb6eb9a060e54bf8d69288fbee4904   # el árbol vacío de git
AHORA=$(date -u +%s)

PROBAR=0
case "${1:-}" in "") ;; --probar) PROBAR=1 ;; *) echo "uso: $0 [--probar]" >&2; exit 64 ;; esac

log() { printf '%s %s\n' "$(date -u +%FT%TZ)" "$*"; }
G() { timeout 60 git -C "$GITDIR" "$@"; }
esc() { sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g'; }

umask 077
mkdir -p "$ESTADO" && chmod 700 "$ESTADO" 2>/dev/null
exec 9>"$ESTADO/respuestas.lock"
flock -n 9 || exit 0                      # otra vuelta en curso: esta no hace falta

preparar() {
  [ -d "$GITDIR" ] || git init -q --bare "$GITDIR" || return 1
  git -C "$GITDIR" remote get-url origin >/dev/null 2>&1 || git -C "$GITDIR" remote add origin "$REPO_URL" || return 1
  git -C "$GITDIR" remote set-url origin "$REPO_URL" || return 1
  git -C "$GITDIR" config --unset-all remote.origin.fetch 2>/dev/null
  git -C "$GITDIR" config remote.origin.promisor true &&
    git -C "$GITDIR" config remote.origin.partialclonefilter tree:0
}

abiertos() {  # ids de los pedidos de las últimas 48 h que todavía no tienen respuesta final
  [ -s "$REGISTRO" ] || return 0
  awk -F'\t' -v desde=$((AHORA - VENTANA)) -v r="$RESPUESTAS" '
    BEGIN { while ((getline l < r) > 0) { split(l, c, "\t"); if (c[3] == "listo" || c[3] == "no-se-pudo") cerrado[c[2]] = 1 } }
    $1 ~ /^[0-9]+$/ && $1 >= desde && !($2 in cerrado) { print $2 }' "$REGISTRO" | sort -u
}

mirado() { printf '%s\t%s\t%s\t%s\n' "$AHORA" "$1" "$2" "$3" >> "$MIRADAS"; }

borrar_rama() {  # borrar_rama <id> <sha>: solo si sigue apuntando a ESE commit
  [ "$BORRAR" = 1 ] || return 0
  G push -q --force-with-lease="refs/heads/respuesta/$1:$2" origin ":refs/heads/respuesta/$1" </dev/null >/dev/null 2>&1 \
    || log "· $1: no pude borrar la rama respuesta/$1 (queda; ya está mirada)"
}

# Lee el commit por la entrada estándar y escribe en $2: la primera línea, el estado; después, el texto.
LEER_PY='
import re, sys
ident, salida, maximo, vacio = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]
crudo = sys.stdin.buffer.read()
cabeza, sep, cuerpo = crudo.partition(b"\n\n")
if not sep:
    sys.exit("commit sin mensaje")
lineas = cabeza.decode("utf-8", "replace").split("\n")
if lineas[0] != "tree " + vacio:
    sys.exit("el commit trae archivos (tiene que ser un árbol vacío)")
if any(l.startswith("parent ") for l in lineas):
    sys.exit("el commit tiene padre (tiene que ser una rama sin historia)")
texto = cuerpo.decode("utf-8", "replace")
primera, _, resto = texto.partition("\n")
m = re.fullmatch(r"respuesta (p_[0-9a-f]{8}) (listo|necesita-ok|no-se-pudo)\s*", primera)
if not m:
    sys.exit("la primera línea no es «respuesta <id> <estado>»")
if m.group(1) != ident:
    sys.exit("el id del mensaje no es el de la rama")
resto = resto.strip()[:maximo].strip()
if not resto:
    sys.exit("respuesta vacía")
with open(salida, "w", encoding="utf-8") as f:
    f.write(m.group(2) + "\n" + resto)
'

entregar() {  # entregar <id> <estado> <texto> -> 0 entregada · 2 repetida · 1 la aduana no la aceptó
  local id=$1 estado=$2 texto=$3 fila carril url corto cabeza primera msg
  if awk -F'\t' -v id="$id" -v e="$estado" '$2 == id && $3 == e { hay = 1 } END { exit !hay }' "$RESPUESTAS" 2>/dev/null; then
    return 2
  fi
  fila=$(awk -F'\t' -v id="$id" '$2 == id' "$REGISTRO" | tail -1)
  carril=$(printf '%s' "$fila" | cut -f3)
  url=$(printf '%s' "$fila" | cut -f6)
  case "$estado" in
    listo)       corto="✅ Listo";       cabeza="<b>Claude terminó tu pedido</b>" ;;
    necesita-ok) corto="🙋 Falta tu ok"; cabeza="<b>Claude necesita tu ok</b>" ;;
    no-se-pudo)  corto="⚠️ No se pudo";  cabeza="<b>Claude no pudo con tu pedido</b>" ;;
  esac
  # La PRIMERA línea es la que la aduana guarda cuando él está de noche o en un bloque: la corta a
  # 90 BYTES sin HTML (`cut -c` de GNU cuenta bytes, no letras). Tiene que alcanzar sola para saber
  # qué pedido es y dónde verlo. Si no entra, queda solo el emoji: el id y el link valen más.
  primera="$corto · $id · $(printf '%s' "${url:-(sin link)}" | esc)"
  [ "$(printf '%s' "$primera" | wc -c)" -le 90 ] \
    || primera="${corto%% *} $id · $(printf '%s' "${url:-(sin link)}" | esc)"
  msg="$primera
$cabeza ($carril)

$(printf '%s' "$texto" | esc)"
  ONIA_AVISO=interrumpe ONIA_AVISO_CLAVE="pedido-$id-$estado" ONIA_AVISO_EMISOR=claude \
    "$TG" "$msg" </dev/null >/dev/null 2>&1 || return 1
  printf '%s\t%s\t%s\n' "$(date -u +%s)" "$id" "$estado" >> "$RESPUESTAS"
}

if [ "$PROBAR" = 1 ]; then
  preparar || { echo "❌ no pude preparar $GITDIR"; exit 1; }
  N=$(G ls-remote origin 'refs/heads/respuesta/*' </dev/null) || { echo "❌ no llego a GitHub ($REPO_URL)"; exit 1; }
  echo "✅ llego a GitHub: $(printf '%s' "$N" | grep -c .) respuesta(s) esperando"
  exit 0
fi

ABIERTOS=$(abiertos)
[ -n "$ABIERTOS" ] || exit 0              # nadie espera respuesta: ni se consulta GitHub
preparar || { log "❌ no pude preparar $GITDIR"; exit 1; }
LISTA=$(G ls-remote origin 'refs/heads/respuesta/*' </dev/null) || { log "❌ no pude consultar GitHub"; exit 1; }
TMP=$(mktemp -d) || exit 1
trap 'rm -rf "$TMP"' EXIT

while read -r SHA REF; do
  [ -n "${SHA:-}" ] || continue
  ID=${REF#refs/heads/respuesta/}
  [[ "$ID" =~ ^p_[0-9a-f]{8}$ && "$SHA" =~ ^[0-9a-f]{40}$ ]] || continue
  # Una rama de un pedido que no salió de este VPS no es nuestra: ni se baja ni se borra.
  awk -F'\t' -v id="$ID" '$2 == id { hay = 1 } END { exit !hay }' "$REGISTRO" 2>/dev/null || continue
  awk -F'\t' -v s="$SHA" '$2 == s { hay = 1 } END { exit !hay }' "$MIRADAS" 2>/dev/null && continue
  if ! grep -qx "$ID" <<<"$ABIERTOS"; then
    log "· $ID: el pedido ya se cerró o tiene más de 48 h; no le escribo nada"
    mirado "$SHA" "$ID" cerrado; borrar_rama "$ID" "$SHA"; continue
  fi
  if ! G fetch -q --no-tags --no-write-fetch-head --depth=1 --filter=tree:0 origin \
         "+refs/heads/respuesta/$ID:refs/respuestas/$ID" </dev/null >/dev/null 2>&1; then
    log "❌ $ID: no pude bajar la respuesta (reintento en la próxima vuelta)"; continue
  fi
  BAJADO=$(G rev-parse --verify -q "refs/respuestas/$ID^{commit}") || { log "❌ $ID: lo bajado no es un commit"; mirado "$SHA" "$ID" invalida; continue; }
  if [ "$(G cat-file -s "$BAJADO")" -gt "$MAX_COMMIT" ]; then
    log "❌ $ID: la respuesta pesa más de $MAX_COMMIT bytes; no la entrego"
    mirado "$BAJADO" "$ID" invalida; [ "$BAJADO" = "$SHA" ] || mirado "$SHA" "$ID" invalida
    borrar_rama "$ID" "$BAJADO"; continue
  fi
  if ! ERR=$(G cat-file commit "$BAJADO" | python3 -c "$LEER_PY" "$ID" "$TMP/r" "$MAX_TEXTO" "$VACIO" 2>&1); then
    log "❌ $ID: respuesta con forma inválida (${ERR##*$'\n'}); no la entrego"
    mirado "$BAJADO" "$ID" invalida; [ "$BAJADO" = "$SHA" ] || mirado "$SHA" "$ID" invalida
    borrar_rama "$ID" "$BAJADO"; continue
  fi
  EST=$(head -n1 "$TMP/r"); TEXTO=$(tail -n +2 "$TMP/r")
  entregar "$ID" "$EST" "$TEXTO"; RC=$?
  case "$RC" in
    0) log "✅ $ID: respuesta «$EST» entregada a la aduana" ;;
    2) log "· $ID: ya tenía una respuesta «$EST»; no la repito" ;;
    *) log "❌ $ID: la aduana no la aceptó (reintento en la próxima vuelta)"; continue ;;
  esac
  mirado "$BAJADO" "$ID" "$EST"; [ "$BAJADO" = "$SHA" ] || mirado "$SHA" "$ID" "$EST"
  borrar_rama "$ID" "$BAJADO"
done <<<"$LISTA"
exit 0
