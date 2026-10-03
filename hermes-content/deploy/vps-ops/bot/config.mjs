// ONIA — Chatbot propio (el que atiende "DEMO"): CONFIG POR CLIENTE.
// Todo lo que cambia de un cliente a otro vive ACA (spec §7.1): identidad y tono, disparador,
// preguntas de calificacion, horarios ofrecidos, destino del handoff, horario de atencion y
// los textos M0-M7 del guion.
// Lo que NO se toca por cliente (spec §7.2) vive en bot-engine.mjs y guardrails.mjs:
// la maquina de estados, el guardrail determinista, el silencio ante un humano, opt-in/opt-out,
// la reserva CAS y la bitacora completa.
// Spec: hermes-content/docs/ONIA_CHATBOT_PROPIO_SPEC_20260725.md

import {
  diasDeAtencion,
  envolventeDeAtencion,
  franjasDeAtencion,
  fraseDeAtencion,
  fueraDeAtencion,
} from "./ventanas-de-atencion.mjs";

// ---------------------------------------------------------------------------
// Horarios de demo
// ---------------------------------------------------------------------------
// TODO(Sergio): definir los 2 horarios fijos semanales de demo (punto 4 del STOP del plan de
// Lucia; §9.1 de la spec: "sin eso el bot no agenda"). Son 2 bloques FIJOS que Sergio reserva,
// NO se leen del Google Calendar (asi no hace falta un integrador de agenda y no hay doble booking).
// Mientras esten pendientes el motor devuelve la nota 'slots_sin_definir' y scheduled_at queda null.
// PROHIBIDO inventar horarios aca.
export const DEMO_SLOTS = Object.freeze([
  Object.freeze({ key: "A", label: "HORARIO A (pendiente de definir)", startAt: null, pending: true }),
  Object.freeze({ key: "B", label: "HORARIO B (pendiente de definir)", startAt: null, pending: true }),
]);

/**
 * El formato con el que los horarios entran al bot: `etiqueta@ISO`, separados por `|`.
 *   ONIA_BOT_SLOTS="sábado 5 de septiembre, 09:00@2026-09-05T13:00:00Z|lunes 7, 14:00@..."
 *
 * La etiqueta es lo UNICO que ve el prospecto; el ISO es la tripa con la que se reserva. Vive
 * aca —en el modulo hoja— porque cada copia de este parseo es una superficie donde el ISO se
 * puede escapar al guion: `simulate.mjs` tenia la suya, no partia por `@`, y mostraba
 * «09:00@2026-09-05T13:00:00Z» en la cara del cliente (medido el 2026-09-04, ver
 * simulate.test.mjs). Produccion estaba sana; el instrumento con el que se la mide, no.
 */

/**
 * Aviso minimo que Sergio pidio para una demo (2026-09-02): "que las reuniones se
 * agenden un dia antes para tener el espacio y tiempo para cancelar".
 */
export const ANTICIPACION_MINIMA_MS = 24 * 60 * 60 * 1000;

/**
 * ¿Este horario todavia se puede OFRECER en este instante?
 *
 * Es una propiedad del INSTANTE, no del horario: por eso no se puede guardar. `slotsOffered`
 * se persiste con el `pending` que el horario tenia el dia que se ofrecio, y al rehidratarlo
 * un horario del pasado vuelve con `pending: false` — ofrecible para todo el motor. Esta
 * funcion es la UNICA fuente de la regla, y la comparten los dos que la necesitan:
 * `parseSlotsSpec`, que la aplica al publicar, y `handleHorario`, que la aplica al ACEPTAR.
 * Mientras la regla vivio solo en el parseo, el camino interactivo agendaba lo caducado.
 *
 * Sin ISO no se puede verificar NI reservar, pero eso lo decide el que arma la cadena y ya
 * era asi: se considera sostenible. Con ISO manda el reloj, y un ISO ilegible cuenta como no
 * sostenible — la comparacion contra NaN da false sola, que es la direccion segura (antes
 * callarse que prometer).
 */
export function slotSostenible(slot, now = Date.now()) {
  const iso = slot?.startAt ?? null;
  if (iso === null) return true;
  const limite = (now instanceof Date ? now.getTime() : Number(now)) + ANTICIPACION_MINIMA_MS;
  return Date.parse(iso) >= limite;
}

/**
 * Los candidatos del spec, ya juzgados contra el reloj. Uno solo por cada copia del parseo: cada
 * reimplementacion de esta regla fue un bug (ver `slotSostenible` y `run-turn.mjs`).
 *
 * El horario se juzga cuando se va a OFRECER, no cuando se genero. Estos valores los escribe un
 * cron diario (scripts/loops/renovar-slots-bot.py) y se sirven las 24 h siguientes, asi que el
 * aviso se gasta solo mientras estan publicados; si ademas el cron no corre, lo que queda en
 * webhook.env envejece hasta el pasado. Medido el 2026-09-05 04:03 La Paz: el bot vivo ofrecia
 * "sábado 5, 09:00", a 4 h 57 min. El generador ya reserva margen para toda su vigencia; esto es
 * el corte que sobrevive a que ese generador no haya corrido.
 */
function candidatosDelSpec(text, now) {
  return text.split("|").map((part) => {
    const [label, startAt] = part.split("@").map((piece) => (piece || "").trim());
    const iso = startAt || null;
    // La regla vive en `slotSostenible`, que es la misma que aplica el motor al ACEPTAR una
    // eleccion. Reimplementarla aca fue lo que dejo agendar horarios ya caducados.
    const sostenible = slotSostenible({ startAt: iso }, now);
    // `pending` y no un descarte: es el estado que el motor ya sabe contar
    // (slotsPending -> M0_SIN_HORARIOS) y que detectSlotChoice ya ignora. Un
    // horario que no se puede sostener es, para el guion, uno sin definir.
    return { label, startAt: iso, pending: !sostenible };
  });
}

/** Identidad de un horario para compararlo entre listas (la foto de la charla y los de hoy). */
export function claveDeSlot(slot) {
  return `${slot?.startAt || ""}@@${String(slot?.label || "").trim()}`;
}

/**
 * Los horarios que llegan YA parseados —los que puede traer un turno en su payload— llevados a la
 * misma forma que `candidatosDelSpec` y juzgados contra el MISMO reloj.
 *
 * Existe por lo que dice `candidatosDelSpec` doce lineas mas arriba: cada reimplementacion de esta
 * regla fue un bug. `run-turn.mjs` tenia DOS copias del parseo, una por rama; el arreglo del
 * 2026-09-24 saco la de la rama del entorno y dejo intacta la del turno, con el mismo
 * `slice(0, 2)` y el mismo `pending: false` fijo. Con esto las dos ramas preguntan en un solo lado.
 */
export function candidatosDeLista(lista, now = Date.now()) {
  if (!Array.isArray(lista)) return [];
  return lista
    .map((slot) => {
      const iso = slot?.startAt || slot?.start_at || null;
      return {
        label: String(slot?.label || "").trim(),
        startAt: iso,
        pending: !slotSostenible({ startAt: iso }, now),
      };
    })
    .filter((slot) => slot.label || slot.startAt);
}

/**
 * El par que se OFRECE y los libres que ademas se pueden ACEPTAR, de una sola lista de candidatos.
 * Es lo que necesita cualquiera que arme config: pedir uno sin el otro es como nacio el bug que
 * dejo tres horarios libres inalcanzables (ver `slotsElegibles`).
 */
export function slotsDeCandidatos(candidatos) {
  const slots = elegirPar(candidatos);
  return { slots, slotsElegibles: elegiblesFueraDelPar(candidatos, slots) };
}

function elegirPar(candidatos) {
  // Se eligen los 2 que SE SOSTIENEN, no los 2 primeros: el recorte va DESPUES del
  // juicio. Mientras fue al reves, los candidatos 3 y 4 no se miraban nunca, asi que la
  // unica forma de que el par llegara entero era que el generador reservara margen para
  // toda su vigencia (ANTICIPACION + VIGENCIA = 48 h) y le diera al prospecto turno para
  // pasado manana. Con el orden corregido, el generador puede mandar candidatos de mas:
  // los que caducan se caen solos y siempre quedan dos enteros.
  const elegidos = candidatos.filter((slot) => !slot.pending).slice(0, 2);
  // Fail-safe: el guion necesita el par COMPLETO ({{slot_a}} y {{slot_b}} en la misma
  // frase, ver `hayHorarioReal` en reply-builder.mjs), asi que cuando no hay dos
  // ofrecibles se completa con los caidos. Salen `pending` y el guion cae a
  // SIN_HORARIOS — la misma rama de antes, que no es silencio: sigue el embudo.
  for (const slot of candidatos) {
    if (elegidos.length >= 2) break;
    if (!elegidos.includes(slot)) elegidos.push(slot);
  }
  // A y B se reparten en orden CRONOLOGICO, que es el de la lista: elegir no es reordenar.
  // Sin esto, un par que no se puede ofrecer entero salia dado vuelta (el caido de segundo),
  // cambiando la etiqueta que va al log sin cambiar lo que ve el prospecto — un movimiento
  // invisible en produccion y visible solo cuando alguien lee el log para entender un fallo.
  elegidos.sort((uno, otro) => candidatos.indexOf(uno) - candidatos.indexOf(otro));

  return elegidos.slice(0, 2).map((slot, index) => ({
    key: index === 0 ? "A" : "B",
    label: slot.label || `opción ${index === 0 ? "A" : "B"}`,
    startAt: slot.startAt,
    pending: slot.pending,
  }));
}

function elegiblesFueraDelPar(candidatos, par) {
  const yaOfrecidos = new Set((par || []).map(claveDeSlot));
  return candidatos
    .filter((slot) => !slot.pending && slot.label && !yaOfrecidos.has(claveDeSlot(slot)))
    .map((slot) => ({ key: null, label: slot.label, startAt: slot.startAt, pending: false }));
}

export function parseSlotsSpec(raw, { now = Date.now() } = {}) {
  const text = String(raw || "").trim();
  if (!text) return null;
  return elegirPar(candidatosDelSpec(text, now));
}

