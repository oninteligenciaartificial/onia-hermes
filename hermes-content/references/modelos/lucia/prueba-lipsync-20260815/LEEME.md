# Lip sync: `sync_so` FUNCIONA — 2026-08-15

Sergio descartó `wan2_7` por experiencia propia. Se revisó **el catálogo completo**
(`models_explore action=list`, no `search`) y apareció algo que ningún doc nuestro tenía.

## El hallazgo: `sync_so` — "Sync Lipsync 3"

**Herramienta dedicada de lip sync**, no un modelo de video general. Toma un video ya hecho
y le sincroniza la boca a un audio nuestro:

```
medias.roles = input_video · input_audio
sync_mode    = bounce | loop | cut_off | silence | remap   (qué hacer si duran distinto)
```

Ninguna búsqueda lo devolvía: `search` hace matching por palabras y "lipsync" no está en su
descripción, que viene **vacía**. Solo aparece listando el catálogo entero. Es exactamente la
lección que ya estaba escrita en `avatar-lab/20260707` y que volví a aprender.

## La prueba

| Paso | Qué | Costo |
|---|---|---|
| 1 | Base: `seedance_2_0_mini`, 5 s, 480p, **`generate_audio: false`**, `start_image` = la foto del escritorio (`08d7ccfe`) | **5,00 cr** |
| 2 | Voz: `lucia-voz-OFICIAL.mp3` subida como media (`e77c43d3`) | 0 |
| 3 | `sync_so` con `input_video` + `input_audio`, `sync_mode: loop` | **18,15 cr** |
| | **Total** | **23,15 cr** |

Balance: 2.806,44 → 2.783,29.

## Veredicto: sirve

Cuatro fotogramas del clip muestran **cuatro formas de boca distintas**, dientes normales sin
el artefacto que tenía wan2_7, cara consistente y **pecas intactas**. Ver
`BOCAS-4-fotogramas.jpg` y el mp4.

## El pipeline que queda

```
1. Imagen de Lucía        11 bloques + ancla 452d8375      2 cr
2. Video base MUDO        seedance_2_0_mini 480p           1 cr/s
3. Voz                    ElevenLabs wrXs6GqcC7X03dDKMoeT  2,4 cr / 50 palabras
4. Lip sync               sync_so                          ~3,6 cr/s
```

**`generate_audio: false` en el paso 2 no es opcional:** si el video trae audio propio, se le
está pagando a Seedance por una voz que después se tira.

## Costo real de una pieza hablando

Un UGC de 15 s: base 15 cr + sync ~54 cr + voz ~2,4 = **~71 cr**. Contra un b-roll de 15 s con
VO montada encima, que sale **15 cr**. El lip sync cuesta casi 5 veces más.

**Conclusión práctica:** b-roll con VO para volumen, lip sync solo para la pieza donde ella
tiene que mirar a cámara y hablar. No es el default.

## Costos verificados de los otros candidatos (5 s, gratis con `get_cost`)

| Modelo | 5 s | cr/s |
|---|---|---|
| `seedance_2_0_mini` 480p | 5 | **1,0** |
| `wan2_6` 720p | 13 | 2,6 |
| `minimax_h3` 2K | 20 | 4,0 |
| `grok_video_v15` 720p | 22,5 | 4,5 |
| `seedance_2_5` 720p | 32,5 | 6,5 |

⚠️ `sync_so` **no se puede pre-cotizar**: la herramienta inyecta un campo `prompt` que ese
modelo rechaza (422). Se mide con balance antes/después.

## 🔴 `seedance_2_5` SÍ existe ahora

La entrega del 12-ago decía "Seedance 2.5 NO existe en la cuenta". **Al 15-ago sí está**, con
modos `t2v` / `omni_reference` / `video_edit` / `video_extension` y hasta **30 s**. No es que
la verificación estuviera mal: el catálogo cambió en tres días. Vale re-listarlo antes de
planificar, no confiar en una lista de la semana pasada.

---

# Ronda 2 — voz Marcela + pruebas que NO parten de imagen estática (15-ago)

## Voz: Marcela es la oficial

