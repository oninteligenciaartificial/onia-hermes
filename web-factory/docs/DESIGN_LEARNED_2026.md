# DESIGN LEARNED 2026 — Qué funciona y qué no

Síntesis de la cosecha 2026-08-16 (6 grupos de fuentes, detalle crudo en
`web-factory/data/references/design-sources/*.md`). Este doc responde la pregunta de
Sergio: **qué funciona, qué no funciona, y qué queda pendiente de aprender**.

No reemplaza a `WEB_FACTORY_PATTERN_BANK_2026.md` (patrones por rubro) ni a
`MOTION_PATTERN_BANK_2026.md` (motion): los complementa con lo aprendido de fuentes
externas. Catálogo de fuentes y licencias: `web-factory/SOURCES.md`.

---

## 1. Principios que se repiten en TODAS las fuentes buenas (esto es lo que funciona)

Estos aparecen de forma independiente en shadcn, Tremor, Motion Primitives, Componentry,
Stripe, PostHog, ui-ux-pro-max y el research móvil. Cuando 6+ fuentes que no se conocen
entre sí convergen, es señal, no moda.

1. **Copy-paste + retokenizar gana a la dependencia npm.** Todas las fuentes serias
   (shadcn, Tremor post-Vercel, Componentry, Motion Primitives, Efferd) migraron al
   modelo "el código se copia a TU repo y se adapta a TUS tokens". Nada entra con hex
   hardcodeados ni con su paleta default: se reemplaza por CSS vars antes de commitear.
   Corolario: nuestro `packages/blocks` puede publicarse igual (registry shadcn desde
   GitHub, feature jun-2026).

2. **Bloques con variantes por técnica/intención, no páginas monolíticas.** 21st.dev
   agrupa heroes por técnica (shader, liquid, gradient); Efferd tiene 20 variantes de
   CTA vs 9 de hero (la variedad importa más en el CIERRE que en la apertura); PostHog
   compone dashboards desde insights serializables; Tremor tiene 29 variantes de UNA
   KPI card. La unidad de trabajo es el bloque con variantes — el rubro elige la
   variante, la técnica vive en la galería.

3. **Los estados no-felices se diseñan primero, no al final.** Stripe, Tremor y el
   research móvil coinciden: empty state honesto (métricas en cero + sparklines planas
   + UN CTA de primer paso, nunca pantalla vacía distinta), skeleton con la silueta
   real del contenido (no spinner), 404 diseñada de fábrica, error con causa + cómo
   arreglarlo. El primer uso de un rubro recién encendido es TODO empty states: venden
   o matan el onboarding.

4. **Verificación visual automatizada como parte del contrato de "hecho".** El loop del
   10x builder (compilar → correr → screenshot → LEER la captura), MotionScore como
   auditoría S–F gratis, y las 12 reglas numéricas de ui-ux-pro-max (contraste 4.5:1,
   targets 44pt/48dp, feedback <= 100ms) convergen en lo mismo: nuestra regla
   "verificar es MIRAR" se puede automatizar como gates medibles del pipeline, no
   dejarla como disciplina manual.

5. **Un CTA primario por pantalla y motion solo con causa.** Toda vista define SU
   acción primaria (agendar, cobrar, registrar); el resto baja a secundario. Motion:
   solo transform/opacity, 150-300ms micro / <= 400ms compleja, `prefers-reduced-motion`
   respetado, y toda animación expresa causa-efecto — lo decorativo se corta.

6. **Licencia antes que código, siempre.** La trampa apareció 4 veces en una sola
   cosecha: "Google Sans" en un par de Fontpair no está en Google Fonts (propietaria);
   Efferd figuraba como "free" y es mix free/pro; Haikei no licencia su output en los
   ToS; 10x App Builder es PolyForm Noncommercial. Se lee la licencia del componente
   concreto, no la del marketplace.

7. **Tipografía disciplinada: 2 fuentes máximo, mono solo para datos.** El patrón
   dominante en Fontpair es "una familia en dos pesos/anchos" o "sans moderna + serif
   clásica". Mono jamás como voz: solo cifras, precios, SKUs, con
   `font-variant-numeric: tabular-nums`.

---

## 2. Anti-patterns detectados (lo que hace GENÉRICA una web/dashboard)

Cada uno con su antídoto. Estos son bloqueantes en QA, no sugerencias.

