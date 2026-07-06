# Web Factory — Landing Design Standard

Piso de calidad para toda landing nueva o rediseñada, agnóstico de rubro.
landing-clinic v2 (`web-factory/packages/blocks/src/clinic-*.ts`,
`web-factory/packages/templates/src/landing-clinic.ts`) es el ejemplo
canónico — no la única forma válida, sino la vara.

## Piso de calidad (checklist)

- [ ] ≥4 Required Qualities presentes: jerarquía por escala, ritmo
      no-uniforme, profundidad/layering, tipografía con carácter, color
      semántico, estados hover/focus diseñados, bento/editorial, motion con
      propósito.
- [ ] Hero elegido por el dispatcher de variantes (`resolveHeroVariant` en
      `clinic-hero.ts`), nunca hardcodeado a una sola composición.
- [ ] Imagen real o marcada como stock (`.context.md`) en el hero **y** al
      menos una banda editorial a mitad de página.
- [ ] Motion scroll-driven progresivo: `@supports (animation-timeline: ...)`
      + `prefers-reduced-motion: no-preference`, con fallback visible.
- [ ] `:focus-visible` en todo interactivo, con contraste sobre foto y sobre
      fondo claro/oscuro (anillo + halo, no solo `outline` default).
- [ ] Tokens-only CSS: cero color hardcodeado en bloques/templates.
- [ ] Íconos SVG reales de un set canónico (`icons.ts`), nunca iniciales.

## DO

- Bento asimétrico para ofertas agrupadas (`clinic-services.ts`).
- Timeline conectada para procesos (`clinic-process.ts`), no cards clonadas.
- Marquee reutilizable para sellos/beneficios repetibles (`marquee.ts`), con
  pausa en hover y `aria-hidden` en la copia duplicada.
- Copy parametrizable con default sensato (`disponibilidad`,
  `ctaSecundariaTexto`) para que un bloque compartido sirva a cualquier
  rubro. Nunca texto de un solo vertical hardcodeado en un componente
  "genérico" (bug real encontrado y corregido en esta sesión: "Ver
  tratamientos" y "Atención con turno" estaban fijos en las 3 variantes de
  hero).
- Heurísticos (como `pickCredencialIcon`) con vocabulario amplio, no sesgado
  a un solo rubro.

## DON'T

- Hero "texto izquierda + imagen derecha" como única composición
  considerada.
- Grids de cards idénticas (mismo tamaño, mismo ícono, cero variación).
- Gradient-text, glassmorphism decorativo por defecto, hero-metric-SaaS-
  cliché.
- Copy o íconos que asumen un solo vertical dentro de un bloque compartido.
- Generar (no adaptar) datos de prueba como si fueran reales; stock siempre
  marcado en `.context.md`.

## Referencias

- `WEB_FACTORY_HERO_VARIANTS.md` — sistema de variantes de hero y cómo
  agregar una nueva.
- `WEB_FACTORY_PATTERN_BANK_2026.md` — playbooks por rubro, quality bar
  universal, fuentes de investigación permitidas.
- `WEB_FACTORY_SKILL_STACK.md` — flujo de skills para construir/rediseñar.
- Implementación canónica: landing-clinic v2, PR con los commits desde
  `2b78196e` (rediseño full-bleed) en adelante.
