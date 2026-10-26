# Web Factory Design Stack

Last audit: 2026-08-16

## Mapa del conocimiento de diseño — EMPEZAR ACÁ (orden de carga)

1. **Skills** (cargar ANTES de diseñar, en este orden): `impeccable` (craft y
   anti-patterns) · `ui-ux-pro-max` (estructura, a11y, interacción) ·
   `~/.claude/rules/web/design-quality.md` (≥4 Required Qualities, banned
   patterns) · para gráficos/KPIs: `dataviz` · para motion: skills gsap-* y
   `motion-doctrine`. El resto de las skills de abajo se elige con
   `web-factory-design-director`, no se cargan todas.
2. **Patrones destilados** (la verdad operativa, citar por sección):
   `WEB_FACTORY_PATTERN_BANK_2026.md` (composición: landing · dashboard) ·
   `docs/MOTION_PATTERN_BANK_2026.md` (movimiento).
3. **Aprendizaje crudo**: `docs/DESIGN_LEARNED_2026.md` (qué funciona/qué no, por
   cosecha: 15 fuentes 2026-08-16 + galerías) · `data/references/design-sources/*.md`
   (ficha por fuente) · `data/references/reels/models/` (learned models de reels).
4. **Encarnación**: `packages/tokens` → `packages/blocks` (22) → `packages/templates`
   (dashboard.ts, landing-realestate.ts). Un patrón "aprendido" que no llegó a
   packages/ todavía no es de la factory.

**Regla de orden**: el aprendizaje nuevo entra por (3) con fuente citada; se destila a
(2) cuando se repite o se usa; se encarna en (4) cuando una superficie real lo pide.
Nunca al revés, nunca doc suelto fuera de esta cadena.

This file records the design sources that can inform generated client websites. The global clone cache lives at:

```text
C:\Users\PC\.codex\design-stack
```

Use these repositories as reference material. Do not paste third-party code into a client site until the implementation is reviewed, retokenized, and validated inside `web-factory`.

## Cruce con «Stop AI slop» (Enrique Rocha, IG `p/DdXM8-Nmxey`, leído 2026-09-17)

Carrusel de 10 repos «para que lo hecho con Claude no se vea genérico». Inventario contra lo
instalado, para no volver a evaluarlos:

| Repo | Para qué | Estado en ONIA |
|---|---|---|
| `nextlevelbuilder/ui-ux-pro-max-skill` | estilo, colores, tipografías | ✅ instalada (`ui-ux-pro-max`) |
| `pbakaus/impeccable` | revisar y pulir interfaces | ✅ instalada |
| `Leonxlnx/taste-skill` | diseño, animaciones, cantidad de contenido | ✅ instalada (`taste-skill`, ver abajo) |
| `VoltAgent/awesome-design-md` | 73 DESIGN.md de marcas reales | 🟡 no instalado; **adoptado el formato**: el motor escribe `data/clients/<slug>.DESIGN.md` (`generate/design-md.ts`) |
| `google-labs-code/design.md` | contraste del DESIGN.md | 🟡 no instalado; el contraste WCAG lo mide `design-md.ts` |
| `blader/humanizer` | reescribe frases que suenan a IA | ✅ instalada 17-sep (global, MIT) — pasada de copy |
| `hardikpandya/stop-slop` | reglas para escribir sin clichés | ✅ instalada 17-sep (global, MIT) — `generate/slop.test.ts` es su versión en español para el copy generado |
| `zarazhangrui/frontend-slides` | presentaciones en el navegador | 🟡 no; tenemos `slides` |
| `cathrynlavery/diagram-design` | diagramas | 🟡 no; tenemos `artifact-diagramming` |
| `Egonex-AI/Understand-Anything` | mapa navegable del proyecto | ✅ plugin instalado |

**Regla que queda:** antes de dar por bueno copy generado (titulares del asistente, bajadas del
motor, textos de un cliente sin material) se pasa por `humanizer`/`stop-slop`, y el gate
`slop.test.ts` lo vigila en el repo.

## Cruce con «Arma tu stack de galerías para aprender a crear webs» (IG reel `DdZZmsQtr2-`, visto 2026-09-18)