| Anti-pattern | Por qué falla | Antídoto |
|---|---|---|
| Look shadcn/Tremor sin tema propio | Grita plantilla; viola anti-template policy | Tokens del cliente ANTES de bloques; temas Sera/Luma/Rhea solo como base de tweakcn |
| Hero genérico SaaS (centrado + gradiente + blob) | Intercambiable con mil sitios | Hero tipográfico oversized, o hero con fondo por técnica intercambiable por rubro |
| Blobs/waves multicolor por defecto | Estética template-2021 reconocible | Solo SVG recoloreado por CSS vars, con moderación, nunca export crudo |
| Glassmorphism en tablas/forms/datos | GPU-intensivo, contraste pobre | Glass solo en overlays puntuales sobre foto, blur 8-12px, con fallback sólido |
| Dark-mode-first por defecto | Nuestros rubros (dental, comercio, ganadero) piden claridad y confianza | Claro por defecto; dark solo si el rubro lo justifica (tech/seguridad) |
| Motion decorativo (Matrix rain, scramble en headlines, cursor custom en producto) | Ruido; motion que no clarifica | Motion con causa-efecto; scramble/typewriter solo en datos mono de dashboard |
| Pared de métricas / pie charts / número sin comparación | Un número sin delta no informa, decora | 4-6 KPIs máx + delta pill + sparkline; BarList en vez de pie; drill-down para el resto |
| Layouts "AI-adaptativos" que reordenan por sesión | Rompen la memoria espacial del que entra 20 veces al día | Layout estable; la personalización es pin/flag de métricas, no reordenar |
| Hamburger como navegación primaria móvil + tutorial overlays | Marcados "avoid 2026"; lo escondido no se usa | Bottom tab bar 4-5 ítems con icono + label |
| Emoji como icono estructural | Anti-pattern #1 de calidad visual (ui-ux-pro-max) | SVG de UNA familia (Lucide) con tamaños tokenizados |
| Mezclar bases Radix y Base UI en un compuesto | shadcn cambió su default (jul-2026); comportamiento duplicado | Una fuente por primitivo; verificar base al instalar componentes viejos vs nuevos |
| 3D/WebGL runtime en webs de cliente | Revienta presupuesto 150 kb y LCP < 2.5s | El 3D se hornea a video/PNG (Rotato) y se sirve como media |
| Overdesign Dribbble (shots sin contenido real, sin forms, sin mobile) | Nunca pasó por producción | Extraer 1 idea fuerte por shot; validar contra contenido real del cliente |

---

## 3a. Sección WEB (landings) — patrones accionables

| Patrón | Qué es | Fuente |
|---|---|---|
| Hero tipográfico sin imagen | Headline oversized (clamp 3-8rem) + 1 línea subcopy + CTA; para clientes sin fotos buenas (frecuente en rubros locales) | Dribbble 2026 |
| Hero con fondo intercambiable por técnica | Mismo hero block, fondo distinto (aurora, liquid, geometric) por rubro = variedad sin re-diseñar | Componentry + 21st.dev |
| Bento grid "activo" | 4-6 tiles desiguales; el grande revela mini-clip o cifra al hover; estático en mobile | Dribbble 2026 |
| Sticky scroll cards para "cómo trabajamos" | Pasos que se apilan al scrollear en vez de grilla estática de 3 columnas | Componentry |
| Scrollytelling barato de producto | Dashboard/app scrolleando detrás de overlay de texto sticky — muestra el producto sin video | Dribbble 2026 |
| CTA con pulso único al entrar al viewport | IntersectionObserver, una vez, no loop; respeta reduced-motion | Dribbble 2026 |
| Glass sutil sobre foto | Tarjetas translúcidas (blur 8-12px, borde 1px blanco 15%) donde la foto ES el contenido (restaurantes, hoteles) | Dribbble 2026 |
| Image comparison antes/después | Slider — la prueba visual más vendedora para dental/estética/construcción | Motion Primitives |
| text-loop multi-rubro en hero | "para tu clínica / tu tienda / tu ferretería" rotando con `vocabulario.ts` | Motion Primitives |
| Split Flap Display para cifras | Tablero de aeropuerto para KPIs de landing; encaja logística/importadora | Componentry |
| infinite-slider para logos/testimonios | Reemplaza marquees CSS frágiles; upgrade: acoplado a `useVelocity(scrollY)` | Motion Primitives + motion.dev |
| Divisores SVG theme-aware | Layered waves/gradientes < 10 KB con `fill: var(--color-surface)`; jamás export crudo | Haikei |
| CTA como familia de variantes por intención | 20 variantes (agendar / cotizar / WhatsApp), no un diseño único; la variedad importa más en cierre que en apertura | Efferd |
| 404 diseñada de fábrica | Bloque de primera clase en todo template; hoy es un olvido típico | Efferd |
| Orden de secciones validado por rubro | Extraer el ORDEN (hero → prueba → oferta → FAQ → CTA) de 3-5 landings reales del rubro en Lapa Ninja antes de componer | Lapa Ninja |
| Mockup con perspectiva, no frontal plano | Cámara 3/4, rotado 2-4 grados, sombra larga + chip KPI flotante — "sistema vivo" | Dribbble + Rotato |

