import path from "node:path";

export type AssetInfo = { path: string; bytes: number };

export type ImageAuditResult = {
  warnings: string[];
  errors: string[];
};

// Vector or already-modern formats are fine as-is.
const MODERN = new Set([".webp", ".avif", ".svg"]);
const LEGACY_RASTER = new Set([".png", ".jpg", ".jpeg", ".gif"]);
const RASTER = new Set([...LEGACY_RASTER, ".webp", ".avif"]);

// A legacy raster over this size should have a webp/avif variant (LCP).
const CONVERT_THRESHOLD_BYTES = 20 * 1024;
// Any raster this heavy hurts LCP regardless of format.
const OVERSIZED_BYTES = 400 * 1024;

function kb(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)}kb`;
}

function withExtension(filePath: string, ext: string): string {
  return filePath.slice(0, filePath.length - path.extname(filePath).length) + ext;
}

/**
 * Enforce the image policy (modern formats, reasonable weight) without a native
 * image dependency. It does not convert — it flags what should be optimized, so
 * real client photos never ship as heavy PNG/JPEG and regress LCP/CLS.
 */
export function auditImageAssets(assets: AssetInfo[]): ImageAuditResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  const paths = new Set(assets.map((asset) => asset.path));

  for (const asset of assets) {
    const ext = path.extname(asset.path).toLowerCase();

    if (LEGACY_RASTER.has(ext) && asset.bytes > CONVERT_THRESHOLD_BYTES) {
      const hasModernSibling =
        paths.has(withExtension(asset.path, ".webp")) || paths.has(withExtension(asset.path, ".avif"));
      if (!hasModernSibling) {
        warnings.push(
          `${asset.path} (${kb(asset.bytes)}) es ${ext} sin variante .webp/.avif — convertir para mejorar LCP.`,
        );
      }
    }

    if (RASTER.has(ext) && asset.bytes > OVERSIZED_BYTES) {
      errors.push(
        `${asset.path} (${kb(asset.bytes)}) supera el budget de ${kb(OVERSIZED_BYTES)} — redimensionar/comprimir.`,
      );
    }
  }

  return { warnings, errors };
}
