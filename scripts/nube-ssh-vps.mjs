#!/usr/bin/env node
// Deja listo `ssh onia-vps` en una sesión de Claude en la NUBE (hook SessionStart).
//
// Por qué existe (30-sep-2026): el contenedor de la nube solo deja salir HTTPS y
// WebSocket; el puerto 22 no sale (skill onia-infra, «Desde una sesión en la NUBE»).
// El VPS se alcanza por el túnel de Cloudflare `onia-ssh` → ssh.onia.com.bo. Cada
// contenedor nace vacío, así que sin esto cada sesión repetía a mano los mismos
// tres pasos (binario, llave, config) o, peor, concluía que «el VPS no se alcanza».
//
// En la laptop (Windows o local) NO hace nada: sale enseguida. Nunca imprime la
// llave, y nunca falla la sesión: cualquier error se reporta en una línea y sale 0.
import { execFileSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const HOST = "ssh.onia.com.bo";
const ALIAS = "onia-vps";
const BIN = "/usr/local/bin/cloudflared";
const URL_BIN = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64";

function main() {
  if (process.env.CLAUDE_CODE_REMOTE !== "true") return; // solo en la nube
  const llaveB64 = process.env.ONIA_VPS_SSH_KEY_B64;
  if (!llaveB64) return console.log("[nube-ssh-vps] sin ONIA_VPS_SSH_KEY_B64 en este entorno: no configuro SSH al VPS.");

  if (!existsSync(BIN)) {
    execFileSync("curl", ["-fsSL", "--max-time", "60", "-o", BIN, URL_BIN], { stdio: "ignore" });
    chmodSync(BIN, 0o755);
  }

  const dirSsh = join(homedir(), ".ssh");
  mkdirSync(dirSsh, { recursive: true, mode: 0o700 });
  const llave = join(dirSsh, "onia_vps");
  writeFileSync(llave, Buffer.from(llaveB64, "base64"), { mode: 0o600 });
  chmodSync(llave, 0o600);

  const config = join(dirSsh, "config");
  const actual = existsSync(config) ? readFileSync(config, "utf8") : "";
  if (!actual.includes(`Host ${ALIAS}`)) {
    const bloque = [
      `Host ${ALIAS}`,
      `  HostName ${HOST}`,
      "  User root",
      `  IdentityFile ${llave}`,
      "  IdentitiesOnly yes",
      `  ProxyCommand ${BIN} access ssh --hostname %h`,
      "  StrictHostKeyChecking accept-new",
      "  ServerAliveInterval 30",
      "",
    ].join("\n");
    writeFileSync(config, (actual && !actual.endsWith("\n") ? actual + "\n" : actual) + bloque, { mode: 0o600 });
  }
  console.log(`[nube-ssh-vps] listo: \`ssh ${ALIAS}\` entra al VPS por el túnel (skill onia-infra).`);
}

try {
  main();
} catch (error) {
  console.log(`[nube-ssh-vps] no pude dejar listo el SSH al VPS: ${error instanceof Error ? error.message.split("\n")[0] : error}`);
}
