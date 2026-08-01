// ONIA — Chatbot propio: DETECCION DETERMINISTA (regex + parsers).
// Es la tabla de decision de la spec §2.3 y corre ANTES de cualquier LLM.
// Regla de oro (spec §2.1): el estado solo avanza con un dato CAPTURADO Y GUARDADO, nunca con
// una suposicion del LLM. Por eso la extraccion de la calificacion vive aca, no en el prompt.
// Todos los regex reciben texto YA normalizado (minusculas, sin tildes) y NO llevan flag /g.
//
// Criterio al escribir un regex aca (medido con bench.mjs, no opinado):
//   - ante la duda, NO capturar y NO afirmar. Un dato vacio que se re-pregunta se arregla en un
//     mensaje; un dato inventado ensucia el CRM y el bot lo repite en voz alta.
//   - ante la duda de derivar, DERIVAR. "Un handoff de mas cuesta 5 minutos de Sergio. Una
//     promesa inventada cuesta un cliente" (spec §2.3).

import { normalize } from "./guardrails.mjs";

// ---------------------------------------------------------------------------
// Intenciones (orden de prioridad de la spec §5.2:
//   opt-out > queja > precio > SIAT > clinico/legal > estado actual)
// ---------------------------------------------------------------------------

// Opt-out. Ojo con las palabras sueltas: `\bbaja\b` a secas apagaba el bot PARA SIEMPRE en
// "la demanda esta baja este mes" — por eso "baja" solo cuenta como mensaje entero o en
// "dar de baja". Y `\bno me interesa\b` seguido de un sustantivo ("no me interesa el precio")
// habla de ESE tema, no pide la baja.
const RE_OPT_OUT = new RegExp(
  [
    "^\\s*(?:stop|baja|unsubscribe|bajarme)\\s*[!.]*$",
    "\\bstop\\b",
    "\\b(?:desuscrib\\w+|dar de baja|darme de baja|dame de baja|borrame)\\b",
    "\\bno me (?:escribas|escriban|escriba|contactes|contacten|molestes|molesten|molestar|mandes|manden|mandeis|envies|envien|llames|llamen)\\b",
    "\\bno quiero que me (?:\\w+\\s+){0,2}(?:escrib\\w+|contact\\w+|molest\\w+|llam\\w+|mand\\w+|envi\\w+)\\b",
    "\\bdej(?:a|e)n?me en paz\\b",
    "\\bdej(?:a|e)n?me de (?:escribir|molestar|mandar|escribirme|joder)\\b",
    "\\bno me interesa\\b(?!\\s+(?:el|la|los|las|tu|su|ese|esa|eso|este|esta)\\b)",
  ].join("|"),
);

// Precio. Incluye las formas coloquiales bolivianas ("cuanto seria", "cuanto cobras") y la
// objecion de plata ("debe ser muy caro"): son la MISMA pregunta y todas se contestan con M4.
const RE_PRECIO = new RegExp(
  [
    "\\bcuanto (?:cuesta|cuestan|sale|salen|vale|valen|es|seria|serian|saldria|costaria|cobran|cobras|cobra|cobrarian)\\b",
    "\\bcuanto me (?:sale|saldria|costaria|cobrarian)\\b",
    "\\bprecios?\\b",
    "\\bcostos?\\b",
    "\\btarifas?\\b",
    "\\d+\\s*(?:bs|bolivianos?|\\$us|usd|dolares?)\\b",
    "\\bes (?:caro|barato)\\b",
    "\\bcaro\\b|\\bcarisimo\\b|\\bbarato\\b",
    "\\bpresupuesto\\b",
    "\\bcobran\\b|\\bcobras\\b",
    "\\bque (?:precio|costo)\\b",
  ].join("|"),
);

// Ojo: el "sin" de la spec es el Servicio de Impuestos Nacionales, no la preposicion. Suelto
// ("demo sin compromiso") daria falsos positivos, asi que solo cuenta con articulo.
// `\bfiscal\b` suelto NO va: se tragaba "se integra con mi impresora fiscal?", que es una
// pregunta tecnica de producto y va a humano, no a la respuesta generica de facturacion.
const RE_SIAT = /\bsiat\b|\bfactura\w*\b|\b(?:el|al|del) sin\b|\bimpuestos nacionales\b|\bimpuest\w+|\bnit\b|\bobligacion\w* fiscal\w*\b|\btema fiscal\b|\bnormativa fiscal\b/;

