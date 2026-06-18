# Nuvia Web Context

Last update: 2026-06-17

## Brand

- Client: Nuvia
- Category: multiproduct ecommerce/storefront
- Current sales focus: multiproduct store with skincare as the first active commerce front.
- Tagline in data: `Protege limpia tu piel`
- Promise: start with a short, trustworthy skincare routine and keep the structure ready for technology, home, fashion, accessories and gifts.
- Tone: modern, friendly, accessible, confident.

## Visual Identity

- Primary navy: `#0F2D52`
- Teal: `#00A7A0`
- Gold: `#F5B400`
- Coral: `#FF6B6B`
- Purple: `#7B4FB5`
- Background cream from data: `#FFFBF4`
- Generated store font direction: Apple-style `SF Pro Display` for headings and `SF Pro Text` for body through client tokens.
- Browser fallback: Google `Inter`, then system UI, `-apple-system`, BlinkMacSystemFont, `Segoe UI`, sans-serif.
- Typography rules: large tight editorial headings, medium weights instead of heavy bold, softened label weights and polished antialiasing.

## Canonical Assets

- Wide logo: `data/clients/nuvia.assets/nuvia-logo-wide.png`
- Icon logo: `data/clients/nuvia.assets/nuvia-icon.png`
- Hero video: `data/clients/nuvia.assets/nuvia-hero-video.mp4`
- ISDIN product image: `data/clients/nuvia.assets/isdin-fusion-water.webp`
- ISDIN cutout product image: `data/clients/nuvia.assets/isdin-fusion-water-cutout.png`
- SVR product image: `data/clients/nuvia.assets/svr-sebiaclear-200ml.webp`
- SVR cutout product image: `data/clients/nuvia.assets/svr-sebiaclear-200ml-cutout.png`
- Generated site asset paths:
  - `assets/nuvia-logo-wide.png`
  - `assets/nuvia-icon.png`
  - `assets/nuvia-hero-video.mp4`
  - `assets/isdin-fusion-water-cutout.png`
  - `assets/svr-sebiaclear-200ml-cutout.png`

## Active Product Data

Nuvia currently has two real active products:

- `ISDIN Fusion Water Magic SPF 50`
  - Brand: ISDIN
  - Size: 50 ml
  - Role: step 2, daily protection
  - Price mode: `Consultar precio`
  - Claims should stay conservative: high daily sun protection, lightweight texture, non-greasy feel, non-comedogenic positioning and urban protection language.
  - Source used: official ISDIN product page and ISDIN educational content.
- `SVR Sebiaclear Gel Moussant`
  - Brand: SVR
  - Size: 200 ml
  - Role: step 1, cleansing
  - Price mode: `Consultar precio`
  - Claims should stay conservative: soap-free cleansing gel for face/body, suitable for sensitive combination-to-oily acne-prone skin, purifies/unclogs pores and leaves a fresh matte feel.
  - Source used: official SVR product page.

Do not invent prices, stock, medical outcomes or cure claims. The site can sell dermocosmetics, but must not replace dermatology advice.

## Current Site Pattern

Nuvia uses the `store` template in `packages/templates/src/store.ts`.

The current direction is an editorial sales landing inspired by the user's exactly.ai reference:

- preserve Nuvia's local `heroVideo` as the first visual signal
- light gray/off-white canvas with generous whitespace
- tiny lowercase navigation and compact header
- oversized tight typography for the selling idea
- product interface mockup in the hero instead of decorative metrics
- one clear catalog section as the only repeated product grid
- one short buying guide that explains the flow without duplicating product cards
- one discount capture block
- FAQ and final CTA only
- restrained use of Nuvia colors: coral CTA, teal product chips, gold/purple/navy only as small brand accents where needed

2026-06-16 refinement:

- Keep the hero video intact and treat it as the first emotional/product signal.
- Use Apple-like SF/Inter typography with a stricter display ceiling and `-0.04em` tracking floor so headings feel large but not cramped.
- Add a compact hero proof row inside the hero only, not a separate repeated benefits strip.
- Treat the hero product stage as a product vitrine: real ISDIN/SVR cards, brand labels and routine step labels.
- The hero product stage must stay visually secondary to the video: translucent glass surface, compact cards, no visible white packshot squares, and positioned so it does not block the main face/product signal.
- Make product cards sales-first: large product image, badge, brand/size, routine role, concise benefits, key ingredients, honest `Consultar precio`, and one clear `consultar` action.
- Avoid repeated visual product sections. The hero can preview up to two featured products, but the catalog is the single source of the full product list.
- Replace the old routine/product-repeat block with a compact buying guide: choose a product, consult availability/price, then complete the assisted purchase when the channel is configured.
- Use a navy/teal discount band for conversion variety, while preserving the calm neutral base.
- `IntersectionObserver` reveal is progressive enhancement only: content is visible by default, `.store-motion-ready` adds animation, and a timeout fallback prevents blank sections.
- Impeccable is installed locally in `.agents/skills/impeccable`; `ecommerce-motion-retention` is installed globally for future ecommerce motion passes.
- Product detail architecture: the landing must stay short and sales-focused. Product cards open separate static pages under `out/nuvia/productos/<product-slug>/index.html`.
- Product page pattern from 2026-06-16 feedback: emulate a clean ecommerce PDP, not a mini landing page. Use large product image on the left, compact purchase/consult panel on the right, honest price state, one primary CTA and collapsible details.

