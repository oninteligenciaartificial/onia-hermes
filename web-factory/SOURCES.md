# SOURCES — Catálogo de fuentes de ONIA Web Factory

Catálogo vivo de las fuentes cableadas en el harvester. Cada fuente tiene: para qué sirve,
licencia, y cómo se importa. **No agregar fuentes fuera de esta lista sin aprobación.**

Regla de licencia: para sitios de cliente solo se usa MIT / Apache-2.0 / dominio público.
GPL/AGPL queda **rechazado**.

---

## 1. Base (siempre)

| Fuente | Para | Licencia | Cómo se usa |
|---|---|---|---|
| shadcn/ui | componentes base | MIT | `npx shadcn@latest add <comp>` |
| Tailwind CSS v4 | estilos | MIT | dependencia del proyecto |
| Lucide | iconos default | ISC | `import { X } from "lucide-react"` |
| Tabler Icons | iconos extra | MIT | `import { IconX } from "@tabler/icons-react"` |
| tweakcn | generar theme/tokens shadcn | web | copiar theme manual → `packages/tokens` |

---

## 2. Registries shadcn (vía `npx shadcn add`)

Instalan dentro de `apps/site`. Confirmar URL exacta de cada componente en
https://registry.directory o en las docs del registry. No inventar endpoints.

| Registry | Fuerte en | Licencia | Patrón de install |
|---|---|---|---|
| Magic UI | animaciones marketing (Framer Motion) | MIT | `npx shadcn@latest add "https://magicui.design/r/<comp>.json"` |
| Aceternity UI | heroes / efectos wow | MIT (free) | `npx shadcn@latest add "https://ui.aceternity.com/registry/<comp>.json"` |
| Origin UI | forms, dialogs, timeline (serios) | MIT | `npx shadcn@latest add "https://originui.com/r/<comp>.json"` |
| Cult UI | toques premium (dock, cards Apple-style) | MIT | `npx shadcn@latest add "https://cult-ui.com/r/<comp>.json"` |
| Registry Directory | descubrimiento de registries shadcn | review por registry | `https://registry.directory/` |
| 21st.dev | marketplace de componentes shadcn/Tailwind | review por componente | `https://21st.dev/community/components` |
| Kibo UI | componentes shadcn open source | review por repo/registry | `https://www.kibo-ui.com/` |

Descartados por ahora (redundan): Kibo UI, Neobrutalism, Origin extras no usados.

---

## 2b. Global design stack (reference cache)

Repos clonados globalmente en `C:\Users\PC\.codex\design-stack\repos`. No son
dependencias directas: se consultan como referencia, luego se revisan, retokenizan y
validan dentro de `web-factory`.

| Repo | Fuerte en | Licencia | Local |
|---|---|---|---|
| nextlevelbuilder/ui-ux-pro-max-skill | reglas UI/UX, animacion, accesibilidad, producto | MIT | `nextlevelbuilder__ui-ux-pro-max-skill` |
| shadcn-ui/ui | componentes accesibles React/Tailwind | MIT | `shadcn-ui__ui` |
| tailwindlabs/headlessui | primitivas accesibles sin estilo | MIT | `tailwindlabs__headlessui` |
| magicuidesign/magicui | componentes animados marketing | MIT | `magicuidesign__magicui` |
| markmead/hyperui | bloques Tailwind v4 para web/ecommerce | MIT | `markmead__hyperui` |
| ibelick/motion-primitives | patrones de motion | MIT | `ibelick__motion-primitives` |
| nolly-studio/cult-ui | componentes premium shadcn-compatible | MIT | `nolly-studio__cult-ui` |
| serafimcloud/21st | marketplace/registry shadcn + Tailwind | MIT | `serafimcloud__21st` |
| tremorlabs/tremor | dashboards, KPI, tablas, data UI | Apache-2.0 | `tremorlabs__tremor` |
| launch-ui/launch-ui | landing pages Next/shadcn/Tailwind | MIT | `launch-ui__launch-ui` |

Guia local: `DESIGN_STACK.md`. Stack global: `C:\Users\PC\.codex\design-stack\DESIGN_STACK.md`.

