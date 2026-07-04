import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  getBlockedCapabilitiesForTrack,
  getCapabilitiesByLayer,
  getCapability,
  getCoreCapabilityIds,
  getOrphanEntityIds,
  getUnansweredQuestions,
  loadOniaCoreContract,
} from "./index.mjs";

const contract = loadOniaCoreContract();
const errors = [];
const oniaCoreDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(oniaCoreDir, "..");

function assert(condition, message) {
  if (!condition) {
    errors.push(message);
  }
}

function repoPath(path) {
  return resolve(repoRoot, path);
}

function readJsonFile(path) {
  return JSON.parse(readFileSync(repoPath(path), "utf8"));
}

function assertRepoFile(path, label) {
  assert(existsSync(repoPath(path)), `${label} missing: ${path}`);
}

function assertUnique(items, label) {
  const ids = items.map((item) => item.id);
  assert(new Set(ids).size === ids.length, `${label} must have unique ids`);
}

assert(contract.name === "ONIA Core", "Contract name must be ONIA Core");
assert(/^\d+\.\d+\.\d+$/.test(contract.version), "Contract version must be semver (x.y.z)");
assert(["canonical_draft", "alpha", "beta"].includes(contract.status), "Contract status must be canonical_draft, alpha or beta");
assert(contract.policy?.installInProductRepos === false, "Product repo installation must stay disabled before beta");
assert(contract.questions.length === 10, "ONIA Core must keep the 10 operating questions");
assertRepoFile(contract.researchResult, "Research result");
assertRepoFile(contract.betaDirection, "Beta direction");

assert(Array.isArray(contract.researchSources), "researchSources must be an array");
assert(contract.researchSources.some((source) => source.type === "local"), "researchSources must include local sources");
assert(contract.researchSources.some((source) => source.type === "external"), "researchSources must include external sources");

assertUnique(contract.questions, "questions");
assertUnique(contract.entities, "entities");
assertUnique(contract.capabilities, "capabilities");
assertUnique(contract.families, "families");
assertUnique(contract.verticalTracks, "verticalTracks");
assertUnique(contract.distributionTargets.map((target) => ({ id: target.projectId })), "distributionTargets");

const questionIds = new Set(contract.questions.map((question) => question.id));
const entityIds = new Set(contract.entities.map((entity) => entity.id));
const capabilityIds = new Set(contract.capabilities.map((capability) => capability.id));
const familyIds = new Set(contract.families.map((family) => family.id));
const distributionProjectIds = new Set(contract.distributionTargets.map((target) => target.projectId));

for (const entity of contract.entities) {
  assert(entity.requiredFields?.includes("organizationId") || entity.tenantScoped === false, `${entity.id} must be tenant-scoped or root`);
}

for (const capability of contract.capabilities) {
  assert(capability.answers.length > 0, `${capability.id} must answer at least one operating question`);

  for (const questionId of capability.answers) {
    assert(questionIds.has(questionId), `${capability.id} references missing question ${questionId}`);
  }

  for (const entityId of capability.entityIds) {
    assert(entityIds.has(entityId), `${capability.id} references missing entity ${entityId}`);
  }
}

for (const coreCapability of getCapabilitiesByLayer(contract, "core")) {
  assert(coreCapability.phase <= 2, `${coreCapability.id} core phase must be <= 2`);
  assert(coreCapability.entityIds.length > 0, `${coreCapability.id} core capability must own at least one entity`);
}

const orphanEntities = getOrphanEntityIds(contract);
assert(orphanEntities.length === 0, `Entities not referenced by any capability: ${orphanEntities.join(", ")}`);

const unansweredQuestions = getUnansweredQuestions(contract, "core");
assert(
  unansweredQuestions.length === 0,
  `Operating questions not answered by any core capability: ${unansweredQuestions.map((question) => question.id).join(", ")}`,
);

for (const notCore of ["catalog_inventory", "sales_cash", "quotes_b2b", "whatsapp", "tr4_adapter", "siat"]) {
  assert(getCapability(contract, notCore)?.layer !== "core", `${notCore} must not be a core capability`);
}

for (const track of contract.verticalTracks) {
  assert(familyIds.has(track.familyId), `${track.id} references missing family ${track.familyId}`);

  for (const capabilityId of [...track.requiredCapabilityIds, ...track.blockedCapabilityIds]) {
    assert(capabilityIds.has(capabilityId), `${track.id} references missing capability ${capabilityId}`);
  }

  for (const blockedCapability of getBlockedCapabilitiesForTrack(contract, track.id)) {
    assert(blockedCapability.layer === "external_gate", `${track.id} blocks non-external gate ${blockedCapability.id}`);
  }
}

// Misma doble llave que los adapters: solo proyectos aprobados pueden salir
// de hold_until_beta en distributionTargets.
const TARGET_ADOPTION_APPROVED = new Set(["dentagest"]);

for (const target of contract.distributionTargets) {
  const allowed = TARGET_ADOPTION_APPROVED.has(target.projectId)
    ? ["hold_until_beta", "installing"]
    : ["hold_until_beta"];
  assert(allowed.includes(target.status), `${target.projectId} status ${target.status} not allowed (approved: ${allowed.join("/")})`);
}

