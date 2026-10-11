# Harness de Onia

> **Fuente de verdad del harness:** qué lo compone, dónde corre cada loop y quién es dueño de cada frente. Doc vivo,
> sin fecha en el nombre: se EDITA. Pedido de Sergio Urcullo del 10-oct (A5 en `cola/loop/madre.md`): *«investigar qué
> es un harness y cómo lo tenemos hecho, loops, subagentes y que toquemos todos los frentes»*.
> Salió del workflow `wf_da25d090-4e5`: teoría con fuentes, 2 inventarios, frentes, arquitecto y crítico. El crítico
> verificó contra los archivos y corrigió el diseño (§8).
>
> **Vigencia 11-oct-2026 (QA del harness, 34 puntos):** dos madres locales (desarrollo-infra y marketing), Codex para el código cerrado (§10) y el estado de cada punto en §9. Lo no medido queda como UNKNOWN.
>
> **Qué va en cada doc:**
> - `ONIA_EQUIPO_DE_AGENTES.md`: el plan del equipo (roles, modelos, ciclo de una tarea). Leer su §Crítica.
> - `ONIA_EQUIPOS_POR_SESION.md`: el equipo de cada sesión (existe; verificado el 11-oct).
> - `cola/loop/madre.md`: el libro único de puntos (qué está abierto, quién lo tiene, con qué prueba).
> - Este doc: el mapa. La tabla de loops de §3 reemplaza a la §F de madre.md.
> - Evidencia: `research/2026-10-10-auditoria-equipo-de-agentes.md` y `research/2026-10-10-auditoria-madre-v3.md`
>   (A4, existe; verificado el 11-oct). El QA del 11-oct: `research/2026-10-11-harness-qa/` (§9).

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
| **Agentes** | <ul><li>3 de proyecto</li><li>43 en G</li><li>`loop-tres-roles.js`</li><li>workflows con roles</li></ul> | Workflows con roles separados (A2 y A6 cerrados con prueba). | <ul><li>Global (L01, 11-oct): 43 agentes: 7 opus, 1 haiku, 30 sonnet, 5 sin frontmatter.</li><li>Haiku hace el 0,5 % de los tokens.</li><li>Con 5-8 agentes a la vez se perdieron vueltas de loop.</li></ul> |
| **Codex** | <ul><li>`scripts/codex-tarea.sh` (62 líneas, 58 corridas)</li><li>Codex cloud</li></ul> | Contratos cerrados; `revisar` sirve como revisor de la otra familia de modelos. | <ul><li>Cabecera correcta: "código cerrado = sol" (líneas 19-20). Los valores por defecto son `gpt-6.1-sol` (líneas 46, 52, 58; corregido el 11-oct, C11).</li><li>Sin git ni tests en el sandbox. Codex deja 5 errores de hooks por corrida en stderr (C01).</li><li>En la nube no se elige el modelo: se pidió Astra y corrió `gpt-5.6-sol`.</li><li>Cupo semanal: 0 % al 11-oct 05:16 UTC, reinicio 18-oct (C04). La ventana anterior cerró al 58 % (C11). El "56 %" que tenía esta fila no tenía fuente: quitado.</li></ul> |
| **Hooks** | <ul><li>Repo: SessionStart con `nube-ssh-vps.mjs`, Stop con `git-autosync.js` (270 líneas)</li><li>G: config-protection, accumulator, format-typecheck</li></ul> | El autosync tiene guarda de main y de MERGE_HEAD. | <ul><li>El Stop publica estado a medias (23-ago).</li><li>Termina siempre con `process.exit(0)`: sus errores no se ven.</li><li>Ninguna regla crítica es un hook: todo es consultivo.</li><li>Hook de modelo explícito (`.claude/hooks/subagente-con-modelo.mjs`) listo en aviso, sin registrar (L03).</li></ul> |
| **Permisos** | <ul><li>G: `defaultMode auto`, `skipDangerousModePermissionPrompt true`, sin listas allow/deny</li><li>Codex: `approval_policy never` + `danger-full-access`</li></ul> | El clasificador frena merges sin revisión. | <ul><li>La aprobación no pasa de una sesión a otra: Plataforma pasó 20 h respondiendo "espero".</li><li>Dos secretos en claro en `~/.codex/config.toml` (token del MCP de n8n y clave Authorization; valores no copiados). Hay copias en 2 respaldos (C03, C07).</li><li>Propuesta C03 para Codex: `on-request` + `workspace-write`, sin aplicar.</li><li>El MCP de Higgsfield está cargado, aunque la regla dice "solo CLI".</li></ul> |
| **Memoria y estado** | <ul><li>MEMORY.md: 125 líneas + 201 notas</li><li>handoffs por carril</li><li>**6 libros:** `madre.md`, `TABLERO.md` (3-sep), `EQUIPO.md` (2-sep), `loops.md` (19-sep), `plataforma-v1.md` (8.472 líneas), `chatbot.md` (13.164 líneas)</li></ul> | El índice queda por debajo de 200 líneas. | <ul><li>12 `codex-tareas` no tienen fila en ningún libro.</li><li>A6 se prometió y se olvidó.</li><li>Datos viejos se leen como presentes.</li><li>`handoff/chatbot.md`: último commit el 4-sep.</li></ul> |
| **Loops** | Ver §3. | Los latidos de la nube siguen con la PC apagada. | <ul><li>Los crons de la madre mueren con ella.</li><li>Ventas no tiene latido.</li><li>La capa VPS/casa no está en ningún libro de octubre.</li></ul> |
| **Canales** | <ul><li>Madre a nube: `SendMessage`</li><li>Madre lee la nube: `get_run_log`</li><li>Telegram desde el VPS</li></ul> | Madre a nube por nombre (medido el 1-oct). | <ul><li>La nube no puede escribirle a la madre.</li><li>Los subagentes no tienen `get_run_log`.</li><li>Hay un peer `observer-sessions-a2` sin explicar.</li></ul> |
| **Verificación** | <ul><li>CI de onia-platform: lint, tipos, vitest y build en 21 min</li><li>suite local de unos 9,9k tests</li><li>Playwright</li><li>Codex `revisar`</li></ul> | CI verde en `32c7e0e8`; /login mirado. | <ul><li>El CI corre dos veces por cambio y no tiene `concurrency`. Los minutos podrían acabarse en unos 6 días (inferencia).</li><li>master quedó con una migración sin aplicar.</li></ul> |
| **Costo** | <ul><li>`get_usage`: 1.503 M tokens en 48 h (Opus 58 %, Sonnet 41,5 %, Haiku 0,5 %)</li><li>`wham/usage` de Codex</li></ul> | Freno de Codex al 80 %. | <ul><li>No se mide el costo por punto cerrado.</li><li>No se cuentan los minutos de Actions ni las corridas headless del VPS.</li></ul> |