/**
 * Los horarios que el prospecto puede ELEGIR y el guion NO nombra.
 *
 * OFRECER es de a dos porque el guion pone `{{slot_a}}` y `{{slot_b}}` en la misma frase.
 * ACEPTAR no tiene por que serlo: el cron publica cinco candidatos (uno por dia) y los tres que
 * no salieron sorteados siguen LIBRES en la agenda. Mientras esta pregunta no existio, quien
 * escribia "el lunes 28 a las 14:00" —nuestro, libre, y dentro de la franja que la coletilla del
 * MISMO mensaje le prometia— no matcheaba ningun slot, caia en `intents.proposesOwnTime` y se
 * iba a la cola humana. Medido el 2026-09-24 en `onia_center.bot_conversations`: 43
 * conversaciones y 18 paradas en `esperando_horario`.
 *
 * OJO con la evidencia que NO sirve: esas filas tienen CERO `calendar_event_id`, pero eso no
 * prueba nada de este bug — Cal.com no existe en el VPS POR DECISION (opcion (c) del tablero
 * `t_b18ca430`, 2026-09-03: aviso por Telegram ya, calendario despues), asi que esa columna
 * seguiria en cero aunque los cinco candidatos se aceptaran. Citarla como consecuencia manda a
 * la proxima vuelta a buscar un bug decidido. La consecuencia real es la cola humana.
 *
 * Salen SIN `key` a proposito: `detectSlotChoice` resuelve "A"/"B" por letra contra el par que
 * el prospecto vio, y una letra reasignada le confirmaria un dia que nunca eligio — peor que el
 * bug que esto cierra. Se matchean nombrando el dia y la hora, que es como llegan de verdad.
 */
export function slotsElegibles(raw, { now = Date.now() } = {}) {
  const text = String(raw || "").trim();
  if (!text) return [];
  const candidatos = candidatosDelSpec(text, now);
  return elegiblesFueraDelPar(candidatos, elegirPar(candidatos));
}

// ---------------------------------------------------------------------------
// Duracion y modalidad de la demo — UNA sola fuente para el guion Y para la reserva
// ---------------------------------------------------------------------------
// RESUELTO 2026-08-06. La nota queda porque el problema fue caro y puede repetirse:
// durante meses el MISMO hecho estuvo escrito con DOS numeros distintos — el guion prometia
// "15 minutos" (M0) y la reserva bloqueaba 45 (CALCOM_BOT_DURATION_MINUTES=45 en el VPS). El
// prospecto aceptaba creyendo una cosa y su invitacion le decia otra.
//
// Ahora los dos salen de ESTE bloque (el guion por {{demo_duracion}}, la reserva porque
// run-turn.mjs le pasa `durationMinutos` a calcom-booking.mjs), asi que la contradiccion ya no
// puede nacer de dos lugares distintos.
//
// PARA CAMBIAR LA DURACION (una sola cosa, en un solo lugar):
//   - poner el MISMO numero en `duracionMinutos` y en `duracionFrase`;
//   - o, sin tocar codigo, ponerlos juntos en knowledge.json (el validador exige que coincidan).
// El test "duracion de la demo" de knowledge.test.mjs falla si divergen sin declararlo.
// Ojo: `CALCOM_BOT_DURATION_MINUTES` en el entorno GANA sobre esto. Se dejo vacia a proposito.
export const DEMO = Object.freeze({
  // DECIDIDO 2026-08-06 por Sergio: 30 y 30. Antes prometia 15 y bloqueaba 45 — el prospecto
  // aceptaba creyendo que eran 15 y recibia una invitacion que le comia 45. Se evaluo "prometer
  // 30 y bloquear 45" y se descarto: la invitacion muestra la duracion REAL, asi que seguia
  // diciendo una cosa y haciendo otra. Si hace falta colchon, va en el buffer de Cal.com, que
  // bloquea solo la agenda de Sergio y el prospecto no lo ve.
  duracionMinutos: 30, // lo que se BLOQUEA en el calendario
  duracionFrase: "30 minutos", // lo que el guion PROMETE en M0 — MISMO numero, a proposito
  modalidad: "videollamada", // como se da la demo. Aca entra "o presencial si estas en X" sin deploy.
  pendiente: false, // decidido: los dos numeros coinciden.
});

