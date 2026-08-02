// ONIA — Chatbot propio: SIMULADOR / PROBADOR.
// Corre la conversacion entera por CLI, sin WhatsApp, sin Telegram y sin tocar la base.
// Es el "/probador-bot" de la spec §3.5: mostrale al cliente que responde ANTES de encenderlo.
//
//   node simulate.mjs --all                        los 8 guiones de prueba de la spec (fase 1)
//   node simulate.mjs --script 1-feliz             un guion
//   node simulate.mjs --list                       lista los guiones
//   node simulate.mjs                              modo interactivo (escribis vos, corta con /salir)
//   node simulate.mjs --all --slots "jueves 15:00|viernes 10:00"   con horarios de prueba
//   node simulate.mjs --all --json                 salida maquina (para diffs / CI)
//
// Los horarios por defecto son el PLACEHOLDER de config.mjs: Sergio todavia no definio los 2
// bloques semanales. Con --slots se pasan horarios de prueba para ver el guion completo.
// Spec: hermes-content/docs/ONIA_CHATBOT_PROPIO_SPEC_20260725.md §6 (via A).

import readline from "node:readline";
import { createBotConfig, DEFAULT_CONFIG } from "./config.mjs";
import { createState, step, markHumanTakeover, buildFollowUp, LLM_PENDING } from "./bot-engine.mjs";

// ---------------------------------------------------------------------------
// Los 10 guiones de prueba (spec §8, fase 1 + rama por rubro y soporte)
// ---------------------------------------------------------------------------

const SCRIPTS = {
  "1-feliz": {
    title: "Camino feliz — califica, elige horario y agenda",
    startAt: "2026-07-27T14:05:00Z", // lunes 10:05 en La Paz: dentro de horario
    turns: [
      { text: "DEMO" },
      { text: "Tengo una ferreteria, somos 5 y estoy en Santa Cruz" },
      { text: "A" },
      { text: "la agenda" },
    ],
  },
  "2-precio": {
    title: "Pregunta el precio — el bot NUNCA cotiza (M4)",
    startAt: "2026-07-27T14:05:00Z",
    turns: [
      { text: "hola, cuanto cuesta?" },
      { text: "tengo un restaurante, somos 8, cochabamba" },
      { text: "y el precio final cual es? vi los 750 bs" },
      { text: "B" },
    ],
  },
  "3-siat": {
    title: "Pregunta por SIAT/facturacion — respuesta segura + fuera de horario (M7)",
    startAt: "2026-07-28T03:30:00Z", // lunes 23:30 en La Paz: fuera de horario
    turns: [
      { text: "DEMO" },
      { text: "ya emite factura al SIAT?" },
      { text: "tengo una peluqueria, trabajo sola, en tarija" },
    ],
  },
  "4-descalificado": {
    title: "Descarte cortes — no es un negocio (M1c)",
    startAt: "2026-07-27T14:05:00Z",
    turns: [
      { text: "DEMO" },
      { text: "soy estudiante todavia, busco trabajo, les mando mi cv?" },
    ],
  },
  "5-offscript": {
    title: "Dos malentendidos seguidos — el bot entrega la conversacion (M5)",
    startAt: "2026-07-27T14:05:00Z",
    turns: [
      { text: "DEMO" },
      { text: "mmm depende" },
      { text: "y bueno vos que decis" },
    ],
  },
  "6-optout": {
    title: "Opt-out (M6), silencio total, y reapertura solo con DEMO",
    startAt: "2026-07-27T14:05:00Z",
    turns: [
      { text: "DEMO" },
      { text: "STOP" },
      { text: "hola? estas ahi?" },
      { text: "DEMO" },
    ],
  },
  "7-audio": {
    title: "Nota de voz — sin transcripcion pide texto; con transcripcion sigue el embudo",
    startAt: "2026-07-27T14:05:00Z",
    turns: [
      { text: "DEMO" },
      { kind: "voice", transcript: "" },
      { kind: "voice", transcript: "si tenemos una panaderia, somos 3 personas aca en la paz" },
      { text: "opcion A" },
    ],
  },
  "8-humano": {
    title: "Sergio contesta — el bot se calla PARA SIEMPRE en esa conversacion",
    startAt: "2026-07-27T14:05:00Z",
    turns: [
      { text: "DEMO" },
      { op: "human_takeover" },
      { text: "hola? me decias?" },
      { text: "tengo una ferreteria, somos 5, santa cruz" },
    ],
  },
  "9-rama-dental": {
    title: "Ramificacion por rubro — odontologia es el unico que suma la pregunta de los sillones",
    startAt: "2026-07-27T14:05:00Z",
    turns: [
      { text: "DEMO" },
      { text: "soy dentista, somos 4 en la clinica, en cochabamba" },
      { text: "3" },
      { text: "A" },
    ],
  },
  "10-soporte": {
    title: "Segundo camino — YA es cliente: soporte y humano, NUNCA la demo comercial",
    startAt: "2026-07-27T14:05:00Z",
    turns: [
      { text: "DEMO" },
      { text: "ya soy cliente y el sistema no me anda, como configuro los recordatorios?" },
    ],
  },
};

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { script: null, all: false, list: false, json: false, slots: null, contact: "test-01" };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--all") args.all = true;
    else if (arg === "--list") args.list = true;
    else if (arg === "--json") args.json = true;
    else if (arg === "--script") args.script = argv[++index];
    else if (arg === "--slots") args.slots = argv[++index];
    else if (arg === "--contact") args.contact = argv[++index];
  }
  return args;
}

