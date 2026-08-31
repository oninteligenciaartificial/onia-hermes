# Dashboards — 26 referencias reales + qué le falta al nuestro (2026-08-29)

Pedido de Sergio: aprender de ~30 dashboards para mejorar el de Onia. Capturadas
26 (Grafana Play, shadcn examples, Tremor, Tabler, Flowbite, Horizon, Ant Pro,
Metronic, admin templates) con navegador que renderiza (los dashboards son SPA,
Scrapling no los ve). Fallaron 4 (material/argon/refine/evilcharts). En
`scratchpad/dash/refs/`.

## Patrones que SE REPITEN (los que valen)

1. **KPI = número grande + chip de tendencia + sparkline DENTRO de la tarjeta.**
   Tabler lo hace en TODOS: la mini-línea vive en el KPI, no en otro chart. Es
   el patrón más fuerte y el que más nos faltaba mostrar.
2. **Línea-narrativa bajo el KPI** (shadcn: "Trending up this month" / "Visitors
   for the last 6 months"). Da contexto sin otro gráfico.
3. **Una celda KPI HERO** (card oscura de acento sólido) que ancla la fila.
4. **Estado por chip verde↑/rojo↓ con flecha**, semántico, separado del acento.
5. **Toggle de período** (global en shadcn; por-tarjeta en Tabler). Global es
   más limpio para nosotros.
6. **Gauge/radial** para UN % (Tabler 78%) y **mini stat-tiles con ícono**
   (132 Sales / 78 Orders) — compactos, complementan los KPI.
7. **Charts con tema categórico** (Tremor: azul/cyan/magenta distinguibles), NO
   la marca en todas las series.
8. **Densidad = decisión**: shadcn aireado, Tabler denso. Onia = medio.

## Qué tenía nuestro template y qué se arregló (2026-08-29)

- El template `dashboard.ts` YA soportaba sparkline-en-KPI, celda accent, chip de
  tendencia y línea contexto — pero el **schema zod (`data/schema.ts`) los
  DESCARTABA** (`spark`/`variant` no estaban declarados). Bug real: capacidad
  presente, datos imposibles de pasar. **Arreglado**: schema + tipo + render
  alineados a `spark: number[]`.
- El demo estaba en **violeta genérico** (`#4f46e5`). Llevado a **marca Onia**
  (verde `#0d6b5c` + cream `#f6f2ea`), con sparklines, celda hero e la narrativa.
  Antes/después: `scratchpad/dash/nuestro-actual.png` vs `nuestro-mejorado.png`.

## Pendiente (mejora del template, en orden)

1. **Charts con tema categórico de la skill `dataviz`**, no todo verde de marca
   (hoy la línea Real/Meta y el donut cuestan de distinguir). El crítico ya lo
   había marcado.
2. **Gauge/radial** como tipo de chart nuevo (para tasas: cierre, ocupación).
3. **Fila de mini stat-tiles con ícono** (pedidos/mensajes/alertas).
4. Densidad configurable (compacto vs cómodo).

## Rediseño del dashboard de Onia Platform (admin real)

El admin de producción vive en `onia-platform`/`onia-center` (OTRA lane). Este
trabajo mejora el TEMPLATE de web-factory (nuestra zona) y sirve de propuesta:
llevar el admin real a marca + estos patrones se COORDINA con esa sesión, no se
toca desde acá.
