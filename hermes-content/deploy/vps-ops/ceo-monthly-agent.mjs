// ONIA — Agente CEO Mensual v1 (corre DENTRO del contenedor onia-center).
// READ-ONLY: agrega el ULTIMO MES (30 dias) del panel onia_center de forma determinista
// (leads, plata, entrega, contenido/ideas, desarrollo) y con esos numeros REALES pide a
// LiteLLM un informe estrategico CORTO en espanol (4-6 vinetas: donde esta ONIA, que
// funciono, que freno, foco del proximo mes, 1 riesgo). El LLM SOLO narra los numeros dados
// -> prohibido inventar cifras. Si LiteLLM falla, arma un fallback determinista con los mismos
// numeros para que SIEMPRE haya mensaje. Upsert de su fila en operating_agents (status ready)
// y guarda kpis en raw. Imprime {ok,text,notify,kpis}. n8n lo manda por Telegram el dia 1.
//
// Regla dura: READ-ONLY sobre todo. NO mueve plata, NO aprueba nada.
//
// Env (de onia-center): ONIA_CENTER_SUPABASE_URL, ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY
// Env (inyectadas):     LITELLM_BASE, LITELLM_KEY, CEO_AGENT_MODEL

const SB_URL = process.env.ONIA_CENTER_SUPABASE_URL;
const SB_KEY = process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY;
const LLM_BASE = process.env.LITELLM_BASE || "http://onia_selfhosted-litellm-1:4000/v1";
const LLM_KEY = process.env.LITELLM_KEY || "";
const MODEL = process.env.CEO_AGENT_MODEL || "gpt-4o-mini";
const AGENT_KEY = "agent_ceo_monthly";
const CENTER = process.env.ONIA_CENTER_URL || "https://center.onia.com.bo/onia-center";
const PERIOD_DAYS = 30;

// pipeline_status que cuentan como ganado / perdido / cerrado (para leads abiertos).
const WON = new Set(["ganado", "won"]);
const LOST = new Set(["perdido", "lost", "descartado"]);
const CLOSED = new Set(["ganado", "perdido", "cerrado", "descartado", "won", "lost", "closed"]);
// projects.status que cuentan como terminados / fuera (para "activos").
const PROJECT_DONE = new Set(["done", "completed", "archived", "cancelled", "canceled", "closed"]);

function out(o) {
  process.stdout.write(JSON.stringify(o) + "\n");
}
function H(extra) {
  return {
    apikey: SB_KEY,
    Authorization: "Bearer " + SB_KEY,
    "Accept-Profile": "onia_center",
    ...(extra || {}),
  };
}
// Lectura tolerante: una tabla vacia o inexistente devuelve [] y NO tumba el informe.
async function sbGet(path) {
  try {
    const r = await fetch(SB_URL + "/rest/v1/" + path, { headers: H() });
    if (!r.ok) return [];
    const t = await r.text();
    return t ? JSON.parse(t) : [];
  } catch (_e) {
    return [];
  }
}
async function sbUpsertAgent(row) {
  // La fila del agente YA existe seedeada y operating_agents tiene columnas NOT NULL sin default:
  // un INSERT/upsert violaria NOT NULL (23502). Se PARCHEA la fila existente (como finance-fund).
  // No fatal: si el panel-write falla, NO se descarta el informe (requisito: SIEMPRE haya mensaje).
  const { agent_key, status, cadence, raw } = row;
  const body = {};
  if (status !== undefined) body.status = status;
  if (cadence !== undefined) body.cadence = cadence;
  if (raw !== undefined) body.raw = raw;
  try {
    const r = await fetch(SB_URL + "/rest/v1/operating_agents?agent_key=eq." + (agent_key || AGENT_KEY), {
      method: "PATCH",
      headers: H({ "Content-Profile": "onia_center", "Content-Type": "application/json", Prefer: "return=minimal" }),
      body: JSON.stringify(body),
    });
    if (!r.ok) console.warn("patch operating_agents " + r.status + ": " + (await r.text()).slice(0, 180));
  } catch (e) {
    console.warn("patch operating_agents error: " + String(e.message || e).slice(0, 120));
  }
}

const num = (n) => Number(n) || 0;
const r2 = (n) => Math.round(num(n) * 100) / 100;
const bs = (n) => "Bs. " + r2(n).toFixed(2);
const lc = (v) => String(v == null ? "" : v).toLowerCase();

// Fecha La Paz (UTC-4).
function laPazDate(offsetDays = 0) {
  const now = new Date(Date.now() - 4 * 3600 * 1000 + offsetDays * 86400000);
  return now.toISOString().slice(0, 10);
}
function laPazMonthLabel() {
  return new Date(Date.now() - 4 * 3600 * 1000).toLocaleDateString("es-BO", { month: "long", year: "numeric" });
}

