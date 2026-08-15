# CLAUDE.md — Onia Hermes

Instrucciones de proyecto para Claude. Override sobre defaults.

## Skills del proyecto (REGLA)

> El repo tiene skills propias de Claude Code en `.claude/skills/` (auto-descubribles).
> Toda sesión arranca invocando **`onia-router`**, que enruta la tarea a su carril y
> nombra el stack de skills + subagente + docs fuente. Mapa legible + spec de repos
> separados: `hermes-content/docs/ONIA_SKILLS_STACK_Y_SUBAGENTES_20260705.md`.

- Skills Onia propias: `onia-router` (índice), `onia-propuestas`,
  `onia-contabilidad-bolivia`, `onia-core`, `onia-web-factory`, `ver-videos`, `editor-videos`.
  Envuelven conocimiento propio y apuntan a las fuentes de verdad — al cambiar una regla,
  editar la fuente, no la skill.
- 3 capas distintas: skills Claude Code (`.claude/skills/`, las invoca Claude Code) ·
  subagentes (`.claude/agents/`) · skills-doc de Hermes (`hermes-content/skills/`, las lee
  el bot del VPS).
- Si una tarea tiene skill pública instalada (137 globales + plugins), usarla; no reinventar.

## Una sola fuente de verdad por tema (REGLA)

> Nace del 2026-08-15: barrimos el repo y habia **cuatro precios vivos del mismo
> chatbot** (1.500+550 en el codigo, 650+350 en el cotizador publico, 1.900+150 en
> propuestas ya firmables, 900-1.200+450-600 en el one-pager de la vendedora), y
> 95 documentos distintos hablando de precios. Con eso, cualquier sesion elige mal.

- **Precios: manda `onia-platform/lib/pricing.ts`.** Es el unico archivo que cobra
  de verdad (lo valida el checkout). Ningun doc, propuesta, one-pager ni cotizador
  define precio: lo LEEN de ahi. Si un material dice otro numero, esta roto.
- **Un tema = un archivo sin fecha.** Si cambia, se EDITA ese archivo; no se crea
  uno nuevo con la fecha de hoy.
- **Fecha en el nombre = historia.** `hermes-content/docs/historial/` son fotos de
  un dia y **no son fuente de verdad** (102 docs movidos ahi el 2026-08-15). Si un
  doc con fecha contradice a uno sin fecha, gana el que no tiene fecha.
- Antes de escribir una cifra o una capacidad en material de cliente, **buscar si ya
  existe en otro lado**. Si hay dos versiones, no elegir la mas linda: preguntar.

## Verificar es MIRAR, no suponer (REGLA)

> Nace del mismo dia: el login de produccion mostraba los NOMBRES de los iconos
> como texto ("credit_card_off", "verified_user") y yo lo habia "verificado" varias
> veces con HTTP 200 y grep, sin abrirlo nunca. Lo encontro Sergio.

- **Toda pantalla que ve un cliente se abre y se MIRA renderizada** (Playwright +
  Chromium headless, y leer la captura). Un 200 y un grep no son verificacion.
- **Verificar contra el sistema correcto.** Ese mismo dia: diagnostique la base
  contra un Supabase en la nube que ya no era produccion, y declare una pagina "no
  expuesta" probando el dominio equivocado (estaba viva en otro host). Antes de
  afirmar, confirmar QUE sistema se esta mirando.
- **Medir peso y tiempo real**, no solo que responda. Un 200 lento es un fallo con
  cara de exito (la fuente de iconos pesaba 3,9 MB y tardaba 117 s).
- Un `grep` sirve para DESCARTAR, nunca para CONFIRMAR que algo se ve bien.

## Video — ver y editar sin editores humanos (REGLA)

> El Onia system ve, transcribe y edita video con código (método del tutorial de Santiago).
> Dos skills propias, probadas 2026-07-23. Al mejorar reglas, editar la SKILL.md, no duplicar.

- **`ver-videos`** — para "ver" cualquier video que pase Sergio o un cliente: baja/recibe →
  audio + fotogramas (`scripts/see-video.sh`) → transcribe con timestamps (`scripts/transcribe.sh`,
  Speaches en el VPS, gratis) → leer una MUESTRA de frames con visión → resumen con timeline.
  **Honestidad:** reportar cobertura real (audio 100%, N de M frames), no afirmar "vi el video"
  desde 2 cuadros. **Forzar `Systran/faster-whisper-small`** (el distil del contenedor es
  English-only y traduce el español).
