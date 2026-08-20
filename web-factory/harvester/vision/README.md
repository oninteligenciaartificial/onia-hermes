# Vision Harvester Stub

This folder is intentionally a stub.

Reference-to-code work is run from the Claude side with stitch MCP, an image-to-code
skill, or the global `web-factory-visual-intake` skill, then reviewed before being
copied into `packages/blocks/`.

Use `C:\Users\PC\.codex\skills\web-factory-visual-intake` when Sergio sends a
screenshot or design reference that should become Web Factory context. Store
machine-readable extractions under:

```text
web-factory/data/references/visual/<client-slug>/
```

For public design/source audits from curated URL lists, store summaries under:

```text
web-factory/data/references/design-sources/
```

Store heavy screenshots outside the repo:

```text
C:\Users\PC\.codex\design-stack\screenshots
C:\Users\PC\.codex\design-stack\gallery-examples-full
```

Cache reusable code only from compatible open-source repos:

```text
C:\Users\PC\.codex\design-stack\repos
web-factory/data/references/code-sources/
```

Rules:

- Do not scrape Pinterest or copy a layout literally.
- Use screenshots only as structural references.
- Retokenize all colors to `packages/tokens` CSS variables before a block ships.
- Keep generated blocks in review until a human approves client-facing use.
- Use Playwright to extract structure, headings, CTAs and component taxonomy. Do not store full HTML/CSS from third-party sites.
- Use `extract_web_anatomy.mjs` for the FULL anatomy of one live site (15 layers: tokens, layout, scroll, motion, conversion, performance, a11y, SEO). It is the deep version of `capture_reference_bank.mjs` and its contract is `web-factory/docs/ANATOMIA_DE_UNA_WEB.md`. It stores inventories and aggregates only, never third-party HTML/CSS.
- Use `capture_reference_bank.mjs` for standalone capture when Playwright is installed; otherwise use Codex desktop `node_repl`.
- Use `index_licensed_code.mjs` to classify cloned repositories before adapting code.
- Use `scrape_gallery_examples.mjs` for deep gallery capture. It stores many lightweight `candidates` and a smaller set of opened `examples` with desktop/mobile screenshots, section extraction, CTAs, palette, layout signals, code links and optional code blocks.
- Use `merge_gallery_examples.mjs` to merge per-source gallery runs into `web-factory/data/references/design-sources/gallery-examples/latest-gallery-examples.json`.
- Use `index_component_code_examples.mjs` to create `web-factory/data/references/code-sources/latest-component-code-examples.json` from local repos already marked `allowed-after-review`.
- Use `build_design_intelligence.mjs` to compile gallery screenshots, fonts, motion signals, CTAs and reusable code repositories into `latest-design-intelligence.json`.
- Use `watch_design_references.mjs` for the full recurring pipeline: gallery capture, licensed-code index, component examples, merge and intelligence output.

Current stable indexes:

```text
web-factory/data/references/design-sources/gallery-reference-sources.json
web-factory/data/references/design-sources/gallery-examples/latest-gallery-examples.json
web-factory/data/references/code-sources/latest-code-cache-index.json
web-factory/data/references/code-sources/latest-component-code-examples.json
web-factory/data/references/design-sources/latest-design-intelligence.json
```

Standalone commands from `C:\dev\proyectos\onia-hermes\web-factory`:

```powershell
pnpm references:code-index
pnpm references:code-examples
pnpm references:intelligence
pnpm references:harvest:smoke
pnpm references:harvest:daily
pnpm references:harvest:watch
pnpm references:gallery:merge
pnpm references:gallery:21st
pnpm references:gallery:all
```

Install bundled Chromium only when Chrome is not available locally or when running in CI:

```powershell
pnpm references:playwright:install
```

Deep gallery capture command:

```powershell
node harvester\vision\scrape_gallery_examples.mjs --config data\references\design-sources\gallery-reference-sources.json --source-ids 21st-community-components --max-items 30 --detail-items 2
```

Full recurring capture command:

```powershell
pnpm references:harvest:watch
```

This loops every 24 hours by default and writes:

```text
data/references/design-sources/gallery-examples/<timestamp>-design-harvest.json
data/references/code-sources/<timestamp>-code-cache-index.json
data/references/code-sources/<timestamp>-component-code-reference-pack.json
data/references/design-sources/gallery-examples/latest-gallery-examples.json
data/references/design-sources/latest-design-intelligence.json
docs/WEB_FACTORY_DESIGN_INTELLIGENCE_LATEST.md
```

In Codex desktop, `node_repl` is still useful for ad-hoc captures:

```js
const scraper = await import("file:///C:/dev/proyectos/onia-hermes/web-factory/harvester/vision/scrape_gallery_examples.mjs");
const playwright = await import("playwright");
await scraper.scrapeGalleryExamples({
  playwrightModule: playwright,
  sourceIds: ["lapa-ninja"],
  maxItemsPerSource: 40,
  maxDetailItemsPerSource: 2
});
```
