#!/usr/bin/env node
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Command } from "commander";
import { sanitizeCliArgv } from "./argv";
import { auditImageAssets, type AssetInfo } from "./image-audit";
import { parseSlug } from "./generate";

async function collectAssets(dir: string, baseDir = dir): Promise<AssetInfo[]> {
  const assets: AssetInfo[] = [];
  let entries: Awaited<ReturnType<typeof readdir>>;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return assets;
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      assets.push(...(await collectAssets(full, baseDir)));
    } else if (entry.isFile()) {
      const info = await stat(full);
      assets.push({ path: path.relative(baseDir, full).split(path.sep).join("/"), bytes: info.size });
    }
  }

  return assets;
}

export type CheckImagesOptions = {
  rootDir?: string;
  slug: string;
  strict?: boolean;
};

export async function checkImages(options: CheckImagesOptions): Promise<{ warnings: string[]; errors: string[] }> {
  const rootDir = options.rootDir ?? process.cwd();
  const slug = parseSlug(options.slug);
  const assetsDir = path.join(rootDir, "data", "clients", `${slug}.assets`);
  const assets = await collectAssets(assetsDir);
  return auditImageAssets(assets);
}

const program = new Command();

program
  .name("onia-check-images")
  .description("Audit a client's image assets for modern format and weight (LCP/CLS policy).")
  .argument("<slug>", "client slug from data/clients")
  .option("--strict", "exit non-zero on warnings too, not just errors", false)
  .action(async (slug: string, options: { strict: boolean }) => {
    try {
      const { warnings, errors } = await checkImages({ slug, strict: options.strict });

      for (const warning of warnings) {
        console.log(`- warn: ${warning}`);
      }
      for (const error of errors) {
        console.log(`- error: ${error}`);
      }

      if (!warnings.length && !errors.length) {
        console.log(`OK: ${slug} image assets pass the format/weight policy.`);
      } else {
        console.log(`\n${warnings.length} warnings, ${errors.length} errors.`);
      }

      if (errors.length || (options.strict && warnings.length)) {
        process.exitCode = 1;
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    }
  });

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  program.parse(sanitizeCliArgv(process.argv));
}
