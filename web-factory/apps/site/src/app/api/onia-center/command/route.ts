import { NextResponse } from "next/server";
import {
  higgsfieldQuietRule,
  operatingProjects,
  sergioStrictScheduleBlocks,
} from "@/app/onia-center/operating-source";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Endpoint interno que porta el router determinista de
// scripts/hermes_command_center.py (`handle_telegram`) para que el
// "ONIA - Telegram Command Center" de n8n deje de depender del nodo SSH roto
// (`SSH Password account`). Reemplaza el SSH por un HTTP Request node que
// apunta a `/api/onia-center/command`.
//
// Alcance: comandos DETERMINISTAS (agenda de Sergio, modos, radar, cola, CRM,
// copy, quiet Higgsfield, registro, automatizaciones, mapa proyectos, ayuda).
// Los comandos que dependen de estado del VPS (Video Lab, plan/estado semanal,
// generacion de video) devuelven una respuesta honesta que dirige al comando
// manual, en vez de fallar. Reutiliza el calendario canonico de ONIA Center.

type CommandResult = {
  ok: boolean;
  action: string;
  telegram_reply: string;
};

type CommandRequest = {
  message?: string;
  source?: string;
};

function getInternalKey() {
  return process.env.ONIA_CENTER_INTERNAL_API_KEY || process.env.ONIA_DAILY_BRIEFING_API_KEY || "";
}

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  if (authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.slice(7).trim();
  }
  return request.headers.get("x-onia-internal-key") || "";
}

function unauthorized(message: string, status = 401) {
  return NextResponse.json({ ok: false, mode: "unauthorized", message, data: null }, { status });
}

function isAuthorized(request: Request) {
  const expected = getInternalKey();
  if (!expected) {
    return {
      ok: false as const,
      response: unauthorized("Falta ONIA_CENTER_INTERNAL_API_KEY para ejecutar el command center interno.", 503),
    };
  }
  const received = getBearerToken(request);
  if (!received || received !== expected) {
    return { ok: false as const, response: unauthorized("Command center interno no autorizado.") };
  }
  return { ok: true as const };
}

function normalize(message: string) {
  return message.replace(/\s+/g, " ").trim();
}

