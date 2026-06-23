const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const vendorPanelPath = "hermes-content/references/onia-vendor-panel-20260620.json";
const vendorPanel = JSON.parse(read(vendorPanelPath));

assert(vendorPanel.service_cash_engine, "Missing service_cash_engine in vendor panel JSON");
assert(vendorPanel.service_cash_engine.workhorse_offer, "Missing workhorse_offer in vendor panel JSON");
assert(
  vendorPanel.service_cash_engine.workhorse_offer.name === "ONIA Motor Local Growth",
  "Workhorse offer must be ONIA Motor Local Growth",
);
assert(vendorPanel.service_cash_engine.workhorse_offer.setup_price_bs === 2900, "Growth setup must be 2900");
assert(vendorPanel.service_cash_engine.workhorse_offer.monthly_price_bs === 1900, "Growth monthly must be 1900");
assert(vendorPanel.service_cash_engine.workhorse_offer.fund_percent === 40, "Growth fund percent must be 40");
assert(vendorPanel.service_cash_engine.workhorse_offer.target_active_clients === 5, "Growth target clients must be 5");
assert(vendorPanel.service_cash_engine.workhorse_offer.target_monthly_revenue_bs === 9500, "Growth revenue target must be 9500");
assert(vendorPanel.service_cash_engine.workhorse_offer.target_monthly_fund_bs === 3800, "Growth fund target must be 3800");

const schema = read("supabase/migrations/20260622_onia_center_schema.sql");
const seed = read("supabase/migrations/20260622_onia_center_seed.sql");
const operatingSchema = read("supabase/migrations/20260622_onia_center_operating_core.sql");
const operatingSeed = read("supabase/migrations/20260622_onia_center_operating_seed.sql");
const ideasAccessSchema = read("supabase/migrations/20260622_onia_center_ideas_access.sql");
const ideasAccessSeed = read("supabase/migrations/20260622_onia_center_ideas_access_seed.sql");
const sergioCalendarSchema = read("supabase/migrations/20260623_onia_center_sergio_calendar.sql");
const sergioCalendarSeed = read("supabase/migrations/20260623_onia_center_sergio_calendar_seed.sql");
const integrationReadinessSchema = read("supabase/migrations/20260623_onia_center_integration_readiness.sql");
const integrationReadinessSeed = read("supabase/migrations/20260623_onia_center_integration_readiness_seed.sql");
const operatingAgentsSchema = read("supabase/migrations/20260623_onia_center_operating_agents.sql");
const operatingAgentsSeed = read("supabase/migrations/20260623_onia_center_operating_agents_seed.sql");
const authRlsSchema = read("supabase/migrations/20260623_onia_center_auth_rls.sql");

const requiredTables = [
  "roles",
  "accounting_centers",
  "services",
  "leads",
  "income_entries",
  "expense_entries",
  "evidence_items",
  "scorecards",
  "scorecard_items",
  "payment_commissions",
  "nuvia_lots",
  "premium_tool_usage",
];

for (const table of requiredTables) {
  assert(
    schema.includes(`create table if not exists onia_center.${table}`),
    `Missing table onia_center.${table}`,
  );
}

const requiredOperatingTables = [
  "organizations",
  "user_profiles",
  "organization_memberships",
  "clients",
  "contacts",
  "projects",
  "project_modules",
  "tasks",
  "task_events",
  "collaborators",
  "deliverables",
  "collab_ingestion_items",
  "review_queue",
  "knowledge_items",
  "content_assets",
  "inventory_items",
  "inventory_events",
  "external_adapters",
  "adapter_events",
  "audit_logs",
];

for (const table of requiredOperatingTables) {
  assert(
    operatingSchema.includes(`create table if not exists onia_center.${table}`),
    `Missing operating table onia_center.${table}`,
  );
}

const requiredIdeasAccessTables = [
  "idea_inbox",
  "access_policies",
];

for (const table of requiredIdeasAccessTables) {
  assert(
    ideasAccessSchema.includes(`create table if not exists onia_center.${table}`),
    `Missing ideas/access table onia_center.${table}`,
  );
}

const requiredSergioCalendarTables = [
  "sergio_schedule_blocks",
  "sergio_meeting_windows",
  "sergio_assistant_commands",
  "personal_automation_rules",
];

