/*
 * Tests de los modulos vendibles de ONIA Core (module contracts + validador).
 * Dependency-free (node:test). Run: node --test onia-core/modules/modules.test.mjs
 */
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { loadOniaCoreContract } from "../index.mjs";
import { getModule, getModuleEntitiesByCapability, getModuleEntity, loadModules } from "./index.mjs";

const contract = loadOniaCoreContract();
const modules = loadModules();
const commerce = getModule(modules, "commerce");

describe("commerce module", () => {
  it("is loaded as a non-installed activatable module", () => {
    assert.ok(commerce, "commerce module present");
    assert.equal(commerce.layer, "activatable_module");
    assert.equal(commerce.installInProductRepos, false);
    assert.match(commerce.version, /^\d+\.\d+\.\d+$/);
    assert.ok(["draft", "alpha", "beta"].includes(commerce.status));
  });

  it("only activates module-layer core capabilities (never core or external_gate)", () => {
    const capabilityById = new Map(contract.capabilities.map((capability) => [capability.id, capability]));
    assert.ok(commerce.activatesCapabilities.length > 0);
    for (const capabilityId of commerce.activatesCapabilities) {
      const capability = capabilityById.get(capabilityId);
      assert.ok(capability, `capability ${capabilityId} exists in core`);
      assert.ok(
        ["activatable_module", "vertical_extension"].includes(capability.layer),
        `${capabilityId} is a module layer, got ${capability.layer}`,
      );
    }
  });

  it("depends only on real core entities", () => {
    const coreEntityIds = new Set(contract.entities.map((entity) => entity.id));
    for (const dependency of commerce.coreDependencies) {
      assert.ok(coreEntityIds.has(dependency.coreEntityId), `core entity ${dependency.coreEntityId}`);
    }
  });

  it("references only existing core vertical tracks", () => {
    const trackIds = new Set(contract.verticalTracks.map((track) => track.id));
    for (const trackId of commerce.verticalTracks) {
      assert.ok(trackIds.has(trackId), `track ${trackId}`);
    }
  });

  it("gives every activated capability at least one tenant-scoped entity with no core-id collision", () => {
    const coreEntityIds = new Set(contract.entities.map((entity) => entity.id));
    for (const capabilityId of commerce.activatesCapabilities) {
      assert.ok(getModuleEntitiesByCapability(commerce, capabilityId).length > 0, `${capabilityId} has entities`);
    }
    for (const entity of commerce.entities) {
      assert.ok(!coreEntityIds.has(entity.id), `${entity.id} must not collide with a core id`);
      assert.ok(
        entity.tenantScoped === false || entity.requiredFields.includes("organizationId"),
        `${entity.id} must be tenant-scoped`,
      );
      assert.ok(commerce.activatesCapabilities.includes(entity.capabilityId), `${entity.id} capability activated`);
    }
  });

  it("looks up a module entity by id", () => {
    assert.equal(getModuleEntity(commerce, "quote")?.name, "Quote");
    assert.equal(getModuleEntity(commerce, "nope"), undefined);
  });

  it("covers sales_cash with order, order_line and payment", () => {
    assert.ok(commerce.activatesCapabilities.includes("sales_cash"), "sales_cash activated");
    const salesEntities = getModuleEntitiesByCapability(commerce, "sales_cash").map((entity) => entity.id);
    for (const id of ["order", "order_line", "payment"]) {
      assert.ok(salesEntities.includes(id), `sales_cash includes ${id}`);
    }
  });

  it("declares a SQL schema that defines every entity table", () => {
    assert.ok(commerce.schemaFile, "schemaFile present");
    const schema = readFileSync(new URL(`../../${commerce.schemaFile}`, import.meta.url), "utf8");
    for (const entity of commerce.entities) {
      assert.ok(entity.table, `${entity.id} declares a table`);
      assert.ok(schema.includes(entity.table), `schema defines ${entity.table}`);
    }
  });
});

describe("knowledge module", () => {
  const knowledge = getModule(modules, "knowledge");

  it("covers knowledge_base with articles and categories", () => {
    assert.ok(knowledge, "knowledge module present");
    assert.equal(knowledge.layer, "vertical_extension");
    assert.deepEqual(knowledge.activatesCapabilities, ["knowledge_base"]);
    const ids = knowledge.entities.map((entity) => entity.id);
    assert.ok(ids.includes("knowledge_article"), "has knowledge_article");
    assert.ok(ids.includes("knowledge_category"), "has knowledge_category");
  });
});

