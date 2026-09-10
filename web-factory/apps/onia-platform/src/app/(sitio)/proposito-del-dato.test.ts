/**
 * Si le pedimos un dato al lead diciéndole PARA QUÉ es, ese para qué tiene que
 * tener circuito.
 *
 * QUÉ CLASE CUIDA, y por qué no la cuidaba nadie. Los gates de esta carpeta
 * persiguen tres cosas: lo que SOBRA (obra, autobombo, un precio a mano), lo
 * que FALTA en cobertura (un rubro que no se ofrece) y lo que se promete DE
 * MÁS (`promesa-humana.test.ts`: gente nuestra + verbo de servicio + plazo).
 * Esta es una cuarta: **el propósito declarado de un dato que le pedimos al
 * lead**. No sobra ninguna palabra, no hay precio, no hay enlace roto, la
 * frase es gramaticalmente impecable y encima suena honesta — «Un correo, nada
 * más». Y es falsa.
 *
 * EL DEFECTO QUE LA ESTRENA (2026-09-07, vivo en producción). `/guia-facturacion`
 * es el ÚNICO formulario de captación de onia.com.bo. Antes de pedir el correo
 * decía:
 *
 *   «el correo es para que te llegue la hoja y el aviso si cambia la fecha»
 *
 * y treinta líneas más abajo, ya con el correo adentro, entregaba la hoja EN
 * PANTALLA — «Está completa acá abajo… Guardala en PDF o imprimila». O sea que
 * el motivo #1 por el que le pedimos el dato se desmiente solo dentro del mismo
 * archivo. Medido, no razonado:
 *
 *   · el handler del intake (`apps/site/…/leads/intake/route.ts`) hace UNA cosa,
 *     `createOniaCenterEntity("lead", lead)`. Cero correo.
 *   · en toda esta app no hay circuito de salida: `grep -rniE
 *     'nodemailer|resend|sendgrid|postmark|smtp|mailgun|createTransport' src/
 *     package.json` da VACÍO.
 *   · el motivo #2 —«el aviso si cambia la fecha»— no tiene quién dispare el
 *     aviso: ningún cron del VPS vigila al SIN. Ojo con medirlo por substring,
 *     que ahí me equivoqué primero: `grep 'sin-'` sobre el crontab da 1 y es
 *     `onia-vigia-sin-respuesta.sh`, que es «sin respuesta» y no tiene nada que
 *     ver con el SIN.
 *
 * POR QUÉ EL GATE HERMANO NO PODÍA VERLO, que es lo que hace a esta clase cara.
 * `seguimiento-prometido.test.ts` nació el 2026-09-06 sobre este MISMO
 * formulario y cubre el CAMINO DE FALLO: que no le prometamos seguimiento a
 * alguien cuyo correo se acaba de tirar. Por eso la nota vive detrás de
 * `registrado &&`, y está bien. Pero verificó la PRECONDICIÓN («¿quedó
 * registrado?») y nunca la CAPACIDAD («¿existe el circuito que cumple lo
 * prometido?»). Con el lead registrado —el camino feliz, el que sí anda— la
 * promesa sigue siendo imposible, y el gate da verde porque la precondición se
 * cumple. Un gate que mide la precondición de una promesa no mide la promesa.
 *
 * CÓMO SE DERIVAN LOS SUJETOS. Del disco: todo archivo que le pide al lead un
 * dato de contacto (`type="email"` / `type="tel"`), más los archivos de su
 * misma carpeta, para que mover el copy una puerta más allá no lo saque del
 * barrido. Un formulario nuevo nace cubierto. Esa decisión ya se pagó dos veces
 * en este carril (`compartir.test.ts` sacaba sus rutas del sitemap;
 * `precios.test.ts` tenía cuatro raíces a mano que dejaban `app/v1/**` afuera).
 *
 * SE APAGA SOLO EL DÍA QUE EXISTA EL CIRCUITO. El gate no prohíbe la promesa:
 * la condiciona a la capacidad, igual que se hizo con `SEARXNG_URL` en el alta.
 * Si mañana entra un mailer de verdad, `hayCircuitoDeSalida()` pasa a `true` y
 * la promesa vuelve a ser legítima sin tocar este archivo. Borrar la promesa y
 * dejarla borrada sería peor: el día que se construya, nadie se acuerda.
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";

import { describe, expect, it } from "vitest";

const RAIZ = join(__dirname, "..", "..");
const APP = join(RAIZ, "..");

/**
 * Las formas de prometerle al lead que algo le va a LLEGAR. Es una promesa de
 * SALIDA (nosotros → él); las de entrada («Escribinos por WhatsApp») son otra
 * cosa y quedan afuera a propósito: ésas las cumple una persona contestando, y
 * el lead ya sabe que arrancó él.
 */
const PROMESAS_DE_SALIDA: { patron: RegExp; que: string }[] = [
  {
    patron: /\bte\s+(?:lo\s+|la\s+)?(?:escribimos|escribiremos|mandamos|mandaremos|enviamos|enviaremos|avisamos|avisaremos)\b/i,
    que: "prometemos escribirle nosotros",
  },
  {
    patron: /\b(?:para\s+que\s+)?te\s+(?:llega|llegue|llegar[áa])\b/i,
    que: "prometemos hacerle llegar algo",
  },
  { patron: /\brecibir[áa]s\b/i, que: "le decimos que va a recibir algo" },
];

/** Un dato de contacto: es lo que convierte a un archivo en sujeto. */
const PIDE_CONTACTO = /type="(?:email|tel)"/;

