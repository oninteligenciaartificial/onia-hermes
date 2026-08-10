# Reels Vision Pass (the Claude side)

`prepare.mjs` produces a **manifest** of reels with extracted frames. This step is
the vision analysis: read each reel's frames + caption and turn them into a
schema-shaped analysis JSON that the web factory can act on. It runs from the
Claude/agent side (same pattern as `harvester/vision/`), because the model reads
the frames and reasons about design language.

## Input

- Manifest: `data/references/reels/reels-manifest.json` (trend) or
  `data/clients/<slug>.reels.manifest.json` (client).
- For each reel with `status: "ready-to-analyze"`:
  - `frames[]`: keyframe images (and `contactSheet` if present — prefer it, it is
    the whole reel in one image).
  - `caption`: the brand's real on-post voice.
  - `source`: url/handle (evidence only) and, for client lane, `localVideo`.

## PRIORITY: grab the web page shown IN the video

Many of these reels are website showcases (agency portfolio, "I built this site",
POV design reels). When a reel shows a website/app on screen, **the site's design
is the main thing to extract** — fill `showcasedSite`:

- Find the frames where the site is actually on screen (scroll it, seek the video).
- Capture the SITE's `layout`, `sections`, `palette` (the site's, not the reel's),
  `typography`, `components` (bento, sticky nav, cards...) and `interactions`
  (scrollytelling, parallax, pinned hero, hover reveals...).
- `reuseForFactory`: concrete pieces to rebuild with ONIA tokens.
- Set `captureQuality`: "clear" if you saw the site well, "partial" if only
  glimpses, "not-shown" if the reel never shows it.

Keep this SEPARATE from the reel's own production style (top-level `palette`,
`motion`, `shots`) — that describes how the reel was filmed, not the site.

## What to do per reel

1. Read the `contactSheet` if set, else read the `frames[]` images.
2. Read the `caption`.
3. Fill the schema in `harvester/reels/schema.ts` (`REEL_ANALYSIS_TEMPLATE`) —
   including `showcasedSite` (see PRIORITY above) whenever the reel shows a site.
   Keep the reel's `id`, `lane`, `clientSlug`, `frames`, `contactSheet` and
   `source` from the manifest; you are adding the design read:
   - `rubro`: business type, so ideas route into the pattern bank (beauty, food,
     agency, clinic, real-estate, saas, local-service...).
   - `palette[]`: 3-6 dominant colors as `{role, hex, note}`. Estimate hex from
     the frames; role = bg / surface / accent / secondary / text / detail.
   - `typography`: on-video type vibe + the literal `onScreenText` overlays.
   - `motion`: `pacing`, `transitions[]`, `techniques[]` (kinetic-typography,
     product-macro, before-after, pov, unboxing, speed-ramp...).
   - `shots[]`, `productPresentation`, `hook{type,text}`, `mood[]`.
   - **`webIdeas`** — this is the point of the whole exercise:
     - `heroDirection`: one sentence, how this becomes a hero.
     - `sectionIdeas[]`: section jobs it inspires (map to the pattern bank).
     - `motionForWeb[]`: motion to REBUILD with ONIA tokens, each with a
       reduced-motion note.
     - `assetsToRequestOrReuse[]`: for the **client** lane, which of the client's
       OWN clips/photos could become hero/proof assets (mark "confirm rights").
       For the **trend** lane, keep this "study only — do not reuse footage".
     - `copyAngles[]`: copy directions taken from the brand's real voice.
   - `guardrails[]`, `confidence`.
4. Write the object to the reel's `analysisPath` (pretty JSON).
5. When all ready reels are analyzed, run:
   - trend: `pnpm reels:intelligence`
   - client: `pnpm reels:intelligence:client -- --slug <slug>`

## Boundary (non-negotiable)

- **Trend reels are inspiration only.** Never reuse their footage, audio, music,
  copy, logos or on-screen assets in client work. Rebuild motion and kinetic type
  with ONIA tokens. This mirrors `WEB_FACTORY_REFERENCE_CAPTURE_RUNBOOK.md`.
- **Client reels**: the client owns their footage, so their real clips/photos may
  become client assets — but only after the client confirms rights, and never to
  fabricate proof (no fake before/after, no fake testimonials).
- Estimate palettes and text from the frames; do not claim exact brand hex codes
  as official unless the client provides them.

## Optional: deeper video read

For a stronger motion/pacing/virality read on a specific reel, the Higgsfield
video-analysis MCP (`video_analysis_create`) can analyze the uploaded `.mp4`.
Use it as an add-on signal; it costs credits, so reserve it for finalist reels.
