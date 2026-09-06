/**
 * Armado del mensaje de WhatsApp prellenado — la ÚNICA salida real del wizard
 * (spec §4: nada viaja a servidores de ONIA; wa.me lo abre el usuario).
 */

import { waLink } from "@/lib/site";
import { EQUIPO_MSG, RUBRO_MSG, TIENE_MSG } from "./data";
import type { Equipo, Recomendacion, Rubro, Tiene } from "./recommend";

/** Normaliza la URL solo para legibilidad: sin protocolo ni barra final. */
export function normalizeUrl(raw: string): string {
  const limpio = raw.trim();
  if (!limpio) return "";
  return limpio.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
}

const ORDEN_TIENE: readonly Tiene[] = [
  "cuaderno",
  "web",
  "chatbot",
  "sistema",
  "facturacion",
];

function listaHoyTengo(tiene: readonly Tiene[], url: string): string {
  const partes: string[] = [];
  for (const t of ORDEN_TIENE) {
    if (!tiene.includes(t)) continue;
    if (t === "web") {
      partes.push(url ? `página web (${url})` : "página web");
    } else if (t !== "nada") {
      partes.push(TIENE_MSG[t]);
    }
  }
  return partes.length > 0 ? partes.join(", ") : "nada todavía";
}

export function buildWaText(
  rubro: Rubro,
  equipo: Equipo,
  tiene: readonly Tiene[],
  webUrl: string,
  rec: Recomendacion,
): string {
  const url = normalizeUrl(webUrl);
  const hoy = listaHoyTengo(tiene, url);
  const cabecera = `Hola, vengo del asistente de Onia. Mi rubro: ${RUBRO_MSG[rubro]}`;
  const equipoTxt = `Equipo: ${EQUIPO_MSG[equipo]}.`;

  // Acá había una segunda rama, la del rubro sin plan. Estaba DORMIDA —los
  // cinco rubros de la unión `Rubro` tienen plan— y por eso su texto se pudo
  // pudrir sin que nadie lo viera: decía "(todavía en construcción)" y
  // "Anótenme para que me avisen cuando esté", o sea obra a la vista puesta en
  // boca del lead, al final del embudo y en el único texto que sale de su
  // teléfono. Se reescribió el 2026-09-05 y se ELIMINÓ el 2026-09-06, con el
  // resto de la maquinaria de "próximamente" del wizard: un texto que ningún
  // lead puede ver tampoco lo ve quien lo audita, así que se pudre de nuevo, y
  // el día que despierta entra ya aprobado. Ahora `plan` no es nullable y el
  // selector sólo ofrece rubros que se contratan: el caso no existe, en vez de
  // existir mudo.
  const faltan = rec.faltan
    .map((f) => (f === "web" ? "página web" : "chatbot"))
    .join(", ");
  return (
    `${cabecera}. ${equipoTxt} Hoy tengo: ${hoy}. ` +
    `Me recomendó ${rec.plan.nombre}` +
    (faltan ? ` y me faltarían: ${faltan}` : "") +
    ". Quiero armar mi cuenta." +
    (rec.analisisWeb ? " ¿Me mandan el análisis gratis de mi web?" : "")
  );
}

export function buildWaHref(
  rubro: Rubro,
  equipo: Equipo,
  tiene: readonly Tiene[],
  webUrl: string,
  rec: Recomendacion,
): string {
  return waLink(buildWaText(rubro, equipo, tiene, webUrl, rec));
}
