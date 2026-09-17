import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * El panel que DIBUJA un rubro y el texto que lo VENDE nombran lo mismo.
 *
 * Son dos archivos y una sola promesa: `(sitio)/rubros/page.tsx` la escribe en
 * palabras («Llegás al cierre de mes con el IVA y el IT ya armados») y
 * `(sitio)/ui.tsx` la dibuja en el panel del conmutador, que es lo único que el
 * lead MIRA. La cabecera de `ui.tsx` ya declara que dependen uno del otro: *«el
 * resultado [sale] de lo que este mismo sitio ya publica rubro por rubro en
 * (sitio)/rubros/page.tsx»*. Eso era una promesa sin nadie que la verificara.
 *
 * Nace de que se separaron y nadie se enteró en quince días. El 2026-09-02
 * (`4384f7e8`) el panel de Servicios pasó de «IVA del mes · IT del mes» a
 * «Ventas del mes · Compras del mes», por creerlo una capacidad fabricada. El
 * texto de venta de `/rubros`, la cabecera de `ui.tsx`, `/nosotros`,
 * `/v1/modulos/dental` y `lib/siat.ts` siguieron prometiendo el IVA y el IT:
 * cinco superficies diciendo una cosa y el dibujo, otra.
 *
 * Y el que se había ido era el correcto — medido el 2026-09-17 contra
 * `origin/master` de onia-platform, que es donde vive el respaldo:
 * `lib/onia-core/modules/accounting-logic.ts` calcula débito y crédito fiscal
 * al 13 %, el IT al 3 % y el vencimiento por último dígito de NIT;
 * `app/(dashboard)/contabilidad/page.tsx` los pinta y declara que el escalón
 * `basic` ya trae *«resumen basico de impuestos del mes + vencimiento por
 * NIT»*; y `lib/platform/contabilidad-transversal.test.ts` demuestra que
 * /contabilidad es segmento COMÚN, o sea que le llega también a Servicios.
 *
 * Por qué no lo vio ningún gate: los cruces de precios atan CIFRAS contra su
 * fuente, y acá no hay ningún monto; los barridos de texto prohibido buscan
 * obra y autobombo, y «Ventas del mes» no es ninguna de las dos. Nadie
 * preguntaba si las dos mitades de la misma promesa seguían de acuerdo.
 *
 * Por eso el gate es de ACUERDO y no de contenido: no exige que diga «IVA»
 * —eso lo decide el producto, y si algún día deja de armarlo se corrigen las
 * dos superficies— sino que las dos digan LO MISMO. Cerrar una sola mitad es
 * exactamente la forma en que esto se rompió.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const FUENTE_PAGINA = join(AQUI, "rubros", "page.tsx");
const FUENTE_PANEL = join(AQUI, "ui.tsx");

/** El rubro que trajo el defecto: si sale del universo, el gate se apagó solo. */
const SUJETO_CONOCIDO = "servicios";

/**
 * Los impuestos bolivianos por su nombre, que es un conjunto CERRADO del mundo
 * real y no una lista de inclusión nuestra: el sitio no puede inventar uno.
 *
 * `IT` va sensible a mayúsculas y con límites de palabra a propósito: en
 * minúscula es una palabra inglesa cualquiera y aparece en cada `import`.
 */
const IMPUESTOS = ["IVA", "IT", "RCV"] as const;

/**
 * La fuente sin comentarios, conservando los saltos de línea.
 *
 * Los comentarios acusan Y absuelven: la bitácora que `ui.tsx` tiene arriba de
 * este mismo panel cita el texto viejo palabra por palabra —«Ventas del mes ·
 * Compras del mes»— y nombra el IVA y el IT varias veces. Un gate que la mire
 * queda verde con el panel roto, y obliga a borrar el registro para ponerse
 * rojo: las dos formas en que esta familia falla.
 */
function sinComentarios(fuente: string): string {
  return fuente
    .replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " "))
    .replace(/^\s*\/\/.*$/gm, " ");
}

/**
 * El texto que le llega al lead: lo pintado en el JSX (`>así<`) y lo que viaja
 * en una cadena (`txt="así"`, `resultado: "así"`).
 *
 * Hacen falta los dos y por eso no alcanza con el helper de las páginas: el
 * panel escribe sus filas en un ATRIBUTO (`<Fila txt="IVA del mes" …/>`) y la
 * página, en una propiedad de objeto. Mismo texto, dos sintaxis.
 */
function textoVisible(fragmento: string): string {
  const limpio = sinComentarios(fragmento);
  const pintado = [...limpio.matchAll(/>([^<>{}]+)</g)].map((m) => m[1]);
  const cadenas = [...limpio.matchAll(/"([^"\\]*)"/g)].map((m) => m[1]);
  return [...pintado, ...cadenas].join(" · ");
}

