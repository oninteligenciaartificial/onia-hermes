---
name: onia-web-factory
description: Invocar al construir o rediseñar cualquier superficie web en onia-hermes — landings de cliente, el panel onia-center, tiendas/storefronts o secciones de marketing. Impone el flujo real del generador de Web Factory (intake → cliente → receta → out/), el stack de diseño anti-template de ONIA y los gates antes de main.
---

# ONIA — Web Factory (construir webs anti-template)

Aplica a carriles A (onia-center) y B (landings/sitios cliente). Objetivo: que el output
NO salga genérico. Subagente para delegar: `web-factory-builder`.

## Lo primero: la web de cliente NO se escribe a mano

`web-factory/` es un **generador de HTML+CSS estático**. Un sitio de cliente sale de
`data/clients/<slug>.json` + un template de `packages/templates/src/`, y se escribe en
`out/<slug>/`. Escribir React/Next a mano para un cliente es trabajar por fuera del motor.

Capas (no confundirlas):
- `data/clients/<slug>.json` — perfil del cliente (marca, colores, contacto, servicios, productos).
- `packages/blocks/src/` — bloques (hero, features, footer, faq, process, trust, clinic-*).
- `packages/templates/src/` — composición por template.
- `packages/tokens/src/` — tokens CSS que recibe el cliente.
- `out/<slug>/` — el entregable: `index.html` + `site.css` (+ `productos/**` en store).

## Flujo real, punta a punta (comandos verificados)

Todo desde `C:\dev\proyectos\onia-hermes\web-factory`.

```powershell
pnpm install                                  # una vez

# 1) Intake → perfil de cliente
#    (el formulario del panel, /onia-center/web-factory, descarga ese JSON;
#     plantilla de referencia: data/intakes/client-intake.template.json)
pnpm client:new -i data/intakes/<archivo>.intake.json
#    → data/clients/<slug>.json + <slug>.context.md

# 2) Receta de diseño (infiere vertical, elige referencias, propone tokens)
pnpm design:auto <slug> -t <template>
#    → data/clients/<slug>.design.json + <slug>.design.md

# 3) Render del sitio
pnpm generate <slug> --template <template>
#    → out/<slug>/index.html + site.css

# Todo lo anterior de una pasada (acepta intake o slug ya existente):
pnpm factory:build <slug> -t <template> [--force]
pnpm factory:build --input data/intakes/<archivo>.intake.json [--force]
pnpm factory:build <slug> --dry-run           # valida y lista "pending inputs" sin escribir

# 4) Ver el resultado
node scripts/serve-out.mjs 4319               # sirve out/ → http://localhost:4319/<slug>/

# 5) Gates
pnpm test                                     # unit (vitest)
pnpm images:check <slug>                      # política de formato/peso de imágenes
pnpm e2e                                      # Playwright: regenera los demos y testea out/
pnpm factory:smoke                            # test + regenerar los 8 demos
```

Templates válidos (`data/schema.ts` → `WEB_FACTORY_TEMPLATES`):
`landing` · `store` · `dashboard` · `landing-focus` · `landing-clinic`.
El de más calidad hoy es `landing-clinic` (dental-demo); `landing` es el más genérico.

`--dry-run` de `factory:build` imprime los **pending inputs** (logo, asset de hero, canal
de conversión, dominio): ese listado es el checklist que se le pide al cliente, no se inventa.

## Lo que el motor todavía NO hace (no prometerlo)

- **No hay deploy.** No existe script `deploy` en `web-factory/package.json`; el pipeline
  termina en `out/`. Publicar es manual hasta que exista (F0.2 del plan de upgrade).
- **La receta no gobierna el render.** `design/auto-designer.ts` calcula `sectionPlan`,
  `tokenDirection` y guardrails, pero `generate/generate.ts` sólo copia el `.design.json`
  a `out/`: ningún template lo lee todavía (F1.4). Sirve como guía para el humano/agente,
  no como input del render.
- **Un solo layout por bloque.** No hay variantes; dos clientes del mismo template salen
  con la misma forma. Si hace falta otra forma, se decide con Sergio, no se improvisa.

Plan y estado real: `hermes-content/docs/platform/ONIA_WEB_FACTORY_UPGRADE_PLAN_20260807.md`.

## Regla Sergio (por qué existe esta skill)

Mis diseños salen genéricos. ANTES de construir: usar la galería interna
(design-stack cache, `data/references`, Pattern Bank) + skills de diseño, y exigir
**≥4 Required Qualities** (bento, depth/layering, editorial, motion, jerarquía por escala).

## Flujo de skills de diseño (en orden)

1. **Intake + dirección:** `brainstorming` → definir estilo concreto (no "clean minimal").
2. **Investigar patrones:** browser (Awwwards/referencias) + `data/references` internas.
3. **Taste & sistema:** `taste-design` · `ui-ux-pro-max` · `impeccable` (reglas duras de calidad).
4. **Construcción:** para sitios de cliente = editar bloques/templates del generador.
   Para superficies Next (onia-center, onia-platform): `frontend-design` · `frontend-patterns` ·
   `react-components` · `shadcn-ui` · `ui-styling` · `nextjs-turbopack`.
5. **Revisión:** `design-review` + preview en navegador (verificar en vivo, no pedirle a
   Sergio que revise a mano).

## Piso de calidad / benchmark

Bench · Garabato · HSB Engineers — tomar su jerarquía, limpieza, ritmo y seriedad como piso,
sin copiar literal. Anti-template: nada de card-grid uniforme, hero genérico, defaults de
librería sin tocar. Copy hardcodeado del template en el HTML final = defecto, no estilo.

## Gates antes de main (regla dura)

- **`tsc --noEmit` verde en `web-factory/apps/site`** antes de que el avance llegue a `main`
  (Linux distingue casing de imports; `main` alimenta Vercel `onia-center` + VPS `center.onia.com.bo`).
- `pnpm test` + `pnpm e2e` (los E2E incluyen axe WCAG 2.2 AA y presupuesto de Core Web Vitals).
- No filtrar WIP parcial: si un archivo nuevo importa otro nuevo, van los dos o ninguno.
- `code-review` antes de mergear.

## Ojo con los monolitos

- `onia-center` (~14k líneas): NO rediseñar in situ; reconstruir en componentes chicos
  (`src/app/onia-center/components/**`) al lado de prod y hacer swap al final.
- `packages/templates/src/store.ts` (~3.4k líneas) viola la regla de <800. No escribir otro
  template monolítico: un rubro nuevo sale de bloques, no de un archivo nuevo de 3.000 líneas.
- `apps/onia-platform/**` es la landing en producción: carril aparte, no tocar de paso.
