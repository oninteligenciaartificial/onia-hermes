#!/usr/bin/env bash
# ONIA — la sesión de un pedido le deja su respuesta a Sergio Urcullo, FIRMADA con el sello del pedido.
#
# POR QUÉ EXISTE (2026-10-05, primer MEDIUM de la revisión de la madre v2). La respuesta vuelve como el
# mensaje de un commit sin archivos en la rama `respuesta/<id>`, y el VPS la recoge
# (respuestas-pedidos.sh). Hasta hoy la respuesta no estaba atada al pedido: cualquiera que pudiera
# pushear al repo podía dejar la de un pedido abierto, y el VPS se la entregaba a Sergio Urcullo como
# si fuera de Claude. Ahora cada pedido lleva un SELLO aleatorio (pedido-claude.sh) que viaja solo en
# el disparo de la rutina y queda guardado en el VPS (600). La respuesta lleva un HMAC-SHA256 del
# estado y del texto con ese sello, y el VPS entrega solo la que lo trae bien. El sello nunca entra al
# repo: el commit lleva la firma, no el sello.
#
# Límite, sin maquillar: el sello está en el primer mensaje de la sesión de la rutina. Quien pueda leer
# las sesiones de la cuenta lo puede leer. Sube la vara de «cualquiera que pushee al repo» a «quien
# además lea esa sesión».
#
# Uso (lo corre la sesión de la rutina, parada en su clon de onia-hermes):
#   bash scripts/loops/responder-pedido.sh <p_xxxxxxxx> <listo|necesita-ok|no-se-pudo> <sello> < /tmp/respuesta.txt
# El archivo trae SOLO el texto para leer en el teléfono, sin encabezado.
# Salidas: 0 pusheada · 1 no se pudo armar o pushear · 64 uso · 65 texto vacío o demasiado largo
set -uo pipefail
export LC_ALL=C.UTF-8

uso() { echo "uso: $0 <p_xxxxxxxx> <listo|necesita-ok|no-se-pudo> <sello del pedido> < respuesta.txt" >&2; exit 64; }
[ "$#" -eq 3 ] || uso
ID=$1 EST=$2 SELLO=$3
[[ "$ID" =~ ^p_[0-9a-f]{8}$ ]] || uso
case "$EST" in listo|necesita-ok|no-se-pudo) ;; *) uso ;; esac
[[ "$SELLO" =~ ^[0-9a-f]{32}$ ]] || { echo "el sello es el de la línea «Sello:» del pedido: 32 caracteres hexadecimales" >&2; exit 64; }
[ ! -t 0 ] || { echo "la respuesta va por la entrada estándar: < /tmp/respuesta.txt" >&2; exit 64; }

TMP=$(mktemp -d) || exit 1
trap 'rm -rf "$TMP"' EXIT

# La firma es HMAC-SHA256(sello, "respuesta <id> <estado>\n" + texto), con el texto en bytes y sin los
# espacios del principio y del final. respuestas-pedidos.sh calcula exactamente lo mismo.
ID="$ID" EST="$EST" SELLO="$SELLO" python3 -c '
import hashlib, hmac, os, sys
texto = sys.stdin.buffer.read().strip()
if not texto:
    sys.stderr.write("la respuesta está vacía: no la dejé\n"); sys.exit(65)
if len(texto) > 12000:
    sys.stderr.write("la respuesta es demasiado larga (%d bytes; el VPS muestra 1500 caracteres): resumila\n" % len(texto)); sys.exit(65)
cabeza = ("respuesta %s %s" % (os.environ["ID"], os.environ["EST"])).encode()
firma = hmac.new(bytes.fromhex(os.environ["SELLO"]), cabeza + b"\n" + texto, hashlib.sha256).hexdigest()
with open(sys.argv[1], "wb") as f:
    f.write(cabeza + b" " + firma.encode() + b"\n\n" + texto + b"\n")
' "$TMP/mensaje" || exit $?

C=$(git commit-tree "$(git mktree </dev/null)" -F "$TMP/mensaje") || { echo "no pude armar el commit de la respuesta" >&2; exit 1; }
# Forzado: la respuesta nueva del MISMO pedido («necesita-ok» y después «listo») reemplaza a la que el VPS
# todavía no recogió. Son commits sin historia: sin forzar, el segundo push siempre se rechaza.
if ! git push -q --force origin "$C:refs/heads/respuesta/$ID"; then
  echo "no pude pushear respuesta/$ID: dejá la respuesta como tu último mensaje (él tiene el link de esta sesión)" >&2
  exit 1
fi
echo "✅ respuesta «$EST» de $ID dejada en respuesta/$ID: el VPS la entrega en unos minutos"
