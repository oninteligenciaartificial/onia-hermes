import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import {
  ALCANCE_CON_AGENDA,
  ALCANCE_CON_INVENTARIO,
  ALCANCE_POR_AGENDA,
  ALCANCE_POR_INVENTARIO,
} from "@/lib/pricing";

/**
 * Cuando la venta ENUMERA lo que trae el sistema, la capacidad que el producto
 * acota por rubro dice su alcance ahí mismo.
 *
 * 🔴 **Por qué ningún gate podía ver esto, teniendo uno escrito para el mismo
 * eje.** `app/capacidad-acotada.test.ts` existe exactamente para «toda mención
 * de una capacidad acotada por rubro dice a qué rubros llega», y deriva sus
 * SUJETOS del disco —`src/` entero— así que una página nueva nace cubierta.
 * Pero su UNIVERSO DE CAPACIDADES es `ALCANCE_POR_RUBRO` + `ALCANCE_POR_DATOS`:
 * dos listas escritas a mano con lo que alguien ya SOSPECHABA acotado —el
 * agente Recall, los reportes completos, las facturas recurrentes—. Lo caro, lo
 * de los planes altos, lo que suena a clínica.
 *
 * **La agenda no la sospechó nadie.** Es lo primero que uno da por hecho que
 * trae un sistema de gestión, así que nunca entró al universo, así que no fue
 * sujeto de nadie, así que la venta la repitió plana en cada superficie. Medido
 * el 2026-09-11 contra `origin/master` de `onia-platform`: `gestios-general`
 * (comercio) y `proveegest-electrico` (importadora) —2 de los 5 rubros que el
 * alta entrega— **no tienen una sola ruta de citas en su nav**, y el producto ya
 * lo dice de sí mismo con `tieneAgenda()`. La home prometía «Agenda, clientes y
 * caja ya adentro» tres líneas debajo de enumerar los cinco rubros.
 *
 * La lección, para el que escriba el gate siguiente: **un gate que deriva bien
 * sus sujetos sigue fallando ABIERTO si su universo se escribe a mano, y el
 * agujero no está en lo raro sino en lo básico** — justo lo que nadie audita
 * porque «eso obvio que lo trae».
 *
 * ⚠️ **Por qué el sujeto es la ENUMERACIÓN y no la mención.** Un gate sobre
 * `\bagenda\b` a secas acusa a quince textos sanos: el panel dibujado de una
 * clínica («Agenda del día… con su hora y su tratamiento»), la lista de lo que
 * el LEAD usa hoy («Agenda en cuaderno o Excel»), el veredicto sobre un
 * competidor («Ninguno tiene agenda ni ficha») y el `PLAN_INCLUYE` de `/v1`, que
 * ya está partido por rubro. En todos ésos la palabra es correcta. Lo que
 * convierte la mención en promesa es el CONTEXTO: que esté en una lista de lo
 * que el sistema trae, o sea junto a dos capacidades más que sí tienen los
 * cinco rubros. Ése es el par que puede mentir, y por eso es el sujeto.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
/** `src/` entero: el copy de venta vive en `app/`, `components/`, `lib/` y `content/`. */
const SRC = join(AQUI, "..");

/**
 * Las capacidades que TODOS los rubros del alta tienen, como las nombra el copy.
 *
 * No es una lista de features: es lo que hace que un texto sea una ENUMERACIÓN
 * de lo que trae el sistema. Cada una se verificó contra `VERTICAL_PACKS` de los
 * cinco rubros el 2026-09-11 — «caja» y «cobros» van juntas a propósito: dental
 * y estética lo llaman Cobros (`/billing`) y comercio, importadora y servicios
 * lo llaman Caja (`/comercio/caja`), que es la misma función con dos nombres y
 * NO un rubro al que le falte algo.
 *
 * ⚠️ «inventario» estuvo en esta lista y era FALSO: `SERVICIOS_NAV_ITEMS` no
 * tiene `/inventory` ni `/comercio/inventario` (re-medido 2026-09-24). Contarlo
 * como universal hacía que el gate lo usara para DETECTAR listas en vez de
 * vigilarlo — el mismo agujero que dejó pasar la agenda. Ahora es acotada.
 */