describe("accounting module (Bolivia)", () => {
  const accounting = getModule(modules, "accounting");

  it("provides its own capabilities instead of activating core ones", () => {
    assert.ok(accounting, "accounting module present");
    assert.deepEqual(accounting.activatesCapabilities, []);
    assert.deepEqual(accounting.providesCapabilities, ["accounting", "tax_bolivia"]);
    const coreCapabilityIds = new Set(contract.capabilities.map((capability) => capability.id));
    for (const capabilityId of accounting.providesCapabilities) {
      assert.ok(!coreCapabilityIds.has(capabilityId), `${capabilityId} must not be a core capability`);
    }
  });

  it("has the double-entry, ledger, tax, withholding and fixed asset entities", () => {
    const ids = accounting.entities.map((entity) => entity.id);
    for (const id of [
      "account",
      "fiscal_period",
      "journal_entry",
      "journal_entry_line",
      "tax_rate",
      "tax_declaration",
      "rcv_record",
      "withholding_record",
      "fixed_asset",
    ]) {
      assert.ok(ids.includes(id), `has ${id}`);
    }
  });

  it("encodes Bolivian tax config (IVA/IT/IUE) and NIT due days", () => {
    const config = accounting.bolivianConfig;
    assert.ok(config, "bolivianConfig present");
    assert.equal(config.currency, "BOB");
    const byCode = new Map(config.taxes.map((tax) => [tax.code, tax]));
    assert.equal(byCode.get("IVA").rate, 0.13);
    assert.equal(byCode.get("IT").rate, 0.03);
    assert.equal(byCode.get("IUE").rate, 0.25);
    assert.equal(config.nitDueDay["0"], 13);
    assert.equal(config.nitDueDay["9"], 22);
  });

  it("encodes withholding rates for the 4 investigated cases", () => {
    const withholdings = accounting.bolivianConfig.withholdings;
    assert.ok(withholdings, "withholdings config present");
    assert.equal(withholdings.compraSinFactura.totalRate, 0.08);
    assert.equal(withholdings.alquilerPersonaNatural.totalRate, 0.16);
    assert.equal(withholdings.honorariosPersonaNatural.rcIvaRate, 0.13);
    assert.equal(withholdings.beneficiarioExterior.effectiveRate, 0.125);
  });

  it("flags the pending Ley 1.733 IVA reform without having changed the IVA code", () => {
    const warning = accounting.bolivianConfig.ivaReformWarning;
    assert.ok(warning, "ivaReformWarning present");
    assert.match(warning.law, /1\.733/);
  });
});

describe("invoicing module (Bolivia)", () => {
  const invoicing = getModule(modules, "invoicing");

  it("provides its own capability (invoicing) instead of activating a core one", () => {
    assert.ok(invoicing, "invoicing module present");
    assert.deepEqual(invoicing.activatesCapabilities, []);
    assert.deepEqual(invoicing.providesCapabilities, ["invoicing"]);
    const coreCapabilityIds = new Set(contract.capabilities.map((capability) => capability.id));
    assert.ok(!coreCapabilityIds.has("invoicing"), "invoicing must not be a core capability");
  });

  it("has the invoice, invoice_line and credit_debit_note entities", () => {
    const ids = invoicing.entities.map((entity) => entity.id);
    for (const id of ["invoice", "invoice_line", "credit_debit_note"]) {
      assert.ok(ids.includes(id), `has ${id}`);
    }
  });

  it("declares a SQL schema that defines every entity table", () => {
    const schema = readFileSync(new URL(`../../${invoicing.schemaFile}`, import.meta.url), "utf8");
    for (const entity of invoicing.entities) {
      assert.ok(entity.table, `${entity.id} declares a table`);
      assert.ok(schema.includes(entity.table), `schema defines ${entity.table}`);
    }
  });

  it("encodes SIAT config with CUF field widths, QR structure and cancellation deadline", () => {
    const config = invoicing.siatConfig;
    assert.ok(config, "siatConfig present");
    const totalWidth = Object.values(config.cufFieldWidths).reduce((sum, width) => sum + width, 0);
    assert.equal(totalWidth, 51);
    assert.equal(config.cancellationDeadlineDayOfNextMonth, 9);
    assert.equal(config.qr.params.length, 4);
    assert.ok(config.recommendedStartModality);
    assert.ok(config.notes.some((note) => note.includes("external_gate")));
  });

  it("applies to the same selling verticals as accounting", () => {
    assert.deepEqual(invoicing.verticalTracks.slice().sort(), ["dentagest-clinical", "ganadero-offline", "gestios-general", "proveegest-electrico"]);
  });
});

