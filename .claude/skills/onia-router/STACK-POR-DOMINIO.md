# Stack de skills por dominio — qué agarrar y cuándo

> Complemento de `SKILL.md`, que mapea **carril → stack**. Esto mapea **problema → skill**,
> que es como aparecen las tareas en la práctica.
>
> **Por qué existe:** el 2026-08-16 Sergio marcó que hay **196 skills globales + 9 plugins**
> instaladas y que yo estaba usando **cero**. El índice existía; lo que faltaba era
> granularidad en contenido/diseño y el reflejo de mirarlo antes de empezar.

> 🧹 **Podado 2026-09-29:** se sacaron las globales sin uso real en 30 días (Claude **y** Codex)
> y sin plan que las nombre. Lista, motivo y cómo reinstalar cada una:
> `hermes-content/docs/historial/LIMPIEZA_SKILLS_20260929.md`.

**Regla de uso:** antes de escribir la primera línea de cualquier tarea, buscá el dominio acá
y cargá las 2-3 skills de la fila. No las 10 — las que aplican.

> ⚠️ **Existe un segundo ruteo y NO es el mismo:**
> `hermes-content/references/video-intake/SKILLS_DEL_CARRIL.md` (rama
> `claude/analizar-reels-videos-67f762`, todavía sin mergear).
>
> | | Responde a |
> |---|---|
> | **ese** | *"estoy analizando un video — ¿qué skill cargo según el TEMA del video?"* |
> | **este** | *"voy a hacer X trabajo — ¿qué skill cargo según el DOMINIO?"* |
>
> Se escribieron el mismo día sin saber uno del otro. Solapan ~60% de los nombres. **Al
> editar uno, mirar el otro** — si vuelven a divergir, se fusionan y queda uno solo.

---

## 1. Contenido con IA — marketing e influencers

Es donde más trabajamos y donde el router tenía solo 5 skills. Ahora está desglosado por lo
que uno realmente va a hacer.

### 1.1 Antes de producir: qué decir y a quién

| Cuándo | Skills |
|---|---|
| Definir el plan de contenido de una cuenta | `content-strategy` · `social` |
| Ver qué hace la competencia | `competitor-profiling` · `competitors` |
| Armar la oferta o el precio de la pieza | `pricing` |

### 1.2 Escribir

| Cuándo | Skills |
|---|---|
| Copy de anuncio, caption, headline | **`onia-ventas-pauta` §9 primero** (anuncio que vende y VSL, de punta a punta; está en el repo y la nube la ve) · `copywriting` · `ad-creative` (copiadas al repo el 10-oct) |
| Pulir un texto que ya existe | `copy-editing` · `writing-guidelines` |
| Artículo, guion largo, documento | `article-writing` |
| Recurso descargable a cambio de un dato | `lead-magnets` |

> **En la nube (10-oct-2026):** las skills de este mapa que están en `.claude/skills/` del repo, la nube las ve. Estas
> siguen **solo en la PC** (`~/.claude/skills/`) y una sesión de la nube no las carga; si una tarea las necesita, se
> la pide a la madre (`CLAUDE.md` «Sesión MADRE»), no se improvisa de memoria: `ads` · `agentic-engineering` ·
> `analytics` · `architecture-decision-records` · `article-writing` · `autonomous-loops` · `banner-design` · `brand` ·
> `brandkit` · `browse` · `caveman-review` · `click-path-audit` · `codebase-onboarding` · `community-marketing` ·
> `competitors` · `context-budget` · `context-restore` · `context-save` · `continuous-agent-loop` · `copy-editing` ·
> `cost-aware-llm-pipeline` · `design` · `design-consultation` · `design-dna` · `design-html` · `design-md` ·
> `design-review` · `devex-review` · `document-generate` · `documentation-lookup` · `e2e-testing` · `emil-design-eng` ·
> `exa-search` · `frontend-patterns` · `image-to-code` · `imagegen-frontend-web` · `industrial-brutalist-ui` ·
> `investigate` · `iterative-retrieval` · `lead-magnets` · `make-pdf` · `make-plan` · `minimalist-ui` ·
> `n8n-code-javascript` · `n8n-expression-syntax` · `n8n-node-configuration` · `n8n-validation-expert` ·
> `nextjs-turbopack` · `qa` · `react-components` · `review` · `shadcn-ui` · `slides` · `social` · `supabase` ·
> `supabase-postgres-best-practices` · `taste-design` · `ui-styling` · `ui-ux-pro-max` · `writing-guidelines`.
> Las de plugin que nombra el mapa (`caveman`, `ponytail`, `gsap-skills`, `claude-mem`, `skill-creator`,
> `pdf`/`docx`/`pptx`/`xlsx`) no se verificaron: no se sabe si la nube las carga.