const UNIVERSALES = [
  /\bclient[ae]s\b/i,
  /\bfichas?\b/i,
  /\bcaja\b/i,
  /\bcobros?\b/i,
  /\bcontabilidad\b/i,
  /\bagentes\b/i,
];

/** Cuántas capacidades universales al lado convierten la mención en enumeración. */
const MINIMO_PARA_SER_LISTA = 2;

/** La capacidad acotada, con la forma en que el copy la nombra y su salvedad. */
const ACOTADAS: ReadonlyArray<{
  capacidad: string;
  porque: string;
  patron: RegExp;
  alcance: string;
  constante: string;
}> = [
  ...ALCANCE_POR_AGENDA.map((c) => ({
    capacidad: c.capacidad,
    porque: c.porque,
    patron:
      c.capacidad === "agenda"
        ? /\bagenda\b/i
        : /\breservas? online\b|\bagenda p[úu]blica\b/i,
    alcance: ALCANCE_CON_AGENDA,
    constante: "ALCANCE_CON_AGENDA",
  })),
  {
    capacidad: ALCANCE_POR_INVENTARIO.capacidad,
    porque: ALCANCE_POR_INVENTARIO.porque,
    patron: /\binventario\b/i,
    alcance: ALCANCE_CON_INVENTARIO,
    constante: "ALCANCE_CON_INVENTARIO",
  },
];

/**
 * Enumeraciones exentas, cada una con su motivo. Se RE-MIDE: si el fragmento
 * dejó de estar donde dice, el gate se pone rojo — una excusa que sobra queda
 * bendiciendo lo que ya no existe.
 */
const EXENTOS: ReadonlyArray<{ archivo: string; fragmento: string; motivo: string }> = [
  {
    archivo: join("app", "(sitio)", "rubros", "page.tsx"),
    fragmento: "Clientes, agenda, servicios y cobros.",
    motivo:
      "es la descripción de la tarjeta Servicios, bajo su propio h3; ese rubro sí incluye agenda, no es una promesa para todos los rubros",
  },
  {
    archivo: join("lib", "proof.ts"),
    fragmento: "Su página oficial no menciona agenda, ficha, recordatorios, caja ni permisos",
    motivo:
      "enumera lo que le falta a un COMPETIDOR, no lo que traemos nosotros: el sujeto de la frase es el otro producto",
  },
  {
    archivo: join("lib", "proof.ts"),
    fragmento: "no figura agenda ni ficha del paciente",
    motivo: "mismo caso: es el veredicto sobre otros dos productos, no nuestra oferta",
  },
];

/**
 * Páginas que SON de un rubro: su URL, su `<title>` y su h1 lo nombran, así que
 * enumerar la agenda ahí no puede confundir a nadie. Se re-mide igual que las
 * exenciones de arriba — el día que la carpeta desaparezca, la excusa sobra.
 */
