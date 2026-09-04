# ASCII Magic v2: el filtro como transicion (teaser de lanzamiento)

- **Fuente:** https://www.instagram.com/p/DbvxMwghtkA/
- **Tipo:** MIXTO (MARKETING por el molde del teaser + WEB por el mecanismo del efecto)
- **Veredicto:** SIRVE YA
- **Cobertura:** Lei 9 de 9 `base_*` y 22 de 48 `texto_*` (31 fotogramas). No existe archivo de Gemini para este item. Voz: no verificable desde fotogramas (ningun hablante, ningun subtitulo de voz); el caption no menciona narracion.

## Que muestra, textual

**Caption, verbatim:**

> I never actually introduced this here.
>
> Over the past few months, I've been quietly building ASCII Magic, an image effects tool that turns photos and videos into beautiful stylized visuals with just a few clicks.
>
> We've hit 60k+ users in just 3 months sand if you've been following me on Twitter, you've probably seen me shipping updates almost every week.
>
> Now it's time for the next chapter.
>
> ASCII Magic v2 is coming soon✨
>
> More presets. More effects. More control. A complete redesign of the creation experience.
>
> If you haven't tried it yet, give v1 a spin and let me know what you create:
> https://ascii-magic.com
>
> v2 is going to be a huge upgrade. 🚀

**Texto en pantalla, en orden (verbatim), con el segundo aproximado segun el fotograma:**

| ~seg | Texto en pantalla | Fondo |
|---|---|---|
| 0-2 | `61455+` | blanco liso, cifra negra gigante |
| 2-4 | `200K+ Assets Generated` (aparece por typewriter: `200` -> `200K+ As` -> `200K+ Assets Gener` -> completo) | collage 3D de capturas de webs con HUD rojo de falsa deteccion |
| 4-5 | `in 3 months` | metraje procesado en ASCII / dither, casi negro |
| 5-6 | `we are now` | blanco con paneles de video volando |
| 6-7 | `BIGGER` | matriz de puntos blancos sobre negro |
| 7-8 | `more precise` | mano de luz en ASCII sobre negro |
| 8-9 | `more styles` | flor: version halftone naranja, version glitch azul, version blueprint |
| 9-11 | `more presets` | collage de miniaturas con caja blanca solida detras del texto |
| 11-12 | `and` -> `and new ways to` -> `and new ways to create` (typewriter) | scanlines blancas / negativo |
| ~12 | panel de UI apenas legible: `Backdrop`, `Standard`, `150`, `1000` | UI oscura curvada, casi apagada |
| 12-14 | letras gigantes de puntos pasando: `...GIC V` | negro |
| 14-16 | `ASCII Magic` + badge `v2` | negro con trazos punteados y cajas del HUD |
| 16-18 | `coming soon` | negro con retícula rala de cruces |

Ninguno de los fotogramas que lei acompana la cifra `61455+` con una palabra ("users", "creators"): el numero aparece solo. El referente lo aporta el caption ("60k+ users").

## Como esta hecho — la reconstruccion

Dos cosas separadas: **el molde de marketing** y **el mecanismo visual**. El post es flojo de contenido (es un "coming soon" sin producto que mostrar) y muy fuerte de forma.

### A. El molde (MARKETING) — 13 estados en ~18 s

1. **Cifra sola, sin contexto** (`61455+`, contando hacia arriba). Gancho de 2 s: el numero se lee antes de que se entienda de que es.
2. **Segunda cifra que sube la apuesta** (`200K+ Assets Generated`).
3. **El denominador** (`in 3 months`) — recien aca la cifra se vuelve impresionante. El orden es deliberado: numero, numero mayor, tiempo corto.
4. **Bisagra de una frase partida en dos planos** (`we are now` / `BIGGER`). La frase cruza el corte: eso obliga a seguir mirando.
5. **Lista de mejoras en kickers de 2-3 palabras**, uno por plano (`more precise`, `more styles`, `more presets`, `and new ways to create`). Cada kicker se demuestra con la imagen de fondo, no se explica.
6. **Un vistazo de 0,5 s a la UI nueva**, deliberadamente ilegible (se alcanza a leer `Backdrop` y `Standard`). Promete sin mostrar.
7. **Nombre + version** (`ASCII Magic v2`), recien al segundo 14. La marca va al final, no al principio.
8. **Cierre `coming soon`.**

> ⚠️ El punto 8 es exactamente lo que NUESTRA regla prohibe ("La venta nunca exhibe obra": nada de "muy pronto", "proximamente", "beta"). El molde se porta **sin el ultimo plano**: se cierra en el nombre, o en un plano de lo que YA esta vivo. Los 7 primeros pasos si sirven tal cual.

### B. El mecanismo (WEB) — el filtro es la transicion

La idea estructural: **no hay cortes**. La camara hace un solo empuje continuo y lo que cambia entre "escenas" es el **filtro** aplicado encima del mismo metraje. Por eso el video se siente como una sola toma de 18 s y no como 13 planos.

