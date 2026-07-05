# ONIA - Automatizaciones n8n en vivo (2026-07-04)

Workflows autónomos corriendo en el n8n del VPS
(`https://n8n-sergio-n8n.hqdqgh.easypanel.host`), creados/gestionados por el **MCP
de n8n** (no por el navegador — la sesión web expira y da "Autosave failed:
Unauthorized"; el MCP tiene su propia auth). Todos usan la credencial SSH
`ONIA VPS SSH` (id `4XKauEX3b6cqaDhW`, sshPrivateKey) para llegar al VPS y avisan
a Sergio por Telegram vía `$env.TELEGRAM_BOT_TOKEN` / `$env.TELEGRAM_SERGIO_CHAT_ID`.

## Workflows activos

| Workflow | id n8n | Cron (La Paz) | Qué hace | Telegram |
|---|---|---|---|---|
| ONIA - Web Factory VPS Radar | `aHFLqEtzqvq6SE3e` | Lun-Sab 07:10 | Corre el worker `--mode daily` en `/opt/onia-hermes/web-factory` (harvest referencias + intelligence + chequeo precios Nuvia) | OK/FALLO diario |
| ONIA - VPS Healthcheck | `VaX3lx0zibnNbg57` | Cada 2h (`0 */2 * * *`) | `/opt/onia/vps-healthcheck.sh`: contenedores críticos + disco + RAM | Solo si hay problema |
| ONIA - Backup diario | `gN7pQld6Lh3qAcTS` | Diario 03:00 | `/opt/onia/vps-backup.sh`: dump Supabase DentalGest + export workflows/credenciales n8n → `/opt/onia/backups` (rotación 7 días) | OK con tamaños / FALLO |
| ONIA - Web Factory QA | `GFeCZKr1zQT6CVN8` | Diario 08:00 | `/opt/onia/web-factory-qa.sh`: regenera los 6 demos y valida el HTML (roto/vacío/template sin renderizar) | Solo si un template se rompió |
| ONIA - Prospeccion diaria | `jspfoUsjQfQ1VXY4` | Lun-Vie 09:00 | Nudge: rota rubro+ciudad y manda el prompt de prospección (no contacta, no inventa) | Diario |

Los 5 fueron probados end-to-end antes de activar (ejecución real + Telegram
recibido).

## Scripts de ops (en el VPS bajo /opt/onia/)

Fuente en este repo: `hermes-content/deploy/vps-ops/`. Se despliegan al VPS a
`/opt/onia/` (hoy subidos a mano vía SSH; falta automatizar el deploy de estos
scripts como parte del pipeline).

- `vps-healthcheck.sh` — emite JSON `{ok,disk,mem,problems}`.
- `vps-backup.sh` — emite JSON con tamaños; rotación 7 días.
- `web-factory-qa.sh` — regenera demos + valida HTML; emite JSON `{ok,checked,broken}`.

## Pendientes / upgrades

- **Backup off-site**: hoy la copia vive en el mismo VPS. Falta subir a Cloudflare
  R2 (crear bucket + API token) para resistir caída total del server. Agregar el
  upload al final de `vps-backup.sh`.
- **Prospección auto**: la v1 es un nudge. Para auto-buscar prospectos reales hace
  falta una fuente (Google Places API o Tavily) — sin eso no se puede sin fabricar.
- **QA visual real**: hoy es validación estructural del HTML. Playwright + chromium
  están instalados en el VPS (`/root/.cache/ms-playwright`), así que se puede
  subir a screenshots + regresión visual como v2.
- **Fuentes de verdad**: los workflows viven en n8n (respaldados por el backup
  diario). Las copias `.workflow.js` en `hermes-content/deploy/n8n/workflows/` son
  para versionado; recrear con el MCP `create_workflow_from_code`.
- **Rotar llave SSH** `onia_hermes_vps_ed25519`: se pegó en un chat, conviene
  rotarla (nueva llave → `authorized_keys` en VPS → actualizar credencial n8n →
  revocar vieja).
