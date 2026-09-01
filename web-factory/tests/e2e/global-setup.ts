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
  // Fixture de casos borde: negativos, un cero, una serie de 90 puntos y las
  // secciones en cargando / error / vacio. El demo "lindo" no trae ninguno de
  // esos datos, asi que los defectos que W3-W5 arreglaron no se veian en NINGUN
  // gate automatico — se veian solo si alguien miraba con un fixture temporal.
  await generateSite("dashboard-edge", { rootDir, template: "dashboard" });
  await generateSite("demo-focus", { rootDir, template: "landing-focus" });
  await generateSite("clinic-demo", { rootDir, template: "landing" });
  await generateSite("dental-demo", { rootDir, template: "landing-clinic" });
  await generateSite("realestate-demo", { rootDir, template: "landing-realestate" });
  await generateSite("logistics-demo", { rootDir, template: "landing-logistics" });

  // La galeria de bloques y su banco de pruebas del popup (out/blocks-demo/):
  // importar el modulo LO construye (demo.ts corre build() al cargarse), asi el
  // spec del popup nunca corre contra un out/ viejo.
  await import("../../packages/blocks/demo");
}
