#!/usr/bin/env node
/**
 * Lo que el sitio PROMETE, cruzado contra lo que el producto COBRA Y ENTREGA.
 *
 * Dos familias, y la segunda se agrego el 2026-09-06:
 *  a) los MONTOS (planes, add-ons, prueba) — se pagan mal en el checkout;
 *  b) los TOPES y los TIERS (cuantas fichas, cuantos usuarios, cuantos
 *     recordatorios, y desde que plan hay agentes, reservas o reportes) — se
 *     pagan mal DESPUES, cuando el cliente ya entro y le falta lo que la
 *     pantalla le prometio. `src/lib/pricing.ts` los escribe en PROSA dentro
 *     del `incluye` de cada plan, asi que hasta hoy no los cruzaba nadie: el
 *     dia que el producto mueva `patients` o `publicBookingIncluded` en
 *     `lib/plan-catalogo.ts`, el sitio sigue vendiendo el numero viejo con los
 *     566 tests en verde. Es el MISMO agujero que los montos, un campo mas
 *     abajo.
 *
 * POR QUE EXISTE. `precios.test.ts` y `precios-addons.test.ts` vigilan que
 * ninguna pantalla tipee un monto a mano: todas leen `src/lib/pricing.ts`. Eso
 * cubre la mitad del problema y esconde la otra — **valida la copia contra la
 * copia**. `src/lib/pricing.ts` NO es la fuente de los planes: es un segundo
 * juego de numeros, escrito en este repo, que hoy coincide con el del producto
 * por diligencia y no por construccion.
 *
 * CLAUDE.md lo dice sin ambiguedad: los planes los define
 * `onia-platform/lib/subscription-plans.ts` (`DEFAULT_PLAN_AMOUNTS`, "el que
 * valida el pago") y los add-ons `onia-platform/lib/pricing.ts`. "Ningun doc,
 * propuesta, one-pager ni cotizador define precio: lo LEEN de ahi. Si un
 * material dice otro numero, esta roto." El sitio es material.
 *
 * QUE SE ROMPE EL DIA QUE SE DESPEGUEN, y por que nadie lo vería: Sergio cambia
 * un plan en el archivo que valida el cobro, el sitio sigue publicando el monto
 * viejo, y **los 566 tests siguen verdes** — porque cada pantalla sigue leyendo
 * correctamente la copia. El lead ve un numero en la portada y el checkout le
 * cobra otro. Es exactamente el desastre con el que abre CLAUDE.md (cuatro
 * precios vivos del mismo chatbot al mismo tiempo), un escalon mas arriba: ahi
 * las copias estaban dentro de este repo y un grep las encontraba; aca la otra
 * copia vive en OTRO repo y ningun barrido de esta app la alcanza.
 *
 * POR QUE NO ES UN TEST DE `prebuild`. El producto es otro repositorio
 * (`/root/loops/onia-platform`) y no esta en este worktree. Un test que lo
 * exigiera se pondria rojo por AMBIENTE en toda maquina que no lo tenga —el
 * modo de fallo que este carril ya pago tres veces (worktree sin
 * node_modules, `pnpm` ausente, `npx tsc` pelado)— y colgar el deploy de un
 * repo vecino es peor que el agujero. Va como los otros cruces del carril
 * (`rubros-vivos`, `deploy-vivo`, `precios-vivos`): se corre cada vuelta.
 *
 * COMO NO FALLA EN VERDE. Es la trampa de esta familia. Si no se puede leer una
 * fuente, o si cambia de forma y los patrones dejan de matchear, "ningun monto
 * difiere" se leeria como sitio sano. Por eso el verde EXIGE haber leido las
 * `CIFRAS` completas de los dos lados: falta una y sale ROJO DE INSTRUMENTO
 * (codigo 2), nunca verde.
 *
 * Uso:
 *   node scripts/precios-fuente.mjs
 *   ONIA_PLATFORM_REPO=/otra/ruta node scripts/precios-fuente.mjs
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const COINCIDEN = 0;
export const DESALINEADO = 1;
export const NO_PUDE_MEDIR = 2;

/**
 * El repo del PRODUCTO. Se lee del disco local si esta, y si no por SSH al VPS:
 * este carril dejo de correr solo en el VPS el 2026-09-04 y un gate que asume
 * una ruta absoluta de alla deja de medir en silencio al mudarse.
 */
