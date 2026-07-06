import { NextResponse } from "next/server";
import { createNuviaCheckout } from "@/lib/nuvia-commerce";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, mode: "invalid_request", message: "El cuerpo del checkout debe ser JSON valido." },
      { status: 400 },
    );
  }

  try {
    const checkout = await createNuviaCheckout(payload);
    return NextResponse.json(checkout, { status: checkout.ok ? 200 : 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido creando checkout.";
    return NextResponse.json({ ok: false, mode: "invalid_request", message }, { status: 500 });
  }
}
