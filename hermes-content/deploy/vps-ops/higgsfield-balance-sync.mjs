// ONIA — Sync del balance de créditos Higgsfield al panel (corre DENTRO de onia-center vía
// docker exec). Vuelve REAL el balance que el Estudio de Contenido mostraba hardcodeado.
// El NÚMERO lo provee una sesión Claude Code que tiene el MCP de Higgsfield (lee el balance
// vivo) y lo pasa por env/argv; este script SOLO escribe (UPSERT PostgREST a provider_credits).
// El panel LEE (getHiggsfieldBalance en live-runtime). Idempotente: una fila por provider.
//
// Env (de onia-center, mismos fallbacks que getLiveConfig en live-runtime):
//   ONIA_CENTER_SUPABASE_URL | WEB_FACTORY_SUPABASE_URL | SUPABASE_URL
//   ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY | WEB_FACTORY_SUPABASE_SERVICE_ROLE_KEY
//     | SUPABASE_SERVICE_ROLE_KEY | SUPABASE_SERVICE_KEY
//   ONIA_CENTER_SUPABASE_SCHEMA (default 'onia_center')
// Datos:  CREDITS (env) | argv[0]  ·  PLAN (env) | argv[1]  (default 'ultra')
//   ej:  CREDITS=2354.22 PLAN=ultra node higgsfield-balance-sync.mjs
//   ej:  node higgsfield-balance-sync.mjs 2354.22 ultra

const SB_URL =
  process.env.ONIA_CENTER_SUPABASE_URL ||
  process.env.WEB_FACTORY_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "";
const SB_KEY =
  process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.WEB_FACTORY_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  "";
const SCHEMA = process.env.ONIA_CENTER_SUPABASE_SCHEMA || "onia_center";

const CREDITS_RAW = process.env.CREDITS ?? process.argv[2];
const PLAN = process.env.PLAN ?? process.argv[3] ?? "ultra";

function out(o) {
  process.stdout.write(JSON.stringify(o) + "\n");
}

async function main() {
  if (!SB_URL || !SB_KEY) {
    throw new Error("faltan credenciales Supabase de onia-center (URL/SERVICE_ROLE_KEY)");
  }
  const credits = Number(CREDITS_RAW);
  if (!Number.isFinite(credits) || credits < 0) {
    throw new Error(`CREDITS no numérico o negativo: ${CREDITS_RAW ?? "vacío"}`);
  }

  const body = {
    provider: "higgsfield",
    credits,
    plan: PLAN,
    synced_at: new Date().toISOString(),
    raw: { credits, plan: PLAN, source: "mcp_higgsfield", synced_by: "higgsfield-balance-sync" },
  };

  const res = await fetch(SB_URL.replace(/\/$/, "") + "/rest/v1/provider_credits", {
    method: "POST",
    headers: {
      apikey: SB_KEY,
      Authorization: "Bearer " + SB_KEY,
      "Content-Profile": SCHEMA,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("upsert provider_credits " + res.status + ": " + (await res.text()).slice(0, 200));
  }

  return { ok: true, provider: "higgsfield", credits, plan: PLAN };
}

main()
  .then(out)
  .catch((e) => out({ ok: false, fatal: String(e.message || e).slice(0, 300) }));
