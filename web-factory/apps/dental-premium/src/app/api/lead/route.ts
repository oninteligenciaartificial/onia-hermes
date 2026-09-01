import { NextRequest, NextResponse } from "next/server";

/**
 * CONEXIÓN A ONIA PLATFORM — circuito web → sistema (el diferencial que nadie
 * en Santa Cruz ofrece). El navegador postea acá SIN credencial; esta ruta
 * server reenvía el lead a Onia con el Bearer/clave del lado servidor.
 *
 * Contrato real (ver web-factory/docs/CONEXION_WEB_SISTEMA_API.md): el destino
 * es el webhook de n8n que valida y llama a POST /api/n8n/web-leads del producto
 * con header X-N8N-API-KEY (patrón lib/n8n-auth.ts, ya vivo en onia-platform).
 *
 * Gateado por env: si ONIA_LEAD_WEBHOOK no está configurado, NO se finge un
 * envío a un sistema inexistente — se registra el lead y se responde ok igual
 * (la web no se rompe), pero el cableado real está escrito y listo para
 * encender con una variable. Honesto: no promete lo que no está encendido.
 */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "cuerpo inválido" }, { status: 400 });
  }

  // Validación en el borde (regla de la casa: no confiar en el cliente).
  const nombre = String(body.nombre ?? "").trim();
  const whatsapp = String(body.whatsapp ?? "").trim();
  if (!nombre || !whatsapp) {
    return NextResponse.json({ error: "faltan nombre o whatsapp" }, { status: 422 });
  }
  const lead = {
    slug: "dental-premium",
    nombre,
    whatsapp,
    tratamiento: String(body.tratamiento ?? "").trim() || null,
    mensaje: String(body.mensaje ?? "").trim() || null,
    src: String(body.src ?? "dental-premium"),
  };

  const webhook = process.env.ONIA_LEAD_WEBHOOK;
  const apiKey = process.env.ONIA_N8N_API_KEY;

  if (!webhook) {
    // Circuito no encendido todavía: se deja constancia server-side, no se
    // finge un sistema. El lead no se pierde (log); el operador lo ve.
    console.log("[lead] circuito Onia no configurado — lead recibido:", lead);
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(apiKey ? { "X-N8N-API-KEY": apiKey } : {}),
      },
      body: JSON.stringify(lead),
    });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    // El lead no se tira: queda en el log para recuperarlo a mano.
    console.error("[lead] fallo al entregar a Onia:", err, lead);
    return NextResponse.json({ ok: true, delivered: false });
  }
}
