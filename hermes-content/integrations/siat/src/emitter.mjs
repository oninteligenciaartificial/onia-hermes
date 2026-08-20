/*
 * Orquestador del emisor SIAT (Bolivia): el CAPSTONE que ata todas las piezas en
 * UNA sola llamada usable por los productos. emitInvoice() ensambla el material
 * (CUF + XML + archivo + request), lo POSTea al SIN por el transporte INYECTABLE,
 * interpreta la respuesta (codigoEstado 901/904/908) y aplica la transicion de la
 * maquina de estados. Testeable de punta a punta con un SIN simulado (mock del
 * transporte); listo para enchufar el fetch real + el token del piloto.
 *
 * NO hace red por si mismo: el transporte (postSoap de soap-transport.mjs, o un
 * mock) se inyecta. Coherente con external_gate: siat. Esto NO es asesoria fiscal.
 *
 * Alcance: cubre la RECEPCION de factura (el ciclo de emision). La obtencion de
 * CUIS/CUFD (requestCuis/requestCufd) necesita un parser especifico de esa
 * respuesta cuyos nombres de elemento se confirman contra el WSDL del piloto
 * [VERIFICAR]; queda para la fase piloto (aca se recibe el cufd ya obtenido).
 */
import { assembleEmission } from "./emission.mjs";
import { applyTransition } from "./emission-state.mjs";
import { classifyResponse } from "./soap-transport.mjs";
import { soapEndpoint } from "./soap-client.mjs";
import { validateTenantReady } from "./tenant-registry.mjs";
import { SIN_STATUS } from "./constants.mjs";

/** codigoEstado del SIN -> estado destino de la emision. */
export function estadoFromSin(codigoEstado) {
  if (codigoEstado === SIN_STATUS.VALIDATED) {
    return "validated"; // 908
  }
  if (codigoEstado === SIN_STATUS.OBSERVED) {
    return "observed"; // 904
  }
  if (codigoEstado === SIN_STATUS.PENDING) {
    return "sent"; // 901: el SIN la recibio, la validacion es asincrona
  }
  return "rejected"; // sin codigo reconocido / transaccion false -> rechazada
}

const KNOWN_ESTADOS = [SIN_STATUS.PENDING, SIN_STATUS.OBSERVED, SIN_STATUS.VALIDATED];

/**
 * Emite una factura de punta a punta. Devuelve { material, emission, result,
 * delivered, estado, codigoRecepcion, codigoEstado }.
 *
 * Contexto (1er arg): payload NORMALIZADO, tenant (registro), cuis, cufd
 * ({ codigo, codigoControl }), numeroFactura, fechaEmision (PARAMETRO), fechaEnvio?,
 * environment ("piloto"|"produccion"), emission? (la emision previa; si no, arranca
 * en "queued").
 * Deps (2do arg): transport (funcion tipo postSoap, INYECTABLE), token (del piloto),
 * endpoint? (default: el de recepcion computarizada del ambiente), soapAction?, now?.
 *
 * Semantica de estado:
 *  - Si el SIN respondio con un codigoEstado (901/904/908) o un rechazo de negocio
 *    -> queued->sent y luego al estado final (validated/observed/sent/rejected).
 *  - Si el transporte fallo (red/servidor/soap_fault sin estado) -> la factura NO
 *    se entrego: sigue en "queued" para reintento (delivered=false).
 */
export async function emitInvoice(context = {}, deps = {}) {
  const {
    payload,
    tenant,
    cuis,
    cufd,
    numeroFactura,
    fechaEmision,
    fechaEnvio,
    environment = "piloto",
    emission,
  } = context;
  const { transport, token, endpoint, soapAction, now = new Date().toISOString() } = deps;

  if (typeof transport !== "function") {
    throw new Error("emitInvoice requiere un transport inyectable (funcion tipo postSoap)");
  }

  // 1. El tenant debe estar listo (NIT + codigoSistema + sucursal + PdV + token vigente al `now`).
  const ready = validateTenantReady(tenant, { now });
  if (!ready.ready) {
    throw new Error(`tenant no listo para emitir: falta ${ready.missing.join(", ")}`);
  }

  // 2. Ensamblar el material de emision (CUF + XML + archivo + request de recepcion).
  // Se reenvia TODO el context para que fluyan los overrides de cabecera que el
  // ensamblador acepta (leyenda -- obligatoria, Ley 453 --, usuario, codigoMoneda,
  // tipoFactura, cabecera, etc.). assembleEmission ignora los campos que no usa.
  const material = assembleEmission({ ...context, environment });

  // 3. Estado inicial: la emision arranca (o continua) en "queued".
  const start = {
    state: "queued",
    cuf: material.cuf,
    issueDate: fechaEmision,
    emissionType: "online",
    createdAt: now,
    ...(emission ?? {}),
  };
  if (start.state !== "queued") {
    throw new Error(`emitInvoice espera una emision en "queued", no en "${start.state}" (transiciona antes de reintentar)`);
  }

  // 4. POST al SIN por el transporte inyectable.
  // Compra-venta (sector 1) va por su servicio DEDICADO: mandarla a
  // ServicioFacturacionComputarizada devuelve SIN 995 (verificado en vivo 2026-08-06).
  const targetEndpoint = endpoint ?? soapEndpoint(environment, "FACTURACION_COMPRA_VENTA");
  const result = await transport({ endpoint: targetEndpoint, envelope: material.recepcionRequest, token, soapAction });

  // 5. Interpretar.
  const parsed = result?.parsed ?? null;
  const codigoEstado = parsed?.codigoEstado ?? null;
  const knownEstado = KNOWN_ESTADOS.includes(codigoEstado);
  const cls = classifyResponse(result?.status, result?.body);

  // Sin estado util y transporte caido -> no entregada: sigue en cola para reintento.
  if (!knownEstado && (cls === "network" || cls === "server" || cls === "soap_fault")) {
    return {
      material,
      emission: { ...start, lastReason: cls, updatedAt: now },
      result,
      delivered: false,
      estado: start.state,
      codigoRecepcion: null,
      codigoEstado,
    };
  }

  // El SIN respondio: queued -> sent, y luego al estado final segun el codigoEstado.
  let next = applyTransition(start, "sent", { now, sinStatus: codigoEstado });
  const target = estadoFromSin(codigoEstado);
  if (target !== "sent") {
    next = applyTransition(next, target, {
      now,
      sinStatus: codigoEstado,
      reason: parsed?.mensajes?.[0]?.descripcion ?? parsed?.codigoDescripcion ?? null,
    });
  }

  return {
    material,
    emission: next,
    result,
    delivered: true,
    estado: next.state,
    codigoRecepcion: parsed?.codigoRecepcion ?? null,
    codigoEstado,
  };
}