// Consejo fiscal (N5). Es MAS especifico que RE_SIAT y le gana: "es deducible" no se contesta
// con la respuesta publica de facturacion en linea, va a un humano.
const RE_CONSEJO_FISCAL = /\bes deducible\b|\bpuedo (?:declarar|deducir)\b|\bcomo (?:declaro|facturo|deduzco)\b|\bme conviene (?:declarar|facturar)\b/;

const RE_QUEJA = /\bestafa\w*\b|\bchant\w+|\bfraude\b|\bno les creo\b|\bno te creo\b|\bes un robo\b|\bhuev\w+|\bpelotud\w+|\bbasura\b|\bporqueria\b|\bdenunci\w+|\b(?:es|son|sos) (?:un[ao]s? )?mentiros\w+|\bme (?:estan|estas) mintiendo\b|\bes (?:todo )?mentira\b|\btodo mentira\b/;

// La bronca contra el sistema que el prospecto usa HOY no es una queja contra nosotros: es el
// dolor que buscamos, el lead mas caliente posible. Derivarlo corta la calificacion justo
// cuando se abrio.
const RE_BRONCA_CON_SU_SISTEMA = /\b(?:sistema|programa|software|app|excel|planilla|agenda|proveedor)\b[^.]{0,40}\b(?:que (?:uso|tengo|manejo|usaba|use|tenia|contrate)|actual|de ahora)\b|\b(?:uso|tengo|manejo|use|usaba|tenia|contrate)\b[^.]{0,30}\b(?:sistema|programa|software|excel|planilla)\b/;

const RE_CLINICO = /\b(?:diagnostic\w+|tratamiento|extraccion|endodoncia|caries|implante|anestesia|receta|medicament\w+|muela|carilla\w*)\b/;
// Legal / fiscal: consejo profesional, no vocabulario clinico. `\bdemanda\b` suelto NO va:
// "la demanda esta baja este mes" habla del negocio del prospecto, no de un juicio.
const RE_LEGAL = /\bes deducible\b|\bpuedo (?:declarar|deducir)\b|\bcontrato\b|\babogad\w+|\bjuicio\b|\b(?:me|nos|los) demand\w+\b|\bdemanda (?:judicial|legal)\b/;
// El prospecto contando lo que HACE en su clinica ("soy dueña, hago endodoncia") se esta
// presentando, no pidiendo una opinion clinica. Derivarlo pierde una calificacion entera.
const RE_PRACTICA_PROPIA = /\b(?:hago|hacemos|realizo|realizamos|atiendo|atendemos|me dedico|nos dedicamos|me especializo|especialist\w+ en|especializad\w+ en)\b/;

const RE_PRODUCTO_DETALLE = /\bse conecta con\b|\bse integra con\b|\bcompatible con\b|\brayos x\b|\bradiograf\w+|\bimpresora\b|\bfirma digital\b|\bapi\b|\bexportar\b|\bmigrar (?:mis|los) datos\b|\bcelular\b|\btelefono\b|\btablet\b|\bcomputadora\b|\bandroid\b|\biphone\b|\bwindows\b|\bsin internet\b|\boffline\b|\ben la nube\b/;

// Pedir hablar con una persona es el pedido de handoff mas claro que existe (N3).
const RE_PIDE_HUMANO = /\b(?:hablar|hablo|charlar|conversar|comunicarme|contactarme) con (?:una persona|alguien|un humano|una humana|un asesor|una asesora|un vendedor|una vendedora|sergio|un encargado)\b|\bquiero hablar con\b|\bme pasas con\b|\bpasame con\b|\bhay (?:alguien|algun humano)\b|\bpersona real\b|\bun humano\b/;

// "no le sirve ninguno". Se consulta DESPUES de detectSlotChoice: "el jueves no puedo, el
// viernes si" ya quedo resuelto como eleccion del viernes y nunca llega hasta aca.
const RE_SIN_SLOT = /\bningun[oa]?\b|\bno me sirve\b|\bninguna de las dos\b|\bno me va\b|\bno puedo\b|\botro horario\b|\botro dia\b|\botra fecha\b|\bmas tarde\b|\bmas adelante\b/;

export function isOptOut(norm) {
  return RE_OPT_OUT.test(norm);
}

export function isPriceQuestion(norm) {
  return RE_PRECIO.test(norm);
}

