#!/usr/bin/env bash
# Instala el corredor y los prompts de los loops en el VPS, de forma ATOMICA.
#
# 🔴 POR QUE EXISTE, y no es cosmetico: el 2026-09-02 se parcheo
# /root/bin/onia-loop.sh con el editor mientras `web-venta` estaba corriendo.
# Bash NO carga el script entero: lo lee por OFFSET de bytes a medida que avanza.
# Reescribir el MISMO inodo le movio el piso abajo de los pies y ejecuto basura:
#
#     /root/bin/onia-loop.sh: line 157: l: command not found
#
# El agente ya habia terminado y pusheado, asi que no se perdio trabajo — pero el
# corredor nunca escribio su linea TERMINA, nunca solto el flock, y quedo un
# proceso zombi que habria bloqueado TODAS las vueltas siguientes de ese loop.
# Un `bash -n` en verde no protege de esto: el archivo estaba bien; el problema
# era editarlo en caliente.
#
# La cura es escribir a un temporal y renombrar. `mv` en el mismo filesystem es
# atomico: el proceso que ya lo abrio se queda con el inodo viejo hasta terminar,
# y la proxima vuelta arranca con el nuevo. Nadie lee un archivo a medio escribir.
#
# Uso, desde la raiz del repo:
#   scripts/loops/instalar.sh                 # corredor + todos los prompts
#   scripts/loops/instalar.sh canario-visual  # solo ese prompt
set -euo pipefail

VPS="${ONIA_VPS:-root@187.77.16.63}"
LLAVE="${ONIA_VPS_KEY:-$HOME/.ssh/onia_hermes_vps_ed25519}"
AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SSH=(ssh -i "$LLAVE" -o StrictHostKeyChecking=no "$VPS")
SCP=(scp -q -i "$LLAVE" -o StrictHostKeyChecking=no)

poner() {  # poner <origen local> <destino remoto>
  local origen="$1" destino="$2" tmp="$2.nuevo.$$"
  "${SCP[@]}" "$origen" "$VPS:$tmp"
  # bash -n antes de renombrar: un script roto NO reemplaza a uno que anda.
  case "$destino" in
    *.sh) "${SSH[@]}" "bash -n '$tmp'" || { "${SSH[@]}" "rm -f '$tmp'"; echo "RECHAZADO (sintaxis): $destino" >&2; return 1; } ;;
  esac
  "${SSH[@]}" "chmod --reference='$destino' '$tmp' 2>/dev/null || chmod 644 '$tmp'; mv -f '$tmp' '$destino'"
  echo "ok  $destino"
}

if [ $# -gt 0 ]; then
  for n in "$@"; do poner "$AQUI/prompts/$n.md" "/root/bin/loops/$n.md"; done
  exit 0
fi

poner "$AQUI/onia-loop.sh" /root/bin/onia-loop.sh
for f in "$AQUI"/prompts/*.md; do
  poner "$f" "/root/bin/loops/$(basename "$f")"
done

echo
echo "--- lo que quedo registrado en el VPS ---"
"${SSH[@]}" 'crontab -l | grep onia-loop.sh'
