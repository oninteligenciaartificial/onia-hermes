import { NextResponse } from "next/server";
import { getOniaCenterActor } from "@/lib/onia-center-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await getOniaCenterActor(request);

  if (!auth.ok) {
    return NextResponse.json(
      {
        ok: false,
        mode: auth.code,
        message: auth.message,
        missingConfiguration: auth.missingConfiguration ?? [],
        actor: null,
      },
      { status: auth.status },
    );
  }

  return NextResponse.json({
    ok: true,
    mode: "authenticated",
    actor: {
      userKey: auth.actor.userKey,
      displayName: auth.actor.displayName,
      role: auth.actor.role,
      memberships: auth.actor.memberships.map((membership) => ({
        organizationKey: membership.organizationKey,
        role: membership.role,
        scope: membership.scope,
        canViewSensitive: membership.canViewSensitive,
      })),
    },
  });
}
