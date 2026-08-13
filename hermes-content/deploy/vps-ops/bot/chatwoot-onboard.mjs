// ONIA — ALTA DE UN CLIENTE EN CHATWOOT: cuenta + agentes + inbox + MEMBRESIAS, en un solo
// comando, idempotente y con verificacion despues de escribir.
//
// POR QUE EXISTE (incidente real del 2026-08-13, no una hipotesis): Sergio abrio Chatwoot en el
// celular y vio la bandeja VACIA. Su usuario no era miembro del inbox de WhatsApp. En Chatwoot eso
// NO produce ningun error: la pantalla sale en blanco, igual que si el producto estuviera roto. Y
// el permiso se cachea en la sesion, asi que agregarlo tampoco se ve hasta volver a entrar
// (verificado: la membresia se dio 88 segundos DESPUES del login y la sesion siguio ciega).
// Si eso le pasa a un cliente el dia de la entrega, concluye que le vendimos algo roto.
//
// Por eso el corazon de este script NO es crear cosas: es el CHEQUEO FINAL. Si al terminar algun
// usuario ve CERO bandejas, esto falla RUIDOSO (ok:false + exit 1). Un alta "exitosa" que deja a
// alguien mirando una pantalla en blanco es peor que un alta que falla.
//
//   entrada : argumentos de CLI (no hay stdin)
//   salida  : texto legible · --json una linea JSON para n8n / el panel
//   codigo de salida: 0 si ok, 1 si NO. A diferencia de los barridos (followup/reminder/usage, que
//     salen 0 siempre para que n8n no reintente), esto se corre A MANO al dar de alta un cliente:
//     aca el silencio es el enemigo, no el reintento. Y como es idempotente, reintentar no rompe.
//
// LO QUE HACE, EN ORDEN
//   1. valida el token (GET /api/v1/profile) — si el token esta mal, se sabe en el primer paso.
//   2. cuenta   : reusa la que se le pasa (--account-id) o, con token de plataforma, busca por
//                 nombre y crea si falta.
//   3. agentes  : busca por email; los que faltan se crean por INVITACION (Chatwoot manda el mail
//                 y el cliente pone su propia clave — aca NO se generan ni se imprimen claves).
//   4. inbox    : busca por nombre; si falta y es un tipo que se puede crear sin credenciales de
//                 terceros (api / web_widget), lo crea.
//   5. MEMBRESIAS: mete a TODOS los usuarios del alta en `inbox_members` — EL PASO INVISIBLE — y
//                 despues de escribir vuelve a LEER la lista para confirmarlo. No se asume.
//   6. chequeo  : "esto es lo que va a ver el cliente" — por usuario, cuantas bandejas y cuantas
//                 conversaciones. Cero bandejas => ERROR.
//   7. avisa que hay que CERRAR SESION y volver a entrar.
//
// IDEMPOTENTE: correrlo dos veces no duplica nada. Todo paso primero BUSCA y solo crea lo que
// falta. El POST de miembros de Chatwoot ya es aditivo (`add_members(user_ids - actuales)`,
// leido del fuente 4.12.1 en el VPS), asi que reenviarlo no duplica ni saca a nadie.
// NO DESTRUCTIVO: no borra ni renombra nada. Nunca usa el PATCH de inbox_members (ese SI saca a
// los que no vengan en la lista) ni el DELETE.
//
// SE HABLA CON LA API, NO CON LA BASE. Escribir directo en Postgres se saltea los callbacks de
// Chatwoot (invitaciones, avatares, cache de permisos) y es la forma mas facil de dejar una fila
// que la app no respeta. Aca la base NO se toca ni para leer.
//
// QUE API (verificado en la instalacion real, Chatwoot 4.12.1, el 2026-08-13):
//   · API de aplicacion (`/api/v1/accounts/:id/...`) con token de un usuario ADMINISTRADOR:
//     hace agentes, inboxes, membresias y conteos. Es la que se usa para todo.
//   · Platform API (`/platform/api/v1/accounts`): la RUTA EXISTE (responde 401 con token falso,
//     no 404), pero la tabla `platform_apps` esta VACIA => hoy NO hay token de plataforma y por lo
//     tanto NO se pueden crear cuentas. No se inventa: si falta, el script lo dice y pide
//     --account-id. Para crearlo: super admin -> /super_admin/platform_apps -> New, y su token
//     entra aca por CHATWOOT_PLATFORM_TOKEN.
//     OJO: `GET /platform/api/v1/accounts` solo lista las cuentas de ESA app de plataforma, asi
//     que la cuenta 2 (creada antes, a mano) nunca va a aparecer ahi: para ella, --account-id 2.
//
// Config (NO son secretos: es la URL publica y el id de cuenta, iguales para cualquiera):
//   CHATWOOT_BASE_URL      default "https://onia-chatbot-chatwoot.hqdqgh.easypanel.host"
//   CHATWOOT_ACCOUNT_ID    default vacio (se pasa por --account-id)
// Secretos (NUNCA hardcodear, NUNCA loguear el valor):
//   CHATWOOT_API_TOKEN     token de un usuario ADMINISTRADOR de la cuenta. Con el token del bot
//                          (rol agente) los POST devuelven 401/403: no puede crear agentes.
//   CHATWOOT_PLATFORM_TOKEN token de una "platform app". Hoy NO existe (ver arriba). Opcional.
//
// Uso:
//   node chatwoot-onboard.mjs --account-id 2 --inbox "Onia WhatsApp" \
//        --agent "Juan Perez:juan@ferreteria.bo" --agent "Ana:ana@ferreteria.bo" --dry-run
//   node chatwoot-onboard.mjs --account-id 2 --inbox "Onia WhatsApp" --agent "Juan:juan@x.bo"
//   node chatwoot-onboard.mjs --client "Ferreteria X" --create-account --inbox "FX WhatsApp" ...
//
// Wrapper (saca el token de admin de la base de Chatwoot, igual que reminder-run.sh):
//   bash chatwoot-onboard.sh --account-id 2 --inbox "Onia WhatsApp" --dry-run

