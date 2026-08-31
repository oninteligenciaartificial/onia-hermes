import { NextResponse, type NextRequest } from "next/server";

type OniaCenterProfile = {
  primary_role_key?: string | null;
  status?: string | null;
};


function oniaCenterAuthConfigured() {
  return Boolean(
    (process.env.ONIA_CENTER_SUPABASE_URL || process.env.WEB_FACTORY_SUPABASE_URL || process.env.SUPABASE_URL) &&
      (
        process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY ||
        process.env.WEB_FACTORY_SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SERVICE_KEY
      ),
  );
}

function getSupabaseUrl() {
  return process.env.ONIA_CENTER_SUPABASE_URL || process.env.WEB_FACTORY_SUPABASE_URL || process.env.SUPABASE_URL || "";
}

function getSupabaseServiceKey() {
  return (
    process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.WEB_FACTORY_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    ""
  );
}

function getSupabaseAnonKey() {
  return (
    process.env.ONIA_CENTER_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_ONIA_CENTER_SUPABASE_ANON_KEY ||
    process.env.WEB_FACTORY_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ""
  );
}

function getSupabaseSchema() {
  return process.env.ONIA_CENTER_SUPABASE_SCHEMA || "onia_center";
}

const ACCESS_COOKIE = "onia_center_access_token";
const REFRESH_COOKIE = "onia_center_refresh_token";
const REFRESH_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

type RefreshedSession = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

// Canjea el refresh token (cookie de 30d) por un access token nuevo contra
// Supabase Auth. Evita que el equipo sea expulsado al login cada ~1h cuando el
// access token (~3600s) expira. Devuelve null si no hay config o el refresh
// token esta vencido/revocado.
async function refreshOniaCenterSession(refreshToken: string): Promise<RefreshedSession | null> {
  const supabaseUrl = getSupabaseUrl().replace(/\/$/, "");
  const serviceKey = getSupabaseServiceKey();
  const apiKey = getSupabaseAnonKey() || serviceKey;

  if (!supabaseUrl || !apiKey) {
    return null;
  }

  let response: Response;
  try {
    response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: {
        apikey: apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    });
  } catch {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  const json = (await response.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
  };

  if (!json.access_token || !json.refresh_token) {
    return null;
  }

  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    expiresIn: json.expires_in ?? 3600,
  };
}

// Adjunta las cookies rotadas (access + refresh) a cualquier respuesta que
// continue la navegacion, para que la peticion siguiente ya viaje con el token
// nuevo. Si no hubo refresh, devuelve la respuesta intacta.
function applyRefreshedCookies(response: NextResponse, refreshed: RefreshedSession | null) {
  if (!refreshed) {
    return response;
  }
  response.cookies.set(ACCESS_COOKIE, refreshed.accessToken, cookieOptions(refreshed.expiresIn));
  response.cookies.set(REFRESH_COOKIE, refreshed.refreshToken, cookieOptions(REFRESH_COOKIE_MAX_AGE));
  return response;
}

function normalizeRoleKey(role: string | null | undefined) {
  if (role === "area_responsible") {
    return "area";
  }

  return role ?? "";
}

function redirectToLogin(request: NextRequest, reason: string) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/onia-center/login";
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  loginUrl.searchParams.set("reason", reason);
  return NextResponse.redirect(loginUrl);
}

async function getOniaCenterSessionRole(accessToken: string) {
  const supabaseUrl = getSupabaseUrl().replace(/\/$/, "");
  const serviceKey = getSupabaseServiceKey();
  const schema = getSupabaseSchema();

  if (!supabaseUrl || !serviceKey) {
    return null;
  }

  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: serviceKey,
      authorization: `Bearer ${accessToken}`,
    },
  });

  if (!userResponse.ok) {
    return null;
  }

  const user = (await userResponse.json()) as { id?: string };
  if (!user.id) {
    return null;
  }

  const profileResponse = await fetch(
    `${supabaseUrl}/rest/v1/user_profiles?select=primary_role_key,status&auth_user_id=eq.${encodeURIComponent(user.id)}&limit=1`,
    {
      headers: {
        accept: "application/json",
        apikey: serviceKey,
        authorization: `Bearer ${serviceKey}`,
        "accept-profile": schema,
      },
    },
  );

  if (!profileResponse.ok) {
    return null;
  }

  const profiles = (await profileResponse.json()) as OniaCenterProfile[];
  const profile = profiles.find((item) => item.status === "active") ?? profiles[0];
  return normalizeRoleKey(profile?.primary_role_key);
}

const NUVIA_STORE_ORIGIN = "https://nuvia-store.vercel.app";

function isCenterHost(request: NextRequest) {
  return (request.headers.get("host") || "").includes("center.onia.com.bo");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // El dominio del center (center.onia.com.bo, VPS) no sirve la tienda Nuvia:
  // cualquier /nuvia alli redirige 308 (permanente) al deploy propio de Nuvia,
  // preservando el subpath. Solo aplica en el host del center — nunca en
  // nuvia-store.vercel.app ni en onia-center.vercel.app, que pasan de largo.
  if (isCenterHost(request) && (pathname === "/nuvia" || pathname.startsWith("/nuvia/"))) {
    return NextResponse.redirect(`${NUVIA_STORE_ORIGIN}${pathname}${request.nextUrl.search}`, 308);
  }

  if (!pathname.startsWith("/onia-center") || pathname.startsWith("/onia-center/login")) {
    return NextResponse.next();
  }

  if (!oniaCenterAuthConfigured()) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  if (!accessToken && !refreshToken) {
    return redirectToLogin(request, "auth_required");
  }

  let activeToken = accessToken;
  let refreshed: RefreshedSession | null = null;
  let role = activeToken ? await getOniaCenterSessionRole(activeToken) : null;

  // Access token ausente o expirado (~1h): intentar refrescar con el refresh
  // token (30d) antes de expulsar al usuario. Solo se redirige a login si el
  // refresh tambien falla.
  if (!role && refreshToken) {
    refreshed = await refreshOniaCenterSession(refreshToken);
    if (refreshed) {
      activeToken = refreshed.accessToken;
      role = await getOniaCenterSessionRole(activeToken);
    }
  }

  if (!role || !activeToken) {
    return redirectToLogin(request, accessToken ? "auth_verify" : "auth_required");
  }

  // Los colaboradores viven en las vistas nuevas (next/*): cada page ya filtra
  // el runtime por actor y Finanzas se autoprotege, asi que el middleware solo
  // exige sesion. Encerrarlos en la vista legacy (regla del monolito) les
  // escondia su plan, el pipeline y el estudio. Cualquier ruta vieja los
  // devuelve a la home nueva; Sergio sigue viendo todo, legacy incluido.
  if (role !== "sergio" && !pathname.startsWith("/onia-center/next/")) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/onia-center/next/hoy";
    homeUrl.search = "";
    return applyRefreshedCookies(NextResponse.redirect(homeUrl), refreshed);
  }

  return applyRefreshedCookies(NextResponse.next(), refreshed);
}

export const config = {
  matcher: ["/onia-center/:path*", "/nuvia", "/nuvia/:path*"],
};
