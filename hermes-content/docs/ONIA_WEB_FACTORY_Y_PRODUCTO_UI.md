# Web Factory y Onia Platform — qué se comparte y qué falta

Fuente de verdad viva (sin fecha en el nombre). Responde: ¿qué de la fábrica de webs
(`web-factory/`) sirve para el producto (`onia-platform`) y qué hay que construir?

## Veredicto en dos frases

La fábrica y el producto hablan **idiomas distintos** — la fábrica genera HTML+CSS
estático (funciones TS que devuelven strings), el producto es React/Next con Tailwind v4 —
así que los bloques de landing NO se portan al dashboard; lo compartible es **diseño**
(tokens, patrones de la galería, recetas de motion), no código ejecutable. Las dos
excepciones portables tal cual son el **kit de motion React** de
`web-factory/apps/onia-platform/src/motion/` (React → React, copia disciplinada) y la
**galería `hermes-content/references/ui-patterns/`**, cuyo puente ya está probado: el
producto portó `dropzone-progress` y `upload-button` a mano, con fuente anotada.

---

## 1. Inventario real de la fábrica (`web-factory/`)

La fábrica es un **generador**: `data/clients/<slug>.json` + template → `out/<slug>/index.html`
+ `site.css`. Nada de React en el output de cliente. (Flujo completo:
`.claude/skills/onia-web-factory/SKILL.md`.)

### 1.1 Bloques — `web-factory/packages/blocks/src/`

22 archivos de bloque (~3.900 líneas con tests), **25 exports `render*`** que devuelven
strings HTML (verificado en `packages/blocks/src/index.ts`). Familias (según
`packages/blocks/gallery.ts`): `base`, `clinic`, `model`.

| Familia | Bloques |
|---|---|
| base | `renderHero`, `renderFeatures`, `renderTrust`, `renderProcess`, `renderFaq`, `renderFooter`, `renderStickyCta`, `renderIcon` |
| clinic | `renderClinicHero`, `renderClinicServices`, `renderClinicProcess`, `renderClinicFeature` |
| model (aprendidos de referencias) | `renderBenefitStrip`, `renderEditorialStatement`, `renderFooterBrand`, `renderInlineQuoteForm`, `renderMediaHero`, `renderNewsletterBand`, `renderPathCards`, `renderPropertyCards`, `renderScrollStoryHero`, `renderStatStrip` |
| motion | `renderMotionStyles`, `renderMotionScript`, `renderMotionAssets` |

Catálogo vivo: `packages/blocks/gallery.ts` (una entrada por bloque, render de muestra con
la función real; `gallery.test.ts` obliga a que cubra todo export de `index.ts` — no puede
driftear). Demo navegable: `pnpm blocks:demo`.

### 1.2 Tokens — `web-factory/packages/tokens/src/index.ts`

- `clientTokenVars(client)` → variables CSS por cliente: `--color-primary`, `--color-bg`,
  `--font-heading`… **y los alias shadcn** (`--primary`, `--card`, `--muted`, `--ring`,
  `--radius`) derivados con `color-mix`.
- `clientDarkTokenVars(client)` → modo oscuro con fallback de contraste (si el color de
  marca no se lee sobre fondo oscuro, cae al fg oscuro; documentado en el propio archivo).
- Son tokens **por cliente** (dinámicos, entran por ficha JSON). No son la marca Onia.

### 1.3 Templates — `web-factory/packages/templates/src/`

7 templates válidos (`web-factory/data/schema.ts` → `WEB_FACTORY_TEMPLATES`):
`landing`, `store`, `dashboard`, `landing-focus`, `landing-clinic`, `landing-realestate`,
`landing-logistics`. Nota: `dashboard.ts` es un template estático de demo, NO un dashboard
de producto.

### 1.4 Motion — dos kits distintos

