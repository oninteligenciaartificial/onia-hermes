/**
 * Lógica de recomendación del wizard /empezar — determinista, sin IA.
 * Fuente: ONIA_WIZARD_EMPEZAR_SPEC_2026.md §3. Misma entrada, misma salida.
 */

import { esRubroDisponible } from "./data";

export type Rubro = "dental" | "comercio" | "servicios" | "proveedores";
export type Equipo = "solo" | "2-5" | "6-15" | "15+";
export type Tiene =
  | "cuaderno"
  | "web"
  | "chatbot"
  | "sistema"
  | "facturacion"
  | "nada";

export type Precio = "pro" | "full" | "a-medida";
export type PlanId = "pro" | "full" | "grupo";
export type Falta = "web" | "chatbot";
export type Nota =
  | "cuaderno"
  | "facturacion-incluida"
  | "compara-demo"
  | "downsell-basico";

export interface Recomendacion {
  disponible: boolean;
  plan: { id: PlanId; nombre: string; precio: Precio } | null;
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
  // La disponibilidad sale de RUBRO_OPTIONS y NO se repite aca: estaba
  // hardcodeada en "dental" y mandaba comercio e importadora a la variante
  // "proximamente" aunque el producto ya deja registrarse en los tres.
  const disponible = esRubroDisponible(rubro);
  const plan = !disponible
    ? null
    : equipo === "15+"
      ? {
          id: "grupo" as const,
          nombre: "Grupo clínico",
          precio: "a-medida" as const,
        }
      : equipo === "6-15"
        ? {
            id: "full" as const,
            nombre: "Plan Full",
            precio: "full" as const,
          }
        : {
            id: "pro" as const,
            nombre: "Plan Pro",
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
  if (disponible && equipo === "solo") notas.push("downsell-basico");

  return {
    disponible,
    plan,
    faltan,
    yaTenes,
    notas,
    analisisWeb: tiene.has("web") && !!webUrl,
  };
}
