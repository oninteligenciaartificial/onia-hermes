# Técnica de Higgsfield — lo que funciona, probado en la web

> ## ✅ 2026-09-29 (corregido el mismo día): los IDs de Lucía de este archivo siguen vigentes como fuente
>
> La nota de abajo los daba por retirados por una premisa falsa (Lucía no viene de una persona real:
> la hizo Sergio Urcullo 100% con IA). Retirados de verdad: solo los que lista
> `LUCIA-HIGGSFIELD-IDENTITY.json` → `deletion_scope_2026_09_29`.
>
> ~~2026-09-29: los IDs de este archivo están retirados~~
>
> Las técnicas (prompts, motores, QA) siguen siendo aprendizaje válido; **los IDs de Soul y
> Element que aparecen acá ya no se usan** (Lucía v4 se rehace desde cero). Lo verificado en vivo
> el 2026-09-29 —MCP sin borrado, CLI 1.1.26 sin borrado, costos por motor, `soul_cast` que ignora
> el prompt, `nano_banana_pro` que figura como `nano_banana_2`— está en
> `../../../docs/HIGGSFIELD_VIDEO_SYSTEM.md` §«Verificado en vivo 2026-09-29».

> ## Autoridad operativa vigente — 2026-09-22
>
> Este archivo conserva la bitacora y los hallazgos cronologicos; **ya no decide por si solo el
> canal de ejecucion**. La politica vigente esta en
> [`../../../docs/HIGGSFIELD_VIDEO_SYSTEM.md`](../../../docs/HIGGSFIELD_VIDEO_SYSTEM.md) y el
> estado de identidad en [`LUCIA-HIGGSFIELD-IDENTITY.json`](LUCIA-HIGGSFIELD-IDENTITY.json).
>
> - CLI oficial + skills: produccion reproducible para Codex, Claude Code y VPS.
> - Navegador local: Element `@lucia-skin-v1`, Marketing Studio y QA visual manual.
> - MCP oficial: agentes de chat/exploracion; no motor productivo por defecto.
> - API: futura automatizacion de volumen con facturacion separada.
> - Playwright en VPS: no se usa para generar ni comprar; la UI es fragil y no da un contrato
>   estable para costos, defaults o recuperacion de jobs.
>
> Todo costo, modelo, default y sesion descrito mas abajo es evidencia historica hasta que se
> vuelva a consultar en vivo. Usar el comando completo `higgsfield`; en Windows `hf` apunta a
> Hugging Face.

> **Objetivo de este archivo:** que generar una imagen de Lucía que salga bien no dependa de
> acordarse de nada. Todo lo de acá se probó en la cuenta de Sergio el 2026-08-28, mirando el
> resultado. Lo que no se probó, dice que no se probó.
>
> **Contexto historico del 2026-08-28:** en esa fecha se ordeno operar por navegador debido a
> una confusion entre nombre comercial y `job_type`. La investigacion posterior de este mismo
> archivo (§10) corrigio esa causa. La orden actual distingue CLI, navegador y MCP como indica el
> bloque superior.

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

#### ✅ Confirmado en el CLI del VPS (E5, 2026-09-02) — y con los números exactos

Lo mismo vale por CLI, medido con `higgsfield generate cost` (la consulta NO gasta):

```bash
higgsfield generate cost nano_banana_pro --prompt "..." --resolution 1k --aspect-ratio 9:16  # 2 cr
higgsfield generate cost nano_banana_pro --prompt "..." --resolution 2k --aspect-ratio 9:16  # 2 cr  ← default
higgsfield generate cost nano_banana_pro --prompt "..." --resolution 4k --aspect-ratio 9:16  # 4 cr
```

- **`resolution` default = `2k`** (`higgsfield model get nano_banana_pro`). No hace falta pasar el
  flag: si no lo ponés, sale 2k.
- **`1k` NO ahorra nada** (mismo 2 cr). Bajar a 1k es sólo perder píxeles gratis. Nunca hacerlo.
- **`4k` cuesta el DOBLE (4 cr)** — reservado a una eventual pieza *hero*; sin probar si mejora la
  piel lo suficiente para justificarlo. Para toda pieza normal: **2k**.
- **Píxeles reales de `2k` + `9:16` por CLI: `1536×2752`** (ratio 0,558), no 1080×1920. → **toda
  pieza publicable necesita export a 1080×1920 / 1080×1350** para pasar la casilla 2 (lo mismo que
  ya hizo E3-café). Un `9:16` del CLI ≠ el 9:16 exacto de Reels.

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

> 🔴 **CORREGIDO el 2026-08-31 con el dato vivo de la cuenta.** La línea de arriba está MAL.
> El API devuelve `current_plan: ultra`, que son **3.000 cr/mes por $99** facturado anual, no 3.600 por $115.
> **Saldo real hoy: 1.959,58 créditos** (~Bs 735), leído sin gastar nada. Entre el 23 y el 31-ago el saldo
> BAJÓ, no subió: no hubo recarga, y se gastaron ~124 cr que nadie anotó. `auto_refill` está desactivado.
> Costo real por crédito: $0,033 = **Bs 0,375**.
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

> ⚡ **AFINADO el 29-ago, con las dos a resolución completa lado a lado:** decir "conserva la
> escena" se queda corto. **Conserva casi cada píxel** — las grietas de la pared, la señora de rojo
> del fondo, el hombre sentado a la izquierda, el sello del formulario, la posición de las manos— y
> cambia **solo la mirada**. No es "otra generación coherente": es **edición quirúrgica de la misma
> imagen**. Por eso G05 + G05c funcionan como **antes/después de un mismo instante**, algo que
> ninguna otra función del set puede dar.
>
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

---

# 2026-08-29 — `traer_descarga.js`: la trampa de la descarga vieja, ya no depende de acordarse

```bash
node scripts/traer_descarga.js --a hermes-content/references/modelos/lucia/generadas-20260828/V05.mp4
```

Copia al repo la última descarga **solo si de verdad es nueva** (10 min por defecto). Si el archivo
más reciente es viejo, **no copia nada** y explica por qué. Al traerla, imprime el **asset id**
sacado del nombre, listo para pegar en el LEEME.

**Por qué existe:** el 29-ago el mismo error pasó DOS VECES en una tarde. Chrome bloqueaba las
descargas, la UI de Higgsfield decía *"Download complete"* —que es **su** aviso de que la
generación está lista, no del navegador— y yo copiaba al repo el archivo más reciente de Descargas
creyendo que era el nuevo. Era el de la pieza anterior. La segunda vez casi queda un `V05` que en
realidad era el mp4 de `V04`.

> **Un archivo con el nombre equivocado es peor que uno faltante: el faltante se nota, el
> equivocado se publica.**

La regla estaba escrita ("confirmar con `ls`, nunca con el toast") y aun así se repitió el mismo
día. Una regla que solo vive en un doc se desobedece; esta la comprueba el script.

---

## Intento de tasar Marketing Studio VIDEO — 2026-08-31, sin resultado

**No se consiguió el precio.** Se anota igual, porque un intento fallido documentado evita que la
próxima vuelta repita el mismo callejón.

**Qué se buscaba:** leer el número del botón Generate con el toggle en **Video**, sin generar. Es
el único modo sin sustituto gratuito y el que mapea 1:1 a un servicio vendible. Los dos números
que circulan (52,50 y 120 cr) son **de papel: ninguno medido**.

