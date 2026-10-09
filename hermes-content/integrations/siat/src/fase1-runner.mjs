/*
 * RUNNER de la FASE 1 de homologacion SIAT (pruebas minimas, ambiente PILOTO).
 *
 * Orquesta las etapas oficiales de la modalidad COMPUTARIZADA contra el piloto.
 * Los totales son los del "Listado de Etapas" del portal (leidos 2026-09-27),
 * y CADA etapa se repite sobre su eje de casos (ver STAGE_PLAN / EMISION_CASES):
 *
 *   I    CUIS                 2   = 1 x 2 PdV        (FacturacionCodigos.cuis)
 *   II   sincronizacion    1800   = 18 ops x 50 x 2 PdV
 *   III  CUFD               200   = 100 x 2 PdV      (FacturacionCodigos.cufd)
 *   IV   emision individual 750   = 125 x 6 combos   (recepcionFactura)
 *   V    eventos signif.     70   = 7 motivos x 5 x 2 PdV
 *   VI   paquetes           560   = 28 recepciones x 10 + 4 validaciones x 70
 *   VII  anulacion          750   = 125 x 6 combos   (anulacionFactura)
 *   VIII firma digital      690   = 115 x 6 combos   (emision FIRMADA, modalidad 1)
 *   IX   emision masiva     160   = 8 recepciones x 10 + 4 validaciones x 20
 *   XI   reversion          750   = 125 x 6 combos   (reversionAnulacionFactura)
 * (X = masiva IEHD: no aplica a nuestro perfil.)
 *
 * ETAPA VIII (2026-09-12): emision en modalidad ELECTRONICA EN LINEA
 * (codigoModalidad 1) con el XML firmado XMLDSig (xml-signer.mjs). Necesita el
 * certificado + llave por env (SIAT_FIRMA_KEY_FILE / SIAT_FIRMA_CERT_FILE,
 * rutas bajo /opt/onia-siat/certs/, chmod 600, JAMAS en git). El piloto exige
 * "el certificado otorgado por nosotros para pruebas" (siatinfo, pagina de
 * firma invalida): el de prueba lo emite AGETIC gratis en
 * desarrollo.adsib.gob.bo/desa_solicitudes — tramite de Leslie. Sin los env
 * files la etapa se SALTA con log (una corrida de volumen no revienta).
 *
 * POR QUE LOS CASOS IMPORTAN: el SIN cuenta COBERTURA, no volumen. La corrida
 * del 6-ago mando 750 emisiones y el portal contabilizo 125, porque las 750
 * eran el mismo combo. Ver el comentario de EMISION_CASES.
 *
 * Uso (VPS, con /opt/onia-siat/siat-piloto.env cargado en el ambiente):
 *   node src/fase1-runner.mjs --solo-informe   # sin red; sin --etapa no se envia
 *   node src/fase1-runner.mjs --etapa gate     # gate minimo antes del volumen
 *   node src/fase1-runner.mjs --etapa IV --count 5
 *   flags: --pace ms (default 500 = ~2 req/s) --state file --log file
 *          --retry-blocked (limpia blockedCases de las etapas a correr y reintenta)
 *
 * Diseno:
 *  - CHECKPOINT/RESUME: el estado vive en un JSON local (--state); si el proceso
 *    se corta, retoma donde iba (done por etapa/caso, facturas, cufds, catalogos).
 *  - LOG NDJSON por operacion (--log): etapa, op, codigos SIN, mensaje. SIN token.
 *  - STOP AUTOMATICO: 5 errores IDENTICOS consecutivos en una etapa => corta y
 *    reporta el codigo SIN exacto en vez de quemar volumen (exit code 2).
 *    En etapas por-caso (II sync, V eventos) el caso se SALTA y se marca blocked.
 *  - Datos REALES de catalogo: sincroniza las parametricas y arma las facturas de
 *    prueba con productos/actividades/leyendas/unidades/metodos DEL catalogo.
 *  - El TOKEN va solo en el header (soap-transport); jamas se loggea.
 *
 * Los envelopes core (cuis/cufd/recepcion/anulacion/reversion) salen de
 * soap-client.mjs (verificados contra el XSD 2026-08-06). Las operaciones SOLO de
 * fase 1 (sync, eventos, paquete, masiva, validacion) se definen aca con la misma
 * metadata, orden confirmado contra los WSDL v2 del piloto 2026-08-06.
 * Esto NO es asesoria fiscal.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, appendFileSync, existsSync, copyFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

import { buildCuf } from "./cuf.mjs";
import { MODALITIES } from "./constants.mjs";
import { buildInvoiceXml } from "./xml-builder.mjs";
import { signInvoiceXml } from "./xml-signer.mjs";
import { buildInvoicePayload, round2 } from "./invoice-payload.mjs";
import { assembleEmission, toSinDateString } from "./emission.mjs";
import {
  SOAP_OPERATIONS,
  buildSoapEnvelope,
  buildAnulacionFacturaRequest,
  buildCufdRequest,
  buildCuisRequest,
  buildRecepcionFacturaRequest,
  buildReversionAnulacionFacturaRequest,
  buildRecepcionDocumentoAjusteRequest,
  buildAnulacionDocumentoAjusteRequest,
  buildReversionAnulacionDocumentoAjusteRequest,
  soapEndpoint,
} from "./soap-client.mjs";
import { postSoap, classifyResponse } from "./soap-transport.mjs";

// ------------------------- constantes del piloto ----------------------------

export const PILOT = {
  environment: "piloto",
  codigoAmbiente: 2,
  codigoModalidad: 2, // computarizada en linea
  codigoSucursal: 0,
};

// ---------------------- matriz de casos que exige el SIN --------------------
//
// LECCION CARA (2026-08-27): el SIN no cuenta VOLUMEN, cuenta COBERTURA. La
// corrida del 6-ago mando 750 emisiones en la etapa IV y el portal contabilizo
// 125 — porque las 750 eran la MISMA combinacion repetida. El "Listado de
// Pruebas" de la etapa IV (Seguimiento de Sistemas -> etapa -> boton entrar)
// muestra 6 casos de 125 c/u, y solo el nuestro estaba al 100%:
//
//   caso  codigoPuntoVenta  tipoFacturaDocumento  codigoDocumentoSector
//     1          1                   1                   1   (compra-venta)
//     2          0                   1                   1   <- el unico corrido
//     3          1                   1                  17   (hospitales/clinicas)
//     4          0                   1                  17
//     5          1                   3                  24   (nota credito-debito)
//     6          0                   3                  24
//
// Los tres documentos sector son EXACTAMENTE los de la solicitud 9473. El eje
// que faltaba es el PUNTO DE VENTA: CUIS y CUFD se piden por sucursal+PdV, y
// por eso las etapas I/II/III/V quedaron clavadas en 50% (hicimos solo el PdV 0).

/** Puntos de venta que el SIN exige cubrir (verificado en el Listado de Pruebas). */
export const PUNTOS_VENTA = [0, 1];

/**
 * Documentos sector de la solicitud 9473 con su tipo de factura.
 * 24 (nota credito-debito) es documento de AJUSTE -> tipoFacturaDocumento 3.
 */
export const DOC_SECTOR_CASES = [
  { codigoDocumentoSector: 1, tipoFacturaDocumento: 1 }, // FACTURA COMPRA-VENTA
  { codigoDocumentoSector: 17, tipoFacturaDocumento: 1 }, // FACTURA DE HOSPITALES/CLINICAS
  { codigoDocumentoSector: 24, tipoFacturaDocumento: 3 }, // NOTA DE CREDITO-DEBITO
];

/** Las 6 combinaciones de emision (PdV x documento sector). */
export const EMISION_CASES = DOC_SECTOR_CASES.flatMap((ds) =>
  PUNTOS_VENTA.map((pv) => ({ codigoPuntoVenta: pv, ...ds })),
);

// Listado de Pruebas del SIN, leido el 2026-09-27. VI/IX no son un solo
// contador por PdV: cada fila tiene sus propios campos y su propio target.
export const LOTE_DOC_SECTORES = [1, 17];
export const LOTE_MOTIVOS = [1, 2, 3, 4, 5, 6, 7];
export const PAQUETE_CASES = LOTE_DOC_SECTORES.flatMap((sector) =>
  LOTE_MOTIVOS.flatMap((motivo) => [
    { sector, motivo, pv: 1, cantidad: 500, target: 10 },
    { sector, motivo, pv: 0, cantidad: 2, target: 10 },
  ]),
);
export const PAQUETE_VALIDACIONES = LOTE_DOC_SECTORES.flatMap((sector) =>
  [1, 0].map((pv) => ({ sector, pv, target: 70 })),
);
export const MASIVA_CASES = LOTE_DOC_SECTORES.flatMap((sector) =>
  PUNTOS_VENTA.flatMap((pv) => [
    { sector, pv, cantidad: 1000, target: 10 },
    { sector, pv, cantidad: 2, target: 10 },
  ]),
);
export const MASIVA_VALIDACIONES = LOTE_DOC_SECTORES.flatMap((sector) =>
  PUNTOS_VENTA.map((pv) => ({ sector, pv, target: 20 })),
);

export const paqueteCaseId = ({ sector, motivo, pv, cantidad }) =>
  `recepcion-ds${sector}-motivo${motivo}-pv${pv}-${cantidad === 500 ? "igual500" : "menor500"}`;
export const masivaCaseId = ({ sector, pv, cantidad }) =>
  `recepcion-ds${sector}-pv${pv}-${cantidad === 1000 ? "igual1000" : "menor1000"}`;
export const validacionCaseId = ({ sector, pv }) => `validacion-ds${sector}-pv${pv}`;

export const LOTE_CASE_TARGETS = {
  VI: Object.fromEntries([
    ...PAQUETE_CASES.map((c) => [paqueteCaseId(c), c.target]),
    ...PAQUETE_VALIDACIONES.map((c) => [validacionCaseId(c), c.target]),
  ]),
  IX: Object.fromEntries([
    ...MASIVA_CASES.map((c) => [masivaCaseId(c), c.target]),
    ...MASIVA_VALIDACIONES.map((c) => [validacionCaseId(c), c.target]),
  ]),
};

/** Importacion explicita del marcador, nunca derivada de respuestas SOAP. */
export function applyPortalSnapshot(state, snapshot) {
  if (!/^\d{4}-\d{2}-\d{2}/.test(snapshot?.readAt ?? "")) {
    throw new Error("snapshot del portal sin readAt ISO");
  }
  const etapas = { ...(state.etapas ?? {}) };
  for (const id of ["VI", "IX"]) {
    const targetByCase = LOTE_CASE_TARGETS[id];
    const portalCases = snapshot[id]?.cases;
    if (!portalCases || typeof portalCases !== "object") {
      throw new Error(`snapshot del portal sin casos de ${id}`);
    }
    const previo = etapas[id] ?? {};
    if (previo.portalReconciledAt) {
      throw new Error(`${id} ya fue conciliada con el portal; no sobrescribir avance posterior`);
    }
    const cases = Object.fromEntries(Object.keys(targetByCase).map((key) => [key, 0]));
    for (const [key, value] of Object.entries(portalCases)) {
      if (!Object.hasOwn(targetByCase, key) || !Number.isInteger(value) || value < 0 || value > targetByCase[key]) {
        throw new Error(`snapshot del portal: caso/avance invalido ${id}.${key}=${value}`);
      }
      cases[key] = value;
    }
    const sum = Object.values(cases).reduce((a, b) => a + b, 0);
    if (sum !== snapshot[id].totalCorrectos) {
      throw new Error(`snapshot del portal: ${id} suma ${sum}, no ${snapshot[id].totalCorrectos}`);
    }
    etapas[id] = {
      ...previo,
      legacyDone: previo.done ?? 0,
      done: 0,
      attempts: previo.attempts ?? 0,
      cases,
      portalCases: { ...cases },
      blockedCases: {},
      portalReconciledAt: snapshot.readAt,
    };
  }
  // Los recibos anteriores no tienen correspondencia comprobada con las filas
  // del portal. Conservarlos como evidencia, sin volver a validarlos a ciegas.
  return {
    ...state,
    etapas,
    legacyRecepcionesLote: structuredClone(state.recepcionesLote ?? { VI: {}, IX: {} }),
    recepcionesLote: { VI: {}, IX: {} },
  };
}

/** codigoModalidad de la modalidad ELECTRONICA EN LINEA (la de la etapa VIII). */
export const MODALIDAD_ELECTRONICA = 1;

/**
 * Etapa VIII: los MISMOS 6 combos pero en modalidad electronica (XML firmado).
 * 690 del portal = 115 x 6 [VERIFICAR el desglose en el Listado de Pruebas de la
 * VIII: inferido por la misma aritmetica que la IV (125 x 6 = 750)].
 */
export const EMISION_CASES_VIII = EMISION_CASES.map((c) => ({
  ...c,
  codigoModalidad: MODALIDAD_ELECTRONICA,
}));

/**
 * Id estable de un combo, usado como caseId del checkpoint y en el log. Los
 * combos electronica llevan sufijo -m1: sin el, una factura firmada de la VIII
 * seria candidata a anulacion del caso computarizado en la VII.
 */
export function comboId(combo) {
  const base = `pv${combo.codigoPuntoVenta}-ds${combo.codigoDocumentoSector}-tf${combo.tipoFacturaDocumento}`;
  return combo.codigoModalidad === MODALIDAD_ELECTRONICA ? `${base}-m1` : base;
}

