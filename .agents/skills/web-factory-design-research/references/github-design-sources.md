# GitHub Design Sources

Current source file: `web-factory/data/references/design-sources/github-design-repos-20260626.json`.

## Ranking protocol

1. Query GitHub API or GitHub search for current stars, push date and license.
2. Rank by stars, recent activity, license clarity, fit with client rubro and implementation cost.
3. Prefer MIT or Apache-2.0 when code may be reused.
4. Use NOASSERTION or branded systems only as pattern reading.
5. Record exact source URLs and date; do not claim a repo is current without checking.

## Current top sources

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
