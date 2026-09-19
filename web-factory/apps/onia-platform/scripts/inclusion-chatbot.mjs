#!/usr/bin/env node
/**
 * ¿A quién le dice el SITIO que el chatbot "ya viene adentro", y a quién le cobra los Bs 390?
 *
 * POR QUE EXISTE. La escalera C (2026-09-12) le dio al catálogo del producto un booleano nuevo
 * por plan —`whatsappIncluded` en `onia-platform/lib/plan-catalogo.ts`, hoy `true` sólo en
 * `clinic` y `enterprise`— que decide si el chatbot viene pagado ADENTRO. En toda esta app había
 * UNA sola mención de ese nombre y era un COMENTARIO (`src/lib/pricing.ts`), o sea que la promesa
 * no estaba atada a nada.
 *
 * Y no era un riesgo futuro: medido el 2026-09-13 en la home SERVIDA, la FAQ contestaba
 *
 *     «¿El chatbot de WhatsApp está incluido?» → «No: es un servicio aparte, Bs 390/mes...»
 *
 * mientras la tabla de precios del MISMO sitio decía «incluido solo en Full». Un cliente de Full
 * leía que tenía que pagar Bs 390/mes aparte por algo que su plan ya le da — y esa respuesta
 * viajaba además en el JSON-LD, así que era lo que mostraba el buscador.
 *
 * POR QUE NINGUN GATE LO VEIA. Los gates de plata atan CIFRAS: cada monto se relee de la fuente y
 * salta si cambió. Esto no es una cifra, es un BOOLEANO — y `390` sigue siendo un monto legítimo
 * de `pricing.ts` mientras el texto miente. Una afirmación estructurada como booleano es invisible
 * para todo patrón que busque montos o textos prohibidos.
 *
 * QUE PREGUNTA, y por qué son TRES y no una:
 *
 *   1. COBERTURA (falla cerrado). Cada plan que el catálogo da por incluido tiene que estar dicho
 *      en algún texto del sitio. Es la única de las tres que se pone roja el día que alguien mueva
 *      el booleano a un plan nuevo —agregarle el chatbot al Profesional es exactamente el
 *      movimiento que la escalera C invita—, porque el veredicto se arma EXIGIENDO la marca, no
 *      buscando su ausencia. Redacción nueva ⇒ rojo ⇒ alguien la lee.
 *   2. NEGACION UNIVERSAL. Ningún texto puede negar la inclusión sin nombrar a quién se la niega,
 *      si hay algún plan que sí la trae. Es el defecto que estaba vivo: la negación categórica de
 *      la FAQ no nombraba plan, así que le hablaba también al cliente de Full.
 *   3. SIMETRICA. Ningún texto puede dar por incluido un plan que el catálogo cobra aparte —la
 *      promesa que el producto no cumple, que se descubre cobrando.
 *
 * La (3) y la mitad positiva de la (1) las contesta `promesa-inclusion.mjs`, el módulo puro que
 * el carril del bot escribió para su gemelo (`hermes-content/deploy/vps-ops/bot/`). Lo que se
 * agrega acá es la (2), que el bot no necesita porque enumera planes en cada frase y el sitio, en
 * cambio, contesta preguntas generales.
 *
 * 🔴 ESE MODULO ES UN ESPEJO BYTE A BYTE, y acá decía «se IMPORTA, no se copia» — corregido el
 * 2026-09-17, porque esa regla mandaba al revés. Importarlo con `../../../../hermes-content/...`
 * es lo que estuvo escrito, y es imposible en producción: el publicador de la landing empaqueta
 * con `git archive` SOLO el subárbol `web-factory/`, así que ese import resuelve en el repo y NO
 * en el stage. La cadena y el CI pasaban verdes —acá el hermano existe— y la publicación de
 * onia.com.bo murió dos corridas seguidas con `ERR_MODULE_NOT_FOUND`.
 *
 * El miedo que motivaba aquella regla es real y sigue cubierto, pero por un gate y no por una
 * frase: dos detectores hermanos que divergen es la falla que este repo ya pagó, así que
 * `promesa-inclusion-espejo.test.ts` exige que las dos copias sean idénticas y se pone rojo si
 * alguien edita una sola. Y que ningún archivo de `web-factory/` vuelva a importar hacia afuera
 * del subárbol lo sostiene `imports-que-viajan-al-stage.test.ts`, derivado del disco.
 *
 * POR QUE NO ES UN TEST DE `prebuild`. El producto es otro repositorio y no está en este worktree:
 * un test que lo exigiera se pondría rojo por AMBIENTE en toda máquina que no lo tenga, y el
 * integrador corre la cadena entera antes de tocar `main`. Va como los otros cruces del carril
 * (`precios:fuente`, `rubros:vivos`, `deploy:vivo`): alias suelto, corrido cada vuelta, y con
 * código 2 (NO MEDIDO) cuando no alcanza su fuente. El detector sí tiene self-check puro en la
 * cadena: `inclusion-chatbot.test.ts`.
 *
 * COMO NO FALLA EN VERDE. El verde exige haber leído las dos fuentes y haber tenido SUJETO: si el
 * catálogo no se puede leer, si ningún plan declara el booleano, o si el barrido del sitio se
 * queda sin archivos, sale ROJO DE INSTRUMENTO (código 2), nunca verde.
 *
 * Uso:
 *   node scripts/inclusion-chatbot.mjs
 *   ONIA_PLATFORM_REPO=/otra/ruta node scripts/inclusion-chatbot.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import {
  mencionesDePlanes,
  normalizar,
  revisarPromesaDeInclusion,
} from "./promesa-inclusion.mjs";
import {
  FUENTE_ADDONS,
  FUENTE_LIMITES,
  PLANES_EN_ORDEN,
  PLAN_COTIZADO,
  leerDelRef,
  refreshRef,
} from "./precios-fuente.mjs";

export const COINCIDEN = 0;
export const DESALINEADO = 1;
export const NO_PUDE_MEDIR = 2;

const AQUI = dirname(fileURLToPath(import.meta.url));
const APP = dirname(AQUI);

/**
 * Frases con las que un texto NIEGA que el chatbot venga adentro.
 *
 * A diferencia de las marcas de inclusión —que fallan cerrado porque el veredicto las EXIGE—,
 * ésta es una lista que sólo puede acusar, así que una redacción nueva de la negación no la ve
 * nadie. Esa mitad la cubre la pregunta 1: el plan incluido que nadie nombra cae igual, venga la
 * negación escrita como venga.
 */
