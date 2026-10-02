import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * El salario mínimo nacional se declara UNA vez en todo el sitio.
 *
 * No es un precio de Onia, y por eso ningún gate de precios lo miraba: es el
 * dato AJENO contra el que la venta ancla su precio. Las tres pantallas más
 * caras del sitio —la portada, `/precios` y `/chatbot`— cierran su bloque de
 * oferta con la misma frase:
 *
 *     Es el 12 % del salario mínimo nacional 2026 (Bs 3.300, según el DS 5516),
 *     sin aguinaldo ni domingos, por algo que atiende las 24 horas.
 *
 * Es el párrafo que existe para dar credibilidad, y está construido sobre una
 * cifra que el lector boliviano PUEDE verificar: si el número está viejo, el
 * argumento se da vuelta justo donde más pesa.
 *
 * Medido el 2026-09-04 contra producción (las tres rutas devuelven 200 y las
 * tres imprimen «Bs 3.300»): `const SALARIO_MINIMO_2026 = 3300` estaba tipeado
 * TRES veces, una por página, cada una recalculando su propio `PCT_SALARIO`.
 * El salario mínimo lo fija un DS y cambia por año; el precio del chatbot lo
 * fija Sergio. Con tres copias, mover cualquiera de los dos deja dos páginas
 * afirmando un porcentaje falso sobre una cifra oficial, y nada se pone rojo.
 * Es el desastre que abre `CLAUDE.md` —cuatro precios vivos del mismo
 * chatbot— con otro sujeto: un tema, un archivo.
 *
 * ⚠️ **Lo que mantuvo vivo el duplicado no fue el olvido: fue un comentario.**
 * En `page.tsx` decía, al lado de la constante, que le corresponde estar en
 * `content/chatbot-precios.ts` *«pero ese archivo está fuera de este carril»*.
 * Es falso —`src/content/` es parte de esta app, la misma zona que el resto
 * del barrido— y la frase congeló el arreglo por creerse medida. Un comentario
 * que explica por qué algo NO se puede hacer es una hipótesis con fecha; se
 * verifica antes de darla por buena, y por eso la invariante vive acá, en un
 * gate que se ejecuta, y no en una nota que se lee.
 *
 * ⚠️ **El sujeto es el disco ENTERO**, igual que `precios.test.ts` y
 * `obra.test.ts`. Una lista de raíces escrita a mano es una lista de inclusión
 * un nivel más arriba: el día que nace un árbol nuevo queda sin vigilancia y
 * nada se pone rojo. Con el disco, un archivo nuevo nace cubierto y hay que
 * excluirlo a mano, a la vista.
 */

const AQUI = path.dirname(fileURLToPath(import.meta.url));
/** `src/` — el mismo sujeto que el resto de los gates de esta app. */
const SRC = path.resolve(AQUI, "..", "..");

/** La fuente única, relativa a `src/`. */
const FUENTE = path.join("content", "chatbot-precios.ts");

/**
 * Exclusiones, cada una con su motivo. Vacía a propósito: si mañana hace falta
 * una, que quede escrita acá y no como un silencio.
 */
const EXENTOS: ReadonlyArray<{ archivo: string; motivo: string }> = [];

function archivosDe(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...archivosDe(p));
    else if (/\.tsx?$/.test(e.name) && !/\.test\.tsx?$/.test(e.name)) out.push(p);
  }
  return out;
}

/**
 * Quita comentarios CONSERVANDO los saltos de línea, para que la línea que
 * reporta el gate no mienta.
 *
 * Acá además es lo que separa el defecto de su bitácora: la cabecera de la
 * fuente cita «Bs 3.300, DS 5516» en prosa para explicar de dónde sale la
 * referencia de valor, y este mismo archivo escribe el número al contar el
 * caso. Un gate que no filtrara comentarios daría rojo sobre el texto que
 * explica el defecto y obligaría a borrar el registro de lo que pasó.
 */
function sinComentarios(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/\/\/[^\n]*/g, (m) => " ".repeat(m.length));
}

interface Hallazgo {
  archivo: string;
  linea: number;
  texto: string;
}

/** Recorre el disco aplicando `re` al código desnudo de cada archivo. */
function buscar(re: RegExp): Hallazgo[] {
  const exentos = new Set(EXENTOS.map((e) => e.archivo));
  const hallazgos: Hallazgo[] = [];

  for (const abs of archivosDe(SRC)) {
    const rel = path.relative(SRC, abs);
    if (exentos.has(rel)) continue;

    const codigo = sinComentarios(fs.readFileSync(abs, "utf8"));
    const lineas = codigo.split("\n");
    lineas.forEach((linea, i) => {
      const copia = new RegExp(re.source, re.flags.replace("g", ""));
      if (copia.test(linea)) {
        hallazgos.push({ archivo: rel, linea: i + 1, texto: linea.trim() });
      }
    });
  }
  return hallazgos;
}

