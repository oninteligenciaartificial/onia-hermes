# Auto Design Recipe - ONIA Ops Demo

Generated: 2026-07-04T17:07:31.662Z

## Decision

- Slug: `dashboard-demo`
- Template: `dashboard`
- Rubro inferido: Dashboard / analytics / internal tool (dashboard-analytics)
- Confianza vertical: 0.95
- Objetivo: Mostrar el estado del negocio de un vistazo y permitir accion sobre los datos.
- Direccion visual: Layout de datos: KPIs arriba, graficos y tablas con jerarquia clara, filtros y estados de carga/vacio cuidados.
- Tesis de conversion: Un panel funciona cuando el usuario entiende el estado en segundos y puede filtrar o accionar sin friccion; la densidad es una feature, no adorno.
- Riesgo generico a evitar: Cards de KPI sin jerarquia, graficos decorativos sin insight y tablas sin estados de carga/vacio ni acciones.

## Dials

- Conversion: medium
- Densidad visual: high
- Motion: low
- Tono de confianza: operativo, denso y legible

## Referencias Seleccionadas

| Rol | Fuente | Titulo | URL | Licencia | Por que | Screenshots |
|---|---|---|---|---|---|---|
| client-reference | Tremor | Tremor | https://www.tremor.so | client-provided-reference-review-required | referencia exacta entregada en el brief; usar: jerarquia de KPI y graficos; evitar: copiar identidad | sin screenshot |
| structure | SaaSFrame Landing Pages | Slite UX/UI Design and Copywrinting Examples - SaaSFrame | https://www.saasframe.io/saas/slite | inspiration-only | coincide con rubro: bi; tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; aporta links o bloques de codigo para estudiar; fuente fuerte para patrones web | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/saasframe-landing-pages/285-landing-page-4197935a/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/saasframe-landing-pages/285-landing-page-4197935a/mobile.png |
| structure | Landingfolio | HeadshotPro Landing Page Inspiration and More \| Landingfolio | https://www.landingfolio.com/inspiration/post/headshotpro-1 | inspiration-only | tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; aporta links o bloques de codigo para estudiar; fuente fuerte para patrones web | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/landingfolio/091-headshotpro-a3943c9a/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/landingfolio/091-headshotpro-a3943c9a/mobile.png |
| structure | Recent Design | App Store Screenshot Inspiration — Recent | https://recent.design/app-store-screenshots | inspiration-only | tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; fuente fuerte para patrones web | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/recent-design/004-app-screenshots-6eff42f4/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/recent-design/004-app-screenshots-6eff42f4/mobile.png |
| structure | Awwwards Winning Websites | Wolverine Worldwide - Awwwards SOTD | https://www.awwwards.com/sites/wolverine-worldwide | inspiration-only-high-overdesign-risk | tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; fuente fuerte para patrones web; requiere simplificar para ONIA | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/awwwards-winning-websites/476-locomotive-040978f6/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/awwwards-winning-websites/476-locomotive-040978f6/mobile.png |
| structure | Tabler | Tabler Icons: 6100+ free vector icons for web design | https://tabler.io/icons | mit-open-source | coincide con rubro: dashboard, admin; tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; aporta links o bloques de codigo para estudiar; tiene pista de codigo reusable con review | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/tabler-admin-dashboard/234-tabler-icons-c0300d9f/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/tabler-admin-dashboard/234-tabler-icons-c0300d9f/mobile.png |
| typography | Magic UI | Kinetic Text \| React Components & Templates | https://magicui.design/docs/components/kinetic-text | mit-open-source-reference | tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; aporta links o bloques de codigo para estudiar; fuente fuerte para patrones web; tiene pista de codigo reusable con review | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/magic-ui/007-introducing-kinetic-text-fbd94463/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/magic-ui/007-introducing-kinetic-text-fbd94463/mobile.png |
| component | shadcn/ui | Building Blocks for the Web - shadcn/ui | https://ui.shadcn.com/blocks/sidebar | mit-repo-available | tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; aporta links o bloques de codigo para estudiar; fuente fuerte para patrones web; tiene pista de codigo reusable con review | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/shadcn-ui/034-browse-more-blocks-11813c15/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/shadcn-ui/034-browse-more-blocks-11813c15/mobile.png |

## Codigo Referencial Permitido

