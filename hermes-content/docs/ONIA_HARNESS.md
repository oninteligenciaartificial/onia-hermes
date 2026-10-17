# Harness de Onia

> **Superado en parte por `AGENTS.md` §1/§4 y `ONIA_SISTEMA_AUTONOMO.md` (17-oct-2026):** `onia-cola` está muerto desde el 27-sep; la madre no es dueña única ni mergea; Codex solo revisa; `main` solo por PR con CI verde y revisión de Codex. Las filas que digan otra cosa son del 10-oct.
>
> **Fuente de verdad del harness (inventario del 10-oct):** qué lo compone, dónde corre cada loop y quién es dueño de cada frente. Doc vivo,
> sin fecha en el nombre: se EDITA. Pedido de Sergio Urcullo del 10-oct (A5 en `cola/loop/madre.md`): *«investigar qué
> es un harness y cómo lo tenemos hecho, loops, subagentes y que toquemos todos los frentes»*.
> Salió del workflow `wf_da25d090-4e5`: teoría con fuentes, 2 inventarios, frentes, arquitecto y crítico. El crítico
> verificó contra los archivos y corrigió el diseño (§8).
>
> **Qué va en cada doc:**
> - `ONIA_EQUIPO_DE_AGENTES.md`: el plan del equipo (roles, modelos, ciclo de una tarea). Leer su §Crítica.
> - `ONIA_EQUIPOS_POR_SESION.md`: el equipo de cada sesión. Lo escribe A1 y **todavía no existe**.
> - `cola/loop/madre.md`: el libro único de puntos (qué está abierto, quién lo tiene, con qué prueba).
> - Este doc: el mapa. La tabla de loops de §3 reemplaza a la §F de madre.md.
> - Evidencia de hoy: `research/2026-10-10-auditoria-equipo-de-agentes.md`. La auditoría A4
>   (`research/2026-10-10-auditoria-madre-v3.md`) todavía no existe; cuando entre se enlaza acá.

## 1. Qué es un harness

