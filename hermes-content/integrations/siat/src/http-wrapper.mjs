/*
 * Wrapper HTTP del emisor SIAT — el servicio que Onia Platform llama cuando
 * SIAT_SERVICE_URL deja de estar vacia (plan 1.0, F1.4).
 *
 * EL CONTRATO LO DEFINE EL CALLER (onia-platform/lib/fiscal/siat-client.ts),
 * no este archivo:
 *   POST /fiscal/invoices
 *     Authorization: Bearer <SIAT_WRAPPER_TOKEN>   (el SIAT_SERVICE_TOKEN del producto)
 *     Idempotency-Key: invoice:<id>
 *     body: { organizationId, invoice, environment }
 *       invoice = { invoiceNumber, issueDate "yyyy-mm-dd", currencyCode, total,
 *                   customer { name, taxId, email }, lines [{ description,
 *                   quantity, unitPrice, lineTotal }] }
 *   Respuesta 200: { estado, cuf, cufd, controlCode, authorizationNumber,
 *                    codigoRecepcion, codigoEstado, qrUrl, leyenda, delivered }
 *   Semantica de status que el caller espera:
 *     - 5xx  -> la factura queda "queued" en el producto (reintento)
 *     - 4xx sin codigoEstado -> "rejected" en el producto
 *     - 200  -> estado derivado de codigoEstado (908/904/901)
 *
 * Reusa el emisor probado contra el piloto: emitInvoice() + postSoap. La unica
 * logica nueva es mapear el payload del producto al normalizado, mantener el
 * CUFD vigente y el correlativo, y la idempotencia. Ambiente SIEMPRE por env
 * (SIAT_ENV); nada de produccion hardcodeada. Esto NO es asesoria fiscal.
 *
 * Uso (VPS):  set -a; . /opt/onia-siat/siat-wrapper.env; set +a
 *             node src/http-wrapper.mjs
 */
import { createServer } from "node:http";
import { createHash, timingSafeEqual } from "node:crypto";
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

import { emitInvoice } from "./emitter.mjs";
import { buildInvoicePayload, validateInvoicePayload, round2 } from "./invoice-payload.mjs";
import { buildTenant } from "./tenant-registry.mjs";
import { postSoap } from "./soap-transport.mjs";
import { buildCufdRequest, codigoAmbienteFor, soapEndpoint, MODALITY_CODES } from "./soap-client.mjs";
import { ENVIRONMENTS, TIPO_DOC_IDENTIDAD } from "./constants.mjs";
import {
  buildRunnerEnvelope,
  computeSinOffset,
  cufdVencido,
  formatSinLocal,
  tagText,
  EMISOR_PRUEBA,
} from "./fase1-runner.mjs";

const LEYENDA_DEFAULT = "Ley N° 453: Tienes derecho a un trato equitativo.";
const ESTADOS_SIN = new Set([901, 904, 908]);
const MAX_BODY_BYTES = 1_000_000;

// ------------------------------ configuracion -------------------------------

/**
 * Lee y valida la configuracion desde env. Fail-closed: si falta un requerido,
 * lanza con la lista completa (el servicio NO arranca a medias).
 */
