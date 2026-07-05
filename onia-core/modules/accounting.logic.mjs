/*
 * Logica contable pura del modulo accounting (Bolivia). Referencia canonica que
 * los productos portan. Sin estado, sin IO. Doble partida, libro mayor y balance
 * de comprobacion derivados de las lineas, e impuestos bolivianos (IVA/IT/IUE)
 * con vencimientos por digito NIT y cierre de gestion por sector.
 *
 * Las alicuotas por defecto son las vigentes (IVA 13%, IT 3%, IUE 25%) pero se
 * pasan como parametro porque la normativa cambia. Esto NO es asesoria fiscal.
 */

export function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

// --- Doble partida ----------------------------------------------------------

/** Suma de debe y haber de un conjunto de lineas de asiento. */
export function sumDebitCredit(lines = []) {
  let debit = 0;
  let credit = 0;
  for (const line of lines) {
    debit += Number(line?.debit ?? 0);
    credit += Number(line?.credit ?? 0);
  }
  return { debit: round2(debit), credit: round2(credit) };
}

/** Un asiento cuadra cuando la suma del debe es igual a la del haber. */
export function isBalanced(lines = []) {
  const { debit, credit } = sumDebitCredit(lines);
  return debit === credit;
}

/** Exige que el asiento cuadre antes de contabilizarlo (post). */
export function assertBalanced(lines = []) {
  const { debit, credit } = sumDebitCredit(lines);
  if (debit !== credit) {
    throw new Error(`asiento descuadrado: debe ${debit} != haber ${credit}`);
  }
  return lines;
}

// --- Libro mayor y balance de comprobacion ----------------------------------

/** Mayor: agrega las lineas por cuenta -> { code: { debit, credit, balance } }. */
export function ledgerByAccount(lines = []) {
  const ledger = {};
  for (const line of lines) {
    const code = line?.accountCode;
    if (!code) {
      continue;
    }
    if (!ledger[code]) {
      ledger[code] = { debit: 0, credit: 0, balance: 0 };
    }
    ledger[code].debit += Number(line?.debit ?? 0);
    ledger[code].credit += Number(line?.credit ?? 0);
  }
  for (const code of Object.keys(ledger)) {
    const account = ledger[code];
    account.debit = round2(account.debit);
    account.credit = round2(account.credit);
    account.balance = round2(account.debit - account.credit);
  }
  return ledger;
}

/** Saldo de una cuenta (debe - haber). */
export function accountBalance(lines = [], accountCode) {
  const ledger = ledgerByAccount(lines);
  return ledger[accountCode]?.balance ?? 0;
}

/** Balance de comprobacion: filas por cuenta + totales + si cuadra. */
export function trialBalance(lines = []) {
  const ledger = ledgerByAccount(lines);
  const rows = Object.keys(ledger)
    .sort()
    .map((accountCode) => ({
      accountCode,
      debit: ledger[accountCode].debit,
      credit: ledger[accountCode].credit,
    }));
  const totalDebit = round2(rows.reduce((sum, row) => sum + row.debit, 0));
  const totalCredit = round2(rows.reduce((sum, row) => sum + row.credit, 0));
  return { rows, totalDebit, totalCredit, balanced: totalDebit === totalCredit };
}

// --- Impuestos Bolivia ------------------------------------------------------

/** IVA contenido en un registro RCV (usa ivaAmount si viene, si no amount*rate). */
export function ivaOfRecord(record, rate = 0.13) {
  if (record?.ivaAmount !== undefined && record?.ivaAmount !== null) {
    return round2(record.ivaAmount);
  }
  return round2(Number(record?.amount ?? 0) * rate);
}

/**
 * IVA del periodo desde el RCV: debito fiscal (ventas) - credito fiscal (compras)
 * - saldo a favor previo. Devuelve lo que se paga y el nuevo saldo a favor.
 */
export function computeIva(rcvRecords = [], { rate = 0.13, previousBalance = 0 } = {}) {
  let debito = 0;
  let credito = 0;
  for (const record of rcvRecords) {
    if (record?.kind === "venta") {
      debito += ivaOfRecord(record, rate);
    } else if (record?.kind === "compra") {
      credito += ivaOfRecord(record, rate);
    }
  }
  debito = round2(debito);
  credito = round2(credito);
  const net = round2(debito - credito - Number(previousBalance ?? 0));
  return {
    debito,
    credito,
    net,
    payable: net > 0 ? net : 0,
    balanceForward: net < 0 ? round2(-net) : 0,
  };
}

/** Impuesto a las Transacciones: 3% sobre ingresos brutos. */
export function computeIt(grossIncome, rate = 0.03) {
  return round2(Math.max(0, Number(grossIncome ?? 0)) * rate);
}

/** IUE: 25% sobre la utilidad neta imponible (0 si hay perdida). */
export function computeIue(netTaxableProfit, rate = 0.25) {
  return round2(Math.max(0, Number(netTaxableProfit ?? 0)) * rate);
}

/** Bancarizacion: operaciones iguales o mayores al umbral deben bancarizarse. */
export function requiresBankization(amount, threshold = 50000) {
  return Number(amount ?? 0) >= threshold;
}

// --- Vencimientos y cierre de gestion ---------------------------------------

/**
 * Vencimiento de una declaracion mensual por ultimo digito del NIT (DS 25619):
 * el dia cae en el mes SIGUIENTE al periodo. period = 'YYYY-MM'.
 */
export function taxDueDate(nit, period, config) {
  const lastDigit = String(nit ?? "").trim().slice(-1);
  const dueDay = config?.nitDueDay?.[lastDigit];
  if (dueDay === undefined) {
    throw new Error(`sin dia de vencimiento para el digito NIT ${lastDigit}`);
  }
  const [year, month] = String(period).split("-").map(Number);
  let nextMonth = month + 1;
  let nextYear = year;
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear += 1;
  }
  return `${nextYear}-${pad2(nextMonth)}-${pad2(dueDay)}`;
}

/** Cierre de gestion (IUE) por sector, desde bolivianConfig. Devuelve YYYY-MM-DD. */
export function fiscalYearEnd(sector, year, config) {
  const entry = (config?.fiscalYearEndBySector ?? []).find((item) => item.sector === sector);
  if (!entry) {
    throw new Error(`sin cierre de gestion definido para el sector ${sector}`);
  }
  return `${year}-${entry.monthDay}`;
}

/** Suma dias a una fecha ISO (YYYY-MM-DD) en UTC. */
export function addDays(isoDate, days) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + Number(days));
  return date.toISOString().slice(0, 10);
}

/** Vencimiento del IUE: 120 dias despues del cierre de gestion. */
export function iueDueDate(fiscalYearEndDate, days = 120) {
  return addDays(fiscalYearEndDate, days);
}
