import { describe, expect, it } from "vitest";
import {
  ASSISTANT_COLORS,
  ASSISTANT_RUBROS,
  buildAssistantPlan,
  describeAssistantPlan,
  EMPTY_ASSISTANT_ANSWERS,
  inferCity,
  inferRubro,
} from "./web-assistant";
import { DEFAULT_LAYOUT_BY_DIRECTION, WEB_PALETTES } from "./web-configurator";
import { WEB_STACKS } from "./webs";

describe("el asistente arma una web coherente con cuatro respuestas", () => {
  it("cada rubro apunta a una paleta y a un alcance que existen", () => {
    const paletas = new Set(WEB_PALETTES.map((p) => p.id));
    const stacks = new Set(WEB_STACKS.map((s) => s.id));
    for (const rubro of ASSISTANT_RUBROS) {
      expect(paletas.has(rubro.palette), rubro.id).toBe(true);
      expect(stacks.has(rubro.stack), rubro.id).toBe(true);
    }
    for (const color of ASSISTANT_COLORS) expect(paletas.has(color)).toBe(true);
  });

  it("sin contestar nada más que el nombre, el rubro decide todo", () => {
    const plan = buildAssistantPlan({ ...EMPTY_ASSISTANT_ANSWERS, businessName: " Casa Norte ", rubro: "dental" });
    expect(plan.intake.businessName).toBe("Casa Norte");
    expect(plan.intake.industry).toBe("Clínica dental");
    expect(plan.direction).toBe("minimalista");
    expect(plan.layout).toBe(DEFAULT_LAYOUT_BY_DIRECTION.minimalista);
    expect(plan.palette).toBe("azul-confianza");
    expect(plan.goal).toBe("reservas");
    expect(plan.stack).toBe("profesional");
  });

  it("las respuestas del dueño pisan al rubro", () => {
    const plan = buildAssistantPlan({
      phrase: "",
      businessName: "Alma",
      rubro: "dental",
      goal: "contactos",
      feel: "premium",
      color: "terracota-crema",
    });
    expect(plan.direction).toBe("editorial");
    expect(plan.layout).toBe("portada");
    expect(plan.font).toBe("editorial");
    expect(plan.palette).toBe("terracota-crema");
    expect(plan.goal).toBe("contactos");
  });

  it("un catálogo siempre sale en vitrina y como tienda, elija lo que elija el rubro", () => {
    const plan = buildAssistantPlan({ ...EMPTY_ASSISTANT_ANSWERS, businessName: "X", rubro: "servicios", goal: "catalogo", feel: "premium" });
    expect(plan.direction).toBe("catalogo");
    expect(plan.layout).toBe("vitrina");
    expect(plan.stack).toBe("tienda");
  });

  it("el ecommerce sobre plataforma conserva su alcance aunque el objetivo sea catálogo", () => {
    const plan = buildAssistantPlan({ ...EMPTY_ASSISTANT_ANSWERS, businessName: "X", rubro: "ecommerce" });
    expect(plan.goal).toBe("catalogo");
    expect(plan.layout).toBe("vitrina");
    expect(plan.stack).toBe("ecommerce");
    expect(WEB_STACKS.find((s) => s.id === "ecommerce")?.precio).toBeNull();
  });
});

describe("una frase sobre el negocio elige el rubro y la ciudad (la entrada de una caja, como la competencia)", () => {
  it("reconoce el rubro por palabras clave, lo específico antes que lo genérico", () => {
    expect(inferRubro("Clínica dental en Santa Cruz")).toBe("dental");
    expect(inferRubro("Tienda online de cursos por Hotmart")).toBe("ecommerce");
    expect(inferRubro("Tienda de ropa en Cochabamba")).toBe("comercio");
    expect(inferRubro("Importamos repuestos de China")).toBe("importadora");
    expect(inferRubro("Estudio contable para pymes")).toBe("servicios");
    expect(inferRubro("Centro de estética y spa")).toBe("estetica");
    expect(inferRubro("Hacemos cosas")).toBeNull();
  });

  it("la ciudad sale de «en Mayúscula»; una frase sin ciudad no inventa una", () => {
    expect(inferCity("Clínica dental en Santa Cruz de la Sierra, atendemos urgencias")).toBe("Santa Cruz de la Sierra");
    expect(inferCity("Estudio contable en La Paz")).toBe("La Paz");
    expect(inferCity("Vendemos en la zona sur")).toBe("");
    expect(inferCity("")).toBe("");
  });

  it("la frase viaja al plan como bajada y ciudad, y el brief «Entendí» la resume", () => {
    const answers = { ...EMPTY_ASSISTANT_ANSWERS, phrase: " Clínica dental en La Paz ", businessName: "Amanecer", rubro: "dental" as const };
    const plan = buildAssistantPlan(answers);
    expect(plan.intake.description).toBe("Clínica dental en La Paz");
    expect(plan.intake.city).toBe("La Paz");
    expect(describeAssistantPlan(answers, plan)).toBe(
      "Entendí: clínica dental en La Paz · para conseguir reservas · estilo minimalista · colores azul + blanco.",
    );
  });

  it("sin frase no hay bajada ni ciudad, y «Otro» se describe por el nombre", () => {
    const answers = { ...EMPTY_ASSISTANT_ANSWERS, businessName: "Casa Norte" };
    const plan = buildAssistantPlan(answers);
    expect(plan.intake.description).toBe("");
    expect(plan.intake.city).toBe("");
    expect(describeAssistantPlan(answers, plan)).toMatch(/^Entendí: Casa Norte · para /);
  });
});