---

## 3. Bloques HTML (copy-paste → re-tokenizar)

Se importan con `fetch` + cheerio en `harvester/blocks-html/`. Extraer `<section>`,
guardar en `packages/blocks/`, reemplazar colores por CSS vars del sistema.

| Fuente | Para | Licencia | URL |
|---|---|---|---|
| shadcnblocks.com | secciones shadcn-native | mix free/pro (usar free) | https://www.shadcnblocks.com |
| efferd.com/blocks | bloques Tailwind | free | https://efferd.com/blocks |

Descartados (otro sistema de estilos, rompen consistencia shadcn): Preline, Flowbite, DaisyUI.

---

## 4. Plantillas completas (GitHub — SOLO MIT)

Clonar con `simple-git` o `gh` a tmp, leer LICENSE, si MIT/Apache copiar a
`packages/templates/`. Si GPL/AGPL → descartar.

| Repo | Para | Licencia | Comando |
|---|---|---|---|
| nexi-launch/finwise-landing-page | SaaS / landing | MIT | `gh repo clone nexi-launch/finwise-landing-page` |
| desgy nextjs landing | agencia | MIT | (GetNextjsTemplates/desgy-...) |
| vercel/commerce | ecommerce | MIT | `gh repo clone vercel/commerce` |
| shadcn-ui/taxonomy | app + marketing | MIT | `gh repo clone shadcn-ui/taxonomy` |
| Precedent (steven-tey/precedent) | starter Next | MIT | `gh repo clone steven-tey/precedent` |

RECHAZADO: cruip/open-react-template (GPL) — no usar para cliente.

---

## 5. Visión: ref/screenshot → código (stub)

Codex NO tiene estos MCP. Dejar `harvester/vision/` como stub documentado. El pipeline
se corre desde el lado Claude cuando haga falta convertir una referencia (ej. Pinterest)
en bloque.

| Tool | Estado | Acceso |
|---|---|---|
| stitch MCP | primario | MCP (lado Claude) |
| image-to-code (skill) | fallback | skill (lado Claude) |
| v0.dev | manual | web (Vercel) |
| screenshot-to-code (OSS) | alternativa self-host | github |

Pinterest = solo referencia visual (su ToS bloquea scraping). Nunca copia literal de layout.

---

## 5b. Referencias visuales y de estructura

Estas fuentes se pueden usar para extraer estructura, taxonomias, patrones de secciones,
tipografia, motion y logica de conversion. No se copia codigo ni identidad visual sin
revision de licencia y retokenizacion.

Inventario actual:

```text
web-factory/data/references/design-sources/2026-06-15-user-design-source-audit.json
web-factory/data/references/design-sources/2026-06-15-reference-bank-screenshots.json
web-factory/data/references/design-sources/gallery-examples/latest-gallery-examples.json
web-factory/data/references/code-sources/latest-code-cache-index.json
web-factory/data/references/code-sources/latest-component-code-examples.json
web-factory/data/references/design-sources/gallery-examples/2026-06-24-resource-reference-pack.json
web-factory/data/references/code-sources/2026-06-24-code-cache-index.json
web-factory/data/references/code-sources/2026-06-24-component-code-reference-pack.json
web-factory/WEB_FACTORY_REFERENCE_CAPTURE_RUNBOOK.md
```

Artefactos pesados locales:

```text
C:\Users\PC\.codex\design-stack\screenshots
C:\Users\PC\.codex\design-stack\gallery-examples-full
C:\Users\PC\.codex\design-stack\repos
```

Resumen del banco de galerias del 2026-06-15:

- 168 candidatos extraidos desde galerias/listados.
- 57 ejemplos abiertos con screenshots desktop/mobile y estructura profunda.
- 124 screenshots indexadas, 0 archivos faltantes, 0 rutas duplicadas, 0 capturas estrictamente blancas en QA.
- 28 code blocks extraidos desde docs con licencia revisable.
- 240 ejemplos de codigo indexados desde repos locales `allowed-after-review`.

