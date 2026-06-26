# ONIA Self-hosted Stack Deploy Kit

This kit is the VPS-side control layer for ONIA/Hermes self-hosted services.
It is intentionally private-first: every port binds to `127.0.0.1` until DNS,
auth and rollback are confirmed.

## Profiles

| Profile | Starts | Use now? | Notes |
|---|---|---|---|
| `audit` | Nothing | Yes | Read-only VPS inventory. |
| `monitor` | Uptime Kuma | Yes | First safe production service. |
| `utility` | Uptime Kuma + Stirling PDF | Yes after monitor | Internal PDF tool with login. |
| `ai` | LiteLLM + Open WebUI | Yes only with `OPENAI_API_KEY` | Requires `/root/.hermes/.env` and enough RAM. |
| `research` | Crawl4AI | Conditional | Heavy browser workload; keep private. |
| `mail` | Mailpit + Listmonk | Prepare only | Email QA and campaign UI; no production SMTP until DNS/reputation are ready. |
| `meeting-lite` | Speakr + Speaches CPU | Recommended first | Private meeting/audio intake, browser recording, uploads and local STT API. Needs text model key and about 8 GB RAM. |
| `meeting-gpu` | Speakr + WhisperX ASR | Best quality, separate worker preferred | Speaker diarization and voice profile support. Needs NVIDIA GPU, HF token and about 16 GB RAM. |
| `all-safe` | Monitor + utility + conditional AI/research | Conditional | Skips heavy profiles if env/resources are missing. |
| `prepare-dify` | Downloads Dify only | Later | Does not start Dify because official compose can bind 80/443. |
| `prepare-firecrawl` | Downloads Firecrawl only | Later/maintenance window | Does not start Firecrawl; browser/API defaults are heavy and must stay private. |

## Local commands

From the repo:

```powershell
$env:VPS_HOST="187.77.16.63"
$env:VPS_USER="root"
# Set VPS_KEY_PATH or VPS_PASSWORD only in the current shell.
npm run audit:selfhosted
npm run deploy:selfhosted -- --profile monitor
npm run deploy:selfhosted -- --profile meeting-lite
```

Do not commit `.env`. The deploy script uploads this folder to
`/opt/onia-selfhosted` and runs `install.sh` on the VPS.

## Remote paths

```text
/opt/onia-selfhosted
/opt/onia-selfhosted/.env
/root/.hermes/.env
```

Secrets stay in `/root/.hermes/.env` or the generated remote `.env`; never in
the repository.

## First public access pattern

Start with SSH tunnels:

```powershell
ssh -L 3101:127.0.0.1:3101 root@187.77.16.63
ssh -L 3102:127.0.0.1:3102 root@187.77.16.63
ssh -L 3103:127.0.0.1:3103 root@187.77.16.63
ssh -L 3104:127.0.0.1:3104 -L 3105:127.0.0.1:3105 root@187.77.16.63
ssh -L 3107:127.0.0.1:3107 -L 3108:127.0.0.1:3108 root@187.77.16.63
ssh -L 3109:127.0.0.1:3109 root@187.77.16.63
```

Only after validation should a service receive a domain in Easypanel/Traefik.

## Validation

On the VPS:

```bash
cd /opt/onia-selfhosted
./install.sh audit
docker compose --profile monitor ps
curl -fsS http://127.0.0.1:3101 || true
curl -fsS http://127.0.0.1:4000/health/liveliness || true
curl -fsS http://127.0.0.1:11235/health || true
curl -fsS http://127.0.0.1:3106/serverHealthCheck || true
curl -fsS http://127.0.0.1:3107 || true
curl -fsS http://127.0.0.1:3108/health || true
curl -fsS http://127.0.0.1:3109/health || true
```

## Mail rule

The `mail` profile is for private testing and preparation:

- Mailpit web UI: `127.0.0.1:3104`
- Mailpit SMTP capture: `127.0.0.1:3025`
- Listmonk: `127.0.0.1:3105`

Do not configure production SMTP inside Listmonk until ONIA has a sending
domain, PTR/rDNS, SPF, DKIM, DMARC, bounce handling and unsubscribe policy.
If ONIA wants full self-hosted delivery, run Postal/Mailu/docker-mailserver on
a separate VPS/IP, not on the main control VPS.

## Dify rule

Dify is P1 commercially, but it is not safe to run the official compose on the
current VPS without checking resources and patching public ports. Its docs start
5 core services plus 6 dependencies. Use `prepare-dify` only after audit says
the VPS has enough RAM and disk.

## Firecrawl rule

Firecrawl is useful for ONIA research, web audits, lead enrichment and feeding
agents with clean site data. It must stay private because it includes crawling,
queue admin and browser automation.

Use:

```bash
cd /opt/onia-selfhosted
./install.sh prepare-firecrawl
```

The prepared instance is written to:

```text
/opt/onia-selfhosted/firecrawl/src
```

It is not started automatically. The generated `.env` binds the API to
`127.0.0.1:3106`, connects search to the existing SearXNG container through
`host.docker.internal:8080`, and limits concurrency. Start it only in a
maintenance window after checking `docker stats`, because upstream defaults are
heavy for both API and Playwright workers.

## Meeting intelligence rule

Use `meeting-lite` first for ONIA operations. It gives Speakr for recording,
uploading and reviewing meetings plus Speaches as the local OpenAI-compatible
STT endpoint for WhatsApp/Telegram/manual audio files.

Use:

```bash
cd /opt/onia-selfhosted
./install.sh meeting-lite
```

`meeting-lite` needs `TEXT_MODEL_API_KEY` in `/root/.hermes/.env`. If only
`OPENAI_API_KEY` exists, `install.sh` copies it into the generated remote
`.env` as `TEXT_MODEL_API_KEY` for Speakr.

Use `meeting-gpu` only on a GPU worker:

```bash
cd /opt/onia-selfhosted
./install.sh meeting-gpu
```

Before `meeting-gpu`, add `HF_TOKEN` to `/root/.hermes/.env` after accepting
the required pyannote model terms on Hugging Face. Do not run this on the
current crowded VPS unless audit confirms enough RAM, disk and GPU runtime.

Operational rule: record meetings only with consent. Keep these services bound
to localhost and access through SSH tunnel until auth, retention and client data
policy are reviewed.
