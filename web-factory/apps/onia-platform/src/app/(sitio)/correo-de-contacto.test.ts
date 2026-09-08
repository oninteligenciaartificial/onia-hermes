/**
 * El correo de contacto sale de una sola fuente, y el markdown legal la sigue.
 *
 * QUÉ CLASE CUIDA, y por qué no la cuidaba nadie. Los 39 gates de este carril
 * leen `.ts` y `.tsx`. El contenido legal —`content/legal/terminos.md` y
 * `privacidad.md`— es superficie de cliente igual que cualquier pantalla: lo
 * sirve producción con 200 y lo enlaza el pie de las 25 páginas. Como no es
 * TypeScript, ningún barrido del carril lo abre nunca: no lo mira el de obra,
 * ni el de precios, ni el de promesas. Es un árbol entero sin vigilancia.
 *
 * EL DATO. `business@onia.com.bo` estaba tipeado a mano en CINCO superficies
 * (medido el 2026-09-08): el pie, el JSON-LD de /nosotros —donde el dato viaja
 * desnudo y ningún instrumento visual lo ve— y tres veces en los dos legales.
 * Hoy los cinco coinciden por diligencia, no por construcción.
 *
 * POR QUÉ IMPORTA MÁS QUE UN DATO REPETIDO CUALQUIERA. Es el único canal
 * escrito del sitio, y la política de privacidad lo ofrece como la vía para
 * «solicitudes sobre datos personales»: el ejercicio de derechos que la ley
 * obliga a atender. El día que el buzón cambie, lo natural es corregir el pie
 * —que se ve— y dejar el markdown atrás; con eso la política queda mandando a
 * un correo muerto, y no hay ninguna pantalla donde eso se note.
 *
 * POR QUÉ EL MARKDOWN VA POR GATE Y NO POR IMPORT. Un `.md` no puede importar
 * TypeScript. La cadena se cierra al revés: la constante manda, y este gate
 * exige que los `.md` digan lo mismo. Si se despegan, rojo, nombrando archivo
 * y línea.
 *
 * CÓMO SE DERIVAN LOS SUJETOS. Del disco, las dos familias: `src/**` para el
 * código y `content/legal/*.md` para el texto legal. Un archivo nuevo nace
 * cubierto. Y el universo se verifica no vacío: un barrido que no encuentra
 * sujetos firma verde sin haber mirado nada, que es como esta familia de gates
 * falla abierto.
 *
 * LOS COMENTARIOS NO CUENTAN, en las dos direcciones. No cuentan como defecto
 * (si no, esta bitácora se acusaría a sí misma) y tampoco como cumplimiento:
 * el patrón se aplica sobre las líneas de código, nunca sobre el archivo
 * entero. Un gate que se absuelve con su propio comentario pasa en verde con
 * el arreglo arrancado.
 */
import { readdirSync, readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";

import { describe, expect, it } from "vitest";

import { CORREO_CONTACTO } from "@/lib/site";

const RAIZ = join(__dirname, "..", "..");
const LEGALES = join(RAIZ, "content", "legal");

/**
 * Lo que se excluye, nombrado de a uno y con su motivo. Nunca una carpeta
 * entera: un exento ancho es una lista de inclusión disfrazada.
 */
const EXENTOS = new Set([
  // La fuente. Es el único lugar donde el correo puede estar escrito.
  "lib/site.ts",
]);

/** Cualquier casilla del dominio propio, no sólo la vigente. */
const CORREO = /[A-Za-z0-9._%+-]+@onia\.com\.bo/g;

function fuentes(dir: string, salida: string[] = []): string[] {
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) {
      if (entrada.name === "node_modules" || entrada.name === "__tests__") continue;
      fuentes(ruta, salida);
      continue;
    }
    if (![".ts", ".tsx"].includes(extname(entrada.name))) continue;
    if (entrada.name.includes(".test.")) continue;
    const rel = relative(RAIZ, ruta).split("\\").join("/");
    if (EXENTOS.has(rel)) continue;
    salida.push(ruta);
  }
  return salida;
}

