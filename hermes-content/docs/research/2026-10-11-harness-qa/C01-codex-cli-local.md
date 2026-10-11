# C01 - Codex CLI local: versión, login, modelos y codex-tarea.sh

Medido: 2026-10-11 (UTC ~05:20 primera pasada; corrección tras verificador ~06:00). Solo lectura salvo el scratch `C:/Users/PC/AppData/Local/Temp/codex-probe` y el scratchpad de la sesión (diff propuesto). Sin git.

## Estado medido

| Qué | Evidencia (comando o archivo:línea) | Resultado |
|---|---|---|
| Versión | `codex --version` → `codex-cli 0.161.0`; `command -v codex` → `/c/Users/PC/AppData/Roaming/npm/codex` | OK. Coincide con la cabecera `scripts/codex-tarea.sh:12` |
| Login | `stat` de `~/.codex/auth.json`: mtime `2026-10-08 10:26:27`. Contenido NO leído | Presente. Vigencia UNKNOWN sin llamar a la API |
| Config global | `~/.codex/config.toml`: `model = "gpt-6.1-sol"`, `model_reasoning_effort = "medium"`, `approval_policy = "never"`, `sandbox_mode = "danger-full-access"` | Default Sol correcto. Sandbox global total: el script debe forzarlo |
| Defaults del script | `scripts/codex-tarea.sh:46,52,58`: `modelo=${4:-gpt-6.1-sol}` en revisar y resume, `modelo=${3:-gpt-6.1-sol}` en tarea, `esfuerzo=medium` | Sol por defecto: cumple la regla |
| Sandbox del script | `scripts/codex-tarea.sh:28` (`SANDBOX=...`), `:61` (`-s workspace-write`) | Forzado en las tres ramas (`revisar`, `resume`, tarea). `resume` no acepta `-s`, va por `-c` |
| Prompt | Tarea y seguimiento van por stdin (`- < "$tarea"`, `:56`, `:62`). Rama `revisar` sin prompt | La rama `revisar` no redirige stdin (ver Brecha 5) |
| Prueba gpt-6.1-sol | `codex exec -m gpt-6.1-sol -s read-only --skip-git-repo-check -C <scratch> "respondé solo: OK" </dev/null` → exit 0, salida `OK`, `model: gpt-6.1-sol`, tokens 12.930 | FUNCIONA |
| Prueba gpt-6-astra | Mismo comando → exit 0, `OK`, `model: gpt-6-astra`, tokens 12.994 | FUNCIONA |
| Prueba gpt-6-luna | Mismo comando → exit 0, `OK`, `model: gpt-6-luna`, tokens 13.646 | FUNCIONA. Nombre `gpt-6-luna` según docs (`AI_MODEL_ROUTING_2026.md`, `equipo-de-agentes`, `onia-sesion-madre`) |
| Hooks en stderr | Stderr de cada probe (3 de 3): 5 líneas `hook: ... Failed` = SessionStart x3, UserPromptSubmit x1, Stop x1 | Medido en stderr, no en eventos |
| MCP en stderr | 1 línea `AuthRequired` de `mcp.facebook.com` (devtools) por corrida | Pide OAuth. No impide la respuesta |
| Eventos del script | `~/.codex/madre-tareas/20261011-012802-codex-U3/eventos.jsonl`: 43 líneas, 0 con `hook.*Failed` | El script solo manda stdout a `eventos.jsonl` (`:58-62`). Los fallos de hooks nunca llegan ahí |
| Qué hook falla | `~/.codex/config.toml` lista hooks de `claude-mem` y `superpowers` (líneas 264-287) | Cuál falla exactamente: UNKNOWN (el stderr no nombra el plugin) |

Nota de medición: la primera prueba de `gpt-6.1-sol` se quedó esperando stdin (`Reading additional input from stdin...`). Repetida con `</dev/null`, sale en exit 0. Las probes deben cerrar stdin.

## Brecha

1. **Ninguna brecha de modelo.** Los tres modelos responden. Sol es el default en script y config, como exige la regla.
2. **Brecha de métrica:** el hecho "hooks fallidos por corrida" no se ve en `eventos.jsonl`. Hoy el conteo válido es 5 por corrida, medido en stderr (no 6).
3. **Brecha de higiene (no bloquea):** 5 hooks fallan en cada corrida y el MCP de Facebook pide OAuth. Ensucia el log de la madre y puede romper una tarea si un hook falla con más severidad. Causa en `~/.codex/config.toml`, fuera del worktree: no se escribe.
4. **Brecha de documentación:** la cabecera de `codex-tarea.sh` (líneas 19-21) no menciona Luna (`gpt-6-luna`). El script acepta cualquier modelo por argumento, así que no falla.
5. **Riesgo sin probar:** la rama `revisar` (`scripts/codex-tarea.sh:49-50`) no redirige stdin. Si `codex exec review` espera stdin como Sol en la prueba, la madre se queda colgada. UNKNOWN: no probado (`review` exige repo git con rama base; no se ejecutó).
6. **Redundancia sin efecto:** la rama de tarea pasa `-c sandbox_mode=workspace-write` y además `-s workspace-write`. No es error.