**Dos obstáculos, los dos nuevos:**

1. **El screenshot del navegador falla** con `Failed to deserialize params.clip.scale` (error de
   CDP, no de la página). Hay que leer por árbol de accesibilidad o por JS.
2. **El compositor no se renderiza** al entrar a `/marketing-studio` — `document.body.innerText`
   no contiene «Describe what you want», y sólo aparece la galería de plantillas con
   «Browse templates». La vez anterior (misma URL, mismo día) el compositor sí estaba. Hay dos
   estados de esa pantalla y el que sale no es determinista.

**Lo único que sí se confirmó, y sirve:** existe una plantilla llamada **`How-To UGC VIDEO`**, y
las familias del selector son ADS · MOTION · UGC · Product shot · Posters · Marketplace. O sea el
UGC de Marketing Studio existe como plantilla propia, no sólo como categoría.

**Para la próxima vuelta:** entrar por la plantilla `How-To UGC VIDEO` en vez de por el
compositor. Una plantilla abre su propio panel con el precio a la vista — es como se descubrió
que `Recreate` cuesta 36 cr en unas plantillas y 2 en otras. **Y ese dato ya vale por sí solo:
el precio de Marketing Studio no es uno, depende de la plantilla.**

### ✅ Resuelto en la vuelta siguiente — y «Marketing Studio VIDEO» probablemente no existe

**Medido el 2026-08-31 leyendo el botón, sin generar.** Dos hallazgos, y el primero cambia la
pregunta:

**1. El toggle «Video» del compositor de Marketing Studio TE SACA de Marketing Studio.** Al
clickearlo la URL salta de `/marketing-studio` a **`/ai/video`**, el workspace general. O sea no
hay un «Marketing Studio VIDEO» con avatar + producto como lo tiene la versión imagen: el botón
es un atajo al video normal. Los dos números de papel que circulaban para ese modo (52,50 y
120 cr) **no corresponden a nada verificable** y se dan de baja.

**2. Los defectos del workspace de video, leídos hoy:**

| Campo | Valor por defecto |
|---|---|
| Modelo | Kling 3.0 |
| Duración | 5 s |
| Resolución | **720p** |
| Formato | 16:9 |
| **Botón** | **Generate 6.25** |

⚠️ **Esto corrige un aviso que este mismo carril venía repitiendo:** se decía que «el workspace de
video arranca en 4K y 5 s de Kling 3.0 en 4K son 30 créditos». Hoy **arranca en 720p a 6,25 cr**.
La advertencia de bajar la resolución antes de generar sigue siendo sana —4K existe y cuesta—
pero el default medido no es el caro.

Otras opciones visibles en la barra: **Seedance 2.5**, **Kling 3.0 Turbo**, 1080p, y duraciones
de 3,0 s / 5,0 s / 6,0 s.

**Lo que queda por medir:** si `9:16` (el formato que necesitamos para Reels e Historias) cambia
el precio, y cuánto cuesta 1080p. Se leen igual: sin generar.

---

## 🔴 La descarga desde el navegador está rota — 2026-08-31

**Hay una imagen generada y pagada que no está en el repo.** Existe en la cuenta, verificada
abriendo su panel: prompt `@lucia-skin-v1 One single continuous photograph... waiting room of a
small dental clinic`, **Nano Banana Pro**, **1792×2400**, 31-ago 22:09. Costó 2 créditos.

### Los cuatro caminos, y por qué fallan hoy

| Camino | Qué pasa |
|---|---|
| Botón `Download` del panel | **No existe como botón con ese texto.** Ningún `<button>` ni `<a>` de la página tiene `download`, y el panel se cierra solo al clickear |
| Leer el `src` de la imagen por JS | **Bloqueado**: el tool devuelve `[BLOCKED: Cookie/query string data]` |
| Screenshot y recortar | **Roto**: `Failed to deserialize params.clip.scale`, error de CDP en esta pestaña |
| Descarga de Chrome | Ya había fallado el 30-ago — Chrome bloquea descargas de `higgsfield.ai`. Se comprobó con un `data:` URI de 15 bytes que tampoco bajó |

### Lo que esto significa, y es lo importante

**Generar sin poder bajar es gastar créditos para nada.** Cada imagen que no llega al repo no se
puede mirar a tamaño real, no entra al banco, no pasa el gate y no se publica. La generación no
es el cuello: **la descarga sí**.

**Antes de generar la próxima, resolver esto.** Ideas sin probar, en orden de lo más barato:
1. Botón derecho → «Guardar imagen como» por coordenadas (el menú contextual de Chrome no depende
   del DOM de la página).
2. Ver si el panel expone la URL en un `data-*` o en el `background-image` de un contenedor, que
   el bloqueo de `src` quizá no cubra.
3. La API de Higgsfield por MCP **sólo para leer la URL** — no para generar, que es donde
   sustituye el modelo en silencio.
4. Pedirle a Sergio que la baje a mano una vez, para no bloquear el banco mientras se resuelve.

---

# Sesión 2026-08-31 — la descarga NO estaba rota, y el registro «caro» cuesta la cara

## ✅ 1. CORRECCIÓN — el botón `Download` SÍ existe, y funciona

**Lo que reporté el 31-ago a la mañana era falso.** Dije que «los cuatro caminos de descarga
fallan» y que «`Download` no existe como botón con ese texto». Existe:

> **Se hace clic en la imagen del grid → se abre el panel de detalle → abajo a la derecha está
> `Download`**, junto a `Turn to video`, `Recreate` y `Reference`.

Probado hoy: el archivo cayó en `Downloads` como
`hf_20260901_025201_<uuid>.png`, **7.675.702 bytes, 1792×2400**. Cero fricción.

**Por qué me lo perdí:** busqué un `<button>` con el texto `Download` y elementos con atributo
`download` **sobre el grid**, sin abrir el detalle. Es exactamente el error que este mismo archivo
ya se reprochaba en la sesión anterior — *«mirar UNA pantalla y dar por sabidas las demás»*— y lo
volví a cometer, sobre el mismo botón.

⚠️ Y de paso: el ícono de descarga del hover **no descarga**, abre el detalle. Por eso el camino
correcto son **dos** clics, no uno.

## 🔴 2. Los clics por coordenada no son confiables acá; por `ref` sí

Dos fallos hoy, los dos por coordenada:
- Click en el selector de modelo a `(404, 628)`: **no abrió nada**.
- Click en la fila «Nano Banana Pro» a `(428, 471)`: **seleccionó Seedream 4.5**, la fila de
  arriba. Se vio porque el botón pasó a decir `Generate ✦ 1` y la URL a `model=seedream_v4_5`.
- Click en `Generate` a `(1010, 614)`: **no generó**; la grilla quedó igual.

Los tres funcionaron a la primera usando `find` → `ref_N`. **Regla: en este UI se clickea por
referencia, no por píxel.** Y siempre se confirma leyendo el número del botón y la URL.

## ⚠️ 3. Hay TRES elements de Lucía en el selector, no uno

Escribiendo `@lucia` aparecen: **`lucia-skin-v1`** (el bueno, primero), `LUCIA-SINTETICA-v3` y
`lucia-ancla-2026-08`. El doc sólo nombraba el vigente y el jubilado. Los otros dos no están
documentados y son un riesgo de elegir mal a las apuradas — se acepta con **Enter**, que toma el
primero.

