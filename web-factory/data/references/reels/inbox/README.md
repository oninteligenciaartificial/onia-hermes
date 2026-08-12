# Trend reels — drop zone

Drop reels here that you want the factory to learn from (trend/idea lane). These
are **inspiration only** — never reused as client assets.

## How to drop a reel

Download the reel by hand, then add it here as either:

**A) Video + caption (preferred)**

```
inbox/
  glow-routine-glowlab.mp4
  glow-routine-glowlab.txt      # the caption text (optional but useful)
```

Or use a JSON sidecar to also record the source and rubro:

```
inbox/glow-routine-glowlab.json
{
  "caption": "Glow en 15s...",
  "url": "https://www.instagram.com/reel/XXXX/",
  "handle": "@glowlab",
  "rubro": "beauty"
}
```

**B) Screenshots only (no ffmpeg needed)**

A subfolder of frames + optional `caption.txt`:

```
inbox/
  brasa-parrilla/
    01.jpg
    02.jpg
    03.jpg
    caption.txt
```

## Then

```
pnpm reels:prepare          # builds ../reels-manifest.json (+ keyframes if ffmpeg)
# analyze each ready reel per harvester/reels/ANALYZE.md
pnpm reels:intelligence     # builds ../reels-intelligence.json + docs markdown
```

Tip: name files with the rubro so the bank groups well
(`beauty-*`, `resto-*`, `agency-*`). Set `rubro` in the JSON sidecar to be exact.