## 3. Loops

**PC apagada** dice si el loop sigue corriendo cuando la PC de Sergio Urcullo está apagada.

| Loop | Dónde | Cada cuánto | Qué hace | PC apagada | Dueño | Verificado 10-oct |
|---|---|---|---|---|---|---|
| Ronda `708dccce` | madre, CronCreate | :07 :27 :47 | Haiku revisa el libro, las colas, los PRs y Codex, y empuja a las sesiones paradas | No | madre | Sí (P02: muere con cada reinicio) |
| Parte `dbec7299` | madre, CronCreate | 07:53 | Lo publicado ayer, qué necesita de Sergio Urcullo, PC y Codex | No | madre | Sí |
| Cierre `915aadba` | madre, CronCreate | 21:53 | Libro, handoff, billetera y commit | No | madre | Sí |
| Lote de contenido `3f6ca99f` | madre, CronCreate | lunes 08:13 | Guiones de la semana | No | madre | Sí |
| Chequeo de publicación `19d6a061` | madre, CronCreate | una vez (10-oct) | /login y /checkout de `32c7e0e8` | No | madre | Corrió 85 min tarde |
| Latido de Plataforma | servidor, RemoteTrigger | :17 cada hora | Le da un turno sobre su cola | Sí | Plataforma | Activo |
| Latido de Marca (+2 one-shots) | servidor, RemoteTrigger | :27 cada hora | Igual que el anterior | Sí | Marca | Activo; ListAgents la ve "pending" |
| Latido de Lucía | servidor, RemoteTrigger | :47 cada hora | Igual que el anterior | Sí | Lucía | Activo |
| Latido de Hermes-Jarvis | servidor, RemoteTrigger | :57 cada hora | Igual, pero su cola tiene 0 tareas abiertas y 19 cerradas | Sí | Hermes | Activo, sin trabajo |
| Ventas | sin latido recurrente (P01) | ? | Su cola | No | Ventas | **Sin latido** (`list` del 11-oct); su `ScheduleWakeup` no está verificado |
| Guardián `claude-guardia.sh` | VPS, cron | cada 10 min | Autocura contenedores y avisa por Telegram | Sí | VPS | **No** (credencial de hace 36 días) |
| `onia-loop.sh` (7 casos: `onia-cola`, `chatbot-cola`, `web-venta`, `marca-personal`, `canario-visual`, `docs-auditoria`, `kpis-semanal`) | VPS / nodo-casa, cron | `chatbot-cola` cada hora; el resto ? | `onia-cola` mergea `claude/*` a main; `web-venta` es dueño de onia.com.bo; `chatbot-cola` lleva el chatbot | Sí, si corre en el VPS | VPS | **No** |
| Unos 20 vigías (`vigia-ci`, `vigia-disco`, `vigia-aprobaciones`, `vigia-loops-remotos`, `vigia-comprobantes`, `vigia-credito-ia`…) | VPS, cron | `aprobaciones` cada 2 min; `credito-ia` cada 15 min | Avisan a Telegram | Sí | VPS | **No** (la cuenta de 20 es del 27-sep) |
| n8n | VPS | barridos cada hora | Bot y barridos del embudo (44 workflows activos el 20-ago) | Sí | sin dueño | **No** |
| Publicación de onia-platform | VPS (probable) | cada ~3 h | Publica master | Sí | ? | **No** (no está en `.github/workflows`) |
| Codex cloud | nube de OpenAI | cuando lo lanza la madre | Tareas cerradas | Sí, una vez lanzadas | madre | Parcial |
| CI | GitHub Actions | en cada push y cada PR | Gate | Sí | Plataforma | Sí |

