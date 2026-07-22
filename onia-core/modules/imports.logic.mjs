/*
 * Logica pura del modulo imports (costo de importacion / landed cost, Bolivia).
 * Referencia canonica; los productos la portan. Sin estado, sin IO. Inmutable:
 * devuelve valores nuevos, nunca muta la entrada.
 *
 * Cubre la "columna" de una importadora/distribuidora (ProveeGest / Bolivian
 * Electric): valor en aduana (DS 5646), arancel (GA con vigencias), IVA de
 * importacion (credito fiscal recuperable), costo puesto en almacen repartido
 * por linea, valuacion de inventario (CPP y PEPS -- UEPS PROHIBIDO en Bolivia,
 * NC 2), asiento contable cuadrado, mapeo al RCV y diferencia de cambio (NC 6).
 *
 * NADA de esto es asesoria fiscal/aduanera. Todas las tasas son DEFAULT
 * configurables con vigencia; la normativa boliviana 2026 se mueve rapido
 * (ver imports.json.bolivianImportConfig y ONIA_IMPORTS_MODULE_2026.md).
 *
 * Reusa assertBalanced del modulo accounting (unica dependencia cruzada, en una
 * sola direccion imports -> accounting: un asiento cuadrado es regla contable).
 */
import { assertBalanced } from "./accounting.logic.mjs";

function roundN(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
}

/** Redondeo monetario a 2 decimales (convencion de todos los *.logic.mjs). */
export function round2(value) {
  return roundN(value, 2);
}

// --- Valor en aduana y arancel (GA) -----------------------------------------

/**
 * Valor en aduana segun DS 5646 (vigente 06-jul-2026, reforma del Art. 20 del
 * DS 25870): FOB + carga/descarga + factor x (flete + seguro). El factor
 * (0.10 por defecto) es CONFIGURABLE: valida contra una DUI real post-06-jul
 * del despachante de Bolivian Electric antes de darlo por cerrado.
 *
 * OJO: este es el valor para la BASE IMPONIBLE (GA/IVA), deliberadamente menor
 * que el costo real. El costo de inventario si carga el flete/seguro completos
 * (ver computeLandedCostUsd).
 */
export function computeCustomsValue(fob, freight = 0, insurance = 0, loadingUnloading = 0, { freightInsuranceFactor = 0.10 } = {}) {
  const base =
    Number(fob ?? 0) +
    Number(loadingUnloading ?? 0) +
    Number(freightInsuranceFactor ?? 0) * (Number(freight ?? 0) + Number(insurance ?? 0));
  return round2(base);
}

/** Un tariff_rate esta vigente en `asOfMs` si asOf cae dentro de [validFrom, validTo]. */
function withinValidity(rate, asOfMs) {
  const from = rate?.validFrom ? new Date(rate.validFrom).getTime() : -Infinity;
  const to = rate?.validTo ? new Date(rate.validTo).getTime() : Infinity;
  return from <= asOfMs && asOfMs <= to;
}

/**
 * Alicuota efectiva del GA (fraccion; 0.10 = 10%). Aplica en orden:
 *  - zeroRated (DS 5516/5518, arancel cero): GA = 0.
 *  - reductionPts (DS 5646, -5 puntos = 0.05): gaBasePct - reductionPts, piso 0.
 * gaBasePct y reductionPts se expresan como FRACCION (0.10 y 0.05), consistente
 * con las alicuotas de IVA/IT/IUE del modulo accounting.
 */
export function resolveEffectiveGaPct(rate) {
  if (!rate) {
    return 0;
  }
  if (rate.zeroRated) {
    return 0;
  }
  const base = Number(rate.gaBasePct ?? 0);
  const reduction = Number(rate.reductionPts ?? 0);
  return Math.max(0, roundN(base - reduction, 4));
}

/**
 * Resuelve el tariff_rate vigente para una subpartida NANDINA a una fecha, entre
 * un conjunto de tasas con vigencias. Devuelve el rate + su gaPct efectivo, o
 * null si no hay ninguno vigente (el producto decide el default/alerta).
 * Ante varias vigentes, gana la de validFrom mas reciente (la ultima reforma).
 */
export function resolveTariffRate(nandinaCode, date, rates = []) {
  const asOf = new Date(date).getTime();
  const candidates = (rates ?? [])
    .filter((rate) => rate?.nandinaCode === nandinaCode && withinValidity(rate, asOf))
    .sort((a, b) => new Date(b?.validFrom ?? 0).getTime() - new Date(a?.validFrom ?? 0).getTime());
  const rate = candidates[0];
  if (!rate) {
    return null;
  }
  return { ...rate, effectiveGaPct: resolveEffectiveGaPct(rate) };
}