import { pathToFileURL } from "node:url";

const DEFAULT_BASE_URL = "https://onia-chatbot-chatwoot.hqdqgh.easypanel.host";

/** Tipos de inbox que se pueden CREAR sin credenciales de terceros. */
const CREATABLE_CHANNELS = new Set(["api", "web_widget"]);

/**
 * EL AVISO QUE NO SE PUEDE OMITIR. Chatwoot cachea los permisos en la sesion: agregar la membresia
 * con el usuario ya logueado no cambia nada de lo que el ve hasta que vuelve a entrar. Verificado
 * el 2026-08-13 (permiso dado 88 s despues del login; la sesion siguio ciega).
 */
export const AVISO_RELOGIN =
  "IMPORTANTE: quien ya este logueado tiene que CERRAR SESION y volver a entrar. " +
  "Chatwoot cachea los permisos en la sesion: hasta que no vuelva a entrar sigue viendo la bandeja vacia.";

// ---------------------------------------------------------------------------
// Helpers puros
// ---------------------------------------------------------------------------

const normalizeEmail = (value) => String(value ?? "").trim().toLowerCase();
const normalizeName = (value) => String(value ?? "").trim().toLowerCase();

/**
 * `--agent "Nombre:mail@dominio:rol"`. El rol es opcional (default `agent`). Los mails no llevan
 * dos puntos, asi que partir por ":" es seguro.
 * @returns {{name:string,email:string,role:string}|{error:string}}
 */
export function parseAgentSpec(raw) {
  const parts = String(raw ?? "").split(":").map((part) => part.trim());
  const [name, email, role = "agent"] = parts;
  if (!name) return { error: `agente sin nombre: "${raw}"` };
  if (!email || !email.includes("@")) return { error: `agente sin email valido: "${raw}"` };
  if (role !== "agent" && role !== "administrator") {
    return { error: `rol invalido "${role}" en "${raw}" (agent|administrator)` };
  }
  return { name, email: normalizeEmail(email), role };
}