## 🔴 4. El hallazgo de contenido: el registro «campaña de moda» le cambia la cara

Primera pieza del registro cinematográfico (`generadas-20260831/C01-terraza-torre-cristal.png`),
pedida por Sergio a partir del reel de @mindshft.ai. **El registro salió; la fidelidad no.**

| Salió bien | Salió mal |
|---|---|
| Luz dura de mediodía, sombra nítida en el concreto | **La cara es más angulosa y flaca que el ancla**: pómulos hundidos, mandíbula afilada, cuello largo |
| Muro cortina de vidrio, Santa Cruz difusa abajo | **Pelo recogido tirante** — le saca el rasgo más reconocible, que es el pelo suelto ondulado |
| Chaleco sastre y pantalón ancho: caro y controlado | Piel de brazos y hombros más lisa de lo que pide su ficha (poros visibles) |
| Pecas conservadas y visibles | |

**La causa es el prompt, no el modelo.** Palabras como `fashion-commercial`, `campaign look` y
`hair pulled back tight` arrastran al arquetipo de modelo de pasarela, y el arquetipo le gana al
ancla. **Para la próxima:** pedir *editorial portrait* en vez de *fashion campaign*, dejar el
**pelo suelto**, y mantener la línea de «poros visibles, asimetría natural» que ya funciona en las
piezas de pilar B.

El registro caro se consigue con **luz, encuadre y vestuario** — no pidiéndole que parezca modelo.

## 🔴 5. El Enter que acepta el mention falla EN SILENCIO si la página está ocupada

Vuelta del 2026-08-31, 23:0x. Secuencia: clic en el campo (por `ref`) → `ctrl+a` → `Delete` →
escribir `@lucia` → `Enter` → escribir el cuerpo. **El `Enter` no aceptó nada**, porque el
desplegable de characters todavía no había abierto: el `type` siguiente dio timeout de CDP y la
página estaba congelada.

**Resultado:** el campo quedó con **`@lucia` como texto plano**, no con el chip verde
`@lucia-skin-v1`. Se ve casi igual de reojo, y **generar así NO aplica el element**: saldría una
mujer cualquiera, 2 créditos tirados y una pieza que viola la regla de «cara SOLO con
@lucia-skin-v1».

**Cómo se detecta:** el mention válido se ve **verde y con el nombre completo** (`@lucia-skin-v1`).
Si dice `@lucia` a secas y en el color del texto normal, está roto.

**Regla:** después del `Enter`, **mirar el campo antes de escribir el cuerpo**. No encadenar
`Enter` + `type` en el mismo lote — que es justo lo que hice acá.

## 🔴 6. El modelo INVENTA los carteles — cualquier texto en escena sale en idioma falso

`generadas-20260831/B05-micro-camino-al-trabajo.png`, segunda pieza del pilar B. La corrección
del prompt funcionó (ver punto 4): **pelo suelto, pecas visibles, cara mucho más parecida al
ancla** que la del registro «campaña». Luz real del micro, pasajeros desenfocados, tote gastado.

**Pero los carteles son ilegibles y falsos.** El cartel de tarifas de la ventana dice:

> `FARE ROU…` · `CARHEDA BIT. 20.` · `LUCIVINA PER 1,50` · `CARTFOLUREX 50` · `BOLIVADA DEL 3,00`

Ninguna de esas palabras existe. Y `FARE` es **inglés**, en un micro boliviano. Los dos carteles
del fondo izquierdo están igual de rotos.

**Por qué importa más que un detalle:** el texto inventado es el delator de IA más obvio que hay,
y lo caza cualquier boliviano en medio segundo. Una pieza de pilar B existe justamente para
parecer una foto real de un negocio real — con esto adentro, no puede publicarse.

**Regla nueva para el prompt:** si la escena tiene carteles, precios, letreros o pantallas, hay
que **sacarlos del foco explícitamente**. Agregar al final:

> `Any signage, price lists or screens are out of focus and unreadable, no legible text anywhere
> in frame.`

Y si el texto ES el punto de la pieza, no se pide al modelo: se compone después con el renderer
de carruseles, que escribe texto de verdad.

### ⚠️ CORREGIDO el mismo día — el banco viejo NO estaba contaminado

Escribí acá que las piezas viejas «probablemente arrastran el mismo defecto» y salí a revisarlas.
**Las dos hipótesis eran falsas, y la respuesta ya estaba escrita:**

- **`G01-cafe-pizarra-texto`** inventa *marnago* y *horchimos* **a propósito**. Su `LEEME.md` lo
  declara: *«el defecto de la IA, a la vista y señalado»*, y alimenta la lámina 6 de L09. No es
  un defecto: es el contenido.
- **`G05-oficina-de-tramites`** tiene el `TURNOS` escrito a mano **bien**, y el texto raro del
  formulario está **al revés** porque se ve el reverso de la hoja a contraluz — que es lo que
  pasa con papel fino de verdad. Se lee como papel, no como error.

**Miré las imágenes antes de leer el `LEEME` del banco**, que es justo el orden que la regla del
repo prohíbe. Media vuelta perdida y una afirmación falsa dicha en voz alta.

**Lo que sí distingue los casos** no es el modelo, es **para qué existe la pieza**: G01 *muestra*
el defecto y por eso lo quiere; B05 tiene que *pasar por* una foto real de un negocio real, y con
el cartel de frente y roto no pasa. La regla del `out of focus` aplica al segundo caso, no al
primero.

---

# Sesión 2026-09-01 — el mapa de UGC, un susto de $348 y un pago fallido

## 🔴 1. AVISO DE PAGO FALLIDO en la cuenta

Apareció una barra roja en toda la app:

> **Payment failed.** We couldn't charge your subscription. Unlimited generations are paused.

**No bloquea generar por crédito** —se generó normal con el botón en ✦2 mientras el aviso estaba
puesto—, sólo pausa el modo Unlimited, que igual nunca usamos. Pero es un cobro fallido de una
suscripción viva: **lo resuelve Sergio, no Claude.** El botón «retry payment» NO se toca.

Estado verificado el mismo día en `higgsfield.ai/me/settings/subscription`:
**Ultra Plan · 3.000 créditos/mes · renueva el 1-sep · 2.030 / 3.000 disponibles · auto-refill
DESACTIVADO.** (Confirma otra vez que el plan es **Ultra**, no «MAX 3.600 por $115» como decían
docs viejos.)

## 🔴 2. Un clic por coordenada casi compra un plan anual de $348

Clic en `(190, 300)` —espacio vacío en la captura anterior— y la app terminó en
`higgsfield.ai/pricing` con un modal **«Changing commitment»** abierto: `Pro · Annual · $348`,
botón en **«Confirming…»**. Se cerró con la X y se verificó en Subscription que **no quedó ningún
compromiso**: sigue Ultra.

**Esto sube la regla de «clic por `ref`, nunca por coordenada» de molestia a riesgo de plata.**
En esta app un píxel equivocado no falla: navega, y a veces a una compra. La regla ya estaba
escrita por otros motivos; ahora tiene el peor de todos.

## ✅ 3. El mapa real de UGC, sacado del gasto (no de suponer)

`higgsfield.ai/me/settings/usage` da el histórico: **$196,034 gastados · 4.900,85 créditos ·
782 generaciones · 38 features usadas.** El desglose por modelo es la respuesta a «¿cuál es la
forma buena de hacer UGC?», porque muestra qué se usó de verdad:

