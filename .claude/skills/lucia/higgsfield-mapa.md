# Higgsfield visto para Lucía — mapa de funciones y pruebas (8-oct-2026)

> **Qué es esto.** Lo que se sabe de TODAS las funciones de Higgsfield, medido el 8-oct-2026, y cómo cada una trata la cara
> de Lucía. Es el detalle de la skill `lucia` (`SKILL.md` §0-quater). Cada cifra es una cotización o un cobro real de ese día;
> los precios se mueven (en agosto Veo 3.1 Lite costaba 1 cr/s y hoy 1,5): **se vuelven a cotizar antes de gastar**.
> - **Evidencia completa:** `hermes-content/references/modelos/lucia/v4/qa/higgsfield-relevamiento-20261008.json` (4 grupos,
>   162 KB) y los clips y fotos de las pruebas en `v4/prueba-motores-20261008/`.
> - **Origen:** Sergio Urcullo, 8-oct: *«aprendas todo lo que es Higgsfield, todas sus funciones, y no perder la cara de Lucía»*.
> - **Cómo se midió la cara:** `scripts/face-gate.sh` (ArcFace buffalo_l contra las 8 referencias oficiales; gate 0,70; una cara de
>   menos de 200 px es poco confiable). Ver `SKILL.md` §0-quater.

## 1. Lo que más pesa (medido, con 6 s y la misma foto K1 y la misma orden)

### 1.1 Video: cuánto sostiene cada motor la cara de Lucía
Mismo arranque (foto K1, `4afffb96`) y misma orden: *«She slowly lifts her eyes from the phone to the camera and gives a small
knowing smile…»*. Identidad = coseno ArcFace contra el centroide de las referencias, en el segundo 0, a mitad y al final.

| Motor (ids de Higgsfield) | Créditos | Cara t=0 → mitad → final | Qué se vio mirando los cuadros |
|---|---:|---|---|
| Kling 3.0 std, `start_image`, sin sonido (control, ya pagado) | 7,5 | 0,79 → 0,73 → 0,72 | Escena igual a la foto. La cara decae sola ~0,07 en 6 s. Cara de ~116 px |
| Kling 3.0 pro, `start_image` | 9 | 0,81 → 0,77 → 0,74 | **Mismo movimiento que std**, solo más nítido y a 1080×1920 nativo. No justifica +1,5 cr si se va a publicar a 720p |
| Seedance 2.0 mini, `start_image` | 6 | 0,69 → 0,63 → 0,64 | La cara deriva **bajo el gate** (como el 30-sep) y **el plano se acerca y cambia el edificio y la calle** (balcones y palmeras que no están en la foto): «foto sola» no garantiza la escena |
| Seedance 2.0 mini, `start_image` + 3 `image_references` | 6 | 0,71 → 0,73 → 0,80 | **Las referencias recuperan la cara** (pecas visibles) al mismo precio. Pero el motor reencuadra (la cara crece de 139 a 347 px) e **inventó un letrero en la torre** («DAISS») aunque el prompt no lo pedía: es el error de G3 |
| Kling 3.0 Omni, 5 `image_references`, sin `start_image` | 6 | 0,80 → 0,81 → 0,82 | **Sostiene y hasta mejora la cara** y es el más barato. Pero **no controla la escena**: inventó otro cuarto, plano abierto que se acerca, ambo más rosado |
| Cinema Studio 3.0, `start_image`, 4 s a 720p | 20 | 0,79 → 0,79 → 0,77 | La cara cae 0,02 (dentro del ruido de ±0,03 con caras de 120-240 px) y **el plano también se acerca**; pero 5 cr/s: 4 veces el precio por segundo de Kling std (1,25) y 2,7 veces por clip (20 contra 7,5) |

Lectura: **cuanto más se ata a la foto de arranque (`start_image`), más decae la cara con el tiempo; cuanto más se ata a las
referencias de cara, más se sostiene pero menos manda la escena.** Para una pieza donde la escena importa (el mismo
mostrador de siempre) va `start_image`; para una donde importa la cara (a cámara, plano cercano) conviene Omni o un motor
con referencias. Cada fila es **una sola toma**: hay varianza, y esta tabla no la mide.

### 1.2 Imagen: qué motor sostiene la cara en una escena nueva
Mismo prompt exacto de la foto K1 y las mismas 6 referencias (ancla espejo primera, 4 fuentes, maniquí del ambo última).

| Motor | Créditos | Identidad | Nota |
|---|---:|---:|---|
| Seedream 4.5 (método diario) | 1 | **0,806** (K1), **0,830** (K2), **0,839** (K4·3) | Tres escenas, tres veces ≥ 0,80. Sigue siendo el principal |
| Kling Omni Image | 0,5 | 0,794 (K1), **0,350** (K2), 0,831 (K4·3) | **Una de tres se perdió la cara** (otra persona, estilo caricatura). Barato pero no confiable |
| Nano Banana 2.1 | 2 | 0,737 | Cumple el gate, 0,07 bajo Seedream |
| Seedream 5.0 Pro | 2,5 | 0,702 | Justo en el piso |
| FLUX 3 | 3 | 0,691 | Bajo el gate |
| GPT Image 2.5 (`flare`, high, 2k) | 2,75 | 0,658 | Bajo el gate |

Cada motor, una sola foto (salvo Seedream y Kling Omni Image, que tienen tres). **No cambiar el método diario por estos datos.**

### 1.3 Labios con un audio dado (evaluación interna; la voz de prueba es Marcela, acento colombiano: NO se publica)

| Vía | Créditos | Identidad | Qué se vio |
|---|---:|---|---|
| Seedance 2.0 mini, foto K4·1 + `audio_references` | 6 | 0,73 → 0,63 → 0,60 → 0,63 | Boca natural a ojo, dientes normales, mueve la cabeza. **La cara cae bajo el gate** y el mp4 **sale sin pista de audio** (hay que montar el mp3 aparte) |
| `sync_so` remap sobre un clip ya hecho (K4, 6,04 s) | 21,75 | 0,81 → 0,76 → 0,71 → 0,75 → 0,75 → 0,75 | **Conserva la identidad del clip de origen** (diferencia ≤ 0,03 contra el mismo instante), cambia solo la boca, y el mp4 **sale con el audio** (5,62 s). Cobra 3,6 cr por segundo del clip de **origen** (21,75 = 6,04 × 3,6), y el clip base se paga aparte |

Lectura: para que Lucía hable sin perder la cara, la vía medida es **clip base con Kling (cara estable) + `sync_so`** (~30 cr por 6 s
con el base) y no el lipsync de un solo paso de Seedance mini. Falta la voz (D4) y cerrar la licencia antes de publicar nada.

### 1.4 Lo que no hay que repetir
- **`sandbox_exec`** de Higgsfield: el control de permisos lo rechazó el 8-oct. El control de cara no lo necesita: corre acá con pip.
- **`jobs_wait`** acepta `jobs: [{index, job_id}]` y vuelve con `timed_out` cada ~10 s: se llama de nuevo hasta `all_terminal`.
  (Una vez, el control de permisos lo rechazó con «Real-World Transactions» justo tras lanzar un job que no se puede
  cotizar; `job_display` por id sirve para mirar el estado sin gastar.)