function comoLista(hs: Hallazgo[]): string {
  return hs.map((h) => `  ${h.archivo}:${h.linea}  ${h.texto}`).join("\n");
}

describe("el salario mínimo tiene una sola fuente", () => {
  it("el barrido ve el árbol entero", () => {
    // Ancla contra el fallo ABIERTO: si alguien recorta el recorrido, los casos
    // de abajo dejarían de mirar nada y pasarían en verde sin vigilar nada.
    expect(archivosDe(SRC).length).toBeGreaterThan(20);
  });

  it("la fuente única declara el monto", () => {
    const abs = path.join(SRC, FUENTE);
    expect(fs.existsSync(abs), `no existe la fuente ${FUENTE}`).toBe(true);

    const codigo = sinComentarios(fs.readFileSync(abs, "utf8"));
    expect(
      /export const SALARIO_MINIMO\b/.test(codigo),
      `${FUENTE} tiene que EXPORTAR el salario mínimo: es el archivo que se ` +
        `declara a sí mismo fuente única del precio del que es referencia.`,
    ).toBe(true);
  });

  it("ninguna otra parte del sitio lo declara", () => {
    const declaraciones = buscar(/const\s+SALARIO_MINIMO/);
    const fuera = declaraciones.filter((h) => h.archivo !== FUENTE);

    expect(
      fuera,
      `el salario mínimo se declara fuera de ${FUENTE}. Un tema, un archivo: ` +
        `importalo en vez de volver a escribirlo.\n${comoLista(fuera)}`,
    ).toEqual([]);
  });

  it("nadie tipea el monto a mano", () => {
    // El literal desnudo, con límites de dígito: `3300` dentro de `33000` no
    // es el salario mínimo, y confundirlos invierte el diagnóstico.
    const literales = buscar(/(?<![0-9.])3\.?300(?![0-9])/);
    const fuera = literales.filter((h) => h.archivo !== FUENTE);

    expect(
      fuera,
      `el monto del salario mínimo está escrito a mano. Sale de ${FUENTE}: ` +
        `si mañana un DS lo cambia, la frase se mueve sola en vez de quedar ` +
        `mintiendo en una cifra que el cliente puede verificar.\n${comoLista(fuera)}`,
    ).toEqual([]);
  });

  it("los apartados de precio mantienen el anclaje", () => {
    // La portada corta deja la comparación extensa en los apartados interiores.
    // Allí el porcentaje sigue derivado de la fuente única.
    const PANTALLAS = ["precios/page.tsx", "chatbot/page.tsx"];

    for (const rel of PANTALLAS) {
      const abs = path.join(SRC, "app", "(sitio)", rel);
      expect(fs.existsSync(abs), `no existe la pantalla ${rel}`).toBe(true);

      const codigo = sinComentarios(fs.readFileSync(abs, "utf8"));
      expect(
        /salario\s+mínimo/i.test(codigo),
        `${rel} dejó de anclar el precio contra el salario mínimo.`,
      ).toBe(true);
      expect(
        /pctDelSalarioMinimo|SALARIO_MINIMO/.test(codigo),
        `${rel} nombra el salario mínimo pero no lo trae de ${FUENTE}.`,
      ).toBe(true);
    }
  });

  it("todo el que lo nombra lo trae de la fuente", () => {
    // La versión derivada del disco del caso anterior: una pantalla nueva que
    // use el anclaje nace cubierta, sin que nadie se acuerde de sumarla arriba.
    const nombran = buscar(/salario\s+mínimo/i);
    const archivos = [...new Set(nombran.map((h) => h.archivo))].filter(
      (a) => a !== FUENTE,
    );

    const sinImportar = archivos.filter((rel) => {
      const codigo = sinComentarios(
        fs.readFileSync(path.join(SRC, rel), "utf8"),
      );
      return !/pctDelSalarioMinimo|SALARIO_MINIMO/.test(codigo);
    });

    expect(
      sinImportar,
      `estos archivos hablan del salario mínimo sin traerlo de ${FUENTE}, ` +
        `así que el texto no se mueve cuando cambia el dato:\n` +
        sinImportar.map((a) => `  ${a}`).join("\n"),
    ).toEqual([]);
  });

  it("el porcentaje se calcula, no se escribe", () => {
    // El segundo turno: el número que se despega no es el salario, es el
    // PORCENTAJE — depende de dos cosas que se mueven por separado (el DS y el
    // precio del chatbot, que fija Sergio). Escrito a mano queda falso sin que
    // nadie toque la frase.
    const aMano = buscar(/[0-9]+\s*%\s*(del\s+)?salario/i);

    expect(
      aMano,
      `el porcentaje del salario mínimo está tipeado. Se deriva de ` +
        `CHATBOT_PLAN.mensual y del monto de la fuente, así se mueve solo ` +
        `cuando cambia cualquiera de los dos.\n${comoLista(aMano)}`,
    ).toEqual([]);
  });
});