function todayLaPaz() {
  return new Intl.DateTimeFormat("es-BO", {
    timeZone: "America/La_Paz",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date());
}

// --- Handlers deterministas (texto portado de hermes_command_center.py) ---

function sergioPlan(): CommandResult {
  const blocks = sergioStrictScheduleBlocks
    .filter((block) => ["wake", "planning", "sales", "deep_work", "meetings", "delivery", "gym", "personal", "shutdown"].includes(block.category))
    .map((block) => `- ${block.start}-${block.end} | ${block.title} | ${block.meetingPolicy}`);
  const lines = [
    `Plan Sergio hoy (${todayLaPaz()}):`,
    "Regla: proteger energia primero; vender y entregar antes de contenido.",
    "",
    "Bloques:",
    ...blocks,
    "",
    "Prioridades:",
    "1. Una accion de ventas/CRM.",
    "2. Una accion de entrega o sistema ONIA Center.",
    "3. Gym, novia o descanso protegido segun el dia.",
    "",
    "Reuniones permitidas: 11:30-12:30 y 15:30-16:30, con 15 min de buffer.",
    "Higgsfield: quiet/manual. Usa `Siguiente Video Lab` solo si quieres trabajar videos.",
  ];
  return { ok: true, action: "sergio_plan", telegram_reply: lines.join("\n") };
}

function parseHourMinutes(text: string): number | null {
  const match = text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (!match) return null;
  let hour = Number.parseInt(match[1], 10);
  const minute = Number.parseInt(match[2] || "0", 10);
  const ampm = (match[3] || "").toLowerCase();
  if (ampm === "pm" && hour < 12) hour += 12;
  if (ampm === "am" && hour === 12) hour = 0;
  return hour * 60 + minute;
}

function sergioAvailability(message: string): CommandResult {
  const minutes = parseHourMinutes(message.toLowerCase());
  if (minutes === null) {
    const lines = [
      "Disponibilidad Sergio:",
      "- Ventana 1: lunes a viernes 11:30-12:30.",
      "- Ventana 2: lunes a jueves 15:30-16:30.",
      "- Bloqueado: antes de 09:30, almuerzo, entrega 13:15-15:15, gym, novia, shutdown y dormir.",
      "",
      "Formato util: Puedo reunirme jueves 15:30?",
    ];
    return { ok: true, action: "sergio_availability", telegram_reply: lines.join("\n") };
  }

  const available = (minutes >= 11 * 60 + 30 && minutes < 12 * 60 + 30) || (minutes >= 15 * 60 + 30 && minutes < 16 * 60 + 30);
  let blockedReason = "fuera de ventanas permitidas";
  if (minutes >= 17 * 60 + 30 && minutes < 19 * 60) blockedReason = "choca con gym protegido";
  else if (minutes >= 20 * 60 && minutes < 22 * 60 + 30) blockedReason = "choca con tiempo novia/personal";
  else if (minutes >= 22 * 60 + 15 || minutes < 6 * 60 + 30) blockedReason = "choca con shutdown o dormir";
  else if (minutes >= 13 * 60 + 15 && minutes < 15 * 60 + 15) blockedReason = "choca con entrega/trabajo profundo";

  const reply = available
    ? [
        "Disponibilidad Sergio: SI, entra en ventana permitida.",
        "Regla: deja 15 min de buffer y agenda solo si es demo, cliente, cierre o diagnostico.",
        "Siguiente: agendar <titulo> | <dia> <hora>-<hora fin> | <descripcion>",
      ].join("\n")
    : [
        `Disponibilidad Sergio: NO, ${blockedReason}.`,
        "Alternativas: 11:30-12:30 o 15:30-16:30.",
        "Si es emergencia real, Sergio debe aprobarlo manualmente.",
      ].join("\n");
  return { ok: true, action: "sergio_availability", telegram_reply: reply };
}

const SERGIO_MODE_TEXT: Record<string, string[]> = {
  enfoque: [
    "Modo enfoque activo:",
    "- 45-90 min en una sola tarea.",
    "- No videos, no Higgsfield, no investigacion amplia.",
    "- Siguiente accion: escribe la tarea exacta o usa `Plan Sergio hoy`.",
  ],
  gym: [
    "Modo gym activo:",
    "- Bloque protegido 17:30-19:00.",
    "- No reuniones ni mensajes largos.",
    "- Pendientes se guardan para despues del bloque.",
  ],
  novia: [
    "Modo novia activo:",
    "- Bloque personal protegido.",
    "- No trabajo, no backlog, no Higgsfield.",
    "- Si algo es urgente, debe decir `emergencia real` y el motivo.",
  ],
  saturado: [
    "Modo carga baja:",
    "- Pausa 15 min o cierre del bloque actual.",
    "- Haz solo la proxima accion minima.",
    "- Mover para manana: contenido, investigacion amplia y Video Lab.",
    "- Prioridad: salud, venta urgente o cliente pago.",
  ],
  cierre: [
    "Cierre Sergio:",
    "- Registrar pagos, leads, tareas y bloqueos.",
    "- Elegir 3 prioridades de manana.",
    "- Apagar trabajo. No abrir Higgsfield ni nueva investigacion.",
  ],
};

function sergioMode(mode: string): CommandResult {
  const lines = SERGIO_MODE_TEXT[mode] || SERGIO_MODE_TEXT.enfoque;
  return { ok: true, action: `sergio_mode_${mode}`, telegram_reply: lines.join("\n") };
}

function creativeRadar(): CommandResult {
  const lines = [
    "Radar creativo ONIA:",
    "- Buscar hoy: IA aplicada a negocios, Reels/Shorts de demos, UGC B2B, automatizacion y casos reales.",
    "- Producir primero: 1 pieza Sergio mostrando proceso real y 1 pieza ONIA mostrando sistema.",
    "- Angulos utiles: dolor visible, antes/despues operativo, pantalla limpia, costo de seguir en Excel/WhatsApp.",
    "- No copiar creadores: extraer hook, ritmo, escenas, retencion y CTA.",
    "",
    "Ideas seguras para guardar, no producir automatico:",
    "1. Sergio: por que un sistema simple vende mas que responder a mano",
    "2. ONIA: DentalGest agenda y seguimiento | pedir demo corta",
    "3. ONIA: Gesti-OS convierte Excel en tablero operativo | ver tablero simple",
    "4. Prepara consultoria ONIA: clinica dental | agenda, seguimiento y captacion",
    "",
    "Si quieres producir video, pide manualmente: Siguiente Video Lab o Genera video Sergio: <idea>.",
  ];
  return { ok: true, action: "creative_radar", telegram_reply: lines.join("\n") };
}

function dailyContentQueue(): CommandResult {
  const lines = [
    "Cola diaria de contenido ONIA:",
    "1. Sergio: pieza fundador/proceso. Prioridad: confianza y construccion real.",
    "   Accion segura: guardar idea en ONIA Center o escribir hook corto.",
    "2. ONIA: pieza demo/sistema. Prioridad: vender DentalGest, Gesti-OS o automatizacion.",
    "   Accion segura: preparar guion o carrusel, no generar video automaticamente.",
    "3. Cliente/servicio: si hay prospecto caliente, preparar UGC seguro.",
    "   Accion segura: brief interno con aprobacion antes de Video Lab.",
    "4. Reutilizacion: convertir una pieza aprobada en caption IG, TikTok, Shorts y LinkedIn.",
    "",
    "Regla: Higgsfield queda manual/quiet. No genera, no publica y no contacta sin aprobacion.",
    "",
    'Estado detallado de Video Lab: usar el comando "Siguiente Video Lab" (requiere Video Lab en el VPS).',
  ];
  return { ok: true, action: "daily_content_queue", telegram_reply: lines.join("\n") };
}

function crmFollowups(): CommandResult {
  const lines = [
    "Seguimientos ONIA hoy:",
    "- Revisar CRM/Notion: prospectos con siguiente contacto vencido o caliente.",
    "- Preparar mensaje humano por canal; no enviar automatico.",
    "- Registrar vendedor_origen, responsable_actual, estado, proximo paso y fecha.",
    "- Prioridad: DentalGest clinicas, Gesti-OS pymes con Excel, webs sin captacion, auditorias y n8n simple.",
    "",
    "Comandos utiles:",
    "Prepara venta DentalGest: <clinica>",
    "Prepara venta Gestios: <empresa>",
    "Prepara venta Web ONIA: <negocio>",
    "Prepara consultoria ONIA: <negocio> | <dolor o proceso>",
  ];
  return { ok: true, action: "crm_followups_today", telegram_reply: lines.join("\n") };
}

function quietVideoReply(kind: string): CommandResult {
  const lines = [
    `${kind}: modo quiet activo.`,
    "No voy a empujar Higgsfield ni Video Lab por horario.",
    "Esto evita quemar tokens/atencion sin decision activa de producir.",
    "",
    "Comandos manuales permitidos:",
    ...higgsfieldQuietRule.allowedCommands.map((command) => `- ${command}`),
  ];
  return { ok: true, action: `${kind.toLowerCase().replace(/ /g, "_")}_quiet`, telegram_reply: lines.join("\n") };
}

function platformCopyQueue(): CommandResult {
  const lines = [
    "Platform Copy Queue:",
    "- Instagram: caption con hook, valor, CTA y 3-8 hashtags utiles.",
    "- TikTok: descripcion corta, lenguaje directo, CTA simple.",
    "- YouTube Shorts: titulo claro + descripcion con contexto y tags.",
    "- LinkedIn: aprendizaje/negocio, no solo promo.",
    "- WhatsApp automatico sigue bloqueado hasta verificacion Meta.",
    "",
    'Piezas listas para adaptar: usar "Siguiente Video Lab" (requiere Video Lab en el VPS).',
  ];
  return { ok: true, action: "platform_copy_queue", telegram_reply: lines.join("\n") };
}

function notionOutboxStatus(): CommandResult {
  const lines = [
    "Registro Hermes:",
    "- Outbox local en el VPS: /root/.hermes/notion-outbox/command-center-events.jsonl",
    "- n8n todavia no tiene credencial Notion; por eso no sincronizo directo.",
    "- Cuando exista credencial Notion en n8n, crear workflow: outbox -> Notion CRM/Tareas/Reportes.",
  ];
  return { ok: true, action: "notion_outbox_status", telegram_reply: lines.join("\n") };
}

function automationStatus(): CommandResult {
  const lines = [
    "Automatizaciones ONIA:",
    "- Activo: ONIA Center briefing diario, Cal.com booking, recordatorios y monitor de salud n8n.",
    "- Activo: intakes de cliente/produccion por formulario.",
    "- Quiet/pausado: Scheduled Operations Pack, Mara Daily, demo diario y briefing de agenda duplicado.",
    "- Regla: n8n agenda y registra; Hermes decide; Sergio aprueba.",
    "- Pendiente tecnico: credencial Notion en n8n y firma del webhook Cal.",
  ];
  return { ok: true, action: "automation_status", telegram_reply: lines.join("\n") };
}

function contentFactoryStatus(): CommandResult {
  const lines = [
    "Fabrica de contenido ONIA:",
    "1. Ideas: radar creativo + solicitudes por Telegram.",
    "2. Brief: Video Lab crea hook, guion, escenas, caption y prompt Higgsfield.",
    "3. Aprobacion: Sergio aprueba el brief antes de generar.",
    "4. Generacion: Higgsfield renderiza; se guarda URL publica.",
    "5. Revision: Sergio revisa MP4.",
    "6. Publicacion: solo con Publicar video <job_id>.",
    "",
    "Modo actual: Higgsfield manual/quiet. Usa Video Lab solo cuando quieras producir.",
  ];
  return { ok: true, action: "content_factory_status", telegram_reply: lines.join("\n") };
}

function projectMap(): CommandResult {
  const lines = ["Mapa proyectos ONIA:"];
  for (const project of operatingProjects) {
    lines.push(`- ${project.name}: ${project.description}`);
  }
  lines.push(
    "",
    "Comandos utiles:",
    "Prepara venta DentalGest: <clinica>",
    "Prepara venta Gestios: <empresa>",
    "Prepara venta Web ONIA: <negocio>",
    "Prepara consultoria ONIA: <negocio> | <dolor o proceso>",
  );
  return { ok: true, action: "project_map", telegram_reply: lines.join("\n") };
}

function helpReply(): CommandResult {
  const lines = [
    "Hermes Command Center - comandos:",
    "Plan Sergio hoy",
    "Puedo reunirme <dia> <hora>?",
    "Modo enfoque / Modo gym / Modo novia / Estoy saturado / Cierre Sergio",
    "Mapa proyectos ONIA",
    "Automatizaciones ONIA",
    "Fabrica contenido ONIA",
    "Radar creativo ONIA",
    "Cola contenido diaria",
    "Seguimientos ONIA hoy",
    "Platform Copy Queue",
    "Recordatorios Video Lab detalle",
    "Watcher Higgsfield detalle",
    "Registro Hermes",
    "Siguiente Video Lab (requiere Video Lab en el VPS)",
    "Estado Semana / Plan Semana (requiere Hermes en el VPS)",
  ];
  return { ok: true, action: "help", telegram_reply: lines.join("\n") };
}

// Comandos que dependen de estado o scripts del VPS: respuesta honesta, no error.
function vpsPending(action: string, what: string): CommandResult {
  const lines = [
    `${what}: este comando necesita el estado en vivo desde el VPS (Video Lab / Hermes) y todavia no esta expuesto por HTTP en ONIA Center.`,
    "Por ahora se maneja manual en el VPS. Cuando el router de Video Lab / plan semanal tenga endpoint, este comando se conecta aca.",
  ];
  return { ok: true, action, telegram_reply: lines.join("\n") };
}

function routeMessage(rawMessage: string): CommandResult {
  const normalized = normalize(rawMessage);
  const lower = normalized.toLowerCase();

  if (!normalized) return helpReply();

  if (lower.startsWith("/agendar") || lower.startsWith("agendar ")) {
    return {
      ok: true,
      action: "agendar_hint",
      telegram_reply:
        "Para agendar usa el flujo /agendar de n8n (crea el evento en Google Calendar directo).\nFormato: /agendar Titulo | dia hora-inicio-hora-fin | descripcion",
    };
  }

  if (lower.startsWith("plan sergio") || lower.startsWith("agenda sergio") || lower.startsWith("calendario sergio")) return sergioPlan();
  if (lower.startsWith("puedo reunirme") || lower.startsWith("disponibilidad sergio")) return sergioAvailability(normalized);
  if (lower.startsWith("modo enfoque")) return sergioMode("enfoque");
  if (lower.startsWith("modo gym")) return sergioMode("gym");
  if (lower.startsWith("modo novia")) return sergioMode("novia");
  if (lower.startsWith("estoy saturado") || lower.startsWith("modo saturado")) return sergioMode("saturado");
  if (lower.startsWith("cierre sergio")) return sergioMode("cierre");

  if (lower === "ayuda hermes" || lower === "help" || lower === "/help" || lower === "/start") return helpReply();
  if (lower.startsWith("mapa proyectos onia")) return projectMap();
  if (lower.startsWith("automatizaciones onia") || lower.startsWith("estado n8n")) return automationStatus();
  if (lower.startsWith("fabrica contenido onia") || lower.startsWith("fabrica higgsfield")) return contentFactoryStatus();
  if (lower.startsWith("radar creativo onia") || lower.startsWith("radar diario onia")) return creativeRadar();
  if (lower.startsWith("cola contenido diaria") || lower.startsWith("cola diaria contenido") || lower.startsWith("contenido diario onia")) return dailyContentQueue();
  if (lower.startsWith("seguimientos onia hoy") || lower.startsWith("crm follow-up") || lower.startsWith("seguimiento crm")) return crmFollowups();
  if (lower.startsWith("recordatorios video lab") || lower.startsWith("aprobaciones video lab")) return quietVideoReply("Recordatorios Video Lab");
  if (lower.startsWith("watcher higgsfield") || lower.startsWith("estado higgsfield")) return quietVideoReply("Watcher Higgsfield");
  if (lower.startsWith("platform copy queue") || lower.startsWith("copy plataformas") || lower.startsWith("descripciones plataformas")) return platformCopyQueue();
  if (lower.startsWith("registro hermes") || lower.startsWith("notion outbox")) return notionOutboxStatus();

  // VPS-dependientes: degradar con gracia.
  if (lower.startsWith("estado semana") || lower.startsWith("estado hermes")) return vpsPending("weekly_status", "Estado Semana");
  if (lower.startsWith("plan semana") || lower.startsWith("plan hoy") || lower.startsWith("plan ")) return vpsPending("weekly_plan", "Plan Semana");
  if (lower.startsWith("siguiente video lab") || lower.startsWith("estado video lab")) return vpsPending("video_lab", "Video Lab");
  if (
    lower.startsWith("crea avatar sergio") ||
    lower.startsWith("avatar sergio") ||
    lower.startsWith("genera video sergio") ||
    lower.startsWith("genera reel onia") ||
    lower.startsWith("crea video cliente") ||
    lower.startsWith("aprobar video") ||
    lower.startsWith("publicar video")
  ) {
    return vpsPending("video_router", "Video Lab");
  }

  const fallback = helpReply();
  return {
    ok: false,
    action: "unsupported_command",
    telegram_reply: "No reconozco ese comando todavia.\n\n" + fallback.telegram_reply,
  };
}

export async function POST(request: Request) {
  const authorization = isAuthorized(request);
  if (!authorization.ok) {
    return authorization.response;
  }

  let payload: CommandRequest = {};
  try {
    payload = (await request.json()) as CommandRequest;
  } catch {
    return NextResponse.json({ ok: false, mode: "bad_request", message: "El cuerpo debe ser JSON valido.", data: null }, { status: 400 });
  }

  const message = typeof payload.message === "string" ? payload.message : "";
  const result = routeMessage(message);

  return NextResponse.json({
    ok: result.ok,
    mode: "command_router",
    action: result.action,
    telegram_reply: result.telegram_reply,
    source: payload.source || "n8n",
    data: result,
  });
}
