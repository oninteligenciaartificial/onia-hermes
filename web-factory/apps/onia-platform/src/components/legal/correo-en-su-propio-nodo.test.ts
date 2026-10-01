import { createElement, Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { loadLegalDoc } from "@/lib/legal";
import { renderInline } from "./inline";

/**
 * React error #418 en /privacidad (producción, 2026-10-01): Cloudflare ofusca
 * cada correo del HTML y su script lo devuelve como un nodo de texto APARTE.
 * Un correo pegado a otro texto («…llega a business@onia.com.bo») quedaba
 * partido en dos nodos donde React esperaba uno. El pie, con el correo como
 * único hijo de un `mailto:`, nunca falló: ésa es la forma que se exige.
 */
const html = (texto: string) => renderToStaticMarkup(createElement(Fragment, null, ...renderInline(texto)));

describe("un correo en un documento legal sale en su propio enlace", () => {
  it("pegado a texto, queda solo dentro de un mailto", () => {
    expect(html("recepción del correo que llega a business@onia.com.bo y nada más")).toBe(
      'recepción del correo que llega a <a href="mailto:business@onia.com.bo">business@onia.com.bo</a> y nada más',
    );
  });

  it("dentro de una negrita, también", () => {
    expect(html("Correo: **business@onia.com.bo** · WhatsApp")).toBe(
      'Correo: <strong><a href="mailto:business@onia.com.bo">business@onia.com.bo</a></strong> · WhatsApp',
    );
  });

  it("un enlace markdown no se rompe", () => {
    expect(html("ver [la política](/privacidad).")).toBe('ver <a href="/privacidad">la política</a>.');
  });

  for (const slug of ["privacidad", "terminos"]) {
    it(`en ${slug}, ningún correo comparte nodo con otro texto`, () => {
      const doc = loadLegalDoc(slug);
      const textos = doc.blocks.flatMap((b) =>
        b.kind === "p" || b.kind === "notice"
          ? [b.text]
          : b.kind === "list"
            ? b.items
            : b.kind === "table"
              ? [...b.header, ...b.rows.flat()]
              : [],
      );
      const conCorreo = textos.filter((t) => /@[a-z0-9-]+\.[a-z]/i.test(t));
      expect(conCorreo.length, `${slug} no trae ningún correo: el caso no midió nada`).toBeGreaterThan(0);
      for (const t of conCorreo) {
        // Todo correo del HTML queda como `>correo</a>` de un mailto.
        const salida = html(t);
        const sueltos = salida.replace(/<a href="mailto:[^"]+">[^<]+<\/a>/g, "").match(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g);
        expect(sueltos, salida).toBeNull();
      }
    });
  }
});