2026-06-17 hero/monthly commerce refinement:

- The hero product mockup is now a monthly sales vitrine, not a repeated routine card. The toolbar copy must say `productos destacados del mes` and the promo badge must say `10% de descuento`.
- Product images inside the hero vitrine must be visibly large, vertically centered and complete. Use taller product frames for vertical dermocosmetic packshots so bottles/tubes are never clipped.
- Technical fit rule: the hero vitrine image should be contained by the `figure` frame with `object-fit: contain`, no internal image padding and no image zoom on hover. Animate the card surface, not the packshot, to avoid clipping.
- Keep the vitrine as a maximum two-product preview. The full catalog remains the only scalable product list when more inventory is added.
- Pattern saved for future Web Factory ecommerce sites: use a "best sellers / featured this month" merchandising block when it helps sell, but adapt the visual language to the client's brand instead of copying the reference. Nuvia uses a dark translucent video overlay, Nuvia accent dots and honest discount copy.
- If a discount message is shown before checkout is configured, keep it as a promotional claim only. Do not invent final prices, stock or automatic checkout behavior.

2026-06-17 Next.js implementation:

- Primary preview is now the Next.js route `web-factory/apps/site/src/app/nuvia/page.tsx`, served locally at `/nuvia`. The static HTML output remains useful for generated-export tests, but the professional storefront direction is Next-first.
- Shared product/client data still comes from `web-factory/data/clients/nuvia.json`; Next reads it through `apps/site/src/lib/nuvia-data.ts`.
- Next public assets live under `web-factory/apps/site/public/nuvia/assets/` and mirror the canonical Nuvia asset folder.
- Main React surface: `apps/site/src/components/nuvia/nuvia-store.tsx`.
- Routes:
  - `/nuvia`
  - `/nuvia/productos/isdin-fusion-water-magic-spf-50`
  - `/nuvia/productos/svr-sebiaclear-gel-moussant`
- Cart behavior is real client-side commerce state: `localStorage` key `nuvia-next-cart-v1`, add/remove/quantity/clear actions, cart count, drawer, persisted selection and checkout/cotizacion CTA.
- Checkout remains honest: if WhatsApp/email/payment is not configured, the CTA routes to `/nuvia#contacto` and labels the order as cotizacion.
- Motion is implemented in React with `IntersectionObserver`, visible-by-default reveal safety, hover microinteractions, product-stage pointer tilt and `prefers-reduced-motion` fallback.
- Images use `next/image`; keep packshots large, contained and visually clean.
- Product pages should stay PDP-first: one large media area, concise product story, buybox, chips, accordions and cart action. Do not add landing-page sections to PDPs.
- Header bug fixed: product header must override the hero header's absolute centering (`left: auto`, `margin: 0 auto`, `transform: none`) so the Nuvia logo remains visible.
- Latest Next validation screenshots:
  - `C:\Users\PC\.codex\design-stack\screenshots\nuvia-next-desktop-20260617.png`
  - `C:\Users\PC\.codex\design-stack\screenshots\nuvia-next-mobile-20260617.png`
  - `C:\Users\PC\.codex\design-stack\screenshots\nuvia-next-pdp-isdin-20260617.png`

Removed/reduced from the previous version:

- repeated benefit strips
- duplicated brand/category/stat sections
- repeated brand cards that restate the same two products
- routine sections that render the same product cards again
- decorative proof bands
- long generic ecommerce explanation blocks
- noisy multiproduct sections before real inventory exists

## Catalog-To-Landing Reference Direction

User-provided references on 2026-06-15:

- `C:\Users\PC\AppData\Local\Temp\codex-clipboard-ecda8147-499f-4125-9f2d-774195eb3922.png`
- `C:\Users\PC\AppData\Local\Temp\codex-clipboard-25cd5e6b-9c45-41e2-8688-0e323a35d918.png`
- `C:\Users\PC\AppData\Local\Temp\codex-clipboard-d1415ca9-9b26-4fc3-8ee1-a212d5c5fb93.png`
- `C:\Users\PC\Downloads\exactly-ai.jpg`

