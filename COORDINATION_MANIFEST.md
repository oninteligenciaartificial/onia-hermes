# Hermes Coordination Manifest

## Purpose
This file prevents duplicate work while two Codex/Hermes sessions run at the same time.

Use this as the source of truth before creating new files, skills, docs, or scripts.

## Ownership split

### Session A: Instagram, assets, dashboard, publishing
This session owns:
- Instagram Graph API publishing.
- Public asset hosting on the VPS.
- Uploading assets to `http://187.77.16.63:8099`.
- Dashboard operations documentation.
- Security docs for tokens and VPS secrets.
- Core publishing scripts under `scripts/`.
- Video Lab operational scripts and docs for video publishing approvals.
- Telegram Command Center routing for Hermes/ONIA operations.
- Daily Hermes cron documentation for publishing/content operations.
- Weekly operating system documentation and cadence.

Canonical files:
- `AGENTS.md`
- `PRODUCT.md`
- `.agents/skills/impeccable/`
- `docs/ORCHESTRATOR.md`
- `README.md`
- `HERMES_OPERATIONS.md`
- `HERMES_CONTENT_WORKFLOW.md`
- `ONIA_INSTAGRAM_PUBLISHING.md`
- `STYLE_REFERENCE_SYSTEM.md`
- `REFERENCES_INBOX.md`
- `scripts/ig_publisher.py`
- `scripts/carousel_generator.py`
- `scripts/vps_install_instagram.js`
- `scripts/vps_install_hermes_content.js`
- `scripts/vps_install_control_tower.js`
- `scripts/vps_setup_assets.js`
- `scripts/vps_upload_asset.js`
- `scripts/video_lab.py`
- `scripts/hermes_command_center.py`
- `scripts/mara_motion_control_pipeline.ps1`
- `scripts/process_sergio_media.ps1`
- `scripts/process_sergio_talking_reference.ps1`
- `scripts/social_publisher.py`
- `scripts/hermes_week_status.py`
- `scripts/hermes_week_plan.py`
- `HERMES_VIDEO_LAB.md`
- `HERMES_TELEGRAM_COMMAND_CENTER.md`
- `HERMES_EXECUTION_PROTOCOL.md`
- `HERMES_DAILY_CRONS.md`
- `HERMES_WEEKLY_OPERATING_SYSTEM.md`
- `HIGGSFIELD_VIDEO_SYSTEM.md`
- `HIGGSFIELD_FULL_CAPABILITIES_MAP.md`
- `ELEVENLABS_AUDIO_SYSTEM.md`
- `JUNE_2026_VIDEO_PRODUCTION_PLAN.md`
- `DUAL_ACCOUNT_DAILY_VIDEO_CRON.md`
- `CLIENT_CONTENT_PRODUCTION_SYSTEM.md`
- `HIGGSFIELD_CLIENT_SALES_PLAYBOOK.md`
- `HIGGSFIELD_CONTENT_USE_CASES.md`
- `CROSS_PLATFORM_PUBLISHING.md`
- `ONIA_PRICING_2026.md`
- `ONIA_VENDOR_MANUAL_2026.md`
- `output/pdf/ONIA_VENDOR_MANUAL_2026.pdf`
- `ONIA_VENDOR_SALES_PLAYBOOK_2026.md`
- `ONIA_LEADS_PRIORITY_2026.md`
- `ONIA_BEST_MARKET_OPPORTUNITY_2026.md`
- `ONIA_PROJECTS_VENDOR_DECK_2026.html`
- `NOTION_VENDOR_CRM_SCHEMA_2026.md`
- `PROJECT_PRICE_UPDATE_PROMPTS_2026.md`
- `SALES_VENDOR_PRICING_DECK_2026.html`
- `PROJECTS_ORCHESTRATION.md`
- `ONIA_SALES_SPRINT.md`
- `FINANCE_LOG_2026.md`
- `ONIA_CONTEXT_INTAKE.md`
- `hermes-content/docs/ONIA.md`
- `hermes-content/docs/ORCHESTRATOR.md`
- `hermes-content/docs/DASHBOARD.md`
- `hermes-content/docs/OPERATIONS.md`
- `hermes-content/docs/CONTENT_WORKFLOW.md`
- `hermes-content/docs/SECURITY.md`
- `hermes-content/docs/VIDEO_LAB.md`
- `hermes-content/docs/TELEGRAM_COMMAND_CENTER.md`
- `hermes-content/docs/PERSONAL_BRAND_SERGIO.md`
- `hermes-content/docs/STORY_REFERENCES.md`
- `hermes-content/docs/STYLE_REFERENCES.md`
- `hermes-content/docs/EXECUTION_PROTOCOL.md`
- `hermes-content/docs/DAILY_CRONS.md`
- `hermes-content/docs/WEEKLY_OPERATING_SYSTEM.md`
- `hermes-content/docs/N8N_CANONICAL.md`
- `hermes-content/docs/PROJECTS_ORCHESTRATION.md`
- `hermes-content/docs/HIGGSFIELD_VIDEO_SYSTEM.md`
- `hermes-content/docs/HIGGSFIELD_CONTENT_USE_CASES.md`
- `hermes-content/docs/CROSS_PLATFORM_PUBLISHING.md`
- `hermes-content/docs/ONIA_PRICING_2026.md`
- `hermes-content/docs/ONIA_VENDOR_MANUAL_2026.md`
- `hermes-content/docs/ONIA_VENDOR_MANUAL_2026.pdf`
- `hermes-content/docs/ONIA_VENDOR_SALES_PLAYBOOK_2026.md`
- `hermes-content/docs/ONIA_LEADS_PRIORITY_2026.md`
- `hermes-content/docs/ONIA_PROJECTS_VENDOR_DECK_2026.html`
- `hermes-content/docs/NOTION_VENDOR_CRM_SCHEMA_2026.md`
- `hermes-content/docs/PROJECT_PRICE_UPDATE_PROMPTS_2026.md`
- `hermes-content/docs/SALES_VENDOR_PRICING_DECK_2026.html`
- `hermes-content/docs/ELEVENLABS_AUDIO_SYSTEM.md`
- `hermes-content/docs/VIRAL_VIDEO_PLAYBOOK.md`
- `hermes-content/docs/UGC_CLIENT_VIDEO_PLAYBOOK.md`
- `hermes-content/docs/CREATIVE_RADAR.md`
- `hermes-content/docs/ONIA_CREATOR_VIDEO_STRATEGY_2026.md`
- `hermes-content/docs/ONIA_ANIMATED_VIDEO_WORKFLOW.md`
- `hermes-content/docs/ONIA_CONSULTING_SERVICES_2026.md`
- `hermes-content/docs/ONIA_WHATSAPP_CHATWOOT_META_SALES_AUDIT_2026.md`
- `hermes-content/docs/SERGIO_FACE_VOICE_ASSET_GUIDE.md`
- `hermes-content/docs/SERGIO_ONIA_CONTENT_PRODUCTION_KIT_2026.md`
- `hermes-content/docs/AI_ECOMMERCE_MODEL_SYSTEM_2026.md`
- `hermes-content/docs/ONIA_OPEN_SOURCE_AI_VIDEO_LAB_2026.md`
- `hermes-content/references/video-brief-template.json`
- `hermes-content/references/telegram-command-center.json`
- `hermes-content/references/sergio-onia-content-kit-20260602.json`
- `hermes-content/references/sergio-ai-influencer-identity-system-20260606.json`
- `hermes-content/references/onia-projects-registry.json`
- `hermes-content/references/onia-vendor-pipeline-template.csv`
- `hermes-content/references/onia-commercial-campaigns.json`
- `hermes-content/references/onia-best-opportunity-matrix-20260605.json`
- `hermes-content/references/ai-ecommerce-model/README.md`
- `hermes-content/references/ai-ecommerce-model/20260605-mara-vale-round-01.md`
- `hermes-content/references/ai-ecommerce-model/20260605-mara-vale-contact-sheet-v1.png`
- `hermes-content/references/ai-ecommerce-model/20260605-redhead-freckles-round-02.md`
- `hermes-content/references/ai-ecommerce-model/20260605-redhead-freckles-ugc-v1.png`
- `hermes-content/references/ai-ecommerce-model/20260605-redhead-wavy-pale-curvy-round-03.md`
- `hermes-content/references/ai-ecommerce-model/20260605-redhead-wavy-pale-curvy-ugc-v1.png`
- `hermes-content/references/ai-ecommerce-model/20260605-redhead-balanced-round-04.md`
- `hermes-content/references/ai-ecommerce-model/20260605-redhead-balanced-ugc-v1.png`
- `hermes-content/references/ai-ecommerce-model/20260605-redhead-performance-round-05.md`
- `hermes-content/references/ai-ecommerce-model/20260605-redhead-performance-ugc-v1.png`
- `hermes-content/references/ai-ecommerce-model/20260605-higgsfield-redhead-performance-round-06.md`
- `hermes-content/references/ai-ecommerce-model/20260605-higgsfield-redhead-performance-v1.jpeg`
- `hermes-content/references/ai-ecommerce-model/20260605-higgsfield-product-hero-round-07.md`
- `hermes-content/references/ai-ecommerce-model/20260605-higgsfield-redhead-product-hero-4k-v1.png`
- `hermes-content/references/ai-ecommerce-model/20260605-higgsfield-sunscreen-resort-round-08.md`
- `hermes-content/references/ai-ecommerce-model/20260605-higgsfield-sunscreen-resort-4k-v1.png`
- `hermes-content/references/ai-ecommerce-model/20260605-higgsfield-sunscreen-resort-4k-v1-reference.jpg`
- `hermes-content/references/ai-ecommerce-model/20260605-higgsfield-luxury-identity-round-09.md`
- `hermes-content/references/ai-ecommerce-model/20260605-higgsfield-luxury-identity-contact-sheet-4k-v1.png`
- `hermes-content/references/ai-ecommerce-model/20260605-higgsfield-luxury-identity-contact-sheet-4k-v1-reference.jpg`
- `hermes-content/references/ai-ecommerce-model/20260605-higgsfield-identity-bank-50-video-round-10.md`
- `hermes-content/references/ai-ecommerce-model/20260605-seedance-skincare-video-round-11.md`
- `hermes-content/references/ai-ecommerce-model/20260605-kling-storytime-sports-collab-round-12.md`
- `hermes-content/references/ai-ecommerce-model/20260606-kling-bedroom-storytime-round-13.md`
- `hermes-content/references/ai-ecommerce-model/20260606-mara-word-perfect-lipsync-motion-workflow-round-14.md`
- `hermes-content/references/ai-ecommerce-model/20260606-mara-elevenv3-voice-round-15.md`
- `hermes-content/references/ai-ecommerce-model/20260606-mara-elevenv3-young-voice-round-16.md`
- `hermes-content/references/ai-ecommerce-model/20260606-mara-apartment-storytime-motion-ref-round-17.md`
- `hermes-content/references/ai-ecommerce-model/20260606-mara-motion-control-system-round-18.md`
- `hermes-content/references/ai-ecommerce-model/mara-motion-control-config-20260606.json`
- `hermes-content/references/ai-ecommerce-model/20260606-mara-full-body-motion-round-19.md`
- `hermes-content/references/ai-ecommerce-model/20260606-mara-motion-control-automation-round-20.md`
- `scripts/mara_prompt_matrix.js`
- `scripts/mara_comfyui_queue.js`
- `scripts/comfyui_upload_image.js`
- `scripts/comfyui_video_audit.js`
- `scripts/comfyui_wan_readiness.js`
- `hermes-content/docs/MARA_POND_VIDEO_LAB_DASHBOARD_2026.html`
- `hermes-content/docs/MARA_ISDIN_WAN_UGC_WORKFLOW_20260617.md`
- `hermes-content/docs/MARA_VIDEO_GENERATION_WORKFLOW_2026.md`
- `hermes-content/references/ai-ecommerce-model/mara-pond-video-lab-config-20260616.json`
- `hermes-content/references/ai-ecommerce-model/mara-isdin-wan-ugc-config-20260617.json`
- `hermes-content/references/ai-ecommerce-model/comfyui/mara-ltx23-mapping.example.json`
- `hermes-content/references/ai-ecommerce-model/comfyui/video_ltx2_3_i2v.mapping.json`
- `hermes-content/references/ai-ecommerce-model/comfyui/wan22_ti2v_5b_api.json`
- `hermes-content/references/ai-ecommerce-model/comfyui/wan22_ti2v_5b.mapping.json`
- `hermes-content/references/ai-ecommerce-model/mara-identity-20260616/`
- `hermes-content/references/ai-ecommerce-model/identity-bank-50/`
- `hermes-content/references/ai-ecommerce-model/video-ads/`
- `hermes-content/references/ugc-model-ltx23/20260615-analysis/`
- `hermes-content/references/higgsfield-content-use-cases.json`
- `hermes-content/references/social-caption-template.json`
- `hermes-content/references/style-references.json`
- `hermes-content/references/n8n-higgsfield-generation-flow.md`
- `hermes-content/references/n8n-radar-diario-creativo-clientes.md`
- `hermes-content/references/n8n-telegram-chat-id-capture.md`
- `hermes-content/references/creator-video-references/README.md`
- `hermes-content/references/creator-video-references/manifest.json`
- `hermes-content/references/creator-video-references/template.json`
- `hermes-content/references/creator-video-references/creator-video-ref-20260601-001.json`
- `hermes-content/references/creator-video-references/creator-video-ref-20260601-002.json`
- `hermes-content/references/creator-video-references/creator-video-ref-20260601-003.json`
- `hermes-content/references/creator-video-references/creator-video-ref-20260602-001.json`
- `hermes-content/references/creator-video-references/creator-video-ref-20260602-002.json`
- `hermes-content/references/creator-video-references/creator-video-ref-20260602-003.json`
- `hermes-content/references/creator-video-references/strategy-20260601-ai-creator-content.json`
- `hermes-content/references/creator-video-references/strategy-20260602-ai-video-reference-stack.json`
- `hermes-content/references/sergio-approved-media/README.md`
- `hermes-content/references/sergio-approved-media/manifest.json`
- `hermes-content/references/sergio-approved-media/intake-20260602-drive.md`
- `hermes-content/references/sergio-approved-media/sergio-face-voice-profile-20260602.md`
- `hermes-content/references/sergio-approved-media/avatar-realism-lab-20260604.json`
- `hermes-content/references/sergio-approved-media/talking-video-lock/README.md`
- `hermes-content/references/sergio-approved-media/talking-video-lock/higgsfield-source-video-photoshoot-prompt.txt`
- `hermes-content/references/sergio-approved-media/talking-video-lock/kling-source-video-animation-prompt.txt`
- `hermes-content/skills/instagram-publicacion.md`
- `hermes-content/skills/descripciones-sociales-onia.md`
- `hermes-content/skills/carruseles-onia.md`
- `hermes-content/skills/flujo-completo-carrusel.md`
- `hermes-content/skills/referencias-pinterest.md`
- `hermes-content/skills/seguridad-credenciales.md`
- `hermes-content/skills/operaciones-dashboard.md`
- `hermes-content/skills/orquestador-creativo-ia.md`
- `hermes-content/skills/video-lab-higgsfield.md`
- `hermes-content/skills/centro-comando-telegram.md`
- `hermes-content/skills/videos-virales-higgsfield.md`
- `hermes-content/skills/ugc-empresas-higgsfield.md`
- `hermes-content/skills/audio-elevenlabs.md`
- `hermes-content/skills/marca-personal-sergio.md`
- `hermes-content/skills/historias-sergio.md`
- `hermes-content/skills/crons-diarios-hermes.md`
- `hermes-content/skills/sistema-semanal-hermes.md`
- `hermes-content/skills/orquestacion-proyectos-onia.md`
- `hermes-content/skills/radar-creativo-onia.md`
- `hermes-content/skills/consultoria-onia.md`

