// ONIA — Chatbot propio: LOS CASOS DEL BANCO.
//
// Escritos como escribe por WhatsApp un dueño de negocio boliviano — de CUALQUIER rubro, que es
// lo que el bot atiende ahora: ferretería, restaurante, peluquería, consultorio, clínica dental.
// En minúscula, sin tildes, con typos, con audios transcritos a medias, con tres datos en un
// mismo mensaje, con "cuanto sale?" a secas, con "ya" como única respuesta.
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
// spec y segun el negocio, no por que el bot la da. Si la nota tuviera que decir "porque el regex
// hace X", el caso esta midiendo el codigo en vez del negocio y no va.
//
// Los 3 datos que califican son universales: RUBRO · TAMAÑO DEL EQUIPO · CIUDAD. Los sillones
// son un dato de RAMA: se piden solo a odontología y no bloquean nada.
//
// ORDEN DEL EMBUDO (2026-08-06): valor + horarios -> reserva -> 3 preguntas. Los datos ya NO son
// un peaje para llegar a la oferta: si el prospecto los cuenta antes, se guardan (y M2 no se los
// vuelve a pedir); si no, se piden con la demo ya reservada. Por eso muchos casos que antes
// esperaban `calificado` ahora esperan `repregunta` (el bot acusa el dato y vuelve a ofrecer el
// horario) o `demo_agendada`: lo que se mide es lo mismo — que el dato se guarde bien y que no se
// pregunte dos veces —, cambio el punto del embudo donde pasa.
//
// El banco NO esta escrito para aprobar: casi todos los casos son mensajes que un vendedor
// humano contestaria sin pensar. Un banco que da 100% no encontro nada.
//
// Estado al reordenar el embudo (2026-08-06): 62/62. Ese numero NO significa que el bot este
// terminado — significa que estos 62 mensajes ya los entiende. Ocho de los casos originales se
// escribieron ANTES de saber que contestaba el bot y fallaron: el que confundia soporte con la
// bronca contra el sistema de otro, "hablo con una persona?" contado como un equipo de una
// persona, "no me anda internet" mandado a soporte, "somos 25 obreros" sin tamaño, "tengo 3
// tiendas" sin rubro y "es gratis?" fuera de la rama de precio. Los dos ultimos nacieron con el
// orden nuevo: el "2" que es la opcion B y no un equipo de 2, y el "otro" que M0 promete. Cada
// uno se arreglo en el bot, nunca aflojando el caso. El proximo que toque esto: agregar mensajes
// que HOY fallen, no mas mensajes que ya pasan.

/** Mensaje que entrega los 3 datos de calificacion de una sola vez, bien escrito. */
const CALIFICA = "tengo una ferreteria, somos 5 y estoy en santa cruz";
const CALIFICADO = Object.freeze({ industry: "comercio", teamSize: 5, city: "Santa Cruz" });

