/*
 * Logica pura canonica de vistas guardadas (core). Sanea los filtros de un
 * SavedView: nadie puede sobrescribir el tenant (organizationId) ni contaminar el
 * prototipo (__proto__/constructor/prototype). Sin estado, sin IO.
 */

// organizationId lo fija el backend por tenant, nunca el filtro guardado.
// __proto__/prototype/constructor evitan prototype pollution desde JSON.
const BLOCKED_FILTER_KEYS = new Set(["organizationId", "__proto__", "prototype", "constructor"]);

/** True si los filtros traen alguna clave prohibida. */
export function hasBlockedFilterKeys(filters) {
  if (!filters || typeof filters !== "object" || Array.isArray(filters)) {
    return false;
  }
  return Object.keys(filters).some((key) => BLOCKED_FILTER_KEYS.has(key));
}

/** Devuelve una copia de los filtros sin las claves prohibidas. */
export function sanitizeFilters(filters) {
  const clean = {};
  if (!filters || typeof filters !== "object" || Array.isArray(filters)) {
    return clean;
  }
  for (const [key, value] of Object.entries(filters)) {
    if (BLOCKED_FILTER_KEYS.has(key)) {
      continue;
    }
    clean[key] = value;
  }
  return clean;
}
