/*
 * Resolver del diagnostico de negocio (logica pura + loader). Toma las
 * respuestas del cuestionario (business-diagnostic.json) y determina rubro
 * (track) + nivel de tamano (tier) + modulos adicionales pedidos, reusando
 * business-tiers.mjs. No decide nada por su cuenta cuando no hay certeza: si
 * ningun nivel alcanza, devuelve null (revision humana), no un upsell forzado.
 *
 * Run: node onia-core/business-diagnostic.mjs   (usa respuestas de ejemplo)
 */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

import { getFamilyForVerticalTrack, loadBusinessTiers, recommendTierForLimits } from "./business-tiers.mjs";

export function loadBusinessDiagnostic(fileUrl = new URL("./business-diagnostic.json", import.meta.url)) {
  return JSON.parse(readFileSync(fileUrl, "utf8"));
}

export function getQuestion(diagnostic, questionId) {
  return diagnostic.questions.find((question) => question.id === questionId);
}

function selectedOption(question, answerValue) {
  return question?.options.find((option) => option.value === answerValue);
}

/** Resuelve el trackId a partir de la respuesta de la pregunta "rubro". */
export function resolveTrackId(diagnostic, answers = {}) {
  const option = selectedOption(getQuestion(diagnostic, "rubro"), answers.rubro);
  return option?.trackId ?? null;
}

/** Combina las senales de limite (maxUsers/maxSucursales/maxBridges) de todas las respuestas. */
export function collectLimitSignals(diagnostic, answers = {}) {
  const signals = {};
  for (const question of diagnostic.questions) {
    const option = selectedOption(question, answers[question.id]);
    for (const [key, value] of Object.entries(option?.signal ?? {})) {
      signals[key] = Math.max(signals[key] ?? 0, value);
    }
  }
  return signals;
}

/** Modulos que las respuestas piden explicitamente (facturacion electronica, planilla, etc). */
export function collectRequiredModules(diagnostic, answers = {}) {
  const modules = new Set();
  for (const question of diagnostic.questions) {
    const option = selectedOption(question, answers[question.id]);
    if (option?.requiresModule) {
      modules.add(option.requiresModule);
    }
  }
  return [...modules];
}

/**
 * Resuelve el diagnostico completo: trackId, familia, nivel recomendado, y
 * modulos pedidos explicitamente que el nivel recomendado no traiga ya.
 */
export function resolveDiagnostic(diagnostic, tiersDoc, answers = {}) {
  const trackId = resolveTrackId(diagnostic, answers);
  if (!trackId) {
    return { trackId: null, familyId: null, tierId: null, tierName: null, recommendedModules: [], extraModules: [] };
  }

  const family = getFamilyForVerticalTrack(tiersDoc, trackId);
  const signals = collectLimitSignals(diagnostic, answers);
  const tier = family ? recommendTierForLimits(tiersDoc, family.id, signals) : null;
  const tierModuleIds = (tier?.modules ?? []).map((module) => module.id);
  const requestedModules = collectRequiredModules(diagnostic, answers);
  const extraModules = requestedModules.filter((moduleId) => !tierModuleIds.includes(moduleId));

  return {
    trackId,
    familyId: family?.id ?? null,
    tierId: tier?.id ?? null,
    tierName: tier?.name ?? null,
    recommendedModules: tierModuleIds,
    extraModules,
  };
}

export function renderDiagnosticResult(result) {
  const lines = [];
  lines.push("ONIA Business Diagnostic - Resultado");
  lines.push("=====================================");
  if (!result.trackId) {
    lines.push("No se pudo determinar el rubro con las respuestas dadas.");
    return lines.join("\n");
  }
  lines.push(`Rubro: ${result.trackId}`);
  lines.push(
    result.tierId
      ? `Nivel recomendado: ${result.tierName} (familia ${result.familyId})`
      : "Nivel: NINGUNO de la familia alcanza los limites indicados -> revision humana/comercial.",
  );
  if (result.recommendedModules.length > 0) {
    lines.push(`Modulos incluidos en el nivel: ${result.recommendedModules.join(", ")}`);
  }
  if (result.extraModules.length > 0) {
    lines.push(`Modulos pedidos que el nivel no trae de forma titular (agregar): ${result.extraModules.join(", ")}`);
  }
  return lines.join("\n");
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const diagnostic = loadBusinessDiagnostic();
  const tiersDoc = loadBusinessTiers();
  const demoAnswers = {
    rubro: "clinica_dental",
    empleados: "4_8",
    sucursales: "1",
    sistemas_propios: "no",
    facturacion_electronica: "pronto",
    empleados_formales: "si",
  };
  const result = resolveDiagnostic(diagnostic, tiersDoc, demoAnswers);
  process.stdout.write(`${renderDiagnosticResult(result)}\n`);
}
