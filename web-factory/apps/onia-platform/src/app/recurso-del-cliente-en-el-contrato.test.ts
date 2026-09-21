import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const SRC = path.resolve(__dirname, "..");
const TERMINOS = path.join(SRC, "content/legal/terminos.md");
const SITIO = path.join(__dirname, "(sitio)");

/**
 * Cuando la venta ofrece un canal que corre sobre un recurso que APORTA EL
 * CLIENTE, el contrato declara qué le pasa a ese recurso mientras esté
 * conectado.
 *
 * **El defecto que lo trajo, medido el 2026-09-19 contra producción.** La
 * portada y `/chatbot` publican, con 200:
 *
 *   «Tu WhatsApp responde las 24 horas.»
 *
 * y el contrato que ese mismo lead acepta al crear la cuenta declaraba el
 * canal —§6.2, «responde por su cuenta a quien escriba al número que
 * conectaste»— sin una sola palabra sobre qué le pasa a ESE número. `## 7.`
 * («Disponibilidad») terminaba en 7.3, y en todo el documento la palabra
 * WhatsApp aparecía tres veces: dos describiendo lo que el asistente hace y
 * una en los datos de contacto.
 *
 * Lo que el proyecto ya tenía medido y el contrato no decía, de
 * `hermes-content/docs/ONIA_CHATBOT_ALTA_WHATSAPP_CLIENTE.md` (fuente de
 * verdad viva, verificado contra developers.facebook.com el 2026-08-17):
 * conectar el número lo vincula a la plataforma de mensajería de Meta, y
 * según por qué camino entre, **puede dejar de usarse en la app del teléfono
 * y su historial anterior puede no viajar**; en el camino que conserva la app
 * se desactivan igual las **listas de difusión**, los **mensajes temporales**
 * y **«ver una vez»** en ese número, y los **grupos no entran al panel**. Ese
 * mismo doc escribe la condición como «(aviso en contrato, §7.4)» — un §7.4
 * que nunca existió.
 *
 * No es letra chica: el número de WhatsApp de un negocio boliviano es su
 * canal de venta. Un dueño que contrata el add-on de Bs 390 y descubre
 * DESPUÉS que en ese número perdió las difusiones —o la app del teléfono—
 * tiene un motivo para irse que nadie le dio la chance de evaluar antes.
 *
 * ⚠️ **Por qué ningún gate de esta casa podía verlo.** La familia entera
 * juzga la superficie de VENTA: que no sobre una palabra de obra
 * (`obra.test.ts`), que no sobre una capacidad (`promesa-humana`), que el
 * monto salga de la fuente (`precios-fuente`), que el plan no se tipee
 * (`capacidad-incluida`). Acá la venta está bien: «tu WhatsApp responde» es
 * lo que el producto hace. Lo que falta está en el CONTRATO, y su hermano
 * —`envio-automatico-en-el-contrato.test.ts`— mide la dimensión de al lado:
 * que el contrato declare el CANAL. Lo declara. Un canal declarado sobre un
 * recurso del cliente se lee como un canal cubierto, y el recurso queda sin
 * dueño: es la misma forma que «media familia cubierta se lee como familia
 * cubierta».
 *
 * El sujeto es el CRUCE (lo que la venta ofrece sobre un recurso propio × lo
 * que el contrato declara de ese recurso), así que el universo se DERIVA
 * caminando la superficie de venta: el canal que mañana corra sobre el correo
 * del cliente, su dominio o su cuenta de Instagram nace exigido, sin que
 * nadie agregue una línea acá.
 */

/**
 * Las páginas del sitio, caminando el DISCO.
 *
 * `readdirSync` y no `git ls-files`: el archivo recién escrito y sin commitear
 * es invisible para git, y es justo el sujeto que este gate existe para no
 * perder. Se saltean los directorios con la convención de siembra de otros
 * gates (`__algo__`), que aparecen y desaparecen mientras vitest corre en
 * paralelo.
 */
function paginasDeVenta(dir = SITIO): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.isDirectory()) {
      return /^__.+__$/.test(e.name) ? [] : paginasDeVenta(path.join(dir, e.name));
    }
    return e.name === "page.tsx" ? [path.join(dir, e.name)] : [];
  });
}

/**
 * Recursos que el canal necesita del cliente, detectados en la superficie de
 * venta.
 *
 * `ofrece` NO es una declaración: se vuelve a medir contra el disco en cada
 * corrida. Si la venta deja de ofrecerlo, el recurso sale del universo — y por
 * eso hace falta el caso ancla, o el universo se encoge en silencio y todo
 * queda verde sin vigilar nada.
 */
