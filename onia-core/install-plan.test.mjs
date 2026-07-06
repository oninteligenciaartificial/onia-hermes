/*
 * Tests del generador de plan de instalacion. Run:
 *   node --test onia-core/install-plan.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { loadOniaCoreContract } from "./index.mjs";
import { loadAdapters } from "./report.mjs";
import { loadModules } from "./modules/index.mjs";
import { buildInstallPlan, renderInstallPlan } from "./install-plan.mjs";

const contract = loadOniaCoreContract();
const modules = loadModules();
const adapters = loadAdapters(contract);

describe("buildInstallPlan por producto", () => {
  const plan = buildInstallPlan(contract, modules, adapters, { projectId: "bolivian-electric" });

  it("resuelve el track y TODOS los modulos que aplican (los que llenan un slot del core y los que proveen su propia capability)", () => {
    assert.equal(plan.trackId, "proveegest-electrico");
    assert.equal(plan.ready, true);
    const moduleIds = plan.modules.map((module) => module.module);
    assert.ok(moduleIds.includes("commerce"));
    assert.ok(moduleIds.includes("knowledge"));
    // accounting/invoicing/payroll PROVEEN su propia capability (no llenan un
    // slot del core) pero declaran este track en su verticalTracks -> deben
    // aparecer.
    assert.ok(moduleIds.includes("accounting"));
    assert.ok(moduleIds.includes("invoicing"));
    assert.ok(moduleIds.includes("payroll"));
  });

  it("cada modulo trae su schema y tablas", () => {
    const commerce = plan.modules.find((module) => module.module === "commerce");
    assert.match(commerce.schemaFile, /commerce\.schema\.sql$/);
    assert.ok(commerce.tables.length >= 12);
  });

  it("lista el core pendiente (no lo ya cubierto) y la logica a portar", () => {
    assert.ok(!plan.core.pendingEntities.includes("organization"), "organization ya existe -> no se instala");
    assert.ok(plan.core.pendingEntities.includes("comment"), "comment esta pendiente");
    assert.equal(plan.logicToPort.core.length, 8);
    assert.ok(plan.logicToPort.modules.includes("@onia/core/modules/commerce-logic"));
    assert.ok(plan.logicToPort.modules.includes("@onia/core/modules/accounting-logic"));
    assert.ok(plan.logicToPort.modules.includes("@onia/core/modules/invoicing-logic"));
    assert.ok(plan.logicToPort.modules.includes("@onia/core/modules/payroll-logic"));
    assert.ok(plan.logicToPort.modules.includes("@onia/core/modules/bridge-logic"));
  });
});

describe("buildInstallPlan por track (sin adapter)", () => {
  it("sin adapter, todas las entidades del core son a instalar; incluye modulos que llenan un slot del core (commerce) y los que declaran el track sin llenar uno (accounting/invoicing/payroll)", () => {
    const plan = buildInstallPlan(contract, modules, adapters, { trackId: "gestios-general" });
    assert.equal(plan.trackId, "gestios-general");
    assert.equal(plan.core.pendingEntities.length, contract.entities.length);
    // gestios-general requiere catalog_inventory/sales_cash (commerce cubre ese
    // slot del core) y ademas accounting/invoicing/payroll declaran este track
    // en su propio verticalTracks sin llenar un slot.
    const moduleIds = plan.modules.map((module) => module.module).sort();
    assert.deepEqual(moduleIds, ["accounting", "commerce", "invoicing", "payroll"]);
  });
});

describe("renderInstallPlan", () => {
  it("arma un checklist con los 4 pasos", () => {
    const plan = buildInstallPlan(contract, modules, adapters, { projectId: "bolivian-electric" });
    const text = renderInstallPlan(plan);
    assert.match(text, /1\. CORE/);
    assert.match(text, /2\. MODULOS/);
    assert.match(text, /3\. PORTAR LOGICA/);
    assert.match(text, /4\. CABLEAR/);
    assert.match(text, /commerce\.schema\.sql/);
  });
});
