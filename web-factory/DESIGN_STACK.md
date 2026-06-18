# Web Factory Design Stack

Last audit: 2026-06-16

This file records the design sources that can inform generated client websites. The global clone cache lives at:

```text
C:\Users\PC\.codex\design-stack
```

Use these repositories as reference material. Do not paste third-party code into a client site until the implementation is reviewed, retokenized, and validated inside `web-factory`.

## Active Skill

`ui-ux-pro-max` is installed globally at `C:\Users\PC\.codex\skills\ui-ux-pro-max`.

Use it for UI structure, responsive layout, interaction quality, accessibility, animation, typography, color, and final UI review.

`impeccable` is installed in this project at `.agents/skills/impeccable` and globally at `C:\Users\PC\.codex\skills\impeccable`.

Use it for brand-register design checks, layout/type/motion polish, anti-pattern detection, and pre-ship quality review. The repo-level `PRODUCT.md` records Web Factory as a brand surface system with Nuvia as the current flagship store.

`ecommerce-motion-retention` is installed globally at `C:\Users\PC\.codex\skills\ecommerce-motion-retention`.

Use it for ecommerce landing motion, product-card microinteractions, reveal safety, reduced-motion fallbacks, and conversion-focused scroll rhythm.

`web-factory-visual-intake` is installed globally at `C:\Users\PC\.codex\skills\web-factory-visual-intake`.

Use it whenever Sergio sends screenshots, brand boards, ecommerce references, landing page captures or visual inspiration that should become reusable Web Factory context. The skill extracts layout, typography, section order, conversion logic, motion rules, no-copy boundaries and QA requirements, then stores the result in client context plus `web-factory/data/references/visual/<slug>/`.

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

node web-factory\harvester\vision\index_licensed_code.mjs --repos-root C:\Users\PC\.codex\design-stack\repos --out web-factory\data\references\code-sources\latest-code-cache-index.json
node web-factory\harvester\vision\index_component_code_examples.mjs --max-files-per-repo 24
node web-factory\harvester\vision\merge_gallery_examples.mjs
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
