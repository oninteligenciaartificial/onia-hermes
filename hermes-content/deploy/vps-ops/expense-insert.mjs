// ONIA — Registra un GASTO (expense_entry) + su evidencia (factura) con atributos fiscales.
// Corre DENTRO de onia-center (docker exec). Lee EXPENSE_B64 (base64 JSON):
//   { amount, category, reason, provider, center, hasFactura, esExterior, deducible,
//     facturaRef, spentAt, moneda, note, sample }
// Deja el gasto como 'pending' (Sergio aprueba en el cierre) con evidencia enlazada, y guarda
// en raw los flags que el Agente Finanzas usa para la postura fiscal:
//   has_factura, es_exterior, deducible_iue, proveedor, factura_ref, moneda.
// Devuelve el impacto fiscal estimado (credito IVA / credito perdido / retencion IUE-BE).
//
// NO aprueba ni mueve plata. Base: regimen General (ONIA_OPTIMIZACION_FISCAL_PROPIA_2026.md).
// Env (de onia-center): ONIA_CENTER_SUPABASE_URL, ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY

const SB_URL = process.env.ONIA_CENTER_SUPABASE_URL;
const SB_KEY = process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY;
const CENTERS = new Set(["onia_services", "onia_media", "onia_fund", "nuvia", "nuvia_reserve", "arthur_variable", "sergio_owner_income"]);
const IVA = 0.13, IUE_BE = 0.125;

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
    const e = JSON.parse(Buffer.from(process.env.EXPENSE_B64 || "", "base64").toString("utf8"));
    const amount = r2(e.amount);
    if (!amount || amount <= 0) throw new Error("amount (monto en Bs) invalido");
    const center = CENTERS.has(e.center) ? e.center : "onia_services";
    const category = String(e.category || "herramienta").slice(0, 60);
    const reason = String(e.reason || e.provider || "gasto operativo").slice(0, 200);
    const provider = String(e.provider || "").slice(0, 80);
    const hasFactura = e.hasFactura === true;
    const esExterior = e.esExterior === true;
    const deducible = e.deducible !== false; // default true
    const facturaRef = e.facturaRef ? String(e.facturaRef).slice(0, 120) : null;
    const moneda = String(e.moneda || "BOB").slice(0, 8).toUpperCase();
    const spentAt = /^\d{4}-\d{2}-\d{2}$/.test(e.spentAt || "") ? e.spentAt : new Date(Date.now() - 4 * 3600 * 1000).toISOString().slice(0, 10);

    // 1) evidencia (la factura/comprobante). status pending: Sergio aprueba en el cierre.
    const evRows = await sb("evidence_items?select=id", {
      method: "POST", headers: H({ prefer: "return=representation" }),
      body: JSON.stringify({
        evidence_key: key("ev"), center_key: center, actor_role_key: "sergio", evidence_type: "cost",
        title: "Factura/comprobante " + (provider || category), proof_reference: facturaRef, amount_bs: amount,
        raw: { addedBy: "expense-insert", es_exterior: esExterior, has_factura: hasFactura },
      }),
    });
    const evidence_id = evRows[0].id;

    // 2) gasto con la evidencia enlazada + flags fiscales en raw.
    const expense_key = key("exp");
    await sb("expense_entries", {
      method: "POST", headers: H({ prefer: "return=minimal" }),
      body: JSON.stringify({
        expense_key, center_key: center, owner_role_key: "sergio", spent_at: spentAt,
        amount_bs: amount, category, reason, evidence_id, status: "pending",
        raw: {
          addedBy: "expense-insert", proveedor: provider, has_factura: hasFactura, es_exterior: esExterior,
          deducible_iue: deducible, factura_ref: facturaRef, moneda, note: e.note || null,
          sample: e.sample === true || undefined,
        },
      }),
    });

    // 3) impacto fiscal estimado (informativo).
    const ivaCredito = !esExterior && hasFactura ? r2(amount * IVA) : 0;
    const creditoPerdido = !esExterior && !hasFactura ? r2(amount * IVA) : 0;
    const iueBe = esExterior ? r2(amount * IUE_BE) : 0;

    out({
      ok: true, expense_key, evidence_id, center, provider, amount, moneda, spentAt,
      hasFactura, esExterior, deducible,
      fiscal: {
        iva_credito_bs: ivaCredito, credito_fiscal_perdido_bs: creditoPerdido, iue_be_retencion_bs: iueBe,
        nota: esExterior
          ? "Exterior: sin credito IVA; retener IUE-BE 12.5% (" + iueBe + ") para deducir del IUE."
          : hasFactura ? "Nacional con factura: suma credito fiscal IVA." : "Nacional SIN factura: se pierde credito fiscal. Pedi factura al NIT de ONIA.",
      },
      status: "pending",
    });
  } catch (err) {
    out({ ok: false, error: String(err.message || err).slice(0, 260) });
  }
})();
