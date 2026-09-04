#!/usr/bin/env bash
# ONIA — cierra el login OAuth de Higgsfield con la URL de retorno que el navegador
# de Sergio no pudo abrir.
#
# Uso:  /root/bin/hf-login-finish.sh 'http://localhost:8765/callback?code=...&state=...'
#
# El listener (hf-login-start.sh) espera en localhost:8765 del VPS. Cuando Sergio
# autoriza desde el telefono, Clerk lo manda a esa direccion — que en su telefono
# no existe. La URL entera (con code y state) se le entrega al listener con curl
# desde ACA, que es donde localhost:8765 si existe. El intercambio PKCE lo hace el
# CLI; el code sirve una sola vez y caduca en minutos.
set -uo pipefail
export HOME=/root
URL="${1:?uso: hf-login-finish.sh '<url de retorno con code y state>'}"
case "$URL" in
  http://localhost:8765/callback?*|http://127.0.0.1:8765/callback?*) ;;
  *) echo "eso no es la URL de retorno (tiene que empezar con http://localhost:8765/callback?)"; exit 2 ;;
esac
if ! ss -ltn 2>/dev/null | grep -q ':8765 '; then
  echo "el listener NO esta escuchando en 8765: corre primero /root/bin/hf-login-start.sh y volve a autorizar"; exit 3
fi
echo "entregando el code al listener..."
curl -s --max-time 30 "$URL" | head -c 300; echo
sleep 3
echo "--- resultado del CLI:"; tail -c 400 /root/hf-login.out; echo
echo "--- sesion:"; timeout 30 higgsfield account status 2>&1 | head -2
if timeout 30 higgsfield account status 2>/dev/null | grep -q credits; then
  /root/bin/onia-tg.sh "✅ <b>Higgsfield</b>: sesión renovada en el VPS. Lucía vuelve a poder generar." >/dev/null 2>&1 || true
  echo "OK: sesion renovada"
else
  echo "FALLO: el CLI sigue sin sesion — ver /root/hf-login.out"; exit 1
fi
