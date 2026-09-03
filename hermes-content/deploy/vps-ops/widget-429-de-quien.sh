#!/bin/sh
# ¿El 429 del widget de Chatwoot es una CAÍDA para el cliente, o nos lo hicimos nosotros?
#
# Nace del 2026-09-03. El canario visual reportó tres veces un ítem 🔴 —"la página que VENDE
# el chatbot es la única del sitio sin chat"— con capturas de verdad: el widget devolvía 429 y
# no cargaba. El ítem consumió cuatro vueltas de `onia-cola` sin cerrarse.
#
# Medido: el 429 es REAL, pero NO es del cliente. Chatwoot limita `/widget` sin `cw_conversation`
# a 5 cargas por hora POR IP (config/initializers/rack_attack.rb, `limit: 5, period: 1.hour`,
# sin variable de entorno que lo cambie). En 6 h hubo 222 peticiones a `/widget` desde UNA sola
# IP: 187.77.16.63, la del propio VPS — nuestros loops mirando las pantallas. Cero visitantes.
# Cada visitante real cuenta con SU IP y su propio cupo, así que su chat abre normal.
#
# Es el mismo modo de falla que el prompt del canario ya documenta: el instrumento se mide a sí
# mismo y reporta su propia huella como una caída del producto. Esta sonda existe para que la
# próxima vuelta no vuelva a derivarlo: contesta en segundos y con el contador a la vista.
#
# Uso:  sh widget-429-de-quien.sh
# Sale 0 siempre: es un diagnóstico, no un gate. El veredicto va en la última línea.

set -u

HOST=${CHATWOOT_HOST:-https://onia-chatbot-chatwoot.hqdqgh.easypanel.host}
TOKEN=${CHATWOOT_WEBSITE_TOKEN:-9k5i7xnAgCbSse1EZwVChZLw}
RED=${CHATWOOT_REDIS:-onia-chatbot_chatwoot-redis.1.vtrasu9ng3og2a4327rv259aq}
APP=${CHATWOOT_APP:-onia-chatbot_chatwoot.1.q6oa1xg9j70zfc2obmrrmoxzw}
# La IP pública del VPS. Si el contador está a nombre de ESTA, el 429 es nuestro.
NUESTRA_IP=${ONIA_VPS_IP:-187.77.16.63}

echo "== 1. ¿El servicio está vivo, o está caído de verdad? =="
for ruta in "/" "/packs/js/sdk.js"; do
  printf '   %-22s HTTP %s\n' "$ruta" "$(curl -s -o /dev/null -w '%{http_code}' "$HOST$ruta")"
done
WIDGET=$(curl -s -o /dev/null -w '%{http_code}' "$HOST/widget?website_token=$TOKEN")
printf '   %-22s HTTP %s\n' "/widget" "$WIDGET"
echo "   (host 200 + widget 429 = throttle puntual, NO un servicio caído)"

echo
echo "== 2. ¿A nombre de QUÉ IP está el contador del throttle? =="
# La clave de Rack::Attack termina en la IP contada. Una clave por IP: si sólo aparece la
# nuestra, ningún visitante real llegó al límite.
CLAVES=$(docker exec "$RED" sh -c \
  'redis-cli -a "$REDIS_PASSWORD" --no-auth-warning --scan --pattern "*attack*widget*" 2>/dev/null' \
  2>/dev/null)
if [ -z "$CLAVES" ]; then
  echo "   (sin contador vivo: la ventana de 1 h se venció, nadie está limitado ahora mismo)"
else
  for k in $CLAVES; do
    v=$(docker exec "$RED" sh -c \
      "redis-cli -a \"\$REDIS_PASSWORD\" --no-auth-warning get '$k'" 2>/dev/null)
    printf '   %-18s %s cargas (el límite es 5/hora)\n' "${k##*:}" "$v"
  done
fi

echo
echo "== 3. ¿Quién pidió /widget en las últimas 6 h? =="
docker logs --since 6h "$APP" 2>&1 \
  | grep -aoE 'Started GET "/widget[^"]*" for [0-9.]+' \
  | grep -oE '[0-9.]+$' | sort | uniq -c | sort -rn \
  | while read -r n ip; do printf '   %-18s %s peticiones\n' "$ip" "$n"; done

echo
AJENAS=$(docker logs --since 6h "$APP" 2>&1 \
  | grep -aoE 'Started GET "/widget[^"]*" for [0-9.]+' \
  | grep -oE '[0-9.]+$' | grep -vc "^${NUESTRA_IP}$")

echo "== VEREDICTO =="
if [ "$WIDGET" != "429" ]; then
  echo "   El widget responde $WIDGET: no hay throttle activo. Nada que diagnosticar."
elif [ "$AJENAS" -eq 0 ]; then
  echo "   AUTOINDUCIDO. El 429 es real pero se lo hizo el VPS solo ($NUESTRA_IP): en 6 h"
  echo "   ninguna IP ajena pidió el widget. Un visitante real abre el chat sin problema."
  echo "   NO es un ítem de producto. Lo que sí conviene: safelistear nuestra IP para que"
  echo "   el canario vuelva a ver lo que ve un cliente (ver el radar, decisión de Sergio)."
else
  echo "   OJO: $AJENAS peticiones vinieron de IPs ajenas. Puede haber clientes afectados de"
  echo "   verdad — mirar el desglose del punto 3 antes de descartarlo como ruido nuestro."
fi