// ---------------------------------------------------------------------------
// Guion. Es texto fijo: NO pasa por el LLM y NO pasa por el guardrail (lo escribimos nosotros y
// esta versionado). Variables entre {{ }}.
//
// SUPERSEDE a la spec §2.2 / D3, que estaba escrita cuando el bot le hablaba SOLO a clinicas
// dentales (¿la clinica es tuya? · ¿cuantos sillones? · ¿que ciudad?). Onia se vende como
// plataforma por modulos, asi que las 3 preguntas ahora son universales (rubro · tamaño · ciudad)
// y el dato de un rubro se pide en una RAMA. Lo que NO cambia y no se negocia: el disclosure de
// bot en la primera linea de M0 (D2), el opt-out (M6 + triggers), que el guion sea texto fijo y
// versionado, y que el bot NUNCA cotice (M4_BODY / N1).
//
// ORDEN DEL EMBUDO (cambiado el 2026-08-06, decision de negocio aprobada): primero el COMPROMISO,
// despues los datos. Antes era "3 preguntas -> horarios -> reserva"; ahora es
// "valor + horarios -> reserva -> 3 preguntas". Por que: las 3 preguntas YA NO DESCARTAN A NADIE
// (ver M1c) — solo personalizan el mensaje. O sea que cobraban friccion en el momento de maximo
// interes a cambio de casi nada. Pedidas DESPUES de que el prospecto ya dijo que si, la tasa de
// respuesta es mucho mayor y no cuestan la reunion.
// ---------------------------------------------------------------------------
export const SCRIPT = Object.freeze({
  // M0 — bienvenida + disclosure + que es Onia + los 2 horarios, todo en el primer mensaje.
  // El disclosure de bot va en la PRIMERA linea (D2). No pide un solo dato: la unica pregunta del
  // mensaje es la que cierra la reunion.
  //
  // OJO AL REESCRIBIR (2026-09-04, tarea t_d3f02b65): aca decia "esto que estas viendo es justo lo
  // que vendemos: un asistente que atiende tu WhatsApp 24/7", y el comentario lo defendia como el
  // argumento de venta. Es exactamente lo que Sergio prohibio el 2026-09-03: "el sistema no ofrece
  // directamente el bot, ofrece solo el sistema". El chatbot es un add-on de pricing.ts — se cobra
  // aparte y se nombra cuando preguntan el precio (M4_BODY), nunca de titular en la bienvenida.
  // El disclosure se queda porque D2 no se negocia; lo que se fue es venderlo como la oferta.
  // Lo cuida `oferta-sistema.test.mjs`, que mira ESTA plantilla y su hermana M0_SIN_HORARIOS: el
  // bug nacio de corregir una sola de las dos.
  M0: [
    "¡Hola! Soy el asistente automático de Onia. Sí, un bot.",
    "",
    "{{producto}} es una plataforma por módulos para que su negocio trabaje adentro: agenda, cobros y clientes en un solo lugar.",
    "",
    "Le muestro cómo quedaría en SU negocio en {{demo_duracion}} por {{demo_modalidad}}. Tengo estos dos horarios:",
    "",
    "**A)** {{slot_a}}",
    "**B)** {{slot_b}}",
    "",
    '¿Cuál le va mejor? (o escríbame "otro" y lo coordinamos)',
  ].join("\n"),

  // M0b — el prospecto contesto con datos de su negocio en vez de elegir horario. Se le acusa
  // recibo (para que no repita lo que ya dijo) y se le vuelven a poner los dos horarios sobre la
  // mesa. Mandarlo a la rama LLM por un mensaje que se entendio perfecto gasta una respuesta y,
  // al segundo, un handoff — en alguien que esta colaborando.
  // M0b_SIN_HORARIOS — el mismo acuse que M0b, pero cuando `slots` sigue en "pendiente de
  // definir". M0b re-ofrece **A)** y **B)**, y sin horarios reales eso sale literal como
  // "HORARIO A (pendiente de definir)": el prospecto no puede elegir nada y la charla se
  // estanca repitiendo la misma frase. Aca se acusa el dato, se avanza pidiendo lo unico
  // accionable (el contacto) y la hora la coordina Sergio.
  //
  // VIA DERIVADA (2026-10-02). Aca preguntaba "¿A qué número o correo te escribe?" — por WhatsApp,
  // a quien ya nos escribe desde su numero: un paso de mas en el mensaje que, sin agenda propia
  // (`ONIA_BOT_AGENDA`, default), recibe CADA lead que cuenta su negocio. La via sale del canal,
  // igual que en M5 (`viaDelCanal`).
  M0b_SIN_HORARIOS: [
    "Perfecto, anotado {{datos_que_si_dio}} — el resto lo vemos en la demo.",
    "",
    "{{humano}} le coordina el horario personalmente y le escribe {{via_humano}}.",
  ].join("\n"),

  M0b: [
    "Perfecto, anotado {{datos_que_si_dio}} — el resto lo vemos en la demo.",
    "",
    "¿Cuál le va mejor? **A)** {{slot_a}} · **B)** {{slot_b}}",
  ].join("\n"),

  // M1a — falta algun dato DESPUES de agendar. Maximo 2 re-preguntas; a la tercera se deja de
  // insistir (la demo ya esta reservada: un campo del CRM no vale molestar a quien ya dijo que si).
  M1a: "Perfecto, anotado {{datos_que_si_dio}}. Me falta sólo {{dato_faltante}} — ¿me lo pasa?",

  // M1_RAMA_DENTAL — pregunta EXTRA de rama, no del guion general. Solo la ve el rubro que la
  // necesita. Tiene que decir el `missLabel` del campo de rama con esas mismas palabras (el banco
  // lee de ahi que dato se esta pidiendo).
  M1_RAMA_DENTAL: [
    "Perfecto, eso me sirve. Una sola cosa más para que {{humano}} llegue con la demo armada: ¿cuántos sillones tiene? (1, 2, 3 o más)",
  ].join("\n"),

  // M1c — descalificado suave. YA NO se descarta por rubro ni por tamaño (Onia es una plataforma
  // por modulos: una ferreteria de 12 personas es mejor cliente, no peor). Este texto queda solo
  // para quien claramente NO es un negocio: alguien buscando trabajo o alguien que nos quiere
  // vender algo. Ante la duda NO se descarta: se deriva a un humano.
  // ESTE COMENTARIO ES EL FUNDAMENTO DEL ORDEN NUEVO: si las 3 preguntas ya no descartan a nadie,
  // no hay ninguna razon para cobrarlas antes de ofrecer la reunion. El descarte se evalua igual
  // en cualquier punto del embudo — tambien despues de reservar, cuando llegan los datos de M2.
  M1c: [
    "Gracias por contarme. {{producto}} es el sistema que usa un negocio para trabajar, así que por acá no le voy a poder ayudar — no es una bolsa de trabajo ni un lugar para ofrecernos servicios.",
    "",
    "Si más adelante maneja un negocio (o trabaja en uno al que le sirva), escríbame DEMO y lo agendamos igual.",
  ].join("\n"),

  // M1_PACIENTE — el PACIENTE que llego por la pauta dental (busca turno, el precio de un
  // tratamiento, tiene un dolor). Salida cortes: dice que NO somos una clinica y a donde ir, sin
  // vender nada, sin horarios y sin precios. Puede ser el PRIMER mensaje ("Busco atencion dental"
  // es la respuesta para tocar del anuncio), por eso trae el disclosure de bot (D2) adentro.
  // No dice "DEMO" como M1c: a un paciente no se le deja una puerta de venta abierta.
  M1_PACIENTE: [
    "Le escribe {{bot}} — sí, un bot. {{producto}} no es una clínica: hacemos el sistema con el que las clínicas organizan su agenda y sus pacientes, así que por acá no le puedo dar un turno ni atenderle.",
    "",
    "Para eso escríbale directo a su clínica o a su dentista. ¡Gracias por escribir!",
  ].join("\n"),

  // M2 — confirmacion de la reserva + LAS PREGUNTAS. Es el nuevo lugar de la calificacion: el
  // prospecto ya se comprometio, asi que contesta mucho mas que en el primer mensaje.
  // {{preguntas}} lo arma el motor con los datos que TODAVIA faltan (nunca vuelve a pedir lo que
  // el prospecto ya dijo) + la pregunta del dolor, que va SIEMPRE al final de la lista.
  // La primera linea PROMETIA "te llega el link el mismo dia por aca" y NADIE lo cumplia: no
  // existia ningun proceso que mandara ese link, asi que el prospecto esperaba el dia de la demo
  // y no le llegaba nada. Y aunque el recordatorio ya existe (M9), la promesa seguiria siendo
  // mentira en un caso REAL: fuera de la ventana de servicio de 24 h de Meta (contada desde el
  // ultimo mensaje ENTRANTE) un mensaje de formato libre falla con 131047, asi que a quien reserva
  // para dentro de 3 dias no se le puede escribir el dia de la demo. Por eso el link ya no se
  // promete: se MANDA ACA MISMO (M2_LINK, que run-turn.mjs pega al final en cuanto Cal.com
  // devuelve la reserva). Este es el unico momento garantizado dentro de la ventana — el prospecto
  // acaba de escribir. M9 pasa a ser lo que su nombre dice: un recordatorio, no la unica entrega.
  M2: [
    "Listo, agendado: **{{dia_hora_elegida}}**.",
    "",
    "Para que {{humano}} llegue con la demo armada para usted, cuénteme rápido:",
    "{{preguntas}}",
    "",
    "(Con una palabra en cada una alcanza. Si no, igual nos vemos {{dia}}.)",
  ].join("\n"),

  // M2_LINK — se APENDEA a M2 cuando la reserva en Cal.com devolvio uid. Vive en el guion (y no
  // suelto en run-turn.mjs) porque es copy que ve el prospecto: todo lo que se le dice esta aca.
  M2_LINK: "El link para entrar es este: {{link_reunion}}",

  // M2_SIN_RESERVA / M2_HORARIO_TOMADO — REEMPLAZAN a M2 (no se le pegan) cuando el bot tiene
  // agenda propia (`ONIA_BOT_AGENDA=calcom`) y la reserva NO salio. Hasta el 2-oct se le pegaba
  // una salvedad al final de M2 y el prospecto leia «Listo, agendado» y en la linea siguiente «estoy
  // confirmando ese horario» (auditoria 2-oct, §2 accion 3). Lo que se le dice tiene que ser lo que
  // paso: lo eligio, NO quedo reservado y quien se lo confirma. Sin «nos vemos {{dia}}»: eso tambien
  // es confirmarla.
  // SIN PREGUNTAS (3-oct). Aca seguian «contame rápido: 1️⃣ rubro 2️⃣ personas 3️⃣ ciudad 4️⃣ dolor»,
  // pero la conversacion pasa a `handoff_humano`, que no lee datos: el prospecto contestaba y recibia
  // M5_ACUSE («no te lo contesto yo»), con la calificacion tirada. No se pide lo que el bot no va a
  // leer; lo que falte lo pregunta {{humano}} al confirmarle.
  // Los usa `reservaQueNoSalio` (calcom-booking.mjs), el mismo en los tres caminos (vivo, seco y
  // simulador).
  M2_SIN_RESERVA: "Anoté **{{dia_hora_elegida}}**, pero todavía no quedó reservado: {{humano}} se lo confirma {{via_humano}}.",
  M2_HORARIO_TOMADO:
    "Uy, **{{dia_hora_elegida}}** se acaba de ocupar. {{humano}} le escribe {{via_humano}} para acomodar otro horario.",

  // M2_PREGUNTA_DOLOR — el ultimo item de la lista de M2. Vive aca y no en el motor porque es
  // copy de cliente, como el resto del guion.
  M2_PREGUNTA_DOLOR:
    "¿Qué es lo que más tiempo le come hoy: la **agenda**, los **cobros** o los **clientes que no vuelven**?",

  // M2b — acuse de lo que el prospecto contesto despues de agendar (datos y/o dolor). Sin esto el
  // bot queda mudo ante la respuesta que el propio M2 pide. Sigue siendo texto fijo y sin cifras.
  M2b: "Anotado: {{datos_que_si_dio}}. {{humano}} llega con eso preparado.{{nota_modulo}} Nos vemos {{dia_hora_elegida}}.",

  // M3 — follow-up unico a las 22 h (dentro de la ventana de servicio de 24 h de Meta).
  M3: [
    "¡Hola de nuevo! Le escribí ayer por la demo de {{producto}} y quedó a medias — sé que el negocio no para.",
    "",
    "Le dejo dos opciones nuevas por si le sirven: **{{slot_a}}** o **{{slot_b}}**.",
    "Dígame cuál le queda mejor y la dejamos agendada.",
  ].join("\n"),

  // M3_PLANTILLA — el MISMO follow-up, pero cuando la ventana de 24 h de Meta ya se cerro.
  // COPIA LITERAL de la plantilla `seguimiento_demo` (es · MARKETING · APPROVED) tal como esta
  // aprobada en Meta: la aprobada es la que se envia de verdad, esto es solo lo que queda en el
  // panel y en la bitacora. Si las dos no dicen lo mismo, la bitacora miente.
  // TOCAR ESTE TEXTO NO CAMBIA LO QUE RECIBE EL PROSPECTO: hay que reaprobar la plantilla en Meta.
  // Las variables son POSICIONALES ({{1}}, {{2}}) porque asi las nombra Meta, no el guion.
  // Cuesta ~0,0740 USD por envio (6,5x el recordatorio): es marketing, no utility.
  M3_PLANTILLA: [
    "¡Hola de nuevo! Te escribí por la demo de Onia y quedó a medias — sé que el negocio no para.",
    "",
    "Si querés retomarla, te dejo dos horarios: *{{1}}* o *{{2}}*.",
    "",
    // El cierre NO puede sacarse del todo: Meta rechaza una plantilla que TERMINA en variable
    // (code 100 / subcode 2388299, "las variables no pueden estar al principio ni al final").
    // Antes aca decia "respondé BAJA y listo". Se saco por decision de Sergio: no se ofrece dejar
    // de escribir. El MECANISMO sigue vivo — intents.mjs reconoce stop/baja/dar de baja/borrame y
    // escribe opt_out_at — solo dejo de anunciarse. Riesgo asumido: sin salida visible, el que se
    // molesta bloquea en vez de pedir la baja, y Meta mide eso como calidad.
    "Decime cuál te queda mejor y la dejamos agendada.",
  ].join("\n"),

  // M9 — recordatorio del DIA de la demo (barrido reminder-run.mjs). Es un RECORDATORIO, no la
  // entrega del link: el link ya salio en M2. Por eso puede fallar sin romper nada — si la ventana
  // de 24 h de Meta ya se cerro, el barrido lo descarta con `fuera_de_ventana` y el prospecto
  // igual tiene su link del primer dia.
  // No dice "hoy" a proposito: la antelacion es config (`reminder.leadHours`) y una copy que se
  // vuelve mentira al mover un numero es exactamente el error que este archivo viene arrastrando.
  M9_RECORDATORIO: [
    "¡Hola! Le recuerdo su demo de {{producto}}: **{{dia_hora_elegida}}**.",
    "",
    "Entrás desde acá: {{link_reunion}}",
    "",
    "Si se le complicó, dígame y la movemos — sin problema.",
  ].join("\n"),

  // M9_PLANTILLA — el MISMO recordatorio, pero cuando la ventana de 24 h de Meta ya se cerro (el
  // caso normal de quien reservo para dentro de 3 dias). COPIA LITERAL de la plantilla
  // `recordatorio_demo` (es · UTILITY · APPROVED) — mismas reglas que M3_PLANTILLA: la aprobada es
  // la que sale, esto es lo que se ve en el panel, y editar aca NO cambia lo que recibe el
  // prospecto. Cuesta ~0,0113 USD por envio.
  // Fijate que "Onia" va escrito y no como variable: en la plantilla aprobada esta hardcodeado.
  M9_PLANTILLA: [
    "¡Hola! Te recuerdo tu demo de Onia: *{{1}}*.",
    "",
    "Entrás desde acá: {{2}}",
    "",
    "Si se te complicó, decime y la movemos — sin problema.",
  ].join("\n"),

  // M4 — el prospecto trae el precio. El cuerpo NUNCA cotiza; el cierre lo pone el motor segun
  // el estado (spec §2.3 + regla de oro §2.1: el estado no avanza sin dato capturado).
  M4_BODY: [
    "Buena pregunta, y se la contesto derecho: **el número exacto se lo pasa {{humano}} en la demo**, porque depende del tamaño de su equipo y de qué módulos necesita activar. No le quiero tirar una cifra que después no sea la suya.",
    "",
    "Lo que sí le adelanto: en la demo se hace la cuenta con SUS números — cuánto le cuesta hoy el trabajo que se hace a mano contra lo que cuesta el sistema. Si no cierra, se lo decimos ahí mismo.",
  ].join("\n"),

  // M5 — handoff a humano. La via ({{via_humano}}) se DERIVA del canal: ver `viaDelCanal`.
  // Acá decía "desde este mismo número", y para el 100% de los leads del widget web eso es
  // imposible de cumplir — llegan sin teléfono (medido en Chatwoot el 2026-09-18: inbox 4,
  // 11 conversaciones, CERO con número). Justo en el mensaje que recibe el que pidió hablar
  // con una persona.
  M5: [
    "Eso lo tiene que ver {{humano}}, no yo — soy un bot y no quiero inventarle una respuesta.",
    "",
    "Ya le pasé su consulta con todo lo que me contó. Le escribe {{via_humano}}, en horario de oficina ({{horario_frase}}). Si es urgente, dígame \"urgente\" y lo marco.",
  ].join("\n"),

  // M5_ACUSE — el mensaje que llega DESPUES de haber derivado, mientras el humano todavia no
  // aparecio. No reabre la conversacion ni promete nada nuevo: solo confirma que lo que escribio
  // llego. Nace de medir, el 2026-09-03, que tras cada M5 el mensaje siguiente del prospecto se
  // comia un silencio total — la persona ve "entregado" y nunca una respuesta.
  M5_ACUSE: [
    "Lo leo, y esto también se lo paso a {{humano}} — sigo siendo el bot, así que no se lo contesto yo para no inventarle nada.",
    "",
    "Ya está todo en su bandeja. Le responde desde acá mismo en horario de oficina ({{horario_frase}}).",
  ].join("\n"),

  // M5_URGENTE — la respuesta a la palabra que M5 y M8_SOPORTE le PIDIERON al prospecto, y a
  // quien dice que quiere comprar. No reemplaza al acuse: es lo que se contesta cuando de verdad
  // se marcó, y por eso afirma en pasado ("lo marqué"). Decirlo sin que salga el aviso sería la
  // segunda promesa rota encima de la primera.
  M5_URGENTE: [
    "Listo, lo marqué como urgente y {{humano}} ya lo tiene arriba de todo.",
    "",
    "Le escribe {{via_humano}}. Si es fuera de horario de oficina ({{horario_frase}}), es lo primero que ve al abrir.",
  ].join("\n"),

  // M8_SOPORTE — SEGUNDO CAMINO: el que escribe YA es cliente (o dice que ya tiene el sistema, o
  // que algo no le anda, o pregunta como configurarlo). Ofrecerle la demo COMERCIAL a alguien que
  // pide ayuda es el peor error posible del bot: le dice "comprame" a quien ya compro. Este texto
  // reemplaza a M5 en ese handoff, y el bot igual se presenta como bot (D2).
  M8_SOPORTE: [
    "Un momento: si ya está usando {{producto}}, esto no es una demo de venta: es soporte. Y el soporte no se lo puedo dar yo, que soy un bot.",
    "",
    "Le paso su mensaje a {{humano}} tal cual me lo contó. Le responde {{via_humano}} en horario de oficina ({{horario_frase}}) y, si hace falta, le coordina una llamada corta para dejarlo funcionando. Si le está frenando el trabajo ahora mismo, dígame \"urgente\" y lo marco.",
  ].join("\n"),

  // M6 — opt-out.
  M6: "Listo, no le escribo más. Si algún día quiere verlo, escriba DEMO y arrancamos de nuevo. ¡Éxitos con el negocio!",

  // M7 — fuera de horario. Se APENDEA a la respuesta que corresponda, no la reemplaza.
  // "te confirma en la mañana" era falso: entre semana Sergio Urcullo atiende 14-17 y 20-22, no
  // por la mañana. Al que escribe un lunes a las 9:30 se le prometia una respuesta que no iba a
  // llegar. Ahora la ventana se DICE, derivada de la misma fuente que decide si es "fuera".
  M7: "_(Estoy respondiendo automático fuera de horario de atención. {{humano}} le confirma apenas vuelva: {{horario_frase}}.)_",

  // SIAT / fiscal — respuesta fija segura (spec §2.3). Solo lo que es publico, cero promesa.
  //
  // SIN FECHA A PROPOSITO. Acá decía "desde el 30 de septiembre es obligatoria", que es justo el
  // dato que caduca — y este texto es el FALLBACK de la FAQ `siat`, la que lleva
  // `vigenteHasta: 2026-09-30`. O sea al vencer la FAQ el guion caía acá y repetía la misma
  // afirmación, sin vencimiento que la pudiera callar: medido el 2026-09-05 corriendo el motor
  // con el reloj en 2026-10-15 y en 2027-06-01, el bot seguía diciéndola en futuro sobre algo que
  // para el prospecto ya había pasado. El vencimiento quedaba decorativo.
  //
  // La fecha vive en la FAQ, que es la que sabe vencerse. Acá va sólo lo durablemente cierto, y
  // el "desde cuándo te aplica a vos" —que además depende del NIT y del grupo de contribuyente—
  // se deriva al humano, que es de quien era la respuesta desde el principio.
  // Lo cuida `fecha-que-caduca.test.mjs` sobre el guion ENTERO, no sobre esta clave.
  M_SIAT_BODY:
    "Sobre facturación en línea le contesto sólo lo que es público: el SIN tiene un portal gratis. Lo que hace {{producto}} es que los datos ya estén cargados para que no tipee dos veces. Desde cuándo le aplica a usted según su NIT lo ve {{humano}} en la demo.",

  // M0 SIN HORARIOS — la bienvenida cuando no hay disponibilidad real que ofrecer.
  // No es un caso raro: alcanza con que Cal.com no conteste O con que la agenda no tenga hueco en
  // el rango (una semana llena, un feriado). Antes se mandaba M0 con el placeholder literal
  // ("HORARIO A (pendiente de definir)") y encima el prospecto no podia elegirlo, asi que la
  // conversacion moria en el primer mensaje — justo el mensaje que vende "un asistente que agenda
  // solo". Aca no se inventa un horario: se lo atiende igual y lo coordina un humano.
  // M0_PERSONA — la bienvenida cuando el bot NO tiene agenda propia (`ONIA_BOT_AGENDA` distinto de
  // `calcom`, que es el DEFAULT). Nace de la auditoria del 2-oct: con horarios del cron y sin nadie
  // que los reservara, M0 decia «Tengo estos dos horarios» y M2 «Listo, agendado», y la demo no
  // quedaba en ningun lado. Sin agenda no hay «agendo yo»: se ofrece la demo y el horario lo
  // coordina la persona ({{coordina_demo}}: el link de la agenda real si el conocimiento la trae;
  // si no, «te escribe {{humano}}»). No dice «no tengo horarios»: exhibir una carencia en la
  // primera frase lo prohibe la regla del 2026-08-20. La pregunta del final (M0_PERSONA_PREGUNTA)
  // va solo si no sigue la respuesta de una campaña, que ya trae las suyas.
  M0_PERSONA: [
    "¡Hola! Soy el asistente automático de Onia. Sí, un bot.",
    "",
    "{{producto}} es una plataforma por módulos para que su negocio trabaje adentro: agenda, cobros y clientes en un solo lugar.",
    "",
    "Le muestro cómo quedaría en SU negocio en {{demo_duracion}} por {{demo_modalidad}}. {{coordina_demo}}",
  ].join("\n"),
  // {{dato_faltante}}: el PRIMER dato de calificacion que falta (`missLabel`), no siempre el rubro.
  M0_PERSONA_PREGUNTA: "Cuénteme mientras: ¿{{dato_faltante}}?",
  COORDINA_PERSONA: "El horario lo coordina directo con {{humano}}: le escribe {{via_humano}}.",
  COORDINA_LINK: "Elija el horario que le quede bien acá 👉 {{link_agenda}}",
  // M_HORARIO_SIN_AGENDA — sin agenda propia, alguien elige un horario de una oferta VIEJA (la
  // conversacion nacio cuando el bot todavia ofrecia horarios y sigue viva en la base). No se
  // confirma ni se reserva: se acusa lo que eligio y lo confirma la persona.
  M_HORARIO_SIN_AGENDA: "Anoté que le queda bien **{{slot_elegido}}**. {{humano}} se lo confirma {{via_humano}}.",

  M0_SIN_HORARIOS: [
    "¡Hola! Le escribe {{bot}} — sí, un bot. Es justamente lo que hacemos: sistemas que atienden solos.",
    "",
    "{{producto}} es una plataforma por módulos para que un negocio trabaje adentro: agenda, cobros, clientes.",
    "",
    "Justo ahora no tengo horarios libres para ofrecerle, así que {{humano}} le coordina uno personalmente — le escribe {{via_humano}}.",
    "",
    "Cuénteme mientras: ¿a qué se dedica su negocio?",
  ].join("\n"),

  // "¿Que hacen?" / "¿que es Onia?". El marco es fijo; la LISTA sale de `config.productos`, que
  // la capa de conocimiento edita sin desplegar — es la unica forma de que un producto nuevo no
  // tarde un deploy en existir para el bot. Lo que NO se edita es cual esta listo (ver
  // MODULOS_LISTOS): eso es una promesa comercial, no un dato.
  M_QUE_ES_ONIA: [
    "{{producto}} es una plataforma por módulos: su negocio trabaja adentro (agenda, cobros, clientes) y hay agentes que contestan por WhatsApp.",
    "",
    "{{productos}}",
    "",
    "Cuál le sirve a usted lo ve {{humano}} en la demo, con sus números.",
  ].join("\n"),

  // Audio que no se pudo transcribir (spec §2.3).
  // El audio LLEGO perfecto y esta guardado en Chatwoot: el que no puede oirlo es el bot
  // (`npm run destinos:vivos`). Decirle "no me llego bien" le echa la culpa a su conexion y lo
  // invita a reintentar el mismo audio, que va a fallar igual. Se dice la verdad y se pide texto
  // UNA vez; si insiste con audio, offScriptCount lo lleva a un humano, que si lo puede escuchar.
  M_AUDIO_FAIL: "Recibí su audio, pero no lo puedo escuchar yo. ¿Me lo escribe?",

  // Imagen / documento (spec §2.3): se reconoce y se pasa a humano.
  M_ATTACH_BODY: "Recibí su archivo. Lo mira {{humano}}, no lo puedo leer bien yo.",

  // Cierres de embudo — AGREGADOS: son la linea con la que una respuesta fuera de guion
  // (precio / SIAT / archivo) vuelve al embudo sin saltear la calificacion.
  PENDING_CALIFICACION: "Volviendo a lo nuestro: me falta {{dato_faltante}} — ¿me lo pasa?",
  PENDING_HORARIO: "¿Le reservo **{{slot_a}}** o **{{slot_b}}**?",
  // Eligio un horario que ya no se puede sostener (paso, o dejo de dar el dia de aviso que le
  // prometimos en ese mismo mensaje). No se le confirma, y tampoco se le asigna en silencio
  // uno de los nuevos: el "A" de hoy no es el "A" que el vio. Se le dice y elige de nuevo.
  M0_HORARIO_CADUCO: [
    "Uy, **{{slot_elegido}}** ya no lo tengo disponible — pasó el tiempo desde que se lo ofrecí y no quiero confirmarle algo que no puedo sostener.",
    "",
    "Estos son los horarios que tengo ahora:",
    "",
    "**A)** {{slot_a}}",
    "**B)** {{slot_b}}",
    "",
    "¿Cuál le sirve? (o escríbame \"otro\" y lo coordinamos)",
  ].join("\n"),
  // PENDING_HORARIO_SIN_HORARIOS — la misma re-pregunta cuando `slots` sigue en "pendiente de
  // definir". PENDING_HORARIO pide elegir entre {{slot_a}} y {{slot_b}}, y sin horarios reales eso
  // salio a produccion como "¿Te reservo HORARIO A (pendiente de definir) o HORARIO B (pendiente de
  // definir)?" — y, via el LLM, como "¿horario A o horario B?". Se pide lo unico accionable sin
  // agenda (el contacto) y la hora la coordina el humano.
  PENDING_HORARIO_SIN_HORARIOS: "{{humano}} le coordina el horario personalmente y le escribe {{via_humano}}.",
  PENDING_AGENDADA: "Igual ya quedamos para **{{dia_hora_elegida}}**.",

  // -------------------------------------------------------------------------
  // MODO RECEPCIONISTA — el bot de un CLIENTE de Onia (config.modo === "recepcionista").
  // Se activa SOLO cuando el conocimiento vino de la fila publicada de una org (fuente "db"):
  // el bot se presenta como el asistente DEL NEGOCIO y atiende como recepcionista. El funnel de
  // venta (DEMO, calificacion, M4) es EXCLUSIVO del modo venta y no aparece aca. {{producto}} y
  // {{humano}} salen del knowledge de la org, no de Onia. Ver recepcionista.mjs.
  // -------------------------------------------------------------------------

  // M0R — saludo. Se declara bot (D2) y ofrece lo unico que sabe hacer: horarios, servicios,
  // tomar un pedido. No promete agendar solo: lo confirma el humano del negocio.
  M0R: [
    "¡Hola! Soy el asistente de {{producto}}.",
    "",
    "Te puedo contar nuestros horarios y qué ofrecemos, o tomar tu pedido para que te lo confirme {{humano}}.",
    "",
    "¿En qué te ayudo?",
  ].join("\n"),

  // M0R_INTRO — cuando el PRIMER mensaje ya trae una pregunta concreta: se contesta la pregunta,
  // pero el bot igual se presenta como el asistente del negocio (D2, sin excepcion).
  M0R_INTRO: "¡Hola! Soy el asistente de {{producto}}.",

  R_HORARIO: "Atendemos {{horario_frase}}. ¿Te ayudo con algo más?",

  // La FAQ editable del dueño: el cuerpo YA paso el guardrail al publicarse (todo-o-nada);
  // la plantilla solo lo sirve. Ver knowledge.mjs FAQ_TEMPLATE.negocio y recepcionista.mjs.
  R_FAQ_NEGOCIO: "{{faq_respuesta}}",
  // La respuesta de una campaña es TEXTO DEL DUEÑO (validado por guardrails al publicar).
  R_CAMPANA: "{{respuesta_campana}}",

  // {{catalogo_cliente}} lo arma recepcionista.mjs desde `conocimiento.productos` (el catalogo
  // publicado de la org). NO pasa por MODULOS_LISTOS: ese candado protege promesas de software
  // de Onia; el catalogo de un cliente son hechos suyos ya validados por el guardrail.
  R_SERVICIOS: [
    "Esto es lo que ofrecemos:",
    "",
    "{{catalogo_cliente}}",
    "",
    "Si querés algo de esto, decime y te lo confirma {{humano}}.",
  ].join("\n"),

  R_CITA: "La cita dura {{demo_duracion}} y es por {{demo_modalidad}}. Si querés una, decime y te la coordina {{humano}}.",

  // R_AGENDA — el bot AGENDA: manda el link de la agenda publica de ESA org, que ya crea la cita
  // de verdad. {{link_reserva}} lo compone recepcionista.mjs desde el slug y solo sale si el slug
  // pasa el validador (sin slug este mensaje NO existe y se deriva por R_INTERES, como antes).
  // "te la confirma" no es adorno: la cita nace en estado PENDIENTE y la confirma el negocio —
  // decir "queda confirmada" seria prometer algo que la agenda no hace.
  R_AGENDA: [
    "¡Dale! Reservá tu cita acá 👉 {{link_reserva}}",
    "",
    "Elegís el día y la hora que te queden bien, y {{humano}} te la confirma por este mismo chat.",
  ].join("\n"),

  // R_INTERES — pedido (y cita en una org SIN agenda publica): se ESCALA, el bot no vende solo.
  // La promesa "ya le paso tu pedido" es verdad: este mensaje solo sale junto con el handoff
  // real (review_queue + aviso). La cita con agenda encendida NO pasa por aca: sale por R_AGENDA.
  R_INTERES: [
    "¡Buenísimo! Ya le paso tu pedido a {{humano}} — te confirma por este mismo chat.",
    "",
    "Si querés, dejame tu nombre y algún detalle más mientras tanto.",
  ].join("\n"),

  // R_PRECIO — JAMAS una cifra: el precio lo confirma el humano del negocio.
  R_PRECIO: "Los precios te los confirma {{humano}} directamente — ya le pasé tu consulta y te responde por este mismo chat.",

  // R_DERIVA — todo lo que el recepcionista no sabe contestar va a un humano. "Ya le pasé tu
  // mensaje" solo se dice junto al handoff real (misma regla de honestidad que R_INTERES).
  R_DERIVA: "Eso te lo confirma {{humano}} — ya le pasé tu mensaje y te responde por este mismo chat.",

  // R_NO_DATO — el knowledge de la org NO trae ese campo: respuesta honesta + handoff. El bot
  // nunca rellena con los datos de Onia (el horario de Onia no es el del negocio).
  R_NO_DATO: "Eso no lo tengo acá para confirmártelo — te lo confirma {{humano}} por este mismo chat.",

  R_ATTACH: "Recibí tu archivo. Se lo paso a {{humano}}, que te confirma por acá.",
  // R_AUDIO — el paciente/cliente mando una nota de voz y no la podemos transcribir. Mismo molde
  // que R_ATTACH: se acusa recibo sin culpar a nadie y se pide texto. Si vuelve a mandar audio,
  // deja de insistir el bot y lo escucha una persona (ver la rama `voice` de recepcionista.mjs).
  R_AUDIO: "Recibí tu audio, pero no lo puedo escuchar yo. ¿Me lo escribís?",
  R_AUDIO_DERIVA: "Recibí tu audio. Se lo paso a {{humano}}, que lo escucha y te responde por acá.",
  // R_CUOTA_AGOTADA — la org agoto sus conversaciones automaticas del mes (lo dice /published).
  // Texto FIJO y honesto, cero LLM; {{producto}} es el nombre del negocio en modo recepcionista.
  R_CUOTA_AGOTADA: "Este mes ya atendimos el máximo de conversaciones automáticas de {{producto}}. Te responde una persona en breve.",
  // Insistencia v6.6 (1 sola vez, suave, dentro de la ventana de 24 h — texto libre gratis):
  R_SEGUIMIENTO: "¡Hola! ¿Seguís por ahí? Si te quedó alguna duda, {{humano}} te la contesta por acá. Y si preferís que no te escribamos, decínos \"no gracias\" y listo.",
  // Vision (v5): cuando la foto se pudo describir SIN violar guardrails. La descripcion
  // viene del LLM ya filtrada; si violaba una regla se descarto y sale R_ATTACH pelado.
  // Comprobante de pago: acusar recibo SIN confirmar jamas — confirma el humano.
  R_COMPROBANTE: "Recibí tu comprobante{{monto_frase}}. Se lo paso a {{humano}} para confirmarlo — apenas lo revise te avisamos por acá.",
  R_ATTACH_VISTO: "Recibí tu foto ({{descripcion_foto}}). Se la paso a {{humano}}, que te confirma por acá.",

  // M6R — opt-out en modo recepcionista. Sin "escribí DEMO": eso es del funnel de venta.
  M6R: "Listo, no te escribo más por acá. ¡Gracias!",
});