for (const table of requiredSergioCalendarTables) {
  assert(
    sergioCalendarSchema.includes(`create table if not exists onia_center.${table}`),
    `Missing Sergio calendar table onia_center.${table}`,
  );
}

const requiredIntegrationReadinessTables = [
  "integration_connectors",
  "feature_readiness_items",
];

for (const table of requiredIntegrationReadinessTables) {
  assert(
    integrationReadinessSchema.includes(`create table if not exists onia_center.${table}`),
    `Missing integration readiness table onia_center.${table}`,
  );
}

const requiredOperatingAgentTables = [
  "operating_agents",
  "agent_monthly_plans",
  "calendar_connector_plans",
];

for (const table of requiredOperatingAgentTables) {
  assert(
    operatingAgentsSchema.includes(`create table if not exists onia_center.${table}`),
    `Missing operating agents table onia_center.${table}`,
  );
}

const requiredSchemaRules = [
  "onia_center_services_price_setup_required",
  "onia_center_services_monthly_required_if_recurring",
  "onia_center_payments_need_evidence_and_sergio",
  "onia_center_nuvia_distribution_gate",
  "onia_center_premium_usage_center_required",
  "row level security",
];

for (const rule of requiredSchemaRules) {
  assert(schema.includes(rule), `Missing schema rule: ${rule}`);
}

const requiredOperatingRules = [
  "onia_center_external_adapters_write_gate",
  "onia_center_review_sergio_sensitive",
  "onia_center_collab_sensitive_import_gate",
  "onia_center_deliverables_approved_by_sergio",
  "enable row level security",
];

for (const rule of requiredOperatingRules) {
  assert(operatingSchema.includes(rule), `Missing operating schema rule: ${rule}`);
}

const requiredIdeasAccessRules = [
  "onia_center_idea_private_owner_gate",
  "onia_center_idea_approved_by_sergio",
  "onia_center_access_sergio_approves",
  "enable row level security",
];

for (const rule of requiredIdeasAccessRules) {
  assert(ideasAccessSchema.includes(rule), `Missing ideas/access schema rule: ${rule}`);
}

const requiredSergioCalendarRules = [
  "visibility_scope = 'sergio_private'",
  "enable row level security",
  "manual_only",
];

for (const rule of requiredSergioCalendarRules) {
  assert(sergioCalendarSchema.includes(rule) || sergioCalendarSeed.includes(rule), `Missing Sergio calendar rule: ${rule}`);
}

const requiredIntegrationRules = [
  "onia_center_integration_no_secret_values",
  "enable row level security",
  "config_pending",
  "manual_only",
  "agents",
];

for (const rule of requiredIntegrationRules) {
  assert(
    integrationReadinessSchema.includes(rule) || integrationReadinessSeed.includes(rule),
    `Missing integration readiness rule: ${rule}`,
  );
}

const requiredOperatingAgentRules = [
  "onia_center_calendar_connector_no_secret_values",
  "enable row level security",
  "prepared_pending_connection",
  "two_way_guarded",
];

for (const rule of requiredOperatingAgentRules) {
  assert(
    operatingAgentsSchema.includes(rule) || operatingAgentsSeed.includes(rule),
    `Missing operating agent rule: ${rule}`,
  );
}

const requiredAuthRlsRules = [
  "current_user_key",
  "current_role_key",
  "can_read_visibility",
  "has_org_access",
  "can_act_as_role",
  "onia_center_tasks_update_assigned_or_sergio",
  "onia_center_leads_read_owner_or_sergio",
  "onia_center_ideas_update_owner_or_sergio",
  "onia_center_nuvia_lots_sergio_only",
  "onia_center_calendar_connectors_sergio_only",
];

for (const rule of requiredAuthRlsRules) {
  assert(authRlsSchema.includes(rule), `Missing Auth/RLS rule: ${rule}`);
}

const requiredSeedMarkers = [
  "onia_vendor_panel_20260620",
  "ONIA Motor Local Growth",
  "Setup Bs. 2.900 + mensualidad Bs. 1.900",
  "Fondo ONIA 40%",
  "20% Fondo ONIA",
  "10% Reserva Nuvia",
  "Arthur / Coordinador Comercial-Operativo en prueba",
];

for (const marker of requiredSeedMarkers) {
  assert(seed.includes(marker), `Missing seed marker: ${marker}`);
}

