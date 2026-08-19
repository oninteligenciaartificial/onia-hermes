# Plantillas de prompt de video — CINE y UGC (no mezclar)

Fuente de verdad de **cómo se escribe un prompt de video en ONIA**. Sale de dos reels que
mostraron el prompt completo en pantalla, analizados en el carril A:

- CINE → `../references/video-intake/2026-08-16-carril-a-como-se-hicieron.md` (§1)
- UGC → `../references/video-intake/2026-08-18-ugc-auto-receta-completa.md`

> Esos docs de referencia se leen, no se editan. Lo que se corrige es este archivo.

---

## LA REGLA QUE DECIDE

**Si el video HABLA, es UGC. Si el video IMPRESIONA, es cine.**
Se elige **antes** de escribir la primera palabra. Mezclar las dos arruina las dos.

| | **A · CINE** | **B · UGC** |
|---|---|---|
| Tomas | **una sola**, continua, sin cortes | **muchas**, cortes duros |
| Mitad del prompt | el **recorrido de cámara**, coreografiado | los **beats con diálogo**, cronometrados |
| Cámara | dron/dolly, inercia, curvas | celular en mano, autofoco que caza |
| Estética | grado de cine, grano, aberración | compresión, temblor, **sin grado** |
| Diálogo | no hay | **es el eje** |
| Consistencia | no hace falta (una toma) | ancla de personaje repetida en cada beat |
| Sirve para | pieza de marca, hero shot | anuncio, testimonio, demo |

---

# PLANTILLA A — CINE

**Cinco bloques, en orden fijo.** No es el texto lo que se copia: es el orden.

| # | Bloque | Qué hace |
|---|---|---|
| 1 | **Tipo de toma** | una línea, primero. Declara "una sola toma continua, sin cortes" |
| 2 | **Entorno y atmósfera** | dónde pasa y con qué aire |
| 3 | **RECORRIDO DE CÁMARA** | **el bloque más largo (~120 palabras) — la mitad del prompt.** Paso a paso en el espacio: dónde arranca, por dónde pasa, dónde banquea, dónde termina |
| 4 | **Detalles de movimiento** | la física que lo hace creíble: inercia, microcorrecciones, focus breathing, **`speed contrast`** |
| 5 | **Luz y color** | el grado, **al final** |

**Los dos hallazgos que cambian cómo escribimos:**

1. **La cámara se coreografía, no se adjetiva.** Pedirle "movimiento cinematográfico" es lo que
   nos venía saliendo genérico. El bloque 3 es puro recorrido espacial narrado.
2. **`speed contrast`** — sujeto en cámara lenta, cámara rápida. Una frase, y es lo que hace que
   el plano se sienta caro.

**Añadido nuestro (NO está en la plantilla original):** un cierre de negativos al final del
bloque 4. La plantilla CINE de origen no tiene bloque de negativos; nosotros lo agregamos porque
nos importa **no generar caras** (ver la sección "Lo que este lote NO resuelve").

## Ejemplo completo — `@oniahq` · "El costo invisible" · 10 s · 9:16

**Por qué esta pieza:** `@oniahq` publica el dolor del dueño de negocio (cuaderno, WhatsApp a
mano, costo invisible) y el próximo hueco de producción es la **semana del 02-sep**. La pieza
**no habla** → es cine. Y **no hay cara humana en cuadro**, así que esquiva de raíz el problema
de consistencia. Es contenido propio: no necesita cliente.

```text
Single continuous macro dolly shot, no cuts, vertical 9:16.

The cramped back office of a small shop after closing, 21:40. A wooden desk under one warm
tungsten bulb: a spiral notebook open and filled with handwritten client names and amounts,
a calculator, a clip holding a stack of paper receipts, a cold cup of coffee, dust suspended
in the air, the half-closed roller shutter of the shop far in the background.

The camera starts extremely low and tight on the calculator keys at the left edge of the desk,
almost grazing the wood, then slides right along the desk surface, passing the cold coffee cup
in soft foreground blur, and rises just enough to skim the open notebook, travelling over the
handwritten rows one by one, the ink sharpening as it passes each line. Near the bottom of the
page it banks slightly left and pushes toward a phone lying face up beyond the notebook, where
unread message notifications stack one over another on the lock screen. It keeps pushing until
the screen fills the lower third of the frame, then tilts up a few degrees and settles on the
dark doorway behind the desk, still creeping forward.

Slight roll through the bank, natural dolly inertia and micro-corrections, faint focus breathing
as it crosses the notebook, dust motes drifting in dreamy slow motion while the camera keeps
moving fast, speed contrast. No hands, no people, no faces at any point; no on-screen text,
no logos.

Warm amber key falling off into deep cold shadow, one single practical light source, heavy film
grain, slight halation on the phone screen, muted desaturated wood tones, no color pop.
```

