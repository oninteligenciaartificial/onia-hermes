# Fable 5 vs GPT 5.6 Sol — la misma landing 3D de producto, y el patrón que se roba

- **Fuente:** https://www.instagram.com/p/DbBUMU2qjfW/
- **Tipo:** MIXTO (WEB primario · MARKETING secundario)
- **Veredicto:** SIRVE YA
- **Cobertura:** 15/15 fotogramas base + 20/40 texto_*. Gemini nativo NO disponible (429, cuota agotada, archivo en 0 bytes). Audio NO verificado — solo tuve fotogramas.

## Qué muestra, textual

**Caption (ruso, literal):**

> Что думаете? Мой фаворит Fable 5, дизайн чище, а модель очень близка к референсу, что важно для презентации продукта. И она гораздо ближе к построенной мной руками, только я потратил несколько часов, а Fable 50 минут. На доработку тоже уйдет время, но пару часов экономии тоже не плохо.😁
>
> #fable5 #gpt56 #ииагенты #ии #вайбкодинг

**Rótulos en pantalla:** `Fable 5 vs GPT 5.6 Sol` (portada) · `Fable 5` · `GPT 5.6 Sol`

**Terminal, panel izquierdo — literal (ruso):**

> Готово — полноценный RU/EN лендинг DIAL собран в текущей папке.
> Реализовано:
> - Next.js 16 App Router + TypeScript + next-intl.
> - Scroll-driven R3F-сцена с независимыми кольцами, AMOLED UI, накатным, голосовой волной, LED и физичным exploded view.
> - GSAP ScrollTrigger + Lenis.
> - Mobile, слабые устройства, Save-Data и reduced-motion fallback.
> - Neon waitlist с валидацией, honeypot, server-side rate limit и защитой origin/body-size.
> - Адаптив, локализованные metadata, sitemap, robots, favicon и доступность.
> - Инженерная спецификация модели и контрольных сечений: design/3d/model-spec.md.
>
> Проверки прошли: `npm run typecheck` · `npm run lint` · `npm test` · `npm run build` · Desktop GPU и static fallback QA · Mobile 390×844, RU/EN, форма и reduced-motion · Lighthouse desktop performance: 100, LCP 0.7 s, CLS 0.001
>
> Основные файлы: `src/components/ProductPage.tsx` · `src/components/scene/DialModel.tsx` · `src/app/api/waitlist/route.ts` · `db/001_waitlist.sql` · `README.md`
>
> Worked for 51m 19s

Línea de estado del shell: `gpt-5.6-sol xhigh · ~/Documents/Work/AIProjects/dial_site/gpt5_6_sol`

**Terminal, panel derecho — literal (ruso, abreviado a lo que importa):**

> Деградация: мобильные, prefers-reduced-motion, слабые устройства и software WebGL получают статичные рендеры (снятые с реальной сцены, 55-70 КБ вебп) с раскладкой «текст сверху, устройство снизу».
>
> Как проверялось
> - Ресерч-агент разобрал oryzo.ai (41 скриншот) — оттуда пейсинг, scrub-демпфирование, «устройство закреплено — мир меняется», окклюзия текста.
> - Дизайн-ревью (агент-«арт-директор»): устранены все CRITICAL — коллизии текста с устройством в hero/press/CTA/футере…
> - QA-агент: 8/8 тестов PASS (консоль чистая, смена локали mid-page, клавиатура/skip-link, форма, rate limit 429, back/forward, resize).
> - Код-ревью: … сброс singleton-состояния сцены при смене локали, утечку ScrollTrigger'ов, вечный прелоадер при падении WebGL (теперь fail-safe на статику), dispose ресурсов three.js.
> - Lighthouse (desktop, prod): Performance 99, Accessibility 100, Best Practices 100, SEO 100.
>
> Cogitated for 59m 30s

Este panel corre en Claude Code (`bypass permissions on (shift+tab to cycle)`) y uno de sus comandos escribe una nota de memoria que referencia `dial_site/fable5`.

