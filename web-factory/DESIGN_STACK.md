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

## Motion Standard

For generated websites:

- Use native `scroll-behavior: smooth` plus `scroll-padding-top` for anchor navigation.
- Use `IntersectionObserver` and `data-reveal` for reveal-on-scroll sections.
- Animate opacity and transform only for routine UI motion.
- Keep hover motion subtle: 150ms to 300ms for microinteractions, 500ms to 800ms for hero entrance/reveal.
- Always include `prefers-reduced-motion: reduce`.
- Validate mobile and desktop for no horizontal overflow, no text overlap, and no layout shift from animation.

## Nuvia Implementation Notes

The `store` template now follows the latest Nuvia visual intake direction while preserving the video hero:

- `data-reveal` attributes and a small inline `IntersectionObserver` script generated by `renderStoreRevealScript`.
- Reveal content is visible by default, then enhanced by `.store-motion-ready`; a timeout fallback prevents blank sections in headless screenshots or missed observer events.
- Reduced-motion fallback reveals content immediately and disables smooth scroll.
- Full-bleed `heroVideo` remains the first visual signal when provided by client data.
- Minimal ecommerce flow inspired by the user-provided exactly.ai reference and refined with Impeccable rules: header, video hero, product selection, two-step routine, discount subscription, FAQ, final CTA and footer.
- Large Apple-like typography, restrained color accents, compact navigation and product-first content.
- Hero stage now behaves like a product vitrine: real ISDIN/SVR cards, routine step labels and Nuvia accent dots.
- Product cards are horizontal on desktop, stacked on mobile, with product badge, brand/size, routine step, key ingredients, benefits and honest `Consultar precio` CTA.
- Routine rows include product thumbnails and direct consult actions.
- Apple-style typography direction with SF Pro token names, Google Inter fallback, then system UI fallback for the generated static store.

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
