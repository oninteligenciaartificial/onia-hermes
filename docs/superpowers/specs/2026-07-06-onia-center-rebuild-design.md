# Reconstrucción de ONIA Center — Fase 1 (shell + Hoy)

**Fecha:** 2026-07-06
**Carril:** A (`onia-center-saneamiento`)
**Dueño de archivos:** `web-factory/apps/site/src/app/onia-center/**` + `api/onia-center/**`

## Problema

El panel `/onia-center` está en producción y es un monolito: `page.tsx` (2141
líneas) + `operating-workspace.tsx` (4252 líneas) + `onia-center.css` (5366
líneas) + `operating-source.ts` (2255 líneas), ~13.800 líneas entre esos 4
archivos. Ningún agente puede rehacerlo de una sola pasada, y cualquier cambio
chico obliga a cargar contexto enorme. Hay que reconstruirlo en componentes
chicos (100-200 líneas), sin romper el panel que Sergio usa a diario.

## Alcance de este spec

Este documento especifica **Fase 1 completa** (shell navegable + vista "Hoy"
con datos reales) y deja **Fase 2/3 como hoja de ruta** (orden de vistas y
plan de swap), sin especificar el detalle interno de Pipeline/Agentes/Negocio
todavía — eso se diseña vista por vista cuando le toque el turno, para no
sobre-especificar trabajo que todavía puede cambiar.

**Fuera de alcance:** `equipo/`, `login/`, `video-lab/`, `web-factory/`
(subrutas anidadas de onia-center) quedan intactas. `onia-center-store.ts`,
`onia-center-auth.ts` y `middleware.ts` no se tocan — se consumen tal cual.

## Investigación previa (hechos verificados en el repo)

- No existe hoy un `components/` bajo `onia-center/` — se crea de cero.
- No existe un "sistema de dashboard de web-factory" separado todavía; la
  base es Tailwind v4 + shadcn con variables oklch en `globals.css`
  (`--primary`, `--accent`, `--radius-*`, etc.). Se sigue el fallback
  acordado: tokens propios que **extienden** esas variables, no las
  reemplazan.
- `onia-center-store.ts` expone `getOniaCenterRuntime()` (Supabase real:
  leads, tasks, reviews, notes, ideas, codexJobs) y mutaciones
  (`createOniaCenterEntity`, `updateOniaCenterEntityStatus`). Es la única
  puerta de datos; no se edita.
- `review_queue` es una tabla Supabase real, mapeada a `RuntimeReview` en el
  store (`review_key, source_type, source_key, title, status, sensitive`).
  Es la "cola de aprobación" que pide conservar el brief original.
- `operating-source.ts` exporta `operatingAgents: OperatingAgent[]` (datos,
  no JSX) con 6 agentes con nombre: `agent-sales-crm` ("Agente Vendedor"),
  `agent-calendar-energy` ("Agente del Dia"), más CEO mensual, Entrega y
  Proyectos, Finanzas y Fondo ONIA, Contenido y Media Lab, Self-hosted e
  Integraciones. También exporta `sergioStrictScheduleBlocks` (agenda),
  `commercialBookingPolicy`, `operatingProjects`, `collaborators`,
  `inventoryItems`, `operatingOrganizations`, `integrationConnectors`,
  `auditLogSeed`, etc.
- El middleware ya protege todo `/onia-center/:path*` (cookie de sesión +
  rol); una ruta nueva bajo ese prefijo hereda la protección gratis.

## Decisiones de diseño

### Dirección visual: "Clean operator"

Nav superior de pocas pestañas anchas, foco editorial en "hoy", jerarquía
tipográfica fuerte, más aire que densidad. Se descartaron "Command deck"
(riel de iconos, denso) y "Bento home" (portada en tiles) — elegida por el
usuario tras comparar mockups.

### Navegación: 4 pestañas por decisión, no por entidad de datos

`Hoy · Pipeline · Agentes · Negocio`

- **Hoy** — foco del día: agenda + roster de agentes + cola de aprobación +
  panel rápido de notas/ideas (no es pestaña propia, vive acá como panel
  lateral).
- **Pipeline** — leads + tareas (lo que se mueve).
- **Agentes** — detalle de revisiones, auditoría, integraciones, feature
  readiness (más profundo que el resumen de Hoy).
- **Negocio** — proyectos, colaboradores, inventario, organizaciones,
  política comercial.

Sub-rutas reales (no estado de tab en cliente): `/onia-center/next/hoy`,
`/pipeline`, `/agentes`, `/negocio`. Cada una verificable sola (render 200
independiente), URLs compartibles, back/forward del navegador funciona
gratis.

### Ruta espejo temporal

`web-factory/apps/site/src/app/onia-center/next/page.tsx` (+ subrutas) es la
superficie de trabajo mientras se construye. Vive bajo `/onia-center/*` así
hereda el middleware existente. `/onia-center` (el monolito) sigue sirviendo
producción sin cambios hasta el swap de Fase 3. `next/` se borra en el swap.

