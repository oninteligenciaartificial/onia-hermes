import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { PRUEBA, RETENCION } from "@/lib/pricing";

/**
 * Cuando la venta afirma que los datos NO se borran, lo dice con su ventana —
 * porque el contrato que ese mismo lead acepta le pone un reloj.
 *
 * 🔴 **Por qué ningún gate de esta casa podía ver esto.** La familia entera
 * juzga la venta sobre tres ejes, y ninguno es el TIEMPO:
 *
 *  - **qué se entrega** → `obra.test.ts`, `hueco-declarado.test.ts`,
 *    `promesa-humana.test.ts`, `factura-en-la-oferta.test.ts`;
 *  - **a quién le alcanza** → `capacidad-acotada.test.ts`,
 *    `capacidad-en-la-enumeracion.test.ts`, `eje-propio-con-alcance.test.ts`
 *    (rubro), `capacidad-vs-precio.test.ts` (plan);
 *  - **cuánto cuesta** → `precios.test.ts`, `precios-addons.test.ts`,
 *    `scripts/precios-fuente.mjs`.
 *
 * Y los dos que SÍ leen el contrato como fuente preguntan otra cosa:
 * `salida-prometida.test.ts` mide el **alcance** de la salida («cancelás cuando
 * quieras» contra §3.3, que sólo concede *no renovar*) y
 * `datos-que-se-llevan.test.ts` mide la **condición de plan** que sobra sobre la
 * exportación. Nadie preguntaba **hasta cuándo** vale un derecho que la venta
 * promete sin caducidad.
 *
 * **El defecto que lo trajo, medido en producción el 2026-09-11.** Las tres
 * páginas de venta —portada, `/precios` y `/empezar`, todas HTTP 200— servían
 * la misma afirmación absoluta, sin un solo plazo en ninguna de las tres
 * (`grep -c '90 días|30 días'` sobre el HTML servido → **0**):
 *
 * > «Al terminar, la cuenta queda en solo lectura: **no se borra nada** y podés
 * > exportar tus datos.»
 *
 * y `onia.com.bo/privacidad` §8 —status **vigente**, servida en la misma
 * visita— dice lo contrario en dos renglones:
 *
 * > «podés exportar tus datos […] dentro de los **30 días** posteriores a la
 * > terminación. Transcurridos **90 días** desde la terminación, Onia **elimina
 * > tus datos** de sus sistemas activos.»
 *
 * «Nada se borra» es cierto el día 1 y falso el día 91: no hay lectura en la que
 * las dos convivan. Y el que la lee no es un curioso — es alguien decidiendo si
 * confía su historia clínica, su inventario o su cartera de clientes a un
 * proveedor nuevo, que es exactamente el miedo que esa frase viene a calmar.
 *
 * **Lo que lo mantuvo vivo** es la misma firma de siempre: la mitad sana
 * esconde a la rota. `components/landing-v1/faq.tsx` ya decía «tus datos no se
 * borran **de entrada**» y `app/(sitio)/faq-datos.ts` «**la suspensión** nunca
 * implica borrarlos» — las dos acotadas y **ciertas** (§8: la suspensión por
 * falta de pago bloquea el acceso pero no borra nada). Leer cualquiera de esas
 * dos confirma en falso que el tema está cubierto.
 *
 * ⚠️ **Por qué el copy dice 30 y no 90.** El plazo que le impone una ACCIÓN al
 * cliente es el de la exportación; los 90 son cuándo desaparecen. Prometer «90
 * días para llevártelos» sería volver a caer en el mismo defecto con número: a
 * los 31 los datos todavía existen, pero el derecho a pedirlos ya venció.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const SRC = join(AQUI, "..");
const PRIVACIDAD = join(SRC, "content/legal/privacidad.md");

/**
 * Una afirmación de NO-ELIMINACIÓN. No pide la palabra «datos» en la misma
 * oración a propósito: el corte por punto deja sola a «Nada se borra.», que es
 * justo la forma más desnuda del defecto — exigirle un sujeto la sacaría del
 * universo y el gate quedaría ciego al caso que más importa.
 */
const AFIRMA_NO_BORRADO =
  /\b(?:no|nada|nunca|jam[áa]s|ni)\b[^.;:!?]{0,70}\b(?:borra|borran|borrar|borrarlos|borrado|elimina|eliminan|eliminar|eliminarlos)\b/i;

/**
 * Lo que vuelve VERDADERA a la afirmación. Tres formas, porque una redacción
 * nueva no tiene por qué copiar la de hoy:
 *
 *  1. **inmediatez** — «de inmediato», «de entrada»: no niega el borrado, niega
 *     que sea instantáneo, que es exactamente lo que dice §8;
 *  2. **sujeto acotado** — «la suspensión nunca implica borrarlos»: habla de la
 *     mora, no de la terminación, y ahí nada se borra de verdad;
 *  3. **el plazo dicho** — los días en la misma oración, sea el número escrito
 *     o la constante `RETENCION` interpolada. Las dos formas, porque el copy de
 *     la casa NO tipea el número: lo lee. Con sólo `\d+` el gate daría rojo
 *     sobre una frase que nombra el plazo correctamente, que es la dirección
 *     cara — lo detecté mutando, no leyendo.
 */
const ACOTADA = [
  /\b(?:de inmediato|inmediatamente|de entrada|al instante|en el acto|de golpe|de un d[íi]a para el otro|autom[áa]ticamente|enseguida|ni bien|por ahora)\b/i,
  /\b(?:suspensi[óo]n|suspende|suspendida|suspender|se pausa|pausa|pausada|mora|gracia|impago)\b/i,
  /\b\d+\s*d[íi]as?\b/i,
  /\bRETENCION\.dias(?:ParaExportar|HastaEliminar)\b/,
];

