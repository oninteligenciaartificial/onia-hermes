// ---------------------------------------------------------------------------
// aviso-telegram.mjs — el aviso a Sergio cuando el bot deriva a un humano.
//
// POR QUE EXISTE. El motor emite `notify_sergio` desde el 18-ago y el aviso viajaba con
// cuidado por cuatro archivos hasta una puerta tapiada: `n8n-event.mjs` lo mete en el evento
// del turno y ese evento sale por n8n, que en `/opt/onia/bot/webhook.env` esta
// `ONIA_N8N_ENABLED=false` con `ONIA_N8N_EVENT_URL` vacio. Medido el 2026-09-03 en produccion:
// conversacion 49, mensaje 389, el bot le dijo al prospecto "Ya le pase tu consulta con todo lo
// que me contaste. Te escribe el desde este mismo numero" y nadie recibio nada.
//
// LA JUSTIFICACION DEL CANAL MUERTO ERA FALSA, y por eso este archivo puede existir.
// `chatwoot-adapter.mjs:761` dice que el aviso va por n8n "porque ahi vive la credencial de
// Telegram (el plan VPS no soporta $env en los nodos, asi que el token no puede vivir aca)".
// Lo de n8n es cierto; la conclusion no. El limite es de los NODOS de n8n, no del bot: el bot
// es un proceso de Node en el VPS con su propio `webhook.env`, y el token ya vive en texto
// plano en dos archivos que otros procesos leen sin problema — `/root/.hermes/.env`
// (`TELEGRAM_BOT_TOKEN`, lo usa `/root/bin/onia-tg.sh`) y `/root/.config/onia/backup.env`
// (`TG_BOT_TOKEN`/`TG_CHAT_ID`, lo usa `webhook-watchdog.sh` cada 2 minutos por cron).
// O sea: no falta ninguna credencial. Faltaba el codigo.
//
// ENCENDIDO. ⚠️ Acá decía "APAGADO POR DEFECTO, A PROPOSITO... una decision de Sergio que
// esta preguntada y sin contestar" — y las dos mitades vencieron. Sergio Urcullo contestó el
// 2026-09-03 (tablero `t_b18ca430`): opcion (c) = Telegram YA, y Cal.com "cuando moleste
// anotar a mano". Desde entonces el default del lanzador va en ON y apagarlo es la linea
// manual, no al reves. Verificado en el proceso vivo el 2026-09-07:
// `ONIA_BOT_TG_AVISO=true` en `/proc/<pid>/environ` del webhook, dentro de `onia-center`.
//
// Se corrige acá y no en un doc aparte porque un comentario que dice "esto está apagado
// esperando una decisión" hace que el proximo lector lo deje apagado — que es exactamente
// como este mismo archivo llego a existir: `chatwoot-adapter.mjs:761` explicaba durante
// semanas por que el token "no podia" vivir en el bot, y era falso.
//
// QUE NO HACE, y es deliberado: no redacta el texto. `n8n-event.mjs` redacta porque el evento
// SALE del sistema hacia un tercero; esto va al Telegram privado del dueno de los datos, y es
// exactamente lo que el bot le prometio al prospecto que Sergio iba a leer. Un aviso redactado
// obliga a abrir el panel, que es justo lo que este archivo existe para evitar.
// ---------------------------------------------------------------------------

/** Timeout del POST a Telegram. Corto: el prospecto ya fue atendido, esto es fire-and-forget. */
// El `kind` se IMPORTA de donde se emite en vez de tipearlo: la unica forma de que la etiqueta
// y la emision se desincronicen es que sean dos literales distintos.
import { KIND_RESERVA_SIN_CONFIRMAR } from "./calcom-booking.mjs";
// El nombre del canal se IMPORTA de donde se decide la via que el bot le PROMETE al prospecto.
// Reimplementarlo acá haría que el aviso pudiera nombrar un canal distinto del que se prometió.
import { nombreDelCanal } from "./config.mjs";