/** Gravamen Arancelario: valor en aduana x alicuota efectiva (fraccion). */
export function computeTariff(customsValue, gaPct) {
  return round2(Number(customsValue ?? 0) * Number(gaPct ?? 0));
}

// --- IVA de importacion e ICE -----------------------------------------------

// inside_1494 = 0.1494 es el efectivo VIGENTE HOY (IVA por dentro, regimen
// historico). outside_13 = 0.13 es el desagregado de la Ley 1733: promulgada
// pero AUN NO RIGE (falta su DS reglamentario). Conmutable por config para el
// dia que el reglamento salga, sin tocar codigo probado.
export const IMPORT_VAT_RATES = { inside_1494: 0.1494, outside_13: 0.13 };

/**
 * IVA de importacion. Base = valor en aduana + GA + ICE. Es CREDITO FISCAL
 * recuperable: NO capitaliza al inventario (ver computeLandedCostUsd, salvo
 * includeVatInCost). vatMode default 'inside_1494' hasta que rija la Ley 1733.
 */
export function computeImportVat(customsValue, ga = 0, ice = 0, { vatMode = "inside_1494" } = {}) {
  const rate = IMPORT_VAT_RATES[vatMode];
  if (rate === undefined) {
    throw new Error(`vatMode invalido: ${vatMode} (usar inside_1494 u outside_13)`);
  }
  const base = round2(Number(customsValue ?? 0) + Number(ga ?? 0) + Number(ice ?? 0));
  return { vatMode, rate, base, amount: round2(base * rate), recoverable: true };
}

/**
 * ICE (Impuesto a los Consumos Especificos): solo bienes especificos (alcohol,
 * tabaco, vehiculos...). Ad-valorem sobre el valor en aduana, CONFIGURABLE y
 * APAGADO por default (N/A para material electrico). A diferencia del IVA, el
 * ICE NO es recuperable: es un costo mas del inventario.
 */
export function computeIce(customsValue, { rate = 0, applies = false } = {}) {
  if (!applies) {
    return 0;
  }
  return round2(Number(customsValue ?? 0) * Number(rate ?? 0));
}

// --- Costo puesto en almacen (landed cost) por linea ------------------------

/**
 * Costo unitario puesto en almacen de UNA linea de un embarque. Reparte los
 * costos de nivel embarque (flete, seguro, carga/descarga, despacho, almacenaje,
 * transporte interno) entre las lineas por VALOR (fob) o por PESO (weightKg), y
 * suma los cargos por linea (GA, ICE, verificacion aduanera FOB x coef).
 *
 * El IVA de importacion se EXCLUYE del costo (es credito fiscal recuperable),
 * salvo includeVatInCost=true. Devuelve el desglose auditable para el snapshot
 * (landed_cost_calculation).
 *
 * gaPct ya resuelto por la subpartida de la linea (ver resolveTariffRate). El
 * costo de inventario carga el flete/seguro COMPLETOS (100%), no el 10% de la
 * base imponible: la reduccion del DS 5646 baja el impuesto, no el costo real.
 */
