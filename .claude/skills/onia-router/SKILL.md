---
name: onia-router
description: Invocar al INICIO de cualquier trabajo en el monorepo onia-hermes. Enruta la tarea a su carril (A-L, onia-core, infra) y nombra el stack exacto de skills, el subagente y los docs fuente a usar. Es el índice maestro y el punto de entrada para "qué skill/agente uso para X" en ONIA/Hermes.
---

# ONIA Router — stack de skills por carril

Punto de entrada de toda sesión en `onia-hermes`. Antes de trabajar: identificá el
carril, cargá su stack, respetá las reglas duras. Fuente viva del mapa completo:
`hermes-content/docs/ONIA_SKILLS_STACK_Y_SUBAGENTES.md`.

> 📇 **Mapa problema → skill: [`STACK-POR-DOMINIO.md`](STACK-POR-DOMINIO.md).**
> Hay **116 carpetas en `~/.claude/skills/`** (contado el 20-oct; plugins: `claude plugin list`; el 2026-09-29 se sacaron las que no
> usaban ni Claude ni Codex; ver el historial de la limpieza). Esta tabla enruta por carril; ese
> archivo enruta por dominio (contenido/marketing · diseño/UI/UX · frontend · backend ·
> seguridad · research · proceso), que es como aparecen las tareas en la práctica.
> **Abrirlo antes de escribir la primera línea.**

> ♻️ **Restauración 2026-10-02 — la limpieza del 29-sep se revirtió en el repo.** Sergio
> Urcullo: con lo borrado, sus archivos dejaron de editarse como él quiere. Volvió todo lo que
> se borró de `.claude/skills/`, `.agents/skills/` y `hermes-content/skills/`, más los agentes
> `onia-core-guardian` y `onia-creative-radar` (copia: commit `9622ae6a`).
> **HyperFrames vuelve a vivir en el repo** (`hyperframes`, `-core`, `-cli`, `-animation`,
> `-creative`, `-keyframes`, `-registry`, `media-use`, `motion-graphics`, `talking-head-recut`,
> `embedded-captions`, `general-video`, `slideshow`, `remotion-to-hyperframes` y las plantillas
> de video). ⚠️ Corregido el 26-oct: acá decía que esa copia manda porque una skill del proyecto
> gana sobre una global con el mismo nombre, y es al revés. En Claude Code gana la PERSONAL
> (`~/.claude/skills`): se midió con la descripción cargada de `hyperframes`. Hasta archivar las
> personales que difieren (`ONIA_HARNESS.md` §8), un arreglo en la copia del repo no llega a la PC. **No** volvieron los 6 agentes de `_retirados/` (retirados el
> 18-ago). Detalle: `hermes-content/docs/historial/LIMPIEZA_SKILLS_20260929.md`.

## Cómo usar
1. **Identificá el carril** de la tarea (tabla abajo). Ante duda, ver
   `CLAUDE.md` §4 "Carriles (REGLA)" y `COORDINATION_MANIFEST.md`.
2. **Cargá el stack de proceso común** (siempre) + las skills del carril.
3. **Delegá en subagentes** (`general-purpose`/`Explore`; `onia-crm-prospeccion` para prospección)
   cuando la tarea tiene fan-out o varios ángulos.
4. **Respetá los gates** antes de mergear a `main`.

## Stack de proceso común (TODA sesión, cualquier carril)
**Corrección 2026-10-09:** cargar primero `equipo-de-agentes` (roles y loop) y
`aprender-de-todo` (referencias, 12 dimensiones y prueba de uso), también en Codex.
Las herramientas siguientes se aplican según la tarea; no iniciar orquestadores (orquestan
Hermes y `scripts/orquesta/`, 19-oct) ni ejecutar Git fuera del encargo recibido.

`using-superpowers` · `brainstorming` (antes de construir) · `make-plan`/`writing-plans` ·
`test-driven-development` · `systematic-debugging`/`investigate` (bugs: no adivinar la causa) ·
`verification-before-completion` · `code-review` · `security-review` ·
`dispatching-parallel-agents` · `using-git-worktrees` · memoria vía `claude-mem`.

