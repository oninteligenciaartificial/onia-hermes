# Tapa secretos y datos personales ANTES de que una salida del VPS llegue al log de
# GitHub Actions. Lo usan los dos lados: el script remoto (comun.sh) y una segunda
# pasada en el runner (hermes-jarvis.yml). Dos pasadas a propósito: si una falla, la
# otra sigue tapando.
#
# Qué tapa: token de bot de Telegram, claves sk-/pk-/rk-, valores de campos que se
# llaman token/key/secret/password, cadenas largas tipo base64, correos, teléfonos
# bolivianos y chat ids de Telegram.
s/[0-9]{8,10}:[A-Za-z0-9_-]{30,}/<TOKEN_BOT>/g
s/(sk|pk|rk)-[A-Za-z0-9_-]{16,}/<CLAVE>/g
s/(bearer|token|apikey|api_key|secret|password|passwd|clave)([=: "']+)[^ "'&,}]{6,}/\1\2<OCULTO>/Ig
s/[A-Za-z0-9+\/_-]{40,}={0,2}/<LARGO>/g
s/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/<CORREO>/g
s/\+?591[ -]?[67][0-9]{7}/<TEL>/g
s/(^|[^0-9])[67][0-9]{7}([^0-9]|$)/\1<TEL>\2/g
s/(chat_id|chat|channel|CHAT_ID|CHANNEL)([=: "']+)-?[0-9]{6,}/\1\2<CHAT>/Ig
s/(^|[^0-9])-?100[0-9]{10}([^0-9]|$)/\1<CHAT>\2/g
