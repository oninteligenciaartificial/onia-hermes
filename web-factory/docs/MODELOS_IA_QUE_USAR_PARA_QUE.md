# Qué modelo de IA usar para qué — tabla de decisión

> 2026-08-18. **Todo lo de acá está medido**, no estimado: costos por saldo antes/después y
> calidad mirando el resultado. El detalle de cada prueba está en
> `LUCIA_BANCO_DE_PRUEBAS_2026.md`; esto es la hoja de ruta rápida.
>
> Sirve para **las tres cuentas**. La diferencia no la hace la cuenta, la hace **si en el plano
> tiene que reconocerse a una persona concreta**.

---

## 1. La pregunta que decide todo

> **¿Alguien tiene que reconocer a una persona específica en este plano?**

| | **Sí** — es Lucía y se le ve la cara | **No** — objeto, ambiente, gente anónima |
|---|---|---|
| Imagen | `nano_banana_2` + ancla · **2,00 cr** | **`z_image`** · **0,15 cr** |
| Video | `kling3_0_turbo` · **7,50 / 5 s** | `veo3_1_lite` · **8,00 / 8 s** |
| Por segundo | **~1,90 cr/s** | **~1,02 cr/s** |

**13× de diferencia en la imagen.** Preguntarse esto antes de generar es la decisión que más
plata mueve de todo el pipeline.

## 2. Por acción

| Lo que pasa en el plano | Modelo | Costo | Por qué ése |
|---|---|---:|---|
| **Habla a cámara, en español** | `kling3_0_turbo` | 7,50 / 5 s | Dice el guion literal si va entre comillas. Articulación sutil. **Verificado con Whisper** |
| Habla a cámara — alternativa | `wan2_7` | 7,50 / 5 s | Mismo precio, también habla español, pero **articula más marcado**. Segunda opción |
| **Hace algo sin hablar** (gimnasio, monta, cocina) | `kling3_0_turbo` | 7,50 / 5 s | Sostiene identidad **y manos** en movimiento. Sin lipsync que cuidar |
| **Ambiente sin gente** | `veo3_1_lite` | 8,00 / 8 s | El más barato por segundo y el único que respeta `generate_audio:false` |
| Encadenar más de 15 s | `seedance_2_5` `video_extension` | ~12 / 5 s | ⚠️ **devolvió 16:9 con entrada 9:16** — verificar el formato de salida |
| Editar un video real de cliente | `seedance_2_5` `video_edit` | por duración | cambia ropa/detalle conservando el movimiento |
| ⛔ **No usar para primer plano** | ~~`seedance_2_0_mini`~~ | 12,50 / 5 s | **El más caro y el peor**: abre la boca en "O" exagerada |

## 3. Por movimiento de cámara

| Movimiento | Qué pedir | Qué pasa si no |
|---|---|---|
| **Fijo, tipo trípode** | no pedirlo nunca | La estabilidad perfecta delata que es IA. Siempre `handheld` |
| **Handheld sutil** ← el default | `handheld phone footage`, `slight natural tilt` | — |
| **Push-in lento** | `very slow push-in, tiny natural camera drift` | Pedir un push-in normal mueve demasiado en 5 s y marea |
| **Sigue al sujeto** | `handheld phone follows her` | — |
| ⛔ Dron, grúa, travelling | no pedirlo | Rompe el registro de UGC: se lee como publicidad |

## 4. Por entorno

| Entorno | Qué agregar al prompt | Riesgo propio |
|---|---|---|
| **Interior con fluorescente** (gym, oficina) | `harsh overhead fluorescents, uneven exposure` | Sale plano si no se pide luz despareja |
| **Exterior con sol bajo** (campo, calle) | `harsh backlight, slightly washed-out tones` | ⚠️ **el contraluz le aclara el pelo** — nombrar el color explícito |
| **Nocturno interior** (local cerrado) | `warm tungsten light from a single bulb, deep shadows` | Sale demasiado limpio; pedir sombras duras |
| **Café / luz de ventana** | `strong highlights blown out on the window side` | — |

## 5. Los dos criterios eliminatorios, y cambian según el plano

| Tipo de plano | Dónde falla primero | Cómo se evita |
|---|---|---|
| **Habla a cámara** | **la boca** | `hands out of frame` — saca de cuadro el otro problema |
| **Hace algo con las manos** | **las manos** | No se puede evitar: son la acción. **Mirar el frame final antes de dar por buena la toma** |
| **Ambiente con pantallas** | **el texto inventado** | `no readable text` + encuadrar lejos. Nunca primer plano de una pantalla |

Probado: en el video del gimnasio ella **se lleva la mano a la frente** —mano grande, cerca de
la cara, el peor caso— y salió con cinco dedos y forma natural.

## 6. Voz

| Para qué | Qué usar |
|---|---|
| **La voz oficial de Lucía** | ElevenLabs, **Marcela** `86V9x9hrQds83qf7zaGn` · modelo `eleven_multilingual_v2` |
| Voz nativa del modelo de video | Sale gratis con `kling3_0_turbo` / `wan2_7`, **pero no es Marcela** |