### 1.2-bis 🔴 Los bancos de patrones — se abren ANTES que la skill

El conocimiento de qué funciona **ya está escrito y medido**. Abrir la skill sin leer el banco
es opinar cuando hay datos:

| Pieza | Banco |
|---|---|
| carrusel / estático | `web-factory/docs/CAROUSEL_PATTERN_BANK_2026.md` |
| video · Lucía | `web-factory/docs/LUCIA_PATTERN_BANK_2026.md` |
| pauta | `web-factory/docs/ADS_PATTERN_BANK_2026.md` |
| movimiento | `web-factory/docs/MOTION_PATTERN_BANK_2026.md` |

Cada uno cierra con **"lo que sigue sin resolver"**: ahí está el trabajo pendiente real.

### 1.3 Imagen y pieza gráfica

| Cuándo | Skills |
|---|---|
| Carrusel, placa, estático | `banner-design` · `brand` · `brandkit` · `design-dna` |
| Generar imagen para web/mobile | `imagegen-frontend-web` |
| Convertir una referencia visual en código | `image-to-code` |
| Definir el sistema visual de una marca | `design-dna` |

### 1.4 Video

| Cuándo | Skills |
|---|---|
| Video en general / edición | skills propias `editor-videos` · `ver-videos` |
| Motor HTML→MP4 | `hyperframes*` (copia global `~/.claude/skills`; flujo que falte: `npx hyperframes skills update <nombre>`) |
| **Juzgar el movimiento y la continuidad entre planos** | `motion-doctrine` · `cut-the-curve` · `seam-craft` (propias) |
| Reconstruir un componente desde fotogramas | `image-to-code` |

**Generativo (Higgsfield):** no es skill, es MCP. Tarifario medido y las 3 vías
(`start_image` · `image_references` · `video_extension`) en
`references/modelos/lucia/prueba-lipsync-20260815/LEEME.md`.

### 1.5 Distribución y medición

| Cuándo | Skills |
|---|---|
| Pauta | `ads` |
| Comunidad | `community-marketing` |
| Medir si sirvió | `analytics` |

---

## 2. Diseño · UI · UX

| Cuándo | Skills |
|---|---|
| **Antes de codear cualquier UI** (regla de la casa) | `impeccable` · `ui-ux-pro-max` · `taste-design` |
| Revisar un diseño ya hecho | `design-review` |
| Explorar direcciones / armar el sistema de diseño | `design-consultation` |
| Escribir el diseño como spec | `design-md` · `design` · `design-html` |
| Dirección estética concreta | `minimalist-ui` · `industrial-brutalist-ui` |
| Componentes | `shadcn-ui` · `react-components` · `ui-styling` |
| Ingeniería de diseño fina | `emil-design-eng` |

⚠️ Regla ya escrita y ya incumplida una vez: **cargar `impeccable` + galería/tokens ANTES de
codear**, no descubrirlo a la tercera ronda. Ver la memoria *web-factory-disenos-genericos*
(memoria, no skill).

---

## 3. Frontend

| Cuándo | Skills |
|---|---|
| Patrones generales | `frontend-patterns` · `react-components` |
| Next.js | `nextjs-turbopack` |
| Animación | `gsap-skills` (plugin) |

---

## 4. Backend · datos · infra

