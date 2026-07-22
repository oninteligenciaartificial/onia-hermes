/*
 * Registro MULTI-TENANT del emisor SIAT (diseno nuestro, pura logica).
 *
 * El emisor es un servicio compartido que factura por MUCHAS organizaciones
 * (external_gate: siat). Este modulo modela, por organizacion (orgId), todo lo
 * que el emisor necesita saber para emitir en su nombre: datos del emisor,
 * sucursales, puntos de venta, la METADATA del token delegado y el catalogo de
 * productos homologados. Es DISEÑO NUESTRO: NO depende de los WSDLs/XSD del SIN
 * ni del NIT, asi que se construye y testea hoy (plan seccion 3, "Tenant
 * registry").
 *
 * Puro, sin IO, inmutable — cada funcion devuelve una copia NUEVA, igual patron
 * que emission-state.mjs / invoice-payload.mjs. Sin dependencias externas.
 *
 * REGLA DE SECRETOS (README, "Regla de secretos"): este .mjs NUNCA contiene el
 * VALOR del token delegado ni credenciales. Solo guarda metadata (referencia al
 * vault, estado, vigencia). El valor real vive cifrado en el vault del VPS.
 * Esto NO es asesoria fiscal.
 */
import { MODALITIES, RECOMMENDED_START_MODALITY } from "./constants.mjs";

// Estados operativos del token delegado. Son METADATA NUESTRA (seguimiento
// interno), no un catalogo del SIN: el token lo genera el cliente en SIAT y
// nosotros solo rastreamos si esta utilizable.
export const TOKEN_ESTADOS = {
  PENDIENTE: "pendiente", // referenciado en el vault pero aun no habilitado
  ACTIVO: "activo",
  VENCIDO: "vencido",
  REVOCADO: "revocado",
};

// Formato basico de NIT boliviano (mismo criterio que invoice-payload: 5-15
// digitos). El codigo de sistema/sucursal/PdV son numericos.
const NIT_RE = /^\d{5,15}$/;

// Comparacion de codigos como texto (un codigo puede venir number o string).
function codigoKey(codigo) {
  return String(codigo ?? "").trim();
}

function isCodigoPresente(codigo) {
  return codigoKey(codigo) !== "";
}

/**
 * Normaliza y construye un tenant NUEVO a partir del input del onboarding.
 * No exige que todo este completo (una org puede estar a medio configurar): la
 * completitud para emitir la evalua validateTenantReady. Lo unico obligatorio
 * es orgId (identifica al tenant).
 */
export function buildTenant(input = {}) {
  if (!input.orgId) {
    throw new Error("buildTenant requiere orgId (identificador del tenant)");
  }

  const modalidad = input.emisor?.modalidad ?? RECOMMENDED_START_MODALITY;
  if (!Object.values(MODALITIES).includes(modalidad)) {
    throw new Error(`emisor.modalidad invalida: "${modalidad}"`);
  }

  const base = {
    orgId: input.orgId,
    emisor: {
      nit: input.emisor?.nit ?? null,
      razonSocial: input.emisor?.razonSocial ?? null,
      // codigoSistema lo devuelve el SIN al registrar el sistema; opcional hasta
      // certificar (por eso null por defecto).
      codigoSistema: input.emisor?.codigoSistema ?? null,
      municipio: input.emisor?.municipio ?? null,
      direccion: input.emisor?.direccion ?? null,
      modalidad,
    },
    sucursales: [],
    puntosVenta: [],
    // Token delegado: SOLO metadata, nunca el valor en claro (regla de secretos).
    tokenDelegado: null,
    // Catalogo homologado: codigoInterno -> { codigoProductoSin, unidadMedida,
    // actividadEconomica }. El codigo SIN viaja en el XML (plan: homologacion).
    homologacion: {},
  };

  // Reusar los mismos validadores para el input inicial: sucursales primero,
  // luego puntos de venta (que exigen sucursal existente), token y homologacion.
  let tenant = (input.sucursales ?? []).reduce((acc, s) => addSucursal(acc, s), base);
  tenant = (input.puntosVenta ?? []).reduce((acc, pv) => addPuntoVenta(acc, pv), tenant);
  if (input.emisor?.codigoSistema != null) {
    tenant = setCodigoSistema(tenant, input.emisor.codigoSistema);
  }
  if (input.tokenDelegado != null) {
    tenant = setTokenDelegado(tenant, input.tokenDelegado);
  }
  tenant = Object.entries(input.homologacion ?? {}).reduce(
    (acc, [codigoInterno, mapping]) => registerHomologation(acc, codigoInterno, mapping),
    tenant,
  );
  return tenant;
}

