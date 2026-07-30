// ONIA — Chatbot propio: LOS CASOS DEL BANCO.
//
// Escritos como escribe un dentista boliviano por WhatsApp: en minuscula, sin tildes, con
// typos, con audios transcritos a medias, con tres datos en un mismo mensaje, con "cuanto
// sale?" a secas, con "ya" como unica respuesta.
//
// Que es una respuesta CORRECTA (esto es lo que se mide, y no siempre es lo que el bot hace):
//   - `expect.route`  : la rama que el bot DEBERIA tomar, con el nombre que el propio motor
//                       le pone en `notes` (bienvenida, pregunta_precio, handoff, ...).
//   - `expect.stage`  : donde DEBERIA quedar la conversacion.
//   - `said`          : lo que el prospecto DIJO, campo por campo. Es la verdad del caso.
//                       Un campo ausente de `said` es un campo que NUNCA dijo: si el bot lo
//                       guarda igual, esta inventando el dato con el que despues califica.
//
// Regla al escribir un caso: la nota explica por que ESA es la respuesta correcta segun la
// spec, no por que el bot la da. Si la nota tuviera que decir "porque el regex hace X", el
// caso esta midiendo el codigo en vez del negocio y no va.
//
// El banco NO esta escrito para aprobar: casi todos los casos son mensajes que un vendedor
// humano contestaria sin pensar. Un banco que da 100% no encontro nada.

/** Mensaje que entrega los 3 datos de calificacion de una sola vez, bien escrito. */
const CALIFICA = "es mia, tengo 2 sillones y estoy en santa cruz";
const CALIFICADO = { ownsClinic: true, chairs: 2, city: "Santa Cruz" };

