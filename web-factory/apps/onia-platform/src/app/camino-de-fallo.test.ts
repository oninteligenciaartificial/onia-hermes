import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";

/**
 * El camino de FALLO del sitio de venta: que ve un lead cuando algo revienta.
 *
 * 🔴 **Por que ningun gate podia ver esto.** Los cuarenta gates de esta app
 * derivan sus sujetos de los `page.tsx` del disco —`obra`, `indexar`,
 * `compartir`, `alcance`, `precios`, `promesa-*`—, y la pantalla de error
 * **no es una pagina**: no esta en el sitemap, no responde a ninguna URL, no
 * sale en una captura y no aparece en el HTML de ninguna ruta. Cuando el sitio
 * anda, no se ve nunca. No sobra ni falta una palabra, no hay precio ni enlace
 * roto: el defecto es una AUSENCIA.
 *
 * Y la ausencia tenia dueno conocido. `not-found.tsx` lleva escrito en su
 * propio comentario que el 404 «antes caia en la pantalla por defecto de Next
 * — en ingles, sin marca y sin salida». Se arreglo esa instancia; su hermana
 * —el error boundary— quedo abierta, con 25 rutas y 15 componentes cliente
 * detras, sirviendo «Application error: a client-side exception has occurred»
 * (el literal vive en `next/dist/client/components/builtin/global-error.js`).
 *
 * El sujeto se DERIVA del disco: cada ruta sube por sus carpetas hasta
 * `src/app` buscando un boundary ancestro. Asi una ruta nueva nace cubierta —
 * y el dia que alguien borre el boundary raiz, el gate nombra las 25.
 *
 * Se mide sobre el codigo SIN COMENTARIOS: un gate que busca un literal en el
 * archivo entero se absuelve con la bitacora que explica por que el literal no
 * va (pasa en verde con el arreglo arrancado).
 */

const APP = join(process.cwd(), "src", "app");

/** Quita comentarios respetando comillas: `https://` no es un comentario. */
function sinComentarios(fuente: string): string {
  let salida = "";
  let i = 0;
  let comilla: string | null = null;

  while (i < fuente.length) {
    const c = fuente[i];
    const par = fuente.slice(i, i + 2);

    if (comilla) {
      if (c === "\\") {
        salida += fuente.slice(i, i + 2);
        i += 2;
        continue;
      }
      if (c === comilla) comilla = null;
      salida += c;
      i += 1;
      continue;
    }

    if (c === '"' || c === "'" || c === "`") {
      comilla = c;
      salida += c;
      i += 1;
      continue;
    }

    if (par === "//") {
      while (i < fuente.length && fuente[i] !== "\n") i += 1;
      continue;
    }

    if (par === "/*") {
      i += 2;
      while (i < fuente.length && fuente.slice(i, i + 2) !== "*/") i += 1;
      i += 2;
      continue;
    }

    salida += c;
    i += 1;
  }

  return salida;
}

/**
 * Lo que un lead puede LEER: los literales de texto y el contenido entre
 * etiquetas. El sujeto NO es el archivo entero — `error.tsx` recibe
 * `{ digest?: string }` porque esa es la firma que Next le pasa, y buscar la
 * jerga en el código acusa a un archivo sano de mostrarle «digest» a alguien.
 */
function textoVisible(codigo: string): string {
  const sinLog = codigo.replace(/console\.error\([\s\S]*?\);/g, "");
  const literales = sinLog.match(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g) ?? [];
  const enJsx = [...sinLog.matchAll(/>([^<>{}]+)</g)].map((m) => m[1]);
  return [...literales, ...enJsx].join(" ");
}

/** Todas las rutas del disco: las carpetas que tienen un `page.tsx`. */
function paginasDelDisco(dir: string = APP): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.isDirectory()) return paginasDelDisco(join(dir, e.name));
    return e.name === "page.tsx" ? [dir] : [];
  });
}

/** El boundary que cubre a una ruta: el `error.tsx` mas cercano subiendo hasta `src/app`. */
function boundaryQueLaCubre(carpeta: string): string | null {
  let actual = carpeta;
  for (;;) {
    const candidato = join(actual, "error.tsx");
    if (existsSync(candidato)) return candidato;
    if (actual === APP) return null;
    const padre = dirname(actual);
    if (padre === actual) return null;
    actual = padre;
  }
}

const PAGINAS = paginasDelDisco();
const RAIZ_SEGMENTO = join(APP, "error.tsx");
const RAIZ_GLOBAL = join(APP, "global-error.tsx");

/** Lo que Next sirve si estos archivos no existen, y jerga que no se le muestra a un lead. */
const JERGA = [
  /application error/i,
  /client-side exception/i,
  /something went wrong/i,
  /try again/i,
  /\bstack\b/i,
  /\bdigest\b/i,
  /unexpected/i,
];