// ---------------------------------------------------------------------------
// Catalogo — QUE vendemos (el equivalente de RUBROS, que es A QUIEN le vendemos)
// ---------------------------------------------------------------------------
// La verdad de esta lista es la MISMA que dice la web publica (onia.com.bo/empezar): dental
// armado, el resto en construccion "sin humo". Si el bot dijera otra cosa que la web, una de las
// dos estaria mintiendo y la que se lleva el reclamo es la que hablo por WhatsApp.
//
// Esto es el PISO: `config.productos` lo puede reemplazar la capa de conocimiento sin desplegar
// (asi un producto nuevo existe para el bot el mismo dia que existe para el negocio).
// DOS FAMILIAS, y la diferencia no es cosmetica:
//   - `modulo`  = software de la plataforma. Puede NO estar construido todavia, y decir que si lo
//                 esta es prometer una feature (N2). Por eso pasa por MODULOS_LISTOS.
//   - `servicio` = trabajo que Onia hace hoy (una web, un chatbot, videos, redes). Existe: se
//                 entrega. Marcarlo "en construccion" seria mentir para el otro lado y regalar
//                 justamente lo que ya se puede vender.
// Los servicios salen de lo que ya se vende en la web (lib/pricing.ts → ADDONS) y de los add-ons
// que aparecen en las propuestas reales (propuestas/generador/clientes.json).
export const PRODUCTOS = Object.freeze([
  Object.freeze({ key: "dental", nombre: "Dental", queResuelve: "agenda, recordatorios y cobros de una clínica" }),
  Object.freeze({ key: "comercio", nombre: "Comercio", queResuelve: "stock, ventas y clientes de una tienda" }),
  Object.freeze({ key: "servicios", nombre: "Servicios", queResuelve: "turnos, clientes y cobros de un negocio de servicios" }),
  Object.freeze({ key: "proveedores", nombre: "Importadora", queResuelve: "importaciones, costos y precios de una distribuidora" }),
  Object.freeze({ key: "estetica", nombre: "Estética y spa", queResuelve: "agenda, clientas, tratamientos y caja" }),

  Object.freeze({ key: "web", tipo: "servicio", nombre: "la web de su negocio" }),
  // Sin "con IA": el chatbot que se le entrega a un cliente es el modo recepcionista, que atiende
  // SIN LLM por decision (recepcionista.mjs, regla 4). Decir IA ahi era prometer lo que no hace.
  Object.freeze({ key: "chatbot", tipo: "servicio", nombre: "un chatbot de WhatsApp para su negocio" }),
  Object.freeze({ key: "videos_ia", tipo: "servicio", nombre: "videos e influencers con IA" }),
  Object.freeze({ key: "redes", tipo: "servicio", nombre: "conexión y publicación en redes" }),
  Object.freeze({ key: "automatizaciones", tipo: "servicio", nombre: "automatizaciones a medida" }),
]);

