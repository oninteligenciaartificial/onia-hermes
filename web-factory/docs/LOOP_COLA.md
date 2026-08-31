# Loop web-factory — cola de trabajo (analizar ⇄ desarrollar)

> La leen los dos crons in-session. **Regla madre: el loop SIEMPRE trabaja** —
> cada vuelta o DESARROLLA (construye) o ANALIZA (aprende) y refina. Nunca se
> queda sin tarea: si un carril se vacía, el de análisis genera la próxima desde
> el catálogo o los huecos del crítico.

## FOCO (lo que perseguimos ahora)

Convertir el **catálogo de técnicas verificado** (`docs/WEB_FACTORY_TECNICAS_2026.md`,
`WEB_FACTORY_FORMULA_2026.md`, `2026-08-29-*.md`) en **webs y dashboard reales de
Onia**: on-brand, animados (Next/React + motion.dev/GSAP, o estático CSS según
tier), y **conectados a Onia Platform** (form → lead). Seguir aprendiendo solo
para cerrar huecos que frenan el build.

## REGLA DE EVIDENCIA (mata el trabajo fantasma)

> Adoptada del carril de `onia-platform` el 2026-08-30, donde **4 de 6 ítems de la cola
> resultaron fantasma**. Acá la primera pasada encontró **3 de 11**.

**Ningún ítem entra a "por hacer" sin evidencia de que el problema EXISTE HOY**: un
`archivo:línea`, la salida de un comando, o una captura. Sin eso no es una tarea: es una
sospecha, y va a la lista de *sin verificar*.

Antes de trabajar un ítem, **se re-verifica su evidencia** — un defecto que era real la
semana pasada puede estar arreglado y nadie tachó la línea. Ese es exactamente el modo de
falla: la cola envejece peor que el código.

Las tres formas de fantasma que ya aparecieron acá:
1. **Arreglado y no tachado** — W4 decía "cero `:focus-visible` en 590 líneas"; hay 2, los
   puse yo el mismo día.
2. **Duplicado** — A1e repetía el gap del donut y el tamaño de marcador que ya pedía W4.
3. **En curso** — A3 ("reproducir sitio #2") se está construyendo en `apps/ferreteria-sur/`
   mientras la línea seguía abierta como si nadie la hubiera empezado.

## Reglas duras del run

1. **Worktree**: `C:\dev\proyectos\onia-hermes\.claude\worktrees\hyperframes-onia-export-formats-053cf9`
   — rama `claude/onia-web-architecture-b37eca`. NO otro checkout.
2. **Anti-choque**: `git status --short` sucio de OTRA mano → NO tocar código,
   solo salud, y salir.
3. **Zona propia**: `web-factory/{data,packages,generate,out,tests,docs,FACTORY.md,apps/dental-premium}`
   + `.claude/skills/onia-web-factory/`. PROHIBIDO `web-factory/apps/{onia-platform,site,dentalgest-landing}`,
   `hermes-content/docs/**` (salvo `handoff/web-factory-cliente-prueba.md`) y n8n.
4. **UNA tarea por vuelta**, la primera no-bloqueada del carril que toque. Gates
   antes de commit: `pnpm typecheck:packages` (+ `pnpm test` si tocás packages;
   `tsc --noEmit` en `apps/dental-premium` si la tocás) + **mirar renderizado**.
   Commit conventional (por qué, en español, sin firma) + push. Marcar `[x]`.
5. **Tachadas NO se rehacen. Bloqueado por decisión de Sergio → PushNotification
   y seguir con lo desbloqueado.** Nada de cirugía inventada.

## Runbook de salud (el cron de análisis lo corre; auto-REMEDIAR)

1. Server `curl -s -o/dev/null -w "%{http_code}" http://localhost:4319/dental-amanecer/` ≠200
   → `node scripts/serve-out.mjs 4319` en background desde `web-factory/`.
2. Rama pusheada (`git log origin/… -1` == `git log HEAD -1`); commits locales → push.
   Árbol sucio de otra mano → no commitear, avisar.
3. `pnpm typecheck:packages` verde; rojo en zona → arreglar mínimo y commitear.
4. Node zombies de tests viejos → matar. Cerrar con la prueba (200, hash, exit 0).

---