export function computeLandedCostUsd({
  shipment,
  line,
  gaPct = 0,
  vatMode = "inside_1494",
  includeVatInCost = false,
  distributeBy = "value",
  freightInsuranceFactor = 0.10,
  ice = { rate: 0, applies: false },
} = {}) {
  const lines = Array.isArray(shipment?.lines) && shipment.lines.length ? shipment.lines : [line];
  const totalFob = lines.reduce((sum, item) => sum + Number(item?.fobUsd ?? 0), 0) || Number(shipment?.fobUsd ?? 0);
  const totalWeight = lines.reduce((sum, item) => sum + Number(item?.weightKg ?? 0), 0);

  let share;
  if (distributeBy === "weight") {
    share = totalWeight > 0 ? Number(line?.weightKg ?? 0) / totalWeight : 1 / lines.length;
  } else {
    share = totalFob > 0 ? Number(line?.fobUsd ?? 0) / totalFob : 1 / lines.length;
  }

  const fob = Number(line?.fobUsd ?? 0);
  const freight = Number(shipment?.freightUsd ?? 0) * share;
  const insurance = Number(shipment?.insuranceUsd ?? 0) * share;
  const loading = Number(shipment?.loadingUnloadingUsd ?? 0) * share;
  const despacho = Number(shipment?.despachoUsd ?? 0) * share;
  const almacenaje = Number(shipment?.almacenajeUsd ?? 0) * share;
  const transporte = Number(shipment?.transporteInternoUsd ?? 0) * share;
  const verificacion = round2(Number(shipment?.verificacionPct ?? 0) * fob);

  const customsValue = computeCustomsValue(fob, freight, insurance, loading, { freightInsuranceFactor });
  const ga = computeTariff(customsValue, gaPct);
  const iceAmount = computeIce(customsValue, ice);
  const vat = computeImportVat(customsValue, ga, iceAmount, { vatMode });

  const goodsAndLogistics = round2(
    fob + freight + insurance + loading + despacho + almacenaje + transporte + verificacion + ga + iceAmount,
  );
  const inventoryUsd = includeVatInCost ? round2(goodsAndLogistics + vat.amount) : goodsAndLogistics;
  const recoverableVatUsd = includeVatInCost ? 0 : vat.amount;
  const quantity = Number(line?.quantity ?? 0);
  const unitLandedCostUsd = quantity > 0 ? round2(inventoryUsd / quantity) : 0;

  return {
    distributeBy,
    share: roundN(share, 6),
    breakdown: {
      fobUsd: round2(fob),
      freightUsd: round2(freight),
      insuranceUsd: round2(insurance),
      loadingUnloadingUsd: round2(loading),
      despachoUsd: round2(despacho),
      almacenajeUsd: round2(almacenaje),
      transporteInternoUsd: round2(transporte),
      verificacionUsd: verificacion,
      gaUsd: ga,
      iceUsd: iceAmount,
    },
    customsValueUsd: customsValue,
    vatMode: vat.vatMode,
    vatRate: vat.rate,
    importVatUsd: vat.amount,
    recoverableVatUsd,
    vatIncludedInCost: Boolean(includeVatInCost),
    inventoryUsd,
    quantity,
    unitLandedCostUsd,
  };
}

/** Suma los resultados por linea a totales de embarque para el asiento. */
export function sumLandedResults(results = []) {
  return results.reduce(
    (acc, result) => ({
      inventoryUsd: round2(acc.inventoryUsd + Number(result?.inventoryUsd ?? 0)),
      recoverableVatUsd: round2(acc.recoverableVatUsd + Number(result?.recoverableVatUsd ?? 0)),
    }),
    { inventoryUsd: 0, recoverableVatUsd: 0 },
  );
}

// --- Valuacion de inventario: CPP y PEPS (UEPS prohibido, NC 2) ---------------

/**
 * Costo Promedio Ponderado (CPP) tras una entrada: mezcla la existencia previa
 * (qty a unitCost) con la entrada (inQty a inLandedUnitCost). Devuelve la nueva
 * cantidad y el nuevo costo unitario promedio.
 */
export function weightedAverageCost(qty, unitCost, inQty, inLandedUnitCost) {
  const totalQty = Number(qty ?? 0) + Number(inQty ?? 0);
  if (totalQty <= 0) {
    return { quantity: 0, unitCost: 0 };
  }
  const value = Number(qty ?? 0) * Number(unitCost ?? 0) + Number(inQty ?? 0) * Number(inLandedUnitCost ?? 0);
  return { quantity: round2(totalQty), unitCost: round2(value / totalQty) };
}

/**
 * Costo de ventas por PEPS (FIFO): consume `outQty` de las capas mas antiguas
 * primero. Devuelve el costo de ventas y las capas restantes (no muta la entrada).
 * UEPS (LIFO) esta PROHIBIDO en Bolivia (NC 2), por eso no existe una variante.
 * Lanza si no hay stock suficiente.
 */
export function fifoCogs(layers = [], outQty) {
  let remaining = Number(outQty ?? 0);
  if (remaining < 0) {
    throw new Error("cantidad a vender no puede ser negativa");
  }
  const remainingLayers = layers.map((layer) => ({ ...layer }));
  let cogs = 0;
  for (const layer of remainingLayers) {
    if (remaining <= 0) {
      break;
    }
    const available = Number(layer.quantity ?? 0);
    const take = Math.min(available, remaining);
    cogs += take * Number(layer.unitCost ?? 0);
    layer.quantity = roundN(available - take, 6);
    remaining = roundN(remaining - take, 6);
  }
  if (remaining > 0) {
    throw new Error(`stock insuficiente para PEPS: faltan ${remaining}`);
  }
  return {
    cogs: round2(cogs),
    remainingLayers: remainingLayers.filter((layer) => Number(layer.quantity ?? 0) > 0),
  };
}

// --- Puente a contabilidad: asiento y RCV -----------------------------------

