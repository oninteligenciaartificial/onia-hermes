# P01 - Latidos de las nubes (texto v3), corregido

Fecha de medicion: 2026-10-11, ~05:30 UTC. Fuente: RemoteTrigger get y list (solo lectura). No se creo ni actualizo ningun latido.

## Estado medido

Comando: `RemoteTrigger get <trigger_id>` para los 4 latidos recurrentes. Salida corta:

| Latido | trigger_id | cron | enabled | persistent_session_id | environment_id | ultimo run (status, UTC) | next_run_at | version del texto |
|---|---|---|---|---|---|---|---|---|
| Plataforma | trig_01XVX9kgMExkapoN5XDdamx4 | 17 * * * * | true | session_01HhnFgkeF6nLGvjrfjt1o2C | env_01BLwXdgpqDS3sx4rg3r2uvg | 05:17:39 SUCCEEDED (cse_01HhnFgk...) | 06:17:00 | v2 (cita reglas 11-oct; Codex solo de paso en PASO 0) |
| Hermes-Jarvis | trig_01A9hCX7s5ZuaQ24TkK3Rr8d | 57 * * * * | true | session_01SQ7cvuDX5w5jDHk5VdhAEo | env_01BLwXdgpqDS3sx4rg3r2uvg | 04:57:13 SUCCEEDED (cse_01SQ7cvu...) | 05:57:00 | v2 (cita reglas 11-oct; Codex de paso en PASO 0: "modelos por rol y Codex (cola/loop/README.md)") |
| Lucia | trig_013YP8Nxhwi8HbdufMuv2Var | 47 * * * * | true | session_01XSzFcs1k18ijqjSHGjnzD4 | env_01V5EeE4VtMdw7PWVaMYywsk | 04:47:28 SUCCEEDED (cse_01XSzFcs...) | 05:47:00 | v1 (texto 9-oct; sin reglas 11-oct; sin Codex) |
| Marca personal | trig_01ExDbhoaxaXpzpvj26DEeQ8 | 27 * * * * | true | session_01WPecmppa9uZEc4fJDjSmaS | env_01V5EeE4VtMdw7PWVaMYywsk | 05:27:14 SUCCEEDED (cse_01WPecmp...) | 06:27:00 | v1 (texto 9-oct; sin reglas 11-oct; sin Codex) |

- `persistent_session_id` de los 4 coincide con los ids de sesion del contexto de la tarea y con el sufijo de `last_run.session_id`. Comparacion contra la lista viva de sesiones (list_sessions): NO hecha, UNKNOWN.
- `allowed_tools` (igual en los 4, en `job_config.ccr.session_context.allowed_tools`): `preset:default, Task, Bash, Glob, Grep, Read, Edit, MultiEdit, Write, NotebookEdit, WebFetch, TodoWrite, WebSearch, BashOutput, KillBash, Skill, Tmux, Monitor, SendUserFile, REPL`. Bash y Write ya estan.
- `mcp_connections`: los 4 latidos tienen la MISMA lista de 16 conectores: Cloudflare_Developer_Platform, N8N_MCP, Claude_Docs, Vercel, Meta_Developer_Tools, Fillout, Google_Drive, Figma, Gamma, Notion, Google_Calendar, Claude_Code_Remote, Gmail, higgsfield, Supabase, Meta_ads. Estado de conexion de cada uno: no medido.
- Lucia y Marca: `session_request.config` es null (no lista allowed_tools ahi); el `allowed_tools` que aplica es el de `job_config.ccr`.
- `RemoteTrigger list` (83 KB, guardado en `tool-results/toolu_01VMuzNdYz9L65dm1hNp2em5.txt`, leido con Grep):
  - Solo 4 entradas con `cron_expression` no vacio: 57, 47, 27 y 17 (los 4 latidos).
  - Ventas (`session_0143C5fMXVs8eWEf7uBpC9SF`) aparece UNA vez, en un one-shot: `trig_01LAFRJWKjmk3u7M4asVtoj1` ("Check-in PR #191 Biblioteca"), `run_once_at` 2026-10-10T21:16:00Z (ya paso). Su `session_request` no trae campo `environment_id`.
  - Hay otros one-shots de otras sesiones en la lista; no se contaron todos. No se afirma que el de Ventas sea el unico.
