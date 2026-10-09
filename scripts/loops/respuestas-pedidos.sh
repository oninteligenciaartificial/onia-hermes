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
#   - que la descarga no pase de 64 KB: se corta MIENTRAS baja, no después (ver TOPE_BAJADA_KB);
#   - el commit con árbol vacío, sin padre y de 16 KB como mucho;
#   - la primera línea `respuesta <id> <listo|necesita-ok|no-se-pudo> <firma>`, con el mismo id que la
#     rama y la FIRMA del sello de ese pedido (ver abajo);
#   - el texto se recorta a 1500 caracteres y se escapa para el HTML de Telegram.
# Cada commit se mira UNA vez, y cada estado se entrega una vez por pedido.
#
# LA RESPUESTA ESTÁ ATADA AL PEDIDO (2026-10-05, primer MEDIUM de la revisión de la madre v2). Antes,
# cualquiera que pudiera pushear al repo podía dejar la respuesta de un pedido abierto. Ahora
# pedido-claude.sh le da a cada pedido un sello aleatorio que viaja solo en el disparo de la rutina y
# queda acá ($ESTADO/sellos/<id>, 600). La sesión firma con responder-pedido.sh:
# HMAC-SHA256(sello, "respuesta <id> <estado>\n" + texto sin espacios en las puntas). Sin la firma
# buena no se entrega. El sello se borra al cerrarse el pedido o a las 48 h.
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
GITDIR="$ESTADO/respuestas.git"           # repo vacío y propio, NUEVO en cada vuelta (ver preparar)
REGISTRO="$ESTADO/pedidos.tsv"            # ts_utc id carril hash session_id url (pedido-claude.sh)
RESPUESTAS="$ESTADO/respuestas.tsv"       # ts_utc id estado (lo escribe este script)
MIRADAS="$ESTADO/respuestas-miradas.tsv"  # ts_utc sha id resultado: cada commit se mira una vez
RECHAZOS="$ESTADO/rechazos-avisados.tsv"  # ts_utc id: a qué pedidos ya se le avisó de una respuesta rechazada
VENTANA=172800                            # 48 h
SELLOS="$ESTADO/sellos"                   # un sello por pedido (lo escribe pedido-claude.sh)
MAX_COMMIT=16384                          # bytes del commit entero (con la firma de la sesión)
# El tope de lo que se BAJA, en KB (2026-10-05, segundo MEDIUM de la madre v2). Los 16 KB de arriba se
# medían después de bajar el commit entero: una respuesta de 500 MB llenaba el disco y la red del VPS
# antes de que nada la frenara. La descarga corre con `ulimit -f` y `transfer.unpackLimit=1`: git
# guarda el paquete en un archivo mientras lo recibe, y al pasar el tope el kernel lo corta (medido:
# 3 MB y 200 MB se cortan en 64 KB; una respuesta normal pesa ~2 KB).
TOPE_BAJADA_KB=64
MAX_TEXTO=1500
VACIO=4b825dc642cb6eb9a060e54bf8d69288fbee4904   # el árbol vacío de git
AHORA=$(date -u +%s)

PROBAR=0
case "${1:-}" in "") ;; --probar) PROBAR=1 ;; *) echo "uso: $0 [--probar]" >&2; exit 64 ;; esac

log() { printf '%s %s\n' "$(date -u +%FT%TZ)" "$*"; }
G() { timeout 60 git -C "$GITDIR" "$@"; }
# Baja SOLO el commit de respuesta/<id>, con el tope puesto mientras baja. Salidas: 0 bajó · 2 pasó el
# tope (no se reintenta) · 1 otra falla (red, GitHub: se reintenta en la vuelta siguiente).
bajar() {
  local id=$1 rc
  rm -f "$GITDIR"/objects/pack/tmp_pack_* 2>/dev/null
  ( ulimit -f "$TOPE_BAJADA_KB" && exec timeout 60 git -C "$GITDIR" -c transfer.unpackLimit=1 \
      -c gc.auto=0 -c maintenance.auto=false \
      fetch -q --no-tags --no-write-fetch-head --depth=1 --filter=tree:0 origin \
      "+refs/heads/respuesta/$id:refs/respuestas/$id" ) </dev/null >/dev/null 2>&1
  rc=$?
  [ "$rc" = 0 ] && return 0
  # Si se cortó por el tope, queda un paquete a medias del tamaño exacto del tope: esa es la prueba.
  if find "$GITDIR/objects/pack" -maxdepth 1 -name 'tmp_pack_*' -size +$((TOPE_BAJADA_KB - 1))k 2>/dev/null | grep -q .; then
    rc=2
  else
    rc=1
  fi
  rm -f "$GITDIR"/objects/pack/tmp_pack_* 2>/dev/null
  return "$rc"
}
esc() { sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g'; }

umask 077
mkdir -p "$ESTADO" && chmod 700 "$ESTADO" 2>/dev/null
exec 9>"$ESTADO/respuestas.lock"
flock -n 9 || exit 0                      # otra vuelta en curso: esta no hace falta

# El repo se arma DE CERO en cada vuelta (revisión fuerte del 5-oct). Uno que duraba juntaba estado:
# el gc automático de git heredaba el `ulimit -f`, moría y dejaba un `tmp_pack_*` de 64 KB que hacía
# pasar una falla de red por «demasiado grande» (y se descartaba la respuesta buena); y el `shallow`
# crecía una línea por respuesta hasta que el fetch mismo chocaba con el tope y dejaba `shallow.lock`,
# trabando todo. Lo que importa entre vueltas vive en los .tsv, no acá.
preparar() {
  case "$GITDIR" in */respuestas.git) rm -rf -- "$GITDIR" ;; *) return 1 ;; esac
  git init -q --bare "$GITDIR" &&
    git -C "$GITDIR" remote add origin "$REPO_URL" &&
    git -C "$GITDIR" config --unset-all remote.origin.fetch 2>/dev/null
  git -C "$GITDIR" config remote.origin.promisor true &&
    git -C "$GITDIR" config remote.origin.partialclonefilter tree:0 &&
    git -C "$GITDIR" config gc.auto 0 &&
    git -C "$GITDIR" config maintenance.auto false
}