Sergio eligió **`Marcela - Colombian Girl` `86V9x9hrQds83qf7zaGn`** (ElevenLabs, professional,
es-LATAM colombiano, joven, relajada). Cargada en el VPS: `LUCIA_ELEVENLABS_VOICE_ID`.
Resultado: `lipsync-MARCELA.mp4`.

`Lucia-ONIA` `wrXs6GqcC7X03dDKMoeT` (Voice Design) queda **descartada**.

**`sync_mode` importa:** con `loop` el clip quedó en 5 s; con `remap` retimea el video al
audio y salió 6 s. `remap` es el correcto cuando el audio manda, que es siempre en una pieza
hablada. También tarda bastante más en procesar.

## Las tres formas de generar video, probadas

| Vía | Qué hace de verdad | Resultado |
|---|---|---|
| **`start_image`** | Anima UNA foto. El encuadre queda fijo al de la foto | `base-sin-audio.mp4` |
| **`image_references`** | **Inventa un plano nuevo** manteniendo la identidad. No copia ninguna de las fotos de entrada | `testA-image_references.mp4` |
| **`start_image` + `end_image`** | **Transición real entre dos lugares**: arranca en el café y termina en la pared ocre con la moto, en un movimiento continuo | `testB-start-end.mp4` |

## A qué llegué

**1. La identidad aguanta el movimiento.** Era la duda abierta desde el 13-ago: las pruebas de
consistencia eran de imágenes sueltas. En los 5 segundos se mantienen pecas, argollas de oro,
cadenita y el terracota. **La cara no deriva.**

**2. `image_references` cambia la economía.** No hace falta generar la imagen antes: se le pasan
2-3 fotos aprobadas y compone una escena nueva. Ahorra el paso de imagen (2 cr) y sobre todo
ahorra el trabajo de dirigir cada encuadre.

**3. `start_image` + `end_image` es el hallazgo grande.** Resuelve el problema de fondo del tope
de 15 s: cada toma dejaba de ser un plano suelto. Ahora se encadenan **dos lugares aprobados con
un movimiento continuo**, que es exactamente lo que pedía la estructura de guion por escenas.
El raccord deja de ser un problema de edición y pasa a estar escrito en la generación.

## Costo de la ronda

Balance 2.783,29 → **2.755,14 = 28,15 cr**: 2 videos base (5 + 5) + `sync_so` remap (~18,15).

---

# Ronda 3 — auditoría de las piezas y por qué NO iba solo `seedance_2_0_mini` (15-ago)

## 🔴 El defecto que tenían las 5 piezas: **496 × 864**

`ffprobe` sobre los cinco mp4 de las rondas 1 y 2: **todos 496×864**. Reels/TikTok piden
**1080×1920**; el mínimo que Instagram no re-comprime feo es 720×1280. O sea que **ninguna de
las piezas anteriores era publicable**, por resolución, no por contenido.

No es límite del modelo: el mismo `seedance_2_0_mini` con `resolution: "720p"` devuelve
**720×1280** (`T1-seedance-mini-720p.mp4`). Salió a 496 porque yo pedí 480p para ahorrar
créditos, y no lo dije. Eso es lo que había que auditar.

## Por qué se había usado solo `seedance_2_0_mini`

Por precio: 1 cr/s a 480p, el más barato del catálogo. La razón era real pero incompleta —
faltaba mirar qué daba cada modelo **por crédito**, no por segundo.

## Tarifario nuevo, medido con `get_cost` (gratis, 5 s salvo aclaración)

