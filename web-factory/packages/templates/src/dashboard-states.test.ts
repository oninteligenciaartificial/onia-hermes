import { describe, expect, it } from "vitest";
import { renderStatesShowcase } from "./dashboard-states";

describe("renderStatesShowcase", () => {
  it("renders nothing when not enabled", () => {
    expect(renderStatesShowcase(false)).toBe("");
  });

  it("renders all 3 states always-visible (no toggle required) when enabled", () => {
    const html = renderStatesShowcase(true);
    expect(html).toContain('id="estados"');
    expect(html).toContain("wf-dash-card--loading");
    expect(html).toContain("wf-dash-shimmer");
    expect(html).toContain("wf-dash-empty");
    expect(html).toContain("wf-dash-error");
    // Error state uses icon+text, not color alone (redundant encoding).
    expect(html).toContain("wf-dash-error-icon");
    expect(html).toContain("Reintentar");
  });
});
