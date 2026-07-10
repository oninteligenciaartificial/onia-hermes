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
  it("cubre los 11 tracks verticales (4 originales + 7 nuevos definidos 2026-07-07)", () => {
    assert.equal(map.rubros.length, 11);
    assert.deepEqual(
      map.rubros.map((rubro) => rubro.id).sort(),
      [
        "dentagest-clinical",
        "esteticagest-clinical",
        "ganadero-offline",
        "gestios-educacion",
        "gestios-gastronomia",
        "gestios-general",
        "gestios-servicios-profesionales",
        "gestios-turismo",
        "proveegest-construccion",
        "proveegest-electrico",
        "vetgest-clinical",
      ].sort(),
    );
  });

  it("DentalGest necesita commerce/accounting/invoicing/payroll (compartidos) + dental (vertical, solo suyo) y tiene extension propia (odontograma)", () => {
    const dental = map.rubros.find((rubro) => rubro.id === "dentagest-clinical");
    assert.deepEqual(dental.moduleIds, ["accounting", "automation", "commerce", "dental", "invoicing", "payroll"]);
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
  it("accounting/invoicing/payroll/commerce/automation se repiten en los 11 rubros: TODO negocio compra/vende, necesita contabilidad/factura/planilla y quiere automatizar, sin importar el rubro", () => {
    for (const moduleId of ["accounting", "invoicing", "payroll", "commerce", "automation"]) {
      const usage = map.moduleUsage.find((entry) => entry.moduleId === moduleId);
      assert.equal(usage.usedByCount, 11, `${moduleId} deberia repetirse en los 11 rubros`);
    }
  });

  it("knowledge se repite en 2 rubros: ProveeGest electrico y ProveeGest construccion (ambos con catalogo tecnico via knowledge_article)", () => {
    const usage = map.moduleUsage.find((entry) => entry.moduleId === "knowledge");
    assert.equal(usage.usedByCount, 2);
    assert.deepEqual(usage.usedBy.sort(), ["proveegest-construccion", "proveegest-electrico"]);
  });
});

describe("sharedModules / unusedModules", () => {
  it("sharedModules(2) devuelve 6 modulos usados por 2+ rubros (todos menos dental, que es de 1 solo rubro)", () => {
    const shared = sharedModules(map, 2).map((entry) => entry.moduleId).sort();
    assert.deepEqual(shared, ["accounting", "automation", "commerce", "invoicing", "knowledge", "payroll"]);
  });

  it("Ganadero OS Offline SI necesita commerce/accounting/invoicing/payroll (un hato compra insumos, vende ganado y es una empresa formal con contabilidad/planilla igual que las demas verticales)", () => {
    const ganadero = map.rubros.find((rubro) => rubro.id === "ganadero-offline");
    assert.deepEqual(ganadero.moduleIds, ["accounting", "automation", "commerce", "invoicing", "payroll"]);
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
    // usedByCount maximo (11), no uno con menos repeticion (orden descendente).
    const usageLines = text.split("\n").filter((line) => line.includes("usado por"));
    assert.match(usageLines[0], /- (accounting|invoicing|payroll|commerce): usado por 11\/11/);
  });
});
