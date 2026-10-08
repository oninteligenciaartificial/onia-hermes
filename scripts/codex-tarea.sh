#!/usr/bin/env bash
# Madre Claude -> Codex: lanza UNA tarea cerrada y deja el resultado para que la madre lo revise.
#
#   scripts/codex-tarea.sh <tarea.md> <carpeta> [modelo] [esfuerzo] [sandbox]
#   scripts/codex-tarea.sh resume <session_id> <seguimiento.md> [modelo] [esfuerzo]
#
# Defaults: gpt-6.1-sol · medium (tareas simples). Código de Platform: gpt-6-astra · medium
# (AI_MODEL_ROUTING_2026.md). Si el resultado es malo, se escala con la prueba del fallo.
# Salida en ~/.codex/madre-tareas/<fecha>-<tarea>/: resultado.md (último mensaje de Codex),
# eventos.jsonl y session_id (para mandarle un seguimiento con `resume`).
#
# Por qué el binario de la app y no el `codex` del PATH: el de npm quedó en 0.139 y no corre
# gpt-6*; el que trae la app de Codex se actualiza solo (medido 8-oct: 0.162.0-alpha.2).
set -euo pipefail

cx=$(ls -t "$(cygpath "$LOCALAPPDATA")"/OpenAI/Codex/bin/*/codex.exe 2>/dev/null | head -1 || true)
[ -n "$cx" ] || cx=$(command -v codex)

salida() {
  local d="$HOME/.codex/madre-tareas/$(date +%Y%m%d-%H%M%S)-$1"
  mkdir -p "$d"
  echo "$d"
}

if [ "${1:-}" = "resume" ]; then
  sid=$2; seguimiento=$3; modelo=${4:-gpt-6.1-sol}; esfuerzo=${5:-medium}
  out=$(salida "resume-$(basename "$seguimiento" .md)")
  "$cx" exec resume "$sid" -m "$modelo" -c model_reasoning_effort="$esfuerzo" \
    --json -o "$out/resultado.md" - < "$seguimiento" > "$out/eventos.jsonl"
else
  # Sandbox de Codex SIEMPRE: Claude Code frena lanzar Codex sin sandbox («Create Unsafe Agents»,
  # 8-oct). Si Codex contesta «setup refresh had errors», el sandbox de Windows no pudo armarse
  # porque la app de Codex tiene abierto su node_repl.exe: cerrar la app y relanzar.
  tarea=$1; carpeta=$2; modelo=${3:-gpt-6.1-sol}; esfuerzo=${4:-medium}; sandbox=${5:-workspace-write}
  out=$(salida "$(basename "$tarea" .md)")
  extra=()
  # Con workspace-write Codex puede commitear en su rama: el .git común de un worktree queda
  # fuera de la carpeta y sin esto el commit falla (medido 4-oct). La red sigue cerrada: no hay push.
  if [ "$sandbox" = "workspace-write" ]; then
    extra=(--add-dir "$(git -C "$carpeta" rev-parse --path-format=absolute --git-common-dir)")
  fi
  "$cx" exec -m "$modelo" -c model_reasoning_effort="$esfuerzo" -s "$sandbox" -C "$carpeta" \
    "${extra[@]}" --json -o "$out/resultado.md" - < "$tarea" > "$out/eventos.jsonl"
fi

grep -o '"thread_id":"[^"]*"' "$out/eventos.jsonl" | head -1 | cut -d'"' -f4 > "$out/session_id" || true
echo "salida: $out"
echo "session_id: $(cat "$out/session_id")"
