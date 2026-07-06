// ONIA — Inserta un lead en el CRM (onia_center.leads). Corre DENTRO de onia-center
// (docker exec), que tiene la key de Supabase en su env. Lee el lead de LEAD_B64
// (base64 de un JSON {company, contact, channel, source, notes, service}).
// Espejo del insert valido de createOniaCenterEntity('lead') en onia-center-store.ts.
// Imprime {ok, lead_key} o {ok:false, error}.

const SB_URL = process.env.ONIA_CENTER_SUPABASE_URL;
const SB_KEY = process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY;

function out(o) { process.stdout.write(JSON.stringify(o) + "\n"); }
function headers() {
  return {
    apikey: SB_KEY, Authorization: "Bearer " + SB_KEY,
    "Accept-Profile": "onia_center", "Content-Profile": "onia_center",
    "Content-Type": "application/json", prefer: "return=representation",
  };
}

(async () => {
  try {
    if (!SB_URL || !SB_KEY) throw new Error("faltan credenciales Supabase de onia-center");
    const b64 = process.env.LEAD_B64 || "";
    if (!b64) throw new Error("falta LEAD_B64");
    const lead = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
    if (!lead.company) throw new Error("el lead necesita 'company'");

    const lead_key =
      "lead-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
    const row = {
      lead_key,
      company_name: String(lead.company).slice(0, 300),
      business_type: lead.business_type || "pendiente",
      public_contact: lead.contact || null,
      channel: lead.channel || "Manual",
      source: lead.source || "manual-feed",
      contact_permission: "pending",
      origin_role_key: "sergio",
      owner_role_key: "sergio",
      pipeline_status: lead.pipeline_status || "Nuevo",
      suggested_service_key: lead.service || null,
      priority: lead.priority || "media",
      private_notes: lead.notes || null,
      raw: { ...lead, addedBy: "onia-feed" },
    };

    const res = await fetch(SB_URL + "/rest/v1/leads?select=lead_key,company_name,pipeline_status", {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(row),
    });
    const text = await res.text();
    if (!res.ok) throw new Error("supabase " + res.status + ": " + text.slice(0, 220));
    const created = JSON.parse(text)[0] || { lead_key };
    out({ ok: true, lead_key: created.lead_key, company: created.company_name });
  } catch (e) {
    out({ ok: false, error: String(e.message || e).slice(0, 260) });
  }
})();
