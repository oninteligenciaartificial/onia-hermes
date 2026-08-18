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

### El flujo híbrido — lo mejor de los dos

1. Generar con `kling3_0_turbo` **dándole el guion en español entre comillas**. La boca queda
   articulando español real.
2. Generar el audio con Marcela en ElevenLabs.
3. Montar: **descartar la pista nativa** y poner la de Marcela.

```bash
ffmpeg -i video.mp4 -i marcela.mp3 -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -shortest salida.mp4
```

**Esto hace gratis lo que `sync_so` cobraba a ~18 cr por 5 s**, porque el lipsync ya vino hecho
contra un español real. Probado punta a punta.

⚠️ Calzar duraciones: la voz de Marcela para 2 frases dio **4,37 s** y el video **5,04 s**.
Escribir el guion para la duración, no al revés.

## 7. Imagen — la tabla completa

| Modelo | Costo | Resolución | Para qué |
|---|---:|---|---|
| **`nano_banana_2`** | **2,00** | 1536×2752 | 🏆 **el default con cara.** Identidad clavada, piel con poros |
| `nano_banana_2_lite` | 1,00 | 768×1376 | respaldo. ⚠️ **aclara el pelo** |
| `gpt_image_2` low | 0,50 | 752×1344 | ⚠️ **ensancha la cara.** No para primer plano |
| **`z_image`** | **0,15** | 1152×2048 | 🏆 **el default sin cara.** Ambientes, objetos, gente anónima |
| `soul_2` | 0,12 | — | no sostiene la identidad por sí solo |

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
