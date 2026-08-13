// ONIA — pruebas del ALTA DE UN CLIENTE EN CHATWOOT.
//   node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"
//
// El Chatwoot de mentira de acá abajo NO es un mock de conveniencia: replica las formas REALES
// leídas del fuente de la instalación (Chatwoot 4.12.1 en el VPS, 2026-08-13) —
//   GET  /api/v1/accounts/:id/agents               -> array pelado
//   GET  /api/v1/accounts/:id/inboxes              -> { payload: [...] }
//   GET  /api/v1/accounts/:id/inbox_members/:inbox -> { payload: [...usuarios] }
//   POST /api/v1/accounts/:id/inbox_members        -> ADITIVO (add_members(user_ids - actuales))
//   GET  /api/v1/accounts/:id/conversations/meta   -> { meta: { all_count } }
// Sin red real: el fetch se inyecta siempre.
//
// Lo que se cubre y por qué:
//   1. EL BUG QUE MOTIVÓ TODO: si el agente NO queda en inbox_members, el alta tiene que FALLAR
//      ruidoso. El fake puede simular el peor caso real: POST 200 y la fila que no queda.
//   2. Cero bandejas => ERROR (aunque todo lo demás haya salido bien).
//   3. Idempotencia: dos corridas seguidas = mismo estado, cero duplicados.
//   4. No destructivo: nunca PATCH ni DELETE de miembros; los que ya estaban siguen estando.
//   5. --dry-run no escribe NADA, y aun así predice si alguien quedaría sin bandejas.
//   6. Sin token de plataforma no se crea ninguna cuenta a ciegas.

import test from "node:test";
import assert from "node:assert/strict";

import {
  AVISO_RELOGIN,
  auditVisibility,
  createChatwootAdminApi,
  onboardClient,
  parseAgentSpec,
  parseArgs,
  planOnboarding,
  renderHuman,
} from "./chatwoot-onboard.mjs";

const ADMIN_TOKEN = "admin-token-de-mentira";

/**
 * Chatwoot de mentira, con estado. `options.dropMemberWrites` simula el peor caso: el POST
 * responde 200 pero la membresía no queda escrita (un 200 mentiroso es exactamente lo que produce
 * la pantalla en blanco sin ningún error).
 */
