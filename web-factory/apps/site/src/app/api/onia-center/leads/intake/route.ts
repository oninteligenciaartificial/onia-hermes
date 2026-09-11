import { NextResponse } from "next/server";
import {
  createOniaCenterEntity,
  isOniaCenterConfigured,
  type RuntimeLead,
} from "@/lib/onia-center-store";
import { intencionDelLead } from "@/lib/intencion-del-lead.mjs";

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
  /*
   * El correo se leía en ningún lado: el agenda-form nunca lo mandaba, así que
   * el campo no existía acá. El lead magnet (/guia-facturacion) pide UN solo
   * dato obligatorio y es este, así que sin leerlo un envío de solo-correo
   * caía en `missing_fields` y el lead se perdía entero — 422 silencioso, con
   * la persona viendo que todo salió bien.
   *
   * Se valida el FORMATO acá y no solo en el formulario: `/api/agenda-intake`
   * es público y de mismo origen, así que un POST directo nunca pasa por el
   * regex del cliente. Un correo que no es un correo no identifica a nadie, y
   * desde este cambio es lo único que puede sostener un lead entero.
   */
  const emailCrudo = clean(body.email);
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailCrudo)
    ? emailCrudo
    : "";

  if (!business && !name && !email) {
    return NextResponse.json({ error: "missing_fields" }, { status: 422 });
  }

  /*
   * Quién pidió una reunión lo dice el llamador, y nadie más. Este endpoint se
   * escribió para un agenda-form que sí la pedía, y hoy su único llamador vivo
   * es `/guia-facturacion`: el imán de leads del SIN, que entrega una hoja
   * imprimible y no ofrece ninguna reunión. Hasta el 2026-09-11 todo lead que
   * entraba por acá quedaba en el pipeline de Sergio Urcullo como demo pedida.
   * El porqué de que la excusa sea explícita está en el módulo.
   */
  const intencion = intencionDelLead({ pidioDemo: body.pidioDemo, rubro });

  const lead: RuntimeLead = {
    id: "",
    company: business || name || email,
    contact: [name, whatsapp, email].filter(Boolean).join(" · "),
    source: src || "landing",
    serviceId: "",
    status: "nuevo",
    nextAction: intencion.nextAction,
    owner: "sergio",
    meetingOwner: "sergio",
    meetingStatus: intencion.meetingStatus,
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
