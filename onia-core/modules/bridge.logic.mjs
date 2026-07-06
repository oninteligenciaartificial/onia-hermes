/*
 * Puentes entre modulos (logica pura). Convierte ventas de commerce y facturas
 * de invoicing en su asiento contable/registro RCV boliviano, reutilizando el
 * total de commerce, el cuadre de accounting y el CUF de invoicing. Sin estado,
 * sin IO. Los productos lo portan para contabilizar automaticamente.
 */
import { computeQuoteTotal } from "./commerce.logic.mjs";
import { assertBalanced, ivaOfRecord, round2 } from "./accounting.logic.mjs";

/**
 * Asiento contable de una venta a partir de su importe total (IVA incluido).
 *  accounts = { cash, receivable, sales, ivaDebit } (codigos de cuenta).
 * Debe: caja (contado) o cuentas por cobrar (credito) por el total.
 * Haber: ingresos por el neto + debito fiscal IVA (total * rate, por dentro).
 */
export function saleToJournalEntry(sale, { accounts, ivaRate = 0.13 } = {}) {
  const total = round2(Number(sale?.total ?? 0));
  const iva = round2(total * ivaRate);
  const net = round2(total - iva);

  const debitAccount = sale?.paymentType === "credit" ? accounts?.receivable : accounts?.cash;
  if (!debitAccount || !accounts?.sales || !accounts?.ivaDebit) {
    throw new Error("faltan cuentas: se requiere cash/receivable, sales e ivaDebit");
  }

  const lines = [
    { accountCode: debitAccount, debit: total, credit: 0, partnerId: sale?.partnerId },
    { accountCode: accounts.sales, debit: 0, credit: net },
    { accountCode: accounts.ivaDebit, debit: 0, credit: iva },
  ];
  assertBalanced(lines);

  return {
    date: sale?.date,
    glosa: sale?.glosa ?? `Venta ${sale?.reference ?? ""}`.trim(),
    entryType: "diario",
    sourceType: "sale",
    sourceId: sale?.id,
    lines,
  };
}

/**
 * Igual que saleToJournalEntry pero calculando el total desde las lineas de
 * commerce (computeQuoteTotal). Este es el puente real commerce -> accounting.
 */
export function orderToJournalEntry(order, { accounts, ivaRate = 0.13 } = {}) {
  const total = computeQuoteTotal(order?.lines ?? []);
  return saleToJournalEntry(
    {
      total,
      paymentType: order?.paymentType,
      partnerId: order?.partnerId,
      date: order?.date,
      glosa: order?.glosa,
      reference: order?.reference,
      id: order?.id,
    },
    { accounts, ivaRate },
  );
}

/**
 * Igual que saleToJournalEntry pero la fuente es una factura de invoicing:
 * usa su total, fecha de emision y numero de factura como referencia.
 */
export function invoiceToJournalEntry(invoice, { accounts, ivaRate = 0.13 } = {}) {
  const entry = saleToJournalEntry(
    {
      total: invoice?.total,
      paymentType: invoice?.paymentType,
      partnerId: invoice?.partnerId,
      date: invoice?.issueDate,
      glosa: invoice?.glosa ?? `Factura ${invoice?.invoiceNumber ?? ""}`.trim(),
      reference: invoice?.invoiceNumber,
      id: invoice?.id,
    },
    { accounts, ivaRate },
  );
  return { ...entry, sourceType: "invoice" };
}

/**
 * Registro RCV (venta) a partir de una factura emitida de invoicing. kind fijo
 * 'venta': una factura de venta siempre alimenta el debito fiscal del IVA.
 */
export function invoiceToRcvRecord(invoice, { ivaRate = 0.13 } = {}) {
  const total = round2(Number(invoice?.total ?? 0));
  return {
    kind: "venta",
    invoiceNumber: invoice?.invoiceNumber,
    authorizationCode: invoice?.cuis ?? invoice?.authorizationNumber ?? null,
    controlCode: invoice?.controlCode ?? null,
    nit: invoice?.partnerNit ?? null,
    partnerId: invoice?.partnerId ?? null,
    partnerName: invoice?.partnerName ?? null,
    date: invoice?.issueDate,
    amount: total,
    ivaAmount: ivaOfRecord({ amount: total }, ivaRate),
  };
}