Do not create alternate files named:
- `instagram-publish-v2.md`
- `dashboard-new.md`
- `assets-new.js`
- `publish-instagram-copy.py`

Extend the canonical files instead.

### Session B: n8n, weekly planning, taxes, prospecting, CRM
The other session should own:
- n8n workflows and scheduling.
- Weekly content planning.
- Prospecting flows.
- Tax reminders.
- CRM/client workflows.
- Notion finance and business records.

Canonical files already visible for Session B:
- `AI_YOUTUBE_CHANNELS_MASTER_PLAN_2026.md`
- `AI_TRENDS_RADAR_CONTENT_SYSTEM_2026.md`
- `FUTBOL_LAB_IA_CHANNEL_SYSTEM_2026.md`
- `FUTBOL_LAB_IA_BRAND_IDENTITY_2026.md`
- `AI_YOUTUBE_DOCUMENTATION_INDEX_2026.md`
- `AI_YOUTUBE_HIGH_CPM_CRM_OPERATIONS_MANUAL_2026.md`
- `AI_YOUTUBE_SOPS_AND_OPERATOR_HANDOFF_2026.md`
- `AI_YOUTUBE_PHASE1_CREATIVE_OPERATING_KIT_2026.md`
- `supabase/migrations/20260605_atlas_ai_media_content_factory.sql`
- `hermes-content/references/ai-youtube-pilot-content-queue-20260605.json`
- `hermes-content/references/ai-trends-radar-system-20260606.json`
- `hermes-content/references/ai-trends-video-001-agentes-20260606.md`
- `hermes-content/references/ai-trends-video-001-agentes-20260606.json`
- `hermes-content/references/futbol-lab-ia-channel-kit-20260605.json`
- `hermes-content/references/futbol-lab-ia-higgsfield-prompts-20260605.json`
- `hermes-content/references/futbol-lab-ia-language-system-20260605.json`
- `hermes-content/references/futbol-lab-ia-video-brief-piloto-001-20260605.json`
- `hermes-content/references/futbol-lab-ia-video-001-francia-jordania-20260605.md`
- `hermes-content/references/futbol-lab-ia-video-001-francia-jordania-20260605.json`
- `.hermes/video-lab/jobs/vl-20260605-013309-onia-futbol-lab-ia-piloto-001-la-ia-no-sabe-q.json`
- `.hermes/video-lab/briefs/vl-20260605-013309-onia-futbol-lab-ia-piloto-001-la-ia-no-sabe-q.json`
- `.hermes/video-lab/jobs/vl-20260605-futbol-lab-001-francia-jordania-dinero-vs-caos.json`
- `.hermes/video-lab/briefs/vl-20260605-futbol-lab-001-francia-jordania-dinero-vs-caos.json`
- `.hermes/video-lab/jobs/vl-20260606-radar-ia-001-la-ia-ya-no-responde-ahora-trabaja.json`
- `.hermes/video-lab/briefs/vl-20260606-radar-ia-001-la-ia-ya-no-responde-ahora-trabaja.json`
- `hermes-content/references/ai-youtube-launch-checklist-20260605.json`
- `hermes-content/references/ai-youtube-content-package-template-20260605.json`
- `hermes-content/references/ai-youtube-approval-matrix-20260605.json`
- `hermes-content/references/ai-youtube-high-cpm-crm-keyword-map-20260605.json`
- `hermes-content/references/n8n-ai-youtube-content-factory-20260605.md`
- `hermes-content/references/n8n-workflows/atlas-ai-media-content-factory-draft-v1.sdk.js`
- `hermes-content/references/n8n-workflows/onia-scheduled-ops-pack-v1.sdk.js`
- `scripts/n8n_mcp_healthcheck.js`
- External DentalGest repo:
  `C:\dev\Proyectos\dental-saas\supabase\migrations\20260605_n8n_postgrest_schema_cache_fix.sql`
