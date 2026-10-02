/**
 * Chatbot de WhatsApp — FUENTE ÚNICA del precio y de la promesa.
 *
 * Todo lo que la web dice del chatbot (landing, /preview/precios,
 * /preview/chatbot, /chatbot y el configurador) sale de acá. `lib/pricing.ts`
 * → ADDONS también lee de este archivo: no hay una segunda lista de precios.
 *
 * ⚠️ Corregido 2026-08-21, DOS cosas:
 *
 * 1. EL PRECIO. Convivían dos: `lib/pricing.ts` → ADDONS decía "Desde Bs 300
 *    de instalación + Bs 200/mes" y este archivo decía "Bs 1.500 + Bs
 *    1.490/mes". Dos fuentes del mismo add-on = la sesión elige mal. Decisión
 *    de Sergio (2026-08-21): **Bs 390/mes, sin instalación**, anual Bs 3.900
 *    (10 meses, igual que los planes). Y el markup del 20 % sobre Meta se cae:
 *    el cliente le paga a Meta directo, en su propia cuenta.
 *
 * 2. LA PROMESA. Se midió el bot contra su código y el material vendía cosas
 *    que no hace. Lo que se sacó, y por qué:
 *      - "IA que responde, entrenada con el contenido real de tu negocio" → el
 *        modo cliente NO usa LLM: son intents contra un JSON validado.
 *      - "Recordatorios automáticos de cita y de cobro" → no existen todavía.
 *      - "agenda" → no agenda: todo pedido de cita va a una persona.
 *      - "500 conversaciones por mes incluidas" → no había contador ni corte
 *        implementado, así que no se prometía un cupo (META_MARKUP_PCT no
 *        existe más: se borró, no se maquilló).
 *
 *    ⚠️ Ese último punto quedó VENCIDO el 2026-09-03 y siguió leyéndose como
 *    presente tres días — corregido el 2026-09-06. El contador existe y CORTA:
 *    `onia-platform/lib/chatbot/cupo.ts` cuenta por mes, expone
 *    `agotada: usadas >= limite`, el motor deriva a una persona cuando es
 *    true, y hay una recarga que se le COBRA al dueño cuando se le acaba. O
 *    sea que el cupo pasó de ser copy a ser una condición que el cliente
 *    sufre — y la venta seguía sin nombrarlo, así que se enteraba pagando.
 *    Un comentario que explica por qué algo NO se dice es una hipótesis con
 *    fecha: mientras esta cabecera dijo «no se promete un cupo», cada vuelta
 *    que la leía volvía a sacarlo. Hoy se promete, con su salida al lado.
 *    Guarda: `app/(sitio)/limite-que-corta.test.ts` (y el número se cruza
 *    contra el producto con `npm run precios:fuente` —
 *    `scripts/precios-fuente.mjs`, que compara `CONVERSACIONES_INCLUIDAS`
 *    contra `includedConversations` de `onia-platform/lib/pricing.ts`).
 *    ⚠️ Esta línea nombró hasta el 2026-09-07 un verificador «limites-vivos»
 *    que nunca se escribió: el cruce existía con otro nombre, así que el dato
 *    estaba sano y lo único roto era la forma de comprobarlo. Una afirmación
 *    de cobertura falsa detiene la auditoría en vez de dispararla, por eso
 *    ahora la vigila `app/cobertura-citada.test.ts` — y por eso el nombre
 *    muerto se cuenta acá sin escribirlo como ruta: el gate mira rutas.
 *
 *    Lo que quedó es lo que el código SÍ hace, y es defendible: contesta al
 *    instante a cualquier hora, responde con la información que el negocio
 *    cargó, **no puede inventar ni cotizar un precio** (es determinístico —
 *    ventaja frente a un bot con IA suelta que alucina) y pasa el caso a una
 *    persona cuando no sabe.
 *
 * Referencia de valor: Bs 390/mes es el 12 % del salario mínimo 2026
 * (Bs 3.300, DS 5516), sin aguinaldo ni domingos, por algo que atiende 24/7.
 */

export type StackId = "whatsapp";