## 3b. Sección DASHBOARDS — patrones accionables

**Anatomía canónica 2026** (confirmada cross-fuente Stripe/Linear/Vercel/Grafana):
shell (sidebar ~256px + header) → filterbar sticky → 4-6 KPI cards → grid 12 columnas
de chart compositions → tabla con acciones/paginación. Light + dark desde el día uno.
Colapsa a stack en mobile sin reordenar jerarquía.

| Patrón | Qué es | Fuente |
|---|---|---|
| KPI card de 3 capas | Valor grande + delta pill con flecha vs período anterior + sparkline inline (29 variantes de referencia) | Tremor Blocks |
| Filterbar como bloque propio | Fila sticky: date-range con presets + segmento + dimensión — separado del contenido, no filtros dentro de cada card | Tremor Blocks |
| Insight-como-unidad | Cada chart = 1 pregunta, con query y config serializable; un dashboard = composición de insights por rubro, no página nueva | PostHog |
| Drill-down universal | Todo número clickeable hacia su evidencia: métrica → breakdown → registro individual ("ingresos del mes" → pagos → ese pago) | Stripe + PostHog |
| Empty state honesto | Métricas en cero + sparklines planas + UN CTA ("registrá tu primer paciente/venta"); mismo layout, no pantalla aparte | Stripe + Tremor |
| Skeleton con silueta real | La forma de la card/chart/tabla que viene, no spinner genérico | Stripe + móvil 2026 |
| Sidebar por sustantivos del negocio | Pagos, Clientes, Agenda — no "Reportes"/"Gráficos"; mapea a `vocabulario.ts` | Stripe |
| Tracker / status bar | Fila de rectángulos coloreados por día: citas atendidas (dental), cobros al día (condominios) — más denso que bar chart | Tremor |
| BarList para rankings cortos | Barra horizontal + etiqueta + valor: top tratamientos/productos/deudores; mata al pie chart | Tremor |
| Chart Composition como unidad | Chart + header KPI + leyenda + tooltip rico (delta y contexto adentro) versionado junto | Tremor Blocks |
| Feed "qué cambió" | 3-5 items de novedades antes de la grilla; para dueños no técnicos es MÁS útil que el dashboard completo | PostHog |
| App Shell como bloque | Sidebar + topbar + content frame como unidad versionada; el bloque que más se repite en Onia Platform y no tenemos | Efferd + Tremor |
| Heatmap de actividad | Estilo GitHub calendar: densidad de citas/ventas por día | Componentry |
| animated-number / sliding-number | KPI que desliza al actualizar — dato vivo sin re-render brusco | Motion Primitives |
| morphing-dialog | Card que se expande a detalle compartiendo layout: ficha de paciente/producto sin cambio de página | Motion Primitives |
| toolbar-expandable | Seleccionás filas → la toolbar se expande con acciones contextuales | Motion Primitives |
| Toast con promise state | Guardando → guardado/error, patrón oficial shadcn (jul-2026), cero código propio | shadcn/ui |
| Billing & Usage block | Medidor de consumo + límite de plan + CTA upgrade — directo a la página de suscripción de Onia Platform | Tremor Blocks |

## 3c. Sección MÓVIL — patrones accionables (dashboard móvil de Onia)