**El texto va encima, no adentro.** El copy (gancho, dato, CTA) se quema en HyperFrames sobre el
render — nunca se le pide al modelo que escriba texto.

---

# PLANTILLA B — UGC

**Seis mecanismos + una declaración de montaje.** Cada uno está por una razón.

| # | Mecanismo | Para qué |
|---|---|---|
| 1 | **Cabecera técnica global** — formato, duración, qué cámara finge ser | fija todo antes de contar nada |
| 2 | **Defectos pedidos a propósito** — `grain, compression, wobble, autofocus hunts, no filters or grading` | **se le pide fealdad al modelo**, que por defecto tira a pulido. Es lo que lo hace parecer UGC real |
| 3 | **Negativos del formato** — `phone never in frame, reflections, or her hands` | el modelo mete el celular en los reflejos porque "alguien está filmando". Hay que prohibirlo explícito |
| 4 | **Anclas de consistencia INLINE** — la referencia inyectada **en el punto del texto donde importa**, no como adjunto suelto | mantiene el mismo personaje/producto entre cortes. ⚠️ Ver la advertencia de sintaxis abajo |
| 5 | **Realismo de piel detallado** — `matte real skin — pores, redness, baby hairs, no glare, no retouch; natural blinks, micro-expressions` | separa "modelo de stock" de "persona". Cinco atributos concretos, ninguno genérico |
| 6 | **Beats con timestamp + referencia + DIÁLOGO LITERAL ENTRE COMILLAS** | cada corte es una línea |
| + | **`HARD CUTS only`** declarado **una sola vez arriba** | gobierna todo el montaje. El resumen de segunda mano se lo salteaba |

## El diálogo entre comillas sale palabra por palabra — VERIFICADO

Se comparó el prompt en pantalla contra el audio del video generado:

| Prompt pedía | Audio del resultado |
|---|---|
| `"Okay — I'm SELLING my car. Let me show you."` | `I'm selling my car.` / `Let me show you.` |
| `"Look at this interior — barely driven."` | `Look at this interior, barely driven.` |

**Las frases entre comillas salen dichas tal cual. El guion se escribe en el prompt, no se
corrige después.** Precisión honesta: la interjección de apertura (`Okay —`) no aparece en la
transcripción; las oraciones sí, completas. O sea: escribir oraciones, no muletillas.

## ⚠️ Advertencia de sintaxis — `<<<image>>>` no está confirmado en nuestra vía

El reel muestra `<<<image>>>` incrustado en el texto. **En el catálogo de nuestra cuenta las
referencias NO son un token de texto**: son roles de media (`image_references`, `start_image`,
`end_image`, `video_references`, `audio_references`). Puede ser una particularidad de la
interfaz web de Higgsfield.

**Cómo escribirlo hasta probarlo:** dejar el ancla como **texto descriptivo nombrado** en el
punto exacto del beat (`same character as reference A`, `same car as reference B`) y pasar las
imágenes por `image_references`. Probar el token literal en una sola generación barata antes de
prometerlo.

## Ejemplo completo — Lucía · "El cuaderno" · 15 s · 9:16

**Por qué esta pieza:** Lucía es la cuenta de alcance, formato reel vertical, y **habla** → es
UGC. El tema es el mismo dolor que `@oniahq` trabaja en carrusel, dicho en voz. Contenido
propio: no necesita cliente.

```text
Handheld friend-cam UGC, 9:16, 15s, iPhone back cam — grain, compression, wobble, autofocus
hunts, no filters or grading; phone never in frame, reflections, or her hands. HARD CUTS only.
Character = reference A (same woman in every shot, same hair, same top): matte real skin —
pores, redness, baby hairs, no glare, no retouch; natural blinks, micro-expressions.
Spoken language: neutral Latin American Spanish.

0-4s reference A, small shop counter at closing time, warm overhead light, muffled street
noise outside. She leans on the counter, a spiral notebook open beside her, looks straight to
lens: "Tu negocio no pierde plata en las ventas. La pierde en el cuaderno."

4-9s HARD CUT, tighter, over-the-shoulder onto the notebook: her finger runs down a column of
handwritten names, autofocus hunts once on the page then settles; she speaks from off the top
of frame: "Cada nombre acá es un cliente al que nadie va a volver a escribir."

9-15s HARD CUT, back to her at the counter, phone face up on the wood with unread message
badges. She shrugs, half-smile to lens: "Eso lo puede hacer un sistema solo. Te muestro cómo."
```

