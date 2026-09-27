import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { RETENCION } from "@/lib/pricing";

/**
 * Cuando la venta ofrece el export como parte de IRSE, dice hasta cuándo vale —
 * porque el contrato le pone un reloj al derecho, no sólo a los datos.
 *
 * 🔴 **Por qué ningún gate de esta casa podía ver esto, teniendo TRES vecinos
 * que leen el mismo contrato.** Cada uno mide un eje distinto de la misma
 * promesa, y el que faltaba es el que más cerca estaba:
 *
 *  - `salida-prometida.test.ts` → el **alcance** de la salida. Su disparador es
 *    el verbo de irse (`cancelás`, `te das de baja`, `terminás`) contra §3.3.
 *    No conoce el verbo `exportar`: una oración que se va y se lleva los datos
 *    le pasa por al lado.
 *  - `datos-que-se-llevan.test.ts` → la **condición de plan** que SOBRA sobre el
 *    export («en cualquier plan pago»). Persigue una condición de más; acá falta
 *    una.
 *  - `salida-con-fecha.test.ts` → la **ventana del borrado**. Su disparador es
 *    `AFIRMA_NO_BORRADO`: pide una negación junto a `borrar|eliminar`. La frase
 *    de este defecto no niega ningún borrado — promete un derecho — así que no
 *    entra en su universo.
 *
 * Los tres preguntan qué se concede, a quién y hasta cuándo existen los DATOS.
 * Ninguno preguntaba hasta cuándo existe el **DERECHO A PEDIRLOS** una vez que
 * el cliente se fue. Es el mismo hueco que la casa ya pagó dos veces este mes:
 * la cura se escribe donde saltó el defecto y no viaja a sus gemelos.
 *
 * **El defecto que lo trajo, medido en producción el 2026-09-27.** `/empezar`
 * —la última pantalla antes del alta— se contradecía A SÍ MISMA, servida en la
 * misma visita (HTTP 200, texto visible, no el código):
 *
 * > hero: «Si al final no te sirve, no pagás nada — y tus datos los exportás
 * > **cuando quieras**.»
 * > más abajo: «…la cuenta queda en solo lectura: nada se borra de inmediato y
 * > tenés **30 días** para exportar tus datos.»
 *
 * y `content/legal/privacidad.md` §8 —la política que ese lead acepta al crear
 * la cuenta— le da la razón a la segunda: *«podés exportar tus datos […] dentro
 * de los 30 días posteriores a la terminación»*.
 *
 * La mitad correcta ya existía y estaba DERIVADA (`PRUEBA.copy` lee
 * `RETENCION.diasParaExportar`): el defecto no era ignorancia del plazo, era que
 * la frase del hero —la que se lee PRIMERO, y la que más gente lee— se escribió
 * suelta. Es la firma de siempre: la mitad sana esconde a la rota, y acá las dos
 * viajaban en la misma respuesta HTTP.
 *
 * ⚠️ **Por qué NO se prohíbe «cuando quieras» a secas, que sería más fácil.**
 * Mientras la cuenta está viva el export es de verdad *cuando quieras*: no lo
 * gatea ningún plan (`app/api/settings/export/route.ts` lo dice: «es un derecho
 * del titular, no una feature del plan»), y eso lo defiende
 * `datos-que-se-llevan.test.ts`. Prohibir el adverbio pondría a los dos gates a
 * pelear y obligaría a acotar una promesa VERDADERA — cambiar un copy honesto
 * por uno miedoso. Lo que caduca no es el derecho: es el derecho **después de
 * terminar**. Por eso el disparador exige las dos mitades en la MISMA oración,
 * que es la unidad que lee una persona.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
/** `src/` entero: el copy de venta vive en `app/`, `components/`, `lib/` y `content/`. */
const SRC = join(AQUI, "..");
const PRIVACIDAD = join(SRC, "content/legal/privacidad.md");

/**
 * Irse del servicio, dicho como le habla la venta al lead: casi nunca con el
 * verbo jurídico («terminar el contrato») y casi siempre con la condición («si
 * al final no te sirve»). Un gate que sólo conociera los verbos de
 * `salida-prometida.test.ts` no vería ni una de las tres frases vivas.
 */
const SE_VA =
  /\b(?:no te sirve|no les sirve|si al final|al terminar|termin[áa]s|cuando te vas|si te vas|te v[áa]s|dej[áa]s de (?:renovar|usarlo|usar)|no renov[áa]s|darte de baja|te d[áa]s de baja|cancel[áa]s)\b/i;

/**
 * Llevarse los datos. Mismo criterio que `datos-que-se-llevan.test.ts`: alcanza
 * con el verbo, así una redacción nueva entra sola.
 */
const SE_LOS_LLEVA =
  /\b(?:export[áa]s|exportarlos|exportar|export(?:ación|acion)|te los llev[áa]s|los llev[áa]s|llevártelos)\b/i;

/** Que hable de los datos DEL CLIENTE y no de exportar un reporte cualquiera. */
const SON_SUS_DATOS = /\b(?:datos|CSV|planilla|informaci[oó]n)\b/i;

