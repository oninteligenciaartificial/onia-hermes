# Nuvia Merchandising Automation

Last update: 2026-06-25

## Objective

Turn the Nuvia catalog into selling paths instead of repeating product grids.

The automation reads the public Nuvia catalog and generates:

- customer use cases
- active promotions
- one-click packs
- routine combos
- quick catalog sections
- reusable Web Factory ecommerce rules

This keeps Nuvia usable as a store template for future clients while avoiding hand-written repeated sections.

## Commands

Run from `C:\dev\proyectos\onia-hermes\web-factory`.

```powershell
pnpm nuvia:merchandising
```

Regenerates only `client.merchandising` inside `data/clients/nuvia.json` and the ecommerce reference file.

```powershell
pnpm nuvia:catalog
```

Refreshes supplier reference data, rebuilds the public Nuvia catalog, sanitizes public data, maps existing product cutouts and regenerates merchandising.

```powershell
pnpm nuvia:prices:watch
```

Checks supplier price changes and, only when the watcher passes its safety gates, refreshes the public catalog and merchandising.

## Files

- Generator: `harvester/product/build_nuvia_merchandising.mjs`
- Public data target: `data/clients/nuvia.json`
- Ecommerce reference target: `data/references/design-sources/ecommerce-shopify-patterns-20260625.json`
- Price watcher integration: `harvester/product/watch_nuvia_price_changes.mjs`
- Next data adapter: `apps/site/src/lib/nuvia-data.ts`
- Next UI: `apps/site/src/components/nuvia/nuvia-store.tsx`
- Styles: `apps/site/src/app/globals.css`

## Output Model

`client.merchandising` contains:

- `casosUso`: buyer problems that route into a specific pack
- `promociones`: current sale messages and eligibility notes
- `packs`: add-to-cart groups with public product snapshots
- `combos`: machine-readable routine steps for future templates
- `seccionesRapidas`: compact catalog groupings for fast shopping modules

Current Nuvia packs:

- `rutina-manana-esencial`
- `control-piel-grasa`
- `tono-y-manchas`
- `antiedad-diario`
- `cuidado-familiar`

## UI Rules

Landing:

- show hero video and featured products
- show use cases as decision shortcuts
- show a 4-step routine: limpiar, tratar, hidratar, proteger
- show a compact pack showcase
- avoid a full catalog grid on the landing

Catalog:

- keep the full product portal in `/nuvia/catalogo`
- show packs before the complete grid
- keep search/lupa, category filters, quantity controls and add-to-cart
- keep product cards compact so 315+ products remain scannable

Product detail page:

- show pack recommendations only when the current product belongs to a pack
- keep standalone product checkout available
- use accordions for details instead of long sales copy

Cart:

- packs add multiple products to the existing cart
- toast notifications confirm pack additions
- the top `comprar` button opens the cart everywhere

## Discount Rule

Do not claim a pack-level discount until checkout supports bundle discount logic.

Current safe behavior:

- product-level featured discounts are real in cart totals
- packs are functional one-click groups
- pack copy may say `pack guiado`, not fake a discount

Future bundle discounts need:

- backend bundle-discount rules
- database fields for bundle eligibility
- server-side checkout recalculation
- visible cart line explaining the discount
- payment total matching the UI total

## Shopify Reference Principles

Use these principles structurally, not as copied design/code:

- [Shopify Help - Product bundles](https://help.shopify.com/en/manual/products/bundles): bundles should group related products and can improve AOV/product visibility.
- [Shopify Help - Automatic discounts](https://help.shopify.com/en/manual/discounts/discount-methods/automatic-discounts): discount eligibility must be enforced in cart/checkout.
- [Shopify Ajax Product Recommendations API](https://shopify.dev/docs/api/ajax/reference/product-recommendations): recommendations should be related/complementary and close to purchase actions.
- [Shopify Blog - Price bundling](https://www.shopify.com/blog/price-bundling): bundles reduce decision fatigue, but margin must be checked before discounting.

## Confidentiality Rules

- Public Nuvia copy must never mention supplier names.
- Public JSON must not include source URLs, supplier margin, seller commission or raw acquisition metadata.
- Supplier/source details stay in internal scrape artifacts, finance files, migrations and operational docs.
- Product images rendered by the storefront should be local cached assets or owned/approved media.

## Web Factory Reuse

For future ecommerce clients:

- generate use cases from product metadata
- generate packs from complementary products, not arbitrary inventory
- keep one canonical catalog page
- keep landing pages focused on one conversion route
- keep discounts honest with backend calculation
- store source principles in `data/references/design-sources/*` for future generators
