/*
 * Loaders y helpers para los modulos vendibles de ONIA Core (onia-core/modules/*.json).
 * Un modulo es un add-on activable SOBRE el core (catalogo, inventario, ventas,
 * cotizaciones). Vive FUERA del contrato congelado; declara que capabilities de
 * modulo activa y sus entidades propias (namespace onia_commerce_* etc).
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const modulesDir = dirname(fileURLToPath(import.meta.url));

export function loadModule(fileOrUrl) {
  return JSON.parse(readFileSync(fileOrUrl, "utf8"));
}

export function loadModules(dir = modulesDir) {
  return readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => JSON.parse(readFileSync(resolve(dir, file), "utf8")))
    .filter((parsed) => typeof parsed.module === "string");
}

export function getModule(modules, moduleId) {
  return modules.find((module) => module.module === moduleId);
}

export function getModuleEntity(module, entityId) {
  return module.entities.find((entity) => entity.id === entityId);
}

export function getModuleEntitiesByCapability(module, capabilityId) {
  return module.entities.filter((entity) => entity.capabilityId === capabilityId);
}