/**
 * SIAT / facturacion en linea. La regla de consejo fiscal (N5) es mas especifica y le gana:
 * sin esta exclusion el `\bimpuest\w+` se traga "esto es deducible de impuestos?", que la spec
 * manda a un humano.
 */
export function isSiatQuestion(norm) {
  if (RE_CONSEJO_FISCAL.test(norm)) return false;
  return RE_SIAT.test(norm);
}

export function isComplaint(norm) {
  if (RE_BRONCA_CON_SU_SISTEMA.test(norm)) return false;
  return RE_QUEJA.test(norm);
}

export function isClinicalOrLegal(norm) {
  if (RE_LEGAL.test(norm)) return true;
  if (!RE_CLINICO.test(norm)) return false;
  return !RE_PRACTICA_PROPIA.test(norm);
}

/** Pregunta tecnica de producto: el bot NO adivina, va a handoff (spec §2.3). */
export function isProductDetail(norm) {
  return RE_PRODUCTO_DETALLE.test(norm);
}

/** Pidio explicitamente un humano: handoff, sin intentar contestarlo el bot (N3). */
export function wantsHuman(norm) {
  return RE_PIDE_HUMANO.test(norm);
}

export function noSlotWorks(norm) {
  return RE_SIN_SLOT.test(norm);
}

/** Disparador de arranque / reapertura. */
export function isDemoTrigger(norm, config) {
  const words = (config?.triggers?.demo || []).map((w) => w.toLowerCase());
  return words.some((word) => new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(norm));
}

// ---------------------------------------------------------------------------
// Eleccion de horario
// ---------------------------------------------------------------------------

// SOLO formas que eligen una de las DOS opciones ofrecidas. Lo que se saco a proposito:
//   - `\bprimer[ao]\b` suelto: "el primero de agosto viajo" NO es "la primera opcion";
//   - `\bla 1\b`: "puedo el jueves a la 1 de la tarde" NO es la opcion 1.
// Los dos agendaban una demo que el prospecto nunca acepto (y avisaban a Sergio).
const RE_SLOT_A = /^\s*a\s*[).]?\s*$|\b(?:la )?opcion a\b|\bla a\b|\bla primera(?: opcion)?\b|\bprimera opcion\b|^\s*1\s*[).]?\s*$|\b(?:la )?opcion 1\b/;
const RE_SLOT_B = /^\s*b\s*[).]?\s*$|\b(?:la )?opcion b\b|\bla b\b|\bla segunda(?: opcion)?\b|\bsegunda opcion\b|^\s*2\s*[).]?\s*$|\b(?:la )?opcion 2\b/;