- `hermes-content/skills/plan-semanal-onia.md`
- `hermes-content/skills/prospeccion-onia.md`
- `hermes-content/skills/recordatorios-fiscales-bolivia.md`
- `hermes-content/references/impuestos-bolivia.template.json`
- `hermes-content/references/n8n-plan-semanal-onia.md`
- `hermes-content/references/prospectos-clinicas-bolivia-2026.csv`
- `hermes-content/references/n8n-prospeccion-clinicas-ig-telegram.md`
- `hermes-content/docs/POLLO_LOCO_CLIENT_REVIEW_20260613.html`
- `hermes-content/docs/POLLO_LOCO_CLIENT_REVIEW_20260613.pdf`

Recommended new files for Session B:
- `N8N_AUTOMATION_PLAN.md`
- `CRM_AND_PROSPECTING.md`
- `TAX_REMINDERS_BOLIVIA.md`
- `hermes-content/docs/N8N_AUTOMATIONS.md`
- `hermes-content/docs/CRM_PROSPECTING.md`
- `hermes-content/docs/TAX_REMINDERS.md`
- `hermes-content/skills/n8n-automatizaciones-onia.md`
- `hermes-content/skills/crm-prospeccion-onia.md`
- `hermes-content/skills/impuestos-bolivia-operaciones.md`