| Modelo | Config | cr (5 s) | **cr/s** | start | end | img_refs | vid_refs | audio_refs |
|---|---|---|---|---|---|---|---|---|
| `veo3_1_lite` | 4 s sin audio | 4 | **1,0** | ✓ | ✓ | — | — | — |
| `seedance_2_0_mini` | 480p | 5 | **1,0** | ✓ | ✓ | ✓ | ✓ | ✓ |
| `kling3_0` | std, `sound:off` | 7,5 | 1,5 | ✓ | ✓ | — | — | — |
| `seedance_2_0` | fast 480p | 7,5 | 1,5 | ✓ | ✓ | ✓ | ✓ | ✓ |
| `seedance_2_0_mini` | **720p** | 12,5 | 2,5 | ✓ | ✓ | ✓ | ✓ | ✓ |
| `seedance_2_5` | 480p omni_ref | 12,5 | 2,5 | ✓ | ✓ | ✓ | ✓ | ✓ |
| `wan2_6` | 720p | 13 | 2,6 | — | — | ✓ | ✓ | ✓ |
| `gemini_omni` | 720p | 15 | 3,0 | — | — | ✓ | ✓ | — |
| `minimax_h3` | 2K | 20 | 4,0 | ✓ | ✓ | ✓ | ✓ | ✓ |
| `grok_video_v15` | 720p | 22,5 | 4,5 | ✓ | — | ✓ | — | ✓ |
| `cinematic_studio_3_0` | 720p | 25 | 5,0 | ✓ | ✓ | — | — | — |
| `flux_3_video` | 720p | 27,5 | 5,5 | ✓ | ✓ | ✓ | ✓ | — |

**El precio lo manda la resolución, no el modelo.** `seedance_2_0_mini` sube de 1,0 a 2,5 cr/s
solo por pasar de 480p a 720p — y ahí ya no es el barato de nadie.

## Resolución REAL de salida (medida, no de catálogo)

| Modelo | Pedido | **Salió** | ¿9:16 real? |
|---|---|---|---|
| `seedance_2_0_mini` 480p | 9:16 | 496×864 | casi |
| `seedance_2_0_mini` 720p | 9:16 | **720×1280** | ✅ |
| `kling3_0` std | 9:16 | 828×1108 | ❌ **ignoró el 9:16** y siguió el 3:4 del `start_image` |
| `veo3_1_lite` | 9:16 | **720×1280** | ✅ |
| `seedance_2_5` `video_edit` | (ignorado) | 726×1266 | ✅ **reescaló hacia arriba** el input de 496 |

## 🏆 El hallazgo de plata: `veo3_1_lite`

**8 segundos, 720×1280, 9:16 real, por 8 créditos.** Mismo precio por segundo que
`seedance_2_0_mini` a 480p, con **2,6× los píxeles** y el encuadre correcto.

Y el plano salió mejor que el de la ronda 2: se levanta de la mesa del café, la cámara la sigue
por atrás, y sale a la vereda de ladrillo con la pared ocre y la moto. Es una **caminata continua
de verdad**, no el morph de `testB`. Ver `T5-veo3_1_lite.mp4`.

⚠️ Restricción no documentada en el catálogo: **con `start_image` y `end_image` juntos, `duration`
tiene que ser exactamente 8** (422 con 4). No acepta referencias de identidad — solo fotos ya
aprobadas como start/end.

## 🏆 El hallazgo de fondo: `seedance_2_5` `mode: video_edit` — **video2video funciona**

Se subió `testB-start-end.mp4` como media y se pidió *"cambiá solo la remera: la musculosa
terracota por una camisa de lino crudo; todo lo demás idéntico"*.

**Devolvió el mismo plano exacto** — mismo movimiento de cámara, mismo fondo, misma moto, misma
bolsa, mismos gestos — **con la camisa cambiada**, y reescalado de 496×864 a 726×1266.
Ver `T3-video-edit.mp4` contra `testB-start-end.mp4`.

Eso es exactamente el pitch comercial que ya estaba escrito en
`HIGGSFIELD_AD_SPEC_RECETA_20260812.md`: **"grabalo con tu celular como puedas, yo lo convierto"**.
Deja de ser una promesa: el mecanismo está probado (subir mp4 → `media_confirm` → `video_references`).

## 🏆 El hallazgo que rompe el tope de 15 s: `seedance_2_5` `mode: video_extension`

Se le pasó el mismo `testB-start-end.mp4` con `extension_mode: "forward"`.

