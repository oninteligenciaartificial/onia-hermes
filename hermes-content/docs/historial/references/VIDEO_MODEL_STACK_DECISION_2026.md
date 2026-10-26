# Stack de modelos de VIDEO — decisión ONIA (2026-07-09)

Decisión de qué modelos de Higgsfield usamos para generar video de avatares (Lucia,
Mara, etc.) y cuáles descartamos. Basado en pruebas reales de esta sesión + costos +
la regla de **voz propia consistente**.

## 🎯 RANKING SEGÚN REVIEW DE SERGIO (2026-07-09, mirando los videos)

- **Lipsync (hablar):** **Seedance = el mejor.** wan2.7 = el PEOR. Marketing Studio = la
  MEJOR consistencia general (pero su propia voz). minimax = punto medio. kling = buen resultado.
- **Acción/salto:** TODOS buenos (veo/minimax/kling2.6/kling3.0) — buena consistencia, elegir por costo.
- **Regla que sale de esto:** lipsync con la voz de Lucia → **Seedance mini**. Si se acepta
  otra voz y se quiere máxima consistencia → **Marketing Studio**. B-roll/acción → el más
  barato que sirva (minimax default, veo3.1 para acción grande/creativa).

## Principio rector: LA VOZ MANDA

Lucia tiene voz propia (ElevenLabs "Lucia-ONIA" `wrXs6GqcC7X03dDKMoeT`). Para que la
voz sea IDÉNTICA en todo, el lipsync tiene que usar NUESTRO audio. Los modelos que
generan su PROPIA voz (Veo, Marketing Studio, Grok, Gemini) rompen la consistencia →
se descartan para "hablar", salvo excepción puntual.

## ✅ EL STACK (lo que SÍ usamos)

| Uso | Modelo | Costo | Por qué |
|---|---|---|---|
| **B-roll lifestyle/emoción (DEFAULT, cheap)** | `minimax_hailuo` | **6cr** | El más barato bueno; emoción facial, gestos, movimiento sutil. Débil en ACCIÓN física grande. Caballo de batalla del b-roll cotidiano |
| **B-roll de ACCIÓN dinámica (saltar, correr, deporte, movimiento grande)** | **`veo3_1`** (quality basic) | 16.5cr | Shootout 2026-07-09: el ÚNICO que entendió y renderizó bien un salto real (física, cuerpo, cara estable). **Corregí mi error de descartarlo por "caro" — 16.5cr es competitivo.** OJO: default sale 16:9, hay que forzar `aspect_ratio:9:16`; genera su propia voz → mutear para b-roll |
| **B-roll cinematográfico (buen resultado)** | `kling2_6` / `kling3_0` | 10-15cr | Review Sergio 2026-07-09: kling dio **buen resultado**. En el shootout de salto TODOS los modelos (veo/minimax/kling2.6/kling3.0) tuvieron **buena consistencia** — para acción cualquiera sirve; elegir por costo. (Mi lectura previa de "kling3.0 deforma" era un frame transitorio, no representativo — Sergio lo vio bien) |
| **Hablar a cámara / lipsync CON voz de Lucia (ElevenLabs)** | **`seedance_2_0_mini`** (el mejor, toma nuestro audio) | 15cr (6s) | Review Sergio 2026-07-09: Seedance = el mejor lipsync. **`wan2_7` = EL PEOR, evitar** (era plan B, ya no). **CRÍTICO: ancla cara al frente, calma, manos fuera de cuadro, clip 5-6s** |
| **Hablar con MÁXIMA consistencia (acepta su propia voz)** | `marketing_studio_video` | 42cr | Review Sergio 2026-07-09: **Marketing Studio = la MEJOR consistencia** de todas. Contra: usa su PROPIA voz (no la de ElevenLabs de Lucia). Usar para hero/piezas donde la consistencia importa más que la voz exacta |
| **UGC hero con producto real en mano** | `marketing_studio_video` | 42cr | Mejor lipsync + producto real con etiqueta. PERO usa su PROPIA voz → SOLO para piezas hero puntuales donde se acepte |
| **Trend viral desde 1 foto** | `higgsfield_preset` | medio | ~45 plantillas virales, para contenido de tendencia ocasional |
| **Bikini/swimwear (donde otros bloquean)** | `seedance_2_0_mini` | medio | Más barato que el 2.0 full, solo para ese caso puntual (investigación de Sergio) |
| **Post (puntual, no generación)** | `bytedance_video_upscale` / `topaz_video` | 2cr+ | Upscale final de la pieza aprobada |

