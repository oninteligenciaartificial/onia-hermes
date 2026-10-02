# hermes-jarvis / responder — la respuesta de Claude a un pedido de Sergio Urcullo, por Telegram.
# (comun.sh va delante. PEDIDO, ESTADO y TEXTO_B64 llegan del workflow hermes-respuesta.yml,
# que los valida antes; acá se vuelven a validar porque este script corre como root.)
#
# POR QUÉ (2026-10-01). Sergio Urcullo quiere «manejar todo desde» Hermes. Un pedido sale de
# Telegram a una rutina de Claude en la nube (scripts/loops/pedido-claude.sh); la sesión en la
# nube no puede escribirle a Telegram —ni debe: un emisor que se saltea la aduana es un bug
# (ONIA_CEREBRO.md)—, así que al terminar despacha este workflow y la respuesta entra por la
# MISMA aduana que todo lo demás: respeta la noche (22:00-06:30) y sus bloques del calendario.
#
# Qué NO deja pasar: un pedido que no salió de Hermes (el id tiene que estar en pedidos.tsv), ni
# dos respuestas con el mismo estado para el mismo pedido. Así un token de Actions filtrado no
# sirve para mandarle mensajes a Sergio Urcullo sobre pedidos que no existen.

PEDIDOS_DIR="${ONIA_PEDIDOS_ESTADO:-/var/lib/onia-pedidos}"
TG="${ONIA_TG:-/root/bin/onia-tg.sh}"
sec "hermes-jarvis · responder · ${PEDIDO:-?} · ${ESTADO:-?}"

[[ "${PEDIDO:-}" =~ ^p_[0-9a-f]{8}$ ]] || { echo "❌ id de pedido inválido"; exit 65; }
case "${ESTADO:-}" in listo|necesita-ok|no-se-pudo) ;; *) echo "❌ estado inválido"; exit 65 ;; esac
FILA=$(awk -F'\t' -v id="$PEDIDO" '$2 == id' "$PEDIDOS_DIR/pedidos.tsv" 2>/dev/null | tail -1)
[ -n "$FILA" ] || { echo "❌ $PEDIDO no salió de Hermes: no le escribo nada"; exit 66; }
# Un pedido viejo o ya cerrado no vuelve a sonar (revisión de la sesión madre, 1-oct): las
# respuestas tienen ventana de 48 h, y después de «listo» o «no-se-pudo» no se acepta nada más.
TS=$(printf '%s' "$FILA" | cut -f1)
[[ "$TS" =~ ^[0-9]+$ ]] && [ $(( $(date -u +%s) - TS )) -le 172800 ] \
  || { echo "❌ $PEDIDO tiene más de 48 h: no le escribo nada"; exit 66; }
FINAL=$(awk -F'\t' -v id="$PEDIDO" '$2 == id && ($3 == "listo" || $3 == "no-se-pudo") { print $3; exit }' \
          "$PEDIDOS_DIR/respuestas.tsv" 2>/dev/null)
[ -z "$FINAL" ] || { echo "❌ $PEDIDO ya se cerró («$FINAL»): no le escribo nada más"; exit 66; }
if awk -F'\t' -v id="$PEDIDO" -v e="$ESTADO" '$2 == id && $3 == e { hay = 1 } END { exit !hay }' \
     "$PEDIDOS_DIR/respuestas.tsv" 2>/dev/null; then
  echo "· $PEDIDO ya tenía una respuesta «$ESTADO»: no la repito"; exit 0
fi

TEXTO=$(printf '%s' "${TEXTO_B64:-}" | base64 -d 2>/dev/null \
        | python3 -c 'import sys; print(sys.stdin.buffer.read().decode("utf-8", "replace")[:1500].strip(), end="")')
[ -n "$TEXTO" ] || { echo "❌ respuesta vacía"; exit 65; }
CARRIL=$(printf '%s' "$FILA" | cut -f3)
URL=$(printf '%s' "$FILA" | cut -f6)
esc() { sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g'; }
case "$ESTADO" in
  listo)       CORTO="✅ Listo";          CABEZA="<b>Claude terminó tu pedido</b>" ;;
  necesita-ok) CORTO="🙋 Falta tu ok";    CABEZA="<b>Claude necesita tu ok</b>" ;;
  no-se-pudo)  CORTO="⚠️ No se pudo";     CABEZA="<b>Claude no pudo con tu pedido</b>" ;;
esac
# La PRIMERA línea es la que la aduana guarda cuando él está de noche o en un bloque: la corta a
# 90 BYTES sin HTML (`cut -c` de GNU cuenta bytes, no letras). Tiene que alcanzar sola para saber
# qué pedido es y dónde verlo. Un emoji ocupa 3 a 6 bytes y el link real de una sesión, 55: con
# «🙋 Necesita tu ok» eran 92 y el link quedaba cortado (verificación del 1-oct). Si igual no
# entra, queda solo el emoji: el id y el link enteros valen más que la palabra.
PRIMERA="$CORTO · $PEDIDO · $(printf '%s' "${URL:-(sin link)}" | esc)"
[ "$(printf '%s' "$PRIMERA" | wc -c)" -le 90 ] \
  || PRIMERA="${CORTO%% *} $PEDIDO · $(printf '%s' "${URL:-(sin link)}" | esc)"
MSG="$PRIMERA
$CABEZA ($CARRIL)

$(printf '%s' "$TEXTO" | esc)"

if ONIA_AVISO=interrumpe ONIA_AVISO_CLAVE="pedido-$PEDIDO-$ESTADO" ONIA_AVISO_EMISOR=claude \
     "$TG" "$MSG" </dev/null >/dev/null 2>&1; then
  printf '%s\t%s\t%s\n' "$(date -u +%s)" "$PEDIDO" "$ESTADO" >> "$PEDIDOS_DIR/respuestas.tsv"
  echo "✅ respuesta de $PEDIDO entregada a la aduana ($ESTADO)"
else
  echo "❌ la aduana no la aceptó"; exit 1
fi
