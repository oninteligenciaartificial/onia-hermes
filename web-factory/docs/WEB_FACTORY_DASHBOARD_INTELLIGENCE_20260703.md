# Web Factory Dashboard Intelligence 2026-07-03

## Uso operativo

Este documento amplia la "red neuronal" de diseno de Web Factory (el pipeline
`harvester/vision` -> `latest-design-intelligence.json` -> `design/auto-designer.ts`)
con un rubro nuevo: **dashboards / analytics / herramientas internas**. No es
permiso para copiar identidad, datos, assets ni composiciones cerradas de las
fuentes; solo se extraen patrones de estructura, componentes y jerarquia de datos.

## Como aprende Web Factory (recordatorio)

1. `data/references/design-sources/gallery-reference-sources.json` lista las
   fuentes con su licencia y uso permitido.
2. El harvester (`references:harvest:daily`) captura screenshots, fuentes, CTAs y
   senales de motion; `references:code-examples` indexa codigo con licencia.
3. `references:intelligence` fusiona todo en `latest-design-intelligence.json`.
4. `design/auto-designer.ts` infiere el rubro del cliente y arma una receta
   razonada (secciones, dials, guardrails, media faltante) usando esas senales.

Este cambio agrega el rubro al paso 4 y las fuentes al paso 1, de modo que un
cliente de tipo panel/KPI ya no cae por defecto en "SaaS / B2B".

## Fuentes agregadas (licencia verificada 2026-07-03)

| Fuente | URL | Licencia | Uso en Web Factory | captureCode |
|---|---|---|---|---|
| Tremor | https://www.tremor.so/ | Apache-2.0 | Taxonomia de componentes de dashboard: KPI cards, charts area/bar/line, tablas y filtros. Codigo reutilizable tras revision. | si |
| Tabler | https://preview.tabler.io/ | MIT | UI kit de admin dashboard: layouts, data tables, charts, forms y estados carga/vacio. | no (preferir repo local) |
| shadcn/ui Charts | https://ui.shadcn.com/charts | MIT | Bloques de charts sobre Recharts (area, bar, line, pie, radar, radial) con variantes de tooltip. | no |
| shadcn/ui Dashboard | https://ui.shadcn.com/examples/dashboard | MIT | Layout de referencia: fila de KPIs, grid de charts y data table. `npx shadcn add dashboard-01`. | no |
| Hugging Face Spaces | https://huggingface.co/spaces | Per-Space (revisar) | Data-apps y dashboards (Gradio/Streamlit): layout de data-viz, filtros y patrones en tiempo real. Solo estructura/flujo. | no |

Regla de seleccion aplicada: priorizar MIT/Apache-2.0 para codigo reutilizable con
revision; tratar galerias con licencia por item (Hugging Face Spaces) como
inspiracion estructural; retokenizar colores, tipografia, spacing, estados,
responsive y accesibilidad antes de usar en trabajo de cliente.

## Patrones aprendidos (rubro dashboard)

- **KPIs arriba, accion abajo.** Fila de 4-6 KPIs (valor + delta + periodo),
  luego charts, luego tabla operativa. La densidad es feature, no adorno.
- **Un insight por grafico.** Titulo, unidad y leyenda claros; nada de charts
  decorativos sin lectura.
- **Tablas con estado.** Orden, filtro, paginacion y estados de carga/vacio
  explicitos; acciones destructivas siempre confirmadas.
- **Filtro global.** Un filtro que controla toda la vista, no un widget suelto.
- **Motion bajo.** Solo transiciones de estado y skeletons de carga; sin motion
  decorativo.
- **Datos reales o mock aprobado.** Nunca presentar datos inventados como reales;
  exigir definicion de KPIs, unidades y periodos.

Estos patrones estan codificados en el vertical `dashboard-analytics` de
`design/auto-designer.ts` (secciones `kpi-overview`, `charts-grid`, `data-table`,
dials `visualDensity: high` / `motionIntensity: low`) y resumidos en
`WEB_FACTORY_PATTERN_BANK_2026.md` (playbook "Dashboard / Analytics / Internal Tool").

## Como refrescar la inteligencia con estas fuentes

```powershell
cd C:\dev\proyectos\onia-hermes\web-factory
pnpm references:harvest:daily
pnpm references:code-examples
pnpm references:intelligence
```

El harvester respeta `include`/`exclude` y la licencia declarada por fuente.
Revisar licencias antes de reusar codigo (especialmente Hugging Face Spaces).

## Template estatico de dashboard (construido 2026-07-03)

Ya existe `packages/templates/src/dashboard.ts` (`renderDashboardDocument` /
`renderDashboardCss`), cableado en `generate/generate.ts` como tercer template
(`landing` | `store` | `dashboard`). Es estatico y tokenizado, sin React:

- Shell con navegacion lateral (colapsa a barra superior en movil).
- Fila de KPIs con delta semantico (verde sube / rojo baja / neutro estable).
- Graficos como **SVG inline calculado de los datos** (barras y linea con area),
  sin librerias de chart en la salida.
- Tabla operativa con header sticky y **estado vacio** ("sin registros").
- JS liviano: segmento de filtro (toggle visual) + reveal con IntersectionObserver
  que respeta `prefers-reduced-motion`.
- Los datos viven en `client.dashboard` (schema Zod: `kpis`, `charts`, `table`);
  campos opcionales con default, asi que no afecta a clientes landing/store.

Demo: `data/clients/dashboard-demo.json`. Preview:

```powershell
pnpm generate dashboard-demo --template dashboard
```

Las fuentes MIT/Apache (Tremor/Tabler/shadcn) se usaron como referencia de
estructura y taxonomia de componentes; el codigo es propio y retokenizado, no
copiado.

## Pendiente de mayor esfuerzo

- Flujo intake -> perfil para datos de dashboard: hoy `dashboard-demo.json` se
  escribe a mano; falta mapear `dashboard.*` en `buildClientProfileFromIntake`
  para generar paneles desde un intake.
- Charts mas ricos (ejes Y, tooltips, series multiples) manteniendo SVG sin deps.
- Cache local de los repos MIT/Apache (Tremor, Tabler, shadcn) para
  `references:code-index` y reuso de codigo con revision.