/** Combo por defecto (el unico que corrio el 6-ago): PdV 0, compra-venta. */
export const DEFAULT_COMBO = EMISION_CASES[0];

/**
 * CADA DOCUMENTO SECTOR TIENE SU PROPIO SERVICIO SOAP. Mandarlos todos a
 * ServicioFacturacionCompraVenta devuelve SIN 995 "SERVICIO NO DISPONIBLE:
 * Para la modalidad 2 y/o sector N" — verificado en vivo 2026-08-27 con los
 * sectores 17 y 24. Los nombres salen del PDF de la solicitud 9473 y se
 * confirmaron pidiendo el ?wsdl de cada uno en el piloto.
 */
export const SERVICIO_POR_DOC_SECTOR = {
  1: "FACTURACION_COMPRA_VENTA", // ServicioFacturacionCompraVenta
  17: "FACTURACION_COMPUTARIZADA", // ServicioFacturacionComputarizada
  24: "FACTURACION_DOCUMENTO_AJUSTE", // ServicioFacturacionDocumentoAjuste
};

/**
 * Servicios de la modalidad ELECTRONICA (etapa VIII), espejo del mapa
 * computarizado: compra-venta y ajuste comparten servicio entre modalidades
 * (el 995 del 2026-08-27 decia "Para la modalidad 2 y/o sector N": la
 * disponibilidad se decide por modalidad+sector) y el generico es
 * ServicioFacturacionElectronica. [VERIFICAR en vivo: un 995 aca se corrige
 * moviendo el sector a otro servicio, igual que se hizo con el 17 y el 24.]
 */
export const SERVICIO_POR_DOC_SECTOR_ELECTRONICA = {
  1: "FACTURACION_COMPRA_VENTA",
  17: "FACTURACION_ELECTRONICA", // ServicioFacturacionElectronica
  24: "FACTURACION_DOCUMENTO_AJUSTE",
};

/** Documento de AJUSTE: va por ServicioFacturacionDocumentoAjuste (OPS_AJUSTE). */
export const DOC_SECTOR_AJUSTE = 24;

// Builders de recepcion/anulacion/reversion por documento sector. El de ajuste
// NO comparte los nombres de operacion con los de factura; los wrappers estan
// verificados contra el WSDL del piloto en soap-client (2026-09-03).
const OPS_FACTURA = {
  recepcion: { op: "recepcionFactura", build: buildRecepcionFacturaRequest },
  anulacion: { op: "anulacionFactura", build: buildAnulacionFacturaRequest },
  reversion: { op: "reversionAnulacionFactura", build: buildReversionAnulacionFacturaRequest },
};
const OPS_AJUSTE = {
  recepcion: { op: "recepcionDocumentoAjuste", build: buildRecepcionDocumentoAjusteRequest },
  anulacion: { op: "anulacionDocumentoAjuste", build: buildAnulacionDocumentoAjusteRequest },
  reversion: { op: "reversionAnulacionDocumentoAjuste", build: buildReversionAnulacionDocumentoAjusteRequest },
};

/**
 * Timeout HTTP por servicio. El de documento de ajuste tarda 36-43 s en
 * responder CUALQUIER recepcion (medido 2026-09-04 en el piloto, hasta con un
 * archivo basura que rechaza con 920): con el default de 30 s del transporte
 * los 3 reintentos morian en "network" sin que el SIN llegara a contestar.
 */
export const TIMEOUT_MS_POR_SERVICIO = { FACTURACION_DOCUMENTO_AJUSTE: 120_000 };

/** Timeout a usar para un servicio (undefined = el default del transporte). */
export function timeoutFor(serviceKey) {
  return TIMEOUT_MS_POR_SERVICIO[serviceKey];
}

/**
 * Sectores cuyo servicio SOAP todavia no tiene operaciones mapeadas. VACIO desde
 * 2026-09-03 (el 24 ya va por OPS_AJUSTE); el mecanismo queda para el proximo
 * sector que se sume: se marca explicito en vez de fallar con un 995 opaco.
 */
export const DOC_SECTOR_SIN_SOPORTE = new Set();

/** Los combos que HOY se pueden emitir de verdad (sector 24 queda afuera). */
export const EMISION_CASES_SOPORTADOS = EMISION_CASES.filter(
  (c) => !DOC_SECTOR_SIN_SOPORTE.has(c.codigoDocumentoSector),
);

// NIT de prueba del piloto para el receptor (convencion de homologacion).
export const NIT_PRUEBA_RECEPTOR = "99001";

// Datos del emisor para la cabecera de las facturas de prueba (denominacion
// legal SEPREC de Onia; el piloto no valida la direccion contra el padron).
export const EMISOR_PRUEBA = {
  razonSocial: "OniaAgency",
  municipio: "Santa Cruz de la Sierra",
  direccion: "Av. Beni, Santa Cruz de la Sierra",
  telefono: null,
};

// -------------------- operaciones SOLO fase 1 (orden XSD) -------------------

// Campos del wrapper SolicitudSincronizacion (XSD FacturacionSincronizacion,
// verificado 2026-08-06): codigoAmbiente, codigoPuntoVenta?, codigoSistema,
// codigoSucursal, cuis, nit.
const SYNC_FIELDS = [
  { name: "codigoAmbiente" },
  { name: "codigoPuntoVenta", optional: true },
  { name: "codigoSistema" },
  { name: "codigoSucursal" },
  { name: "cuis" },
  { name: "nit" },
];

// base solicitudRecepcion (XSD ServicioFacturacionComputarizada, 2026-08-06).
const RECEPCION_BASE_FIELDS = [
  { name: "codigoAmbiente" },
  { name: "codigoDocumentoSector" },
  { name: "codigoEmision" },
  { name: "codigoModalidad" },
  { name: "codigoPuntoVenta", optional: true },
  { name: "codigoSistema" },
  { name: "codigoSucursal" },
  { name: "cufd" },
  { name: "cuis" },
  { name: "nit" },
  { name: "tipoFacturaDocumento" },
];

// Operaciones de fase 1 que no viven en soap-client (metadata con orden XSD).
export const RUNNER_OPS = {
  registroEventoSignificativo: {
    service: "FACTURACION_OPERACIONES",
    operation: "registroEventoSignificativo",
    requestElement: "SolicitudEventoSignificativo",
    fields: [
      { name: "codigoAmbiente" },
      { name: "codigoMotivoEvento" },
      { name: "codigoPuntoVenta", optional: true },
      { name: "codigoSistema" },
      { name: "codigoSucursal" },
      { name: "cufd" },
      { name: "cufdEvento" },
      { name: "cuis" },
      { name: "descripcion" },
      { name: "fechaHoraFinEvento" },
      { name: "fechaHoraInicioEvento" },
      { name: "nit" },
    ],
  },
  recepcionPaqueteFactura: {
    service: "FACTURACION_COMPUTARIZADA",
    operation: "recepcionPaqueteFactura",
    requestElement: "SolicitudServicioRecepcionPaquete",
    fields: [
      ...RECEPCION_BASE_FIELDS,
      { name: "archivo" },
      { name: "fechaEnvio" },
      { name: "hashArchivo" },
      { name: "cafc", optional: true },
      { name: "cantidadFacturas" },
      { name: "codigoEvento" },
    ],
  },
  validacionRecepcionPaqueteFactura: {
    service: "FACTURACION_COMPUTARIZADA",
    operation: "validacionRecepcionPaqueteFactura",
    requestElement: "SolicitudServicioValidacionRecepcionPaquete",
    fields: [...RECEPCION_BASE_FIELDS, { name: "codigoRecepcion" }],
  },
  recepcionMasivaFactura: {
    service: "FACTURACION_COMPUTARIZADA",
    operation: "recepcionMasivaFactura",
    requestElement: "SolicitudServicioRecepcionMasiva",
    fields: [
      ...RECEPCION_BASE_FIELDS,
      { name: "archivo" },
      { name: "fechaEnvio" },
      { name: "hashArchivo" },
      { name: "cantidadFacturas" },
    ],
  },
  validacionRecepcionMasivaFactura: {
    service: "FACTURACION_COMPUTARIZADA",
    operation: "validacionRecepcionMasivaFactura",
    requestElement: "SolicitudServicioValidacionRecepcionMasiva",
    fields: [...RECEPCION_BASE_FIELDS, { name: "codigoRecepcion" }],
  },
};

/** Envelope de una operacion de fase 1 (sync o RUNNER_OPS). */
export function buildRunnerEnvelope(opKey, params) {
  if (opKey.startsWith("sincronizar")) {
    return buildSoapEnvelope({
      operation: opKey,
      requestElement: "SolicitudSincronizacion",
      fields: SYNC_FIELDS,
      params,
    });
  }
  const op = RUNNER_OPS[opKey];
  if (!op) {
    throw new Error(`operacion de runner desconocida: "${opKey}"`);
  }
  return buildSoapEnvelope({
    operation: op.operation,
    requestElement: op.requestElement,
    fields: op.fields,
    params,
  });
}

// Casos de la etapa II: operacion de sync -> clave del catalogo en el estado.
export const SYNC_CASES = [
  ["sincronizarFechaHora", "fechaHora"],
  ["sincronizarActividades", "actividades"],
  ["sincronizarListaActividadesDocumentoSector", "actividadesDocSector"],
  ["sincronizarListaLeyendasFactura", "leyendas"],
  ["sincronizarListaMensajesServicios", "mensajesServicios"],
  ["sincronizarListaProductosServicios", "productos"],
  ["sincronizarParametricaEventosSignificativos", "eventos"],
  ["sincronizarParametricaMotivoAnulacion", "motivosAnulacion"],
  ["sincronizarParametricaPaisOrigen", "paisOrigen"],
  ["sincronizarParametricaTipoDocumentoIdentidad", "tiposDocIdentidad"],
  ["sincronizarParametricaTipoDocumentoSector", "tiposDocSector"],
  ["sincronizarParametricaTipoEmision", "tiposEmision"],
  ["sincronizarParametricaTipoHabitacion", "tiposHabitacion"],
  ["sincronizarParametricaTipoMetodoPago", "metodosPago"],
  ["sincronizarParametricaTipoMoneda", "tiposMoneda"],
  ["sincronizarParametricaTipoPuntoVenta", "tiposPuntoVenta"],
  ["sincronizarParametricaTiposFactura", "tiposFactura"],
  ["sincronizarParametricaUnidadMedida", "unidadesMedida"],
];

// Volumenes oficiales de fase 1, POR CASO (no totales). El total sale de
// multiplicar por los casos que el SIN pide en cada etapa — ver STAGE_PLAN.
//
// Totales del "Listado de Etapas" del portal (2026-09-27), incluido VIII:
//   I 2 · II 1800 · III 200 · IV 750 · V 70 · VI 560 · VII 750 · VIII 690 · IX 160 · XI 750
export const STAGE_TARGETS = {
  I: 1, // por PdV            -> 2
  II: 50, // por sync x PdV     -> 18 * 50 * 2 = 1800
  III: 100, // por PdV            -> 200
  IV: 125, // por combo          -> 125 * 6 = 750
  V: 5, // por motivo x PdV   -> 7 * 5 * 2 = 70
  VI: 10, // por fila de recepción; validación = 70 por sector/PdV
  VII: 125, // por combo          -> 750
  VIII: 115, // por combo          -> 690
  IX: 10, // por fila de recepción; validación = 20 por sector/PdV
  XI: 125, // por combo          -> 750
};

/**
 * Sobre que eje se repite cada etapa. "combo" = las 6 de EMISION_CASES;
 * "pv" = una corrida por punto de venta; "sync-pv"/"motivo-pv" agregan su
 * propio sub-caso ademas del PdV.
 *
 * II, III y V confirmados por la aritmetica. VI/IX tienen matrices propias
 * leidas fila por fila del portal el 2026-09-27.
 */
export const STAGE_PLAN = {
  I: "pv",
  II: "sync-pv",
  III: "pv",
  IV: "combo",
  V: "motivo-pv",
  VI: "paquete",
  VII: "combo",
  VIII: "combo",
  IX: "masiva",
  XI: "combo",
};

/** Total que espera el SIN por etapa (para el reporte de avance). */
export const STAGE_TOTALS = {
  I: 2,
  II: 1800,
  III: 200,
  IV: 750,
  V: 70,
  VI: 560,
  VII: 750,
  VIII: 690,
  IX: 160,
  XI: 750,
};

export const STAGE_ORDER = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "XI"];

// ----------------------------- parsers puros --------------------------------

const ITEM_CONTAINERS = "listaCodigos|listaActividades|listaLeyendas|listaActividadesDocumentoSector";

/**
 * Extrae los items de una respuesta de sincronizacion: bloques listaCodigos /
 * listaActividades / listaLeyendas / listaActividadesDocumentoSector, cada uno
 * como objeto { campoSimple: valor }. Puro, tolerante a prefijos de namespace.
 */
export function extractSyncItems(xml) {
  const blockRe = new RegExp(
    `<(?:[\\w-]+:)?(${ITEM_CONTAINERS})(?:\\s[^>]*)?>([\\s\\S]*?)</(?:[\\w-]+:)?\\1>`,
    "gi",
  );
  const items = [];
  let m;
  while ((m = blockRe.exec(String(xml ?? ""))) !== null) {
    const inner = m[2];
    const item = {};
    const fieldRe = /<(?:[\w-]+:)?(\w+)(?:\s[^>]*)?>([^<]*)<\/(?:[\w-]+:)?\1>/g;
    let f;
    while ((f = fieldRe.exec(inner)) !== null) {
      item[f[1]] = f[2].trim();
    }
    if (Object.keys(item).length > 0) {
      items.push(item);
    }
  }
  return items;
}

