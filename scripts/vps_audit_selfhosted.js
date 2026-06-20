#!/usr/bin/env node
/*
Read-only self-hosted stack audit for the ONIA VPS.

Env:
  VPS_HOST, VPS_USER (optional, default root), VPS_KEY_PATH or VPS_PASSWORD
*/

const fs = require("node:fs");
const path = require("node:path");
const { connectSsh, exec } = require("./lib/ssh");

const repoRoot = path.resolve(__dirname, "..");

function remoteScript(source) {
  const encoded = Buffer.from(source, "utf8").toString("base64");
  return `python3 -c 'import base64; exec(base64.b64decode(${JSON.stringify(encoded)}).decode("utf-8"))'`;
}

function shellQuote(value) {
  return `'${String(value).replaceAll("'", "'\\''")}'`;
}

const auditPy = String.raw`
import json
import os
import shutil
import socket
import subprocess
from datetime import datetime, timezone
from pathlib import Path

def run(cmd, timeout=20):
    try:
        p = subprocess.run(cmd, shell=True, text=True, capture_output=True, timeout=timeout)
        return {"code": p.returncode, "stdout": p.stdout[-12000:], "stderr": p.stderr[-4000:]}
    except Exception as exc:
        return {"code": 999, "stdout": "", "stderr": str(exc)}

def exists(path):
    return Path(path).exists()

def meminfo():
    data = {}
    try:
        for line in Path("/proc/meminfo").read_text().splitlines():
            key, value = line.split(":", 1)
            data[key] = value.strip()
    except Exception:
        pass
    return data

checks = {
    "generated_at": datetime.now(timezone.utc).isoformat(),
    "host": socket.gethostname(),
    "whoami": run("whoami"),
    "os": run("uname -a; test -f /etc/os-release && . /etc/os-release && echo \"$PRETTY_NAME\""),
    "resources": {
        "nproc": run("nproc"),
        "meminfo": meminfo(),
        "free": run("free -h"),
        "disk": run("df -h / /opt /var 2>/dev/null || df -h"),
        "uptime": run("uptime")
    },
    "docker": {
        "version": run("docker --version"),
        "compose": run("docker compose version"),
        "containers": run("docker ps --format '{{.Names}}|{{.Image}}|{{.Status}}|{{.Ports}}'"),
        "networks": run("docker network ls --format '{{.Name}}|{{.Driver}}|{{.Scope}}'")
    },
    "ports": run("ss -ltnp"),
    "paths": {
        "/opt/onia-supabase/supabase/docker": exists("/opt/onia-supabase/supabase/docker"),
        "/opt/onia-calcom": exists("/opt/onia-calcom"),
        "/opt/onia-selfhosted": exists("/opt/onia-selfhosted"),
        "/root/backups/supabase": exists("/root/backups/supabase"),
        "/root/.hermes/.env": exists("/root/.hermes/.env")
    },
    "supabase": {
        "compose_ps": run("cd /opt/onia-supabase/supabase/docker 2>/dev/null && docker compose ps || true"),
        "kong_health": run("curl -fsS --max-time 5 http://127.0.0.1:54321/health || true"),
        "studio_head": run("curl -fsSI --max-time 5 http://127.0.0.1:54323 || true")
    },
    "backups": {
        "supabase_listing": run("ls -lah /root/backups/supabase 2>/dev/null | tail -50 || true"),
        "cron": run("test -f /etc/cron.d/onia-supabase-backup && cat /etc/cron.d/onia-supabase-backup || true")
    },
    "selfhosted": {
        "compose_ps": run("cd /opt/onia-selfhosted 2>/dev/null && docker compose --profile monitor --profile utility --profile ai --profile research --profile mail ps || true")
    }
}

print(json.dumps(checks, indent=2, ensure_ascii=False))
`;

function parseMemTotalMb(report) {
  const raw = report.resources?.meminfo?.MemTotal || "";
  const match = raw.match(/(\d+)/);
  if (!match) return 0;
  return Math.round(Number(match[1]) / 1024);
}

function summarize(report) {
  const totalMb = parseMemTotalMb(report);
  const containers = report.docker?.containers?.stdout || "";
  const lines = [];
  lines.push(`Host: ${report.host}`);
  lines.push(`RAM total aprox: ${totalMb || "unknown"} MB`);
  lines.push(`Supabase path: ${report.paths["/opt/onia-supabase/supabase/docker"] ? "present" : "missing"}`);
  lines.push(`Selfhosted path: ${report.paths["/opt/onia-selfhosted"] ? "present" : "missing"}`);
  lines.push(`Hermes env: ${report.paths["/root/.hermes/.env"] ? "present" : "missing"}`);
  lines.push(`Running containers: ${containers.trim().split(/\r?\n/).filter(Boolean).length}`);
  if (totalMb && totalMb < 7000) {
    lines.push("Decision: instalar solo monitor/utility; AI/research/Dify necesitan mas margen.");
  } else if (totalMb) {
    lines.push("Decision: VPS podria probar AI/research con cuidado; Dify aun requiere revision de puertos.");
  }
  return lines.join("\n");
}

async function main() {
  const conn = await connectSsh();
  try {
    const result = await exec(conn, `bash -lc ${shellQuote(remoteScript(auditPy))}`);
    if (result.code !== 0) {
      process.stderr.write(result.stderr || result.stdout);
      process.exitCode = result.code;
      return;
    }
    const report = JSON.parse(result.stdout);
    const dir = path.join(repoRoot, ".hermes", "audits");
    fs.mkdirSync(dir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const file = path.join(dir, `onia-vps-selfhosted-${stamp}.json`);
    fs.writeFileSync(file, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    process.stdout.write(`${summarize(report)}\n`);
    process.stdout.write(`Audit saved: ${file}\n`);
  } finally {
    conn.end();
  }
}

main().catch((err) => {
  process.stderr.write(`${err.message}\n`);
  process.exitCode = 1;
});