const DIAS_SEMANA = Object.freeze(["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]);
const MESES = "enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre";

/**
 * Horas de reloj mencionadas en el texto ("15:00", "a las 3", "a la 1 de la tarde").
 * Los dos literales llevan /g porque matchAll lo exige; son literales DENTRO de la funcion, o
 * sea un objeto nuevo por llamada, asi que el `lastIndex` stateful que rompe `.test()` no aplica.
 */
function clockHours(text) {
  const hours = [];
  for (const match of text.matchAll(/\b(\d{1,2}):(\d{2})\b/g)) hours.push(Number(match[1]));
  for (const match of text.matchAll(/\ba las?\s+(\d{1,2})\b(?!:)/g)) hours.push(Number(match[1]));
  return hours;
}

function slotDay(slot) {
  const label = normalize(slot?.label || "");
  return DIAS_SEMANA.find((day) => new RegExp(`\\b${day}\\b`).test(label)) || null;
}

/** Clausulas del mensaje: la negacion se evalua por clausula ("el jueves no puedo, el viernes si"). */
function clausesOf(norm) {
  return norm.split(/[,;.]|\bpero\b|\baunque\b/).map((part) => part.trim()).filter(Boolean);
}

const RE_NEGACION = /\bno\b|\bnunca\b|\bimposible\b/;

/**
 * Devuelve el slot elegido o null.
 * Tres formas de elegir, de la mas explicita a la mas coloquial:
 *   1. la letra / el ordinal / el numero de la opcion ("A", "la segunda", "2");
 *   2. la etiqueta textual del slot ("el viernes 10:00 me viene bien");
 *   3. el DIA del slot, con la negacion resuelta por clausula ("el jueves no puedo, el viernes si").
 * Si el mensaje trae una hora de reloj que NO es la del slot, no es una eleccion: es una
 * contrapropuesta ("puedo el jueves a la 1") y la coordina un humano.
 */
export function detectSlotChoice(norm, slots = []) {
  const usable = (slots || []).filter((slot) => slot && !slot.pending);

  const wantsA = RE_SLOT_A.test(norm);
  const wantsB = RE_SLOT_B.test(norm);
  if (wantsA && !wantsB) return usable.find((slot) => slot.key === "A") || null;
  if (wantsB && !wantsA) return usable.find((slot) => slot.key === "B") || null;

  for (const slot of usable) {
    const label = normalize(slot.label || "");
    if (label && norm.includes(label)) return slot;
  }

  const said = clockHours(norm);
  const clauses = clausesOf(norm);
  const accepted = [];
  for (const slot of usable) {
    const day = slotDay(slot);
    if (!day) continue;
    const dayRe = new RegExp(`\\b${day}\\b`);
    const mentions = clauses.filter((clause) => dayRe.test(clause));
    if (mentions.length === 0) continue;
    if (mentions.every((clause) => RE_NEGACION.test(clause))) continue; // "el jueves no puedo"
    // Nombro el dia pero con OTRA hora: esta proponiendo su horario, no eligiendo el nuestro.
    const slotHour = clockHours(normalize(slot.label || ""))[0];
    if (said.length > 0 && (slotHour === undefined || !said.includes(slotHour))) return null;
    accepted.push(slot);
  }
  return accepted.length === 1 ? accepted[0] : null;
}

// Fechas / horas propias del prospecto. En la rama de horarios, un mensaje que propone SU
// momento (y no eligio ninguno de los dos) lo coordina un humano.
const RE_PROPONE_HORARIO = new RegExp(
  [
    "\\b\\d{1,2}:\\d{2}\\b",
    "\\ba las?\\s+\\d{1,2}\\b",
    "\\ba las?\\s+(?:una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce)\\b",
    `\\b(?:el |los )?\\d{1,2} de (?:${MESES})\\b`,
    `\\bprimer[oa] de (?:${MESES})\\b`,
    `\\b(?:${DIAS_SEMANA.join("|")})\\b`,
    "\\bmanana\\b|\\bpasado manana\\b|\\bhoy\\b",
    "\\bla (?:proxima|otra) semana\\b|\\bla semana que viene\\b|\\bel mes que viene\\b",
    "\\bcoordinamos\\b|\\bcoordinemos\\b|\\ba la vuelta\\b|\\bcuando vuelva\\b|\\bte aviso\\b",
  ].join("|"),
);

/** El prospecto puso SU fecha/hora sobre la mesa (y no eligio A ni B). */
export function proposesOwnTime(norm) {
  return RE_PROPONE_HORARIO.test(norm);
}

// ---------------------------------------------------------------------------
// Calificacion: ¿es tuya? · ¿cuantos sillones? · ¿que ciudad?
// ---------------------------------------------------------------------------

const RE_ES_MIA = /\bes mi[ao]\b|\bes mi (?:clinica|consultorio)\b|\bsoy (?:el |la )?(?:duen\w+|propietari\w+|titular)\b|\btengo (?:mi|un|una) (?:clinica|consultorio)\b|\bmi propi[ao]\b|\bclinica propia\b|\bes propia\b|\bla manejo yo\b|\bsoy duen\w+|\bla (?:abri|monte|puse|arme|funde) yo\b/;
const RE_SOCIO = /\bsoci[ao]s?\b|\ba medias\b|\bcon mi (?:hermano|hermana|esposa|esposo|colega|primo|prima)\b|\bcompartida\b|\bentre dos\b/;
const RE_NO_ES_MIA = /\btrabajo en la de\b|\btrabajo en (?:la|el|una|un)?\s*(?:clinica|consultorio|centro)?\s*de (?:mi|otro|otra|un|una)\b|\bes de (?:mi jefe|otro|otra|un amigo|una amiga)\b|\bsoy (?:emplead\w+|asistent\w+|recepcionista|secretari\w+|pasante)\b|\bno es mia\b|\btrabajo para\b/;

// Descarte: claramente NO es el publico (spec §2.2 M1c). Conservador a proposito.
// Lo que se saco: `\bfarmacia\b` suelto (nombrar la farmacia de al lado es dar una direccion,
// no ser una farmacia) y `\bquiero vender\w*\b` (un dentista que "quiere vender mas ortodoncia"
// esta contando su objetivo de negocio, no ofreciendonos mercaderia).
const RE_ESTUDIANTE = /\bsoy estudiante\b|\bestudio (?:odontologia|medicina)\b|\bbusco trabajo\b|\bcurriculum\b|\bmi cv\b|\bno tengo clinica\b|\bno soy dentista\b/;
const RE_PROVEEDOR = /\bsoy (?:proveedor|distribuidor|representante)\b|\bles vendo\b|\bquiero vender(?:les|te|le)\b|\bvendo (?:equipos|insumos|materiales|productos|sillones|unidades|software|sistemas)\b|\bofrecerles\b/;
const RE_OTRO_RUBRO = /\b(?:soy|somos|tengo|tenemos|manejo|manejamos|administro|atiendo) (?:un[ao]?\s+)?(?:veterinari\w+|peluqueri\w+|barberi\w+|restaurante|ferreteri\w+|farmacia|botica|spa|gimnasio|hotel)\b|\bmi (?:veterinaria|peluqueria|barberia|restaurante|ferreteria|farmacia|botica)\b/;

// Unidades de sillon. "consultorio" NO cuenta: "tengo un consultorio" dice que la clinica es
// propia, no que tenga UN sillon — contarlo asi inventa el dato con el que despues se califica.
const UNIDAD = "sillon\\w*|unidad\\w*|box\\w*|gabinete\\w*";
const RELLENO = "(?:solo|solos|sola|solas|unico|unicos|nomas|no mas|dental\\w*|de atencion)?";
const RE_SILLONES = new RegExp(`\\b(\\d{1,2})\\s*${RELLENO}\\s*(?:${UNIDAD})\\b`);
const RE_SILLONES_PALABRA = new RegExp(
  `\\b(un|uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\\s+${RELLENO}\\s*(?:${UNIDAD})\\b`,
);
// Respuesta directa a "¿cuántos sillones?": "son 3", "somos dos". Solo vale si el dato falta
// (es la pregunta que el bot acaba de hacer), nunca para pisar un dato ya dado.
const RE_SILLONES_RESPUESTA = /^\s*(?:son|somos|tengo|tenemos|serian|seria|es|hay|habemos)\s+(\d{1,2}|un|uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s*[.!]*$/;
const NUM_PALABRA = { un: 1, uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10 };

/**
 * Lista blanca de ciudades bolivianas. NO hay fallback abierto: el "toma la palabra que sigue a
 * 'estoy en'" guardaba "Reunion" de "estoy en reunion, te escribo mas tarde" y "Consulta Ahora"
 * de "estoy en consulta ahora". Si el texto no matchea, mejor no capturar nada y re-preguntar.
 * `strict` = la ciudad tambien es una frase comun y exige preposicion locativa: "el alto
 * ausentismo de los pacientes" NO es la ciudad de El Alto.
 */
const CIUDADES = Object.freeze([
  ["santa cruz de la sierra", "Santa Cruz"],
  ["santa cruz", "Santa Cruz"],
  ["scz", "Santa Cruz"],
  ["cochabamba", "Cochabamba"],
  ["cocha", "Cochabamba"],
  ["la paz", "La Paz"],
  ["el alto", "El Alto", true],
  ["sucre", "Sucre"],
  ["tarija", "Tarija"],
  ["oruro", "Oruro"],
  ["potosi", "Potosí"],
  ["trinidad", "Trinidad"],
  ["cobija", "Cobija"],
  ["montero", "Montero"],
  ["quillacollo", "Quillacollo"],
  ["sacaba", "Sacaba"],
  ["riberalta", "Riberalta"],
  ["yacuiba", "Yacuiba"],
  ["camiri", "Camiri"],
  ["warnes", "Warnes"],
  ["villa montes", "Villa Montes"],
  ["tupiza", "Tupiza"],
  ["llallagua", "Llallagua"],
]);

// Contexto que convierte una palabra en "la ciudad donde estoy": arranque del mensaje, despues
// de una coma (asi contesta el que responde "…, 2 sillones, Sucre") o tras una preposicion.
const CUE_LOCATIVO = "(?:^|[,;:.!?\\n]\\s*|\\b(?:en|de|desde|para|hacia|ciudad de)\\s+)";
const CUE_ESTRICTO = "(?:^|\\b(?:en|de|desde)\\s+)";

function findCity(norm) {
  for (const [needle, canonical, strict] of CIUDADES) {
    const cue = strict ? CUE_ESTRICTO : CUE_LOCATIVO;
    if (new RegExp(`${cue}${needle}\\b`).test(norm)) return canonical;
  }
  return null;
}

function hasValue(value) {
  return value !== undefined && value !== null && value !== "";
}

/**
 * Extrae los datos de calificacion del mensaje.
 * Un dato EXPLICITO pisa lo ya capturado: si el prospecto dice "en realidad son 4 sillones",
 * vale lo ultimo que dijo, no lo primero que el bot creyo entender. Los datos que dependen del
 * contexto de la pregunta (un numero pelado, "son 3") solo se toman si el campo esta vacio.
 */
export function parseQualification(norm, current = {}) {
  const found = {};

  // Propiedad: siempre es una afirmacion explicita, asi que la ultima gana.
  if (RE_SOCIO.test(norm)) found.ownsClinic = "socio"; // decide con un socio => califica, con nota
  else if (RE_NO_ES_MIA.test(norm)) found.ownsClinic = false;
  else if (RE_ES_MIA.test(norm)) found.ownsClinic = true;

  const digits = norm.match(RE_SILLONES);
  const words = norm.match(RE_SILLONES_PALABRA);
  let chairs;
  let chairsExplicit = false;
  if (digits) {
    chairs = Number(digits[1]);
    chairsExplicit = true;
  } else if (words) {
    chairs = NUM_PALABRA[words[1]];
    chairsExplicit = true;
  } else if (!hasValue(current.chairs)) {
    const answer = norm.trim().match(RE_SILLONES_RESPUESTA);
    const bare = norm.trim().match(/^(\d{1,2})$/);
    if (answer) chairs = /^\d+$/.test(answer[1]) ? Number(answer[1]) : NUM_PALABRA[answer[1]];
    else if (bare) chairs = Number(bare[1]);
  }
  if (
    chairs !== undefined
    && Number.isFinite(chairs)
    && chairs >= 1
    && chairs <= 60
    && (chairsExplicit || !hasValue(current.chairs))
  ) {
    found.chairs = chairs;
  }

  const city = findCity(norm);
  if (city) found.city = city;

  return found;
}

/** Descarte suave: claramente fuera del publico objetivo. */
export function isDisqualified(norm, qualification = {}) {
  if (RE_ESTUDIANTE.test(norm) || RE_PROVEEDOR.test(norm) || RE_OTRO_RUBRO.test(norm)) return true;
  return qualification.ownsClinic === false;
}

const RE_DOLOR_AGENDA = /\bagenda\b|\bcitas?\b|\bturnos?\b|\bhorarios?\b|\bhuecos?\b|\bausenci\w+|\bno vienen a la cita\b/;
const RE_DOLOR_COBROS = /\bcobros?\b|\bcobrar\b|\bpagos?\b|\bplata\b|\bcuentas?\b|\bmorosos?\b|\bdeud\w+|\bcaja\b/;
const RE_DOLOR_PACIENTES = /\bpacientes\b|\bno vuelven\b|\brecall\b|\bseguimiento\b|\bretencion\b|\bfidelizacion\b/;

// Acuse de recibo o despedida. "ya" es el "dale" boliviano por excelencia y "nos vemos el
// jueves" es despedirse: molestar a Sergio por eso es un handoff que no aporta nada.
const RE_CORTESIA = /^\s*(?:gracias|muchas gracias|mil gracias|ok|oka?y|okey|dale|listo|perfecto|buenisimo|barbaro|excelente|genial|de una|joya|ya|ya esta|ya va|de acuerdo|bien|👍|🙏|👌|✅)[\s!.,]*$/;
const RE_DESPEDIDA = /\bnos vemos\b|\bnos hablamos\b|\bahi nos vemos\b|\bahi estare\b|\bahi estoy\b|\bhasta (?:luego|pronto|el (?:lunes|martes|miercoles|jueves|viernes|sabado|domingo))\b|\bchau\b|\bnos vemos el\b/;

/** "gracias" / "dale" / "nos vemos el jueves": no es una consulta, no hace falta molestar a un humano. */
export function isCourtesy(norm) {
  return RE_CORTESIA.test(norm) || RE_DESPEDIDA.test(norm);
}

/** El dolor que pregunta M2. Devuelve 'agenda' | 'cobros' | 'pacientes' | null. */
export function detectPainPoint(norm) {
  if (RE_DOLOR_COBROS.test(norm)) return "cobros";
  if (RE_DOLOR_PACIENTES.test(norm)) return "pacientes";
  if (RE_DOLOR_AGENDA.test(norm)) return "agenda";
  return null;
}
