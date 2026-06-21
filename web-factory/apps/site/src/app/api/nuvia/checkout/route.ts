import { NextResponse } from "next/server";
import { createNuviaCheckout, type NuviaCheckoutRequest } from "@/lib/nuvia-commerce";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: NuviaCheckoutRequest;

  try {
    payload = (await request.json()) as NuviaCheckoutRequest;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        mode: "invalid_request",
        message: "El cuerpo del checkout debe ser JSON valido.",
      },
      { status: 400 },
    );
  }

  try {
    const checkout = await createNuviaCheckout(payload);
    return NextResponse.json(checkout, { status: checkout.ok ? 200 : 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido creando checkout.";
    return NextResponse.json(
      {
        ok: false,
        mode: "invalid_request",
        message,
      },
      { status: 500 },
    );
  }
}
