# Stack de skills por dominio — qué agarrar y cuándo

> 🧹 **Podado el 27-oct-2026** (decisiones de Sergio Urcullo: el método de sesión es reglas del repo + Ponytail, y en
> la PC quedan solo las skills que se usan). Salieron Superpowers, gstack, 44 personales sin uso en 32 días y la
> copia personal vieja de `ad-creative`. Las mueve `scripts/pc/ordenar-agentes-pc.ps1`, que las devuelve con
> `-Revertir`. Este mapa nombra **solo lo
> que queda**. Si una fila no tiene skill, se trabaja con las reglas del repo (`CLAUDE.md`, `AGENTS.md`). La poda
> anterior (29-sep) está en `hermes-content/docs/historial/LIMPIEZA_SKILLS_20260929.md`.

> Complemento de `SKILL.md`, que mapea **carril → stack**. Esto mapea **problema → skill**,
> que es como aparecen las tareas en la práctica.
>
> **Por qué existe:** el 2026-08-16 Sergio marcó que hay **196 skills globales + 9 plugins**
> instaladas y que yo estaba usando **cero**. El índice existía; lo que faltaba era
> granularidad en contenido/diseño y el reflejo de mirarlo antes de empezar.

**Regla de uso:** antes de escribir la primera línea de cualquier tarea, buscá el dominio acá
y cargá las 2-3 skills de la fila. No las 10 — las que aplican.

> Para **aprender de una referencia** (video, web, post) el ruteo es otro: `aprender-de-todo`, que manda cada
> dimensión a su skill. `hermes-content/references/video-intake/SKILLS_DEL_CARRIL.md` (16-ago) quedó como historia.

---

## 1. Contenido con IA — marketing e influencers

### 1.1 Antes de producir: qué decir y a quién

| Cuándo | Skills |
|---|---|
| Definir el plan de contenido de una cuenta | `content-strategy` |
| Ver qué hace la competencia | `competitor-profiling` |
| Armar la oferta o el precio de la pieza | `pricing` |

### 1.2 Escribir

| Cuándo | Skills |
|---|---|
| Copy de anuncio, caption, headline | **`onia-ventas-pauta` §9 primero** (anuncio que vende y VSL, de punta a punta) · `copywriting` · `ad-creative` |
| Pulir un texto que ya existe | `humanizer` · `stop-slop` |
| Guion o texto largo de la marca personal | skill-doc `hermes-content/skills/guiones-diarios-onia.md` · `humanizer` |
| Recurso descargable a cambio de un dato | `lead-magnets` |

> **Solo en la PC** (`~/.claude/skills/`; una sesión de la nube no las carga): `code-review-spec` ·
> `community-marketing` · `design-dna` · `diagnosing-bugs` · `emil-design-eng` · `humanizer` · `lead-magnets` ·
> `make-pdf` · `next-dev-loop` · `onboarding` · `prisma-cli` · `stop-slop` · `taste-design` · `ui-ux-pro-max`.
> Los trabajadores de la orquesta en GitHub Actions usan las copias de `scripts/orquesta/cuartitos/`. Si una tarea de la
> nube necesita otra, se pide como issue `orquesta` con `donde: pc`. Lo demás de este mapa está en el repo. Las de
> plugin (`ponytail`, `gsap-skills`, `claude-mem`, `frontend-design`, `document-skills`) no se verificaron en la nube.

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
| Carrusel, placa, estático | **`diseno-contenido-onia` primero** · `design-dna` |
| Sacar el sistema visual de una referencia | `design-dna` |
| Sacar el prompt de una imagen de referencia | `sacar-prompt` |

### 1.4 Video

| Cuándo | Skills |
|---|---|
| Video en general / edición | skills propias `editor-videos` · `ver-videos` · `edicion-referentes` (todo video nuevo de Sergio Urcullo) |
| Motor HTML→MP4 | `hyperframes*` (las del repo, `.claude/skills/hyperframes*`, restauradas el 2026-10-02; con el mismo nombre le gana una copia personal de `~/.claude/skills`, §8; `npx hyperframes skills update <nombre>` solo con OK de Sergio Urcullo) |
| **Juzgar el movimiento y la continuidad entre planos** | `motion-doctrine` · `cut-the-curve` · `seam-craft` (propias) |