**Copy de la landing (inglés, literal):** `DIAL — One dial. Every agent.` · `A desk controller for your AI agents.` · `Twist to pick an agent or workflow.` · `The lower ring scrolls your saved prompts.` · `Press to launch. Hold to dictate.` · `One glance: thinking, waiting, or done.` · `Every layer earns its place.` · `Your AI stack, on the desk.` · `Put your agents within reach.` · `from $179` · `No payment. Occasional product updates only.`

Etiquetas del exploded view: `Far-field microphone` · `Round AMOLED, 466 × 466` · `CNC aluminum knob, push-encoder` · `Guide flange in a machined groove` · `Prompt ring, 24 detents` · `Weighted base, USB-C` · `RGB status light`

## Como está hecho — la reconstrucción

Dos agentes reciben el MISMO brief (una landing de producto para un dial físico llamado DIAL) y se les cronometra con el Stopwatch de macOS en el monitor de atrás. Después se scrollean las dos landings lado a lado. El mecanismo de la página — que es lo que vale — está escrito en el terminal, no hay que adivinarlo:

**1. Canvas WebGL fijado + paneles de texto scrolleando encima.** El principio está nombrado literal: «устройство закреплено — мир меняется» (el dispositivo está fijo, el mundo cambia). El dial no se mueve de su sitio; lo que entra y sale son los bloques de texto y el color de fondo. Es `ScrollTrigger.pin` sobre el contenedor del canvas, no una animación por sección.

**2. Scrub amortiguado, no scrub duro.** «scrub-демпфирование» — o sea `scrub: <número>` en ScrollTrigger, no `scrub: true`. El 3D va un pelo detrás del scroll. Sumado a **Lenis** para el smooth scroll. Esa mezcla es la que produce la sensación "cara" y no el modelo 3D en sí.

**3. Exploded view scrubbeada capa por capa.** Comparando `texto_014_01/03` (ensamblado) con `texto_014_05` (explotado): cada malla se separa sobre un eje vertical en función del progreso del scroll. A la derecha, un riel numerado `01 AMOLED + glass` / `02 Perforated sleeve` / `03 Dual encoder stack` / `04 Main board` / `05 Weighted base`, cada uno con filete hairline y bajada de 2 líneas. La versión Fable 5 lo resuelve distinto: líneas guía tipo plano técnico saliendo del producto hacia etiquetas sueltas.

**4. Un modelo, muchos estados.** La cara AMOLED renderiza una UI distinta por sección: arco naranja de dial, onda de voz con `LISTENING`, tick verde de `Done`, prompt `> Clean my inbox`. No son cuatro imágenes: es el mismo mesh con la textura de pantalla cambiando por sección.

**5. La escalera de degradación — esto es lo que resuelve el bloqueo histórico.** Móvil, `prefers-reduced-motion`, dispositivos débiles y WebGL por software reciben **rénders estáticos capturados de la escena real, 55-70 KB en WebP**, con la maquetación reordenada a «texto arriba, dispositivo abajo». No es un fallback pobre: es la misma escena, congelada. Resultado reportado en pantalla: Lighthouse desktop 100, LCP 0.7 s, CLS 0.001.

**6. Los bugs de producción que nombran (y que se van a repetir).** Reset del estado singleton de la escena al cambiar de idioma; fuga de ScrollTriggers; preloader eterno si WebGL cae (ahora fail-safe a estático); `dispose()` de recursos de three.js. Y la colisión de texto contra el dispositivo en hero/press/CTA/footer, clasificada CRITICAL por un agente "director de arte".

**7. El método de investigación, que es copiable tal cual.** Un agente de research desarmó `oryzo.ai` con **41 capturas** y de ahí sacó el pacing, el amortiguado del scrub, el principio de "dispositivo fijo" y el tratamiento de oclusión de texto. Después: agente director de arte → agente QA (8/8) → code review. Cuatro roles, no un solo prompt.

