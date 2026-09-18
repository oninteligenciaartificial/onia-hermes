import { describe, expect, it } from "vitest";
import { webFactoryIntakeSchema } from "../data/intake-schema";
import { intakeFromPedido, parseConfiguradorMessage, slugify, templateFor } from "./from-configurador";

/** Mensaje REAL capturado del recorrido en producción del 2026-09-17 (wa.me?text=…). */
const MENSAJE = `Hola, vengo del configurador de webs de ONIA.
Llegué desde la página de Sergio.
DATOS DEL NEGOCIO
Contacto: Prueba QA.
Negocio: Clínica Amanecer.
Rubro y ciudad: Clínica dental, Santa Cruz.
WhatsApp: +591 70000000.
Oferta principal: Tu sonrisa, atendida con calma y sin esperas.
Servicios o productos: Limpieza y prevención; Ortodoncia; Implantes
Fotografías: Tengo fotos propias y permiso para usarlas.

ALCANCE Y PRECIO
Nivel: Completa, Web Profesional.
Precio base: Bs 4.500 · pago único.
Estimado de construcción: Bs 4.500.
Forma de pago 50/50: Bs 2.250 para comenzar y Bs 2.250 contra entrega.
Cuidado web: sin plan mensual por ahora.

DISEÑO ELEGIDO
Dirección visual: Minimalista.
Estructura: Esencial (Mensaje → Imagen → Servicios).
Paleta: Azul + blanco. Color principal elegido: #1769AA.
Tipografía: Grotesca limpia.
Objetivo principal: Conseguir reservas.

Leí y entiendo los requisitos: pongo los textos, las fotos y los datos de contacto, y el dominio y el hosting van a mi nombre y se pagan aparte.`;

describe("el mensaje del configurador se vuelve un intake del motor sin inventar nada", () => {
  const pedido = parseConfiguradorMessage(MENSAJE);

  it("lee cada campo por su etiqueta, sin el punto final", () => {
    expect(pedido.negocio).toBe("Clínica Amanecer");
    expect(pedido.rubro).toBe("Clínica dental");
    expect(pedido.ciudad).toBe("Santa Cruz");
    expect(pedido.whatsapp).toBe("+591 70000000");
    expect(pedido.oferta).toBe("Tu sonrisa, atendida con calma y sin esperas");
    expect(pedido.servicios).toEqual(["Limpieza y prevención", "Ortodoncia", "Implantes"]);
    expect(pedido.paleta).toBe("Azul + blanco");
    expect(pedido.color).toBe("#1769AA");
    expect(pedido.tipografia).toBe("Grotesca limpia");
    expect(pedido.objetivo).toBe("Conseguir reservas");
    expect(pedido.origenSergio).toBe(true);
  });

  it("el intake resultante pasa el schema del motor tal cual", () => {
    const intake = intakeFromPedido(pedido);
    const parsed = webFactoryIntakeSchema.safeParse(intake);
    expect(parsed.success, JSON.stringify(parsed.success ? null : parsed.error.issues, null, 1)).toBe(true);
  });

  it("clínica + Web Profesional → landing-clinic; el color elegido manda sobre la paleta", () => {
    const intake = intakeFromPedido(pedido);
    expect(intake.project.slug).toBe("clinica-amanecer");
    expect(intake.project.template).toBe("landing-clinic");
    expect(intake.brand.colors.primary).toBe("#1769AA");
    expect(intake.brand.typography).toEqual({ heading: "Archivo", body: "Inter" });
    expect(intake.conversion.primaryCtaText).toBe("Reservar un turno");
    expect(intake.conversion.primaryCtaUrl).toBe("https://wa.me/59170000000");
    expect(intake.media.assetPermission).toBe("client-owned");
    expect(intake.content.services).toHaveLength(3);
  });

  it("alcances y rubros → template", () => {
    expect(templateFor("Esencial, Landing de Captación", "Comercio")).toBe("landing");
    expect(templateFor("Completa, Web Profesional", "Servicios profesionales")).toBe("landing");
    expect(templateFor("Catálogo, Tienda / catálogo online", "Comercio")).toBe("store");
    expect(templateFor("Plataforma, Ecommerce sobre Shopify, Hotmart o Whop", "Tienda online")).toBe("store");
    expect(slugify("Clínica Ñandú & Cía.")).toBe("clinica-nandu-cia");
  });

  it("un texto que no es del configurador no fabrica un negocio", () => {
    expect(parseConfiguradorMessage("hola, quiero una web").negocio).toBe("");
  });
});
