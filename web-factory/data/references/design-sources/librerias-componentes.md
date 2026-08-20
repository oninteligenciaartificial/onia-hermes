# Design sources — Grupo: librerías de componentes

Cosecha 2026-08-16. Las 5 fuentes ya figuran en `SOURCES.md`/`DESIGN_STACK.md` a nivel
catálogo; este archivo profundiza QUÉ trae cada una hoy y qué es transferible.
No re-cosecha lo ya cubierto: lo marca y agrega solo lo nuevo.

---

## 1. 21st.dev

**Estado en SOURCES.md:** ya cubierta (§2 registries + §5b discovery + repo `serafimcloud__21st`
clonado). Nuevo aquí: el inventario actual y el modelo de precios/copias.

**Qué es:** marketplace comunitario de componentes shadcn/Tailwind con 700+ design engineers
publicando. Agrega registries enteros (Aceternity 87, Magic UI 62, shadcn/ui 87, Origin UI 44,
Geist 87, Ruixen UI 390 componentes).

**Qué ofrece concretamente:**
- Marketing blocks (2.000+): animated heroes, hero sections, shaders, liquid & metal,
  backgrounds, gradients, footers.
- UI components (2.100+): buttons, AI chats, cards & grids, galleries & 3D, navigation,
  sign-ins & widgets, sections.
- Extra: React templates, temas shadcn, iconos.
- Dos vías de install: prompt AI-ready (pegar en Claude Code/Cursor) o `npx shadcn add <url>`.
  El código se COPIA al repo, no se importa como dependencia.

**Ideas transferibles:**
1. Categoría "AI chats" como bloque de primera clase — útil para vender el chatbot Onia
   embebido en webs de cliente (widget de chat con burbuja, estados typing, quick replies).
2. "Sign-ins & widgets" como familia propia: login NO es una página, es un bloque re-usable
   con variantes (muted bg, split con imagen) — alinear nuestro `packages/blocks` así.
3. Patrón "prompt AI-ready por componente": cada bloque nuestro debería llevar un prompt de
   instalación para agentes, no solo el código — acelera el ensamblado por subagentes.
4. Agrupar heroes por TÉCNICA (shader, liquid, gradient, animated) y no por rubro — el rubro
   lo pone el pattern bank, la técnica la pone la galería.
5. Ranking por autor/registry (quién publica qué) como señal de calidad al elegir de dónde
   importar — ya tenemos los repos top clonados.

**Qué NO copiar:** licencia POR COMPONENTE (el marketplace no la garantiza — hay premium y
community mezclados); nada se importa a cliente sin ver la licencia del componente concreto.
El tier free limita a 2 copias/día — no montar pipeline automatizado sobre eso.

**Licencia/costo:** plataforma freemium (membership para copias ilimitadas + templates pagos
por autor). El repo `serafimcloud/21st` en sí es MIT y ya está clonado.

**Veredicto: inspirar + adoptar selectivo** (discovery sí; código solo tras revisar licencia
del componente — igual que ya dice SOURCES.md).

---

## 2. ui.shadcn.com (base actual — solo lo NUEVO)

**Estado en SOURCES.md:** base del stack (§1). Aquí solo lo nuevo 2025-2026.

**Bloques/componentes nuevos:**
- **Questionnaire** (ago 2026): flujos multi-step de preguntas — pensado para clarificación
  de agentes y onboarding.
- **Toast nuevo** (jul 2026): acciones, tipos de estado, promises, stacking, swipe dismissal.
- **Calendar** (jun 2025) + bloques de calendario; **Sidebar** con variantes numeradas
  (sidebar-01…16); bloques `dashboard-01`, `login-01…05`, signup, charts, data tables —
  todo instalable con `npx shadcn add <id>`.
- **Base UI es ahora el default** (jul 2026) y **React Aria** entra como base de primera
  clase junto a Radix — ojo al mezclar componentes viejos (Radix) con nuevos (Base UI).
- **@shadcn/helpers** (jul 2026): integración AI SDK con flujos human-in-the-loop.
- **shadcn/typeset** (jul 2026): tipografía como sistema.
- Registry: búsqueda server-side (jul 2026), registries desde GitHub (jun 2026), items
  universales (jul 2025), MCP server (ago 2025).
- Temas oficiales nuevos: Sera, Luma, Rhea (2026).

**Ideas transferibles:**
1. **Questionnaire como intake de cliente**: el formulario de alta/cotización de Web Factory
   como flujo multi-step con una pregunta por pantalla, no un form largo.
2. **Toast con promise state** para acciones de dashboard (guardando → guardado/error) en
   ONIA Platform — patrón oficial, cero código propio.
3. Bloques de calendario para los packs con agenda (dental, servicios): partir del block
   oficial, no construir el calendario.
4. Adoptar el **MCP server de shadcn** en el pipeline: los subagentes consultan el registry
   por MCP en vez de adivinar URLs de install.
