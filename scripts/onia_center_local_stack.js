#!/usr/bin/env node

const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const { spawn, execFileSync } = require("child_process");

const args = new Set(process.argv.slice(2));
const restart = args.has("--restart");
const installStartup = args.has("--install-startup");
const tunnelOnly = args.has("--tunnel-only") || args.has("--no-app");
const watch = args.has("--watch");

const repoRoot = path.resolve(__dirname, "..");
const siteRoot = path.join(repoRoot, "web-factory", "apps", "site");
const envPath = path.join(siteRoot, ".env.local");
const logRoot = path.join(process.env.LOCALAPPDATA || os.tmpdir(), "ONIA", "onia-center");
const vpsHost = process.env.VPS_HOST || "187.77.16.63";
const vpsUser = process.env.VPS_USER || "root";
const keyPath = process.env.VPS_KEY_PATH || path.join(os.homedir(), ".ssh", "onia_hermes_vps_ed25519");
const appPort = Number(process.env.ONIA_CENTER_LOCAL_PORT || 3012);
const watchIntervalMs = Number(process.env.ONIA_CENTER_TUNNEL_WATCH_MS || 15000);
const audioTunnelEnabled = process.env.ONIA_AUDIO_TUNNEL_ENABLED !== "false";
// 26-oct: con --tunnel-only, Supabase y Speakr van solo a pedido. Abiertos, cualquier proceso de la PC llegaba a
// la base del VPS. La app completa de ONIA Center sigue necesitando Supabase.
const supabaseTunnelEnabled = !tunnelOnly || process.env.ONIA_SUPABASE_TUNNEL_ENABLED === "true";
const speakrTunnelEnabled = process.env.ONIA_SPEAKR_TUNNEL_ENABLED === "true";
const speakrLocalPort = Number(process.env.ONIA_SPEAKR_LOCAL_PORT || 3107);
const speachesLocalPort = Number(process.env.ONIA_SPEACHES_LOCAL_PORT || 3108);

fs.mkdirSync(logRoot, { recursive: true });

function readEnvValue(name) {
  if (!fs.existsSync(envPath)) return "";
  const content = fs.readFileSync(envPath, "utf8");
  const lines = content.split(/\r?\n/);
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index];
    const match = line.match(new RegExp(`^\\s*${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*=\\s*(.*)\\s*$`));
    if (match) return match[1].trim().replace(/^["']|["']$/g, "");
  }
  return "";
}

function getSupabaseLocalPort() {
  const url = readEnvValue("ONIA_CENTER_SUPABASE_URL");
  if (!url) return 54321;
  try {
    return Number(new URL(url).port || 54321);
  } catch {
    return 54321;
  }
}

function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const done = (value) => {
      socket.destroy();
      resolve(value);
    };
    socket.setTimeout(500);
    socket.once("connect", () => done(true));
    socket.once("timeout", () => done(false));
    socket.once("error", () => done(false));
    socket.connect(port, "127.0.0.1");
  });
}

