#!/usr/bin/env bash
# Madre Claude -> Codex: lanza UNA tarea cerrada y deja el resultado para que la madre lo revise.
#
#   scripts/codex-tarea.sh <tarea.md> <carpeta> [modelo] [esfuerzo]
#   scripts/codex-tarea.sh resume <session_id> <seguimiento.md> [modelo] [esfuerzo]
#   scripts/codex-tarea.sh revisar <carpeta> <rama-base> [modelo] [esfuerzo]   (revisión antes de mergear)
#
# Salida en ~/.codex/madre-tareas/<fecha>-<tarea>/: resultado.md (último mensaje de Codex),
# eventos.jsonl y session_id (para mandarle un seguimiento con `resume`).
#
# Qué binario, qué sandbox y qué modelo (medido 8-oct):
# - `codex` de npm 0.161 (actualizado con OK de Sergio Urcullo) corre gpt-6* con sandbox SOLO con
#   `windows.sandbox="unelevated"`. El "elevated" del config falla siempre («setup refresh had errors»:
#   node_repl.exe del runtime cua_node de la app «en uso»), y sin sandbox lo frena Claude Code.
# - El sandbox se fija con `sandbox_mode` en las DOS ramas: `exec resume` no acepta `-s` y el config
#   de la app trae `danger-full-access`; sin esto, un resume corría sin sandbox (revisión del #151).
# - Codex NO commitea: no recibe el `.git` común (hooks y config corren fuera del sandbox la próxima
#   vez que la madre use git). La madre revisa el diff de la carpeta y commitea ella.
# - Modelos (equipo-de-agentes §4 bis, 9-oct): gpt-6.1-sol por defecto, también para código cerrado;
#   gpt-6-astra para seguridad, cobros, infra con root o lógica de riesgo. Se escala por riesgo o
#   por un fallo demostrado, no por tamaño ni por costumbre.
# CODEX_BIN=<ruta> elige otro binario.
set -euo pipefail

cx=${CODEX_BIN:-$(command -v codex || true)}
[ -n "$cx" ] || { echo "codex-tarea: no encuentro el CLI de Codex (npm i -g @openai/codex)" >&2; exit 1; }

SANDBOX=(-c 'sandbox_mode="workspace-write"' -c 'windows.sandbox="unelevated"')

salida() {
  local d="$HOME/.codex/madre-tareas/$(date +%Y%m%d-%H%M%S)-$1"
  mkdir -p "$d"
  echo "$d"
}

cerrar() {
  grep -o '"thread_id":"[^"]*"' "$out/eventos.jsonl" 2>/dev/null | head -1 | cut -d'"' -f4 > "$out/session_id" || true
  echo "salida: $out"
  echo "session_id: $(cat "$out/session_id")"
}

if [ "${1:-}" = "revisar" ]; then
  # Revisión por otro modelo de lo que hizo la madre, antes de mergear (Sergio Urcullo, 8-oct:
  # «mandá a Codex… sol 6.1» para no quemar la cuenta). Astra solo para cobros, producción o permisos.
  #   scripts/codex-tarea.sh revisar <carpeta> <rama-base> [modelo] [esfuerzo]
  carpeta=$2; base=$3; modelo=${4:-gpt-6.1-sol}; esfuerzo=${5:-medium}
  out=$(salida "revisar-$(basename "$carpeta")")
  trap cerrar EXIT
  (cd "$carpeta" && "$cx" exec review --base "$base" -m "$modelo" "${SANDBOX[@]}" -c model_reasoning_effort="$esfuerzo" \
    --json -o "$out/resultado.md" > "$out/eventos.jsonl")
elif [ "${1:-}" = "resume" ]; then
  sid=$2; seguimiento=$3; modelo=${4:-gpt-6.1-sol}; esfuerzo=${5:-medium}
  out=$(salida "resume-$(basename "$seguimiento" .md)")
  trap cerrar EXIT
  "$cx" exec resume "$sid" -m "$modelo" "${SANDBOX[@]}" -c model_reasoning_effort="$esfuerzo" \
    --json -o "$out/resultado.md" - < "$seguimiento" > "$out/eventos.jsonl"
else
  tarea=$1; carpeta=$2; modelo=${3:-gpt-6.1-sol}; esfuerzo=${4:-medium}
  out=$(salida "$(basename "$tarea" .md)")
  trap cerrar EXIT
  "$cx" exec -m "$modelo" "${SANDBOX[@]}" -c model_reasoning_effort="$esfuerzo" -s workspace-write -C "$carpeta" \
    --json -o "$out/resultado.md" - < "$tarea" > "$out/eventos.jsonl"
fi
