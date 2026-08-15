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
