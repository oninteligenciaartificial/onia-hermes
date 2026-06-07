#!/usr/bin/env node
/*
Deploys an Instagram publisher script to the VPS and wires a tiny CLI wrapper.

Env (local machine running this script):
  VPS_HOST, VPS_USER (optional, default root), VPS_KEY_PATH or VPS_PASSWORD
  META_LONG_LIVED_TOKEN, IG_BUSINESS_ACCOUNT_ID
  (optional) GRAPH_API_VERSION

This script avoids printing secrets.
*/

const path = require("node:path");
const os = require("node:os");
const fs = require("node:fs");
const { connectSsh, exec, sftp, putFile, requireEnv } = require("./lib/ssh");

function redact(str) {
  if (!str) return str;
  if (str.length <= 8) return "***";
  return `${str.slice(0, 4)}...${str.slice(-4)}`;
}

function remotePythonCommand(source) {
  const encoded = Buffer.from(source, "utf8").toString("base64");
  return `python3 -c "import base64; exec(base64.b64decode('${encoded}').decode('utf-8'))"`;
}

async function main() {
  const metaToken = requireEnv("META_LONG_LIVED_TOKEN");
  const igBusinessId = requireEnv("IG_BUSINESS_ACCOUNT_ID");
  const graphApiVersion = process.env.GRAPH_API_VERSION || "";

  const conn = await connectSsh();
  try {
    const remoteDir = "/root/.hermes/scripts";
    await exec(conn, `mkdir -p ${remoteDir}`);

    const sftpClient = await sftp(conn);
    const localPy = path.resolve(__dirname, "ig_publisher.py");
    const remotePy = `${remoteDir}/ig_publisher.py`;
    await putFile(sftpClient, localPy, remotePy, 0o755);

    const wrapper = [
      "#!/usr/bin/env bash",
      "set -euo pipefail",
      "set -a",
      "source /root/.hermes/.env",
      "set +a",
      'exec python3 /root/.hermes/scripts/ig_publisher.py "$@"',
      "",
    ].join("\n");
    const localWrapper = path.join(os.tmpdir(), `ig-publish-${Date.now()}`);
    fs.writeFileSync(localWrapper, wrapper, "utf8");
    await putFile(sftpClient, localWrapper, "/usr/local/bin/ig-publish", 0o755);

    // Ensure Hermes env exists and update only relevant keys.
    // Use POSIX-safe append/replace without echoing values to stdout.
    const envFile = "/root/.hermes/.env";
    const updates = {
      META_LONG_LIVED_TOKEN: metaToken,
      IG_BUSINESS_ACCOUNT_ID: igBusinessId,
    };
    if (graphApiVersion) updates.GRAPH_API_VERSION = graphApiVersion;

    const tmp = `/tmp/hermes_env_${Date.now()}.txt`;
    const lines = Object.entries(updates)
      .map(([k, v]) => `${k}=${v.replaceAll("\n", "").replaceAll("\r", "")}`)
      .join("\n");
    fs.writeFileSync(path.join(os.tmpdir(), path.basename(tmp)), lines, "utf8");
    const localTmp = path.join(os.tmpdir(), path.basename(tmp));
    await putFile(sftpClient, localTmp, tmp, 0o600);

    const upsertEnvPy = `
import os
from pathlib import Path

env_path = Path(${JSON.stringify(envFile)})
tmp_path = Path(${JSON.stringify(tmp)})

updates = {}
for raw in tmp_path.read_text("utf-8").splitlines():
    if not raw or raw.lstrip().startswith("#") or "=" not in raw:
        continue
    key, value = raw.split("=", 1)
    updates[key] = value

existing = env_path.read_text("utf-8").splitlines() if env_path.exists() else []
out = []
seen = set()
for line in existing:
    if not line or line.lstrip().startswith("#") or "=" not in line:
        out.append(line)
        continue
    key, _ = line.split("=", 1)
    if key in updates:
        out.append(f"{key}={updates[key]}")
        seen.add(key)
    else:
        out.append(line)

for key, value in updates.items():
    if key not in seen:
        out.append(f"{key}={value}")

env_path.parent.mkdir(parents=True, exist_ok=True)
env_path.write_text("\\n".join(out).rstrip("\\n") + "\\n", "utf-8")
os.chmod(env_path, 0o600)
`;

    const remoteCmd = [
      `set -euo pipefail`,
      `touch ${envFile}`,
      remotePythonCommand(upsertEnvPy),
      `rm -f ${tmp}`,
      `chown root:root /usr/local/bin/ig-publish`,
      `chmod 755 /usr/local/bin/ig-publish`,
      `chown root:root ${remotePy}`,
      `chmod 755 ${remotePy}`,
      `python3 -V >/dev/null`,
    ].join("; ");

    const { code, stderr } = await exec(conn, `bash -lc '${remoteCmd.replaceAll("'", "'\\''")}'`);
    if (code !== 0) {
      throw new Error(`Remote install failed (code ${code}): ${stderr}`);
    }

    // Smoke check (do not print token). Installation should still complete so
    // the operator can inspect Graph API errors directly on the VPS.
    const hc = await exec(conn, `bash -lc 'ig-publish healthcheck >/dev/null'`);
    if (hc.code !== 0) {
      process.stderr.write(`WARNING: Healthcheck failed after install: ${hc.stderr}`);
    }

    process.stdout.write(
      [
        "Instagram publisher installed on VPS.",
        `META_LONG_LIVED_TOKEN=${redact(metaToken)}`,
        `IG_BUSINESS_ACCOUNT_ID=${igBusinessId}`,
        "Next:",
        "  ig-publish post_test --image-url <public_image_url> --caption \"hola\"",
        "  ig-publish reel_publish --video-url <public_video_url> --caption \"hola\"",
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
