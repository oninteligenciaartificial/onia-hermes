#!/usr/bin/env bash
# Verifica la firma de un webhook de Meta. Corre EN EL VPS a proposito: el
# App Secret vive aca (/root/.hermes/.env) y NUNCA entra a n8n.
#
# Uso:  ig-firma.sh <cuerpo-en-base64> <valor de x-hub-signature-256>
# Sale: JSON en una linea -> {"ok":true|false,"secreto":"<cual sirvio>","motivo":"..."}
#
# POR QUE EXISTE. Medido el 2026-09-08: se le mando al webhook un comentario
# INVENTADO con curl y lo proceso como real. Hoy es inofensivo porque no hay
# palabras activas y ningun DM se dispara. Con una palabra activa deja de serlo:
# cualquiera que conozca la URL puede hacer que la cuenta le mande un DM a quien
# quiera — que es exactamente el comportamiento por el que Meta cierra una cuenta.
#
# POR QUE EN BASE64. El cuerpo es JSON con comillas, llaves y acentos; pasarlo por
# la linea de comandos de ssh es la trampa de escapado que ya mordio cuatro veces
# en un dia (ver skill onia-infra §1). base64 no tiene ningun caracter que el
# shell interprete.
#
# POR QUE LOS BYTES CRUDOS. La firma se calcula sobre lo que Meta mando, byte a
# byte. Re-serializar el JSON parseado NO sirve: medido el 2026-09-08, el cuerpo
# re-serializado daba 282 bytes contra los 306 que Meta declaro en content-length.
#
# 🔴 MODO OBSERVAR. Prueba TODOS los secretos candidatos y dice cual sirvio,
# porque hay DOS apps de Meta en el sistema (1562215408796050 en .hermes/.env y
# 1078962684709749 en app.env) y todavia no se cual firma este webhook. Quien
# llame decide si bloquea; este script solo informa. Activar el rechazo con el
# secreto equivocado tira TODOS los comentarios reales y no se nota hasta que
# alguien pregunta por que no le llego nada.
set -uo pipefail

B64="${1:-}"
FIRMA="${2:-}"
salir() { printf '{"ok":%s,"secreto":"%s","motivo":"%s"}\n' "$1" "${2:-}" "$3"; exit 0; }

[ -n "$B64" ]   || salir false "" "sin_cuerpo"
[ -n "$FIRMA" ] || salir false "" "sin_cabecera_de_firma"

# Meta manda "sha256=<hex>". Se acepta con o sin prefijo.
ESPERADA="${FIRMA#sha256=}"
printf '%s' "$ESPERADA" | grep -qE '^[0-9a-f]{64}$' || salir false "" "firma_con_formato_raro"

TMP=$(mktemp) || salir false "" "sin_tmp"
trap 'rm -f "$TMP"' EXIT
printf '%s' "$B64" | base64 -d > "$TMP" 2>/dev/null || salir false "" "base64_invalido"

# Los secretos se leen aca y no se imprimen nunca.
set -a; . /root/.hermes/.env 2>/dev/null; set +a
WHATSAPP_APP_SECRET=$(grep -oP '^WHATSAPP_APP_SECRET=\K.*' /opt/onia-platform/app.env 2>/dev/null | tr -d '"')

for NOMBRE in META_APP_SECRET WHATSAPP_APP_SECRET; do
  S="${!NOMBRE:-}"
  [ -n "$S" ] || continue
  CALC=$(openssl dgst -sha256 -hmac "$S" -hex < "$TMP" 2>/dev/null | sed 's/^.*= *//')
  # Comparacion de largo constante: un `=` normal filtra por tiempo cuanto
  # prefijo acerto. Con 64 hex es teorico, pero es una verificacion de firma.
  if [ "${#CALC}" = "${#ESPERADA}" ] && printf '%s' "$CALC" | cmp -s - <(printf '%s' "$ESPERADA"); then
    salir true "$NOMBRE" "coincide"
  fi
done

salir false "" "ningun_secreto_coincide"
