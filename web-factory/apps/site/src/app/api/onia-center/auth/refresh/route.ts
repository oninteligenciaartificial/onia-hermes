import { NextResponse, type NextRequest } from "next/server";
import { getMissingOniaCenterAuthConfig, getOniaCenterAuthConfig } from "@/lib/onia-center-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RefreshResponse = {
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

export async function POST(request: NextRequest) {
  const config = getOniaCenterAuthConfig();

  if (!config || !config.anonKey) {
    return NextResponse.json(
      {
        ok: false,
        mode: "configuration_pending",
        message: "Falta configuracion Auth para refrescar la sesion de ONIA Center.",
        missingConfiguration: getMissingOniaCenterAuthConfig({ requireAnon: true }),
      },
      { status: 200 },
    );
  }

  const refreshToken = request.cookies.get("onia_center_refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { ok: false, mode: "auth_required", message: "No hay sesion de ONIA Center para refrescar." },
      { status: 401 },
    );
  }

  let authResponse: Response;
  try {
    authResponse = await fetch(`${config.url}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: {
        apikey: config.anonKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
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
    // Refresh token vencido o revocado: limpiar la sesion para forzar re-login.
    const response = NextResponse.json(
      { ok: false, mode: "auth_error", message: "La sesion de ONIA Center expiro. Inicia sesion nuevamente." },
      { status: 401 },
    );
    response.cookies.set("onia_center_access_token", "", cookieOptions(0));
    response.cookies.set("onia_center_refresh_token", "", cookieOptions(0));
    return response;
  }

  const authJson = (await authResponse.json()) as RefreshResponse;

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
    mode: "refreshed",
    user: {
      id: authJson.user?.id ?? null,
      email: authJson.user?.email ?? null,
    },
  });

  response.cookies.set("onia_center_access_token", authJson.access_token, cookieOptions(authJson.expires_in ?? 3600));
  response.cookies.set("onia_center_refresh_token", authJson.refresh_token, cookieOptions(60 * 60 * 24 * 30));

  return response;
}
