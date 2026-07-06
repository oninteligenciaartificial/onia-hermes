import { describe, expect, it } from "vitest";
import { pickCredencialIcon, renderIcon } from "./icons";

describe("renderIcon", () => {
  it("renders an inline svg with the requested class", () => {
    const html = renderIcon("check", "wf-icon wf-x");
    expect(html).toContain("<svg");
    expect(html).toContain('class="wf-icon wf-x"');
  });

  it("falls back to the check icon for an unknown name", () => {
    expect(renderIcon("not-a-real-icon")).toBe(renderIcon("check"));
  });
});

describe("pickCredencialIcon", () => {
  it("matches health vocabulary", () => {
    expect(pickCredencialIcon("Matricula profesional")).toBe("award");
    expect(pickCredencialIcon("Esterilizacion por ciclo certificada")).toBe("shield-check");
    expect(pickCredencialIcon("Atencion de urgencias el mismo dia")).toBe("activity");
  });

  it("matches general business vocabulary (engineering/other rubros)", () => {
    expect(pickCredencialIcon("Colegio de Ingenieros habilitado")).toBe("award");
    expect(pickCredencialIcon("Mas de 80 proyectos entregados")).toBe("star");
    expect(pickCredencialIcon("15 anos de trayectoria")).toBe("star");
    expect(pickCredencialIcon("Atencion 24/7")).toBe("activity");
  });

  it("falls back to a generic check for unmatched text", () => {
    expect(pickCredencialIcon("Envio gratis")).toBe("check");
  });
});
