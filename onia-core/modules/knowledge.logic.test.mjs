/*
 * Tests de la logica pura del modulo knowledge. Run:
 *   node --test onia-core/modules/knowledge.logic.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  ARTICLE_STATES,
  applyArticleTransition,
  assertAcyclic,
  canTransitionArticle,
  resolveCategoryPath,
  scoreArticle,
  searchArticles,
  slugify,
  wouldCreateCycle,
} from "./knowledge.logic.mjs";

describe("article state machine", () => {
  it("expone los tres estados en orden", () => {
    assert.deepEqual(ARTICLE_STATES, ["draft", "published", "archived"]);
  });

  it("draft -> published -> archived es el camino canonico", () => {
    assert.ok(canTransitionArticle("draft", "published"));
    assert.ok(canTransitionArticle("published", "archived"));
  });

  it("archived -> published restaura (re-publicar)", () => {
    assert.ok(canTransitionArticle("archived", "published"));
  });

  it("draft -> archived permitido (descartar sin publicar)", () => {
    assert.ok(canTransitionArticle("draft", "archived"));
  });

  it("rechaza transiciones invalidas", () => {
    assert.equal(canTransitionArticle("published", "draft"), false);
    assert.equal(canTransitionArticle("archived", "draft"), false);
    assert.equal(canTransitionArticle("draft", "draft"), false);
    assert.equal(canTransitionArticle(undefined, "published"), false);
  });

  it("publicar sella publishedAt y no muta el original", () => {
    const draft = { id: "a1", status: "draft", title: "Ficha" };
    const published = applyArticleTransition(draft, "published", { now: "2026-07-22T10:00:00Z" });
    assert.equal(draft.status, "draft");
    assert.equal(draft.publishedAt, undefined);
    assert.equal(published.status, "published");
    assert.equal(published.publishedAt, "2026-07-22T10:00:00Z");
    assert.equal(published.updatedAt, "2026-07-22T10:00:00Z");
  });

  it("archivar preserva el publishedAt original", () => {
    const published = { id: "a1", status: "published", publishedAt: "2026-07-01T00:00:00Z" };
    const archived = applyArticleTransition(published, "archived", { now: "2026-07-22T12:00:00Z" });
    assert.equal(archived.status, "archived");
    assert.equal(archived.publishedAt, "2026-07-01T00:00:00Z");
    assert.equal(archived.updatedAt, "2026-07-22T12:00:00Z");
  });

  it("re-publicar desde archived conserva el primer publishedAt", () => {
    const archived = { id: "a1", status: "archived", publishedAt: "2026-07-01T00:00:00Z" };
    const republished = applyArticleTransition(archived, "published", { now: "2026-07-22T15:00:00Z" });
    assert.equal(republished.status, "published");
    assert.equal(republished.publishedAt, "2026-07-01T00:00:00Z");
  });

  it("archivar un draft sin publicar deja publishedAt en null", () => {
    const draft = { id: "a1", status: "draft" };
    const archived = applyArticleTransition(draft, "archived", { now: "2026-07-22T00:00:00Z" });
    assert.equal(archived.publishedAt, null);
  });

  it("lanza en transicion invalida", () => {
    assert.throws(() => applyArticleTransition({ status: "published" }, "draft"), /invalida/);
  });
});

describe("integridad del arbol de taxonomia", () => {
  // A (raiz) <- B <- C
  const tree = [
    { id: "A", parentId: null },
    { id: "B", parentId: "A" },
    { id: "C", parentId: "B" },
  ];

  it("resolveCategoryPath devuelve la ruta root-first inclusive", () => {
    assert.deepEqual(resolveCategoryPath(tree, "C"), ["A", "B", "C"]);
    assert.deepEqual(resolveCategoryPath(tree, "A"), ["A"]);
  });

  it("resolveCategoryPath devuelve [] para id inexistente", () => {
    assert.deepEqual(resolveCategoryPath(tree, "Z"), []);
  });

  it("ciclo directo: A no puede ser su propio padre", () => {
    assert.equal(wouldCreateCycle(tree, "A", "A"), true);
  });

  it("ciclo indirecto: A no puede colgar de su descendiente C", () => {
    assert.equal(wouldCreateCycle(tree, "A", "C"), true);
  });

  it("reparent benigno: C puede colgar de A (ya es su ancestro, sin ciclo)", () => {
    assert.equal(wouldCreateCycle(tree, "C", "A"), false);
  });

  it("newParentId null (=raiz) nunca cicla", () => {
    assert.equal(wouldCreateCycle(tree, "B", null), false);
  });

  it("assertAcyclic acepta un arbol valido", () => {
    assert.equal(assertAcyclic(tree), true);
  });

  it("assertAcyclic lanza ante ciclo directo A->A", () => {
    assert.throws(() => assertAcyclic([{ id: "A", parentId: "A" }]), /ciclo/);
  });

  it("assertAcyclic lanza ante ciclo indirecto A->B->A", () => {
    const cyclic = [
      { id: "A", parentId: "B" },
      { id: "B", parentId: "A" },
    ];
    assert.throws(() => assertAcyclic(cyclic), /ciclo/);
  });
});

describe("slugify", () => {
  it("minusculas, sin acentos, con guiones", () => {
    assert.equal(slugify("Ficha Tecnica: Cable THHN"), "ficha-tecnica-cable-thhn");
  });

  it("quita acentos y la enie", () => {
    assert.equal(slugify("Nandu Electrico"), "nandu-electrico");
    assert.equal(slugify("Instalación Eléctrica"), "instalacion-electrica");
    assert.equal(slugify("Piña Ñandú"), "pina-nandu");
  });

  it("colapsa separadores y recorta guiones extremos", () => {
    assert.equal(slugify("  Multiple   Espacios  "), "multiple-espacios");
    assert.equal(slugify("2.5mm cable!!"), "2-5mm-cable");
  });

  it("es deterministico e idempotente sobre un slug ya formado", () => {
    assert.equal(slugify("ya-es-slug"), "ya-es-slug");
    assert.equal(slugify(slugify("Café Con Leche")), "cafe-con-leche");
  });
});

describe("searchArticles (ranking lexico, no semantico)", () => {
  const articles = [
    { id: "a1", title: "Cable eléctrico THHN", body: "Conductor de cobre.", tags: ["cable", "instalacion"] },
    { id: "a2", title: "Instalación de tableros", body: "Uso de cable.", tags: ["tablero"] },
    { id: "a3", title: "Facturación", body: "Nada relevante.", tags: ["fiscal"] },
  ];

  it("titulo pesa mas que tag, y el cuerpo aporta", () => {
    // a1: titulo(+3) + tag(+2) = 5 ; a2: cuerpo(+1) = 1
    assert.deepEqual(searchArticles(articles, "cable").map((a) => a.id), ["a1", "a2"]);
  });

  it("es insensible a acentos y rankea por puntaje", () => {
    // "instalacion": a2 titulo(+3) ; a1 tag(+2)
    assert.deepEqual(searchArticles(articles, "instalacion").map((a) => a.id), ["a2", "a1"]);
  });

  it("consulta vacia => [] (sin senal lexica)", () => {
    assert.deepEqual(searchArticles(articles, ""), []);
    assert.deepEqual(searchArticles(articles, "   "), []);
  });

  it("sin coincidencias => []", () => {
    assert.deepEqual(searchArticles(articles, "zzz"), []);
  });

  it("scoreArticle pondera titulo(3)+tag(2)+cuerpo(1)", () => {
    assert.equal(scoreArticle(articles[0], ["cable"]), 5);
    assert.equal(scoreArticle(articles[1], ["cable"]), 1);
    assert.equal(scoreArticle(articles[2], ["cable"]), 0);
    assert.equal(scoreArticle(articles[0], []), 0);
  });
});
