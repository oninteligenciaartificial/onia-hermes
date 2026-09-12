/*
 * Registro y consulta de PUNTOS DE VENTA contra el PILOTO del SIAT (Bolivia).
 *
 * El portal fman NO tiene UI de puntos de venta para el modulo piloto: la via
 * es SOAP. Servicio FacturacionOperaciones, operaciones registroPuntoVenta /
 * consultaPuntoVenta. Wrappers y ORDEN de campos VERIFICADOS 2026-09-12 contra
 * el WSDL del piloto (FacturacionOperaciones?wsdl=ServicioFacturacionOperaciones.wsdl):
 *   SolicitudRegistroPuntoVenta: codigoAmbiente, codigoModalidad, codigoSistema,
 *     codigoSucursal, codigoTipoPuntoVenta, cuis, descripcion, nit,
 *     nombrePuntoVenta (todos requeridos; el numero del PdV lo ASIGNA el SIN y
 *     vuelve en RespuestaRegistroPuntoVenta.codigoPuntoVenta).
 *   SolicitudConsultaPuntoVenta: codigoAmbiente, codigoSistema, codigoSucursal,
 *     cuis, nit (la respuesta lista listaPuntosVentas{codigoPuntoVenta,
 *     nombrePuntoVenta, tipoPuntoVenta}).
 *
 * El CUIS que viaja es el de la SUCURSAL (PdV 0), del checkpoint del runner.
 * codigoTipoPuntoVenta sale del catalogo sincronizado tiposPuntoVenta; el
 * generico es "PUNTO DE VENTA CAJEROS" (codigo 5 en el piloto). COMISIONISTA
 * (1) NO: tiene su propia operacion con contrato y NIT del comisionista.
 *
 * SOLO PILOTO: el ambiente esta hardcodeado (codigoAmbiente=2). Este script
 * jamas toca produccion del SIN. Idempotente: consulta primero, registra solo
 * si el PdV pedido no existe, y verifica con una consulta final.
 *
 * Uso (VPS):
 *   cd /opt/onia-siat && set -a; . ./siat-piloto.env; set +a
 *   node emisor/src/registrar-pdv.mjs                # consulta + registra PdV 1 si falta
 *   node emisor/src/registrar-pdv.mjs --dry-run      # solo consulta, no registra
 *   flags: --pv 1  --tipo 5  --nombre "Punto de Venta 1"
 *          --state fase1-state.json  --log fase1-log.ndjson
 * Esto NO es asesoria fiscal.
 */
import { readFileSync, appendFileSync, existsSync } from "node:fs";

import { buildSoapEnvelope, soapEndpoint } from "./soap-client.mjs";
import { postSoap } from "./soap-transport.mjs";

// Ambiente FIJO: piloto (2). Este script no acepta produccion.
export const PDV_PILOT = { environment: "piloto", codigoAmbiente: 2, codigoModalidad: 2, codigoSucursal: 0 };

// Orden del XSD del WSDL del piloto (leido 2026-09-12; JAXB = alfabetico).
export const REGISTRO_PDV_FIELDS = [
  { name: "codigoAmbiente" },
  { name: "codigoModalidad" },
  { name: "codigoSistema" },
  { name: "codigoSucursal" },
  { name: "codigoTipoPuntoVenta" },
  { name: "cuis" },
  { name: "descripcion" },
  { name: "nit" },
  { name: "nombrePuntoVenta" },
];

export const CONSULTA_PDV_FIELDS = [
  { name: "codigoAmbiente" },
  { name: "codigoSistema" },
  { name: "codigoSucursal" },
  { name: "cuis" },
  { name: "nit" },
];

export function buildRegistroPuntoVentaRequest(params) {
  return buildSoapEnvelope({
    operation: "registroPuntoVenta",
    requestElement: "SolicitudRegistroPuntoVenta",
    fields: REGISTRO_PDV_FIELDS,
    params,
  });
}

