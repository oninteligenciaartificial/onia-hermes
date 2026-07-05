import { NextResponse } from "next/server";
import {
  countOniaCenterTasksByTitlePatterns,
  deleteOniaCenterTasksByTitlePatterns,
  GENERATED_TASK_TITLE_PATTERNS,
  getMissingOniaCenterConfig,
  isOniaCenterConfigured,
} from "@/lib/onia-center-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MaintenanceRequest = {
  action?: string;
  commit?: boolean;
};

function getInternalKey() {
  return process.env.ONIA_CENTER_INTERNAL_API_KEY || process.env.ONIA_DAILY_BRIEFING_API_KEY || "";
}

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  if (authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.slice(7).trim();
  }
  return request.headers.get("x-onia-internal-key") || "";
}

function unauthorized(message: string, status = 401) {
  return NextResponse.json({ ok: false, mode: "unauthorized", message, data: null }, { status });
}

function isAuthorized(request: Request) {
  const expected = getInternalKey();
  if (!expected) {
    return { ok: false as const, response: unauthorized("Falta ONIA_CENTER_INTERNAL_API_KEY para ejecutar mantenimiento interno.", 503) };
  }

  const received = getBearerToken(request);
  if (!received || received !== expected) {
    return { ok: false as const, response: unauthorized("Mantenimiento interno no autorizado.") };
  }

  return { ok: true as const };
}

/**
 * POST /api/onia-center/maintenance
 * Body: { action: "cleanup_generated_tasks", commit?: boolean }
 *
 * Purges the auto-generated backlog left by the daily briefing / hygiene
 * generators (titles like "[Plan 2026-07-04] ...", including stacked prefixes).
 * Dry-run by default: returns how many tasks match. Pass commit:true to delete.
 * Guarded by the same internal key as the other automation endpoints.
 */
export async function POST(request: Request) {
  const authorization = isAuthorized(request);
  if (!authorization.ok) {
    return authorization.response;
  }

  if (!isOniaCenterConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        mode: "configuration_pending",
        message: "ONIA Center necesita Supabase server-side antes de ejecutar mantenimiento.",
        missingConfiguration: getMissingOniaCenterConfig(),
        data: null,
      },
      { status: 200 },
    );
  }

  let payload: MaintenanceRequest = {};
  try {
    payload = (await request.json()) as MaintenanceRequest;
  } catch {
    return NextResponse.json({ ok: false, mode: "bad_request", message: "El cuerpo debe ser JSON valido.", data: null }, { status: 400 });
  }

  const action = payload.action || "cleanup_generated_tasks";
  if (action !== "cleanup_generated_tasks") {
    return NextResponse.json({ ok: false, mode: "bad_request", message: `Accion no soportada: ${action}`, data: null }, { status: 400 });
  }

  const commit = Boolean(payload.commit);

  try {
    if (!commit) {
      const matched = await countOniaCenterTasksByTitlePatterns();
      return NextResponse.json({
        ok: true,
        mode: "maintenance_dry_run",
        message: `Coinciden ${matched} tareas auto-generadas. Enviar commit:true para eliminarlas.`,
        data: { patterns: GENERATED_TASK_TITLE_PATTERNS, matched, deleted: 0 },
      });
    }

    const result = await deleteOniaCenterTasksByTitlePatterns();
    return NextResponse.json({
      ok: true,
      mode: "maintenance_committed",
      message: `Eliminadas ${result.deleted} tareas auto-generadas.`,
      data: { patterns: GENERATED_TASK_TITLE_PATTERNS, matched: result.deleted, deleted: result.deleted, keys: result.keys },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo ejecutar mantenimiento.";
    return NextResponse.json({ ok: false, mode: "maintenance_error", message, data: null }, { status: 500 });
  }
}