const NEGACIONES = [
  "servicio aparte",
  "producto aparte",
  "va aparte",
  "van aparte",
  "se paga aparte",
  "se cobra aparte",
  "cuesta aparte",
  "no esta incluido",
  "no viene incluido",
  "no viene adentro",
  "no lo incluye",
  "no incluye el chatbot",
  "no entra en el plan",
  "no entra en ningun plan",
];

/**
 * El texto que un archivo de la app le puede mostrar a un lead.
 *
 * Recorre el fuente distinguiendo strings de comentarios en una sola pasada, y por eso hace las
 * dos cosas que este gate necesita y un `grep` no puede:
 *  · los COMENTARIOS quedan fuera. Hoy la única mención de `whatsappIncluded` en toda la app es un
 *    comentario, y un comentario que afirma una garantía no es una correa: es una hipótesis con
 *    fecha. Si contara como texto, el sitio quedaría absuelto por su propia documentación.
 *  · un `//` DENTRO de un string (`https://...`) no abre un comentario, que es como un blanqueador
 *    ingenuo se come media línea y absuelve lo que venía después.
 *
 * Las interpolaciones `${...}` de los backticks se reemplazan por un espacio: adentro hay código
 * (`bs(CHATBOT_MENSUAL)`), no prosa, y pegarlo crearía palabras que nadie escribió.
 */
export function textosVisibles(fuente) {
  const textos = [];
  const s = String(fuente ?? "");
  let i = 0;

  while (i < s.length) {
    const c = s[i];

    if (c === "/" && s[i + 1] === "/") {
      while (i < s.length && s[i] !== "\n") i += 1;
      continue;
    }
    if (c === "/" && s[i + 1] === "*") {
      i += 2;
      while (i < s.length && !(s[i] === "*" && s[i + 1] === "/")) i += 1;
      i += 2;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      const { texto, fin } = leerLiteral(s, i);
      if (texto !== null) textos.push(texto);
      i = fin;
      continue;
    }
    i += 1;
  }

  // Sólo prosa: una clase de CSS, una ruta o un identificador no tienen espacios, y un literal de
  // una sola palabra no puede sostener ni una negación ni una marca de inclusión.
  return textos.filter((t) => /\s/.test(t.trim()) && /[a-záéíóúñ]/i.test(t));
}

