# Skill: Audio ElevenLabs

Use this skill when Sergio asks Hermes to create voiceover, TTS, dubbing,
sound effects, voice cloning, transcripts, or audio for videos with
ElevenLabs.

## Read

- `/root/.hermes/docs/ELEVENLABS_AUDIO_SYSTEM.md`
- `/root/.hermes/docs/VIDEO_LAB.md`
- `/root/.hermes/docs/VIRAL_VIDEO_PLAYBOOK.md`
- `/root/.hermes/docs/UGC_CLIENT_VIDEO_PLAYBOOK.md`
- `hermes-content/docs/SERGIO_FACE_VOICE_ASSET_GUIDE.md`

## Commands

### Genera voz Sergio: <texto>

Create a Sergio voice draft. If this uses a generated/cloned voice, require
approval before publishing.

### Genera voz ONIA: <texto>

Create an ONIA educational narrator voice draft.

### Genera voz cliente: <negocio> | <texto> | <estilo>

Create a client-safe UGC or premium voice draft.

### Doblaje video: <url_video> | <idioma>

Prepare a dubbing job. Preserve meaning and claims. Do not publish.

### Audio generado <job_id>: <audio_url>

Attach generated audio to a Video Lab or Audio Lab job.

## Output Format

```text
Audio brief:
Lane:
Voice style:
Script:
Pacing:
ElevenLabs prompt/settings:
Safety notes:
Next action:
```

## Safety

- Never clone a voice without consent.
- Never publish Sergio AI voice without approval. Uploading Sergio Urcullo's voice or face to an external service also needs the OK of Leslie Mercado Moreno.
- Never invent testimonials or results.
- Never make medical, financial or legal claims without review.
- Store audio outputs in `/var/www/html/hermes-assets/audio`.

## When MCP/API Is Connected

1. Check approved voices.
2. Generate short draft first.
3. Save audio URL.
4. Attach URL to job JSON.
5. Ask for approval before combining/publishing.