Session B should not edit publishing scripts unless coordinating first.

## Naming rules
- Web Factory client-site context for Nuvia lives in `web-factory/data/clients/nuvia.context.md`.
- Nuvia web data/assets live in `web-factory/data/clients/nuvia.json` and `web-factory/data/clients/nuvia.assets/`.
- Global Web Factory design stack lives in `C:\Users\PC\.codex\design-stack\DESIGN_STACK.md`; project usage notes live in `web-factory/DESIGN_STACK.md`.
- Use Spanish names for Hermes skills.
- Use English uppercase names for repo-level operational docs.
- Put user-facing Hermes docs in `hermes-content/docs/`.
- Put command behavior in `hermes-content/skills/`.
- Put machine-readable references in `hermes-content/references/`.
- Put deploy or VPS automation scripts in `scripts/`.

## Deployment rules
- Deploy Hermes docs and skills with:

```powershell
npm run deploy:hermes-content
```

- Video Lab Telegram commands route through:

```bash
video-lab telegram --message "<raw Telegram message>"
```

- Weekly status/planning commands route through:

```bash
hermes-week-status
hermes-week-plan
```

- General Telegram command center routes through:

```bash
hermes-command telegram --message "<raw Telegram message>"
```

- Deploy Instagram publisher with:

```powershell
npm run deploy:instagram
```

