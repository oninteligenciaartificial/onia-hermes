#!/usr/bin/env node

/**
 * Create/map ONIA Center Supabase Auth users without printing secrets.
 *
 * Required env:
 * - ONIA_CENTER_SUPABASE_URL
 * - ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY
 * - password env passed through --password-env
 */

const roleScopes = {
  sergio: "sergio_private",
  area: "internal_restricted",
  area_responsible: "internal_restricted",
  arthur: "internal_restricted",
  seller: "seller_basic",
  freelancer: "freelancer_task",
};

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith("--")) {
      continue;
    }
    const key = item.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = "true";
    } else {
      args[key] = next;
      index += 1;
    }
  }
  return args;
}

function required(args, key) {
  const value = args[key];
  if (!value) {
    throw new Error(`Falta --${key}`);
  }
  return value;
}

function normalizeRole(role) {
  if (role === "area") {
    return "area_responsible";
  }
  return role;
}

function getConfig() {
  const url = process.env.ONIA_CENTER_SUPABASE_URL || process.env.WEB_FACTORY_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const serviceRoleKey =
    process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.WEB_FACTORY_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    "";
  const schema = process.env.ONIA_CENTER_SUPABASE_SCHEMA || "onia_center";

  const missing = [];
  if (!url) {
    missing.push("ONIA_CENTER_SUPABASE_URL");
  }
  if (!serviceRoleKey) {
    missing.push("ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY");
  }
  if (missing.length) {
    throw new Error(`Falta configuracion: ${missing.join(", ")}`);
  }

  return {
    url: url.replace(/\/$/, ""),
    serviceRoleKey,
    schema,
  };
}

async function requestJson(url, init, label) {
  const response = await fetch(url, init);
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const detail = typeof body === "object" && body ? JSON.stringify(body).slice(0, 500) : text.slice(0, 500);
    throw new Error(`${label} fallo con ${response.status}: ${detail}`);
  }
  return body;
}

function authHeaders(config) {
  return {
    apikey: config.serviceRoleKey,
    authorization: `Bearer ${config.serviceRoleKey}`,
    "content-type": "application/json",
  };
}

function restHeaders(config, prefer) {
  return {
    ...authHeaders(config),
    "accept-profile": config.schema,
    "content-profile": config.schema,
    ...(prefer ? { prefer } : {}),
  };
}

async function findAuthUserByEmail(config, email) {
  let page = 1;
  const perPage = 200;

  while (page <= 20) {
    const body = await requestJson(
      `${config.url}/auth/v1/admin/users?page=${page}&per_page=${perPage}`,
      { headers: authHeaders(config) },
      "listar auth users",
    );
    const users = Array.isArray(body?.users) ? body.users : [];
    const found = users.find((user) => typeof user?.email === "string" && user.email.toLowerCase() === email.toLowerCase());
    if (found) {
      return found;
    }
    if (users.length < perPage) {
      return null;
    }
    page += 1;
  }

  throw new Error("Hay demasiados usuarios Auth para buscar por email con seguridad.");
}

async function createAuthUser(config, { email, password, userKey, displayName, role }) {
  const existing = await findAuthUserByEmail(config, email);
  if (existing?.id) {
    return { user: existing, created: false };
  }

  const user = await requestJson(
    `${config.url}/auth/v1/admin/users`,
    {
      method: "POST",
      headers: authHeaders(config),
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          display_name: displayName,
          onia_user_key: userKey,
          onia_role: role,
        },
      }),
    },
    "crear auth user",
  );

  return { user, created: true };
}

async function upsertProfile(config, { authUserId, userKey, displayName, role }) {
  const dbRole = normalizeRole(role);
  const rows = await requestJson(
    `${config.url}/rest/v1/user_profiles?on_conflict=user_key&select=user_key,display_name,primary_role_key,status,auth_user_id`,
    {
      method: "POST",
      headers: restHeaders(config, "resolution=merge-duplicates,return=representation"),
      body: JSON.stringify({
        auth_user_id: authUserId,
        user_key: userKey,
        display_name: displayName,
        primary_role_key: dbRole,
        status: "active",
        access_note: `ONIA Center Auth activo para ${displayName}.`,
      }),
    },
    "upsert user_profiles",
  );
  return rows?.[0];
}

async function upsertMembership(config, { userKey, role, organizationKey }) {
  const dbRole = normalizeRole(role);
  const scope = roleScopes[dbRole] || roleScopes[role] || "seller_basic";
  const rows = await requestJson(
    `${config.url}/rest/v1/organization_memberships?on_conflict=organization_key,user_key&select=organization_key,user_key,role_key,permission_scope,status`,
    {
      method: "POST",
      headers: restHeaders(config, "resolution=merge-duplicates,return=representation"),
      body: JSON.stringify({
        organization_key: organizationKey,
        user_key: userKey,
        role_key: dbRole,
        permission_scope: scope,
        can_view_sensitive: role === "sergio",
        status: "active",
      }),
    },
    "upsert organization_memberships",
  );
  return rows?.[0];
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(`Uso:
node scripts/onia_center_auth_admin.js --email <email> --password-env <ENV_VAR> --user-key <sergio|arthur|seller_001> --display-name <nombre> --role <sergio|arthur|seller|freelancer|area> [--organization onia]

El password se lee desde la variable indicada en --password-env y nunca se imprime.`);
    return;
  }

  const email = required(args, "email");
  const passwordEnv = required(args, "password-env");
  const password = process.env[passwordEnv];
  if (!password) {
    throw new Error(`Falta variable de password: ${passwordEnv}`);
  }
  if (password.length < 12) {
    throw new Error(`La variable ${passwordEnv} debe tener minimo 12 caracteres.`);
  }

  const userKey = required(args, "user-key");
  const displayName = required(args, "display-name");
  const role = required(args, "role");
  const organizationKey = args.organization || "onia";
  const config = getConfig();

  const { user, created } = await createAuthUser(config, { email, password, userKey, displayName, role });
  const profile = await upsertProfile(config, { authUserId: user.id, userKey, displayName, role });
  const membership = await upsertMembership(config, { userKey, role, organizationKey });

  console.log(
    JSON.stringify(
      {
        ok: true,
        email,
        auth_user_created: created,
        user_key: profile?.user_key || userKey,
        role: profile?.primary_role_key || normalizeRole(role),
        membership_scope: membership?.permission_scope || roleScopes[role],
        status: "mapped",
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