| Fuente | Uso permitido | Nota |
|---|---|---|
| 21st.dev community components | Discovery de componentes/bloques | Revisar licencia por componente antes de importar. |
| Dribbble shots | Inspiracion visual/mood | No copiar layout, assets, copy ni marca. |
| Fontpair | Pairing tipografico y brand-kit logic | Usar fuentes con licencia compatible, preferir Google Fonts. |
| Motion docs | Motion reference | Oficial para patrones de animacion y stagger. |
| 10x.app | Ritmo de landing SaaS/producto | Estructura solamente. |
| Motion Primitives | Microinteracciones | Revisar licencia del repo antes de copiar implementacion. |
| Watermelon UI | Taxonomia de componentes/bloques | Referencia hasta confirmar licencia. |
| Lapa Ninja | Research de categorias/tendencias | Inspiracion solamente; no copiar sitios indexados. |
| Componentry | Componentes animados React | Revisar licencia del repo antes de copiar implementacion. |
| shadcn/ui | Fuente base aprobada | Canonica para componentes y patrones accesibles. |
| Efferd blocks | Discovery de bloques shadcn | Revisar acceso/licencia por bloque antes de importar. |
| Registry Directory | Discovery de registries shadcn actuales | No copiar codigo desde el indice; usarlo para encontrar fuente/licencia/install. |
| 21st.dev Landing Page Components | Discovery de heroes, CTAs, pricing, features y motion | Revisar licencia por componente antes de copiar codigo. |
| Magic UI | Motion, efectos, componentes animados y recursos shadcn | Preferir repo local MIT o registry oficial; retokenizar antes de usar. |
| Aceternity UI | Motion premium, heroes, bento, canvas y parallax | Fuente mixta free/premium; captura visual por defecto, codigo solo con licencia clara. |
| Shadcnblocks | Bloques shadcn, layouts y secciones | Fuente free/pro; no copiar pro sin licencia. |
| Kibo UI | Componentes accesibles shadcn-compatible | Verificar repo/licencia antes de copiar. |
| Deck.gallery | Decks/slides curados: tipografia, jerarquia, storytelling | Inspiracion solamente; para propuestas, OG y slides, no para layout web. Agregada 2026-09-18. |
| Motion examples (motion.dev/examples) | 450+ snippets de animacion React/JS/Vue | Ejemplos free reutilizables tras retokenizar; los de Motion+ son pagos, no copiar. Agregada 2026-09-18. |

### Fuentes externas agregadas al pattern bank 2026-06-24

Estas fuentes amplian la investigacion por rubro. No son fuentes de codigo
aprobado por defecto. Usarlas para estructura, ritmo, taxonomia, secciones,
motion principles, flujos y criterios visuales.

| Fuente | Uso permitido | Nota |
|---|---|---|
| Lapa Ninja | Landing research por categoria | Galeria amplia con categorias SaaS, business, ecommerce, AI, health, food, real estate y mas. Inspiracion solamente. |
| Landbook | Web inspiration actual | Buena para landing, portfolio, ecommerce, pricing, case study, product listing y product page. Inspiracion manual solamente: smoke Playwright 2026-06-24 recibio 403/Cloudflare. |
| Landingfolio | Landing examples y componentes | Usar para patrones de secciones y composicion. No copiar templates. |
| SaaSFrame | SaaS CRO y mobile-first landing patterns | Usar para SaaS/AI/App: hero, proof, pricing, social proof y CTA. Inspiracion solamente. |
| SaaS Landing Page | SaaS section taxonomy | Usar para estudiar landing, pricing, about, features, testimonials, FAQ y contacto. Inspiracion solamente. |
| Awwwards | Art direction, motion, tipografia y alto nivel visual | Alto riesgo de overdesign. Extraer 1 idea fuerte, no copiar experiencia completa. |
| Recent | Referencias recientes de websites, OG images, app screenshots y skills | Radar de actualidad visual. Inspiracion solamente. |
| Mobbin | Flujos reales, copy de producto y UX patterns | Usar para app/dashboard/checkout/onboarding flows, no para copiar pantallas. |

