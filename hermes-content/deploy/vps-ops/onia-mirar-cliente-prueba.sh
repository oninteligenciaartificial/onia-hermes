#!/usr/bin/env bash
# ONIA - prueba de que el monitor SI dispara. Inyecta el fallo real (una pagina
# con iconos de Material Symbols y la fuente ausente: el navegador cae al
# respaldo y dibuja la LIGADURA como palabra) mas una URL que no existe.
#
# Usa su propio archivo de estado: NO toca el estado de produccion.
# Manda 1 mensaje de prueba a Telegram (los nombres empiezan con PRUEBA).
#
# Correr:  /root/bin/onia-mirar-cliente-prueba.sh
# Esperado: exit=1, "aviso a Telegram: ENVIADO", y en el mensaje
#           'credit_card_off' con razon > 2.5 (en sano da 1.00).
set -uo pipefail

set -a
# shellcheck disable=SC1091
. /root/.hermes/.env
set +a

ROTO=$(mktemp /tmp/mirar-roto-XXXX.html)
cat > "$ROTO" <<'HTML'
<!doctype html><meta charset=utf-8><title>login roto</title>
<style>.material-symbols-outlined{font-family:"Material Symbols Outlined";font-size:24px}</style>
<h1>Hola de nuevo</h1><p>Iniciar sesion</p>
<span class=material-symbols-outlined>credit_card_off</span>
<span class=material-symbols-outlined>verified_user</span>
<span class=material-symbols-outlined>smart_toy</span>
HTML

export MIRAR_ESTADO="$(mktemp /tmp/mirar-estado-XXXX.json)"
rm -f "$MIRAR_ESTADO"
export MIRAR_SUPERFICIES="[
  {\"nombre\":\"PRUEBA app/login (fuente de iconos caida)\",\"url\":\"file://$ROTO\",\"textoEsperado\":[\"Hola de nuevo\"],\"minIconos\":1},
  {\"nombre\":\"PRUEBA web (url inexistente)\",\"url\":\"https://onia.com.bo/esta-url-no-existe-monitor-test\",\"textoEsperado\":[\"Tu negocio no pierde\"],\"minIconos\":0}
]"

node /root/bin/onia-mirar-cliente.mjs > /dev/null
codigo=$?
echo "exit=$codigo (1 = detecto el fallo, que es lo que se espera aca)"
rm -f "$ROTO" "$MIRAR_ESTADO"
[ "$codigo" -eq 1 ]
