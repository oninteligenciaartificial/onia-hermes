import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * La navegación pública del sitio ofrece el SISTEMA, no servicios de agencia.
 *
 * Decisión de Sergio Urcullo, 2026-09-08 (tarea `t_30b1711d`, con su `ok`):
 * *«mantener en la navegación pública solo las entradas del sistema + Chatbot …
 * quitar enlaces de agencia: Webs, Marketing IA, Consultoría»*. El motivo que
 * dio es el que importa y el que este gate protege: **los leads confunden la web
 * con una agencia**. Onia vende UN producto —Onia Platform, por rubro— y un menú
 * que ofrece «Webs · Marketing IA · Consultoría» al lado de «Precios» le dice al
 * que llega que esto es un estudio que hace encargos, no un sistema que se
 * contrata. Es la misma familia que sacó `/comparativa` del header: sale del
 * CAMINO, no del sitio.
 *
 * **Las páginas NO se bajan.** Siguen sirviéndose con 200, así que una URL que
 * ya circula sigue abriendo y Sergio Urcullo puede mandar `/servicios/webs` en
 * una venta. Lo que se quita es la oferta desde el menú, y con ella la entrada
 * del sitemap: `robots.ts` las declara fuera del índice, que es la salida que
 * `alcance.test.ts` documenta para una página que deja de estar en el camino.
 *
 * **Por qué el sujeto se deriva y no es una lista de tres rutas.** Escribir
 * `expect(NAV_SERVICIOS).toBeUndefined()` ataría el gate a la FORMA de hoy: el
 * día que alguien agregue `{ href: "/servicios/branding" }` a `NAV_PRODUCTO`, o
 * un `href="/servicios/…"` tipeado a mano en el cromo, la decisión de Sergio
 * Urcullo quedaría rota con este archivo en verde. Así que se barren las dos
 * formas —el mapa (`nav.ts`) y el literal desnudo en los componentes que pintan
 * navegación— y una ruta nueva de agencia nace cubierta.
 */

const SITIO = dirname(fileURLToPath(import.meta.url));

/** Lo que el sitio vivo pinta como NAVEGACIÓN: el mapa y los dos cromos. */
const CROMO = ["nav.ts", "ui.tsx", "menu.tsx"];

/** Saca los comentarios para que la bitácora que explica el porqué no dispare. */
function sinComentarios(texto: string): string {
  return texto.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ");
}

/** Los destinos internos que escribe un archivo, en las dos formas que usa el sitio. */
function destinos(archivo: string): string[] {
  const texto = sinComentarios(readFileSync(join(SITIO, archivo), "utf8"));
  return [
    ...[...texto.matchAll(/href=\{?"(\/[^"?#]*)"/g)].map((m) => m[1]),
    ...[...texto.matchAll(/href:\s*"(\/[^"?#]*)"/g)].map((m) => m[1]),
  ];
}

describe("la navegación pública vende el sistema, no una agencia", () => {
  it("encuentra los archivos del cromo", () => {
    // Sin este ancla, renombrar `menu.tsx` dejaría los `it.each` de abajo
    // corriendo sobre listas vacías: cero casos, verde, y la decisión suelta.
    const presentes = readdirSync(SITIO);
    for (const archivo of CROMO) {
      expect(presentes, `${archivo} ya no está: este gate dejó de medir`).toContain(archivo);
    }
    expect(
      CROMO.flatMap(destinos).length,
      "no se leyó ni un href del cromo: el barrido está roto",
    ).toBeGreaterThan(9);
  });

  it.each(CROMO)("%s no ofrece servicios de agencia", (archivo) => {
    const agencia = destinos(archivo).filter((r) => r === "/servicios" || r.startsWith("/servicios/"));
    expect(
      agencia,
      `${archivo} ofrece ${agencia.join(", ")} desde la navegación del sitio. ` +
        `Sergio Urcullo lo sacó el 2026-09-08 (t_30b1711d): el menú público es el ` +
        `sistema + Chatbot, porque los leads confunden la web con una agencia. ` +
        `La página no se baja —sigue en 200—, pero no se ofrece desde el menú.`,
    ).toEqual([]);
  });
});