function buildConfig(args) {
  if (!args.slots) return DEFAULT_CONFIG;
  const [labelA, labelB] = String(args.slots).split("|").map((part) => part.trim());
  return createBotConfig({
    slots: [
      { key: "A", label: labelA || "opción A", startAt: null, pending: false },
      { key: "B", label: labelB || "opción B", startAt: null, pending: false },
    ],
  });
}

function plusMinutes(iso, minutes) {
  return new Date(Date.parse(iso) + minutes * 60000).toISOString();
}

function describeTurn(turn) {
  if (turn.op === "human_takeover") return "[SERGIO responde por su cuenta]";
  if (turn.kind === "voice") return turn.transcript ? `[audio] ${turn.transcript}` : "[audio ilegible]";
  if (turn.kind === "attachment") return "[archivo adjunto]";
  return turn.text;
}

function indent(text) {
  return String(text)
    .split("\n")
    .map((line) => `      ${line}`)
    .join("\n");
}

function runScript(name, config) {
  const script = SCRIPTS[name];
  const events = [];
  let state = createState({ channel: "sim", contactRef: `sim-${name}`, pieceKey: "lucia-d03-reel-siat", sourceCampaign: "lucia-dentalgest-jul2026" });
  let clock = script.startAt;

  for (const turn of script.turns) {
    if (turn.op === "human_takeover") {
      state = markHumanTakeover(state, clock);
      events.push({ turn: describeTurn(turn), stageBefore: state.botStage, stageAfter: state.botStage, replies: [], notes: ["human_took_over=true"], sideEffects: [] });
      clock = plusMinutes(clock, 2);
      continue;
    }
    const stageBefore = state.botStage;
    const result = step(state, { ...turn, receivedAt: clock, externalMessageId: `${name}-${events.length}` }, { config });
    state = result.nextState;
    events.push({
      turn: describeTurn(turn),
      stageBefore,
      stageAfter: state.botStage,
      replies: result.replies,
      notes: result.notes,
      sideEffects: result.sideEffects.map((effect) => effect.type),
    });
    clock = plusMinutes(clock, 2);
  }

  // Al cierre: ¿corresponde el follow-up unico 22 h despues?
  const followUp = buildFollowUp(state, plusMinutes(clock, 22 * 60), config);
  return { name, title: script.title, events, finalState: state, followUp };
}

