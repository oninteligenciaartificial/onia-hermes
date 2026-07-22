/*
 * STORE de los CATALOGOS / PARAMETRICAS sincronizados del SIAT (Bolivia).
 *
 * El SIN publica parametricas que el emisor consulta para armar y validar una
 * factura: productos/servicios homologados, unidades de medida, tipos de
 * documento de identidad, tipos de documento sector, leyendas de factura,
 * motivos de anulacion, tipos de moneda, metodos de pago, tipos de emision,
 * tipos de factura y eventos significativos. Se sincronizan por servicio web
 * (limite 1000 requests/dia, plan seccion 2.3) — esa DESCARGA es una capa aparte.
 *
 * ESTE modulo es SOLO el contenedor + lookup + control de frescura: puro, sin IO,
 * inmutable, con "now"/fechas SIEMPRE como PARAMETRO (mismo patron que
 * scheduler.mjs / tenant-registry.mjs). NO hardcodea los VALORES de las
 * parametricas: llegan del SIN y entran por buildCatalogStore. La subset
 * verificable de codigos (TIPO_DOC_IDENTIDAD, DOC_SECTOR, EMISSION_TYPES en
 * constants.mjs) son fallbacks previos a la primera sync; una vez sincronizado,
 * el catalogo completo del SIN manda. Esto NO es asesoria fiscal.
 *
 * Modelo generico de item: { codigo, descripcion, ...campos extra }. Cada
 * parametrica es una lista de estos; el `codigo` se compara como texto (puede
 * venir number o string desde el web service).
 */

// Nombres canonicos de las parametricas = claves del contenedor. Son DISEÑO
// NUESTRO (la capa de descarga debe normalizar la respuesta del SIN a estas
// claves); NO son codigos del SIN. El mapeo hacia el metodo de sync exacto del
// web service (sincronizarParametrica*/sincronizarLista*) vive en la capa de
// descarga. [VERIFICAR nombres exactos de los metodos de sync contra el WSDL].
export const CATALOG_NAMES = {
  PRODUCTOS_SERVICIOS: "productosServicios",
  UNIDADES_MEDIDA: "unidadesMedida",
  TIPOS_DOC_IDENTIDAD: "tiposDocumentoIdentidad",
  TIPOS_DOC_SECTOR: "tiposDocumentoSector",
  LEYENDAS: "leyendasFactura",
  MOTIVOS_ANULACION: "motivosAnulacion",
  TIPOS_MONEDA: "tiposMoneda",
  METODOS_PAGO: "metodosPago",
  TIPOS_EMISION: "tiposEmision",
  TIPOS_FACTURA: "tiposFactura",
  EVENTOS_SIGNIFICATIVOS: "eventosSignificativos",
};

// Default de frescura: la sync es diaria, asi que un store de mas de 24h se
// considera vencido y hay que re-sincronizar.
export const CATALOG_DEFAULTS = {
  maxAgeHours: 24,
};

const MS_PER_HOUR = 60 * 60 * 1000;

