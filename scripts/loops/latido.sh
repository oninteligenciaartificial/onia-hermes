#!/usr/bin/env bash
# ONIA — latido de un trabajo del cron: corre el comando y anota cuándo terminó y con qué código.
#
# POR QUÉ EXISTE (10-oct, HERMES_ROL_QA.md Q4c). Hoy, en el VPS, un vigía MUDO y uno SANO se ven
# igual: los dos no dicen nada. Con esto cada línea del crontab que pone `aplicar` deja
# «<epoch> <código> <cada>» en /var/lib/onia-latido/<nombre>, y el resumen de las 06:30 nombra el que
# no corrió en más de dos veces su cadencia, o el que terminó con error.
#
# Uso (en el crontab): onia-latido.sh <nombre> <cada-segundos> '<comando para sh -c>' >> log 2>&1
#
# 🔴 El latido NUNCA rompe el trabajo: si no puede anotar, igual corre el comando y sale con SU
# código. Un nombre o una cadencia inválidos se avisan en stderr (va al log del cron) y el comando
# corre igual, sin latido. Lo único que no corre es un comando vacío.

DIR="${ONIA_LATIDO_DIR:-/var/lib/onia-latido}"
nombre="${1:-}" cada="${2:-}" comando="${3:-}"

if [ -z "$comando" ]; then
  echo "latido: falta el comando (uso: onia-latido.sh <nombre> <cada-segundos> '<comando>')" >&2
  exit 2
fi

sh -c "$comando"
rc=$?

if [[ ! "$nombre" =~ ^[a-z0-9][a-z0-9-]{0,40}$ ]] || [[ ! "$cada" =~ ^[1-9][0-9]{0,6}$ ]]; then
  echo "latido: nombre «$nombre» o cadencia «$cada» inválidos: corrió sin latido" >&2
  exit "$rc"
fi
# Se escribe a un temporal y se mueve: el resumen nunca lee un latido a medias. El temporal es de ESTE
# proceso: dos corridas que se pisan (el */2 de los pedidos) no se roban el archivo (revisión del 10-oct).
tmp="$DIR/.$nombre.$$.tmp"
if mkdir -p "$DIR" 2>/dev/null \
   && printf '%s %s %s\n' "$(date -u +%s)" "$rc" "$cada" > "$tmp" 2>/dev/null \
   && mv -f "$tmp" "$DIR/$nombre" 2>/dev/null; then
  :
else
  rm -f "$tmp" 2>/dev/null
  echo "latido: no pude anotar el latido de $nombre en $DIR" >&2
fi
exit "$rc"
