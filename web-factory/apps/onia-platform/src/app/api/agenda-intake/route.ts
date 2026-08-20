/**
 * Proxy server-side del intake de leads hacia Onia Center.
 *
 * El agenda-form postea aca (mismo origen) y este handler reenvia al panel por
 * la red interna del VPS con el secreto compartido. El secreto vive solo en el
 * env del servidor de la landing — el browser jamas lo ve.
 *
 * Siempre responde 204: el registro del lead es best-effort y NUNCA puede
 * romper ni demorar el flujo real de la persona (abrir Cal.com y reservar).
 */

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const url = process.env.ONIA_CENTER_INTAKE_URL || "";
  const secret = process.env.ONIA_CENTER_INTAKE_SECRET || "";
  if (!url || !secret) {
    return new Response(null, { status: 204 });
  }

  let body = "";
  try {
    body = await request.text();
  } catch {
    return new Response(null, { status: 204 });
  }

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-onia-intake-secret": secret,
      },
      body,
      signal: AbortSignal.timeout(4000),
    });
  } catch (error) {
    console.error("[agenda-intake] no se pudo registrar el lead", error);
  }

  return new Response(null, { status: 204 });
}
