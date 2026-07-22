// ONIA — Auditor de código: avisa a Sergio por Telegram el resumen de la corrida.
// Lee el JSON que devolvió auditor-write.mjs (última línea del archivo argv[2]).
// Env: TG_TOKEN, TG_CHAT. Sin credenciales → no-op (no rompe el workflow).
import { readFileSync } from "node:fs";

const path = process.argv[2];
const token = process.env.TG_TOKEN;
const chat = process.env.TG_CHAT;
if (!token || !chat) {
  console.log("sin credenciales Telegram, salto aviso");
  process.exit(0);
}

let s;
try {
  s = JSON.parse(readFileSync(path, "utf8").trim().split("\n").pop());
} catch {
  s = { ok: false, fatal: "no pude leer el resultado del auditor" };
}

let text;
if (!s.ok) {
  text = "Auditor de código ONIA — ERROR: " + (s.fatal || "desconocido");
} else {
  const t = s.totals || {};
  const parts = Object.keys(t)
    .filter((k) => k !== "filesScanned" && t[k] > 0)
    .map((k) => t[k] + " " + k);
  const lines = ["Auditor de código ONIA: " + (s.score || 0) + " pts de deuda" + (parts.length ? " (" + parts.join(", ") + ")" : "") + "."];
  if ((s.top_3 || []).length) {
    lines.push("");
    lines.push("Atacar primero:");
    for (const x of s.top_3) lines.push("• " + x);
  }
  lines.push("");
  lines.push("Idea guardada en ONIA Center > Ideas. Solo lectura, no se tocó código.");
  text = lines.join("\n").slice(0, 3900);
}

const url = "https://api.telegram.org/bot" + token + "/sendMessage";
const res = await fetch(url, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: true }),
});
console.log("telegram", res.status);
