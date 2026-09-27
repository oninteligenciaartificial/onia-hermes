#!/usr/bin/env node
/**
 * ¿La tarjeta que ve quien recibe el link por WhatsApp es la que dice el código?
 *
 * `tarjeta-social.tsx` declara su propio punto ciego, con todas las letras:
 *
 *   «este número viaja HORNEADO EN PÍXELES […] y es lo que ve quien recibe el
 *   link por WhatsApp. Un monto dentro de un PNG no lo ve ningún grep, ningún
 *   barrido de HTML ni ninguna captura: si queda viejo, queda viejo en
 *   silencio.»
 *
 * Lo que había hasta el 2026-09-27 para cuidarlo era `hero.test.ts`, y mide el
 * ARCHIVO FUENTE: `readFileSync("tarjeta-social.tsx")`. Exige que el precio se
 * interpole de `lib/pricing.ts`, que el dibujo no vuelva a vender el add-on y
 * que el `alt` describa lo dibujado. Todo cierto, y todo sobre el código.
 *
 * ⚠️ **Un defecto en producción tiene DOS causas y ese gate sólo ve una:** o el
 * código está mal, o producción corre un build viejo. Con el código perfecto y
 * un build de hace un mes, la tarjeta se sigue compartiendo con un precio que
 * ya no existe — y los cuatro medidores del carril (`precios:vivos`,
 * `obra:viva`, `titular:sistema`, `enlaces:vivos`) pasan en VERDE, porque los
 * cuatro leen texto y acá el texto son píxeles. La escalera de precios cambió
 * dos veces este mes (el plan `crece`, el 2026-09-12, y a6adee05 el 17): en
 * cualquiera de las dos el PNG podría haberse quedado atrás sin que nada
 * avisara.
 *
 * Este medidor pregunta lo que ninguno preguntaba: **qué PNG sirve producción
 * HOY.**
 *
 * Las tres comprobaciones, y por qué cada una:
 *
 *  1. **Cada ruta declara su `og:image`.** El HTML se pide con el `User-Agent`
 *     de WhatsApp porque es el que importa: el fetcher lee las `og:*` aunque la
 *     página esté `noindex`, así que medir con otro agente mide otra cosa.
 *     `forma.test.ts` ya exige que el ARCHIVO exista; esto exige que la
 *     ETIQUETA llegue servida, que es un escalón más abajo y es donde se rompió
 *     el 2026-09-02 (once de doce rutas sin imagen, con el archivo presente).
 *
 *  2. **El PNG responde y mide lo que declara `size`.** Las dimensiones se LEEN
 *     de `tarjeta-social.tsx`, no se tipean acá: un gate que repite el valor que
 *     vigila defiende el valor, no la fuente.
 *
 *  3. **Las rutas de `(sitio)` sirven el MISMO dibujo.** No es una coincidencia
 *     que se observó: el archivo lo DECLARA («el dibujo es UNO y vive en este
 *     módulo; cada ruta tiene su `opengraph-image.tsx` de tres líneas que lo
 *     llama»). Entonces doce md5 idénticos es la forma de esa promesa, y uno
 *     distinto dice que esa ruta quedó con otro build o con otro dibujo. Esto
 *     detecta deriva SIN necesitar compilar nada.
 *
 * Y el cruce fuerte, cuando hay con qué: `--contra <base>` compara byte a byte
 * el PNG servido por producción contra el que genera el build actual. Con eso
 * la cadena queda cerrada de punta a punta —fuente → código → píxeles
 * servidos— y el monto horneado deja de ser invisible:
 *
 *     PORT=3317 npm run start &
 *     node scripts/tarjeta-social-viva.mjs --contra http://localhost:3317
 *
 * ⚠️ **Por qué es alias suelto y no entra a `npm test`.** La cadena de la raíz
 * la corre el integrador antes de tocar `main`: un gate que necesita red
 * trabaría el merge de los quince carriles cada vez que se cae el VPS. En la
 * cadena va el `--self-check`, que es PURO. Y cuando no puede preguntar sale
 * **2 = NO MEDIDO**, nunca 1: un gate que no pudo medir tiene que decirlo, no
 * contestar que sí. La misma convención de `obra-viva` y `precios-vivos`.
 *
 *   node scripts/tarjeta-social-viva.mjs              mide contra producción
 *   node scripts/tarjeta-social-viva.mjs --contra URL  + cruce con el build
 *   node scripts/tarjeta-social-viva.mjs --self-check  sólo la lógica pura
 */
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { traer } from "./red-que-parpadea.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const APP = join(AQUI, "..");
const SITIO = join(APP, "src", "app", "(sitio)");
const BASE = process.env.ONIA_BASE ?? "https://onia.com.bo";

