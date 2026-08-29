# Técnica de Higgsfield — lo que funciona, probado en la web

> **Objetivo de este archivo:** que generar una imagen de Lucía que salga bien no dependa de
> acordarse de nada. Todo lo de acá se probó en la cuenta de Sergio el 2026-08-28, mirando el
> resultado. Lo que no se probó, dice que no se probó.
>
> 🔴 **Higgsfield se opera SOLO por navegador.** Sergio, 2026-08-28: *"no usarás MCP, harás todo
> desde el navegador a mi cuenta, cometes muchos errores por MCP"*. Tenía razón: el MCP pedía
> `nano_banana_2` y el servidor resolvía a `nano_banana_flash` sin avisar.

---

## El flujo, paso a paso

1. `higgsfield.ai` → menú **Image** → **Create Image**.
2. En el campo de prompt escribir **`@lucia`** — autocompleta a **`@lucia-skin-v1`**, el ancla
   de 7 ángulos. Reemplaza al `<<<uuid>>>` que se usaba por MCP.
3. Escribir el prompt **después** del `@` (ver la receta abajo).
4. Modelo **Nano Banana Pro**, aspecto **3:4**, y **calidad 2K** (ver abajo — sale igual que 1K).
5. **Generate** — cuesta 2 créditos.
6. **Mirar el resultado ampliado** contra los rasgos sagrados antes de darlo por bueno.

### 🔻 Generar SIEMPRE en 2K — cuesta lo mismo que 1K

El selector de calidad ofrece **1K · 2K · 4K**. Con 2K puesto, el botón sigue diciendo
**Generate ✨2**: **mismo precio, el doble de resolución.**

| | |
|---|---|
| 1K | 896×1200 |
| 2K | 1856×2304 |

Importa concretamente: **el render de carrusel es 1080×1350**, así que una foto de 1K se
**amplía** 1,2× para cubrirlo y una de 2K entra holgada y se reduce.

⚠️ **Las 4 fotos del banco propio se generaron en 1K por no haber mirado este selector.**
Sirven, pero conviene regenerar las que se usen en piezas finales — son 2 cr cada una.

### ⚠️ El toggle `Unlimited` NO es gratis

Parece un interruptor y es una **venta**: abre un modal de **$5 por 1 día · $12 por 3 días ·
$23 por 7 días**, pago aparte del plan. No tocarlo sin permiso de Sergio.

*(Acá se había escrito antes que "la web no gasta créditos". Era falso, y se corrigió al
tocar el toggle y ver el modal.)*

### ⚠️ Esperar a que la página termine de cargar — y VERIFICARLO

Escribir en el campo mientras la página aún carga no hace nada: queda el prompt anterior y se
genera lo de la vez pasada. Pasó dos veces. **No alcanza con esperar N segundos** —18 no
bastaron una vez—: hay que mirar la pantalla y confirmar que el spinner se fue y el campo
responde antes de escribir.

### ⚠️ "Could not reach the server" es transitorio

La primera generación falló con ese error. **El mismo prompt, reintentado sin cambiar nada,
funcionó.** No es falta de saldo ni prompt inválido: reintentar antes de diagnosticar.

---

## La receta de prompt que funcionó

Probada el 28-ago. Cinco bloques, en este orden:

| Bloque | Ejemplo |
|---|---|
| **Quién** | `@lucia-skin-v1` |
| **Escena boliviana concreta** | «sentada en el borde de una vereda de ladrillo en Santa Cruz de la Sierra, pared ocre descascarada detrás y un tajibo florecido» |
| **Rasgos sagrados** | «argollas doradas chicas y cadenita fina. Pecas marcadas en nariz y mejillas» |
| **Anti-plástico** | «piel con poro y textura real, tono parejo, sin retoque ni suavizado» |
| **Cámara** | «shot on an iPhone 15 Pro main camera, 24mm, foto casual sacada por una amiga, no posada» |

**Lo que más cambió el resultado fue el bloque 2.** `LUCIA.md` advierte que muchas fotos del
banco «leen europeas» — ladrillo y biblioteca podrían ser de cualquier lado. Nombrar cosas que
solo existen acá — **el tajibo florecido, la pared ocre descascarada, la vereda de ladrillo** —
devolvió una foto que se lee de Santa Cruz sin decir «Bolivia» en ningún cartel.

