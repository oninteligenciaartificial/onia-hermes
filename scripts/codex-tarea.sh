#!/usr/bin/env bash
# Madre Claude -> Codex: lanza UNA tarea cerrada y deja el resultado para que la madre lo revise.
#
#   scripts/codex-tarea.sh <tarea.md> <carpeta> [modelo] [esfuerzo]
#   scripts/codex-tarea.sh resume <session_id> <seguimiento.md> [modelo] [esfuerzo]
#
# Salida en ~/.codex/madre-tareas/<fecha>-<tarea>/: resultado.md (último mensaje de Codex),
# eventos.jsonl y session_id (para mandarle un seguimiento con `resume`).
#
# Qué binario y qué modelo (medido 8-oct):
# - El CLI de la app de Codex (0.162.0-alpha.2) corre gpt-6*, pero su sandbox de Windows falla
#   SIEMPRE («setup refresh had errors»: node_repl.exe del runtime cua_node «en uso»), aun con la
#   app cerrada. Y correr Codex sin sandbox lo frena Claude Code («Create Unsafe Agents»).
# - El `codex` de npm (0.139) SÍ corre con sandbox, pero solo con gpt-5.5.
# Por eso el default es el de npm con gpt-5.5. Al actualizarlo (`npm i -g @openai/codex`, con OK de
# Sergio Urcullo), pasar a gpt-6-astra (código) y gpt-6.1-sol (simple), según AI_MODEL_ROUTING_2026.md.
# CODEX_BIN=<ruta> elige otro binario.
set -euo pipefail

cx=${CODEX_BIN:-$(command -v codex)}

salida() {
  local d="$HOME/.codex/madre-tareas/$(date +%Y%m%d-%H%M%S)-$1"
  mkdir -p "$d"
  echo "$d"
}

if [ "${1:-}" = "resume" ]; then
  sid=$2; seguimiento=$3; modelo=${4:-gpt-5.5}; esfuerzo=${5:-medium}
  out=$(salida "resume-$(basename "$seguimiento" .md)")
  "$cx" exec resume "$sid" -m "$modelo" -c model_reasoning_effort="$esfuerzo" \
    --json -o "$out/resultado.md" - < "$seguimiento" > "$out/eventos.jsonl"
else
  tarea=$1; carpeta=$2; modelo=${3:-gpt-5.5}; esfuerzo=${4:-medium}
  out=$(salida "$(basename "$tarea" .md)")
  # workspace-write + el .git común del worktree (queda fuera de la carpeta): así Codex commitea en
  # su rama. La red sigue cerrada: no hay push; empuja la madre después de revisar.
  "$cx" exec -m "$modelo" -c model_reasoning_effort="$esfuerzo" -s workspace-write -C "$carpeta" \
    --add-dir "$(git -C "$carpeta" rev-parse --path-format=absolute --git-common-dir)" \
    --json -o "$out/resultado.md" - < "$tarea" > "$out/eventos.jsonl"
fi

grep -o '"thread_id":"[^"]*"' "$out/eventos.jsonl" | head -1 | cut -d'"' -f4 > "$out/session_id" || true
echo "salida: $out"
echo "session_id: $(cat "$out/session_id")"
