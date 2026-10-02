import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { META_NOTA, META_VENTANA_24H } from "@/content/chatbot-precios";
import { REQUISITOS_CHATBOT } from "@/content/requisitos";
import { NO_INCLUYE } from "@/lib/pricing";

/**
 * Una condición de un TERCERO que el sitio le cotiza al lead no se afirma sin
 * su fecha de vencimiento.
 *
 * **La clase, y por qué ningún gate de este proyecto podía verla.** Toda la
 * familia de gates de la superficie de venta juzga lo que el sitio dice contra
 * algo que nosotros controlamos: el producto (obra, capacidad inexistente,
 * rubro que falta, límite que se calla), la fuente de precios, el contrato, el
 * rol. Esta afirmación no es nuestra: es una condición comercial de Meta que
 * **le cuesta plata al cliente** y que Meta cambia por su cuenta en una fecha
 * ya anunciada. Y —lo que la vuelve invisible— **hoy es verdad**. No sobra
 * ninguna palabra prohibida, no hay cifra fuera de fuente, no promete trabajo
 * humano, no es rubro ni plan ni rol, el enlace responde: los 863 casos que
 * había pasaban en verde, con razón. El defecto **nace el 1 de octubre**.
 *
 * Tampoco la alcanza `plazo-que-vence.test.ts`, que es lo que más se le
 * parece: aquel persigue el copy escrito **en futuro** sobre el plazo del SIN
 * (`@/lib/siat`). Éste está en **presente** y habla de otro tercero.
 *
 * **Lo medido el 2026-09-11**, a 20 días del cambio, sobre el árbol y contra
 * producción — las dos copias vivas, las dos en páginas que devuelven 200:
 *
 *   · `META_NOTA` — «Responder dentro de las 24 horas desde que el cliente
 *     escribe **no lo cobra Meta**.» En `/chatbot` y `/v1/chatbot`.
 *   · `REQUISITOS_CHATBOT` — «responder **es gratis** durante las 24 horas
 *     siguientes (es regla de Meta). **Toda la atención del bot entra ahí: no
 *     te cuesta.**» En `/v1/chatbot`, y no es copy suelto: va dentro del
 *     `RequisitosGate`, la lista que el lead **declara haber leído y
 *     entendido** antes de pedir el add-on. Prometerle ahí que atender no le
 *     cuesta es la forma más cara de decirlo.
 *
 * Arreglar sólo la primera habría dejado viva la segunda: el barrido a medias,
 * otra vez, en el hermano que nadie estaba tocando.
 *
 * **Por qué nadie lo levantó.** El aviso estaba escrito en dos lugares y en
 * ninguno podía ejecutarse solo: `onia-platform/lib/pricing.ts` («⚠️ REVISAR
 * ANTES DEL 1-OCT-2026 … hay que avisárselo antes de que le llegue») y la fila
 * de `ONIA_FECHAS_CRITICAS_PLAN.md`, que **nombra este archivo y a quien lo
 * edite** y cotiza el arreglo en 10 minutos. Un comentario que declara una
 * acción pendiente desactiva la auditoría: el que lo lee da el tema por
 * atendido. Una acción con fecha que vive en un comentario no es un gate.
 *
 * **El arreglo NO es sacar la frase** —el doc lo proponía así, y eso le quita
 * al lead un dato de SU plata— **ni atarla al reloj**: el sitio se sirve
 * estático, el HTML se hornea en el build y el swap es manual, así que un copy
 * que depende de `now` se congela y aparenta cubrir sin cubrir. Va la
 * redacción que **no caduca**: la condición con su fecha, verdadera antes y
 * después del 1-oct. Mismo criterio con el que se resolvió el plazo del SIN.
 *
 * **Cómo se generaliza.** El sujeto no es una lista de frases: es el árbol
 * entero, cortado en oraciones, y la firma es *«la ventana + una negación de
 * cargo»*. Medido antes de escribir el patrón, de las 14 menciones de «24
 * horas / 24-7» del sitio sólo esas dos niegan un cargo — las otras («contesta
 * 24/7», «atiende las 24 horas», «corre cada 24 horas», «Meta se toma hasta 24
 * horas para aprobar») son copy sano y el patrón las deja pasar. Un patrón más
 * ancho habría mandado a romperlas, que es la dirección cara.
 */

