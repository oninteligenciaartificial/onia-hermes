/*
 * Constantes SIAT (Sistema de Facturacion en Linea, Bolivia).
 *
 * Fuente: onia-core/ONIA_SIAT_CERTIFICACION_PLAN_2026.md (investigado con fuentes
 * cruzadas + RND 102100000011). Lo NO confirmado contra el Anexo Tecnico oficial
 * queda marcado [VERIFICAR]. Esto NO es asesoria fiscal.
 *
 * El emisor SIAT vive como SERVICIO SEPARADO del core (external_gate: siat en el
 * contrato). El core nunca emite; persiste el resultado (CUF/XML/respuesta) en
 * sus entidades existentes (Document, WorkItem, ApprovalRequest).
 */

// Estados de una factura ante el SIN (codigos oficiales del plan seccion 2.3).
export const SIN_STATUS = {
  PENDING: 901,
  OBSERVED: 904,
  VALIDATED: 908,
};

// Modalidades de facturacion (plan seccion 2.2). Arrancar por COMPUTARIZADA_EN_LINEA:
// NO requiere certificado digital del contribuyente (usa CUIS/CUFD + hash SHA-256),
// menos friccion de onboarding. ELECTRONICA_EN_LINEA exige firma digital (AGETIC).
export const MODALITIES = {
  COMPUTARIZADA_EN_LINEA: "computarizada_en_linea",
  ELECTRONICA_EN_LINEA: "electronica_en_linea",
  PORTAL_WEB: "portal_web",
  MANUAL: "manual",
  PREVALORADA: "prevalorada",
};

export const RECOMMENDED_START_MODALITY = MODALITIES.COMPUTARIZADA_EN_LINEA;

// Tipos de emision.
export const EMISSION_TYPES = {
  ONLINE: 1,
  OFFLINE: 2,
  CONTINGENCY: 3, // [VERIFICAR codigo exacto contra Anexo]
};

// Plazos legales (plan seccion 2.2/2.3). En horas / dia del mes.
export const DEADLINES = {
  offlineSendHours: 48, // factura offline: enviar dentro de 48h
  contingencyManualHours: 72, // contingencia manual con CAFC
  significantEventHours: 48, // registrar evento significativo hasta 48h despues
  cancellationDayOfNextMonth: 9, // anulacion hasta el dia 9 del mes siguiente
};

// Limites de paquete (plan seccion 2.3 / fase I).
export const PACKAGE_LIMITS = {
  offlineMax: 500,
  masiveMax: 2000,
};

// Ambientes SIAT.
export const ENVIRONMENTS = {
  PILOTO: {
    id: "piloto",
    consultaHost: "https://pilotosiat.impuestos.gob.bo",
    // VERIFICADO 2026-07: el piloto vigente sirve los WSDL en /v2 (no /v1). Los WSDL
    // respondieron: FacturacionCodigos, FacturacionSincronizacion, ServicioFacturacionComputarizada.
    soapBase: "https://pilotosiatservicios.impuestos.gob.bo/v2",
  },
  PRODUCCION: {
    id: "produccion",
    consultaHost: "https://siat.impuestos.gob.bo", // [VERIFICAR host exacto de produccion]
    // Piloto usa /v2; produccion probablemente igual. [VERIFICAR version + host exactos de produccion antes de emitir real].
    soapBase: "https://siatservicios.impuestos.gob.bo/v2",
  },
};

// Motivos de anulacion: catalogo del SIN, NO hardcodear la lista completa sin el
// catalogo oficial (se sincroniza por servicio web). Placeholder de forma.
export const CANCELLATION_RULE = {
  untilDayOfNextMonth: DEADLINES.cancellationDayOfNextMonth,
  reversalOncePerInvoice: true, // "reversion de anulacion por unica vez" (RND 1021-11 Art. 38)
  blockedIfDeclared: true, // no anulable si ya esta confirmada en RCV o declarada (F110/111)
};

// Tipo de documento sector. El emisor arranca con factura de compra-venta.
// El codigo exacto viaja en el CUF/XML; se confirma contra el catalogo del SIN.
export const DOC_SECTOR = {
  COMPRA_VENTA: 1, // [VERIFICAR codigo exacto contra catalogo sincronizado del SIN]
};

// Tipo de documento de identidad del receptor. Valores comunes del catalogo SIN
// (sincronizables por servicio web). [VERIFICAR contra el catalogo vigente].
export const TIPO_DOC_IDENTIDAD = {
  CI: 1,
  CEX: 2,
  PASAPORTE: 3,
  OD: 4, // otro documento
  NIT: 5,
};

// Consumidor final sin NIT: convencion del SIN (numero de documento y razon
// social especiales). [VERIFICAR contra el catalogo/normativa vigente].
export const CONSUMIDOR_FINAL = {
  tipoDocumentoIdentidad: TIPO_DOC_IDENTIDAD.CI,
  numeroDocumento: "0",
  razonSocial: "S/N",
};

export const NOT_FISCAL_ADVICE = true;
