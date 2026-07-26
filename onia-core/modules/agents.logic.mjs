/*
 * Logica pura del modulo agents (referencia canonica; los productos la portan).
 * Sin estado, sin IO, sin dependencias externas, inmutable: maquinas de estado de
 * corridas y acciones, la REGLA DURA de ruteo por aprobacion (human-in-the-loop),
 * idempotencia cross-run, scheduling y guardrails. El core NO ejecuta agentes; la
 * ejecucion real (cron+LLM+scraping+envio) es external_gate. Esto modela el
 * contrato + el ciclo de vida y decide QUE pasa por la cola de aprobacion.
 * "now"/fechas SIEMPRE como parametro.
 */

/* --- Maquina de estados: corrida (agent_run) -------------------------------
 * scheduled -> running -> completed | failed. failed puede reprogramarse
 * (failed -> scheduled). completed es terminal. Inmutable.
 */
export const AGENT_RUN_STATES = ["scheduled", "running", "completed", "failed"];

const AGENT_RUN_TRANSITIONS = {
  scheduled: ["running", "failed"],
  running: ["completed", "failed"],
  failed: ["scheduled"],
  completed: [],
};

export function canTransitionRun(from, to) {
  return (AGENT_RUN_TRANSITIONS[from] ?? []).includes(to);
}

/** Aplica una transicion de corrida y devuelve una corrida nueva (no muta). */
export function applyRunTransition(run, to, { now = new Date().toISOString() } = {}) {
  const from = run?.status;
  if (!canTransitionRun(from, to)) {
    throw new Error(`transicion de corrida invalida ${from} -> ${to}`);
  }
  return {
    ...run,
    status: to,
    startedAt: to === "running" ? now : (run?.startedAt ?? null),
    finishedAt: to === "completed" || to === "failed" ? now : (run?.finishedAt ?? null),
    updatedAt: now,
  };
}

/* --- Maquina de estados: accion/propuesta (agent_action) -------------------
 * proposed -> pending_approval | auto_executed | discarded.
 * pending_approval -> approved | rejected.
 * approved -> executed.
 * rejected / executed / auto_executed / discarded son terminales. Inmutable.
 */
export const AGENT_ACTION_STATES = [
  "proposed",
  "pending_approval",
  "approved",
  "rejected",
  "executed",
  "auto_executed",
  "discarded",
];

const AGENT_ACTION_TRANSITIONS = {
  proposed: ["pending_approval", "auto_executed", "discarded"],
  pending_approval: ["approved", "rejected"],
  approved: ["executed"],
  rejected: [],
  executed: [],
  auto_executed: [],
  discarded: [],
};

export function canTransitionAction(from, to) {
  return (AGENT_ACTION_TRANSITIONS[from] ?? []).includes(to);
}

/** Aplica una transicion de accion y devuelve una accion nueva (no muta). */
export function applyActionTransition(action, to, { now = new Date().toISOString(), reason } = {}) {
  const from = action?.status;
  if (!canTransitionAction(from, to)) {
    throw new Error(`transicion de accion invalida ${from} -> ${to}`);
  }
  return {
    ...action,
    status: to,
    reason: reason ?? action?.reason ?? null,
    routedAt: to === "pending_approval" || to === "auto_executed" ? now : (action?.routedAt ?? null),
    approvedAt: to === "approved" ? now : (action?.approvedAt ?? null),
    rejectedAt: to === "rejected" ? now : (action?.rejectedAt ?? null),
    executedAt: to === "executed" || to === "auto_executed" ? now : (action?.executedAt ?? null),
    updatedAt: now,
  };
}

/**
 * REGLA DURA DE SEGURIDAD: decide a donde va una accion producida por un agente.
 * Devuelve { target, requiresApproval, reason }.
 *  - Busca el actionType en config.actionTypes.
 *  - Si su requiresApproval es true (o no se encuentra -> se asume TRUE, seguro
 *    por default) O el agente NO esta en autonomyLevel 'auto' => target
 *    'pending_approval' (cola humana), requiresApproval true.
 *  - SOLO si el actionType.requiresApproval === false Y agent.autonomyLevel ===
 *    'auto' => target 'auto_executed', requiresApproval false.
 * NUNCA se auto-ejecuta una accion desconocida ni una sensible.
 */