/** `src/`, desde `src/app/(sitio)/`. */
const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/**
 * Las condiciones AJENAS que el sitio afirma y que vencen en una fecha
 * conocida.
 *
 * Se declaran acá —y no se deducen— porque lo que las distingue de cualquier
 * otra frase es un hecho del mundo: que un tercero anunció que las cambia. La
 * lista no puede sobrar (el caso «alguien la afirma» la re-mide en cada
 * corrida): una entrada que ningún sujeto usa quedaría PRE-APROBADA, que es
 * como esta clase de lista blanca falla.
 */
const CONDICIONES = [
  {
    clave: "meta-ventana-24h",
    quien: "Meta",
    /** La condición: la ventana de servicio de 24 h. */
    dice: /\b24 ?h(oras?)?\b/i,
    /** …y que NO tiene cargo. Sin esto, «contesta 24/7» sería un falso positivo. */
    niegaElCargo:
      /\bno (te |le |lo |nos )?(cuesta|cuestan|cobra|cobran|pag[áa]s)\b|\bes gratis\b|\bsin (cargo|costo)\b|\bgratis\b/i,
    /** La fecha que vuelve VERDADERA la frase también después del cambio. */
    hasta: META_VENTANA_24H.hasta,
    /** El aviso del cambio: lo que el cliente tiene que saber ANTES. */
    desde: META_VENTANA_24H.desde,
  },
] as const;

/** Quita comentarios respetando comillas: `https://` no es un comentario. */
function sinComentarios(fuente: string): string {
  let salida = "";
  let i = 0;
  let comilla: string | null = null;
  let bloque = false;
  let linea = false;

  while (i < fuente.length) {
    const c = fuente[i];
    const par = fuente.slice(i, i + 2);

    if (bloque) {
      if (par === "*/") {
        bloque = false;
        i += 2;
        continue;
      }
      // Conservar los saltos: si no, el archivo:línea que se reporta queda corrido.
      salida += c === "\n" ? "\n" : " ";
      i += 1;
      continue;
    }
    if (linea) {
      if (c === "\n") {
        linea = false;
        salida += c;
      }
      i += 1;
      continue;
    }
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
    if (par === "/*") {
      bloque = true;
      i += 2;
      continue;
    }
    if (par === "//") {
      linea = true;
      i += 2;
      continue;
    }
    salida += c;
    i += 1;
  }
  return salida;
}

/**
 * El texto como lo va a LEER una persona, no como lo guarda Prettier.
 *
 * Tres cosas rompen el barrido si no se normalizan, y las tres ya mordieron a
 * este proyecto: Prettier parte un literal largo en varios renglones unidos
 * con `+` (la mitad de abajo llega sin contexto y se reporta huérfana), las
 * interpolaciones esconden el valor derivado (`${META_VENTANA_24H.hasta}` no
 * se parece a una fecha), y los saltos de línea parten oraciones al medio.
 */
function comoSeLee(texto: string): string {
  return texto
    .replace(/"\s*\+\s*"/g, "")
    .replace(/`\s*\+\s*`/g, "")
    .replace(/'\s*\+\s*'/g, "")
    .replace(/\$\{[^}]*\.hasta\}/g, META_VENTANA_24H.hasta)
    .replace(/\$\{[^}]*\.desde\}/g, META_VENTANA_24H.desde)
    .replace(/\s+/g, " ");
}

/** Oraciones. Corta en `. ` y no en `3.900`. */
function oraciones(texto: string): string[] {
  return texto.split(/(?<=[.;!?])\s+/).filter((o) => o.trim().length > 0);
}

/** Todo `.ts`/`.tsx` del sitio que no sea un test. */
function fuentesDelDisco(dir: string = SRC): string[] {
  return readdirSync(dir).flatMap((nombre) => {
    const camino = join(dir, nombre);
    if (statSync(camino).isDirectory()) {
      return nombre === "node_modules" ? [] : fuentesDelDisco(camino);
    }
    if (!/\.tsx?$/.test(nombre) || /\.test\.tsx?$/.test(nombre)) return [];
    return [camino];
  });
}

