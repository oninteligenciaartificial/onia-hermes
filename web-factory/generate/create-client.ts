#!/usr/bin/env node
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Command } from "commander";
import {
  buildClientContextMarkdown,
  buildClientProfileFromIntake,
  getMissingClientInputs,
  webFactoryIntakeSchema,
} from "../data/intake-schema";

export type CreateClientOptions = {
  rootDir?: string;
  input: string;
  outDir?: string;
  force?: boolean;
  dryRun?: boolean;
};

export type CreateClientResult = {
  slug: string;
  template: "landing" | "store";
  profilePath: string;
  contextPath: string;
  missingInputs: string[];
};

export async function createClientFromIntake(options: CreateClientOptions): Promise<CreateClientResult> {
  const rootDir = options.rootDir ?? process.cwd();
  const inputPath = resolveFromRoot(rootDir, options.input);
  const outDir = resolveFromRoot(rootDir, options.outDir ?? path.join("data", "clients"));
  const raw = await readFile(inputPath, "utf8");
  const intake = webFactoryIntakeSchema.parse(JSON.parse(raw));
  const profile = buildClientProfileFromIntake(intake);
  const context = buildClientContextMarkdown(intake);
  const missingInputs = getMissingClientInputs(intake);
  const profilePath = path.join(outDir, `${profile.slug}.json`);
  const contextPath = path.join(outDir, `${profile.slug}.context.md`);

  if (!options.force && !options.dryRun) {
    await assertDoesNotExist(profilePath);
    await assertDoesNotExist(contextPath);
  }

  if (!options.dryRun) {
    await mkdir(outDir, { recursive: true });
    await writeFile(profilePath, `${JSON.stringify(profile, null, 2)}\n`, "utf8");
    await writeFile(contextPath, context, "utf8");
  }

  return {
    slug: profile.slug,
    template: intake.project.template,
    profilePath,
    contextPath,
    missingInputs,
  };
}

const program = new Command();

program
  .name("onia-client-from-intake")
  .description("Create data/clients/<slug>.json and <slug>.context.md from a Web Factory intake JSON.")
  .requiredOption("-i, --input <path>", "intake JSON path")
  .option("-o, --out-dir <path>", "client profile output directory", path.join("data", "clients"))
  .option("--force", "overwrite existing generated client files", false)
  .option("--dry-run", "validate and print output paths without writing files", false)
  .action(async (options: { input: string; outDir: string; force: boolean; dryRun: boolean }) => {
    try {
      const result = await createClientFromIntake(options);
      console.log(`${options.dryRun ? "Validated" : "Created"} ${result.slug}`);
      console.log(`- profile: ${result.profilePath}`);
      console.log(`- context: ${result.contextPath}`);
      console.log(`- preview: pnpm generate ${result.slug} --template ${result.template}`);

      if (result.missingInputs.length) {
        console.log("- pending:");
        for (const item of result.missingInputs) {
          console.log(`  - ${item}`);
        }
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    }
  });

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  program.parse();
}

async function assertDoesNotExist(filePath: string): Promise<void> {
  try {
    await access(filePath);
  } catch {
    return;
  }

  throw new Error(`${filePath} already exists. Use --force to overwrite.`);
}

function resolveFromRoot(rootDir: string, value: string): string {
  return path.isAbsolute(value) ? value : path.join(rootDir, value);
}