function printScript(run) {
  console.log(`\n${"=".repeat(78)}`);
  console.log(`GUION ${run.name} — ${run.title}`);
  console.log("=".repeat(78));
  for (const event of run.events) {
    console.log(`\n  > PROSPECTO: ${event.turn}`);
    if (event.stageBefore !== event.stageAfter) console.log(`    [estado] ${event.stageBefore} -> ${event.stageAfter}`);
    if (event.replies.length === 0) console.log("    (el bot NO responde)");
    for (const reply of event.replies) {
      const guardrail = reply.guardrail && !reply.guardrail.ok ? ` guardrail=BLOQUEADO(${reply.guardrail.violations.join(",")})` : "";
      console.log(`    [bot ${reply.templateKey} · ${reply.replySource} · ${reply.deliveryStatus}${guardrail}]`);
      if (reply.text === LLM_PENDING) {
        console.log(indent("(rama LLM: sin cliente de LLM inyectado. El ejecutor llama al modelo,"));
        console.log(indent(" pasa el texto por enforceGuardrails() y si falla usa este fallback:)"));
        console.log(indent(`FALLBACK: ${reply.fallbackText}`));
      } else {
        console.log(indent(reply.text));
      }
    }
    if (event.sideEffects.length) console.log(`    [efectos] ${event.sideEffects.join(", ")}`);
    if (event.notes.length) console.log(`    [notas] ${event.notes.join(", ")}`);
  }
  const state = run.finalState;
  console.log(`\n  ---- estado final --------------------------------------------------------`);
  console.log(`  bot_stage=${state.botStage} · qualification=${JSON.stringify(state.qualification)}`);
  console.log(`  scheduled_label=${state.scheduledLabel || "null"} · human_took_over=${state.humanTookOver} · opt_out_at=${state.optOutAt || "null"}`);
  console.log(`  off_script_count=${state.offScriptCount} · qualify_asks=${state.qualifyAsks} · followup_step=${state.followupStep}`);
  console.log(`  follow-up 22 h despues: ${run.followUp ? "SI (M3)" : "no corresponde"}`);
}

async function interactive(config, contactRef) {
  let state = createState({ channel: "sim", contactRef });
  let clock = "2026-07-27T14:05:00Z";
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: "vos > " });
  console.log("Simulador del chatbot de ONIA. Escribi 'DEMO' para arrancar. '/salir' para terminar,");
  console.log("'/humano' para simular que Sergio contesta, '/estado' para ver la fila.\n");
  rl.prompt();
  for await (const line of rl) {
    const text = line.trim();
    if (text === "/salir") break;
    if (text === "/estado") {
      console.log(JSON.stringify(state, null, 2));
      rl.prompt();
      continue;
    }
    if (text === "/humano") {
      state = markHumanTakeover(state, clock);
      console.log("  [Sergio tomó la conversación: el bot se calla]");
      rl.prompt();
      continue;
    }
    const result = step(state, { text, receivedAt: clock }, { config });
    state = result.nextState;
    clock = plusMinutes(clock, 2);
    if (result.replies.length === 0) console.log("  (el bot NO responde)");
    for (const reply of result.replies) {
      console.log(`  [${reply.templateKey}]`);
      console.log(indent(reply.text === LLM_PENDING ? reply.fallbackText : reply.text));
    }
    if (result.notes.length) console.log(`  [notas] ${result.notes.join(", ")}`);
    rl.prompt();
  }
  rl.close();
}

const args = parseArgs(process.argv.slice(2));
const config = buildConfig(args);

if (args.list) {
  for (const [name, script] of Object.entries(SCRIPTS)) console.log(`${name.padEnd(18)} ${script.title}`);
} else if (args.all || args.script) {
  const names = args.all ? Object.keys(SCRIPTS) : [args.script];
  const runs = names.map((name) => {
    if (!SCRIPTS[name]) {
      console.error(`guion desconocido: ${name}. Probá --list`);
      process.exit(1);
    }
    return runScript(name, config);
  });
  if (args.json) console.log(JSON.stringify(runs, null, 2));
  else runs.forEach(printScript);
} else {
  await interactive(config, args.contact);
}
