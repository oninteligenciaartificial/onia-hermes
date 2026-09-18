# Design sources — motion-y-3d

Fecha: 2026-08-16. Grupo: motion.dev · rotato.app.
Contexto previo: Motion ya es el **default de la casa** (ver `web-factory/docs/MOTION_PATTERN_BANK_2026.md`,
kit en `apps/onia-platform/src/motion/`) y figura en SOURCES.md §5b como "Motion docs".
**Ya cubierta como librería** — este archivo solo profundiza el DELTA: lo que motion.dev
ofrece hoy que el banco no registra. Rotato no estaba cosechada.

---

## 1. motion.dev (Motion)

### Qué es

La librería de animación híbrida (WAAPI/ScrollTimeline nativos + motor JS) para React,
vanilla JS y Vue. MIT, open source. Nuestro stack ya la usa como default
(`LazyMotion + m + domAnimation`, ~4.6 kb sync). Lo nuevo a auditar es el ecosistema
alrededor: **Motion+** (tier pago), **Motion UI**, **AI Kit**, **MotionScore** y el
changelog reciente.

### Qué ofrece concretamente (delta vs nuestro MOTION_PATTERN_BANK)

- **Motion+ — componentes premium con nombre**: `AnimateNumber`, `Carousel`, `Cursor`,
  `Ticker`, `Typewriter`, `ScrambleText`, `splitText`, `Curtains` (transiciones de
  página), `AnimateActivity` (early access).
- **Motion UI**: ~30 secciones animadas production-ready (heroes, pricing, nav,
  testimonials, page transitions) con rating de performance "MotionScore".
- **AI Kit**: guía `/motion` de best practices, MotionScore para agentes, generador de
  **CSS springs** production-ready, preview de transiciones, contexto de docs +
  430+ ejemplos fuente para agentes. Hay integración MCP anunciada en el changelog.
- **MotionScore** (gratis): auditoría de performance de animación que califica un sitio
  S–F en viewport desktop y mobile.
- **Examples library** (gratis): Typewriter, iOS App Folder, iOS pointer, modal effects,
  Floating Action Button, App Store animations.
- **Changelog relevante**: `Reorder` multidimensional, aceleración por hardware para
  `backgroundColor` y SVG.

Cobertura ya nuestra (no re-comprar ni re-cosechar): springs, `whileInView`,
`AnimatePresence`, `useScroll`/scrub, `layoutId`, `pathLength` — todo mapeado en
P1–P22 del banco. Nuestro `CountUp` (P5) ≈ AnimateNumber; nuestro `Marquee` (P16) ≈
Ticker básico; nuestro `SplitTextReveal` (P2, ~1 kb propio) ≈ splitText premium.

### Ideas transferibles

1. **MotionScore como gate de QA pre-ship**: correr la auditoría gratis (S–F,
   desktop + mobile) sobre cada web generada y exigir nota mínima; sumarlo al checklist
   §4 del MOTION_PATTERN_BANK junto al chequeo de Layout/Paint en DevTools.
2. **Marquee acoplado a velocidad de scroll**: evolucionar P16 con `useVelocity(scrollY)`
   → la cinta acelera/desacelera con el scroll del usuario (el gesto que vende Ticker),
   implementable gratis con hooks que ya cargamos, 0 kb marginal.
3. **Cursor contextual en sitios "agencia/premium"**: puntero custom que se hincha y
   morfa al pasar sobre CTAs/cards (mecánica de `Cursor`): pointer-follow con spring +
   `layoutId` para el morph. Solo desktop, apagado en touch y reduced-motion.
4. **CSS springs `linear()` para los patrones vanilla**: los patrones P19–P22 no cargan
   Motion; en vez del `cubic-bezier(0.34, 1.56, 0.64, 1)` aproximado, generar easing de
   spring real con `linear()` (lo que vende el AI Kit se puede producir con el spring
   generator público / una pasada de cálculo propia). Un token `--ease-spring` en
   `packages/tokens`.
