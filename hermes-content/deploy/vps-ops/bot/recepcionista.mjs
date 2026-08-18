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
//   3. JAMAS precios, jamas agendar solo: pedido / precio / duda => handoff a {{humano}}.
//   4. SIN LLM. Decision consciente (la rama LLM del funnel ancla su prompt al pitch de Onia):
//      lo fuera de guion deriva al humano del negocio. Anotado como pendiente parametrizarlo.
//
// Determinista igual que el motor: cero Date.now(), cero I/O. Los helpers con estado
// (finalize / handoffResult / say) llegan inyectados desde bot-engine.mjs para no duplicarlos
// ni crear un import circular.

import * as intents from "./intents.mjs";

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
export function recepcionistaStep(ctx, base, motor) {
  const { config, msg } = ctx;
  const { finalize, handoffResult, say } = motor;
  const k = config.conocimiento || {};

  // Opt-out previo: silencio SIEMPRE. No hay reapertura por disparador ("DEMO" es del funnel).
  if (base.optOutAt) return finalize(ctx, base, [], [], ["silencio:opt_out"]);
  // Handoff en curso: el humano del negocio esta a cargo, el bot no habla encima.
  if (base.botStage === "handoff_humano") return finalize(ctx, base, [], [], ["silencio:handoff_en_curso"]);

  if (msg.kind === "voice" && !msg.hasText) {
    return finalize(ctx, base, [say("M_AUDIO_FAIL", base, config)], [], ["audio_sin_transcripcion"]);
  }
  if (msg.kind === "attachment" && !msg.hasText) {
    return handoffResult(ctx, base, "archivo_adjunto_recepcion", [], "R_ATTACH");
  }
  if (!msg.hasText) return finalize(ctx, base, [], [], ["sin_texto"]);

  // El primer inbound atendido es el opt-in del contacto (escribio el). Ademas hace de marcador
  // "ya se lo saludo": el estado NO estrena etapa nueva — `bot_stage` tiene CHECK en la base
  // (migracion 20260725) y un ALTER por un saludo no se justifica. La conversacion vive en
  // "nuevo" hasta que un handoff u opt-out la mueva.
  const saludado = Boolean(base.optInAt);
  const next = saludado
    ? base
    : { ...base, optInAt: msg.receivedAt, optInSource: base.optInSource || "inbound_recepcion" };
  // D2 en el primer contacto: si la primera pregunta ya es concreta, la respuesta va con la
  // presentacion adelante — el bot del negocio tambien se declara bot.
  const intro = saludado ? [] : [say("M0R_INTRO", next, config)];
  const faq = (reply, note) => finalize(ctx, next, [...intro, reply], [], [note]);
  const deriva = (reason, bodyKey) => handoffResult(ctx, next, reason, intro, bodyKey);

  if (intents.isOptOut(msg.norm)) {
    const out = { ...next, botStage: "opt_out", optOutAt: msg.receivedAt };
    return finalize(ctx, out, [say("M6R", out, config)], [], ["opt_out"]);
  }
  if (intents.isComplaint(msg.norm)) return deriva("queja_recepcion", "R_DERIVA");
  if (intents.wantsHuman(msg.norm)) return deriva("pidio_humano_recepcion", "R_DERIVA");

  // Precio ANTES que el interes: "quiero comprar, ¿cuanto sale?" pregunta plata, y la respuesta
  // es la misma para las dos mitades — lo confirma el humano, sin una sola cifra.
  if (intents.isPriceQuestion(msg.norm)) return deriva("pregunta_precio_recepcion", "R_PRECIO");

  // "¿como es la cita?" pregunta, no reserva: va antes que el interes ("cita" matchea en los dos).
  if (intents.asksBookingInfo(msg.norm)) {
    return k.demo?.duracionFrase && k.demo?.modalidad
      ? faq(say("R_CITA", next, config), "faq:cita")
      : deriva("sin_dato_cita", "R_NO_DATO");
  }

  // Pedido / cita / compra: se toma y se ESCALA. El bot no agenda ni vende solo.
  if (intents.wantsToOrder(msg.norm)) return deriva("pedido_del_cliente", "R_INTERES");

  if (intents.asksSchedule(msg.norm)) {
    return k.empresa?.horario?.frase
      ? faq(say("R_HORARIO", next, config), "faq:horario")
      : deriva("sin_dato_horario", "R_NO_DATO");
  }

  if (intents.asksWhatWeDo(msg.norm)) {
    const catalogo = catalogoCliente(k);
    return catalogo
      ? faq(say("R_SERVICIOS", next, config, { catalogo_cliente: catalogo }), "faq:servicios")
      : deriva("sin_dato_catalogo", "R_NO_DATO");
  }

  // "gracias" / "nos vemos": no es una consulta, no se molesta a nadie.
  if (intents.isCourtesy(msg.norm)) return finalize(ctx, next, [], [], ["cortesia_sin_respuesta"]);

  // Saludo (o primer contacto sin pregunta reconocible): el menu del recepcionista.
  if (intents.isGreeting(msg.norm) || !saludado) {
    return finalize(ctx, next, [say("M0R", next, config)], [], ["saludo_recepcion"]);
  }

  // Fuera de guion: SIN LLM (regla 4) — lo contesta el humano del negocio. Directo al handoff:
  // decir "te confirma {{humano}}" sin avisarle a nadie seria mentira.
  return deriva("fuera_de_guion_recepcion", "R_DERIVA");
}
