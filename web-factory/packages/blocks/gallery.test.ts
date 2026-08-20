import { describe, expect, it } from "vitest";
import {
  GALLERY,
  modelGaps,
  NON_BLOCK_RENDER_EXPORTS,
  readModelDemand,
  readTemplateUsage,
} from "./gallery";
import * as blocks from "./src/index";

// The gallery is only worth trusting if it cannot go stale. These are the two
// ways it could: a block gets added and never shows up, or the usage scan starts
// crediting the wrong template.

describe("gallery catalog", () => {
  it("covers every render export of src/index.ts", () => {
    const exported = Object.keys(blocks).filter((name) => name.startsWith("render"));
    const catalogued = new Set<string>([...GALLERY.map((block) => block.fn), ...NON_BLOCK_RENDER_EXPORTS]);
    const missing = exported.filter((name) => !catalogued.has(name));

    expect(missing, "new block: add it to GALLERY (or to NON_BLOCK_RENDER_EXPORTS if it is a utility)").toEqual([]);
  });

  it("gives every entry a unique id and real markup", () => {
    const ids = GALLERY.map((block) => block.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const block of GALLERY) {
      expect(block.html.trim(), `${block.id} rendered empty`).not.toBe("");
      expect(block.file, `${block.id} file path`).toMatch(/^packages\/blocks\/src\//);
    }
  });
});

describe("readTemplateUsage", () => {
  it("credits a block to the templates that call it", async () => {
    const usage = await readTemplateUsage();
    expect(usage.get("renderHero")).toContain("landing");
    expect(usage.get("renderFooterBrand")).toContain("landing-realestate");
  });

  it("does not confuse renderFooter with renderFooterBrand", async () => {
    const usage = await readTemplateUsage();
    // landing-realestate composes renderFooterBrand only. Matching on the bare
    // name (no paren) would credit renderFooter here and hide a real orphan.
    expect(usage.get("renderFooter")).not.toContain("landing-realestate");
  });
});

describe("model demand", () => {
  it("reads what the learned models ask for and only reports what is missing", async () => {
    const demand = await readModelDemand();
    expect(demand.length).toBeGreaterThan(0);
    // Sorted by how many models need each block, so the gap list is prioritised.
    expect(demand.map((entry) => entry.models.length)).toEqual(
      [...demand.map((entry) => entry.models.length)].sort((a, b) => b - a),
    );

    const built = new Set(GALLERY.map((block) => block.id));
    for (const gap of modelGaps(demand)) {
      expect(built.has(gap.block), `${gap.block} is built but listed as missing`).toBe(false);
      expect(gap.models.length).toBeGreaterThan(0);
    }
  });
});
