# Motion Pattern Bank 2026 — Web Factory ONIA

Fecha: 2026-07-25. Sintesis de 5 investigaciones (GSAP, anime.js v4, Motion/motion.dev, react-spring, direccion de arte anti-generico). Complementa `WEB_FACTORY_PATTERN_BANK_2026.md` (secciones/copy) — este banco es SOLO motion + direccion.

Kit implementado: `web-factory/apps/onia-platform/src/motion/` (Motion 12.42.0, importable como `@/motion`).

---

## 0) Decision de stack (una decision, no un menu)

| Rol | Libreria | Peso (gzip) | Por que |
|---|---|---|---|
| **DEFAULT de la casa** (todo React/Next 15) | **Motion (motion.dev)** en modo `LazyMotion + m + domAnimation` | ~4.6 kb sync + ~15 kb async (code-split). `domMax` +10 kb solo si aparece `layoutId`/drag | Declarativo atado al estado de React (`whileInView`, `AnimatePresence`, springs de serie); motor hibrido sobre WAAPI/ScrollTimeline nativos (compositor, hasta 120fps con el hilo JS ocupado); MIT irrevocable — importa para una factory que vende sitios; hooks con cleanup automatico (cero `ctx.revert()` manual) |
| **ESPECIALISTA scroll-storytelling** | **GSAP 3.13 + ScrollTrigger (+SplitText)** | ~49.6 kb el trio (28.3 + 17.9 + 3.4) | SOLO cuando la seccion exige pin real multi-capitulo, horizontal fake con `containerAnimation`, snap a labels o split por lineas con reflow de fuentes. Siempre `useGSAP` + `gsap.matchMedia` y **siempre por dynamic import dentro del componente** — jamas en el entry. Licencia propietaria (Webflow): gratis para webs de clientes; ojo si algun dia Web Factory expone un editor visual de animaciones no-code (clausula de no-competencia) |
| Descartada | anime.js v4 | 24.5–40 kb | Solapa a los dos sin ganar en ninguno: su Scroll observer es inmaduro vs ScrollTrigger, su integracion React (`createScope` + useEffect) es inferior a props declarativas, y `sideEffects` en el package limita el tree-shaking real. Lo unico unico (SVG morph/draw gratis MIT) lo cubrimos con `pathLength` de Motion |
| Descartada | react-spring | 20.1 kb (no tree-shakea: `sideEffects: true`) | Su unica ventaja (fisica interrumpible con transferencia de velocidad) ya viene en los springs de Motion; 20 kb enteros por algo duplicado no pasa el presupuesto |

**Para `apps/onia-platform` en concreto: SOLO Motion.** Las escenas sticky se resuelven con CSS `position: sticky` + `useScroll` scrub (patron 3) — no hay pin de GSAP en esta web. El split-text es un splitter propio accesible de ~1 kb (patron 2). Costo total de motion en first load ≈ 4.6 kb sync; contra el presupuesto de landing (<150 kb JS gzip) es ruido.

**Regla de escalada:** si un brief pide un scroll story que `sticky + scrub` no puede (pin anidado, horizontal con triggers hijos, snap por capitulos), se agrega GSAP a ESA app, dynamic-imported, y se anota en el README de la app. Nunca "por si acaso".

---

## 1) Reglas duras (aplican a TODOS los patrones)

1. **Compositor-only:** solo `transform` (x/y/scale/rotate), `opacity`, `clip-path`; `filter` con moderacion en elementos chicos. PROHIBIDO animar width/height/top/left/margin/padding/border/font-size/background-color (los cross-fades de color se hacen con dos capas + opacity).
2. **`prefers-reduced-motion` apaga todo.** La via global es `<MotionProvider>` (`MotionConfig reducedMotion="user"`). Todo componente con logica imperativa (timers, contadores, seguimiento de puntero) ademas chequea `useReducedMotion()` y renderiza el ESTADO FINAL estatico.
3. **SSR-safe:** el HTML del server trae el estado legible (texto visible para SEO/no-JS cuando aplica); los componentes de motion son `"use client"` empujados lo mas abajo posible del arbol. Nunca `ssr: false` para Motion (no hace falta).
4. **Cleanup:** los hooks de Motion limpian solos al desmontar. Timers propios (`setTimeout`/listeners) SIEMPRE con cleanup en el `useEffect`. Si se usa GSAP: `useGSAP` con `scope` (revierte tweens y triggers solo).
5. **Presupuesto:** landing <150 kb JS gzip. Librerias de motion pesadas por dynamic import. `LazyMotion strict` para que un `<motion.div>` accidental (34 kb) reviente en dev.
6. **Viewport once:** los reveals disparan UNA vez (`viewport={{ once: true }}`). Re-animar en cada scroll marea.
7. **Los numeros fiscales no bailan.** Cifras SIAT/facturas/impuestos aparecen firmes y exactas. CountUp solo para metricas de pitch (horas ahorradas, citas gestionadas), jamas para montos de factura.
8. **Motion que explica > motion que decora.** Cada web lleva AL MENOS una seccion didactica (patrones 8, 9, 3). El fade+rise es piso, no techo — una pagina hecha SOLO de reveals no pasa el gate.