Extracted principles:

- Strong product-first catalog sections.
- Remove anything that repeats the same sales message.
- Use the exactly.ai rhythm: hero with product preview, model/product selection grid, short functional sections, FAQ and restrained footer.
- Make the page feel like a curated buying route, not a generic catalog demo.
- Product cards need real, tappable CTAs.
- FAQ section should use native accessible disclosure behavior.
- Use large, clean, Apple-like typography, restrained spacing and polished motion.
- Keep the hero heading direction close to the selected browser reference, but adapt it to Nuvia's uppercase brand language: oversized, clean, Apple-like, medium weight and product-page calm.
- Keep Nuvia's own palette visible through accents, not by copying the reference colors.

Implemented in the `store` template:

- Skincare routine section using `ordenRutina`.
- Product cards have stable ids and `Consultar` actions.
- Product cards now send `Consultar` to a per-product static page first. The product page must explain what the product includes, key specifications, usage notes and then expose the purchase/contact CTA.
- Product detail sections support `incluye`, `especificaciones`, `detalleImagenes` and `detalleNota` from JSON. Use real assets only; if only one product image exists, reuse it with different framing or pair it with a relevant routine/brand image rather than inventing product photography.
- Product card/detail content can render `marca`, `tamano`, `uso`, `beneficios`, `idealPara`, `ingredientesClave`, `modoUso`, `incluye`, `especificaciones`, `detalleImagenes`, `detalleNota` and `ordenRutina`.
- Action URLs resolve to WhatsApp with prefilled text when configured, email when configured, otherwise `#contacto`.
- WhatsApp can be configured either as a complete `wa.me`/WhatsApp URL or as a raw international number. The generator normalizes raw numbers to `https://wa.me/<digits>?text=...`.
- Current ecommerce rule: Web Factory storefronts should not stop at a brochure/catalog CTA. Generate a real client-side cart by default: add-to-cart buttons, quantity controls, remove/clear actions, persisted `localStorage`, cart count in header, cart drawer, and a checkout/cotizacion action.
- Payment rule: a static generated store can have a real cart, but it cannot claim real payment/checkout until product `precioValor`, stock/delivery rules and `contacto.whatsapp`, `contacto.email` or a payment provider are configured. If prices are missing, cart total must say `cotizacion` or `subtotal pendiente`, never invent totals.
- Product data contract for ecommerce: keep `precio` as display label, use optional `precioValor` plus `moneda` for calculated subtotals, and keep product ids derived from product slugs unless a future `sku` is added.
- Current landing section order: transparent header, video hero with max-two product preview, catalog with summary/facets and scalable product grid, non-duplicated buying guide, discount subscription, FAQ, final CTA and footer.
- Current product page order: transparent/header overlay adapted to the page, single PDP hero, product image, buybox, detail accordions and compact footer.
- Product pages should not repeat landing sections such as routine explanation, related product grids, benefits, discounts or FAQ unless they directly answer a purchase objection for that exact product.
- Product page accordions should stay practical: Detalles, Caracteristicas, Indicaciones, Ingredientes and Precauciones. Keep the content short; avoid visible "que trae" cards, duplicate galleries or extra explanatory sections.
- Product page motion rule: use a focused first-load/stagger animation for the hero, product media, detail gallery, specification blocks and CTA. Keep it transform/opacity/filter based and preserve visible content by default.
- Product imagery rule: packshots should read as cut-out product images. Keep stage/card surfaces translucent and use blend treatment for product images with white backgrounds; avoid visible white square blocks inside the hero product mockup or catalog cards.
- Hero preview rule: if product images have white backgrounds, remove the white-block effect through transparent figure backgrounds, `mix-blend-mode`/drop-shadow treatment and smaller image framing. If the preview competes with the video, reduce size/opacity before changing the hero video.
- Packshot normalization rule from 2026-06-17 feedback: product images used in catalog, hero preview and PDP should use normalized transparent canvases when original cutouts have uneven padding. Current normalized assets are `assets/isdin-fusion-water-normalized.png` and `assets/svr-sebiaclear-200ml-normalized.png`, both centered on a 1400x1400 transparent canvas with matched product height.
- Header rule from 2026-06-16 feedback: keep the header visually transparent over the hero video, make the Nuvia mark larger, use uppercase nav labels and expose the official slogan `EVERYTHING FOR EVERYONE`.
- Brand/category context should be summarized inside the catalog controls, not rendered as another product-looking section. With the current catalog, ISDIN and SVR appear once as product cards and once as text metadata only.
- Font rule from 2026-06-16 feedback: use `Onest` for the current Apple-like clean product aesthetic and avoid falling back to overused Inter-style defaults in generated storefronts.
- Motion remains transform/opacity/filter-based, respects `prefers-reduced-motion`, and cannot leave unrevealed blank sections.
- Latest QA screenshots:
  - `C:\Users\PC\.codex\design-stack\screenshots\nuvia-hero-desktop.png`
  - `C:\Users\PC\.codex\design-stack\screenshots\nuvia-hero-mobile.png`
  - `C:\Users\PC\.codex\design-stack\screenshots\nuvia-retention-desktop.png`
  - `C:\Users\PC\.codex\design-stack\screenshots\nuvia-retention-mobile.png`
  - `C:\Users\PC\.codex\design-stack\screenshots\nuvia-featured-month-hero-20260617.png`
  - `C:\Users\PC\.codex\design-stack\screenshots\nuvia-real-cart-desktop-20260617.png`
  - `C:\Users\PC\.codex\design-stack\screenshots\nuvia-real-cart-mobile-20260617.png`

