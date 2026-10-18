#!/usr/bin/env node
/*
Deploys Hermes docs, skills, references, and carousel generator to the VPS.

Env:
  VPS_HOST, VPS_USER (optional, default root), VPS_KEY_PATH or VPS_PASSWORD
  OPENAI_API_KEY (optional, stored only when provided)
*/

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const childProcess = require("node:child_process");
const { connectSsh, exec, sftp, putFile } = require("./lib/ssh");

const repoRoot = path.resolve(__dirname, "..");

// Archivados el 17-oct (historial/orquestacion-vieja). El tar no borra lo que ya no viene en el
// paquete, así que se podan a mano para que el VPS no siga sirviendo la orquestación retirada.
// ponytail: lista fija; si se archiva más seguido, podar contra el manifiesto del paquete.
const RETIRED_HERMES_PATHS = [
  "docs/COMO_SE_ARMA_UN_LOOP.md",
  "docs/CONOCIMIENTO_DE_LOS_LOOPS.md",
  "docs/DASHBOARD.md",
  "docs/HERMES_CLOSED_EXECUTION_AND_CONTINUOUS_WORK_2026.md",
  "docs/HERMES_OS_CONTROL_CENTER_2026.md",
  "docs/HERMES_PRODUCT_BRIDGE_2026.md",
  "docs/ONIA_COMPANY_OPERATING_MODEL_2026.md",
  "docs/ONIA_CONTENT_FACTORY_ORCHESTRATION_2026.md",
  "docs/ONIA_PROJECT_HYGIENE_AUTOMATION_2026.md",
  "docs/OPERATIONS.md",
  "docs/ORCHESTRATOR.md",
  "docs/handoff/ARRANQUE-SESIONES.md",
  "docs/handoff/codex-continuar-1.0.md",
  "docs/handoff/codex-relevo.md",
  "docs/handoff/codex-tareas",
  "docs/handoff/docs-auditoria.md",
  "docs/handoff/hermes-cal-nube-20260928.md",
  "docs/handoff/homelab-orquestacion-20260927.md",
  "docs/handoff/infra-cerebro-loops.md",
  "docs/handoff/madre-v2-revision.md",
  "docs/handoff/onia-cola.md",
  "docs/handoff/publicacion-y-nodo-casa.md",
];

function remotePythonCommand(source) {
  const encoded = Buffer.from(source, "utf8").toString("base64");
  return `python3 -c "import base64; exec(base64.b64decode('${encoded}').decode('utf-8'))"`;
}

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(full);
    return [full];
  });
}

function shouldDeployContentFile(contentRoot, localFile) {
  if (process.env.HERMES_DEPLOY_INCLUDE_MEDIA === "1") return true;
  const rel = path.relative(contentRoot, localFile).replaceAll("\\", "/");
  const ext = path.extname(localFile).toLowerCase();
  const mediaExtensions = new Set([
    ".mp4",
    ".mov",
    ".m4v",
    ".avi",
    ".webm",
    ".wav",
    ".mp3",
    ".m4a",
    ".aac",
    ".heic",
    ".heif",
    ".jpg",
    ".jpeg",
    ".png",
  ]);
  if (mediaExtensions.has(ext)) return false;

  const parts = rel.split("/");
  const isInboxMedia =
    parts.includes("inbox") ||
    parts.includes("voice-inbox") ||
    parts.includes("video-inbox");
  if (!isInboxMedia) return true;

  return true;
}

function shellQuote(value) {
  return `'${String(value).replaceAll("'", "'\\''")}'`;
}

function copyFilesToStage(files, sourceRoot, stageRoot) {
  for (const localFile of files) {
    const rel = path.relative(sourceRoot, localFile);
    const stagedFile = path.join(stageRoot, rel);
    fs.mkdirSync(path.dirname(stagedFile), { recursive: true });
    fs.copyFileSync(localFile, stagedFile);
  }
}

