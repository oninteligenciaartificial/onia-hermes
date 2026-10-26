import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { CONTENDIENTES } from "@/lib/proof";
import { SIAT_BLOQUES, SIAT_ESTADO_ONIA, SIAT_FAQ, SIAT_GUIA_CIERRE } from "@/lib/siat";
import { PAGINAS, archivoDe } from "../rutas";

const onia = CONTENDIENTES.find((c) => c.esOnia);
const copyFiscal = [
  SIAT_ESTADO_ONIA,
  SIAT_GUIA_CIERRE,
  ...SIAT_BLOQUES.map((b) => `${b.titulo} ${b.texto}`),
  ...SIAT_FAQ.map((f) => `${f.q} ${f.a}`),
].join(" ");

describe("la venta fiscal describe el paso manual mientras falta autorización", () => {
  it("no promete que el Portal Web toma automáticamente las ventas de Onia", () => {
    expect(onia?.estados.siat).not.toBe("si");
    expect(copyFiscal).not.toMatch(/sin re-?tipear|la factura sale sola|la factura sale de la misma venta/i);
    expect(copyFiscal).toMatch(/ingres(?:ás|ar) (?:allí )?los datos de cada factura/i);
  });

  it("distingue el registro exportable del RCV oficial del SIAT", () => {
    expect(SIAT_BLOQUES[1].texto).toMatch(/no es el RCV oficial del SIAT/i);
  });

  it("ninguna página escribe por su cuenta que elimina el ingreso en el Portal Web", () => {
    const acusadas = PAGINAS.filter((pagina) => {
      const cuerpo = readFileSync(archivoDe(pagina), "utf8")
        .replace(/\/\*[\s\S]*?\*\//g, " ")
        .replace(/^[ \t]*\/\/.*$/gm, " ");
      return /sin re-?tipear|la factura sale sola|la factura sale de la misma venta/i.test(cuerpo);
    }).map((pagina) => pagina.ruta || "/");
    expect(acusadas).toEqual([]);
  });
});
