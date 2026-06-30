#!/usr/bin/env node
import { spawn } from "node:child_process";
import { constants as fsConstants } from "node:fs";
import { mkdir, open, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultRoot = path.resolve(scriptDir, "..");
const root = path.resolve(process.env.WEB_FACTORY_ROOT || defaultRoot);
const mode = readOption("--mode") || "daily";
const dryRun = process.argv.includes("--dry-run");
const applyNuvia = process.argv.includes("--apply-nuvia");
const stateDir = path.resolve(
  process.env.WEB_FACTORY_AUTOMATION_STATE_DIR ||
    (process.platform === "win32"
      ? path.join(root, "data", "automation-runs")
      : "/var/log/onia/web-factory"),
);

const stepPlans = {
  references: [
    step("references-harvest", "pnpm", ["references:harvest:daily"], 45),
    step("references-intelligence", "pnpm", ["references:intelligence"], 10),
  ],
  "nuvia-check": [step("nuvia-price-check", "pnpm", ["nuvia:prices:check"], 25)],
  "nuvia-watch": [step("nuvia-price-watch", "pnpm", ["nuvia:prices:watch"], 30)],
  smoke: [step("factory-smoke", "pnpm", ["factory:smoke"], 30)],
};

stepPlans.daily = [
  ...stepPlans.references,
  ...(applyNuvia ? stepPlans["nuvia-watch"] : stepPlans["nuvia-check"]),
];

const plan = stepPlans[mode];

if (!plan) {
  fail(`Modo invalido "${mode}". Usa daily, references, nuvia-check, nuvia-watch o smoke.`);
}

const startedAt = new Date().toISOString();
const runId = `${startedAt.replace(/[:.]/g, "-")}-${mode}`;
const reportPath = path.join(stateDir, "latest-web-factory-vps-automation.json");
const datedReportPath = path.join(stateDir, `${runId}.json`);
const lockPath = path.join(stateDir, `${mode}.lock`);

let lockHandle;
const report = {
  ok: false,
  mode,
  dryRun,
  applyNuvia,
  startedAt,
  finishedAt: null,
  root,
  stateDir,
  runId,
  steps: [],
  reportPath,
  datedReportPath,
};

try {
  await mkdir(stateDir, { recursive: true });
  lockHandle = await acquireLock();

  for (const plannedStep of plan) {
    const result = await runStep(plannedStep);
    report.steps.push(result);
    if (!result.ok) {
      throw new Error(`Fallo ${plannedStep.id} con exitCode=${result.exitCode}`);
    }
  }

  report.ok = true;
} catch (error) {
  report.error = error instanceof Error ? error.message : String(error);
} finally {
  report.finishedAt = new Date().toISOString();
  await writeReports(report);
  if (lockHandle) {
    await lockHandle.close().catch(() => undefined);
    await rm(lockPath, { force: true }).catch(() => undefined);
  }
}

console.log(JSON.stringify(report, null, 2));
process.exit(report.ok ? 0 : 1);

function step(id, command, args, timeoutMinutes) {
  return { id, command, args, timeoutMs: timeoutMinutes * 60 * 1000 };
}

function readOption(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  return process.argv[index + 1] || null;
}

async function acquireLock() {
  try {
    const handle = await open(lockPath, fsConstants.O_CREAT | fsConstants.O_EXCL | fsConstants.O_RDWR);
    await handle.writeFile(JSON.stringify({ runId, mode, startedAt, pid: process.pid }, null, 2));
    return handle;
  } catch (error) {
    if (error?.code === "EEXIST") {
      throw new Error(`Ya existe un run activo para mode=${mode}. Lock: ${lockPath}`);
    }
    throw error;
  }
}

async function runStep(plannedStep) {
  const started = new Date().toISOString();
  const commandText = [plannedStep.command, ...plannedStep.args].join(" ");

  if (dryRun) {
    return {
      id: plannedStep.id,
      command: commandText,
      ok: true,
      dryRun: true,
      exitCode: 0,
      startedAt: started,
      finishedAt: new Date().toISOString(),
      durationMs: 0,
      stdoutTail: "",
      stderrTail: "",
    };
  }

  return new Promise((resolve) => {
    const child = spawn(resolveCommand(plannedStep.command), plannedStep.args, {
      cwd: root,
      env: {
        ...process.env,
        CI: process.env.CI || "1",
      },
      shell: false,
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
    }, plannedStep.timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("close", (code, signal) => {
      clearTimeout(timeout);
      const finishedAt = new Date().toISOString();
      const exitCode = typeof code === "number" ? code : timedOut ? 124 : 1;
      resolve({
        id: plannedStep.id,
        command: commandText,
        ok: exitCode === 0 && !timedOut,
        dryRun: false,
        exitCode,
        signal,
        timedOut,
        timeoutMs: plannedStep.timeoutMs,
        startedAt: started,
        finishedAt,
        durationMs: Date.parse(finishedAt) - Date.parse(started),
        stdoutTail: tail(stdout),
        stderrTail: tail(stderr),
      });
    });
    child.on("error", (error) => {
      clearTimeout(timeout);
      const finishedAt = new Date().toISOString();
      resolve({
        id: plannedStep.id,
        command: commandText,
        ok: false,
        dryRun: false,
        exitCode: 1,
        startedAt: started,
        finishedAt,
        durationMs: Date.parse(finishedAt) - Date.parse(started),
        stdoutTail: tail(stdout),
        stderrTail: tail(`${stderr}\n${error.message}`),
      });
    });
  });
}

function resolveCommand(command) {
  if (process.platform === "win32" && command === "pnpm") return "pnpm.cmd";
  return command;
}

function tail(value) {
  return value.split(/\r?\n/).slice(-80).join("\n").trim();
}

async function writeReports(value) {
  await mkdir(stateDir, { recursive: true });
  const body = `${JSON.stringify(value, null, 2)}\n`;
  await writeFile(reportPath, body, "utf8");
  await writeFile(datedReportPath, body, "utf8");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
