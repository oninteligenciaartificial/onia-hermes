import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { confirmLeadMeetingByCompany, upsertCalcomBooking } from "@/lib/onia-center-store";

export const dynamic = "force-dynamic";

/**
 * Webhook de nuestro Cal.com self-hosted (BOOKING_CREATED / RESCHEDULED /
 * CANCELLED). La API key de Cal es feature comercial; los webhooks no — y
 * cierran mejor el circuito: cada reserva queda en el panel sola, y si las
 * notas traen "Negocio: X" (el agenda-form lo mete siempre), la reunion del
 * lead se marca confirmada sin que nadie toque nada.
 *
 * Firma: Cal manda HMAC-SHA256 del body en el header x-cal-signature-256,
 * con el secret que registramos en su tabla Webhook.
 */

function verifySignature(body: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

type CalPayload = {
  triggerEvent?: string;
  payload?: {
    uid?: string;
    bookingId?: number;
    title?: string;
    startTime?: string;
    endTime?: string;
    status?: string;
    attendees?: Array<{ name?: string; email?: string }>;
    additionalNotes?: string;
    description?: string;
    responses?: Record<string, { value?: unknown } | undefined>;
  };
};

function extractNotes(p: NonNullable<CalPayload["payload"]>): string {
  if (p.additionalNotes) return p.additionalNotes;
  if (p.description) return p.description;
  const notesValue = p.responses?.notes?.value;
  return typeof notesValue === "string" ? notesValue : "";
}

export async function POST(request: Request) {
  const secret = process.env.ONIA_CALCOM_WEBHOOK_SECRET || "";
  if (!secret) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const body = await request.text();
  if (!verifySignature(body, request.headers.get("x-cal-signature-256"), secret)) {
    return NextResponse.json({ error: "bad_signature" }, { status: 401 });
  }

  let data: CalPayload;
  try {
    data = JSON.parse(body) as CalPayload;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const p = data.payload;
  const uid = p?.uid || (p?.bookingId ? `booking-${p.bookingId}` : "");
  if (!p || !uid || !p.startTime) {
    return NextResponse.json({ ok: true, skipped: "sin uid o startTime" });
  }

  const cancelled = data.triggerEvent === "BOOKING_CANCELLED";
  const notes = extractNotes(p);

  // "Negocio: X" en las notas identifica el lead creado por el agenda-form.
  let matchedLeadKey: string | null = null;
  if (!cancelled) {
    const match = /Negocio:\s*([^·|]+)/.exec(notes);
    if (match) {
      try {
        matchedLeadKey = await confirmLeadMeetingByCompany(match[1]);
      } catch (error) {
        console.error("[calcom/webhook] no se pudo confirmar el lead", error);
      }
    }
  }

  try {
    await upsertCalcomBooking({
      uid,
      title: p.title,
      startTime: p.startTime,
      endTime: p.endTime,
      attendeeName: p.attendees?.[0]?.name,
      attendeeEmail: p.attendees?.[0]?.email,
      notes,
      status: cancelled ? "cancelada" : "confirmada",
      matchedLeadKey: matchedLeadKey ?? undefined,
      raw: data,
    });
  } catch (error) {
    console.error("[calcom/webhook] no se pudo guardar la reserva", error);
    return NextResponse.json({ error: "store_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, uid, matchedLeadKey });
}
