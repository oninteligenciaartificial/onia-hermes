# ComfyUI Video Audit

- Endpoint: `https://d36cqn7umhexvx-8188.proxy.runpod.net`
- Generated: `2026-06-16T19:14:33.226Z`

| Prompt ID | Image | Frames | FPS | Video | Contact sheet | Notes |
|---|---|---:|---:|---|---|---|
|fdb3b711-48a2-447e-b4c3-ce115518ddd7|mara_20260616_primary_i2v_front_smile.png|49|8|hermes-content\references\ai-ecommerce-model\comfyui\audits\pond-ltx23-motion-calibration-001-short\fdb3b711__mara__00001__comfy_ltx23__same_source_outfit__warm_friend__close.mp4|hermes-content\references\ai-ecommerce-model\comfyui\audits\pond-ltx23-motion-calibration-001-short\fdb3b711__mara__00001__comfy_ltx23__same_source_outfit__warm_friend__close__frames.jpg|identity ok, artifacts ok, motion too static|
|5a94d4a4-1806-4b45-8733-11d8637001ea|mara_20260616_primary_i2v_front_smile.png|49|8|hermes-content\references\ai-ecommerce-model\comfyui\audits\pond-ltx23-motion-calibration-001-short\5a94d4a4__mara__00002__comfy_ltx23__same_source_outfit__warm_friend__close.mp4|hermes-content\references\ai-ecommerce-model\comfyui\audits\pond-ltx23-motion-calibration-001-short\5a94d4a4__mara__00002__comfy_ltx23__same_source_outfit__warm_friend__close__frames.jpg|identity ok, artifacts ok, motion too static|
|4f733f96-b1ee-438e-b423-79557736a51c|mara_20260616_primary_i2v_front_smile.png|49|8|hermes-content\references\ai-ecommerce-model\comfyui\audits\pond-ltx23-motion-calibration-001-short\4f733f96__mara__00003__comfy_ltx23__same_source_outfit__warm_friend__close.mp4|hermes-content\references\ai-ecommerce-model\comfyui\audits\pond-ltx23-motion-calibration-001-short\4f733f96__mara__00003__comfy_ltx23__same_source_outfit__warm_friend__close__frames.jpg|identity ok, artifacts ok, motion too static|
|63b7c62a-c361-4abc-aca4-dc46b75205c6|mara_20260616_primary_i2v_front_smile.png|49|8|hermes-content\references\ai-ecommerce-model\comfyui\audits\pond-ltx23-motion-calibration-001-short\63b7c62a__mara__00004__comfy_ltx23__same_source_outfit__warm_friend__close.mp4|hermes-content\references\ai-ecommerce-model\comfyui\audits\pond-ltx23-motion-calibration-001-short\63b7c62a__mara__00004__comfy_ltx23__same_source_outfit__warm_friend__close__frames.jpg|identity ok, artifacts ok, motion too static|
|48889bf2-a355-4c60-b7cd-7d0a8382fe8f|mara_20260616_primary_i2v_front_smile.png|49|8|hermes-content\references\ai-ecommerce-model\comfyui\audits\pond-ltx23-motion-calibration-001-short\48889bf2__mara__00005__comfy_ltx23__same_source_outfit__warm_friend__close.mp4|hermes-content\references\ai-ecommerce-model\comfyui\audits\pond-ltx23-motion-calibration-001-short\48889bf2__mara__00005__comfy_ltx23__same_source_outfit__warm_friend__close__frames.jpg|fails: motion present but face collapses into blur|

## QA rubric

- identity: does the face remain the same person?
- motion: enough movement to read as video, without drift?
- artifacts: blur, flicker, mouth/teeth warp, hair smear?
- route decision: keep LTX, retry with another prompt, or switch engine?

## Batch verdict

LTX-2.3 with this simple image-to-video workflow is not strong enough for Mara talking-head production. It has two modes in this batch:

- safe but almost static for tiny nod, lean, shoulder or hair prompts;
- unusable face blur when motion becomes meaningful.

Use this workflow only for static identity preservation and cheap prompt sanity checks. For usable UGC/avatar video, switch the render stage to a stronger image-to-video engine, then do ElevenLabs audio and dedicated lipsync after the silent video is approved.
