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
  `text2image_soul_v2` + su `soul_id` y ese still entra como `image_references`. Nada de este lote reemplaza
  Soul+texto — ver la sección final.
- **Etiqueta de IA obligatoria** en el post. "Es IA" no se esconde.
- **Cero claim.** El CTA cerrado en "te muestro cómo": sin plazos, sin cifras, sin resultado
  garantizado.
- **Variante cliente = plantilla reusable.** El mismo molde sirve para un rubro con producto y
  precio (automotoras, comercio), pero **hoy no hay ningún cliente real con el sistema andando**
  — `web-factory/data/clients/` son 8 demos + Nuvia, que es proyecto propio de Onia. Cualquier
  ejemplo con cliente queda como plantilla con placeholders hasta que exista uno.

---

## Ejemplo completo — Onia Comercio · "El mensaje de las nueve" · 15 s · 9:16

> 🔴 **DATOS DE PRODUCTO SIN VERIFICAR — 2026-08-18.** El producto, el monto y el nombre de
> la clienta de este ejemplo se atribuyeron a `web-factory/apps/onia-platform/lib/comercio/demo-seed.ts`
> y a `getCollectorFeedComercio`. **Ninguno de los dos existe**: verificado por ruta, por nombre de
> archivo en todos los worktrees, y por contenido en todo el repo. Son cita fabricada.
> **Antes de usar este prompt hay que reemplazar producto, monto, plazo y nombre por datos reales
> del demo, o marcarlos en pantalla como ejemplo.** Lo demás del ejemplo (elección de rubro, PLACA 2,
> estructura) sí se verificó contra fuente.

> **PLANTILLA REUSABLE, no una pieza de cliente.** No hay ningún comercio real con el sistema
> andando. Todo lo que se ve acá sale de material propio: la placa de venta aprobada, el
> demo-tenant del producto y un Soul nuestro. Cuando exista un cliente, se reemplazan los dos
> insumos marcados y sale igual.

**Por qué comercio y no gastronomía (una línea):** comercio es el segundo vertical **ya decidido**
con cuña ferretería y tiene material real —placa de venta con 4 dolores, agente Cobrador
corriendo sobre comercio y demo-tenant con datos— mientras que gastronomía está **explícitamente
descartada** como vertical en el mismo doc de decisión y solo tiene 3 funciones de catálogo sin
una línea de código (`ONIA_DEFINICIONES_NAMING_RUBROS_WOW_20260726.md` §2 y §3).

Lo que se reusa, con fuente:

| Insumo | De dónde |
|---|---|
| Los 4 dolores y el CTA | `historial/ONIA_KIT_VENTA_POR_RUBRO_20260815.md` §1, **PLACA 2 · COMERCIO MINORISTA** |
| El agente que cierra la pieza | **Cobrador** sobre fiados de comercio — `getCollectorFeedComercio` en `onia-platform/lib/onia-core/modules/agents-runtime.ts` |
| Vocabulario (casero, fiado, Bs) | `onia-platform/lib/onboarding/vocabulario.ts` (`gestios-general`) |
| Producto, monto y la deuda de 25 días | `onia-platform/lib/comercio/demo-seed.ts` — demo-tenant nuestro |

### Qué se adapta del reel de origen, y qué NO

| Del reel de auto | Nuestra versión | Nota honesta |
|---|---|---|
| Publicación muerta — *"Listed 30+ days ago · 2 views"* | El mensaje de las 21:47 respondido a las 10:14 del día siguiente | Adaptado. Es el **dolor #3 de la PLACA 2 dramatizado**, no una métrica medida nuestra. La cifra del original es una captura del propio vendedor: la señal débil de siempre |
| El anuncio UGC con IA como la solución | El **Cobrador** dejando el recordatorio escrito, que ella aprueba antes de que salga | Adaptado. Capacidad verificada en el producto, human-in-the-loop, sale por link `wa.me` que aprieta un humano |
| El DM entrante **al que vende el servicio** (*"How much would they cost?"*) | El DM entrante **a la dueña de la tienda** preguntando el precio de un producto | Cambiado a propósito. Un DM a Onia preguntando precio sería **fabricar un prospecto**: hoy no hay ninguno. El DM del casero es dolor propio de ella, no prueba nuestra |
| **La ficha del vendedor** que cierra el reel | **NO SE ADAPTA.** El cierre es el CTA de la PLACA 2, sin cifra ni plazo | Con **0 clientes pagando**, cerrar con una ficha/prueba es exactamente la captura del propio vendedor que la fuente marca como señal débil. No se fuerza |

**Lo que la pieza NO promete:** que respondemos el precio a las nueve de la noche. En pantalla se
resuelve **el fiado**, que es lo que el Cobrador hace hoy. El DM de precio abre la pieza como
dolor, no como capacidad.

