#!/usr/bin/env node
/**
 * Los rubros que el sitio VENDE, cruzados contra los que el alta ENTREGA.
 *
 * POR QUE EXISTE, y no es hipotetico: ya se rompio, y hacia las dos direcciones.
 *
 * 1. **El sitio ofrecio de MAS durante 23 dias.** Veterinaria salio de
 *    `RUBROS_ACTIVOS` el 2026-08-13 (el modelo de factura toma nombre y NIT del
 *    PACIENTE, y en una veterinaria el paciente es el animal). La orden se
 *    cumplio en el sitio vivo y no viajo a `/v1`, que responde **200**: el lead
 *    elegia Veterinaria y no la encontraba al registrarse. Lo arreglo
 *    `88eff254e` el 2026-09-05 — veintitres dias despues.
 *
 * 2. **La direccion inversa no la mira NADIE, y cuesta plata directa.** El
 *    2026-09-05 el bot de Onia contestaba "Servicios: en construccion" y ni
 *    nombraba Estetica, con los dos en `RUBROS_ACTIVOS` y el build vivo
 *    sirviendolos: el 40% de los prospectos. Ningun barrido de textos
 *    prohibidos puede verlo, porque no SOBRA una palabra: FALTA.
 *
 * QUE NO ALCANZA. `rubros-del-alta.test.ts` cubre la direccion 1 y sigue siendo
 * util —corre sin red, en cada build—, pero su lista de rubros ajenos
 * (veterinaria, farmacia, restaurante...) es **enumerada y por lo tanto
 * incompleta a proposito**: no puede ver un rubro que nadie previo, y no puede
 * ver la direccion 2 en absoluto. Por eso este cruce no enumera nada.
 *
 * COMO SE EVITA LA LISTA ENUMERADA. La autoridad se enumera A SI MISMA: cada
 * opcion del alta se publica con `data-testid="rubro-<id>"`, asi que un rubro
 * nuevo aparece solo. Lo unico escrito a mano es `EQUIVALENCIAS`, que traduce el
 * id del alta al id del sitio ("dentagest-clinical" ↔ "dental") — y **la
 * ausencia de una entrada NO es un agujero, es la alarma**: un id del alta que
 * nadie mapeo significa que produccion empezo a vender un rubro que el sitio no
 * sabe nombrar, que es exactamente el caso 2.
 *
 * COMO NO FALLA EN VERDE. Es la trampa de esta familia y en este carril ya costo
 * dos veces (el gate que sacaba sus sujetos del sitemap; el que los sacaba de
 * cuatro carpetas escritas a mano). Si el alta no se puede leer, o cambia de
 * forma y no se parsea, "ninguno sobra y ninguno falta" se leeria como exito:
 * por eso el verde EXIGE haber visto al menos `MINIMO_RUBROS` en el alta. No
 * poder medir sale ROJO de instrumento, nunca verde de sitio sano.
 *
 * NO se cablea en `prebuild`: necesita red y el alta en pie, igual que
 * `mirar-venta.mjs`, `enlaces-vivos.mjs` y `precios-vivos.mjs`. Colgarlo del
 * build ata el deploy a que otro servicio este arriba. Se corre cada vuelta.
 *
 * Uso:
 *   node scripts/rubros-vivos.mjs
 *   node scripts/rubros-vivos.mjs --alta=https://app.onia.com.bo/register
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { traer } from "./red-que-parpadea.mjs";

export const COINCIDEN = 0;
export const DESALINEADO = 1;
export const NO_PUDE_MEDIR = 2;

/** El alta de produccion: la unica autoridad sobre que rubro se puede entregar. */
export const ALTA_POR_DEFECTO = "https://app.onia.com.bo/register";

/**
 * Menos que esto y no estamos midiendo el alta: estamos midiendo una pagina de
 * error, un redirect a /login o un HTML que cambio de forma. Cinco es lo que hay
 * hoy; el piso se deja en 3 para que agregar o sacar uno no rompa el
 * instrumento, pero vaciarlo si.
 */
export const MINIMO_RUBROS = 3;

/**
 * `id del alta` → `id del sitio`. Lo unico escrito a mano, y a proposito: los
 * dos lados nombran el mismo rubro distinto ("dentagest-clinical" es el track
 * del core; "dental" es como lo llama el conmutador de la portada).
 *
 * Una entrada que falta NO deja un hueco silencioso: dispara la alarma de que el
 * alta vende algo que el sitio no sabe nombrar. Ver la cabecera.
 */
export const EQUIVALENCIAS = {
  "dentagest-clinical": "dental",
  "gestios-general": "comercio",
  "proveegest-electrico": "importadora",
  "esteticagest-clinical": "estetica",
  "gestios-servicios-profesionales": "servicios",
};

/**
 * Saca del HTML del alta los rubros que ofrece de verdad.
 *
 * Se lee el `data-testid`, no el rotulo visible: el texto cambia con el copy y
 * ademas los iconos de Material Symbols son ligaduras, asi que leer texto en
 * esta app es como se re-descubre en falso el bug mas famoso del proyecto.
 */
export function rubrosDelAlta(html) {
  const ids = [...html.matchAll(/data-testid="rubro-([a-z0-9-]+)"/g)].map(
    (m) => m[1],
  );
  return [...new Set(ids)].sort();
}