/** Qué impuestos NOMBRA un fragmento, sin repetir y en orden estable. */
function impuestosDe(fragmento: string): string[] {
  const texto = textoVisible(fragmento);
  return IMPUESTOS.filter((t) => new RegExp(`\\b${t}\\b`).test(texto));
}

/**
 * Corta un texto en los bloques que abre cada marca, hasta la marca siguiente.
 *
 * El universo sale de los archivos, no de una lista: un rubro nuevo entra solo
 * el día que alguien lo escribe, que es cuando hace falta que entre.
 */
function bloquesPorMarca(fuente: string, marca: RegExp): Map<string, string> {
  const limpia = sinComentarios(fuente);
  const marcas = [...limpia.matchAll(marca)];
  return new Map(
    marcas.map((m, i) => [
      m[1],
      limpia.slice(m.index ?? 0, marcas[i + 1]?.index ?? limpia.length),
    ]),
  );
}

/** Cada tarjeta de rubro de `/rubros`, por su `id`. */
function tarjetasDeLaPagina(fuente: string): Map<string, string> {
  return bloquesPorMarca(fuente, /id:\s*"([a-z-]+)"/g);
}

/** Cada panel dibujado de `ui.tsx`, por el `case` que lo elige. */
function panelesDelConmutador(fuente: string): Map<string, string> {
  return bloquesPorMarca(fuente, /case\s*"([a-z-]+)"\s*:/g);
}

/**
 * El rótulo accesible de cada panel (`panelLabel`), por rubro.
 *
 * Es sujeto PROPIO y no se funde con el dibujo: el panel va en un contenedor
 * con `role="img"`, así que esta frase no acompaña a la imagen — ES la imagen
 * para quien no la ve. Fundirla con el `case` la taparía justo cuando importa,
 * porque bastaría con que el dibujo nombrara el impuesto para dar por buena la
 * frase que quedó vieja. Y quedó vieja: el arreglo del 2026-09-17 tocó el
 * dibujo y este rótulo siguió diciendo «las ventas y las compras del mes»
 * dentro del mismo archivo, que es cómo esta familia falla siempre — la cura
 * no viaja sola a la otra mitad.
 */
function rotulosAccesibles(fuente: string): Map<string, string> {
  const limpia = sinComentarios(fuente);
  const desde = limpia.indexOf("const panelLabel");
  if (desde < 0) return new Map();
  const hasta = limpia.indexOf("\n};", desde);
  return bloquesPorMarca(limpia.slice(desde, hasta < 0 ? limpia.length : hasta), /^ {2}([a-z-]+):/gm);
}

const FUENTE_UI = readFileSync(FUENTE_PANEL, "utf8");
const TARJETAS = tarjetasDeLaPagina(readFileSync(FUENTE_PAGINA, "utf8"));
const PANELES = panelesDelConmutador(FUENTE_UI);
const ROTULOS = rotulosAccesibles(FUENTE_UI);

/** Los rubros que tienen las dos mitades: son los que se pueden contradecir. */
const RUBROS = [...TARJETAS.keys()].filter((id) => PANELES.has(id)).sort();

describe("el panel de un rubro dibuja lo que su página promete", () => {
  it("el universo sale de los dos archivos e incluye al rubro que trajo el defecto", () => {
    expect(
      RUBROS,
      "si Servicios no está en el universo, el gate mide otra cosa: era el rubro cuyo panel y cuyo texto se separaron",
    ).toContain(SUJETO_CONOCIDO);
    expect(RUBROS.length, "el conmutador publica cinco rubros").toBeGreaterThanOrEqual(5);
    expect(
      [...ROTULOS.keys()],
      "sin los rótulos accesibles el gate deja de mirar lo que OYE quien no ve el dibujo",
    ).toContain(SUJETO_CONOCIDO);
  });

  it.each(RUBROS)("%s nombra los mismos impuestos en el dibujo y en el texto", (id) => {
    const enLaPagina = impuestosDe(TARJETAS.get(id) ?? "");
    const enElPanel = impuestosDe(PANELES.get(id) ?? "");
    expect(
      enElPanel,
      `el rubro "${id}" promete y dibuja cosas distintas: /rubros nombra [${enLaPagina.join(", ") || "ninguno"}] y el panel de ui.tsx, [${enElPanel.join(", ") || "ninguno"}]. Una promesa que cambia se barre en TODA la superficie: si el producto dejó de armarlo se corrigen las dos, y si lo arma, también`,
    ).toEqual(enLaPagina);
  });

  it.each(RUBROS)("%s le dice lo mismo a quien no ve el dibujo", (id) => {
    const enLaPagina = impuestosDe(TARJETAS.get(id) ?? "");
    const enElRotulo = impuestosDe(ROTULOS.get(id) ?? "");
    expect(
      enElRotulo,
      `el rótulo accesible del rubro "${id}" (panelLabel en ui.tsx) nombra [${enElRotulo.join(", ") || "ninguno"}] y /rubros promete [${enLaPagina.join(", ") || "ninguno"}]. El panel va en un role="img": esa frase no acompaña al dibujo, ES el dibujo para quien no lo ve`,
    ).toEqual(enLaPagina);
  });
});

