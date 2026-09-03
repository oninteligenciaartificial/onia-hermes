#!/usr/bin/env bash
# ONIA — que cada worktree baje SOLO lo que su carril usa.
#
# EL PROBLEMA, medido el 2026-09-02: el disco del VPS estaba al 93% con 15 GB
# libres, y de los 97 GB de /root/loops, SESENTA eran el mismo `hermes-content`
# copiado en 14 worktrees. Dentro de esa carpeta, 3,9 GB son `references`: videos
# y fotos de referencia (sergio-approved-media, modelos, avatar-lab, clips de
# creators). Cada carril que nace se lleva otra copia entera.
#
# Con Docker en el MISMO disco, llenarlo tumba onia.com.bo, app.onia.com.bo, la
# base y n8n de una. Y no crecia en goteo: subia ~5,5 GB de golpe por worktree
# nuevo, o sea que quedaban unos TRES antes del desastre.
#
# LA SOLUCION NO ES BORRAR, ES NO BAJARLO. `git sparse-checkout` deja el carril
# con su rama completa para git (status limpio, commits normales, nada marcado
# como borrado) pero sin los archivos que ese carril no mira. Medido: un worktree
# paso de 5,5 GB a 1,7 GB y siguio leyendo su cola igual.
#
# Aplicado a 7 carriles: 93% -> 79%, de 15 GB a 42 GB libres.
#
# CORRE POR CRON porque un worktree NUEVO nace con el checkout completo. Sin esto
# el arreglo dura hasta que un loop cree el siguiente carril.
set -uo pipefail

BASE="${ONIA_LOOPS_BASE:-/root/loops}"
RUTA_PESADA="/hermes-content/references"

# Carriles que SI miran `references` y por eso NO se tocan. La lista sale de
# `grep` sobre los prompts de /root/bin/loops: son los que nombran
# hermes-content/references, references/modelos, references/video o ui-patterns.
# Si un carril nuevo empieza a necesitarlo, se agrega ACA — no se apaga el script.
#
# `onia-hermes` (el integrador) va en la lista a proposito aunque su prompt no lo
# nombre: mergea TODOS los carriles, asi que necesita el arbol entero o un merge
# que toque un archivo ausente se resuelve mal y en silencio.
NO_TOCAR=(
  "onia-hermes"                 # integrador: mergea todo
  "onia-hermes-calidad"         # calidad-generado
  "onia-hermes-canario"         # canario-visual
  "onia-hermes-lucia"           # lucia
  "lucia-contenido"             # repo aparte de Lucia
  "onia-hermes-marca-personal"  # marca-personal (y kpis-semanal, mismo worktree)
  "onia-hermes-tendencias"      # tendencias
  "onia-hermes-contenido-cola"  # carril contenido
)

esta_en_lista() {
  local n="$1"
  for x in "${NO_TOCAR[@]}"; do [ "$x" = "$n" ] && return 0; done
  return 1
}

ANTES=$(df / | tail -1 | awk '{print $4}')
CAMBIOS=0

for d in "$BASE"/*/; do
  n=$(basename "$d")
  esta_en_lista "$n" && continue
  # Sin la carpeta pesada en disco ya esta aligerado (o no aplica a este repo).
  [ -d "$d/hermes-content/references" ] || continue
  git -C "$d" rev-parse --git-dir >/dev/null 2>&1 || continue

  # Un carril con trabajo sin commitear NO se toca: cambiar el checkout debajo de
  # un agente que esta escribiendo es como se pierden cosas.
  if [ -n "$(git -C "$d" status --porcelain 2>/dev/null)" ]; then
    echo "salteado $n: tiene cambios sin commitear"
    continue
  fi

  S1=$(du -sm "$d" 2>/dev/null | cut -f1)
  if git -C "$d" sparse-checkout set --no-cone "/*" "!$RUTA_PESADA" >/dev/null 2>&1; then
    S2=$(du -sm "$d" 2>/dev/null | cut -f1)
    echo "aligerado $n: $((S1)) MB -> $((S2)) MB"
    CAMBIOS=$((CAMBIOS + 1))
  else
    echo "FALLO aligerando $n"
  fi
done

DESPUES=$(df / | tail -1 | awk '{print $4}')
GB=$(( (DESPUES - ANTES) / 1024 / 1024 ))

if [ "$CAMBIOS" -gt 0 ]; then
  USO=$(df --output=pcent / | tail -1 | tr -dc '0-9')
  /root/bin/onia-tg.sh "🧹 <b>Disco</b>: $CAMBIOS worktree(s) aligerado(s), +${GB} GB libres. Uso: ${USO}%." >/dev/null 2>&1 || true
fi
exit 0
