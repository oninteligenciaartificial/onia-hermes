# Ecommerce Purchase References

Last update: 2026-06-17

This file stores structural ecommerce references for Web Factory. These are pattern studies, not assets to copy. Use them to improve purchase flow, product detail pages, category pages and conversion logic for generated client sites.

## Rules

- Extract function, hierarchy and conversion logic only.
- Do not copy brand identity, full copy, screenshots, proprietary layouts or product imagery into client work.
- Do not invent prices, stock, reviews, ratings, loyalty points or checkout behavior.
- Add commerce controls only when the client can operationally support them.
- For dermocosmetics, keep medical/skin claims conservative and source-backed.

## ISDIN Espana

Source: `https://www.isdin.com/es`

Reference data:

- Structured study: `data/references/design-sources/ecommerce-reference-studies/2026-06-17-isdin-es.json`
- Raw scrape: `C:/Users/PC/.codex/design-stack/screenshots/isdin-20260617/raw-scrape.json`
- Screenshots:
  - `C:/Users/PC/.codex/design-stack/screenshots/isdin-20260617/home.png`
  - `C:/Users/PC/.codex/design-stack/screenshots/isdin-20260617/category-sun.png`
  - `C:/Users/PC/.codex/design-stack/screenshots/isdin-20260617/category-face-sun.png`
  - `C:/Users/PC/.codex/design-stack/screenshots/isdin-20260617/pdp-fusion-water.png`

### Useful Functions Observed

- Top utility system: country/location notice, shipping promo, account, search and cart preview.
- Navigation: horizontal product-line nav plus category/subcategory pill navigation.
- PLP/category page: category hero, subcategory pills, product count, sorting, product grid and direct detail CTA.
- Product cards: product image, category/line label, badge, rating/reviews, short descriptor, loyalty points, price, stock/new state and CTA.
- PDP: large gallery, title, rating/reviews, benefit chips, loyalty points, price, quantity stepper, primary add-to-bag CTA and detail accordions.
- PDP detail structure: Detalles, Caracteristicas, Indicaciones, Ingredientes and Precauciones.
- Retention blocks: proof/science sections, media carousel, reviews, loyalty/community and newsletter.

### What Web Factory Should Reuse

- Category pills when product count grows.
- Product count and sorting once there are enough products to justify browsing.
- Product-card information density, retokenized for each client.
- PDP buybox with product chips, price/contact state and one primary action.
- Accordions for technical product data.
- Post-CTA proof blocks only when they support a purchase objection.

### What Web Factory Should Avoid For Now

- Loyalty points before CRM exists.
- Review counts or star ratings unless real.
- Quantity selectors before checkout or WhatsApp ordering is configured.
- Country/shipping bars before logistics rules are confirmed.
- Long scientific pages for small client shops unless the product category demands it.

### Nuvia Implications

- Current Nuvia is correct as a short landing plus separate PDPs.
- Next useful upgrade is not another repeated product section. It is better PLP behavior once more products exist: category pills, product count, sorting/filtering and clear product-card states.
- For the two current products, keep price as `Consultar precio` and avoid stock/review/loyalty claims.
- Add the ISDIN-like technical accordion pattern only on PDPs, not on the landing.
- Keep the hero monthly-featured panel as a merchandising preview, not the full catalog.