function fakeChatwoot(options = {}) {
  const state = {
    me: { id: 2, name: "OnIA", email: "onia@onia.com.bo" },
    agents: [{ id: 2, name: "OnIA", email: "onia@onia.com.bo", role: "administrator" }],
    inboxes: [{ id: 5, name: "Onia WhatsApp", channel_type: "Channel::Whatsapp" }],
    members: new Map([[5, new Set([3])]]), // el bot (3) ya estaba: no se lo puede sacar
    conversations: new Map([[5, 7]]),
    nextId: 10,
    calls: [],
    dropMemberWrites: Boolean(options.dropMemberWrites),
    platform: options.platform || null, // { token, accounts: [] }
    ...options.seed,
  };

  const json = (status, data) => ({
    ok: status < 400,
    status,
    text: async () => JSON.stringify(data ?? null),
  });

  const fetchImpl = async (url, init = {}) => {
    const method = init.method || "GET";
    const { pathname, searchParams } = new URL(url);
    const body = init.body ? JSON.parse(init.body) : null;
    const token = init.headers?.api_access_token;
    state.calls.push(`${method} ${pathname}`);

    if (pathname.startsWith("/platform/")) {
      if (!state.platform || token !== state.platform.token) return json(401, { error: "unauthorized" });
      if (method === "GET" && pathname === "/platform/api/v1/accounts") return json(200, state.platform.accounts);
      if (method === "POST" && pathname === "/platform/api/v1/accounts") {
        const account = { id: (state.nextId += 1), name: body.name };
        state.platform.accounts.push(account);
        return json(200, account);
      }
      if (method === "POST" && /account_users$/.test(pathname)) return json(200, {});
      return json(404, { error: "not found" });
    }

    if (token !== ADMIN_TOKEN) return json(401, { error: "unauthorized" });
    if (pathname === "/api/v1/profile") return json(200, state.me);

    const match = pathname.match(/^\/api\/v1\/accounts\/(\d+)\/(.+)$/);
    if (!match) return json(404, { error: "not found" });
    const rest = match[2];

    if (rest === "agents" && method === "GET") return json(200, state.agents);
    if (rest === "agents" && method === "POST") {
      if (state.agents.some((agent) => agent.email === body.email)) return json(422, { error: "email taken" });
      const agent = { id: (state.nextId += 1), name: body.name, email: body.email, role: body.role };
      state.agents.push(agent);
      return json(200, agent);
    }
    if (rest === "inboxes" && method === "GET") return json(200, { payload: state.inboxes });
    if (rest === "inboxes" && method === "POST") {
      const inbox = { id: (state.nextId += 1), name: body.name, channel_type: `Channel::${body.channel.type}` };
      state.inboxes.push(inbox);
      state.members.set(inbox.id, new Set());
      state.conversations.set(inbox.id, 0);
      return json(200, inbox);
    }
    if (rest.startsWith("inbox_members/") && method === "GET") {
      const inboxId = Number(rest.split("/")[1]);
      const ids = state.members.get(inboxId) || new Set();
      return json(200, { payload: state.agents.filter((agent) => ids.has(agent.id)) });
    }
    if (rest === "inbox_members" && method === "POST") {
      const set = state.members.get(Number(body.inbox_id)) || new Set();
      // Aditivo, igual que el Chatwoot real: nunca saca a nadie.
      if (!state.dropMemberWrites) for (const id of body.user_ids) set.add(id);
      state.members.set(Number(body.inbox_id), set);
      return json(200, { payload: [] });
    }
    if (rest.startsWith("conversations/meta")) {
      const inboxId = Number(searchParams.get("inbox_id"));
      return json(200, { meta: { all_count: state.conversations.get(inboxId) || 0 } });
    }
    return json(404, { error: "not found" });
  };

  return { state, fetchImpl };
}

function apiFor(fake, extra = {}) {
  return createChatwootAdminApi({
    baseUrl: "https://chatwoot.test",
    token: ADMIN_TOKEN,
    platformToken: extra.platformToken ?? "",
    fetch: fake.fetchImpl,
  });
}

const SPEC = {
  accountId: "2",
  inboxName: "Onia WhatsApp",
  inboxType: "whatsapp",
  agents: [{ name: "Juan", email: "juan@cliente.bo", role: "agent" }],
};

// ---------------------------------------------------------------------------
// 1. EL BUG: la membresía que no queda tiene que hacer FALLAR el alta, ruidoso
// ---------------------------------------------------------------------------

test("si el agente NO queda en inbox_members, el alta FALLA ruidoso (el bug del 13-ago)", async () => {
  const fake = fakeChatwoot({ dropMemberWrites: true });
  const result = await onboardClient(SPEC, { api: apiFor(fake) });

  assert.equal(result.ok, false, "un alta que deja al cliente sin membresia NO puede reportar exito");
  assert.ok(
    result.errors.some((error) => error.includes("MEMBRESIA NO VERIFICADA")),
    `esperaba el error de membresia, hubo: ${JSON.stringify(result.errors)}`,
  );
  // Y además dice la consecuencia en castellano, no un código.
  assert.ok(result.errors.join(" ").includes("bandeja VACIA"));
  assert.ok(result.members.some((member) => member.action === "MISSING"));
});

test("la verificación LEE de vuelta: no alcanza con que el POST devuelva 200", async () => {
  const fake = fakeChatwoot({ dropMemberWrites: true });
  await onboardClient(SPEC, { api: apiFor(fake) });
  const lecturas = fake.state.calls.filter((call) => call.startsWith("GET /api/v1/accounts/2/inbox_members/"));
  const escrituras = fake.state.calls.filter((call) => call === "POST /api/v1/accounts/2/inbox_members");
  assert.equal(escrituras.length, 1);
  assert.ok(lecturas.length >= 2, "tiene que leer los miembros ANTES y DESPUES de escribir");
});

