# Web Factory — Learned Models

Generated: 2026-08-11T02:56:30.116Z

Web designs the factory has **acquired** from reels: each is a generation-ready
blueprint (sections → blocks, tokens, interactions) to build a similar site fast.
These are recipes, not copies — rebuild with ONIA tokens and real client assets.

## Summary

- Learned models: 5
- Site types: 4
- Distinct factory blocks needed: 22
- Motion primitives needed: 10

## Block Library (what these models need in packages/blocks)

- `footer-brand` × 3
- `benefit-strip` × 2
- `editorial-statement` × 2
- `property-cards` × 2
- `scroll-story-hero` × 2
- `article-cards` × 1
- `bento-grid` × 1
- `centered-logo-nav` × 1
- `editorial-headline` × 1
- `inline-contact-form` × 1
- `inline-quote-form` × 1
- `media-feature` × 1
- `media-hero` × 1
- `newsletter-band` × 1
- `path-cards` × 1
- `pill-cta` × 1
- `product-story` × 1
- `saturated-product-hero` × 1
- `scroll-story` × 1
- `seal-badge` × 1
- `stat-strip` × 1
- `where-to-buy` × 1

## Motion Library (the animation primitives to build — what makes these feel pro)

Each model's sections carry a precise `motion` spec (entrance, trigger, easing
`[0.22, 1, 0.36, 1]`, duration, stagger, scroll-linked, hover, reduced-motion).
The reusable primitives across all models:

- `fade` × 15
- `scale-zoom` × 9
- `staggered-children` × 8
- `slide-in` × 5
- `clip-path-reveal` × 3
- `scroll-parallax` × 3
- `rotate` × 1
- `spotlight-glow` × 1
- `sticky-nav` × 1
- `type-slam` × 1

Triggers: in-view (20) · on-load (5) · none (2) · scroll-linked (1). Every primitive ships a reduced-motion fallback.

## Models

### COSTERS — ecommerce-food (high)

High-contrast luxury gourmet ecommerce built on an editorial bento grid that mixes moody product packshots, named product callouts with price, and lifestyle food photography.

- Flow: centered-logo-nav → editorial-headline → bento-grid → seal-badge → pill-cta
- Best for: ecommerce-food, gourmet/premium products, beauty, boutique retail
- Blueprint: `data/references/reels/models/costers-food-ecommerce.json` · source: https://www.instagram.com/reel/DbBMwhcuuYE/

### BOLD FLAVOR — food-cpg (high)

Punchy single-product CPG landing: one saturated brand-color field, an oversized condensed product name, a single spotlighted packshot and exactly one flavor claim — zero clutter.

- Flow: saturated-product-hero → benefit-strip → product-story → where-to-buy
- Best for: food-cpg, packaged goods, beverages, single-product launches
- Blueprint: `data/references/reels/models/boldflavor-cpg-landing.json` · source: https://www.instagram.com/reel/DZ2r09Rvlei/

### United Carriers — logistics-transport (medium)

Sitio de logistica y transporte de carga donde el scroll mueve una escena 3D que representa la cadena logistica: el visitante 'sigue' la carga desde el deposito hasta la entrega. Alcanzar por este modelo cuando el cliente vende un PROCESO invisible (transporte, importacion, instalacion) y hay que hacerlo visible.

- Flow: scroll-story-hero → scroll-story → benefit-strip → stat-strip → inline-quote-form → footer-brand
- Best for: logistica, transporte, importadora, distribucion, instalacion, cualquier rubro que venda un proceso invisible
- Blueprint: `data/references/reels/models/unitedcarriers-logistics.json` · source: https://www.instagram.com/p/Db0yxc5xnpD/

### FIND Real Estate — real-estate (high)

Inmobiliaria editorial y clara: hero con titular animado, tres caminos explicitos (comprar / vender / alquilar), contenido de mercado como prueba de autoridad y newsletter al cierre. Version LIGERA del rubro inmobiliario, frente al modelo cinematografico lecercle-realestate: alcanzar por esta cuando el cliente necesita convertir, no impresionar.

- Flow: media-hero → editorial-statement → path-cards → property-cards → article-cards → newsletter-band → footer-brand
- Best for: inmobiliaria, corretaje, alquiler temporario, desarrollos, servicios profesionales con 3 caminos de entrada
- Blueprint: `data/references/reels/models/find-realestate-editorial.json` · source: https://www.instagram.com/p/DbmpRmEIN_L/

### Le Cercle — real-estate (high)

Cinematic long-scroll luxury real-estate site that alternates dark full-bleed hero moments with light editorial sections; the visitor 'walks through' the property as they scroll.

- Flow: scroll-story-hero → editorial-statement → media-feature → property-cards → inline-contact-form → footer-brand
- Best for: real-estate, hospitality, premium/luxury brand, architecture
- Blueprint: `data/references/reels/models/lecercle-realestate.json` · source: https://www.instagram.com/reel/DZ7gUXYuXbt/

## How To Generate From A Model

1. Match the client's rubro to a learned model in bySiteType.
2. Open the model JSON: use its sections[] as the composition, designTokens as the token seed, and each section's motion spec.
3. Build with ONIA blocks (see blockLibrary for what each model needs); swap in the client's real palette and assets.
4. Add the motion with the toolkit (packages/blocks/src/motion.ts, see packages/blocks/MOTION.md): map each section's motion spec to a wf-* class. Reduced-motion is built in.
5. Run the pre-ship checklist (real assets, hierarchy, responsive, reduced motion, Core Web Vitals) before delivery.
