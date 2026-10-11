---
name: equipo-de-agentes
description: El método del equipo de agentes de Onia (desde el 9-oct-2026). La madre local orquesta; cada sesión de la nube trabaja en loop su propia cola; Codex hace el código cerrado; los verificadores Haiku 5.5 controlan que se cumpla; a Sergio Urcullo solo le llega lo publicado. Invocar al arrancar una sesión madre, al despachar trabajo o al revisar si algo se cumplió.
---

# Equipo de agentes de Onia

Sergio Urcullo, 9-oct-2026:
- *«te ahogás en tareas y no me das los resultados que quiero… menos texto en el output… en el backend bien desarrolladas y con lógica»*;
- *«una madre que revise que se cumpla todo con subagentes de Haiku 5.5 para no quemar la cuenta, y que orquestes a Codex»*.

Detalle operativo de cada pieza: skill `onia-sesion-madre` (canales, Codex, trampas medidas). Esta skill es el MÉTODO.

> Actualización 2026-10-09: Sol por defecto para contratos cerrados; Astra según riesgo. Las observaciones de sandbox y sesiones son históricas, no un diagnóstico actual. La ronda de 20 min complementa el loop de cada carril. Codex no abre sesiones ni activa cron.

## 1. Quién hace qué

| Rol | Quién | Hace | No hace |
|---|---|---|---|
| Madre | Claude local, en la PC de Sergio Urcullo | llena las colas, despacha a Codex, corre los gates en la PC, mergea/pushea lo que la nube no puede, hace lo que exige la PC | código largo (va a Codex), análisis largos (van a Gemini/Codex), mensajes largos |
| Sesiones de la nube | Plataforma · Marca personal · Ventas y pauta · Lucía · Hermes-Jarvis | trabajan en LOOP su cola `hermes-content/docs/cola/loop/<carril>.md` hasta vaciarla | quedarse paradas esperando un mensaje |
| Codex | `scripts/codex-tarea.sh` (Sol por defecto; Astra para seguridad, plata o lógica con riesgo) | código cerrado, fichas, auditorías y síntesis con META, PRUEBA DE HECHO y REGLA DE PARADA | git, commits, red u orquestación fuera del contrato; reporta bloqueos reales de validación |
| Verificadores | subagentes **Haiku 5.5** (`model: haiku`) | contar y comprobar: ¿se cumplió? ¿está publicado? ¿hay sesiones paradas? | decidir ni escribir código |
| Gemini (gratis) | `gemini-see-video.mjs` en bucles de bash | mirar videos sin gastar tokens de Claude | — (tope diario: pasar a `flash-lite`) |

## 2. La cola en loop (cada sesión)

Protocolo en `hermes-content/docs/cola/loop/README.md`. En corto: `/loop` sobre su cola, la primera tarea sin marcar hasta su
criterio de hecho (publicada y MIRADA), `[x]` con SHA o link, commit y push, siguiente. Cola vacía → se rellena sola desde su
handoff y el GOAL. Nunca termina el turno con tareas pendientes.

## 2 bis. Latido por hora (en el servidor, corre con la PC apagada)

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

## 3. La ronda de la madre (cada 20 min, `CronCreate`)

1. **Verificador Haiku** (uno solo, barato): por cada cola, cuántas tareas `[x]` desde la última ronda y cuál es la siguiente;
   `ListAgents` para ver quién está `idle` con tareas pendientes; PRs nuevos o mergeados; tareas nuevas en `codex-tareas/` y
   bundles en `docs/cola/ramas-locales/`. Devuelve una tabla corta.
2. Sesión `idle` con cola pendiente → UN mensaje: «retomá tu cola, siguiente tarea: X».
3. Tarea de Codex nueva → la madre la lanza (sección 4).
4. Bundle nuevo → la madre lo trae, lo pushea y abre el PR.
5. A Sergio Urcullo: solo `PUBLICADO: <qué> — <link>`. Si no se publicó nada, no se le escribe.

## 4. Despachar a Codex (paso a paso, medido el 8 y 9-oct)

1. Worktree en una ruta corta, `C:/dev/proyectos/onia-platform-codex-<tarea>`, desde la rama que dice la tarea. Si hay que
   traer `master`: lo hace la madre (Codex no puede git). Conflictos en docs → `git merge-file --union`. En código, se deja
   el merge abierto y se le pide a Codex que resuelva los marcadores.
