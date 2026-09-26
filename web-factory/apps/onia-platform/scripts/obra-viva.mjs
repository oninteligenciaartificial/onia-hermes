#!/usr/bin/env node
/**
 * La obra y el autobombo que el lead LEE HOY, seguidos contra produccion.
 *
 * POR QUE EXISTE, y es el ultimo agujero de los cuatro numeros de este carril.
 * El objetivo del loop se mide con cuatro: prohibidos, precios fuera de fuente,
 * CTA rotos y deploy. Los tres ultimos ya tienen un gate que mira PRODUCCION
 * —`precios-vivos.mjs`, `enlaces-vivos.mjs`, `deploy-vivo.mjs`—. El primero no
 * tenia ninguno: sus CINCO gates (`obra.test.ts`, `obra-literal.test.ts`,
 * `obra-en-el-cuerpo.test.ts`, `v1/empezar/obra-en-la-pantalla.test.ts`,
 * `(sitio)/obra-a-la-vista.test.ts`) leen el ARBOL DE FUENTES, y estan verdes.
 *
 * Lo que un gate del arbol no puede ver, medido el 2026-09-26 a las 04:48 La Paz:
 * `onia.com.bo/servicios/marketing-ia` le decia al lead, en la pantalla de venta,
 * *"Somos una empresa nueva y lo decimos de frente: no tenemos un muro de logos ni
 * casos de exito"*. El arreglo estaba mergeado a `main` desde `5f61db7a` (05:01
 * UTC) y el sitio servia el build de las 06:52 UTC — anterior al merge de las
 * 08:36. O sea: **codigo correcto, gates verdes, y el defecto vivo en la cara del
 * cliente durante horas.** Un gate del arbol contesta "¿lo escribimos bien?"; este
 * contesta la unica pregunta que le importa al lead: "¿que dice la pantalla HOY?".
 *
 * Y la medicion de arranque del carril tampoco lo veia, por dos motivos a la vez:
 * miraba CUATRO rutas de las 24 (`marketing-ia` no estaba entre ellas) y lo hacia
 * con `grep` sobre el HTML crudo, donde una clase CSS cuenta igual que una frase.
 *
 * QUE MIDE. Baja las 24 superficies de venta que declara `rutas-de-venta.mjs`
 * —derivadas del disco, no una lista a mano— y busca obra y autobombo en el texto
 * que el lead LEE: el cuerpo visible mas la metadata (`<title>`, `description`,
 * `og:*`), que es texto de cliente que ninguna captura mira. Antes de buscar:
 * fuera `<script>` y `<style>`, fuera los comentarios `<!-- -->` con que React
 * parte las frases, y acentos normalizados, porque `proximamente` y `próximamente`
 * son la misma palabra y el build escapa los acentos.
 *
 * QUE DIAGNOSTICA, y es la mitad que ahorra la vuelta siguiente. Un texto prohibido
 * servido tiene dos causas que se arreglan en lugares OPUESTOS:
 *   - ningun archivo de cara al cliente lo escribe  -> el codigo ya esta bien y lo
 *     que falta es DESPLEGAR: sale 3. Es el caso de hoy.
 *   - algun archivo lo escribe                      -> el defecto es nuestro: sale 1.
 * Sin esa distincion, la vuelta siguiente vuelve a "arreglar" un archivo ya
 * arreglado; con ella, sabe que solo tiene que esperar al publicador. Misma
 * convencion que `precios-vivos.mjs` y `mirar-venta.mjs`.
 *
 * ⚠️ AL BUSCAR EN EL ARBOL SE QUITAN LOS COMENTARIOS Y LOS `*.test.ts`, y no es un
 * detalle: los cinco gates de obra CITAN los literales prohibidos en sus cabeceras
 * y los usan como fixture para exigir su propio rojo. Buscar crudo encuentra esos,
 * concluye "el codigo esta mal" y manda a borrar la prueba que defiende la regla —
 * el gate acusaria al unico archivo que esta haciendo bien su trabajo.
 *
 * LAS DOS EXENCIONES, con su motivo, y por que no fallan abierto:
 *
 *  1. `/terminos` y `/privacidad` quedan exentas SOLO de obra, nunca de autobombo.
 *     No es comodidad: `CLAUDE.md` lo dice al lado de la regla —*"Docs internos y
 *     politica de privacidad siguen siendo honestos sobre limites; la VENTA no"*—.
 *     Un contrato que no puede nombrar un limite es un contrato que miente, y el
 *     contrato publicado es fuente de verdad de la venta. La exencion se verifica
 *     contra las rutas del disco: si una deja de existir, el gate lo dice en vez de
 *     callarse una exencion huerfana.
 *
 *  2. «borrador» cuenta como obra solo si va con una marca de ESTADO al lado
 *     (pendiente, sin revisar, provisorio, en borrador...). Sin eso es el sustantivo
 *     de una capacidad viva: los agentes *"dejan un borrador esperando: a quien
 *     llamar, a quien cobrarle"*, y el contrato aclara que las sugerencias de IA
 *     *"son borradores que pueden contener errores"*. Prohibir la palabra suelta
 *     ponia en rojo CINCO pantallas sanas, y un gate que grita sobre lo que
 *     funciona se termina ignorando — que es como se pierde el rojo verdadero.
 *
 * COMO NO FALLA EN VERDE. Ninguna rama que no pudo medir sale limpia: una ruta que
 * no contesta, que responde != 200 o que llega sin texto sale por NO_PUDE_MEDIR.
 * `[]` es un dato y `null` la ausencia de dato. El self-check (`--self-check`) es
 * puro —no toca la red— y corre los casos en AMBAS direcciones: cada patron tiene
 * su caso que debe dar rojo Y su caso sano que debe seguir verde, incluidas las dos
 * exenciones y el `marketing-ia` real que lo trajo.
 *
 * NO se cuelga de `prebuild`: necesita red y produccion en pie, igual que sus tres
 * hermanos. Se corre cada vuelta del loop.
 *
 * Uso:
 *   node scripts/obra-viva.mjs
 *   node scripts/obra-viva.mjs --json
 *   node scripts/obra-viva.mjs --self-check     (puro, no toca produccion)
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { superficiesDeVenta } from "./rutas-de-venta.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const APP = join(AQUI, "..");
const BASE = process.env.ONIA_BASE_URL || "https://onia.com.bo";

/** La superficie servida no dice ni obra ni autobombo. */
export const LIMPIO = 0;
/** Un archivo nuestro escribe el texto prohibido: el defecto es del codigo. */
export const DEFECTO_NUESTRO = 1;
/** No se pudo medir. Nunca es verde: un gate que no corrio no es un gate que paso. */
export const NO_PUDE_MEDIR = 2;
/** El codigo ya esta limpio; produccion sirve un build viejo. Falta desplegar. */
export const SOLO_FALTA_DESPLEGAR = 3;