/**
 * Decide, SIN tocar la red, que se crea y que se reusa. Separado a proposito: es la parte que se
 * prueba en seco y la que imprime `--dry-run`.
 *
 * @param {object} state  { agents:[{id,email,name,role}], inboxes:[{id,name,channel_type}] }
 * @param {object} spec   { agents:[{name,email,role}], inboxName, inboxType }
 */
export function planOnboarding(state, spec) {
  const byEmail = new Map((state.agents || []).map((agent) => [normalizeEmail(agent.email), agent]));
  const agents = (spec.agents || []).map((wanted) => {
    const found = byEmail.get(normalizeEmail(wanted.email));
    return found
      ? { ...wanted, userId: found.id, action: "reused", roleActual: found.role }
      : { ...wanted, userId: null, action: "create" };
  });

  const wantedInbox = normalizeName(spec.inboxName);
  const foundInbox = (state.inboxes || []).find((inbox) => normalizeName(inbox.name) === wantedInbox);
  const inbox = foundInbox
    ? { id: foundInbox.id, name: foundInbox.name, channelType: foundInbox.channel_type || null, action: "reused" }
    : { id: null, name: spec.inboxName, channelType: spec.inboxType, action: "create" };

  return { agents, inbox };
}

/**
 * EL CHEQUEO QUE IMPORTA: "esto es lo que va a ver el cliente".
 *
 * Nota honesta sobre roles: leido del fuente de Chatwoot 4.12.1 (`User#assigned_inboxes`), un
 * ADMINISTRADOR ve todas las bandejas de la cuenta aunque no sea miembro de ninguna; solo el
 * agente depende de `inbox_members`. Pero el incidente del 13-ago le paso justamente a un
 * administrador. Ante la contradiccion entre el fuente y lo que se vio en la pantalla, aca se
 * exige MEMBRESIA PARA TODOS: es barato, no rompe nada, y es lo unico que se verifico que arregla
 * la pantalla en blanco. `visibleCount` se informa aparte, para no mentir sobre lo que dice el
 * fuente.
 *
 * @param {object} input
 *   users: [{id,name,email,role}]
 *   inboxes: [{id,name}]
 *   membersByInbox: Map<inboxId, Set<userId>>
 *   conversationsByInbox: Map<inboxId, number>
 */
export function auditVisibility({ users, inboxes, membersByInbox, conversationsByInbox }) {
  return (users || []).map((user) => {
    const mine = (inboxes || []).filter((inbox) => (membersByInbox.get(inbox.id) || new Set()).has(user.id));
    const conversations = mine.reduce((total, inbox) => total + (conversationsByInbox.get(inbox.id) || 0), 0);
    return {
      userId: user.id,
      name: user.name || null,
      email: user.email || null,
      role: user.role || null,
      inboxes: mine.map((inbox) => inbox.name),
      inboxCount: mine.length,
      // Lo que el fuente dice que veria: un admin ve todas aunque no sea miembro.
      visibleCount: user.role === "administrator" ? (inboxes || []).length : mine.length,
      conversations,
      ok: mine.length > 0,
    };
  });
}

// ---------------------------------------------------------------------------
// Cliente de la API de Chatwoot (tolerante: nunca tira, devuelve {ok,...})
// ---------------------------------------------------------------------------

