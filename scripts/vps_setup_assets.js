#!/usr/bin/env node
/*
Prepare a public assets directory on the VPS for Instagram media URLs.

Env:
  VPS_HOST, VPS_USER (optional, default root), VPS_KEY_PATH or VPS_PASSWORD
  HERMES_ASSETS_REMOTE_DIR (optional, default /var/www/html/hermes-assets)
  HERMES_ASSETS_PORT (optional, default 8099)
*/

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { connectSsh, exec, sftp, putFile } = require("./lib/ssh");

async function main() {
  const conn = await connectSsh();
  const remoteDir = process.env.HERMES_ASSETS_REMOTE_DIR || "/var/www/html/hermes-assets";
  const port = process.env.HERMES_ASSETS_PORT || "8099";
  try {
    const sftpClient = await sftp(conn);
    const service = [
      "[Unit]",
      "Description=Hermes public assets server",
      "After=network.target",
      "",
      "[Service]",
      "Type=simple",
      `WorkingDirectory=${remoteDir}`,
      `ExecStart=/usr/bin/python3 -m http.server ${port} --bind 0.0.0.0`,
      "Restart=always",
      "RestartSec=3",
      "",
      "[Install]",
      "WantedBy=multi-user.target",
      "",
    ].join("\n");
    const localService = path.join(os.tmpdir(), `hermes-assets-${Date.now()}.service`);
    fs.writeFileSync(localService, service, "utf8");
    await putFile(sftpClient, localService, "/etc/systemd/system/hermes-assets.service", 0o644);

    const cmd = [
      "set -euo pipefail",
      `mkdir -p ${remoteDir}`,
      `chown -R www-data:www-data ${remoteDir} || true`,
      `chmod -R 755 ${remoteDir}`,
      `printf 'Hermes assets OK\\n' > ${remoteDir}/health.txt`,
      `chmod 644 ${remoteDir}/health.txt`,
      `systemctl daemon-reload`,
      `systemctl enable --now hermes-assets.service`,
      `systemctl restart hermes-assets.service`,
    ].join("; ");
    const result = await exec(conn, `bash -lc '${cmd.replaceAll("'", "'\\''")}'`);
    if (result.code !== 0) throw new Error(result.stderr);
    process.stdout.write(
      [
        "Hermes assets directory prepared.",
        `Remote dir: ${remoteDir}`,
        "Next: verify the public URL:",
        `  http://${process.env.VPS_HOST}:${port}/health.txt`,
        "If you have a domain with HTTPS, set HERMES_ASSETS_BASE_URL before uploading.",
        "",
      ].join("\n")
    );
  } finally {
    conn.end();
  }
}

main().catch((err) => {
  process.stderr.write(`ERROR: ${err.message}\n`);
  process.exit(1);
});