/** Primer contenido de un tag simple (tolerante a prefijo). null si ausente. */
export function tagText(xml, tag) {
  const re = new RegExp(`<(?:[\\w-]+:)?${tag}(?:\\s[^>]*)?>([^<]*)</(?:[\\w-]+:)?${tag}>`, "i");
  const m = re.exec(String(xml ?? ""));
  return m ? m[1].trim() || null : null;
}

// ------------------------------ regla de STOP -------------------------------

/**
 * Clave de identidad de un error para la regla de stop: mismo codigo SIN + misma
 * clasificacion => mismo error. Un exito devuelve null (resetea la racha).
 */
export function errorKey(result) {
  if (result?.ok && result?.parsed?.transaccion !== false) {
    return null;
  }
  const parsed = result?.parsed ?? null;
  const sinCodigo = parsed?.mensajes?.[0]?.codigo ?? parsed?.codigoDescripcion ?? "";
  return `${result?.error ?? "business"}:${sinCodigo}`;
}

export const STOP_THRESHOLD = 5;

/**
 * Actualiza la racha de errores identicos consecutivos. Devuelve la racha nueva
 * { key, count } (inmutable). key null (exito) resetea.
 */
export function updateStreak(streak, key) {
  if (key == null) {
    return { key: null, count: 0 };
  }
  if (streak?.key === key) {
    return { key, count: (streak.count ?? 0) + 1 };
  }
  return { key, count: 1 };
}

/**
 * Normaliza el resultado de una solicitud de CUIS: el piloto responde
 * transaccion=false con SIN 980 ("EXISTE UN CUIS VIGENTE...") pero INCLUYE el
 * CUIS vigente en <codigo> (verificado en vivo 2026-08-06). Para fase 1 eso ES
 * un CUIS obtenido: se marca ok. Sin codigo, el resultado queda tal cual.
 */
export function normalizeCuisResult(result) {
  const codigo = result?.parsed?.codigo ?? null;
  if (!codigo) {
    return result;
  }
  return { ...result, ok: true, parsed: { ...result.parsed, transaccion: true } };
}

/**
 * Prerequisito que se cura SOLO con el paso del tiempo — no con reintentar en el
 * acto ni con arreglar codigo. Existe para que `loop()` NO lo escriba en
 * `blockedCases`: un caso bloqueado se saltea en toda corrida posterior, y
 * `run-fase1-volumen.sh` no pasa `--retry-blocked`, asi que un tropiezo de dos
 * minutos congelaba la etapa PARA SIEMPRE. Eso tuvo a VI y IX clavadas en 20
 * casos desde el 6-ago hasta el 2026-09-08.
 */
export class TransitorioError extends Error {
  constructor(message) {
    super(message);
    this.name = "TransitorioError";
  }
}

export class StopError extends Error {
  constructor(etapa, streak, lastResult) {
    const mensaje = lastResult?.parsed?.mensajes?.[0] ?? null;
    super(
      `STOP etapa ${etapa}: ${streak.count} errores identicos consecutivos (${streak.key})` +
        (mensaje ? ` — SIN ${mensaje.codigo}: ${mensaje.descripcion}` : ""),
    );
    this.etapa = etapa;
    this.streak = streak;
    this.mensaje = mensaje;
  }
}

// ------------------------------ tar (ustar) ---------------------------------

function octal(value, width) {
  return value.toString(8).padStart(width - 1, "0") + "\0";
}

/**
 * TAR (ustar) minimo para los paquetes/masiva: N archivos { name, content } ->
 * Buffer .tar. Suficiente para XMLs chicos (nombres <100 chars). Puro.
 */
export function buildTar(files) {
  const blocks = [];
  for (const { name, content } of files) {
    const data = Buffer.isBuffer(content) ? content : Buffer.from(content, "utf8");
    const header = Buffer.alloc(512);
    header.write(name, 0, 100, "utf8");
    header.write(octal(0o644, 8), 100);
    header.write(octal(0, 8), 108); // uid
    header.write(octal(0, 8), 116); // gid
    header.write(octal(data.length, 12), 124);
    header.write(octal(Math.floor(Date.now() / 1000), 12), 136);
    header.write("        ", 148); // checksum en blanco durante el calculo
    header.write("0", 156); // typeflag: archivo regular
    header.write("ustar\0", 257);
    header.write("00", 263);
    let sum = 0;
    for (const byte of header) {
      sum += byte;
    }
    header.write(octal(sum, 8), 148);
    blocks.push(header, data);
    const rem = data.length % 512;
    if (rem > 0) {
      blocks.push(Buffer.alloc(512 - rem));
    }
  }
  blocks.push(Buffer.alloc(1024)); // fin de archivo: 2 bloques en cero
  return Buffer.concat(blocks);
}

// --------------------------- reloj del SIN ----------------------------------

/**
 * Offset (ms) entre el reloj de PARED del SIN y Date.now(): se parsea solo la
 * parte local del fechaHora del SIN (sin zona) como si fuera UTC, y las fechas
 * de emision se formatean con getters UTC del epoch corrido. Deterministico.
 */
export function computeSinOffset(sinFechaHora, nowMs) {
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?/.exec(
    String(sinFechaHora ?? ""),
  );
  if (!m) {
    return null;
  }
  const wall = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6], +(m[7] ?? "0").padEnd(3, "0"));
  return wall - nowMs;
}

// El CUFD del piloto vale 24h (verificado en vivo 2026-08-06: obtenido
// 22:05:56Z con fechaVigencia 2026-08-07T18:05:56-04:00, exactamente +24h).
export const CUFD_VIGENCIA_MS = 24 * 60 * 60 * 1000;

/**
 * Inicio de vigencia de un CUFD en el timeline "SIN" (epoch corrido, el mismo
 * que consume formatSinLocal). Preferimos `obtenidoEn` (grabado al pedir el
 * CUFD en etapa III); para estados viejos sin ese campo se deriva de
 * fechaVigencia - 24h (la pared del SIN parseada como epoch corrido).
 */
/**
 * true si el CUFD ya no sirve para emitir. El SIN devuelve "CUFD FUERA DE
 * TOLERANCIA" con uno vencido, y el estado del runner sobrevive dias entre
 * corridas: el del 6-ago seguia guardado el 27. Se chequea ANTES de emitir.
 */
export function cufdVencido(cufd, ahoraMs) {
  if (!cufd?.codigo || !cufd?.codigoControl) {
    return true;
  }
  const desde = cufdVigenteDesde(cufd);
  return desde == null || ahoraMs - desde >= CUFD_VIGENCIA_MS;
}

export function cufdVigenteDesde(cufd) {
  if (!cufd) {
    return null;
  }
  if (Number.isFinite(cufd.obtenidoEn)) {
    return cufd.obtenidoEn;
  }
  const venc = computeSinOffset(cufd.fechaVigencia, 0); // wall - 0 = wall como epoch corrido
  return venc == null ? null : venc - CUFD_VIGENCIA_MS;
}

/**
 * Ventana [inicio, fin] de un EVENTO SIGNIFICATIVO. Dos reglas del SIN
 * (verificadas en vivo 2026-08-06 en el piloto):
 *  - 984 "NO CORRESPONDE AL CUFD": la ventana debe caer DENTRO de la vigencia
 *    del cufdEvento -> inicio >= cufdDesde + margen.
 *  - 981 "RANGO DE FECHAS INVALIDO": una vez validado un paquete, su rango de
 *    evento queda tomado; el proximo evento no puede solaparlo -> inicio >
 *    fin del ultimo evento registrado (minInicioMs).
 * Default [now-35min, now-5min], recortada por ambos pisos; si el fin quedara
 * invertido se sube (siempre en el pasado). Sin ventana valida -> error claro
 * en vez de quemar intentos.
 */
export function eventWindow({
  nowSinMs,
  cufdDesdeMs = null,
  minInicioMs = null,
  windowMs = 30 * 60 * 1000,
  margenMs = 60_000,
}) {
  let finMs = nowSinMs - 5 * 60 * 1000;
  let inicioMs = Math.max(
    finMs - windowMs,
    cufdDesdeMs != null ? cufdDesdeMs + margenMs : -Infinity,
    minInicioMs != null ? minInicioMs + 1000 : -Infinity,
  );
  if (finMs <= inicioMs) {
    finMs = Math.min(inicioMs + margenMs, nowSinMs - 1000);
  }
  if (!(inicioMs < finMs)) {
    throw new TransitorioError(
      "sin ventana valida para el evento significativo (CUFD o evento previo demasiado frescos): esperar ~2 min y reintentar",
    );
  }
  return { inicioMs, finMs };
}

// Eventos significativos 5 (virus/falla software), 6 (falla hardware) y
// 7 (corte de energia) exigen CAFC: sin cafc en el request, el SIN rechaza el
// paquete con estado 902 "Cafc no encontrado" (verificado en vivo 2026-08-06).
// Los eventos de conectividad (1-4) emiten offline SIN CAFC.
const MOTIVOS_CON_CAFC = new Set(["5", "6", "7"]);

/** Primer motivo del catalogo que NO exige CAFC (o null si no hay ninguno). */
export function pickMotivoSinCafc(eventos) {
  return (eventos ?? []).find((e) => !MOTIVOS_CON_CAFC.has(String(e.codigoClasificador))) ?? null;
}

// CAFC del piloto. El SIN pide uno «para los documentos que esta autorizando, asi
// como para las sucursales que probaran» (siatinfo, Emision y Envio) y cada CAFC
// autoriza un RANGO de numeros: una factura fuera de el vuelve con 1047 «Numero
// Factura Para El Cafc Enviado Incorrecto» (catalogo de errores, leido 2026-10-09).
//
// SIAT_PILOT_CAFC_FILE apunta a un JSON fuera de git (chmod 600):
//   [{ "sector": 1, "pv": 1, "cafc": "...", "desde": 1, "hasta": 15000 }]
// `sector` y `pv` son opcionales (sin ellos la entrada vale para todos) y gana la
// entrada mas especifica. `reusar: true` vuelve al inicio del rango al agotarlo:
// solo despues de comprobar con un paquete que el SIN acepta numeros repetidos.
// SIAT_PILOT_CAFC (un codigo suelto, sin rango) sigue valiendo para todo y se
// numera con el correlativo de la corrida, como antes.

const enmascararCafc = (cafc) => (cafc.length > 4 ? `${cafc.slice(0, 4)}...` : "****");

/** Valida la lista de CAFC del piloto y la deja normalizada. */
export function parseCafcConfig(lista) {
  if (!Array.isArray(lista)) throw new Error("CAFC del piloto: el archivo debe ser una lista JSON");
  const vistos = new Set();
  return lista.map((e, i) => {
    const donde = `CAFC del piloto, entrada ${i + 1}`;
    if (typeof e?.cafc !== "string" || !e.cafc.trim()) throw new Error(`${donde}: falta el codigo`);
    for (const campo of ["sector", "pv"]) {
      if (e[campo] != null && !Number.isInteger(e[campo])) throw new Error(`${donde}: ${campo} debe ser entero`);
    }
    const conRango = e.desde != null || e.hasta != null;
    if (conRango && !(Number.isInteger(e.desde) && Number.isInteger(e.hasta) && e.desde >= 1 && e.hasta >= e.desde)) {
      throw new Error(`${donde}: rango invalido (desde ${e.desde}, hasta ${e.hasta})`);
    }
    const clave = `${e.sector ?? "*"}/${e.pv ?? "*"}`;
    if (vistos.has(clave)) throw new Error(`${donde}: sector/PdV ${clave} repetido`);
    vistos.add(clave);
    return {
      sector: e.sector ?? null,
      pv: e.pv ?? null,
      cafc: e.cafc.trim(),
      desde: conRango ? e.desde : null,
      hasta: conRango ? e.hasta : null,
      reusar: e.reusar === true,
    };
  });
}

/** Entrada de CAFC que corresponde a un sector y PdV: gana la mas especifica. */
export function resolverCafc(entradas, { sector, pv }) {
  const aplica = (e) => (e.sector == null || e.sector === sector) && (e.pv == null || e.pv === pv);
  const peso = (e) => (e.sector != null ? 2 : 0) + (e.pv != null ? 1 : 0);
  return (entradas ?? []).filter(aplica).sort((a, b) => peso(b) - peso(a))[0] ?? null;
}

/** CAFC del ambiente: el archivo con rangos y el codigo suelto de siempre. */
export function cafcDesdeEnv(env, leer = (ruta) => readFileSync(ruta, "utf8")) {
  const lista = env.SIAT_PILOT_CAFC_FILE ? JSON.parse(leer(env.SIAT_PILOT_CAFC_FILE)) : [];
  if (env.SIAT_PILOT_CAFC) {
    if (!Array.isArray(lista)) throw new Error("CAFC del piloto: el archivo debe ser una lista JSON");
    lista.push({ cafc: env.SIAT_PILOT_CAFC });
  }
  return parseCafcConfig(lista);
}