**Generativo (Higgsfield):** `higgsfield-generate` (CLI oficial, cotiza antes de generar). Tarifario medido y las 3
vías (`start_image` · `image_references` · `video_extension`) en
`references/modelos/lucia/prueba-lipsync-20260815/LEEME.md`.

### 1.5 Distribución y medición

| Cuándo | Skills |
|---|---|
| Pauta | `onia-ventas-pauta` · `ad-creative` · MCP de Meta Ads |
| Comunidad | `community-marketing` · `onboarding` |
| Medir si sirvió | MCP de Meta Ads (insights) |

### 1.6 Meta Ads: de la Biblioteca al anuncio que vende (27-oct)

La estrategia (canales, tope, qué se puede prometer) manda en `hermes-content/docs/ONIA_ADQUISICION_Y_PAUTA.md`;
el método está en `onia-ventas-pauta`. Esta tabla dice qué sección abrir en cada paso.

| Paso | Qué se usa |
|---|---|
| Ver qué sostienen los competidores | `onia-ventas-pauta` §4.1, §8.2 (Biblioteca por el MCP) y §9.9 (se cuentan los que sobreviven 7+ días) · `web-factory/docs/ADS_PATTERN_BANK_2026.md` |
| Escribir el anuncio | `onia-ventas-pauta` §9 (de punta a punta) · `copywriting` · los hooks de `anunciante-supremo` resumidos en §9.9 |
| Hacer el creativo | `onia-ventas-pauta` §9.4 · `diseno-contenido-onia` · `editor-videos` · Higgsfield según §9.10 (qué función, cuánto cuesta y dónde NO entra) con `higgsfield-generate` (cotiza antes; video con OK) |
| Funnel: a dónde va el clic | `onia-ventas-pauta` §9.10 (destinos verificados el 27-oct) |
| Armar la campaña | `onia-ventas-pauta` §5 (la campaña como archivo) · MCP de Meta Ads |
| Medir y renovar | MCP de Meta Ads (insights) · `onia-ventas-pauta` §9.6 y §9.9 (cuatro grupos, un eje por vez) |
| Seguir al lead | `onia-ventas-pauta` §5.1 (WhatsApp y remarketing) |

- **Estado medido el 27-oct:** el MCP de Meta Ads ve **ONIA Ads `act_1073680778314945`**, activa y consultable,
  **sin método de pago**. Hasta que Sergio Urcullo cargue la tarjeta no corre ningún anuncio. La otra cuenta que ve
  (`679613631427810`, sin business) no se usa.
- **`anunciante-supremo`** (skill de un curso de infoproductos, en claude.ai): se usa su método (hooks, variantes de un
  solo eje, reuso de música, B-roll y voz). Producir con ella pide el OK de Sergio Urcullo: usa la llave de APIMART, un
  tercero, gasta ~US$ 1 por tanda y su plantilla 1 renderiza con Remotion, que está jubilado.

---

## 2. Diseño · UI · UX

| Cuándo | Skills |
|---|---|
| **Antes de codear cualquier UI** (regla de la casa) | `impeccable` · `ui-ux-pro-max` · `taste-design` |
| Revisar un diseño ya hecho | `impeccable` (critique / audit) |
| Sacar el sistema de diseño de una referencia | `design-dna` |
| Componentes con criterio | `frontend-design:frontend-design` (plugin) |
| Ingeniería de diseño fina | `emil-design-eng` |

⚠️ Regla ya escrita y ya incumplida una vez: **cargar `impeccable` + galería/tokens ANTES de
codear**, no descubrirlo a la tercera ronda. Ver la memoria *web-factory-disenos-genericos*
(memoria, no skill).

---

## 3. Frontend

| Cuándo | Skills |
|---|---|
| Pantallas del producto (`onia-platform`) | `onia-frontend` (de su repo, manda) · `next-dev-loop` *PC* |
| Webs de venta y landings de cliente | `onia-web-factory` |
| Animación | `gsap-skills` (plugin) |

---

## 4. Backend · datos · infra

| Cuándo | Skills |
|---|---|
| Diseñar API | `api-design` · `backend-patterns` (en `onia-platform`, primero `onia-backend`) |
| Postgres | `postgres-patterns` (en `onia-platform`, primero `onia-db`) · `prisma-cli` *PC* |
| Migraciones | `database-migrations` |
| Contenedores y deploy | `onia-infra` · `docker-patterns` · `deployment-patterns` |
| n8n | `n8n-mcp-tools-expert` (siempre antes de tocar n8n) · `n8n-workflow-patterns` |
| Costo de LLM en pipeline | `hermes-content/docs/AI_MODEL_ROUTING_2026.md` |

