# ONIA UGC Model Lab - 2026-06-15 Analysis

## Objective

Build a repeatable UGC production system for one AI model identity:

- preserve the same face across photos and videos;
- find the safest local LTX-2.3 video format;
- document which prompts/settings work;
- avoid burning GPU hours on unstable variants.

## Assets Captured

Identity and smile references:

- `assets/identity-photoshoot-contact-sheet.png`
- `assets/smile-mouth-reference-sheet.png`
- `assets/angle-smile-reference-sheet.png`

Video analysis:

- `assets/master-ugc-video-review.jpg`
- `reports/video-inventory.csv`
- `reports/video-inventory.json`

Local working copies:

- Videos: `C:\Users\PC\Downloads\onia_ugc_batch001`
- Analysis: `C:\Users\PC\Downloads\onia_ugc_analysis_20260615`
- FFmpeg portable: `C:\Users\PC\tools\ffmpeg`

RunPod working paths:

- Videos: `/workspace/runpod-slim/ComfyUI/output/onia_ugc/sergio_model`
- Batch scripts: `/workspace/onia-lab/sergio/projects/ugc-model-ltx23`

## Identity Reference Assessment

### Photoshoot Contact Sheet

Status: useful but not final.

Strengths:

- Consistent broad facial identity.
- Good UGC selfie feel.
- Good wardrobe/location spread for concepting.

Limitations:

- It does not define teeth or mouth mechanics enough.
- Some panels are "same vibe" rather than forensic identity.
- It should not be used alone for lipsync or high-motion UGC.

### Smile and Mouth Reference Sheet

Status: strong synthetic smile lock, with caution.

Strengths:

- Much better mouth/lip/dental reference than the original selfie.
- Gives closed-mouth, slight smile, and teeth smile options.
- Good for defining what future generations should preserve.

Risks:

- Teeth are generated, not proven from the original face.
- Treat this as the approved synthetic smile, not as a real biometric truth.
- Do not let future prompts create wider/open laughter unless we approve a new reference.

### Angle Smile Reference Sheet

Status: best angle bank so far.

Strengths:

- Strong profile and three-quarter angle consistency.
- Hairline, nose, brow, and smile remain reasonably stable.
- Better as a video input source than asking LTX to create new angles.

Recommendation:

Use selected panels from this sheet as source images for video. Do not ask LTX to change angle, outfit, and location inside the video prompt.

## Video Test Inventory

All generated videos used:

- `768x768`
- `49 frames`
- `8 fps`
- about `6.125s`
- LTX-2.3 image-to-video

## Video QA Scores

Scale: 1 bad, 5 production-ready.

| File | Identity | Motion | Artifacts | UGC Use | Decision |
|---|---:|---:|---:|---:|---|
| `001_001_hook_direct_00001_.mp4` | 4 | 3 | 3 | 4 | Candidate |
| `002_002_problem_solution_00001_.mp4` | 2 | 2 | 1 | 1 | Reject |
| `003_003_testimonial_00001_.mp4` | 3 | 2 | 1 | 1 | Reject |
| `004_004_before_after_00001_.mp4` | 4 | 3 | 3 | 3 | Candidate |
| `001_same_room_hook_direct_00001_.mp4` | 3 | 3 | 2 | 2 | Reject for final |
| `008_home_office_problem_solution_00001_.mp4` | 3 | 3 | 2 | 2 | Reject for final |
| `015_bedroom_testimonial_00001_.mp4` | 3 | 3 | 2 | 2 | Reject for final |
| `022_kitchen_before_after_00001_.mp4` | 2 | 3 | 1 | 1 | Reject |

## Key Findings

### What Works

Close-up selfie framing works best.

The model preserves identity best when:

- scene stays close to the original;
- movement is subtle;
- prompt does not ask for major location/outfit changes;
- there are no extra objects, extra people, text, or complex gestures;
- the face remains large in frame.

Best current format:

```text
close-up vertical selfie, same approved source image, same outfit/location,
subtle mouth movement, small nod, small hand gesture, no scene change,
no extra people, no text, no objects entering frame
```

### What Fails

Changing location and wardrobe directly inside LTX causes drift.

Failure patterns observed:

- extra people appear in background;
- the scene becomes a kitchen/cafe even when not intended;
- weird text/line overlays appear;
- face becomes less consistent as the shot gets wider;
- hands and fingers degrade when gesture is too strong.

Do not use LTX as the source photoshoot generator for this identity. Use it as an animator.

## Production Rule

The correct ONIA stack is:

1. Generate or select a still photo for each scene.
2. Approve the still image for identity.
3. Animate only the approved still with LTX/Wan.
4. Add voice, captions, CTA, and edit in Remotion or Higgsfield.

This avoids asking one video model to solve identity, wardrobe, location, motion, and ad performance at the same time.

## Winning Prompt Direction

Use for approved still images:

```text
same woman from the input image, preserve exact facial identity, eyes, eyebrows,
nose, lips, smile, hairline, hair color, skin texture and freckles; realistic
vertical UGC selfie video, subtle natural mouth movement, small nod, slight
friendly expression, minimal hand movement, stable close-up framing, no scene
change, no extra people, no text, no watermark, no new objects entering frame
```

Negative prompt:

```text
different person, changed face, changed eyes, changed eyebrows, changed nose,
changed lips, changed teeth, changed smile, changed hair, extra people, extra
hands, extra fingers, bad hands, distorted teeth, warped mouth, crossed eyes,
text, watermark, logo, subtitles, scene change, background transformation,
cartoon, anime, plastic skin, flicker, glitch
```

## Recommended Next Batch

Do not generate thousands yet.

Next batch should be 12 videos:

- 4 approved same-room closeups;
- 4 approved outfit variations generated as stills first;
- 4 approved location variations generated as stills first.

Settings:

- `768x768`
- `49 frames`
- `8 fps`
- low motion
- no scene change
- no strong hand action

Only scale a variant if it scores at least:

- identity: 4/5
- artifacts: 4/5
- UGC use: 4/5

## Final Recommendation

The current perfect format is not "multiple locations from one selfie." The perfect format is:

```text
ChatGPT/Nano Banana style identity photoshoot -> approved still bank ->
LTX low-motion animation -> ElevenLabs/voice -> Remotion edit -> QA board.
```

For local testing, LTX is valuable. For client-facing final UGC, use the local lab to discover winners, then finish the best concepts in Higgsfield/ElevenLabs/Remotion when quality matters.
