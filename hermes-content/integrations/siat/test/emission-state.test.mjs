/*
 * Tests de la maquina de estados de emision SIAT. Run:
 *   node --test hermes-content/integrations/siat/test/emission-state.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  applyTransition,
  canCancel,
  canRevertCancellation,
  canTransition,
  isOfflineSendOverdue,
  isValidInvoice,
  needsAttention,
} from "../src/emission-state.mjs";

describe("flujo feliz draft -> validated", () => {
  it("draft -> queued -> sent -> validated", () => {
    assert.ok(canTransition("draft", "queued"));
    assert.ok(canTransition("queued", "sent"));
    assert.ok(canTransition("sent", "validated"));
  });

  it("applyTransition sella los timestamps correctos y no muta el original", () => {
    const draft = { state: "draft", createdAt: "2026-07-08T00:00:00Z" };
    const queued = applyTransition(draft, "queued", { now: "2026-07-08T00:01:00Z" });
    assert.equal(draft.state, "draft", "no muta");
    assert.equal(queued.state, "queued");
    const sent = applyTransition(queued, "sent", { now: "2026-07-08T00:02:00Z" });
    assert.equal(sent.sentAt, "2026-07-08T00:02:00Z");
    const validated = applyTransition(sent, "validated", { now: "2026-07-08T00:03:00Z", sinStatus: 908 });
    assert.equal(validated.validatedAt, "2026-07-08T00:03:00Z");
    assert.equal(validated.sinStatus, 908);
  });
});

describe("reintentos: observed y rejected vuelven a la cola", () => {
  it("observed -> queued (tras corregir) o rejected", () => {
    assert.ok(canTransition("observed", "queued"));
    assert.ok(canTransition("observed", "rejected"));
  });
  it("rejected -> queued (reintento)", () => {
    assert.ok(canTransition("rejected", "queued"));
  });
  it("needsAttention marca observed y rejected", () => {
    assert.ok(needsAttention({ state: "observed" }));
    assert.ok(needsAttention({ state: "rejected" }));
    assert.ok(!needsAttention({ state: "validated" }));
  });
});

describe("transiciones invalidas", () => {
  it("no se puede saltar de draft directo a sent", () => {
    assert.ok(!canTransition("draft", "sent"));
  });
  it("no se puede anular algo no validado", () => {
    assert.ok(!canTransition("sent", "annulled"));
  });
  it("applyTransition lanza en transicion invalida", () => {
    assert.throws(() => applyTransition({ state: "draft" }, "validated"), /invalida/);
  });
});

describe("isValidInvoice", () => {
  it("validated y reverted valen; annulled no", () => {
    assert.ok(isValidInvoice({ state: "validated" }));
    assert.ok(isValidInvoice({ state: "reverted" }));
    assert.ok(!isValidInvoice({ state: "annulled" }));
    assert.ok(!isValidInvoice({ state: "draft" }));
  });
});

describe("anulacion y reversion", () => {
  const validated = {
    state: "validated",
    issueDate: "2026-07-08T10:00:00Z",
    declaredInRcv: false,
  };

  it("se puede anular una factura validada dentro del plazo (dia 9 del mes siguiente)", () => {
    assert.ok(canCancel(validated, { asOf: new Date("2026-08-05T00:00:00Z") }));
  });

  it("NO se puede anular pasado el dia 9 del mes siguiente", () => {
    assert.ok(!canCancel(validated, { asOf: new Date("2026-08-15T00:00:00Z") }));
  });

  it("NO se puede anular si ya se declaro en RCV", () => {
    assert.ok(!canCancel({ ...validated, declaredInRcv: true }, { asOf: new Date("2026-08-05T00:00:00Z") }));
  });

  it("NO se puede anular algo que no esta validado", () => {
    assert.ok(!canCancel({ ...validated, state: "sent" }, { asOf: new Date("2026-08-05T00:00:00Z") }));
  });

  it("la reversion es por unica vez: solo desde annulled", () => {
    assert.ok(canRevertCancellation({ state: "annulled" }));
    assert.ok(!canRevertCancellation({ state: "reverted" }), "reverted es terminal, no se re-revierte");
    assert.ok(!canRevertCancellation({ state: "validated" }));
  });

  it("annulled -> reverted vuelve a ser factura valida", () => {
    const annulled = { state: "annulled" };
    const reverted = applyTransition(annulled, "reverted", { now: "2026-08-06T00:00:00Z" });
    assert.equal(reverted.revertedAt, "2026-08-06T00:00:00Z");
    assert.ok(isValidInvoice(reverted));
  });
});

describe("isOfflineSendOverdue", () => {
  const offline = { state: "queued", emissionType: "offline", createdAt: "2026-07-08T00:00:00Z" };

  it("vencida si pasan mas de 48h en cola/enviada sin validar", () => {
    assert.ok(isOfflineSendOverdue(offline, { asOf: new Date("2026-07-10T01:00:00Z") }));
  });

  it("no vencida dentro de 48h", () => {
    assert.ok(!isOfflineSendOverdue(offline, { asOf: new Date("2026-07-09T00:00:00Z") }));
  });

  it("solo aplica a offline (online no cuenta este plazo)", () => {
    assert.ok(!isOfflineSendOverdue({ ...offline, emissionType: "online" }, { asOf: new Date("2026-07-10T01:00:00Z") }));
  });

  it("no aplica si ya esta validada", () => {
    assert.ok(!isOfflineSendOverdue({ ...offline, state: "validated" }, { asOf: new Date("2026-07-10T01:00:00Z") }));
  });
});