/** Aplana cualquier estructura de contenido a los textos que se renderizan. */
function textos(valor: unknown): string[] {
  if (typeof valor === "string") return [valor];
  if (Array.isArray(valor)) return valor.flatMap(textos);
  if (valor && typeof valor === "object") {
    return Object.values(valor as Record<string, unknown>).flatMap(textos);
  }
  return [];
}

/** Las oraciones del árbol que AFIRMAN una condición ajena. */
function afirmacionesEnElDisco(cond: (typeof CONDICIONES)[number]) {
  return fuentesDelDisco().flatMap((archivo) => {
    const limpio = comoSeLee(sinComentarios(readFileSync(archivo, "utf8")));
    return oraciones(limpio)
      .filter((o) => cond.dice.test(o) && cond.niegaElCargo.test(o))
      .map((frase) => ({ archivo: relative(SRC, archivo), frase, texto: limpio }));
  });
}

// La otra cara del mismo cambio de Meta: `/precios` («No incluye») decía que Meta
// cobra «cada mensaje que TU negocio le manda primero». No niega un cargo, así que
// el barrido de abajo no la veía, y desde el 1-oct es falsa: Meta cobra también
// las respuestas. Corregido el 2026-09-28 (condición 8 de la 1.0).
describe("lo que no incluye el precio no achica lo que cobra Meta", () => {
  it("dice que Meta cobra también las respuestas, con la fecha de la fuente", () => {
    const meta = NO_INCLUYE.find((x) => /whatsapp/i.test(x.que));
    expect(meta, "falta la fila de Meta en «No incluye»").toBeDefined();
    expect(meta!.detalle).not.toMatch(/manda primero/i);
    expect(meta!.detalle).toMatch(/tambi[eé]n las respuestas/i);
    expect(meta!.detalle).toContain(META_VENTANA_24H.desde);
  });
});

/**
 * ⚠️ **2026-10-01: la condición VENCIÓ.** Hasta el 30-sep la redacción que no
 * caducaba era «no te cuesta hasta el 30 de septiembre de 2026». Desde hoy esa
 * frase le habla al lead de una gratuidad que ya no existe: es una fecha vencida
 * en la superficie de venta. La regla pasa a ser la inversa: ninguna superficie
 * niega el cargo de la ventana de 24 h ni nombra la fecha vencida, y lo que se
 * renderiza dice que Meta cobra también las respuestas.
 */
describe("una condición de un tercero que venció no se sigue afirmando", () => {
  for (const cond of CONDICIONES) {
    describe(cond.clave, () => {
      it("el dato está declarado con sus dos fechas y su fuente", () => {
        expect(META_VENTANA_24H.fuente.length).toBeGreaterThan(10);
        expect(META_VENTANA_24H.hasta).not.toBe(META_VENTANA_24H.desde);
      });

      it(`ninguna frase dice que ${"Meta"} no cobra la ventana de 24 h`, () => {
        const ofensores = afirmacionesEnElDisco(cond);
        expect(
          ofensores.map((a) => `${a.archivo}: ${a.frase}`),
          `Desde el ${cond.desde} ${cond.quien} cobra también las respuestas: ` +
            `prometer que no cuestan es mentirle al lead sobre su plata.`,
        ).toEqual([]);
      });

      it("nadie interpola la fecha que ya venció", () => {
        // `lib/siat.ts` nombra el 30-sep como HISTORIA del SIN (otro tercero,
        // en pasado): eso no es esta condición. Lo que se persigue es que la
        // fecha de Meta vuelva a la venta desde su constante.
        const conFecha = fuentesDelDisco().filter((archivo) =>
          /META_VENTANA_24H\.hasta/.test(sinComentarios(readFileSync(archivo, "utf8"))),
        );
        expect(conFecha.map((a) => relative(SRC, a))).toEqual([]);
      });

      it("lo que se renderiza dice que Meta cobra también las respuestas", () => {
        const renderizado = [META_NOTA, ...textos(REQUISITOS_CHATBOT)];
        for (const texto of renderizado) {
          expect(cond.dice.test(texto) && cond.niegaElCargo.test(texto), texto).toBe(false);
          expect(texto).not.toContain(cond.hasta);
        }
        expect(META_NOTA).toMatch(/tambi[eé]n las respuestas/i);
        expect(textos(REQUISITOS_CHATBOT).join(" ")).toMatch(/tambi[eé]n las (respuestas|cobra)/i);
      });
    });
  }
});