**Gates antes de generar esta pieza (no son opcionales):**

- **La cara de Lucía sale de Soul, no de una descripción de texto.** Se genera el still con
  `soul_2` + su `soul_id` y ese still entra como `image_references`. Nada de este lote reemplaza
  Soul+texto — ver la sección final.
- **Etiqueta de IA obligatoria** en el post. "Es IA" no se esconde.
- **Cero claim.** El CTA cerrado en "te muestro cómo": sin plazos, sin cifras, sin resultado
  garantizado.
- **Variante cliente = plantilla reusable.** El mismo molde sirve para un rubro con producto y
  precio (automotoras, comercio), pero **hoy no hay ningún cliente real con el sistema andando**
  — `web-factory/data/clients/` son 8 demos + Nuvia, que es proyecto propio de Onia. Cualquier
  ejemplo con cliente queda como plantilla con placeholders hasta que exista uno.

---

# Catálogo de modelos de video — consultado **2026-08-18**

> **Este dato tiene fecha de vencimiento.** El 16-ago escribimos seis veces que `seedance_2_5`
> "no existe en la cuenta"; el 18-ago **sí estaba**. Una verificación **se repite, no se cita**.
> Consultado con `models_explore` (`action: list` y `action: search`, `kind: video`) — consulta
> gratis, cero créditos.

## Los que nos sirven para estas dos plantillas

| Modelo | Duración | Resoluciones | Aspect ratios | Modos / notas |
|---|---|---|---|---|
| `seedance_2_5` | **4-30 s** | 480p · 720p · 1080p | auto · 21:9 · 16:9 · 4:3 · 1:1 · 3:4 · 9:16 | `mode`: `t2v` / `omni_reference` / `video_edit` / `video_extension`; `generate_audio` (true por defecto); `bitrate_mode`; `extension_mode` fwd-bwd. **El único que pasa de 20 s** |
| `seedance_2_0` | 4-15 s | 480p · 720p · 1080p · **4k** | auto · 16:9 · 9:16 · 4:3 · 3:4 · 1:1 · 21:9 | `mode`: `std` (480p a 4k) / `fast` (480p-720p); `genre`; `generate_audio`; refs de imagen/video/audio, start+end frame |
| `seedance_2_0_mini` | 4-15 s | 480p · 720p | igual que 2.0 | sin `mode` (solo `resolution` + `bitrate_mode`); `genre`; `generate_audio`. **El barato de prototipo** |
| `flux_3_video` | **5-20 s** | 720p · 1080p | auto · 21:9 · 2:1 · 16:9 · 4:3 · 1:1 · 3:4 · 9:16 | audio sincronizado (voz + efectos + ambiente, true por defecto); start/end image, `image_references`, `video_references`, **continuación de video** |
| `cinematic_studio_3_0` | 4-15 s | 480p · 720p · 1080p · **4k** | auto · 21:9 · 16:9 · 4:3 · 1:1 · 3:4 · 9:16 | `genre` (action/horror/comedy/noir/drama/epic); `generate_audio` **false por defecto**. Cine-grade |
| `cinematic_studio_video_v2` | 3-12 s | no expone `resolution` | 1:1 · 4:3 · 3:4 · 16:9 · 9:16 | `genre`; `mode` pro-std; `sound` on-off; `speedramp` (slowmo/speedup/impact); **`multi_shots` + `multi_shot_mode`** = varias tomas en una generación; `cfg_scale`; `preset_id` |
| `wan2_7` | 2-15 s | 720p · 1080p | 16:9 · 9:16 · 1:1 · 4:3 · 3:4 | audio sincronizado, **consistencia de personaje**; start/end image + `audio_references` |
| `minimax_h3` | 4-15 s | **2K** | auto · 21:9 · 16:9 · 4:3 · 1:1 · 3:4 · 9:16 | refs de imagen/video/audio, start+end frame; `batch_size` 1-4 |
| `gemini_omni` | 4-10 s | 720p | 16:9 · 9:16 | audio nativo; `image_references` + `video_references` |
| `veo3_1` | 4 / 6 / 8 s | no expone `resolution` | 16:9 · 9:16 | `quality` basic-high-ultra; variante preview (calidad) o fast |
| `veo3_1_lite` | 4 / 6 / 8 s | no expone `resolution` | 16:9 · 9:16 · auto | `generate_audio` false por defecto (activarlo **sube el costo**); start+end image |
| `veo3` | no expone `duration` | no expone `resolution` | 16:9 · 9:16 | variante `veo-3-preview` o `veo-3-fast`; audio |
| `grok_video_v15` | 2-15 s | 480p · 720p · 1080p | no declara | start image, `image_references`, `audio_references`; marcado `preview` |
| `grok_video` | 1-15 s | no expone `resolution` | 16:9 · 9:16 · 1:1 | audio; start image |
| `kling3_0_turbo` | 3-15 s | 720p · 1080p | 16:9 · 9:16 · 1:1 | rápido y barato; solo start image |
| `happy_horse_video` | 3-15 s | 720p · 1080p | 16:9 · 9:16 · 1:1 · 4:3 · 3:4 | solo start image |
| `marketing_studio_video` | **12-15 s** (fijo) | 480p · 720p · 1080p | auto · 21:9 · 16:9 · 4:3 · 1:1 · 3:4 · 9:16 | ver la sección de Marketing Studio |
| `higgsfield_preset` | según preset | según preset | 16:9 · 9:16 · 1:1 | `preset_id` obligatorio; imagen a video |

