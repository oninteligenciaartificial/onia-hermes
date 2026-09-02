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

## ⚠️ V08 — ferretería · 9:16 real, pero la cara DERIVA · `🔧 REGENERAR`

`V08-ferreteria-seedance.mp4` · job `6e2c730d-aae8-41b6-929c-fe191ddc03d9` · **720×1280 (9:16 exacto)** · 4,05 s · 97 frames · **con audio** · `seedance1_5` · **4,8 cr** (medidos antes de generar).
Animada desde `B07` (asset `4eb429ec-c734-4e5e-a263-895d9b7f315a`) con `--start-image`.

**Lo que salió bien:** el formato. Es el segundo video vertical real del banco, con audio y al
precio más bajo medido. Y la acción a medias **se completa**: suelta la bolsa, el cliente toma el
peso, ella retira la mano al mostrador.

**Lo que salió mal — y por eso no se publica:** mirados los 4 frames (`_V08-TIRA.jpg`), **la cara
deriva en la segunda mitad**. En los frames 1-2 es Lucía; en el 3-4 la mandíbula se afila, las
cejas cambian y el pelo queda tirante en vez de suelto. En el frame final **no es la misma
persona** del inicial. Puntuación **8/9**: falla la casilla 9 (la cara aguanta el clip entero),
que arrastra a la 1.

### 🔴 La regla que sale de acá: la acción tiene que terminar CON LOS DOS en cuadro

Comparado contra los tres videos que sí funcionaron, la diferencia es una sola:

| Video | Qué pasa con el segundo personaje | Cara |
|---|---|---|
| `V05` oficina | se queda en cuadro | ✅ aguanta |
| `V06` dental | se queda en cuadro | ✅ aguanta |
| `V07` peluquería | se queda (y ella está frente al espejo, quieta) | ✅ aguanta |
| **`V08` ferretería** | **sale de cuadro a mitad del clip** | ❌ **deriva** |

Cuando el otro personaje se va, el modelo se queda **sin referencia de escala ni de ángulo** y
reconstruye la cara de cero. No alcanza con pedir una acción a medias: **el prompt tiene que
dejar a los dos en cuadro hasta el final.**

**Al regenerar:** cambiar `she draws her hand back toward the counter` por algo que retenga al
cliente — que siga mirando la bolsa, que la abra ahí mismo. **Una sola variable.**

⚠️ No confundir con `V04`, que se guarda roto a propósito. Éste **sí se regenera**: el defecto ya
está explicado acá y el archivo no aporta evidencia nueva una vez leída esta nota.

---

## ✅ V09 — taller mecánico · el PRIMER vertical que aguanta la cara

`V09-taller-seedance.mp4` · job `3c90bae3-59fb-416b-969d-29aca36bacda` · **720×1280 (9:16)** · 4,05 s · **con audio** · `seedance1_5` · **4,8 cr**.
Animada desde `B08-taller-9x16-CLI` (asset **`5f9e643f-751b-4984-8dfd-7032b4a553bc`** — no estaba anotado en ninguna parte, se recuperó del historial del CLI).

**Mirado en `_V09-TIRA.jpg`, 4 frames: la cara aguanta los cuatro.** Cejas, nariz, mandíbula, el
aro y la cadenita son los mismos en el primero y en el último. Casilla 9 ✅ — es el primer video
vertical del banco que la pasa.

### La confirmación: una variable cambiada, resultado opuesto

V08 y V09 se generaron con el **mismo modelo, mismo aspecto, mismo costo y la misma hora**. Lo
único distinto fue una frase del prompt:

| | `V08` ferretería | `V09` taller |
|---|---|---|
| Frase | `she draws her hand back toward the counter` | `he keeps it low over the workbench and **STAYS in frame** in the foreground` |
| Segundo personaje al final | fuera de cuadro | **brazo y herramienta en cuadro** |
| Cara | ❌ deriva (8/9) | ✅ **aguanta (9/9)** |

🔴 **Regla confirmada: el prompt tiene que RETENER al segundo personaje hasta el último frame.**
No alcanza con que la acción sea a medias — si el otro se va, el modelo pierde la referencia de
escala y ángulo y reconstruye la cara. No hace falta que se vea entero: **con el brazo y el objeto
alcanza**, que es lo que pasa acá del frame 2 en adelante.

**Cómo se escribe:** poner el verbo de permanencia explícito y en mayúsculas (`STAYS in frame`),
y darle al segundo personaje algo que seguir haciendo ahí mismo — no un motivo para irse.

### Pendiente menor

El pelo sale **recogido**, no suelto como pide la receta. Viene así desde `B08`, no lo introdujo
la animación. Se corrige en la imagen fuente, no en el video.

---

## ⛔ B09 — restaurante de almuerzo · LA CARA NO ES LUCÍA · contraejemplo, NO usar

`B09-restaurante-almuerzo.png` · job `7fa1d766-89af-4ce2-bee0-03dab6a6eb36` · 1536×2752 (9:16) · `nano_banana_pro` 2K · **2 cr**.
Generada por CLI pasando **`--image-references bc3db11b-…`** (el asset de `B06`, la mejor cara del banco).