if (contract.readModels) {
  const ownerDashboard = contract.readModels.owner_dashboard;
  assert(ownerDashboard, "readModels must define owner_dashboard");
  assert(ownerDashboard?.sections?.length >= 4, "owner_dashboard must have at least 4 sections");

  for (const section of ownerDashboard?.sections ?? []) {
    for (const entityId of section.entities) {
      assert(entityIds.has(entityId), `owner_dashboard section ${section.id} references missing entity ${entityId}`);
    }
    for (const questionId of section.answers) {
      assert(questionIds.has(questionId), `owner_dashboard section ${section.id} references missing question ${questionId}`);
    }
  }

  const trackIds = new Set(contract.verticalTracks.map((track) => track.id));
  for (const extensionTrackId of Object.keys(ownerDashboard?.verticalExtensions ?? {})) {
    assert(trackIds.has(extensionTrackId), `owner_dashboard extension references missing track ${extensionTrackId}`);
  }
}

if (contract.intakePolicy) {
  assert(contract.intakePolicy.channels?.length > 0, "intakePolicy must define channels");
  for (const channel of contract.intakePolicy.channels ?? []) {
    assert(channel.id && channel.workItemType && channel.gate !== undefined, `intake channel ${channel.id ?? "?"} needs id, workItemType and gate`);
  }
  assert(contract.intakePolicy.normalizationRules?.length >= 3, "intakePolicy needs at least 3 normalization rules");
}

if (contract.verticalFactory) {
  assert(contract.verticalFactory.pattern, "verticalFactory must define pattern");
  assert(contract.verticalFactory.roadmapRubros?.length > 0, "verticalFactory must define roadmapRubros");
  for (const rubro of contract.verticalFactory.roadmapRubros ?? []) {
    assert(rubro.rubro && rubro.vertical && rubro.estado, "each roadmap rubro needs rubro, vertical and estado");
  }
}

assert(Array.isArray(contract.schemaFiles), "schemaFiles must be an array");
for (const schemaFile of contract.schemaFiles) {
  assertRepoFile(schemaFile, "Schema file");

  const schema = readFileSync(repoPath(schemaFile), "utf8");
  for (const table of [
    "onia_core_areas",
    "onia_core_contacts",
    "onia_core_work_items",
    "onia_core_process_checklists",
    "onia_core_evidence",
    "onia_core_activity_events",
    "onia_core_import_batches",
    "onia_core_business_partners",
    "onia_core_role_assignments",
    "onia_core_comments",
    "onia_core_documents",
    "onia_core_approval_requests",
    "onia_core_schedule_events",
    "onia_core_saved_views",
    "onia_core_communication_channels",
  ]) {
    assert(schema.includes(table), `${schemaFile} must define ${table}`);
  }

  for (const slaColumn of ["sla_policy", "sla_due_at", "escalation_level"]) {
    assert(schema.includes(slaColumn), `${schemaFile} must define WorkItem SLA column ${slaColumn}`);
  }
}

assert(Array.isArray(contract.adapterFiles), "adapterFiles must be an array");
const adapters = [];

for (const adapterFile of contract.adapterFiles) {
  assertRepoFile(adapterFile, "Adapter file");
  adapters.push({ file: adapterFile, adapter: readJsonFile(adapterFile) });
}

assertUnique(adapters.map(({ adapter }) => ({ id: adapter.projectId })), "adapterFiles");

// Doble llave de adopcion: solo los proyectos listados aqui pueden estar en
// estado "installing" (cambiar esta lista + el adapter juntos, a proposito).
const ADOPTION_APPROVED = new Set(["dentagest"]);

for (const { file, adapter } of adapters) {
  assert(distributionProjectIds.has(adapter.projectId), `${file} references project outside distributionTargets`);
  const allowedStatuses = ADOPTION_APPROVED.has(adapter.projectId)
    ? ["mapped_not_installed", "installing"]
    : ["mapped_not_installed"];
  assert(allowedStatuses.includes(adapter.status), `${file} status ${adapter.status} not allowed (approved: ${allowedStatuses.join("/")})`);
  assert(Array.isArray(adapter.entityMappings), `${file} must include entityMappings`);
  assert(Array.isArray(adapter.capabilityMappings), `${file} must include capabilityMappings`);
  assert(adapter.blockedUntil?.length > 0, `${file} must include blockedUntil gates`);

  const mappedEntityIds = new Set(adapter.entityMappings.map((mapping) => mapping.coreEntityId));
  for (const entityId of entityIds) {
    assert(mappedEntityIds.has(entityId), `${file} must map core entity ${entityId}`);
  }

  for (const mapping of adapter.entityMappings) {
    assert(entityIds.has(mapping.coreEntityId), `${file} maps missing entity ${mapping.coreEntityId}`);
    assert(mapping.existingModel, `${file} entity ${mapping.coreEntityId} needs existingModel`);
    assert(mapping.status, `${file} entity ${mapping.coreEntityId} needs status`);
  }

  for (const mapping of adapter.capabilityMappings) {
    assert(capabilityIds.has(mapping.capabilityId), `${file} maps missing capability ${mapping.capabilityId}`);
    assert(mapping.status, `${file} capability ${mapping.capabilityId} needs status`);
  }

  const mappedCapabilityIds = new Set(adapter.capabilityMappings.map((mapping) => mapping.capabilityId));
  for (const coreCapabilityId of getCoreCapabilityIds(contract)) {
    assert(mappedCapabilityIds.has(coreCapabilityId), `${file} must map core capability ${coreCapabilityId}`);
  }
}

if (errors.length > 0) {
  console.error("ONIA Core contract validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`ONIA Core contract OK: ${contract.capabilities.length} capabilities, ${contract.entities.length} entities, ${contract.verticalTracks.length} tracks, ${adapters.length} adapters.`);
