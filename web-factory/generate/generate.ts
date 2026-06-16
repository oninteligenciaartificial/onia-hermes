import { cp, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  renderLandingCss,
  renderLandingDocument,
  renderStoreCss,
  renderStoreDocument,
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
  await copyClientAssets(rootDir, outputDir, safeSlug);

  const htmlPath = path.join(outputDir, "index.html");
  const cssPath = path.join(outputDir, "site.css");

  const html = template === "store" ? renderStoreDocument(client) : renderLandingDocument(client);
  const css = template === "store" ? renderStoreCss(client) : renderLandingCss(client);

  await writeFile(htmlPath, html, "utf8");
  await writeFile(cssPath, css, "utf8");

  return {
    slug: safeSlug,
    outputDir,
    files: [htmlPath, cssPath],
  };
}

async function copyClientAssets(rootDir: string, outputDir: string, slug: string): Promise<void> {
  const sourceDir = path.join(rootDir, "data", "clients", `${slug}.assets`);
  const targetDir = path.join(outputDir, "assets");

  try {
    await cp(sourceDir, targetDir, { recursive: true });
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
