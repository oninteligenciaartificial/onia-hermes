---
name: web-factory-visual-intake
description: Extract reusable website, ecommerce, brand, layout, typography, motion, accessibility, and conversion data from user-provided screenshots or reference images and store it in ONIA Web Factory context. Use when the user sends UI screenshots, landing page references, ecommerce references, brand boards, visual inspiration, or asks to make future Web Factory sites learn from an image.
---

# Web Factory Visual Intake

Use this skill to turn visual references into reusable Web Factory knowledge. The goal is not to copy a screenshot; it is to extract the page logic, visual system, product strategy, and implementation rules that can improve generated client sites.

## Workflow

1. Inspect the image directly before editing files.
2. Read the relevant Web Factory files:
   - `web-factory/DESIGN_STACK.md`
   - `web-factory/harvester/vision/README.md`
   - `web-factory/data/clients/<slug>.context.md` when a client is named
   - `web-factory/data/clients/<slug>.json` when the reference changes client data
3. Extract the reference using `references/intake-contract.md`.
4. Separate facts from interpretation:
   - facts: visible text, layout, section order, colors, typography style, components, imagery, CTAs
   - interpretation: why the layout sells, what to reuse, what to avoid
5. Store the extracted reference in Web Factory:
   - append a concise summary to `web-factory/data/clients/<slug>.context.md` for client-specific references
   - add a JSON artifact under `web-factory/data/references/visual/<slug>/` for machine-readable reuse
   - update `web-factory/DESIGN_STACK.md` only when the principle is reusable across clients
   - for curated URL lists, save screenshots in `C:\Users\PC\.codex\design-stack\screenshots` and write the index under `web-factory/data/references/design-sources/`
   - for reusable code, clone/cache only repositories with compatible licenses under `C:\Users\PC\.codex\design-stack\repos`
6. Convert the extraction into implementation directives: section order, content density, typography rules, CTA placement, animation style, responsive checks, and forbidden noise.
7. Validate any resulting site with tests/build/generate and desktop/mobile visual QA.

## Extraction Priorities

Capture these dimensions every time:

- Reference metadata: source path or URL, date, client slug, niche, user instruction.
- Commercial intent: audience, offer, desired action, funnel stage, trust mechanism.
- Information architecture: first viewport, section order, repeated patterns, what should be removed.
- Typography: font mood, scale, weight, letter spacing, line height, casing, density.
- Layout: max width, grid, whitespace, alignment, card rhythm, hero composition, mobile implications.
- Color and material: approximate palette, background, contrast, border/shadow/radius behavior.
- Components: navbar, buttons, cards, forms, product modules, FAQ, footer, tabs, sliders.
- Imagery: asset type, crop, subject, product visibility, realism, decorative vs functional role.
- Motion: scroll behavior, reveal timing, hover behavior, reduced-motion expectation.
- Accessibility and QA: target sizes, focus states, contrast risks, overflow risks, text collision risks.
- Web Factory translation: tokens, schema fields, template changes, client context notes, assets needed.

## Storage Helper

After producing the JSON extraction, run:

```powershell
python C:\Users\PC\.codex\skills\web-factory-visual-intake\scripts\write_visual_intake.py --repo C:\dev\proyectos\onia-hermes --input <json-file>
```

The helper writes the JSON artifact and appends a reference note to the client context file. It does not perform vision analysis; Codex must produce the JSON after inspecting the image.

## Rules

- Do not copy a third-party layout literally. Extract structure, hierarchy, pacing, and conversion logic.
- Do not save proprietary website HTML/CSS/JS as template source. Cache screenshots and structural summaries instead.
- Copy/adapt code only from repositories with compatible licenses such as MIT, Apache-2.0, ISC or BSD after review.
- Treat noncommercial, GPL/AGPL, unknown, marketplace-proprietary and visual-gallery sources as inspiration or study-only.
- Do not invent brand data, product claims, prices, stock, or contact channels.
- Prefer client brand tokens over reference colors unless the user explicitly changes the brand.
- Prefer fewer high-signal sections over long generic pages.
- For ecommerce, optimize for product clarity, trust, CTA readiness, and low-friction assisted purchase.
- Preserve `prefers-reduced-motion`, focus-visible states, and usable touch targets.
- Document user-provided image paths exactly so future sessions can trace the source.
- If the reference contains copyrighted text or brand identity, summarize it and store principles, not reusable copy.

## Useful Standards

Use these as guardrails when turning a reference into implementation rules:

- Apple HIG: typography and layout should support legibility, hierarchy, and adaptable spacing.
- Material Design: styles, motion, and components should create clear hierarchy and usable interaction.
- WCAG 2.2: interactive targets, focus indicators, contrast, and motion should be validated before closing.

Reference links:

- https://developer.apple.com/design/human-interface-guidelines/typography
- https://m3.material.io/foundations
- https://www.w3.org/TR/WCAG22/