// ---------------------------------------------------------------------------
// 2. Cero bandejas => ERROR
// ---------------------------------------------------------------------------

test("un usuario que ve CERO bandejas es un ERROR, no un exito silencioso", () => {
  const filas = auditVisibility({
    users: [{ id: 9, email: "sergio@onia.bo", role: "agent" }],
    inboxes: [{ id: 5, name: "Onia WhatsApp" }],
    membersByInbox: new Map([[5, new Set([3])]]),
    conversationsByInbox: new Map([[5, 10]]),
  });
  assert.equal(filas[0].ok, false);
  assert.equal(filas[0].inboxCount, 0);
  assert.equal(filas[0].conversations, 0);
  assert.ok(renderHuman({ ...vacio(), visibility: filas }).includes("CERO BANDEJAS"));
});

test("el chequeo final cuenta bandejas Y conversaciones de cada usuario", async () => {
  const fake = fakeChatwoot();
  const result = await onboardClient(SPEC, { api: apiFor(fake) });
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  const juan = result.visibility.find((row) => row.email === "juan@cliente.bo");
  assert.equal(juan.inboxCount, 1);
  assert.equal(juan.conversations, 7);
  const sergio = result.visibility.find((row) => row.userId === 2);
  assert.equal(sergio.inboxCount, 1);
});

test("un admin sin membresia igual se marca ERROR (el incidente fue con un admin)", () => {
  const filas = auditVisibility({
    users: [{ id: 2, email: "onia@onia.com.bo", role: "administrator" }],
    inboxes: [{ id: 5, name: "Onia WhatsApp" }],
    membersByInbox: new Map([[5, new Set()]]),
    conversationsByInbox: new Map([[5, 3]]),
  });
  assert.equal(filas[0].ok, false);
  // Pero no se miente sobre lo que dice el fuente: un admin "vería" todas.
  assert.equal(filas[0].visibleCount, 1);
});

// ---------------------------------------------------------------------------
// 3. Idempotencia
// ---------------------------------------------------------------------------

test("dos corridas seguidas = mismo estado, cero duplicados", async () => {
  const fake = fakeChatwoot();
  const primera = await onboardClient(SPEC, { api: apiFor(fake) });
  assert.equal(primera.ok, true, JSON.stringify(primera.errors));

  const snapshot = {
    agents: fake.state.agents.length,
    inboxes: fake.state.inboxes.length,
    members: [...(fake.state.members.get(5) || [])].sort(),
  };

  const segunda = await onboardClient(SPEC, { api: apiFor(fake) });
  assert.equal(segunda.ok, true, JSON.stringify(segunda.errors));
  assert.equal(fake.state.agents.length, snapshot.agents, "no puede crear el agente dos veces");
  assert.equal(fake.state.inboxes.length, snapshot.inboxes);
  assert.deepEqual([...(fake.state.members.get(5) || [])].sort(), snapshot.members);

  assert.ok(segunda.agents.every((agent) => agent.action === "reused"));
  assert.ok(segunda.members.every((member) => member.action === "already"));
  // Y en la segunda ni siquiera intenta escribir miembros.
  const escrituras = fake.state.calls.filter((call) => call === "POST /api/v1/accounts/2/inbox_members");
  assert.equal(escrituras.length, 1);
});

// ---------------------------------------------------------------------------
// 4. No destructivo
// ---------------------------------------------------------------------------

test("no saca a nadie: el bot que ya era miembro sigue siendolo, y nunca se usa PATCH/DELETE", async () => {
  const fake = fakeChatwoot();
  await onboardClient(SPEC, { api: apiFor(fake) });
  assert.ok(fake.state.members.get(5).has(3), "el bot (user 3) tiene que seguir en el inbox");
  assert.ok(!fake.state.calls.some((call) => call.startsWith("PATCH") || call.startsWith("DELETE")));
});

