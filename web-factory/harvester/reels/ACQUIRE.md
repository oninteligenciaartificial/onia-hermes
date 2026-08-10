# Acquire A Web Model From A Reel (the Claude side)

Goal: watch the reel, and when it shows a **web page**, comprehend that page's
design as a **model the factory can build from** — then store it as a reusable
blueprint. This turns "a reel showed a nice site" into acquired factory knowledge,
so we generate similar sites fast and faithfully.

This is step 2, after ANALYZE.md has produced the reel analysis (`showcasedSite`).

## Watch the video, focus on the web page

The reels that matter here are website showcases (agency/portfolio, "I built this",
POV design reels). To comprehend the model:

1. Find the frames where the site is actually on screen. Scrub the video — with
   the browser, control the `<video>` by JS: pause it, then `currentTime = t` for
   several `t` across the reel and capture each frame (this is how the Le Cercle /
   COSTERS models were acquired). Watch the SITE across its scroll, not one frame.
2. Read the site section by section: what is the hero, what proof, what offer,
   what conversion, what footer. Read the palette, the type, the motion.
3. Ignore the reel's own production styling (lighting, captions) — you want the
   SITE's model, which lives in `showcasedSite`.

## Write the blueprint

Fill the schema in `model-schema.ts` (`webModelSchema`) into
`data/references/reels/models/<model-id>.json`:

- `designTokens`: palette (as tokens with roles), typography (display/body/
  treatment), radius, density, motionLevel — the factory's token seed.
- `sections[]`: the ordered composition, each mapped to a **factory block**
  (`media-hero`, `split-hero`, `bento-grid`, `property-cards`, `inline-contact-form`,
  `stat-strip`, `scroll-story-hero`, …). This is the generation recipe.
- `components[]`, `interactions[]` (each with a reduced-motion fallback).
- `buildWithOnia[]`: concrete steps to rebuild it with ONIA tokens/blocks —
  reuse existing blocks where possible, and name any new block the model needs.
- `assetsNeeded[]`, `bestFor[]` (which client rubros this model suits), `confidence`.

Then compile the library:

```powershell
pnpm reels:acquire        # or: node harvester/reels/build-web-models.mjs
```

This writes `data/references/reels/web-models.json` and
`docs/WEB_FACTORY_LEARNED_MODELS.md`, including the **block library** — the union
of factory blocks the learned models need, i.e. the shopping list for
`packages/blocks`.

## Then generate from a model

When building a client site whose rubro matches a learned model:

1. Pick the model from `docs/WEB_FACTORY_LEARNED_MODELS.md`.
2. Seed `data/clients/<slug>.design.json` from the model's `sections[]` and
   `designTokens`, then run `pnpm design:auto -- <slug> --template <t>`.
3. Build with ONIA blocks, swap in the client's REAL palette and assets, add the
   reduced-motion fallbacks, and run the pre-ship checklist.

## Boundary

A learned model is a recipe, never a copy. Rebuild with ONIA tokens and blocks;
supply the client's own real assets; never reuse third-party footage, code, copy,
music or logos. Trend models are inspiration; client-owned assets only after the
client confirms rights.