// --- Agregacion determinista del ultimo mes -------------------------------------
async function aggregate() {
  const periodStartISO = new Date(Date.now() - PERIOD_DAYS * 86400000).toISOString();

  // Leads: nuevos en el mes, abiertos (estado actual), ganados / perdidos (estado actual).
  const leads = await sbGet("leads?select=lead_key,pipeline_status,created_at&limit=5000");
  let leadsNuevos = 0;
  let leadsAbiertos = 0;
  let leadsGanados = 0;
  let leadsPerdidos = 0;
  for (const l of leads) {
    if (l.created_at && l.created_at >= periodStartISO) leadsNuevos++;
    const st = lc(l.pipeline_status);
    if (!CLOSED.has(st)) leadsAbiertos++;
    if (WON.has(st)) leadsGanados++;
    if (LOST.has(st)) leadsPerdidos++;
  }

  // Plata: ingresos netos del periodo (paid_at o created_at en el mes).
  const income = await sbGet("income_entries?select=net_amount_bs,paid_at,created_at&limit=5000");
  let ingresosNetosPeriodo = 0;
  let cobrosPeriodo = 0;
  for (const r of income) {
    const when = r.paid_at || r.created_at;
    if (when && when >= periodStartISO) {
      ingresosNetosPeriodo += num(r.net_amount_bs);
      cobrosPeriodo++;
    }
  }

  // Comisiones por estado + Fondo ONIA (fund_allocation).
  const comm = await sbGet("payment_commissions?select=status,payment_type,calculated_amount_bs&limit=5000");
  const byStatus = { estimated: 0, pending: 0, approved: 0, paid: 0, blocked: 0, discounted: 0 };
  let fundFromComm = 0;
  for (const c of comm) {
    const amt = num(c.calculated_amount_bs);
    byStatus[c.status] = r2((byStatus[c.status] || 0) + amt);
    if (c.payment_type === "fund_allocation") fundFromComm += amt;
  }
  const comisionesPorCobrar = r2(byStatus.estimated + byStatus.pending + byStatus.approved);
  const comisionesPagadas = r2(byStatus.paid);

  // Finanzas: ultima foto (fondo + postura fiscal del mes).
  const finRows = await sbGet(
    "finance_summary?select=cash_total_bs,cash_period_bs,commissions_pending_bs,fund_total_bs,anomaly_count,tax_posture,generated_at&order=generated_at.desc&limit=1",
  );
  const fin = finRows[0] || null;
  const fondoOniaBs = fin && fin.fund_total_bs != null ? r2(fin.fund_total_bs) : r2(fundFromComm);
  const cajaTotalBs = fin && fin.cash_total_bs != null ? r2(fin.cash_total_bs) : null;
  const anomalias = fin && fin.anomaly_count != null ? Number(fin.anomaly_count) : 0;

  // Postura fiscal del mes (resumen 1-2 lineas) desde finance_summary.tax_posture.
  let fiscal = null;
  const tax = fin && fin.tax_posture && typeof fin.tax_posture === "object" ? fin.tax_posture : null;
  if (tax) {
    fiscal = {
      periodo: tax.period || null,
      iva_a_pagar_bs: r2(tax.iva_a_pagar_bs),
      iva_saldo_favor_bs: r2(tax.iva_saldo_favor_bs),
      it_bs: r2(tax.it_bs),
      iue_estimado_bs: r2(tax.iue_estimado_bs),
      proximo_vencimiento: tax.proximo_vencimiento || null,
      proximo_vencimiento_periodo: tax.proximo_vencimiento_periodo || null,
    };
  }

  // Entrega: proyectos activos + cuantos con proximo paso definido.
  const projects = await sbGet("projects?select=project_key,status,next_step,product_line&limit=2000");
  let proyectosActivos = 0;
  let proyectosConNextStep = 0;
  for (const p of projects) {
    if (PROJECT_DONE.has(lc(p.status))) continue;
    proyectosActivos++;
    if (p.next_step && String(p.next_step).trim()) proyectosConNextStep++;
  }

  // Contenido / ideas: borradores aprobados vs pendientes + ideas en inbox.
  const reviews = await sbGet("review_queue?select=review_key,status,created_at&limit=5000");
  let borradoresPendientes = 0;
  let borradoresAprobadosMes = 0;
  for (const rv of reviews) {
    const st = lc(rv.status);
    if (st === "pending") borradoresPendientes++;
    if ((st === "approved" || st === "aprobado") && rv.created_at && rv.created_at >= periodStartISO) borradoresAprobadosMes++;
  }
  const ideas = await sbGet("idea_inbox?select=idea_key,status,created_at&limit=2000");
  let ideasInbox = 0;
  let ideasNuevasMes = 0;
  for (const i of ideas) {
    if (lc(i.status) === "inbox") ideasInbox++;
    if (i.created_at && i.created_at >= periodStartISO) ideasNuevasMes++;
  }

  // Desarrollo: ultimo dev_pulse (si existe).
  const pulseRows = await sbGet("dev_pulse?select=total_commits,active_lanes,summary_text,generated_at&order=generated_at.desc&limit=1");
  const pulse = pulseRows[0]
    ? {
        total_commits: Number(pulseRows[0].total_commits) || 0,
        active_lanes: Number(pulseRows[0].active_lanes) || 0,
        summary_text: String(pulseRows[0].summary_text || "").slice(0, 400),
        generated_at: pulseRows[0].generated_at || null,
      }
    : null;

  return {
    period: { start: laPazDate(-PERIOD_DAYS), end: laPazDate(0), days: PERIOD_DAYS, label: laPazMonthLabel() },
    leads: { nuevos: leadsNuevos, abiertos: leadsAbiertos, ganados: leadsGanados, perdidos: leadsPerdidos, total: leads.length },
    plata: {
      ingresos_netos_periodo_bs: r2(ingresosNetosPeriodo),
      cobros_periodo: cobrosPeriodo,
      caja_total_bs: cajaTotalBs,
      comisiones_por_cobrar_bs: comisionesPorCobrar,
      comisiones_pagadas_bs: comisionesPagadas,
      comisiones_bloqueadas_bs: r2(byStatus.blocked),
      fondo_onia_bs: fondoOniaBs,
      anomalias: anomalias,
    },
    fiscal,
    entrega: { proyectos_activos: proyectosActivos, con_next_step: proyectosConNextStep, proyectos_total: projects.length },
    contenido: { borradores_pendientes: borradoresPendientes, borradores_aprobados_mes: borradoresAprobadosMes, ideas_inbox: ideasInbox, ideas_nuevas_mes: ideasNuevasMes },
    desarrollo: pulse,
  };
}

