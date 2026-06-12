import { describe, expect, it } from "vitest";
import { clientSchema } from "./schema";

describe("clientSchema", () => {
  it("applies sensible defaults to a minimal client", () => {
    const client = clientSchema.parse({ nombre: "Demo", slug: "demo" });

    expect(client.colores.primary).toBe("#0f766e");
    expect(client.tipografia.heading).toBe("Inter");
    expect(client.servicios).toHaveLength(3);
    expect(client.cta.url).toBe("/contacto");
  });

  it("rejects invalid color tokens", () => {
    expect(() =>
      clientSchema.parse({
        nombre: "Bad Color",
        slug: "bad-color",
        colores: { primary: "teal" },
      }),
    ).toThrow();
  });
});
