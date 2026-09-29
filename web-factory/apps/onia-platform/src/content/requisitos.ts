/**
 * Requisitos que el cliente tiene que ver ANTES de mandar el pedido.
 *
 * Van visibles en la página (no en un modal que se salta), con una casilla que
 * el cliente marca, y el texto que se manda por WhatsApp lleva la aceptación
 * adentro: así queda constancia de que lo vio.
 *
 * Fuentes (nada inventado):
 *  - Chatbot: documentación oficial de Meta — números de teléfono de negocio
 *    (un número activo en WhatsApp o WhatsApp Business NO se puede registrar;
 *    el código llega por SMS o llamada), migración de un número existente (se
 *    pierde el historial de forma permanente), plantillas (revisión de hasta
 *    24 h) y pricing (la ventana de servicio de 24 h que abre el cliente **no
 *    se cobra hasta el 30-sep-2026**; fuera de ella se cobra por plantilla
 *    entregada). ⚠️ Esa gratuidad tiene fecha de vencimiento anunciada por
 *    Meta y por eso NO se escribe a mano: se deriva de `META_VENTANA_24H`
 *    (`@/content/chatbot-precios`), que es la única fuente de las dos fechas.
 *    Lo vigila `(sitio)/condicion-de-tercero.test.ts`.
 *  - ⚠️ 2026-08-21: se sacaron de acá el cupo de 200 mensajes salientes y el
 *    markup del 20% sobre Meta. El markup se cae por decisión de Sergio (el
 *    cliente le paga a Meta DIRECTO, en su propia cuenta), y el cupo no se
 *    promete porque no está verificado que exista el contador que lo corte.
 *  - Web: lo que el generador exige de verdad (web-factory/data/schema.ts —
 *    servicios con título y descripción obligatorios; productos con nombre,
 *    categoría, precio y descripción obligatorios; data/intake-schema.ts →
 *    getMissingClientInputs marca canal de conversión y dominio/hosting) y las
 *    reglas comerciales escritas (ONIA_VENDOR_MANUAL_2026.md: 50/50, prohibido
 *    prometer posicionamiento en Google; catálogo de precios §6: dominio,
 *    hosting, pasarela, pauta y fotos los paga el cliente).
 *
 * NO se publica acá ninguna tarifa por mensaje de Meta: el CSV oficial no se
 * pudo verificar y el número que hay en el código está mal calculado.
 */

import { META_VENTANA_24H } from "@/content/chatbot-precios";

export interface BloqueRequisitos {
  titulo: string;
  /** Una línea que explica de qué va el bloque. Opcional. */
  intro?: string;
  items: readonly string[];
}

export interface Requisitos {
  /** Encabezado del bloque completo. */
  titulo: string;
  entrada: string;
  bloques: readonly BloqueRequisitos[];
  /** Lo que el cliente marca. Se manda tal cual dentro del mensaje. */
  aceptacion: string;
}

export const REQUISITOS_CHATBOT: Requisitos = {
  titulo: "Antes de pedir el chatbot, leé esto",
  entrada:
    "El chatbot funciona sobre WhatsApp, y WhatsApp es de Meta. Hay cosas que dependen de vos y cosas que dependen de ellos. Te las decimos todas ahora para que no haya sorpresas después.",
  bloques: [
    {
      titulo: "Lo que ponés vos",
      items: [
        "Un número de WhatsApp dedicado para el bot. Te recomendamos uno nuevo y dejar el tuyo de siempre como está.",
        "Ese número no puede estar usándose en la app de WhatsApp ni en WhatsApp Business. Si querés usar el que ya usás con tus clientes, hay que borrar esa cuenta primero y perdés todo el historial de chats, para siempre — y después no vas a poder volver a atender desde el celular con ese número.",
        "Alguien con el celular en la mano el día que lo activamos: Meta manda un código por mensaje o por llamada y hay que pasárnoslo en el momento.",
        "La información real de tu negocio: qué vendés, qué te preguntan siempre y cómo respondés vos. Sin esto el bot contesta genérico y no sirve. Es lo que más tiempo lleva y es tu parte.",
        "Una persona que atienda lo que el bot te derive. El bot filtra y ordena; no reemplaza a tu equipo.",
      ],
    },
    {
      titulo: "Lo que ponemos nosotros",
      items: [
        "Configuramos y verificamos el número con Meta.",
        "Armamos las plantillas y las mandamos a aprobación.",
        "Probamos el bot con tu información real y te lo mostramos andando en un WhatsApp de prueba.",
        "Se enciende con clientes reales recién cuando vos das el OK, y después lo seguimos ajustando.",
      ],
    },
    {
      titulo: "Lo que le pagás a Meta (no lo cobramos nosotros)",
      intro:
        "Meta cobra por cada mensaje que TU negocio le manda primero al cliente: un aviso, una promoción. Ese cobro va directo entre vos y Meta.",
      items: [
        `Cuando el cliente te escribe a vos, responder dentro de las 24 horas siguientes no te cuesta hasta el ${META_VENTANA_24H.hasta} (es regla de Meta, y Meta la cambia por su cuenta). Toda la atención del bot entra en esa ventana; desde el ${META_VENTANA_24H.desde} Meta también cobra esas respuestas.`,
        "Lo que tu negocio inicia lo pagás vos, en tu propia cuenta de Meta: no pasa por nuestra factura y no le sumamos nada encima.",
        "Los mensajes promocionales cuestan bastante más. No se mandan sin tu autorización expresa y te avisamos el costo antes.",
      ],
    },
    {
      titulo: "Los tiempos y lo que no podemos prometerte",
      items: [
        "Meta se toma hasta 24 horas para aprobar cada plantilla. Eso no lo controlamos nosotros.",
        "El resto del tiempo lo manda cuánto tardás en pasarnos tus respuestas reales. Con tu información en mano, te damos la fecha de encendido por escrito.",
        "Meta puede rechazar un nombre de negocio o una plantilla, y puede limitar a cuánta gente nueva le escribís por día. Si algo se traba de su lado, te lo decimos ese día y buscamos la alternativa.",
      ],
    },
  ],
  aceptacion:
    "Leí y entiendo los requisitos: pongo el número dedicado y la información de mi negocio, y los mensajes que Meta cobra los pago yo, directo a Meta.",
};