export const BENCH_CASES = Object.freeze([
  // =========================================================================
  // 1. Arranque y calificacion feliz — el piso que el bot tiene que sostener
  // =========================================================================
  {
    id: "hola-suelto",
    note: "todo el que escribe a este numero viene del CTA de Lucia: un 'hola' pelado abre el guion igual (spec §2.3)",
    tags: ["arranque"],
    turns: ["hola"],
    said: {},
    expect: { route: "bienvenida", stage: "esperando_calificacion" },
  },
  {
    id: "tres-datos-en-el-primer-mensaje",
    note: "si el primer mensaje ya trae los 3 datos, re-preguntarlos hace quedar mal al producto: se presenta como bot y ofrece horarios",
    tags: ["arranque", "calificacion"],
    turns: ["hola quiero la demo, la clinica es mia, tengo 2 sillones y estoy en tarija"],
    said: { ownsClinic: true, chairs: 2, city: "Tarija" },
    expect: { route: "calificado", stage: "esperando_horario" },
  },
  {
    id: "socio-califica",
    note: "quien decide con un socio SI es el publico (califica con nota); no es un descarte",
    tags: ["calificacion"],
    turns: ["DEMO", "la manejo con mi hermano, somos 2 sillones, en oruro"],
    said: { ownsClinic: "socio", chairs: 2, city: "Oruro" },
    expect: { route: "calificado", stage: "esperando_horario" },
  },
  {
    id: "sillones-numero-pelado",
    note: "el bot pregunto '¿cuantos sillones?' y el prospecto contesta '3': es la respuesta a lo que se le pregunto",
    tags: ["calificacion"],
    turns: ["DEMO", "es mia y estoy en sucre", "3"],
    said: { ownsClinic: true, chairs: 3, city: "Sucre" },
    expect: { route: "calificado", stage: "esperando_horario" },
  },
  {
    id: "sillones-son-tres",
    note: "'son 3' contesta la pregunta de los sillones igual que '3': el prospecto ya lo dijo y no se le puede volver a preguntar",
    tags: ["calificacion", "coloquial"],
    turns: ["DEMO", "es mia y estoy en sucre", "son 3"],
    said: { ownsClinic: true, chairs: 3, city: "Sucre" },
    expect: { route: "calificado", stage: "esperando_horario" },
  },
  {
    id: "sillones-uno-solo",
    note: "'tengo 1 solo sillon' dice la cantidad con todas las letras; una clinica de 1 sillon es el publico objetivo",
    tags: ["calificacion", "coloquial"],
    turns: ["DEMO", "es mia, tengo 1 solo sillon, en potosi"],
    said: { ownsClinic: true, chairs: 1, city: "Potosí" },
    expect: { route: "calificado", stage: "esperando_horario" },
  },
  {
    id: "duena-la-abri-yo",
    note: "'la abri yo' es la forma normal de decir que la clinica es propia; el dato quedo dicho y no se re-pregunta",
    tags: ["calificacion", "coloquial"],
    turns: ["DEMO", "si, la abri yo hace 5 años, tengo 2 sillones y estoy en tarija"],
    said: { ownsClinic: true, chairs: 2, city: "Tarija" },
    expect: { route: "calificado", stage: "esperando_horario" },
  },
  {
    id: "falta-un-dato",
    note: "faltando la ciudad, la respuesta correcta es pedir SOLO la ciudad (M1a), sin repetir lo ya contestado",
    tags: ["calificacion"],
    turns: ["DEMO", "es mia y tengo 2 sillones"],
    said: { ownsClinic: true, chairs: 2 },
    expect: { route: "repregunta", stage: "esperando_calificacion" },
  },

  // =========================================================================
  // 2. Extraccion de datos — lo que se guarda es lo que Sergio ve en el panel
  // =========================================================================
  {
    id: "ciudad-en-reunion",
    note: "'estoy en reunion' es la excusa mas comun de WhatsApp: NO dice una ciudad. Guardar 'Reunion' como ciudad ensucia el CRM y el bot lo repite en voz alta",
    tags: ["extraccion", "coloquial"],
    turns: ["DEMO", "estoy en reunion, te escribo mas tarde"],
    said: {},
    expect: { route: "off_guion", stage: "esperando_calificacion" },
  },
  {
    id: "ciudad-en-consulta",
    note: "misma familia: 'estoy en consulta' habla de lo que esta haciendo, no de donde vive",
    tags: ["extraccion", "coloquial"],
    turns: ["DEMO", "estoy en consulta ahora, dame un rato"],
    said: {},
    expect: { route: "off_guion", stage: "esperando_calificacion" },
  },
  {
    id: "el-alto-ausentismo",
    note: "'el alto ausentismo' no nombra la ciudad de El Alto; fijar la ciudad de un lead con una frase que habla de su problema deja el CRM mintiendo",
    tags: ["extraccion", "coloquial"],
    turns: ["DEMO", "mi problema es el alto ausentismo de los pacientes"],
    said: {},
    expect: { route: "off_guion", stage: "esperando_calificacion" },
  },
  {
    id: "ciudad-cocha",
    note: "'cocha' es como todo el mundo llama a Cochabamba; la lista de ciudades existe justamente para normalizar el nombre que va al CRM",
    tags: ["extraccion", "coloquial"],
    turns: ["DEMO", "estoy en cocha, tengo 2 sillones y es mia"],
    said: { ownsClinic: true, chairs: 2, city: "Cochabamba" },
    expect: { route: "calificado", stage: "esperando_horario" },
  },
  {
    id: "un-consultorio-no-es-un-sillon",
    note: "'tengo un consultorio' dice que la clinica es propia, NO que tenga un sillon. Contar 'un consultorio' como 1 sillon es inventar el dato con el que despues se califica (viola §2.1)",
    tags: ["extraccion", "regla-de-oro"],
    turns: ["DEMO", "es mia, tengo un consultorio en la paz"],
    said: { ownsClinic: true, city: "La Paz" },
    expect: { route: "repregunta", stage: "esperando_calificacion" },
  },
  {
    id: "dato-mal-tomado-no-se-corrige",
    note: "el prospecto corrige el numero de sillones en el mensaje siguiente: lo que vale es lo ultimo que dijo, no lo primero que el bot creyo entender",
    tags: ["extraccion", "correccion"],
    turns: ["DEMO", "tengo un consultorio en la paz", "en realidad son 4 sillones, y la clinica es mia"],
    said: { ownsClinic: true, chairs: 4, city: "La Paz" },
    expect: { route: "calificado", stage: "esperando_horario", replyMustNot: [/Con 1 sill/i] },
  },
  {
    id: "trabajo-en-la-de-mi-jefe",
    note: "'trabajo en la clinica de mi jefe' es la forma canonica de decir que NO es su clinica: es un descarte suave (M1c), no un lead a calificar",
    tags: ["extraccion", "descarte"],
    turns: ["DEMO", "trabajo en la clinica de mi jefe, son 3 sillones"],
    said: { ownsClinic: false, chairs: 3 },
    expect: { route: "descartado", stage: "descartado" },
  },
  {
    id: "estudiante",
    note: "un estudiante de odontologia no tiene clinica: descarte suave, sin hacerle perder 20 minutos",
    tags: ["descarte"],
    turns: ["DEMO", "soy estudiante de odontologia todavia"],
    said: {},
    expect: { route: "descartado", stage: "descartado" },
  },
  {
    id: "farmacia-de-la-esquina",
    note: "nombrar la farmacia de al lado es dar una referencia de direccion, no ser una farmacia: descartar a un dueño con 3 datos dados mata el lead",
    tags: ["descarte", "coloquial"],
    turns: ["DEMO", "es mia, tengo 2 sillones, estoy en santa cruz al lado de la farmacia chavez"],
    said: CALIFICADO,
    expect: { route: "calificado", stage: "esperando_horario" },
  },
  {
    id: "quiero-vender-mas",
    note: "un dentista que dice 'quiero vender mas ortodoncia' esta contando su objetivo de negocio; no es un proveedor que nos quiere vender algo",
    tags: ["descarte", "coloquial"],
    turns: ["DEMO", "quiero vender mas ortodoncia, esto me ayuda?"],
    said: {},
    expect: { route: "off_guion", stage: "esperando_calificacion" },
  },

  // =========================================================================
  // 3. Precio — el bot nunca cotiza, pero tiene que darse cuenta de que le preguntaron
  // =========================================================================
  {
    id: "precio-cuanto-sale",
    note: "'cuanto sale?' a secas es la pregunta de precio mas comun: se contesta con M4 (no cotiza) y se vuelve al embudo",
    tags: ["precio"],
    turns: ["DEMO", "cuanto sale?"],
    said: {},
    expect: { route: "pregunta_precio", stage: "esperando_calificacion" },
  },
  {
    id: "precio-cuanto-seria",
    note: "'cuanto seria' es la misma pregunta de plata que 'cuanto sale'; no reconocerla manda al prospecto a la rama del LLM",
    tags: ["precio", "coloquial"],
    turns: ["DEMO", "y cuanto seria mas o menos?"],
    said: {},
    expect: { route: "pregunta_precio", stage: "esperando_calificacion" },
  },
  {
    id: "precio-cuanto-cobras",
    note: "'cuanto cobras' es pregunta de precio en voseo boliviano, igual que 'cuanto cobran'",
    tags: ["precio", "coloquial"],
    turns: ["DEMO", "cuanto cobras por el sistema?"],
    said: {},
    expect: { route: "pregunta_precio", stage: "esperando_calificacion" },
  },
  {
    id: "precio-muy-caro",
    note: "'debe ser muy caro' es una objecion de precio con todas las letras: es el momento de M4, no de la rama que no entiende",
    tags: ["precio", "coloquial"],
    turns: ["DEMO", "uff eso debe ser muy caro para una clinica chica"],
    said: {},
    expect: { route: "pregunta_precio", stage: "esperando_calificacion" },
  },
  {
    id: "precio-en-bolivianos",
    note: "el prospecto trae un numero visto en el contenido: el bot lo reconoce y lo lleva a la demo, sin confirmarlo ni negarlo (N1)",
    tags: ["precio"],
    turns: ["DEMO", "vi que costaba 750 bs, es eso?"],
    said: {},
    expect: { route: "pregunta_precio", stage: "esperando_calificacion" },
  },
  {
    id: "precio-con-los-tres-datos",
    note: "el prospecto contesta las 3 preguntas Y pregunta el precio en el mismo mensaje: la pregunta se contesta con M4, pero los 3 datos que acaba de dar quedan guardados igual — volver a pedirselos es el error que hace parecer que el bot no lee",
    tags: ["precio", "extraccion", "mezcla"],
    turns: ["hola quiero la demo", "es mia, tengo 2 sillones, estoy en santa cruz. cuanto sale?"],
    said: CALIFICADO,
    expect: { route: "pregunta_precio", stage: "esperando_horario" },
  },

  // =========================================================================
  // 4. SIAT / fiscal — respuesta fija segura, y nunca prometer emision
  // =========================================================================
  {
    id: "siat-al-sin",
    note: "pregunta directa por el SIN: respuesta fija con lo publico (el portal gratis) y de vuelta al embudo",
    tags: ["siat"],
    turns: ["DEMO", "ya emiten al sin ustedes?"],
    said: {},
    expect: { route: "pregunta_siat", stage: "esperando_calificacion" },
  },
  {
    id: "siat-facturan-electronico",
    note: "'facturan electronico' es exactamente la duda fiscal del 30-sep; contestarla con la rama del LLM es justo donde N2 prohibe improvisar",
    tags: ["siat", "coloquial"],
    turns: ["DEMO", "ustedes ya facturan electronico?"],
    said: {},
    expect: { route: "pregunta_siat", stage: "esperando_calificacion" },
  },
  {
    id: "es-deducible-de-impuestos",
    note: "'es deducible' es consejo fiscal (N5): va a un humano, no se contesta con la respuesta generica de facturacion en linea",
    tags: ["siat", "clinico-legal"],
    turns: ["DEMO", "esto es deducible de impuestos?"],
    said: {},
    expect: { route: "handoff", reason: "consulta_clinica_o_legal", stage: "handoff_humano" },
  },

  // =========================================================================
  // 5. Opt-out — la regla que cuida el numero
  // =========================================================================
  {
    id: "opt-out-stop",
    note: "STOP cierra la conversacion en cualquier punto y el bot lo confirma una sola vez (M6)",
    tags: ["opt-out"],
    turns: ["DEMO", "stop"],
    said: {},
    expect: { route: "opt_out", stage: "opt_out" },
  },
  {
    id: "opt-out-dejame-en-paz",
    note: "'dejenme en paz' es la forma enojada de pedir la baja: si no se toma como opt-out, el bot le sigue escribiendo a alguien que ya dijo basta",
    tags: ["opt-out", "coloquial"],
    turns: ["DEMO", "dejenme en paz por favor"],
    said: {},
    expect: { route: "opt_out", stage: "opt_out" },
  },
  {
    id: "opt-out-no-quiero-que-me-sigan",
    note: "'no quiero que me sigan escribiendo' dice lo mismo que 'no me escribas' con otras palabras",
    tags: ["opt-out", "coloquial"],
    turns: ["DEMO", "no quiero que me sigan escribiendo"],
    said: {},
    expect: { route: "opt_out", stage: "opt_out" },
  },
  {
    id: "demanda-baja",
    note: "'la demanda esta baja' habla del negocio del prospecto, no pide la baja de nada: tratarlo como opt-out apaga el bot para siempre en un lead que estaba contestando",
    tags: ["opt-out", "coloquial"],
    turns: ["DEMO", "la demanda esta baja este mes pero tengo 2 sillones"],
    said: { chairs: 2 },
    expect: { route: "repregunta", stage: "esperando_calificacion" },
  },
  {
    id: "no-me-interesa-el-precio",
    note: "'no me interesa el precio, quiero ver como funciona' es interes, no baja: el pedazo 'no me interesa' esta hablando del precio",
    tags: ["opt-out", "precio", "coloquial"],
    turns: ["DEMO", "no me interesa el precio ahora, quiero ver como funciona"],
    said: {},
    expect: { route: "pregunta_precio", stage: "esperando_calificacion" },
  },
  {
    id: "opt-out-y-despues-info",
    note: "quien pidio la baja y despues escribe 'no me mandes mas info' esta REFORZANDO la baja: reabrirle el guion es escribirle a alguien que dijo basta dos veces",
    tags: ["opt-out", "compliance"],
    turns: ["DEMO", "stop", "ya no me mandes mas info"],
    said: {},
    expect: { route: "silencio", stage: "opt_out" },
  },
  {
    id: "opt-out-reabre-con-demo",
    note: "M6 dice 'escribi DEMO y arrancamos de nuevo': esa es la UNICA forma de reabrir",
    tags: ["opt-out"],
    turns: ["DEMO", "stop", "DEMO"],
    said: {},
    expect: { route: "reabierto_por_demo", stage: "esperando_calificacion" },
  },
  {
    id: "opt-out-y-despues-hola",
    note: "un 'hola' despues de la baja no la levanta: el bot se queda callado",
    tags: ["opt-out"],
    turns: ["DEMO", "stop", "hola"],
    said: {},
    expect: { route: "silencio", reason: "opt_out", stage: "opt_out" },
  },

  // =========================================================================
  // 6. Queja, clinico, producto — cuando corresponde molestar a un humano
  // =========================================================================
  {
    id: "queja-estafa",
    note: "desconfianza fuerte: handoff inmediato, sin defenderse (spec §2.3)",
    tags: ["queja"],
    turns: ["DEMO", "esto no es una estafa no?"],
    said: {},
    expect: { route: "handoff", reason: "queja_o_desconfianza", stage: "handoff_humano" },
  },
  {
    id: "sistema-actual-es-una-porqueria",
    note: "la bronca es contra el sistema que usa HOY: es el dolor que buscamos, el lead mas caliente posible. Derivarlo por 'queja' corta la calificacion justo cuando se abrio",
    tags: ["queja", "coloquial"],
    turns: ["DEMO", "el sistema que uso ahora es una porqueria, no sirve para nada"],
    said: {},
    expect: { route: "off_guion", stage: "esperando_calificacion" },
  },
  {
    id: "parece-mentira",
    note: "'parece mentira' aca es asombro, no acusacion: no hay queja que derivar",
    tags: ["queja", "coloquial"],
    turns: ["DEMO", "parece mentira que haga todo eso solo"],
    said: {},
    expect: { route: "off_guion", stage: "esperando_calificacion" },
  },
  {
    id: "endodoncia-con-los-tres-datos",
    note: "el prospecto se presenta contando su especialidad y da los 3 datos: nadie le esta pidiendo al bot una opinion clinica. Derivar aca pierde una calificacion completa",
    tags: ["clinico-legal", "extraccion", "mezcla"],
    turns: ["DEMO", "soy dueña, hago endodoncia, tengo 2 sillones y estoy en sucre"],
    said: { ownsClinic: true, chairs: 2, city: "Sucre" },
    expect: { route: "calificado", stage: "esperando_horario" },
  },
  {
    id: "consulta-clinica-real",
    note: "una duda clinica de verdad (un paciente preguntando por un tratamiento) va a humano sin opinar (N5)",
    tags: ["clinico-legal"],
    turns: ["DEMO", "tengo caries, me pueden atender?"],
    said: {},
    expect: { route: "handoff", reason: "consulta_clinica_o_legal", stage: "handoff_humano" },
  },
  {
    id: "producto-integra-impresora",
    note: "pregunta tecnica de producto: el bot no adivina capacidades, deriva (spec §2.3)",
    tags: ["producto"],
    turns: ["DEMO", "se integra con mi impresora fiscal?"],
    said: {},
    expect: { route: "handoff", reason: "detalle_tecnico_de_producto", stage: "handoff_humano" },
  },
  {
    id: "producto-migrar-datos",
    note: "migrar datos es compromiso tecnico: lo ve un humano",
    tags: ["producto"],
    turns: ["DEMO", "puedo migrar mis datos del excel?"],
    said: {},
    expect: { route: "handoff", reason: "detalle_tecnico_de_producto", stage: "handoff_humano" },
  },
  {
    id: "funciona-en-el-celular",
    note: "'funciona en el celular?' es una pregunta tecnica de producto como cualquier otra: el bot no puede prometer una capacidad (N2), la deriva",
    tags: ["producto", "coloquial"],
    turns: ["DEMO", "funciona en el celular o solo en computadora?"],
    said: {},
    expect: { route: "handoff", reason: "detalle_tecnico_de_producto", stage: "handoff_humano" },
  },
  {
    id: "hablo-con-una-persona",
    note: "pedir hablar con una persona es el pedido de handoff mas claro que existe; el bot no puede contestarlo el mismo (N3)",
    tags: ["handoff", "coloquial"],
    turns: ["DEMO", "hablo con una persona?"],
    said: {},
    expect: { route: "handoff", stage: "handoff_humano" },
  },

  // =========================================================================
  // 7. Horarios — donde se gana o se pierde la demo
  // =========================================================================
  {
    id: "slot-letra-a",
    note: "'A' es la respuesta que el propio M1b pide",
    tags: ["horario"],
    turns: ["DEMO", CALIFICA, "A"],
    said: CALIFICADO,
    expect: { route: "demo_agendada", stage: "demo_agendada" },
  },
  {
    id: "slot-por-el-dia",
    note: "elegir nombrando el horario ofrecido ('viernes 10:00') es lo mas natural del mundo",
    tags: ["horario", "coloquial"],
    turns: ["DEMO", CALIFICA, "el viernes 10:00 me viene bien"],
    said: CALIFICADO,
    expect: { route: "demo_agendada", stage: "demo_agendada" },
  },
  {
    id: "slot-ninguno-me-sirve",
    note: "si ninguno le sirve, lo coordina Sergio: lo dice el propio M1b",
    tags: ["horario"],
    turns: ["DEMO", CALIFICA, "ninguno me sirve"],
    said: CALIFICADO,
    expect: { route: "handoff", reason: "ningun_horario_le_sirve", stage: "handoff_humano" },
  },
  {
    id: "propone-la-una",
    note: "'puedo a la 1' es el prospecto proponiendo SU horario, no eligiendo uno de los dos: agendarle las 15:00 y decirle 'listo, agendado' es mandarlo a una reunion a la que no dijo que iba",
    tags: ["horario", "coloquial"],
    turns: ["DEMO", CALIFICA, "puedo el jueves a la 1 de la tarde"],
    said: CALIFICADO,
    expect: { route: "handoff", stage: "handoff_humano" },
  },
  {
    id: "el-primero-de-agosto-viajo",
    note: "'el primero de agosto viajo, coordinamos a la vuelta' es un NO a los dos horarios; leerlo como 'la primera opcion' agenda una demo que el prospecto nunca acepto",
    tags: ["horario", "coloquial"],
    turns: ["DEMO", CALIFICA, "el primero de agosto viajo, coordinamos a la vuelta"],
    said: CALIFICADO,
    expect: { route: "handoff", stage: "handoff_humano" },
  },
  {
    id: "el-jueves-no-el-viernes-si",
    note: "'el jueves no puedo, el viernes si' esta eligiendo el viernes: es una demo agendada, no una derivacion",
    tags: ["horario", "coloquial"],
    turns: ["DEMO", CALIFICA, "el jueves no puedo, el viernes si"],
    said: CALIFICADO,
    expect: { route: "demo_agendada", stage: "demo_agendada" },
  },

  // =========================================================================
  // 8. Despues de agendar
  // =========================================================================
  {
    id: "dolor-la-agenda",
    note: "contesta lo que M2 pregunta: se guarda el dolor y se acusa recibo, sin molestar a nadie",
    tags: ["post-agenda"],
    turns: ["DEMO", CALIFICA, "A", "lo que me mata es la agenda"],
    said: CALIFICADO,
    expect: { route: "dolor", reason: "agenda", stage: "demo_agendada" },
  },
  {
    id: "cortesia-gracias",
    note: "'gracias' no es una consulta: no se molesta a un humano por cortesia",
    tags: ["post-agenda"],
    turns: ["DEMO", CALIFICA, "A", "gracias"],
    said: CALIFICADO,
    expect: { route: "cortesia_sin_respuesta", stage: "demo_agendada" },
  },
  {
    id: "cortesia-ya",
    note: "'ya' es el acuse de recibo boliviano por excelencia; equivale a 'dale' y no necesita respuesta ni humano",
    tags: ["post-agenda", "coloquial"],
    turns: ["DEMO", CALIFICA, "A", "ya"],
    said: CALIFICADO,
    expect: { route: "cortesia_sin_respuesta", stage: "demo_agendada" },
  },
  {
    id: "cortesia-nos-vemos",
    note: "'perfecto, nos vemos el jueves' es despedirse: la demo ya esta agendada y no hay nada que derivar",
    tags: ["post-agenda", "coloquial"],
    turns: ["DEMO", CALIFICA, "A", "perfecto, nos vemos el jueves entonces"],
    said: CALIFICADO,
    expect: { route: "cortesia_sin_respuesta", stage: "demo_agendada" },
  },

  // =========================================================================
  // 9. Audio, adjuntos y silencios
  // =========================================================================
  {
    id: "audio-sin-transcripcion",
    note: "si el audio no se pudo transcribir, se pide por escrito; no se adivina lo que dijo",
    tags: ["audio"],
    turns: ["DEMO", { kind: "voice", transcript: "" }],
    said: {},
    expect: { route: "audio_sin_transcripcion", stage: "esperando_calificacion" },
  },
  {
    id: "audio-transcrito-con-muletillas",
    note: "un audio real llega con muletillas y correcciones; los 3 datos estan dichos igual",
    tags: ["audio", "coloquial"],
    turns: [
      "DEMO",
      { kind: "voice", transcript: "eeeh o sea la clinica es mia, tengo dos sillones, aca en santa cruz" },
    ],
    said: CALIFICADO,
    expect: { route: "calificado", stage: "esperando_horario" },
  },
  {
    id: "adjunto-sin-texto",
    note: "el bot no lee archivos: lo reconoce y lo pasa a un humano",
    tags: ["adjunto"],
    turns: ["DEMO", { kind: "attachment", text: "" }],
    said: {},
    expect: { route: "handoff", reason: "archivo_adjunto", stage: "handoff_humano" },
  },
  {
    id: "humano-a-cargo",
    note: "si Sergio ya contesto en esta conversacion, el bot no vuelve a hablar nunca (D7 / §3.2)",
    tags: ["silencio", "compliance"],
    state: { botStage: "esperando_calificacion", humanTookOver: true },
    turns: ["hola, sigo interesado"],
    said: {},
    expect: { route: "silencio", reason: "humano_a_cargo", stage: "esperando_calificacion" },
  },

  // =========================================================================
  // 10. Fuera de guion
  // =========================================================================
  {
    id: "ya-tengo-sistema",
    note: "objecion clasica sin rama propia: el bot reformula la pregunta pendiente en vez de improvisar una comparacion de productos",
    tags: ["off-guion"],
    turns: ["DEMO", "ya tengo un sistema"],
    said: {},
    expect: { route: "off_guion", stage: "esperando_calificacion" },
  },
  {
    id: "dos-malentendidos",
    note: "dos fallos de comprension seguidos = el bot ya no aporta, va a humano (spec §2.3)",
    tags: ["off-guion"],
    turns: ["DEMO", "xq", "mmm"],
    said: {},
    expect: { route: "handoff", reason: "dos_malentendidos", stage: "handoff_humano" },
  },
]);
