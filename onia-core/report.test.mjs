/*
 * Tests for the ONIA Core readiness report (report.mjs).
 * Dependency-free (node:test). Run: node --test onia-core/report.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { loadOniaCoreContract } from "./index.mjs";
import {
  buildCoreReport,
  classifyAdoptionStatus,
  loadAdapters,
  renderReport,
  summarizeMappings,
} from "./report.mjs";

const contract = loadOniaCoreContract();
const adapters = loadAdapters(contract);
const report = buildCoreReport(contract, adapters);

describe("classifyAdoptionStatus", () => {
  it("maps status strings to adoption buckets", () => {
    assert.equal(classifyAdoptionStatus("exists"), "cubierto");
    assert.equal(classifyAdoptionStatus("installed"), "cubierto");
    assert.equal(classifyAdoptionStatus("installed_plus_domain"), "cubierto");
    assert.equal(classifyAdoptionStatus("exists_partial"), "parcial");
    assert.equal(classifyAdoptionStatus("installing_referencing"), "parcial");
    assert.equal(classifyAdoptionStatus("domain_specific"), "dominio");
    assert.equal(classifyAdoptionStatus("missing"), "pendiente");
    assert.equal(classifyAdoptionStatus("planned"), "pendiente");
    assert.equal(classifyAdoptionStatus(undefined), "pendiente");
  });

  it("prefers partial over installed/exists when both are present", () => {
    // "exists_partial" is partially there, not fully covered.
    assert.equal(classifyAdoptionStatus("exists_partial"), "parcial");
  });
});

describe("summarizeMappings", () => {
  it("counts each bucket and the total", () => {
    const summary = summarizeMappings([
      { status: "exists" },
      { status: "installed" },
      { status: "exists_partial" },
      { status: "domain_specific" },
      { status: "missing" },
    ]);
    assert.deepEqual(summary, { cubierto: 2, parcial: 1, dominio: 1, pendiente: 1, total: 5 });
  });

  it("handles an empty list", () => {
    assert.deepEqual(summarizeMappings([]), {
      cubierto: 0,
      parcial: 0,
      dominio: 0,
      pendiente: 0,
      total: 0,
    });
  });
});

describe("loadAdapters", () => {
  it("loads one adapter per adapterFile", () => {
    assert.equal(adapters.length, contract.adapterFiles.length);
    assert.ok(adapters.every((adapter) => adapter.projectId));
  });
});

describe("buildCoreReport", () => {
  it("summarizes the contract header", () => {
    assert.equal(report.contract.name, "ONIA Core");
    assert.equal(report.contract.entities, contract.entities.length);
    assert.equal(report.contract.tracks, contract.verticalTracks.length);
    assert.equal(report.contract.packs, contract.verticalTracks.length);
  });

  it("gives every track a pack summary and a readiness breakdown that adds up", () => {
    assert.equal(report.tracks.length, contract.verticalTracks.length);
    for (const track of report.tracks) {
      assert.ok(track.pack, `${track.id} should have a pack`);
      assert.equal(track.coreCount + track.moduleCount, track.requiredCount);
      assert.ok(track.pack.kpis > 0, `${track.id} pack kpis`);
      assert.ok(Array.isArray(track.blocked), `${track.id} blocked list`);
      assert.equal(track.blocked.length, track.blockedCount);
    }
  });

  it("joins each distribution target with its adapter and entity rollup", () => {
    assert.equal(report.products.length, contract.distributionTargets.length);

    const dental = report.products.find((product) => product.projectId === "dentagest");
    assert.equal(dental.status, "installing");
    assert.ok(dental.installedEntities > 0, "DentalGest has installed migrations");
    // Adapters map every core entity, so the rollup covers all of them.
    assert.equal(dental.entities.total, contract.entities.length);
    assert.ok(dental.pendingEntities.includes("process_checklist"), "dental names pending entities");

    for (const product of report.products) {
      const entities = product.entities;
      assert.equal(
        entities.cubierto + entities.parcial + entities.dominio + entities.pendiente,
        entities.total,
        `${product.projectId} buckets add up`,
      );
      assert.equal(
        product.pendingEntities.length,
        entities.pendiente,
        `${product.projectId} pending names match the pending count`,
      );
    }
  });
});

describe("renderReport", () => {
  it("renders a readable text report with the key sections", () => {
    const text = renderReport(report);
    assert.match(text, /ONIA Core - Reporte de avance/);
    assert.match(text, /VERTICALES/);
    assert.match(text, /PRODUCTOS/);
    assert.match(text, /DentalGest/);
    assert.match(text, /pack "salud_dental"/);
    assert.match(text, /bloqueadas: 1 \(siat\)/);
    assert.match(text, /falta instalar: /);
    assert.match(text, /process_checklist/);
  });
});
