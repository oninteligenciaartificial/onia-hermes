---
name: edicion-referentes
description: Invocar ANTES de editar cualquier video NUEVO de Sergio Urcullo (talking head vertical de marca personal) desde el 3-oct-2026. Replica TAL CUAL el montaje de Santiago Muñoz (@sanmunoz.ia) y de Erik Taveras (@eriktaveras), para los repos de GitHub el de @pabloinpublic y, sin cara, el boceto → animación de @theaigeekk, medido reel por reel con evidencia (reel + segundo). Trae una receta por referente, un script por receta que edita desde bruto + cutplan + transcript + storyboard, cómo hay que grabar para que salga igual y las trampas ya pagadas. editor-videos sigue siendo el motor de corte, transcripción y regla de oro.
---

# Edición de referentes: Santiago Muñoz y Erik Taveras, TAL CUAL

> **Decisión de Sergio Urcullo (2-oct-2026), textual:** *«la sesión de marca personal editó como el video de Fable vs
> Astra, ese que lo haga así, pero a partir de después de eso, con el formato de los referentes, y creamos la nueva
> skill de edición»*. Y antes: *«lo que quiero que hagas tal cual son los videos de Eric Taveras y Santiago Munoz»*.
> El reel de Codex del 14-sep (`references/video-intake/2026-09-14-reel-astra-fable-codex/`) y «Tu primera
> automatización» (`videos/marca-personal/2026-09-21/`) son REFERENCIA de lo que a él le gustó, no el molde.

## Reglas de trabajo (la madre, 3-oct-2026, después de revisar los resultados)

> Falló el arnés, no la edición: del mismo video (N03) salieron 3 versiones porque no había molde fijado antes de
> editar. Medido ese día: más del 95 % del gasto de tokens fue releer contexto.

1. **Cada tarea arranca con 3 líneas escritas en el transcript:** META (qué queda hecho), PRUEBA DE HECHO (qué se
   mira para darlo por hecho) y REGLA DE PARADA (cuándo se deja de trabajar y se espera).
2. **Antes de editar, se elige el molde** (Santiago o Erik, de esta skill) y se escribe cuál es. El video terminado
   se compara contra `hermes-content/references/marca-personal/FICHAS-MONTAJE-REFERENTES.md`. Sale **una versión, no
   tres**: si el molde no sirve, se le pregunta a Sergio Urcullo antes de rehacer.
3. **Tokens:**
   - workflows de 5 agentes como máximo;
   - no leer transcripts ni documentos enteros: se busca la sección con `grep`/`sed -n`;
   - effort bajo y modelo chico para lo mecánico (renders, conteos, hojas de control);
   - el modelo grande queda para el criterio y la QA.

## Cuándo y qué

- **Todo video nuevo de Sergio Urcullo** se edita con UNA de las dos recetas. N03 (modo auto) quedó al estilo Codex
  por decisión suya y no se rehace.
- **¿Cuál de las dos?** Si el guion es una noticia con prueba (captura oficial, tabla, titular), va **Santiago**:
  pantalla partida con la prueba arriba. Si es un tutorial, un top-N o un producto con datos que se arman, va
  **Erik**: tarjetas de datos sobre el pecho, sellos y karaoke de 3 palabras. Si dudás, preguntale a Sergio Urcullo.
- **Repos de GitHub (R01-R07, G04, G10 y los cortes verticales de G11): molde Pablo** (abajo). Lo fijó la madre el
  3-oct con un reel que mandó Sergio Urcullo.
- **Sin cara ni voz, «dibujé esto → así quedó»: molde Boceto** (abajo). Reel que mandó Sergio Urcullo el 4-oct.
- **No cambia la regla de oro de `editor-videos`:** tabla de cortes + preview 360p ANTES de cortar. Cuando el script
  aprieta pausas por encima del cutplan aprobado, escribe una tabla aparte (`--plan` en Santiago,
  `trabajo/tabla-cortes.md` en Erik) que también se muestra.
