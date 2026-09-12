import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  MEDIO_DE_PAGO,
  QR_PARA_PAGARLE_A_ONIA,
  medioDePagoOnia,
} from "@/content/medio-de-pago";

/**
 * El sitio no promete un medio de pago que producción no tiene encendido.
 *
 * EL DEFECTO QUE LO MOTIVA, medido el 2026-09-11 en producción: `/empezar`,
 * `/v1/prueba-gratis` (las dos con 200) y la FAQ de la portada le decían al lead
 * «pagás por QR», y `docker exec onia-platform env | grep -c '^BCP_QR_'` da **0**
 * — no existe ningún QR. Dos clics después, `app.onia.com.bo/checkout` sirve la
 * rama honesta («te pasamos los datos de pago»). La web y el producto se
 * contradecían y la que miente llega PRIMERO.
 *
 * POR QUÉ NINGUNO DE LOS GATES HERMANOS PODÍA VERLO. No sobra ninguna palabra
 * prohibida (`obra.test.ts`, `hueco-declarado.test.ts`), no falta ningún rubro
 * (`rubros-vivos.mjs`), el monto sale de la fuente única (`precios.test.ts`), no
 * promete trabajo humano (`promesa-humana.test.ts`), no exige de más
 * (`datos-que-se-llevan.test.ts`) y el enlace responde 200 (`enlaces.test.ts`).
 * Lo que estaba mal es el par **(lo que la venta promete, la capacidad que
 * producción tiene encendida)** — el mismo eje que ya mordió con `SEARXNG_URL`.
 *
 * LA TRAMPA AL MEDIRLO, y por eso el sujeto no puede ser «la palabra QR»: el
 * sitio tiene 14 menciones de QR y **10 son legítimas** — el negocio cobrándole
 * a SUS clientes (la caja, el cobrador, el cierre del día por método de pago).
 * Un patrón que sólo busque «QR» manda a romper copy sano, que es la dirección
 * cara del falso positivo.
 *
 * CÓMO SE SEPARAN SIN ENUMERAR FORMAS. No es una lista de inclusión de frases:
 * es la dicotomía completa del dominio — **quién recibe el dinero**. En este
 * copy, siempre en segunda persona, eso está en el verbo: `pagás` es el lead
 * pagándonos a nosotros, `cobrás` es el lead cobrándole a los suyos. No hay una
 * tercera dirección.
 *
 * Y CÓMO NO FALLA ABIERTO, que es como muere esta familia de gates: una mención
 * de QR **sin ninguno de los dos verbos** no se ignora en silencio. Tiene que
 * estar DECLARADA abajo con su motivo, y la declaración se RE-MIDE contra el
 * disco en cada corrida: si sobra una entrada, el gate cae en rojo y la nombra.
 * Así una mención nueva nace cubierta y hay que excusarla a mano, a la vista.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const SRC = join(AQUI, "..");

/** Todo el TSX/TS de `src/`, menos los propios gates. */
function fuentesDelDisco(dir: string = SRC): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const ruta = join(dir, e.name);
    if (e.isDirectory()) {
      return e.name === "__tests__" || e.name === "node_modules"
        ? []
        : fuentesDelDisco(ruta);
    }
    if (!/\.tsx?$/.test(e.name)) return [];
    if (/\.test\.tsx?$/.test(e.name)) return [];
    return [relative(SRC, ruta)];
  });
}

/**
 * Los comentarios se blanquean CONSERVANDO los saltos de línea: si se borran,
 * el gate reporta `archivo:línea` corrido y manda a mirar el renglón
 * equivocado. Y sin blanquearlos, la bitácora que explica este mismo defecto
 * —que cita «pagás por QR» para narrarlo— pondría el gate en rojo y obligaría
 * a borrar el registro de lo que pasó.
 */
function sinComentarios(fuente: string): string {
  return fuente
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/\/\/[^\n]*/g, (m) => " ".repeat(m.length));
}

/** El lead nos paga a NOSOTROS. Verbo conjugado, no el sustantivo «pago»:
 *  «método de pago — efectivo, QR, tarjeta» es la caja del negocio. */
const NOS_PAGA = /\bpag(ás|as|ar|arás|o por qr|ás por qr)\b|\bpago por qr\b/i;

