# L03 - Forzar `model` explicito en subagentes con un hook

Fecha: 2026-10-11. Worktree `claude/arranque-nueva-madre-ba386e`. Sin git. Hook NO registrado en settings. Sin subagentes: todo lo corrio Haiku 5.5 en esta sesion.

## Estado medido

- `.claude/settings.json` del repo (`cat`): solo `SessionStart` (`node scripts/nube-ssh-vps.mjs`) y `Stop` (`node scripts/git-autosync.js`). Sin `PreToolUse`. Confirmado.
- `.claude/hooks/subagente-con-modelo.mjs`: existe (untracked). Self-test: `node .claude/hooks/subagente-con-modelo.mjs --self-test` -> `SELF-TEST OK (11 casos)`, exit 0.
- Stdin, recorrido en esta sesion (salida real):
  - A aviso, sin model: stdout `{"systemMessage":"AVISO: Subagente sin parametro model..."}`, exit 0.
  - B aviso, con model: sin salida, exit 0.
  - C bloqueo, sin model: stderr `BLOQUEADO: ...`, exit 2.
  - D bloqueo, con model: exit 0.
  - E no-JSON: exit 0. F tool `Bash` con bloqueo: exit 0.
- Docs hooks (code.claude.com/docs/en/hooks, leidas 2026-10-11):
  - "Claude never sees stderr from a hook that exits 0. To read it yourself on events such as PreToolUse, enable debug logging." Por tanto el aviso por stderr con exit 0 era invisible. CORREGIDO en esta entrega.
  - Campo universal `systemMessage`: "Warning message shown to the user." La lista de eventos que lo descartan (Setup, InstructionsLoaded, UserPromptSubmit, Notification, ConfigChange, CwdChanged...) no incluye PreToolUse. Usado en A.
  - Exit 2 bloquea; stderr va a Claude. Otro codigo (incl. crash, JSON invalido) = error no bloqueante, la accion sigue. `"onFailure": "block"` existe desde Claude Code 2.1.295 (no propuesto).
  - Variables: el comando puede usar `${CLAUDE_PROJECT_DIR}`; se exporta como variable de entorno al proceso. El ejemplo oficial de PreToolUse usa `${CLAUDE_PROJECT_DIR}/.claude/hooks/...`.
  - Shell por defecto de command hooks: `bash`.
  - Hooks de settings de proyecto "also run inside subagents" (aplica a subagentes).
  - Matcher PreToolUse filtra por nombre de tool (ejemplos: `Bash`, `Edit|Write`, `mcp__.*`). `Agent` no figura en los ejemplos.
  - SubagentStart: "runs when Claude spawns a subagent with the Agent tool". Indica que el nombre vigente de la herramienta es `Agent`.
  - "Cloud sessions don't read your local ~/.claude/settings.json." No queda confirmado si el `.claude/settings.json` versionado del repo aplica en nube. UNKNOWN.
- Docs sub-agents: desde 2.1.63 `Task` se renombro a `Agent` (`Task` sigue como alias). La llamada admite `model`.

## Brecha

1. Nada obliga hoy a pasar `model` en una llamada `Agent`. Sin `model`, el subagente hereda el del frontmatter o el de la sesion (puede ser Opus). Hoy es disciplina, no mecanismo.
2. El hook no esta probado en vivo: el matcher `Agent` disparando PreToolUse es UNKNOWN. Si no dispara, el hook es un no-op silencioso (no bloquea nada, tampoco avisa).
3. Riesgo de bloqueo: un falso positivo (p. ej. si el modelo viaja por otra clave) bloquearia TODAS las llamadas `Agent` de TODAS las sesiones, nube incluida. Por eso aviso primero.
4. Fail-open: cualquier fallo del hook (archivo ausente, `node` ausente, crash, JSON invalido) produce error no bloqueante o exit 0. Solo bloquea el exit 2 deliberado del modo `bloqueo`. El aviso (`aviso`) no puede bloquear nada.
5. Canal del aviso: corregido. Antes el aviso iba por stderr con exit 0 y no se veia. Ahora va por `systemMessage` (stdout JSON).

## Configuracion propuesta