- **`editor-videos`** — edición talking-head / vertical (TikTok/Reels/Shorts): corta silencios,
  muletillas y trabadas (`scripts/cut-plan.mjs` + ffmpeg, pieza propia), subtítulos karaoke
  (`embedded-captions`), overlays (`talking-head-recut`), SFX (librería HyperFrames), complementos
  (imagen barata / Higgsfield con OK). Orquesta, no reinventa el motor.
- **REGLA DE ORO (de Santiago):** la **tabla de cortes + preview 360p SIEMPRE se muestran a Sergio
  ANTES de aplicar el corte**. Nunca cortar a ciegas.
- **Gasto:** generación paga (Higgsfield, AssemblyAI, ElevenLabs) = permiso explícito caso por caso;
  por defecto gratis (Speaches, HyperFrames, imagen barata). Ver `gasto-plataformas-validar-primero`.
- HyperFrames (motor HTML→MP4) vive en `.agents/skills/` (talking-head-recut, embedded-captions,
  media-use, etc.). Transcripción local `hyperframes transcribe` NO corre en Windows
  (whisper-cpp ausente) → usar Speaches. Detalle: `hermes-content/docs` + memoria [[onia-video-hyperframes]].

## Propuestas comerciales (REGLA)

> Fuente de verdad: `hermes-content/skills/propuestas-comerciales-onia.md`
> (skill que lee Hermes en el VPS). Lo de abajo es resumen — al cambiar reglas,
> editar la skill primero.

Toda propuesta a cliente se genera con el sistema en
`hermes-content/propuestas/generador/` (`node generar-propuestas.js <slug> --pdf`).
Nunca escribir HTML de propuesta a mano.

Cada propuesta DEBE cumplir:

1. **Niveles diferenciados con claridad.** Los 3 paquetes no se distinguen por
   "más páginas" sino por un salto de valor:
   - Nivel 1 = estar online (presencia).
   - Nivel 2 = convertir (captar clientes / briefs / leads).
   - Nivel 3 = automatizar (motor de captación + seguimiento, valor recurrente).
   En `notaPaquetes` explicar la diferencia en una línea.

2. **Resultado por paquete** (`resultado`): cada paquete lleva una frase de
   resultado concreto, no solo qué incluye. Ej: "Convertís tu audiencia en briefs".

3. **Propuesta de valor** (`valor[]`): sección "Por qué te conviene" con el ROI
   real — automatización, conseguir más clientes, ahorro de tiempo, autoridad
   para cerrar cuentas más grandes. No vender "una web", vender resultado.

4. **Dominio + hosting a cargo del cliente**, a su nombre. Nunca en nuestro precio.

5. **Costos de terceros excluidos**: dominio, hosting, comisión pasarela,
   créditos IA, mensajería WhatsApp pagada, pauta.

6. **Add-ons especificados**: conexión redes, videos IA, cuidado web,
   pasarela — cada uno con setup y mensual.
   - **WhatsApp**: el botón click-to-chat va INCLUIDO en la web (simple). Lo que
     se cobra como add-on es el **chatbot IA** (responde, califica, deriva solo) —
     no confundir el botón gratis con el chatbot pago.

7. **Pricing**: cobrar la automatización y el resultado, no los píxeles. El
   margen vive en lo recurrente (Cuidado Web / GestiOS / videos). La web única se
   precia para cerrar y abrir el mensual. **Precio de lanzamiento vigente (fase
   sin portafolio, desde 2026-07-03): Landing 790 / Web Pro 1.500.** La línea
   premium (Landing 2,000 / Web Pro 4,500) es el objetivo con 3-5 casos en
   portafolio. Fuente de verdad:
   `hermes-content/propuestas/PRICING_RATIONALE_INTERNO.md` sección 0.

8. **Plantillas internas = confidencial.** Nunca decir al cliente que usamos
   plantillas. Objetivo: maximizar producción.

9. **No fabricar.** Si falta dato del cliente (brochure, sector), no inventar —
   pedirlo o marcarlo. Personalizar con datos reales (cartera, números, sector).

Docs internos de referencia: `PRICING_RATIONALE_INTERNO.md`,
`PLAYBOOK_CONSTRUCCION_INTERNO.md`, `ESTRATEGIA_PLANTILLAS_WEB_INTERNO.md`,
`BCP_PASARELA_CREDENCIALES_INTERNO.md`.

