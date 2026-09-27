import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  medidasPng,
  ogImageDe,
  rutasConTarjeta,
  tamanoDeclarado,
  veredicto,
  veredictoContraBuild,
} from "./tarjeta-social-viva.mjs";

/**
 * La parte PURA de `tarjeta-social-viva.mjs`, en la cadena.
 *
 * La medición viva necesita red y va como alias suelto: un gate que sale a
 * internet dentro de `npm test` trabaría el merge de los quince carriles cada
 * vez que se cae el VPS, y eso es un rojo de AMBIENTE, no un defecto. Acá entra
 * lo que se puede falsificar sin preguntarle a nadie.
 *
 * Cada caso es un defecto que el medidor existe para ver. Si alguno deja de
 * doler, el medidor dejó de medir y nadie se entera: el suyo es el tipo de
 * verde que no se investiga.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const TARJETA = join(AQUI, "..", "src", "app", "(sitio)", "tarjeta-social.tsx");
const TAM = { width: 1200, height: 630 };

const sana = (ruta: string, md5 = "a".repeat(32)) => ({
  ruta,
  og: `https://onia.com.bo${ruta}/opengraph-image`,
  codigo: 200,
  medidas: { ...TAM },
  md5,
});

describe("el medidor de la tarjeta social ve lo que dice ver", () => {
  it("con todo sano no inventa fallas", () => {
    expect(veredicto([sana("/"), sana("/empezar")], TAM)).toEqual([]);
  });

  it("acusa la ruta servida SIN og:image", () => {
    const f = veredicto([sana("/"), { ruta: "/empezar", og: null }], TAM);
    expect(f).toHaveLength(1);
    expect(f[0]).toContain("/empezar");
  });

  it("acusa el og:image que no contesta 200", () => {
    expect(veredicto([sana("/"), { ruta: "/x", og: "u", codigo: 404 }], TAM)).toHaveLength(1);
  });

  it("acusa lo que se sirve en og:image y no es un PNG", () => {
    expect(
      veredicto([sana("/"), { ruta: "/x", og: "u", codigo: 200, medidas: null }], TAM),
    ).toHaveLength(1);
  });

  /**
   * WhatsApp recorta a su relación de aspecto: una tarjeta que no mide lo que
   * declara sale con el titular cortado, que es el defecto exacto por el que se
   * tiró la captura de `/og/onia-rubros.jpg` el 2026-09-02.
   */
  it("acusa el PNG que no mide lo que la tarjeta declara", () => {
    const f = veredicto([sana("/"), { ...sana("/x"), medidas: { width: 600, height: 315 } }], TAM);
    expect(f).toHaveLength(1);
    expect(f[0]).toContain("600x315");
  });

  /**
   * El archivo DECLARA que el dibujo es uno solo. Dos md5 distintos entre las
   * rutas de `(sitio)` dicen que una quedó con otro build — que es cómo once de
   * doce rutas se pasaron semanas sin tarjeta sin que nada avisara.
   */
  it("acusa la ruta que sirve OTRO dibujo", () => {
    const f = veredicto([sana("/"), sana("/empezar", "b".repeat(32))], TAM);
    expect(f).toHaveLength(1);
    expect(f[0]).toContain("UNO");
  });

  it("el cruce contra el build acusa producción vieja, y calla si coinciden", () => {
    expect(veredictoContraBuild([{ ruta: "/", prod: "aaa", local: "bbb" }])).toHaveLength(1);
    expect(veredictoContraBuild([{ ruta: "/", prod: "aaa", local: "aaa" }])).toEqual([]);
  });

  /**
   * Un `local` nulo es "no pude preguntar", y eso NO es "me dijeron que no": el
   * medidor ya sale 2 = NO MEDIDO por ese camino. Confundirlos sería el falso
   * rojo que enseña a ignorar el gate.
   */
  it("no acusa cuando el build no pudo contestar", () => {
    expect(veredictoContraBuild([{ ruta: "/", prod: "aaa", local: null }])).toEqual([]);
  });
});

describe("el medidor deriva sus sujetos y sus medidas, no los tipea", () => {
  /**
   * Si el tamaño estuviera escrito acá, mutar el `size` del dibujo dejaría a
   * los dos lados de acuerdo en el valor equivocado: el gate defendería el
   * defecto en vez de medirlo.
   */
  it("lee `size` de la fuente de la tarjeta, y le cree a la fuente", () => {
    expect(tamanoDeclarado("export const size = { width: 800, height: 418 };")).toEqual({
      width: 800,
      height: 418,
    });
    expect(tamanoDeclarado(readFileSync(TARJETA, "utf8"))).toEqual(TAM);
  });

  /**
   * Los sujetos salen del DISCO. Una lista escrita a mano envejece hacia el
   * falso verde: la ruta nueva no está, así que no se mide, así que pasa.
   */
  it("encuentra las rutas de (sitio) con tarjeta, incluida la home", () => {
    const rutas = rutasConTarjeta();
    expect(rutas).toContain("/");
    expect(rutas).toContain("/empezar");
    expect(rutas).toContain("/precios");
    expect(rutas.length).toBeGreaterThanOrEqual(10);
  });

  it("reconoce un PNG por su cabecera y rechaza lo que no lo es", () => {
    const png = Buffer.concat([
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      Buffer.from([0, 0, 0, 13]),
      Buffer.from("IHDR"),
      (() => {
        const b = Buffer.alloc(13);
        b.writeUInt32BE(1200, 0);
        b.writeUInt32BE(630, 4);
        return b;
      })(),
    ]);
    expect(medidasPng(png)).toEqual(TAM);
    expect(medidasPng(Buffer.from("no soy un png"))).toBeNull();
  });

  it("saca el og:image del html servido", () => {
    expect(ogImageDe('<meta property="og:image" content="https://x/y.png"/>')).toBe(
      "https://x/y.png",
    );
    expect(ogImageDe("<html><head></head></html>")).toBeNull();
  });
});