async function waitForPort(port, seconds) {
  const deadline = Date.now() + seconds * 1000;
  while (Date.now() < deadline) {
    if (await isPortOpen(port)) return true;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return false;
}

function quoteForVbs(value) {
  return String(value).replace(/"/g, '""');
}

function installStartupLauncher() {
  const startupDir = path.join(process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming"), "Microsoft", "Windows", "Start Menu", "Programs", "Startup");
  const launcherPath = path.join(startupDir, "onia-center-local-stack.vbs");
  const launcherFlags = [watch ? "--watch" : "", tunnelOnly ? "--tunnel-only" : ""].filter(Boolean).join(" ");
  const launcher = [
    'Set shell = CreateObject("WScript.Shell")',
    `shell.Run """${quoteForVbs(process.execPath)}"" ""${quoteForVbs(__filename)}"" ${launcherFlags}", 0, False`,
    "",
  ].join("\r\n");
  try {
    fs.mkdirSync(startupDir, { recursive: true });
    fs.writeFileSync(launcherPath, launcher, "ascii");
    console.log(`Launcher instalado en Inicio de Windows: ${launcherPath}`);
    return;
  } catch (error) {
    console.log(`No se pudo escribir en Inicio de Windows: ${error.message}`);
  }

  const runKey = "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run";
  const valueName = "ONIA Center Local Stack";
  const runFlags = [watch ? "--watch" : "", tunnelOnly ? "--tunnel-only" : ""].filter(Boolean);
  const runArgs = [__filename, ...runFlags].map((value) => `'${value.replace(/'/g, "''")}'`).join(",");
  const command = `powershell.exe -WindowStyle Hidden -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -WindowStyle Hidden -FilePath '${process.execPath.replace(/'/g, "''")}' -ArgumentList @(${runArgs})"`;
  execFileSync("reg.exe", ["add", runKey, "/v", valueName, "/t", "REG_SZ", "/d", command, "/f"], { stdio: "ignore" });
  console.log(`Arranque instalado en registro de usuario: ${runKey}\\${valueName}`);
}

function stopPortOwner(port) {
  const command = [
    `$connections = Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue`,
    "$pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique",
    "foreach ($pid in $pids) { if ($pid -and $pid -ne $PID) { Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue } }",
  ].join("; ");
  try {
    execFileSync("powershell.exe", ["-NoProfile", "-Command", command], { stdio: "ignore" });
  } catch {
    // Best effort only. If the port stays open, the later health check will report it.
  }
}

function spawnDetached(command, commandArgs, outName, errName, cwd = repoRoot) {
  const out = fs.openSync(path.join(logRoot, outName), "a");
  const err = fs.openSync(path.join(logRoot, errName), "a");
  const child = spawn(command, commandArgs, {
    cwd,
    detached: true,
    stdio: ["ignore", out, err],
    windowsHide: true,
  });
  child.unref();
}

async function ensureTunnel(supabaseLocalPort) {
  if (!fs.existsSync(keyPath)) {
    throw new Error(`No existe la llave SSH: ${keyPath}`);
  }

  const portMap = supabaseTunnelEnabled
    ? [
        { label: "Supabase API", local: supabaseLocalPort, remote: 54321 },
        { label: "Supabase studio", local: 54322, remote: 54322 },
        { label: "Supabase db", local: 54323, remote: 54323 },
        { label: "Supabase auth", local: 54320, remote: 54320 },
        { label: "Supabase extra", local: 54329, remote: 54329 },
      ]
    : [];

  if (audioTunnelEnabled) {
    if (speakrTunnelEnabled) portMap.push({ label: "Speakr", local: speakrLocalPort, remote: 3107 });
    portMap.push({ label: "Speaches", local: speachesLocalPort, remote: 3108 });
  }

  const sshArgs = ["-N", "-o", "ExitOnForwardFailure=yes", "-o", "ServerAliveInterval=30", "-o", "ServerAliveCountMax=3", "-i", keyPath];
  const requestedPorts = [];

  for (const map of portMap) {
    if (!(await isPortOpen(map.local))) {
      sshArgs.push("-L", `${map.local}:127.0.0.1:${map.remote}`);
      requestedPorts.push(map);
    }
  }

  if (!sshArgs.includes("-L")) return;

  sshArgs.push(`${vpsUser}@${vpsHost}`);
  spawnDetached("ssh.exe", sshArgs, "onia-selfhosted-tunnel.out.log", "onia-selfhosted-tunnel.err.log");

  for (const map of requestedPorts) {
    if (!(await waitForPort(map.local, 25))) {
      throw new Error(`No se pudo levantar el tunel ${map.label} en 127.0.0.1:${map.local}. Revisa ${path.join(logRoot, "onia-selfhosted-tunnel.err.log")}`);
    }
  }
}

async function ensureApp() {
  if (restart) {
    stopPortOwner(appPort);
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  if (await isPortOpen(appPort)) return;

  spawnDetached("cmd.exe", ["/d", "/s", "/c", `npm run dev -- -p ${appPort}`], "onia-center-next.out.log", "onia-center-next.err.log", siteRoot);

  if (!(await waitForPort(appPort, 40))) {
    throw new Error(`ONIA Center no arranco en 127.0.0.1:${appPort}. Revisa ${path.join(logRoot, "onia-center-next.err.log")}`);
  }
}

async function main() {
  if (installStartup) installStartupLauncher();

  const supabaseLocalPort = getSupabaseLocalPort();
  await ensureTunnel(supabaseLocalPort);
  if (!tunnelOnly) await ensureApp();

  console.log("ONIA Center local activo");
  if (!tunnelOnly) console.log(`App: http://localhost:${appPort}/onia-center/login`);
  if (supabaseTunnelEnabled) console.log(`Supabase tunnel: 127.0.0.1:${supabaseLocalPort} -> ${vpsHost}:54321`);
  if (audioTunnelEnabled) {
    if (speakrTunnelEnabled) console.log(`Speakr tunnel: 127.0.0.1:${speakrLocalPort} -> ${vpsHost}:3107`);
    console.log(`Speaches tunnel: 127.0.0.1:${speachesLocalPort} -> ${vpsHost}:3108`);
  }
  console.log(`Logs: ${logRoot}`);

  if (!watch) return;

  console.log(`Watchdog activo cada ${watchIntervalMs} ms`);
  setInterval(async () => {
    try {
      await ensureTunnel(supabaseLocalPort);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] ${error.message || error}`);
    }
  }, watchIntervalMs);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
