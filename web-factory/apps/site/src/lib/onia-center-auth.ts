import type { RoleId, VisibilityScope } from "@/app/onia-center/types";

export type OniaCenterMembership = {
  organizationKey: string;
  role: RoleId;
  dbRole: string;
  scope: VisibilityScope;
  canViewSensitive: boolean;
};

export type OniaCenterActor = {
  authUserId: string;
  userKey: string;
  displayName: string;
  role: RoleId;
  dbRole: string;
  memberships: OniaCenterMembership[];
};

type AuthConfig = {
  url: string;
  serviceRoleKey: string;
  anonKey: string;
  schema: string;
};

type AuthFailureCode = "configuration_pending" | "auth_required" | "auth_error" | "forbidden";

export type OniaCenterAuthResult =
  | { ok: true; actor: OniaCenterActor }
  | { ok: false; code: AuthFailureCode; status: number; message: string; missingConfiguration?: string[] };

type SupabaseUserResponse = {
  id?: string;
  email?: string;
};

type DbUserProfile = {
  user_key: string;
  display_name: string;
  primary_role_key: string;
  status: "active" | "invited" | "blocked";
  access_note: string;
};

type DbMembership = {
  organization_key: string;
  role_key: string;
  permission_scope: VisibilityScope;
  can_view_sensitive: boolean;
  status: "active" | "paused" | "revoked";
};

const accessCookieNames = [
  "onia_center_access_token",
  "sb-access-token",
  "supabase-auth-token",
];

function normalizeRole(role: string | null | undefined): RoleId {
  if (role === "area_responsible" || role === "area") {
    return "area";
  }

  if (role === "sergio" || role === "arthur" || role === "seller" || role === "freelancer") {
    return role;
  }

  return "seller";
}

export function roleToDb(role: RoleId) {
  return role === "area" ? "area_responsible" : role;
}

export function getOniaCenterAuthConfig(): AuthConfig | null {
  const url =
    process.env.ONIA_CENTER_SUPABASE_URL ||
    process.env.WEB_FACTORY_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "";
  const serviceRoleKey =
    process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.WEB_FACTORY_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    "";
  const anonKey =
    process.env.ONIA_CENTER_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_ONIA_CENTER_SUPABASE_ANON_KEY ||
    process.env.WEB_FACTORY_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "";
  const schema = process.env.ONIA_CENTER_SUPABASE_SCHEMA || "onia_center";

  if (!url || !serviceRoleKey) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ""),
    serviceRoleKey,
    anonKey,
    schema,
  };
}

export function getMissingOniaCenterAuthConfig(options: { requireAnon?: boolean } = {}) {
  const missing: string[] = [];
  if (!(process.env.ONIA_CENTER_SUPABASE_URL || process.env.WEB_FACTORY_SUPABASE_URL || process.env.SUPABASE_URL)) {
    missing.push("ONIA_CENTER_SUPABASE_URL");
  }
  if (
    !(
      process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY ||
      process.env.WEB_FACTORY_SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY
    )
  ) {
    missing.push("ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY");
  }
  if (
    options.requireAnon &&
    !(
      process.env.ONIA_CENTER_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_ONIA_CENTER_SUPABASE_ANON_KEY ||
      process.env.WEB_FACTORY_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY
    )
  ) {
    missing.push("ONIA_CENTER_SUPABASE_ANON_KEY");
  }
  return missing;
}

function parseCookies(header: string | null) {
  const cookies = new Map<string, string>();
  if (!header) {
    return cookies;
  }

  for (const part of header.split(";")) {
    const [rawName, ...rawValue] = part.trim().split("=");
    if (!rawName || rawValue.length === 0) {
      continue;
    }
    cookies.set(rawName, decodeURIComponent(rawValue.join("=")));
  }
  return cookies;
}

export function getAccessTokenFromRequest(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  if (authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.slice(7).trim();
  }

  const cookies = parseCookies(request.headers.get("cookie"));
  for (const cookieName of accessCookieNames) {
    const token = cookies.get(cookieName);
    if (token) {
      return token;
    }
  }

  return "";
}

