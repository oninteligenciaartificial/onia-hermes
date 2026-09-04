import { NextResponse } from "next/server";
import { getNuviaPaymentStatus } from "@/lib/nuvia-commerce";

export const runtime = "nodejs";

type PaymentStatusRouteProps = {
  params: Promise<{
    paymentId: string;
  }>;
};

export async function GET(_request: Request, { params }: PaymentStatusRouteProps) {
  const { paymentId } = await params;

  if (!paymentId) {
    return NextResponse.json(
      {
        ok: false,
        status: "invalid_request",
        message: "paymentId es requerido.",
      },
      { status: 400 },
    );
  }

  try {
    const status = await getNuviaPaymentStatus(paymentId);
    return NextResponse.json(status, { status: status.ok ? 200 : 404 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido verificando pago.";
    return NextResponse.json(
      {
        ok: false,
        status: "error",
        message,
      },
      { status: 500 },
    );
  }
}
