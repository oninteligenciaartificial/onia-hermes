import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Gate de slop en español para el copy que GENERAMOS (no el que escribe el
 * cliente). Destilado de `stop-slop` y `humanizer` (instalados el 2026-09-17
 * a raíz del carrusel «Stop AI slop» de Enrique Rocha): frases que delatan
 * texto de IA y que un dueño de negocio boliviano jamás diría de su local.
 *
 * Sujetos: el contenido del asistente y del configurador (titulares por rubro,
 * copy de cada dirección visual), los perfiles de cliente que escribe el motor
 * y el DESIGN.md generado. Un titular nuevo con «siguiente nivel» pone esto en
 * rojo antes de llegar a una web de verdad.
 */
const AQUI = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(AQUI);

export const FRASES_DE_IA: readonly RegExp[] = [
  /siguiente nivel/i,
  /era digital/i,
  /mundo (actual|de hoy)/i,
  /soluciones? integral/i,
  /sin esfuerzo/i,
  /desbloque[aá]/i,
  /potenci[aá] tu/i,
  /revolucion[aá]/i,
  /sumergite|sumérgete/i,
  /descubr[íi] el poder/i,
  /todo en uno/i,
  /transform[aá] tu (negocio|vida|empresa)/i,
  /de manera (efectiva|eficiente|integral)/i,
  /experiencia (única|inolvidable|excepcional)/i,
  /impuls[aá] tu/i,
  /en un mundo/i,
  /no (es|se trata de) .{3,40}, (es|sino) /i, // «no es X, es Y»
  /\bcabe destacar\b/i,
  /\bes importante mencionar\b/i,
] as const;

const SUJETOS = [
  join(ROOT, "apps", "onia-platform", "src", "content", "web-assistant.ts"),
  join(ROOT, "apps", "onia-platform", "src", "content", "web-configurator.ts"),
  ...readdirSync(join(ROOT, "data", "clients"))
    .filter((f) => /\.(json|DESIGN\.md)$/.test(f))
    .map((f) => join(ROOT, "data", "clients", f)),
];

/** Texto sin los comentarios de código, que legítimamente citan frases prohibidas. */
function sinComentarios(text: string): string {
  return text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

describe("el copy que generamos no suena a IA", () => {
  it("tiene sujetos", () => {
    expect(SUJETOS.length).toBeGreaterThan(2);
  });

  it("ninguna frase de la lista aparece en el contenido generado", () => {
    const hallazgos: string[] = [];
    for (const file of SUJETOS) {
      const text = sinComentarios(readFileSync(file, "utf8"));
      for (const re of FRASES_DE_IA) {
        const m = re.exec(text);
        if (m) hallazgos.push(`${file.replace(ROOT, "")}: «${m[0]}»`);
      }
    }
    expect(hallazgos, hallazgos.join("\n")).toEqual([]);
  });

  it("los titulares por rubro del asistente no llevan raya ni dos puntos", () => {
    const text = readFileSync(SUJETOS[0], "utf8");
    const offers = [...text.matchAll(/offer: "([^"]+)"/g)].map((m) => m[1]);
    expect(offers.length).toBeGreaterThan(3);
    for (const offer of offers) {
      expect(offer, offer).not.toMatch(/[—:]/);
      expect(offer.split(/\s+/).length, offer).toBeLessThanOrEqual(9);
    }
  });
});