export function routeAction(action, agent, config) {
  const actionTypes = config?.actionTypes ?? [];
  const spec = actionTypes.find((entry) => entry?.code === action?.actionType);
  const isAutoAgent = agent?.autonomyLevel === "auto";

  if (!spec) {
    return {
      target: "pending_approval",
      requiresApproval: true,
      reason: "actionType desconocido: se rutea a aprobacion por seguridad",
    };
  }
  if (spec.requiresApproval === false && isAutoAgent) {
    return {
      target: "auto_executed",
      requiresApproval: false,
      reason: "accion interna reversible con agente auto: auto-ejecuta",
    };
  }
  if (spec.requiresApproval) {
    return {
      target: "pending_approval",
      requiresApproval: true,
      reason: "accion sensible (contacta/publica/cobra/gasta/scraping): aprobacion humana",
    };
  }
  return {
    target: "pending_approval",
    requiresApproval: true,
    reason: "agente no-auto: toda accion pasa por aprobacion",
  };
}

/**
 * Clave de idempotencia CROSS-RUN de una accion: identifica de forma unica
 * (agente + tipo de accion + objetivo) para NO duplicar la misma propuesta entre
 * corridas distintas cuando el cron re-evalua. NO incluye runId a proposito.
 */
export function agentActionKey(action) {
  return `${action?.agentId ?? ""}:${action?.actionType ?? ""}:${action?.targetType ?? ""}:${action?.targetId ?? ""}`;
}

/** True si ya existe una accion con esta clave (dedupe cross-run). */
export function isDuplicateAction(key, existingKeys = []) {
  const set = existingKeys instanceof Set ? existingKeys : new Set(existingKeys);
  return set.has(key);
}

/**
 * Decide si un agente debe correr ahora. Fechas por parametro (no usa reloj).
 *  - false si el agente esta deshabilitado.
 *  - true si nunca corrio (!lastRunAt) y tiene intervalMinutes.
 *  - con intervalMinutes: true cuando (now - lastRunAt) en minutos >= intervalMinutes.
 *  - sin intervalMinutes (agente por evento, no por schedule): false.
 */
export function shouldRunAgent(agent, { lastRunAt, nowIso } = {}) {
  if (!agent?.enabled) return false;
  const intervalMinutes = agent?.intervalMinutes;
  if (intervalMinutes === undefined || intervalMinutes === null) return false;
  if (!lastRunAt) return true;
  const elapsedMinutes = (new Date(nowIso).getTime() - new Date(lastRunAt).getTime()) / 60000;
  return elapsedMinutes >= Number(intervalMinutes);
}

/**
 * Evalua los guardrails de una accion antes de encolarla o auto-ejecutarla.
 * Devuelve { allowed, reason }.
 *  - Bloquea si el actionType esta en config.guardrails.prohibited.
 *  - Bloquea si actionsToday >= maxActionsPerDay.
 *  - Bloquea si es accion de mensaje (send_message/draft_message) y
 *    messagesToday >= maxMessagesPerDay.
 *  - Si pasa: { allowed: true, reason: null }.
 */
export function evaluateGuardrails(action, agent, config, { actionsToday = 0, messagesToday = 0 } = {}) {
  const guardrails = config?.guardrails ?? {};
  const actionType = action?.actionType;

  if ((guardrails.prohibited ?? []).includes(actionType)) {
    return { allowed: false, reason: `accion prohibida: ${actionType}` };
  }
  if (guardrails.maxActionsPerDay != null && Number(actionsToday) >= Number(guardrails.maxActionsPerDay)) {
    return { allowed: false, reason: "limite diario de acciones alcanzado" };
  }
  const isMessage = actionType === "send_message" || actionType === "draft_message";
  if (isMessage && guardrails.maxMessagesPerDay != null && Number(messagesToday) >= Number(guardrails.maxMessagesPerDay)) {
    return { allowed: false, reason: "limite diario de mensajes alcanzado" };
  }
  return { allowed: true, reason: null };
}

/**
 * Mapea una accion que requiere aprobacion a un payload de approval_request del
 * core (human-in-the-loop). El caller crea el approval_request y guarda su id en
 * agent_action.approvalRequestId. No muta la accion.
 */