| Kit | Ruta | Naturaleza | Primitivas |
|---|---|---|---|
| CSS/vanilla (sitios generados) | `web-factory/packages/blocks/src/motion.ts` | CSS + runtime vanilla, cero deps, `prefers-reduced-motion` incorporado | `wf-reveal`, `wf-clip-reveal`, `wf-scale-in`, `wf-slide-left/right`, `wf-type-slam`, `wf-stagger`, `wf-parallax`, `wf-hover-lift`, `wf-scrub`, `wf-count`; easing editorial `WF_EASE = cubic-bezier(0.22,1,0.36,1)` |
| React (marketing del producto) | `web-factory/apps/onia-platform/src/motion/` | motion.dev vía `LazyMotion` (~4,6 kb sync), 16 archivos autocontenidos | `MotionProvider`, `Reveal`, `SplitTextReveal`, `StickyScene`, `ScrollList`, `Coverflow`, `Marquee`, `BleedWordmark`, `StaggerGrid`, `CountUp`, `Magnetic`/`PressableCta`, `ModuleToggle`, `AgentRescheduleScene` + `tokens.ts` (springs, durations, `easeOutExpo`) |

### 1.5 Modelos aprendidos — `web-factory/data/references/reels/`

- `models/` — **5 blueprints**: `boldflavor-cpg-landing`, `costers-food-ecommerce`,
  `find-realestate-editorial`, `lecercle-realestate`, `unitedcarriers-logistics`.
- `web-models.json` — agregado: 22 bloques, 10 primitivas de motion (`fade`,
  `scale-zoom`, `staggered-children`, `slide-in`, `clip-path-reveal`, `scroll-parallax`,
  `rotate`, `spotlight-glow`, `sticky-nav`, `type-slam`). Política explícita en el JSON:
  son planos de generación, **no copias** — se reconstruyen con tokens y bloques propios.
- `reels-intelligence.json` + `analyses/` — inteligencia de referencias.

### 1.6 Galería de patrones UI — `hermes-content/references/ui-patterns/`

6 patrones reconstruidos de videos (no copiados), cada uno un `index.html` autocontenido
sin dependencias, con fuente anotada y reglas duras (`transform`/`opacity`,
`prefers-reduced-motion` con `transition: none`):
`chat-widget/`, `checkout-card/`, `dropzone-progress/`, `floating-cart/`,
`sidebar-nav/`, `upload-button/`. Reglas y criterio: su `README.md`.

### 1.7 Apps dentro de la fábrica

| App | Qué es | Depende de |
|---|---|---|
| `web-factory/apps/site` | onia.com.bo + panel onia-center | `@onia/templates` (workspace) |
| `web-factory/apps/onia-platform` | **marketing** del producto (no el producto) | solo `motion`, `next`, `react` |
| `web-factory/apps/dentalgest-landing` | landing legado | — |

⚠️ No confundir: `web-factory/apps/onia-platform` (marketing, dentro de la fábrica) ≠ el
repo producto `C:\dev\proyectos\onia-platform`.

---

## 2. Inventario de primitivos del producto (`C:\dev\proyectos\onia-platform`)

Stack: Next 16 + React 19.2 + **Tailwind v4** (`@theme` en `app/globals.css`, 1.142
líneas) + `@base-ui/react` + `class-variance-authority`. **Cero dependencias del
workspace de la fábrica** (verificado en `package.json`: nada `@onia/*`).

### 2.1 Sistema de estilos — `app/globals.css`

