#!/usr/bin/env node
// PreToolUse hook (matcher "Agent"): exige el parametro `model` al lanzar un subagente.
// Modo por variable de entorno ONIA_SUBAGENTE_MODELO:
//   "aviso"   (default) -> stdout JSON {"systemMessage": ...} y exit 0 (stderr con exit 0 NO se ve)
//   "bloqueo"           -> bloquea la llamada (exit 2) si falta model
//   "off"               -> no hace nada
// Cualquier error interno o JSON invalido -> exit 0 (falla abierta, no bloquea todo).
// Registrar en .claude/settings.json SOLO cuando Sergio Urcullo lo apruebe (ver L03).

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const MODELOS_VALIDOS = ["haiku", "sonnet", "opus"];
const NOMBRES_TOOL = new Set(["Agent", "Task"]);

// Devuelve { code, msg } sin efectos secundarios; testeable.
export function evaluar(entrada, modo = "aviso") {
  if (modo === "off") return { code: 0, msg: "" };
  const tool = entrada && entrada.tool_name;
  if (!NOMBRES_TOOL.has(tool)) return { code: 0, msg: "" };
  const modelo = entrada.tool_input && entrada.tool_input.model;
  if (typeof modelo === "string" && modelo.trim() !== "") {
    return { code: 0, msg: "" };
  }
  const texto =
    "Subagente sin parametro model. Pasa model explicito: " +
    MODELOS_VALIDOS.join(" | ") +
    " (Haiku cuenta/verifica, Sonnet sintetiza, Opus solo riesgo o ambiguo).";
  if (modo === "bloqueo") return { code: 2, msg: "BLOQUEADO: " + texto };
  return { code: 0, msg: "AVISO: " + texto };
}

export function modoActual(env = process.env) {
  const v = (env.ONIA_SUBAGENTE_MODELO || "aviso").trim().toLowerCase();
  return ["aviso", "bloqueo", "off"].includes(v) ? v : "aviso";
}

function leerEntradaStdin() {
  try {
    return JSON.parse(readFileSync(0, "utf8"));
  } catch {
    return null;
  }
}

function autoTest() {
  const fallos = [];
  const afirmar = (nombre, cond) => {
    if (!cond) fallos.push(nombre);
  };
  const conModelo = { tool_name: "Agent", tool_input: { model: "haiku" } };
  const sinModelo = { tool_name: "Agent", tool_input: { prompt: "x" } };
  const vacio = { tool_name: "Task", tool_input: { model: "  " } };
  const otraTool = { tool_name: "Bash", tool_input: { command: "ls" } };

  afirmar("con model pasa en bloqueo", evaluar(conModelo, "bloqueo").code === 0);
  afirmar("sin model bloquea con exit 2", evaluar(sinModelo, "bloqueo").code === 2);
  afirmar("sin model avisa con exit 0 en aviso", evaluar(sinModelo, "aviso").code === 0);
  afirmar("sin model en aviso emite AVISO", evaluar(sinModelo, "aviso").msg.startsWith("AVISO"));
  afirmar("model vacio cuenta como ausente", evaluar(vacio, "bloqueo").code === 2);
  afirmar("alias Task tambien se evalua", evaluar(vacio, "bloqueo").code === 2);
  afirmar("otra tool no se toca", evaluar(otraTool, "bloqueo").code === 0);
  afirmar("off no hace nada", evaluar(sinModelo, "off").code === 0);
  afirmar("entrada nula no bloquea", evaluar(null, "bloqueo").code === 0);
  afirmar("modo invalido cae a aviso", modoActual({ ONIA_SUBAGENTE_MODELO: "raro" }) === "aviso");
  afirmar("modo bloqueo se lee", modoActual({ ONIA_SUBAGENTE_MODELO: "bloqueo" }) === "bloqueo");

  if (fallos.length) {
    console.error("SELF-TEST FALLA: " + fallos.join("; "));
    process.exit(1);
  }
  console.log("SELF-TEST OK (" + 11 + " casos)");
  process.exit(0);
}

const esMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (esMain) {
  if (process.argv.includes("--self-test")) {
    autoTest();
  } else {
    try {
      const entrada = leerEntradaStdin();
      const r = evaluar(entrada, modoActual());
      // exit 2: stderr lo ve Claude. exit 0: systemMessage lo ve el usuario (docs hooks).
      if (r.code === 2) console.error(r.msg);
      else if (r.msg) process.stdout.write(JSON.stringify({ systemMessage: r.msg }) + "\n");
      process.exit(r.code);
    } catch (err) {
      console.error("subagente-con-modelo: error interno, no bloquea: " + err.message);
      process.exit(0);
    }
  }
}