/**
 * Conversaciones que el add-on atiende por mes — ESPEJO de
 * `WHATSAPP_ADDON.includedConversations` (`onia-platform/lib/pricing.ts`), que
 * es el número que el producto APLICA: `lib/chatbot/cupo.ts` lo lee para
 * cortar («El cupo sale de pricing.ts: lo que se vende es lo que se aplica»).
 *
 * Vive acá porque el otro repo no está en este worktree, igual que los montos
 * de `lib/pricing.ts`. Que las dos copias coincidan NO es una propiedad del
 * código: lo cruza `scripts/precios-fuente.mjs` (`npm run precios:fuente`)
 * contra la fuente real, fuera de la cadena `npm test` (exigir el repo hermano
 * pondría rojo por ambiente y trabaría el merge de los quince carriles).
 */
export const CONVERSACIONES_INCLUIDAS = 500;

/**
 * El EXTRA que se compra cuando el cupo se agota — ESPEJO de
 * `RECARGA_CONVERSACIONES` (`onia-platform/lib/pricing.ts`), cruzado por
 * `scripts/precios-fuente.mjs` igual que `CONVERSACIONES_INCLUIDAS`.
 *
 * ⚠️ Nace de un hueco medido el 2026-09-11. El cupo ya se nombraba (06-sep) y
 * su salida terminaba en «y podés sumar más»: un extra PAGO ofrecido sin decir
 * **cuánto cuesta** ni **cuánto dura**. Las dos mitades le cuestan plata al
 * dueño y ninguna era visible para un barrido de este proyecto — no sobra una
 * palabra prohibida, la cifra publicada salía de la fuente y el precio del
 * extra no aparecía en ninguna página (medido: `Bs 190` daba 0 en la home,
 * `/chatbot` y `/precios`), así que no había número que pudiera estar mal.
 *
 * La caducidad es la mitad que más engaña, porque lo natural es suponer que lo
 * comprado se acumula: `aplicarRecarga()` escribe `recargadas` en la fila del
 * MES en curso (`chatbot_uso_mensual`, clave `organizationId_mes`), así que el
 * 1 empieza una fila nueva en cero y **lo que se pagó no viaja**. Es el mismo
 * escalón que el cupo, un paso más abajo: ahí se callaba cuánto te dan, acá
 * cuánto te dura. Guarda: `(sitio)/extra-que-caduca.test.ts`.
 */
export const RECARGA = {
  /** Conversaciones que suma una recarga. */
  conversaciones: 200,
  /** Bs que cuesta esa recarga. */
  precio: 190,
} as const;

export interface ChatbotStack {
  readonly id: StackId;
  /** Etiqueta corta de la celda. No hay escalera: es un solo servicio. */
  readonly nivel: string;
  readonly nombre: string;
  readonly paraQuien: string;
  readonly resuelve: string;
  readonly incluye: readonly string[];
  readonly noIncluye: readonly string[];
  readonly necesitasVos: readonly string[];
  /** Bs por mes. */
  readonly mensual: number;
  /** Bs, año adelantado (= 10 meses, igual que los planes). */
  readonly anual: number;
  readonly destacado?: boolean;
}

export const CHATBOT_STACKS: readonly ChatbotStack[] = [
  {
    id: "whatsapp",
    nivel: "WhatsApp",
    nombre: "No pierdo al que escribe",
    paraQuien:
      "El que recibe consultas y las está perdiendo fuera de horario: consultorio, comercio, importadora.",
    resuelve:
      "El mensaje de las 11 de la noche, el del domingo, el del feriado. El que preguntó, nadie contestó y se fue a otro lado.",
    incluye: [
      "Contesta al instante a cualquier hora: de noche, el domingo y el feriado",
      // El límite se dice ACÁ, segundo, pegado a la frase que promete «a
      // cualquier hora» — no al pie ni en una FAQ. Y con su salida: al
      // agotarse la conversación NO se pierde, pasa a una persona. Es lo que
      // el producto hace de verdad (`cupo.ts` → textoDeCupo).
      //
      // El extra va con su PRECIO y su VIGENCIA en la misma frase: ofrecerlo
      // como «podés sumar más» callaba que se cobra y que muere el 1 (ver
      // `RECARGA`). Una salvedad en la oración siguiente es de otra promesa.
      `Atiende hasta ${CONVERSACIONES_INCLUIDAS} conversaciones por mes; si se agotan, las nuevas pasan a una persona de tu equipo, y podés sumar ${RECARGA.conversaciones} más por Bs ${fmtBs(RECARGA.precio)}, que valen hasta fin de mes y no se acumulan`,
      "Responde con la información real que vos publicaste: horarios, servicios y los datos de la cita",
      "No inventa ni cotiza por su cuenta: solo dice lo que vos cargaste",
      "Entiende las fotos que te mandan y te las pasa con la conversación",
      "Lo que no sabe se lo pasa a una persona, con la conversación completa",
      "Configuración del número y de las plantillas que Meta aprueba",
    ],
    noIncluye: [
      // El agente NO agenda dentro del chat (onia-platform
      // app/api/chatbot-knowledge/published/route.ts: con Reservas online manda
      // el link `/book/<slug>`; sin ellas, deriva a una persona).
      "Reservar dentro del chat: si tenés Reservas online, el agente le manda el link para que el cliente elija su horario; si no, pasa el pedido a tu equipo",
      "Lo que salga de este alcance (integraciones, flujos propios) se cotiza a medida",
    ],
    necesitasVos: [
      "Un número que Meta pueda verificar",
      "Tus preguntas frecuentes con tus respuestas reales",
      "Alguien que atienda lo que el agente derive",
    ],
    mensual: 390,
    anual: 3900,
    destacado: true,
  },
] as const;