export function buildConsultaPuntoVentaRequest(params) {
  return buildSoapEnvelope({
    operation: "consultaPuntoVenta",
    requestElement: "SolicitudConsultaPuntoVenta",
    fields: CONSULTA_PDV_FIELDS,
    params,
  });
}

/** Bloques listaPuntosVentas de la respuesta de consulta, como objetos planos. */
export function parseListaPuntosVentas(xml) {
  const blockRe = /<(?:[\w-]+:)?listaPuntosVentas(?:\s[^>]*)?>([\s\S]*?)<\/(?:[\w-]+:)?listaPuntosVentas>/gi;
  const fieldRe = /<(?:[\w-]+:)?(\w+)(?:\s[^>]*)?>([^<]*)<\/(?:[\w-]+:)?\1>/g;
  const items = [];
  let m;
  while ((m = blockRe.exec(String(xml ?? ""))) !== null) {
    const item = {};
    let f;
    while ((f = fieldRe.exec(m[1])) !== null) {
      item[f[1]] = f[2].trim();
    }
    items.push(item);
  }
  return items;
}

/**
 * Tipo de punto de venta a usar, del catalogo sincronizado. El generico es
 * CAJEROS; COMISIONISTA queda excluido SIEMPRE (va por otra operacion, con
 * contrato). Devuelve el codigo como numero, o lanza si no hay candidato.
 */
export function resolveTipoPuntoVenta(catalogo) {
  const lista = (catalogo ?? []).filter((t) => !/COMISIONISTA/i.test(t.descripcion ?? ""));
  const cajeros = lista.find((t) => /CAJERO/i.test(t.descripcion ?? ""));
  const elegido = cajeros ?? lista[0];
  if (!elegido) {
    throw new Error("catalogo tiposPuntoVenta vacio o solo comisionista: sincronizar etapa II antes");
  }
  return Number(elegido.codigoClasificador);
}

// ------------------------------- main (IO) ----------------------------------

function parseArgs(argv) {
  const args = { pv: 1, tipo: null, nombre: null, state: "fase1-state.json", log: "fase1-log.ndjson", dryRun: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--pv") args.pv = Number(argv[++i]);
    else if (a === "--tipo") args.tipo = Number(argv[++i]);
    else if (a === "--nombre") args.nombre = argv[++i];
    else if (a === "--state") args.state = argv[++i];
    else if (a === "--log") args.log = argv[++i];
    else if (a === "--dry-run") args.dryRun = true;
  }
  return args;
}

const isMain =
  process.argv[1] && import.meta.url === (await import("node:url")).pathToFileURL(process.argv[1]).href;