## Las 4 áreas de Onia (26-oct-2026)

Sergio Urcullo, 26-oct: Onia se ordena en **4 áreas**. Una fila por área; lo primero que se carga va primero. Los
carriles de la orquesta (`scripts/orquesta/carriles.json`) **no se renombran** (tienen labels y tests): se mapean a
un área. Sus trabajadores leen lo suyo en `leer`; esta tabla es para las sesiones. Cuándo usar cada agente:
`.claude/agents/README.md`. Lo marcado *PC* (`agent-browser`, MCP `exa`, plugin `claude-security`, `code-review-spec`,
`diagnosing-bugs`, `next-dev-loop`, `prisma-cli`, `diagram-design`) vive solo en la PC: una sesión o un trabajador de
la nube no lo tiene. Lo viejo de cada área está en `hermes-content/docs/historial/` (skills sueltas en
`historial/skills/`): se consulta como historia, no se usa como regla.

| Área | Carriles de la orquesta | Skills (en orden) | Agentes | Docs fuente | No usar |
|---|---|---|---|---|---|
| **Marca personal** (contenidos, guiones, carruseles, videos y edición de Sergio Urcullo) | `marca` · `video` | `diseno-contenido-onia` · `edicion-referentes` (todo video nuevo) · `hyperframes` (entrada de video) · `editor-videos` · `ver-videos` · `embedded-captions` · `motion-doctrine` · `talking-head-recut` · `sacar-prompt` · `copywriting` · `humanizer` · `higgsfield-generate` (con la regla de gasto) · `aprender-de-todo` (referencias). Skills-doc: `hermes-content/skills/guiones-diarios-onia.md`, `marca-personal-sergio.md`, `carruseles-onia.md`, `historias-onia.md`, `video-lab-higgsfield.md` | `onia-creative-radar` | `handoff/marca-personal.md` · `ONIA_ESTRUCTURA_PUBLICACION_DIARIA.md` · `ONIA_MOTOR_SEMANAL_CONTENIDO.md` · `ONIA_MAPA_DE_TEMAS.md` · `HIGGSFIELD_VIDEO_SYSTEM.md` · `SERIE_CLAUDE_CODE.md` · regla de gasto de `CLAUDE.md` §Higgsfield | La marca de la web de Onia (es otra) · «usted» (acá es vos) · publicar sin su OK con captura · Remotion (jubilado) · copia personal de HyperFrames o `ver-videos` con el mismo nombre (le gana a la del repo) |
| **Workshops y comunidad** (talleres, comunidad, imán del taller) | `comunidad` | Cuartitos de la orquesta (`scripts/orquesta/cuartitos/`): `community-marketing` · `lead-magnets` · `onboarding` · `copywriting` · `humanizer`; `diseno-contenido-onia` para las piezas. Todavía no hay una skill propia del área | `general-purpose` | `TALLER_31_OCT.md` (fuente única del taller) · `handoff/comunidad.md` · `comunidad/ESTADO_COMUNIDAD.md` · `ONIA_COMUNIDAD_QUE_LA_HACE_VALER.md` · `ONIA_COMUNIDAD_CONTENIDO.md` · `ONIA_COMUNIDAD_BIBLIOTECA.md` | Precios o promesas que no salgan de sus fuentes · material para vendedores · cobrar sin el OK de Sergio Urcullo |
| **Onia Platform** (el producto y sus packs por rubro, el chatbot add-on, ventas y pauta del producto, propuestas, web de venta, SIAT del producto) | `plataforma` | Las 6 `onia-*` de su repo (obligatorias) · `onia-core` · `onia-chatbot` · `onia-contabilidad-bolivia` (SIAT del producto) · `onia-ventas-pauta` · `onia-propuestas` (generador, nunca HTML a mano) · `onia-web-factory` (web de venta) · `impeccable` si hay UI · `next-dev-loop` *PC* · `prisma-cli` *PC* · `diagnosing-bugs` *PC* · `test-driven-development` · `verification-before-completion` · `code-review-spec` *PC* · `ad-creative` · `competitor-profiling` | `code-reviewer` antes de cada PR · `security-reviewer` si toca auth, input, SQL o pagos · `typescript-reviewer` · `database-reviewer` · `onia-core-guardian` · `e2e-runner` · `onia-crm-prospeccion` · `onia-creative-radar` (piezas de pauta) | `ONIA_CATALOGO_DE_VENTA.md` · `ONIA_CLIENTE_IDEAL.md` · `ONIA_ADQUISICION_Y_PAUTA.md` · precios en `subscription-plans.ts` y `pricing.ts` · `ONIA_PLAN_1.0_Y_CAJA.md` · `ONIA_V1_ALCANCE.md` · `ONIA_FACTURACION_ESTADO_REAL.md` · `ONIA_ADDONS.md` · `handoff/codex-continuar-1.0.md` · `handoff/mercado-y-pauta.md` · skill `onia-deploy` para publicar | Skills genéricas de backend o DB cuando una `onia-*` cubre el tema · Playwright MCP · agentes `market-*` · material para vendedores · pack `referentes` (es de marca personal) · docs de precios o pauta con fecha (están en `historial/`) |
| **Otros** (infra, VPS, Hermes, orquesta, investigación, fiscal propio, Lucía, clientes de web-factory, Bolivian Electric) | `investigacion` | `onia-infra` · `onia-hermes-jarvis` · `orca` · `panel-onia` · `n8n-*` · `docker-patterns` · `deployment-patterns` · `aprender-de-todo` · `deep-research` · `exa-search` con el MCP `exa` *PC* · `competitor-profiling` · `onia-contabilidad-bolivia` (fiscal propio) · `higgsfield-soul-id` (Lucía) · `web-factory-design-research` y `web-factory-intake-assets` (clientes de web) · `diagram-design` *PC* | `security-reviewer` · `general-purpose` · `Explore` · `loop-operator` · `harness-optimizer` | `ONIA_HARNESS.md` (mapa vigente) · `ONIA_ESTRATEGIA_DE_EMPRESA.md` · `AI_MODEL_ROUTING_2026.md` · `handoff/hermes-local.md` · `handoff/hermes-jarvis.md` · `handoff/orquesta.md` · `scripts/orquesta/README.md` · `LUCIA_COMO_SE_USA.md` · `ONIA_FECHAS_CRITICAS_PLAN.md` · `research/competencia/PRODUCTO_COMPETENCIA_RESUMEN.md` | `onia-sesion-madre` (historia) · secretos dentro de un nodo de n8n · el token de Max en Hermes · el kanban de Hermes, Orca Orchestration o `hermes-content/docs/cola/` como cola · scrapers nuevos (Crawl4AI del VPS ya resuelve) |

