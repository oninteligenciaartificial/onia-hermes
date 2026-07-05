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
