# Síntesis de 14 items — video-intake

**Composición:** 6 IA · 6 MARKETING · 1 WEB · 1 SAAS. Veredictos: 10 SIRVE_YA, 4 MEJORA, 0 HUMO.
**Nivel de fuente:** 10 AFIRMADO · 2 PRIMERA_PARTE · 1 VERIFICADO · 1 DESCARTADO.

---

## 1. Lo que hay que aprender a hacer — por técnica

### 1.1 La referencia PISA la instrucción textual (NUEVO — y corrige lo que teníamos)

`DcMX7O8i6CZ` lo prueba con evidencia dura: el prompt tenía `[TEXT RULE — MANDATORY]` exigiendo formas serif inventadas y **prohibiendo cualquier marca real**, y la salida renderizó legible y correcto `AcneStudios / STOCKHOLM / 1987 1996` copiado de la foto de entrada. Mismo prompt decía `no rack` y los dos últimos planos son un perchero.

**Regla operativa:** en modo referencia, si no querés que algo aparezca, **no lo subas en la imagen**. Prohibirlo por texto no alcanza. La limpieza se hace en el insumo, no en el negativo.

Teníamos la mitad (`avatar-consistency-scheme`: "Soul+texto es el único método para cara IA"). Lo que **no** teníamos:
- **La locación también es placa.** `DcVxcj5M-BQ`: la placa de insumos muestra 3 avatares + **1 placa de paisaje** + producto. El skyline de la placa de 1,5 s es el mismo del plano ancho de 12,5 s. Tres anclas: identidad, locación, producto.
- **Un objeto rígido aguanta mucho mejor que una cara.** `DbYd82HE7sV`: el mismo sillón en 8 entornos radicalmente distintos conservando jacquard, costura, aro tubular y hasta la etiquetita del faldón. `DcMX7O8i6CZ`: 16 planos, mismo objeto. Contraste: `DcVxcj5M-BQ` tiene 1 sola lámina con persona sobre 8.
- **La cláusula de persistencia** (`DZGa5cbJT3n`) para `video_edit`: sin ordenar explícitamente heredar identidad, encuadre, temblor y timing del clip fuente, el modelo re-encuadra o estabiliza y se rompe la ilusión.

### 1.2 Un `soul_id` por generación → multi-personaje va por otro camino (NUEVO, nunca corrido)

Verificado en el contrato de `show_characters`: *"ONE soul_id per generation. Multi-character shots must use show_reference_elements"*. El plano ancho de tres corredores juntos —para el que existe toda la placa de insumos— **no se puede hacer con Soul**. Hay que armar el fotograma fijo con varios `<<<UUID>>>` y recién eso entra como `start_image` del modelo de video. Ese camino no lo corrimos nunca.

Corolario verificado: `cinematic_studio_3_0` **solo acepta** roles `image / start_image / end_image` — no acepta `image_references`. El único de un paso con múltiples referencias es `seedance_2_5` en `omni_reference`.

### 1.3 Sobrecobertura deliberada — el bloque `[MODE]` (NUEVO, y está recuperado literal)

`DcMX7O8i6CZ`, verbatim: *"Fast-cut montage. I am cutting it myself in post. Deliberately overload it — more shots than fit, extra angles I did not ask for, alternate coverage of every beat, inserts, overshoots, impact frames. Every beat is a new shot. Nothing holds."*

Resultado medido: ~16 planos distintos en 11,79 s (0,7 s promedio) en **una sola generación**. Es lo contrario de pedir la toma exacta. No está en el banco.

### 1.4 Palanca de suciedad, versión avanzada: un aparato de captura por imagen (EXTIENDE R10)

R10 ya decía "pedir suciedad, prohibir lo pulido". Lo nuevo, de `Db-nd-CEtP3`: **cada una de las 6 láminas finge una cámara distinta y hereda sus defectos** — flash directo de compacta con fondo cayendo a negro (2 láminas), luz de ventana editorial, contrapicado de celular con **cielo blanco quemado** (el error de exposición es lo que vende la foto), sol duro filtrado por paja. Más un `23·02·23` naranja rotado 90° en el margen: un solo elemento que fecha la foto y mata la sospecha.