## Nada a medias — cerrar antes de abrir (REGLA)

> Sergio 2026-08-01: *"no dejar nada vacío... nunca arrancar algo nuevo sin concluir
> lo anterior"*. Nace de encontrar la capa multi-rubro **construida y apagada**
> (`PLATFORM_LAYER` vacío en producción): semanas de trabajo sin efecto.

- **Construido ≠ terminado.** Una función solo está hecha cuando está **encendida en
  producción y verificada ahí**. Un flag apagado, una migración sin aplicar, una rama sin
  mergear o un módulo que nadie llama **son trabajo con valor CERO**, no trabajo hecho.
- **Prohibido reportar como hecho lo que está detrás de un flag apagado.** Si queda
  apagado, se dice explícito y se dice por qué.
- **Antes de abrir un frente nuevo, se cierra el anterior** o se anota en el doc de
  parqueado con su estado exacto. Nada queda flotando en la conversación.
- **Al cerrar una sesión, dejar SIEMPRE el estado escrito:** qué quedó terminado y en
  producción, qué quedó a medias y dónde exactamente, y qué depende de Sergio. Si él abre
  otra sesión, tiene que poder retomar sin releer la conversación.
- **Antinorma:** dejar una cadena de cosas al 90% y reportar avance. Una función encendida
  vale más que cinco construidas.

## ONIA Core (REGLA)

> Fuente de verdad: `onia-core/contract.json` (beta v0.5.0, congelado para
> adopcion; ver `onia-core/CHANGELOG.md`). Docs canonicos en `onia-core/*.md`.
> Receta de instalacion en productos: `onia-core/ONIA_CORE_INSTALL_GUIDE_2026.md`.

> ⚠️ **2026-08-01 — el core NO es hoy la columna vertebral, es un catálogo que el producto
> copia a mano.** Verificado: el producto reimplementó la máquina de estados de work items
> con semántica DISTINTA · 4 de 9 módulos (`automation`, `imports`, `payroll`, `knowledge`)
> no existen en el producto · y `sync-onia-core.mjs` falló en silencio durante días, así que
> mejoras del core (el total en Bs del TCO que exige la RND 102600000026) nunca llegaron.
> **El rumbo es al revés: un rubro nuevo debe salir de ENCENDER capacidades del core, no de
> escribir código nuevo.** Ver `hermes-content/docs/ONIA_CORE_Y_MODULOS_ANALISIS_20260731.md`.