if (isMain) {
  const args = parseArgs(process.argv.slice(2));
  const token = process.env.SIAT_PILOT_TOKEN;
  const nit = process.env.SIAT_NIT;
  const codigoSistema = process.env.SIAT_CODIGO_SISTEMA;
  if (!token || !nit || !codigoSistema) {
    console.error("faltan SIAT_PILOT_TOKEN / SIAT_NIT / SIAT_CODIGO_SISTEMA en el ambiente");
    process.exit(1);
  }
  if (!existsSync(args.state)) {
    console.error(`no existe el checkpoint ${args.state} (necesito el CUIS del PdV 0 y el catalogo)`);
    process.exit(1);
  }
  const state = JSON.parse(readFileSync(args.state, "utf8"));
  const cuis = state.cuisByPv?.["0"] ?? state.cuis;
  if (!cuis) {
    console.error("sin CUIS del PdV 0 en el checkpoint: correr --etapa I primero");
    process.exit(1);
  }

  const endpoint = soapEndpoint(PDV_PILOT.environment, "FACTURACION_OPERACIONES");
  const log = (entry) =>
    appendFileSync(args.log, `${JSON.stringify({ ts: new Date().toISOString(), etapa: "pdv", ...entry })}\n`);

  const call = async (op, envelope) => {
    const result = await postSoap({ endpoint, envelope, token, fetchImpl: globalThis.fetch });
    const parsed = result.parsed ?? {};
    log({
      op,
      ok: result.ok,
      status: result.status,
      error: result.error,
      transaccion: parsed.transaccion ?? null,
      sin: (parsed.mensajes ?? []).map((mm) => `${mm.codigo}:${mm.descripcion}`).slice(0, 3),
    });
    return result;
  };

  const baseConsulta = {
    codigoAmbiente: PDV_PILOT.codigoAmbiente,
    codigoSistema,
    codigoSucursal: PDV_PILOT.codigoSucursal,
    cuis,
    nit,
  };

  const consulta = async () => {
    const r = await call("consultaPuntoVenta", buildConsultaPuntoVentaRequest(baseConsulta));
    return { result: r, lista: parseListaPuntosVentas(r.body ?? "") };
  };

  // SIN 982 "NO EXISTE PUNTOS DE VENTA ASOCIADOS" viene con transaccion:false
  // pero significa LISTA VACIA (verificado en vivo 2026-09-12): no es un fallo.
  const esListaVacia = (r) => (r.parsed?.mensajes ?? []).some((m) => Number(m.codigo) === 982);

  const antes = await consulta();
  console.log("[pdv] puntos de venta actuales:", JSON.stringify(antes.lista));
  if (!antes.result.ok && antes.lista.length === 0 && !esListaVacia(antes.result)) {
    console.error(`[pdv] consulta fallo (${antes.result.error}); respuesta literal:\n${antes.result.body}`);
    process.exit(1);
  }
  if (antes.lista.some((p) => Number(p.codigoPuntoVenta) === args.pv)) {
    console.log(`[pdv] el PdV ${args.pv} YA existe; nada que registrar`);
    process.exit(0);
  }
  if (args.dryRun) {
    console.log(`[pdv] dry-run: el PdV ${args.pv} no existe; no se registra`);
    process.exit(0);
  }

  const tipo = args.tipo ?? resolveTipoPuntoVenta(state.catalogs?.tiposPuntoVenta);
  const nombre = args.nombre ?? `Punto de Venta ${args.pv}`;
  console.log(`[pdv] registrando "${nombre}" (tipo ${tipo}, sucursal ${PDV_PILOT.codigoSucursal})...`);
  const reg = await call(
    "registroPuntoVenta",
    buildRegistroPuntoVentaRequest({
      codigoAmbiente: PDV_PILOT.codigoAmbiente,
      codigoModalidad: PDV_PILOT.codigoModalidad,
      codigoSistema,
      codigoSucursal: PDV_PILOT.codigoSucursal,
      codigoTipoPuntoVenta: tipo,
      cuis,
      descripcion: nombre,
      nit,
      nombrePuntoVenta: nombre,
    }),
  );
  const mensajes = (reg.parsed?.mensajes ?? []).map((m) => `${m.codigo}: ${m.descripcion}`).join(" | ");
  if (!reg.ok || reg.parsed?.transaccion !== true) {
    console.error(`[pdv] registro RECHAZADO (${reg.error ?? "business"}) ${mensajes}`);
    console.error(`[pdv] respuesta literal:\n${reg.body}`);
    process.exit(1);
  }
  console.log(`[pdv] registro OK ${mensajes}`);

  const despues = await consulta();
  console.log("[pdv] puntos de venta ahora:", JSON.stringify(despues.lista));
  const existe = despues.lista.some((p) => Number(p.codigoPuntoVenta) === args.pv);
  if (!existe) {
    console.error(`[pdv] el registro respondio OK pero la consulta NO lista el PdV ${args.pv}; revisar a mano`);
    process.exit(1);
  }
  console.log(`[pdv] VERIFICADO: el PdV ${args.pv} existe en el piloto`);
}
