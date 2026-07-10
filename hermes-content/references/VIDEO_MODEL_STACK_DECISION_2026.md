# Stack de modelos de VIDEO — decisión ONIA (2026-07-09)

Decisión de qué modelos de Higgsfield usamos para generar video de avatares (Lucia,
Mara, etc.) y cuáles descartamos. Basado en pruebas reales de esta sesión + costos +
la regla de **voz propia consistente**.

## Principio rector: LA VOZ MANDA

Lucia tiene voz propia (ElevenLabs "Lucia-ONIA" `wrXs6GqcC7X03dDKMoeT`). Para que la
voz sea IDÉNTICA en todo, el lipsync tiene que usar NUESTRO audio. Los modelos que
generan su PROPIA voz (Veo, Marketing Studio, Grok, Gemini) rompen la consistencia →
se descartan para "hablar", salvo excepción puntual.

## ✅ EL STACK (lo que SÍ usamos)

| Uso | Modelo | Costo | Por qué |
|---|---|---|---|
| **B-roll movimiento/emoción (DEFAULT)** | `minimax_hailuo` | **6cr** | El más barato bueno; emoción facial; forehead liso (validado). Caballo de batalla del b-roll |
| **B-roll cinematográfico (cuando se justifica)** | `kling2_6` | 10cr | Movimiento con más physics/cine, cuando queremos más producción |
| **Hablar a cámara / lipsync con voz de Lucia** | **PRIMARIO: `seedance_2_0_mini`** · PLAN B: `wan2_7` (ambos + voz ElevenLabs) | 15cr c/u (6s) | Decidido 2026-07-09 (Sergio): seedance mini es el mejor, wan2_7 de respaldo. Ambos toman NUESTRO audio → mantienen la voz propia. **CRÍTICO: ancla cara al frente, calma, manos fuera de cuadro, clip 5-6s** — pose de acción rompe la cara (ver nota abajo) |
| **UGC hero con producto real en mano** | `marketing_studio_video` | 42cr | Mejor lipsync + producto real con etiqueta. PERO usa su PROPIA voz → SOLO para piezas hero puntuales donde se acepte |
| **Trend viral desde 1 foto** | `higgsfield_preset` | medio | ~45 plantillas virales, para contenido de tendencia ocasional |
| **Bikini/swimwear (donde otros bloquean)** | `seedance_2_0_mini` | medio | Más barato que el 2.0 full, solo para ese caso puntual (investigación de Sergio) |
| **Post (puntual, no generación)** | `bytedance_video_upscale` / `topaz_video` | 2cr+ | Upscale final de la pieza aprobada |

## ❌ DESCARTADOS (no valen la pena para nosotros)

| Modelo | Por qué se descarta |
|---|---|
| `seedance_2_0`, `seedance1_5` | Caros (45-135cr). minimax/kling cubren b-roll mucho más barato. (el `_mini` queda solo para bikini) |
| `veo3`, `veo3_1`, `veo3_1_lite` | Cinematográficos pero **generan su propia voz** (no sirve para voz consistente) y caros. No aportan sobre lo que tenemos para UGC de avatar |
| `kling3_0`, `kling3_0_turbo` | `kling2_6` ya cubre b-roll; no justifican costo/complejidad extra |
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