| Modelo | % del gasto |
|---|---|
| **Seedance 2.0** | **29%** |
| **Marketing Studio Video** | **15%** |
| Nano Banana Pro | 11% |
| Kling v3.0 | 9% (449,25 cr) |
| Soul ID | 6% |
| Nano Banana 2 | 4% |
| GPT Image 2.0 | 4% |
| Wan 2.7 Video | 3% |
| Otros | 20% |

**Lo que esto dice:**
- Hay **cuatro** caminos de video vivos en la cuenta, no uno: **Seedance 2.0**, **Marketing Studio
  Video**, **Kling 3.0** (el que usa `Animate` / `Turn to video`) y **Wan 2.7**.
- **Marketing Studio Video ya es el 15% del gasto histórico** — o sea que alguien lo usó en
  serio, probablemente Arthur. No es territorio virgen: conviene mirar qué salió antes de gastar.
- El banco de Lucía se animó **todo con Kling 3.0 a 6,25 cr**. Seedance y Marketing Studio
  **nunca se probaron con `@lucia-skin-v1`**, y ese es justo el hueco.
- **Auto-refill está DESACTIVADO**, así que no hay riesgo de recarga automática. Bien así.

## Lo que falta probar, en orden de barato a caro
1. `Turn to video` con Kling 3.0 a **720p** desde `G06-peluqueria` — precio conocido, 6,25 cr.
2. **Marketing Studio Video** con el avatar de Lucía — hay que MEDIR el precio antes de apretar.
3. **Seedance 2.0** — el más usado de la cuenta y el más caro del ranking; medir primero.

⚠️ Ninguno se dispara sin leer el número del botón. La lección del punto 2 es que en esta app la
plata se va por un clic mal puesto.

---

## ✅ 7. RESUELTO — por qué NINGÚN video salía vertical

**El aspecto del video lo hereda del frame.** No hay selector de aspecto en el workspace de
video: Kling anima la imagen que le das y devuelve su misma proporción. Como **las 16 imágenes
del banco se generaron en 3:4**, los **6 videos salieron 828×1108**. Medido:

```
V01 · V02 · V03 · V04 · V05 · V06  →  828x1108  (los seis)
```

**Y el selector de 9:16 existía todo este tiempo, en el workspace de IMAGEN.** El menú
«Aspect ratio» ofrece: `Auto · 1:1 · 3:4 · 4:3 · 2:3 · 3:2 · 9:16 · 16:9 · 5:4 · 4:5 · 21:9`.
Estaba en **3:4** por defecto y nadie lo cambió nunca — ni yo, ni las sesiones anteriores.

### La cadena, ahora que se entiende

```
imagen 3:4  ──Turn to video──►  video 3:4   ✗ no sirve para Reels ni Stories
imagen 9:16 ──Turn to video──►  video 9:16  ✓ es lo que pide Meta Ads
```

**Para un video vertical hay que generar la IMAGEN en 9:16 primero.** No se arregla del lado del
video, se arregla del lado de la imagen.

### ⚠️ Y el `9:16` que muestra el historial de video NO significa nada

En la generación de `V06` el historial decía **`720p · 5.0s · 9:16`** y el archivo bajado midió
**828×1108**. La etiqueta de la interfaz **no describe el archivo**. La única verificación válida
es `ffprobe` sobre el MP4 bajado — otra vez la regla de mirar, no suponer.

### Pendiente
Generar la primera imagen en **9:16** y animarla, para confirmar la cadena de punta a punta.
El selector quedó abierto en 9:16 cuando el renderer de la página se congeló; hay que verificar
que quedó puesto antes de generar, y que el botón siga diciendo **✦ 2**.


---

## 8. ¿Se puede producir desde el VPS? — medido el 2026-09-01

**Corrección: el VPS SÍ tiene navegador.** Yo había escrito que no, y era falso.

| Requisito | Estado en el VPS |
|---|---|
| Navegador | ✅ **Playwright instalado**: `chromium-1223`, `chromium_headless_shell-1223`, `firefox-1522`, `webkit-2287` |
| Red hacia Higgsfield | ✅ `higgsfield.ai` responde **HTTP 200** |
| RAM | ✅ 12,3 GB libres de 16 (chromium headless pide ~500 MB) |
| Credencial de Higgsfield | ❌ **ninguna `HIGGSFIELD_*` en `/root/.hermes/.env`** |

**Entonces el bloqueo no es técnico: es la sesión.** Higgsfield se opera logueado y no hay API
key en el entorno, así que habría que **copiar las cookies del Chrome de Sergio al perfil de
Playwright del VPS** — el mismo patrón que se usó con la credencial de Claude Code.

🔴 **El riesgo, dicho sin adornos:** la sesión entraría desde una IP de datacenter en Bolivia
mientras Sergio la usa desde su casa. Eso es lo que las plataformas marcan como acceso
sospechoso, y la cuenta **ya arrastra un aviso de «Payment failed»**. Es probable que la marquen,
no seguro. **La decisión es de Sergio, no mía.**

**Lo que sí puede correr en el VPS hoy, sin tocar nada:** todo el trabajo de repo — renderizar
carruseles, escribir creativos, correr los gates, verificar piezas. Eso no necesita sesión ni
navegador logueado.

---

## 9. El camino correcto para el VPS es el CLI OFICIAL — y me corrijo dos veces

### Corrección 1: exageré el riesgo de la cuenta

Dije que copiar la sesión al VPS «arriesga la cuenta». **Sobredimensionado.** Copiar una cookie
**no es loguearse**: no dispara el flujo de login. El peor resultado realista es que la **sesión
se invalide** y Sergio tenga que volver a entrar. Los baneos vienen de volumen abusivo, violación
de términos o fraude de pago — no de usar la propia sesión desde una segunda máquina.

### Corrección 2: había un camino sancionado y no lo miré

El propio menú de Higgsfield dice **`MCP & CLI`**, y su página tiene una pestaña **para Claude
Code** con esto:

```
1. npm i -g @higgsfield/cli
2. higgsfield auth login      (completa el sign-in en el navegador que abre)
3. npx skills add higgsfield-ai/skills
```

Y aclaran: *«If you are using Claude Code or Codex, it's better to use the CLI»*.
Connector MCP: `https://mcp.higgsfield.ai/mcp`.

**Eso resuelve las tres objeciones de una vez:**

| Objeción | Con el CLI |
|---|---|
| Riesgo de sesión | Autentica con **token propio**, no con cookies robadas |
| Términos de servicio | Es **automatización sancionada** por ellos, no scraping |
| El VPS no puede | Corre **headless**, sin manejar navegador |

### ⚠️ Lo que NO queda resuelto, y hay que probar

Sergio prohibió el **MCP** el 28-ago por una razón concreta: *«sustituye el modelo en silencio y
cobra créditos»* — pedía `nano_banana_2` y el servidor resolvía a `nano_banana_flash`. (⚠️ Explicación refutada más abajo, en «CORRECCIÓN GRANDE»: `nano_banana_2` no existe como ID.)

**El CLI es otra pieza y puede no tener ese defecto**, pero eso **no está medido**. Antes de
producir con él hay que hacer UNA generación de prueba y verificar en el panel de detalle que el
modelo que salió es el que se pidió. Si vuelve a sustituir, se descarta igual que el MCP.

