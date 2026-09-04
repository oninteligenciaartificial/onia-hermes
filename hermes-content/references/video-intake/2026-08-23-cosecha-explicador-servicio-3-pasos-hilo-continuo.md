# Explicador de servicio en 3 pasos con hilo continuo

- **Fuente:** https://www.instagram.com/p/Dax0R-atz8d/ · @metromedia.house
- **Tipo:** MIXTO (MARKETING dominante — el molde del explicador de servicio — con una capa de motion/WEB que vale por separado)
- **Veredicto:** SIRVE YA
- **Cobertura:** 70 de 70 fotogramas leídos (30 `base_*` cada 2 s + 40 `texto_*` en 5 racimos densos: ~2 s, ~20 s, ~26 s, ~48 s, ~54 s). Caption completo. **No leído: el audio** — Speaches falló para los 26 del lote, así que el texto en pantalla y el caption son las únicas fuentes de contenido. Cuatro láminas quedaron cortadas a mitad de palabra por dónde cayó el muestreo.

---

## Que muestra, textual

**Texto quemado en pantalla, en orden de aparición (verbatim; `___` = cortado por el muestreo):**

- `Going viral with your` / **`LAUNCH`**
- `might be the` / `might be the worst thing`
- `that happens` / `that happens to` / `that happens to your startup`
- `it tric___`
- `when all you had was a`
- `Distribution`
- `that actually want distribution that compounds.`
- `Step 1` · **`Build Owned Channels`**
- `we build` / **`dedicated accounts`** / `in your niche that post daily`
- `where your` **`buyers`** `actually scroll`
- **`2 Million`**
- `12,005` / `impressions` / `@orbitz.creatives`
- `Step 2` · **`Make the Founder Magnetic`**
- `Generic thought leader` / `that sounds like every other`
- **`we don't`** `touch that`
- `we write about the` / **`exact problems`**
- `in a voice`
- (bandeja de DMs) `Primary` `General` `Requests >` — `vincou4e: How do you know my situation?` · `sonicvideo: Bro how tf do u know my situation?` · `champagnepapi`
- `One founder went from` / **`400`** → **`11,000`** `followers` `in 90 ___`
- `VPs now DM him`
- `Step 3` · **`Remove you from`** `the ___`
- `spending` `on` `hours`
- **`30`** `minute` `call`
- **`That's`** `it`
- (post-its en corcho) `Posting` · `Scripts` · `Strate___`
- (respaldo de silla) `Tech Companies`
- **`Link in Bio`**

**Caption, verbatim:**

> one viral launch video has killed more startup content strategies than bad products ever have.
>
> it gives founders just enough validation to stop building distribution.
>
> then six months later they're back to posting into the void, hoping lightning strikes twice.
>
> the goal is never to go viral.
>
> it is to make sure your next customer always knows where to find you.
>
> #startups #founder #launch

---

## Como esta hecho — la reconstruccion

### El molde de guion (MARKETING) — 5 bloques, medidos

| Bloque | Ventana | Cortes | Qué hace |
|---|---|---|---|
| Gancho contrarian | 0–7,47 s | **15** (2,0/s) | Afirma lo contrario de lo esperado ("volverse viral con tu lanzamiento **es lo peor** que le puede pasar a tu startup") sobre una ráfaga de archivo prestado |
| Diagnóstico | 7,47–19,64 s | 3 | Dos mesetas largas sin corte (5,00 s y 4,46 s) donde se explica el problema: `Distribution` que compone |
| Método, 3 pasos | 19,64–49,63 s | 22 | `Step 1 Build Owned Channels` → `Step 2 Make the Founder Magnetic` → `Step 3 Remove you from the ___` |
| Prueba | intercalada | — | Cifras de cliente + capturas de DM reales, siempre pegadas al paso que acaban de explicar |
| Oferta + CTA | 49,63–60,857 s | 8 | `30 minute call` → `That's it` → grid de contenido producido → **`Link in Bio`** |

Tres cosas del molde que no son obvias:

1. **La prueba nunca va junta al final.** Cada paso trae su propia evidencia inmediatamente después (`Step 1` → `2 Million` / `12,005 impressions`; `Step 2` → los DMs `How do you know my situation?` y `400 → 11,000 followers`). No hay una sección de "resultados": la prueba está soldada a la promesa que acaba de hacerse.
2. **La objeción se nombra y se mata en pantalla.** `Generic thought leader / that sounds like every other` → **`we don't touch that`**. Es una lámina entera dedicada a decir qué NO hacen.
3. **La venta es descarga de trabajo, no resultado.** El `Step 3` es literalmente sacar al fundador del proceso: `spending hours on` → `30 minute call` → `That's it`, y el corcho con `Posting` / `Scripts` / `Strate___` es la lista de lo que dejás de hacer. El cierre no promete métricas: promete no tener que ocuparse.

El caption hace un trabajo distinto al video: el video vende el servicio, el caption vende la **tesis** ("the goal is never to go viral") sin mencionar el servicio ni una vez. El pitch vive en el video; el caption es el que se comparte.

### El mecanismo de motion (la parte que se copia tal cual)

**1. Subtítulo palabra-por-palabra con la línea pre-maquetada.** La línea completa ya está compuesta y las palabras ocupan su posición final desde el primer fotograma; lo que cambia es su opacidad. Verificado en `texto_002_03/04/05`: `that happens` → `that happens to` → `that happens to your startup`, y las palabras que ya estaban **no se mueven** al aparecer las siguientes. No es texto que se va agregando (habría reflow): es una línea flex fija donde cada `<span>` pasa de invisible a visible. Eso es lo que produce los huecos grandes e irregulares entre palabras — son el espacio reservado de lo que todavía no se dijo.

**2. La palabra siguiente pre-pintada en gris.** En varias láminas la palabra que aún no se pronuncia ya está visible, pero en gris/azul claro, y "se enciende" a blanco al decirse. Cuatro casos confirmados:
- `we don't` (blanco) + `touch that` (gris) — `base_016`
- `Make the Founder` (blanco) + `Magnetic` (gris) → un fotograma después, todo blanco — `texto_014_03` vs `_04`
- `12,00` (blanco) + `5` (gris) — contador que rueda, `base_012`
- `Remove you from` (blanco) + `the` (gris) — `base_023`

Ojo: en `base_006` (`that actually want distribution that compounds.`) los grises están **intercalados** en el medio de la frase, no al final. Ahí el mismo recurso ya no marca progresión sino **jerarquía**: apaga las palabras de relleno para que salte la que importa. El sistema se usa para las dos cosas.

**3. El hilo blanco continuo que cose los tres pasos.** Una curva bezier blanca de 2-3 px que entra por abajo-izquierda de la lámina azul, sube y termina justo en la píldora `Step N`. En `texto_014_01` se ve el hilo **dibujándose** (stroke parcial, la punta suelta a media pantalla) antes de que llegue el título — o sea, el trazo se anima, no aparece. Y reaparece con la misma curvatura y el mismo punto de salida en `Step 1`, `Step 2` y `Step 3`, así que las tres láminas —separadas por 20-25 s de archivo prestado— leen como **un solo trazo continuo** que atraviesa el video entero. Es el pegamento que hace que no parezca una pila de diapositivas.

**4. El collage que se arma pieza por pieza.** En el racimo `texto_014` se cuentan 2 recortes → 4 → 5 → 5 asentados, cada uno entrando con rotación leve y sombra suave, escalonados en Z. El título termina de escribirse antes de que el último recorte aterrice.

**5. El corte-parpadeo de 2 fotogramas.** Cuatro cortes en 0,29 s (6,05 / 6,13 / 6,21 / 6,34) — a 29,97 fps eso son planos de 2 a 4 fotogramas. No es un error de detección: es un acento percusivo, casi seguro pegado a un golpe de música. Aparece una sola vez, dentro de la ráfaga de apertura.

**6. Tres "mundos" visuales que se alternan y nunca se mezclan.** (a) lámina azul de marca con hilo y collage; (b) archivo prestado a pantalla completa, con grano y letterbox negro; (c) lámina blanca de "papel" con grilla milimetrada. El azul es el único que lleva marca. El video nunca pone marca sobre el archivo prestado — el archivo se usa crudo, el subtítulo blanco es lo único que lo cruza.

**Insumos: material de terceros, sin licencia declarada.** Reconocibles: *The Social Network*, archivo de Amazon de los 90 (Bezos), entrevista temprana de Elon Musk, fundadores de Airbnb, Marc Benioff en escenario, keynote de Steve Jobs, *The Office* (Michael Scott, la lámina final del CTA), *Bruce Almighty*. Más UGC ajeno de creadores (`@rpn`, `@kravebeauty`, `@orbitz.creatives`, `@grambofun`). Nada de esto se declara y no se dice de dónde salió.

