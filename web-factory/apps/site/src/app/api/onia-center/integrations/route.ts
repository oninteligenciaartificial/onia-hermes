import { NextResponse } from "next/server";
import { integrationConnectors } from "@/app/onia-center/operating-source";
import type { IntegrationStatus, RuntimeConnectorCheck } from "@/app/onia-center/types";

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

export async function GET() {
  const checkedAt = new Date().toISOString();

  const checks: RuntimeConnectorCheck[] = integrationConnectors.map((connector) => {
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
