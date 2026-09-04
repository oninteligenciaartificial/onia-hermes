# Banco del 2026-09-01

Generadas con `lucia-skin-v1` (`58bbd635-…`) desde el navegador, Nano Banana Pro, 2K,
1792×2400, 2 créditos. Técnica en [`../TECNICA-HIGGSFIELD.md`](../TECNICA-HIGGSFIELD.md).

| Archivo | Qué es | Asset id | Estado |
|---|---|---|---|
| `B06-consultorio-dental.jpg` | Mostrador de un consultorio dental, entregando la tarjeta de turno a una paciente mayor | `bc3db11b-9e82-47ae-a312-ebecac69e189` | ✅ **La mejor del banco** |
| `B07-ferreteria-9x16.jpg` | Ferretería de barrio, entregando una bolsa de tornillos a un cliente | `4eb429ec-c734-4e5e-a263-895d9b7f315a` | ✅ **La PRIMERA en 9:16** |

## B06 — por qué es la mejor

**Llena el hueco que rompía los creativos.** Los 8 anuncios hablan de clínica dental y el banco
no tenía ni una foto de consultorio: quedaba *«tu clínica no puede depender de un cuaderno»*
sobre la foto de un almacén. Ahora el copy dental tiene su escena.

**Y tiene la acción a medias más clara que se generó hasta ahora:** cuatro manos sobre la misma
tarjeta. Es el mismo patrón de `G05-oficina-de-tramites`, que dio `V05`, el mejor video del banco.
Por eso **es la primera candidata a animar**.

Lo demás que sale bien: pecas visibles y pelo suelto (cara fiel al ancla), dos tubos fluorescentes
con cast verde sobre la pared descascarada, sillas de plástico, vitrina con cajas, esterilizador,
calendario. Luz real del lugar, no luz de estudio.

## 🔴 El hallazgo: por qué acá SÍ funcionó la regla de los carteles

En `B05-micro` la línea `no legible text anywhere in frame` **falló** — el modelo escribió
`CARHEDA BIT. 20` igual. Acá funcionó: no hay un solo texto inventado legible.

**La diferencia no es la instrucción, es el resto del prompt.** El de B05 pedía explícitamente
*«a handwritten fare sign taped to the wall»*. O sea que yo mismo le pedía el cartel, y después
le pedía que no fuera legible. **Gana la instrucción que pone el objeto.**

**La regla corregida:** no alcanza con pedir «sin texto legible». Hay que **no pedir el cartel**.
Si la escena necesita uno, se nombra como superficie y no como cartel — «una pared con papeles
pegados», no «un cartel de tarifas escrito a mano».


---

## ✅ V06 — el video de B06, bajado y verificado

`V06-dental-animate-kling3.mp4` · asset `7dcf2c0a-9635-4f50-bc16-f325467cfa4d` · 5,04 s · 121 frames · **sin pista de audio** · 6,25 cr.

**Funciona.** Mirado con `_V06-TIRA.jpg` (4 frames): el traspaso se COMPLETA — ella suelta la tarjeta, la paciente la toma y baja la vista, ella retira la mano al mostrador. La cara aguanta los 5 s, no inventa habla ni gira de más. Confirma otra vez la regla: con acción a medias clara el modelo continúa en vez de actuar.

**Ajustes usados y verificados en pantalla:** Kling 3.0 · 5 s · **720p** · botón **✦ 6,25**.

**El prompt se reescribió, y eso casi cuesta 6,25 créditos tirados.** `Turn to video` **arrastra
el prompt de la generación anterior**: al abrirlo traía el de `V05-oficina` —*«the clerk lets go
of the stamped form»*, *«scratched glass»*— con el frame dental cargado. O sea que el frame es
nuevo y el texto es viejo. Si se aprieta Generate sin mirar, Kling anima la escena equivocada.

🔴 **Regla nueva: `Turn to video` NO limpia el prompt. Leerlo y reescribirlo SIEMPRE antes de
generar.**

⚠️ Y una trampa de UI: `ctrl+a` dentro del campo de prompt del workspace de VIDEO selecciona la
**página entera**, no el campo — pasó dos veces. Lo que sí funciona es **`triple_click` sobre el
`ref` del textarea** y después escribir.