function fuentes(dir: string, salida: string[] = []): string[] {
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) {
      if (entrada.name === "node_modules" || entrada.name === "__tests__") continue;
      fuentes(ruta, salida);
      continue;
    }
    if (![".ts", ".tsx"].includes(extname(entrada.name))) continue;
    if (entrada.name.includes(".test.")) continue;
    salida.push(ruta);
  }
  return salida;
}

/**
 * Las líneas que NO son comentario, con su número REAL. Copiado de
 * `condicion-a-mano.test.ts` por el mismo motivo: filtrar por el PREFIJO de la
 * línea deja pasar el interior de un comentario JSX (`{/* … *\/}`), cuyas
 * líneas del medio arrancan con texto normal — y entonces el gate acusa en
 * falso a la bitácora que explica el propio defecto, que es como esta familia
 * termina obligando a borrar el registro de lo que pasó.
 */
function sinComentarios(txt: string): { n: number; linea: string }[] {
  const salida: { n: number; linea: string }[] = [];
  let dentroDeBloque = false;

  txt.split("\n").forEach((linea, i) => {
    const t = linea.trim();
    const abre = linea.includes("/*");
    const cierra = linea.includes("*/");

    if (dentroDeBloque) {
      if (cierra) dentroDeBloque = false;
      return;
    }
    if (abre && !cierra) {
      dentroDeBloque = true;
      return;
    }
    if (abre && cierra) return;
    if (t.startsWith("*") || t.startsWith("//")) return;

    salida.push({ n: i + 1, linea });
  });

  return salida;
}

const TODOS = fuentes(join(RAIZ, "app")).concat(fuentes(join(RAIZ, "components")));

/** Los archivos que piden contacto, y los de su misma carpeta. */
const SUJETOS = (() => {
  const piden = TODOS.filter((f) => PIDE_CONTACTO.test(readFileSync(f, "utf8")));
  const carpetas = new Set(piden.map((f) => dirname(f)));
  return TODOS.filter((f) => carpetas.has(dirname(f)));
})();

/**
 * ¿La app puede mandarle un correo a alguien? Hoy: no. Se pregunta por las
 * bibliotecas que lo harían, no por una constante que alguien tenga que
 * acordarse de mover.
 */
function hayCircuitoDeSalida(): boolean {
  const mailer = /nodemailer|\bresend\b|sendgrid|postmark|mailgun|createTransport|smtp/i;
  if (mailer.test(readFileSync(join(APP, "package.json"), "utf8"))) return true;
  return TODOS.some((f) => mailer.test(readFileSync(f, "utf8")));
}

function acusaciones(archivos: string[]): string[] {
  const culpables: string[] = [];
  for (const f of archivos) {
    for (const { n, linea } of sinComentarios(readFileSync(f, "utf8"))) {
      for (const { patron, que } of PROMESAS_DE_SALIDA) {
        if (patron.test(linea)) {
          culpables.push(`${relative(RAIZ, f)}:${n} — ${que}: ${linea.trim()}`);
        }
      }
    }
  }
  return culpables;
}

describe("el propósito que le declaramos a un dato tiene que tener circuito", () => {
  it("hay al menos un formulario de contacto vigilado (si esto da 0, el gate no mide nada)", () => {
    // Un gate cuyo universo de sujetos puede quedar vacío falla ABIERTO: sale
    // verde sin haber mirado nada. Se ancla acá.
    expect(SUJETOS.length).toBeGreaterThan(0);
    expect(
      SUJETOS.some((f) => f.includes("CapturaGuia")),
      "el único formulario de captación del sitio tiene que estar entre los sujetos",
    ).toBe(true);
  });

  it("hoy la app NO tiene circuito de salida de correo", () => {
    // Si esto se pone rojo es una BUENA noticia: alguien construyó el mailer.
    // Entonces la promesa vuelve a ser legítima y el caso de abajo se apaga
    // solo. No se borra este archivo: se revisa que lo prometido sea lo que el
    // circuito nuevo entrega.
    expect(hayCircuitoDeSalida()).toBe(false);
  });

  it("sin circuito, ningún formulario le promete al lead que algo le va a llegar", () => {
    if (hayCircuitoDeSalida()) return;
    expect(acusaciones(SUJETOS)).toEqual([]);
  });

  it("el detector ve el defecto REAL que lo estrenó (si no, es de adorno)", () => {
    // Validación por mutación, dirección «siempre vacío». Las dos frases son
    // textuales de producción, no inventadas para que pasen.
    const reales = [
      "          el correo es para que te llegue la hoja y el aviso si cambia la fecha.",
      "            Si el SIN vuelve a mover la fecha, te escribimos. Ya lo hizo dos",
    ];
    for (const linea of reales) {
      expect(
        PROMESAS_DE_SALIDA.some((p) => p.patron.test(linea)),
        `el detector no ve: ${linea.trim()}`,
      ).toBe(true);
    }
  });

  it("el detector NO acusa a una promesa que cumple el lead ni a una que sí tiene circuito", () => {
    // Validación por mutación, dirección «siempre lleno». Un detector que
    // marca todo es tan inútil como uno que no marca nada, y encima obliga a
    // borrar copy sano.
    const legitimas = [
      "        Escribinos por WhatsApp y lo vemos con tu caso.",
      "          ¿La tuya no está? Escribinos y te contestamos con tu caso concreto.",
      "            Guardala en PDF o imprimila para tenerla al lado.",
      "        El asistente le contesta a tu cliente en el momento.",
    ];
    for (const linea of legitimas) {
      expect(
        PROMESAS_DE_SALIDA.some((p) => p.patron.test(linea)),
        `el detector acusa en falso a: ${linea.trim()}`,
      ).toBe(false);
    }
  });
});
