#!/bin/sh
# Recordatorios de cita (24 h y 2 h antes) — cron REAL del VPS.
#
# Los crons de vercel.json NO corren: produccion es el VPS de Hostinger, no
# Vercel. Por eso la promesa de "recordatorios automaticos" no se cumplia: el
# endpoint existia y estaba deployado, pero nadie lo llamaba nunca.
#
# Mismo patron que /root/bin/run-onia-trial-drip.sh (ese si corre).
#
# INSTALACION EN EL VPS (root@187.77.16.63) — DESPUES de deployar esta rama:
#
#   scp scripts/cron/run-onia-appointment-reminders.sh \
#       root@187.77.16.63:/root/bin/run-onia-appointment-reminders.sh
#   ssh root@187.77.16.63 'chmod 700 /root/bin/run-onia-appointment-reminders.sh'
#   ssh root@187.77.16.63 '(crontab -l; echo "# Recordatorios de cita Onia Platform (24 h y 2 h antes), cada 15 min"; echo "*/15 * * * * /root/bin/run-onia-appointment-reminders.sh >> /var/log/onia-appointment-reminders.log 2>&1") | crontab -'
#
# NO instalar antes del deploy: produccion corre todavia la version que marca
# el recordatorio DESPUES de enviarlo, y a 4 corridas por hora eso le manda al
# paciente el mismo recordatorio varias veces.
#
# Cada 15 minutos y no una vez al dia: la ventana de las 2 h dura una hora, un
# cron diario no la alcanza nunca. La corrida es idempotente (reclama la ventana
# con un compare-and-set antes de enviar), asi que repetirla no duplica nada.

SECRET=$(grep "^CRON_SECRET=" /opt/onia-platform/app.env | cut -d= -f2 | tr -d "\"\r")
curl -fsS --max-time 120 -H "Authorization: Bearer $SECRET" https://app.onia.com.bo/api/cron/appointment-reminders
