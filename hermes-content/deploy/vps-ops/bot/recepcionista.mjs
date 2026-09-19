// ONIA — Chatbot propio: MODO RECEPCIONISTA (el bot de un CLIENTE de Onia).
//
// EL PROBLEMA QUE RESUELVE: cuando una conversacion resuelve a una organizacion cliente
// (inbox -> org, fuente "db"), el motor contestaba con las plantillas del funnel de VENTA de
// Onia con el nombre cambiado ("ZZ QA Ferreteria Tornillo es una plataforma por modulos...").
// El bot de un cliente tiene que presentarse como el asistente DEL negocio y atender como
// recepcionista: horarios, servicios, tomar un pedido — y TODO lo demas lo confirma un humano.
//
// REGLAS, en orden de importancia:
//   1. Solo se activa con `config.modo === "recepcionista"`, que knowledge.mjs pone UNICAMENTE
//      cuando el conocimiento vino de la fila publicada de una org (fuente "db"). El funnel de
//      leads de Onia (DEMO, calificacion, M4) es EXCLUSIVO del modo venta.
//   2. Renderiza SOLO hechos del knowledge de la org (`config.conocimiento`, el documento
//      "onia.bot.knowledge/1" validado). Si un campo falta, respuesta honesta + handoff
//      (R_NO_DATO) — nunca se rellena con los datos de Onia.
//   3. JAMAS precios: pedido / precio / duda => handoff a {{humano}}. La UNICA excepcion es
//      AGENDAR: si la org tiene slug, el bot manda el link de su agenda publica (que ya crea la
//      cita) en vez de derivar — ver linkDeReserva. Sin slug, vuelve a ser un handoff.
//   4. SIN LLM. Decision consciente (la rama LLM del funnel ancla su prompt al pitch de Onia):
//      lo fuera de guion deriva al humano del negocio. Anotado como pendiente parametrizarlo.
//
// Determinista igual que el motor: cero Date.now(), cero I/O. Los helpers con estado
import { checkGuardrails } from "./guardrails.mjs";

// (finalize / handoffResult / say) llegan inyectados desde bot-engine.mjs para no duplicarlos
// ni crear un import circular.

import * as intents from "./intents.mjs";
import { normalize } from "./guardrails.mjs";
import { faqVigente } from "./knowledge.mjs";

/**
 * El menu de BOTONES del recepcionista (Chatwoot `content_type: input_select`).
 * UN solo formato sirve para los dos canales: el widget Website lo renderiza como opciones
 * clickeables y Chatwoot lo traduce a reply buttons de WhatsApp (PR #6886) — de ahi los topes
 * duros de 3 opciones y 20 caracteres por titulo (limites de Meta, no nuestros).
 * El `value` es el payload estable; el titulo con el humano cae a "Hablar con alguien" si el
 * nombre no entra en 20 (nunca se manda truncado a la vista del cliente). "hablar con una
 * persona" como value no es casual: si el canal manda el value en vez del titulo, ese texto ya
 * lo entiende `intents.wantsHuman` sin regla nueva.
 */
export function botonesRecepcion(config) {
  const humano = String(config?.identity?.humanName || "").trim();
  const conHumano = humano ? `Hablar con ${humano}` : "Hablar con alguien";
  return [
    { title: "Horarios", value: "horarios" },
    { title: "Servicios", value: "servicios" },
    { title: conHumano.length <= 20 ? conHumano : "Hablar con alguien", value: "hablar con una persona" },
  ];
}

/**
 * ¿El mensaje es el CLICK de un boton del menu? Match EXACTO contra titulo o value normalizados
 * (verificado en vivo: el widget manda el TITULO como content del mensaje entrante; el value se
 * cubre por si otro canal manda eso). Exacto a proposito: "horarios de mañana?" es lenguaje
 * natural y lo juzgan los intents, no esto.
 */
function botonElegido(norm, config) {
  const texto = String(norm || "").trim();
  if (!texto) return null;
  for (const boton of botonesRecepcion(config)) {
    if (texto === normalize(boton.title).trim() || texto === normalize(boton.value).trim()) {
      return boton.value === "hablar con una persona" ? "humano" : boton.value;
    }
  }
  return null;
}

