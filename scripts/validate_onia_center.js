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

const appSource = read("web-factory/apps/site/src/app/onia-center/source.ts");
const appEngine = read("web-factory/apps/site/src/app/onia-center/engine.ts");
const appOperatingSource = read("web-factory/apps/site/src/app/onia-center/operating-source.ts");
const appOperatingEngine = read("web-factory/apps/site/src/app/onia-center/operating-engine.ts");
const appPage = read("web-factory/apps/site/src/app/onia-center/page.tsx");
const appOperatingWorkspace = read("web-factory/apps/site/src/app/onia-center/operating-workspace.tsx");

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

console.log(
  JSON.stringify(
    {
      ok: true,
      json: vendorPanelPath,
      tables: requiredTables.length,
      operatingTables: requiredOperatingTables.length,
      ideasAccessTables: requiredIdeasAccessTables.length,
      schemaRules: requiredSchemaRules.length,
      operatingSchemaRules: requiredOperatingRules.length,
      ideasAccessSchemaRules: requiredIdeasAccessRules.length,
      seed: "20260622_onia_center_seed.sql",
      operatingSeed: "20260622_onia_center_operating_seed.sql",
      ideasAccessSeed: "20260622_onia_center_ideas_access_seed.sql",
      growth: vendorPanel.service_cash_engine.workhorse_offer,
    },
    null,
    2,
  ),
);