Artefactos nuevos:

```text
web-factory/WEB_FACTORY_PATTERN_BANK_2026.md
web-factory/data/references/design-sources/web-factory-pattern-bank-20260624.json
web-factory/data/references/design-sources/gallery-examples/2026-06-24-new-sources-smoke.json
web-factory/data/references/design-sources/gallery-examples/2026-06-24-resource-reference-pack.json
web-factory/data/references/code-sources/2026-06-24-code-cache-index.json
web-factory/data/references/code-sources/2026-06-24-component-code-reference-pack.json
web-factory/WEB_FACTORY_REFERENCE_CAPTURE_RUNBOOK.md
```

### Deep reference pack 2026-06-24

El pack profundo conserva referencias exactas sin copiar activos propietarios.

Incluye:

- URLs exactas de paginas y candidatos.
- Capturas desktop/mobile con ruta local y hash SHA-256.
- `htmlOutline`: landmarks, clases principales, navegacion, formularios y
  estructura semantica sin guardar HTML propietario completo.
- Recursos detectados: imagenes, videos, posters, stylesheets, fonts,
  `og:image` y assets descargables.
- Senales de fuente tipografica, tecnologia, CTAs, secciones, paleta y layout.
- Codigo referencial solo desde repos cacheados con licencia revisada.

Resumen actual:

- 16 fuentes configuradas.
- 143 candidatos seleccionados.
- 28 ejemplos profundos.
- 56 screenshots desktop/mobile.
- 574 URLs de imagenes.
- 37 URLs de videos.
- 471 muestras de codigo desde repos compatibles o de estudio controlado.

Limite comercial:

- `allowed-after-review`: puede inspirar implementacion despues de revisar,
  retokenizar, adaptar dependencias, validar accesibilidad y responsive.
- `study-only`: usar solo para estudiar estructura. No copiar codigo en trabajo
  comercial.
- Sitios cerrados y galerias visuales: no copiar HTML/CSS/JS completo, copy,
  imagenes, videos, logos, marca ni screenshots como assets de cliente.

Playwright esta instalado como dev dependency de `web-factory` para que los scrapers
corran por terminal. Codex desktop tambien puede usar su runtime `node_repl` para
capturas ad-hoc. Instalar Chromium con `pnpm references:playwright:install` solo si
la maquina/CI no tiene Chrome local usable.

Codigo permitido: solo repos con licencia MIT / Apache-2.0 / ISC / BSD y revision previa.
Codigo restringido: PolyForm Noncommercial, GPL/AGPL, licencia desconocida, sitios cerrados,
Dribbble, Lapa y cualquier fuente donde no haya permiso claro de reutilizacion.

Comandos principales:

```powershell
cd C:\dev\proyectos\onia-hermes\web-factory
pnpm references:code-index
pnpm references:code-examples
pnpm references:gallery:merge
pnpm references:gallery:21st
pnpm references:gallery:all
pnpm references:playwright:install

node harvester\vision\index_licensed_code.mjs --repos-root C:\Users\PC\.codex\design-stack\repos --out data\references\code-sources\latest-code-cache-index.json
node harvester\vision\index_component_code_examples.mjs --code-index data\references\code-sources\latest-code-cache-index.json --out data\references\code-sources\latest-component-code-examples.json --max-files-per-repo 24
node harvester\vision\merge_gallery_examples.mjs --input-dir data\references\design-sources\gallery-examples --out data\references\design-sources\gallery-examples\latest-gallery-examples.json
```

Comandos del pack profundo desde la raiz del repo:

```powershell
cd C:\dev\proyectos\onia-hermes

node web-factory\harvester\vision\scrape_gallery_examples.mjs --config web-factory\data\references\design-sources\gallery-reference-sources.json --cache-root C:\Users\PC\.codex\design-stack\gallery-examples-full --out web-factory\data\references\design-sources\gallery-examples\YYYY-MM-DD-resource-reference-pack.json --max-items 12 --detail-items 2

node web-factory\harvester\vision\index_licensed_code.mjs --repos-root C:\Users\PC\.codex\design-stack\repos --out web-factory\data\references\code-sources\YYYY-MM-DD-code-cache-index.json

node web-factory\harvester\vision\index_component_code_examples.mjs --code-index web-factory\data\references\code-sources\YYYY-MM-DD-code-cache-index.json --out web-factory\data\references\code-sources\YYYY-MM-DD-component-code-reference-pack.json --max-files-per-repo 48
```

