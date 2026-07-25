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
