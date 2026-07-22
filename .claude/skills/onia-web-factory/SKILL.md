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

## Flujo de skills (en orden)
1. **Intake + dirección:** `brainstorming` → definir estilo concreto (no "clean minimal").
2. **Investigar patrones:** browser (Awwwards/referencias) + `data/references` internas.
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