Reel de 13 s, cinco sitios en pantalla («websites you need as a vibecoder»). Sin audio útil: lo que
dice de cada uno se leyó de los subtítulos en los frames. Inventario contra lo instalado, para no
volver a evaluarlos:

| Sitio | Qué es (según el reel) | Estado en ONIA |
|---|---|---|
| `ui.watermelon.sh` (Watermelon UI) | bloques/componentes; abre y cierra el reel | ✅ ya en `gallery-reference-sources.json` y en §5b de SOURCES.md (licencia sin confirmar) |
| `deck.gallery` | decks y slides curados «para no arrancar de un lienzo en blanco» | 🟢 **agregada 18-sep** como fuente de cosecha (`deck-gallery`, inspiration-only): tipografía, jerarquía y storytelling para propuestas, OG y `slides` — no para layout web |
| `swishy.ai` | «AI motion designer»: texto → animación/motion graphics (MP4/GIF) | 🟡 diferida: la IA dibuja el visual, choca con «la interfaz nunca la dibuja la IA». Sirve solo para piezas de redes (carril marca-personal), no para UI de cliente |
| `replit.com` | «What will you build?»: builder de apps por prompt | ⛔ descartada: es un builder, no una galería; el pipeline es Claude Code + Web Factory. Su caja única de entrada ya está medida en `hermes-content/docs/historial/research/competencia/configuradores-web-ia-2026-09-17.md` |
| `motion.dev` | «450+ ejemplos copy-paste» React/JS/Vue | ✅ librería ya default de la casa (`motion-y-3d.md`); 🟢 **`/examples` agregada 18-sep** como fuente de cosecha (`motion-dev-examples`) para minar mecánica de microinteracciones |

**Saldo:** de cinco, dos ya estaban, dos entran a la cosecha (deck.gallery, motion.dev/examples) y dos
no son galerías (Swishy, Replit). El stack queda en 30 fuentes de galería; el reel no traía nada
estructural que faltara.

## Active Skill

`ui-ux-pro-max` is installed globally at `C:\Users\PC\.codex\skills\ui-ux-pro-max`.

Use it for UI structure, responsive layout, interaction quality, accessibility, animation, typography, color, and final UI review.

`impeccable` is installed in this project at `.agents/skills/impeccable` and globally at `C:\Users\PC\.codex\skills\impeccable`.

Use it for brand-register design checks, layout/type/motion polish, anti-pattern detection, and pre-ship quality review. The repo-level `PRODUCT.md` records Web Factory as a brand surface system with Nuvia as the current flagship store.

`ecommerce-motion-retention` is installed globally at `C:\Users\PC\.codex\skills\ecommerce-motion-retention`.

Use it for ecommerce landing motion, product-card microinteractions, reveal safety, reduced-motion fallbacks, and conversion-focused scroll rhythm.

`web-factory-visual-intake` is installed globally at `C:\Users\PC\.codex\skills\web-factory-visual-intake`.

Use it whenever Sergio sends screenshots, brand boards, ecommerce references, landing page captures or visual inspiration that should become reusable Web Factory context. The skill extracts layout, typography, section order, conversion logic, motion rules, no-copy boundaries and QA requirements, then stores the result in client context plus `web-factory/data/references/visual/<slug>/`.

`taste-skill` is installed globally at `C:\Users\PC\.codex\skills\taste-skill` from `Leonxlnx/taste-skill`, path `skills/taste-skill`.

Use it for anti-generic landing pages, portfolios and redesigns. Its internal skill name is `design-taste-frontend`; it is not the primary driver for dashboards or complex app flows.

`web-factory-design-director` is installed globally at `C:\Users\PC\.codex\skills\web-factory-design-director`.

Use it before substantial website design work to choose the right combination of design skills and avoid loading every design skill without a reason.

`web-factory-commerce-storefront` is installed globally at `C:\Users\PC\.codex\skills\web-factory-commerce-storefront`.

Use it for ecommerce storefronts, catalog portals, product cards, PDPs, carts, checkout/cotizacion, purchase flows and conversion-focused product UX.

## Repositories To Consult

