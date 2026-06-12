import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";

export type ImportHtmlBlockOptions = {
  rootDir?: string;
  fetchImpl?: typeof fetch;
  name?: string;
};

export async function importHtmlSections(
  url: string,
  options: ImportHtmlBlockOptions = {},
): Promise<string[]> {
  assertAllowedHtmlSource(url);

  const fetchImpl = options.fetchImpl ?? fetch;
  const response = await fetchImpl(url);
  if (!response.ok) {
    throw new Error(`HTML source failed: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const sections = $("section")
    .toArray()
    .map((section) => $.html(section))
    .filter(Boolean);

  if (sections.length === 0) {
    throw new Error("No <section> blocks found in source HTML.");
  }

  const rootDir = options.rootDir ?? process.cwd();
  const blockName = options.name ?? slugFromUrl(url);
  const outputDir = path.join(rootDir, "packages", "blocks", "imported");
  await mkdir(outputDir, { recursive: true });

  const files: string[] = [];
  for (const [index, section] of sections.entries()) {
    const outputFile = path.join(outputDir, `${blockName}-${index + 1}.html`);
    await writeFile(outputFile, retokenizeHtml(section), "utf8");
    files.push(outputFile);
  }

  return files;
}

export function assertAllowedHtmlSource(source: string): void {
  const url = new URL(source);
  if (url.hostname === "www.shadcnblocks.com" || url.hostname === "efferd.com") {
    return;
  }

  throw new Error(`HTML source "${url.hostname}" is not listed in SOURCES.md.`);
}

function retokenizeHtml(html: string): string {
  return html
    .replace(/#[0-9a-fA-F]{3,6}/g, "var(--color-primary)")
    .replace(/rgba?\([^)]+\)/g, "var(--color-primary)");
}

function slugFromUrl(source: string): string {
  const url = new URL(source);
  const slug = url.pathname
    .split("/")
    .filter(Boolean)
    .join("-")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .toLowerCase();

  return slug || url.hostname.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase();
}
