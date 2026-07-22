// ONIA — Registra un cobro (income_entry) + el reparto en payment_commissions segun el
// acuerdo (skim 10% recuperacion -> base 90%; Fondo ONIA 40%; Arthur rate%; Sergio 60-rate%).
// ADEMAS: si el vendedor es un COLABORADOR comercial (Camila=seller_001 / Jeronimo=seller_002),
// calcula y registra SU comision por resultado (payment_type='seller_commission') segun la regla
// ONIA por tipo de venta. Es ADITIVO: NO toca el reparto Arthur/Sergio/Fondo (esa conciliacion —
// la comision del colaborador sale de la parte de ONIA — se resuelve en el cierre, no aca).
// Corre DENTRO de onia-center (docker exec). Lee INCOME_B64 (base64 JSON con
// {gross, costs, service, seller, saleType, sellerRate, nuviaCommissionBs, arthurRate, delivery, reference, note}).
// Inserta como status 'pending' (cobro real, falta cierre/aprobacion de Sergio).
// Devuelve el desglose. NO aprueba: Sergio aprueba en el cierre.
//
// Regla de comision del colaborador (fuente de verdad:
// hermes-content/docs/ONIA_COLABORADORES_COMERCIALES_SIN_INVERSION_2026.md, seccion 2). Los % se
// calculan sobre el NETO realmente cobrado (gross - costos externos):
//   SaaS (DentalGest/GestiOS mensual, add-on) . 35% (solo 1er pago)
//   Pagina web - solo la vende ............... 12%
//   Pagina web - vende Y produce completa .... 18%
//   Auditoria / diagnostico / n8n / conector . 10%
//   Sistema personalizado .................... 10%
//   Nuvia .................................... comision FIJA por venta (Bs), NO % de utilidad
// El actor_role_key de la fila del colaborador == su user_key (seller_001/seller_002), que es el
// mismo key que finance-fund-agent.mjs mapea a la persona (Camila/Jeronimo) para raw.earnings.

const SB_URL = process.env.ONIA_CENTER_SUPABASE_URL;
const SB_KEY = process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY;
const SELLERS = new Set(["arthur", "sergio", "seller", "area_responsible", "freelancer"]);

// Colaboradores comerciales (sin inversion, pagados por resultado). Solo a ellos se les calcula
// seller_commission. input aceptado (alias o user_key) -> user_key canonico (== actor_role_key).
const COLLABORATOR_SELLERS = { camila: "seller_001", seller_001: "seller_001", jeronimo: "seller_002", seller_002: "seller_002" };
const COLLABORATOR_NAME = { seller_001: "Camila", seller_002: "Jeronimo" };

// Tipo de venta -> % de comision del colaborador sobre el NETO cobrado. nuvia = fija (no %).
const COMMISSION_RATE = { saas: 35, web: 12, web_produced: 18, service: 10, nuvia: 0 };
// Fallback service_key -> saleType cuando no se manda saleType explicito. Default seguro = service
// (10%, el mas bajo: nunca sobre-paga por inferencia). Los motor_local (recurrente) van a 10% salvo
// que se pase saleType='saas' explicito.
const SERVICE_SALETYPE = {
  dentalgest: "saas",
  web_pro_onia: "web", web_profesional: "web", landing_captacion: "web",
  auditoria_express: "service", diagnostico_plan: "service", consultoria_ia: "service",
  automatizacion_n8n: "service", chatbot_ia: "service", gestion_meta_ads: "service",
  marketing_digital: "service", video_ia_higgsfield: "service",
  onia_motor_local_growth: "service", onia_motor_local_starter: "service", onia_motor_local_pro: "service",
};

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

// Garantiza (idempotente) que exista el role_key del colaborador, para no violar la FK
// payment_commissions.actor_role_key / income_entries.seller_role_key -> roles(role_key). Mismo
// patron que arthur/sergio (persona == role_key). No pisa un rol existente (ignore-duplicates).
async function ensureRole(roleKey, roleName) {
  await sb("roles?on_conflict=role_key", {
    method: "POST", headers: H({ Prefer: "resolution=ignore-duplicates,return=minimal" }),
    body: JSON.stringify({
      role_key: roleKey, role_name: roleName + " (colaborador comercial)", hierarchy_level: 0,
      visibility_scope: "seller_basic",
      raw: { source: "income-insert.mjs — colaborador comercial (ledger de comisiones por resultado)" },
    }),
  });
}