describe("payroll module (Bolivia)", () => {
  const payroll = getModule(modules, "payroll");

  it("provides its own capability (payroll) instead of activating a core one", () => {
    assert.ok(payroll, "payroll module present");
    assert.deepEqual(payroll.activatesCapabilities, []);
    assert.deepEqual(payroll.providesCapabilities, ["payroll"]);
    const coreCapabilityIds = new Set(contract.capabilities.map((capability) => capability.id));
    assert.ok(!coreCapabilityIds.has("payroll"), "payroll must not be a core capability");
  });

  it("has the employee_profile, payroll_period, payroll_entry and termination_settlement entities", () => {
    const ids = payroll.entities.map((entity) => entity.id);
    for (const id of ["employee_profile", "payroll_period", "payroll_entry", "termination_settlement"]) {
      assert.ok(ids.includes(id), `has ${id}`);
    }
  });

  it("declares a SQL schema that defines every entity table", () => {
    const schema = readFileSync(new URL(`../../${payroll.schemaFile}`, import.meta.url), "utf8");
    for (const entity of payroll.entities) {
      assert.ok(entity.table, `${entity.id} declares a table`);
      assert.ok(schema.includes(entity.table), `schema defines ${entity.table}`);
    }
  });

  it("encodes laborConfig with AFP/Gestora breakdown, RC-IVA, aguinaldo/indemnizacion thresholds and vacation scale", () => {
    const config = payroll.laborConfig;
    assert.ok(config, "laborConfig present");
    assert.equal(config.afpLaboralBreakdown.total, 0.1271);
    assert.equal(config.afpPatronalBreakdown.total, 0.0721);
    assert.equal(config.rcIva.rate, 0.13);
    assert.equal(config.aguinaldo.minMonthsWorkedToQualify, 3);
    assert.equal(config.indemnizacion.minDaysWorkedToQualify, 90);
    assert.equal(config.indemnizacion.appliesToVoluntaryResignation, true);
    assert.equal(config.vacationScaleDays.length, 3);
    assert.equal(config.finiquito.deadlineBusinessDays, 15);
    assert.ok(config.notes.some((note) => note.includes("external_gate")));
  });

  it("applies to the same selling verticals as accounting/invoicing", () => {
    assert.deepEqual(payroll.verticalTracks.slice().sort(), ["dentagest-clinical", "ganadero-offline", "gestios-general", "proveegest-electrico"]);
  });
});

describe("dental module (first single-rubro vertical module)", () => {
  const dental = getModule(modules, "dental");

  it("provides its own capability (dental_clinical) instead of activating a core one", () => {
    assert.ok(dental, "dental module present");
    assert.deepEqual(dental.activatesCapabilities, []);
    assert.deepEqual(dental.providesCapabilities, ["dental_clinical"]);
    const coreCapabilityIds = new Set(contract.capabilities.map((capability) => capability.id));
    assert.ok(!coreCapabilityIds.has("dental_clinical"), "dental_clinical must not be a core capability");
  });

  it("applies to EXACTLY ONE vertical (dentagest-clinical), unlike commerce/accounting/invoicing/payroll", () => {
    assert.deepEqual(dental.verticalTracks, ["dentagest-clinical"]);
  });

  it("has the 6 gap entities confirmed against DentaGest's real schema (vertical-extensions.json)", () => {
    const ids = dental.entities.map((entity) => entity.id);
    for (const id of ["perio_chart", "treatment_plan", "informed_consent", "medical_alert", "dental_lab_case", "tooth_image"]) {
      assert.ok(ids.includes(id), `has ${id}`);
    }
    // No reconstruye lo que DentaGest ya tiene implementado.
    for (const id of ["patient", "clinical_record", "odontogram_entry", "patient_treatment", "prescription"]) {
      assert.ok(!ids.includes(id), `must NOT rebuild ${id} (already implemented in DentaGest)`);
    }
  });

  it("declares a SQL schema that defines every entity table", () => {
    const schema = readFileSync(new URL(`../../${dental.schemaFile}`, import.meta.url), "utf8");
    for (const entity of dental.entities) {
      assert.ok(entity.table, `${entity.id} declares a table`);
      assert.ok(schema.includes(entity.table), `schema defines ${entity.table}`);
    }
  });

  it("flags clinical thresholds as screening reference, not diagnosis (notClinicalAdvice)", () => {
    const config = dental.clinicalConfig;
    assert.ok(config, "clinicalConfig present");
    assert.equal(config.notClinicalAdvice, true);
    assert.equal(config.perioScreeningReferenceMm.healthyMax, 3);
  });
});

describe("modules validator integration", () => {
  it("modules pass validate-modules.mjs (exit 0)", () => {
    const validatePath = fileURLToPath(new URL("./validate-modules.mjs", import.meta.url));
    const result = spawnSync(process.execPath, [validatePath], { encoding: "utf8" });

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(result.stdout, /ONIA Core modules OK/);
  });
});