**Verificado ampliando la cara:** pecas en nariz y mejillas, argolla dorada, piel de tono
parejo sin rojez, cejas gruesas, ojos marrones. El ancla de 7 ángulos sostiene la identidad.

---

## 🔴 «Realista» no es «normal» — lo que pidió Sergio el 28-ago

Sergio pasó `IMG-04-gimnasio.png` (del propio banco) y dijo: *"siento que Lucía se ve muy
realista, no tan normal como esta de aquí"*. Tiene razón, y la diferencia **no está en la piel**
— eso ya sale bien. Está en la **dirección de arte de la escena**.

| La de gimnasio — se lee NORMAL | La de la vereda que generé — se lee PRODUCIDA |
|---|---|
| Luz cenital de tubo fluorescente, plana y fea | Hora dorada de las cinco |
| Pelo atado, mechones sueltos, algo sudado | Pelo suelto acomodado |
| Cero maquillaje, pecas crudas | Igual, pero con luz que favorece |
| Mira fuera de cuadro, sin pose | Sentada mirando a cámara |
| Fondo mundano y desordenado: gente en cintas, mancuernas, espejos | Tajibo florecido = postal |
| Nada combina: azul marino, negro, gris | Todo combina: crema, terracota, ocre |
| Encuadre apretado, medio torcido | Composición ordenada |

**La regla que sale de acá: para que se vea normal hay que RESTAR, no agregar.** El instinto
de pedir «foto casual» y a la vez «luz cálida de las cinco» y «tajibo florecido» se contradice:
la cámara es casual pero la escena es de campaña. Nadie saca esa foto por casualidad.

**Receta «normal» — reemplaza al bloque de escena bonita:**

| Bloque | En vez de… | Poner |
|---|---|---|
| **Luz** | «luz cálida y húmeda de las cinco» | «luz de tubo fluorescente de techo, plana» · «mediodía nublado, sin sombras lindas» |
| **Momento** | un instante bonito | uno cualquiera: esperando, mirando el celular, a mitad de una frase |
| **Fondo** | un elemento pintoresco | lo mundano que ya está: cables, sillas de plástico, una heladera de gaseosas |
| **Lugar** | el lindo | uno donde nadie sacaría una foto linda: la fila de una farmacia, un trámite, la parada |
| **Acción** | una pose | **algo a medio pasar con otra persona**: recibir el vuelto, que le acerquen un tomate, que le hablen. Es lo que más aleja la foto de una campaña — y además la vuelve la mejor base para animar |
| **Pose** | mirando a cámara | mirando fuera de cuadro, sin registrar la foto |
| **Paleta** | armónica | que NO combine — la ropa no juega con la pared |
| **Encuadre** | centrado | apretado o medio torcido, como quien saca rápido |

✅ **Probado dos veces el 28-ago.** La mejor salió con la **parada de micro**
(`generadas-20260828/G02-parada-de-micro.png`): cielo nublado sin sombras, poste con maraña de
cables, muros descascarados rojo y amarillo, una señora esperando con su cartera, canasta de
paja a los pies, remera gris y jean, mirando a la calle. Se lee boliviana y se lee normal — sin
un solo elemento puesto para que quede linda.

Prompt de la primera prueba (farmacia): «parada en la fila de una farmacia de barrio
esperando su turno, mirando el celular. Luz de tubo fluorescente del techo, plana y fea, sin
sombras lindas. Remera lisa gris… Detrás estantes llenos de productos y otra persona esperando,
todo desordenado. No mira a la cámara. Encuadre apretado y medio torcido, foto sacada rápido
con un celular, sin componer.» El resultado se lee como una foto que sacaría cualquiera, y
sostiene los rasgos.

⚠️ **Lo que NO se toca**: los rasgos sagrados (pecas, argollas, cadenita) y el anti-plástico
(«piel con poro y textura real, sin retoque»). Eso ya funciona. Lo que sobra es la belleza de
la escena, no el realismo de la piel.

---

## ✅ Animate — imagen a video, PROBADO el 28-ago

Al pasar el mouse sobre una imagen generada aparecen **Reference · Animate · Create 3D scene**.

**Animate lleva al generador de video con la imagen ya cargada como frame inicial.** No hay
que subir nada. Se escribe qué se mueve, y listo.

**Costos medidos en pantalla (Kling 3.0, 5 s, 720p, 9:16):**

