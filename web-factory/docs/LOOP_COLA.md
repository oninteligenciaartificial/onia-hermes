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

- [ ] **A1b · Dashboard: gauge/radial** para tasas (cierre, ocupación) — tipo de
      chart nuevo en `dashboard.ts` (SVG arc). + fila de mini stat-tiles con ícono.
      "Tasa de cierre 34%" es hoy un número pelado: es el caso de uso exacto.
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
- [ ] **A1e · Specs de marca del skill `dataviz`**: gap de 2px entre segmentos del
      donut (hoy están pegados), marcadores ≥8px (hoy `r=2.5` → 5px), puntas
      redondeadas de 4px en las barras ancladas a la baseline.
- [ ] **A2 · Portar técnicas top del catálogo a `packages/blocks`.** De
      `WEB_FACTORY_TECNICAS_2026.md`, las que 2+ sitios usan y son CSS-only o
      motion.dev (feature-en-banda-de-color, statement full-screen, marquee CSS,
      hover-lift). Una por vuelta: bloque tipado + tokens ONIA + reduced-motion +
      render de prueba + `typecheck:packages`.
- [ ] **A3 · Reproducir sitio #2 (estilo contrastante).** Un SaaS estilo Readily
      o un editorial-bold, en `apps/dental-premium` (o app nueva), aplicando el
      catálogo, conectado a Onia (`/api/lead`). Prueba de que el catálogo sirve
      fuera del warm-premium. [entregable de Sergio]
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