/** Sin caducidad: lo que vuelve a la promesa más ancha que §8. */
const SIN_PLAZO =
  /\b(?:cuando quieras|cuando quieran|en cualquier momento|siempre que quieras|sin l[ií]mite de tiempo|para siempre)\b/i;

/**
 * Lo que la vuelve verdadera: que la oración diga su ventana. Se acepta
 * cualquier forma que nombre días —el número sale de `RETENCION`, así que el
 * día que el contrato cambie, cambia el copy y este gate sigue sirviendo.
 */
const CON_PLAZO = new RegExp(
  `(?:\\b${RETENCION.diasParaExportar}\\s*d[íi]as|\\bdiasParaExportar\\b|RETENCION\\.)`,
  "i",
);

/**
 * Menciones que NO le prometen el export al lead. Cada entrada se RE-MIDE: si
 * su fragmento dejó de estar donde dice, el gate se pone rojo. Una excusa que
 * sobra queda bendiciendo lo que ya no existe.
 */
const EXENTOS: ReadonlyArray<{ archivo: string; fragmento: string; motivo: string }> = [];

/** Quita comentarios respetando comillas, para que esta bitácora —que cita la
 *  frase vieja para explicar por qué se fue— no ponga en rojo a su propio gate. */
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
      // Espacios y no vacío: así un bloque largo no pega dos oraciones lejanas.
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
 * Parte en ORACIONES. El JSX mete saltos de línea y llaves en el medio de una
 * frase («no{" "}\n pagás nada»), así que antes de cortar se aplanan las
 * interpolaciones de espacio y los saltos: si no, el gate corta la oración por
 * la mitad y las dos mitades pasan limpias. Es el modo en que esta familia de
 * gates falla ABIERTO.
 */
function oraciones(texto: string): string[] {
  const plano = texto
    .replace(/\{"\s*"\}/g, " ")
    .replace(/\{"\s*—\s*"\}/g, " — ")
    .replace(/\s+/g, " ");
  return plano
    .split(/(?<=[.;:])\s+/)
    .map((o) => o.trim())
    .filter(Boolean);
}

type Promesa = { archivo: string; oracion: string };

/** Toda oración viva que ofrece el export COMO PARTE DE IRSE. */
function promesasAlIrse(): Promesa[] {
  const salida: Promesa[] = [];

  for (const ruta of FUENTES) {
    const limpio = sinComentarios(readFileSync(ruta, "utf8"));

    for (const oracion of oraciones(limpio)) {
      if (!SE_VA.test(oracion)) continue;
      if (!SE_LOS_LLEVA.test(oracion)) continue;
      if (!SON_SUS_DATOS.test(oracion)) continue;
      salida.push({ archivo: relative(SRC, ruta), oracion });
    }
  }

  return salida;
}

describe("el export que se promete al irse dice hasta cuándo vale", () => {
  /*
   * ANCLA 1 — contra el fallo ABIERTO. Si el recorrido del disco se rompe o el
   * aplanado de JSX deja de unir las frases partidas, no matchea nada y el gate
   * firma verde sobre un sitio sin vigilancia. Que exista al menos UNA promesa
   * de esta forma es lo que prueba que el instrumento está mirando.
   */
  it("el recorrido encuentra promesas de export al irse (si no, no está midiendo)", () => {
    const promesas = promesasAlIrse();
    expect(
      promesas.length,
      "cero oraciones: el recorrido o el aplanado de JSX se rompió, y el gate estaría firmando en verde",
    ).toBeGreaterThan(0);
  });

  /*
   * ANCLA 2 — la premisa del gate se re-mide contra el contrato. El día que §8
   * conceda otra ventana, este gate se pone rojo en vez de seguir exigiendo un
   * número que el contrato ya no da.
   */
  it("el contrato sigue acotando el export a los días que dice RETENCION", () => {
    const politica = readFileSync(PRIVACIDAD, "utf8").replace(/\s+/g, " ");
    const clausula = new RegExp(
      `exportar tus datos[^.]*?dentro de los \\*\\*${RETENCION.diasParaExportar} d[íi]as\\*\\*`,
      "i",
    );
    expect(
      clausula.test(politica),
      `privacidad.md §8 ya no concede ${RETENCION.diasParaExportar} días para exportar: RETENCION quedó vieja`,
    ).toBe(true);
  });

  it("ninguna oración ofrece el export al irse sin su ventana", () => {
    const culpables = promesasAlIrse().filter((p) => {
      if (!SIN_PLAZO.test(p.oracion)) return false;
      if (CON_PLAZO.test(p.oracion)) return false;
      return !EXENTOS.some((e) => e.archivo === p.archivo && p.oracion.includes(e.fragmento));
    });

    expect(
      culpables.map((c) => `${c.archivo} → ${c.oracion}`),
      `El contrato (privacidad.md §8) da ${RETENCION.diasParaExportar} días desde la terminación ` +
        `para pedir el export. Una oración que ofrece llevarse los datos AL IRSE y dice ` +
        `«cuando quieras» promete un derecho sin caducidad que el contrato caduca. ` +
        `Se arregla nombrando la ventana con RETENCION.diasParaExportar, nunca tipeando el número.`,
    ).toEqual([]);
  });
});
