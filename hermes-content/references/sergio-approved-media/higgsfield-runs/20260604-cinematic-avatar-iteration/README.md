# Sergio Cinematic Avatar Iteration

Internal test only. Do not publish without explicit approval.

## Objective

Improve the previous Sergio all-black avatar test based on Sergio's review:

- stronger and cleaner posture;
- more attractive but realistic presentation;
- aligned gaze and eyes;
- higher quality 4K still;
- cinematic environment different from the wall background;
- perfect but natural bronzed skin;
- realistic eyebrows;
- lint-free all-black wardrobe.

## Planned Route

1. Generate a new 4K still with `nano_banana_2` using `IMG_0329_preview.jpg` as the identity anchor.
2. QA the still visually.
3. If acceptable, animate it using `kling3_0` in `mode=4k` with sound off.
4. Download the MP4 locally and keep it in review only.

## Source

- Identity pack: `hermes-content/references/sergio-approved-media`
- Primary source image: `processed/IMG_0329/IMG_0329_preview.jpg`
- Soul ID available: `1238064e-1295-4cbf-9a41-861d4106e0e8`

## Status

Generated for internal review.

## Results

- Still model: `nano_banana_2`
- Still job: `cf288dd2-0490-4fc8-a356-b517200c80f1`
- Still URL: `https://d8j0ntlcm91z4.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/hf_20260605_022747_cf288dd2-0490-4fc8-a356-b517200c80f1.png`
- Local still: `sergio-cinematic-4k-still-v2.png`
- Video model: `kling3_0`
- Video job: `b6a7869c-97b9-43a5-bfa3-a857a5af317a`
- Video URL: `https://d8j0ntlcm91z4.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/hf_20260605_023337_b6a7869c-97b9-43a5-bfa3-a857a5af317a.mp4`
- Local video: `sergio-cinematic-avatar-v2-kling4k-noaudio.mp4`

## Cost

- 4 credits for the good 4K still.
- 4 credits spent on one discarded still attempt because PowerShell passed only the first prompt paragraph.
- CLI estimate before video: 30 credits for the Kling 3.0 4K video.
- Observed account delta for this turn: 67.5 credits, from 2670.78 to 2603.28.
- Use the observed account delta for budgeting until Higgsfield exposes per-job credit details in `generate get/list`.

## QA

- Video dimensions: 2152x3852.
- Duration: 5.04 seconds.
- Audio: none.
- QA frames: `qa-frame-00-4s.jpg`, `qa-frame-02-2s.jpg`, `qa-frame-04-4s.jpg`.
- Visual review: improved cinematic environment, all-black lint-free outfit, stronger posture and more even gaze than the previous test.
- Residual visual risks: slight identity drift during the blink, final-frame eyes/gaze open a little wider, mild facial smoothing, and neck/torso movement still reads somewhat rigid.
- Review decision: not `identity_ok` yet. Requires Sergio approval of the exact MP4 before reuse, publication, client delivery or ad use.

## Notes

- The first generated still, `discarded-truncated-prompt-still.png`, is kept only for traceability and should not be used as a production reference.
- `nano-banana-4k-still-v2-discarded-create-jobid.txt` points to the discarded truncated-prompt attempt. Use `nano-banana-4k-still-v2-good-wait.json` for the accepted still metadata.
- This asset is internal review only. Do not publish, send to clients, or use in ads without explicit approval.
