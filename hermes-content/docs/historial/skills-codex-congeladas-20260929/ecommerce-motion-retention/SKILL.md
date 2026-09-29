---
name: ecommerce-motion-retention
description: Purposeful motion and retention design for ecommerce landing pages and product storefronts. Use when improving a web shop, landing page, catalog, product cards, purchase flow, subscription CTA, scroll behavior, reveal animation, microinteraction, or conversion-focused visual hierarchy.
---

# Ecommerce Motion Retention

## Overview

Use motion as a sales guide, not decoration. The goal is to make products easier to understand, make CTAs feel responsive, and help the visitor move from hero to product to assisted purchase without visual fatigue.

## Workflow

1. Identify the conversion path: primary product, supporting proof, CTA, assisted purchase, subscription or follow-up.
2. Remove repeated sections before adding motion. If two sections say the same thing, merge them.
3. Define one signature moment above the fold: hero product reveal, video/product staging, or a guided routine transition.
4. Add microinteractions only to active sales elements: buttons, product cards, FAQ rows, tabs, filters, subscription form.
5. Validate desktop and mobile with screenshots. Check no horizontal overflow, no hidden unrevealed content, and reduced-motion behavior.

## Motion Rules

- Use `transform`, `opacity`, `filter`, `clip-path`, and small shadow/color shifts. Do not animate layout properties such as width, height, top, left, margins, or padding unless there is a deliberate FLIP/grid technique.
- Keep hover and press feedback at 120-220ms. Keep scroll reveals at 450-700ms with 35-70ms stagger. Avoid delays that make shoppers wait.
- Use confident ease-out curves: `cubic-bezier(0.16, 1, 0.3, 1)` or `cubic-bezier(0.22, 1, 0.36, 1)`.
- Content must be visible by default. JavaScript may enhance with reveal classes, but a failed script or headless screenshot must never leave blank sections.
- Always respect `prefers-reduced-motion: reduce`. In reduced motion, disable transforms and long animations, preserve color/opacity feedback if useful.
- Animate one list or group per fold. Avoid the reflex of making every section fade up identically.

## Retention Patterns

- Hero: show the actual product or category promise within the first viewport. Keep copy short and concrete.
- Product stage: use 2-4 products max above the fold. Make images large enough to inspect, with brand, product name, and next action visible.
- Catalog: cards should answer brand, use, benefit, ideal customer, and purchase action. Price placeholders should be honest.
- Routine or bundle sections: use ordered steps only when order matters. Pair each step with the exact product.
- Subscription: lead with the offer and input field. Do not bury the discount behind generic marketing text.
- FAQ: answer purchase friction only: price, ordering, delivery, recommendation, skin/health caution, contact.

## Visual Quality Checks

- Run the squint test: the product, CTA, and purchase path should remain obvious.
- Use a restrained spacing rhythm: tight groups inside components, generous separation between distinct decisions.
- Avoid identical repeated card grids. Vary section topology: hero stage, product shelf, routine rail, FAQ stack, final CTA.
- Keep touch targets at least 44px tall. Buttons must look clickable and give pressed feedback.
- Avoid noisy decorative stats, badges, and labels unless they reduce purchase uncertainty.
