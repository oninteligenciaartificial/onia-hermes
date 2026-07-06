/*
 * Tests de la logica de agenda (core). Run:
 *   node --test onia-core/logic/scheduling.logic.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isPastDue, isReminderDue, isUpcoming } from "./scheduling.logic.mjs";

const now = "2026-07-05T12:00:00.000Z";

describe("agenda", () => {
  it("isUpcoming: agendado dentro de la ventana", () => {
    assert.equal(isUpcoming({ status: "scheduled", startAt: "2026-07-05T14:00:00.000Z" }, { now }), true);
    assert.equal(isUpcoming({ status: "scheduled", startAt: "2026-07-07T14:00:00.000Z" }, { now }), false);
    assert.equal(isUpcoming({ status: "done", startAt: "2026-07-05T14:00:00.000Z" }, { now }), false);
    assert.equal(isUpcoming({ status: "scheduled", startAt: "2026-07-05T10:00:00.000Z" }, { now }), false);
  });

  it("isPastDue: agendado cuyo inicio ya paso", () => {
    assert.equal(isPastDue({ status: "scheduled", startAt: "2026-07-05T10:00:00.000Z" }, { now }), true);
    assert.equal(isPastDue({ status: "scheduled", startAt: "2026-07-05T14:00:00.000Z" }, { now }), false);
    assert.equal(isPastDue({ status: "cancelled", startAt: "2026-07-05T10:00:00.000Z" }, { now }), false);
  });

  it("isReminderDue: recordatorio que ya llego", () => {
    assert.equal(isReminderDue({ status: "scheduled", remindAt: "2026-07-05T11:00:00.000Z" }, { now }), true);
    assert.equal(isReminderDue({ status: "scheduled", remindAt: "2026-07-05T13:00:00.000Z" }, { now }), false);
    assert.equal(isReminderDue({ status: "scheduled" }, { now }), false);
  });
});