---

## El estilo, como conocimiento portable

**Tipografía.** Una sola familia grotesca de palo seco en todo el video, muy cercana a una Helvetica Now Display / Neue Haas Grotesk (**inferido — el tipo nunca se nombra en pantalla**). Dos pesos conviven dentro de la misma línea: Bold/Black para la palabra que carga el sentido, Regular/Medium para el resto (`we build` fino + **`dedicated accounts`** grueso). Tracking cerrado y negativo en los titulares grandes (`2 Million`, `buyers`, `400`). Cero serif. Las píldoras `Step 1/2/3` son el único elemento con contorno en todo el video: borde de 1 px, radio completo, texto chico en Regular.

**Paleta (hex APROXIMADO — leídos de JPG comprimido en pantalla, no de un archivo de diseño; pueden desviarse).**
- Azul ultramar de fondo `≈ #1436C8`, con halo radial más claro al centro `≈ #2A4FE0` y viñeta oscura en los bordes
- Blanco puro `#FFFFFF` para el texto activo
- Gris del "todavía no dicho" `≈ #B9C6EE` (blanco al ~45 % sobre el azul)
- Negro de las láminas de contraste `≈ #0A0A0A`
- Blanco roto de las láminas "papel" `≈ #F2F2F0` con grilla milimetrada `≈ #D8D8D6`
- **Un único acento fuera de sistema**: el anillo de progreso magenta→violeta `≈ #C026D3 → #7C3AED` en la lámina de impresiones. Aparece una vez, sobre negro, y es lo único cromático del video.

**Composición.** Centrada y simétrica en las láminas azules (título arriba con la píldora encima, collage al medio, hilo entrando por abajo-izquierda). Los recortes PNG se pegan con sombra suave y 2-5° de rotación, escalonados en profundidad. En el archivo prestado el subtítulo va a media altura, nunca abajo — cruza la cara del sujeto a propósito.

**Ritmo (MEDIDO, no estimado).** 48 cortes en 60,857 s → 49 planos, 0,79 cortes/s de promedio. Pero el promedio miente: **32 de los 49 planos (65 %) duran menos de 1 s**, y el peso está repartido así:
- ráfaga de apertura: 15 cortes en 7,47 s (2,0/s), con un parpadeo de 4 cortes en 0,29 s
- dos mesetas de explicación sin ningún corte: **5,22 s** (36,66→41,88) y **5,00 s** (7,47→12,47)
- cierre acelerado: 16 cortes en los últimos 15 s
- cola del CTA: **3,93 s sin corte** (56,93 → fin), uno de los cuatro planos más largos del video

La regla que se saca: cortar rapidísimo para retener, parar en seco para explicar, acelerar para cerrar, y **dejar el CTA quieto**.

**Motion.** Subtítulo por palabra sobre línea pre-maquetada (sin reflow) · palabra futura pre-pintada en gris que se enciende · hilo bezier que se dibuja (stroke-dashoffset) y cruza escenas · collage que se ensambla pieza por pieza · contador numérico que rueda · zoom lento con motion blur direccional sobre el archivo · corte-parpadeo de 2 fotogramas como acento.

**Textura.** Grano y compresión deliberada en el archivo (se ve VHS y YouTube 360p sin limpiar), letterbox negro cuando el archivo es 16:9 dentro de la lámina, grilla milimetrada tenue en las láminas blancas, viñeta suave en el azul. Nada está "limpio": la suciedad del archivo es contraste contra la limpieza absoluta de la lámina de marca.

**Se porta a:**
- `web-factory/docs/MOTION_PATTERN_BANK_2026.md` → el **hilo bezier continuo entre escenas** (patrón de costura de escenas) y el **corte-parpadeo de 2 fotogramas**
- Skills `hyperframes-core` / `hyperframes-animation` → las láminas azules, el hilo y el collage son CSS+SVG puro; es exactamente lo que HyperFrames renderiza
- Skill `captions-overlay` / `editor-videos` → el **subtítulo con palabra futura en gris sobre línea pre-maquetada**. Hay que **verificar si ya lo soporta**: no lo comprobé en esta sesión, y el modo karaoke habitual pinta solo la palabra activa sin mostrar la línea entera por delante
- Skill `motion-doctrine` + `seam-craft` → el hilo continuo es, literalmente, un "elemento portador" que sobrevive a la costura entre escenas; el video es un caso de estudio de eso

