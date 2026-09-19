#!/usr/bin/env node
/**
 * ¿Algún texto que el bot SIRVE promete que la prueba trae TODO?
 *
 * POR QUE EXISTE, con la medición que lo pidió. El 2026-09-19, los inboxes 4 (widget de
 * onia.com.bo) y 5 (WhatsApp) —los dos de leads REALES— servían esta FAQ, publicada desde el
 * panel el 18-sep 21:51 y disparada por los tags `probar`/`pagar`/`semanas`, que son la pregunta
 * más común del embudo:
 *
 *     «Sí: tenés dos semanas de prueba con TODO EL SISTEMA, sin tarjeta.»
 *
 * Y la prueba NO trae todo: `TRIAL_PLAN` es `professional` (onia-platform
 * `lib/subscription/plan-state.ts`), que en `PLAN_LIMITS` declara `whatsappIncluded: false` y
 * `multiAdminIncluded: false`. O sea que al lead se le prometía, entre otras cosas, el chatbot
 * de WhatsApp — que es EXACTAMENTE lo que ese bot le está vendiendo — y al entrar no lo iba a
 * encontrar. El comentario del propio producto ya lo decía en otras palabras: «se entrega el
 * nivel intermedio completo», intermedio, no todo.
 *
 * POR QUE NINGUN GATE LO VEIA, que es la parte que se repite:
 *
 *   - **Vive sólo en la capa editable.** `grep -oiE "todo el sistema|todas las funciones|..."`
 *     sobre `knowledge.onia.json` y `config.mjs` da CERO: la frase no está en el repo. La fila
 *     del panel gana sobre el archivo por id (`mergePanelKnowledge`), así que todo gate que mida
 *     el repo firma verde para siempre. Es la misma familia de «un artefacto gitignoreado que
 *     producción sirve es invisible para todo gate de repo», con el agravante de que acá el
 *     texto ni siquiera existe en un archivo: es una fila de base que escribe el panel.
 *   - **No mueve una cifra**, así que los cruces de precio (`precios:vivos`, `test:precios-bot`)
 *     firman verde: no hay ningún monto en la oración.
 *   - **No tipea un nombre de plan junto a una capacidad**, así que los gates de atribución
 *     (`promesa-inclusion.mjs`) firman verde: no nombra ningún plan.
 *
 * El hermano de esta clase ya estaba cerrado EN EL SITIO por otro carril —
 * `web-factory/apps/onia-platform/src/app/(sitio)/prueba-vs-plan.test.ts`, casos 6 y 7 — y su
 * lección terminaba con «vale para el bot, las propuestas y el panel, que usan la palabra igual
 * de suelta». Nadie la había cerrado en el bot. Esto es esa mitad.
 *
 * COMO SE JUZGA, y por qué así:
 *
 *   - El universo de capacidades sale del CATALOGO PUBLICADO, nunca de una lista acá: un plan o
 *     un booleano nuevo entra solo. Si algún día `TRIAL_PLAN` pasara a traer TODOS los
 *     `*Included`, la promesa sería cierta y este gate SE APAGA SOLO — no hay que acordarse de
 *     borrarlo. Esa es la diferencia con prohibir el texto viejo, que se apaga el día que la
 *     respuesta correcta sea ese texto.
 *   - Se prohíbe la FORMA (cuantificador universal de alcance en la misma oración que la
 *     prueba), no el literal: «todo el sistema», «todas las funciones» y «acceso total» son la
 *     misma mentira escrita distinto.
 *   - La ventana es la ORACION, no el documento: una salvedad tres párrafos abajo no absuelve la
 *     afirmación, y otro sujeto del mismo tema tampoco.
 *   - **Absuelve si la oración NOMBRA el plan del trial.** «dos semanas con el plan Profesional
 *     completo» es honesto y tiene que seguir siendo escribible; lo que miente es el alcance sin
 *     dueño.
 *
 * Códigos de salida:
 *   0  ningún texto servido promete que la prueba trae todo (o el trial sí trae todo)
 *   1  ROJO: al menos un texto servido lo promete
 *   2  NO MEDIDO: no pude leer el catálogo o no pude leer ningún documento servido
 */

import { documentosServidos } from "./puerta-del-alta.mjs";
import { repoPlataforma, fuenteDePlataforma } from "./fuente-plataforma.mjs";
import { labelsDelProducto } from "./catalogo-inclusion.mjs";