### ⚠️ Desambiguación obligatoria del mecanismo 3 (acá el celular ES el gancho)

En el molde, `phone never in frame, reflections, or her hands` apunta al **celular que filma**.
En esta pieza hay un segundo celular que es **utilería** y lleva el gancho, así que el negativo
escrito tal cual se pelea consigo mismo. Hay que partirlo en dos: se prohíbe el que filma, se
permite el de utilería, y se prohíbe aparte que su pantalla tenga texto legible.

*(El mismo choque late en el ejemplo de Lucía de arriba —cabecera con `phone never in frame` y
beat 3 con `phone face up`—; no lo edito, lo dejo anotado. **Esta desambiguación no está probada:
se verifica en el prototipo de 480p, no antes.**)*

### El prompt

```text
Handheld friend-cam UGC, 9:16, 15s, iPhone back cam — grain, compression, wobble, autofocus
hunts, no filters or grading. HARD CUTS only.
The filming phone is never in frame, in reflections, or in her hands; the phone she handles at
the counter is a separate prop and may be seen, but its screen stays an unreadable glow — no
legible screen text, no readable UI, no on-screen text, no logos, no brand marks anywhere.
Character = reference A (same woman in every shot, same hair, same faded work apron over a
plain shirt): matte real skin — pores, redness, baby hairs, no glare, no retouch; natural
blinks, micro-expressions.
Location = reference B (same neighbourhood hardware-store counter in every shot: chipped wooden
counter, cement bags stacked low at the left, lengths of PVC pipe standing in a corner bin,
paint buckets and boxes of nails on steel shelves behind her, open roller shutter camera left).
Spoken language: Bolivian Spanish from Santa Cruz, natural shop-counter register, not neutral
dubbing Spanish.

0-5s reference A behind the counter of reference B, mid-morning, hard daylight from the open
roller shutter camera left, street noise outside. She holds the prop phone low in one hand,
glances down at its glow, then looks straight to lens, flat and a little tired: "Este casero me
preguntó el precio anoche a las nueve. Le contesté hoy."

5-10s HARD CUT, tighter, over-the-shoulder onto the counter: the prop phone face up beside a
spiral notebook open on a column of handwritten names and amounts; autofocus hunts once on the
page then settles; her finger slides down the column and stops. She speaks from off the top of
frame: "En el mismo chat está doña Carmen. Me debe hace veinticinco días."

10-15s HARD CUT, wider, back to reference A behind the counter of reference B. The prop phone
lies face up on the wood between her hands; she reads its glow for a beat, then lifts her eyes
to lens with a small shrug and a half-smile: "El sistema ya me lo dejó escrito. Yo apruebo y
recién ahí sale."
```

**Los seis mecanismos, dónde están:** (1) cabecera técnica, línea 1 · (2) defectos a propósito,
línea 1 · (3) negativos del formato, líneas 3-5, **partidos en dos** · (4) anclas inline
`reference A` / `reference B` repetidas en cada beat, como **texto nombrado** —no `<<<image>>>`—
con las imágenes por `image_references` · (5) realismo de piel, bloque de personaje · (6) tres
beats cronometrados con diálogo literal entre comillas. Más `HARD CUTS only` **una sola vez**,
línea 2.

**Diálogo:** seis oraciones completas, cero muletillas de apertura. Está documentado que las
oraciones entre comillas salen palabra por palabra y que la interjección tipo `Okay —` se cae,
así que no hay ninguna. Ella dice **"el sistema"**, nunca la marca: una cara generada por IA
diciendo el nombre del producto se lee como testimonio falso — la marca va en el overlay.

### El texto va encima (HyperFrames sobre el render, nunca pedido al modelo)

| t | Overlay | Nota |
|---|---|---|
| 0,3-2,5 s | Burbuja de WhatsApp entrante: *"¿Cuánto está el balde de látex blanco?"* · **21:47** | El gancho. Producto tomado del demo-seed (Pintura látex blanca 18L, unidad "balde") |
| 3,0-4,8 s | *"Respondido — 10:14"* | Dramatización del dolor #3 de la PLACA 2. **No es una métrica nuestra** |
| 10,5-14,8 s | CTA: *"Comentá FIADO y te paso cómo se ordena tu cuaderno."* | CTA aprobado de la PLACA 2, sin cifra ni plazo |
| 0-15 s | Etiqueta **contenido generado con IA** | Obligatoria, no se esconde |

Si se quema un monto en Bs, va rotulado **"datos de ejemplo"**: sale del demo-tenant, no de un
comercio real.

### Insumos — de dónde sale exactamente cada uno

