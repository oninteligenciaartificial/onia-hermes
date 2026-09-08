#!/usr/bin/env bash
# Entra a nodo-casa (la PC de casa) DESDE el VPS.
#
# POR QUE EXISTE: desde el 2026-09-06 los loops corren alla y sus registros
# llegan aca por rsync — o sea, se puede MIRAR pero no TOCAR. El vigia lo dice
# con todas las letras: "no se puede distinguir un loop muerto de un rsync
# cortado; el que lo lea tiene que mirar la PC". Sin una via de vuelta, ese
# "mirar la PC" es siempre trabajo de Sergio Urcullo.
#
# COMO: nodo-casa mantiene un tunel inverso contra este VPS que publica su
# puerto 22 en 127.0.0.1:2222. No hace falta abrir NADA en el router de casa
# (internet residencial en Bolivia es CGNAT: no hay puerto que redirigir).
#
# LIMITACION HONESTA: el tunel lo sostiene la otra punta. Si esa PC se apaga o
# se corta internet, esto falla — igual que el rsync, y por la misma causa. No
# reemplaza a Tailscale, que es lo que PLAN_HOMELAB.md eligio para que la via
# sobreviva a un reinicio sin que nadie la rearme. Esto es el escalon barato.
set -uo pipefail

PUERTO=${ONIA_CASA_PUERTO:-2222}
LLAVE=${ONIA_CASA_LLAVE:-/root/.ssh/nodo_casa_ed25519}
# El usuario NO se asume root: en WSL la cuenta por defecto es de a pie, y ahi
# fue donde esto fallo la primera vez (2026-09-08).
USUARIO=${ONIA_CASA_USUARIO:-root}

if ! ss -ltn 2>/dev/null | grep -q "127.0.0.1:${PUERTO}"; then
  echo "nodo-casa NO tiene el tunel abierto (nada escucha en 127.0.0.1:${PUERTO})." >&2
  echo "Es la PC la que lo abre; desde aca no se puede levantar." >&2
  exit 3
fi

exec ssh -i "$LLAVE" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
     -o LogLevel=ERROR -o BatchMode=yes -o ConnectTimeout=10 \
     -p "$PUERTO" "${USUARIO}@127.0.0.1" "$@"