Consenso 2026: el bottom sheet con detents reemplazó al modal centrado; la navegación
se concentra en el tercio inferior (75% de interacciones a un pulgar). Implementar con
shadcn/vaul + Tailwind propios — ninguna fuente es proveedora de código.

| # | Patrón | Detalle |
|---|---|---|
| 1 | Bottom tab bar 4-5 destinos + "Más" | Inicio · Agenda · Clientes · Cobros · Más (vocabulario por rubro); icono + label, >= 48dp, safe area; re-tap = scroll to top |
| 2 | Bottom sheet con detents | Medio/completo para filtros, detalle rápido, confirmaciones; drag handle visible, cierre swipe-down; nunca para forms largos ni tablas |
| 3 | Chip row de filtros | Horizontal en sheet o bajo header (patrón Spotify): estado, rubro, fechas; el filtro persiste en la URL |
| 4 | Barra sticky inferior con EL CTA | "Nueva cita" / "Registrar cobro" en thumb-zone; una sola acción primaria por pantalla |
| 5 | Swipe actions con undo | Swipe corto revela 2-3 acciones (confirmar, cobrar, WhatsApp); destructiva = confirmación o undo, nunca directa |
| 6 | Skeleton + pull-to-refresh | Skeleton con layout real; spinner solo esperas < 3s de estructura impredecible |
| 7 | Stack lista → detalle, máx 3-4 niveles | Back preserva scroll y filtros; toda pantalla clave con deep link — crítico: las alertas del bot de WhatsApp abren la pantalla exacta |
| 8 | Empty states accionables | "Aún no hay citas hoy — Agendar la primera"; prohibido "No hay datos" |

**Gates numéricos móviles** (ui-ux-pro-max, verificables en QA): touch targets >= 44pt /
48dp con 8px de separación · feedback al tap <= 100ms · body >= 16px (evita auto-zoom
iOS) · line-height 1.5-1.75 · breakpoints 375/768/1024/1440 · cero scroll horizontal ·
nunca deshabilitar zoom · safe areas en barras fijas · contraste 4.5:1 (3:1 texto grande).

Fuentes: ui-ux-pro-max skill (MIT, instalada) · Muzli · GenDesigns · UXPin · DesignStudio.

---

## 4. Tipografía

**Par del producto (ya decidido, no se reabre):** Bricolage Grotesque (headings) +
Schibsted Grotesk (body) para Onia Platform y material propio.

**Pares Fontpair adoptados por rubro** (todo Google Fonts / OFL, self-host preferible):

| Heading | Body | Rubro ONIA |
|---|---|---|
| Work Sans | Bitter | Clínicas/salud: sans moderna + serif cálida para cuerpo largo (tratamientos, FAQ) |
| Epilogue | Baskervville | Legal/finanzas/consultoría: seriedad clásica |
| DM Sans | Staatliches (display en heading) | Restaurantes/eventos: display condensado con carácter |
| Montserrat | Inter o Figtree (sustituto) | Comercio/retail genérico — ⚠ el par original traía "Google Sans", que NO está en Google Fonts (propietaria): sustituido |
| Libre Franklin | Eczar | Editorial/educación/blogs |
| EB Garamond | DM Mono (solo acentos) | Marca premium/boutique: mono SOLO en precios, SKUs, specs |
| Zalando Sans Expanded | Zalando Sans | SaaS/plataforma: una familia, dos anchos = jerarquía sin cambiar de voz |
| Alumni Sans | DM Sans | Servicios locales/industrial: condensada de impacto |
| Zalando Sans | JetBrains Mono | Dashboards/paneles internos: mono para cifras tabulares |
| Ysabeau SC | Ysabeau | Real estate/arquitectura: small caps en labels — elegancia sin serif |

**Reglas destiladas:**
- Mapeo rápido rubro → categoría: confianza/tradición → sans+serif; tech/plataforma →
  sans+sans o sans+mono; hospitalidad → display+sans. Decisión en 1 minuto.
- Mono como acento de datos, nunca como voz; con `font-variant-numeric: tabular-nums`.
- Small caps (Ysabeau SC) para eyebrows/labels en vez de uppercase + letter-spacing manual.
- Validar el par contra 5 landings reales del rubro en Lapa Ninja (colecciones
  typography/serif/mono) antes de fijar el brand-kit.
- Probar SIEMPRE con copy en español real (tildes/eñe en cuerpo largo) antes de fijar.

---

