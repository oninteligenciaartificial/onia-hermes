# El toggle "Lights" que enciende toda la grilla de productos

- **Fuente:** https://www.instagram.com/p/DbEHFJjjd6y/ · @andrew.plerdy
- **Tipo:** MIXTO (WEB de mecanismo + MARKETING de molde)
- **Veredicto:** SIRVE YA
- **Cobertura:** 36 de 36 fotogramas leidos (4 `base_*` + 32 `texto_*` = 100%). No se pudo leer: la barra de URL, el nombre de la tienda en el header y las facetas del sidebar (ilegibles a 360p). El audio NO se transcribio (Speaches fallo): el sujeto habla los 8,3 s enteros y no se oyo nada.

## Que muestra, textual

**Caption completo (verbatim):**

> ✅ Comment LEAK. I'll send website checklists. This is good for business. Look. Flip this switch. Lamp off. Lamp on. Product photos change. Powerful UX for your online store.	#ecommerce #ecommercetips #shopify #storeowner #ecommercebusiness #smallbusiness

**Pildora fija (el CTA quemado en la banda negra), en dos estados:**

1. `This literally prints money` (aprox. 0,0 - 3,7 s)
2. `Comment LEAK. I'll send UX checklists` (aprox. 3,8 - 8,3 s)

**Linea de subtitulo karaoke, en orden (7 lineas, la palabra en cian va en MAYUSCULA aca tal como aparece):**

1. `THIS IS GOOD FOR`
2. `BUSINESS.`
3. `LOOK,`
4. `FLIP THIS SWITCH`
5. `LAMP OFF,`
6. `LAMP ON.`
7. `PRODUCT PHOTOS`
8. `CHANGE.`
9. `POWERFUL UX FOR`
10. `YOUR ONLINE STORE.`

(Son 10 lineas, no 7: las conte fotograma a fotograma. Coinciden literalmente con el caption, que es la transcripcion del audio pegada por el autor.)

**Texto legible DENTRO de la grabacion de pantalla (recuperado, no reconstruido):**

- Titulo de coleccion: `All Lighting`
- Controles de la barra: `+ Filter`, `View`, `Lights` + un switch tipo pildora
- Fichas de producto: `Murano Glass Orb Surface Mount` / `From $1,750.00` · `Murano Glass Up Down Sconce` / `From $2,750.00` · `Murano Glass Orb Pendant` / `From $2,900.00` · `Murano Glass Cosmos Chandelier` / `From $6,000.00`
- Banner de cookies al pie del navegador, texto ilegible

**Discrepancia registrada:** la pildora en pantalla dice `UX checklists`; el caption dice `website checklists`. Dos nombres para el mismo lead magnet en la misma pieza.

## Como esta hecho - la reconstruccion

### El mecanismo WEB (lo que vale de verdad)

