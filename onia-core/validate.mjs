import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  getBlockedCapabilitiesForTrack,
  getCapabilitiesByLayer,
  getCapability,
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
assert(["canonical_draft", "alpha", "beta"].includes(contract.status), "Contract status must be canonical_draft, alpha or beta");
assert(contract.policy?.installInProductRepos === false, "Product repo installation must stay disabled before beta");
assert(contract.questions.length === 10, "ONIA Core must keep the 10 operating questions");
assertRepoFile(contract.researchResult, "Research result");

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
}

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

for (const target of contract.distributionTargets) {
  assert(target.status === "hold_until_beta", `${target.projectId} must stay on hold until beta`);
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
  ]) {
    assert(schema.includes(table), `${schemaFile} must define ${table}`);
  }
}

assert(Array.isArray(contract.adapterFiles), "adapterFiles must be an array");
const adapters = [];

for (const adapterFile of contract.adapterFiles) {
  assertRepoFile(adapterFile, "Adapter file");
  adapters.push({ file: adapterFile, adapter: readJsonFile(adapterFile) });
}

assertUnique(adapters.map(({ adapter }) => ({ id: adapter.projectId })), "adapterFiles");

for (const { file, adapter } of adapters) {
  assert(distributionProjectIds.has(adapter.projectId), `${file} references project outside distributionTargets`);
  assert(adapter.status === "mapped_not_installed", `${file} must stay mapped_not_installed before beta`);
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
}

if (errors.length > 0) {
  console.error("ONIA Core contract validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`ONIA Core contract OK: ${contract.capabilities.length} capabilities, ${contract.entities.length} entities, ${contract.verticalTracks.length} tracks, ${adapters.length} adapters.`);
