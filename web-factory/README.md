# ONIA Web Factory

Factory for prebuilt ONIA client websites. A client JSON provides brand, colors,
copy, logo and contact data; templates consume those values through CSS custom
properties and generate a ready static site.

## Stack

- Next.js 15 App Router + TypeScript
- Tailwind CSS v4
- shadcn/ui
- pnpm workspaces
- zod for intake and client data validation
- commander for `pnpm client:new` and `pnpm generate <slug>`
- simple-git and cheerio for curated harvesters
- Playwright for standalone gallery/reference scraping

## Setup

```powershell
cd C:\dev\proyectos\onia-hermes\web-factory
pnpm install
```

Create local keys in `.env` when a harvester needs them:

```env
UNSPLASH_ACCESS_KEY=
PEXELS_API_KEY=
GITHUB_TOKEN=
```

`.env`, `out/`, `node_modules/`, `.next/` and `tmp/` are ignored by git.

## Development

```powershell
pnpm dev
pnpm test
pnpm build
```

The demo app renders `data/clients/demo.json` with the `landing` template.
Use `pnpm factory:smoke` to validate the intake generator plus the demo
vertical profiles.

## Create A Client From Key Data

The official Web Factory flow starts with an intake, not a hand-written client
profile. Copy `data/intakes/client-intake.template.json`, fill the key business
data and exact references, then generate the client profile:

```powershell
pnpm client:new -- --input data/intakes/<slug>.json
pnpm design:auto -- <slug> --template landing
pnpm generate <slug> --template landing
```

For ecommerce:

```powershell
pnpm client:new -- --input data/intakes/<slug>.json
pnpm design:auto -- <slug> --template store
pnpm generate <slug> --template store
```

This writes:

```text
data/clients/<slug>.json
data/clients/<slug>.context.md
data/clients/<slug>.design.json
data/clients/<slug>.design.md
out/<slug>/index.html
out/<slug>/site.css
out/<slug>/<slug>.design.json
out/<slug>/<slug>.design.md
```

The context file preserves references, media permissions, operating notes and
missing inputs before delivery.
The design recipe preserves the reasoning layer: inferred rubro, selected
references, screenshot paths/hashes, fonts, CTAs, motion signals, safe code
references, section plan, asset requests, guardrails and QA checklist.

One-command flow:

```powershell
pnpm factory:build -- --input data/intakes/<slug>.json --force
```

Or for an existing client profile:

```powershell
pnpm factory:build -- <slug> --template landing --force
```

## Generate A Site

1. Create `data/clients/<slug>.json`.
2. Validate and generate:

```powershell
pnpm generate demo
```

Output:

```text
out/demo/index.html
out/demo/site.css
```

## Intake And Client Schema

`data/intake-schema.ts` validates the data ONIA should request from a client:

- project slug, template, package and owner
- business name, rubro, offer, description, location, hours and trust proof
- brand colors, typography, references and anti-references
- media inputs: hero video, hero poster, hero image and asset permission
- services, benefits, categories and products
- conversion CTA and contact channels
- SEO and operating notes: domain, hosting, payment methods and legal fields

`pnpm client:new` converts that intake into the renderable client schema.

`data/schema.ts` validates:

- `nombre`, `slug`, `tagline`, `descripcion`, `logo`, `heroVideo`, `heroPoster`
- `colores.primary`, `secondary`, `accent`, `bg`, `fg`
- `tipografia.heading`, `body`
- `contacto.email`, `tel`, `whatsapp`, `direccion`
- `redes.ig`, `fb`, `linkedin`, `x`
- `servicios[]` with `titulo`, `desc`, `icono`
- `referencias[]` with exact source URL and usage notes
- `cta.texto`, `cta.url`
- `seo.title`, `description`, `ogImage`
- Optional client context notes can live next to the profile as `data/clients/<slug>.context.md`.

Defaults are applied for missing optional fields.

## Tokens

`packages/tokens` turns validated client data into CSS custom properties:

```css
--color-primary
--color-secondary
--color-accent
--color-bg
--color-fg
--font-heading
--font-body
```

Blocks and templates read variables only. Do not hardcode client colors in block
markup or CSS.

## Blocks And Templates

- `packages/blocks`: seed blocks `hero`, `features`, `footer`
- `packages/templates`: `landing`, composed from the three seed blocks

The CLI and the Next app use the same template functions.

## Harvester

Only sources listed in `SOURCES.md` are allowed.

Design reference stack:

- Global clone cache: `C:\Users\PC\.codex\design-stack`
- Factory guide: `DESIGN_STACK.md`
- Treat external code as reference until license, accessibility, responsiveness and token compatibility are reviewed.
- Screenshot cache: `C:\Users\PC\.codex\design-stack\screenshots`
- Gallery example cache: `C:\Users\PC\.codex\design-stack\gallery-examples-full`
- Design/source indexes: `data/references/design-sources/`
- Licensed code indexes: `data/references/code-sources/`
- Deep gallery index: `data/references/design-sources/gallery-examples/latest-gallery-examples.json`
- Component code examples: `data/references/code-sources/latest-component-code-examples.json`

Registry wrapper:

```ts
import { addRegistryComponent } from "./harvester/registry/add";

await addRegistryComponent("@magicui/marquee");
```

Magic UI currently documents:

```powershell
pnpm dlx shadcn@latest add @magicui/marquee
```

GitHub templates:

- clone to `tmp/`
- read `LICENSE`
- accept MIT / Apache-2.0
- reject GPL / AGPL
- copy accepted templates to `packages/templates/`

Unsplash:

```ts
await searchUnsplash("dental clinic", 6);
```

HTML blocks:

- accepts `www.shadcnblocks.com` and `efferd.com`
- extracts `<section>`
- stores imported sections under `packages/blocks/imported/`
- retokenizes raw color values to CSS variables for review

Vision:

- `harvester/vision/` contains screenshot, gallery and local-code reference tools.
- `capture_reference_bank.mjs` captures top-level reference pages.
- `scrape_gallery_examples.mjs` captures gallery candidates plus selected detailed examples with Playwright.
- `merge_gallery_examples.mjs` merges per-source gallery runs.
- `index_component_code_examples.mjs` indexes reusable component examples from local repos already marked `allowed-after-review`.
- stitch MCP / image-to-code can still run from the Claude side for screenshot-to-code experiments.
- imported results must be reviewed and retokenized before client use.

Reference scripts:

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
pnpm references:playwright:install
```

`references:harvest:*` is the production reference pipeline: it captures
screenshots/resources from curated galleries, indexes licensed local code,
merges `latest-gallery-examples.json` and writes
`data/references/design-sources/latest-design-intelligence.json` plus the
reader-facing `docs/WEB_FACTORY_DESIGN_INTELLIGENCE_LATEST.md`.

Auto design:

```powershell
pnpm design:auto -- <slug> --template landing
pnpm design:auto -- <slug> --template store --force
```

`design:auto` reads:

- `data/clients/<slug>.json`
- optional `data/clients/<slug>.context.md`
- `data/references/design-sources/latest-design-intelligence.json`
- `data/references/code-sources/latest-component-code-examples.json`

It does not copy third-party work. It selects exact URLs, screenshots, hashes,
font/CTA/motion signals and compatible code references, then writes a recipe for
the designer/generator to follow.