const PAGINAS_DE_UN_RUBRO: ReadonlyArray<{ prefijo: string; rubro: string }> = [
  { prefijo: join("app", "v1", "modulos", "dental"), rubro: "dental" },
];

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
      // Se reemplaza por espacios para no encoger las distancias del archivo.
      const hasta = fin === -1 ? fuente.length : fin;
      salida += " ".repeat(hasta - i);
      i = hasta;
      continue;
    }

    if (par === "/*") {
      const fin = fuente.indexOf("*/", i + 2);
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

/** Un literal de copy: una cadena, una plantilla, o un texto JSX. */
const LITERAL = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|>[^<>{}]{12,}</g;

/**
 * Un ARRAY de cadenas cortas también es una enumeración, y es la forma en que
 * se dibujan las piezas de la tarjeta social y la banda de módulos: cada trozo
 * es un literal suelto, así que leídos de a uno ninguno es una lista. Se juntan
 * antes de medir o el dibujo que un lead ve ANTES de abrir el sitio queda fuera.
 */
const ARRAY_DE_CADENAS = /\[\s*(?:"(?:[^"\\]|\\.)*"\s*,\s*)+"(?:[^"\\]|\\.)*"\s*,?\s*\]/g;

type Trozo = { archivo: string; texto: string };

/** Todo texto de copy del disco, ya sin comentarios, con los arrays juntados. */
function trozosDeCopy(): Trozo[] {
  const salida: Trozo[] = [];

  for (const ruta of FUENTES) {
    const limpio = sinComentarios(readFileSync(ruta, "utf8"));
    const archivo = relative(SRC, ruta);

    for (const m of limpio.matchAll(ARRAY_DE_CADENAS)) {
      salida.push({ archivo, texto: m[0] });
    }
    for (const m of limpio.matchAll(LITERAL)) {
      salida.push({ archivo, texto: m[0] });
    }
  }

  return salida;
}

/** ¿Este trozo enumera lo que trae el sistema? */
function esEnumeracion(texto: string): boolean {
  return UNIVERSALES.filter((re) => re.test(texto)).length >= MINIMO_PARA_SER_LISTA;
}

type Hallazgo = { archivo: string; capacidad: string; porque: string; texto: string };

/** Enumeraciones que nombran una capacidad acotada y NO dicen su alcance. */
export function enumeracionesSinAlcance(trozos: Trozo[]): Hallazgo[] {
  const salida: Hallazgo[] = [];

  for (const { archivo, texto } of trozos) {
    if (!esEnumeracion(texto)) continue;
    if (PAGINAS_DE_UN_RUBRO.some((p) => archivo.startsWith(p.prefijo))) continue;
    if (EXENTOS.some((e) => e.archivo === archivo && texto.includes(e.fragmento))) continue;

    for (const acotada of ACOTADAS) {
      if (!acotada.patron.test(texto)) continue;
      if (texto.includes(acotada.constante) || texto.includes(acotada.alcance)) continue;
      salida.push({
        archivo,
        capacidad: acotada.capacidad,
        porque: acotada.porque,
        texto: texto.slice(0, 180),
      });
    }
  }

  return salida;
}

describe("una enumeración de lo que trae el sistema dice el alcance de lo acotado", () => {
  const trozos = trozosDeCopy();

  it("lee copy de verdad — si el barrido se queda sin sujetos, no está midiendo", () => {
    expect(FUENTES.length).toBeGreaterThan(50);
    expect(trozos.filter((t) => esEnumeracion(t.texto)).length).toBeGreaterThan(10);
  });

  it("ninguna enumeración promete la agenda ni el inventario sin decir a quién le llega", () => {
    const sinAlcance = enumeracionesSinAlcance(trozos);

    expect(
      sinAlcance,
      sinAlcance
        .map(
          (h) =>
            `${h.archivo} enumera «${h.capacidad}» entre lo que trae el sistema y no dice su alcance ` +
            `(${h.porque}): ${h.texto}`,
        )
        .join("\n"),
    ).toEqual([]);
  });

  it("cada exención se re-mide: si su fragmento ya no está, sobra", () => {
    for (const exento of EXENTOS) {
      const fuente = sinComentarios(readFileSync(join(SRC, exento.archivo), "utf8"));
      expect(fuente, `sobra la exención de ${exento.archivo}: «${exento.fragmento}»`).toContain(
        exento.fragmento,
      );
    }
  });

  it("una página exenta por ser de un rubro sigue existiendo y sigue nombrándolo", () => {
    for (const pagina of PAGINAS_DE_UN_RUBRO) {
      const archivos = FUENTES.map((f) => relative(SRC, f)).filter((f) =>
        f.startsWith(pagina.prefijo),
      );
      expect(archivos, `sobra la exención de ${pagina.prefijo}: ya no hay archivos ahí`).not.toEqual(
        [],
      );

      /**
       * Se le exige nombrar el rubro a quien USA el salvoconducto, que es el
       * que enumera: el filtro de `enumeracionesSinAlcance` saltea por prefijo
       * sólo a los trozos que son enumeración, así que un archivo sin ninguna
       * nunca queda exento de nada y pedirle la palabra es un rojo falso.
       *
       * Medido el 2026-09-13: `v1/modulos/dental/opengraph-image.tsx` —tres
       * líneas que re-exportan la tarjeta social del sitio, cero copy— puso
       * rojo este guard por no decir «dental», y la única cura disponible era
       * tipearle la palabra al pedo o dejar la ruta compartiéndose sin imagen.
       * Un guard que obliga a eso empuja al arreglo equivocado.
       */
      const queEnumeran = archivos.filter((archivo) =>
        trozos.some((t) => t.archivo === archivo && esEnumeracion(t.texto)),
      );

      for (const archivo of queEnumeran) {
        const fuente = sinComentarios(readFileSync(join(SRC, archivo), "utf8"));
        expect(
          fuente.toLowerCase(),
          `${archivo} está exento por ser del rubro ${pagina.rubro} y ya no lo nombra`,
        ).toContain(pagina.rubro);
      }
    }
  });

  it("la frase de alcance sale de la fuente, no tipeada al lado", () => {
    // Mismo criterio que el resto de la casa: dos copias del mismo hecho es como
    // llegó a haber cuatro precios vivos del mismo chatbot.
    const tipeada = trozosDeCopy().filter(
      (t) =>
        !t.archivo.startsWith(join("lib", "pricing")) &&
        ACOTADAS.some((a) => t.texto.includes(a.alcance) && !t.texto.includes(a.constante)),
    );
    expect(tipeada.map((t) => `${t.archivo}: ${t.texto.slice(0, 120)}`)).toEqual([]);
  });

  it("el detector reconoce la forma real del defecto, no sólo la cómoda", () => {
    // Anclas: sin ellas, un detector que nunca encuentra nada pasa en verde.
    const comoEstabaLaHome = [
      { archivo: "app/(sitio)/page.tsx", texto: '"agenda, fichas de clientes, caja, cobros e inventario"' },
      { archivo: "components/landing-v1/how-it-works.tsx", texto: '"Agenda, clientes y caja ya adentro."' },
      // La tarjeta social: cinco literales sueltos que sólo mienten juntos.
      { archivo: "app/(sitio)/tarjeta-social.tsx", texto: '["Agenda", "Clientes", "Caja", "Cobros", "Inventario"]' },
      // La reserva pública cuelga del mismo `tieneAgenda`.
      { archivo: "lib/pricing.ts", texto: '"Reservas online incluidas, clientes y cobros en un solo lugar"' },
    ];
    // Esas cuatro anclas son de la AGENDA; varias enumeran también el inventario
    // plano, que se mide abajo con sus propias anclas.
    const deAgenda = enumeracionesSinAlcance(comoEstabaLaHome).filter(
      (h) => h.capacidad !== ALCANCE_POR_INVENTARIO.capacidad,
    );
    expect(deAgenda.map((h) => h.archivo)).toEqual([
      "app/(sitio)/page.tsx",
      "components/landing-v1/how-it-works.tsx",
      "app/(sitio)/tarjeta-social.tsx",
      "lib/pricing.ts",
    ]);

    // Y NO acusa a lo que es correcto: la mención sin lista, el panel de un
    // rubro, lo que usa el lead hoy, y la enumeración que sí dice su alcance.
    const sanos = [
      { archivo: "app/(sitio)/page.tsx", texto: '"la agenda del día trae cada cita con su hora y su motivo"' },
      { archivo: "app/v1/empezar/data.ts", texto: '"Agenda en cuaderno o Excel"' },
      {
        archivo: "app/(sitio)/page.tsx",
        texto: `"clientes, caja y cobros —más inventario ${ALCANCE_CON_INVENTARIO} y agenda ${ALCANCE_CON_AGENDA}—"`,
      },
    ];
    expect(enumeracionesSinAlcance(sanos)).toEqual([]);

    // El inventario, en las dos formas en que se vendía plano hasta el
    // 2026-09-24: la lista de /empezar y las piezas de la tarjeta social.
    const inventarioPlano = [
      {
        archivo: "app/(sitio)/empezar/page.tsx",
        texto: `"Todo encendido: caja, inventario, contabilidad, la cola de agentes y la agenda ${ALCANCE_CON_AGENDA}."`,
      },
      {
        archivo: "app/(sitio)/tarjeta-social.tsx",
        texto: '["Clientes", "Caja", "Cobros", "Inventario", "Contabilidad"]',
      },
    ];
    expect(enumeracionesSinAlcance(inventarioPlano).map((h) => h.capacidad)).toEqual([
      "inventario",
      "inventario",
    ]);
  });
});
