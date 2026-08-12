# Trend reel analyses

One `<reel-id>.json` per analyzed reel, shaped by `harvester/reels/schema.ts`.

These are written by the Claude-side vision pass (`harvester/reels/ANALYZE.md`)
from the frames in the manifest, then aggregated by `pnpm reels:intelligence`
into `../reels-intelligence.json` and `docs/WEB_FACTORY_REELS_INTELLIGENCE_LATEST.md`.

Do not hand-edit the aggregated intelligence; edit the per-reel analyses and
re-run the build.
