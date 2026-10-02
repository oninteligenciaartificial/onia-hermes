import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { PAGINAS, RUTAS_PROHIBIDAS } from "./rutas";

/**
 * Una CITA a una ruta del propio sitio tiene que apuntar a una ruta que existe.
 *
 * QUÉ PASÓ, y por qué esto no es higiene de comentarios. El 2026-09-07 a las
 * 15:45 nació `/v4`, la exploración de portada. Esa misma noche, a las 22:01,
 * Sergio Urcullo dijo «reemplazá la home con la v4»: la exploración PASÓ a ser
 * `/` y su ruta se borró (`2c3ce027`). La ruta se fue; sus CITAS se quedaron.
 *
 * Al día siguiente, otra sesión leyó una de esas citas —el encabezado de
 * `(sitio)/noche.tsx`, que decía que las dos variantes de la sección se podían
 * comparar «una al lado de la otra en /v4/noche»— le creyó, y le ofreció a
 * Sergio Urcullo abrir esa pantalla para elegir entre dos portadas. Da 404.
 * Una decisión de MARCA quedó trabada por un comentario (tarea `t_8e566d50`).
 *
 * El daño de esta clase es que la cita falsa DETIENE al que la lee: o le cree y
 * promete algo imposible, o la abre, recibe un 404 y no sabe si el defecto es
 * la ruta, el deploy o el comentario. Es el hermano de `cobertura-citada.test.ts`
 * —que exige que el script citado por un comentario exista— para RUTAS.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * POR QUÉ EL SUJETO NO ES «toda ruta citada», que es lo primero que uno
 * escribe. Medido antes de codear, sobre este mismo árbol: hay 23 rutas
 * citadas que no existen y VEINTIDÓS son prosa correcta —
 *
 *   · `/prueba-gratis`, en `(sitio)/empezar/page.tsx`, citada por una frase que
 *     dice, ella misma, «que ya no existe como página» (redirige con 308);
 *   · `/vs-sintic` y `/por-que-onia`, nombres HIPOTÉTICOS en un argumento sobre
 *     por qué el gate del header no se escribe como lista de exclusión;
 *   · `/preview` y `/modulos/dental`, describiendo el estado al que vuelve el
 *     sitio si se ejecuta el rollback que `v1/layout.tsx` documenta;
 *   · `/comercio/caja`, `/rrhh`, `/empresa`, `/agents`: pantallas del PANEL,
 *     que es otra app y otro repo.
 *
 * Un gate que las pusiera rojas mandaría a reescribir veintidós comentarios
 * correctos y a borrar bitácora — el fallo caro, el que manda a arreglar lo que
 * funciona. Así que el sujeto es la cita DIRECTIVA: la que le dice al lector
 * que ABRA una URL («ver <ruta>», «mirá <ruta>», «en <ruta> para elegir»). Ésa
 * promete una pantalla; una narración en pasado sólo cuenta lo que pasó. Con
 * ese recorte, el mismo barrido daba UN rojo —el de `/v4/noche`— y cero falsos
 * positivos.
 *
 * ⚠️ El patrón no distingue EMITIR una directiva de CITAR una ajena, así que
 * este encabezado narra el defecto sin reproducir la frase entera: si contara
 * el caso escribiendo el verbo pegado a la ruta muerta, el gate se pondría rojo
 * sobre su propia bitácora y obligaría a borrarla.
 *
 * Y el `disallow` de `robots.ts` entra entero, sin recorte, porque no es prosa
 * sino CONFIGURACIÓN: es la lista de páginas que el sitio declara tener y no
 * querer indexar, así que una entrada fantasma documenta una pantalla que no
 * está. Ahí vivía la otra mitad del mismo defecto: `/v4` siguió en el disallow
 * un día entero después de borrada, y el commit que la borró dice con todas las
 * letras que la sacaba de ahí.
 */

const APP = dirname(fileURLToPath(import.meta.url));

/** Las rutas que el árbol sirve HOY. La home es `/`, no la cadena vacía. */
const RUTAS_VIVAS = new Set(PAGINAS.map((p) => p.ruta || "/"));

