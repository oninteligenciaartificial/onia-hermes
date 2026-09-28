#!/usr/bin/env bash
# Demo en vivo del video 04 - los tres verdes del caso real de la pantalla de entrar.
# Reproduce el bug de produccion (2026-08-15): la fuente de iconos no carga y la pantalla
# muestra "credit_card_off" como texto, mientras el grep y el HTTP dan verde.
# Correr desde esta carpeta. Se graba la terminal + el navegador al lado.
set -u
cd "$(dirname "$0")"

echo
echo "  PRUEBA 1 - busco los textos adentro del archivo"
for t in "Conexion protegida" "No pedimos tarjeta" "verified_user" "credit_card_off"; do
  grep -q "${t/Conexion/Conexión}" login.html && echo "     OK   $t"
done
echo "     => VERDE"
sleep 1

echo
echo "  PRUEBA 2 - pregunto si la pagina responde"
python -c "
import http.server,threading,urllib.request,socketserver,functools
s=socketserver.TCPServer(('127.0.0.1',8731),functools.partial(http.server.SimpleHTTPRequestHandler))
s.allow_reuse_address=True
threading.Thread(target=s.serve_forever,daemon=True).start()
r=urllib.request.urlopen('http://127.0.0.1:8731/login.html',timeout=5)
print('     HTTP',r.status,'-',len(r.read()),'bytes')
" 2>/dev/null
echo "     => VERDE"
sleep 1

echo
echo "  PRUEBA 3 - la abro y la MIRO"
echo "     (abrir prueba3-mirala.png, o login.html en el navegador)"
echo "     => los iconos se leen: verified_user / credit_card_off"
echo
echo "  Dos instrumentos dijeron que estaba bien. Ninguno la habia mirado."
echo
