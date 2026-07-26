/*
 * Logica pura canonica de aprobaciones (core). Decision one-shot sobre
 * ApprovalRequest: quien puede decidir (no su propia solicitud), y aplicar la
 * decision de forma inmutable (pending -> approved/rejected, no se re-decide).
 * Sin estado, sin IO.
 */

export const APPROVAL_STATUSES = ["pending", "approved", "rejected"];

export function isPending(approval) {
  return approval?.status === "pending";
}

/** Puede decidir si esta pendiente y no es su propia solicitud (salvo allowSelf). */
export function canDecide(approval, memberId, { allowSelf = false } = {}) {
  if (!isPending(approval)) {
    return false;
  }
  if (!allowSelf && approval?.requestedBy === memberId) {
    return false;
  }
  return true;
}

/** Aplica la decision una sola vez y devuelve una aprobacion nueva. */
export function applyDecision(approval, decision, { by, now = new Date().toISOString() } = {}) {
  if (!isPending(approval)) {
    throw new Error(`aprobacion ya decidida: ${approval?.status}`);
  }
  if (decision !== "approved" && decision !== "rejected") {
    throw new Error(`decision invalida: ${decision}`);
  }
  return {
    ...approval,
    status: decision,
    approvedBy: by ?? null,
    decidedAt: now,
  };
}
