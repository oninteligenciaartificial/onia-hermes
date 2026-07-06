# Web Factory — Mi stack de skills de desarrollo/diseño

El flujo de skills que **invoco por defecto** para construir/rediseñar webs de
cliente. Regla: si existe una skill para la tarea, se usa (no reinventar). Este
doc es el índice operativo; el detalle vive en `DESIGN_STACK.md`,
`WEB_FACTORY_PATTERN_BANK_2026.md` y `WEB_FACTORY_HERO_VARIANTS.md`.

## Flujo por fase (encadenar, no cargar todo)

| Fase | Skill / herramienta | Para qué |
|---|---|---|
| 0. Dirigir | **`web-factory-design-director`** | Antes de diseñar: define el *design read* y elige el stack mínimo. Router. |
| 1. Intake visual | **`web-factory-visual-intake`** | Sergio manda screenshots/URLs/refs → estructura reusable en `data/references/visual/<slug>/`. |
| 2. Investigar patrones | **Browser (Awwwards/galerías) + Playwright headless** + `deep-research`/`exa-search` | Ver webs reales del rubro; extraer patrón (no copiar). Método en `WEB_FACTORY_HERO_VARIANTS.md`. |
| 3. Dirección / anti-genérico | **`taste-skill`** (design-taste-frontend) · **`ui-ux-pro-max`** | Dirección visual, paletas, pares tipográficos, jerarquía, evitar diseño AI genérico. |
| 4. Construir | **`frontend-ui-engineering`** · `ui-styling`/`shadcn-ui` + blocks/templates del factory | Componentes, estado, responsive, a11y, código UI de producción. |
| 4b. Ecommerce | **`web-factory-commerce-storefront`** + **`ecommerce-motion-retention`** | Catálogo, PDP, carrito, checkout/cotización, motion de retención. |
| 5. Pulir | **`impeccable`** | Polish de producción, register (brand vs product), anti-patterns, reglas duras. Requiere `PRODUCT.md`. |
| 6. QA | **Playwright / browser** + gates `pnpm e2e` | a11y (WCAG 2.2 AA light+dark), perf (CWV), visual, responsive. |
| Video | **`remotion`/`remotion-video-creation`** (programático) + Higgsfield MCP (generativo) | Hero video, piezas, reels. |

## Reglas duras que aplico siempre (de impeccable + Pattern Bank + design-quality)

- **Contraste**: body ≥4.5:1, texto grande ≥3:1. Nada de gris claro "elegante" ilegible.
- **Tipografía**: hero `clamp()` máx ≤6rem; display `letter-spacing` ≥ -0.04em;
  ≤3 familias; jerarquía por escala+peso (ratio ≥1.25); sin ALL CAPS de body.
- **Anti-template**: ≥4 Required Qualities (jerarquía, ritmo no-uniforme,
  profundidad/layering, tipografía con carácter, color semántico, estados
  hover/focus, bento/editorial, textura, motion con propósito).
- **Hero variado**: usar el sistema de variantes (`WEB_FACTORY_HERO_VARIANTS.md`),
  no repetir "texto izq + imagen der".
- **Mobile-first**, `prefers-reduced-motion`, animar solo transform/opacity/clip-path.
- **Assets**: fotos reales del cliente; stock libre solo como placeholder marcado;
  no fabricar identidad.
- **Cerrar**: gates verdes (`pnpm test`, `pnpm e2e`), commit conventional.

## Fuentes (GitHub / instalación)

- `ui-ux-pro-max` → `nextlevelbuilder/ui-ux-pro-max-skill` (MIT).
- `taste-skill` (design-taste-frontend) → `Leonxlnx/taste-skill`.
- `impeccable` → skill ECC/gstack (instalada global + `.agents/skills/impeccable` con `PRODUCT.md`).
- `web-factory-design-director` / `web-factory-visual-intake` / `web-factory-commerce-storefront` → **propias de ONIA** (`C:\Users\PC\.codex\skills`).
- Código de referencia (estructura, retokenizar): `shadcn-ui/ui`, `magicuidesign/magicui`,
  `markmead/hyperui`, `nolly-studio/cult-ui`, `launch-ui/launch-ui`, `tremorlabs/tremor`
  (ver tabla completa en `DESIGN_STACK.md`).
- Descubrimiento de skills: `daymade/claude-code-skills`, `trailofbits/skills`,
  `ckanner/agent-skills` (auditar licencia antes de adoptar).

## Instalación / mantenimiento

- Skills instaladas: `C:\Users\PC\.codex\skills` (dev/diseño) y `C:\Users\PC\.claude\skills` (catálogo).
- Para adoptar una skill nueva: revisar licencia, instalar, y sumarla a este flujo
  si cubre una fase. `find-skills` ayuda a descubrir; `skill-stocktake` a auditar calidad.