**La escena salió muy bien** y por eso duele: plato de almuerzo boliviano creíble, el comensal con
las dos manos ya sobre el plato **y visible en primer plano** (justo lo que pide la regla de V09),
jarra de refresco, sillas de plástico, ventilador de techo, luz de mediodía mezclada con
fluorescente. Cero texto legible. Pelo suelto, como se pidió.

🔴 **Pero la cara es de otra persona.** Rostro más redondo, otras cejas, sin pecas, sin la cadenita
ni el aro. No comparte un solo rasgo del ancla. **Casilla 1 fallada = la pieza no existe** para el
banco de Lucía, por linda que sea la escena.

### Lo que esto enseña

**`--image-references` NO es un mecanismo de identidad facial.** Toma la imagen como referencia de
contenido y estilo, y reconstruye la cara de cero. Es distinto de `--start-image`, que sí ancla el
frame — por eso `V08` y `V09` salieron con la cara correcta: **partían de una imagen que ya era
Lucía**, no de una referencia.

**La regla operativa que queda:**

| Quiero | Flag / método | ¿Conserva la cara? |
|---|---|---|
| Animar una imagen que ya es Lucía | `--start-image <asset>` | ✅ sí (V08, V09) |
| Imagen NUEVA con la cara de Lucía | `--image-references <asset>` | ❌ **NO** (este caso) |
| Imagen NUEVA con la cara de Lucía | element `@lucia-skin-v1` por navegador | ✅ sí (todo el banco) |

⚠️ **Pregunta abierta, no la cierro inventando:** `B08-taller` **sí salió por CLI y sí es Lucía**.
O sea que existe un camino por CLI que funciona, pero no es el que probé acá. Hay que averiguar con
qué parámetro se generó B08 antes de volver a gastar en imágenes nuevas por CLI.

**Mientras tanto:** las imágenes nuevas de Lucía se generan **por navegador con el element**, y el
CLI queda para animar lo que ya existe. Se guarda el archivo como evidencia del defecto, igual que
`C01`: borrarlo haría que alguien repita el intento y vuelva a pagarlo.

---

## ✅ B10 — restaurante de almuerzo · y la CORRECCIÓN de lo que dije sobre `--image-references`

`B10-restaurante-almuerzo.png` · job `43535c03-315e-4350-9d80-249b0a044fcd` · 1536×2752 (9:16) · `nano_banana_pro` 2K · **2 cr** · referencia: `bc3db11b` (B06).

**Es Lucía.** Cejas gruesas naturales, pecas en el pómulo, cadenita de oro fina, aro pequeño, sin
maquillaje, **pelo suelto y ondulado** (corregido respecto a `B08`, que salió recogido).

La escena cumple todo: plato de almuerzo boliviano creíble (arroz, plátano frito, frejoles, guiso),
jarra metálica de refresco, pila de platos, sillas de plástico, ventilador de techo, piso de
mosaico, luz de mediodía mezclada con fluorescente. **Cuatro manos sobre el mismo plato** y el
comensal en primer plano — o sea que ya nace cumpliendo la regla de `V09`. **Candidata inmediata a
animar.**

### ⚠️ Corrijo lo que escribí en `B09`, hace una vuelta

Ahí concluí que **«`--image-references` NO es un mecanismo de identidad facial»**. **Es falso**, y
dejarlo escrito habría mandado a la próxima sesión por el camino equivocado.

Consulté los params reales de `B08` —que sí salió por CLI con la cara correcta— y usa **exactamente
el mismo flag**. La diferencia no estaba en el flag: **estaba en el prompt.**

| | `B09` ❌ | `B08` y `B10` ✅ |
|---|---|---|
| Cómo nombra al sujeto | `A young woman in a simple apron…` | `Same woman as the reference, **keep her face identical**: warm olive skin, countable freckles never smoothed, brown almond eyes, thick natural brows, no makeup, long dark wavy hair worn loose` |
| Resultado | otra persona | **Lucía** |

🔴 **La regla correcta: `--image-references` conserva la cara, pero hay que PEDÍRSELO por texto.**
El flag entrega la imagen; el prompt es el que decide si el modelo la copia o sólo se inspira. Sin
el prefijo de identidad + la lista de rasgos, reconstruye la cara de cero.

**El prefijo, para copiar y pegar:**
```
One single continuous vertical photograph, full bleed. Same woman as the reference, keep her
face identical: warm olive skin, countable freckles never smoothed, brown almond eyes, thick
natural brows, no makeup, long dark wavy hair worn loose. Now she is in <ESCENA>.
```

Y se cierra con: `No signs, no labels, no price tags, no screens; any surface with writing is out of
focus and unreadable.`

**Consecuencia práctica: el CLI SÍ sirve para imágenes nuevas de Lucía.** No hace falta el navegador
para cada foto — hace falta escribir bien el prompt. Eso desbloquea generar sin la PC de Sergio.