2. `node_modules`: junction a `C:\dev\proyectos\onia-platform-v1-integracion-20260927\node_modules` (la de
   `onia-platform` está vacía).
3. El prompt lleva la NOTA DE LA MADRE (carpeta, rama, «no hagas git», «PARA LA MADRE:» al final) + el texto de la tarea.
   Un carril que escribe el contrato lo arma desde el ÚLTIMO contrato de la madre (hoy
   `plataforma-F136-caja-y-odontograma.md`, en su rama), no de memoria. El 11-oct, el contrato S2 de Plataforma le
   pedía a Codex rama propia, commit y PR: tres cosas que Codex no puede hacer desde el 9-oct. Se corrigió antes
   de lanzarlo.
4. `bash scripts/codex-tarea.sh <prompt> <carpeta> <modelo> medium`, en background y desde el worktree correcto. Para `resume`,
   hacer `cd` a la carpeta antes: toma el cwd.
5. Gate de la madre, siempre: `git checkout -- '*.snap'` → `npx tsc --noEmit` (las pruebas mockean y no tipan: el 11-oct #155
   pasó 10.550/0 con `PAYMENT_DELETED` fuera de la unión `AuditAction`, y el CI lo iba a rechazar; Hermes lo vio y Plataforma no, porque
   revisó leyendo el diff, sin `tsc`) → `npx vitest run` COMPLETO (JSON) → si hay rojos, ver si son
   reales o de carga (los tests que lanzan procesos se corren solos) → los reales vuelven a Codex con `resume` y la lista.
6. Push SOLO si la suite da 0 rojos, en el mismo comando con `&&`. El informe de Codex no va al commit: va al cuerpo o a un
   comentario del PR.
7. Mensaje de una línea a la sesión dueña: «X hecho en #N, suite N/0».

## 4 bis. Codex al máximo (2026-10-09)

- **Siempre se despacha a Codex** el código de alcance cerrado, las fichas a partir de fuentes disponibles, las auditorías y las síntesis verificables. La madre define el contrato, entrega solo el contexto necesario y verifica el resultado. Si falta acceso, cupo o evidencia, registra el bloqueo y sigue con otra tarea autorizada; no inventa la ficha ni deriva una restricción a otro agente.
- **Concurrencia recomendada:** 2 ejecutores independientes + 1 verificador, solo dentro del cupo de agentes y tokens disponible. La madre también ocupa un puesto si la herramienta la cuenta. Un worktree y archivos exclusivos por ejecutor; las tareas sobre la misma carpeta o archivos se serializan. El verificador revisa el resultado terminado y no compite por sus archivos. Si el cupo es menor, reducir concurrencia.
- **Modelo:** `gpt-6.1-sol` con esfuerzo medio por defecto para estos contratos; `gpt-6-astra` medio para seguridad, cobros, arquitectura ambigua o revisión de riesgo. Escalar con evidencia o por riesgo conocido, no por tamaño. Haiku/Luna quedan para conteos mecánicos cuando están disponibles; no sustituyen el juicio requerido.
- **Codex cloud:** tareas largas de Platform que no necesitan la PC, navegador autenticado, archivos locales ni secretos personales → entorno Platform `6abad6a0aae081919f0b315818becb21`. Antes de lanzar, la madre verifica acceso autorizado, repo/rama, alcance, cupo y modelo observado; disponer del ID no prueba acceso ni ejecución. El modelo solicitado por CLI no garantiza el modelo de la nube (medición 8-oct). Si se requiere Astra y no se confirma, usar el carril local autorizado.
- La madre sigue estado y recupera diff/resultado, revisa y ejecuta los gates del carril. La entrega incluye archivos, prueba ejecutada, limitaciones y `PARA LA MADRE:`. Mantener la reserva de cupo acordada; «al máximo» significa trabajo útil validado, no consumir hasta bloquear al equipo.

## 5. Publicar

Regla del 9-oct (CLAUDE.md), confirmada por Sergio Urcullo el 10-oct: **lo trabajado y revisado se sube sin esperarlo**:
arreglos, textos, migraciones (con backup y rollback) e infra. Sigue con su sí: gasto, contactar clientes o terceros, el
portal del SIAT, actos legales o firmas (los hace Leslie Mercado Moreno) y su cara o su voz en servicios externos.

