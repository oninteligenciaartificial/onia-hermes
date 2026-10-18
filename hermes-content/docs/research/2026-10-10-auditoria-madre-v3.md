# Auditoría de la madre v3 (sesión d5e87d2e, 10-oct-2026)

Pedido de Sergio Urcullo (17:23 UTC): revisar si se hizo todo lo que pidió o si algo se olvidó, proponer reglas
nuevas, ver si hacen falta más sesiones o un harness mejor y explicar cómo funcionan los LLMs.

Método: un workflow de 7 agentes armó la auditoría. Después, un crítico Opus intentó refutar cada fila HECHO
contra el transcript `d5e87d2e…jsonl`, `git` (onia-hermes y onia-platform), `gh pr view`, las carpetas de Codex
y las salidas de las suites. Corte: 17:47 UTC. Sin evidencia = «sin evidencia».

## (a) Resumen

1. Hay 65 subpedidos: **21 HECHO · 26 PARCIAL · 10 OLVIDADO · 8 BLOQUEADO**. El crítico bajó 3 HECHO a PARCIAL
   (P1.0, P1.3a, P1.PC9), subió 1 (P13) y corrigió 6 pruebas.
2. Lo más caro sin cerrar: **de los 7 PRs que se integraron con master, ninguno está mergeado.** Siguen 14 PRs en
   draft. #140 y #136 apuntan a ramas que no tienen los arreglos. Los 8 commits de la madre no están en `main`.
3. Falló un solo mecanismo y arrastró a los demás: **la ronda (CronCreate) disparó 1 vez en 3 h 20 min**
   (14:56:52) y no volvió a disparar ni con la sesión ociosa entre 15:52 y 17:21. Por eso no hubo seguimiento a
   las sesiones, no se midió el PoolPaged, no se lanzó Codex de forma continua y no se hizo nada con Chrome.
4. **8 afirmaciones a Sergio Urcullo eran falsas o no tenían evidencia** (lista en (c), punto 6).
5. **No hacen falta más sesiones.** Lo que falta es sacar el estado afuera del chat: un libro con prueba, un
   verificador sin LLM y un latido que no dependa de la sesión. También hacen falta 3 decisiones de Sergio
   Urcullo, que están al final de (e).

## (b) Pedido → estado → prueba → qué falta (corregida)

Horas en UTC. «Rama» = `origin/claude/onia-sesion-madre-9313fb`, que no está en `main` (`af092eba`) y no tiene PR.
El ⚑ marca las filas que cambió el crítico.