| Configuración | Costo |
|---|---|
| Con sonido nativo | **8,75 cr** |
| **Sin sonido** | **6,25 cr** |

🔻 **Apagar el sonido ahorra 2,50 cr — un 29%.** Y para nuestras piezas el audio nativo es
inútil: la voz de Lucía va aparte, en edición. **Apagarlo siempre.** El botón está debajo del
campo de prompt y alterna `On` / `Off`.

**Resultado verificado** (`generadas-20260828/V01-farmacia-animate-kling3.mp4`, con su tira de
frames al lado): 5,04 s · 828×1108 · h264. La cara se mantiene en los cuatro frames —pecas,
cadenita, argolla— con movimiento sutil de cabeza y mano. **Es b-roll propio, en escenario
boliviano, sin depender del banco viejo.**

**Prompt de movimiento que funcionó:** «Ella sigue mirando el celular y mueve apenas el pulgar
en la pantalla, parpadea una vez. La cámara casi no se mueve, como un video sacado de parado.
Nadie mira a la cámara.» — pedir movimiento MÍNIMO es lo que lo mantiene creíble.

### 🔑 Animar una escena CON interacción sale mejor que animar un retrato

Segunda prueba (`V02-mercado-animate-kling3.mp4`): la del mercado, donde la casera le habla.
**Salió mejor que la de la farmacia**, y el motivo es concreto: en la foto ya había una acción
a medias —una mano acercando un tomate, alguien hablando— y el modelo solo tuvo que
*continuarla*. En un retrato quieto tiene que inventar qué pasa, y ahí es donde se pone raro.

**Regla: al elegir qué foto animar, preferir una donde algo esté por terminar de pasar.**

### ⛔ AI Influencer Studio — probado, NO sirve para Lucía

Sonaba a la función hecha para este carril. **No lo es.** Es un *constructor* para crear un
personaje nuevo desde cero: un panel con Character Type, Gender y demás rasgos, y un botón
«Generate Influencer» de 2 cr. Sirve para inventar una modelo nueva, no para producir contenido
de una que ya existe y ya tiene su ancla.

**Para Lucía el camino sigue siendo `Create Image` + `@lucia-skin-v1`.** Queda descartado para
que nadie vuelva a gastar tiempo ahí. (Dato aparte: la pantalla ofrece un programa de
monetización, «earn up to $3.500 with your AI influencer» — fuera de alcance hoy, pero anotado.)

Sin probar todavía: Soul ID Character, Soul Moodboard, Canvas, Photodump, Relight, Marketing
Studio, Viral Presets, Cinema Studio 4.0. Y en el menú aparecen además **Inpaint**, **Image
Upscale**, **Face Swap** y **Character Swap**.

---

## 💰 Qué cuesta cada cosa — verificado en la web el 2026-08-28

**El plan actual es MAX**, no Pro ni Ultra: la página de planes muestra *«Change Commitment»*
en MAX y *«Upgrade Plan»* en los demás, que es como se distingue el propio del resto.

| | |
|---|---|
| Créditos | **3.600/mes** (el slider llega a 5.400) |
| Precio | **$115/mes**, facturado anual (de $158, 27 % off) |
| **Costo por crédito** | **$0,0319 ≈ Bs 0,374** |

⚠️ **Esto corrige dos cosas que estaban escritas mal en el repo:** los docs decían plan
**Ultra, 3.000 cr a Bs 1.365/mes** (Bs 0,455/cr), y en la conversación se había dicho que se
bajó a **Pro con 900 cr**. Ninguna de las dos es el estado real. Con MAX **el crédito salió más
barato** que en el cálculo viejo.

### Costo real por pieza

| Pieza | Créditos | Costo |
|---|---|---|
| Una imagen (`nano_banana_pro`) | 2,00 | **Bs 0,75** |
| B-roll de 5 s **sin sonido** | 6,25 | **Bs 2,34** |
| B-roll de 5 s con sonido | 8,75 | Bs 3,27 |
| Voz de un reel de ~30 s | 3,50 | Bs 1,31 |
| **Reel completo** | 25–30 | **Bs 9,35 – 11,22** |

### Lo que entra en un mes

**1.800 imágenes**, o **576 clips** de b-roll, o **~128 reels completos**. Y el cupo se comparte
con los otros carriles.

