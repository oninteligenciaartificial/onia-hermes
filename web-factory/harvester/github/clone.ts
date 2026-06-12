import { cp, mkdir, readFile, readdir, rm } from "node:fs/promises";
import path from "node:path";
import simpleGit from "simple-git";

export type LicenseKind = "MIT" | "Apache-2.0" | "GPL" | "AGPL" | "UNKNOWN";

export type CloneOptions = {
  rootDir?: string;
  tmpDir?: string;
  destinationName?: string;
};

export async function cloneTemplateRepo(
  repo: string,
  options: CloneOptions = {},
): Promise<{ destination: string; license: LicenseKind }> {
  const rootDir = options.rootDir ?? process.cwd();
  const tmpRoot = options.tmpDir ?? path.join(rootDir, "tmp");
  const repoName = options.destinationName ?? repoNameFromUrl(repo);
  const cloneDir = path.join(tmpRoot, repoName);
  const destination = path.join(rootDir, "packages", "templates", repoName);

  await mkdir(tmpRoot, { recursive: true });
  await rm(cloneDir, { recursive: true, force: true });

  await simpleGit().clone(normalizeRepo(repo), cloneDir, ["--depth", "1"]);

  const licenseText = await readLicenseFile(cloneDir);
  const license = detectLicense(licenseText);
  assertClientSafeLicense(license);

  await rm(destination, { recursive: true, force: true });
  await cp(cloneDir, destination, {
    recursive: true,
    filter: (source) => !source.includes(`${path.sep}.git${path.sep}`),
  });

  return { destination, license };
}

export function detectLicense(text: string): LicenseKind {
  const normalized = text.toLowerCase();

  if (normalized.includes("gnu affero general public license")) {
    return "AGPL";
  }

  if (normalized.includes("gnu general public license")) {
    return "GPL";
  }

  if (normalized.includes("apache license") && normalized.includes("version 2.0")) {
    return "Apache-2.0";
  }

  if (normalized.includes("mit license") || normalized.includes("permission is hereby granted")) {
    return "MIT";
  }

  return "UNKNOWN";
}

export function assertClientSafeLicense(license: LicenseKind): void {
  if (license === "MIT" || license === "Apache-2.0") {
    return;
  }

  if (license === "GPL" || license === "AGPL") {
    throw new Error(`${license} templates are rejected for client sites.`);
  }

  throw new Error("Template license is unknown; manual review required before importing.");
}

async function readLicenseFile(repoDir: string): Promise<string> {
  const files = await readdir(repoDir);
  const licenseFile = files.find((file) => /^licen[cs]e(?:\..*)?$/i.test(file));

  if (!licenseFile) {
    throw new Error("No LICENSE file found; manual review required before importing.");
  }

  return readFile(path.join(repoDir, licenseFile), "utf8");
}

function normalizeRepo(repo: string): string {
  if (/^https?:\/\//.test(repo) || repo.startsWith("git@")) {
    return repo;
  }

  return `https://github.com/${repo}.git`;
}

function repoNameFromUrl(repo: string): string {
  const clean = repo.replace(/\.git$/, "").split(/[/:]/).filter(Boolean).at(-1);
  if (!clean) {
    throw new Error(`Cannot infer repository name from "${repo}".`);
  }

  return clean.replace(/[^a-zA-Z0-9._-]/g, "-");
}
