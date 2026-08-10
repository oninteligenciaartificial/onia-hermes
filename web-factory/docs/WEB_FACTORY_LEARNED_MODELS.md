# Web Factory — Learned Models

Generated: 2026-07-22T14:41:34.588Z

Web designs the factory has **acquired** from reels: each is a generation-ready
blueprint (sections → blocks, tokens, interactions) to build a similar site fast.
These are recipes, not copies — rebuild with ONIA tokens and real client assets.

## Summary

- Learned models: 3
- Site types: 3
- Distinct factory blocks needed: 15
- Motion primitives needed: 10

## Block Library (what these models need in packages/blocks)

- `benefit-strip` × 1
- `bento-grid` × 1
- `centered-logo-nav` × 1
- `editorial-headline` × 1
- `editorial-statement` × 1
- `footer-brand` × 1
- `inline-contact-form` × 1
- `media-feature` × 1
- `pill-cta` × 1
- `product-story` × 1
- `property-cards` × 1
- `saturated-product-hero` × 1
- `scroll-story-hero` × 1
- `seal-badge` × 1
- `where-to-buy` × 1

## Motion Library (the animation primitives to build — what makes these feel pro)

Each model's sections carry a precise `motion` spec (entrance, trigger, easing
`[0.22, 1, 0.36, 1]`, duration, stagger, scroll-linked, hover, reduced-motion).
The reusable primitives across all models:

- `scale-zoom` × 8
- `fade` × 7
- `slide-in` × 5
- `staggered-children` × 4
- `clip-path-reveal` × 2
- `scroll-parallax` × 2
- `rotate` × 1
- `spotlight-glow` × 1
- `sticky-nav` × 1
- `type-slam` × 1

Triggers: in-view (12) · on-load (3). Every primitive ships a reduced-motion fallback.

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
