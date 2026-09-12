/**
 * Un medidor "vivo" que apunta a un servidor local no mide nada: nadie levanta
 * ese servidor.
 *
 * POR QUE EXISTE. `chat-diferido-vivo.mjs` nacio con `http://localhost:3311` de
 * destino por defecto mientras sus hermanos (`enlaces-vivos`, `precios-vivos`,
 * `mirar-venta`) ya usaban `https://onia.com.bo`. Su propia cabecera prometia
 * medir *"que el cliente lo recibe"* — y medido el 2026-09-11 22:50 La Paz, `npm run
 * chat-diferido:vivo` contestaba `NO MEDIDO: ERR_CONNECTION_REFUSED`. El unico
 * instrumento que protege el 71 % del peso de la portada llevaba un dia sin
 * poder medir, y salia sin ruido.
 *
 * QUE ATRAPA: el medidor nuevo que nace con el destino equivocado, y el viejo
 * que alguien re-apunta a su `next dev` para una prueba y deja asi.
 *
 * QUE **NO** ATRAPA: que el destino de produccion sea el CORRECTO (onia.com.bo
 * y no app.onia.com.bo, por ejemplo). Eso lo dice cada medidor en lo suyo.
 *
 * El universo sale del DISCO, no de una lista: una lista a mano falla ABIERTA
 * justo en el medidor que se agregue manana. Y los guiones que POSTEAN un
 * formulario —`verificar-guia-facturacion.mjs` manda un lead de verdad— estan
 * fuera de la clase a proposito: su localhost es correcto, por eso no se llaman
 * `-vivo`.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const AQUI = dirname(fileURLToPath(import.meta.url));

/** Los medidores contra el sitio SERVIDO, derivados del disco. */
export function medidoresVivos(dir: string = AQUI): string[] {
  return readdirSync(dir)
    .filter((f) => /-(vivo|viva|vivos|vivas)\.mjs$/.test(f))
    .sort();
}

/**
 * Blanquea comentarios conservando los saltos de linea, para que un comentario
 * no ACUSE a nadie ("default: http://localhost:3311" en la ayuda del guion) ni
 * lo ABSUELVA. Recorre el texto de verdad en vez de cortar por `//`: en estos
 * archivos `//` aparece dentro de cada URL, y cortar ahi se comeria el codigo.
 */
export function sinComentarios(fuente: string): string {
  let salida = "";
  let i = 0;
  // Pila de contextos abiertos: `` ` `` guarda el template al que vuelve un `}`.
  const plantillas: boolean[] = [];
  while (i < fuente.length) {
    const c = fuente[i];
    const d = fuente[i + 1];
    if (c === "/" && d === "/") {
      while (i < fuente.length && fuente[i] !== "\n") i++;
      continue;
    }
    if (c === "/" && d === "*") {
      i += 2;
      while (i < fuente.length && !(fuente[i] === "*" && fuente[i + 1] === "/")) {
        salida += fuente[i] === "\n" ? "\n" : "";
        i++;
      }
      i += 2;
      continue;
    }
    if (c === '"' || c === "'") {
      salida += c;
      i++;
      while (i < fuente.length && fuente[i] !== c) {
        if (fuente[i] === "\\") {
          salida += fuente[i];
          i++;
        }
        if (i < fuente.length) {
          salida += fuente[i];
          i++;
        }
      }
      salida += fuente[i] ?? "";
      i++;
      continue;
    }
    if (c === "`") {
      salida += c;
      i++;
      // Dentro de una plantilla, `${...}` vuelve a ser CODIGO: un destino
      // escondido ahi tiene que seguir siendo visible.
      while (i < fuente.length && fuente[i] !== "`") {
        if (fuente[i] === "\\") {
          salida += fuente[i];
          i++;
          salida += fuente[i] ?? "";
          i++;
          continue;
        }
        if (fuente[i] === "$" && fuente[i + 1] === "{") {
          plantillas.push(true);
          salida += "${";
          i += 2;
          break;
        }
        salida += fuente[i];
        i++;
      }
      if (plantillas.length === 0) {
        salida += fuente[i] ?? "";
        i++;
      }
      continue;
    }
    if (c === "}" && plantillas.length > 0) {
      plantillas.pop();
      salida += c;
      i++;
      // Sigue el cuerpo de la plantilla: se retoma como texto hasta el cierre.
      while (i < fuente.length && fuente[i] !== "`") {
        if (fuente[i] === "$" && fuente[i + 1] === "{") {
          plantillas.push(true);
          salida += "${";
          i += 2;
          break;
        }
        salida += fuente[i];
        i++;
      }
      if (plantillas.length === 0) {
        salida += fuente[i] ?? "";
        i++;
      }
      continue;
    }
    salida += c;
    i++;
  }
  return salida;
}

/** Las lineas de CODIGO (sin comentarios) que nombran un servidor local. */
export function destinosLocales(fuente: string): string[] {
  return sinComentarios(fuente)
    .split("\n")
    .filter((l) => /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(l))
    .map((l) => l.trim());
}

describe("los medidores vivos miran produccion", () => {
  it("el universo sale del disco y no esta vacio", () => {
    const medidores = medidoresVivos();
    // Un gate sobre una lista vacia pasa sin mirar nada.
    expect(medidores.length).toBeGreaterThanOrEqual(10);
    expect(medidores).toContain("chat-diferido-vivo.mjs");
  });

  it.each(medidoresVivos())("%s no apunta a un servidor local", (archivo) => {
    const fuente = readFileSync(join(AQUI, archivo), "utf8");
    expect(destinosLocales(fuente)).toEqual([]);
  });

  describe("el detector, probado en las dos direcciones", () => {
    it("ve el destino local aunque sea el segundo termino de un ??", () => {
      expect(destinosLocales('const B = process.argv[2] ?? "http://localhost:3311";')).toEqual([
        'const B = process.argv[2] ?? "http://localhost:3311";',
      ]);
    });

    it("deja pasar el destino de produccion", () => {
      expect(destinosLocales(`const B = arg("base", "https://onia.com.bo");`)).toEqual([]);
    });

    it("no acusa por un comentario, ni siquiera si el codigo de al lado es sano", () => {
      const fuente = [
        "/**",
        " *   node scripts/x.mjs [url]   (default: http://localhost:3311)",
        " */",
        '// antes decia http://127.0.0.1:3311',
        'const B = "https://onia.com.bo";',
      ].join("\n");
      expect(destinosLocales(fuente)).toEqual([]);
    });

    it("no se come el codigo al ver el // de una URL", () => {
      const fuente = 'const B = "https://onia.com.bo"; const L = "http://localhost:3311";';
      expect(destinosLocales(fuente)).toEqual([fuente]);
    });

    it("ve el destino escondido dentro de un ${} de plantilla", () => {
      const fuente = "const B = `${process.env.X ?? 'http://127.0.0.1:3311'}/empezar`;";
      expect(destinosLocales(fuente)).toEqual([fuente]);
    });
  });
});
