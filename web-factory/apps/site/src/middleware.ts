import { NextResponse, type NextRequest } from "next/server";

type OniaCenterProfile = {
  primary_role_key?: string | null;
  status?: string | null;
};

const teamPath = "/onia-center/equipo";

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

function getSupabaseSchema() {
  return process.env.ONIA_CENTER_SUPABASE_SCHEMA || "onia_center";
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

function redirectToTeamView(request: NextRequest) {
  const teamUrl = request.nextUrl.clone();
  teamUrl.pathname = teamPath;
  teamUrl.searchParams.set("from", request.nextUrl.pathname);
  teamUrl.searchParams.set("reason", "team_view");
  return NextResponse.redirect(teamUrl);
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/onia-center") || pathname.startsWith("/onia-center/login")) {
    return NextResponse.next();
  }

  if (!oniaCenterAuthConfigured()) {
    return NextResponse.next();
  }

  const hasSession = Boolean(request.cookies.get("onia_center_access_token")?.value);
  const accessToken = request.cookies.get("onia_center_access_token")?.value;

  if (!hasSession || !accessToken) {
    return redirectToLogin(request, "auth_required");
  }

  const role = await getOniaCenterSessionRole(accessToken);
  if (!role) {
    return redirectToLogin(request, "auth_verify");
  }

  if (pathname === teamPath || pathname.startsWith(`${teamPath}/`)) {
    return NextResponse.next();
  }

  if (role !== "sergio") {
    return redirectToTeamView(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/onia-center/:path*"],
};
