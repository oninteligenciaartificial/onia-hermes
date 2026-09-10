import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Cuando la venta promete que el cliente se lleva SUS datos, no le pone una
 * condición de plan — porque el producto no le pone ninguna.
 *
 * 🔴 **Por qué ningún gate de esta casa podía ver esto.** Toda la familia
 * persigue lo que la venta afirma de MÁS:
 *
 *  - `obra.test.ts`, `obra-en-el-cuerpo.test.ts`, `obra-literal.test.ts` → una
 *    palabra de obra que sobra;
 *  - `promesa-humana.test.ts`, `factura-en-la-oferta.test.ts` → una capacidad
 *    que no tenemos;
 *  - `capacidad-vs-precio.test.ts`, `capacidad-acotada.test.ts`,
 *    `limite-que-corta.test.ts` → una capacidad SIN su salvedad;
 *  - `precios.test.ts`, `precios-addons.test.ts` → un monto fuera de la fuente.
 *
 * Acá no sobra ninguna palabra, no falta ninguna salvedad y no hay un solo
 * número: lo que está mal es que **SOBRA UNA CONDICIÓN**. Y es la forma más
 * difícil de auditar de todas, porque una condición se lee como honestidad —
 * parece letra chica responsable, así que nadie la mira dos veces. Es el mismo
 * mecanismo por el que un gate se absuelve con su propia bitácora, aplicado al
 * copy: el texto que parece cuidadoso es el que nadie audita.
 *
 * MEDIDO el 2026-09-10 sobre el árbol, con CUATRO copias vivas:
 *  - `app/(sitio)/faq-datos.ts` → «Los exportás en CSV cuando quieras, en
 *    cualquier plan pago» y «los exportás en CSV desde el plan más chico»;
 *  - `components/landing-v1/faq.tsx` → «en cualquier plan pago»;
 *  - `lib/pricing.ts` (letra chica de la tabla de precios, la que lee quien
 *    está por decidir) → «los exportás en CSV desde el plan más chico».
 *
 * LO QUE DICE EL PRODUCTO, que es lo que vuelve falsa a esa condición:
 *  1. `onia-platform/app/api/settings/export/route.ts:14` — el export integral
 *     de todo el negocio está detrás de `requireAdmin()` y de nada más, con el
 *     motivo escrito ahí: *«Es un derecho del titular, no una feature del plan:
 *     no se gatea por canExportCsv»*.
 *  2. `onia-platform/lib/subscription/plan-state.ts:29` — `TRIAL_PLAN =
 *     "professional"`, así que **la prueba corre con Pro** y
 *     `csvExportEnabled` ya es `true` (`lib/plan-catalogo.ts`). El único plan
 *     que no exporta es `free`, y en producción la única cuenta `free` es la
 *     org interna de Onia (medido en `supabase-db`: 10 `professional`,
 *     1 `basic`, 1 `free`).
 *
 * O sea que la condición se la negaba **justo a quien está probando** — el que
 * abre la pregunta «¿mis datos son míos?» antes de poner un peso — y encima
 * contradecía a `/nosotros`, que promete lo contrario en ese mismo caso: *«Si
 * no te sirve, no pagás nada y tus datos te los llevás en CSV cuando quieras»*.
 *
 * TRES DECISIONES QUE LO HACEN CLASE Y NO INSTANCIA:
 *
 *  1. **El sujeto es la MENCIÓN, derivada del disco** (todo `src/`): una página
 *     nueva que prometa el export nace cubierta, y hay que EXIMIRLA a mano —a
 *     la vista— para que deje de estar. Una lista de rutas escrita a mano es la
 *     forma en que estos gates fallan abiertos.
 *  2. **La condición se busca en la ORACIÓN, no en el archivo.** Con ventana de
 *     documento, un «desde el plan Pro» legítimo de otro párrafo (los agentes,
 *     que SÍ son Pro+) absolvería o acusaría al de al lado. Se corta en el
 *     punto, que es lo que lee una persona.
 *  3. **Se mide sobre el código SIN COMENTARIOS.** Si no, esta misma bitácora
 *     —que cita la frase vieja para explicar por qué se fue— pondría el gate en
 *     rojo y obligaría a borrar el registro de lo que pasó.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
/** `src/` entero: el copy de venta vive en `app/`, `components/`, `lib/` y `content/`. */
const SRC = join(AQUI, "..");

/**
 * Cómo se nombra al acto de llevarse los datos. No es una lista de frases
 * completas a propósito: alcanza con el verbo, así una redacción nueva entra.
 */
const LLEVARSE_LOS_DATOS =
  /\b(export[áa]s|exportarlos|exportar|export(?:ación|acion)|te los llev[áa]s|los llev[áa]s)\b/i;

/**
 * Que la oración hable de los datos DEL CLIENTE, no de exportar cualquier cosa
 * (un reporte contable, un PDF de la propuesta). Sin esto el gate acusaría a
 * capacidades que sí son features de plan.
 */
const SON_SUS_DATOS = /\b(datos|CSV|planilla|informaci[oó]n)\b/i;

/**
 * Una condición de PLAN o de PAGO. Varias formas a propósito: un gate que
 * prohíbe un literal en una sola forma cuida medio tema, y la mitad que no
 * cuida es justo la que ya se despegó.
 */
const CONDICION_DE_PLAN =
  /\b(?:en (?:cualquier )?plan(?:es)? pago|planes? pagos?|desde el plan|a partir del plan|s[oó]lo (?:en|con) (?:el )?plan|requiere (?:el )?plan|necesit[áa]s (?:el )?plan|con (?:un )?plan (?:pago|activo)|abonando|una vez que pagu)/i;

