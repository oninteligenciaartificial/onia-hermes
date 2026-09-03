#!/usr/bin/env bash
# Vigia de leads — cada 2 h. Mira access_requests (solicitudes de acceso del
# producto, la tabla detras de /admin/solicitudes) en la base self-hosted y
# avisa a Telegram si entro una solicitud nueva, con los datos para contactarla.
# El primer lead real (2026-08-21) casi se pierde por no tener este aviso.
# Solo LECTURA. Cron: 9 */2 * * *   Log: /var/log/onia-leads-vigia.log
set -uo pipefail
MARCA=/root/loops/estado/leads.ultima-marca
PSQL=(docker exec supabase-db psql -U postgres -d postgres -tA)

# Primera corrida: fijar marca en ahora y no barrer el historico.
if [ ! -f "$MARCA" ]; then
  date -u +'%Y-%m-%d %H:%M:%S+00' > "$MARCA"
  echo "$(date -u +%FT%TZ) primera corrida: marca inicializada, sin aviso"
  exit 0
fi

DESDE=$(cat "$MARCA")
NUEVOS=$("${PSQL[@]}" -c "select count(*) from access_requests where \"createdAt\" > '$DESDE'") || {
  echo "$(date -u +%FT%TZ) FALLO consultando la base"; exit 1; }

if [ "$NUEVOS" -gt 0 ]; then
  DETALLE=$("${PSQL[@]}" -F' · ' -c "select name, \"businessName\", whatsapp, city, coalesce(src,'sin origen') from access_requests where \"createdAt\" > '$DESDE' order by \"createdAt\" limit 5" \
    | sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g')
  /root/bin/onia-tg.sh "🟢 <b>$NUEVOS solicitud(es) de acceso NUEVA(S)</b> en /admin/solicitudes — contactar antes de que se enfrie:
<pre>$DETALLE</pre>" >/dev/null
  echo "$(date -u +%FT%TZ) $NUEVOS nuevas avisadas"
else
  echo "$(date -u +%FT%TZ) sin solicitudes nuevas"
fi

date -u +'%Y-%m-%d %H:%M:%S+00' > "$MARCA"