/** Obra a la vista: un error puntual no se convierte en un cartel de estado del producto. */
const OBRA = [
  /\bmuy pronto\b/i,
  /\bpr[oó]ximamente\b/i,
  /en construcci[oó]n/i,
  /\bbeta\b/i,
  /mantenimiento/i,
  /volv[eé] m[aá]s tarde/i,
  /estamos (arreglando|trabajando)/i,
];

const BOUNDARIES = [
  { rotulo: "error.tsx (segmento)", ruta: RAIZ_SEGMENTO },
  { rotulo: "global-error.tsx (layout raíz)", ruta: RAIZ_GLOBAL },
];

describe("el camino de fallo del sitio de venta", () => {
  it("el barrido encuentra las rutas: sin esto los casos de cobertura no miden nada", () => {
    // Ancla. Si alguien mueve `src/app` o rompe el descubrimiento, la
    // cobertura de abajo pasaría en verde recorriendo una lista vacía.
    expect(PAGINAS.length, "el barrido de page.tsx encontró casi nada").toBeGreaterThan(9);
  });

  it.each(BOUNDARIES)("existe $rotulo", ({ ruta }) => {
    expect(
      existsSync(ruta),
      `falta ${relative(process.cwd(), ruta)}: sin él Next le sirve al lead ` +
        "«Application error: a client-side exception has occurred» — en inglés, " +
        "con jerga, sin marca y sin salida. Es el defecto que not-found.tsx ya " +
        "arregló para el 404.",
    ).toBe(true);
  });

  it("toda ruta del sitio tiene un boundary que la cubre", () => {
    const huerfanas = PAGINAS.filter((p) => boundaryQueLaCubre(p) === null).map(
      (p) => "/" + relative(APP, p).split(sep).join("/"),
    );
    expect(
      huerfanas,
      `${huerfanas.length} de ${PAGINAS.length} rutas quedarían con la pantalla de ` +
        "error de Next en inglés",
    ).toEqual([]);
  });

  describe.each(BOUNDARIES)("$rotulo", ({ ruta }) => {
    const codigo = () => sinComentarios(readFileSync(ruta, "utf8"));

    it("es un componente cliente: un boundary de servidor no atrapa nada", () => {
      expect(codigo().trimStart().startsWith('"use client"')).toBe(true);
    });

    it("no le muestra jerga técnica ni inglés al lead", () => {
      const encontrada = JERGA.filter((p) => p.test(textoVisible(codigo()))).map(String);
      expect(encontrada, "eso va a la consola, no a la pantalla").toEqual([]);
    });

    it("no exhibe obra: un error puntual no es un cartel de estado del producto", () => {
      const encontrada = OBRA.filter((p) => p.test(textoVisible(codigo()))).map(String);
      expect(encontrada).toEqual([]);
    });

    it("deja salida: reintentar y el inicio", () => {
      const c = codigo();
      expect(/reset\(\)/.test(c), "no ofrece reintentar").toBe(true);
      expect(/href="\/"/.test(c), "no ofrece volver al inicio").toBe(true);
    });

    it("registra el fallo: sin log no hay diagnóstico", () => {
      expect(/console\.error\(/.test(codigo())).toBe(true);
    });
  });

  it("global-error.tsx declara el idioma: reemplaza el documento entero", () => {
    // Es el único archivo del sitio que trae su propio <html>: si no declara
    // `lang`, el lector de pantalla lee este texto con fonética inglesa.
    expect(/<html\s+lang="es"/.test(sinComentarios(readFileSync(RAIZ_GLOBAL, "utf8")))).toBe(
      true,
    );
  });

  it("el despojador de comentarios no se come el código ni confunde una URL", () => {
    // Sin este caso, un `sinComentarios` roto vaciaría los archivos y TODOS los
    // casos de arriba pasarían en verde sobre la nada.
    expect(sinComentarios('const u = "https://onia.com.bo"; // nota')).toBe(
      'const u = "https://onia.com.bo"; ',
    );
    expect(sinComentarios("a\n/* muy pronto\n sigue */\nb")).toBe("a\n\nb");
    expect(sinComentarios("{/* muy pronto */}")).toBe("{}");
  });

  it("el extractor ve lo que el lead lee, y NO la firma que le pasa Next", () => {
    // Las dos direcciones. Sin la primera, un extractor que devuelva vacío deja
    // los casos de jerga y de obra en verde sobre cualquier texto. Sin la
    // segunda, el gate acusa a un archivo sano por el tipo `{ digest?: string }`
    // que Next exige en la firma — así arrancó, en rojo sobre código correcto.
    expect(textoVisible("<h1>Application error</h1>")).toContain("Application error");
    expect(textoVisible("error: Error & { digest?: string }")).not.toMatch(/digest/);
  });
});