/**
 * Menciones que NO prometen el export al lead. Cada entrada se RE-MIDE: si su
 * fragmento dejó de estar donde dice, el gate se pone rojo — una excusa que
 * sobra queda bendiciendo lo que ya no existe, igual que una lista blanca.
 */
const EXENTOS: ReadonlyArray<{ archivo: string; fragmento: string; motivo: string }> = [];

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
      const fin = fuente.indexOf("\n", i);
      i = fin === -1 ? fuente.length : fin;
      continue;
    }

    if (par === "/*") {
      const fin = fuente.indexOf("*/", i + 2);
      // Se reemplaza por espacios: así las distancias no se encogen y un bloque
      // largo de comentario no pega dos oraciones que están lejos.
      const hasta = fin === -1 ? fuente.length : fin + 2;
      salida += " ".repeat(hasta - i);
      i = hasta;
      continue;
    }

    salida += c;
    i += 1;
  }

  return salida;
}

function fuentesDeVenta(dir: string, acc: string[] = []): string[] {
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) {
      if (entrada.name === "node_modules" || entrada.name === "__tests__") continue;
      fuentesDeVenta(ruta, acc);
      continue;
    }
    if (!/\.tsx?$/.test(entrada.name)) continue;
    if (/\.test\.tsx?$/.test(entrada.name)) continue;
    acc.push(ruta);
  }
  return acc;
}

const FUENTES = fuentesDeVenta(SRC);

/**
 * Parte un texto en ORACIONES. El corte es el punto seguido de espacio o de
 * fin de cadena; el `;` también corta, porque en el copy de la casa separa dos
 * afirmaciones independientes («…no una función del plan; la política está
 * publicada»).
 */
function oraciones(texto: string): string[] {
  return texto
    .split(/(?<=[.;:])\s+|\n/)
    .map((o) => o.trim())
    .filter(Boolean);
}

type Promesa = { archivo: string; oracion: string };

/** Toda oración viva que promete que el cliente se lleva sus datos. */
function promesasDeExport(): Promesa[] {
  const salida: Promesa[] = [];

  for (const ruta of FUENTES) {
    const limpio = sinComentarios(readFileSync(ruta, "utf8"));

    for (const oracion of oraciones(limpio)) {
      if (!LLEVARSE_LOS_DATOS.test(oracion)) continue;
      if (!SON_SUS_DATOS.test(oracion)) continue;
      salida.push({ archivo: relative(SRC, ruta), oracion });
    }
  }

  return salida;
}

const exenta = (p: Promesa) =>
  EXENTOS.some((e) => p.archivo.endsWith(e.archivo) && p.oracion.includes(e.fragmento));

describe("la salida del cliente con sus datos no está detrás de un plan", () => {
  it("hay algo que vigilar: el barrido encuentra la promesa del export", () => {
    // Ancla. Sin esto, que el barrido deje de encontrar archivos —o que alguien
    // recorte el árbol que recorre— dejaría el gate VERDE sin haber medido una
    // sola oración, que es como esta familia falla abierto.
    expect(FUENTES.length, "el barrido de src/ encontró casi nada").toBeGreaterThan(50);
    expect(
      promesasDeExport().length,
      "ninguna superficie promete llevarse los datos: el barrido no está midiendo",
    ).toBeGreaterThan(2);
  });

  it("ninguna promesa de llevarse los datos lleva condición de plan o de pago", () => {
    const condicionadas = promesasDeExport()
      .filter((p) => !exenta(p))
      .filter((p) => CONDICION_DE_PLAN.test(p.oracion));

    expect(
      condicionadas.map((p) => `${p.archivo} — «${p.oracion}»`),
      "la venta le pone al export de SUS datos una condición que el producto no impone (settings/export sólo pide requireAdmin, y la prueba corre con Pro): eso se la niega justo a quien está probando",
    ).toEqual([]);
  });

  it("la condición de un plan legítimo NO cuenta como defecto", () => {
    // Anclaje en la dirección cara: acotar por plan es CORRECTO cuando el
    // producto lo acota (los agentes son Pro+, `agentsIncluded`). Sin este caso,
    // ensanchar el patrón para cazar una forma nueva mandaría a romper copy sano
    // —el modo de falla que ya costó una vuelta con el gate de la zona horaria—.
    const legitima = "Los agentes de IA vienen desde el plan Pro.";
    expect(CONDICION_DE_PLAN.test(legitima), "el patrón de condición no reconoce la forma").toBe(
      true,
    );
    expect(
      LLEVARSE_LOS_DATOS.test(legitima) && SON_SUS_DATOS.test(legitima),
      "una capacidad que el producto SÍ acota por plan quedó dentro del sujeto del gate",
    ).toBe(false);
  });

  it("una promesa condicionada en una oración vecina SÍ se caza", () => {
    // La ventana es la oración, no el documento: sin este caso no habría forma
    // de saber si el corte por oración dejó de cortar y el gate empezó a leer
    // archivos enteros —donde un «desde el plan Pro» ajeno absuelve o acusa.
    const dos = oraciones(
      "Los agentes vienen desde el plan Pro. Los datos los exportás en CSV cuando quieras.",
    );
    expect(dos.length, "el corte por oración no está cortando").toBe(2);
    const sujeto = dos.filter((o) => LLEVARSE_LOS_DATOS.test(o) && SON_SUS_DATOS.test(o));
    expect(sujeto.length, "el sujeto se perdió al cortar").toBe(1);
    expect(
      CONDICION_DE_PLAN.test(sujeto[0]),
      "la condición del párrafo vecino se colgó de la promesa del export",
    ).toBe(false);
  });
});
