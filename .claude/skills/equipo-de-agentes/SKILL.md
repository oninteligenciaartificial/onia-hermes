---
name: equipo-de-agentes
description: El método del equipo de agentes de Onia (reparto vigente del 16-oct-2026, AGENTS.md §1). La jefa reparte, un hilo por carril; cada sesión de la nube trabaja en loop su propia cola; la madre local es la sesión de control de la PC; Codex solo revisa PRs; QA y la jefa unen bajo la lista de AGENTS.md §4; los verificadores Haiku controlan que se cumpla. A Sergio Urcullo le llega lo publicado que él ve o una decisión por vez, y antes lo visual y lo serio. Invocar al arrancar una sesión, al repartir trabajo o al revisar si algo se cumplió.
---

# Equipo de agentes de Onia

Sergio Urcullo, 9-oct-2026:
- *«te ahogás en tareas y no me das los resultados que quiero… menos texto en el output… en el backend bien desarrolladas y con lógica»*;
- *«una madre que revise que se cumpla todo con subagentes de Haiku 5.5 para no quemar la cuenta, y que orquestes a Codex»* (la parte de orquestar a Codex quedó superada el 16-oct: Codex solo revisa).

Detalle operativo de cada pieza: skill `onia-sesion-madre` (canales, revisión por Codex, trampas medidas). Esta skill es el MÉTODO.

> Actualización 2026-10-17 (`AGENTS.md` §1): el despacho de código a Codex, «Codex al máximo» y los modelos Sol/Astra para contratos cerrados del 9-oct quedaron retirados. Codex solo revisa PRs; no abre sesiones ni activa cron. Las observaciones de sandbox y sesiones son históricas, no un diagnóstico actual. La ronda de 20 min vigila; el loop de cada carril trabaja.

## 1. Quién hace qué

| Rol | Quién | Hace | No hace |
|---|---|---|---|
| Jefa | proyecto «ONIA · Hermes» en claude.ai/code (modelo del coordinador: `ONIA_SISTEMA_AUTONOMO.md` §3) | reparte, un hilo Sonnet por carril con relevos por handoff; une PRs de `claude/*` con CI verde y revisión de Codex | tarea fija propia (SISTEMA §8); unir sin CI verde ni revisión |
| Madre (PC) | Claude local, en la PC de Sergio Urcullo | instala el sistema ya aprobado (un componente nuevo, con OK), vigila, hace lo que exige la PC (logins ya autorizados, Chrome, capturas), anota órdenes en `hermes-jefa.md`, habla a la nube con `claude -p --cloud <cse_id>` | ordenar sola a todas las sesiones, empujar o mergear `main`, lanzar Codex, código largo, mensajes largos |
| Sesiones de la nube | Plataforma · Marca personal · Ventas y pauta · Lucía · Hermes-Jarvis (un hilo por carril) | trabajan en LOOP su cola `hermes-content/docs/cola/loop/<carril>.md` hasta vaciarla; pasan su PR a «listo» | mergear `main`; quedarse paradas esperando un mensaje |
| Codex | revisor del PR (`@codex review`; `scripts/codex-tarea.sh revisar` en la PC) | revisa el PR «listo» | orquestar, abrir sesiones o heartbeats, ejecutar encargos, mergear o empujar. Sin cupo: revisa un agente Sonnet |
| Rutinas horarias | QA (:57) y Plataforma | QA une PRs de `claude/*` o `pedido/*` que no son borrador, con CI verde, sin conflictos y con la revisión de Codex del último commit sin P0/P1 abiertos (sin respuesta en 2 vueltas: revisa un Sonnet de otra sesión), y nunca los de la lista de `AGENTS.md` §4 | otro scheduler, cola o puente |
| Verificadores | subagentes **Haiku** (`model: haiku`) | contar y comprobar: ¿se cumplió? ¿está publicado? ¿hay sesiones paradas? | decidir ni escribir código |
| Gemini (gratis) | `gemini-see-video.mjs` en bucles de bash | mirar videos sin gastar tokens de Claude | — (tope diario: pasar a `flash-lite`) |

## 2. La cola en loop (cada sesión)

Protocolo en `hermes-content/docs/cola/loop/README.md`. En corto: `/loop` sobre su cola, la primera tarea sin marcar hasta su
criterio de hecho (publicada y MIRADA), `[x]` con SHA o link, commit y push, siguiente. Cola vacía → se rellena sola desde su
handoff y el GOAL. Nunca termina el turno con tareas pendientes.