async function authFetch<T>(path: string, token: string, config: AuthConfig): Promise<T> {
  const response = await fetch(`${config.url}${path}`, {
    headers: {
      apikey: config.anonKey || config.serviceRoleKey,
      authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase Auth ${response.status}: ${body.slice(0, 300)}`);
  }

  return (await response.json()) as T;
}

async function restFetch<T>(path: string, config: AuthConfig): Promise<T> {
  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    headers: {
      apikey: config.serviceRoleKey,
      authorization: `Bearer ${config.serviceRoleKey}`,
      "accept-profile": config.schema,
      "content-profile": config.schema,
      "content-type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase REST ${response.status}: ${body.slice(0, 300)}`);
  }

  return (await response.json()) as T;
}

export async function getOniaCenterActor(request: Request): Promise<OniaCenterAuthResult> {
  const config = getOniaCenterAuthConfig();
  if (!config) {
    return {
      ok: false,
      code: "configuration_pending",
      status: 200,
      message: "Onia Center aun no tiene Supabase server-side configurado.",
      missingConfiguration: getMissingOniaCenterAuthConfig(),
    };
  }

  const accessToken = getAccessTokenFromRequest(request);
  if (!accessToken) {
    return {
      ok: false,
      code: "auth_required",
      status: 401,
      message: "Supabase esta configurado, pero falta sesion de usuario Onia Center.",
    };
  }

  let authUser: SupabaseUserResponse;
  try {
    authUser = await authFetch<SupabaseUserResponse>("/auth/v1/user", accessToken, config);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "token invalido";
    return {
      ok: false,
      code: "auth_error",
      status: 401,
      message: `Sesion Onia Center invalida o expirada. ${detail}`,
    };
  }

  if (!authUser.id) {
    return {
      ok: false,
      code: "auth_error",
      status: 401,
      message: "Supabase Auth no devolvio auth user id.",
    };
  }

  const profiles = await restFetch<DbUserProfile[]>(
    `user_profiles?auth_user_id=eq.${encodeURIComponent(authUser.id)}&status=eq.active&select=user_key,display_name,primary_role_key,status,access_note&limit=1`,
    config,
  );
  const profile = profiles[0];

  if (!profile) {
    return {
      ok: false,
      code: "forbidden",
      status: 403,
      message: "Usuario autenticado sin perfil activo en Onia Center.",
    };
  }

  const memberships = await restFetch<DbMembership[]>(
    `organization_memberships?user_key=eq.${encodeURIComponent(profile.user_key)}&status=eq.active&select=organization_key,role_key,permission_scope,can_view_sensitive,status`,
    config,
  );

  const role = normalizeRole(profile.primary_role_key);

  return {
    ok: true,
    actor: {
      authUserId: authUser.id,
      userKey: profile.user_key,
      displayName: profile.display_name,
      role,
      dbRole: roleToDb(role),
      memberships: memberships.map((membership) => ({
        organizationKey: membership.organization_key,
        role: normalizeRole(membership.role_key),
        dbRole: roleToDb(normalizeRole(membership.role_key)),
        scope: membership.permission_scope,
        canViewSensitive: membership.can_view_sensitive,
      })),
    },
  };
}

export function canActorSeeScope(actor: OniaCenterActor, scope: VisibilityScope) {
  if (actor.role === "sergio") {
    return true;
  }

  if (scope === "sergio_private") {
    return false;
  }

  if (actor.role === "area") {
    return ["internal_restricted", "collab_safe", "seller_basic", "freelancer_task", "client_workspace"].includes(scope);
  }

  if (actor.role === "arthur") {
    return ["internal_restricted", "collab_safe", "seller_basic"].includes(scope);
  }

  if (actor.role === "seller") {
    return ["seller_basic", "collab_safe"].includes(scope);
  }

  return scope === "freelancer_task";
}

export function isSergio(actor: OniaCenterActor) {
  return actor.role === "sergio";
}

// Finanzas del equipo (caja, Fondo Onia, ganancias por persona) viven en el
// scope internal_restricted. Reusa la matriz de canActorSeeScope como fuente
// Decision de Sergio 2026-08-02: Arthur (aspirante a socio) SI ve Finanzas.
// El scope internal_restricted cubre sergio/area/arthur; seller/freelancer
// (Camila, Jeronimo) siguen sin verla. Registrar movimientos sigue siendo
// sergio-only (la API y la card lo restringen aparte).
export function canActorSeeFinance(actor: OniaCenterActor) {
  return canActorSeeScope(actor, "internal_restricted");
}