**Dato a confirmar al bajarlo:** el historial mostró **9:16** junto a 720p y 5 s. Si el MP4 sale
vertical de verdad, se acabó el problema de formato para Meta Ads, donde todo el banco venía en
828×1108.


## 🔴 El 9:16 de la interfaz NO es el 9:16 del archivo

La pregunta que el loop arrastraba desde el 31-ago tiene respuesta, y es la mala.

El historial de Higgsfield mostraba **`720p · 5.0s · 9:16`** junto a esta generación. El archivo
bajado mide **828×1108** — exactamente lo mismo que los cinco videos del 28-ago. **No es 9:16,
es ~3:4.**

O sea que **la etiqueta de la interfaz no describe el archivo**. Seguimos sin un solo video
vertical, y Meta Ads lo pide para Reels y Stories. Las salidas siguen siendo dos: re-encuadrar
con el editor, o encontrar dónde se fija de verdad el aspecto antes de generar — el selector del
workspace, no el que muestra el historial.

## ⚠️ En el workspace de VIDEO, `Download` está escondido

No hay botón visible. Está **dentro del menú `…`** de la pieza, junto a Virality Predictor,
Regenerate, Publish y Delete. Distinto del panel de detalle de una IMAGEN, donde `Download` sí es
un botón a la vista.


## ✅ B07 — la primera imagen vertical del banco

**1536×2752 · ratio 0,558**, contra 0,563 que sería 9:16 exacto. **Es vertical de verdad**, y las
16 anteriores eran 3:4 (0,750).

**Cierra el bloqueo del formato para Meta Ads.** La cadena quedó probada de punta a punta:
poner **9:16 en el selector de aspecto del workspace de IMAGEN** — que estuvo ahí todo el tiempo,
en 3:4 por defecto — y el resto sale solo. **El precio no cambia: siguió en ✦ 2.**

La escena también sirve: estantes de madera atiborrados, sogas colgadas, latas de pintura,
tornillos sueltos, piso de concreto, cortina metálica al fondo. Bombilla colgante más luz cálida
de la puerta abierta. Y la acción a medias es de las más claras del banco: **cuatro manos sobre
la misma bolsa de papel**, que es el patrón que dio `V05` y `V06`.

**Lo próximo:** animarla con `Turn to video`. Si el video hereda el aspecto del frame —que es lo
que dice §7 de la técnica—, este va a ser **el primer video vertical**, listo para Reels y ads.


---

## ✅ V08 — B07 animada, y el PRIMER video vertical de verdad HECHO POR CLI

`V08-ferreteria-seedance.mp4` · **720×1280 = 9:16 exacto** · 4,04 s · 97 frames · **con pista de
audio aac** · modelo `seedance1_5` · **4,8 cr** (costo medido antes de generar, confirmado).

**Lo generó el loop del VPS por CLI, sin navegador**, animando `B07-ferreteria-9x16`, la imagen
que este mismo LEEME dejaba marcada como *«lo próximo: animarla»*.

| | |
|---|---|
| **Archivo** | `V08-ferreteria-seedance.mp4` |
| **Fuente** | `B07-ferreteria-9x16.jpg` |
| **start_image (asset id de B07)** | `4eb429ec-c734-4e5e-a263-895d9b7f315a` |
| **Modelo** | `seedance1_5` · 9:16 · 4 s · 720p · `generate_audio=true` |
| **job_id del video** | `b4754470-79ca-45f9-9f32-7d2816e46333` |
| **Salida** | 720×1280, 4,04 s, 97 frames, ~8,0 MB |

**Verificación — MIRADO** (`_V08-TIRA.jpg`, 4 frames a 0,1 / 1,3 / 2,6 / 3,9 s): el traspaso se
**completa** — ella sostiene la bolsa, la pasa, el cliente cierra las manos sobre ella y toma el
peso, y ella baja las manos al mostrador. **No inventa habla ni giros** —el defecto de V04—: la
boca queda cerrada, la mirada calma. La cara aguanta los cuatro frames: pecas, argolla dorada,
cejas gruesas, **piel de tono parejo sin rojez** (no es la «muerta»). Colores true-to-life, ningún
cartel legible. Es el mismo comportamiento bueno que V05/V06: con acción a medias clara el modelo
**continúa** en vez de actuar.