5. **ScrambleText/Typewriter SOLO en datos mono**: revelado tipo terminal para cifras o
   labels en `Spline Sans Mono` de dashboards (nunca en headlines — chocaría con la
   regla anti-IA de copy con voz, y jamás en cifras fiscales por regla dura 7).
6. **Curtains como referencia de transición de página**: transiciones de ruta con capa
   que cubre/revela. En Next App Router mantenerlo a nivel componente (limitación ya
   documentada en P10) o vía View Transitions API nativa; no comprar el componente.
7. **`Reorder` multidimensional para dashboards**: listas/grids reordenables con drag
   (kanban de citas, orden de módulos) — está en la librería core que ya pagamos en
   bundle solo si subimos a `domMax` (+10 kb, decisión consciente como P13).
8. **Docs de Motion como contexto de agente vía Context7/MCP gratis**: el valor del AI
   Kit (docs + ejemplos en contexto) lo replicamos apuntando el builder a los docs
   públicos de motion.dev — no pagar por contexto que ya es público.
9. **Minar la examples library gratis para mecánica de microinteracciones** (iOS App
   Folder → expandir card a grid; FAB → morph botón→menú): extraer la mecánica,
   retokenizar, nunca el estilo iOS literal.

### Qué NO copiar y por qué

- **No comprar Motion+ (£299) hoy**: P1–P22 cubren el 100% de lo que shippeamos con
  0 kb marginal; comprar solo si un brief real exige Carousel/Ticker/Cursor pulidos
  repetidamente y el costo de hacerlo propio supera £299. Gasto = permiso explícito.
