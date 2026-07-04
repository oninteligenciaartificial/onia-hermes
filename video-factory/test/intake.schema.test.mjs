import { test } from "node:test";
import assert from "node:assert/strict";
import { parseIntake } from "../contracts/intake.schema.mjs";

test("intake mínimo válido aplica defaults", () => {
  const out = parseIntake({ slug: "cafe-luna", lane: "cliente", format: "ugc-ad" });
  assert.deepEqual(out.refs, []);
  assert.equal(out.consent, false);
});

test("lane inválida falla", () => {
  assert.throws(() => parseIntake({ slug: "x", lane: "vip", format: "ugc-ad" }));
});
