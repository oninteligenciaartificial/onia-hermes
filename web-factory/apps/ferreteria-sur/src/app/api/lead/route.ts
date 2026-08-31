import { NextRequest, NextResponse } from "next/server";

/**
 * CONEXIÓN A ONIA PLATFORM — circuito web → sistema.
 *
 * El navegador postea acá SIN credencial. Esta ruta corre en el server y es la
 * única que ve `ONIA_LEAD_WEBHOOK` / `ONIA_N8N_API_KEY`; nada de eso viaja al
 * cliente ni lleva prefijo NEXT_PUBLIC_.
 *
 * Contrato: el destino es el webhook de n8n que valida y llama a
 * POST /api/n8n/web-leads del producto con header X-N8N-API-KEY
 * (ver web-factory/docs/CONEXION_WEB_SISTEMA_API.md).
 *
 * GATEADO POR ENV, SIN FINGIR: si no hay webhook configurado, o si el upstream
 * falla, esta ruta NO responde "ok". Devuelve un error explícito y el
 * formulario le ofrece a la persona el camino que sí está vivo hoy: mandar la
 * lista por WhatsApp. Un "gracias, te contactamos" sobre un canal apagado es
 * mentira y pierde al cliente en silencio.
 *
 * El lead nunca se tira: en los dos caminos de fallo queda en el log del server
 * para recuperarlo a mano.
 */

const SLUG = "ferreteria-sur";
const MAX = 2000; // tope de texto libre: un pedido real no pasa de acá

function limpiar(v: unknown, max = 120): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }
  const b = body as Record<string, unknown>;

  // ── Validación en el borde: no se confía en el cliente, y el mensaje le dice
  //    a la persona QUÉ hacer, no que "el campo es requerido".
  const nombre = limpiar(b.nombre, 80);
  const whatsapp = limpiar(b.whatsapp, 30);
  const lista = limpiar(b.lista, MAX);

  if (!nombre) {
    return NextResponse.json({ error: "Poné tu nombre para saber a quién le contestamos." }, { status: 422 });
  }
  if (whatsapp.replace(/\D/g, "").length < 7) {
    return NextResponse.json(
      { error: "Dejá tu WhatsApp con código de país, así: +591 7xxxxxxx." },
      { status: 422 },
    );
  }
  if (!lista) {
    return NextResponse.json(
      { error: "Escribí qué necesitás, aunque sea aproximado: medida, cantidad o para qué es." },
      { status: 422 },
    );
  }

  const lead = {
    slug: SLUG,
    rubro: "comercio",
    nombre,
    whatsapp,
    lista,
    tipo: limpiar(b.tipo, 60) || null,
    entrega: limpiar(b.entrega, 40) || null,
    src: limpiar(b.src, 60) || SLUG,
    recibido: new Date().toISOString(),
  };

  const webhook = process.env.ONIA_LEAD_WEBHOOK;
  const apiKey = process.env.ONIA_N8N_API_KEY;

  if (!webhook) {
    console.error("[lead] ONIA_LEAD_WEBHOOK sin configurar — lead NO entregado:", lead);
    return NextResponse.json(
      {
        error: "No podemos recibir el pedido por el formulario en este momento.",
        delivered: false,
      },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(apiKey ? { "X-N8N-API-KEY": apiKey } : {}),
      },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[lead] fallo al entregar a Onia:", err, lead);
    return NextResponse.json(
      { error: "No pudimos entregar el pedido al sistema.", delivered: false },
      { status: 502 },
    );
  }
}
