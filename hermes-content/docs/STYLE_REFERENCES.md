# Style References for Onia

## Purpose
Hermes uses Pinterest and professional references as inspiration, not as source material to copy.

## What to extract
- Topic.
- Audience.
- Hook type.
- Narrative shape.
- Slide rhythm.
- Visual system.
- Color feel.
- Trust signals.
- CTA style.
- What not to copy.

## Content angles
- "Estas tareas ya no deberian hacerse a mano."
- "Como una pyme boliviana puede usar IA sin contratar un equipo tecnico."
- "Errores que hacen perder leads en WhatsApp/Instagram."
- "Automatizacion practica para clinicas dentales."
- "Antes/despues de un proceso con IA."
- "Checklist para saber si tu negocio esta listo para automatizar."

## Onia quality bar
- Clear Spanish.
- Practical business value.
- One idea per slide.
- Professional visuals.
- Onia green as accent, not full palette.
- Useful for Bolivian businesses, clinics, SaaS, automation, CRM, WhatsApp, Instagram and sales.

## Good reference types
- Professional B2B carousels.
- SaaS explainer posts.
- Clinic/dental software content.
- Automation workflow examples.
- High quality landing pages.
- Pinterest pins with clean visual hierarchy.
- Creator videos with strong hook, pacing, retention, scene grammar or CTA.

## Instagram carousel references

Instagram carousels shared by Sergio are stored in:

```text
hermes-content/references/style-references.json
```

For each carousel, extract:

- hook and first-slide job;
- slide-by-slide rhythm;
- visual hierarchy;
- CTA mechanism;
- caption strategy;
- Onia adaptation ideas;
- exact elements that must not be copied.

Do not save third-party carousel images as Onia assets unless Sergio provides
explicit usage rights. Use them as analysis references only.

## Bad reference types
- Guru hype with no substance.
- Fake metrics.
- Stolen screenshots.
- Overcrowded AI neon visuals.
- Designs that only work because of another brand identity.

## Reference schema

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
  "visual_system": "large headline, supporting text, simple icon, green accent",
  "color_feel": "neutral with green accent",
  "trust_signals": ["specific examples", "process steps"],
  "cta_style": "soft consultation",
  "onia_adaptation": "checklist para no perder leads de Instagram y WhatsApp",
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

## Rule
Reject any reference with ethical safety below 4.

## Creator Video References

Creator videos must be stored separately from static/Pinterest references:

```text
hermes-content/references/creator-video-references/
```

Use creator videos as structural inspiration only. Extract:

- first 2 seconds;
- hook type;
- camera behavior;
- cut rhythm;
- scene progression;
- subtitle style;
- proof mechanism;
- CTA;
- what Onia can adapt;
- what must not be copied.

Never copy a creator's exact words, face, brand, edit sequence, music, captions
or proprietary product framing. If a reference depends on the creator's personal
likeness, treat it as rhythm/structure only.

## Example adaptation

Reference pattern:
- Hook: "5 errores que te hacen perder clientes"
- Rhythm: one mistake per slide
- CTA: "Comenta AUDITORIA"

Onia adaptation:
- Title: "5 errores que hacen que tu clinica pierda pacientes por WhatsApp"
- Audience: clinicas dentales en Bolivia
- Slides:
  - No respondes en menos de 5 minutos.
  - No haces seguimiento automatico.
  - No separas consultas de pacientes reales.
  - No tienes recordatorios de cita.
  - No mides de donde vienen los leads.
- CTA: "Escribenos AUDITORIA y revisamos tu proceso."
