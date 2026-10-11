# Cola · MADRE — libro único de puntos (nada se pierde)

Sergio Urcullo, 10-oct: *«quiero mínimo un subagente para cada cosa, ordenalo, no podemos perder cada punto, ese fue uno
de los errores de la anterior sesión madre»*. Un solo escritor: la madre. Cada punto tiene **dueño** (subagente con su
LLM, Codex, sesión o Sergio Urcullo), **estado** y **prueba**. La ronda (Haiku, cada 20 min) relee este archivo, marca lo
cerrado con su prueba y avisa lo que lleva más de 24 h sin moverse. Una sola madre: dos orquestadores se pisan.

Leyenda de dueño: `H` Haiku · `S` Sonnet · `O` Opus · `CxSol` / `CxAstra` Codex local · `CxNube` Codex cloud ·
`Plat` / `Marca` / `Ventas` / `Lucía` / `Hermes` sesiones de la nube · `SU` Sergio Urcullo.

## A. En curso (agentes trabajando ahora)
- [ ] A1 Equipos por sesión + guiones 17-23 oct (tendencias en vivo) — workflow `wf_b10e3aaa-a9f`: S referencia VoltAgent,
  3×S scouts web, H inventario, O guionista, O diseñador, O crítico → `docs/ONIA_EQUIPOS_POR_SESION.md` y
  `cola/plan-3-semanas/GRABAR-17-23-OCT.md`. Hecho = ambos en main + mensaje a cada sesión con su equipo.
- [x] A2 Análisis de `github.com/morluto/rea` (pedido de SU) — workflow `wf_7d7f64d2-ed6` (S función, O seguridad,
  S encaje/legal, S ficha) → `references/video-intake/2026-10-10-github-morluto-rea.md`. Hecho: ficha en la rama de la madre (a main con I1); veredicto = banco de ideas, NO instalar (riesgo alto en la PC, zona legal roja con competidores).