const requiredOperatingSeedMarkers = [
  "ONIA Center",
  "onia-hermes-collab",
  "Bolivian Electric OS",
  "TR4",
  "Arthur",
  "StockCam / Inventario con camara",
  "collab_ingestion",
];

for (const marker of requiredOperatingSeedMarkers) {
  assert(operatingSeed.includes(marker), `Missing operating seed marker: ${marker}`);
}

const requiredIdeasAccessSeedMarkers = [
  "access-sergio-idea-all",
  "access-arthur-idea-assigned",
  "access-seller-idea-basic",
  "access-freelancer-idea-task",
  "Arthur no ve capital Sergio",
  "Vendedor no ve datos privados",
];

for (const marker of requiredIdeasAccessSeedMarkers) {
  assert(ideasAccessSeed.includes(marker), `Missing ideas/access seed marker: ${marker}`);
}

const requiredSergioCalendarSeedMarkers = [
  "sergio-wake-reset",
  "sergio-gym",
  "sergio-girlfriend",
  "higgsfield-quiet-default-20260623",
  "Recordatorios Video Lab",
  "Watcher Higgsfield",
];

for (const marker of requiredSergioCalendarSeedMarkers) {
  assert(sergioCalendarSeed.includes(marker), `Missing Sergio calendar seed marker: ${marker}`);
}

const requiredIntegrationSeedMarkers = [
  "supabase_onia_center",
  "cal_booking",
  "google_calendar",
  "n8n_ops",
  "litellm_gateway",
  "local_models",
  "dify_rag",
  "remotion_video",
  "web_factory_auto",
  "higgsfield",
  "whatsapp_chatbots",
  "runtime_daily_ops",
  "monthly_agents",
  "client_web_intake",
];

for (const marker of requiredIntegrationSeedMarkers) {
  assert(integrationReadinessSeed.includes(marker), `Missing integration readiness seed marker: ${marker}`);
}

const requiredOperatingAgentSeedMarkers = [
  "agent_ceo_monthly",
  "agent_sales_crm",
  "agent_calendar_energy",
  "agent_finance_fund",
  "agent_selfhosted_integrations",
  "plan_calendar_202606",
  "calendar_google_private",
  "GOOGLE_CALENDAR_REFRESH_TOKEN",
  "ONIA - Agenda: Briefing Diario",
];

for (const marker of requiredOperatingAgentSeedMarkers) {
  assert(operatingAgentsSeed.includes(marker), `Missing operating agent seed marker: ${marker}`);
}

const appSource = read("web-factory/apps/site/src/app/onia-center/source.ts");
const appEngine = read("web-factory/apps/site/src/app/onia-center/engine.ts");
const appOperatingSource = read("web-factory/apps/site/src/app/onia-center/operating-source.ts");
const appOperatingEngine = read("web-factory/apps/site/src/app/onia-center/operating-engine.ts");
const appPage = read("web-factory/apps/site/src/app/onia-center/page.tsx");
const appOperatingWorkspace = read("web-factory/apps/site/src/app/onia-center/operating-workspace.tsx");
const appIntegrationsRoute = read("web-factory/apps/site/src/app/api/onia-center/integrations/route.ts");
const telegramReference = JSON.parse(read("hermes-content/references/telegram-command-center.json"));
const sergioCalendarReference = JSON.parse(read("hermes-content/references/sergio-strict-calendar-20260623.json"));

const requiredAppMarkers = [
  "setupPriceBs: 2900",
  "monthlyPriceBs: 1900",
  "servicesFundPercent: 40",
  "nuviaReserveBs",
  "No comision sin evidencia",
  "No uso premium sin centro asignado",
  "No Nuvia sin costos completos",
];

for (const marker of requiredAppMarkers) {
  assert(appSource.includes(marker) || appEngine.includes(marker), `Missing app marker: ${marker}`);
}

const requiredOperatingAppMarkers = [
  "repoStrategy",
  "operatingOrganizations",
  "operatingProjects",
  "accessPolicies",
  "collabIngestionItems",
  "Bolivian Electric OS",
  "TR4 es adaptador externo",
  "getOperatingDashboardSummary",
  "getVisibleProjects",
  "Dashboard operativo ONIA",
];

