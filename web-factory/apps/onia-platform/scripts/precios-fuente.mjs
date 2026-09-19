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
/**
 * QUIEN vende usuarios extra y hasta cuantos (`topeDe`). Es el eje que ni el monto ni el tope
 * alcanzan: `basicMaxSeats` ya se cruzaba como cifra desde siempre, y aun asi el sitio publicaba
 * el add-on como si fuera cosa del Basico — el producto lo vende tambien en Crece y Profesional,
 * ahi SIN TOPE, y esa frase mandaba al de Profesional a pagar Bs 1.290 por algo que le costaba
 * Bs 960. Un ALCANCE no es una cifra, asi que no lo miraba ningun cruce (2026-09-19).
 */
export const FUENTE_ASIENTOS = "lib/asientos.ts";

/**
 * Los planes comprables, con el nombre que les da cada lado, DE BARATO A CARO
 * (el orden es el que contestan los tiers: "primer plan con X").
 *
 * `crece` entro el 2026-09-12 con la escalera C. Su alta dejo ver que esta
 * lista NO era la unica: los mismos ids estaban tipeados a mano en tres
 * regex `id:"(basico|pro|full)"` mas abajo, asi que el plan nuevo nacio MUDO —
 * `planesDelSitio`, `limitesDelSitio` y `numerosPublicados` lo saltaban sin
 * decir nada, y un escalon entero (Bs 550/145/5.500 y sus tres topes) quedo
 * publicado sin cruzar contra el producto. Es la lista de inclusion de
 * siempre: no basta con derivar el universo del disco si despues se lo filtra
 * con ids escritos a dedo. Por eso los tres regex ahora SALEN de aca
 * (`IDS_DEL_SITIO`) y el plan que entre manana entra solo.
 */
export const PLANES_EN_ORDEN = [
  { producto: "basic", sitio: "basico", etiqueta: "Básico" },
  { producto: "crece", sitio: "crece", etiqueta: "Crece" },
  { producto: "professional", sitio: "pro", etiqueta: "Profesional" },
  { producto: "clinic", sitio: "full", etiqueta: "Completo" },
];

/**
 * El quinto plan: el que el sitio publica CON PRECIO pero no vende en linea.
 *
 * Va aparte de `PLANES_EN_ORDEN` porque no es una tarjeta de la escalera —no tiene `id:` en
 * `src/lib/pricing.ts`, es la constante `GRUPO`— y meterlo en esa lista rompe los tres regex
 * que derivan de ella (`IDS_DEL_SITIO` buscaria `id: "grupo"`, que no existe). Pero existe para
 * el cliente: Bs 2.900/mes y Bs 29.000 al anio, una seccion entera de `/precios`, una linea en
 * la home, y el recomendador de `/v1/empezar` se lo propone a todo equipo de 15+.
 *
 * 🔴 Que no estuviera declarado en ningun lado es lo que dejo pasar el defecto del 2026-09-19:
 * `inclusion-chatbot.mjs` daba por «plan que el sitio no vende» a `enterprise` —con el motivo
 * escrito, y sonaba cierto— y por eso degradaba a AVISO que el sitio le dijera «en los demas
 * planes va aparte, Bs 390/mes» a un plan que trae el chatbot pagado adentro.
 *
 * La `etiqueta` es como lo llama EL SITIO, no el producto: el producto lo llama «Empresa», que
 * es palabra corriente del castellano y buscarla en la prosa lo da por nombrado en cualquier
 * pagina que hable de «tu empresa».
 */
export const PLAN_COTIZADO = {
  producto: "enterprise",
  sitio: "GRUPO",
  etiqueta: "Grupo / Empresarial",
};

/**
 * El `id:"..."` con que `src/lib/pricing.ts` abre cada plan, derivado de la
 * lista de arriba. Se construye uno nuevo en cada llamada: un `RegExp` con `g`
 * guarda `lastIndex`, y compartir la instancia entre `matchAll` haria que la
 * segunda lectura empiece donde termino la primera.
 */
export const IDS_DEL_SITIO = () =>
  new RegExp(`\\bid:\\s*"(${PLANES_EN_ORDEN.map((p) => p.sitio).join("|")})"`, "g");

/**
 * Cada `plan: { ... }` que un bloque del PRODUCTO declara, sin filtrar por una
 * lista de ids. Nace de la escalera C (2026-09-12): la lista de inclusion se
 * habia sacado de tres regex, pero quedaban DOS mas escritas a mano aca
 * (`basic|professional|clinic`), asi que `crece` se leia como "ese plan no
 * existe" y `primerPlanCon` devolvia `null` — o sea el cruce quedaba CIEGO
 * justo en el plan nuevo, que es como nacen estos huecos. Filtrar por PLANES_EN_ORDEN
 * tampoco sirve: el producto tiene planes que el sitio no vende (`enterprise`)
 * y perderlos aca los borraria del cruce. El universo se deriva del bloque;
 * quien elige a quien se le pregunta es `primerPlanCon`, mas abajo.
 * Instancia nueva por llamada: un `RegExp` con `g` guarda `lastIndex`.
 */
export const PLANES_QUE_DECLARA_EL_BLOQUE = () =>
  /\b([A-Za-z_$][\w$]*):\s*\{([^}]*)\}/g;

export function leerLocal(ruta) {
  return existsSync(ruta) ? readFileSync(ruta, "utf8") : null;
}

export function leerPorSsh(ruta, destino = VPS_SSH) {
  const r = spawnSync("ssh", [...SSH_ARGS, destino, "cat", ruta], {
    encoding: "utf8",
  });
  return r.status === 0 && r.stdout ? r.stdout : null;
}

/**
 * La rama del PRODUCTO contra la que se cruza. Es `master`, no `main`.
 */
export const REF_PRODUCTO = process.env.ONIA_PLATFORM_REF ?? "origin/master";

/**
 * El archivo leido del REF, no del arbol de trabajo.
 *
 * POR QUE. Hasta el 2026-09-12 el cruce leia `join(repo, relativa)` — la
 * CARPETA del clon — y nadie la mantiene al dia: medida ese dia, estaba 15
 * commits atras de `origin/master`, sin el plan `crece` y con los montos
 * viejos (750/1.500 en vez de 890/1.290). Las dos direcciones en que eso
 * miente son distintas y la segunda es la cara:
 *  · el clon NO tiene el dato -> "no la encontre" -> NO PUDE MEDIR (honesto,
 *    pero el cruce queda ciego para siempre y nadie se entera);
 *  · el clon tiene el dato VIEJO -> DESALINEADO acusando al SITIO de publicar
 *    mal un precio que es el correcto, y manda a "arreglarlo" hacia atras.
 * Un `git fetch` garantiza el ref fresco aunque la carpeta lleve meses quieta,
 * asi que se pregunta al ref y el arbol queda de respaldo.
 */
export function leerDelRef(relativa, { repo = REPO_PRODUCTO, ref = REF_PRODUCTO } = {}) {
  const r = spawnSync("git", ["-C", repo, "show", `${ref}:${relativa}`], {
    encoding: "utf8",
  });
  return r.status === 0 && r.stdout ? r.stdout : null;
}

/**
 * Pone el ref al dia. Si no se puede, se DICE: un cruce contra un ref viejo se
 * ve identico a uno contra el ref fresco, y esa es justo la falla que este
 * archivo no se puede permitir.
 */
export function refreshRef({ repo = REPO_PRODUCTO } = {}) {
  const r = spawnSync("git", ["-C", repo, "fetch", "origin", "--quiet"], {
    encoding: "utf8",
    timeout: 60_000,
  });
  return r.status === 0;
}

