#!/usr/bin/env node
/*
Updates NOTION token in /root/.hermes/.env on the VPS without printing it.

Env:
  VPS_HOST, VPS_USER (optional), VPS_KEY_PATH or VPS_PASSWORD
  NOTION_TOKEN_NEW
*/

const os = require("node:os");
const path = require("node:path");
const fs = require("node:fs");
const { connectSsh, exec, sftp, putFile, requireEnv } = require("./lib/ssh");

function remotePythonCommand(source) {
  const encoded = Buffer.from(source, "utf8").toString("base64");
  return `python3 -c "import base64; exec(base64.b64decode('${encoded}').decode('utf-8'))"`;
}

async function main() {
  const notionToken = requireEnv("NOTION_TOKEN_NEW");
  const conn = await connectSsh();
  try {
    const sftpClient = await sftp(conn);
    const tmpRemote = `/tmp/notion_token_${Date.now()}.txt`;
    const localTmp = path.join(os.tmpdir(), path.basename(tmpRemote));
    fs.writeFileSync(localTmp, `NOTION_TOKEN=${notionToken}\n`, "utf8");
    await putFile(sftpClient, localTmp, tmpRemote, 0o600);

    const envFile = "/root/.hermes/.env";
    const upsertEnvPy = `
import os
from pathlib import Path

env_path = Path(${JSON.stringify(envFile)})
tmp_path = Path(${JSON.stringify(tmpRemote)})

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
tmp_path.unlink(missing_ok=True)
`;

    const cmd = ["set -euo pipefail", remotePythonCommand(upsertEnvPy)].join("; ");

    const { code, stderr } = await exec(conn, `bash -lc '${cmd.replaceAll("'", "'\\''")}'`);
    if (code !== 0) throw new Error(stderr);

    process.stdout.write(
      "NOTION_TOKEN updated on VPS. Next: restart Hermes gateway and run a Notion-backed command from Telegram to verify.\n"
    );
  } finally {
    conn.end();
  }
}

main().catch((err) => {
  process.stderr.write(`ERROR: ${err.message}\n`);
  process.exit(1);
});
