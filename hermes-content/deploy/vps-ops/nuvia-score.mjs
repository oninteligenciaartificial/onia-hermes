// ONIA — Copiloto de sourcing Nuvia v1 (corre DENTRO de onia-center vía docker exec).
// Recibe candidatos de producto (base64 JSON en NUVIA_CANDIDATES_B64), calcula el score
// ONIA-Bolivia (flete, arancel, demanda, precio) de forma DETERMINISTA (sin LLM, sin gastar),
// y hace upsert en onia_center.nuvia_sourcing_candidates. Devuelve un resumen JSON.
//
// READ-ONLY / gate humano: NO contacta proveedores ni mueve dinero. Solo arma la ficha+score.

const SB_URL = process.env.ONIA_CENTER_SUPABASE_URL;
const SB_KEY = process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY;

// Parametros ONIA-Bolivia (aproximados, tunables). Flete aereo China->BO ~USD/kg;
// carga tributaria efectiva por rubro (GA + IVA + gastos, simplificado).
const FREIGHT_USD_PER_KG = Number(process.env.NUVIA_FREIGHT_USD_PER_KG || 12);
const TARIFF_BY_CATEGORY = {
  skincare: 0.2, cosmetics: 0.2, dermocosmetica: 0.2, supplements: 0.15,
  accessories: 0.1, apparel: 0.2, electronics: 0.18, home: 0.15,
};
const DEFAULT_TARIFF = 0.15;

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const round = (n, d = 0) => { const p = Math.pow(10, d); return Math.round((Number(n) || 0) * p) / p; };
const slug = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);

function out(obj) { process.stdout.write(JSON.stringify(obj) + "\n"); }
function sbHeaders(extra) {
  return {
    apikey: SB_KEY, Authorization: "Bearer " + SB_KEY,
    "Accept-Profile": "onia_center", "Content-Profile": "onia_center",
    "Content-Type": "application/json", ...(extra || {}),
  };
}

function scoreCandidate(c) {
  const price = Number(c.unit_price_usd) || 0;
  const weightKg = Number(c.weight_kg) || 0.3;
  const category = String(c.category || "").toLowerCase();
  const demand = Number(c.est_monthly_demand) || 0;

  const tariffRate = TARIFF_BY_CATEGORY[category] ?? DEFAULT_TARIFF;
  const freightCost = round(weightKg * FREIGHT_USD_PER_KG, 2);
  const tariffCost = round(price * tariffRate, 2);
  const landedCost = round(price + freightCost + tariffCost, 2);

  const freightRatio = freightCost / (price || 1);
  const freightScore = round(clamp(100 - freightRatio * 100, 0, 100));
  const tariffScore = round(clamp(100 - tariffRate * 300, 0, 100));
  const demandScore = demand > 0 ? round(clamp(Math.log10(demand + 1) * 33, 0, 100)) : 50;
  const priceScore = price <= 15 ? 80 : price <= 40 ? 60 : price <= 80 ? 45 : 30;

  const score = round(0.3 * freightScore + 0.25 * tariffScore + 0.25 * demandScore + 0.2 * priceScore);
  const verdict = score >= 70 ? "strong" : score >= 45 ? "review" : "weak";
  return {
    score, verdict,
    breakdown: {
      freightScore, tariffScore, demandScore, priceScore,
      tariffRate, freightCostUsd: freightCost, tariffCostUsd: tariffCost, landedCostUsd: landedCost,
    },
  };
}

async function upsert(row) {
  const res = await fetch(SB_URL + "/rest/v1/nuvia_sourcing_candidates?on_conflict=candidate_key", {
    method: "POST",
    headers: sbHeaders({ prefer: "resolution=merge-duplicates,return=minimal" }),
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error("supabase " + res.status + ": " + (await res.text()).slice(0, 200));
}

(async () => {
  const summary = { ok: true, received: 0, saved: 0, candidates: [], errors: [] };
  try {
    if (!SB_URL || !SB_KEY) throw new Error("faltan credenciales Supabase de onia-center");
    const b64 = process.env.NUVIA_CANDIDATES_B64 || "";
    if (!b64) throw new Error("falta NUVIA_CANDIDATES_B64");
    const list = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
    const candidates = Array.isArray(list) ? list : [list];
    summary.received = candidates.length;

    for (const c of candidates) {
      try {
        if (!c || !c.title) throw new Error("candidato sin title");
        const s = scoreCandidate(c);
        const candidate_key = (c.candidate_key && slug(c.candidate_key)) || "nuvia-" + slug(c.title) + "-" + slug(c.supplier || "");
        const row = {
          candidate_key,
          title: String(c.title).slice(0, 300),
          source_url: c.source_url || null,
          category: c.category || null,
          supplier: c.supplier || null,
          unit_price_usd: c.unit_price_usd != null ? Number(c.unit_price_usd) : null,
          moq: c.moq != null ? parseInt(c.moq, 10) : null,
          weight_kg: c.weight_kg != null ? Number(c.weight_kg) : null,
          score: s.score,
          verdict: s.verdict,
          score_breakdown: s.breakdown,
          status: "new",
          raw: c,
        };
        await upsert(row);
        summary.saved++;
        summary.candidates.push({ title: row.title, score: s.score, verdict: s.verdict });
      } catch (e) {
        summary.errors.push({ title: (c && c.title) || "?", error: String(e.message || e).slice(0, 200) });
      }
    }
  } catch (e) {
    summary.ok = false;
    summary.fatal = String(e.message || e).slice(0, 300);
  }
  out(summary);
})();
