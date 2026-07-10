// ONIA — Agente Finanzas y Fondo ONIA v2 (corre DENTRO del contenedor onia-center).
// Determinista, SIN LLM. Agrega lo REGISTRADO en onia_center:
//   - caja: ingresos netos (income_entries) acumulados + del periodo (ultimos 30 dias)
//   - comisiones por estado (payment_commissions)
//   - Fondo ONIA (payment_commissions payment_type=fund_allocation)
//   - riesgos: pagos bloqueados, uso premium sin aprobar, gastos pendientes sin evidencia
//   - POSTURA FISCAL del mes (v2): IVA a pagar / saldo a favor, IT, IUE estimado, credito fiscal
//     perdido (gastos sin factura), retenciones IUE-BE por pagos al exterior. Regimen General,
//     sin planilla (RC-IVA N/A). Base: ONIA_OPTIMIZACION_FISCAL_PROPIA_2026.md. Es ESTIMACION
//     (validar con contador matriculado); READ-ONLY.
// Escribe UNA fila por dia en onia_center.finance_summary (upsert por summary_key), incluida la
// columna aditiva tax_posture (contrato: ONIA_FINANCE_SUMMARY_CONTRACT.md). Pone el status del
// agente (agent_finance_fund) en 'ready'. Telegram SOLO si hay anomalias de plata (el fiscal va
// en la tabla/panel, no genera ping — para no romper la calma de vacaciones).
//
// Regla dura: READ-ONLY sobre la plata. NO mueve dinero, NO aprueba pagos ni comisiones.
//
// Env (de onia-center): ONIA_CENTER_SUPABASE_URL, ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY

const SB_URL = process.env.ONIA_CENTER_SUPABASE_URL;
const SB_KEY = process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY;
const AGENT_KEY = "agent_finance_fund";
const PERIOD_DAYS = 30;

// Config fiscal de ONIA (parametrizable). Confirmado 2026-07-10 por Sergio.
// TODO(bloqueado por Sergio): vencimiento_dia = calendario de vencimientos IVA/IT por ultimo
// digito de NIT (0) segun RND SIN vigente — no se fuerza hasta confirmar la fuente oficial.
const FISCAL = {
  regime: "general",
  rc_iva_applies: false,
  siat_emitting: false, // SIAT en tramite -> sin debito IVA formal todavia
  nit: "5371375010",
  nit_last_digit: "0",
  razon_social: "LESLIE MERCADO MORENO",
  cierre_mes: 12,
  iva: 0.13,
  it: 0.03,
  iue: 0.25,
  iue_be: 0.125,
  vencimiento_dia: null,
};

function out(o) {
  process.stdout.write(JSON.stringify(o) + "\n");
}
function H(extra) {
  return {
    apikey: SB_KEY,
    Authorization: "Bearer " + SB_KEY,
    "Accept-Profile": "onia_center",
    "Content-Profile": "onia_center",
    "Content-Type": "application/json",
    ...(extra || {}),
  };
}
async function sb(path, init) {
  const res = await fetch(SB_URL + "/rest/v1/" + path, init || { headers: H() });
  const t = await res.text();
  if (!res.ok) throw new Error("sb " + res.status + " " + path.split("?")[0] + ": " + t.slice(0, 180));
  return t ? JSON.parse(t) : [];
}
const num = (n) => Number(n) || 0;
const r2 = (n) => Math.round(num(n) * 100) / 100;
const bs = (n) => "Bs. " + r2(n).toFixed(2);

// Fecha La Paz (UTC-4) en YYYY-MM-DD.
function laPazDate(offsetDays = 0) {
  const now = new Date(Date.now() - 4 * 3600 * 1000 + offsetDays * 86400000);
  return now.toISOString().slice(0, 10);
}

