# Stack de skills por dominio — qué agarrar y cuándo

> Complemento de `SKILL.md`, que mapea **carril → stack**. Esto mapea **problema → skill**,
> que es como aparecen las tareas en la práctica.
>
> **Por qué existe:** el 2026-08-16 Sergio marcó que hay **196 skills globales + 9 plugins**
> instaladas y que yo estaba usando **cero**. El índice existía; lo que faltaba era
> granularidad en contenido/diseño y el reflejo de mirarlo antes de empezar.

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
| Definir el plan de contenido de una cuenta | `content-strategy` · `marketing-plan` · `social` |
| No sé qué publicar / me quedé sin ideas | `marketing-ideas` · `marketing-loops` |
| Decidir el ángulo con el que se ataca un mercado | `marketing-council` · `marketing-psychology` |
| Entender al comprador antes de escribirle | `customer-research` · `prospecting` |
| Ver qué hace la competencia | `competitor-profiling` · `competitors` |
| Armar la oferta o el precio de la pieza | `offers` · `pricing` |

### 1.2 Escribir

| Cuándo | Skills |
|---|---|
| Copy de anuncio, caption, headline | `copywriting` · `ad-creative` |
| Pulir un texto que ya existe | `copy-editing` · `writing-guidelines` |
| Artículo, guion largo, documento | `article-writing` |
| Recurso descargable a cambio de un dato | `lead-magnets` |
| Correo frío / secuencia | `cold-email` · `emails` · `sms` |

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
| Generar imagen para web/mobile | `imagegen-frontend-web` · `imagegen-frontend-mobile` · `image` |
| Convertir una referencia visual en código | `image-to-code` · `stitch-code-to-design` |
| Definir el sistema visual de una marca | `design-dna` · `stitch-manage-design-system` |

### 1.4 Video

| Cuándo | Skills |
|---|---|
| Video programático (React) | `remotion` · `remotion-video-creation` |
| Video en general / edición | `video` + skills propias `editor-videos` · `ver-videos` |
| Motor HTML→MP4 | `hyperframes*` (viven en `.agents/skills/`) |
| **Juzgar el movimiento y la continuidad entre planos** | `motion-doctrine` · `cut-the-curve` · `seam-craft` (propias) |
| Reconstruir un componente desde fotogramas | `image-to-code` |

**Generativo (Higgsfield):** no es skill, es MCP. Tarifario medido y las 3 vías
(`start_image` · `image_references` · `video_extension`) en
`references/modelos/lucia/prueba-lipsync-20260815/LEEME.md`.

### 1.5 Distribución y medición

| Cuándo | Skills |
|---|---|
| Pauta | `ads` · `ab-testing` |
| SEO | `seo-audit` · `ai-seo` · `programmatic-seo` · `site-architecture` |
| App store | `aso` |
| Prensa, comunidad, alianzas | `public-relations` · `community-marketing` · `co-marketing` · `referrals` |
| Medir si sirvió | `analytics` · `cro` · `click-path-audit` |
| Retención / monetización | `churn-prevention` · `paywalls` · `popups` · `signup` |
| Lanzamiento | `launch` · `product-marketing` · `sales-enablement` · `revops` |

---

## 2. Diseño · UI · UX

| Cuándo | Skills |
|---|---|
| **Antes de codear cualquier UI** (regla de la casa) | `impeccable` · `ui-ux-pro-max` · `taste-design` |
| Revisar un diseño ya hecho | `design-review` · `plan-design-review` · `gpt-taste` |
| Explorar varias direcciones a la vez | `design-shotgun` · `design-consultation` |
| Escribir el diseño como spec | `design-md` · `design-html` · `design` |
| Dirección estética concreta | `minimalist-ui` · `industrial-brutalist-ui` · `web-design-guidelines` |
| Componentes | `shadcn-ui` · `react-components` · `ui-styling` |
| Ingeniería de diseño fina | `emil-design-eng` |
| Flujo Stitch (extraer → generar → subir) | `stitch-extract-design-md` · `stitch-design-taste` · `stitch-generate-design` · `stitch-loop` · `stitch-upload-to-stitch` |

⚠️ Regla ya escrita y ya incumplida una vez: **cargar `impeccable` + galería/tokens ANTES de
codear**, no descubrirlo a la tercera ronda. Ver la memoria *web-factory-disenos-genericos*
(memoria, no skill).

---

## 3. Frontend

