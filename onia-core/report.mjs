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

export function buildCoreReport(contract, adapters = []) {
  const tracks = contract.verticalTracks.map((track) => {
    const readiness = getTrackReadiness(contract, track.id);
    const pack = getVerticalPack(contract, track.id);
    return {
      id: track.id,
      name: track.name,
      status: track.status,
      requiredCount: readiness?.requiredCount ?? 0,
      coreCount: readiness?.coreCount ?? 0,
      moduleCount: readiness?.moduleCount ?? 0,
      blockedCount: readiness?.blockedCount ?? 0,
      blocked: track.blockedCapabilityIds ?? [],
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
    },
    tracks,
    products,
  };
}

export function renderReport(report) {
  const lines = [];
  const header = report.contract;

  lines.push("ONIA Core - Reporte de avance");
  lines.push("=============================");
  lines.push(`Contrato: ${header.name} v${header.version} (${header.status})`);
  lines.push(
    `Piezas: ${header.entities} entidades | ${header.capabilities} capabilities (${header.coreCapabilities} core) | ${header.tracks} tracks | ${header.packs} packs`,
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

  return lines.join("\n");
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const contract = loadOniaCoreContract();
  const adapters = loadAdapters(contract);
  process.stdout.write(`${renderReport(buildCoreReport(contract, adapters))}\n`);
}