| Insumo | Origen | Estado |
|---|---|---|
| **reference A** — still 9:16 de la dueña, mismo delantal | `text2image_soul_v2` + `soul_id`. Candidata que **ya existe**: **Mara BO v2** `6c94bbf0-bc71-4fe1-841e-f366bdb00b6e` (boliviana mestiza, 27). Bloque de identidad congelado en `ONIA_MODELOS_RECETA_VISUAL_20260806.md` §2; stills previos en `hermes-content/references/modelos/mara-bo/perfil-20260806/` | ⚠️ **Decide Sergio.** El mostrador de ferretería **no está** en sus escenarios permitidos (*"interiores minimalistas luminosos… nunca exteriores caóticos"*) y el delantal no está en sus 3 atuendos. O se le suman escenario y atuendo a ese doc, o se entrena un Soul propio de la dueña (**25 cr**, permiso explícito) |
| **reference B** — mostrador de ferretería de barrio en Santa Cruz | **No existe en el repo.** Verificado: no hay ninguna imagen de ferretería/comercio en `hermes-content/references/` | ⚠️ **Hay que conseguirla.** (a) **Sergio** saca 3 fotos de un mostrador real — encuadre genérico y con permiso: si el local se reconoce, insinúa una relación comercial que no existe; (b) generarla (costo aparte + permiso). **Si no se consigue, se corre sin reference B** y queda como ancla de texto: el punto frágil es la cara, no el lugar |
| Copy de overlays y CTA | `historial/ONIA_KIT_VENTA_POR_RUBRO_20260815.md` §1, PLACA 2 | Listo, ya escrito |
| Producto, monto, deuda de 25 días, "doña Carmen" | `onia-platform/lib/comercio/demo-seed.ts` | Listo. Es **demo-tenant nuestro**, no un cliente |
| Voz | Nativa del modelo (`generate_audio` true por defecto en `seedance_2_5`) | Listo. La voz de Lucía **no** se usa acá: es otra persona |

### Costo — `seedance_2_5` en `omni_reference`

Es el único que hace **15 s con `image_references` + audio nativo** (verificado hoy con
`models_explore`; `unlim.available` sigue en `false`, así que todo consume créditos).

| Escalón | Config | Créditos |
|---|---|---|
| **Prototipo** (el que se corre primero) | 480p, 15 s | **~15 cr** |
| Publicable | 720p, 15 s | ~52,5 cr |
| Premium | 1080p, 15 s | ~135 cr |
| Aparte — still de reference A | `text2image_soul_v2`, 3 imágenes | 0,36 cr |
| Solo si Sergio elige Soul propio | entrenar Soul | **25 cr** |

> ⚠️ **`seedance_2_5` no tiene precio medido.** Los tres números de arriba son la equivalencia
> por segundo de la familia `seedance_2_0` (1,00 / 3,50 / 9,00 cr/s, tabla medida del 14-ago):
> sirven para dimensionar, **no para autorizar**. Antes de tirar el job hay que preflightear con
> **`generate_video` + `get_cost: true`** — es un parámetro de preflight, no un tool aparte, es
> gratis y el 14-ago coincidió al centavo con el gasto real.

**Gates antes de generar (los mismos de arriba, más uno):** cara desde Soul, etiqueta de IA,
cero claim, prototipo en 480p mirado antes de subir de resolución — y **la desambiguación del
celular se valida en ese prototipo**: si el modelo igual mete el celular que filma en el reflejo
del mostrador, hay que reescribir el negativo antes de pagar 720p.

**Nada generado. Nada gastado.** Esta sección es el prompt listo para que Sergio apruebe.

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
(`historial/HIGGSFIELD_AD_SPEC_RECETA_20260812.md`, sección "Tarifario completo"). El precio es **lineal
por segundo**. Los modelos sin fila ahí **no tienen precio medido**: preflightear con `get_cost`
antes de tirar el job.

| Pieza | Modelo sugerido | Prototipo<br>`mini` 480p (1,00 cr/s) | Publicable<br>`2.0 fast` 720p (3,50 cr/s) | Premium<br>`2.0 std` 1080p (9,00 cr/s) |
|---|---|---|---|---|
| **CINE** — 10 s, una toma | `seedance_2_5` t2v, o `cinematic_studio_3_0` con `generate_audio: false` | **10 cr** | 35 cr | 90 cr |
| **UGC** — 15 s, 3 cortes | `seedance_2_5` en `omni_reference` (el único que hace 15 s con refs + audio) | **15 cr** | 52,5 cr | 135 cr |

Aparte y despreciable: el still de cara con `text2image_soul_v2` (0,36 cr por 3 imágenes en la medición del
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
entra con un still de `text2image_soul_v2` como referencia, y por eso la pieza CINE de `@oniahq` se diseñó
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
