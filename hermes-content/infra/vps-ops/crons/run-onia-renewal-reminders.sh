#!/bin/sh
# Recordatorios de RENOVACION del plan pago (D-7, D-3, D-1 y vencido) — cron
# REAL del VPS. Con pago por QR manual no hay debito automatico: la recurrencia
# de los cobros ES este aviso + el checkout que ya acepta renovar sin perder
# dias (extendPlanEnd arranca de max(planEnd, hoy)).
#
# Mismo patron que /root/bin/run-onia-trial-drip.sh (diario, idempotente por
# claim UNIQUE org+venceEl+step: repetir la corrida no duplica nada).
#
# INSTALACION EN EL VPS (root@187.77.16.63) — DESPUES de deployar esta rama y
# de aplicar la migracion 20260911010000_add_onia_renewal_reminder_sends (sin
# la tabla el endpoint responde "migracion_pendiente" y no manda nada):
#
#   scp scripts/cron/run-onia-renewal-reminders.sh \
#       root@187.77.16.63:/root/bin/run-onia-renewal-reminders.sh
#   ssh root@187.77.16.63 'chmod 700 /root/bin/run-onia-renewal-reminders.sh'
#   ssh root@187.77.16.63 '(crontab -l; echo "# Renovacion de planes Onia Platform (D-7/D-3/D-1/vencido), diario 08:05 La Paz"; echo "5 12 * * * /root/bin/run-onia-renewal-reminders.sh >> /var/log/onia-renewal-reminders.log 2>&1") | crontab -'
#
# 08:05 La Paz (12:05 UTC): horario de oficina — un aviso de plata a las 3 de
# la maniana se lee como spam.

SECRET=$(grep "^CRON_SECRET=" /opt/onia-platform/app.env | cut -d= -f2 | tr -d "\"\r")
curl -fsS --max-time 120 -H "Authorization: Bearer $SECRET" https://app.onia.com.bo/api/cron/renewal-reminders