⚠️ El pelo sale recogido, no suelto — pero eso **viene de la fuente B07**, no de la animación
(la generación por asset id ya recogía el pelo, anotado en `TECNICA §11`). El video sólo continúa
la imagen que le dieron.

**Prompt de animación** (para reproducir/afinar):
> Handheld iPhone shot inside a small neighbourhood hardware store in Santa Cruz. The shopkeeper
> finishes handing over the paper bag of screws; the customer's hands close around it and take its
> weight. The woman blinks and shifts her head a fraction, eyes calm, not posing. Subtle natural
> handheld micro-movement, real warm light from the open doorway. NATURAL TRUE-TO-LIFE COLORS.

🔴 **Confirma la cadena de video por CLI de punta a punta:** `generate cost` → `generate create`
con `--start-image <asset-id>` → URL directa → `curl`. Sin navegador, sin menús escondidos, y con
el asset id anotado se re-anima sin volver a pagar la imagen.


---

## ✅ V09 — B08 (taller mecánico) animada por CLI, con la fuente LOCAL como start-image

`V09-taller-seedance.mp4` · **720×1280 = 9:16 exacto** · 4,04 s · 97 frames · **con pista de audio
aac** · modelo `seedance1_5` · **4,8 cr** (costo medido antes de generar, confirmado).

Cierra el último hueco de video del banco: `B08-taller-9x16-CLI` era la única imagen limpia y
publicable que seguía **sin animar**. Ahora los 12 lugares del banco tienen su video.

| | |
|---|---|
| **Archivo** | `V09-taller-seedance.mp4` |
| **Fuente** | `B08-taller-9x16-CLI.jpg` |
| **start_image** | ruta local `generadas-20260901/B08-taller-9x16-CLI.jpg` (auto-subida por el CLI — B08 no tenía asset id anotado) |
| **Modelo** | `seedance1_5` · 9:16 · 4 s · 720p · `generate_audio=true` |
| **job_id del video** | `d014a51c-8515-478a-8b4f-97783c5001df` |
| **Salida** | 720×1280, 4,04 s, 97 frames, ~8,0 MB |

**Verificación — MIRADO** (`_V09-TIRA.jpg`, 4 frames a 0,1 / 1,3 / 2,6 / 3,9 s): el traspaso de la
llave se **completa** — las dos manos sobre la misma llave, el cliente la toma, y ella baja las
manos hacia el banco mientras él busca otra herramienta. **No inventa habla ni giros:** boca
cerrada, mirada calma, sin rotar de más. La cara aguanta los cuatro frames — pecas, cejas gruesas,
argolla dorada, tono de piel parejo. Colores true-to-life, ningún cartel legible. Mismo
comportamiento bueno que V05/V06/V08: **con acción a medias clara el modelo continúa en vez de
actuar.**

⚠️ El pelo sale recogido, no suelto — pero eso **viene de la fuente B08** (`TECNICA §11`: la
generación por referencia recoge el pelo), no de la animación.

🔴 **Aporte nuevo de esta vuelta:** `--start-image` **acepta la ruta local del `.jpg` y la sube
sola**. Ya no hace falta tener el asset id anotado para re-animar una pieza — si la imagen está en
el repo, se pasa el path y listo. Sirve justo para las piezas viejas cuyo id nunca se guardó.

**Prompt de animación** (para reproducir/afinar):
> Handheld iPhone shot inside a small neighbourhood motorcycle repair shop in Santa Cruz. The woman
> in a blue mechanic's apron finishes handing over the metal socket wrench; the male customer's hand
> closes around it and takes its weight, then she lowers her free hand toward the workbench. She
> blinks and shifts her head a fraction, eyes calm, mouth closed, not posing. Subtle natural
> handheld micro-movement, real warm light from the open garage doorway behind her, the parked
> motorbike and parts shelves staying still. NATURAL TRUE-TO-LIFE COLORS.