/**
 * El texto de los COMENTARIOS de un fuente, por estado y no por prefijo de
 * línea.
 *
 * Filtrar con «la línea empieza con `//` o `*`» deja afuera el comentario JSX
 * de una sola línea —el que va entre llaves— que es justo donde vivía la mitad
 * más cara de este defecto: `(sitio)/page.tsx` mandaba, desde uno de ésos, a
 * una `/v4/noche` que ya no existía. Ya nos pasó con el multilínea el
 * 2026-09-06: el prefijo no ve el interior.
 *
 * `https://` no abre comentario: se exige que las dos barras no vengan
 * precedidas de `:`, o cada URL del árbol se leería como comentario.
 *
 * Y las CADENAS se saltan, que no es un detalle: sin eso, un fuente que guarda
 * markup en un literal —este mismo archivo, que usa el comentario JSX roto como
 * fixture— abre un bloque en el `/*` de adentro y el gate se acusa a sí mismo.
 * Lo cazó su primera corrida.
 */
export function comentarios(fuente: string): string[] {
  const salida: string[] = [];
  let i = 0;
  while (i < fuente.length) {
    const dos = fuente.slice(i, i + 2);
    const c = fuente[i];
    if (c === '"' || c === "'" || c === "`") {
      i += 1;
      while (i < fuente.length && fuente[i] !== c) i += fuente[i] === "\\" ? 2 : 1;
      i += 1;
    } else if (dos === "/*") {
      const fin = fuente.indexOf("*/", i + 2);
      const corte = fin === -1 ? fuente.length : fin;
      salida.push(fuente.slice(i + 2, corte));
      i = corte + 2;
    } else if (dos === "//" && fuente[i - 1] !== ":") {
      const fin = fuente.indexOf("\n", i);
      const corte = fin === -1 ? fuente.length : fin;
      salida.push(fuente.slice(i + 2, corte));
      i = corte;
    } else {
      i += 1;
    }
  }
  return salida;
}

/**
 * Los verbos con los que un comentario MANDA A ABRIR algo. La segunda forma
 * («en <ruta> para elegir») es la que tenía `noche.tsx`: no lleva verbo de ver
 * adelante, pero manda a ir a ese lugar A HACER algo, que es lo mismo.
 */
const DIRECTIVA =
  /(?:\b(?:ver|verla|verlas|mir[aá]|mirar|mirala|abr[ií]|abrir|abrila|compar[aá]|comparar|entr[aá]|and[aá])\s+(?:en\s+|a\s+)?`?(\/[a-z0-9][a-z0-9/-]*)`?)|(?:\ben\s+`?(\/[a-z0-9][a-z0-9/-]*)`?\s+para\s+[a-zá-ú]+r\b)/gi;

/** Las rutas internas que un texto manda a ABRIR. */
export function citasDirectivas(texto: string): string[] {
  return [...texto.matchAll(DIRECTIVA)].map((m) => m[1] ?? m[2]);
}

/** Todo `.ts`/`.tsx` bajo `src/`, que es donde vive el sitio de venta. */
function fuentes(dir: string, acc: string[] = []): string[] {
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const camino = join(dir, entrada.name);
    if (entrada.isDirectory()) fuentes(camino, acc);
    else if (/\.tsx?$/.test(entrada.name)) acc.push(camino);
  }
  return acc;
}

const SRC = join(APP, "..");