Y `DcLNV1dOO8U` / `DYIRUT2Mwwj` lo llevan a video sin generar nada: **filmar la pantalla con el celular en vez de capturar limpio.** Bezel, moiré, encuadre torcido, deriva de mano. La prueba se siente robada, no producida. Cuesta cero.

### 1.5 La regla de supervivencia de la cara (NUEVO, no está en el banco)

`DcVxcj5M-BQ`: ~4 s de cara en 17 s de anuncio, siempre en el beat de agotamiento (ojos cerrados, boca abierta, en movimiento, tapada por un antebrazo). Todo el resto son piernas, pies, manos, nucas, espaldas. `DcJbwUSSuPf` la aplica al revés: casting de 80 años porque las arrugas y los poros se ven reales sin pelear con el modelo. `Da1OHOlIHhF` esconde las manos en sombra y contraluz.

**Aplica a todo lo que generemos, no solo a un molde.**

### 1.6 Costuras: cómo pegar generaciones que no comparten continuidad (EXTIENDE seam-craft)

Cuatro tapa-costuras medidos: corte a negro (`DcVxcj5M-BQ`, en 7,5 s y 11,0 s), **objeto de primer plano que cruza el cuadro** (pilar de hormigón a 14,0 s), whip pan (`DZGa5cbJT3n`, cocina), y **grado de color unificado** (`DcJbwUSSuPf`, teñido verde-oliva) que no es estética: tapa la deriva de color entre generaciones separadas.

Teníamos `seam-craft` y `motion-doctrine` (carrier element, Seam Gate) para HTML. Lo nuevo es el uso contra deriva de generador. Y el carrier element se confirma en `DcS3tJno9ZT`: badge negro de nota en posición fija, idéntico en 8 fotogramas, es lo único que hace que 6 beats se sientan un video.

### 1.7 `video_edit` factura por la duración del CLIP FUENTE (NUEVO — cambia el presupuesto)

`seedance_2_5` en `video_edit` **ignora `duration` y `aspect_ratio`** y cobra por el largo del video de entrada. Filmar 5-8 s, no 30. Nadie lo tenía anotado.

### 1.8 Estructuras de retención sin cifras — cuatro moldes medidos

| Molde | Ítem | Mecanismo medido |
|---|---|---|
| **Escalera numerada** | `DcS3tJno9ZT` | 0→10 en 46 s. Duración **creciente**: 3-6-5-8-13-11 s. Los malos son cortos (ritmo), los buenos largos (enseñanza). El 8/10 lleva autocrítica — compra credibilidad barata. Cero CTA. |
| **Promesa de conteo** | `DcLNV1dOO8U` | "a total of six brilliant moves" en el segundo 12. El espectador sabe cuánto falta; es lo que sostiene 3 minutos. |
| **Placa de insumos ANTES del resultado** | `DcVxcj5M-BQ`, `DcMX7O8i6CZ`, `DbYd82HE7sV` | 3,5 s mostrando con qué se hizo, antes de mostrar qué salió. Convierte "qué lindo" en "cómo hizo eso". Costo cero. |
| **Plano-problema POSPUESTO** | `DcRu-G4gpvu` | Las cajas de fichas de papel van en el segundo 16 de 37, **después** de la solución. Funciona como remate, no como setup. |

### 1.9 Open loop tipográfico: la palabra gateada (NUEVO)

`DcNIJtpltiI`: sustantivo vago gigante entre comillas que **nunca se revela** — `ESTO` · `ERROR` · `«REQUISITO»` · `«OCULTA»` · `«REGLA»` — más una flecha dibujada a mano apuntando fuera del cuadro. Las comillas marcan la cosa como nombrable que no te van a nombrar; la flecha traduce "seguí deslizando" sin escribirlo.

Y su control experimental: **la misma fotografía en las dos columnas** ABURRE/VENDE. Al no cambiar nada más que el texto, prueba visualmente que la diferencia es el copy. Además abarata la pieza a la mitad.

### 1.10 Overlay de transcripción con cronómetro (NUEVO, reproducible entero en HyperFrames)