**Utilitarios (no generan escena):** `clipify` (1 URL de YouTube a hasta 20 clips 9:16/1:1/16:9
con subtítulos), `topaz_video` y `bytedance_video_upscale` (upscale hasta 4k, presets `ugc` /
`aigc` / `old_film`), `video_upscale`, `video_deflicker`, `video_background_remover`.

**`unlim.available` = `false` al 2026-08-18.** `seedance_2_0`, `seedance_2_0_mini`, `wan2_7` y
`gemini_omni` figuran como elegibles para generación ilimitada, **pero hoy no se puede gastar
ahí**. Toda generación consume créditos → **permiso explícito de Sergio, caso por caso.**

## Qué modelo para cada plantilla, y qué cuesta

Precios en **créditos por segundo**, medidos el 2026-08-14 contra el balance real
(`HIGGSFIELD_AD_SPEC_RECETA_20260812.md`, sección "Tarifario completo"). El precio es **lineal
por segundo**. Los modelos sin fila ahí **no tienen precio medido**: preflightear con `get_cost`
antes de tirar el job.

| Pieza | Modelo sugerido | Prototipo<br>`mini` 480p (1,00 cr/s) | Publicable<br>`2.0 fast` 720p (3,50 cr/s) | Premium<br>`2.0 std` 1080p (9,00 cr/s) |
|---|---|---|---|---|
| **CINE** — 10 s, una toma | `seedance_2_5` t2v, o `cinematic_studio_3_0` con `generate_audio: false` | **10 cr** | 35 cr | 90 cr |
| **UGC** — 15 s, 3 cortes | `seedance_2_5` en `omni_reference` (el único que hace 15 s con refs + audio) | **15 cr** | 52,5 cr | 135 cr |

Aparte y despreciable: el still de cara con `soul_2` (0,36 cr por 3 imágenes en la medición del
12-ago). **`seedance_2_5` y `cinematic_studio_3_0` no están en la tabla medida** — los números
de arriba son el equivalente en la familia `seedance_2_0`: sirven para dimensionar, **no para
autorizar**. Antes de generar, `get_cost` con la config exacta.

**Método, no negociable:** prototipar en `mini` 480p, mirar el corte, y recién re-renderizar la
ganadora. Ir directo a 1080p sin haber visto nada es pagar 9 cr/s por algo que todavía no sabés
si sirve.

---

# Marketing Studio vs prompt a mano

`marketing_studio_video` no es un modelo más: es una máquina de componer el anuncio por partes.
**12-15 s fijo**, 480p/720p/1080p, `generate_audio` true por defecto.

| Parámetro | Qué es |
|---|---|
| `mode` | el formato creativo, **26 presets** (verificados 2026-08-18). Los nuestros: `ugc`, `ugc_direct_to_camera`, `ugc_selfie_testimonial`, `ugc_before_and_after`, `ugc_how_to`, `product_showcase`, `tv_spot`, `wild_card` |
| `hook_id` | **el "qué"** — la mecánica que frena el scroll |
| `setting_id` | **el "dónde"** — locación y clima |
| `avatar_ids` | el personaje — **máx. 1** |
| `product_ids` | el producto (array, siempre plural: nunca `product_id`) |
| `ad_reference_id` | le pasás un anuncio existente y **replica su escenario**: composición de escenas, ritmo, gancho, narración |

