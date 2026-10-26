# Nuvia Price Automation

Last update: 2026-06-25

## Objective

Keep Nuvia product prices aligned with the current supplier reference prices without manually editing `nuvia.json`.

The automation watches the supplier public catalog, compares the latest prices against the previous reference file, and only rebuilds public Nuvia pricing when a real change is detected.

## Commands

Run from `C:\dev\proyectos\onia-hermes\web-factory`.

```powershell
pnpm nuvia:prices:check
```

Checks current supplier prices and writes a report. It does not update Nuvia catalog files.

Use this mode first when the supplier catalog may include new professional products, unusually low reference prices or removed URLs. If it reports `summary.added` or `summary.removed`, review the product list before applying.

```powershell
pnpm nuvia:prices:watch
```

Checks prices and updates Nuvia only when there are price changes, the catalog membership is stable and the scrape passes safety guards. It also regenerates:

- `data/clients/nuvia.json`
- `data/clients/nuvia.finance.json`
- `data/clients/nuvia.finance.csv`
- `data/references/product-sources/nuvia-hbderm-normalized-20260619.json`
- `data/clients/nuvia.json` merchandising block: use cases, promos, packs and combos
- `data/references/design-sources/ecommerce-shopify-patterns-20260625.json`

```powershell
pnpm nuvia:merchandising
```

Regenerates only the commercial merchandising layer from the current public catalog. Use it after editing product categories, benefits, featured products or public prices when a full supplier scrape is not needed.

```powershell
pnpm nuvia:prices:force
```

Forces a catalog refresh even if no price changes are detected or when the check reports added/removed supplier products. Use it only after a human review confirms that new products, removed products and suspicious prices are acceptable for the public Nuvia catalog.

## Reports

Each run writes:

- latest report: `data/references/product-sources/nuvia-price-watch-latest.json`
- dated reports: `data/references/product-sources/price-watch/nuvia-price-watch-*.json`
- temporary latest scrape: `data/references/product-sources/hbderm-products-latest-check.json`

These watcher outputs are intentionally ignored by Git because they are regenerated on every run. Preserve the decision in `data/clients/nuvia.context.md` or a dated audit doc when a run changes an operating rule.

Report fields:

- `summary.changed`: products with changed prices
- `summary.added`: new products in the supplier catalog
- `summary.removed`: products no longer found in the latest scrape
- `summary.unsafe_scrape`: true when the scrape is too incomplete to trust
- `summary.applied`: true when Nuvia catalog files were refreshed

In `check-only` mode, `summary.applied` stays false even when changes exist. Treat `summary.reason = "Detected price/catalog changes in check-only mode; review before applying."` as a manual approval gate, not as a failed run.

## Safety Guards

The automation does not apply updates when:

- scrape errors exceed `25`
- current product count is below `90%` of the previous known count
- the supplier site returns no usable products
- the supplier catalog has added or removed products and the run is not explicitly forced after review

This prevents publishing bad prices if the supplier site blocks requests, has downtime, changes markup, or returns a partial sitemap.

The normal watcher can auto-apply supplier price/discount changes only when the catalog membership is stable. New products and removed products are treated as a commercial review gate because professional items, bad reference prices or category changes can enter the source catalog without being valid for the public Nuvia store.

Before replacing the canonical supplier source, the watcher creates a timestamped backup of the previous source file. If catalog rebuild, public sanitization, cutout mapping or optional site build fails, the watcher restores that backup and exits with an error instead of leaving a half-updated catalog.

## Pricing Formula

The automation keeps the current Nuvia commercial formula:

- reference price = supplier public price
- target gain = `45%` of reference price
- Nuvia sale price = `reference price - target gain`
- seller commission = `10%` of target gain
- featured discount = `10%` on highlighted products, deducted from net gain

This is a business rule configured by Sergio and should be reviewed if supplier conditions change.

## Merchandising Formula

After every safe price/catalog refresh, the watcher runs `harvester/product/build_nuvia_merchandising.mjs`.

That script derives:

- use cases: customer needs such as first routine, oily skin, tone/spots and simple anti-aging
- promotions: featured-month products and guided routine pack
- packs: one-click groups that add complementary products to the cart
- combos: machine-readable pack steps for future Web Factory templates
- quick sections: compact catalog sections such as sun protection, facial cleansing and anti-aging

Important: pack discounts are not applied as an extra checkout discount yet. Product-level discounts are real in the cart, but pack-level discounts must wait until the backend checkout and database support bundle discount rules. Showing a pack discount before backend support would create a mismatch between UI and payment total.

## Recommended Schedule

Start with one run per day, not hourly. Supplier discounts change periodically, but aggressive scraping increases failure risk.

Recommended cadence:

- daily at `07:30` Bolivia time
- manual run before sending a large quote or campaign
- manual `force` after confirmed supplier promo changes

Codex automation created:

- id: `nuvia-price-and-merchandising-watcher`
- schedule: daily at `07:30`
- behavior: run `pnpm nuvia:prices:check`; auto-apply with `pnpm nuvia:prices:watch` only when the scrape is safe and there are price/discount changes without added/removed products; then run lint, tests and build.
- blocked behavior: when added/removed products or unsafe scrape are detected, report the review gate and do not publish, deploy or push.

## n8n / VPS Integration

Recommended production flow:

1. Cron node runs daily.
2. Execute command:

```bash
cd /opt/onia-hermes/web-factory && pnpm automation:vps:nuvia-check
```

3. Read `data/references/product-sources/nuvia-price-watch-latest.json`.
4. If `summary.applied = true`, the job has already refreshed public catalog, finance files, public sanitization, cutout mapping and merchandising.
5. Then trigger:
   - build/deploy step for the storefront
   - Telegram/Discord notification to Sergio with changed product count
6. If `summary.unsafe_scrape = true`, notify Sergio and do not deploy.

Use `pnpm automation:vps:nuvia-watch` only after reviewing that the catalog
membership is stable. The daily automation must stay in check-only mode by
default.

## Windows Task Scheduler Command

Use this only for local laptop automation:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -Command "cd C:\dev\proyectos\onia-hermes\web-factory; pnpm nuvia:prices:watch"
```

Do not run the local scheduled task and VPS/n8n cron at the same time against the same repo unless there is a git/deploy strategy. One price source should own production updates.

## Public Storefront Rule

The public Nuvia site must not expose supplier names or internal source URLs. Supplier details stay only in internal reports, raw scrape artifacts, migration files and finance sheets.
