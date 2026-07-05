#!/bin/sh
# ONIA VPS healthcheck. Emits one JSON line: {"ok":bool,"disk":pct,"mem":pct,"problems":"..."}
# Used by the n8n workflow "ONIA - VPS Healthcheck". Alerta a Telegram solo si ok=false.
UP=$(docker ps --format '{{.Names}} {{.Status}}')
REQ="n8n onia-center traefik dentalgest-staging-supabase-db onia-chatbot_chatwoot.1 litellm"
down=""
for r in $REQ; do
  echo "$UP" | grep -F "$r" | grep -q "Up" || down="$down $r"
done
disk=$(df / | awk 'NR==2{gsub(/%/,"",$5); print $5}')
mem=$(free | awk '/Mem:/{printf "%d", $3/$2*100}')
probs=""
[ "$disk" -ge 85 ] && probs="$probs disco=${disk}%"
[ "$mem" -ge 92 ] && probs="$probs mem=${mem}%"
[ -n "$down" ] && probs="$probs caidos:$(echo $down | xargs | tr ' ' ,)"
ok=true
[ -n "$probs" ] && ok=false
printf '{"ok":%s,"disk":%s,"mem":%s,"problems":"%s"}\n' "$ok" "$disk" "$mem" "$(echo $probs | xargs)"
