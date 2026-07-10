# Voz de Lucia — estado y decisión (2026-07-09)

## Setup de ElevenLabs (verificado hoy)

- **ElevenLabs YA está integrado en el proyecto** — la API key vive en el VPS
  (`/root/.hermes/.env`, `ELEVENLABS_API_KEY`), NO en el repo. Tiene permisos completos
  (TTS + voices_read verificados). Se usa vía API REST corriendo en el VPS (o por SSH),
  NO por MCP (no existe conector MCP de ElevenLabs).
- **La key NO va en ningún archivo del repo** (el autosync commitea). Solo voice_ids,
  que no son secretos.
- El `ELEVENLABS_VOICE_ID` global del VPS es **"Sergio ONIA"** (voz masculina clonada de
  Sergio) — sirve para el contenido de Sergio, NO para Lucia. Para Lucia hay que usar un
  voice_id femenino propio (abajo). Nota de arquitectura: el pipeline debe usar voice_id
  **por modelo** (Lucia≠Sergio), no un único global.
- ⚠️ La key `sk_07c6...` que se pego en el chat era RESTRINGIDA (sin permisos
  text_to_speech/voices_read) y ademas quedo expuesta en el transcript — **rotarla en
  ElevenLabs**. No hace falta: la del VPS ya funciona.

## Candidatas de voz para Lucia (ElevenLabs, español multilingüe)

Muestras generadas con la misma frase ("Hola, soy Lucia... rutina de skincare, sin
filtros ni humo..."), modelo `eleven_multilingual_v2`. Escuchar y elegir:

| Archivo | Voz | Perfil | voice_id |
|---|---|---|---|
| `lucia-voz-el-jessica.mp3` | Jessica | joven, cálida, playful — la más "influencer relatable" | `cgSgspJ2msm6clMCkdW9` |
| `lucia-voz-el-sarah.mp3` | Sarah | joven, profesional, confiada | `EXAVITQu4vr4xnSDxMaL` |
| `lucia-voz-el-laura.mp3` | Laura | joven, con actitud/sassy | `FGY2WhTYpPnrIDTdsKH5` |

También existe (Higgsfield, opción barata alterna): `lucia-voz-signature.wav` =
seed_audio "Lucia-voz" (`8de5db95`, clonada del preset Isabella). Funciona pero es voz
de base compartida.

## ✅ Voz PROPIA creada con Voice Design (2026-07-09)

Se generaron 3 versiones únicas de "Lucia" con ElevenLabs Voice Design (voces nuevas,
propias de la cuenta, que nadie más tiene). Escuchar y elegir 1:

| Archivo | generated_voice_id (TEMPORAL) |
|---|---|
| `lucia-voz-DISENO-1.mp3` | `YlEQSG3A8HmM1pAWVEEA` |
| `lucia-voz-DISENO-2.mp3` | `wrXs6GqcC7X03dDKMoeT` |
| `lucia-voz-DISENO-3.mp3` | `De3I0Oz5kx9RdURbhhFg` |

⚠️ Estos `generated_voice_id` son TEMPORALES (previews). Cuando Sergio elija uno, hay que
GUARDARLO en la librería: `POST /v1/text-to-voice` con `{voice_name:"Lucia-ONIA",
voice_description, generated_voice_id}` → devuelve el voice_id PERMANENTE. Ese permanente
es el que se usa siempre.

## Cómo se usa (consistencia total)

Una vez elegida y guardada, Lucia tiene UN voice_id permanente. **Todo** su audio sale
de ese id → voz idéntica siempre, en b-rolls y lipsync.

- **B-roll (sin lipsync):** generar VO con el voice_id de Lucia → mp3 → montarlo ENCIMA
  del video (Kling/minimax) en edición. El video es movimiento, la voz va arriba.
- **Lipsync (hablando a cámara):** `wan2_7` toma un still de Lucia + el mp3 de ElevenLabs
  como `audio_references` → le sincroniza la boca A SU PROPIA VOZ. Mismo voice_id = misma
  voz que en los b-rolls. (15cr/10s.)
- ⚠️ **Marketing Studio genera su PROPIA voz** (no acepta audio externo) → NO mantiene la
  voz de Lucia. Para voz consistente en todo, usar `wan2_7` para el lipsync, no MS.
  MS solo si no importa la voz o se acepta la suya.

## ✅ DECIDIDO 2026-07-09 — voz oficial de Lucia

Sergio eligió **Diseño 2**. Guardada como voz permanente en ElevenLabs:
- **Nombre:** `Lucia-ONIA`
- **voice_id PERMANENTE:** `wrXs6GqcC7X03dDKMoeT` (usar voice_type ElevenLabs / API REST)
- Registrado en el VPS: `/root/.hermes/.env` → `LUCIA_ELEVENLABS_VOICE_ID=wrXs6GqcC7X03dDKMoeT`
- Muestra oficial: `lucia-voz-OFICIAL.mp3`. Modelo: `eleven_multilingual_v2`.

**Toda la voz de Lucia usa este id de ahora en más** (b-rolls VO + wan2_7 lipsync).
Las otras muestras (premade Jessica/Sarah/Laura, diseños 1 y 3, y la de Higgsfield
seed_audio) quedan como descartadas / alternativas de respaldo.
