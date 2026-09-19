import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Un rubro del conmutador no puede prometer un ARTEFACTO CON SALDO que el
 * producto no modela.
 *
 * POR QUE EXISTE, con lo que se midio el 2026-09-19 contra `origin/master` de
 * onia-platform (ref fetcheada, no de disco). La portada, `/rubros` y el panel
 * compartido le prometian a un centro de estetica «cada paquete con las
 * sesiones ya hechas y las que faltan», y el panel lo DIBUJABA con un contador
 * de puntos (`3 de 6`, `5 de 6`). El producto no tiene ese modelo:
 *
 *   · `prisma/schema.prisma` no declara paquete, bono ni saldo de sesiones —
 *     `PatientTreatment` es un tratamiento con `status`, sin total contratado.
 *   · `esteticagest-clinical` es un ESPEJO del pack dental (`mirrorPack`) y su
 *     nav es `navClinicaDe(...)`, que solo renombra dos entradas:
 *     `/patients` -> «Clientas» y `/treatments` -> «Tratamientos».
 *   · `lib/onboarding/vocabulario.ts` le dice a ese track `servicios:
 *     "tratamientos"`. El sistema no le pone la palabra «sesiones» delante.
 *   · lo unico que el repo llama «bono» es el de antiguedad de la planilla.
 *
 * Lo que el producto SI entrega para ese rubro —y por eso la cura no borra la
 * promesa, la cambia por la verdadera— es la clienta que dejo el tratamiento a
 * medias y no volvio: el Recall corre ahi (`guardaClientesEnPatients` +
 * `tieneAgenda`) y dispara por `recallAfterDays`, o sea por TIEMPO SIN VOLVER,
 * nunca por saldo de un paquete.
 *
 * POR QUE NINGUN GATE LO VEIA. No mueve una cifra (los cruces de precio miran
 * montos), no tipea un nombre de plan junto a una capacidad, y no es un
 * cuantificador universal. Y lo sostenia una CITA CIRCULAR: el comentario de la
 * home se respalda en `rubros/page.tsx`, y `rubros/page.tsx` se respalda en si
 * mismo — el sitio comparandose consigo mismo. El panel hermano de al lado
 * (servicios: IVA e IT del mes) tiene el comentario bien hecho, citando
 * `lib/onia-core/modules/accounting-logic.ts`: se midio contra el PRODUCTO.
 *
 * QUE PROHIBE. La FORMA, no el texto viejo: un sustantivo de agrupacion con
 * saldo junto a la unidad que se consume. Prohibir la frase de 2026-09-19 se
 * apagaria sola el dia que alguien la reescriba con otras palabras.
 *
 * CUANDO SE BORRA ESTE ARCHIVO. El dia que el producto modele el saldo (un
 * campo de sesiones contratadas/consumidas en el schema, o una pantalla de
 * paquetes en el pack de estetica). Ahi la promesa pasa a ser cierta y el gate
 * sobra: se borra, no se afloja.
 */

const SITIO = join(process.cwd(), "src/app/(sitio)");
const leer = (rel: string) => readFileSync(join(SITIO, rel), "utf8");

/** Comentarios en blanco: acusan y absuelven, y aca no son superficie de cliente. */
function sinComentarios(fuente: string): string {
  return fuente
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/\/\/[^\n]*/g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, (m) => m.replace(/[^\n]/g, " "));
}

/**
 * El universo son los rubros del conmutador, DERIVADOS del disco: una lista
 * escrita aca al lado se queda corta el dia que entra el sexto rubro y el gate
 * firma verde sobre el unico sujeto que no mira.
 */
function rubrosDelConmutador(): string[] {
  const fuente = leer("switcher.tsx");
  const bloque = fuente.slice(fuente.indexOf("const RUBROS"));
  return [...bloque.matchAll(/id:\s*"([a-z]+)"/g)].map((m) => m[1]);
}

/**
 * Las superficies donde vive la promesa de un rubro. Se enumeran los ARCHIVOS y
 * se busca en todos: acotar por rubro cortando el texto haria que un sujeto
 * nuevo en un archivo ya mirado naciera invisible.
 */
const SUPERFICIES = ["switcher.tsx", "rubros/page.tsx", "ui.tsx", "page.tsx"] as const;

/**
 * Un artefacto con saldo: algo que se compra entero y se consume de a poco. La
 * unidad («sesion», «clase», «visita») sola NO alcanza —«la sesion de hoy» es
 * legitimo—: lo que promete un saldo que el producto no lleva es el sustantivo
 * de agrupacion.
 */
const AGRUPACION_CON_SALDO = /\b(paquete|paquetes|bono|bonos|abono de|pack de)\b/i;

/** El saldo dicho sin nombrar el envase: «las que faltan», «3 de 6 sesiones». */
const SALDO_EXPLICITO =
  /(sesiones|clases|visitas)\s+(ya\s+)?(hechas|usadas|consumidas)|las\s+que\s+(faltan|quedan)|\d+\s+de\s+\d+\s+(sesiones|clases|visitas)/i;

describe("una promesa de rubro no afirma un artefacto con saldo", () => {
  it("el universo sale del conmutador y trae los cinco rubros vivos", () => {
    const rubros = rubrosDelConmutador();
    // Caso ancla: si el lector se rompe, el gate se queda sin sujetos y firma
    // verde. Estos cinco son los que el alta ofrece hoy (RUBROS_ACTIVOS).
    expect(rubros).toEqual(
      expect.arrayContaining(["dental", "comercio", "importadora", "estetica", "servicios"]),
    );
  });

  it.each(SUPERFICIES)("%s no promete un paquete ni un bono", (archivo) => {
    const visible = sinComentarios(leer(archivo));
    const culpables = visible
      .split("\n")
      .map((linea, i) => ({ linea: linea.trim(), n: i + 1 }))
      .filter(({ linea }) => AGRUPACION_CON_SALDO.test(linea));

    expect(
      culpables,
      `El producto no modela paquetes ni bonos de sesiones (medido contra origin/master ` +
        `de onia-platform el 2026-09-19: ni el schema, ni el pack de estetica, ni el ` +
        `vocabulario). Nombralo por lo que el sistema SI entrega. Culpables: ` +
        culpables.map((c) => `${archivo}:${c.n} «${c.linea}»`).join(" · "),
    ).toEqual([]);
  });

  it.each(SUPERFICIES)("%s no lleva la cuenta de lo que falta", (archivo) => {
    const visible = sinComentarios(leer(archivo));
    const culpables = visible
      .split("\n")
      .map((linea, i) => ({ linea: linea.trim(), n: i + 1 }))
      .filter(({ linea }) => SALDO_EXPLICITO.test(linea));

    expect(
      culpables,
      `El producto no guarda cuantas sesiones se hicieron ni cuantas faltan: ` +
        `PatientTreatment tiene estado, no saldo. Culpables: ` +
        culpables.map((c) => `${archivo}:${c.n} «${c.linea}»`).join(" · "),
    ).toEqual([]);
  });

  it("el panel compartido no dibuja un contador de entregas", () => {
    // La mitad que no es texto: el defecto tambien se DIBUJA. Un componente que
    // recibe «hechas» y «total» promete un saldo aunque no escriba la palabra.
    const visible = sinComentarios(leer("ui.tsx"));
    expect(
      /hechas\s*[,:}]|total:\s*number/.test(visible),
      "ui.tsx dibuja un contador «hechas de total». Es la misma promesa que el texto, " +
        "en pixeles: el producto no lleva ese saldo.",
    ).toBe(false);
  });
});
