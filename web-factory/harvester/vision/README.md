# Vision Harvester Stub

This folder is intentionally a stub.

Reference-to-code work is run from the Claude side with stitch MCP or an image-to-code
skill, then reviewed before being copied into `packages/blocks/`.

Rules:

- Do not scrape Pinterest or copy a layout literally.
- Use screenshots only as structural references.
- Retokenize all colors to `packages/tokens` CSS variables before a block ships.
- Keep generated blocks in review until a human approves client-facing use.
