# Nuvia Web Context

Last update: 2026-06-15

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
- SVR product image: `data/clients/nuvia.assets/svr-sebiaclear-200ml.webp`
- Generated site asset paths:
  - `assets/nuvia-logo-wide.png`
  - `assets/nuvia-icon.png`
  - `assets/nuvia-hero-video.mp4`
  - `assets/isdin-fusion-water.webp`
  - `assets/svr-sebiaclear-200ml.webp`

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
- one clear product selection section
- one short routine section
- one discount capture block
- FAQ and final CTA only
- restrained use of Nuvia colors: coral CTA, teal product chips, gold/purple/navy only as small brand accents where needed

Removed/reduced from the previous version:

- repeated benefit strips
- duplicated brand/category/stat sections
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
- Keep the hero heading direction close to the selected browser reference: oversized lowercase, SF/Inter-style, tight tracking, medium weight and product-page calm.
- Keep Nuvia's own palette visible through accents, not by copying the reference colors.

Implemented in the `store` template:

- Skincare routine section using `ordenRutina`.
- Product cards have stable ids and `Consultar` actions.
- Product card content can render `marca`, `tamano`, `uso`, `beneficios`, `idealPara`, `ingredientesClave`, `modoUso` and `ordenRutina`.
- Action URLs resolve to WhatsApp with prefilled text when configured, email when configured, otherwise `#contacto`.
- WhatsApp can be configured either as a complete `wa.me`/WhatsApp URL or as a raw international number. The generator normalizes raw numbers to `https://wa.me/<digits>?text=...`.
- Current section order: header, video hero, product selection, two-step routine, discount subscription, FAQ, final CTA and footer.
- Motion remains transform/opacity-based and respects `prefers-reduced-motion`.

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

## Future Automation Notes

- `heroVideo` is the interchangeable slot for future generated videos.
- Keep Nuvia brand colors visible through logo, palette bars, CTA and overlays.
- Preserve the multiproduct content model: categories, products, benefits and CTA come from JSON.
- Do not hardcode product data in the template; derive counts and sections from `nuvia.json`.
- For future ecommerce clients, reuse the sales-first pattern only when it earns its place: hero, product selection, routine/selection logic, discount capture, FAQ and assisted CTA.
- Configure `contacto.whatsapp` or `contacto.email` before launch so all `Consultar` buttons become direct purchase/contact actions.
- Subscription is currently a safe static capture pattern that points to contact. Connect it to CRM, n8n or WhatsApp before treating it as a real lead capture flow.

## Research References

- ISDIN official product page: https://www.isdin.com/us/p/fusion-water-magic/4750
- ISDIN product education: https://www.isdin.com/us/blog/isdinnovation/fusion-water-magic-sunscreen/
- SVR official product page: https://fr.svr.com/products/sebiaclear-gel-moussant-23
- The Ordinary regimen builder pattern: https://theordinary.com/en-us/regimen-builder.html
- Paula's Choice routine finder pattern: https://www.paulaschoice-eu.com/routine-finder

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