export const BENCH_CASES = Object.freeze([
  // =========================================================================
  // 1. Arranque y calificacion por rubro — el piso que el bot tiene que sostener
  // =========================================================================
  {
    id: "hola-suelto",
    note: "todo el que escribe a este numero viene del CTA de Lucia: un 'hola' pelado abre el guion igual (spec §2.3). La bienvenida ya trae los 2 horarios y no cobra una sola pregunta. Y no puede nombrar un rubro: el producto es Onia, la plataforma — hablarle de sillones a un ferretero antes de saber a que se dedica es venderle el modulo de otro",
    tags: ["arranque", "naming"],
    turns: ["hola"],
    said: {},
    expect: { route: "bienvenida", stage: "esperando_horario", replyMustNot: [/dental/i, /sillon/i, /clinica/i] },
  },
  {
    id: "ferreteria-tres-datos-primer-mensaje",
    note: "una ferreteria es hoy un cliente tan bueno como una clinica: con los 3 datos en el primer mensaje se presenta como bot, GUARDA los tres y ofrece los horarios. Los datos ya no abren ni cierran nada — se guardan para no volver a pedirlos en M2",
    tags: ["arranque", "calificacion", "comercio"],
    turns: ["hola quiero la demo, tengo una ferreteria, somos 5 y estoy en santa cruz"],
    said: CALIFICADO,
    expect: { route: "bienvenida", stage: "esperando_horario" },
  },
  {
    id: "restaurante-tres-datos",
    note: "contesta contando su negocio en vez de elegir horario: se le acusa recibo (asi no lo repite) y se le vuelven a poner los dos horarios. Sin una sola pregunta de sillones — preguntarle a un restaurante por sillones dentales lo manda a otro proveedor",
    tags: ["calificacion", "gastronomia"],
    turns: ["DEMO", "tengo un restaurante, somos 12 personas, en cochabamba"],
    said: { industry: "gastronomia", teamSize: 12, city: "Cochabamba" },
    expect: { route: "repregunta", stage: "esperando_horario", replyMustNot: [/sillon/i] },
  },
  {
    id: "dental-contesta-la-rama",
    note: "odontologia es el UNICO rubro con dato extra: con la demo YA reservada y los 3 universales contestados se pregunta por los sillones, y con esa respuesta se cierra la captura",
    tags: ["calificacion", "dental", "rama"],
    turns: ["DEMO", "A", "soy dentista, somos 4 en la clinica, en cochabamba", "3"],
    said: { industry: "dental", teamSize: 4, city: "Cochabamba", chairs: 3 },
    expect: { route: "calificado", stage: "demo_agendada" },
  },
  {
    id: "dental-con-sillones-de-una",
    note: "si el dentista ya dijo los sillones en el mismo mensaje, volver a preguntarselos es el error que hace parecer que el bot no lee: se cierra la captura sin la pregunta de rama",
    tags: ["calificacion", "dental", "rama"],
    turns: ["DEMO", "A", "soy dentista, tengo 2 sillones, somos 3, en sucre"],
    said: { industry: "dental", teamSize: 3, city: "Sucre", chairs: 2 },
    expect: { route: "calificado", stage: "demo_agendada" },
  },
  {
    id: "dental-no-contesta-la-rama-igual-agenda",
    note: "el dato de rama es un lujo, no un requisito: si el dentista no sabe cuantos sillones tiene, no se insiste y la demo sigue reservada. Cambiar una demo por un campo del CRM es un mal negocio",
    tags: ["calificacion", "dental", "rama"],
    turns: ["DEMO", "A", "soy dentista, somos 4 en la clinica, en cochabamba", "ni idea de eso, lo que me mata son los cobros"],
    said: { industry: "dental", teamSize: 4, city: "Cochabamba" },
    expect: { route: "dolor", reason: "cobros", stage: "demo_agendada" },
  },
  {
    id: "rubro-sin-tamano",
    note: "contesto con su negocio en vez de elegir horario: se le acusa lo que dijo y se le vuelve a pedir el horario, que es lo unico pendiente antes de reservar. Lo que falte se pide DESPUES, en M2",
    tags: ["calificacion", "comercio"],
    turns: ["DEMO", "tengo una libreria en sucre"],
    said: { industry: "comercio", city: "Sucre" },
    expect: { route: "repregunta", stage: "esperando_horario" },
  },
  {
    id: "tamano-sin-rubro",
    note: "el caso inverso: dio el tamaño y la ciudad pero no a que se dedica. Los dos datos se guardan igual (M2 despues solo pedira el que falta) y el bot vuelve a lo unico que bloquea: el horario",
    tags: ["calificacion"],
    turns: ["DEMO", "somos 6, en la paz"],
    said: { teamSize: 6, city: "La Paz" },
    expect: { route: "repregunta", stage: "esperando_horario" },
  },
  {
    id: "numero-pelado-es-el-equipo",
    note: "con la demo ya reservada el bot pregunto cuanta gente trabaja ahi y el prospecto contesta '4': es la respuesta a lo que se le pregunto, no un dato suelto",
    tags: ["calificacion", "coloquial"],
    turns: ["DEMO", "A", "tengo una libreria en sucre", "4"],
    said: { industry: "comercio", teamSize: 4, city: "Sucre" },
    expect: { route: "calificado", stage: "demo_agendada" },
  },
  {
    id: "obreros-tambien-son-personas",
    note: "una constructora contesta 'somos 25 obreros', no '25 personas': si el bot solo entiende la palabra del formulario, le re-pregunta el tamaño a alguien que ya lo dijo",
    tags: ["calificacion", "servicios", "coloquial"],
    turns: ["DEMO", "hola somos constructora, 25 obreros, santa cruz"],
    said: { industry: "servicios", teamSize: 25, city: "Santa Cruz" },
    expect: { route: "repregunta", stage: "esperando_horario" },
  },
  {
    id: "tres-tiendas-es-un-comercio",
    note: "'tengo 3 tiendas, somos 9 en total' es el mejor prospecto de la lista (varios locales que coordinar): no reconocerle el rubro por estar en plural lo manda de vuelta a la primera pregunta",
    tags: ["calificacion", "comercio", "coloquial"],
    turns: ["DEMO", "tengo 3 tiendas, somos 9 en total, en cochabamba"],
    said: { industry: "comercio", teamSize: 9, city: "Cochabamba" },
    expect: { route: "repregunta", stage: "esperando_horario" },
  },
  {
    id: "rubro-que-no-tenemos-mapeado",
    note: "'me dedico a fumigar' es una respuesta valida aunque no tengamos un modulo con ese nombre: el prospecto contesto y volver a preguntarle lo mismo lo pierde. Se agenda igual y el rubro fino lo ve Sergio en la demo",
    tags: ["calificacion", "coloquial"],
    turns: ["DEMO", "me dedico a fumigar oficinas, somos 3, en montero"],
    said: { industry: "otro", teamSize: 3, city: "Montero" },
    expect: { route: "repregunta", stage: "esperando_horario" },
  },

  // =========================================================================
  // 2. Extraccion — lo que se guarda es lo que Sergio ve en el panel
  // =========================================================================
  {
    id: "ciudad-en-reunion",
    note: "'estoy en reunion' es la excusa mas comun de WhatsApp: NO dice una ciudad. Guardar 'Reunion' como ciudad ensucia el CRM y el bot lo repite en voz alta. Con los dos horarios ya sobre la mesa, el 'te escribo mas tarde' es ademas un 'ninguno me sirve': eso lo coordina un humano",
    tags: ["extraccion", "coloquial"],
    turns: ["DEMO", "estoy en reunion, te escribo mas tarde"],
    said: {},
    expect: { route: "handoff", reason: "ningun_horario_le_sirve", stage: "handoff_humano" },
  },
  {
    id: "estoy-en-la-tienda-no-declara-rubro",
    note: "'estoy en la tienda' dice donde esta parado, no a que se dedica. Anotarle rubro comercio por esa frase es inventar el dato con el que despues se califica (viola §2.1)",
    tags: ["extraccion", "regla-de-oro", "coloquial"],
    turns: ["DEMO", "estoy en la tienda ahora, te escribo en un rato"],
    said: {},
    expect: { route: "off_guion", stage: "esperando_horario" },
  },
  {
    id: "verbo-suelto-no-declara-rubro",
    note: "dos cosas en un mensaje: 'cocha' SI es Cochabamba (la lista existe para normalizar el nombre que va al CRM) y 'una persona nomas' SI es el tamaño del equipo. Lo que NO se toma es el rubro: de 'hago tortas' se puede sacar cualquier cosa, y un rubro inventado queda para siempre en el CRM mientras que una re-pregunta cuesta un mensaje",
    tags: ["extraccion", "regla-de-oro", "coloquial"],
    turns: ["DEMO", "hago tortas por encargo, una persona nomas, en cocha"],
    said: { teamSize: 1, city: "Cochabamba" },
    expect: { route: "repregunta", stage: "esperando_horario" },
  },
  {
    id: "un-consultorio-no-es-un-sillon",
    note: "'tengo un consultorio' habla del local, NO de tener un sillon: contarlo como 1 sillon inventa el dato de rama. Y tampoco convierte a un dentista en otro rubro",
    tags: ["extraccion", "regla-de-oro", "dental"],
    turns: ["DEMO", "soy dentista, somos 3, en la paz", "tengo un consultorio nuevo, recien abierto"],
    said: { industry: "dental", teamSize: 3, city: "La Paz" },
    expect: { route: "off_guion", stage: "esperando_horario" },
  },
  {
    id: "corrige-el-tamano",
    note: "el prospecto se corrige en el mensaje siguiente: vale lo ultimo que dijo, no lo primero que el bot creyo entender. Guardar 5 cuando ya dijo que son 8 manda a Sergio a la demo con el negocio equivocado en la cabeza",
    tags: ["extraccion", "correccion", "comercio"],
    turns: ["DEMO", "tengo una ferreteria, somos 5", "en realidad somos 8, y estoy en la paz"],
    said: { industry: "comercio", teamSize: 8, city: "La Paz" },
    expect: { route: "repregunta", stage: "esperando_horario" },
  },
  {
    id: "negocio-grande-no-se-descarta",
    note: "un negocio de 40 personas es un cliente MEJOR, no uno peor: con la plataforma por modulos ya no hay techo de tamaño que descarte",
    tags: ["calificacion", "comercio"],
    turns: ["DEMO", "tenemos una distribuidora, somos 40 empleados, en santa cruz"],
    said: { industry: "comercio", teamSize: 40, city: "Santa Cruz" },
    expect: { route: "repregunta", stage: "esperando_horario" },
  },

  // =========================================================================
  // 3. Descarte — solo lo que claramente NO es un negocio
  // =========================================================================
  {
    id: "busca-trabajo",
    note: "quien manda su CV no es un prospecto de un sistema de gestion: es el unico tipo de descarte que queda, junto con el spam",
    tags: ["descarte"],
    turns: ["DEMO", "hola, busco trabajo, les mando mi cv?"],
    said: {},
    expect: { route: "descartado", stage: "descartado" },
  },
  {
    id: "nos-quiere-vender",
    note: "el que nos quiere vender A NOSOTROS no viene por una demo: descarte. Ojo que el que VENDE (una distribuidora, una ferreteria) si es cliente — lo que descarta es querer venderNOS",
    tags: ["descarte", "spam"],
    turns: ["DEMO", "hola, quiero venderles publicidad para su empresa"],
    said: {},
    expect: { route: "descartado", stage: "descartado" },
  },
  // =========================================================================
  // 4. Precio — el bot nunca cotiza, pero tiene que darse cuenta de que le preguntaron
  // =========================================================================
  {
    id: "precio-cuanto-sale",
    note: "'cuanto sale?' a secas es la pregunta de precio mas comun: se contesta con M4 (no cotiza) y se vuelve al embudo",
    tags: ["precio"],
    turns: ["DEMO", "cuanto sale?"],
    said: {},
    expect: { route: "pregunta_precio", stage: "esperando_horario" },
  },
  {
    id: "precio-muy-caro",
    note: "'debe ser muy caro' es una objecion de precio con todas las letras: es el momento de M4, no de la rama que no entiende",
    tags: ["precio", "coloquial"],
    turns: ["DEMO", "uff eso debe ser muy caro para un negocio chico"],
    said: {},
    expect: { route: "pregunta_precio", stage: "esperando_horario" },
  },
  {
    id: "precio-justo-antes-de-la-rama",
    note: "con la demo ya reservada, el dentista completa los 3 datos y pregunta el precio en el mismo mensaje: se le contesta M4 y se sigue por donde iba, que es la pregunta de rama — la respuesta de precio no puede tragarse el dato con el que Sergio prepara una demo dental",
    tags: ["precio", "dental", "rama", "mezcla"],
    turns: ["DEMO", "A", "soy dentista, somos 4, en sucre. cuanto sale?"],
    said: { industry: "dental", teamSize: 4, city: "Sucre" },
    expect: { route: "pregunta_precio", stage: "demo_agendada", replyMust: [/sillones/i] },
  },
  {
    id: "precio-es-gratis",
    note: "'es gratis?' es la pregunta de plata de quien todavia no sabe si esto se paga: sale por M4 igual que 'cuanto sale', no por la rama que no entiende",
    tags: ["precio", "coloquial"],
    turns: ["DEMO", "es gratis?"],
    said: {},
    expect: { route: "pregunta_precio", stage: "esperando_horario" },
  },
  {
    id: "precio-con-los-tres-datos",
    note: "el prospecto contesta las 3 preguntas Y pregunta el precio en el mismo mensaje: la pregunta se contesta con M4, pero los 3 datos que acaba de dar quedan guardados igual — volver a pedirselos es el error que hace parecer que el bot no lee",
    tags: ["precio", "extraccion", "mezcla"],
    turns: ["hola quiero la demo", "tengo una ferreteria, somos 5, estoy en santa cruz. cuanto sale?"],
    said: CALIFICADO,
    expect: { route: "pregunta_precio", stage: "esperando_horario" },
  },
  {
    id: "precio-no-nombra-sillones",
    note: "la respuesta de precio se la lee un ferretero: si le habla de sillones queda claro que el guion es de otro producto. M4 tiene que hablar de equipo y modulos",
    tags: ["precio", "comercio", "naming"],
    turns: ["DEMO", "tengo una ferreteria, somos 5, en santa cruz", "cuanto cuesta al mes?"],
    said: CALIFICADO,
    expect: { route: "pregunta_precio", stage: "esperando_horario", replyMustNot: [/sillon/i, /\d+\s*(bs|bolivianos)/i] },
  },

  // =========================================================================
  // 5. SIAT / fiscal — respuesta fija segura, y nunca prometer emision
  // =========================================================================
  {
    id: "siat-al-sin",
    note: "pregunta directa por el SIN: respuesta fija con lo publico (el portal gratis) y de vuelta al embudo",
    tags: ["siat"],
    turns: ["DEMO", "ya emiten al sin ustedes?"],
    said: {},
    expect: { route: "pregunta_siat", stage: "esperando_horario" },
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
  // 6. Opt-out — la regla que cuida el numero
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
    id: "opt-out-gracias-pero-no",
    note: "'gracias pero no me interesa' es una baja educada, la mas comun de todas: si el bot la lee como cortesia le sigue escribiendo a alguien que ya dijo que no",
    tags: ["opt-out", "coloquial"],
    turns: ["DEMO", "gracias pero no me interesa"],
    said: {},
    expect: { route: "opt_out", stage: "opt_out" },
  },
  {
    id: "demanda-baja",
    note: "'la demanda esta baja' habla del negocio del prospecto, no pide la baja de nada: tratarlo como opt-out apaga el bot para siempre en un lead que estaba contestando",
    tags: ["opt-out", "coloquial"],
    turns: ["DEMO", "la demanda esta baja este mes pero somos 4"],
    said: { teamSize: 4 },
    expect: { route: "repregunta", stage: "esperando_horario" },
  },
  {
    id: "no-me-interesa-el-precio",
    note: "'no me interesa el precio, quiero ver como funciona' es interes, no baja: el pedazo 'no me interesa' esta hablando del precio",
    tags: ["opt-out", "precio", "coloquial"],
    turns: ["DEMO", "no me interesa el precio ahora, quiero ver como funciona"],
    said: {},
    expect: { route: "pregunta_precio", stage: "esperando_horario" },
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
    expect: { route: "reabierto_por_demo", stage: "esperando_horario" },
  },

  // =========================================================================
  // 7. SEGUNDO CAMINO: soporte — nunca venderle a quien ya compro
  // =========================================================================
  {
    id: "soporte-ya-soy-cliente",
    note: "quien dice que ya es cliente y que algo no le anda pide AYUDA: ofrecerle la demo comercial es el peor error posible del bot. Va a un humano, no al embudo",
    tags: ["soporte"],
    turns: ["DEMO", "ya soy cliente y el sistema no me anda"],
    said: {},
    // La prueba de que NO le vendio: no aparece un solo horario de demo en la respuesta.
    expect: { route: "handoff", reason: "soporte_cliente", stage: "handoff_humano", replyMustNot: [/jueves 15:00|viernes 10:00/i] },
  },
  {
    id: "soporte-no-puedo-entrar",
    note: "'no puedo entrar' solo lo dice quien YA tiene cuenta: aunque no diga 'soy cliente', el camino correcto es soporte",
    tags: ["soporte", "coloquial"],
    turns: ["DEMO", "no puedo entrar al panel, me sale error"],
    said: {},
    expect: { route: "handoff", reason: "soporte_cliente", stage: "handoff_humano" },
  },
  {
    id: "soporte-como-configuro",
    note: "'como configuro' es una pregunta de uso, no de compra: quien la hace ya tiene el sistema instalado",
    tags: ["soporte"],
    turns: ["DEMO", "ya tengo el sistema de ustedes, como configuro los recordatorios?"],
    said: {},
    expect: { route: "handoff", reason: "soporte_cliente", stage: "handoff_humano" },
  },
  {
    id: "soporte-le-gana-a-la-respuesta-fiscal",
    note: "un cliente con un problema de facturacion trae la palabra 'factura': contestarle la respuesta comercial del SIAT es responderle a otra persona. Soporte manda",
    tags: ["soporte", "siat"],
    turns: ["DEMO", "ya soy cliente y no me sale la factura del mes"],
    said: {},
    expect: { route: "handoff", reason: "soporte_cliente", stage: "handoff_humano" },
  },
  {
    id: "no-me-anda-internet-no-es-soporte",
    note: "'no me anda internet' es una excusa de WhatsApp, no un ticket: leerlo como soporte saca del embudo a un prospecto nuevo y le avisa a Sergio de un problema que no existe",
    tags: ["soporte", "coloquial"],
    turns: ["DEMO", "no me anda internet, te escribo luego"],
    said: {},
    expect: { route: "off_guion", stage: "esperando_horario" },
  },
  {
    id: "ya-tengo-un-sistema-es-objecion",
    note: "'ya tengo UN sistema' es la objecion clasica del que usa OTRA cosa: ese sigue siendo un prospecto de venta y el bot vuelve al embudo. Mandarlo a soporte lo saca del funnel por una palabra",
    tags: ["soporte", "off-guion"],
    turns: ["DEMO", "ya tengo un sistema"],
    said: {},
    expect: { route: "off_guion", stage: "esperando_horario" },
  },
  {
    id: "bronca-con-su-sistema-actual",
    note: "la bronca es contra el sistema que usa HOY: es el dolor que buscamos, el lead mas caliente posible. Ni queja contra nosotros ni soporte nuestro",
    tags: ["soporte", "queja", "coloquial"],
    turns: ["DEMO", "el sistema que uso ahora es una porqueria, no sirve para nada"],
    said: {},
    expect: { route: "off_guion", stage: "esperando_horario" },
  },
  {
    id: "ya-somos-clientes-otra-sucursal",
    note: "un cliente que quiere agregar una sucursal habla en plural ('ya somos clientes') y viene a AMPLIAR, no a que le vendan de cero: hacerle las 3 preguntas de calificacion es tratarlo como un desconocido",
    tags: ["soporte"],
    turns: ["DEMO", "ya somos clientes de ustedes y queremos abrir otra sucursal"],
    said: {},
    expect: { route: "handoff", reason: "soporte_cliente", stage: "handoff_humano" },
  },
  {
    id: "dan-soporte-es-pregunta-de-producto",
    note: "'¿dan soporte?' la hace alguien que TODAVIA no compro: es una pregunta de capacidad del producto y el bot no promete (N2), la deriva — pero no es el camino de soporte",
    tags: ["soporte", "producto"],
    turns: ["DEMO", "dan soporte tecnico si algo falla?"],
    said: {},
    expect: { route: "handoff", reason: "detalle_tecnico_de_producto", stage: "handoff_humano" },
  },

  // =========================================================================
  // 8. Queja, clinico, producto — cuando corresponde molestar a un humano
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
    id: "consulta-clinica-real",
    note: "una duda clinica de verdad (un paciente preguntando por un tratamiento) va a humano sin opinar (N5)",
    tags: ["clinico-legal"],
    turns: ["DEMO", "tengo caries, me pueden atender?"],
    said: {},
    expect: { route: "handoff", reason: "consulta_clinica_o_legal", stage: "handoff_humano" },
  },
  {
    id: "dentista-que-cuenta-lo-que-hace",
    note: "el prospecto se presenta contando su especialidad y da los 3 datos: nadie le esta pidiendo al bot una opinion clinica. Derivar aca pierde una calificacion completa — y con la demo ya reservada, lo que corresponde es la pregunta de rama",
    tags: ["clinico-legal", "extraccion", "dental", "mezcla"],
    turns: ["DEMO", "A", "soy dueña de un consultorio dental, hago endodoncia, somos 3 y estoy en sucre"],
    said: { industry: "dental", teamSize: 3, city: "Sucre" },
    expect: { route: "rama_rubro", reason: "dental", stage: "demo_agendada" },
  },
  {
    id: "estudio-de-abogados-es-prospecto",
    note: "un estudio juridico es un negocio como cualquier otro y hoy es PUBLICO objetivo: leer 'abogados' como una consulta legal y derivarlo tira un lead que se estaba presentando",
    tags: ["clinico-legal", "servicios"],
    turns: ["DEMO", "somos 4 abogados, tenemos un estudio en la paz"],
    said: { industry: "servicios", teamSize: 4, city: "La Paz" },
    expect: { route: "repregunta", stage: "esperando_horario" },
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
  // 9. Horarios — donde se gana o se pierde la demo
  // =========================================================================
  {
    id: "slot-letra-a",
    note: "'A' es la respuesta que el propio M0 pide, en el primer mensaje",
    tags: ["horario"],
    turns: ["DEMO", CALIFICA, "A"],
    said: CALIFICADO,
    expect: { route: "demo_agendada", stage: "demo_agendada" },
  },
  {
    id: "slot-numero-2-es-la-opcion-b",
    note: "un '2' pelado contestando la oferta es la OPCION B, no un equipo de 2 personas. Con los horarios en el primer mensaje esta respuesta llega antes de que el bot haya preguntado nada, asi que leerla como dato inventa el numero con el que despues le habla al prospecto (viola §2.1)",
    tags: ["horario", "regla-de-oro", "coloquial"],
    turns: ["DEMO", "2"],
    said: {},
    expect: { route: "demo_agendada", stage: "demo_agendada" },
  },
  {
    id: "slot-otro-lo-coordina-un-humano",
    note: "M0 promete con todas las letras: 'escribime otro y lo coordinamos'. Si el bot no entiende su propia promesa, la respuesta a la unica pregunta que hace el primer mensaje termina en la rama que no entiende",
    tags: ["horario", "coloquial"],
    turns: ["DEMO", "otro"],
    said: {},
    expect: { route: "handoff", reason: "ningun_horario_le_sirve", stage: "handoff_humano" },
  },
  {
    id: "slot-ninguno-me-sirve",
    note: "si ninguno le sirve, lo coordina Sergio: lo dice el propio M0",
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
    id: "el-jueves-no-el-viernes-si",
    note: "'el jueves no puedo, el viernes si' esta eligiendo el viernes: es una demo agendada, no una derivacion",
    tags: ["horario", "coloquial"],
    turns: ["DEMO", CALIFICA, "el jueves no puedo, el viernes si"],
    said: CALIFICADO,
    expect: { route: "demo_agendada", stage: "demo_agendada" },
  },

  // =========================================================================
  // 10. Despues de agendar
  // =========================================================================
  {
    id: "dolor-los-clientes-que-no-vuelven",
    note: "contesta lo que M2 pregunta: se guarda el dolor y se acusa recibo, sin molestar a nadie. El dolor se llama 'clientes' para todos — un ferretero no tiene pacientes",
    tags: ["post-agenda", "comercio"],
    turns: ["DEMO", CALIFICA, "A", "los clientes que no vuelven"],
    said: CALIFICADO,
    expect: { route: "dolor", reason: "clientes", stage: "demo_agendada" },
  },
  {
    id: "cortesia-gracias",
    note: "'gracias' no es una consulta: no se molesta a un humano por cortesia",
    tags: ["post-agenda"],
    turns: ["DEMO", CALIFICA, "A", "gracias"],
    said: CALIFICADO,
    expect: { route: "cortesia_sin_respuesta", stage: "demo_agendada" },
  },
  // =========================================================================
  // 11. Audio, adjuntos y silencios
  // =========================================================================
  {
    id: "audio-sin-transcripcion",
    note: "si el audio no se pudo transcribir, se pide por escrito; no se adivina lo que dijo",
    tags: ["audio"],
    turns: ["DEMO", { kind: "voice", transcript: "" }],
    said: {},
    expect: { route: "audio_sin_transcripcion", stage: "esperando_horario" },
  },
  {
    id: "audio-transcrito-con-muletillas",
    note: "un audio real llega con muletillas y correcciones; los 3 datos estan dichos igual",
    tags: ["audio", "gastronomia", "coloquial"],
    turns: [
      "DEMO",
      { kind: "voice", transcript: "eeeh o sea tengo una pizzeria, somos seis personas, aca en santa cruz" },
    ],
    said: { industry: "gastronomia", teamSize: 6, city: "Santa Cruz" },
    expect: { route: "repregunta", stage: "esperando_horario" },
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
    state: { botStage: "esperando_horario", humanTookOver: true },
    turns: ["hola, sigo interesado"],
    said: {},
    expect: { route: "silencio", reason: "humano_a_cargo", stage: "esperando_horario" },
  },

  // =========================================================================
  // 12. Fuera de guion
  // =========================================================================
  {
    id: "dos-malentendidos",
    note: "dos fallos de comprension seguidos = el bot ya no aporta, va a humano (spec §2.3)",
    tags: ["off-guion"],
    turns: ["DEMO", "xq", "mmm"],
    said: {},
    expect: { route: "handoff", reason: "dos_malentendidos", stage: "handoff_humano" },
  },
  {
    id: "el-guion-no-nombra-un-producto-dental",
    note: "el producto es Onia, la plataforma: si la bienvenida dice 'Onia Dental' a un ferretero, el bot esta vendiendo el modulo de otro rubro antes de saber a que se dedica",
    tags: ["naming"],
    turns: ["hola"],
    said: {},
    expect: { route: "bienvenida", stage: "esperando_horario", replyMustNot: [/dental/i, /sillon/i, /clinica/i] },
  },
]);