// ---------------------------------------------------------------------------
// Núcleo puro
// ---------------------------------------------------------------------------

/**
 * Sin tildes y en minúsculas. El knowledge se edita a mano desde un panel, así que «Básico» y
 * «basico» conviven, y las formas verbales acentuadas son la regla en castellano.
 */
export function normalizar(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/**
 * Límites de palabra que SIRVEN en castellano.
 *
 * `\b` de JavaScript se define sobre `[A-Za-z0-9_]`, así que una palabra que empieza o termina
 * en vocal acentuada NUNCA tiene frontera: `/\btodo el sistema\b/` no matchea «…y todo el
 * sistema está». Acá el texto ya viene normalizado sin tildes, pero la trampa reaparece en
 * cuanto alguien agregue una forma con acento, y ya costó dos gates mudos en este repo.
 */
function conLimites(cuerpo, banderas = "u") {
  return new RegExp(String.raw`(?<![\p{L}\p{N}_])(?:${cuerpo})(?![\p{L}\p{N}_])`, banderas);
}

/** ¿La oración está hablando de LA PRUEBA? (si no, un universal ahí no promete nada del trial) */
const HABLA_DE_LA_PRUEBA = conLimites(
  [
    "prueba",
    "pruebas",
    "probar",
    "probarlo",
    "probarla",
    "gratis",
    "gratuita",
    "gratuito",
    "trial",
    "sin\\s+tarjeta",
    "\\d+\\s+dias",
    "dos\\s+semanas",
    "14\\s+dias",
  ].join("|"),
  "iu",
);

/**
 * Cuantificador universal de ALCANCE. Las tres formas de la familia, que ya aparecieron las tres
 * en superficie de venta: sobre EL TODO («todo el sistema»), sobre LAS PARTES («todos los
 * módulos») y sobre el ACCESO («acceso total», «sin límites»).
 *
 * Ojo con «completo»: desde la escalera C (2026-09-12) «Completo» es el NOMBRE de un plan
 * (Bs 1.290), así que «el sistema completo» promete ese plan y no es un adjetivo inocente.
 */
const ALCANCE_TOTAL = [
  { re: conLimites("todo\\s+el\\s+sistema", "iu"), marca: "todo el sistema" },
  { re: conLimites("todo\\s+el\\s+producto", "iu"), marca: "todo el producto" },
  { re: conLimites("sistema\\s+completo", "iu"), marca: "sistema completo" },
  { re: conLimites("todas\\s+las\\s+funciones", "iu"), marca: "todas las funciones" },
  { re: conLimites("todas\\s+las\\s+funcionalidades", "iu"), marca: "todas las funcionalidades" },
  { re: conLimites("todas\\s+las\\s+herramientas", "iu"), marca: "todas las herramientas" },
  { re: conLimites("todos\\s+los\\s+modulos", "iu"), marca: "todos los modulos" },
  { re: conLimites("todas\\s+las\\s+capacidades", "iu"), marca: "todas las capacidades" },
  { re: conLimites("acceso\\s+total", "iu"), marca: "acceso total" },
  { re: conLimites("todo\\s+incluido", "iu"), marca: "todo incluido" },
  { re: conLimites("sin\\s+limites", "iu"), marca: "sin limites" },
  { re: conLimites("sin\\s+restricciones", "iu"), marca: "sin restricciones" },
];

/**
 * `TRIAL_PLAN` del producto. Se lee del ref publicado; si cambia de nombre el gate TIRA en vez de
 * adivinar, porque un trial que no se pudo identificar no puede absolver a nadie.
 *
 * @param {string} fuente contenido de `lib/subscription/plan-state.ts`
 */
export function planDeLaPrueba(fuente) {
  const m = /export const TRIAL_PLAN\s*=\s*"([^"]+)"/.exec(String(fuente ?? ""));
  if (!m) throw new Error("no encontre TRIAL_PLAN en lib/subscription/plan-state.ts");
  return m[1];
}

/**
 * Qué `*Included` del catálogo NO trae el plan de la prueba.
 *
 * Derivado del bloque del plan, no de una lista acá: el día que el producto agregue un booleano
 * nuevo (pasó tres veces este mes) entra solo al universo. Si el plan trae todos en `true`, la
 * lista sale vacía y el gate se apaga solo — que es la única forma honesta de apagarlo.
 *
 * @param {string} fuente contenido de `lib/plan-catalogo.ts`
 * @param {string} plan   id del plan de la prueba
 * @returns {string[]} nombres de campo, ordenados
 */
