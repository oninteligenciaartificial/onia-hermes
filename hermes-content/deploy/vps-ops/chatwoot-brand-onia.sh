#!/usr/bin/env bash
# ONIA — mantiene la marca Onia sobre Chatwoot. Chatwoot es el MOTOR y esta hecho
# para NO verse; este script es lo unico que lo sostiene.
#
# Contra quien pelea: `Internal::ReconcilePlanConfigService`, que en las instalaciones
# `community` restaura la marca de fabrica desde
# `enterprise/config/premium_installation_config.yml`. Paso el 2026-08-18: el pie del
# widget volvio a decir "Desarrollado por Chatwoot" en horas.
#
# 2026-08-31 — POR QUE SON NUEVE Y NO TRES. Hasta hoy este script re-aplicaba solo
# INSTALLATION_NAME, BRAND_NAME y WIDGET_BRAND_URL. Leido el YML del contenedor, el
# reconcile restaura DIEZ claves, y las que faltaban ya se habian perdido sin que nadie
# lo viera: BRAND_URL, TERMS_URL y PRIVACY_URL apuntaban a www.chatwoot.com desde el
# 16-ago, y salen en el HTML publico de https://chat.onia.com.bo/app/login (el front
# embebe el objeto de config). Los tres LOGO tampoco estaban defendidos: sobrevivian
# por suerte, no por diseño.
# La decima, DISPLAY_MANIFEST, se deja afuera a proposito: no es marca, y su valor de
# fabrica (true) es el que queremos igual.
#
#   uso:  chatwoot-brand-onia.sh            aplica lo que falte (idempotente) — es el cron
#         chatwoot-brand-onia.sh --check    NO escribe; sale 1 si el reconcile gano algo
#
# Cron del VPS: `17 * * * * /root/bin/chatwoot-brand-onia.sh >> /var/log/chatwoot-brand-onia.log 2>&1`
set -uo pipefail

MODO="${1:-aplicar}"

CW=$(docker ps --format "{{.Names}}" | grep "onia-chatbot_chatwoot\.1" | head -1)
[ -z "$CW" ] && exit 0

# El `| tail -1` que tenia antes se comia la salida entera: el log quedaba con el INFO
# de rake y JAMAS pudo mostrar que la marca habia sido revertida. Ahora se filtra el
# ruido conocido y se deja pasar lo nuestro.
docker exec -e ONIA_BRAND_MODE="$MODO" "$CW" bundle exec rails runner '
  marca = {
    "INSTALLATION_NAME" => "Onia",
    "BRAND_NAME"        => "Onia",
    "BRAND_URL"         => "https://onia.com.bo",
    "WIDGET_BRAND_URL"  => "https://onia.com.bo",
    "TERMS_URL"         => "https://onia.com.bo/terminos",
    "PRIVACY_URL"       => "https://onia.com.bo/privacidad",
    "LOGO"              => "https://app.onia.com.bo/onia-logo.svg",
    "LOGO_DARK"         => "https://app.onia.com.bo/onia-logo-white.svg",
    "LOGO_THUMBNAIL"    => "https://onia.com.bo/apple-icon.png",
  }
  solo_mirar = ENV["ONIA_BRAND_MODE"] == "--check"
  perdidas = []
  marca.each do |clave, valor|
    config = InstallationConfig.find_or_initialize_by(name: clave)
    next if config.value == valor
    perdidas << "#{clave}: #{config.value.inspect}"
    next if solo_mirar
    config.value = valor
    config.save!
  end
  GlobalConfig.clear_cache unless solo_mirar || perdidas.empty?
  if perdidas.empty?
    puts "[marca-onia] intacta (#{marca.size} configs)"
  else
    puts "[marca-onia] #{solo_mirar ? "REVERTIDAS" : "re-aplicadas"} #{perdidas.size}/#{marca.size}:"
    perdidas.each { |p| puts "[marca-onia]   #{p}" }
    exit 1 if solo_mirar
  end
' 2>&1 | grep -v "ip_lookup:setup"