| id | Pedido | Estado | Prueba verificada | Qué falta |
|---|---|---|---|---|
| P1.0 ⚑ | Invocar onia-router, equipo-de-agentes, onia-sesion-madre y aprender-de-todo | PARCIAL | Se invocaron 2 skills (14:24:34). `equipo-de-agentes` y `aprender-de-todo` respondieron «Unknown skill» (14:24:56): llegaron con el `reset` a origin/main de 14:25:10, cuando el registro de skills ya estaba armado. Se leyeron a mano a las 14:25:18 | Abrir la madre con el worktree ya al día (R2) |
| P1.0b | Leer madre-local.md y seguir el ARRANQUE | HECHO | El ff falló porque las ramas divergían (14:24:56). Hubo `reset --hard` después de comprobar que el diff era vacío (14:25:10). Se releyó a las 14:25:17 | - |
| P1.1a | Ronda de CronCreate cada 20 min | PARCIAL | 58241846 → 708dccce. Un solo disparo (14:56:52), que cayó por un corte de la API. Hasta las 17:44 no hubo otro | Latido fuera de la sesión (R1) |
| P1.1b | PoolPaged por debajo de 3 GB | PARCIAL | 0,94 GB (14:25), 1,07 GB (15:08) y 1,05 GB medido por el crítico (17:47). Disco C: 7,3 GB libres | Medición automática |
| P1.1c | No cerrar Chrome ni WhatsApp. No recrear latidos | HECHO | 0 kills. RemoteTrigger solo con get, list_runs y get_run_log | - |
| P1.2a | ListAgents | HECHO | 14:25:38 y 15:35:43 | - |
| P1.2b | Una sola lista de lo que necesitan de Sergio Urcullo | PARCIAL | Se repitió en 4 mensajes (15:11, 15:32, 15:35 y 15:49) y con contenido distinto | Faltan las credenciales QA de Ventas, el OK de Leslie Mercado Moreno y el A/B de cal.com con la bio (R5) |
| P1.3a ⚑ | Codex YA: 2 ejecutores para Platform (Sol) | PARCIAL | Nube `task_e_6aca…` (14:40): en la nube no se elige el modelo. Local: `cx-gracia` (15:30) y `cx-widget` (15:40) con Sol, y `cx-terminos` con Astra. El primer Codex local arrancó 66 min tarde. El diff de la nube lo aplicó la PC (15:32) | Cupos a la vista (R8) |
| P1.3b | Codex: 1 ejecutor para Hermes (Sol o Luna) | OLVIDADO | 0 tareas sobre onia-hermes y 0 usos de Luna. Sin evidencia de que el CLI 0.161 acepte `gpt-6-luna` (el handoff registra que falló con el CLI viejo) | Una tarea Luna de prueba |
| P1.3c | Codex: 1 revisor | HECHO | `20261010-113632-revisar-…-widget`: 2 P2 en #140. `f981cd4a` en `integ/w1-fixes` | - |
| P1.4 | A Sergio Urcullo, solo lo publicado, en 3 bloques | PARCIAL | Hay bloques en 15:11, 15:32, 15:42, 15:49 y 17:27. «Pasó» incluyó cosas que no estaban publicadas (/book a las 15:32, Codex trabajando, cifras de la billetera sin verificar). El mensaje de 15:11 tuvo un 4º bloque | R4 |
| P1.TT1 ⚑ | Plataforma publica la cadena | PARCIAL | #144 MERGED 17:17:47 (`21f0c7e6`). #143, #142 y #139 se mergearon antes de la sesión. `/login` (17:23, con curl y Playwright local) da 200 en 1,9 s, con woff2 propio y 0 pedidos a Google Fonts: indica que F1 está en prod. **Los 7 PRs integrados no están mergeados** (`5c5beaf8`, `0abc65d5`, `1c5112a9`, `3e0575ef`, `2ee1dcfe`, `a8def40f` y `1f529cf8` no son ancestros de master). Hay 14 drafts abiertos más #70 | Retarget de #140 a `integ/w1-fixes` (1 commit adelante) y de #136 a `integ/bandeja-master` (13 adelante), merges en orden, migraciones con backup. Sin evidencia: release en prod, `_prisma_migrations` de #139, /checkout de usted |
| P1.TT1b | Chequeo de la publicación de las 15:58 | PARCIAL | El cron 19d6a061 nunca disparó. El chequeo manual de las 17:23 se hizo sin Chrome, porque el navegador interno fue denegado a las 17:24 | Corregir madre.md línea 91, que dice «corrió 85 min tarde»: no corrió |
| P1.TT2 | Refrescar la demo y las capturas C1-C7 | BLOQUEADO | Hay ventana solo de lunes a jueves. Está en madre.md §G (12-oct) | Mandarle el mensaje a Plataforma el lunes |
| P1.TT3 | Tabla «se promete / funciona» | BLOQUEADO | El mensaje a Ventas de las 15:09 no la pide y nadie confirmó que lo leyó | Credenciales QA (Sergio Urcullo) |
| P1.TT4 | Videos, 1 publicado por día | PARCIAL | El orden de grabación salió a las 17:23 | 0 mensajes a Marca. Sin evidencia de una pieza publicada hoy |
| P1.TT5 | Campaña de Meta del 16-oct | PARCIAL | Mensaje a Ventas a las 15:09 | Seguimiento. Probar `ads_library_search` (MCP de Meta) antes de Chrome (crítica §14). Tarjeta y gasto: Sergio Urcullo |
| P1.TT6 | Vender | BLOQUEADO | Depende de TT3 | - |
| P1.TT7 ⚑ | Codex a fondo (codex-tareas/) | PARCIAL | Las 6 tareas ya se habían lanzado en días anteriores: C11a #115, K2 #133 y K3 #134/#138 están MERGED; C11b llegó a prod por #122. B1 (#129) y B3 (#130) siguen como drafts | Integrar #127→#129, #130, #131, #135, #137 y #118. Sin evidencia sobre onia-1.0-nube.md §7 |
| P1.PC1 | Biblioteca de anuncios de Meta | OLVIDADO | 0 llamadas a Chrome | Probar primero el MCP `ads_library_search` |
| P1.PC2 | Evento de cal.com | OLVIDADO | Ninguna acción y ninguna fila | Preparar el A/B |
| P1.PC3 | Plantillas de WhatsApp Manager | OLVIDADO | Ninguna acción y ninguna fila | Revisarlas sin enviar nada |
| P1.PC4 | Mail +qapago | OLVIDADO | Solo está la fila C8 | Escribe datos de producción: necesita el OK de Sergio Urcullo (crítica §8) |
| P1.PC5 | Bucket R2 | BLOQUEADO | Es gasto (C7) | OK de Sergio Urcullo |
| P1.PC6 | Snapshot de Hostinger | OLVIDADO | Ninguna acción y ninguna fila | Hacerlo con Chrome |
| P1.PC7 | Bio de IG | OLVIDADO | Ninguna acción y ninguna fila | Depende de PC2 |
| P1.PC8 | «Aplicar» de Hermes | BLOQUEADO | Se pidió el sí a las 15:11 y no hubo respuesta (C3) | Sí de Sergio Urcullo |
| P1.PC9 ⚑ | Codex local y suite completa | PARCIAL | 9 suites, **6 limpias y 3 con 1 rojo cada una**: odonto 10.026/1 y book 9.943/1 por la línea base de voseo (se corrigió y solo se re-corrió ese test), y bandeja 10.189/1 por gitleaks con carga (aislado pasa 10/10). A Sergio Urcullo se le dijo «suite verde» | Re-correr completo o dejar que lo valide el CI |
| P1.LUC | Lucía G1 en el VPS | BLOQUEADO | Agente denegado por [Remote Shell Writes] (14:42:08). El token de IG vence entre el 13 y el 18 de octubre | Sí de Sergio Urcullo (C4) |
| P1.P0 | Paso 0: Remote Control y `list_connected_browsers` | OLVIDADO | Nunca se llamaron | Fila A0 (R2) |
| P2a | Subagentes con distintos LLMs | HECHO | 37 subagentes entre las 14:30 y las 17:41 (Haiku, Sonnet y Opus por rol), según los `.jsonl` de `subagents/` | - |
| P2b | Usar Codex | HECHO | 1 tarea en la nube y 4 locales | Hermes (P1.3b) |
| P2c | Leer todas las sesiones | HECHO | 5 `get_run_log` entre 14:26 y 14:27 | Se hizo una sola vez |
| P2d | Guiar a todas las sesiones | PARCIAL | SendMessage solo a Plataforma (2) y a Ventas (1), todos «not confirmed read» | Marca, Lucía y Hermes: 0 mensajes |
| P2e | Cada sesión con su LLM | OLVIDADO | `get_run_log`: dos sesiones en Opus (`01Hhn…` y `01SQ7…`) y tres en Sonnet. Hermes corre latidos vacíos | R7 |
| P3a | ¿La nube usa las skills y docs locales? | HECHO | Respuesta de las 15:11 y wf_8a89 | - |
| P3b | Paridad nube/PC | BLOQUEADO | Workflow denegado por el clasificador (15:31:43) | Sí de Sergio Urcullo (C5) |
| P3c | Análisis de Onia Platform | HECHO (rama) | `e4243d84`, 104 líneas, con 11 correcciones del verificador | Llevarlo a main |
| P3d | Muchos subagentes, sin perder datos | PARCIAL | Los journals guardan las salidas | La rama sin PR (R6) |
| P3e | Administrar el harness | PARCIAL | `ONIA_HARNESS.md` existe (`03280c03`, 17:43) | Sus 10 cambios (§7) siguen sin aplicar |
| P3f ⚑ | Billetera de agentes | PARCIAL | Las cifras salen de un script que corrió el agente `afef50b9`: 1.503,4 M en 48 h, cache_read 95,9 %, Opus 872,75 M (58 %). La entrega JSON del agente falló y nadie verificó las cifras. «Corro el script yo» (15:28) no tiene corrida | Verificador y medición diaria |
| P3g | Refills de Codex: ¿en la nube? | HECHO | 56 % (14:29), reinicio el 14-oct a las 03:57:41Z. Una tarea real en la nube | «En la nube siempre corre Sol» no es exacto: el modelo no se elige (crítica: corre gpt-5.6-sol) |
| P3h | Ordenar cómo responde | HECHO | Pasó / Necesito / Sigue | - |
| P3i | Guardar el contexto | PARCIAL | `2d567ac2` (15:10) y memoria | madre-local.md no se toca desde las 15:10 |
| P4a | Decir si necesita algo | HECHO | Bloque «Necesito» | Ver P1.2b |
| P4b ⚑ | ¿/caveman? | HECHO | **Prueba corregida:** el hook UserPromptSubmit inyectó «CAVEMAN MODE ACTIVE (full)» a las 14:24:27. Estaba activo | - |
| P4c | Respuesta breve y trabajo estructurado | HECHO | Mensajes cortos, trabajo en docs y PRs | Ver P3d |
| P5 | Reintentar los 3 caídos | PARCIAL | wf_8a89: gap OK y plataforma OK. Billetera sin JSON | P3f |
| P6 ⚑ | ¿Cuántos agentes trabajan? | HECHO | «3 en marcha» era correcto a las 15:36 | «7 subagentes (2 workflows)» era falso: a esa hora había corrido 1 workflow (6) más 3 sueltos |
| P7 | Analizar morluto/rea | HECHO (rama) | `e3374c0b`, ficha de 83 líneas, veredicto: no instalar | madre.md A2 dice «ficha en main» y es falso |
| P8a | Equipo de subagentes por sesión | PARCIAL | wf_b10e: diseñador y guionista Opus arrancaron a las 17:39 | `ONIA_EQUIPOS_POR_SESION.md` no existe a las 17:47 |
| P8b | Enviar los equipos a trabajar | OLVIDADO | 0 SendMessage después de las 15:42 | Depende de P8a |
| P8c | Guiones de la comunidad con un agente de tendencias | PARCIAL | Scouts con resultado | `GRABAR-17-23-OCT.md` no existe |
| P8d | VoltAgent como referencia | PARCIAL | El resultado está solo en el journal | Ficha en `references/` |
| P9a | Mínimo un subagente por cosa | PARCIAL | `c9d652e8` agregó §G (relojes) y §H (frentes con dueño) | Las 6 tareas de Chrome no tienen fila |
| P9b | No perder ningún punto | PARCIAL | El libro existe, en la rama | Tiene pruebas falsas (A2, F) y no lo verifica nadie |
| P9c | ¿Otra sesión madre? | HECHO | Respuesta de las 15:49: no | - |
| P10a | Cada subagente y qué hace | HECHO | Tabla de las 17:23 | La cifra «22 en 4 workflows» es falsa: eran 21 (17 en 3 workflows y 4 sueltos) |
| P10b | Qué grabar | HECHO | Orden por set y teleprompter | - |
| P10c | Hacia dónde va la platform | HECHO | Análisis + camino al 16-oct y al 30-oct | «20 PRs… ahora están integrados» induce a error: integrado ≠ mergeado. El orden posterior a la 1.0 está solo en el chat |
| P10d | ¿Referentes estudiados? | PARCIAL | Solo hay recetas `erik.json` y `santiago.json`. Rocha y Hormozi tienen ficha. Pablo y Boceto no tienen nada | Corregir el «sí, 6 con recetas» |
| P11 | Esta auditoría | PARCIAL | Este archivo, sin commit (lo commitea la madre) | Cargar los olvidos en el libro |
| P12 | Loops diarios (17:25) | PARCIAL | Crons dbec7299, 915aadba, 3f6ca99f y 708dccce, y madre.md §F | Mueren con la sesión y vencen a los 7 días. La ronda no dispara |
| P13 ⚑ | Qué es un harness y cómo es el nuestro (17:26) | HECHO (rama) | `03280c03` ONIA_HARNESS.md (9 secciones, con crítica) y `c9d652e8` §H | Llevarlo a main |
| P-CI | CI como gate | BLOQUEADO | Pregunta de las 15:36, sin respuesta (C6) | Sergio Urcullo |