**El molde MARKETING, aparte.** El formato del reel es reutilizable y no depende del 3D: mismo brief → dos modelos → cronómetro FÍSICO visible en cámara → se scrollean los dos resultados → el caption abre con pregunta de opinión («Что думаете?»), después el autor SE MOJA con un favorito y da la razón concreta ("diseño más limpio, el modelo 3D más cerca de la referencia"), y recién ahí suelta el número que duele: "yo tardé varias horas a mano, esto 50 minutos". Pide opinión pero da la suya primero — por eso no se lee como cebo de comentarios.

## El estilo, como conocimiento portable

**Tipografía.** Titular en grotesca pesada de display (aparenta Helvetica Now Display / Inter Tight Bold), 2-3 líneas, interlineado apretadísimo (~0.95), sentence case y **punto final** — el punto es parte del tono. Encima, un *eyebrow* diminuto en color ladrillo (`The knob`, `Lower ring`, `Press & hold`, `Ambient status`, `Built, not styled`, `First edition`). Cuerpo en gris claro, 2-3 líneas, nunca más. Pie de sección en micro-tipografía gris con separadores de punto medio (`Space-gray anodized aluminum · AMOLED · precision POM bearings`). Los rótulos del reel: grotesca blanca medium, sin sombra, plantada sobre el monitor.

**Paleta (hex aproximados — leídos de un jpg comprimido de una pantalla filmada, no muestreados del origen).** Papel `#F4F4F2` · tinta `#111111` · cuerpo `#6B6B6B` · eyebrow ladrillo `#B5514B` · naranja acento (arco del dial, onda, LED) `#E8641E` · verde estado `#3DD68C` · sección oscura `#0A0A0A` · wordmark de marca de agua `#E5E5E3`. El naranja aparece SOLO dentro de la pantalla del producto y en el CTA final: es color semántico, no decorativo.

**Composición.** Dos columnas alternadas texto/producto que van rotando de lado sección a sección. Producto ~55% del ancho, texto ~35%, el resto aire. Nav mínima: wordmark a la izquierda, toggle EN/RU + píldora negra `Join the waitlist` a la derecha. Hero con el wordmark `DIAL` gigante en marca de agua detrás del dispositivo y el titular cruzándolo por abajo. La variante GPT suma un riel numerado a la derecha con filetes hairline.

**Ritmo de corte.** ~30 s en 4 bloques macro: portada con render limpio (0-2 s) → terminal con el veredicto (2-8 s) → landing Fable 5 scrolleada (8-18 s) → landing GPT 5.6 Sol scrolleada (18-30 s). Corte cada ~6-8 s, lento para un reel: dentro de cada bloque no hay cortes, el movimiento es el scroll de una mano real en el trackpad.

**Motion.** Todo el movimiento nace del scroll: scrub amortiguado, exploded view separándose por capas sobre eje vertical, crossfade de fondo claro↔oscuro entre secciones (se ve el solape a media transición en `texto_012_01` y `texto_011_08`), y la cara AMOLED cambiando de estado. Cero animación en loop, cero "respiración" ociosa — nada se mueve si no lo movés vos.

**Textura y atmósfera.** Escritorio real de cartón/madera cálida, Lego naranja desenfocado al fondo, MacBook Pro 14" con teclado ruso, y un monitor externo con wallpaper azul-teal de macOS que hace de retroluz fría contra el escritorio cálido. Grano de cámara de teléfono, sin filtros ni grading. El cronómetro físico en cámara es el recurso de credibilidad: no es un número escrito en post, es un reloj corriendo.

**Tratamiento del texto en pantalla.** Los rótulos del reel no tienen caja ni contorno: blanco puro apoyado sobre la zona oscura del monitor, que actúa de fondo natural.

**Se porta a:** `web-factory/docs/MOTION_PATTERN_BANK_2026.md` (patrón nuevo: canvas fijado + scrub amortiguado + escalera de degradación), `hermes-content/references/ui-patterns/` (patrón nuevo: exploded view anotada + riel numerado de specs) y `web-factory/docs/ANATOMIA_DE_UNA_WEB.md` (la secuencia de secciones y el sistema eyebrow/titular/bajada).