`DcEOqoYBIwP`. Cuatro detalles que hacen la pieza:
- Revelación **por palabra**, no por letra: cada palabra es un span con opacidad `0 → ~35% gris → 100% blanco`, escalonada. No es typewriter.
- El panel se **vacía** entre turnos.
- El cronómetro y la etiqueta del hablante aparecen con el **cuerpo vacío** y el glifo de onda apagado. Primero el número, después las palabras. **La espera es la demo.**
- Scrim en degradé sobre la mitad derecha que respeta limpia la mitad izquierda (cara + teléfono).

### 1.11 Antifraude con objetos, no con software (NUEVO — y es diseño de producto)

`DcRu-G4gpvu`: **hay dos NFC distintos y no es decoración.** El de acumular es un puck en la mano del barista; el de canjear es un tag fijo en el mostrador. Separa quién puede dar sellos de quién puede canjear, y ata las dos cosas a estar físicamente en el local. Segundo acierto: el objeto es un **tamper de espresso** — le montaron NFC sobre un gesto que el barista ya hace 50 veces al día.

Si vamos a QR (no tenemos hardware), **no es equivalente**: el QR lo escanea el cliente y puede sellarse desde su casa. Tiene que ser QR rotativo en pantalla del comercio, nunca impreso.

### 1.12 Mecanismos de footer (TENÍAMOS A MEDIAS, y el que tenemos está roto)

`DYIRUT2Mwwj`. Tres mecanismos reales:
- **Silueta:** no es una foto de árboles, es una forma rellena con **el mismo token de color del footer**, apoyada sobre la costura, via `mask`. Cero raster, escala a cualquier ancho.
- **Large-type:** `clamp()` sobre `font-size` **no llena el ancho** porque el ancho depende del largo de la cadena. Se hace con SVG de `viewBox` medido una vez y `width:100%`.
- **Grounded:** `center bottom / cover`, contenido arriba, y **sin scrim**. La foto se elige con el tercio superior plano. Poner `rgba(0,0,0,.4)` es el movimiento amateur.

Lo que ya existe: `web-factory/packages/blocks/src/footer-brand.ts` implementa el large-type — **pero topea en `clamp(2.6rem, 8vw, 5.5rem)`, así que en desktop no llena el ancho**, que es literalmente la promesa del estilo. Y el wordmark va arriba-izquierda, no abajo cruzando el ancho.

### 1.13 Minería de demanda por subtítulos (NUEVO como método, herramientas ya instaladas)

`DcLNV1dOO8U` lo regala sin darse cuenta: buscar `"day in the life de <nicho>"` en YouTube, filtrar por vistas, bajar subtítulos, preguntarle al LLM qué producto se repite y si se menciona con marca o genérico. Research de nicho por escucha pasiva. Se corre **hoy** con `ver-videos` (`fetch-video.mjs` + `transcribe.sh`), sin construir nada.

Y su hermano: **delegar el estilo a una marca nombrada** (le pregunta al LLM qué marca ya posee ese vibe → Glossier → "pink and white, clean, dreamy"). Un nombre propio reemplaza un párrafo de adjetivos. Eso ya estaba en el corpus.

---

## 2. Los prompts

### RECUPERADOS (literales, leídos de pantalla) — 1 de 14

**Solo `DcMX7O8i6CZ` entregó un prompt de generación literal**, y encima gateado: el reel corta a 1,5 s de un bloque `[BEATS]` de 12 s. Lo que sí se recuperó entero es **la arquitectura**, que es lo valioso:

```
[STYLE]                  cámara + stock + set + paleta + 3 prohibiciones
[MODE — READ THIS FIRST] la sobrecobertura
[THE OBJECT]             el sujeto, con "no second shirt, no stack, no rack"
[DISTRESS RULE]          el arco: perfecto → destruido, "worn is correct, not damaged"
[TEXT RULE — MANDATORY]  (desobedecido por la referencia)
[HANDS RULE]             (obedecido al pie de la letra)
[BEATS]                  timestamps + corte duro entre cada uno
```

Bloques nombrados en MAYÚSCULAS entre corchetes, cada uno una **regla**, no una descripción. Y la cámara no se adjetiva: `"Arri Alexa 35 and a Laowa 24mm f/14 probe lens"` — un lente probe es exactamente el que produce esos macros volando sobre la tela.