## (c) Olvidos, por impacto, con dueño propuesto

1. **La cadena de Plataforma está trabada a un paso del merge.** 0 de 7 PRs integrados están mergeados.
   #140 y #136 no apuntan a las ramas que tienen los arreglos, así que mergearlos tal cual pierde los 2 arreglos
   del widget y 13 commits de la bandeja. A Plataforma no se le avisó que las ramas `integ` quedaron listas.
   **Dueño:** la madre corrige el destino de los PRs (`gh pr edit --base`, o un PR desde `integ/*`) y avisa a
   Plataforma. Las migraciones las aplica la madre con backup (Infra = un dueño). La línea fija la escribe
   Sergio Urcullo en Plataforma (C1).
2. **El trabajo de la madre no está en `main`:** son 8 commits, de `2d567ac2` a `c9d652e8`. La causa es que falta
   la marca `onia-autosync-main` en el git-dir y que no hay `settings.local.json` (verificado). Ninguna sesión
   nueva ni de la nube ve el libro, el análisis, REA, los ToS ni el harness. **Dueño:** la madre (git), ahora.
3. **La ronda no dispara.** Hubo 1 disparo en 3 h 20 min, incluso con 90 min de sesión ociosa. El cron único de
   las 15:58 no disparó nunca. **Dueño:** propuesta R1 (Programador de tareas de Windows sin LLM). El sí lo da
   Sergio Urcullo, porque es configuración persistente.