describe("toda ruta citada del propio sitio existe", () => {
  it("deriva las rutas del disco, y son las del sitio entero", () => {
    // Ancla: si alguien recorta el árbol del que salen los sujetos, este caso
    // cae antes de que el gate empiece a aprobar cualquier cosa.
    expect(RUTAS_VIVAS.has("/")).toBe(true);
    expect(RUTAS_VIVAS.has("/precios")).toBe(true);
    expect(RUTAS_VIVAS.size).toBeGreaterThanOrEqual(20);
  });

  it("el disallow de robots.ts sólo nombra rutas que existen", () => {
    // Vacuo-guarda: sin esto, un disallow vacío daría verde para siempre.
    // Bajó de 3 a 2 el 2026-09-29, cuando las raíces que redirigen 308 salieron
    // del disallow para que el buscador pueda seguir la redirección.
    expect(RUTAS_PROHIBIDAS.length).toBeGreaterThanOrEqual(2);

    // Una página del árbol, o un PREFIJO (termina en `/`) que es una carpeta de
    // `app/`: `/api/` no tiene páginas, tiene los endpoints de los formularios.
    const existe = (r: string) => RUTAS_VIVAS.has(r) || (r.endsWith("/") && existsSync(join(APP, r)));
    const fantasmas = RUTAS_PROHIBIDAS.filter((r) => !existe(r));
    expect(
      fantasmas,
      `robots.ts le prohíbe al rastreador rutas que no existen: ${fantasmas.join(", ")}. ` +
        `Un disallow es la lista de páginas que el sitio dice tener; una entrada ` +
        `fantasma documenta una pantalla que no está. Si la ruta se borró, sale de acá.`,
    ).toEqual([]);
  });

  it("ningún comentario manda a abrir una ruta que no existe", () => {
    const rotas: string[] = [];
    for (const archivo of fuentes(SRC)) {
      const texto = readFileSync(archivo, "utf8");
      for (const comentario of comentarios(texto)) {
        for (const ruta of citasDirectivas(comentario)) {
          if (!RUTAS_VIVAS.has(ruta)) {
            rotas.push(`${archivo.replace(SRC, "src")} → ${ruta}`);
          }
        }
      }
    }
    expect(
      rotas,
      `Un comentario manda a ABRIR una ruta que da 404: ${rotas.join(" · ")}. ` +
        `El que lo lee o le cree y promete una pantalla que no existe —ya pasó ` +
        `con /v4/noche y trabó una decisión de marca—, o la abre y no sabe si ` +
        `falla la ruta, el deploy o el comentario. Si la ruta se borró, la cita ` +
        `se escribe en PASADO; si es de otra app, se escribe con su host.`,
    ).toEqual([]);
  });

  /**
   * Los tres casos de abajo son FIXTURES, no el árbol vivo.
   *
   * Un caso escrito contra el archivo vivo pasa en verde con la guarda
   * arrancada, porque el texto de hoy ya no dispara el patrón que la guarda
   * persigue — lo medimos el 2026-09-06 y el caso quedó de adorno. Acá el
   * defecto se fuerza con su forma REAL, la que produjo el daño.
   */
  it("ve el comentario JSX de una línea, que es donde vivía la mitad cara", () => {
    const jsx = `      {/* 3 · LA NOCHE (variante A, con foto) ── ver /v4/noche */}`;
    expect(comentarios(jsx).length).toBe(1);
    expect(citasDirectivas(comentarios(jsx)[0])).toEqual(["/v4/noche"]);
  });

  it("caza las dos formas reales del defecto", () => {
    // La de `page.tsx`: verbo de ver + la ruta, dentro de un comentario JSX.
    expect(citasDirectivas("── ver /v4/noche */")).toEqual(["/v4/noche"]);
    // La de `noche.tsx`: sin verbo de ver, pero manda a ir ahí A ELEGIR.
    expect(
      citasDirectivas("una al lado de la otra en /v4/noche para elegir, sin que"),
    ).toEqual(["/v4/noche"]);
  });

  it("NO toca la bitácora: una ruta muerta contada en pasado es legítima", () => {
    // Éstas son, textuales, cuatro de las veintidós citas correctas del árbol.
    // Si el patrón las mordiera, el gate obligaría a borrar el registro de lo
    // que pasó — que es como esta familia de gates hace daño.
    const prosa = [
      "Hereda el embudo de la vieja `/prueba-gratis`, que ya no existe como página:",
      "Medido el 2026-09-07 en `/v4`, servida por producción con 200.",
      "La `/comparativa` de mañana puede llamarse `/vs-sintic` o `/por-que-onia`",
      "`/` vuelve a ser la v1, reaparecen `/precios`, `/chatbot`, `/preview`",
    ];
    for (const linea of prosa) {
      expect(citasDirectivas(linea), `mordió prosa histórica: «${linea}»`).toEqual([]);
    }
  });
});
