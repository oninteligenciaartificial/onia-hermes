#!/usr/bin/env node
/*
Upload an image/video asset to the VPS and print the public URL.

Env:
  VPS_HOST, VPS_USER (optional, default root), VPS_KEY_PATH or VPS_PASSWORD
  ASSET_FILE (required local file path)
  HERMES_ASSETS_REMOTE_DIR (optional, default /var/www/html/hermes-assets)
  HERMES_ASSETS_PORT (optional, default 8099)
  HERMES_ASSETS_BASE_URL (optional, default http://VPS_HOST:8099)
*/

const fs = require("node:fs");
const path = require("node:path");
const { connectSsh, exec, sftp, putFile, requireEnv } = require("./lib/ssh");

function safeName(filePath) {
  const parsed = path.parse(filePath);
  const stem = parsed.name
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  const ext = parsed.ext.toLowerCase();
  return `${Date.now()}-${stem || "asset"}${ext}`;
}

async function main() {
  const assetFile = path.resolve(requireEnv("ASSET_FILE"));
  if (!fs.existsSync(assetFile) || !fs.statSync(assetFile).isFile()) {
    throw new Error(`ASSET_FILE is not a readable file: ${assetFile}`);
  }

  const remoteDir = process.env.HERMES_ASSETS_REMOTE_DIR || "/var/www/html/hermes-assets";
  const port = process.env.HERMES_ASSETS_PORT || "8099";
  const baseUrl =
    process.env.HERMES_ASSETS_BASE_URL || `http://${requireEnv("VPS_HOST")}:${port}`;
  const filename = safeName(assetFile);
  const remotePath = `${remoteDir}/${filename}`;
  const publicUrl = `${baseUrl.replace(/\/$/, "")}/${encodeURIComponent(filename)}`;

  const conn = await connectSsh();
  try {
    const mkdir = await exec(conn, `bash -lc 'mkdir -p ${remoteDir.replaceAll("'", "'\\''")}'`);
    if (mkdir.code !== 0) throw new Error(mkdir.stderr);
    const sftpClient = await sftp(conn);
    await putFile(sftpClient, assetFile, remotePath, 0o644);
    const chmod = await exec(
      conn,
      `bash -lc 'chmod 644 ${remotePath.replaceAll("'", "'\\''")} && chown www-data:www-data ${remotePath.replaceAll("'", "'\\''")} || true'`
    );
    if (chmod.code !== 0) throw new Error(chmod.stderr);
    process.stdout.write(`${publicUrl}\n`);
  } finally {
    conn.end();
  }
}

main().catch((err) => {
  process.stderr.write(`ERROR: ${err.message}\n`);
  process.exit(1);
});