- **No usar Motion UI (secciones prefab)**: viola la regla 9 del banco ("cuarentena
  shadcn": los prefab solo para mecánica) y la política anti-template — la dirección
  visual sale del concepto por rubro, no de un hero genérico comprado.
- **No animar `backgroundColor` porque el changelog diga "acelerado"**: la regla dura 1
  (cross-fade con dos capas + opacity) sigue vigente hasta medir en los browsers
  objetivo; no aflojar una regla por un release note.
- **Cláusula Builder's License**: si Web Factory algún día expone un editor visual de
  animaciones que "revenda capacidades de Motion+", necesita licencia aparte — misma
  alerta que ya anotamos para GSAP/Webflow. El core MIT no tiene este problema.

### Licencia / costo

Core: MIT, gratis (ya en producción nuestra). Motion+: £299 una vez (personal) o
suscripción anual por seat (business); el código integrado queda MIT "yours forever"
salvo reventa de capacidades. MotionScore y examples library: gratis.

### Veredicto

**Adoptar (ya adoptada) el core · adoptar MotionScore como gate QA gratis · NO comprar
Motion+ por ahora · Motion UI descartada como fuente de secciones.**

---

## 2. rotato.app (Rotato)

### Qué es

Generador de **mockups 3D de dispositivos**: montás un screenshot/video de tu producto
en un modelo 3D fotorrealista (iPhone, laptop con tapa ajustable, Apple Watch, 30+
dispositivos) y exportás imagen o video animado. App nativa de macOS (11+),
**web beta en app.rotato.app** (única vía usable en el Windows de Sergio; versión
nativa Windows "en desarrollo"). No es una fuente de código: es una herramienta de
producción de assets.

### Qué ofrece concretamente

- 30+ modelos 3D de dispositivos hechos por artistas 3D; importación de modelos custom.
- Export: PNG con transparencia, video MP4 hasta 8K, clay mode (dispositivo monocromo
  tipo arcilla), fondos y sombras custom.
- Timeline de animación 3D + cámara virtual "nivel DSLR" (ángulos, focal, profundidad).
- Plugin de Figma (diseño → mockup directo), 50+ formatos de imagen/video de entrada,
  espejo de iPhone por USB-C, templates de video estilo App Store, modo presentación
  para videollamadas.

### Ideas transferibles

1. **Hero media de propuestas = video mockup de 5–8 s en loop**: el dashboard real de
   onia-platform girando en un laptop/iPhone, export MP4 → `<video>` en la propuesta o
   landing. Producto real en dispositivo real > ilustración stock, y cumple "proof real".
2. **PNG transparente sobre fondo con matiz oklch de la marca**: exportar el dispositivo
   con transparencia y componer el fondo con los tokens del cliente — el mockup hereda
   el sistema de color en vez de traer un gradiente ajeno.
3. **Clay mode como placeholder honesto premium**: donde el banco exige "captura real
   pendiente", un mockup clay (dispositivo arcilla sin UI inventada) comunica "producto
   en construcción" sin fabricar pantallas falsas.
4. **Romper el mockup frontal plano**: usar cámara con perspectiva (3/4, contrapicado,
   profundidad de campo) — el mockup frontal centrado es parte del look template que
   el gate anti-IA prohíbe.
5. **Escena multi-dispositivo para el catálogo de venta**: laptop + teléfono en una
   sola toma = "la plataforma en escritorio y bolsillo" para
   `ONIA_CATALOGO_DE_VENTA.md` y one-pagers, sin escribir una palabra.
6. **Pipeline Figma → Rotato → asset**: los screenshots de marca salen del plugin sin
   pasar por Photoshop; encaja con el flujo de visual intake existente.
7. **Reels de producto para Instagram/TikTok**: los templates de video (formato
   vertical, 8K downscale) alimentan al equipo de contenido (Radar IA / Postiz) con
   material de producto real — hoy no tenemos generador de video de producto.
8. **Modo presentación en pitches**: Sergio mostrando el mockup girando en vivo en una
   videollamada de venta, en vez de un PDF estático.

### Qué NO copiar y por qué

- **No replicar el efecto 3D con three.js/WebGL en webs de cliente**: el 3D se hornea a
  video/PNG en Rotato y se sirve como media; un runtime 3D revienta el presupuesto de
  150 kb y el gate de performance por un adorno.
- **No usar los video templates "estilo App Store" como identidad**: son el equivalente
  en video del hero template — look genérico intercambiable. Usar la herramienta con
  dirección propia (cámara, fondo tokenizado), no sus presets narrativos.
- **No fabricar producto**: prohibido mostrar en un iPhone una "app nativa" que no
  existe (nuestro producto es web). Mockup de móvil = la web responsive real en el
  browser del dispositivo. Regla "no fabricar" de propuestas.
- **Dependencia Mac**: la app nativa no corre en el Windows de Sergio; todo el flujo
  debe validarse contra la web beta antes de considerar compra.

### Licencia / costo

Pago único (sin suscripción) con 12 meses de updates; tres tiers (Basic solo teléfonos
sin templates / Standard 18 templates / Premium 100 templates + todos los dispositivos).
El sitio no publica montos en la página; fuentes externas ubican ~USD 79–199 según tier
(sin confirmar — verificar en checkout). Trial gratis ilimitado sin tarjeta. El pricing
no publica términos explícitos de uso comercial de los exports: **revisar EULA antes de
usar un export en material de cliente** (uso estándar de la industria es permitido, pero
se confirma, no se asume).

### Veredicto

**Inspirar / adoptar-condicional**: probar la web beta gratis para 2–3 assets reales
(propuesta + catálogo). Si el flujo rinde en Windows, proponer la compra del tier
Standard a Sergio (gasto = permiso explícito, regla vigente). No es fuente de código ni
de patrones web — es herramienta de assets de marketing.

---

## Addendum 2026-09-18 — `/examples` entra a la cosecha

El reel IG `DdZZmsQtr2-` («Arma tu stack de galerías») la nombra como «450+ ejemplos copy-paste».
Ya estaba descrita arriba (Examples library, gratis); lo que faltaba era que el harvester la
recorriera: agregada como `motion-dev-examples` en
`data/references/design-sources/gallery-reference-sources.json`. Regla: los ejemplos free se
retokenizan antes de usar; los marcados Motion+ no se copian.
