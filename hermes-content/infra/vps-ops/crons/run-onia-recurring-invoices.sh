#!/bin/sh
# Emision diaria de facturas recurrentes de ONIA Platform.
# Llama al cron interno de la app (/api/cron/recurring-invoices), que busca
# toda RecurringInvoice ACTIVE con nextRunAt vencido, crea por cada una una
# Invoice en estado BORRADOR con su correlativo, avanza nextRunAt (y la pasa a
# ENDED si llego a endDate) y avisa a n8n para que WF-03 la entregue.
#
# Vivia SOLO en vercel.json. El deploy de Vercel esta cortado y apuntaba al
# Supabase de la nube: este trabajo NUNCA corrio contra produccion.
#
# Por que el chequeo de "failed" y no solo el http: la ruta atrapa el error de
# CADA factura por separado (lo manda a Sentry) y igual devuelve 200. Un 200
# con failed=3 son tres clientes que este mes no recibieron su factura. Es
# plata, y fallaria en silencio.
# Reintento seguro: cada factura se crea dentro de una transaccion junto con el
# avance de nextRunAt, asi que la que falla queda vencida y la corrida
# siguiente (o una a mano) la vuelve a tomar. No duplica.
set -e
CRON_SECRET=$(grep -E '^CRON_SECRET=' /opt/onia-platform/app.env | cut -d= -f2-)
STAMP=$(date -Iseconds)
RESP=$(curl -s -o /tmp/onia-recurring-invoices-cron-last.json -w '%{http_code}' \
  -H "Authorization: Bearer $CRON_SECRET" \
  https://app.onia.com.bo/api/cron/recurring-invoices)
BODY=$(cat /tmp/onia-recurring-invoices-cron-last.json 2>/dev/null)
if [ "$RESP" != "200" ]; then
  echo "$STAMP FAIL http=$RESP body=$BODY"
  exit 1
fi
# Vacio si el campo no vino: se trata como fallo, mejor ruidoso que ciego.
FAILED=$(echo "$BODY" | sed -n 's/.*"failed":\([0-9]*\).*/\1/p')
if [ "$FAILED" != "0" ]; then
  echo "$STAMP FAIL http=$RESP facturas_fallidas=$FAILED body=$BODY"
  exit 1
fi
echo "$STAMP OK http=$RESP body=$BODY"
