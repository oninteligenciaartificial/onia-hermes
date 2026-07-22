/*
 * Tests de la logica de contingencia/offline del emisor SIAT. Run:
 *   node --test hermes-content/integrations/siat/test/contingencia.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { PACKAGE_LIMITS, DEADLINES } from "../src/constants.mjs";
import {
  classifyBySinStatus,
  isOfflineSendOverdue,
  isSignificantEventWindowOpen,
  packageOfflineInvoices,
  shouldEnterContingency,
} from "../src/contingencia.mjs";

describe("shouldEnterContingency", () => {
  it("NO entra si el SIN responde ok:true", () => {
    assert.equal(shouldEnterContingency({ ok: true }), false);
    assert.equal(shouldEnterContingency({ ok: true, status: 200 }), false);
  });

  it("entra si el SIN responde ok:false", () => {
    assert.equal(shouldEnterContingency({ ok: false }), true);
    assert.equal(shouldEnterContingency({ ok: false, status: 503 }), true);
  });

  it("entra si no hay respuesta (null/undefined)", () => {
    assert.equal(shouldEnterContingency(null), true);
    assert.equal(shouldEnterContingency(undefined), true);
  });

  it("entra si el estado es desconocido (sin campo ok)", () => {
    assert.equal(shouldEnterContingency({}), true);
    assert.equal(shouldEnterContingency({ timedOut: true }), true);
  });

  it("ok solo cuenta si es exactamente true (no truthy)", () => {
    assert.equal(shouldEnterContingency({ ok: 1 }), true);
    assert.equal(shouldEnterContingency({ ok: "true" }), true);
  });
});

describe("packageOfflineInvoices", () => {
  const seq = (n) => Array.from({ length: n }, (_, i) => i + 1);

  it("usa por defecto PACKAGE_LIMITS.offlineMax (500)", () => {
    const pkgs = packageOfflineInvoices(seq(500));
    assert.equal(pkgs.length, 1);
    assert.equal(pkgs[0].length, PACKAGE_LIMITS.offlineMax);
  });

  it("exactamente 500 -> un solo paquete", () => {
    const pkgs = packageOfflineInvoices(seq(500));
    assert.equal(pkgs.length, 1);
    assert.equal(pkgs[0].length, 500);
  });

  it("501 -> dos paquetes [500, 1]", () => {
    const pkgs = packageOfflineInvoices(seq(501));
    assert.equal(pkgs.length, 2);
    assert.equal(pkgs[0].length, 500);
    assert.equal(pkgs[1].length, 1);
    assert.equal(pkgs[1][0], 501);
  });

  it("1000 -> dos paquetes llenos; 1001 -> tres", () => {
    assert.equal(packageOfflineInvoices(seq(1000)).length, 2);
    const pkgs = packageOfflineInvoices(seq(1001));
    assert.equal(pkgs.length, 3);
    assert.equal(pkgs[2].length, 1);
  });

  it("respeta maxPerPackage explicito (caso masivo 2000)", () => {
    const pkgs = packageOfflineInvoices(seq(2001), { maxPerPackage: PACKAGE_LIMITS.masiveMax });
    assert.equal(pkgs.length, 2);
    assert.equal(pkgs[0].length, 2000);
    assert.equal(pkgs[1].length, 1);
  });

  it("array vacio -> []", () => {
    assert.deepEqual(packageOfflineInvoices([]), []);
  });

  it("no-array -> []", () => {
    assert.deepEqual(packageOfflineInvoices(null), []);
    assert.deepEqual(packageOfflineInvoices(undefined), []);
  });

  it("no muta la entrada", () => {
    const input = seq(3);
    const copy = [...input];
    packageOfflineInvoices(input, { maxPerPackage: 2 });
    assert.deepEqual(input, copy);
  });

  it("lanza si maxPerPackage < 1 o no entero", () => {
    assert.throws(() => packageOfflineInvoices(seq(3), { maxPerPackage: 0 }), /maxPerPackage/);
    assert.throws(() => packageOfflineInvoices(seq(3), { maxPerPackage: -5 }), /maxPerPackage/);
    assert.throws(() => packageOfflineInvoices(seq(3), { maxPerPackage: 2.5 }), /maxPerPackage/);
  });
});

describe("isSignificantEventWindowOpen", () => {
  const end = "2026-07-08T10:00:00Z";

  it("usa por defecto DEADLINES.significantEventHours (48)", () => {
    // justo a las 48h del fin, todavia abierta (inclusive)
    assert.equal(isSignificantEventWindowOpen(end, "2026-07-10T10:00:00Z"), true);
    assert.equal(DEADLINES.significantEventHours, 48);
  });

  it("abierta dentro de las 48h posteriores", () => {
    assert.ok(isSignificantEventWindowOpen(end, "2026-07-09T00:00:00Z"));
  });

  it("abierta antes de finalizar el evento", () => {
    assert.ok(isSignificantEventWindowOpen(end, "2026-07-08T09:00:00Z"));
  });

  it("justo en el borde de 48h sigue abierta (inclusive)", () => {
    assert.equal(isSignificantEventWindowOpen(end, "2026-07-10T10:00:00Z"), true);
  });

  it("cerrada un segundo despues de las 48h", () => {
    assert.equal(isSignificantEventWindowOpen(end, "2026-07-10T10:00:01Z"), false);
  });

  it("respeta hours explicito", () => {
    assert.equal(isSignificantEventWindowOpen(end, "2026-07-08T11:30:00Z", { hours: 1 }), false);
    assert.equal(isSignificantEventWindowOpen(end, "2026-07-08T10:30:00Z", { hours: 1 }), true);
  });

  it("lanza en fecha invalida", () => {
    assert.throws(() => isSignificantEventWindowOpen("no-fecha", end), /eventEndIso/);
    assert.throws(() => isSignificantEventWindowOpen(end, "no-fecha"), /nowIso/);
  });
});

describe("isOfflineSendOverdue", () => {
  const since = "2026-07-08T00:00:00Z";

  it("usa por defecto DEADLINES.offlineSendHours (48)", () => {
    assert.equal(DEADLINES.offlineSendHours, 48);
    assert.equal(isOfflineSendOverdue(since, "2026-07-10T01:00:00Z"), true);
  });

  it("vencida pasadas las 48h", () => {
    assert.ok(isOfflineSendOverdue(since, "2026-07-10T00:00:01Z"));
  });

  it("justo a las 48h NO esta vencida (dentro de plazo, estricto)", () => {
    assert.equal(isOfflineSendOverdue(since, "2026-07-10T00:00:00Z"), false);
  });

  it("no vencida dentro de las 48h", () => {
    assert.equal(isOfflineSendOverdue(since, "2026-07-09T12:00:00Z"), false);
  });

  it("respeta hours explicito", () => {
    assert.equal(isOfflineSendOverdue(since, "2026-07-08T02:00:00Z", { hours: 1 }), true);
    assert.equal(isOfflineSendOverdue(since, "2026-07-08T00:30:00Z", { hours: 1 }), false);
  });

  it("lanza en fecha invalida", () => {
    assert.throws(() => isOfflineSendOverdue("x", since), /offlineSince/);
    assert.throws(() => isOfflineSendOverdue(since, "x"), /nowIso/);
  });
});

describe("classifyBySinStatus", () => {
  it("mapea 901/904/908 a pendiente/observada/validado", () => {
    assert.equal(classifyBySinStatus(901), "pendiente");
    assert.equal(classifyBySinStatus(904), "observada");
    assert.equal(classifyBySinStatus(908), "validado");
  });

  it("acepta string numerica", () => {
    assert.equal(classifyBySinStatus("901"), "pendiente");
    assert.equal(classifyBySinStatus("908"), "validado");
  });

  it("codigo desconocido -> desconocido", () => {
    assert.equal(classifyBySinStatus(999), "desconocido");
    assert.equal(classifyBySinStatus(0), "desconocido");
    assert.equal(classifyBySinStatus(null), "desconocido");
    assert.equal(classifyBySinStatus(undefined), "desconocido");
    assert.equal(classifyBySinStatus("abc"), "desconocido");
  });
});