**Otro texto recuperado literal, no de generación pero portable:**
- `DcLNV1dOO8U` — la hoja de vetting de proveedores completa: `Validation | PPU EXW (v1) | Vibe Check | PPU EXW (v2) | Sample Inspection | Vibe Check`, con chips Pass/Fail. Es una máquina de estados de cotización dibujada. Más la salida de ChatGPT con los 4 productos y el panel de Shopify.
- `DcRu-G4gpvu` — `…&order=desc&page=1&limit=100&audiences=all` (confirma filtro y paginación de servidor) + `"You have 15 unredeemed rewards. Tap Redeem and scan the NFC tag."`
- `DcEOqoYBIwP` — overlay verbatim y cronómetros `0.34 s / 0.21 s / 0.32 s`.
- `DcNIJtpltiI` — los 5 pares ABURRE/VENDE completos + caption de 1.880 caracteres con el racional por nicho.
- `DcUSkXRiJKD` — las 10 líneas de nichos (de donde sale el conteo: WhatsApp en 7 de 10, cotización en 4).

### RECONSTRUIDOS — 13 de 14, en tres clases distintas

**(a) Reconstrucción de prompt de generación donde SÍ hubo generación** — 6 items: `DcJbwUSSuPf` (character sheet + 4 planos sin describir la cara), `DZGa5cbJT3n` (4 ediciones + cláusula de persistencia), `DcVxcj5M-BQ` (pipeline de 2 pasos por el límite de soul_id), `DcMX7O8i6CZ` (la cola de beats gateada), `Db-nd-CEtP3` (8 bloques + 5 swap lines), `DbYd82HE7sV` (8 bloques + shot list de 8).

**(b) Reconstrucción de "un prompt que produciría algo parecido" cuando el original NO es IA** — 6 items, y en todos está declarado: `DcRu-G4gpvu`, `DcEOqoYBIwP`, `DcS3tJno9ZT`, `DcUSkXRiJKD`, `Da1OHOlIHhF`, `DcNIJtpltiI`. Tres de ellos recomiendan explícitamente **no generar**: filmarlo sale gratis y sale mejor.

**(c) Ni prompt ni imagen** — `DcLNV1dOO8U` reconstruye una cadena de 3 prompts de LLM (research), `DYIRUT2Mwwj` reconstruye CSS. Escribir un prompt de imagen ahí habría sido inventar un trabajo que el video no hizo.

### Lo portable que sale de los prompts, mirados juntos