async function upsertEnv(conn, sftpClient, updates) {
  if (!Object.keys(updates).length) return;
  const tmpRemote = `/tmp/hermes_env_${Date.now()}.txt`;
  const localTmp = path.join(os.tmpdir(), path.basename(tmpRemote));
  const lines = Object.entries(updates)
    .map(([key, value]) => `${key}=${String(value).replaceAll("\n", "").replaceAll("\r", "")}`)
    .join("\n");
  fs.writeFileSync(localTmp, `${lines}\n`, "utf8");
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
  const result = await exec(conn, `bash -lc '${cmd.replaceAll("'", "'\\''")}'`);
  if (result.code !== 0) throw new Error(`Failed to update .env: ${result.stderr}`);
}

async function main() {
  const conn = await connectSsh();
  let sftpClient;
  try {
    sftpClient = await sftp(conn);
    await exec(
      conn,
      [
        "mkdir -p /root/.hermes/docs",
        "mkdir -p /root/.hermes/skills",
        "mkdir -p /root/.hermes/references",
        "mkdir -p /root/.hermes/scripts",
        "mkdir -p /root/.hermes/video-lab/jobs",
        "mkdir -p /root/.hermes/video-lab/briefs",
        "mkdir -p /root/.hermes/video-lab/outputs",
        "mkdir -p /root/.hermes/video-lab/archive",
        "mkdir -p /var/www/html/hermes-assets/videos",
      ].join(" && ")
    );

    const contentRoot = path.join(repoRoot, "hermes-content");
    const files = listFiles(contentRoot).filter((localFile) =>
      shouldDeployContentFile(contentRoot, localFile)
    );
    const stageRoot = fs.mkdtempSync(path.join(os.tmpdir(), "hermes-content-"));
    const archivePath = path.join(os.tmpdir(), `hermes-content-${Date.now()}.tgz`);
    const remoteArchive = `/tmp/hermes_content_${Date.now()}.tgz`;
    try {
      copyFilesToStage(files, contentRoot, stageRoot);
      const tarArgs = ["-czf", archivePath, "-C", stageRoot, "."];
      // En Windows, GNU tar interpreta el "C:" de la ruta como host remoto; --force-local lo evita.
      if (process.platform === "win32") tarArgs.unshift("--force-local");
      try {
        childProcess.execFileSync("tar", tarArgs);
      } catch (error) {
        if (process.platform !== "win32") throw error;
        const fallbackArgs = tarArgs.filter((arg) => arg !== "--force-local");
        childProcess.execFileSync("tar", fallbackArgs);
      }
      process.stdout.write(
        `Uploading Hermes content archive: ${files.length} files\n`
      );
      await putFile(sftpClient, archivePath, remoteArchive, 0o600);
      const extractArchive = await exec(
        conn,
        `mkdir -p /root/.hermes && tar -xzf ${shellQuote(remoteArchive)} -C /root/.hermes && rm -f ${shellQuote(remoteArchive)}`
      );
      if (extractArchive.code !== 0) {
        throw new Error(`Failed to extract Hermes content: ${extractArchive.stderr}`);
      }
      const pruneRetired = await exec(
        conn,
        `cd /root/.hermes && rm -rf -- ${RETIRED_HERMES_PATHS.map(shellQuote).join(" ")}`
      );
      if (pruneRetired.code !== 0) {
        throw new Error(`Failed to prune retired Hermes content: ${pruneRetired.stderr}`);
      }
    } finally {
      fs.rmSync(stageRoot, { recursive: true, force: true });
      fs.rmSync(archivePath, { force: true });
    }

    await putFile(
      sftpClient,
      path.join(repoRoot, "scripts", "carousel_generator.py"),
      "/root/.hermes/scripts/carousel_generator.py",
      0o755
    );
    await putFile(
      sftpClient,
      path.join(repoRoot, "scripts", "video_lab.py"),
      "/root/.hermes/scripts/video_lab.py",
      0o755
    );
    await putFile(
      sftpClient,
      path.join(repoRoot, "scripts", "hermes_week_status.py"),
      "/root/.hermes/scripts/hermes_week_status.py",
      0o755
    );
    await putFile(
      sftpClient,
      path.join(repoRoot, "scripts", "hermes_week_plan.py"),
      "/root/.hermes/scripts/hermes_week_plan.py",
      0o755
    );
    await putFile(
      sftpClient,
      path.join(repoRoot, "scripts", "social_publisher.py"),
      "/root/.hermes/scripts/social_publisher.py",
      0o755
    );
    await putFile(
      sftpClient,
      path.join(repoRoot, "scripts", "hermes_command_center.py"),
      "/root/.hermes/scripts/hermes_command_center.py",
      0o755
    );
    await putFile(
      sftpClient,
      path.join(repoRoot, "scripts", "acta_generator.py"),
      "/root/.hermes/scripts/acta_generator.py",
      0o755
    );

    const carouselWrapper = [
      "#!/usr/bin/env bash",
      "set -euo pipefail",
      "set -a",
      "source /root/.hermes/.env",
      "set +a",
      'exec python3 /root/.hermes/scripts/carousel_generator.py "$@"',
      "",
    ].join("\n");
    const localCarouselWrapper = path.join(os.tmpdir(), `carousel-generator-${Date.now()}`);
    fs.writeFileSync(localCarouselWrapper, carouselWrapper, "utf8");
    await putFile(sftpClient, localCarouselWrapper, "/usr/local/bin/carousel-generator", 0o755);

    const videoLabWrapper = [
      "#!/usr/bin/env bash",
      "set -euo pipefail",
      "set -a",
      "source /root/.hermes/.env",
      "set +a",
      'exec python3 /root/.hermes/scripts/video_lab.py "$@"',
      "",
    ].join("\n");
    const localVideoLabWrapper = path.join(os.tmpdir(), `video-lab-${Date.now()}`);
    fs.writeFileSync(localVideoLabWrapper, videoLabWrapper, "utf8");
    await putFile(sftpClient, localVideoLabWrapper, "/usr/local/bin/video-lab", 0o755);

    const weekStatusWrapper = [
      "#!/usr/bin/env bash",
      "set -euo pipefail",
      "set -a",
      "source /root/.hermes/.env",
      "set +a",
      'exec python3 /root/.hermes/scripts/hermes_week_status.py "$@"',
      "",
    ].join("\n");
    const localWeekStatusWrapper = path.join(os.tmpdir(), `hermes-week-status-${Date.now()}`);
    fs.writeFileSync(localWeekStatusWrapper, weekStatusWrapper, "utf8");
    await putFile(sftpClient, localWeekStatusWrapper, "/usr/local/bin/hermes-week-status", 0o755);

    const weekPlanWrapper = [
      "#!/usr/bin/env bash",
      "set -euo pipefail",
      "set -a",
      "source /root/.hermes/.env",
      "set +a",
      'exec python3 /root/.hermes/scripts/hermes_week_plan.py "$@"',
      "",
    ].join("\n");
    const localWeekPlanWrapper = path.join(os.tmpdir(), `hermes-week-plan-${Date.now()}`);
    fs.writeFileSync(localWeekPlanWrapper, weekPlanWrapper, "utf8");
    await putFile(sftpClient, localWeekPlanWrapper, "/usr/local/bin/hermes-week-plan", 0o755);

    const socialPublishWrapper = [
      "#!/usr/bin/env bash",
      "set -euo pipefail",
      "set -a",
      "source /root/.hermes/.env",
      "set +a",
      'exec python3 /root/.hermes/scripts/social_publisher.py "$@"',
      "",
    ].join("\n");
    const localSocialPublishWrapper = path.join(os.tmpdir(), `social-publish-${Date.now()}`);
    fs.writeFileSync(localSocialPublishWrapper, socialPublishWrapper, "utf8");
    await putFile(sftpClient, localSocialPublishWrapper, "/usr/local/bin/social-publish", 0o755);

    const hermesCommandWrapper = [
      "#!/usr/bin/env bash",
      "set -euo pipefail",
      "set -a",
      "source /root/.hermes/.env",
      "set +a",
      'exec python3 /root/.hermes/scripts/hermes_command_center.py "$@"',
      "",
    ].join("\n");
    const localHermesCommandWrapper = path.join(os.tmpdir(), `hermes-command-${Date.now()}`);
    fs.writeFileSync(localHermesCommandWrapper, hermesCommandWrapper, "utf8");
    await putFile(sftpClient, localHermesCommandWrapper, "/usr/local/bin/hermes-command", 0o755);

    const actaWrapper = [
      "#!/usr/bin/env bash",
      "set -euo pipefail",
      "set -a",
      "source /root/.hermes/.env",
      "set +a",
      'exec python3 /root/.hermes/scripts/acta_generator.py "$@"',
      "",
    ].join("\n");
    const localActaWrapper = path.join(os.tmpdir(), `acta-generator-${Date.now()}`);
    fs.writeFileSync(localActaWrapper, actaWrapper, "utf8");
    await putFile(sftpClient, localActaWrapper, "/usr/local/bin/acta-generator", 0o755);

    const chmodWrapper = await exec(
      conn,
      [
        "chown root:root /usr/local/bin/carousel-generator /usr/local/bin/video-lab /usr/local/bin/hermes-week-status /usr/local/bin/hermes-week-plan /usr/local/bin/social-publish /usr/local/bin/hermes-command",
        "chmod 755 /usr/local/bin/carousel-generator /usr/local/bin/video-lab /usr/local/bin/hermes-week-status /usr/local/bin/hermes-week-plan /usr/local/bin/social-publish /usr/local/bin/hermes-command",
        "chown root:root /root/.hermes/scripts/carousel_generator.py /root/.hermes/scripts/video_lab.py /root/.hermes/scripts/hermes_week_status.py /root/.hermes/scripts/hermes_week_plan.py /root/.hermes/scripts/social_publisher.py /root/.hermes/scripts/hermes_command_center.py",
        "chmod 755 /root/.hermes/scripts/carousel_generator.py /root/.hermes/scripts/video_lab.py /root/.hermes/scripts/hermes_week_status.py /root/.hermes/scripts/hermes_week_plan.py /root/.hermes/scripts/social_publisher.py /root/.hermes/scripts/hermes_command_center.py",
      ].join(" && ")
    );
    if (chmodWrapper.code !== 0) {
      throw new Error(`Failed to set wrapper permissions: ${chmodWrapper.stderr}`);
    }

    const chmodActa = await exec(
      conn,
      [
        "chown root:root /usr/local/bin/acta-generator /root/.hermes/scripts/acta_generator.py",
        "chmod 755 /usr/local/bin/acta-generator /root/.hermes/scripts/acta_generator.py",
      ].join(" && ")
    );
    if (chmodActa.code !== 0) {
      throw new Error(`Failed to set acta permissions: ${chmodActa.stderr}`);
    }

    const updates = {};
    if (process.env.OPENAI_API_KEY) updates.OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (process.env.OPENAI_TEXT_MODEL) updates.OPENAI_TEXT_MODEL = process.env.OPENAI_TEXT_MODEL;
    await upsertEnv(conn, sftpClient, updates);

    process.stdout.write(
      [
        "Hermes content installed on VPS.",
        "Installed:",
        "  /root/.hermes/docs/ONIA.md",
        "  /root/.hermes/docs/DASHBOARD.md",
        "  /root/.hermes/skills/*.md",
        "  /root/.hermes/references/pinterest.json",
        "  /usr/local/bin/carousel-generator",
        "  /usr/local/bin/video-lab",
        "  /usr/local/bin/hermes-week-status",
        "  /usr/local/bin/hermes-week-plan",
        "  /usr/local/bin/social-publish",
        "  /usr/local/bin/hermes-command",
        "  /usr/local/bin/acta-generator",
        "",
      ].join("\n")
    );
  } finally {
    if (sftpClient) {
      sftpClient.end();
    }
    conn.end();
  }
}

main().catch((err) => {
  process.stderr.write(`ERROR: ${err.message}\n`);
  process.exit(1);
});