| Repo | Archivo | Licencia | Senales | Por que |
|---|---|---|---|---|
| tremorlabs__tremor | src/components/AreaChart/areachart.stories.tsx | MIT | react-component, tailwind | licencia MIT; compatible con Tailwind/tokenizacion; match de componente: chart, area |
| tremorlabs__tremor | src/components/AreaChart/AreaChart.tsx | MIT | react-component, tailwind | licencia MIT; compatible con Tailwind/tokenizacion; match de componente: chart, area |
| tremorlabs__tremor | src/components/BarChart/barchart.stories.tsx | MIT | react-component, tailwind | licencia MIT; compatible con Tailwind/tokenizacion; match de componente: chart, bar |
| tremorlabs__tremor | src/components/BarChart/BarChart.tsx | MIT | react-component, tailwind | licencia MIT; compatible con Tailwind/tokenizacion; match de componente: chart, bar |
| shadcn-ui__ui | apps/v4/registry/bases/base/blocks/dashboard-01/components/chart-area-interactive.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: chart, area, dashboard |
| tremorlabs__tremor | src/components/BarList/barlist.stories.tsx | MIT | react-component, tailwind | licencia MIT; compatible con Tailwind/tokenizacion; match de componente: bar, list |
| tremorlabs__tremor | src/components/BarList/BarList.tsx | MIT | react-component, tailwind | licencia MIT; compatible con Tailwind/tokenizacion; match de componente: bar, list |
| tremorlabs__tremor | src/components/Badge/badge.stories.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: badge |
| shadcn-ui__ui | apps/v4/registry/bases/base/blocks/dashboard-01/components/data-table.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: table, dashboard |
| tremorlabs__tremor | src/components/Accordion/accordion.stories.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable |

Regla: usar estos archivos solo como referencia compatible despues de review, retokenizacion, accessibility check y responsive QA.

## Componentes De Dashboard Sugeridos

Mapeo de cada seccion del panel al componente concreto ya indexado (MIT). Usar solo como referencia tras review + retokenizacion, nunca copiar identidad.

| Seccion | Componente sugerido |
|---|---|
| kpi-overview | tremorlabs__tremor - `src/components/Badge/badge.stories.tsx` (MIT) |
| charts-grid | tremorlabs__tremor - `src/components/AreaChart/areachart.stories.tsx` (MIT) |
| data-table | shadcn-ui__ui - `apps/v4/registry/bases/base/blocks/dashboard-01/components/data-table.tsx` (MIT) |

## Plan De Secciones

| Seccion | Objetivo | Patron | Datos necesarios |
|---|---|---|---|
| Resumen de KPIs | Comunicar el estado del negocio de un vistazo. | Fila de 4-6 KPIs con valor, delta y contexto de periodo. | metricas clave, periodo, comparativo |
| Graficos | Explicar tendencia y composicion, un insight por grafico. | Grid de 2-3 graficos con titulo, unidad y leyenda claras. | series, dimensiones, unidades |
| Tabla operativa | Permitir detalle y accion sobre los datos. | Tabla con orden, filtro, paginacion, estados de carga/vacio y acciones por fila. | columnas, filas, acciones |

## Tokens

- Heading: Onest
- Body: Onest
- Senales de fuentes: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif, Montserrat, sans-serif, "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif, "Inter Tight", Inter, "Inter Fallback", system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, Geist, sans-serif, "Geist Mono", monospace
- Paleta: primary #4f46e5, secondary #0f172a, accent #22c55e, bg #f8fafc, fg #0f172a

## Media

### Requerida
- Datos o mock de metricas/series aprobado
- Definicion de KPIs, unidades y periodos

### Opcional
- Logo/marca para el shell
- Iconografia de estados

### Pedidos De Generacion
- Pedir o generar asset hero para ONIA Ops Demo: visual real del rubro, limpio, con espacio para copy y sin logos de terceros.

## Implementacion
- Abrir screenshots desktop y mobile seleccionados antes de tocar layout.
- Elegir una referencia para estructura, una para tipografia/densidad, una para motion o componentes.
- Reconstruir patrones con tokens de ONIA; no pegar HTML/CSS cerrado de referencias inspiration-only.
- Usar solo codigo de repos `allowed-after-review` y registrar archivo exacto usado.
- Mapear cada seccion del plan a datos reales del cliente; eliminar secciones sin dato util.
- Validar hero, servicios, prueba/confianza y CTA principal.
- Aplicar direccion del rubro: Layout de datos: KPIs arriba, graficos y tablas con jerarquia clara, filtros y estados de carga/vacio cuidados.

## Guardrails
- No copiar identidad, copy, imagenes, videos, logos, claims ni estructura reconocible de terceros.
- No usar tres cards iguales si no cambian la decision del cliente.
- No usar gradientes genericos ni paletas de un solo tono como solucion visual principal.
- Primer viewport debe tener una senal real del negocio: producto, lugar, equipo, dashboard, proyecto o resultado.
- Todo video debe tener poster, carga diferida y respeto a `prefers-reduced-motion`.
- Cada bloque debe justificar venta, confianza, entendimiento de alcance o siguiente paso.
- No inventar metricas, clientes, testimonios ni resultados.
- Riesgo especifico: Cards de KPI sin jerarquia, graficos decorativos sin insight y tablas sin estados de carga/vacio ni acciones.

## QA
- Correr `pnpm test`.
- Generar preview con `pnpm generate <slug> --template <landing|store>` o `pnpm factory:build`.
- Revisar desktop y mobile con screenshot antes de enviar a cliente.
- Confirmar que no hay imagenes rotas ni videos con carga inmediata pesada.
- Confirmar contraste, foco visible, labels en forms y CTA accesible.
- Confirmar que cada URL externa abre y que WhatsApp/email funcionan.
- Probar nav, CTA primario y secciones de servicio/contacto.

## Warnings
- Faltan assets visuales; pedirlos o generarlos antes de entrega profesional.
