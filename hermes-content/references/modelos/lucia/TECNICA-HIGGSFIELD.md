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
4. Modelo **Nano Banana Pro**, aspecto **3:4**, 1K.
5. **Generate** — cuesta 2 créditos.
6. **Mirar el resultado ampliado** contra los rasgos sagrados antes de darlo por bueno.

### ⚠️ El toggle `Unlimited` NO es gratis

Parece un interruptor y es una **venta**: abre un modal de **$5 por 1 día · $12 por 3 días ·
$23 por 7 días**, pago aparte del plan. No tocarlo sin permiso de Sergio.

*(Acá se había escrito antes que "la web no gasta créditos". Era falso, y se corrigió al
tocar el toggle y ver el modal.)*

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

## Pendientes de esta técnica

| Qué | Estado |
|---|---|
| Bajar lo generado al repo | ✅ **resuelto**, y para las dos cosas: el icono de descarga que aparece al pasar el mouse sobre la imagen SÍ funciona —la primera vez falló por errarle a la posición, no por la función—, y para video está en el panel derecho. El archivo cae en `Downloads` y de ahí se copia |
| Probar **Animate** para b-roll de reels | ✅ hecho — ver arriba |
| Probar **AI Influencer** | ✅ hecho — descartado, ver arriba |
| Borrar los dos elements `ZZ-TEST` del workspace | ⬜ el MCP no tiene delete; por web se puede |

## Lo que NO se toca

- El ancla vigente es **`lucia-skin-v1`** (`58bbd635-…`). El viejo `452d8375` tenía una sola
  foto y queda jubilado.
- Las fotos del banco se eligen desde [`BANCO-OFICIAL.md`](BANCO-OFICIAL.md), nunca a ojo.
- El acento gráfico de las piezas es el **verde de Onia `#00D26A`**, en las tres cuentas.
