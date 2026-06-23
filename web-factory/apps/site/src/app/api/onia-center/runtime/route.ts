import { NextResponse } from "next/server";
import {
  createOniaCenterEntity,
  getMissingOniaCenterConfig,
  getOniaCenterRuntime,
  isOniaCenterConfigured,
  updateOniaCenterEntityStatus,
  type RuntimeEntity,
} from "@/lib/onia-center-store";

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

export async function GET() {
  if (!isOniaCenterConfigured()) {
    return configurationPendingResponse();
  }

  try {
    const data = await getOniaCenterRuntime();
    return NextResponse.json({
      ok: true,
      mode: "supabase",
      message: "ONIA Center conectado a Supabase self-hosted.",
      missingConfiguration: [],
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
    const data = await createOniaCenterEntity(payload.entity, payload.data);
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

  let payload: { entity?: RuntimeEntity; id?: string; status?: string };

  try {
    payload = (await request.json()) as { entity?: RuntimeEntity; id?: string; status?: string };
  } catch {
    return NextResponse.json({ ok: false, message: "El cuerpo debe ser JSON valido." }, { status: 400 });
  }

  if (!payload.entity || !payload.id || !payload.status) {
    return NextResponse.json({ ok: false, message: "entity, id y status son requeridos." }, { status: 400 });
  }

  try {
    const data = await updateOniaCenterEntityStatus(payload.entity, payload.id, payload.status);
    return NextResponse.json({ ok: true, mode: "supabase", data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error actualizando ONIA Center.";
    return NextResponse.json({ ok: false, mode: "supabase_error", message }, { status: 500 });
  }
}