**Conclusión: el costo de generación NO es el cuello de este carril.** Un carrusel entero de
Lucía, con foto propia por lámina, sale menos de Bs 6. El cuello es el criterio y el tiempo de
revisión, no los créditos.

*(El plan MAX incluye además «7-day unlimited» de Nano Banana Pro, Nano Banana 2 y Kling 3.0 —
distinto del toggle `Unlimited` del generador, que es la venta suelta de $5–$23.)*

---

## Recorrido de funciones — qué falta probar

Encargo de Sergio (2026-08-29): *"perfeccionar a Lucía viendo todas las funciones de
Higgsfield (NAVEGADOR)"*, probando enfoques distintos y cuidando costo y documentación. Lo que
se aprenda acá **es lo que después se vende como servicio de contenido**, así que cada función
se prueba y se anota qué hace, qué cuesta y para qué sirve en este carril.

| Función | Estado | Qué se sabe |
|---|---|---|
| Create Image + `@element` | ✅ | El camino principal. 2 cr, 2K al mismo precio |
| Animate (imagen → video) | ✅ | 6,25 cr sin sonido. Mejor con acción a medias |
| AI Influencer | ✅ | ⛔ Descartado: crea personajes nuevos, no sirve para Lucía |
| Recreate | 🟡 | No concluyente — el clic llevó a otra imagen del historial. Reintentar |
| Reference | ⬜ | Usar una imagen propia como referencia de la siguiente |
| Cinematic Cameras | ⬜ | Generación con control de cámara |
| Soul ID Character / Soul Moodboard | ⬜ | Otra vía de identidad; el Soul está prohibido, pero ver qué hacen |
| Canvas | ⬜ | «Visual ideation meets repeatable AI workflows» |
| Photodump | ⬜ | Suena a lote de fotos de una misma estética — **potencialmente el más útil** |
| Relight | ⬜ | Cambiar la luz de una foto ya hecha. Podría convertir una foto linda en una «normal» |
| Inpaint | ⬜ | Editar una zona. Sirve para arreglar manos o texto sin regenerar |
| Image Upscale | ⬜ | Subir resolución de las 1K que ya están |
| Face Swap / Character Swap | ⬜ | Ojo: puede ser una vía más simple que el element |
| Motion Control / Edit Video / Multi-shot / End frame | ⬜ | Control fino del video |
| Marketing Studio | ⬜ | El doc viejo lo daba como el de mejor consistencia, con voz propia |
| Viral Presets · Cinema Studio 4.0 · Supercomputer | ⬜ | Sin explorar |

## Pendientes de esta técnica

| Qué | Estado |
|---|---|
| Bajar lo generado al repo | ✅ **resuelto**, y para las dos cosas: el icono de descarga que aparece al pasar el mouse sobre la imagen SÍ funciona —la primera vez falló por errarle a la posición, no por la función—, y para video está en el panel derecho. El archivo cae en `Downloads` y de ahí se copia |
| Probar **Animate** para b-roll de reels | ✅ hecho — ver arriba |
| Probar **AI Influencer** | ✅ hecho — descartado, ver arriba |
| Borrar los dos elements `ZZ-TEST` del workspace | 🔴 **sin resolver.** El MCP no tiene `delete`, y en la web **no aparece ninguna pantalla de gestión de elements**: el selector `@` del prompt solo permite elegir, no borrar, y Assets lista imágenes/videos/audios, no elements. Quedan ahí; son inofensivos salvo por el ruido en el selector |

## Lo que NO se toca

- El ancla vigente es **`lucia-skin-v1`** (`58bbd635-…`). El viejo `452d8375` tenía una sola
  foto y queda jubilado.
- Las fotos del banco se eligen desde [`BANCO-OFICIAL.md`](BANCO-OFICIAL.md), nunca a ojo.
- El acento gráfico de las piezas es el **verde de Onia `#00D26A`**, en las tres cuentas.

---

# Sesión 2026-08-29 — intento de animar G02: qué se aprendió (0 créditos gastados)

**No se animó G02.** Se frenó antes de generar porque el frame cargado no era el correcto, y
generar con el frame equivocado es tirar créditos. Lo que sigue es lo que salió del intento, que
es más de lo que hubiera dado el video.

## 🔴 1. El `Generate` de la landing NO genera nada