El video esta hecho con el propio producto: cada plano es material corriente pasado por un preset distinto de la herramienta. Los presets que se identifican en los fotogramas:

- **ASCII art**: se trocea el cuadro en una grilla de celdas (~8x8 px), se saca la luminancia media por celda y se mapea a un caracter de una rampa. En `texto_003_03` y `texto_004_05` se leen los glifos usados: `@ M # x + 0 e s`. Fuente monoespaciada, blanco sobre negro.
- **Halftone de puntos**: misma grilla, pero en vez de glifo se dibuja un circulo con radio proporcional a la luminancia. Version dura sin glow (`BIGGER`, `base_004`) y version con bloom radial por punto (flor naranja, `base_005`).
- **Dither ordenado (Bayer)**: blanco y negro puro, patron de umbral 4x4/8x8. Se ve en las miniaturas de `more presets`.
- **Deteccion de bordes** (tipo Sobel + umbral): contornos blancos de 1 px sobre negro (`texto_004_01`, un `BIGGER` ampliado hasta que solo se ve el contorno) y sobre azul ultramar (`texto_005_05`, el efecto "blueprint" = bordes + mapeo de color plano).
- **Scanlines / CRT**: lineas horizontales de 1 px encima de todo. Sobre blanco en `base_006`, sobre negro en `base_004`. En HTML es una sola linea: `repeating-linear-gradient(0deg, rgba(0,0,0,.35) 0 1px, transparent 1px 3px)`.
- **Glitch de rebanadas + separacion RGB**: desplazamiento horizontal aleatorio de bandas y canales corridos (`texto_003_01`, base de `texto_005_03`).

Encima, dos capas de composicion que NO son filtro:

- **Collage 3D**: 8-12 paneles de captura colocados sobre una superficie curva con perspectiva; la camara empuja hacia adentro y los paneles sangran por los cuatro bordes. Reproducible con `transform: perspective() rotateX/rotateY translateZ` por panel; no hace falta WebGL.
- **HUD de falsa deteccion**: cajas rojas de 1 px, punto verde en el centro de cada caja, etiqueta monoespaciada `x: 974 y: 827` pegada arriba a la izquierda, y curvas punteadas de 1 px conectando cajas. Es puro `div` posicionado + `border: 1px solid` + SVG con `stroke-dasharray`. Vende "la maquina esta mirando" a costo cero.

Y la regla de texto que sostiene todo: **el texto nunca se mueve**. Aparece letra por letra en su posicion final (~10-12 caracteres/s) y se queda clavado en el eje vertical del centro mientras cinco fondos distintos pasan por detras. El texto es el ancla; el fondo es lo que muta.

## El estilo, como conocimiento portable

**Tipografia**
- Kickers y cuerpo: **monoespaciada**, blanca, peso regular, tracking abierto (~0,05 em), altura ~5-6% del alto de cuadro. Aspecto tipo IBM Plex Mono / Roboto Mono / Courier. Es UNA sola familia para todos los kickers.
- Titular de dato (`200K+ Assets Generated`): **grotesca semibold** (aspecto SF Pro / Helvetica Now), blanca, apretada. Rompe con la mono a proposito: la mono es "el sistema hablando", la grotesca es "el dato duro".
- Cifra de apertura (`61455+`): sans **black/heavy** negra sobre blanco, ~60% del ancho de cuadro, bordes vibrando por el propio filtro.
- Cierre: `ASCII Magic` en sans regular + badge rectangular gris con `v2` en minuscula, radio ~4 px.
- Truco: en varios planos (`we are now`, `more presets`) el texto **pasa por el mismo filtro** que la imagen y sale pixelado. Eso lo mete dentro de la escena en vez de dejarlo encima.

**Paleta** (hex aproximados, leidos de los fotogramas)
- Estructura: negro puro `#000000` y blanco puro `#FFFFFF`. El 90% del cuadro es uno de los dos, y alternan duro (blanco al inicio, negro, blanco a mitad, negro al final).
- Ambar/naranja del halftone: `#FFC24D` -> `#FF8A1F` -> `#E03A00`.
- Azul ultramar del blueprint: `#1533E0`.
- Cian `#00E0D0`, magenta `#FF2D8A`, verde acido `#37D03A` (vienen del material, no de una paleta de marca).
- HUD: rojo `#FF2B2B` en las cajas, verde `#2BFF5C` en los puntos.
- Badge `v2`: fondo `#3A3A3A`, texto `#D9D9D9`.
- **Regla portable:** el color NO se decide; entra solo por el asset procesado. La marca aporta unicamente blanco y negro.

**Composicion**
- 16:9 (los fotogramas densos son 1080x607).
- El texto siempre en el eje vertical del centro (y ≈ 50%), nunca sube ni baja entre planos.
- Alternan dos encuadres: (a) texto centrado con fondo a sangre; (b) texto empujado a un tercio y el sujeto procesado ocupando el tercio opuesto (`more styles` = imagen izquierda / texto derecha; `more precise` = texto izquierda / mano derecha).
- Cuando el fondo es ruidoso, el texto se respalda con una **caja solida ceñida** (negra en `200K+ Assets Generated`, blanca en `more presets`). Nunca un degradado, nunca una sombra.