1. **El producto no se describe: se hereda de `image 1`.** Describirlo con adjetivos es lo que hace que el tapizado se corra entre tomas. Se ordena preservarlo, no retratarlo.
2. **El bloque de recorrido de cámara es la mitad del prompt y se cronometra, no se adjetiva.** `"at 2s the camera lifts and tilts up... at 4s it keeps craning... at 6s it settles"`. Aparece en 4 reconstrucciones.
3. **Negativos específicos del sujeto al final del genérico.** Los genéricos son ruido; los que salvan la toma son: `extra legs on the animal, broken reflection, rippled water` (el espejo es lo que sostiene el plano), `shoes changing color between strides, a fourth runner appearing`, `legible signage` (el texto basura en carteles es el delator #1).
4. **No hay campo `negative_prompt` en ningún modelo de imagen de la cuenta.** Reverificado sobre 28 modelos. El negativo va dentro del positivo, como último bloque. Ya estaba escrito en `ONIA_MODELOS_RECETA_VISUAL_20260806.md` líneas 121-287 — no rehacer la plantilla.
5. **Regla de entrada:** si el video habla es UGC, si impresiona es cine. 7 de 14 items no tienen habla → plantilla CINE.

---

## 3. Lo que sirve, por frente

**Marketing / motor de contenido** (8 items) — El banco gana 6 moldes nuevos: escalera numerada, placa-de-insumos, plano-problema pospuesto, palabra gateada + flecha, overlay-con-cronómetro, demo-de-estrés. *Falta hoy:* nada técnico — el comentario→DM ya está vivo en producción desde el 18-ago; falta reemplazar el motor de prueba (cifra ajena) por una demo verificable nuestra.

**Influencers IA / Lucía** (4 items) — Método de consistencia confirmado y extendido (placa de locación, objeto > cara, la referencia pisa el texto), más el hallazgo del límite de un `soul_id` por generación. *Falta hoy:* probar `soul_cast` (no figura en ninguna memoria) y correr por primera vez `show_reference_elements` multi-UUID; OK de gasto para el paso de video.

**web-factory** (3 items) — 3 mecanismos de footer que hoy no existen en el catálogo (`ui-patterns/` tiene 7 patrones, ninguno de footer) + el film de producto de 12 s desde una foto + el shot list de 8 tomas. *Falta hoy:* arreglar el tope de 5.5rem de `footer-brand.ts`, dibujar el SVG de silueta, y **una foto real de producto de un cliente** — Marketing Studio tiene 2 productos cargados y los dos son ISDIN de una prueba de junio.

**onia-core / producto** (2 items) — Fidelización: existen 4 de las 5 piezas (`Contact`, `ActivityEvent`, `SavedView`, `CommunicationChannel` + capability WhatsApp); falta `LoyaltyCard` + `Reward` + regla de acumulación. Y la máquina de cotización de proveedor con doble ronda EXW para importadora. *Falta hoy:* escribirlas en `contract.json` y pasar el validador; verificar antes de presupuestar difusión si el 1-oct-2026 de Meta sigue en pie.

**Chatbot / agentes** (1 item) — El molde de demo-de-estrés se rueda hoy en versión texto (WhatsApp + overlay con cronómetro **nuestro** medido). *Falta hoy:* el paso b (que el bot lea la fila del editor de conocimiento) — sin eso no hay nada real que grabar y fabricarlo está prohibido.

---

## 4. Lo que se descarta y por qué

**La oferta "Higgsfield unlimited"** (`DbYd82HE7sV`). Descartada por tres vías independientes: `unlim.available:false` en la cuenta, `"New users only"` en la letra chica del propio anuncio, y ofrece Seedance 2.0 cuando ya pagamos 4.5 y 5.0 Pro. **Es la quinta vez** que el corpus la ve (`DbwPW9VvZ9H`, `DbYojZmyPM3`, `DbvlW-_sj_f`, `Db6GCW8N6sz`, ésta). Regla nueva: no se vuelve a analizar un post por la oferta.

**Toda cifra de resultado del lote.** `$271M` que se contradice a `$2,71M` en el mismo audio (factor 100), `$297/mes` sin fuente, `$150,000` de un caso ficticio, `$52M` de un agregador sin comunicado, `"scroll en 0.1 segundos"` sin estudio. La única cifra del lote que resistió es la que se leyó del panel de Shopify — y era de un tercero.

**Los cronómetros de Fish Audio** (0,21-0,34 s). Métrica del vendedor en su propia demo, sin metodología ni PSTN. Nuestro propio doc del 15-ago mide 1.296-1.740 ms de mediana en llamadas reales (ElevenLabs 1.424 ms). Si ponemos cronómetro, el nuestro medido, o ninguno.

**IP de terceros — cinco casos.** Nike, Roche Bobois, Acne Studios renderizado legible, Jacquemus bordado, y 6 marcas en un solo carrusel. `Da1OHOlIHhF` **cierra el bloqueo abierto de R13** con la respuesta concreta: metraje de marca con logo visible y sin atribuir **no se republica**. El molde se copia, la pieza se pone propia.

**El registro de presunción de plata.** Torres de vidrio con palmeras, jet privado con champagne. Para un vendedor B2B en Bolivia **resta**: una calle real de Santa Cruz prueba que sos local, una torre de Miami prueba que copiaste el reel.

**La fabricación narrativa como método** (`DcNIJtpltiI`). Los 5 lados VENDE son casos inventados presentados como reales. No es fraude —son didácticos— pero copiarlos tal cual publica un cliente que no existe. Sustituto: dolor operativo verificable del rubro ("el cuaderno donde anotás los turnos"), que conserva pérdida + open loop sin inventar nadie.

**El género terror** (`DcJbwUSSuPf`). Se porta el método (character sheet, no promptear la cara, una sola fuente práctica, grado unificado); no la escena.

**Lucía como jueza de correos ajenos** (`DcS3tJno9ZT`). El molde vive de que un humano con criterio juzgue trabajo de otro; una cara IA declarada pierde la única autoridad del formato. Decisión de molde, no limitación técnica.

**El "free starter kit" de hardware** (`DcRu-G4gpvu`). Costo unitario real más importación. El original lo absorbe porque vende suscripción recurrente en otro mercado.

---

## 5. Lo transversal, con números

**El 93% del lote esconde el motor.** 1 de 14 mostró un prompt de generación en pantalla, y gateado a mitad. **5 items lo esconden activamente**, uno de ellos convirtiendo el ocultamiento en argumento de venta ("the model is not the secret"). **9 de 14 (64%) piden comentar o seguir** para entregar el método.

**Whisper degradó términos en 4 de los 8 items con habla, todos medidos:** `"$1,150"` que en la hoja era `$1,15` (factor 1000), `"29 points by $99"` = `$29,99`, `"CityWet"` dos veces en la misma frase por `"Silhouette"`, `"prontos"` por `"prompts"`, `"Shi Jia"` por `"Shijia Liao"`. Más **1 alucinación sobre no-habla** (`"Thank you for watching!"` en 22,78 s de solo música). La regla queda confirmada con evidencia: **ningún número de una transcripción se usa sin mirar el cuadro.**

**7 de 14 no tienen habla.** 3 carruseles + 4 videos mudos o solo con música. La mitad del corpus se entiende con el sonido apagado — y los que sí hablan, hablan poco: el mejor molde del lote sostiene 46 segundos con 6 líneas, y otro sostiene 10,45 s con **seis palabras**.

**Cobertura pobre declarada en 6 de 14.** Muestreo de 1 fotograma cada 4 a 12,6 s. En dos casos deja hueco real: `DcJbwUSSuPf` no puede descartar que hubiera un prompt en un cuadro no muestreado, y `DYIRUT2Mwwj` promete 5 estilos de footer y solo confirmó 3 por imagen (2 quedan solo por audio). Los tres items que extrajeron fotogramas propios con ffmpeg (2-3 fps) son los tres que más contenido literal recuperaron. **El muestreo grueso es el cuello de botella del carril, no la lectura.**

**Los captions faltan en los videos y sobran en los carruseles.** Los 4 items con caption confirmado son 3 carruseles + 1 reel, y en los 4 el caption trajo el método o la letra chica decisiva (el `"New users only"`, el racional por nicho, el nombre del modelo). En los reels, faltó casi siempre. Es un hueco de pipeline de ingesta, no de análisis.

**El bloqueo se repite idéntico en 5 items y no es una herramienta: es que no tenemos qué mostrar.** Cero clientes pagando bloquea la prueba social, la cifra de gancho, la demo honesta y la foto de producto. Todo lo demás del lote es reproducible.

**8 de 14 tienen una mitad de costo cero** producible hoy: los overlays, HUDs, placas y letterbox son geometría CSS en HyperFrames, y las estructuras de guion no cuestan nada. `Da1OHOlIHhF` está medido al centésimo: banda activa de 1080x612 con barras de 654 px, cortes en 2,13 / 3,07 / 3,77 / 4,53 / 4,83 / 5,07 / 5,97 / 7,43 / 8,93. Eso es una caja CSS.

**Estado de cuenta consistente en 6 consultas independientes del mismo día:** plan ultra, 2.205,43 créditos, `unlim.available: false`. Toda generación gasta. **6 items necesitan OK de video (rojo), 3 de imagen (amarillo).** Y el dato de costo que nadie tenía: `video_edit` cobra por el clip fuente.

**Un autor aparece dos veces con el mismo molde** (`adgod`, `DbQVVldE9ty` del 20-ago y `DbYd82HE7sV`), y la misma duda queda sin cerrar las dos veces: afirma cinco veces que no hubo cámara y no aporta una sola prueba, sobre un producto que **sí** es real y fabricado. Dos por dos, sin evidencia. Se declara no verificado, no se maquilla.

**Un hueco de skill nombrado dos veces y todavía abierto:** no existe skill de fotografía de producto, ni en las 33 del repo ni entre las globales. Y "shot list" aparece en 3 docs siempre como **campo vacío de brief**, nunca con contenido. El slot existe hace más de dos días; lo que falta es llenarlo.