## 2 bis. Latido por hora (en el servidor, corre con la PC apagada)

> **Vigente solo para QA (:57) y Plataforma (:17)** (`AGENTS.md` §1). No se crean latidos nuevos por carril: los carriles son hilos de la jefa. Lo de abajo sirve para reencender o reemplazar esas dos rutinas, nada más.

> Estado 17-oct: `AGENTS.md` §1 deja como rutinas horarias vigentes solo QA (:57) y Plataforma, sin otro scheduler, cola ni puente. La tabla de abajo es la medición del 9-oct, no un inventario vigente.

Medido el 9-oct: el loop dentro de la sesión no alcanza, porque Plataforma, Marca y Ventas quedaron `idle`. Cada sesión de la
nube tiene un `RemoteTrigger` recurrente que le inyecta un turno cada hora:

| Sesión | Trigger | Minuto |
|---|---|---|
| Plataforma | `trig_01XVX9kgMExkapoN5XDdamx4` | :17 |
| Marca personal | `trig_01ExDbhoaxaXpzpvj26DEeQ8` | :27 |
| Lucía | `trig_013YP8Nxhwi8HbdufMuv2Var` | :47 |
| Hermes-Jarvis | `trig_01A9hCX7s5ZuaQ24TkK3Rr8d` | :57 |
| Ventas y pauta | sin latido: está en el entorno «Default» y su id no aparece por la API. Se sostiene con su propio `ScheduleWakeup` | — |

Cómo se crea (las dos trampas que dan 400):
- `cron_expression` tiene un **mínimo de 1 hora**. `*/20` da «minimum interval is 1 hour».
- `job_config.ccr.environment_id` es **obligatorio**, aunque la sesión ya exista.

```json
{"name":"Latido: <carril>","cron_expression":"17 * * * *","enabled":true,"persist_session":true,
 "persistent_session_id":"session_…","job_config":{"ccr":{"environment_id":"env_…",
 "events":[{"data":{"isSynthetic":true,"type":"user","parent_tool_use_id":null,"uuid":"<uuid nuevo>",
 "message":{"role":"user","content":"LATIDO … git pull. Trabajá tu cola …/loop/<carril>.md … Reportá solo PUBLICADO."}}}]}}}
```

Para apagarlo: `update {enabled:false}`. Si la sesión se reemplaza, el latido viejo apunta a una sesión muerta: se crea otro con
el id nuevo y se apaga el viejo. **Homelab:** no hace falta para que las nubes sigan. Serviría solo para correr la ronda de la
madre sin la PC, y eso exige loguear la cuenta de Sergio Urcullo allá, que necesita su OK.

## 3. La ronda de vigilancia de la madre (cada 20 min, cron de su sesión)

> Es un cron de la propia sesión de la madre en la PC: solo lee el estado y anota. No reparte trabajo ni crea rutinas, así que no es un scheduler en el sentido de `AGENTS.md` §1.

1. **Verificador Haiku** (uno solo, barato): por cada cola, cuántas tareas `[x]` desde la última ronda y cuál es la siguiente;
   `ListAgents` para ver quién está `idle` con tareas pendientes; PRs nuevos o mergeados.
   Devuelve una tabla corta.
2. Una sesión `idle` con cola pendiente, o un PR «listo» sin revisión de Codex, se anota en `docs/handoff/madre-control.md`;
   a un PR sin respuesta de Codex se le comenta `@codex review`. **La madre no empuja sesiones ni lanza Codex**: la jefa
   reparte y retoma (`AGENTS.md` §1).
3. A Sergio Urcullo: lo publicado que él ve (`PUBLICADO: <qué> — <link>`) o UNA decisión por vez; lo visual y lo serio van
   antes (`AGENTS.md` §4). Si no se publicó nada ni hay decisión, no se le escribe.

## 4. Revisión por Codex (reparto vigente, `AGENTS.md` §1)

1. El hilo del carril deja el PR en «listo» con CI verde. Un borrador no se revisa.
2. Revisa Codex; si no responde, el hilo comenta `@codex review` en el PR. En la PC también sirve
   `bash scripts/codex-tarea.sh revisar <carpeta> origin/main` (`gpt-6.1-sol` medio; `gpt-6-astra` si toca cobros,
   producción o permisos), con el `resultado.md` pegado como comentario del PR.