---

## 2) Banco de patrones

Todos los snippets asumen el kit (`import { ... } from "@/motion"`) y `<MotionProvider>` en el layout. Costo marginal = sobre la base LazyMotion ya cargada.

### P1 — Reveal on scroll (fade + rise)

- **Comunica:** la pagina "se arma" mientras lees; jerarquia de entrada.
- **Cuando si:** bloques de contenido below the fold. **Cuando no:** above-the-fold del LCP (retrasa percepcion de carga); nunca como UNICO patron del sitio.
- **Kit:** `<Reveal>` (`reveal.tsx`).

```tsx
<Reveal from="bottom" delay={0.06}>
  <FeatureBlock />
</Reveal>
```

- **Costo:** 0 kb marginal. **Reglas:** transform/opacity, spring `gentle`, `viewport once`.

### P2 — Split-text reveal por palabras (titulares)

- **Comunica:** craft, "aca hubo diseño" — el sello de sitio premium.
- **Cuando si:** titulares de seccion (1–2 lineas). **Cuando no:** parrafos; el H1 critico del hero si el visitante debe leerlo YA (el reveal retrasa la lectura).
- **Kit:** `<SplitTextReveal>` (`split-text.tsx`) — splitter propio, accesible (aria-label en el padre, palabras aria-hidden: el screen reader lee la frase entera), determinista (sin mismatch de hidratacion), mascara por overflow.

```tsx
<SplitTextReveal as="h2" text="Encendes modulos cuando los necesites" />
```

- **Costo:** ~1 kb propio. **Nota:** si un dia hace falta split por LINEAS con reflow de fuentes, eso es SplitText de GSAP (`autoSplit`, `mask: "lines"`) — escalar segun regla de escalada.

### P3 — Sticky scene con scrub (el "pin" casero)

- **Comunica:** "frena, este es el argumento central" — narracion por capitulos controlada por el scroll del usuario (determinista, sin scroll-jacking).
- **Cuando si:** LA seccion didactica central (como se enciende un modulo, el flujo cita→recordatorio→cobro). Maximo 1–2 por pagina. **Cuando no:** paginas de contenido/SEO que se escanean; jamas dentro de un ancestro con `transform` (rompe sticky).
- **Kit:** `<StickyScene>` + `useSceneTransform` (`sticky-scene.tsx`). Con reduced-motion colapsa a seccion estatica con progreso=1.

```tsx
<StickyScene viewports={3}>
  <Panel />   {/* adentro: */}
</StickyScene>

function Panel() {
  const y = useSceneTransform([0, 0.4], [40, 0]);
  const opacity = useSceneTransform([0, 0.3], [0, 1]);
  return <m.div style={{ y, opacity }}>Paso 1</m.div>;
}
```

- **Costo:** 0 kb marginal (`useScroll` corre en ScrollTimeline nativo donde existe). **Escalada a GSAP:** pin multi-capitulo con snap a labels u horizontal fake → ScrollTrigger dynamic-imported.

### P4 — Stagger de grid

- **Comunica:** el grid es un SISTEMA, no cards sueltas; la onda dirige el ojo.
- **Cuando si:** grids de modulos/rubros/features (4–12 items). **Cuando no:** listas >20 items (delay acumulado = pagina lenta); above-the-fold critico.
- **Kit:** `<StaggerGrid>` + `<StaggerItem>` (`stagger-grid.tsx`).

```tsx
<StaggerGrid as="ul" stagger={0.07}>
  {modulos.map((mod) => (
    <StaggerItem as="li" key={mod.id}><ModCard {...mod} /></StaggerItem>
  ))}
</StaggerGrid>
```