export function capacidadesQueNoTrae(fuente, plan) {
  const texto = String(fuente ?? "");
  const desde = texto.indexOf("export const PLAN_LIMITS");
  if (desde === -1) throw new Error("no existe «export const PLAN_LIMITS» — lo renombraron");
  const siguiente = texto.indexOf("\nexport ", desde + 1);
  const tabla = texto.slice(desde, siguiente === -1 ? undefined : siguiente);

  const bloque = new RegExp(String.raw`^ {2}${plan}: \{([\s\S]*?)^ {2}\},`, "m").exec(tabla);
  if (!bloque) throw new Error(`el plan de la prueba ("${plan}") no esta en PLAN_LIMITS`);

  const faltantes = [];
  let vistos = 0;
  for (const m of bloque[1].matchAll(/(\w+Included):\s*(true|false)/g)) {
    vistos += 1;
    if (m[2] === "false") faltantes.push(m[1]);
  }
  if (vistos === 0) {
    throw new Error(`el plan "${plan}" no declara ningun *Included: el gate no puede juzgarlo`);
  }
  return faltantes.sort();
}

/** Nombre legible de una capacidad, para que el informe se pueda obedecer sin abrir el código. */
const LEGIBLE = Object.freeze({
  whatsappIncluded: "el chatbot de WhatsApp",
  multiAdminIncluded: "el segundo administrador",
  agentsIncluded: "los agentes de IA",
  publicBookingIncluded: "la agenda publica",
});

/** Cae al nombre del campo si no está en la tabla: nunca calla una capacidad por no saber nombrarla. */
export function comoSeLlama(campo) {
  return LEGIBLE[campo] ?? campo;
}

/**
 * Las oraciones de un texto que prometen que la prueba trae TODO.
 *
 * La ventana es la ORACION: una salvedad en el párrafo siguiente no absuelve la afirmación, y un
 * universal en una oración que no habla de la prueba no promete nada del trial.
 *
 * @param {string} texto
 * @param {string} labelDelTrial nombre del plan con que corre la prueba («Profesional»)
 * @returns {{oracion:string, marca:string}[]}
 */
export function prometeAlcanceTotalDeLaPrueba(texto, labelDelTrial) {
  const plano = normalizar(texto);
  const nombraElPlan = labelDelTrial ? conLimites(normalizar(labelDelTrial), "iu") : null;

  const hallazgos = [];
  for (const oracion of plano.split(/[.;!?\n]/)) {
    if (!HABLA_DE_LA_PRUEBA.test(oracion)) continue;
    // Nombrar el plan es la forma honesta de decirlo: «dos semanas con el plan Profesional
    // completo». Lo que miente es el alcance sin dueño, no la palabra.
    if (nombraElPlan?.test(oracion)) continue;
    const marca = ALCANCE_TOTAL.find(({ re }) => re.test(oracion));
    if (marca) hallazgos.push({ oracion: oracion.trim(), marca: marca.marca });
  }
  return hallazgos;
}

/** Todo el texto que un documento del knowledge le puede llegar a decir al lead. */
export function textosDelDocumento(doc) {
  const textos = [];
  const empujar = (v) => {
    if (typeof v === "string" && v.trim()) textos.push(v);
  };
  const data = doc?.data ?? doc ?? {};
  for (const item of Array.isArray(data.faq) ? data.faq : []) {
    empujar(item?.body);
    empujar(item?.title);
  }
  for (const [, v] of Object.entries(data.script ?? {})) empujar(v);
  return textos;
}

/**
 * El veredicto.
 *
 * Tri-estado de verdad: cero documentos NO es «ningún texto malo» —es no haber mirado— y un
 * catálogo ilegible no puede absolver. Los dos caen en 2, con el motivo, porque los remedios son
 * opuestos (mirar el acceso vs mirar el producto).
 */