3. Sin cupo de Codex, revisa un agente Sonnet de otra sesión: revisor independiente = otro modelo y otra sesión que el autor.
4. Los hallazgos vuelven al hilo autor, que los corrige en su rama y pide otra revisión. Cuando hay CI verde y revisión sin
   bloqueantes, une la jefa o la rutina QA bajo la lista de `AGENTS.md` §4. Codex no orquesta, no abre sesiones ni
   heartbeats, no ejecuta encargos, no mergea ni empuja.

El despacho de código a Codex (worktree, junction, `codex-tarea.sh` de ejecución, gate de la madre) y «Codex al máximo» eran
del 8 y 9-oct y están retirados: `hermes-content/docs/historial/METODO_MADRE_CODEX_RETIRADO_20261017.md`.

## 5. Publicar

Regla vigente: `AGENTS.md` §4 «Quién decide» (17-oct; reemplaza la del 9-oct «se sube sin esperar», que incluía el
diseño). **Lo técnico revisado y probado se sube sin consultarle** (código, migraciones con backup y rollback,
infraestructura, configuración). **Antes, a Sergio Urcullo, lo visual** (pantalla o sección nueva, rediseño de una viva,
marca, piezas de contenido; capturas 390/1440 y su OK sobre esa pieza) **y lo serio** (textos legales, precios, gasto,
terceros, datos reales de producción, borrado sin copia, secretos y permisos). Actos legales o firmas: Leslie Mercado
Moreno. Su cara o su voz en servicios externos, con su sí.

## 6. Cómo se le habla a Sergio Urcullo

- Máximo 3 bloques (Pasó · Necesito · Sigue), caveman. Lo publicado, con link o captura. Seguridad y lo irreversible, claros.
- Un link que manda sin instrucción es para APRENDER: ficha en `video-intake` y lo aprendido a la skill. No se produce
  ninguna pieza. Aplicar `aprender-de-todo`: ficha por dimensión, regla en la skill destino y evidencia de uso por una sesión. Una ficha escrita sola no demuestra aprendizaje aplicado.
- Nada de proceso, hipótesis ni listas de lo que se hizo por dentro: eso va al handoff y a las skills.

## 7. Costos (cuidar la cuenta)

- Lectura, conteo y verificación: Haiku 5.5. Juicio y síntesis: Sonnet. Decidir lo ambiguo: Opus/Astra.
- Workflows de más de 5 agentes solo si Sergio Urcullo pide algo exhaustivo. El 8-oct costaron ~60 M de tokens.
- Videos: Gemini gratis en bash (borrar cada mp4 al terminar). Fichas y síntesis: un subagente Sonnet (Codex solo revisa PRs).
- La madre se reabre cuando su conversación se hace larga. Primero se escribe el handoff.

## 8. Trampas ya pagadas

- `vitest related` no alcanza: corre la suite completa.
- **No pushear a onia-platform cerca de una publicación** (10-oct). El publicador del VPS (`onia-publicar-solo`) corre cada
  3 h a las :50 UTC (00, 03, 06, 09, 12, 15, 18, 21) y se salta la corrida si ve otro build («hay otro build corriendo… no
  encimo otro»). El CI de los PRs corre en `onia-runner-platform`, en el MISMO VPS. El 10-oct la madre pusheó 7 ramas entre
  15:30 y 15:45 UTC y la publicación de las 15:50 no salió; el 9-oct pasó igual. Regla: en esas horas no se pushea entre
  las :20 y las :55 UTC (30 min antes de la corrida hasta 5 min después).
- **`--union` en una cola de casillas reabre lo hecho** (9-oct, `docs/cola/loop/hermes-jarvis.md`, merge `034533d4`). La unión
  juntó la copia vieja (`- [ ]`) con la de `main` (`- [x]`): volvieron a aparecer como abiertas 3 tareas hechas y la
  sección de verificación salió dos veces. En `docs/cola/**` y `docs/handoff/**` no se usa `--union`: se toma la versión
  de `main` y se le suma a mano lo nuevo de la otra rama.