- **Costo:** 0 kb marginal.

### P5 — Count-up fisico

- **Comunica:** "dato medido ahora" — el numero acelera y frena con masa.
- **Cuando si:** metricas de pitch (horas ahorradas/semana, mensajes respondidos). **Cuando no:** REGLA 7 — cifras fiscales/SIAT/precios de factura NUNCA; tablas densas; valores en streaming.
- **Kit:** `<CountUp>` (`count-up.tsx`) — spring MotionValue escribiendo `textContent` directo: cero re-renders por frame; SSR renderiza el valor final (SEO/no-JS ven el numero real); `tabular-nums` anti-jitter.

```tsx
<CountUp value={1240} format={(v) => `${Math.round(v).toLocaleString("es-BO")} citas`} />
```

- **Costo:** 0 kb marginal.

### P6 — CTA fisico (hover/tap spring) y Magnetic

- **Comunica:** materialidad — el boton responde como objeto, no como CSS.
- **Cuando si:** CTAs primarios (WhatsApp, "Entrar a la app"); Magnetic solo en 1–2 elementos sueltos por viewport. **Cuando no:** links inline (scale rompe el ritmo tipografico); tablas densas (hover CSS basta); Magnetic en touch (el kit ya lo ignora).
- **Kit:** `<PressableCta>` y `<Magnetic>` (`magnetic.tsx`).

```tsx
<PressableCta><a href="https://wa.me/PLACEHOLDER?text=Hola%2C%20quiero%20conocer%20Onia">Hablemos por WhatsApp</a></PressableCta>
```

- **Costo:** 0 kb marginal.

### P7 — Toggle de modulo (didactico)

- **Comunica:** EL pitch de ONIA Platform — "encendes modulos cuando los necesites". El visitante toca el switch y VE el modulo pasar de gris-apagado a vivo.
- **Cuando si:** la seccion de modulos/add-ons de onia-platform; demos interactivas de pricing por modulo. **Cuando no:** como switch de settings real (esto es una pieza narrativa).
- **Kit:** `<ModuleToggle>` + `<ModulePower>` (`module-toggle.tsx`). Knob por transform, pista encendida por cross-fade de capas (opacity — nunca background-color), `role="switch"` accesible, colores via CSS sobre `[data-track-on]`/`[data-knob]` (acento semantico lo pone la hoja de estilos).

```tsx
const [on, setOn] = useState(false);
<ModuleToggle on={on} onToggle={setOn} label="Chatbot WhatsApp" />
<ModulePower on={on} placeholder={<span>Activalo cuando lo necesites</span>}>
  <ChatbotPreview />
</ModulePower>
```

- **Costo:** 0 kb marginal.

### P8 — Escena autonoma explicativa ("el agente reprograma")

- **Comunica:** que HACE el agente 24/7 con aprobacion humana, sin leer un parrafo: el paciente avisa que no puede, el agente propone, el chip de la cita VIAJA de martes a jueves, y aparece "Aprobado por la clinica" (human-in-the-loop explicito — compliance: el agente REPROGRAMA, no "recuerda", y no actua sin aprobacion).
- **Cuando si:** la seccion de agentes IA de onia-platform; adaptable por rubro (pedido que cambia de dia, pago que se confirma). Una por pagina. **Cuando no:** si el copy de la escena promete algo que el producto no hace HOY.
- **Kit:** `<AgentRescheduleScene>` (`agent-scene.tsx`) — loop por pasos con timers (pausado fuera de viewport), viaje del chip medido contra el DOM real (sobrevive al CSS del builder), `role="img"` con aria-label descriptivo, reduced-motion = cuadro final estatico.

```tsx
<AgentRescheduleScene
  patientMessage="Hola, no voy a poder el martes…"
  agentMessage="Sin problema. ¿Jueves 15:30? Queda pendiente de aprobacion."
  approvedLabel="Aprobado por la clinica"
/>
```

- **Costo:** 0 kb marginal.

### P9 — Parallax controlado

- **Comunica:** profundidad y materialidad; fondo y figura en planos distintos.
- **Cuando si:** 1–2 planos en una seccion visual fuerte. **Cuando no:** sobre la imagen LCP del hero; mas de 2-3 capas por viewport = ruido; movil con imagenes pesadas.
- **Snippet (hooks de Motion, sin kit — es un one-liner):**

