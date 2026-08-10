# harvester/reels

Turn Instagram/TikTok **reels** into web-design decisions for the ONIA Web Factory.

The existing `harvester/vision/` learns from **websites**. This module learns from
**short video**, where 2026 visual/motion trends actually live — and where most
ONIA prospects already have a brand (IG) but no website.

Two lanes, one schema (`schema.ts`):

- **trend** — mine top reels by rubro to grow the pattern bank's taste.
- **client** — read a client's OWN reels to extract their real palette, footage
  and voice, so their site ships with real assets instead of fabricated proof.

## Pieces

| File | Role |
|---|---|
| `schema.ts` | Contract for one reel analysis (+ `REEL_ANALYSIS_TEMPLATE`, `parseReelAnalysis`). |
| `ffmpeg.mjs` | Resolves an ffmpeg binary (env / `ffmpeg-static` / PATH / common Windows spots). Optional. |
| `prepare.mjs` | Scans a drop folder → hashes video, extracts keyframes (or registers manual frames), reads caption → **manifest**. Pure Node, zero deps. |
| `build-reels-intelligence.mjs` | Aggregates the per-reel analyses → **reels intelligence** JSON + markdown, grouped by rubro. |
| `ANALYZE.md` | The Claude-side vision pass: manifest → per-reel analysis JSON. |
| `model-schema.ts` | Contract for a **web-model** — the generation-ready blueprint of a web page shown in a reel. |
| `ACQUIRE.md` | The Claude-side acquire pass: watch the video's web-page segments → `showcasedSite` → web-model blueprint. |
| `build-web-models.mjs` | Aggregates the blueprints → **learned-models catalog** + block library (what `packages/blocks` needs). |

## Flow

```
drop .mp4 + caption  ->  prepare.mjs  ->  manifest (+ keyframes)
                                            |
                              ANALYZE.md (Claude watches frames)
                                            |
                              analyses/<id>.json (showcasedSite = the web page shown)
                                            |
                              ANALYZE ---> build-reels-intelligence.mjs -> reels intelligence -> pattern bank
                                            |
                              ACQUIRE.md (Claude maps the shown site to factory blocks/tokens)
                                            |
                              models/<id>.json  ->  build-web-models.mjs
                                            |
                    LEARNED MODELS catalog  ->  design:auto / generate a matching client site
```

## Ingest is manual by design

Instagram blocks automated scraping (login walls, 403). You download the reels you
want and drop them in the inbox — robust, legal, no fragile infra. ffmpeg is
optional: with it, keyframes are auto-extracted; without it, drop a few
screenshots next to the video (or a folder of screenshots) and the pipeline still
runs. See `../../REELS_INTELLIGENCE_RUNBOOK.md`.

## Boundary

Same rule as `WEB_FACTORY_REFERENCE_CAPTURE_RUNBOOK.md`: trend reels are
inspiration only — never reuse their footage, audio, music, copy or logos.
Client-owned footage may be reused only after the client confirms rights, and
never to fabricate proof.
