#!/usr/bin/env node
import { readFile, access } from "node:fs/promises";
import path from "node:path";
import {
  parseResearchBrief,
  parseShotList,
  parseMetadata,
  parseShortsPlan,
} from "./schemas.mjs";

const dir = process.argv[2];
if (!dir) {
  console.error("Uso: node pipeline/validate.mjs <carpeta-episodio>");
  process.exit(1);
}

async function readJson(file) {
  return JSON.parse(await readFile(path.join(dir, file), "utf8"));
}

async function exists(file) {
  try {
    await access(path.join(dir, file));
    return true;
  } catch {
    return false;
  }
}

const requiredChecks = [
  ["research-brief.json", parseResearchBrief],
  ["shot-list.json", parseShotList],
  ["metadata.json", parseMetadata],
];

// shorts-plan.json es opcional: no todos los episodios tienen shorts
// planeados todavia, pero si el archivo existe, se valida igual que el resto.
const optionalChecks = [["shorts-plan.json", parseShortsPlan]];

let ok = true;
for (const [file, parser] of requiredChecks) {
  try {
    parser(await readJson(file));
    console.log(`OK   ${file}`);
  } catch (err) {
    ok = false;
    console.error(`FAIL ${file}`);
    console.error(err.message ?? String(err));
  }
}

for (const [file, parser] of optionalChecks) {
  if (!(await exists(file))) {
    console.log(`SKIP ${file} (no existe, opcional)`);
    continue;
  }
  try {
    parser(await readJson(file));
    console.log(`OK   ${file}`);
  } catch (err) {
    ok = false;
    console.error(`FAIL ${file}`);
    console.error(err.message ?? String(err));
  }
}

process.exit(ok ? 0 : 1);