4. **Las sesiones están sin guía.** Marca, Lucía y Hermes tienen 0 mensajes y Ventas no tuvo seguimiento.
   **Dueño:** la madre, en su bucle principal, porque `get_run_log` solo lo tiene ella. Un Haiku parsea el
   volcado.
5. **Se hicieron 0 tareas de PC con Chrome** (Biblioteca de Meta, cal.com, WhatsApp Manager, +qapago, Hostinger y
   bio de IG) y nunca se corrió `list_connected_browsers`. **Dueño:** la madre. Para la Biblioteca, antes se
   prueba el MCP `ads_library_search` en un subagente Sonnet. +qapago necesita el OK de Sergio Urcullo.
6. **Afirmaciones falsas o sin evidencia que se le dijeron a Sergio Urcullo:**
   - «/book ya le habla de usted» (15:32), cuando no había PR;
   - «suite verde» en las 9 integraciones (15:49), cuando 3 tenían 1 rojo;
   - «7 subagentes (2 workflows)» (15:36);
   - «22 subagentes en 4 workflows» (17:23);
   - «6 referentes con recetas medidas» (17:23);
   - «20 PRs… ahora están integrados» (17:23), cuando ninguno está mergeado;
   - «el chequeo corrió 85 min tarde» (madre.md línea 91), cuando no corrió;
   - «ficha en main» (madre.md A2).

   **Dueño:** la madre corrige madre.md hoy. R4 evita que se repita.
