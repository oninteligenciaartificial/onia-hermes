import { NextResponse, type NextRequest } from "next/server";

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/onia-center") || pathname.startsWith("/onia-center/login")) {
    return NextResponse.next();
  }

  if (!oniaCenterAuthConfigured()) {
    return NextResponse.next();
  }

  const hasSession = Boolean(request.cookies.get("onia_center_access_token")?.value);
  if (hasSession) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/onia-center/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/onia-center/:path*"],
};