function leerLiteral(s, desde) {
  const comilla = s[desde];
  let i = desde + 1;
  let texto = "";
  while (i < s.length) {
    const c = s[i];
    if (c === "\\") {
      texto += " ";
      i += 2;
      continue;
    }
    if (c === comilla) return { texto, fin: i + 1 };
    if (comilla !== "`" && c === "\n") return { texto: null, fin: i + 1 };
    if (comilla === "`" && c === "$" && s[i + 1] === "{") {
      let nivel = 1;
      const abre = i + 2;
      i += 2;
      while (i < s.length && nivel > 0) {
        if (s[i] === "{") nivel += 1;
        else if (s[i] === "}") nivel -= 1;
        i += 1;
      }
      // Adentro hay CODIGO, no prosa, así que no se pega: se deja su nombre entre marcas. Sin eso,
      // `${nombresConChatbot()} ya trae el chatbot` pierde al sujeto y el gate termina exigiendo
      // que el plan se tipee a mano — justo lo contrario de lo que este archivo existe para lograr.
      texto += ` \u00ab${s.slice(abre, i - 1).trim()}\u00bb `;
      continue;
    }
    texto += c;
    i += 1;
  }
  return { texto: null, fin: i };
}

/**
 * ¿Este texto niega la inclusión, y a quién se la niega?
 *
 * La ventana es la CLAUSULA, igual que en las marcas de inclusión y por el mismo motivo: el sitio
 * escribe «incluido solo en Full, o aparte a Bs 390» en una sola oración, así que juzgar por
 * oración convertiría una frase correcta en una negación universal. Se mira desde el separador
 * anterior hasta el siguiente, y se pregunta si ahí adentro hay algún plan nombrado.
 */
export function negacionesDelTexto(texto, labels, vecindad = texto) {
  const plano = normalizar(texto);
  const encontradas = [];

  // De qué se niega la inclusión. Sin esta pregunta el gate acusa a cualquier "se paga aparte" del
  // sitio: medido el 2026-09-13, `content/requisitos.ts` explica que el dominio y el hosting de una
  // web van a nombre del cliente —"Lo que se paga aparte y va a TU nombre"— y salía acusado de
  // negarle el chatbot al plan Full.
  //
  // La ventana es la VECINDAD y no el literal, porque el sujeto suele estar en el literal de al
  // lado: la FAQ guarda `{q, a}` en dos campos, y la respuesta que hay que juzgar —"No: es un
  // servicio aparte"— no nombra el chatbot por ningún lado. Es su pregunta la que lo nombra.
  if (!/chatbot|whatsapp/.test(normalizar(vecindad))) return encontradas;

  for (const negacion of NEGACIONES) {
    let desde = 0;
    for (;;) {
      const pos = plano.indexOf(negacion, desde);
      if (pos === -1) break;
      desde = pos + negacion.length;

      const clausula = clausulaAlrededor(plano, pos, pos + negacion.length);
      const planes = [
        ...new Set(mencionesDePlanes(plano.slice(clausula.desde, clausula.hasta), labels).map((m) => m.plan)),
      ];
      encontradas.push({ negacion, planes, frase: plano.slice(clausula.desde, clausula.hasta).trim() });
    }
  }
  return encontradas;
}

/** Los límites de la cláusula que contiene `[desde, hasta)`: coma, punto, punto y coma o guión. */
function clausulaAlrededor(plano, desde, hasta) {
  const corte = /[.,;:—–\n(){}]|\s-\s/g;
  let inicio = 0;
  let fin = plano.length;
  for (const m of plano.matchAll(corte)) {
    const p = m.index + m[0].length;
    if (p <= desde) inicio = p;
    else if (m.index >= hasta) {
      fin = m.index;
      break;
    }
  }
  return { desde: inicio, hasta: fin };
}

