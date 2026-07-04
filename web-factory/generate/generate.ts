import { cp, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  renderLandingCss,
  renderLandingDocument,
  renderStoreCss,
  renderStoreDocument,
  renderStoreProductDocument,
  storeProductSlug,
} from "@onia/templates";
import { loadClientProfile } from "../data/schema";

export type GenerateOptions = {
  rootDir?: string;
  outDir?: string;
  template?: "landing" | "store";
};

export type GenerateResult = {
  slug: string;
  outputDir: string;
  files: string[];
};

export async function generateSite(
  slug: string,
  options: GenerateOptions = {},
): Promise<GenerateResult> {
  const safeSlug = parseSlug(slug);
  const rootDir = options.rootDir ?? process.cwd();
  const outRoot = options.outDir ?? path.join(rootDir, "out");
  const outputDir = path.join(outRoot, safeSlug);
  const clientPath = path.join(rootDir, "data", "clients", `${safeSlug}.json`);
  const client = await loadClientProfile(clientPath);

  const template = options.template ?? "landing";

  if (!["landing", "store"].includes(template)) {
    throw new Error(`Unsupported template "${template}". Available: landing, store.`);
  }

  await mkdir(outputDir, { recursive: true });
  await copyClientAssets(rootDir, outputDir, safeSlug, collectReferencedAssets(client));

  const htmlPath = path.join(outputDir, "index.html");
  const cssPath = path.join(outputDir, "site.css");

  const html = template === "store" ? renderStoreDocument(client) : renderLandingDocument(client);
  const css = template === "store" ? renderStoreCss(client) : renderLandingCss(client);

  await writeFile(htmlPath, html, "utf8");
  await writeFile(cssPath, css, "utf8");

  const files = [htmlPath, cssPath];
  files.push(...(await copyDesignArtifacts(rootDir, outputDir, safeSlug)));

  if (template === "store") {
    for (const product of client.productos) {
      const productDir = path.join(outputDir, "productos", storeProductSlug(product));
      const productPath = path.join(productDir, "index.html");

      await mkdir(productDir, { recursive: true });
      await writeFile(productPath, renderStoreProductDocument(client, product), "utf8");
      files.push(productPath);
    }
  }

  return {
    slug: safeSlug,
    outputDir,
    files,
  };
}

async function copyDesignArtifacts(rootDir: string, outputDir: string, slug: string): Promise<string[]> {
  const files: string[] = [];
  const sourceDir = path.join(rootDir, "data", "clients");

  for (const fileName of [`${slug}.design.json`, `${slug}.design.md`]) {
    const sourcePath = path.join(sourceDir, fileName);
    const targetPath = path.join(outputDir, fileName);

    try {
      await cp(sourcePath, targetPath);
      files.push(targetPath);
    } catch (error) {
      if (!(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") {
        throw error;
      }
    }
  }

  return files;
}

const CUTOUT_REL_DIR = "product-media-cutout";

// Walk the client profile and collect every asset path it references
// (e.g. "assets/product-media-cutout/001-foo.webp"). Used to keep the static
// bundle lean: the cutout directory holds many unreferenced/orphaned masters,
// so we ship only the files the rendered site actually points at.
function collectReferencedAssets(value: unknown, acc: Set<string> = new Set()): Set<string> {
  if (typeof value === "string") {
    if (value.startsWith("assets/")) {
      acc.add(value);
    }
    return acc;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectReferencedAssets(item, acc);
    }
    return acc;
  }

  if (value && typeof value === "object") {
    for (const item of Object.values(value)) {
      collectReferencedAssets(item, acc);
    }
  }

  return acc;
}

async function copyClientAssets(
  rootDir: string,
  outputDir: string,
  slug: string,
  referencedAssets: Set<string>,
): Promise<void> {
  const sourceDir = path.join(rootDir, "data", "clients", `${slug}.assets`);
  const targetDir = path.join(outputDir, "assets");
  const cutoutDir = path.join(sourceDir, CUTOUT_REL_DIR);

  // Basenames of cutout files the site references. Everything outside the
  // (flat) cutout directory is always copied.
  const allowedCutouts = new Set(
    Array.from(referencedAssets)
      .filter((ref) => ref.startsWith(`assets/${CUTOUT_REL_DIR}/`))
      .map((ref) => path.basename(ref)),
  );

  try {
    await cp(sourceDir, targetDir, {
      recursive: true,
      filter: (src) => {
        if (path.dirname(src) !== cutoutDir) {
          return true;
        }

        return allowedCutouts.has(path.basename(src));
      },
    });
  } catch (error) {
    if (!(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") {
      throw error;
    }
  }
}

export function parseSlug(slug: string): string {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("Slug must be lowercase letters, numbers and dashes only.");
  }

  return slug;
}