### Estado
**No instalado.** Instalarlo toca el VPS, que tiene un dueño a la vez y hoy lo está usando la
otra sesión. Requiere OK de Sergio y coordinar.

---

## 10. El CLI instalado — y la causa REAL del bug que hizo prohibir el MCP

Instalado en el VPS el 2026-09-01: `higgsfield 1.1.24` en `/usr/bin/higgsfield`.
Autenticado por **OAuth 2.0 PKCE** con la cuenta de Sergio. El callback va a
`localhost:8765` **del VPS**, así que el login se completa con un **túnel SSH**:

```
ssh -L 8765:localhost:8765 root@<vps> 'higgsfield auth login'
```
…y se abre la URL que imprime en el navegador local. El token queda en el VPS.

### 🔴 CORRECCIÓN GRANDE: el MCP nunca «sustituyó el modelo en silencio»

La regla del repo decía que el MCP *«pedía `nano_banana_2` y el servidor resolvía a
`nano_banana_flash` sin avisar»*, y por eso Higgsfield quedó prohibido salvo por navegador.
`higgsfield model list` muestra la causa real:

| ID real | Nombre que muestra la web |
|---|---|
| `nano_banana` | Nano Banana |
| **`nano_banana_flash`** | **Nano Banana 2** |
| `nano_banana_2_lite` | Nano Banana 2 Lite |
| **`nano_banana_pro`** | **Nano Banana Pro** |
| `nano_banana_2_ai_stylist` | Nano Banana Pro |
| `nano_banana_2_relight` | Nano Banana Pro |
| `nano_banana_2_skin_enhancer` | Nano Banana Pro |
| `nano_banana_2_shots` | Nano Banana Pro |

**`nano_banana_2` no existe como ID.** El modelo que la web llama «Nano Banana 2» tiene ID
`nano_banana_flash`. No hubo traición: hay **un desfase entre nombre visible e ID**, y encima
**cinco IDs distintos muestran «Nano Banana Pro»**.

**Consecuencia práctica:** el CLI es seguro **si se usa el ID**, nunca el nombre visible. El ID
correcto es **`nano_banana_pro`**.

### Lo que el CLI da y el navegador no

- **`higgsfield generate cost <modelo> --prompt "…"`** → devuelve el precio **sin generar**.
  Medido: `nano_banana_pro` = **2 credits**. Se acabó leer un botón en una captura.
- **`higgsfield model get <modelo>`** → parámetros exactos. Para `nano_banana_pro`:

  | Param | Valores | Default |
  |---|---|---|
  | `aspect_ratio` | `1:1 · 3:2 · 2:3 · 4:3 · 3:4 · 4:5 · 5:4 · **9:16** · 16:9 · 21:9` | **`1:1`** |
  | `resolution` | `1k · 2k · 4k` | `2k` |
  | `image_references` | array, hasta 14 | — |
  | `prompt` | string | requerido |

  ⚠️ **El default del CLI es `1:1`, no `3:4`.** En la web el default era 3:4. Hay que pasar
  `--aspect-ratio 9:16` **explícitamente** o sale cuadrada.
- **`higgsfield account status`** → saldo. Medido: **ultra plan, 2.019,21 créditos**.

### Estado
Autenticado y probado en lectura. **Todavía no se generó nada por CLI** — falta una generación de
prueba que confirme que lo que sale es lo que se pidió.

---

## 11. ✅ LA RECETA POR CLI — probada de punta a punta, sin navegador

Primera generación por CLI el 2026-09-01: `B08-taller-9x16-CLI`.
**1536×2752 · ratio 0,558 → es 9:16.** Cara reconocible como Lucía. 2 créditos.

```bash
higgsfield generate create nano_banana_pro \
  --prompt "<escena>" \
  --aspect-ratio 9:16 \
  --resolution 2k \
  --image-references <asset-id-de-una-foto-suya> \
  --wait --wait-timeout 5m
```

Devuelve **la URL directa del PNG** en CloudFront. Se baja con `curl` y listo. Sin panel de
detalle, sin buscar el botón `Download`, sin menús escondidos.

### 🔴 El element NO sirve como referencia; el ASSET ID sí

```
--image-references 58bbd635-…  (el element @lucia-skin-v1)  →  Error: Media input not found
--image-references 4eb429ec-…  (asset id de B07)            →  ✅ funciona
```

`--image-references` acepta **upload id, job id o una ruta local** (las rutas se suben solas —
eso resuelve de paso la vieja traba de «no se puede subir una imagen del disco al frame»).
El **element es otra cosa** y sólo existe dentro del `@` del navegador.

**Consecuencia:** por CLI la cara se sostiene con una **foto suya como referencia**, no con el
element. Se usa el asset id de una pieza buena y reciente. Los ids están en los `LEEME.md` de
cada carpeta — por eso se anotan.

#### 🔴 Son TRES registros distintos, no dos (medido 2026-09-03, E9)

El mismo UUID falla con **dos errores diferentes** según la ranura, y esa diferencia es el mapa:

| Ranura | Qué registro lee | Con `58bbd635…` (Element) devuelve |
|---|---|---|
| `--image-references` | uploads / job ids | `Media input not found` |
| `--custom-reference-id` (sólo Soul v2) | **Soul refs** — `higgsfield soul-id list` | `Character not found` |
| el `@` del navegador | **Elements** | ✅ es el único que lo lee |

**El ancla buena vive en el tercer registro y ningún parámetro del CLI la alcanza.** Por eso la
receta por CLI usa foto-como-referencia y no hay forma de mejorarla cambiando el flag.

⚠️ **Un job rechazado por referencia inválida NO cobra** (saldo intacto tras el `Character not
found`). Probar un UUID en una ranura dudosa es gratis: hacerlo **antes** de gastar.

⚠️ **Y hay una diferencia de calidad que conviene medir con más piezas:** la cara sale un poco
más plana que con el element entrenado, y en `B08` el pelo quedó recogido aunque el prompt pedía
suelto. El element manda mejor la identidad; la referencia por foto manda bien pero no igual.

### Los dos caminos, y cuándo usar cada uno

| | Navegador (element `@lucia-skin-v1`) | CLI (referencia por asset id) |
|---|---|---|
| Fidelidad de la cara | **Mejor** | Buena, un poco más plana |
| Velocidad | Lenta: clics, esperas, descargas | **Un comando, devuelve URL** |
| Precio antes de gastar | Leer un botón en una captura | **`generate cost`, exacto** |
| Corre sin Sergio | No | **Sí, headless en el VPS** |
| Riesgo de errar el modelo | Alto (5 IDs muestran «Nano Banana Pro») | **Nulo: se pasa el ID** |

**Regla:** piezas de cara protagonista → navegador con el element. **Volumen, pruebas y todo lo
que corra en el loop → CLI.**

---

## 12. ✅ LA RECETA FANCY — el léxico que da aspiracional SIN cambiar la cara (E2, 2026-09-02)

**El problema que resuelve:** el banco era documental de barrio; «fancy» lo traían
`fashion campaign` / `campaign look`, **prohibidos porque cambian la cara**. E2 buscó el
reemplazo. Se generó **una escena fija** (rooftop de Santa Cruz, atardecer, apoyada en la
baranda de cristal con un café, media vuelta al lente) con **la MISMA referencia** (`G01`) y
**la MISMA escena base light-neutral**, variando SOLO el bloque de estilo:

| Variante | Bloque de estilo | Fancy | Casilla 1 (cara) | Casilla 7 (poros) |
|---|---|---|---|---|
| A · control | `NATURAL TRUE-TO-LIFE COLORS, visible skin pores, natural asymmetry` | 3,5 | ✅ Lucía | ✅ |
| **B · LUZ ⭐** | A + `warm golden hour backlight, soft falloff, shallow depth of field` | **4,5** | **✅ fuerte** | **✅** |
| C · oficio | A + `editorial portrait lighting, styled but candid, elevated everyday` | 4 | ⚠️ leve deriva | ⚠️ piel algo pulida |

### 🏆 La frase ganadora — copiable
```
warm golden hour backlight, soft falloff, shallow depth of field
```
Va **al final** del bloque anti-plástico, después de `NATURAL TRUE-TO-LIFE COLORS, visible skin
pores, natural asymmetry`. Da rim dorado + fondo desenfocado limpio (look influencer) y
**mantiene pecas, poros e identidad intactos**. Es la palanca de **LUZ**, la más barata — E1 ya
había mostrado que la luz es el killer #1 de lo fancy.

### ⛔ Lo que NO usar
`editorial portrait lighting, styled but candid, elevated everyday` (variante C): es fancy pero
**alisa la piel y afina el rostro** hacia un genérico-lindo — mismo defecto que `fashion campaign`,
más suave. Descartado para cara protagonista.

### El comando exacto — probado de punta a punta
```bash
higgsfield generate create nano_banana_pro \
  --prompt "Photo of the same woman as in the reference image, keep the exact same face. She is leaning on the glass railing of an open rooftop terrace in Santa Cruz de la Sierra in the late afternoon, holding a takeaway coffee cup, half-turned toward the lens, the low-rise city behind her. She wears a simple linen top. Small gold hoop earrings and a thin gold chain, marked freckles on nose and cheeks, thick eyebrows, brown eyes. Skin with real pore and texture, even tone, no retouch or smoothing. Shot on an iPhone 15 Pro main camera, 24mm. NATURAL TRUE-TO-LIFE COLORS, visible skin pores, natural asymmetry, warm golden hour backlight, soft falloff, shallow depth of field." \
  --aspect-ratio 9:16 --resolution 2k \
  --image-references generadas-20260828/G01-cafe-pizarra-texto.jpg \
  --wait --wait-timeout 6m --wait-interval 5s
```
Corrió 3 en paralelo (`&` + `wait`) en ~1 min c/u, sin que el shell cortara el `--wait`. 2 cr c/u.

### 🔴 Trampa nueva: el «9:16» del CLI NO es 1080×1920
`nano_banana_pro --aspect-ratio 9:16 --resolution 2k` sale **1536×2752 → ratio 0,5581**, no el
0,5625 exacto de 9:16, y no es ninguna de las resoluciones que pide la **casilla 2** de la
rúbrica (`1080×1920` / `720×1280`). Visualmente es vertical y pasa, pero **toda pieza de CLI
necesita un export final** (center-crop a 9:16 + scale a 1080×1920) antes de publicar. Sin ese
paso ninguna generación de CLI es 9/9 estricta. Pendiente de resolver el comando ffmpeg del export.

---

## 13. ✅ El export a resolución de publicación — resuelve la casilla 2 (E3, 2026-09-02)

El CLI da 1536×2752 (ratio 0,558), que **no** es el 1080×1920 exacto de la casilla 2. El export:

```bash
# 9:16 exacto para historia/reel (1080×1920)
ffmpeg -y -i ENTRADA.png -vf "scale=1080:-1,crop=1080:1920" -q:v 2 SALIDA-STORY-1080x1920.jpg
# 4:5 para feed (1080×1350) — a partir del 9:16 ya exportado, recorte centrado
ffmpeg -y -i SALIDA-STORY-1080x1920.jpg -vf "crop=1080:1350:0:340" -q:v 2 SALIDA-FEED-1080x1350.jpg
```
`scale=1080:-1` lleva el ancho a 1080 (alto → 1935), `crop=1080:1920` recorta 15 px arriba/abajo:
no toca cara ni manos. **Verificar SIEMPRE con `ffprobe … stream=width,height` Y mirándolo** —
el crop puede comerse una mano si la composición está pegada al borde. Para feed, IG prefiere 4:5;
la historia usa el 9:16.

## 14. 🔴 Dos trampas de composición que matan casillas (E3, 2026-09-02)

- **Pantallas con contenido = casilla 3 muerta.** Un laptop/celular/TV **de frente y en foco**
  sale con **texto de UI corrupto** (probado: el coworking de E3, pantalla de app de diseño con
  glifos rotos). Si la escena pide una pantalla: apagada, de canto, o en desenfoque total. Nunca
  una UI legible de frente.
- **La acción a medias (casilla 5) es lo que sube de 8/9 a 9/9.** Una escena fancy **con las dos
  manos sobre un objeto a mitad de un gesto** (el café: dos manos en la taza) pasa; la misma
  calidad de cara y luz **sin** gesto (E2-B rooftop, hotel, coworking) se queda en CASI. Pedir
  siempre un gesto a medias — y de paso es la mejor base para animar (el modelo continúa el gesto
  en vez de inventarlo).

## 15. ✅ Animar a Lucía por CLI: `seedance1_5` gana a `kling3_0` (E4, 2026-09-02)

Probado sobre **la misma** imagen (`E3-cafe.png`, escena café con acción a medias), mismo prompt
de movimiento, `9:16`, cambiando SÓLO el modelo. La comparación anterior (V06 kling / V07 seedance)
era de fuentes distintas y no valía. Ahora sí.

**Comando exacto copiable** (el flag para animar es `--start-image`, y acepta un **path local**
que auto-sube — no hace falta el asset id de la cuenta):

```bash
# Animar una foto fancy de Lucía — GANADOR: seedance1_5 (4,8 cr, 9:16 exacto)
IMG="hermes-content/references/modelos/lucia/generadas-20260902/E3-cafe.png"
PROMPT="She lifts the coffee cup slightly and takes a small sip, then lowers it, blinks once softly. The camera barely moves, like a casual clip filmed while sitting. Nobody looks at the camera."
higgsfield generate create seedance1_5 --start-image "$IMG" --prompt "$PROMPT" --aspect-ratio 9:16 --json
# → devuelve ["<job_id>"]. NO usar --wait (el shell lo corta a 2 min); pollear:
higgsfield generate get <job_id> --json | grep -oE 'https://[^"]+\.mp4'
```

📎 **Matiz medido en V09 (2026-09-02):** para un clip de **4 s**, `--wait --wait-timeout 6m
--wait-interval 5s` **sí devolvió la URL en una sola llamada** — el job terminó en <2 min, antes
del corte. O sea que `--wait` sirve cuando el job es corto y termina rápido; la regla del poll
sigue siendo la segura para `--duration 8/12` u horas de cola, donde el corte a 2 min sí muerde.

**Por qué seedance y no kling — con evidencia mirada (4 frames c/u):**