export function buildApprovalRequest(action, agent) {
  return {
    kind: "agent_action",
    requestedByAgentId: agent?.id ?? null,
    subjectType: action?.targetType ?? null,
    subjectId: action?.targetId ?? null,
    summary: action?.summary ?? null,
    payload: action?.payload ?? null,
    status: "pending",
  };
}

/**
 * Mapea una accion create_task / schedule_followup a un payload de work_item del
 * core. El caller crea el WorkItem y guarda su id en agent_action.workItemId.
 * No muta la accion.
 */
export function buildWorkItem(action, agent) {
  return {
    type: action?.actionType ?? null,
    title: action?.summary ?? null,
    ownerId: agent?.ownerId ?? null,
    sourceType: "agent",
    sourceId: agent?.id ?? null,
    status: "open",
  };
}

/** Cuenta las acciones de una corrida por estado (resumen para el panel). */
export function summarizeRun(actions = []) {
  const counts = {
    total: actions.length,
    proposed: 0,
    pendingApproval: 0,
    autoExecuted: 0,
    approved: 0,
    executed: 0,
    rejected: 0,
    discarded: 0,
  };
  const byStatus = {
    proposed: "proposed",
    pending_approval: "pendingApproval",
    auto_executed: "autoExecuted",
    approved: "approved",
    executed: "executed",
    rejected: "rejected",
    discarded: "discarded",
  };
  for (const action of actions) {
    const bucket = byStatus[action?.status];
    if (bucket) counts[bucket] += 1;
  }
  return counts;
}

/* --- Motor de agentes: evaluadores de candidatos + orquestador de corrida -----
 * Puros, sin IO, sin reloj (now por parametro). Deciden A QUIEN contacta el agente
 * (Recall reactiva, Cobrador persigue saldos) y convierten esos candidatos en
 * acciones ruteadas por la cola de aprobacion. El core NO envia: el producto aporta
 * los registros normalizados + umbrales y ejecuta el envio real (external_gate).
 * Estos evaluadores son GENERICOS: sirven a dental, estetica, veterinaria, gestios,
 * cualquier SaaS con clientes recurrentes o cuentas por cobrar.
 */

const DAY_MS = 86400000;

function daysBetween(fromIso, toIso) {
  return Math.floor((new Date(toIso).getTime() - new Date(fromIso).getTime()) / DAY_MS);
}

/**
 * Recall (reactivacion): clientes/pacientes que no vuelven hace >= recallAfterDays,
 * SIN proxima cita/visita agendada, respetando un cooldown de contacto. Excluye a
 * quien nunca vino (no hay a que reactivar) y a quien se dio de baja (optedOut).
 * record: { id, lastVisitAt, hasFutureAppointment, lastContactedAt, optedOut }
 * -> candidatos ordenados por dias sin volver (desc):
 *    [{ targetType, targetId, daysSinceVisit, reason }]
 */
export function evaluateRecallCandidates(records = [], { nowIso, recallAfterDays = 180, cooldownDays = 30, targetType = "patient" } = {}) {
  if (!nowIso) throw new Error("evaluateRecallCandidates requiere nowIso (no usa reloj)");
  const out = [];
  for (const r of records) {
    if (r?.optedOut) continue;
    if (r?.hasFutureAppointment) continue;
    if (!r?.lastVisitAt) continue;
    const daysSinceVisit = daysBetween(r.lastVisitAt, nowIso);
    if (daysSinceVisit < Number(recallAfterDays)) continue;
    if (r?.lastContactedAt && daysBetween(r.lastContactedAt, nowIso) < Number(cooldownDays)) continue;
    out.push({
      targetType,
      targetId: r.id,
      daysSinceVisit,
      reason: `sin volver hace ${daysSinceVisit} dias`,
    });
  }
  return out.sort((a, b) => b.daysSinceVisit - a.daysSinceVisit);
}

