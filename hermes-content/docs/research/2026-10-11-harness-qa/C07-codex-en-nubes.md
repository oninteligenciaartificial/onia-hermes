# C07 - ¿Puede una nube correr Codex directo?

Fecha: 2026-10-11 (medido 05:25-05:30 UTC). Punto C07 del QA del harness. Versión 2: corrige el verificador.
Solo lectura salvo este archivo. Ninguna tarea de Codex se ejecutó. No se hizo git.

## Estado medido

| Hecho | Evidencia |
|---|---|
| CLI de Codex instalado y logueado con ChatGPT en la PC | `codex --version` -> `codex-cli 0.161.0`; `codex login status` -> `Logged in using ChatGPT` |
| El CLI tiene login sin navegador | `codex login --help`: `--device-auth` (flujo de código) y `--with-api-key` (clave por stdin) y `--with-access-token`. No probado en una nube: UNKNOWN si el código llega a tiempo |
| El CLI puede lanzar Codex cloud sin TUI | `codex cloud --help`: `exec`, `status`, `list`, `apply`, `diff`. `codex cloud exec` no se lanzó (cuesta cupo) |
| Cupo semanal de Codex hoy | `node scripts/codex-cupo.mjs` -> `semanal: 0% usado`, reinicia `2026-10-18 05:16 UTC`, medido `2026-10-11T05:25:18Z`. La corta: UNKNOWN |
| Cifra vieja del harness | `hermes-content/docs/ONIA_HARNESS.md:37` dice Codex "va al 56 % del tope semanal" (sin fecha de medición). `:44` y `:115` (58 %) son la cuota de tokens de **Opus**, no de Codex. La v1 de este documento citó mal esa cifra |
| Wrapper que usa la PC | `scripts/codex-tarea.sh:1-60`: `codex` de npm, sandbox `workspace-write` + `windows.sandbox="unelevated"`, salida en `~/.codex/madre-tareas/`, Codex no hace git |
| Las nubes no instalan ni autentican Codex | `.claude/settings.json`: único hook `SessionStart` = `node scripts/nube-ssh-vps.mjs`, que solo sirve para SSH (`scripts/nube-ssh-vps.mjs:23`: sale si `CLAUDE_CODE_REMOTE !== "true"`). `grep codex scripts/`: solo aparece en `codex-tarea.sh`, `codex-cupo.mjs` y `codex-worktree.sh` |
| Entorno Codex cloud | ID `6abad6a0aae081919f0b315818becb21` (Platform) citado en `.claude/skills/equipo-de-agentes/SKILL.md` y `onia-sesion-madre/SKILL.md` (v1 lo atribuía a ONIA_HARNESS.md:67; esa línea no trae el ID) |
| Formato de la cola | `hermes-content/docs/cola/loop/madre.md` existe. Filas de checkbox: `- [ ] <ID> <texto>. Dueño: <X>`. No existe la cadena `codex pendiente` (grep: 0) ni la carpeta `codex-tareas/` aparece en `madre.md` |
| Credencial en claro en `~/.codex/config.toml` | Una línea con la clave `Authorization` (valor no leído ni copiado aquí). Viene de `ONIA_HARNESS.md:39` (columna Permisos) y `:118` (punto 9, "permisos y secretos"). La v1 citó `:39` como "punto 10" |
| Exposición en log | La v1 decía que el valor "se imprimió por accidente". No lo pude verificar en esta sesión. Se trata como exposición posible y se marca para rotación |
| Red de la nube | UNKNOWN: si `chatgpt.com` y `api.openai.com` pasan la lista de salida del entorno. No se midió desde una nube |
| Cupo compartido | Casi seguro sí (misma cuenta). No medido |

## Brecha

1. Ninguna nube tiene Codex instalado ni autenticado. Para ellas Codex es solo "contrato en la cola + madre".
2. Un login por código (`--device-auth`) se pierde en cada contenedor nuevo y exige teclear un código cada vez. No es autónomo.
3. Una clave API es autónoma, pero es gasto aparte del plan y requiere el sí de Sergio Urcullo. Además hay que guardarla como secreto del entorno.
4. `codex cloud exec` solo lo lanza quien tiene el CLI logueado (la PC). Inferencia, no probada: se espera que una nube sin ese login no pueda disparar tareas.
5. Hay una credencial en claro en `~/.codex/config.toml`, en la clave `Authorization`.

## Configuración propuesta

Orden por costo y autonomía (el más barato y autónomo que ya existe va primero):

