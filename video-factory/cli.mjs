#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { Command } from "commander";
import { parseIntake } from "./contracts/intake.schema.mjs";
import { parseFormat } from "./contracts/format.schema.mjs";
import { parseLane } from "./contracts/lane.schema.mjs";
import { buildPlan } from "./engine/plan.mjs";
import { latestSnapshot } from "./radar/refresh.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const readJson = async (rel) => JSON.parse(await readFile(path.join(root, rel), "utf8"));

const program = new Command();
program.name("vf").description("ONIA Video Factory CLI");

program
  .command("plan")
  .requiredOption("--intake <file>", "ruta al intake JSON")
  .action(async (opts) => {
    const intake = parseIntake(await readJson(opts.intake));
    const format = parseFormat(await readJson(`formats/${intake.format}.json`));
    const lane = parseLane(await readJson(`lanes/${intake.lane}.json`));
    const plan = buildPlan(intake, format, lane);
    console.log(JSON.stringify(plan, null, 2));
  });

program
  .command("radar")
  .option("--kind <kind>", "models | presets", "models")
  .action(async (opts) => {
    const snap = await latestSnapshot(opts.kind);
    console.log(JSON.stringify(snap ?? [], null, 2));
  });

program.parseAsync();
