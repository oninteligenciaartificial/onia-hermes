#!/usr/bin/env node
/*
Deploys the Hermes Control Tower Next.js app to the VPS.

Env:
  VPS_HOST, VPS_USER (optional, default root), VPS_KEY_PATH or VPS_PASSWORD
  HERMES_CONTROL_TOWER_PORT (optional, default 3010)
*/

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const childProcess = require("node:child_process");
const { connectSsh, exec, sftp, putFile } = require("./lib/ssh");

const repoRoot = path.resolve(__dirname, "..");
const webFactoryRoot = path.join(repoRoot, "web-factory");
const remoteRoot = "/opt/hermes-control-tower";
const port = process.env.HERMES_CONTROL_TOWER_PORT || "3010";

const ignoredDirs = new Set([
  ".git",
  ".next",
  "node_modules",
  "coverage",
  "out",
  ".vercel",
]);

const ignoredFiles = new Set([
  "site-3010.log",
  "site-3010.err.log",
]);

function shellQuote(value) {
  return `'${String(value).replaceAll("'", "'\\''")}'`;
}

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith(".env")) return [];
    if (ignoredDirs.has(entry.name)) return [];
    if (ignoredFiles.has(entry.name)) return [];

    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(full);
    return [full];
  });
}

function copyFilesToStage(files, sourceRoot, stageRoot) {
  for (const localFile of files) {
    const rel = path.relative(sourceRoot, localFile);
    const stagedFile = path.join(stageRoot, rel);
    fs.mkdirSync(path.dirname(stagedFile), { recursive: true });
    fs.copyFileSync(localFile, stagedFile);
  }
}

async function main() {
  const conn = await connectSsh();
  let sftpClient;

  const releaseId = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const remoteRelease = `${remoteRoot}/releases/${releaseId}`;
  const remoteArchive = `/tmp/hermes_control_tower_${releaseId}.tgz`;
  const stageRoot = fs.mkdtempSync(path.join(os.tmpdir(), "hermes-control-tower-"));
  const archivePath = path.join(os.tmpdir(), `hermes-control-tower-${releaseId}.tgz`);

  try {
    sftpClient = await sftp(conn);

    const files = listFiles(webFactoryRoot);
    copyFilesToStage(files, webFactoryRoot, stageRoot);
    childProcess.execFileSync("tar", ["-czf", archivePath, "-C", stageRoot, "."]);

    process.stdout.write(`Uploading Hermes Control Tower: ${files.length} files\n`);
    await putFile(sftpClient, archivePath, remoteArchive, 0o600);

    const service = [
      "[Unit]",
      "Description=Hermes Control Tower dashboard",
      "After=network.target",
      "",
      "[Service]",
      "Type=simple",
      `WorkingDirectory=${remoteRoot}/current/apps/site`,
      "Environment=NODE_ENV=production",
      `Environment=HERMES_CONTROL_TOWER_PORT=${port}`,
      "ExecStart=/usr/bin/env bash -lc 'exec pnpm exec next start --hostname 127.0.0.1 --port \"${HERMES_CONTROL_TOWER_PORT}\"'",
      "Restart=always",
      "RestartSec=3",
      "",
      "[Install]",
      "WantedBy=multi-user.target",
      "",
    ].join("\n");
    const localService = path.join(os.tmpdir(), `hermes-control-tower-${releaseId}.service`);
    fs.writeFileSync(localService, service, "utf8");
    await putFile(sftpClient, localService, "/etc/systemd/system/hermes-control-tower.service", 0o644);

    const commands = [
      "set -euo pipefail",
      `if ss -ltn | grep -q ':${port} '; then systemctl is-active --quiet hermes-control-tower.service || { echo 'Port ${port} is already in use by another process' >&2; exit 20; }; fi`,
      `mkdir -p ${shellQuote(remoteRelease)}`,
      `tar -xzf ${shellQuote(remoteArchive)} -C ${shellQuote(remoteRelease)}`,
      `rm -f ${shellQuote(remoteArchive)}`,
      `cd ${shellQuote(remoteRelease)}`,
      "if ! command -v pnpm >/dev/null 2>&1; then corepack enable >/dev/null 2>&1 || npm install -g pnpm@10.33.3; fi",
      "pnpm install --frozen-lockfile",
      "pnpm --filter site build",
      `ln -sfn ${shellQuote(remoteRelease)} ${shellQuote(remoteRoot)}/current`,
      "systemctl daemon-reload",
      "systemctl enable --now hermes-control-tower.service",
      "systemctl restart hermes-control-tower.service",
      "sleep 2",
      `curl -fsS http://127.0.0.1:${port}/ >/dev/null`,
      "systemctl --no-pager --full status hermes-control-tower.service | sed -n '1,12p'",
    ];

    const result = await exec(conn, `bash -lc ${shellQuote(commands.join("; "))}`);
    if (result.code !== 0) {
      throw new Error(result.stderr || result.stdout || `Remote deploy failed with code ${result.code}`);
    }

    process.stdout.write(
      [
        result.stdout.trim(),
        "",
        "Hermes Control Tower installed on VPS.",
        `Remote: http://127.0.0.1:${port}`,
        `Tunnel: ssh -L ${port}:localhost:${port} root@${process.env.VPS_HOST}`,
        `Open: http://localhost:${port}`,
        "",
      ].join("\n")
    );
  } finally {
    fs.rmSync(stageRoot, { recursive: true, force: true });
    fs.rmSync(archivePath, { force: true });
    if (sftpClient) sftpClient.end();
    conn.end();
  }
}

main().catch((err) => {
  process.stderr.write(`ERROR: ${err.message}\n`);
  process.exit(1);
});
