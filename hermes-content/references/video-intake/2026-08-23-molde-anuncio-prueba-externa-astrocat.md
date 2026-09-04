# Prueba primero, claim despues: el molde del anuncio con validador externo

- **Fuente:** https://www.instagram.com/p/Daz0cVMBuD8/
- **Tipo:** MIXTO (MARKETING dominante + una pieza SaaS aprovechable)
- **Veredicto:** SIRVE YA
- **Cobertura:** 6 de 6 fotogramas base y 20 de 36 texto_*, repartidos en los 5 tramos densos. Medido, no supuesto: 11,24 s / 720x1280 / 30 fps por ffprobe, y 10 cortes duros por deteccion de escena. SIN VOZ: faster-whisper-small corrio los 11,12 s y devolvio n_segments=0, n_words=0. Es musica mas texto en pantalla. El analisis de Gemini no existia (429 por cuota).

## Que muestra, textual

**Caption completo (verbatim):**

> Got this email this morning AstroCat just got featured again in 40 countries around the world. Spain, Germany, France, UK, Poland, Russia, and so many more.
> Me and my dad built this from scratch. He made the entire engine. I taught myself 3D modeling, animation, and UI/UX to bring the whole world to life.
> Two years ago I left a corporate job with no idea if this would work. Getting featured once felt like a miracle getting featured again, in this many countries, still doesn't feel real.
> Right now I'm deep in building the next update a whole new world, new skins, new levels. This feature couldn't have come at a better time.
> Thank you to everyone who's followed this journey

**Los 6 bloques de texto en pantalla, en orden:**

1. "Got this email this morning"
2. "My Game got featured by Apple again!"
3. "In 40+ different countries"
4. "Me and my dad built this from scratch"
5. "Took a huge risk on this project"
6. "But I know she would be proud of me"

**El email de Apple, legible a pantalla completa (transcrito de texto_001_08):**

> Dear Michael Bunnell, congratulations!
> **AstroCat Adventures** is Game of the Day for July 15, 2026 on the App Store in Albania, Armenia, Austria, Azerbaijan, Belarus, Belgium, Bosnia and Herzegovina, Bulgaria, Croatia, Cyprus, Czech Republic, Denmark, Estonia, Finland, France, Georgia, Germany, Greece, Hungary, Iceland, Ireland, Italy, Kazakhstan, Kosovo, Kyrgyzstan, Latvia, Lithuania, Luxembourg, Malta, Moldova, Montenegro, Netherlands, North Macedonia, Norway, Poland, Portugal, Romania, Russia, Serbia, Slovakia, Slovenia, Spain, Sweden, Switzerland, Tajikistan, Turkmenistan, Ukraine, United Kingdom, and Uzbekistan.
> Share on social media using artwork made for you.
> Be sure to use #OnTheAppStore and tag @AppStore when you post so that we can celebrate with you.
> Thanks for all your hard work creating great customer experiences!

Conte la lista yo mismo: son **49 paises**, asi que el "40+" del texto en pantalla es correcto y hasta conservador. Dato honesto que sale del mismo documento: los 49 son Europa mas Caucaso y Asia Central. No hay Estados Unidos, ni LatAm, ni Asia-Pacifico. Es UNA region editorial de Apple. "40+ countries around the world" es cierto y a la vez es el encuadre mas favorable posible del mismo hecho.

**Otros textos leidos en pantalla:** el asset oficial dice "App Store / GAME OF THE DAY / AstroCat Adventures / July 15, 2026". El gameplay muestra HUD: "27", "28", "LEVEL 6", "15" y un corazon. El cuaderno dice "ICON KEY CHART", "Bridge (outside/inside)", "Platform (outside/inside)", "Corridor (indoor/outdoor)", "Stairs", "Room/Environment", "Cave", "Lava", "Battle Platform", "Stairs", "Outdoor w/ tree", "Start". En un mueble del fondo se leen dos lomos: "Objective-C" y "ZBRUSH" (lo verifique recortando y ampliando el fotograma, no lo deduje).

## Como esta hecho - la reconstruccion

### El molde de guion, segundo a segundo (cortes medidos, no estimados)

11 planos en 11,24 s. 10 cortes duros. Duracion media de plano **1,02 s**, rango 0,70 a 1,53 s. Es casi metronomico.

