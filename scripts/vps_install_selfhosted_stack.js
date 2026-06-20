#!/usr/bin/env node
/*
Uploads and runs the ONIA self-hosted stack kit.

Env:
  VPS_HOST, VPS_USER (optional, default root), VPS_KEY_PATH or VPS_PASSWORD

Usage:
  node scripts/vps_install_selfhosted_stack.js --profile monitor
  node scripts/vps_install_selfhosted_stack.js --profile all-safe
*/

const fs = require("node:fs");
const path = require("node:path");
const { connectSsh, exec, sftp, putFile } = require("./lib/ssh");

const repoRoot = path.resolve(__dirname, "..");
const defaultKit = path.join(repoRoot, "hermes-content", "deploy", "selfhosted");

function argValue(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  return process.argv[index + 1] || fallback;
}

function shellQuote(value) {
  return `'${String(value).replaceAll("'", "'\\''")}'`;
}

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(full);
    return [full];
  });
}

async function uploadKit(conn, sftpClient, kitDir, remoteStage) {
  await exec(conn, `rm -rf ${shellQuote(remoteStage)} && mkdir -p ${shellQuote(remoteStage)}`);
  for (const file of listFiles(kitDir)) {
    const rel = path.relative(kitDir, file).replaceAll("\\", "/");
    const remoteFile = `${remoteStage}/${rel}`;
    const remoteDir = path.posix.dirname(remoteFile);
    await exec(conn, `mkdir -p ${shellQuote(remoteDir)}`);
    const mode = rel === "install.sh" ? 0o755 : 0o644;
    await putFile(sftpClient, file, remoteFile, mode);
  }
}

async function main() {
  const profile = argValue("--profile", "monitor");
  const kitDir = path.resolve(argValue("--kit", defaultKit));
  if (!fs.existsSync(path.join(kitDir, "install.sh"))) {
    throw new Error(`Invalid kit directory: ${kitDir}`);
  }

  const remoteStage = `/tmp/onia_selfhosted_stage_${Date.now()}`;
  const remoteRoot = "/opt/onia-selfhosted";

  const conn = await connectSsh();
  try {
    const sftpClient = await sftp(conn);
    process.stdout.write(`Uploading self-hosted kit to ${remoteRoot}\n`);
    await uploadKit(conn, sftpClient, kitDir, remoteStage);
    const command = [
      "set -euo pipefail",
      `mkdir -p ${shellQuote(remoteRoot)}`,
      `cp -a ${shellQuote(`${remoteStage}/.`)} ${shellQuote(remoteRoot)}/`,
      `rm -rf ${shellQuote(remoteStage)}`,
      `chmod +x ${shellQuote(`${remoteRoot}/install.sh`)}`,
      `cd ${shellQuote(remoteRoot)}`,
      `./install.sh ${shellQuote(profile)}`,
    ].join(" && ");
    const result = await exec(conn, `bash -lc ${shellQuote(command)}`);
    process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    if (result.code !== 0) process.exitCode = result.code;
  } finally {
    conn.end();
  }
}

main().catch((err) => {
  process.stderr.write(`${err.message}\n`);
  process.exitCode = 1;
});