export function createChatwootAdminApi(options = {}) {
  const baseUrl = String(options.baseUrl || process.env.CHATWOOT_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");
  const token = String(options.token ?? process.env.CHATWOOT_API_TOKEN ?? "");
  const platformToken = String(options.platformToken ?? process.env.CHATWOOT_PLATFORM_TOKEN ?? "");
  const doFetch = options.fetch || globalThis.fetch;
  const timeoutMs = Number(options.timeoutMs) > 0 ? Number(options.timeoutMs) : 15000;

  async function request(method, path, { body, platform = false } = {}) {
    const key = platform ? platformToken : token;
    if (!key) {
      return { ok: false, status: 0, error: platform ? "sin CHATWOOT_PLATFORM_TOKEN" : "sin CHATWOOT_API_TOKEN" };
    }
    if (typeof doFetch !== "function") return { ok: false, status: 0, error: "sin fetch disponible" };
    try {
      const res = await doFetch(`${baseUrl}${path}`, {
        method,
        headers: { api_access_token: key, "Content-Type": "application/json" },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        signal: AbortSignal.timeout ? AbortSignal.timeout(timeoutMs) : undefined,
      });
      const raw = await res.text();
      let data = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        data = null;
      }
      if (!res.ok) {
        // El cuerpo del error se recorta: puede traer eco de datos del cliente.
        return { ok: false, status: res.status, data, error: `HTTP ${res.status} ${String(raw).slice(0, 200)}` };
      }
      return { ok: true, status: res.status, data };
    } catch (error) {
      return { ok: false, status: 0, error: String(error?.message || error).slice(0, 200) };
    }
  }

  const list = (data, fallback = []) => (Array.isArray(data) ? data : data?.payload || data?.data?.payload || fallback);

  return {
    hasToken: Boolean(token),
    hasPlatformToken: Boolean(platformToken),
    request,

    profile: () => request("GET", "/api/v1/profile"),

    listPlatformAccounts: () => request("GET", "/platform/api/v1/accounts", { platform: true }),
    createPlatformAccount: (name) => request("POST", "/platform/api/v1/accounts", { platform: true, body: { name } }),
    addPlatformAccountUser: (accountId, userId, role) =>
      request("POST", `/platform/api/v1/accounts/${accountId}/account_users`, {
        platform: true,
        body: { user_id: userId, role },
      }),

    async listAgents(accountId) {
      const res = await request("GET", `/api/v1/accounts/${accountId}/agents`);
      return res.ok ? { ...res, agents: list(res.data) } : res;
    },
    createAgent: (accountId, agent) =>
      // Sin `password`: Chatwoot usa AgentBuilder -> invitacion por mail. La clave la pone el
      // cliente. Aca NO se generan ni se imprimen claves, nunca.
      request("POST", `/api/v1/accounts/${accountId}/agents`, {
        body: { name: agent.name, email: agent.email, role: agent.role || "agent" },
      }),

    async listInboxes(accountId) {
      const res = await request("GET", `/api/v1/accounts/${accountId}/inboxes`);
      return res.ok ? { ...res, inboxes: list(res.data) } : res;
    },
    createInbox: (accountId, name, channelType) =>
      request("POST", `/api/v1/accounts/${accountId}/inboxes`, {
        body: {
          name,
          channel:
            channelType === "web_widget"
              ? { type: "web_widget", website_url: "" }
              : { type: "api", webhook_url: "" },
        },
      }),

    async listInboxMembers(accountId, inboxId) {
      const res = await request("GET", `/api/v1/accounts/${accountId}/inbox_members/${inboxId}`);
      return res.ok ? { ...res, members: list(res.data) } : res;
    },
    // POST y NO PATCH a proposito: el POST es aditivo (`add_members(user_ids - actuales)`); el
    // PATCH saca a todo el que no venga en la lista. Aca no se saca a nadie, nunca.
    addInboxMembers: (accountId, inboxId, userIds) =>
      request("POST", `/api/v1/accounts/${accountId}/inbox_members`, {
        body: { inbox_id: inboxId, user_ids: userIds },
      }),

    async conversationCount(accountId, inboxId) {
      const res = await request("GET", `/api/v1/accounts/${accountId}/conversations/meta?status=all&inbox_id=${inboxId}`);
      if (!res.ok) return { ...res, count: 0 };
      return { ...res, count: Number(res.data?.meta?.all_count ?? res.data?.data?.meta?.all_count ?? 0) || 0 };
    },
  };
}

// ---------------------------------------------------------------------------
// Orquestacion
// ---------------------------------------------------------------------------