| # | Entra | Dura | Plano | Bloque de texto |
|---|---|---|---|---|
| 1 | 0,00 | 1,53 | Selfie contrapicado, coworking de techo de bambu | A: "Got this email this morning" |
| 2 | 1,53 | 0,80 | Screenshot del email de Apple, a sangre | B: "My Game got featured by Apple again!" |
| 3 | 2,33 | 0,90 | Asset oficial "GAME OF THE DAY", version espacial oscura | B, luego C |
| 4 | 3,23 | 0,87 | El mismo asset, version azul plana | C: "In 40+ different countries" |
| 5 | 4,10 | 1,23 | Gameplay: tunel neon, LEVEL 6 | D: "Me and my dad built this from scratch" |
| 6 | 5,33 | 0,97 | El papa tecleando en un escritorio de casa | D |
| 7 | 6,30 | 1,00 | Cuaderno "ICON KEY CHART" sostenido a camara | D |
| 8 | 7,30 | 0,70 | Cuaderno con bocetos de robots a birome | D |
| 9 | 8,00 | 1,20 | Gameplay: Marte, arana robot, HUD de corazon | E: "Took a huge risk on this project" |
| 10 | 9,20 | 1,03 | Foto analogica: familia tras una reja | F: "But I know she would be proud of me" |
| 11 | 10,23 | 1,01 | Foto analogica: ella de nena, primer plano | F |

**El mecanismo, no el adjetivo.** Cuatro decisiones cargan todo el peso:

**1. El orden esta invertido: la prueba va antes que el claim.** El gancho no dice el logro. Dice "recibi este email" y muestra a la persona, no al documento. El claim ("my game got featured") aparece recien en el plano 2, ENCIMA del documento que ya lo prueba. El espectador lee la prueba y el titulo al mismo tiempo. La mayoria hace lo contrario (anuncia el logro y despues, si acaso, muestra algo), y por eso suena a autobombo.

**2. El logro no lo declara el autor, lo declara un tercero con nombre.** Apple dice "Game of the Day". El autor solo sostiene el papel. Y encima el validador REGALA el activo: el propio email dice "Share on social media using artwork made for you". Los planos 3 y 4 son arte oficial de Apple, con la tipografia y el azul de Apple. Se toma prestada la autoridad visual del validador, gratis y con permiso explicito.

**3. La credibilidad se compra con proceso feo, no con resultado lindo.** Los planos 6, 7 y 8 (2,67 s seguidos, el bloque mas largo del video) son: un escritorio de casa con cables sueltos y un mueble viejo, un cuaderno rayado y unos robots dibujados a birome. Ninguno es bonito. Esa es exactamente la funcion. El gameplay pulido solo, sin el cuaderno, se leeria como estudio; el cuaderno lo convierte en "dos personas en una casa".

**4. El desfase texto-lento / imagen-rapida es el motor del ritmo.** 6 bloques de texto sobre 11 planos, ratio 1:2. La imagen corta cada 1 s; la frase dura entre 1 y 3,9 s. El texto queda quieto mientras abajo cambia todo. Eso deja leer sin frenar el pulso.

**5. Produccion: esto no se filmo, se ARMO de archivo.** Es el dato mas copiable y el mas facil de pasar por alto. El plano 1 es un coworking de techo de paja, el plano 7 tiene un cartel de puerta de aeropuerto ("C1") y un arbol de terminal, el 6 es una casa, los 10 y 11 son fotos escaneadas de los 2000. Distintos lugares, distintos dias, distintas camaras. Lo unico del dia es el screenshot del email. **El molde no exige rodaje: exige un archivo de b-roll ya acumulado.** Sin ese archivo el molde no se puede ejecutar por rapido que sea el hito.

### Mecanica de conversion: no pide nada

Cero CTA. No hay link, no hay "descargalo", no hay tarjeta final, no hay nombre de usuario en pantalla. El plano 11 termina en la foto de infancia y corta. El video ni siquiera nombra el producto: "AstroCat Adventures" solo aparece dentro del email y del asset de Apple, nunca en el texto propio.

El caption hace todo el trabajo que el video se niega a hacer: nombra el producto, reparte el credito con precision ("He made the entire engine. I taught myself 3D modeling, animation, and UI/UX"), cuenta el arco de dos anios y el riesgo ("Two years ago I left a corporate job"), y sobre todo **deja un arco abierto**: "Right now I'm deep in building the next update a whole new world, new skins, new levels". Ese es el instrumento de conversion. No busca la descarga, busca el follow, y el anzuelo del follow es lo que todavia no paso.

El cierre F cambia de sujeto a proposito. "But I know she would be proud of me" sobre una foto de ella misma de nena es el unico momento en que el video deja de hablar del producto. Es el pago emocional despues de 10 s de prueba, proceso y riesgo.

### La pieza SaaS que se puede robar: el ICON KEY CHART

El plano 7 no es relleno emotivo, es un artefacto de diseño de producto. Es una **taxonomia de piezas componibles con leyenda visual**, dibujada a mano antes de construir nada: cada tipo de bloque de nivel tiene un icono y una etiqueta, y varios tienen variante (Bridge outside/inside, Platform outside/inside, Corridor indoor/outdoor). Con esa leyenda se puede dibujar el layout de un nivel entero en papel, en minutos, y recien despues construirlo.