5. Publicar `packages/blocks` propio como **registry shadcn desde GitHub** (feature jun 2026):
   nuestros bloques retokenizados instalables con `npx shadcn add` en cada proyecto de cliente.
6. Los 3 temas nuevos (Sera/Luma/Rhea) como paletas base alternativas en tweakcn antes de
   tunear tokens por cliente.

**Qué NO copiar:** el look default sin tema (viola la anti-template policy de
`rules/web/design-quality.md`); mezclar bases Radix/Base UI en un mismo componente compuesto.

**Licencia/costo:** MIT, gratis. **Veredicto: adoptar** (ya es la base; sumar Questionnaire,
Toast nuevo, calendar blocks y el registry GitHub propio).

---

## 3. Componentry (componentry.dev)

**Estado en SOURCES.md:** listada en §5b como "revisar licencia" — licencia YA confirmada:
MIT, repo `harshjdhv/componentry` en GitHub. Se puede promover de "referencia" a
"allowed-after-review".

**Qué es:** 40+ componentes React copy-paste con Tailwind + TypeScript + Framer Motion,
filosofía shadcn, foco en motion premium (spring physics, partículas, scroll velocity).

**Qué ofrece concretamente:**
- Text animations: Velocity Scroll, Letter Cascade, Text Repel, Text Morph, Kinetic Text
  Reveal, Particle Typography, Flipping Word Swap.
- Interactivos: Sticky Scroll Cards, Scroll Split Card, Magnetic Dock, Scroll Choreography,
  Scroll Tilted Grid, Layered Stack, Orbit Card Stack, Wheel Carousel, Spiral 3D Slider,
  Split Flap Display, Eye Tracking, Github Calendar, Flight Status Card, Music Player,
  Mac Keyboard, Newsletter Bookshelf, Signature.
- Hero backgrounds: Hero Geometric, Dither Prism Hero, WebGL Liquid, Silk Aurora, Aurora
  Flow, Animated Gradient, Prism Gradient, Liquid Chrome, Closing Plasma.
- Efectos: Image Trail, Image Ripple, Infinite Image Field, Magnet Lines, Pixel Canvas,
  Matrix Rain, Dithered Logo, ASCII Effect.

**Ideas transferibles:**
1. **Sticky Scroll Cards / Scroll Choreography** para la sección "cómo trabajamos" de webs
   de servicio: pasos que se apilan al scrollear en vez de grilla estática de 3 columnas.
2. **Split Flap Display** (tablero de aeropuerto) para cifras/KPIs en landings — mucho más
   memorable que un counter simple, y encaja con rubros logística/importadora.
3. **Github Calendar** (heatmap de actividad) transferido a dashboards ONIA: heatmap de
   citas/ventas por día como widget de densidad de actividad.
4. **Wheel Carousel / Orbit Card Stack** para catálogos chicos (3-8 productos) donde una
   grilla PLP queda vacía — caso típico de tienda boliviana chica.
5. **Hero backgrounds por técnica** (aurora, liquid, geometric) como capa intercambiable
   del hero: el mismo hero block con fondo distinto por rubro = variedad sin re-diseñar.
6. **Image Comparison-style reveals** y **Image Trail** para portfolios de agencia/foto —
   solo desktop, con fallback estático mobile.
7. **Eye Tracking** (elemento que sigue el cursor) como micro-momento de personalidad en
   404s o empty states — no en páginas de conversión.

**Qué NO copiar:** Matrix Rain / ASCII / Pixel Canvas en sitios de cliente serios (ruido
visual, gimmick); WebGL Liquid en móvil de gama baja (Bolivia = mucho Android modesto:
medir peso antes); nada de esto en dashboards de producto (motion decorativo ≠ motion que
clarifica, regla de `web/performance.md`).

**Licencia/costo:** MIT, 100% gratis, open source. **Veredicto: adoptar** (clonar
`harshjdhv/componentry` al design-stack junto a los demás repos MIT y actualizar su fila
en SOURCES.md §5b de "revisar licencia" → confirmada MIT).

---

## 4. Motion Primitives (motion-primitives.com)

**Estado en SOURCES.md:** ya cubierta (repo `ibelick__motion-primitives` clonado, MIT
verificada en LICENCE.md local). El sitio dio 429 al fetch; inventario tomado del clon
local — es la fuente más fiable de todos modos.

**Qué es:** kit de "primitivas de movimiento" React + Framer Motion de @ibelick, estilo
shadcn (CLI propia + copy-paste). Es la contraparte SOBRIA de Componentry: motion de
producto, no de show.

**Qué ofrece concretamente (33 core, del clon local):** accordion, animated-background,
animated-group, animated-number, border-trail, carousel, cursor, dialog, disclosure, dock,
glow-effect, image-comparison, in-view, infinite-slider, magnetic, morphing-dialog,
morphing-popover, progressive-blur, scroll-progress, sliding-number, spinning-text,
spotlight, text-effect, text-loop, text-morph, text-roll, text-scramble, text-shimmer,
text-shimmer-wave, tilt, toolbar-dynamic, toolbar-expandable, transition-panel.

