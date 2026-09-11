/**
 * Qué pidió el lead: una reunión, o nada todavía.
 *
 * POR QUÉ EXISTE, medido el 2026-09-11 contra producción: el intake
 * (`api/onia-center/leads/intake`) clavaba `nextAction: "Confirmar demo"` y
 * `meetingStatus: "solicitada"` para TODO lead, sin mirar de dónde venía. Ese
 * endpoint se escribió para un agenda-form que pedía una demo; hoy su ÚNICO
 * llamador vivo es `/guia-facturacion`, el imán de leads del SIN, que pide un
 * correo a cambio de una hoja imprimible y no ofrece ninguna reunión.
 *
 * No es cosmético: `meetingStatus === "solicitada"` es lo que mira el panel para
 * decir que alguien pidió reunión — el contador de `onia-center/equipo`, su
 * lista de reuniones y el filtro de `onia-center/next/hoy`. O sea que cada
 * descarga de la hoja entraba al pipeline de Sergio Urcullo como una demo
 * pedida, mezclada con las que sí. Ningún gate podía verlo: el lead se guarda
 * bien, la pantalla responde, no sobra ni falta una palabra — lo que estaba mal
 * era el par (de dónde vino, qué se afirma que pidió).
 *
 * LA REGLA: un lead NO pidió reunión salvo que quien lo manda lo DIGA. Se
 * enumera la excusa (`pidioDemo: true`), no los orígenes que no son demo: una
 * lista de orígenes falla ABIERTA el día que nace un imán de leads nuevo, y
 * falla en la dirección cara (contamina el pipeline y nada se pone en rojo).
 *
 * `"pendiente"` y no `undefined` a propósito: es exactamente lo que escribe el
 * alta manual del panel (`onia-center/components/views/pipeline/NewLeadForm.tsx`)
 * para un lead sin reunión. Ese hermano sano es el que escondía este defecto.
 */

/**
 * @param {{ pidioDemo?: unknown, rubro?: string }} lead
 * @returns {{ nextAction: string, meetingStatus: "pendiente" | "solicitada" }}
 */
export function intencionDelLead(lead) {
  const rubro = typeof lead?.rubro === "string" ? lead.rubro.trim() : "";
  const sufijo = rubro ? ` (${rubro})` : "";

  // `=== true` y no un truthy: el body llega de la red y un "false" o un 0
  // no pueden significar que alguien pidió una reunión.
  if (lead?.pidioDemo === true) {
    return { nextAction: `Confirmar demo${sufijo}`, meetingStatus: "solicitada" };
  }

  return { nextAction: `Primer contacto${sufijo}`, meetingStatus: "pendiente" };
}