/** El fetcher real. Lee las `og:*` aunque la página sea `noindex`. */
const UA_WHATSAPP = "WhatsApp/2.23.20.0 A";

/**
 * Los sujetos se DERIVAN del disco, nunca de una lista escrita acá.
 *
 * Una lista a mano envejece hacia el falso verde: la ruta nueva no está, así
 * que no se mide, así que pasa. Es exactamente cómo `/empezar` —el link que se
 * le manda a un lead para que se registre— se pasó semanas sin tarjeta.
 */
export function rutasConTarjeta(raiz = SITIO) {
  const out = [];
  const caminar = (dir, ruta) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      // (grupo) no aparece en la URL; _privado y [dinámico] no son superficie fija
      if (e.name.startsWith("_") || e.name.startsWith("[")) continue;
      const sub = e.name.startsWith("(") ? ruta : `${ruta}/${e.name}`;
      caminar(join(dir, e.name), sub);
    }
    if (existsSync(join(dir, "opengraph-image.tsx"))) out.push(ruta || "/");
  };
  caminar(raiz, "");
  return out.sort();
}

/**
 * Las dimensiones que la tarjeta DECLARA, leídas de su fuente.
 *
 * Tipearlas acá convertiría al gate en cómplice: mutar el `size` del dibujo
 * dejaría los dos lados de acuerdo en el valor equivocado.
 */