/** El único servicio. Alias para las pantallas que muestran una sola tarjeta. */
export const CHATBOT_PLAN = CHATBOT_STACKS[0];

/**
 * Lo que no entra en el alcance no se infla a un nivel más caro: se cotiza.
 * Texto compartido para que las pantallas no lo redacten cada una distinto.
 */
export const A_MEDIDA =
  "¿Necesitás flujos propios, integraciones o más volumen? Se cotiza a medida.";

/**
 * La ventana de 24 h de WhatsApp — el dato AJENO que le cotizamos al lead y que
 * **Meta cambia por su cuenta en una fecha ya anunciada**.
 *
 * Vive acá, declarado, porque es la clase de afirmación que no se puede vigilar
 * mirando la pantalla: hasta el 30-sep-2026 *«responder dentro de las 24 horas
 * no lo cobra Meta»* es **verdad**, así que ningún barrido de este proyecto
 * podía verla — no sobra una palabra prohibida, no hay cifra fuera de fuente,
 * no promete trabajo humano, no es rubro ni plan ni rol, y está escrita en
 * PRESENTE, así que `plazo-que-vence.test.ts` (que persigue el futuro) tampoco
 * la alcanza. El defecto **nace el 1 de octubre**, sobre un sitio estático que
 * se hornea en el build y se queda quieto hasta un swap manual.
 *
 * Y es plata del cliente: le prometemos que responder no le cuesta, y el día
 * que deje de ser cierto se entera **por su propia factura de Meta**. El aviso
 * estaba escrito en dos lados y en ninguno podía ejecutarse solo —
 * `onia-platform/lib/pricing.ts` («⚠️ REVISAR ANTES DEL 1-OCT-2026 … hay que
 * avisárselo antes de que le llegue») y la fila de `ONIA_FECHAS_CRITICAS_PLAN.md`,
 * que nombra este archivo y a quien lo edite—: un comentario que declara una
 * acción pendiente desactiva la auditoría, porque el que lo lee da el tema por
 * atendido.
 *
 * ⚠️ **El arreglo NO es sacar la frase** (eso pierde un dato que al lead le
 * importa) **ni atarla al reloj** (en una página estática el valor se congela
 * en el build: la trampa que la casa ya pagó). Va la redacción que **no
 * caduca** — la condición con su fecha, verdadera antes y después del 1-oct —,
 * el mismo criterio con el que se resolvió el plazo del SIN.
 *
 * ⚠️ **VENCIDA el 1-oct-2026.** La redacción «no te cuesta hasta el 30 de
 * septiembre» dejó de servir: al lead que lee hoy le habla de una gratuidad que
 * ya no existe. Desde ese día el sitio dice sólo el presente (Meta cobra también
 * las respuestas) y `condicion-de-tercero.test.ts` impide volver a negar el
 * cargo. Las dos fechas quedan acá como historia y para `NO_INCLUYE`.
 *
 * Fuente primaria (Meta, verificada 2026-08-17), con el cálculo en Bs:
 * `hermes-content/docs/ONIA_FECHAS_CRITICAS_PLAN.md` §3.
 */