- Prepare asset hosting with:

```powershell
npm run setup:assets
```

## Current validated state
- `ig-publish healthcheck` previously returned `ok: true`, but the Meta token later expired.
- Real carousel publish succeeded with `published_id=18126144559620893`.
- Asset server works at `http://187.77.16.63:8099`.
- Public asset folder on VPS: `/var/www/html/hermes-assets`.
- Hermes dashboard is expected via tunnel: `ssh -L 9119:localhost:9119 root@187.77.16.63`.
- Hermes daily crons are active for operational status, content/video planning, and Video Lab follow-up.
- Hermes weekly crons are active for kickoff, prospecting, build sprint, content production, finance/ops, Sergio brand, and weekly review.
- n8n is running on the VPS, but Hermes cron is currently the active scheduler for Hermes daily tasks.
- As of 2026-06-15, only `n8n-sergio_n8n` should run in production on the VPS. Duplicate service `n8n_n8n` was backed up and scaled to `0/0`; its volume was not deleted.
- As of 2026-06-15, a self-hosted Supabase Docker stack exists on the current VPS at `/opt/onia-supabase/supabase/docker`. It is intentionally private/local-only:
  - Kong/API: `127.0.0.1:54321` and `127.0.0.1:54322`
  - Supavisor/Postgres access: `127.0.0.1:54329` and `127.0.0.1:54320`
  - No public DNS, SMTP, or client-facing exposure has been configured yet.
