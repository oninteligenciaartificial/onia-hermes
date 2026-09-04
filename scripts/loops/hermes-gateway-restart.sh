#!/usr/bin/env bash
# Reinicia el gateway de Hermes con SUS comandos, no con pkill.
# 2026-09-03: matar con pkill dejaba vivo al supervisor del propio Hermes, que
# relanzaba al hijo mientras este script lanzaba otro -> "Gateway (re)started 6
# times in 120s", dos instancias peleando por Telegram. `gateway stop` apaga al
# supervisor y al hijo juntos; `gateway run` arranca uno solo.
export HOME=/root; cd /root
H="/usr/local/lib/hermes-agent/venv/bin/python -m hermes_cli.main"
timeout 60 $H gateway stop >/dev/null 2>&1; sleep 3
setsid nohup $H gateway run >>/var/log/hermes-gateway.log 2>&1 < /dev/null &
sleep 8
n=$(pgrep -cf "hermes_cli.main gateway run"); echo "gateway: $n proceso(s)"
[ "$n" -ge 1 ] && [ "$n" -le 2 ]