| Source | License | Local clone | Primary use in Web Factory |
|---|---|---|---|
| `shadcn-ui/ui` | MIT | `C:\Users\PC\.codex\design-stack\repos\shadcn-ui__ui` | Component structure, registry conventions, accessible React patterns. |
| `tailwindlabs/headlessui` | MIT | `C:\Users\PC\.codex\design-stack\repos\tailwindlabs__headlessui` | Accessible unstyled behavior for menus, dialogs, disclosure, listbox. |
| `magicuidesign/magicui` | MIT | `C:\Users\PC\.codex\design-stack\repos\magicuidesign__magicui` | Marketing animation references, effects, and tasteful motion ideas. |
| `markmead/hyperui` | MIT | `C:\Users\PC\.codex\design-stack\repos\markmead__hyperui` | Tailwind v4 ecommerce, landing, nav, card, and form block inspiration. |
| `ibelick/motion-primitives` | MIT | `C:\Users\PC\.codex\design-stack\repos\ibelick__motion-primitives` | Small interaction and reveal patterns. |
| `nolly-studio/cult-ui` | MIT | `C:\Users\PC\.codex\design-stack\repos\nolly-studio__cult-ui` | Premium shadcn-compatible component ideas. |
| `serafimcloud/21st` | MIT | `C:\Users\PC\.codex\design-stack\repos\serafimcloud__21st` | shadcn/Tailwind discovery and component marketplace references. |
| `tremorlabs/tremor` | Apache-2.0 | `C:\Users\PC\.codex\design-stack\repos\tremorlabs__tremor` | Dashboard, KPI, chart, table, and data product UI patterns. |
| `launch-ui/launch-ui` | MIT | `C:\Users\PC\.codex\design-stack\repos\launch-ui__launch-ui` | Next.js/shadcn/Tailwind landing page sections. |
| `nextlevelbuilder/ui-ux-pro-max-skill` | MIT | `C:\Users\PC\.codex\design-stack\repos\nextlevelbuilder__ui-ux-pro-max-skill` | Global design rules and product heuristics. |

## User-Provided Design Source Audit

Latest audit: `web-factory/data/references/design-sources/2026-06-15-user-design-source-audit.json`.
Latest screenshot bank: `web-factory/data/references/design-sources/2026-06-15-reference-bank-screenshots.json`.
Latest gallery examples: `web-factory/data/references/design-sources/gallery-examples/latest-gallery-examples.json`.
Latest licensed-code index: `web-factory/data/references/code-sources/latest-code-cache-index.json`.
Latest reusable code examples: `web-factory/data/references/code-sources/latest-component-code-examples.json`.
Latest Web Factory pattern bank: `web-factory/WEB_FACTORY_PATTERN_BANK_2026.md`.
Latest machine-readable pattern bank: `web-factory/data/references/design-sources/web-factory-pattern-bank-20260624.json`.
Latest deep resource reference pack: `web-factory/data/references/design-sources/gallery-examples/2026-06-24-resource-reference-pack.json`.
Latest deep code reference pack: `web-factory/data/references/code-sources/2026-06-24-component-code-reference-pack.json`.
Deep reference runbook: `web-factory/WEB_FACTORY_REFERENCE_CAPTURE_RUNBOOK.md`.

Heavy local artifacts live outside the repo:

- Screenshots: `C:\Users\PC\.codex\design-stack\screenshots`
- Gallery example screenshots: `C:\Users\PC\.codex\design-stack\gallery-examples-full`
- Licensed/study code repos: `C:\Users\PC\.codex\design-stack\repos`

Use this audit when Web Factory needs current design references from Sergio's curated list:

- Component/block discovery: 21st, shadcn/ui, Efferd, Componentry, Watermelon.
- Motion standards: Motion docs and Motion Primitives.
- Typography pairing: Fontpair.
- Landing-page inspiration and category research: Lapa Ninja.
- Visual mood only: Dribbble shots.
- Product/SaaS landing rhythm: 10x.

## ONIA Approved Client Benchmarks

When creating client-facing websites, landing pages, decks or proposal surfaces,
use these ONIA-approved works as the default internal benchmark:

- Bench.
- Garabato.
- HSB Engineers.

