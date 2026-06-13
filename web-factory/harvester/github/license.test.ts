import { describe, expect, it } from "vitest";
import { assertClientSafeLicense, detectLicense } from "./clone";

describe("license filter", () => {
  it("accepts MIT and Apache-2.0 licenses", () => {
    expect(detectLicense("MIT License\nPermission is hereby granted")).toBe("MIT");
    expect(detectLicense("Apache License\nVersion 2.0, January 2004")).toBe("Apache-2.0");
    expect(() => assertClientSafeLicense("MIT")).not.toThrow();
    expect(() => assertClientSafeLicense("Apache-2.0")).not.toThrow();
  });

  it("rejects GPL and AGPL licenses", () => {
    expect(detectLicense("GNU General Public License")).toBe("GPL");
    expect(detectLicense("GNU Affero General Public License")).toBe("AGPL");
    expect(() => assertClientSafeLicense("GPL")).toThrow("rejected");
    expect(() => assertClientSafeLicense("AGPL")).toThrow("rejected");
  });

  it("requires manual review for unknown licenses", () => {
    expect(detectLicense("All rights reserved")).toBe("UNKNOWN");
    expect(() => assertClientSafeLicense("UNKNOWN")).toThrow("manual review");
  });
});