- Supabase backups:
  - Pre-change n8n backup: `/root/backups/onia-vps-20260615-195441-pre-supabase`
  - Supabase daily local backup script: `/root/.hermes/scripts/supabase_backup.sh`
  - Cron: `/etc/cron.d/onia-supabase-backup`
  - Local backup target: `/root/backups/supabase`
- Notion MCP is connected locally via OAuth (`https://mcp.notion.com/mcp`) as of 2026-06-01.
- Confirmed Notion sources:
  - Finance: `Finanzas & Gastos`, page `ffc07959-c372-4ff7-aaf6-2d744d5bf81c`, data source `collection://0e6e404f-d329-4898-9861-64f8ce973ac5`.
  - SaaS/tools: `SaaS & Herramientas`, page `dc6a6e27-453a-4d7c-800b-ef9c29c8d5ff`, data source `collection://5eaa8d12-823c-4b3b-96bb-e7aaeab1ff9c`.
  - CRM/contactos: `CRM & Contactos`, page `95acb20d-e7f5-4eaa-b185-7a7933ffdd1a`, data source `collection://9b4c77be-d02b-4840-8f91-827ec8007839`.
- June 2026 base finance records in Notion include Codex Pro, Higgsfield Ultra, Google Workspace, VPS Hostinger, Google Photos and Claude Code Pro.

## Security notes
- VPS password and Meta token were pasted in chat and must be rotated.
- Do not paste secrets into docs or chat.
- Store secrets only in `/root/.hermes/.env`.
- Verify secrets by presence or length, never by printing full values.

## Parallel work protocol
Before editing:
1. Check this manifest.
2. Check whether a canonical file already exists.
3. If work belongs to the other session, create only a note or proposal, not duplicate implementation.
4. If a new file is needed, add it to this manifest in the appropriate ownership section.
