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
