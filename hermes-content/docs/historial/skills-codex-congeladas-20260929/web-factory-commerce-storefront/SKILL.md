---
name: web-factory-commerce-storefront
description: Build, improve, or review ONIA Web Factory ecommerce storefronts and product websites. Use for client stores, multiproduct catalogs, product landing pages, PLP/catalog portals, PDP pages, carts, checkout/cotizacion flows, product cards, product imagery, pricing/contact readiness, subscription offers, and conversion-focused ecommerce UX.
---

# Web Factory Commerce Storefront

Use this skill when a Web Factory site must sell products, not just look good. The output should be a usable storefront: clear offer, canonical catalog, product detail pages, real cart state, honest checkout/cotizacion state, and documented rules for future generated stores.

## Required Context

Before editing, read:

1. `COORDINATION_MANIFEST.md` and `HERMES_EXECUTION_PROTOCOL.md` when inside `C:\dev\proyectos\onia-hermes`.
2. `web-factory/DESIGN_STACK.md`.
3. `web-factory/data/clients/<client>.context.md` when the client exists.
4. `web-factory/data/clients/<client>.json` or the equivalent product data source.
5. The current route/component/CSS files for the site being changed.

If the user provided screenshots or references, also use `$web-factory-visual-intake` first.

## Workflow

1. Define the commerce path:
   - primary buyer action;
   - catalog entry point;
   - product detail route;
   - cart behavior;
   - checkout/contact fallback.
2. Remove duplicate sections before adding UI. A product may appear in the hero preview and in the catalog, but the catalog is the canonical full list.
3. Build the storefront structure:
   - hero or first viewport with brand and product signal;
   - one catalog portal with filters/facets;
   - product cards with detail link and add-to-cart or consult CTA;
   - concise guide only if it reduces buying confusion;
   - discount/subscription only if it has a clear commercial role;
   - FAQ only for real purchase objections;
   - final CTA/footer.
4. Build product detail pages as PDPs, not mini landing pages:
   - large product media;
   - title, brand, size, concise description;
   - chips for key attributes;
   - sticky or prominent checkout bar;
   - quantity controls;
   - add-to-cart button;
   - accordions for details, indications, ingredients, precautions;
   - no repeated landing sections unless they answer a product-specific objection.
5. Make commerce honest:
   - do not invent prices, stock, delivery, medical outcomes, reviews, ratings, loyalty points, or payment completion;
   - if `precioValor`, stock, payment provider, WhatsApp, or email are missing, label the flow as cotizacion or contacto pendiente;
   - persisted cart state is acceptable even when final checkout is not configured.
6. Use motion for buying clarity:
   - reveal sections safely with visible-by-default fallback;
   - animate opacity/transform only for routine UI;
   - add microinteractions to cards, filters, CTAs, quantity controls, cart drawer, and FAQ;
   - respect `prefers-reduced-motion`.
7. Validate:
   - run lint, tests, and build when available;
   - inspect desktop and mobile screenshots;
   - test filters, quantity controls, add/remove/clear cart, persistence, and checkout fallback;
   - check no horizontal overflow, clipped product images, hidden text, or blank reveal sections.
8. Document the pattern:
   - update the client context file with reusable decisions;
   - update `web-factory/DESIGN_STACK.md` only for cross-client rules.

## Reference

For concrete storefront patterns and Nuvia-derived rules, read `references/storefront-patterns.md`.