`higgsfield.ai/ai-video` tiene un composer completo —imagen, prompt, modelo, duración, aspecto,
sonido— y un botón `Generate`. **Ese botón no gasta créditos: es un embudo.** Solo traslada los
ajustes al workspace real (`/ai/video?duration=5&aspect_ratio=9%3A16&audio=off`) y ahí hay que
volver a apretar. El prompt viaja; **la imagen NO viaja**.

Se descubrió porque después de "generar" apareció el botón real diciendo **30 créditos**.

## 🔴 2. Trampa de costo: el workspace arranca en 4K

**5 s con Kling 3.0 a 4K = 30 créditos** (≈ Bs 11,2). Las V01-V03 del 28-ago costaron **~6,25**
porque estaban a **720p** (≈ Bs 2,3). **Es 5x de diferencia y la resolución viene alta por
defecto.** Bajarla ANTES de apretar Generate.

## 🔴 3. No se puede subir una imagen del disco al frame

El input existe (`input[type=file]`, dos en la página) y la subida reporta éxito, pero **la app
limpia el input y el frame sigue mostrando el anterior**. El frame se elige de los assets de la
cuenta, no de disco. Si la imagen fue generada en Higgsfield ya está adentro; si viene de afuera,
hay que subirla por otra puerta.

## 🔴 4. El bloqueo real: el grid de Assets no renderiza miniaturas

Con **738 assets**, `higgsfield.ai/asset/all` deja los placeholders **en negro** y el renderer se
congela: `Page.captureScreenshot` dio timeout de 30 s **tres veces**. El buscador tampoco recibe
el texto. **Sin miniaturas no se puede elegir una imagen a ojo, y ese es el cuello de botella
de todo el flujo de Animate.**

**Qué probar la próxima:** filtrar por `Image` (592) o por proyecto antes de que cargue todo ·
vista `List` en vez de `Grid` · o guardar el **asset id / URL de detalle** de cada imagen buena
en el momento de generarla, para volver por URL directa y no por el grid. **Esto último es lo que
hay que empezar a hacer siempre.**

## ⚠️ 5. CORREGIDO — Recreate SÍ existe (me equivoqué de panel)

**Lo que decía este punto era falso y se corrige el mismo día.** Escribí "no existe Recreate"
después de mirar el panel de detalle **del workspace de VIDEO**, que es una versión reducida.
El panel de detalle **de una imagen, en el workspace de imagen**, sí lo tiene:

> **Turn to video · Recreate · Reference · Download** (+ favorito, compartir, «…»).
> Y sobre la imagen al pasar el mouse: **Reference · Animate · Create 3D scene**.

Generalicé desde el panel equivocado. Es la misma trampa de siempre: mirar **una** pantalla y
dar por sabidas las demás.

**Consecuencias prácticas:**
- **`Recreate`** es la vía para variantes de una foto que ya gustó. Sigue sin probarse.
- **`Turn to video`** es cómo se anima una imagen desde su detalle: es la puerta buena para G02,
  no el composer de `/ai/video`.

## ✅ 5-bis. El asset id viene GRATIS en el nombre del archivo

Higgsfield descarga como **`hf_<fecha>_<hora>_<uuid>.png`**. Ese uuid **es el asset id**. G05 salió
como `hf_20260829_161913_1f9bd463-4c89-40f7-af4b-225d34502fd3.png`.

⇒ **Regla nueva: al bajar una pieza buena, guardar su uuid en el LEEME del banco.** Resuelve el
bloqueo del punto 4 sin depender de que el grid cargue.

## ✅ 5-ter. El historial del workspace SÍ renderiza

`higgsfield.ai/ai/image` muestra las generaciones anteriores **con miniaturas**, al lado del
composer, y ahí se ve G02 perfectamente. **El grid de `/asset/all` es el que está roto, no la
cuenta.** Para llegar a una imagen vieja: entrar por el workspace, no por Assets.

## Nota histórica — lo que decía este punto antes

El panel de detalle de una imagen tiene exactamente: **Animate · Open in · Reference · Upscale ·
Download**. No hay Recreate. **Para variantes de una foto que gustó, la función es `Reference`.**
Queda como el próximo experimento en lugar de Recreate.

## Detalles chicos que cuestan tiempo si no se saben

- **Apagar el sonido pide confirmación**: sale un diálogo *"Turn sound off?"* con Cancel / Turn
  off. Un solo click no alcanza; hay que confirmar.
- **Kling 3.0 no ofrece 3:4.** Solo **16:9, 9:16 y 1:1**. Las fotos 3:4 del banco se recortan a
  9:16 (se pierden los costados).
