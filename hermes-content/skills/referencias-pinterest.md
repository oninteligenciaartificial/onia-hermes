# Skill: referencias-pinterest

## Objetivo
Usar referencias de Pinterest y fuentes profesionales como inspiracion estructural para contenido de ONIA sin copiar material protegido.

## Guia principal
Leer primero:

```text
/root/.hermes/docs/STYLE_REFERENCES.md
```

## Reglas
- No descargar ni reutilizar imagenes de terceros como assets propios.
- No copiar textos, disenos, composiciones exactas, marcas ni claims.
- Extraer solo patrones: tema, hook, ritmo, tipo de composicion, paleta aproximada, jerarquia y formato.
- Guardar notas propias y URLs de origen.
- Rechazar referencias con seguridad etica menor a 4/5.

## Formato recomendado

```json
{
  "id": "ref-001",
  "source": "pinterest",
  "url": "https://www.pinterest.com/pin/...",
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
  "notes": "usar como referencia de ritmo, no copiar layout"
}
```

## Uso
Cuando el usuario entregue referencias, convertirlas en notas y pasarlas a `carousel-generator` como `--references`.

## Respuesta al usuario

```text
Voy a usar estas referencias como direccion de estilo, no como material para copiar. Extraere patrones de hook, ritmo, composicion y CTA, y creare algo original para ONIA.
```