## Generation

Use:

```powershell
cd C:\dev\proyectos\onia-hermes\web-factory
pnpm generate nuvia --template store
```

Output:

- `web-factory/out/nuvia/index.html`
- `web-factory/out/nuvia/site.css`
- `web-factory/out/nuvia/assets/*`
- `web-factory/out/nuvia/productos/isdin-fusion-water-magic-spf-50/index.html`
- `web-factory/out/nuvia/productos/svr-sebiaclear-gel-moussant/index.html`

## Future Automation Notes

- `heroVideo` is the interchangeable slot for future generated videos.
- Keep Nuvia brand colors visible through logo, palette bars, CTA and overlays.
- Preserve the multiproduct content model: categories, products, benefits and CTA come from JSON.
- Do not hardcode product data in the template; derive counts and sections from `nuvia.json`.
- For future ecommerce clients, reuse the sales-first pattern only when it earns its place: hero preview, one canonical catalog, decision guide without duplicate product grids, discount capture, FAQ and assisted CTA.
- When adding more products, expand `productos` in JSON. The landing grid should scale through the catalog instead of creating new repeated sections for brands, routines or categories.
- Configure `contacto.whatsapp` or `contacto.email` before launch so all `Consultar` buttons become direct purchase/contact actions.
- Subscription is currently a safe static capture pattern that points to contact. Connect it to CRM, n8n or WhatsApp before treating it as a real lead capture flow.

## Research References

- ISDIN official product page: https://www.isdin.com/us/p/fusion-water-magic/4750
- ISDIN product education: https://www.isdin.com/us/blog/isdinnovation/fusion-water-magic-sunscreen/
- ISDIN Spain ecommerce function scrape: `web-factory/data/references/design-sources/ecommerce-reference-studies/2026-06-17-isdin-es.json`
- SVR official product page: https://fr.svr.com/products/sebiaclear-gel-moussant-23
- The Ordinary regimen builder pattern: https://theordinary.com/en-us/regimen-builder.html
- Paula's Choice routine finder pattern: https://www.paulaschoice-eu.com/routine-finder

ISDIN Spain ecommerce scrape impact:

- Useful for future Nuvia expansion: category/subcategory pills, product count, sorting, richer product card states, PDP buybox and accordions.
- Do not copy ISDIN's identity, imagery, full product copy, loyalty points, prices, stock states, ratings or checkout flow.
- Do not copy ISDIN's loyalty points, prices, ratings or checkout identity. Nuvia may use its own cart pattern, but it must stay honest: cotizacion mode until WhatsApp/email/payment, prices, stock and delivery rules are operationally configured.

## Visual Reference Intake

- Reference: `exactly-ai-editorial-landing`
- Source: `C:/Users/PC/Downloads/exactly-ai.jpg`
- Captured: `2026-06-15`
- Artifact: `web-factory/data/references/visual/nuvia/2026-06-15-exactly-ai-editorial-landing.json`
- Summary: Minimal editorial landing with oversized tight typography, light canvas, compact navigation, product/model preview cards, concise functional sections, FAQ, and restrained footer.
- Palette notes: #f4f4f2, #111111, #ff4d38, #ffffff, #d8d8d4
- Template impact:
  - simplify store template section order
  - make first viewport typography-led with a product/interface preview
  - keep only one product selection section
  - keep one short routine or decision-support section
  - use discount capture, FAQ and final CTA as the only lower-funnel blocks
  - use Nuvia colors as accents instead of changing the reference into a color-heavy page