export const REPO_PRODUCTO =
  process.env.ONIA_PLATFORM_REPO ?? "/root/loops/onia-platform";
export const VPS_SSH = process.env.ONIA_VPS_SSH ?? "root@187.77.16.63";

/** Sin `BatchMode` un SSH sin llave se cuelga pidiendo contrasena y el cron muere por timeout. */
const SSH_ARGS = [
  "-o",
  "BatchMode=yes",
  "-o",
  "ConnectTimeout=8",
  "-o",
  "StrictHostKeyChecking=accept-new",
];

export const FUENTE_PLANES = "lib/subscription-plans.ts";
export const FUENTE_ADDONS = "lib/pricing.ts";
export const FUENTE_PRUEBA = "lib/subscription/plan-state.ts";
/**
 * Los TOPES y las capacidades por plan (`PLAN_LIMITS`). Es la otra mitad del
 * mismo agujero: `pricing.ts` del sitio no solo copia los montos, tambien
 * copia —en prosa, dentro de `incluye`— cuantas fichas entran, cuantos
 * usuarios y desde que plan hay agentes, reservas o reportes. El monto ya se
 * cruzaba; el tope no lo cruzaba nadie.
 */
export const FUENTE_LIMITES = "lib/plan-catalogo.ts";

/** Los tres planes comprables, con el nombre que les da cada lado. */
export const PLANES_EN_ORDEN = [
  { producto: "basic", sitio: "basico", etiqueta: "Básico" },
  { producto: "professional", sitio: "pro", etiqueta: "Pro" },
  { producto: "clinic", sitio: "full", etiqueta: "Full" },
];

export function leerLocal(ruta) {
  return existsSync(ruta) ? readFileSync(ruta, "utf8") : null;
}

export function leerPorSsh(ruta, destino = VPS_SSH) {
  const r = spawnSync("ssh", [...SSH_ARGS, destino, "cat", ruta], {
    encoding: "utf8",
  });
  return r.status === 0 && r.stdout ? r.stdout : null;
}

export function leerDelProducto(
  relativa,
  { repo = REPO_PRODUCTO, local = leerLocal, remoto = leerPorSsh } = {},
) {
  const ruta = join(repo, relativa);
  return local(ruta) ?? remoto(ruta);
}

/* ─────────────────────────  lado PRODUCTO (la fuente)  ───────────────────── */

/** Un `clave: 123` dentro de un trozo de codigo. `null` si no esta. */
function num(trozo, clave) {
  const m = trozo?.match(new RegExp(`\\b${clave}:\\s*(\\d+)`));
  return m ? Number(m[1]) : null;
}

/**
 * Como `num`/el match literal, pero siguiendo UNA indirección: si la clave
 * apunta a un identificador (`dias: PRUEBA_DIAS`) en vez de a un literal, va a
 * buscar su `const PRUEBA_DIAS = …` al archivo entero.
 *
 * Existe porque el lector se quedó ciego el día que el valor pasó de literal a
 * constante (2026-09-06, al hacer que las tres tarjetas leyeran la nota de la
 * prueba de una sola fuente). Ese es el modo de falla de esta familia: el cruce
 * no grita, devuelve `null` y —de no ser por la guarda de ilegibles— cantaría
 * "ninguna cifra difiere". Resolver la indirección deja pasar las dos formas.
 */
function valorResuelto(trozo, clave, archivo, { texto = false } = {}) {
  const literal = texto ? `"([^"]+)"` : `(\\d+)`;
  const directo = trozo?.match(new RegExp(`\\b${clave}:\\s*${literal}`));
  if (directo) return texto ? directo[1] : Number(directo[1]);

  const porNombre = trozo?.match(new RegExp(`\\b${clave}:\\s*([A-Za-z_$][\\w$]*)`));
  if (!porNombre) return null;

  const decl = archivo?.match(
    new RegExp(`\\bconst\\s+${porNombre[1]}\\s*=\\s*${literal}`),
  );
  if (!decl) return null;
  return texto ? decl[1] : Number(decl[1]);
}