export function tamanoDeclarado(fuente) {
  const m = fuente.match(/export const size\s*=\s*\{\s*width:\s*(\d+)\s*,\s*height:\s*(\d+)/);
  if (!m) return null;
  return { width: Number(m[1]), height: Number(m[2]) };
}

/** Cabecera PNG: firma + IHDR. Devuelve null si no es un PNG. */
export function medidasPng(buf) {
  if (buf.length < 24) return null;
  const firma = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!buf.subarray(0, 8).equals(firma)) return null;
  if (buf.subarray(12, 16).toString("ascii") !== "IHDR") return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

export function ogImageDe(html) {
  const m = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
  return m ? m[1] : null;
}

/**
 * El corazón, puro: dadas las tarjetas ya bajadas, ¿qué está roto?
 *
 * Separado de la red para que el `--self-check` pueda falsificarlo sin salir a
 * internet — un gate cuya lógica sólo se ejercita contra producción no se
 * prueba nunca, y el día que se rompe contesta que todo está bien.
 */
export function veredicto(tarjetas, tamano) {
  const fallas = [];
  for (const t of tarjetas) {
    if (!t.og) {
      fallas.push(`${t.ruta} — servida SIN og:image: quien reciba el link ve una tarjeta pelada`);
      continue;
    }
    if (t.codigo !== 200) {
      fallas.push(`${t.ruta} — su og:image contesta ${t.codigo}, no 200 (${t.og})`);
      continue;
    }
    if (!t.medidas) {
      fallas.push(`${t.ruta} — lo servido en og:image no es un PNG`);
      continue;
    }
    if (t.medidas.width !== tamano.width || t.medidas.height !== tamano.height) {
      fallas.push(
        `${t.ruta} — mide ${t.medidas.width}x${t.medidas.height} y el dibujo declara ` +
          `${tamano.width}x${tamano.height}: la tarjeta sale recortada o escalada`,
      );
    }
  }

  // El dibujo es UNO: doce md5 iguales es la forma de esa promesa.
  const sanas = tarjetas.filter((t) => t.md5);
  const porMd5 = new Map();
  for (const t of sanas) porMd5.set(t.md5, [...(porMd5.get(t.md5) ?? []), t.ruta]);
  if (porMd5.size > 1) {
    const grupos = [...porMd5.entries()]
      .sort((a, b) => b[1].length - a[1].length)
      .map(([md5, rutas]) => `${md5.slice(0, 12)} → ${rutas.join(", ")}`);
    fallas.push(
      `el dibujo tendría que ser UNO y hay ${porMd5.size} distintos — una de estas rutas ` +
        `quedó con otro build:\n      ${grupos.join("\n      ")}`,
    );
  }

  return fallas;
}

/** El cruce fuerte: lo servido contra lo que genera el build de HOY. */
export function veredictoContraBuild(pares) {
  return pares
    .filter((p) => p.prod && p.local && p.prod !== p.local)
    .map(
      (p) =>
        `${p.ruta} — producción sirve un dibujo DISTINTO del que genera el código de hoy ` +
        `(prod ${p.prod.slice(0, 12)} ≠ build ${p.local.slice(0, 12)}): el monto horneado ` +
        `puede estar viejo y ningún barrido de texto lo ve`,
    );
}

const md5 = (buf) => createHash("md5").update(buf).digest("hex");

/**
 * Por `traer` y no por `fetch` pelado: un parpadeo de red daría un md5 vacío y
 * el cruce leería "producción sirve otro dibujo" — un ROJO por ambiente sobre
 * una tarjeta sana, que es como se le enseña a un carril a ignorar su gate.
 */
async function bajar(url) {
  const r = await traer(url, { headers: { "user-agent": UA_WHATSAPP } });
  return { codigo: r.status, buf: Buffer.from(await r.arrayBuffer()) };
}

async function medir() {
  const fuenteTarjeta = join(SITIO, "tarjeta-social.tsx");
  if (!existsSync(fuenteTarjeta)) {
    console.log(`NO MEDIDO: no encuentro ${fuenteTarjeta} — ¿árbol incompleto?`);
    return 2;
  }
  const tamano = tamanoDeclarado(readFileSync(fuenteTarjeta, "utf8"));
  if (!tamano) {
    console.log("NO MEDIDO: no pude leer `export const size` de tarjeta-social.tsx");
    return 2;
  }

  const rutas = rutasConTarjeta();
  const contra = process.argv.includes("--contra")
    ? process.argv[process.argv.indexOf("--contra") + 1]
    : null;

  console.log(`Base: ${BASE}  ·  rutas de (sitio) con tarjeta: ${rutas.length}`);
  console.log(`Dibujo declarado: ${tamano.width}x${tamano.height} (leído de tarjeta-social.tsx)`);
  if (contra) console.log(`Cruce contra el build actual: ${contra}`);

  const tarjetas = [];
  const pares = [];
  for (const ruta of rutas) {
    try {
      const html = await bajar(`${BASE}${ruta}`);
      const og = ogImageDe(html.buf.toString("utf8"));
      if (!og) {
        tarjetas.push({ ruta, og: null });
        continue;
      }
      const png = await bajar(og);
      const medidas = png.codigo === 200 ? medidasPng(png.buf) : null;
      const suma = medidas ? md5(png.buf) : null;
      tarjetas.push({ ruta, og, codigo: png.codigo, medidas, md5: suma });

      if (contra) {
        const camino = og.replace(/^https?:\/\/[^/]+/, "");
        const loc = await bajar(`${contra}${camino}`);
        pares.push({
          ruta,
          prod: suma,
          local: loc.codigo === 200 && medidasPng(loc.buf) ? md5(loc.buf) : null,
        });
      }
    } catch (e) {
      // No pude PREGUNTAR: eso no es "me dijeron que no".
      console.log(`\nNO MEDIDO: ${ruta} no contestó (${e.message})`);
      return 2;
    }
  }

  const vistas = tarjetas.filter((t) => t.md5).length;
  console.log(`tarjetas servidas y leídas: ${vistas}/${rutas.length}`);
  if (contra) {
    const cruzadas = pares.filter((p) => p.local).length;
    console.log(`cruzadas contra el build: ${cruzadas}/${rutas.length}`);
    if (cruzadas < rutas.length) {
      console.log("\nNO MEDIDO: el build local no sirvió todas las tarjetas — ¿arrancó bien?");
      return 2;
    }
  }

  const fallas = [...veredicto(tarjetas, tamano), ...(contra ? veredictoContraBuild(pares) : [])];
  if (fallas.length) {
    console.log("\nROJO:");
    for (const f of fallas) console.log(`  · ${f}`);
    console.log(
      "\nLa tarjeta es la PRIMERA pantalla del producto: la ve el que recibe el link\n" +
        "por WhatsApp aunque nunca abra el sitio. Se arregla en tarjeta-social.tsx\n" +
        "(el dibujo) o publicando el build (si el código ya estaba bien).",
    );
    return 1;
  }

  const dibujo = tarjetas.find((t) => t.md5)?.md5.slice(0, 12) ?? "?";
  console.log(
    `\nVERDE: las ${vistas} superficies de venta comparten el mismo dibujo (${dibujo}), ` +
      `de ${tamano.width}x${tamano.height}` +
      (contra ? ", y es el que genera el código de hoy: el monto horneado no quedó viejo." : "."),
  );
  return 0;
}

/**
 * Falsificación de la lógica pura, sin red. Cada caso es un defecto que este
 * gate existe para ver: si alguno deja de doler, el gate dejó de medir.
 */
function selfCheck() {
  const t = { width: 1200, height: 630 };
  const ok = (ruta, md5v = "a".repeat(32)) => ({
    ruta,
    og: `x${ruta}`,
    codigo: 200,
    medidas: { ...t },
    md5: md5v,
  });
  const casos = [
    ["verde", veredicto([ok("/"), ok("/empezar")], t).length === 0],
    ["ruta sin og:image", veredicto([ok("/"), { ruta: "/empezar", og: null }], t).length === 1],
    [
      "og:image que no contesta 200",
      veredicto([ok("/"), { ruta: "/empezar", og: "x", codigo: 404 }], t).length === 1,
    ],
    [
      "og:image que no es PNG",
      veredicto([ok("/"), { ruta: "/empezar", og: "x", codigo: 200, medidas: null }], t).length ===
        1,
    ],
    [
      "PNG con otras medidas que las declaradas",
      veredicto(
        [ok("/"), { ...ok("/empezar"), medidas: { width: 600, height: 315 } }],
        t,
      ).length === 1,
    ],
    [
      "una ruta con OTRO dibujo (build viejo)",
      veredicto([ok("/"), ok("/empezar", "b".repeat(32))], t).length === 1,
    ],
    [
      "producción distinta del build actual",
      veredictoContraBuild([{ ruta: "/", prod: "aaa", local: "bbb" }]).length === 1,
    ],
    [
      "el tamaño se LEE de la fuente, no se tipea",
      tamanoDeclarado("export const size = { width: 800, height: 418 };")?.width === 800,
    ],
    ["un buffer que no es PNG se reconoce", medidasPng(Buffer.from("no soy png")) === null],
    [
      "los sujetos salen del disco y la home está entre ellos",
      rutasConTarjeta().includes("/") && rutasConTarjeta().length >= 2,
    ],
  ];
  let malas = 0;
  for (const [nombre, paso] of casos) {
    if (!paso) {
      console.log(`  ROJO self-check: ${nombre}`);
      malas++;
    }
  }
  console.log(`self-check: ${casos.length - malas}/${casos.length} casos`);
  return malas;
}

/** Importarlo no dispara nada — la misma guarda que documenta `obra-viva.mjs`. */
const esPrincipal = process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop());
if (esPrincipal) {
  if (process.argv.includes("--self-check")) {
    process.exit(selfCheck() === 0 ? 0 : 1);
  } else {
    process.exit(await medir());
  }
}