- **Máximo 3 trabajos simultáneos** en el plan Pro (el cuarto video dio «Rate limit … max 3 concurrent»).
- **Una cotización exacta es el cobro exacto:** 47 cr de video + 11,75 cr de imagen + 6 cr de labios (Seedance mini) cotizados = 64,75 cr, y el
  saldo bajó de 541,26 a 476,51 (= 64,75); `sync_so` no se puede cotizar y cobró 21,75, con lo que el lote entero fue de **86,5 cr**
  (saldo final 454,76). Los redondeos de `get_cost` hay que leerlos en `credits_exact`.
- **No inventar ids largos de un job** (pasó dos veces el 8-oct: dio error o 404). Se copian de `v4/PROCEDENCIA.jsonl`.

## 2. Cuenta (8-oct)
- Plan **Pro**; saldo 541,26 al empezar. El saldo sobrante se borra en cada renovación; los créditos de recarga duran 90 días.
- `show_plans_and_credits` ofrece auto-refill y recargas (4.000 cr por US$190, etc.): **no se compra nada sin decisión de Sergio
  Urcullo**. `unlim.available` es false: no pasar `use_unlim`.
- El historial (`transactions`) muestra los gastos de Higgsfield por pieza y fecha: sirve para auditar un lote.

## 3. Mapa por grupo (relevamiento de solo lectura y cotización del 8-oct)
Cada fila: lo que hace, su costo cotizado y si conserva la cara. «Relev.» es la relevancia para producir videos de Lucía.

## A. Imagen e identidad

Relevamiento con 0 créditos gastados: solo get_cost, el cotizador ai_influencer_prepare (submitted:false) y lecturas. No se creó, entrenó, subió ni publicó nada. Casi todos los modelos de imagen aceptan referencias de cara (rol image_references; soul_2, soul_cinematic, gpt_image_2 y cinematic_studio_2_5 usan rol image, y Soul acepta una sola imagen). Hoy todos cuestan entre 0,12 y 6,5 cr por foto 9:16. El método vigente (Seedream 4.5 con el ancla espejo primera y las 4 fuentes) sigue siendo el más barato con identidad medida (1 cr, 0,81-0,88). El Soul LUCIA-v5 es el respaldo (0,12 cr, 0,803). Ningún otro modelo se midió nunca con la cara de Lucía; el lote comparativo propuesto cuesta unos 24 cr y necesita el OK de Sergio Urcullo. La cara se fija en el cuadro de partida (foto aprobada), y el video solo la hereda; AI Influencer, upscale, outpaint y quitar fondo son accesorios, no fijan identidad.