```tsx
"use client";
const ref = useRef(null);
const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
const y = useTransform(scrollYProgress, [0, 1], [-40, 40]);
return <m.img ref={ref} style={{ y }} width={960} height={640} alt="…" />;
```

- **Costo:** 0 kb marginal. **Reglas:** solo `y`; siempre dimensiones explicitas en la imagen.

### P10 — Exit con presencia (`AnimatePresence`)

- **Comunica:** nada desaparece de golpe — modales, toasts, items salen con intencion.
- **Cuando si:** overlays, acordeones FAQ, filtros. **Cuando no:** transiciones de RUTA completas en App Router (el unmount de Next no espera al exit — mantenerlo a nivel componente).
- **Snippet:**

```tsx
<AnimatePresence>
  {open ? (
    <m.div key="sheet" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} />
  ) : null}
</AnimatePresence>
```

- **Reglas:** `key` estable (nunca indice); `AnimatePresence` envuelve el condicional, no al reves.

### P11 — Barra de progreso de lectura

- **Comunica:** "se donde estoy" — señal de contenido largo cuidado.
- **Cuando si:** paginas largas de contenido (docs, casos). **Cuando no:** paginas <2 viewports; si ya hay otro indicador.
- **Snippet:** `const { scrollYProgress } = useScroll(); <m.div style={{ scaleX: scrollYProgress, transformOrigin: "left" }} />` — `scaleX`, nunca `width`.

### P12 — SVG que se dibuja (diagramas didacticos)

- **Comunica:** "te lo explico paso a paso" — el flujo (cliente → agente → aprobacion → SIAT) se traza ante tus ojos.
- **Cuando si:** diagramas de flujo de 3–8 trazos. **Cuando no:** SVGs de cientos de paths; decoracion sin significado (si el trazo no explica, es ruido).
- **Snippet (Motion, `pathLength`):**

```tsx
<m.path
  d="…" fill="none" strokeWidth={2}
  initial={{ pathLength: 0 }}
  whileInView={{ pathLength: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 1.6, ease: "easeInOut" }}
/>
```

- **Nota:** anima `stroke-dasharray` (excepcion sancionada: SVG chico, costo real bajo). Morphs de forma complejos → escalar a GSAP MorphSVG segun regla de escalada.

### P13 — Layout morph compartido (`layoutId`)

- **Comunica:** continuidad entre estados (tab activo que viaja, card → modal). La firma de Figma/Framer, imposible en GSAP sin fabricarlo.
- **Cuando si:** navegacion por tabs del selector de rubro, si el diseño lo pide. **Cuando no:** listas grandes (cada cambio mide DOM); presupuesto ajustado.
- **Costo:** requiere subir `features.ts` a `domMax` (+10 kb) — decision consciente, en un solo lugar.

```tsx
{rubros.map((r) => (
  <button key={r.id} onClick={() => setActive(r.id)}>
    {r.label}
    {active === r.id ? <m.div layoutId="rubro-activo" data-underline /> : null}
  </button>
))}
```

### P14 — Scroll storytelling con pin real (GSAP — escalada)

- **Comunica:** capitulos con snap, horizontal fake, triggers hijos dentro del viaje.
- **Cuando si:** SOLO si P3 (sticky+scrub) demostrablemente no alcanza. **Cuando no:** por defecto — es la escalada, no el default.
- **Reglas de uso:** `npm i gsap @gsap/react` EN ESA app; `useGSAP` con `scope` (cleanup automatico); `gsap.matchMedia` con branch `(prefers-reduced-motion: no-preference)`; plugins por `await import("gsap/ScrollTrigger")`; `ScrollTrigger.refresh()` tras cargar media; nunca pinear dentro de un ancestro con transform. Costo: ~46–50 kb gzip — se paga solo si la seccion lo justifica.

### P15 — ScrollList: item activo sincronizado con scroll

- **Comunica:** mientras scrolleás, UN rubro/modulo a la vez se enciende; su panel (imagen/captura real del sistema) cambia al costado sin click del usuario (determinista, scroll controla todo).
- **Cuando si:** la primera pasada narrativa de ONIA Platform (6 rubros → 6 vistas del tablero de control). Distinto del selector por click (P8, rubro/módulos): este se ENCIENDEN solos. **Cuando no:** si el usuario debe elegir activamente (es un selector, no una narrativa).
- **Origen:** patrón "Built for every niche" de Fanvue (allá son categorías de creador; acá traducimos a rubros del producto).
- **Kit:** `<ScrollList>` (`scroll-list.tsx`).