abiertos() {  # ids de los pedidos de las últimas 48 h que todavía no tienen respuesta final
  [ -s "$REGISTRO" ] || return 0
  awk -F'\t' -v desde=$((AHORA - VENTANA)) -v r="$RESPUESTAS" '
    BEGIN { while ((getline l < r) > 0) { split(l, c, "\t"); if (c[3] == "listo" || c[3] == "no-se-pudo") cerrado[c[2]] = 1 } }
    $1 ~ /^[0-9]+$/ && $1 >= desde && !($2 in cerrado) { print $2 }' "$REGISTRO" | sort -u
}

mirado() { printf '%s\t%s\t%s\t%s\n' "$AHORA" "$1" "$2" "$3" >> "$MIRADAS"; }
cerrar_sello() { rm -f "$SELLOS/$1"; }   # al cerrarse el pedido, su sello no sirve más

borrar_rama() {  # borrar_rama <id> <sha>: solo si sigue apuntando a ESE commit
  [ "$BORRAR" = 1 ] || return 0
  G push -q --force-with-lease="refs/heads/respuesta/$1:$2" origin ":refs/heads/respuesta/$1" </dev/null >/dev/null 2>&1 \
    || log "· $1: no pude borrar la rama respuesta/$1 (queda; ya está mirada)"
}

# Lee el commit por la entrada estándar y escribe en $2: la primera línea, el estado; después, el texto.
LEER_PY='
import hashlib, hmac, re, sys
ident, salida, maximo, vacio, sello_de = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4], sys.argv[5]
crudo = sys.stdin.buffer.read()
cabeza, sep, cuerpo = crudo.partition(b"\n\n")
if not sep:
    sys.exit("commit sin mensaje")
lineas = cabeza.decode("utf-8", "replace").split("\n")
if lineas[0] != "tree " + vacio:
    sys.exit("el commit trae archivos (tiene que ser un árbol vacío)")
if any(l.startswith("parent ") for l in lineas):
    sys.exit("el commit tiene padre (tiene que ser una rama sin historia)")
primera, _, resto = cuerpo.partition(b"\n")
m = re.fullmatch(rb"respuesta (p_[0-9a-f]{8}) (listo|necesita-ok|no-se-pudo) ([0-9a-f]{64})\s*", primera)
if not m:
    sys.exit("la primera línea no es «respuesta <id> <estado> <firma>»")
if m.group(1).decode() != ident:
    sys.exit("el id del mensaje no es el de la rama")
try:
    with open(sello_de, encoding="ascii") as f:
        sello = f.read().strip()
except (OSError, UnicodeDecodeError):
    sys.exit("este pedido no tiene sello en el VPS")
if not re.fullmatch(r"[0-9a-f]{32}", sello):
    sys.exit("el sello de este pedido está dañado")
texto = resto.strip()
esperada = hmac.new(bytes.fromhex(sello), b"respuesta %s %s\n" % (m.group(1), m.group(2)) + texto, hashlib.sha256).hexdigest()
if not hmac.compare_digest(esperada.encode(), m.group(3)):
    sys.exit("la firma no es la del sello de este pedido")
texto = texto.decode("utf-8", "replace").strip()[:maximo].strip()
if not texto:
    sys.exit("respuesta vacía")
with open(salida, "w", encoding="utf-8") as f:
    f.write(m.group(2).decode() + "\n" + texto)
'