## CARRIL A — DESARROLLAR (build; el cron de tareas tira de acá primero)

- [x] **A1a · Dashboard: charts a tema categórico** (2026-08-30, **rehecho**).
      El primer intento (29-ago) eligió 6 hues **a criterio** y estaba MAL: la skill
      `dataviz` trae un validador ejecutable y los reprobó — el verde de marca daba
      chroma 0.097 (**leía gris**) y terracota↔oliva ΔE 4.9 en deutan (**el mismo
      color** para daltonismo verde). Rehecho **computando**: enumeradas las 720
      permutaciones contra los surfaces reales (`#f6f2ea` / `#161c22`) en ambos modos
      → `aqua > blue > orange > violet > yellow > magenta`, peor ΔE adyacente **13.2**
      (piso 8). Emitidos como custom properties `--wf-series-N` con steps propios de
      dark, porque un hex quemado en el atributo SVG no puede cambiar con el tema.
      Verificado midiendo el color resuelto en el navegador + mirando ambos temas.
      **Lección: el color es computable — correr el validador, no estimarlo.**

> **Defectos que reveló MIRAR el render** (2026-08-30). Ninguno se ve en el código;
> los cinco salieron de abrir la captura en light y en dark.

> **Fuente de estas tareas** (2026-08-30): `data/references/design-sources/2026-08-30-como-se-hace-un-dashboard.md`
> — 8 dashboards de referencia despiezados **contra su código real** (8/8 fichas
> sobrevivieron al crítico), + diagnóstico del admin de Onia y de este template.
> 12 leyes convergentes, anatomía con números, brecha y plan. **Leerlo antes de tocar.**

- [x] **W1 · Desbloquear lo visual** (2026-08-30). Tres defectos que hacían teórico
      todo lo demás: (a) **la fuente nunca cargaba** — el CSS pedía "Onest" y el
      documento no emitía ningún `<link>`, así que el panel entero renderizaba en la
      fuente del sistema; `renderFontLinks` vivía como función local de
      `landing-clinic`, se extrajo a `font-links.ts` compartido. (b) **la tarjeta era
      invisible**: `--card` era literalmente `--color-bg`, 1,00:1; ahora se eleva un 3%
      del fg y da 1,07:1, el mismo orden que el dark (1,11:1) que sí funcionaba — el
      sistema de capas existía solo en oscuro. (c) `tabular-nums` en cifras, deltas,
      ejes y tabla. Verificado midiendo (`document.fonts.check` = true) y mirando.
- [x] **W2 · Un solo color por dato** (2026-08-30). Barras, sparkline y spark de KPI
      pintaban con `--color-primary` mientras la línea multi-serie y el donut usaban
      `--wf-series-*`: **el mismo dataset salía verde marca en barras y aqua en la
      serie "Real" del gráfico de al lado**. Ahora toda la tinta de dato es
      `--wf-series-1`; `--color-primary` quedó solo para cromo. De paso, el sparkline
      tenía `preserveAspectRatio="none"`, que deformaba el trazo y volvía elipse el
      punto final. Yo había justificado las barras verdes como "una serie no compite":
      el corpus y el propio demo lo desmienten.