**Ritmo**
- ~18 s, 13 estados de texto/tarjeta. Cambio de fondo cada ~1,2-1,4 s de media.
- La tanda de kickers (`more precise` / `more styles` / `more presets`) acelera a ~0,8-1 s cada uno: es la parte de "lista", va rapido.
- El texto entra por typewriter a ~10-12 caracteres/s.
- **Cero cortes a negro.** Cero fundidos. La transicion es el cambio de filtro sobre un movimiento de camara que no se detiene.

**Motion**
- Un unico empuje de camara (dolly-in lento) continuo de punta a punta. Curva aparente lineal o ease-out muy largo; sin rebote, sin overshoot.
- Los paneles del collage entran por escala + perspectiva, nunca por opacidad.
- El texto tiene desplazamiento CERO: solo se revela caracter por caracter.
- El temblor de 1-2 px en los bordes lo produce el filtro (la grilla de celdas re-muestrea cada cuadro), no keyframes. Eso es "movimiento gratis" que no hay que animar.

**Textura**
- El grano ES la imagen: cada plano esta literalmente compuesto por celdas (caracteres o puntos). No es un overlay de ruido encima.
- Scanlines de 1 px cada 3 px, con opacidad ~0,35, tanto sobre blanco como sobre negro.
- Bloom radial solo en el halftone naranja.

**Se porta a:** `web-factory/docs/MOTION_PATTERN_BANK_2026.md` — dos patrones nuevos: **"filtro-como-transicion"** (una sola toma, N filtros, cero cortes) y **"texto ancla / fondo mutante"** (el texto no se mueve nunca, el fondo cambia entero). El HUD de falsa deteccion va a `hermes-content/references/ui-patterns/hud-deteccion-falsa/`. Esta ficha va a `hermes-content/references/video-intake/`.

## Las tres preguntas

1. **Frente:** **web-factory** (patron de motion + banco de efectos: es donde vive `MOTION_PATTERN_BANK_2026.md` y donde se codean composiciones HTML). Secundariamente **marketing / INFLUENCERS IA**, que se lleva el molde de 7 pasos del teaser de lanzamiento.
2. **Herramienta nuestra:** **HyperFrames** (HTML -> MP4, Apache 2.0, ya instalado y probado). Todo el efecto es HTML+canvas: la grilla ASCII/halftone es un `<canvas>` que muestrea el frame; scanlines, collage 3D y HUD son CSS puro. Skills a cargar antes de codear: `hyperframes` (entrada), `hyperframes-core`, `hyperframes-animation`, `motion-doctrine` + `seam-craft` (justamente para la continuidad sin cortes), `cut-the-curve`. Para portar un efecto mirando una captura: `image-to-code`. **NO VERIFICADO:** no confirme que exista hoy un preset ASCII/halftone en nuestro repo — hay que buscarlo antes de escribirlo de cero.
3. **Que falta:** nada bloqueante — no hace falta credencial, permiso ni gasto (HyperFrames corre local y gratis). Faltan solo dos decisiones: (a) que material propio se procesa (capturas de la plataforma ya vivas, no mockups); (b) respetar la regla de venta y **cortar el cierre `coming soon`**, reemplazandolo por el nombre o por algo que ya este encendido en produccion.

## Lo que NO se puede afirmar

- **Con que se hizo el video: no se dice.** Ni en pantalla ni en el caption aparece After Effects, Premiere, canvas propio ni ningun motor. Lo mas probable es que sea la propia herramienta (dogfooding), pero es inferencia mia, no un dato del post.
- **Musica: no se dice** que pista es. No pude verificar el audio desde fotogramas.
- **Voz: no verificada.** Ningun fotograma muestra hablante ni subtitulos de voz; el caption no menciona narracion. No afirmo que no la haya, afirmo que no la vi.
- **Las cifras `61455+`, `200K+ Assets Generated` y "60k+ users" son declaraciones del autor**, sin verificar por mi.
- **`https://ascii-magic.com` aparece en el caption; NO abri el sitio.** No verifique que exista ni que tenga esos presets.
- **El autor no aparece nombrado** en ninguno de los 31 fotogramas que lei; el caption tampoco lo nombra.
- **El panel de UI del segundo ~12** solo permite leer `Backdrop`, `Standard`, `150` y `1000`. No se que hacen esos controles.
- **Los hex de la paleta son aproximaciones** leidas a ojo de fotogramas JPEG comprimidos, no muestreos exactos.
- **La duracion (~18 s) es inferida** del numero de fotogramas base (9, uno cada 2 s), no medida sobre el archivo.
- **No verifique** si ya tenemos un preset ASCII/halftone en el repo. Lo marco NO-VERIFICADO en vez de afirmar que falta.