⚠️ **Dos identificadores circulan en los docs y solo uno es de ElevenLabs.**
`86V9x9hrQds83qf7zaGn` → ElevenLabs (verificado contra su API: *"Marcela - Colombian Girl"*).
`8de5db95-e898-46a6-bb68-26d02f311686` → **otro servicio**. Pasárselo a ElevenLabs da error.

### 🔴 Poner Marcela encima NO alcanza — hace falta `sync_so`

**Escrito mal la primera vez y corregido mirando el resultado.** Yo afirmé que como el video ya
articula español, bastaba con montar la voz de Marcela y se ahorraban los ~18 cr de `sync_so`.
**Es falso**, y Sergio lo vio de una: *"no está nada sincronizado este video"*.

**Por qué falla:** el video y la voz son **dos interpretaciones independientes del mismo
guion**. Dicen lo mismo pero con otro ritmo. Medido con Whisper sobre ambas pistas:

| | arranca | termina | pausa interna |
|---|---|---|---|
| Voz nativa del video | 0,40 s | 5,40 s | corte marcado en 2,40 s |
| Marcela (ElevenLabs) | 0,00 s | 4,00 s | ninguna, de corrido |

**Hasta 1,4 s de desfase**: la boca sigue moviéndose más de un segundo después de que la voz
terminó. Imposible de disimular.

### El flujo que SÍ funciona

| Paso | Qué | Costo |
|---|---|---:|
| 1 | Generar con `kling3_0_turbo`, guion en español entre comillas | 7,50 |
| 2 | Voz con Marcela en ElevenLabs | ~2,4 cr / 50 palabras |
| 3 | **`sync_so` con `sync_mode: remap`** — re-sincroniza los labios al audio nuevo | **18,15** *(medido)* |
| | **Total por 5 s con la voz correcta** | **~28 cr** |

```
params: { model: "sync_so", sync_mode: "remap", medias: [
  { value: "<job-id-del-video>",  role: "input_video" },
  { value: "<media-id-del-audio>", role: "input_audio" } ] }
```

⚠️ Los roles son **`input_video` / `input_audio`**. Con `video` / `audio` a secas, rechaza.

`sync_so` además **recorta el video a la duración del audio** (5,04 s → 4,375 s). No hay que
calzar las duraciones a mano.

⚠️ **El costo real de la voz propia:** `sync_so` regenera la zona de la boca, y eso **ablanda un
poco la cara** — en un frame quedó con los ojos cerrados. Se paga sincronía con algo de nitidez.

### Entonces, ¿cuándo usar cuál?

| Situación | Qué hacer | Costo 5 s |
|---|---|---:|
| **La voz nativa sirve** | `kling3_0_turbo` y listo | **7,50** |
| **Tiene que ser Marcela** | kling + ElevenLabs + `sync_so` | **~28** |
| **No habla** (lifestyle, b-roll) | kling o `veo3_1_lite`, sin audio | 7,50 / 8,00 |

**La decisión de si la voz nativa alcanza es de Sergio, escuchando.** Cambia el costo por pieza
casi 4×.

## 7. Imagen — la tabla completa

| Modelo | Costo | Resolución | Para qué |
|---|---:|---|---|
| **`nano_banana_2`** | **2,00** | 1536×2752 | 🏆 **el default con cara.** Identidad clavada, piel con poros |
| `nano_banana_2_lite` | 1,00 | 768×1376 | respaldo. ⚠️ **aclara el pelo** |
| `gpt_image_2` low | 0,50 | 752×1344 | ⚠️ **ensancha la cara.** No para primer plano |
| **`z_image`** | **0,15** | 1152×2048 | 🏆 **el default sin cara.** Ambientes, objetos, gente anónima |
| `soul_2` | 0,12 | — | **sin veredicto**: el job cobró y nunca devolvió resultado. Higgsfield advierte que su piel sale cerosa y trae receta de de-slop |

## 8. Cómo se llama a la API (la firma que funciona)

**Todo va dentro de `params`, incluido `model`.** No hay parámetro `model` de nivel superior.

```
✅  { params: { model: "kling3_0_turbo", prompt: "...", aspect_ratio: "9:16",
                duration: 5, medias: [{ value: "<id>", role: "start_image" }] } }
❌  { model: "kling3_0_turbo", params: { ... } }     → "Invalid input at params"
```

⚠️ **`get_cost` fuera de `params` se ignora y GENERA de verdad.** La única medición confiable
es el saldo antes y después.

⚠️ **El ancla de identidad va como `<<<uuid>>>` en el TEXTO del prompt.** Varios modelos
declaran no soportar `reference_elements` y aun así mantienen la cara, porque viaja en el texto.

⚠️ `kling3_0_turbo` y `wan2_7` devuelven **716×1284**, no 720p exacto — reescalar antes de
mezclar con otro modelo. Y **traen audio aunque no se pida**: silenciarlo si va voz montada.

---

**Fuente de cada número:** `LUCIA_BANCO_DE_PRUEBAS_2026.md` §7-bis (imagen), §9 (video), §11
(español), §12-13 (b-roll vs lifestyle). Identidad, paleta y vestuario:
`hermes-content/references/modelos/lucia/LUCIA.md`, **que manda sobre este archivo**.
