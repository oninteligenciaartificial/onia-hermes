import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  SCHEDULER_DEFAULTS,
  isCufdExpired,
  needsCufdRenewal,
  cufdAppliesTo,
  isCuisExpiringSoon,
  nextRenewalDate,
} from "../src/scheduler.mjs";

// CUFD emitido el 2026-07-22 08:00Z, vigente 24h (hasta 2026-07-23 08:00Z).
const cufdDia = {
  codigo: "CUFD-ABC",
  codigoControl: "A1-B2",
  fechaEmision: "2026-07-22T08:00:00.000Z",
  fechaVigencia: "2026-07-23T08:00:00.000Z",
  sucursalCodigo: 0,
  puntoVentaCodigo: 0,
};

// CUFD sin fechaEmision: se cae al dia de la fechaVigencia (fin del dia 07-22).
const cufdSinEmision = {
  codigo: "CUFD-XYZ",
  codigoControl: "C3-D4",
  fechaVigencia: "2026-07-22T23:59:59.000Z",
  sucursalCodigo: 0,
  puntoVentaCodigo: 0,
};

describe("SCHEDULER_DEFAULTS", () => {
  it("expone los defaults del plan (5 dias CUIS, 24h CUFD)", () => {
    assert.equal(SCHEDULER_DEFAULTS.cuisRenewDaysBefore, 5);
    assert.equal(SCHEDULER_DEFAULTS.cufdVigenciaHours, 24);
  });
});

describe("isCufdExpired", () => {
  it("vigente el mismo dia dentro de las 24h", () => {
    assert.equal(isCufdExpired(cufdDia, "2026-07-22T15:00:00.000Z"), false);
  });

  it("vencido: dia calendario distinto aunque falten horas para la vigencia", () => {
    // 07-23 07:00Z: aun < fechaVigencia (08:00Z) pero es OTRO dia -> vencido.
    assert.equal(isCufdExpired(cufdDia, "2026-07-23T07:00:00.000Z"), true);
  });

  it("vencido: paso la fechaVigencia de 24h", () => {
    assert.equal(isCufdExpired(cufdDia, "2026-07-23T09:00:00.000Z"), true);
  });

  it("vencido: CUFD ausente o sin fechaVigencia", () => {
    assert.equal(isCufdExpired(null, "2026-07-22T15:00:00.000Z"), true);
    assert.equal(isCufdExpired({ codigo: "X" }, "2026-07-22T15:00:00.000Z"), true);
  });

  it("vencido: nowIso invalido", () => {
    assert.equal(isCufdExpired(cufdDia, "no-es-fecha"), true);
  });

  it("fallback sin fechaEmision: usa el dia de la fechaVigencia", () => {
    assert.equal(isCufdExpired(cufdSinEmision, "2026-07-22T10:00:00.000Z"), false);
    assert.equal(isCufdExpired(cufdSinEmision, "2026-07-23T00:00:01.000Z"), true);
  });
});

describe("needsCufdRenewal", () => {
  it("false cuando el CUFD del dia esta vigente", () => {
    assert.equal(needsCufdRenewal(cufdDia, "2026-07-22T15:00:00.000Z"), false);
  });

  it("true cuando no hay CUFD", () => {
    assert.equal(needsCufdRenewal(null, "2026-07-22T15:00:00.000Z"), true);
  });

  it("true cuando falta el codigo de control", () => {
    const sinControl = { codigo: "X", fechaVigencia: "2026-07-23T08:00:00.000Z", fechaEmision: "2026-07-22T08:00:00.000Z" };
    assert.equal(needsCufdRenewal(sinControl, "2026-07-22T15:00:00.000Z"), true);
  });

  it("true cuando el CUFD es de otro dia", () => {
    assert.equal(needsCufdRenewal(cufdDia, "2026-07-23T07:00:00.000Z"), true);
  });
});