/** El lead le cobra a SUS clientes: su caja, su cobrador, su cierre de día. */
const EL_COBRA = /\bcobr(ás|as|o|ado|ar|amos|a)\b|\bte paso el\b|\bmétodo de pago\b/i;

/**
 * Menciones de QR que no dicen quién paga a quién. Cada una con el motivo por
 * el que NO es una promesa de cómo se le paga a Onia. La clave es el literal
 * exacto, así que una mención nueva no queda absuelta por parecerse a otra.
 */
const SIN_DIRECCION_DECLARADAS: { literal: string; porque: string }[] = [
  {
    literal: "QR Simple",
    porque: "Chip de la demo de patrones: nombra un módulo, no un medio de pago.",
  },
  {
    literal: "Ventas y cobro QR",
    porque: "Ítem del módulo de caja: es lo que el negocio le cobra a su cliente.",
  },
  {
    literal: '{ metodo: "QR", w: "62%" }',
    porque:
      "Fila del panel de cierre de caja del negocio (ui.tsx): dato de SU día, no nuestro cobro.",
  },
  {
    literal: "QR bancario",
    porque:
      "/nosotros lo lista como capacidad contable boliviana que el sistema maneja para el negocio.",
  },
  {
    literal: "WhatsApp Business · Cobros con QR",
    porque:
      "Fila de sellos del hero (hero v4): enumera lo que el sistema le RESUELVE al negocio — él cobra con QR a SUS clientes. No es un camino para pagarle a Onia.",
  },
];

/**
 * La FUENTE no es una superficie: es el único archivo del sitio donde el texto
 * «pagás por QR» puede existir, porque es la rama que se enciende el día que el
 * banco entregue credenciales. No queda sin vigilar — la custodian los tres
 * casos de abajo («las dos ramas vivas», «sigue al flag», «no se borró la
 * promesa»), que es una vigilancia más fuerte que este barrido de literales.
 */
const FUENTE = "content/medio-de-pago.ts";

interface Mencion {
  archivo: string;
  linea: number;
  texto: string;
}

/**
 * Cada mención de QR de `src/`, sin comentarios y **con su vecindad**.
 *
 * La vecindad no es adorno: Prettier parte un literal largo en dos renglones, y
 * leyendo línea por línea el mensaje del cobrador del negocio llega como
 * `QR?»` — sin nadie que diga quién le paga a quién, así que no se puede
 * clasificar y el gate se vuelve ruido. Se clasifica sobre la ventana (±1
 * línea, la oración entera) y se REPORTA la línea del QR, que es donde hay que
 * mirar.
 */
function mencionesDeQr(): Mencion[] {
  const out: Mencion[] = [];
  for (const archivo of fuentesDelDisco()) {
    if (archivo.split(/[\\/]/).join("/") === FUENTE) continue;
    const lineas = sinComentarios(readFileSync(join(SRC, archivo), "utf8")).split("\n");
    lineas.forEach((linea, i) => {
      if (!/\bQR\b/.test(linea)) return;
      const texto = lineas.slice(Math.max(0, i - 1), i + 2).join(" ");
      out.push({ archivo, linea: i + 1, texto });
    });
  }
  return out;
}

const MENCIONES = mencionesDeQr();

const declarada = (m: Mencion) =>
  SIN_DIRECCION_DECLARADAS.find((d) => m.texto.includes(d.literal));

/** Promete que se le paga a ONIA por QR: nos paga a nosotros y no es su caja. */
const nosPaganPorQr = (m: Mencion) => NOS_PAGA.test(m.texto) && !EL_COBRA.test(m.texto);

