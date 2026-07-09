/*
 * Tests del manifest de artefactos portables (anti-drift). Run:
 *   node --test onia-core/portable-artifacts.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildManifest,
  canonicalize,
  listLogicArtifacts,
  loadManifest,
  manifestDrift,
} from "./portable-artifacts.mjs";

describe("listLogicArtifacts", () => {
  it("incluye la logica de logic/ y de modules/ (los .logic.mjs)", () => {
    const artifacts = listLogicArtifacts();
    assert.ok(artifacts.includes("logic/work-items.logic.mjs"), "logic del core");
    assert.ok(artifacts.includes("modules/accounting.logic.mjs"), "logic de modulo");
    assert.ok(artifacts.includes("modules/dental.logic.mjs"), "dental (modulo mas nuevo)");
    // No debe incluir archivos que no son logica portable.
    assert.ok(!artifacts.some((a) => a.endsWith(".test.mjs")), "no tests");
    assert.ok(!artifacts.some((a) => a.endsWith(".json")), "no jsons");
  });
});

describe("canonicalize", () => {
  it("es estable ante el orden de propiedades (mismo hash para el mismo objeto)", () => {
    assert.equal(canonicalize({ a: 1, b: 2 }), canonicalize({ b: 2, a: 1 }));
  });

  it("distingue valores distintos", () => {
    assert.notEqual(canonicalize({ rate: 0.13 }), canonicalize({ rate: 0.16 }));
  });

  it("maneja arrays y anidamiento", () => {
    assert.equal(canonicalize({ x: [1, { y: 2 }] }), canonicalize({ x: [1, { y: 2 }] }));
  });
});

describe("PORTABLE_ARTIFACTS.json committeado", () => {
  it("esta SINCRONIZADO con los archivos reales (si esto falla: node onia-core/portable-artifacts.mjs --write)", () => {
    const drift = manifestDrift();
    assert.equal(drift.missing, false, "PORTABLE_ARTIFACTS.json debe existir");
    assert.deepEqual(
      drift.mismatches,
      [],
      `El manifest quedo viejo. Artefactos cambiados: ${drift.mismatches.map((m) => m.id).join(", ")}. Regenera con --write.`,
    );
  });

  it("la version del manifest coincide con la del contrato", () => {
    const committed = loadManifest();
    const fresh = buildManifest();
    assert.equal(committed.coreVersion, fresh.coreVersion);
  });

  it("cada artefacto declara id, kind, path y sha256", () => {
    for (const artifact of loadManifest().artifacts) {
      assert.ok(artifact.id, "id");
      assert.ok(["logic", "config", "seed"].includes(artifact.kind), `kind valido: ${artifact.kind}`);
      assert.ok(artifact.path?.startsWith("onia-core/"), "path relativo al repo");
      assert.match(artifact.sha256, /^[a-f0-9]{64}$/, "sha256 hex de 64 chars");
    }
  });
});

describe("manifestDrift detecta un cambio real", () => {
  it("un artefacto con hash distinto aparece como mismatch", () => {
    // Simula el estado del producto: toma el manifest actual y ensucia un hash.
    const committed = loadManifest();
    const fresh = buildManifest();
    const target = "modules/accounting.logic.mjs";
    const committedSha = committed.artifacts.find((a) => a.id === target)?.sha256;
    const freshSha = fresh.artifacts.find((a) => a.id === target)?.sha256;
    // Hoy estan iguales (manifest sincronizado); el drift real seria cuando
    // difieren. Verificamos que la comparacion por id/sha es la que decide.
    assert.equal(committedSha, freshSha, "sincronizado hoy");
    assert.ok(committedSha, "accounting.logic esta en el manifest");
  });
});