| Cuándo | Skills |
|---|---|
| Patrones generales | `frontend-patterns` · `react-components` |
| Next.js | `nextjs-turbopack` · `vercel-react-best-practices` · `vercel-composition-patterns` |
| Performance | `vercel-optimize` · `vercel-react-view-transitions` |
| React Native | `vercel-react-native-skills` |
| iOS | `ios-clean` · `ios-design-review` · `ios-fix` · `ios-qa` · `ios-sync` |
| Animación | `gsap-skills` (plugin) |

---

## 4. Backend · datos · infra

| Cuándo | Skills |
|---|---|
| Diseñar API | `api-design` · `backend-patterns` |
| Postgres | `postgres-patterns` · `supabase` · `supabase-postgres-best-practices` |
| Migraciones | `database-migrations` · `schema` |
| Contenedores y deploy | `docker-patterns` · `deployment-patterns` · `deploy-to-vercel` · `vercel-cli-with-tokens` |
| MCP propio | `mcp-server-patterns` |
| n8n | `n8n-workflow-patterns` · `n8n-node-configuration` · `n8n-expression-syntax` · `n8n-code-javascript` · `n8n-code-python` · `n8n-validation-expert` · `n8n-mcp-tools-expert` |
| Costo de LLM en pipeline | `cost-aware-llm-pipeline` · `context-budget` |

---

## 5. Seguridad y calidad

| Cuándo | Skills |
|---|---|
| **Antes de commitear algo que toca datos, auth o plata** | `security-review` · `guard` |
| Revisión de código | `review` · `caveman-review` · `plan-eng-review` |
| Testing | `qa` · `qa-only` · `e2e-testing` |
| Verificar antes de decir "listo" | `verification-loop` · `careful` |
| Onboarding a un repo desconocido | `codebase-onboarding` · `investigate` |

⚠️ `verification-loop` y `careful` son las que corresponden al loop que Sergio pide a mano.
**Cargarlas en vez de improvisar el loop.**

---

## 6. Investigación

| Cuándo | Skills |
|---|---|
| Research a fondo con fuentes | `deep-research` · `iterative-retrieval` · `exa-search` |
| Navegar / scrapear | `browse` · `scrape` · `data-scraper-agent` |
| Buscar en memoria | `mem-search` · `learned` |
| Consultar docs de librería | `documentation-lookup` |

---

## 7. Proceso y orquestación

| Cuándo | Skills |
|---|---|
| Planificar antes de construir | `make-plan` · `autoplan` · `blueprint` |
| Revisar un plan desde varios ángulos | `plan-ceo-review` · `plan-design-review` · `plan-devex-review` · `plan-eng-review` |
| Agentes en paralelo / loops | `autonomous-loops` · `continuous-agent-loop` · `pair-agent` · `agentic-engineering` |
| Contexto | `context-save` · `context-restore` · `compress` |
| Crear o auditar skills | `skill-creator` · `skill-stocktake` · `skill-comply` · `find-skills` |
| Entregables de oficina | `docx` · `xlsx` · `pptx` · `pdf` · `make-pdf` · `slides` · `document-generate` |

---

## 8. Dónde vive cada skill (no todas están en el mismo lado)

Buscarlas en un solo directorio da falsos negativos — pasó al verificar este archivo.

| Origen | Dónde | Ejemplos |
|---|---|---|
| Globales del filesystem | `~/.claude/skills/` (**196**) | `impeccable` · `copywriting` · `security-review` |
| Del proyecto | `.claude/skills/` (**33**) | `onia-router` · `ver-videos` · `editor-videos` |
| Plugins | `~/.claude/plugins/cache/` (**9**) | `gsap-skills` · `caveman` · `ponytail` |
| De claude.ai | no están en disco — se listan con `ListSkills` | `docx` · `xlsx` · `pptx` · `pdf` · `skill-creator` · `abogado-del-diablo` |
| HyperFrames | `.agents/skills/` | `talking-head-recut` · `embedded-captions` |

## 9. Lo que NO es skill y se confunde

| Capacidad | Dónde vive |
|---|---|
| Higgsfield (imagen/video generativo) | MCP |
| Meta Ads · Biblioteca de Anuncios | MCP |
| Supabase · Vercel · n8n · Cloudflare · Notion · Figma · Drive · Gmail · Calendar | MCP |
| ElevenLabs | API REST desde el VPS (no hay MCP) |
| HyperFrames | `.agents/skills/` |

---

## 10. Antinorma

**Listar la skill en un doc no es usarla.** Este archivo existe porque el mapa de carriles ya
estaba escrito, era correcto, y aun así se trabajó una sesión entera sin abrir una sola skill.
El paso que falta no es documentar: es **cargar la fila del dominio antes de empezar**.
