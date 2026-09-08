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
  it("cubre los 12 tracks: 11 de negocio + la operacion propia de Onia", () => {
    assert.equal(map.rubros.length, 12);
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
        // La operacion propia de Onia (2026-09-07): no es un rubro que se venda,
        // es la organizacion desde la que se maneja la plataforma. Va en el
        // contrato como cualquier otro track porque el producto exige que TODA
        // organizacion tenga uno — `verticalTrackId` es NOT NULL.
        "onia-interna",
        "proveegest-construccion",
        "proveegest-electrico",
        "vetgest-clinical",
      ].sort(),
    );
  });

  it("DentalGest necesita commerce/accounting/invoicing/payroll (compartidos) + dental (vertical, solo suyo) y tiene extension propia (odontograma)", () => {
    const dental = map.rubros.find((rubro) => rubro.id === "dentagest-clinical");
    assert.deepEqual(dental.moduleIds, ["accounting", "agents", "automation", "commerce", "dental", "invoicing", "payroll"]);
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
    // Los modulos de negocio los usan TODOS los rubros de negocio. Se cuenta
    // "todos menos los internos" y no un 11 a mano: al nacer onia-interna
    // (2026-09-07) el numero paso a 11/12 y el test se caia sin que nada
    // estuviera mal. La operacion propia de Onia no factura ni vende: por eso
    // no usa estos modulos, y eso es correcto, no una regresion.
    const rubrosDeNegocio = map.rubros.filter((r) => r.id !== "onia-interna").length;
    for (const moduleId of ["accounting", "invoicing", "payroll", "commerce", "automation"]) {
      const usage = map.moduleUsage.find((entry) => entry.moduleId === moduleId);
      assert.equal(usage.usedByCount, rubrosDeNegocio, `${moduleId} deberia repetirse en TODOS los rubros de negocio`);
    }
  });

  it("knowledge lo comparten los dos ProveeGest (catalogo tecnico) y la operacion propia de Onia", () => {
    // onia-interna se suma el 2026-09-07: desde esa organizacion se edita el
    // conocimiento de los chatbots, asi que necesita `knowledge_base`. No es
    // catalogo tecnico como los ProveeGest — llega al mismo modulo por otra
    // razon, y por eso el nombre del test ya no dice "ambos".
    const usage = map.moduleUsage.find((entry) => entry.moduleId === "knowledge");
    assert.deepEqual(usage.usedBy.sort(), [
      "onia-interna",
      "proveegest-construccion",
      "proveegest-electrico",
    ]);
    assert.equal(usage.usedByCount, usage.usedBy.length);
  });
});

describe("sharedModules / unusedModules", () => {
  it("sharedModules(2) devuelve 8 modulos usados por 2+ rubros (todos menos dental, que es de 1 solo rubro)", () => {
    const shared = sharedModules(map, 2).map((entry) => entry.moduleId).sort();
    assert.deepEqual(shared, ["accounting", "agents", "automation", "commerce", "imports", "invoicing", "knowledge", "payroll"]);
  });

  it("Ganadero OS Offline SI necesita commerce/accounting/invoicing/payroll (un hato compra insumos, vende ganado y es una empresa formal con contabilidad/planilla igual que las demas verticales)", () => {
    const ganadero = map.rubros.find((rubro) => rubro.id === "ganadero-offline");
    assert.deepEqual(ganadero.moduleIds, ["accounting", "agents", "automation", "commerce", "invoicing", "payroll"]);
    // Solo knowledge queda fuera: es catalogo tecnico especifico de ProveeGest,
    // no una necesidad generica de cualquier rubro.
    assert.ok(!ganadero.moduleIds.includes("knowledge"));
  });

  it("unusedModules esta vacio: todos los modulos los usa al menos 1 rubro", () => {
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
    // usedByCount maximo, no uno con menos repeticion (orden descendente).
    //
    // Se afirma el ORDEN, no el numero: antes decia "11/11" a mano y se rompio
    // al nacer el rubro 12 (onia-interna, 2026-09-07), que por ser la operacion
    // propia NO usa accounting/invoicing/payroll/commerce. Un test que se cae
    // cada vez que nace un rubro no cuida nada: lo que importa es que el mas
    // repetido salga primero.
    const usageLines = text.split("\n").filter((line) => line.includes("usado por"));
    const cuentas = usageLines.map((l) => Number(l.match(/usado por (\d+)\//)[1]));
    assert.equal(cuentas[0], Math.max(...cuentas), "el mas repetido va primero");
    for (let i = 1; i < cuentas.length; i++) {
      assert.ok(cuentas[i] <= cuentas[i - 1], "la lista viene en orden descendente");
    }
  });
});
