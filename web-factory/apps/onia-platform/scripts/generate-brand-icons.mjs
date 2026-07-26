/**
 * Genera los exports raster del logo onia a partir de los SVG canonicos de
 * `public/brand/`. Fuente de verdad del dibujo: candidato C aprobado
 * (web-factory/docs/ONIA_LOGO_SPEC_20260726.md).
 *
 * Uso (sharp NO es dependencia del app — instalar efimero, sin global):
 *   cd web-factory/apps/onia-platform
 *   npm install --no-save sharp
 *   node scripts/generate-brand-icons.mjs
 *
 * Salidas:
 *   public/brand/favicon-32.png          (32x32, desde favicon.svg)
 *   public/brand/apple-touch-icon-180.png (180x180, full-bleed sin esquinas
 *     redondeadas: iOS aplica su propia mascara)
 *   src/app/apple-icon.png               (copia — Next la sirve como
 *     apple-touch-icon por file convention)
 */
import { copyFile, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const brand = join(root, "public", "brand");

const faviconSvg = await readFile(join(brand, "favicon.svg"));

// favicon-32: la baldosa redondeada tal cual (esquinas transparentes OK en pestañas)
await sharp(faviconSvg, { density: 300 })
  .resize(32, 32)
  .png()
  .toFile(join(brand, "favicon-32.png"));

// apple-touch-icon-180: full-bleed (rx=0) — iOS redondea solo
const appleSvg = Buffer.from(
  faviconSvg.toString("utf8").replace('rx="14"', 'rx="0"'),
);
await sharp(appleSvg, { density: 300 })
  .resize(180, 180)
  .png()
  .toFile(join(brand, "apple-touch-icon-180.png"));

await copyFile(
  join(brand, "apple-touch-icon-180.png"),
  join(root, "src", "app", "apple-icon.png"),
);

console.log("OK: favicon-32.png, apple-touch-icon-180.png, src/app/apple-icon.png");