/**
 * Los modulos que EXISTEN de verdad, hoy. Congelado en codigo A PROPOSITO y sin campo equivalente
 * en el archivo editable: encender un modulo es una promesa comercial (N2), no un hecho. Por eso
 * cambia por commit — con el modulo construido delante — y nunca por una edicion.
 * Agregar un producto "en construccion" si es libre: eso no promete nada.
 */
// 2026-08-13: pasa de {dental} a tres. Evidencia, no opinion: la app REAL en produccion
// (app.onia.com.bo/register) dice con todas las letras "Clinicas dentales · Comercios ·
// Importadoras" y deja registrarse en los tres con 14 dias gratis. El bot estaba SUBVENDIENDO —
// le decia "en construccion, sin humo" a dos rubros que el producto ya atiende, o sea que
// regalaba dos de cada tres prospectos.
// OJO: onia.com.bo/empezar (la web de marketing) todavia marca solo dental como disponible. La
// web y el producto se contradicen; la fuente de verdad para el bot es lo que el cliente puede
// CONTRATAR hoy, no lo que dice el folleto.
//
// 2026-09-05: pasa de tres a CINCO, y es el mismo error de arriba repetido — el bot volvio a
// quedarse atras de una decision que Sergio ya habia tomado. `esteticagest-clinical` y
// `gestios-servicios-profesionales` estan en RUBROS_ACTIVOS (onia-platform/lib/platform/
// rubros-activos.ts), la lista que la pantalla de alta OFRECE y que el endpoint ACEPTA, y el
// build vivo los sirve. Mientras tanto el bot le contestaba "Servicios: en construcción, sin
// humo" a un contador que podia registrarse y pagar ese mismo dia, y a una esteticista ni la
// nombraba: 2 de 5 rubros, el 40% de los prospectos.
// intents.mjs:490 decia "esa decision es de Sergio, no de este archivo" — y tenia razon: la
// decision es suya y ya esta tomada, escrita en RUBROS_ACTIVOS. Lo que faltaba era barrerla
// hasta esta superficie. Que no se desincronice de nuevo lo vigila `rubros-vivos.mjs`, que cruza
// las dos listas contra el otro repo.
// VETERINARIA sigue afuera, y no por olvido: `Invoice.patientId` es obligatorio y la factura toma
// nombre y NIT DEL PACIENTE, que en una veterinaria es el animal. Vuelve cuando exista la
// separacion paciente/responsable.
export const MODULOS_LISTOS = Object.freeze(
  new Set(["dental", "comercio", "proveedores", "servicios", "estetica"]),
);