/**
 * Cruza la CAPACIDAD (el catálogo del producto) contra la PROMESA (lo que publica el sitio).
 *
 * Puro a propósito: recibe el catálogo ya leído y los textos ya extraídos. Quien lo llama con las
 * fuentes reales es `medir()`, abajo.
 *
 * @param {object} args
 * @param {Record<string, boolean>} args.incluidoPorPlan planId → `whatsappIncluded` del catálogo.
 * @param {Record<string, string>}  args.labels          planId → nombre que lee el cliente.
 * @param {Record<string, string[]>} [args.alias]        planId → nombres con que lo publica el sitio.
 * @param {Record<string, boolean>}  [args.espejo]       planId → `chatbotIncluido` de este repo.
 * @param {{archivo: string, texto: string, vecindad?: string}[]} args.textos
 */
export function revisarSitio({ incluidoPorPlan, labels, alias = {}, espejo = {}, textos }) {
  // PREGUNTA 0, la correa DURA y la única que no pasa por la prosa: el espejo que publica este
  // repo (`chatbotIncluido` en src/lib/pricing.ts) contra el booleano del producto. Sin ella el
  // gate falla EN VERDE y está medido: los textos derivan del espejo con `nombresConChatbot()`,
  // así que mover `whatsappIncluded` en el producto no cambiaba una sola palabra del sitio y las
  // tres preguntas de prosa seguían contentas — el sitio se estaba comparando consigo mismo.
  const desacuerdos = [];
  for (const [plan, loTrae] of Object.entries(incluidoPorPlan)) {
    if (!(plan in espejo)) continue;
    if (espejo[plan] === loTrae) continue;
    desacuerdos.push(
      `src/lib/pricing.ts: "${alias[plan]?.[0] ?? labels[plan] ?? plan}" tiene chatbotIncluido=` +
        `${espejo[plan]} y el catálogo publicado del producto dice whatsappIncluded=${loTrae}. ` +
        `Manda el producto: es el que cobra.`,
    );
  }
  const problemas = [];
  const avisos = [];
  const dichos = new Set();
  const nombrados = new Set();

  // El sitio y el producto NO le dicen igual al mismo plan: `clinic` es "Completo" en
  // `PLAN_LABELS` y "Full" en la tabla de precios de esta app (la equivalencia vive en
  // `precios-fuente.mjs`, que es de donde sale). Buscando un solo juego de nombres el cruce queda
  // CIEGO —medido: "planes que el sitio dice incluidos: ninguno" con la tabla diciéndolo bien— y
  // encima acusa de no decirlo a un sitio que lo dice con el otro nombre. Se pasa cada juego y se
  // unen los veredictos.
  const juegos = juegosDeNombres(labels, alias);

  /**
   * Los planes que ESTE SITIO vende, que no son todos los del producto.
   *
   * 🔴 Acá decía que `enterprise` «existe en el catálogo y la tabla de precios no lo publica», y
   * esa frase —cierta cuando se escribió, falsa el 2026-09-19— es lo que absolvió el defecto:
   * con `enterprise` fuera de esta lista, `incluidosQueElSitioVende` quedaba en `["clinic"]`, la
   * pregunta 2 daba por completa una frase que remata en «en los demás planes va aparte, Bs 390»
   * y la pregunta 1 lo degradaba a AVISO («no miente, pero no lo está vendiendo»). El sitio SI lo
   * publica: Bs 2.900/mes en una sección entera de `/precios`, una línea en la home, y el
   * recomendador de `/v1/empezar` se lo propone a todo equipo de 15+. Lo que era cierto es la
   * otra mitad —el nombre del PRODUCTO, "Empresa", es palabra corriente y no sirve para buscarlo
   * en la prosa—, y por eso `PLAN_COTIZADO` declara el nombre con que lo publica el SITIO.
   *
   * Quién se vende sale de la tabla de equivalencias, no de una lista nueva.
   */
  const vendidos = Object.keys(alias);
  const incluidosQueElSitioVende = Object.entries(incluidoPorPlan)
    .filter(([plan, lo]) => lo === true && vendidos.includes(plan))
    .map(([plan]) => plan);

  for (const { archivo, texto, vecindad } of textos) {
   // La salvedad se decide con TODOS los juegos de nombres a la vez, no dentro del bucle: el texto
   // dice "Full" y el juego del producto dice "Completo", así que preguntado juego por juego uno de
   // los dos siempre contesta "acá no lo dice" y absuelve a nadie.
   const dichosAca = new Set(
     juegos.flatMap((l) => planesQueElTextoDaPorIncluidos({ incluidoPorPlan, labels: l, texto })),
   );
   // Un texto que INTERPOLA el helper no tipea el plan: lo deriva del espejo `chatbotIncluido`,
   // que la pregunta 0 ata al booleano del producto. Es más fuerte que escribir "Full" a mano —el
   // día que el booleano se mueva, la frase se mueve sola—, así que cuenta como dicho.
   if (/\u00ab[^\u00bb]*nombresConChatbot[^\u00bb]*\u00bb/.test(texto)) {
     // Cuenta también para la COBERTURA (pregunta 1), no sólo para la salvedad de este texto: el
     // sitio dejó de tipear "Completo" el 2026-09-19 —ahora lo deriva en las cinco superficies— y
     // sin esto la pregunta 1 lo daba por no dicho y pedía volver a escribirlo a mano, que es
     // exactamente el arreglo contrario al que este archivo existe para empujar.
     for (const p of Object.keys(espejo).filter((k) => espejo[k] === true)) {
       dichosAca.add(p);
       dichos.add(p);
     }
   }
   const yaDijoQuienLoTrae =
     incluidosQueElSitioVende.length > 0 && incluidosQueElSitioVende.every((p) => dichosAca.has(p));

   for (const labels of juegos) {
    // (3) y la mitad positiva de (1), con el detector del bot. Se juzga texto por texto: pegarlos
    // crearía cláusulas que nadie escribió, y una marca de un párrafo le aplicaría a un plan
    // nombrado en otro.
    const { problemas: delTexto } = revisarPromesaDeInclusion({ incluidoPorPlan, labels, texto });
    for (const p of delTexto) {
      // «No lo dice» no es un problema TEXTO POR TEXTO —ninguna frase tiene que nombrarlos todos—:
      // es la pregunta 1, y se contesta al final, sobre el sitio entero.
      if (/YA TRAE el chatbot incluido, y el texto/.test(p)) continue;
      problemas.push(`${archivo}: ${p}`);
    }
    for (const plan of planesQueElTextoDaPorIncluidos({ incluidoPorPlan, labels, texto })) dichos.add(plan);

    // (2) la negación sin sujeto.
    //
    // Salvedad, y pertenece a la AFIRMACION: si este mismo texto ya dijo que Full lo trae, su
    // «en los demás planes va aparte» está hablando de los demás y es verdad. Sin esta pregunta el
    // gate prohibiría la única redacción completa que existe —decir quién sí y quién no— y
    // empujaría a escribir la mitad. Sigue fallando cerrado: negar sin decir quién lo trae es rojo.
    for (const { planes, frase } of negacionesDelTexto(texto, labels, vecindad ?? texto)) {
      if (incluidosQueElSitioVende.length === 0) continue;
      if (planes.length === 0 && yaDijoQuienLoTrae) continue;

      if (planes.length === 0) {
        problemas.push(
          `${archivo}: «${frase}» niega que el chatbot venga incluido sin decir en qué plan, y ` +
            `${incluidosQueElSitioVende.map((p) => `"${nombreDe(p, labels, alias)}"`).join(" y ")} ` +
            `SI lo trae adentro: al cliente de ese plan le estamos cobrando Bs 390/mes por algo ` +
            `que ya pagó.`,
        );
        continue;
      }
      for (const plan of planes.filter((p) => incluidosQueElSitioVende.includes(p))) {
        problemas.push(
          `${archivo}: «${frase}» le niega el chatbot a "${nombreDe(plan, labels, alias)}" y el ` +
            `catálogo dice que lo trae incluido.`,
        );
      }
    }

    for (const m of mencionesDePlanes(texto, labels)) nombrados.add(m.plan);
   }
  }

  // (1) COBERTURA, la que falla cerrado: cada plan incluido tiene que estar DICHO en algún lado.
  for (const [plan, loTrae] of Object.entries(incluidoPorPlan)) {
    if (!loTrae || dichos.has(plan)) continue;
    const nombre = nombreDe(plan, labels, alias);
    if (!vendidos.includes(plan) || !nombrados.has(plan)) {
      // Un plan que el sitio no vende ni nombra (hoy `enterprise`) no puede mentir sobre su
      // inclusión: no lo cotiza. Es venta que se deja sobre la mesa, así que se dice sin pintar
      // rojo — la misma línea que traza el gemelo del bot.
      avisos.push(
        `"${nombre}" (${plan}) trae el chatbot incluido y el sitio no lo nombra en ningún lado: ` +
          `no miente, pero no lo está vendiendo.`,
      );
      continue;
    }
    problemas.push(
      `el catálogo dice que "${nombre}" (${plan}) YA TRAE el chatbot incluido y NINGUN texto del ` +
        `sitio lo dice: o se está vendiendo aparte algo que el plan ya da, o la redacción cambió y ` +
        `este gate dejó de reconocerla. Las dos se arreglan escribiéndolo.`,
    );
  }

  return {
    problemas: [...new Set([...desacuerdos, ...problemas])],
    avisos: [...new Set(avisos)],
    dichos: [...dichos],
  };
}

