/*
 * Unit tests for the ONIA Core contract helpers (index.mjs) plus an
 * integration check that the shipped contract still passes validate.mjs.
 *
 * Dependency-free: uses the built-in node:test runner and node:assert.
 * Run: node --test onia-core/index.test.mjs
 *   or: node onia-core/index.test.mjs
 *
 * These tests lock the core contract surface while it is CONGELADO para
 * adopcion: if an invariant here breaks, a contract change slipped in and
 * must be reviewed on purpose (not by accident during product adoption).
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getAnsweredQuestionIds,
  getBlockedCapabilitiesForTrack,
  getCapabilitiesByLayer,
  getCapability,
  getCoreCapabilityIds,
  getCoreEntityIds,
  getDistributionTarget,
  getEntity,
  getOrphanEntityIds,
  getTrackReadiness,
  getUnansweredQuestions,
  getVerticalTrack,
  isCoreCapability,
  loadOniaCoreContract,
} from "./index.mjs";

const contract = loadOniaCoreContract();

describe("loadOniaCoreContract", () => {
  it("loads the canonical ONIA Core contract by default", () => {
    assert.equal(contract.name, "ONIA Core");
    assert.match(contract.version, /^\d+\.\d+\.\d+$/);
    assert.equal(contract.status, "beta");
  });

  it("keeps the 10 operating questions and non-empty entity/capability sets", () => {
    assert.equal(contract.questions.length, 10);
    assert.ok(contract.entities.length > 0);
    assert.ok(contract.capabilities.length > 0);
  });

  it("accepts an explicit fileUrl", () => {
    const explicit = loadOniaCoreContract(new URL("./contract.json", import.meta.url));
    assert.equal(explicit.name, contract.name);
    assert.equal(explicit.version, contract.version);
  });
});

describe("getCapabilitiesByLayer", () => {
  it("returns only capabilities of the requested layer", () => {
    const core = getCapabilitiesByLayer(contract, "core");
    assert.ok(core.length > 0);
    assert.ok(core.every((capability) => capability.layer === "core"));

    const external = getCapabilitiesByLayer(contract, "external_gate");
    const externalIds = external.map((capability) => capability.id);
    assert.deepEqual([...externalIds].sort(), ["siat", "tr4_adapter", "whatsapp"]);
  });

  it("partitions every capability into exactly one layer", () => {
    const layers = ["core", "activatable_module", "vertical_extension", "external_gate"];
    const total = layers.reduce(
      (sum, layer) => sum + getCapabilitiesByLayer(contract, layer).length,
      0,
    );
    assert.equal(total, contract.capabilities.length);
  });

  it("returns an empty array for an unknown layer", () => {
    assert.deepEqual(getCapabilitiesByLayer(contract, "does_not_exist"), []);
  });
});

describe("getCapability / isCoreCapability", () => {
  it("finds a capability by id", () => {
    assert.equal(getCapability(contract, "tenant")?.layer, "core");
  });

  it("returns undefined for a missing capability", () => {
    assert.equal(getCapability(contract, "nope"), undefined);
  });

  it("flags core vs non-core capabilities", () => {
    assert.equal(isCoreCapability(contract, "tenant"), true);
    assert.equal(isCoreCapability(contract, "whatsapp"), false);
    assert.equal(isCoreCapability(contract, "catalog_inventory"), false);
  });

  it("treats a missing capability as not core", () => {
    assert.equal(isCoreCapability(contract, "missing"), false);
  });
});

describe("getVerticalTrack / getDistributionTarget", () => {
  it("looks up an existing vertical track", () => {
    const track = getVerticalTrack(contract, "dentagest-clinical");
    assert.equal(track?.familyId, "DENTALGEST");
  });

  it("returns undefined for a missing track", () => {
    assert.equal(getVerticalTrack(contract, "ghost-track"), undefined);
  });

  it("looks up a distribution target by projectId", () => {
    assert.equal(getDistributionTarget(contract, "dentagest")?.status, "installing");
  });

  it("returns undefined for a missing distribution target", () => {
    assert.equal(getDistributionTarget(contract, "ghost-project"), undefined);
  });
});

describe("getBlockedCapabilitiesForTrack", () => {
  it("resolves blocked capability ids to external-gate capabilities", () => {
    const blocked = getBlockedCapabilitiesForTrack(contract, "proveegest-electrico");
    assert.ok(blocked.length > 0);
    assert.ok(blocked.every((capability) => capability.layer === "external_gate"));
  });

  it("returns an empty array for a missing track", () => {
    assert.deepEqual(getBlockedCapabilitiesForTrack(contract, "ghost-track"), []);
  });
});

describe("getEntity / getCoreEntityIds", () => {
  it("finds an entity by id", () => {
    assert.equal(getEntity(contract, "work_item")?.name, "WorkItem");
  });

  it("returns undefined for a missing entity", () => {
    assert.equal(getEntity(contract, "unicorn"), undefined);
  });

  it("lists every entity id", () => {
    const ids = getCoreEntityIds(contract);
    assert.equal(ids.length, contract.entities.length);
    assert.ok(ids.includes("work_item"));
    assert.ok(ids.includes("communication_channel"));
  });
});

describe("getCoreCapabilityIds", () => {
  it("returns only core-layer capability ids", () => {
    const coreIds = getCoreCapabilityIds(contract);
    assert.ok(coreIds.includes("tenant"));
    assert.ok(coreIds.includes("channels"));
    assert.ok(!coreIds.includes("catalog_inventory"));
    assert.ok(!coreIds.includes("whatsapp"));
    assert.equal(coreIds.length, getCapabilitiesByLayer(contract, "core").length);
  });
});

describe("getAnsweredQuestionIds / getUnansweredQuestions", () => {
  it("core capabilities answer all 10 operating questions", () => {
    const answered = getAnsweredQuestionIds(contract, "core");
    assert.equal(answered.size, contract.questions.length);
    assert.deepEqual(getUnansweredQuestions(contract, "core"), []);
  });

  it("a narrower layer leaves some questions unanswered", () => {
    const unanswered = getUnansweredQuestions(contract, "external_gate");
    assert.ok(unanswered.length > 0);
    assert.ok(unanswered.every((question) => question.id));
  });
});

describe("getOrphanEntityIds", () => {
  it("has no entity left unreferenced by a capability", () => {
    assert.deepEqual(getOrphanEntityIds(contract), []);
  });
});

describe("getTrackReadiness", () => {
  it("summarizes readiness for a known track", () => {
    const track = getVerticalTrack(contract, "dentagest-clinical");
    const readiness = getTrackReadiness(contract, "dentagest-clinical");

    assert.equal(readiness?.trackId, "dentagest-clinical");
    assert.equal(readiness?.status, track.status);
    assert.equal(readiness?.requiredCount, track.requiredCapabilityIds.length);
    assert.equal(readiness?.blockedCount, track.blockedCapabilityIds.length);
    // Every required capability is either core or module; the two must add up.
    assert.equal(readiness?.coreCount + readiness?.moduleCount, readiness?.requiredCount);
    // DentalGest pulls in sales_cash, a non-core activatable module.
    assert.ok(readiness?.moduleCount >= 1);
  });

  it("returns null for a missing track", () => {
    assert.equal(getTrackReadiness(contract, "ghost-track"), null);
  });
});

describe("validator integration", () => {
  it("the shipped contract passes validate.mjs (exit 0)", () => {
    const validatePath = fileURLToPath(new URL("./validate.mjs", import.meta.url));
    const result = spawnSync(process.execPath, [validatePath], { encoding: "utf8" });

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(result.stdout, /ONIA Core contract OK/);
  });
});