/**
 * Agrega una sucursal { codigo, nombre?, direccion? }. Exige codigo presente y
 * no duplicado. Convencion SIAT: la casa matriz suele ser codigo 0. Devuelve un
 * tenant NUEVO.
 */
export function addSucursal(tenant, sucursal = {}) {
  if (!isCodigoPresente(sucursal.codigo)) {
    throw new Error("addSucursal requiere sucursal.codigo");
  }
  const key = codigoKey(sucursal.codigo);
  if ((tenant.sucursales ?? []).some((s) => codigoKey(s.codigo) === key)) {
    throw new Error(`sucursal duplicada: codigo ${key}`);
  }
  const nueva = {
    codigo: sucursal.codigo,
    nombre: sucursal.nombre ?? null,
    direccion: sucursal.direccion ?? null,
  };
  return {
    ...tenant,
    sucursales: [...(tenant.sucursales ?? []), nueva],
  };
}

/**
 * Agrega un punto de venta { codigo, sucursalCodigo, nombre?, tipo? }. Valida
 * que la sucursalCodigo EXISTA en el tenant y que el codigo no se repita dentro
 * de esa sucursal. `tipo` es opcional y se pasa tal cual (el catalogo de tipos
 * de PdV lo define el SIN). [VERIFICAR catalogo de tipos de PdV contra el SIN].
 * Devuelve un tenant NUEVO.
 */
export function addPuntoVenta(tenant, pv = {}) {
  if (!isCodigoPresente(pv.codigo)) {
    throw new Error("addPuntoVenta requiere pv.codigo");
  }
  if (!isCodigoPresente(pv.sucursalCodigo)) {
    throw new Error("addPuntoVenta requiere pv.sucursalCodigo");
  }
  const sucKey = codigoKey(pv.sucursalCodigo);
  const existeSucursal = (tenant.sucursales ?? []).some((s) => codigoKey(s.codigo) === sucKey);
  if (!existeSucursal) {
    throw new Error(`sucursalCodigo ${sucKey} no existe en el tenant`);
  }
  const pvKey = codigoKey(pv.codigo);
  const duplicado = (tenant.puntosVenta ?? []).some(
    (p) => codigoKey(p.sucursalCodigo) === sucKey && codigoKey(p.codigo) === pvKey,
  );
  if (duplicado) {
    throw new Error(`punto de venta duplicado: codigo ${pvKey} en sucursal ${sucKey}`);
  }
  const nuevo = {
    codigo: pv.codigo,
    sucursalCodigo: pv.sucursalCodigo,
    nombre: pv.nombre ?? null,
    tipo: pv.tipo ?? null,
  };
  return {
    ...tenant,
    puntosVenta: [...(tenant.puntosVenta ?? []), nuevo],
  };
}

/** Fija el codigoSistema (el que devuelve el SIN al registrar). Tenant NUEVO. */
export function setCodigoSistema(tenant, codigo) {
  if (!isCodigoPresente(codigo)) {
    throw new Error("setCodigoSistema requiere un codigo no vacio");
  }
  return {
    ...tenant,
    emisor: { ...tenant.emisor, codigoSistema: codigo },
  };
}

// Claves que jamas deben viajar en la metadata del token (serian el secreto en
// claro). Si aparecen, cortamos: el valor vive SOLO en el vault del VPS.
const CLAVES_SECRETAS_PROHIBIDAS = ["valor", "token", "secret", "secreto", "raw", "clave", "password"];

/**
 * Guarda la METADATA del token delegado: { referencia, estado, vigenciaDesde,
 * vigenciaHasta }. NUNCA el valor en claro — si el meta trae una clave secreta
 * (valor/token/secret/...) se rechaza para no filtrar el secreto a git.
 * `referencia` es el id del secreto en el vault del VPS. Devuelve tenant NUEVO.
 */