---

## 5. Seguridad y calidad

| Cuándo | Skills |
|---|---|
| **Antes de commitear algo que toca datos, auth o plata** | `security-review` + agente `security-reviewer` |
| Revisión de código | agente `code-reviewer` · `code-review-spec` *PC* · `ponytail:ponytail-review` (plugin) |
| Testing | agentes `tdd-guide` (test primero) · `e2e-runner` |
| Un bug | `diagnosing-bugs` *PC*: causa raíz antes de tocar |
| Verificar antes de decir "listo" | `verification-loop` |
| Onboarding a un repo desconocido | agente `Explore` |

⚠️ `verification-loop` es la que corresponde al loop que Sergio pide a mano.
**Cargarla en vez de improvisar el loop.**

---

## 6. Investigación

| Cuándo | Skills |
|---|---|
| Research a fondo con fuentes | `deep-research` · MCP `exa` *PC* |
| Navegar / scrapear | navegador integrado (MCP) · Crawl4AI del VPS (`scripts/alta-por-extraccion.py`) |
| Buscar en memoria | `claude-mem:mem-search` (plugin) |
| Consultar docs de librería | agente `docs-lookup` (Context7) |

---

## 7. Proceso y orquestación

| Cuándo | Skills |
|---|---|
| Planificar antes de construir | reglas del repo + Ponytail; agente `planner` si es grande |
| Delegar o revisar una entrega | `equipo-de-agentes` |
| Contexto entre sesiones | el handoff del carril (`hermes-content/docs/handoff/<carril>.md`) |
| Crear o auditar skills | `skill-creator` (claude.ai) |
| Entregables de oficina | `docx` · `xlsx` · `pptx` · `pdf` (plugin `document-skills`) · `make-pdf` |

---

## 8. Dónde vive cada skill (no todas están en el mismo lado)

Buscarlas en un solo directorio da falsos negativos — pasó al verificar este archivo.

| Origen | Dónde | Ejemplos |
|---|---|---|
| Globales del filesystem | `~/.claude/skills/` (**29** después del script del 27-oct: las 14 del recuadro de §1.2 y 15 copias idénticas a las del repo) | `humanizer` · `ui-ux-pro-max` · `copywriting` |
| Del proyecto | `.claude/skills/` (**63**, contado el 27-oct) | `onia-router` · `ver-videos` · `editor-videos` |
| Plugins | `~/.claude/plugins/cache/` (**10** carpetas, contado el 27-oct) | `gsap-skills` · `ponytail` · `claude-mem` |
| De claude.ai | no están en disco — se listan con `ListSkills` | `docx` · `xlsx` · `pptx` · `pdf` · `skill-creator` · `abogado-del-diablo` |
| HyperFrames | **el repo** (`.claude/skills/` y `.agents/skills/`, restaurado 2026-10-02). Con el mismo nombre gana la **personal** (`~/.claude/skills`): las de HyperFrames ya no tienen copia personal (se archivaron el 26-oct). Las 15 copias que siguen en las dos carpetas son idénticas; `ad-creative` sale el 27-oct porque la personal era la vieja | `hyperframes` · `talking-head-recut` · `embedded-captions` |

## 9. Lo que NO es skill y se confunde

| Capacidad | Dónde vive |
|---|---|
| Higgsfield (imagen/video generativo) | CLI oficial + skill `higgsfield-generate` |
| Meta Ads · Biblioteca de Anuncios | MCP (ve ONIA Ads desde el 1-oct; cómo se usa en §1.6) |
| Supabase · Vercel · n8n · Cloudflare · Notion · Figma · Drive · Gmail · Calendar | MCP |
| ElevenLabs | API REST desde el VPS (no hay MCP) |
| HyperFrames | skills del repo `.claude/skills/hyperframes*` (restaurado 2026-10-02) |

---

## 10. Antinorma

**Listar la skill en un doc no es usarla.** Este archivo existe porque el mapa de carriles ya
estaba escrito, era correcto, y aun así se trabajó una sesión entera sin abrir una sola skill.
El paso que falta no es documentar: es **cargar la fila del dominio antes de empezar**.