**Cómo se instala una skill sin romper nada (medido el 20-oct):**
- `npx skills add <repo> -g` guarda la copia en `~/.agents/skills`, que en esta PC es un enlace a
  `.agents/skills/` del repo: ensucia el repo. Usar `-g -a claude-code --copy -s <skill>` con `DISABLE_TELEMETRY=1`,
  y comprobar después `git status .agents`.
- Antes de instalar, mirar si el nombre ya existe en `~/.claude/commands/` o en una skill: dos con el mismo nombre se
  pisan (por eso `code-review` de mattpocock quedó como `code-review-spec`).
- Repos gigantes (`vercel/next.js`): no clonar; bajar solo la carpeta con `gh api repos/<o>/<r>/contents/<ruta>`.
- Cambiar el registro de un plugin (`claude plugin configure`, archivos de estado) lo frena el control de permisos:
  queda para Sergio Urcullo, con el comando exacto.

## Mapa carril → stack + subagente

| Carril / Proyecto | Skills núcleo | Subagente | Skill ONIA propia |
|---|---|---|---|
| **Referencia recibida** (link, reel, post, web, app, captura, audio o documento) | **`aprender-de-todo` primero**; link sin instrucción = aprender, no producir; después las skills por dimensión | Codex para ficha/síntesis con evidencia; revisión del carril | `aprender-de-todo` |
| **A** onia-center (panel Next.js) | `impeccable` `ui-ux-pro-max` `taste-design` `frontend-design:frontend-design` `frontend-patterns` `react-components` `shadcn-ui` `ui-styling` `nextjs-turbopack` `design-review` `emil-design-eng` | — | `onia-web-factory` |
| **B** wf-landing (landings cliente) | `impeccable` `taste-design` `design`/`design-md` `image-to-code` `98669c11ca63:web-artifacts-builder` `landing-report` `land-and-deploy` `imagegen-frontend-web` `banner-design` `design-dna` (teardown de referencia → JSON de tokens/estilo/efectos; tipografía SIEMPRE verificada contra el CSS real, no a ojo) `gsap-*` (plugin oficial GreenSock, scrollytelling) | — | `onia-web-factory` |
| **C** propuestas (comercial) | `article-writing` `make-pdf` `slides` `document-generate` `brand` | — | `onia-propuestas` |
| **D** DentaGest · **E** GestiOS *(repos aparte)* | `database-migrations` `postgres-patterns` `backend-patterns` `api-design` `security-review` | — | `onia-core` |
| **F** Bolivian Electric *(prospecto REAL desde 2026-08-24 — 10 puestos relevados, ver handoff)* | mismo stack backend | — | `onia-core` |
| **chatbot** (motor, guion, conocimiento, voz) | **cargar `onia-chatbot`** — ese archivo nombra el stack completo del carril | — | `onia-chatbot` |
| **hermes-jarvis** (Hermes, Telegram de Sergio Urcullo, su calendario, pedidos a Claude) | **cargar `onia-hermes-jarvis`** — método, trampas y pruebas del carril; estado en `handoff/hermes-jarvis.md` | — | `onia-hermes-jarvis` |
| **panel-onia** (mod de la app de Claude: sesiones, cola de la orquesta, nube, PC, Hermes y uso en vivo) | **cargar `panel-onia`** — el mod vive fuera del repo (`~/.claude/onia-mods/panel-onia`); la app corre la copia del cache: cambio = subir versión + 3 comandos (20-oct) | — | `panel-onia` |
| **G** infra / n8n | `n8n-workflow-patterns` `n8n-mcp-tools-expert` `n8n-node-configuration` `n8n-code-javascript` `n8n-validation-expert` `docker-patterns` `deployment-patterns` | — | — |
| **H** contenido · **J** video-remotion | **`diseno-contenido-onia` primero** (índice de imágenes, galería, packs y patrones) · **`edicion-referentes` para todo video nuevo de Sergio Urcullo** (Santiago Muñoz / Erik Taveras por sus mecanismos medidos (sin copiar identidad ni guion), desde el 3-oct) · `editor-videos` `ver-videos` `sacar-prompt` `hyperframes` `banner-design` `brand` + Higgsfield MCP | — | — |
| **I** research/estrategia | `deep-research` `exa-search` `iterative-retrieval` `office-hours` | — | — |
| **K** yt-canal/meta-ads · **L** yt-ciencia-cuerpo | `article-writing` `deep-research` (L=salud/YMYL: fuentes obligatorias) + video stack | — | — |
| **onia-core** | `database-migrations` `postgres-patterns` `api-design` `backend-patterns` `verification-loop` | — | `onia-core` |
| **Ventas y pauta** (prospectos con señal, leads, demo, objeciones, Meta Ads, piezas A1/A2/G1-G5 y VSL) | **cargar `onia-ventas-pauta` primero** (método medido, trampas y fuentes; §9 = anuncio que vende y VSL de punta a punta) · `diseno-contenido-onia` para las piezas · `editor-videos` para las de persona | `onia-crm-prospeccion` | `onia-ventas-pauta` |
| **comercial/CRM** | `deep-research` (prospección con señal) | `onia-crm-prospeccion` | `onia-propuestas` |
| **fiscal / contable (propio + features ERP)** | `deep-research` (validar RND/DS vigentes) | — | `onia-contabilidad-bolivia` |
| **competencia por dentro** (cómo funcionan los programas rivales) | Leer primero `hermes-content/research/competencia/PRODUCTO_COMPETENCIA_RESUMEN.md` (1-oct: Dentalink, Doctocliq, TuDoc, AgendaPro, Citalo). Método que funcionó: centros de ayuda públicos + capturas Playwright; YouTube y Zendesk privado NO abren desde la nube (videos desde la PC); cuentas de prueba solo desde la PC (piden código al WhatsApp de Sergio Urcullo) | — | — |
| **orquesta** (repartir trabajo autónomo en los 5 carriles: plataforma, marca, comunidad, video, investigación; cada uno cae en un área de la tabla de arriba) | Pedir con un issue `orquesta` + `carril:<área>` y un «hecho cuando»; el programa fijo `scripts/orquesta/orquesta.mjs` elige modelo por tabla, corre en worktree y verifica. Desde el 19-oct **orquestan Hermes (planifica) y este programa (reparte)**: GitHub Actions corre marca, comunidad e investigación con el token de Max; la PC, video y plataforma. Método y por qué: `scripts/orquesta/README.md` y `hermes-content/docs/research/harness-orquestacion-autonomia.md` (v3). Trampa medida: el control de permisos bloquea a una sesión lanzar trabajadores autónomos («Create Unsafe Agents»); la pasada la corren Actions o la tarea programada de Windows, no una sesión | — | — |
| **extracción web** (alta por URL · prospección) | **NO instalar scrapers nuevos** (ScrapeGraphAI evaluado y descartado). Crawl4AI del VPS + LiteLLM ya resuelven: `scripts/alta-por-extraccion.py`. Doc: `hermes-content/docs/platform/ONIA_EXTRACCION_WEB_DECISION.md` | `onia-crm-prospeccion` | — |