**Ideas transferibles:**
1. **animated-number / sliding-number** para KPIs de dashboards ONIA: el número desliza al
   actualizar — feedback de dato vivo sin re-render brusco.
2. **morphing-dialog** (card que se expande a dialog compartiendo layout) para fichas de
   paciente/producto: tocar la card la convierte en el detalle, sin cambio de página.
3. **in-view + animated-group** como NUESTRO estándar de reveal-on-scroll en React — hoy el
   Motion Standard de DESIGN_STACK.md usa IntersectionObserver a mano; esto es lo mismo,
   tokenizado y con stagger.
4. **toolbar-expandable / toolbar-dynamic** para barras de acción contextuales en el
   dashboard (seleccionás filas → la toolbar se expande con acciones).
5. **image-comparison** (slider antes/después) para rubros dental/estética/construcción —
   la prueba visual más vendedora que existe para esos rubros.
6. **infinite-slider** para logo clouds y cintas de testimonios — reemplaza marquees CSS
   frágiles.
7. **text-loop** en heroes multi-rubro: "para tu clínica / tu tienda / tu ferretería" rotando
   — vocabulario por rubro (vocabulario.ts) animado en un solo hero genérico.
8. **progressive-blur** en bordes de carruseles/overflows como affordance de "hay más
   contenido" sin flechas.

**Qué NO copiar:** text-scramble/spinning-text en textos de conversión (legibilidad);
cursor custom en sitios de producto (rompe expectativa de UI utilitaria); no duplicar
accordion/dialog si el proyecto ya usa los de shadcn — elegir UNA fuente por primitivo o
se duplican dependencias de comportamiento.

**Licencia/costo:** MIT (verificada local), gratis, con CLI de instalación. **Veredicto:
adoptar** (ya en el stack; este inventario pasa a ser la lista canónica de qué pedirle).

---

## 5. Efferd (efferd.com/blocks)

**Estado en SOURCES.md:** ya cubierta (§3 bloques HTML, "free"). Nuevo aquí: el inventario
real y una corrección — NO es todo free.

**Qué es:** colección de bloques shadcn/Tailwind listos para copiar, orientada a marketing
sites + app shells.

**Qué ofrece concretamente (~180 bloques):**
- Marketing: Auth (14), CTA (20), Header (14), Footer (14), Integrations (12), Contact (11),
  Logo Cloud (11), Features (10), Hero (9 + 3 free), Testimonials (8), FAQs (8), Pricing (7),
  Blog Sections (5), Not Found (2 free), Image Gallery (1 free).
- App: **App Shell (10)** y **Dashboard (10)** — esto es lo distintivo: bloques de aplicación,
  no solo de landing.

**Ideas transferibles:**
1. **"App Shell" como categoría propia** en `packages/blocks`: hoy tenemos bloques de landing
   pero no de shell (sidebar + topbar + content frame como unidad) — es el bloque que más se
   repite en ONIA Platform.
2. **Bloque "Integrations"** (grilla de logos + estado conectado/no) para la página de
   canales de Onia (WhatsApp, SIAT, pasarelas): comunica ecosistema sin prometer features.
3. CTA como familia de 20 variantes: tratar el CTA final como bloque con variantes por
   intención (agendar / cotizar / WhatsApp) en vez de un único diseño.
4. **Not Found como bloque de primera clase**: toda web de cliente sale con 404 diseñada de
   fábrica — hoy es un olvido típico.
5. Ratio de catálogo: 20 CTAs vs 9 heroes — señal de que la variedad importa más en CIERRE
   que en apertura; aplicar esa proporción a nuestro banco.

**Qué NO copiar:** los bloques pro sin licencia comprada (SOURCES.md §3 lo lista como "free"
a secas — **corregir a mix free/pro, usar solo free**, igual que shadcnblocks); no absorber
sus heroes genéricos de SaaS (anti-template policy) — para heroes ya hay mejores fuentes
(Aceternity, Componentry).

**Licencia/costo:** freemium — bloques free marcados + tier pago (página de pricing propia).
Términos de licencia por bloque no publicados en la página de listado: confirmar antes de
cada import. **Veredicto: inspirar** (taxonomía y bloques free; no fuente de código masivo).

---

## Resumen de veredictos

| Fuente | Veredicto | Acción concreta |
|---|---|---|
| 21st.dev | inspirar + adoptar selectivo | discovery; licencia por componente antes de importar |
| shadcn/ui | adoptar | sumar Questionnaire, Toast, calendar blocks; evaluar registry GitHub propio + MCP |
| Componentry | adoptar | MIT confirmada → clonar `harshjdhv/componentry` al design-stack; actualizar SOURCES.md §5b |
| Motion Primitives | adoptar (ya en stack) | usar el inventario de 33 core como lista canónica |
| Efferd | inspirar | solo bloques free; corregir "free" → "mix free/pro" en SOURCES.md §3 |
