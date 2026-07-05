# Web Factory - Stack y Materiales 2026-07-03

## Con que tecnologia construimos (la duda comun)

Web Factory produce **dos tipos de salida**, y se elige por lo que el cliente
necesita. **No usamos WordPress en ningun punto.**

### 1. Sitios estaticos (HTML + CSS)

- Los generan las plantillas TypeScript en `packages/templates/`
  (`landing.ts`, `store.ts`, `dashboard.ts`). Son funciones que emiten **HTML
  semantico + CSS tokenizado**, sin framework en la salida.
- `pnpm generate <slug> --template <landing|store|dashboard>` -> `out/<slug>/`
  (`index.html` + `site.css`).
- Se hostea en cualquier lado (hosting estatico, Vercel, Netlify, Cloudflare
  Pages, incluso una carpeta). Rapido, barato, buen SEO, sin backend.
- JS vanilla liviano (carrito con `localStorage`, filtros, reveal con
  `IntersectionObserver`); charts como **SVG inline calculado de los datos**.
- Es lo que se entrega para presencia, catalogo simple y paneles/mockups
  presentables.

### 2. App Next.js / React

- Vive en `apps/site/` (React + Next). Es el runtime real de Nuvia (ecommerce
  con checkout server-side), ONIA Center y superficies dinamicas.
- Se usa cuando el cliente necesita **una app, no un sitio**: checkout y pagos,
  autenticacion, datos en vivo, CRUD, paneles con datos reales, integraciones.

### La maquinaria de la fabrica

- `generate/`, `design/`, `harvester/` son **Node + TypeScript** (corren con
  `tsx`), con Playwright + cheerio para el scraping de referencias.
- **Python**: solo scripts auxiliares de media (cutouts de producto de Nuvia).
  No se usa para construir las webs.

### Como elegir

| Necesidad del cliente | Salida | Donde |
|---|---|---|
| Presencia / landing | estatico `landing` | `packages/templates` |
| Catalogo / tienda simple (WhatsApp/checkout asistido) | estatico `store` | `packages/templates` |
| Panel / reporte / mockup de dashboard | estatico `dashboard` | `packages/templates` |
| Ecommerce real con pagos, auth, datos en vivo | Next.js / React | `apps/site` |
| Panel con datos reales, CRUD, login | Next.js / React | `apps/site` |

Regla: **empezar estatico para cerrar rapido**, y **subir a Next.js cuando el
cliente paga funcionalidad real** (checkout, datos vivos, auth). El estatico
abre; lo recurrente (Next) es donde vive el margen.

## Materiales y librerias recomendadas (licencia verificada)

Todo esto es referencia de estructura y, cuando la licencia lo permite (MIT /
Apache-2.0), codigo reutilizable **tras revision y retokenizado**. Nunca copiar
identidad, assets, claims ni layouts reconocibles.

### Charts / data-viz (para dashboards en Next)

| Libreria | Licencia | Cuando |
|---|---|---|
| Recharts | MIT | Default React, datasets chicos/medios, se lee como componentes |
| Chart.js (react-chartjs-2) | MIT | Canvas, 10k-100k puntos, performance |
| ApexCharts | MIT | Zoom/brush/anotaciones out-of-the-box |
| Apache ECharts | Apache-2.0 | Datasets masivos, tipos exoticos (sankey, treemap, geo) |
| visx | MIT | Visualizacion custom (primitivas, mas ingenieria) |
| Nivo | MIT | Componentes React con buen default estetico |

Para las plantillas **estaticas** no se usa libreria: los charts son SVG inline
propio (sin React ni deps en el output).

### Headless UI (comportamiento + accesibilidad, sin estilos)

| Libreria | Licencia | Nota |
|---|---|---|
| Base UI (MUI) | MIT | La capa de primitivas mas mantenida en 2026 |
| Radix Primitives | MIT | La base de shadcn/ui; heavy usage |
| Ark UI | MIT | Multi-framework (React/Vue/Solid), state machines |
| Headless UI (Tailwind) | MIT | Set chico, compone con Tailwind (ya indexado en harvester) |
| React Aria (Adobe) | Apache-2.0 | Cuando accesibilidad es prioridad, control por hooks |

### Dashboards / admin (Next + React)

| Fuente | Licencia | Nota |
|---|---|---|
| Tremor | MIT | Componentes de dashboard/charts (ya indexado, 8 ejemplos) |
| Tabler | MIT | UI kit admin completo (layouts, tablas, estados) |
| shadcn/ui `dashboard-01` + charts | MIT | Layout KPIs + charts + data table (`npx shadcn add`) |
| TailAdmin | MIT | 10 layouts (analytics, ecommerce, CRM, SaaS...) |
| Mantine | MIT | Componentes + templates de dashboard |
| Refine | MIT | Framework headless para admin/internal tools |

### Estilos, motion, iconos, tipografia, tablas

| Rol | Recomendado (licencia) |
|---|---|
| Estilos | Tailwind CSS (MIT), shadcn/ui (MIT, indexado) |
| Motion | Motion/Framer Motion (MIT), motion-primitives (MIT, indexado), AutoAnimate (MIT), GSAP (gratis) |
| Iconos | Lucide (ISC), Tabler Icons (MIT), Heroicons (MIT), Phosphor (MIT) — el repo ya usa `@tabler/icons-react` y `lucide-react` |
| Tipografia | Fontsource (self-host), Google Fonts |
| Data tables | TanStack Table (MIT) |

## Que ya aprendio la "red neuronal" (harvest 2026-07-03)

Se corrio el harvester sobre fuentes de dashboard nuevas. Codigo indexado con
licencia (MIT, `allowed-after-review`), 8 ejemplos por repo salvo indicado:

- `tremorlabs/tremor` (dashboards/charts), `tailwindlabs/headlessui`,
  `shadcn-ui/ui`, `magicuidesign/magicui`, `ibelick/motion-primitives`,
  `markmead/hyperui`, `nolly-studio/cult-ui`, `launch-ui`, `componentry`,
  `serafimcloud/21st`.
- Marcado `study-only` (no comercial): `10x-app` (PolyForm Noncommercial).

Intelligence: 25 fuentes / 60 top-examples. Refrescar con:

```powershell
pnpm references:harvest:daily
pnpm references:code-examples
pnpm references:intelligence
```

Fuentes de galeria registradas (28): ver
`data/references/design-sources/gallery-reference-sources.json`. Incluye las de
dashboard: Tremor, Tabler, shadcn charts, shadcn dashboard, Hugging Face Spaces.

## Regla de licencias (recordatorio)

1. Priorizar MIT / Apache-2.0 para codigo reutilizable con revision.
2. `NOASSERTION`, PolyForm Noncommercial, premium o galerias cerradas =
   inspiracion estructural solamente.
3. Retokenizar colores, tipografia, spacing, copy, estados, responsive y
   accesibilidad antes de usar en trabajo de cliente.
4. Cruzar siempre con las referencias exactas del cliente y assets aprobados.