/** Cómo se le dice a este plan, prefiriendo el nombre con que lo publica el SITIO. */
function nombreDe(plan, labels, alias) {
  return alias[plan]?.[0] ?? labels[plan] ?? plan;
}

/**
 * Un juego de nombres por cada forma en que el sitio puede llamar a un plan.
 *
 * `mencionesDePlanes` recibe UN nombre por plan, así que los alias se resuelven corriendo el
 * detector una vez por juego. Son pocos (dos) y el texto es chico: sale más barato que abrirle una
 * dimensión al módulo del bot, que hoy no la necesita.
 */
function juegosDeNombres(labels, alias) {
  const cuantos = Math.max(1, ...Object.values(alias).map((a) => a.length));
  const juegos = [];
  for (let i = 0; i < cuantos; i += 1) {
    const juego = {};
    for (const plan of Object.keys(labels)) {
      const nombre = alias[plan]?.[i] ?? (i === 0 ? labels[plan] : null);
      if (nombre) juego[plan] = nombre;
    }
    juegos.push(juego);
  }
  // El nombre del PRODUCTO siempre entra: si el sitio empieza a usarlo, el cruce lo ve igual.
  juegos.push(labels);
  return juegos;
}

/** Qué planes da ESTE texto por incluidos, según el detector del bot. */
function planesQueElTextoDaPorIncluidos({ incluidoPorPlan, labels, texto }) {
  const sinNinguno = Object.fromEntries(Object.keys(incluidoPorPlan).map((p) => [p, false]));
  const { problemas } = revisarPromesaDeInclusion({ incluidoPorPlan: sinNinguno, labels, texto });
  // Con el catálogo puesto en «ninguno trae nada», todo problema que quede es del tipo «el texto lo
  // da por incluido». Preguntárselo así en vez de reimplementarlo mantiene UN solo detector.
  const dados = [];
  for (const [plan, nombre] of Object.entries(labels)) {
    if (problemas.some((p) => p.includes(`"${nombre}" (${plan})`))) dados.push(plan);
  }
  return dados;
}