## Reglas duras que aplican SIEMPRE (de CLAUDE.md)
- 🎯 **Antes de elegir carril, leer `hermes-content/docs/ONIA_ESTRATEGIA_DE_EMPRESA.md`.**
  Dice cuál es la **etapa vigente** del negocio y su criterio de salida numérico. Una tarea que
  no sirve a esa etapa **se anota como pendiente y NO se hace** — por buena que sea. Ahí está
  también la respuesta medida a "¿necesitamos financiación / equipo de desarrollo?" (no: el
  break-even son 5 clientes), y por qué **abrir una línea de negocio nueva es la decisión más
  cara disponible** con una sola persona.
- **Objetivo único por sesión.** Definirlo al inicio; no descarrilar; terminarlo antes de cerrar.
- **Carriles = 1 sesión = 1 worktree = 1 rama.** Un subagente nunca edita archivos de otro carril.
  Quien lo lanzó verifica rama y ruta antes de integrar; en encargos Codex sin Git,
  el ejecutor comprueba solo la ruta y entrega para revisión (corrección 2026-10-09).
- **`main` SIEMPRE compila.** Si el avance toca `web-factory/apps/site/**`, `tsc --noEmit` verde
  antes de FF de `main`. Nunca filtrar WIP parcial (import a archivo nuevo → van los dos o ninguno).