- **Piso común** (lo que le gustó de los dos videos de Codex). Vale donde la receta no dice otra cosa:
  1. El apoyo cambia JUSTO en un límite del cutplan, así no se ve el salto de cara.
  2. Mockups y tarjetas dibujados con código, cada uno con el dato real.
  3. Los textos en pantalla van en un solo registro, el voseo; los subtítulos transcriben lo que él dice.

Las recetas completas, con cada regla, su rango y su evidencia, están en `recetas/santiago.json` y `recetas/erik.json`.
La ficha de Instagram que las alimenta es `hermes-content/references/marca-personal/FICHAS-MONTAJE-REFERENTES.md`.

## Receta Santiago (@sanmunoz.ia), lo esencial

Medido en 6 reels de TikTok (16-sep al 1-oct) y contrastado con la ficha de IG.

| Parámetro | Regla (números medidos) |
|---|---|
| Layout | Pantalla partida: prueba arriba (0-46/50 %), cámara abajo, subtítulo en la costura. La alterna con cara completa, persona reducida y lámina sin cara. Cambia de layout cada 5-13 s (0,75-2,1 por 10 s). |
| Cámara | Fija, plano medio corto, cabeza al 25-44 % del alto. Entre layouts NO se reescala: se traslada 270-600 px (escala 1,00 ±0,02, medida en 4/4). |
| Cortes | Algo cambia cada 3-5 s. La cámara se corta en la pausa entre frases (mediana 0,09 s antes de la palabra). El jump cut se esconde bajo un cambio de panel o un punch-in. |
| Voz | 2,65-3,2 palabras/s, ninguna pausa de más de 0,6 s. **−13 LUFS**, sólo voz: sin música, sin whoosh, como mucho 4-5 «ding». |
| Subtítulos | Sin caja, blanco con contorno y sombra. Una palabra en color: karaoke amarillo #FDC72D (Sonnet) o palabra clave fija. 1-3 palabras. |
| Elementos | 6-9 nuevos cada 10 s. Logos al nombrarlos (−0,5/+0,3 s), de 14-35 % del ancho. 1-4 sellos rotados −5/−10° que caen de 120-130 % a 100 % en 3-4 cuadros. |
| Pruebas | 5-8 por video: la captura oficial en una tarjeta del 83-95 % del ancho, con el crédito de la fuente. |
| Zoom | Sólo de acento, 1-3 por video: golpe de +3 % que vuelve en 0,13 s, o punch-in de ×1,10-1,22. Nunca lento. |
| Gancho / cierre | Habla en el cuadro 0 con la prueba ya en pantalla (≤0,9 s). Cierra con remate de 3-10 s, una sola acción en 4-5 s, una tarjeta y «Bye». |
| Duración | 65-120 s. |

## Receta Erik (@eriktaveras), lo esencial

Medido en 6 reels de TikTok (22 al 30-sep) y contrastado con la ficha de IG.

