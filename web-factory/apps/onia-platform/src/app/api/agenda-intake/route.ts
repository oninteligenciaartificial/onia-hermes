/**
 * Proxy server-side del intake de leads hacia Onia Center.
 *
 * El agenda-form postea aca (mismo origen) y este handler reenvia al panel por
 * la red interna del VPS con el secreto compartido. El secreto vive solo en el
 * env del servidor de la landing — el browser jamas lo ve.
 *
 * NUNCA falla ni demora el flujo real de la persona: el registro del lead es
 * best-effort y la entrega de lo que vino a buscar no depende de él.
 *
 * Pero SÍ dice cuál de los dos casos ocurrió, porque la pantalla le promete al
 * lead un seguimiento y esa promesa sólo es verdadera si quedó registrado:
 *
 *   · 204 — quedó registrado en Onia Center.
 *   · 202 — se aceptó y NO se pudo registrar (falta config, o el destino no
 *           contestó). El lead se pierde; la pantalla no debe prometerle nada.
 *
 * Antes devolvía 204 en los dos casos, así que la pantalla decía «te
 * escribimos» también cuando el correo se acababa de tirar a la basura.
 */

export const dynamic = "force-dynamic";

/** Aceptado, pero el lead NO quedó registrado: la pantalla no promete nada. */
const NO_REGISTRADO = new Response(null, { status: 202 });
/** Registrado en Onia Center: la promesa de seguimiento es verdadera. */
const REGISTRADO = new Response(null, { status: 204 });

export async function POST(request: Request) {
  const url = process.env.ONIA_CENTER_INTAKE_URL || "";
  const secret = process.env.ONIA_CENTER_INTAKE_SECRET || "";
  if (!url || !secret) {
    console.error("[agenda-intake] sin ONIA_CENTER_INTAKE_URL/SECRET: lead perdido");
    return NO_REGISTRADO.clone();
  }

  let body = "";
  try {
    body = await request.text();
  } catch {
    return NO_REGISTRADO.clone();
  }

  try {
    const respuesta = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-onia-intake-secret": secret,
      },
      body,
      signal: AbortSignal.timeout(4000),
    });
    if (!respuesta.ok) {
      console.error("[agenda-intake] Onia Center rechazo el lead", respuesta.status);
      return NO_REGISTRADO.clone();
    }
  } catch (error) {
    console.error("[agenda-intake] no se pudo registrar el lead", error);
    return NO_REGISTRADO.clone();
  }

  return REGISTRADO.clone();
}
