---
name: web-factory-design-research
description: Use when generating, redesigning, or improving ONIA Web Factory websites with current design intelligence. Searches GitHub and design galleries for high-star, recently active, licensed design systems, component libraries, motion libraries, gallery patterns, screenshots, fonts, and code references; ranks them by stars, recency, license, fit, and copy-risk before using them as inspiration or reviewed code references.
---

# Web Factory Design Research

## Workflow

1. Refresh current sources when design trends, repos or galleries may have changed.
2. Search GitHub for stars, recent `pushed_at`, license, framework fit and issue health.
3. Search design galleries by rubro when a client brief exists.
4. Save exact URLs, screenshots, fonts, CTAs, section patterns, motion signals and code references in canonical Web Factory paths.
5. Rank every reference by:
   - business fit
   - visual quality
   - conversion usefulness
   - license safety
   - copy-risk
   - implementation effort
6. Use references to produce a recipe, not a clone.

## Commands

Use these first when available:

```bash
pnpm references:harvest:daily
pnpm references:intelligence
pnpm design:auto -- <slug> --template <template> --force   # 7 plantillas: WEB_FACTORY_TEMPLATES en web-factory/data/schema.ts
pnpm factory:build -- <slug> --template <template> --force
pnpm factory:smoke
```

## Rules

- Use MIT/Apache repos as code references only after review, retokenization and QA.
- Treat closed websites, galleries and branded examples as structural inspiration only.
- Do not copy identity, copy, product photos, testimonials, claims, logos, brand systems or proprietary layouts.
- For motion, prefer purposeful interactions that improve clarity or conversion. Avoid heavy hero video/animation if performance drops.
- If the client needs images or video, request real assets or explicit permission to generate AI/stock assets before final delivery.

## References

Read `references/github-design-sources.md` before ranking GitHub repos or explaining the source policy.
