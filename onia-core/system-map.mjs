/*
 * ONIA Core - Mapa del sistema en 4 capas, en una sola vista:
 *   1. CORE       -> lo que TODA empresa real necesita (entidades/capabilities).
 *   2. RUBROS     -> cada vertical (pack de vocabulario + funciones propias
 *                     que viven en el producto, nunca en el core).
 *   3. MODULOS    -> que modulos (commerce/accounting/invoicing/payroll/
 *                     knowledge) necesita cada rubro.
 *   4. REPETICION -> que modulos usan VARIOS rubros a la vez (eso es lo que
 *                     justifica que vivan compartidos en un modulo en vez de
 *                     duplicarse rubro por rubro).
 *
 * Read-only. Reutiliza report.mjs (buildCoreReport) y vertical-extensions.mjs;
 * no duplica su logica, solo la combina.
 *
 * Run: node onia-core/system-map.mjs
 */
import { pathToFileURL } from "node:url";

import { loadOniaCoreContract } from "./index.mjs";
import { buildCoreReport, loadAdapters } from "./report.mjs";
import { loadModules } from "./modules/index.mjs";
import { getVerticalExtensionEntities, loadVerticalExtensions } from "./vertical-extensions.mjs";

export function buildSystemMap(contract, modules, adapters, extensionsCatalog) {
  const coreReport = buildCoreReport(contract, adapters, modules);
  const coreCapabilities = contract.capabilities.filter((capability) => capability.layer === "core");

  const rubros = coreReport.tracks.map((track) => {
    const moduleIdsFromCoreSlots = track.moduleCapabilities.map((capability) => capability.module).filter(Boolean);
    const moduleIds = [...new Set([...moduleIdsFromCoreSlots, ...track.providedModules])].sort();
    const extensionEntities = getVerticalExtensionEntities(extensionsCatalog, track.id);
    return {
      id: track.id,
      name: track.name,
      rubro: track.pack?.rubro ?? null,
      status: track.status,
      moduleIds,
      blocked: track.blocked,
      verticalExtensionIds: extensionEntities.map((entity) => entity.id),
    };
  });

  const moduleUsage = modules
    .map((module) => {
      const usedBy = rubros.filter((rubro) => rubro.moduleIds.includes(module.module)).map((rubro) => rubro.id);
      return { moduleId: module.module, usedByCount: usedBy.length, usedBy };
    })
    .sort((a, b) => b.usedByCount - a.usedByCount || a.moduleId.localeCompare(b.moduleId));

  return {
    core: {
      entityCount: contract.entities.length,
      capabilityCount: coreCapabilities.length,
      capabilityIds: coreCapabilities.map((capability) => capability.id),
    },
    rubros,
    moduleUsage,
  };
}

/** Modulos usados por 2 o mas rubros: la senal real de "esto va compartido, no duplicado". */
export function sharedModules(map, minRubros = 2) {
  return map.moduleUsage.filter((usage) => usage.usedByCount >= minRubros);
}

/** Modulos que NINGUN rubro usa todavia (huerfanos del catalogo). */
export function unusedModules(map) {
  return map.moduleUsage.filter((usage) => usage.usedByCount === 0);
}

export function renderSystemMap(map) {
  const lines = [];
  lines.push("ONIA Core - Mapa del sistema (core -> rubro -> modulos -> repeticion)");
  lines.push("========================================================================");
  lines.push("");
  lines.push("1. CORE (lo que TODA empresa real necesita, sin importar el rubro)");
  lines.push(`   ${map.core.entityCount} entidades, ${map.core.capabilityCount} capabilities:`);
  lines.push(`   ${map.core.capabilityIds.join(", ")}`);
  lines.push("");

  lines.push("2-3. RUBROS y los MODULOS que necesita cada uno");
  for (const rubro of map.rubros) {
    lines.push(`   - ${rubro.name}  [${rubro.status}]`);
    lines.push(`       modulos: ${rubro.moduleIds.join(", ") || "(ninguno)"}`);
    lines.push(`       funciones propias del rubro (fuera del core): ${rubro.verticalExtensionIds.length}${rubro.verticalExtensionIds.length ? ` (${rubro.verticalExtensionIds.slice(0, 3).join(", ")}${rubro.verticalExtensionIds.length > 3 ? ", ..." : ""})` : ""}`);
    if (rubro.blocked.length > 0) {
      lines.push(`       bloqueado (external_gate): ${rubro.blocked.join(", ")}`);
    }
  }
  lines.push("");

  lines.push("4. QUE RUBROS REPITEN EL MISMO MODULO (valida por que vive compartido, no duplicado)");
  for (const usage of map.moduleUsage) {
    const share = `${usage.usedByCount}/${map.rubros.length}`;
    lines.push(`   - ${usage.moduleId}: usado por ${share} rubros (${usage.usedBy.join(", ") || "ninguno"})`);
  }
  lines.push("");

  const unused = unusedModules(map);
  if (unused.length > 0) {
    lines.push(`ATENCION: ${unused.map((u) => u.moduleId).join(", ")} no lo usa NINGUN rubro todavia -> revisar si es intencional.`);
  }

  return lines.join("\n");
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const contract = loadOniaCoreContract();
  const modules = loadModules();
  const adapters = loadAdapters(contract);
  const extensionsCatalog = loadVerticalExtensions();
  const map = buildSystemMap(contract, modules, adapters, extensionsCatalog);
  process.stdout.write(`${renderSystemMap(map)}\n`);
}