7. **La lista de lo que se le pide a Sergio Urcullo está incompleta y repetida.** **Dueño:** la madre, R5.
8. **El LLM por sesión no se corrigió:** dos sesiones corren en Opus y Hermes gasta latidos vacíos. **Dueño:** la
   madre (`RemoteTrigger update`). El modelo de Plataforma lo decide Sergio Urcullo: sin evidencia de que la
   madre pueda cambiarlo desde afuera.
9. **Hubo 0 tareas de Codex para Hermes y 0 para Luna.** **Dueño:** la madre lanza 1 tarea de inventario con
   `codex-tarea.sh … gpt-6-luna low` como prueba. Si falla, se anota y se usa Sol.
10. **Los equipos por sesión y GRABAR-17-23-OCT no se entregaron ni se enviaron.** **Dueño:** wf_b10e (Opus).
    Después, la madre manda un SendMessage por sesión.
11. **El handoff madre-local.md no se toca desde las 15:10.** **Dueño:** un subagente Sonnet lo redacta y la
    madre lo commitea.
12. **Hay varios libros vivos** (TABLERO.md sin marcar como historia, más el SQLite del VPS). **Dueño:** la madre,
    después del inventario del VPS (ONIA_HARNESS §7.2, que ya está en curso).
13. **La billetera no tiene verificador.** **Dueño:** un Haiku corre el script y un Sonnet lo verifica, en el
    cierre del día.
14. **Las suites con 1 rojo no se re-corrieron completas.** **Dueño:** el CI de GitHub en cada PR (Plataforma) o
    la madre.
15. **No se verificó la publicación:** ni el release en prod, ni `_prisma_migrations` de #139, ni /checkout de
    usted. **Dueño:** la madre, por SSH y en solo lectura, y mirándolo con login (`scripts/onia-mirar.js`).
16. **No hay ficha de VoltAgent ni de los referentes Pablo y Boceto, y Rocha y Hormozi no tienen receta.**
    **Dueño:** Sonnet (VoltAgent). Marca o un subagente Sonnet (referentes).
17. **La cabecera de `codex-tarea.sh` dice «código = astra»**, pero el default es Sol y el routing del 9-oct dice
    Sol. La crítica ya lo había marcado y sigue igual. **Dueño:** Codex Sol (ONIA_HARNESS §7.7).

## (d) Reglas nuevas propuestas (para que Sergio Urcullo apruebe)

Se revisaron contra CLAUDE.md, la crítica de ONIA_EQUIPO_DE_AGENTES.md y ONIA_HARNESS.md. Las que solo endurecen
una regla que ya existe lo dicen. **Todo hook o `settings.local.json` es configuración persistente: necesita el
sí de Sergio Urcullo** (clase B de ONIA_HARNESS §6).