export function juzgar({ documentos, plan, faltantes, label }) {
  if (faltantes === null || plan === null) {
    return { codigo: 2, texto: `NO MEDIDO — no pude leer el catalogo del producto: ${label}` };
  }
  if (faltantes.length === 0) {
    return {
      codigo: 0,
      texto:
        `el plan de la prueba ("${plan}") trae TODAS las capacidades del catalogo, asi que ` +
        "prometer alcance total ya no seria mentira: este gate se apago solo, como corresponde.",
    };
  }
  if (!Array.isArray(documentos) || documentos.length === 0) {
    return {
      codigo: 2,
      texto:
        "NO MEDIDO — no pude leer ningun documento de los que sirve el bot. Cero documentos no " +
        "es 'ningun texto malo'.",
    };
  }

  const sinMedir = documentos.filter((d) => d.doc === null || d.doc === undefined);
  const mirados = documentos.filter((d) => d.doc !== null && d.doc !== undefined);
  if (mirados.length === 0) {
    return {
      codigo: 2,
      texto: `NO MEDIDO — los ${documentos.length} documento(s) que sirve el bot no se pudieron leer.`,
    };
  }

  const problemas = [];
  for (const { de, doc } of mirados) {
    for (const texto of textosDelDocumento(doc)) {
      for (const { oracion, marca } of prometeAlcanceTotalDeLaPrueba(texto, label)) {
        problemas.push({ de, oracion, marca });
      }
    }
  }

  const noTrae = faltantes.map(comoSeLlama).join(", ");
  const cola =
    (sinMedir.length ? ` · ${sinMedir.length} documento(s) NO se pudieron leer: ${sinMedir.map((d) => d.de).join(", ")}` : "") +
    `\nla prueba corre con el plan "${plan}"${label ? ` (${label})` : ""} y NO trae: ${noTrae}.`;

  if (problemas.length === 0) {
    return {
      codigo: 0,
      texto:
        `NINGUN TEXTO SERVIDO PROMETE QUE LA PRUEBA TRAE TODO — ${mirados.length} documento(s) ` +
        `mirados (${mirados.map((d) => d.de).join(", ")}).${cola}`,
    };
  }

  const detalle = problemas
    .map(
      ({ de, oracion, marca }) =>
        `  - [${de}] dice «${marca}» hablando de la prueba: "${oracion.slice(0, 160)}"`,
    )
    .join("\n");
  return {
    codigo: 1,
    texto:
      `EL BOT VIVO PROMETE QUE LA PRUEBA TRAE TODO, Y NO LO TRAE:\n${detalle}${cola}\n` +
      "Se arregla en el texto que el bot SIRVE —que puede ser la fila del panel y no " +
      "knowledge.onia.json—: o se NOMBRA el plan de la prueba, o se enumera lo que si entra.",
  };
}

// ---------------------------------------------------------------------------
// Lector vivo
// ---------------------------------------------------------------------------

/** El catálogo del producto, tri-estado y sin excepciones hacia afuera. */
export function leerElTrial({ repo = repoPlataforma, fuente = fuenteDePlataforma } = {}) {
  try {
    const dir = repo();
    if (!dir) return { plan: null, faltantes: null, label: "no encontre el repo onia-platform" };
    const plan = planDeLaPrueba(fuente(dir, "subscription/plan-state.ts"));
    const faltantes = capacidadesQueNoTrae(fuente(dir, "plan-catalogo.ts"), plan);
    const labels = labelsDelProducto(fuente(dir, "pricing.ts"));
    return { plan, faltantes, label: labels[plan] ?? plan };
  } catch (error) {
    return { plan: null, faltantes: null, label: String(error?.message || error).slice(0, 200) };
  }
}

async function medir() {
  const { plan, faltantes, label } = leerElTrial();
  const { documentos } = plan === null ? { documentos: [] } : documentosServidos();
  const { codigo, texto } = juzgar({ documentos, plan, faltantes, label });
  console.log(texto);
  process.exit(codigo);
}

// ---------------------------------------------------------------------------
// Self-check — casos puros, sin red. Va en la cadena.
// ---------------------------------------------------------------------------