- **Git según rol y encargo (corrección 2026-10-09):** Codex entrega a quien lo lanzó;
  no ejecuta Git si el encargo lo prohíbe. No asumir autosync activo ni usarlo para
  publicar trabajo parcial. Lo revisado entra por PR; lo que ve un cliente o el público
  espera el OK de Sergio Urcullo con captura (`CLAUDE.md` §«Qué se publica sin preguntar», 19-oct).
- **Usted** con clientes, en la web y en los anuncios; marca personal, vos (19-oct).
  **Rubros:** dental → importadora → el resto (29-sep, confirmado el 19-oct).
- **Auto-sync activado** (hook Stop `scripts/git-autosync.js`): commitear y pushear la rama al terminar;
  respeta `.gitignore`. **`main` solo por PR revisado** desde el 5-oct: el hook mueve `main` únicamente en la
  sesión principal (antes «madre», `ONIA_AUTOSYNC_MAIN=1`) y el integrador (`ONIA_LOOP_ID=onia-cola`).
- **Autonomía máxima:** MCP → CLI/API → skill → script → recién ahí preguntar.
- **Gasto (actualizado 2026-10-09):** seguir `CLAUDE.md` §Higgsfield: pruebas pequeñas
  de imagen autorizadas el 8-oct, cotizadas y registradas, sin fraccionar lotes.
  Video, Soul, lotes grandes, cara/voz y plataformas nuevas conservan sus permisos.
  Los costos históricos no prueban precio ni saldo actual.
