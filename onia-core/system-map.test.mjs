/*
 * Tests del mapa del sistema (core -> rubro -> modulos -> repeticion). Run:
 *   node --test onia-core/system-map.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { loadOniaCoreContract } from "./index.mjs";
import { loadAdapters } from "./report.mjs";
import { loadModules } from "./modules/index.mjs";
import { loadVerticalExtensions } from "./vertical-extensions.mjs";
import { buildSystemMap, renderSystemMap, sharedModules, unusedModules } from "./system-map.mjs";

const contract = loadOniaCoreContract();
const modules = loadModules();
const adapters = loadAdapters(contract);
const extensionsCatalog = loadVerticalExtensions();
const map = buildSystemMap(contract, modules, adapters, extensionsCatalog);

describe("buildSystemMap - capa CORE", () => {
  it("lista las 14 capabilities de capa core (nunca las de modulo/external_gate)", () => {
    assert.equal(map.core.capabilityCount, 14);
    assert.ok(!map.core.capabilityIds.includes("catalog_inventory"), "no incluye capabilities de modulo");
    assert.ok(!map.core.capabilityIds.includes("siat"), "no incluye external_gate");
  });
});

describe("buildSystemMap - capa RUBROS", () => {
  it("cubre los 4 tracks verticales", () => {
    assert.equal(map.rubros.length, 4);
    assert.deepEqual(
      map.rubros.map((rubro) => rubro.id).sort(),
      ["dentagest-clinical", "gestios-general", "ganadero-offline", "proveegest-electrico"].sort(),
    );
  });

  it("DentalGest necesita commerce/accounting/invoicing/payroll (compartidos) + dental (vertical, solo suyo) y tiene extension propia (odontograma)", () => {
    const dental = map.rubros.find((rubro) => rubro.id === "dentagest-clinical");
    assert.deepEqual(dental.moduleIds, ["accounting", "commerce", "dental", "invoicing", "payroll"]);
    assert.ok(dental.verticalExtensionIds.includes("odontogram_entry"));
  });

  it("dental es modulo de UN solo rubro: no aparece en ningun otro track", () => {
    for (const rubro of map.rubros) {
      if (rubro.id === "dentagest-clinical") continue;
      assert.ok(!rubro.moduleIds.includes("dental"), `${rubro.id} no deberia necesitar el modulo dental`);
    }
  });

  it("ProveeGest es el unico que necesita knowledge (catalogo tecnico del rubro)", () => {
    const proveegest = map.rubros.find((rubro) => rubro.id === "proveegest-electrico");
    assert.ok(proveegest.moduleIds.includes("knowledge"));
  });
});

describe("buildSystemMap - capa REPETICION", () => {
  it("accounting/invoicing/payroll/commerce se repiten en los 4 rubros: TODO negocio real compra/vende (commerce) y necesita contabilidad/factura/planilla (accounting/invoicing/payroll), sin importar si es offline-first", () => {
    for (const moduleId of ["accounting", "invoicing", "payroll", "commerce"]) {
      const usage = map.moduleUsage.find((entry) => entry.moduleId === moduleId);
      assert.equal(usage.usedByCount, 4, `${moduleId} deberia repetirse en los 4 rubros`);
      assert.deepEqual(
        usage.usedBy.sort(),
        ["gestios-general", "dentagest-clinical", "ganadero-offline", "proveegest-electrico"].sort(),
      );
    }
  });

  it("knowledge NO se repite: solo lo usa ProveeGest (1 rubro, catalogo tecnico del distribuidor)", () => {
    const usage = map.moduleUsage.find((entry) => entry.moduleId === "knowledge");
    assert.equal(usage.usedByCount, 1);
  });
});

describe("sharedModules / unusedModules", () => {
  it("sharedModules(2) devuelve los 4 modulos usados por 2+ rubros (todos menos knowledge y dental, que son de 1 solo rubro)", () => {
    const shared = sharedModules(map, 2).map((entry) => entry.moduleId).sort();
    assert.deepEqual(shared, ["accounting", "commerce", "invoicing", "payroll"]);
  });

  it("Ganadero OS Offline SI necesita commerce/accounting/invoicing/payroll (un hato compra insumos, vende ganado y es una empresa formal con contabilidad/planilla igual que las demas verticales)", () => {
    const ganadero = map.rubros.find((rubro) => rubro.id === "ganadero-offline");
    assert.deepEqual(ganadero.moduleIds, ["accounting", "commerce", "invoicing", "payroll"]);
    // Solo knowledge queda fuera: es catalogo tecnico especifico de ProveeGest,
    // no una necesidad generica de cualquier rubro.
    assert.ok(!ganadero.moduleIds.includes("knowledge"));
  });

  it("unusedModules esta vacio: los 6 modulos los usa al menos 1 rubro", () => {
    assert.deepEqual(unusedModules(map), []);
  });
});

describe("renderSystemMap", () => {
  it("arma las 4 secciones y nombra el modulo mas repetido primero", () => {
    const text = renderSystemMap(map);
    assert.match(text, /1\. CORE/);
    assert.match(text, /2-3\. RUBROS/);
    assert.match(text, /4\. QUE RUBROS REPITEN/);
    assert.match(text, /odontogram_entry/);
    // El primer modulo listado en la seccion de repeticion debe ser uno con
    // usedByCount maximo (4), no uno con menos repeticion (orden descendente).
    const usageLines = text.split("\n").filter((line) => line.includes("usado por"));
    assert.match(usageLines[0], /- (accounting|invoicing|payroll|commerce): usado por 4\/4/);
  });
});
