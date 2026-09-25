#!/usr/bin/env bash
# Recrear el contenedor onia-platform con la MISMA imagen que corre, el mismo
# env-file y las mismas redes. Solo hace falta cuando cambia algo del contenedor
# (sobre todo app.env: las variables se leen al CREAR, no al reiniciar). Para
# publicar codigo nuevo se usa swap-imagen.sh <sha> (o publicar.sh, que lo llama).
#
# 🔴 HASTA EL 2026-09-24 ESTE SCRIPT RECREABA CON node:20-alpine + el bind de
# /opt/onia-platform/runtime-next. Ese dia produccion paso a una imagen
# autocontenida (onia-platform:release-<sha8>, Node 22, sin bind mount), y
# correrlo habria devuelto produccion EN SILENCIO al build del 19-sep que seguia en
# runtime-next: levanta "sano", contesta 200, y es codigo de cinco dias antes.
# Ahora lee la imagen del contenedor vivo con docker inspect y se niega si el vivo
# todavia monta /app.
#
# El trabajo lo hace swap-imagen.sh --recrear, el mismo camino que un deploy:
# canario con el env-file nuevo ANTES de tocar produccion (un app.env roto se
# descubre ahi), el viejo RENOMBRADO y no borrado, todas las redes (REDES_EXTRA) conectadas y
# verificadas con nc, mas la de LiteLLM como OPCIONAL (avisa, no aborta) — y un app.env
# con AGENTS_LLM_* nuevo recien se lee al recrear (recrear a mano tumbo prod 3 veces por eso: crear con
# --network pone UNA sola red), y rollback automatico si algo falla.
#
# Uso:  recreate-container.sh --si-estoy-seguro [--dry-run]
set -uo pipefail

AQUI=$(cd "$(dirname "$0")" && pwd)

if [ "${1:-}" != "--si-estoy-seguro" ]; then
  cat <<FIN
Este script RECREA el contenedor de produccion (app.onia.com.bo) y lo deja caido
unos segundos. Para publicar codigo nuevo NO hace falta: usa swap-imagen.sh <sha>.
Si de verdad hace falta, corre:  $0 --si-estoy-seguro [--dry-run]
FIN
  exit 2
fi
shift

exec bash "$AQUI/swap-imagen.sh" --recrear "$@"