/**
 * El cuerpo de un `export const <nombre>`, hasta el proximo `export`. Alcanza
 * porque solo se leen claves numericas propias de cada bloque.
 */
export function bloqueExportado(fuente, nombre) {
  const i = fuente.indexOf(`export const ${nombre}`);
  if (i < 0) return null;
  const resto = fuente.slice(i + 1);
  const fin = resto.indexOf("\nexport ");
  return fin < 0 ? resto : resto.slice(0, fin);
}

/** `DEFAULT_PLAN_AMOUNTS`: el archivo que valida el pago. */
export function planesDelProducto(fuente) {
  const bloque = bloqueExportado(fuente, "DEFAULT_PLAN_AMOUNTS");
  if (!bloque) return {};
  const salida = {};
  for (const m of bloque.matchAll(
    /\b(basic|professional|clinic|enterprise):\s*\{([^}]*)\}/g,
  )) {
    salida[m[1]] = {
      mensual: num(m[2], "monthly"),
      semanal: num(m[2], "weekly"),
      anual: num(m[2], "annual"),
    };
  }
  return salida;
}

/** Un `clave: 123` que ADEMAS puede ser `-1` (el codigo del producto para "ilimitado"). */
function entero(trozo, clave) {
  const m = trozo?.match(new RegExp(`\\b${clave}:\\s*(-?\\d+)`));
  return m ? Number(m[1]) : null;
}

/** Un `clave: true|false`. `null` si la clave no esta. */
function booleano(trozo, clave) {
  const m = trozo?.match(new RegExp(`\\b${clave}:\\s*(true|false)`));
  return m ? m[1] === "true" : null;
}

/**
 * `PLAN_LIMITS`: los topes que el producto APLICA (`checkPatientLimit` y
 * companía salen de aca). Cada plan es un objeto plano, asi que `[^}]*` alcanza.
 */
export function limitesDelProducto(fuente) {
  const bloque = bloqueExportado(fuente ?? "", "PLAN_LIMITS");
  if (!bloque) return {};
  const salida = {};
  for (const m of bloque.matchAll(
    /\b(basic|professional|clinic):\s*\{([^}]*)\}/g,
  )) {
    salida[m[1]] = {
      fichas: entero(m[2], "patients"),
      usuarios: entero(m[2], "users"),
      recordatorios: entero(m[2], "emailsPerMonth"),
      agentes: booleano(m[2], "agentsIncluded"),
      reservas: booleano(m[2], "publicBookingIncluded"),
      reportes: booleano(m[2], "reportsEnabled"),
    };
  }
  return salida;
}

/**
 * El primer plan (de barato a caro) que enciende `capacidad`, con el id del
 * producto. Es la forma de cruzar un tier sin depender de como lo redacta cada
 * lado: al sitio se le pregunta "cual es el primero que lo NOMBRA" y al
 * producto "cual es el primero que lo tiene en `true`". `null` si ninguno.
 */
export function primerPlanCon(porPlan, capacidad) {
  for (const p of PLANES_EN_ORDEN) {
    const v = porPlan[p.producto]?.[capacidad];
    if (v === true) return p.producto;
    if (v === null || v === undefined) return null; // ilegible: no se adivina
  }
  return null;
}

/**
 * Los tres topes de cada plan, con la MISMA clave de los dos lados. `-1` es
 * "ilimitado" y es un valor legitimo, no un dato que falte.
 */
function topesAplanados(porPlan) {
  const salida = {};
  for (const p of PLANES_EN_ORDEN) {
    salida[`plan ${p.etiqueta} · fichas`] = porPlan[p.producto]?.fichas ?? null;
    salida[`plan ${p.etiqueta} · usuarios`] =
      porPlan[p.producto]?.usuarios ?? null;
    salida[`plan ${p.etiqueta} · recordatorios por mes`] =
      porPlan[p.producto]?.recordatorios ?? null;
  }
  return salida;
}

