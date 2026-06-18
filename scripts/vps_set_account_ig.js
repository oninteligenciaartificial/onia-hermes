#!/usr/bin/env node
/*
Carga/actualiza las credenciales IG de una cuenta en /root/.hermes/.env del VPS,
sin imprimir el token. Escribe variables con sufijo por cuenta:
  IG_BUSINESS_ACCOUNT_ID_<ACCOUNT>
  META_LONG_LIVED_TOKEN_<ACCOUNT>
que el pipeline de carruseles usa al publicar con --account <account>.

Env:
  VPS_HOST, VPS_USER (opcional), VPS_KEY_PATH o VPS_PASSWORD
  IG_ACCOUNT            (ej. nuvia)  -> define el sufijo (NUVIA)
  IG_BUSINESS_ACCOUNT_ID            -> instagram_business_account.id de la cuenta
  META_LONG_LIVED_TOKEN            -> Page Access Token de esa cuenta

Uso:
  $env:VPS_HOST="187.77.16.63"; $env:VPS_USER="root"; $env:VPS_PASSWORD="..."
  $env:IG_ACCOUNT="nuvia"
  $env:IG_BUSINESS_ACCOUNT_ID="178414..."
  $env:META_LONG_LIVED_TOKEN="EAAB..."   # Page token de Nuvia
  npm run account:ig
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
  const account = requireEnv("IG_ACCOUNT").trim().toLowerCase();
  if (!/^[a-z0-9_]+$/.test(account)) {
    throw new Error("IG_ACCOUNT inválido (solo a-z, 0-9, _). Ej: nuvia");
  }
  const suffix = account.toUpperCase();
  const igId = requireEnv("IG_BUSINESS_ACCOUNT_ID").trim();
  const token = requireEnv("META_LONG_LIVED_TOKEN").trim();
  if (!/^\d+$/.test(igId)) {
    throw new Error("IG_BUSINESS_ACCOUNT_ID debe ser numérico (instagram_business_account.id)");
  }

  const conn = await connectSsh();
  try {
    const sftpClient = await sftp(conn);
    const tmpRemote = `/tmp/ig_${account}_${Date.now()}.txt`;
    const localTmp = path.join(os.tmpdir(), path.basename(tmpRemote));
    fs.writeFileSync(
      localTmp,
      `IG_BUSINESS_ACCOUNT_ID_${suffix}=${igId}\nMETA_LONG_LIVED_TOKEN_${suffix}=${token}\n`,
      "utf8"
    );
    await putFile(sftpClient, localTmp, tmpRemote, 0o600);
    fs.unlinkSync(localTmp);

    const envFile = "/root/.hermes/.env";
    const upsertEnvPy = `
from pathlib import Path
import os

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
print("OK keys:", ", ".join(updates.keys()))
`;
    const cmd = ["set -euo pipefail", remotePythonCommand(upsertEnvPy)].join("; ");
    const { code, stdout, stderr } = await exec(conn, `bash -lc '${cmd.replaceAll("'", "'\\''")}'`);
    if (code !== 0) throw new Error(stderr || "remote upsert failed");

    process.stdout.write(
      `Credenciales IG de '${account}' cargadas en el VPS (${stdout.trim()}).\n` +
      `Probá: ssh ${process.env.VPS_USER || "root"}@${process.env.VPS_HOST} ` +
      `"IG_BUSINESS_ACCOUNT_ID=\\$IG_BUSINESS_ACCOUNT_ID_${suffix} ` +
      `META_LONG_LIVED_TOKEN=\\$META_LONG_LIVED_TOKEN_${suffix} ig-publish healthcheck"\n` +
      `Luego publicar: npm run carousel -- --topic "..." --account ${account} --pack bright-retail --publish\n`
    );
  } finally {
    conn.end();
  }
}

main().catch((err) => {
  process.stderr.write(`ERROR: ${err.message}\n`);
  process.exit(1);
});
