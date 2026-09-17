import { describe, expect, it } from "vitest";
import {
  ASSISTANT_COLORS,
  ASSISTANT_RUBROS,
  buildAssistantPlan,
  EMPTY_ASSISTANT_ANSWERS,
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
});