/**
 * @param {object} spec { accountId, clientName, createAccount, agents:[], inboxName, inboxType, dryRun }
 * @param {object} deps { api }
 */
export async function onboardClient(spec, deps = {}) {
  const api = deps.api || createChatwootAdminApi(spec);
  const result = {
    ok: false,
    dryRun: Boolean(spec.dryRun),
    account: null,
    agents: [],
    inbox: null,
    members: [],
    visibility: [],
    errors: [],
    warnings: [],
    relogin: AVISO_RELOGIN,
  };
  const fail = (message) => {
    result.errors.push(message);
    return result;
  };

  // 1. El token, primero. Si esta mal, que se sepa aca y no a mitad del alta.
  const profile = await api.profile();
  if (!profile.ok) return fail(`token de Chatwoot invalido o sin acceso: ${profile.error}`);
  const me = {
    id: profile.data?.id,
    name: profile.data?.name || null,
    email: profile.data?.email || null,
    role: "administrator",
  };
  if (!me.id) return fail("la API no devolvio el usuario del token (GET /api/v1/profile sin id)");

  // 2. Cuenta.
  const account = await resolveAccount(api, spec, me, result);
  if (!account) return result;
  result.account = account;

  // 3. Estado actual + plan.
  const agentsRes = await api.listAgents(account.id);
  if (!agentsRes.ok) return fail(`no se pudo listar agentes: ${agentsRes.error}`);
  const inboxesRes = await api.listInboxes(account.id);
  if (!inboxesRes.ok) return fail(`no se pudo listar inboxes: ${inboxesRes.error}`);

  const plan = planOnboarding({ agents: agentsRes.agents, inboxes: inboxesRes.inboxes }, spec);

  if (plan.inbox.action === "create" && !CREATABLE_CHANNELS.has(spec.inboxType)) {
    return fail(
      `el inbox "${spec.inboxName}" no existe y el tipo "${spec.inboxType}" no se puede crear por API ` +
        "(WhatsApp/Email/etc. necesitan credenciales del proveedor): crealo en la UI y volve a correr esto.",
    );
  }

  // 4. Agentes que faltan.
  for (const agent of plan.agents) {
    if (agent.action !== "create") {
      result.agents.push(agent);
      continue;
    }
    if (spec.dryRun) {
      result.agents.push({ ...agent, action: "would-create" });
      continue;
    }
    const created = await api.createAgent(account.id, agent);
    if (!created.ok) {
      result.errors.push(`no se pudo crear el agente ${agent.email}: ${created.error}`);
      result.agents.push({ ...agent, action: "failed" });
      continue;
    }
    const userId = created.data?.id ?? created.data?.payload?.id ?? null;
    if (!userId) {
      result.errors.push(`el agente ${agent.email} se creo pero la API no devolvio su id`);
      result.agents.push({ ...agent, action: "failed" });
      continue;
    }
    result.agents.push({ ...agent, userId, action: "created" });
    result.warnings.push(`${agent.email}: se envio invitacion por mail — la clave la pone el cliente, aca no se genera ninguna`);
  }

  // 5. Inbox.
  let inbox = plan.inbox;
  if (inbox.action === "create") {
    if (spec.dryRun) {
      inbox = { ...inbox, action: "would-create" };
    } else {
      const created = await api.createInbox(account.id, spec.inboxName, spec.inboxType);
      if (!created.ok) return fail(`no se pudo crear el inbox "${spec.inboxName}": ${created.error}`);
      const inboxId = created.data?.id ?? created.data?.payload?.id ?? null;
      if (!inboxId) return fail(`el inbox "${spec.inboxName}" se creo pero la API no devolvio su id`);
      inbox = { id: inboxId, name: spec.inboxName, channelType: spec.inboxType, action: "created" };
    }
  }
  result.inbox = inbox;

  // 6. MEMBRESIAS — el paso invisible. Van TODOS: los agentes del cliente y el usuario que corre
  //    el alta (el incidente fue justamente con ese).
  const targets = [{ userId: me.id, email: me.email, role: me.role }];
  for (const agent of result.agents) {
    if (agent.userId) targets.push({ userId: agent.userId, email: agent.email, role: agent.role });
  }
  const targetIds = [...new Set(targets.map((target) => target.userId))];

  const membersBefore = inbox.id ? await api.listInboxMembers(account.id, inbox.id) : { ok: true, members: [] };
  if (inbox.id && !membersBefore.ok) return fail(`no se pudieron leer los miembros del inbox ${inbox.id}: ${membersBefore.error}`);
  const beforeIds = new Set((membersBefore.members || []).map((member) => member.id));
  const missing = targetIds.filter((id) => !beforeIds.has(id));

  if (spec.dryRun || !inbox.id) {
    result.members = targets.map((target) => ({
      ...target,
      action: beforeIds.has(target.userId) ? "already" : "would-add",
    }));
  } else {
    if (missing.length) {
      const added = await api.addInboxMembers(account.id, inbox.id, missing);
      if (!added.ok) result.errors.push(`no se pudieron agregar miembros al inbox ${inbox.id}: ${added.error}`);
    }
    // VERIFICACION DESPUES DE ESCRIBIR. No se asume que el POST hizo lo que dijo: un 200 con la
    // fila ausente es exactamente el bug que motivo todo esto.
    const membersAfter = await api.listInboxMembers(account.id, inbox.id);
    if (!membersAfter.ok) return fail(`no se pudo verificar la membresia del inbox ${inbox.id}: ${membersAfter.error}`);
    const afterIds = new Set((membersAfter.members || []).map((member) => member.id));
    result.members = targets.map((target) => ({
      ...target,
      action: afterIds.has(target.userId) ? (beforeIds.has(target.userId) ? "already" : "added") : "MISSING",
    }));
    for (const member of result.members) {
      if (member.action === "MISSING") {
        result.errors.push(
          `MEMBRESIA NO VERIFICADA: ${member.email || member.userId} NO quedo en inbox_members del inbox ${inbox.id} ` +
            "— ese usuario va a abrir Chatwoot y ver la bandeja VACIA, sin ningun error.",
        );
      }
    }
  }

  // 7. Chequeo final: que ve cada usuario. En dry-run se proyecta el plan sobre el estado actual,
  //    asi que la prediccion tambien avisa si alguien quedaria sin bandejas.
  const inboxesNow = spec.dryRun || inbox.action === "reused" ? inboxesRes.inboxes : [...inboxesRes.inboxes, { id: inbox.id, name: inbox.name }];
  const membersByInbox = new Map();
  const conversationsByInbox = new Map();
  for (const each of inboxesNow) {
    if (!each.id) continue;
    const members = await api.listInboxMembers(account.id, each.id);
    if (!members.ok) {
      result.warnings.push(`no se pudieron leer los miembros del inbox ${each.id}: ${members.error}`);
      membersByInbox.set(each.id, new Set());
    } else {
      membersByInbox.set(each.id, new Set((members.members || []).map((member) => member.id)));
    }
    const count = await api.conversationCount(account.id, each.id);
    if (!count.ok) result.warnings.push(`no se pudo contar conversaciones del inbox ${each.id}: ${count.error}`);
    conversationsByInbox.set(each.id, count.count || 0);
  }
  if (spec.dryRun && inbox.id) {
    // Proyeccion: lo que el plan agregaria.
    const set = membersByInbox.get(inbox.id) || new Set();
    for (const id of targetIds) set.add(id);
    membersByInbox.set(inbox.id, set);
  }

  const users = [me, ...result.agents.filter((agent) => agent.userId).map((agent) => ({
    id: agent.userId,
    name: agent.name,
    email: agent.email,
    role: agent.role,
  }))];
  const seen = new Set();
  const uniqueUsers = users.filter((user) => (seen.has(user.id) ? false : seen.add(user.id)));
  result.visibility = auditVisibility({
    users: uniqueUsers,
    inboxes: inboxesNow.filter((each) => each.id),
    membersByInbox,
    conversationsByInbox,
  });

  for (const row of result.visibility) {
    if (!row.ok) {
      result.errors.push(
        `${row.email || row.userId} ve CERO bandejas${spec.dryRun ? " (proyectado)" : ""} — ` +
          "va a abrir Chatwoot y encontrar la pantalla en blanco, sin ningun mensaje de error.",
      );
    }
  }

  result.ok = result.errors.length === 0;
  return result;
}