/**
 * HORA SILENCIOSA — un solo hecho, un solo par de numeros.
 *
 * Los TRES barridos que le mandan un mensaje a una persona (follow-up M3,
 * recordatorio M9, insistencia) comparten la misma pregunta: a esta hora, ¿molesto?
 * Cada uno la contesta en SU bloque de config, pero leyendo de aca: tres numeros
 * sueltos serian tres politicas para el mismo hecho, que es la trampa que este
 * archivo ya pago una vez con la duracion de la demo (15 en el texto / 45 en el
 * calendario).
 *
 * El motivo es el mismo en los tres: un WhatsApp a las 5 de la mañana molesta y
 * castiga el quality rating de la linea, que es lo unico que no se repone. Y no
 * pierde el mensaje: el descarte es TRANSITORIO, la fila sigue elegible y sale en
 * el primer barrido de la mañana.
 */
const HORA_SILENCIOSA_DESDE = 8;
const HORA_SILENCIOSA_HASTA = 21;

// ---------------------------------------------------------------------------
// Config completa
// ---------------------------------------------------------------------------
export const DEFAULT_CONFIG = Object.freeze({
  botKey: "onia-demo-bot",
  tenant: "onia",

  identity: Object.freeze({
    // La marca es `Onia`, siempre asi escrita (nunca ONIA ni OnIA). El producto que se vende es
    // LA PLATAFORMA, no el pack de un rubro: "Onia Dental" era el nombre de un modulo puesto en
    // el lugar del producto. El modulo se nombra aparte y solo cuando aplica (ver branches).
    botName: "el asistente automático de Onia",
    productName: "Onia",
    humanName: "Sergio",
    tone: "voseo-boliviano-informal",
  }),

  // Que vendemos. Editable sin desplegar (ver knowledge.mjs → `productos`).
  productos: PRODUCTOS,

  // Disparadores. 'demo' abre/reabre la conversacion; 'optOut' la cierra en cualquier punto.
  triggers: Object.freeze({
    demo: Object.freeze(["demo", "quiero la demo", "info", "informacion", "quiero info"]),
    optOut: Object.freeze(["stop", "baja", "no me escribas", "no me interesa", "dejame de escribir"]),
  }),

  qualification: Object.freeze({
    maxReAsks: 2, // a la 3ra re-pregunta sin datos se deja de insistir (spec D3)
    // Los 3 datos UNIVERSALES que se le piden a cualquier negocio, DESPUES de reservar la demo.
    // El `missLabel` es el texto con el que el guion nombra el dato: M2 y M1a lo escriben literal
    // (M2 lo arma con `{{preguntas}}`), y el banco lee de ahi que se esta preguntando. Si cambia
    // uno, cambia el guion.
    fields: Object.freeze([
      Object.freeze({ key: "industry", missLabel: "a qué se dedica su negocio" }),
      Object.freeze({ key: "teamSize", missLabel: "cuántas personas trabajan ahí" }),
      Object.freeze({ key: "city", missLabel: "en qué ciudad está" }),
    ]),
    // RAMIFICACION POR RUBRO. Un rubro puede pedir UN dato extra despues de los 3 universales.
    // Hoy solo odontologia: el sillon es su unidad de capacidad y Sergio llega a la demo sabiendo
    // de que tamaño hablar. Cualquier otro rubro no ve esta pregunta nunca.
    // El dato de rama NO bloquea nada: se pregunta una sola vez, con la demo YA reservada.
    branches: Object.freeze({
      dental: Object.freeze({
        key: "dental",
        askKey: "M1_RAMA_DENTAL",
        field: Object.freeze({ key: "chairs", missLabel: "cuántos sillones tiene" }),
        // Se nombra el modulo SOLO donde existe de verdad. Nombrar un modulo que no esta armado
        // es prometer una feature (N2) con otro disfraz.
        moduleNote: " El módulo dental ya está armado justo para eso.",
      }),
    }),
    // NO se descarta por tamaño ni por rubro: con la plataforma por modulos, un negocio grande es
    // mejor cliente, no peor. Solo se descarta lo que claramente NO es un negocio (ver intents.mjs
    // isDisqualified). Ante la duda, NO se descarta: se deriva a un humano.
  }),

  slots: DEMO_SLOTS,
  // Los que se pueden ACEPTAR sin estar en el par ofrecido (ver `slotsElegibles`). Vacio por
  // defecto: sin spec publicado no hay ningun horario extra que prometer.
  slotsElegibles: Object.freeze([]),

  handoff: Object.freeze({
    ownerRoleKey: "sergio",
    reviewQueue: Object.freeze({
      sourceType: "lead", // ya esta en el CHECK de review_queue: no hace falta ALTER
      reviewerRoleKey: "sergio",
      sensitive: true,
      status: "pending",
    }),
    notifyChannel: "telegram",
  }),

  // Valores EXACTOS que el panel entiende (onia-center-store.ts). Escribir otra cosa deja el
  // lead mal clasificado y en silencio.
  pipelineStatus: Object.freeze({
    calificado: "Contactado",
    demo_agendada: "Reunion",
    demo_realizada: "Propuesta",
    descartado: "Perdido",
  }),

  demo: DEMO,

  businessHours: Object.freeze({
    // TODO esto se DERIVA de `ventanas-de-atencion.mjs`, que es la misma fuente que usa el .py
    // para calcular los horarios de demo que el bot OFRECE. Tipeado a mano decia
    // "lun-vie, 9:00-18:00" mientras el bot ofrecia demos a las 14:00 y los sabados: prometia
    // atencion a las 9:30 de un lunes (no hay nadie) y mandaba a esperar al lunes al que
    // escribia un sabado a las 10 (si hay). Ver ventanas-de-atencion.test.mjs.
    days: Object.freeze(diasDeAtencion()),
    // Las franjas REALES, que son las que deciden. `startHour`/`endHour` de abajo son la
    // ENVOLVENTE de la semana y existen solo para el override de un cliente (ver knowledge.mjs).
    franjas: Object.freeze(
      Object.fromEntries(
        Object.entries(franjasDeAtencion()).map(([dia, franjas]) => [
          dia,
          Object.freeze(franjas.map((f) => Object.freeze(f))),
        ]),
      ),
    ),
    ...envolventeDeAtencion(),
    // Como se DICE el horario en el guion ({{horario_frase}}). Derivado de las MISMAS ventanas
    // para que no puedan decir una cosa y hacer otra.
    frase: fraseDeAtencion(),
    tzLabel: "America/La_Paz",
    tzOffsetMinutes: -240, // Bolivia no tiene horario de verano: siempre UTC-4
  }),

  offScript: Object.freeze({ maxBeforeHandoff: 2 }), // 2do malentendido -> handoff

  followUp: Object.freeze({
    maxSteps: 1, // regla N7: UN follow-up y despues silencio
    // 20 h, no 22 ni 24. La ventana de servicio de Meta se cuenta desde el ULTIMO MENSAJE
    // ENTRANTE (asi lo ancla followup-run.mjs, verificado). Con 22 quedaban 2 horas de colchon:
    // si el cron se atrasa, el mensaje cae fuera de la ventana y falla con 131047, y fuera de
    // la ventana solo salen plantillas, que se PAGAN. Con 20 quedan 4. O sea que las 4 horas de
    // colchon ya no compran "que el mensaje salga" —hoy sale igual, como plantilla— sino que
    // salga GRATIS: cada atraso del cron que cruce las 24 h cuesta ~0,0740 USD en vez de 0,0113.
    // (Decia "plantillas — que hoy no existen"; corregido el 2026-09-18, ver `windowClosesAtHours`.)
    afterHours: 20,
    // Donde cierra la ventana de servicio de Meta, contada desde el ultimo mensaje ENTRANTE.
    // NO es el tope de la franja elegible: ese es `staleAfterDays` (7 dias), y lo fija
    // followup-run.test.mjs:151 ("piso: los 7 dias de staleAfterDays"). Lo que decide este
    // numero es COMO sale el mensaje, no A QUIEN se le manda — adentro texto libre (gratis),
    // afuera la plantilla `seguimiento_demo`, que se PAGA (~0,0740 USD contra 0,0113 del texto
    // libre) y por eso el barrido la declara en `sendKind` en vez de esconderla en la factura.
    //
    // ⚠️ Esto decia "TOPE DURO … fuera de la ventana SOLO salen plantillas, que hoy no existen
    // y ademas no hay metodo de pago" — corregido el 2026-09-18 contra el codigo. Era cierto
    // cuando se escribio y dejo de serlo al aprobarse `seguimiento_demo` (followup-run.mjs:154
    // lo dice: "antes … porque no habia plantilla; ahora la hay y el mensaje SALE"). Asi como
    // estaba, afirmaba que este barrido no puede pasar de 24 h ni gastar un centavo, y las dos
    // son falsas: entre 24 h y 7 dias manda plantilla paga. Un comentario que declara IMPOSIBLE
    // un gasto que el codigo si hace es el que apaga la auditoria del proximo que lea.
    windowClosesAtHours: 24,
    staleAfterDays: 7,
    // HORA SILENCIOSA. A quien se le escribe lo elige el SILENCIO del prospecto, asi que la hora
    // de salida es la de entrada corrida 20 h: el que escribe a las 10:00 recibiria el seguimiento
    // a las 06:00, y el cron corre las 24 horas. Mismo piso que el recordatorio M9 (y por el mismo
    // motivo, que su config ya explica: molesta y castiga el quality rating), mas un techo, porque
    // aca la hora mala tambien puede ser la noche. Esperar no pierde el mensaje: la fila sigue
    // elegible y sale a las 08:00 — a lo sumo la ventana de Meta se cerro y sale la plantilla
    // `seguimiento_demo`, que cuesta ~0,074 USD. Escribirle a las 5 de la mañana cuesta la linea.
    quietBeforeHour: HORA_SILENCIOSA_DESDE,
    quietAfterHour: HORA_SILENCIOSA_HASTA,
  }),

  // Recordatorio del dia de la demo (M9). La ventana de Meta NO se repite aca: es UN solo hecho
  // del canal y vive en `followUp.windowClosesAtHours` (el follow-up fue el primero en chocarse
  // con ella). Dos numeros para el mismo hecho es la trampa que este archivo ya pago una vez con
  // la duracion de la demo (15 en el texto / 45 en el calendario).
  reminder: Object.freeze({
    // 4 h antes. Con el cron cada hora, el recordatorio sale en el primer barrido en que la demo
    // entra en esa franja, o sea ~4 h antes: alcanza para acomodar el dia y no es tan temprano
    // como para olvidarse. Y cuanto ANTES sale, mas chance de que la ventana de Meta siga
    // abierta: esa ventana se cierra a una hora FIJA (ultimo inbound + 24 h), no relativa a la
    // demo, asi que cada hora de antelacion que se gana es una hora menos de riesgo de 131047.
    leadHours: 4,
    // Nunca antes de las 08:00 de Bolivia. Una demo a las 09:00 caeria en un barrido de las 05:00
    // y un WhatsApp a esa hora molesta y castiga el quality rating. No pierde el recordatorio: la
    // fila sigue elegible y sale en el barrido de las 08:00, todavia con una hora de antelacion.
    quietBeforeHour: HORA_SILENCIOSA_DESDE,
  }),

  // Insistencia del RECEPCIONISTA (el asistente de un cliente le insiste UNA vez a alguien
  // que dejo de contestar). Su franja llego ultima, el 2026-09-18, y no por olvido: hasta
  // hoy la unica que tenia era la de su linea de cron (`*/30 12-23` UTC), y el gate que cerro
  // este mismo defecto en el follow-up la CITO como si fuera la garantia. Tres razones por las
  // que un crontab no puede serlo:
  //
  //   1. Es una franja de ARRANQUE, no de decision: `insistencia-run.sh` se corre a mano para
  //      depurar y a las 3 de la mañana manda igual.
  //   2. Vive fuera de git —su linea ya fue editada a mano— asi que perderla no deja senal.
  //   3. Y la de fondo: este es el UNICO barrido MULTI-ORG. Le escribe a los clientes DEL
  //      CLIENTE, y la hora decente es la del negocio; un crontab solo sabe decir UTC.
  //
  // Techo ademas de piso, igual que el follow-up y por el mismo motivo: aca la hora mala
  // tambien puede ser la noche. La franja del cron queda como segunda red, no como la unica.
  insistencia: Object.freeze({
    quietBeforeHour: HORA_SILENCIOSA_DESDE,
    quietAfterHour: HORA_SILENCIOSA_HASTA,
  }),

  // Conversacion VENCIDA: si nadie (ni el prospecto, ni el bot, ni un humano) escribio en
  // N dias y llega un mensaje real, la conversacion se reinicia al guion desde el saludo —
  // incluido el candado de humanTookOver. Sin esto, el candado de una prueba vieja calla al
  // bot para siempre: el 2026-09-10 Sergio mando "hola" a su conversacion del 15-ago
  // (human_took_over desde el 13-ago) y recibio NADA (rama=MUDO, conv 11). 14 dias y no
  // menos: un humano puede estar negociando con una semana de silencio en el medio, y que
  // el bot se le meta con la bienvenida en esa charla es peor que el candado.
  // El opt-out NUNCA se reinicia por tiempo: a quien dijo basta solo lo reabre "DEMO" (M6).
  reinicio: Object.freeze({ trasDiasSinActividad: 14 }),

  // Arranca en true (patron de Bolivian Electric): corre todo el pipeline y registra
  // delivery_status='skipped' sin mandar un solo mensaje.
  dryRun: true,

  script: SCRIPT,
});

