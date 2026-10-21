# GitHub Design Sources

Current source file: `web-factory/data/references/design-sources/github-design-repos-20260626.json`.

## Ranking protocol

1. Query GitHub API or GitHub search for current stars, push date and license.
2. Rank by stars, recent activity, license clarity, fit with client rubro and implementation cost.
3. Search skill and design-intelligence repos before only official component libraries.
4. Prefer MIT or Apache-2.0 when code may be reused.
5. Use NOASSERTION or branded systems only as pattern reading.
6. Record exact source URLs and date; do not claim a repo is current without checking.

## Top sources (medido el 2026-06-26; volver a mirar estrellas y licencia antes de citar)

| Repo | Stars | License | Web Factory use |
|---|---:|---|---|
| twbs/bootstrap | 174398 | MIT | Responsive baseline and robust components. |
| shadcn-ui/ui | 117438 | MIT | Modern React/Tailwind components. |
| mui/material-ui | 98473 | MIT | Complex forms, tables and dashboards. |
| ant-design/ant-design | 98470 | MIT | Enterprise operating products. |
| tailwindlabs/tailwindcss | 95753 | MIT | Tokens, responsive and custom UI. |
| saadeghi/daisyui | 41178 | MIT | Fast Tailwind prototypes. |
| chakra-ui/chakra-ui | 40480 | MIT | Accessible SaaS component patterns. |
| motiondivision/motion | 32520 | MIT | Purposeful animation and microinteractions. |
| mantinedev/mantine | 31316 | MIT | Form-heavy apps and dashboards. |
| heroui-inc/heroui | 29723 | Apache-2.0 | Modern expressive UI. |
| magicuidesign/magicui | 21357 | MIT | Animated sections with restraint. |
| radix-ui/primitives | 19011 | MIT | Accessible behavior primitives. |

## Skill and design-intelligence sources

| Repo | Stars | License | Web Factory use |
|---|---:|---|---|
| nextlevelbuilder/ui-ux-pro-max-skill | 96483 | MIT | External UI/UX skill reference for design reasoning, styles and anti-generic checks. |
| VoltAgent/awesome-design-md | 93199 | MIT | DESIGN.md library for agent-readable visual direction. |
| DavidHDev/react-bits | 41903 | NOASSERTION | Animated component inspiration; review license before code reuse. |
| alexpate/awesome-design-systems | 25199 | Unlicense | Discovery index for non-obvious design systems. |
| gztchan/awesome-design | 17217 | NOASSERTION | Broad resource discovery, lower priority due to age/license. |
| VoltAgent/awesome-claude-design | 2850 | MIT | Secondary DESIGN.md inspiration source. |
| ttt30ga/awesome-product-design | 2623 | CC0-1.0 | Product-design thinking and UX research links. |
| moumen-soliman/uitripled | 1251 | MIT | Motion-ready UI blocks and landing/page builder inspiration. |

## Local skills to combine

- Use `impeccable` for frontend craft, critique, anti-slop, motion, accessibility, responsive behavior and polish.
- Use `taste-design` for landing/redesign design reads, motion-density dials, hero discipline, image requirements and final pre-flight checks.
- Use `web-factory-intake-assets` before design generation so missing brand assets, photos, videos, products and rights are explicit.

## Output contract

Return:

```text
Sources checked: ...
Recommended references: ...
Rejected references and why: ...
Patterns to extract: ...
Copy-risk guardrails: ...
Next commands: ...
```