- [x] A3 Publicación automática 15:50 UTC de master `32c7e0e8` (F1, #142, #139) — madre + Chrome a las 15:58 UTC.
  Hecho = /login y /checkout MIRADOS renderizados en prod, captura. **Parcial 17:23 UTC:** /login mirado con Playwright
  headless (Chrome instalado): se ve bien, 0 pedidos a Google Fonts, 4,1 s. Falta confirmar QUÉ release corre (Plat) y
  mirar /checkout de usted con login. El navegador interno de la app no abre app.onia.com.bo (permiso).
- [x] A3b **La publicación de las 15:50 UTC FALLÓ** («hay otro build corriendo… no encimo otro»): prod sigue en
  **v4, 20:15 UTC:** cerrado. La de las 18:50 salió: prod `release-21f0c7e6` (#144) desde 18:56 UTC, mirado por la v3 con Playwright.
  `release-c94b9daa` (#141). Ayer igual a las 15:50. Causa probable: CI de los PRs que pushé 15:30-15:45 en el runner del
  mismo VPS. Próxima: 18:50 UTC. **Regla: la madre no pushea a onia-platform entre :20 y :10 de las horas de publicación
  (00, 03, 06, 09, 12, 15, 18 y 21 UTC, a las :50).** Propuesto a Plat: que el publicador reintente a los 20-30 min.
- [ ] A7 Bot: vigia-sin-respuesta (16:39 UTC) marca 8 conversaciones colgadas y 5 sin respuesta → Plat/chatbot + SU
  (pueden ser prospectos reales). Bot onia-center detenido a propósito esperando la firma de SU (knowledge 031/032).
- [ ] A8 Inventario VPS (17:45 UTC): los loops viejos (onia-loop.sh) están todos pausados o mudados a nodo-casa, cuyo
  espejo está congelado desde el 28-sep → web-venta y chatbot-cola NO corren (sin dueño duplicado). Vivos: claude-guardia,
  vigías, publicador cada 3 h, pub-car. Muertos o mudos: onia-parte-diario (desde 09-09), vigías de CI/crédito/comprobantes/
  disco (logs vacíos), onia-jarvis-voz (ElevenLabs sin cuota). Backup diario con restoreVerified:false.
- [ ] A4 Auditoría de todo lo pedido hoy (pedido de SU) — workflow `wf_f6b7fcd9-207` (H pedidos del transcript, H
  evidencia, O auditor, O reglas, O sesiones/harness, S cómo funcionan los LLMs, O crítico) →
  `research/2026-10-10-auditoria-madre-v3.md`. Hecho = doc en main + olvidos cargados acá con dueño.
- [ ] A5 Harness: qué es y cómo está hecho el nuestro, loops, subagentes, todos los frentes con dueño (pedido de SU) —
  workflow `wf_da25d090-4e5` (S teoría con fuentes, 2×H inventario, S frentes, O arquitecto, O crítico) →
  `docs/ONIA_HARNESS.md`. Hecho = doc en main + frentes 🔴 sin dueño asignados.
- [x] A6 Releer los términos de Doctocliq y Dapta antes de seguir usando sus cuentas de prueba (salió del análisis de
  REA; prometido anotarlo y olvidado hasta acá). Dueño: S con WebFetch. **Hecho:** `research/competencia/TOS-DOCTOCLIQ-DAPTA.md`. Ambas prohíben ingeniería inversa; Dapta §2.5(i) prohíbe usarla para construir un producto competidor. Sin riesgo: mirar la UI con la cuenta, ayuda pública, notas internas. Pendiente SU: mirar el checkbox que aceptó al crear cada cuenta.

## B. Integrado con master, suite completa verde en la PC (dueño del merge: Plat, en su orden)
- [x] B1 #114 C15b `5c5beaf8` (10.026/0, CLEAN) — **2 migraciones ANTES del merge** o prod cae (P2022).
  **v4, 20:15 UTC:** mergeado por Plat (master `922a0da9`, 19:31 UTC). Medido en prod: las 6 migraciones de octubre aplicadas 18:44-19:21 UTC (`_prisma_migrations`, incl. #110/#119/#124). Prod corre `release-21f0c7e6`. Sale a las 21:50 UTC: MIRAR después.
- [ ] B2 #124 términos `2ee1dcfe` (9.943/0) — IP falsificable arreglada por CxAstra. **Texto legal: pasa por SU.**
- [ ] B3 #113 gracia `a8def40f` (10.017/0) — conflictos resueltos por CxSol; depende de B2 (términos).
- [ ] B4 #110 caja `1c5112a9` (9.965/0) — diseño + migración.
- [ ] B5 #119 odontograma `3e0575ef` (10.026/0) — diseño + migración.
- [ ] B6 #132 K1 `0abc65d5` (10.010/0).
- [ ] B7 #136 bandeja → `integ/bandeja-master` `1f529cf8` (10.189/0; el rojo de gitleaks fue carga, 10/10 solo) — diseño.
- [ ] B8 #140 widget → `integ/w1-fixes` `f981cd4a` (9.962/0): CxAstra sin hallazgos de seguridad; CxSol arregló 2 P2
  (sondeo tras envío fallido, orden 1-3-2). Falta la infra (`/public/api/` + `hmac_mandatory`).
- [x] B9 #144 `/book` de usted (CxNube, 9.943 + trinquete) — **mergeado** por Plat 17:17 UTC (`21f0c7e6`); sale a las 18:50 UTC (falta **mirarlo**).
- [ ] B10 #118 agenda por profesional — CLEAN, sin migración — diseño.

## C. Espera a Sergio Urcullo (se le pide UNA vez, en la sesión que corresponde)
- [ ] C1 En **Plataforma**: «sí, la regla del 9-oct es mía; publicá lo revisado; registrá y aplicá las migraciones con backup».
- [ ] C2 En **Marca**: la misma línea + «publicá las historias» + CTA «buscá X en Avisos» + grabar N07 y D03-A.
- [ ] C3 En **Hermes**: sí/no a `aplicar`.
- [ ] C4 Acá: Lucía G1 + renovar token de IG (vence 13-18 oct). El ensayo en el VPS lo frenó el control de permisos.
- [ ] C5 Acá: paridad nube = PC (16 skills + 2 agentes + reglas de memoria a CLAUDE.md/AGENTS.md). Frenado por permisos.
- [ ] C6 Acá: ¿CI como gate en vez de la suite de la PC? (más PRs en paralelo).
- [ ] C9 Lucía G1 con voz Marcela: HECHO 01:45 UTC (`.madre-ver/lucia-g1-voz.mp4`, 320 caracteres enviados, quedan 381; -14 LUFS; Whisper confirma texto). Mostrado a SU; espera «publicá G1 de Lucía». Dirección SU: Lucía = modelo IA independiente (avisado a su sesión).
- [ ] C7 Gasto: bucket R2 (punto 4) · tarjeta en ONIA Ads + US$56 · el SIAT (CAFC, reloj 4-nov) · OK al REVOKE del B22.
- [ ] C8 Punto 1: aprobar en `/admin/payments` el pago de prueba de «ZZ QA Pago» (la madre lo prepara con Chrome).

## D. Sesiones de la nube (la madre les manda su siguiente tarea; la ronda verifica que la tomen)
- [ ] D1 Ventas: go/no-go del 13-oct + campaña lista para crear en pausa (mensaje 10-oct ~15 UTC; no lo tomó todavía).
- [ ] D2 Plataforma: demo refrescada (primera ventana: lunes 12-oct 07-11 UTC) + capturas C1-C7 → destraba Ventas y Lucía.
- [ ] D3 Marca: recibe GRABAR-17-23-OCT.md (A1) y su equipo.
- [x] D4 (v4, 20:15 UTC) Las 4 nubes tomaron la dirección de las 20 UTC, con commit: Plat `ONIA_1.0_CORTE` (optimistic-ride 20:07), Lucía revisión de 8 piezas (zealous-babbage 20:04), Hermes QA Q1-Q5 (adoring-ramanujan 20:04), Marca **K11 + historias 1-3 publicados** (gifted-clarke 20:11). Ventas sin commit desde 18:09 UTC (running).
- [ ] D5 Marca: layout `inventario` + cierre «buscá PALABRA en Avisos» en `carousel_pack_referentes.js` + test, y los 2 carruseles del brief DePPPp5FgMh (18 y 21-oct). Pedido 20:20 UTC. Hecho = SHA + láminas mirada.
- [x] D6 (v4, 20:25 UTC) SU: «mergeá vos» → #187 `d6a276ad`, #188 `e3c3d564`, platform #145 `d8ca5a32` (sale 21:50 UTC: MIRAR /book). Codex: junction `~/.agents/skills` → repo (30 skills), corrido por SU. SIN: SU presentó (reloj 13-oct cerrado por él).
- [ ] D7 Regla nueva de SU (20:25 UTC): MOSTRAR antes de subir o hacer (memoria `feedback-mostrar-antes-de-publicar`). Avisado a Marca y Lucía. Lucía G1 mostrado (video + 8 cuadros en el tablero), espera su OK. Pendiente: ¿mostrar y esperar OK, o solo mostrar?
- [x] D8 PUBLICADO 21:55 UTC `release-d8ca5a32` (#145 logo /book + #114 factura): /book y /login MIRADOS en el navegador 01:18 UTC (capturas en madre-capturas). Factura (#114) solo se ve con login: queda para Plat/QA. Título de /login en «tu» → pedido a Plat.

## I. Olvidos de la auditoría (research/2026-10-10-auditoria-madre-v3.md §c) — dueño y estado
- [ ] I1 La rama de la madre (`claude/onia-sesion-madre-9313fb`, 10+ commits) NO está en main: el integrador `onia-cola` está
  apagado desde el 7-sep. Dueño: madre → PR propio y merge **después de las 19:00 UTC** (no chocar con la publicación).
- [ ] I2 Los PRs #136 y #140 no apuntan a `integ/bandeja-master` ni a `integ/w1-fixes`. Dueño: madre → fast-forward de
  `integ/w1-w1b` a `f981cd4a` después de las 19:00 UTC; la bandeja se la pasa a Plat (su rama).
- [ ] I3 La ronda disparó 1 vez en 3 h 20 min (los cron de la sesión solo corren con la sesión ociosa). Dueño: SU decide R1
  (tarea del Programador de tareas de Windows, sin LLM).
- [ ] I4 Tareas de la PC con Chrome en 0 (cal.com, `+qapago`, Biblioteca de Meta, snapshot de Hostinger, bio de IG) y nunca
  se corrió `list_connected_browsers`. Dueño: madre, de a una, con el Chrome de SU (lo que cambia una cuenta pide su línea).
- [ ] I5 Codex sin tarea para Hermes ni para Luna. Dueño: madre → una tarea Luna de prueba (inventario mecánico).
- [ ] I6 Ficha de VoltAgent sin escribir; faltan fichas de Pablo y Boceto y recetas de Rocha y Hormozi en `edicion-referentes`.
  Dueño: S (fichas) cuando termine A1.
- [x] I7 Cabecera de `scripts/codex-tarea.sh` dice «código = astra»; la regla vigente es Sol por defecto. Dueño: madre.

## K. Quema de cuenta (mod agentes-en-vivo, 10-oct)
- [ ] K1 Codex carga ~500 skills en cada tarea («Exceeded skills context budget… 493 skills not included»): ~1 M tokens de
  **v4:** medido: `~/.agents/skills` = junction a `~/.claude/skills` (110 carpetas); el repo tiene 30. Comando entregado a SU (lo corre él: cambia su app).
  entrada por tarea chica (resume de cx-publicar: 1.003.342 in, 910.336 cacheados). Causa: `~/.agents/skills` es un
  acceso directo a `~/.claude/skills` (creado el 5-may). Arreglo propuesto: que apunte a una carpeta con solo las skills
  que usa Codex (las 30 de `.agents/skills` del repo). Cambia la app de Codex de SU → su sí.
- [ ] K2 La madre anterior (`202a717e`) consumió 584 M tokens en 6 h (99 % releyendo). Regla vigente: madres cortas,
  relevo con handoff antes de que la conversación se haga larga (cierre del día 21:53 avisa).

## J. Codex: cupos (R8) — 56 % semanal al 9-oct, reinicio 13-oct 23:57 La Paz, refills solo al tope
| Cupo | Modelo | En curso | Desde |
|---|---|---|---|
| Plat-1 | Sol | VACÍO | 15:58 UTC |
| Plat-2 | Sol | VACÍO | 15:58 UTC |
| Hermes | Luna/Sol | VACÍO (nunca usado) | — |
| Revisor | Astra | VACÍO | 15:55 UTC |

## Correcciones a lo dicho a SU (R4: integrado ≠ mergeado ≠ publicado ≠ mirado)
- «/book ya le habla de usted»: falso. Está en el PR #144, sin mergear ni publicar.
- «9 PRs integrados» / «20 PRs… integrados»: hay 7 integrados con master más 2 ramas `integ/*`. **Ninguno está mergeado.**
- «suite verde» en todos: 3 de 9 suites tuvieron 1 rojo. Eran el trinquete de voseo (2, registrados) y gitleaks (por carga, 10/10 solo).
- «el chequeo corrió 85 min tarde»: el cron nunca disparó; la madre miró a mano a las 17:23 UTC.
- «ficha de rea en main»: está en la rama de la madre, no en main (I1).
- «6 referentes con recetas medidas»: hay recetas de Santiago, Erik, Rocha y Pablo, y molde Boceto; Hormozi solo como pizarra. Faltan fichas (I6).
- Conteos de subagentes: a las 17:23 UTC eran 21, no 22 (no cambia nada).

## G. Relojes (fechas que nadie empujaba; la madre los lleva en el parte de la mañana)
| Fecha | Qué | Dueño | Fuente |
|---|---|---|---|
| lun 12-oct 07-11 UTC | Refrescar la demo (solo lun-jue) → capturas C1-C7 | Plat | onia-1.0-nube.md §3 |
| mar 13-oct | Declaraciones mensuales del SIN (F-200 IVA, F-400 IT, F-608 RC-IVA; F-530 IUE-BE si hubo pagos al exterior): NIT termina en 0 → vence el 13 | SU / Leslie Mercado Moreno / contador | memoria nit-onia-estado-verificado-siat |
| 13-oct | Go/no-go de la pauta de Meta del 16-oct | Ventas | handoff TERMINAR TODO |
| 13-oct 23:57 La Paz | Reinicio semanal de Codex (56 % al 9-oct; refills solo al tope) | madre | rate_limits |
| 13 al 18-oct | Vence el token de Instagram de Lucía (renovar o que salga G1 antes) | SU decide (C4) | videos/lucia-entrega/README.md |
| vie 16-oct | Puntos 1 a 4 de la 1.0 + arranque de la pauta | Plat / Ventas | ONIA_PLAN_1.0_Y_CAJA.md |
| 30-oct | La 1.0 completa (15 puntos) + homologación del SIAT | Plat / SU | plan §1, memoria SIAT |
| 4-nov | Vence el trámite 9473 del SIAT (CAFC, prórroga de 60 días) | SU (solo él abre el portal) | memoria siat-sistema-9473 |
| sin fecha | Trámite del API QR del BCP | SU | memoria bcp-api-qr-tramite |

## H. Frentes sin dueño hasta hoy (ONIA_HARNESS.md §4) → dueño asignado
- [ ] H1 SIAT, fiscal y legal → la madre lleva los relojes (G); los actos los hace SU / Leslie Mercado Moreno.
- [ ] H2 Leads (7, el más viejo ~50 días) y pauta → Ventas, con latido (probar el id de su sesión con un disparo único).
- [ ] H3 Asesorías y reservas de cal.com → la madre lee la agenda en el parte de la mañana (Google Calendar).
- [ ] H4 Web onia.com.bo → inventariar primero si el loop `web-venta` del VPS sigue vivo (para no tener dos dueños).
- [ ] H5 Infra, costo y VPS → la madre como dueña única; inventario en vivo de lo que corre en el VPS (solo lectura).
- [ ] H6 Chatbot (motor :3020, n8n, Chatwoot) → inventariar `chatbot-cola` del VPS; Plat mantiene los PRs.
- [ ] H7 Hermes con la cola vacía gastando Opus cada hora → proponer a SU: pasarlo a Review/QA o bajar el latido.
- [ ] H8 Seguridad local: secreto de n8n en claro en ~/.codex/config.toml; Codex interactivo en danger-full-access → SU decide.

## F. Loops (pedido de SU 10-oct: «organizá tus loops y que trabajen a diario»)
| Loop | Dónde corre | Cuándo (La Paz) | Qué hace | ¿Sigue con la PC apagada? |
|---|---|---|---|---|
| Ronda | madre, CronCreate `333b77d3` (v4) | :07 :27 :47 | H verifica cada punto de este libro + colas; empuja sesiones paradas; lanza Codex | No |
| Parte de la mañana | madre, CronCreate `313765ea` (v4) | 07:53 | Publicado ayer (mirado), qué grabar hoy, qué necesito de SU, medir PC/Codex | No |
| Cierre del día | madre, CronCreate `db8b3b4b` (v4) | 21:53 | Libro + handoff + billetera 24 h + commit; avisa si la madre necesita relevo | No |
| Lote de contenido | madre, CronCreate `836a6670` (v4) | lunes 08:13 | Guiones de la semana con scouts de tendencias si falta el GRABAR-*.md | No |
| Latidos | servidor, RemoteTrigger | Plat :17 · Marca :27 · Lucía :47 · Hermes :57 (cada hora) | Cada sesión trabaja su cola | Sí |
| Ventas | su propio ScheduleWakeup | — | Sin latido del servidor (entorno «Default») | Solo si se programó |
Los CronCreate de la madre viven solo mientras está abierta, vencen a los 7 días y disparan con la sesión ociosa (el
chequeo de las 11:58 corrió 85 min tarde por eso). Al abrir una madre nueva se recrean desde esta tabla.

## E. Gestión (la madre)
- [ ] E1 Billetera en cada ronda: % Codex (freno 80 %, refills solo al tope; reinicio 13-oct 23:57 La Paz), tokens 48 h por
  modelo, sesiones paradas. Base 10-oct: 1.503 M tokens/48 h, Opus 58 %, Sonnet 41,5 %, Haiku 0,5 %.
- [ ] E2 Handoff al día en `handoff/madre-local.md` antes de que la conversación se haga larga.

## Cerrado hoy (con prueba)
- [x] Codex cloud `/book` de usted — task_e_6aca4e5cf680832784ec553ba5c3d5ef → PR #144.
- [x] Análisis 15 puntos de la 1.0, verificado por O — `e4243d84` (`research/2026-10-10-analisis-plataforma-1.0.md`).
- [x] #139 seguro de publicar (migración idempotente; el deploy no corre `prisma migrate`) — `2d567ac2`.
