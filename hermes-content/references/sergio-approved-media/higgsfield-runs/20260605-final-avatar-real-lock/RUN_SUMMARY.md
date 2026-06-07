# 20260605 Final Avatar Real Lock

Purpose: create a better Sergio avatar from the new uploaded real identity
photos and videos. Internal preview only. Not approved for publication.

## Source Upload

Raw files copied from Codex temp into:

`hermes-content/references/sergio-approved-media/final-avatar-identity-lock/20260605-upload-0405-0409/raw/`

Converted previews and video frames:

`hermes-content/references/sergio-approved-media/final-avatar-identity-lock/20260605-upload-0405-0409/`

Best identity anchors:

- `previews/IMG_0405.jpg`: neutral frontal identity lock
- `previews/IMG_0407.jpg`: smile, dimples and teeth lock
- `previews/IMG_0408.jpg`: side/profile geometry
- `previews/IMG_0409.jpg`: side/profile geometry
- `contact-sheets/IMG_0406-long-video-contact-sheet.jpg`: natural expressions, profile and mouth QA

## Model Route

- Nano Banana Pro (`nano_banana_2`) used for stills.
- No previous AI avatar image was used as identity reference.
- Kling 3.0 prompt prepared, but no video animation generated until Sergio
  approves one still.

## Generated Stills

Earlier broad-reference attempts:

- `avatar-base-neutral-nano-01.png`: premium but slightly model-like.
- `avatar-base-smile-nano-01.png`: usable visually but more generic.

Strict exact-photo edit attempts:

- `avatar-exact-neutral-nano-01.png`: closest identity match; recommended base.
- `avatar-exact-smile-nano-01.png`: friendlier social avatar; less exact than
  neutral.

## Job IDs

- Broad neutral: `883e7f49-d3c3-4cfd-a244-cde011dd75a1`
- Broad smile: `d1336a6b-ba40-462c-b0ed-3446916bfb5a`
- Exact neutral: `6e5590ee-9197-486c-b707-f61f1f125948`
- Exact smile: `7a0c6793-e638-48c0-b86e-0cb889ae90f2`
- Kling exact neutral animation: `9c087cef-ab23-46ae-b8d1-90d976eb1741`

## Generated Animation

- Approved still animated by request:
  `avatar-exact-neutral-nano-01.png`
- Kling start frame:
  `kling-start-avatar-exact-neutral-1152x2048.jpg`
- Final internal preview:
  `avatar-exact-neutral-kling3-0-4k.mp4`
- QA frames:
  `kling-exact-neutral-qa-frames/frame_00_5s.jpg`
  `kling-exact-neutral-qa-frames/frame_02_5s.jpg`
  `kling-exact-neutral-qa-frames/frame_04_5s.jpg`

Validation:

- FFprobe: 2160x3840, H.264, 24 fps, 5.041667 seconds.
- Audio: no audio stream detected.
- Visual QA: identity remains broadly stable; slight mouth movement appears
  despite no lipsync/audio; blink and small expression movement are present.
  Keep as internal preview until Sergio approves or requests a stricter retake.

## QA Note

Recommended next step: Sergio approves `avatar-exact-neutral-nano-01.png` or
requests a single correction before Kling animation. Do not animate or publish
without approval.
