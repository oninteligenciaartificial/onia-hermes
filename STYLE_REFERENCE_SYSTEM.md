# ONIA Style Reference System

## Purpose
This guide tells Hermes how to turn Pinterest, competitor pages, agency portfolios, SaaS sites, creator posts, and professional references into original ONIA content.

The goal is not to copy. The goal is to extract patterns, taste, structure, and quality bars.

## Reference sources

Use references from:
- Pinterest boards and pins.
- Instagram carousels from agencies and SaaS brands.
- LinkedIn posts from B2B operators.
- Landing pages from SaaS and AI automation companies.
- Dental and clinic software brands.
- Design portfolios and Behance/Dribbble only as visual inspiration.
- ONIA owned work, if available.

Instagram carousels shared by Sergio should be processed into
`hermes-content/references/style-references.json` as pattern notes. Extract
hook, slide rhythm, visual hierarchy, CTA, caption strategy and ONIA adaptation.
Do not save third-party carousel images as ONIA assets unless ONIA has explicit
usage rights.

Avoid weak references:
- Low quality guru carousels.
- Overhyped AI claims.
- Generic motivational content.
- Any reference that relies on copied screenshots, stolen designs, or fake metrics.

## Extraction method

For every reference, Hermes should extract:
- **Topic**: what the piece is about.
- **Audience**: who it speaks to.
- **Hook type**: question, mistake, checklist, myth, before/after, warning, teardown, playbook.
- **Narrative shape**: problem, insight, steps, example, CTA.
- **Slide rhythm**: dense, minimal, alternating, story, list, tutorial.
- **Visual system**: layout, contrast, typography feel, whitespace, icon use, screenshot use.
- **Color feel**: neutral, high contrast, ONIA green accent, monochrome, warm professional.
- **Trust signals**: examples, numbers, process, screenshots, proof, case study.
- **CTA style**: soft DM, audit offer, consultation, comment keyword, save/share.
- **What not to copy**: exact text, layout, images, brand elements, claims.

## ONIA preferred style

### Voice
- Clear Spanish.
- Practical business language.
- Confident but not exaggerated.
- Focus on outcomes: leads, response time, follow-up, sales, operations, fewer manual tasks.
- Explain AI as a business tool, not magic.

### Visual direction
- Professional, clean, direct.
- ONIA green as an accent, not the whole design.
- Strong hierarchy: one idea per slide.
- Use diagrams, process steps, dashboards, chat flows, inboxes, CRM/Chatwoot/n8n visuals when relevant.
- Avoid cluttered “AI neon” aesthetics unless the topic specifically benefits from a tech-forward look.

### Content angles
- “Estas tareas ya no deberian hacerse a mano.”
- “Como una pyme boliviana puede usar IA sin contratar un equipo tecnico.”
- “Errores que hacen perder leads en WhatsApp/Instagram.”
- “Automatizacion practica para clinicas dentales.”
- “Antes/despues de un proceso con IA.”
- “Checklist para saber si tu negocio esta listo para automatizar.”

## Quality scoring

Score each reference from 1 to 5:
- **Business relevance**: does it help sell ONIA services?
- **Originality potential**: can Hermes transform it into something new?
- **Clarity**: is the pattern easy to explain?
- **Visual quality**: is it professional enough for ONIA?
- **Ethical safety**: can it be used without copying?

Use references with total score 18+.
Reject references with ethical safety below 4.

## Reference note schema

Use this JSON shape:

```json
{
  "id": "ref-001",
  "source": "pinterest",
  "url": "https://www.pinterest.com/pin/example",
  "topic": "automatizacion para ventas",
  "audience": "pymes y emprendedores",
  "hook_type": "mistakes",
  "narrative_shape": "problema -> errores -> solucion -> CTA",
  "slide_rhythm": "minimal, one idea per slide",
  "visual_system": "large headline, small supporting text, simple icon, green accent",
  "color_feel": "neutral with green accent",
  "trust_signals": ["process steps", "specific examples"],
  "cta_style": "soft consultation",
  "onia_adaptation": "convertirlo en checklist para no perder leads de Instagram y WhatsApp",
  "do_not_copy": ["exact layout", "headline wording", "icons"],
  "scores": {
    "business_relevance": 5,
    "originality_potential": 4,
    "clarity": 5,
    "visual_quality": 4,
    "ethical_safety": 5
  },
  "notes": "Use as rhythm reference only."
}
```

## Prompt pattern for Hermes

When the user gives references, Hermes should say:

```text
Voy a usar estas referencias como direccion de estilo, no como material para copiar. Extraere patrones de hook, ritmo, composicion y CTA, y creare un carrusel original para ONIA.
```

Then Hermes should create:
- Reference notes.
- Content angle.
- Carousel brief.
- Visual prompts.
- Approval question before publishing.

## Example adaptation

Reference pattern:
- Hook: “5 errores que te hacen perder clientes”
- Rhythm: one mistake per slide
- CTA: “Comenta AUDITORIA”

ONIA adaptation:
- Title: “5 errores que hacen que tu clinica pierda pacientes por WhatsApp”
- Audience: clinicas dentales en Bolivia
- Slides:
  - No respondes en menos de 5 minutos.
  - No haces seguimiento automatico.
  - No separas consultas de pacientes reales.
  - No tienes recordatorios de cita.
  - No mides de donde vienen los leads.
- CTA: “Escribenos AUDITORIA y revisamos tu proceso.”

## Safety rules
- Never publish a third-party image as ONIA content.
- Never copy exact wording from a reference.
- Never claim numbers or results without evidence.
- Never use client logos unless ONIA owns permission.
- If a reference is too specific or branded, only use the abstract pattern.
