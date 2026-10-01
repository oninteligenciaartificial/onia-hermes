import { describe, expect, it } from "vitest";
import { WEB_DIRECTIONS, WEB_FONTS, WEB_GOALS, WEB_LAYOUTS, WEB_PALETTES } from "@/content/web-configurator";
import { WEB_STACKS } from "@/content/webs";
import { decodePlatformSelection, platformRequestUrl } from "./platform-bridge";
const selection = { version: 1 as const, goal: "reservas" as const, layout: "humana" as const, direction: "cercano" as const, palette: "terracota-crema" as const, accent: "#C95F3D", font: "humana" as const, stack: "profesional" as const };
describe("puente a Mi web", () => {
  it("usa origen fijo y sólo preferencias, sin intake/tenant/precio", () => {
    const url = new URL(platformRequestUrl(selection));
    expect(url.origin).toBe("https://app.onia.com.bo");
    expect(url.pathname).toBe("/mi-web");
    expect(Array.from(url.searchParams.keys())).toEqual(["visual"]);
    expect(decodePlatformSelection(url.searchParams.get("visual"))).toEqual(selection);
  });
  for (const [field, values] of Object.entries({ direction: WEB_DIRECTIONS, font: WEB_FONTS, goal: WEB_GOALS, layout: WEB_LAYOUTS, palette: WEB_PALETTES, stack: WEB_STACKS })) {
    it(`acepta todos los IDs de ${field} del configurador existente`, () => {
      for (const item of values) expect(decodePlatformSelection(JSON.stringify({ ...selection, [field]: item.id }))).not.toBeNull();
    });
  }
  it.each([{ version: 2 }, { organizationId: "ajena" }, { contactName: "Ana" }, { price: 0 }, { accent: "url(evil)" }, { layout: "nueva" }])("rechaza payload alterado %j", (change) => {
    expect(decodePlatformSelection(JSON.stringify({ ...selection, ...change }))).toBeNull();
  });
  it("rechaza tamaño excesivo y JSON corrupto", () => {
    expect(decodePlatformSelection("x".repeat(1025))).toBeNull();
    expect(decodePlatformSelection("{")).toBeNull();
  });
});