/** `PLAN_LIMITS` del catálogo publicado → `{ [planId]: whatsappIncluded }`. Derivado, no a mano. */
export function incluidoPorPlanDelCatalogo(fuente) {
  const desde = fuente.indexOf("export const PLAN_LIMITS");
  if (desde === -1) return null;
  const siguiente = fuente.indexOf("\nexport ", desde + 1);
  const bloque = fuente.slice(desde, siguiente === -1 ? undefined : siguiente);

  const porPlan = {};
  for (const m of bloque.matchAll(/^ {2}(\w+): \{([\s\S]*?)^ {2}\},/gm)) {
    const incluido = /whatsappIncluded:\s*(true|false)/.exec(m[2]);
    if (!incluido) return null;
    porPlan[m[1]] = incluido[1] === "true";
  }
  return Object.keys(porPlan).length >= 4 ? porPlan : null;
}

/** `PLAN_LABELS` del producto → `{ [planId]: "nombre que lee el cliente" }`. */
export function labelsDelProducto(fuente) {
  const desde = fuente.indexOf("export const PLAN_LABELS");
  if (desde === -1) return null;
  const siguiente = fuente.indexOf("\nexport ", desde + 1);
  const bloque = fuente.slice(desde, siguiente === -1 ? undefined : siguiente);
  const labels = {};
  for (const m of bloque.matchAll(/^ {2}(\w+): "([^"]+)",/gm)) labels[m[1]] = m[2];
  return Object.keys(labels).length >= 4 ? labels : null;
}

