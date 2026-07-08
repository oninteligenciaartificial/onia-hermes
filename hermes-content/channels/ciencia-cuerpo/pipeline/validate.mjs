#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  parseResearchBrief,
  parseShotList,
  parseMetadata,
} from "./schemas.mjs";

const dir = process.argv[2];
if (!dir) {
  console.error("Uso: node pipeline/validate.mjs <carpeta-episodio>");
  process.exit(1);
}

async function readJson(file) {
  return JSON.parse(await readFile(path.join(dir, file), "utf8"));
}

const checks = [
  ["research-brief.json", parseResearchBrief],
  ["shot-list.json", parseShotList],
  ["metadata.json", parseMetadata],
];

let ok = true;
for (const [file, parser] of checks) {
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