```tsx
const rubros = [
  {
    id: "dental",
    label: "Dental",
    panel: <CapturaReal rubro="dental" />,
  },
  // ... más rubros
];

<ScrollList
  items={rubros}
  perItem={1.1}
  className="scroll-scene"
  stickyClassName="sticky-wrap"
  listClassName="rubro-list"
  panelClassName="rubro-panel"
  dimOpacity={0.28}
/>
```

**Props:**
- `items`: array de `{ id, label, panel }`. El `panel` es el ReactNode que se muestra cuando el item está activo.
- `perItem`: viewports de scroll por item (0.9–1.4 razonable; default 1.1).
- `dimOpacity`: opacidad de items inactivos (0.0–1.0; default 0.28).
- `className`, `stickyClassName`, `listClassName`, `panelClassName`: clases CSS para customizar.

**Comportamiento:**
- El contenedor tiene altura `items.length * perItem * 100vh` (crece con el scroll).
- Mientras scrolleás, un listener en `scrollYProgress` calcula qué item está activo (`floor(progress * n)`).
- El item activo: opacidad 1, x=0 (nada desplazado), todos los demás: opacidad dimOpacity, x=-4px.
- El panel del activo: opacity 1 scale 1; inactivos opacity 0 scale 0.97 (transiciones con `springs.gentle`).
- El wrapper `.sticky` queda `position: sticky; top: 0` mientras la escena dura.

**Accesibilidad:** items inactivos llevan `aria-hidden={true}`; la lista es semantica `<ul><li>`.

**Reduced-motion:** lista estática con todos los items visibles al 100%, sin pin, sin scrub. El panel del primero se muestra solo.

- **Costo:** 0 kb marginal.

### P16 — Marquee: cinta infinita horizontal

- **Comunica:** abundancia, linaje — logos de prensa/clientes/integraciones en movimiento continuo.
- **Cuando si:** SOLO con logos/marcas REALES y verificables. **Cuando no:** NUNCA relleno (logos de herramientas que usamos, marcas ajenas, placeholders). Una web con marquee falso se ve barata.
- **Kit:** `<Marquee>` (`marquee.tsx`).

```tsx
<Marquee duration={26} className="marquee-wrap" trackClassName="marquee-track">
  {["Logo1", "Logo2", "Logo3"].map((name) => (
    <div key={name} className="logo-chip">{name}</div>
  ))}
</Marquee>
```

**Props:**
- `children`: ReactNode que se repite. Duplicación interna automática.
- `duration`: segundos por vuelta completa (default 32; más alto = más lento).
- `reverse`: boolean para invertir dirección (default false).
- `className`, `trackClassName`: clases CSS.

**Comportamiento:**
- El contenedor tiene `overflow: hidden`.
- La pista (track) tiene `display: flex; width: max-content`.
- Motion anima `x` de 0% → -50% (o -50% → 0% si `reverse`), infinito lineal.
- El contenido se copia internamente (`aria-hidden=true` en la copia).
- El loop es invisible gracias al desplazamiento exacto de -50%.

**Reduced-motion:** `overflow-x: auto` manual (sin animacion).

- **Costo:** 0 kb marginal.

### P17 — Coverflow: carrusel 3D con perspectiva

- **Comunica:** "estos son casos REALES" — tarjeta central grande y viva; laterales rotadas de contexto. El usuario navega con botones (1 tap = siguiente caso).
- **Cuando si:** testimonios/casos de clientes REALES que pagan. **Cuando no:** placeholder ("Ejemplos reservados para casos reales" = honesto; pero si la web vive sin casos, no shippea esta seccion).
- **Origen:** patrón "Creators" de Fanvue.
- **Kit:** `<Coverflow>` (`coverflow.tsx`).

```tsx
const casos = [
  {
    id: "clinica-santa-rosa",
    content: <CaseImage />,
    caption: (
      <>
        <b>Clínica Santa Rosa</b>
        <span>Gestión de 150+ citas/mes, integrado con SIAT</span>
      </>
    ),
  },
  // ... más casos
];

<Coverflow
  items={casos}
  className="cover-wrap"
  stageClassName="cover-stage"
  cardClassName="cover-card"
  captionClassName="cover-caption"
  controlsClassName="cover-controls"
  tilt={22}
  spread={78}
  labels={{ prev: "Anterior", next: "Siguiente" }}
/>
```

