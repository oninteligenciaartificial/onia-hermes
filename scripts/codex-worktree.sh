#!/usr/bin/env bash
# Crea un worktree para una tarea de Codex, con node_modules enlazado (junction) y topes.
#   scripts/codex-worktree.sh <rama> [rol] [base]      rol: ejecutor (def.) | verificador
#   scripts/codex-worktree.sh liberar <rama>           suelta el cupo y NO borra el worktree
# Imprime la ruta del worktree (última línea). Lo corre la madre; Codex no hace git.
# Regla: máx 2 ejecutores + 1 verificador a la vez (cupo en ~/.codex/madre-locks/).
set -euo pipefail
REPO=${ONIA_PLATFORM:-/c/dev/proyectos/onia-platform}
DEST=${CODEX_WT_DEST:-/e/ONIA-Codex/madre}          # E: tiene más disco; el junction cruza discos
MIN_GB=${CODEX_MIN_GB:-5}
LOCKS="$HOME/.codex/madre-locks"; mkdir -p "$LOCKS"

slug() { echo "$1" | tr '/' '-'; }

if [ "${1:-}" = "liberar" ]; then rm -f "$LOCKS"/*."$(slug "$2")"; echo "cupo liberado: $2"; exit 0; fi

rama=${1:?uso: codex-worktree.sh <rama> [ejecutor|verificador] [base]}
rol=${2:-ejecutor}; base=${3:-origin/main}
case "$rol" in ejecutor) max=2;; verificador) max=1;; *) echo "rol invalido: $rol" >&2; exit 2;; esac

# 1) cupo: cada lock guarda la hora de creacion (epoch). Caduca a las 12 h como respaldo;
#    la madre debe correr 'liberar <rama>' al cerrar la tarea (paso obligatorio).
#    No se usa PID: $$ es el proceso de este script, que muere al salir.
now=$(date +%s)
for f in "$LOCKS"/*; do
  [ -e "$f" ] || continue
  [ $(( now - $(cat "$f" 2>/dev/null || echo 0) )) -lt 43200 ] || rm -f "$f"
done
usados=$(ls "$LOCKS" 2>/dev/null | grep -c "^$rol\." || true)
[ "$usados" -lt "$max" ] || { echo "cupo lleno: $usados/$max $rol(es). Esperar o 'liberar <rama>'." >&2; exit 3; }

# 2) disco: el destino y C: (donde viven los .git) deben tener > MIN_GB
mkdir -p "$DEST"
for d in "$DEST" /c; do
  libre=$(df -BG --output=avail "$d" | tail -1 | tr -dc 0-9)
  [ "$libre" -gt "$MIN_GB" ] || { echo "disco $d: ${libre} GB libres (< $MIN_GB GB). Limpiar worktrees viejos antes." >&2; exit 4; }
done

# 3) worktree desde la rama pedida (si no existe, nace de $base)
git -C "$REPO" fetch origin --quiet
wt="$DEST/$(slug "$rama")"
[ ! -e "$wt" ] || { echo "ya existe: $wt" >&2; exit 5; }
if git -C "$REPO" show-ref -q --verify "refs/heads/$rama" || git -C "$REPO" show-ref -q --verify "refs/remotes/origin/$rama"; then
  git -C "$REPO" worktree add "$wt" "$rama"
else
  git -C "$REPO" worktree add -b "$rama" "$wt" "$base"
fi

# 4) node_modules: primer clon con node_modules REAL (>100 paquetes) y el mismo package-lock
lock_hash=$(sha1sum "$wt/package-lock.json" | cut -c1-40)
fuente=""
for c in "$(dirname "$REPO")"/onia-platform*/ "$DEST"/*/; do
  c=${c%/}; [ "$c" = "${wt%/}" ] && continue
  [ -d "$c/node_modules" ] && [ ! -L "$c/node_modules" ] || continue
  [ "$(ls "$c/node_modules" | wc -l)" -gt 100 ] || continue
  [ "$(sha1sum "$c/package-lock.json" 2>/dev/null | cut -c1-40)" = "$lock_hash" ] || continue
  fuente=$c; break
done
if [ -n "$fuente" ]; then
  MSYS2_ARG_CONV_EXCL='*' cmd //c mklink //J "$(cygpath -w "$wt/node_modules")" "$(cygpath -w "$fuente/node_modules")" >/dev/null
  echo "node_modules -> $fuente (junction)" >&2
else
  echo "AVISO: ningun clon con node_modules y el mismo lock; correr 'npm ci' en $wt (aprobado por Sergio Urcullo)" >&2
fi

# 5) toma el cupo (hora de creacion; 'liberar <rama>' al terminar)
date +%s > "$LOCKS/$rol.$(slug "$rama")"
echo "$wt"