En la barra de herramientas de la coleccion, a la derecha de `View`, hay un **toggle etiquetado `Lights`**. Al accionarlo, las 8 fichas visibles cambian su foto **al mismo tiempo**: pasan de la version "apagada" (pared clara, lampara sin encender, fondo gris frio ~#D8D2C8) a la version "encendida" (bulbo emitiendo, halo ambar sobre la pared, el resto del encuadre oscurecido). No es un hover por ficha ni un carrusel: es **un control unico a nivel de coleccion que conmuta la imagen primaria de TODA la grilla**.

El mecanismo, reconstruido (el video no muestra codigo):

- Cada producto tiene **dos assets del mismo encuadre**, mismo angulo, mismo lente, misma distancia - solo cambia el estado de la lampara. Eso es lo caro y lo que hace que funcione: la conmutacion se lee como "encendi la luz", no como "cambio la foto". Fotografia, no CSS.
- El toggle es un `input[type=checkbox]` (o `button[aria-pressed]`) que escribe un estado en el contenedor de la grilla; las fichas leen ese estado por selector descendiente. **Un evento, N imagenes**: no hay listener por tarjeta.
- La transicion entre ambas fotos es un **crossfade de `opacity`** entre dos `<img>` apiladas en el mismo contenedor con `position:absolute` (la de apagado abajo, la de encendido arriba con `opacity:0`). En los fotogramas se ve el estado intermedio: en `texto_002_08` el halo ambar ya aparecio pero la pared todavia conserva el gris, o sea es una fundido, no un swap seco de `src`.
- Beneficio secundario del apilado: ambas imagenes ya estan en el DOM, asi que el primer clic no dispara una descarga y no hay parpadeo.
- En el video el switch se acciona **cuatro veces** en 8,3 s (OFF hasta ~3,9 s -> ON hasta ~5,7 s -> OFF hasta ~7,2 s -> ON al cierre; **estos cortes de tiempo son estimados por mi conteo de fotogramas**, no medidos con ffprobe). El autor lo repite para que el gesto se lea aunque el espectador entre a mitad del bucle.

**Lo que NO se dice:** ni la plataforma (el hashtag `#shopify` es un hashtag, no una prueba), ni el theme, ni si las fotos de encendido son fotografia o render, ni si el toggle es nativo del theme o un app de terceros.

### El overlay de "heatmap" - leelo como utileria, no como dato

Sobre la grabacion hay manchas gaussianas verde-a-rojo pegadas exactamente sobre `+ Filter` y sobre el toggle `Lights`, mas puntitos sobre los items del nav y del sidebar. Estan compuestas en edicion y siguen a la UI cuando el plano hace zoom, o sea van pinneadas al mismo transform que la captura.

**Criterio:** funciona como prop de autoridad ("mira donde mira la gente"), no como evidencia. Las manchas calientes caen justo sobre las dos cosas que el autor quiere que mires. **Para ONIA esto choca de frente con "no fabricar": un heatmap inventado presentado como dato de usuarios reales es exactamente lo prohibido.** El recurso visual se porta; el dato falso no.

### El molde MARKETING (8,3 s, 0 cortes)

- **Duracion medida: 8,300 s · 360x640 · 30 fps · 249 fotogramas · 0 cortes de escena** (umbral 0.3). Un solo plano continuo: el ritmo NO viene del montaje.
- Split screen en tres bandas horizontales fijas: grabacion de pantalla arriba (~48% del alto util), banda negra con el texto en el medio (~14%), talking head abajo (~38%), todo con letterbox negro arriba y abajo.
- Estructura segundo a segundo:
  - 0,0 - 2,0 s | **Gancho por afirmacion economica.** Plano abierto de la coleccion, `THIS IS GOOD FOR` / `BUSINESS.`, pildora `This literally prints money`. Ninguna promesa de contenido todavia: primero se afirma valor, despues se muestra.
  - ~2,0 s | **Zoom digital sostenido** hacia la barra de herramientas. La flecha roja entra desde arriba a la derecha.
  - 2,5 - 3,5 s | **Direccion de mirada.** `LOOK,` / `FLIP THIS SWITCH`. La flecha ya esta clavada sobre el toggle.
  - ~3,7 s | **Swap horizontal de la pildora**: `This literally prints money` sale por la izquierda mientras `Comment LEAK...` entra por la derecha, simultaneas, en aprox. 0,3 s (lo capture a medio camino en `texto_002_08`). El CTA aparece **justo antes del payoff**, no despues.
  - 3,9 - 8,3 s | **Payoff repetido.** El toggle se acciona, la grilla cambia, `LAMP OFF,` / `LAMP ON.` / `PRODUCT PHOTOS` / `CHANGE.`, y se cierra con el beneficio nombrado: `POWERFUL UX FOR` / `YOUR ONLINE STORE.`
- La palanca de conversion es **comentario -> DM**, con palabra clave corta y mayuscula (`LEAK`) y un entregable listado (checklists).

## El estilo, como conocimiento portable

**Tipografia** (dos voces, nunca se pisan porque viven en lineas distintas):
- Pildora CTA: sans humanista, peso regular, caja mixta, negro sobre crema. Tamano grande, ~1 linea. Sin negrita: la jerarquia la da el fondo, no el peso.
- Linea karaoke: grotesca pesada, **TODO EN MAYUSCULA**, tracking cerrado, 2 a 4 palabras por linea. La palabra-concepto va en cian, el resto en blanco. Nunca mas de una palabra coloreada por linea.

**Paleta (hex APROXIMADO - leido de un JPEG de 360p, no de un archivo de diseno):**
| Rol | Hex aprox |
|---|---|
| Banda de texto | `#000000` |
| Pildora crema | `#F3EAD2` |
| Texto de la pildora | `#111111` |
| Realce karaoke (cian) | `#25C4E8` |
| Texto karaoke base | `#FFFFFF` |
| Flecha de anotacion | `#EE2A22` |
| Fondo de producto apagado | `#D8D2C8` |
| Halo de producto encendido | `#E8913A` |
| Chrome del navegador | `#FFFFFF` sobre `#202124` |

**Composicion:** 9:16 partido en tres bandas horizontales de altura constante durante todo el video. La banda negra central hace de riel de texto y de separador; ninguna de las dos imagenes invade a la otra. Dentro de la banda, dos lineas apiladas: CTA persistente arriba, karaoke abajo. La pildora esta centrada pero su ancho se adapta al texto, asi que el swap de CTA cambia visiblemente el ancho del bloque - eso mismo es lo que hace notar el cambio.

**Ritmo:** MEDIDO 8,300 s / 249 fotogramas / **0 cortes**. La velocidad la producen tres motores que no son el corte: (1) la linea karaoke rota 10 veces, o sea ~0,8 s por linea (estimado por conteo de fotogramas); (2) el zoom digital nunca se detiene; (3) el toggle se acciona 4 veces. Leccion portable: **se puede sostener un reel a ritmo alto sin un solo corte** si algo esta cambiando siempre en pantalla.

**Motion, los cuatro gestos:**
1. Zoom digital lento y continuo sobre la captura (scale ramp, sin pausa ni rebote).
2. Flecha roja que entra desde fuera de cuadro arriba a la derecha, con un leve pasado de largo y se queda quieta. No parpadea, no late.
3. Swap horizontal de la pildora: sale a la izquierda / entra por la derecha, simultaneo, ~0,3 s. Direccion consistente - lo viejo se va por donde vino la lectura.
4. Crossfade de opacidad de 8 imagenes a la vez, disparado por el toggle.

**Textura:** deliberadamente sin pulir. Se deja ver la barra del navegador, las pestanas, el banner de cookies y hasta la barra de tareas de Windows. El talking head es contrapicado, gran angular, microfono de canon con deadcat a cuadro, estanteria de fondo. La unica capa "producida" es el heatmap - y precisamente por eso destaca y funciona como sello de autoridad.

**Se porta a:**
- `web-factory/docs/MOTION_PATTERN_BANK_2026.md` -> los cuatro gestos: zoom sostenido sin cortes, entrada de flecha con overshoot, swap horizontal de pildora, crossfade de grilla completa por toggle.
- `hermes-content/references/ui-patterns/toggle-luces-grilla/` (carpeta nueva) -> el patron de interfaz reconstruido, siguiendo la convencion del README de esa carpeta: un `index.html` autocontenido, solo `transform`/`opacity`, `prefers-reduced-motion` con `transition: none`, y la fuente anotada arriba.

## Las tres preguntas

1. **Frente:** dos, y son distintos.
   (a) **web-factory** - el toggle de estado que conmuta la grilla entera es un patron nuevo que no esta en la biblioteca (hoy hay chat-widget, checkout-card, dropzone-progress, floating-cart, panel-claro-premium, sidebar-nav, upload-button). Es directamente util en los storefronts de comercio que arma web-factory.
   (b) **marketing** - el molde de 8 s comentario->DM. Ojo: el lote del 23-ago ya tiene `2026-08-23-reel-10-laminas-plano-fijo-comment-to-dm.md`, asi que el aporte de este item al molde es marginal: lo unico realmente nuevo es **el CTA que hace swap a mitad del video, justo antes del payoff**, y **el ritmo sostenido con 0 cortes**.

2. **Herramienta nuestra:**
   - Patron web: `image-to-code` para sacar el layout de la barra, la convencion de `hermes-content/references/ui-patterns/` para el archivo, `ui-ux-pro-max` / `impeccable` para el acabado. Las skills `gsap-*` **no hacen falta**: son dos `opacity` y un `:checked`, se hace con CSS puro (regla del README de esa carpeta: primero se intenta sin libreria).
   - Molde de video: `hyperframes` + `editor-videos` (banda negra, split screen, subtitulo karaoke quemado).
   - Circuito comentario->DM: **ya esta vivo en produccion** (probado el 18-ago). El objeto que se manda cambia: **la demo en cal.onia.com.bo**, decidido el 23-ago, no un PDF.

3. **Que falta:** para el patron web, **nada** - se hace hoy, sin credencial, sin gasto, sin decision pendiente. Para el molde de video faltan dos decisiones chicas y una prohibicion: (i) la palabra clave del comentario en espanol (el equivalente de `LEAK`); (ii) que la pieza mande a agendar demo y no a un PDF; (iii) **prohibido copiar el heatmap** - inventar un mapa de calor es fabricar dato.

## Lo que NO se puede afirmar

- **Nada de lo que dice.** El sujeto habla los 8,3 s enteros y el audio no se transcribio (Speaches: "fetch failed"). El caption parece ser la transcripcion pegada por el autor y coincide literalmente con las 10 lineas de subtitulo, pero **eso lo infiero de la coincidencia, no lo verifique contra el audio**.
- **La plataforma de la tienda.** `#shopify` es un hashtag del caption, no una prueba. La URL es ilegible y el nombre de la tienda en el header tampoco se lee.
- **Si el toggle es nativo del theme, un app de terceros o codigo a medida.** No se muestra ni el admin ni una linea de codigo.
- **Si las fotos "encendidas" son fotografia real o render/edicion.** Solo se ve el resultado en la grilla.
- **Que el toggle venda mas.** El video afirma "prints money" y no muestra ni una cifra, ni un antes/despues de conversion, ni una fuente. La afirmacion economica esta 100% sin respaldo.
- **De donde sale el heatmap.** No se nombra herramienta, ni periodo, ni cantidad de sesiones. Trato las manchas como grafico decorativo.
- **Los tiempos internos** (cuando entra la flecha, cuando se acciona cada toggle, cuanto dura cada linea): son **estimados por conteo de fotogramas**. Lo unico medido con ffprobe es 8,300 s / 360x640 / 30 fps / 249 fotogramas / 0 cortes.