describe("el gate puede fallar", () => {
  /** El panel exacto de antes del arreglo, que estuvo quince días publicado. */
  const PANEL_VIEJO = `
    case "servicios":
      return (
        <>
          <Head titulo="Cierre del mes" sello="Servicios" />
          <Fila txt="Ventas del mes" pill="Al día" hecho />
          <Fila txt="Compras del mes" pill="Al día" hecho />
          <p>Llegás al cierre con las compras y las ventas ordenadas.</p>
        </>
      );`;

  const PANEL_DE_HOY = `
    case "servicios":
      return (
        <>
          <Fila txt="IVA del mes" pill="Armado" hecho />
          <Fila txt="IT del mes" pill="Armado" hecho />
          <p>Llegás al cierre con el IVA y el IT ya armados.</p>
        </>
      );`;

  const TARJETA = `
    id: "servicios",
    resultado:
      "Llegás al cierre de mes con el IVA y el IT ya armados, en vez de juntando papeles.",`;

  it("ve el desacuerdo que estuvo vivo quince días", () => {
    expect(impuestosDe(TARJETA)).toEqual(["IVA", "IT"]);
    expect(impuestosDe(PANEL_VIEJO)).toEqual([]);
  });

  it("deja pasar el panel de hoy, que dice lo mismo que la tarjeta", () => {
    expect(impuestosDe(PANEL_DE_HOY)).toEqual(impuestosDe(TARJETA));
  });

  it("lee el atributo y el texto pintado, que son las dos sintaxis en juego", () => {
    expect(impuestosDe(`<Fila txt="IVA del mes" />`)).toEqual(["IVA"]);
    expect(impuestosDe(`<p>el IT del mes</p>`)).toEqual(["IT"]);
    expect(impuestosDe(`<p>registro de compras y ventas (RCV)</p>`)).toEqual(["RCV"]);
  });

  it("no confunde un `it` cualquiera con el impuesto a las transacciones", () => {
    expect(impuestosDe(`<p>it works, digital, competitive</p>`)).toEqual([]);
    expect(impuestosDe(`import { it } from "vitest";`)).toEqual([]);
  });

  it("no se deja absolver por un comentario que cite el texto viejo", () => {
    const conBitacora = `
      /* Este panel decía "IVA del mes" y "IT del mes" y se quitaron. */
      case "servicios":
        <Fila txt="Ventas del mes" pill="Al día" hecho />`;
    expect(
      impuestosDe(conBitacora),
      "si el comentario absuelve, el gate queda verde con el panel roto y obliga a borrar la bitácora para ponerse rojo",
    ).toEqual([]);
  });

  it("ve el rótulo accesible que el arreglo del dibujo se dejó atrás", () => {
    const ui = `
const panelLabel: Record<PanelId, string> = {
  estetica:
    "Paquetes en curso: cada tratamiento con las sesiones que faltan.",
  servicios:
    "Cierre de mes: las ventas y las compras del mes al día, y el reporte esperando revisión.",
};
    case "servicios":
      <Fila txt="IVA del mes" pill="Armado" hecho />`;
    const rotulos = rotulosAccesibles(ui);
    expect([...rotulos.keys()]).toEqual(["estetica", "servicios"]);
    expect(
      impuestosDe(rotulos.get("servicios") ?? ""),
      "el dibujo ya nombra el IVA; si el rótulo se midiera junto al dibujo, este desacuerdo quedaría tapado",
    ).toEqual([]);
    expect(impuestosDe(panelesDelConmutador(ui).get("servicios") ?? "")).toEqual(["IVA"]);
  });

  it("el universo se parte por marca y no se come el bloque siguiente", () => {
    const dos = `case "estetica": <Fila txt="Sesiones" />
      case "servicios": <Fila txt="IVA del mes" />`;
    const bloques = panelesDelConmutador(dos);
    expect([...bloques.keys()]).toEqual(["estetica", "servicios"]);
    expect(impuestosDe(bloques.get("estetica") ?? "")).toEqual([]);
    expect(impuestosDe(bloques.get("servicios") ?? "")).toEqual(["IVA"]);
  });
});