/**
 * Lo emite el BARRIDO DE FOLLOW-UP (`followup-run.mjs`), no el motor: un lead que el bot
 * atendio bien, al que ya se le insistio una vez, y que igual se apago. "Se quedo callado" no
 * es ni `handoff` ni `demo_agendada`, asi que hasta el 2026-09-24 no producia NINGUN aviso —
 * medido con `conv 58`, un lead de WhatsApp llegado desde la web que quedo tibio seis dias sin
 * que el unico que podia rescatarlo supiera que existia.
 *
 * Vive ACA y no en el barrido para que no haya dos literales: `ETIQUETAS` se arma en este
 * archivo y un kind tipeado dos veces es como una etiqueta se desincroniza de su emision.
 */
export const KIND_LEAD_FRIO = "lead_frio";

export const AVISO_TIMEOUT_MS = 5000;

/** Telegram corta en 4096; dejamos aire para el encabezado y el pie. */
export const AVISO_MAX_CHARS = 3500;

/**
 * La marca que separa una prueba nuestra de un lead de verdad.
 *
 * POR QUE MARCA Y NO CALLA (medido el 2026-09-18, `npm run avisos:vivo`): los avisos que Sergio
 * Urcullo recibio en su vida por este canal son "leads 0 · nuestros 4". Con cero clientes
 * pagando, el primer aviso REAL va a llegar igual que los que ya aprendio a ignorar. Pero el
 * error caro es el otro: marcar a un lead real como prueba lo vuelve invisible, y ese lead es
 * el negocio entero. Asi que el aviso sale SIEMPRE y completo, la marca es aditiva, y ante la
 * duda no se marca.
 *
 * Es un regex a proposito: el gate lo importa en vez de tipear el texto, asi cambiar la frase
 * no puede dejar al gate vigilando una marca que ya no existe.
 */
export const MARCA_PRUEBA = /PRUEBA NUESTRA/;

/** El encabezado que lleva un aviso cuya conversacion somos nosotros. */
const ENCABEZADO_PRUEBA = "🧪 <b>PRUEBA NUESTRA</b> — no es un lead, no anotes nada";

/**
 * Motivos que el motor puede emitir, con la frase que le dice a Sergio QUE tiene que hacer.
 * Un motivo desconocido no se descarta: se manda igual con su nombre crudo. Un aviso que se
 * calla porque no reconoce una etiqueta es el mismo bug que este archivo viene a arreglar.
 */
export const ETIQUETAS = Object.freeze({
  handoff: "te esperan a vos",
  // Sin etiqueta propia, `construirAviso` cae al motivo crudo y Sergio Urcullo recibe el slug
  // interno ("quiere_comprar") en vez de una linea que le diga que hacer.
  handoff_urgente: "🔥 URGENTE — contestá esto primero",
  // El unico que avisa de un SILENCIO: la persona sigue escribiendo y nadie tomo la
  // conversacion, asi que el bot esta callado por una razon que dejo de ser cierta.
  handoff_sin_humano: "⏳ TE SIGUE ESCRIBIENDO y nadie lo tomó — entrá vos",
  demo_agendada: "DEMO AGENDADA — anotala",
  descarte_tras_agendar: "se cayo una demo ya agendada — liberá el horario",
  sin_horarios: "no habia horario que ofrecerle",
  // Lo emite el BARRIDO (`postdemo-run.mjs`), no el motor, y por eso no tenía etiqueta: el gate
  // que vigila esta lista derivaba su universo de `bot-engine.mjs` y sólo. Ver
  // `postdemo-avisa-por-el-canal-vivo.test.mjs`, que camina la carpeta entera.
  demo_realizada: "DEMO TERMINADA — contá cómo fue",
  // Lo emite el EJECUTOR DEL TURNO (`run-turn.mjs`), no el motor, y es el unico de esta lista
  // que existe para DESDECIR a otro: viaja en el mismo aviso que `demo_agendada`, debajo.
  [KIND_RESERVA_SIN_CONFIRMAR]: "⚠️ NO quedó agendada de verdad — acomodala vos",
  // El unico de la lista que no habla de algo que acaba de pasar, sino de algo que dejo de
  // pasar. Por eso la etiqueta dice que se pierde: sin esa palabra se lee como un informe.
  [KIND_LEAD_FRIO]: "🥶 SE ENFRIÓ — rescatalo vos o se pierde",
});

