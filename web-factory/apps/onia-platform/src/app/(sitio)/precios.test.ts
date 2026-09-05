import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * Ningún precio de PLAN se escribe a mano en la superficie de venta.
 *
 * POR QUÉ EXISTE. `CLAUDE.md` abre con esta regla y con el desastre que la
 * originó: llegó a haber **cuatro precios vivos del mismo chatbot** al mismo
 * tiempo, y con eso cualquier sesión elige mal. Los planes tienen su fuente
 * única —`PLANES` acá, espejo de `DEFAULT_PLAN_AMOUNTS` del producto— pero
 * hasta hoy nadie medía que la PROSA del sitio dijera lo mismo que la tabla.
 * Se encontraron cuatro copias tipeadas a mano (2026-09-03): la `description`
 * de `/precios`, el chip del hero de la home, nuestra propia fila de la
 * comparativa y la letra chica del semanal. Coincidían por suerte, no por
 * construcción: el día que Sergio cambia un plan, cambia la tabla y las cuatro
 * frases siguen anunciando el precio viejo.
 *
 * Y una de ellas era **metadata**, que es la parte de la superficie de cliente
 * que NO se ve mirando la pantalla: toda captura da verde sobre ese defecto.
 *
 * QUÉ CAZA, y por qué así. La CLASE —"un monto de plan escrito como literal"—,
 * no las cuatro frases de hoy. Los sujetos salen del DISCO, no de una lista de
 * inclusión: un archivo nuevo nace cubierto y hay que excluirlo a mano, a la
 * vista. (Ya se pagó el precio de lo contrario: `compartir.test.ts` sacaba sus
 * rutas del sitemap y falló ABIERTO el día que una página salió del sitemap.)
 *
 * ⚠️ **Y esa regla se aplicaba a los archivos pero NO a los directorios**, que
 * es donde volvió a fallar abierto (2026-09-04). Las raíces eran cuatro
 * carpetas escritas a mano —`app/(sitio)`, `content`, `lib`,
 * `components/landing-v1`— o sea una lista de inclusión un nivel más arriba:
 * el árbol `app/v1/**` quedaba entero sin vigilancia. Ahí vivían **17** montos
 * de plan tipeados a mano, en cuatro rutas que producción sirve con 200
 * (`/v1`, `/v1/precios`, `/v1/modulos/dental`, `/v1/empezar`), y el gate pasaba
 * en verde. Nueve estaban en `app/v1/empezar/data.ts`, el MISMO archivo donde
 * el precio de la web se quedó doce días a menos de la mitad — veinte líneas
 * más arriba del copy que ya se había atado a su fuente, bajo un comentario que
 * afirmaba que esos números "salen de lib/pricing.ts" cuando estaban tipeados.
 * Por eso ahora el recorrido arranca de `src/` entero: una carpeta nueva nace
 * cubierta, igual que un archivo nuevo.
 *
 * QUÉ NO CAZA, DELIBERADAMENTE. Sólo los montos de PLANES y GRUPO. Los add-ons
 * quedan fuera porque sus números COLISIONAN con otros productos: `Bs 390` es
 * el chatbot **y** el plan «Cuidado Web Crecimiento» de `content/webs.ts`, que
 * es correcto y no tiene nada que ver. Un gate que grita por algo correcto se
 * termina apagando, y entonces no cuida nada.
 */

const AQUI = path.dirname(new URL(import.meta.url).pathname);
const SRC = path.resolve(AQUI, "..", "..");

/**
 * Exclusiones, cada una con su motivo. Vacía a propósito: si mañana hace falta
 * una, que quede escrita acá y no como un silencio.
 */
const EXENTOS: ReadonlyArray<{ archivo: string; motivo: string }> = [];

/**
 * Los montos se LEEN del disco, no se importan: los gates de esta app no
 * resuelven el alias `@/` (no hay config de vitest), y `pricing.ts` importa por
 * alias. Leerlo como texto además mantiene al gate sin dependencias de runtime.
 */
const PRICING = path.join(SRC, "lib", "pricing.ts");

/** Montos que SÓLO puede definir la tabla de planes (PLANES + GRUPO). */
function montosDePlan(): number[] {
  const src = fs.readFileSync(PRICING, "utf8");
  const n = new Set<number>();
  // `mensual: 320,` · `semanal: 89,` · `anual: 3200,` — las tres claves de precio.
  const re = /^\s*(mensual|semanal|anual):\s*([0-9]+)\s*,/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) n.add(Number(m[2]));
  return [...n];
}

