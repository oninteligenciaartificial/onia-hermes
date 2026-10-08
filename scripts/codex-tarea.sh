#!/usr/bin/env bash
# Madre Claude -> Codex: lanza UNA tarea cerrada y deja el resultado para que la madre lo revise.
#
#   scripts/codex-tarea.sh <tarea.md> <carpeta> [modelo] [esfuerzo]
#   scripts/codex-tarea.sh resume <session_id> <seguimiento.md> [modelo] [esfuerzo]
#
# Salida en ~/.codex/madre-tareas/<fecha>-<tarea>/: resultado.md (último mensaje de Codex),
# eventos.jsonl y session_id (para mandarle un seguimiento con `resume`).
#
# Qué binario, qué sandbox y qué modelo (medido 8-oct):
# - `codex` de npm 0.161 (actualizado con OK de Sergio Urcullo) corre gpt-6* con sandbox SOLO con
#   `windows.sandbox="unelevated"`. El "elevated" del config falla siempre («setup refresh had errors»:
#   node_repl.exe del runtime cua_node de la app «en uso»), y sin sandbox lo frena Claude Code.
# - Modelos (AI_MODEL_ROUTING_2026.md, Sergio Urcullo 8-oct): simple = gpt-6.1-sol (default);
#   código = gpt-6-astra. Se escala con la prueba del fallo, no por costumbre.
# CODEX_BIN=<ruta> elige otro binario.
set -euo pipefail

cx=${CODEX_BIN:-$(command -v codex)}

salida() {
  local d="$HOME/.codex/madre-tareas/$(date +%Y%m%d-%H%M%S)-$1"
  mkdir -p "$d"
  echo "$d"
}

if [ "${1:-}" = "resume" ]; then
  sid=$2; seguimiento=$3; modelo=${4:-gpt-6.1-sol}; esfuerzo=${5:-medium}
  out=$(salida "resume-$(basename "$seguimiento" .md)")
  "$cx" exec resume "$sid" -m "$modelo" -c 'windows.sandbox="unelevated"' -c model_reasoning_effort="$esfuerzo" \
    --json -o "$out/resultado.md" - < "$seguimiento" > "$out/eventos.jsonl"
else
  tarea=$1; carpeta=$2; modelo=${3:-gpt-6.1-sol}; esfuerzo=${4:-medium}
  out=$(salida "$(basename "$tarea" .md)")
  # workspace-write + el .git común del worktree (queda fuera de la carpeta): así Codex commitea en
  # su rama. La red sigue cerrada: no hay push; empuja la madre después de revisar.
  "$cx" exec -m "$modelo" -c model_reasoning_effort="$esfuerzo" -c 'windows.sandbox="unelevated"' -s workspace-write -C "$carpeta" \
    --add-dir "$(git -C "$carpeta" rev-parse --path-format=absolute --git-common-dir)" \
    --json -o "$out/resultado.md" - < "$tarea" > "$out/eventos.jsonl"
fi

grep -o '"thread_id":"[^"]*"' "$out/eventos.jsonl" | head -1 | cut -d'"' -f4 > "$out/session_id" || true
echo "salida: $out"
echo "session_id: $(cat "$out/session_id")"