describe("cómo se le paga a Onia: la venta sigue a la capacidad", () => {
  it("el barrido encuentra las menciones de QR del sitio (si no, no está midiendo)", () => {
    // Sin este ancla, un recorrido roto devuelve [] y todo lo de abajo pasa en
    // verde sin haber mirado un solo archivo.
    expect(MENCIONES.length).toBeGreaterThanOrEqual(8);
  });

  it("la fuente excluida del barrido EXISTE (si no, no se está excluyendo nada)", () => {
    expect(
      fuentesDelDisco().map((f) => f.split(/[\\/]/).join("/")),
      "El barrido exime a la fuente por ruta exacta: si se mueve, hay que mover la constante.",
    ).toContain(FUENTE);
  });

  it("clasifica un literal PARTIDO por el formateador (el cobrador del negocio)", () => {
    // Ancla de la ventana. Prettier corta «¿Te paso el QR?» en dos renglones y
    // la línea del QR queda como `QR?»`, sin dirección. Leyendo línea por línea
    // esto sale huérfano y el gate se vuelve ruido que manda a declarar copy
    // sano; por eso la clasificación mira la vecindad. Si alguien "simplifica"
    // el barrido a una sola línea, este caso cae.
    const cobrador = MENCIONES.find((m) => /features\.tsx$/.test(m.archivo.replace(/\\/g, "/")) && /QR\?/.test(m.texto));
    expect(cobrador, "Se esperaba el mensaje del cobrador en landing-v1/features.tsx").toBeDefined();
    expect(EL_COBRA.test(cobrador!.texto)).toBe(true);
    expect(nosPaganPorQr(cobrador!)).toBe(false);
  });

  it("ninguna superficie promete pagarle a Onia por QR mientras no haya QR", () => {
    if (QR_PARA_PAGARLE_A_ONIA) return;
    const prometen = MENCIONES.filter(nosPaganPorQr).map(
      (m) => `${m.archivo}:${m.linea} → ${m.texto.trim()}`,
    );
    expect(
      prometen,
      "Estas superficies le prometen al lead pagar por QR y producción no tiene " +
        "ninguno (BCP_QR_* = 0). El texto se pide a @/content/medio-de-pago, no se tipea.",
    ).toEqual([]);
  });

  it("toda mención de QR queda clasificada: nadie se cuela sin dirección", () => {
    const huerfanas = MENCIONES.filter(
      (m) => !nosPaganPorQr(m) && !EL_COBRA.test(m.texto) && !declarada(m),
    ).map((m) => `${m.archivo}:${m.linea} → ${m.texto.trim()}`);
    expect(
      huerfanas,
      "Menciona QR y no dice quién le paga a quién. Si es el negocio cobrándole " +
        "a SU cliente, declarala en SIN_DIRECCION_DECLARADAS con su motivo.",
    ).toEqual([]);
  });

  it("ninguna excusa sobra: se re-miden contra el disco", () => {
    // Es lo que evita que la lista se pudra: el día que un literal excusado
    // desaparezca del sitio, su entrada cae en rojo en vez de quedar absolviendo
    // para siempre a cualquier texto futuro que se le parezca.
    const sobran = SIN_DIRECCION_DECLARADAS.filter(
      (d) => !MENCIONES.some((m) => m.texto.includes(d.literal)),
    ).map((d) => d.literal);
    expect(sobran, "Ya no existen en el sitio: sacalas de la lista.").toEqual([]);
  });

  it("la fuente sin QR no nombra QR, y la rama con QR sí (las dos vivas)", () => {
    const sin = medioDePagoOnia(false);
    expect(sin.alTerminarLaPrueba).not.toMatch(/\bQR\b/);
    expect(sin.siTeSirve).not.toMatch(/\bQR\b/);
    // La rama `true` no es código muerto: es la que vuelve sola el día que el
    // banco entregue credenciales. Si se pudre, el arreglo de ese día sale mal.
    const con = medioDePagoOnia(true);
    expect(con.alTerminarLaPrueba).toMatch(/\bQR\b/);
    expect(con.siTeSirve).toMatch(/\bQR\b/);
  });

  it("lo que las superficies importan sigue al flag, no a un deseo", () => {
    expect(MEDIO_DE_PAGO).toEqual(medioDePagoOnia(QR_PARA_PAGARLE_A_ONIA));
  });

  it("sin QR, el lead igual se entera de CÓMO paga (no se borró la promesa)", () => {
    // El arreglo de esta clase es CONDICIONAR la promesa, nunca borrarla: una
    // pantalla que no dice cómo se paga deja al lead sin saber qué le espera.
    const sin = medioDePagoOnia(false);
    expect(sin.alTerminarLaPrueba).toMatch(/transferencia/i);
    expect(sin.siTeSirve).toMatch(/transferencia/i);
  });
});
