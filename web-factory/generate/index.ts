#!/usr/bin/env node
import { Command } from "commander";
import { sanitizeCliArgv } from "./argv";
import { generateSite } from "./generate";

const program = new Command();

program
  .name("onia-web-factory")
  .description("Generate a client site from data/clients/<slug>.json")
  .argument("<slug>", "client slug from data/clients")
  .option("-t, --template <name>", "template name", "landing")
  .action(async (slug: string, options: { template: "landing" | "store" }) => {
    try {
      const result = await generateSite(slug, { template: options.template });
      console.log(`Generated ${result.slug} in ${result.outputDir}`);
      for (const file of result.files) {
        console.log(`- ${file}`);
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    }
  });

program.parse(sanitizeCliArgv(process.argv));