export const REQUISITOS_WEB: Requisitos = {
  titulo: "Antes de pedir tu web, leé esto",
  entrada:
    "Son dos minutos y evitan el 90% de los problemas. Una web se atrasa por el contenido, casi nunca por el diseño.",
  bloques: [
    {
      titulo: "Lo que ponés vos (sin esto no podemos arrancar)",
      items: [
        "Los textos de tu negocio: qué hacés y entre 3 y 6 servicios, cada uno con una frase de qué resuelve. No hace falta que estén lindos — los pulimos nosotros. Pero el contenido de tu negocio lo sabés vos, y no lo inventamos.",
        "Tus datos de contacto: WhatsApp y/o email, dirección y horarios. Sin un canal de contacto la web no sirve para vender.",
        "Tus fotos: del local, del equipo o de tus trabajos. Los archivos originales, no capturas de WhatsApp.",
        "Tu logo, si tenés. Si no tenés, armamos un logotipo con el nombre de tu marca. El diseño de identidad completo es otro trabajo y se cotiza aparte.",
        "Si es tienda: la lista de productos con nombre, categoría, precio, descripción y una foto por producto. Sin precio no hay carrito — el pedido pasa a ser una solicitud de cotización.",
        "Una persona que aprueba. Una sola. Es lo que más acelera el proyecto.",
      ],
    },
    {
      titulo: "Lo que ponemos nosotros",
      items: [
        "Diseño hecho para tu marca, no una plantilla que ya viste en otro lado.",
        "Redacción y ordenamiento de tus textos, íconos y optimización de tus fotos para que la web cargue rápido.",
        "Versión clara y versión oscura, accesibilidad verificada y velocidad verificada.",
        "SEO básico: título, descripción y la imagen que aparece cuando compartís el link.",
        "Un preview para que lo aprobés desde el celular antes de publicar, y la publicación.",
      ],
    },
    {
      titulo: "Lo que se paga aparte y va a TU nombre",
      items: [
        "Dominio: lo comprás vos con tu tarjeta, a tu nombre. Te acompañamos en el trámite pero nunca tocamos tu medio de pago, y te pasamos el precio exacto antes.",
        "Hosting: cuenta tuya, plan gratuito. Nos das un permiso limitado a publicar en tu sitio y nada más. Si un día no querés trabajar con nosotros, lo revocás y la web sigue siendo tuya. Nunca queda nada a nombre de Onia.",
        "Fotos: si no tenés propias, las podemos generar o coordinar una sesión. Se cotiza aparte y se te avisa el costo antes de gastar un peso.",
        "Pasarela de pago, si querés cobrar con tarjeta: necesita tu propia afiliación con el banco y la comisión del banco es tuya. Se cotiza aparte.",
        "Publicidad, mensajería de WhatsApp paga y créditos de inteligencia artificial: son tuyos, nunca están dentro de nuestro precio.",
      ],
    },
    {
      titulo: "Plazos y forma de pago",
      items: [
        "El reloj arranca cuando nos llega todo el contenido, no cuando firmás. Con el 90% del material armamos el 90% de tu web, y el 10% que falta es siempre el que la deja sin publicar.",
        "Las rondas de ajuste incluidas van escritas en tu propuesta antes de que pagues el anticipo.",
        "Forma de pago: 50% de anticipo para arrancar y 50% contra entrega.",
      ],
    },
    {
      titulo: "Lo que NO incluye, para que no haya sorpresas",
      items: [
        "No incluye un panel para que edites la web vos mismo. Los cambios los hacemos nosotros, y para eso está el plan mensual de Cuidado Web.",
        "No incluye sitio en dos idiomas, ni blog, ni carga de artículos.",
        "No incluye contenido que sólo vos podés dar: tu historia, tus precios, tus testimonios reales. No inventamos testimonios ni números.",
        "No garantizamos aparecer primero en Google. Entregamos la web bien hecha para que Google la lea; el posicionamiento es un trabajo aparte y nadie serio te lo puede garantizar.",
      ],
    },
  ],
  aceptacion:
    "Leí y entiendo los requisitos: pongo los textos, las fotos y los datos de contacto, y el dominio y el hosting van a mi nombre y se pagan aparte.",
};

/**
 * Serializa los requisitos para el mensaje de WhatsApp. Va la aceptación y lo
 * que el cliente tiene que poner: es la parte que después se reclama, y tiene
 * que quedar escrita en el chat, no solo en la página.
 */
export function textoAceptacion(req: Requisitos): string {
  const ponesVos = req.bloques[0];
  const items = ponesVos.items
    .map((item) => `- ${item.split(".")[0]}.`)
    .join("\n");
  return `${req.aceptacion}\n\n${ponesVos.titulo}:\n${items}`;
}
