#!/usr/bin/env bash
# ONIA — re-aplica la marca Onia al widget de Chatwoot. El job interno
# ReconcilePlanConfigService la restaura solo (paso el 2026-08-18: el pie
# volvio a decir "Desarrollado por Chatwoot" en horas). Idempotente, cada hora.
CW=$(docker ps --format "{{.Names}}" | grep "onia-chatbot_chatwoot\.1" | head -1)
[ -z "$CW" ] && exit 0
docker exec "$CW" bundle exec rails runner "
  { \"INSTALLATION_NAME\" => \"Onia\", \"BRAND_NAME\" => \"Onia\", \"WIDGET_BRAND_URL\" => \"https://onia.com.bo\" }.each do |k, v|
    c = InstallationConfig.find_or_initialize_by(name: k)
    c.value = v
    c.save! if c.changed?
  end
  GlobalConfig.clear_cache
" 2>&1 | tail -1