1. Agente = modelo + harness. El harness es todo lo que no es el modelo: el que trae la herramienta y el que el equipo arma para su propio código ([Fowler](https://martinfowler.com/articles/harness-engineering.html)).
2. Es lo que deja al modelo trabajar como agente: prompts, herramientas y manejo del contexto ([Anthropic, harness para agentes largos](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)).
3. Cada pieza da por hecho algo que el modelo no hace solo. Cuando el modelo mejora, eso deja de ser cierto, así que cada pieza se vuelve a probar. Con Opus 4.6 se pudo sacar la división en sprints, pero el evaluador aparte siguió valiendo lo que cuesta ([Anthropic, diseño de harness](https://www.anthropic.com/engineering/harness-design-long-running-apps)).
4. CLAUDE.md es contexto y el modelo puede ignorarlo; un hook se ejecuta siempre. Lo que no puede fallar va en un hook ([hooks](https://code.claude.com/docs/en/hooks-guide), [buenas prácticas](https://code.claude.com/docs/en/best-practices)).
5. CLAUDE.md debe quedar por debajo de 200 líneas, y de MEMORY.md solo se cargan las primeras 200 líneas o 25 KB ([memoria](https://code.claude.com/docs/en/memory)).
6. El agente sobrevalora su propio trabajo. Un evaluador escéptico aparte es más fácil de afinar que un generador que se critica a sí mismo ([diseño de harness](https://www.anthropic.com/engineering/harness-design-long-running-apps)).
7. Varios agentes rinden en tareas que se pueden hacer en paralelo, pero gastan unas 15 veces los tokens de un chat. Con código muy entrelazado no conviene ([Anthropic, sistema multiagente](https://www.anthropic.com/engineering/multi-agent-research-system)).
8. `/loop` vive dentro de la sesión y vence a los 7 días. Las rutinas de la nube corren como mínimo cada 1 hora ([tareas programadas](https://code.claude.com/docs/en/scheduled-tasks)).

## 2. Cómo está hecho el de Onia (10-oct)

Abreviaturas: G = `C:/Users/PC/.claude` · WT = este worktree. Las cifras se contaron en los archivos el 10-oct.

| Capa | Qué hay | Qué anda | Qué falla (caso real) |
|---|---|---|---|
| **Instrucciones** | <ul><li>G/CLAUDE.md: 97 líneas</li><li>CLAUDE.md del repo: **631 líneas, 27 reglas**</li><li>AGENTS.md: 286 líneas</li><li>G/rules: 94 archivos (`zh` repite los 11 de `common`)</li></ul> | Las reglas que traen su caso real se cumplen: el canario, "verificar es mirar". | <ul><li>Mide 3 veces lo recomendado.</li><li>**Sesiones con texto viejo:** este subagente y el arquitecto recibieron la versión de "Qué se publica" anterior al 9-oct. En disco, `CLAUDE.md:486` dice lo contrario.</li><li>El checkout primario está atrasado respecto de `origin/main`.</li></ul> |
| **Skills** | <ul><li>45 en `.claude/skills`</li><li>30 en `.agents/skills` (copia para Codex)</li><li>110 en G</li><li>9 plugins</li></ul> | `onia-router` y las skills de cada carril. | <ul><li>Las dos copias no coinciden.</li><li>La paridad entre nube y PC está frenada (C5).</li><li>Más de 150 opciones: si un humano no sabe cuál usar, el agente tampoco.</li></ul> |
| **Agentes** | <ul><li>3 de proyecto</li><li>43 en G</li><li>`loop-tres-roles.js`</li><li>workflows con roles</li></ul> | Workflows con roles separados (A2 y A6 cerrados con prueba). | <ul><li>El único agente Haiku es `doc-updater`.</li><li>Haiku hace el 0,5 % de los tokens.</li><li>Con 5-8 agentes a la vez se perdieron vueltas de loop.</li></ul> |
| **Codex** | <ul><li>`scripts/codex-tarea.sh` (62 líneas, 58 corridas)</li><li>Codex cloud</li></ul> | Contratos cerrados; `revisar` sirve como revisor de la otra familia de modelos. | <ul><li>La cabecera dice "código = astra" (líneas 19-20), pero los tres valores por defecto son `gpt-6.1-sol` (45, 51, 57).</li><li>El sandbox no tiene git ni tests.</li><li>En la nube no se elige el modelo: se pidió Astra y corrió `gpt-5.6-sol`.</li><li>Va al 56 % del tope semanal.</li></ul> |
| **Hooks** | <ul><li>Repo: SessionStart con `nube-ssh-vps.mjs`, Stop con `git-autosync.js` (270 líneas)</li><li>G: config-protection, accumulator, format-typecheck</li></ul> | El autosync tiene guarda de main y de MERGE_HEAD. | <ul><li>El Stop publica estado a medias (23-ago).</li><li>Termina siempre con `process.exit(0)`: sus errores no se ven.</li><li>Ninguna regla crítica es un hook: todo es consultivo.</li></ul> |
| **Permisos** | <ul><li>G: `defaultMode auto`, `skipDangerousModePermissionPrompt true`, sin listas allow/deny</li><li>Codex: `approval_policy never` + `danger-full-access`</li></ul> | El clasificador frena merges sin revisión. | <ul><li>La aprobación no pasa de una sesión a otra: Plataforma pasó 20 h respondiendo "espero".</li><li>El secreto del MCP de n8n está en claro en `~/.codex/config.toml`.</li><li>El MCP de Higgsfield está cargado, aunque la regla dice "solo CLI".</li></ul> |
| **Memoria y estado** | <ul><li>MEMORY.md: 125 líneas + 201 notas</li><li>handoffs por carril</li><li>**6 libros:** `madre.md`, `TABLERO.md` (3-sep), `EQUIPO.md` (2-sep), `loops.md` (19-sep), `plataforma-v1.md` (8.472 líneas), `chatbot.md` (13.164 líneas)</li></ul> | El índice queda por debajo de 200 líneas. | <ul><li>12 `codex-tareas` no tienen fila en ningún libro.</li><li>A6 se prometió y se olvidó.</li><li>Datos viejos se leen como presentes.</li><li>`handoff/chatbot.md`: último commit el 4-sep.</li></ul> |
| **Loops** | Ver §3. | Los latidos de la nube siguen con la PC apagada. | <ul><li>Los crons de la madre mueren con ella.</li><li>Ventas no tiene latido.</li><li>La capa VPS/casa no está en ningún libro de octubre.</li></ul> |
| **Canales** | <ul><li>Madre a nube: `SendMessage`</li><li>Madre lee la nube: `get_run_log`</li><li>Telegram desde el VPS</li></ul> | Madre a nube por nombre (medido el 1-oct). | <ul><li>La nube no puede escribirle a la madre.</li><li>Los subagentes no tienen `get_run_log`.</li><li>Hay un peer `observer-sessions-a2` sin explicar.</li></ul> |
| **Verificación** | <ul><li>CI de onia-platform: lint, tipos, vitest y build en 21 min</li><li>suite local de unos 9,9k tests</li><li>Playwright</li><li>Codex `revisar`</li></ul> | CI verde en `32c7e0e8`; /login mirado. | <ul><li>El CI corre dos veces por cambio y no tiene `concurrency`. Los minutos podrían acabarse en unos 6 días (inferencia).</li><li>master quedó con una migración sin aplicar.</li></ul> |
| **Costo** | <ul><li>`get_usage`: 1.503 M tokens en 48 h (Opus 58 %, Sonnet 41,5 %, Haiku 0,5 %)</li><li>`wham/usage` de Codex</li></ul> | Freno de Codex al 80 %. | <ul><li>No se mide el costo por punto cerrado.</li><li>No se cuentan los minutos de Actions ni las corridas headless del VPS.</li></ul> |

## 3. Loops

**PC apagada** dice si el loop sigue corriendo cuando la PC de Sergio Urcullo está apagada.

| Loop | Dónde | Cada cuánto | Qué hace | PC apagada | Dueño | Verificado 10-oct |
|---|---|---|---|---|---|---|
| Ronda `708dccce` | madre, CronCreate | :07 :27 :47 | Haiku revisa el libro, las colas, los PRs y Codex, y empuja a las sesiones paradas | No | madre | Sí |
| Parte `dbec7299` | madre, CronCreate | 07:53 | Lo publicado ayer, qué necesita de Sergio Urcullo, PC y Codex | No | madre | Sí |
| Cierre `915aadba` | madre, CronCreate | 21:53 | Libro, handoff, billetera y commit | No | madre | Sí |
| Lote de contenido `3f6ca99f` | madre, CronCreate | lunes 08:13 | Guiones de la semana | No | madre | Sí |
| Chequeo de publicación `19d6a061` | madre, CronCreate | una vez (10-oct) | /login y /checkout de `32c7e0e8` | No | madre | Corrió 85 min tarde |
| Latido de Plataforma | servidor, RemoteTrigger | :17 cada hora | Le da un turno sobre su cola | Sí | Plataforma | Activo |
| Latido de Marca (+2 one-shots) | servidor, RemoteTrigger | :27 cada hora | Igual que el anterior | Sí | Marca | Activo; ListAgents la ve "pending" |
| Latido de Lucía | servidor, RemoteTrigger | :47 cada hora | Igual que el anterior | Sí | Lucía | Activo |
| Latido de Hermes-Jarvis | servidor, RemoteTrigger | :57 cada hora | Igual, pero su cola tiene 0 tareas abiertas y 19 cerradas | Sí | Hermes | Activo, sin trabajo |
| Ventas | su propio ScheduleWakeup | ? | Su cola | Solo si se programó | Ventas | **No verificable** |
| Guardián `claude-guardia.sh` | VPS, cron | cada 10 min | Autocura contenedores y avisa por Telegram | Sí | VPS | **No** (credencial de hace 36 días) |
| `onia-loop.sh` (7 casos: `onia-cola`, `chatbot-cola`, `web-venta`, `marca-personal`, `canario-visual`, `docs-auditoria`, `kpis-semanal`) | VPS / nodo-casa, cron | `chatbot-cola` cada hora; el resto ? | `onia-cola` (muerto desde el 27-sep) mergeaba `claude/*` a main; `web-venta` es dueño de onia.com.bo; `chatbot-cola` lleva el chatbot | Sí, si corre en el VPS | VPS | **No** |
| Unos 20 vigías (`vigia-ci`, `vigia-disco`, `vigia-aprobaciones`, `vigia-loops-remotos`, `vigia-comprobantes`, `vigia-credito-ia`…) | VPS, cron | `aprobaciones` cada 2 min; `credito-ia` cada 15 min | Avisan a Telegram | Sí | VPS | **No** (la cuenta de 20 es del 27-sep) |
| n8n | VPS | barridos cada hora | Bot y barridos del embudo (44 workflows activos el 20-ago) | Sí | sin dueño | **No** |
| Publicación de onia-platform | VPS (probable) | cada ~3 h | Publica master | Sí | ? | **No** (no está en `.github/workflows`) |
| Codex cloud | nube de OpenAI | cuando lo lanza la madre | Tareas cerradas | Sí, una vez lanzadas | madre | Parcial |
| CI | GitHub Actions | en cada push y cada PR | Gate | Sí | Plataforma | Sí |

Además hay 14 triggers deshabilitados en el listado de RemoteTrigger que habría que limpiar.

## 4. Frentes y dueños

Etapa vigente: la 1 (de 0 a 5 clientes). Se congela todo lo que no sea Onia Platform y el chatbot. El GOAL del 8-oct reactivó marca personal, asesorías y pauta (`handoff/madre-local.md:197-210`).

🔴 = frente vivo sin dueño o sin loop.

| # | Frente | Dueño hoy | Loop hoy | Dueño propuesto |
|---|---|---|---|---|
| 1 | 1.0 Plataforma (15 puntos) | Plataforma; une la jefa o QA por PR (AGENTS §4) | :17 + ronda | igual |
| 2 | Cobro y QR del BCP | Plataforma el código; Sergio Urcullo el trámite | :17 | 🔴 el trámite no tiene recordatorio → reloj "BCP" en el parte |
| 3 | Respaldos (punto 4) | Plataforma | :17 | igual; el bucket R2 está en C7 |
| 4 | SIAT (vence el 4-nov) | Plataforma con capturas; el portal solo lo abre Sergio Urcullo | 🔴 ninguno | la madre lleva el reloj |
| 5 | Chatbot (motor :3020, n8n, Chatwoot) | Plataforma solo para #140 y K1 | 🔴 el motor y n8n, salvo que `chatbot-cola` esté vivo | Plataforma los PRs; Review/QA la salud semanal; la madre la infra. **Primero el inventario (cambio 2).** |
| 6 | Demo y capturas C1-C7 | Plataforma (lunes 12-oct) | :17 | igual |
| 7 | Pauta Meta (16-oct, go/no-go 13-oct) | Ventas, parada desde el 9-oct | 🔴 sin latido | Ventas con latido (cambio 4) |
| 8 | Leads (7; el más viejo, de hace unos 50 días) | Ventas prepara, Sergio Urcullo envía | 🔴 ninguno | Ventas |
| 9 | Marca personal | Marca | :27 | igual. Revisar si el `marca-personal` del VPS sigue vivo: serían dos escritores |
| 10 | Asesorías y cal.com | Marca las historias | 🔴 nadie sigue las reservas | la madre lee la agenda en el parte |
| 11 | Web onia.com.bo (la puerta del 16-oct) | 🔴 nadie en la nube; `web-venta` en el VPS sin verificar | 🔴 | Review/QA, solo si `web-venta` está muerto |
| 12 | Fiscal y legal (NIT el 13-oct según memoria, homologación el 30-oct, términos #124) | Sergio Urcullo y Leslie Mercado Moreno | 🔴 ninguno | la madre lleva los relojes |
| 13 | Infra y costo | 🔴 sin dueño único: Plataforma, Hermes y la madre tienen la llave del VPS, y `onia-cola` (muerto desde el 27-sep) podía mergear solo | guardián (sin verificar) | la madre, dueña única de la infra |
| 14 | Competencia | Ventas | ninguno (aceptable) | igual |
| 15 | Harness | madre | ronda | madre, en el "lunes del harness" |
| 16 | Add-ons del 8-oct | sin tarea | ninguno | congelados detrás de la 1.0 (correcto) |
| 17 | Lucía (token de IG vence el 13-18 oct) | Lucía | :47 | **se propone congelarla** (estrategia §10: "otro producto entero"). Lo decide Sergio Urcullo |
| 18 | Hermes-Jarvis | Hermes, con la cola vacía | :57 (solo gasto) | pasa a Review/QA |
| 19 | Líneas congeladas desde el 5-sep | nadie | ninguno | quedan así |

## 5. Brechas (por impacto en la etapa 1)

1. **La aprobación se traba en cada sesión.** Un "sí" escrito en CLAUDE.md no vale como el "sí" de Sergio Urcullo dentro de una sesión de la nube. Resultado: 20 h paradas y 18 PRs esperando.
2. **El camino a producción pasa por la laptop.**
   - La nube no puede empujar ramas y deja bundles.
   - Codex no prueba.
   - Con la PC apagada no se mergea nada.
   - Cada PR con migración deja master sin poder publicarse.
3. **Los puntos se pierden.**
   - Hay 6 libros, más un tablero SQLite en el VPS.
   - Ninguna alarma salta por fecha: 13-oct, 13-18 oct, 16-oct, 30-oct, 4-nov.
4. **Frentes 🔴 sin dueño:** SIAT, leads, asesorías, web, fiscal, infra y el latido de Ventas. Parciales: el BCP y la operación del chatbot.
5. **Hay una capa oculta.** Los 7 casos de `onia-loop.sh` y los unos 20 vigías del VPS gastan cuota y avisan a Telegram, pero ningún libro de octubre dice si viven.
6. **La cuota no tiene presupuesto.**
   - Una sola suscripción paga a la madre, 5 sesiones, el guardián y quizás el VPS.
   - Opus hace el 58 % y Haiku el 0,5 %.
7. **Con la PC apagada se puede prometer 2 de 5:** los latidos y el CI. No hay integración, ni revisión de la otra familia, ni libro.
8. **Las instrucciones están infladas y algunas sesiones reciben texto viejo.**
9. **Permisos y secretos:** Codex con `danger-full-access`, el secreto de n8n en claro y el MCP de Higgsfield cargado.

## 6. Diseño objetivo

- **Una madre, un libro.** `cola/loop/madre.md` es el único libro.
  - Cada pedido entra con `id · dueño · modelo · estado · prueba · vence`.
  - La sección "Relojes" guarda las fechas de §5.3.
  - Los demás libros llevan en la cabecera "HISTORIA: el libro vivo es `cola/loop/madre.md`", después del cambio 2.
  - No se crea `ENTRADA.md`.
- **Verificador sin LLM:** se extiende `scripts/verificar_cola.js`. Falla si encuentra:
  - un `[x]` sin SHA, URL o captura;
  - una línea abierta sin dueño;
  - una línea con más de 24 h sin moverse;
  - un reloj que vence en 72 h o menos.

  Lo corren la ronda (PC) y un vigía del VPS.
- **Loops:**
  - Ronda, parte y cierre de la madre, que se recrean cada lunes antes de que venzan.
  - 4 latidos más el de Ventas.
  - Hermes pasa a ser Review/QA: los miércoles mira onia.com.bo a 390 y 1440 px, la salud del chatbot y la lista de herramientas de Meta, todo en solo lectura.
  - El vigía diario de relojes manda **un** resumen al día por Telegram.
- **Aprobación:**
  - Técnico, sin consultarle: lo que pasa los gates (`AGENTS.md` §4 «Quién decide», 17-oct; reemplaza la regla del 9-oct).
  - Clase B, con su sí: gasto, terceros, SIAT, actos legales, cara o voz, credenciales, instalaciones, CLAUDE.md o la configuración.
  - El sí vale solo escrito en la sesión que actúa. La línea fija de cada carril vive en `handoff/ARRANQUE-SESIONES.md`, y Sergio Urcullo la pega al reabrir.
  - El `ok <id>` de Telegram solo dispara scripts del VPS que no usan LLM.
  - Un carril nunca espera: anota el bloqueo y sigue con lo siguiente.
- **Costo:**
  - Una línea diaria por modelo en §E de madre.md.
  - Tokens por punto cerrado con prueba.
  - Frenos: Codex al 80 % no lanza más. Con vueltas perdidas se pausa Lucía, después Review/QA, y después se baja la cantidad de agentes.
  - Hasta 10 agentes Claude a la vez, hasta pasar una semana sin vueltas perdidas.
- **Lo que NO se usa:**
  - rutinas de menos de 1 h;
  - sesiones que abre una rutina;
  - elegir el modelo en Codex cloud;
  - subagentes que lean transcripts de la nube;
  - Telegram como aprobación para un LLM;
  - protección de rama (da 403 porque el repo es privado).

## 7. Cambios priorizados

| # | Qué | Quién lo hace | ¿Sí de Sergio Urcullo? | Hecho cuando |
|---|---|---|---|---|
| 1 | Línea fija de aprobación en Plataforma, Marca, Ventas y Hermes, guardada en `ARRANQUE-SESIONES.md` (une C1-C3) | la madre redacta; Sergio Urcullo la escribe | **Sí, es su acción** (unos 5 min) | el siguiente latido de Plataforma termina en merge o publicación, no en "espero" (`get_run_log`) |
| 2 | **Inventario en vivo de la capa VPS/casa:** `crontab -l` en el VPS y en casa, los 7 casos de `onia-loop.sh`, los vigías, `onia-cola`, el tablero SQLite, la credencial del guardián, n8n y cuántos mensajes de Telegram llegan por día. Se vuelca acá en §3. **Va antes que el 3 y el 4.** | la madre por SSH, solo lectura; Haiku arma la tabla | No para leer. **Sí** para pausar lo que él usa. | cada línea de cron con la salida del comando; vivo o muerto con la fecha de su último log; la lista de pausas en C |
| 3 | Libro único, "Relojes" y verificador (§6); las 12 `codex-tareas` con su fila; la §F de madre.md apunta a §3 de este doc | la madre con Sonnet; Codex Sol escribe el verificador **y la madre lo prueba** (el sandbox no tiene git ni tests) | No | el verificador sale ≠0 ante un `[x]` sin prueba y lista los relojes a 72 h |
| 4 | Dueños de §4 en madre.md; latido de Ventas a las :37; Hermes pasa a Review/QA | la madre (RemoteTrigger y mensajes) | No. **Sí** para congelar Lucía. | `RemoteTrigger list` muestra a Ventas; la cola de Hermes tiene 3 o más tareas; un `get_run_log` de Ventas muestra una tarea tomada |
| 5 | Guarda de migraciones: `deploy/onia-platform/publicar.sh` aborta si falta en `_prisma_migrations` de producción alguna migración de `prisma/migrations`. Los PRs con migración van por PR con CI verde y revisión de Codex (los une la jefa, AGENTS §4); la madre aplica la migración con backup. | Codex Astra escribe, Sonnet revisa, la madre despliega | No (infra revisada; AGENTS §4 «Quién decide») | en seco, con una migración ficticia sin aplicar, aborta con mensaje |
| 6 | CI: `concurrency: {group: ci-${{ github.ref }}, cancel-in-progress: true}` y medir los minutos | Plataforma o Codex Sol | No para `concurrency`. **Sí** para C6 (retirar la suite local) y para el scope `user` | un segundo push cancela la corrida anterior; se conocen los minutos del mes |
| 7 | Billetera diaria y costo por punto; `--disable multi_agent` y `meta.json` en `codex-tarea.sh`; corregir la cabecera astra/sol | la madre + Codex Sol | No | 3 días seguidos con línea en §E |
| 8 | Vigía de relojes en el VPS: **se suma a los vigías que ya existen** (mismo patrón, `onia-tg.sh`), con un resumen por día | Codex Sol escribe, Sonnet revisa, la madre despliega | No, si el VPS ya tiene el clon de onia-hermes. **Sí**, si necesita un token de GitHub. | un reloj de prueba a mañana manda 1 resumen y no más de 1 por día |
| 9 | CLAUDE.md a 250 líneas o menos (el dominio pasa a skills); quitar `rules/zh`; `pull --ff-only` del primario; relevo de la madre después de editar CLAUDE.md | la madre + Sonnet | **Sí** | `wc -l` da 250 o menos sin perder reglas; el primario coincide con `origin/main` |
| 10 | Permisos y secretos: el secreto de n8n fuera de `config.toml`; Codex interactivo en `workspace-write` + `on-request`; apagar el MCP de Higgsfield y claude-mem; autorizar o quitar los 5 MCP pendientes | la madre prepara; Sergio Urcullo aplica | **Sí** | `grep` del secreto da 0; la lista de MCP queda sin caídos |

## 8. Crítica de este diseño (10-oct, verificada en archivos)

**Afirmaciones del inventario.** Se revisaron 10 y 7 resultaron ciertas:
- CLAUDE.md tiene 631 líneas y 27 reglas.
- `codex-tarea.sh` tiene 62 líneas y la contradicción astra/sol.
- G/rules tiene 94 archivos, `zh` 11 y `common` 11.
- Los hooks del repo son SessionStart y Stop.
- G/settings tiene `auto`, `skip…: true`, `sonnet` y `high`.
- Hay 45 skills y 30 copias para Codex; 43 agentes, con `doc-updater` como único Haiku.
- `git-autosync.js` tiene 270 líneas y termina con `exit(0)`.

Las otras 3 eran falsas o viejas:
- MEMORY.md tiene **125** líneas, no 99.
- madre.md hoy tiene 27 abiertas y 5 cerradas (A2 y A6 se cerraron).
- `handoff/chatbot.md` tuvo su último commit el 4-sep, no el 28-ago.

**Dependencias que no existen o que la crítica de `ONIA_EQUIPO_DE_AGENTES.md` marcó falsas:**
- El diseño ya evitaba las falsas: rutinas de 20 min, que la madre abra sesiones, que la nube le escriba a la madre, elegir modelo en Codex cloud, Haiku con `get_run_log`, Telegram como aprobación, protección de rama y 30-35 agentes.
- Quedaban 4 problemas, ya corregidos arriba:
  1. **El latido de Ventas** depende de un id. `onia-sesion-madre/SKILL.md:71` lo da (`session_0143C5fMXVs8eWEf7uBpC9SF`), pero `equipo-de-agentes/SKILL.md:43` dice que la API no lo muestra. Primero se prueba un RemoteTrigger de un solo disparo. Si falla, Sergio Urcullo reabre Ventas desde la web.
  2. **Web y chatbot no estaban "sin dueño" en el papel.** `onia-loop.sh` tiene `web-venta` (dueño de onia.com.bo) y `chatbot-cola`. Asignarlos a Review/QA sin el inventario podría crear dos dueños.
  3. **`TABLERO.md` documenta el tablero SQLite** que lee `vigia-aprobaciones.sh` cada 2 min. Marcarlo como historia sin el inventario dejaría un libro vivo escondido. Por eso el cambio 2 va antes del 3.
  4. **El "vigía del libro" no se escribe de cero:** ya hay unos 20 vigías. Se suma uno y se mide el ruido de Telegram antes (regla del CLAUDE.md §4: no saturar el canal).

**¿Abre una línea de negocio nueva?** No.
- Marca, asesorías y pauta vienen del GOAL del 8-oct de Sergio Urcullo.
- Lucía se propone congelar.
- Review/QA es una reasignación de Hermes, no un producto.

**No verificado:**
- el crontab de octubre del VPS y de casa;
- si `onia-cola` y `web-venta` están vivos;
- la credencial del guardián;
- n8n;
- si `gh` desde la nube puede mergear;
- los minutos de Actions;
- el id de Ventas;
- `observer-sessions-a2`;
- si Hermes tiene navegador para las capturas a 390 y 1440 px.
