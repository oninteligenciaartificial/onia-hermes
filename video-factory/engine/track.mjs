import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { parseJob } from "../contracts/job.schema.mjs";

const DEFAULT_DIR = path.resolve(process.env.VIDEO_LAB_DIR ?? ".hermes/video-lab/jobs");

export async function findByHash(hash, dir = DEFAULT_DIR) {
  let files = [];
  try {
    files = await readdir(dir);
  } catch {
    return null;
  }
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    const raw = JSON.parse(await readFile(path.join(dir, f), "utf8"));
    if (raw.input_hash === hash) return raw;
  }
  return null;
}

export async function writeJob(job, dir = DEFAULT_DIR) {
  const valid = parseJob(job);
  const existing = await findByHash(valid.input_hash, dir);
  if (existing && ["generated", "approved_for_publish", "published"].includes(existing.status)) {
    return { written: false, reason: "idempotent_skip", job: existing };
  }
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, `${valid.id}.json`), JSON.stringify(valid, null, 2) + "\n", "utf8");
  return { written: true, job: valid };
}