export function readConfig(env = process.env) {
  const val = (name) => String(env[name] ?? "").trim();
  const config = {
    environment: val("SIAT_ENV") || "piloto",
    host: val("SIAT_WRAPPER_HOST") || "127.0.0.1",
    port: Number(val("SIAT_WRAPPER_PORT") || 8517),
    wrapperToken: val("SIAT_WRAPPER_TOKEN"),
    // Mismo token del SIN que usa el runner (siat-piloto.env exporta SIAT_PILOT_TOKEN).
    sinToken: val("SIAT_SIN_TOKEN") || val("SIAT_PILOT_TOKEN"),
    nit: val("SIAT_NIT"),
    codigoSistema: val("SIAT_CODIGO_SISTEMA"),
    cuis: val("SIAT_CUIS"),
    sucursal: Number(val("SIAT_SUCURSAL") || 0),
    puntoVenta: Number(val("SIAT_PUNTO_VENTA") || 0),
    // Homologacion por defecto para TODAS las lineas (el producto no manda
    // codigos SIN; el mapeo por producto llega con el tenant registry real).
    actividadEconomica: val("SIAT_ACTIVIDAD_ECONOMICA"),
    codigoProductoSin: val("SIAT_CODIGO_PRODUCTO_SIN"),
    unidadMedida: val("SIAT_UNIDAD_MEDIDA"),
    leyenda: val("SIAT_LEYENDA") || LEYENDA_DEFAULT,
    codigoMetodoPago: Number(val("SIAT_CODIGO_METODO_PAGO") || 1),
    razonSocial: val("SIAT_RAZON_SOCIAL") || EMISOR_PRUEBA.razonSocial,
    municipio: val("SIAT_MUNICIPIO") || EMISOR_PRUEBA.municipio,
    direccion: val("SIAT_DIRECCION") || EMISOR_PRUEBA.direccion,
    stateFile: val("SIAT_WRAPPER_STATE") || "wrapper-state.json",
    numeroInicial: val("SIAT_NUMERO_INICIAL") ? Number(val("SIAT_NUMERO_INICIAL")) : null,
  };
  if (config.environment !== "piloto" && config.environment !== "produccion") {
    throw new Error(`SIAT_ENV invalido: "${config.environment}" (piloto | produccion)`);
  }
  const requeridos = [
    ["SIAT_WRAPPER_TOKEN", config.wrapperToken],
    ["SIAT_SIN_TOKEN (o SIAT_PILOT_TOKEN)", config.sinToken],
    ["SIAT_NIT", config.nit],
    ["SIAT_CODIGO_SISTEMA", config.codigoSistema],
    ["SIAT_CUIS", config.cuis],
    ["SIAT_ACTIVIDAD_ECONOMICA", config.actividadEconomica],
    ["SIAT_CODIGO_PRODUCTO_SIN", config.codigoProductoSin],
    ["SIAT_UNIDAD_MEDIDA", config.unidadMedida],
  ];
  const faltan = requeridos.filter(([, v]) => v === "").map(([n]) => n);
  if (faltan.length > 0) {
    throw new Error(`faltan variables de entorno: ${faltan.join(", ")}`);
  }
  return config;
}

// ------------------------------- mapeo puro ---------------------------------

/**
 * Mapea la factura del producto (NormalizedInvoicePayload de siat-client.ts) al
 * payload normalizado del emisor. Devuelve { payload, errors }: con errors no
 * vacios NO hay payload (fail-closed, el producto la marca rechazada).
 *
 * Decisiones de mapeo:
 *  - lineTotal < cantidad*precio => la diferencia es `descuento` de la linea.
 *    lineTotal MAYOR que cantidad*precio no es representable: error.
 *  - customer.taxId (el producto manda el CI del paciente) => receptor CI;
 *    sin taxId => consumidor final (S/N, doc 0), la convencion probada.
 *  - Solo BOB: el emisor emite con codigoMoneda 1.
 */