## 5. Herramientas: adoptadas vs descartadas

### Adoptadas

| Herramienta | Licencia | Rol en la factory |
|---|---|---|
| shadcn/ui (+ Questionnaire, Toast nuevo, calendar blocks, registry GitHub, MCP) | MIT | Base del stack; sumar los bloques 2025-2026 |
| Tremor + Tremor Blocks (300+, ahora gratis) | Apache-2.0 / free OSS | Capa data-UI por defecto: KPI, filterbars, tablas, empty states — copy-paste + retokenizar |
| Componentry (`harshjdhv/componentry`) | **MIT confirmada** (antes "revisar licencia") | Motion premium de landing: sticky scroll, split flap, hero backgrounds |
| Motion Primitives (33 core) | MIT (verificada local) | Motion sobrio de producto: animated-number, morphing-dialog, in-view |
| Motion core (motion.dev) | MIT | Ya default de la casa; + MotionScore (gratis) como gate QA S–F |
| Google Stitch (MCP conectado) | Gratis (Labs, cuota 350/50 al mes) | Intake visual + `generate_variants` pre-código + preview de dirección. NUNCA código final; acelerador, no dependencia |
| Fontpair | Sitio gratis; fuentes OFL | 10 pares mapeados a rubros con salida directa a producción |
| ui-ux-pro-max (skill instalada) | MIT | 12 reglas numéricas como QA gates; CLI `--design-system` como paso 0 |
| Lapa Ninja | Research gratis (403 a fetchers) | Validador estructural y tipográfico por rubro; código: nunca |

### Condicionales / solo inspirar

| Herramienta | Estado | Condición |
|---|---|---|
| 21st.dev | Inspirar + adoptar selectivo | Licencia POR COMPONENTE antes de importar; free tier 2 copias/día — no automatizar encima |
| Efferd | Inspirar | Solo bloques free (es mix free/pro, no "free" como decía SOURCES §3); valor real: taxonomía App Shell + Dashboard |
| Haikei | Inspirar con cautela | ToS no licencia el output explícitamente; OK fondos secundarios; a mediano plazo, script propio paramétrico por tokens |
| Rotato (app.rotato.app) | Adoptar-condicional | App nativa es Mac-only; probar web beta gratis en Windows con 2-3 assets; revisar EULA; compra (~USD 79-199, sin confirmar) = permiso explícito de Sergio |
| Dribbble / Stripe / PostHog | Reference-only | Solo estructura y mecánica; jamás código, layout, assets ni identidad |

### Descartadas

| Herramienta | Por qué |
|---|---|
| 10x App Builder | PolyForm Noncommercial 1.0.0 = licencia rechazada; además genera SwiftUI/iOS (cero solapamiento). Solo se le roba el PATRÓN plan→build→verify-con-screenshot |
| Motion+ (£299) | Redundante: AnimateNumber ≈ CountUp P5, Ticker ≈ Marquee P16, splitText ≈ P2 propio de 1 kb. Alerta futura: cláusula "Builder's License" si algún día revendemos capacidades en editor no-code |
| Motion UI (secciones prefab) | Viola cuarentena shadcn + anti-template policy: la dirección visual sale del concepto por rubro, no de un hero comprado |
| Código de PostHog | MIT parcial con carpetas EE propietarias — revisar por archivo es caro; base Ant Design choca con shadcn |
| Tremor como paquete npm | La dirección post-Vercel es copy-paste; npm congela versiones y choca con el stack |

---

## 5b. Galerías (cosecha v4 — 2026-08-17)

Segunda pasada, esta vez sobre GALERÍAS (no shots sueltos), para la iteración v4 del
panel. Método: Playwright + Chromium headless con capturas leídas por visión (WebFetch
solo no alcanza: estas galerías son imagen). Qué rindió y qué no, con cita.

### Acceso: quién dejó entrar y quién no