| # | Regla | Caso del 10-oct | ¿Nueva o endurece? | Cómo se cumple sola | ¿Sí de SU? |
|---|---|---|---|---|---|
| R1 | La ronda deja un latido que se puede comprobar: una línea por ronda en `~/.claude/madre/ultima-ronda.txt`. Si tiene más de 40 min, la madre la corre primero en su próximo turno | 1 disparo en 3 h 20 min | Nueva | Una tarea del Programador de tareas **sin LLM** cada 20 min escribe PoolPaged, disco, `gh pr list` y commits fuera de main. Un hook UserPromptSubmit muestra el atraso. El hook solo corre cuando alguien escribe, y por eso hace falta la tarea | Sí |
| R2 | El arranque de la madre es un script más la fila A0. `scripts/madre-arranque.sh` pone el worktree al día **antes** de abrir la sesión (si no, las skills nuevas dan «Unknown skill»), crea la marca `onia-autosync-main` y mide PoolPaged y disco. A0, que solo puede hacer el modelo: `list_connected_browsers`, Remote Control, ListAgents y recrear los crons | Unknown skill, Paso 0 nunca hecho, 8 commits fuera de main | Nueva: lleva a un script el Paso 0, que hoy está en la línea 301 de 531 | Script. Un hook no puede llamar a MCP ni ver los crons de la sesión, por eso eso va en A0 | Sí (para el `settings.local.json`) |
| R3 | Cada pedido de SU (P-n), cada promesa de la madre (A-n) y cada SendMessage («esperando lectura de X, verificar HH:MM») entra al libro **en el mismo turno**, y la respuesta cita la fila | P12/P13 fuera de la lista; ToS 1,5 h tarde; «billetera yo» sin corrida; 6 tareas de Chrome sin fila | Endurece «libro único» (madre.md y HARNESS §6). Lo nuevo es «en el mismo turno» | El verificador sin LLM de HARNESS §7.3 cruza el transcript con madre.md | No |
| R4 | Vocabulario fijo: **integrado** (master mezclado en la rama, suite corrida) ≠ **mergeado** (SHA ancestro de master) ≠ **publicado** (en prod) ≠ **mirado** (captura o URL). «Pasó» solo lleva publicado o mirado, con SHA o URL. «Suite verde» solo si la corrida completa dio 0 fallos. Toda cifra sobre el propio trabajo sale de un comando del mismo turno | Las 8 afirmaciones de (c).6 | Endurece CLAUDE.md «Verificar es MIRAR» y equipo §6. El vocabulario es nuevo | Un hook Stop que rechaza (exit 2) una línea de «Pasó» sin `https://` ni SHA | Sí (para el hook) |
| R5 | «Necesito» se copia de madre.md §C (dueño SU): máximo 3 ítems, ordenados por fecha límite y con su C-n. Si nada cambió: «Necesito: sin cambios (C1-C3)» | 4 repeticiones y 3 ítems que faltaban | Endurece onia-sesion-madre (máximo 3 por semana) y CLAUDE.md «Simple» | La plantilla del mensaje | No |
| R6 | Una rama `integ/*` o de la madre con commits nuevos termina, en el mismo turno, en un PR propio o en el PR existente apuntándola. Lo que entrega un workflow se commitea en el turno en que termina. El journal no cuenta como entrega | #140 y #136; la rama de la madre sin PR; VoltAgent solo en el journal | Nueva (la regla 4.7 de equipo cubre solo a Codex) | La ronda compara `gh pr list --json headRefOid` con `refs/remotes/origin/integ/*` | No |
| R7 | Un latido con la cola vacía se apaga (`RemoteTrigger update enabled:false`) y se prende al cargarle una tarea. Apagar y prender no es «recrear». El modelo de cada sesión sale de una tabla, y la ronda informa el modelo de `init` | Hermes en Opus con 0 tareas | Nueva. Es compatible con HARNESS §7.4: Hermes pasa a Review/QA con 3 o más tareas, o se apaga | La ronda (madre) | No para Hermes. Sí para el modelo de Plataforma |
| R8 | madre.md lleva «Codex: cupos» a la vista (Plat-1, Plat-2, Hermes con Luna o Sol, Revisor), con la carpeta en curso o «VACÍO desde HH:MM». Se llenan antes de integrar. **Tope:** hasta el reinicio del 14-oct a las 03:57Z, unas 6 tareas Sol por día, freno al 80 % y Astra solo para #114 y cobros. El 4 es un techo, no una meta | Codex 66 min tarde; Hermes y Luna con 0 | Endurece equipo §4 bis. El ritmo viene de la crítica §12 | El hook de R1 muestra «Codex k/4 · cuota %» | No |

