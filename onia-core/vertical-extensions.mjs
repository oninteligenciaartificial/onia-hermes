/*
 * Loader y helpers del catalogo de funciones especificas por rubro
 * (vertical-extensions.json). Cada entrada documenta lo que vive en el
 * PRODUCTO (no en onia-core) para un track vertical dado.
 */
import { readFileSync } from "node:fs";

export function loadVerticalExtensions(fileUrl = new URL("./vertical-extensions.json", import.meta.url)) {
  return JSON.parse(readFileSync(fileUrl, "utf8"));
}

export function getVerticalExtension(catalog, trackId) {
  return catalog.extensions.find((extension) => extension.trackId === trackId);
}

export function getVerticalExtensionEntities(catalog, trackId) {
  return getVerticalExtension(catalog, trackId)?.entities ?? [];
}

/** True si el track declara al menos una entidad especifica del rubro. */
export function hasVerticalSpecificEntities(catalog, trackId) {
  return getVerticalExtensionEntities(catalog, trackId).length > 0;
}
