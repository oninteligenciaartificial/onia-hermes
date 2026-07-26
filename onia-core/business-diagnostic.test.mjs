/*
 * Tests del resolver de diagnostico de negocio. Run:
 *   node --test onia-core/business-diagnostic.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { loadBusinessTiers } from "./business-tiers.mjs";
import {
  collectLimitSignals,
  collectRequiredModules,
  getQuestion,
  loadBusinessDiagnostic,
  renderDiagnosticResult,
  resolveDiagnostic,
  resolveTrackId,
} from "./business-diagnostic.mjs";

const diagnostic = loadBusinessDiagnostic();
const tiersDoc = loadBusinessTiers();

describe("loadBusinessDiagnostic", () => {
  it("carga las 6 preguntas del diagnostico", () => {
    assert.equal(diagnostic.questions.length, 6);
    assert.ok(getQuestion(diagnostic, "rubro"));
    assert.equal(getQuestion(diagnostic, "ghost"), undefined);
  });
});

describe("resolveTrackId", () => {
  it("mapea cada opcion de rubro a su track real", () => {
    assert.equal(resolveTrackId(diagnostic, { rubro: "clinica_dental" }), "dentagest-clinical");
    assert.equal(resolveTrackId(diagnostic, { rubro: "distribucion_importacion" }), "proveegest-electrico");
    assert.equal(resolveTrackId(diagnostic, { rubro: "ganaderia" }), "ganadero-offline");
    assert.equal(resolveTrackId(diagnostic, { rubro: "otro_comercio_servicio" }), "gestios-general");
  });

  it("devuelve null si no hay respuesta o no matchea ninguna opcion", () => {
    assert.equal(resolveTrackId(diagnostic, {}), null);
    assert.equal(resolveTrackId(diagnostic, { rubro: "no_existe" }), null);
  });
});

describe("collectLimitSignals", () => {
  it("toma el maximo de cada senal (mas_20 empleados = senal 21)", () => {
    const signals = collectLimitSignals(diagnostic, { empleados: "mas_20", sucursales: "2_3" });
    assert.equal(signals.maxUsers, 21);
    assert.equal(signals.maxSucursales, 3);
  });

  it("ignora preguntas sin respuesta", () => {
    assert.deepEqual(collectLimitSignals(diagnostic, {}), {});
  });
});

describe("collectRequiredModules", () => {
  it("junta los modulos pedidos explicitamente sin duplicar", () => {
    const modules = collectRequiredModules(diagnostic, {
      facturacion_electronica: "si_ya",
      empleados_formales: "si",
    });
    assert.deepEqual(modules.sort(), ["invoicing", "payroll"]);
  });

  it("no pide modulos si las respuestas son negativas", () => {
    assert.deepEqual(
      collectRequiredModules(diagnostic, { facturacion_electronica: "no_aun", empleados_formales: "no" }),
      [],
    );
  });
});

describe("resolveDiagnostic (caso completo)", () => {
  it("clinica chica (4-8 empleados, 1 sucursal) -> dentagest-clinical + Profesional", () => {
    const result = resolveDiagnostic(diagnostic, tiersDoc, {
      rubro: "clinica_dental",
      empleados: "4_8",
      sucursales: "1",
      sistemas_propios: "no",
    });
    assert.equal(result.trackId, "dentagest-clinical");
    assert.equal(result.familyId, "pyme");
    assert.equal(result.tierId, "profesional");
    assert.deepEqual(result.recommendedModules.sort(), ["accounting", "commerce"]);
  });

  it("distribuidora con 2+ sistemas propios -> proveegest-electrico + nivel empresarial (E2, por los puentes)", () => {
    const result = resolveDiagnostic(diagnostic, tiersDoc, {
      rubro: "distribucion_importacion",
      empleados: "9_20",
      sucursales: "2_3",
      sistemas_propios: "varios",
    });
    assert.equal(result.trackId, "proveegest-electrico");
    assert.equal(result.familyId, "empresarial");
    assert.equal(result.tierId, "e2"); // maxBridges:2 -> e1 (maxBridges:1) no alcanza
  });

  it("marca los modulos pedidos que el nivel recomendado NO trae de forma titular", () => {
    const result = resolveDiagnostic(diagnostic, tiersDoc, {
      rubro: "clinica_dental",
      empleados: "1_3",
      sucursales: "1",
      facturacion_electronica: "si_ya",
      empleados_formales: "si",
    });
    assert.equal(result.tierId, "ordenado"); // ordenado no trae ni accounting ni invoicing ni payroll
    assert.deepEqual(result.extraModules.sort(), ["invoicing", "payroll"]);
  });

  it("sin respuesta de rubro, devuelve todo null (no inventa un rubro por defecto)", () => {
    const result = resolveDiagnostic(diagnostic, tiersDoc, {});
    assert.equal(result.trackId, null);
    assert.equal(result.tierId, null);
    assert.deepEqual(result.recommendedModules, []);
  });

  it("si ningun nivel de la familia alcanza, tierId es null (revision humana, no upsell automatico)", () => {
    const result = resolveDiagnostic(diagnostic, tiersDoc, {
      rubro: "clinica_dental", // familia pyme, tope maximo empresa = 3 sucursales
      sucursales: "mas_3", // senal maxSucursales: 4, ninguna de pyme alcanza
    });
    assert.equal(result.familyId, "pyme");
    assert.equal(result.tierId, null);
  });
});

describe("renderDiagnosticResult", () => {
  it("renderiza el caso resuelto y el caso sin rubro", () => {
    const resolved = resolveDiagnostic(diagnostic, tiersDoc, { rubro: "clinica_dental", empleados: "4_8", sucursales: "1" });
    const text = renderDiagnosticResult(resolved);
    assert.match(text, /Rubro: dentagest-clinical/);
    assert.match(text, /Nivel recomendado: Profesional/);

    const unresolved = renderDiagnosticResult(resolveDiagnostic(diagnostic, tiersDoc, {}));
    assert.match(unresolved, /No se pudo determinar el rubro/);
  });
});