/** Epoch corrido -> "yyyy-MM-ddTHH:mm:ss.SSS" (hora de pared del SIN). */
export function formatSinLocal(shiftedMs) {
  const d = new Date(shiftedMs);
  const p = (n, w = 2) => String(n).padStart(w, "0");
  return (
    `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}` +
    `T${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}.${p(d.getUTCMilliseconds(), 3)}`
  );
}

// ----------------------- factura de prueba (catalogo) -----------------------

/**
 * Arma el payload de una factura de prueba usando SOLO valores del catalogo
 * sincronizado: producto homologado (con su actividad), leyenda de esa
 * actividad, unidad de medida, metodo de pago y tipo de documento del receptor.
 * Montos chicos variados por indice. Receptor: NIT 99001 (4 de cada 5) o CI de
 * consumidor final (1 de cada 5).
 */
export function buildTestInvoice({ catalogs, nit, index, codigoPuntoVenta = 0, codigoDocumentoSector = 1 }) {
  const productos = catalogs?.productos ?? [];
  if (productos.length === 0) {
    throw new Error("catalogo de productos homologados vacio: sincronizar etapa II antes de emitir");
  }
  const producto = productos[index % productos.length];
  const actividad = producto.codigoActividad;
  const leyendas = catalogs?.leyendas ?? [];
  const leyenda =
    leyendas.find((l) => String(l.codigoActividad) === String(actividad)) ?? leyendas[0] ?? null;
  const unidad = (catalogs?.unidadesMedida ?? [])[0];
  const metodoPago = (catalogs?.metodosPago ?? [])[0];
  const tiposDoc = catalogs?.tiposDocIdentidad ?? [];
  const nitDoc = tiposDoc.find((t) => /(^|\s)NIT(\s|$)/i.test(t.descripcion ?? ""));
  const ciDoc = tiposDoc.find((t) => /CEDULA|CARNET|IDENTIDAD/i.test(t.descripcion ?? ""));

  const consumidorFinal = index % 5 === 4;
  const receptor = consumidorFinal
    ? {
        tipoDocumentoIdentidad: ciDoc?.codigoClasificador ?? 1,
        numeroDocumento: "1234567",
        razonSocial: "CONSUMIDOR FINAL",
      }
    : {
        tipoDocumentoIdentidad: nitDoc?.codigoClasificador ?? 5,
        numeroDocumento: NIT_PRUEBA_RECEPTOR,
        razonSocial: "PRUEBAS HOMOLOGACION SIAT",
      };

  const precio = 10 + (index % 90) + (index % 2 === 0 ? 0.5 : 0);
  const cantidad = 1 + (index % 3);

  // Sector 17: el XSD exige quirofano + medico en CADA linea. Valores de prueba
  // dentro de los rangos del XSD; el NIT del medico es el NIT de pruebas del SIN.
  const medico =
    codigoDocumentoSector === 17
      ? { nroQuirofanoSalaOperaciones: 1, nombreApellidoMedico: "MEDICO DE PRUEBAS", nitDocumentoMedico: NIT_PRUEBA_RECEPTOR }
      : {};

  const payload = buildInvoicePayload({
    emisor: {
      nit,
      sucursalCodigo: PILOT.codigoSucursal,
      puntoVentaCodigo: codigoPuntoVenta,
      actividadEconomica: actividad,
    },
    receptor,
    // Sin esto el CUF y la <cabecera> salian con sector 1 aunque el request
    // dijera 17: el piloto rechazaba el XML por la raiz (cvc-elt.1.a).
    documento: { tipoDocumentoSector: codigoDocumentoSector },
    items: [
      {
        actividadEconomica: actividad,
        codigoProductoSin: producto.codigoProducto,
        codigoProducto: `ONIA-${index + 1}`,
        descripcion: producto.descripcionProducto ?? "Servicio de prueba",
        cantidad,
        unidadMedida: unidad?.codigoClasificador ?? 58,
        precioUnitario: precio,
        ...medico,
      },
    ],
  });
  return {
    payload,
    leyenda: leyenda?.descripcionLeyenda ?? "Ley N° 453: Tienes derecho a un trato equitativo.",
    codigoMetodoPago: metodoPago?.codigoClasificador ?? 1,
  };
}

// ------------------------------ estado (IO) ---------------------------------

export function emptyState() {
  return {
    startedAt: null,
    sinOffsetMs: 0,
    hashMode: "xml", // "xml" | "gzip": sobre que bytes se calcula hashArchivo
    // CUIS y CUFD son POR sucursal+punto de venta: un mapa, no un valor suelto.
    cuisByPv: {}, // pv -> codigo CUIS
    cufdByPv: {}, // pv -> { codigo, codigoControl, fechaVigencia, obtenidoEn }
    ultimoEventoFin: null, // fin (timeline SIN) del ultimo evento registrado ok
    recepcionesLote: { VI: {}, IX: {} }, // caseId de validacion -> codigos de recepcion
    numeroFactura: null,
    catalogs: {},
    invoices: [], // { numero, cuf, codigoRecepcion, estado, anulada, revertida, combo }
    etapas: {}, // id -> { done, target, attempts, blockedCases: {}, cases: {} }
  };
}

/**
 * Migra un checkpoint viejo (cuis/cufd sueltos = solo PdV 0) al mapa por punto
 * de venta. Sin esto, retomar el estado del 6-ago perderia el CUIS ya obtenido
 * y volveria a pedirlo. Puro sobre una copia; no muta la entrada.
 */
export function migrateState(raw) {
  const state = { ...emptyState(), ...raw };
  state.recepcionesLote = {
    VI: { ...(raw?.recepcionesLote?.VI ?? {}) },
    IX: { ...(raw?.recepcionesLote?.IX ?? {}) },
  };
  // El checkpoint previo decia VI/IX completos por contar respuestas SOAP bajo
  // pv0/pv1. El portal demostro que esos numeros no representan sus 32/12 filas.
  // Se conservan como auditoria, pero no pueden saltar ni inflar los casos nuevos.
  state.etapas = { ...(state.etapas ?? {}) };
  for (const id of ["VI", "IX"]) {
    const etapa = state.etapas[id];
    if (!etapa) continue;
    const cases = { ...(etapa.cases ?? {}) };
    const blockedCases = { ...(etapa.blockedCases ?? {}) };
    const legacyCases = { ...(etapa.legacyCases ?? {}) };
    const legacyBlockedCases = { ...(etapa.legacyBlockedCases ?? {}) };
    for (const pv of PUNTOS_VENTA) {
      const key = `pv${pv}`;
      if (Object.hasOwn(cases, key)) {
        legacyCases[key] = cases[key];
        delete cases[key];
      }
      if (Object.hasOwn(blockedCases, key)) {
        legacyBlockedCases[key] = blockedCases[key];
        delete blockedCases[key];
      }
    }
    state.etapas[id] = { ...etapa, cases, blockedCases, legacyCases, legacyBlockedCases };
  }
  const pvLegado = String(DEFAULT_COMBO.codigoPuntoVenta);
  if (raw?.cuis && !state.cuisByPv[pvLegado]) {
    state.cuisByPv = { ...state.cuisByPv, [pvLegado]: raw.cuis };
  }
  if (raw?.cufd && !state.cufdByPv[pvLegado]) {
    state.cufdByPv = { ...state.cufdByPv, [pvLegado]: raw.cufd };
  }
  // Las facturas viejas son todas del combo por defecto (era el unico).
  state.invoices = (state.invoices ?? []).map((f) =>
    f.combo ? f : { ...f, combo: comboId(DEFAULT_COMBO) },
  );
  delete state.cuis;
  delete state.cufd;
  return state;
}

function loadState(file) {
  if (existsSync(file)) {
    return migrateState(JSON.parse(readFileSync(file, "utf8")));
  }
  return emptyState();
}

function saveState(file, state) {
  writeFileSync(file, JSON.stringify(state), "utf8");
}

// ------------------------------- runner (IO) --------------------------------

function sha256HexOf(bufferOrString) {
  return createHash("sha256").update(bufferOrString).digest("hex");
}

/** hashArchivo segun el modo: "xml" = SHA-256 del XML plano; "gzip" = del .gz. */
export function hashFor(mode, xmlString, gzipBuffer) {
  return mode === "gzip" ? sha256HexOf(gzipBuffer) : sha256HexOf(xmlString);
}

export function parseArgs(argv) {
  const args = { etapa: null, count: null, caseId: null, pace: 500, state: "fase1-state.json", log: "fase1-log.ndjson", retryBlocked: false, soloInforme: false, portalSnapshot: null };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--etapa") args.etapa = argv[++i];
    else if (a === "--count") args.count = Number(argv[++i]);
    else if (a === "--case") args.caseId = argv[++i];
    else if (a === "--pace") args.pace = Number(argv[++i]);
    else if (a === "--state") args.state = argv[++i];
    else if (a === "--log") args.log = argv[++i];
    else if (a === "--retry-blocked") args.retryBlocked = true;
    else if (a === "--solo-informe") args.soloInforme = true;
    else if (a === "--portal-snapshot") args.portalSnapshot = argv[++i];
  }
  return args;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Validacion inmediata de cada paquete: el piloto contesto 908 a los ~29 s el 30-sep.
// 6 intentos x 10 s cubren ~1 min antes de dejarlo anotado como 901 pendiente.
export const VALIDACION_INMEDIATA_INTENTOS = 6;
export const VALIDACION_INMEDIATA_ESPERA_MS = 10_000;

class Runner {
  constructor({ token, nit, codigoSistema, stateFile, logFile, pace, firma = null, cafc = null, cafcs = null, caseFilter = null }) {
    this.token = token;
    this.nit = nit;
    this.codigoSistema = codigoSistema;
    this.stateFile = stateFile;
    this.logFile = logFile;
    this.pace = pace;
    // { privateKeyPem, certificatePem } para la etapa VIII. NUNCA se loguea.
    this.firma = firma;
    // CAFC del piloto por sector/PdV (ver parseCafcConfig). `cafc` suelto = uno para todo.
    this.cafcs = cafcs ?? (cafc ? parseCafcConfig([{ cafc }]) : []);
    this.caseFilter = caseFilter;
    this.state = loadState(stateFile);
    // Combo (PdV + documento sector + tipo de factura) que se esta corriendo.
    // Las etapas lo cambian con withCombo(); todo lo demas lo LEE de aca.
    this.combo = { ...DEFAULT_COMBO };
    if (!this.state.startedAt) {
      this.state.startedAt = new Date().toISOString();
    }
    if (!this.state.numeroFactura) {
      // Correlativo unico por corrida (evita chocar con pruebas previas del dia).
      this.state.numeroFactura = Math.floor(Date.now() / 1000) % 1_000_000_000;
    }
  }

  /** Corre `fn` con el combo dado y restaura el anterior pase lo que pase. */
  async withCombo(combo, fn) {
    const previo = this.combo;
    this.combo = { ...DEFAULT_COMBO, ...combo };
    try {
      return await fn();
    } finally {
      this.combo = previo;
    }
  }

  /** Punto de venta del combo actual, como clave del estado. */
  get pvKey() {
    return String(this.combo.codigoPuntoVenta);
  }

  /** true si el combo actual es de la modalidad electronica (etapa VIII). */
  get esElectronica() {
    return this.combo.codigoModalidad === MODALIDAD_ELECTRONICA;
  }

  /** codigoModalidad del combo actual (default: computarizada del piloto). */
  get modalidadCode() {
    return this.combo.codigoModalidad ?? PILOT.codigoModalidad;
  }

  /** Servicio SOAP que corresponde al documento sector Y modalidad del combo actual. */
  get servicio() {
    const mapa = this.esElectronica ? SERVICIO_POR_DOC_SECTOR_ELECTRONICA : SERVICIO_POR_DOC_SECTOR;
    const key = mapa[this.combo.codigoDocumentoSector];
    if (!key) {
      throw new Error(
        `sin servicio SOAP mapeado para el documento sector ${this.combo.codigoDocumentoSector}`,
      );
    }
    if (DOC_SECTOR_SIN_SOPORTE.has(this.combo.codigoDocumentoSector)) {
      throw new Error(
        `documento sector ${this.combo.codigoDocumentoSector} usa ${key}, cuyas operaciones ` +
          "son recepcionDocumentoAjuste/anulacionDocumentoAjuste/reversionAnulacionDocumentoAjuste " +
          "y todavia no estan mapeadas en soap-client",
      );
    }
    return key;
  }

  /** Builders y nombres de operacion (recepcion/anulacion/reversion) del sector actual. */
  get ops() {
    return this.combo.codigoDocumentoSector === DOC_SECTOR_AJUSTE ? OPS_AJUSTE : OPS_FACTURA;
  }

  get cuis() {
    return this.state.cuisByPv[this.pvKey] ?? null;
  }

  set cuis(codigo) {
    this.state.cuisByPv[this.pvKey] = codigo;
  }

  get cufd() {
    return this.state.cufdByPv[this.pvKey] ?? null;
  }

  set cufd(value) {
    this.state.cufdByPv[this.pvKey] = value;
  }

  log(entry) {
    appendFileSync(this.logFile, `${JSON.stringify({ ts: new Date().toISOString(), ...entry })}\n`);
  }

  checkpoint() {
    saveState(this.stateFile, this.state);
  }

  etapaState(id, target) {
    if (!this.state.etapas[id]) {
      this.state.etapas[id] = { done: 0, target, attempts: 0, cases: {}, blockedCases: {} };
    }
    this.state.etapas[id].target = target;
    return this.state.etapas[id];
  }