/**
 * El catalogo del CLIENTE, desde su knowledge publicado. No pasa por MODULOS_LISTOS: ese
 * candado protege promesas de software de ONIA; el catalogo de una org son hechos suyos, ya
 * validados todo-o-nada por el guardrail al publicarse.
 */
export function catalogoCliente(conocimiento) {
  const productos = Array.isArray(conocimiento?.productos) ? conocimiento.productos : [];
  return productos
    .filter((producto) => producto && producto.nombre)
    .map((producto) => `• *${producto.nombre}*${producto.queResuelve ? ` — ${producto.queResuelve}` : ""}`)
    .join("\n");
}

/**
 * Un turno en modo recepcionista.
 * @param {object} ctx    el mismo ctx de step(): { config, prev, msg }
 * @param {object} base   estado con lastInboundAt ya actualizado
 * @param {object} motor  { finalize, handoffResult, say } — los helpers privados de bot-engine
 */
/**
 * La FAQ del negocio que matchea el mensaje, o null. Match de PALABRA ENTERA sobre el texto
 * normalizado ("iva" no salta con "activa"); los tags los escribio el dueño y ya pasaron el
 * guardrail al publicarse. Vigencia contra msg.receivedAt (el motor es determinista: cero
 * Date.now()); una FAQ con vencimiento y sin fecha de mensaje NO se sirve (fail-closed).
 */
export function faqNegocioVigente(conocimiento, norm, nowIso) {
  const items = Array.isArray(conocimiento?.faq) ? conocimiento.faq : [];
  const texto = String(norm || "");
  if (!texto) return null;
  for (const item of items) {
    if (!item || item.id !== "negocio" || !faqVigente(item, nowIso)) continue;
    for (const tag of Array.isArray(item.tags) ? item.tags : []) {
      const palabra = normalize(tag).trim();
      if (palabra.length < 3) continue;
      const escapada = [...palabra].map((c) => ("[](){}.*+?^$|\\".includes(c) ? "\\" + c : c)).join("");
      if (new RegExp(`(^|[^a-z0-9])${escapada}([^a-z0-9]|$)`).test(texto)) return item;
    }
  }
  return null;
}

/**
 * Campaña cuya frase es el mensaje ENTERO. Para wa.me?text= y anuncios.
 * La puntuacion no cuenta: el link precarga "Hola, quiero..." y el cliente puede
 * borrar la coma — sigue siendo el mismo embudo. Solo letras/numeros/espacios.
 *
 * EXCEPCION opt-in `prefijo: true`: hay links que dejan el texto ABIERTO a proposito
 * ("...Mi negocio es: " en /v1/empezar) y la persona escribe atras. Esos no pueden ser
 * match exacto NUNCA, asi que sin esto el CTA que mas informacion declara —su rubro—
 * recibia el saludo generico. Es por campaña y no global: una campaña normal no se
 * puede estirar sola a mensajes mas largos.
 */
function fraseCanonica(texto) {
  return String(texto || "").replace(/[^a-z0-9 ]/g, " ").replace(/ +/g, " ").trim();
}

export function campanaExacta(conocimiento, norm) {
  const items = Array.isArray(conocimiento?.campanas) ? conocimiento.campanas : [];
  const texto = fraseCanonica(norm);
  if (!texto) return null;
  // El match exacto GANA siempre (sale por el return de adentro). El prefijo se guarda y se
  // resuelve al final, con la frase mas larga: entre dos prefijos que arrancan igual, el mas
  // especifico. El " " del startsWith es el limite de palabra — sin el, "mi negocio es" tambien
  // matchearia "mi negocio establecido".
  let prefijo = null;
  for (const item of items) {
    if (!item || typeof item.frase !== "string") continue;
    const frase = fraseCanonica(normalize(item.frase));
    if (!frase) continue;
    if (frase === texto) return item;
    if (item.prefijo === true && texto.startsWith(frase + " ") && (!prefijo || frase.length > prefijo.largo)) {
      prefijo = { item, largo: frase.length };
    }
  }
  return prefijo ? prefijo.item : null;
}