/**
 * Saca los rubros que el sitio PUBLICA, del conmutador de la portada — que es la
 * lista que `rubros/page.tsx` declara seguir ("la lista es la misma que el
 * conmutador").
 */
export function rubrosDelSitio(fuente) {
  const bloque = fuente.match(/const RUBROS[^=]*=\s*\[([\s\S]*?)\];/);
  if (!bloque) return [];
  const ids = [...bloque[1].matchAll(/id:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);
  return [...new Set(ids)].sort();
}

/**
 * El cruce, en las DOS direcciones. Puro: sin red y sin disco, para poder
 * probarlo con casos que hoy no existen en produccion.
 */
export function comparar(delAlta, delSitio, equivalencias = EQUIVALENCIAS) {
  const sinMapear = delAlta.filter((id) => !(id in equivalencias));
  const esperados = delAlta
    .filter((id) => id in equivalencias)
    .map((id) => equivalencias[id]);

  return {
    /** El alta lo entrega y el sitio no lo sabe nombrar: rubro nuevo sin venta. */
    sinMapear,
    /** El alta lo entrega, el sitio lo conoce y NO lo ofrece: se pierde el lead. */
    noOfrecidos: esperados.filter((id) => !delSitio.includes(id)),
    /** El sitio lo ofrece y el alta no lo entrega: el lead lo elige y no lo encuentra. */
    noEntregados: delSitio.filter((id) => !esperados.includes(id)),
  };
}

export function hayDesalineacion(cruce) {
  return (
    cruce.sinMapear.length > 0 ||
    cruce.noOfrecidos.length > 0 ||
    cruce.noEntregados.length > 0
  );
}

const AQUI = dirname(fileURLToPath(import.meta.url));
export const SWITCHER = join(AQUI, "..", "src", "app", "(sitio)", "switcher.tsx");

/**
 * La guarda de ejecucion directa. Sin esto, importar cualquier funcion de arriba
 * dispara la medicion contra produccion y un `process.exit()` que mata al
 * proceso que importa — medido el 2026-09-03 en otro gate de este sistema.
 */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const arg = process.argv.find((a) => a.startsWith("--alta="));
  const alta = arg ? arg.slice("--alta=".length) : ALTA_POR_DEFECTO;

  let html;
  try {
    // `traer` y no `fetch`: el 2026-09-27 este mismo gate salio NO PUDE MEDIR por un
    // `fetch failed` sobre un alta que contestaba 200 en 0,93 s por curl. Ver red-que-parpadea.mjs.
    const r = await traer(alta, { redirect: "follow" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    html = await r.text();
  } catch (e) {
    console.error(
      `NO PUDE MEDIR: el alta (${alta}) no contesto — ${e.message}.\n` +
        `Esto NO dice que el sitio este sano: dice que no se pudo cruzar.`,
    );
    process.exit(NO_PUDE_MEDIR);
  }

  const delAlta = rubrosDelAlta(html);
  if (delAlta.length < MINIMO_RUBROS) {
    console.error(
      `NO PUDE MEDIR: el alta devolvio ${delAlta.length} rubro(s), menos que el minimo ` +
        `de ${MINIMO_RUBROS}. O cambio de forma (ya no publica data-testid="rubro-<id>") ` +
        `o ${alta} no es el alta. Sin autoridad no hay cruce.`,
    );
    process.exit(NO_PUDE_MEDIR);
  }

  const delSitio = rubrosDelSitio(readFileSync(SWITCHER, "utf8"));
  if (delSitio.length === 0) {
    console.error(
      `NO PUDE MEDIR: no pude leer la lista de rubros de ${SWITCHER}. ` +
        `Si el conmutador cambio de forma, este cruce quedo ciego.`,
    );
    process.exit(NO_PUDE_MEDIR);
  }

  const cruce = comparar(delAlta, delSitio);

  if (!hayDesalineacion(cruce)) {
    console.log(
      `VERDE: los ${delAlta.length} rubros que entrega el alta son los ${delSitio.length} ` +
        `que vende el sitio.\n  alta:  ${delAlta.join(", ")}\n  sitio: ${delSitio.join(", ")}`,
    );
    process.exit(COINCIDEN);
  }

  for (const id of cruce.sinMapear) {
    console.error(
      `ROJO: el alta entrega "${id}" y el sitio no sabe nombrarlo.\n` +
        `  Produccion ya acepta ese rubro y ninguna pantalla de venta lo ofrece: ` +
        `ese prospecto se va creyendo que Onia no es para el.\n` +
        `  Se cierra agregandolo a EQUIVALENCIAS (${fileURLToPath(import.meta.url)}) y al conmutador.`,
    );
  }
  for (const id of cruce.noOfrecidos) {
    console.error(
      `ROJO: el alta entrega "${id}" y el sitio NO lo ofrece.\n` +
        `  Es la direccion que ningun barrido de textos prohibidos puede ver: no sobra una palabra, falta.`,
    );
  }
  for (const id of cruce.noEntregados) {
    console.error(
      `ROJO: el sitio ofrece "${id}" y el alta NO lo entrega.\n` +
        `  El lead lo elige aca y no lo encuentra al registrarse — el clic mas caro del sitio. ` +
        `Es el caso Veterinaria, que vivio 23 dias.`,
    );
  }
  process.exit(DESALINEADO);
}