| # | Camino | Costo | Autonomía de la nube | Veredicto |
|---|---|---|---|---|
| 1 | (c) Contrato en la cola + madre corre `codex-tarea.sh` | 0 extra (plan) | Media: la nube escribe el contrato y sigue; la madre ejecuta y revisa | Base actual. Falta la regla para la nube (paso A) |
| 2 | (e) `codex cloud exec` lanzado por la madre-dev | 0 extra (mismo cupo) | Alta para tareas largas: corre fuera de la PC, deja diff | Lotes grandes de Plataforma. Probar con una tarea trivial primero. No se elige el modelo (ONIA_HARNESS.md:37) |
| 3 | (d) `@codex` por GitHub (ver C06) | UNKNOWN (depende del plan) | Alta: la nube abre PR y Codex comenta | Probar en un PR de prueba. Requiere instalar la app de Codex en el repo: decide Sergio Urcullo |
| 4 | (a) CLI + `codex login --device-auth` en la nube | 0 extra | Baja: código humano por sesión | Solo prueba puntual. No automatizable |
| 5 | (b) `printenv OPENAI_API_KEY \| codex login --with-api-key` | Gasto por token, aparte | Total | Último recurso. Requiere el sí de Sergio Urcullo con tope en USD |

Texto y comandos listos:

A. Regla para la nube (agregar a `.claude/skills/equipo-de-agentes/SKILL.md`, sección 4 o una sección nueva "Codex desde la nube"):
```
Codex desde la nube: no se instala ni se loguea aquí. Para código cerrado:
1. Escribí el contrato en hermes-content/docs/handoff/codex-tareas/<ID>-<slug>.md
   (META, PRUEBA DE HECHO, REGLA DE PARADA), commit y push en tu rama.
2. En hermes-content/docs/cola/loop/<carril>.md agregá la fila:
   - [ ] <ID> codex pendiente: ver codex-tareas/<ID>-<slug>.md. Dueño: madre
3. Seguí con otra tarea de tu cola. La madre corre el contrato y deja resultado.md.
   Al volver, leé la fila y el resultado antes de marcarla.
```
Nota: el formato de fila y la ruta `cola/loop/madre.md` ya existen; la fila de arriba es nueva y debe confirmarse en `README.md` de la cola.

B. Lanzamiento desde la PC (madre-dev, solo con rama revisada):
```
codex cloud exec --env 6abad6a0aae081919f0b315818becb21 --branch <rama> "$(cat hermes-content/docs/handoff/codex-tareas/<ID>-<slug>.md)"
codex cloud status <task_id>
codex cloud diff <task_id>
```
No ejecutar sin el sí de Sergio Urcullo para la primera tarea (consume cupo).

C. Prueba de red, desde una sesión en la nube (solo conectividad, sin secretos):
```
curl -sS -o /dev/null -w "%{http_code}\n" https://chatgpt.com
curl -sS -o /dev/null -w "%{http_code}\n" https://api.openai.com/v1/models
```
Si alguno da 000 o 403, los caminos 4 y 5 quedan descartados.

D. Camino 5, solo si Sergio Urcullo lo aprueba: clave con tope mensual, guardada solo como secreto del entorno `Onia`. Instalar `@openai/codex` requiere su aprobación de instalación. No ejecutar antes.

E. Higiene (Sergio Urcullo):
1. Rotar la clave del servicio n8n que está en `~/.codex/config.toml`, clave `Authorization`.
2. Sacarla del archivo: moverla a una variable de entorno. UNKNOWN si la clave de MCP de Codex 0.161 acepta `bearer_token_env_var`; verificarlo con `codex mcp --help` antes de editar.
3. Prueba: `grep -c "Authorization" ~/.codex/config.toml` da 0.

## Quién la aplica

- **Madre-dev** (sesión local de la PC): paso A (texto de la skill `equipo-de-agentes`), paso B (`codex cloud exec`), y la fila de cola. Es la única que tiene el CLI logueado y el harness del repo.
- **Sesión Plataforma** (nube): paso C (curl desde la nube). Es solo lectura de red y no toca secretos.
- **Madre-marketing**: no lanza Codex. Pide tareas por contrato a madre-dev (evita dos dueños del cupo).
- **Sergio Urcullo**: camino 3 (instala y autoriza la app de Codex en el repo), camino 5 y paso D (gasto y aprobación de instalación), paso E (rotación y edición de `~/.codex/config.toml`, fuera del worktree).
- **Integrador**: usa el camino 3 cuando esté autorizado. No edita `~/.codex`.

## Prueba de hecho

1. Paso C ejecutado desde una nube: los dos códigos HTTP quedan pegados en el handoff. Hecho cuando deja de ser UNKNOWN.
2. Un contrato de prueba escrito por una nube en `codex-tareas/` y su fila en la cola. La madre lo corre con `scripts/codex-tarea.sh` (con permiso), aparece `resultado.md` con `session_id`, y la fila pasa a `[x]`.
3. Paso B con una tarea trivial: devuelve `task_id`, `codex cloud diff <task_id>` muestra el cambio. Cupo antes y después anotado con `node scripts/codex-cupo.mjs`.
4. Camino 3: un PR de prueba con `@codex review` recibe respuesta. Medido por tiempo de respuesta.
5. Paso E: `grep -c "Authorization" ~/.codex/config.toml` da 0, y la clave rotada no funciona.
