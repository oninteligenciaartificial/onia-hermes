# ONIA / Hermes - Handoff de pendientes (2026-07-05)

Lista consolidada para abrir una sesion nueva y seguir cerrando trabajo.
Generada con 4 subagentes de relevamiento read-only (ops, core, factories, growth)
sobre el repo real. 69 items. No inventados: cada uno referencia un archivo.

## 0. Como usar este doc + caveat de worktree

- **Este worktree (`claude/cool-blackwell-7e66b2`) esta ATRAS de `main`** (basado en
  `dd348f6b`, sin PRs #7-#10). Varios docs de estado y el master handoff
  `onia-core/ONIA_PENDIENTES_HANDOFF_20260704.md` viven en `main`, no aca.
  **Para la proxima sesion: partir de un worktree fresco desde `main` actualizado.**
- Formato de item: `[ ] titulo - proximo paso. (ref) [bloqueante]`.
- Bloqueante solo se marca cuando NO es "-": humano / credencial / decision / infra.
- El core y los MVPs estan hechos; casi todo lo pendiente es adopcion, hardening,
  fase 2 y cierre comercial, no construir de cero.

## 1. Decisiones de Sergio que destraban el 70% (EMPEZAR ACA)

1. **Gate RAM del VPS** (swap 100%, 9/15Gi): consolidar los 2 stacks Supabase o
   subir a 32GB. Destraba Postiz, Firecrawl y la oferta "redes gestionadas".
2. **Verificacion de negocio Meta**: destraba chatbot WhatsApp client-facing (add-on
   recurrente en 4 propuestas), IG publishing y el chatbot Nuvia.
3. **Credenciales Instagram Graph API** (token long-lived + Business Account ID).
4. **Aprobar tandas de prospeccion** (15 La Paz + 15 dentales, mensajes ya escritos).
5. **Rotar llave SSH** `onia_hermes_vps_ed25519` (se pego en un chat) - accion sensible.
6. **Tavily: baja vs mantener** - el taskboard pide alta (B2), el assessment pide
   darlo de baja por SearXNG+Crawl4AI (ya corriendo). Resolver el conflicto.

## 2. Ingresos a la vista (cerrar ya, sin construir nada)

- **6 propuestas ya en PDF** (BENCH, Garabato, HSB Engineers, Lia Albertengo,
  AW Climatizacion x3): falta seguimiento y cierre, no generarlas.
  (`hermes-content/propuestas/*.pdf`, `generador/clientes.json`) [humano]
- **Bolivian Electric**: propuesta + VPS dedicado listos; falta crear owner inicial
  de n8n (`showSetupOnFirstLoad=true`) y firmar.
  (`hermes-content/docs/BOLIVIAN_ELECTRIC_ONIA_MANAGED_BRIDGE_20260629.md`) [humano]

## 3. OPS & INFRA

- [ ] **Gate RAM VPS**: consolidar 2 stacks Supabase o subir a 32GB. (`docs/ONIA_TOOLING_ASSESSMENT_20260704.md`) [decision]
- [ ] **Rotar llave SSH** `onia_hermes_vps_ed25519` + actualizar credencial n8n `4XKauEX3b6cqaDhW`, revocar vieja. (`memory/n8n-ops-pendientes.md`) [humano]
- [ ] **Backup off-site R2**: bucket+token, upload al final de `/opt/onia/vps-backup.sh` (WF `gN7pQld6Lh3qAcTS`). [credencial R2]
- [ ] **Deploy saneamiento ONIA Center** (commit `c9f528af`, NO desplegado): build standalone en VPS, swap `runtime-next`, restart, correr maintenance para purgar tareas basura. (`memory/onia-center-saneamiento.md`)
- [ ] **Desactivar GitHub Action** `onia-hygiene-daily.yml` (sigue creando tareas `[Higiene]` a diario) tras deploy del dedup.
- [ ] **Reactivar 3 workflows DentalGest pausados** (WF-00/03/11) uno por uno con validacion de envios. (`N8N_AUTOMATION_PLAN.md`) [humano: aprobar envios]
- [ ] **Reparar `sendAdminEmail`** (conexion faltante) en 3 workflows GestiOS activos (`6oowIHo8G9baBOYc`, `qOVpQwPZplQKYkMc`, `xx4wzzzqZBGfu836`). (`docs/ONIA_N8N_CLEANUP_20260703.md`) [decision: coordinar repo GestiOS]
- [ ] **SSH roto en 2 workflows** reales (`VeCHKr6wkK5Wet25`, `zediOCdtlP1zpImK`): reparar credencial o archivar. [decision]
- [ ] **Migrar/rotar API keys inline** en nodos HTTP de n8n a credenciales Header Auth. (`N8N_AUTOMATION_PLAN.md`)
- [ ] **Prospeccion automatica: fuente real** (WF `jspfoUsjQfQ1VXY4` solo hace nudge). Google Places vs Tavily; evaluar reactivar `rGvQb4CRBdJPwrp1`. [decision]
- [ ] **Migrar research Tavily -> SearXNG(:8080)+Crawl4AI(:11235)** (ya corren HTTP 200). (`docs/ONIA_TOOLING_ASSESSMENT_20260704.md`)
- [ ] **QA visual real** en WF `GFeCZKr1zQT6CVN8`: screenshots + regresion (Playwright ya instalado en VPS). Requiere MCP n8n en sesion.
- [ ] **Arranque GATED Postiz** (runbook listo, no arrancar): tras liberar RAM. (`hermes-content/deploy/postiz/README.md`) [infra]
- [ ] **Arranque GATED Firecrawl** (preparado en `/opt/onia-selfhosted/firecrawl/src`): solo en ventana de mantenimiento. [infra]
- [ ] **Piloto OpenClaw** (OJO: veredicto SKIP de Sergio 2026-07-04): confirmar si sigue vigente antes de tocar. (`hermes-content/deploy/openclaw/README.md`) [decision]
- [ ] **Script deploy VPS ONIA Center** `scripts/deploy-onia-center-vps.*` (hoy manual): automatizar 6 pasos con rollback. (`memory/onia-center-deploy-topology.md`)
- [ ] **Resolver 2 targets de ONIA Center** (Vercel vs VPS `center.onia.com.bo`): elegir canonico. [decision]
- [ ] **Auth/RLS de ONIA Center** antes de exponerlo publico (Supabase Auth, memberships, RLS por rol). (`ONIA_CENTER_RUNTIME_STATUS_20260622.md`)
- [ ] **Borrar draft n8n vacio** `iqsnnQXlJyypiew8` (1 click UI, no via MCP). [humano]
- [ ] **Uptime Kuma** para monitoreo (`--profile monitor`) + checks criticos -> Telegram.

## 4. PRODUCT CORE (ONIA Core + DentalGest)

- [ ] **Tenant guard Prisma Client Extension** (`$extends`) que inyecte `organizationId` auto (hoy solo `tenantWhere()` manual). (`DentaGest/.../lib/onia-core/tenant-guard.ts`)
- [ ] **Tests de tenant safety** (`tenant-guard.test.ts`) - no existe test file del guard.
- [ ] **Decision PowerSync vs ElectricSQL** antes del adapter Ganadero (gate duro). (`onia-core/ONIA_STACK_ASSESSMENT_2026.md`) [decision]
- [ ] **Adopcion ONIA Core en GestiOS** (Sprint 0 baseline -> work items -> collab -> roles/schedule/views -> intake+wizard). Agregar `gestios` al allowlist doble en `validate.mjs`. (`ONIA_CORE_INSTALL_GUIDE_2026.md`)
- [ ] **Extraccion `@onia/core-db` / `@onia/core-ui` / `@onia/fiscal`** (~15-20K lineas dup) - tras estabilizar GestiOS, no antes. [decision]
- [ ] **UI DentaGest: hilo comentarios + documentos** en ficha paciente (logica `collab.ts` lista, falta UI).
- [ ] **UI DentaGest: admin de roles finos** (post-setup). (`lib/onia-core/roles.ts`)
- [ ] **UI DentaGest: selector de vistas guardadas** en dashboard. (`lib/onia-core/saved-views.ts`)
- [ ] **Conector n8n correo->intake**: Sergio pega `ONIA_INTAKE_SECRET` en credencial del WF `XxIHPNgpsL5FsHct` y publica. [humano 2 min]
- [ ] **Formulario web-factory -> intake** (canal `web_form`, endpoint listo).
- [ ] **ImportBatch dry-run real** (carga inicial guiada, gancho de implementacion pagada).
- [ ] **Balance de comprobacion DentaGest** (portar `lib/fiscal/` de GestiOS al dominio clinico).
- [ ] **Read-model panel del dueno**: alinear seccion `team` (ActivityEvent) y `partners` con el contrato. (`ONIA_CORE_OWNER_PANEL_AND_INTAKE_2026.md`)
- [ ] **`communication_channel` UI general** (correos/telefonos de la clinica mas alla de WhatsApp).
- [ ] **Adapter `proveegest.json`** cuando ProveeGest se separe (hoy Bolivian Electric usa el de GestiOS). [decision]
- [ ] **Pulido bridge Hermes**: titulo de `/tarea` = texto de la tarea (hoy `solicitud_manual: <contacto>`). (`lib/onia-core/bridge.ts`)

## 5. FACTORIES (Web Factory + Video Factory)

Web Factory roadmap #1-#8 estan HECHOS en `main`. Abiertos:

- [ ] **WF #6 follow-up: auto-conversion imagenes WebP/AVIF (sharp)** (hoy `check-images.ts` solo flagea, no convierte). Wirear `images:check` al gate `e2e`.
- [ ] **Optimizar assets Nuvia pesados** (108 PNG >400kb) tras el paso sharp. (`data/clients/nuvia.assets/`)
- [ ] **WF #9: mas templates por rubro** (portfolio, servicios premium) en `packages/templates/src/`.
- [ ] **E2E runtime Next (checkout/carrito Nuvia)** - spec Playwright sobre `apps/site`. [credencial Supabase/BNB]
- [ ] **Chatbot multitenant Nuvia**: linea WhatsApp + verificacion Meta + inbox. (`WEB_FACTORY_CHATBOT_MULTITENANT_ARCHITECTURE.md`) [humano]
- [ ] **Chatbot multitenant: decisiones infra** (Chatwoot propio vs de BE; bot en `apps/site` vs infra compartida). [decision]
- [ ] **Video Factory: `generate.mjs`** con runtime MCP Higgsfield real + polling async (hoy adapter devuelve `engine_runtime_required`). (`video-factory/engine/higgsfield/adapter.mjs`)
- [ ] **Video Factory: 4 formatos fase 2** (`explainer`, `viral-preset`, `clip-from-long`, `product-showcase`) en `video-factory/formats/`.
- [ ] **Panel Video Lab en ONIA Center** (`/onia-center/video-lab`, galeria jobs) - la ruta no existe en main.
- [ ] **Video Lab: jobs reales + boton aprobar** (snapshot brain vs Supabase). [decision: fuente]
- [ ] **Video Factory: workflows n8n** (recordatorios jobs en espera, polling, aprobacion).
- [ ] **Video Factory: botones Telegram** (preview + aprobar/rehacer por lane).
- [ ] **Video Factory: CLI fallback `@higgsfield/cli`** para generacion desatendida. [credencial token CLI]

## 6. GROWTH (contenido / CRM / ventas / propuestas)

- [ ] **Cerrar 6 propuestas en pipeline** (Garabato, HSB, Lia, AW x3, BENCH): seguimiento + activar mensual en la firma. [humano]
- [ ] **Bolivian Electric**: crear owner n8n (`showSetupOnFirstLoad=true`) + cerrar/firmar. [humano]
- [ ] **Prospeccion tanda 1 La Paz** (15): reemplazar `[tu nombre]`, aprobar, enviar a mano, registrar en CRM. (`OUTREACH_TANDA1_LAPAZ.md`) [humano]
- [ ] **Prospeccion leads dentales** (top 15): aprobar mensaje+canal por lead. (`ONIA_LEADS_PRIORITY_2026.md`) [humano]
- [ ] **Migrar CRM a Notion** (esquema vendor) como fuente oficial (hoy CSV/Markdown). [decision]
- [ ] **Credenciales IG Graph API** (token + Business Account ID). (`ONIA_SYSTEM_TASKBOARD_2026.md` B1) [credencial Meta]
- [ ] **Verificacion Meta WhatsApp Business** (desbloquea WA->Chatwoot + chatbots). (B6) [verificacion Meta]
- [ ] **Prueba controlada publicacion IG** via `ig-publish` (tras B1). (B5) [credencial]
- [ ] **Workflow n8n `Plan semanal`** (dry-run + aprobacion humana). (B4)
- [ ] **Plan semanal contenido + carruseles** (borradores con `onia-creative-radar`). (X3)
- [ ] **Batch 30 videos cortos**: Sergio graba assets -> voces ElevenLabs + Higgsfield. (`JUNE_2026_VIDEO_PRODUCTION_PLAN.md`) [humano: grabacion]
- [ ] **Workflow n8n `Monthly Video Batch`** (drafts + tarjetas de aprobacion Telegram).
- [ ] **Lanzar canales YouTube faceless** (Workflow ROI EN + Automatiza PyME ES). (`AI_YOUTUBE_CHANNELS_MASTER_PLAN_2026.md`) [decision: canales + presupuesto]
- [ ] **Pipeline Llamada->Propuesta** (nota voz Telegram -> HTML): subir scripts al VPS + activar WF. (`SETUP_PROPUESTAS_AUTOMATICAS.md`)
- [ ] **Oferta: redes gestionadas white-label (Postiz)**. [infra: gate RAM]
- [ ] **Oferta: chatbot WA/IG como servicio** (Typebot+Chatwoot+n8n). [verificacion Meta]
- [ ] **Oferta: renders 3D producto (Blender)** - sin bloqueante, la unica tool nueva a sumar ya.
- [ ] **Oferta: live-selling IA / vendedor virtual 24/7** (FB-IG Live + avatar, NO TikTok Shop). [decision: piloto]
- [ ] **Datos fiscales Bolivia** (NIT, regimen, calendario) -> activar recordatorios IVA/IT/RC-IVA/IUE. (B9) [humano: contador]

## 7. Notas cruzadas / conflictos a resolver

- **Worktree atras de main**: reconciliar antes de ejecutar; traer master handoff de onia-core.
- **Conflicto Tavily**: taskboard (dar de alta) vs assessment (dar de baja por OSS). Decidir uno.
- **Estados no verificados en vivo**: los relevamientos son sobre archivos; el estado
  de n8n/Notion/VPS en vivo (swap, contenedores) es del 2026-07-04. Re-verificar al abrir.
- **OpenClaw**: memoria marca SKIP; el runbook de piloto existe. No arrancar sin reconfirmar.

## 8. Plan sugerido para la proxima sesion (con subagentes)

1. Worktree fresco desde `main`; re-verificar VPS en vivo (`docker stats`, `free`).
2. Cerrar las decisiones de la seccion 1 con Sergio (una tanda de preguntas).
3. Ejecutar en paralelo lo que NO depende de humano/infra:
   - Core: tenant guard `$extends` + su test (dentalgest-migrations / onia-core-guardian).
   - Factories: sharp WebP/AVIF + assets Nuvia (web-factory-builder).
   - Ops: migrar research a SearXNG+Crawl4AI; Uptime Kuma monitor (hermes-automation).
   - Growth: sumar Blender + prototipo render 3D; borradores plan semanal (onia-creative-radar).
4. Detras del gate RAM: consolidar Supabase, luego Postiz/Firecrawl.
5. Detras de Meta: chatbots WA client-facing y publicacion IG.
