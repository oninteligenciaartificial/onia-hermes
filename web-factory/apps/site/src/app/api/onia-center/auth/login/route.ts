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

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function POST(request: Request) {
  const config = getOniaCenterAuthConfig();

  if (!config || !config.anonKey) {
    return NextResponse.json(
      {
        ok: false,
        mode: "configuration_pending",
        message: "Falta configuracion Auth para iniciar sesion en ONIA Center.",
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

  const email = payload.email?.trim();
  const password = payload.password ?? "";

  if (!email || !password) {
    return NextResponse.json({ ok: false, message: "Email y password son requeridos." }, { status: 400 });
  }

  const authResponse = await fetch(`${config.url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: config.anonKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  if (!authResponse.ok) {
    return NextResponse.json(
      {
        ok: false,
        mode: "auth_error",
        message: "Credenciales invalidas o usuario no permitido en ONIA Center.",
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
