# Hermes VPS Tools for Onia

This repo contains deployment helpers and operating docs for the Onia Hermes agent running on the VPS at `187.77.16.63`.

## Current state
- Hermes lives on the VPS and is used from Telegram.
- Hermes dashboard is expected on the VPS at `localhost:9119` via SSH tunnel.
- Instagram Graph API is configured and validated.
- `ig-publish healthcheck` returned `ok: true`.
- Local and VPS Instagram tokens validate as Meta `PAGE` tokens.
- n8n instance-level MCP is configured for Codex and validates with
  `npm run health:n8n-mcp`.
- A real Instagram carousel test was published with `published_id=18126144559620893`.
- Public asset hosting is available at `http://187.77.16.63:8099`.
- The asset server returns real image files from `/var/www/html/hermes-assets`.
- `carousel-generator` was validated on the VPS and returns structured JSON.

## Architecture
- **Telegram**: fast control channel for Hermes.
- **Hermes dashboard**: native Hermes UI, reached through an SSH tunnel.
- **VPS**: source of truth for scripts, docs, skills, env vars, and asset hosting.
- **Instagram Graph API**: publishing layer through `ig-publish`.
- **OpenAI**: content brief generation through `carousel-generator`.
- **Pinterest references**: inspiration notes only; do not copy third-party assets.
- **n8n**: scheduled orchestration and approval flows, not the main brain.

## Local commands
Run these from Windows PowerShell in this repo:

```powershell
cd C:\dev\Expermimentos\Hermes
```

Deploy Instagram publisher:
```powershell
npm run deploy:instagram
```

Deploy Hermes docs, skills, references, and carousel generator:
```powershell
npm run deploy:hermes-content
```

Prepare public asset hosting on the VPS:
```powershell
npm run setup:assets
```

Upload one image or video:
```powershell
$env:ASSET_FILE="C:\path\to\asset.jpg"
npm run upload:asset
```

Rotate Notion token on the VPS:
```powershell
$env:NOTION_TOKEN_NEW="new-token"
npm run rotate:notion
```

Validate n8n MCP:

```powershell
$env:N8N_MCP_URL=[Environment]::GetEnvironmentVariable("N8N_MCP_URL","User")
$env:N8N_MCP_TOKEN=[Environment]::GetEnvironmentVariable("N8N_MCP_TOKEN","User")
npm run health:n8n-mcp
```

## Quick carousel flow
1. Generate or choose 2 to 10 original images.
2. Upload each image with `npm run upload:asset`.
3. Copy the printed public URLs.
4. SSH into the VPS.
5. Publish:

```bash
ig-publish carousel_publish --image-urls "URL_1,URL_2" --caption "Caption"
```

Generate the content brief first:

```bash
carousel-generator --topic "IA para clinicas dentales" --objective "generar leads" --audience "clinicas dentales en Bolivia" --slides 3
```

## Dashboard
Open an SSH tunnel:

```powershell
ssh -L 9119:localhost:9119 root@187.77.16.63
```

Then open:

```text
http://localhost:9119
```

## Security
Secrets were pasted during setup. Rotate them after validation:
- VPS root password.
- Meta long-lived token.
- Notion token.
- Any OpenAI key shared outside a secure shell or env var.

Do not paste tokens in chat. Use environment variables in PowerShell or store secrets directly in `/root/.hermes/.env` on the VPS.
