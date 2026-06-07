$prompt = @'
Use the uploaded reference video as a motion-control guide for timing, camera angle, posture, hand gestures, leaning rhythm, head turns, speaking energy and body language.
Replace the person with Mara Vale, the fictional adult red-haired AI model.
Preserve Mara's exact identity from the image reference: same fair freckled skin, copper-red wavy hair, green-hazel eyes, nose, lips, jawline, warm smile and healthy adult proportions.
Keep expressive hand gestures and close-camera social-native storytime energy from the reference, but make the scene a warm modern apartment: soft curtains, lamp, sofa, side table, plant, luxury UGC atmosphere.
Outfit must be brand-safe and premium: cream fitted ribbed top under a relaxed ivory linen shirt or modest cream blazer, no deep cleavage, no logos.
Natural human movement, realistic hands, expressive but not exaggerated, no robotic mouth, no identity drift, no different face, no text, no watermark.
'@
$identity = 'C:\dev\Expermimentos\Hermes\hermes-content\references\ai-ecommerce-model\video-ads\full-body-motion-control-v1\20260606-mara-full-body-apartment-still-v1.png'
$video = 'C:\dev\Expermimentos\Hermes\hermes-content\references\ai-ecommerce-model\video-ads\motion-control-runs\20260606-validation-sergio-reference-v3\reference-driving-clip.mp4'

# Upload compressed reference
npx -y -p @higgsfield/cli higgsfield upload create "$video" --json --no-color

# Cost example
npx -y -p @higgsfield/cli higgsfield generate cost seedance_2_0 --prompt "$prompt" --image "$identity" --video "a6405832-a6f0-44a1-871a-26129f713cf2" --aspect_ratio 9:16 --duration 10 --json --no-color

# Generate example
npx -y -p @higgsfield/cli higgsfield generate create seedance_2_0 --prompt "$prompt" --image "$identity" --video "a6405832-a6f0-44a1-871a-26129f713cf2" --aspect_ratio 9:16 --duration 10 --wait --wait-timeout 30m --wait-interval 10s --json --no-color