- **HAY UN SOLO PRODUCTO: Onia Platform** (repo `onia-platform`), que se vende con
  packs por rubro. `DentalGest`, `GestiOS`, `Ganadero OS` y `ProveeGest` **NO son
  productos ni marcas hermanas**: son nombres viejos de lo que hoy es un pack
  dentro de la plataforma. Prohibido generar material, propuestas o UI que los
  presente como productos aparte. Al cliente se le nombra el rubro ("modulo
  dental"), nunca una marca propia.
- ONIA Core es el nucleo operativo de esa plataforma unica. Vive SOLO en este
  repo hasta aprobar adopcion.
- `policy.installInProductRepos = false`: NO crear migraciones, rutas ni UI
  dependientes del core en los repos producto sin plan de adopcion aprobado.
- Todo cambio al contrato, schema o adapters DEBE pasar
  `npm run validate:onia-core` antes de commitear.
- Cada entidad nueva del core exige: entrada en `contract.json`, tabla en
  `schema/base-schema.sql` y mapeo en los 3 adapters (el validador lo bloquea).
- Clientes nuevos se mapean a un track vertical, nunca a un fork del core.
  Ver `onia-core/ONIA_CORE_CLIENT_ADOPTION_MAP_2026.md`.
- Integraciones externas (WhatsApp, SIAT, TR4) siguen `external_gate`: fuera
  del core, entran solo como intake normalizado (work items).
- Orden de encendido de rubros: dental (vivo) → comercio → importadora → el resto.
  Un rubro nuevo se ENCIENDE desde el core, no se escribe de cero.

## Git — Auto-sync multi-dispositivo (REGLA)

> Trabajamos desde varios dispositivos. Nada debe quedar como archivo local sin
> subir. Todo cambio se sincroniza solo a GitHub.

- Commits: conventional (`feat:`, `fix:`, `docs:`, `chore:`, etc.).
- **Auto-sync activado.** Al terminar cualquier trabajo, commitear y pushear los
  cambios a la rama actual sin que el usuario lo pida. Lo hace el hook `Stop`
  (`.claude/settings.json` → `node scripts/git-autosync.js`); también se puede
  correr a mano: `node scripts/git-autosync.js`.
- El autosync respeta `.gitignore`: nunca sube `.env`, claves, `*.pem`,
  `node_modules/` ni cachés. Si creás un archivo con secretos, asegurate de que
  esté ignorado antes de que el autosync corra.
- Assets, fotos, briefs y outputs SÍ se sincronizan (para tenerlos en todos los
  dispositivos).
- El autosync empuja la rama de trabajo y, además, hace **fast-forward de `main`**
  cuando es seguro (avance lineal). Así `main` queda al día solo y todos los
  dispositivos sincronizan con `git pull` en `main`. Si `main` divergió (no es
  FF), no fuerza nada: queda merge manual.
- **REGLA DURA — `main` SIEMPRE compila; nunca imports colgando en `main`.** Antes
  de hacer FF de `main`, si el avance toca `web-factory/apps/site/**`, el autosync
  corre `tsc --noEmit` en `apps/site`. Si no compila (ej. un árbol de rebuild a
  medio mergear que importa archivos que aún no llegaron), **NO avanza `main`**
  (la rama de trabajo igual se pushea; el WIP vive en su rama). Esto evita romper
  el deploy de Vercel y el auto-deploy del VPS que buildean `main`. Al terminar un
  carril de código, mergear a `main` como **un solo árbol coherente que compila**,
  nunca un subconjunto parcial. Los sync de docs/contenido no pagan tsc (sólo
  corre cuando el avance a main toca la app).

## Objetivo por sesión (REGLA)

> Definir el objetivo al inicio y NO terminar la sesión hasta perfeccionarlo y
> terminarlo. Especificarlo siempre para no descarrilar a otras cosas.

- **Una sesión de control, muchos subagentes.** Trabajar TODO desde una sola sesión
  orquestando subagentes; no abrir varias sesiones de chat en paralelo — a Sergio se
  le cruza la información y no se llega al objetivo.
- **Cada subagente aislado en su worktree/carril.** El subagente corre
  `git branch --show-current` primero y opera con worktree explícito; el orquestador
  (la sesión de control) mantiene el objetivo, el orden y el merge a `main`.
- **No pasar a otra cosa** hasta que el objetivo actual esté funcional y en `main`.

## Desarrollo en paralelo — carriles (REGLA)

> Trabajamos muchos frentes a la vez. El límite NO es el plan de Claude (Max) — el
> límite es el CHOQUE: mismos archivos, la rama `main`, o la infra única. Aislás
> eso y corrés TODOS los carriles no bloqueados en paralelo.

Fuentes (no duplicar; editar estas, no crear otras):
- **Arranque actual (foco + prompts, EMPEZAR AQUÍ): `hermes-content/docs/ONIA_PLAN_ARRANQUE_LIMPIO_20260718.md`.**
- Asignación + prompts copy-paste (histórico): `hermes-content/docs/ONIA_SESION_KICKOFFS_20260705.md`.
- Backlog e ítems (P/R/M/S): `hermes-content/docs/ONIA_PROXIMA_SESION_PLAN_20260705.md`.
- Dueño de archivos por carril: `COORDINATION_MANIFEST.md` (sección "Modelo de carriles").
- Stack de skills + reglas de subagentes: `hermes-content/docs/ONIA_SKILLS_STACK_Y_SUBAGENTES_20260705.md`.
  REGLA subagentes: uno por dominio de carril; nunca edita archivos de otro carril;
  research con fuentes citadas; mismos gates antes de mergear.

Carriles = 1 sesión = 1 worktree = 1 rama = 1 carpeta/repo:
- **A** `onia-center-saneamiento` → onia-hermes `src/app/onia-center/**` + `api/onia-center/**` (P2→P3)
- **B** `wf-landings` → onia-hermes landings `src/app`, `data/clients`, `templates`, `harvester` (P4, E*)
- **C** `propuestas-v2` → onia-hermes `hermes-content/propuestas` + docs/skills comercial (P1)
- **D** `producto` → repo **`onia-platform`** (la plataforma que se vende; antes decia
  "repo DentaGest", que NO EXISTE en el disco)
- **E** `gestios-core` → repo Gestios (legado; NO es un producto, ver la regla de marca arriba)
- **F** `bolivian-electric-fase1` → repo Bolivian Electric (R3)
- **G** `infra-deploy-n8n` → n8n/VPS/Supabase, SERIAL, un solo dueño (M1→M6)
- **H** `contenido-higgsfield` → onia-hermes `hermes-content/references` + skills(video/IG) + scripts(video/ig) + `.hermes/video-lab` (producción continua)
- **I** `research-estrategia` → onia-hermes `hermes-content/docs/research/**` (analizar productos ganadores + validar ventures; NO codea, entrega decisión)
- **J** `video-remotion` → onia-hermes `scripts/remotion`|`apps/video` (video programático React; distinto de H generativo)
- **K** `yt-canal` → onia-hermes `hermes-content/channels/onia-automatiza/**` (canal YT faceless "ONIA Automatiza" ES; reusa content-engine/Higgsfield sin editarlos, upload→handoff a n8n; plan en `docs/research/ONIA_YT_CANAL_ONIA_AUTOMATIZA_20260706.md`)
- **onia-center-rebuild** (carril A, sesión fresca) → el panel es un MONOLITO (~14k líneas en 4 archivos: page.tsx/operating-workspace.tsx/operating-source.ts/onia-center.css). NO rediseñar en su lugar (ningún agente puede con 14k líneas → se pierde y rompe). Reconstruir en componentes chicos (`src/app/onia-center/components/**`, ~100-200 líneas c/u) reusando la data (lib/onia-center-store + api/onia-center), AL LADO de prod, y swap al final. Conservar agentes Vendedor/Día + cola de aprobación.
- **docs-hygiene diaria** (carril infra) → `scripts/docs-hygiene.mjs` + cron diario: auto-borra SOLO duplicados de raíz IDÉNTICOS a su copia en `hermes-content/docs/`, flaggea el resto (divergentes/superseded) a Sergio por Telegram. Mantiene el repo ordenado para que las sesiones no se pierdan con docs viejos/duplicados. Regla: `hermes-content/docs/` es la fuente, la raíz sin gemelos.
- **L** `yt-ciencia-cuerpo` → onia-hermes `hermes-content/channels/ciencia-cuerpo/**` (canal YT faceless "La Ciencia de tu Cuerpo" ES, educativo/salud, CPM alto; reusa content-engine/Higgsfield sin editarlos; SALUD=YMYL: cero consejo médico, todo con fuentes, el foso es el guion; plan en `docs/research/ONIA_YT_CANAL_CIENCIA_CUERPO_20260707.md`)
- **Core** `onia-core` → `onia-core/**` (CONGELADO; solo bajo adopción aprobada)

Reglas duras:
- Repos distintos (`onia-platform`, Gestios, Bolivian Electric) = paralelo libre.
- Dentro de onia-hermes: cada carril su carpeta; **AVISAR** antes de tocar los 4
  raíz de web-factory (`next.config.ts`, `layout.tsx`, `globals.css`, `package.json`).
- Infra (G) = UN solo dueño a la vez.
- **`main` siempre debe compilar.** El auto-sync hace FF de `main`: nunca dejar que
  arrastre WIP parcial (si un archivo nuevo importa otro archivo nuevo, van los DOS
  o ninguno). Rebuild entra a `main` solo como merge COMPLETO con `tsc --noEmit`
  verde en `web-factory/apps/site` (ojo casing de imports: Linux distingue). `main`
  alimenta el deploy real (VPS) Y el Vercel `onia-center`; roto, rompe ambos y
  spamea "Failed preview deployment". Detalle + incidente ref:
  `COORDINATION_MANIFEST.md` → "no filtrar WIP parcial a main".
- Correr todo en paralelo; lo único que se estagia son DEPENDENCIAS reales, no cupo:
  P3 tras P2 · R5 tras R1 · M1 deploya tras A/C en main · M2 no re-publica el n8n
  `ONIADailyBrief001` hasta M1 · H publica IG tras token (S6).
- Terminar un carril: rama propia → `git rebase origin/main` antes de mergear →
  commits chicos por carpeta → gates (`tsc --noEmit`, `pnpm e2e` donde aplique,
  code-reviewer) → merge a main. Un ítem cierra cuando su código está en main (y en
  prod para los M-*).

Bloqueos humanos de Sergio (hacer apenas se pueda; destraban lo comercial): S1
precios, S2 NIT SIAT, S3 secret intake n8n, S4 columnas TR4, S5 Meta, S6 token IG,
S7 keys Tavily/fal, S8 fiscal, S9 password. Detalle en el plan maestro §(b).

## Cuándo separar un repo (REGLA)

> El cerebro va junto; los productos con cliente van aparte. Separás por dueño +
> ciclo de vida + acceso, NUNCA por cantidad ni por "ordenar el desorden".

- **Junto en onia-hermes:** el cerebro (`hermes-content`: docs, skills, memoria,
  propuestas), el core y la orquestación. Se lee a sí mismo (Hermes, agentes,
  memoria); fragmentarlo multiplica la sincronización manual (lección `onia-core`,
  que hubo que mergear a mano para que el producto lo leyera).
- **Separado (repo propio):** un producto SOLO cuando cumple las TRES — (1) cliente
  real, (2) deploy y ciclo de release propio, (3) el cliente NO debe ver el cerebro.
  Correctos hoy: `onia-platform` (la plataforma) y Bolivian Electric (cliente).
  Colaboradores = repo saneado `onia-hermes-collab` (separación por acceso).
  ⚠️ `Gestios` y `Ganaderos-Os` existen como repos pero **no son productos**: son
  legado del encuadre viejo de cuatro marcas. No se les agrega nada nuevo sin
  decidir antes si se archivan o se absorben como packs.
- **NO separar por sensación de desorden.** El cruce se arregla con disciplina de
  cierre (mergear + cerrar sesión) y el tablero de carriles, no partiendo repos.
- **Candidato futuro (no ahora):** sacar `onia-center` de `web-factory` cuando pese
  demasiado y ya no comparta packages — con motivo medible, no preventivo.

## Objetivo por sesión — no descarrilar (REGLA)

> Sergio 2026-07-20: separar el trabajo en muchas sesiones mezcla la información y se
> pierde el objetivo. Se orquesta desde UNA sesión de control con subagentes.

- **Definir el objetivo al inicio de cada sesión, escrito y explícito.** Todo lo que no
  sirve a ese objetivo se pospone (se anota como pendiente), no se hace.
- **No terminar la sesión hasta perfeccionar y terminar ese objetivo.** Nada a medias,
  nada de saltar a otra cosa.
- **Orquestar con subagentes desde la sesión de control** en vez de abrir muchas
  sesiones que se cruzan. Cada subagente trabaja en su worktree/carril con ruta
  explícita, verifica `git branch --show-current`, y hace gates + commit COHERENTES en
  su propio árbol (nunca mezcla árboles). El orquestador mantiene el objetivo, el orden
  y el merge a `main` tras revisar.
- Tareas del mismo carril (misma carpeta) → subagentes SECUENCIALES. Carriles distintos
  → en paralelo. Lo nuevo que aparezca se anota como pendiente y se retoma DESPUÉS.

## Velocidad — no tardar en lo simple (REGLA)

> Sergio 2026-07-22: "estás tardando demasiado en algo muy simple" (la UI del panel
> tomó 3 rondas porque shippeé genérico e iteré, en vez de usar el método de entrada).

- **Método correcto desde el PRIMER intento.** No shippear algo mediocre para iterar
  después. UI/diseño: cargar `impeccable` + registro producto + galería/tokens de
  web-factory ANTES de codear (ver [[web-factory-disenos-genericos]]); para diseño nuevo,
  aprobar un mockup rápido con Sergio y recién portar fiel (no rediseñar en el panel real
  a ciegas). Toda tarea: elegir la skill/subagente/herramienta correcta de entrada, no
  descubrirla a la 3ª ronda.
- **Paralelizar agresivo.** Lo independiente va en subagentes CONCURRENTES
  (dispatching-parallel-agents), nunca en serie: research, review, y frentes distintos al
  mismo tiempo. Serializar solo lo que comparte archivos/estado.
- **Decidir y actuar; menos ida y vuelta.** Minimizar investigación exploratoria y
  verificación redundante en lo de bajo riesgo. Verificación fuerte (tsc, prueba en vivo,
  gates) SOLO para lo que toca prod / plata / `main`. Lo reversible y de bajo riesgo:
  hacerlo y seguir.
- **No re-hacer lo aprobado.** Diseño o plan ya aprobado por Sergio = portar fiel, no
  reabrir. Guardar el mockup/decisión como fuente de verdad.