| Galería | Estado | Nota |
|---|---|---|
| SaaS Interface (saasinterface.com) | ✅ Rindió | La página `/pages/dashboard/` muestra 6 dashboards de PRODUCCIÓN gratis (Secfi, June, Compound, Casual, Similarweb, Mixpanel); el resto (154) es de pago. Lo gratis ya vale: son productos reales, no shots |
| Behance (búsqueda "saas dashboard 2026") | ✅ Rindió (la mejor) | La búsqueda renderiza sin login; los proyectos de alto señal (1K+ likes) se bajan por módulos `project_modules` a full-size y se leen perfecto |
| Godly (godly.website) | ⚠️ Ya no existe como tal | Redirige a **recent.design** (`?ref=godly`): la curaduría siguió ahí. La categoría "Interface" rinde fragmentos de producto, no composiciones de dashboard |
| Land-book (land-book.com) | ⚠️ Abre pero rinde poco | El 403 era solo a fetchers (WebFetch); con navegador real entra. Pero buscar "dashboard" devuelve LANDINGS de productos de dashboard, no dashboards: sirve para "cómo se vende un panel", no para diseñarlo |
| Awwwards (inspiration search "dashboard") | ⚠️ Abre pero rinde poco | Devuelve portfolios de agencias y showcases dark; casi cero UI de producto real. Para dashboards, no es la galería |
| Mobbin (mobbin.com) | ❌ Bloqueada | Login wall total (`?redirect_to=`); sin cuenta no se ve ni un screen. Queda pendiente con cuenta propia |

**Regla que deja esta cosecha:** para dashboards, las galerías de PRODUCTO REAL
(SaaS Interface, Mobbin con cuenta) y los case studies de Behance con miles de vistas
valen más que las galerías de premios (Awwwards) o de landings (Land-book). El filtro
es "¿esto pasó por producción o por un cliente?", no "¿esto ganó un premio?".

### Qué funciona (patrones concretos, con fuente)

**De Behance — Ledgerix CRM (Ron Design, behance.net/gallery/227454433, 1.1K likes):**

1. **Numeral editorial como héroe, sin tarjeta.** La cifra del período
   ($1,651,045,139) va centrada, gigante y en peso FINO, directamente sobre el lienzo
   — sin caja, sin sombra. El dashboard se lee como libro mayor, no como grilla de
   widgets.
2. **Gráfico "código de barras" full-bleed bajo la cifra.** Barras finísimas y densas
   de margen a margen, con el rango seleccionado en barras oscuras y un chip flotante
   de valor ($115k +32%). El gráfico es fondo tipográfico, no widget.
3. **Módulos divididos por hairlines, no tarjetas.** La segunda fila (Sales Forecast /
   Expenses / Budget / Insight) son celdas planas separadas por líneas de pelo; un
   insight EN PALABRAS convive como par de los módulos numéricos.
4. **Barra "Ask anything" flotante abajo al centro** con chips de preguntas sugeridas
   encima: el agente/AI como dock flotante, no como columna fija.
5. **Selector de granularidad como tabs de texto quietos** (Week/Month/Quarter/Year)
   alineado a la derecha del título.

**De Behance — Convox Call Center (behance.net/gallery/225853541, 1.2K likes):**

6. **Lo VIVO primero, las métricas después.** El panel abre con la actividad en curso
   (llamada grabándose: foto, waveform, transporte) como tarjeta rica; los KPIs
   acompañan. Composición "ahora-primero".
7. **El acento solo marca lo vivo/accionable.** Lima únicamente en la tarjeta activa,
   el botón primario y el arco del gauge; todo lo demás casi monocromo. El color es
   semántica de "esto está pasando", no decoración.
8. **KPIs de tiempo como primera clase** (1:09, 00:07, 12:11) con unidad chica —
   cifras no-monetarias tratadas con la misma tipografía protagonista.
9. **Una sola superficie con celdas de pelo** en vez de tarjetas flotantes: el grid
   entero es plano, denso, tabla-primero.

**De Behance — Callivio CRM (behance.net/gallery/225485473, 1.3K likes / 16.4K vistas):**

10. **Un solo panel entintado en lienzo claro.** El saludo + score vive en UNA columna
    celeste; el resto blanco/gris. Jerarquía por UNA superficie de color, no por
    oscuridad.
11. **Numerales gigantes en peso ultra-light** ("1 108 calls", "10 832") con espacio
    fino como separador de miles: magnitud editorial sin gritar en bold.
12. **Chips marcador-de-texto** (lima) montados sobre la barra destacada del chart:
    el valor cabalga la barra, no vive en tooltip.

**De SaaS Interface (producción real, saasinterface.com/pages/dashboard/):**

