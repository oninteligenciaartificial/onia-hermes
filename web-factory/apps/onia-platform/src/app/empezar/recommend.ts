/**
 * Lógica de recomendación del wizard /empezar — determinista, sin IA.
 * Fuente: ONIA_WIZARD_EMPEZAR_SPEC_2026.md §3. Misma entrada, misma salida.
 */

export type Rubro = "dental" | "comercio" | "servicios" | "proveedores";
export type Equipo = "solo" | "2-5" | "6-15" | "15+";
export type Tiene =
  | "cuaderno"
  | "web"
  | "chatbot"
  | "sistema"
  | "facturacion"
  | "nada";

export type Precio = "desde-320" | "cotizar" | "a-medida";
export type PlanId = "consultorio" | "clinica" | "grupo";
export type Falta = "web" | "chatbot";
export type Nota = "cuaderno" | "facturacion-incluida" | "compara-demo";

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
  const disponible = rubro === "dental";
  const plan = !disponible
    ? null
    : equipo === "15+"
      ? {
          id: "grupo" as const,
          nombre: "DentalGest — Grupo clínico",
          precio: "a-medida" as const,
        }
      : equipo === "6-15"
        ? {
            id: "clinica" as const,
            nombre: "DentalGest — Clínica",
            precio: "cotizar" as const,
          }
        : {
            id: "consultorio" as const,
            nombre: "DentalGest — Consultorio",
            precio: "desde-320" as const,
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

  return {
    disponible,
    plan,
    faltan,
    yaTenes,
    notas,
    analisisWeb: tiene.has("web") && !!webUrl,
  };
}
