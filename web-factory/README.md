# ONIA Web Factory

Factory for prebuilt ONIA client websites. A client JSON provides brand, colors,
copy, logo and contact data; templates consume those values through CSS custom
properties and generate a ready static site.

## Stack

- Next.js 15 App Router + TypeScript
- Tailwind CSS v4
- shadcn/ui
- pnpm workspaces
- zod for client data validation
- commander for `pnpm generate <slug>`
- simple-git and cheerio for curated harvesters

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

## Client Schema

`data/schema.ts` validates:

- `nombre`, `slug`, `tagline`, `descripcion`, `logo`
- `colores.primary`, `secondary`, `accent`, `bg`, `fg`
- `tipografia.heading`, `body`
- `contacto.email`, `tel`, `whatsapp`, `direccion`
- `redes.ig`, `fb`, `linkedin`, `x`
- `servicios[]` with `titulo`, `desc`, `icono`
- `cta.texto`, `cta.url`
- `seo.title`, `description`, `ogImage`

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

- `harvester/vision/` is intentionally a stub
- stitch MCP / image-to-code runs from the Claude side
- imported results must be reviewed and retokenized before client use