/** Las líneas que NO son comentario, con su número REAL en el archivo. */
function sinComentarios(txt: string): { n: number; linea: string }[] {
  const salida: { n: number; linea: string }[] = [];
  let dentroDeBloque = false;

  txt.split("\n").forEach((linea, i) => {
    const t = linea.trim();
    const abre = linea.includes("/*");
    const cierra = linea.includes("*/");

    if (dentroDeBloque) {
      if (cierra) dentroDeBloque = false;
      return;
    }
    if (abre && !cierra) {
      dentroDeBloque = true;
      return;
    }
    if (abre && cierra) return;
    if (t.startsWith("*") || t.startsWith("//")) return;

    salida.push({ n: i + 1, linea });
  });

  return salida;
}

const CODIGO = fuentes(join(RAIZ, "app")).concat(
  fuentes(join(RAIZ, "components")),
  fuentes(join(RAIZ, "lib")),
);

const MARKDOWN = readdirSync(LEGALES)
  .filter((n) => extname(n) === ".md")
  .map((n) => join(LEGALES, n));

describe("el correo de contacto se lee de la fuente, no se tipea", () => {
  it("ninguna pantalla tipea una casilla @onia.com.bo a mano", () => {
    const copias: string[] = [];

    for (const archivo of CODIGO) {
      const rel = relative(RAIZ, archivo).split("\\").join("/");
      for (const { n, linea } of sinComentarios(readFileSync(archivo, "utf8"))) {
        for (const hallado of linea.match(CORREO) ?? []) {
          copias.push(`${rel}:${n} → ${hallado}`);
        }
      }
    }

    expect(
      copias,
      `Correo tipeado a mano en superficie de cliente. Se importa CORREO_CONTACTO ` +
        `de "@/lib/site": el día que el buzón cambie, un literal suelto queda ` +
        `apuntando al viejo sin que nada se ponga rojo.\n  ${copias.join("\n  ")}`,
    ).toEqual([]);
  });

  it("el markdown legal usa exactamente el correo de la fuente", () => {
    const despegados: string[] = [];

    for (const archivo of MARKDOWN) {
      const rel = relative(RAIZ, archivo).split("\\").join("/");
      readFileSync(archivo, "utf8")
        .split("\n")
        .forEach((linea, i) => {
          for (const hallado of linea.match(CORREO) ?? []) {
            if (hallado !== CORREO_CONTACTO) {
              despegados.push(`${rel}:${i + 1} → ${hallado}`);
            }
          }
        });
    }

    expect(
      despegados,
      `El texto legal nombra una casilla distinta de CORREO_CONTACTO ` +
        `(${CORREO_CONTACTO}). Un .md no puede importar la constante, así que ` +
        `esta es la única atadura: si se despegan, la política de privacidad ` +
        `manda el ejercicio de derechos a un buzón que no leemos.\n  ${despegados.join("\n  ")}`,
    ).toEqual([]);
  });

  it("la política de privacidad sigue ofreciendo un correo — no se arregla borrándolo", () => {
    const privacidad = MARKDOWN.find((f) => f.endsWith("privacidad.md"));
    expect(privacidad, "no existe content/legal/privacidad.md").toBeDefined();

    const texto = readFileSync(privacidad as string, "utf8");
    expect(
      texto.includes(CORREO_CONTACTO),
      `privacidad.md dejó de nombrar ${CORREO_CONTACTO}. El caso de arriba se ` +
        `satisface BORRANDO el correo, y sin vía de contacto la política ` +
        `incumple lo que ella misma promete.`,
    ).toBe(true);
  });

  it("el barrido encuentra las dos familias de sujetos", () => {
    // Un universo vacío firma verde sin mirar nada: es como esta familia de
    // gates falla abierto. Se ancla el markdown legal, que es la superficie
    // que ningún otro gate del carril abre.
    // Los pisos salen de contar el disco el 2026-09-08 (95 fuentes, 2 legales),
    // no de una estimación: un umbral inventado se cae solo y manda a "arreglar"
    // el gate en vez de mirar por qué se encogió el universo.
    expect(MARKDOWN.length, "no se encontró markdown legal que vigilar").toBeGreaterThanOrEqual(2);
    expect(CODIGO.length, "el universo de fuentes se encogió").toBeGreaterThanOrEqual(90);
  });
});