**Props:**
- `items`: array de `{ id, content, caption? }`. El `content` es el ReactNode visible (imagen/captura); `caption` opcional, solo para la tarjeta activa.
- `tilt`: grados de rotación Y de las tarjetas laterales (default 22; controla cuánto giran).
- `spread`: desplazamiento lateral en % del ancho de la tarjeta (default 78; controla el espacio entre tarjetas).
- `labels`: `{ prev: string; next: string }` para aria-labels de los botones.
- `className`, `stageClassName`, `cardClassName`, `captionClassName`, `controlsClassName`: clases CSS.

**Comportamiento:**
- El stage tiene `perspective: 1400; display: grid; place-items: center`.
- Cada tarjeta calcula su distancia circular al índice activo (`d = i - index`; acotado a ±n/2 para loop).
- Tarjeta activa (d=0): `rotateY: 0; scale: 1; opacity: 1; zIndex: 10`.
- Tarjetas adyacentes (d=±1): rotadas ±22°, scaled 0.86, opacidad 0.45, desplazadas laterales.
- Tarjetas lejanas (d>±2): opacidad 0, z-index decreciente (no visibles).
- Botones prev/next ciclean el índice: `(index - 1 + n) % n` y `(index + 1) % n`.

**Accesibilidad:** tarjetas inactivas llevan `aria-hidden=true`; botones tienen aria-labels.

**Reduced-motion:** grilla estática con `display: flex; gap: 16; overflow-x: auto` — sin rotacion ni transiciones, solo scroll manual.

- **Costo:** 0 kb marginal.

### P18 — BleedWordmark: palabra gigante que se sale del borde

- **Comunica:** presencia, escala — cierre de página. El nombre de la marca gigante, cortado por el borde inferior, con un suave parallax (6% máximo).
- **Cuando si:** UNA SOLA VEZ por página, siempre al final (footer/remate). **Cuando no:** multi-uso, mid-page, o como decoracion.
- **Origen:** cierre de la landing de Fanvue.
- **Kit:** `<BleedWordmark>` (`bleed-wordmark.tsx`).

```tsx
<BleedWordmark
  text="onia"
  className="bleed-wrap"
  shift={6}
/>
```

**Props:**
- `text`: string a renderizar (default "onia"). Reemplaza el texto, no agrega clase.
- `shift`: parallax en % (cuánto sube mientras scrolleás de abajo; default 6; rango sano: 3–8%).
- `className`: clase CSS del contenedor.

**Comportamiento:**
- Contenedor tiene `overflow: hidden` (el recorte).
- El `<p>` tiene:
  - `fontSize: clamp(5rem, 26vw, 22rem)` — responsive desde 5rem hasta 22rem.
  - `lineHeight: 0.78` — líneas tocadas, bloque compacto.
  - `fontWeight: 560` — peso medio-alto (tipo Archivo Variable).
  - `letterSpacing: -0.03em` — tracking negativo, comprime.
  - `marginBottom: "-0.18em"` — la mitad inferior de la caja queda fuera (el "bleed").
- Motion anima `y` desde `+6%` (cuando el elemento entra al viewport) a `0%` (cuando sale por abajo).
- Offset: `["start end", "end end"]` — comienza a animar cuando el elemento está visible al fondo.

**Accesibilidad:** el texto es real (seleccionable, indexable); se recorta con overflow CSS, nunca es una imagen. `aria-hidden=false` para que los lectores de pantalla lo lean.

**Reduced-motion:** sin parallax (y=0%), mismo recorte visual.

- **Costo:** 0 kb marginal.

### P19 — Boton multi-estado (reposo -> proceso -> resultado)