/**
 * Rutas que pueden nombrar un limite del producto, y por que.
 * Solo exime de OBRA. El autobombo sigue prohibido en toda la superficie.
 */
export const LEGALES_EXENTAS_DE_OBRA = new Map([
  ["/terminos", "el contrato publicado es fuente de verdad de la venta: tiene que poder nombrar un limite"],
  ["/privacidad", "CLAUDE.md: la politica de privacidad sigue siendo honesta sobre limites; la VENTA no"],
]);

/**
 * Obra a la vista. Cada patron con el defecto real que lo trajo.
 * `requiereEstado` marca los que solo cuentan acompanados de una marca de estado.
 */
export const OBRA = [
  { re: /muy pronto/g, caso: "los cinco «muy pronto» de la banda de Modulos (Sergio, 2026-08-20)" },
  { re: /proximamente/g, caso: "PROXIMAMENTE literal en el selector de rubros del wizard (2026-09-06)" },
  { re: /en construccion/g, caso: "CLAUDE.md lo prohibe por su nombre" },
  { re: /\bbeta\b/g, caso: "faltaba en obra-literal.test.ts hasta el 2026-09-26" },
  { re: /estamos construyendo|se esta construyendo/g, caso: "«el pack del rubro se esta construyendo» en /v1/comparativa (2026-09-04)" },
  { re: /todavia no lo hace|esto todavia no/g, caso: "el bloque «Y esto todavia no lo hace» servido por /v1/comparativa" },
  { re: /lista de espera/g, caso: "la nota de lista de espera del wizard (2026-09-06)" },
  { re: /en desarrollo|aun no esta (listo|disponible)/g, caso: "sinonimos de obra que las listas cortas dejaban pasar" },
  {
    re: /borrador/g,
    requiereEstado: true,
    caso: "la description de /terminos decia «(borrador, pendiente de revision por abogado)»",
  },
];

