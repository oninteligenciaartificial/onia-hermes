# Web Factory — Dashboard Design System

Sistema de diseño para paneles de datos densos (ERPs/SaaS internos), pensado
para que DentalGest, GestiOS y ONIA Center lo porten a su propio stack — no es
código compartido entre repos, es el estándar + una implementación de
referencia real dentro de Web Factory (`dashboard-demo`,
`packages/templates/src/dashboard*.ts`).

**Validación pendiente**: este sistema es un modelo B2B razonado y grounded en
producto real (Asana Insights, Hotjar, shadcn dashboard-01, launch-ui, Tremor,
un dashboard fintech — vía capturas Mobbin/licencia de referencia en
`design-stack`), pero no fue validado contra las pantallas reales de
DentalGest, GestiOS ni ONIA Center (no hay acceso a esos repos desde este
carril). Antes de adoptarlo como estándar obligatorio, alguien de esos equipos
debería confirmarlo contra 2-3 pantallas reales de su producto.

## Modelo de jerarquía (3 niveles)

1. **Hero (`heroPanel`)** — el elemento de mayor peso visual. Dos variantes,
   elegidas por dato, no por código separado:
   - `metric-trend`: un KPI headline + su propia mini-tendencia (sparkline)
     fusionados en una card. Perfil growth/analytics — "estado de un
     vistazo" (ingresos, ocupación, uptime).
   - `queue`: lista priorizada de acciones (título + estado + urgencia/
     vencimiento + acción rápida). Perfil ops/ERP — "qué tengo que atender
     hoy" (turnos, aprobaciones, stock bajo). **Es la variante que
     probablemente sirve a DentalGest/GestiOS** (ver validación pendiente).
2. **KPIs de apoyo** — 3-5 métricas secundarias, tipografía/peso menor que el
   hero, no compiten visualmente con él.
3. **Detalle** — charts secundarios + fila asimétrica: tabla (con filtros
   tipo chip y celdas de estado) + panel lateral compacto tipo lista, en vez
   de grid uniforme.

## Primitivo de card

Una sola clase base con modificadores, no 3 estilos casi-duplicados:

```css
.wf-dash-card {
  padding: 18px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--card);
}
.wf-dash-card--compact { padding: 16px 18px; } /* KPIs de apoyo */
/* el hero (.wf-dash-hero) y los estados usan la base + su propia clase de contenido */
```

Todo (KPI, chart-card, tabla, hero, estados) compone sobre `.wf-dash-card` en
vez de declarar border/radius/background por separado.

## Reglas de data-viz

- **Selección de tipo**: línea/área para tendencia (1-3 series); barra para
  comparación categórica; donut solo con ≤4-5 segmentos; sparkline para el
  mini-chart del hero `metric-trend`. **Nunca eje dual** (dos escalas Y en un
  chart) — confunde la correlación entre series.
- **Redundancia de color** (accesibilidad, daltonismo): ninguna señal de
  estado depende solo del color. Trends de KPI usan ▲/▼/• además del color
  (`trendGlyph`); status pills de tabla usan ✓/✕/! además del color; los
  ítems de la cola (`heroPanel: queue`) usan el mismo criterio.
- **Leyendas**: paleta token-driven (`SERIES_COLORS`), verificar separación
  de luminancia suficiente entre series (proxy simple de daltonismo).
- **Ejes**: siempre con unidad visible; en mobile reducir ticks del eje X en
  vez de rotar/truncar etiquetas.

## Estados: loading / vacío / error

Los 3 estados se muestran **siempre visibles** en la referencia (sección
`#estados`, activable con `dashboard.showStatesReference: true`) — nunca
escondidos detrás de un toggle que nadie va a descubrir. Los productos reales
cablean `.wf-dash-card--loading` / `.wf-dash-error` a su propio estado async;
acá el patrón es inspeccionable con solo mirar el HTML/CSS.

## Navegación agrupada

`nav` acepta `string[]` (plano, comportamiento actual sin cambios) o
`Array<{ group?: string; items: string[] }>` (grupos con caption). Agrupar por
lo que el usuario **decide** (ej. "Hoy" / "Trabajo" / "Análisis" / "Cuenta"),
no por jerarquía técnica interna del producto.

## Responsive

- Sidebar colapsa a fila con scroll horizontal en `≤860px`.
- KPI row de apoyo pasa a scroll-snap horizontal en mobile (no columna
  apilada, que alejaría el hero del fold).
- Tabla y hero-chart ya tienen wrappers de scroll/reflow; verificar legibilidad
  a 375px sin overflow horizontal accidental del documento.

## Referencia viva

`pnpm generate dashboard-demo --template dashboard` — código en
`packages/templates/src/dashboard*.ts` (5 archivos: orquestación, charts,
cards, hero, states). Datos de ejemplo en `data/clients/dashboard-demo.json`
(escenario neutro: consola de operaciones genérica).