  requirePortalReconciliation(id) {
    const etapa = this.state.etapas[id];
    if (!etapa?.portalReconciledAt) {
      throw new Error(
        `${id}: sin marcador conciliado con las filas del SIN. ` +
          "Conciliar primero el portal actual con --portal-snapshot; no reenviar a ciegas.",
      );
    }
  }

  guardarRecepcion(id, validationKey, result) {
    const codigo = result?.parsed?.codigoRecepcion;
    if (!result?.ok || result?.parsed?.transaccion === false || !codigo) {
      return result?.ok
        ? { ...result, ok: false, error: "missing_receipt", parsed: {
            ...result.parsed,
            transaccion: false,
            mensajes: [{ codigo: "REC", descripcion: "recepcion sin codigoRecepcion" }],
          } }
        : result;
    }
    const porEtapa = (this.state.recepcionesLote ??= { VI: {}, IX: {} });
    (porEtapa[id] ??= {});
    (porEtapa[id][validationKey] ??= []).push(codigo);
    return result;
  }

  /**
   * Valida EN EL ACTO el paquete/masiva que se acaba de recibir, aunque la fila de
   * validacion del portal ya este llena. Por que (30-sep-2026): no sabiamos si el
   * portal acredita la recepcion (901) o solo lo validado (908); validar cada
   * paquete sirve en los dos casos y cuesta 1 SOAP de lectura.
   * - 908: queda anotado. 901: se reintenta (el piloto suele tardar segundos).
   * - Sigue en 901 tras los reintentos: el paquete cuenta igual; queda anotado.
   * - Cualquier otro estado (p.ej. 904 rechazado): se BLOQUEA el caso para no
   *   mandar mas paquetes iguales. El que ya se recibio cuenta.
   * No toca el contador de la fila de validacion (eso lo hace su propio loop).
   */
  async validarInmediata(id, caseId, codigoRecepcion, op) {
    const espera = this.validacionEsperaMs ?? VALIDACION_INMEDIATA_ESPERA_MS;
    let estado = null;
    for (let intento = 1; intento <= VALIDACION_INMEDIATA_INTENTOS; intento += 1) {
      if (intento > 1 && espera > 0) await sleep(espera);
      const result = await this.post(this.servicio, buildRunnerEnvelope(op, {
        ...this.recepcionBase(id === "VI" ? 2 : 3),
        codigoRecepcion,
      }), { etapa: id, op, case: caseId, inmediata: true, intento });
      estado = result.ok ? result.parsed?.codigoEstado ?? null : null;
      if (!result.ok) estado = `error:${result.error ?? result.status ?? "?"}`;
      if (estado !== 901) break;
    }
    const porEtapa = (this.state.validacionesInmediatas ??= { VI: {}, IX: {} });
    (porEtapa[id] ??= {})[codigoRecepcion] = estado;
    if (estado !== 908 && estado !== 901) {
      const etapa = this.state.etapas[id];
      etapa.blockedCases[caseId] = {
        key: "validacion_rechazada",
        mensaje: { codigo: String(estado), descripcion: `validacion inmediata de ${codigoRecepcion} sin 908` },
      };
      this.log({ etapa: id, case: caseId, blocked: "validacion_rechazada", codigoRecepcion, codigoEstado: estado });
    }
    return estado;
  }

  async validarRecepcion(id, validationKey, done, op) {
    const baseline = this.state.etapas[id]?.portalCases?.[validationKey];
    if (baseline == null && done > 0) {
      throw new Error(`${id}.${validationKey}: falta el contador inicial del portal; revisar checkpoint antes de validar`);
    }
    // `done` incluye validaciones ya hechas en el portal; la cola contiene solo
    // recepciones posteriores a la conciliacion. El indice debe ser local.
    const index = done - (baseline ?? 0);
    if (!Number.isInteger(index) || index < 0) {
      throw new Error(`${id}.${validationKey}: contador menor al marcador conciliado`);
    }
    const codigoRecepcion = this.state.recepcionesLote?.[id]?.[validationKey]?.[index];
    if (!codigoRecepcion) {
      throw new TransitorioError(`${id}.${validationKey}: faltan recepciones para validar; completar primero sus casos`);
    }
    await this.ensureCufd();
    const result = await this.post(this.servicio, buildRunnerEnvelope(op, {
      ...this.recepcionBase(id === "VI" ? 2 : 3),
      codigoRecepcion,
    }), { etapa: id, op, case: validationKey });
    if (result.ok && result.parsed?.transaccion !== false && result.parsed?.codigoEstado === 908) return result;
    if (result.ok && result.parsed?.codigoEstado === 901) {
      throw new TransitorioError(`${id}.${validationKey}: recepcion pendiente (901); reintentar validacion`);
    }
    if (result.ok) {
      return { ...result, ok: false, error: "validation_not_908", parsed: {
        ...result.parsed,
        transaccion: false,
        mensajes: [{ codigo: result.parsed?.codigoEstado ?? "VAL", descripcion: "validacion sin 908 VALIDADA" }],
      } };
    }
    return result;
  }

  /**
   * Reintento de casos bloqueados: limpia blockedCases de las etapas dadas para
   * que una corrida nueva los vuelva a intentar (p.ej. tras un fix de codigo,
   * como el 984 de eventos que se corrigio DESPUES de que V quedara bloqueada).
   */
  clearBlocked(stageIds) {
    for (const id of stageIds) {
      const etapa = this.state.etapas[id];
      if (etapa && Object.keys(etapa.blockedCases ?? {}).length > 0) {
        this.log({ etapa: id, op: "retry_blocked", cleared: Object.keys(etapa.blockedCases) });
        etapa.blockedCases = {};
      }
    }
    this.checkpoint();
  }

  baseParams() {
    return {
      codigoAmbiente: PILOT.codigoAmbiente,
      codigoSistema: this.codigoSistema,
      codigoSucursal: PILOT.codigoSucursal,
      codigoPuntoVenta: this.combo.codigoPuntoVenta,
      nit: this.nit,
    };
  }

  recepcionBase(codigoEmision = 1) {
    return {
      ...this.baseParams(),
      codigoDocumentoSector: this.combo.codigoDocumentoSector,
      codigoEmision,
      codigoModalidad: this.modalidadCode,
      cufd: this.cufd?.codigo,
      cuis: this.cuis,
      tipoFacturaDocumento: this.combo.tipoFacturaDocumento,
    };
  }

  sinNow() {
    return formatSinLocal(Date.now() + (this.state.sinOffsetMs ?? 0));
  }

  async post(serviceKey, envelope, meta) {
    const started = Date.now();
    const result = await postSoap({
      endpoint: soapEndpoint(PILOT.environment, serviceKey),
      envelope,
      token: this.token,
      fetchImpl: globalThis.fetch,
      timeoutMs: timeoutFor(serviceKey),
    });
    const parsed = result.parsed ?? {};
    this.log({
      ...meta,
      ok: result.ok,
      status: result.status,
      error: result.error,
      transaccion: parsed.transaccion ?? null,
      codigoEstado: parsed.codigoEstado ?? null,
      codigoRecepcion: parsed.codigoRecepcion ?? null,
      sin: (parsed.mensajes ?? []).map((m) => `${m.codigo}:${m.descripcion}`).slice(0, 3),
      ms: Date.now() - started,
    });
    await sleep(this.pace);
    return result;
  }

  /**
   * Loop generico de una etapa: ejecuta `fn(i)` hasta `target` exitos, con la
   * regla de STOP (5 errores identicos consecutivos) y tope de intentos (3x).
   * `caseId` aisla la racha (etapas por caso saltan el caso en vez de abortar).
   */
  async loop(etapaId, target, fn, { caseId = null } = {}) {
    const etapa = this.etapaState(etapaId, target);
    const doneOf = () => (caseId ? etapa.cases[caseId] ?? 0 : etapa.done);
    const bump = () => {
      if (caseId) {
        etapa.cases[caseId] = (etapa.cases[caseId] ?? 0) + 1;
      } else {
        etapa.done += 1;
      }
    };
    if (caseId && etapa.blockedCases[caseId]) {
      return; // caso ya bloqueado en una corrida anterior
    }
    let streak = { key: null, count: 0 };
    let attempts = 0;
    const maxAttempts = target * 3;
    // El caso puede bloquearse DENTRO de fn (validacion inmediata rechazada): cortar ahi.
    while (doneOf() < target && attempts < maxAttempts && !(caseId && etapa.blockedCases[caseId])) {
      attempts += 1;
      etapa.attempts += 1;
      // Un prerequisito faltante (p.ej. sin CUFD para ese punto de venta)
      // LANZA antes de tocar la red. Sin este catch se lleva puesta la etapa
      // entera y los otros casos ni se intentan — que es justo lo que paso al
      // correr la etapa IV con el PdV 1 inexistente (SIN 933).
      let result;
      try {
        result = await fn(doneOf());
      } catch (err) {
        if (err instanceof StopError) throw err;
        // Un prerequisito TRANSITORIO se cura con el reloj (la ventana del evento
        // significativo necesita ~2 min desde el CUFD). Se deja el caso SIN
        // bloquear y se corta la corrida actual: la siguiente lo toma sola, sin
        // depender de que alguien se acuerde de pasar --retry-blocked.
        if (err instanceof TransitorioError) {
          this.log({ etapa: etapaId, case: caseId, transitorio: err.message });
          this.checkpoint();
          return;
        }
        // Un prerequisito faltante es DETERMINISTA (no hay servicio mapeado, no
        // hay CUFD para ese PdV): reintentarlo 3 veces es quemar tiempo. Se
        // bloquea el caso en el acto, con el motivo escrito en el checkpoint,
        // y la etapa sigue con los demas casos.
        const mensaje = { codigo: "PRE", descripcion: err.message };
        if (caseId) {
          etapa.blockedCases[caseId] = { key: "prerequisito", mensaje };
          this.log({ etapa: etapaId, case: caseId, blocked: "prerequisito", detalle: err.message });
          this.checkpoint();
          return;
        }
        result = {
          ok: false,
          error: "prerequisito",
          parsed: { transaccion: false, mensajes: [mensaje] },
        };
      }
      const key = errorKey(result);
      streak = updateStreak(streak, key);
      if (key == null) {
        bump();
      } else if (streak.count >= STOP_THRESHOLD) {
        if (caseId) {
          etapa.blockedCases[caseId] = { key: streak.key, mensaje: result?.parsed?.mensajes?.[0] ?? null };
          this.log({ etapa: etapaId, case: caseId, blocked: streak.key });
          this.checkpoint();
          return;
        }
        this.checkpoint();
        throw new StopError(etapaId, streak, result);
      }
      this.checkpoint();
    }
    if (doneOf() < target) {
      this.log({ etapa: etapaId, case: caseId, attempt_cap: attempts, done: doneOf(), target });
    }
  }

  // --------------------------- etapas ---------------------------------------

  /** CUIS es POR sucursal+PdV: una corrida por punto de venta (total = 2). */
  async etapaI(target = STAGE_TARGETS.I) {
    for (const pv of PUNTOS_VENTA) {
      await this.withCombo({ codigoPuntoVenta: pv }, () =>
        this.loop(
          "I",
          target,
          async () => {
            const envelope = buildCuisRequest({
              ...this.baseParams(),
              codigoModalidad: this.modalidadCode,
            });
            const raw = await this.post("FACTURACION_CODIGOS", envelope, {
              etapa: "I",
              op: "cuis",
              pv,
            });
            const result = normalizeCuisResult(raw); // SIN 980 devuelve el vigente: cuenta
            if (result.ok && result.parsed?.codigo) {
              this.cuis = result.parsed.codigo;
            }
            return result;
          },
          { caseId: `pv${pv}` },
        ),
      );
    }
  }

  async syncOnce(op, catalogKey) {
    const envelope = buildRunnerEnvelope(op, { ...this.baseParams(), cuis: this.cuis });
    const result = await this.post("FACTURACION_SINCRONIZACION", envelope, { etapa: "II", op });
    if (result.ok) {
      if (catalogKey === "fechaHora") {
        const fh = tagText(result.body, "fechaHora");
        const offset = computeSinOffset(fh, Date.now());
        if (offset != null) {
          this.state.sinOffsetMs = offset;
        }
      } else if (!this.state.catalogs[catalogKey]?.length) {
        this.state.catalogs[catalogKey] = extractSyncItems(result.body);
      }
    }
    return result;
  }

  /** Sync por catalogo Y por PdV (18 ops x 50 x 2 PdV = 1800). */
  async etapaII(target = STAGE_TARGETS.II, { cases = SYNC_CASES } = {}) {
    for (const pv of PUNTOS_VENTA) {
      await this.withCombo({ codigoPuntoVenta: pv }, async () => {
        for (const [op, catalogKey] of cases) {
          await this.loop("II", target, () => this.syncOnce(op, catalogKey), {
            caseId: `${op}-pv${pv}`,
          });
        }
      });
    }
  }

  /** Sincroniza 1x cada catalogo que las etapas de emision necesitan (para el gate). */
  async syncEssentials() {
    const essentials = SYNC_CASES.filter(([, key]) =>
      ["fechaHora", "actividades", "leyendas", "productos", "motivosAnulacion", "tiposDocIdentidad", "metodosPago", "tiposMoneda", "unidadesMedida", "eventos"].includes(key),
    );
    for (const [op, catalogKey] of essentials) {
      await this.syncOnce(op, catalogKey);
    }
  }

