import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { renderLandingCss, renderLandingDocument } from "@onia/templates";
import { loadClientProfile } from "../data/schema";

export type GenerateOptions = {
  rootDir?: string;
  outDir?: string;
  template?: "landing";
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

  if (options.template && options.template !== "landing") {
    throw new Error(`Unsupported template "${options.template}". Available: landing.`);
  }

  await mkdir(outputDir, { recursive: true });

  const htmlPath = path.join(outputDir, "index.html");
  const cssPath = path.join(outputDir, "site.css");

  await writeFile(htmlPath, renderLandingDocument(client), "utf8");
  await writeFile(cssPath, renderLandingCss(client), "utf8");

  return {
    slug: safeSlug,
    outputDir,
    files: [htmlPath, cssPath],
  };
}

export function parseSlug(slug: string): string {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("Slug must be lowercase letters, numbers and dashes only.");
  }

  return slug;
}