/**
 * Un monto de plan renderizado como TEXTO JSX suelto: `>1.500<`.
 *
 * Es la firma de la forma partida (`<span>320</span><span>Bs / mes</span>`), y
 * se queda en el texto entre etiquetas a propósito: un número interpolado
 * —`>{bs(plan.mensual)}<`, que es lo correcto— trae una llave en el medio y no
 * matchea. Sólo cae el literal, que es el defecto.
 *
 * No genera falsos positivos porque el conjunto de sujetos es cerrado: sólo
 * dispara si el número coincide con un monto que la tabla YA define. Un `01`
 * de paso, un año o un contador no están en `montosDePlan()`.
 *
 * Es una fábrica y no una constante: un `RegExp` con `/g` guarda `lastIndex`
 * entre llamadas, y compartir esa instancia entre archivos haría que el gate
 * empiece a leer cada archivo desde donde terminó el anterior — o sea, se
 * saltearía hallazgos en silencio, que es como esta familia de gates falla
 * abierto.
 */
function textoJsxDesnudo(): RegExp {
  return />\s*([0-9][0-9.]*)\s*</g;
}

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
 * Quita comentarios CONSERVANDO los saltos de línea. Sin esto el número de
 * línea que reporta el gate miente — ya pasó con `voz.test.ts`, que apuntaba a
 * la 122 para algo que estaba en la 215, y perseguir esa línea cuesta la vuelta.
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

function tipeadosAMano(): Hallazgo[] {
  const montos = montosDePlan();
  const exentos = new Set(EXENTOS.map((e) => e.archivo));
  const hallazgos: Hallazgo[] = [];

  for (const abs of archivosDe(SRC)) {
    const rel = path.relative(SRC, abs);
    if (exentos.has(rel)) continue;
    const src = sinComentarios(fs.readFileSync(abs, "utf8"));
    // Las TRES formas de escribirlo. "Bs 320" es la común; "1.500 Bs/mes" es la
    // que se le escapó al gate hasta el 2026-09-04 y por la que la descripción
    // de OpenGraph de /precios —la que se ve al compartir el enlace— quedó con
    // los tres montos congelados mientras su hermana de al lado ya leía la
    // tabla. Un gate que sólo entiende un orden de palabras cuida medio tema.
    //
    // ⚠️ Y las dos primeras exigen que "Bs" esté PEGADO al número, así que las
    // dos juntas seguían siendo ciegas a la forma en que el sitio escribe su
    // precio más grande: el monto y la unidad en NODOS SEPARADOS —
    // `<span>{bs(plan.mensual)}</span><span>Bs / mes</span>` (page.tsx:697,
    // el bloque `.planPrice` de la home y de /precios). Ahí el literal a mano
    // queda desnudo, sin ningún "Bs" al lado que lo delate. Medido el
    // 2026-09-04 inyectando el defecto exacto —`<span>1.500</span>` en el
    // bloque de precio de la portada, la primera pantalla que ve un lead—:
    // este archivo pasó con sus 4 casos en VERDE. La tercera forma lo caza.
    //
    // ⚠️ Y las TRES juntas seguían siendo ciegas a la única superficie de
    // precio que vive FUERA del JSX: el JSON-LD. Ahí el monto viaja desnudo y
    // sin etiquetas alrededor —`price: "320"`, con la moneda en otra clave
    // (`priceCurrency: "BOB"`)—, así que ni el "Bs" pegado ni el texto entre
    // `>` y `<` lo delatan. No es superficie menor: es de donde Google saca el
    // precio que publica en el buscador, y no se ve en ninguna captura.
    // Medido el 2026-09-05: `/v1/precios` ya leía la tabla en su `description`
    // —atada a la fuente el día anterior, con el comentario que lo narra— y
    // TREINTA Y CINCO LÍNEAS MÁS ABAJO, en el mismo archivo, tipeaba los tres
    // montos a mano en su JSON-LD; `/v1/modulos/dental` hacía lo mismo con el
    // Básico, dos líneas debajo de un `plan("basico").mensual` bien leído. Las
    // dos rutas las sirve producción con 200. La cuarta forma las caza.
    for (const re of [
      /Bs\s*([0-9][0-9.]*)/g,
      /([0-9][0-9.]*)\s*Bs\b/g,
      textoJsxDesnudo(),
      /\bprice:\s*"([0-9][0-9.]*)"/g,
    ]) {
      let m: RegExpExecArray | null;
      while ((m = re.exec(src)) !== null) {
        const valor = Number(m[1].replace(/\./g, ""));
        if (!montos.includes(valor)) continue;
        hallazgos.push({
          archivo: rel,
          linea: src.slice(0, m.index).split("\n").length,
          texto: m[0],
        });
      }
    }
  }
  return hallazgos;
}