  /**
   * Garantiza un CUFD vigente para el punto de venta actual. NO cuenta para la
   * etapa III: es infraestructura de la corrida, no una prueba. Sin esto, una
   * corrida al dia siguiente emite con el CUFD de ayer y el SIN la rechaza
   * entera con "CUFD FUERA DE TOLERANCIA".
   */
  async ensureCufd() {
    const ahora = Date.now() + (this.state.sinOffsetMs ?? 0);
    if (!cufdVencido(this.cufd, ahora)) {
      return this.cufd;
    }
    if (!this.cuis) {
      throw new Error(`sin CUIS para el punto de venta ${this.pvKey}: correr la etapa I antes`);
    }
    const envelope = buildCufdRequest({
      ...this.baseParams(),
      codigoModalidad: this.modalidadCode,
      cuis: this.cuis,
    });
    const result = await this.post("FACTURACION_CODIGOS", envelope, {
      etapa: "infra",
      op: "cufd_refresh",
      pv: this.combo.codigoPuntoVenta,
    });
    if (!result.ok || !result.parsed?.codigo) {
      const msg = (result.parsed?.mensajes ?? [])[0]?.descripcion ?? result.error ?? "sin detalle";
      throw new Error(`no se pudo renovar el CUFD del punto de venta ${this.pvKey}: ${msg}`);
    }
    this.cufd = {
      codigo: result.parsed.codigo,
      codigoControl: result.parsed.codigoControl,
      fechaVigencia: result.parsed.fechaVigencia,
      obtenidoEn: Date.now() + (this.state.sinOffsetMs ?? 0),
    };
    this.checkpoint();
    return this.cufd;
  }

  /** CUFD tambien es por sucursal+PdV: una corrida por punto de venta. */
  async etapaIII(target = STAGE_TARGETS.III) {
    for (const pv of PUNTOS_VENTA) {
      await this.withCombo({ codigoPuntoVenta: pv }, () =>
        this.loop(
          "III",
          target,
          async () => {
            const envelope = buildCufdRequest({
              ...this.baseParams(),
              codigoModalidad: this.modalidadCode,
              cuis: this.cuis,
            });
            const result = await this.post("FACTURACION_CODIGOS", envelope, {
              etapa: "III",
              op: "cufd",
              pv,
            });
            if (result.ok && result.parsed?.codigo) {
              this.cufd = {
                codigo: result.parsed.codigo,
                codigoControl: result.parsed.codigoControl,
                fechaVigencia: result.parsed.fechaVigencia,
                // Timeline SIN: eventWindow lo usa para no fechar eventos antes
                // de que este CUFD exista (SIN 984).
                obtenidoEn: Date.now() + (this.state.sinOffsetMs ?? 0),
              };
            }
            return result;
          },
          { caseId: `pv${pv}` },
        ),
      );
    }
  }

  /**
   * Firma el XML del material (etapa VIII) y re-deriva el archivo gzip+base64.
   * El hashArchivo lo recalcula recepcionRequestFor sobre el XML FIRMADO: lo
   * que viaja y lo que se hashea son los mismos bytes.
   */
  signMaterial(material) {
    if (!this.firma) {
      throw new Error(
        "modalidad electronica sin certificado: definir SIAT_FIRMA_KEY_FILE y SIAT_FIRMA_CERT_FILE",
      );
    }
    const xml = signInvoiceXml(material.xml, this.firma);
    return { ...material, xml, archivo: gzipSync(Buffer.from(xml, "utf8")).toString("base64") };
  }

  buildEmisionMaterial(index, { fechaEmision } = {}) {
    const { payload, leyenda, codigoMetodoPago } = buildTestInvoice({
      catalogs: this.state.catalogs,
      nit: this.nit,
      index,
      codigoPuntoVenta: this.combo.codigoPuntoVenta,
      codigoDocumentoSector: this.combo.codigoDocumentoSector,
    });
    const numeroFactura = ++this.state.numeroFactura;
    const fecha = fechaEmision ?? this.sinNow();
    // La modalidad del combo manda: assembleEmission deriva de ella el digito
    // del CUF, la raiz del XML (facturaElectronica*) y el codigoModalidad.
    const modalidad = this.esElectronica ? MODALITIES.ELECTRONICA_EN_LINEA : undefined;
    let material = assembleEmission({
      payload,
      tenant: { emisor: { nit: this.nit, codigoSistema: this.codigoSistema, ...EMISOR_PRUEBA, ...(modalidad ? { modalidad } : {}) } },
      cufd: this.cufd,
      cuis: this.cuis,
      numeroFactura,
      fechaEmision: fecha,
      environment: PILOT.environment,
      leyenda,
      codigoMetodoPago,
      usuario: "onia",
    });
    if (this.esElectronica) {
      material = this.signMaterial(material);
    }
    // `datos` es lo que una nota de ajuste (sector 24) necesita de su factura
    // original: sin esto las facturas viejas del estado no sirven de original.
    const datos = { fechaEmision: fecha, receptor: payload.receptor, items: payload.items, montoTotal: payload.montoTotal, leyenda };
    return { material, numeroFactura, datos };
  }

  /**
   * Factura original para una nota de ajuste: una compra-venta validada del
   * MISMO PdV, con `datos` y todavia sin nota. Si no hay, emite una (el SIN la
   * cuenta en el caso pv-ds1-tf1, que topea en 125: no molesta).
   */
  async originalParaNota() {
    // La original hereda la MODALIDAD de la nota: una nota electronica ajusta
    // una compra-venta electronica (y su emision suma al caso ds1 de la VIII).
    const comboOriginal = {
      codigoPuntoVenta: this.combo.codigoPuntoVenta,
      ...DOC_SECTOR_CASES[0],
      ...(this.esElectronica ? { codigoModalidad: MODALIDAD_ELECTRONICA } : {}),
    };
    const libre = (f) =>
      f.combo === comboId(comboOriginal) && !f.anulada && !f.ajustada && f.datos && (f.estado === 908 || f.estado === 901);
    if (!this.state.invoices.some(libre)) {
      const result = await this.withCombo(comboOriginal, () => this.emitOne(this.state.invoices.length));
      if (!result.ok) {
        const msg = (result.parsed?.mensajes ?? [])[0]?.descripcion ?? result.error ?? "sin detalle";
        throw new Error(`sin factura original para la nota de ajuste (fallo la compra-venta previa): ${msg}`);
      }
    }
    const original = this.state.invoices.find(libre);
    if (!original) {
      throw new Error("sin factura original validada (908/901) para la nota de ajuste");
    }
    return original;
  }

  /**
   * Nota de credito-debito (sector 24) que devuelve ENTERA una factura original.
   * Reglas del SIN (validaciones documento sector 24): montoTotalOriginal =
   * sum(subTotal con codigoDetalleTransaccion 1) = la factura original;
   * montoTotalDevuelto = sum(subTotal con 2) - montoDescuentoCreditoDebito;
   * montoEfectivoCreditoDebito = montoTotalDevuelto x 0.13. El XSD exige minimo 2
   * lineas: las originales (1) y las devueltas (2). Numeracion propia
   * (numeroNotaCreditoDebito) y CUF con tipoFactura 3 / sector 24.
   */
  buildNotaMaterial(original) {
    const d = original.datos;
    const fecha = this.sinNow();
    const numero = ++this.state.numeroFactura;
    const cuf = buildCuf(
      {
        nit: this.nit,
        fechaHora: fecha.replace(/[-T:.]/g, ""),
        sucursal: PILOT.codigoSucursal,
        modalidad: this.modalidadCode,
        tipoEmision: 1,
        tipoFactura: this.combo.tipoFacturaDocumento,
        tipoDocumentoSector: this.combo.codigoDocumentoSector,
        numeroFactura: numero,
        puntoVenta: this.combo.codigoPuntoVenta,
      },
      this.cufd.codigoControl,
    );
    const linea = (item, codigoDetalleTransaccion) => ({
      actividadEconomica: item.actividadEconomica,
      codigoProductoSin: item.codigoProductoSin,
      codigoProducto: item.codigoProducto,
      descripcion: item.descripcion,
      cantidad: item.cantidad,
      unidadMedida: item.unidadMedida,
      precioUnitario: item.precioUnitario,
      subTotal: item.subtotal,
      codigoDetalleTransaccion,
    });
    const cabecera = {
      nitEmisor: this.nit,
      razonSocialEmisor: EMISOR_PRUEBA.razonSocial,
      municipio: EMISOR_PRUEBA.municipio,
      telefono: EMISOR_PRUEBA.telefono,
      numeroNotaCreditoDebito: numero,
      cuf,
      cufd: this.cufd.codigo,
      codigoSucursal: PILOT.codigoSucursal,
      direccion: EMISOR_PRUEBA.direccion,
      codigoPuntoVenta: this.combo.codigoPuntoVenta,
      fechaEmision: fecha,
      nombreRazonSocial: d.receptor.razonSocial,
      codigoTipoDocumentoIdentidad: d.receptor.tipoDocumentoIdentidad,
      numeroDocumento: d.receptor.numeroDocumento,
      codigoCliente: d.receptor.numeroDocumento,
      numeroFactura: original.numero,
      numeroAutorizacionCuf: original.cuf,
      fechaEmisionFactura: d.fechaEmision,
      montoTotalOriginal: d.montoTotal,
      montoTotalDevuelto: d.montoTotal,
      montoEfectivoCreditoDebito: round2(d.montoTotal * 0.13),
      leyenda: d.leyenda,
      usuario: "onia",
      codigoDocumentoSector: this.combo.codigoDocumentoSector,
    };
    const detalle = [...d.items.map((i) => linea(i, 1)), ...d.items.map((i) => linea(i, 2))];
    const xml = buildInvoiceXml(
      { cabecera, detalle },
      { modality: this.esElectronica ? MODALITIES.ELECTRONICA_EN_LINEA : "computarizada_en_linea" },
    );
    const archivo = gzipSync(Buffer.from(xml, "utf8")).toString("base64");
    const material = { cuf, xml, archivo };
    return {
      material: this.esElectronica ? this.signMaterial(material) : material,
      numeroFactura: numero,
      original,
    };
  }

  /** Material del combo actual: factura (sectores 1 y 17) o nota de ajuste (24). */
  async buildMaterialFor(index) {
    if (this.combo.codigoDocumentoSector === DOC_SECTOR_AJUSTE) {
      return this.buildNotaMaterial(await this.originalParaNota());
    }
    return this.buildEmisionMaterial(index);
  }

  /** Reconstruye el request de recepcion (del sector actual) con el hash del modo vigente. */
  recepcionRequestFor(material) {
    const gzipBuffer = Buffer.from(material.archivo, "base64");
    return this.ops.recepcion.build({
      ...this.recepcionBase(1),
      archivo: material.archivo,
      fechaEnvio: this.sinNow(),
      hashArchivo: hashFor(this.state.hashMode, material.xml, gzipBuffer),
    });
  }

  async emitOne(index) {
    await this.ensureCufd();
    const etapa = this.esElectronica ? "VIII" : "IV";
    const { material, numeroFactura, datos, original } = await this.buildMaterialFor(index);
    const result = await this.post(this.servicio, this.recepcionRequestFor(material), {
      etapa,
      op: this.ops.recepcion.op,
      numeroFactura,
    });
    // Autocalibracion del hash: si el SIN observa el hash en modo "xml", probar
    // "gzip" una vez y quedarse con el modo que funcione (se persiste).
    if (
      !result.ok &&
      this.state.hashMode === "xml" &&
      (result.parsed?.mensajes ?? []).some((m) => /HASH/i.test(m.descripcion ?? ""))
    ) {
      this.state.hashMode = "gzip";
      this.log({ etapa, op: "hash_mode_switch", to: "gzip" });
      return this.emitOne(index);
    }
    if (result.ok && result.parsed?.transaccion === true) {
      this.state.invoices.push({
        numero: numeroFactura,
        cuf: material.cuf,
        codigoRecepcion: result.parsed.codigoRecepcion ?? null,
        estado: result.parsed.codigoEstado ?? null,
        anulada: false,
        revertida: false,
        // Sin esto, la anulacion (VII) y la reversion (XI) tomarian una factura
        // de OTRO combo y el caso del SIN nunca cerraria.
        combo: comboId(this.combo),
        ...(datos ? { datos } : {}),
      });
      if (original) {
        original.ajustada = true; // una nota por factura original
      }
    }
    return result;
  }

  /** Emision individual: 125 por cada una de las 6 combinaciones -> 750. */
  async etapaIV(target = STAGE_TARGETS.IV) {
    for (const combo of EMISION_CASES) {
      await this.withCombo(combo, () =>
        this.loop("IV", target, (done) => this.emitOne(done), { caseId: comboId(combo) }),
      );
    }
  }

  /** Ventana de evento valida para el CUFD ACTUAL (el que va como cufdEvento). */
  eventWindowNow() {
    return eventWindow({
      nowSinMs: Date.now() + (this.state.sinOffsetMs ?? 0),
      cufdDesdeMs: cufdVigenteDesde(this.cufd),
      minInicioMs: this.state.ultimoEventoFin ?? null,
    });
  }