function selfCheck() {
  const fallos = [];
  const ok = (cond, que) => {
    if (!cond) fallos.push(que);
  };

  const CATALOGO = [
    "export const PLAN_LIMITS = {",
    "  basic: {",
    "    whatsappIncluded: false,",
    "    multiAdminIncluded: false,",
    "  },",
    "  professional: {",
    "    publicBookingIncluded: true,",
    "    agentsIncluded: true,",
    "    whatsappIncluded: false,",
    "    multiAdminIncluded: false,",
    "  },",
    "  enterprise: {",
    "    publicBookingIncluded: true,",
    "    agentsIncluded: true,",
    "    whatsappIncluded: true,",
    "    multiAdminIncluded: true,",
    "  },",
    "};",
    "",
    "export const OTRA = 1;",
  ].join("\n");

  ok(planDeLaPrueba('export const TRIAL_PLAN = "professional";') === "professional", "lee TRIAL_PLAN");
  let tiro = false;
  try {
    planDeLaPrueba("const otra = 1;");
  } catch {
    tiro = true;
  }
  ok(tiro, "sin TRIAL_PLAN TIRA, no adivina");

  ok(
    JSON.stringify(capacidadesQueNoTrae(CATALOGO, "professional")) ===
      JSON.stringify(["multiAdminIncluded", "whatsappIncluded"]),
    "deriva del catalogo lo que el trial NO trae",
  );
  // El apagado honesto: si el trial trae todo, la promesa deja de ser mentira.
  ok(capacidadesQueNoTrae(CATALOGO, "enterprise").length === 0, "un plan que trae todo no deja faltantes");
  // Un booleano NUEVO entra solo al universo — es la mitad que hace que el gate no envejezca.
  ok(
    capacidadesQueNoTrae(CATALOGO.replace("    agentsIncluded: true,", "    inventarioIncluded: false,"), "professional")
      .includes("inventarioIncluded"),
    "un *Included nuevo entra solo al universo",
  );

  // EL CASO ANCLA: el sujeto REAL medido en produccion el 2026-09-19 tiene que caer. Si esto
  // pasa a verde, el gate dejo de ver el texto que lo hizo nacer.
  const VIVO =
    "Sí: tenés dos semanas de prueba con todo el sistema, sin tarjeta. Te registrás en " +
    "app.onia.com.bo, elegís tu rubro y lo usás desde el primer día. Si no te sirve, no pagás nada.";
  ok(prometeAlcanceTotalDeLaPrueba(VIVO, "Profesional").length === 1, "CASO ANCLA: caza el texto vivo del 19-sep");
  // `?.` y no `[0]`: un caso que indexa una lista vacia TIRA y mata al reportero, asi que la
  // mutacion que vacia el detector se lee como TypeError en vez de como el assert que fallo —
  // medido validando este mismo archivo.
  ok(
    prometeAlcanceTotalDeLaPrueba(VIVO, "Profesional")[0]?.marca === "todo el sistema",
    "y nombra la forma exacta que lo delata",
  );

  // Las tres formas de la familia, que ya aparecieron las tres en superficie de venta.
  ok(prometeAlcanceTotalDeLaPrueba("Probalo 14 dias con todos los módulos encendidos", "Profesional").length === 1, "sobre las PARTES");
  ok(prometeAlcanceTotalDeLaPrueba("Prueba gratis con acceso total", "Profesional").length === 1, "sobre el ACCESO");
  ok(prometeAlcanceTotalDeLaPrueba("Dos semanas gratis, el sistema completo", "Profesional").length === 1, "«completo» es un PLAN desde la escalera C");

  // La ventana es la ORACION: el universal de otra oracion no se arrastra, y la salvedad de la
  // oracion siguiente TAMPOCO absuelve (que es el error simetrico, el caro).
  ok(
    prometeAlcanceTotalDeLaPrueba("Tenemos todo el sistema andando hace anios. El soporte contesta rapido.", "Profesional").length === 0,
    "un universal que NO habla de la prueba no promete nada del trial",
  );
  ok(
    prometeAlcanceTotalDeLaPrueba("Prueba de 14 dias con todo el sistema. El chatbot va aparte.", "Profesional").length === 1,
    "la salvedad de la oracion siguiente NO absuelve la afirmacion",
  );

  // La forma HONESTA tiene que seguir siendo escribible, o el gate empuja al arreglo contrario.
  ok(
    prometeAlcanceTotalDeLaPrueba("Dos semanas de prueba con el plan Profesional completo, sin tarjeta", "Profesional").length === 0,
    "nombrar el plan de la prueba ABSUELVE: es la forma honesta",
  );
  // ...y el de arriba NO prueba la absolucion: sin ella daria 0 igual, porque «Profesional
  // completo» no es ninguna de las formas prohibidas. Quitar la absolucion lo dejaba VERDE.
  // Este si la ejerce: trae una forma que SI matchea Y el nombre del plan en la misma oracion.
  ok(
    prometeAlcanceTotalDeLaPrueba("Dos semanas de prueba con todo el sistema del plan Profesional", "Profesional").length === 0,
    "con el plan NOMBRADO, una forma prohibida queda absuelta",
  );
  ok(
    prometeAlcanceTotalDeLaPrueba("Dos semanas de prueba con todo el sistema del plan Profesional", "Completo").length === 1,
    "y con OTRO plan como trial la misma oracion vuelve a ser mentira",
  );

  // La ventana es la ORACION. Sin este caso, mover la ventana al documento entero pasaba VERDE:
  // aca el universal y la prueba viven en oraciones DISTINTAS, asi que juntarlas inventa una
  // promesa que nadie escribio.
  ok(
    prometeAlcanceTotalDeLaPrueba("Tenemos todo el sistema andando hace anios. Escribinos y te damos una prueba.", "Profesional").length === 0,
    "universal y prueba en oraciones distintas NO se juntan",
  );

  // Acentos: `\b` de JS no tiene frontera contra una vocal acentuada, y en castellano eso deja
  // el detector mudo justo en el texto real, que viene acentuado del panel.
  ok(prometeAlcanceTotalDeLaPrueba("La prueba incluye todos los módulos", "Profesional").length === 1, "matchea con acento");
  ok(prometeAlcanceTotalDeLaPrueba("PRUEBA CON TODO EL SISTEMA", "Profesional").length === 1, "matchea en mayusculas");
  // ...y no matchea DENTRO de otra palabra.
  ok(prometeAlcanceTotalDeLaPrueba("prueba de acceso totalizador", "Profesional").length === 0, "no matchea dentro de otra palabra");

  // `textosDelDocumento` tiene que ver el body de la FAQ: ahi vivia el sujeto real.
  const doc = { data: { faq: [{ id: "negocio", body: VIVO, title: "¿Puedo probar Onia antes de pagar?" }] } };
  ok(textosDelDocumento(doc).includes(VIVO), "lee el body de la FAQ del panel");

  // Tri-estado: cero documentos y catalogo ilegible NO son verde, y sus remedios son opuestos.
  ok(juzgar({ documentos: [], plan: "professional", faltantes: ["whatsappIncluded"], label: "Profesional" }).codigo === 2, "cero documentos = NO MEDIDO");
  // El de arriba NO prueba su guardia: con `[]`, el hermano de abajo (`mirados.length === 0`)
  // devuelve 2 igual, asi que borrar el primero pasaba VERDE — dos guardias tapando el mismo
  // caso. El unico que SOLO ve el primero es el no-array: sin el, `.filter` de null TIRA y el
  // medidor muere en vez de decir que no midio.
  ok(juzgar({ documentos: null, plan: "professional", faltantes: ["whatsappIncluded"], label: "Profesional" }).codigo === 2, "documentos null = NO MEDIDO, no una excepcion");
  ok(juzgar({ documentos: [{ de: "x", doc: null }], plan: "professional", faltantes: ["whatsappIncluded"], label: "Profesional" }).codigo === 2, "documento ilegible = NO MEDIDO");
  ok(juzgar({ documentos: [{ de: "x", doc }], plan: null, faltantes: null, label: "se rompio" }).codigo === 2, "catalogo ilegible = NO MEDIDO");
  ok(juzgar({ documentos: [{ de: "x", doc }], plan: "professional", faltantes: [], label: "Profesional" }).codigo === 0, "trial que trae todo apaga el gate");
  ok(juzgar({ documentos: [{ de: "fila inbox 4", doc }], plan: "professional", faltantes: ["whatsappIncluded"], label: "Profesional" }).codigo === 1, "CASO ANCLA end-to-end: rojo sobre el documento vivo");
  ok(
    juzgar({ documentos: [{ de: "fila inbox 4", doc }], plan: "professional", faltantes: ["whatsappIncluded"], label: "Profesional" }).texto.includes("el chatbot de WhatsApp"),
    "el informe NOMBRA lo que la prueba no trae",
  );
  // Un documento sano no puede salir rojo por culpa de otro que si lo esta: el que se nombra es
  // el que tiene el problema.
  const sano = { data: { faq: [{ id: "negocio", body: "Dos semanas de prueba con el plan Profesional completo." }] } };
  ok(juzgar({ documentos: [{ de: "fila inbox 5", doc: sano }], plan: "professional", faltantes: ["whatsappIncluded"], label: "Profesional" }).codigo === 0, "documento honesto = verde");

  if (fallos.length) {
    console.error(`self-check ROJO — ${fallos.length} caso(s):`);
    for (const f of fallos) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log("self-check ok — 29 casos");
}

if (process.argv.includes("--self-check")) selfCheck();
else medir();