En la página 1 de `RemoteTrigger list` hay 14 recordatorios vencidos y 2 vigentes (P03). El total es UNKNOWN porque `list` no pagina. Limpiar los vencidos lo aplica Sergio Urcullo (D01).

Propuesta sin crear (P02): un latido mecánico, sin LLM, cada 20 min con el Programador de tareas de Windows, en lugar de `CronCreate`. El script `scripts/latido-madre.mjs` aún no está en el repo; va por PR.

## 4. Frentes y dueños

Etapa vigente: la 1 (de 0 a 5 clientes). Se congela todo lo que no sea Onia Platform y el chatbot. El GOAL del 8-oct reactivó marca personal, asesorías y pauta (`handoff/madre-local.md:197-210`).

🔴 = frente vivo sin dueño o sin loop.

**Reparto desde el 11-oct (encargo de Sergio Urcullo):** la madre desarrollo-infra ordena Plataforma y Hermes-Jarvis, más VPS, infra y harness (frentes 1-6, 13, 15 y 18). El frente 5 (chatbot) tiene sus PRs en Plataforma y su infra y motor del VPS en la madre desarrollo-infra. La madre marketing ordena Lucía, Marca personal, Ventas y pauta (frentes 7-10, 14 y 17). Los frentes 11, 12, 16 y 19 no tienen madre asignada hasta que Sergio Urcullo lo decida.