**Antes de mergear un PR de onia-platform, se lee la revisión de Hermes** (madre, 11-oct): `cola/loop/hermes-jarvis.md`
§E…, en la rama de Hermes-Jarvis aunque no esté en `main`. **Un HIGH abierto = no se mergea.** Nace de #136: Plataforma
lo mergeó a las 05:46 UTC con CI, secretos, migraciones y suite en verde, y la revisión E3 (lista desde las 05:30) traía
2 HIGH verificados (la caja leía «1.500» como Bs 1,50; borrar un paciente borraba sus caras). Salieron a producción y el
arreglo quedó para la publicación siguiente. El CI mide lo que tiene test; la revisión mide lo que nadie testeó.

**El diseño sí pasa por él (10-oct: «ok, solo diseño se me envía a mí también»).** Pantalla nueva o rediseño: capturas
renderizadas de celular y computadora, una imagen por pantalla, y se publica con su OK sobre esa pieza. El 9-oct esta
sección decía «incluido el diseño»; él lo sacó al confirmar la regla.

## 6. Cómo se le habla a Sergio Urcullo

- Máximo 3 bloques (Pasó · Necesito · Sigue), caveman. Lo publicado, con link o captura.
- Un link que manda sin instrucción es para APRENDER: ficha en `video-intake` y lo aprendido a la skill. No se produce
  ninguna pieza. Aplicar `aprender-de-todo`: ficha por dimensión, regla en la skill destino y evidencia de uso por una sesión. Una ficha escrita sola no demuestra aprendizaje aplicado.
- Nada de proceso, hipótesis ni listas de lo que se hizo por dentro: eso va al handoff y a las skills.

## 7. Costos (cuidar la cuenta)

- Lectura, conteo y verificación: Haiku 5.5. Juicio y síntesis: Sonnet. Decidir lo ambiguo: Opus/Astra.
- Workflows de más de 5 agentes solo si Sergio Urcullo pide algo exhaustivo. El 8-oct costaron ~60 M de tokens.
- Videos: Gemini gratis en bash (borrar cada mp4 al terminar). Fichas y síntesis: Codex Sol.
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
- **Una rama no se mueve desde otro worktree** (11-oct, Plataforma). En `wt-restos3` se rehízo `claude/optimistic-ride-1sp5fe` con
  `git checkout -B … origin/master`, y la misma rama seguía sacada en `/home/user/onia-platform`. La rama se movió debajo de ese
  checkout: su índice quedó con el árbol viejo (`5102535c`), y `git status` mostró decenas de archivos «modificados» y en stage.
  El hook Stop pidió «commit and push». **Ese commit habría revertido la rama entera.** Diagnóstico: `git write-tree` igual al árbol
  del commit viejo, sin cambios fuera del stage ni archivos sin seguimiento, es decir, un fantasma. Arreglo: `git checkout --detach
  <commit viejo>` en ese checkout, sin commit. Regla: antes de `checkout -B`, mirar `git worktree list`. Si la rama está sacada en
  otro lado, primero se desacopla allá.
