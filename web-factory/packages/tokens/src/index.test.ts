import { describe, expect, it } from "vitest";
import { clientDarkTokenVars, clientTokenCss } from "./index";

const client = {
  colores: { primary: "#0f766e", secondary: "#1d4ed8", accent: "#f59e0b", bg: "#f8fafc", fg: "#111827" },
  tipografia: { heading: "Onest", body: "Onest" },
};

describe("clientTokenCss dark variant", () => {
  it("emits the light :root block plus dark overrides for the default scope", () => {
    const css = clientTokenCss(client);

    expect(css).toContain(":root {");
    expect(css).toContain("--color-bg: #f8fafc"); // light value from the client
    expect(css).toContain("@media (prefers-color-scheme: dark)");
    expect(css).toContain(':root:not([data-theme="light"])');
    expect(css).toContain('[data-theme="dark"]');
    expect(css).toContain("--color-bg: #0c1013"); // dark surface override
    expect(css).toContain("--card: #161c22");
  });

  it("omits the dark blocks when a custom selector scope is requested", () => {
    const css = clientTokenCss(client, ".wf-preview");

    expect(css).toContain(".wf-preview {");
    expect(css).not.toContain("prefers-color-scheme");
    expect(css).not.toContain("data-theme");
  });

  it("dark overrides only swap surfaces, never brand colors", () => {
    const dark = clientDarkTokenVars();

    expect(dark["--color-fg"]).toBe("#e7e9ec");
    expect(dark["--card"]).toBe("#161c22");
    expect(dark).not.toHaveProperty("--color-primary");
    expect(dark).not.toHaveProperty("--color-accent");
  });
});