- **Comunica:** el control ES el indicador de estado; no hay spinner aparte ni cartel que aparezca al lado. Subir, pagar, enviar.
- **Cuando si:** una accion con una espera corta y verificable (subida, cobro, envio de formulario). **Cuando no:** procesos largos o con pasos — eso pide una vista, no un boton.
- **Implementacion de referencia (vanilla, sin kit):** `hermes-content/references/ui-patterns/upload-button/`.
- **Mecanica:** las 3 etiquetas viven APILADAS en la misma celda (`grid-area: 1/1`) y cruzan por opacity — nada salta de layout. El estado se maneja con un `data-state` en el boton, no con clases sueltas.
- **EXCEPCION DECLARADA a la regla dura 1:** este patron anima `width` (el pill colapsa al ancho del boton) y `background-color`. El colapso ES el gesto del patron y ocurre en UN elemento aislado sin hermanos que reflowear. El cross-fade de color se puede pasar a dos capas + opacity si el perfil lo pide; a hoy no lo justifica. Si se porta a una landing con muchos hermanos, medir Layout en DevTools antes de shippear.
- **Nombre accesible:** las etiquetas visuales van `aria-hidden` y el nombre real vive en un `aria-label` que el JS actualiza por estado — si no, el lector lee las tres juntas ("Upload Uploading Completed").
- **Costo:** 0 kb. No necesita libreria de motion.

### P20 — Progreso que ES el contenido (clip-path + `@property`)

- **Comunica:** el archivo se "llena" a si mismo. No hay barra separada: la miniatura viva se revela sobre su version fantasma en escala de grises.
- **Cuando si:** subida de archivos, importacion de productos, cualquier cola donde cada item tiene identidad visual propia. **Cuando no:** progreso de una sola tarea sin objeto que mostrar (ahi alcanza una barra).
- **Implementacion de referencia (vanilla):** `hermes-content/references/ui-patterns/dropzone-progress/`.
- **Mecanica:** una custom property registrada con `@property --p` (asi es animable) + `clip-path: inset(0 0 calc((1 - var(--p)) * 100%) 0)` sobre la capa viva. `clip-path` es paint, no dispara layout — permitido por la regla 1.
- **Ojo:** el `easing: SPRING` que circula en los reels NO es sintaxis nativa de la Web Animations API. Usar `cubic-bezier(0.34, 1.56, 0.64, 1)` para el rebote equivalente.
- **Costo:** 0 kb.

### P21 — Overlay nativo (`<dialog>`) en vez de div + focus-trap a mano

- **Comunica:** nada por si mismo — es la mecanica correcta debajo de cualquier modal, carrito o panel.
- **Cuando si:** SIEMPRE que haya un overlay modal. **Cuando no:** paneles no modales (ahi va `popover`).
- **Implementacion de referencia (vanilla):** `hermes-content/references/ui-patterns/floating-cart/`.
- **Por que:** `showModal()` da Escape, foco atrapado, devolucion del foco al disparador y `::backdrop` sin una linea de JS. Reimplementarlo a mano es como se rompen los modales.
- **BUG REAL, no teorico:** bajo `prefers-reduced-motion` NO alcanza `transition-duration: 0.01ms`. Las propiedades DISCRETAS (`display`, `overlay`) con 0,01 ms dejan al `<dialog>` a medio camino: abierto y con `opacity: 0`, o sea invisible para quien pidio menos movimiento. Va `transition: none`.
- **Entrada:** `@starting-style` para animar la apertura sin JS. El disparador va `inert` cuando no aplica (carrito vacio): invisible Y no enfocable, no solo `opacity: 0`.
- **Costo:** 0 kb.

### P22 — Flip 3D para revelar el dorso

- **Comunica:** hay una cara oculta del mismo objeto (el CVV de una tarjeta, un detalle al reverso).
- **Cuando si:** el objeto tiene dos caras reales y el usuario necesita las dos. **Cuando no:** como adorno en una card de contenido.
- **Implementacion de referencia (vanilla):** `hermes-content/references/ui-patterns/checkout-card/`.
- **Mecanica:** `transform-style: preserve-3d` en el contenedor + `backface-visibility: hidden` en cada cara + `rotateY(180deg)`. 0,85 s: mas rapido no se lee como giro.
- **Foco:** el objeto que gira va `aria-hidden` y SIN elementos enfocables adentro. Si hay foco en la cara oculta, el teclado se pierde.
- **Costo:** 0 kb.

---

**Nota sobre los patrones vanilla (P19-P22).** Salieron de reconstruir reels de UI mirando los
fotogramas, no de la libreria: `hermes-content/references/ui-patterns/`. Los originales usan
React + framer-motion y **los cuatro salieron identicos en CSS puro**. Antes de sumar una
dependencia de motion para un componente aislado, intentarlo sin ella. Reglas y bugs
aprendidos: `hermes-content/references/ui-patterns/README.md`.

