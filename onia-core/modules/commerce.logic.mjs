/*
 * Logica pura del modulo commerce (referencia canonica; los productos la portan).
 * Sin estado, sin IO, sin dependencias: solo calculo de totales de cotizacion/
 * pedido y movimientos de stock. Inmutable: devuelve valores nuevos.
 */

export function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

/**
 * Total de una linea: cantidad * precio unitario - descuento (monto absoluto).
 * Nunca negativo.
 */
export function computeLineTotal(line) {
  const quantity = Number(line?.quantity ?? 0);
  const unitPrice = Number(line?.unitPrice ?? 0);
  const discount = Number(line?.discount ?? 0);
  const gross = quantity * unitPrice;
  return round2(Math.max(0, gross - discount));
}

/** Total de una cotizacion o pedido: suma de sus lineas. */
export function computeQuoteTotal(lines = []) {
  return round2(lines.reduce((sum, line) => sum + computeLineTotal(line), 0));
}

const MOVEMENT_TYPES = new Set(["in", "out", "adjust"]);

/**
 * Aplica un movimiento de stock a una cantidad actual y devuelve la nueva.
 *  - in: suma; out: resta (no permite negativo); adjust: fija el valor.
 * Lanza si el tipo es invalido, la cantidad es negativa, o un out deja negativo.
 */
export function applyStockMovement(currentQuantity, movement) {
  const current = Number(currentQuantity ?? 0);
  const type = movement?.movementType;
  const quantity = Number(movement?.quantity ?? 0);

  if (!MOVEMENT_TYPES.has(type)) {
    throw new Error(`invalid movementType: ${type}`);
  }
  if (quantity < 0) {
    throw new Error("movement quantity must be >= 0");
  }

  if (type === "adjust") {
    return round2(quantity);
  }
  if (type === "in") {
    return round2(current + quantity);
  }

  const next = current - quantity;
  if (next < 0) {
    throw new Error(`stock would go negative: ${current} - ${quantity}`);
  }
  return round2(next);
}

/** True si la existencia esta en o por debajo del punto de reorden. */
export function isBelowReorder(stockItem) {
  const reorderPoint = stockItem?.reorderPoint;
  if (reorderPoint === undefined || reorderPoint === null) {
    return false;
  }
  return Number(stockItem?.quantity ?? 0) <= Number(reorderPoint);
}

/* --- Maquina de estados: cotizacion (quote) --------------------------------
 * draft -> sent -> accepted | rejected | expired.
 * rejected y expired son terminales (rechazo / vencimiento); accepted es el
 * exito y se convierte en pedido via acceptQuoteToOrder. Inmutable.
 */
export const QUOTE_STATES = ["draft", "sent", "accepted", "rejected", "expired"];

const QUOTE_TRANSITIONS = {
  draft: ["sent"],
  sent: ["accepted", "rejected", "expired"],
  accepted: [],
  rejected: [],
  expired: [],
};

export function canTransitionQuote(from, to) {
  return (QUOTE_TRANSITIONS[from] ?? []).includes(to);
}

/** Aplica una transicion de cotizacion y devuelve una cotizacion nueva (no muta). */
export function applyQuoteTransition(quote, to, { now = new Date().toISOString() } = {}) {
  const from = quote?.status;
  if (!canTransitionQuote(from, to)) {
    throw new Error(`transicion de cotizacion invalida ${from} -> ${to}`);
  }
  return {
    ...quote,
    status: to,
    sentAt: to === "sent" ? now : (quote?.sentAt ?? null),
    acceptedAt: to === "accepted" ? now : (quote?.acceptedAt ?? null),
    rejectedAt: to === "rejected" ? now : (quote?.rejectedAt ?? null),
    expiredAt: to === "expired" ? now : (quote?.expiredAt ?? null),
    updatedAt: now,
  };
}

/* --- Maquina de estados: pedido (order) ------------------------------------
 * draft -> confirmed -> fulfilled | cancelled. fulfilled y cancelled terminales.
 * Inmutable.
 */
export const ORDER_STATES = ["draft", "confirmed", "fulfilled", "cancelled"];

const ORDER_TRANSITIONS = {
  draft: ["confirmed"],
  confirmed: ["fulfilled", "cancelled"],
  fulfilled: [],
  cancelled: [],
};

export function canTransitionOrder(from, to) {
  return (ORDER_TRANSITIONS[from] ?? []).includes(to);
}

/** Aplica una transicion de pedido y devuelve un pedido nuevo (no muta). */
export function applyOrderTransition(order, to, { now = new Date().toISOString() } = {}) {
  const from = order?.status;
  if (!canTransitionOrder(from, to)) {
    throw new Error(`transicion de pedido invalida ${from} -> ${to}`);
  }
  return {
    ...order,
    status: to,
    confirmedAt: to === "confirmed" ? now : (order?.confirmedAt ?? null),
    fulfilledAt: to === "fulfilled" ? now : (order?.fulfilledAt ?? null),
    cancelledAt: to === "cancelled" ? now : (order?.cancelledAt ?? null),
    updatedAt: now,
  };
}

/**
 * Convierte una cotizacion ACEPTADA en un pedido en estado draft, copiando sus
 * lineas (quote.lines) a lineas de pedido y recomputando totales con la misma
 * regla de commerce (computeLineTotal / computeQuoteTotal). No muta la cotizacion.
 * Lanza si la cotizacion no esta 'accepted'.
 */
export function acceptQuoteToOrder(quote, { now = new Date().toISOString() } = {}) {
  if (quote?.status !== "accepted") {
    throw new Error(`solo una cotizacion accepted se convierte en pedido (status: ${quote?.status})`);
  }
  const lines = Array.isArray(quote?.lines) ? quote.lines : [];
  const orderLines = lines.map((line) => ({
    variantId: line?.variantId ?? null,
    quantity: Number(line?.quantity ?? 0),
    unitPrice: Number(line?.unitPrice ?? 0),
    discount: line?.discount != null ? Number(line.discount) : null,
    lineTotal: computeLineTotal(line),
    notes: line?.notes ?? null,
  }));
  return {
    status: "draft",
    organizationId: quote?.organizationId ?? null,
    partnerId: quote?.partnerId ?? null,
    currency: quote?.currency ?? null,
    ownerId: quote?.ownerId ?? null,
    quoteId: quote?.id ?? null,
    total: computeQuoteTotal(lines),
    lines: orderLines,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * True si la cotizacion vencio segun validUntil (comparado con nowIso). Sin
 * validUntil => nunca vence. Puramente por fecha; el caller decide la transicion.
 */
export function isQuoteExpired(quote, nowIso = new Date().toISOString()) {
  const validUntil = quote?.validUntil;
  if (!validUntil) return false;
  return new Date(nowIso).getTime() > new Date(validUntil).getTime();
}

/**
 * Saldo por cobrar (total menos la suma de amount de los pagos). Permite saldo
 * negativo cuando hay sobrepago. Redondea a 2 decimales.
 */
export function paymentBalance(total, payments = []) {
  const paid = (Array.isArray(payments) ? payments : []).reduce(
    (sum, payment) => sum + Number(payment?.amount ?? 0),
    0,
  );
  return round2(Number(total ?? 0) - paid);
}
