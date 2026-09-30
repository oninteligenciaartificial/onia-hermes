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
// Intenciones (orden de prioridad de la spec §5.2, con SOPORTE agregado:
//   opt-out > queja > SOPORTE > precio > SIAT > clinico/legal > estado actual)
// SOPORTE va arriba de precio y SIAT a proposito: "ya soy cliente y no me anda la facturacion"
// trae la palabra factura, y contestarle la respuesta comercial del SIAT a alguien que pide
// ayuda es el error que este bot no se puede permitir.
// ---------------------------------------------------------------------------

// Opt-out. Ojo con las palabras sueltas: `\bbaja\b` a secas apagaba el bot PARA SIEMPRE en
// "la demanda esta baja este mes" — por eso "baja" solo cuenta como mensaje entero o en
// "dar de baja". Y `\bno me interesa\b` seguido de un sustantivo ("no me interesa el precio")
// habla de ESE tema, no pide la baja.
//
// "no gracias" esta aca porque el guion lo PROMETE: R_SEGUIMIENTO (el mensaje del barrido de
// insistencia) cierra con «si preferis que no te escribamos, decinos "no gracias" y listo», y
// hasta el 2026-09-18 el motor no lo reconocia — el prospecto pedia la baja con las palabras
// que le dictamos y le seguiamos escribiendo. Va como MENSAJE ENTERO, igual que "stop": suelto
// es una baja, pero "no gracias a esa hora, mejor el martes" es una respuesta al guion y
// apagar ahi cuesta el lead. Lo ata palabra-que-el-bot-promete.test.mjs, que cruza el guion
// contra el motor y no deja agregar una instruccion nueva sin su deteccion.
const RE_OPT_OUT = new RegExp(
  [
    "^\\s*(?:stop|baja|unsubscribe|bajarme)\\s*[!.]*$",
    "^\\s*no,?\\s*gracias\\s*[!.]*$",
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
    "\\bes (?:caro|barato|gratis)\\b",
    "\\bes pagado\\b|\\btiene (?:algun )?costo\\b|\\bhay que pagar\\b",
    "\\bcaro\\b|\\bcarisimo\\b|\\bbarato\\b",
    "\\bpresupuesto\\b",
    "\\bcobran\\b|\\bcobras\\b",
    "\\bque (?:precio|costo)\\b",
    // "¿que planes tienen?" es la misma pregunta que "¿cuanto cuesta?" y hasta el 2026-09-03 caia
    // en el LLM, que contesta el texto seguro: el prospecto preguntaba por plata y se iba sin una
    // cifra. Va ACOTADO a proposito — "plan" suelto se traga "mi plan es abrir otra sucursal".
    "\\b(?:que|cuales|cuantos)\\s+planes\\b",
    "\\bplanes?\\s+(?:tienen|hay|manejan|ofrecen|tenes|tienes)\\b",
    "\\blista de precios\\b",
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

// Vocabulario clinico. Dos grupos con criterios distintos, a proposito:
//   1. PROCEDIMIENTOS Y COSAS: solo aparecen en contexto clinico, van sueltos.
//   2. SINTOMAS: agregados 2026-08-16 porque el corte no cubria lo que de verdad escribe un
//      paciente. Se probo en vivo: "tengo mucho dolor y fiebre desde ayer, es urgente" NO cortaba.
//      OJO con `dolor` SUELTO: en este embudo "dolor" es el DOLOR DE NEGOCIO que buscamos
//      ("mi dolor es que pierdo clientes") y cortarlo mataria la calificacion. Por eso va la
//      forma VERBAL (`duele`) y `dolor de <parte del cuerpo>`, nunca el sustantivo solo.
const RE_CLINICO =
  /\b(?:diagnostic\w+|tratamiento|extraccion|endodoncia|caries|implante|anestesia|receta|medicament\w+|muela|carilla\w*)\b/;
const RE_SINTOMA =
  /\b(?:duele|duelen|dolor de (?:muela|diente|cabeza|encia|estomago|garganta|oido)|fiebre|sangra\w*|sangrado|hinchad\w+|inflamad\w+|pastilla\w*|dosis|infeccion|absceso)\b/;
// Consulta legal: consejo profesional, no vocabulario clinico. `\bdemanda\b` suelto NO va:
// "la demanda esta baja este mes" habla del negocio del prospecto, no de un juicio.
// El consejo FISCAL (RE_CONSEJO_FISCAL) se juzga aparte y es absoluto: siempre va a un humano.
const RE_LEGAL_CONSULTA = /\bcontrato\b|\babogad\w+|\bjuicio\b|\b(?:me|nos|los) demand\w+\b|\bdemanda (?:judicial|legal)\b/;
// El prospecto contando a que se dedica ("soy dueña, hago endodoncia", "somos 4 abogados") se
// esta presentando, no pidiendo una opinion clinica ni legal. Derivarlo pierde una calificacion
// entera — y ahora que Onia le vende a cualquier rubro, un estudio juridico o un consultorio
// medico son PROSPECTOS: sus propias palabras no pueden ser lo que los saca del embudo.
const RE_PRACTICA_PROPIA = new RegExp(
  [
    // El `(?<!que )` es de SEGURIDAD, no de estilo. Sin el, "me duele la muela, QUE HAGO" cazaba
    // "hago" y el guardia daba por hecho que quien escribe es el dentista presentandose — asi que
    // el corte clinico no se disparaba y un paciente con dolor recibia el pitch de venta. Es la
    // frase mas probable que escribe alguien con dolor, y era justo la que se colaba.
    // Se acepta el falso negativo del guardia ("lo que hago es vender repuestos" ya no lo protege):
    // ese caso termina en un humano, que es el lado seguro de fallar.
    "(?<!que )\\b(?:hago|hacemos|realizo|realizamos|atiendo|atendemos|me dedico|nos dedicamos|me especializo|especialist\\w+ en|especializad\\w+ en)\\b",
    "\\bsoy (?:abogad\\w+|contador\\w*|dentista|odontolog\\w+|medic[oa]|veterinari[oa]|arquitect[oa]|ingenier[oa])\\b",
    "\\bsomos (?:\\d+ |un[ao]s? )?(?:abogad\\w+|contador\\w+|dentistas?|odontolog\\w+|medicos?|veterinari\\w+)\\b",
    "\\b(?:tengo|tenemos|manejo|manejamos) (?:un|una|mi) (?:estudio|bufete|clinica|consultorio|laboratorio)\\b",
  ].join("|"),
);

// El DUEÑO hablando de SUS pacientes, en plural: "tengo 30 pacientes con tratamiento a medias",
// "mis pacientes dejan el tratamiento". Es el dolor #1 del cliente ideal y la respuesta mas probable
// al anuncio D4 — y la palabra "tratamiento" lo mandaba al corte clinico (M5 + handoff), justo en el
// mensaje que la pauta paga por conseguir. Un paciente habla de SU tratamiento, no de "mis pacientes".
// Solo afloja a los PROCEDIMIENTOS (RE_CLINICO), igual que RE_PRACTICA_PROPIA: un sintoma sigue
// cortando siempre y lo legal no pasa por aca. Ver tratamiento-a-medias-no-es-consulta-clinica.test.mjs.
const RE_HABLA_DE_SUS_PACIENTES =
  /\b(?:mis|nuestros|los|sus|varios|muchos|algunos|tengo|tenemos|hay|\d+) pacientes\b|\bpacientes (?:que|con)\b/;

const RE_PRODUCTO_DETALLE =/\bse conecta con\b|\bse integra con\b|\bcompatible con\b|\brayos x\b|\bradiograf\w+|\bimpresora\b|\bfirma digital\b|\bapi\b|\bexportar\b|\bmigrar (?:mis|los) datos\b|\bcelular\b|\btelefono\b|\btablet\b|\bcomputadora\b|\bandroid\b|\biphone\b|\bwindows\b|\bsin internet\b|\boffline\b|\ben la nube\b|\b(?:dan|tienen|ofrecen|brindan|incluye|incluyen) (?:soporte|capacitacion|garantia)\b/;

// La MISMA pregunta, dicha como la dice la gente: SUJETO + VERBO DE CAPACIDAD.
//
// `RE_PRODUCTO_DETALLE` es una lista blanca de SUSTANTIVOS ("rayos x", "api", "offline"): cubre
// al que ya sabe que quiere preguntar por una integracion. No cubria "¿el sistema manda
// recordatorios?", que es la forma mas comun de una preventa y la que escribio un lead de verdad.
//
// Medido en produccion el 2026-09-03, conversacion 49 del widget, mensajes 339-340: la pregunta
// no matcheo ninguna intencion, cayo en `offScriptResult` —cuya tarea al LLM es "reformular la
// pregunta pendiente del embudo, sin dar datos nuevos", con `features` en `forbidden`— y el
// prospecto recibio de vuelta la oferta de horarios, como si no hubiera preguntado nada. La traza
// del turno decia `rama: "respondio"`: para el sistema eso salio bien.
//
// Se resuelve por SUJETO + VERBO y no por el verbo suelto, porque el verbo solo es de cualquiera:
// "mando el comprobante", "tengo 4 personas" y "hago protesis" son del prospecto hablando de SI
// MISMO. Exigir que el sujeto sea el producto es lo que separa "¿el sistema factura?" de "yo
// facturo". Los 3 huecos opcionales dejan pasar "el sistema tambien me guarda...".
//
// Lo que NO se toca a proposito: el ORDEN del router. `isSupportRequest`, `isPriceQuestion`,
// `isSiatQuestion` y `isClinicalOrLegal` se juzgan ANTES (bot-engine.mjs ~550-560), asi que "ya
// soy cliente y el sistema no me anda" sigue siendo soporte y "¿cuanto sale el sistema?" sigue
// siendo precio. Esta regla solo recoge lo que hoy no recoge nadie.
const RE_PRODUCTO_HACE = new RegExp(
  "\\b(?:el sistema|la plataforma|el software|el programa|la app|la aplicacion|el modulo|onia)\\b" +
    "(?:\\s+\\S+){0,3}?\\s+" +
    "(?:manda|envia|permite|guarda|registra|controla|maneja|emite|genera|sirve|hace|incluye|" +
    "tiene|soporta|funciona|avisa|recuerda|integra|conecta|exporta|importa|calcula|agenda|" +
    "acepta|muestra|imprime|notifica|separa|lleva|saca|cobra|factura)\\b",
);

// "¿que hacen?" / "¿que es Onia?" — la pregunta mas basica del embudo, y hasta hoy no tenia
// respuesta propia: caia en el LLM o en un handoff. Se contesta con el CATALOGO (M_QUE_ES_ONIA),
// que es dato editable, asi un producto nuevo no tarda un deploy en existir para el bot.
// Se consulta TARDE en el router a proposito: cualquier pregunta mas especifica (precio, SIAT,
// soporte, tecnica) le gana, porque esta es la generica.
// Lo que se excluye: "que hacen si no me sirve" pide una condicion comercial y "que hacen con mis
// datos" es privacidad — las dos las contesta un humano, no un catalogo.
const RE_QUE_ES_ONIA = new RegExp(
  [
    "\\bque (?:es|son) (?:onia|el sistema|la plataforma|esto)\\b",
    "\\bque (?:hacen|haces|hacen ustedes|ofrecen|ofreces|venden|vendes|brindan)\\b(?!\\s+(?:si|cuando|con|en caso))",
    "\\ba que se dedican\\b|\\ba que te dedicas\\b",
    "\\b(?:de que|en que) (?:se trata|consiste)\\b",
    "\\bque (?:servicios|productos|modulos|sistemas)\\b",
    "\\bpara que sirve\\b",
    "\\bque me (?:ofrecen|ofreces|pueden ofrecer)\\b",
  ].join("|"),
);

/** Pregunto QUE vendemos. Se contesta con el catalogo, no con un humano ni con el LLM. */
export function asksWhatWeDo(norm) {
  return RE_QUE_ES_ONIA.test(norm);
}

// ---------------------------------------------------------------------------
// EL PACIENTE QUE ENTRA POR LA PAUTA (solo modo VENTA)
// ---------------------------------------------------------------------------
// Un anuncio que dice "clinica dental", optimizado a conversaciones, trae PACIENTES que buscan
// turno: es "el riesgo central" de la pauta (ONIA_ADQUISICION_Y_PAUTA.md §5.2). Antes de esto el
// paciente entraba al embudo de venta: se creaba como lead, recibia la escalera de precios de los
// PLANES de Onia si preguntaba por los brackets, o le costaba un aviso a Sergio Urcullo si contaba
// que le dolia una muela. Ver paciente-de-la-pauta.test.mjs.
//
// DOS REGLAS, y el orden entre ellas es lo que importa:
//   1. Lo que dice un PACIENTE es primera persona pidiendo atencion: busco/necesito un dentista,
//      quiero sacar un turno, me duele, cuanto cuesta una limpieza, hacen blanqueamiento.
//   2. Lo que dice un DUEÑO le gana SIEMPRE, aunque traiga palabras de paciente: el dueño habla de
//      turnos, citas y pacientes todo el dia porque es su negocio ("quiero que mis pacientes saquen
//      turno solos", "necesito un sistema para agendar citas"). Confundirlo cierra la puerta al
//      unico lead que la pauta existe para traer, asi que ante la duda NO es paciente — el que se
//      escapa sigue en el embudo y lo filtra el mensaje siguiente o un humano.
// Solo lo consulta el modo venta: en el recepcionista de una clinica cliente, el paciente ES el
// cliente, y recepcionista.mjs corre antes de que el router de venta llegue a preguntar esto.
const TRATAMIENTO_DENTAL =
  "limpiezas?|profilaxis|ortodoncia|brackets|frenillos|extraccion(?:es)?|curacion(?:es)?|calzas?|endodoncias?|tratamiento de conducto|implantes?|blanqueamientos?|carillas?|coronas?|protesis";
const VERBOS_QUIERE = "busco|buscaba|necesito|necesitaba|quiero|queria|quisiera";
const QUIERE = `(?:${VERBOS_QUIERE})`;
const ARTICULO = "(?:(?:un|una|el|la|los|las|mi|mis|al|a la)\\s+)?";
const RE_PACIENTE = new RegExp(
  [
    // "Busco atencion dental" es la respuesta para tocar del anuncio (§5.2), literal.
    `^\\s*busco atencion\\s*[.!?]*$`,
    `\\b${QUIERE}\\s+(?:(?:una|un)\\s+)?(?:atencion|atenderme|consulta)\\s+(?:dental|odontologica|medica|con (?:el|la|un|una) (?:dentista|odontolog\\w+|doctor\\w*))\\b`,
    `\\b${QUIERE}\\s+${ARTICULO}(?:dentista|odontologo|odontologa|doctora?)\\b`,
    // Pedir un turno/cita/ficha para uno mismo. "consulta" NO va: "quiero agendar la consulta" es la
    // consulta comercial de Onia (una campaña publicada la usa con esas palabras).
    `\\b(?:${VERBOS_QUIERE}|puedo|podria|como)\\s+(?:(?:sacar|saco|pedir|pido|agendar|agendo|reservar|reservo|tener|conseguir|consigo)(?:me)?\\s+)?(?:(?:un|una)\\s+)?(?:turnos?|citas?|fichas?)\\b`,
    `\\b(?:tienen|tenes|tiene|hay)\\s+(?:turnos?|citas?|fichas?)\\s+(?:disponibles?|libres?|para|hoy|manana|esta|este)\\b`,
    `\\bsoy (?:su |tu )?paciente\\b`,
    // Dolor en primera persona. `dolor` suelto NO: en este embudo es el dolor DE NEGOCIO.
    `\\bme duele\\w*\\b|\\bdolor de (?:muelas?|dientes?|encias?|mandibula)\\b|\\bmuela del juicio\\b`,
    `\\bse me (?:rompio|partio|cayo|salio|despego) (?:un|una|el|la|mi) (?:diente|muela|calza|corona|brackets?|carilla)\\b`,
    // Precio o disponibilidad de un TRATAMIENTO: lo pregunta el que se lo quiere hacer.
    `\\b(?:cuanto|que precio|precios?|costos?|valor)\\b[^.?!]{0,30}\\b(?:${TRATAMIENTO_DENTAL})\\b`,
    `\\b(?:hacen|haces|realizan|atienden|ofrecen|tienen)\\s+${ARTICULO}(?:${TRATAMIENTO_DENTAL})\\b`,
    `\\b${QUIERE}\\s+(?:hacerme\\s+|ponerme\\s+|sacarme\\s+)?${ARTICULO}(?:${TRATAMIENTO_DENTAL})\\b`,
    `\\b(?:hacerme|ponerme|sacarme|arreglarme)\\s+${ARTICULO}(?:${TRATAMIENTO_DENTAL}|muelas?|dientes?)\\b`,
  ].join("|"),
);
// Lo que solo dice el que tiene (o trabaja en) el negocio, o el que pregunta por el SISTEMA.
const RE_HABLA_EL_DUENO = new RegExp(
  [
    "\\b(?:sistema|software|plataforma|programa|aplicacion|app|demo|onia|online|en linea|automatic\\w*)\\b",
    "\\b(?:mis|nuestros|los|sus) pacientes\\b",
    // "la clinica" NO: es tambien como un paciente nombra la clinica a la que va.
    "\\b(?:mi|nuestra) clinica\\b|\\b(?:mi|nuestro) consultorio\\b|\\bmi negocio\\b|\\bmis clientes\\b",
    "\\b(?:tengo|tenemos|manejo|administro) (?:un|una) (?:clinica|consultorio)\\b",
    "\\btrabajo en\\b|\\brecepcion\\w*\\b",
    "\\b(?:doctores|odontologos|odontologas|dentistas|profesionales)\\b",
  ].join("|"),
);

/**
 * El que escribe es un PACIENTE que busca atencion (turno, precio de un tratamiento, un dolor), no
 * una clinica. Lo que dice un dueño le gana siempre: ante la duda, `false`.
 */
export function isPatientSeekingCare(norm) {
  if (RE_HABLA_EL_DUENO.test(norm)) return false;
  return RE_PACIENTE.test(norm);
}

// ---------------------------------------------------------------------------
// MODO RECEPCIONISTA (el bot de un CLIENTE de Onia). Solo lo consulta
// recepcionista.mjs: el funnel de venta no pasa por aca.
// ---------------------------------------------------------------------------

// Saludo pelado ("hola", "buenas"). Anclado al ARRANQUE del mensaje: "hola, cuanto cuesta?"
// trae una pregunta y la pregunta gana (el router del modo recepcionista consulta esto ultimo).
const RE_SALUDO = /^\s*(?:hola+|holis?|buenas+|buen dia|buenos dias|buenas tardes|buenas noches|hey|que tal|saludos)\b/;

// "¿que dias atienden?" / "¿a que hora abren?" — el horario de atencion del NEGOCIO.
const RE_HORARIO_ATENCION = /\bque dias?\b|\bhorarios? de atencion\b|\bque horarios?\b|\ben que horarios?\b|\bhasta que hora\b|\bdesde que hora\b|\ba que hora (?:abren|cierran|atienden)\b|\bcuando (?:atienden|abren|cierran)\b|\bestan abiert\w+\b|\babren\b|\bcierran\b|\batienden\b/;

// "¿cuanto dura la cita?" / "¿es presencial?" — la logistica de la cita, no un pedido.
// Se consulta ANTES que el interes: "como es la cita" pregunta, no reserva.
const RE_CITA_INFO = /\bcuanto (?:dura|tiempo)\b|\bcomo es la (?:cita|consulta|atencion|reunion)\b|\bes presencial\b|\bes virtual\b|\bpor videollamada\b|\bmodalidad\b/;

// Interes de compra o de cita ("quiero comprar 100 tornillos", "agendame").
//
// POR QUE SON DOS MITADES (2026-08-31): vendemos el chatbot como "contesta, califica, AGENDA"
// (pricing.ts) y el motor derivaba a un humano TODA intencion de cita. Para que el bot agende de
// verdad — mandando el link de la agenda publica de su org, que ya crea citas reales — hay que
// separar lo que se resuelve solo (una cita) de lo que no (un pedido: cantidad, stock y precio
// los confirma una persona). Juntos en un regex, un "quiero comprar 100 tornillos y agendar"
// perderia el handoff del pedido a cambio de un link.
const RE_CITA_PEDIR = /\bagend\w+\b|\breserv\w+\b|\bcita\b|\bturno\b/;
const RE_COMPRA_PEDIDO = /\bcompr\w+\b|\bpedido\b|\bpedir\b|\bencarg\w+\b|\bnecesito \d+\b|\bquiero \d+\b/;
// El interes de siempre = la union de las dos mitades + "me interesa" (que no dice cual de las
// dos es, y por eso sigue escalando). Se compone en vez de repetirse para que no puedan
// desincronizarse: agregar una palabra a una mitad la agrega tambien aca.
const RE_INTERES_PEDIDO = new RegExp(`${RE_CITA_PEDIR.source}|${RE_COMPRA_PEDIDO.source}|\\bme interesa\\b`);

/** Saludo sin pregunta: el modo recepcionista contesta con su menu (M0R). */
export function isGreeting(norm) {
  return RE_SALUDO.test(norm);
}

/** Pregunta por el horario de atencion del negocio. */
export function asksSchedule(norm) {
  return RE_HORARIO_ATENCION.test(norm);
}

/** Pregunta como es la cita (duracion / modalidad), sin pedirla todavia. */
export function asksBookingInfo(norm) {
  return RE_CITA_INFO.test(norm);
}

/** Quiere comprar / pedir / agendar: se toma el pedido y lo confirma un humano. */
export function wantsToOrder(norm) {
  return RE_INTERES_PEDIDO.test(norm);
}

/**
 * Quiere UNA CITA y nada mas: la UNICA intencion que el bot puede cerrar solo, mandandole el link
 * de la agenda publica de su org. La compra queda excluida a proposito: "quiero comprar 100
 * tornillos y agendar" es un pedido, y un pedido lo confirma una persona (ver recepcionista.mjs).
 */
export function wantsToBook(norm) {
  return RE_CITA_PEDIR.test(norm) && !RE_COMPRA_PEDIDO.test(norm);
}

// ---------------------------------------------------------------------------
// LO QUE EL GUION LE PIDE AL PROSPECTO — y el motor tiene que escuchar
// ---------------------------------------------------------------------------
// M5 y M8_SOPORTE cierran los dos con: «Si es urgente, decime "urgente" y lo marco». Hasta el
// 2026-09-10 esa palabra no existia en NINGUN .mjs del bot: quien la escribia recibia el acuse
// generico la primera vez y silencio total las siguientes. El bot le decia exactamente que
// escribir y despues no lo escuchaba.
//
// El sujeto se escribe en PRESENTE de lo que el guion promete, no de la palabra suelta: si
// manana el texto pide otra palabra, el ancla de urgencia-en-el-handoff.test.mjs la deriva del
// SCRIPT y se pone roja sola.
const RE_URGENTE = /\burgent\w*\b|\burge\b|\bes para (?:hoy|ya|ahora)\b|\blo antes posible\b|\bcuanto antes\b|\bapura\w*\b/;

// Comprar EL SISTEMA, que es otra cosa que "comprar 100 tornillos" (eso es un pedido del
// recepcionista de un cliente, RE_COMPRA_PEDIDO). Aca lo que pasa es que alguien quiere pagarnos:
// es el mensaje mas caro que puede entrar y hasta hoy recibia el acuse generico.
const RE_QUIERE_COMPRAR = new RegExp(
  [
    "\\b(?:quiero|queremos|necesito|deseo|me gustaria|quisiera)\\s+(?:ya\\s+)?(?:comprar|contratar|pagar|adquirir|suscribirme|arrancar|empezar)\\b",
    "\\bcomo (?:pago|compro|contrato|hago para (?:pagar|contratar|comprar))\\b",
    "\\bdonde (?:pago|deposito|transfiero)\\b",
    "\\b(?:mandame|pasame|enviame) (?:el|los) (?:qr|datos de pago|numero de cuenta)\\b",
    "\\bvoy a (?:comprar|contratar|pagar)\\b",
    "\\blo (?:compro|contrato|tomo)\\b",
    "\\bcuanto (?:te|les|hay que) (?:pago|deposito|transfiero)\\b",
  ].join("|"),
);

/**
 * El prospecto usa la palabra que el guion le pidio ("urgente"), o dice que quiere COMPRAR.
 * Las dos van juntas a proposito: las dos significan lo mismo para el que tiene que atender
 * —esto no puede esperar al proximo barrido— y las dos salian por el mismo agujero.
 */
export function needsHumanNow(norm) {
  return RE_URGENTE.test(norm) || RE_QUIERE_COMPRAR.test(norm);
}

/** Solo la senal de compra, para que el aviso diga POR QUE es urgente. */
export function wantsToBuy(norm) {
  return RE_QUIERE_COMPRAR.test(norm);
}

// ---------------------------------------------------------------------------
// SEGUNDO CAMINO: soporte (no venta)
// ---------------------------------------------------------------------------
// Quien YA es cliente no viene a comprar: viene a que algo funcione. Ofrecerle la demo comercial
// a quien pide ayuda es el peor error que puede cometer este bot — le dice "compra" a quien ya
// compro, y encima lo deja sin resolver. Este camino NO agenda demo: va a un humano.
//
// La frontera fina, y es a proposito: "ya tengo UN sistema" (articulo indefinido) es la OBJECION
// del que usa otra cosa y sigue siendo un prospecto de venta. "ya tengo EL sistema", "el de
// ustedes", "no puedo entrar" es NUESTRO cliente pidiendo ayuda. Ante la duda se deriva: un
// handoff cuesta 5 minutos de Sergio; venderle a quien ya compro cuesta el cliente.
const RE_YA_ES_CLIENTE = new RegExp(
  [
    "\\bya (?:soy|somos) client\\w+",
    "\\b(?:soy|somos) client\\w+ (?:de ustedes|suyos?|de onia|hace)\\b",
    "\\bya (?:tengo|uso|estoy usando|contrate|compre|instale)\\s+(?:el|la|su|tu|este|esta)\\s+(?:sistema|plataforma|programa|panel|app|onia)\\b",
    "\\bya (?:tengo|uso|contrate|estoy usando) onia\\b",
    "\\b(?:el sistema|la plataforma|el panel|la app) (?:de ustedes|que me (?:instalaron|vendieron|configuraron))\\b",
    "\\bya me lo (?:instalaron|configuraron|activaron)\\b",
    "\\bya trabajo con (?:ustedes|onia)\\b",
  ].join("|"),
);

const RE_PROBLEMA_SISTEMA = new RegExp(
  [
    // "no me anda" SIEMPRE con el sujeto a la vista. Suelto se tragaba "no me anda internet, te
    // escribo luego", que es una excusa de WhatsApp: mandaba a soporte a un prospecto nuevo.
    "\\bno (?:me |se )?(?:anda|funciona|carga|abre|deja entrar|deja ingresar)\\b[^.]{0,25}\\b(?:sistema|plataforma|app|panel|onia|programa|cuenta|pagina)\\b",
    "\\b(?:sistema|plataforma|app|panel|onia|programa|cuenta)\\b[^.]{0,25}\\bno (?:me |se )?(?:anda|funciona|carga|abre|deja)\\b",
    "\\bno puedo (?:entrar|ingresar|acceder|loguearme|iniciar sesion)\\b",
    "\\bme (?:da|sale|tira) (?:un )?error\\b",
    "\\bse (?:me )?(?:cuelga|colgo|traba|trabo|cierra|cerro|borro)\\b",
    "\\bolvide (?:mi|la) (?:clave|contrasena|password|usuario)\\b",
    "\\bcomo (?:configuro|activo|cargo|doy de alta|agrego|habilito)\\b",
    // Primera persona a proposito: "necesito soporte" es un cliente pidiendo ayuda; "¿dan soporte
    // tecnico?" es un prospecto preguntando por una capacidad del producto, y eso es otra rama.
    "\\bnecesito (?:soporte|ayuda tecnica)\\b",
    "\\bayuda con (?:el sistema|la plataforma|la app|el panel|mi cuenta|la configuracion)\\b",
  ].join("|"),
);

// Pedir hablar con una persona es el pedido de handoff mas claro que existe (N3).
const RE_PIDE_HUMANO = /\b(?:hablar|hablo|charlar|conversar|comunicarme|contactarme) con (?:una persona|alguien|un humano|una humana|un asesor|una asesora|un vendedor|una vendedora|sergio|un encargado)\b|\bquiero hablar con\b|\bme pasas con\b|\bpasame con\b|\bhay (?:alguien|algun humano)\b|\bpersona real\b|\bun humano\b/;

// "no le sirve ninguno". Se consulta DESPUES de detectSlotChoice: "el jueves no puedo, el
// viernes si" ya quedo resuelto como eleccion del viernes y nunca llega hasta aca.
// `^otro$` esta porque M0 lo promete con todas las letras ("escribime 'otro' y lo coordinamos"):
// va anclado como mensaje entero — "otro dia" o "en otro local" ya matchean (o no) por su cuenta.
const RE_SIN_SLOT = /\bningun[oa]?\b|\bno me sirve\b|\bninguna de las dos\b|\bno me va\b|\bno puedo\b|^\s*otro\s*[!.]*$|\botro horario\b|\botro dia\b|\botra fecha\b|\bmas tarde\b|\bmas adelante\b/;

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
  // El consejo fiscal es absoluto (N5): ni el contador que pregunta por lo suyo lo saca de humano.
  if (RE_CONSEJO_FISCAL.test(norm)) return true;
  const practicaPropia = RE_PRACTICA_PROPIA.test(norm);
  // "somos 4 abogados en La Paz" se esta presentando; "necesito un abogado" pide consejo legal.
  if (RE_LEGAL_CONSULTA.test(norm)) return !practicaPropia;
  // Un SINTOMA corta siempre, sin importar el guardia: quien describe un dolor o una fiebre no se
  // esta presentando como profesional, y equivocarse hacia el lado de derivar a un humano no
  // cuesta nada. Los procedimientos si pasan por el guardia ("hago endodoncia" es un prospecto).
  if (RE_SINTOMA.test(norm)) return true;
  if (!RE_CLINICO.test(norm)) return false;
  return !(practicaPropia || RE_HABLA_DE_SUS_PACIENTES.test(norm));
}

/**
 * SEGUNDO CAMINO: el que escribe ya es cliente o necesita ayuda con el sistema.
 * NO se le ofrece la demo comercial: va a un humano (reunion de ayuda / soporte).
 * La bronca contra el sistema que usa HOY (otro proveedor) NO es soporte: ese es el lead caliente
 * de siempre y sigue el embudo de venta.
 */
export function isSupportRequest(norm) {
  // Decirlo con todas las letras ("ya tengo el sistema de ustedes") le gana a cualquier heuristica:
  // "tengo el sistema" tambien es la forma de hablar del sistema de otro, y ahi la frase explicita
  // es la unica que sabe de cual de los dos se trata.
  if (RE_YA_ES_CLIENTE.test(norm)) return true;
  if (RE_BRONCA_CON_SU_SISTEMA.test(norm)) return false;
  return RE_PROBLEMA_SISTEMA.test(norm);
}

/** Pregunta tecnica de producto: el bot NO adivina, va a handoff (spec §2.3). */
export function isProductDetail(norm) {
  return RE_PRODUCTO_DETALLE.test(norm) || RE_PRODUCTO_HACE.test(norm);
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
// Calificacion: ¿a que se dedica? · ¿cuantas personas? · ¿que ciudad?  (+ rama por rubro)
// ---------------------------------------------------------------------------
// Los 3 datos son UNIVERSALES: Onia es una plataforma por modulos, no un producto dental.
// El tamaño del equipo reemplazo a los sillones porque es el unico proxy de capacidad que
// entiende cualquier rubro. Los sillones siguen existiendo, pero como dato de RAMA: se piden
// solo si el rubro es odontologia (ver config.qualification.branches).

const NUM_PALABRA = Object.freeze({
  un: 1, uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8,
  nueve: 9, diez: 10, once: 11, doce: 12, trece: 13, catorce: 14, quince: 15, veinte: 20, treinta: 30,
});
const NUM_PALABRAS = Object.keys(NUM_PALABRA).join("|");

// --- Rubro ------------------------------------------------------------------
// `re` matchea sola: son palabras que en un WhatsApp de trabajo no significan otra cosa
// ("ferreteria", "odontologia"). `weak` necesita una senal de posesion delante, porque suelta
// diria cualquier cosa: "estoy en la tienda" NO declara un rubro, "tengo una tienda" si.
// El orden importa: la primera que matchea gana. Odontologia va primera porque "clinica dental"
// tambien contiene "clinica" (que es el rubro salud).
const RUBROS = Object.freeze([
  Object.freeze({
    key: "dental",
    label: "odontología",
    re: /\bdentista\w*\b|\bodontolog\w+|\bortodonc\w+|\bclinica dental\b|\bconsultorio dental\b|\blaboratorio dental\b|\bprotesis dental\w*|\bsillones?\b/,
  }),
  // Veterinaria y estetica son rubros PROPIOS desde 2026-08-16 (decision de Sergio). Antes caian
  // en `salud` y en `servicios` respectivamente, asi que el bot le decia a un veterinario "anotado
  // que te dedicás a salud" — y Sergio llegaba a la demo sin saber de que rubro hablaba.
  //
  // Por que NO se pudo hacer con la capa editable (`rubrosExtra`), que existe justo para esto:
  // las palabras del archivo entran DESPUES de las del codigo dentro de cada nivel, y
  // "la primera que matchea gana" (candado 1 de lexiconOf). Como `salud` ya tiene `veterinari\w+`
  // como palabra FUERTE, un rubro editable "veterinaria" no le ganaria nunca. Mover la palabra de
  // rubro es lo unico que lo arregla, y eso es codigo.
  //
  // Los dos SIGUEN EL CORE: reusan las pantallas clinicas del track (`vetgest-clinical`,
  // `esteticagest-clinical` en onia-platform). Acá no se construye nada nuevo, solo se los
  // identifica bien. NO se agregan a PRODUCTOS ni a MODULOS_LISTOS: nombrar un modulo es una
  // promesa comercial y esa decision es de Sergio, no de este archivo.
  Object.freeze({
    key: "veterinaria",
    label: "veterinaria",
    // Sale de `salud`, donde vivia `veterinari\w+`. Va ANTES para ganarle.
    re: /\bveterinari\w+|\bclinica veterinaria\b|\bconsultorio veterinario\b/,
    weak: /\bmascotas?\b/,
  }),
  Object.freeze({
    key: "estetica",
    label: "estética",
    // Sale de `servicios`, donde vivia `\bestetica\b`. OJO: peluqueria, barberia, salon de belleza
    // y spa SE QUEDAN en `servicios` — el track del core es la clinica estetica (agenda + ficha),
    // no el salon. Meterlos aca les cambiaria el rubro a negocios que no son ese.
    re: /\bestetica\b|\bmedicina estetica\b|\bcentro de estetica\b|\bcosmiatr\w+|\bdepilacion laser\b/,
  }),
  Object.freeze({
    key: "gastronomia",
    label: "gastronomía",
    re: /\brestaurant\w*\b|\bpizzeri\w+|\bcafeteri\w+|\bheladeri\w+|\bpanaderi\w+|\bpasteleri\w+|\bcatering\b|\bfood ?truck\b|\bcomida rapida\b|\bpolleri\w+|\bchurrasqueri\w+|\bhamburgueseri\w+|\bsushi\b/,
    weak: /\bcafes?\b|\bbares?\b|\bresto\b|\bsnacks?\b/,
  }),
  Object.freeze({
    key: "salud",
    label: "salud",
    // `veterinari\w+` se fue a su propio rubro (arriba). Sacarlo de acá es la mitad del arreglo:
    // si se queda, `salud` le sigue ganando por orden y el rubro nuevo no se usa nunca.
    re: /\bconsultorio medico\b|\bcentro medico\b|\bpediatr\w+|\bdermatolog\w+|\bfisioterap\w+|\bkinesiolog\w+|\bpsicolog\w+|\bnutricionist\w+|\boftalmolog\w+|\btraumatolog\w+|\bginecolog\w+|\blaboratorio clinico\b|\bmedic[oa]s?\b/,
    weak: /\bclinicas?\b|\bconsultorios?\b/,
  }),
  Object.freeze({
    key: "servicios",
    label: "servicios",
    // `\bestetica\b` se fue a su propio rubro (arriba). Peluqueria, barberia, salon de belleza y
    // spa se quedan acá a proposito: son servicios, no la clinica estetica del track del core.
    re: /\bpeluqueri\w+|\bbarberi\w+|\bsalon de belleza\b|\bgimnasio\b|\bspa\b|\bhotel\w*\b|\bhostal\b|\binmobiliari\w+|\bconstructora\b|\bcontabilidad\b|\bcontador\w*\b|\babogad\w+|\bestudio juridico\b|\bbufete\b|\bacademia\b|\bcolegio\b|\bescuela\b|\bguarderi\w+|\bimprenta\b|\bfotografi\w+|\blavanderi\w+|\btaller mecanico\b|\bmecanic[ao]\b|\bcerrajeri\w+|\bmudanzas\b|\btransporte\b|\blimpieza\b/,
    weak: /\btalleres?\b|\bagencias?\b|\bestudio\b|\bconsultora\b/,
  }),
  Object.freeze({
    key: "comercio",
    label: "comercio",
    re: /\bferreteri\w+|\blibreri\w+|\bboutique\b|\bfarmacia\b|\bbotica\b|\brepuestos\b|\bmuebleri\w+|\bagropecuari\w+|\bbazar\b|\bdistribuidor\w+|\bimportador\w+|\bmayorista\b|\bmini ?market\b|\bsuperm\w+|\bvendemos\b|\bventa de\b|\bvendo\b/,
    // Los plurales cuentan: "tengo 3 tiendas" es un comercio con 3 locales, el mejor prospecto de
    // la lista. Sin la `s` el bot lo trataba como si no hubiera contestado.
    weak: /\btiendas?\b|\balmacen\w*\b|\bmercados?\b|\blocal(?:es)?\b/,
  }),
]);

const RUBRO_LABEL = Object.freeze(Object.fromEntries(RUBROS.map((rubro) => [rubro.key, rubro.label])));

// "tengo una", "mi", "abrimos un": lo que convierte una palabra comun en el rubro del prospecto.
const CUE_NEGOCIO = "(?:tengo|tenemos|manejo|manejamos|administro|administramos|abri|abrimos|puse|pusimos|atiendo|es mi|es un[ao]|somos un[ao]|mi|nuestr[ao]s?|un|una)\\s+(?:\\w+\\s+){0,2}";
const RUBROS_DEBILES = Object.freeze(
  RUBROS.filter((rubro) => rubro.weak).map((rubro) => Object.freeze({
    key: rubro.key,
    re: new RegExp(`${CUE_NEGOCIO}(?:${rubro.weak.source})`),
  })),
);

// Contesto a QUE se dedica pero con palabras que no tenemos mapeadas ("me dedico a fumigar").
// Se guarda "otro": el prospecto SI contesto, y volver a preguntarle lo mismo es lo que hace
// parecer que el bot no lee. Inventarle un rubro seria peor todavia.
const RE_DEDICACION = /\bme dedico a\b|\bnos dedicamos a\b|\bmi rubro es\b|\bel rubro es\b|\bmi negocio es\b|\bnuestro negocio es\b|\bfabricamos\b|\bproducimos\b|\bimportamos\b|\balquilamos\b|\breparamos\b|\bdistribuimos\b|\bofrecemos servicios\b|\bbrindamos servicios\b|\bdamos servicio\b/;

// --- Lexico editable: agregar un rubro SIN desplegar -------------------------
// Las palabras de `config.rubrosExtra` (la capa de conocimiento) entran como TEXTO, nunca como
// regex: una regex mala mata el matcher o cuelga el proceso entero. Aca se normalizan, se escapan
// y se compilan con la MISMA forma que las del codigo.
//
// Dos candados, los dos por construccion y no por confianza en el que edita:
//   1. ORDEN — dentro de cada nivel (fuerte, debil) el codigo va primero y el archivo despues, y
//      "la primera que matchea gana". Una palabra editable no le puede robar un match a una
//      palabra FUERTE del codigo, ni quedar delante de `dental`, que existe justo para ganarle a
//      "clinica". Un `fuerte` editable si le gana a un `debil` del codigo, y esta bien: esa es la
//      precedencia de siempre — las genericas viven en `debil` para poder ser desplazadas.
//   2. UNION — para una key que ya existe, las palabras se SUMAN. Quitar una palabra del codigo
//      sigue siendo un commit, igual que los gatillos de baja.
// Lo unico que el archivo si pisa es la ETIQUETA: es texto que el prospecto lee, o sea un hecho.

/** Piso de longitud de una palabra del lexico. El validador del archivo rechaza con este mismo. */
export const MIN_LEXICON_WORD = 3;

const RE_META = /[.*+?^${}()|[\]\\]/g;

/** Palabras -> UN regex `\b(?:a|b|c)\w*\b` (alternacion de literales: lineal, sin ReDoS). */
function lexiconRegex(words) {
  const parts = (Array.isArray(words) ? words : [])
    .map((word) => normalize(String(word)).trim())
    .filter((word) => word.length >= MIN_LEXICON_WORD)
    .map((word) => word.replace(RE_META, "\\$&"));
  return parts.length ? new RegExp(`\\b(?:${parts.join("|")})\\w*\\b`) : null;
}

const CODE_LEXICON = Object.freeze({ strong: RUBROS, weak: RUBROS_DEBILES, labels: RUBRO_LABEL });

/**
 * El lexico vigente = codigo + archivo. Sin `config.rubrosExtra` devuelve EL MISMO objeto del
 * codigo: la misma degradacion por identidad con la que degrada toda la capa de conocimiento.
 */
function lexiconOf(config) {
  const extra = config && Array.isArray(config.rubrosExtra) ? config.rubrosExtra : null;
  if (!extra || extra.length === 0) return CODE_LEXICON;
  const strong = [...RUBROS];
  const weak = [...RUBROS_DEBILES];
  const labels = { ...RUBRO_LABEL };
  for (const rubro of extra) {
    const key = String(rubro?.key || "").trim();
    if (!key) continue;
    if (rubro.label) labels[key] = rubro.label;
    const fuerte = lexiconRegex(rubro.fuerte);
    if (fuerte) strong.push({ key, re: fuerte });
    const debil = lexiconRegex(rubro.debil);
    if (debil) weak.push({ key, re: new RegExp(`${CUE_NEGOCIO}(?:${debil.source})`) });
  }
  return { strong, weak, labels };
}

/**
 * El rubro del prospecto con su fuerza, o null si no lo dijo.
 * `strong` = la palabra sola no significa otra cosa. Solo un match fuerte puede PISAR un rubro ya
 * capturado: si no, un dentista que despues escribe "tengo un consultorio nuevo" se convierte en
 * rubro salud y el bot le habla de otra cosa.
 */
function matchIndustry(norm, config) {
  const lexicon = lexiconOf(config);
  for (const rubro of lexicon.strong) if (rubro.re.test(norm)) return { key: rubro.key, strong: true };
  for (const rubro of lexicon.weak) if (rubro.re.test(norm)) return { key: rubro.key, strong: false };
  return RE_DEDICACION.test(norm) ? { key: "otro", strong: false } : null;
}

/** El rubro del prospecto, o null si no lo dijo. Nunca adivina: null se re-pregunta. */
export function findIndustry(norm, config) {
  const match = matchIndustry(norm, config);
  return match ? match.key : null;
}

/** Etiqueta legible del rubro para el guion. null = no hay etiqueta que mostrar ("otro"). */
export function industryLabel(key, config) {
  return lexiconOf(config).labels[key] || null;
}

// --- Tamaño del equipo ------------------------------------------------------
// Unidades de sillon (dato de RAMA). "consultorio" NO cuenta: "tengo un consultorio" habla del
// local, no de tener UN sillon — contarlo asi inventa el dato con el que despues se califica.
const UNIDAD = "sillon\\w*|unidad\\w*|box\\w*|gabinete\\w*";
const RELLENO = "(?:solo|solos|sola|solas|unico|unicos|nomas|no mas|dental\\w*|de atencion)?";
const RE_SILLONES = new RegExp(`\\b(\\d{1,2})\\s*${RELLENO}\\s*(?:${UNIDAD})\\b`);
const RE_SILLONES_PALABRA = new RegExp(`\\b(${NUM_PALABRAS})\\s+${RELLENO}\\s*(?:${UNIDAD})\\b`);

// La lista es de OFICIOS ademas de "personas": un constructor contesta "somos 25 obreros" y una
// peluqueria "somos 3 estilistas". Quedarse en "personas" pierde la respuesta a la pregunta 2.
const PERSONA = "personas?|emplead\\w+|trabajador\\w+|colaborador\\w+|gente|chic[ao]s|dependient\\w+|vendedor\\w+|mozos?|meser[oa]s|asistentes?|secretari\\w+|obrer[oa]s|operari\\w+|tecnic[oa]s|cociner[oa]s|estilistas?|enfermer[oa]s|choferes?";
const RE_EQUIPO_NUM = new RegExp(`\\b(\\d{1,3})\\s*(?:${PERSONA})\\b`);
// De "dos" para arriba a proposito: "hablo con UNA PERSONA?" es un pedido de handoff, no la
// declaracion de que trabaja una sola persona. El equipo de 1 se dice "solo yo" o "somos 1".
const NUM_PALABRAS_PLURAL = Object.keys(NUM_PALABRA).filter((word) => NUM_PALABRA[word] > 1).join("|");
const RE_EQUIPO_PALABRA = new RegExp(`\\b(${NUM_PALABRAS_PLURAL})\\s+(?:${PERSONA})\\b`);
// "somos 4", "trabajamos 3", "habemos 5": la respuesta natural a "¿cuántas personas trabajan ahí?".
// El lookahead evita contar como gente lo que es una unidad del rubro ("somos 2 sillones").
const RE_EQUIPO_SOMOS = new RegExp(
  `\\b(?:somos|trabajamos|trabajan|habemos|estamos)\\s+(\\d{1,3}|${NUM_PALABRAS})\\b(?!\\s*(?:${UNIDAD}))`,
);
// "solo yo" es una respuesta completa a la pregunta 2 y la mas comun del negocio chico boliviano.
// "una persona" solo cuenta con la marca de que es TODO el equipo ("nomas", "sola", "solo una"):
// suelta seria contar "hablo con una persona?" como un equipo de uno, que es un pedido de handoff.
const RE_EQUIPO_SOLO = /\bsolo yo\b|\byo solo\b|\byo sol[ao]\b|\bsoy sol[ao]\b|\bestoy sol[ao]\b|\btrabajo sol[ao]\b|\bpor mi cuenta\b|\bsoy yo (?:nomas|no mas|solo|sola)\b|\bnadie mas\b|\bsin emplead\w+|\b(?:una|1) persona (?:nomas|no mas|solamente|sola)\b|\bsolo una persona\b|\buna sola persona\b/;

// Respuesta pelada ("3", "son 3", "tres"): contesta la ULTIMA pregunta que el bot hizo. Cual es
// depende de lo ya capturado, por eso el parser recibe `current`.
const RE_RESPUESTA_PELADA = new RegExp(
  `^\\s*(?:son|somos|tengo|tenemos|serian|seria|es|hay|habemos)?\\s*(\\d{1,3}|${NUM_PALABRAS})\\s*[.!]*$`,
);

// --- Descarte ---------------------------------------------------------------
// YA NO se descarta por rubro ni por tamaño: con la plataforma por modulos, una ferreteria de 12
// personas es un cliente mejor, no uno peor. Queda SOLO lo que claramente no es un negocio: el
// que busca trabajo y el que nos quiere vender algo a nosotros. Ante la duda NO se descarta.
const RE_BUSCA_TRABAJO = /\bbusco trabajo\b|\bbuscando trabajo\b|\bnecesito trabajo\b|\bhay (?:alguna )?vacante\b|\bestan contratando\b|\bmi cv\b|\bcurriculum\b|\bhoja de vida\b|\bquiero postular\b|\bsoy estudiante\b|\bestudio (?:odontologia|medicina|derecho|contabilidad|enfermeria)\b|\bno tengo (?:clinica|negocio|empresa|local)\b/;
// Estrictamente "me esta ofreciendo algo A MI". Lo que se saco a proposito: "soy distribuidor" y
// "vendo equipos" — con el bot abierto a todo rubro, una distribuidora es un PROSPECTO, no spam.
const RE_NOS_QUIERE_VENDER = /\bles vendo\b|\bquiero vender(?:les|le|te)\b|\bles ofrezco\b|\bofrecerles\b|\bte ofrezco (?:nuestros|mis)\b|\bofrecerte (?:nuestros|mis)\b|\brepresento a (?:la|una) empresa\b|\bpropuesta comercial para ustedes\b/;

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

/** Numero de una captura: acepta digitos o la palabra ("tres"). */
function countOf(raw) {
  if (raw === undefined || raw === null) return undefined;
  return /^\d+$/.test(raw) ? Number(raw) : NUM_PALABRA[raw];
}

function isCount(value, max) {
  return Number.isFinite(value) && value >= 1 && value <= max;
}

/**
 * Extrae los datos de calificacion del mensaje.
 * `config` solo aporta el lexico editable de rubros (`rubrosExtra`): sin ella se usa el del codigo.
 * Un dato EXPLICITO pisa lo ya capturado: si el prospecto dice "en realidad son 4 sillones",
 * vale lo ultimo que dijo, no lo primero que el bot creyo entender. Los datos que dependen del
 * contexto de la pregunta (un numero pelado, "son 3") solo se toman si el campo esta vacio.
 */
export function parseQualification(norm, current = {}, config = null) {
  const found = {};

  const industry = matchIndustry(norm, config);
  if (industry && (industry.strong || !hasValue(current.industry))) found.industry = industry.key;

  // Tamaño del equipo. Todas las formas de abajo son explicitas: la ultima que dijo gana.
  let team = countOf((norm.match(RE_EQUIPO_NUM) || norm.match(RE_EQUIPO_PALABRA) || norm.match(RE_EQUIPO_SOMOS) || [])[1]);
  if (team === undefined && RE_EQUIPO_SOLO.test(norm)) team = 1;
  if (isCount(team, 500)) found.teamSize = team;

  // Sillones (dato de rama). Solo la forma explicita: un numero pelado se resuelve mas abajo,
  // con el contexto de lo que el bot pregunto.
  const chairs = countOf((norm.match(RE_SILLONES) || norm.match(RE_SILLONES_PALABRA) || [])[1]);
  if (isCount(chairs, 60)) found.chairs = chairs;

  // Respuesta pelada: es la contestacion a la ultima pregunta abierta. Si el equipo todavia falta,
  // el numero es el equipo (es la pregunta 2 del guion); si el equipo ya esta y el rubro pide
  // sillones, el numero son los sillones (es la pregunta de rama). Nunca pisa un dato ya dado.
  if (found.teamSize === undefined && found.chairs === undefined) {
    const bare = countOf((norm.trim().match(RE_RESPUESTA_PELADA) || [])[1]);
    if (bare !== undefined) {
      const view = { ...current, ...found };
      if (!hasValue(view.teamSize) && isCount(bare, 500)) found.teamSize = bare;
      else if (view.industry === "dental" && !hasValue(view.chairs) && isCount(bare, 60)) found.chairs = bare;
    }
  }

  const city = findCity(norm);
  if (city) found.city = city;

  return found;
}

/**
 * Descarte suave: lo que claramente NO es un negocio.
 * NO se descarta por rubro (Onia le vende a todos) ni por tamaño (grande es mejor). Solo el que
 * busca trabajo y el que nos quiere vender algo. Si hay duda, esto devuelve false: el prospecto
 * sigue el embudo o termina en un humano, que es mucho mas barato que perderlo.
 */
export function isDisqualified(norm) {
  return RE_BUSCA_TRABAJO.test(norm) || RE_NOS_QUIERE_VENDER.test(norm);
}

const RE_DOLOR_AGENDA = /\bagenda\b|\bcitas?\b|\bturnos?\b|\bhorarios?\b|\bhuecos?\b|\bausenci\w+|\bno vienen a la cita\b/;
const RE_DOLOR_COBROS = /\bcobros?\b|\bcobrar\b|\bpagos?\b|\bplata\b|\bcuentas?\b|\bmorosos?\b|\bdeud\w+|\bcaja\b/;
const RE_DOLOR_PACIENTES = /\bpacientes\b|\bclientes\b|\bno vuelven\b|\brecall\b|\bseguimiento\b|\bretencion\b|\bfidelizacion\b/;

// Acuse de recibo o despedida. "ya" es el "dale" boliviano por excelencia y "nos vemos el
// jueves" es despedirse: molestar a Sergio por eso es un handoff que no aporta nada.
//
// El mensaje ENTERO tiene que ser cortesia, pero puede ser mas de una palabra: "ok gracias" y "ah
// ok, gracias!" son la forma mas comun de cerrar en WhatsApp, y con una sola palabra permitida
// caian en el handoff. Medido el 2026-09-30: al paciente que recibia la salida cortes y contestaba
// "ok gracias", el bot le mandaba M5 ("eso lo tiene que ver Sergio") y un aviso a Sergio Urcullo.
const CORTESIA = "gracias|muchas gracias|mil gracias|ok|oka?y|okey|okis|dale|listo|perfecto|buenisimo|barbaro|excelente|genial|de una|joya|ya|ya esta|ya va|de acuerdo|bien|ah+|a+h|oh+|👍|🙏|👌|✅";
const RE_CORTESIA = new RegExp(`^\\s*(?:${CORTESIA})(?:[\\s!.,]+(?:${CORTESIA}))*[\\s!.,]*$`);
const RE_DESPEDIDA = /\bnos vemos\b|\bnos hablamos\b|\bahi nos vemos\b|\bahi estare\b|\bahi estoy\b|\bhasta (?:luego|pronto|el (?:lunes|martes|miercoles|jueves|viernes|sabado|domingo))\b|\bchau\b|\bnos vemos el\b/;

/** "gracias" / "dale" / "nos vemos el jueves": no es una consulta, no hace falta molestar a un humano. */
export function isCourtesy(norm) {
  return RE_CORTESIA.test(norm) || RE_DESPEDIDA.test(norm);
}

/**
 * El dolor que pregunta M2. Devuelve 'agenda' | 'cobros' | 'clientes' | null.
 * El bucket se llama 'clientes' y no 'pacientes': el mismo dolor lo tiene una ferreteria, y en el
 * CRM un lead de ferreteria con pain_point='pacientes' se lee como un dato de otro negocio.
 */
export function detectPainPoint(norm) {
  if (RE_DOLOR_COBROS.test(norm)) return "cobros";
  if (RE_DOLOR_PACIENTES.test(norm)) return "clientes";
  if (RE_DOLOR_AGENDA.test(norm)) return "agenda";
  return null;
}

// El dolor que vende la pauta D4 ("Sabé quién no volvió"), dicho ANTES de que se lo pregunten.
// `detectPainPoint` es ancho a proposito porque corre despues de que M2 pregunto el dolor; antes de
// reservar nadie lo pregunto, y ahi "¿que horarios tienen?" o "tengo muchos clientes" no son un
// dolor. Esto es lo estrecho: gente que NO VUELVE o tratamientos que quedan sin terminar. "a medias"
// suelto no: "si, quedo a medias" es el prospecto hablando de la conversacion (M3 usa esas palabras).
const RE_ABANDONO =
  /\bno (?:vuelven|volvieron|regresan|regresaron|vuelven mas|vinieron mas)\b|\b(?:dejan|dejaron|abandonan|abandonaron|cortan|cortaron)\b[^.?!]{0,25}\btratamientos?\b|\b(?:tratamiento|endodoncia|ortodoncia|implante)s?\b[^.?!]{0,15}\b(?:a medias|sin terminar|incomplet\w+|abandonad\w+)\b|\b(?:empiezan|arrancan|comienzan)\b[^.?!]{0,30}\b(?:desaparecen|no vuelven|abandonan)\b/;

/** El prospecto contó, sin que se lo pregunten, que sus pacientes/clientes no vuelven. */
export function mentionsAbandonedTreatment(norm) {
  return RE_ABANDONO.test(norm);
}