| | seedance1_5 | kling3_0 |
|---|---|---|
| Costo | **4,8 cr** | 8,75 cr (45% más) |
| Formato | **720×1280 = 9:16 exacto** | 716×1284, necesita recorte |
| Duración | 4 s · param `duration` = **4/8/12** | 5 s (default) |
| **Casilla 9 (cara aguanta el clip)** | **✅ termina SOBRE la cara** | ⚠️ termina cabizbaja, cara tapada |

🔑 **Hallazgo de modelo, no de prompt:** con el mismo prompt, **seedance resuelve la acción y
devuelve la cara a cuadro** (mira→sorbe→baja→vuelve a mirar); **kling sostiene la pose de beber y
muere enterrado en ella**. Para un reel de Lucía, donde el último frame tiene que ser su cara,
seedance es la elección correcta aparte del precio. **Default de video del carril: `seedance1_5`.**

🔴 **Trampa ya conocida, confirmada:** `--start-image` sí, `--image-references` NO para animar
(éste quiere un asset id y trata la imagen como referencia, no como frame inicial).

## 16. ✅ Clips de 8 y 12 s en `seedance1_5`: la cara AGUANTA (E6, 2026-09-02)

**Sí se puede pedir más de 4 s sin encadenar** — el flag es `--duration` (`seedance1_5` acepta
`4,8,12`, default 4). El costo es **lineal, ~1,2 cr/s**, medido con `generate cost` (gratis):

| duración | costo | nota |
|---|---|---|
| 4 s | **4,8 cr** | default |
| 8 s | **9,6 cr** | exacto 2× |
| 12 s | **14,39 cr** | ~3× |

**Comando exacto copiable** (misma foto y prompt que §15, se agrega SÓLO `--duration`):

```bash
IMG="hermes-content/references/modelos/lucia/generadas-20260902/E3-cafe.png"
PROMPT="She lifts the coffee cup slightly and takes a small sip, then lowers it, blinks once softly. The camera barely moves, like a casual clip filmed while sitting. Nobody looks at the camera."
# medir SIEMPRE antes (gratis):
higgsfield generate cost seedance1_5 --start-image "$IMG" --prompt "$PROMPT" --aspect-ratio 9:16 --duration 8
higgsfield generate create seedance1_5 --start-image "$IMG" --prompt "$PROMPT" --aspect-ratio 9:16 --duration 8 --json
# → ["<job_id>"]. NO --wait (el shell corta a 2 min); pollear: higgsfield generate get <job_id> --json | grep -oE 'https://[^"]+\.mp4'
```

🔑 **Casilla 9 CONFIRMADA a 8 s (probado, no supuesto):** animé `E3-cafe.png` a 8 s, miré 6
frames (0·1,6·3,2·4,8·6,4·7,9 s) y el crop de cara al 100 % del **primer vs último frame**. La
identidad de Lucía **se sostiene el clip entero** — pecas en nariz/mejillas y textura de piel
intactas al inicio Y al final, mismos ojos/cejas. El clip **cierra sobre su cara** (taza abajo,
mirando al lente). Salida exacta: `720×1280 = 9:16`, `8,04 s`, audio AAC. Pieza:
`generadas-20260902/E6-cafe-seedance-8s.mp4`.

⚖️ **Trade-off de duración (el hallazgo útil, no el flag):** con el MISMO prompt de sorbo, seedance
**estira el gesto para llenar el doble de tiempo** — el clip de 8 s pasa ~3 s del medio (≈t1,6–4,8)
con la **taza tapando la boca**. La cara no se pierde nunca, pero hay más "tiempo muerto" bebiendo.
Regla: **4 s cuando cada segundo tiene que mostrar su cara** (reel de máximo contacto visual);
**8/12 s cuando querés b-roll largo y relajado** y no importa que el medio sea el sorbo. No es que
8 s sea peor — es que llena el tiempo extra con MÁS del mismo gesto, no con acción nueva.

---

## 17. ⭐ LA RECETA FANCY 9/9 — consolidada, copiable de punta a punta (E7, 2026-09-02)

> **Qué es esto.** El entregable de la ventana FANCY. §12–16 probaron cada variable por separado;
> acá están **fundidas en un solo flujo** que sale **fancy Y 9/9** sin volver a experimentar. Se
> copia entero. La única pieza que ya pasó las 9 casillas por este camino es el **café** (`D13`),
> así que va como ejemplo concreto — cambiá SÓLO el lugar fancy y el gesto, nunca la estructura.

### Los 4 ingredientes que hacen 9/9 fancy (probados, no supuestos)

| # | Ingrediente | De dónde sale | Por qué es obligatorio |
|---|---|---|---|
| 1 | **Frase de LUZ** `warm golden hour backlight, soft falloff, shallow depth of field` | §12 (E2-B) | Da lo aspiracional (rim dorado + fondo desenfocado) **sin tocar la cara**. Es la palanca fancy que NO cuesta la casilla 1/7. |
| 2 | **Lugar fancy real** (café de especialidad, rooftop, coworking de diseño, hall de hotel) | §12–13 (E1/E3) | Sube fancy sin editorial de moda. Barrio saturado de clutter → documental; lugar lindo con aire → influencer. |
| 3 | **Gesto a medias con las DOS manos sobre un objeto** (café: ambas manos en la taza) | §14 (E3) | Es lo único que separa **9/9 de 8/9** (casilla 5). Y de paso es la mejor base para animar. |
| 4 | **Guarda anti-pantallas** si hay laptop/cel/TV en escena | §14 (E3) | Una UI legible de frente sale con texto corrupto → mata la casilla 3. Apagada, de canto o fuera de foco. |

🔴 **Prohibido para siempre** (cambian la cara): `fashion campaign`, `campaign look`,
`editorial portrait lighting`, `hair pulled back tight`. La frase de LUZ (ingrediente 1) es el
reemplazo aprobado. Ver §12 ⛔ y la sesión 2026-08-31 punto 4.

### Paso 1 — generar la imagen (2 cr, `nano_banana_pro`)

```bash
cd /root/loops/lucia-contenido
REF="hermes-content/references/modelos/lucia/generadas-20260828/G01-cafe-pizarra-texto.jpg"  # foto suya como referencia de cara (asset local, se auto-sube)
OUT="hermes-content/references/modelos/lucia/generadas-YYYYMMDD"   # carpeta del día
mkdir -p "$OUT"

# medir SIEMPRE antes (gratis, no gasta):
higgsfield generate cost nano_banana_pro --prompt "x" --aspect-ratio 9:16 --resolution 2k   # → 2 cr

# EJEMPLO PROBADO 9/9 = el café D13. Cambiá SÓLO el lugar (bloque 2) y el gesto (bloque 5).
higgsfield generate create nano_banana_pro \
  --prompt "Photo of the same woman as in the reference image, keep the exact same face. She is sitting at a window table inside a bright specialty coffee shop, warm daylight coming through the window, softly blurred café interior behind her. She cradles a ceramic coffee cup with BOTH hands, mid-gesture, looking softly toward the lens. She wears a simple linen top. Small gold hoop earrings and a thin gold chain, marked freckles on nose and cheeks, thick eyebrows, brown eyes. Skin with real pore and texture, even tone, no retouch or smoothing. Shot on an iPhone 15 Pro main camera, 24mm. Any signage or screens are out of focus and unreadable. NATURAL TRUE-TO-LIFE COLORS, visible skin pores, natural asymmetry, warm golden hour backlight, soft falloff, shallow depth of field." \
  --aspect-ratio 9:16 --resolution 2k \
  --image-references "$REF" \
  --wait --wait-timeout 6m --wait-interval 5s
# → imprime la URL del PNG en CloudFront. Bajar con: curl -sL "<url>" -o "$OUT/PIEZA.png"
```