/** Resuelve la cuenta: reusar la indicada, o buscar/crear por nombre con token de plataforma. */
async function resolveAccount(api, spec, me, result) {
  if (spec.accountId) {
    return { id: spec.accountId, name: spec.clientName || null, action: "reused" };
  }
  if (!api.hasPlatformToken) {
    result.errors.push(
      "sin --account-id y sin CHATWOOT_PLATFORM_TOKEN no se puede resolver la cuenta. La Platform API existe en esta " +
        "instalacion pero `platform_apps` esta vacia (no hay token). Crealo en super admin -> /super_admin/platform_apps " +
        "-> New y pasalo por CHATWOOT_PLATFORM_TOKEN. Para la cuenta ya existente usa --account-id 2.",
    );
    return null;
  }
  if (!spec.clientName) {
    result.errors.push("falta --client (nombre de la cuenta) o --account-id");
    return null;
  }
  const listed = await api.listPlatformAccounts();
  if (!listed.ok) {
    result.errors.push(`no se pudieron listar las cuentas de plataforma: ${listed.error}`);
    return null;
  }
  const rows = Array.isArray(listed.data) ? listed.data : listed.data?.payload || [];
  const found = rows.find((row) => normalizeName(row.name) === normalizeName(spec.clientName));
  if (found) return { id: found.id, name: found.name, action: "reused" };

  if (!spec.createAccount) {
    result.errors.push(
      `no existe una cuenta "${spec.clientName}" bajo esta app de plataforma. Si es una cuenta vieja (creada a mano) ` +
        "no aparece aca: pasa --account-id. Si de verdad hay que crearla, agrega --create-account.",
    );
    return null;
  }
  if (spec.dryRun) return { id: null, name: spec.clientName, action: "would-create" };

  const created = await api.createPlatformAccount(spec.clientName);
  if (!created.ok) {
    result.errors.push(`no se pudo crear la cuenta "${spec.clientName}": ${created.error}`);
    return null;
  }
  const accountId = created.data?.id ?? null;
  if (!accountId) {
    result.errors.push(`la cuenta "${spec.clientName}" se creo pero la API no devolvio su id`);
    return null;
  }
  // Sin esto, el token de aplicacion no tiene acceso a la cuenta recien creada y todo lo que sigue
  // devuelve 401.
  const linked = await api.addPlatformAccountUser(accountId, me.id, "administrator");
  if (!linked.ok) {
    result.errors.push(`la cuenta ${accountId} se creo pero no se pudo sumar al administrador: ${linked.error}`);
    return null;
  }
  return { id: accountId, name: spec.clientName, action: "created" };
}