**Lo que no se propone, porque choca con la crítica:** rondas de rutina de menos de 1 h, que un Haiku lea
`get_run_log`, que la madre abra sesiones en la nube, Telegram como aprobación para un LLM y elegir el modelo de
Codex en la nube.

## (e) ¿Más sesiones? Y mejoras de harness

**Sesiones: no hacen falta más.** El freno son 3 cosas: el sí que se escribe en cada sesión, el gate en serie en
la PC (unos 8 min por suite) y una madre que atendió a 2 de 5 sesiones.

| Carril | Decisión | Por qué |
|---|---|---|
| Plataforma | No sumar | 14 drafts en cola. Faltan merges, no manos |
| Ventas | Arreglar la que está | No tiene latido. Primero se prueba un disparo único sobre `session_0143C5…` (HARNESS §8.1). Si falla, Sergio Urcullo la reabre |
| Marca | No sumar | El cuello es grabar |
| Lucía | No sumar | Bloqueada (C4). Es la primera que se pausa si falta cuota |
| Hermes | Review/QA con tareas o latido apagado | Hoy gasta Opus sin tareas |
| Segunda madre / sesión de Chrome | No | Dos orquestadores se pisan, y lo de Chrome fue falta de atención, no de manos |

**Harness: el plan ya está escrito en `ONIA_HARNESS.md` §7** (10 cambios con dueño). Esta auditoría no lo
duplica. Solo agrega o corrige esto:
- **El orden lo cambia esta auditoría:** primero los olvidos 1 y 2 (desatascar la cadena y llevar la rama a
  main), después HARNESS §7.2 (inventario del VPS) y §7.3 (verificador).
- **La propuesta de un hook SessionStart que «imprime crons y navegadores» no funciona:** un hook es shell, y no
  ve los crons de la sesión ni puede llamar a MCP. Eso va en la fila A0 (R2).