El PNG sale **1536×2752** (ratio 0,558) — vertical pero **NO** es 1080×1920 (casilla 2). Sigue el paso 2.

### Paso 2 — export a resolución de publicación (0 cr, resuelve casilla 2)

```bash
P="$OUT/PIEZA"
ffmpeg -y -i "$P.png" -vf "scale=1080:-1,crop=1080:1920" -q:v 2 "$P-STORY-1080x1920.jpg"      # 9:16 historia/reel
ffmpeg -y -i "$P-STORY-1080x1920.jpg" -vf "crop=1080:1350:0:340" -q:v 2 "$P-FEED-1080x1350.jpg"  # 4:5 feed
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$P-STORY-1080x1920.jpg"  # verificar 1080,1920
```
⚠️ **Mirar el JPG**, no sólo el ffprobe: el crop puede comerse una mano si la composición está pegada al borde.

### Paso 3 — puntuar mirando (obligatorio antes de publicar)

Abrir el JPG **y un crop de la cara al 100 %**. Pasa a `PARA-PUBLICAR/` **sólo si da 9/9**:
casilla 1 (¿sigue siendo Lucía? — comparar contra el ancla), casilla 3 (cero texto corrupto),
casilla 5 (gesto a medias visible), casilla 7 (poros/pecas intactos), casilla 2 (1080×1920 exacto).
Fancy: luz dorada ✓, lugar lindo ✓, aire/profundidad ✓ contra la tabla fancy de la bitácora.

### Paso 4 (opcional) — animar a b-roll, GANADOR `seedance1_5` (4,8 cr, §15)

```bash
IMG="$OUT/PIEZA.png"   # el PNG original 1536×2752, seedance reencuadra a 9:16 exacto
PROMPT="She lifts the coffee cup slightly and takes a small sip, then lowers it, blinks once softly. The camera barely moves, like a casual clip filmed while sitting. Nobody looks at the camera."
higgsfield generate cost seedance1_5 --start-image "$IMG" --prompt "$PROMPT" --aspect-ratio 9:16          # 4,8 cr (4s) · 9,6 (8s) · 14,39 (12s)
higgsfield generate create seedance1_5 --start-image "$IMG" --prompt "$PROMPT" --aspect-ratio 9:16 --json  # → ["<job_id>"]
# NO --wait (el shell corta a 2 min). Pollear:
higgsfield generate get <job_id> --json | grep -oE 'https://[^"]+\.mp4'
```
Sale **720×1280 = 9:16 exacto**, 4 s, cierra sobre su cara. `--duration 8`/`12` para b-roll largo
(§16: el medio se llena con más del mismo sorbo, la cara aguanta). **Para animar es `--start-image`
(path local, auto-sube), NUNCA `--image-references`.**

### Los 4 costos de la receta completa — medidos, no re-medir

| Paso | Modelo/herramienta | Costo |
|---|---|---|
| 1 · imagen 2k 9:16 | `nano_banana_pro` | **2 cr** |
| 2 · export a 1080×1920/1350 | `ffmpeg` local | **0 cr** |
| 4 · b-roll 4 s | `seedance1_5` | **4,8 cr** |
| 4 · b-roll 8 s / 12 s | `seedance1_5` | 9,6 / 14,39 cr |

**Foto fancy 9/9 publicable: 2 cr. Con b-roll de 4 s: 6,8 cr.** El cuello nunca fue el crédito —
es mirar y puntuar. Esta receta ya no requiere experimentar: se copia y sale fancy.

### ⚠️ 2026-09-02 — hay un límite DIARIO de generación aparte del saldo

`generate create nano_banana_pro` devolvió
`{"error_type":"grace_daily_limit_reached","data":{"modal_data":{"type":"unlock_full_access_notice"}}}`
**con 1948 créditos en la cuenta**. O sea: el saldo NO es el único techo — hay un cupo diario de
generación (nota de «grace / unlock full access») que se agota antes que los créditos y bloquea
tanto imagen como video por CLI hasta que resetea.

🔴 **Es un bloqueo, no un error de prompt: no se re-mide ni se reintenta en la misma vuelta**
(escalera de agotamiento, regla 0). Si aparece, la vuelta se cierra con la tarea de 0 créditos
(un `CREATIVO.md` que falte, o auditar una pieza vieja) y se anota. El `generate cost` sí sigue
respondiendo gratis aunque el `create` esté bloqueado — medir no cuenta contra el cupo.

### ⚠️ 2026-09-03 — hay un SEGUNDO bloqueo, distinto: la sesión del CLI expira

`higgsfield account status` (y cualquier `generate`) devolvió `Error: Session expired. Hint: Run:
hf auth login`. Ese `hf` es un hint historico y en Windows puede abrir Hugging Face: usar
**`higgsfield auth login`**. **No es el cupo diario** — es la sesión de auth del CLI que caducó. La diferencia
importa para la regla 0:

| Bloqueo | Qué lo cura | Se reintenta al día siguiente? |
|---|---|---|
| `grace_daily_limit_reached` | esperar al reset diario | **sí** — otra fecha, se reintenta |
| `Session expired` (auth) | `higgsfield auth login` **interactivo** | **no** por sí solo — necesita un login humano |

🔴 En una sesión de loop **no interactiva** el `higgsfield auth login` no se puede correr (abre flujo OAuth),
y el balance por MCP (`mcp__…higgsfield__balance`) pide un permiso que la sesión headless no puede
conceder. O sea: con la sesión expirada, **generar y hasta medir el saldo quedan bloqueados de raíz**
hasta que un turno interactivo re-loguee. Igual que el cupo diario: se anota, se hace la tarea de 0
créditos y se cierra la vuelta. No re-medir dentro del mismo turno.

## 18. ✅ El vaso PARA LLEVAR salva la casilla 9 en un retrato (E7-rooftop, 2026-09-03)

`E2-B-rooftop` es un **retrato** (mira al lente, un vaso para llevar en la mano, la otra en la
baranda) — la misma familia que hotel y coworking, que preocupaban por la casilla 9 (sin las dos
manos sobre un objeto, animan a b-roll sutil que NO resuelve una acción). El hallazgo: **si hay un
vaso en la mano, el gesto de resolución existe gratis** — «levanta el vaso, da un sorbo, lo baja».
`seedance1_5` lo ejecuta limpio y **cierra sobre la cara plenamente visible** al bajar el vaso, que
es exactamente lo que pide la casilla 9. Salió a la primera, 4,8 cr medidos, identidad intacta en
los 6 frames.

**La regla:** un retrato con un objeto-en-mano (vaso, taza, celular bajado) anima MEJOR que uno de
manos vacías — el objeto da el arco «subir → usar → bajar» que devuelve la cara al cuadro. El
prompt que funcionó: `She slowly raises the to-go coffee cup toward her lips for a small sip, then
lowers it slightly, blinks softly and keeps her gaze toward the lens.` (misma estructura que el
mechón del hotel §17, pero con resolución real en vez de b-roll puro). Orden de preferencia para
animar un retrato: **objeto-en-mano que se usa (rooftop) > mechón/peso (hotel) > sólo parpadeo.**