  async registrarEvento(motivo, { inicioMs, finMs, etapa = "V" } = {}) {
    let win;
    if (inicioMs != null && finMs != null) {
      win = { inicioMs, finMs };
    } else {
      // Eventos back-to-back consumen ~60s de "tiempo de evento" por ~1s de
      // pared: la ventana se agota y eventWindow lanza. Esperar 3s la vuelve
      // valida (fin=now-1s avanza con la pared). Si aun asi no hay ventana,
      // devolver un error de racha en vez de matar la corrida entera.
      try {
        win = this.eventWindowNow();
      } catch {
        await sleep(3000);
        try {
          win = this.eventWindowNow();
        } catch (err) {
          this.log({ etapa, op: "registroEventoSignificativo", motivo: motivo.codigoClasificador, window_error: err.message });
          return { ok: false, error: "window", parsed: { transaccion: false, mensajes: [{ codigo: "WIN", descripcion: err.message }] } };
        }
      }
    }
    const envelope = buildRunnerEnvelope("registroEventoSignificativo", {
      ...this.baseParams(),
      codigoMotivoEvento: motivo.codigoClasificador,
      cufd: this.cufd?.codigo,
      cufdEvento: this.cufd?.codigo,
      cuis: this.cuis,
      descripcion: motivo.descripcion ?? `Evento ${motivo.codigoClasificador}`,
      fechaHoraInicioEvento: formatSinLocal(win.inicioMs),
      fechaHoraFinEvento: formatSinLocal(win.finMs),
    });
    const result = await this.post("FACTURACION_OPERACIONES", envelope, {
      etapa,
      op: "registroEventoSignificativo",
      motivo: motivo.codigoClasificador,
    });
    if (result.ok && result.parsed?.transaccion === true) {
      // SIN 981: el proximo evento no puede solapar este rango -> avanzar el piso.
      this.state.ultimoEventoFin = Math.max(this.state.ultimoEventoFin ?? 0, win.finMs);
    }
    return result;
  }

  async etapaV(target = STAGE_TARGETS.V) {
    const motivos = this.state.catalogs.eventos ?? [];
    if (motivos.length === 0) {
      throw new Error("catalogo de eventos significativos vacio: correr etapa II antes");
    }
    for (const pv of PUNTOS_VENTA) {
      await this.withCombo({ codigoPuntoVenta: pv }, async () => {
        for (const motivo of motivos) {
          await this.loop("V", target, () => this.registrarEvento(motivo), {
            caseId: `motivo-${motivo.codigoClasificador}-pv${pv}`,
          });
        }
      });
    }
  }

  /**
   * Reserva `cantidad` numeros del rango del CAFC y devuelve el primero; null si
   * el CAFC no trae rango (se numera con el correlativo). Lanza si no alcanza, y
   * `soloVerificar` mira sin gastar: el rango se controla ANTES de registrar el
   * evento, para no gastar un evento en un paquete que no se puede armar.
   */
  reservarNumerosCafc(entrada, cantidad, { soloVerificar = false } = {}) {
    if (!entrada || entrada.desde == null) return null;
    const siguientes = (this.state.cafcSiguiente ??= {});
    let desde = siguientes[entrada.cafc] ?? entrada.desde;
    if (desde + cantidad - 1 > entrada.hasta) {
      if (!entrada.reusar || entrada.desde + cantidad - 1 > entrada.hasta) {
        throw new Error(
          `CAFC ${enmascararCafc(entrada.cafc)}: rango ${entrada.desde}-${entrada.hasta} agotado ` +
            `(sigue el ${desde} y el paquete pide ${cantidad})`,
        );
      }
      desde = entrada.desde;
    }
    if (!soloVerificar) siguientes[entrada.cafc] = desde + cantidad;
    return desde;
  }

  /** Paquete/masiva: N facturas -> tar -> gzip -> base64 + hash del modo vigente. */
  buildLote(count, { tipoEmision, baseIndex, fechaIso = null, cafc = null, numeroDesde = null }) {
    const xmls = [];
    for (let i = 0; i < count; i += 1) {
      const { payload, leyenda, codigoMetodoPago } = buildTestInvoice({
        catalogs: this.state.catalogs,
        nit: this.nit,
        index: baseIndex + i,
        codigoPuntoVenta: this.combo.codigoPuntoVenta,
        codigoDocumentoSector: this.combo.codigoDocumentoSector,
      });
      // Con CAFC el numero sale de su rango (SIN 1047); si no, del correlativo.
      const numeroFactura = numeroDesde != null ? numeroDesde + i : ++this.state.numeroFactura;
      const fecha17 = fechaIso ?? this.sinNow();
      const cuf = buildCuf(
        {
          nit: this.nit,
          fechaHora: fecha17.replace(/[-T:.]/g, ""),
          sucursal: PILOT.codigoSucursal,
          modalidad: PILOT.codigoModalidad,
          tipoEmision,
          tipoFactura: this.combo.tipoFacturaDocumento,
          tipoDocumentoSector: this.combo.codigoDocumentoSector,
          numeroFactura,
          puntoVenta: this.combo.codigoPuntoVenta,
        },
        this.cufd.codigoControl,
      );
      const cabecera = {
        nitEmisor: this.nit,
        razonSocialEmisor: EMISOR_PRUEBA.razonSocial,
        municipio: EMISOR_PRUEBA.municipio,
        numeroFactura,
        cuf,
        cufd: this.cufd.codigo,
        codigoSucursal: PILOT.codigoSucursal,
        direccion: EMISOR_PRUEBA.direccion,
        codigoPuntoVenta: this.combo.codigoPuntoVenta,
        fechaEmision: fecha17,
        nombreRazonSocial: payload.receptor.razonSocial,
        codigoTipoDocumentoIdentidad: payload.receptor.tipoDocumentoIdentidad,
        numeroDocumento: payload.receptor.numeroDocumento,
        codigoCliente: payload.receptor.numeroDocumento,
        codigoMetodoPago,
        montoTotal: payload.montoTotal,
        montoTotalSujetoIva: payload.montoTotal,
        codigoMoneda: 1,
        tipoCambio: 1,
        montoTotalMoneda: payload.montoTotal,
        leyenda,
        usuario: "onia",
        codigoDocumentoSector: this.combo.codigoDocumentoSector,
        cafc,
      };
      const detalle = payload.items.map((item) => ({
        actividadEconomica: item.actividadEconomica,
        codigoProductoSin: item.codigoProductoSin,
        codigoProducto: item.codigoProducto,
        descripcion: item.descripcion,
        cantidad: item.cantidad,
        unidadMedida: item.unidadMedida,
        precioUnitario: item.precioUnitario,
        subTotal: item.subtotal,
        nroQuirofanoSalaOperaciones: item.nroQuirofanoSalaOperaciones,
        nombreApellidoMedico: item.nombreApellidoMedico,
        nitDocumentoMedico: item.nitDocumentoMedico,
      }));
      xmls.push({ name: `${cuf}.xml`, content: buildInvoiceXml({ cabecera, detalle }) });
    }
    const tar = buildTar(xmls);
    const gz = gzipSync(tar);
    const archivo = gz.toString("base64");
    // En lote el "archivo" ES el tar comprimido: modo xml = hash del tar plano.
    const hashArchivo = this.state.hashMode === "gzip" ? sha256HexOf(gz) : sha256HexOf(tar);
    return { archivo, hashArchivo, cantidad: xmls.length };
  }

  async etapaVI(target = STAGE_TARGETS.VI) {
    this.requirePortalReconciliation("VI");
    const motivos = new Map((this.state.catalogs.eventos ?? []).map((e) => [Number(e.codigoClasificador), e]));
    for (const caso of PAQUETE_CASES) {
      const caseId = paqueteCaseId(caso);
      if (this.caseFilter && this.caseFilter !== caseId) continue;
      const validationKey = validacionCaseId(caso);
      await this.withCombo({ codigoPuntoVenta: caso.pv, codigoDocumentoSector: caso.sector }, () =>
        this.loop("VI", Math.min(target, caso.target), async (done) => {
          const motivo = motivos.get(caso.motivo);
          if (!motivo) throw new Error(`VI: falta motivo ${caso.motivo} en catalogo sincronizado`);
          const conCafc = MOTIVOS_CON_CAFC.has(String(caso.motivo));
          const entradaCafc = conCafc ? resolverCafc(this.cafcs, { sector: caso.sector, pv: caso.pv }) : null;
          if (conCafc && !entradaCafc) {
            throw new Error(
              `VI.${caseId}: motivo ${caso.motivo} requiere CAFC del piloto (sector ${caso.sector}, PdV ${caso.pv})`,
            );
          }
          this.reservarNumerosCafc(entradaCafc, caso.cantidad, { soloVerificar: true });
          const cafc = entradaCafc?.cafc ?? null;
          // SIN 984: el evento y el XML offline comparten CUFD y ventana.
          await this.ensureCufd();
          const win = this.eventWindowNow();
          const evento = await this.registrarEvento(motivo, { ...win, etapa: "VI" });
          const codigoEvento = tagText(evento.body, "codigoRecepcionEventoSignificativo");
          if (!evento.ok || !codigoEvento) {
            return evento.ok
              ? { ...evento, ok: false, error: "missing_event", parsed: { transaccion: false,
                  mensajes: [{ codigo: "EV", descripcion: "evento sin codigo de recepcion" }] } }
              : evento;
          }
          const lote = this.buildLote(caso.cantidad, {
            tipoEmision: 2,
            baseIndex: done * caso.cantidad,
            fechaIso: formatSinLocal(win.inicioMs + Math.floor((win.finMs - win.inicioMs) / 2)),
            cafc,
            numeroDesde: this.reservarNumerosCafc(entradaCafc, caso.cantidad),
          });
          this.checkpoint(); // reservar correlativos antes de enviar un lote grande
          const result = await this.post(this.servicio, buildRunnerEnvelope("recepcionPaqueteFactura", {
            ...this.recepcionBase(2),
            archivo: lote.archivo,
            fechaEnvio: this.sinNow(),
            hashArchivo: lote.hashArchivo,
            cantidadFacturas: lote.cantidad,
            codigoEvento,
            ...(cafc ? { cafc } : {}),
          }), { etapa: "VI", op: "recepcionPaqueteFactura", case: caseId });
          const recibido = this.guardarRecepcion("VI", validationKey, result);
          if (recibido.ok) {
            this.checkpoint(); // el recibo queda guardado antes de validar
            await this.validarInmediata("VI", caseId, recibido.parsed.codigoRecepcion, "validacionRecepcionPaqueteFactura");
          }
          return recibido;
        }, { caseId }),
      );
    }
    for (const caso of PAQUETE_VALIDACIONES) {
      const caseId = validacionCaseId(caso);
      if (this.caseFilter && this.caseFilter !== caseId) continue;
      await this.withCombo({ codigoPuntoVenta: caso.pv, codigoDocumentoSector: caso.sector }, () =>
        this.loop("VI", Math.min(this.caseFilter ? target : target * LOTE_MOTIVOS.length, caso.target),
          (done) => this.validarRecepcion("VI", caseId, done, "validacionRecepcionPaqueteFactura"),
          { caseId }),
      );
    }
  }

  async anularOne() {
    await this.ensureCufd();
    // Preferir validadas (908); las 901 (pendientes) suelen validar en segundos
    // en el piloto, asi que valen como fallback. SIEMPRE del combo actual: la
    // anulacion viaja con su codigoDocumentoSector/PdV y el SIN cuenta por caso.
    const delCombo = (f) => f.combo === comboId(this.combo);
    const factura =
      this.state.invoices.find((f) => delCombo(f) && !f.anulada && f.estado === 908) ??
      this.state.invoices.find((f) => delCombo(f) && !f.anulada && f.estado === 901);
    if (!factura) {
      throw new Error(
        `etapa VII sin facturas validadas del combo ${comboId(this.combo)} para anular ` +
          "(correr la etapa IV de ese combo primero)",
      );
    }
    const motivo = (this.state.catalogs.motivosAnulacion ?? [])[0];
    const envelope = this.ops.anulacion.build({
      ...this.recepcionBase(1),
      codigoMotivo: motivo?.codigoClasificador ?? 1,
      cuf: factura.cuf,
    });
    const result = await this.post(this.servicio, envelope, {
      etapa: "VII",
      op: this.ops.anulacion.op,
      numeroFactura: factura.numero,
    });
    if (result.ok && result.parsed?.transaccion === true) {
      factura.anulada = true;
    }
    return result;
  }

  /** Anulacion: 125 por combo -> 750. Cada anulacion usa una factura del MISMO combo. */
  async etapaVII(target = STAGE_TARGETS.VII) {
    for (const combo of EMISION_CASES) {
      await this.withCombo(combo, () =>
        this.loop("VII", target, () => this.anularOne(), { caseId: comboId(combo) }),
      );
    }
  }

  /**
   * Firma digital: emision en modalidad ELECTRONICA con el XML firmado.
   * 115 por combo -> 690 [VERIFICAR]. Sin certificado se SALTA con log (asi la
   * corrida de volumen completa no revienta); pedir la etapa explicita sin
   * certificado si falla (main lo corta antes).
   */
  async etapaVIII(target = STAGE_TARGETS.VIII) {
    if (!this.firma) {
      this.log({
        etapa: "VIII",
        skipped: "sin certificado (SIAT_FIRMA_KEY_FILE / SIAT_FIRMA_CERT_FILE): etapa saltada",
      });
      return;
    }
    for (const combo of EMISION_CASES_VIII) {
      await this.withCombo(combo, () =>
        this.loop("VIII", target, (done) => this.emitOne(done), { caseId: comboId(combo) }),
      );
    }
  }

