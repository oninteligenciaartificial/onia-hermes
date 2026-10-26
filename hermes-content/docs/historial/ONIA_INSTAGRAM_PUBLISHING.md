# Onia - Instagram Publishing (Hermes + VPS)

This repo contains SSH deploy scripts to install an Instagram Graph API publisher on your Hermes VPS.

## What gets installed on the VPS
- `/root/.hermes/scripts/ig_publisher.py` (stdlib-only)
- `/usr/local/bin/ig-publish` wrapper that sources `/root/.hermes/.env`

## Validated state
- `ig-publish healthcheck` returned `ok: true`.
- A real carousel was published with `published_id=18126144559620893`.
- Public asset hosting is active at `http://187.77.16.63:8099`.
- `ig-publish` runs on the VPS, not in Windows PowerShell.

## Local prerequisites
- Node.js installed (this machine)
- SSH access to the VPS

## Deploy Instagram publisher

Onia Meta IDs:

```text
META_APP_ID=2160241918102061
FB_PAGE_ID=1140384625819526
IG_BUSINESS_ACCOUNT_ID=17841423363059652
IG_USERNAME=oniahq
```

Token rules:
- A `User long-lived token` is only used to request the Page token. It can expire.
- A `Page Access Token` is the token Hermes uses in production.
- The token to paste into Hermes is the `access_token` returned by the Page response.
- The code still names the variable `META_LONG_LIVED_TOKEN`; keep that name for compatibility, but put the Page Access Token in it.

Set env vars (PowerShell example):
```powershell
cd C:\dev\Expermimentos\Hermes

$env:VPS_HOST="187.77.16.63"
$env:VPS_USER="root"
$env:VPS_PASSWORD="<VPS_PASSWORD>"

$env:META_APP_ID="2160241918102061"
$env:FB_PAGE_ID="1140384625819526"
$env:IG_BUSINESS_ACCOUNT_ID="17841423363059652"
$env:META_LONG_LIVED_TOKEN="<PAGE_ACCESS_TOKEN>"

npm run deploy:instagram
```

Get the Page Access Token with this Graph API Explorer request, using the
long-lived user token first:

```text
/1140384625819526?fields=name,id,access_token,instagram_business_account{id,username}
```

Copy the returned `access_token` from the Page response, not the user token.
The local deploy script currently expects that value in
`META_LONG_LIVED_TOKEN`.

Before deployment, verify the Page Access Token in Meta Access Token Debugger:

```text
Type: Page
Expires: Never
```

If the debugger shows `Type: Page` but an expiry date/time, the token can be
used temporarily, but it must be rotated before that expiry. Re-run the Page
request with the correct long-lived user token to obtain a better Page token.

Do not paste the real token into Markdown or chat. Store it only in a local
environment variable for deployment or in `/root/.hermes/.env` on the VPS.

## Validate on VPS
```bash
ig-publish healthcheck
ig-publish post_test --image-url "https://..." --caption "Hola"
ig-publish reel_publish --video-url "https://..." --caption "Hola"
ig-publish carousel_publish --image-urls "https://.../1.png,https://.../2.png" --caption "Hola"
```

Remote validation from Windows:

```powershell
ssh root@187.77.16.63 "ig-publish healthcheck"
```

Expected healthcheck:
- `ok: true`
- `debug_token.data.type: PAGE`
- `debug_token.data.is_valid: true`
- `debug_token.data.profile_id: 1140384625819526`

If `expires_at` exists and is not `0`, schedule a token rotation before that
date. `Expires: Never` in the Meta debugger is ideal.

## Instagram Description

When Sergio says "descripcion de IG", use the Instagram Graph API `caption`
field. In Hermes, the platform copy should be named:

```text
instagram_caption
```

The publisher receives it as:

```bash
ig-publish reel_publish --video-url "<public_mp4_url>" --caption "<instagram_caption>"
```

Default caption structure:

```text
[hook or belief shift]

[problem/context in 1-2 lines]

[mechanism/offer]

[single CTA]

[3-8 relevant hashtags]
```

Rules:

- The first line must stand alone.
- One CTA only.
- No invented results, medical guarantees, fake urgency or client private data.
- Sergio account: first person, practical, building in public.
- Onia account: educational, system-oriented, conversion-focused.
- Client accounts: approved claims and offer only.

## Prepare public assets hosting

Instagram needs public direct URLs for images/videos. Prepare the VPS folder:
```powershell
$env:VPS_HOST="187.77.16.63"
$env:VPS_USER="root"
$env:VPS_PASSWORD="..."
npm run setup:assets
```

Default public URL:
```text
http://187.77.16.63:8099/health.txt
```

If `onia.com.bo` points to this VPS with HTTPS, prefer:
```powershell
$env:HERMES_ASSETS_BASE_URL="https://onia.com.bo/hermes-assets"
```

## Upload an image or video

```powershell
$env:ASSET_FILE="C:\path\to\image-1.jpg"
npm run upload:asset
```

The command prints the public URL. Use two or more printed URLs for a carousel:
```bash
ig-publish carousel_publish --image-urls "URL_1,URL_2" --caption "Prueba carrusel desde Hermes"
```

Validated carousel test:
```text
published_id=18126144559620893
```

## Deploy Hermes docs, skills, references, and carousel generator

```powershell
$env:VPS_HOST="187.77.16.63"
$env:VPS_USER="root"
$env:VPS_PASSWORD="..."
$env:OPENAI_API_KEY="sk-..."

npm run deploy:hermes-content
```

This installs:
- `/root/.hermes/docs/ONIA.md`
- `/root/.hermes/docs/DASHBOARD.md`
- `/root/.hermes/skills/*.md`
- `/root/.hermes/references/pinterest.json`
- `/usr/local/bin/carousel-generator`

## Generate a carousel brief on VPS

```bash
carousel-generator --topic "IA para clinicas dentales" --objective "generar leads" --audience "clinicas dentales en Bolivia" --slides 6
```

Validated: `carousel-generator` returns structured JSON on the VPS.

## Hermes dashboard

```powershell
ssh -L 9119:localhost:9119 root@187.77.16.63
```

Then open:
```text
http://localhost:9119
```

## Rotate Notion token (update VPS env)
```powershell
$env:VPS_HOST="187.77.16.63"
$env:VPS_KEY_PATH="C:\path\to\id_rsa"
$env:NOTION_TOKEN_NEW="secret_..."
node .\scripts\vps_update_notion_token.js
```
