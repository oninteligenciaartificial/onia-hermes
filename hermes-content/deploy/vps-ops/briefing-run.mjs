// ONIA Center — corre el briefing diario llamando al endpoint interno DESDE DENTRO de
// onia-center (la key vive en su env; sin $env en n8n). Imprime la respuesta JSON del
// endpoint tal cual (ok/mode/message/data/result) para armar el resumen de Telegram.
// commit:true por defecto (crea las tareas del dia, deduplicadas). BRIEFING_COMMIT=false
// para dry-run (no escribe).
const http = require("http");

const key = process.env.ONIA_CENTER_INTERNAL_API_KEY || "";
const commit = process.env.BRIEFING_COMMIT !== "false";
const date = new Date().toLocaleDateString("en-CA", { timeZone: "America/La_Paz" });
const body = JSON.stringify({ date, source: "n8n", audiences: ["sergio", "arthur", "seller"], commit });

const req = http.request(
  "http://127.0.0.1:3012/api/onia-center/briefings/daily",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + key,
      "Content-Length": Buffer.byteLength(body),
    },
    timeout: 90000,
  },
  (res) => {
    let b = "";
    res.on("data", (c) => (b += c));
    res.on("end", () => process.stdout.write(b));
  },
);
req.on("error", (e) => process.stdout.write(JSON.stringify({ ok: false, message: "error " + e.message })));
req.write(body);
req.end();
