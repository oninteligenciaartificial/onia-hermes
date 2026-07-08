/*
 * Tests de la logica pura del modulo dental. Run:
 *   node --test onia-core/modules/dental.logic.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  applyLabCaseTransition,
  canProceedWithProcedure,
  canTransitionLabCase,
  computeTreatmentPlanTotal,
  hasCriticalAlerts,
  hasRequiredSignatures,
  isLabCaseOverdue,
  isTreatmentPlanApproved,
  round2,
  severityRank,
  sortAlertsBySeverity,
  summarizePerioReading,
} from "./dental.logic.mjs";

describe("computeTreatmentPlanTotal", () => {
  it("sums the cost of every treatment line", () => {
    assert.equal(computeTreatmentPlanTotal([{ cost: 500 }, { cost: 1200 }, { cost: 300 }]), 2000);
  });

  it("returns 0 for an empty plan", () => {
    assert.equal(computeTreatmentPlanTotal([]), 0);
  });

  it("rounds to 2 decimals", () => {
    assert.equal(computeTreatmentPlanTotal([{ cost: 10.005 }, { cost: 10.005 }]), round2(20.01));
  });
});

describe("isTreatmentPlanApproved", () => {
  it("true when the patient approved", () => {
    assert.equal(isTreatmentPlanApproved({ patientApprovedAt: "2026-07-01T10:00:00Z" }), true);
  });

  it("false when not approved yet", () => {
    assert.equal(isTreatmentPlanApproved({ patientApprovedAt: null }), false);
    assert.equal(isTreatmentPlanApproved({}), false);
  });
});

describe("hasRequiredSignatures", () => {
  it("requires BOTH patient and professional signatures (witness is optional)", () => {
    assert.equal(
      hasRequiredSignatures({ patientSignedAt: "2026-07-01T10:00:00Z", professionalSignedAt: "2026-07-01T10:05:00Z" }),
      true,
    );
  });

  it("false if either signature is missing", () => {
    assert.equal(hasRequiredSignatures({ patientSignedAt: "2026-07-01T10:00:00Z" }), false);
    assert.equal(hasRequiredSignatures({ professionalSignedAt: "2026-07-01T10:00:00Z" }), false);
    assert.equal(hasRequiredSignatures({}), false);
  });
});

describe("canProceedWithProcedure", () => {
  const signedConsent = {
    patientSignedAt: "2026-07-01T09:00:00Z",
    professionalSignedAt: "2026-07-01T09:10:00Z",
  };

  it("true when both signatures happened on or before the procedure date", () => {
    assert.equal(canProceedWithProcedure(signedConsent, "2026-07-01T10:00:00Z"), true);
  });

  it("false when signed AFTER the procedure date (backdating a consent is not valid)", () => {
    assert.equal(canProceedWithProcedure(signedConsent, "2026-06-30T10:00:00Z"), false);
  });

  it("false when signatures are missing", () => {
    assert.equal(canProceedWithProcedure({}, "2026-07-01T10:00:00Z"), false);
  });
});

describe("severityRank / sortAlertsBySeverity / hasCriticalAlerts", () => {
  it("ranks critical highest, low lowest, unknown as low", () => {
    assert.ok(severityRank("critical") > severityRank("high"));
    assert.ok(severityRank("high") > severityRank("moderate"));
    assert.ok(severityRank("moderate") > severityRank("low"));
    assert.equal(severityRank("unknown_value"), severityRank("low"));
  });

  it("sorts active alerts from most to least severe", () => {
    const alerts = [
      { id: "a", severity: "low", active: true },
      { id: "b", severity: "critical", active: true },
      { id: "c", severity: "moderate", active: true },
    ];
    const sorted = sortAlertsBySeverity(alerts).map((alert) => alert.id);
    assert.deepEqual(sorted, ["b", "c", "a"]);
  });

  it("filters out inactive (resolved) alerts", () => {
    const alerts = [
      { id: "resolved-critical", severity: "critical", active: false },
      { id: "active-low", severity: "low", active: true },
    ];
    const sorted = sortAlertsBySeverity(alerts).map((alert) => alert.id);
    assert.deepEqual(sorted, ["active-low"]);
  });

  it("does not mutate the input array", () => {
    const alerts = [{ id: "a", severity: "low", active: true }];
    const copy = [...alerts];
    sortAlertsBySeverity(alerts);
    assert.deepEqual(alerts, copy);
  });

  it("hasCriticalAlerts only counts ACTIVE critical alerts", () => {
    assert.equal(hasCriticalAlerts([{ severity: "critical", active: true }]), true);
    assert.equal(hasCriticalAlerts([{ severity: "critical", active: false }]), false);
    assert.equal(hasCriticalAlerts([{ severity: "high", active: true }]), false);
    assert.equal(hasCriticalAlerts([]), false);
  });
});

describe("lab case state machine", () => {
  it("follows the ordered -> in_lab -> shipped -> received -> installed happy path", () => {
    assert.equal(canTransitionLabCase("ordered", "in_lab"), true);
    assert.equal(canTransitionLabCase("in_lab", "shipped"), true);
    assert.equal(canTransitionLabCase("shipped", "received"), true);
    assert.equal(canTransitionLabCase("received", "installed"), true);
  });

  it("any non-terminal status can be cancelled", () => {
    for (const status of ["ordered", "in_lab", "shipped", "received"]) {
      assert.equal(canTransitionLabCase(status, "cancelled"), true);
    }
  });

  it("installed and cancelled are terminal", () => {
    assert.equal(canTransitionLabCase("installed", "in_lab"), false);
    assert.equal(canTransitionLabCase("cancelled", "ordered"), false);
  });

  it("rejects skipping a step (ordered straight to shipped)", () => {
    assert.equal(canTransitionLabCase("ordered", "shipped"), false);
  });

  it("applyLabCaseTransition throws on an invalid transition", () => {
    assert.throws(() => applyLabCaseTransition({ status: "installed" }, "in_lab"), /transicion.*invalida/);
  });

  it("applyLabCaseTransition sets receivedAt only when moving to received", () => {
    const next = applyLabCaseTransition({ status: "shipped" }, "received", { now: "2026-07-10T00:00:00Z" });
    assert.equal(next.status, "received");
    assert.equal(next.receivedAt, "2026-07-10T00:00:00Z");
    assert.equal(next.installedAt, null);
  });

  it("applyLabCaseTransition does not mutate the original case", () => {
    const original = { status: "ordered" };
    const next = applyLabCaseTransition(original, "in_lab");
    assert.equal(original.status, "ordered");
    assert.equal(next.status, "in_lab");
  });
});

describe("isLabCaseOverdue", () => {
  it("true when past the expected return date and still in flight", () => {
    const labCase = { status: "in_lab", expectedReturnDate: "2026-07-01" };
    assert.equal(isLabCaseOverdue(labCase, "2026-07-05T00:00:00Z"), true);
  });

  it("false when not past the expected date yet", () => {
    const labCase = { status: "in_lab", expectedReturnDate: "2026-07-10" };
    assert.equal(isLabCaseOverdue(labCase, "2026-07-05T00:00:00Z"), false);
  });

  it("false once received/installed/cancelled, even if past the expected date", () => {
    for (const status of ["received", "installed", "cancelled"]) {
      assert.equal(isLabCaseOverdue({ status, expectedReturnDate: "2026-07-01" }, "2026-07-05T00:00:00Z"), false);
    }
  });

  it("false when there is no expected date", () => {
    assert.equal(isLabCaseOverdue({ status: "in_lab" }, "2026-07-05T00:00:00Z"), false);
  });
});

describe("summarizePerioReading", () => {
  it("computes average and max depth across the 6 sites", () => {
    const sites = { mesiobuccal: 2, buccal: 3, distobuccal: 2, distolingual: 4, lingual: 2, mesiolingual: 5 };
    const summary = summarizePerioReading(sites);
    assert.equal(summary.averageDepthMm, round2((2 + 3 + 2 + 4 + 2 + 5) / 6));
    assert.equal(summary.maxDepthMm, 5);
  });

  it("counts sites above the 3mm screening reference (not a diagnosis)", () => {
    const sites = { a: 2, b: 3, c: 4, d: 5, e: 1, f: 3 };
    assert.equal(summarizePerioReading(sites).sitesAboveScreeningReference, 2);
  });

  it("returns zeros for an empty reading", () => {
    assert.deepEqual(summarizePerioReading({}), { averageDepthMm: 0, maxDepthMm: 0, sitesAboveScreeningReference: 0 });
  });
});
