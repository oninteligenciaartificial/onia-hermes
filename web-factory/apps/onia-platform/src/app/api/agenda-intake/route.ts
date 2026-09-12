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

/**
 * Blindaje del único endpoint público del sitio (auditoría 2026-09-11: era un
 * passthrough sin tope ni forma — cualquiera podía floodearlo o meter JSON
 * arbitrario en onia_center.leads con el secreto compartido puesto por
 * NOSOTROS).
 *
 * · Tope de tamaño ANTES de parsear.
 * · El body se RECONSTRUYE con los tres campos que el único formulario manda
 *   (CapturaGuia.tsx: email/whatsapp/src) — lo que no es eso no viaja.
 * · Rate limit por IP en memoria: 10/min por IP, mapa acotado. Es por
 *   instancia (un solo contenedor sirve la landing) y es la primera capa; la
 *   capa fuerte es una regla de rate limiting en Cloudflare (pendiente de
 *   Sergio Urcullo, ya anotada con la de caché).
 * Todo rechazo responde NO_REGISTRADO (202): la pantalla no promete nada y a
 * un flooder no le contamos qué filtro lo paró.
 */
const BODY_MAX = 4_096;
const CAMPO_MAX = 320;
const RATE_MAX = 10;
const RATE_VENTANA_MS = 60_000;
const RATE_MAPA_MAX = 5_000; // ponytail: se vacía entero al llenarse; LRU si algún día importa
const porIp = new Map<string, { n: number; hasta: number }>();

function pasaRateLimit(request: Request): boolean {
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "sin-ip";
  const ahora = Date.now();
  const fila = porIp.get(ip);
  if (!fila || ahora > fila.hasta) {
    if (porIp.size >= RATE_MAPA_MAX) porIp.clear();
    porIp.set(ip, { n: 1, hasta: ahora + RATE_VENTANA_MS });
    return true;
  }
  fila.n += 1;
  return fila.n <= RATE_MAX;
}

function campo(valor: unknown): string {
  return typeof valor === "string" ? valor.slice(0, CAMPO_MAX) : "";
}

export async function POST(request: Request) {
  const url = process.env.ONIA_CENTER_INTAKE_URL || "";
  const secret = process.env.ONIA_CENTER_INTAKE_SECRET || "";
  if (!url || !secret) {
    console.error("[agenda-intake] sin ONIA_CENTER_INTAKE_URL/SECRET: lead perdido");
    return NO_REGISTRADO.clone();
  }

  if (!pasaRateLimit(request)) {
    return NO_REGISTRADO.clone();
  }

  let crudo = "";
  try {
    crudo = await request.text();
  } catch {
    return NO_REGISTRADO.clone();
  }
  if (crudo.length > BODY_MAX) {
    return NO_REGISTRADO.clone();
  }

  let entrada: unknown;
  try {
    entrada = JSON.parse(crudo);
  } catch {
    return NO_REGISTRADO.clone();
  }
  if (typeof entrada !== "object" || entrada === null) {
    return NO_REGISTRADO.clone();
  }
  const lead = entrada as Record<string, unknown>;
  const email = campo(lead.email);
  const whatsapp = campo(lead.whatsapp);
  const src = campo(lead.src);
  // Sin al menos un dato de contacto no hay lead que registrar.
  if (!email && !whatsapp) {
    return NO_REGISTRADO.clone();
  }
  const body = JSON.stringify({ email, whatsapp, src });

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