- [x] **W7 · Rediseño del panel: de demo genérico a panel de clínica** (2026-08-30,
      pedido de Sergio: *"demasiado simple, tipografía muy genérica, métricas sin
      sentido… apartado de IA, apartado de notas"*). Tenía razón y se puede probar:
      el demo usaba **Onest para display Y body**, y `MOTION_PATTERN_BANK:462` prohíbe
      literal *"mono-sans"* y nombra a **Onest** entre las prohibidas como display.
      Ahora: Bricolage Grotesque (display) + DM Sans (body) + Spline Sans Mono (datos),
      que es lo que ese mismo banco manda para SaaS/producto.
      **KPIs que deciden**, no que decoran: cada uno lleva la plata o el tiempo en
      juego ("11 h de sillón sin usar — unos Bs 3.300"), en vez de "ticket promedio".
      **Apartado de IA**: bandeja de propuestas del agente, cada una pegada a la
      evidencia que la justifica, con Aprobar/Descartar — human-in-the-loop, como el
      módulo `agents` del core, y es el punto 3 de la dirección que Sergio ratificó el
      17-ago. Las 4 propuestas salen de capacidades que el core YA declara
      (`scheduling`+`whatsapp`, `relationships`, `sales_cash`), no de fantasía.
      **Apartado de notas**: maqueta visual con ancla a paciente/proveedor.
      ⚠️ **Defecto de MI método, no del producto**: la captura fullPage sin scrollear
      dejaba el 4º chart y la tabla en `opacity:0` (nunca disparaba el reveal) y
      parecía que faltaran. Toda captura de una página con `[data-reveal]` se scrollea
      antes. Las capturas anteriores de esta sesión pudieron ocultar contenido.
- [x] **W3 · Bugs de dato (los que MIENTEN)** (2026-08-31). Los cuatro, de raíz, en
      `packages/templates/src/dashboard.ts`. (a) **Negativos**: había 4 `Math.max(v, 0)`
      y 3 eran el bug — el cuarto (`dashboard.ts:342`) es el clamp 0-100 de una barra de
      progreso y se deja. Ahora existe una **escala con dominio real** (`chartScale`):
      el cero es una línea interna, lo negativo cuelga debajo y el `<title>` deja de
      contradecir al dibujo. El área de la serie única también se cierra contra el cero,
      no contra el piso del plot. (b) **Último punto del eje X**: se cuenta `step`
      **desde el final**, así el final de la serie siempre queda rotulado (antes solo
      por casualidad). (c) **Recorte silencioso**: las barras se reparten por **ranura**
      (`PLOT_W / count`) con el gap cediendo espacio; antes el ancho tenía piso de 2px y
      a partir de ~58 puntos las últimas barras se dibujaban FUERA del viewBox.
      (d) **Eje inflado**: escalera fina en `niceMax` (1 · 1,5 · 2 · 2,5 · 3 · 3,5 · 4 ·
      5 · 6 · 7,5 · 8 · 10) — 340 ahora va a **350**, no a 500; el plot muerto pasa de
      32% a 2,9%. + `rx` de la barra clampeado a media barra/media altura y `formatTick`
      que abrevia negativos (`-1.8k`, antes `-1750`).
      **Gates**: `typecheck:packages` verde, **205/205** (7 tests nuevos en
      `dashboard.test.ts`, el primer test unitario de este template) y **mirado
      renderizado en claro y oscuro** con un fixture temporal que mete un negativo, un
      cero y una serie de 58 puntos: 0 `[data-reveal]` ocultos, 0 errores de consola.
      **Lección: los cuatro pasaban todos los gates existentes** — por eso W6.
- [x] **W4 · Gauge/radial + defectos visuales** (2026-08-31). Evidencia re-verificada
      antes de tocar (`gauge|radial` → 0, `r="2.5"` → 1, `paddingAngle` → 0). Los siete:
      (a) **medidor radial** nuevo (`type: "radial"`, arco de 270° abierto abajo con la
      cifra al centro) — es lo que resuelve el porcentaje pelado, que solo dice el número
      y no dónde cae contra su tope. Cableado a un dato que YA estaba en el panel: el KPI
      "Citas de hoy 9" con su contexto "7 confirmadas – 2 esperan respuesta" → 78%. Cero
      cifra inventada. (b) marcadores `r` 2,5→**4** (8px, el piso de `dataviz`); el punto
      final del sparkline también. (c) **gap entre gajos** del donut, descontado del largo
      DIBUJADO y no del reparto: separa sin mover el ángulo, que sigue siendo la
      proporción exacta. (d) **`rx` solo en la punta libre**: las barras pasaron de `<rect
      rx>` (que redondea las 4 esquinas y dejaba la barra flotando sobre el cero) a un
      `<path>` con el radio arriba en la positiva y abajo en la negativa. (e) **total al
      centro del donut** — y de paso su unidad pasó de "% del total" a "tratamientos",
      porque con la vieja el centro leía "100 % del total", cierto y vacío. (f) leyenda de
      cuadrado 10×10 a **píldora 14×3**: la muestra tiene que parecerse al trazo que
      nombra. (g) **44px** en nav/filtros/CTA/tema y **una sola regla de `:focus-visible`**
      sobre todo `a`/`button` del panel, que además cubre lo que se agregue después.
      ⚠️ **Defecto que reveló MIRAR**: el medidor heredaba `width:100%` de `.wf-chart` y se
      iba a 340px de alto; como el grid iguala la fila a la tarjeta más alta, **volvía a
      abrir el aire muerto de A1d** en sus dos vecinas. Acotado a 180px como el donut.
      **Gates**: `typecheck:packages` verde, **214/214** (+9 tests: base plana de la barra,
      radio que no desborda, gauge con 0 que NO dibuja arco, gap que no mueve el reparto,
      total al centro, marcadores ≥4) y **mirado en claro y oscuro** — 0 `[data-reveal]`
      ocultos, 0 errores de consola, y el anillo de foco medido tabulando: 12 de 12 con
      anillo, 0 sin él.
      Anotado, NO tocado (fuera de este ítem): el sparkline del KPI sigue con
      `preserveAspectRatio="none"`, así que su punto final es una elipse — el mismo defecto
      que W2 arregló en el sparkline grande.
- [ ] **W5 · Los estados que no existen.** Skeleton isomorfo, error de sección con
      retry, vacío con altura reservada y segundo renglón que diga CUÁNDO se llena.
- [ ] **W6 · Gates que hoy no existen.** Los tests actuales son `toBeVisible` y
      `count > 0`: **los diez defectos de arriba pasaban todos los gates en verde**.
      Falta screenshot comparado (claro/oscuro × 1440/375), axe sobre el fixture, un
      test que falle si `--color-primary` aparece en un `fill`/`stroke` de dato, y otro
      que falle si un negativo se dibuja con altura 0. + el fixture debe incluir un
      negativo, un cero y una serie de 90 puntos, para que los bugs se vean en el demo.
- [x] **A1c · En dark la marca ya NO desaparece** (2026-08-30). El remedio viejo, ante
      un primary ilegible sobre el fondo oscuro, lo reemplazaba por `DARK_FG`: sidebar,
      botón, KPI hero y barras salían **blancos**. Ahora se **aclara en HSL** conservando
      hue y saturación (`#0d6b5c` → `#139883`), con `DARK_FG` de último recurso solo para
      marcas acromáticas, donde aclarar no produce color. Dos gates, no uno: el color
      tiene que leerse sobre el fondo **y** aguantar su propia tinta encima — parar en el
      primero dejaba el botón sólido en 4,42:1, y **lo encontró el test, no la revisión**.
      4 tests nuevos; los 2 viejos que fijaban el hex `#e7e9ec` se reescribieron contra su
      *intención* (que el par contraste), que es lo que siempre quisieron proteger.
      198/198 verde. Verificado mirando el render en oscuro.
      Nota: `--color-secondary` sigue cayendo a blanco a propósito — da la jerarquía
      primario=marca / secundario=neutro, y se ve bien en el render.
- [x] **A1d · Aire muerto al pie de las tarjetas** (2026-08-30). ⚠️ **Mi diagnóstico
      inicial estaba MAL**: decía "los charts no escalan al ancho". Medido, sí escalan
      (`.wf-chart` ya tenía `width:100%` + `aspect-ratio`; el SVG mide 327px en una
      tarjeta de 365 = exactamente el ancho menos el padding). El defecto real es otro:
      el grid iguala la altura de la fila a la tarjeta más alta (el donut, con leyenda
      de dos líneas) y el chart, con ratio fijo, no crece → **73px muertos al pie** de
      "Ingresos por mes". Arreglado con tarjeta en columna + `margin-block:auto`: el
      sobrante se reparte arriba y abajo en vez de amontonarse. No se estira el SVG
      porque deformaría las etiquetas de los ejes, que son `<text>` del mismo viewBox.
      **Lección: medir antes de arreglar. El primer diagnóstico salió de mirar una
      captura y era plausible pero falso; el número lo desmintió.**
      Pendiente de fondo: que el gráfico CREZCA a llenar la tarjeta necesita viewBox
      dinámico — esperar a ver cómo lo resuelven las referencias antes de inventarlo.
- [x] ~~**A1e · Specs de marca del skill `dataviz`**~~ — **DUPLICADO de W4**, cerrado sin
      trabajo (2026-08-30). Pedía exactamente lo mismo: gap del donut, marcadores ≥8px,
      puntas redondeadas. Se trabaja en W4, que además tiene la evidencia re-verificada.
- [ ] **A2 · Portar técnicas top del catálogo a `packages/blocks`.** De
      `WEB_FACTORY_TECNICAS_2026.md`, las que 2+ sitios usan y son CSS-only o
      motion.dev (feature-en-banda-de-color, statement full-screen, marquee CSS,
      hover-lift). Una por vuelta: bloque tipado + tokens ONIA + reduced-motion +
      render de prueba + `typecheck:packages`.
- [x] **A3 · Sitio #2 (estilo contrastante)** — `apps/ferreteria-sur/`, cerrado 2026-08-31
      (`fac6fa99` + `e4e785f3`). Rubro comercio, industrial utilitario, conectado por
      `/api/lead`. Construido con 3 agentes sobre archivos disjuntos; el de secciones
      murió por límite de sesión y se recuperó con `resumeFromRunId` (los otros dos
      volvieron de caché — solo re-corrió el que falló).
      **Prueba lo que tenía que probar**: al lado de dental-premium no parecen del mismo
      autor. El catálogo de técnicas no estaba atado al warm-premium.
      Verificado mirando: 8 secciones, 0 en `opacity:0`, 0 errores de consola, 0
      menciones de obra, `tsc` 0 y build 4/4.
      Pendientes anotados, no bloqueantes: el CTA del hero entra por 82px a 1440×900 y
      **queda fuera a 1440×800**; First Load 192 kB contra el presupuesto de 150 kB.
- [ ] **A4 · Pulido de dental-premium:** dark mode mirado + spotlight en touch +
      cablear texturas SVG si Sergio dio OK.

## CARRIL B — ANALIZAR (aprender/refill; el cron de análisis lo alimenta)

- [ ] **B1 · Cerrar rubros SIN-ANCLA** (`2026-08-29-critico-limites.md`): cosecha
      dirigida (Scrapling `Fetcher.get(impersonate=chrome)` + seguir CSS/preload)
      de `dental real`, `ganadero/agtech`, `importadora/logística B2B`, `IA`. 2
      sitios por rubro; reescribir su sección del playbook cambiando "SIN ANCLA"
      por dato real.
- [ ] **B2 · Rubros flacos:** wellness quedó N=1; cosechar 2-3 más. Skincare +2.
- [ ] **B3 · Update skill `ui-ux-pro-max`** a v2.13 (`uipro-cli`, MIT) — solo local.

## Regla de alternancia (cómo el loop "siempre trabaja")

- El **cron de tareas (5 min)** hace la próxima de **A**. Si A está todo `[x]` o
  bloqueado, hace la próxima de **B**.
- El **cron de análisis (10 min)** hace salud → analiza el avance → **reordena** y
  **REFILL**: si A quedó corto, agrega la próxima tarea A concreta sacada del
  catálogo (p.ej. "portar técnica T-N"); si B cerró un hueco, agrega el siguiente.
  Nunca deja A y B vacíos a la vez.
- Un hallazgo de B que desbloquea un build entra como tarea A. Un hueco que un
  build A revela entra como tarea B. Los dos carriles se alimentan.

## Bloqueadas (esperan a Sergio)

- [ ] Bloques cifra-editorial · quote-única · features+device (propuesta enviada).
- [ ] Rediseño del dashboard admin real (onia-platform/onia-center = otra lane):
      se propone y coordina, no se toca desde acá.

## Hechas (no rehacer)

- [x] **Catálogo de técnicas de 16 sitios** verificado 2× por el crítico (LISTO,
      cero inventos) + galería de 49 en `gallery-50/` + recetas + "cómo se hacen".
- [x] **Dashboard v1**: marca Onia + sparkline-en-KPI + celda hero (bug del schema
      que descartaba spark/variant, arreglado). Baseline/mejorado en `scratchpad/dash/`.
- [x] **dental-premium**: sitio Next/React animado (motion.dev + GSAP) conectado a
      Onia (`/api/lead`), autosave del form (regla UX 12), dirección salud-premium.
- [x] Estética/beauty anclada (ONSKN) · re-cosecha fuentes por preload · tanda
      health-fitness · barrido 1→15 · reglas UX @agenticmatt.