export const META_VENTANA_24H = {
  /** Último día en que Meta no cobra las respuestas dentro de la ventana. */
  hasta: "30 de septiembre de 2026",
  /** El día que empieza a cobrarlas: la fecha que la frase DEBE nombrar. */
  desde: "1 de octubre de 2026",
  /** Dónde está verificado. Un dato ajeno sin fuente es una cifra inventada. */
  fuente: "ONIA_FECHAS_CRITICAS_PLAN.md §3 — Meta, Upcoming pricing updates",
} as const;

/**
 * El mismo `META_VENTANA_24H.desde`, con un nombre SIN dígitos: `lib/pricing.ts`
 * es fuente de precio y el publicador (publicar-solo.sh) frena ante cualquier
 * número nuevo en ella — el `24` del nombre de arriba contaría como uno.
 */
export const META_COBRA_RESPUESTAS_DESDE = META_VENTANA_24H.desde;

/**
 * Meta: el cliente le paga a Meta DIRECTO, en su propia cuenta. Nosotros no
 * facturamos esos mensajes ni les sumamos nada encima (decisión 2026-08-21:
 * se cae el +20 %). Una sola redacción para todas las pantallas.
 *
 * La ventana de 24 h se DERIVA de `META_VENTANA_24H`: así la promesa no se
 * puede escribir sin su fecha. Ver `(sitio)/condicion-de-tercero.test.ts`.
 */
export const META_NOTA =
  "Los mensajes de WhatsApp que cobra Meta —también las respuestas al cliente que te escribió— " +
  "los pagás vos, directo a Meta y en tu propia cuenta: no pasan por nuestra factura y no les " +
  "sumamos nada encima. Meta fija esas tarifas y las cambia por su cuenta.";

export function fmtBs(v: number): string {
  return Math.round(v).toLocaleString("es-BO");
}

/**
 * El salario mínimo nacional — el dato AJENO contra el que anclamos el precio.
 *
 * Vive acá, al lado del precio del que es referencia, porque las dos mitades
 * de la frase se mueven por separado: el monto lo fija un DS (cambia por año)
 * y el precio del chatbot lo fija Sergio. Separadas, cualquiera de las dos
 * deja a la otra mintiendo.
 *
 * ⚠️ Hasta el 2026-09-04 estaba tipeado TRES veces —la portada, `/precios` y
 * `/chatbot`, cada una recalculando su propio porcentaje—, y lo que mantuvo
 * vivo el duplicado fue un comentario al lado de cada copia diciendo que le
 * correspondía estar acá *«pero ese archivo está fuera de este carril»*. Era
 * falso: `src/content/` es la misma app que las páginas que lo escribían. Un
 * comentario que explica por qué algo no se puede hacer es una hipótesis con
 * fecha. La invariante ahora se ejecuta: `(sitio)/salario-minimo.test.ts`.
 *
 * Es dato público con fuente legal, y por eso la norma se publica en pantalla
 * junto al número: un anclaje sin fuente es una cifra inventada.
 */
export const SALARIO_MINIMO = {
  /** Bs por mes. DS 5516. */
  monto: 3300,
  /** El año que nombra la frase en pantalla. */
  anio: 2026,
  /** La norma que lo fija, mostrada al lado del monto. */
  norma: "DS 5516",
} as const;

/**
 * Qué porcentaje del salario mínimo cuesta el chatbot — derivado, nunca
 * escrito. Hoy: 390 / 3.300 = 11,8 % → 12 %.
 */
export function pctDelSalarioMinimo(
  stack: ChatbotStack = CHATBOT_PLAN,
): number {
  return Math.round((stack.mensual / SALARIO_MINIMO.monto) * 100);
}

/** "Bs 390/mes, sin instalación" — una sola forma de decir el precio. */
export function precioStack(stack: ChatbotStack = CHATBOT_PLAN): string {
  return `Bs ${fmtBs(stack.mensual)}/mes, sin instalación`;
}

/** "Bs 3.900 al año (pagás 10 meses)" — el anual, dicho igual en todas partes. */
export function precioAnual(stack: ChatbotStack = CHATBOT_PLAN): string {
  return `Bs ${fmtBs(stack.anual)} al año (pagás 10 meses)`;
}

/** Celda de precio en la tabla de add-ons (lib/pricing.ts → ADDONS). */
export function precioAddonChatbot(): string {
  return `Bs ${fmtBs(CHATBOT_PLAN.mensual)}/mes, sin instalación`;
}