13. **Sidebar que carga datos** (Compound): la nav de cuentas lista cada ítem con su
    monto al lado — navegación que duplica como resumen (confirma el patrón Stakent
    del pattern bank con un producto real).
14. **Reporte-como-tarjeta** (June): cada card es UNA pregunta respondida (adopción
    87.5%, 606 users) con su fila de avatares/checks — el insight-como-unidad de
    PostHog, visto en producción.
15. **Dashboard-hoja-de-cálculo** (Secfi): formulario a la izquierda → panel de
    resultado con barra de desglose a la derecha. El dashboard como calculadora de
    UNA decisión.
16. **Densidad con pestañas, no con scroll** (Similarweb/Mixpanel): la analítica
    profunda va en tabs y drill-down; el overview se queda en 4-6 números.

**De Recent (ex-Godly, recent.design, categoría Interface):**

17. **Entrada al agente como píldora** ("Ask agents ▾"): pill de vidrio con orbe +
    dropdown — el agente como affordance chica y omnipresente, no como panel.
18. **Cifra grande como INPUT** (card "Borrow 1,574"): el numeral protagonista es
    editable en el lugar, con token de moneda al lado — dato y control en uno.
19. **Chart como control de tiempo** ("Drag to change time frame" sobre el área):
    el gráfico acepta arrastre para cambiar el rango — el chart ES el filtro.
20. **Traza de agente como timeline** (UI de tool-calls): cada acción del agente como
    fila con su definición y resultado — transparencia de qué hizo el bot.

### Qué NO funciona (visto en las mismas galerías)

- **El dark-crypto-dashboard de concurso** (CrypGo, TerraFlux en Behance): neón sobre
  negro, 12 charts decorativos, cero jerarquía. Es el look que más se repite y el que
  más rápido envejece — confirma nuestro anti-pattern "dark-mode-first por defecto".
- **Mockups 3D en perspectiva como ÚNICA vista** (mitad de Behance): venden el case
  study pero esconden la UI; si el proyecto no muestra la pantalla plana y el móvil,
  no hay nada que extraer.
- **Awwwards para dashboards**: la categoría premia sitios-espectáculo; ninguno de los
  resultados era un panel operable. Ir ahí para landings de lujo, no para producto.
- **Buscar "dashboard" en galerías de landings** (Land-book): devuelve marketing DE
  dashboards. Útil solo para páginas de venta del producto.

### Qué entró a la v4 del panel (hipótesis distinta a v3)

v3 = tarjeta héroe oscura + sparks por celda + dock oscuro de altura completa
(Dribbble: Fireart/Stakent/OnPoint). v4 prueba la hipótesis OPUESTA que estas
galerías respaldan: **libro mayor editorial** — numeral fino sin tarjeta (Ledgerix,
Callivio), gráfico código-de-barras full-bleed con granularidad por tabs (Ledgerix),
KPIs como celdas de pelo sin caja (Convox), agenda tabla-primero en una sola
superficie (Convox), propuestas del agente INLINE en la sección a la que pertenecen
(insight-como-par de Ledgerix) y el estado global del agente como barra flotante
inferior (dock "Ask anything" de Ledgerix). Maqueta:
`hermes-content/references/ui-patterns/panel-claro-premium/index-v4.html`.

---

## 6. PENDIENTES DE APRENDIZAJE (la lista de tareas)

Tareas concretas que quedaron de esta cosecha. Cada una es accionable y autónoma.

### Fuentes bloqueadas / por profundizar

1. **Cosechar Lapa Ninja vía Playwright con navegador real** (403 a WebFetch, igual que
   Landbook): extraer orden de secciones + metadata paleta/fuente de 3-5 landings por
   rubro ONIA y alimentar el pattern bank.
2. **Dribbble: ronda manual periódica** (fetch bloqueado): revisar Dribbble Select
   trimestral vía WebSearch y actualizar la lista de patrones vigentes/envejecidos.
3. **Watermelon UI: confirmar licencia** (sigue "referencia hasta confirmar" en SOURCES §5b).
4. **Rotato: probar la web beta en Windows** con 2-3 assets reales (propuesta +
   catálogo), leer el EULA de uso comercial de exports, y si rinde proponer compra del
   tier Standard a Sergio.
5. **Verificar los 3 temas shadcn nuevos (Sera/Luma/Rhea)** como bases de tweakcn antes
   de tunear tokens por cliente.