| # | Frente | Dueño hoy | Loop hoy | Dueño propuesto |
|---|---|---|---|---|
| 1 | 1.0 Plataforma (15 puntos) | Plataforma; la madre integra | :17 + ronda | igual |
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
| 13 | Infra y costo | 🔴 sin dueño único: Plataforma, Hermes y la madre tienen la llave del VPS, y `onia-cola` puede mergear solo | guardián (sin verificar) | la madre, dueña única de la infra |
| 14 | Competencia | Ventas | ninguno (aceptable) | igual |
| 15 | Harness | madre | ronda | madre, en el "lunes del harness" |
| 16 | Add-ons del 8-oct | sin tarea | ninguno | congelados detrás de la 1.0 (correcto) |
| 17 | Lucía (token de IG vence el 13-18 oct) | Lucía | :47 | **se propone congelarla** (estrategia §10: "otro producto entero"). Lo decide Sergio Urcullo |
| 18 | Hermes-Jarvis | Hermes, con la cola vacía | :57 (solo gasto) | pasa a Review/QA |
| 19 | Líneas congeladas desde el 5-sep | nadie | ninguno | quedan así |

## 5. Brechas (por impacto en la etapa 1)

> Diagnóstico del 10-oct. El estado al 11-oct está en §9. Cuando una brecha se cierra, se marca aquí con su punto.

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

- **Dos madres, un libro.** Madre desarrollo-infra y madre marketing (reparto del 11-oct) comparten `cola/loop/madre.md` como libro único; cada una lleva sus frentes (§4).
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
  - Clase A, sin preguntar: lo que pasa los gates (regla del 9-oct).
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
| 5 | Guarda de migraciones: `deploy/onia-platform/publicar.sh` aborta si falta en `_prisma_migrations` de producción alguna migración de `prisma/migrations`. Los PRs con migración solo los mergea la madre. | Codex Astra escribe, Sonnet revisa, la madre despliega | No (infra revisada, regla del 9-oct) | en seco, con una migración ficticia sin aplicar, aborta con mensaje |
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

## 9. QA 11-oct: checklist

Fuente: 34 puntos, un archivo por punto en `research/2026-10-11-harness-qa/` (el enlace de cada fila). **Estado** es el que dio el QA: OK = medido y con causa; GAP = brecha abierta. Un punto puede estar OK y tener un cambio pendiente: mira «Quién aplica». Los veredictos WRONG de los verificadores ya están corregidos en el contenido de cada entregable; en C05 y D02 el archivo en disco es la versión previa, y lo corregido está en esta tabla y en las skills. El QA no ejecutó Codex ni hizo git; lo que dice «hecho» aquí se hizo en el worktree, sin commit.