| Función | Costo cotizado (8-oct) | ¿Conserva la cara de Lucía? | Relev. |
|---|---|---|---|
| Catálogo de modelos de imagen (models_explore) | 0 cr (solo lectura). | No genera nada. Sirve para saber qué parámetro lleva las referencias de cara. image_references: Seedream 4.5 y 5, todos los Nano Banana, GPT Image 2.5, FLUX 2 y 3, Kling… | alta |
| Seedream 4.5 con referencias (método diario vigente) | 1 cr por foto 9:16, en basic y en high (exacto 1). | Con referencias, durante toda la foto, porque la cara se recompone desde las imágenes. Es el que mejor la sostuvo en el repo: ArcFace contra el centroide de las 8 fuentes… | alta |
| Nano Banana Pro con referencias o con Element | 2 cr a 2k con 5 referencias; 2 cr con el Element y sin medias; 4 cr a 4k con 1 referencia. | Con referencias o Element, durante toda la foto. En el repo quedó por debajo de Seedream: Element 0,822 café y 0,693 calle; 7 fotos 0,806 y 0,683. | media |
| Nano Banana 2, 2 Lite, 2.1 y Nano Banana base | Nano Banana 2 a 2k: 2 cr. Nano Banana 2 Lite a 1k: 1 cr. Nano Banana 2.1 a 2k: 2 cr. | No medido para Lucía. Se espera comportamiento de la familia Nano Banana (referencias durante toda la foto), pero no hay medición propia. | media |
| GPT Image 2 y GPT Image 2.5 | GPT Image 2.5 flare high 2k: 2,75 cr (igual al casting del 29-sep); low 1k: 0,25 cr. | No medido para Lucía con referencias. En el repo solo se usó sin referencias, para el casting de cara nueva (C01-C26, descartado). | media |
| Soul 2 con Soul ID LUCIA-v5 / LUCIA-v5b (y Soul Cinema) | 0,12 cr exactos por foto 2k 9:16 (el cotizador muestra '1' redondeado; leer credits_exact). | Entrenado, durante toda la foto. Medido: Soul v5 0,803 de media contra Seedream+ancla 0,838 y Soul v4 0,744 en escenas fuera del dataset. No alcanzó para principal; | alta |
| Otros modelos con referencias: FLUX 3 Image, FLUX 2, Seedream 5.0 Pro/… | FLUX 3 2k: 3 cr. Seedream 5.0 Pro 2k: 2,5 cr. Seedream 5.0 Lite: 1 cr. Kling O1 Image 2k: 0,5 cr. | No medido para Lucía en ninguno. FLUX 3 y Seedream 5 son los más parecidos a lo que ya funciona (varias referencias en un modelo de edición), pero no hay dato propio. | media |
| Lote de imágenes (generate_image_batch) | Es la suma de lo que cotice cada ítem por separado. El lote en sí no tiene cotización. | Igual que el modelo de cada ítem. | media |
| Upscale de imagen (upscale_image, bytedance) | 2 cr a 2k y 2 cr a 4k sobre la foto K1. Asumí 1440×2560 para K1 porque es el tamaño de Seedream basic 9:16; no lo medí. | No medido. El nombre 'bytedance' sugiere un escalador clásico, pero los de Topaz tienen modos generativos (creativity 1-6, face_enhancement) que pueden redibujar la cara;… | baja |
| Outpaint de imagen (outpaint_image) | 2 cr (cotizado de K1 a 16:9). Coincide con los 2 cr de la skill lucia para pasar de 3:4 a 9:16. | Según la descripción de la herramienta, preserva el contenido original y solo pinta los bordes nuevos, así que la cara queda intacta. No medido. | baja |
| Quitar fondo (remove_background) | no verificado: la herramienta no ofrece cotización. | No medido. No debería cambiar píxeles de la cara, pero el pelo suelto y ondulado de Lucía es el borde más difícil del recorte. | baja |
| Soul ID: listar, entrenar y ver estado (show_characters + skill higgsf… | Entrenar no tiene cotizador en el MCP: no verificado hoy. El repo midió 25 cr por saldo (30-sep, soul_2, 16 fotos) y una… | Sí, durante toda la foto, pero solo en imágenes. Para video la identidad la da la foto de partida o el Soul convertido en Element. | alta |
| Elements: listar, ver y crear (show_reference_elements / manage_refere… | list/get: 0 cr. Costo de create: no verificado y no tiene cotizador. | Sí, desde una referencia, pero el rendimiento depende del motor. Por MCP <<<id>>> inyecta solo la primera foto del Element; | alta |
| AI Influencer: opciones, presets y ajustes (ai_influencer_get_options… | 0 cr (solo lectura). | No toca nada existente: lee. Sirve para saber cómo se arma la hoja, no para fijar la cara de Lucía. | baja |
| AI Influencer: cotizar y generar hoja de personaje (ai_influencer_prep… | 1,125 cr por hoja con la foto K1 como identidad; 4,5 cr por 4 hojas sin imagen (1,125 c/u). | No verificado. Con imagen de identidad los grupos de identidad quedan sin fijar salvo que se elijan; no sé qué pesa más cuando hay imagen y rasgos a la vez. | baja |

**Trampas:**
- get_cost redondea hacia arriba lo que muestra: Soul 2 sale 'credits: 1' pero credits_exact es 0,12; GPT Image 2 sale '6' y es 6,5. Siempre leer credits_exact.
- generate_image_batch no se puede cotizar: el tope de un lote se controla sumando las cotizaciones individuales. Más de 5 simultáneas dan 429 y el plan permite 4 concurrentes.
- El rol de la media cambia por modelo: image_references en la mayoría, image en soul_2, soul_cinematic, gpt_image_2, cinematic_studio_2_5 y ms_image. Soul 2 acepta una sola imagen, así que no sirve para pasar 5 fuentes.
- <<<id>>> de un Element por MCP inyecta solo su primera foto; show_reference_elements list también muestra solo la primera (lucia-skin-v1 aparece con 1 en list y con 7 en get). Los otros ángulos se pasan por media_ids en image_references.
- La cotización no valida compatibilidad: soul_cinematic cotizó 0,12 con un Soul soul_2, y el precio del Element no dice si se inyectó una o siete fotos. Un precio correcto no prueba que la identidad funcione.
- Las listas de Souls y Elements siguen mostrando lo retirado y lo ajeno: LUCIA-REAL-v2-clean (piel roja), LUCIA-SINTETICA-v3, lucia-ancla-2026-08 (una sola foto), lucia-face-real-anchor, lucia-face-element, 2 ZZ-TEST, Mara y varios de Sergio. El borrado solo existe en la web. Usar siempre el id completo y nunca el nombre.
- Hay ids duplicados o engañosos: soul_2 y soul_v2 (mismo nombre), nano_banana_pro y nano_banana_2_shots (ambos 'Nano Banana Pro', el segundo sin proveedor), y LUCIA-v4, v5 y v5b con nombres casi iguales.
- models_explore recommend ordena por etiquetas: para 'misma cara desde referencias' dejó fuera a Seedream 4.5 y Nano Banana Pro, que son los medidos. No usarlo para elegir motor de identidad.
- unlim.available es false hoy: no pasar use_unlim. Todo corre con créditos, y los sobrantes se borran en cada renovación.
- Palabras que rompen la cara en escenas nuevas (repo): 'fashion campaign', 'campaign look', 'editorial portrait lighting', 'hair pulled back tight' (afinan la cara y le recogen el pelo); 'dewy glowing skin', 'natural sheen', 'unretouched/natural imperfections' (falsea o envejece); redescribir la cara cuando ya hay referencia.
- Qué conserva la cara en escenas nuevas (repo): ancla espejo PRIMERA, 'Same face, skin and freckles as the first reference image', cláusula de belleza (la escena decide la luz), pelo suelto y accesorios nombrados, ropa como ÚLTIMA referencia con 'Ignore everything that is not the garment', y una acción a medias.
- Seedream 4.5 escribe como texto 'sheet' y 'hex #…' e inventa letreros en las torres aunque el prompt diga 'no signs'. Un puntaje de cara aprobado no aprueba el fondo: se mira la imagen entera.

**No verificado (no darlo por cierto):**
- Identidad con la cara de Lucía de FLUX 3, FLUX 2, Seedream 5 Pro/Lite/Flash, Kling O1 Image, Nano Banana 2, 2 Lite y 2.1, GPT Image 2 y 2.5 con referencias, Cinema Studio Image 2.5, Grok 2.0 y Soul Cinema: nunca medidas en el repo; solo tengo los precios.
- Tope de imágenes de referencia por modelo: el MCP solo lo declara para Soul (1) y ms_image (14). FLUX 3 'hasta diez' y Ideogram 4.5 'hasta cinco' salen de su descripción.
- Que get_cost rechace referencias inexistentes o roles equivocados: no lo probé (las 5 ids de Lucía cotizaron bien).
- remove_background: sin costo ni efecto porque la herramienta no tiene forma de cotizar; no la llamé.
- Costo de entrenar un Soul hoy y de crear un Element: show_characters train y manage_reference_elements create no tienen cotizador. Los 25 cr son una medición por saldo del 30-sep; no se llamó a ninguno.
- Si LUCIA-v5b mide mejor o peor que LUCIA-v5: la lista lo muestra ready y completed, pero no hay medición escrita. Tampoco verifiqué cuánto tardó en la cola.
- Escaladores Topaz (topaz_image, topaz_image_generative) y bytedance_image_upscale vía generate_image: sin cotizar; el 2 cr de upscale_image es de la herramienta dedicada. Las dimensiones de K1 (1440×2560) son una suposición.
- Qué pesa más en AI Influencer cuando se pasan una imagen de identidad y rasgos a la vez, y free_gens_remaining (no vino en la respuesta). build_ai_influencer y ai_influencer_generate no se llamaron; solo vi 10 de los 39 presets.
- Si Kling O1 Image cobra de verdad 0,5 cr: es la cifra más baja de la lista y no hay transacción que la confirme.

## B. Video y motores

Relevamiento del 8-oct-2026 con 0 créditos gastados: saldo 541,26 antes y después. Solo se usó get_cost, models_explore (57 modelos de video listados), show_reference_elements (get), animation_actions (lectura) y balance. Todas las cotizaciones son 9:16, desde la foto K1 (4afffb96) como start_image, con declined_preset_id pasado desde el inicio. Lo que más importa para no perder la cara más allá del cuadro 0: (1) Kling 3.0 Omni (kling_o3_image_reference) acepta hasta 7 imágenes de referencia de la cara durante todo el clip y cotiza 6 cr por 6 s sin sonido, más barato que el Kling std ya pagado (7,5). Nunca se probó en el repo. (2) Seedance 2.0, 2.0 mini y 2.5 también aceptan image_references, y las referencias no suben el precio (mini: 6 cr con o sin refs). (3) Kling 3.0 clásico y casi todos los demás animan desde start_image y no tienen referencias de cara: solo cuadro 0 (más end_image en algunos). (4) El sonido apagado baja el precio solo en Kling (3.0: 10,5 a 7,5; Omni: 7,5 a 6). En Seedance mini, Wan 3.0 y Veo lite cuesta igual con o sin audio. (5) Mejora: bytedance_video_upscale a 1080p cotizó 1 cr y a 4K 4 cr (la skill decía ~0,1: corregir); reframe cuesta 30 cr por 6 s a 720p, ffmpeg es mejor. (6) Motion Control no se puede cotizar con la herramienta motion_control;

| Función | Costo cotizado (8-oct) | ¿Conserva la cara de Lucía? | Relev. |
|---|---|---|---|
| Kling 3.0 (std / pro / 4k) imagen a video | 6 s sin sonido: std 7,5 / pro 9 / 4k 36. std con sonido 10,5. std sin sonido: 3 s 3,75; 15 s 18,75 (1,25 cr/s). | Solo desde el cuadro 0: la foto de arranque es la única fuente de identidad. Medido en el repo: 0,70 a 0,72 contra el primer cuadro en la calle (30-sep), 0,75-0,82 en el… | alta |
| Elements de Lucía con <<<element_id>>> en Kling 3.0 (y Cinema 3.0, See… | Sin recargo: kling3_0 std 6 s sin sonido con <<<58bbd635...>>> en el prompt cotizó 7,5, igual que sin Element. | Parcial: el repo midió (29-sep) que <<<element_id>>> por MCP inyecta SOLO la primera foto del Element, aunque tenga 7. | media |
| Kling 3.0 con start_image + end_image | 6 s std sin sonido: 7,5 (igual que sin end_image). | En los dos extremos, y si el último cuadro es una foto aprobada con la cara de Lucía, el final queda anclado. | media |
| Kling 3.0 Omni (referencias de imagen) kling_o3_image_reference | 6 s std sin sonido: 6 (con 2, 3, 5 u 8 refs: el precio no depende de la cantidad). pro 9. std con sonido 7,5. | Es la vía con más probabilidad de sostenerla durante todo el clip porque las referencias acompañan la generación y no solo el cuadro 0. | alta |
| Kling 3.0 Omni Frames kling_o3_flf | 6 s std sin sonido: 6 (frente a 7,5 de kling3_0 con la misma entrada). | Solo desde el cuadro 0, igual que Kling 3.0. No se midió si su cara es mejor o peor que la del 3.0 clásico. | media |
| Kling 3.0 Omni Edit kling_video_edit | Sobre el clip K1 de 6 s en std: 9. | Si solo cambia ropa o fondo, los píxeles de la cara original se conservan en gran parte (inferido; no medido). Con una referencia de la cara puede reforzar. | baja |
| Kling 3.0 Turbo | 6 s: 720p 9; 1080p 12. No tiene opción de sonido en los parámetros. | Solo cuadro 0. Sin medición. | baja |
| Kling 2.6 | 5 s con sound:false: 5. La respuesta no trajo adjustments, pero con Kling 3.0 un false se había convertido en on, así qu… | Solo cuadro 0. Sin medición. | baja |
| Motion Control (herramienta motion_control / modelo kling3_0_motion_co… | Con K1 como imagen y el clip K1 como guía, fondo de la imagen: std 6 s 11 / std 10 s 17 / pro 6 s 17 / pro 10 s 27 / pro… | Por diseño la identidad sale de la imagen del personaje durante todo el clip y el video solo aporta movimiento: es el control más directo del gesto. Sin medición propia. | alta |
| Genjutsu (hf_mult_motion_control) | Con la foto K1 y el clip K1 como guía: 480p 18; 720p 42. 1080p no cotizado. | Sin medir. Misma lógica que Motion Control (identidad de las imágenes). | baja |
| animation_actions (catálogo de animaciones de rig 3D) | 0: es lectura. | No aplica: anima rigs 3D, no videos de Lucía. | ninguna |
| Seedance 2.0 Mini | 6 s 720p: 6 con generate_audio false o true (el sonido apagado no baja el precio). 4 s 720p: 4. | Con image_references acompaña toda la generación, y con start_image desde el cuadro 0. Medido (30-sep, misma orden que el Kling): 0,68 en el cuadro 0 y 0,60-0,64 en el re… | media |
| Seedance 2.0 (std / fast) | 6 s 720p sin audio: std 27; fast 15. | Soporta referencias de imagen en todo el clip y el Element por placeholder. Sin medición con Lucía. | baja |
| Seedance 2.5 omni_reference | 6 s 720p sin audio: 42. 1080p: 72. Borrador 480p 6 s: 18 (la finalización a 1080p no se cotizó). | Admite referencias durante el clip. Sin medición con Lucía. | baja |
| Seedance 2.5 video_extension | Extensión de 5 s sobre el clip K1: 35 (7 cr/s). | Retoma desde el último cuadro del clip y en agosto conservó plano, ropa, bolsa y luz. La identidad la hereda del tramo anterior. | media |
| Seedance 2.5 video_edit | Sobre el clip K1 de 6 s en 720p: 46. | En agosto devolvió el mismo plano con la camisa cambiada; reescala el video. | baja |
| Cinema Studio Video 3.0 | 720p: 4 s 20; 6 s 30. 1080p 4 s: 40 (el doble que 720p). 4k no cotizado. | Solo cuadro 0 (y end_image). Nunca se midió. | media |
| Cinema Studio Video 3.5 (id cinematic_studio_video_3_5) | 6 s 720p sin audio, prompt_language en: 30. | Acepta referencias de imagen en todo el clip. Sin medición. | baja |
| Cinema Studio 4.0 | 6 s 720p omni_reference sin audio: 42, igual que Seedance 2.5. | Admite referencias. Sin medición. | baja |
| Cinema Studio v2 y v1 | v2 std 6 s sin sonido: 6. v1 no cotizado. | Solo cuadro 0. Medido: es el que más deriva: 0,74 en el cuadro 0 y 0,53-0,60 después, sobre todo al quedar de frente. | baja |
| Veo 3.1 Lite | 6 s sin audio: 9; con audio: 9 (igual). 8 s con start_image + end_image: 12 (1,5 cr/s). En agosto costaba 1 cr/s. | Solo en los dos cuadros que se le dan. En agosto hizo una caminata continua con vestuario más estable que otros, pero sin medición de cara. | media |
| Veo 3.1 (fast, basic) y Veo 3 | Veo 3.1 fast basic 6 s: 24 (4 cr/s). Calidades high y ultra, y Veo 3, no cotizados. | Solo cuadro 0. Sin medición. | baja |
| Wan 2.7 | 6 s 720p: 9. No tiene parámetro de audio para apagarlo. | Solo cuadro 0 (y end_image). Sin medición. | baja |
| Wan 3.0 y Wan 3.0 Prime | 6 s 720p sin audio: Wan 3.0 10,5 (igual con audio) y Prime 18. Wan 3.0 a 1080p: 21. | Admite referencias de imagen en todo el clip. Sin medición. | baja |
| Wan 2.6 | 5 s 720p con 2 referencias: 7,5. En agosto costaba 13. | Referencias durante el clip; sin medición. | baja |
| Minimax Hailuo | minimax-2.3 6 s: 768 6; 1080 10. 512 es incompatible con end_image y con las variantes 2.3. | Solo cuadro 0 (y end_image). Sin medición. | baja |
| MiniMax H3 y H3 Max | 6 s con start_image + 1 referencia: H3 2K 12; H3 Max 768p 15. | Acepta referencias en todo el clip. Sin medición. | baja |
| FLUX 3 Video | 6 s 720p sin audio con start_image + 1 referencia: 33 (5,5 cr/s). | Referencias durante el clip; sin medición. | baja |
| Grok Video 1.5 y Grok Lite | 6 s 720p: v1.5 27; Lite 6. | v1.5 acepta referencias; Lite solo cuadro 0. Sin medición. | baja |
| Happy Horse Video | 6 s 720p: 15. | Solo cuadro 0. Sin medición. | baja |
| Gemini Omni Flash y Flash 1.1 | 6 s 720p con 2 referencias: gemini_omni 18; Flash 1.1 reference-to-video 18. | Referencias durante el clip. Sin medición. | baja |
| Mejorar de 720p a 1080p/2K/4K (upscale_video, bytedance_video_upscale) | Clip K1 de 6 s, 24 fps: standard 1080p 1; standard 4k 4; pro 1080p 10; pro 2k 20. | Mantiene la cara del clip original; no la recupera (a 720p mide ~120 px y el puntaje baja). Puede suavizar poros y pecas, que son el rasgo sagrado: sin medir. | media |
| Topaz Video / Hyperion (upscale con provider topaz) | No verificado. | No verificado. | baja |
| Reencuadrar (reframe) | 6 s: 480p 21; 720p 30; 1080p 57 (5 cr/s a 720p, igual que la skill). | Los píxeles originales se conservan, solo se inventan los bordes. Sin medición. | baja |

**Trampas:**
- La cotización no valida entradas: el Omni aceptó 8 referencias (el límite es 7), un id de Element como image_reference y el parámetro multi_prompt sin chequear formato. Un precio devuelto no prueba que la generación real sea aceptada. El motion control de Higgsfield (hf_mult_motion_control) marcó generation_validated:false.
- La herramienta motion_control y la herramienta upscale_video no tienen get_cost, así que no se llamaron. Para cotizarlas hay que usar generate_video con el modelo equivalente (kling3_0_motion_control exige duration o da 422; bytedance_video_upscale funciona; topaz_video da 422).
- El id correcto de Cinema Studio 3.5 es cinematic_studio_video_3_5. 'cinematic_studio_3_5' da 'unknown model'. Cinema 3.5 por defecto dura 15 s y viene con prompt_language zh.
- El sonido apagado baja el precio solo en Kling 3.0 (10,5 a 7,5) y Kling Omni (7,5 a 6). En Seedance mini (6 y 6), Wan 3.0 (10,5 y 10,5) y Veo 3.1 lite (9 y 9) cuesta igual: apagar el audio ahí solo evita pagar por una voz que se tira, no ahorra créditos.
- Las referencias de imagen no suben el precio en Seedance mini ni en Omni (2, 3, 5 u 8 refs cotizan igual), así que no hay razón económica para pasar menos de las que el modelo acepte.
- Precios que se movieron desde agosto: Veo 3.1 lite pasó de 1 a 1,5 cr/s y Wan 2.6 bajó de 13 a 7,5 por 5 s. Coinciden con la cotización del 30-sep (H3 12, Seedance 2.0 27, Grok 27, Seedance 2.5 42), así que la tabla de agosto de prueba-lipsync-20260815 está desactualizada para esos modelos.
- Un timeout de 60 s en un get_cost (pasó con Cinema 3.0) no envía nada; se repite la cotización. Solo la generación real puede quedar con resultado incierto.
- Los modelos Kling 3.0, Seedance mini, Seedance 2.0, Wan 2.7, Gemini Omni y Motion Control llevan etiqueta 'unlim', pero la cuenta tiene unlim.available false. El toggle Unlimited de la web es una venta de US$5 a 23 aparte: no usarlo ni pasar use_unlim.
- Seedance 2.5 y Cinema Studio 4.0 cotizan igual (42 cr por 6 s a 720p): 4.0 no es una alternativa barata. A 1080p el precio sube a casi el doble (Seedance 2.5 72, Cinema 3.0 40 por 4 s).
- Las pruebas de agosto del repo (image_references, start+end, extensión, edición) se hicieron con el ancla vieja 452d8375, ya jubilada, y con 480p/496x864; sirven como comportamiento general del motor, no como medición de identidad de la Lucía actual.
- Todas las cotizaciones llevaron declined_preset_id 24bae836-2c4a-48e0-89b6-49fcc0b21612 desde el inicio, por lo que no se observó si cada prompt habría disparado la sugerencia IN THE DARK.

**No verificado (no darlo por cierto):**
- La identidad en video de Kling Omni, Kling Omni Frames, Kling Omni Edit, Motion Control, Genjutsu, Cinema 3.0/3.5/4.0, Seedance 2.0/2.5, Veo, Wan 2.7/3.0, Hailuo, MiniMax H3, FLUX 3, Grok, Happy Horse y Gemini Omni: no se generó nada hoy, solo se cotizó.
- La resolución real de salida de cada modelo con 9:16 (en agosto Kling 3.0 devolvió 3:4); los píxeles de 4k de Kling 3.0 y Omni.
- Que Omni acepte realmente 7 referencias, un Element como referencia, y que multi_prompt con cadenas simples funcione; Omni a 10 s (solo se cotizaron 6 y 15 s).
- Precio de finalizar a 1080p un borrador 480p de Seedance 2.5; Seedance 2.0 std a 1080p y 4k; Cinema 3.0 a 4k; Veo 3.1 en calidad high y ultra; Veo 3 y variantes; Hailuo minimax y fast; Seedance 1.5 Pro; Cinema Studio v1.
- Precio de Topaz Video y Hyperion (la cotización da 422); el precio de upscale para clips más largos que 6 s; video_upscale genérico, video_deflicker, video_background_remover, sam_3_video y depth_anything_video (no se cotizaron).
- Motion Control con la herramienta motion_control (no tiene preflight y no se llamó): el precio de 1080p y el efecto de scene_control. hf_mult_motion_control a 1080p y su relación con la duración.
- Si kling2_6 con sound:false se cobra sin audio (la respuesta no trajo adjustments) y si Wan 2.7, Gemini Omni y MiniMax traen audio que se pueda apagar.
- Marketing Studio, Ad Multiplier, Genjutsu replace_object, sync_so, voice_change y dubbing quedaron fuera de este relevamiento (no son motores de video de este grupo o no se pueden cotizar solo con duración).

## C. Audio, voz y labios

Relevamiento de solo lectura y cotización, 0 créditos gastados: el saldo fue 541,26 al empezar y 541,26 al terminar. (1) Audio: Higgsfield hace voz a texto con 7 motores a 0,11-1,7 cr por una línea de ~250 caracteres. Música y efectos sueltos NO: el MCP los rechaza y sonilo, mirelo e inworld son solo para el pipeline de juegos. (2) Voces: list_voices devuelve 114 (113 de catálogo + la propia Lucia-voz, descartada por robótica) con solo género. No traen acento ni idioma ni licencia, y no hay ninguna cruceña. Las únicas candidatas con acento etiquetado (peruano, chileno, ecuatoriano, latam) están en ElevenLabs, fuera del catálogo de Higgsfield, y siguen bloqueadas por la licencia comercial sin confirmar. (3) Labios con audio propio, cotizado hoy para 10 s 720p 9:16 con la foto K1 y el mp3 ya subido: Seedance 2.0 Mini 10 cr, wan2_7 15, wan3_0 17,5, minimax_h3 20, minimax_h3_max 25, seedance_2_0 fast 25, wan3_0_prime 30, seedance_2_0 std 45, grok_video_v15 45, cinema 3.5 50, seedance_2_5 70, cinema 4.0 70. sync_so cuesta 36 (3,6 cr/s) más el clip base. Mini y sync_so son los que el repo vio con cara estable y boca natural a ojo; ninguno tiene puntaje ArcFace durante el clip. (4) voice_change cuesta 0,1 cr/s (10 s = 1) y dubbing 3 cr/s (10 s = 30). (5) La música la pone Sergio Urcullo y los efectos salen de librería libre local.

| Función | Costo cotizado (8-oct) | ¿Conserva la cara de Lucía? | Relev. |
|---|---|---|---|
| TTS Seed Audio 1.0 (voz preset o propia, clon desde audio, pista de im… | 253 caracteres (46 palabras) = 1,7 cr con voz preset Marisol. Igual con la voz propia Lucia-voz (elemento), con audio_re… | No aplica: es solo audio y la cara no entra en la cuenta. | media |
| TTS Text to Speech V2 (5 motores por variante) | Para 253 caracteres: elevenlabs 0,75 · minimax 0,75 · seed_speech 0,5 · vibe_voice 0,5 · cozy_voice 0,25 cr. | No aplica: solo audio. | media |
| Eleven v4 y Eleven v4 Turbo (diálogo multivoz) | 253 caracteres: elevenlabs_v4 = 1,15 cr; elevenlabs_v4_turbo = 0,75 cr. | No aplica: solo audio. | media |
| TTS Qwen Audio 3.0 Flash (con instrucción de dialecto) | 0,11 cr para 253 caracteres. El más barato del grupo. | No aplica: solo audio. | baja |
| Lote de audio | La suma de cada ítem. Ejemplo: 12 voces con cozy_voice (0,25 cada una) = 3 cr; con seed_audio, 12 × 1,7 = 20,4 cr. | No aplica: solo audio. | media |
| Música y efectos de sonido sueltos | No cotizado: la herramienta prohíbe usarlos para audio suelto, así que no se llamaron ni para cotizar. | No aplica: solo audio. | media |
| Catálogo de voces | 0 cr. | No aplica: solo audio. | alta |
| Crear voz clonada | No verificado: la descripción dice que cobra un 'voice-clone credit cost' sin cifra y no existe get_cost. | No aplica: solo audio. | media |
| Cambio de voz en un video | 0,1 cr/s: 10 s = 1 cr, 30 s = 3 cr. El 5-oct: 15 s = 2. | Sí, por construcción: no regenera imagen, solo audio (según la descripción de la herramienta; no probado en Lucía). La cara es la del clip base. | media |
| Doblaje a otro idioma | 3 cr/s: 6 s = 18 cr; 10 s = 30 cr. | No verificado: rehace los labios sobre el video fuente, así que la cara es la del clip base pero la zona de la boca se regenera. No hay prueba en Lucía. | baja |
| Sync Lipsync 3 (labios sobre un video ya hecho) | 3,6 cr/s, lineal, más el costo del clip base: 6 s = 21,6 · 10 s = 36 · 30 s = 108. | La cara viene del video de entrada y solo se regenera la boca. El 15-ago se vio a ojo: 4 formas de boca distintas, dientes normales y pecas intactas (prueba-lipsync-20260… | alta |
| Seedance 2.0 Mini con audio_references (labios de un solo paso) | 10 cr por 10 s a 720p; 6 cr por 6 s; con generate_audio true también 10 (no sube ni baja). | Con start_image la cara arranca fiel (cuadro 0) y después depende del modelo. El 30-sep, a ojo: 'cara estable y fiel, boca articula natural con dientes limpios'. | alta |
| Seedance 2.0 (std y fast) con audio_references | 10 s a 720p con start_image + audio_references: fast 25 cr, std 45 cr. El 5-oct, 6 s: fast 15, std 27. | Igual que Mini: depende del start_image y del modelo. No hay medición. | baja |
| MiniMax H3 y H3 Max con audio_references | 10 s: minimax_h3 2K = 20 cr; minimax_h3_max 768p = 25 cr. Cobrado el 30-sep: 12 cr por 6 s en H3. | Dudosa: el 30-sep, job fee69f56-074d-4c8a-89ef-5a9199bca0cd, la boca articuló variado pero a los 2-3 s hubo labios hinchados y un ojo entrecerrado raro (deriva). | baja |
| Wan 2.7, Wan 2.6 y Wan 3.0 / 3.0 Prime con audio_references | 10 s 720p con audio_references: wan2_7 = 15 · wan2_6 = 15 · wan3_0 = 17,5 · wan3_0_prime = 30 cr. | No medido. wan2_7 en el repo: 'dientes con artefacto'. | baja |
| Grok Video 1.5 con audio_references | 10 s 720p = 45 cr; el 5-oct 6 s = 27. | No medido. | baja |
| Modelos premium con audio_references: Seedance 2.5 omni, Cinema Studio… | 10 s 720p con start_image + audio_references: seedance_2_5 = 70 · cinema 4.0 = 70 · cinema 3.5 = 50 cr. | No medido. | baja |
| Habla nativa del modelo (Kling 3.0, Kling Turbo, Veo 3.1 Lite, FLUX 3… | kling3_0 std 10 s: sound on 17,5 · sound off 12,5 (el 5-oct, 6 s sound on = 10,5). kling3_0_turbo 6 s = 9. | Con start_image la cara arranca fiel. Kling sostuvo la cara en el b-roll (0,70 → 0,72, PROCEDENCIA línea 80), pero la voz sale del modelo y no es la de Lucía. | media |
| Música de la biblioteca comercial de TikTok | 0 cr (lectura). No verificado en vivo. | No aplica: solo audio. | baja |

**Trampas:**
- 8-oct · cotizar sync_so, voice_change y dubbing: solo model + duration en generate_video (sin medias, sync_mode ni voice_id). Con medias input_video/input_audio da 422 'extra_forbidden'. Tarifas lineales: sync_so 3,6 cr/s (6 s 21,6; 10 s 36; 30 s 108), voice_change 0,1 cr/s (10 s 1; 30 s 3), dubbing 3 cr/s (6 s 18; 10 s 30).
- 8-oct · seed_audio, text2speech_v2 y elevenlabs_v4 cotizan igual con una voz que no existe: get_cost no valida voice_id. En elevenlabs_v4 / turbo hay que mandar prompt + dialogue (objetos {text, voice_type, voice_id}); dialogue solo falla en el MCP y sin dialogue el backend da 422.
- 8-oct · las herramientas show_medias (type audio) y sandbox_exec devolvieron 'Structured content does not match the tool's output schema' y no se pudo leer su resultado. El sandbox_exec que se lanzó era solo lectura (importar faster_whisper, curl de un preview .wav, ffprobe) y no sube nada; no se pudo confirmar si corrió.
- 8-oct · list_voices no trae acento, idioma ni licencia; un nombre como Marisol o Ines no prueba español. Escuchar los previews cuesta 0 pero hay que hacerlo con oídos humanos.
- 8-oct · qwen_audio_tts es el TTS más barato (0,11 cr) pero su lista de idiomas no incluye español.
- 8-oct · generate_audio rechaza música y efectos sueltos en el MCP; la skill higgsfield-generate (ruta CLI) dice lo contrario para seed_audio. Hasta probarlo por CLI en el VPS, vale lo que dice el MCP.
- 8-oct · supports_unlim aparece en seed_audio, text2speech_v2, seedance_2_0 (y Mini), wan2_7, kling3_0, gemini_omni, mirelo e inworld, pero unlim.available es false en esta cuenta. No pasar use_unlim.
- 8-oct · Seedance Mini cotiza lo mismo con generate_audio true o false (10 cr por 10 s): la voz propia exige dejarlo en false o el modelo agrega su audio. MiniMax H3 rechaza start_image si va con audio_references; hay que usar image_references.
- 8-oct · las voces de la cuenta ElevenLabs de ONIA (Marcela y las demás de _urls.tsv) no están en la biblioteca de Higgsfield ('Voice not found'); solo se pueden usar generando el mp3 en ElevenLabs y subiéndolo como audio. La licencia comercial de ElevenLabs sigue sin confirmar (cuenta payg = plan gratis).
- Saldo de control: 541,26 cr al empezar y 541,26 al terminar. Cero créditos gastados; ninguna generación, subida, clon ni publicación.

**No verificado (no darlo por cierto):**
- Acento e idioma real de cada voz de Higgsfield: no se pudo escuchar ningún preview (sin Whisper local; sandbox_exec dio error de esquema). Tampoco hay etiqueta de licencia por voz.
- Licencia comercial del audio generado por Higgsfield (incluida la variante ElevenLabs): los Términos §4.4 dicen que las salidas son nuestras y sublicenciables, pero no se leyó una cláusula por voz. Falta confirmación escrita.
- Costo de create_voice y create_voice_from_confirmed_audio: no hay get_cost y la descripción no da cifra.
- Si dubbing conserva el timbre original, qué voz usa y cómo se ve la cara: no se probó.
- Música y efectos por seed_audio o por los modelos de juego: no se cotizaron (la herramienta lo prohíbe) ni se probaron.
- tiktok_music_trending y tiktok_music_tune: sin cuenta TikTok conectada (tiktok_accounts vacío), no se pudieron llamar.
- Identidad con ArcFace durante un lipsync (Mini, sync_so o cualquier otro): nunca medida, solo vista a ojo el 15-ago y el 30-sep. La sincronía de Mini con el mp3 espera el oído de Sergio Urcullo.
- Si Seedance Mini acepta start_image + image_references + audio_references a la vez para sostener mejor la cara: no cotizado ni probado.
- Calidad real de voice_change (acento, naturalidad, labios) y si funciona con un clip de Kling con voz nativa: no probado.
- La forma de dialogue de elevenlabs_v4 en una generación real: el preflight la acepta pero no se ejecutó.
- Escalado del costo de TTS a una narración de 30-60 s: solo hay 253 caracteres = 1,7 cr y 759 = 5 cr (seed_audio); el resto es extrapolación.
- Lipsync Studio de la web (Higgsfield Speak 2.0, Kling Avatars 2.0, Wan 2.5 Speak, Infinite Talk, Kling Lipsync): no aparece en el catálogo MCP de hoy (models_explore) y la regla del repo es usar la web a mano; solo consta por el doc del 30-sep.
- Costo exacto de 6 s con audio_references en wan3_0 y seedance_2_0 fast: se usaron las cotizaciones del 5-oct sin audio; hoy solo se cotizó 10 s con audio_references.

## D. Estudios, presets y apps

Relevé 22 funciones del grupo con 0 cr gastados (balance 541,26 antes y después). Cotizado en vivo con la ancla de Lucía y el clip K1 (6 s): Genjutsu motion control 42 cr a 720p y 18 a 480p, Genjutsu replace 49, Ad Multiplier 42,29, Kling Motion Control 11, Marketing Studio video 60 (12 s) y 75 (15 s), Marketing Studio image 2, Shorts Studio 18 (6 s) y 90 (30 s), generate_3d 20 a 30. No tienen forma de cotizar: los presets (viral, Marketing Studio v2, Genjutsu), las apps, Virality Predictor, video_analysis, Ads Studio y 3D Jutsu. Sigue siendo cierto que Marketing Studio y Shorts Studio son caros (5 y 3 cr/s contra 1,25 de Kling std sin sonido). Marketing Studio no demuestra tomar la cara de Lucía y su audio nativo viene prendido por defecto. Shorts Studio no inventa guion según su esquema, pero re-estiliza todo el video y no tiene entrada de cara. Lo que sirve para Lucía: video_analysis para aprender de referencias, Motion Control para copiar gestos (Kling cuesta 4 veces menos que Genjutsu por el mismo clip), Genjutsu o Ad Multiplier replace si Sergio Urcullo graba y Lucía actúa, y la app Match Cut para montajes deterministas con sus fotos. La identidad con Lucía no se midió en ninguna función: no se generó nada.

| Función | Costo cotizado (8-oct) | ¿Conserva la cara de Lucía? | Relev. |
|---|---|---|---|
| Presets Viral (87 efectos) | No cotizable. get_cost no está soportado para presets. | Solo la foto de entrada (cuadro 0). El resto lo regenera el efecto: clones, derretir, desaparecer y órbitas rehacen el rostro; los looks de estilo repintan la piel. | baja |
| Marketing Studio v2: plantillas de motion y product shots (649) | No cotizable por preset. Referencia del 5-oct: saas_motion 15 s = 90,5 y 10 s = 60,8. | No aplica: la imagen es un producto. La persona sale de un avatar de Higgsfield; uno propio de Lucía exigiría crear un avatar (una escritura) y no hay prueba. | ninguna |
| Marketing Studio Video | 12 s 720p = 60 cr; 15 s 720p = 75 cr (5 cr/s). El 5-oct: 12 s 480p = 42. | No demostrado. La cotización acepta la ancla con rol image (el 5-oct character_photo daba 'Unknown media role'), pero una cotización no valida que la use como cara. | baja |
| Marketing Studio Image | 2 cr a 1k, 9:16, con la ancla. Antes: 3,6 cr cobrados el 29 y 31-ago; el repo decía 4. | No demostrado. Está pensado para producto; con la foto de Lucía como referencia genérica no hay prueba de identidad. | baja |
| Genjutsu: transferir movimiento (hf_mult_motion_control) | Guía K1 de 6 s: 42 cr a 720p y 18 cr a 480p. Tarifa: 3, 7 y 11 cr/s a 480/720/1080p según la doc de Katana, factura roun… | Durante todo el clip y por referencia: la imagen manda el sujeto. La doc de Higgsfield dice que la imagen manda el 'look' completo (cara, pelo, ropa) y que se pierde el t… | media |
| Genjutsu: reemplazar sujeto (hf_mult_replace_object) | 49 cr a 720p con el clip K1 (6,04 s, factura ceil = 7 s). | Durante todo el clip, por referencia. Riesgo documentado: toma el 'look' completo de la foto (en su caso medido, todos los reemplazos vistieron el buzo de la foto). | media |
| Galería Genjutsu (35 presets curados + Trending/New) | No cotizable por preset. Sería la tarifa de Genjutsu por los segundos del guía del preset, que no se pueden leer. | Igual que Genjutsu: la imagen de personaje manda en todo el clip. Sin medir con Lucía. | media |
| Ad Multiplier (modelo ad_multiplier) | 42,29 cr a 720p para el clip K1 de 6,04 s (7 cr/s del video fuente). Cada variante se cobra aparte. | Durante todo el clip por referencia, y la imagen manda el aspecto completo (cara, pelo, ropa). Sin medir con Lucía. | media |
| Kling 3.0 Motion Control (comparación, fuera del grupo) | 11 cr por 6 s en std (1,83 cr/s). El 5-oct: 17 cr por 10 s. | Por referencia en todo el clip; sin medir con Lucía. | alta |
| Shorts Studio | 3 cr/s: 6 s = 18, 30 s = 90, 60 s = 180. | No. Re-pinta todos los cuadros hacia el estilo elegido; la piel y el rostro cambian. Sirve solo si se quiere una versión ilustrada a propósito. | baja |
| Ads Studio | No verificado: la cotización exige tener una marca. | No aplica: genera imágenes de producto, sin entrada de cara. | ninguna |
| Virality Predictor | No verificado. La herramienta no tiene get_cost y no hay modelo cotizable: generate_video con 'virality_predictor' y 'br… | No toca la imagen: solo lee el video. La cara no cambia. | media |
| Análisis de video (video_analysis_*) | No verificado, probablemente 0: en transactions no hay cargo junto a los análisis del 19-ago 02:46 y del 21-ago 00:33. | No toca la imagen: solo analiza. | alta |
| 3D Jutsu: escenas 3D alojadas (scene_builder_3d_*) | No verificado: no tienen get_cost. Referencias: Seedream 5 Pro 2k = 2,5 cr; | La escena no lleva a Lucía. La cara entra solo como referencia (1 foto en generate_angles o imágenes en Seedance 2.5); | baja |
| Generación 3D (generate_3d) | image_to_3d sin textura con la ancla = 20 cr. multi_image_to_3d con las 4 fuentes de cara y textura = 30 cr. | Reconstruye una cabeza 3D con el parecido que dé la malla; no sirve para video de Lucía. No hay forma de importarla a 3D Jutsu (solo catálogo). | ninguna |
| App Match Cut + Tracelab (Marketplace de apps) | No verificado: apps_describe no trae precio y apps_invoke no tiene cotización. | Sí, en el sentido más fuerte: no hay generación. Los píxeles de las fotos de Lucía entran y salen tal cual; facecut solo las alinea. | media |
| Recetas de get_preset_instructions (61: push-in, whip-pan, reel-cover,… | Sin cotizar; depende del modelo que la receta fija. | No: las recetas tratan la imagen como PRODUCTO ('preserve exact product shape') y prohíben agregar personas o manos. | ninguna |
| Workflow ugc-video (6 formatos) | Por etapa, cotizado: clip de 15 s en 1080p = 180 cr y en 720p = 105 cr (Seedance 2.5 omni_reference con la ancla); | Por referencia en cada tablero y cada clip (character_media_id). Con Seedance 2.0 Mini el repo midió deriva leve; Seedance 2.5 con Lucía, sin medir. | media |
| Workflow narration: modo presentador | Por bloque de 10 s: unos 32 cr (gemini_omni 30 + gpt_image_2 1 + voice_change 1 por 10 s). | Por referencia durante todo el bloque (la foto con fondo verde 'copiada fielmente'); el parecido de gemini_omni con Lucía no se midió. | media |
| Workflow katana (remake de un video de referencia) + presets Katana | Documentado por Higgsfield: un caso de 10,5 s costó 83 cr (71 usados); el original rondaba 120 cr por segundo final. | Con la imagen del sujeto como referencia en Genjutsu o en el cuadro inicial; sin medir con Lucía. | media |
| Workflow character-sheet | Modo A 0 cr. Modo B: 1 imagen 16:9, depende del modelo (sin cotizar). | Es texto a imagen: no usa la foto de Lucía como referencia. Sirve para dar vistas, no para fijar la cara. | baja |
| Workflows de edición: video-montage y video-editing (Higgsedit) | No cotizado: son pasos del sandbox, sin precio documentado. | Sí: editan píxeles ya generados, sin regenerar la cara. | baja |
| Workflows de apoyo: faceless-video + 22 estilos explainer, thumbnail-g… | No cotizado. | faceless-video no tiene cara. thumbnail-generation fija la identidad por referencia en imágenes (Nano Banana Pro, 4K) y es lo único aprovechable para portadas de Reels. | baja |

**Trampas:**
- get_cost no existe para presets (viral, Marketing Studio v2, Genjutsu): generate_video con model higgsfield_preset devuelve 'Cost preflight (get_cost) is not yet supported for Higgsfield presets'. El único precio posible es ejecutar y comparar el balance.
- Genjutsu cobra por segundos del clip guía y no por la salida: motion control round(s) y replace ceil(s). El K1 de 6,04 s cuesta 42 en motion control y 49 en replace. Con 4 s exactos la tarifa mínima es la de 4 s.
- Genjutsu y Kling Motion Control no son el mismo precio: 42 cr contra 11 cr por el mismo clip de 6 s a 720p/std. kling3_0_motion_control exige duration (sin ella devuelve 422).
- generate_video corrige solo los roles: 'image' y 'video' pasan a image_references y video_references. generation_validated:false en la cotización de Genjutsu significa que solo se validó que haya medios, no que la generación vaya a funcionar.
- get_presets con preset_id: para Genjutsu solo funciona con category 'all' y sin query ni cursor (con 'genjutsu' da error). Marketing Studio solo acepta category motion o product-shot; 'ugc' da error, así que el catálogo UGC no se lista por esta vía.
- get_presets con preset_id abre un widget y devuelve el esquema de entradas: no ejecuta ni cotiza.
- Marketing Studio video acepta hoy la ancla con rol image al cotizar (el 5-oct character_photo daba error), pero la cotización no prueba que se use como cara. generate_audio queda en true por defecto.
- Ads Studio no cotiza sin una marca creada; crear la marca es una escritura.
- Las apps no muestran precio en apps_describe y apps_invoke no tiene cotización. Reciben URLs HTTPS de imagen, no media_id.
- Virality Predictor y brain_activity no existen como modelo cotizable en generate_video ('unknown model').
- El workflow katana ordena 'no pidas confirmación, incluido el gasto' y el de ad-multiplier habla de 'aprobar personas generadas': ambos chocan con la regla de ONIA de aprobación por generación paga. No cargarlos para ejecutar sin tope.
- El workflow character-sheet exige 'estructura facial madura' y 'personaje original' y el ugc-video habla inglés con acento americano por defecto: ninguno calza con la cláusula de belleza ni con la voz cruceña de Lucía.
- Los precios del repo se corrigen: Marketing Studio Image 2 cr (TECNICA decía 4), Marketing Studio video 12 s = 60 (el repo solo tenía 15 s = 75), Seedance 2.5 15 s 1080p = 180 y 720p = 105.

**No verificado (no darlo por cierto):**
- Costo de execute_preset en los tres catálogos (viral 87, Marketing Studio v2 649, Genjutsu 35): sin preflight, nunca se ejecutó.
- Costo de las 28 acciones de la app Match Cut + Tracelab y si cobran créditos o llevan marca de agua. No se invocó ninguna acción, ni list_render_modes.
- Costo de virality_predictor y de video_analysis_create: sin get_cost. En transactions no hay cargos, pero nunca se midió con balance antes y después.
- Costo de Ads Studio (exige crear una marca) y de 3D Jutsu: crear proyecto, editar escena, generate_angles y generate_video no tienen cotización. Los valores de referencia (Seedream 5 Pro 2,5 y Seedance 2.5 a 7 cr/s) son de otros modelos.
- Que Marketing Studio siga inventando guion y voz hoy: se infiere del esquema (audio nativo prendido, hooks y ad_reference con narración) y del 5-oct, no se generó. Que Shorts Studio no los invente sale de que su esquema no recibe guion ni voz.
- Que Marketing Studio use la imagen con rol image como cara, o que un avatar custom con la cara de Lucía funcione (crear el avatar es una escritura).
- Identidad de Lucía (face_identity_qa) en Genjutsu, Ad Multiplier, Kling Motion Control, presets, narración presentador y ugc-video: nada se generó, solo se cotizó.
- Qué le hace exactamente cada preset viral a la cara: se leyeron solo las descripciones del catálogo, no se miraron los mp4 de preview.
- Duración de los videos guía de los 35 presets de Genjutsu, y los catálogos Trending y New de Genjutsu: no se listaron.
- Inputs de los presets Katana (no se abrió get_preset_instructions /katana/<slug>) y costo del flujo completo de ugc-video, katana y narración presentador (solo etapas; narración viene del 5-oct).
- Costo mínimo de Shorts Studio a 4 s (solo 6, 30 y 60 s cotizados) y si un preset de usuario con imágenes de referencia conserva algo de la cara.
- Resolución exacta de salida en 9:16 de Genjutsu y de Kling Motion Control con la ancla.