Do not copy them literally and do not reuse client identity, copy, assets or
layout one-to-one. Use them as the quality floor for hierarchy, section rhythm,
spacing, seriousness, conversion focus and amount of content.

If a client needs a different visual direction, create a better or more tailored
direction from that quality level. Do not fall back to generic SaaS sections,
decorative card grids, empty metrics, filler copy or content that does not help
the user decide.

Content rule:

```text
Only include data that helps sell, decide, understand scope, understand value,
understand risk or take the next step.
```

Cut anything added only to fill the page: generic "about" paragraphs, invented
numbers, repeated benefits, decorative blocks, vague promises, redundant FAQs,
and copy that could fit any client.

Policy:

- Scrape structural data only: section order, headings/categories, CTAs, component taxonomy, palette notes and motion principles.
- Do not store or reuse full HTML/CSS, copyrighted copy, screenshots as assets, or third-party brand identity.
- Import code only from sources with confirmed compatible licenses, then retokenize, review accessibility, and validate responsive behavior in Web Factory.
- Playwright is now installed as a `web-factory` dev dependency for standalone scraping. Codex desktop can still use its built-in `node_repl` Playwright runtime for ad-hoc browser work.
- Gallery scraping is intentionally two-layered: keep many lightweight `candidates`, then open a smaller number of `examples` for full screenshots and code-block extraction. This prevents slow/brittle massive captures while still feeding Web Factory many real design options.

Commands:

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

Use `pnpm references:playwright:install` only when the local machine or CI does not have a usable Chrome/Chromium browser. On Sergio's Windows machine, the scripts default to the installed Chrome path.

`capture_reference_bank.mjs` is available for standalone use now that Playwright is installed in `web-factory`. In Codex desktop, the same capture flow can still run through the built-in `node_repl` Playwright runtime.

`scrape_gallery_examples.mjs` captures galleries such as 21st, Lapa, Componentry, shadcn Blocks, Efferd, Watermelon and Fontpair. Standalone CLI use requires Playwright; in Codex desktop, call its exported `scrapeGalleryExamples` function from `node_repl` and pass the runtime Playwright module.

Latest gallery run summary:

- 10 sources merged.
- 168 lightweight gallery candidates.
- 57 detailed examples with desktop/mobile screenshots.
- 124 indexed screenshots, 0 missing files, 0 duplicate paths, 0 strictly blank screenshots in QA.
- 28 code blocks captured from docs where `captureCode` was enabled.
- 240 local component/code examples indexed from compatible cached repos.

## Web Factory Pattern Bank 2026

Use `WEB_FACTORY_PATTERN_BANK_2026.md` before designing a new client website.
It converts current web/design research into ONIA-specific playbooks by rubro:

- Agency / portfolio / creative service.
- Ecommerce / catalog / storefront.
- Engineering / construction / industrial.
- Clinic / health / professional care.
- Local service / repair / installation.
- Restaurant / food / cafe.
- Real estate / property / architecture.
- Education / course / event.
- SaaS / AI / app.
- Legal / finance / consulting.

The pattern bank is the preferred bridge between inspiration and execution:

1. Pick the rubro and page recipe.
2. Confirm the primary CTA and proof required.
3. Decide which real or generated visual assets are needed.
4. Route the work through the relevant skills.
5. Use external references only for structure, section logic, typography,
   motion principles and conversion flow.

Current external research sources added to the bank:

- Lapa Ninja, Landbook, Landingfolio, SaaSFrame, SaaS Landing Page,
  Awwwards, Recent, Mobbin.
- Official technical anchors: shadcn/ui, Tailwind CSS, Motion and web.dev
  Web Vitals.

Policy:

- Lapa/Landbook/Landingfolio/SaaSFrame/SaaS Landing Page/Awwwards/Recent/Mobbin
  are reference-only unless a specific asset or code license is separately
  reviewed.
- Awwwards is useful for art direction and motion, but high risk for overdesign
  in ONIA client work. Translate it into one strong design move, not a whole
  experimental site.
- Mobbin is for product flows and UI copy/UX patterns, not for marketing-page
  visuals.
- If a client site needs images or video to feel real, ask for assets or generate
  placeholders only within the asset rules in the pattern bank.

