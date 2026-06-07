# Sergio Talking Video Lock

Purpose: use a real Sergio talking video as the source of truth for final avatar
work.

This folder is internal only. A talking video may include face, teeth, mouth
movement and voice; generated drafts can be reviewed internally, but publication
and voice cloning require explicit approval.

## Final Workflow

1. Put Sergio's talking video somewhere local.
2. Run:

```powershell
.\scripts\process_sergio_talking_reference.ps1 -VideoPath "<absolute-video-path>"
```

3. Review the generated contact sheets:
   - `talking-reference-contact-sheet.jpg`
   - `mouth-teeth-contact-sheet.jpg`
4. Pick one closed-mouth/neutral frame and one clean smile or speaking-teeth
   frame as identity anchors.
5. Generate a new photoshoot still in Higgsfield from:
   - best previous avatar still;
   - real talking-video frames;
   - mouth/teeth contact sheet;
   - current preferred outfit/background.
6. Animate only the approved single still in Kling 3.0.
7. Validate with FFprobe and frame QA before showing or publishing.

## Video Sergio Should Record

Use this format to make the final avatar actually converge:

- 10 to 15 seconds.
- Vertical 9:16.
- Chest-up or shoulders-up, not full body.
- Face fills most of the frame.
- Natural window light or soft room light.
- Same hairstyle target: glossy black Italian side part, no hair falling forward.
- Same outfit target: black shirt or black blazer/black shirt.
- Look directly at camera.
- Say one short line slowly, then smile naturally for 2 seconds.
- Include teeth clearly, but do not exaggerate mouth opening.
- No heavy filter, no beauty mode, no subtitles, no music.
- Record at the best phone quality available.

Suggested line:

```text
La IA no es magia. Es ejecucion con sistemas.
```

Then hold a relaxed smile with teeth visible.

## Required QA

- Face still looks like Sergio, not a generic model.
- Teeth match the speaking source or the approved improved dental target.
- Mouth does not warp while talking.
- Neck does not stretch.
- Hair stays in the Italian side part.
- Shoulders remain natural and not skinny.
- No voice clone or public post unless explicitly approved.