export function setTokenDelegado(tenant, meta = {}) {
  const clavesPresentes = Object.keys(meta).map((k) => k.toLowerCase());
  const filtrada = CLAVES_SECRETAS_PROHIBIDAS.find((c) => clavesPresentes.includes(c));
  if (filtrada) {
    throw new Error(
      `setTokenDelegado no acepta el valor del token ("${filtrada}"): guardar solo metadata, el secreto vive en el vault`,
    );
  }
  if (!meta.referencia) {
    throw new Error("setTokenDelegado requiere meta.referencia (id del secreto en el vault)");
  }
  const estado = meta.estado ?? TOKEN_ESTADOS.PENDIENTE;
  if (!Object.values(TOKEN_ESTADOS).includes(estado)) {
    throw new Error(`estado de token invalido: "${estado}"`);
  }
  return {
    ...tenant,
    tokenDelegado: {
      referencia: meta.referencia,
      estado,
      vigenciaDesde: meta.vigenciaDesde ?? null,
      vigenciaHasta: meta.vigenciaHasta ?? null,
    },
  };
}

// Campos requeridos de un mapeo de homologacion.
const HOMOLOGACION_CAMPOS = ["codigoProductoSin", "unidadMedida", "actividadEconomica"];

/**
 * Registra (o reemplaza) el mapeo homologado de un codigoInterno hacia el
 * catalogo del SIN: { codigoProductoSin, unidadMedida, actividadEconomica }.
 * Exige codigoInterno y los tres campos. Devuelve tenant NUEVO (copia del mapa).
 */
export function registerHomologation(tenant, codigoInterno, mapping = {}) {
  if (!codigoInterno && codigoInterno !== 0) {
    throw new Error("registerHomologation requiere codigoInterno");
  }
  const faltantes = HOMOLOGACION_CAMPOS.filter((c) => mapping[c] == null || mapping[c] === "");
  if (faltantes.length > 0) {
    throw new Error(`homologacion incompleta para "${codigoInterno}": faltan ${faltantes.join(", ")}`);
  }
  const clean = {
    codigoProductoSin: mapping.codigoProductoSin,
    unidadMedida: mapping.unidadMedida,
    actividadEconomica: mapping.actividadEconomica,
  };
  return {
    ...tenant,
    homologacion: { ...(tenant.homologacion ?? {}), [String(codigoInterno)]: clean },
  };
}

/** Devuelve el mapeo homologado de un codigoInterno, o null si no existe. */
export function resolveHomologation(tenant, codigoInterno) {
  const mapping = (tenant?.homologacion ?? {})[String(codigoInterno)];
  return mapping ? { ...mapping } : null;
}

/**
 * El token delegado esta VIGENTE: estado ACTIVO y `now` dentro de la ventana de
 * vigencia (bordes inclusive; null = sin borde). `now` es PARAMETRO (testable,
 * mismo patron que emission-state.canCancel).
 */
export function isTokenVigente(tokenDelegado, { now = new Date() } = {}) {
  if (!tokenDelegado || tokenDelegado.estado !== TOKEN_ESTADOS.ACTIVO) {
    return false;
  }
  const ahora = new Date(now).getTime();
  if (Number.isNaN(ahora)) {
    return false;
  }
  if (tokenDelegado.vigenciaDesde) {
    const desde = new Date(tokenDelegado.vigenciaDesde).getTime();
    if (!Number.isNaN(desde) && ahora < desde) {
      return false;
    }
  }
  if (tokenDelegado.vigenciaHasta) {
    const hasta = new Date(tokenDelegado.vigenciaHasta).getTime();
    if (!Number.isNaN(hasta) && ahora > hasta) {
      return false;
    }
  }
  return true;
}

/**
 * Evalua si el tenant esta LISTO PARA EMITIR y devuelve { ready, missing[] }.
 * Requisitos: nit (formato valido) + codigoSistema + >=1 sucursal + >=1 punto de
 * venta + token delegado vigente. `now` es parametro (para la vigencia).
 */
export function validateTenantReady(tenant, { now = new Date() } = {}) {
  const missing = [];
  const nit = tenant?.emisor?.nit;
  if (!nit || !NIT_RE.test(String(nit))) {
    missing.push("nit");
  }
  if (!isCodigoPresente(tenant?.emisor?.codigoSistema)) {
    missing.push("codigoSistema");
  }
  if ((tenant?.sucursales ?? []).length === 0) {
    missing.push("sucursales");
  }
  if ((tenant?.puntosVenta ?? []).length === 0) {
    missing.push("puntosVenta");
  }
  if (!isTokenVigente(tenant?.tokenDelegado, { now })) {
    missing.push("tokenDelegadoVigente");
  }
  return { ready: missing.length === 0, missing };
}
