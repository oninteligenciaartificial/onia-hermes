# Banco de piezas — Lucía (generadas-20260828)

> El banco vivo de imágenes para animar y de videos para Meta Ads. Cada pieza queda con su
> **asset id** para poder re-referenciarla o re-animarla sin volver a gastar en la fuente.

## G06 — peluquería (pilar B, no nombra a Onia)

Escena: peluquería de barrio en Santa Cruz, compuesta **desde el espejo** (mirarse al espejo y
mirar al lente son la misma cosa acá, así es más honesto). Acción a medias clarísima: la mano de
la peluquera sostiene el mechón mojado y la tijera abierta sobre las puntas. Verificada mirándola:
pecas, tono parejo, argolla dorada, cadenita fina, lunares del cuello y el pecho.

| | |
|---|---|
| **Imagen** | `G06-peluqueria.jpg` |
| **Modelo imagen** | `nano_banana_pro`, 9:16, 2k |
| **Asset id de la imagen subida** (para `--start-image` / `--image-references`) | `c478ade2-adaa-43cf-819b-465d734f4d69` |

### Video (animación — 2026-09-02)

| | |
|---|---|
| **Archivo** | `G06-peluqueria-video-seedance.mp4` |
| **Modelo** | `seedance1_5` · **4,8 cr** (costo medido antes de generar, confirmado) |
| **Params** | 9:16 · duración 4s · 720p · `generate_audio=true` · seed `664848` |
| **start_image** | `c478ade2-adaa-43cf-819b-465d734f4d69` (la G06 subida) |
| **job_id** | `ae1aedd0-f2d7-4fb8-a96a-2d5ecbc4f3c0` |
| **Salida** | 720×1280, 4,05 s, ~5,3 MB |
| **Verificación** | MIRADO — 4 frames extraídos (0,1 / 1,3 / 2,6 / 3,9 s). Movimiento sutil y continuo: la tijera avanza y cierra sobre el mechón, el ventilador de pared gira, la mano de la peluquera termina y sale de cuadro. La cara se mantiene idéntica cuadro a cuadro (pecas, cadenita, lunares, cejas). Colores true-to-life, ningún cartel legible. |

**Prompt de animación** (para reproducir/afinar):
> Handheld iPhone shot in a small neighbourhood hair salon, filmed toward the mirror. The
> hairdresser's scissors slowly close and snip the held lock of wet hair; a few cut strands drift
> down. The woman blinks and her head shifts a fraction, eyes calm, not posing. The wall fan behind
> rotates slowly. Subtle natural handheld micro-movement, real uneven fluorescent light. NATURAL
> TRUE-TO-LIFE COLORS.