/**
 * Config del cliente = base + overrides (merge de un nivel por clave raiz).
 * @param {object} [base]  sobre que se mergea. Por defecto DEFAULT_CONFIG; knowledge.mjs le pasa
 *   la config ya armada del turno para no pisar los horarios que vinieron de Cal.com.
 */
export function createBotConfig(overrides = {}, base = DEFAULT_CONFIG) {
  const merged = { ...base };
  for (const [key, value] of Object.entries(overrides || {})) {
    if (value && typeof value === "object" && !Array.isArray(value) && base[key] && typeof base[key] === "object" && !Array.isArray(base[key])) {
      merged[key] = { ...base[key], ...value };
    } else {
      merged[key] = value;
    }
  }
  return Object.freeze(merged);
}

/**
 * ¿El numero que el guion PROMETE y el que se RESERVA dicen lo mismo?
 * Existe para que la contradiccion "15 en el texto / 45 en el calendario" no pueda volver a
 * colarse en silencio: la miden knowledge.test.mjs (sobre el codigo) y knowledge.mjs (sobre el
 * archivo editable, que se rechaza entero si no coinciden).
 * @returns {{minutos:number|null, fraseMinutos:number|null, coherente:boolean, pendiente:boolean}}
 *   `fraseMinutos` es el ULTIMO numero de la frase ("15-20 minutos" -> 20). Sin numero -> null,
 *   y entonces no hay nada que contradecir.
 */