Traducido a nuestro dominio: **un pack por rubro es un nivel armado con piezas del core.** Antes de codear un rubro nuevo conviene dibujar el vocabulario de piezas disponibles y despues mapear el rubro con esas piezas. Si una pieza que el rubro necesita no esta en la leyenda, eso es exactamente la lista de lo que falta encender en el core, encontrada antes de escribir codigo en vez de despues.

## El estilo, como conocimiento portable

**Tipografia.** Sans geometrica en peso Bold/Heavy, 'o' casi circular perfecta, 'a' de doble piso, 'g' de un piso, terminales rectas. Aparenta ser Poppins Bold o el preset por defecto de subtitulo de CapCut o Reels. No puedo confirmar la familia. Tratamiento: blanco puro con contorno negro solido de unos 4 a 6 px, sin sombra difusa, sin caja de fondo. Dos lineas centradas, ancho de caja aproximado 75 por ciento del cuadro, interlineado apretado (cerca de 1,05), tracking normal. Cuerpo grande: la mayuscula ocupa cerca del 5 por ciento del alto del cuadro.

**Posicion del texto: la decision mas importante y es una decision de NO moverlo.** El bloque vive fijo en el tercio superior, arrancando cerca del 18 al 24 por ciento del alto, y NO se mueve nunca entre planos. Con la imagen cambiando cada segundo, el texto es la unica ancla estatica. Sacale eso y el video se vuelve ilegible.

**Paleta.** No hay una paleta, hay seis, y la ruptura es el argumento:

| Bloque | Colores (hex aproximado) |
|---|---|
| Selfie coworking | paja y madera #C8A45C y #8B6F3E, top negro #1C1C1E, luz natural difusa calida |
| Email de Apple | blanco #FFFFFF, grafito #1D1D1F, azul de link #0071E3, degrade del logo #1FA6FF a #0A63D8 |
| Asset App Store oscuro | azul espacial #041E3A a #0A4FA8, negro estrellado #000814, cian del propulsor #35F0D0 a #5FFFE0, blanco #FFFFFF |
| Asset App Store plano | azul saturado #0A5BD0 a #1E6FE8, blanco #FFFFFF |
| Gameplay tunel | cian electrico #00E5FF contra rojo magenta #FF2A4A sobre gris nave #D8DADE (complementarios duros) |
| Gameplay Marte | naranja tierra #E2621C y #C7511A contra negro estrellado #05060F, corazon #FF3B30 |
| Fotos analogicas | saturacion baja, verdes desvaidos #6E8C6A, cian #7FD4D8, sobre barras negras #000000 |

**Composicion y encuadre.** 9:16, pero mezcla tres tratamientos sin disimularlo: full-bleed (selfie y gameplay), screenshot de telefono a sangre (el email ocupa el 100 por ciento del ancho y se recorta arriba y abajo, se ve el header cortado) y letterbox con barras negras (las fotos analogicas y algun gameplay 16:9 escalado). El patron portable fuerte: **el selfie es contrapicado extremo apuntando al techo, y el techo se come el 40 por ciento superior del cuadro.** Ese vacio no es casual, es donde vive el subtitulo. La camara se encuadra para el texto, no al reves. Regla: dejar cielo (techo, pared, espacio negativo) en el tercio superior para que el subtitulo fijo nunca tape informacion.

Y el contraejemplo, que tambien se aprende: en el plano 4 (asset azul plano) el subtitulo choca contra el logotipo "App Store" del propio asset. Se ve encimado. Es el unico error de layout del video y aparece justo cuando el fondo NO fue encuadrado para el texto.

**Ritmo de corte.** 10 cortes en 11,24 s, media de 1,02 s por plano, rango 0,70 a 1,53. Cadencia casi metronomica, compatible con estar cortado a tiempo musical (no medi el BPM, no lo afirmo). El plano mas largo es el primero (1,53 s, el gancho necesita aire) y el mas corto es el 8 (0,70 s, boceto de robots, puro golpe de textura).

**Motion.** Aca esta la leccion incomoda: **no hay ninguna animacion.** El texto no entra, no hace fade, no hace pop, no hace karaoke palabra por palabra. Aparece con el corte y desaparece con el corte. Las transiciones son 10 cortes secos, cero cortinillas, cero whip, cero zoom de transicion. Todo el movimiento es el que ya traia cada plano: camara en mano con deriva lenta en el UGC, camara persecutoria en tercera persona en el gameplay, y un scroll de dedo en el screenshot del email (los fotogramas texto_001_08 y texto_002_01 son identicos, o sea que el screenshot arranca congelado y despues scrollea). La energia sale del contraste de contenido entre plano y plano, no del efecto.

