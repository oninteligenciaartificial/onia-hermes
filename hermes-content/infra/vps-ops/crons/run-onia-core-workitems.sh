#!/bin/sh
# Generacion diaria de work items de ONIA Core.
# Llama al cron interno de la app (/api/cron/onia-core-workitems), que corre
# runWorkItemGenerators() sobre todas las orgs y crea el pendiente con dueno
# que sale del dominio: cita NO_ASISTIO en las ultimas 48h -> seguimiento,
# factura vencida -> cobro, presupuesto quieto 7 dias -> seguimiento, y el
# recordatorio fiscal del Contador Pack (declarar IVA/IT cuando el vencimiento
# del NIT de la org esta a <= 5 dias; org sin NIT se saltea).
# El dedupe de work-items.ts hace la corrida idempotente: repetirla no duplica
# nada, asi que se puede lanzar a mano sin miedo.
#
# Vivia SOLO en vercel.json. El deploy de Vercel esta cortado y apuntaba al
# Supabase de la nube: este trabajo NUNCA corrio contra produccion.
#
# Por que el chequeo de "errors" y no solo el http: la ruta devuelve 500 solo
# si revienta entera; si falla la generacion de UNA org, la suma sale en
# "errors" y la respuesta sigue siendo 200. Esa org se queda sin pendientes
# ese dia y nadie se entera.
set -e
CRON_SECRET=$(grep -E '^CRON_SECRET=' /opt/onia-platform/app.env | cut -d= -f2-)
STAMP=$(date -Iseconds)
RESP=$(curl -s -o /tmp/onia-core-workitems-cron-last.json -w '%{http_code}' \
  -H "Authorization: Bearer $CRON_SECRET" \
  https://app.onia.com.bo/api/cron/onia-core-workitems)
BODY=$(cat /tmp/onia-core-workitems-cron-last.json 2>/dev/null)
if [ "$RESP" != "200" ]; then
  echo "$STAMP FAIL http=$RESP body=$BODY"
  exit 1
fi
# Vacio si el campo no vino: se trata como fallo, mejor ruidoso que ciego.
ERRORS=$(echo "$BODY" | sed -n 's/.*"errors":\([0-9]*\).*/\1/p')
if [ "$ERRORS" != "0" ]; then
  echo "$STAMP FAIL http=$RESP orgs_con_error=$ERRORS body=$BODY"
  exit 1
fi
echo "$STAMP OK http=$RESP body=$BODY"
