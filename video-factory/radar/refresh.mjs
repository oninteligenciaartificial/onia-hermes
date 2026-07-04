import { writeFile, readFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SNAP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "snapshots");

export async function saveSnapshot(kind, data, { dir = SNAP_DIR, date = new Date() } = {}) {
  const stamp = date.toISOString().slice(0, 10);
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, `${stamp}-${kind}.json`);
  await writeFile(file, JSON.stringify(data, null, 2) + "\n", "utf8");
  return file;
}

export async function latestSnapshot(kind, { dir = SNAP_DIR } = {}) {
  let files = [];
  try {
    files = await readdir(dir);
  } catch {
    return null;
  }
  const matches = files.filter((f) => f.endsWith(`-${kind}.json`)).sort();
  if (matches.length === 0) return null;
  return JSON.parse(await readFile(path.join(dir, matches.at(-1)), "utf8"));
}