- **«Codex en la nube primero» vale con 3 límites:** el modelo no se elige, no hay evidencia de que corra vitest
  y el diff lo aplica la PC (#144 se aplicó a mano a las 15:32). Sirve para código cerrado con el CI como gate,
  no para cobros.
- **El CI como gate (C6)** depende primero de `concurrency` (HARNESS §7.6) y de medir los minutos de Actions.

**3 decisiones de Sergio Urcullo que destraban más (en orden):**
1. Escribir la línea fija de aprobación en Plataforma, Marca, Ventas y Hermes (HARNESS §7.1, unos 5 min).
2. Sí a la configuración local de la madre: la tarea del Programador de tareas sin LLM (R1) y la marca y el
   `settings.local.json` (R2).
3. Sí al CI como gate en lugar de la suite de la PC (C6).

**Qué NO hacer:**
- abrir más sesiones ni una segunda madre;
- tener más de unos 10 agentes Claude a la vez;
- usar `/fire` cada 10 min;
- montar una VM con el disco al 99 %;
- poner un Telegram por cada merge;
- tomar un «ok» de Telegram como aprobación para un LLM;
- dar tokens a la nube o al VPS sin el sí;
- usar `--union` en colas y handoffs;
- crear un cuarto libro;
- instalar RAMMap o Codex 0.162.1 sin aprobación.

## (f) Cómo funcionan los LLMs (para Sergio Urcullo)

Es el texto de la lente LLMs, con las correcciones del crítico marcadas.

**1. Contexto.** Es todo lo que el modelo tiene sobre la mesa: órdenes, historial y archivos leídos. No guarda
memoria entre vueltas: en cada vuelta relee la pila completa.
- Es como una secretaria que, antes de contestar cada pregunta, vuelve a leer el cuaderno entero. Con un
  cuaderno más grueso, cada pregunta cuesta más y es más fácil que pierda o mezcle un detalle.
- El costo es: número de vueltas × tamaño del cuaderno.
- En 48 h gastamos **1.503 M tokens**. Lo midió un script; la entrega del agente falló y nadie lo verificó.
- *(Corrección: el «98,5 % en una sola sesión» no tiene fuente que se pueda seguir. Lo medido es: conversación
  principal 39,7 %, subagentes 60,3 %.)*
- Según el `onia-sesion-madre` del 3-oct: la madre v1 gastó ~1.840 M, de los que ~777 M fueron solo su propia
  conversación, abierta varios días. La v2 gastó ~425 M, y apenas ~0,5 M de eso fue texto escrito.

**2. Caché.** El sistema guarda lo que ya leyó y releerlo sale mucho más barato (tarifa pública, aprox. 1/10).
- El **95,9 %** de lo gastado es esa relectura. Es la forma barata de gastar; lo caro es que haya tanto para
  releer.
- La caché caduca si la sesión queda quieta unos minutos (regla pública, unos 5 min).
- Cuántas veces nos pasó: sin evidencia. Costo en dólares por modelo: sin evidencia.

**3. Modelos.** Son tres niveles de empleado.
- Claude: Haiku = pasante (leer, contar, ordenar). Sonnet = senior de todos los días. Opus = consultor caro
  (decidir lo ambiguo).
- Codex: Luna = pasante. Sol = senior. Astra = consultor (ambiguo, plata, legal).
- En 48 h: **Opus 58 %, Sonnet 41,5 %, Haiku 0,5 %**. El nivel barato casi no se usa.
- Codex va al **56 %** de la semana y se reinicia el 13-oct a las 23:57 La Paz. Astra se llevó el **85 %** del
  input de Codex (91,7 M), aunque la regla deja a Sol como estándar.
- *(Agregado del crítico: la cabecera de `codex-tarea.sh` todavía dice «código = astra», y eso empuja el
  error.)*
- En la nube no se elige el modelo de Codex.

**4. Subagentes.** Cada uno trabaja con su propio cuaderno y le devuelve a la madre solo el resultado.
- Es como mandar a un especialista a leer 300 páginas en su oficina: vuelve con una hoja y tu escritorio queda
  limpio.
- No son gratis. 65 agentes revisando PRs costaron 207 M, 25 buscando anuncios costaron 95 M y el hermes#76 se
  revisó 4 veces.
- La regla: máximo 5 por workflow, una lente por PR y que reciban el diff, no el documento entero.

**5. Por qué un modelo «olvida» un pedido.**
- **Compactación:** cuando la conversación se llena, se resume. El resumen es fiel, pero no elige: un pedido
  chico de hace horas pesa igual que un error viejo.
- **Mensaje a mitad de turno:** lo ve en su próxima pausa y puede tratarlo como un detalle. Hoy los pedidos de
  las 14:25, 14:27 y 14:30 llegaron mientras trabajaba, y de ellos salieron la mayoría de los olvidos.
- **Crons:** no disparan si la sesión está ocupada. *(Corrección: hoy tampoco dispararon con la sesión ociosa.
  Hubo 1 disparo en 3 h 20 min.)*
- **El modelo escribe el estado a partir de lo que planeó, no de lo que midió.** Por eso «lanzado» se convierte
  en «hecho»; de ahí salen las 8 afirmaciones falsas de hoy.
- **Cómo se evita:** un libro con columna de prueba, pedidos que entran al libro en el mismo turno (R3), un
  verificador sin LLM y el handoff antes de cerrar. Se revisa contra el libro, no contra lo que la sesión
  recuerda.

**6. Decisiones tuyas que bajan el gasto sin bajar la calidad.**
- a. Cerrar la madre y abrir otra cuando se alarga, con el handoff escrito antes. Es el mayor ahorro medido.
- b. Aprobar: Haiku o Luna para leer, contar y verificar; Sonnet o Sol para juicio; Opus o Astra solo con motivo
  escrito.
- c. Tope de 5 agentes por workflow. «Exhaustivo» solo cuando lo quieras de verdad (el 8-oct costó ~60 M).
- d. Dar los pedidos juntos, en una lista numerada, y no de a uno mientras trabaja.
- e. Las fichas y documentos de Hermes van a Codex Sol local, no a Claude.

## Fuentes verificadas por el crítico

- Transcript `~/.claude/projects/C--dev-proyectos-onia-hermes--claude-worktrees-sesion-madre-v2-revision-696bb0/d5e87d2e-f669-455c-9881-aa1532fef429.jsonl`
  y sus `subagents/`.
- `git` de onia-hermes (rama, commits `2d567ac2` a `c9d652e8`) y de onia-platform (`origin/integ/*` y
  `origin/master` `21f0c7e6`).
- `gh pr view` / `gh pr list` de onia-platform.
- `~/.codex/madre-tareas/20261010-*`.
- Salidas de las suites en `…/d5e87d2e…/tasks/b*.output`.
- `hermes-content/docs/ONIA_EQUIPO_DE_AGENTES.md` (crítica), `hermes-content/docs/ONIA_HARNESS.md`,
  `hermes-content/docs/cola/loop/madre.md`, `scripts/git-autosync.js` y `scripts/codex-tarea.sh`.
- PoolPaged y disco medidos a las 17:47 UTC.
