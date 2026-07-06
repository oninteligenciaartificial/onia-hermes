/*
 * Validador de vertical-extensions.json. Verifica que cada extension
 * referencie un track real y entidades del core reales, que las entidades
 * declaradas no choquen con ids de entidades del core (serian del core, no
 * del producto), y que cada track vertical tenga como maximo una extension.
 *
 * Run: node onia-core/validate-vertical-extensions.mjs
 */
import { loadOniaCoreContract } from "./index.mjs";
import { loadVerticalExtensions } from "./vertical-extensions.mjs";

const contract = loadOniaCoreContract();
const catalog = loadVerticalExtensions();
const errors = [];

function assert(condition, message) {
  if (!condition) {
    errors.push(message);
  }
}

const trackIds = new Set(contract.verticalTracks.map((track) => track.id));
const coreEntityIds = new Set(contract.entities.map((entity) => entity.id));

assert(Array.isArray(catalog.extensions) && catalog.extensions.length > 0, "extensions must be a non-empty array");

const seenTrackIds = new Set();
for (const extension of catalog.extensions) {
  assert(trackIds.has(extension.trackId), `extension references missing vertical track ${extension.trackId}`);
  assert(!seenTrackIds.has(extension.trackId), `duplicate extension for track ${extension.trackId}`);
  seenTrackIds.add(extension.trackId);

  assert(extension.product, `extension for ${extension.trackId} needs a product name`);
  assert(Array.isArray(extension.entities), `extension for ${extension.trackId} entities must be an array`);

  const seenEntityIds = new Set();
  for (const entity of extension.entities ?? []) {
    assert(entity.id, `extension ${extension.trackId} has an entity without id`);
    assert(!seenEntityIds.has(entity.id), `extension ${extension.trackId} duplicate entity ${entity.id}`);
    seenEntityIds.add(entity.id);
    assert(!coreEntityIds.has(entity.id), `extension ${extension.trackId} entity ${entity.id} collides with a core entity id`);
    assert(entity.name && entity.purpose, `extension ${extension.trackId} entity ${entity.id} needs name and purpose`);
  }

  for (const hook of extension.coreHooks ?? []) {
    assert(coreEntityIds.has(hook.coreEntityId), `extension ${extension.trackId} coreHook references missing core entity ${hook.coreEntityId}`);
    assert(hook.as, `extension ${extension.trackId} coreHook for ${hook.coreEntityId} needs an "as" description`);
  }
}

if (errors.length > 0) {
  console.error("ONIA Vertical Extensions validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

const entityCount = catalog.extensions.reduce((sum, extension) => sum + extension.entities.length, 0);
console.log(`ONIA Vertical Extensions OK: ${catalog.extensions.length} tracks, ${entityCount} vertical-specific entities.`);