// Postura fiscal del mes (estimacion). Ingresos = income_entries; gastos = expense_entries con
// flags fiscales en raw (has_factura, es_exterior, deducible_iue). Ver expense-insert.mjs.
function computeTaxPosture(income, expenses, monthStart, yearStart, period) {
  let grossMonth = 0;
  let netYear = 0;
  for (const r of income) {
    if (r.paid_at && r.paid_at >= monthStart) grossMonth += num(r.gross_amount_bs);
    if (r.paid_at && r.paid_at >= yearStart) netYear += num(r.net_amount_bs);
  }
  let ivaCredito = 0;
  let creditoPerdido = 0;
  let iueBe = 0;
  let gExt = 0;
  let gConFactura = 0;
  let gSinFactura = 0;
  let deducibleYear = 0;
  for (const x of expenses) {
    if (x.status === "rejected") continue;
    const amt = num(x.amount_bs);
    const raw = x.raw || {};
    const ext = raw.es_exterior === true;
    const fac = raw.has_factura === true;
    const ded = raw.deducible_iue !== false;
    if (x.spent_at && x.spent_at >= yearStart && ded) deducibleYear += amt;
    if (!(x.spent_at && x.spent_at >= monthStart)) continue;
    if (ext) {
      iueBe += amt * FISCAL.iue_be;
      gExt += amt;
    } else if (fac) {
      ivaCredito += amt * FISCAL.iva;
      gConFactura += amt;
    } else {
      creditoPerdido += amt * FISCAL.iva;
      gSinFactura += amt;
    }
  }
  const ivaDebito = FISCAL.siat_emitting ? grossMonth * FISCAL.iva : 0;
  const ivaAPagar = Math.max(0, ivaDebito - ivaCredito);
  const ivaSaldoFavor = Math.max(0, ivaCredito - ivaDebito);
  const it = grossMonth * FISCAL.it;
  const iueEstimado = Math.max(0, netYear - deducibleYear) * FISCAL.iue;
  return {
    regime: FISCAL.regime,
    rc_iva_applies: FISCAL.rc_iva_applies,
    siat_emitting: FISCAL.siat_emitting,
    nit: FISCAL.nit,
    nit_last_digit: FISCAL.nit_last_digit,
    razon_social: FISCAL.razon_social,
    period,
    rates: { iva: FISCAL.iva, it: FISCAL.it, iue: FISCAL.iue, iue_be: FISCAL.iue_be },
    iva_debito_bs: r2(ivaDebito),
    iva_credito_bs: r2(ivaCredito),
    iva_a_pagar_bs: r2(ivaAPagar),
    iva_saldo_favor_bs: r2(ivaSaldoFavor),
    it_bs: r2(it),
    iue_estimado_bs: r2(iueEstimado),
    credito_fiscal_perdido_bs: r2(creditoPerdido),
    iue_be_retenciones_bs: r2(iueBe),
    gastos_exterior_bs: r2(gExt),
    gastos_con_factura_bs: r2(gConFactura),
    gastos_sin_factura_bs: r2(gSinFactura),
    vencimiento_dia: FISCAL.vencimiento_dia,
    notes:
      "Estimacion automatica, regimen general, sin planilla. " +
      (FISCAL.siat_emitting ? "" : "SIAT en tramite: sin debito IVA formal aun; el credito se acumula como saldo a favor. ") +
      "IUE-BE: retener 12.5% al pagar servicios del exterior para poder deducir. Validar con contador matriculado.",
    generated_at: new Date().toISOString(),
  };
}

