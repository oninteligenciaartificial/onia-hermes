/*
 * Generador de plan de instalacion de ONIA Core (herramienta NUESTRA, read-only).
 * Dado un vertical (por track o por producto), emite los pasos ordenados para
 * dejarlo funcionando: tablas del core, modulos que cubren sus capabilities, y
 * que logica de @onia/core portar. Convierte la receta en un checklist mecanico
 * para abrir el core a cualquier industria. No toca repos de clientes.
 *
 * Run: node onia-core/install-plan.mjs <trackId | projectId>
 */
import { pathToFileURL } from "node:url";

import { getVerticalPack, getVerticalTrack, loadOniaCoreContract } from "./index.mjs";
import { classifyAdoptionStatus, loadAdapters, verticalReadiness } from "./report.mjs";
import { loadModules } from "./modules/index.mjs";

// Logica portable por modulo (subpaths del paquete @onia/core).
const MODULE_LOGIC = {
  commerce: ["@onia/core/modules/commerce-logic"],
  accounting: ["@onia/core/modules/accounting-logic"],
  knowledge: [],
};

const CORE_LOGIC = [
  "work-items",
  "intake",
  "roles",
  "approvals",
  "scheduling",
  "saved-view",
  "fx",
  "numbering",
];

export function buildInstallPlan(contract, modules = [], adapters = [], { projectId, trackId } = {}) {
  const target = projectId ? contract.distributionTargets.find((item) => item.projectId === projectId) : null;
  const adapter = projectId ? adapters.find((item) => item.projectId === projectId) : null;
  const resolvedTrackId = trackId ?? target?.verticalTrackId ?? adapter?.verticalTrackId ?? null;
  const track = resolvedTrackId ? getVerticalTrack(contract, resolvedTrackId) : null;
  const pack = resolvedTrackId ? getVerticalPack(contract, resolvedTrackId) : null;
  const readiness = resolvedTrackId ? verticalReadiness(contract, modules, resolvedTrackId) : null;

  // Core: si hay adapter, las entidades que aun no estan cubiertas; si no, todas.
  const corePending = adapter
    ? adapter.entityMappings.filter((mapping) => classifyAdoptionStatus(mapping.status) !== "cubierto").map((mapping) => mapping.coreEntityId)
    : contract.entities.map((entity) => entity.id);

  // Modulos que cubren las capabilities de modulo del track.
  const neededModuleIds = [];
  for (const capability of readiness?.moduleCapabilities ?? []) {
    if (capability.module && !neededModuleIds.includes(capability.module)) {
      neededModuleIds.push(capability.module);
    }
  }
  const moduleSteps = neededModuleIds.map((id) => {
    const module = modules.find((item) => item.module === id);
    return {
      module: id,
      schemaFile: module?.schemaFile ?? null,
      tables: (module?.entities ?? []).map((entity) => entity.table).filter(Boolean),
    };
  });

  // Logica a portar: la del core siempre + la de cada modulo adoptado.
  const moduleLogic = [];
  for (const id of neededModuleIds) {
    for (const logic of MODULE_LOGIC[id] ?? []) {
      if (!moduleLogic.includes(logic)) {
        moduleLogic.push(logic);
      }
    }
  }
  if (neededModuleIds.includes("commerce") && neededModuleIds.includes("accounting")) {
    moduleLogic.push("@onia/core/modules/bridge-logic");
  }

  return {
    projectId: projectId ?? null,
    trackId: resolvedTrackId,
    trackName: track?.name ?? null,
    rubro: pack?.rubro ?? null,
    ready: readiness?.ready ?? false,
    missing: readiness?.missing ?? [],
    core: {
      schemaFile: contract.schemaFiles?.[0] ?? null,
      pendingEntities: corePending,
      installedEntities: adapter?.installedEntities?.length ?? 0,
    },
    modules: moduleSteps,
    logicToPort: { core: CORE_LOGIC, modules: moduleLogic },
  };
}

export function renderInstallPlan(plan) {
  const lines = [];
  lines.push("ONIA Core - Plan de instalacion");
  lines.push("===============================");
  lines.push(`Objetivo: ${plan.projectId ?? plan.trackId ?? "?"}`);
  lines.push(`Vertical: ${plan.trackName ?? "(sin track)"}${plan.rubro ? ` (${plan.rubro})` : ""}`);
  lines.push(`Listo para instalar: ${plan.ready ? "si" : `no -> falta ${plan.missing.join(", ")}`}`);
  lines.push("");

  lines.push(`1. CORE  -> aplicar ${plan.core.schemaFile}`);
  lines.push(`     entidades a instalar: ${plan.core.pendingEntities.join(", ") || "(ninguna: ya estan)"}`);
  if (plan.core.installedEntities > 0) {
    lines.push(`     ya instaladas: ${plan.core.installedEntities}`);
  }
  lines.push("");

  lines.push("2. MODULOS -> aplicar su schema");
  if (plan.modules.length === 0) {
    lines.push("     (ninguno)");
  } else {
    for (const module of plan.modules) {
      lines.push(`   - ${module.module}: ${module.schemaFile} (${module.tables.length} tablas)`);
    }
  }
  lines.push("");

  lines.push("3. PORTAR LOGICA (importar de @onia/core, no copiar)");
  lines.push(`     core:    ${plan.logicToPort.core.join(", ")}`);
  lines.push(`     modulos: ${plan.logicToPort.modules.join(", ") || "(ninguno)"}`);
  lines.push("");

  lines.push("4. CABLEAR: intake -> WorkItem, panel/reporte, y el puente venta -> asiento si hay commerce+accounting");
  lines.push("");
  return lines.join("\n");
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const contract = loadOniaCoreContract();
  const modules = loadModules();
  const adapters = loadAdapters(contract);
  const key = process.argv[2] ?? "proveegest-electrico";
  const byProject = contract.distributionTargets.some((target) => target.projectId === key);
  const plan = buildInstallPlan(contract, modules, adapters, byProject ? { projectId: key } : { trackId: key });
  process.stdout.write(`${renderInstallPlan(plan)}\n`);
}
