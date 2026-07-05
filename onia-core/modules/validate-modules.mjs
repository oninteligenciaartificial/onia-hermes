/*
 * Validador de los modulos vendibles de ONIA Core.
 * Lee el contrato core (read-only) + todos los modulos de onia-core/modules/ y
 * verifica que cada modulo sea coherente con el core SIN tocarlo:
 *   - solo activa capabilities de capa modulo (nunca core ni external_gate);
 *   - depende solo de entidades core reales;
 *   - referencia solo tracks verticales existentes;
 *   - sus entidades son tenant-scoped, unicas y no chocan con ids del core;
 *   - cada capability activada tiene al menos una entidad que la implementa.
 *
 * Run: node onia-core/modules/validate-modules.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { loadOniaCoreContract } from "../index.mjs";
import { loadModules } from "./index.mjs";

const contract = loadOniaCoreContract();
const modules = loadModules();
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const errors = [];

function assert(condition, message) {
  if (!condition) {
    errors.push(message);
  }
}

const coreEntityIds = new Set(contract.entities.map((entity) => entity.id));
const capabilityById = new Map(contract.capabilities.map((capability) => [capability.id, capability]));
const trackIds = new Set(contract.verticalTracks.map((track) => track.id));
const moduleLayers = new Set(["activatable_module", "vertical_extension"]);

assert(modules.length > 0, "no modules found in onia-core/modules");

const seenModuleIds = new Set();
for (const module of modules) {
  const label = module.module ?? "?";

  assert(module.module, "module needs a module id");
  assert(!seenModuleIds.has(module.module), `duplicate module ${label}`);
  seenModuleIds.add(module.module);
  assert(/^\d+\.\d+\.\d+$/.test(module.version ?? ""), `${label} version must be semver (x.y.z)`);
  assert(["draft", "alpha", "beta"].includes(module.status), `${label} status must be draft, alpha or beta`);
  assert(module.installInProductRepos === false, `${label} must keep installInProductRepos false`);
  assert(module.purpose, `${label} needs a purpose`);

  // Un modulo solo activa capabilities de capa modulo del core.
  assert(
    Array.isArray(module.activatesCapabilities) && module.activatesCapabilities.length > 0,
    `${label} must activate at least one capability`,
  );
  for (const capabilityId of module.activatesCapabilities ?? []) {
    const capability = capabilityById.get(capabilityId);
    assert(capability, `${label} activates missing capability ${capabilityId}`);
    if (capability) {
      assert(
        moduleLayers.has(capability.layer),
        `${label} activates ${capabilityId} which is layer ${capability.layer}, not a module layer`,
      );
    }
  }

  // Dependencias al core: entidades reales.
  for (const dependency of module.coreDependencies ?? []) {
    assert(
      coreEntityIds.has(dependency.coreEntityId),
      `${label} depends on missing core entity ${dependency.coreEntityId}`,
    );
  }

  // Tracks verticales existentes.
  for (const trackId of module.verticalTracks ?? []) {
    assert(trackIds.has(trackId), `${label} references missing vertical track ${trackId}`);
  }

  // Entidades del modulo.
  const activated = new Set(module.activatesCapabilities ?? []);
  const seenEntityIds = new Set();
  const coveredCapabilities = new Set();
  assert(Array.isArray(module.entities) && module.entities.length > 0, `${label} must define entities`);
  for (const entity of module.entities ?? []) {
    assert(entity.id, `${label} has an entity without id`);
    assert(!seenEntityIds.has(entity.id), `${label} duplicate entity ${entity.id}`);
    seenEntityIds.add(entity.id);
    assert(!coreEntityIds.has(entity.id), `${label} entity ${entity.id} collides with a core entity id`);
    assert(entity.name, `${label} entity ${entity.id} needs a name`);
    assert(entity.purpose, `${label} entity ${entity.id} needs a purpose`);
    assert(
      Array.isArray(entity.requiredFields) && entity.requiredFields.includes("id"),
      `${label} entity ${entity.id} requiredFields must include id`,
    );
    assert(
      entity.tenantScoped === false || entity.requiredFields?.includes("organizationId"),
      `${label} entity ${entity.id} must be tenant-scoped or explicitly root`,
    );
    assert(
      activated.has(entity.capabilityId),
      `${label} entity ${entity.id} maps to capability ${entity.capabilityId} not activated by the module`,
    );
    coveredCapabilities.add(entity.capabilityId);
  }

  // Cada capability activada tiene al menos una entidad que la implementa.
  for (const capabilityId of activated) {
    assert(coveredCapabilities.has(capabilityId), `${label} activates ${capabilityId} but no entity implements it`);
  }

  // Si el modulo declara SQL base, existe y define la tabla de cada entidad.
  if (module.schemaFile) {
    const schemaPath = resolve(repoRoot, module.schemaFile);
    assert(existsSync(schemaPath), `${label} schemaFile missing: ${module.schemaFile}`);
    if (existsSync(schemaPath)) {
      const schema = readFileSync(schemaPath, "utf8");
      for (const entity of module.entities ?? []) {
        assert(entity.table, `${label} entity ${entity.id} needs a table when schemaFile is set`);
        if (entity.table) {
          assert(schema.includes(entity.table), `${label} schema must define table ${entity.table}`);
        }
      }
    }
  }
}

if (errors.length > 0) {
  console.error("ONIA Core modules validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

const entityCount = modules.reduce((sum, module) => sum + (module.entities?.length ?? 0), 0);
console.log(`ONIA Core modules OK: ${modules.length} module(s), ${entityCount} entities.`);