/**
 * Asiento CUADRADO de nacionalizacion de un embarque. landedResult son los
 * totales del embarque { inventoryUsd, recoverableVatUsd } (ver sumLandedResults).
 *   Debe  Inventarios (1.1.4)          = costo puesto en almacen (sin IVA rec.)
 *   Debe  Credito Fiscal IVA (1.1.5)   = IVA de importacion recuperable
 *   Haber CxP/Bancos/Anticipos         = como se financio (default: todo a CxP)
 * settlement { bankUsd, advanceUsd, payableUsd } reparte el haber; si falta
 * payableUsd se calcula por diferencia. Codigos por defecto = plan Bolivia
 * (accounting.seed.bolivia.json). Usa assertBalanced (accounting) antes de devolver.
 */
export function buildImportJournalEntry(shipment, landedResult, accountCodes = {}, { settlement } = {}) {
  const codes = {
    inventory: "1.1.4",
    ivaCredit: "1.1.5",
    payable: "2.1.1",
    bank: "1.1.2",
    advance: "1.1.6",
    ...accountCodes,
  };
  const inventory = round2(landedResult?.inventoryUsd ?? 0);
  const ivaCredit = round2(landedResult?.recoverableVatUsd ?? 0);
  const totalDebit = round2(inventory + ivaCredit);

  const bank = round2(settlement?.bankUsd ?? 0);
  const advance = round2(settlement?.advanceUsd ?? 0);
  const payable = round2(settlement?.payableUsd ?? round2(totalDebit - bank - advance));

  const lines = [
    { accountCode: codes.inventory, debit: inventory, credit: 0, description: "Inventarios importados (costo puesto en almacen)" },
    ...(ivaCredit > 0
      ? [{ accountCode: codes.ivaCredit, debit: ivaCredit, credit: 0, description: "Credito Fiscal IVA importaciones" }]
      : []),
    ...(advance > 0
      ? [{ accountCode: codes.advance, debit: 0, credit: advance, description: "Aplicacion de anticipo a proveedor" }]
      : []),
    ...(bank > 0 ? [{ accountCode: codes.bank, debit: 0, credit: bank, description: "Pago desde bancos" }] : []),
    ...(payable > 0
      ? [{ accountCode: codes.payable, debit: 0, credit: payable, description: "Cuentas por pagar (proveedor del exterior)" }]
      : []),
  ];

  assertBalanced(lines);

  return {
    glosa: `Nacionalizacion DUI ${shipment?.duiNumber ?? ""}`.trim(),
    entryType: "diario",
    date: shipment?.validationDate ?? null,
    sourceType: "import_shipment",
    sourceId: shipment?.id ?? null,
    lines,
  };
}

/**
 * Mapea una DUI (import_shipment nacionalizado) a un rcv_record de COMPRA para
 * que el credito fiscal del IVA de importacion entre en el periodo correcto.
 * authorizationCode = numero de DUI; date = validationDate (fecha de validacion
 * de la DUI, que fija el periodo). amount = base imponible; ivaAmount = IVA imp.
 */
export function mapImportToRcvRecord(dui) {
  const date = dui?.validationDate ?? null;
  return {
    kind: "compra",
    period: date ? String(date).slice(0, 7) : null,
    invoiceNumber: dui?.duiNumber ?? null,
    authorizationCode: dui?.duiNumber ?? null,
    nit: dui?.supplierNit ?? null,
    partnerName: dui?.supplierName ?? null,
    date,
    amount: round2(dui?.vatBaseUsd ?? dui?.amount ?? 0),
    ivaAmount: round2(dui?.importVatUsd ?? dui?.ivaAmount ?? 0),
    source: "import_shipment",
  };
}

// --- Diferencia de cambio (NC 6) --------------------------------------------

/**
 * Diferencia de cambio sobre una partida MONETARIA en USD (CxP del exterior,
 * prestamos USD, caja/CxC USD) entre la tasa de origen y la de cierre (NC 6).
 *  - nature 'liability' (CxP/prestamo): si sube la tasa, la deuda en Bs sube -> PERDIDA.
 *  - nature 'asset' (caja/CxC USD): si sube la tasa -> GANANCIA.
 * realized distingue la realizada (al pagar/cobrar) de la NO realizada (al
 * cierre, partida aun abierta). resultBob > 0 = ganancia; < 0 = perdida.
 */
export function exchangeDifference(amountUsd, rateAtOrigin, rateAtClose, { realized = false, nature = "liability" } = {}) {
  const usd = Number(amountUsd ?? 0);
  const originBob = round2(usd * Number(rateAtOrigin ?? 0));
  const closeBob = round2(usd * Number(rateAtClose ?? 0));
  const deltaBob = round2(closeBob - originBob);
  const resultBob = nature === "liability" ? round2(-deltaBob) : deltaBob;
  return {
    nature,
    originBob,
    closeBob,
    deltaBob,
    resultBob,
    kind: resultBob >= 0 ? "ganancia" : "perdida",
    realized: Boolean(realized),
  };
}
