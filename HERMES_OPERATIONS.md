# Hermes Operations

## Windows PowerShell

Set common SSH env vars:

```powershell
$env:VPS_HOST="187.77.16.63"
$env:VPS_USER="root"
$env:VPS_PASSWORD="your-current-password"
```

Deploy Hermes content:

```powershell
cd C:\dev\Expermimentos\Hermes
npm run deploy:hermes-content
```

Deploy Instagram publisher:

```powershell
cd C:\dev\Expermimentos\Hermes
$env:META_LONG_LIVED_TOKEN="<PAGE_ACCESS_TOKEN>"
$env:IG_BUSINESS_ACCOUNT_ID="17841423363059652"
npm run deploy:instagram
```

`META_LONG_LIVED_TOKEN` is the current script variable name. For Instagram
publishing it must contain the Meta Page Access Token for `Onia Marketing`, not
the user token. This name is kept for compatibility with
`scripts/vps_install_instagram.js` and `scripts/ig_publisher.py`.

Upload an asset:

```powershell
$env:ASSET_FILE="C:\path\to\image.png"
npm run upload:asset
```

## VPS commands

```bash
ig-publish healthcheck
carousel-generator --topic "IA para clinicas dentales" --objective "generar leads" --audience "clinicas dentales en Bolivia" --slides 6
systemctl status hermes-assets --no-pager
curl -I http://187.77.16.63:8099/health.txt
hermes gateway status
journalctl --user -u hermes-gateway -n 100 --no-pager
docker ps
```

## Current Health Snapshot

Validated 2026-06-05:

- n8n MCP from Codex: OK, 27 tools exposed.
- `npm run health:n8n-mcp`: OK.
- Instagram local/VPS: OK, token type `PAGE`.
- Asset server: OK, `http://187.77.16.63:8099/`.
- n8n public URL: OK.
- Telegram bot token: OK, but current `TELEGRAM_CHAT_ID` is not a valid chat
  destination for Radar. Do not activate Radar until a real chat ID is captured.
- `Hermes Radar Diario Creativo y Clientes`: inactive until chat ID is set.
- `ONIA - Video Lab Telegram Router`: active, not modified during this audit.
- Hermes Gateway local: not running and no local scheduled jobs found.
- DentalGest Supabase/PostgREST `PGRST002`: fixed for Data API by setting
  `authenticator.pgrst.db_schemas=public,storage,graphql_public` and reloading
  PostgREST config/schema.
- `WF-02: QR Payment Alerts`: validated success after fix.
- Paused for safe client-facing review before reactivation:
  `WF-00`, `WF-03`, `WF-11`.
- `WF-09` still needs next scheduled/manual observation.

Validated 2026-06-04:

- Instagram local and VPS: OK.
- Meta token type: `PAGE`.
- Meta app: `2160241918102061`.
- Facebook Page: `1140384625819526`.
- Instagram Business Account: `17841423363059652`.
- Meta token `expires_at`: 2026-08-03 22:55 UTC.
- Meta token `data_access_expires_at`: 2026-09-02 22:55 UTC.
- OpenAI API: OK.
- Telegram bot: OK, `onia_video_lab_bot`.
- Asset server: OK, `http://187.77.16.63:8099/`.
- n8n public URL: OK.
- n8n MCP: OK by Node healthcheck, 27 tools exposed.
- Video Lab VPS: OK.
- Hermes Gateway local: can run manually; install as scheduled task only when
  Sergio explicitly approves.
- TikTok, YouTube and LinkedIn publishers: credentials pending.

No content was generated or published during this validation.

Validate n8n MCP from Windows:

```powershell
cd C:\dev\Expermimentos\Hermes
$env:N8N_MCP_URL=[Environment]::GetEnvironmentVariable("N8N_MCP_URL","User")
$env:N8N_MCP_TOKEN=[Environment]::GetEnvironmentVariable("N8N_MCP_TOKEN","User")
npm run health:n8n-mcp
```

Remote Instagram validation from Windows:

```powershell
ssh root@187.77.16.63 "ig-publish healthcheck"
```

Cross-platform publisher validation:

```powershell
ssh root@187.77.16.63 "social-publish healthcheck"
```

## Dashboard

From Windows:

```powershell
ssh -L 9119:localhost:9119 root@187.77.16.63
```

Open:

```text
http://localhost:9119
```

If the dashboard does not load:
- Check `hermes gateway status`.
- Check `journalctl --user -u hermes-gateway -n 100 --no-pager`.
- Confirm no local process is already using port `9119`.

## Where Sergio Responds

Use Telegram as the fast inbox for decisions. Hermes commands should return a
compact `telegram_reply` with the state, `job_id`, next action, hook and
caption summary.

Use the dashboard for deeper analysis, logs, batches and service status.

Useful Video Lab messages:

```text
Estado Video Lab
Siguiente Video Lab
Estado Video Lab <job_id>
Aprobar video <job_id>
Rehacer video <job_id>: <cambio>
Video generado <job_id>: <url_video>
Publicar video <job_id>
```

`Publicar video <job_id>` publishes through Instagram only for now.

## Cross-Platform Commands

Dry-run only:

```bash
social-publish tiktok_video_init --video-url "https://example.com/video.mp4" --description "caption"
social-publish linkedin_text_post --commentary "LinkedIn copy"
social-publish youtube_package --title "Short title" --description "Description" --tags "onia,saas"
```

Execute only after explicit platform approval and OAuth:

```bash
social-publish tiktok_video_init --video-url "https://example.com/video.mp4" --description "caption" --execute
social-publish linkedin_text_post --commentary "LinkedIn copy" --execute
```

YouTube upload execution is still pending. Hermes can prepare the package, but
not upload until OAuth and upload implementation are completed.

## Troubleshooting

### `ig-publish` is not recognized
Run it on the VPS, not on Windows.

### Graph API says token is invalid
Regenerate a Meta Page Access Token with:
- `pages_show_list`
- `pages_read_engagement`
- `instagram_basic`
- `instagram_content_publish`

Use the long-lived user token only to request the Page token:

```text
/1140384625819526?fields=name,id,access_token,instagram_business_account{id,username}
```

Then put the returned Page `access_token` in `META_LONG_LIVED_TOKEN` and
redeploy with `npm run deploy:instagram`.

If `ig-publish healthcheck` reports `type: PAGE` and `is_valid: true`, the
token works. If `expires_at` is present and not `0`, rotate before that date.

### Graph API cannot download media
The URL must be public, direct, and return the correct content type:
- image: `image/jpeg` or `image/png`
- video: valid downloadable `.mp4`

Verify:

```bash
curl -I "PUBLIC_URL"
```

### Asset URL returns HTML
Use the asset server on port `8099`, not the Easypanel/Traefik root:

```text
http://187.77.16.63:8099/file.png
```

### `carousel-generator` cannot find `OPENAI_API_KEY`
Set `OPENAI_API_KEY` in `/root/.hermes/.env` by running:

```powershell
$env:OPENAI_API_KEY="sk-..."
npm run deploy:hermes-content
```
