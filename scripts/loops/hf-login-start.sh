#!/usr/bin/env bash
# ONIA — arranca el login OAuth de Higgsfield en el VPS (headless) y deja la URL.
#
# El CLI oficial solo sabe "browser-based OAuth login" con callback a localhost.
# En un VPS sin navegador la salida es: arrancar el listener ACA, mandarle la URL
# a Sergio, que se autorice desde cualquier dispositivo, y la URL de retorno
# (http://localhost:8765/callback?code=...&state=...) —que su navegador no puede
# abrir— se la entrega a este listener con curl (ver hf-login-finish.sh).
#
# Vive en un script, no en una linea de ssh, porque `pkill -f` matchea la linea
# de comando del que lo invoca: tres sesiones muertas el 2026-09-03 por ese
# patron.
set -uo pipefail
export HOME=/root
cd /root
pkill -f "higgsfield auth login" 2>/dev/null
rm -f /root/hf-login.out /root/hf-login.url
setsid nohup higgsfield auth login --port 8765 --json > /root/hf-login.out 2>&1 < /dev/null &
sleep 5
echo "listener: $(pgrep -cf 'higgsfield auth login') proceso(s) | puerto 8765: $(ss -ltn 2>/dev/null | grep -c ':8765 ')"
grep -oE 'https://[^ "]+' /root/hf-login.out | head -1 > /root/hf-login.url
echo "--- salida del CLI:"; head -c 600 /root/hf-login.out; echo
echo "--- URL: $(wc -c < /root/hf-login.url) bytes"
