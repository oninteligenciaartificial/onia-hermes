// ONIA — Chatbot propio (el que atiende "DEMO"): CONFIG POR CLIENTE.
// Todo lo que cambia de un cliente a otro vive ACA (spec §7.1): identidad y tono, disparador,
// preguntas de calificacion, horarios ofrecidos, destino del handoff, horario de atencion y
// los textos M0-M7 del guion.
// Lo que NO se toca por cliente (spec §7.2) vive en bot-engine.mjs y guardrails.mjs:
// la maquina de estados, el guardrail determinista, el silencio ante un humano, opt-in/opt-out,
// la reserva CAS y la bitacora completa.
// Spec: hermes-content/docs/ONIA_CHATBOT_PROPIO_SPEC_20260725.md

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
  // El disclosure de bot va en la PRIMERA linea (D2) y ademas es el argumento de venta: lo que el
  // prospecto esta viendo funcionar es exactamente lo que se le vende. No pide un solo dato: la
  // unica pregunta del mensaje es la que cierra la reunion.
  M0: [
    "¡Hola! Soy el asistente automático de Onia. Sí, un bot 🙂",
    "",
    "Y esto que estás viendo es justo lo que vendemos: un asistente que atiende tu WhatsApp 24/7 — responde, califica y agenda solo, sin que vos toques el teléfono.",
    "",
    "Te muestro cómo quedaría en TU negocio en {{demo_duracion}} por {{demo_modalidad}}. Tengo estos dos horarios:",
    "",
    "**A)** {{slot_a}}",
    "**B)** {{slot_b}}",
    "",
    '¿Cuál te va mejor? (o escribime "otro" y lo coordinamos)',
  ].join("\n"),

  // M0b — el prospecto contesto con datos de su negocio en vez de elegir horario. Se le acusa
  // recibo (para que no repita lo que ya dijo) y se le vuelven a poner los dos horarios sobre la
  // mesa. Mandarlo a la rama LLM por un mensaje que se entendio perfecto gasta una respuesta y,
  // al segundo, un handoff — en alguien que esta colaborando.
  M0b: [
    "Perfecto, anotado {{datos_que_si_dio}} — el resto lo vemos en la demo.",
    "",
    "¿Cuál te va mejor? **A)** {{slot_a}} · **B)** {{slot_b}}",
  ].join("\n"),

  // M1a — falta algun dato DESPUES de agendar. Maximo 2 re-preguntas; a la tercera se deja de
  // insistir (la demo ya esta reservada: un campo del CRM no vale molestar a quien ya dijo que si).
  M1a: "Perfecto, anotado {{datos_que_si_dio}}. Me falta sólo {{dato_faltante}} — ¿me lo pasás?",

  // M1_RAMA_DENTAL — pregunta EXTRA de rama, no del guion general. Solo la ve el rubro que la
  // necesita. Tiene que decir el `missLabel` del campo de rama con esas mismas palabras (el banco
  // lee de ahi que dato se esta pidiendo).
  M1_RAMA_DENTAL: [
    "Perfecto, eso me sirve. Una sola cosa más para que {{humano}} llegue con la demo armada: ¿cuántos sillones tenés? (1, 2, 3 o más)",
  ].join("\n"),

  // M1c — descalificado suave. YA NO se descarta por rubro ni por tamaño (Onia es una plataforma
  // por modulos: una ferreteria de 12 personas es mejor cliente, no peor). Este texto queda solo
  // para quien claramente NO es un negocio: alguien buscando trabajo o alguien que nos quiere
  // vender algo. Ante la duda NO se descarta: se deriva a un humano.
  // ESTE COMENTARIO ES EL FUNDAMENTO DEL ORDEN NUEVO: si las 3 preguntas ya no descartan a nadie,
  // no hay ninguna razon para cobrarlas antes de ofrecer la reunion. El descarte se evalua igual
  // en cualquier punto del embudo — tambien despues de reservar, cuando llegan los datos de M2.
  M1c: [
    "Gracias por contarme. {{producto}} es el sistema que usa un negocio para trabajar, así que por acá no te voy a poder ayudar — no es una bolsa de trabajo ni un lugar para ofrecernos servicios.",
    "",
    "Si más adelante manejás un negocio (o trabajás en uno al que le sirva), escribime DEMO y lo agendamos igual.",
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
    "Para que {{humano}} llegue con la demo armada para vos, contame rápido:",
    "{{preguntas}}",
    "",
    "(Con una palabra en cada una alcanza. Si no, igual nos vemos {{dia}}.)",
  ].join("\n"),

  // M2_LINK — se APENDEA a M2 cuando la reserva en Cal.com devolvio uid. Vive en el guion (y no
  // suelto en run-turn.mjs) porque es copy que ve el prospecto: todo lo que se le dice esta aca.
  M2_LINK: "El link para entrar es este: {{link_reunion}}",

  // M2_PREGUNTA_DOLOR — el ultimo item de la lista de M2. Vive aca y no en el motor porque es
  // copy de cliente, como el resto del guion.
  M2_PREGUNTA_DOLOR:
    "¿Qué es lo que más tiempo te come hoy: la **agenda**, los **cobros** o los **clientes que no vuelven**?",

  // M2b — acuse de lo que el prospecto contesto despues de agendar (datos y/o dolor). Sin esto el
  // bot queda mudo ante la respuesta que el propio M2 pide. Sigue siendo texto fijo y sin cifras.
  M2b: "Anotado: {{datos_que_si_dio}}. {{humano}} llega con eso preparado.{{nota_modulo}} Nos vemos {{dia_hora_elegida}}.",

  // M3 — follow-up unico a las 22 h (dentro de la ventana de servicio de 24 h de Meta).
  M3: [
    "¡Hola de nuevo! Te escribí ayer por la demo de {{producto}} y quedó a medias — sé que el negocio no para.",
    "",
    "Te dejo dos opciones nuevas por si te sirven: **{{slot_a}}** o **{{slot_b}}**.",
    "Si preferís que te escriba en otro momento, decime \"después\" y no te molesto más.",
  ].join("\n"),

  // M9 — recordatorio del DIA de la demo (barrido reminder-run.mjs). Es un RECORDATORIO, no la
  // entrega del link: el link ya salio en M2. Por eso puede fallar sin romper nada — si la ventana
  // de 24 h de Meta ya se cerro, el barrido lo descarta con `fuera_de_ventana` y el prospecto
  // igual tiene su link del primer dia.
  // No dice "hoy" a proposito: la antelacion es config (`reminder.leadHours`) y una copy que se
  // vuelve mentira al mover un numero es exactamente el error que este archivo viene arrastrando.
  M9_RECORDATORIO: [
    "¡Hola! Te recuerdo tu demo de {{producto}}: **{{dia_hora_elegida}}**.",
    "",
    "Entrás desde acá: {{link_reunion}}",
    "",
    "Si se te complicó, decime y la movemos — sin problema.",
  ].join("\n"),

  // M4 — el prospecto trae el precio. El cuerpo NUNCA cotiza; el cierre lo pone el motor segun
  // el estado (spec §2.3 + regla de oro §2.1: el estado no avanza sin dato capturado).
  M4_BODY: [
    "Buena pregunta, y te la contesto derecho: **el número exacto te lo pasa {{humano}} en la demo**, porque depende del tamaño de tu equipo y de qué módulos necesitás activar. No te quiero tirar una cifra que después no sea la tuya.",
    "",
    "Lo que sí te adelanto: en la demo se hace la cuenta con TUS números — cuánto te cuesta hoy el trabajo que se hace a mano contra lo que cuesta el sistema. Si no cierra, te lo decimos ahí mismo.",
  ].join("\n"),

  // M5 — handoff a humano.
  M5: [
    "Eso lo tiene que ver {{humano}}, no yo — soy un bot y no quiero inventarte una respuesta.",
    "",
    "Ya le pasé tu consulta con todo lo que me contaste. Te escribe él desde este mismo número, en horario de oficina ({{horario_frase}}). Si es urgente, decime \"urgente\" y lo marco.",
  ].join("\n"),

  // M8_SOPORTE — SEGUNDO CAMINO: el que escribe YA es cliente (o dice que ya tiene el sistema, o
  // que algo no le anda, o pregunta como configurarlo). Ofrecerle la demo COMERCIAL a alguien que
  // pide ayuda es el peor error posible del bot: le dice "comprame" a quien ya compro. Este texto
  // reemplaza a M5 en ese handoff, y el bot igual se presenta como bot (D2).
  M8_SOPORTE: [
    "Pará — si ya estás usando {{producto}}, esto no es una demo de venta: es soporte. Y el soporte no te lo puedo dar yo, que soy un bot.",
    "",
    "Le paso tu mensaje a {{humano}} tal cual me lo contaste. Te responde desde este mismo número en horario de oficina ({{horario_frase}}) y, si hace falta, te coordina una llamada corta para dejarlo funcionando. Si te está frenando el trabajo ahora mismo, decime \"urgente\" y lo marco.",
  ].join("\n"),

  // M6 — opt-out.
  M6: "Listo, no te escribo más. Si algún día querés verlo, escribí DEMO y arrancamos de nuevo. ¡Éxitos con el negocio!",

  // M7 — fuera de horario. Se APENDEA a la respuesta que corresponda, no la reemplaza.
  M7: "_(Estoy respondiendo automático fuera de horario de oficina. {{humano}} te confirma en la mañana.)_",

  // SIAT / fiscal — respuesta fija segura (spec §2.3). Solo lo que es publico, cero promesa.
  M_SIAT_BODY:
    "Sobre facturación en línea te contesto sólo lo que es público: desde el 30 de septiembre es obligatoria y el SIN tiene un portal gratis. Lo que hace {{producto}} es que los datos ya estén cargados para que no tipees dos veces. El detalle exacto de tu caso lo ve {{humano}} en la demo.",

  // M0 SIN HORARIOS — la bienvenida cuando no hay disponibilidad real que ofrecer.
  // No es un caso raro: alcanza con que Cal.com no conteste O con que la agenda no tenga hueco en
  // el rango (una semana llena, un feriado). Antes se mandaba M0 con el placeholder literal
  // ("HORARIO A (pendiente de definir)") y encima el prospecto no podia elegirlo, asi que la
  // conversacion moria en el primer mensaje — justo el mensaje que vende "un asistente que agenda
  // solo". Aca no se inventa un horario: se lo atiende igual y lo coordina un humano.
  M0_SIN_HORARIOS: [
    "¡Hola! Te escribe {{bot}} — sí, un bot. Es justamente lo que hacemos: sistemas que atienden solos.",
    "",
    "{{producto}} es una plataforma por módulos para que un negocio trabaje adentro: agenda, cobros, clientes.",
    "",
    "Justo ahora no tengo horarios libres para ofrecerte, así que {{humano}} te coordina uno personalmente — te escribe él.",
    "",
    "Contame mientras: ¿a qué se dedica tu negocio?",
  ].join("\n"),

  // "¿Que hacen?" / "¿que es Onia?". El marco es fijo; la LISTA sale de `config.productos`, que
  // la capa de conocimiento edita sin desplegar — es la unica forma de que un producto nuevo no
  // tarde un deploy en existir para el bot. Lo que NO se edita es cual esta listo (ver
  // MODULOS_LISTOS): eso es una promesa comercial, no un dato.
  M_QUE_ES_ONIA: [
    "{{producto}} es una plataforma por módulos: tu negocio trabaja adentro (agenda, cobros, clientes) y hay agentes que contestan por WhatsApp.",
    "",
    "{{productos}}",
    "",
    "Cuál te sirve a vos lo ve {{humano}} en la demo, con tus números.",
  ].join("\n"),

  // Audio que no se pudo transcribir (spec §2.3).
  M_AUDIO_FAIL: "No me llegó bien el audio, ¿me lo escribís?",

  // Imagen / documento (spec §2.3): se reconoce y se pasa a humano.
  M_ATTACH_BODY: "Recibí tu archivo. Lo mira {{humano}}, no lo puedo leer bien yo.",

  // Cierres de embudo — AGREGADOS: son la linea con la que una respuesta fuera de guion
  // (precio / SIAT / archivo) vuelve al embudo sin saltear la calificacion.
  PENDING_CALIFICACION: "Volviendo a lo nuestro: me falta {{dato_faltante}} — ¿me lo pasás?",
  PENDING_HORARIO: "¿Te reservo **{{slot_a}}** o **{{slot_b}}**?",
  PENDING_AGENDADA: "Igual ya quedamos para **{{dia_hora_elegida}}**.",
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

  Object.freeze({ key: "web", tipo: "servicio", nombre: "la web de tu negocio" }),
  Object.freeze({ key: "chatbot", tipo: "servicio", nombre: "un chatbot de WhatsApp con IA" }),
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
export const MODULOS_LISTOS = Object.freeze(new Set(["dental"]));

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
      Object.freeze({ key: "industry", missLabel: "a qué se dedica tu negocio" }),
      Object.freeze({ key: "teamSize", missLabel: "cuántas personas trabajan ahí" }),
      Object.freeze({ key: "city", missLabel: "en qué ciudad estás" }),
    ]),
    // RAMIFICACION POR RUBRO. Un rubro puede pedir UN dato extra despues de los 3 universales.
    // Hoy solo odontologia: el sillon es su unidad de capacidad y Sergio llega a la demo sabiendo
    // de que tamaño hablar. Cualquier otro rubro no ve esta pregunta nunca.
    // El dato de rama NO bloquea nada: se pregunta una sola vez, con la demo YA reservada.
    branches: Object.freeze({
      dental: Object.freeze({
        key: "dental",
        askKey: "M1_RAMA_DENTAL",
        field: Object.freeze({ key: "chairs", missLabel: "cuántos sillones tenés" }),
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
    days: Object.freeze([1, 2, 3, 4, 5]), // lun-vie (0 = domingo)
    startHour: 9,
    endHour: 18,
    // Como se DICE el horario en el guion ({{horario_frase}}). Sale del mismo bloque que los
    // numeros de arriba para que no puedan decir una cosa y hacer otra.
    frase: "lun-vie, 9:00-18:00",
    tzLabel: "America/La_Paz",
    tzOffsetMinutes: -240, // Bolivia no tiene horario de verano: siempre UTC-4
  }),

  offScript: Object.freeze({ maxBeforeHandoff: 2 }), // 2do malentendido -> handoff

  followUp: Object.freeze({
    maxSteps: 1, // regla N7: UN follow-up y despues silencio
    // 20 h, no 22 ni 24. La ventana de servicio de Meta se cuenta desde el ULTIMO MENSAJE
    // ENTRANTE (asi lo ancla followup-run.mjs, verificado). Con 22 quedaban 2 horas de colchon:
    // si el cron se atrasa, el mensaje cae fuera de la ventana y falla con 131047, y fuera de
    // la ventana solo salen plantillas — que hoy no existen. Con 20 quedan 4.
    afterHours: 20,
    // TOPE DURO de la ventana de Meta. Sin esto la franja elegible iba de 20 h a `staleAfterDays`
    // (7 dias): todo lo que pasara de 24 h se intentaba igual y Meta lo rechaza con 131047, porque
    // fuera de la ventana SOLO salen plantillas — que hoy no existen y ademas no hay metodo de
    // pago. Se descubrio al encender el barrido: tenia 2 conversaciones de 124 h y 131 h esperando,
    // acumuladas porque el cron nunca existio. Si el mensaje no sale dentro de la ventana, no sale.
    windowClosesAtHours: 24,
    staleAfterDays: 7,
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
    quietBeforeHour: 8,
  }),

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

/** Reemplaza {{clave}} por su valor. Corre SIEMPRE DESPUES del guardrail (spec §3.1). */
export function renderTemplate(text, vars = {}) {
  return String(text ?? "").replace(/\{\{\s*([a-z0-9_]+)\s*\}\}/gi, (match, key) => {
    const value = vars[key];
    return value === undefined || value === null ? match : String(value);
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
 * ¿El instante recibido cae fuera del horario de atencion?
 * Determinista: solo lee el ISO inyectado, nunca Date.now().
 */
export function isOutsideBusinessHours(isoInstant, config = DEFAULT_CONFIG) {
  if (!isoInstant) return false;
  const ms = Date.parse(isoInstant);
  if (Number.isNaN(ms)) return false;
  const bh = config.businessHours;
  const local = new Date(ms + bh.tzOffsetMinutes * 60000);
  if (!bh.days.includes(local.getUTCDay())) return true;
  const hour = local.getUTCHours() + local.getUTCMinutes() / 60;
  return hour < bh.startHour || hour >= bh.endHour;
}
