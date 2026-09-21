#!/bin/sh
# Corrida diaria de los agentes ONIA Platform (Recall + Cobrador, C3).
# Llama al cron interno de la app (/api/cron/onia-agents), que corre
# runAgentsForAllOrgs() para toda org con entitlement module.agents=active
# y deja propuestas en onia_agents_actions -> onia_core_approval_requests
# (siempre human-in-the-loop, nunca envia nada solo).
set -e
CRON_SECRET=$(grep -E '^CRON_SECRET=' /opt/onia-platform/app.env | cut -d= -f2-)
STAMP=$(date -Iseconds)
RESP=$(curl -s -o /tmp/onia-agents-cron-last.json -w '%{http_code}' \
  -H "Authorization: Bearer $CRON_SECRET" \
  https://app.onia.com.bo/api/cron/onia-agents)
if [ "$RESP" != "200" ]; then
  echo "$STAMP FAIL http=$RESP body=$(cat /tmp/onia-agents-cron-last.json 2>/dev/null)"
  exit 1
fi
echo "$STAMP OK http=$RESP body=$(cat /tmp/onia-agents-cron-last.json)"
