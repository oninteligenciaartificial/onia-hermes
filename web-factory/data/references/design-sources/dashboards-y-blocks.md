# Design sources — dashboards-y-blocks

Cosecha 2026-08-16. Grupo: "React components dashboards blocks" (bookmark identificado
como **Tremor**, tremor.so) + 2 referencias fuertes de dashboard analytics 2026.

Contexto previo: `tremorlabs/tremor` YA figura en `SOURCES.md` §2b y `DESIGN_STACK.md`
como repo clonado (Apache-2.0, `C:\Users\PC\.codex\design-stack\repos\tremorlabs__tremor`).
Aquí NO se re-cosecha el repo: se profundiza lo nuevo (Blocks gratis, Vercel, taxonomía).

---

## 1. Tremor — tremor.so + blocks.tremor.so

**Qué es.** Librería React para dashboards y charts: "35+ fully open-source, accessible
components", construida con React + Tailwind CSS + Radix UI. El bookmark "React
components dashboards blocks" corresponde a esta fuente (su tagline exacto). **Tremor
se unió a Vercel** — mantenimiento respaldado, dirección alineada con Next.js.
Estado en SOURCES.md: **ya cubierta a nivel repo**; lo nuevo es la capa Blocks/Templates.

**Qué ofrece concretamente.**
- Componentes (35+): AreaChart, LineChart, BarChart, DonutChart, BarList, Tracker
  (status monitoring), SparkChart, ProgressCircle, DataBar, DateRangePicker con presets,
  RangeSlider, multi-checkbox filters.
- **Blocks (300+, ahora GRATIS y open-source)** en blocks.tremor.so, por categoría:
  KPI Cards (29), Chart Tooltips (21), Chart Compositions (15), Bar Charts (12),
  Form Layouts (6), Banners (5), más Filterbars, Page Shells, Empty States, Tables
  (actions + pagination), Grid Lists, Dialogs, Badges, Pricing, Login, User Management,
  Billing & Usage, Onboarding & Feed.
- Templates completos: dashboard analítico, SaaS marketing site, report pages, one-pager.
- Dos vías de consumo: **copy-paste** (control total, retokenizable) o paquete npm.
  Light + dark mode incluidos por defecto en los blocks.

**Ideas transferibles (a nuestros dashboards Onia Platform / paneles cliente).**
1. KPI card canónica de 3 capas: valor grande + delta vs período anterior como pill con
   flecha + sparkline inline. Tremor tiene 29 variantes de esta sola pieza — copiar la
   anatomía, no una sola versión.
2. **Filterbar como bloque propio** (fila sticky: date-range con presets + segmento +
   dimensión), separado del contenido. Hoy nuestros paneles mezclan filtros dentro de
   cada card.
3. **Tracker/status bar**: fila de rectángulos coloreados para uptime/estado por día —
   perfecto para "citas atendidas por día" (dental) o "cobros al día" (condominios),
   más denso que un bar chart.
4. BarList (barra horizontal + etiqueta + valor a la derecha) para rankings cortos:
   top tratamientos, top productos, top deudores. Reemplaza pie charts ilegibles.
5. Chart Composition = chart + su header KPI + su leyenda + su tooltip como UNA unidad
   reutilizable, no chart suelto al que cada página le inventa un título.
6. Tooltips de chart ricos (21 variantes): delta y contexto dentro del tooltip, no solo
   el valor crudo.
7. Page Shell como bloque: sidebar + header + grid de contenido versionado igual que un
   componente — todas nuestras verticales comparten el mismo shell tokenizado.
8. **Empty state como bloque de primera clase** con CTA de primer paso (ver también
   Stripe abajo) — pieza que hoy nos falta en la factory.
9. Billing & Usage blocks: medidor de consumo + límite de plan + CTA upgrade — directo
   para la página de suscripción de Onia Platform.

**Qué NO copiar y por qué.**
- No adoptar el paquete npm clásico como dependencia de sitios cliente: la dirección
  post-Vercel favorece copy-paste; npm congela versiones de Tailwind/Radix y choca con
  nuestro stack shadcn. Copy-paste + retokenizar a nuestras CSS vars.
- No usar sus templates de marketing/SaaS site como base de landings: genéricos, chocan
  con la política anti-template de web-factory (para landings mandan los benchmarks
  Bench/Garabato/HSB).
- No copiar su paleta default (azules Tremor) — retokenizar siempre a tokens del cliente.

**Licencia/costo.** Componentes Apache-2.0 (repo ya clonado); Blocks & Templates
declarados "free and open-source". Compatible con la regla MIT/Apache de SOURCES.md.
Verificar el LICENSE del repo de blocks al importar cada bloque (regla estándar).

**Veredicto: ADOPTAR** (capa data-UI por defecto de la factory para dashboards; blocks
vía copy-paste + retokenización).

---

## 2. Stripe Dashboard — referencia analytics 2026 (#1)

**Qué es.** El dashboard financiero considerado gold standard 2026 (citado junto a
Linear, Grafana y Vercel como los que definen las convenciones actuales). Producto
cerrado: referencia de estructura, no de código.

**Qué ofrece concretamente (patrones observables).**
- Home con charts de negocio "at a glance" que enlazan a áreas profundas: Payments,
  Payouts, Disputes, Customers, Balance.
- Las decisiones "poco glamorosas" que comparten los mejores: sidebar ~256px, 4-6 KPI
  cards arriba, grid de contenido de 12 columnas, skeleton loaders, light+dark desde
  el día uno.
