import { NextResponse } from "next/server";
import { getOniaCenterActor, isSergio } from "@/lib/onia-center-auth";
import { listFinanceEntries, createFinanceEntry } from "@/lib/onia-center-store";

export const dynamic = "force-dynamic";

/**
 * Movimientos de plata registrados a mano (que entro y que salio, en Bs).
 * Pedido de Sergio 2026-08-01: "las finanzas se tiene que poder colocar que
 * ganamos, como manejamos las finanzas literalmente". Solo Sergio escribe.
 */

export async function GET(request: Request) {
  const auth = await getOniaCenterActor(request);
  if (!auth.ok || !isSergio(auth.actor)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const entries = await listFinanceEntries();
  return NextResponse.json({ ok: true, entries });
}

export async function POST(request: Request) {
  const auth = await getOniaCenterActor(request);
  if (!auth.ok || !isSergio(auth.actor)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const kind = body.kind === "gasto" ? "gasto" : body.kind === "ingreso" ? "ingreso" : null;
  const concept = typeof body.concept === "string" ? body.concept.trim().slice(0, 200) : "";
  const amountBs = Number(body.amountBs);
  const entryDate = typeof body.entryDate === "string" && body.entryDate ? body.entryDate : undefined;
  const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 500) : "";

  if (!kind || !concept || !Number.isFinite(amountBs) || amountBs <= 0) {
    return NextResponse.json(
      { error: "missing_fields", message: "Falta tipo, concepto o monto (> 0)." },
      { status: 422 },
    );
  }

  try {
    const entry = await createFinanceEntry({ kind, concept, amountBs, entryDate, notes });
    return NextResponse.json({ ok: true, entry });
  } catch (error) {
    console.error("[finance/entries] no se pudo registrar", error);
    return NextResponse.json({ error: "create_failed" }, { status: 502 });
  }
}