export function getAvisoTelegramConfig(env = process.env) {
  return {
    enabled: String(env.ONIA_BOT_TG_AVISO ?? "").toLowerCase() === "true",
    // Dos nombres a proposito: `TG_BOT_TOKEN` es el que ya usa el watchdog en este mismo VPS,
    // y `TELEGRAM_BOT_TOKEN` el de `/root/.hermes/.env`. Aceptar los dos evita que encender
    // esto dependa de acordarse de cual era.
    token: String(env.TG_BOT_TOKEN ?? env.TELEGRAM_BOT_TOKEN ?? "").trim() || undefined,
    chatId: String(env.TG_CHAT_ID ?? env.TELEGRAM_CHAT_ID ?? "").trim() || undefined,
  };
}

/**
 * Escapa lo que Telegram interpreta como HTML.
 *
 * NO es cosmetico y es el motivo por el que esto tiene test propio: `onia-tg.sh` manda con
 * `parse_mode=HTML`, y un `<` suelto en el texto de un prospecto hace que Telegram conteste
 * 400 y el mensaje NO LLEGUE. El aviso se perderia justo con los prospectos que escriben raro,
 * en silencio, y el sintoma seria identico al bug que estamos arreglando: "el bot prometio y
 * nadie se entero".
 */
export function escaparHtml(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Arma el aviso a partir de los efectos `notify_sergio` del turno.
 *
 * @returns {{texto:string, motivos:string[]}|null} `null` = no habia nada que avisar. Es la
 *          respuesta correcta para la enorme mayoria de los turnos: el bot contesta solo.
 */
export function construirAviso({ notify, conversationId, stageAfter, esNuestra, canal, inbox } = {}) {
  const efectos = Array.isArray(notify) ? notify.filter(Boolean) : [];
  if (efectos.length === 0) return null;

  const motivos = efectos.map((e) => String(e?.reason || e?.kind || "sin_motivo"));

  const lineas = efectos.map((efecto) => {
    const motivo = String(efecto?.reason || efecto?.kind || "sin_motivo");
    const etiqueta = ETIQUETAS[efecto?.kind] || motivo;
    const texto = String(efecto?.text ?? "").trim();
    const cabeza = `<b>${escaparHtml(etiqueta)}</b>`;
    return texto ? `${cabeza}\n${escaparHtml(texto)}` : cabeza;
  });

  // La referencia va SIN redactar y es lo primero accionable: con el numero de conversacion
  // Sergio abre la bandeja y contesta. Un aviso que no dice a quien contestarle no sirve.
  const ref = conversationId ? `conversacion ${escaparHtml(conversationId)}` : "conversacion sin id";
  const etapa = stageAfter ? ` · ${escaparHtml(stageAfter)}` : "";
  // POR DONDE contestar. El bot ya usa este mismo dato para prometerle al prospecto por que via
  // le escribe un humano (`viaDelCanal`); sin el, quien tiene que CUMPLIR esa promesa no sabe si
  // le alcanza un clic en WhatsApp o tiene que abrir la bandeja. Ausente => se omite, nunca se
  // inventa: un canal equivocado manda a contestar por donde el prospecto no escribio.
  const nombreCanal = nombreDelCanal(canal);
  // El inbox es "de que cliente es esta conversacion" (lo dice el adapter donde lo guarda). Con un
  // solo dueno es ruido util; con dos es lo unico que separa un lead propio del cliente de un
  // cliente. Se nombra siempre que venga, para que el dia que entre el segundo no haya que
  // acordarse de encenderlo.
  const hayInbox = inbox !== undefined && inbox !== null && String(inbox) !== "";
  const via = [
    nombreCanal ? escaparHtml(nombreCanal) : null,
    hayInbox ? `inbox ${escaparHtml(inbox)}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const canalTexto = via ? ` · ${via}` : "";

  const cuerpo = lineas.join("\n\n");
  const recortado = cuerpo.length > AVISO_MAX_CHARS ? `${cuerpo.slice(0, AVISO_MAX_CHARS)}…` : cuerpo;

  // La marca va ARRIBA de todo: si Sergio Urcullo lee la notificación del celular sin abrirla,
  // lo primero que ve tiene que ser que no hay nada que hacer. `esNuestra` ausente => lead.
  const cabecera = esNuestra === true ? `${ENCABEZADO_PRUEBA}\n` : "";

  return {
    texto: `${cabecera}🔔 <b>Bot Onia</b> — ${ref}${canalTexto}${etapa}\n\n${recortado}`,
    motivos,
    // La conversacion viaja tambien FUERA del texto, y no es duplicar: el texto es lo que Sergio
    // lee cuando el aviso SALE, y esto es lo unico que queda cuando NO sale. El que lo manda
    // loguea el resultado desde un callback asincrono, sin el turno a mano; sin este campo la
    // linea de un aviso perdido no dice a quien habia que atender (medido en produccion el
    // 2026-09-04: `[aviso] skipped (cuota_agotada): ...` y nada mas). Cruzarlo por proximidad
    // con la linea `conv=` del webhook miente en cuanto entran dos mensajes a la vez.
    conversationId: conversationId ?? null,
  };
}

/**
 * Manda el aviso. Devuelve SIEMPRE una promesa resuelta (nunca rechaza): esto corre despues de
 * que el prospecto ya fue atendido, y una excepcion suelta acá es un unhandled rejection, que
 * en Node mata el proceso — o sea el bot entero — por un aviso que no salio.
 *
 * @returns {Promise<{ok:boolean, status:"sent"|"skipped"|"failed", reason:string}>}
 */
export async function enviarAvisoTelegram(aviso, config = getAvisoTelegramConfig(), deps = {}) {
  if (!aviso || !aviso.texto) {
    return { ok: true, status: "skipped", reason: "nada que avisar" };
  }
  if (!config.enabled) {
    return { ok: true, status: "skipped", reason: "aviso por Telegram apagado (ONIA_BOT_TG_AVISO)" };
  }
  // Encendido sin credencial NO es "skipped": es una promesa rota en silencio, que es
  // exactamente el estado del que venimos. Tiene que salir `failed` y con nombre propio.
  if (!config.token) {
    return { ok: false, status: "failed", reason: "falta TG_BOT_TOKEN" };
  }
  if (!config.chatId) {
    return { ok: false, status: "failed", reason: "falta TG_CHAT_ID" };
  }

  const doFetch = deps.fetch || globalThis.fetch;
  if (typeof doFetch !== "function") {
    return { ok: false, status: "failed", reason: "sin fetch disponible" };
  }

  const timeoutMs = Number(deps.timeoutMs) > 0 ? Number(deps.timeoutMs) : AVISO_TIMEOUT_MS;
  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), timeoutMs);

  try {
    const respuesta = await doFetch(`https://api.telegram.org/bot${config.token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: config.chatId,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        text: aviso.texto,
      }),
      signal: control.signal,
    });

    // Telegram contesta 200 con `ok:false` en varios errores de formato. Mirar solo el codigo
    // HTTP daria por enviado un aviso que Telegram descarto: el mismo falso verde de siempre.
    let cuerpo = null;
    try {
      cuerpo = await respuesta.json();
    } catch {
      cuerpo = null;
    }

    if (!respuesta.ok || (cuerpo && cuerpo.ok === false)) {
      const detalle = cuerpo?.description ? `: ${cuerpo.description}` : "";
      return { ok: false, status: "failed", reason: `Telegram ${respuesta.status}${detalle}` };
    }

    return { ok: true, status: "sent", reason: "aviso enviado" };
  } catch (error) {
    const motivo = error?.name === "AbortError" ? `timeout ${timeoutMs}ms` : String(error?.message || error);
    return { ok: false, status: "failed", reason: motivo };
  } finally {
    clearTimeout(reloj);
  }
}

/**
 * Dispara el aviso sin esperarlo, igual que `fireN8nBotTurnEvent`. El turno ya se contesto.
 */
export function dispararAvisoTelegram(aviso, config, deps = {}, alTerminar) {
  enviarAvisoTelegram(aviso, config, deps).then(
    (resultado) => {
      if (typeof alTerminar === "function") alTerminar(resultado);
    },
    (error) => {
      if (typeof alTerminar === "function") {
        alTerminar({ ok: false, status: "failed", reason: String(error?.message || error) });
      }
    },
  );
}