/**
 * El codigo sin sus comentarios, respetando comillas (`https://` no es un
 * comentario) y conservando los saltos de linea.
 *
 * QUE AGUJERO TAPA, y por que es el punto de LECTURA y no una funcion suelta.
 * Todo este cruce parsea con expresiones regulares sobre el TEXTO del archivo,
 * y un comentario es texto: para los patrones es indistinguible del codigo. Eso
 * rompe en las DOS direcciones, y la cara es la que mordio.
 *
 *  · ACUSA a codigo sano (medido el 2026-09-10, primer rojo de este gate):
 *    `planQueElSitioPrometeParaExportar` toma la frase que promete el export y
 *    busca si NOMBRA un plan. El commit que arreglo esa frase dejo arriba el
 *    comentario que explica por que —"…y la prueba corre con Pro"—, el trozo
 *    que el gate juzga arranca antes de las comillas, y el cruce leyo `Pro`.
 *    Veredicto: "el producto cobra basic y el sitio publica professional", con
 *    el sitio diciendo exactamente lo correcto. Y el mensaje manda a "corregir
 *    el sitio": obedecerlo era volver a poner la condicion que le niega al
 *    cliente sus propios datos, que es el defecto que ese commit habia cerrado.
 *  · ABSUELVE un defecto vivo: `limitesDelSitio` decide el tier por quien lo
 *    NOMBRA primero, asi que un comentario dentro del `incluye` del Basico que
 *    diga "Reportes completos" lo da por incluido; y `numerosPublicados` cuenta
 *    como publicado cualquier numero de un comentario.
 *
 * Va aca —y en `leerDelSitio`— porque un filtro por funcion vuelve a abrir el
 * agujero con el patron siguiente que alguien agregue: son las DOS puertas por
 * las que entra texto a este archivo, y despues de ellas ya no hay comentarios
 * que puedan mentir.
 */
export function sinComentarios(fuente) {
  let salida = "";
  let i = 0;
  let comilla = null;

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
      i = fin === -1 ? fuente.length : fin; // el \n lo copia la vuelta siguiente
      continue;
    }

    if (par === "/*") {
      const fin = fuente.indexOf("*/", i + 2);
      const hasta = fin === -1 ? fuente.length : fin + 2;
      /** Espacios, menos los saltos: la linea que reporta el gate no se corre. */
      salida += fuente.slice(i, hasta).replace(/[^\n]/g, " ");
      i = hasta;
      continue;
    }

    salida += c;
    i += 1;
  }

  return salida;
}

export function leerDelProducto(
  relativa,
  { repo = REPO_PRODUCTO, ref = leerDelRef, local = leerLocal, remoto = leerPorSsh } = {},
) {
  const ruta = join(repo, relativa);
  // El REF primero: es el unico de los tres que no depende de que alguien haya
  // actualizado una carpeta a mano. El arbol local y el SSH quedan de respaldo
  // para la maquina que no tenga el clon.
  const crudo = ref(relativa, { repo }) ?? local(ruta) ?? remoto(ruta);
  return crudo === null || crudo === undefined ? crudo : sinComentarios(crudo);
}

/** La otra puerta: los dos archivos del sitio. Ver `sinComentarios`. */
export function leerDelSitio(ruta, { leer = leerLocal } = {}) {
  const crudo = leer(ruta);
  return crudo === null || crudo === undefined ? crudo : sinComentarios(crudo);
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
  if (decl) return texto ? decl[1] : Number(decl[1]);

  // Segundo salto: `const PRUEBA_PLAN = NOMBRE_DE_PLAN.pro`. Entro el 2026-09-17, cuando los
  // nombres de plan pasaron a un mapa unico para que dejaran de tipearse. Sin este salto el
  // lector devuelve `null` —y el cruce sale NO PUDE MEDIR— por un cambio que no mueve ni un
  // dato: es el mismo modo de falla que trajo el primero, un archivo que cambia de FORMA.
  const porMapa = archivo?.match(
    new RegExp(`\\bconst\\s+${porNombre[1]}\\s*=\\s*([A-Za-z_$][\\w$]*)\\.([A-Za-z_$][\\w$]*)`),
  );
  if (!porMapa) return null;
  const valor = mapaLiteral(archivo, porMapa[1])[porMapa[2]];
  if (valor === undefined) return null;
  return texto ? valor : Number(valor);
}

/**
 * Un `const <nombre> = { clave: "valor", ... }` del archivo, como objeto. `{}` si no esta —
 * quien lo use decide si eso es NO PUDE MEDIR; nunca significa "no hay nombres".
 */