| Punto | Estado | Quién aplica | Prueba de hecho |
|---|---|---|---|
| [C01](research/2026-10-11-harness-qa/C01-codex-cli-local.md) Codex CLI local | OK | Madre desarrollo-infra: diff del script (línea de Luna y preflight de `--version`) y commit. Sergio: config de hooks y OAuth de Facebook. | `codex --version` = 0.161.0; los tres modelos responden OK (hecho). Tras el diff: `bash -n` y grep de la línea Luna; `hook.*Failed` en stderr = 0 (hoy 5). |
| [C02](research/2026-10-11-harness-qa/C02-codex-skills-budget.md) Aviso de presupuesto de skills | GAP | Sergio: Paso 1 (conteo de solo lectura) y decide el Paso 2. Madre desarrollo-infra: corrida de prueba. | Corrida nueva de madre-tareas sin "skills context budget" en `eventos.jsonl`. Abierto hasta entonces. |
| [C03](research/2026-10-11-harness-qa/C03-codex-config-seguridad.md) Seguridad de config de Codex | OK | Sergio: rotar el token de n8n, variable de usuario, editar `~/.codex/config.toml` y borrar 2 respaldos. Madre: solo verifica. | `grep` de Bearer en config y respaldos = 0. Sin imprimir valores. |
| [C04](research/2026-10-11-harness-qa/C04-codex-cupo-monitor.md) Monitor de cupo | OK | Madre desarrollo-infra: commit de `scripts/codex-cupo.mjs` y la línea en `codex-tarea.sh`. | `node scripts/codex-cupo.mjs --self-test` = self-test OK (hecho en el QA). |
| [C05](research/2026-10-11-harness-qa/C05-codex-cloud.md) Codex cloud | GAP | Madre desarrollo-infra, con OK de Sergio para la primera tarea (consume cupo). Solo entorno Platform. | `codex cloud list` muestra la tarea `ready`; `codex cloud diff` trae `diff --git`. La rama debe existir en origin. |
| [C06](research/2026-10-11-harness-qa/C06-codex-github.md) Codex por GitHub | GAP | Sergio: conectar la app de Codex a los dos repos con revisión automática OFF. Madre: prueba en un PR de una línea. | Reacción y review de un login ajeno en 10 min (`gh api`). Hoy 0 usos de `@codex` en el historial. |
| [C07](research/2026-10-11-harness-qa/C07-codex-en-nubes.md) Codex en nubes | OK | Madre desarrollo-infra: regla de nube (§10, paso 1) y `codex cloud exec` solo con OK. Sesión Plataforma: `curl` de red. Sergio: caminos 3 y 5 y rotación. | `curl` a chatgpt.com y api.openai.com desde una nube (000 o 403 descarta). Un contrato de prueba leído por la madre. |
| [C08](research/2026-10-11-harness-qa/C08-codex-protocolo-cola.md) Protocolo de la cola de contratos | OK | Madre desarrollo-infra: migración de 12 contratos, cabeceras y detector v2 (README y plantilla ya escritos en el worktree; migración pendiente). Sesiones nube: paso E en su rama. | `estado:` en los 12 de main (hoy 0). Ids únicos (hoy `C14` aparece dos veces por el nombre). Detector v2 ≤25 s. |
| [C09](research/2026-10-11-harness-qa/C09-agents-md.md) AGENTS.md para Codex | OK | Madre desarrollo-infra: bloque en el AGENTS.md de onia-hermes. En onia-platform, PR desde la sesión Plataforma. | `grep -c "PARA LA MADRE"` en AGENTS.md ≥2 (hoy 1 en hermes). |
| [C10](../../scripts/codex-worktree.sh) Worktrees de Codex | GAP | Madre desarrollo-infra: crea y libera worktrees con `scripts/codex-worktree.sh`. Integrador: revisa 7 worktrees con cambios sin commit. Sergio: aprueba `npm ci` en clon dedicado y cualquier borrado. | `bash -n` OK. Tras cada tarea `liberar <rama>` deja `~/.codex/madre-locks` vacío. Con 2 ejecutores vivos, el tercero sale con exit 3. El QA no tiene archivo C10: el entregable es el script. |
| [C11](research/2026-10-11-harness-qa/C11-codex-plan-de-cupo.md) Plan de cupo | OK | Madre desarrollo-infra: gate en `codex-tarea.sh` y `scripts/codex-tokens-dia.mjs` (aún no existe). Sergio: tope de 24 M tokens por día y umbral de 90 % (vigente hoy: 80 %). | `--self-test` OK y gate probado en 5 casos. Verificar 7 días después de aplicar. |
| [L01](research/2026-10-11-harness-qa/L01-agentes-model-frontmatter.md) Modelos y frontmatter de agentes | GAP | Madre desarrollo-infra, tras OK de Sergio (toca config global). Madre marketing: decide si `market-*` sigue en uso. | Greps del entregable: opus solo en 2 agentes; haiku en 10; `market-*` con frontmatter. Prueba funcional sin correr. |
| [L02](research/2026-10-11-harness-qa/L02-modelo-principal-nubes.md) Modelo principal de las nubes | GAP | Sergio: cambio del modelo principal de Plataforma (opus-5-5 a sonnet-5-5). Madre desarrollo-infra: envía la línea MODELO. | `get_run_log` de la siguiente vuelta de Plataforma muestra `sonnet-5-5` en el init de la sesión (no del subagente). Ahorro UNKNOWN. |
| [L03](research/2026-10-11-harness-qa/L03-hook-model-explicito.md) Hook de modelo explícito | GAP | Madre desarrollo-infra: registro del hook tras OK y prueba en vivo. Sergio: decide el paso a bloqueo. | En vivo: un Agent sin `model` muestra AVISO y se ejecuta; con `model` no avisa. Self-test OK, prueba en vivo pendiente. |
| [L04](research/2026-10-11-harness-qa/L04-ruteo-modelos-una-fuente.md) Ruteo de modelos, una fuente | OK | Madre desarrollo-infra: PR con la tabla canónica en `AI_MODEL_ROUTING_2026.md` y quitar las tablas duplicadas. Sergio: decide si la madre es Opus o Sonnet. | Ocho greps de la prueba del entregable (todos con `--exclude='L04-*'`). |
| [L05](research/2026-10-11-harness-qa/L05-billetera.md) Billetera de tokens | OK | Madre desarrollo-infra: reemplazar `scripts/billetera-tokens.mjs` por la versión del entregable. | `node --check` sin error; la salida tiene líneas `codex` y `TOTAL` sin NaN. |
| [P01](research/2026-10-11-harness-qa/P01-latidos.md) Latidos de las nubes | OK | Madre desarrollo-infra: Plataforma y Hermes con texto v3. Madre marketing: Lucía y Marca. Ventas: `create` bloqueado hasta tener su `environment_id`. | `RemoteTrigger get` de cada latido muestra «LATIDO v3». Ventas sin latido hasta crearlo. |
| [P02](research/2026-10-11-harness-qa/P02-crons-madre.md) Crons de la madre | OK | Madre desarrollo-infra: `scripts/latido-madre.mjs` por PR. Sergio: registra la tarea «Latido madre» en Windows cada 20 min. | Tras PR y registro: `LastTaskResult` 0, `NextRunTime` a 20 min, `historial.log` con 3 o más líneas en 60 min. |
| [P03](research/2026-10-11-harness-qa/P03-recordatorios.md) Recordatorios | OK | Madre desarrollo-infra: Plataforma y Hermes. Madre marketing: Lucía, Marca y Ventas. | Un recordatorio vigente por sesión. Hoy no se cumple: solo Plataforma tiene uno, corto. |
| P04 Publicación frente al CI (sin archivo propio: el QA lo dejó en su respuesta) | GAP | Madre desarrollo-infra: reintento en el publicador (PR) y avisa a Sergio lo publicado. Regla horaria para la madre hasta medir. | 7 días sin publicación que termine en «hay otro build» sin reintento. Ver `gh run list` y el log del publicador. |
| [S01](research/2026-10-11-harness-qa/S01-orden-plataforma.md) Orden de Plataforma | OK | Madre desarrollo-infra: cola `plataforma.md`. Sesión Plataforma: #146 y #136. Sergio: la pregunta de la línea de 04:41 UTC, B22 y la demo del 12-oct. | `grep -c '\[x\]'` en `plataforma.md` ≥3 con PR MERGED. `gh pr checks` de #146 y #136 en verde. |
| [S02](research/2026-10-11-harness-qa/S02-orden-hermes.md) Orden de Hermes-Jarvis | GAP | Hermes-Jarvis: Q1-Q5 en su cola. Madre desarrollo-infra: merge de #194 y Q1. Sergio: solo si la madre pide su sí para Q1 o si baja el modelo de la sesión. | CI de #194 en verde; primera corrida diaria; modelo real de la sesión (UNKNOWN). |
| [S03](research/2026-10-11-harness-qa/S03-orden-lucia.md) Orden de Lucía | OK | Madre marketing: pasa el orden al carril. Madre desarrollo-infra: paso del token en el VPS. Sergio: token A/B y decisiones D2, D3, D5, D6. | Siete pasos con comando verificable (log de `ig-refrescar`, grep de D4 en `lucia.md`, `node --test` de los dos contratos). |
| [S04](research/2026-10-11-harness-qa/S04-orden-marca.md) Orden de Marca | OK | Madre marketing: cola `marca-personal.md` (líneas 9-10). Sesión Marca: renombrar brutos. Sergio: OK de la lámina 6 antes de agendar P2. | `grep -n "Bloqueado" marca-personal.md` sin «el vie 9». Drive lista 6 archivos. |
| [S05](research/2026-10-11-harness-qa/S05-orden-ventas.md) Orden de Ventas | OK | Madre marketing: corregir la ruta en `ventas-pauta.md` y `mercado-y-pauta.md`; pedir a Sergio el id del entorno de Ventas. | `grep` anclado sin resultados; `node scripts/campana-lista.test.mjs` exit 0; checks de PR #191 en verde antes de mergear. |
| [D01](research/2026-10-11-harness-qa/D01-harness-doc.md) Este documento | OK | Integrador: este archivo (corregido en el worktree). Sergio: `CLAUDE.md` líneas 46 y 181, y la cita 486 pasa a 541. Madre desarrollo-infra: limpieza de triggers. | `grep 'UNA madre'` en este archivo = 0. |
| [D02](research/2026-10-11-harness-qa/D02-skill-sesion-madre.md) Skill `onia-sesion-madre` | GAP | Madre desarrollo-infra: aplica (a)-(g) del entregable (hecho en el worktree, sin commit). Madre marketing: su fila de la tabla de sesiones. | `grep` de «una sola madre» y «NO tiene RemoteTrigger» en la skill = 0. `codex --version` = 0.161.0. |
| [D04](research/2026-10-11-harness-qa/D04-claude-md-propuesta.md) Propuesta de CLAUDE.md | OK | Madre desarrollo-infra: diff en rama propia. Sergio: confirma el reparto y el merge. | Greps de líneas viejas vacíos. Recuento de madre desarrollo-infra ≥5 y de madre marketing ≥3. |
| [D05](research/2026-10-11-harness-qa/D05-colas-protocolo.md) Protocolo de las colas | OK | Madre desarrollo-infra: `README.md` de `cola/loop` (hecho en el worktree, sin commit). Sergio: intervalo de los carriles. | `grep -n "60-120 s"` vacío; `## Codex y modelos` aparece una vez. |
| [D06](research/2026-10-11-harness-qa/D06-manifiesto-handoffs.md) Manifiesto y handoffs | OK | Madre desarrollo-infra: encabezado del manifest y README de handoffs. Madre marketing: marca VIEJO en sus handoffs. | `grep -l "^> VIEJO" handoff/*.md` = 36 tras aplicar. IDs vivos con `ListAgents` (UNKNOWN hoy). |
| [I01](research/2026-10-11-harness-qa/I01-fricciones-permisos.md) Fricciones de permisos | OK | Sergio: aplica `settings.local.json` en su checkout si da el OK. Merges (G6) por Sergio o el integrador. | Medir en 7 días los frenos de permisos en los handoffs. |
| [I02](research/2026-10-11-harness-qa/I02-salud-pc.md) Salud de la PC | OK | Madre desarrollo-infra: bloque de medición al arranque de cada tanda de Codex. Madre marketing: lo corre antes de sus tandas. Sergio: decide reinicio y liberar C:. | La salida (`paged_pool_GiB`, `free_C_GiB`, hora) pegada en el handoff antes de 3 tandas. |
| [I03](research/2026-10-11-harness-qa/I03-hooks-repo.md) Hooks del repo y permiso de main | GAP | Sergio: aprueba la marca y el `settings.local.json` de la madre desarrollo-infra y la aceptación del riesgo tsc. Madre desarrollo-infra: gate `tsc` antes de push a main. Integrador: commitea `.claude/hooks/` solo si se aprueba. | `Test-Path` de la marca, True solo en el checkout de la madre. `tsc --noEmit` exit 0 antes de push a main. |
| [I04](research/2026-10-11-harness-qa/I04-mcp-conectores.md) Conectores MCP | OK | Sergio: pasos 1-4 de la configuración propuesta (quitar los MCP sin uso y autorizar los caídos). Madres: solo verifican uso previo. | Lista de MCP sin caídos, según el entregable. |

