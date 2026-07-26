/*
 * Tests del plan de cuentas base Bolivia (accounting.seed.bolivia.json).
 * Valida coherencia estructural y que sirva como mapa de cuentas para los
 * estados financieros. Run: node --test onia-core/modules/accounting.seed.test.mjs
 */
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getModule, loadModules } from "./index.mjs";
import { balanceSheet } from "./accounting.logic.mjs";

const seed = JSON.parse(readFileSync(new URL("./accounting.seed.bolivia.json", import.meta.url), "utf8"));
const config = getModule(loadModules(), "accounting").bolivianConfig;

describe("plan de cuentas base Bolivia", () => {
  const accounts = seed.accounts;
  const byCode = new Map(accounts.map((account) => [account.code, account]));

  it("tiene codigos unicos", () => {
    assert.equal(byCode.size, accounts.length);
  });

  it("usa accountTypes validos, naturaleza deudora/acreedora y nivel valido", () => {
    const validTypes = new Set(config.accountTypes);
    for (const account of accounts) {
      assert.ok(validTypes.has(account.accountType), `${account.code} tipo ${account.accountType}`);
      assert.ok(["deudora", "acreedora"].includes(account.nature), `${account.code} naturaleza`);
      assert.ok(account.level >= 1, `${account.code} nivel`);
    }
  });

  it("todo parentCode existe en el plan", () => {
    for (const account of accounts) {
      if (account.parentCode) {
        assert.ok(byCode.has(account.parentCode), `${account.code} parent ${account.parentCode}`);
      }
    }
  });

  it("cubre las 6 clases contables", () => {
    const types = new Set(accounts.map((account) => account.accountType));
    for (const type of ["activo", "pasivo", "patrimonio", "ingreso", "gasto", "costo"]) {
      assert.ok(types.has(type), `falta la clase ${type}`);
    }
  });

  it("incluye cuentas clave (IVA, depreciacion y provisiones laborales)", () => {
    const postable = accounts.filter((account) => account.isPostable);
    assert.ok(postable.length >= 20, "suficientes cuentas postables");
    const names = accounts.map((account) => account.name.toLowerCase());
    assert.ok(names.some((name) => name.includes("credito fiscal iva")));
    assert.ok(names.some((name) => name.includes("debito fiscal iva")));
    assert.ok(names.some((name) => name.includes("depreciacion acumulada")));
    assert.ok(names.some((name) => name.includes("provision aguinaldo")));
    assert.ok(names.some((name) => name.includes("provision indemnizacion")));
  });

  it("sirve como mapa de cuentas para los estados financieros", () => {
    const accountsMap = Object.fromEntries(
      accounts.map((account) => [account.code, { accountType: account.accountType }]),
    );
    assert.equal(accountsMap["1.1.1"].accountType, "activo");
    assert.equal(accountsMap["4.1"].accountType, "ingreso");

    // Un aporte de capital en efectivo cuadra con este plan real.
    const bs = balanceSheet(
      [
        { accountCode: "1.1.1", debit: 5000, credit: 0 },
        { accountCode: "3.1", debit: 0, credit: 5000 },
      ],
      accountsMap,
    );
    assert.equal(bs.activo, 5000);
    assert.equal(bs.patrimonio, 5000);
    assert.equal(bs.balanced, true);
  });
});
