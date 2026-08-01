# ElevenLabs Audio System

Hermes uses ElevenLabs as the voice/audio layer for Video Lab.

ElevenLabs can support:

- text to speech
- speech to text
- dubbing
- sound effects
- voice changer
- voice isolation
- voice library/design
- forced alignment
- dialogue audio

Sources:

- https://elevenlabs.io/docs/overview/intro
- https://elevenlabs.io/docs/capabilities/text-to-speech
- https://elevenlabs.io/docs/api-reference/text-to-speech
- https://github.com/elevenlabs/elevenlabs-mcp

## Architecture

```text
Hermes script and approval
-> ElevenLabs voice/audio
-> Higgsfield or editor combines media
-> asset server
-> review
-> ig-publish after approval
```

ElevenLabs must not publish directly.

## Voice Lanes

### Sergio

Use Sergio's real voice when possible.

AI voice or voice clone requires explicit approval before publishing.

Recommended:

- draft narration
- quick hook variants
- cleanup/re-recording support
- transcripts

Avoid:

- fake personal confession
- fake results in Sergio's voice
- unapproved voice clone

### Onia

Use neutral, clear Latin American Spanish.

Recommended:

- demos
- explainers
- educational reels
- bilingual versions

### Clients

Use client-safe voiceover.

Recommended:

- UGC-style ad narration
- product/service explainer
- translated ad variants

If using a cloned client voice, store consent status.

## Voice Presets

### Sergio Founder

```text
Natural Spanish, direct, conversational, practical, founder-to-founder, not
announcer, slightly fast, warm.
```

### Onia Educator

```text
Neutral Latin American Spanish, clear, consultative, educational, confident,
short pauses, low hype.
```

### UGC Friend

```text
Casual, believable, social-media native, friend-to-friend, natural pauses,
not polished.
```

### Premium Client

```text
Calm, warm, trustworthy, premium, measured pacing, polished but human.
```

## Telegram Commands To Add

Future commands:

```text
Genera voz Sergio: <texto>
Genera voz ONIA: <texto>
Genera voz cliente: <negocio> | <texto> | <estilo>
Doblaje video: <url_video> | <idioma>
Audio generado <job_id>: <audio_url>
```

These commands should create or update Video Lab jobs, not publish anything.

## Approval Rules

- Voice cloning requires explicit consent.
- Generated Sergio voice requires explicit approval before public use.
- Client voice requires approval before delivery.
- Dubbing must not change meaning or claims.
- No fake testimonials.

## Runtime Paths

```text
/root/.hermes/audio-lab/jobs
/root/.hermes/audio-lab/outputs
/var/www/html/hermes-assets/audio
```

## Environment Variables

Future:

```text
ELEVENLABS_API_KEY
ELEVENLABS_DEFAULT_VOICE_ID
ELEVENLABS_SERGIO_VOICE_ID
ELEVENLABS_ONIA_VOICE_ID
ELEVENLABS_MODEL_ID
```

Store only in `/root/.hermes/.env`. Never print full values.

## Audio Approval Gates

Voice brief approval:

```text
Aprobar audio <job_id>
```

Audio generated:

```text
Audio generado <job_id>: <audio_url>
```

Video generated with audio:

```text
Video generado <job_id>: <video_url>
```

Publishing:

```text
Publicar video <job_id>
```

## Prompt Package For ElevenLabs

```json
{
  "lane": "sergio | onia | client",
  "language": "es-419",
  "voice_style": "",
  "script": "",
  "emotion": "",
  "pace": "",
  "duration_target_seconds": 30,
  "approval_required": true,
  "voice_clone_allowed": false
}
```

## Safety Rules

- Never clone Sergio or a client without explicit consent.
- Never publish generated voice as if it were real recording unless approved.
- Never generate fake testimonials.
- Never generate medical, financial or legal claims without review.
- Store API keys only in `/root/.hermes/.env`.

## Future Integration

When the ElevenLabs MCP or API is connected:

1. List approved voices.
2. Generate audio draft from Video Lab script.
3. Save audio in `/var/www/html/hermes-assets/audio`.
4. Store public audio URL in Video Lab job JSON.
5. Combine audio with Higgsfield/editor output.
6. Send preview before publishing.