Pipeline recurrente:

```powershell
cd C:\dev\proyectos\onia-hermes\web-factory
pnpm references:harvest:smoke
pnpm references:harvest:daily
pnpm references:harvest:watch
```

El pipeline extrae screenshots, recursos, fuentes, senales de animacion, CTAs,
html outline, code links y codigo solo desde docs/repos con licencia revisable.

`scrape_gallery_examples.mjs` es el scraper profundo de galerias. En terminal usa la
dependencia `playwright`; dentro de Codex tambien puede ejecutarse con `node_repl`.

---

## 6. Assets

| Tipo | Fuente | Licencia | Cómo se llama |
|---|---|---|---|
| Fotos | Unsplash API | libre comercial | `GET https://api.unsplash.com/search/photos?query=Q&per_page=N` + header `Authorization: Client-ID ${UNSPLASH_ACCESS_KEY}` |
| Fotos (alt) | Pexels API | libre comercial | `GET https://api.pexels.com/v1/search?query=Q` + header `Authorization: ${PEXELS_API_KEY}` |
| Iconos | Lucide / Tabler | ISC / MIT | npm import (sin API) |
| Ilustraciones | unDraw / DrawKit / Reshot | libre | descarga manual SVG |

---

## Llaves requeridas (.env en web-factory, nunca commitear)

```
UNSPLASH_ACCESS_KEY=    # unsplash.com/developers
PEXELS_API_KEY=         # pexels.com/api (opcional)
GITHUB_TOKEN=           # github.com/settings/tokens, scope public_repo (opcional; o `gh auth login`)
```

---

## 7. Cosecha 2026-08-16 — fuentes nuevas y correcciones

Detalle por grupo en `data/references/design-sources/*.md` (librerias-componentes,
inspiracion-landings, motion-y-3d, herramientas-builders, dashboards-y-blocks,
skill-uiux-y-movil). Síntesis: `docs/DESIGN_LEARNED_2026.md`.

### Fuentes NUEVAS

| Fuente | Para | Licencia | Veredicto |
|---|---|---|---|
| Tremor Blocks (blocks.tremor.so) | 300+ bloques data-UI: KPI cards, filterbars, tablas, empty states, billing | free open-source (verificar LICENSE al importar cada bloque) | Adoptar — capa data-UI por defecto, copy-paste + retokenizar |
| MotionScore (motion.dev) | Auditoría S–F de performance de animación desktop+mobile | gratis | Adoptar como gate de QA pre-ship |
| Motion+ (motion.dev) | Componentes motion premium (AnimateNumber, Ticker, Cursor, Curtains) | £299 pago único; cláusula Builder's License si se revenden capacidades | NO comprar — P1–P22 del banco lo cubren |
| Motion UI (motion.dev) | ~30 secciones animadas prefab | pago | Descartada — viola anti-template policy |
| Rotato (app.rotato.app) | Mockups 3D de dispositivo (imagen/video) para propuestas y reels | pago único ~USD 79–199 (sin confirmar); trial web gratis; EULA de exports por revisar | Adoptar-condicional — app nativa Mac-only; probar web beta en Windows; compra = permiso de Sergio |
| Haikei (haikei.app) | SVG generativos: waves, blobs, blurry gradients, low-poly (< 10 KB) | gratis con límites; ToS NO licencia el output explícitamente | Inspirar — recolorear con CSS vars; a mediano plazo script propio paramétrico |
| 10x App Builder (github.com/10x-app-builder/10x) | Builder agéntico de apps SwiftUI con loop plan→build→verify-screenshot | PolyForm Noncommercial 1.0.0 — RECHAZADA | Descartar código; inspirar solo su loop de verificación visual |
| Stripe Dashboard | Referencia gold-standard de analytics: 4-6 KPI, drill-down, empty states | propietario | Reference-only (como Awwwards/Mobbin) |
| PostHog | Modelo insight-como-unidad, feed personalizado, shell único | MIT parcial + carpetas EE propietarias | Reference-only — no importar código (base Ant Design) |
| ui-ux-pro-max (SKILL.md, contenido extraído) | 12 reglas numéricas de QA + CLI `--design-system` | MIT (skill instalada en `C:\Users\PC\.claude\skills\ui-ux-pro-max`) | Adoptar — ya estaba como puntero en §2b; ahora citable por reglas |
| Research móvil 2026 (Muzli, GenDesigns, UXPin, DesignStudio) | Bottom sheets con detents, tab bar, thumb-zone, swipe actions | research gratuito | Inspirar — solo estructura; implementar con shadcn/vaul propios |

