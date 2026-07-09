import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateSite } from "../../generate/generate";

const rootDir = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));

/**
 * Generate the static previews the E2E specs assert against, so the suite is
 * self-contained and never depends on a stale `out/`. Uses the same generator
 * the factory ships, which keeps E2E aligned with real output.
 */
export default async function globalSetup(): Promise<void> {
  await generateSite("demo", { rootDir, template: "landing" });
  await generateSite("skincare-demo", { rootDir, template: "store" });
  await generateSite("dashboard-demo", { rootDir, template: "dashboard" });
  await generateSite("dentalgest-demo", { rootDir, template: "dashboard" });
  await generateSite("demo-focus", { rootDir, template: "landing-focus" });
  await generateSite("dental-demo", { rootDir, template: "landing-clinic" });
  await generateSite("realty-demo", { rootDir, template: "landing-realty" });
}
