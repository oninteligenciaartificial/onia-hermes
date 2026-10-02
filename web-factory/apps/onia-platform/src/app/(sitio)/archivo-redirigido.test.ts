import { describe, expect, it } from "vitest";

import nextConfig from "../../../next.config";
import { PAGINAS, RUTAS_DEL_SITEMAP, estaProhibida } from "../rutas";

/**
 * El archivo `/v1` y las dos líneas de negocio congeladas el 2026-09-05
 * (`/servicios/marketing-ia`, `/servicios/consultoria`) salen del aire con un
 * 308 a la portada — decisión de Sergio Urcullo del 2026-09-28.
 *
 * Tenían `noindex` y estaban en el `disallow`, y aun así respondían 200 a quien
 * llegara con un enlace viejo: ahí vivían promesas que el producto no cumple
 * (auditoría de la condición 8 de la 1.0, F8/F9/E15). `noindex` saca una página
 * de Google, no de WhatsApp.
 *
 * Los `page.tsx` siguen en el disco a propósito: decenas de gates de copy los
 * usan de sujeto. Por eso este test mira el DISCO y no una lista: una página
 * nueva que alguien cuelgue bajo esas raíces tiene que caer en la redirección,
 * o se sirve sin que nadie lo decida.
 */
const BAJADAS = ["/v1", "/servicios/marketing-ia", "/servicios/consultoria"] as const;

const reglas = (await nextConfig.redirects!()) as { source: string; destination: string; permanent?: boolean }[];

/** ¿Alguna regla 308 a la portada atrapa esta ruta? */
function vaALaPortada(ruta: string): boolean {
  return reglas.some(
    (r) =>
      r.destination === "/" &&
      r.permanent === true &&
      (r.source === ruta ||
        (r.source.endsWith("/:ruta*") && ruta.startsWith(`${r.source.slice(0, -"/:ruta*".length)}/`))),
  );
}

describe("el archivo /v1 y las líneas congeladas redirigen a la portada", () => {
  it.each(BAJADAS)("%s y todo lo que cuelga de ella: 308 a /", (raiz) => {
    expect(reglas).toContainEqual({ source: raiz, destination: "/", permanent: true });
    expect(reglas).toContainEqual({ source: `${raiz}/:ruta*`, destination: "/", permanent: true });
  });

  it("toda página del disco bajo esas raíces queda atrapada", () => {
    const bajo = PAGINAS.filter((p) => BAJADAS.some((raiz) => p.ruta === raiz || p.ruta.startsWith(`${raiz}/`)));
    // Ancla: sin páginas bajo esas raíces este caso firmaría verde sobre nada.
    expect(bajo.length).toBeGreaterThanOrEqual(10);
    expect(bajo.filter((p) => !vaALaPortada(p.ruta)).map((p) => p.ruta)).toEqual([]);
  });

  it("no se lleva puesta ninguna página viva", () => {
    for (const ruta of ["", "/precios", "/chatbot", "/agentes", "/servicios/webs", "/empezar"]) {
      expect(vaALaPortada(ruta), `${ruta || "/"} quedó redirigida`).toBe(false);
    }
  });

  it("robots.ts no las prohíbe: el buscador tiene que poder pedirlas para ver el 308", () => {
    // Con el disallow, Google nunca pide la URL, nunca ve el 308 y la deja como
    // «indexada aunque bloqueada por robots.txt». Salieron del disallow el
    // 2026-09-29 por eso.
    expect(BAJADAS.filter((raiz) => estaProhibida(raiz))).toEqual([]);
  });

  it("el sitemap no pide indexar ninguna", () => {
    const pedidas = RUTAS_DEL_SITEMAP.filter((ruta) =>
      BAJADAS.some((raiz) => ruta === raiz || ruta.startsWith(`${raiz}/`)),
    );
    expect(pedidas).toEqual([]);
  });
});
