/*
 * ONIA Core readiness report. Lee el contrato + adapters e imprime una foto en
 * lenguaje simple: qué verticales existen (track + pack de rubro) y cuánto del
 * core lleva instalado cada producto.
 *
 * Read-only: no toca el contrato ni el schema ni los adapters.
 * Run: node onia-core/report.mjs
 *
 * La clasificacion de adopcion es transparente (ver classifyAdoptionStatus) y se
 * basa en el status de cada entityMapping del adapter, que es la senal mas
 * concreta (una tabla existe o no). No inventa un "% listo" unico.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  getTrackReadiness,
  getVerticalPack,
  getVerticalPacks,
  loadOniaCoreContract,
} from "./index.mjs";
import { loadModules } from "./modules/index.mjs";

const oniaCoreDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(oniaCoreDir, "..");

const ADOPTION_LABELS = {
  cubierto: "cubierto",
  parcial: "parcial",
  dominio: "en dominio propio",
  pendiente: "pendiente",
};

export function loadAdapters(contract) {
  return (contract.adapterFiles ?? []).map((file) =>
    JSON.parse(readFileSync(resolve(repoRoot, file), "utf8")),
  );
}

export function classifyAdoptionStatus(status) {
  const value = String(status ?? "").toLowerCase();
  if (value.includes("partial")) return "parcial";
  if (value.includes("installing")) return "parcial";
  if (value.includes("installed")) return "cubierto";
  if (value === "exists") return "cubierto";
  if (value.includes("domain")) return "dominio";
  return "pendiente";
}

export function summarizeMappings(mappings = []) {
  const summary = { cubierto: 0, parcial: 0, dominio: 0, pendiente: 0, total: 0 };
  for (const mapping of mappings) {
    summary[classifyAdoptionStatus(mapping.status)] += 1;
    summary.total += 1;
  }
  return summary;
}

export function buildCoreReport(contract, adapters = [], modules = []) {
  const capabilityLayerById = new Map(contract.capabilities.map((capability) => [capability.id, capability.layer]));
  const moduleLayers = new Set(["activatable_module", "vertical_extension"]);
  const moduleByCapability = new Map();
  for (const module of modules) {
    for (const capabilityId of module.activatesCapabilities ?? []) {
      if (!moduleByCapability.has(capabilityId)) {
        moduleByCapability.set(capabilityId, module.module);
      }
    }
  }

  const tracks = contract.verticalTracks.map((track) => {
    const readiness = getTrackReadiness(contract, track.id);
    const pack = getVerticalPack(contract, track.id);
    const moduleCapabilities = track.requiredCapabilityIds
      .filter((capabilityId) => moduleLayers.has(capabilityLayerById.get(capabilityId)))
      .map((capabilityId) => ({ id: capabilityId, module: moduleByCapability.get(capabilityId) ?? null }));
    return {
      id: track.id,
      name: track.name,
      status: track.status,
      requiredCount: readiness?.requiredCount ?? 0,
      coreCount: readiness?.coreCount ?? 0,
      moduleCount: readiness?.moduleCount ?? 0,
      blockedCount: readiness?.blockedCount ?? 0,
      blocked: track.blockedCapabilityIds ?? [],
      moduleCapabilities,
      pack: pack
        ? {
            id: pack.id,
            rubro: pack.rubro,
            workItemTypes: pack.vocabulary.workItemTypes.length,
            partnerTypes: pack.vocabulary.partnerTypes.length,
            areas: pack.vocabulary.areas.length,
            checklists: pack.checklists.length,
            kpis: pack.kpis.length,
            intakeChannels: pack.intakeChannels.length,
          }
        : null,
    };
  });

  const products = contract.distributionTargets.map((target) => {
    const adapter = adapters.find((item) => item.projectId === target.projectId);
    const entityMappings = adapter?.entityMappings ?? [];
    return {
      projectId: target.projectId,
      projectName: adapter?.projectName ?? target.projectId,
      status: target.status,
      verticalTrackId: target.verticalTrackId ?? adapter?.verticalTrackId ?? null,
      installedEntities: adapter?.installedEntities?.length ?? 0,
      entities: adapter ? summarizeMappings(entityMappings) : null,
      pendingEntities: entityMappings
        .filter((mapping) => classifyAdoptionStatus(mapping.status) === "pendiente")
        .map((mapping) => mapping.coreEntityId),
      nextAction: target.nextAction ?? null,
    };
  });

  const coreCapabilities = contract.capabilities.filter((capability) => capability.layer === "core").length;
  const moduleSummaries = modules.map((module) => ({
    module: module.module,
    version: module.version,
    status: module.status,
    capabilities: [...(module.activatesCapabilities ?? []), ...(module.providesCapabilities ?? [])],
    entities: module.entities?.length ?? 0,
  }));

  return {
    contract: {
      name: contract.name,
      version: contract.version,
      status: contract.status,
      entities: contract.entities.length,
      capabilities: contract.capabilities.length,
      coreCapabilities,
      tracks: contract.verticalTracks.length,
      packs: getVerticalPacks(contract).length,
      modules: moduleSummaries.length,
    },
    tracks,
    products,
    modules: moduleSummaries,
  };
}

/**
 * Readiness de un vertical para volverse un sistema vendible (tipo ProveeGest):
 * necesita su pack (vocabulario del rubro) y que sus capabilities de capa modulo
 * esten cubiertas por algun modulo. El adapter/producto es el paso siguiente.
 */
