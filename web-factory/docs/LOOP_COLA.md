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
   `tsc --noEmit` en `apps/dental-premium` si la tocás) + **mirar renderizado**
   + **`pnpm e2e` si cambiaste UN SOLO PIXEL de lo que se dibuja** (y si el cambio
   de geometría era el objetivo, `--update-snapshots` y **mirar la baseline nueva**
   antes de commitearla: una baseline se refresca MIRÁNDOLA, nunca a ciegas).
   Commit conventional (por qué, en español, sin firma) + push. Marcar `[x]`.

   ⚠️ **`pnpm e2e` se agregó el 2026-09-01, y lo pidió un rojo real.** La regla
   pedía typecheck + unit + mirar, y **A6 cumplió las tres** — midió 22 veces en el
   navegador — y aun así dejó el gate visual **8/8 en rojo**: cambió el alto del
   sparkline del KPI (`height:44px` → `aspect-ratio`) sin regenerar las baselines
   que W6 había commiteado. Nadie lo vio porque `pnpm e2e` no estaba en esta lista.
   Es **exactamente** el modo de falla que W6 documentó ("la suite llevaba roja
   desde W7 y nadie corría `pnpm e2e`"): W6 construyó el gate pero no lo metió en
   la regla, así que el gate volvió a quedar fuera del camino. **Un gate que no
   está en la lista de gates no existe.**
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
- [x] **W5 · Los estados que no existen** (2026-08-31). Evidencia re-verificada antes de
      tocar: `skeleton|retry|aria-busy` → **0 en todo `packages/`** (real), pero el
      **segundo renglón del vacío YA existía** (`renderEmpty(title, hint)` en 5 llamadas,
      todas con su "cuándo se llena") — esa parte del ítem era fantasma y no se rehizo.
      Ahora hay un `estado?: "cargando" | "error"` por sección (chart, tabla, agente,
      notas) en el template **y en el schema Zod**, que si no lo declaraba se lo comía.
      **El skeleton es isomorfo por construcción, no por número copiado**: la caja de
      estado lleva las MISMAS clases que el SVG real (`wf-chart`, `wf-sparkline`), así el
      alto sale del mismo `aspect-ratio` y no hay una segunda constante que se
      desincronice; solo el donut (140px) y el medidor (180px) repiten su tamaño, con
      comentario. El **vacío pasa por la misma caja**: antes colapsaba a la altura de su
      texto y, como el grid iguala la fila a la tarjeta más alta, un solo gráfico sin
      datos reacomodaba a sus dos vecinas (A1d otra vez). **Error por sección, no de
      página**, con `role="alert"` y botón Reintentar de 44px que emite `wf:reintentar`
      (el template es HTML estático: avisa, no inventa un fetch que no tiene).
      **Gates**: `typecheck:packages` verde, **219/219** (+5 tests) y **medido en el
      navegador con un fixture temporal** (3 estados repartidos en la misma fila): las
      tarjetas en cargando/error/vacío miden **254px, exactamente lo mismo que la
      baseline con datos** → cero salto al llegar el dato. 0 `[data-reveal]` ocultos,
      0 errores de consola, claro y oscuro, y el evento de reintento verificado
      disparándolo (`detail.seccion = "Tu asistente"`).
      ⚠️ **Defecto que reveló MIRAR**: el skeleton del medidor era un rectángulo a todo
      el ancho donde el gráfico real es un círculo de 180px — el alto no se movía, pero
      la FORMA prometía otra cosa. Corregido a círculo del tamaño real.
      Anotado, NO tocado: `dashboardPointSchema` no declara `pending`, así que el schema
      lo descarta y el patrón de barra rayada del template es inalcanzable desde el JSON
      (mismo tipo de drift que ya habían tenido `variant`/`spark`). Y `pnpm test` cortó
      una vez con `[vitest-pool]: Timeout terminating forks worker` en `hero.test.ts`
      **sin ninguna aserción fallida**; a la segunda corrida, 219/219 y exit 0.
- [x] **W6 · Gates que hoy no existen** (2026-08-31). Evidencia re-verificada antes de
      tocar: de los cuatro gates que pedia el item, **uno ya existia** — el test del
      negativo con altura 0 lo dejo W3 (`dashboard.test.ts`, "dibuja el negativo BAJO el
      cero"), igual que el de la serie de 90 barras. Fantasma, no se rehizo.
      Lo que se construyo: **(a) fixture permanente `dashboard-edge`** (cliente propio en
      `data/clients/`, generado por `global-setup`) con un negativo, un cero, una serie de
      90 barras, un `sparkline` con datos y las secciones en cargando / error / vacio — el
      demo "lindo" no traia NINGUNO de esos datos, asi que los cuatro bugs de W3 no eran
      visibles en ningun gate. **(b) gate visual** (`tests/e2e/visual.spec.ts`) sobre demo
      + fixture, claro/oscuro x 1440/375, 8 baselines commiteadas. **(c) axe** sobre el
      fixture, que ejercita `role="alert"`, `aria-busy` y el boton Reintentar. **(d) gate
      de color** (`--color-primary` nunca pinta un dato) por los DOS caminos: el atributo
      `fill`/`stroke` y el `color:` de la hoja que alimenta un `currentColor` — que es por
      donde de hecho entraba.
      **Cada gate se verifico MUTANDO el codigo**, no solo viendolo pasar: el de color cae
      con `--wf-series-1` → `--color-primary` en el atributo Y en el CSS; el visual cae 8/8
      con `PAD_L` 34 → 44. La primera version del visual usaba `maxDiffPixelRatio: 0.002`
      y **la mutacion pasaba en verde**: sobre una captura fullPage el presupuesto eran
      ~4.900 pixeles, suficiente para tragarse un marcador que duplica el radio. Cambiado a
      `maxDiffPixels: 400` (absoluto) y verificado estable en dos corridas limpias.
      ⚠️ **Lo que el gate encontro apenas existio** — la suite E2E estaba **ROJA desde W7**
      y nadie lo sabia porque nadie corria `pnpm e2e`:
      1. **Dos de las tres fuentes de W7 nunca cargaban.** `font-links.ts` pedia
         `wght@300..900` para toda familia; Bricolage Grotesque llega a 800 y Spline Sans
         Mono a 700, y css2 responde **HTTP 400** al eje fuera de rango (verificado con
         `curl`, no de memoria). El titular y las cifras del panel salian en la fuente del
         sistema: **el bug de W1 reintroducido por la ruta del rango**. Ahora hay rango real
         por familia, medido; familia desconocida va sin eje (200 seguro, se degrada el peso
         y no la familia entera). + `font-links.test.ts`.
      2. **Contraste que reprobaba AA**, invisible a ojo y real: la pildora de delta
         negativo en claro (4,33:1) y los tres textos secundarios de la card de marca en
         oscuro (4,09 y 4,42). El par PURO on-primary/primary si pasaba — su test lo
         protegia — pero la hoja lo diluye con `color-mix` y ahi se rompe. Recalculado.
      3. **La marca en oscuro se medía contra el fondo, no contra la tarjeta.** Casi todo
         el texto de color vive DENTRO de una card, que es mas clara: `wf-path-cta` de
         realestate daba 4,47:1. `packages/tokens` ahora gatea contra `--card`; + test que
         cae si se vuelve a medir contra el fondo.
      4. **Dos aserciones congeladas**: el h1 fijaba `"Panel operativo"` (W7 lo renombro) y
         se contaban `rect` de barras (W4 las paso a `path`). Un gate que falla por drift
         entrena a ignorar el rojo.
      **Gates**: `typecheck:packages` verde, **232/232** unit (+13) y **`pnpm e2e` 101
      passed / 0 failed** (antes: 3 rojos en limpio, mas los que tapaba el fail-fast).
      Mirado en claro y oscuro, 1440 y 375.
      Anotado, NO tocado (ver A5/A6).

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
- [x] **A2 · Portar técnicas top del catálogo a `packages/blocks`.** De
      `WEB_FACTORY_TECNICAS_2026.md`, las que 2+ sitios usan y son CSS-only o
      motion.dev. Una por vuelta: bloque tipado + tokens ONIA + reduced-motion +
      render de prueba + `typecheck:packages`. **4 de 4 cerradas** (una de ellas,
      T34, era fantasma y se cerró sin trabajo):
      - [x] **T29 marquee** (2026-08-31) — `packages/blocks/src/marquee.ts`, la que el
            catálogo llama "la más barata y más reutilizable del corpus" (6 sitios) y
            estaba en cero (`grep marquee packages/` → 0). CSS puro, cero JS.
            **La decisión que hace o rompe la técnica: la separación es `padding` del
            ítem, NO `gap` del track.** Con `gap` el track mide `2S+(2n-1)g` y
            `translateX(-50%)` cae medio gap corrido — el salto que la técnica existe
            para evitar. Verificado midiendo en el navegador, no razonándolo:
            desfase de costura **0,000 px** en claro y oscuro; y **mutado a `gap`
            para probar que la medición sirve** → salta a **94,2 px**. Frena en
            `:hover` **y en `:focus-within`** (WCAG 2.2.2: con hover solo, quien
            navega con teclado no puede pararla); bajo `prefers-reduced-motion`
            queda quieta y el contenedor pasa a scroll manual (verificado:
            `animation:none`, `overflow-x:auto`, contenido alcanzable). La copia va
            `aria-hidden` para que un lector de pantalla no lea dos veces.
            +9 tests, entrada en la galería (`pnpm blocks:demo`), 241/241.
      - [x] ~~**T34 hover-lift**~~ — **FANTASMA, cerrada sin trabajo.** Ya existe como
            primitiva del toolkit: `.wf-hover-lift` en `packages/blocks/src/motion.ts:53`
            (+ su neutralización bajo reduced-motion en :77 y su ficha en :157).
            Lo que SÍ falta y no es esto: **ningún bloque la usa** (`grep wf-hover-lift`
            solo devuelve motion.ts) — cablearla a las cards es otra tarea, anotada.
      - [x] **T4 feature-en-banda-de-color** (2026-08-31) — `packages/blocks/src/feature-bands.ts`.
            Evidencia re-verificada antes de tocar: `grep banda packages/` solo devuelve
            comentarios y una banda hardcodeada del template `clinic-css`; bloque, cero.
            **La banda es un tinte del token de marca, no un hex de paleta**: el catálogo
            nombra pollen/sky/meadow porque describe UN sitio, y acá el bloque lo usan 11
            fichas de cliente — cada tono sale de `color-mix()` sobre
            `--color-primary/accent/secondary`, así que se recalcula solo en oscuro por la
            sustitución perezosa de `var()`. Un hex quemado sería el bug de W1 otra vez.
            **El zigzag lo hace `order`, no el DOM**: el orden de lectura es siempre texto →
            imagen (medido: `domTextAntes` true en las dos bandas) y solo las pares invierten
            el lado visual (banda 0 texto en 35 / media en 618; banda 1 al revés). Alternar en
            el HTML daba el mismo dibujo y rompía la lectura.
            **Contraste medido, no estimado** (convertí el `oklab()` resuelto a sRGB): texto
            sobre banda 12,9 / 13,8 en claro y 13,8 / 13,5 en oscuro; la banda `solido`, la
            única que pinta la marca a pleno, cambia el PAR completo a `--color-on-primary` y
            da 9,03 en claro y 4,74 en oscuro — cambiar solo el fondo es como se fabrica un
            botón invisible. Full-bleed verificado midiendo: 1178px de ancho en un viewport
            de 1178, left 0.
            ⚠️ **Defecto que reveló MIRAR**: el marco de la galería capea a 1200px
            (`demo.ts:171`, por los bloques scroll-driven) y mi muestra de 3 bandas medía
            1385 → **la tercera salía cortada y la galería mentía**. Muestra bajada a las 2
            que prueban el zigzag (1077 = 1077, nada oculto); la solida y la sin-media quedan
            en los tests y en la nota. De paso, las rutas de imagen iban sin `./assets/` y
            daban 2 `ERR_FILE_NOT_FOUND` en consola.
            **Gates**: `typecheck:packages` verde, **252/252** (+11 tests), galería mirada en
            claro y oscuro — 0 `[data-reveal]` ocultos, 0 errores de consola.
      - [x] **T9 statement pantalla-completa** (2026-08-31). Evidencia re-verificada antes
            de tocar: `grep 100svh|100dvh|100vh packages/blocks/` no devolvía nada en
            `editorial-statement.ts` (solo scroll-story-hero y el switcher). **Decidido:
            VARIANTE, no bloque aparte** — T9 comparte con el bloque que ya existe el
            label, la medida, la escala display, el acento y el reveal; lo único que
            cambia es el marco. Duplicar 120 líneas para eso era fabricar dos fuentes de
            la misma frase. `pantalla` + `fondo` (`base`/`marca`/`tinta`) + `cta`.
            **El fondo pintado va SIEMPRE full-bleed** (medido: 1440px en un viewport de
            1440, left 0, dentro de un contenedor de 1120 a propósito): un color que se
            corta en la medida lee como tarjeta, no como sección. La variante `tinta`
            cambia el PAR completo a `on-primary`, botón incluido — cambiar solo el fondo
            es como se fabrica un botón invisible.
            **"Reveal por líneas" son las líneas que DECLARA el autor** con un salto de
            línea, en cascada con `wf-stagger`; nunca los puntos de corte, que se mueven
            con el viewport y no se pueden escalonar sin embarcar un partidor de texto.
            ⚠️ **Dos defectos que solo aparecieron MIDIENDO, ninguno se ve en el código**:
            (a) `min-height:100svh` sobre una caja `content-box` **sumaba el padding**: la
            sección medía **1080px en un viewport de 900** y la "pantalla completa"
            scrolleaba. `box-sizing:border-box` propio — no puede depender de que la página
            que la usa traiga un reset. (b) el label de la variante sólida daba **4,17:1 en
            claro y 3,39:1 en oscuro**: el par puro pasa (6,41/4,94) pero el `color-mix` al
            72% lo diluía bajo AA — el mismo modo de falla que encontró W6. Sin diluir.
            ⚠️ Y un defecto de MI medición: conté líneas visuales con `getClientRects()`,
            que sobre un `span` display:block devuelve **un solo rect aunque el texto
            envuelva** — decía "1/1" mientras la captura mostraba la línea partida en dos.
            Contado por alto/line-height, con 15ch la línea declarada se partía; la variante
            de pantalla ensancha a 24ch y ahí sí se sostiene.
            **Gates**: `typecheck:packages` verde, **260/260** (+8 tests), `pnpm e2e` **101
            passed / 0 failed**, y **medido en el navegador** (claro y oscuro, 1440 y 375)
            con un fixture temporal de las 3 variantes: alto = viewport exacto (900/812),
            full-bleed sin desborde horizontal (`scrollWidth == clientWidth` en ambos
            anchos), contraste ≥4,5:1 en las 12 combinaciones (convertido a sRGB real
            pintando en canvas: leer el `oklab()` con una regex de números da basura),
            CTA de 68px con anillo de foco, 0 reveals ocultos y 0 errores de consola.
            Cableado al schema (`statementPantalla`/`statementFondo`/`statementCta`) y a
            `landing-realestate`: lo que el schema no nombra, lo descarta — el drift que ya
            se comió `variant`, `spark` y `pending`. + entrada propia en la galería.
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
- [x] **A5 · La barra lateral no llega al pie — FANTASMA** (2026-08-31). La evidencia
      se re-verificó antes de tocar nada y no sobrevivió: **el defecto no existe**. En el
      navegador el sidebar tapa la ventana entera en todo el scroll — medido a 0%, 50% y
      100% en `dashboard-demo` y `dashboard-edge`, claro y oscuro: `top: 0`, `bottom: 900`
      de 900 en las 12 mediciones (al tope del scroll se suelta 0,23px por el sobrante
      fraccionario, no por el CSS). El `height: 100vh` + `position: sticky` hacen
      exactamente lo que tienen que hacer.
      **El artefacto era la captura**: `fullPage` pinta lo `sticky` en su posición
      ESTÁTICA, así que el bloque oscuro corta al primer viewport y debajo se ve fondo de
      página. Es el mismo modo de falla que ya anotó W7 (la captura sin scrollear dejando
      el 4º chart en `opacity: 0`) — segunda vez que la captura inventa un defecto.
      **Lo que sí era real es el hueco de gate** que lo dejó pasar por defecto: la
      baseline `fullPage` **se ve igual con el sticky puesto que con el sticky roto**, o
      sea que una regresión de verdad ahí pasaba en verde. Cerrado con un test que MIDE en
      el navegador (`dashboard.spec.ts`, "el sidebar cubre la ventana tambien al pie") en
      los tres puntos de scroll, y con el artefacto documentado en el docblock de
      `visual.spec.ts` para que no se abra una tercera vez.
      **Gates**: `typecheck:packages` verde, `dashboard.spec.ts` **8/8** (chromium +
      mobile) y **el test verificado que FALLA**: forzando `position: static` el sidebar
      se va a `top: -946` y la aserción cae. Un gate que no puede ponerse rojo no es un
      gate.
      **Lección: una captura no es el navegador.** Antes de abrir un defecto que sale de
      una imagen, medirlo en vivo.
- [x] **A6 · El sparkline del KPI deformado + `pending` inalcanzable** (2026-08-31).
      Evidencia re-verificada antes de tocar: los dos reales (`preserveAspectRatio="none"`
      seguia en `dashboard.ts:998`, y `pending` estaba en el TIPO y en el template pero no
      en el schema). (a) El KPI spark pasa a `xMidYMid meet` — el mismo arreglo que W2 le
      hizo al sparkline grande y que aca habia quedado a medias. Solo cambiar el atributo
      NO alcanzaba: con `height: 44px` fijo la caja se ensancha mas que 320/44 y `meet`
      habria dejado aire a los costados, asi que el alto fijo se cambio por
      `aspect-ratio: 320/44` (mismo recurso que ya usaba `.wf-sparkline`). (b)
      `dashboardPointSchema` ahora declara `pending: z.boolean().optional()`; verificado el
      camino COMPLETO JSON → Zod → template, no solo el parse: la barra sale con trama
      rayada y `<title>` "(pendiente)".
      **Gates**: `typecheck:packages` verde, **265/265** (+5 tests) y **medido en el
      navegador**, 22 mediciones en `dashboard-demo` y `dashboard-edge` × claro/oscuro ×
      1440/390: escala X == escala Y en las 22 (antes el eje X se estiraba solo), el punto
      final da ancho/alto **1.000** (era elipse), la caja no letterboxea (268,5/320 =
      36,9/44 = 0,839 exacto) y las 4 tarjetas de la fila siguen midiendo 177,5px iguales.
      0 `[data-reveal]` ocultos, 0 errores de consola. **Los tests se verificaron en rojo**:
      revirtiendo el atributo caen 2 de 3.
      ⚠️ **Trampa de metodo, no del producto**: `pnpm generate dashboard-demo` sin
      `--template dashboard` reconstruye ese slug como **landing** y pisa el `out/` que
      sirve el panel (el default del generador es `landing`). Si el panel "perdio" sus KPI,
      es esto. Siempre `pnpm generate <slug> --template dashboard`.
      Anotado, NO tocado (fuera de este item): el punto final del KPI spark sigue en `r=3`
      y, con la escala de 0,839, mide **5,03px** renderizados — bajo el piso de 8px que
      `dataviz` fijo y que W4 aplico al resto de los marcadores. Es un tamanio, no una
      deformacion.
- [x] **A4 · Pulido de dental-premium** (2026-08-31). Re-verificada la evidencia antes de
      tocar, **dos de los tres sub-items eran fantasma** y hubo que buscar el defecto real
      midiendo, no leyendo la linea. (a) **"dark mode mirado"**: se miro, y no hay nada que
      mirar — el sitio es light-only y renderiza **identico** con el SO en oscuro (el
      recorte del formulario da el **mismo md5** en claro y en oscuro; la pagina entera
      solo difiere por el grano del degradado del hero). Lo que si era real es la
      **omision**: `color-scheme` medido en `normal`, o sea que el diseño claro estaba bien
      **por accidente del default del UA**, no por declararse. Ahora `color-scheme: light`
      en `:root`, que ata scrollbar, popup del `<select>`, autofill y corrector a esta
      paleta. (b) **"spotlight en touch": no existe ningun spotlight** — `spotlight|
      mousemove|pointermove` da **0** en toda la app. Y la sospecha derivada (hover pegado
      en touch: 3 reglas `:hover` sin un solo `@media (hover: hover)`) **tampoco se
      reproduce**: tapeando la tarjeta en emulacion tactil el transform queda en `none`,
      nunca se aplica el hover. No se toco: no se arregla lo que no falla. (c) texturas SVG
      → **bloqueado**, no hay OK de Sergio en ningun lado (avisado por PushNotification).
      **El defecto real lo encontro medir el DOM entero, no la cola**: el enlace a WhatsApp
      del footer media **28,2px** de alto — bajo el piso tactil de 44px que W4 fijo para el
      dashboard, y es **la conversion entera del sitio**. Corregido con `min-height: 44px`
      + `inline-flex`, y el subrayado pasado de `border-bottom` a `text-decoration` para
      que se pegue a las letras en vez de al borde de la caja de 44px.
      ⚠️ **Medir, no estimar (otra vez)**: calcule `padding-block: 8px` "= 44,2px" y el
      navegador devolvio **43,2** — los 28,2 originales incluian el 1px de borde que yo
      mismo estaba sacando. Por eso el alto sale de `min-height` y no de un padding
      calculado: no hay que re-ajustarlo si cambia la tipografia.
      ⚠️ **Falso positivo que casi arreglo**: el circulo negro con una "N" en el borde
      izquierdo de las capturas es el **badge de devtools de Next**, no un elemento que se
      desborda. El unico desborde real (`.hero-media`, -28,8px) es el overscan a proposito
      del parallax. Y el unico control "sin anillo de foco" de la primera pasada era el
      `<input type="hidden">` que mi selector agarraba de mas: los 15 controles reales ya
      tenian anillo.
      **Gates**: `tsc --noEmit` verde en `apps/dental-premium` y **medido en el navegador**
      en las 4 combinaciones (claro/oscuro x 1440/390): `colorScheme` resuelve `light` en
      las 4, el enlace da **44,0px** exactos en las 4, la lista de controles bajo 44px
      queda **vacia** (antes tenia 1) y 0 errores de consola. Footer **mirado**: el
      subrayado honey sigue pegado al texto y la caja de 44px es invisible.

- [ ] **A7 · Cablear `wf-hover-lift` a las cards que lo piden** — recuperada de la
      prosa de T34, donde llevaba un día declarada *"anotada"* sin serlo (ver AUD3).
      **Evidencia medida hoy (2026-09-01), no heredada**: `grep -rln wf-hover-lift
      packages/*/src/` fuera de `motion.ts` devuelve **0 de 44 bloques**. La primitiva
      existe entera y probada (`motion.ts:53`, neutralizada bajo reduced-motion en `:77`,
      ficha en `:157`) y **solo la usa su propio demo** (`motion-demo.html`) y `MOTION.md`.
      O sea: hay una técnica del toolkit pagada y en cero uso real.
      Candidato directo y único hoy: `packages/blocks/src/clinic-services.ts`, el otro
      bloque del paquete que dibuja `card`. Al tomarla: cablear, mirar el render en claro
      y oscuro, confirmar que bajo `prefers-reduced-motion` no se mueve, y `pnpm e2e`
      (toca superficie dibujada → si cambia geometría, `--update-snapshots` y **mirar la
      baseline nueva**).

- [x] **AUD1 · Auditoría de los `[x]` + salud — el gate visual estaba 8/8 en ROJO**
      (2026-09-01). Vuelta de escalón 2: A y B estaban todos `[x]`, así que tocaba
      auditar lo tachado y correr la salud. **Salud**: server 4319 → 200, rama igual a
      `origin` (`415a6f8c`), árbol limpio, `typecheck:packages` verde, `pnpm test`
      **265/265** — el número que declaraba A6, exacto. Cero zombies de tests: los 9
      `node.exe` vivos son los loops, el `serve-out 4319` y un `next dev` del worktree
      `inventario-muerto` (otra mano, no se toca).
      **Lo que la auditoría encontró**: `pnpm e2e` **fallaba 8/8** en `visual.spec.ts`,
      los ocho baselines del panel. Ningún `[x]` mentía — los reclamos de A6, W3-W6, T29,
      T4 y T9 se re-verificaron contra el código de hoy y **todos siguen ciertos**
      (`preserveAspectRatio="none"` = 0 en `dashboard.ts`, `pending` declarado en
      `dashboardPointSchema`, `r="2.5"` = 0, radial/estados/chartScale presentes,
      `marquee.ts`/`feature-bands.ts`/variante pantalla en su lugar). Lo que faltaba era
      un **gate no corrido**.
      **Diagnosticado midiendo, no mirando la captura** (que es cómo A5 se abrió como
      fantasma): (a) `git log` desde el commit que trajo las baselines (`353b0c21`, W6) →
      **un solo commit toca el render**, `24f5cbea` (A6); B1/B2 son playbook y T9/T4/T29
      son `blocks`, no el panel. (b) diff fila por fila baseline↔actual: la página **mide
      7px menos** y la primera fila distinta es **y=240**, la fila de KPIs. (c) barrido de
      desplazamiento por bandas de 100px: **todas las bandas de y=300 para abajo calzan
      exactas con un corrimiento de 7px** (0-24 px de residuo, antialiasing), y la única
      banda con cambio real es **y=200-299**. O sea: el contenido no cambió, se corrió —
      y se corrió por donde A6 dijo que iba a correrse.
      **Veredicto: las baselines estaban viejas, el código no roto.** Regeneradas las 8,
      **miradas** en claro y oscuro (demo y `dashboard-edge`) antes de commitearlas: el
      panel completo, el negativo colgando bajo el cero, las 90 barras dentro del viewBox,
      el gauge en 0% sin arco, skeleton/error/vacío y el eje cerrando en 350. `pnpm e2e`
      **103 passed / 0 failed**.
      **La causa raíz NO es A6: es la regla 4**, que pedía typecheck + unit + mirar y no
      `pnpm e2e`. A6 cumplió las tres y midió 22 veces en el navegador. Arreglado ahí
      arriba, que es donde lo lee la próxima vuelta — parchear solo esta corrida dejaba el
      agujero abierto para el siguiente cambio de geometría.
      **Lección: W6 construyó el gate pero no lo metió en la lista de gates, y por eso el
      gate volvió a quedar fuera del camino en 2 vueltas.** Construir el gate es la mitad;
      la otra mitad es que sea imposible saltearlo.
      ⚠️ **Fuera de zona, para quien corresponda**: el chequeo de arranque de los loops
      manda comparar `list_scheduled_tasks` contra `hermes-content/docs/cola/loops.md` y
      **ese archivo no existe** (la carpeta solo tiene `contenido.md`). Hoy no hizo daño —
      los 5 loops activos están registrados y `enabled: true` — pero el chequeo no puede
      comparar contra nada, así que hoy no es una red: es un `ls`. Es `hermes-content/`,
      zona prohibida de este carril.

- [x] **AUD2 · Auditoría de los `[x]` que AUD1 no tocó + salud** (2026-09-01). Segunda
      vuelta de escalón 2 (A y B siguen todos `[x]`). **Salud**: server 4319 daba **000**
      → relanzado `serve-out.mjs 4319`, **200** verificado; rama == `origin`
      (`5a3e8dc0`); árbol limpio; `typecheck:packages` verde; `pnpm test` **265/265**;
      **`pnpm e2e` 103 passed / 0 failed** — las baselines que AUD1 regeneró aguantan,
      el gate ya está adentro de la regla 4 y ya se corre. Dos `node.exe` vivos (el
      server recién lanzado y otro loop): cero zombies.
      **Auditados los 9 `[x]` que AUD1 dejó afuera** (cubrió A6, W3-W6, T4/T9/T29).
      Ninguno miente; los nueve siguen ciertos contra el código de HOY:
      **A1a** `SERIES_THEME` en `packages/templates/src/dashboard.ts:648` con el orden
      exacto que declara (aqua→blue→orange→violet→yellow→magenta) y pares light/dark
      propios, emitidos como `--wf-series-N` por `seriesVars()`, no hex en el SVG ·
      **W1a** `packages/templates/src/font-links.ts` existe compartido y lo importan
      `dashboard.ts` y `landing-clinic.ts` · **W1b** `--card` es
      `color-mix(in oklab, var(--color-fg) 3%, var(--color-bg))` (`tokens/src/index.ts:42`),
      el 3% literal · **W1c** 5 usos de `tabular-nums` en `dashboard.ts` · **W2** toda la
      tinta de dato (barras :752, sparkline :870, spark de KPI :960/:970) es
      `--wf-series-1`; los 11 `--color-primary` que quedan son cromo (botón, sidebar,
      badge) · **W7** `DASHBOARD_MONO = "Spline Sans Mono"` y el par display/body
      Bricolage Grotesque + DM Sans entra por `tipografia` del cliente
      (`dashboard.test.ts:76`), que es lo correcto: el template no quema la marca.
      Las secciones agente (:240) y notas (:332) existen · **A1c**
      `lightenUntilLegible()` en `tokens/src/index.ts:116` y `DARK_FG` sólo de último
      recurso para acromáticas · **A1d** `margin-block: auto` en `dashboard.ts:1719`
      y `:1997` · **A4** `color-scheme: light` en `dental-premium/src/app/globals.css:9`,
      `min-height: 44px` en `site.css`, y `spotlight|mousemove|pointermove` = **0**
      ocurrencias · **B1/B2** el playbook tiene §9 (ganadero) y §10 (IA), el umbral
      dental dice **HSV <25%** con el modelo declarado, y las dos cosechas están en
      `data/references/design-sources/2026-08-31-cosecha-rubros-{sin-ancla,flacos}.md`.
      No auditable acá: **B3**, que se declara *solo local* (la skill vive fuera del repo).
      ⚠️ **Corrección a la nota de AUD1**: `hermes-content/docs/cola/loops.md` **SÍ
      existe** — commit `f7496282` del 2026-08-31 23:36, presente en **`origin/main`**.
      AUD1 lo midió con un `ls` dentro de este worktree, cuya rama arranca en `415a6f8c`
      y es **anterior** al commit; el `main` local también está atrasado. O sea: el
      chequeo de arranque **sí es una red**, y hoy comparó de verdad (5 activos
      registrados y `enabled: true`; `web-factory-salud` y `cerrar-y-revisar-web-factory`
      siguen apagados a propósito y se dejan así). **Lección: "el archivo no existe"
      medido desde un worktree viejo es una rama vieja, no un archivo faltante — se
      verifica contra `origin/main`, no contra el árbol propio.**

- [x] **AUD3 · Auditoría de A2/A3/A5 — los únicos `[x]` que nadie había mirado, y tres
      pendientes que se habían perdido** (2026-09-01). Tercera vuelta de escalón 2 (A y B
      siguen todos `[x]`). **Salud, los cuatro puntos, corridos**: server 4319 → **200**
      (no hizo falta relanzarlo); rama == `origin` (`7e5b486a`); árbol limpio;
      `typecheck:packages` verde; `pnpm test` **265/265**; `pnpm e2e` **103 passed / 0
      failed** (7 skipped) — el gate visual aguanta por segunda vuelta seguida; dos
      `node.exe` vivos, los dos arrancados hoy (14:27 y 14:50: el server y otro loop),
      **cero zombies**.
      **El hueco de la auditoría**: cruzando los IDs tachados contra lo que AUD1 y AUD2
      dicen haber cubierto, **A2, A3 y A5 no estaban en ninguna de las dos listas**. AUD1
      cubrió A6/W3-W6/T4/T9/T29 y AUD2 los otros nueve; AUD2 se declaró completa ("los 9
      que AUD1 dejó afuera") sin notar que la resta no cerraba. Auditados ahora:
      **A5** cierto — el test que MIDE existe con el nombre exacto que declara
      (`tests/e2e/dashboard.spec.ts:56`) y el artefacto del `fullPage` está documentado en
      el docblock de `tests/e2e/visual.spec.ts:23` · **A3** cierto — `apps/ferreteria-sur/`
      existe con su `src/app/` completo (`page.tsx`, `sections.css`, `site.css`, `api/`) ·
      **A2** cierto en lo sustantivo: las 4 sub-técnicas están donde dice, y de T34 se
      verificaron las tres referencias una por una — `motion.ts:53`, `:77` y `:157`, las
      tres exactas.
      ⚠️ **Un dato de T34 envejeció**: decía *"`grep wf-hover-lift` solo devuelve
      motion.ts"*, y hoy también devuelve `motion-demo.html` y `MOTION.md`. La conclusión
      no cambia (ninguno es un bloque) pero el número que la sostenía sí: por eso A7 entra
      con el grep **acotado a `packages/*/src/`**, que es el que mide lo que la frase
      quiere decir.
      🔴 **El hallazgo que vale**: **tres pendientes reales estaban declarados "anotados"
      dentro de la prosa de ítems ya cerrados, y nunca fueron línea de cola de nadie** —
      el cableado de `wf-hover-lift` (T34, *"otra tarea, anotada"*) y los dos de A3
      (*"pendientes anotados, no bloqueantes"*: el CTA del hero fuera de pantalla a
      1440×800 y First Load 192 kB contra un presupuesto de 150 kB). `grep hover-lift
      docs/LOOP_COLA.md` devuelve **sólo la frase que dice que está anotada**. Es el modo
      de falla espejo del trabajo fantasma que esta cola persigue: no es trabajo inventado
      que no existe, es **trabajo real que existe y se evaporó al escribirlo dentro de un
      `[x]`**. Un ítem tachado se deja de leer — ahí adentro, un pendiente está enterrado,
      no anotado. El de hover-lift, re-medido hoy, entra a A como **A7**; los dos de A3
      cargan evidencia del 31-ago sin re-verificar, así que van a **Sin verificar**, que
      es donde la REGLA DE EVIDENCIA los manda y que hasta hoy se nombraba sin existir.
      **Regla nueva: un pendiente que aparece mientras cerrás un ítem se escribe como
      línea de cola en el mismo commit que lo tacha.** "Anotado" dentro de un `[x]` no es
      anotado.
      **Gates**: ítem 100% de `docs/` (no toca `packages/` ni superficie renderizada);
      aun así se corrieron los cuatro de la regla 4 y están todos verdes, arriba.

## CARRIL B — ANALIZAR (aprender/refill; el cron de análisis lo alimenta)

- [x] **B1 · Cerrar rubros SIN-ANCLA** (2026-08-31). Evidencia re-verificada antes de
      tocar (`2026-08-29-critico-limites.md:42` seguía vivo): los 4 rubros se recetaban
      por analogía. Cosechados **8 sitios vivos, 2 por rubro**, con Scrapling
      `impersonate=chrome` + **siguiendo el `<link rel=stylesheet>`** para leer los
      **tokens de marca** (`--c-navy`, `--colours--bg-subtle`, `--color-scheme-1--peach`),
      que es lo que separa marca de ruido — la frecuencia de hex sola miente.
      Dental real: **dntlbar** + **smilebar** · Ganadero: **halterhq** + **agriwebb** ·
      Importadora: **flexport** + **zencargo** · IA: **sierra.ai** + **decagon.ai**.
      Reescritas §1 y §7 del playbook y **agregadas §9 (ganadero) y §10 (IA/agentes)**;
      evidencia con cifras en `data/references/design-sources/2026-08-31-cosecha-rubros-sin-ancla.md`.
      **Dos reglas escritas estaban MAL y lo dijo el dato, no la lectura**: (a) el acento
      dental pedía "sat <15%" y los dos acentos reales miden **HSV 23,9%** y **18,5%** —
      el umbral era el piso de la muestra vendido como ley, y encima sin declarar el
      modelo (los mismos hexes dan 52% y 79% en **HSL**, que hace descartar el color
      correcto). Ahora **HSV <25%** y el modelo escrito. (b) La importadora se recetaba
      "negro `#010101`, **1** acento" heredado de scoutmotors (automotor): las dos
      importadoras reales son **navy** (`#052439`, `#080E49`) con **dos** acentos.
      Hallazgos: el ganadero NO es verde brillante sobre blanco sino **tinta verde bosque
      sobre hueso cálido** (y anima: halter trae GSAP ×23); el rubro IA **evita la rampa
      azul** en los dos líderes, igual que Onia. `PP Fragment` reapareció en decagon.ai:
      segunda muestra, y confirma que es del bucket **SaaS/IA, no dental** — cierra el
      hallazgo #1 del crítico. Nuevo ruido de scraper documentado: **`#4285F4` = azul
      del badge de Google Reviews** (parecía el primario de smilebar; es un `<circle>` de
      su SVG). ⚠️ **Un 200 no es un ancla**: tend.com dio 403 y dentologie.com dio 200
      con **6.192 bytes** de shell JS — descartados, no se computa nada de ahí.
      **Gates**: `typecheck:packages` verde (ítem 100% de docs/data: no toca `packages/`
      ni superficie renderizada). Sigue sin ancla y queda para B: **portfolio (N=1)**.
- [x] **B2 · Rubros flacos** (2026-08-31). Evidencia re-verificada antes de tocar: la
      línea *"N=1 real todavía"* seguía viva en `2026-08-29-vertical-playbooks.md:67` y
      §2 seguía sin segunda ancla. Cosechados **5 sitios vivos** con el método de B1
      (Scrapling `impersonate=chrome` + seguir el `<link rel=stylesheet>`, hexes por
      **token declarado** y saturación en **HSV**): wellness → **othership.us** +
      **remedyplace.com**; estética → **alchemy43.com** + **skinlaundry.com** (clínicas)
      y **us.typology.com** (producto DTC). Evidencia con cifras en
      `data/references/design-sources/2026-08-31-cosecha-rubros-flacos.md`; §2 del
      playbook reescrita entera.
      **Las DOS reglas centrales de §2 estaban mal y lo dijo el dato, no la lectura:**
      (a) *"sin pop (sat 5-15%)"* — othership declara `--os-lime: #dbf572` en **HSV S
      53,5%** (y `--os-plum #372338` como dominante, 116 usos): más del triple del techo
      escrito. Era el piso de la muestra vendido como ley, el MISMO error que el `<15%`
      dental de B1. Wellness pasa a **dos regímenes** (sin pop / crema+tinta+un pop).
      (b) *"estética/skincare = nude cálido + blush"* — le recetaba a la **clínica** la
      paleta del **producto DTC**, y Onia vende la clínica (esteticagest). Las dos
      clínicas reales van al revés: tinta oscura + UN acento saturado (alchemy43 oro
      `#e5ad5a` S 60,7% sobre `#12181f`; skinlaundry lima `#cdf765` S 59,1% sobre
      `#1a1312`). El nude SÍ se confirma — en DTC: typology (`#f6e7d8`/`#f1d7c3`/
      `#e8c4a8`) coincide con ONSKN, N=2.
      Hallazgos: **alchemy43 corre display serif + grotesca de cuerpo** (`freight-neo-pro`
      en `h1..h6` + `work-sans`), o sea el par de Onia en una clínica real que factura; y
      **remedyplace corre una sola familia** (Beausite Slick/Classic) — segundo caso real
      del mono-sans prohibido, así que esa prohibición se cita como decisión de Onia y no
      como observación del mercado. **Ruido de scraper nuevo**: en remedyplace y typology
      los hexes MÁS frecuentes son defaults de Tailwind (`--tw-ring-color #2563eb`,
      escala `--tw-prose-*`) y en glowbar de Shopify Polaris (`--color-critical`,
      `--color-success`, `--color-reviews`) — leído por frecuencia, remedyplace parecería
      una marca azul. Regla: **descartar por NOMBRE del token, no por frecuencia**.
      ⚠️ **Un 200 con h1 tampoco es un ancla**: ever-body.com sirve 31.834 bytes con h1
      "We’re getting things ready" (holding); peachystudios.com da 200 con **136 bytes**;
      heydayskincare.com sirve 681 KB pero su color dominante sale de tokens de sección
      de Shopify. Los tres descartados.
      **Gates**: `typecheck:packages` verde (ítem 100% docs/data: no toca `packages/` ni
      superficie renderizada). Sigue sin ancla y queda para B: **portfolio (N=1)**.
- [x] **B3 · Update skill `ui-ux-pro-max`** (2026-08-31, **solo local**, nada del repo).
      Evidencia re-verificada antes de tocar, y el defecto era peor que "está vieja": la
      skill instalada era **SKILL.md y nada más** (11.569 bytes, sin `scripts/` ni `data/`),
      mientras su propio cuerpo manda correr `python3 skills/ui-ux-pro-max/scripts/search.py`
      en el **paso 2, marcado REQUIRED**. O sea: los cuatro pasos del workflow apuntaban a un
      script inexistente — la skill se citaba en `onia-web-factory/SKILL.md:133` y en
      `DESIGN_LEARNED_2026.md` como fuente de gates numéricos, pero **no se podía ejecutar**.
      **El número de la cola también estaba viejo**: el ítem pedía v2.13 y upstream ya va por
      **v2.15.0** (`nextlevelbuilder/ui-ux-pro-max-skill`, licencia MIT verificada por API, no
      de memoria). Instalado con el installer oficial (`npx ui-ux-pro-max-cli@latest init --ai
      claude --global --force`) corrido **desde el scratchpad**, para que no escriba un
      `.claude/` dentro del worktree: escribe en `~/.claude/skills/`, fuera del repo.
      Ahora la skill trae `scripts/` (search, design_system, reasoning_contract, validate_data
      + tests) y `data/` (13 CSV, 3.061 filas): 89 estilos, 193 paletas/reasoning, 75 pares
      tipográficos, 120 guías UX, 106 iconos, 26 charts, 22 stacks. Lo que sirve a ESTE carril:
      dominio **`gsap`** (`motion.csv`) y `--json`, que hace la skill usable como **gate
      programable** y no solo como lectura.
      **Verificado ejecutándola, no mirando el `ls`**: `search.py "dental clinic premium"
      --design-system` devuelve sistema completo (paleta con `--color-*`, tipografía, patrón)
      en Python 3.12.10.
      ⚠️ **Efecto lateral medido, no supuesto**: el installer trae el **bundle entero** de 7
      skills y refrescó también `banner-design`, `brand`, `design`, `design-system`, `slides`
      y `ui-styling` (mtime 19:21). Revisadas una por una: son las mismas del bundle upstream,
      **cero contenido propio de ONIA pisado** — los "onia" que aparecían en el grep eran
      *testimONIAl*. Backup del SKILL.md viejo en el scratchpad.
      **Gates**: `typecheck:packages` verde (ítem 100% fuera de `packages/`: no toca código ni
      superficie renderizada). **Lección: "actualizar X a vN" envejece como la cola — verificar
      la versión viva antes de instalarla, y probar la herramienta corriéndola.**

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

## Sin verificar (sospechas: evidencia vieja, no re-medida)

> La REGLA DE EVIDENCIA nombra esta lista desde el principio y **no existía**: una sospecha
> sin lugar donde caer termina como línea de "por hacer" o, peor, enterrada en un `[x]`.
> Nada de acá se trabaja sin re-medirlo primero; si la medición no lo confirma, se tacha
> como fantasma y se dice por qué.

- [ ] **El CTA del hero de `ferreteria-sur` quedaría fuera de pantalla a 1440×800.**
      Medido por A3 el 2026-08-31 ("entra por 82px a 1440×900"); **no re-verificado hoy**.
      Para tomarla hay que construir la app y medir a 1440×800 en el navegador.
      ⚠️ Ojo de carril: `apps/ferreteria-sur/` **no está en la zona propia** que declara la
      regla 3 (que nombra `apps/dental-premium`) ni en su lista de prohibidos — la construyó
      este carril en A3, pero el dueño hay que confirmarlo antes de tocarla.
- [ ] **First Load de `ferreteria-sur` en 192 kB contra un presupuesto de 150 kB.**
      Misma fuente y misma advertencia: número del 31-ago, sin re-medir. Se re-mide con el
      build, no se estima. Mismo ojo de carril que el anterior.

## Hechas (no rehacer)

- [x] **Catálogo de técnicas de 16 sitios** verificado 2× por el crítico (LISTO,
      cero inventos) + galería de 49 en `gallery-50/` + recetas + "cómo se hacen".
- [x] **Dashboard v1**: marca Onia + sparkline-en-KPI + celda hero (bug del schema
      que descartaba spark/variant, arreglado). Baseline/mejorado en `scratchpad/dash/`.
- [x] **dental-premium**: sitio Next/React animado (motion.dev + GSAP) conectado a
      Onia (`/api/lead`), autosave del form (regla UX 12), dirección salud-premium.
- [x] Estética/beauty anclada (ONSKN) · re-cosecha fuentes por preload · tanda
      health-fitness · barrido 1→15 · reglas UX @agenticmatt.