- **Las coordenadas NO son estables entre capturas** en este sitio: el layout se re-dibuja a
  escalas distintas y un click de una captura anterior cae en otro lado. **Usar refs o el DOM,
  nunca coordenadas**, sobre todo si hay un botón destructivo cerca.
- Duración: al elegir Kling 3.0 se puso **5s** solo. Rango 3-15 s.

---

# 2026-08-29 — G02 animada: la regla de la acción a medias, probada al revés

Se animó G02 (V04) **sabiendo que era la peor candidata**, para ver qué pasa cuando falta lo que
hace buenos a los otros tres videos. Salió mal exactamente como se esperaba, y eso la vuelve el
video más útil del banco para decidir qué animar.

**Qué hizo el modelo sin una acción que continuar:** gira la cabeza, **abre la boca como si
hablara** (no hay diálogo ni razón), y en el último segundo se da vuelta y **pierde la cara**.
Los cables, que el prompt pedía mover, no se mueven.

> **Regla, ahora con las dos caras:** con una acción a medias clara (V02 el tomate, V03 el vuelto,
> G05 el formulario) el modelo **la continúa** y sale bien. Sin ella, el modelo **inventa una**, y
> lo que inventa suele ser hablar o darse vuelta — las dos cosas que arruinan una pieza sin audio.
>
> ⇒ **No animar retratos ni esperas. Solo escenas donde algo está a mitad de pasar.**

## Dos datos técnicos del flujo bueno

- **La ruta correcta funciona y es corta:** `/ai/image` → click en la imagen del historial →
  panel de detalle → **Turn to video** → bajar a **720p** → Generate. El prompt y el frame viajan
  bien por acá (a diferencia del composer de `/ai-video`, que no lleva la imagen).
- **La resolución bajó el costo de 30 a 6,25 créditos** — de Bs 11,2 a Bs 2,3 por el mismo video.
- ⚠️ **El aspecto que muestra la UI miente.** Decía `9:16` y el archivo salió **828×1108, o sea
  3:4**: Kling respetó el ratio del frame de origen. Bueno para el banco (no recorta), pero no
  confiar en la etiqueta: **medir el archivo bajado**.
- El mp4 salió **sin pista de audio**, confirmado con `ffprobe`. El "Off" funciona.

---

# 2026-08-29 — Recreate, probado: no hace lo que su nombre sugiere

**`Recreate` no genera nada por sí solo.** Devuelve al composer el **prompt exacto y los ajustes**
de esa generación, listos para re-correr. El costo aparece recién al apretar Generate (2 créditos).
O sea que es un **"reusar esta receta"**, no un botón de variantes.

## Y la salida NO es una variante de esa foto: es otra toma del mismo guion

Probado sobre G05. Lo que **conserva**: el personaje (pecas, argollas, cadenita, remera gris), el
tipo de lugar (oficina con cartel de TURNOS, pared descascarada, fluorescente, sillas de plástico),
la acción (el formulario pasando de mano en mano) y la luz.

Lo que **cambia, y cambia mucho**: el personaje secundario (la señora con lanyard se volvió un
hombre), **el ángulo de cámara** (pasó a estar detrás del funcionario, así que ahora se le ve la
cara a Lucía) y la arquitectura del lugar.

> ⇒ **Para qué SÍ sirve:** conseguir **una segunda toma coherente de la misma escena**. G05 y G05b
> funcionan como par —el mismo trámite visto desde los dos lados del vidrio— y eso da dos láminas
> seguidas de un carrusel sin inventar nada.
>
> ⇒ **Para qué NO sirve:** cambiar un detalle chico y conservar el resto de la foto. Si eso es lo
> que se busca, Recreate no es la herramienta. **Queda pendiente probar `Reference` y `Edit`/
> Inpaint para ese caso.**

---

# 🔴 2026-08-29 — V05 generada pero NO se pudo bajar. Pendiente de Sergio

**El video existe en la cuenta** (`Kling 3.0 · 720p · 5.0s`, generado el 29-ago desde G05 con el
prompt del formulario) y **se verificó que es el correcto**: el primer frame muestra la oficina, la
funcionaria detrás del vidrio y el formulario. **Se gastaron 6,25 créditos.**

