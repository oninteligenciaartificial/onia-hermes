/**
 * Self-check PURO del detector de `inclusion-chatbot.mjs`.
 *
 * El cruce VIVO —contra el ref publicado de `onia-platform`— va como alias suelto
 * (`npm run inclusion:chatbot`), porque el producto es otro repositorio y no está en este worktree:
 * exigirlo acá pondría la cadena roja por AMBIENTE y trabaría el merge de todos los carriles. Lo
 * que se prueba acá es el detector, con el catálogo escrito a mano.
 *
 * POR QUE ESTE ARCHIVO EXISTE Y NO ES DECORACION. La primera versión del gate pasaba VERDE con el
 * booleano movido: los textos derivan del espejo del sitio (`nombresConChatbot()`), así que el
 * sitio se estaba comparando consigo mismo. Lo delató una mutación, no una lectura — por eso los
 * dos casos de abajo mueven `whatsappIncluded` en las DOS direcciones y exigen rojo.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

// El guión es `.mjs` a propósito: corre con node suelto en cualquier máquina, sin build.
import { aliasDelSitio, espejoDelSitio, revisarSitio, textosVisibles } from "./inclusion-chatbot.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const APP = dirname(AQUI);

const LABELS = {
  basic: "Básico",
  crece: "Crece",
  professional: "Profesional",
  clinic: "Completo",
  enterprise: "Empresa",
};
/** El catálogo del producto al 2026-09-13: sólo Full y Grupo traen el chatbot adentro. */
const HOY = { basic: false, crece: false, professional: false, clinic: true, enterprise: true };

const ESPEJO = () =>
  espejoDelSitio(readFileSync(join(APP, "src", "lib", "pricing.ts"), "utf8")) as Record<string, boolean>;

const TEXTO_DE_LA_FAQ = {
  archivo: "faq-datos.ts",
  texto:
    " «nombresConChatbot()» ya trae el chatbot de WhatsApp incluido. En los demás planes va aparte, Bs 390/mes.",
  vecindad: "¿El chatbot de WhatsApp está incluido?",
};

function revisar(incluidoPorPlan: Record<string, boolean>, textos = [TEXTO_DE_LA_FAQ]) {
  return revisarSitio({
    incluidoPorPlan,
    labels: LABELS,
    alias: aliasDelSitio(),
    espejo: ESPEJO(),
    textos,
  }) as { problemas: string[]; avisos: string[] };
}

describe("el espejo del sitio contra el booleano del producto", () => {
  it("hoy coinciden: el sitio publica lo mismo que el producto cobra", () => {
    expect(revisar(HOY).problemas).toEqual([]);
  });

  it("ROJO si el producto le da el chatbot a un plan y el sitio le sigue cobrando el add-on", () => {
    // El movimiento que la escalera C invita: hacer más atractivo al Profesional incluyéndolo.
    const { problemas } = revisar({ ...HOY, professional: true });
    expect(problemas.join("\n")).toMatch(/chatbotIncluido=false[\s\S]*whatsappIncluded=true/);
  });

  it("ROJO en la dirección simétrica: el sitio regala lo que el producto cobra", () => {
    const { problemas } = revisar({ ...HOY, clinic: false });
    expect(problemas.join("\n")).toMatch(/chatbotIncluido=true[\s\S]*whatsappIncluded=false/);
  });

  it("el espejo declara TODOS los planes publicados, o no se puede juzgar", () => {
    // Si `chatbotIncluido` desaparece de un plan, el lector devuelve null y el guión sale con
    // código 2 (NO MEDIDO). Un espejo a medias que igual compare es peor que no comparar.
    expect(espejoDelSitio("export const PLANES = [{ id: \"basico\" }]")).toBeNull();
    expect(Object.keys(ESPEJO())).toHaveLength(aliasDelSitio() && Object.keys(aliasDelSitio()).length);
  });
});

describe("la negación que no dice a quién se la niega", () => {
  it("ROJO: negar sin nombrar el plan le habla también al cliente que SI lo tiene", () => {
    const { problemas } = revisar(HOY, [
      { archivo: "faq.tsx", texto: "No: el chatbot es un servicio aparte, Bs 390/mes.", vecindad: "chatbot" },
    ]);
    expect(problemas.join("\n")).toMatch(/sin decir en qué plan/);
  });

  it("VERDE si el mismo texto ya dijo quién lo trae: «en los demás» habla de los demás", () => {
    expect(revisar(HOY).problemas).toEqual([]);
  });

  it("una negación que NO habla del chatbot no es sujeto: dominio y hosting se pagan aparte", () => {
    // Caso real: `content/requisitos.ts` explica que el dominio va a nombre del cliente. Sin esta
    // pregunta el gate lo acusaba de negarle el chatbot al plan Full.
    const { problemas } = revisar(HOY, [
      { archivo: "requisitos.ts", texto: "Lo que se paga aparte y va a TU nombre", vecindad: "dominio hosting" },
    ]);
    expect(problemas).toEqual([]);
  });
});

describe("de dónde sale el texto", () => {
  it("un COMENTARIO no absuelve: la garantía tiene que estar en lo que el cliente lee", () => {
    const fuente = '// Full ya trae el chatbot incluido\nconst x = "otra cosa cualquiera";';
    expect(textosVisibles(fuente)).toEqual(["otra cosa cualquiera"]);
  });

  it("un // dentro de un string no abre un comentario", () => {
    expect(textosVisibles('const u = "vení a https://onia.com.bo y mirá";')).toEqual([
      "vení a https://onia.com.bo y mirá",
    ]);
  });

  it("la interpolación deja su NOMBRE, no su valor: es lo que ata la frase a la fuente", () => {
    const [texto] = textosVisibles("const a = `${nombresConChatbot()} ya trae el chatbot`;") as string[];
    expect(texto).toMatch(/«nombresConChatbot\(\)»/);
  });
});