export function mapProductInvoice(invoice, config) {
  const errors = [];
  if (!invoice || typeof invoice !== "object") {
    return { payload: null, errors: ["invoice ausente o no es un objeto"] };
  }
  const currency = String(invoice.currencyCode ?? "").trim().toUpperCase();
  if (currency !== "BOB") {
    errors.push(`currencyCode "${invoice.currencyCode}" no soportado (solo BOB)`);
  }
  const lines = Array.isArray(invoice.lines) ? invoice.lines : [];
  if (lines.length === 0) {
    errors.push("invoice.lines vacio");
  }
  const items = lines.map((line, i) => {
    const cantidad = Number(line?.quantity);
    const precio = Number(line?.unitPrice);
    const lineTotal = Number(line?.lineTotal);
    if (!(cantidad > 0)) errors.push(`lines[${i}].quantity debe ser > 0`);
    if (!Number.isFinite(precio) || precio < 0) errors.push(`lines[${i}].unitPrice invalido`);
    if (!Number.isFinite(lineTotal) || lineTotal < 0) errors.push(`lines[${i}].lineTotal invalido`);
    const bruto = round2(cantidad * precio);
    const descuento = round2(bruto - lineTotal);
    if (descuento < -0.009) {
      errors.push(`lines[${i}].lineTotal (${lineTotal}) mayor que cantidad*precio (${bruto})`);
    }
    return {
      descripcion: typeof line?.description === "string" ? line.description.trim() : "",
      cantidad,
      precioUnitario: precio,
      descuento: descuento > 0 ? descuento : 0,
      actividadEconomica: config.actividadEconomica,
      codigoProductoSin: config.codigoProductoSin,
      codigoProducto: `ONIA-${i + 1}`,
      unidadMedida: config.unidadMedida,
    };
  });

  const taxId = typeof invoice.customer?.taxId === "string" ? invoice.customer.taxId.trim() : "";
  if (taxId !== "" && !/^\d{1,15}$/.test(taxId)) {
    errors.push(`customer.taxId "${taxId}" no es numerico (CI/NIT del SIN)`);
  }
  const receptor =
    taxId !== ""
      ? {
          tipoDocumentoIdentidad: TIPO_DOC_IDENTIDAD.CI,
          numeroDocumento: taxId,
          razonSocial: typeof invoice.customer?.name === "string" ? invoice.customer.name.trim() : null,
          email: typeof invoice.customer?.email === "string" ? invoice.customer.email : null,
        }
      : undefined; // buildInvoicePayload aplica consumidor final (S/N, doc 0)

  const payload = buildInvoicePayload({
    emisor: {
      nit: config.nit,
      sucursalCodigo: config.sucursal,
      puntoVentaCodigo: config.puntoVenta,
      actividadEconomica: config.actividadEconomica,
    },
    ...(receptor ? { receptor } : {}),
    documento: { tipoDocumentoSector: 1, fechaEmision: invoice.issueDate ?? null, moneda: "BOB", tipoCambio: 1 },
    items,
  });

  const total = Number(invoice.total);
  if (!Number.isFinite(total) || !(total > 0)) {
    errors.push("invoice.total ausente o <= 0");
  } else if (Math.abs(payload.montoTotal - round2(total)) > 0.01) {
    errors.push(`invoice.total (${total}) no cuadra con las lineas (${payload.montoTotal})`);
  }

  const validation = validateInvoicePayload(payload);
  for (const e of validation.errors) {
    if (!errors.includes(e)) errors.push(e);
  }
  return errors.length > 0 ? { payload: null, errors } : { payload, errors: [] };
}

/** URL de consulta/QR del SIN para una factura validada. */
export function qrUrlFor({ environment, nit, cuf, numeroFactura }) {
  const host = ENVIRONMENTS[environment === "produccion" ? "PRODUCCION" : "PILOTO"].consultaHost;
  return `${host}/consulta/QR?nit=${nit}&cuf=${cuf}&numero=${numeroFactura}&t=2`;
}

/** Cuerpo de respuesta con los campos EXACTOS que parsea siat-client.ts. */
export function buildWrapperResponse(r, { numeroFactura, cufd, config }) {
  const conEstado = ESTADOS_SIN.has(r.codigoEstado);
  const cuf = conEstado ? r.material.cuf : null;
  return {
    estado: r.estado,
    cuf,
    cufd: cufd?.codigo ?? null,
    controlCode: cufd?.codigoControl ?? null,
    authorizationNumber: null, // computarizada: el CUF ES la autorizacion
    codigoRecepcion: r.codigoRecepcion ?? null,
    codigoEstado: r.codigoEstado ?? null,
    qrUrl: cuf ? qrUrlFor({ environment: config.environment, nit: config.nit, cuf, numeroFactura }) : null,
    leyenda: r.estado === "rejected" ? r.emission?.lastReason ?? "rechazada por el SIN" : config.leyenda,
    delivered: true,
    // Extras que el caller ignora pero sirven en logs/debug:
    numeroFactura,
    mensajeSin: r.emission?.lastReason ?? null,
  };
}

// ------------------------------ estado (IO) ---------------------------------

export function loadWrapperState(file) {
  const base = { numeroFactura: null, sinOffsetMs: 0, cufd: null, results: {} };
  if (existsSync(file)) {
    return { ...base, ...JSON.parse(readFileSync(file, "utf8")) };
  }
  return base;
}

function saveWrapperState(file, state) {
  const tmp = `${file}.tmp`;
  writeFileSync(tmp, JSON.stringify(state), "utf8");
  renameSync(tmp, file);
}

// -------------------------------- servidor ----------------------------------

function json(res, status, body) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

