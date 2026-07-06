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
| ONIA - Generar Propuesta (oficial) | `rwQuwSvd29bV34EY` | Webhook on-demand | `POST /webhook/generar-propuesta` `{slug,secret}`: corre el generador oficial + PDF (chromium VPS) por SSH y manda el PDF a Sergio para revisar antes de enviar al cliente | PDF por propuesta |
| ONIA - Agente Vendedor (borradores) | `C96NmbalLhaTEf0G` | Lun-Sab 08:30 | SSH `docker exec onia-center sales-agent.mjs`: lee leads del CRM, califica+redacta con LiteLLM, deja SOLO borradores (tarea + review_queue pending/sensitive/reviewer=sergio). NO envia | Solo si hay borradores |
| ONIA - Nuevo Lead (speed-to-lead) | `WA6VkNu5OHo6Npem` | Webhook on-demand | `POST /webhook/nuevo-lead` `{secret,company,contact,channel,message}`: crea el lead + califica + redacta la primera respuesta (borrador) al toque. Bridge inbound (formulario/WhatsApp/Hermes) -> CRM -> Vendedor. NO envia | Por lead |
| ONIA - Nuvia Sourcing Score (v1) | `ECC1THa2kTmOGepY` | Webhook on-demand | `POST /webhook/nuvia-candidato` `{secret,candidates[]}`: score ONIA-Bolivia (flete/arancel/demanda/precio) por SSH, upsert en `nuvia_sourcing_candidates`. Read-only, sin contacto ni pago | Por lote |
| ONIA - Reporte diario Sergio + Arthur | `xQaO3Sfsl9XzMiid` | Lun-Sab 07:00 | SSH `arthur-report.mjs`: tareas del dia para Sergio y Arthur (obligaciones acuerdo 60d + CRM vivo) + verificacion de ganancias de Arthur (payment_commissions por estado + progreso trial). Determinista, solo suma lo registrado | Diario |

Los 5 crones fueron probados end-to-end antes de activar (ejecución real + Telegram
recibido). El de propuestas (webhook) se probó con slug real (`bench`), secret
inválido (401) e inyección de slug (401) — 3/3 ejecuciones OK.

## Auditoría de autonomía + limpieza (2026-07-05, sesión infra)

- **Autonomía:** escaneado el export completo de workflows. **Todos los workflows
  ACTIVOS son autónomos** — no dependen del laptop de Sergio. El briefing usa
  `http://onia-center:3012` (docker-interno, siempre-on), no localhost. Las únicas
  dependencias locales (`127.0.0.1:3031` propuestas viejo, `SearXNG`) vivían en
  workflows **inactivos**.
- **Propuestas:** el pipeline viejo (`FGqyNTrQfMIFiVG2`) apuntaba a `127.0.0.1:3031`
  (inalcanzable desde el contenedor n8n) y usaba un generador ad-hoc. Reemplazado
  por `ONIA - Generar Propuesta (oficial)` (arriba), que corre el generador oficial
  `hermes-content/propuestas/generador` por SSH. Wrapper VPS:
  `/opt/onia/generar-propuesta-pdf.sh` (fuente en `hermes-content/deploy/vps-ops/`;
  el generador imprime PDF solo en Windows, así que el wrapper hace el PDF con el
  chromium del VPS). Export SDK: `hermes-content/deploy/n8n/workflows/onia-generar-propuesta.workflow.js`.
- **Limpieza (archivados, reversibles con Unarchive):** `rGvQb4CRBdJPwrp1`
  (Prospección Diaria vieja, superada por la v1 activa), `VeCHKr6wkK5Wet25`
  (Scheduled Operations Pack, SSH roto), `FGqyNTrQfMIFiVG2` (pipeline propuestas
  viejo). **NO tocados:** los 3 GestiOS de estructura rota (producto, otro repo) y
  `zediOCdtlP1zpImK` Mara Daily Content (carril contenido).
- **Residual:** `iqsnnQXlJyypiew8` (draft roto de Web Factory Radar) tiene
  `availableInMCP:false` → no se puede archivar por MCP; queda para archivar por la
  UI de n8n (como los UDIA). Inactivo, sin trigger, cero impacto.
- **Prospección auto-búsqueda:** la v1 (nudge) es autónoma; el upgrade a
  auto-búsqueda real sigue **bloqueado por credencial** (Tavily/Google Places — S7).

## Agentes con LLM (2026-07-05) — patrón n8n → SSH → docker exec onia-center

n8n NO alcanza LiteLLM ni la DB onia_center por red (redes docker aisladas). El
patrón que SÍ funciona: n8n → SSH al host → `docker exec onia-center node <script>`
(onia-center tiene la key de Supabase en su env y está en la red de LiteLLM). La
master key de LiteLLM se lee de su contenedor y se inyecta. Scripts en
`hermes-content/deploy/vps-ops/` → desplegados a `/opt/onia/`.

- **Agente Vendedor** (`C96NmbalLhaTEf0G`): `sales-agent.mjs` + `sales-agent-run.sh`.
  Modelo LiteLLM `gpt-4o-mini`. Dedupe por review_queue pendiente (no re-procesa).
  Dry-run: `SALES_AGENT_DRY_RUN=true SALES_AGENT_TEST_LEAD='{...}' bash /opt/onia/sales-agent-run.sh`.
  CRM tiene 0 leads hoy → produce borradores recién cuando entren leads.
- **Nuvia Sourcing** (`ECC1THa2kTmOGepY`): `nuvia-score.mjs` + `nuvia-score-run.sh`.
  Score determinista (sin LLM, sin gastar). Tabla `onia_center.nuvia_sourcing_candidates`
  (migración `supabase/migrations/20260705_nuvia_sourcing_candidates.sql`, aplicada en
  el contenedor `supabase-db`; el schema onia_center vive ahí, NO en dentalgest-staging).
  Params tunables: `NUVIA_FREIGHT_USD_PER_KG`, mapa de aranceles por rubro en el script.
- **Nuvia scraping pesado (browser-use/Skyvern): NO instalado.** VPS con ~2.2GB libres
  (9GB usados en ~25 contenedores prod) → Chrome headless dedicado arriesga OOM en prod.
  **Falta un VPS worker dedicado** para el sourcing autónomo; hoy el webhook recibe
  candidatos (de Hermes/manual/otra fuente) y los scorea. Ver research doc
  `hermes-content/docs/research/ONIA_RESEARCH_AGENTE_IMPORTACION_NUVIA_20260705.md`.

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