## 10. Codex en todas las sesiones

**Pedido de Sergio Urcullo (11-oct):** que todas las sesiones usen Codex.

**Lo que se midió:** ninguna sesión de nube de Claude tiene Codex instalado ni logueado (C07). `codex cloud` lista, consulta y trae diffs, pero el lanzamiento no se probó porque cuesta cupo, y el modelo no se elige desde la CLI (C05). Codex local corre solo en la PC (C01). Por eso ninguna sesión lanza Codex por sí misma: lo lanza la madre desarrollo-infra desde la PC, a partir de un contrato que escribe la sesión. **Hecho** cuando una tarea de cada carril pasa por ese camino y vuelve con su prueba.

**Camino (C07 camino 1, con la cola del C08):**

1. **Escribe el contrato la sesión del carril** (Plataforma, Hermes-Jarvis, Lucía, Marca o Ventas). Copia `hermes-content/docs/handoff/codex-tareas/_PLANTILLA.md` como `<carril>-<ID>-<slug>.md` con `estado: pendiente`. Lo commitea en su rama `claude/*`, sin tocar otro archivo y sin push a main. Escribe `CODEX-CONTRATO: <ruta> (rama <claude/...>)` en su transcript y sigue con otra tarea de su cola.
2. **Lo adopta la madre desarrollo-infra:** con el detector v2 del README (main primero), copia el contrato a main (`docs(codex): adoptar <id>`). Una rama `claude/*` no se borra hasta que su contrato esté en main. Los contratos de Lucía, Marca y Ventas también los adopta esta madre: la madre marketing no lanza Codex, para que haya un solo dueño del cupo.
3. **Lo lanza la madre desarrollo-infra:**
   - cupo: `node scripts/codex-cupo.mjs` (corte vigente 80 % semanal);
   - worktree: `scripts/codex-worktree.sh <rama>` (máximo 2 ejecutores y 1 verificador);
   - en main, `estado: lanzada` antes de correr Codex, para que una caída a mitad no relance la tarea;
   - `scripts/codex-tarea.sh <contrato> <worktree> [modelo] [esfuerzo]`, en segundo plano. Modelo: `gpt-6.1-sol` por defecto; `gpt-6-astra` para seguridad, cobros, producción o permisos; `gpt-6-luna` para lo mecánico (la línea de Luna en el script aún no está, C01).
   - nube, opcional: `codex cloud exec --env 6abad6a0aae081919f0b315818becb21 --branch <rama> "$(cat <contrato>)"`. Requiere la rama en origin, trabajo de Platform que no necesita la PC y el OK de Sergio para la primera vez (C05, C07).