**Tres reglas verificadas contra la doc del propio parámetro (2026-08-18):**

1. **`ad_reference_id` es MUTUAMENTE EXCLUYENTE con `hook_id` y `setting_id`.** O componés por
   bloques, o replicás una referencia. Nunca los dos.
2. **El avatar y el producto NO se heredan de la referencia.** Aunque el `ad_reference` se haya
   creado con avatar y producto vinculados, esos links son organizativos: el ejecutor solo lee
   `avatar_ids` / `product_ids` de la llamada. **Van explícitos siempre.**
3. `hook_id` y `setting_id` son **independientes entre sí**: se puede pasar uno, el otro, los dos
   o ninguno.

## Cuándo cada uno

| Usá **Marketing Studio** | Usá **prompt a mano** |
|---|---|
| Hay **producto con foto** y avatar, y el formato es estándar (unboxing, try-on, testimonio, demo) | La pieza es **de marca** y tiene una idea propia (la CINE de arriba: ningún preset la cubre) |
| Querés **volumen**: mismo molde, muchos SKUs | Necesitás **control fino** del recorrido de cámara o del guion palabra por palabra |
| Tenés **un anuncio que ya funciona** para replicar → `ad_reference_id` | La duración se va de **12-15 s** (Marketing Studio no hace ni 10 s ni 30 s) |
| No hay tiempo de ingeniar 300 palabras de prompt | El sujeto **no es un producto** (un dolor, un proceso, un concepto) |

**Hoy, para nuestras dos piezas: prompt a mano.** La CINE porque ningún preset compone un dolly
macro sobre un escritorio; la de Lucía porque el guion es el activo y Marketing Studio no lo deja
escribir literal. Marketing Studio entra cuando haya **producto de cliente con catálogo** — y ahí
`ad_reference_id` es el atajo que evita las 300 palabras.

**Discrepancia anotada:** la doc de `hook_id` / `setting_id` dice que solo se soportan en los
presets *UGC, Tutorial, Unboxing, Product Review, UGC Virtual Try On*, pero en el listado vivo de
26 presets **no existe ningún slug "Product Review"**. Probarlo antes de contarlo como
disponible.

---

# ⛔ Lo que este lote NO resuelve — consistencia de cara

**En 17 ítems analizados, NINGUNO resolvió la consistencia de cara generada.**
Fuente: `../references/video-intake/2026-08-18-sintesis-lote-17.md`, hallazgo 6.

- Las **dos técnicas que parecen resolverlo (T1 y T2) usan metraje real**: no generan al humano,
  filman a una persona y sustituyen solo la pantalla o el escritorio. No es una solución de
  generación: es un rodaje.
- La única que lo enfrenta generando (omni_reference con set de anclas) es un anuncio del propio
  vendedor, sin insumos a la vista → señal débil.
- Los tres carruseles de realismo del lote muestran caras todas distintas entre sí.

> **Para Lucía sigue valiendo Soul + texto. Nada de este lote lo reemplaza.** T1 y T2 no le
> sirven porque no hay clip real que filmar: Lucía no existe fuera del generador.

**Consecuencia práctica para la Plantilla B:** el ancla de personaje mantiene ropa, encuadre y
tono entre cortes, pero **la cara sigue siendo el punto frágil**. Por eso el ejemplo de Lucía
entra con un still de `soul_2` como referencia, y por eso la pieza CINE de `@oniahq` se diseñó
**sin ninguna cara en cuadro**.

---

# Diferencias contra el resumen de segunda mano

Verificado contra las dos fuentes. El resumen estaba bien en lo grueso; tres precisiones:

1. **Faltaba `HARD CUTS only`** como elemento de la Plantilla B. Se declara una sola vez arriba y
   gobierna todo el montaje: sin eso, los 6 mecanismos no producen cortes.
2. **`<<<image>>>` inline no está confirmado en nuestra vía.** El resumen lo daba como mecanismo
   sin la advertencia; la fuente sí la trae, y el catálogo la confirma (las referencias son roles
   de media, no un token de texto).
3. **El reel UGC analizado es 47 s a 960×720 (4:3)**, mientras el prompt en pantalla pide
   `9:16, 15s`. O sea: el prompt visible es **un tramo de un montaje mayor**, no la pieza entera.
   No cambia la plantilla, pero no hay que leerlo como "este prompt produjo ese video".

Sobre el diálogo literal: **confirmado**, con la precisión de la interjección anotada arriba.