describe("cufdAppliesTo", () => {
  it("aplica a una factura del mismo dia dentro de vigencia", () => {
    assert.equal(cufdAppliesTo(cufdDia, "2026-07-22T12:00:00.000Z"), true);
  });

  it("no aplica a una factura de otro dia calendario", () => {
    assert.equal(cufdAppliesTo(cufdDia, "2026-07-23T00:30:00.000Z"), false);
  });

  it("no aplica a una factura anterior a la emision del CUFD", () => {
    // 07:00Z del mismo dia, pero el CUFD se emitio a las 08:00Z.
    assert.equal(cufdAppliesTo(cufdDia, "2026-07-22T07:00:00.000Z"), false);
  });

  it("no aplica a una factura posterior a la vigencia", () => {
    assert.equal(cufdAppliesTo(cufdDia, "2026-07-23T09:00:00.000Z"), false);
  });

  it("false con fecha de emision invalida", () => {
    assert.equal(cufdAppliesTo(cufdDia, "no-es-fecha"), false);
  });
});

describe("nextRenewalDate", () => {
  it("resta 5 dias por defecto a la fechaVigencia", () => {
    const cuis = { codigo: "CUIS-1", fechaVigencia: "2026-07-25T00:00:00.000Z" };
    assert.equal(nextRenewalDate(cuis), "2026-07-20T00:00:00.000Z");
  });

  it("respeta un daysBefore custom", () => {
    const cuis = { codigo: "CUIS-1", fechaVigencia: "2026-07-25T00:00:00.000Z" };
    assert.equal(nextRenewalDate(cuis, { daysBefore: 10 }), "2026-07-15T00:00:00.000Z");
  });

  it("conserva la hora de la fechaVigencia", () => {
    const cuis = { codigo: "CUIS-1", fechaVigencia: "2026-08-30T14:30:00.000Z" };
    assert.equal(nextRenewalDate(cuis), "2026-08-25T14:30:00.000Z");
  });

  it("null si no hay fechaVigencia valida", () => {
    assert.equal(nextRenewalDate({ codigo: "X" }), null);
    assert.equal(nextRenewalDate(null), null);
  });
});

describe("isCuisExpiringSoon", () => {
  const cuis = { codigo: "CUIS-1", fechaVigencia: "2026-07-25T00:00:00.000Z" };

  it("false lejos del vencimiento (fuera de la ventana de 5 dias)", () => {
    assert.equal(isCuisExpiringSoon(cuis, "2026-07-19T00:00:00.000Z"), false);
  });

  it("true justo 5 dias antes (borde de la ventana)", () => {
    assert.equal(isCuisExpiringSoon(cuis, "2026-07-20T00:00:00.000Z"), true);
  });

  it("true dentro de la ventana de renovacion", () => {
    assert.equal(isCuisExpiringSoon(cuis, "2026-07-22T00:00:00.000Z"), true);
  });

  it("true si ya vencio (sigue exigiendo renovacion)", () => {
    assert.equal(isCuisExpiringSoon(cuis, "2026-08-01T00:00:00.000Z"), true);
  });

  it("el daysBefore custom mueve la ventana", () => {
    // Con 5 dias, el 2026-07-16 esta fuera; con 10 dias, dentro.
    assert.equal(isCuisExpiringSoon(cuis, "2026-07-16T00:00:00.000Z"), false);
    assert.equal(isCuisExpiringSoon(cuis, "2026-07-16T00:00:00.000Z", { daysBefore: 10 }), true);
  });

  it("false con CUIS ausente o sin fechaVigencia (la ausencia se maneja aparte)", () => {
    assert.equal(isCuisExpiringSoon(null, "2026-07-22T00:00:00.000Z"), false);
    assert.equal(isCuisExpiringSoon({ codigo: "X" }, "2026-07-22T00:00:00.000Z"), false);
  });

  it("false con nowIso invalido", () => {
    assert.equal(isCuisExpiringSoon(cuis, "no-es-fecha"), false);
  });
});

describe("inmutabilidad / pureza", () => {
  it("no muta el CUFD ni el CUIS de entrada", () => {
    const cufd = Object.freeze({ ...cufdDia });
    const cuis = Object.freeze({ codigo: "CUIS-1", fechaVigencia: "2026-07-25T00:00:00.000Z" });
    assert.doesNotThrow(() => {
      isCufdExpired(cufd, "2026-07-22T15:00:00.000Z");
      needsCufdRenewal(cufd, "2026-07-22T15:00:00.000Z");
      cufdAppliesTo(cufd, "2026-07-22T12:00:00.000Z");
      isCuisExpiringSoon(cuis, "2026-07-22T00:00:00.000Z");
      nextRenewalDate(cuis);
    });
  });
});
