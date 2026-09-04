import { NextResponse } from "next/server";
import { getMissingOniaCenterAuthConfig, getOniaCenterAuthConfig } from "@/lib/onia-center-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LoginResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  user?: {
    id?: string;
    email?: string;
  };
};

type ProfileAliasRow = {
  user_key?: string | null;
  raw?: {
    auth_email?: string;
    login_alias?: string;
    login_aliases?: string[];
    email_aliases?: string[];
  } | null;
};

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

async function resolveAuthEmail(identifier: string, config: NonNullable<ReturnType<typeof getOniaCenterAuthConfig>>) {
  const login = identifier.trim().toLowerCase();

  const response = await fetch(`${config.url}/rest/v1/user_profiles?select=user_key,raw&status=eq.active&limit=200`, {
    headers: {
      apikey: config.serviceRoleKey,
      authorization: `Bearer ${config.serviceRoleKey}`,
      "accept-profile": config.schema,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return login;
  }

  const rows = (await response.json()) as ProfileAliasRow[];
  const profile = rows.find((row) => {
    const userKey = row.user_key?.toLowerCase();
    const authEmail = row.raw?.auth_email?.toLowerCase();
    const loginAlias = row.raw?.login_alias?.toLowerCase();
    const loginAliases = Array.isArray(row.raw?.login_aliases) ? row.raw.login_aliases.map((alias) => alias.toLowerCase()) : [];
    const emailAliases = Array.isArray(row.raw?.email_aliases) ? row.raw.email_aliases.map((alias) => alias.toLowerCase()) : [];
    return userKey === login || authEmail === login || loginAlias === login || loginAliases.includes(login) || emailAliases.includes(login);
  });

  return profile?.raw?.auth_email || login;
}

export async function POST(request: Request) {
  const config = getOniaCenterAuthConfig();

  if (!config || !config.anonKey) {
    return NextResponse.json(
      {
        ok: false,
        mode: "configuration_pending",
        message: "Falta configuracion Auth para iniciar sesion en Onia Center.",
        missingConfiguration: getMissingOniaCenterAuthConfig({ requireAnon: true }),
      },
      { status: 200 },
    );
  }

  let payload: { email?: string; password?: string };

  try {
    payload = (await request.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json({ ok: false, message: "El cuerpo debe ser JSON valido." }, { status: 400 });
  }

  const login = payload.email?.trim();
  const password = payload.password ?? "";

  if (!login || !password) {
    return NextResponse.json({ ok: false, message: "Usuario/email y password son requeridos." }, { status: 400 });
  }

  let email: string;
  try {
    email = await resolveAuthEmail(login, config);
  } catch {
    return NextResponse.json(
      {
        ok: false,
        mode: "auth_unavailable",
        message: "No pude consultar los usuarios de Onia Center. Revisa que el tunel local a Supabase este activo.",
      },
      { status: 503 },
    );
  }

  let authResponse: Response;
  try {
    authResponse = await fetch(`${config.url}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        apikey: config.anonKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        mode: "auth_unavailable",
        message: "No pude conectar con Supabase Auth. Revisa que el tunel local a Supabase este activo.",
      },
      { status: 503 },
    );
  }

  if (!authResponse.ok) {
    return NextResponse.json(
      {
        ok: false,
        mode: "auth_error",
        message: "Credenciales invalidas o usuario no permitido en Onia Center.",
      },
      { status: 401 },
    );
  }

  const authJson = (await authResponse.json()) as LoginResponse;

  if (!authJson.access_token || !authJson.refresh_token) {
    return NextResponse.json(
      {
        ok: false,
        mode: "auth_error",
        message: "Supabase Auth no devolvio tokens de sesion.",
      },
      { status: 502 },
    );
  }

  const response = NextResponse.json({
    ok: true,
    mode: "authenticated",
    user: {
      id: authJson.user?.id ?? null,
      email: authJson.user?.email ?? email,
    },
  });

  response.cookies.set("onia_center_access_token", authJson.access_token, cookieOptions(authJson.expires_in ?? 3600));
  response.cookies.set("onia_center_refresh_token", authJson.refresh_token, cookieOptions(60 * 60 * 24 * 30));

  return response;
}