**Lo que no se logró: bajarlo a disco.** Seis intentos por la columna de acciones del reproductor.
Nada llegó a `Downloads` ni a ninguna otra carpeta.

## Las tres trampas que se descubrieron intentándolo

1. **El toast «Download complete · Ready» NO es del navegador: es de Higgsfield**, y habla de que
   la *generación* está lista, no de que se haya guardado un archivo. **Verlo y dar por bajado el
   archivo es un falso positivo.** Siempre confirmar con `ls` en la carpeta de descargas.
2. **Los iconos de acción sólo aparecen con el mouse encima del video.** Un click "a ciegas" en su
   posición no hace nada porque los iconos ni existen todavía. **Hover primero, después click.**
3. **Hay un spinner `animate-spin` en esa columna**: la descarga se prepara del lado del servidor.
   Clickear de nuevo mientras gira parece encolar y trabar el proceso — la primera vez giró más de
   30 s sin resolver.

## Lo raro, y por eso no es un "no se puede"

**V04 se bajó bien hace un rato por esta misma ruta**, y **las imágenes bajan siempre sin drama**
(G05, G05b). O sea que el camino funciona y es **intermitente**, no imposible.

## Qué hacer

- **Reintentar en la próxima vuelta**, con UN solo click y esperando el spinner sin volver a tocar.
- Si vuelve a fallar: **lo baja Sergio con un click** desde `/ai/video` y se copia al repo. Es más
  barato que seguir peleando con el navegador.
- ⚠️ **NO regenerar.** El video ya está pago; volver a apretar Generate son otros 6,25 créditos
  por lo mismo.

---

# 2026-08-29 — `Reference` probado: SÍ hace lo que Recreate no

Probado sobre G05, cambiando **una sola cosa**: *"la misma foto de la referencia, sin cambiar nada
del lugar, la ropa, las personas ni el encuadre. Lo único distinto: ella levanta la vista del
formulario y mira a la funcionaria a los ojos."*

**Resultado (mirado en pantalla, comparando contra G05):**

| | G05 original | G05c con Reference |
|---|---|---|
| Su mirada | **abajo, al formulario** | **arriba, a la funcionaria** ✅ el cambio pedido |
| Cartel TURNOS, pared descascarada, tubo fluorescente | ✔ | **idénticos** |
| Ventanilla de vidrio rayado, sillas de plástico, gente esperando | ✔ | **idénticos** |
| La funcionaria (misma señora, mismo lanyard) | ✔ | **la misma** |
| Remera gris, argollas, cadenita, pecas | ✔ | **iguales** |

> **Reference conserva la foto y aplica el cambio.** Es exactamente lo que Recreate NO hace:
> Recreate cambia el secundario, el ángulo y la arquitectura; Reference deja todo quieto y mueve
> solo lo que le pedís.

## Cómo se usa

Panel de detalle de la imagen → **Reference**. Eso agrega un **chip de imagen** al composer y
conserva el prompt. Después se reescribe el prompt describiendo la foto Y el cambio.

⚠️ **`Ctrl+A` + Delete en el prompt borra el chip del Element `@lucia-skin-v1`, pero NO el chip de
la imagen de referencia.** Se pasó de 2 chips a 1. Para este test se dejó así a propósito —sin
Element— y la identidad igual se sostuvo, porque **la cara viene de la referencia**.

⇒ **Regla práctica:** para variantes de una foto que ya gustó, `Reference` y no `Recreate`.
Y con Reference **no hace falta el Element**: la referencia ya trae la cara.

## ✅ RESUELTO — no era Higgsfield: Chrome bloquea las descargas del sitio

**Diagnóstico, en un paso.** Se disparó desde la propia página una descarga de un `.txt` de **15
bytes** con un `data:` URI —sin red, sin servidor, sin Higgsfield de por medio— y **tampoco bajó**.

⇒ **El problema no es Higgsfield ni el archivo ni el botón: es Chrome bloqueando las descargas del
origen `higgsfield.ai`.** Es el bloqueo de "descargas automáticas múltiples", que Chrome aplica
solo después de varias descargas seguidas del mismo sitio. Por eso a la mañana bajaba todo y a la
tarde nada: **no se degradó, se cruzó un umbral.**

**El arreglo lo hace Sergio, una vez, en 10 segundos:** en Chrome, con `higgsfield.ai` abierto →
**icono a la izquierda de la barra de direcciones** → *Configuración del sitio* → **Descargas
automáticas → Permitir**. (También suele aparecer un icono de descarga bloqueada a la derecha de
la barra.)

