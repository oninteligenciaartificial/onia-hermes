/*
 * Tests de la logica pura del modulo automation. Run:
 *   node --test onia-core/modules/automation.logic.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  applyDispatchTransition,
  buildDispatch,
  canRetry,
  canTransitionDispatch,
  conditionMatches,
  evaluateTriggers,
  extractVariables,
  isDispatchTerminal,
  matchRule,
  nextRetryDelayMinutes,
  renderTemplate,
} from "./automation.logic.mjs";

describe("extractVariables", () => {
  it("encuentra {{var}} unicas en orden", () => {
    assert.deepEqual(extractVariables("Hola {{nombre}}, tu cita {{fecha}} con {{nombre}}"), ["nombre", "fecha"]);
  });
  it("tolera espacios y puntos", () => {
    assert.deepEqual(extractVariables("{{ clinica.nombre }}"), ["clinica.nombre"]);
  });
});

describe("renderTemplate", () => {
  const tpl = { subject: "Cita {{fecha}}", body: "Hola {{nombre}}, te esperamos el {{fecha}}." };

  it("reemplaza variables presentes", () => {
    const r = renderTemplate(tpl, { nombre: "Ana", fecha: "12/07" });
    assert.equal(r.body, "Hola Ana, te esperamos el 12/07.");
    assert.equal(r.subject, "Cita 12/07");
    assert.deepEqual(r.missing, []);
  });

  it("reporta variables faltantes y las deja vacias (no lanza)", () => {
    const r = renderTemplate(tpl, { nombre: "Ana" });
    assert.deepEqual(r.missing, ["fecha"]);
    assert.equal(r.body, "Hola Ana, te esperamos el .");
  });
});

describe("conditionMatches", () => {
  it("condicion vacia siempre matchea", () => {
    assert.equal(conditionMatches({}, { x: 1 }), true);
  });
  it("Max: context <= valor", () => {
    assert.equal(conditionMatches({ hoursBeforeMax: 24 }, { hoursBefore: 20 }), true);
    assert.equal(conditionMatches({ hoursBeforeMax: 24 }, { hoursBefore: 30 }), false);
  });
  it("Min: context >= valor", () => {
    assert.equal(conditionMatches({ daysOverdueMin: 1 }, { daysOverdue: 3 }), true);
    assert.equal(conditionMatches({ daysOverdueMin: 1 }, { daysOverdue: 0 }), false);
  });
  it("igualdad estricta para el resto", () => {
    assert.equal(conditionMatches({ only: "critical" }, { only: "critical" }), true);
    assert.equal(conditionMatches({ only: "critical" }, { only: "low" }), false);
  });
  it("combina varias condiciones (todas deben cumplir)", () => {
    assert.equal(conditionMatches({ hoursBeforeMax: 24, only: "confirmed" }, { hoursBefore: 2, only: "confirmed" }), true);
    assert.equal(conditionMatches({ hoursBeforeMax: 24, only: "confirmed" }, { hoursBefore: 2, only: "pending" }), false);
  });
});

describe("matchRule / evaluateTriggers", () => {
  const rule = { id: "r1", active: true, triggerType: "schedule_upcoming", condition: { hoursBeforeMax: 24 } };

  it("matchea por tipo + condicion + activa", () => {
    assert.equal(matchRule(rule, { type: "schedule_upcoming", context: { hoursBefore: 12 } }), true);
  });
  it("no matchea distinto triggerType", () => {
    assert.equal(matchRule(rule, { type: "balance_overdue", context: {} }), false);
  });
  it("no matchea si la regla esta inactiva", () => {
    assert.equal(matchRule({ ...rule, active: false }, { type: "schedule_upcoming", context: { hoursBefore: 1 } }), false);
  });
  it("no matchea si la condicion no se cumple", () => {
    assert.equal(matchRule(rule, { type: "schedule_upcoming", context: { hoursBefore: 48 } }), false);
  });
  it("evaluateTriggers devuelve solo las reglas que disparan", () => {
    const rules = [rule, { id: "r2", active: true, triggerType: "no_show", condition: {} }];
    const fired = evaluateTriggers(rules, { type: "no_show", context: {} });
    assert.deepEqual(fired.map((r) => r.id), ["r2"]);
  });
});

describe("buildDispatch", () => {
  const rule = { id: "r1", channelId: "wa-1" };
  const tpl = { id: "t1", channel: "whatsapp", body: "Hola {{nombre}}" };

  it("arma el dispatch en queued con el cuerpo renderizado", () => {
    const { dispatch, missing } = buildDispatch(rule, tpl, { recipient: "+59171234567", vars: { nombre: "Ana" }, now: "2026-07-11T00:00:00Z" });
    assert.equal(dispatch.status, "queued");
    assert.equal(dispatch.channel, "whatsapp");
    assert.equal(dispatch.channelId, "wa-1");
    assert.equal(dispatch.renderedBody, "Hola Ana");
    assert.equal(dispatch.ruleId, "r1");
    assert.deepEqual(missing, []);
  });

  it("reporta vars faltantes sin romper", () => {
    const { missing } = buildDispatch(rule, tpl, { recipient: "x", vars: {} });
    assert.deepEqual(missing, ["nombre"]);
  });
});

describe("dispatch state machine", () => {
  it("queued -> sent -> delivered (camino feliz)", () => {
    assert.ok(canTransitionDispatch("queued", "sent"));
    assert.ok(canTransitionDispatch("sent", "delivered"));
  });
  it("sent -> failed -> queued (reintento)", () => {
    assert.ok(canTransitionDispatch("sent", "failed"));
    assert.ok(canTransitionDispatch("failed", "queued"));
  });
  it("delivered y cancelled son terminales", () => {
    assert.equal(canTransitionDispatch("delivered", "sent"), false);
    assert.equal(canTransitionDispatch("cancelled", "queued"), false);
    assert.ok(isDispatchTerminal({ status: "delivered" }));
    assert.ok(isDispatchTerminal({ status: "cancelled" }));
    assert.ok(!isDispatchTerminal({ status: "queued" }));
  });
  it("no se puede saltar de queued directo a delivered", () => {
    assert.equal(canTransitionDispatch("queued", "delivered"), false);
  });
  it("applyDispatchTransition sella sentAt y no muta", () => {
    const d = { status: "queued", retryCount: 0 };
    const sent = applyDispatchTransition(d, "sent", { now: "2026-07-11T10:00:00Z" });
    assert.equal(d.status, "queued");
    assert.equal(sent.status, "sent");
    assert.equal(sent.sentAt, "2026-07-11T10:00:00Z");
  });
  it("failed -> queued incrementa retryCount y limpia el motivo", () => {
    const failed = applyDispatchTransition({ status: "sent", retryCount: 0 }, "failed", { failedReason: "timeout" });
    assert.equal(failed.failedReason, "timeout");
    const retry = applyDispatchTransition(failed, "queued");
    assert.equal(retry.retryCount, 1);
    assert.equal(retry.failedReason, null);
  });
  it("lanza en transicion invalida", () => {
    assert.throws(() => applyDispatchTransition({ status: "delivered" }, "sent"), /invalida/);
  });
});

describe("reintentos", () => {
  it("canRetry respeta el tope", () => {
    assert.equal(canRetry({ status: "failed", retryCount: 0 }), true);
    assert.equal(canRetry({ status: "failed", retryCount: 3 }), false);
    assert.equal(canRetry({ status: "sent", retryCount: 0 }), false);
  });
  it("backoff exponencial 1,2,4,8 min", () => {
    assert.equal(nextRetryDelayMinutes(0), 1);
    assert.equal(nextRetryDelayMinutes(1), 2);
    assert.equal(nextRetryDelayMinutes(3), 8);
  });
});