const RECURSOS = [
  {
    id: "el número de WhatsApp del negocio",
    // El posesivo es lo que convierte la oferta en una oferta sobre algo SUYO:
    // «tu WhatsApp» promete que el canal corre sobre la línea que ya usa.
    ofrece: /\btu\s+WhatsApp\b/i,
    // Lo que el contrato tiene que declarar de ese recurso. Cada concepto con
    // sus alternativas de redacción: se mide la PROMESA, no una frase.
    declara: [
      {
        concepto: "que ese número queda vinculado a la plataforma de Meta",
        patron: /n[úu]mero[^.]*(se\s+)?(vincul|conect)[^.]*Meta|Meta[^.]*ese\s+n[úu]mero/i,
      },
      {
        concepto: "qué cambia en ese número al conectarlo",
        patron:
          /(difusi[óo]n|difusiones|temporales|ver una vez|app de WhatsApp|historial)[^.]*(desactiv|deja[rn]? de|no (viaj|entran|est[áa]n)|puede[n]? no)|(desactiv|deja[rn]? de|no viaja)[^.]*(difusi|temporales|ver una vez|app de WhatsApp|historial)/i,
      },
      {
        concepto: "que puede conectar un número distinto del que usa hoy",
        patron: /n[úu]mero\s+(nuevo|distinto|aparte|dedicado)|otro\s+n[úu]mero/i,
      },
      {
        concepto: "que puede desconectarlo",
        patron: /desconect/i,
      },
    ],
  },
] as const;

const leer = (archivo: string) => readFileSync(archivo, "utf8");

/** Los recursos que la venta pide HOY, releídos del disco. */
function recursosOfrecidos() {
  const paginas = paginasDeVenta().map(leer);
  return RECURSOS.filter((r) => paginas.some((p) => r.ofrece.test(p)));
}

/**
 * La sección del contrato que habla de los canales que escriben solos.
 *
 * Se recorta la sección y no se mide el documento entero: una mención suelta
 * en otro apartado absolvería al gate sin que el cliente lea nunca la
 * condición al lado de la promesa que la necesita. Misma razón que la ventana
 * de `envio-automatico-en-el-contrato.test.ts`.
 */
function seccionDelCanal(texto = readFileSync(TERMINOS, "utf8")): string {
  const desde = texto.indexOf("## 6.");
  const hasta = texto.indexOf("## 7.");
  expect(desde, "el contrato ya no tiene la sección de canales (## 6.)").toBeGreaterThan(-1);
  expect(hasta, "no se pudo cerrar la sección de canales (## 7.)").toBeGreaterThan(desde);
  return texto.slice(desde, hasta);
}

describe("el contrato declara qué le pasa al recurso que la venta le pide al cliente", () => {
  it("el universo no puede encogerse solo: el recurso conocido sigue ofrecido", () => {
    // Ancla. Sin este caso, borrar el «tu WhatsApp» del lado de la VENTA vacía
    // el universo y los casos de abajo pasan en verde sin haber mirado nada.
    expect(recursosOfrecidos().map((r) => r.id)).toEqual([
      "el número de WhatsApp del negocio",
    ]);
  });

  it("la superficie de venta se derivó del disco, no de una lista", () => {
    // Si el caminador deja de encontrar páginas, `recursosOfrecidos()` da
    // vacío y el ancla de arriba lo denuncia — pero denunciándolo como «la
    // venta ya no lo ofrece», que manda al lugar equivocado. Este caso separa
    // las dos causas.
    const paginas = paginasDeVenta();
    expect(paginas.length, "no se encontró ninguna página de venta en (sitio)").toBeGreaterThan(5);
    expect(
      paginas.some((p) => p.endsWith(path.join("(sitio)", "page.tsx"))),
      "la portada no está en el universo",
    ).toBe(true);
  });

  for (const recurso of RECURSOS) {
    for (const { concepto, patron } of recurso.declara) {
      it(`si la venta pide ${recurso.id}, el contrato declara ${concepto}`, () => {
        if (!recursosOfrecidos().some((r) => r.id === recurso.id)) return;
        const seccion = seccionDelCanal();
        expect(
          patron.test(seccion),
          `La venta ofrece el canal sobre ${recurso.id} ("tu WhatsApp responde las 24 horas"),\n` +
            `y la sección 6 del contrato no declara ${concepto}.\n` +
            `El dueño acepta el contrato ANTES de conectar el número: si la condición no está ahí,\n` +
            `la descubre después de contratar. Fuente medida:\n` +
            `hermes-content/docs/ONIA_CHATBOT_ALTA_WHATSAPP_CLIENTE.md (verificado 2026-08-17).`,
        ).toBe(true);
      });
    }
  }
});
