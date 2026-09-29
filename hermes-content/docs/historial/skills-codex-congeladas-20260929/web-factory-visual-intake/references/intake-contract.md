# Visual Reference Intake Contract

Use this contract when a screenshot or visual reference should become Web Factory context.

## JSON Shape

```json
{
  "clientSlug": "nuvia",
  "referenceName": "exactly-ai-editorial-landing",
  "sourcePath": "C:/Users/PC/Downloads/exactly-ai.jpg",
  "sourceType": "screenshot",
  "dateCaptured": "2026-06-15",
  "userInstruction": "Use this lettering and design style to order the web, remove visual noise, and document it.",
  "niche": "ecommerce skincare multiproduct",
  "summary": "Minimal editorial landing with oversized type, light canvas, product preview, concise sections, FAQ, and restrained footer.",
  "visibleContent": {
    "headlineStyle": "large tight lowercase editorial headings",
    "sectionOrder": ["hero", "logos/social-proof", "selection grid", "training/product section", "audience accordion", "ownership/legal card", "testimonials", "revenue/CTA", "FAQ", "story cards", "footer"],
    "notableText": [],
    "ctas": ["Try for free", "Get started", "Explore all models"]
  },
  "visualSystem": {
    "palette": ["#f4f4f2", "#111111", "#ff4d38"],
    "typography": "rounded grotesk / Apple-like sans, very tight display tracking",
    "layout": "wide margins, two-column hero, generous whitespace, compact cards",
    "components": ["compact nav", "primary pill CTA", "image cards", "accordion rows", "large statement card"],
    "motion": "subtle reveal and hover only"
  },
  "commerceLogic": {
    "primaryAction": "move user to product/model selection",
    "trustSignals": ["press/logo row", "testimonials", "FAQ"],
    "noiseToRemove": ["duplicated benefit strips", "decorative stats without purchase value"]
  },
  "webFactoryDirectives": {
    "templateImpact": ["simplify section order", "prioritize product preview in hero", "reduce repeated category/proof blocks"],
    "clientContextAppend": true,
    "designStackAppend": true,
    "assetsNeeded": [],
    "validation": ["desktop screenshot", "mobile screenshot", "no horizontal overflow", "buttons usable", "text not overlapping"]
  },
  "doNotCopy": ["third-party logo identity", "exact copy", "exact layout proportions if brand-specific"]
}
```

## Required Fields

- `clientSlug`
- `referenceName`
- `sourcePath`
- `summary`
- `visualSystem`
- `webFactoryDirectives`

## Extraction Checklist

Answer these before writing the artifact:

- What is the first thing the reference wants the visitor to understand?
- What is the conversion action?
- Which sections are essential and which are decorative?
- What typography decisions create the feeling?
- What layout rhythm should be reused?
- What brand-specific details must not be copied?
- How should this change Web Factory templates, client context, or design-stack notes?
- What QA checks would catch a bad implementation?