### Tokens

`onia-center/styles/tokens.css`, nuevo, construido sobre las variables ya
existentes en `globals.css` (no las reemplaza). Suma solo lo específico del
panel:
- Escala de tono para estados — reutiliza el concepto `CenterTone` ya
  existente en `source.ts` (green/yellow/red/blue/neutral) en vez de
  inventar uno nuevo.
- Un par de medidas de layout propias (alto de topnav, ancho máximo de
  contenido).

### `operating-source.ts`: drenar, no migrar de golpe

Es un módulo de datos (consts exportados), no JSX — no bloquea la
reconstrucción de UI. Cada vista de Fase 2 que necesite algo de ahí lo
importa tal cual (sin editar el archivo), y ese pedazo se relocaliza a su
propio archivo chico dentro de `components/views/<tab>/` recién cuando esa
vista se porta. Cuando ya nada lo importe, se borra en la Fase 3 junto con
el resto del monolito. Evita migrar de una sola vez algo que todavía no hace
falta tocar.

## Fase 1 — alcance exacto

Shell navegable + **Hoy con datos reales**. Pipeline/Agentes/Negocio quedan
como empty-states honestos ("Esta vista se está portando — mientras tanto
usá el panel actual", con link a `/onia-center`) hasta que les toque el
turno en Fase 2.

### Estructura de carpetas nueva

```
onia-center/
  next/
    page.tsx                     ← redirige a /next/hoy
    hoy/page.tsx
    pipeline/page.tsx            ← empty-state
    agentes/page.tsx             ← empty-state
    negocio/page.tsx             ← empty-state
  components/
    shell/
      AppShell.tsx               (~100 líneas) — topbar + TopNav + slot de contenido
      TopNav.tsx                 (~80 líneas) — 4 pestañas, estado activo por ruta
      QuickCapturePanel.tsx      (~100 líneas) — stub Fase 1: drawer con EmptyState
    ui/
      Tile.tsx                  — primitivo tile/tarjeta de estado
      Badge.tsx                 — pill de tono (reusa CenterTone)
      EmptyState.tsx            — empty-state honesto reusable
      SurfaceCard.tsx           — card de superficie genérica
    views/
      hoy/
        HoyView.tsx              (~120 líneas) — compone las 3 piezas de abajo
        AgentRosterTile.tsx      — lee `operatingAgents` (import directo, solo lectura)
        ReviewQueueTile.tsx      — lee `reviews` desde `getOniaCenterRuntime()`
        TodayScheduleCard.tsx    — lee `sergioStrictScheduleBlocks` (import directo)
      pipeline/   (vacío, placeholder Fase 2)
      agentes/    (vacío, placeholder Fase 2)
      negocio/    (vacío, placeholder Fase 2)
  styles/
    tokens.css
```

### Flujo de datos — Hoy

`hoy/page.tsx` (server component) llama `getOniaCenterRuntime()` +
`getOniaCenterActor()` (mismo patrón que usa hoy `page.tsx` del monolito) y
pasa la porción `reviews` a `HoyView`. `operatingAgents` y
`sergioStrictScheduleBlocks` se importan directo desde `operating-source.ts`
(solo lectura, sin duplicar datos). Sin mutaciones en Fase 1 — aprobar/
rechazar una revisión desde Hoy queda para cuando se porte el detalle en la
pestaña Agentes.

### Empty states (Pipeline/Agentes/Negocio)

Mismo componente `EmptyState` con copy honesto por vista: qué va a vivir ahí,
que todavía está en el panel viejo, y link directo a `/onia-center` para no
dejar a Sergio sin esa información mientras se porta.

## Gates

Por commit: `tsc --noEmit`, render 200 de la ruta tocada, revisión con
`code-reviewer`. Test unitario puntual solo si un componente trae lógica real
(ej. un helper que agrupa/ordena datos) — no cobertura 80% en componentes
puramente presentacionales; es una excepción deliberada para este trabajo de
shell/porting, acordada explícitamente para este carril.

## Hoja de ruta Fase 2 (orden propuesto, ajustable)

1. **Pipeline** — leads + tareas (CRM/kanban, mayor tráfico)
2. **Agentes** — historial de revisiones + auditoría + integraciones + feature readiness
3. **Negocio** — proyectos, colaboradores, inventario, organizaciones, política comercial + "ver todo" de notas/ideas

Un commit por vista, `tsc` verde en cada uno.

## Fase 3 — swap

Cuando Pipeline/Agentes/Negocio estén portadas: `page.tsx` pasa a renderizar
lo mismo que `next/hoy` (redirect o contenido movido), se borra `next/`, y
recién ahí se eliminan `operating-workspace.tsx` + `onia-center.css` +
`page.tsx` viejo + lo que quede sin usar de `operating-source.ts`. Verificar
`/onia-center` responde 200 y los agentes/cola de aprobación son visibles
antes de borrar el código muerto.
