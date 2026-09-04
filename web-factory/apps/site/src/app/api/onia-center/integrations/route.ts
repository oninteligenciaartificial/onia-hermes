import { NextResponse } from "next/server";
import { integrationConnectors } from "@/app/onia-center/operating-source";
import type { IntegrationStatus, RuntimeConnectorCheck } from "@/app/onia-center/types";
import { canActorSeeScope, getOniaCenterActor, getOniaCenterAuthConfig, isSergio } from "@/lib/onia-center-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function connectorStatus(baseStatus: IntegrationStatus, missingEnv: string[]): IntegrationStatus {
  if (baseStatus === "blocked" || baseStatus === "manual_only" || baseStatus === "planned") {
    return baseStatus;
  }

  if (missingEnv.length > 0) {
    return "config_pending";
  }

  return baseStatus === "config_pending" ? "ready" : baseStatus;
}

export async function GET(request: Request) {
  const authConfig = getOniaCenterAuthConfig();
  const auth = authConfig ? await getOniaCenterActor(request) : null;

  if (auth && !auth.ok) {
    return NextResponse.json(
      {
        ok: false,
        mode: auth.code,
        message: auth.message,
        missingConfiguration: auth.missingConfiguration ?? [],
        checks: [],
      },
      { status: auth.status },
    );
  }

  const checkedAt = new Date().toISOString();
  const visibleConnectors = auth?.ok
    ? integrationConnectors.filter((connector) => isSergio(auth.actor) || canActorSeeScope(auth.actor, connector.visibility))
    : integrationConnectors;

  const checks: RuntimeConnectorCheck[] = visibleConnectors.map((connector) => {
    const missingEnv = connector.requiredEnv.filter((key) => !process.env[key]);

    return {
      connectorId: connector.id,
      status: connectorStatus(connector.status, missingEnv),
      configured: missingEnv.length === 0,
      missingEnv,
      checkedAt,
    };
  });

  return NextResponse.json({
    ok: true,
    checkedAt,
    checks,
    rule: "Only variable names are returned. Secret values never leave the server.",
  });
}
