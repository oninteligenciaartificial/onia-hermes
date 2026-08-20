# Pipeline: lip sync estable + produccion masiva 24/7 (2026-07-06)

Objetivo de Sergio: modelos con **rasgos definidos y estables** (no se rompen), **lip sync** real,
y **produccion 24/7**. Tiene **ElevenLabs**.

## Por que "se rompia" antes
Los videos previos (Seedance 2.0) derivaban la identidad y desincronizaban la voz. Fix base:
1. **Soul entrenado por modelo** = identidad estable (Mara `6c94bbf0`, Lucia `9a0d6953`).
2. Video con **modelo que hace lip sync**, no un img2video generico.

## Opciones de lip sync (con Soul + voz)
| Via | Lip sync | Costo | Notas |
|---|---|---|---|
| **wan2_7** (start_image Soul + audio) | Estable, cara NO se rompe (verificado con Lucia) | **15cr/10s** | La mas barata con control de voz propia — via elegida para 24/7 |
| **Marketing Studio** (avatar custom) | Bueno, estable (probado con Mara) | 42-75cr/video | Auto-guion; sin overlays de marca; 480/720p; producto en mano real |
| **Editor Remotion** (fotos Soul + subtitulos) | Sin lip sync (subtitulos) | ~3cr | Branded/precio; volumen; NO habla |

## Recomendacion de arquitectura 24/7
1. **Voz:** ElevenLabs (voz fija por modelo) -> mp3.
2. **Talking UGC (con lip sync):** foto Soul (0.12) -> lip sync (Marketing Studio o kling/wan + audio ElevenLabs). Aca esta el gasto -> reservar para piezas que lo justifiquen.
3. **Branded/producto/precio (volumen):** editor Remotion (barato) con subtitulos. La mayoria del volumen.
4. **Automatizacion n8n (24/7):** calendario/catalogo -> guion (LLM) -> voz ElevenLabs -> (lip sync o editor) -> cola de aprobacion Telegram -> publica IG/TikTok/YT. Nada sin aprobacion.
5. **Costo:** definir cupo diario de piezas "talking" (caras) vs "branded" (baratas). Ej: 80% editor barato + 20% lip sync.

## Pendiente de validar (costos, antes de gastar)
- Costo real de kling3_0 / wan2_7 con audio (lip sync propio + ElevenLabs) vs Marketing Studio 42cr.
- Conector ElevenLabs (API key de Sergio) para la voz.
- Token IG/canales para publicar.