**Nota sobre tipografía:** todos estos patrones usan las familias tipográficas del sistema. Ver `TIPOGRAFIA_SISTEMA_20260727.md` para detalles de tokens, la clase `.display` (usar en titulares grandes), y la escala responsiva con `clamp()`.

---

## 3) Direccion (reglas ANTI-IA — obligatorias, del research anti-generico)

El motion no salva una pagina generica. Estas reglas son gate ANTES de animar:

1. **Concepto antes de pixeles.** Todo sitio nace de un objeto real del rubro (talonario de citas, ticket de caja, expediente). El builder escribe 3 lineas "por que NO es generica" o no arranca. Para onia-platform el objeto es **el tablero de control del negocio: modulos que se encienden** — la web ES la demo.
2. **Tipografia: prohibido mono-sans.** Max 2 familias + 1 mono; display SIEMPRE distinta del body. **Prohibido Inter, Geist, Onest, Poppins o Montserrat como display.** Para SaaS/producto: display **Bricolage Grotesque**, body **DM Sans** o Instrument Sans, datos **Spline Sans Mono** con `tabular-nums`. Toda cifra de plata en mono tabular. Display con tracking −0.02em y `clamp()` agresivo (hero ≥4.5rem desktop).
3. **Layout: la simetria es el enemigo.** Prohibido hero centrado + subtitulo + 2 botones + gradiente. Alternativas: split asimetrico 7/5 con overlap, hero editorial, hero-demo (el toggle de modulo EN el hero). En 8 secciones, ≥4 familias de layout; al menos una full-bleed.
4. **Color semantico, escaso, con temperatura.** Un acento = un significado; nunca decorativo. Prohibidos indigo/violeta-500, gradientes morado-azul, `#fff` puro y gris neutro de fondo — todo fondo con matiz en oklch. Dark mode se DISEÑA, no se genera.
5. **Copy con voz.** Prohibido "Soluciones integrales" / "al siguiente nivel" / headline + 3 beneficios simetricos. Nombrar plata, plazos y objetos. Test: si la frase sirve para cualquier empresa, se corta.
6. **Motion narrativo: una seccion que EXPLICA por sitio** (P3/P7/P8/P12). Fade+rise es piso, no techo.
7. **Profundidad, no flat uniforme.** Sombras calidas dobles con el hue del fondo, overlaps intencionales, marcos de browser para screenshots. Prohibido radius-12 + sombra gris + padding uniforme en TODAS las cards.
8. **Proof real o placeholder honesto.** Cero testimonios/cifras de clientes inventados, cero SLA, cero fotos stock de gente sonriendo. Marco "captura real pendiente" > mentira bonita. Compliance ONIA: nunca "por ley tenes que comprarnos" (el portal del SIN es gratis y se dice de frente); "proximamente" honesto para lo que no existe; precios solo "DentalGest desde Bs 320/mes — precios de lanzamiento", add-ons "a cotizar".
9. **Cuarentena shadcn.** 21st/Aceternity/Magic UI solo para MECANICA (a11y, comportamiento); la direccion visual sale del concepto + referencias fuera del ecosistema (Mercury: seriedad por tipografia y ritmo; Oatly: voz; The Pudding: scrollytelling que explica).
10. **Gate pre-ship (squint test).** ¿Display Inter/una sola sans? ¿hero centrado con gradiente? ¿3+ cards identicas con iconito? ¿acento decorativo repartido? ¿copy intercambiable? **2+ sies = no shippea.** Prueba final: screenshot en blanco y negro sin logo — si podria ser un template de Vercel, volver a la regla 1.

---

## 4) Checklist de QA motion (pre-merge)

- [ ] `prefers-reduced-motion: reduce` → la pagina queda 100% legible y estatica (probar con emulacion de DevTools).
- [ ] DevTools Performance: ninguna animacion dispara Layout/Paint recurrente (solo Composite).
- [ ] First load JS de la ruta <150 kb gzip (`next build` lo reporta); features de Motion llegan async.
- [ ] Reveals disparan una sola vez; nada re-anima al volver a scrollear.
- [ ] Escenas con timers se pausan fuera del viewport (AgentScene) y limpian al desmontar.
- [ ] 320px: sticky scenes y escenas didacticas no desbordan; el viaje del chip se re-mide al resize.
- [ ] Cifras fiscales/precios sin count-up (regla 7).
- [ ] Gate anti-IA de la seccion Direccion pasado (2+ sies = no shippea).