- Ventas: no hay latido recurrente. `environment_id` = UNKNOWN: no sale en list ni get, y no se puede inventar. Dato que lo resuelve: pedirlo a la sesion de Ventas o a Sergio Urcullo desde la web de claude.ai.
- Version del texto: la API no tiene campo de version. "v1/v2" es inferido del texto del prompt.
- Codex en los latidos: ninguno dice como pedir una tarea a Codex. `scripts/codex-tarea.sh` lo corre la PC. Hay cola de contratos en `hermes-content/docs/handoff/codex-tareas/` con 13 archivos (verificado con ls): B1-bandeja-menos-llamadas.md, B3-app-instalable-pwa.md, C11a-reprogramar-y-reserva-avisa.md, C11b-feriados.md, C13-gracia-y-no-renovar.md, C14-aceptacion-terminos.md, C14-terminos-con-version.md, C15-factura-al-aprobar.md, K1-confirmacion-respuesta.md, K2-recuperar-canceladas.md, K3-semilla-dental.md, W1-widget-de-chat-propio.md, mas README.md y _PLANTILLA.md.
- `@codex` / C06: NO existe en la carpeta (grep C06 sin resultados). UNKNOWN para cualquier referencia a C06.
- Handoffs: `hermes-content/docs/handoff/hermes-jarvis.md`, `marca-personal.md` y `higgsfield-lucia.md` existen. No existe `handoff/plataforma.md` ni `handoff/ventas*.md`: el handoff de Plataforma y el de Ventas son UNKNOWN.
- Colas: `hermes-content/docs/cola/loop/` tiene README.md, hermes-jarvis.md, lucia.md, madre.md, marca-personal.md, plataforma.md y ventas-pauta.md. La cola de Ventas se llama `ventas-pauta.md`, no `ventas.md`.

## Brecha

1. Ventas no tiene latido recurrente. Su unico trigger es un one-shot ya vencido, sin environment_id visible.
2. Lucia y Marca usan el texto v1 (9-oct): no tienen reglas del 11-oct ni Codex.
3. Plataforma y Hermes usan v2: tienen reglas del 11-oct, pero Codex es solo una mencion de paso. No dicen que la nube NO lanza Codex ni como escribir el contrato. Hermes-Jarvis ya menciona Codex igual que Plataforma (su v2 no es "sin Codex").
4. Ningun latido tiene un paso de contrato Codex con formato exacto (`estado: pendiente`, ruta, linea `CODEX-CONTRATO:`).
5. Plataforma no tiene handoff con nombre claro en handoff/ (el prompt dice "el de Plataforma" sin archivo).
6. Lucia y Marca comparten environment (`env_01V5EeE4...`). No es un fallo; hay que saberlo al cambiarlos.

## Configuracion propuesta

### Texto v3

Texto unico con placeholders por carril. Generado y validado con `json.loads` por un script (ver abajo). Campos: SKILLS, HANDOFF, COLA, CARRIL, LINEA.

```
LATIDO v3 (cada hora). Reglas de Sergio Urcullo, 11-oct: "Onia independiente y sin interacción humana; todo por agentes delegando; cada sesión es dueña de lo suyo" y "trabajar leyendo TODAS sus pendientes, usando su harness y respetándolo".
PASO 0: git pull. Invocá {SKILLS}. Leé tu handoff {HANDOFF}, tu cola {COLA} y lo que te toca en hermes-content/docs/cola/loop/madre.md. Respetá CLAUDE.md, hermes-content/docs/cola/loop/README.md y tu harness.
PASO 1: encadená en este turno las tareas destrabadas hasta su criterio de hecho. Modelos por rol: Haiku cuenta y verifica; Sonnet sintetiza y construye; Opus solo lo ambiguo o riesgoso. Subagentes con model explícito. Marcá modelos: en cada [x].
PASO 1b CODEX: NO lanzás Codex (lo corre la PC con scripts/codex-tarea.sh). Si una tarea es código cerrado, escribís el contrato en hermes-content/docs/handoff/codex-tareas/{CARRIL}-<id>-<slug>.md con estado: pendiente (usá _PLANTILLA.md), lo commiteás solo en tu rama claude/*, y dejás en tu transcript la línea: CODEX-CONTRATO: <ruta> (rama <claude/...>). Marcá codex: en tu cola. No hacés git de Codex.
PASO 2: si todo está bloqueado, anotá qué lo bloquea y quién lo destraba, y agregá 3 tareas destrabadas.
PASO 3: nunca termines el turno sin commit + push de tu rama. Reportá solo PUBLICADO: <qué> - <SHA>, o HALLAZGO: <qué> - <captura>.
{LINEA}
```

Lineas de carril (reemplazan `{LINEA}`):