**Arranca exactamente donde terminaba el clip** — misma pared ocre, misma moto, misma bolsa
terracota, mismo pantalón crudo, misma luz — y sigue caminando, se acomoda la bolsa en el hombro
(lo que pedía el prompt) y mira de vuelta. Ver `T4-video-extension.mp4`.

Devuelve **solo el tramo nuevo** (5 s), no el original + la extensión. Se pegan con `ffmpeg`,
costo cero: `CADENA-10s-extension.mp4` = **10,04 s continuos**, y se puede seguir encadenando.

**Esta es la forma correcta de pasar los 15 s, no el `start`+`end`.** El `start`+`end` hace un
morph entre dos estados y pierde el vestuario; la extensión **continúa el mismo plano** y
conserva todo. Corrijo la conclusión de la ronda 2: el hallazgo grande no era `start`+`end`, era
esto.

⚠️ La extensión también **reescala**: entró 496×864, salió 726×1266.

## `kling3_0` — la mejor cara, el peor encuadre

A 1,5 cr/s da la mejor actuación facial de todo lo probado: microexpresiones, risa natural,
dientes correctos, pecas y ojos con brillo real. **Pero ignora `aspect_ratio`** y copia el 3:4 de
la foto de entrada, y no acepta `image_references` — solo `start_image`. Sirve para primer plano
recortando, no para armar la pieza vertical.

## Defectos que sí aparecen al mirar los fotogramas

- **Manos.** En `testA` (frame 1) la mano izquierda es un borrón sin dedos. Kling la resuelve
  mejor pero igual queda flotando sin agarrar nada. **Regla: no pedir planos con la mano cerca
  de la cara o manipulando objetos.**
- **El raccord de `start`+`end` NO es limpio.** En `testB` gana una bolsa terracota y le cambia
  la remera entre la primera y la segunda mitad. Es un **morph entre dos estados**, no un plano
  secuencia — corrijo lo que dije en la ronda 2. Sirve como transición, no como continuidad.
  `veo3_1_lite` lo disimula mejor porque pasa por un plano de espaldas.
- **El lugar deriva.** `T1` mandó a Lucía a una vereda con palmeras y edificios crema que parece
  Miami, no Santa Cruz. El texto del lugar hay que escribirlo tan duro como los rasgos.
- **El pelo deriva un poco** en `T1`: más largo y con reflejos claros que la ancla no tiene.

## Lo que queda decidido

| Para qué | Modelo | Por qué |
|---|---|---|
| B-roll vertical de volumen | **`veo3_1_lite`** 8 s | 720×1280 a 1 cr/s. Imbatible |
| Escena que necesita SU identidad sin foto previa | `seedance_2_0_mini` **720p** | único con `image_references` barato |
| Primer plano que actúa | `kling3_0` std | mejor cara; recortar a 9:16 |
| Convertir video real de cliente | `seedance_2_5` `video_edit` | probado |
| **Pasar de 15 s** | `seedance_2_5` `video_extension` + `ffmpeg concat` | conserva vestuario y plano |
| Hablando a cámara | `sync_so` sobre cualquiera de los anteriores | `sync_mode: remap` |

**`seedance_2_0_mini` a 480p queda retirado para pieza final.** Sirve solo como borrador.

### Receta de una pieza de 30 s
```
1. veo3_1_lite  start+end, 8 s, 720x1280          8 cr
2. seedance_2_5 video_extension forward  x3      ~38 cr
3. ffmpeg concat                                    0
4. ElevenLabs Marcela VO                          ~2 cr
5. sync_so remap (solo si habla a cámara)        ~18 cr/5 s
```
Sin lipsync, 32 s de b-roll vertical con VO encima: **~48 cr**.

## Trampa del tooling

`generate_video` rechaza el prompt si contiene *"Not a 3D render"* — el matcher de presets
devuelve `submission_failed: Preset "3D RENDER" was recommended`. Se resuelve pasando
`declined_preset_id` con el id que devuelve el error, o escribiendo *"no CGI look"*.

## Costo de la ronda

Balance 2.755,14 → **2.663,12 = 92,02 cr**. Los `get_cost` de las 12 filas del tarifario
salieron **gratis**; el gasto es de los 5 videos.
