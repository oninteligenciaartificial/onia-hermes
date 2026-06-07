# 20260605 Source Video Final Avatar

Purpose: internal Sergio avatar test using the new real talking video as the
identity source of truth. No publishing approval granted.

## Source Identity

- Drive video ID: `1hiyemoUpjYXsoranvGYZ1lM9_UhSdWdS`
- Local source copy:
  `hermes-content/references/sergio-approved-media/talking-video-lock/20260605-drive-1hiyemo-source-lock/source.mp4`
- Selected identity anchors:
  - `frames/frame_001.jpg` for neutral face geometry
  - `mouth-frames/mouth_012.jpg` for natural 3/4 smile and teeth
  - `mouth-frames/mouth_014.jpg` for frontal smile and teeth
- Style anchor:
  `hermes-content/references/sergio-approved-media/higgsfield-runs/20260605-avatar-perfect-smile-shoot/photoshoot-perfect-smile-02.png`

## Models Used

- GPT Image 2 (`gpt_image_2`) for final photoshoot stills.
- Nano Banana Pro (`nano_banana_2`) tested as refinement, but discarded because
  it made the face older and more generic.
- Kling v3.0 (`kling3_0`) for final 5 second internal animation test.

## Final Assets

- Selected still:
  `photoshoot-source-video-final-gpt-variant-b-01.png`
- Kling upload start frame:
  `kling-start-frame-1152x2048.jpg`
- Final internal video preview:
  `kling3-0-source-video-final-avatar-4k.mp4`
- QA frames:
  `kling3-0-qa-frames/frame_00_5s.jpg`
  `kling3-0-qa-frames/frame_02_5s.jpg`
  `kling3-0-qa-frames/frame_04_5s.jpg`

## Job IDs

- GPT Image 2 first still: `e158587b-c3df-4491-8a15-4586f6e8b1d1`
- GPT Image 2 variant B selected still: `fca1a9f0-f46f-45a7-9890-71a8b1ee36ef`
- Nano Banana Pro discarded refinement: `92fa8e58-6f3c-4abb-badb-e9ea348bb9e1`
- Kling v3.0 selected animation: `ed1235be-4a1c-42fd-97f5-ca01fe94a82a`

## Validation

- FFprobe on final MP4:
  - video codec: H.264
  - resolution: 2160x3840
  - duration: 5.041667 seconds
  - fps: 24
  - streams: video only, no audio stream detected
- Visual QA:
  - hair stays in side part
  - teeth remain readable and not broken
  - no subtitle or watermark
  - movement is subtle

## Remaining Risk

Identity is improved from the earlier generated avatars, but it is still an AI
avatar. Sergio must review before any client-facing use or publication.
