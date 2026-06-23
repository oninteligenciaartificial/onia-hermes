import { NextResponse } from "next/server";
import {
  createOniaCenterEntity,
  filterOniaCenterRuntimeForRole,
  getMissingOniaCenterConfig,
  getOniaCenterRuntime,
  isOniaCenterConfigured,
  updateOniaCenterEntityStatus,
  type RuntimeEntity,
} from "@/lib/onia-center-store";
import { getOniaCenterActor, isSergio, type OniaCenterAuthResult } from "@/lib/onia-center-auth";
import type { RoleId } from "@/app/onia-center/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function configurationPendingResponse() {
  return NextResponse.json(
    {
      ok: false,
      mode: "configuration_pending",
      message: "ONIA Center aun no tiene Supabase server-side configurado.",
      missingConfiguration: getMissingOniaCenterConfig(),
      data: null,
    },
    { status: 200 },
  );
}

function authFailureResponse(auth: Extract<OniaCenterAuthResult, { ok: false }>) {
  return NextResponse.json(
    {
      ok: false,
      mode: auth.code,
      message: auth.message,
      missingConfiguration: auth.missingConfiguration ?? [],
      data: null,
    },
    { status: auth.status },
  );
}

function actorScopedPayload(entity: RuntimeEntity, data: unknown, role: RoleId) {
  if (role === "sergio") {
    return data;
  }

  if (entity === "lead" && typeof data === "object" && data) {
    return { ...data, owner: role };
  }

  if (entity === "task" && typeof data === "object" && data) {
    return { ...data, assignedRole: role };
  }

  if (entity === "note" && typeof data === "object" && data) {
    return { ...data, actorRole: role };
  }

  if (entity === "idea" && typeof data === "object" && data) {
    const source = data as Record<string, unknown>;
    return {
      ...source,
      owner: role,
      visibility: source.visibility === "team_safe" ? "team_safe" : "assigned_only",
      status: "inbox",
    };
  }

  return data;
}

export async function GET(request: Request) {
  if (!isOniaCenterConfigured()) {
    return configurationPendingResponse();
  }

  const auth = await getOniaCenterActor(request);
  if (!auth.ok) {
    return authFailureResponse(auth);
  }

  try {
    const data = filterOniaCenterRuntimeForRole(await getOniaCenterRuntime(), auth.actor.role);
    return NextResponse.json({
      ok: true,
      mode: "supabase",
      message: "ONIA Center conectado a Supabase self-hosted.",
      missingConfiguration: [],
      actor: {
        userKey: auth.actor.userKey,
        displayName: auth.actor.displayName,
        role: auth.actor.role,
      },
      data,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error leyendo ONIA Center.";
    return NextResponse.json(
      {
        ok: false,
        mode: "supabase_error",
        message,
        missingConfiguration: [],
        data: null,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!isOniaCenterConfigured()) {
    return configurationPendingResponse();
  }

  const auth = await getOniaCenterActor(request);
  if (!auth.ok) {
    return authFailureResponse(auth);
  }

  let payload: { entity?: RuntimeEntity; data?: unknown };

  try {
    payload = (await request.json()) as { entity?: RuntimeEntity; data?: unknown };
  } catch {
    return NextResponse.json({ ok: false, message: "El cuerpo debe ser JSON valido." }, { status: 400 });
  }

  if (!payload.entity || !payload.data) {
    return NextResponse.json({ ok: false, message: "entity y data son requeridos." }, { status: 400 });
  }

  try {
    const data = await createOniaCenterEntity(payload.entity, actorScopedPayload(payload.entity, payload.data, auth.actor.role));
    return NextResponse.json({ ok: true, mode: "supabase", data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error guardando ONIA Center.";
    return NextResponse.json({ ok: false, mode: "supabase_error", message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!isOniaCenterConfigured()) {
    return configurationPendingResponse();
  }

  const auth = await getOniaCenterActor(request);
  if (!auth.ok) {
    return authFailureResponse(auth);
  }

  let payload: { entity?: RuntimeEntity; id?: string; status?: string };

  try {
    payload = (await request.json()) as { entity?: RuntimeEntity; id?: string; status?: string };
  } catch {
    return NextResponse.json({ ok: false, message: "El cuerpo debe ser JSON valido." }, { status: 400 });
  }

  if (!payload.entity || !payload.id || !payload.status) {
    return NextResponse.json({ ok: false, message: "entity, id y status son requeridos." }, { status: 400 });
  }

  if (!isSergio(auth.actor) && payload.entity === "review") {
    return NextResponse.json({ ok: false, mode: "forbidden", message: "Solo Sergio puede aprobar o rechazar revisiones." }, { status: 403 });
  }

  if (!isSergio(auth.actor) && payload.entity === "idea" && payload.status === "approved") {
    return NextResponse.json({ ok: false, mode: "forbidden", message: "Solo Sergio puede aprobar ideas." }, { status: 403 });
  }

  if (!isSergio(auth.actor) && payload.entity === "task" && payload.status === "done") {
    return NextResponse.json({ ok: false, mode: "forbidden", message: "El equipo puede mover tareas a revision; Sergio aprueba el cierre." }, { status: 403 });
  }

  try {
    const data = await updateOniaCenterEntityStatus(payload.entity, payload.id, payload.status, auth.actor.role);
    return NextResponse.json({ ok: true, mode: "supabase", data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error actualizando ONIA Center.";
    return NextResponse.json({ ok: false, mode: "supabase_error", message }, { status: 500 });
  }
}