| Cuándo | Skills |
|---|---|
| Diseñar API | `api-design` · `backend-patterns` |
| Postgres | `postgres-patterns` · `supabase` · `supabase-postgres-best-practices` |
| Migraciones | `database-migrations` |
| Contenedores y deploy | `docker-patterns` · `deployment-patterns` |
| n8n | `n8n-workflow-patterns` · `n8n-node-configuration` · `n8n-expression-syntax` · `n8n-code-javascript` · `n8n-validation-expert` · `n8n-mcp-tools-expert` |
| Costo de LLM en pipeline | `cost-aware-llm-pipeline` · `context-budget` |

---

## 5. Seguridad y calidad

| Cuándo | Skills |
|---|---|
| **Antes de commitear algo que toca datos, auth o plata** | `security-review` |
| Revisión de código | `code-review` · `review` · `caveman-review` · agente `code-reviewer` |
| Testing | `qa` · `e2e-testing` · `click-path-audit` |
| Experiencia de desarrollador (docs, CLI, onboarding) | `devex-review` |
| Verificar antes de decir "listo" | `verification-loop` |
| Onboarding a un repo desconocido | `codebase-onboarding` · `investigate` |

⚠️ `verification-loop` es la que corresponde al loop que Sergio pide a mano.
**Cargarla en vez de improvisar el loop.**

---

## 6. Investigación

| Cuándo | Skills |
|---|---|
| Research a fondo con fuentes | `deep-research` · `iterative-retrieval` · `exa-search` |
| Navegar / scrapear | `browse` · navegador integrado (MCP) · Crawl4AI del VPS (`scripts/alta-por-extraccion.py`) |
| Buscar en memoria | `claude-mem:mem-search` (plugin) |
| Consultar docs de librería | `documentation-lookup` |

---

## 7. Proceso y orquestación

| Cuándo | Skills |
|---|---|
| Planificar antes de construir | `make-plan` |
| Agentes en paralelo / loops | `autonomous-loops` · `continuous-agent-loop` · `agentic-engineering` |
| Contexto entre sesiones | `context-save` · `context-restore` |
| Registrar decisiones de arquitectura | `architecture-decision-records` |
| Crear o auditar skills | `skill-creator` |
| Entregables de oficina | `docx` · `xlsx` · `pptx` · `pdf` · `make-pdf` · `slides` · `document-generate` |

---

## 8. Dónde vive cada skill (no todas están en el mismo lado)

Buscarlas en un solo directorio da falsos negativos — pasó al verificar este archivo.

| Origen | Dónde | Ejemplos |
|---|---|---|
| Globales del filesystem | `~/.claude/skills/` (**110**) | `impeccable` · `copywriting` · `security-review` |
| Del proyecto | `.claude/skills/` (**42**) | `onia-router` · `ver-videos` · `editor-videos` |
| Plugins | `~/.claude/plugins/cache/` (**9**) | `gsap-skills` · `caveman` · `ponytail` |
| De claude.ai | no están en disco — se listan con `ListSkills` | `docx` · `xlsx` · `pptx` · `pdf` · `skill-creator` · `abogado-del-diablo` |
| HyperFrames | **el repo** (`.claude/skills/` y `.agents/skills/`, restaurado 2026-10-02; gana sobre la copia global) | `hyperframes` · `talking-head-recut` · `embedded-captions` |

## 9. Lo que NO es skill y se confunde

| Capacidad | Dónde vive |
|---|---|
| Higgsfield (imagen/video generativo) | MCP |
| Meta Ads · Biblioteca de Anuncios | MCP |
| Supabase · Vercel · n8n · Cloudflare · Notion · Figma · Drive · Gmail · Calendar | MCP |
| ElevenLabs | API REST desde el VPS (no hay MCP) |
| HyperFrames | skills del repo `.claude/skills/hyperframes*` (restaurado 2026-10-02) |

---

## 10. Antinorma

**Listar la skill en un doc no es usarla.** Este archivo existe porque el mapa de carriles ya
estaba escrito, era correcto, y aun así se trabajó una sesión entera sin abrir una sola skill.
El paso que falta no es documentar: es **cargar la fila del dominio antes de empezar**.