## ❌ DESCARTADOS (no valen la pena para nosotros)

| Modelo | Por qué se descarta |
|---|---|
| `seedance_2_0`, `seedance1_5` | Caros (45-135cr). minimax/kling cubren b-roll mucho más barato. (el `_mini` queda solo para bikini) |
| ~~`veo3_1`~~ | **RE-EVALUADO 2026-07-09: NO se descarta** → es el MEJOR para b-roll de ACCIÓN dinámica (ver arriba). 16.5cr es competitivo. Solo `veo3`/`veo3_1_lite` quedan sin uso claro por ahora |
| `wan2_7` | **Review Sergio: el PEOR en lipsync.** Evitar salvo emergencia sin alternativa. (Ya no es plan B) |
| `kling3_0_turbo`, `seedance_2_0` full, `veo3`, `veo3_1_lite`, `grok`, `gemini`, `wan2_6`, `cinematic_studio_*` | Sin uso claro sobre lo que ya tenemos |
| `wan2_6` | Experimental/stylized; `wan2_7` es el bueno |
| `grok_video`, `grok_video_v15`, `gemini_omni` | Voz propia, sin ventaja clara, sin probar. No |
| `cinematic_studio_video/_v2/_3_0` | Para "cine", no UGC de avatar |
| `clipify` | Corta YouTube en clips; otro caso de uso, no generación de avatar |

## Flujo de una pieza tipo (juntando todo)

1. **Fotos** de Lucia: `nano_banana_pro` + cara-Element `902eeebb` + ficha de ropa + escena en texto (2cr).
2. **Voz:** ElevenLabs `wrXs6GqcC7X03dDKMoeT` (español) → mp3.
3. **B-roll:** `minimax_hailuo` (6cr) o `kling2_6` (10cr) animando una foto; la voz va ENCIMA en edición (sin lipsync).
4. **Segmento hablando:** `wan2_7` (15cr) con un still + el mp3 de ElevenLabs → lipsync con SU voz.
5. **Edición:** ffmpeg / Remotion (concat + VO + subtítulos/marca).
6. **(Hero con producto):** `marketing_studio_video` (42cr) — aceptando que ahí la voz es la del sistema.

## ⚠️ REGLA CRÍTICA de lipsync — la ANCLA manda (2026-07-09)

El primer demo de lipsync se rompió feo. Causa: la foto de arranque era una pose de
ACCIÓN (revolviendo café, riendo, mano en cuadro) — el modelo tiene que animar el habla
peleando contra esa pose y la mano se deforma todo. **No era (solo) el modelo, era la
ancla.**

**Ancla correcta para lipsync:** retrato cara-y-hombros, **de frente**, expresión calma,
labios apenas entreabiertos (como por hablar), **manos fuera de cuadro**, fondo simple.
Generar con `nano_banana_pro` + cara-Element `902eeebb`. Con esa ancla, TANTO wan2_7 como
seedance_2_0_mini quedan estables (verificado: `lucia-demos-20260709/lipsync-*-cleananchor.mp4`).

Además: clips cortos (5-6s) sincronizan mejor que 8s+.

## Costo tipico de un reel (b-roll + hablando)
~6-10cr (b-roll) + 15cr (wan2_7 hablando) + ~2cr (voz) + fotos ~2-4cr = **~25-30cr** por
reel completo. Hero con producto (Marketing Studio) = +42cr cuando se justifique.