| Parámetro | Regla (números medidos) |
|---|---|
| Layout | Cámara a pantalla completa como base. Pantalla partida para demos (pantalla 0-43,75 %). Láminas G de 1,5-3 s con chip «FUENTE: @handle». Entre layouts, sólo corte seco. |
| Set | Sentado, trípode, plano medio, cabeza al 29-32 %, ojos al 29-31 %, cara en x 0,60-0,62. Set oscuro con contraluz LED. Pecho libre del 50 al 75 % para las tarjetas. |
| Cortes | 3-5 cada 10 s, corte seco de 1 cuadro, cero transiciones. Ningún tramo de cámara de más de 8 s sin corte, zoom o tarjeta. |
| Subtítulos | Bloques de 3 palabras en MAYÚSCULAS, condensada heavy, blanco hueso sin caja. La activa en verde (en ONIA, #10C26B), un 6-11 % más grande. Van al 74 % del alto. Se apagan mientras hay una tarjeta de datos. |
| Tarjetas | Papel claro, ~820 px (76 % del ancho), entre el 51 y el 75 % del alto, sobre el pecho. Se despliegan en 0,13-0,2 s desde una línea, y cada pieza entra 0,05-0,1 s después de su palabra. Una nueva cada 4-6 s. |
| Sellos y números | 1-4 sellos, a −4/−8°, de 140-250 % a 100 % en 3-7 cuadros. Cada número dicho entra como contador o barra (0,4-1,5 s). |
| Zoom | Punch-in de 1,12-1,15× con ease-out de 0,3-0,5 s, en la primera palabra de una sección, en un sello o en el CTA. |
| Sonido | **−14 LUFS**, voz muy comprimida, 3,2-4,1 palabras/s, sin cama. Un brillo agudo (9-16 kHz, 0,4-0,7 s) cuando entra el CTA. |
| Cierre | CTA en los últimos 2,4-5,5 s, tecleado letra por letra con cursor: «COMENTA <PALABRA>» + lo que recibe. |
| Duración | 44-52 s (noticia o producto) o 105-127 s (top-N o tutorial). |

## Receta Pablo (@pabloinpublic), para los repos de GitHub

Fuente: `hermes-content/references/video-intake/2026-10-03-reels-genjutsu-y-fiesta-ia.md` §3 (reel `Dd66MLpuIc_`,
20,6 s, 113 comentarios sobre 142 likes; la madre verificó 6 cuadros a mano). Es Santiago con cuatro cambios, así que se
edita con `santiago.py` y su storyboard.

| Tramo | Qué va |
|---|---|
| 0-3 s | **A cámara** (layout `full`), tres dolores en una frase. El texto aparece en el cuadro 1. |
| 3-16 s | **Pantalla partida**: arriba GitHub en **modo oscuro**, con cursor y scroll; abajo la cara del busto para arriba. Una herramienta (o un paso) cada **~4 s**, con corte **seco** justo en la palabra que nombra la siguiente (`"corte": true`). |
| cierre | **A cámara** otra vez, con «comentá N», el número dicho y escrito. |

Lo que cambia contra Santiago:
1. **Subtítulo:** sans condensada bold en MAYÚSCULAS, de 2 o 3 palabras, a la altura del pecho. Solo la palabra clave
   va en amarillo (`#FDC82F`); el resto, blanco. No es karaoke palabra por palabra.
2. **Nunca se parte una palabra** entre renglones: en su reel se rompe «INSTALACIÓ / N» (cuadro de 19 s). El bloque es
   de un solo renglón; si no entra, baja el tamaño, no se corta. `Subtitulos.agrupar()` ya arma bloques por ancho sin
   partir palabras; a una palabra sola más ancha que `sub_ancho` le falta la guarda que baja el tamaño.
3. **Sonido:** música lo-fi bajita debajo de la voz, sin efectos. Santiago va sin música, así que hay que sumarla.
4. **Ritmo:** cortes secos, sin fundido ni barrido entre herramientas.

**Para hacer cuando llegue el primer bruto de un R:** `santiago.py --estilo pablo`. Tiene que poner el subtítulo en
mayúsculas condensadas, la palabra clave fija en amarillo, la guarda de tamaño, la música bajo la voz y los cortes
secos. Se prueba con `--fotos` sobre ese bruto antes del render. No se escribe antes: sin bruto no hay contra qué
probarlo.

**Lo que NO se copia:**
- el español de España («se traga», «léete»): va voseo;
- el micrófono en la mano: nuestra regla es solapa en la remera, por el ruido de roce;
- el «comentá N» automático: hasta que funcione el mensaje privado, los comentarios se contestan a mano.

⚠ **Largo:** su reel dura 21 s con 3 herramientas. Nuestros guiones R y G hablan de UN repo en ~60 s (170-177
palabras, medido el 3-oct). La edición toma el layout y el ritmo; acortar a 21 s es cambiar el guion, y eso lo decide
Sergio Urcullo.

## Molde Boceto (@theaigeekk), sin cara: el boceto a mano y al lado lo que salió

Fuente: `hermes-content/references/video-intake/2026-10-04-reel-theaigeekk-dibujo-a-animacion.md` (reel `DeDZx1BopXS`,
12 s, 1.791 comentarios sobre 1.492 likes; mirado en 12 cuadros a 1 fps, los primeros 3 s a 4 fps, cortes por
detección de escena y audio medido). No es un talking head: se arma con **HyperFrames** (skill `hyperframes`), no con
`santiago.py`.

| Qué | Cómo |
|---|---|
| Lienzo | 1080x1920 negro. |
| Izquierda (≈30 % del ancho) | Etiqueta «Boceto» y la FOTO del dibujo a mano de esa escena. Cambia junto con la derecha. |
| Derecha (≈55 % del ancho) | La animación de esa escena, a la misma altura, con una etiqueta fija arriba (la herramienta que la hizo). |
| Abajo, fijo desde el cuadro 0 | «Comentá PALABRA», con la palabra en el color de acento. |
| Ritmo | Una escena nueva cada 1,5-2 s. Las transiciones van DENTRO de la animación (zoom-through, anillo, barrido). Un solo corte seco, el cambio de fondo, cerca del final. |
| Primeros 3 s | Movimiento en el cuadro 0 (nada de cuadro vacío). Título escrito a los 0,5 s y elementos entrando al segundo 1. |
| Sonido | Solo música pareja (−14 LUFS), sin voz. |
| Largo | 12 s. |

**Cómo se hace de verdad:**
1. Sergio Urcullo dibuja 4 a 6 escenas en papel y les saca foto.
2. Claude Code arma la composición de HyperFrames con esas escenas, y se renderiza local, gratis.
3. El video monta las dos cosas lado a lado. La etiqueta de arriba dice la herramienta REAL («Claude Code»), no
   «Opus 5.5 en Higgsfield».

**No se copia:**
- el «mató a los editores», que es mensaje de marca del programa de creadores de Higgsfield;
- un boceto inventado después de la animación: el dibujo tiene que ser el de antes.

**Estado (4-oct):** sin prueba todavía. La primera se hace con un boceto real de Sergio Urcullo, y es una pieza nueva:
la aprueban él o la madre.

## Los scripts

| Receta | Script | Comando |
|---|---|---|
| Santiago | `scripts/santiago/santiago.py` (+ `capturar.mjs`, `storyboard-n03.json`, `README.md`) | `python3 santiago.py --bruto <bruto.mp4> --cutplan <cutplan.json> --transcript <words en tiempo de salida> --storyboard <sb.json> --out <out.mp4>`. Opciones: `--plan` (línea de tiempo y tabla de aire, sin render) · `--fotos 0.5,12,30` · `--sin-aire` |
| Erik | `scripts/erik/erik_edit.py` (+ `capturar.mjs`, `capturas-n03.json`, `storyboard-n03.json`, `README.md`) | `node capturar.mjs capturas.json assets` y después `python3 erik_edit.py --bruto … --cutplan … --transcript … --storyboard … --salida <out.mp4> --hojas <dir>`. Con `--cuadros 1.5,12,40` sólo saca cuadros, en ~30 s. Usa Vosk para los tiempos; la instalación está en su README |

Los tiempos salen de las PALABRAS del transcript, nunca a mano. Cada storyboard de ejemplo es el de N03; para un video
nuevo se copia y se cambian los eventos (palabra que dispara + qué entra).

## Cómo tiene que GRABAR Sergio Urcullo para que salga tal cual

Lo que el QA marcó de gravedad alta no se arregla editando:
1. **Trípode y cámara fija**, plano medio. Con el teléfono en la mano, Santiago no puede trasladar la toma y Erik no
   tiene pecho libre para las tarjetas.
2. **Micrófono de solapa o de brazo, no en la mano.** El de mano tapa la cara, mete unos 159 roces en el bruto de N03 y
   choca con las tarjetas sobre el pecho.
3. **Para Erik:** set oscuro con una luz de contra y la cara corrida a la derecha (x 0,60).
4. **Una toma de cierre de unos 4 s** con remate y despedida, por ejemplo «Auto para el día a día; manual si tu main
   hace deploy. Chau». Sin esa toma, Santiago termina en seco.
5. Hablar por bloques, con una idea por bloque y una pausa entre bloques: ahí caen los cortes y los cambios de panel.

## Prueba (3-oct-2026, sobre el bruto de N03)

| Receta | Video | QA antes del arreglo | Lo que quedó sin resolver |
|---|---|---|---|
| Santiago | 65,2 s, −13,1 LUFS | 6,5/10 | Cierre sin remate (falta la toma), encuadre de mano, el aire mueve el cutplan aprobado: la tabla de aire tiene que verla Sergio Urcullo |
| Erik | 53,1 s, −14,0 LUFS | 6/10 | Set y encuadre (hay que regrabar), tarjetas sobre el pecho tapadas por la mano y el micrófono |

Los MP4 y las hojas de control quedan en el scratchpad de la sesión del 3-oct (no se versionan); la madre los revisa
antes de que lleguen a Sergio Urcullo.

## Trampas ya pagadas (3-oct-2026)

- **El bruto puede venir ya editado** (el de N03 traía 5 tomas pegadas). Los saltos se detectan con picos aislados de
  diferencia entre cuadros (>5× la mediana y >2,5× sus vecinos) y se tratan como cortes. Si no, el control dice
  «ningún corte a la vista» y es falso.
- **Whisper corre el final de las palabras hasta 0,4 s** y el inicio ±0,1-0,3 s. Las pausas se miden con la energía del
  bruto, y los inicios se alinean con **Vosk small-es** (local, 40 MB, ±0,03 s). Vosk parte o junta palabras
  («.claude» → «punto clave», «con trabajo» → «contrabajo»): hace falta alinear con fusiones 1:2 y 2:1. El paquete `srt`
  no compila: `pip install --no-deps vosk cffi` y un stub de `srt` en `sys.modules`.
- **Con el micrófono de Sergio Urcullo, la pausa no se mide con un umbral pegado al piso** (ruido de −42/−30 dB y
  soplidos). Funciona así: voz = P75 − 8 dB; fricativa = banda de 3-8 kHz sobre el piso + 13,5 dB.
- **Al apretar un hueco, dejá 0,12 s antes de la palabra**: la /f/ de «force» empieza 0,08 s antes que la vocal.
- **El teléfono corta a cero unos 0,1 s en algunas pausas** (gate del teléfono, no un empalme): se rellena con room
  tone de la misma toma.
- **Un hueco apretado es un jump cut**: pegado a otro corte deja un plano-flash. Se esconde bajo un cambio de apoyo.
- **El ruido de esta sala no se va con `afftdn`** (50-800 Hz, no estacionario): baja 2 dB. No prometas audio limpio:
  se graba mejor.
- **Medir el zoom con el FONDO, no con la cara.** La cara crece cuando él se inclina. El ×1,4 que se midió el 3-oct
  en Animaciones era eso: con template matching del póster del fondo dio escala 1,00.
- **Bajar los reels desde la nube:** `pip install "yt-dlp[default,curl-cffi]"` y `yt-dlp --impersonate chrome`. TikTok
  anda; Instagram da 429 sin sesión, y para IG las fichas las saca la madre con el Chrome de la PC.
- **Preparación por reel que sirve para medir:** hojas de 2 fps con el segundo impreso
  (`fps=2,scale=216:-2,drawtext=…%{pts\:hms}…,tile=5x4`), cortes con `select='gt(scene,0.25)',showinfo`,
  `ebur128` y transcript con palabras.

## Plan de la semana (8-oct-2026): cómo se arma sin rehacer guiones

Pedido de la madre del 8-oct, en `docs/cola/plan-3-semanas/GRABAR-9-15-OCT.md`. Lo arma `gen_semana.py`, que está en el
scratchpad de esa sesión; el método:
1. **Una hora por día = tres verticales** (~20 min cada uno con tomas), o un YouTube (~35 min) más un vertical.
2. **Orden:**
   - primero la noticia más fresca;
   - después las piezas que van con un carrusel ya agendado, para que el recurso ya esté en la comunidad;
   - al final el resto.
3. **El texto sale de `GRABAR-2-14-OCT.md` de main**, que enseña con pasos, ejemplo, cómo sabés que funcionó y palabra.
   La versión de Codex del 6-oct (`codex/madre-orquestacion-20261005`) recortó los pasos: de ella se toman solo las
   correcciones de datos.
4. **El dato se verifica el mismo día con WebFetch** sobre la página oficial. Desde la nube funcionan
   `platform.claude.com` (precios y modelos), el changelog de `code.claude.com`, `developers.googleblog.com`,
   `antigravity.google` y `geminicli.com`. Chromium no abre esas páginas, así que la captura para el video la saca una
   sesión con Chrome.
5. **El modelo nuevo de la semana se agrega a toda pieza que compara modelos.** El 7-oct salió Haiku 5.5 (0,10 / 0,50
   por millón de tokens, diez veces menos que Haiku 4.5), y el YouTube D01-C «Opus o Sonnet» lo nombra. Es la misma
   trampa que Fable 5.1 el 3-oct.

## Publicar sin OK pieza por pieza (8-oct-2026): qué hace falta de verdad

- **La autorización:** Sergio Urcullo, 8-oct, por la madre: *«sí, publicá por Buffer lo que pase control de calidad»*.
  Está en el `CLAUDE.md` de la rama de la madre (`ad011a95a`), todavía no en `main`.
- **Mensaje de otra sesión:** el control de permisos de una sesión en la nube no lo toma como pedido del usuario. Frenó
  hasta subir el texto y los metadatos al VPS («Unrequested Commit in a Connected App»). No se le busca la vuelta. Para
  publicar hace falta una de dos:
  - que Sergio Urcullo lo pida EN ESA sesión: así salieron los 33 carruseles el 5-oct;
  - que la regla esté en el `CLAUDE.md` de `main`.
- **Control de calidad de un video ya editado (N03, 8-oct):**
  - medir con `ffprobe` (duración y tamaño) y `ebur128` (−13 a −14,5 LUFS);
  - hoja de un cuadro cada 2 s con el segundo impreso, vista entera, para revisar tarjetas y subtítulos sin faltas;
  - releer cada dato contra la doc oficial EL MISMO DÍA. Para el modo auto, `code.claude.com/docs/en/permission-modes`:
    v2.1.283, la lista de lo que bloquea por defecto y `⏸ manual mode on`.

## Relacionadas

- `editor-videos`: corte, transcripción, regla de oro, ortografía y master. Este skill se monta encima.
- `diseno-contenido-onia`: logos oficiales, capturas y paleta ONIA.
- Mediciones previas: `hermes-content/references/video-intake/2026-10-01-santiago-erik-edicion-medida.md`.

## Formatos y orden de grabación (3-oct)

Guía de formatos (a cámara Erik/Rocha, pantalla verde, pantalla partida, demo, top, b-roll, YouTube horizontal), con
sus fuentes, y el orden de grabación POR ESCENA, no por fecha: `hermes-content/docs/cola/plan-3-semanas/PLAN-GRABACION-3-OCT.md`.
**Pantalla verde: el paso ya existe** (3-oct): `editor-videos/scripts/fondo-verde.mjs`, con su trampa en la skill
`editor-videos` (chromakey mide solo el color, no el brillo: con la tela en sombra se comía la camiseta). Se calibra con
la primera toma real (`--chequeo`); si la tela no queda limpia en 1 hora, pantalla partida (Santiago) y se avisa. Por
eso el bloque verde se sigue encuadrando con la cabeza en la mitad de abajo.

**Antes de grabar, las piezas REVISAR se vuelven a mirar contra su fuente, el mismo día** (3-oct, 10 piezas, 2
agentes en paralelo). Ningún dato se había dado vuelta; lo que fallaba era lo INCOMPLETO, y eso es lo que se busca:
- **el modelo nuevo que falta** (D01-C comparaba Opus y Sonnet 5.5 sin nombrar a Fable 5.1, que es más alto);
- **la excepción que contradice a otra pieza** (S2-D08-C decía «cada respuesta se paga» y D02-B «los primeros mil,
  gratis»);
- **la condición que rompe la demo** (N04: la skill `verify` se carga al arrancar la sesión y no corre en commits solo
  de docs; crearla en vivo y pedir el commit no la hubiera mostrado). Una demo de una función nueva se prueba una vez
  antes de grabar, en las mismas condiciones.
- La página «linda» de la empresa puede estar vieja (business.whatsapp.com seguía diciendo 72 horas y servicio
  gratis): en pantalla va la doc de desarrolladores, con su fecha de actualización.
