import test from "node:test";
import assert from "node:assert/strict";
import { planAviso, tituloAviso } from "./onia-mirar-aviso-estado.mjs";

const H = 3600 * 1000;
const inicio = 10 * H;

test("same persistent alert resets six hours after delivered reminder", () => {
  const plan = planAviso({ roto: true, ts: inicio }, true, inicio + 6 * H + 1);
  assert.equal(plan.debeAvisar, true);
  const state = plan.despues(true);
  assert.equal(state.ts, inicio + 6 * H + 1);
  for (let minutes = 15; minutes <= 360; minutes += 15)
    assert.equal(planAviso(state, true, state.ts + minutes * 60000).debeAvisar, false);
  assert.equal(planAviso(state, true, state.ts + 6 * H + 1).debeAvisar, true);
});

test("changes and recovery are delivered once, healthy equality is quiet", () => {
  const broken = planAviso({ roto: false, ts: inicio }, true, inicio + 1);
  assert.equal(broken.debeAvisar, true);
  const recovery = planAviso(broken.despues(true), false, inicio + 2);
  assert.equal(recovery.debeAvisar, true);
  assert.equal(planAviso(recovery.despues(true), false, inicio + 3).debeAvisar, false);
});

test("transport failure retains pending state and bounds repeated attempts", () => {
  const failed = planAviso({ roto: false, ts: inicio }, true, inicio + 1).despues(false);
  assert.equal(failed.roto, false);
  assert.equal(failed.ts, inicio);
  assert.equal(failed.ultimoEnvioOk, false);
  assert.equal(planAviso(failed, true, inicio + 15 * 60000).debeAvisar, false);
  assert.equal(planAviso(failed, true, failed.intentoTs + 6 * H).debeAvisar, false);
  assert.equal(planAviso(failed, true, failed.intentoTs + 6 * H + 1).debeAvisar, true);
});

test("failed recovery remains pending and does not become a fake healthy receipt", () => {
  const failed = planAviso({ roto: true, ts: inicio }, false, inicio + 1).despues(false);
  assert.equal(failed.roto, true);
  assert.equal(planAviso(failed, false, inicio + H).debeAvisar, false);
  assert.equal(planAviso(failed, false, failed.intentoTs + 6 * H + 1).debeAvisar, true);
});

test("unknown malformed or future history never invents recovery", () => {
  for (const state of [null, {}, { roto: "true", ts: 0 }, { roto: true, ts: inicio + 1 }]) {
    assert.equal(planAviso(state, false, inicio).desconocido, true);
    assert.equal(planAviso(state, false, inicio).debeAvisar, false);
    assert.equal(planAviso(state, true, inicio).debeAvisar, true);
  }
});

test("forced notice remains explicit and invalid inputs fail closed", () => {
  assert.equal(planAviso({ roto: false, ts: inicio }, false, inicio, true).debeAvisar, true);
  for (const args of [[{}, "true", inicio], [{}, true, -1], [{}, true, inicio, "yes"]])
    assert.throws(() => planAviso(...args), TypeError);
});

test("monitor title claims recovery only with valid previously broken history", () => {
  for (const previous of [null, {}, { roto: false, ts: inicio }, { roto: true, ts: inicio + 1 }]) {
    const plan = planAviso(previous, false, inicio, true);
    assert.equal(plan.debeAvisar, true);
    assert.equal(tituloAviso(plan, 0, 3), "🟢 <b>Onia — La comprobación actual no detectó alertas</b>");
  }
  const recovery = planAviso({ roto: true, ts: inicio }, false, inicio + 1);
  assert.equal(tituloAviso(recovery, 0, 3), "🟢 <b>Onia — las pantallas del cliente volvieron a estar bien</b>");
  assert.equal(tituloAviso(planAviso(null, true, inicio), 3, 3), "🔴 <b>Onia — lo que ve el cliente esta ROTO</b> (3/3)");
});
