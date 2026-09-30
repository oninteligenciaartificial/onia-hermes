# Storefront Patterns

## Nuvia Lessons

- Preserve the strongest brand/hero media when the user explicitly wants it.
- Use one canonical catalog portal for all products. Do not repeat the same products as brand cards, category cards, routine cards, and product cards.
- A hero can preview up to two featured products, but the full product list belongs in the catalog.
- Product cards should scale for future inventory:
  - product image;
  - badge;
  - brand and size;
  - concise description;
  - benefits or ideal-use chips;
  - detail link;
  - quantity picker;
  - add-to-cart or consult CTA.
- Product images should be complete, centered, and contained. If the source has a white background, normalize/cut out or use a treatment that avoids visible white blocks.
- Product detail pages should feel like ecommerce PDPs:
  - media left, purchase content right on desktop;
  - sticky quick checkout with thumbnail, title, quantity, price/cotizacion, add action, cart action;
  - accordions for practical details;
  - no generic landing-page repetition.
- If prices or final purchase channels are missing, the cart remains real but the final action is cotizacion/contacto. Never fake payment readiness.
- For dermocosmetics and health-adjacent categories, keep claims conservative and add a professional-advice disclaimer when relevant.

## Section Order Default

1. Header/nav.
2. Hero with brand and product signal.
3. Catalog portal with filters and product cards.
4. Short buying guide only if it clarifies selection.
5. Discount/subscription block only if it captures intent.
6. FAQ for purchase objections.
7. Final CTA/footer.

## PDP Default

1. Header.
2. Sticky checkout bar.
3. Product hero/media.
4. Buybox.
5. Detail accordions.
6. Footer.

## No-Copy Boundary

Reference ecommerce sites for mechanics only: category bars, PLP density, PDP buybox, sticky purchase bar, accordions, filters, sorting, quantity steppers. Do not reuse third-party product imagery, exact copy, brand identity, ratings, prices, loyalty points, claims, or checkout promises.

## QA Checklist

- Desktop and mobile screenshots saved.
- Product images not clipped.
- Text does not overlap controls.
- Catalog filters change visible products.
- Add-to-cart respects selected quantity.
- Cart persists to `localStorage` or the app's chosen state store.
- Remove/clear quantity works.
- Checkout fallback is honest when payment/contact is missing.
- Reduced motion does not hide content.