/** Las cifras del producto, aplanadas con el nombre con el que se le habla a Sergio. */
export function cifrasDelProducto({ planes, addons, prueba, limites }) {
  const p = planesDelProducto(planes ?? "");
  const chatbot = bloqueExportado(addons ?? "", "WHATSAPP_ADDON");
  const reservas = bloqueExportado(addons ?? "", "BOOKING_ADDON_PRICE");
  const usuario = bloqueExportado(addons ?? "", "EXTRA_USER_ADDON_PRICE");
  const grupo = bloqueExportado(addons ?? "", "ENTERPRISE_PLAN_PRICE");
  const trial = prueba?.match(/TRIAL_PLAN\s*=\s*"([a-z]+)"/);
  const l = limitesDelProducto(limites ?? "");

  return {
    ...topesAplanados(l),
    "primer plan con agentes de IA": primerPlanCon(l, "agentes"),
    "primer plan con reservas online incluidas": primerPlanCon(l, "reservas"),
    "primer plan con reportes completos": primerPlanCon(l, "reportes"),
    "plan Básico · mensual": p.basic?.mensual ?? null,
    "plan Básico · semanal": p.basic?.semanal ?? null,
    "plan Básico · anual": p.basic?.anual ?? null,
    "plan Pro · mensual": p.professional?.mensual ?? null,
    "plan Pro · semanal": p.professional?.semanal ?? null,
    "plan Pro · anual": p.professional?.anual ?? null,
    "plan Full · mensual": p.clinic?.mensual ?? null,
    "plan Full · anual": p.clinic?.anual ?? null,
    "Grupo / Empresarial · mensual": p.enterprise?.mensual ?? null,
    "Grupo / Empresarial · anual": p.enterprise?.anual ?? null,
    "Grupo / Empresarial · implementación desde": num(grupo, "setupFrom"),
    "add-on chatbot · mensual": num(chatbot, "entryMonthly"),
    "add-on chatbot · anual": num(chatbot, "annualTotal"),
    /**
     * El cupo que el producto CORTA: `lib/chatbot/cupo.ts` lo lee de acá para
     * decidir `agotada`, y al agotarse el bot deriva la conversación a una
     * persona. Faltaba en este cruce, y ese hueco es lo que dejó al sitio
     * vender el chatbot sin nombrar su límite hasta el 2026-09-06: el dueño se
     * enteraba pagando, cuando sus clientes recibían «se agotaron».
     */
    "add-on chatbot · conversaciones por mes": num(chatbot, "includedConversations"),
    "add-on reservas online · mensual": num(reservas, "monthly"),
    "add-on usuario extra · mensual": num(usuario, "monthly"),
    "add-on usuario extra · máximo en Básico": num(usuario, "basicMaxSeats"),
    /** Los dos del trial son `export const X = ...`, no una clave de objeto. */
    "prueba gratis · días": Number(
      prueba?.match(/TRIAL_DAYS\s*=\s*(\d+)/)?.[1] ?? NaN,
    ) || null,
    "prueba gratis · plan que corre": trial ? trial[1] : null,
  };
}

/* ──────────────────────────  lado SITIO (la copia)  ──────────────────────── */

/**
 * Los planes de `src/lib/pricing.ts`. No se puede cortar por llaves: los
 * `incluye` traen plantillas con `${...}`, asi que el bloque se delimita por el
 * `id:` del plan siguiente.
 */
export function planesDelSitio(fuente) {
  const marcas = [...fuente.matchAll(/\bid:\s*"(basico|pro|full)"/g)];
  const salida = {};
  marcas.forEach((m, i) => {
    const hasta = i + 1 < marcas.length ? marcas[i + 1].index : fuente.length;
    const trozo = fuente.slice(m.index, hasta);
    salida[m[1]] = {
      mensual: num(trozo, "mensual"),
      semanal: num(trozo, "semanal"),
      anual: num(trozo, "anual"),
    };
  });
  return salida;
}

