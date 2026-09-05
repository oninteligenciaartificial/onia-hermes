#!/usr/bin/env bash
# Rompe el candado circular del sync del VPS, UNA sola vez.
#
# /root/bin/onia-loops-sync.sh quedo congelado en las 00:43 porque la guarda que
# lleva ADENTRO se niega a actualizarlo. Con la guarda arreglada en main, el que
# decide sigue siendo la copia vieja: no puede aplicarse el arreglo a si misma.
# Se copia el archivo de origin/main una vez y de ahi en mas se mantiene solo.
#
# Es UNA copia de un archivo que la propia maquina despliega cada hora — no se
# instala nada nuevo en el servidor.
set -u
cd /root || exit 1
ssh -i /root/.ssh/onia_hermes_vps_ed25519 -o StrictHostKeyChecking=no root@187.77.16.63 'bash -s' <<'REMOTO'
set -u
D=/root/loops/onia-hermes
DEST=/root/bin/onia-loops-sync.sh

git -C "$D" fetch -q origin main || { echo "no pude traer main"; exit 1; }
NUEVO=/tmp/sync-nuevo.$$
git -C "$D" show origin/main:scripts/loops/sincronizar.sh > "$NUEVO" || exit 1

echo "=== control: la version de main YA trae el arreglo? ==="
printf '  head-5 con la marca: %s   (0 = arreglado, no se auto-bloquea)\n' \
  "$(head -5 "$NUEVO" | grep -c 'Generado por instalar-homelab.sh')"
printf '  guarda acotada     : %s   (1 = trae el head -5)\n' \
  "$(grep -c 'head -5 "\$destino"' "$NUEVO")"
if [ "$(head -5 "$NUEVO" | grep -c 'Generado por instalar-homelab.sh')" != "0" ] \
   || [ "$(grep -c 'head -5 "\$destino"' "$NUEVO")" = "0" ]; then
  echo "  >>> main TODAVIA no tiene el arreglo. No toco nada."
  rm -f "$NUEVO"; exit 1
fi

bash -n "$NUEVO" || { echo "  >>> no compila. No toco nada."; rm -f "$NUEVO"; exit 1; }

cp -p "$DEST" "$DEST.congelado-$(date -u +%Y%m%dT%H%M%SZ)"
echo "  respaldo del congelado: $DEST.congelado-*"

install -m 755 "$NUEVO" "$DEST" && rm -f "$NUEVO"
echo "  reemplazado. fecha ahora: $(stat -c %y "$DEST")"

echo
echo "=== control final: coincide con main? ==="
if diff -q "$DEST" <(git -C "$D" show origin/main:scripts/loops/sincronizar.sh) >/dev/null; then
  echo "  IDENTICO a origin/main — candado roto"
else
  echo "  todavia DIFIERE"
fi
REMOTO