⚠️ **Ojo con la trampa:** si Sergio aprieta descargar en ESE mismo Chrome, tampoco baja, y parece
que sí. Fue lo que pasó con V05: dijo *"ya lo descargué"* y el archivo nunca llegó al disco.

**Cómo se comprueba que quedó arreglado**, sin gastar un crédito:

```js
const a=document.createElement('a');
a.href='data:text/plain;base64,'+btoa('ok');
a.download='ONIA-prueba-descarga.txt'; document.body.appendChild(a); a.click();
```

Si aparece `ONIA-prueba-descarga.txt` en Descargas, las piezas también van a bajar.

### Lo que quedó pendiente por este bloqueo

- **V05** (`oficina` animada, 6,25 cr) y **G05c** (`Reference` sobre G05, 2 cr): generadas, pagas,
  **en la cuenta y NO en el repo**. **No regenerar.**

## Historia — cómo se veía antes de entender el bloqueo

G05 y G05b bajaron sin problema a la mañana. A la tarde **dejó de bajar todo**: video (7 intentos)
e imagen (2 más). El archivo de G05c **quedó en la cuenta y no en el repo**. La comparación de
arriba se hizo **mirando la pantalla**, que es válido, pero el asset falta.

**No re-generar G05c: ya está paga.** Cuando baje, guardar como
`generadas-20260828/G05c-oficina-reference.png` + su `.jpg` y anotar el asset id.

---

# 2026-08-29 — Mapa del roadmap, sin gastar un crédito

Con las descargas bloqueadas por Chrome no tiene sentido generar (no se puede traer nada al repo),
así que se recorrieron las funciones pendientes **solo mirando**, para saber cuáles vale la pena
probar cuando se destrabe. **Costo: 0 créditos.**

## 🟢 Marketing Studio — es la que mapea al servicio de contenido que vamos a vender

`higgsfield.ai/marketing-studio`. *"Turn any product into ready to post content."*

El composer tiene dos slots que no existen en ningún otro lado: **AVATAR** y **PRODUCT**. O sea:
la cara de un modelo + el producto del cliente → pieza lista para publicar. **Es exactamente la
forma del servicio**, no una función de laboratorio.

- Seis familias de plantillas: **Product shot · Motion · UGC · Ads · Posters · Marketplace**.
- Toggle Image / Video en el mismo composer.
- Modelo propio: `Marketing Studio Image`. Encuadre por preset (`Closeup`), 3:4, 1 a 4 salidas.
- **Costo: 4 créditos por imagen** (Bs 1,50), el doble que el workspace de Image normal.

⇒ **Es la próxima prueba real** apenas se destrabe la descarga: un producto de un cliente de verdad
+ un avatar, y medir si la salida es publicable sin retoque. Ese número —publicable sí/no— es el
que decide si el servicio se puede vender.

## 🔴 Viral Presets — casi todo va en contra de la receta que ya funciona

~65 presets de efecto cinematográfico: `EARTH ZOOM`, `BULLET TIME`, `DOLPHIN RIDE`, `LAVA`,
`MULTIVERSE`, `MIGHTY FIGHTER`, `ACID`, `PENGUIN RIDE`…

**Son espectáculo, y lo que probamos que funciona para Lucía es exactamente lo contrario:** la
receta NORMAL, lugares donde nadie sacaría una foto linda, acción a medias, sin dirección de arte.
Meterle un preset viral a Lucía la devuelve al registro de "modelo de IA" del que costó sacarla.

**Los pocos que sí podrían servir**, y para piezas de marca de @oniahq más que para Lucía:
`MAGAZINE`, `NOIR`, `VINTAGE`, `ORBIT 360`, `MODERN`, `TWO COLOR`, `PAPER`.

⇒ **Prioridad baja.** No es que sean malos: es que resuelven un problema que no tenemos.

## Lo que queda sin mirar

`Relight`, `Inpaint`, `Upscale`, `Face Swap`, `Cinematic Cameras`, `Canvas`, `Motion Control`.
De esos, los que más prometen para lo nuestro son **Inpaint** (arreglar el texto gibberish de los
formularios y pizarras, que es el defecto que más se repite en el banco) y **Upscale** (subir las
G01-G04, que quedaron a 1K).