test("un inbox que no existe y no se puede crear por API (WhatsApp) falla con instruccion clara", async () => {
  const fake = fakeChatwoot();
  const result = await onboardClient({ ...SPEC, inboxName: "Inbox que no existe", inboxType: "whatsapp" }, { api: apiFor(fake) });
  assert.equal(result.ok, false);
  assert.ok(result.errors.join(" ").includes("crealo en la UI"));
  assert.equal(fake.state.inboxes.length, 1, "no puede haber creado nada");
});

test("un inbox de tipo api SI se crea cuando falta", async () => {
  const fake = fakeChatwoot();
  const result = await onboardClient({ ...SPEC, inboxName: "Cliente Demo", inboxType: "api" }, { api: apiFor(fake) });
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  assert.equal(result.inbox.action, "created");
  assert.equal(fake.state.inboxes.length, 2);
  assert.equal(fake.state.members.get(result.inbox.id).size, 2, "los dos usuarios del alta quedan de miembros");
});

// ---------------------------------------------------------------------------
// 5. --dry-run
// ---------------------------------------------------------------------------

test("--dry-run no escribe NADA", async () => {
  const fake = fakeChatwoot();
  const result = await onboardClient({ ...SPEC, dryRun: true }, { api: apiFor(fake) });
  assert.ok(!fake.state.calls.some((call) => call.startsWith("POST")), `hubo POSTs: ${fake.state.calls}`);
  assert.equal(fake.state.agents.length, 1);
  assert.equal(result.agents[0].action, "would-create");
  assert.equal(result.members.every((member) => member.action === "would-add" || member.action === "already"), true);
});

test("--dry-run PREDICE el chequeo final (no falla por lo que el plan ya arregla)", async () => {
  const fake = fakeChatwoot();
  const result = await onboardClient({ ...SPEC, dryRun: true }, { api: apiFor(fake) });
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  const sergio = result.visibility.find((row) => row.userId === 2);
  assert.equal(sergio.inboxCount, 1, "proyecta la membresia que agregaria");
});

// ---------------------------------------------------------------------------
// 6. Cuentas / Platform API
// ---------------------------------------------------------------------------

test("sin token de plataforma y sin --account-id no se crea ninguna cuenta a ciegas", async () => {
  const fake = fakeChatwoot();
  const result = await onboardClient(
    { clientName: "Ferreteria X", inboxName: "FX", inboxType: "api", agents: [] },
    { api: apiFor(fake) },
  );
  assert.equal(result.ok, false);
  assert.ok(result.errors.join(" ").includes("CHATWOOT_PLATFORM_TOKEN"));
  assert.ok(result.errors.join(" ").includes("--account-id"));
  assert.ok(!fake.state.calls.some((call) => call.startsWith("POST")));
});

test("con token de plataforma: reusa la cuenta que ya existe con ese nombre", async () => {
  const fake = fakeChatwoot({ platform: { token: "plat", accounts: [{ id: 77, name: "Ferreteria X" }] } });
  const api = apiFor(fake, { platformToken: "plat" });
  const result = await onboardClient(
    { clientName: "ferreteria x", inboxName: "FX", inboxType: "api", agents: [], createAccount: true },
    { api },
  );
  assert.equal(result.account.id, 77);
  assert.equal(result.account.action, "reused");
  assert.equal(fake.state.platform.accounts.length, 1, "no puede duplicar la cuenta");
});

test("sin --create-account no crea la cuenta aunque haya token de plataforma", async () => {
  const fake = fakeChatwoot({ platform: { token: "plat", accounts: [] } });
  const result = await onboardClient(
    { clientName: "Nueva SRL", inboxName: "FX", inboxType: "api", agents: [] },
    { api: apiFor(fake, { platformToken: "plat" }) },
  );
  assert.equal(result.ok, false);
  assert.equal(fake.state.platform.accounts.length, 0);
  assert.ok(result.errors.join(" ").includes("--create-account"));
});

// ---------------------------------------------------------------------------
// 7. Bordes: token malo, argumentos, avisos
// ---------------------------------------------------------------------------