- **Bolivia:** todo desarrollo acomodado a Bolivia con contaduría boliviana específica y vigente;
  validar con research (fuente citada) antes de codear temas de Bolivia.

## Skills del repo (65 en `.claude/skills/` + 30 en `.agents/skills/`, contadas el 26-oct)
- **Aprendizaje transversal (2026-10-09):** `aprender-de-todo` — ficha por dimensión,
  destino canónico y prueba de aplicación.
- **Índice y operación:** `onia-router` (este índice) · `onia-continuidad` (arranque y rumbo de
  sesión) · `onia-infra` (VPS, Docker, n8n por SSH) · `onia-hermes-jarvis` (Hermes por Telegram:
  resumen, cierre, aduana, calendario, pedidos a Claude, y el workflow hermes-jarvis; 2026-10-01) ·
  `equipo-de-agentes` (el método: Codex, verificadores Haiku; corregido el 19-oct: orquestan Hermes y `scripts/orquesta/`) ·
  `onia-sesion-madre` (historia desde el 19-oct: `hermes-content/docs/historial/skills/onia-sesion-madre/SKILL.md`) · `orca` (tablero LOCAL de agentes en la PC: qué ve y qué no, ajustes a
  corregir; no ve la nube ni es la madre; 2026-10-16) · `panel-onia` (el Panel ONIA, mod de la app
  de Claude: dónde vive, cómo se publica un cambio, de dónde lee cada sección; 2026-10-20).
- **Producto:** `onia-core` · `onia-chatbot` · `onia-contabilidad-bolivia`.
- **Venta:** `onia-propuestas` (generador oficial, nunca HTML a mano) · `onia-web-factory`.
- **Contenido y video:** `diseno-contenido-onia` (índice de diseño) · `edicion-referentes` (el molde de edición de los videos de Sergio Urcullo: recetas medidas de Santiago Muñoz y Erik Taveras + scripts) · `editor-videos` ·
  `ver-videos` · `sacar-prompt` · `higgsfield-generate` · `higgsfield-soul-id` ·
  `motion-doctrine` con sus rutas `cut-the-curve` `oversized-cursor` `seam-craft`
  `captions-overlay` (upstream HeyGen que no está en la copia global).
- **HyperFrames (restaurado 2026-10-02; en Claude Code la copia personal le gana mientras exista, ver arriba):** `hyperframes` (entrada
  obligatoria de todo video) · `hyperframes-core` · `-cli` · `-animation` · `-creative` ·
  `-keyframes` · `-registry` · `media-use` · `motion-graphics` · `talking-head-recut` ·
  `embedded-captions` · `general-video` · `slideshow` · `remotion-to-hyperframes` · plantillas
  `changelog-video` `faceless-explainer` `figma` `music-to-video` `pr-to-video`
  `product-launch-video`.
- **Codex (`.agents/skills/`):** `impeccable` · `embedded-captions` (gate de ortografía que cita
  `editor-videos`) · `media-use` (librería de SFX por defecto de `editor-videos/scripts/sfx.mjs`:
  **no borrar**) · `higgsfield-generate` · `higgsfield-soul-id` · `motion-doctrine` con
  `cut-the-curve` `oversized-cursor` `seam-craft` `captions-overlay` · `web-factory-design-research`
  · `web-factory-intake-assets` · y la misma copia de HyperFrames que `.claude/skills/`
  (restaurada 2026-10-02).
