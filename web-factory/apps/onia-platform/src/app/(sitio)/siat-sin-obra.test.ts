import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { NOTA_FISCAL } from "@/lib/pricing";
import { CONTENDIENTES } from "@/lib/proof";
import {
  SIAT_BLOQUES,
  SIAT_FAQ,
  SIAT_FUENTES,
  SIAT_GUIA_CIERRE,
} from "@/lib/siat";

import { PAGINAS_PUBLICAS, archivoDe } from "../rutas";
import { FAQ } from "./faq-datos";

/**
 * La venta no cuenta el estado del emisor fiscal propio.
 *
 * Sergio Urcullo, 2026-10-01: sacar de toda superficie de venta que la
 * facturación SIAT está «en trámite» / «en pruebas de homologación». Es la
 * regla de `CLAUDE.md` «la venta nunca exhibe obra»: lo que no está listo no
 * se nombra. Lo que sí se dice, en presente, es dónde se emite hoy la factura
 * fiscal (el Portal Web del SIN) — eso no es obra, es el estado del mundo.
 *
 * Fuera de este gate, a propósito: `content/legal/*` (términos y privacidad
 * pueden y deben contar el estado entero), `TODAVIA_NO` de `lib/proof.ts`
 * (ledger interno que no se renderiza, lo vigila `obra-en-el-cuerpo.test.ts`)
 * y los comentarios del código.
 */
const ESTADO_DEL_EMISOR =
  /\ben\s+tr[aá]mite\b|\bhomologaci[oó]n\b|\ben\s+pruebas\b|\bfalta\s+que\s+el\s+SIN\b|\bpendiente\s+de\s+autorizaci[oó]n\b|\bte\s+avisamos\s+apenas\b/i;

/** El cuerpo de una página, sin comentarios y con los espacios aplanados. */
function cuerpoDe(archivo: string): string {
  return readFileSync(archivo, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^[ \t]*\/\/.*$/gm, " ")
    .replace(/\s+/g, " ");
}

describe("la venta no exhibe el trámite del emisor fiscal", () => {
  it("el patrón reconoce las frases que se sacaron", () => {
    for (const vieja of [
      "La emisión de factura con valor fiscal sigue en trámite ante el SIN.",
      "Nuestro sistema está registrado ante el SIN y sigue en pruebas de homologación.",
      "Te avisamos apenas la homologación concluya.",
    ]) {
      expect(ESTADO_DEL_EMISOR.test(vieja), vieja).toBe(true);
    }
    // El trámite DEL CLIENTE en el portal no es obra nuestra: no se acusa.
    expect(ESTADO_DEL_EMISOR.test("El trámite es gratuito y no necesitás comprar ningún sistema.")).toBe(false);
  });

  it("los textos fiscales que leen las páginas no lo nombran", () => {
    const onia = CONTENDIENTES.find((c) => c.esOnia);
    const textos = [
      NOTA_FISCAL,
      SIAT_GUIA_CIERRE,
      SIAT_FUENTES,
      onia?.veredicto ?? "",
      ...SIAT_BLOQUES.map((b) => `${b.titulo} ${b.texto}`),
      ...SIAT_FAQ.map((f) => `${f.q} ${f.a}`),
      ...FAQ.map((f) => `${f.q} ${f.a}`),
    ];
    const acusados = textos.filter((t) => ESTADO_DEL_EMISOR.test(t));
    expect(acusados).toEqual([]);
  });

  it.each(PAGINAS_PUBLICAS.map((p) => [p.ruta || "/", p] as const))(
    "%s no lo tipea",
    (_ruta, pagina) => {
      const m = ESTADO_DEL_EMISOR.exec(cuerpoDe(archivoDe(pagina)));
      expect(m ? m[0] : null).toBeNull();
    },
  );
});