describe("los precios de plan no se escriben a mano", () => {
  it("ninguna superficie de venta tipea un monto de PLANES o GRUPO", () => {
    const hallazgos = tipeadosAMano();
    const detalle = hallazgos
      .map((h) => `  ${h.archivo}:${h.linea} → "${h.texto}"`)
      .join("\n");
    expect(
      hallazgos,
      `Estos montos de plan están escritos como literal en vez de leerse de PLANES.\n` +
        `El día que cambie el precio, la tabla cambia y estas frases mienten:\n${detalle}\n` +
        `Arreglo: interpolar con bs(...) desde PLANES/GRUPO.`,
    ).toEqual([]);
  });

  /**
   * Ancla. Sin esto, el día que alguien vacíe PLANES o rompa el regex, el gate
   * pasa en verde midiendo nada — que es como un gate deja de cuidar sin que
   * nadie se entere.
   */
  it("el gate tiene contra qué medir", () => {
    const montos = montosDePlan();
    // 3 planes × (mensual + anual) + 2 semanales + GRUPO = de sobra 8 montos.
    // Deliberadamente NO se escribe ningún número esperado: hacerlo sería la
    // quinta copia a mano del precio, dentro del gate que las prohíbe.
    expect(montos.length).toBeGreaterThanOrEqual(8);
    for (const m of montos) expect(m).toBeGreaterThan(1);

    // Y se prueba a sí mismo, con un monto REAL leído del disco: si el regex
    // deja de detectar, este caso cae y el gate no puede pasar midiendo nada.
    const real = montos[0];
    const falso = sinComentarios(`const x = "Plan Bs ${real} al mes"; // Bs 999999`);
    expect(/Bs\s*([0-9][0-9.]*)/.exec(falso)?.[1]).toBe(String(real));
    // Y que sinComentarios de verdad ciega lo comentado (si no, falsos positivos).
    expect(falso).not.toContain("999999");
  });

  /**
   * Ancla contra la regresión exacta del 2026-09-04: el precio partido en dos
   * nodos. Con sólo los dos patrones que exigen "Bs" pegado al número, este
   * archivo pasaba con TODOS sus casos en verde mientras la portada tipeaba a
   * mano el monto del plan — se midió inyectando el defecto en `page.tsx:697`.
   *
   * El caso prueba las dos direcciones, que es lo que hace que sirva: que la
   * forma partida a mano CAE, y que la interpolada —la correcta, la que el
   * sitio usa hoy— NO cae. Sin la segunda mitad, el arreglo obvio para poner
   * el gate en verde sería dejar de leer el bloque de precio entero.
   */
  it("caza el precio partido en dos nodos, y no confunde el interpolado", () => {
    const real = montosDePlan()[0];
    const aMano = `<span className={s.planNum}>${real}</span><span>Bs / mes</span>`;
    const interpolado = `<span className={s.planNum}>{bs(plan.mensual)}</span>`;

    const cae = [...aMano.matchAll(textoJsxDesnudo())].map((m) => m[1]);
    expect(
      cae,
      `El monto ${real} escrito como texto JSX suelto tiene que caer: es la ` +
        `forma en que el sitio escribe su precio más visible, y la que los ` +
        `patrones con "Bs" pegado no ven.`,
    ).toContain(String(real));

    expect(
      [...interpolado.matchAll(textoJsxDesnudo())],
      `Un precio interpolado desde PLANES es lo CORRECTO y no puede dar ` +
        `hallazgo: un gate que grita por lo correcto se termina apagando.`,
    ).toEqual([]);
  });

  /** Que el archivo recorra superficie de verdad, no un directorio vacío. */
  it("mira archivos de verdad", () => {
    expect(archivosDe(SRC).length).toBeGreaterThan(20);
  });

  /**
   * Ancla contra la regresión exacta del 2026-09-04: el recorrido llega a
   * `app/v1`, que estuvo entero fuera de vigilancia con 17 montos a mano.
   * Sin este caso, volver a poner una lista de carpetas dejaría el gate en
   * verde midiendo menos superficie de la que dice cuidar.
   */
  it("cubre todo el árbol, no una lista de carpetas elegidas", () => {
    const vistos = archivosDe(SRC).map((f) => path.relative(SRC, f));
    for (const rama of ["app/(sitio)/", "app/v1/", "content/", "lib/"]) {
      expect(
        vistos.some((f) => f.startsWith(rama)),
        `El recorrido no llega a "${rama}". Los sujetos se derivan de \`src/\` ` +
          `entero justamente para que una carpeta nueva nazca cubierta: si hace ` +
          `falta dejar algo afuera, va en EXENTOS con su motivo, a la vista.`,
      ).toBe(true);
    }
  });
});
