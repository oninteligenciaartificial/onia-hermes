/**
 * Lógica de recomendación del wizard /empezar — determinista, sin IA.
 * Fuente: ONIA_WIZARD_EMPEZAR_SPEC_2026.md §3. Misma entrada, misma salida.
 *
 * El NOMBRE del plan recomendado se lee del catálogo (`plan(id).nombre`) y no se tipea: acá
 * decía "Plan Pro" y "Plan Full" mientras el checkout —la pantalla siguiente— los llamaba
 * "Profesional" y "Completo". Un nombre tipeado no lo ve ningún cruce de precios.
 */
import { GRUPO, plan as planDelCatalogo, type PlanId as PlanDelCatalogo } from "@/lib/pricing";


export type Rubro = "dental" | "comercio" | "servicios" | "proveedores" | "estetica";
export type Equipo = "solo" | "2-5" | "6-15" | "15+";
export type Tiene =
  | "cuaderno"
  | "web"
  | "chatbot"
  | "sistema"
  | "facturacion"
  | "nada";

export type Precio = "pro" | "full" | "a-medida";
/**
 * El wizard NO tiene su propia lista de planes: los ids salen del catálogo, más el grupal,
 * que no es un escalón de la escalera (no se compra en línea, se cotiza).
 *
 * Tipeada a mano, esta lista se quedó sin el Crece cuando entró la escalera C (2026-09-12) y
 * el downsell siguió mandando al Básico como si fuera el escalón de abajo del Profesional.
 */
export type PlanId = PlanDelCatalogo | "grupo";
export type Falta = "web" | "chatbot";
export type Nota =
  | "cuaderno"
  | "facturacion-incluida"
  | "compara-demo"
  | "downsell-basico";

/**
 * `plan` NO es opcional, y `disponible` ya no existe.
 *
 * Los dos campos sostenían la variante "próximamente" del resultado: un rubro
 * sin plan caía en una pantalla que lo dibujaba a medio armar. Como el wizard
 * sólo ofrece rubros que se contratan hoy (ver `RUBRO_OPTIONS`), ese estado no
 * tenía sujeto — pero mientras el tipo lo admitía, la pantalla de obra seguía
 * en el árbol esperando quién la encendiera. El tipo es ahora el que garantiza
 * que no puede volver.
 */
export interface Recomendacion {
  plan: { id: PlanId; nombre: string; precio: Precio };
  faltan: Falta[];
  yaTenes: Tiene[];
  notas: Nota[];
  analisisWeb: boolean;
}

export function recomendar(
  rubro: Rubro,
  equipo: Equipo,
  tiene: ReadonlySet<Tiene>,
  webUrl?: string,
): Recomendacion {
  // Los planes son los publicados en /#precios (Basico/Pro/Full). Regla de
  // venta (04-OBJECIONES §4): se recomienda el Pro primero; el Basico aparece
  // como downsell, nunca como apertura. Onia es UNA plataforma: los planes no
  // llevan marca de rubro.
  //
  // Todo rubro del selector se contrata hoy (RUBRO_OPTIONS), así que siempre
  // hay plan que recomendar. Antes esto empezaba con `!disponible ? null`, y
  // ese null era la puerta a la pantalla de obra.
  const plan =
    equipo === "15+"
      ? {
          id: "grupo" as const,
          // El nombre sale del catálogo: acá decía "Grupo clínico" mientras la línea de
          // precio de abajo, derivada, decía "Grupo / Empresarial" — dos nombres del mismo
          // plan en la misma tarjeta, y el tipeado con vocabulario dental servido a los
          // cinco rubros (un centro de estética de 15+ personas lo leía así en producción).
          nombre: GRUPO.nombre,
          precio: "a-medida" as const,
        }
      : equipo === "6-15"
        ? {
            id: "full" as const,
            nombre: `Plan ${planDelCatalogo("full").nombre}`,
            precio: "full" as const,
          }
        : {
            id: "pro" as const,
            nombre: `Plan ${planDelCatalogo("pro").nombre}`,
            precio: "pro" as const,
          };

  const faltan: Falta[] = [];
  if (!tiene.has("web")) faltan.push("web");
  if (!tiene.has("chatbot")) faltan.push("chatbot");

  const yaTenes = [...tiene].filter(
    (t): t is Tiene => t !== "nada" && t !== "cuaderno",
  );

  const notas: Nota[] = [];
  if (tiene.has("cuaderno") || tiene.has("nada")) notas.push("cuaderno");
  if (!tiene.has("facturacion")) notas.push("facturacion-incluida");
  if (tiene.has("sistema")) notas.push("compara-demo");
  // downsell explicito solo para el consultorio de una persona
  if (equipo === "solo") notas.push("downsell-basico");

  return {
    plan,
    faltan,
    yaTenes,
    notas,
    analisisWeb: tiene.has("web") && !!webUrl,
  };
}