(async () => {
  try {
    if (!SB_URL || !SB_KEY) throw new Error("faltan credenciales Supabase");
    const inc = JSON.parse(Buffer.from(process.env.INCOME_B64 || "", "base64").toString("utf8"));
    const gross = Number(inc.gross);
    if (!gross || gross <= 0) throw new Error("gross (monto) invalido");
    const costs = Number(inc.costs) || 0;
    // service_key: se pasa tal cual (la FK a services valida). Default historico: web_pro_onia.
    const service = inc.service || "web_pro_onia";
    // seller: acepta colaboradores (camila/jeronimo o seller_001/seller_002) ademas de los roles base.
    const sellerRaw = String(inc.seller || "").trim();
    const collaboratorSeller = COLLABORATOR_SELLERS[sellerRaw] || null; // user_key canonico o null
    const seller = collaboratorSeller || (SELLERS.has(sellerRaw) ? sellerRaw : "arthur");
    // Default 50 si no se pasa arthurRate. NaN-safe: Number(undefined)=NaN y "NaN != null" es true,
    // asi que el guard original dejaba arthurRate=NaN -> rate_percent null -> 23502. Number.isFinite lo evita.
    const arthurRate = Math.max(0, Math.min(50, Number.isFinite(Number(inc.arthurRate)) ? Number(inc.arthurRate) : 50));
    const delivery = ["pending", "onboarding", "in_delivery", "delivered", "blocked", "refunded"].includes(inc.delivery) ? inc.delivery : "delivered";

    const net = r2(gross - costs);
    if (net < 0) throw new Error("neto negativo (costos > cobro)");
    const base = r2(net * 0.9); // skim 10% recuperacion de capital
    const fundRate = 40, sergioRate = 60 - arthurRate;
    const arthurAmt = r2(base * arthurRate / 100);
    const fundAmt = r2(base * fundRate / 100);
    const sergioAmt = r2(base * sergioRate / 100);

    // Tipo de venta y comision del colaborador (sobre el NETO, no sobre la base del reparto interno).
    const saleType = COMMISSION_RATE[inc.saleType] != null ? inc.saleType : (SERVICE_SALETYPE[service] || "service");
    const incomeCenter = saleType === "nuvia" ? "nuvia" : "onia_services";
    let sellerCommission = null;
    if (collaboratorSeller) {
      if (saleType === "nuvia") {
        // Nuvia: comision FIJA por venta (regla bootstrap Nuvia; NO % de utilidad).
        sellerCommission = { userKey: collaboratorSeller, name: COLLABORATOR_NAME[collaboratorSeller] || collaboratorSeller,
          saleType, rate: 0, amount: r2(Number(inc.nuviaCommissionBs) || 0), center: incomeCenter,
          basis: "Nuvia: comision fija por venta (Bs), NO % de utilidad (regla bootstrap Nuvia)" };
      } else {
        // sellerRate: override opcional (ej. escalera 12% -> 15% tras 4 semanas verdes).
        const rate = Number(inc.sellerRate) > 0 ? Math.min(100, Number(inc.sellerRate)) : COMMISSION_RATE[saleType];
        sellerCommission = { userKey: collaboratorSeller, name: COLLABORATOR_NAME[collaboratorSeller] || collaboratorSeller,
          saleType, rate, amount: r2(net * rate / 100), center: incomeCenter,
          basis: "comision colaborador = " + rate + "% del NETO cobrado (gross - costos externos); tipo=" + saleType };
      }
      // El role del colaborador debe existir antes de referenciarlo (FK en income_entries y payment_commissions).
      await ensureRole(collaboratorSeller, sellerCommission.name);
    }

    // 1) income_entry
    const income_key = key("income");
    const rows = await sb("income_entries?select=id,income_key,net_amount_bs", {
      method: "POST", headers: H({ prefer: "return=representation" }),
      body: JSON.stringify({
        income_key, service_key: service, center_key: incomeCenter, seller_role_key: seller,
        gross_amount_bs: gross, external_costs_bs: costs, delivery_status: delivery,
        payment_reference: inc.reference || null,
        raw: { addedBy: "onia-feed-income", note: inc.note || null, skim_recuperacion_pct: 10,
          sale_type: saleType, seller_user_key: collaboratorSeller || null },
      }),
    });
    const income_id = rows[0].id;

    // 2) reparto en payment_commissions (status pending) — Arthur / Fondo / Sergio, SIN CAMBIOS.
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

    // 3) comision del colaborador (ADITIVO) — solo si el vendedor es colaborador (seller_001/seller_002).
    //    actor_role_key = user_key del vendedor -> finance-fund-agent lo suma a la persona en raw.earnings.
    if (sellerCommission) {
      await sb("payment_commissions", {
        method: "POST", headers: H({ prefer: "return=minimal" }),
        body: JSON.stringify({
          payment_key: key("pay"), income_id, center_key: sellerCommission.center,
          actor_role_key: sellerCommission.userKey, payment_type: "seller_commission",
          calculation_basis: sellerCommission.basis, gross_basis_bs: net,
          rate_percent: sellerCommission.rate, calculated_amount_bs: sellerCommission.amount, status: "pending",
          raw: { addedBy: "onia-feed-income", income_key, sale_type: sellerCommission.saleType,
            seller_user_key: sellerCommission.userKey, seller_name: sellerCommission.name },
        }),
      });
    }

    out({ ok: true, income_key, service, seller, saleType, gross, costs, net, base,
      arthur: { rate: arthurRate, amount: arthurAmt }, fondo: fundAmt,
      sergio: { rate: sergioRate, amount: sergioAmt },
      seller_commission: sellerCommission, status: "pending" });
  } catch (e) {
    out({ ok: false, error: String(e.message || e).slice(0, 260) });
  }
})();
