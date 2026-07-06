/*
 * Validador de business-tiers.json. Verifica que el empaquetado comercial
 * (planes pymes + Empresarial) referencie SOLO capabilities/modulos/tracks
 * reales, y que la estructura sea coherente (familias/niveles unicos, limites
 * con forma valida). Read-only respecto al contrato y a los modulos.
 *
 * Run: node onia-core/validate-business-tiers.mjs
 */
import { loadOniaCoreContract } from "./index.mjs";
import { loadBusinessTiers } from "./business-tiers.mjs";
import { loadModules } from "./modules/index.mjs";

const contract = loadOniaCoreContract();
const tiersDoc = loadBusinessTiers();
const modules = loadModules();
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

const capabilityById = new Map(contract.capabilities.map((capability) => [capability.id, capability]));
const trackIds = new Set(contract.verticalTracks.map((track) => track.id));
const moduleIds = new Set(modules.map((module) => module.module));
const familyIds = new Set(tiersDoc.families.map((family) => family.id));

assert(Array.isArray(tiersDoc.families) && tiersDoc.families.length > 0, "families must be a non-empty array");
assert(Array.isArray(tiersDoc.tiers) && tiersDoc.tiers.length > 0, "tiers must be a non-empty array");
assertUnique(tiersDoc.families, "families");
assertUnique(tiersDoc.tiers, "tiers");

for (const family of tiersDoc.families) {
  assert(family.appliesToVerticalTracks?.length > 0, `family ${family.id} must apply to at least one vertical track`);
  for (const trackId of family.appliesToVerticalTracks ?? []) {
    assert(trackIds.has(trackId), `family ${family.id} references missing vertical track ${trackId}`);
  }
}

const LIMIT_KEYS = ["maxUsers", "maxSucursales", "maxBridges"];

for (const tier of tiersDoc.tiers) {
  assert(familyIds.has(tier.familyId), `tier ${tier.id} references missing family ${tier.familyId}`);
  assert(tier.limits && typeof tier.limits === "object", `tier ${tier.id} needs a limits object`);

  for (const key of LIMIT_KEYS) {
    const value = tier.limits?.[key];
    assert(
      value === null || typeof value === "number",
      `tier ${tier.id} limits.${key} must be a number or null (sin tope), got ${JSON.stringify(value)}`,
    );
  }

  assert(Array.isArray(tier.coreCapabilities) && tier.coreCapabilities.length > 0, `tier ${tier.id} needs coreCapabilities`);
  for (const capabilityId of tier.coreCapabilities) {
    const capability = capabilityById.get(capabilityId);
    assert(capability, `tier ${tier.id} references missing capability ${capabilityId}`);
    if (capability) {
      assert(capability.layer === "core", `tier ${tier.id} coreCapabilities must be layer=core, ${capabilityId} is ${capability.layer}`);
    }
  }

  assert(Array.isArray(tier.modules), `tier ${tier.id} modules must be an array`);
  for (const moduleRef of tier.modules ?? []) {
    assert(moduleRef.id, `tier ${tier.id} has a module entry without id`);
    assert(moduleIds.has(moduleRef.id), `tier ${tier.id} references missing module ${moduleRef.id}`);
    assert(moduleRef.focus, `tier ${tier.id} module ${moduleRef.id} needs a focus note`);
  }

  for (const gateId of tier.unlockedExternalGates ?? []) {
    const capability = capabilityById.get(gateId);
    assert(capability, `tier ${tier.id} references missing external gate ${gateId}`);
    if (capability) {
      assert(capability.layer === "external_gate", `tier ${tier.id} unlockedExternalGates must be layer=external_gate, ${gateId} is ${capability.layer}`);
    }
  }
}

// Cada familia debe tener al menos un tier (evita familias huerfanas).
const familyIdsWithTiers = new Set(tiersDoc.tiers.map((tier) => tier.familyId));
for (const family of tiersDoc.families) {
  assert(familyIdsWithTiers.has(family.id), `family ${family.id} has no tiers`);
}

// Dentro de una familia, los niveles superiores no deben PERDER una
// capability/modulo que ya tenia un nivel inferior (monotonia: mas caro nunca
// da menos).
for (const family of tiersDoc.families) {
  const tiers = tiersDoc.tiers.filter((tier) => tier.familyId === family.id);
  for (let i = 1; i < tiers.length; i += 1) {
    const previous = tiers[i - 1];
    const current = tiers[i];
    for (const capabilityId of previous.coreCapabilities) {
      assert(
        current.coreCapabilities.includes(capabilityId),
        `tier ${current.id} must keep capability ${capabilityId} already present in ${previous.id} (monotonia de niveles)`,
      );
    }
    const previousModuleIds = new Set(previous.modules.map((module) => module.id));
    const currentModuleIds = new Set(current.modules.map((module) => module.id));
    for (const moduleId of previousModuleIds) {
      assert(
        currentModuleIds.has(moduleId),
        `tier ${current.id} must keep module ${moduleId} already present in ${previous.id} (monotonia de niveles)`,
      );
    }
  }
}

if (errors.length > 0) {
  console.error("ONIA Business Tiers validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`ONIA Business Tiers OK: ${tiersDoc.families.length} families, ${tiersDoc.tiers.length} tiers.`);
