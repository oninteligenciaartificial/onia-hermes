# Skill Routing For Web Factory

## Current Design Stack

- `ui-ux-pro-max`: broad design intelligence, palettes, font pairings, product categories, UX rules.
- `impeccable`: production UI craft, brand/product register, anti-pattern detection, polish inside repos.
- `taste-skill` / `design-taste-frontend`: anti-slop landing/redesign taste. Best for marketing pages and portfolios, not dashboards or complex app UI.
- `ecommerce-motion-retention`: ecommerce conversion path, scroll rhythm, microinteractions, reduced-motion safety.
- `web-factory-visual-intake`: turns screenshots and references into client context, JSON artifacts, design stack notes, and no-copy implementation rules.
- `web-factory-commerce-storefront`: real product selling patterns, catalog portals, PDPs, carts, checkout/cotizacion.
- `frontend-ui-engineering`: production implementation, accessibility, responsive code, state, component ergonomics.
- `browser-testing-with-devtools`, `playwright`, `playwright-interactive`: route verification, screenshots, interaction testing.

## Recommended Combinations

### Ecommerce Client Store

Use:

1. `web-factory-design-director`
2. `web-factory-visual-intake` if references were provided
3. `web-factory-commerce-storefront`
4. `ecommerce-motion-retention`
5. `impeccable`
6. Browser/Playwright verification

### SaaS Landing

Use:

1. `web-factory-design-director`
2. `taste-skill` / `design-taste-frontend`
3. `ui-ux-pro-max` for layout/type/color checks
4. `impeccable`
5. Browser/Playwright verification

### App/Dashboard UI

Use:

1. `web-factory-design-director`
2. `frontend-ui-engineering`
3. `ui-ux-pro-max`
4. `impeccable` product register
5. Browser/Playwright verification

## Anti-Patterns To Block

- Long pages that show the same products or claims three times.
- Hero content that blocks important media or product visibility.
- Product images clipped, padded unevenly, or sitting inside obvious white squares.
- Decorative metrics without buying value.
- Fake checkout, fake prices, fake stock, fake reviews, or invented payment readiness.
- Using every skill as a ritual instead of routing to the few that apply.
- Copying code or visuals from galleries without license and retokenization review.
- Animations that hide content, cause layout shift, or ignore reduced motion.

## Handoff Requirements

Every substantial web task should close with:

- files changed;
- validation commands;
- screenshots or route checked;
- what remains blocked by business data, pricing, stock, payment, or contact config;
- documentation updated when the lesson is reusable.
