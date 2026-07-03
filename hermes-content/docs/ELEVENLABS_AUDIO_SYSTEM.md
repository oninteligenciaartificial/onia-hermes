# ElevenLabs Audio System

Hermes uses ElevenLabs as the audio layer for short-form videos, UGC ads,
client campaigns, ONIA explainers and Sergio personal brand content.

Hermes remains the brain:

- script
- voice direction
- approval
- claims safety
- caption
- video/audio assembly plan
- publishing decision

ElevenLabs is the audio engine:

- text to speech
- voice library
- voice cloning/design, only with consent
- dubbing/localization
- sound effects
- speech to text/transcription
- dialogue or multi-speaker audio when needed

## Official Capabilities

ElevenLabs documentation describes API capabilities for:

- Text to Speech
- Speech to Text
- Music
- Text to Dialogue
- Image and Video
- Voice changer
- Voice isolator
- Dubbing
- Sound effects
- Voices
- Voice Remixing
- Forced Alignment
- ElevenAgents

Sources:

- https://elevenlabs.io/docs/overview/intro
- https://elevenlabs.io/docs/capabilities/text-to-speech
- https://elevenlabs.io/docs/api-reference/text-to-speech
- https://github.com/elevenlabs/elevenlabs-mcp

## Operating Rule

ElevenLabs never publishes. It only creates or analyzes audio.

The safe chain is:

```text
Telegram / Dashboard
-> Hermes writes script
-> Video Lab creates job
-> approval
-> ElevenLabs generates voice/audio
-> Higgsfield or editor combines video/audio
-> public MP4 URL
-> review
-> publish approval
-> ig-publish reel_publish
```

## Voice Lanes

### Sergio

Default: use Sergio's real voice when possible.

AI voice use requires explicit approval because it affects trust.

Good use cases:

- cleaning/re-recording short lines
- draft narration
- alternate hook testing
- subtitles/transcripts

Avoid:

- fake personal confession in Sergio's AI voice
- generated voice claiming real results
- publishing voice clone without approval

### ONIA

Default: clear Spanish narrator, practical, low hype.

Good use cases:

- demo narration
- explainer videos
- educational reels
- bilingual content

### Clients

Default: client-safe narrator or UGC voice.

Good use cases:

- UGC ad voiceover
- product explainer
- local business ads
- translated variants

Every client voice job must store:

- business
- offer
- voice style
- language
- consent status if cloning is used
- approval status

## Voice Styles

### Founder Real

Use for Sergio:

```text
Natural Spanish, direct, conversational, slightly fast, no announcer voice,
warm but practical, founder building in public.
```

### ONIA Educator

Use for ONIA:

```text
Neutral Latin American Spanish, confident, clear, educational, not corporate,
not hype, short pauses after key ideas.
```

### UGC Friend

Use for client UGC:

```text
Casual, believable, friend-to-friend, curious, not polished, natural pauses.
```

### Premium Client

Use for clinics, real estate, high-ticket services:

```text
Calm, trustworthy, polished, warm, premium, measured pacing.
```

## Telegram Commands

Generation triggers (create or update Video Lab jobs, never publish):

```text
Genera voz Sergio: <texto>
Genera voz ONIA: <texto>
Genera voz cliente: <negocio> | <texto> | <estilo>
Doblaje video: <url_video> | <idioma>
```

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
- Dubbing must not change meaning or claims.
- Store API keys only in `/root/.hermes/.env`.

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

## Future Integration

When the ElevenLabs MCP or API is connected:

1. List approved voices.
2. Generate audio draft from Video Lab script.
3. Save audio in `/var/www/html/hermes-assets/audio`.
4. Store public audio URL in Video Lab job JSON.
5. Combine audio with Higgsfield/editor output.
6. Send preview before publishing.
