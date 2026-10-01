---
name: web-factory-design-director
description: Select and coordinate the right design skill stack for ONIA Web Factory website creation. Use when the user asks to use design skills, improve a website visually, build a landing/store/SaaS page, analyze references, apply taste, choose components, avoid generic AI design, or turn screenshots/URLs into reusable Web Factory design knowledge.
---

# Web Factory Design Director

Use this skill before substantial website design or redesign work. Its job is to choose the smallest effective set of design skills, define the design read, and prevent generic or overbuilt pages.

## Design Read

Before editing UI, state one concise design read:

`Reading this as: <site type> for <audience>, with <brand/commercial goal>, using <visual language>, validated through <skills/tools>.`

If a single missing decision can change the result materially, ask one specific question. Otherwise proceed.

## Skill Routing

Do not load every design skill blindly. Pick the stack by task:

- User sends screenshots, brand boards, landing references, Dribbble/Lapa/website captures: use `$web-factory-visual-intake`.
- User asks for taste, anti-generic landing, portfolio, marketing page, or redesign direction: use `$taste-skill` / installed `design-taste-frontend`.
- User asks for broad UI/UX guidance, palettes, font pairings, product-type heuristics, accessibility or layout review: use `$ui-ux-pro-max`.
- User asks for production polish in an existing repo: use `$impeccable` and follow its context/register requirements.
- User asks for ecommerce, products, catalog, cart, PDP, checkout, subscription, conversion or purchase flow: use `$web-factory-commerce-storefront` plus `$ecommerce-motion-retention`.
- User asks for implementation quality, component structure, state, responsiveness, accessibility, or production UI code: use `$frontend-ui-engineering`.
- User asks to verify locally, inspect a route, screenshot, click, or test UI: use Browser/Playwright.

## Build Rules

1. Read project context before design changes.
2. Preserve client brand assets unless the user explicitly changes identity.
3. Make the first screen useful, not a marketing placeholder.
4. Prefer fewer high-signal sections over long repeated pages.
5. Choose one typography direction and one component language per site.
6. For ecommerce, prioritize buying clarity over decorative storytelling.
7. Use references structurally; do not copy identity, proprietary copy, or unsupported claims.
8. Add motion only where it improves comprehension, product confidence, or conversion.
9. Validate desktop and mobile before closing.
10. Document reusable lessons in the client context and design stack.

## Reference

Read `references/skill-routing.md` when deciding which skills to combine or when auditing the design stack itself.
