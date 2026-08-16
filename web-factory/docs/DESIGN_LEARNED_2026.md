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