function bearerOk(header, expected) {
  const m = /^Bearer (.+)$/.exec(String(header ?? ""));
  if (!m || expected === "") {
    return false;
  }
  // Digests de largo fijo para timingSafeEqual con largos distintos.
  const a = createHash("sha256").update(m[1]).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

function readBody(req, maxBytes = MAX_BODY_BYTES) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(Object.assign(new Error("body demasiado grande"), { tooBig: true }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

/**
 * Crea el servidor (sin listen). deps.transport es inyectable (tests sin red);
 * default: postSoap con el fetch de Node. Devuelve { server, state }.
 */
export function createWrapper(config, deps = {}) {
  const transport = deps.transport ?? ((args) => postSoap({ ...args, fetchImpl: globalThis.fetch }));
  const state = loadWrapperState(config.stateFile);
  if (!Number.isFinite(state.numeroFactura) || state.numeroFactura === null) {
    // Mismo arranque que el runner: correlativo derivado del epoch para no
    // chocar con las facturas ya emitidas en el piloto por el runner.
    state.numeroFactura = config.numeroInicial ?? Math.floor(Date.now() / 1000) % 1_000_000_000;
  }

  // ponytail: cola global — serializa TODAS las emisiones (correlativo + CUFD +
  // checkpoint de un solo tenant). Si el volumen lo pide, lock por punto de venta.
  let lock = Promise.resolve();
  function withLock(fn) {
    const run = lock.then(fn, fn);
    lock = run.then(
      () => {},
      () => {},
    );
    return run;
  }

  const baseParams = {
    codigoAmbiente: codigoAmbienteFor(config.environment),
    codigoSistema: config.codigoSistema,
    codigoSucursal: config.sucursal,
    codigoPuntoVenta: config.puntoVenta,
    nit: config.nit,
  };

  const sinNowIso = () => formatSinLocal(Date.now() + (state.sinOffsetMs ?? 0));

  /** Sincroniza el reloj del SIN (best-effort: si falla, vale el offset previo). */
  async function refreshSinOffset() {
    try {
      const envelope = buildRunnerEnvelope("sincronizarFechaHora", { ...baseParams, cuis: config.cuis });
      const r = await transport({
        endpoint: soapEndpoint(config.environment, "FACTURACION_SINCRONIZACION"),
        envelope,
        token: config.sinToken,
      });
      const offset = computeSinOffset(tagText(r?.body, "fechaHora"), Date.now());
      if (offset != null) {
        state.sinOffsetMs = offset;
      }
    } catch {
      // sin red al sync: el CUFD que sigue decide si se puede emitir
    }
  }

  /** CUFD vigente del PdV: renueva contra FacturacionCodigos si vencio (24h). */
  async function ensureCufd() {
    if (!cufdVencido(state.cufd, Date.now() + (state.sinOffsetMs ?? 0))) {
      return state.cufd;
    }
    await refreshSinOffset();
    const envelope = buildCufdRequest({
      ...baseParams,
      codigoModalidad: MODALITY_CODES.COMPUTARIZADA_EN_LINEA,
      cuis: config.cuis,
    });
    const r = await transport({
      endpoint: soapEndpoint(config.environment, "FACTURACION_CODIGOS"),
      envelope,
      token: config.sinToken,
    });
    if (!r?.ok || !r?.parsed?.codigo) {
      const msg = (r?.parsed?.mensajes ?? [])[0]?.descripcion ?? r?.error ?? "sin detalle";
      throw Object.assign(new Error(`CUFD no disponible: ${msg}`), { sinCaido: true });
    }
    state.cufd = {
      codigo: r.parsed.codigo,
      codigoControl: r.parsed.codigoControl,
      fechaVigencia: r.parsed.fechaVigencia,
      obtenidoEn: Date.now() + (state.sinOffsetMs ?? 0),
    };
    saveWrapperState(config.stateFile, state);
    return state.cufd;
  }

  const tenant = buildTenant({
    orgId: "onia-platform",
    emisor: {
      nit: config.nit,
      razonSocial: config.razonSocial,
      codigoSistema: config.codigoSistema,
      municipio: config.municipio,
      direccion: config.direccion,
    },
    sucursales: [{ codigo: config.sucursal }],
    puntosVenta: [{ codigo: config.puntoVenta, sucursalCodigo: config.sucursal }],
    // Metadata solamente; el valor del token vive en el env del VPS (regla de secretos).
    tokenDelegado: { referencia: "env:SIAT_SIN_TOKEN", estado: "activo" },
  });

  async function emitOnce({ payload, idempotencyKey }) {
    // Re-chequeo DENTRO del lock: dos requests concurrentes con la misma clave
    // no deben emitir dos veces.
    if (state.results[idempotencyKey]) {
      return { status: 200, body: state.results[idempotencyKey] };
    }
    const cufd = await ensureCufd();
    // El correlativo se consume SOLO si el SIN vio la factura (no quemar
    // numeros en fallas de red).
    const numeroFactura = state.numeroFactura + 1;
    const r = await emitInvoice(
      {
        payload,
        tenant,
        cuis: config.cuis,
        cufd,
        numeroFactura,
        fechaEmision: sinNowIso(),
        environment: config.environment,
        leyenda: config.leyenda,
        codigoMetodoPago: config.codigoMetodoPago,
        usuario: "onia",
      },
      { transport, token: config.sinToken },
    );
    if (!r.delivered) {
      return { status: 503, body: { error: "SIN no disponible", detail: r.result?.error ?? null, delivered: false } };
    }
    state.numeroFactura = numeroFactura;
    const body = buildWrapperResponse(r, { numeroFactura, cufd, config });
    if (ESTADOS_SIN.has(r.codigoEstado)) {
      // ponytail: el mapa de resultados crece sin tope; podar cuando importe.
      // Rechazos NO se cachean: un reintento con datos corregidos re-emite.
      state.results[idempotencyKey] = body;
    }
    saveWrapperState(config.stateFile, state);
    return { status: 200, body };
  }

  async function handle(req, res) {
    const url = String(req.url ?? "").split("?")[0];
    if (req.method === "GET" && url === "/health") {
      return json(res, 200, { ok: true, environment: config.environment });
    }
    if (req.method !== "POST" || url !== "/fiscal/invoices") {
      return json(res, 404, { error: "no existe" });
    }
    if (!bearerOk(req.headers.authorization, config.wrapperToken)) {
      return json(res, 401, { error: "no autorizado" });
    }
    const idempotencyKey = String(req.headers["idempotency-key"] ?? "").trim();
    if (idempotencyKey === "") {
      return json(res, 400, { error: "falta el header Idempotency-Key" });
    }
    if (state.results[idempotencyKey]) {
      return json(res, 200, state.results[idempotencyKey]);
    }
    let raw;
    try {
      raw = await readBody(req);
    } catch (e) {
      return json(res, e?.tooBig ? 413 : 400, { error: e?.message ?? "body ilegible" });
    }
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return json(res, 400, { error: "JSON invalido" });
    }
    const organizationId = typeof body?.organizationId === "string" ? body.organizationId.trim() : "";
    if (organizationId === "") {
      return json(res, 400, { error: "organizationId requerido" });
    }
    if (body?.environment !== config.environment) {
      return json(res, 400, {
        error: `environment "${body?.environment}" no coincide con el del servicio ("${config.environment}")`,
      });
    }
    const mapped = mapProductInvoice(body.invoice, config);
    if (mapped.errors.length > 0) {
      return json(res, 400, { error: "factura invalida", errors: mapped.errors.slice(0, 20) });
    }
    try {
      const out = await withLock(() => emitOnce({ payload: mapped.payload, idempotencyKey }));
      return json(res, out.status, out.body);
    } catch (e) {
      // CUFD caido u otro fallo de infraestructura: 5xx => el producto reintenta.
      console.error(`[siat-wrapper] emision fallo (${idempotencyKey}): ${e?.message}`);
      return json(res, 503, { error: e?.message ?? "error interno", delivered: false });
    }
  }

  const server = createServer((req, res) => {
    handle(req, res).catch((e) => {
      console.error(`[siat-wrapper] error no manejado: ${e?.stack ?? e}`);
      if (!res.headersSent) {
        json(res, 500, { error: "error interno" });
      }
    });
  });
  return { server, state };
}

// --------------------------------- main -------------------------------------

const isMain =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  let config;
  try {
    config = readConfig(process.env);
  } catch (e) {
    console.error(`[siat-wrapper] ${e.message}`);
    process.exit(1);
  }
  const { server } = createWrapper(config);
  server.listen(config.port, config.host, () => {
    console.log(
      `[siat-wrapper] escuchando en http://${config.host}:${config.port} — ambiente ${config.environment}, NIT ${config.nit}, PdV ${config.puntoVenta}`,
    );
  });
}
