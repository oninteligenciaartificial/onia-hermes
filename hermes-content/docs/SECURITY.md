# Hermes Security

## Secret handling
- Never print full tokens, passwords or API keys.
- Never paste secrets in chat.
- Never paste full tokens into Markdown files.
- Store secrets in `/root/.hermes/.env`.
- Verify secret presence by checking key names or string length, not value.

## Secrets to rotate after setup
- VPS root password.
- Meta Page Access Token used by Instagram publishing.
- Notion token.
- OpenAI API key if it was pasted anywhere unsafe.
- n8n MCP token if it was pasted in chat, screenshots, terminal history or
  shared logs.

## Safe checks

```bash
grep -E '^(META_LONG_LIVED_TOKEN|IG_BUSINESS_ACCOUNT_ID|OPENAI_API_KEY|NOTION_TOKEN)=' /root/.hermes/.env | sed 's/=.*/=<set>/'
```

Minimal Instagram check:

```bash
grep -E '^(META_LONG_LIVED_TOKEN|IG_BUSINESS_ACCOUNT_ID)=' /root/.hermes/.env | sed 's/=.*/=<set>/'
```

## Token expiry
Meta tokens can expire. If `ig-publish healthcheck` reports invalid token,
regenerate a Page Access Token and redeploy `deploy:instagram`.

Interpret `ig-publish healthcheck` for Instagram:
- `debug_token.data.type` must be `PAGE`.
- `debug_token.data.is_valid` must be `true`.
- `debug_token.data.profile_id` should be `1140384625819526`.
- If `expires_at` exists and is not `0`, schedule rotation before that date.
- If Meta Access Token Debugger says `Expires: Never`, that is ideal.

The local and VPS variable name is still `META_LONG_LIVED_TOKEN`, but it should
contain the Page Access Token returned by the Page response, not a user token.

To get the Page Access Token, use the long-lived user token in Graph API
Explorer and request:

```text
/1140384625819526?fields=name,id,access_token,instagram_business_account{id,username}
```

Then deploy from Windows:

```powershell
cd C:\dev\Expermimentos\Hermes
$env:VPS_HOST="187.77.16.63"
$env:VPS_USER="root"
$env:VPS_PASSWORD="<VPS_PASSWORD>"
$env:IG_BUSINESS_ACCOUNT_ID="17841423363059652"
$env:META_LONG_LIVED_TOKEN="<PAGE_ACCESS_TOKEN>"
npm run deploy:instagram
```

Do not automate Instagram DMs from this token. Instagram Graph API publishing
is for approved publishing flows; prospecting/contact actions must remain
manual or explicitly approved.

## Cross-platform social credentials

Store only in:

```text
/root/.hermes/.env
```

Expected keys:

```text
TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=
TIKTOK_ACCESS_TOKEN=
TIKTOK_REFRESH_TOKEN=
TIKTOK_OPEN_ID=
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
YOUTUBE_REFRESH_TOKEN=
YOUTUBE_CHANNEL_ID=
LINKEDIN_ACCESS_TOKEN=
LINKEDIN_AUTHOR_URN=
LINKEDIN_VERSION=202605
```

## n8n MCP token

For Codex MCP access, the local config may contain an HTTP Authorization header
for `n8n-mcp` in:

```text
C:\Users\HP I5 13va\.codex\config.toml
```

Rules:

- Do not copy the full token into Hermes docs.
- Do not screenshot the config if the token is visible.
- Rotate the token from n8n Settings > Instance-level MCP > Connection details
  if it was exposed.
- After rotating, update Codex config and restart Codex.
- Validate with `npm run health:n8n-mcp`.

Verify presence without printing values:

```bash
social-publish healthcheck
```

Publishing commands must never run with `--execute` unless Sergio approved the
exact platform and job.

## n8n workflow secrets

Rules:

- Do not paste API keys, bearer tokens, Supabase keys, Resend keys or internal
  app API keys directly inside HTTP Request nodes.
- Use n8n credentials, environment variables or a secrets manager.
- If a workflow detail/export shows a full secret, rotate that secret.
- Do not share n8n workflow screenshots if headers or credential fields are
  visible.

Audit 2026-06-05:

- Some DentalGest workflows contain HTTP headers with secrets stored as plain
  node parameters.
- Treat those values as exposed to anyone with workflow read/export access.
- Migrate them to n8n credentials or env vars before wider team access.
- Rotate exposed service keys after migration.
