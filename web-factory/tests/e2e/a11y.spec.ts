import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// WCAG 2.2 AA is the 2026 quality bar for commercial sites. We gate on
// serious/critical violations (the ones axe detects with high confidence);
// moderate/minor are logged for follow-up but do not fail the build.
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const BLOCKING = new Set(["serious", "critical"]);

// Serialize so axe scans (and the networkidle waits before them) run one page at
// a time. Under parallel CPU contention the page can be scanned before layout
// settles, which made the store contrast check flake. Runs in the *-measure
// projects (fullyParallel: false) per playwright.config.ts.
test.describe.configure({ mode: "serial" });

// landing and dashboard use the token system, so they get a real dark variant
// (prefers-color-scheme). store.ts ships a fixed Nuvia palette (not token-driven
// dark), so it is only gated in light.
const PAGES = [
  { name: "landing (demo)", url: "/demo/", schemes: ["light", "dark"] as const },
  { name: "landing-focus (demo-focus)", url: "/demo-focus/", schemes: ["light", "dark"] as const },
  // The only landing demo carrying credenciales/proceso/faq, so it is the one
  // that exercises the trust strip, the process list and the <details> FAQ.
  { name: "landing + trust/process/faq (clinic-demo)", url: "/clinic-demo/", schemes: ["light", "dark"] as const },
  { name: "dashboard (dashboard-demo)", url: "/dashboard-demo/", schemes: ["light", "dark"] as const },
  { name: "store (skincare-demo)", url: "/skincare-demo/", schemes: ["light"] as const },
  { name: "landing-clinic (dental-demo)", url: "/dental-demo/", schemes: ["light", "dark"] as const },
  // Built from the learned model find-realestate-editorial: full-bleed media hero
  // over a scrim, path cards, catalog grid and the inverted newsletter band.
  { name: "landing-realestate (realestate-demo)", url: "/realestate-demo/", schemes: ["light", "dark"] as const },
];

for (const target of PAGES) {
  for (const scheme of target.schemes) {
    test(`accessibility: ${target.name} — ${scheme} — WCAG 2.2 AA`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(target.url);
      await page.waitForLoadState("networkidle");

      const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
      const blocking = results.violations.filter((violation) => BLOCKING.has(violation.impact ?? ""));

      if (results.violations.length) {
        console.log(
          `[a11y] ${target.name} (${scheme}): ${results.violations
            .map((violation) => `${violation.impact}:${violation.id}(${violation.nodes.length})`)
            .join(", ")}`,
        );
      }

      expect(
        blocking,
        `serious/critical violations: ${blocking.map((violation) => `${violation.id} - ${violation.help}`).join(" | ")}`,
      ).toEqual([]);
    });
  }
}