// ---------------------------------------------------------------------------
// Salida legible
// ---------------------------------------------------------------------------

export function renderHuman(result) {
  const lines = [
    `ONIA — alta de cliente en Chatwoot${result.dryRun ? "  [DRY-RUN: no se escribio nada]" : ""}`,
    "",
  ];
  if (result.account) {
    lines.push(`CUENTA   ${result.account.id ?? "?"} ${result.account.name || ""} (${result.account.action})`);
  }
  if (result.inbox) {
    lines.push(`INBOX    ${result.inbox.id ?? "?"} ${result.inbox.name} (${result.inbox.action})`);
  }
  if (result.agents.length) {
    lines.push("AGENTES");
    for (const agent of result.agents) {
      lines.push(`  ${String(agent.userId ?? "-").padStart(4)}  ${agent.email.padEnd(34)} ${agent.role.padEnd(14)} ${agent.action}`);
    }
  }
  if (result.members.length) {
    lines.push("MEMBRESIAS DEL INBOX (el paso invisible)");
    for (const member of result.members) {
      lines.push(`  ${String(member.userId).padStart(4)}  ${(member.email || "").padEnd(34)} ${member.action}`);
    }
  }

  lines.push("", "ESTO ES LO QUE VA A VER EL CLIENTE" + (result.dryRun ? " (proyectado)" : ""));
  if (!result.visibility.length) lines.push("  (sin usuarios que chequear)");
  for (const row of result.visibility) {
    const bandejas = row.inboxCount === 0 ? "CERO BANDEJAS  <-- ERROR" : `${row.inboxCount} bandeja(s): ${row.inboxes.join(", ")}`;
    lines.push(`  ${(row.email || row.userId).toString().padEnd(34)} ${bandejas}`);
    lines.push(`  ${" ".repeat(34)} ${row.conversations} conversacion(es)`);
  }

  if (result.warnings.length) {
    lines.push("", "AVISOS");
    for (const warning of result.warnings) lines.push(`  ${warning}`);
  }
  if (result.errors.length) {
    lines.push("", "ERRORES");
    for (const error of result.errors) lines.push(`  ${error}`);
  }
  lines.push("", result.relogin, "", result.ok ? "RESULTADO: ok" : "RESULTADO: FALLO");
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

export function parseArgs(argv = []) {
  const args = {
    accountId: process.env.CHATWOOT_ACCOUNT_ID || null,
    clientName: null,
    createAccount: false,
    agents: [],
    inboxName: null,
    inboxType: "api",
    dryRun: false,
    json: false,
    errors: [],
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = String(argv[index]);
    const next = () => argv[++index] ?? null;
    const take = (flag) => (arg === flag ? next() : arg.startsWith(`${flag}=`) ? arg.slice(flag.length + 1) : undefined);

    if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--json") args.json = true;
    else if (arg === "--create-account") args.createAccount = true;
    else {
      const account = take("--account-id");
      const client = take("--client");
      const agent = take("--agent");
      const inbox = take("--inbox");
      const type = take("--inbox-type");
      if (account !== undefined) args.accountId = account;
      else if (client !== undefined) args.clientName = client;
      else if (inbox !== undefined) args.inboxName = inbox;
      else if (type !== undefined) args.inboxType = type;
      else if (agent !== undefined) {
        const parsed = parseAgentSpec(agent);
        if (parsed.error) args.errors.push(parsed.error);
        else args.agents.push(parsed);
      } else args.errors.push(`argumento desconocido: ${arg}`);
    }
  }
  if (!args.inboxName) args.errors.push("falta --inbox (nombre del inbox del cliente)");
  if (!args.accountId && !args.clientName) args.errors.push("falta --account-id o --client");
  return args;
}

export async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.errors.length) {
    const result = { ok: false, dryRun: args.dryRun, agents: [], members: [], visibility: [], warnings: [], errors: args.errors, relogin: AVISO_RELOGIN };
    process.stdout.write(`${args.json ? JSON.stringify(result) : renderHuman(result)}\n`);
    return result;
  }
  let result;
  try {
    result = await onboardClient({
      accountId: args.accountId,
      clientName: args.clientName,
      createAccount: args.createAccount,
      agents: args.agents,
      inboxName: args.inboxName,
      inboxType: args.inboxType,
      dryRun: args.dryRun,
    });
  } catch (error) {
    result = {
      ok: false,
      dryRun: args.dryRun,
      agents: [],
      members: [],
      visibility: [],
      warnings: [],
      errors: [String(error?.message || error).slice(0, 300)],
      relogin: AVISO_RELOGIN,
    };
  }
  process.stdout.write(`${args.json ? JSON.stringify(result) : renderHuman(result)}\n`);
  return result;
}

const invokedDirectly = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) {
  main().then((result) => {
    // Exit 1 a proposito (ver cabecera): esto se corre a mano y el silencio es el enemigo.
    process.exitCode = result?.ok ? 0 : 1;
  });
}
