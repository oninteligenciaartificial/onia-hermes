#!/usr/bin/env node
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Command } from "commander";
import { writeAutoDesignRecipe, type WebFactoryTemplate } from "../design/auto-designer";
import { createClientFromIntake } from "./create-client";
import { generateSite } from "./generate";

export type FactoryBuildOptions = {
  rootDir?: string;
  input?: string;
  slug?: string;
  template?: WebFactoryTemplate;
  force?: boolean;
  dryRun?: boolean;
};

export type FactoryBuildResult = {
  slug: string;
  template: WebFactoryTemplate;
  profilePath?: string;
  contextPath?: string;
  designJsonPath: string;
  designMarkdownPath: string;
  outputDir?: string;
  files: string[];
  missingInputs: string[];
  warnings: string[];
};

export async function runFactoryBuild(options: FactoryBuildOptions): Promise<FactoryBuildResult> {
  const rootDir = options.rootDir ?? process.cwd();
  let slug = options.slug;
  let template = options.template ?? "landing";
  let profilePath: string | undefined;
  let contextPath: string | undefined;
  let missingInputs: string[] = [];

  if (options.input) {
    const created = await createClientFromIntake({
      rootDir,
      input: options.input,
      force: options.force,
      dryRun: options.dryRun,
    });
    slug = created.slug;
    template = options.template ?? created.template;
    profilePath = created.profilePath;
    contextPath = created.contextPath;
    missingInputs = created.missingInputs;
  }

  if (!slug) {
    throw new Error("Provide a slug or --input data/intakes/<slug>.json.");
  }

  const design = await writeAutoDesignRecipe(slug, {
    rootDir,
    template,
    force: options.force,
    dryRun: options.dryRun,
  });

  if (options.dryRun) {
    return {
      slug,
      template,
      profilePath,
      contextPath,
      designJsonPath: design.jsonPath,
      designMarkdownPath: design.markdownPath,
      files: [],
      missingInputs,
      warnings: design.recipe.warnings,
    };
  }

  const generated = await generateSite(slug, { rootDir, template });

  return {
    slug,
    template,
    profilePath,
    contextPath,
    designJsonPath: design.jsonPath,
    designMarkdownPath: design.markdownPath,
    outputDir: generated.outputDir,
    files: generated.files,
    missingInputs,
    warnings: design.recipe.warnings,
  };
}

const program = new Command();

program
  .name("onia-factory-build")
  .description("Run the full Web Factory flow: optional intake, auto design recipe and static preview.")
  .argument("[slug]", "client slug from data/clients")
  .option("-i, --input <path>", "intake JSON path")
  .option("-t, --template <name>", "template name: landing or store")
  .option("--force", "overwrite generated client/design files", false)
  .option("--dry-run", "validate and print output paths without writing files", false)
  .action(
    async (
      slug: string | undefined,
      options: { input?: string; template?: string; force: boolean; dryRun: boolean },
    ) => {
      try {
        const result = await runFactoryBuild({
          slug,
          input: options.input,
          template: parseTemplate(options.template),
          force: options.force,
          dryRun: options.dryRun,
        });

        console.log(`${options.dryRun ? "Validated" : "Built"} ${result.slug}`);
        console.log(`- template: ${result.template}`);

        if (result.profilePath) {
          console.log(`- profile: ${result.profilePath}`);
        }

        if (result.contextPath) {
          console.log(`- context: ${result.contextPath}`);
        }

        console.log(`- design json: ${result.designJsonPath}`);
        console.log(`- design markdown: ${result.designMarkdownPath}`);

        if (result.outputDir) {
          console.log(`- preview: ${result.outputDir}`);
        }

        for (const file of result.files) {
          console.log(`  - ${file}`);
        }

        if (result.missingInputs.length) {
          console.log("- pending inputs:");
          for (const item of result.missingInputs) {
            console.log(`  - ${item}`);
          }
        }

        if (result.warnings.length) {
          console.log("- warnings:");
          for (const warning of result.warnings) {
            console.log(`  - ${warning}`);
          }
        }
      } catch (error) {
        console.error(error instanceof Error ? error.message : error);
        process.exitCode = 1;
      }
    },
  );

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  program.parse();
}

function parseTemplate(value?: string): WebFactoryTemplate | undefined {
  if (!value) {
    return undefined;
  }

  if (value === "landing" || value === "store") {
    return value;
  }

  throw new Error(`Unsupported template "${value}". Available: landing, store.`);
}
