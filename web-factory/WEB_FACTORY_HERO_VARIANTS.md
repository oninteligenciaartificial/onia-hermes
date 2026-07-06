# Web Factory — Sistema de Variantes de Hero

Objetivo: la fábrica **no repite un molde** de hero. El hero se elige (o se
autoselecciona) entre variantes tokenizadas, para que cada web tenga una
composición acorde al cliente y no siempre "texto a la izquierda, imagen a la
derecha".

## Variantes (`packages/blocks/src/clinic-hero-*.ts`)

| Variante | Composición | Cuándo |
|---|---|---|
| `fullbleed` | Foto a pantalla completa + titular sobre scrim | Foto fuerte de ambiente/producto |
| `split` | Titular masivo en panel claro + foto full-height que sangra | Equilibrio texto/imagen |
| `typographic` | Wordmark gigante + foto superpuesta (layering) | Marca / premium / editorial |
| `video` | Video de fondo mudo en loop (mismo shell que full-bleed) | Cuando hay `heroVideo` |

Todas son tokenizadas (light/dark safe) y con parallax scroll-driven bajo
`@supports (animation-timeline)` + `prefers-reduced-motion`.

## Selección (`clinic-hero.ts` → `resolveHeroVariant`)

1. `client.heroVariant` explícito gana (`fullbleed|split|typographic|video`).
2. `auto`, por señales (más específica primero):
   - `heroVideo` → `video`
   - `rubro` brand-led (estudio/agencia/boutique/estética/moda/joyería…) → `typographic`
   - `heroPoster` → `fullbleed`
   - sin foto → `split`

## Cómo agregar una variante nueva (método repetible)

1. **Investigar**: Awwwards categoría del rubro (o galería del stack) → extraer
   URLs reales → capturar heroes a varias alturas de scroll con Playwright
   headless (ver los scripts efímeros que se usan en `web-factory/tmp/`). El
   screenshot vía CDP se cuelga en esta máquina: usar Playwright headless, no
   el preview MCP.
2. **Extraer el patrón** estructural (composición, layering, motion) — NUNCA
   copiar código, identidad, copy ni fotos de terceros.
3. **Codificar** `clinic-hero-<variant>.ts` (HTML tokenizado, texto escapado con
   `escapeHtml/escapeAttribute`) + CSS en `templates/src/clinic-css.ts`
   (tokens / `color-mix`, dark-safe).
4. **Registrar** en el dispatcher (`switch`) + `resolveHeroVariant` (señal auto).
5. **Test + gates**: `pnpm -C web-factory test` (render + selección) y
   `pnpm -C web-factory e2e` (a11y WCAG 2.2 AA light+dark, perf, estructura).

## Assets

- Cliente real: sus fotos/video. Stock libre (Unsplash License) SOLO como
  placeholder marcado en el `.context.md`. No fabricar identidad (no fingir
  equipo/doctor/pacientes).
- Perf: fotos en WebP optimizado; subir el budget del perf test del vertical si
  el hero lleva foto/video (`tests/e2e/perf.spec.ts`, `maxBytesKb`).

## Estado

- 4 variantes activas (full-bleed, split, typographic, video).
- Próximo: kit de motion (marquee, sticky-scroll), más reglas de rubro, y
  generalizar el sistema a otros templates (`store`, `landing`).
- Método guardado en memoria: `[[web-factory-disenos-genericos]]`.
