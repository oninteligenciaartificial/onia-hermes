#!/usr/bin/env node
/**
 * Los precios que el sitio PUBLICA, cruzados contra los que el producto COBRA.
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

/** Las cifras del producto, aplanadas con el nombre con el que se le habla a Sergio. */
export function cifrasDelProducto({ planes, addons, prueba }) {
  const p = planesDelProducto(planes ?? "");
  const chatbot = bloqueExportado(addons ?? "", "WHATSAPP_ADDON");
  const reservas = bloqueExportado(addons ?? "", "BOOKING_ADDON_PRICE");
  const usuario = bloqueExportado(addons ?? "", "EXTRA_USER_ADDON_PRICE");
  const grupo = bloqueExportado(addons ?? "", "ENTERPRISE_PLAN_PRICE");
  const trial = prueba?.match(/TRIAL_PLAN\s*=\s*"([a-z]+)"/);

  return {
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

export function cifrasDelSitio({ precios, chatbot }) {
  const p = planesDelSitio(precios ?? "");
  const grupo = bloqueExportado(precios ?? "", "GRUPO");
  const agenda = bloqueExportado(precios ?? "", "AGENDA_ADDON");
  const usuario = bloqueExportado(precios ?? "", "USUARIO_EXTRA_ADDON");
  const prueba = bloqueExportado(precios ?? "", "PRUEBA");
  const planPrueba = prueba?.match(/planQueCorre:\s*"([^"]+)"/);
  const stacks = bloqueExportado(chatbot ?? "", "CHATBOT_STACKS");

  return {
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
    "add-on reservas online · mensual": num(agenda, "mensualAddon"),
    "add-on usuario extra · mensual": num(usuario, "mensualAddon"),
    "add-on usuario extra · máximo en Básico": num(usuario, "maxEnBasico"),
    "prueba gratis · días": num(prueba, "dias"),
    /** El producto lo nombra `professional`; el sitio, por su etiqueta. */
    "prueba gratis · plan que corre":
      { Pro: "professional", Básico: "basic", Full: "clinic" }[
        planPrueba?.[1]
      ] ?? planPrueba?.[1] ?? null,
  };
}

/* ─────────────────────────────────  el cruce  ────────────────────────────── */

/** Toda cifra que el sitio publica y el producto define. El verde las exige TODAS. */
export const CIFRAS = Object.keys(
  cifrasDelProducto({ planes: "", addons: "", prueba: "" }),
);

/**
 * Una cifra que no vino. `null` es "el patron no la encontro" y `undefined` es
 * "el lado ni siquiera trae la clave" — los DOS tienen que contar como ilegible.
 * Distinguirlos fue un fallo real de este archivo: con `=== null`, una clave
 * ausente no entraba ni en `ilegibles` ni en `difieren` y desaparecia del
 * veredicto, que es el modo de fallo exacto que este cruce viene a evitar.
 */
const falta = (v) => v === null || v === undefined;

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

  if (!planes || !addons || !prueba) {
    const faltan = [
      !planes && FUENTE_PLANES,
      !addons && FUENTE_ADDONS,
      !prueba && FUENTE_PRUEBA,
    ].filter(Boolean);
    console.error(
      `NO PUDE MEDIR: no pude leer ${faltan.join(", ")} del producto ` +
        `(ni en ${REPO_PRODUCTO} ni por SSH a ${VPS_SSH}).\n` +
        `Esto NO dice que los precios del sitio esten bien: dice que no se pudo cruzar.`,
    );
    process.exit(NO_PUDE_MEDIR);
  }

  const delProducto = cifrasDelProducto({ planes, addons, prueba });
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
      `ROJO: ${d.cifra} — el producto cobra ${d.producto} y el sitio publica ${d.sitio}.\n` +
        `  El lead ve un numero en la pantalla de venta y el checkout le cobra otro. ` +
        `Manda el producto (CLAUDE.md): se corrige el sitio, en src/lib/pricing.ts o src/content/chatbot-precios.ts.`,
    );
  }
  process.exit(DESALINEADO);
}