/**
 * Exenciones. Van por LITERAL y se re-miden en cada corrida (el caso «ninguna
 * exención sobra»): una entrada que ya no corresponde a nada se pudre en
 * silencio y pasa a ser la coartada del defecto siguiente.
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
      // Espacios, no vacío: así un bloque largo no pega dos oraciones lejanas.
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

/** El sujeto sale del DISCO: una página nueva nace cubierta. */
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
 * Parte en ORACIONES, no en líneas.
 *
 * ⚠️ El `\n` NO puede cortar solo, y esto lo cazó el gate acusándose a sí
 * mismo: Prettier envuelve el copy largo por ancho de renglón, así que
 * «…Nada se borra de ⏎ inmediato.» llegaba partido y la mitad de arriba —sin su
 * salvedad— se leía idéntica al defecto. Antes de cortar se reúnen los
 * renglones ENVUELTOS: línea que termina en letra y sigue en minúscula es una
 * frase que siguió, no una frase nueva. El corte por `\n` se conserva para todo
 * lo demás, o dos literales vecinos de un array se pegan y el acotador de uno
 * absuelve al otro.
 */
function oraciones(texto: string): string[] {
  const reunido = texto.replace(/([^\s.;:,{}()[\]`"'>])\n\s+(?=[a-záéíóúñ¿¡])/gi, "$1 ");
  return reunido
    .split(/(?<=[.;:])\s+|\n/)
    .map((o) => o.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

type Afirmacion = { archivo: string; oracion: string };

function afirmacionesDeNoBorrado(): Afirmacion[] {
  const salida: Afirmacion[] = [];

  for (const ruta of FUENTES) {
    const limpio = sinComentarios(readFileSync(ruta, "utf8"));
    for (const oracion of oraciones(limpio)) {
      if (!AFIRMA_NO_BORRADO.test(oracion)) continue;
      salida.push({ archivo: relative(SRC, ruta), oracion });
    }
  }

  return salida;
}

const exenta = (a: Afirmacion) =>
  EXENTOS.some((e) => a.archivo.endsWith(e.archivo) && a.oracion.includes(e.fragmento));

/** El número que el contrato publicado fija, leído del .md (`**30 días**`). */
function plazoDelContrato(patron: RegExp): number | null {
  const md = readFileSync(PRIVACIDAD, "utf8");
  const m = md.match(patron);
  return m ? Number(m[1]) : null;
}

describe("lo que la venta dice sobre irse lleva la fecha que el contrato le pone", () => {
  it("ninguna afirmación de «no se borra» queda sin acotar", () => {
    const sinVentana = afirmacionesDeNoBorrado()
      .filter((a) => !exenta(a))
      .filter((a) => !ACOTADA.some((r) => r.test(a.oracion)));

    expect(
      sinVentana.map((a) => `${a.archivo} → «${a.oracion}»`),
      "El contrato (content/legal/privacidad.md §8, vigente) elimina los datos a " +
        `los ${RETENCION.diasHastaEliminar} días de la terminación y da ` +
        `${RETENCION.diasParaExportar} para pedir la exportación. Una afirmación ` +
        "de no-borrado sin acotar es cierta el día 1 y falsa después: acotala " +
        "(«de inmediato», «la suspensión…») o nombrá el plazo.",
    ).toEqual([]);
  });

  /**
   * ANCLA DE UNIVERSO. Sin esto, el día que alguien reescriba el copy con un
   * verbo que el patrón no conoce el barrido devuelve [] y el caso de arriba
   * pasa en verde sin haber mirado una sola oración — que es como esta familia
   * de gates falla abierto.
   */
  it("el barrido sigue VIENDO las afirmaciones que ya cumplen", () => {
    const vistas = afirmacionesDeNoBorrado();
    expect(vistas.length, "el patrón dejó de matchear: el gate quedó ciego").toBeGreaterThan(0);
    expect(
      vistas.some((a) => /de entrada|suspensi[óo]n/i.test(a.oracion)),
      "las dos copias acotadas y ciertas (landing-v1/faq.tsx, (sitio)/faq-datos.ts) " +
        "dejaron de entrar al universo: el barrido ya no mide lo que dice medir",
    ).toBe(true);
  });

  it("la ventana que publica el copy es la que fija el contrato", () => {
    expect(
      plazoDelContrato(/dentro de los \*\*(\d+) d[íi]as\*\* posteriores a la terminaci[óo]n/i),
      "privacidad.md §8 cambió el plazo de exportación y pricing.ts sigue con el viejo",
    ).toBe(RETENCION.diasParaExportar);

    expect(
      plazoDelContrato(/Transcurridos \*\*(\d+)\s*d[íi]as\*\* desde la terminaci[óo]n/i),
      "privacidad.md §8 cambió el plazo de eliminación y pricing.ts sigue con el viejo",
    ).toBe(RETENCION.diasHastaEliminar);
  });

  /**
   * El copy de la prueba se renderiza en TRES superficies vivas —portada
   * (`(sitio)/page.tsx`, en el hero), `/precios` y `/empezar`—, así que es la
   * copia más cara de la clase y se ancla aparte.
   */
  it("el copy de la prueba nombra el plazo para llevarse los datos", () => {
    expect(PRUEBA.copy).toMatch(new RegExp(`${RETENCION.diasParaExportar}\\s*d[íi]as`));
  });

  it("ninguna exención declarada sobra", () => {
    const vivas = afirmacionesDeNoBorrado();
    const muertas = EXENTOS.filter(
      (e) => !vivas.some((a) => a.archivo.endsWith(e.archivo) && a.oracion.includes(e.fragmento)),
    );
    expect(muertas.map((e) => `${e.archivo} → «${e.fragmento}» (${e.motivo})`)).toEqual([]);
  });
});
