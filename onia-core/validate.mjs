import {
  getBlockedCapabilitiesForTrack,
  getCapabilitiesByLayer,
  getCapability,
  loadOniaCoreContract,
} from "./index.mjs";

const contract = loadOniaCoreContract();
const errors = [];

function assert(condition, message) {
  if (!condition) {
    errors.push(message);
  }
}

function assertUnique(items, label) {
  const ids = items.map((item) => item.id);
  assert(new Set(ids).size === ids.length, `${label} must have unique ids`);
}

assert(contract.name === "ONIA Core", "Contract name must be ONIA Core");
assert(contract.policy?.installInProductRepos === false, "Product repo installation must stay disabled before beta");
assert(contract.questions.length === 10, "ONIA Core must keep the 10 operating questions");
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

if (errors.length > 0) {
  console.error("ONIA Core contract validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`ONIA Core contract OK: ${contract.capabilities.length} capabilities, ${contract.entities.length} entities, ${contract.verticalTracks.length} tracks.`);