export function mapaLiteral(archivo, nombre) {
  const decl = archivo?.match(new RegExp(`\\bconst\\s+${nombre}\\s*=\\s*\\{([^}]*)\\}`));
  if (!decl) return {};
  const salida = {};
  for (const m of decl[1].matchAll(/\b([A-Za-z_$][\w$]*):\s*"([^"]*)"/g)) salida[m[1]] = m[2];
  return salida;
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
  for (const m of bloque.matchAll(PLANES_QUE_DECLARA_EL_BLOQUE())) {
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
  for (const m of bloque.matchAll(PLANES_QUE_DECLARA_EL_BLOQUE())) {
    salida[m[1]] = {
      fichas: entero(m[2], "patients"),
      usuarios: entero(m[2], "users"),
      recordatorios: entero(m[2], "emailsPerMonth"),
      agentes: booleano(m[2], "agentsIncluded"),
      reservas: booleano(m[2], "publicBookingIncluded"),
      reportes: booleano(m[2], "reportsEnabled"),
      exportaCsv: booleano(m[2], "csvExportEnabled"),
      facturasRecurrentes: booleano(m[2], "recurringInvoicesEnabled"),
      chatbot: booleano(m[2], "whatsappIncluded"),
      coadministradores: booleano(m[2], "multiAdminIncluded"),
    };
  }
  return salida;
}

/**
 * De que campo de `PlanLimits` sale cada capacidad que este cruce lee. Es el mapa que hace
 * MEDIBLE la cobertura: sin el, "cuales booleanos cruzo" solo se puede contestar leyendo el
 * cuerpo de `limitesDelProducto` a ojo.
 */
export const CAPACIDADES_CRUZADAS = {
  agentes: "agentsIncluded",
  reservas: "publicBookingIncluded",
  reportes: "reportsEnabled",
  exportaCsv: "csvExportEnabled",
  facturasRecurrentes: "recurringInvoicesEnabled",
  chatbot: "whatsappIncluded",
  coadministradores: "multiAdminIncluded",
};

/**
 * Booleanos de `PlanLimits` que a proposito NO se cruzan, cada uno con su motivo y su
 * RE-MEDICION: `booleanosSinCruzar` exige que el campo siga existiendo (si no, la excusa sobra y
 * queda pre-aprobando al proximo que se llame igual) y que ningun plan VENDIDO lo tenga en
 * `true` — porque una capacidad que ningun plan trae no es una promesa que el sitio pueda estar
 * escondiendo, y el dia que alguien la encienda la excusa se cae sola.
 */
export const BOOLEANOS_SIN_CRUCE = [
  {
    campo: "gatewayEnabled",
    cuando: "ninguno",
    porque:
      "ningun plan lo trae encendido: la pasarela de pago propia no se vende hoy, asi que el sitio no tiene nada que publicar",
  },
  {
    campo: "basicReportEnabled",
    cuando: "todos",
    porque:
      "lo traen TODOS los planes vendidos: no es un escalon, y el `incluye` del Basico ya lo nombra sin tier que pueda mentir",
  },
  {
    campo: "inventoryIncluded",
    cuando: "todos",
    porque:
      "idem: encendido en todos los planes vendidos, el Basico lo nombra y no hay un 'desde X' que pueda salir mal",
  },
];

/**
 * Los campos `boolean` que el producto declara por plan, DERIVADOS de su interfaz publicada.
 *
 * Es la mitad que faltaba. `limitesDelProducto` deriva bien los PLANES del bloque, y despues
 * elige los CAMPOS con una lista escrita a mano — la lista de inclusion de siempre, un escalon
 * mas adentro. Medido el 2026-09-18: de los diez booleanos de `PlanLimits`, este cruce leia
 * cinco, y `multiAdminIncluded` —que el producto ya APLICABA en produccion desde el 17-sep,
 * DG-043— no era sujeto de nadie: el sitio podia no nombrarlo (y no lo nombraba) para siempre,
 * con el gate en verde.
 */
export function booleanosDelProducto(fuente) {
  const bloque = (fuente ?? "").match(
    /interface\s+PlanLimits\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  if (!bloque) return null; // ilegible: no se adivina, el llamador decide
  return [
    ...sinComentarios(bloque).matchAll(/^\s*(\w+)\s*:\s*boolean\s*;/gm),
  ].map((m) => m[1]);
}

/**
 * Los booleanos del producto que ni se cruzan ni estan excusados — y las excusas que ya no
 * valen. Tri-estado: `null` cuando no se pudo leer la interfaz (no es lo mismo que "ninguno").
 */
export function booleanosSinCruzar(fuenteLimites) {
  const campos = booleanosDelProducto(fuenteLimites);
  if (!campos) return null;
  const cruzados = new Set(Object.values(CAPACIDADES_CRUZADAS));
  const excusados = new Map(BOOLEANOS_SIN_CRUCE.map((e) => [e.campo, e]));

  const sinCruzar = campos.filter((c) => !cruzados.has(c) && !excusados.has(c));

  const excusasMuertas = BOOLEANOS_SIN_CRUCE.filter(
    (e) => !campos.includes(e.campo) || cruzados.has(e.campo),
  ).map((e) => ({
    ...e,
    porqueSobra: campos.includes(e.campo)
      ? "ya se cruza: la excusa pre-aprueba lo que el cruce ya mira"
      : "el producto ya no declara ese campo",
  }));

  /**
   * Cada excusa se re-mide contra el CATALOGO, no contra su propio texto: lo que la hace cierta
   * es que la capacidad no distinga planes ("ninguno" la trae, o la traen "todos"). El dia que
   * eso deje de valer —un plan la enciende, o deja de traerla— la excusa se cae sola y el campo
   * vuelve a pedir cruce, sin que nadie se acuerde de tocar esta lista.
   */
  const excusasVencidas = BOOLEANOS_SIN_CRUCE.filter((e) => {
    if (!campos.includes(e.campo)) return false; // ya sale por `excusasMuertas`
    const valores = valoresPorPlan(fuenteLimites, e.campo);
    if (valores.includes(null)) return true; // ilegible: la excusa no se puede sostener
    return e.cuando === "ninguno"
      ? valores.some((v) => v === true)
      : !valores.every((v) => v === true);
  }).map((e) => ({
    ...e,
    porqueSobra:
      e.cuando === "ninguno"
        ? "algun plan vendido ya lo trae encendido: pasa a ser un 'desde X' que el sitio puede estar escondiendo"
        : "dejo de traerlo algun plan vendido: ahora distingue escalones y hay un tier que cruzar",
  }));

  return { sinCruzar, excusasMuertas, excusasVencidas };
}

/** El valor de ese campo en cada plan VENDIDO, leido del bloque (los campos sin cruce no viven
 *  en el objeto aplanado de `limitesDelProducto`). `null` = no se pudo leer, nunca `false`. */
function valoresPorPlan(fuente, campo) {
  const bloque = bloqueExportado(fuente ?? "", "PLAN_LIMITS");
  const porPlan = Object.fromEntries(
    [...(bloque ?? "").matchAll(PLANES_QUE_DECLARA_EL_BLOQUE())].map((m) => [
      m[1],
      booleano(m[2], campo),
    ]),
  );
  return PLANES_EN_ORDEN.map((p) => porPlan[p.producto] ?? null);
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
  const recarga = bloqueExportado(addons ?? "", "RECARGA_CONVERSACIONES");
  const grupo = bloqueExportado(addons ?? "", "ENTERPRISE_PLAN_PRICE");
  const trial = prueba?.match(/TRIAL_PLAN\s*=\s*"([a-z]+)"/);
  const l = limitesDelProducto(limites ?? "");

  return {
    ...topesAplanados(l),
    "primer plan con agentes de IA": primerPlanCon(l, "agentes"),
    "primer plan con reservas online incluidas": primerPlanCon(l, "reservas"),
    // El mismo hecho del producto, contra la lectura POR CAMPO del sitio (ver
    // `agentesPorCampo` / `reservasPorCampo` en `limitesDelSitio`). Misma fuente de
    // este lado —`agentsIncluded` / `publicBookingIncluded`— y dos lecturas distintas
    // del otro: prosa y booleano tienen que dar lo mismo.
    "primer plan con agentes de IA · por campo": primerPlanCon(l, "agentes"),
    "primer plan con reservas online incluidas · por campo": primerPlanCon(
      l,
      "reservas",
    ),
    "primer plan con más de un administrador": primerPlanCon(
      l,
      "coadministradores",
    ),
    "primer plan con más de un administrador · por campo": primerPlanCon(
      l,
      "coadministradores",
    ),
    "primer plan con el chatbot incluido · por campo": primerPlanCon(
      l,
      "chatbot",
    ),
    "primer plan con reportes completos": primerPlanCon(l, "reportes"),
    "primer plan que exporta en CSV": primerPlanCon(l, "exportaCsv"),
    "primer plan con facturas recurrentes": primerPlanCon(
      l,
      "facturasRecurrentes",
    ),
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
    /**
     * La recarga: el extra que se COBRA cuando el cupo se agota. Entró a este
     * cruce el 2026-09-11, con el mismo argumento que el cupo un lustro de
     * vueltas antes — el sitio lo ofrecía («podés sumar más») sin nombrar el
     * precio, así que no había cifra publicada que pudiera compararse y el
     * hueco no era visible desde ninguno de los dos lados.
     */
    "recarga del chatbot · conversaciones": num(recarga, "conversaciones"),
    "recarga del chatbot · precio": num(recarga, "precio"),
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
  const marcas = [...fuente.matchAll(IDS_DEL_SITIO())];
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
 * Cómo llama el PRODUCTO a cada plan: `PLAN_LABELS` de `lib/pricing.ts`, que es lo que pinta el
 * checkout, la tab "Mi plan", los correos y los recibos. Devuelve `{}` si el bloque no está —el
 * llamador lo trata como NO PUDE MEDIR, nunca como "coinciden".
 */
export function etiquetasDelProducto(fuente) {
  const bloque = bloqueExportado(fuente, "PLAN_LABELS");
  if (!bloque) return {};
  const salida = {};
  for (const m of bloque.matchAll(/\b([A-Za-z_$][\w$]*):\s*"([^"]*)"/g)) salida[m[1]] = m[2];
  return salida;
}

/**
 * Cómo llama el SITIO a cada plan, resolviendo la indirección.
 *
 * El `nombre` puede estar escrito de dos formas y las dos tienen que leerse: literal
 * (`nombre: "Pro"`, que es como estuvo hasta el 2026-09-17) o apuntando al mapa de nombres
 * (`nombre: NOMBRE_DE_PLAN.pro`, que es la forma de hoy). Un lector que entienda sólo la de hoy
 * devuelve `null` el día que alguien vuelva a tipear el nombre — o sea se queda ciego JUSTO en el
 * defecto que existe para cazar, y encima en verde. Es el mismo modo de falla que ya le costó una
 * vuelta a `valorResuelto` acá arriba.
 */
export function nombresDelSitio(fuente) {
  const mapa = mapaLiteral(fuente, "NOMBRE_DE_PLAN");
  const marcas = [...fuente.matchAll(IDS_DEL_SITIO())];
  const salida = {};
  marcas.forEach((m, i) => {
    const hasta = i + 1 < marcas.length ? marcas[i + 1].index : fuente.length;
    const trozo = fuente.slice(m.index, hasta);
    // El PRIMER `nombre:` del trozo y las dos formas en la MISMA expresion, a proposito: el
    // trozo del ultimo plan llega hasta el final del archivo, y ahi abajo vive `GRUPO`, que
    // tambien tiene `nombre`. Buscando cada forma por separado, la literal de GRUPO le ganaba a
    // la del plan y el gate acusaba al sitio de llamar "Grupo / Empresarial" al plan Full.
    const hallado = trozo.match(
      /\bnombre:\s*(?:"([^"]*)"|NOMBRE_DE_PLAN\.([A-Za-z_$][\w$]*))/,
    );
    salida[m[1]] = !hallado
      ? null
      : hallado[1] !== undefined
        ? hallado[1]
        : (mapa[hallado[2]] ?? null);
  });
  return salida;
}

/**
 * ¿Los dos lados de la MISMA compra le dan el mismo nombre a cada plan?
 *
 * Nace de un desacuerdo vivo, medido el 2026-09-17 contra las dos pantallas: `onia.com.bo` decía
 * "Pro" y "Full" (62 veces entre la home y `/precios`) y `app.onia.com.bo` —donde se paga— decía
 * "Profesional" y "Completo". El lead elegía un plan con un nombre y pagaba otro, y el que
 * escribía por WhatsApp pedía "el Full", que en el producto no existe.
 *
 * Ningún gate lo veía y el motivo es la lección: los cruces de plata atan CIFRAS, y un NOMBRE no
 * es una cifra — el sitio publicaba Bs 890 correctos con la etiqueta equivocada y todo salía
 * verde. Por eso el sujeto son los tres nombres de cada plan y no sólo dos:
 *
 *   · el del PRODUCTO (`PLAN_LABELS`), que manda;
 *   · el del SITIO (`src/lib/pricing.ts`), que es lo que lee el lead;
 *   · el de ESTE INSTRUMENTO (`PLANES_EN_ORDEN[].etiqueta`), que es su copia propia y se usa para
 *     decidir a qué plan se refiere una frase del sitio (`planQueElSitioPrometeParaExportar`).
 *     Dejarlo fuera del cruce es dejar que el gate envejezca solo: con la etiqueta vieja, ese
 *     detector busca "Pro" en un sitio que ya dice "Profesional" y no encuentra nada.
 *
 * `ilegibles` va aparte de `difieren` por la regla de siempre: no poder leer un nombre no es que
 * coincidan.
 */
export function nombresCruzados(etiquetasProducto, nombresSitio, planes = PLANES_EN_ORDEN) {
  const difieren = [];
  const ilegibles = [];
  for (const p of planes) {
    const delProducto = etiquetasProducto?.[p.producto] ?? null;
    const delSitio = nombresSitio?.[p.sitio] ?? null;
    if (falta(delProducto) || falta(delSitio)) {
      ilegibles.push({
        plan: p.sitio,
        lados: [falta(delProducto) && "el producto", falta(delSitio) && "el sitio"].filter(Boolean),
      });
      continue;
    }
    if (delProducto !== delSitio) {
      difieren.push({ plan: p.sitio, producto: delProducto, sitio: delSitio, donde: "el sitio" });
    }
    if (delProducto !== p.etiqueta) {
      difieren.push({
        plan: p.sitio,
        producto: delProducto,
        sitio: p.etiqueta,
        donde: "este gate (PLANES_EN_ORDEN.etiqueta)",
      });
    }
  }
  return { difieren, ilegibles };
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
  const marcas = [...fuente.matchAll(IDS_DEL_SITIO())];
  const salida = {};
  marcas.forEach((m, i) => {
    const hasta = i + 1 < marcas.length ? marcas[i + 1].index : fuente.length;
    const trozo = fuente.slice(m.index, hasta);
    const inc = incluyeDelSitio(trozo);
    salida[m[1]] = {
      /**
       * "sin tope" es la OTRA forma de decir ilimitado, y entro el 2026-09-12:
       * el Full paso de "Fichas ilimitadas" a "Fichas y usuarios sin tope".
       * Con solo `ilimitad` esos dos topes salian `null` — ilegibles, no
       * infinitos— y el cruce quedaba ciego justo en el plan caro. El `[^"]*`
       * es lo que evita el falso positivo: los planes con tope escriben su
       * cifra DENTRO de su propia comilla ("Topes: 800 fichas · 3 usuarios"),
       * asi que la negacion de otra linea no se les derrama.
       */
      fichas: topeEnProsa(inc, {
        ilimitado: /fichas[^"]*(?:ilimitad|sin\s+tope)/i,
        conNumero: /([\d.]+)\s+fichas/i,
      }),
      usuarios: topeEnProsa(inc, {
        ilimitado: /usuarios[^"]*(?:ilimitad|sin\s+tope)/i,
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
      /**
       * Los mismos dos hechos, leidos del BOOLEANO que el sitio declara por plan
       * (`agentesIncluidos` / `reservasIncluidas`, espejo de `agentsIncluded` y
       * `publicBookingIncluded`). No es una segunda copia del dato de arriba: la de
       * arriba sale de la PROSA del `incluye` y esta del campo, y las dos se cruzan
       * contra el producto. Entraron el 2026-09-13, cuando se midio que la prosa
       * estaba bien y otras superficies del sitio —el `copy` de un add-on y la
       * pagina /agentes— afirmaban lo contrario con el plan tipeado a mano; el
       * campo es lo que ahora derivan esas superficies, asi que si nadie lo cruza
       * contra el producto el error se muda del texto al booleano.
       */
      agentesPorCampo: /agentesIncluidos:\s*true/.test(trozo) || null,
      reservasPorCampo: /reservasIncluidas:\s*true/.test(trozo) || null,
      /**
       * Los dos hermanos que entraron el 2026-09-18 con la cobertura de booleanos. El del chatbot
       * ya existia como campo (`chatbotIncluido`) y nadie lo cruzaba ACA; el de administradores
       * nacio ese dia, y es el que motivo todo: el producto lo aplicaba desde el 17-sep y el
       * sitio no decia una palabra.
       */
      chatbotPorCampo: /chatbotIncluido:\s*true/.test(trozo) || null,
      coadministradoresPorCampo:
        /coadministradores:\s*true/.test(trozo) || null,
      /** La PROSA del mismo hecho: la tarjeta del plan que lo trae lo dice con palabras. */
      coadministradores: /m[aá]s\s+de\s+un\s+administrador/i.test(inc ?? "") || null,
      reportes: /Reportes\s+completos/i.test(inc ?? "") || null,
      /**
       * El Basico la nombra en su `sinEsto` («Reportes completos y facturas
       * recurrentes») y el Pro en su `incluye`. Se lee del `incluye` porque
       * `incluyeDelSitio` corta en `sinEsto:`: lo que el plan NIEGA no cuenta
       * como que lo tiene, que es justo la confusion que haria dar `basico`.
       */
      facturasRecurrentes:
        /facturas\s+recurrentes/i.test(inc ?? "") || null,
    };
  });
  return salida;
}

/* ──────────  la COBERTURA: que un tope nuevo no nazca mudo  ────────── */

/**
 * QUE AGUJERO TAPA ESTO, y por que no se ve mirando el veredicto.
 *
 * `CIFRAS` sale de `Object.keys(cifrasDelProducto(...))`: el universo de este
 * cruce lo define el lado PRODUCTO. Eso cubre bien una direccion —una cifra que
 * el producto define y el sitio no publica cae en `ilegibles`— y es CIEGO a la
 * contraria: un numero que el SITIO publica sin clave del lado producto no
 * entra en `CIFRAS`, asi que no se compara, no se nombra, y el script imprime
 * "VERDE: las N cifras" por encima.
 *
 * Medido el 2026-09-07 inyectando un tope nuevo en el `incluye` del Basico en
 * su forma real ("Hasta 7 sucursales conectadas"): `ilegibles 0 · difieren 0`
 * y verde. No es hipotetico — es como nace este defecto: alguien agrega una
 * fila al `incluye` para vender mejor, nadie toca el producto, y el sitio queda
 * publicando un tope que el sistema no aplica.
 *
 * Es la lista de inclusion de siempre, un escalon mas adentro: el gate DERIVA
 * bien sus sujetos del disco (lee el `incluye` de cada plan) y despues los
 * clasifica con un puñado de palabras conocidas —fichas, usuarios,
 * recordatorios— tirando en SILENCIO lo que no sabe nombrar. Derivar el sujeto
 * no alcanza si la clasificacion es una lista blanca.
 *
 * COMO SE CIERRA. Se enumera TODO numero que el `incluye` publica y se exige
 * que cada uno lo consuma un cruce o lo excuse una entrada con su motivo. Asi
 * el que viene manana nace NOMBRADO en vez de mudo, y el error posible pasa a
 * ser "sobra un aviso" en vez de "falta el unico que importaba".
 */

/**
 * Numeros del `incluye` que a proposito NO se cruzan, cada uno con su motivo.
 *
 * Hoy esta VACIA, que es el mejor estado posible: los seis numeros que el sitio
 * publica (2/300/200, 5/1.500/800) los consumen los topes de `limitesDelSitio`.
 * Una entrada que sobra es peor que ninguna — pre-aprueba al proximo numero que
 * caiga en ese valor sin que nadie lo mire —, asi que `excusasSinSujeto()` la
 * caza y el guard la pone roja.
 *
 * @type {ReadonlyArray<{plan: string, valor: number, motivo: string}>}
 */
export const TOPES_SIN_CRUCE = [];

/**
 * Las constantes del sitio que este cruce SI sabe leer: las lee `cifrasDelSitio`
 * y por eso una cifra interpolada desde ellas ya viaja cruzada. Una constante
 * NUEVA citada dentro de un `incluye` (`${SUCURSALES_MAX}`) no la lee nadie, y
 * se reporta igual que un numero tipeado a mano.
 */
export const CONSTANTES_CRUZADAS = [
  "GRUPO",
  "AGENDA_ADDON",
  "USUARIO_EXTRA_ADDON",
  "PRUEBA",
];

/**
 * Constantes del `incluye` que NO publican una cifra y cuya verificacion contra
 * el producto la hace OTRO cruce, que hay que nombrar.
 *
 * Nace el 2026-09-08: `ALCANCE_CLINICO` dice a que RUBROS llega una capacidad, y
 * este cruce solo sabe de topes y montos, asi que la reportaba como "cifra sin
 * cruzar". Las dos salidas obvias eran malas: meterla en CONSTANTES_CRUZADAS es
 * MENTIR (nadie la lee aca) y `TOPES_SIN_CRUCE` es para numeros. Sin esta
 * categoria, la unica forma de tener el gate en verde era tipear el alcance a
 * mano en las dos lineas que lo dicen — o sea, el gate empujaba a duplicar el
 * dato, que es exactamente el defecto que existe para evitar.
 *
 * Se re-mide en las DOS direcciones: la constante tiene que seguir publicandose
 * (si no, la excusa sobra y queda PRE-APROBADA) y su verificador tiene que
 * existir en el arbol.
 */
export const CONSTANTES_VERIFICADAS_APARTE = [
  {
    valor: "ALCANCE_CLINICO",
    porque: "no es un tope ni un monto: es a que rubros llega la capacidad",
    cruzadaPor: "scripts/capacidad-por-rubro.mjs",
  },
  {
    valor: "ALCANCE_CON_FICHA",
    porque:
      "tampoco es un tope: es a que rubros llega el agente Recall, acotado por los DATOS que lee (patient + appointment) y no por la pantalla",
    cruzadaPor: "src/app/capacidad-acotada.test.ts",
  },
  {
    valor: "CHATBOT_MENSUAL",
    porque:
      "no es un tope del plan: es el precio del add-on chatbot citado dentro del `incluye` del Full para mostrar la cuenta «Pro + add-on vs Full». No lo tipea pricing.ts — es un alias de CHATBOT_PLAN.mensual, y ESE archivo ya entra a este mismo cruce por la clave `add-on chatbot · mensual`",
    cruzadaPor: "src/content/chatbot-precios.ts",
  },
  {
    valor: "ALCANCE_CON_AGENDA",
    porque:
      "tampoco es un tope: es a que rubros les llega la agenda, y con ella la reserva publica — comercio e importadora no tienen una sola ruta de citas en su pack",
    cruzadaPor: "src/app/capacidad-en-la-enumeracion.test.ts",
  },
  {
    valor: "NOMBRE_DE_PLAN",
    porque:
      "no es una cifra: es como se LLAMA cada plan («Todo lo del ${NOMBRE_DE_PLAN.crece}»). Se interpola justamente para que el nombre no se tipee en la prosa, que es como el sitio termino diciendo «Pro» y «Full» mientras el checkout cobraba «Profesional» y «Completo»",
    cruzadaPor: "scripts/precios-fuente.mjs",
  },
];

/** Excusas de constante que ya no tienen sujeto: nadie las mide y quedan pre-aprobadas. */
export function constantesExcusadasSinSujeto(fuente) {
  const publicados = numerosPublicados(fuente);
  return CONSTANTES_VERIFICADAS_APARTE.filter(
    (e) => !publicados.some((n) => n.clase === "constante" && n.valor === e.valor),
  );
}

/**
 * Todo lo que el `incluye` de cada plan publica como cifra: los numeros
 * LITERALES y las constantes citadas por interpolacion. Las dos formas, porque
 * el defecto entra por las dos y una sola deja media puerta abierta.
 */
export function numerosPublicados(fuente) {
  const marcas = [...(fuente ?? "").matchAll(IDS_DEL_SITIO())];
  const salida = [];
  marcas.forEach((m, i) => {
    const hasta = i + 1 < marcas.length ? marcas[i + 1].index : (fuente ?? "").length;
    const inc = incluyeDelSitio((fuente ?? "").slice(m.index, hasta));
    if (inc === null) return;
    for (const cruda of inc.split("\n")) {
      const linea = cruda.trim().replace(/^["`]|["`],?$/g, "");
      for (const s of cruda.matchAll(/\$\{([^}]*)\}/g)) {
        for (const c of s[1].matchAll(/\b([A-Z][A-Z0-9_]{2,})\b/g)) {
          salida.push({ plan: m[1], clase: "constante", valor: c[1], linea });
        }
      }
      /** La interpolacion ya se conto arriba por su nombre: aca estorbaria. */
      for (const n of cruda.replace(/\$\{[^}]*\}/g, " ").matchAll(/\d[\d.]*\d|\d/g)) {
        salida.push({
          plan: m[1],
          clase: "número",
          valor: Number(String(n[0]).replace(/\./g, "")),
          linea,
        });
      }
    }
  });
  return salida;
}

/** Lo que el sitio publica en su `incluye` y este cruce no mira. Vacio = cubierto. */
export function publicadosSinCruzar(fuente) {
  const ls = limitesDelSitio(fuente ?? "");
  return numerosPublicados(fuente).filter((n) => {
    if (n.clase === "constante") {
      return (
        !CONSTANTES_CRUZADAS.includes(n.valor) &&
        !CONSTANTES_VERIFICADAS_APARTE.some((c) => c.valor === n.valor)
      );
    }
    const t = ls[n.plan] ?? {};
    if ([t.fichas, t.usuarios, t.recordatorios].some((v) => v === n.valor)) return false;
    return !TOPES_SIN_CRUCE.some((e) => e.plan === n.plan && e.valor === n.valor);
  });
}

/**
 * Excusas que ya no tienen sujeto. Una entrada de lista blanca que ningun
 * numero usa no la mide nadie y queda PRE-APROBADA: el dia que alguien publique
 * ese mismo valor, entra en verde sin que nadie lo haya mirado.
 */
export function excusasSinSujeto(fuente) {
  const publicados = numerosPublicados(fuente);
  return TOPES_SIN_CRUCE.filter(
    (e) => !publicados.some((n) => n.clase === "número" && n.plan === e.plan && n.valor === e.valor),
  );
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

/**
 * El tier que el sitio promete para la EXPORTACION DE DATOS, leido de la frase
 * que lo promete y no de una tabla.
 *
 * POR QUE VA APARTE de los otros tres tiers. Agentes, reservas y reportes se
 * cruzan por quien los NOMBRA primero dentro del `incluye` de cada plan: hay
 * una fila por plan y el patron la encuentra. La exportacion no vive ahi — vive
 * en `CONDICIONES`, una lista de frases sueltas que las DOS pantallas de precio
 * renderizan al pie ("Tus datos son tuyos: los exportas en CSV desde el plan
 * mas chico"). Sin fila por plan, `primerPlanDelSitioCon` no la ve, asi que era
 * el unico tier que el sitio publica y nadie cruzaba: el dia que el producto
 * mueva `csvExportEnabled` al Pro, esa frase sigue en pantalla prometiendolo
 * desde el Basico y las 3 cifras de tier siguen en verde.
 *
 * COMO SE LEE EL TIER. Si la frase nombra un plan, ese; si dice "el plan mas
 * chico" o no nombra ninguno, el mas barato que el sitio VENDE — una promesa
 * sin condicion se le esta haciendo a todo el que puede pagar, y el mas barato
 * es el que la puede desmentir.
 *
 * COMO NO FALLA EN VERDE. Si ninguna frase promete exportacion, devuelve `null`
 * y el cruce sale ROJO DE INSTRUMENTO, no verde: que la promesa desaparezca es
 * una decision de venta, y entonces este cruce se saca A LA VISTA. Callarse es
 * como esta familia de gates deja de medir sin que nadie se entere.
 */
export function planQueElSitioPrometeParaExportar(fuente) {
  const bloque = bloqueExportado(fuente ?? "", "CONDICIONES");
  if (!bloque) return null;
  const frase = bloque
    .split(/",|`,/)
    .find((f) => /export[áa]s?|exportar/i.test(f) && /\bCSV\b/i.test(f));
  if (!frase) return null;
  const nombrado = PLANES_EN_ORDEN.find((p) =>
    new RegExp(`\\b${p.etiqueta}\\b`, "i").test(frase),
  );
  if (nombrado) return nombrado.producto;
  return PLANES_EN_ORDEN[0].producto;
}

export function cifrasDelSitio({ precios, chatbot }) {
  const p = planesDelSitio(precios ?? "");
  const grupo = bloqueExportado(precios ?? "", "GRUPO");
  const agenda = bloqueExportado(precios ?? "", "AGENDA_ADDON");
  const usuario = bloqueExportado(precios ?? "", "USUARIO_EXTRA_ADDON");
  const prueba = bloqueExportado(precios ?? "", "PRUEBA");
  const planPrueba = valorResuelto(prueba, "planQueCorre", precios ?? "", { texto: true });
  const stacks = bloqueExportado(chatbot ?? "", "CHATBOT_STACKS");
  const recarga = bloqueExportado(chatbot ?? "", "RECARGA");
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
    "primer plan con agentes de IA · por campo": primerPlanDelSitioCon(
      ls,
      "agentesPorCampo",
    ),
    "primer plan con reservas online incluidas · por campo":
      primerPlanDelSitioCon(ls, "reservasPorCampo"),
    "primer plan con más de un administrador": primerPlanDelSitioCon(
      ls,
      "coadministradores",
    ),
    "primer plan con más de un administrador · por campo": primerPlanDelSitioCon(
      ls,
      "coadministradoresPorCampo",
    ),
    "primer plan con el chatbot incluido · por campo": primerPlanDelSitioCon(
      ls,
      "chatbotPorCampo",
    ),
    "primer plan con reportes completos": primerPlanDelSitioCon(ls, "reportes"),
    "primer plan con facturas recurrentes": primerPlanDelSitioCon(
      ls,
      "facturasRecurrentes",
    ),
    "primer plan que exporta en CSV":
      planQueElSitioPrometeParaExportar(precios ?? ""),
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
    "recarga del chatbot · conversaciones": num(recarga, "conversaciones"),
    "recarga del chatbot · precio": num(recarga, "precio"),
    "add-on reservas online · mensual": num(agenda, "mensualAddon"),
    "add-on usuario extra · mensual": num(usuario, "mensualAddon"),
    "add-on usuario extra · máximo en Básico": num(usuario, "maxEnBasico"),
    "prueba gratis · días": valorResuelto(prueba, "dias", precios),
    /**
     * El producto lo nombra `professional`; el sitio, por su etiqueta. La
     * equivalencia se DERIVA de `PLANES_EN_ORDEN`: escrita a mano se quedaba
     * sin la etiqueta del plan que entrara manana (le paso a `Crece`).
     */
    "prueba gratis · plan que corre":
      PLANES_EN_ORDEN.find((p) => p.etiqueta === planPrueba)?.producto ??
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

/**
 * A QUE PLANES les vende el producto usuarios extra, leido de `topeDe` (`lib/asientos.ts`).
 *
 * `topeDe` nombra las excepciones y deja al resto SIN TOPE, asi que el universo se deriva de sus
 * ramas: la que suma asientos (`incluidos + ...`) ACOTA y vende; la que devuelve `incluidos` a
 * secas NO vende. Lo que no nombra, vende sin tope — salvo los planes de usuarios ilimitados, que
 * no necesitan comprar ninguno.
 *
 * `null` = no se pudo leer. Nunca `{}`, que se leeria como "ningun plan vende" y absolveria al
 * sitio callado.
 */
export function alcanceDeAsientosDelProducto(fuente, limites) {
  const cuerpo = (fuente ?? "").match(/function topeDe\s*\([^)]*\)[^{]*\{([\s\S]*?)\n\}/);
  if (!cuerpo) return null;
  const acotados = new Map();
  const sinVenta = new Set();
  for (const m of cuerpo[1].matchAll(/plan === "([a-z]+)"\)\s*return\s+([^;]+);/g)) {
    if (/incluidos\s*\+/.test(m[2])) acotados.set(m[1], m[2].trim());
    else sinVenta.add(m[1]);
  }
  if (acotados.size === 0 && sinVenta.size === 0) return null;

  /** Cuantos asientos EXTRA vende ese plan: `0` = ninguno, `null` = sin tope. */
  return (planProducto) => {
    if (limites?.[planProducto]?.usuarios === -1) return 0; // ilimitado: no hace falta comprar
    if (sinVenta.has(planProducto)) return 0;
    if (acotados.has(planProducto)) return "acotado"; // el NUMERO ya se cruza como cifra
    return null;
  };
}

/** Lo que el sitio PUBLICA sobre quien puede sumar gente pagando (`asientosExtra` de cada plan). */
export function alcanceDeAsientosDelSitio(fuente) {
  const salida = {};
  for (const { sitio } of PLANES_EN_ORDEN) {
    const bloque = (fuente ?? "").match(
      new RegExp(`id:\\s*"${sitio}"[\\s\\S]*?asientosExtra:\\s*([^,\\n]+)`),
    );
    if (!bloque) {
      salida[sitio] = undefined;
      continue;
    }
    const crudo = bloque[1].trim();
    if (crudo === "null") salida[sitio] = null;
    else if (/^\d+$/.test(crudo)) salida[sitio] = Number(crudo) === 0 ? 0 : "acotado";
    else salida[sitio] = "acotado"; // interpolado (USUARIO_EXTRA_ADDON.maxEnBasico)
  }
  return salida;
}

/**
 * Los planes donde el sitio y el producto no coinciden en QUIEN puede sumar gente pagando.
 * Falla hacia el rojo: un lado ilegible se reporta, no se absuelve.
 */
export function asientosDesalineados(fuenteAsientos, limites, fuenteSitio) {
  const delProducto = alcanceDeAsientosDelProducto(fuenteAsientos, limites);
  if (!delProducto) return null;
  const delSitio = alcanceDeAsientosDelSitio(fuenteSitio);
  const problemas = [];
  for (const { producto, sitio, etiqueta } of PLANES_EN_ORDEN) {
    const esperado = delProducto(producto);
    const publicado = delSitio[sitio];
    if (publicado === undefined) {
      problemas.push(`${etiqueta}: el sitio no declara \`asientosExtra\` (no se puede cruzar)`);
    } else if (esperado !== publicado) {
      const di = (v) => (v === null ? "sin tope" : v === 0 ? "no vende" : "con tope");
      problemas.push(
        `${etiqueta}: el producto ${di(esperado)} y el sitio publica ${di(publicado)}`,
      );
    }
  }
  return problemas;
}

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

/* ---------- el otro cruce: QUE CICLOS se pueden pagar ---------- */

/**
 * Los tres planes comprables, con su nombre en cada repo.
 *
 * Se declara la equivalencia en vez de derivarla porque los dos lados usan
 * nombres distintos para el mismo plan (`basic`/`basico`, `professional`/`pro`,
 * `clinic`/`full`) y ningun patron puede adivinar ese mapeo.
 */
/**
 * La QUINTA copia de la misma lista, ahora derivada. Era la cuarta equivalencia
 * plan-sitio escrita a mano y se descubrio el 2026-09-12 al dar de alta `crece`:
 * las otras tres ya leian el plan nuevo y esta seguia con tres filas, asi que el
 * ciclo semanal del escalon nuevo (Bs 145, que el checkout acepta) no lo cruzaba
 * nadie. Su propio test lo dice: "si mañana nace una cuarta tarjeta comprable,
 * tiene que llegar aca" — una equivalencia escrita a mano es lista de inclusion
 * y falla ABIERTA.
 */
export const CICLOS_EQUIVALENCIA = PLANES_EN_ORDEN.map((p) => ({
  nombre: p.etiqueta,
  producto: p.producto,
  sitio: p.sitio,
}));

/**
 * Cruza la DISPONIBILIDAD del ciclo semanal, que es cosa aparte del monto.
 *
 * Por que existe, y por que no alcanzaba con `comparar`: ese cruce mira CIFRAS,
 * un mapa de claves escritas a mano que OMITE `plan Full · semanal` y
 * `Grupo / Empresarial · semanal`. Esa omision no es un olvido: codifica la
 * creencia "Full y Grupo no se fraccionan". El dia que el producto le agregue
 * `weekly` al Full, no hay clave que comparar, nada entra en `ilegibles` ni en
 * `difieren`, y el cruce imprime VERDE mientras el sitio sigue publicando la
 * frase contraria — "El semanal existe en Básico y en Pro. Full se cobra
 * mensual o anual." (CONDICIONES, derivada de `PLANES`).
 *
 * Y no es cosmetico: la disponibilidad es lo que decide si el checkout acepta
 * la venta (`isCycleAvailable` en subscription-plans.ts, y el
 * "Solo mensual o anual" de CheckoutClient.tsx). Publicar de menos esconde la
 * forma mas barata de entrar al plan; publicar de mas manda al lead a un
 * checkout que le rechaza el ciclo que eligio.
 *
 * Es un BOOLEANO, no una cifra: por eso ningun cruce de numeros puede
 * expresarlo, y por eso va aparte y no como una clave mas de `CIFRAS`.
 *
 * Puro: sin red y sin disco.
 */
export function ciclosCruzados(planesProducto, planesSitio) {
  const ilegibles = [];
  const difieren = [];

  for (const p of CICLOS_EQUIVALENCIA) {
    const lado = {
      producto: planesProducto?.[p.producto],
      sitio: planesSitio?.[p.sitio],
    };
    // `semanal: null` solo significa "este plan no se fracciona" si de verdad
    // leimos el plan. Si el patron no lo encontro, el objeto no esta o su
    // `mensual` vino vacio — y ahi `null` significa "no se", que es lo contrario.
    // Confundirlos convierte un parser roto en un verde.
    const ciego = Object.entries(lado)
      .filter(([, v]) => !v || falta(v.mensual))
      .map(([k]) => k);
    if (ciego.length > 0) {
      ilegibles.push({ plan: p.nombre, lados: ciego });
      continue;
    }
    const tiene = {
      producto: !falta(lado.producto.semanal),
      sitio: !falta(lado.sitio.semanal),
    };
    if (tiene.producto !== tiene.sitio) {
      difieren.push({ plan: p.nombre, ...tiene });
    }
  }

  return { ilegibles, difieren };
}

/**
 * Grupo / Empresarial queda fuera de este cruce, y la excusa se VERIFICA.
 *
 * Motivo: no se compra en linea (`CHECKOUT_PLANS` no lo trae, y el sitio lo
 * publica como "se cotiza"), asi que el sitio no hace ninguna afirmacion sobre
 * como se paga — no hay promesa que pueda contradecir al producto.
 *
 * Una excusa escrita en prosa se pudre: nadie la vuelve a medir. Esta se
 * re-mide en cada corrida — si alguien le pone un `semanal` a `GRUPO`, el sitio
 * pasa a afirmar un ciclo y la exencion deja de valer.
 */
export function excusaDeGrupoSigueValiendo(fuenteSitio) {
  const bloque = bloqueExportado(fuenteSitio, "GRUPO");
  if (!bloque) return { vale: false, porque: "no encontre el bloque `GRUPO` en el sitio" };
  if (/\bsemanal:/.test(bloque)) {
    return {
      vale: false,
      porque: "`GRUPO` ya declara un `semanal`: el sitio afirma un ciclo y hay que cruzarlo",
    };
  }
  return { vale: true, porque: "" };
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
  // Antes de leer nada: el ref al dia. Sin esto se cruza contra lo que el clon
  // tenia la ultima vez que alguien lo toco, y el veredicto sale con la misma
  // cara de siempre.
  if (!refreshRef()) {
    console.error(
      `AVISO: no pude actualizar ${REF_PRODUCTO} en ${REPO_PRODUCTO}. ` +
        `Lo que sigue se cruza contra el ref que ya estaba en disco.`,
    );
  }

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

  const preciosSitio = leerDelSitio(PRECIOS_SITIO);
  const delProducto = cifrasDelProducto({ planes, addons, prueba, limites });
  const delSitio = cifrasDelSitio({
    precios: preciosSitio,
    chatbot: leerDelSitio(CHATBOT_SITIO),
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

  const sinCruzar = publicadosSinCruzar(preciosSitio);
  if (sinCruzar.length > 0) {
    console.error(
      `NO PUDE MEDIR: el sitio publica ${sinCruzar.length} cifra(s) en el \`incluye\` de un ` +
        `plan que este cruce no mira, asi que NO estan verificadas contra el producto:\n` +
        sinCruzar
          .map((n) => `  · plan ${n.plan} — ${n.clase} ${n.valor} en "${n.linea}"`)
          .join("\n") +
        `\nUn tope que el sitio publica y el producto no aplica se paga DESPUES, cuando el ` +
        `cliente ya entro. Cruzalo (una clave nueva en cifrasDelProducto/cifrasDelSitio) o, ` +
        `si de verdad no es un tope del producto, excusalo con su motivo en TOPES_SIN_CRUCE.`,
    );
    process.exit(NO_PUDE_MEDIR);
  }

  const ciclos = ciclosCruzados(
    planesDelProducto(planes),
    planesDelSitio(preciosSitio),
  );
  const nombres = nombresCruzados(
    etiquetasDelProducto(addons),
    nombresDelSitio(preciosSitio),
  );
  const excusaGrupo = excusaDeGrupoSigueValiendo(preciosSitio);

  if (nombres.ilegibles.length > 0) {
    console.error(
      `NO PUDE MEDIR: no pude leer de los dos lados como se LLAMA cada plan:\n` +
        nombres.ilegibles
          .map((i) => `  · plan ${i.plan} — no lo pude leer en: ${i.lados.join(" y ")}`)
          .join("\n") +
        `\nSin eso no se puede decir si el lead elige un plan con un nombre y paga otro. ` +
        `Los nombres salen de PLAN_LABELS (${FUENTE_ADDONS} del producto) y de NOMBRE_DE_PLAN ` +
        `(src/lib/pricing.ts): si alguno cambio de forma, arreglar el parser ANTES de creerle a un verde.`,
    );
    process.exit(NO_PUDE_MEDIR);
  }

  if (ciclos.ilegibles.length > 0 || !excusaGrupo.vale) {
    console.error(
      `NO PUDE MEDIR: no pude leer de los dos lados que ciclos se pueden pagar:\n` +
        ciclos.ilegibles
          .map((i) => `  · plan ${i.plan} — no lo pude leer en: ${i.lados.join(" y ")}`)
          .join("\n") +
        (excusaGrupo.vale ? "" : `\n  · Grupo / Empresarial — ${excusaGrupo.porque}`) +
        `\nSin eso no se puede decir si el sitio ofrece un ciclo que el checkout rechaza.`,
    );
    process.exit(NO_PUDE_MEDIR);
  }

  const cobertura = booleanosSinCruzar(limites);
  if (!cobertura) {
    console.error(
      `NO PUDE MEDIR: no pude leer la interfaz \`PlanLimits\` de ${FUENTE_LIMITES} del producto, ` +
        `asi que no se cuantas capacidades por plan declara ni cuales estoy cruzando. ` +
        `Si cambio de forma, arreglar \`booleanosDelProducto\` ANTES de creerle a un verde.`,
    );
    process.exit(NO_PUDE_MEDIR);
  }
  const coberturaRota =
    cobertura.sinCruzar.length > 0 ||
    cobertura.excusasMuertas.length > 0 ||
    cobertura.excusasVencidas.length > 0;
  for (const campo of cobertura.sinCruzar) {
    console.error(
      `ROJO: el producto decide \`${campo}\` POR PLAN y este cruce no lo mira.\n` +
        `  Mientras nadie lo cruce, el sitio puede estar escondiendo una capacidad que el cliente ` +
        `paga —o prometiendo una que su plan no trae— con el gate en verde: fue exactamente lo que ` +
        `paso con \`multiAdminIncluded\` (DG-043, 17-sep, aplicandose en produccion y sin una sola ` +
        `palabra en el sitio).\n` +
        `  Se cierra de una de dos formas: agregarlo a CAPACIDADES_CRUZADAS —con su lectura en ` +
        `\`limitesDelProducto\`, su espejo en src/lib/pricing.ts y su par de claves en las dos ` +
        `\`cifras…\`— o excusarlo en BOOLEANOS_SIN_CRUCE con su motivo y su \`cuando\`.`,
    );
  }
  for (const e of [...cobertura.excusasMuertas, ...cobertura.excusasVencidas]) {
    console.error(
      `ROJO: la excusa de \`${e.campo}\` en BOOLEANOS_SIN_CRUCE ya no vale — ${e.porqueSobra}.\n` +
        `  Decia: "${e.porque}". Una excusa que sobra pre-aprueba lo que nadie volvio a mirar: ` +
        `se borra, o se convierte en cruce.`,
    );
  }

  const asientos = asientosDesalineados(
    leerDelProducto(FUENTE_ASIENTOS),
    limitesDelProducto(limites),
    preciosSitio,
  );
  if (asientos === null) {
    console.error(
      `NO PUDE MEDIR: no pude leer \`topeDe\` de ${FUENTE_ASIENTOS} del producto, asi que no se ` +
        `a que planes les vende usuarios extra. Si cambio de forma, arreglar ` +
        `\`alcanceDeAsientosDelProducto\` ANTES de creerle a un verde.`,
    );
    process.exit(NO_PUDE_MEDIR);
  }
  for (const p of asientos) {
    console.error(
      `ROJO: usuarios extra — ${p}.\n` +
        `  Publicar que un add-on es de UN plan cuando el producto lo vende en varios manda al ` +
        `lead a subir de plan, que es mas caro: al de Profesional le costaba Bs 330/mes de mas ` +
        `(1.290 en vez de 890 + 70). Manda el producto (CLAUDE.md): se corrige \`asientosExtra\` ` +
        `del plan en src/lib/pricing.ts — la frase de la carta se deriva sola de ahi.`,
    );
  }

  if (
    difieren.length === 0 &&
    ciclos.difieren.length === 0 &&
    nombres.difieren.length === 0 &&
    asientos.length === 0 &&
    !coberturaRota
  ) {
    console.log(
      `VERDE: las ${CIFRAS.length} cifras que publica el sitio son las que cobra el producto, ` +
        `las ${Object.keys(CAPACIDADES_CRUZADAS).length} capacidades que el producto decide por plan ` +
        `estan todas cruzadas o excusadas, ` +
        `las ${numerosPublicados(preciosSitio).length} del \`incluye\` de los planes estan todas cruzadas, ` +
        `los ${PLANES_EN_ORDEN.length} planes comprables coinciden en quien puede sumar usuarios pagando, ` +
        `los ${CICLOS_EQUIVALENCIA.length} planes comprables ofrecen los mismos ciclos en los dos lados ` +
        `y se llaman igual en las dos pantallas de la compra.`,
    );
    process.exit(COINCIDEN);
  }

  for (const n of nombres.difieren) {
    console.error(
      `ROJO: plan ${n.plan} — el producto lo llama "${n.producto}" y ${n.donde} lo llama "${n.sitio}".\n` +
        `  El lead elige un plan con un nombre y en el checkout paga otro: "${n.sitio}" no existe ` +
        `en app.onia.com.bo. Manda el producto (CLAUDE.md): se corrige NOMBRE_DE_PLAN en ` +
        `src/lib/pricing.ts — el nombre NO se tipea en la prosa, se interpola.`,
    );
  }

  for (const c of ciclos.difieren) {
    console.error(
      c.producto
        ? `ROJO: plan ${c.plan} — el producto lo cobra SEMANAL y el sitio dice que no se fracciona.\n` +
          `  El sitio le esconde al lead la forma mas barata de entrar a ese plan. ` +
          `Manda el producto (CLAUDE.md): se corrige el \`semanal\` del plan en src/lib/pricing.ts.`
        : `ROJO: plan ${c.plan} — el sitio ofrece pago SEMANAL y el producto no lo cobra asi.\n` +
          `  El lead elige semanal y el checkout se lo rechaza ("Solo mensual o anual"). ` +
          `Manda el producto (CLAUDE.md): se corrige el \`semanal\` del plan en src/lib/pricing.ts.`,
    );
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