  async etapaIX(target = STAGE_TARGETS.IX) {
    this.requirePortalReconciliation("IX");
    // SIN 916: emision 3 en request y CUF. El portal separa <1000 e =1000.
    for (const caso of MASIVA_CASES) {
      const caseId = masivaCaseId(caso);
      if (this.caseFilter && this.caseFilter !== caseId) continue;
      const validationKey = validacionCaseId(caso);
      await this.withCombo({ codigoPuntoVenta: caso.pv, codigoDocumentoSector: caso.sector }, () =>
        this.loop("IX", Math.min(target, caso.target), async (done) => {
          await this.ensureCufd();
          const lote = this.buildLote(caso.cantidad, {
            tipoEmision: 3,
            baseIndex: 1000 + done * caso.cantidad,
          });
          this.checkpoint(); // reservar correlativos antes de enviar un lote grande
          const result = await this.post(this.servicio, buildRunnerEnvelope("recepcionMasivaFactura", {
            ...this.recepcionBase(3),
            archivo: lote.archivo,
            fechaEnvio: this.sinNow(),
            hashArchivo: lote.hashArchivo,
            cantidadFacturas: lote.cantidad,
          }), { etapa: "IX", op: "recepcionMasivaFactura", case: caseId });
          const recibido = this.guardarRecepcion("IX", validationKey, result);
          if (recibido.ok) {
            this.checkpoint(); // el recibo queda guardado antes de validar
            await this.validarInmediata("IX", caseId, recibido.parsed.codigoRecepcion, "validacionRecepcionMasivaFactura");
          }
          return recibido;
        }, { caseId }),
      );
    }
    for (const caso of MASIVA_VALIDACIONES) {
      const caseId = validacionCaseId(caso);
      if (this.caseFilter && this.caseFilter !== caseId) continue;
      await this.withCombo({ codigoPuntoVenta: caso.pv, codigoDocumentoSector: caso.sector }, () =>
        this.loop("IX", Math.min(this.caseFilter ? target : target * 2, caso.target),
          (done) => this.validarRecepcion("IX", caseId, done, "validacionRecepcionMasivaFactura"),
          { caseId }),
      );
    }
  }

  async revertirOne() {
    await this.ensureCufd();
    const factura = this.state.invoices.find(
      (f) => f.combo === comboId(this.combo) && f.anulada && !f.revertida,
    );
    if (!factura) {
      throw new Error(
        `etapa XI sin facturas anuladas del combo ${comboId(this.combo)} para revertir ` +
          "(correr la etapa VII de ese combo primero)",
      );
    }
    const envelope = this.ops.reversion.build({
      ...this.recepcionBase(1),
      cuf: factura.cuf,
    });
    const result = await this.post(this.servicio, envelope, {
      etapa: "XI",
      op: this.ops.reversion.op,
      numeroFactura: factura.numero,
    });
    if (result.ok && result.parsed?.transaccion === true) {
      factura.revertida = true;
    }
    return result;
  }

  /** Reversion: 125 por combo -> 750. Revierte anulaciones del MISMO combo. */
  async etapaXI(target = STAGE_TARGETS.XI) {
    for (const combo of EMISION_CASES) {
      await this.withCombo(combo, () =>
        this.loop("XI", target, () => this.revertirOne(), { caseId: comboId(combo) }),
      );
    }
  }

  /**
   * Gate minimo: 1 CUIS y 1 CUFD por punto de venta, sync esencial, y 1 emision
   * + anulacion + reversion POR COMBO. Con 6 combos son 6 de cada una: es el
   * humo que prueba que los 3 documentos sector y los 2 PdV responden ANTES de
   * quemar 4.000 operaciones. Si un combo esta mal, revienta aca y no a la hora.
   */
  async gate() {
    await this.etapaI(1);
    await this.syncEssentials();
    this.checkpoint();
    await this.etapaIII(1);
    await this.etapaIV(1);
    await this.etapaVII(1);
    await this.etapaXI(1);
  }

  /**
   * Humo de la etapa VIII: CUIS + sync esencial + 1 emision FIRMADA por combo
   * electronica. Correr SIEMPRE antes del volumen de la VIII — y es la sonda
   * barata para medir que dice el piloto de un certificado dado (6 requests).
   */
  async gateVIII() {
    await this.etapaI(1);
    await this.syncEssentials();
    this.checkpoint();
    await this.etapaVIII(1);
  }

  async runStage(id, count) {
    const map = {
      I: (n) => this.etapaI(n ?? STAGE_TARGETS.I),
      II: (n) => this.etapaII(n ?? STAGE_TARGETS.II),
      III: (n) => this.etapaIII(n ?? STAGE_TARGETS.III),
      IV: (n) => this.etapaIV(n ?? STAGE_TARGETS.IV),
      V: (n) => this.etapaV(n ?? STAGE_TARGETS.V),
      VI: (n) => this.etapaVI(n ?? STAGE_TARGETS.VI),
      VII: (n) => this.etapaVII(n ?? STAGE_TARGETS.VII),
      VIII: (n) => this.etapaVIII(n ?? STAGE_TARGETS.VIII),
      IX: (n) => this.etapaIX(n ?? STAGE_TARGETS.IX),
      XI: (n) => this.etapaXI(n ?? STAGE_TARGETS.XI),
      gate: () => this.gate(),
      "gate-viii": () => this.gateVIII(),
    };
    if (!map[id]) {
      throw new Error(`etapa desconocida: "${id}" (validas: ${Object.keys(map).join(", ")})`);
    }
    await map[id](count);
  }

  /**
   * Avance por etapa CONTRA EL TOTAL DEL SIN, para poder cotejar contra el
   * "Listado de Etapas" del portal sin hacer cuentas a mano. `done` de las
   * etapas por-caso no se incrementa (los contadores viven en `cases`), asi
   * que el avance real se suma de ahi.
   *
   * EL UNIVERSO ES STAGE_ORDER, NO LAS CLAVES DEL CHECKPOINT (2026-09-27).
   * Antes las filas salian de Object.entries(state.etapas), o sea del archivo de
   * estado. Una etapa que nunca corrio no tiene fila ahi, asi que no salia en 0:
   * NO SALIA. Medido contra /opt/onia-siat/fase1-state.json: la etapa VIII entro
   * al runner el 12-sep, el checkpoint vivo arranco antes y el script desplegado
   * solo nombra IV/VII/XI — el informe devolvia nueve filas todas al 100% con un
   * general del 87%, y de ahi se concluyo que la Fase 1 estaba completa. Un sujeto
   * ausente se lee como inexistente: eso no omite, AFIRMA. Ahora cada etapa del
   * SIN tiene su fila con `corrio`, y las ajenas al SIN se nombran al final en vez
   * de descartarse.
   */
  summary() {
    const fila = (id, e) => {
      const requiereConciliacion = ["VI", "IX"].includes(id) &&
        Object.keys(e?.legacyCases ?? {}).length > 0 && !e?.portalReconciledAt;
      const porCasos = Object.values(e?.cases ?? {}).reduce((a, b) => a + b, 0);
      const hechas = requiereConciliacion ? null : e ? (porCasos > 0 ? porCasos : e.done) : 0;
      const total = STAGE_TOTALS[id] ?? null;
      return {
        etapa: id,
        corrio: Boolean(e),
        hechas,
        totalSin: total,
        avance: requiereConciliacion ? "sin conciliar" : total ? `${Math.floor((hechas / total) * 100)}%` : null,
        ...(requiereConciliacion ? { requiereConciliacion: true } : {}),
        porCaso: e?.cases ?? {},
        attempts: e?.attempts ?? 0,
        blocked: e?.blockedCases ?? {},
      };
    };
    const delSin = STAGE_ORDER.map((id) => fila(id, this.state.etapas[id]));
    const ajenas = Object.keys(this.state.etapas)
      .filter((id) => !STAGE_ORDER.includes(id))
      .map((id) => fila(id, this.state.etapas[id]));
    const rows = [...delSin, ...ajenas];
    // El general se mide contra el total del SIN, asi que solo suma lo que el SIN pide.
    const requiereConciliacion = delSin.some((r) => r.requiereConciliacion);
    const hechas = delSin.reduce((a, r) => a + (r.hechas ?? 0), 0);
    const total = Object.values(STAGE_TOTALS).reduce((a, b) => a + b, 0);
    return {
      hashMode: this.state.hashMode,
      cuisPorPv: this.state.cuisByPv,
      general: requiereConciliacion
        ? "sin conciliar con portal (VI/IX)"
        : `${hechas}/${total} (${Math.floor((hechas / total) * 100)}%)`,
      alcanceGeneral: "conteo local de casos; no equivale al porcentaje general ni a la autorizacion del portal SIN",
      etapas: rows,
    };
  }
}

export { Runner, classifyResponse, SOAP_OPERATIONS };

// ------------------------------- main ---------------------------------------

const isMain =
  process.argv[1] && import.meta.url === (await import("node:url")).pathToFileURL(process.argv[1]).href;

if (isMain) {
  const args = parseArgs(process.argv.slice(2));
  if (args.portalSnapshot) {
    if (!existsSync(args.state)) throw new Error(`checkpoint no existe: ${args.state}`);
    const snapshot = JSON.parse(readFileSync(args.portalSnapshot, "utf8"));
    const runner = new Runner({ token: "", nit: "", codigoSistema: "", stateFile: args.state, logFile: args.log, pace: 0 });
    const reconciled = applyPortalSnapshot(runner.state, snapshot);
    const backup = `${args.state}.pre-portal-${Date.now()}`;
    copyFileSync(args.state, backup);
    runner.state = reconciled;
    runner.checkpoint();
    console.log(`[fase1] marcador importado, respaldo ${backup}; sin trafico SOAP`);
    console.log(JSON.stringify(runner.summary(), null, 2));
    process.exit(0);
  }
  // --solo-informe LEE el checkpoint y se va: no habla con el SIN, asi que no pide
  // credenciales ni firma, y no escribe (nunca llama checkpoint()). Existe para que
  // preguntar "como va la Fase 1" no cueste una corrida real contra el SIN — que es
  // lo que hacia que nadie lo preguntara.
  if (args.soloInforme) {
    const soloLectura = new Runner({
      token: "",
      nit: "",
      codigoSistema: "",
      stateFile: args.state,
      logFile: args.log,
      pace: 0,
    });
    console.log(JSON.stringify(soloLectura.summary(), null, 2));
    process.exit(0);
  }
  // Una invocacion sin --etapa no puede convertir un informe accidental en
  // barrido I..XI: I-V ya harian SOAP antes de la guarda de VI/IX.
  if (!args.etapa) {
    throw new Error("para trafico al piloto se requiere --etapa explicita; sin ella use --solo-informe");
  }
  if (args.caseId && (!LOTE_CASE_TARGETS[args.etapa] || !Object.hasOwn(LOTE_CASE_TARGETS[args.etapa], args.caseId))) {
    throw new Error("--case requiere --etapa VI|IX y un caseId de la matriz del portal");
  }
  if (args.caseId && (!Number.isInteger(args.count) || args.count < 1)) {
    throw new Error("--case requiere --count positivo para limitar la corrida controlada");
  }
  const token = process.env.SIAT_PILOT_TOKEN;
  const nit = process.env.SIAT_NIT;
  const codigoSistema = process.env.SIAT_CODIGO_SISTEMA;
  if (!token || !nit || !codigoSistema) {
    console.error("faltan SIAT_PILOT_TOKEN / SIAT_NIT / SIAT_CODIGO_SISTEMA en el ambiente");
    process.exit(1);
  }
  // Certificado de la etapa VIII: RUTAS a archivos PEM (nunca el contenido en
  // env, nunca en git; en el VPS viven bajo /opt/onia-siat/certs/, chmod 600).
  const keyFile = process.env.SIAT_FIRMA_KEY_FILE;
  const certFile = process.env.SIAT_FIRMA_CERT_FILE;
  const firma =
    keyFile && certFile
      ? { privateKeyPem: readFileSync(keyFile, "utf8"), certificatePem: readFileSync(certFile, "utf8") }
      : null;
  if (!firma && args.etapa && args.etapa.toLowerCase().includes("viii")) {
    console.error(
      "la etapa VIII necesita SIAT_FIRMA_KEY_FILE y SIAT_FIRMA_CERT_FILE (rutas a la llave y el certificado PEM)",
    );
    process.exit(1);
  }
  const runner = new Runner({
    token,
    nit,
    codigoSistema,
    stateFile: args.state,
    logFile: args.log,
    pace: args.pace,
    firma,
    cafcs: cafcDesdeEnv(process.env),
    caseFilter: args.caseId,
  });
  const stages = [args.etapa];
  if (args.retryBlocked) {
    runner.clearBlocked(stages);
  }
  try {
    for (const stage of stages) {
      console.log(`[fase1] etapa ${stage}...`);
      await runner.runStage(stage, args.count);
      runner.checkpoint();
    }
    console.log(JSON.stringify(runner.summary(), null, 2));
  } catch (err) {
    runner.checkpoint();
    console.error(`[fase1] ${err.message}`);
    console.error(JSON.stringify(runner.summary(), null, 2));
    process.exit(err instanceof StopError ? 2 : 1);
  }
}