export function demoDuration(config = DEFAULT_CONFIG) {
  const demo = (config && config.demo) || DEMO;
  const numeros = String(demo.duracionFrase ?? "").match(/\d+/g);
  const fraseMinutos = numeros && numeros.length ? Number(numeros[numeros.length - 1]) : null;
  const minutos = Number.isFinite(demo.duracionMinutos) ? demo.duracionMinutos : null;
  return {
    minutos,
    fraseMinutos,
    coherente: fraseMinutos === null || minutos === null || fraseMinutos === minutos,
    pendiente: demo.pendiente === true,
  };
}

/**
 * La rama del rubro, si ese rubro tiene una. `null` = el rubro no pide nada extra y el prospecto
 * pasa derecho a los horarios (que es el caso de casi todos).
 */
export function branchFor(industry, config = DEFAULT_CONFIG) {
  if (!industry) return null;
  return (config.qualification && config.qualification.branches && config.qualification.branches[industry]) || null;
}

/**
 * Los 3 campos universales + los campos de rama, sin repetidos.
 * Lo usa el banco para juzgar QUE dato se guardo y cual se volvio a preguntar: si mirara solo los
 * 3 universales, perder o inventar el dato de rama no contaria como fallo.
 */
export function allQualificationFields(config = DEFAULT_CONFIG) {
  const fields = [...(config.qualification.fields || [])];
  const seen = new Set(fields.map((field) => field.key));
  for (const branch of Object.values(config.qualification.branches || {})) {
    if (branch && branch.field && !seen.has(branch.field.key)) {
      fields.push(branch.field);
      seen.add(branch.field.key);
    }
  }
  return fields;
}

/** true si los 2 horarios siguen siendo el placeholder (Sergio no los definio todavia). */
export function slotsPending(config = DEFAULT_CONFIG) {
  return (config.slots || []).some((slot) => slot && slot.pending === true);
}

/**
 * ¿El bot tiene con que AGENDAR? `config.agenda.modo === "persona"` dice que no: no ofrece
 * horarios propios, no confirma una eleccion y el horario lo coordina la persona.
 *
 * El modo lo fija el ENTORNO (`agendaDelEntorno` en calcom-booking.mjs: `ONIA_BOT_AGENDA`, con la
 * persona por default) en los armadores de config de produccion (run-turn, followup-run,
 * simulate). Una config sin `agenda` —la de los tests del motor, que traen sus horarios a mano—
 * conserva lo de siempre: los horarios que trae son los que ofrece.
 */
export function agendaPropia(config = DEFAULT_CONFIG) {
  return config?.agenda?.modo !== "persona";
}

/** Sin agenda propia o sin horarios de verdad: el guion no pone horarios sobre la mesa. */
export function sinHorariosQueOfrecer(config = DEFAULT_CONFIG) {
  return !agendaPropia(config) || slotsPending(config);
}

/**
 * ¿Lo que viene ANTES de este marcador abre una oracion nueva?
 *
 * Abre oracion si no hay nada antes, o si lo anterior termina en `.`, `!`, `?` o salto de linea.
 * Los dos puntos NO abren oracion en castellano ("Anotado: agenda y cobros"), y por eso se
 * excluyen a mano: es la unica diferencia entre esta regla y un capitalizado a lo bruto.
 */
function abreOracion(anterior) {
  const previo = anterior.replace(/[ \t]+$/, "");
  return previo === "" || /[.!?\n]$/.test(previo);
}

/**
 * Reemplaza {{clave}} por su valor. Corre SIEMPRE DESPUES del guardrail (spec §3.1).
 *
 * Capitaliza el valor cuando cae a empezar oracion. Nace de un defecto que salio a produccion y
 * lo vio el cliente del cliente (conversacion 51, 2026-09-03), textual:
 *
 *     _(Estoy respondiendo automatico fuera de horario de oficina. la encargada te confirma
 *     en la mañana.)_
 *
 * El humano de Onia es un nombre propio (`Sergio`) y por eso nunca se noto; el conocimiento de
 * un cliente trae un CARGO en minuscula, y hay cuatro plantillas donde `{{humano}}` abre frase.
 * La regla mira el offset y no la clave a proposito: atarla a `humano` dejaria el mismo bug vivo
 * en la proxima plantilla que alguien escriba. Solo toca la primera letra si es minuscula, asi
 * que un nombre propio, una viñeta o un `**negrita**` pasan intactos.
 */
/**
 * Por qué vía le va a escribir el humano, DERIVADA del canal por el que entró la conversación.
 *
 * Se decide por el `channel_type` que manda Chatwoot y NUNCA por el número de inbox — la misma
 * regla que ya fija `canal-whatsapp-vivo.test.mjs`: un id es un dato de instalación, se renumera
 * al recrear un inbox y no dice nada del medio.
 *
 * El default es la forma canal-agnóstica, y esa es la mitad que importa: "por este mismo chat"
 * es cierto en WhatsApp, en el widget, en la API y en el canal que se conecte mañana, así que
 * un canal que no sabemos leer degrada a una promesa que igual se puede cumplir. Al revés
 * —adivinar que hay teléfono— es prometerle un mensaje a alguien que no tiene dónde recibirlo.
 */
/**
 * Como se NOMBRA el canal cuando hay que decirle a un humano por donde contestar.
 *
 * Existe aparte de `viaDelCanal` porque son dos audiencias: `viaDelCanal` le habla al PROSPECTO
 * ("desde este mismo número") y esto le habla a quien tiene que CUMPLIR esa promesa ("WhatsApp").
 * Lo que NO puede haber son dos decisiones: las dos preguntan lo mismo, y por eso `viaDelCanal`
 * se apoya en esta. Un segundo regex sería una copia benévola que acierta hasta que alguien
 * cambie una sola de las dos.
 *
 * @returns {string|null} null = no vino el canal. Es distinto de "no lo reconozco".
 */
export function nombreDelCanal(channelType) {
  const crudo = String(channelType ?? "").trim();
  if (!crudo) return null;
  if (/^Channel::Whatsapp$/i.test(crudo)) return "WhatsApp";
  if (/^Channel::WebWidget$/i.test(crudo)) return "web";
  // Un canal que no conocemos se nombra CRUDO y no se descarta: el aviso sirve igual, y el día
  // que Chatwoot sume un canal el síntoma es un nombre feo, no un aviso mudo.
  return crudo.replace(/^Channel::/i, "");
}

export function viaDelCanal(channelType) {
  return nombreDelCanal(channelType) === "WhatsApp"
    ? "desde este mismo número"
    : "por este mismo chat";
}

export function renderTemplate(text, vars = {}) {
  const plantilla = String(text ?? "");
  return plantilla.replace(/\{\{\s*([a-z0-9_]+)\s*\}\}/gi, (match, key, offset) => {
    const value = vars[key];
    if (value === undefined || value === null) return match;
    const rendered = String(value);
    if (!abreOracion(plantilla.slice(0, offset))) return rendered;
    const inicial = rendered.charAt(0);
    if (inicial !== inicial.toLowerCase() || inicial === inicial.toUpperCase()) return rendered;
    return inicial.toUpperCase() + rendered.slice(1);
  });
}

/** "a", "a y b", "a, b y c" */
export function joinEs(items) {
  const list = (items || []).filter(Boolean);
  if (list.length === 0) return "";
  if (list.length === 1) return list[0];
  return `${list.slice(0, -1).join(", ")} y ${list[list.length - 1]}`;
}

/**
 * Hora local de Bolivia (0-23) del instante recibido, o null si el ISO no se puede leer.
 * Determinista: solo lee el ISO inyectado, nunca Date.now().
 *
 * Vive aca —y no en el barrido que la estreno— porque la usan DOS barridos para decidir lo
 * mismo (si es hora de escribirle a una persona), y dos copias de esa cuenta son dos politicas
 * de "no molestar" que pueden separarse sin que nada se ponga rojo.
 */
export function localHour(isoInstant, config = DEFAULT_CONFIG) {
  const ms = Date.parse(isoInstant);
  if (!Number.isFinite(ms)) return null;
  const offset = config?.businessHours?.tzOffsetMinutes ?? DEFAULT_CONFIG.businessHours.tzOffsetMinutes;
  return new Date(ms + offset * 60000).getUTCHours();
}

/**
 * ¿El instante recibido cae fuera del horario de atencion?
 * Determinista: solo lee el ISO inyectado, nunca Date.now().
 */
export function isOutsideBusinessHours(isoInstant, config = DEFAULT_CONFIG) {
  if (!isoInstant) return false;
  const ms = Date.parse(isoInstant);
  if (Number.isNaN(ms)) return false;
  const bh = config.businessHours;
  // Con franjas (el default de Onia: dos por dia de semana, una el sabado) decide la fuente
  // unica; sin ellas —un CLIENTE que declaro su horario corrido— decide el rango que declaro.
  if (bh.franjas) return fueraDeAtencion(isoInstant, config);
  const local = new Date(ms + bh.tzOffsetMinutes * 60000);
  if (!bh.days.includes(local.getUTCDay())) return true;
  const hour = local.getUTCHours() + local.getUTCMinutes() / 60;
  return hour < bh.startHour || hour >= bh.endHour;
}