/**
 * EL LINK DE LA AGENDA de esta org, o null.
 *
 * POR QUE EXISTE: `pricing.ts` vende el chatbot como "contesta, califica, AGENDA" y este motor
 * decia lo contrario — toda intencion de cita terminaba derivada a un humano. La agenda publica
 * de la org YA existe y crea citas reales, y `Organization.slug` es unico: agendar es mandar
 * este link. No hay integracion nueva, solo dejar de mentir.
 *
 * FAIL-CLOSED, que es lo unico delicado de esta funcion: `config.orgSlug` viaja desde la fila
 * publicada de la org y su validacion en el producto (`register`) es un `z.string()` sin charset,
 * o sea que un slug con basura adentro es posible. Sin slug limpio se devuelve null y el turno
 * deriva EXACTAMENTE como antes. Un link roto delante del cliente final es peor que un handoff.
 */
export const AGENDA_BASE_URL = "https://app.onia.com.bo/book";
const RE_SLUG_ORG = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

export function linkDeReserva(config) {
  const slug = String(config?.orgSlug || "").trim();
  if (!slug || slug.length > 120 || !RE_SLUG_ORG.test(slug)) return null;
  return `${AGENDA_BASE_URL}/${slug}`;
}

export function recepcionistaStep(ctx, base, motor) {
  const { config, msg } = ctx;
  const { finalize, handoffResult, say } = motor;
  const k = config.conocimiento || {};

  // Opt-out previo: silencio SIEMPRE. No hay reapertura por disparador ("DEMO" es del funnel).
  if (base.optOutAt) return finalize(ctx, base, [], [], ["silencio:opt_out"]);
  // Handoff en curso: el humano del negocio esta a cargo, el bot no habla encima — SALVO el
  // click EXACTO de un boton del menu que el propio bot dejo a la vista en R_DERIVA: contestar
  // esa FAQ es cumplir lo ofrecido, no hablar encima. Solo lectura: cero efectos nuevos, y la
  // conversacion NO sale del handoff. Texto libre = silencio, como siempre.
  if (base.botStage === "handoff_humano") {
    const boton = botonElegido(msg.norm, config);
    if (boton === "horarios" && k.empresa?.horario?.frase) {
      return finalize(ctx, base, [say("R_HORARIO", base, config)], [], ["faq:horario", "boton_en_handoff"]);
    }
    if (boton === "servicios") {
      const catalogo = catalogoCliente(k);
      if (catalogo) {
        return finalize(ctx, base, [say("R_SERVICIOS", base, config, { catalogo_cliente: catalogo })], [], ["faq:servicios", "boton_en_handoff"]);
      }
    }
    return finalize(ctx, base, [], [], ["silencio:handoff_en_curso"]);
  }

  // Nota de voz que no podemos transcribir (Speaches no existe en el VPS: `npm run destinos:vivos`).
  // Aca pesa mas que en el bot de venta: este es el asistente del CLIENTE, el add-on que se cobra,
  // y quien manda el audio es SU cliente. No poder leerlo es un fallo de comprension, asi que usa
  // el mismo contador que los malentendidos: se pide texto una vez y, si insiste con audio, lo
  // escucha una persona del negocio — que si puede, porque el audio esta en Chatwoot. Antes esto
  // era un `finalize` pelado y el negocio no se enteraba nunca de que alguien habia escrito.
  if (msg.kind === "voice" && !msg.hasText) {
    const count = base.offScriptCount + 1;
    if (count >= config.offScript.maxBeforeHandoff) {
      return handoffResult(ctx, { ...base, offScriptCount: count }, "audio_que_no_podemos_oir_recepcion", [], "R_AUDIO_DERIVA");
    }
    return finalize(ctx, { ...base, offScriptCount: count }, [say("R_AUDIO", base, config)], [], ["audio_sin_transcripcion"]);
  }
  if (msg.kind === "attachment" && !msg.hasText) {
    // COMPROBANTE DE PAGO detectado por vision (Sendy-parity, 2026-08-31): el bot
    // acusa recibo del documento y deriva — JAMAS confirma un pago solo (regla dura:
    // la plata la confirma un humano). El monto es un eco sanitizado del comprobante
    // del cliente, no una cifra nuestra: vision.mjs ya lo valido con regex estricto.
    if (msg.imageReceipt && msg.imageReceipt.es === true) {
      const monto_frase = msg.imageReceipt.monto ? ` de Bs ${msg.imageReceipt.monto}` : "";
      return handoffResult(ctx, base, "comprobante_recibido", [], {
        key: "R_COMPROBANTE",
        vars: { monto_frase },
      });
    }
    // Vision (v5): la descripcion de la foto SOLO se usa si pasa los guardrails —
    // un LLM que alucine un precio o un diagnostico se descarta entero y el flujo
    // queda identico al de siempre. El handoff al humano se hace igual con o sin.
    const desc = String(msg.imageDescription || "").trim();
    // Regla extra para vision: una descripcion con DIGITOS se descarta entera
    // (precio, fecha, placa — el bot no repite cifras que no puede verificar).
    // checkGuardrails caza las promesas; esto caza lo que una foto puede colar.
    if (desc && !/\d/.test(desc) && checkGuardrails(desc).length === 0) {
      return handoffResult(ctx, base, "archivo_adjunto_recepcion", [], {
        key: "R_ATTACH_VISTO",
        vars: { descripcion_foto: desc.replace(/\.$/, "") },
      });
    }
    return handoffResult(ctx, base, "archivo_adjunto_recepcion", [], "R_ATTACH");
  }
  if (!msg.hasText) return finalize(ctx, base, [], [], ["sin_texto"]);

  // El primer inbound atendido es el opt-in del contacto (escribio el). Ademas hace de marcador
  // "ya se lo saludo": el estado NO estrena etapa nueva — `bot_stage` tiene CHECK en la base
  // (migracion 20260725) y un ALTER por un saludo no se justifica. La conversacion vive en
  // "nuevo" hasta que un handoff u opt-out la mueva.
  // Frase de campaña ANTES del saludo: en un link wa.me?text= la frase ES el primer
  // mensaje — si el saludo ganara, el embudo del anuncio moriria en el "hola". El
  // opt-in se marca igual (escribio el) y la respuesta lleva los botones del menu.
  const campana = campanaExacta(k, msg.norm);
  if (campana) {
    const conOptIn = base.optInAt ? base : { ...base, optInAt: msg.receivedAt, optInSource: "campana" };
    const reply = { ...say("R_CAMPANA", conOptIn, config, { respuesta_campana: campana.respuesta }), options: botonesRecepcion(config) };
    return finalize(ctx, conOptIn, [reply], [], ["campana"]);
  }

  const saludado = Boolean(base.optInAt);
  const next = saludado
    ? base
    : { ...base, optInAt: msg.receivedAt, optInSource: base.optInSource || "inbound_recepcion" };
  // D2 en el primer contacto: si la primera pregunta ya es concreta, la respuesta va con la
  // presentacion adelante — el bot del negocio tambien se declara bot.
  const intro = saludado ? [] : [say("M0R_INTRO", next, config)];
  const faq = (reply, note) => finalize(ctx, next, [...intro, reply], [], [note]);
  // R_DERIVA sale con el menu de botones: es el mensaje mas comun (fuera de guion) y los
  // botones le dejan al cliente lo que el bot SI sabe contestar mientras espera al humano.
  const deriva = (reason, bodyKey) =>
    handoffResult(ctx, next, reason, intro, bodyKey === "R_DERIVA" ? { key: "R_DERIVA", options: botonesRecepcion(config) } : bodyKey);
  // Click de un boton del menu (M0R / R_DERIVA): payload exacto, gana antes que los intents.
  const boton = botonElegido(msg.norm, config);

  if (intents.isOptOut(msg.norm)) {
    const out = { ...next, botStage: "opt_out", optOutAt: msg.receivedAt };
    return finalize(ctx, out, [say("M6R", out, config)], [], ["opt_out"]);
  }
  if (intents.isComplaint(msg.norm)) return deriva("queja_recepcion", "R_DERIVA");
  if (boton === "humano" || intents.wantsHuman(msg.norm)) return deriva("pidio_humano_recepcion", "R_DERIVA");

  // Precio ANTES que el interes: "quiero comprar, ¿cuanto sale?" pregunta plata, y la respuesta
  // es la misma para las dos mitades — lo confirma el humano, sin una sola cifra.
  if (intents.isPriceQuestion(msg.norm)) return deriva("pregunta_precio_recepcion", "R_PRECIO");

  // "¿como es la cita?" pregunta, no reserva: va antes que el interes ("cita" matchea en los dos).
  if (intents.asksBookingInfo(msg.norm)) {
    return k.demo?.duracionFrase && k.demo?.modalidad
      ? faq(say("R_CITA", next, config), "faq:cita")
      : deriva("sin_dato_cita", "R_NO_DATO");
  }

  // AGENDAR: la unica intencion que el bot cierra SOLO — le manda el link de la agenda publica de
  // su org, que crea la cita de verdad. Sin link (org sin slug, o slug sucio) cae al handoff de
  // abajo, igual que antes. `wantsToBook` excluye la compra a proposito: "quiero comprar 100
  // tornillos y agendar" es un pedido y un pedido lo sigue confirmando una persona.
  const linkAgenda = linkDeReserva(config);
  if (linkAgenda && intents.wantsToBook(msg.norm)) {
    return faq(say("R_AGENDA", next, config, { link_reserva: linkAgenda }), "agenda:link_reserva");
  }

  // Pedido / compra (y cita sin agenda publica): se toma y se ESCALA. El bot no vende solo.
  if (intents.wantsToOrder(msg.norm)) return deriva("pedido_del_cliente", "R_INTERES");

  if (boton === "horarios" || intents.asksSchedule(msg.norm)) {
    return k.empresa?.horario?.frase
      ? faq(say("R_HORARIO", next, config), "faq:horario")
      : deriva("sin_dato_horario", "R_NO_DATO");
  }

  if (boton === "servicios" || intents.asksWhatWeDo(msg.norm)) {
    const catalogo = catalogoCliente(k);
    return catalogo
      ? faq(say("R_SERVICIOS", next, config, { catalogo_cliente: catalogo }), "faq:servicios")
      : deriva("sin_dato_catalogo", "R_NO_DATO");
  }

  // La FAQ editable del dueño — DESPUES de los candados del guion (precio/pedido/queja ganan
  // siempre) y de las FAQ fijas, ANTES de derivar por fuera de guion.
  const faqNegocio = faqNegocioVigente(k, msg.norm, msg.receivedAt);
  if (faqNegocio) return faq(say("R_FAQ_NEGOCIO", next, config, { faq_respuesta: faqNegocio.body }), "faq:negocio");

  // "gracias" / "nos vemos": no es una consulta, no se molesta a nadie.
  if (intents.isCourtesy(msg.norm)) return finalize(ctx, next, [], [], ["cortesia_sin_respuesta"]);

  // Saludo (o primer contacto sin pregunta reconocible): el menu del recepcionista, CON los
  // botones. Si el canal no soporta interactivos, el texto de M0R solo ya dice las 3 opciones.
  if (intents.isGreeting(msg.norm) || !saludado) {
    return finalize(ctx, next, [{ ...say("M0R", next, config), options: botonesRecepcion(config) }], [], ["saludo_recepcion"]);
  }

  // Fuera de guion: SIN LLM (regla 4) — lo contesta el humano del negocio. Directo al handoff:
  // decir "te confirma {{humano}}" sin avisarle a nadie seria mentira.
  return deriva("fuera_de_guion_recepcion", "R_DERIVA");
}
