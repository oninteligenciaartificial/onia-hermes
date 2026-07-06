/*
 * Tests del catalogo de funciones especificas por rubro
 * (vertical-extensions.json + helpers). Run:
 *   node --test onia-core/vertical-extensions.test.mjs
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getVerticalExtension,
  getVerticalExtensionEntities,
  hasVerticalSpecificEntities,
  loadVerticalExtensions,
} from "./vertical-extensions.mjs";

const catalog = loadVerticalExtensions();

describe("loadVerticalExtensions", () => {
  it("carga una extension por cada uno de los 4 tracks verticales", () => {
    assert.equal(catalog.extensions.length, 4);
    const trackIds = catalog.extensions.map((extension) => extension.trackId).sort();
    assert.deepEqual(trackIds, [
      "dentagest-clinical",
      "gestios-general",
      "ganadero-offline",
      "proveegest-electrico",
    ].sort());
  });
});

describe("getVerticalExtension / getVerticalExtensionEntities", () => {
  it("dental incluye el odontograma (la funcion que ningun otro rubro necesita)", () => {
    const entities = getVerticalExtensionEntities(catalog, "dentagest-clinical");
    const ids = entities.map((entity) => entity.id);
    assert.ok(ids.includes("odontogram_entry"), "tiene odontogram_entry");
    assert.ok(ids.includes("informed_consent"), "tiene informed_consent");
  });

  it("ganado incluye trazabilidad SENASAG (guia de movimiento, marca/hierro)", () => {
    const entities = getVerticalExtensionEntities(catalog, "ganadero-offline");
    const ids = entities.map((entity) => entity.id);
    assert.ok(ids.includes("movement_guide"), "tiene movement_guide (GMA)");
    assert.ok(ids.includes("brand_registration"), "tiene brand_registration");
  });

  it("devuelve undefined/vacio para un track sin extension", () => {
    assert.equal(getVerticalExtension(catalog, "ghost-track"), undefined);
    assert.deepEqual(getVerticalExtensionEntities(catalog, "ghost-track"), []);
  });
});

describe("hasVerticalSpecificEntities", () => {
  it("dental y ganado SI tienen extension propia; gestios-general NO (es el generico)", () => {
    assert.equal(hasVerticalSpecificEntities(catalog, "dentagest-clinical"), true);
    assert.equal(hasVerticalSpecificEntities(catalog, "ganadero-offline"), true);
    assert.equal(hasVerticalSpecificEntities(catalog, "gestios-general"), false);
  });
});

describe("ninguna entidad especifica de rubro choca con una entidad del core", () => {
  it("odontogram_entry, movement_guide, etc. no son nombres de entidades del core", () => {
    for (const extension of catalog.extensions) {
      for (const entity of extension.entities) {
        assert.ok(entity.id && entity.name && entity.purpose, `${extension.trackId}/${entity.id} completo`);
      }
    }
  });
});

describe("validador de vertical-extensions", () => {
  it("vertical-extensions.json pasa validate-vertical-extensions.mjs (exit 0)", () => {
    const validatePath = fileURLToPath(new URL("./validate-vertical-extensions.mjs", import.meta.url));
    const result = spawnSync(process.execPath, [validatePath], { encoding: "utf8" });

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(result.stdout, /ONIA Vertical Extensions OK/);
  });
});
