---
name: edicion-referentes
description: Invocar ANTES de editar cualquier video NUEVO de Sergio Urcullo (talking head vertical de marca personal) desde el 3-oct-2026. Replica TAL CUAL el montaje de Santiago Muñoz (@sanmunoz.ia) y de Erik Taveras (@eriktaveras), medido reel por reel con evidencia (reel + segundo). Trae una receta por referente, un script por receta que edita desde bruto + cutplan + transcript + storyboard, cómo hay que grabar para que salga igual y las trampas ya pagadas. editor-videos sigue siendo el motor de corte, transcripción y regla de oro.
---

# Edición de referentes: Santiago Muñoz y Erik Taveras, TAL CUAL

> **Decisión de Sergio Urcullo (2-oct-2026), textual:** *«la sesión de marca personal editó como el video de Fable vs
> Astra, ese que lo haga así, pero a partir de después de eso, con el formato de los referentes, y creamos la nueva
> skill de edición»*. Y antes: *«lo que quiero que hagas tal cual son los videos de Eric Taveras y Santiago Munoz»*.
> El reel de Codex del 14-sep (`references/video-intake/2026-09-14-reel-astra-fable-codex/`) y «Tu primera
> automatización» (`videos/marca-personal/2026-09-21/`) son REFERENCIA de lo que a él le gustó, no el molde.

## Cuándo y qué

- **Todo video nuevo de Sergio Urcullo** se edita con UNA de las dos recetas. N03 (modo auto) quedó al estilo Codex
  por decisión suya y no se rehace.
- **¿Cuál de las dos?** Si el guion es una noticia con prueba (captura oficial, tabla, titular), va **Santiago**:
  pantalla partida con la prueba arriba. Si es un tutorial, un top-N o un producto con datos que se arman, va
  **Erik**: tarjetas de datos sobre el pecho, sellos y karaoke de 3 palabras. Si dudás, preguntale a Sergio Urcullo.
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

## Relacionadas

- `editor-videos`: corte, transcripción, regla de oro, ortografía y master. Este skill se monta encima.
- `diseno-contenido-onia`: logos oficiales, capturas y paleta ONIA.
- Mediciones previas: `hermes-content/references/video-intake/2026-10-01-santiago-erik-edicion-medida.md`.
