# La herramienta lee el video mejor que yo — probado y gratis

**2026-08-19.** Sergio preguntó si convenía que mandara el archivo en vez del link, y si había
una forma mejor de aprender cómo se hacen los videos. Buscando la respuesta apareció algo que
cambia el carril entero.

---

## Qué es

`video_analysis_create`, del MCP de Higgsfield que **ya tenemos conectado**. Hace un análisis
**escena por escena** de cualquier video: para cada escena devuelve `timestamp_start`,
`timestamp_end`, `shot_type`, un `label` de función narrativa, la descripción **visual** y la
descripción del **audio**.

## La prueba, con números

Se corrió sobre el reel del anuncio de auto ([ficha](2026-08-18-ugc-auto-receta-completa.md)),
47 s:

| | |
|---|---|
| Escenas devueltas | **25** |
| Tiempo | **55 segundos** (de `queued` a `completed`) |
| Créditos antes | 2.567,78 |
| Créditos después | **2.567,78** |
| **Costo** | **cero — medido, no supuesto** |

Salida completa guardada en
[analisis/DcMW3Coi6BN-escenas.md](analisis/DcMW3Coi6BN-escenas.md) (las 25 escenas en tabla).

## Lo que encontró y yo me había perdido

Esto es lo que importa. Yo leí 6 de 8 fotogramas y el audio entero, y aun así:

| Lo que se me pasó | Lo que dice el análisis |
|---|---|
| **El tercer beat de diálogo.** En la transcripción tenía un `[26] 110!` suelto que no supe explicar | *"The woman shouts, **'A hundred and ten thousand dollars, and it's yours!'**"* — es el remate del guion, el precio |
| **Una segunda secuencia entera** (escenas 14-19, 9 segundos) | otra mujer, **vestido negro**, camino costero: camina hacia el auto, **golpea dos veces el vidrio**, se sube, manos al volante, aprieta el botón de arranque, y el auto sale por la costa. **Otra locación, otra ropa: el anuncio tiene DOS escenarios, no uno** |
| **El plano de revelado** (escena 5) | el auto tapado con una tela negra en estudio oscuro, y la tela se tira hacia atrás |
| **La secuencia de chat** (escenas 20-23) | la conversación con el comprador, burbuja verde, y el estado **"delivered"** — la "prueba" del negocio |
| **El mapa del marketplace** (escena 3) | mapa con **pines naranjas de precio** y grilla de publicaciones al costado |

Cinco hallazgos, ninguno inventado, en 55 segundos y sin gastar.

## Y da gratis una taxonomía de anuncio

El campo `label` clasifica cada escena por **función narrativa**. En este anuncio salieron seis,
y ordenadas dan el molde completo de una pieza de 46 segundos:

| Tramo | Función | Qué pasa |
|---|---|---|
| 0:00-0:02 | **Opening Hook** | el auto sobre fondo blanco, logos flotando |
| 0:02-0:12 | **Product Information** | el marketplace, el chat, arrastrar la foto al prompt |
| 0:12-0:19 | **Product Selling Points** | el auto en estudio: revelado, capó, interior, llanta, carrocería |
| 0:19-0:27 | **Real Experience** | los tres beats de diálogo UGC en el garaje |
| 0:27-0:36 | **Usage Scenarios** | el segundo escenario: camino costero, arranque, manejo |
| 0:36-0:46 | **Real Experience → Call to Action** | la ficha del vendedor, el chat con "delivered", los tres logos |

Eso es un vocabulario de estructura publicitaria que no teníamos, y sale solo.

## El límite, dicho por la propia herramienta

> *"the longer the video, the less accurate the scene-by-scene analysis becomes — short clips
> give the most reliable results."*

Para un reel de 15-60 s es ideal. **Para el taller de 44 minutos no sirve**: ahí siguen valiendo
los fotogramas y la transcripción por tramos.

Y **no reemplaza leer el prompt en pantalla**: el análisis describe *qué pasa*, no *con qué texto
se generó*. En este mismo reel, la lámina "Save the prompt" aparece descrita como una pantalla,
no transcrita. **El prompt se lee con los ojos, siempre.**

## Cómo queda el ciclo del carril

```
link → fetch-video.mjs (1,7 s)
     → media_upload + media_confirm
     → video_analysis_create  ← GRATIS, ~1 min, 25 escenas
     → leer fotogramas SOLO donde el análisis dice que hay texto en pantalla
     → transcribir con Whisper para el verbatim literal
     → ficha
```

**El cambio real:** antes leía 40 fotogramas a ciegas buscando dónde estaba lo bueno. Ahora el
análisis dice dónde mirar, y los fotogramas se usan para lo único que el análisis no da: **leer
el texto exacto en pantalla**.

## El otro lado: `ad_reference`

Marketing Studio tiene `ad_reference_id`, que *"follows the analyzed scenario of an existing
reference video (scene composition, pacing, hook, narration) instead of inventing a structure
from the prompt alone"*.

O sea: al anuncio que analizamos se le puede pedir que lo **replique con nuestro producto y
nuestro avatar**. Hoy tenemos **0 referencias creadas** (`ad_reference` list = vacío).

**Crear la referencia es gratis. Generar el video cuesta créditos.** Ese segundo paso sigue
necesitando el OK de Sergio, caso por caso.

## Lo que NO se probó

- No se midió si el análisis tiene cupo diario. Una corrida salió gratis; **no está probado que
  cien también**.
- No se probó `ad_reference` de punta a punta, porque el paso final gasta.
- No se probó la vía `youtube_url` (evita subir el archivo, pero solo sirve para YouTube).
