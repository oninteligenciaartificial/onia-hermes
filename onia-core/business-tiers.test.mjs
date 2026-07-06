/*
 * Tests de los niveles de tamano de negocio (business-tiers.json + helpers).
 * Run: node --test onia-core/business-tiers.test.mjs
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getFamily,
  getFamilyForVerticalTrack,
  getTier,
  getTiersForFamily,
  getTiersForVerticalTrack,
  loadBusinessTiers,
  moduleIdsForTier,
  recommendTierForLimits,
  tierMeetsLimits,
} from "./business-tiers.mjs";

const tiersDoc = loadBusinessTiers();

describe("loadBusinessTiers", () => {
  it("carga 2 familias y 6 niveles", () => {
    assert.equal(tiersDoc.families.length, 2);
    assert.equal(tiersDoc.tiers.length, 6);
  });
});

describe("getFamily / getTier / getTiersForFamily", () => {
  it("resuelve familia y nivel por id", () => {
    assert.equal(getFamily(tiersDoc, "pyme")?.name, "Planes pymes");
    assert.equal(getTier(tiersDoc, "empresa")?.priceMonthlyBob, 1990);
  });

  it("devuelve undefined para ids inexistentes", () => {
    assert.equal(getFamily(tiersDoc, "ghost"), undefined);
    assert.equal(getTier(tiersDoc, "ghost"), undefined);
  });

  it("lista los niveles de una familia en orden creciente", () => {
    const pymeTiers = getTiersForFamily(tiersDoc, "pyme").map((tier) => tier.id);
    assert.deepEqual(pymeTiers, ["ordenado", "profesional", "empresa"]);

    const empresarialTiers = getTiersForFamily(tiersDoc, "empresarial").map((tier) => tier.id);
    assert.deepEqual(empresarialTiers, ["e1", "e2", "e3"]);
  });
});

describe("getFamilyForVerticalTrack / getTiersForVerticalTrack", () => {
  it("dentagest-clinical y gestios-general usan la familia pyme", () => {
    assert.equal(getFamilyForVerticalTrack(tiersDoc, "dentagest-clinical")?.id, "pyme");
    assert.equal(getFamilyForVerticalTrack(tiersDoc, "gestios-general")?.id, "pyme");
  });

  it("proveegest-electrico usa la familia empresarial", () => {
    assert.equal(getFamilyForVerticalTrack(tiersDoc, "proveegest-electrico")?.id, "empresarial");
    const tiers = getTiersForVerticalTrack(tiersDoc, "proveegest-electrico").map((tier) => tier.id);
    assert.deepEqual(tiers, ["e1", "e2", "e3"]);
  });

  it("un track sin familia asignada devuelve vacio", () => {
    assert.equal(getFamilyForVerticalTrack(tiersDoc, "ghost-track"), undefined);
    assert.deepEqual(getTiersForVerticalTrack(tiersDoc, "ghost-track"), []);
  });
});

describe("moduleIdsForTier", () => {
  it("ordenado no trae modulos; empresa trae accounting/commerce/invoicing", () => {
    assert.deepEqual(moduleIdsForTier(getTier(tiersDoc, "ordenado")), []);
    assert.deepEqual(moduleIdsForTier(getTier(tiersDoc, "empresa")).sort(), ["accounting", "commerce", "invoicing"]);
  });

  it("e1/e2/e3 traen los 5 modulos completos", () => {
    for (const tierId of ["e1", "e2", "e3"]) {
      const ids = moduleIdsForTier(getTier(tiersDoc, tierId)).sort();
      assert.deepEqual(ids, ["accounting", "commerce", "invoicing", "knowledge", "payroll"]);
    }
  });
});

describe("tierMeetsLimits / recommendTierForLimits", () => {
  it("un limite null (sin tope) siempre alcanza", () => {
    const e1 = getTier(tiersDoc, "e1"); // maxUsers: null
    assert.equal(tierMeetsLimits(e1, { maxUsers: 500 }), true);
  });

  it("un limite numerico exige >= lo pedido", () => {
    const ordenado = getTier(tiersDoc, "ordenado"); // maxUsers: 3
    assert.equal(tierMeetsLimits(ordenado, { maxUsers: 3 }), true);
    assert.equal(tierMeetsLimits(ordenado, { maxUsers: 4 }), false);
  });

  it("recomienda el nivel MAS CHICO que alcanza (no siempre el mayor)", () => {
    assert.equal(recommendTierForLimits(tiersDoc, "pyme", { maxUsers: 5, maxSucursales: 1 })?.id, "profesional");
    assert.equal(recommendTierForLimits(tiersDoc, "pyme", { maxUsers: 2, maxSucursales: 1 })?.id, "ordenado");
    assert.equal(recommendTierForLimits(tiersDoc, "pyme", { maxSucursales: 3 })?.id, "empresa");
  });

  it("devuelve null si ningun nivel de la familia alcanza", () => {
    assert.equal(recommendTierForLimits(tiersDoc, "pyme", { maxSucursales: 10 }), null);
  });
});

describe("validador de business-tiers", () => {
  it("business-tiers.json pasa validate-business-tiers.mjs (exit 0)", () => {
    const validatePath = fileURLToPath(new URL("./validate-business-tiers.mjs", import.meta.url));
    const result = spawnSync(process.execPath, [validatePath], { encoding: "utf8" });

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(result.stdout, /ONIA Business Tiers OK/);
  });
});