Sin brecha: sandbox forzado, default Sol, login presente, los tres modelos responden.

## Configuración propuesta

Diff exacto para `scripts/codex-tarea.sh` (generado y revisado en `C:/Users/PC/AppData/Local/Temp/claude/C--dev-proyectos-onia-hermes--claude-worktrees-onia-madre-v2-pr-review-2d85bb/35353b71-e12a-46e4-834f-804cb833a7ab/scratchpad/codex-tarea.diff`; `bash -n` sale 0):

```diff
--- a/scripts/codex-tarea.sh
+++ b/scripts/codex-tarea.sh
@@ -19,11 +19,13 @@
 # - Modelos (equipo-de-agentes §4 bis, 9-oct): gpt-6.1-sol por defecto, también para código cerrado;
 #   gpt-6-astra para seguridad, cobros, infra con root o lógica de riesgo. Se escala por riesgo o
 #   por un fallo demostrado, no por tamaño ni por costumbre.
+# - gpt-6-luna: tareas acotadas, triage y conteos mecanicos (probado 11-oct: responde OK).
 # CODEX_BIN=<ruta> elige otro binario.
 set -euo pipefail
 
 cx=${CODEX_BIN:-$(command -v codex || true)}
 [ -n "$cx" ] || { echo "codex-tarea: no encuentro el CLI de Codex (npm i -g @openai/codex)" >&2; exit 1; }
+"$cx" --version >/dev/null || { echo "codex-tarea: el CLI no responde" >&2; exit 1; }
 
 SANDBOX=(-c 'sandbox_mode="workspace-write"' -c 'windows.sandbox="unelevated"')
 
```

Captura de stderr para medir hooks, sin tocar el script: la madre lo llama con `2> err.log` y cuenta con `grep -c 'hook.*Failed' err.log`.

Config de Codex (no se aplica desde el worktree; decisión de Sergio Urcullo). Antes de silenciar, identificar el hook que falla con una corrida y `grep "hook:" err.log`:

```toml
# ~/.codex/config.toml: desactivar el hook fallido (nombre UNKNOWN hasta medirlo)
# y el MCP de Facebook sin OAuth. Revisar hooks.state antes de tocar nada.
```

## Quién la aplica

- **Madre-dev** (commit en el worktree de infra): el diff del script. Codex no hace git; la madre commitea.
- **Sergio Urcullo**: revisar `~/.codex/config.toml` (hook que falla; MCP de Facebook sin auth). Es configuración personal fuera del repo y el OAuth de Facebook es suyo.
- **Madre-marketing**: no aplica nada aquí. Usa `gpt-6-luna` solo para tareas mecánicas de Lucía o Marca.
- **Integrador**: no aplica.

Ningún cambio de sandbox ni de modelo por defecto: ya están bien.

## Prueba de hecho

1. `codex --version` devuelve `codex-cli 0.161.0` (o la versión que la madre fije).
2. Por modelo: `codex exec -m <modelo> -s read-only --skip-git-repo-check -C <scratch> "respondé solo: OK" </dev/null` da exit 0 y la línea `OK`. Hecho hoy para `gpt-6.1-sol`, `gpt-6-astra` y `gpt-6-luna`.
3. Tras el diff: `bash -n scripts/codex-tarea.sh` sale 0, `grep -n "gpt-6-luna" scripts/codex-tarea.sh` devuelve la línea nueva, y `grep -n 'el CLI no responde' scripts/codex-tarea.sh` devuelve la línea del preflight.
4. Hooks: en una corrida nueva, `scripts/codex-tarea.sh <tarea.md> <carpeta> 2> err.log` y luego `grep -c 'hook.*Failed' err.log`. Hoy: 5 (medido). Hecho = 0 tras silenciar el hook en `~/.codex/config.toml`. Si se mide en otra máquina: UNKNOWN.
5. Rama `revisar`: UNKNOWN hasta ejecutarla sobre una rama con cambios reales.
