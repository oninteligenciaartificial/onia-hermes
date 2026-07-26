/*
 * Tests de la logica canonica de WorkItem (core). Run:
 *   node --test onia-core/logic/work-items.logic.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  applyTransition,
  canTransition,
  comparePending,
  dedupeKey,
  isOpen,
  isOverdue,
  priorityRank,
  slaDueAt,
} from "./work-items.logic.mjs";

describe("transiciones de estado", () => {
  it("permite las transiciones validas y rechaza las invalidas", () => {
    assert.equal(canTransition("open", "in_progress"), true);
    assert.equal(canTransition("open", "done"), true);
    assert.equal(canTransition("done", "in_progress"), true); // reabrir
    assert.equal(canTransition("cancelled", "open"), false); // terminal
    assert.equal(canTransition("open", "open"), false);
  });

  it("applyTransition devuelve un item nuevo con closedAt y sin mutar", () => {
    const item = { id: "w1", status: "open" };
    const done = applyTransition(item, "done", { now: "2026-07-05T12:00:00.000Z" });
    assert.equal(done.status, "done");
    assert.equal(done.closedAt, "2026-07-05T12:00:00.000Z");
    assert.equal(item.status, "open"); // original intacto

    const started = applyTransition(item, "in_progress", { now: "2026-07-05T12:00:00.000Z" });
    assert.equal(started.closedAt, null);

    assert.throws(() => applyTransition({ status: "cancelled" }, "open"), /transicion invalida/);
  });
});

describe("estado abierto y prioridad", () => {
  it("isOpen cubre open e in_progress", () => {
    assert.equal(isOpen({ status: "open" }), true);
    assert.equal(isOpen({ status: "in_progress" }), true);
    assert.equal(isOpen({ status: "done" }), false);
  });

  it("priorityRank ordena urgent < high < normal < low", () => {
    assert.ok(priorityRank("urgent") < priorityRank("high"));
    assert.ok(priorityRank("high") < priorityRank("normal"));
    assert.equal(priorityRank("desconocida"), priorityRank("normal"));
  });
});

describe("SLA y vencimiento", () => {
  it("slaDueAt suma las horas de la politica al createdAt", () => {
    assert.equal(
      slaDueAt("2026-07-05T10:00:00.000Z", "urgente", { urgente: 4 }),
      "2026-07-05T14:00:00.000Z",
    );
    assert.equal(slaDueAt("2026-07-05T10:00:00.000Z", "inexistente", { urgente: 4 }), null);
  });

  it("isOverdue solo para abiertos con vencimiento pasado", () => {
    const now = "2026-07-05T12:00:00.000Z";
    assert.equal(isOverdue({ status: "open", slaDueAt: "2026-07-05T10:00:00.000Z" }, now), true);
    assert.equal(isOverdue({ status: "open", slaDueAt: "2026-07-05T14:00:00.000Z" }, now), false);
    assert.equal(isOverdue({ status: "done", slaDueAt: "2026-07-05T10:00:00.000Z" }, now), false);
    assert.equal(isOverdue({ status: "open" }, now), false);
  });
});

describe("dedupe y orden de cola", () => {
  it("dedupeKey combina org, tipo, canal y contacto", () => {
    assert.equal(
      dedupeKey({ organizationId: "org1", type: "lead", channelId: "wa", partnerId: "p1" }),
      "org1:lead:wa:p1",
    );
  });

  it("comparePending pone los vencidos primero y luego por prioridad", () => {
    const now = "2026-07-05T12:00:00.000Z";
    const overdue = { status: "open", priority: "low", slaDueAt: "2026-07-05T10:00:00.000Z", createdAt: "a" };
    const urgentOnTime = { status: "open", priority: "urgent", createdAt: "b" };
    const normalOnTime = { status: "open", priority: "normal", createdAt: "c" };

    const sorted = [normalOnTime, urgentOnTime, overdue].slice().sort((a, b) => comparePending(a, b, now));
    assert.deepEqual(
      sorted.map((item) => item.priority),
      ["low", "urgent", "normal"], // vencido (low) primero, luego urgent, luego normal
    );
  });
});
