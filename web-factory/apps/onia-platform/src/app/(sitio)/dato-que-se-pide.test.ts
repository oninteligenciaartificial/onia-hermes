/**
 * Lo que el sitio DECLARA sobre los datos que pide tiene que cubrir todo lo que
 * el sitio PIDE.
 *
 * QUÉ CLASE CUIDA, y por qué ninguno de los 49 gates de esta app podía verla.
 * Todos juzgan lo que el sitio **dice**: lo que sobra (obra, autobombo, un
 * precio a mano), lo que falta en cobertura (un rubro que no se ofrece), lo que
 * promete de más (`promesa-humana`), de menos (`hueco-declarado`), lo que exige
 * de más (`datos-que-se-llevan`) y hasta el PARA QUÉ de un dato que pedimos
 * (`proposito-del-dato`). Ninguno juzga lo que el sitio **pide**. Y cuando lo
 * que se pide es un dato personal, la declaración que lo cubre puede abarcar
 * MENOS que el formulario que está al lado — sin que sobre ni falte una
 * palabra, con el precio saliendo de la fuente y el enlace en 200.
 *
 * EL DEFECTO QUE LA ESTRENA (2026-09-11, vivo en producción). En
 * `/guia-facturacion` —el ÚNICO formulario de captación de onia.com.bo, y la
 * página que capta la búsqueda del plazo del SIN— la misma pantalla, medida con
 * `curl` contra el contenedor que sirve el dominio:
 *
 *   · pide `type="email"` (label «Tu correo») **y** `type="tel"`
 *     (label «WhatsApp opcional»), y las dos claves viajan en el `body` del
 *     POST a `/api/agenda-intake`, que guarda el lead;
 *   · y a quince líneas declara: **«Un correo, nada más.»**
 *
 * O sea que la frase que existe para decirle a la persona con qué nos quedamos
 * le dice que su WhatsApp no entra, mientras el campo de al lado se lo pide y
 * el `body` se lo lleva. El WhatsApp es el dato más caro de los dos: es el
 * canal por el que después se lo contacta.
 *
 * POR QUÉ EL GATE HERMANO NO PODÍA VERLO, que es lo que hace cara a esta clase.
 * `proposito-del-dato.test.ts` nació el 2026-09-07 sobre ESTE MISMO literal y
 * lo cita textual en su cabecera como ejemplo de frase «que suena honesta y es
 * falsa» — pero por otro motivo: miró el PARA QUÉ («¿existe el circuito que
 * cumple lo prometido?») y nunca el QUÉ. Dos defectos en una sola frase, y
 * arreglar uno dejó el otro con cara de cubierto, que es exactamente cómo esta
 * familia sobrevive: el verde del vecino es lo que apaga la auditoría.
 *
 * LAS DOS PREGUNTAS, y por qué no alcanza con una.
 *
 *  (1) **La afirmación de exclusividad tiene que ser cierta.** No se exige que
 *      la nota nombre cada campo: el `<label>` ya se lo muestra a la persona, y
 *      pedir eso daría rojo sobre copy sano. Lo que no se puede es AFIRMAR que
 *      no pedimos nada más y pedir algo más. Se mide por VECINDAD (~90 chars)
 *      y no sobre el archivo, porque una marca de exclusividad tres párrafos
 *      abajo habla de otra cosa — la misma lección que `promesa-fiscal` pagó el
 *      2026-09-06 buscando afirmación y salvedad en el documento entero.
 *
 *  (2) **La política publicada tiene que tener un sujeto para quien deja el
 *      dato.** `privacidad.md` abría con «Dos tipos de datos, dos roles» —datos
 *      de tu CUENTA y datos que VOS CARGÁS— y declaraba que explica el
 *      tratamiento «cuando presta su software de gestión». El visitante que
 *      baja la hoja no tiene cuenta, no carga nada y no está recibiendo
 *      software: no es ninguno de los dos. Medido el 2026-09-11 sobre la
 *      política VIVA (`curl https://onia.com.bo/privacidad`): cero menciones de
 *      visitante, prospecto o alguien sin cuenta. Sin esta segunda pregunta, el
 *      arreglo de (1) deja al sitio recogiendo un dato fuera de lo que declaró
 *      y el gate en verde.
 *
 * CÓMO SE DERIVAN LOS SUJETOS. Del disco, en las dos direcciones: es sujeto
 * todo `.tsx` del sitio que pida un dato de contacto (`type="email"` /
 * `type="tel"`) **y** lo mande a un servidor nuestro (`fetch(`). Hoy da uno
 * solo; medido el 2026-09-11, las otras tres superficies con `<input>` del
 * sitio (`PedirWeb`, `v1/empezar/steps`, `requisitos-gate`) no hacen un solo
 * `fetch` —arman un mensaje de WhatsApp o marcan una casilla— y por eso no
 * entregan nada a ningún servidor. Un formulario nuevo nace cubierto, y si
 * alguien le saca el `fetch` al que hay, el caso ancla de abajo lo dice en vez
 * de quedarse callado: un gate sin sujetos es el modo en que esta familia falla
 * ABIERTO (`compartir.test.ts` y `precios.test.ts` ya lo pagaron en este
 * carril).
 */
import { readFileSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";

import { describe, expect, it } from "vitest";

const RAIZ = join(__dirname, "..", "..");
const APP = join(RAIZ, "..");

/** Un dato de contacto: lo que la persona tipea y nos podría identificar. */
const CAMPOS_DE_CONTACTO: { patron: RegExp; nombre: string; dice: RegExp }[] = [
  {
    patron: /type="email"/,
    nombre: "correo",
    dice: /\b(?:correo|e-?mail|mail)\b/i,
  },
  {
    patron: /type="tel"/,
    nombre: "WhatsApp",
    dice: /\b(?:whatsapp|wasap|tel[ée]fono|celular|n[úu]mero)\b/i,
  },
];

/**
 * Afirmar que no pedimos nada más. «sólo» suelto queda afuera a propósito: en
 * copy de venta casi siempre mide esfuerzo («sólo te lleva un minuto») y no
 * datos, así que como patrón pelado manda a romper texto sano.
 */
const EXCLUSIVIDAD = /\bnada\s+m[áa]s\b|\b[úu]nicamente\b|\bnada\s+m[áa]s\s+que\b|\by\s+listo\b/i;

/** La ventana en la que una marca de exclusividad todavía habla del dato. */
const VECINDAD = 90;

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
 * El texto SIN comentarios, conservando los saltos de línea para que el número
 * que se reporta sea el real. Filtra por ESTADO y no por el prefijo de la
 * línea: las del medio de un comentario JSX (`{/* … *\/}`) arrancan con texto
 * normal, así que un filtro por prefijo acusa a la bitácora que explica el
 * propio defecto — y obedecerlo obliga a borrar el registro de lo que pasó.
 */
function sinComentarios(txt: string): string {
  let dentroDeBloque = false;

  return txt
    .split("\n")
    .map((linea) => {
      const t = linea.trim();
      const abre = linea.includes("/*");
      const cierra = linea.includes("*/");

      if (dentroDeBloque) {
        if (cierra) dentroDeBloque = false;
        return "";
      }
      if (abre && !cierra) {
        dentroDeBloque = true;
        return "";
      }
      if (abre && cierra) return "";
      if (t.startsWith("*") || t.startsWith("//")) return "";

      return linea;
    })
    .join("\n");
}

/** Los formularios que piden un dato de contacto Y lo mandan a un servidor nuestro. */
const SUJETOS = fuentes(join(RAIZ, "app"))
  .concat(fuentes(join(RAIZ, "components")))
  .map((ruta) => ({ ruta, txt: sinComentarios(readFileSync(ruta, "utf8")) }))
  .filter(
    ({ txt }) =>
      CAMPOS_DE_CONTACTO.some(({ patron }) => patron.test(txt)) &&
      /fetch\s*\(/.test(txt),
  );

describe("lo que declaramos cubre lo que pedimos", () => {
  it("hay al menos un formulario de captación que vigilar", () => {
    // Sin este caso el gate falla ABIERTO: el día que alguien mueva el `fetch`
    // a un helper, SUJETOS queda vacío, los dos casos de abajo pasan sobre cero
    // archivos y nadie se entera de que dejó de medir.
    expect(SUJETOS.length).toBeGreaterThan(0);
  });

  it("ninguna nota afirma que no pedimos nada más mientras pide más", () => {
    const mentiras: string[] = [];

    for (const { ruta, txt } of SUJETOS) {
      const pide = CAMPOS_DE_CONTACTO.filter(({ patron }) => patron.test(txt));
      if (pide.length < 2) continue;

      // Cada marca de exclusividad del copy, con su vecindad.
      for (const marca of txt.matchAll(new RegExp(EXCLUSIVIDAD, "gi"))) {
        const desde = Math.max(0, (marca.index ?? 0) - VECINDAD);
        const ventana = txt.slice(desde, (marca.index ?? 0) + VECINDAD);

        // Si la vecindad no nombra ningún dato, la exclusividad habla de otra
        // cosa (esfuerzo, pasos, precio) y no es asunto de este gate.
        const nombrados = pide.filter(({ dice }) => dice.test(ventana));
        if (nombrados.length === 0) continue;

        const callados = pide.filter(({ dice }) => !dice.test(ventana));
        if (callados.length > 0) {
          const linea = txt.slice(0, marca.index ?? 0).split("\n").length;
          mentiras.push(
            `${relative(APP, ruta)}:${linea} — «${marca[0]}» junto a ` +
              `${nombrados.map((c) => c.nombre).join(" y ")}, y el formulario ` +
              `también pide ${callados.map((c) => c.nombre).join(" y ")}`,
          );
        }
      }
    }

    expect(
      mentiras,
      "Una afirmación de exclusividad sobre los datos tiene que ser cierta: " +
        "o se nombran todos los que se piden, o no se afirma que no pedimos " +
        "nada más.\n" +
        mentiras.join("\n"),
    ).toEqual([]);
  });

  it("la política publicada tiene un sujeto para quien deja el dato sin ser cliente", () => {
    const politica = readFileSync(
      join(RAIZ, "content", "legal", "privacidad.md"),
      "utf8",
    );

    // No alcanza con que la palabra aparezca: tiene que declarar QUÉ se recoge
    // de esa persona. Se piden los dos datos que el formulario manda.
    const declaraElSujeto =
      /todav[íi]a no (?:sos|es) cliente|sin tener (?:una )?cuenta|no ten[ée]s (?:una )?cuenta|a[úu]n no (?:sos|es) cliente/i.test(
        politica,
      );

    expect(
      declaraElSujeto,
      "El sitio le pide el contacto a gente que NO tiene cuenta (" +
        SUJETOS.map(({ ruta }) => relative(APP, ruta)).join(", ") +
        ") y lo guarda. `content/legal/privacidad.md` distingue sólo dos " +
        "sujetos —datos de tu cuenta y datos que vos cargás— y ninguno es ése: " +
        "quien entrega su correo y su WhatsApp no encuentra en la política qué " +
        "hacemos con ellos.",
    ).toBe(true);
  });
});
