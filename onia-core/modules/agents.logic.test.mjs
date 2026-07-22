/*
 * Tests de la logica pura del modulo agents. Se enlazan al agentsConfig real del
 * modulo para que el ruteo y los guardrails usen la misma fuente de verdad.
 * Run: node --test onia-core/modules/agents.logic.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getModule, loadModules } from "./index.mjs";
import {
  AGENT_ACTION_STATES,
  AGENT_RUN_STATES,
  agentActionKey,
  applyActionTransition,
  applyRunTransition,
  buildApprovalRequest,
  buildWorkItem,
  canTransitionAction,
  canTransitionRun,
  evaluateGuardrails,
  isDuplicateAction,
  routeAction,
  shouldRunAgent,
  summarizeRun,
} from "./agents.logic.mjs";

const config = getModule(loadModules(), "agents").agentsConfig;

describe("maquina de estados: corrida (agent_run)", () => {
  it("camino feliz scheduled -> running -> completed", () => {
    assert.ok(canTransitionRun("scheduled", "running"));
    assert.ok(canTransitionRun("running", "completed"));
  });
  it("scheduled/running pueden fallar; failed se reprograma", () => {
    assert.ok(canTransitionRun("scheduled", "failed"));
    assert.ok(canTransitionRun("running", "failed"));
    assert.ok(canTransitionRun("failed", "scheduled"));
  });
  it("completed es terminal y no se salta a completed desde scheduled", () => {
    assert.equal(canTransitionRun("completed", "running"), false);
    assert.equal(canTransitionRun("scheduled", "completed"), false);
  });
  it("todos los estados estan declarados", () => {
    assert.deepEqual(AGENT_RUN_STATES, ["scheduled", "running", "completed", "failed"]);
  });
  it("applyRunTransition sella startedAt/finishedAt y no muta", () => {
    const run = { status: "scheduled" };
    const running = applyRunTransition(run, "running", { now: "2026-07-22T10:00:00Z" });
    assert.equal(run.status, "scheduled");
    assert.equal(running.status, "running");
    assert.equal(running.startedAt, "2026-07-22T10:00:00Z");
    const done = applyRunTransition(running, "completed", { now: "2026-07-22T10:05:00Z" });
    assert.equal(done.finishedAt, "2026-07-22T10:05:00Z");
    assert.equal(done.startedAt, "2026-07-22T10:00:00Z");
  });
  it("lanza en transicion de corrida invalida", () => {
    assert.throws(() => applyRunTransition({ status: "completed" }, "running"), /invalida/);
  });
});

describe("maquina de estados: accion (agent_action)", () => {
  it("proposed puede ir a pending_approval, auto_executed o discarded", () => {
    assert.ok(canTransitionAction("proposed", "pending_approval"));
    assert.ok(canTransitionAction("proposed", "auto_executed"));
    assert.ok(canTransitionAction("proposed", "discarded"));
  });
  it("pending_approval -> approved | rejected; approved -> executed", () => {
    assert.ok(canTransitionAction("pending_approval", "approved"));
    assert.ok(canTransitionAction("pending_approval", "rejected"));
    assert.ok(canTransitionAction("approved", "executed"));
  });
  it("estados terminales no transicionan", () => {
    for (const terminal of ["rejected", "executed", "auto_executed", "discarded"]) {
      assert.deepEqual(
        AGENT_ACTION_STATES.filter((s) => canTransitionAction(terminal, s)),
        [],
      );
    }
  });
  it("no se salta pending_approval directo a executed", () => {
    assert.equal(canTransitionAction("pending_approval", "executed"), false);
  });
  it("applyActionTransition sella tiempos, guarda reason y no muta", () => {
    const action = { status: "proposed" };
    const routed = applyActionTransition(action, "pending_approval", { now: "2026-07-22T11:00:00Z" });
    assert.equal(action.status, "proposed");
    assert.equal(routed.status, "pending_approval");
    assert.equal(routed.routedAt, "2026-07-22T11:00:00Z");
    const approved = applyActionTransition(routed, "approved", { now: "2026-07-22T11:10:00Z" });
    const executed = applyActionTransition(approved, "executed", { now: "2026-07-22T11:11:00Z" });
    assert.equal(approved.approvedAt, "2026-07-22T11:10:00Z");
    assert.equal(executed.executedAt, "2026-07-22T11:11:00Z");
    const rejected = applyActionTransition(routed, "rejected", { now: "2026-07-22T11:20:00Z", reason: "fuera de tono" });
    assert.equal(rejected.reason, "fuera de tono");
  });
  it("auto_executed sella executedAt", () => {
    const auto = applyActionTransition({ status: "proposed" }, "auto_executed", { now: "2026-07-22T12:00:00Z" });
    assert.equal(auto.executedAt, "2026-07-22T12:00:00Z");
  });
  it("lanza en transicion de accion invalida", () => {
    assert.throws(() => applyActionTransition({ status: "executed" }, "approved"), /invalida/);
  });
});

describe("routeAction: REGLA DURA de seguridad (human-in-the-loop)", () => {
  const autoAgent = { id: "a1", autonomyLevel: "auto" };
  const suggestAgent = { id: "a2", autonomyLevel: "suggest" };

  it("accion sensible (send_message) SIEMPRE a pending_approval, aun con agente auto", () => {
    const r = routeAction({ actionType: "send_message" }, autoAgent, config);
    assert.equal(r.target, "pending_approval");
    assert.equal(r.requiresApproval, true);
  });
  it("scrape (toca externos) SIEMPRE a pending_approval aun con agente auto", () => {
    const r = routeAction({ actionType: "scrape" }, autoAgent, config);
    assert.equal(r.target, "pending_approval");
    assert.equal(r.requiresApproval, true);
  });
  it("accion interna (qualify_lead) con agente auto -> auto_executed", () => {
    const r = routeAction({ actionType: "qualify_lead" }, autoAgent, config);
    assert.equal(r.target, "auto_executed");
    assert.equal(r.requiresApproval, false);
  });
  it("accion interna (qualify_lead) con agente suggest -> pending_approval", () => {
    const r = routeAction({ actionType: "qualify_lead" }, suggestAgent, config);
    assert.equal(r.target, "pending_approval");
    assert.equal(r.requiresApproval, true);
  });
  it("actionType desconocido -> pending_approval por seguridad (aun con agente auto)", () => {
    const r = routeAction({ actionType: "nuke_everything" }, autoAgent, config);
    assert.equal(r.target, "pending_approval");
    assert.equal(r.requiresApproval, true);
  });
  it("create_task interna con agente auto -> auto_executed", () => {
    const r = routeAction({ actionType: "create_task" }, autoAgent, config);
    assert.equal(r.target, "auto_executed");
    assert.equal(r.requiresApproval, false);
  });
});

describe("idempotencia cross-run", () => {
  it("misma accion (agente+tipo+target) en dos corridas distintas = misma clave", () => {
    const run1 = { agentId: "a1", runId: "run-1", actionType: "qualify_lead", targetType: "business_partner", targetId: "bp-9" };
    const run2 = { agentId: "a1", runId: "run-2", actionType: "qualify_lead", targetType: "business_partner", targetId: "bp-9" };
    assert.equal(agentActionKey(run1), agentActionKey(run2));
    assert.equal(agentActionKey(run1), "a1:qualify_lead:business_partner:bp-9");
  });
  it("distinto target => distinta clave", () => {
    const a = agentActionKey({ agentId: "a1", actionType: "qualify_lead", targetType: "business_partner", targetId: "bp-9" });
    const b = agentActionKey({ agentId: "a1", actionType: "qualify_lead", targetType: "business_partner", targetId: "bp-10" });
    assert.notEqual(a, b);
  });
  it("isDuplicateAction detecta clave ya vista (array o Set)", () => {
    const key = "a1:qualify_lead:business_partner:bp-9";
    assert.equal(isDuplicateAction(key, [key]), true);
    assert.equal(isDuplicateAction(key, ["otra"]), false);
    assert.equal(isDuplicateAction(key, new Set([key])), true);
  });
});

describe("shouldRunAgent (scheduling por parametro)", () => {
  const agent = { enabled: true, intervalMinutes: 60 };

  it("nunca corrio y tiene intervalo => corre", () => {
    assert.equal(shouldRunAgent(agent, { lastRunAt: null, nowIso: "2026-07-22T10:00:00Z" }), true);
  });
  it("dentro del intervalo => no corre", () => {
    assert.equal(shouldRunAgent(agent, { lastRunAt: "2026-07-22T09:30:00Z", nowIso: "2026-07-22T10:00:00Z" }), false);
  });
  it("fuera del intervalo => corre", () => {
    assert.equal(shouldRunAgent(agent, { lastRunAt: "2026-07-22T08:00:00Z", nowIso: "2026-07-22T10:00:00Z" }), true);
  });
  it("deshabilitado => no corre nunca", () => {
    assert.equal(shouldRunAgent({ ...agent, enabled: false }, { lastRunAt: null, nowIso: "2026-07-22T10:00:00Z" }), false);
  });
  it("sin intervalMinutes (agente por evento) => no corre por schedule", () => {
    assert.equal(shouldRunAgent({ enabled: true }, { lastRunAt: null, nowIso: "2026-07-22T10:00:00Z" }), false);
  });
});

describe("evaluateGuardrails", () => {
  const agent = { id: "a1", autonomyLevel: "auto" };

  it("bloquea accion prohibida", () => {
    const r = evaluateGuardrails({ actionType: "send_money" }, agent, config, {});
    assert.equal(r.allowed, false);
    assert.match(r.reason, /prohibida/);
  });
  it("bloquea al alcanzar el limite diario de acciones", () => {
    const r = evaluateGuardrails({ actionType: "qualify_lead" }, agent, config, { actionsToday: config.guardrails.maxActionsPerDay });
    assert.equal(r.allowed, false);
    assert.match(r.reason, /acciones/);
  });
  it("bloquea mensaje al alcanzar el limite diario de mensajes", () => {
    const r = evaluateGuardrails({ actionType: "send_message" }, agent, config, { messagesToday: config.guardrails.maxMessagesPerDay });
    assert.equal(r.allowed, false);
    assert.match(r.reason, /mensajes/);
  });
  it("permite una accion normal dentro de limites", () => {
    const r = evaluateGuardrails({ actionType: "qualify_lead" }, agent, config, { actionsToday: 0, messagesToday: 0 });
    assert.equal(r.allowed, true);
    assert.equal(r.reason, null);
  });
});

describe("buildApprovalRequest / buildWorkItem (mapeo al core)", () => {
  it("buildApprovalRequest arma el payload de approval_request", () => {
    const action = { actionType: "send_message", targetType: "business_partner", targetId: "bp-9", summary: "Seguimiento cotizacion", payload: { text: "Hola" } };
    const req = buildApprovalRequest(action, { id: "a1" });
    assert.deepEqual(req, {
      kind: "agent_action",
      requestedByAgentId: "a1",
      subjectType: "business_partner",
      subjectId: "bp-9",
      summary: "Seguimiento cotizacion",
      payload: { text: "Hola" },
      status: "pending",
    });
  });
  it("buildWorkItem arma el payload de work_item", () => {
    const action = { actionType: "schedule_followup", summary: "Llamar en 3 dias", targetType: "business_partner", targetId: "bp-9" };
    const item = buildWorkItem(action, { id: "a1", ownerId: "m-7" });
    assert.deepEqual(item, {
      type: "schedule_followup",
      title: "Llamar en 3 dias",
      ownerId: "m-7",
      sourceType: "agent",
      sourceId: "a1",
      status: "open",
    });
  });
});

describe("summarizeRun", () => {
  it("cuenta acciones por estado", () => {
    const actions = [
      { status: "proposed" },
      { status: "pending_approval" },
      { status: "pending_approval" },
      { status: "auto_executed" },
      { status: "approved" },
      { status: "executed" },
      { status: "rejected" },
      { status: "discarded" },
    ];
    assert.deepEqual(summarizeRun(actions), {
      total: 8,
      proposed: 1,
      pendingApproval: 2,
      autoExecuted: 1,
      approved: 1,
      executed: 1,
      rejected: 1,
      discarded: 1,
    });
  });
  it("lista vacia => todo en cero", () => {
    assert.deepEqual(summarizeRun([]), {
      total: 0,
      proposed: 0,
      pendingApproval: 0,
      autoExecuted: 0,
      approved: 0,
      executed: 0,
      rejected: 0,
      discarded: 0,
    });
  });
});

describe("config real del modulo (agentsConfig)", () => {
  it("send_message/publish_content/scrape requieren aprobacion en el catalogo", () => {
    const byCode = Object.fromEntries(config.actionTypes.map((a) => [a.code, a.requiresApproval]));
    assert.equal(byCode.send_message, true);
    assert.equal(byCode.publish_content, true);
    assert.equal(byCode.scrape, true);
    assert.equal(byCode.qualify_lead, false);
    assert.equal(byCode.create_task, false);
  });
  it("guardrails prohiben mover dinero / borrar / cambiar settings", () => {
    assert.deepEqual(config.guardrails.prohibited, ["send_money", "execute_payment", "delete_data", "modify_settings"]);
  });
  it("no es asesoria financiera", () => {
    assert.equal(config.notFinancialAdvice, true);
  });
});
