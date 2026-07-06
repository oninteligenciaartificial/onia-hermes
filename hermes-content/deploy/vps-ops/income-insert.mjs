// ONIA — Registra un cobro (income_entry) + el reparto en payment_commissions segun el
// acuerdo (skim 10% recuperacion -> base 90%; Fondo ONIA 40%; Arthur rate%; Sergio 60-rate%).
// Corre DENTRO de onia-center (docker exec). Lee INCOME_B64 (base64 JSON con
// {gross, costs, service, seller, arthurRate, delivery, reference, note}).
// Inserta como status 'pending' (cobro real, falta cierre/aprobacion de Sergio).
// Devuelve el desglose. NO aprueba: Sergio aprueba en el cierre.

const SB_URL = process.env.ONIA_CENTER_SUPABASE_URL;
const SB_KEY = process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY;
const SERVICES = new Set(["onia_motor_local_growth", "onia_motor_local_starter", "onia_motor_local_pro", "web_pro_onia"]);
const SELLERS = new Set(["arthur", "sergio", "seller", "area_responsible", "freelancer"]);

function out(o) { process.stdout.write(JSON.stringify(o) + "\n"); }
function H(extra) {
  return { apikey: SB_KEY, Authorization: "Bearer " + SB_KEY, "Accept-Profile": "onia_center",
    "Content-Profile": "onia_center", "Content-Type": "application/json", ...(extra || {}) };
}
async function sb(path, init) {
  const res = await fetch(SB_URL + "/rest/v1/" + path, init);
  const t = await res.text();
  if (!res.ok) throw new Error("sb " + res.status + ": " + t.slice(0, 200));
  return t ? JSON.parse(t) : [];
}
const key = (p) => p + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
const r2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

(async () => {
  try {
    if (!SB_URL || !SB_KEY) throw new Error("faltan credenciales Supabase");
    const inc = JSON.parse(Buffer.from(process.env.INCOME_B64 || "", "base64").toString("utf8"));
    const gross = Number(inc.gross);
    if (!gross || gross <= 0) throw new Error("gross (monto) invalido");
    const costs = Number(inc.costs) || 0;
    const service = SERVICES.has(inc.service) ? inc.service : "web_pro_onia";
    const seller = SELLERS.has(inc.seller) ? inc.seller : "arthur";
    const arthurRate = Math.max(0, Math.min(50, Number(inc.arthurRate) != null ? Number(inc.arthurRate) : 50));
    const delivery = ["pending", "onboarding", "in_delivery", "delivered", "blocked", "refunded"].includes(inc.delivery) ? inc.delivery : "delivered";

    const net = r2(gross - costs);
    if (net < 0) throw new Error("neto negativo (costos > cobro)");
    const base = r2(net * 0.9); // skim 10% recuperacion de capital
    const fundRate = 40, sergioRate = 60 - arthurRate;
    const arthurAmt = r2(base * arthurRate / 100);
    const fundAmt = r2(base * fundRate / 100);
    const sergioAmt = r2(base * sergioRate / 100);

    // 1) income_entry
    const income_key = key("income");
    const rows = await sb("income_entries?select=id,income_key,net_amount_bs", {
      method: "POST", headers: H({ prefer: "return=representation" }),
      body: JSON.stringify({
        income_key, service_key: service, center_key: "onia_services", seller_role_key: seller,
        gross_amount_bs: gross, external_costs_bs: costs, delivery_status: delivery,
        payment_reference: inc.reference || null,
        raw: { addedBy: "onia-feed-income", note: inc.note || null, skim_recuperacion_pct: 10 },
      }),
    });
    const income_id = rows[0].id;

    // 2) reparto en payment_commissions (status pending)
    const commissions = [
      { center: "arthur_variable", actor: "arthur", type: "arthur_variable", rate: arthurRate, amt: arthurAmt },
      { center: "onia_fund", actor: "sergio", type: "fund_allocation", rate: fundRate, amt: fundAmt },
      { center: "sergio_owner_income", actor: "sergio", type: "sergio_owner_income", rate: sergioRate, amt: sergioAmt },
    ];
    for (const c of commissions) {
      await sb("payment_commissions", {
        method: "POST", headers: H({ prefer: "return=minimal" }),
        body: JSON.stringify({
          payment_key: key("pay"), income_id, center_key: c.center, actor_role_key: c.actor,
          payment_type: c.type, calculation_basis: "base = neto * 90% (skim 10% recuperacion); % sobre base",
          gross_basis_bs: base, rate_percent: c.rate, calculated_amount_bs: c.amt, status: "pending",
          raw: { addedBy: "onia-feed-income", income_key },
        }),
      });
    }

    out({ ok: true, income_key, service, seller, gross, costs, net, base,
      arthur: { rate: arthurRate, amount: arthurAmt }, fondo: fundAmt,
      sergio: { rate: sergioRate, amount: sergioAmt }, status: "pending" });
  } catch (e) {
    out({ ok: false, error: String(e.message || e).slice(0, 260) });
  }
})();
