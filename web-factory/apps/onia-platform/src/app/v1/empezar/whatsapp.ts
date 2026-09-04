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

  if (rec.disponible && rec.plan) {
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

  // Rama sin plan. HOY está dormida —los cinco rubros de la unión `Rubro`
  // tienen plan—, y por eso el texto que tenía se pudo pudrir sin que nadie lo
  // viera: decía "(todavía en construcción)" y "Anótenme para que me avisen
  // cuando esté", o sea obra a la vista puesta en boca del lead, al final del
  // embudo y en el único texto que sale de su teléfono. El día que alguien
  // sume un rubro sin plan, eso se despierta solo. Se dice lo mismo que ya dice
  // la pantalla de esta misma rama (`NOTA_PROXIMAMENTE`): el motor ya corre y
  // el caso se arma con el cliente. La demanda futura se captura sin admitir.
  return (
    `${cabecera}. ${equipoTxt} Hoy tengo: ${hoy}. ` +
    "Quiero que armemos mi caso y me pasen la propuesta." +
    (tiene.includes("web") && url
      ? ` Mi web: ${url} — quiero el análisis gratis.`
      : "")
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