# La PRIMERA línea es la que la aduana guarda cuando él está de noche o en un bloque: la corta a 90 BYTES
# sin HTML (`cut -c` de GNU cuenta bytes, no letras). Tiene que alcanzar sola para saber qué pedido es y
# dónde verlo. Si no entra, queda solo el emoji: el id y el link valen más.
primera_linea() {  # primera_linea <corto> <id> <url>
  local p
  p="$1 · $2 · $(printf '%s' "${3:-(sin link)}" | esc)"
  [ "$(printf '%s' "$p" | wc -c)" -le 90 ] || p="${1%% *} $2 · $(printf '%s' "${3:-(sin link)}" | esc)"
  printf '%s' "$p"
}

# Una respuesta que no pasa los controles no se entrega, pero él tiene que saber que llegó algo (revisión
# de la madre al #138, 9-oct: se descartaba en silencio). Un aviso por pedido, sin el texto rechazado: si
# alguien la armó para engañarlo, no le llega ni una palabra. La respuesta buena que llegue después se
# entrega igual.
avisar_rechazo() {  # avisar_rechazo <id>
  local id=$1 url msg
  awk -F'\t' -v id="$id" '$2 == id { hay = 1 } END { exit !hay }' "$RECHAZOS" 2>/dev/null && return 0
  url=$(awk -F'\t' -v id="$id" '$2 == id' "$REGISTRO" | tail -1 | cut -f6)
  msg="$(primera_linea "⛔ Rechazada" "$id" "$url")
Llegó una respuesta a tu pedido que no pasa los controles. No te la muestro.
Si la de Claude no llega, mirá la sesión en el link."
  ONIA_AVISO=interrumpe ONIA_AVISO_CLAVE="pedido-$id-rechazo" ONIA_AVISO_EMISOR=claude \
    "$TG" "$msg" </dev/null >/dev/null 2>&1 || { log "· $id: la aduana no aceptó el aviso de rechazo"; return 1; }
  printf '%s\t%s\n' "$(date -u +%s)" "$id" >> "$RECHAZOS"
}

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
  primera=$(primera_linea "$corto" "$id" "$url")
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

# Los sellos de más de 48 h ya no firman nada: el pedido salió de la ventana.
find "$SELLOS" -maxdepth 1 -type f -mmin +$((VENTANA / 60)) -delete 2>/dev/null
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
  bajar "$ID"; RC=$?
  if [ "$RC" = 2 ]; then
    log "❌ $ID: la respuesta pasa de $TOPE_BAJADA_KB KB; corté la descarga y no la entrego"
    mirado "$SHA" "$ID" invalida; avisar_rechazo "$ID"; borrar_rama "$ID" "$SHA"; continue
  elif [ "$RC" != 0 ]; then
    log "❌ $ID: no pude bajar la respuesta (reintento en la próxima vuelta)"; continue
  fi
  BAJADO=$(G rev-parse --verify -q "refs/respuestas/$ID^{commit}") || { log "❌ $ID: lo bajado no es un commit"; mirado "$SHA" "$ID" invalida; avisar_rechazo "$ID"; continue; }
  if [ "$(G cat-file -s "$BAJADO")" -gt "$MAX_COMMIT" ]; then
    log "❌ $ID: la respuesta pesa más de $MAX_COMMIT bytes; no la entrego"
    mirado "$BAJADO" "$ID" invalida; [ "$BAJADO" = "$SHA" ] || mirado "$SHA" "$ID" invalida
    avisar_rechazo "$ID"; borrar_rama "$ID" "$BAJADO"; continue
  fi
  if ! ERR=$(G cat-file commit "$BAJADO" | python3 -c "$LEER_PY" "$ID" "$TMP/r" "$MAX_TEXTO" "$VACIO" "$SELLOS/$ID" 2>&1); then
    log "❌ $ID: respuesta con forma inválida (${ERR##*$'\n'}); no la entrego"
    mirado "$BAJADO" "$ID" invalida; [ "$BAJADO" = "$SHA" ] || mirado "$SHA" "$ID" invalida
    avisar_rechazo "$ID"; borrar_rama "$ID" "$BAJADO"; continue
  fi
  EST=$(head -n1 "$TMP/r"); TEXTO=$(tail -n +2 "$TMP/r")
  entregar "$ID" "$EST" "$TEXTO"; RC=$?
  case "$RC" in
    0) log "✅ $ID: respuesta «$EST» entregada a la aduana" ;;
    2) log "· $ID: ya tenía una respuesta «$EST»; no la repito" ;;
    *) log "❌ $ID: la aduana no la aceptó (reintento en la próxima vuelta)"; continue ;;
  esac
  mirado "$BAJADO" "$ID" "$EST"; [ "$BAJADO" = "$SHA" ] || mirado "$SHA" "$ID" "$EST"
  case "$EST" in listo|no-se-pudo) cerrar_sello "$ID" ;; esac
  borrar_rama "$ID" "$BAJADO"
done <<<"$LISTA"
exit 0