- Plataforma: `Ordenás tu carril sin tocar la producción sin gates; publicar sigue ONIA_1.0_CORTE.md y la ventana sin pushes de :20 a :10 en horas de publicación.`
- Hermes-Jarvis (QA): `Sos el carril de QA: tras cada publicación de :50 mirá producción con login; revisá PRs abiertos de onia-hermes y onia-platform.`
- Lucia: `Generación paga de video: solo con el sí de Sergio Urcullo por lote. Lo que pasa control de calidad se publica sin esperar.`
- Marca personal: `Lo que pasa control de calidad se publica sin esperar. Generación paga: solo con el sí de Sergio Urcullo por lote.`
- Ventas: `Pauta Meta: respetá el go/no-go del 13-oct de ONIA_HARNESS.md. No gastes sin ese sí. Sin rubro nuevo.`

Skills por carril: Plataforma `onia-router, equipo-de-agentes, onia-frontend, onia-backend, onia-db, onia-seguridad, onia-deploy, onia-verificacion`; Hermes `onia-router, equipo-de-agentes, onia-hermes-jarvis, aprender-de-todo`; Lucia y Marca `equipo-de-agentes, aprender-de-todo`; Ventas `equipo-de-agentes, aprender-de-todo, onia-ventas-pauta`.

### Payload de update (RemoteTrigger update, body completo)

Generador y salidas ya validadas (cada archivo parsea con json.loads):

- Script: `C:/Users/PC/AppData/Local/Temp/claude/C--dev-proyectos-onia-hermes--claude-worktrees-onia-madre-v2-pr-review-2d85bb/35353b71-e12a-46e4-834f-804cb833a7ab/scratchpad/latidos/gen.py`
- Salidas: `plataforma.json`, `hermes.json`, `lucia.json`, `marca.json` y `ventas.json` en la misma carpeta.

Cada body tiene: `name`, `cron_expression` (sin cambio), `enabled: true`, y `job_config.ccr` con `environment_id`, `events[0].data.message.content` (texto v3 ya armado) y `session_context.allowed_tools` (copiado del get, sin cambio). Los `uuid` de evento son los del get para los 4 latidos.

Ventas: el JSON de `ventas.json` lleva `environment_id: "UNKNOWN"` y `uuid` placeholder. NO se debe enviar: falta el environment_id. Ademas `persistent_session_id` no va en el body generado (es una suposicion sin confirmar en create).

Sin el script, la forma del body es la del get de cada latido: `{"name", "cron_expression", "enabled", "job_config": {"ccr": {"environment_id", "events": [...], "session_context": {"allowed_tools": [...]}}}}`.

## Quien la aplica

- **Madre-dev (PC, Desarrollo-Infra)**: update de Plataforma (`trig_01XVX9kgMExkapoN5XDdamx4`) y Hermes-Jarvis (`trig_01A9hCX7s5ZuaQ24TkK3Rr8d`). Son sus nubes segun el reparto del 11-oct.
- **Madre-marketing (PC)**: update de Lucia (`trig_013YP8Nxhwi8HbdufMuv2Var`) y Marca (`trig_01ExDbhoaxaXpzpvj26DEeQ8`). Son sus nubes segun el reparto del 11-oct.
- **Madre-marketing (PC)**: create del latido de Ventas, solo cuando haya environment_id. Antes, no.
- **Sergio Urcullo**: dar el environment_id de Ventas si la sesion no lo expone por la API. Razon: solo se ve en la web.
- **Integrador**: no aplica nada aqui.

Nota de permiso: en esta sesion RemoteTrigger es solo list/get/list_runs/get_run_log. Este punto no crea ni actualiza latidos.

## Prueba de hecho

1. `RemoteTrigger get` de cada latido: `derived_state.prompt` contiene `LATIDO v3` y la linea de carril correcta; `enabled: true`; `next_run_at` en su minuto; `persistent_session_id` igual al id de la sesion viva (comprobar con list_sessions; hoy UNKNOWN).
2. `RemoteTrigger list`: aparece un latido de Ventas con cron `37 * * * *` y `persistent_session_id` de Ventas.
3. `RemoteTrigger list_runs` del latido de Ventas: al menos una corrida con `status: ROUTINE_RUN_STATUS_SUCCEEDED` dentro de la hora siguiente a su creacion.
4. `get_run_log` de una corrida de Plataforma o Hermes: aparece `PASO 1b CODEX` o la ruta `CODEX-CONTRATO:` cuando hubo tarea de codigo.
5. Cuando una nube escriba un contrato: `git ls-tree` en su rama muestra `hermes-content/docs/handoff/codex-tareas/<carril>-<id>-<slug>.md` con `estado: pendiente`.

UNKNOWN abiertos: environment_id de Ventas; si la API acepta `persistent_session_id` en create; persistent_session_id contra la lista viva de sesiones; handoff de Plataforma y de Ventas; C06 (no existe en la cola).