Archivo: `.claude/hooks/subagente-con-modelo.mjs` (ya escrito, NO registrado). Cambio en esta entrega: aviso por stdout JSON `systemMessage` en vez de stderr.

Bloque para `.claude/settings.json`: agregar `PreToolUse` dentro del objeto `hooks`, junto a `SessionStart` y `Stop`. Usa `${CLAUDE_PROJECT_DIR}` para no depender del cwd (el verificador señalo que el path relativo falla si el cwd no es la raiz).

```json
"PreToolUse": [
  {
    "matcher": "Agent",
    "hooks": [
      {
        "type": "command",
        "command": "node \"${CLAUDE_PROJECT_DIR}/.claude/hooks/subagente-con-modelo.mjs\""
      }
    ]
  }
]
```

Modo: sin variable = `aviso` (exit 0, `systemMessage`, nunca bloquea).

Paso a `bloqueo`, solo tras OK de Sergio Urcullo y tras la prueba de hecho en vivo:

```json
"command": "ONIA_SUBAGENTE_MODELO=bloqueo node \"${CLAUDE_PROJECT_DIR}/.claude/hooks/subagente-con-modelo.mjs\""
```

Prefijo de variable: el shell por defecto es bash (docs). Igual se verifica en vivo.

Si `Agent` no dispara en vivo: cambiar `"matcher": "Agent"` por `"matcher": "Task"` (alias) y repetir la prueba. No usar `Agent|Task` salvo que ambos sean necesarios.

## Quien la aplica

- **Madre-desarrollo-infra**: commitea el hook y el bloque de `settings.json` en modo `aviso`, tras el OK de Sergio Urcullo y la prueba en vivo. Motivo: `.claude/settings.json` es configuracion compartida por todas las sesiones, incluidas las nubes Plataforma y Hermes. No es cambio de carril.
- **Sergio Urcullo**: aprueba (a) instalar en `aviso` y (b) el paso a `bloqueo`. Motivo: endurecer cambia el comportamiento de todas las sesiones; la decision es suya.
- **Sesiones de carril (Plataforma, Hermes, Lucia, Marca, Ventas)**: no editan `settings.json`. Pasan `model` en cada `Agent`.
- **Madre-marketing**: no aplica.
- **Integrador (`onia-cola`)**: no aplica; solo mergea.

## Prueba de hecho

Se da por hecho cuando se cumplen las cuatro, en vivo y no solo con el self-test:

1. `node .claude/hooks/subagente-con-modelo.mjs --self-test` -> `SELF-TEST OK`, exit 0. (Verificado en esta sesion.)
2. Con el bloque aplicado en modo `aviso`, en una sesion de prueba del repo, lanzar un `Agent` SIN `model`. Debe aparecer el mensaje `AVISO: Subagente sin parametro model...` como aviso visible para el usuario, y la llamada debe ejecutarse. Si no aparece, el campo `systemMessage` no se muestra en PreToolUse: UNKNOWN, no dar el hook por activo.
3. Lanzar un `Agent` CON `model: "haiku"`: no aparece aviso.
4. Solo tras OK de Sergio Urcullo y en `bloqueo`: un `Agent` sin `model` falla con `BLOQUEADO`; uno con `model` pasa. Si algo falla, volver a `aviso` en el mismo commit.

Si el matcher `Agent` no dispara (paso 2 no muestra nada), probar `Task`. Hasta que haya prueba en vivo, el estado es UNKNOWN.

Comando sin tocar nada: `echo '{"tool_name":"Agent","tool_input":{}}' | ONIA_SUBAGENTE_MODELO=bloqueo node .claude/hooks/subagente-con-modelo.mjs; echo $?` -> imprime `BLOQUEADO` y `2`. (Verificado en esta sesion.)

## Pendientes UNKNOWN

- Matcher `Agent` dispara PreToolUse: no probado en vivo.
- `systemMessage` visible en PreToolUse: documentado, no probado en vivo.
- `.claude/settings.json` del repo aplica en nube: no probado.
- Campos `tool_use_id` (docs: sí, en la entrada comun) y `agent_id`/`agent_type` (SubagentStart): no necesarios para el hook.