/**
 * planId del producto → los nombres con que lo publica EL SITIO.
 *
 * No es una lista nueva: sale de `PLANES_EN_ORDEN`, la tabla de equivalencias que ya cruza los
 * montos. El plan que entre mañana entra solo — el mismo motivo por el que esa tabla dejó de estar
 * tipeada a mano cuando `crece` nació mudo.
 */
export function aliasDelSitio(planes = [...PLANES_EN_ORDEN, PLAN_COTIZADO]) {
  /** @type {Record<string, string[]>} */
  const alias = {};
  // Además del nombre literal, las formas DERIVADAS con que el sitio lo pinta. El extractor deja
  // cada `${…}` como «código» entre guillemets, así que acá llegan como texto.
  //
  // ⚠️ Sin esto el gate se pone rojo contra su propia cura, y empuja al arreglo contrario.
  // Medido el 2026-09-18 sobre `origin/main`: `src/lib/pricing.ts:475` dice
  // «El chatbot de WhatsApp — ${NOMBRE_DE_PLAN.full} ya lo trae incluido; acá va aparte, Bs 390»
  // —correcto y derivado, la forma que `capacidad-incluida.test.ts` EXIGE— y este guión lo
  // acusaba de «niega la inclusión sin nombrar a quién», con el veredicto DESALINEADO. Obedecerlo
  // significaba tipear "Completo" a mano, que es justo lo que el gate hermano prohíbe: dos gates
  // del mismo hecho pidiendo lo contrario, y el que manda es derivar.
  for (const p of planes) {
    alias[p.producto] = [
      p.etiqueta,
      `NOMBRE_DE_PLAN.${p.sitio}`,
      `plan("${p.sitio}").nombre`,
      // Nombra de una a TODOS los que traen el chatbot adentro: si el sitio lo llama así, el plan
      // incluido queda dicho sin que nadie escriba su nombre.
      "nombresConChatbot()",
    ];
  }
  return alias;
}

/**
 * `chatbotIncluido` de `src/lib/pricing.ts` → `{ [planId del PRODUCTO]: boolean }`.
 *
 * Se lee del texto y no se importa el módulo porque este guión es `.mjs` y el espejo es TypeScript
 * con alias de paths: cargarlo exigiría el build. La equivalencia de ids sale de `PLANES_EN_ORDEN`.
 */
export function espejoDelSitio(fuente, planes = PLANES_EN_ORDEN, cotizado = PLAN_COTIZADO) {
  const porIdDelSitio = {};
  for (const m of fuente.matchAll(/\bid: "(\w+)",[\s\S]*?\bchatbotIncluido: (true|false),/g)) {
    porIdDelSitio[m[1]] = m[2] === "true";
  }
  const espejo = {};
  for (const p of planes) {
    if (p.sitio in porIdDelSitio) espejo[p.producto] = porIdDelSitio[p.sitio];
  }
  if (Object.keys(espejo).length < planes.length) return null;

  // El plan cotizado no es una tarjeta de la escalera: no tiene `id:`, es una constante con
  // nombre propio (`GRUPO`). Se lee aparte o queda fuera del espejo, y entonces la pregunta 0 no
  // lo cruza contra el producto y la salvedad de `nombresConChatbot()` no lo cuenta como dicho.
  // Su ausencia NO invalida la medición de los otros cuatro: se declara si está.
  const suyo = new RegExp(`export const ${cotizado.sitio} = \\{[\\s\\S]*?\\bchatbotIncluido: (true|false),`).exec(fuente);
  if (suyo) espejo[cotizado.producto] = suyo[1] === "true";
  return espejo;
}

/** Los archivos del sitio que le pueden hablar a un lead. Derivados del DISCO, no de una lista. */
export function archivosDelSitio(dir = join(APP, "src"), base = join(APP, "src")) {
  const salida = [];
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) {
      salida.push(...archivosDelSitio(ruta, base));
      continue;
    }
    if (!/\.tsx?$/.test(entrada.name)) continue;
    // Un test no se le muestra a nadie, y encima cita textos viejos a propósito para afirmar sobre
    // ellos. La exención cuesta cobertura, así que el caso ancla del self-check exige que el
    // archivo donde vivió el defecto siga DENTRO del universo.
    if (/\.test\.tsx?$/.test(entrada.name)) continue;
    salida.push(ruta);
  }
  return salida.sort();
}