---

## Las tres preguntas

1. **Frente:** dos, y en este orden. **(a) EDITOR DE VIDEOS** — construir la plantilla reutilizable de "3 láminas de paso con hilo continuo + subtítulo palabra-a-palabra" en HyperFrames, que después sirve para cualquier explicador de Onia. **(b) MARKETING** — portar el molde de guion de 5 bloques al explicador de la plataforma. Roza también **web-factory**, pero solo por el patrón de motion, no por el contenido.

2. **Herramienta nuestra:** **HyperFrames** (motor HTML→MP4, ya instalado y probado en el VPS) para las láminas, el hilo (SVG `stroke-dashoffset`) y el collage. Skill `editor-videos` + `captions-overlay` para el subtítulo quemado. `motion-doctrine`/`seam-craft` para que los tres pasos lean como un solo movimiento. **Para el archivo prestado NO tenemos equivalente y no deberíamos tenerlo**: ese material es de terceros sin licencia declarada, y en su lugar van capturas de nuestro propio producto vivo.

3. **Qué falta:** no falta ninguna credencial ni permiso ni gasto — HyperFrames ya corre. Faltan **dos decisiones**:
   - **Con qué se llenan los tres huecos de prueba.** El molde apoya todo su peso en cifras de cliente (`400 → 11,000`, `12,005 impressions`, `VPs now DM him`, capturas de DM). Onia tiene **cero clientes pagando** y la regla "no fabricar" prohíbe inventar eso. Los tres slots quedan vacíos: hay que decidir si se llenan con **demo del producto en vivo** (pantallas reales de onia-platform, que sí existen y son verificables) o si el molde se recorta a 4 bloques. Esto lo decide Sergio, no la sesión de edición.
   - **Formato.** El original es 16:9 (1276×718). Nuestro carril de reels es vertical. Hay que decidir si la plantilla nace 9:16, 16:9, o las dos.
   - Y una regla que se hereda del post: el CTA `Link in Bio` porta directo, pero **el objeto que mandamos es agendar la demo en cal.onia.com.bo** (decisión 2026-08-23), no un PDF.

---

## Lo que NO se puede afirmar

- **Nada sobre lo que se DICE.** No hay transcripción: Speaches devolvió "fetch failed" para los 26 del lote. Los subtítulos van palabra por palabra sincronizados, así que casi con certeza hay una voz en off — pero **no se oyó**. Todo el guion que reconstruí sale del texto quemado y del caption.
- **Con qué se editó.** No se nombra software en ningún fotograma ni en el caption. Que el hilo sea un `stroke` animado, que el subtítulo sea opacidad por `<span>` y que el parpadeo esté pegado a un golpe de música son **reconstrucciones mías**, no datos.
- **La tipografía.** Nadie la nombra. "Cercana a Helvetica Now / Neue Haas Grotesk" es inferencia visual.
- **Los hex.** Leídos de fotogramas JPG comprimidos y reescalados. Son aproximados por definición.
- **Cuatro láminas quedaron cortadas** por dónde cayó el muestreo y la palabra final no se leyó: `it tric___`, `Remove you from the ___`, `11,000 followers in 90 ___`, `Strate___`.
- **No se sabe si las cuentas mostradas son clientes.** `@orbitz.creatives`, `@rpn`, `@rpn.tech`, `@rpnickson`, `@kravebeauty`, `@grambofun` aparecen en pantalla pero nunca se dice que sean clientes de metromedia.house; podrían ser ilustración.
- **No hay precio, ni duración del servicio, ni qué hay detrás del `Link in Bio`.** El video no lo dice y no abrí el enlace.
- **Licencia del archivo prestado.** Se reconocen *The Social Network*, *The Office*, *Bruce Almighty*, keynotes de Jobs y Benioff, archivo de Bezos y Musk. No hay crédito ni declaración de licencia en ninguna parte, y no verifiqué si existe fuera de pantalla.
- **No verifiqué qué soporta hoy `captions-overlay`.** Que el modo "palabra futura en gris" nos falte es una hipótesis a comprobar, no un hecho.