- Progressive disclosure ejemplar: métrica resumida → click → breakdown detallado →
  filas individuales.
- Empty states diseñados con el mismo cuidado que el estado lleno.

**Ideas transferibles.**
1. **Regla 4-6 KPIs máximo** en el header del dashboard. Nunca una pared de métricas;
   lo demás vive en drill-down.
2. Toda métrica del resumen es **clickeable hacia su detalle**: número → breakdown →
   registros. En Onia Platform: "ingresos del mes" → lista de pagos → pago individual.
3. **Empty state honesto**: cuenta nueva muestra las métricas en cero con sparklines
   planas + UN prompt de acción ("registrá tu primer paciente/venta"), no una pantalla
   vacía distinta. Mantiene el layout estable y enseña la estructura.
4. Skeleton loaders con la silueta real del contenido (card, chart, tabla), no spinners
   genéricos.
5. Sidebar de navegación por sustantivos del negocio (Pagos, Clientes, Balance), no por
   tipos de vista ("Reportes", "Gráficos") — mapea directo a nuestro vocabulario por
   rubro (`lib/onboarding/vocabulario.ts`).
6. Comparación siempre adjunta: cada número con su delta vs período comparable — un
   número sin comparación no informa, decora.
7. Grid 12 columnas + charts que colapsan a stack en mobile sin reordenar la jerarquía.

**Qué NO copiar y por qué.**
- Nada de código, HTML/CSS, iconografía ni identidad visual: producto propietario
  cerrado. Solo estructura y lógica.
- No imitar su densidad fintech en rubros no financieros: un dentista no necesita la
  densidad de un tesorero; ajustar por rubro.

**Licencia/costo.** Propietario. **Reference-only** (misma política que Awwwards/Mobbin
en SOURCES.md §5b).

**Veredicto: INSPIRAR** (estructura, jerarquía KPI, empty states, progressive disclosure).

---

## 3. PostHog — referencia analytics 2026 (#2)

**Qué es.** Suite open-source de product analytics (trends, funnels, retention, session
replay, feature flags) con dashboard unificado. Referencia 2026 recomendada
explícitamente para la categoría "analytics" (junto a Plausible).

**Qué ofrece concretamente (patrones observables).**
- **Insight = 1 chart que responde 1 pregunta**; los dashboards se COMPONEN de insights
  reutilizables, no se dibujan ad-hoc. Tipos: Trends, Funnels, Retention, User Paths,
  Lifecycle.
- Home como **feed personalizado**: insights recientes + métricas marcadas, en lugar de
  un dashboard fijo igual para todos.
- 20+ módulos de producto bajo un solo shell con ~150 componentes propios: transición
  fluida entre vistas (de un trend a la session replay de un usuario sin cambiar de app).
- UI dark developer-friendly con marca lúdica (hedgehog) — personalidad sin sacrificar
  densidad.

**Ideas transferibles.**
1. **Modelo insight-como-unidad**: en nuestra factory, cada chart/KPI es un componente
   con su pregunta, query y config serializable; un dashboard es una lista de insights.
   Habilita "dashboards por rubro" como composición, no como página nueva.
2. Feed de inicio: "qué cambió desde tu última visita" (3-5 items) antes del dashboard
   completo. Para clientes no técnicos (dentista, tienda) es MÁS útil que la grilla.
3. Pin/flag de métricas por el usuario → el home se personaliza sin que diseñemos N
   variantes.
4. Salto contexto→evidencia: del agregado al registro individual en un click (del chart
   de ventas a ESA venta). Refuerza el patrón drill-down de Stripe desde otro ángulo.
5. Un solo shell para muchos módulos: misma navegación para citas, inventario, cobros,
   chatbot — el usuario aprende una sola vez (aplica directo a los packs por rubro).
6. Nombrar los tipos de análisis por la pregunta que responden ("¿vuelven?" = retención)
   y no por el tipo de chart.

**Qué NO copiar y por qué.**
- **No copiar código de la app**: el monorepo de PostHog es MIT parcial con carpetas EE
  bajo licencia propia — revisar por archivo es caro; tratarlo como reference-only.
- No adoptar su base Ant Design: choca frontal con nuestro stack shadcn/Tailwind.
- No imitar la complejidad de 20+ módulos ni el builder de insights libre: nuestros
  clientes necesitan dashboards curados por rubro, no un query builder.

**Licencia/costo.** Open-source (MIT con partes Enterprise propietarias) + cloud pago.
Para nosotros: **reference-only** de patrones y flujos, sin importar código.

**Veredicto: INSPIRAR** (modelo insight-componible, feed personalizado, shell único).

---

## Síntesis para la factory

- Capa de código para dashboards: **Tremor blocks (copy-paste + retokenizar)** sobre
  shadcn — cubre KPI cards, filterbars, tablas, empty states y chart compositions sin
  escribir data-UI desde cero.
- Anatomía de página estándar: shell (sidebar 256px + header) → filterbar sticky →
  4-6 KPI cards (valor + delta pill + sparkline) → grid 12 col de chart compositions →
  tabla con acciones/paginación. Empty y skeleton states diseñados desde el día uno.
- Modelo de datos: insight serializable como unidad; dashboard = composición por rubro;
  todo número clickeable hacia su evidencia.

Fuentes consultadas: tremor.so · blocks.tremor.so · saasui.design (patrones
analytics/reporting) · 925studios.co (breakdown Stripe + 35 ejemplos 2026) ·
userpilot.com y posthog.com/docs (PostHog 2026) · gitnexa.com (convenciones 2026).