/** Marcas de estado que convierten «borrador» (una capacidad) en un cartel de obra. */
const ESTADO_CERCA = /pendiente|sin revisar|sin terminar|provisorio|provisional|en revision|no definitiv|revision por/;

/** Autobombo. Prohibido en TODA la superficie, incluidas las legales. */
export const BOMBO = [
  { re: /\blider(es|azgo)?\b/g, caso: "«Cero autobombo» de CLAUDE.md §3" },
  { re: /(el|la|los|las) mejor(es)?\b/g, caso: "«Cero autobombo»: se habla del negocio del cliente, no de nosotros" },
  { re: /revolucion(ari)?/g, caso: "la referencia es lety.ai y dapta.ai: beneficio, no epica" },
  { re: /numero 1|#1\b/g, caso: "superlativo sin respaldo: no hay clientes pagando" },
  { re: /somos (una |la )?(empresa |startup )?(nueva|joven|recien)/g, caso: "/servicios/marketing-ia, medido vivo el 2026-09-26" },
  { re: /no tenemos (un )?(muro de logos|casos de exito|clientes)/g, caso: "/servicios/marketing-ia: confesar la falta de clientes en la venta" },
  { re: /nuestro equipo|nuestras competencias/g, caso: "Sergio, 2026-09-03: «habla de nuestras competencias… cero autobombo»" },
];

/** Acentos fuera y todo a minuscula: el build escapa los acentos y el copy los mezcla. */
export function normalizar(s) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/**
 * El texto que el lead LEE: cuerpo visible + metadata.
 * Devuelve null si no hay texto — la ausencia de dato no es un dato limpio.
 */
export function textoQueLeeElLead(html) {
  if (typeof html !== "string" || html.trim() === "") return null;
  let h = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    // React parte las frases con <!-- -->: sin esto, «muy pronto» se esconde partido.
    .replace(/<!--[\s\S]*?-->/g, "");
  const head = h.match(/<head\b[\s\S]*?<\/head>/i);
  const meta = head ? [...head[0].matchAll(/content="([^"]*)"/g)].map((m) => m[1]).join(" ") : "";
  const cuerpo = h.replace(/<[^>]+>/g, " ");
  const texto = `${meta} ${cuerpo}`
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&(?:quot|#34);/g, '"')
    .replace(/&(?:#39|apos);/g, "'")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return texto === "" ? null : normalizar(texto);
}

/** Los hallazgos de una pantalla ya normalizada. `ruta` decide las exenciones. */
export function hallazgos(textoNormalizado, ruta) {
  const salida = [];
  const eximeObra = LEGALES_EXENTAS_DE_OBRA.has(ruta);
  const buscar = [
    ...(eximeObra ? [] : OBRA.map((p) => ({ ...p, clase: "obra" }))),
    ...BOMBO.map((p) => ({ ...p, clase: "autobombo" })),
  ];
  for (const patron of buscar) {
    for (const m of textoNormalizado.matchAll(patron.re)) {
      const desde = Math.max(0, m.index - 60);
      const cita = textoNormalizado.slice(desde, m.index + m[0].length + 60);
      // «borrador» sin marca de estado es una capacidad viva, no un cartel de obra.
      if (patron.requiereEstado && !ESTADO_CERCA.test(cita)) continue;
      salida.push({ clase: patron.clase, texto: m[0], cita, caso: patron.caso });
    }
  }
  return salida;
}

/**
 * ¿Algun archivo de cara al cliente escribe esta frase?
 * Sin comentarios y sin `*.test.ts`: los gates de obra citan los literales
 * prohibidos como fixture, y acusarlos manda a borrar la prueba de la regla.
 */
export function archivosQueLoEscriben(frase, raices = ["src", "content"]) {
  const aguja = normalizar(frase);
  const culpables = [];
  const recorrer = (dir) => {
    let entradas;
    try {
      entradas = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entradas) {
      const p = join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name === "node_modules" || e.name === ".next") continue;
        recorrer(p);
        continue;
      }
      if (!/\.(tsx?|mdx?|json|css)$/.test(e.name)) continue;
      if (/\.test\.tsx?$/.test(e.name)) continue;
      let crudo;
      try {
        crudo = readFileSync(p, "utf8");
      } catch {
        continue;
      }
      const sinComentarios = crudo
        .replace(/\/\*[\s\S]*?\*\//g, " ")
        .replace(/^\s*\/\/.*$/gm, " ")
        .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ");
      if (normalizar(sinComentarios.replace(/\s+/g, " ")).includes(aguja)) {
        culpables.push(p.slice(APP.length + 1));
      }
    }
  };
  for (const r of raices) {
    try {
      if (statSync(join(APP, r)).isDirectory()) recorrer(join(APP, r));
    } catch {
      /* raiz ausente: no inventa culpables */
    }
  }
  return culpables;
}

/* ------------------------------ self-check ------------------------------ */

function selfCheck() {
  const casos = [
    // Cada patron de obra, en su forma que DEBE dar rojo.
    ...OBRA.filter((p) => !p.requiereEstado).map((p) => ({
      nombre: `obra: ${p.re.source}`,
      ruta: "/",
      texto: `el modulo dental ${p.re.source.replace(/\\b|\(|\)|\?|\||\[|\]/g, " ").split(/\s+/)[0]} llega`,
      esperaRojo: true,
      // el texto sintetico se arma abajo, este caso se reemplaza
      saltear: true,
    })),
    { nombre: "muy pronto en el cuerpo", ruta: "/", texto: "el modulo de inventario llega muy pronto a tu cuenta", esperaRojo: true },
    { nombre: "proximamente sin acento", ruta: "/rubros", texto: "veterinaria proximamente", esperaRojo: true },
    { nombre: "proximamente CON acento", ruta: "/rubros", texto: "veterinaria próximamente", esperaRojo: true },
    { nombre: "beta", ruta: "/servicios/webs", texto: "mantenimiento simple: tu sitio al dia. (beta)", esperaRojo: true },
    { nombre: "en construccion", ruta: "/precios", texto: "esta seccion esta en construccion", esperaRojo: true },
    { nombre: "se esta construyendo", ruta: "/comparativa", texto: "el pack del rubro se esta construyendo", esperaRojo: true },
    { nombre: "todavia no lo hace", ruta: "/v1/comparativa", texto: "Y esto todavia no lo hace.", esperaRojo: true },
    { nombre: "lista de espera", ruta: "/v1/empezar", texto: "dejanos tu correo y entras a la lista de espera", esperaRojo: true },
    { nombre: "en desarrollo", ruta: "/agentes", texto: "el agente de cobranza esta en desarrollo", esperaRojo: true },

    // Autobombo, incluido el caso real que trajo este gate.
    {
      nombre: "el marketing-ia real, medido vivo el 2026-09-26",
      ruta: "/servicios/marketing-ia",
      texto:
        "Lo que no vas a encontrar aca. Somos una empresa nueva y lo decimos de frente: " +
        "no tenemos un muro de logos ni casos de exito con numeros espectaculares.",
      esperaRojo: true,
    },
    { nombre: "lider", ruta: "/nosotros", texto: "somos lideres en software de gestion", esperaRojo: true },
    { nombre: "el mejor", ruta: "/", texto: "el mejor sistema de Bolivia", esperaRojo: true },
    { nombre: "numero 1", ruta: "/", texto: "el numero 1 en clinicas", esperaRojo: true },
    { nombre: "nuestro equipo", ruta: "/nosotros", texto: "nuestro equipo de ingenieria trabaja para vos", esperaRojo: true },

    // Y ahora la otra direccion: lo SANO tiene que seguir verde.
    {
      nombre: "SANO: el titular vivo de la home",
      ruta: "/",
      texto: "Todo el negocio, en una pantalla. Clientes, caja y cobros en un solo sistema. Desde Bs 320 al mes.",
      esperaRojo: false,
    },
    {
      nombre: "SANO: «borrador» como capacidad de los agentes (5 pantallas)",
      ruta: "/agentes",
      texto: "revisan tus datos con el negocio cerrado y dejan un borrador esperando: a quien llamar, a quien cobrarle",
      esperaRojo: false,
    },
    {
      nombre: "ROJO: «borrador» CON marca de estado si es un cartel",
      ruta: "/",
      texto: "este documento es un borrador pendiente de revision por abogado",
      esperaRojo: true,
    },
    {
      nombre: "SANO: /terminos puede nombrar un limite (exenta de obra)",
      ruta: "/terminos",
      texto: "las sugerencias generadas por IA son borradores pendientes de revision que pueden contener errores",
      esperaRojo: false,
    },
    {
      nombre: "SANO: /privacidad puede nombrar un limite (exenta de obra)",
      ruta: "/privacidad",
      texto: "preparar borradores y sugerencias con IA dentro de tu cuenta y bajo tu aprobacion",
      esperaRojo: false,
    },
    {
      nombre: "ROJO: la exencion legal NO cubre autobombo",
      ruta: "/terminos",
      texto: "Onia es el lider del mercado boliviano y su contrato lo refleja",
      esperaRojo: true,
    },
    {
      nombre: "SANO: «mejor» hablando del negocio del cliente, no de nosotros",
      ruta: "/",
      texto: "vas a atender mejor a tus clientes",
      esperaRojo: false,
    },
    {
      nombre: "SANO: no hace falta que el lead tenga casos de exito",
      ruta: "/empezar",
      texto: "No hace falta que tengas casos de exito ni cartera de clientes para empezar.",
      esperaRojo: false,
    },
  ].filter((c) => !c.saltear);

  let fallos = 0;
  for (const c of casos) {
    const t = textoQueLeeElLead(`<html><head></head><body><p>${c.texto}</p></body></html>`);
    const hs = t === null ? [] : hallazgos(t, c.ruta);
    const rojo = hs.length > 0;
    if (rojo !== c.esperaRojo) {
      fallos += 1;
      console.log(`  ROJO-ESPERADO=${c.esperaRojo} obtenido=${rojo}  ${c.nombre}`);
      if (rojo) console.log(`      disparo: ${hs.map((h) => h.texto).join(", ")}`);
    }
  }

  // Un HTML sin texto no puede salir limpio: es ausencia de dato.
  if (textoQueLeeElLead("") !== null || textoQueLeeElLead("<html><body></body></html>") !== null) {
    fallos += 1;
    console.log("  el HTML vacio tiene que devolver null, no texto limpio");
  }

  // La metadata es texto de cliente que ninguna captura mira.
  const conMeta = textoQueLeeElLead(
    '<html><head><meta name="description" content="el modulo llega muy pronto"></head><body></body></html>',
  );
  if (!conMeta || hallazgos(conMeta, "/").length === 0) {
    fallos += 1;
    console.log("  la metadata no se esta mirando: un «muy pronto» en la description sale limpio");
  }

  // React parte las frases con <!-- -->: sin quitarlo, el literal se esconde.
  const partido = textoQueLeeElLead("<html><body><p>muy<!-- --> <!-- -->pronto</p></body></html>");
  if (!partido || hallazgos(partido, "/").length === 0) {
    fallos += 1;
    console.log("  un literal partido por los comentarios de React sale limpio");
  }

  // Las dos exenciones tienen que seguir existiendo como rutas del sitio.
  let rutas = [];
  try {
    rutas = superficiesDeVenta();
  } catch {
    rutas = [];
  }
  if (rutas.length > 0) {
    for (const r of LEGALES_EXENTAS_DE_OBRA.keys()) {
      if (!rutas.includes(r)) {
        fallos += 1;
        console.log(`  exencion huerfana: ${r} ya no es una superficie de venta del disco`);
      }
    }
  }

  // Y el buscador del arbol no puede acusar al fixture de un gate.
  const culpables = archivosQueLoEscriben("somos una empresa nueva y lo decimos de frente");
  if (culpables.length > 0) {
    fallos += 1;
    console.log(`  el buscador del arbol acusa archivos que solo lo citan: ${culpables.join(", ")}`);
  }

  console.log(
    fallos === 0
      ? `self-check OK (${casos.length} casos en ambas direcciones + metadata, HTML partido, exenciones y fixtures)`
      : `self-check ROJO: ${fallos} fallo(s)`,
  );
  return fallos;
}

/* ------------------------------- medicion ------------------------------- */

async function bajar(ruta) {
  const url = `${BASE}${ruta}`;
  try {
    const r = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(30_000),
      headers: { "user-agent": "onia-obra-viva/1.0" },
    });
    if (!r.ok) return { ruta, error: `HTTP ${r.status}` };
    return { ruta, texto: textoQueLeeElLead(await r.text()) };
  } catch (e) {
    return { ruta, error: e?.message || String(e) };
  }
}

async function medir() {
  const rutas = superficiesDeVenta();
  const paginas = [];
  for (const r of rutas) paginas.push(await bajar(r));

  const noMedidas = paginas.filter((p) => p.error || p.texto === null);
  const medidas = paginas.filter((p) => !p.error && p.texto !== null);

  const encontrados = [];
  for (const p of medidas) {
    for (const h of hallazgos(p.texto, p.ruta)) encontrados.push({ ...h, ruta: p.ruta });
  }

  // La frase se busca en el arbol por su ventana corta: un literal se muda de
  // archivo, pero si NADIE de cara al cliente lo escribe, el codigo ya esta bien.
  for (const h of encontrados) h.escritoEn = archivosQueLoEscriben(h.texto);

  const json = process.argv.includes("--json");
  const soloFaltaDesplegar = encontrados.length > 0 && encontrados.every((h) => h.escritoEn.length === 0);

  let codigo;
  if (encontrados.length > 0) codigo = soloFaltaDesplegar ? SOLO_FALTA_DESPLEGAR : DEFECTO_NUESTRO;
  else if (noMedidas.length > 0) codigo = NO_PUDE_MEDIR;
  else codigo = LIMPIO;

  if (json) {
    console.log(JSON.stringify({ base: BASE, medidas: medidas.length, noMedidas, encontrados, codigo }, null, 2));
    return codigo;
  }

  console.log(`Base: ${BASE}  ·  superficies de venta medidas: ${medidas.length}/${rutas.length}`);
  for (const p of noMedidas) console.log(`NO MEDIDA  ${p.ruta} — ${p.error || "llego sin texto"}`);

  if (encontrados.length === 0) {
    console.log(
      noMedidas.length > 0
        ? `\nNO MEDIDO: ${noMedidas.length} superficie(s) no contestaron. Un gate que no corrio no es un gate que paso.`
        : `\nLIMPIO: ninguna de las ${medidas.length} pantallas servidas dice obra ni se elogia sola.`,
    );
    return codigo;
  }

  console.log("");
  for (const h of encontrados) {
    console.log(`${h.clase.toUpperCase()}  ${h.ruta} — «${h.texto}»`);
    console.log(`     …${h.cita}…`);
    console.log(`     nacio de: ${h.caso}`);
    console.log(
      h.escritoEn.length > 0
        ? `     lo escribe: ${h.escritoEn.join(", ")}`
        : `     NINGUN archivo de cara al cliente lo escribe`,
    );
  }

  if (soloFaltaDesplegar) {
    console.log(
      "\nEL CODIGO YA ESTA LIMPIO — produccion sirve un build anterior al arreglo.\n" +
        "No hay nada que editar: el defecto muere cuando se publique. Confirmalo con\n" +
        "  npm run deploy:vivo\n" +
        "que dice si el publicador automatico ya lo tiene en camino o si el destino\n" +
        "quedo frenado por firma humana (lo unico que pide un pedido de deploy).",
    );
  } else {
    console.log(
      "\nDEFECTO NUESTRO: el texto vive en los archivos de arriba. Se arregla ahi,\n" +
        "y se barre la promesa en TODA la superficie, no solo donde salto.",
    );
  }
  return codigo;
}

if (process.argv.includes("--self-check")) {
  process.exit(selfCheck() === 0 ? 0 : 1);
} else {
  process.exit(await medir());
}
