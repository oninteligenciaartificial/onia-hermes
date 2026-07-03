import { describe, expect, it } from "vitest";
import { sanitizeCliArgv } from "./argv";

describe("sanitizeCliArgv", () => {
  it("drops the bare -- token pnpm forwards into script argv", () => {
    const argv = ["node", "factory-build.ts", "--", "--input", "data/intakes/demo.json", "--dry-run"];
    expect(sanitizeCliArgv(argv)).toEqual([
      "node",
      "factory-build.ts",
      "--input",
      "data/intakes/demo.json",
      "--dry-run",
    ]);
  });

  it("leaves argv without a separator untouched", () => {
    const argv = ["node", "auto-design.ts", "restaurant-demo", "--template", "landing"];
    expect(sanitizeCliArgv(argv)).toEqual(argv);
  });

  it("keeps flag values that merely contain dashes", () => {
    const argv = ["node", "generate.ts", "--template", "landing", "slug-with-dashes"];
    expect(sanitizeCliArgv(argv)).toEqual(argv);
  });
});
