# Loop web-factory — cola de trabajo (analizar ⇄ desarrollar)

> **Quién la lee y quién la llena** (verificado en vivo el 2026-09-01, no de memoria):
> la CONSUME `web-factory-dev-loop` — tarea de Windows, `45 * * * *`, habilitada, último
> run 16:48 La Paz (`list_scheduled_tasks`). La RELLENA `canario-visual`, que desde el
> 2026-09-01 corre **en el VPS** (`crontab -l` en 187.77.16.63: `41 4,10,16,22` UTC =
> 00:41 · 06:41 · 12:41 · 18:41 La Paz) y convierte cada diferencia que ve en pantalla en
> ítem de la cola del carril dueño. Registro: `hermes-content/docs/cola/loops.md`.
>
> ⚠️ **Corregido el 2026-09-01.** Acá decía que la leían "los dos crons in-session" y que
> el refill lo hacía un "cron de análisis (10 min)" alternando con un "cron de tareas
> (5 min)". **Ninguno de los dos existe.** El único cron de salud de este carril,
> `web-factory-salud` (`21 * * * *`), está **deshabilitado** desde el 2026-09-01 02:29,
> igual que `cerrar-y-revisar-web-factory`. Una cola que nombra a un dueño inexistente
> deja su runbook sin nadie que lo corra — y eso es lo que pasó con el de salud de abajo.
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
   — rama `claude/onia-web-architecture-b37eca`. NO otro checkout. (Verificado presente el
   2026-09-01 con `git worktree list`.)
2. **Anti-choque**: `git status --short` sucio de OTRA mano → NO tocar código,
   solo salud, y salir.
3. **Zona propia**: `web-factory/{data,packages,generate,out,tests,docs,scripts,FACTORY.md,apps/dental-premium,apps/ferreteria-sur}`
   + `.claude/skills/onia-web-factory/`. PROHIBIDO `web-factory/apps/{onia-platform,site,dentalgest-landing}`,
   `hermes-content/docs/**` (salvo `handoff/web-factory-cliente-prueba.md`) y n8n.
   ⚠️ **Corregido el 2026-09-01**: la zona no nombraba `apps/ferreteria-sur` —que este mismo
   carril construyó en A3— ni `web-factory/scripts/`, donde vive el `serve-out.mjs` que el
   runbook de salud de abajo manda a levantar. El carril tenía prohibido tocar su propia obra.
4. **UNA tarea por vuelta**, la primera no-bloqueada del carril que toque. Gates
   antes de commit: `pnpm typecheck:packages` (+ `pnpm test` si tocás packages;
   **`npm run gates` dentro de `apps/dental-premium` si la tocás** — encadena
   typecheck + pliegue + contraste; el `tsc --noEmit` suelto que decía acá **no
   miraba ni un color**, y por eso el segundo botón del hero pasó todos los
   gates siendo invisible, ver A11) + **mirar renderizado**
   + **`pnpm e2e` si cambiaste UN SOLO PIXEL de lo que se dibuja** (y si el cambio
   de geometría era el objetivo, `--update-snapshots` y **mirar la baseline nueva**
   antes de commitearla: una baseline se refresca MIRÁNDOLA, nunca a ciegas).
   Commit conventional (por qué, en español, sin firma) + push. Marcar `[x]` y
   **mover el ítem a la sección de cerrados**, no dejarlo en `## Ahora`.

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
6. **PROHIBIDO desplegar.** Lo dice el prompt de todos los loops de carril
   (`scripts/loops/README.md`) y lo repite el del integrador: *"Desplegar sigue siendo de
   Sergio; juntarle la decisión es tuyo"*. Este carril **prepara** la publicación y la deja
   a un comando; el botón lo aprieta Sergio.

## Runbook de salud (lo corre el propio dev-loop; auto-REMEDIAR)

> ⚠️ **Sin dueño hasta el 2026-09-01**: este runbook decía "el cron de análisis lo corre" y
> ese cron no existe; `web-factory-salud` está deshabilitado. Lo corre el dev-loop al empezar.

1. Server `curl -s -o/dev/null -w "%{http_code}" http://localhost:4319/dental-amanecer/` ≠200
   → `node scripts/serve-out.mjs 4319` en background desde `web-factory/`.
2. Rama pusheada (`git log origin/… -1` == `git log HEAD -1`); commits locales → push.
   Árbol sucio de otra mano → no commitear, avisar.
3. `pnpm typecheck:packages` verde; rojo en zona → arreglar mínimo y commitear.
4. **`pnpm install --frozen-lockfile` desde `web-factory/`.** Si falla, el deploy de
   `onia.com.bo` está roto aunque nada de su app lo esté — ver el primer ítem de `## Ahora`.
5. Node zombies de tests viejos → matar. Cerrar con la prueba (200, hash, exit 0).

   ⚠️ **El chequeo 4 nunca se había corrido de verdad, y tenía presa** (2026-09-02).
   La máquina cargaba **24 `node.exe` / 1.328 MB**. Dos eran del carril muerto
   `hero-en-home`: `git worktree list` **ya no lo lista** (el directorio quedó huérfano)
   y sus dos `next dev` (3411, 3477) contestaban **500** hacía 23,5 h. Matados los dos
   árboles → **18 procesos / 1.147 MB**, 3411 y 3477 en `000`, y el server propio (4319)
   sigue en **200**. **Un proceso vivo no prueba un servidor vivo: hay que pedirle el
   código.** Los otros 8 (`web-venta`, puertos 3489/3491/3493/3941-3945) **NO se tocaron**:
   contestan 200 y son de un carril vivo — pero **ocho `next start` del mismo worktree
   acumulados en 15 h** es un goteo que ese carril debería cerrar al terminar cada vuelta.

   **Sostenido (AUD11, 2026-09-02):** la limpieza aguanto — **18 `node.exe` / 1.040 MB**,
   3411 y 3477 siguen en `000` y el server propio en **200**. Los cuatro chequeos verdes:
   4319 → 200, rama al dia con `origin` (`13a960cb` == `13a960cb`, arbol limpio),
   `typecheck:packages` exit 0.

---

## Ahora

> Ordenados por lo que acerca la venta, no por lo fácil. Los dos primeros son webs que ya
> existen y que hoy no le llegan a ningún cliente; el resto es deuda medida.
> **Cada ítem trae su evidencia re-verificada el 2026-09-01** — y cinco de los siete
> estaban escritos DENTRO de ítems ya cerrados, donde ningún loop los iba a ver.