New source smoke test:

- Artifact: `web-factory/data/references/design-sources/gallery-examples/2026-06-24-new-sources-smoke.json`.
- Passed automated harvest: Landingfolio, SaaSFrame, SaaS Landing Page,
  Awwwards, Recent and Mobbin.
- Manual-only for now: Landbook returned 403/Cloudflare in the Playwright
  harvester, so it stays in research docs but is not listed in automated
  `gallery-reference-sources.json`.

## Deep Reference Pack 2026-06-24

Use `WEB_FACTORY_REFERENCE_CAPTURE_RUNBOOK.md` when Sergio asks for exact
references, screenshots, URLs, HTML structure, fonts, images, videos or code
reference for Web Factory.

Current deep visual/resource artifact:

```text
web-factory/data/references/design-sources/gallery-examples/2026-06-24-resource-reference-pack.json
```

It contains:

- 16 configured sources.
- 143 selected candidates.
- 28 detailed examples.
- 56 desktop/mobile screenshots with SHA-256 hashes.
- 574 image resource URLs.
- 37 video resource URLs.
- HTML outline, semantic landmarks, nav/forms, CTAs, palettes, font signals,
  resource links and technology signals.

Current deep code artifacts:

```text
web-factory/data/references/code-sources/2026-06-24-code-cache-index.json
web-factory/data/references/code-sources/2026-06-24-component-code-reference-pack.json
```

They contain 12 reviewed cached repos and 471 bounded code samples. Only repos
marked `allowed-after-review` may inform commercial client code, and still must
be reviewed, retokenized and validated inside the target project.

Boundary:

- Store exact URLs, screenshots, resource inventories and HTML outline.
- Do not store or reuse full proprietary HTML/CSS/JS, images, videos, logos or
  copy from closed sites.
- Treat Awwwards, Dribbble, Lapa, Mobbin, Landingfolio, SaaSFrame and similar
  galleries as inspiration and structure, not client assets.

## Ecommerce Purchase Reference Studies

Use `ECOMMERCE_PURCHASE_REFERENCES.md` when Web Factory needs purchase-flow, product listing, PDP, card-density or checkout-readiness guidance.

Latest ecommerce function scrape:

- ISDIN Espana: `web-factory/data/references/design-sources/ecommerce-reference-studies/2026-06-17-isdin-es.json`
- Human summary: `web-factory/ECOMMERCE_PURCHASE_REFERENCES.md`
- Raw screenshots/data: `C:\Users\PC\.codex\design-stack\screenshots\isdin-20260617\`

Policy:

- Reuse ecommerce functions and section logic only.
- Do not reuse third-party product imagery, copy, visual identity, prices, review counts, loyalty points or checkout behavior unless the client owns and supports them.
- For Nuvia, use this reference mainly for future PLP/PDP expansion after more products are added.
- For generated stores, implement a real cart interaction even when payment is not configured: add-to-cart, quantity changes, remove/clear, persisted cart state and a checkout/cotizacion CTA. If prices or payment/contact channels are missing, label the result as cotizacion and do not invent checkout completion.

## Motion Standard

For generated websites:

- Use native `scroll-behavior: smooth` plus `scroll-padding-top` for anchor navigation.
- Use `IntersectionObserver` and `data-reveal` for reveal-on-scroll sections.
- Animate opacity and transform only for routine UI motion.
- Keep hover motion subtle: 150ms to 300ms for microinteractions, 500ms to 800ms for hero entrance/reveal.
- Always include `prefers-reduced-motion: reduce`.
- Validate mobile and desktop for no horizontal overflow, no text overlap, and no layout shift from animation.

## Nuvia Implementation Notes

Nuvia now has two useful layers:

1. Next.js implementation for the flagship/professional store experience.
2. Static `store` template for export/generation tests.

When Sergio asks for a serious client store or a reusable Web Factory quality benchmark, prefer the Next.js pattern first. Use static HTML only when the requested deliverable is explicitly a generated static site or export artifact.

Next.js Nuvia pattern:

- Route source: `web-factory/apps/site/src/app/nuvia/page.tsx`.
- Product route source: `web-factory/apps/site/src/app/nuvia/productos/[slug]/page.tsx`.
- Main React surface: `web-factory/apps/site/src/components/nuvia/nuvia-store.tsx`.
- Shared data helper: `web-factory/apps/site/src/lib/nuvia-data.ts`.
- Public asset mirror: `web-factory/apps/site/public/nuvia/assets/`.
- Commerce state: client-side cart with localStorage, quantity controls, remove/clear, cart count and checkout/cotizacion CTA.
- Catalog portal pattern: for serious stores, split campaign landing from catalog when products need room to browse. `/nuvia` is the landing; `/nuvia/catalogo` is the canonical PLP with filters/facets, product detail links, quantity controls and add-to-cart actions. Avoid repeated product grids on the landing.
- PDP checkout pattern: product routes should expose a sticky quick-checkout bar inspired by mature ecommerce references: product thumbnail/title, quantity stepper, price or cotizacion state, add-to-cart and cart access. Do not copy third-party pricing, claims, loyalty systems or visual identity.
- Motion: IntersectionObserver reveal, product-stage tilt, hover microinteractions, smooth anchors and reduced-motion fallback.
- PDP rule: keep product detail pages concise and purchase-focused; use one media hero, buybox, practical chips and accordions. Do not repeat landing sections on PDPs.
- Validation URL: `http://localhost:4174/nuvia` when served with `next start -p 4174`.
- Latest Next screenshots:
  - `C:\Users\PC\.codex\design-stack\screenshots\nuvia-next-desktop-20260617.png`
  - `C:\Users\PC\.codex\design-stack\screenshots\nuvia-next-mobile-20260617.png`
  - `C:\Users\PC\.codex\design-stack\screenshots\nuvia-next-pdp-isdin-20260617.png`

