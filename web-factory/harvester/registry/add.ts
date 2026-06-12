import { spawn } from "node:child_process";
import path from "node:path";

const allowedUrlHosts = new Set([
  "magicui.design",
  "ui.aceternity.com",
  "originui.com",
  "cult-ui.com",
]);

const allowedRegistryAliases = ["@magicui/", "@aceternity/", "@originui/", "@cult-ui/"];

export type AddRegistryOptions = {
  rootDir?: string;
  dryRun?: boolean;
};

export async function addRegistryComponent(
  registryRef: string,
  options: AddRegistryOptions = {},
): Promise<void> {
  assertAllowedRegistryRef(registryRef);

  const rootDir = options.rootDir ?? process.cwd();
  const appDir = path.join(rootDir, "apps", "site");
  const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
  const args = ["dlx", "shadcn@latest", "add", registryRef, "--yes"];

  if (options.dryRun) {
    return;
  }

  await run(command, args, appDir);
}

export function assertAllowedRegistryRef(registryRef: string): void {
  if (allowedRegistryAliases.some((prefix) => registryRef.startsWith(prefix))) {
    return;
  }

  let url: URL;
  try {
    url = new URL(registryRef);
  } catch {
    throw new Error(`Unsupported registry ref "${registryRef}". Use a curated URL or registry alias.`);
  }

  if (!allowedUrlHosts.has(url.hostname)) {
    throw new Error(`Registry host "${url.hostname}" is not listed in SOURCES.md.`);
  }
}

function run(command: string, args: string[], cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      shell: false,
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} failed with exit code ${code}.`));
    });
  });
}
