#!/usr/bin/env node
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Command } from "commander";
import { writeAutoDesignRecipe, type WebFactoryTemplate } from "../design/auto-designer";
import { sanitizeCliArgv } from "./argv";

const program = new Command();

program
  .name("onia-auto-design")
  .description("Build a design recipe from client data, captured screenshots and allowed code references.")
  .argument("<slug>", "client slug from data/clients")
  .option("-t, --template <name>", "template name: landing or store")
  .option("-o, --out-dir <path>", "recipe output directory", path.join("data", "clients"))
  .option("--design-intelligence <path>", "path to latest-design-intelligence.json")
  .option("--code-examples <path>", "path to latest-component-code-examples.json")
  .option("--force", "overwrite existing design recipe files", false)
  .option("--dry-run", "validate and print output paths without writing files", false)
  .action(
    async (
      slug: string,
      options: {
        template?: string;
        outDir: string;
        designIntelligence?: string;
        codeExamples?: string;
        force: boolean;
        dryRun: boolean;
      },
    ) => {
      try {
        const template = parseTemplate(options.template);
        const result = await writeAutoDesignRecipe(slug, {
          template,
          outDir: options.outDir,
          designIntelligencePath: options.designIntelligence,
          codeExamplesPath: options.codeExamples,
          force: options.force,
          dryRun: options.dryRun,
        });

        console.log(`${options.dryRun ? "Validated" : "Created"} design recipe for ${result.slug}`);
        console.log(`- json: ${result.jsonPath}`);
        console.log(`- markdown: ${result.markdownPath}`);
        console.log(`- vertical: ${result.recipe.client.verticalLabel}`);
        console.log(`- confidence: ${result.recipe.confidence.score}`);
        console.log(`- references: ${result.recipe.selectedReferences.length}`);
        console.log(`- code refs: ${result.recipe.codeReferences.length}`);

        if (result.recipe.warnings.length) {
          console.log("- warnings:");
          for (const warning of result.recipe.warnings) {
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
  program.parse(sanitizeCliArgv(process.argv));
}

function parseTemplate(value?: string): WebFactoryTemplate | undefined {
  if (!value) {
    return undefined;
  }

  if (value === "landing" || value === "store" || value === "dashboard") {
    return value;
  }

  throw new Error(`Unsupported template "${value}". Available: landing, store, dashboard.`);
}