test("token invalido: falla en el primer paso y no toca nada", async () => {
  const fake = fakeChatwoot();
  const api = createChatwootAdminApi({ baseUrl: "https://chatwoot.test", token: "malo", fetch: fake.fetchImpl });
  const result = await onboardClient(SPEC, { api });
  assert.equal(result.ok, false);
  assert.ok(result.errors[0].includes("token de Chatwoot invalido"));
  assert.equal(fake.state.calls.length, 1);
});

test("sin token no hay ni una llamada", async () => {
  const fake = fakeChatwoot();
  const api = createChatwootAdminApi({ baseUrl: "https://chatwoot.test", token: "", fetch: fake.fetchImpl });
  const result = await onboardClient(SPEC, { api });
  assert.equal(result.ok, false);
  assert.equal(fake.state.calls.length, 0);
});

test("la red caida no tira: se reporta", async () => {
  const api = createChatwootAdminApi({
    baseUrl: "https://chatwoot.test",
    token: ADMIN_TOKEN,
    fetch: async () => {
      throw new Error("ECONNREFUSED");
    },
  });
  const result = await onboardClient(SPEC, { api });
  assert.equal(result.ok, false);
  assert.ok(result.errors[0].includes("ECONNREFUSED"));
});

test("parseAgentSpec: nombre:email[:rol]", () => {
  assert.deepEqual(parseAgentSpec("Juan Perez:JUAN@x.bo"), { name: "Juan Perez", email: "juan@x.bo", role: "agent" });
  assert.deepEqual(parseAgentSpec("Ana:ana@x.bo:administrator"), { name: "Ana", email: "ana@x.bo", role: "administrator" });
  assert.ok(parseAgentSpec("Juan:no-es-mail").error);
  assert.ok(parseAgentSpec(":juan@x.bo").error);
  assert.ok(parseAgentSpec("Juan:juan@x.bo:jefe").error);
});

test("parseArgs: flags con espacio y con igual, y faltantes que se avisan", () => {
  const args = parseArgs(["--account-id", "2", "--inbox=Onia WhatsApp", "--agent", "Juan:juan@x.bo", "--dry-run", "--json"]);
  assert.equal(args.accountId, "2");
  assert.equal(args.inboxName, "Onia WhatsApp");
  assert.equal(args.dryRun, true);
  assert.equal(args.json, true);
  assert.deepEqual(args.agents, [{ name: "Juan", email: "juan@x.bo", role: "agent" }]);
  assert.deepEqual(args.errors, []);

  assert.ok(parseArgs([]).errors.length >= 2);
  assert.ok(parseArgs(["--account-id", "2"]).errors.some((error) => error.includes("--inbox")));
});

test("planOnboarding es puro: decide reusar por email y por nombre de inbox, sin importar mayusculas", () => {
  const plan = planOnboarding(
    { agents: [{ id: 4, email: "Juan@X.bo", role: "agent" }], inboxes: [{ id: 5, name: "Onia WhatsApp" }] },
    { agents: [{ name: "Juan", email: "juan@x.bo", role: "agent" }], inboxName: "onia whatsapp", inboxType: "api" },
  );
  assert.equal(plan.agents[0].action, "reused");
  assert.equal(plan.agents[0].userId, 4);
  assert.equal(plan.inbox.action, "reused");
  assert.equal(plan.inbox.id, 5);
});

test("la salida SIEMPRE avisa que hay que cerrar sesion y volver a entrar", async () => {
  const fake = fakeChatwoot();
  const result = await onboardClient(SPEC, { api: apiFor(fake) });
  assert.equal(result.relogin, AVISO_RELOGIN);
  const texto = renderHuman(result);
  assert.ok(texto.includes("CERRAR SESION"));
  assert.ok(texto.includes("RESULTADO: ok"));
  assert.ok(renderHuman({ ...vacio(), errors: ["algo"] }).includes("RESULTADO: FALLO"));
});

function vacio() {
  return { ok: false, dryRun: false, agents: [], members: [], visibility: [], warnings: [], errors: [], relogin: AVISO_RELOGIN };
}