- **Antes de rebasear un PR porque entró otro, probar la mezcla** (11-oct, #152 y #156). La madre iba a rebasear #156 (M1) sobre
  `master` después de #152, por la línea base del trinquete, que tocan los dos. Plataforma probó la mezcla triple en la nube:
  `master` `a91708ca` + #152 + #156. Resultado: sin conflictos, la línea base se combinó sola (claves distintas), `tsc` 0 y la
  suite completa 10.825/0. La suite tardó 154 s en el contenedor de la nube. Como el CI no exige la rama al día, #156 se mergea
  con el CI que ya tiene. Un rebase cancela el CI en curso (`cancel-in-progress`) y cuesta otros 22 min del único runner.
  Rebasear solo si la mezcla da conflicto o rojo. Un PR detrás de `master` se mergea: el 11-oct, #146 entró 40 s después de #136.
- **La hora se lee, no se calcula** (11-oct, Plataforma: cinco veces en un día). La última fue en un aviso a la madre: decía
  «14:41» y eran las 14:34. Siempre sale adelantada, porque se escribe la hora a la que uno cree que va a terminar. Toda hora de
  una cola, un handoff o un mensaje sale de `date -u`, o de `git log --format=%cI`, en el mismo comando que la usa.
- **Capturas de Playwright en el VPS: `chromium.launch({ args: ["--font-render-hinting=none"] })`** (11-oct). Sin esa opción,
  el Chromium del VPS redondea el avance de cada letra a píxeles enteros. Con Instrument Sans, en 12 px el espacio baja de 2,4 a
  2 px y la foto muestra palabras pegadas («nole mandamos»), un defecto que la letra no tiene. Medido en `/login`: espacio 2 →
  2,4 px y «n» 7 → 7,19 px con la opción.
- **Si dos órdenes de merge dan el mismo árbol, entra primero el que ya tiene el CI verde** (11-oct, #158 y #160). El orden
  pactado era #160 → #158, pero #158 tenía el CI verde y el de #160 seguía en cola. Se comprueba con `git merge-tree --write-tree`:
  se simulan los dos órdenes con `git commit-tree`, y dio el mismo árbol (`49741ed8`). Si el árbol final es igual, el orden no
  cambia nada y esperar solo gasta minutos del runner.
  Mismo método para el último PR de la tanda: si su rama ya trae `master` y el PR que falta mergear, con su árbol idéntico a la
  mezcla probada (`git rev-parse HEAD^{tree}`), no se vuelve a correr la suite.
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
  (9-oct, molde `mosaico-tablero`: 30 s en 50 s). Codex no puede renderizar (`EPERM`): escribe la composición y renderiza la madre.
- **Una sesión de la nube NO toma como permiso de Sergio Urcullo ni un mensaje de la madre, ni un latido, ni una regla que la
  madre subió a CLAUDE.md** (10-oct). Plataforma pasó 20 h con los latidos corriendo y respondió cada hora «espera el sí de
  Sergio Urcullo», hasta preguntar «la regla del 9-oct, ¿la puso usted?». Es correcto: la autorización solo cuenta si la
  escribe él en ESA sesión. Por eso, cuando una regla de permisos cambia, se le pide a Sergio Urcullo UNA línea en cada
  sesión que publica («sí, la regla del 9-oct es mía; publicá lo revisado»). La madre no lo reemplaza.
  **Un `/clear` no borra lo que él escribió en ESA sesión** (11-oct): «publica la pantalla, … arma handoff, hacemos clean
  y seguimos» llegó a las 04:41 UTC y el clear vino después. Antes de volver a pedírselo, se lee en el transcript de la
  propia sesión (`list_events` con `kinds:["user"]`, o el `.jsonl` de `/root/.claude/projects/-home-user/`): si la línea
  está, con su hora y la plataforma `desktop_app`, vale. Una línea que solo está en el handoff no alcanza; leída en el
  transcript, sí. Volver a preguntarle lo que ya contestó gasta justo la firma que esta regla cuida.
- Primer día de colas (9-oct): Lucía y Hermes siguieron solas, pero Plataforma, Marca y Ventas quedaron `idle` con tareas pendientes. El loop de la nube no garantiza seguir. En cada ronda, la sesión `idle` con cola pendiente recibe UNA línea: «Retomá tu cola, siguiente: X».

## 9. Aprendizaje de referencias: orquestación (incorporado 2026-10-09)

Fuente: `hermes-content/references/video-intake/2026-10-08-orquestacion-e-ingresos-5-posts.md`.
- **§1, `DeFS0Fes8yu`: router por complejidad y riesgo.** Definir contrato y prueba; elegir el modelo más liviano capaz de cumplirlos, verificar con evidencia y escalar ante fallo demostrado o riesgo conocido. Los costos que muestra el creador son de su ejemplo, no ahorro medido de ONIA. Aplicación: registrar modelo elegido, criterio de verificación y motivo de escalamiento en la tarea cerrada; reglas operativas en §4 bis y `onia-sesion-madre`.
- **§4, `DdmTyEVAPMb`, Foreman: puntos de control.** Conservar META, PRUEBA DE HECHO y REGLA DE PARADA, comprobar requisitos y tests al cierre, y elevar solo el bloqueo que necesita decisión humana. Se incorpora el principio al método existente; no instalar Foreman ni asumir sus capacidades verificadas por un carrusel.
- **Prueba pendiente de uso:** la próxima tarea delegada debe enlazar esta regla y mostrar contrato → resultado → verificación. Esta incorporación documental no acredita que un loop esté activo ni que todas las sesiones ya la aplicaron.