export function verticalReadiness(contract, modules = [], trackId) {
  const track = contract.verticalTracks.find((item) => item.id === trackId);
  if (!track) {
    return null;
  }

  const capabilityLayerById = new Map(contract.capabilities.map((capability) => [capability.id, capability.layer]));
  const moduleLayers = new Set(["activatable_module", "vertical_extension"]);
  const moduleByCapability = new Map();
  for (const module of modules) {
    for (const capabilityId of module.activatesCapabilities ?? []) {
      if (!moduleByCapability.has(capabilityId)) {
        moduleByCapability.set(capabilityId, module.module);
      }
    }
  }

  const pack = getVerticalPack(contract, trackId);
  const moduleCapabilities = track.requiredCapabilityIds
    .filter((capabilityId) => moduleLayers.has(capabilityLayerById.get(capabilityId)))
    .map((capabilityId) => ({ id: capabilityId, module: moduleByCapability.get(capabilityId) ?? null }));
  const uncoveredModuleCaps = moduleCapabilities.filter((capability) => !capability.module).map((capability) => capability.id);

  const missing = [];
  if (!pack) {
    missing.push("pack");
  }
  for (const capabilityId of uncoveredModuleCaps) {
    missing.push(`modulo:${capabilityId}`);
  }

  return {
    trackId,
    hasPack: Boolean(pack),
    moduleCapabilities,
    uncoveredModuleCaps,
    ready: Boolean(pack) && uncoveredModuleCaps.length === 0,
    missing,
  };
}

export function renderReport(report) {
  const lines = [];
  const header = report.contract;

  lines.push("ONIA Core - Reporte de avance");
  lines.push("=============================");
  lines.push(`Contrato: ${header.name} v${header.version} (${header.status})`);
  lines.push(
    `Piezas: ${header.entities} entidades | ${header.capabilities} capabilities (${header.coreCapabilities} core) | ${header.tracks} tracks | ${header.packs} packs | ${header.modules} modulos`,
  );
  lines.push("");

  lines.push("VERTICALES (track + pack de rubro)");
  for (const track of report.tracks) {
    lines.push(`  - ${track.name}  [${track.status}]`);
    const blockedLabel = track.blocked.length ? `${track.blockedCount} (${track.blocked.join(", ")})` : "0";
    lines.push(
      `      capabilities requeridas: ${track.requiredCount} (${track.coreCount} core, ${track.moduleCount} modulo) | bloqueadas: ${blockedLabel}`,
    );
    if (track.pack) {
      const pack = track.pack;
      lines.push(
        `      pack "${pack.rubro}": ${pack.workItemTypes} tipos de trabajo, ${pack.partnerTypes} tipos de partner, ${pack.areas} areas, ${pack.checklists} checklists, ${pack.kpis} KPIs, ${pack.intakeChannels} canales`,
      );
    } else {
      lines.push("      pack: SIN PACK (falta)");
    }
    if (track.moduleCapabilities.length > 0) {
      const parts = track.moduleCapabilities.map(
        (capability) => `${capability.id}=${capability.module ?? "FALTA MODULO"}`,
      );
      lines.push(`      modulos de rubro: ${parts.join(", ")}`);
    }
  }
  lines.push("");

  lines.push("PRODUCTOS (avance de instalacion del core)");
  for (const product of report.products) {
    lines.push(`  - ${product.projectName}  [${product.status}]`);
    if (product.entities) {
      const entities = product.entities;
      lines.push(
        `      entidades: ${entities.cubierto} ${ADOPTION_LABELS.cubierto}, ${entities.parcial} ${ADOPTION_LABELS.parcial}, ${entities.dominio} ${ADOPTION_LABELS.dominio}, ${entities.pendiente} ${ADOPTION_LABELS.pendiente} (de ${entities.total})`,
      );
    } else {
      lines.push("      entidades: sin adapter");
    }
    lines.push(`      migraciones instaladas: ${product.installedEntities} entidades`);
    if (product.status === "installing" && product.pendingEntities.length > 0) {
      lines.push(`      falta instalar: ${product.pendingEntities.join(", ")}`);
    }
    if (product.nextAction) {
      lines.push(`      siguiente: ${product.nextAction}`);
    }
  }
  lines.push("");

  lines.push("MODULOS (add-ons vendibles sobre el core)");
  if (report.modules.length === 0) {
    lines.push("  (ninguno)");
  } else {
    for (const module of report.modules) {
      lines.push(`  - ${module.module} v${module.version} [${module.status}]`);
      lines.push(`      capabilities: ${module.capabilities.join(", ")} | entidades: ${module.entities}`);
    }
  }
  lines.push("");

  return lines.join("\n");
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const contract = loadOniaCoreContract();
  const adapters = loadAdapters(contract);
  const modules = loadModules();
  process.stdout.write(`${renderReport(buildCoreReport(contract, adapters, modules))}\n`);
}