/** Parsea un ISO a Date; devuelve null si es ausente o invalido. */
function toDate(iso) {
  if (iso === undefined || iso === null || iso === "") {
    return null;
  }
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

// Comparacion de codigos como texto (un codigo puede venir number o string
// desde el SIN); mismo criterio que tenant-registry.codigoKey.
function codigoKey(codigo) {
  return String(codigo ?? "").trim();
}

/**
 * Normaliza un item crudo al modelo generico { codigo, descripcion, ...extra }.
 * Conserva cualquier campo extra que traiga la parametrica (p. ej. una unidad
 * de medida con simbolo, o un producto con actividad economica asociada).
 */
function normalizeItem(raw) {
  const { codigo = null, descripcion = null, ...rest } = raw ?? {};
  return { codigo, descripcion, ...rest };
}

/** Copia superficial de un item (para no filtrar la referencia interna). */
function copyItem(item) {
  return { ...item };
}

/**
 * Construye el store a partir de las `parametricas` (nombre -> lista de items)
 * y el `syncedAt` (ISO del momento de la sincronizacion). No muta el input:
 * cada lista se normaliza a una copia nueva. Un valor que no sea lista se toma
 * como lista vacia. Devuelve { syncedAt, catalogs }.
 */
export function buildCatalogStore(parametricas = {}, { syncedAt = null } = {}) {
  const catalogs = Object.fromEntries(
    Object.entries(parametricas ?? {}).map(([nombre, lista]) => [
      nombre,
      (Array.isArray(lista) ? lista : []).map(normalizeItem),
    ]),
  );
  return {
    syncedAt: syncedAt ?? null,
    catalogs,
  };
}

/** Lista de nombres de parametricas presentes en el store (copia nueva). */
export function catalogNames(store) {
  return Object.keys(store?.catalogs ?? {});
}

/**
 * Devuelve la lista de una parametrica por nombre (copia nueva de items). Lista
 * vacia si la parametrica no esta en el store. Devolver copias mantiene el store
 * inmutable frente al caller.
 */
export function getCatalog(store, nombre) {
  const lista = store?.catalogs?.[nombre] ?? [];
  return lista.map(copyItem);
}

/**
 * Busca un item por codigo dentro de una parametrica. Devuelve una copia del
 * item o null si no existe (o si el codigo viene vacio). Comparacion por texto.
 */
export function lookupCode(store, nombre, codigo) {
  const key = codigoKey(codigo);
  if (key === "") {
    return null;
  }
  const lista = store?.catalogs?.[nombre] ?? [];
  const found = lista.find((item) => codigoKey(item.codigo) === key);
  return found ? copyItem(found) : null;
}

/**
 * Atajo para el catalogo homologado de productos/servicios: busca por el codigo
 * SIN del producto. Devuelve el item o null.
 */
export function lookupProducto(store, codigoProductoSin) {
  return lookupCode(store, CATALOG_NAMES.PRODUCTOS_SERVICIOS, codigoProductoSin);
}

/**
 * Devuelve todas las leyendas de factura (copia). El caller elige cual usar
 * (una factura puede llevar leyenda segun la actividad economica).
 */
export function getLeyendas(store) {
  return getCatalog(store, CATALOG_NAMES.LEYENDAS);
}

/**
 * Elige una leyenda por indice, de forma DETERMINISTA (sin random en logica
 * pura). Devuelve una copia del item, o null si el indice no es un entero >= 0
 * dentro del rango. El caller decide el indice (p. ej. derivado de la actividad
 * economica); la seleccion pseudo-aleatoria, si aplica, es responsabilidad del
 * caller, no del store.
 */
export function pickLeyenda(store, indice) {
  const lista = store?.catalogs?.[CATALOG_NAMES.LEYENDAS] ?? [];
  if (!Number.isInteger(indice) || indice < 0 || indice >= lista.length) {
    return null;
  }
  return copyItem(lista[indice]);
}

/** Busca un motivo de anulacion por codigo. Devuelve el item o null. */
export function getMotivoAnulacion(store, codigo) {
  return lookupCode(store, CATALOG_NAMES.MOTIVOS_ANULACION, codigo);
}

/**
 * El store esta VENCIDO (hay que re-sincronizar) a la fecha `nowIso`: no tiene
 * syncedAt (nunca se sincronizo), no se puede evaluar `now`, o la antiguedad
 * supera `maxAgeHours` (default 24h, la sync es diaria). El borde es exclusivo:
 * exactamente maxAgeHours NO esta vencido; mas de eso, si. Un syncedAt en el
 * futuro (desfase de reloj) se toma como fresco (no vencido).
 */
export function isStale(store, nowIso, { maxAgeHours = CATALOG_DEFAULTS.maxAgeHours } = {}) {
  const synced = toDate(store?.syncedAt);
  if (!synced) {
    return true; // nunca sincronizado -> vencido
  }
  const now = toDate(nowIso);
  if (!now) {
    return true; // sin now valido no se puede confirmar frescura -> re-sincronizar
  }
  const ageMs = now.getTime() - synced.getTime();
  if (ageMs < 0) {
    return false; // sincronizado en el futuro (skew): tratarlo como fresco
  }
  return ageMs > maxAgeHours * MS_PER_HOUR;
}
