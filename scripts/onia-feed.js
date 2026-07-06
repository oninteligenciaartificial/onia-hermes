// ONIA feed — alimenta los agentes desde la terminal, corriendo dentro de onia-center
// (que tiene acceso a Supabase + LiteLLM). El secreto nunca sale del VPS.
//
// Requiere: VPS_HOST, VPS_KEY_PATH (como el resto de scripts/*).
//
// Leads (para el Agente Vendedor):
//   node scripts/onia-feed.js lead --company "Clinica X" --contact "wa +591 7..." \
//        --channel WhatsApp --notes "pidio chatbot de turnos"
//
// Candidatos Nuvia (scoring ONIA-Bolivia):
//   node scripts/onia-feed.js nuvia --file candidatos.json   # array de candidatos
//   node scripts/onia-feed.js nuvia --title "Serum Vit C" --category skincare \
//        --price 3.2 --weight 0.12 --supplier "Shenzhen Glow" --demand 800
//
// Ingresos (registra cobro + reparto Fondo/Arthur/Sergio -> tracker de ganancias):
//   node scripts/onia-feed.js income --monto 1500 --service web_pro_onia \
//        --seller arthur --arthur 50 --costs 0 --note "web clinica X"
const fs = require("node:fs");
const { connectSsh, exec } = require("./lib/ssh");

function parseFlags(rest) {
  const out = {};
  for (let i = 0; i < rest.length; i++) {
    if (rest[i].startsWith("--")) {
      const key = rest[i].slice(2);
      const val = rest[i + 1] && !rest[i + 1].startsWith("--") ? rest[++i] : "true";
      out[key] = val;
    }
  }
  return out;
}
const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64");

function buildLead(f) {
  if (!f.company) throw new Error("lead: --company es requerido");
  return {
    company: f.company,
    contact: f.contact || null,
    channel: f.channel || "Manual",
    source: f.source || "onia-feed",
    notes: f.notes || null,
    service: f.service || null,
    pipeline_status: f.status || "Nuevo",
    priority: f.priority || "media",
  };
}

function buildCandidates(f) {
  if (f.file) {
    const data = JSON.parse(fs.readFileSync(f.file, "utf8"));
    return Array.isArray(data) ? data : [data];
  }
  if (!f.title) throw new Error("nuvia: pasa --file <json> o al menos --title");
  return [
    {
      title: f.title,
      category: f.category || null,
      supplier: f.supplier || null,
      unit_price_usd: f.price != null ? Number(f.price) : null,
      weight_kg: f.weight != null ? Number(f.weight) : null,
      moq: f.moq != null ? parseInt(f.moq, 10) : null,
      est_monthly_demand: f.demand != null ? Number(f.demand) : null,
      source_url: f.url || null,
    },
  ];
}

function buildIncome(f) {
  if (!f.monto) throw new Error("income: --monto (cobro en Bs) es requerido");
  return {
    gross: Number(f.monto),
    costs: f.costs != null ? Number(f.costs) : 0,
    service: f.service || "web_pro_onia",
    seller: f.seller || "arthur",
    arthurRate: f.arthur != null ? Number(f.arthur) : 50,
    delivery: f.delivery || "delivered",
    reference: f.reference || null,
    note: f.note || null,
  };
}

async function main() {
  const [, , mode, ...rest] = process.argv;
  const f = parseFlags(rest);
  let command;
  if (mode === "lead") {
    command = `docker exec -e LEAD_B64='${b64(buildLead(f))}' -i onia-center node - < /opt/onia/lead-insert.mjs`;
  } else if (mode === "nuvia") {
    command = `bash /opt/onia/nuvia-score-run.sh '${b64(buildCandidates(f))}'`;
  } else if (mode === "income") {
    command = `docker exec -e INCOME_B64='${b64(buildIncome(f))}' -i onia-center node - < /opt/onia/income-insert.mjs`;
  } else {
    console.error("Uso: node scripts/onia-feed.js <lead|nuvia|income> [--flags]  (ver cabecera del archivo)");
    process.exit(1);
  }
  const conn = await connectSsh();
  const { stdout, stderr } = await exec(conn, command);
  conn.end();
  process.stdout.write((stdout || "").trim() + "\n");
  if (stderr && stderr.trim()) console.error(stderr.trim());
}

main().catch((e) => {
  console.error("ERR:", e.message);
  process.exit(1);
});
