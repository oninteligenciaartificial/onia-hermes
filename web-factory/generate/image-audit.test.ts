import { describe, expect, it } from "vitest";
import { auditImageAssets } from "./image-audit";

describe("auditImageAssets", () => {
  it("warns about heavy legacy raster with no modern sibling", () => {
    const { warnings, errors } = auditImageAssets([{ path: "hero.png", bytes: 120 * 1024 }]);
    expect(errors).toEqual([]);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain("hero.png");
    expect(warnings[0]).toContain(".webp/.avif");
  });

  it("does not warn when a webp/avif sibling exists", () => {
    const { warnings } = auditImageAssets([
      { path: "hero.png", bytes: 120 * 1024 },
      { path: "hero.webp", bytes: 40 * 1024 },
    ]);
    expect(warnings).toEqual([]);
  });

  it("ignores svg and small icons", () => {
    const { warnings, errors } = auditImageAssets([
      { path: "logo.svg", bytes: 900 * 1024 },
      { path: "icon.png", bytes: 8 * 1024 },
    ]);
    expect(warnings).toEqual([]);
    expect(errors).toEqual([]);
  });

  it("errors on any oversized raster, even webp", () => {
    const { errors } = auditImageAssets([{ path: "photo.webp", bytes: 500 * 1024 }]);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("budget");
  });
});