4. **Vuelve el resultado:** Codex deja `resultado.md`, `eventos.jsonl` y `session_id` en `~/.codex/madre-tareas/<fecha>-<tarea>/`. La madre revisa el diff, corre la suite completa (en onia-platform, `npx vitest run` y `npx tsc --noEmit`; `vitest related` no basta), commitea en `codex/<tarea>-<fecha>` (Codex no hace git), abre el PR y pone `estado: PR` y `pr:` en main. Al mergear y verificar, `estado: hecha`. Si la revisión falla, un contrato `-arreglos.md` en `pendiente`. Solo la madre cambia `lanzada`, `PR` y `hecha`.
5. **Avisa a la sesión dueña** con una línea: «X hecho en #N, suite N/0».

**Límites:**

- Cupo: se lee en vivo con `codex-cupo.mjs`; nunca se copia el % a mano. Hoy 0 % (11-oct 05:16 UTC, reinicio 18-oct). La propuesta C11 (corte de 90 % semanal y tope de 24 M tokens por día UTC, con gate en el script) está pendiente de Sergio.
- Codex no hace git ni consultas git, no instala nada y no abre red fuera del contrato.
- Sandbox: `node_modules` como junction a una instalación completa. Con el junction vacío, Codex no corre tsc ni vitest (equipo de agentes §8).
- Codex cloud no elige modelo: se pidió Astra y corrió Sol (8-oct). Si se exige Astra y no se confirma, la tarea va local.
- Ni `@codex` por GitHub (C06, 0 usos en el historial) ni clave API (C07, caminos 4 y 5) están activos. Cualquiera de los dos necesita el sí de Sergio.
- La madre no pushea a onia-platform entre las :20 y las :55 UTC (publicación cada 3 h a las :50).
- Hermes no entra por cloud: la skill dice que su repo pesa ~6 GB. El QA no lo midió.

**Qué NO se logra:** que una nube lance Codex por sí misma. Eso exige un login por código en cada contenedor (no es autónomo) o una clave API con gasto aparte. Si Sergio elige uno de los dos, se abre como tarea propia.
