import { NextResponse } from "next/server";
import {
  createOniaCenterEntity,
  isOniaCenterConfigured,
  type RuntimeLead,
} from "@/lib/onia-center-store";

export const dynamic = "force-dynamic";

/**
 * Intake publico de leads desde la landing (agenda-form de onia-platform).
 *
 * Cierra el circuito de atribucion: la landing captura ?src= de cada pieza de
 * contenido y lo manda aca ANTES de abrir Cal.com, asi el lead queda en el
 * pipeline con su fuente aunque la persona no termine de reservar. Sin este
 * registro no se puede liquidar el bounty por demo atribuible (regla del
 * acuerdo: "si no esta en Onia Center, no existe").
 *
 * Auth: secreto compartido por header, server-to-server (la landing lo guarda
 * en su env y hace proxy; el browser nunca lo ve). Sin secreto configurado el
 * endpoint queda cerrado.
 */

const MAX_FIELD = 200;

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, MAX_FIELD) : "";
}

export async function POST(request: Request) {
  const secret = process.env.ONIA_CENTER_INTAKE_SECRET || "";
  if (!secret || request.headers.get("x-onia-intake-secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isOniaCenterConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const name = clean(body.nombre);
  const business = clean(body.negocio);
  const whatsapp = clean(body.whatsapp);
  const rubro = clean(body.rubro);
  const src = clean(body.src);

  if (!business && !name) {
    return NextResponse.json({ error: "missing_fields" }, { status: 422 });
  }

  const lead: RuntimeLead = {
    id: "",
    company: business || name,
    contact: [name, whatsapp].filter(Boolean).join(" · "),
    source: src || "landing",
    serviceId: "",
    status: "nuevo",
    nextAction: rubro ? `Confirmar demo (${rubro})` : "Confirmar demo",
    owner: "sergio",
    meetingOwner: "sergio",
    meetingStatus: "solicitada",
    createdAt: new Date().toISOString(),
  };

  try {
    const created = await createOniaCenterEntity("lead", lead);
    return NextResponse.json({ ok: true, id: (created as RuntimeLead).id });
  } catch (error) {
    console.error("[leads/intake] no se pudo crear el lead", error);
    return NextResponse.json({ error: "create_failed" }, { status: 502 });
  }
}