async function main() {
  if (!SB_URL || !SB_KEY) throw new Error("faltan credenciales Supabase de onia-center");
  const today = laPazDate(0);
  const periodStart = laPazDate(-PERIOD_DAYS);
  const monthStart = today.slice(0, 7) + "-01";
  const yearStart = today.slice(0, 4) + "-01-01";
  const period = today.slice(0, 7);

  // --- Ingresos (caja) ---
  const income = await sb(
    "income_entries?select=net_amount_bs,gross_amount_bs,paid_at,center_key,delivery_status&limit=5000",
    { headers: H() },
  );
  let cashTotal = 0;
  let cashPeriod = 0;
  const byCenter = {};
  let deliveryBlocked = 0;
  for (const r of income) {
    const net = num(r.net_amount_bs);
    cashTotal += net;
    if (r.paid_at && r.paid_at >= periodStart) cashPeriod += net;
    byCenter[r.center_key] = r2((byCenter[r.center_key] || 0) + net);
    if (r.delivery_status === "blocked" || r.delivery_status === "refunded") deliveryBlocked++;
  }

  // --- Comisiones por estado + Fondo ONIA ---
  const comm = await sb(
    "payment_commissions?select=status,payment_type,calculated_amount_bs,center_key&limit=5000",
    { headers: H() },
  );
  const byStatus = { estimated: 0, pending: 0, approved: 0, paid: 0, blocked: 0, discounted: 0 };
  let fundTotal = 0;
  for (const c of comm) {
    const amt = num(c.calculated_amount_bs);
    byStatus[c.status] = r2((byStatus[c.status] || 0) + amt);
    if (c.payment_type === "fund_allocation") fundTotal += amt;
  }

  // --- Gastos: todos (para la postura fiscal) + derivar pendientes/riesgo ---
  const expenses = await sb(
    "expense_entries?select=amount_bs,status,evidence_id,category,spent_at,raw&limit=5000",
    { headers: H() },
  );
  let expensesPending = 0;
  let expensesPendingNoEvidence = 0;
  for (const e of expenses) {
    if (e.status !== "pending") continue;
    expensesPending += num(e.amount_bs);
    if (!e.evidence_id) expensesPendingNoEvidence++;
  }

  // --- Uso premium sin aprobar (Higgsfield / IA premium) ---
  const premium = await sb(
    "premium_tool_usage?select=tool_name,cost_bs,status&status=eq.pending&limit=2000",
    { headers: H() },
  );
  let premiumPending = 0;
  const premiumTools = [];
  for (const p of premium) {
    premiumPending += num(p.cost_bs);
    premiumTools.push(p.tool_name);
  }

  // --- Postura fiscal (estimacion, no genera ping) ---
  const tax = computeTaxPosture(income, expenses, monthStart, yearStart, period);

  // --- Anomalias deterministas (de PLATA: gatillan Telegram) ---
  const anomalies = [];
  if (byStatus.blocked > 0) {
    anomalies.push({ kind: "blocked_payment", detail: "Pagos/comisiones en estado bloqueado", amount_bs: r2(byStatus.blocked) });
  }
  if (premium.length > 0) {
    anomalies.push({
      kind: "pending_premium",
      detail: "Uso premium sin aprobar: " + [...new Set(premiumTools)].slice(0, 6).join(", "),
      amount_bs: r2(premiumPending),
    });
  }
  if (expensesPendingNoEvidence > 0) {
    anomalies.push({
      kind: "pending_expense_no_evidence",
      detail: expensesPendingNoEvidence + " gasto(s) pendiente(s) sin evidencia",
      amount_bs: r2(expensesPending),
    });
  }
  if (deliveryBlocked > 0) {
    anomalies.push({ kind: "delivery_blocked", detail: deliveryBlocked + " cobro(s) con entrega bloqueada/reembolsada", amount_bs: 0 });
  }

  const summaryKey = "fin-daily-" + today;
  const periodLabel = "Diario · " + today + " (La Paz)";
  const breakdown = { by_center: byCenter, commissions_by_status: byStatus, income_count: income.length, period_days: PERIOD_DAYS };

  // --- Texto humano (Telegram + almacenado) ---
  const L = [];
  L.push("ONIA — Finanzas y Fondo (" + periodLabel + ")");
  L.push("");
  L.push("CAJA:");
  L.push("- Ingresos netos acumulados: " + bs(cashTotal));
  L.push("- Ingresos netos ultimos " + PERIOD_DAYS + "d: " + bs(cashPeriod) + " (" + income.length + " cobro(s))");
  L.push("- Fondo ONIA acumulado: " + bs(fundTotal));
  L.push("");
  L.push("COMISIONES (por estado):");
  L.push("- Estimado " + bs(byStatus.estimated) + " · Pendiente " + bs(byStatus.pending) + " · Aprobado " + bs(byStatus.approved) + " · Pagado " + bs(byStatus.paid));
  if (byStatus.blocked > 0 || byStatus.discounted > 0) {
    L.push("- Bloqueado " + bs(byStatus.blocked) + " · Descontado " + bs(byStatus.discounted));
  }
  L.push("");
  L.push("FISCAL (estimado, mes " + period + " — validar con contador):");
  L.push("- IVA credito del mes: " + bs(tax.iva_credito_bs) + " · saldo a favor: " + bs(tax.iva_saldo_favor_bs));
  if (tax.credito_fiscal_perdido_bs > 0) L.push("- Credito fiscal PERDIDO (gastos sin factura): " + bs(tax.credito_fiscal_perdido_bs) + " — pedi factura al NIT");
  if (tax.iue_be_retenciones_bs > 0) L.push("- Retencion IUE-BE (pagos al exterior): " + bs(tax.iue_be_retenciones_bs));
  L.push("- IUE estimado (ano): " + bs(tax.iue_estimado_bs) + (FISCAL.siat_emitting ? "" : " · SIAT en tramite: sin debito IVA formal aun"));
  if (income.length === 0 && comm.length === 0 && expenses.length === 0) {
    L.push("");
    L.push("(Aun sin ingresos/gastos registrados — la caja y el fiscal se llenan cuando cargues cobros y facturas de gasto.)");
  }
  if (anomalies.length) {
    L.push("");
    L.push("ANOMALIAS (" + anomalies.length + "):");
    for (const a of anomalies) L.push("- " + a.detail + (a.amount_bs ? " (" + bs(a.amount_bs) + ")" : ""));
  }
  L.push("");
  L.push("Read-only: informo y bloqueo, no muevo dinero ni apruebo pagos. Aprobas vos en ONIA Center.");
  const text = L.join("\n").slice(0, 3900);

  // --- Escribir finance_summary (upsert por summary_key) ---
  const row = {
    summary_key: summaryKey,
    scope: "daily",
    period_label: periodLabel,
    generated_at: new Date().toISOString(),
    generated_by: "agent-finance-fund",
    cash_total_bs: r2(cashTotal),
    cash_period_bs: r2(cashPeriod),
    income_count: income.length,
    commissions_by_status: byStatus,
    commissions_pending_bs: r2(byStatus.pending),
    commissions_blocked_bs: r2(byStatus.blocked),
    fund_total_bs: r2(fundTotal),
    expenses_pending_bs: r2(expensesPending),
    premium_pending_bs: r2(premiumPending),
    anomaly_count: anomalies.length,
    anomalies,
    breakdown,
    summary_text: text,
    tax_posture: tax,
    raw: { agent: "finance-fund-agent-v2", generated_at_ms: Date.now() },
  };
  await sb("finance_summary?on_conflict=summary_key", {
    method: "POST",
    headers: H({ Prefer: "resolution=merge-duplicates,return=minimal" }),
    body: JSON.stringify(row),
  });

  // --- Marcar el agente como 'ready' con el ultimo run ---
  await sb("operating_agents?agent_key=eq." + AGENT_KEY, {
    method: "PATCH",
    headers: H({ Prefer: "return=minimal" }),
    body: JSON.stringify({
      status: "ready",
      raw: {
        last_run: {
          at: new Date().toISOString(),
          summary_key: summaryKey,
          cash_total_bs: r2(cashTotal),
          fund_total_bs: r2(fundTotal),
          iva_saldo_favor_bs: tax.iva_saldo_favor_bs,
          credito_fiscal_perdido_bs: tax.credito_fiscal_perdido_bs,
          anomalies: anomalies.length,
          runtime: "finance-fund-agent-v2",
        },
      },
    }),
  });

  return {
    ok: true,
    summary_key: summaryKey,
    scope: "daily",
    cash_total_bs: r2(cashTotal),
    cash_period_bs: r2(cashPeriod),
    fund_total_bs: r2(fundTotal),
    commissions_by_status: byStatus,
    tax_posture: tax,
    anomalies,
    notify: anomalies.length > 0,
    text,
  };
}

main()
  .then(out)
  .catch((e) => out({ ok: false, notify: true, fatal: String(e.message || e).slice(0, 300) }));