## Las tres preguntas

1. **Frente:** **web-factory** (carril de webs) como principal — el patrón de scroll y el sistema tipográfico. Secundario: **marketing / motor de contenido**, por el molde del benchmark cronometrado, que sirve para nuestras propias piezas sin tocar 3D.

2. **Herramienta nuestra:** `image-to-code` para portar las secciones desde estos mismos fotogramas; skills `gsap-scrolltrigger` + `gsap-core` para el pin y el scrub amortiguado (el mecanismo exacto que muestra el video ya está cubierto por skills que tenemos); `MOTION_PATTERN_BANK_2026.md` como destino del patrón; `impeccable` / `ui-ux-pro-max` para el pase de diseño. **Hueco real: no tenemos ninguna skill de R3F / three.js / 3D en web.** Si algún día queremos el 3D de verdad y no una simulación 2D, eso hay que crearlo — decirlo es parte del resultado.

3. **Qué falta:** **para el patrón portable, nada** — el sticky + scrub + estados por sección + la escalera de degradación se ejecutan hoy con GSAP y sprites/vídeo, sin 3D y sin credenciales. Lo que falta es solo para la versión 3D literal: (a) decidir si abrimos el frente R3F, que no tenemos skill y ningún cliente actual pide (vendemos a clínicas, comercio e importadoras, no a fabricantes de hardware); (b) un modelo 3D del producto, que ninguno de nuestros clientes tiene. **No hace falta pedirle nada a Sergio para lo primero.**

## Lo que NO se puede afirmar

- **Objecion del critico del lote (2026-08-23):** nombrar **Lenis**, **WebGL** y **ScrollTrigger.pin** con `scrub` numerico es RECONSTRUCCION vendida como lectura: no hay DOM, ni bundle, ni caption que lo diga. Se sostiene el MECANISMO (canvas fijado + scrub amortiguado); no se sostienen los nombres de libreria.
- El audio SI quedo verificado despues de escribir la ficha: **0 palabras en 30,1 s** — la pista no tiene voz.

- **Qué es "Fable 5".** El post no lo dice. Aparece como rótulo y como hashtag `#fable5`. NO-VERIFICADO si es un modelo, un producto o un alias, y NO-VERIFICADO si tenemos acceso.
- **Qué panel corresponde a qué modelo, con certeza.** El panel izquierdo dice `Worked for 51m 19s` y su shell muestra `gpt-5.6-sol xhigh` en `dial_site/gpt5_6_sol`; el derecho corre en Claude Code, dice `Cogitated for 59m 30s` y escribe una nota que referencia `dial_site/fable5`. Pero **el caption dice que Fable tardó 50 minutos, y eso no coincide exactamente con ninguna de las dos cifras del terminal.** No declaro ganador por tiempo.
- **Qué mide el cronómetro.** Queda congelado en `1:00:53,10` durante toda la demo. No se dice si cronometra una corrida, la otra, o la sesión entera.
- **Las tipografías.** No se nombran en ningún lado. Lo que digo es lectura a ojo.
- **Los hex.** Aproximados de un jpg comprimido de una pantalla filmada con teléfono. No están muestreados del código fuente.
- **Los números de Lighthouse (100 / 99 / LCP 0.7 s / CLS 0.001) y el 8/8 de QA** son autorreporte del agente impreso en su propia salida. Nadie los verificó de forma independiente, ni yo.
- **Si alguno de los dos sitios se llegó a publicar.** Los dos corren en `localhost` en Safari. El propio texto dice que falta conectar Neon y rellenar `MAKER_URL` antes de publicar.
- **Si DIAL es un producto real** o un brief inventado para el benchmark.
- **`oryzo.ai`** — citado como referencia analizada con 41 capturas. No lo abrí ni lo verifiqué.
- **Si hay voz.** Solo tuve fotogramas; Gemini falló por cuota. El formato sugiere música sin voz, pero no lo escuché.