### Correcciones a filas existentes (pendiente editar en el cuerpo)

- **§5b Componentry**: licencia CONFIRMADA MIT (repo `harshjdhv/componentry`) →
  promover de "revisar licencia" a allowed-after-review y clonar al design-stack.
- **§3 Efferd**: NO es "free" — es mix free/pro (~180 bloques; ej. Hero 9 pro + 3
  free). Usar solo bloques free, como shadcnblocks. Su valor distintivo: categorías
  App Shell (10) y Dashboard (10).
- **§5b Fontpair**: cosechados 10 pares concretos mapeados a rubros ONIA (ver
  `docs/DESIGN_LEARNED_2026.md` §4). Trampa: el par Montserrat+"Google Sans" incluye
  fuente propietaria que NO está en Google Fonts — sustituir body por Inter/Figtree.
- **§5b Lapa Ninja**: identificada como la fuente "7.300+ landing examples" (no
  Landingfolio). Devuelve 403 a WebFetch (Cloudflare) — cosechar con Playwright y
  navegador real. Colecciones tipográficas (712 typography / 172 serif / 77 mono) y
  metadata de paleta+fuente por ejemplo sirven como validador de brand-kit por rubro.
- **§5 Stitch**: rol asignado — intake visual (cierra el stub `harvester/vision/`) +
  `generate_variants` pre-código + preview para propuestas. Nunca código final (HTML
  no token-native; cuota Labs 350/50 gen/mes).
- **§5b 10x.app**: esa entrada es la LANDING del 10x App Builder (arriba); la
  referencia estructural sigue vigente, el producto queda rechazado por licencia.
- **§1 shadcn/ui**: novedades 2025-2026 — Questionnaire (ago-2026), Toast con
  promise-state (jul-2026), calendar/sidebar/dashboard blocks, Base UI reemplazó a
  Radix como default (ojo mezcla de bases), registries desde GitHub (jun-2026) y MCP
  server oficial.

## 8. Cosecha 2026-09-18 — reel «Arma tu stack de galerías» (IG `DdZZmsQtr2-`)

Cinco sitios en 13 segundos; cruce completo en `DESIGN_STACK.md` («Cruce con “Arma tu stack de galerías”»).

| Fuente | Para | Licencia | Veredicto |
|---|---|---|---|
| Watermelon UI (ui.watermelon.sh) | bloques/componentes | sin confirmar | Ya estaba (§5b) |
| Deck.gallery | decks y slides curados | inspiration-only | Adoptar como referencia de tipografía/jerarquía para propuestas, OG y slides — agregada a `gallery-reference-sources.json` |
| Motion examples (motion.dev/examples) | 450+ snippets de animación | MIT (librería); ejemplos free + Motion+ pago | Adoptar como fuente de cosecha — agregada a `gallery-reference-sources.json`; la librería ya era default |
| Swishy.ai | motion graphics por IA (MP4/GIF) | SaaS pago | Diferir — la IA dibuja el visual; solo piezas de redes, nunca UI de cliente |
| Replit | builder de apps por prompt | SaaS | Descartar — no es galería; el pipeline es Claude Code + Web Factory |