// --- Narracion con LiteLLM (solo sobre los numeros; prohibido inventar) ----------
async function narrate(kpis) {
  const sys =
    "Eres el CEO estratega de ONIA, agencia de IA practica para negocios de Bolivia. " +
    "Escribis un informe mensual corto, directo y honesto, para Sergio (fundador). " +
    "REGLA DURA: narras SOLO con los numeros del contexto; PROHIBIDO inventar cifras, metricas o hechos " +
    "que no esten en los datos. Si un numero es 0 o falta, decilo tal cual. Sin humo, sin markdown. " +
    "Devolve 4 a 6 vinetas, cada una en su propia linea empezando con '- ', cubriendo en este orden: " +
    "(1) donde esta ONIA este mes, (2) que funciono, (3) que freno, (4) el foco del proximo mes, (5) 1 riesgo a vigilar.";
  const user =
    "Estos son los numeros REALES del ultimo mes de ONIA (panel onia_center). Redacta el informe SOLO con esto:\n" +
    JSON.stringify(kpis) +
    "\nResponde SOLO las vinetas, una por linea, cada una empezando con '- '. Nada mas.";

  const res = await fetch(LLM_BASE + "/chat/completions", {
    method: "POST",
    headers: { Authorization: "Bearer " + LLM_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.4,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error("llm " + res.status + ": " + JSON.stringify(data).slice(0, 200));
  let content = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "";
  content = content.replace(/```[a-z]*\s*/gi, "").replace(/```/g, "").trim();
  const bullets = content
    .split("\n")
    .map((x) => x.trim())
    .filter((x) => x)
    .map((x) => (x.startsWith("-") || x.startsWith("•") ? x : "- " + x));
  if (!bullets.length) throw new Error("llm sin vinetas");
  return bullets.slice(0, 6).join("\n");
}

// --- Fallback determinista (sin LLM): SIEMPRE hay mensaje ------------------------
function fallbackBody(k) {
  const L = [];
  L.push(
    "- Estado del mes: " + k.leads.nuevos + " lead(s) nuevo(s), " + k.leads.abiertos + " abierto(s) en el CRM; " +
      "ingresos netos del periodo " + bs(k.plata.ingresos_netos_periodo_bs) + " (" + k.plata.cobros_periodo + " cobro(s)).",
  );
  L.push(
    "- Funciono: " + (k.leads.ganados > 0 ? k.leads.ganados + " lead(s) ganado(s)" : "aun sin cierres registrados") +
      "; " + k.entrega.proyectos_activos + " proyecto(s) activo(s) (" + k.entrega.con_next_step + " con proximo paso definido).",
  );
  L.push(
    "- Freno: " + (k.leads.perdidos > 0 ? k.leads.perdidos + " lead(s) perdido(s); " : "") +
      k.contenido.borradores_pendientes + " borrador(es) esperando aprobacion" +
      (k.plata.comisiones_bloqueadas_bs > 0 ? "; comisiones bloqueadas " + bs(k.plata.comisiones_bloqueadas_bs) : "") +
      (k.plata.anomalias > 0 ? "; " + k.plata.anomalias + " anomalia(s) de plata" : "") + ".",
  );
  L.push(
    "- Foco proximo mes: cerrar los " + k.leads.abiertos + " lead(s) abierto(s), despachar " +
      k.contenido.borradores_pendientes + " borrador(es) y " + k.contenido.ideas_inbox + " idea(s) en inbox.",
  );
  if (k.fiscal) {
    L.push(
      "- Riesgo a vigilar (fiscal): IVA a pagar " + bs(k.fiscal.iva_a_pagar_bs) + ", IT " + bs(k.fiscal.it_bs) +
        ", IUE estimado " + bs(k.fiscal.iue_estimado_bs) +
        (k.fiscal.proximo_vencimiento ? "; proximo vencimiento " + k.fiscal.proximo_vencimiento : "") + ".",
    );
  } else {
    L.push("- Riesgo a vigilar: sin foto fiscal reciente en el panel; cargar cobros y gastos para estimar IVA/IT/IUE.");
  }
  return L.join("\n");
}

function buildText(k, body, viaLLM) {
  const L = [];
  L.push("ONIA - Informe CEO Mensual (" + k.period.label + ")");
  L.push("Periodo: ultimos " + k.period.days + " dias (" + k.period.start + " a " + k.period.end + ", La Paz)");
  L.push("");
  L.push(body);
  L.push("");
  L.push("Numeros del mes:");
  L.push("- Leads: " + k.leads.nuevos + " nuevo(s) / " + k.leads.abiertos + " abierto(s) / " + k.leads.ganados + " ganado(s) / " + k.leads.perdidos + " perdido(s)");
  L.push("- Plata: ingresos netos " + bs(k.plata.ingresos_netos_periodo_bs) + " · comisiones por cobrar " + bs(k.plata.comisiones_por_cobrar_bs) + " · Fondo ONIA " + bs(k.plata.fondo_onia_bs));
  if (k.fiscal) {
    L.push("- Fiscal (mes " + (k.fiscal.periodo || k.period.end.slice(0, 7)) + "): IVA a pagar " + bs(k.fiscal.iva_a_pagar_bs) + " · IT " + bs(k.fiscal.it_bs) + " · IUE est. " + bs(k.fiscal.iue_estimado_bs) + (k.fiscal.proximo_vencimiento ? " · vence " + k.fiscal.proximo_vencimiento : ""));
  }
  L.push("- Entrega: " + k.entrega.proyectos_activos + " proyecto(s) activo(s) (" + k.entrega.con_next_step + " con proximo paso)");
  L.push("- Contenido: " + k.contenido.borradores_pendientes + " borrador(es) pendiente(s) · " + k.contenido.ideas_inbox + " idea(s) en inbox");
  if (k.desarrollo) L.push("- Desarrollo: " + k.desarrollo.total_commits + " commit(s), " + k.desarrollo.active_lanes + " carril(es) activo(s)");
  L.push("");
  L.push("Panel: " + CENTER);
  L.push(viaLLM ? "Informe redactado sobre datos reales del panel (read-only)." : "Informe determinista (LiteLLM no disponible) sobre datos reales del panel (read-only).");
  return L.join("\n").slice(0, 3900);
}

async function main() {
  if (!SB_URL || !SB_KEY) throw new Error("faltan credenciales Supabase de onia-center");

  const kpis = await aggregate();

  // Narracion: LLM si hay key; si falla o no hay, fallback determinista (siempre hay mensaje).
  let body = "";
  let viaLLM = false;
  if (LLM_KEY) {
    try {
      body = await narrate(kpis);
      viaLLM = true;
    } catch (_e) {
      body = fallbackBody(kpis);
      viaLLM = false;
    }
  } else {
    body = fallbackBody(kpis);
  }

  const text = buildText(kpis, body, viaLLM);

  // Upsert de la fila del agente: status ready + kpis en raw.
  await sbUpsertAgent({
    agent_key: AGENT_KEY,
    agent_name: "CEO Mensual",
    status: "ready",
    cadence: "monthly",
    raw: {
      live: true,
      cadence_label: "Mensual (dia 1)",
      last_run: new Date().toISOString(),
      via_llm: viaLLM,
      runtime: "ceo-monthly-agent-v1",
      kpis,
    },
  });

  return { ok: true, text, notify: true, viaLLM, kpis };
}

main()
  .then(out)
  .catch((e) => out({ ok: false, notify: true, text: "CEO Mensual ONIA - ERROR: " + String(e.message || e).slice(0, 200) }));