- Escala verde Onia (`--color-verde-50…900`; comentario en el archivo: "fuente de verdad:
  web onia.com.bo / ONIA_BRAND_IDENTITY_2026").
- Tokens tipo Material 3: `--color-surface`, `--color-on-surface`, `--color-outline-variant`,
  `--color-surface-container-*`, `--color-error-container`…
- Bloque `@theme inline` (línea ~631) mapea además los tokens shadcn (`--color-primary`,
  `--color-card`, `--color-chart-1…5`, `--radius-*`).
- Tipografías: Manrope (headline) + Inter (sans). Iconos: **Material Symbols self-hosted**
  (woff2 local — lección del icon-font de 3,9 MB), usado en 102 archivos; `lucide-react`
  instalado pero casi sin uso (2 archivos).

### 2.2 Componentes — `components/`

| Carpeta | Contenido |
|---|---|
| `components/ui/` | `button.tsx` (base-ui + cva, 6 variantes × 9 tamaños), `Badge.tsx` (semántica de estados en ES: pagada/vencida/borrador + roles), `StatCard.tsx`, `ConfirmDialog.tsx`, `AccessibleDialog.tsx`, `RealtimeBadge.tsx`, `UpgradeRequired.tsx` |
| `components/layout/` | `Sidebar`, `Header`, `BottomNav`, `LayoutShell`, `QuickActionsFab`, `NotificationBell`, `navigation.ts` |
| `components/loading/` | `BrandLoadingScreen`, `BrandSpinner` (usados solo por 2 `loading.tsx` globales) |
| `components/dashboard/` | `CountUp.tsx`, `Sparkline.tsx` (artesanales) |
| `components/onia-core/` | `SavedViewBar`, `SavedViewSelector` |
| resto | `auth/`, `billing/`, `comercio/` (`ProductoPicker`), `patients/`, `odontogram/`, `theme/`, `analytics/`, `legal/`, `onboarding/` |

### 2.3 Lo que las pantallas hacen a mano (evidencia)

- **Tablas**: 25 archivos renderizan `<table>` artesanal (grep en `app/` + `components/`).
  Ej.: `app/(dashboard)/comercio/inventario/page.tsx` arma tabla, paginación por URL y
  empty state inline; `app/(dashboard)/billing/page.tsx` arma su filtro por estado a mano.
- **Formularios**: no existe `Input`/`Select`/`Field` en `components/ui/`. Cada form
  repite una constante de clases (ej. `inputClass` en
  `app/(dashboard)/comercio/NewProductForm.tsx`, línea 10).
- **Skeletons**: cero componentes skeleton en el repo (grep "skeleton" → 0 resultados en
  `components/` y `app/`).
- **Gráficos**: ninguna librería de charts; los tokens `--color-chart-1…5` existen en
  `globals.css` pero nadie los usa. Solo `Sparkline.tsx` artesanal.

---

## 3. El puente, categoría por categoría

Regla de la casa que gobierna todo esto: **los puentes automáticos que nadie vigila se
pudren** (`sync-onia-core.mjs` falló en silencio durante días). Por eso acá NO se propone
ningún paquete compartido ni script de sync. El mecanismo aprobado es **copia
disciplinada**: se copia a mano, se adapta, y se deja un comentario en el destino con la
ruta de origen — exactamente como ya se hizo con `dropzone-progress`/`upload-button`
(ver comentario en `onia-platform/app/globals.css` ~línea 688).

| Categoría | ¿Se comparte? | Cómo | Por qué |
|---|---|---|---|
| Tokens de marca | **NO como código** | Cada lado ya tiene su fuente: el producto la marca Onia en `app/globals.css`; la fábrica tokens *por cliente* en `@onia/tokens`. Onia entra a la fábrica como una ficha de cliente más. | Resuelven problemas distintos (marca fija vs. marca dinámica). Buena noticia: ambos ya emiten los alias shadcn (`--primary`, `--card`, `--radius`), así que un componente escrito contra esos nombres se ve bien en los dos mundos. |
| Bloques de landing | **NO al producto** | Sirven para el marketing (onia.com.bo ya sale de `apps/site` + `@onia/templates`). El dashboard del producto no necesita heros ni FAQs. | HTML strings ≠ React; y el trabajo del dashboard es otro. |
| Componentes de formulario | **NO hay qué compartir** | La fábrica solo tiene `inline-quote-form` (HTML). El kit de forms del producto **hay que construirlo** (hueco #2). | — |
| Tablas / datos | **NO hay qué compartir** | El `dashboard.ts` de la fábrica es demo estático. La DataTable del producto **hay que construirla** (hueco #1). | — |
| Motion | **SÍ — la joya** | Copiar `web-factory/apps/onia-platform/src/motion/` → `onia-platform/components/motion/` + `npm i motion` (~4,6 kb sync vía LazyMotion). React → React, autocontenido, `tokens.ts` incluido. Alternativa sin dependencia: portar las clases CSS de `packages/blocks/src/motion.ts` como CSS plano. | Es el único código de la fábrica escrito en el idioma del producto. Le da al dashboard reveals, staggers y count-ups consistentes con el marketing. |
| Iconos | **NO unificar ahora** | Producto: Material Symbols self-hosted (102 usos). Fábrica: `icons.ts` SVG inline. | Migrar 102 archivos no paga nada visible. Revisitar solo si el peso del woff2 vuelve a doler. |
| Patrones UI (galería) | **SÍ — puente probado** | `hermes-content/references/ui-patterns/`: mirar el `index.html`, portar a React/Tailwind a mano, anotar la fuente en el destino. Ya funcionó 2 veces (`dropzone-progress`, `upload-button` → `app/(dashboard)/comercio/importar/`). | Los patrones son vanilla (`transform`/`opacity`), se portan en minutos y la anotación de fuente evita el drift silencioso. |
| Modelos aprendidos | **SÍ como criterio** | `web-models.json` y los 5 modelos dicen QUÉ composición/motion se ve profesional. Se usan como brief de diseño al construir pantallas nuevas, no como código. | Su propia política lo dice: blueprints, no copias. |

**Cómo se sincroniza sin romper la independencia del producto:** no se sincroniza — se
copia con firma. Cada port lleva (1) comentario en el destino con ruta de origen y fecha,
(2) commit propio que cita la fuente. Si el origen mejora, la mejora se re-porta a mano
cuando alguien la necesita. Cero crons, cero scripts de sync, cero dependencias de
workspace en `onia-platform/package.json`.

---

## 4. Los 3 huecos más valiosos (no existen en ningún lado)

Priorizados por lo que las pantallas del producto ya necesitan hoy
(`/comercio`, `/comercio/inventario`, `/agenda`, `/billing`, `/agents`).

### Hueco 1 — DataTable con estados (el más caro de no tener)

**25 pantallas** arman su `<table>` a mano, cada una con su propia paginación por URL
(`inventario/page.tsx`), su propio filtro por estado (`billing/page.tsx`), su propio
empty state y ningún estado de carga. Un componente `DataTable` (columnas tipadas, orden,
paginación y filtro por searchParams, empty state y skeleton integrados) colapsa la
mayor superficie de UI repetida del producto. Vive en `components/ui/`, server-first como
las pantallas actuales.

### Hueco 2 — Kit de formulario (Input, Select, Field, error)

No existe ni un `Input` compartido: cada form repite su string de clases
(`NewProductForm.tsx`). Un kit `Field` + `Input`/`Select`/`Textarea` con label, ayuda y
error accesibles (siguiendo el patrón base-ui + cva del `button.tsx` existente) da
consistencia inmediata a alta de productos, caja, fiados, citas y facturas — las
pantallas que más se tocan al vender comercio.

### Hueco 3 — Skeletons y empty states estandarizados

Cero skeletons en el repo; solo 2 `loading.tsx` globales con `BrandLoadingScreen`
(pantalla completa — no sirve para una tabla que carga). Y cada empty state es un div
artesanal distinto. Un `Skeleton` (línea/bloque/tabla) + un `EmptyState` (ícono, mensaje,
acción) — ambos consumibles por el Hueco 1 — es lo que separa "pantalla en blanco que
parece rota" de producto profesional.

**Mención 4 (no bloqueante hoy):** gráficos. Los tokens `--color-chart-1…5` ya están
declarados en `globals.css` y sin uso; cuando dashboard/reports pidan más que el
`Sparkline` artesanal, ese es el punto de entrada.