/**
 * Lo que el plan DICE que incluye, sin su `sinEsto`.
 *
 * El corte importa: el Básico nombra "Agentes de IA" y "Reservas online" en su
 * `sinEsto` justamente para decir que NO los trae. Buscar la capacidad en el
 * plan entero daria "el Básico ya tiene agentes" — el gate leeria la negacion
 * como promesa y saldria verde al reves.
 */
export function incluyeDelSitio(trozo) {
  const desde = trozo.indexOf("incluye:");
  if (desde < 0) return null;
  const hasta = trozo.indexOf("sinEsto:", desde);
  return trozo.slice(desde, hasta < 0 ? trozo.length : hasta);
}

/**
 * Un tope escrito en prosa. `ilimitado` gana sobre el numero porque el texto
 * del Full no trae cifra ("Usuarios ilimitados"), y devolver `null` ahi
 * apagaria el cruce de los otros dos planes.
 */
function topeEnProsa(texto, { ilimitado, conNumero }) {
  if (texto === null || texto === undefined) return null;
  if (ilimitado.test(texto)) return -1;
  const m = texto.match(conNumero);
  return m ? Number(m[1].replace(/\./g, "")) : null;
}

/** Los topes que el sitio PUBLICA, leidos del `incluye` de cada plan. */
export function limitesDelSitio(fuente) {
  const marcas = [...fuente.matchAll(/\bid:\s*"(basico|pro|full)"/g)];
  const salida = {};
  marcas.forEach((m, i) => {
    const hasta = i + 1 < marcas.length ? marcas[i + 1].index : fuente.length;
    const inc = incluyeDelSitio(fuente.slice(m.index, hasta));
    salida[m[1]] = {
      fichas: topeEnProsa(inc, {
        ilimitado: /fichas[^"]*ilimitad/i,
        conNumero: /([\d.]+)\s+fichas/i,
      }),
      usuarios: topeEnProsa(inc, {
        ilimitado: /usuarios\s+ilimitad/i,
        /** El Básico escribe su linea como plantilla, asi que abre con backtick. */
        conNumero: /(?:^|["`\s])(\d[\d.]*)\s+usuarios/i,
      }),
      recordatorios: topeEnProsa(inc, {
        ilimitado: /recordatorios[^"]*sin\s+tope/i,
        conNumero: /([\d.]+)\s+recordatorios/i,
      }),
      /** El tier se cruza por quien lo NOMBRA primero; la herencia textual
       *  ("Todo lo del Pro") no estorba porque solo importa el primero. */
      agentes: /\bAgente\s+[A-Z]/.test(inc ?? "") || null,
      reservas: /Reservas\s+online\s+incluidas/i.test(inc ?? "") || null,
      reportes: /Reportes\s+completos/i.test(inc ?? "") || null,
    };
  });
  return salida;
}

/**
 * El mismo `primerPlanCon` del lado producto, pero traduciendo los ids del
 * sitio a los del producto para que las dos respuestas sean comparables.
 */
function primerPlanDelSitioCon(porPlan, capacidad) {
  if (PLANES_EN_ORDEN.some((p) => !porPlan[p.sitio])) return null;
  for (const p of PLANES_EN_ORDEN) {
    if (porPlan[p.sitio]?.[capacidad] === true) return p.producto;
  }
  return null;
}

export function cifrasDelSitio({ precios, chatbot }) {
  const p = planesDelSitio(precios ?? "");
  const grupo = bloqueExportado(precios ?? "", "GRUPO");
  const agenda = bloqueExportado(precios ?? "", "AGENDA_ADDON");
  const usuario = bloqueExportado(precios ?? "", "USUARIO_EXTRA_ADDON");
  const prueba = bloqueExportado(precios ?? "", "PRUEBA");
  const planPrueba = valorResuelto(prueba, "planQueCorre", precios ?? "", { texto: true });
  const stacks = bloqueExportado(chatbot ?? "", "CHATBOT_STACKS");
  const ls = limitesDelSitio(precios ?? "");
  /** Re-llavado al id del producto para que las claves salgan identicas. */
  const lsPorProducto = Object.fromEntries(
    PLANES_EN_ORDEN.map((p) => [p.producto, ls[p.sitio]]),
  );

  return {
    ...topesAplanados(lsPorProducto),
    "primer plan con agentes de IA": primerPlanDelSitioCon(ls, "agentes"),
    "primer plan con reservas online incluidas": primerPlanDelSitioCon(
      ls,
      "reservas",
    ),
    "primer plan con reportes completos": primerPlanDelSitioCon(ls, "reportes"),
    "plan Básico · mensual": p.basico?.mensual ?? null,
    "plan Básico · semanal": p.basico?.semanal ?? null,
    "plan Básico · anual": p.basico?.anual ?? null,
    "plan Pro · mensual": p.pro?.mensual ?? null,
    "plan Pro · semanal": p.pro?.semanal ?? null,
    "plan Pro · anual": p.pro?.anual ?? null,
    "plan Full · mensual": p.full?.mensual ?? null,
    "plan Full · anual": p.full?.anual ?? null,
    "Grupo / Empresarial · mensual": num(grupo, "mensual"),
    "Grupo / Empresarial · anual": num(grupo, "anual"),
    "Grupo / Empresarial · implementación desde": num(
      grupo,
      "implementacionDesde",
    ),
    "add-on chatbot · mensual": num(stacks, "mensual"),
    "add-on chatbot · anual": num(stacks, "anual"),
    /** `export const X = N`, no una clave de objeto — como los del trial. */
    "add-on chatbot · conversaciones por mes":
      Number(chatbot?.match(/CONVERSACIONES_INCLUIDAS\s*=\s*(\d+)/)?.[1] ?? NaN) || null,
    "add-on reservas online · mensual": num(agenda, "mensualAddon"),
    "add-on usuario extra · mensual": num(usuario, "mensualAddon"),
    "add-on usuario extra · máximo en Básico": num(usuario, "maxEnBasico"),
    "prueba gratis · días": valorResuelto(prueba, "dias", precios),
    /** El producto lo nombra `professional`; el sitio, por su etiqueta. */
    "prueba gratis · plan que corre":
      { Pro: "professional", Básico: "basic", Full: "clinic" }[planPrueba] ??
      planPrueba ??
      null,
  };
}

/* ─────────────────────────────────  el cruce  ────────────────────────────── */

/** Toda cifra que el sitio publica y el producto define. El verde las exige TODAS. */
export const CIFRAS = Object.keys(
  cifrasDelProducto({ planes: "", addons: "", prueba: "", limites: "" }),
);

/**
 * Una cifra que no vino. `null` es "el patron no la encontro" y `undefined` es
 * "el lado ni siquiera trae la clave" — los DOS tienen que contar como ilegible.
 * Distinguirlos fue un fallo real de este archivo: con `=== null`, una clave
 * ausente no entraba ni en `ilegibles` ni en `difieren` y desaparecia del
 * veredicto, que es el modo de fallo exacto que este cruce viene a evitar.
 */
const falta = (v) => v === null || v === undefined;

/**
 * Separa las dos familias de cifra para no describir mal el defecto. Un monto
 * desalineado se paga en el checkout; un tope o un tier desalineado se paga
 * DESPUES, cuando el cliente ya entro y le falta lo que la pantalla prometia.
 * Mandar a arreglar el archivo equivocado es como se dan por cerrados los bugs
 * que siguen vivos.
 */
export const esPromesa = (cifra) =>
  /· fichas$|· usuarios$|· recordatorios por mes$|· conversaciones por mes$/.test(cifra) ||
  cifra.startsWith("primer plan con");

/** Puro: sin red y sin disco, para poder probarlo con casos que hoy no existen. */
export function comparar(delProducto, delSitio) {
  const ilegibles = CIFRAS.filter(
    (k) => falta(delProducto[k]) || falta(delSitio[k]),
  );
  const difieren = CIFRAS.filter(
    (k) =>
      !falta(delProducto[k]) &&
      !falta(delSitio[k]) &&
      delProducto[k] !== delSitio[k],
  ).map((k) => ({ cifra: k, producto: delProducto[k], sitio: delSitio[k] }));
  return { ilegibles, difieren };
}

const AQUI = dirname(fileURLToPath(import.meta.url));
export const PRECIOS_SITIO = join(AQUI, "..", "src", "lib", "pricing.ts");
export const CHATBOT_SITIO = join(
  AQUI,
  "..",
  "src",
  "content",
  "chatbot-precios.ts",
);

/**
 * La guarda de ejecucion directa. Sin esto, importar cualquier funcion de arriba
 * dispara la medicion y un `process.exit()` que mata al proceso que importa —
 * medido el 2026-09-03 en otro gate de este sistema.
 */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const planes = leerDelProducto(FUENTE_PLANES);
  const addons = leerDelProducto(FUENTE_ADDONS);
  const prueba = leerDelProducto(FUENTE_PRUEBA);
  const limites = leerDelProducto(FUENTE_LIMITES);

  if (!planes || !addons || !prueba || !limites) {
    const faltan = [
      !planes && FUENTE_PLANES,
      !addons && FUENTE_ADDONS,
      !prueba && FUENTE_PRUEBA,
      !limites && FUENTE_LIMITES,
    ].filter(Boolean);
    console.error(
      `NO PUDE MEDIR: no pude leer ${faltan.join(", ")} del producto ` +
        `(ni en ${REPO_PRODUCTO} ni por SSH a ${VPS_SSH}).\n` +
        `Esto NO dice que los precios del sitio esten bien: dice que no se pudo cruzar.`,
    );
    process.exit(NO_PUDE_MEDIR);
  }

  const delProducto = cifrasDelProducto({ planes, addons, prueba, limites });
  const delSitio = cifrasDelSitio({
    precios: readFileSync(PRECIOS_SITIO, "utf8"),
    chatbot: readFileSync(CHATBOT_SITIO, "utf8"),
  });
  const { ilegibles, difieren } = comparar(delProducto, delSitio);

  if (ilegibles.length > 0) {
    console.error(
      `NO PUDE MEDIR: ${ilegibles.length} de ${CIFRAS.length} cifra(s) no se pudieron leer ` +
        `de los dos lados, asi que el cruce esta ciego justo ahi:\n` +
        ilegibles
          .map(
            (k) =>
              `  · ${k} — producto: ${delProducto[k] ?? "no la encontre"} · sitio: ${delSitio[k] ?? "no la encontre"}`,
          )
          .join("\n") +
        `\nAlgun archivo cambio de forma y los patrones dejaron de matchear. ` +
        `Arreglar el parser ANTES de creerle a un verde.`,
    );
    process.exit(NO_PUDE_MEDIR);
  }

  if (difieren.length === 0) {
    console.log(
      `VERDE: las ${CIFRAS.length} cifras que publica el sitio son las que cobra el producto.`,
    );
    process.exit(COINCIDEN);
  }

  for (const d of difieren) {
    console.error(
      esPromesa(d.cifra)
        ? `ROJO: ${d.cifra} — el producto entrega ${d.producto} y el sitio promete ${d.sitio}.\n` +
          `  El lead paga esperando lo que dice la pantalla y el producto le da otra cosa. ` +
          `Manda el producto (CLAUDE.md): se corrige el sitio, en el \`incluye\` del plan en src/lib/pricing.ts.`
        : `ROJO: ${d.cifra} — el producto cobra ${d.producto} y el sitio publica ${d.sitio}.\n` +
          `  El lead ve un numero en la pantalla de venta y el checkout le cobra otro. ` +
          `Manda el producto (CLAUDE.md): se corrige el sitio, en src/lib/pricing.ts o src/content/chatbot-precios.ts.`,
    );
  }
  process.exit(DESALINEADO);
}