- [ ] **El CTA del hero de la ferretería tampoco entra a 1366×768: le faltan 14 px.**
      Sale de cerrar A10 (abajo): con el arreglo del pliegue, 1440×800 pasó a sobrar 18 px y
      1366×768 quedó a **−14 px**. No estaba en el criterio de A10 (que pedía 1440×800,
      1440×900 y 390×844) y se mide aparte para no dar por cerrado algo que no lo está.
      **Evidencia** (medida el 2026-09-03 sobre el bundle de producción): `ctaBottom=782`
      contra un pliegue de 768. El padding de arriba ya está en su piso (`2.25rem` = 36 px),
      así que **de padding no sale más**: los 14 px tienen que salir del titular, que mide
      **451 px** (5 líneas de 90,24 px) porque `--t-mega` topa en `6rem` y la columna del grid
      es de 754 px.
      ⚠️ **No es un arreglo suelto, es una decisión de tipografía**: el tope de `6rem` está
      puesto a propósito y con su medición escrita en
      `web-factory/apps/ferreteria-sur/src/app/globals.css:56` (*"con el tope en 8.5rem el
      titular medía 767px … Tope en 6rem: el hero entra completo en 900px de viewport"*). O sea
      que el token ya se afinó una vez para 900, no para 768. Bajarlo cambia cómo se ve el
      titular en TODAS las pantallas, y eso es de los que Sergio mira renderizado antes.
      **Hecho cuando**: `npm run gate:pliegue` pasa con 1366×768 agregado a `VIEWPORTS`, y la
      captura del titular nuevo a 1440 mirada y aprobada.

- [ ] **El contorno del ghost sobre papel claro mide 1,27:1 y el piso de un control es 3.**
      Lo encontró el gate de contraste nuevo al medir TODOS los `.btn` de la página, no sólo el
      del hero. **No es el mismo defecto que el del hero y por eso no se arregló con él**: acá el
      texto se lee perfecto (14,74:1, tinta oscura sobre papel), lo que casi no se ve es la
      píldora que lo rodea — el botón se identifica igual por su texto.
      **Evidencia** (2026-09-03, bundle de producción, las tres pantallas): «Pedir presupuesto»
      de `.closer` da `borde 1.27:1 (piso 3) sobre #f8f5ef`. Sale impreso como aviso en cada
      corrida de `npm run gate:contraste` — no está escondido.
      **Por qué NO lo cerré solo**: subir el borde de `--line` (tinta al 12 %) hasta 3:1 exige
      llevarlo a ~55 % de tinta, y eso **cambia cómo se ve el botón en toda la superficie clara**.
      Es un cambio visible de dirección, no un arreglo de defecto — y un rediseño se muestra
      renderizado y espera el OK sobre ESA pieza (2026-08-20).
      **Hecho cuando**: Sergio ve las dos versiones del botón lado a lado y elige, o se decide
      dejarlo como está y el aviso del gate se convierte en excepción declarada con su motivo.

- [x] **La ferretería pesa 192 kB de First Load contra un presupuesto de 150.**
      También anotado por A3 al cerrar y nunca convertido en línea. Es el sitio de un negocio
      en Bolivia: lo abre un cliente con datos móviles.
      **Evidencia**: `web-factory/apps/ferreteria-sur/package.json` carga `motion` y `gsap`
      como dependencias planas del bundle y
      `web-factory/apps/ferreteria-sur/src/components/motion.tsx` es su único consumidor.
      **Hecho cuando**: la salida de `pnpm --filter ferreteria-sur build` muestra First Load
      **≤150 kB** en la ruta raíz, pegada en el commit, y el sitio mirado renderizado a 1440 y
      390 para probar que la animación sigue viva (import dinámico, no animación borrada).
      ✅ **Re-medido el 2026-09-03: 192 kB, exacto — y no es sólo la ferretería.**
      `dental-premium` está en **187 kB** con las mismas dos dependencias planas
      (`motion` + `gsap`) y el mismo consumidor único, así que el arreglo es el mismo dos veces
      y este ítem cubre las dos apps. El piso compartido son 102 kB, o sea que lo propio de cada
      página son 90 kB (ferretería) y 85 kB (dental): el recorte tiene que salir de ahí.
      ✅ **CERRADO el 2026-09-03. Ferretería 192 → 148 kB, dental 187 → 143 kB.**
      La causa era una sola y la misma en las dos, y **no era `motion`**: `gsap` +
      `ScrollTrigger` importados **estáticamente** arriba del módulo, cuando su único uso vive
      dentro de un `useEffect` que corre después de montar y que con reduced-motion no corre
      nunca. Pasaron a `import()` dinámico (`ferreteria-sur/src/components/secciones.tsx`
      → `HeroFondo`, `dental-premium/src/components/HeroScene.tsx`), con guarda de desmontaje
      para no registrar el trigger sobre un nodo que ya no existe. **La animación no se tocó.**
      **Evidencia** — `npm run gate:peso` en cada app:
      `✓ / — First Load JS 148 kB / 150 kB` y `✓ / — First Load JS 143 kB / 150 kB`.
      Miradas renderizadas a 1440x900 y 390x844, hero y después de scrollear, cero recursos
      caídos. El resto de los gates que ya existían siguen verdes (pliegue en las dos,
      contraste en la dental con sus 3 avisos de siempre, que son el ítem del ghost).
      ⚠️ **El gate del peso solo NO alcanzaba, y por eso hay dos.** Habría dado el mismo verde
      si en vez de mover GSAP lo hubiera **borrado**, o si el chunk dinámico fallara al bajar
      —fallo mudo: la página se ve entera y el fondo se queda quieto—. Va con
      `npm run gate:parallax`, que mide que las capas **se movieron de verdad** tras el scroll
      y que con reduced-motion **no** se mueven. Falsificado bloqueando los chunks reales de
      GSAP (`608.*`, `e809d3ec.*`): el de peso quedó VERDE y el de parallax se puso ROJO.
      Los dos quedan cableados en el `npm run gates` de cada app.
      📌 **Queda con poco aire: 148/150 en la ferretería.** Cualquier dependencia nueva en el
      bundle inicial la vuelve a pasar — la diferencia es que ahora el gate lo dice en vez de
      que se descubra medio año después. El siguiente recorte, si hace falta, sale de
      `motion/react` (`LazyMotion` + `m` en lugar de `motion`), que es lo que queda arriba.

- [ ] **La primitiva de hover-lift existe, está documentada, y no la usa ni un bloque.**
      T34 se cerró como fantasma con esta frase adentro: *"lo que SÍ falta y no es esto:
      ningún bloque la usa — cablearla a las cards es otra tarea, anotada"*. Nunca fue línea.
      Una primitiva que ninguna card usa es una promesa de la galería que el cliente no ve.
      **Evidencia** (re-verificada hoy): `$ grep -rn wf-hover-lift web-factory/packages` sólo
      devuelve su propia definición en `web-factory/packages/blocks/src/motion.ts:53`, su
      neutralización bajo reduced-motion en la 77, su ficha en la 157, la tabla de
      `web-factory/packages/blocks/MOTION.md:37` y la demo suelta
      `web-factory/packages/blocks/motion-demo.html:72`. **Cero uso en los bloques.**
      **Hecho cuando**: las cards de al menos un bloque real la llevan, con su test de que la
      clase sigue puesta, y **mirado** el hover en la galería en claro y oscuro + con
      reduced-motion forzado, comprobando que ahí no se levanta.

- [ ] **El punto final del spark del KPI mide 5,03 px y el piso que fijó W4 es 8.**
      A6 lo dejó anotado dentro de su propio `[x]`: *"sigue en `r=3` y, con la escala de 0,839,
      mide 5,03px renderizados — bajo el piso de 8px"*. Es el único marcador del panel que
      quedó fuera de la regla que el propio carril se puso en W4.
      **Evidencia**: `web-factory/packages/templates/src/dashboard.ts:993` sigue emitiendo
      `r="3"` en el círculo del último punto.
      **Hecho cuando**: medido en el navegador el diámetro RENDERIZADO (no el atributo) en
      `dashboard-demo` y `dashboard-edge` × claro/oscuro × 1440/390, ≥8 px en todas, con el
      test que **cae** al volver a 3 verificado en rojo antes de darlo por bueno.

- [ ] **Carril B — portfolio sigue sin ancla (N=1), el último rubro que se receta por analogía.**
      B1 y B2 cerraron los seis rubros que tenían, y las dos terminan con la misma frase
      colgando fuera de toda línea de cola: *"Sigue sin ancla y queda para B: portfolio (N=1)"*.
      **Evidencia** (re-verificada hoy):
      `web-factory/data/references/design-sources/2026-08-29-vertical-playbooks.md:231` sigue
      diciendo "Sigue sin ancla: portfolio (N=1)".
      **Hecho cuando**: dos sitios de portfolio vivos cosechados con el MISMO método que B1/B2
      (Scrapling con `impersonate=chrome`, siguiendo la hoja de estilo enlazada, hexes por
      **token declarado** y saturación en **HSV**, descartando por NOMBRE del token y no por
      frecuencia), su ficha con cifras en
      `web-factory/data/references/design-sources/`, y la sección del playbook reescrita con lo
      que el dato diga — incluso si desmiente lo que hoy está escrito, que es lo que pasó en
      los dos rubros anteriores.

## Bloqueado (decide Sergio)

> Reverificado el 2026-09-01. Un bloqueo vencido es peor que un fantasma: le pide a Sergio
> una decisión que ya tomó.

- [ ] **Publicar onia.com.bo. Ya no son 77 commits: son OCHO, y uno cobra un precio muerto.**
      El sitio de venta sirve el build `Ega1b2zc6I30Rblyyl2Fv`, del **24-ago 21:01 La Paz**
      (medido por SSH en /opt/onia-landing/runtime-next; el mismo id aparece en el HTML vivo).
      Desde ese build, `$ git log origin/main --since=2026-08-24 -- web-factory/apps/onia-platform`
      son **8 commits**, no 77 — la cifra vieja del radar es de antes del despliegue a mano del
      24-ago. Lo que hoy está publicado y no debería:
      **/precios cobra "Inventario avanzado — Bs 180"**, que Sergio sacó de la oferta el 27-ago
      y que `eec7d0f3` ya borró en main (medido con curl sobre la página viva), y **el hero
      aprobado el 1-sep no está**: el h1 vivo sigue siendo el de la v3 ("Tu negocio no pierde
      citas ni cobros…") mientras main ya trae "El negocio no."
      (`web-factory/apps/onia-platform/src/app/(sitio)/hero.test.ts:40`).
      **Cómo se publica**: el workflow de deploy por `workflow_dispatch` con `swap=false`
      (build + stage, no toca producción) y, si sale verde, otra corrida con `swap=true`.
      **Ningún loop puede hacerlo**: los prompts prohíben desplegar
      (`scripts/loops/README.md`) y el del integrador lo dice literal — *"Desplegar sigue
      siendo de Sergio"*. **Se sabe hecho** abriendo la página de precios y viendo que
      "Inventario avanzado" ya no cobra, y la home con el hero nuevo.

- [ ] **La app que SIRVE onia.com.bo sigue con el lockfile de npm que este carril acaba de sacar
      de las suyas — y no es zona de este carril.**
      El 2026-09-02 se sacaron `apps/dental-premium/package-lock.json` y
      `apps/ferreteria-sur/package-lock.json` (ítem A8, arriba). **Quedó el tercero, y es el
      peor**: `$ git ls-files | grep package-lock.json` desde `web-factory/` devuelve hoy una
      sola línea, `apps/onia-platform/package-lock.json`. Esa app entra al workspace de pnpm por
      `pnpm-workspace.yaml` (`apps/*`) igual que las otras dos, así que un `npm install` ahí
      desincroniza `pnpm-lock.yaml` y **vuelve a matar el deploy** — con el agravante de que es
      la app del sitio de venta, o sea el fallo que ya costó nueve días.
      **No es dificultad, es zona**: `apps/onia-platform/` es del carril `web-venta`
      (`hermes-content/docs/cola/loops.md`), y la regla 3 se lo prohíbe a este carril.
      **Es el mismo trabajo de A8, ya probado**: `git rm --cached` del lockfile, la línea en su
      `.gitignore`, y `pnpm install --frozen-lockfile` verde. Bs 0.
      **Decisión**: se rutea a `web-venta`, o se le extiende la zona a este carril sólo para ese
      archivo. Las dos cuestan lo mismo.

- [ ] **El paso que publica el sitio de venta sigue colgado del de un panel abandonado.**
      En `.github/workflows/deploy-onia-center.yml:78` el paso "Deploy landing" corre en el
      MISMO job y DESPUÉS del deploy de center, **sin `if:`**. Si el primero muere, el segundo
      nunca corre — que es exactamente cómo el sitio de venta quedó nueve días sin publicar. Y
      center.onia.com.bo **está muerto a propósito**: devuelve 404 (medido hoy) porque Sergio
      le sacó los routers de traefik el 29-ago.
      **Es una línea** (`if: always()` en el paso del landing, o partir el workflow en dos).
      **Bloqueado por zona, no por dificultad**: `.github/` no es zona de este carril (regla 3).
      Decisión: se le extiende la zona a este carril para ese archivo, o se rutea a `onia-cola`,
      que ya despliega. Las dos cuestan lo mismo: una línea, Bs 0. En la misma pasada entra el
      gate que hoy no existe (`pnpm install --frozen-lockfile` sobre `web-factory/**` en
      `.github/workflows/repo-pulse.yml`), que es lo que impide que esto vuelva a pasar.

- [ ] **Dónde se publican dental-premium y ferretería-sur.** Dos opciones, las dos Bs 0:
      **(a) Subdominio en el VPS.** El comodín ya resuelve: cualquier subdominio de la marca
      devuelve las IPs de Cloudflare y responde **404** hoy, o sea que falta el vhost, no el
      DNS. Traefik 3.6.7 vía Easypanel; las dos apps ya son standalone, el mismo modelo de
      `scripts/deploy-onia-landing.sh`. Cuesta un contenedor por sitio.
      **(b) Vercel por CLI.** Cuenta **hobby**, y el deploy por git está apagado para todo el
      repo en el `vercel.json` de la raíz porque cinco loops pusheando agotaban la cuota diaria
      (`37f9ac88`). Habría que deployar a mano con `--prebuilt`.
      Recomendación: **(a)** — es el modelo que el repo ya sabe operar y no compite con la
      cuota que la landing necesita.

- [ ] **Los `packages/` de web-factory no los importa NADIE, y a este carril se le prohíbe tocar lo que sí vende.**
      Los tres paquetes que este carril viene puliendo hace diez días no aparecen en una sola
      línea de la app que sirve onia.com.bo: `$ grep -rn "@onia/" web-factory/apps/onia-platform/src`
      devuelve 0. Y la regla 3 le prohíbe a este carril tocar esa app. Diez días de trabajo con
      destino cero, por diseño. Opciones cotizadas: **(a)** los paquetes se declaran producto
      interno (galería + webs de cliente) y se acepta que la landing no los use — Bs 0, cero
      trabajo, pero hay que dejar de medir el carril por lo que le llega al sitio de venta;
      **(b)** se le abre la zona a este carril sobre esa app para portar de a un bloque — Bs 0,
      y choca con `onia-cola`, que ya la toca; **(c)** las webs de cliente pasan a ser el único
      consumidor y `web-factory/packages/` deja de crecer hasta que haya cliente que las pague.
      Anotado también en `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md`.

- [ ] **Texturas SVG en dental-premium.** A4(c) lo dejó bloqueado el 31-ago: *"no hay OK de
      Sergio en ningún lado (avisado por PushNotification)"*, y nunca llegó a esta lista de
      bloqueos. Sin respuesta desde entonces. Si no hay OK, se cierra sin trabajo.

- [ ] **Bloques cifra-editorial, quote-única y features+device.** Propuesta enviada, sin
      respuesta desde el 30-ago. Si sigue sin respuesta la próxima vuelta, se cierra sin
      trabajo en vez de quedar juntando polvo.

- [ ] **Rediseño del dashboard admin real.** ⚠️ **Corregido el 2026-09-01**: esta línea decía
      "onia-platform/onia-center = otra lane", y **ONIA Center ya no existe** — Sergio el
      31-ago: *"iba a ser el panel para manejar todo pero quedó abandonado"*, y
      center.onia.com.bo devuelve 404 (medido hoy). Queda sólo el admin de la app de
      plataforma, que sigue siendo otro carril: se propone y se coordina, no se toca desde acá.
- [ ] **Apagar el cron de Windows `web-factory-dev-loop`: su trabajo ya lo hace otro loop,
      sobre otra rama y otra cola.** Traido tal cual del carril de Windows
      (`claude/onia-web-architecture-b37eca`) al integrarlo el 2026-09-03: alla vivia en su
      propia cola, que es justamente el archivo que este item denuncia duplicado.
      El pedido cambio y hay que decirlo entero, porque la
      version anterior de este item pedia una decision que Sergio **ya tomo al reves**.
      ⚠️ **Reverificado por AUD11 (2026-09-02, escalon 0: "un bloqueo VENCIDO es peor que un
      fantasma").** Lo que decia: *"apagarlo, o rellenar `CARRIL A`"*, citando `loops.md` en
      *"Apagados a proposito — NO rearmar"*. **Vencido.** Esa misma fila de `loops.md` hoy
      cierra con: *"⚠️ **REVIVIO el 2026-09-02** como `web-factory-dev` en el VPS
      (`21 2,8,14,20`, commit `0c48cf72`)… **esta fila es historia, no una orden de
      apagarlo**"*. O sea: la opcion (b) —revivirlo— ya se ejecuto. Pedirle hoy que lo apague
      "porque la cola quedo en cero" es pedirle una decision caduca.
      **Pero el revival no paso aca, y ese es el hallazgo.** Medido contra `origin` en esta
      vuelta: `origin/claude/web-factory-dev` trae un `web-factory/docs/LOOP_COLA.md`
      **reestructurado** (1.109 lineas, secciones `## Ahora` / `## Bloqueado` /
      `## Cerrado — carril A` / `## Cerrado — carril B`) con **6 items abiertos en `## Ahora`**
      —publicar con un comando, el CTA de la ferreteria a 1440×800, los 192 kB, `hover-lift`
      sin usar, el punto del spark en 5,03 px, portfolio sin ancla—. **Este** archivo, en
      `claude/onia-web-architecture-b37eca`, sigue con la estructura vieja (`## CARRIL A` /
      `## CARRIL B`) y **cero** items abiertos en las dos.
      **El mismo nombre de archivo son hoy dos archivos distintos en dos ramas, leidos por dos
      loops distintos** — `web-factory-dev` (VPS, rama `claude/web-factory-dev`) y este
      (`web-factory-dev-loop`, Windows, esta rama). Es exactamente el choque que `loops.md`
      nombra: *"dos `chatbot-cola` sobre la misma rama, en dos maquinas, pisandose"*, con el eje
      cambiado —misma cola conceptual, dos ramas—. El de Windows corre **cada hora**; el del VPS,
      4 veces al dia sobre la cola que si tiene combustible.
      **La decision, ahora una sola y de Sergio:** poner `web-factory-dev-loop` en
      `enabled: false` (un acto). Este carril no se queda sin dueno — `web-factory-dev` ya lo
      tiene, con los 6 items. **No se toca la cola de la otra rama desde aca**: es otro carril.
      Un loop no se apaga a si mismo: por eso sigue aca.


---

## Cerrado — carril A (build)

- [x] **A11 · El segundo botón del hero de la dental ya se lee: pasó de 1,00:1 a 15,16:1**
      (2026-09-03).
      Era el color, no la animación: `.btn--ghost` heredaba en el hero los tokens de superficie
      CLARA (`--ink` #172420, `--line` = tinta al 12 %) y el hero es la única superficie oscura
      de la app. Sobre el verde profundo daba **1,00:1 de texto y 1,01:1 de borde** — el botón
      ocupaba su lugar y era invisible. El gate del pliegue lo daba por bueno porque mide
      geometría y opacidad, **no color**.
      **Qué se hizo**: clase `.on-green` que REBINDEA `--ink`/`--ink-soft`/`--line` sobre
      superficie oscura (`globals.css`), aplicada al hero en `components/HeroScene.tsx`. Mismo
      criterio que `.on-steel` en ferreteria-sur. No se tocó la regla genérica `.btn--ghost`, así
      que la superficie clara queda igual.
      **Medido** (bundle de producción, `npm run gate:contraste`):

      | pantalla | antes texto | después texto | antes borde | después borde |
      |---|---|---|---|---|
      | 1440×800 | 1,00:1 | **15,16:1** | 1,01:1 | **4,15:1** |
      | 1440×900 | 1,01:1 | **15,32:1** | 1,01:1 | **4,16:1** |
      | 390×844 | 1,01:1 | **15,15:1** | 1,01:1 | **4,16:1** |

      **Mirado** renderizado a 1440×800 y 390×844: los dos botones del hero legibles, el ghost
      con su píldora visible al lado del sólido. `npm run gates` verde (typecheck + pliegue +
      contraste).
      **Gate nuevo, y por qué así**: `scripts/gate-contraste.mjs` saca sus sujetos del **DOM**
      (mide todos los `.btn` que la página renderice), no de una lista escrita a mano — un gate
      con lista de inclusión falla ABIERTO el día que aparece un botón nuevo. Y samplea el fondo
      del **PNG de la captura** en vez de deducirlo del CSS, porque detrás del ghost del hero no
      hay un color sino tres degradados y un scrim.
      **Tres falsos positivos del instrumento** antes de creerle una sola medición — los tres del
      mismo tipo (fotografiar un fotograma que el visitante nunca ve):
      · el `Reveal` envuelve a sus hijos en un `motion.div`, así que el nodo animado es el
        **abuelo** del botón; mirar `parentElement` leía `.actions`, que nunca se anima, y daba
        por asentado un botón todavía en `opacity:0`. Un botón verde sólido salía medido como
        `#eaede6` — el papel de atrás — y el gate acusaba al sitio.
      · `scroll-behavior: smooth` hace que scrollear ANIME: la captura sale a mitad del viaje.
        Se apaga con `addStyleTag` antes de mover nada.
      · `scrollIntoViewIfNeeded` deja la última sección pegada al borde inferior, por debajo del
        `margin: -12%` que dispara `whileInView` — el reveal no arrancaba y sólo fallaba a
        1440×900. Se scrollea al **centro**.
      **Barrido a la app hermana**: las dos comparten `motion.tsx` por copia y ya habían
      compartido el bug de A10, así que se midió ferreteria-sur con el mismo gate
      (`BASE_URL=… node scripts/gate-contraste.mjs`): **sus 7 botones pasan** (ghost del hero
      14,90:1). El defecto era sólo de la dental — su `.on-steel` ya cubría el caso.
      **Queda abierto y a la vista**: el contorno del ghost sobre papel claro (1,27:1). Es ítem
      propio en "Ahora" y el gate lo imprime como aviso en cada corrida.

- [x] **A10 · El CTA del hero de la ferretería ya entra en el pliegue — y estaba roto de DOS
      maneras, no de una** (2026-09-03).
      El ítem pedía geometría: "queda fuera del pliegue a 1440×800". Midiéndolo sobre el bundle
      de producción aparecieron **dos fallas distintas**, y la segunda era la peor:
      1. **Geometría** — a 1440×800 el CTA caía **66 px por debajo** del pliegue (`ctaBottom=866`,
         viewport 800).
      2. **Visibilidad** — a **1440×900 el CTA estaba DENTRO del pliegue (`bottom` 842 < 900) y
         aun así no se veía**: `opacity: 0`, `transform: translateY(24px)`. Su `Reveal` usa
         `whileInView` con `viewport={{ margin: "0px 0px -12% 0px" }}`, que exige estar un 12 %
         por encima del borde inferior para disparar. El CTA nace por debajo de esa línea, así
         que **nunca entraba "en viewport" y se quedaba invisible hasta que el visitante
         scrolleara**. Un bloque que ya está sobre el pliegue no puede depender de un scroll que
         no va a pasar.
      Eso explica la contradicción del re-chequeo anterior, que a 1440×900 no veía el botón
      aunque la cuenta diera que entraba: entraba, pero era invisible.
      **Qué se hizo** (dos cambios, uno por falla):
      · `components/motion.tsx`: `Reveal` acepta `alMontar`, que cambia `whileInView` por
        `animate`. Los cinco `Reveal` del hero de `app/page.tsx` lo llevan. La animación sigue
        viva (misma curva, mismos delays) y ahora **siempre termina visible**.
      · `app/site.css`: el `padding-top` del hero era función SÓLO del ancho (`7vw` → 96 px a
        1440), o sea que gastaba su máximo justo en la laptop ancha y BAJA. Ahora es
        `min(clamp(2.5rem, 1rem + 7vw, 6rem), max(2.25rem, 100svh - 49rem))`: por encima de
        900 px de alto **el valor calculado no cambia**, y sólo por debajo cede aire. Se toca
        únicamente el padding de ARRIBA, porque el de abajo cae después del CTA y no mueve el
        pliegue.
      **Medido en el navegador, no supuesto** — `ctaBottom` contra el pliegue, `opacity`,
      `transform` y hit-test con `elementFromPoint` (que el botón sea de verdad clickeable),
      × `prefers-reduced-motion` en sus dos valores:
      | viewport | antes | después |
      |---|---|---|
      | 1440×800 | −66 px, `opacity 0`, no clickeable | **+18 px, visible, clickeable** |
      | 1440×900 | dentro, pero `opacity 0` | **+58 px, visible, clickeable** |
      | 390×844 | ok | **+258 px** (sin cambios: `padTop` 43,3 px antes y después) |
      1440×1080 y 768×1024 quedan idénticos al estado anterior. **Capturas miradas** a las tres
      medidas del criterio: los dos botones ("Pasar mi lista" / "Ver qué hay") entran enteros.
      **El gate que faltaba**: ningún gate del repo miraba esta app —`playwright.config.ts`
      apunta a `out/<slug>` y `playwright.next.config.ts` a `apps/site`—, así que las dos fallas
      podían volver sin que nada avisara. Queda `apps/ferreteria-sur/scripts/gate-pliegue.mjs`
      (`npm run gate:pliegue`), que mide las **dos** cosas: geometría y visibilidad real.
      **Verificado en ROJO antes**: corrido contra el código sin el arreglo (`git stash` + build)
      falla 4 de 6 mediciones y las nombra por separado — a 1440×900 falla **sólo por
      `opacity=0`**, que es exactamente el caso que un gate de pura geometría habría dado por
      bueno. Con el arreglo, 6/6 verde.
      **Gates**: `tsc --noEmit` de la app verde · `next build` exit 0 · `pnpm typecheck:packages`
      verde.
      **Y se barrió el hermano, no sólo donde saltó** (`CLAUDE.md`: *"una promesa que cambia se
      barre en TODA la superficie"*). `dental-premium` tiene el MISMO `Reveal` por copia, así que
      se midió en vez de suponer: su CTA estaba **dentro del pliegue en las tres medidas y aun
      así invisible** a 1440×800 (`bottom` 757, `opacity 0`) y 1440×900 (`bottom` 849,
      `opacity 0`). Ahí la geometría nunca estuvo mal — **sólo la visibilidad** —, que es
      justamente por lo que el ítem original, escrito como "queda fuera del pliegue", jamás iba
      a encontrarlo en esta app. Mismo arreglo de `alMontar` + su propio `gate:pliegue`: 6/6
      verde, captura mirada.
      **Lo que NO cierra**: a **1366×768** siguen faltando 14 px en la ferretería; queda como
      línea propia en `## Ahora` porque el único lever que queda es el tamaño del titular, y eso
      es decisión visual de Sergio, no un arreglo. Y mirar la captura de la dental destapó un
      defecto que el bug de opacidad escondía —su segundo botón es ilegible sobre el verde—,
      también anotado arriba con su medición.

- [x] **A9 · Las dos webs de cliente ya se publican con un comando — y el standalone con el que
      se iba a publicar estaba ROTO** (2026-09-03).
      El ítem pedía correr los dos builds y dejar un `deploy-web-cliente.sh`. Los builds salieron
      exit 0 **y el `server.js` no estaba donde el modelo de deploy lo espera**: ninguna de las
      dos apps declaraba `outputFileTracingRoot`, así que Next infería la raíz del trazado sola,
      se iba más arriba de `web-factory/` y **horneaba la ruta absoluta del checkout dentro del
      bundle**. Medido buildeando en el VPS, el server.js quedó en
      `.next/standalone/loops/onia-hermes-webfactory/web-factory/apps/dental-premium/server.js`.
      O sea: la ruta cambiaba según DÓNDE se buildeó —otra en el runner de CI, otra en cada
      worktree— y cualquier script copiado del de onia.com.bo (que espera
      `standalone/apps/<app>/server.js`) fallaba, y fallaba distinto en cada máquina. **Un build
      exit 0 no dice nada sobre si el bundle se puede desplegar**: por eso el "hecho cuando"
      pedía LISTAR el server.js, y por eso apareció.
      **Qué se hizo**: `outputFileTracingRoot: monorepoRoot` en el `next.config.ts` de las dos
      apps —el mismo patrón que `apps/onia-platform/next.config.ts:37`, que es por lo que ESA sí
      se despliega— con el motivo escrito adentro; y `web-factory/scripts/deploy-web-cliente.sh`
      parametrizado por `APP` + `SITE_DOMAIN` (build → tarball → stage → swap con backup,
      health check y rollback), que además **crea el contenedor si es el primer deploy** e
      imprime el fragmento de vhost sin aplicarlo (traefik es infra de un solo dueño).
      Con `DEPLOY_SWAP=false`, el default, buildea y deja el runtime staged sin tocar nada
      publicado: ése es el modo que puede correr un loop.
      **Medido, no supuesto**: `pnpm install --frozen-lockfile` exit 0 · los dos builds exit 0
      (dental **187 kB** First Load en `/`, ferretería **192 kB**) · `server.js` presente en
      `apps/<app>/.next/standalone/apps/<app>/server.js` en las dos · `bash -n` del script OK ·
      `pnpm typecheck:packages` verde. Y el runtime ensamblado igual que lo hace el script se
      **levantó y se miró**: `node apps/<app>/server.js` arranca en ~90 ms, HTTP 200 en 32 ms
      (27 kB dental / 43 kB ferretería), y las dos home renderizadas a 1440×900 con **cero
      errores de consola y cero respuestas 4xx**.
      **Queda para Sergio, y es lo único**: elegir el subdominio (ítem de la sección Bloqueado) y
      apretar el swap. Desplegar sigue sin ser de este carril.

- [x] **A8 · Sacada la causa por la que una app de este carril tumbaba la publicación de
      onia.com.bo** (2026-09-02).
      El lockfile ya estaba sano —`pnpm install --frozen-lockfile` desde `web-factory/` da
      **exit 0** hoy (`Lockfile is up to date, resolution step is skipped · Already up to date ·
      Done in 1.3s using pnpm v10.33.3`, 9 workspace projects)—, así que lo que quedaba era la
      **causa**, y seguía viva: los dos `package-lock.json` de npm trackeados dentro de un
      workspace pnpm, más un README mandando `npm install`.
      **Qué se hizo**: `git rm` de `apps/dental-premium/package-lock.json` y
      `apps/ferreteria-sur/package-lock.json`; `package-lock.json` + `yarn.lock` agregados al
      `.gitignore` de cada app con el porqué escrito adentro (un `.gitignore` sin motivo se
      revierte); `apps/ferreteria-sur/README.md` reescrito a `pnpm install --frozen-lockfile`
      desde la raíz del workspace + `pnpm --filter`.
      **Probado que eran peso muerto, no supuesto**: con los dos lockfiles ya borrados,
      `pnpm --filter dental-premium typecheck` y `pnpm --filter ferreteria-sur typecheck` dan
      **exit 0** — las apps resuelven sus dependencias desde el workspace de pnpm y nunca
      leyeron esos archivos. `pnpm typecheck:packages`: exit 0.
      **La cola decía "los dos README" y eran uno**: `apps/dental-premium` **no tenía README**.
      Ahí el peligro era peor —cero instrucciones, así que el próximo adivina `npm install`—, y
      se creó uno mínimo, sólo con lo verificado en `package.json` y `next.config.ts`, dejando
      escrito que el formulario no se documentó porque nadie lo midió en esta pasada.
      ⚠️ **Hipótesis probada y REFUTADA en la misma vuelta, para que nadie la repita**: las dos
      apps tienen `"incremental": true` **y** tenían `tsconfig.tsbuildinfo` commiteado, lo que
      parecía un agujero de gate (un `tsbuildinfo` ajeno haciendo que `tsc --noEmit` no
      re-chequee). Se midió inyectando un error de tipos real en `src/app/page.tsx` con el
      `tsbuildinfo` commiteado presente: `tsc` lo cazó igual —
      `error TS2322: Type 'string' is not assignable to type 'number'`, exit 2. **No enmascara
      nada.** Se sacaron del repo igual, pero como ruido de diff, no como arreglo de gate.
      ⚠️ **Queda el mismo riesgo FUERA de zona**: `apps/onia-platform/package-lock.json` sigue
      trackeado, y esa app también entra al workspace por `apps/*` — es exactamente la que
      sirve onia.com.bo. Es zona del carril `web-venta`, así que este carril no la tocó: la
      línea está abajo, en `## Ahora`.
      **Lección: el lockfile era el síntoma; el hábito de `npm install` era la causa. Arreglar
      el lockfile sin sacar los archivos que invitan al error deja el bug esperando al próximo.**

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
      ~~Anotado, NO tocado (fuera de este ítem): el sparkline del KPI sigue con
      `preserveAspectRatio="none"`, así que su punto final es una elipse.~~
      ⚠️ **Nota VENCIDA, tachada por AUD7 (2026-09-01).** Se arregló y nadie tachó la línea:
      `dashboard.ts:1003` (`renderKpiSpark`) emite hoy `preserveAspectRatio="xMidYMid meet"`,
      con el comentario que cuenta el arreglo, y `dashboard.test.ts:382` guarda que **ningún**
      SVG del panel vuelva a `none`. Deja de ser algo por hacer.
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
      → **Promovida a ítem A9 por AUD7 (2026-09-01)**: sigue siendo cierta, y como nota al
      pie no la podía tomar nadie. Se trabaja desde A9, no desde acá.
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

- [x] **A7 · La tarjeta ya se levantaba; lo que le faltaba era la PUERTA** (2026-09-01).
      El ítem pedía cablear `wf-hover-lift` a `clinic-services.ts`, y **medido hoy, ese
      cableado habría sido inerte y duplicado**. Dos números, no una impresión:
      (a) **`MOTION_CSS` no viaja a esa página**. Sus únicos consumidores son
      `landing-logistics.ts:270` y `landing-realestate.ts:248` (+ la galería); el template
      que dibuja las tarjetas, `landing-clinic.ts`, **no lo emite**. La clase habría salido
      al HTML sin una sola regla detrás. (b) **`.wf-clinic-card` YA se levanta**
      (`clinic-css.ts:393`: `translateY(-4px)` + borde + sombra, con su propia transición),
      y lo hace mejor: sus valores salen de `color-mix()` sobre los tokens, mientras
      `wf-hover-lift` quema `rgba(10,17,38,.35)` — una sombra ciega al tema, el mismo modo
      de falla de W1.
      **Lo que la primitiva sí traía y a la tarjeta le faltaba es su puerta**:
      `.wf-hover-lift:hover{transform:none}` bajo reduced-motion (`motion.ts:77`). En
      `clinic-css.ts` el bloque `reduce` sólo neutralizaba `[data-reveal]`, y los botones
      entraban por `no-preference` — **la tarjeta era el ÚNICO hover con `transform` de
      todo el archivo sin puerta** (verificado: 4 `:hover`, sólo 2 con movimiento). Puesta.
      Se apaga el desplazamiento y **se dejan borde y sombra**, que son color y no
      movimiento: quien pide menos movimiento no pierde la respuesta al hover.
      **Medido en el navegador en las dos preferencias**, no razonado: con
      `no-preference` la tarjeta da `matrix(1,0,0,1,0,-4)`; con `reduce`, `none` — y el
      `borderTopColor` y el `box-shadow` son **idénticos byte a byte en las dos**. 0
      errores de consola. Miradas las dos capturas: en `reduce` la tarjeta no sube.
      **El gate se probó MUTANDO**: sacada la línea, `clinic-css.test.ts` cae. Y el segundo
      test fija la lista de `:hover` con `translate/scale/rotate`, así que **un hover nuevo
      sin puerta rompe rojo** en vez de pasar desapercibido — que es la lección de AUD1.
      **Gates**: `typecheck:packages` verde, **267/267** (+2), `pnpm e2e` **103 passed /
      0 failed**, y mirado renderizado.
      ⚠️ **De paso, un tropiezo de método propio**: regeneré con `pnpm generate
      dental-amanecer` a secas y el cliente **no declara `template` en su `.json`** (sólo
      en el `.design.json`), así que salió con la plantilla genérica y la página de la
      salud perdió las tarjetas. Rehecho con `--template landing-clinic` (19 tarjetas,
      200). `out/` está en `.gitignore`, así que no llegó a ningún commit — pero el
      servidor de salud sí habría servido otra página.

- [x] **A8 · La primitiva de hover borrada: nadie la usaba y ninguna tarjeta la quiere**
      (2026-09-01). Evidencia re-verificada antes de tocar: `grep -o 'class="[^"]*wf-hover-lift[^"]*"'`
      devuelve **0 elementos en las 14 páginas de `out/`**, no solo en las dos del ítem;
      la cadena aparecía únicamente como las reglas CSS dentro de `MOTION_CSS`, que solo
      emiten `landing-logistics` y `landing-realestate`. **Medido el peso, como pedía el
      ítem**: `MOTION_CSS` son 2.738 B (14,1% de logistics, 11,8% de realestate) y la
      primitiva muerta 261 B de eso — **el peso NO era el argumento**, así que la decisión
      se tomó por diseño, no por bytes.
      **Se borró**, y las dos tarjetas que existen son la razón: `clinic-css` levanta la
      suya −4px con su propia puerta de reduced-motion, y `property-cards.ts:189` zooma la
      foto DENTRO de un marco que **a propósito no se mueve** ("the frame does not move").
      Un lift genérico no es el hover que ninguna de las dos quiere, y encima quemaba
      `rgba(10,17,38,.35)` — sombra ciega al tema, el modo de falla que W1/A1a ya habían
      arreglado en otro lado. A7 además ya había medido que en `clinic-services.ts` habría
      sido inerte y duplicada. **Darle un dueño era inventarle uno.**
      Fuera: las 2 reglas, su neutralizador de reduced-motion (`motion.ts:77`), la entrada
      de `MOTION_PRIMITIVES`, la línea del JSDoc y la fila de `MOTION.md`. El *por qué*
      quedó en el JSDoc de `motion.ts` — **fuera del literal `MOTION_CSS`**, porque ahí
      dentro el comentario viajaría como bytes a cada página de cliente, justo lo contrario
      de lo que se estaba haciendo (lo escribí adentro primero y lo medí).
      Verificado: diff de las dos páginas = **exactamente esas 4 líneas y nada más**
      (23.214→22.953 B y 19.440→19.179 B; `MOTION_CSS` 2.738→2.477), `typecheck:packages`
      verde, 267 tests verdes, `pnpm e2e` **103 pasados / 0 rojos**, y **mirado**: la página
      renderiza entera y la tarjeta de propiedad conserva su hover medido en el navegador
      (foto `none`→`matrix(1.04…)`, marco `none`→`none`, `.wf-hover-lift` = 0 en el DOM).
      **Lección: una primitiva sin usuarios no se cablea para justificarla — se borra, y el
      motivo se escribe donde el próximo autor lo lea antes de re-agregarla.**

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

- [x] **AUD4 · Auditoría de A7/A8 (los `[x]` que AUD3 no podía cubrir) — el archivo que
      dos docs daban por reemplazado seguía en disco** (2026-09-01). Cuarta vuelta de
      escalón 2 (A y B siguen todos `[x]`; A7 y A8 nacieron después de AUD3, así que eran
      los únicos sin auditar).
      **Salud, los cuatro puntos**: server 4319 → **200** (no hizo falta relanzarlo); rama
      == `origin` (`684fd863`); árbol limpio; `typecheck:packages` verde; `pnpm test`
      **267/267**; `pnpm e2e` **103 passed / 0 failed** (7 skipped) — el gate visual
      aguanta la tercera vuelta seguida.
      **A7 cierto, verificado contra el código de hoy**: la puerta existe en
      `clinic-css.ts:775` (`.wf-clinic-card:hover { transform: none; }` dentro del bloque
      `prefers-reduced-motion: reduce`) con su porqué escrito al lado, y el hover que
      neutraliza sigue en `:393`. **A8 cierto en lo que declaró**: `grep wf-hover-lift` en
      `packages/*/src/` devuelve **cero reglas** — solo las tres líneas de prosa que
      explican el borrado, que es la lápida que el propio ítem quería dejar.
      🔴 **Lo que A8 no vio, y es el hallazgo**: `packages/blocks/motion-demo.html` seguía
      en disco con **su propia copia a mano de `MOTION_CSS`** (líneas 15 y 17) y **tres
      tarjetas usando `.wf-hover-lift`** — el ÚNICO lugar del repo que todavía servía la
      primitiva borrada. Y no es que faltara actualizarlo: **dos documentos ya lo daban por
      muerto en pasado**. `MOTION.md:12` dice que la galería *"replaced `motion-demo.html`,
      a hand-kept copy of `MOTION_CSS` that had already drifted"*, y `demo.ts:3` se define
      a sí mismo como lo contrario de *"a hand-kept mirror like the old motion-demo.html,
      which desynced"*. O sea: se lo declaró reemplazado, se escribió el porqué **dos
      veces**, y no se lo borró — así que el archivo se quedó drifteando exactamente como
      decía su epitafio, y AUD3 ya lo había rozado (*"hoy también devuelve
      `motion-demo.html`"*) sin sacar la conclusión.
      **Borrado** (7.716 B). No lo referencia nadie: `grep motion-demo` en `package.json`,
      `packages/*/package.json` y `scripts/` da vacío; las únicas menciones que quedan son
      las dos frases en pasado, que ahora son ciertas.
      **Verificado que el reemplazo está vivo, no supuesto**: `pnpm blocks:demo` construye
      `out/blocks-demo/index.html` (**28 bloques · 5 huérfanos · 12 por construir**), su
      tabla de primitivas se lee de `MOTION_PRIMITIVES` y lista `wf-reveal`,
      `wf-clip-reveal`, `wf-scale-in` — **`wf-hover-lift` aparece 0 veces**. Abierta y
      **mirada** en el navegador: renderiza.
      **Nodos**: 8 `node.exe` vivos, **cero zombies de tests míos**. Uno es mi server 4319;
      los otros siete son de otros carriles (el túnel de onia-center y **dos `next dev` del
      worktree `hero-en-home` sobre `apps/onia-platform`**, puertos 3411 y 3477, vivos hace
      ~2 h). No se tocan: `apps/onia-platform` es zona prohibida de este carril.
      **Lección: "lo reemplacé" no es "lo borré". Un archivo que dos docs declaran muerto y
      sigue en disco no es historia, es una segunda fuente de verdad — y esta servía CSS.**
      **Gates**: `typecheck:packages` verde, **267/267**, `pnpm e2e` **103/0**, y mirado
      renderizado.

- [x] **AUD5 · Auditoría de AUD4 + salud — el borrado dejó una cita apuntando a código
      que ya no existe** (2026-09-01). Quinta vuelta de escalón 2 (A y B siguen todos
      `[x]`; AUD4 era el único `[x]` que nadie había auditado, porque nació en la vuelta
      anterior).
      **Salud, los cuatro puntos**: server 4319 → **200** (no hizo falta relanzarlo);
      rama == `origin` (`aa7e786c`); árbol limpio; `typecheck:packages` verde; `pnpm test`
      **267/267**; `pnpm e2e` **103 corridos, 0 fallados** (100 pasados + 3 flaky + 7
      skipped).
      ⚠️ **Los 3 flaky son de la máquina, no del código**, y se puede probar: los tres
      murieron con `page.goto: Page crashed` (Chromium se cae al navegar, no una
      aserción que falle), y pasaron en el reintento. La causa está en el listado de
      nodos: de los **8 `node.exe` vivos**, **6 son del worktree `hero-en-home`** — dos
      `next dev` sobre `apps/onia-platform` (3411 y 3477) con sus hijos. Otra mano, zona
      prohibida: no se tocan. Cero zombies míos (el único mío es el `serve-out 4319`).
      **AUD4 cierto, verificado contra el disco de hoy**: `packages/blocks/motion-demo.html`
      **no existe**; `grep motion-demo` en `packages/`, `scripts/`, `package.json` devuelve
      **solo las dos frases en pasado** (`demo.ts:3`, `MOTION.md:12`) y las líneas de esta
      misma cola — cero referencia funcional; `grep wf-hover-lift` en `packages/*/src/`
      da **cero reglas CSS**, solo prosa.
      🔴 **Lo que el borrado dejó atrás**: `clinic-css.test.ts:11` justificaba el test
      citando *"`.wf-hover-lift:hover{transform:none}` bajo reduced-motion
      (**motion.ts:77**)"* — y esa primitiva la borró A8. Hoy `motion.ts:77` es la regla
      de reduced-motion de `wf-reveal`/`wf-clip-reveal`/etc.: **la cita no envejeció mal,
      ahora apunta a otra cosa**, que es peor que apuntar a nada. Reescrito el comentario
      para que diga lo que hoy es cierto: la primitiva ya no está y **este test es el
      único lugar que guarda esa puerta**.
      **Lección: borrar deja huella en la prosa que justificaba lo borrado.** AUD4 revisó
      quién *importaba* el archivo (`package.json`, `scripts/`) y estaba bien; lo que no
      revisó es quién lo *citaba con número de línea*. Un `grep` del nombre encuentra lo
      primero; el segundo hay que buscarlo por el símbolo.
      **Gates**: `typecheck:packages` verde, **267/267**, `pnpm e2e` 103/0. El cambio es
      un comentario en un test: no dibuja un solo píxel, así que las baselines no se
      tocan.

- [x] **S1 · Los dos gates locales se caian por contencion, no por un defecto** (2026-09-01,
      vuelta de auditoria: A y B estaban todos `[x]`). `pnpm test` **murio antes de correr
      un solo test** con `FATAL ERROR: Zone Allocation failed - process out of memory` — a
      los 78 ms, con el heap en 5,9 MB. Un heap de 5,9 MB no es un test pesado: es la
      largada. vitest 4 abre **un fork por nucleo** y esta maquina tiene **12** con ~3,3 GB
      libres; los 12 node arrancando juntos agotan la memoria durante la COLECCION. Por eso
      cada subcarpeta pasaba por separado (`packages/blocks`, `templates`, `data`, `design`,
      `generate`, `harvester`, `apps`: verdes las siete) y el rojo parecia un fantasma.
      Con `maxWorkers: 4` en `vitest.config.ts`: **30 archivos / 267 tests verdes en 2,6 s**.
      El mismo cuadro en `pnpm e2e`: 3 rojos + 2 flaky, y los tres morian con **`Target page,
      context or browser has been closed`** — el navegador se caia, no fallaba una asercion.
      Medido: 1 worker → 49 verdes / 0 rojos · 2 workers → **103 verdes / 0 rojos en 1,2 min**
      (con 3 tardaba 1,3 min, o sea el paralelismo perdido no cuesta **nada**). Bajado a
      `workers: 2` en local; CI queda en 4, que no comparte maquina con los loops.
      ⚠️ **Lo peligroso es que NO estaba roto siempre**: el item de arriba (del mismo dia)
      declara 267/267 y e2e 103/0 de buena fe. Depende de cuanta RAM libre haya en ese
      minuto, y **cinco loops corren en paralelo en esta misma maquina**. Un gate que da
      rojo la mitad de las veces por contencion se termina ignorando — que es exactamente
      como la suite llevaba ocho vueltas roja sin que nadie mirara. Ahora falla o pasa por
      lo que mide.
      **Auditoria de los `[x]` de la misma vuelta** (contra el codigo de HOY, no contra la
      linea): W1 → `packages/templates/src/font-links.ts` existe y tiene su test ✔ ·
      W2 → cero `preserveAspectRatio="none"` en superficie (solo se lo nombra en dos
      comentarios que cuentan la historia) y `--color-primary` quedo solo en cromo, con
      **test que lo guarda** (`dashboard.test.ts:319`) ✔ · A1a → `--wf-series-*` vivo en
      `dashboard.ts` ✔. Ninguna se desmarca.
      **Gates**: `typecheck:packages` verde · `pnpm test` **267/267** · `pnpm e2e` **103/0**.
      Cambio de configuracion de corrida: no dibuja un pixel, baselines intactas.

- [x] **AUD6 · Auditoría de S1 y del carril B — la primera vez que alguien mira los `[x]`
      de B, y la corrida que PRUEBA el arreglo de S1** (2026-09-01). Sexta vuelta de
      escalón 2 (A y B siguen todos `[x]`).
      **Por qué estos cuatro**: AUD1–AUD5 auditaron **solo el carril A**; B1, B2 y B3
      llevaban un día cerrados **sin que nadie los verificara contra el disco**. Y S1
      nació en la vuelta anterior, así que era el otro `[x]` huérfano.
      **S1, cierto y medible**: `vitest.config.ts` tiene `maxWorkers: 4` con su porqué
      escrito, y `playwright.config.ts` tiene `workers: process.env.CI ? 4 : 2` — los tres
      números que la línea declara (4 local en unit, 2 local en e2e, 4 en CI) están en el
      archivo, no solo en la prosa.
      🟢 **Y la corrida de hoy lo PRUEBA, que es lo que faltaba.** AUD5 cerró con **3
      flaky** y los explicó por contención (`page.goto: Page crashed` en los tres, pasaban
      al reintento). Hoy, **con la misma carga ajena presente** — los mismos 6 `node.exe`
      del worktree `hero-en-home`, dos `next dev` sobre `apps/onia-platform` (3411 y 3477)
      con sus hijos, zona prohibida que no se toca — la suite dio **103 pasados, 0
      fallados, 0 flaky**. S1 no arregló el síntoma de una corrida: bajo la misma
      condición que antes producía tres caídas de navegador, ahora produce cero.
      **B1 cierto**: existe `2026-08-31-cosecha-rubros-sin-ancla.md` (7.831 B) y el
      playbook trae **§9 ganadero y §10 IA/agentes** (antes no existían); la corrección
      del umbral dental está escrita **con su historia** (`<15%` → **HSV <25%**, "se había
      escrito el piso de la muestra como ley") y la importadora dice navy de dos acentos,
      con el `#010101` nombrado como la receta del automotor que era.
      **B2 cierto**: existe `2026-08-31-cosecha-rubros-flacos.md` (8.028 B) y §2 está
      reescrita en dos regímenes con las anclas medidas. Miré si el reemplazo repetía el
      error que denuncia — el régimen "sin pop" pasó de `5-15%` a `HSV S <16%`, que sigue
      siendo el borde de la muestra — y **no lo repite**: ahora el umbral viene con los
      tres valores de remedyplace que lo sostienen (8,1% · 15,6% · 7,2%), con el modelo
      declarado y el ancla nombrada. Un techo medido y mostrado no es lo mismo que un piso
      heredado a ciegas.
      **B3 cierto**: `~/.claude/skills/ui-ux-pro-max/` tiene `scripts/search.py` y los 13
      CSV de `data/` — la skill que la línea encontró siendo "SKILL.md y nada más" hoy
      está completa.
      **Ninguna se desmarca.**
      **Salud, los cuatro puntos**: server 4319 → **200** (no hizo falta relanzarlo);
      rama == `origin` (`18c00cfa`); árbol limpio; `typecheck:packages` verde; `pnpm test`
      **267/267 en 3,0 s**; `pnpm e2e` **103 pasados / 0 fallados / 7 skipped**. Cero
      zombies míos: de los 9 `node.exe` vivos, el único de este carril es el
      `serve-out 4319`.
      **Lección: el carril B también acumula `[x]` sin auditar.** Cinco auditorías
      seguidas miraron A porque ahí está el código; los ítems de B son docs y data, y
      "no dibujan un píxel" se convirtió en excusa para no volver a mirarlos. Un doc que
      afirma una regla de diseño envejece igual que el código que la implementa.

- [x] **A9 · El punto del KPI spark ya mide 8,05px — y el piso se mide en PIXELES, no en
      unidades de viewBox** (2026-09-02). Evidencia re-verificada antes de tocar y **medida
      en el navegador**, no deducida: `dashboard.ts` seguia con `r="3"` y el circulo
      renderizaba **5,03px** de diametro (la cifra exacta que anotaba el item).
      🔴 **El arreglo obvio era el equivocado.** Copiar el `r="4"` que W4 le puso al resto
      de los marcadores **no alcanzaba**: cada SVG del panel se dibuja a una escala
      distinta y el piso de 8px de `dataviz` es de pixeles en pantalla. Medido a 1440:
      el chart de linea va a escala **1,023** (caja 327,3px / viewBox 320) y ahi `r=4`
      da 8,18px ✔; el spark del KPI vive en la tarjeta angosta y va a escala **0,839**
      (268,5px / 320), donde `r=4` habria dado **6,71px** — otra vez bajo el piso, y con
      el item marcado como cerrado. Ahora `dotR = 4.8` → **8,05px medidos**. La escala
      0,839 es el peor caso (en mobile la tarjeta es mas ancha), asi que cubre todos los anchos.
      **Efecto colateral que hubo que arreglar en el mismo cambio**: con `pad = 4` el
      circulo de r=4,8 se recortaba contra el borde del viewBox cuando el ultimo valor
      era el maximo de la serie; el pad ahora sale del propio radio (`const pad = dotR`).
      **El test se extendio multiplicando por la escala**, no comparando el `r` pelado —
      un `r >= 4` habria dejado pasar los 6,71px. + un segundo test de no-recorte.
      **Gates**: `typecheck:packages` verde, `pnpm test` **269/269** (+2), `pnpm e2e`
      **103 pasados / 0 fallados / 7 skipped**, y **mirado renderizado en claro y oscuro**
      (0 `[data-reveal]` ocultos, 0 errores de consola, los 4 circulos dentro de su caja).
      **Gate verificado MUTANDO**: con `dotR = 3` el test nuevo cae con `expected
      5.034375 to be greater than or equal to 8` — el mismo numero que midio el navegador.

- [x] **A10 · El gate visual se trago un marcador que se AGRANDO 60% — el tope baja de
      400 a 20, MEDIDO** (2026-09-02). Evidencia re-verificada antes de tocar y confirmada:
      A9 movio 4 puntos de 5,03 a 8,05px de diametro y desplazo la polilinea de los 4
      sparks, y `pnpm e2e` habia pasado **8/8 en verde sin tocar una sola baseline** —
      81 a 184 pixeles distintos por captura contra un presupuesto de 400.
      🔴 **El presupuesto tapaba el defecto Y ADEMAS impedia refrescar la baseline.** En
      Playwright 1.61 `--update-snapshots` a secas es modo `changed`: solo reescribe lo que
      FALLA. Como el diff caia dentro de los 400, la primera corrida con el flag dijo
      "8 passed" y **no toco un solo archivo** (mtime intacto). Hizo falta
      `--update-snapshots=all`. O sea que un tope generoso no solo deja pasar la regresion:
      congela las baselines en un estado que ya nadie puede refrescar por el camino normal.
      **El piso se MIDIO, no se estimo.** Con las baselines al dia y `maxDiffPixels: 0`,
      **cuatro corridas limpias seguidas dieron 8/8 verde**: el ruido real entre corridas
      es **cero**. Y el flap de alto 1840↔1839 que este mismo item daba por razon para no
      bajar a 0 **no es un obstaculo**: aparece DENTRO del bucle de estabilizacion de
      `toHaveScreenshot` (se ve en las lineas "Expected an image 1440px by 1840px, received
      1440px by 1839px" que preceden a la comparacion final) y Playwright lo absorbe
      recapturando hasta que dos capturas seguidas coinciden. Ademas un alto distinto es un
      **size mismatch**, que ningun presupuesto de pixeles tapa: subir el tope nunca lo
      habria protegido.
      **Queda en 20**, no en 0: deja aire para el antialiasing de un Chromium futuro y sigue
      **4x por debajo** del defecto real mas chico jamas medido aca (81px). Un gate que da
      rojo por ruido se termina ignorando — es la leccion que ya esta escrita en
      `playwright.config.ts`.
      **Gate verificado MUTANDO**, como pide W6: con `dotR` de vuelta en 3 (el estado
      pre-A9, exactamente el defecto que el tope viejo se trago) el gate cae **8/8** con
      585 a 1256 pixeles distintos por captura. Con 400 ese mismo cambio pasaba en verde.
      **Baselines regeneradas y MIRADAS** (no refrescadas a ciegas): demo 1440 claro — las
      3 fuentes de W7 cargadas, medidor, donut con total al centro, los 4 sparks con su
      punto redondo, tabla y panel de IA completos, 0 secciones en `opacity:0`; borde 1440
      oscuro — negativo bajo el cero, el cero, las 90 barras dentro del viewBox, gauge en
      0% sin arco, skeleton, error con Reintentar y los dos vacios.
      **Gates**: `typecheck:packages` verde, `pnpm test` **269/269**, `pnpm e2e` **103
      pasados / 0 fallados / 7 skipped**, y tres corridas limpias del gate visual con el
      tope nuevo.
      **Leccion: un presupuesto sobre una captura fullPage no protege un defecto
      LOCALIZADO.** W6 lo validó contra `PAD_L` 34→44, que corre TODO el plot y gasta miles
      de pixeles; el tope quedo calibrado para esa clase de cambio y ciego a la otra. El
      numero correcto no sale de estimar cuanto ruido "deberia" haber: sale de poner el tope
      en 0, contar el ruido real y dejar margen sobre ESE numero.

- [x] **AUD7 · Auditar W3/W4/W5 y cazar la primera nota VENCIDA del carril** (2026-09-01).
      Séptima vuelta de escalón 2 (A y B siguen todos `[x]`). **Por qué estos tres**: AUD1–AUD6
      auditaron W1, W2, A1a, AUD4, B1, B2, B3 y S1 — **W3, W4 y W5 nunca los miró nadie**, y
      son los tres ítems que más código tocaron.
      **Los tres ciertos contra el disco de hoy**: W3 → `chartScale`/`niceMax`/`formatTick`
      existen (`dashboard.ts:566,575,596`) y de los `Math.max(...,0)` que quedan **ninguno es
      el bug**: son guardas de conteo, el clamp 0-100 de la barra de progreso (`:452`, el que
      W3 dijo dejar) y topes de radio ✔ · W4 → medidor `radial` vivo, marcadores en `r="4"`,
      **una sola** regla `:focus-visible` sobre `a`/`button` (`:1616`) y 5 usos de `44px` ✔ ·
      W5 → `DashboardEstado = "cargando" | "error"` (`:48`) con `aria-busy` cableado y el Zod
      declarándolo ✔. **Ninguna se desmarca.**
      🔴 **Lo que sí estaba podrido era una nota al pie, no un `[x]`.** W4 cerró anotando "el
      sparkline del KPI **sigue** con `preserveAspectRatio='none'`" — y hoy es falso: A6 lo
      pasó a `xMidYMid meet` y `dashboard.test.ts:382` lo guarda para todo el panel. Tachada
      arriba. Es la forma de fantasma nº1 de la REGLA DE EVIDENCIA ("arreglado y no tachado"),
      **la primera que se caza en este carril**, y explica por qué el loop parece sin
      combustible teniendo trabajo: las notas al pie no son ítems, así que ni se cierran
      cuando se arreglan ni se pueden tomar cuando siguen vivas. Por eso la otra nota —el
      `r=3` del KPI spark, que **sí** sigue siendo cierta— se promovió a **A9**.
      🔴 **Defecto de infraestructura que seis auditorías no vieron: el worktree estaba en
      HEAD desasociado.** `git rev-parse --abbrev-ref HEAD` devolvía `HEAD` y `git worktree
      list` lo confirmaba (`4d57ac8d (detached HEAD)`), justo en la punta de
      `claude/onia-web-architecture-b37eca`. Al estar en la punta **no se perdió nada**, pero
      el próximo commit habría quedado huérfano fuera de la rama y el push no lo habría
      subido. Reasociado con `git checkout claude/onia-web-architecture-b37eca`.
      **Lección: la regla dura 1 pide la rama y el runbook de salud no la mide.** El punto 2
      compara `origin` contra `HEAD` — y en HEAD desasociado esa comparación da **igual**, así
      que pasa en verde mientras la rama no es la que dice ser. `git branch --show-current`
      devolviendo **vacío** es la señal, y hay que mirarla antes de commitear.
      **Salud, los cuatro puntos**: server 4319 → **200** (no hizo falta relanzarlo); rama
      reasociada y == `origin` (`4d57ac8d`), árbol limpio; `typecheck:packages` verde;
      `pnpm test` **267/267 en 2,8 s**; `pnpm e2e` **103 pasados / 0 fallados / 7 skipped, 0
      flaky** (segunda corrida seguida sin flaky: S1 aguanta). Cero zombies míos — de los 8
      `node.exe` vivos, 6 son del worktree `hero-en-home` (dos `next dev` sobre
      `apps/onia-platform`, 3411 y 3477, con sus hijos: otra mano, zona prohibida) y el único
      de este carril es el `serve-out 4319`.

- [x] **AUD8 · Auditar A9/A10 y estrenar el gate visual apretado desde una sesion limpia**
      (2026-09-02). Octava vuelta de escalon 2 (A y B siguen todos `[x]`). **Por que estos
      dos**: AUD1-AUD7 cubrieron W1-W5, A1a, A2, A3, A5, A7, A8, AUD4, S1, B1, B2 y B3 —
      **A9 y A10 son los unicos `[x]` que nadie habia mirado**, y ademas los mas recientes,
      que es donde una linea todavia no tuvo tiempo de envejecer mal.
      **Los dos ciertos contra el disco de hoy.** A9 → `dotR = 4.8` y `const pad = dotR`
      vivos en `dashboard.ts:988,991`, y sus dos tests existen y son los que decia ser: el
      de tamaño multiplica por la escala medida (`ESCALA_KPI_SPARK = 268.5 / 320`) en vez de
      comparar el `r` pelado, y el segundo comprueba que el circulo no se recorte
      (`cy - r >= 0`, `cx + r <= 320`) ✔ · A10 → `maxDiffPixels: 20` vivo en
      `tests/e2e/visual.spec.ts:81` ✔. **Ninguna se desmarca.**
      **Lo que esta vuelta agrega y A10 no podia dar: la primera corrida del gate apretado
      desde una sesion que no lo escribio.** A10 midio su propio ruido en corridas
      encadenadas y con las baselines recien regeneradas por el mismo proceso — el caso
      facil. Aca el gate corrio en frio, en otra sesion y con otra carga de maquina, y dio
      **8/8 verde sin tocar una sola baseline**. Es la evidencia que faltaba de que el 20 no
      es un numero apretado a la medida de una corrida afortunada.
      **Salud, los cuatro puntos**: server 4319 → **200** (no hizo falta relanzarlo); rama
      `claude/onia-web-architecture-b37eca` — verificada con `git branch --show-current`, la
      señal que AUD7 dejo escrita — al dia con `origin` (`cb47ef40`) y arbol limpio;
      `typecheck:packages` **exit 0**; `pnpm test` **269/269 en 2,8 s** (el mismo numero que
      declara A9); `pnpm e2e` **103 pasados / 0 fallados / 7 skipped**.
      **Cero zombies, y uno que casi lo parece**: los `chrome.exe` vivos son el navegador
      real de Sergio, **no** de Playwright — Playwright corre su propio Chromium desde la
      cache `ms-playwright`, asi que un `taskkill` sobre `chrome.exe` le habria cerrado el
      navegador de trabajo sin arreglar nada. El unico proceso de este carril sigue siendo
      el `serve-out 4319`.

- [x] **AUD9 · El carril esta sin combustible, y la tabla de loops YA lo dice — pero el
      cron de Windows sigue disparando** (2026-09-02). Novena vuelta de escalon 2: `CARRIL A`
      y `CARRIL B` con **cero** `- [ ]` (medido: 36 `[x]`, y los 4 sin marcar viven en
      *Bloqueadas* y *Sin verificar*, que no son cola).
      **El hallazgo nuevo, y es de gobierno, no de codigo.** La version mas reciente de
      `hermes-content/docs/cola/loops.md` (commit `f046236f`, rama `claude/docs-auditoria`,
      escrita por el loop `docs-auditoria` del VPS el 2026-09-02) **ya movio a
      `web-factory-dev-loop` a la tabla "Apagados a proposito — NO rearmar"**, con la misma
      medicion que da esta vuelta y el motivo escrito: *"sin cola, un loop no se planta:
      inventa trabajo... para revivirlo hace falta rellenar `CARRIL A`, no rearmar el cron"*.
      **Pero ese commit no esta en `main`** — `main` todavia lo lista como activo — y la
      tarea de Windows sigue `enabled: true`, `cronExpression 45 * * * *`, con `lastRunAt`
      2026-09-02T07:48Z. O sea: **la decision esta tomada y escrita, y no llego al unico
      lugar que la ejecuta.** Un loop no se apaga a si mismo: queda para Sergio, en
      *Bloqueadas*.
      **Auditoria del unico `[x]` sin mirar (AUD8), en frio y en otra sesion**: sus tres
      numeros se reprodujeron identicos — `typecheck:packages` **exit 0**, `pnpm test`
      **269/269 en 2,77 s**, `pnpm e2e` **103 pasados / 0 fallados / 7 skipped en 1,2 min**,
      y `git status --short` **vacio despues del e2e**, que es la prueba de que el gate paso
      **sin regenerar una sola baseline**. Segunda corrida en frio del tope `maxDiffPixels:
      20` de A10, en otra sesion y otra carga: no se desmarca nada.
      **Salud, los cuatro puntos**: server 4319 → **200**; rama
      `claude/onia-web-architecture-b37eca` al dia con `origin` (`92ab1816`) y arbol limpio;
      typecheck verde; **zombies: ninguno mio**. Los 22 `node.exe` extra que aparecen en la
      maquina son `next dev`/`next start` de los worktrees `hero-en-home` y `web-venta` —
      **otros carriles**, y `apps/onia-platform` esta en los prohibidos de la regla 3: no se
      matan desde aca. Se avisa, no se toca. El unico proceso de este carril sigue siendo el
      `serve-out 4319`.

- [x] **AUD10 · La mitad del bloqueo ya estaba VENCIDA: `main` no lista este loop como
      activo, lo tiene apagado desde el 01-sep** (2026-09-02). Decima vuelta de escalon 2
      (`CARRIL A` y `CARRIL B` con **cero** `- [ ]`; los 4 sin marcar viven en *Bloqueadas*
      y *Sin verificar*, que no son cola).
      **El hallazgo, y corrige a AUD9.** AUD9 escribio que el commit de `docs-auditoria`
      *"no esta en `main`"* y que por eso **`main` todavia lo lista como activo**. La
      segunda mitad es **falsa**, medida hoy: `git show origin/main:hermes-content/docs/cola/loops.md`
      trae a `web-factory-dev-loop` en la tabla **"Apagados a proposito — NO rearmar"**
      (linea 175), con su motivo completo, y esta ahi desde `fe22ac99` (**2026-09-01**).
      Lo unico que a `main` le falta de esa rama es `f046236f`, que corrige la cadencia de
      **`marca-personal`** — otro loop, nada que ver con este.
      **Por que importa**: la opcion (a) del item bloqueado pedia a Sergio DOS actos
      (*"mergear `claude/docs-auditoria` a `main` y poner la tarea en `enabled: false`"*).
      El merge no hace falta: el doc ya lo dice donde tiene que decirlo. **Queda un solo
      acto, y es de un click**: `enabled: false`. Un bloqueo que pide de mas es tan caro
      como uno vencido — le cobra a Sergio trabajo que ya esta hecho. Corregido el item.
      **El bloqueo en si sigue vivo** (re-verificado, no asumido): `list_scheduled_tasks`
      da `web-factory-dev-loop` con `enabled: true`, `cronExpression 45 * * * *`,
      `lastRunAt 2026-09-02T08:48Z`. El cron dispara aunque el doc diga que no deberia.
      **Auditoria del unico `[x]` sin mirar (AUD9), en frio**: sus cuatro numeros de gates
      se reprodujeron identicos — `typecheck:packages` **exit 0**, `pnpm test` **269/269 en
      2,77 s**, `pnpm e2e` **103 pasados / 0 fallados / 7 skipped en 1,2 min**, y
      `git status --short` **vacio despues del e2e** (tercera corrida en frio del tope
      `maxDiffPixels: 20` de A10: no regenera una sola baseline). Lo unico que no
      sobrevivio a la auditoria fue su lectura de `main`, arriba.
      **Salud, los cuatro puntos**: server 4319 → **200**; rama al dia con `origin`
      (`e81d93e7`) y arbol limpio antes y despues del e2e; typecheck verde; **zombies:
      ninguno mio** — los 24 `node.exe` de la maquina son los `next dev/start` de otros
      worktrees, mismo cuadro que midio AUD9. Se avisa, no se toca.

- [x] **AUD11 · La resta de la auditoria CIERRA: no queda un solo `[x]` sin mirar, y por eso
      el escalon 2 tambien se quedo sin combustible** (2026-09-02). Undecima vuelta de escalon 2
      (`CARRIL A` y `CARRIL B` con **cero** `- [ ]`; los 4 sin marcar viven en *Bloqueadas* y
      *Sin verificar*, que no son cola).
      **El hallazgo, y es nuevo porque nadie habia hecho la resta completa.** AUD3 dejo escrita
      la leccion (*"AUD2 se declaro completa sin notar que la resta no cerraba"*) pero nadie la
      volvio a correr entera. Corrida hoy: **33 IDs `[x]`** en A + B + AUD, cruzados uno por uno
      contra la cobertura que declara cada auditoria — AUD1 (A6, W3-W6, T4/T9/T29) · AUD2 (A1a,
      W1a/b/c, W2, W7, A1c, A1d, A4, B1/B2) · AUD3 (A2, A3, A5) · AUD4 (A7, A8) · AUD5 (AUD4) ·
      AUD6 (S1, B1, B2, B3) · AUD7 (W3, W4, W5) · AUD8 (A9, A10) · AUD9 (AUD8) · AUD10 (AUD9).
      **No queda ninguno afuera.** La consecuencia importa mas que el dato: desde AUD9 el unico
      `[x]` sin auditar de cada vuelta **es la auditoria de la vuelta anterior**. El escalon 2
      dejo de auditar el carril y pasa a auditarse a si mismo — tres vueltas seguidas
      reproduciendo los mismos tres numeros. **Eso ya no es una red, es un espejo**, y es la
      medicion que le faltaba al item bloqueado: no es que el escalon 1 este vacio y el 2 aguante,
      es que **los dos** estan vacios.
      **Auditoria del unico `[x]` sin mirar (AUD10), por un camino distinto al suyo**: su hallazgo
      central sobrevive, y se midio sin repetir su comando. `git show origin/main:.../loops.md |
      grep -n web-factory-dev-loop` da la fila en **linea 175** exacta, en la tabla *"Apagados a
      proposito — NO rearmar"*; `git branch -a --contains fe22ac99` lo pone en `origin/main`; y
      `git merge-base --is-ancestor f046236f origin/main` responde **NO**, con
      `git show --stat f046236f` confirmando que ese commit toca `marca-personal` y el radar, no
      este loop. O sea: la correccion de AUD10 a AUD9 es cierta y el merge que el bloqueo le
      pedia a Sergio efectivamente sobra.
      **Gates, en frio y en otra sesion**: `typecheck:packages` **exit 0**; `pnpm test`
      **269/269 en 2,84 s** (30 archivos); `pnpm e2e` **103 pasados / 0 fallados / 7 skipped en
      1,2 min**; `git status --short` **vacio despues del e2e** — cuarta corrida del tope
      `maxDiffPixels: 20` de A10 sin regenerar una sola baseline.
      **Salud, los cuatro puntos**: server 4319 → **200** (no hizo falta relanzarlo); rama
      `claude/onia-web-architecture-b37eca` al dia con `origin` (`1fac7c17`) y arbol limpio antes
      y despues del e2e; typecheck verde; **zombies: ninguno mio** — 24 `node.exe` en la maquina,
      el mismo cuadro de AUD9 y AUD10, son `next dev/start` de otros worktrees. Se avisa, no se toca.

- [x] **AUD12 · El servidor del carril estaba CAIDO — once vueltas de "200" y esta vez daba 000**
      (2026-09-02). Duodecima vuelta de escalon 2 (`CARRIL A` y `CARRIL B` con **cero** `- [ ]`;
      los 4 sin marcar viven en *Bloqueadas* y *Sin verificar*, que no son cola).
      **El hallazgo, y por primera vez en cinco vueltas el runbook de salud hizo trabajo real,
      no verificacion.** `curl` a `http://localhost:4319/dental-amanecer/` devolvio **000**: el
      `serve-out` que AUD8-AUD11 dieron por vivo cuatro vueltas seguidas ya no existia. Se
      relanzo (`node scripts/serve-out.mjs 4319`) y volvio a **200** al primer intento.
      **Por que se cayo, y esa es la leccion**: la maquina paso de **24 `node.exe` / 1.040 MB**
      (el cuadro identico que midieron AUD9, AUD10 y AUD11) a **1 solo `node.exe`** antes de
      relanzar. No murio este proceso: murieron **todos** — los `next dev`/`next start` de
      `hero-en-home` y `web-venta` incluidos. Un barrido de la maquina, no un defecto del carril.
      **Y eso desmiente por accion una nota de tres vueltas**: AUD9/AUD10/AUD11 cerraron con
      "zombies: ninguno mio, los otros son de otros carriles, se avisa y no se toca". Cierto
      entonces; hoy no queda ninguno que avisar. El chequeo 4 quedo en **2 `node.exe` / 83 MB**,
      y uno es el mio.
      **El unico `[x]` sin mirar era AUD11, y su hallazgo central se sostiene**: la resta cierra
      —no queda `[x]` sin auditar— y por eso el escalon 2 se auto-audita. Esta vuelta lo prueba
      al reves: el escalon 2 **no** estaba vacio, lo que estaba vacio era su mitad de auditoria.
      La mitad de salud tenia trabajo esperando y ninguna de las tres vueltas anteriores lo
      podia ver, porque el servidor se cayo despues de la ultima. **Un runbook que da verde once
      veces no es un runbook inutil: es uno que todavia no encontro su falla.**
      **Salud, los cuatro puntos**: 4319 **000 → 200** (remediado, no solo medido); rama
      `claude/onia-web-architecture-b37eca` al dia con `origin` (`97cc6990`) y arbol limpio;
      `typecheck:packages` **exit 0**; zombies **ninguno**. Sin `pnpm e2e`: esta vuelta no toco
      un solo pixel de lo que se dibuja.
      **Bloqueo re-verificado (escalon 0), sigue vivo**: `list_scheduled_tasks` da
      `web-factory-dev-loop` con `enabled: true`, `cron 45 * * * *`, `lastRunAt`
      2026-09-03T01:49Z. Sigue siendo un acto de un click, de Sergio.

## Cerrado — carril B (análisis)

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

## Cómo se rellena esta cola

⚠️ **Reescrito el 2026-09-01.** Acá decía que un "cron de tareas (5 min)" tiraba del carril A,
que un "cron de análisis (10 min)" hacía salud + reordenaba + refill, y que entre los dos el
loop "nunca se queda sin tarea". **Los dos crons son inventados.** Medido contra las dos
fuentes vivas (`list_scheduled_tasks` en Windows y `crontab -l` en el VPS):

| quién | dónde | cuándo | qué hace |
|---|---|---|---|
| `web-factory-dev-loop` | Windows | `45 * * * *` (La Paz) | **Consume**: la primera de `## Ahora`, más la salud de arriba |
| `canario-visual` | VPS | `41 4,10,16,22` UTC | **Produce**: abre las pantallas de cliente, las MIRA, y cada diferencia se vuelve ítem del carril dueño |
| `web-factory-salud` | Windows | `21 * * * *` | **DESHABILITADO** desde el 2026-09-01 02:29 — por eso el runbook de salud lo corre ahora el dev-loop |

La lista viva está en `hermes-content/docs/cola/loops.md`, que es su fuente de verdad.

**Si `## Ahora` se vacía, el loop NO inventa una tarea.** Avisa por Telegram y se va. Una cola
corta y cierta vale más que una larga y falsa: en la pasada del 2026-09-01, **7 de los 11**
pendientes que este carril declaraba resultaron ser trabajo ya hecho o inexistente, y en el
carril de plataforma fueron **4 de 6**. El refill lo trae `canario-visual` con una pantalla
mirada, o lo escribe una sesión de control con evidencia.

**El espejo del trabajo fantasma** (hallazgo del 2026-08-31, confirmado hoy): el modo de falla
más caro de esta cola no es trabajo inventado que no existe — es **trabajo real que se evapora
al escribirlo dentro del texto de un ítem ya cerrado**. Cinco de los siete ítems de `## Ahora`
salieron de ahí: vivían como "Anotado, NO tocado" o "Pendientes anotados" bajo un `[x]`, donde
ningún loop los podía leer como tarea. **Regla: lo que no se hizo no se anota en el ítem que se
cierra; se abre como línea propia en `## Ahora` antes de marcar el `[x]`.**

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