for (const marker of requiredOperatingAppMarkers) {
  assert(
    appOperatingSource.includes(marker) || appOperatingEngine.includes(marker) || appPage.includes(marker),
    `Missing operating app marker: ${marker}`,
  );
}

const requiredIdeaAppMarkers = [
  "Ideas Inbox",
  "buildIdeaPrompt",
  "visibleIdeas",
  "ideaVisibilityLabels",
  "Snapshot actual filtrado por rol",
];

for (const marker of requiredIdeaAppMarkers) {
  assert(appOperatingWorkspace.includes(marker) || appPage.includes(marker), `Missing idea app marker: ${marker}`);
}

const requiredSergioCalendarAppMarkers = [
  "Calendario estricto Sergio",
  "sergioStrictScheduleBlocks",
  "higgsfieldQuietRule",
  "AlfredHQ personal + quiet Higgsfield",
  "Puedo reunirme <dia> <hora>?",
];

for (const marker of requiredSergioCalendarAppMarkers) {
  assert(
    appOperatingWorkspace.includes(marker) || appOperatingSource.includes(marker),
    `Missing Sergio calendar app marker: ${marker}`,
  );
}

const requiredIntegrationAppMarkers = [
  "integrationConnectors",
  "featureReadinessItems",
  "getIntegrationReadinessSummary",
  "Integraciones y funciones pendientes",
  "connector-google-calendar",
  "connector-remotion-video",
  "connector-web-factory-auto",
  "connector-local-models",
  "RuntimeConnectorCheck",
  "Secret values never leave the server",
];

for (const marker of requiredIntegrationAppMarkers) {
  assert(
    appOperatingSource.includes(marker) ||
      appOperatingEngine.includes(marker) ||
      appPage.includes(marker) ||
      appIntegrationsRoute.includes(marker),
    `Missing integration app marker: ${marker}`,
  );
}

const requiredOperatingAgentAppMarkers = [
  "operatingAgents",
  "agentMonthlyPlans",
  "calendarConnectorPlans",
  "getOperatingAgentSummary",
  "Agentes operativos",
  "Plan mensual, agenda estricta y conexiones",
  "Agente Calendario y Energia Sergio",
  "Google Calendar privado Sergio",
];

for (const marker of requiredOperatingAgentAppMarkers) {
  assert(
    appOperatingSource.includes(marker) ||
      appOperatingEngine.includes(marker) ||
      appPage.includes(marker) ||
      appSource.includes(marker),
    `Missing operating agent app marker: ${marker}`,
  );
}

assert(
  telegramReference.command_groups.some((group) => group.name === "sergio_personal_os"),
  "Missing sergio_personal_os command group in Telegram reference",
);
assert(
  sergioCalendarReference.higgsfield_quiet_rule.status === "manual_only",
  "Sergio calendar reference must keep Higgsfield manual_only",
);

console.log(
  JSON.stringify(
    {
      ok: true,
      json: vendorPanelPath,
      tables: requiredTables.length,
      operatingTables: requiredOperatingTables.length,
      ideasAccessTables: requiredIdeasAccessTables.length,
      sergioCalendarTables: requiredSergioCalendarTables.length,
      integrationReadinessTables: requiredIntegrationReadinessTables.length,
      operatingAgentTables: requiredOperatingAgentTables.length,
      schemaRules: requiredSchemaRules.length,
      operatingSchemaRules: requiredOperatingRules.length,
      ideasAccessSchemaRules: requiredIdeasAccessRules.length,
      sergioCalendarRules: requiredSergioCalendarRules.length,
      integrationReadinessRules: requiredIntegrationRules.length,
      operatingAgentRules: requiredOperatingAgentRules.length,
      authRlsRules: requiredAuthRlsRules.length,
      seed: "20260622_onia_center_seed.sql",
      operatingSeed: "20260622_onia_center_operating_seed.sql",
      ideasAccessSeed: "20260622_onia_center_ideas_access_seed.sql",
      sergioCalendarSeed: "20260623_onia_center_sergio_calendar_seed.sql",
      integrationReadinessSeed: "20260623_onia_center_integration_readiness_seed.sql",
      operatingAgentsSeed: "20260623_onia_center_operating_agents_seed.sql",
      authRls: "20260623_onia_center_auth_rls.sql",
      growth: vendorPanel.service_cash_engine.workhorse_offer,
    },
    null,
    2,
  ),
);