### Infraestructura del pipeline

6. **Clonar `harshjdhv/componentry` al design-stack** (`C:\Users\PC\.codex\design-stack\repos`)
   y promoverla a allowed-after-review (MIT confirmada).
7. **Editar SOURCES.md en el cuerpo**: §5b Componentry "revisar licencia" → MIT
   confirmada; §3 Efferd "free" → "mix free/pro (usar free)". (La corrección ya está
   anotada en el apéndice de cosecha; falta tocar las filas originales.)
8. **Loop de verificación visual automático**: todo sitio generado termina con captura
   Playwright leída por visión antes de declararse hecho (patrón del 10x builder;
   automatiza "verificar es MIRAR").
9. **MotionScore como gate de QA pre-ship** en el checklist §4 del MOTION_PATTERN_BANK:
   nota mínima exigida, desktop + mobile.
10. **Adoptar la checklist numérica de ui-ux-pro-max como QA gate** del pipeline
    (contraste, targets, timings, ambos temas) + su CLI `--design-system` como paso 0
    de cada proyecto de cliente.
11. **Gate anti-emoji automatizado**: grep de emojis en JSX/HTML generado como check
    del pipeline.
12. **Adoptar el MCP server de shadcn** para que los subagentes consulten el registry
    en vez de adivinar URLs de install.
13. **Evaluar publicar `packages/blocks` como registry shadcn desde GitHub**:
    nuestros bloques retokenizados instalables con `npx shadcn add` en cada proyecto.
14. **Asignar a Stitch su rol formal en el pipeline**: intake visual (cierra el stub de
    `harvester/vision/`) + `generate_variants` como paso de divergencia pre-código +
    preview de dirección para propuestas.
15. **Vigilar la mezcla Radix/Base UI**: shadcn cambió el default (jul-2026); definir
    política antes de instalar componentes nuevos junto a los viejos.

### Portar patrones a `packages/`

16. **Questionnaire (shadcn ago-2026) → form de intake/cotización de Web Factory**:
    flujo multi-step de una pregunta por pantalla en vez del form largo.
17. **Tremor Blocks → `packages/blocks`**: importar y retokenizar KPI cards, filterbar,
    empty states, tablas con acciones y chart compositions.
18. **Categoría "App Shell" nueva en `packages/blocks`**: sidebar + topbar + content
    frame como unidad versionada (el bloque más repetido de Onia Platform, hoy no existe).
19. **Bloque 404 de fábrica** en todo template de cliente.
20. **Bloque "Integrations"** (grilla de logos + estado conectado/no) para la página de
    canales (WhatsApp, SIAT, pasarelas).
21. **Sticky Scroll Cards / Scroll Choreography (Componentry) → sección "cómo
    trabajamos"** de los templates de servicio.
22. **image-comparison (Motion Primitives) → template dental/estética/construcción**:
    slider antes/después.
23. **text-loop en el hero multi-rubro** cableado a `lib/onboarding/vocabulario.ts`.
24. **in-view + animated-group como estándar reveal-on-scroll** en React: reemplaza el
    IntersectionObserver a mano del Motion Standard de DESIGN_STACK.md.
25. **Upgrade Marquee P16 con `useVelocity(scrollY)`**: la cinta acelera con el scroll
    (el gesto de Ticker premium, gratis, 0 kb marginal).
26. **Token `--ease-spring` con `linear()` en `packages/tokens`** para los patrones
    vanilla P19-P22 (spring real en vez de cubic-bezier aproximado).
27. **Tokens de iconografía (icon-sm/md/lg) en `packages/tokens`**: hoy se tokeniza
    color/espaciado pero no tamaños de icono.
28. **Script propio de SVG generativos paramétricos por brand tokens** (waves, blobs,
    gradientes — matemática simple): elimina la dependencia de licencia de Haikei.
29. **Calendar blocks oficiales de shadcn → packs con agenda** (dental, servicios):
    partir del block, no construir el calendario.
30. **Dashboard móvil de Onia Platform: implementar los 8 patrones de §3c** (tab bar,
    sheet con detents vía vaul, chips, CTA sticky, swipe+undo, skeletons, deep links,
    empty states accionables).
31. **Probar los 10 pares Fontpair con copy español real** (tildes/eñe en cuerpo largo)
    antes de fijarlos como default por rubro.
