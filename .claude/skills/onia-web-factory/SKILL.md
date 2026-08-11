---
name: onia-web-factory
description: Invocar al construir o rediseñar cualquier superficie web en onia-hermes — landings de cliente, el panel onia-center, tiendas/storefronts o secciones de marketing. Impone el stack de diseño anti-template de ONIA, el piso de calidad y los gates antes de main.
---

# ONIA — Web Factory (construir webs anti-template)

Aplica a carriles A (onia-center) y B (landings/sitios cliente). Objetivo: que el output
NO salga genérico. Subagente para delegar: `web-factory-builder`.

## Regla Sergio (por qué existe esta skill)
Mis diseños salen genéricos. ANTES de construir: usar la galería interna
(design-stack cache, `data/references`, Pattern Bank) + skills de diseño, y exigir
**≥4 Required Qualities** (bento, depth/layering, editorial, motion, jerarquía por escala).

## Biblioteca de patrones propia (mirar ANTES de inventar)

`hermes-content/references/ui-patterns/` — patrones de interfaz **vistos en video y
reconstruidos en código por nosotros**. Cada uno es un `index.html` autocontenido, sin
dependencias, que se prueba en 2 s (`npx serve hermes-content/references/ui-patterns` o la
config `ui-patterns` de `.claude/launch.json`).

Nace de una corrección de criterio (2026-08-11): descartar un patrón visual bueno porque el
autor no regala el código es exactamente lo que produce diseño genérico. **Se mira el video
fotograma por fotograma y se rehace.** Cómo se ven los videos: skill `ver-videos`
(`fetch-video.mjs` para reels, `ig-carousel.mjs` para carruseles de imágenes).

Reglas de motion que salieron de reconstruirlos, y que aplican a TODA web nueva:
- Solo `transform` y `opacity`. Si se anima algo layout-bound (`width`), se deja comentado por qué.
- **Lento y visible**: 0.6-0.9 s en las transiciones grandes. Sergio observó que 0.4 s "no se ve".
- Curva `cubic-bezier(0.16, 1, 0.3, 1)` como default para entradas.
- `prefers-reduced-motion: reduce` siempre.
- Casi nada necesita librería: los originales usan framer-motion y salen igual en CSS puro.

**Dónde vive cada nivel** (no armar estructuras paralelas):
- Web entera vista en un reel → **learned model** en `web-factory/data/references/reels/models/`,
  catálogo `web-factory/docs/WEB_FACTORY_LEARNED_MODELS.md`. Proceso ya escrito:
  `web-factory/REELS_INTELLIGENCE_RUNBOOK.md` + `harvester/reels/{ACQUIRE,ANALYZE}.md`.
- Componente suelto → reconstruido en `ui-patterns/` (= lista de compras de `packages/blocks`).
- Patrón de movimiento → `web-factory/docs/MOTION_PATTERN_BANK_2026.md`.
- Corpus transversal de la tanda: `hermes-content/references/ui-patterns/APRENDIZAJE_WEBS.md`.

## Flujo de skills (en orden)
1. **Intake + dirección:** `brainstorming` → definir estilo concreto (no "clean minimal").
2. **Investigar patrones:** **primero `ui-patterns/` (propio)**, después browser
   (Awwwards/referencias) + `data/references` internas.
3. **Taste & sistema:** `taste-design` · `ui-ux-pro-max` · `impeccable` (reglas duras de calidad).
4. **Construcción:** `frontend-design` · `frontend-patterns` · `react-components` · `shadcn-ui` ·
   `ui-styling` · `nextjs-turbopack`.
5. **Revisión:** `design-review` + preview en navegador (verificar en vivo, no pedirle a Sergio que revise a mano).

## Piso de calidad / benchmark
Bench · Garabato · HSB Engineers — tomar su jerarquía, limpieza, ritmo y seriedad como piso,
sin copiar literal. Anti-template: nada de card-grid uniforme, hero genérico, defaults de librería sin tocar.

## Gates antes de main (regla dura)
- **`tsc --noEmit` verde en `web-factory/apps/site`** antes de que el avance llegue a `main`
  (Linux distingue casing de imports; `main` alimenta Vercel `onia-center` + VPS `center.onia.com.bo`).
- No filtrar WIP parcial: si un archivo nuevo importa otro nuevo, van los dos o ninguno.
- E2E/Playwright donde aplique + `code-review` antes de mergear.

## Ojo con el monolito
`onia-center` es un monolito (~14k líneas en 4 archivos). NO rediseñar in situ: reconstruir en
componentes chicos (`src/app/onia-center/components/**`) al lado de prod y hacer swap al final.
