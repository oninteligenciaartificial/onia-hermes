#!/usr/bin/env bash
# Deja nodo-casa administrable desde el VPS, y arregla el PATH del shim de docker.
# Se corre UNA vez, con sudo, en nodo-casa. Es idempotente: correrlo dos veces no rompe.
set -uo pipefail
VPS=root@187.77.16.63
LLAVE=/root/.ssh/onia_hermes_vps_ed25519
S=$(ssh -i "$LLAVE" -o BatchMode=yes -o StrictHostKeyChecking=accept-new -o ConnectTimeout=20 "$VPS" true 2>&1) || { echo "no llego al VPS: $S"; exit 1; }

[ -f /root/.onia-nodo ] || { echo "ESTA NO ES nodo-casa. No toco nada."; exit 1; }
echo "== nodo: $(cat /root/.onia-nodo) · $(hostname)"

echo
echo "== 1/5 · docker en el PATH de cron"
ln -sf /root/bin/docker /usr/bin/docker
echo "   docker resuelve a: $(command -v docker)"
docker ps --format '{{.Names}}' 2>/dev/null | grep -qE 'supabase-db|onia-platform' \
  && echo "   ve los contenedores del VPS: OK" || echo "   AVISO: no vio supabase-db/onia-platform"

echo
echo "== 2/5 · sshd local, atado a 127.0.0.1 (no a tu red de casa)"
command -v sshd >/dev/null 2>&1 || { echo "   instalando openssh-server..."; DEBIAN_FRONTEND=noninteractive apt-get update -qq >/dev/null 2>&1; DEBIAN_FRONTEND=noninteractive apt-get install -y -qq openssh-server >/dev/null 2>&1; }
install -d -m 755 /etc/ssh/sshd_config.d
cat > /etc/ssh/sshd_config.d/99-onia-nodo.conf <<CONF
# Solo por el tunel inverso hacia el VPS. NO se expone a la red de casa.
ListenAddress 127.0.0.1
PermitRootLogin prohibit-password
PasswordAuthentication no
CONF
echo "   escucha solo en 127.0.0.1, sin contrasena, solo llave"

echo
echo "== 3/5 · autorizar la llave del VPS (la baja este nodo, no pasa por el chat)"
install -d -m 700 /root/.ssh
PUB=$(ssh -i "$LLAVE" -o BatchMode=yes -o StrictHostKeyChecking=accept-new "$VPS" 'cat /root/vps-a-nodo.pub')
[ -n "$PUB" ] || { echo "   no pude bajar la llave publica"; exit 1; }
touch /root/.ssh/authorized_keys; chmod 600 /root/.ssh/authorized_keys
grep -qF "$PUB" /root/.ssh/authorized_keys || printf '%s\n' "$PUB" >> /root/.ssh/authorized_keys
echo "   huella autorizada: $(printf '%s' "$PUB" | ssh-keygen -lf - | awk '{print $2}')"
systemctl enable --now ssh >/dev/null 2>&1 || service ssh start >/dev/null 2>&1
sleep 2
ss -ltn 2>/dev/null | grep -q '127.0.0.1:22 ' && echo "   sshd escuchando en 127.0.0.1:22" || echo "   AVISO: sshd no parece estar escuchando"

echo
echo "== 4/5 · tunel inverso: este nodo abre la puerta, el VPS entra por ella"
cat > /root/bin/onia-tunel-inverso.sh <<'TUN'
#!/usr/bin/env bash
# El nodo no recibe conexiones, pero SI sale. Este tunel da vuelta esa flecha:
# publica su sshd en 127.0.0.1:2222 del VPS, que con GatewayPorts=no queda
# alcanzable solo desde adentro del VPS. Sin esto, cada cambio en este nodo
# cuesta un viaje a su teclado — el 2026-09-06 costo cuatro.
# El pgrep va con corchete: sin el, se encuentra a si mismo y nunca reconecta.
set -uo pipefail
pgrep -f "[o]nia-tunel-ssh" >/dev/null && exit 0
exec ssh -N -T -o ExitOnForwardFailure=yes -o ServerAliveInterval=30 \
  -o ServerAliveCountMax=3 -o StrictHostKeyChecking=accept-new -o BatchMode=yes \
  -i /root/.ssh/onia_hermes_vps_ed25519 \
  -R 127.0.0.1:2222:127.0.0.1:22 root@187.77.16.63 -o SetEnv=onia-tunel-ssh=1
TUN
chmod 755 /root/bin/onia-tunel-inverso.sh
CT=$(crontab -l 2>/dev/null | grep -v "onia-tunel-inverso.sh")
printf '%s\n*/5 * * * * /root/bin/onia-tunel-inverso.sh >/dev/null 2>&1\n@reboot /root/bin/onia-tunel-inverso.sh >/dev/null 2>&1\n' "$CT" | grep -v '^$' | crontab -
echo "   cron: cada 5 min y al arrancar"
setsid nohup /root/bin/onia-tunel-inverso.sh >/dev/null 2>&1 < /dev/null &
sleep 4

echo
echo "== 5/5 · verificacion"
pgrep -f "[o]nia-tunel-ssh" >/dev/null && echo "   tunel vivo" || echo "   AVISO: el tunel no quedo corriendo"
echo "   loops en cron: $(crontab -l | grep -cE '^[^#].*onia-loop\.sh ')"
cd /root/loops/onia-hermes 2>/dev/null && node scripts/loops_registrados.mjs 2>&1 | sed 's/^/   /'
echo
echo "LISTO. Deciles que prueben desde el VPS:  ssh -i /root/.ssh/vps-a-nodo -p 2222 root@127.0.0.1"
