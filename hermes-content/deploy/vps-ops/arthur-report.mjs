// ONIA — Reporte diario Sergio + Arthur (trial 60 dias). Corre DENTRO de onia-center.
// (1) Tareas del dia para Sergio y para Arthur, derivadas de las obligaciones del
//     acuerdo (ONIA_ACUERDO_ARTHUR_FUENTES_60_DIAS) + estado vivo del CRM.
// (2) Verificacion de ganancias de Arthur: suma payment_commissions por estado +
//     ventas que trajo + progreso vs metas del trial.
// Determinista (sin LLM). Devuelve { ok, text } con el reporte para Telegram.
// Regla: solo suma lo REGISTRADO en ONIA Center (no re-calcula el % por proyecto:
// el nivel de intervencion lo decide Sergio en el cierre).

const SB_URL = process.env.ONIA_CENTER_SUPABASE_URL;
const SB_KEY = process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY;
const TRIAL_START = new Date("2026-06-20T00:00:00Z");
const TRIAL_DAYS = 60;

function out(o) { process.stdout.write(JSON.stringify(o) + "\n"); }
function H() { return { apikey: SB_KEY, Authorization: "Bearer " + SB_KEY, "Accept-Profile": "onia_center" }; }
async function q(path) {
  const res = await fetch(SB_URL + "/rest/v1/" + path, { headers: H() });
  if (!res.ok) throw new Error("sb " + res.status + ": " + (await res.text()).slice(0, 160));
  return res.json();
}
async function count(table, filter) {
  const res = await fetch(SB_URL + "/rest/v1/" + table + "?select=id" + (filter ? "&" + filter : "") + "&limit=1",
    { headers: { ...H(), Prefer: "count=exact", "Range-Unit": "items", Range: "0-0" } });
  return parseInt((res.headers.get("content-range") || "*/0").split("/")[1] || "0", 10);
}
const bs = (n) => "Bs. " + (Number(n) || 0).toFixed(2);

(async () => {
  try {
    if (!SB_URL || !SB_KEY) throw new Error("faltan credenciales Supabase");
    const today = new Date();
    const day = Math.floor((today - TRIAL_START) / 86400000) + 1;
    const dow = today.getUTCDay(); // 0=dom .. 1=lun .. 5=vie

    // --- Ganancias Arthur: payment_commissions por estado ---
    const comm = await q("payment_commissions?select=status,payment_type,calculated_amount_bs,advance_amount_bs,monthly_close_amount_bs&actor_role_key=eq.arthur&limit=1000");
    const byStatus = { estimated: 0, pending: 0, approved: 0, paid: 0, blocked: 0, discounted: 0 };
    for (const c of comm) byStatus[c.status] = (byStatus[c.status] || 0) + Number(c.calculated_amount_bs || 0);
    // ventas que trajo Arthur
    const income = await q("income_entries?select=net_amount_bs,service_key&seller_role_key=eq.arthur&limit=1000");
    const arthurSales = income.reduce((a, x) => a + Number(x.net_amount_bs || 0), 0);

    // --- Progreso del trial (metas del acuerdo) ---
    const leadsTot = await count("leads");
    const ventasCobradas = await count("income_entries");
    const propuestasPend = await count("review_queue", "status=eq.pending");
    const tareasArthur = await count("tasks", "assigned_role_key=eq.arthur&status=eq.todo");
    const leadsSinSeguir = await count("leads", "pipeline_status=eq.Nuevo");

    // --- Armar reporte ---
    const L = [];
    L.push(`ONIA — Plan del dia + Arthur (trial dia ${day}/${TRIAL_DAYS})`);
    L.push("");
    L.push("SERGIO hoy:");
    if (dow === 1) L.push("- Sesion de PRIORIDADES de la semana (lunes).");
    if (dow === 5) L.push("- Revision comercial/operativa + control semanal de caja (viernes).");
    if (propuestasPend > 0) L.push(`- Revisar/aprobar ${propuestasPend} borrador(es) en Revisiones.`);
    L.push("- 2 videos de autoridad ONIA (meta semanal), QA de entregas activas.");
    L.push("- Aprobar precios/propuestas antes de enviar; aprobar comisiones con evidencia.");
    L.push("");
    L.push("ARTHUR hoy (de sus minimos semanales / 6 dias):");
    L.push("- Prospectar ~6 leads nuevos completos (rubro, ciudad, contacto, dolor, oferta).");
    L.push(`- Seguir ${Math.max(3, leadsSinSeguir)} lead(s); mantener el CRM al dia.`);
    L.push("- ~4 contactos/mensajes reales + registrar nota tras cada llamada.");
    L.push("- Avanzar 1 propuesta/auditoria/diagnostico; 1 video ONIA/Nuvia; 1 mejora interna.");
    if (tareasArthur > 0) L.push(`- Tiene ${tareasArthur} tarea(s) asignada(s) pendientes en el panel.`);
    L.push("");
    L.push("GANANCIAS ARTHUR (lo registrado en ONIA Center):");
    L.push(`- Estimado ${bs(byStatus.estimated)} · Pendiente ${bs(byStatus.pending)} · Aprobado ${bs(byStatus.approved)} · Pagado ${bs(byStatus.paid)}`);
    L.push(`- Ventas que trajo (neto): ${bs(arthurSales)}`);
    if (comm.length === 0) L.push("- (Aun sin comisiones registradas — se llenan cuando cargues cobros/comisiones en Ingresos.)");
    L.push("");
    L.push(`PROGRESO TRIAL: leads ${leadsTot}/200 · ventas cobradas ${ventasCobradas}/6-8 web · recurrentes -/2-4`);
    L.push("Regla: no cuenta comision sin cobro real, CRM completo y evidencia.");

    out({ ok: true, day, text: L.join("\n").slice(0, 3900),
      earnings: byStatus, arthurSales, leadsTot, ventasCobradas });
  } catch (e) {
    out({ ok: false, error: String(e.message || e).slice(0, 260) });
  }
})();