The static `store` template still follows the latest Nuvia visual intake direction while preserving the video hero:

- `data-reveal` attributes and a small inline `IntersectionObserver` script generated by `renderStoreRevealScript`.
- Reveal content is visible by default, then enhanced by `.store-motion-ready`; a timeout fallback prevents blank sections in headless screenshots or missed observer events.
- Reduced-motion fallback reveals content immediately and disables smooth scroll.
- Full-bleed `heroVideo` remains the first visual signal when provided by client data.
- Minimal ecommerce flow inspired by the user-provided exactly.ai reference and refined with Impeccable rules: header, video hero, product catalog, cart drawer, discount subscription, FAQ, final CTA and footer.
- Large Apple-like typography, restrained color accents, compact navigation and product-first content.
- Hero stage now behaves like a product vitrine: real ISDIN/SVR cards, monthly discount copy and Nuvia accent dots.
- Product cards are scalable catalog cards with product badge, brand/size, routine step, key ingredients, benefits, detail link and add-to-cart button.
- Store pages include product detail pages plus a shared localStorage cart drawer. Prices can calculate only when `precioValor` exists; otherwise the cart remains in honest cotizacion mode.
- Apple-style typography direction currently uses Onest with system UI fallback for the generated static store.

When creating new templates, copy the pattern concept, not necessarily the exact Nuvia visuals. Brand, color, content density, and motion should come from the client data and context file.

Latest validation screenshots:

- `C:\Users\PC\.codex\design-stack\screenshots\nuvia-hero-desktop.png`
- `C:\Users\PC\.codex\design-stack\screenshots\nuvia-hero-mobile.png`
- `C:\Users\PC\.codex\design-stack\screenshots\nuvia-retention-desktop.png`
- `C:\Users\PC\.codex\design-stack\screenshots\nuvia-retention-mobile.png`

## Deferred Sources

- `DavidHDev/react-bits`: visually strong and high-star, but license was unclear in the audit, so it is inspiration-only until verified.
- MUI and Chakra: strong design systems, but outside the current Tailwind/shadcn factory direction.
- GPL/AGPL sources: rejected for client websites.
- `swishy.ai` (reel 2026-09-18): motion graphics generados por IA. Fuera de la UI de cliente por la regla «la interfaz nunca la dibuja la IA»; candidata solo para piezas de redes.
- `replit.com` (reel 2026-09-18): builder por prompt, no galería. No reemplaza Claude Code + Web Factory.
