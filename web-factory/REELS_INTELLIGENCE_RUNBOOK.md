# Web Factory Reels Intelligence Runbook

Purpose: turn Instagram/TikTok **reels** into repeatable web-design decisions —
without turning third-party video into copied client work.

The website harvester (`harvester/vision/`) learns from web galleries. This adds a
second modality: short video, where 2026 motion/visual trends live, and where most
ONIA prospects already have a brand (IG) but no site yet.

## Two lanes

| Lane | Question it answers | Feeds |
|---|---|---|
| **trend** | "What visual/motion language is winning in this rubro right now?" | `WEB_FACTORY_PATTERN_BANK_2026.md` taste + `reels-intelligence.json` |
| **client** | "What is this client's REAL brand — palette, footage, voice?" | `data/clients/<slug>.reels.json` + `<slug>.design.json` references |

Same schema (`harvester/reels/schema.ts`), same steps, different drop folder.

## Ingest is manual by design

Instagram blocks automated scraping (login walls / 403). You download the reels
and drop them in an inbox. Robust, legal, no fragile infra.

- **ffmpeg present** → keyframes + a contact sheet are auto-extracted.
- **ffmpeg absent** → drop a few screenshots next to the video, or a folder of
  screenshots; the pipeline still runs.

ffmpeg is optional. To enable auto-extract, install any of:

```powershell
winget install Gyan.FFmpeg
choco install ffmpeg
scoop install ffmpeg
# or self-contained in the repo:
pnpm add -D ffmpeg-static
# or point at an existing binary:
$env:FFMPEG_PATH = "C:/path/to/ffmpeg.exe"
```

## Trend lane

1. Drop reels in `data/references/reels/inbox/` (see its README for the two drop
   formats).
2. Build the manifest and keyframes:

   ```powershell
   cd C:\dev\proyectos\HERMES\onia-hermes\web-factory
   pnpm reels:prepare
   ```

   Output: `data/references/reels/reels-manifest.json`.
3. Vision pass (Claude side): for each reel `status: ready-to-analyze`, follow
   `harvester/reels/ANALYZE.md` — read the frames + caption, fill the schema,
   write `data/references/reels/analyses/<id>.json`.
4. Compile:

   ```powershell
   pnpm reels:intelligence
   ```

   Output: `data/references/reels/reels-intelligence.json` and
   `docs/WEB_FACTORY_REELS_INTELLIGENCE_LATEST.md` (palette families, motion
   techniques, hooks, shots, moods and section ideas, grouped by rubro).
5. Use it: when designing a site, read the rubro block and pick 3-6 reel ideas
   (one palette, one type/motion, one hook, one product-presentation). Rebuild
   them with ONIA tokens; add reduced-motion fallbacks.

## Client lane

The intake already stores the client's Instagram (`data/intake-schema.ts` →
`social.instagram`). Use their handle to grab a few of their best reels.

1. Drop the client's reels in `data/clients/<slug>.reels/inbox/`.
2. Prepare and compile:

   ```powershell
   pnpm reels:prepare:client -- --slug <slug>
   # analyze each ready reel per harvester/reels/ANALYZE.md
   pnpm reels:intelligence:client -- --slug <slug>
   ```

   Output: `data/clients/<slug>.reels.json` + `.reels.md`.
3. Fold into the design recipe: copy the strongest palette, the reusable
   real-footage list and the copy angles into `data/clients/<slug>.design.json`
   references, then run `pnpm design:auto -- <slug> --template <t>`.

## Legal and professional boundary

Same rule as `WEB_FACTORY_REFERENCE_CAPTURE_RUNBOOK.md`.

Allowed:

- Downloading a reel for internal analysis; storing frames, caption text, source
  URL and extracted signals.
- Rebuilding a motion/type/section idea with ONIA tokens.
- Reusing a **client's own** footage/photos as their site assets — after the
  client confirms rights.

Not allowed:

- Reusing a trend reel's footage, audio, music, copy, logos or on-screen assets in
  any client site.
- Fabricating proof (fake before/after, fake testimonials, fake results).
- Claiming an estimated palette as an official brand hex without client confirmation.

## Artifacts

| Artifact | Path |
|---|---|
| Trend drop zone | `data/references/reels/inbox/` |
| Trend manifest | `data/references/reels/reels-manifest.json` |
| Trend analyses | `data/references/reels/analyses/<id>.json` |
| Trend intelligence | `data/references/reels/reels-intelligence.json` + `docs/WEB_FACTORY_REELS_INTELLIGENCE_LATEST.md` |
| Client drop zone | `data/clients/<slug>.reels/inbox/` |
| Client manifest | `data/clients/<slug>.reels.manifest.json` |
| Client intelligence | `data/clients/<slug>.reels.json` + `.reels.md` |

Heavy video/frames stay local; the JSON stores paths + a video SHA-256, mirroring
the reference-capture discipline. Do not commit large binaries.