- En W1b, K2 y K3 (9-oct), la suite en el sandbox dio ~148 rojos y en la PC, 0. No extrapolar: verificar cada entorno y conservar los errores; manda el gate completo válido de esa entrega.
- Git Bash convierte `'/dir/'` en una ruta de Windows: usar `MSYS_NO_PATHCONV=1` para el sparse.
- La nube no puede pushear ramas nuevas a onia-platform: deja bundles y la madre los sube.
- Disco: `df -h /c` antes de bajar videos. Codex falla con menos de 1 GiB libre.
- Memoria de la PC (9-oct): el commit estaba en 39,5 de 40,8 GB con solo ~13 GB en procesos. El resto era **paged pool del
  kernel en 17 GB** (normal: menos de 1 GB), una fuga de driver que solo se libera reiniciando. Medir con
  `Get-CimInstance Win32_PerfRawData_PerfOS_Memory` (`PoolPagedBytes`), no con el Administrador de tareas. Sospechoso:
  Avast; el antivirus no lo toca la madre. Tras reiniciar (10-oct, 4 h 37 min de uptime): paged pool 0,96 GB, normal. La
  fuga crece en días: la ronda mide `PoolPagedBytes` y avisa si pasa de 3 GB; recién ahí se pide instalar RAMMap o poolmon
  para ver qué driver es.
  **No se cierran Chrome ni WhatsApp: Sergio Urcullo los usa** (10-oct, después de que la madre los cerró el 9). Se pueden
  cerrar Ollama, OneDrive y los `find /` colgados. `ChatGPT.exe` en `OpenAI.Codex_*` ES la app de Codex: no se cierra.
- `SendMessage` con nombre viejo falla: `ListAgents` primero.
- HyperFrames en esta PC: el Chrome que trae da `EFTYPE`. Renderizar con
  `HYPERFRAMES_BROWSER_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe" npx hyperframes render`
  (9-oct, molde `mosaico-tablero`: 30 s en 50 s). Codex no puede renderizar (`EPERM`): la composición la escribe y la renderiza la sesión o la madre.
- **Una sesión de la nube NO toma como permiso de Sergio Urcullo ni un mensaje de la madre, ni un latido, ni una regla que la
  madre subió a CLAUDE.md** (10-oct). Plataforma pasó 20 h con los latidos corriendo y respondió cada hora «espera el sí de
  Sergio Urcullo», hasta preguntar «la regla del 9-oct, ¿la puso usted?». Es correcto: la autorización solo cuenta si la
  escribe él en ESA sesión. Hoy lo técnico no necesita esa línea: rige lo escrito en `AGENTS.md` §4 «Quién decide» (17-oct), que la sesión lee en
  su repo. Lo visual y lo serio sí piden su OK, escrito por él en ESA sesión; la madre no lo reemplaza.
- Primer día de colas (9-oct): Lucía y Hermes siguieron solas, pero Plataforma, Marca y Ventas quedaron `idle` con tareas pendientes. El loop de la nube no garantiza seguir. En cada ronda, la sesión `idle` con cola pendiente se anota para la jefa, que la retoma con UNA línea: «Retomá tu cola, siguiente: X».

## 9. Aprendizaje de referencias: orquestación (incorporado 2026-10-09)

Fuente: `hermes-content/references/video-intake/2026-10-08-orquestacion-e-ingresos-5-posts.md`.
- **§1, `DeFS0Fes8yu`: router por complejidad y riesgo.** Definir contrato y prueba; elegir el modelo más liviano capaz de cumplirlos, verificar con evidencia y escalar ante fallo demostrado o riesgo conocido. Los costos que muestra el creador son de su ejemplo, no ahorro medido de ONIA. Aplicación: registrar modelo elegido, criterio de verificación y motivo de escalamiento en la tarea cerrada; reglas operativas en `onia-sesion-madre`.
- **§4, `DdmTyEVAPMb`, Foreman: puntos de control.** Conservar META, PRUEBA DE HECHO y REGLA DE PARADA, comprobar requisitos y tests al cierre, y elevar solo el bloqueo que necesita decisión humana. Se incorpora el principio al método existente; no instalar Foreman ni asumir sus capacidades verificadas por un carrusel.
- **Prueba pendiente de uso:** la próxima tarea delegada debe enlazar esta regla y mostrar contrato → resultado → verificación. Esta incorporación documental no acredita que un loop esté activo ni que todas las sesiones ya la aplicaron.