/**
 * Cobrador: cuentas por cobrar vencidas (dueDate + graceDays < now) con saldo >
 * minBalance, que NO estan en plan de pago, respetando cooldown de contacto.
 * Ordena por dias vencido (desc), luego por saldo (desc): la deuda mas vieja/grande
 * primero. Moneda por defecto BOB (Bolivia). NO es asesoria financiera: solo avisa.
 * record: { id, customerId, dueDate, balanceDue, inPaymentPlan, lastContactedAt, currency }
 * -> [{ targetType, targetId, customerId, daysOverdue, balanceDue, currency, reason }]
 */
export function evaluateCollectorCandidates(records = [], { nowIso, minBalance = 0, graceDays = 0, cooldownDays = 7, targetType = "receivable" } = {}) {
  if (!nowIso) throw new Error("evaluateCollectorCandidates requiere nowIso (no usa reloj)");
  const out = [];
  for (const r of records) {
    const balanceDue = Number(r?.balanceDue ?? 0);
    if (!(balanceDue > Number(minBalance))) continue;
    if (r?.inPaymentPlan) continue;
    if (!r?.dueDate) continue;
    const daysOverdue = daysBetween(r.dueDate, nowIso);
    if (daysOverdue <= Number(graceDays)) continue;
    if (r?.lastContactedAt && daysBetween(r.lastContactedAt, nowIso) < Number(cooldownDays)) continue;
    const currency = r?.currency ?? "BOB";
    out.push({
      targetType,
      targetId: r.id,
      customerId: r?.customerId ?? null,
      daysOverdue,
      balanceDue,
      currency,
      reason: `saldo vencido ${balanceDue} ${currency} hace ${daysOverdue} dias`,
    });
  }
  return out.sort((a, b) => b.daysOverdue - a.daysOverdue || b.balanceDue - a.balanceDue);
}

/**
 * Orquestador generico de una corrida: convierte candidatos en acciones FINALES,
 * aplicando en orden (1) dedupe cross-run e intra-run via agentActionKey, (2) tope
 * de acciones por corrida (maxActionsPerRun), (3) guardrails (topes diarios /
 * prohibidas), (4) la REGLA DURA de ruteo (routeAction). Cada accion sale con su
 * estado sellado por applyActionTransition (pending_approval / auto_executed /
 * discarded). Puro, inmutable, now por parametro.
 * -> { actions, summary }  (summary = summarizeRun(actions))
 */
export function planAgentRun(agent, candidates = [], config = {}, {
  nowIso = new Date().toISOString(),
  actionType = "draft_message",
  runId = null,
  existingKeys = [],
  actionsToday = 0,
  messagesToday = 0,
  buildSummary,
} = {}) {
  const maxPerRun = config?.guardrails?.maxActionsPerRun ?? Infinity;
  const seen = existingKeys instanceof Set ? new Set(existingKeys) : new Set(existingKeys);
  const actions = [];
  let runActions = Number(actionsToday);
  let runMessages = Number(messagesToday);
  let acceptedThisRun = 0;

  for (const candidate of candidates) {
    const base = {
      agentId: agent?.id ?? null,
      runId,
      actionType,
      targetType: candidate?.targetType ?? null,
      targetId: candidate?.targetId ?? null,
      summary: typeof buildSummary === "function" ? buildSummary(candidate) : (candidate?.reason ?? null),
      payload: candidate,
      status: "proposed",
    };
    const key = agentActionKey(base);

    if (isDuplicateAction(key, seen)) {
      actions.push(applyActionTransition(base, "discarded", { now: nowIso, reason: "duplicada: ya propuesta en otra corrida" }));
      continue;
    }
    if (acceptedThisRun >= maxPerRun) {
      actions.push(applyActionTransition(base, "discarded", { now: nowIso, reason: "tope de acciones por corrida alcanzado" }));
      continue;
    }
    const guard = evaluateGuardrails(base, agent, config, { actionsToday: runActions, messagesToday: runMessages });
    if (!guard.allowed) {
      actions.push(applyActionTransition(base, "discarded", { now: nowIso, reason: guard.reason }));
      continue;
    }
    const route = routeAction(base, agent, config);
    actions.push(applyActionTransition(base, route.target, { now: nowIso, reason: route.reason }));
    seen.add(key);
    acceptedThisRun += 1;
    runActions += 1;
    if (actionType === "send_message" || actionType === "draft_message") runMessages += 1;
  }

  return { actions, summary: summarizeRun(actions) };
}