function medir() {
  refreshRef();
  const catalogo = leerDelRef(FUENTE_LIMITES);
  const addons = leerDelRef(FUENTE_ADDONS);
  if (!catalogo || !addons) {
    return {
      codigo: NO_PUDE_MEDIR,
      lineas: [
        `NO MEDIDO: no pude leer ${FUENTE_LIMITES} / ${FUENTE_ADDONS} del ref publicado del producto.`,
        "Sin el catálogo este cruce no vale nada, así que sale 2 en vez de verde.",
        "Pasá ONIA_PLATFORM_REPO=<ruta al clon de onia-platform>.",
      ],
    };
  }

  const incluidoPorPlan = incluidoPorPlanDelCatalogo(catalogo);
  const labels = labelsDelProducto(addons);
  if (!incluidoPorPlan || !labels) {
    return {
      codigo: NO_PUDE_MEDIR,
      lineas: [
        "NO MEDIDO: el catálogo publicado cambió de forma (PLAN_LIMITS / PLAN_LABELS / whatsappIncluded).",
        "Un plan sin el booleano declarado no se puede juzgar: se arregla el lector, no el sitio.",
      ],
    };
  }

  const archivos = archivosDelSitio();
  if (archivos.length < 50) {
    return {
      codigo: NO_PUDE_MEDIR,
      lineas: [`NO MEDIDO: el barrido del sitio encontró ${archivos.length} archivos, es muy poco.`],
    };
  }

  const textos = [];
  for (const ruta of archivos) {
    const delArchivo = textosVisibles(readFileSync(ruta, "utf8"));
    for (const [i, texto] of delArchivo.entries()) {
      textos.push({
        archivo: relative(APP, ruta),
        texto,
        // El literal de al lado, que es donde suele estar el sujeto: `{q, a}` de una FAQ son dos
        // campos, y la respuesta que hay que juzgar no nombra el chatbot — lo nombra la pregunta.
        vecindad: [delArchivo[i - 1], texto, delArchivo[i + 1]].filter(Boolean).join(" "),
      });
    }
  }

  const espejo = espejoDelSitio(readFileSync(join(APP, "src", "lib", "pricing.ts"), "utf8"));
  if (!espejo) {
    return {
      codigo: NO_PUDE_MEDIR,
      lineas: [
        "NO MEDIDO: no pude leer chatbotIncluido de src/lib/pricing.ts para los planes publicados.",
        "Es la correa dura del cruce: sin ella el sitio se compara consigo mismo y firma verde.",
      ],
    };
  }

  const { problemas, avisos, dichos } = revisarSitio({
    incluidoPorPlan,
    labels,
    alias: aliasDelSitio(),
    espejo,
    textos,
  });
  const incluidos = Object.entries(incluidoPorPlan).filter(([, lo]) => lo).map(([p]) => p);

  const lineas = [
    `catálogo publicado: ${Object.keys(incluidoPorPlan).length} planes · traen el chatbot adentro: ` +
      `${incluidos.map((p) => labels[p] ?? p).join(", ") || "ninguno"}`,
    `sitio barrido: ${archivos.length} archivos · ${textos.length} textos`,
    `planes que el sitio dice incluidos: ${dichos.map((p) => labels[p] ?? p).join(", ") || "ninguno"}`,
    ...avisos.map((a) => `AVISO  ${a}`),
  ];

  if (problemas.length > 0) {
    lineas.push("", "DESALINEADO — lo que el sitio promete no es lo que el producto entrega:");
    lineas.push(...problemas.map((p) => `  - ${p}`));
    return { codigo: DESALINEADO, lineas };
  }
  lineas.push("", "VERDE: lo que el sitio dice de la inclusión coincide con el catálogo publicado.");
  return { codigo: COINCIDEN, lineas };
}

// Sólo mide cuando se lo invoca: importarlo desde el self-check no puede disparar la medición viva.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { codigo, lineas } = medir();
  console.log(lineas.join("\n"));
  process.exit(codigo);
}