Vale marcarlo como choque explicito con nuestra doctrina: nuestra skill `motion-doctrine` pide continuidad de vector entre escenas y prohibe el corte sin arrastre. Este video hace lo contrario y funciona. No es que la doctrina este mal: es que aplica al video de motion graphics autoral, no al montaje UGC de prueba social, donde la discontinuidad ES el mensaje. Conviene que la doctrina diga cual de los dos regimenes gobierna antes de que alguien la aplique al carril equivocado.

**Textura y atmosfera.** Cuatro texturas deliberadamente incompatibles conviviendo sin grade unificador: UGC crudo de telefono con ruido de sensor y balance calido sin corregir, render 3D limpio de motor con bloom y glow, papel rayado con birome, y foto analogica escaneada de los 2000 con grano, halo y hasta un pelo o rayadura visible en el escaneo. Nadie intento emparejarlas. La incoherencia de textura es el argumento: esto es real, esto es el producto, esto es mi vida.

**Se porta a:** el patron de ritmo (ancla de texto estatica mas corte metronomico de 1,0 s) va a `web-factory/docs/MOTION_PATTERN_BANK_2026.md`; el preset de subtitulo (blanco, stroke negro, dos lineas, fijo al 20 por ciento del alto, sin animacion de entrada) va a las skills `captions-overlay` y `editor-videos`; el molde de guion de 6 beats va al motor de contenido; esta ficha queda en `hermes-content/references/video-intake/`.

## Las tres preguntas

1. **Frente:** marketing y motor de contenido, que es el dueño del molde de guion. En segundo lugar INFLUENCERS IA, porque el preset de subtitulo y la cadencia de 1,0 s se aplican tal cual a los reels de Lucia. Y un desprendimiento chico para onia-core: el ICON KEY CHART como metodo de diseño de rubro antes de codear.

2. **Herramienta nuestra:** existe y esta completa. **HyperFrames** arma el montaje y quema el subtitulo (HTML a MP4, y es el motor por decision de Sergio del 21-ago, con Remotion jubilado). Las skills `editor-videos` y `captions-overlay` para el preset de subtitulo, `copywriting` y `marketing-psychology` para el molde. No hace falta construir nada nuevo. Lo unico que este item revela como faltante no es una herramienta sino una **plantilla parametrizada**: el molde de 6 beats todavia no existe escrito en ningun lado nuestro.

3. **Que falta:** para el estilo y la plantilla, NADA. Se hace hoy, sin credenciales, sin gasto y sin permisos. Para DISPARAR el molde falta el unico insumo que no se puede fabricar: **un hito verificable declarado por un tercero con nombre.** ONIA hoy no tiene ninguno equivalente a un "featured by Apple". Lo mas cercano documentado es el primer registro real que entro por Instagram el 21-ago, y esa cuenta se borro el 22. Y ojo con la tentacion: este molde entero se apoya en un documento real mostrado verbatim, asi que rellenarlo con un logro inventado no seria una licencia creativa, seria romper de frente la regla de "No fabricar" y ademas la regla de que la venta nunca exhibe obra. La plantilla se construye ahora y se queda cargada, esperando el hito.

## Lo que NO se puede afirmar

- **El motor del juego.** El caption dice "He made the entire engine" y no dice cual, ni en que lenguaje, ni sobre que framework. No se dice.
- **Las herramientas de 3D, animacion y UI.** El caption dice "I taught myself 3D modeling, animation, and UI/UX" sin nombrar un solo software. En un mueble del fondo se leen los lomos "Objective-C" y "ZBRUSH", y eso SI lo verifique ampliando el fotograma. Pero un libro en un estante no prueba con que se hizo el juego. NO-VERIFICADO.
- **Quien es quien.** El email dice "Dear Michael Bunnell" y en camara aparece una mujer; el caption dice "me and my dad". Que Michael Bunnell sea el padre y el titular de la cuenta de desarrollador es una inferencia razonable, no un dato del post.
- **La cuenta que publica.** No aparece ningun usuario ni handle en los 26 fotogramas que lei.
- **La musica.** Hay pista de audio (aac) y no hay voz, pero no identifique el tema ni medi el BPM. Que los cortes esten pegados al beat es coherente con la cadencia de 1,02 s, pero no lo comprobe.
- **Que el video funcione.** No tengo vistas, likes, guardados ni ningun numero de alcance. Estoy juzgando la construccion, no el resultado medido.
- **La familia tipografica exacta** del subtitulo. Descripta por rasgos, no identificada.
- **Que el "she" del cierre sea ella misma de nena.** Es la lectura mas directa por el montaje (foto de infancia justo despues de la foto familiar), pero el post no lo explicita.
