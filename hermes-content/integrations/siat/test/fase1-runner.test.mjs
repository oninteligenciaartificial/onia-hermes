/*
 * Tests de la LOGICA PURA del runner de fase 1 (sin red): envelopes de las
 * operaciones de fase 1 (orden XSD verificado 2026-08-06), parser de items de
 * sincronizacion, regla de STOP (5 errores identicos consecutivos), tar ustar,
 * reloj del SIN y factura de prueba armada desde el catalogo.
 * Run: node --test hermes-content/integrations/siat/test/fase1-runner.test.mjs
 */
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { generateKeyPairSync } from "node:crypto";
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { gunzipSync } from "node:zlib";

import {
  CUFD_VIGENCIA_MS,
  RUNNER_OPS,
  Runner,
  normalizeCuisResult,
  parseArgs,
  SYNC_CASES,
  STAGE_TARGETS,
  STAGE_TOTALS,
  STAGE_PLAN,
  STAGE_ORDER,
  PUNTOS_VENTA,
  DOC_SECTOR_CASES,
  EMISION_CASES,
  EMISION_CASES_SOPORTADOS,
  EMISION_CASES_VIII,
  PAQUETE_CASES,
  PAQUETE_VALIDACIONES,
  MASIVA_CASES,
  MASIVA_VALIDACIONES,
  LOTE_CASE_TARGETS,
  paqueteCaseId,
  masivaCaseId,
  validacionCaseId,
  applyPortalSnapshot,
  MODALIDAD_ELECTRONICA,
  SERVICIO_POR_DOC_SECTOR,
  SERVICIO_POR_DOC_SECTOR_ELECTRONICA,
  DOC_SECTOR_SIN_SOPORTE,
  timeoutFor,
  DEFAULT_COMBO,
  comboId,
  migrateState,
  emptyState,
  STOP_THRESHOLD,
  StopError,
  TransitorioError,
  buildRunnerEnvelope,
  buildTar,
  buildTestInvoice,
  computeSinOffset,
  cufdVigenteDesde,
  cufdVencido,
  errorKey,
  eventWindow,
  extractSyncItems,
  formatSinLocal,
  hashFor,
  pickMotivoSinCafc,
  parseCafcConfig,
  resolverCafc,
  cafcDesdeEnv,
  tagText,
  updateStreak,
} from "../src/fase1-runner.mjs";
import { verifySignedInvoiceXml } from "../src/xml-signer.mjs";

function inOrder(xml, tags) {
  const positions = tags.map((t) => xml.indexOf(t));
  assert.ok(
    positions.every((p) => p >= 0),
    `faltan tags: ${tags.filter((t, i) => positions[i] < 0).join(", ")}`,
  );
  for (let i = 1; i < positions.length; i += 1) {
    assert.ok(positions[i - 1] < positions[i], `orden roto en "${tags[i]}"`);
  }
}

describe("buildRunnerEnvelope: sincronizacion", () => {
  const params = {
    codigoAmbiente: 2,
    codigoPuntoVenta: 0,
    codigoSistema: "SIS",
    codigoSucursal: 0,
    cuis: "97DA6A35",
    nit: "5371375010",
  };

  it("todas las operaciones sincronizar* usan el wrapper SolicitudSincronizacion en orden XSD", () => {
    const xml = buildRunnerEnvelope("sincronizarListaLeyendasFactura", params);
    inOrder(xml, [
      "<siat:sincronizarListaLeyendasFactura>",
      "<SolicitudSincronizacion>",
      "<codigoAmbiente>2</codigoAmbiente>",
      "<codigoPuntoVenta>0</codigoPuntoVenta>",
      "<codigoSistema>SIS</codigoSistema>",
      "<codigoSucursal>0</codigoSucursal>",
      "<cuis>97DA6A35</cuis>",
      "<nit>5371375010</nit>",
      "</SolicitudSincronizacion>",
    ]);
  });

  it("los 18 casos de la etapa II existen y son operaciones sincronizar*", () => {
    assert.equal(SYNC_CASES.length, 18);
    for (const [op] of SYNC_CASES) {
      assert.ok(op.startsWith("sincronizar"), op);
      assert.ok(buildRunnerEnvelope(op, params).includes(`<siat:${op}>`));
    }
  });

  it("lanza ante una operacion desconocida", () => {
    assert.throws(() => buildRunnerEnvelope("noExiste", {}), /desconocida/);
  });
});

describe("buildRunnerEnvelope: evento significativo (orden XSD)", () => {
  it("emite los 12 campos en el orden del XSD (cufd/cufdEvento/cuis antes de descripcion, nit al final)", () => {
    const xml = buildRunnerEnvelope("registroEventoSignificativo", {
      codigoAmbiente: 2,
      codigoMotivoEvento: 1,
      codigoPuntoVenta: 0,
      codigoSistema: "SIS",
      codigoSucursal: 0,
      cufd: "CUFD-X",
      cufdEvento: "CUFD-EVT",
      cuis: "97DA6A35",
      descripcion: "Corte de internet",
      fechaHoraFinEvento: "2026-08-06T20:00:00.000",
      fechaHoraInicioEvento: "2026-08-06T19:30:00.000",
      nit: "5371375010",
    });
    inOrder(xml, [
      "<SolicitudEventoSignificativo>",
      "<codigoAmbiente>2</codigoAmbiente>",
      "<codigoMotivoEvento>1</codigoMotivoEvento>",
      "<cufd>CUFD-X</cufd>",
      "<cufdEvento>CUFD-EVT</cufdEvento>",
      "<cuis>97DA6A35</cuis>",
      "<descripcion>Corte de internet</descripcion>",
      "<fechaHoraFinEvento>2026-08-06T20:00:00.000</fechaHoraFinEvento>",
      "<fechaHoraInicioEvento>2026-08-06T19:30:00.000</fechaHoraInicioEvento>",
      "<nit>5371375010</nit>",
    ]);
  });
});

describe("buildRunnerEnvelope: paquete y masiva (extension al final)", () => {
  const base = {
    codigoAmbiente: 2,
    codigoDocumentoSector: 1,
    codigoEmision: 2,
    codigoModalidad: 2,
    codigoPuntoVenta: 0,
    codigoSistema: "SIS",
    codigoSucursal: 0,
    cufd: "CUFD-X",
    cuis: "97DA6A35",
    nit: "5371375010",
    tipoFacturaDocumento: 1,
    archivo: "BASE64==",
    fechaEnvio: "2026-08-06T20:00:00.000",
    hashArchivo: "abc123",
  };

  it("recepcionPaqueteFactura: base + archivo/fechaEnvio/hash + cantidadFacturas + codigoEvento (cafc opcional)", () => {
    const xml = buildRunnerEnvelope("recepcionPaqueteFactura", {
      ...base,
      cantidadFacturas: 2,
      codigoEvento: "12345",
    });
    inOrder(xml, [
      "<SolicitudServicioRecepcionPaquete>",
      "<cufd>CUFD-X</cufd>",
      "<cuis>97DA6A35</cuis>",
      "<nit>5371375010</nit>",
      "<archivo>BASE64==</archivo>",
      "<hashArchivo>abc123</hashArchivo>",
      "<cantidadFacturas>2</cantidadFacturas>",
      "<codigoEvento>12345</codigoEvento>",
    ]);
    assert.ok(!xml.includes("<cafc>")); // opcional omitido
  });

  it("recepcionMasivaFactura: base + archivo + cantidadFacturas, SIN codigoEvento", () => {
    const xml = buildRunnerEnvelope("recepcionMasivaFactura", { ...base, cantidadFacturas: 2 });
    inOrder(xml, ["<SolicitudServicioRecepcionMasiva>", "<archivo>BASE64==</archivo>", "<cantidadFacturas>2</cantidadFacturas>"]);
    assert.ok(!xml.includes("<codigoEvento>"));
  });

  it("las validaciones usan codigoRecepcion tras la base", () => {
    for (const op of ["validacionRecepcionPaqueteFactura", "validacionRecepcionMasivaFactura"]) {
      const { archivo, fechaEnvio, hashArchivo, ...rest } = base;
      const xml = buildRunnerEnvelope(op, { ...rest, codigoRecepcion: "REC-1" });
      inOrder(xml, ["<tipoFacturaDocumento>1</tipoFacturaDocumento>", "<codigoRecepcion>REC-1</codigoRecepcion>"]);
    }
  });
});

describe("extractSyncItems", () => {
  it("parsea parametricas {codigoClasificador, descripcion}", () => {
    const xml = `<resp><listaCodigos><codigoClasificador>1</codigoClasificador><descripcion>EFECTIVO</descripcion></listaCodigos>
      <listaCodigos><codigoClasificador>2</codigoClasificador><descripcion>TARJETA</descripcion></listaCodigos></resp>`;
    assert.deepEqual(extractSyncItems(xml), [
      { codigoClasificador: "1", descripcion: "EFECTIVO" },
      { codigoClasificador: "2", descripcion: "TARJETA" },
    ]);
  });

  it("parsea productos {codigoActividad, codigoProducto, descripcionProducto}", () => {
    const xml = `<x><listaCodigos><codigoActividad>620100</codigoActividad><codigoProducto>83141</codigoProducto><descripcionProducto>Servicios de diseno</descripcionProducto></listaCodigos></x>`;
    assert.deepEqual(extractSyncItems(xml), [
      { codigoActividad: "620100", codigoProducto: "83141", descripcionProducto: "Servicios de diseno" },
    ]);
  });

  it("parsea actividades y leyendas (otros contenedores)", () => {
    const xml = `<x><listaActividades><codigoCaeb>620100</codigoCaeb><descripcion>PROGRAMACION</descripcion></listaActividades>
      <listaLeyendas><codigoActividad>620100</codigoActividad><descripcionLeyenda>Ley 453</descripcionLeyenda></listaLeyendas></x>`;
    const items = extractSyncItems(xml);
    assert.equal(items.length, 2);
    assert.equal(items[0].codigoCaeb, "620100");
    assert.equal(items[1].descripcionLeyenda, "Ley 453");
  });

  it("respuesta sin listas -> []", () => {
    assert.deepEqual(extractSyncItems("<x><transaccion>true</transaccion></x>"), []);
  });
});

describe("tagText", () => {
  it("extrae fechaHora y codigoRecepcionEventoSignificativo", () => {
    const xml = `<r><fechaHora>2026-08-06T21:00:00.123-04:00</fechaHora><codigoRecepcionEventoSignificativo>987</codigoRecepcionEventoSignificativo></r>`;
    assert.equal(tagText(xml, "fechaHora"), "2026-08-06T21:00:00.123-04:00");
    assert.equal(tagText(xml, "codigoRecepcionEventoSignificativo"), "987");
    assert.equal(tagText(xml, "noExiste"), null);
  });
});

describe("regla de STOP: errorKey + updateStreak", () => {
  const okResult = { ok: true, parsed: { transaccion: true, mensajes: [] } };
  const err994 = { ok: false, error: "business", parsed: { transaccion: false, mensajes: [{ codigo: 994, descripcion: "No homologado" }] } };
  const err995 = { ok: false, error: "business", parsed: { transaccion: false, mensajes: [{ codigo: 995, descripcion: "Monto" }] } };

  it("exito -> key null; error -> clase:codigoSIN", () => {
    assert.equal(errorKey(okResult), null);
    assert.equal(errorKey(err994), "business:994");
    assert.equal(errorKey({ ok: false, error: "network", parsed: null }), "network:");
  });

  it("5 errores IDENTICOS consecutivos alcanzan el umbral", () => {
    let streak = { key: null, count: 0 };
    for (let i = 0; i < STOP_THRESHOLD; i += 1) {
      streak = updateStreak(streak, errorKey(err994));
    }
    assert.equal(streak.count, STOP_THRESHOLD);
    assert.equal(streak.key, "business:994");
  });

  it("un error DISTINTO resetea la racha a 1; un exito la resetea a 0", () => {
    let streak = updateStreak({ key: "business:994", count: 4 }, errorKey(err995));
    assert.deepEqual(streak, { key: "business:995", count: 1 });
    streak = updateStreak(streak, errorKey(okResult));
    assert.deepEqual(streak, { key: null, count: 0 });
  });

  it("StopError trae etapa, racha y el mensaje SIN exacto", () => {
    const err = new StopError("IV", { key: "business:994", count: 5 }, err994);
    assert.equal(err.etapa, "IV");
    assert.match(err.message, /5 errores identicos/);
    assert.match(err.message, /SIN 994: No homologado/);
  });
});

describe("buildTar (ustar minimo)", () => {
  it("arma un tar valido: nombre, tamano octal, magic ustar, padding a 512 y cierre de 1024", () => {
    const content = "<xml>factura</xml>";
    const tar = buildTar([{ name: "CUF123.xml", content }]);
    // header + 1 bloque de datos + 2 bloques de cierre
    assert.equal(tar.length, 512 + 512 + 1024);
    assert.equal(tar.subarray(0, 10).toString(), "CUF123.xml");
    assert.equal(parseInt(tar.subarray(124, 135).toString(), 8), content.length);
    assert.equal(tar.subarray(257, 262).toString(), "ustar");
    // checksum del header verificable: suma de bytes con el campo checksum en blanco
    const header = Buffer.from(tar.subarray(0, 512));
    const declared = parseInt(header.subarray(148, 155).toString(), 8);
    header.fill(0x20, 148, 156);
    let sum = 0;
    for (const b of header) sum += b;
    assert.equal(declared, sum);
    // el contenido va tal cual tras el header
    assert.equal(tar.subarray(512, 512 + content.length).toString(), content);
  });

  it("varios archivos concatenan headers + datas", () => {
    const tar = buildTar([
      { name: "a.xml", content: "A".repeat(600) }, // 2 bloques de data
      { name: "b.xml", content: "B" },
    ]);
    assert.equal(tar.length, 512 + 1024 + 512 + 512 + 1024);
    assert.equal(tar.subarray(512 + 1024, 512 + 1024 + 5).toString(), "b.xml");
  });
});

describe("reloj del SIN", () => {
  it("computeSinOffset: la hora de pared del SIN contra Date.now()", () => {
    const nowMs = Date.UTC(2026, 7, 6, 20, 0, 0, 0);
    const offset = computeSinOffset("2026-08-06T20:00:05.000-04:00", nowMs);
    assert.equal(offset, 5000); // 5s adelante en reloj de pared
    assert.equal(computeSinOffset("basura", nowMs), null);
  });

  it("formatSinLocal produce yyyy-MM-ddTHH:mm:ss.SSS (round-trip con el offset)", () => {
    const nowMs = Date.UTC(2026, 7, 6, 20, 0, 0, 0);
    const offset = computeSinOffset("2026-08-06T16:00:00.000-04:00", nowMs); // SIN va 4h "atras" en pared
    assert.equal(formatSinLocal(nowMs + offset), "2026-08-06T16:00:00.000");
  });
});

describe("cufdVigenteDesde", () => {
  it("prefiere obtenidoEn cuando existe", () => {
    assert.equal(cufdVigenteDesde({ obtenidoEn: 12345, fechaVigencia: "2026-08-07T18:05:56.509-04:00" }), 12345);
  });

  it("fallback estados viejos: fechaVigencia - 24h en pared del SIN", () => {
    const desde = cufdVigenteDesde({ fechaVigencia: "2026-08-07T18:05:56.509-04:00" });
    assert.equal(desde, Date.UTC(2026, 7, 7, 18, 5, 56, 509) - CUFD_VIGENCIA_MS);
    assert.equal(formatSinLocal(desde), "2026-08-06T18:05:56.509");
  });

  it("null si no hay cufd o la fecha es invalida", () => {
    assert.equal(cufdVigenteDesde(null), null);
    assert.equal(cufdVigenteDesde({ fechaVigencia: "basura" }), null);
  });
});

describe("eventWindow (SIN 984: la ventana del evento debe caer dentro de la vigencia del cufdEvento)", () => {
  const MIN = 60 * 1000;
  const now = Date.UTC(2026, 7, 6, 18, 30, 0, 0); // pared del SIN como epoch corrido

  it("CUFD viejo: ventana completa [now-35min, now-5min]", () => {
    const win = eventWindow({ nowSinMs: now, cufdDesdeMs: now - 2 * 60 * MIN });
    assert.equal(win.finMs, now - 5 * MIN);
    assert.equal(win.inicioMs, now - 35 * MIN);
  });

  it("sin cufdDesdeMs se comporta como antes (ventana completa)", () => {
    const win = eventWindow({ nowSinMs: now });
    assert.deepEqual(win, { inicioMs: now - 35 * MIN, finMs: now - 5 * MIN });
  });

  it("caso real del 984: CUFD obtenido 18:05:56, eventos a las 18:11 -> inicio recortado a la vigencia", () => {
    // Reproduce el escenario del log 2026-08-06: [now-35, now-5] arrancaba
    // 17:36, 29 min ANTES de que el cufdEvento existiera -> 984 del SIN.
    const nowReal = Date.UTC(2026, 7, 6, 18, 11, 58);
    const desde = cufdVigenteDesde({ fechaVigencia: "2026-08-07T18:05:56.509-04:00" });
    const win = eventWindow({ nowSinMs: nowReal, cufdDesdeMs: desde });
    assert.ok(win.inicioMs >= desde + MIN, "inicio dentro de la vigencia del CUFD");
    assert.ok(win.inicioMs < win.finMs && win.finMs <= nowReal, "ventana valida en el pasado");
  });

  it("CUFD tan fresco que invierte la ventana: sube el fin manteniendo inicio<fin<=now", () => {
    const win = eventWindow({ nowSinMs: now, cufdDesdeMs: now - 3 * MIN });
    assert.equal(win.inicioMs, now - 2 * MIN); // desde + margen
    assert.ok(win.inicioMs < win.finMs && win.finMs < now);
  });

  it("CUFD con menos de ~2min de vida: error claro en vez de quemar 984s", () => {
    assert.throws(() => eventWindow({ nowSinMs: now, cufdDesdeMs: now - 30 * 1000 }), /demasiado fresco/);
  });

  it("SIN 981: el inicio no solapa el ultimo evento registrado (minInicioMs + 1s)", () => {
    const lastFin = now - 20 * MIN;
    const win = eventWindow({ nowSinMs: now, cufdDesdeMs: now - 2 * 60 * MIN, minInicioMs: lastFin });
    assert.equal(win.inicioMs, lastFin + 1000);
    assert.equal(win.finMs, now - 5 * MIN);
  });

  it("eventos consecutivos segundos aparte: ventanas disyuntas que avanzan (caso real del 981)", () => {
    // it-1 registro con fin=now1-5min; it-2 llega 7s despues: su inicio debe
    // quedar DESPUES del fin de it-1, no re-usar [cufdDesde, now-5min].
    const desde = now - 60 * MIN;
    const w1 = eventWindow({ nowSinMs: now, cufdDesdeMs: desde });
    const w2 = eventWindow({ nowSinMs: now + 7000, cufdDesdeMs: desde, minInicioMs: w1.finMs });
    assert.ok(w2.inicioMs > w1.finMs, "sin solape con el evento anterior");
    assert.ok(w2.inicioMs < w2.finMs && w2.finMs <= now + 7000, "ventana valida en el pasado");
  });
});

describe("pickMotivoSinCafc (SIN 'Cafc no encontrado': eventos 5/6/7 exigen CAFC)", () => {
  it("salta 7/5/6 y elige el primer evento de conectividad (orden real del catalogo del piloto)", () => {
    const eventos = ["7", "5", "6", "1", "2", "3", "4"].map((c) => ({ codigoClasificador: c }));
    assert.equal(pickMotivoSinCafc(eventos).codigoClasificador, "1");
  });

  it("null si el catalogo solo trae eventos con CAFC o esta vacio", () => {
    assert.equal(pickMotivoSinCafc([{ codigoClasificador: "5" }, { codigoClasificador: 7 }]), null);
    assert.equal(pickMotivoSinCafc([]), null);
    assert.equal(pickMotivoSinCafc(undefined), null);
  });
});

describe("hashFor", () => {
  it("modo xml = SHA-256 del XML plano (igual que sha256Hex del builder); modo gzip = SHA-256 de los bytes .gz", async () => {
    const { sha256Hex } = await import("../src/xml-builder.mjs");
    const xml = "<factura/>";
    const gz = Buffer.from([1, 2, 3]);
    assert.equal(hashFor("xml", xml, gz), sha256Hex(xml));
    assert.notEqual(hashFor("gzip", xml, gz), hashFor("xml", xml, gz));
    assert.equal(hashFor("gzip", xml, gz).length, 64);
  });
});

describe("buildTestInvoice: datos REALES del catalogo", () => {
  const catalogs = {
    productos: [
      { codigoActividad: "620100", codigoProducto: "83141", descripcionProducto: "Diseno de software" },
      { codigoActividad: "620900", codigoProducto: "83142", descripcionProducto: "Soporte TI" },
    ],
    leyendas: [
      { codigoActividad: "620900", descripcionLeyenda: "Leyenda 620900" },
      { codigoActividad: "620100", descripcionLeyenda: "Leyenda 620100" },
    ],
    unidadesMedida: [{ codigoClasificador: "58", descripcion: "SERVICIOS" }],
    metodosPago: [{ codigoClasificador: "1", descripcion: "EFECTIVO" }],
    tiposDocIdentidad: [
      { codigoClasificador: "1", descripcion: "CEDULA DE IDENTIDAD" },
      { codigoClasificador: "5", descripcion: "NIT" },
    ],
  };

  it("usa producto homologado + SU actividad + la leyenda de esa actividad", () => {
    const { payload, leyenda, codigoMetodoPago } = buildTestInvoice({ catalogs, nit: "5371375010", index: 0 });
    assert.equal(payload.items[0].codigoProductoSin, "83141");
    assert.equal(payload.items[0].actividadEconomica, "620100");
    assert.equal(payload.emisor.actividadEconomica, "620100");
    assert.equal(leyenda, "Leyenda 620100");
    assert.equal(codigoMetodoPago, "1");
    assert.equal(payload.items[0].unidadMedida, "58");
  });

  it("receptor: NIT 99001 de prueba (indices 0-3) y consumidor final CI (indice 4 de cada 5)", () => {
    const nit = buildTestInvoice({ catalogs, nit: "5371375010", index: 0 }).payload.receptor;
    assert.equal(nit.numeroDocumento, "99001");
    assert.equal(nit.tipoDocumentoIdentidad, "5");
    const cf = buildTestInvoice({ catalogs, nit: "5371375010", index: 4 }).payload.receptor;
    assert.equal(cf.tipoDocumentoIdentidad, "1");
    assert.equal(cf.razonSocial, "CONSUMIDOR FINAL");
  });

  it("montos chicos variados y total coherente", () => {
    const a = buildTestInvoice({ catalogs, nit: "5371375010", index: 1 }).payload;
    const b = buildTestInvoice({ catalogs, nit: "5371375010", index: 2 }).payload;
    assert.notEqual(a.montoTotal, b.montoTotal);
    assert.ok(a.montoTotal > 0 && a.montoTotal < 1000);
    assert.equal(a.montoTotal, a.items[0].subtotal);
  });

  it("sin productos sincronizados -> lanza (no se emite sin catalogo real)", () => {
    assert.throws(() => buildTestInvoice({ catalogs: {}, nit: "5371375010", index: 0 }), /productos homologados vacio/);
  });
});

describe("normalizeCuisResult (SIN 980 con CUIS vigente, verificado en vivo 2026-08-06)", () => {
  it("transaccion=false + codigo presente -> ok (el 980 DEVUELVE el CUIS vigente)", () => {
    const raw = {
      ok: false,
      error: "business",
      parsed: {
        transaccion: false,
        codigo: "97DA6A35",
        mensajes: [{ codigo: 980, descripcion: "EXISTE UN CUIS VIGENTE PARA LA SUCURSAL O PUNTO DE VENTA" }],
      },
    };
    const norm = normalizeCuisResult(raw);
    assert.equal(norm.ok, true);
    assert.equal(norm.parsed.transaccion, true);
    assert.equal(norm.parsed.codigo, "97DA6A35");
    assert.equal(errorKey(norm), null); // no rompe la racha de exitos
    assert.equal(raw.ok, false); // inmutable: no pisa el original
  });

  it("sin codigo en la respuesta queda tal cual (error real)", () => {
    const raw = { ok: false, error: "business", parsed: { transaccion: false, codigo: null, mensajes: [] } };
    assert.equal(normalizeCuisResult(raw), raw);
  });
});

describe("plan de etapas", () => {
  it("los targets son POR CASO, no totales (X no aplica; VIII entro el 12-sep)", () => {
    assert.deepEqual(STAGE_TARGETS, {
      I: 1, II: 50, III: 100, IV: 125, V: 5, VI: 10, VII: 125, VIII: 115, IX: 10, XI: 125,
    });
    assert.deepEqual(STAGE_ORDER, ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "XI"]);
  });

  it("target x casos = el total que muestra el portal del SIN", () => {
    // Lo que el "Listado de Etapas" mostraba el 2026-08-27. Si el SIN cambia
    // un total, este test lo caza antes de quemar una corrida entera.
    assert.deepEqual(STAGE_TOTALS, {
      I: 2, II: 1800, III: 200, IV: 750, V: 70, VI: 560, VII: 750, VIII: 690, IX: 160, XI: 750,
    });
    const pv = PUNTOS_VENTA.length;
    const combos = EMISION_CASES.length;
    const motivos = 7; // parametrica de eventos significativos del piloto
    assert.equal(STAGE_TARGETS.I * pv, STAGE_TOTALS.I);
    assert.equal(STAGE_TARGETS.II * SYNC_CASES.length * pv, STAGE_TOTALS.II);
    assert.equal(STAGE_TARGETS.III * pv, STAGE_TOTALS.III);
    assert.equal(STAGE_TARGETS.IV * combos, STAGE_TOTALS.IV);
    assert.equal(STAGE_TARGETS.V * motivos * pv, STAGE_TOTALS.V);
    assert.equal(PAQUETE_CASES.length * 10 + PAQUETE_VALIDACIONES.length * 70, STAGE_TOTALS.VI);
    assert.equal(STAGE_TARGETS.VII * combos, STAGE_TOTALS.VII);
    assert.equal(STAGE_TARGETS.VIII * EMISION_CASES_VIII.length, STAGE_TOTALS.VIII);
    assert.equal(MASIVA_CASES.length * 10 + MASIVA_VALIDACIONES.length * 20, STAGE_TOTALS.IX);
    assert.equal(STAGE_TARGETS.XI * combos, STAGE_TOTALS.XI);
    assert.deepEqual(Object.keys(STAGE_PLAN).sort(), [...STAGE_ORDER].sort());
  });

  it("RUNNER_OPS cubre eventos, paquete, masiva y sus validaciones", () => {
    assert.deepEqual(Object.keys(RUNNER_OPS).sort(), [
      "recepcionMasivaFactura",
      "recepcionPaqueteFactura",
      "registroEventoSignificativo",
      "validacionRecepcionMasivaFactura",
      "validacionRecepcionPaqueteFactura",
    ]);
  });
});

describe("VI/IX: filas reales del portal y conciliacion del checkpoint", () => {
  const portal = JSON.parse(readFileSync(new URL("../portal-fase1-20260927.json", import.meta.url), "utf8"));

  it("la matriz enumera 32 y 12 filas unicas con sus cantidades exactas", () => {
    assert.equal(PAQUETE_CASES.length, 28);
    assert.equal(PAQUETE_VALIDACIONES.length, 4);
    assert.equal(MASIVA_CASES.length, 8);
    assert.equal(MASIVA_VALIDACIONES.length, 4);
    assert.equal(Object.keys(LOTE_CASE_TARGETS.VI).length, 32);
    assert.equal(Object.keys(LOTE_CASE_TARGETS.IX).length, 12);
    assert.equal(new Set(PAQUETE_CASES.map(paqueteCaseId)).size, 28);
    assert.equal(new Set(MASIVA_CASES.map(masivaCaseId)).size, 8);
    assert.ok(PAQUETE_CASES.every((c) => c.cantidad === (c.pv === 1 ? 500 : 2)));
    assert.ok(MASIVA_CASES.some((c) => c.cantidad === 1000));
    assert.ok(MASIVA_CASES.some((c) => c.cantidad < 1000));
  });

  it("preserva contadores antiguos como auditoria y no informa 100% antes de conciliar", () => {
    const old = migrateState({ etapas: {
      VI: { done: 0, attempts: 560, cases: { pv0: 280, pv1: 280 }, blockedCases: {} },
      IX: { done: 0, attempts: 160, cases: { pv0: 80, pv1: 80 }, blockedCases: {} },
    } });
    assert.deepEqual(old.etapas.VI.legacyCases, { pv0: 280, pv1: 280 });
    assert.deepEqual(old.etapas.IX.legacyCases, { pv0: 80, pv1: 80 });
    const r = Object.create(Runner.prototype);
    r.state = old;
    assert.match(r.summary().general, /sin conciliar/);
    assert.equal(r.summary().etapas.find((e) => e.etapa === "VI").hechas, null);
    assert.throws(() => r.requirePortalReconciliation("VI"), /Conciliar primero/);
    const reconciled = applyPortalSnapshot(old, portal);
    r.state = reconciled;
    assert.equal(r.summary().etapas.find((e) => e.etapa === "VI").hechas, 150);
    assert.equal(r.summary().etapas.find((e) => e.etapa === "IX").hechas, 60);
    assert.equal(r.state.etapas.VI.cases["recepcion-ds1-motivo1-pv0-menor500"], 10);
    assert.equal(r.state.etapas.IX.cases["recepcion-ds17-pv1-igual1000"], 0);
    assert.deepEqual(r.state.etapas.VI.legacyCases, { pv0: 280, pv1: 280 });
    assert.doesNotThrow(() => r.requirePortalReconciliation("VI"));
    assert.throws(() => applyPortalSnapshot(reconciled, portal), /ya fue conciliada/);
  });

  it("rechaza marcadores imposibles antes de reemplazar el checkpoint", () => {
    const state = migrateState({ etapas: { VI: { cases: { pv0: 280 } } } });
    assert.throws(() => applyPortalSnapshot(state, {
      ...portal,
      VI: { totalCorrectos: 151, cases: portal.VI.cases },
    }), /suma 150/);
    assert.deepEqual(state.etapas.VI.legacyCases, { pv0: 280 });
  });

  it("la CLI importa el portal sin credenciales ni SOAP y guarda respaldo", () => {
    const dir = mkdtempSync(join(tmpdir(), "fase1-portal-"));
    const stateFile = join(dir, "state.json");
    try {
      writeFileSync(stateFile, JSON.stringify({ etapas: {
        VI: { cases: { pv0: 280, pv1: 280 } },
        IX: { cases: { pv0: 80, pv1: 80 } },
      } }));
      const output = execFileSync(process.execPath, [
        fileURLToPath(new URL("../src/fase1-runner.mjs", import.meta.url)),
        "--portal-snapshot", fileURLToPath(new URL("../portal-fase1-20260927.json", import.meta.url)),
        "--state", stateFile,
      ], { cwd: dir, encoding: "utf8", env: { PATH: process.env.PATH } });
      assert.match(output, /sin trafico SOAP/);
      const current = JSON.parse(readFileSync(stateFile, "utf8"));
      assert.equal(current.etapas.VI.cases["validacion-ds1-pv0"], 70);
      const backups = readdirSync(dir).filter((f) => f.startsWith("state.json.pre-portal-"));
      assert.equal(backups.length, 1);
      const previous = JSON.parse(readFileSync(join(dir, backups[0]), "utf8"));
      assert.equal(previous.etapas.VI.cases.pv0, 280);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("un caso controlado envia solo la fila elegida con 500/1000 facturas, sector 17 incluido", async () => {
    for (const [stage, caseId, expected] of [
      ["VI", "recepcion-ds17-motivo2-pv1-igual500", 500],
      ["IX", "recepcion-ds17-pv1-igual1000", 1000],
    ]) {
      const r = Object.create(Runner.prototype);
      r.state = applyPortalSnapshot(emptyState(), portal);
      r.state.etapas[stage].done = 0;
      r.state.etapas[stage].attempts = 0;
      r.state.etapas[stage].blockedCases = {};
      for (const [id, target] of Object.entries(LOTE_CASE_TARGETS[stage])) r.state.etapas[stage].cases[id] = target;
      r.state.etapas[stage].cases[caseId] -= 1;
      r.state.catalogs.eventos = [{ codigoClasificador: 2, descripcion: "INACCESIBILIDAD" }];
      r.combo = { ...DEFAULT_COMBO };
      r.caseFilter = caseId;
      r.log = () => {};
      r.checkpoint = () => {};
      r.ensureCufd = async () => {};
      r.eventWindowNow = () => ({ inicioMs: Date.now() - 120000, finMs: Date.now() - 1000 });
      r.registrarEvento = async () => ({ ok: true, body: "<codigoRecepcionEventoSignificativo>EV</codigoRecepcionEventoSignificativo>" });
      r.recepcionBase = (codigoEmision) => ({ codigoAmbiente: 2, codigoDocumentoSector: r.combo.codigoDocumentoSector,
        codigoEmision, codigoModalidad: 2, codigoPuntoVenta: r.combo.codigoPuntoVenta,
        codigoSistema: "SIS", codigoSucursal: 0, cufd: "CUFD", cuis: "CUIS", nit: "5371375010", tipoFacturaDocumento: 1 });
      r.sinNow = () => "2026-09-27T00:00:00.000";
      const lotes = [];
      const posts = [];
      r.buildLote = (count) => {
        lotes.push({ count, sector: r.combo.codigoDocumentoSector, pv: r.combo.codigoPuntoVenta });
        return { archivo: "TEST", hashArchivo: "HASH", cantidad: count };
      };
      r.post = async (_service, envelope, meta) => {
        posts.push({ envelope, meta });
        return { ok: true, parsed: { transaccion: true, codigoRecepcion: "REC",
          ...(meta.op.startsWith("validacion") ? { codigoEstado: 908 } : {}) } };
      };
      if (stage === "VI") await r.etapaVI();
      else await r.etapaIX();
      assert.deepEqual(lotes, [{ count: expected, sector: 17, pv: 1 }]);
      // 1 recepcion + su validacion inmediata (la fila de validacion ya esta llena).
      assert.equal(posts.length, 2);
      assert.match(posts[0].envelope, new RegExp(`<cantidadFacturas>${expected}</cantidadFacturas>`));
      assert.match(posts[1].meta.op, /^validacionRecepcion/);
      assert.equal(r.state.etapas[stage].cases[caseId], 10);
      assert.deepEqual(r.state.recepcionesLote[stage]["validacion-ds17-pv1"], ["REC"]);
    }
  });

  it("el lote real del sector 17 incluye XML de hospital con campos medicos y CAFC", () => {
    const r = Object.create(Runner.prototype);
    r.nit = "5371375010";
    r.state = emptyState();
    r.state.numeroFactura = 1;
    r.state.cufdByPv["1"] = { codigo: "CUFD", codigoControl: "AB-12" };
    r.state.catalogs = {
      productos: [{ codigoProducto: 1, codigoActividad: "620100", descripcionProducto: "Software" }],
      leyendas: [{ codigoActividad: "620100", descripcionLeyenda: "Ley 453" }],
      unidadesMedida: [{ codigoClasificador: 58 }],
      metodosPago: [{ codigoClasificador: 1 }],
      tiposDocIdentidad: [{ codigoClasificador: 5, descripcion: "NIT" }],
    };
    r.combo = { ...DEFAULT_COMBO, codigoDocumentoSector: 17, codigoPuntoVenta: 1 };
    r.sinNow = () => "2026-09-27T00:00:00.000";
    const lote = r.buildLote(2, { tipoEmision: 2, baseIndex: 0, cafc: "CAFC-TEST" });
    const tar = gunzipSync(Buffer.from(lote.archivo, "base64")).toString("utf8");
    assert.equal(lote.cantidad, 2);
    assert.equal((tar.match(/<cabecera>/g) ?? []).length, 2);
    assert.match(tar, /<nroQuirofanoSalaOperaciones>1<\/nroQuirofanoSalaOperaciones>/);
    assert.match(tar, /<nombreApellidoMedico>MEDICO DE PRUEBAS<\/nombreApellidoMedico>/);
    assert.match(tar, /<cafc>CAFC-TEST<\/cafc>/);
  });

  it("validacion solo cuenta 908 VALIDADA y conserva el recibo para reintento", async () => {
    const r = Object.create(Runner.prototype);
    r.state = emptyState();
    r.state.recepcionesLote.IX["validacion-ds17-pv1"] = ["REC"];
    r.state.etapas.IX = { done: 0, attempts: 0, cases: {}, blockedCases: {}, portalReconciledAt: portal.readAt };
    r.combo = { ...DEFAULT_COMBO, codigoDocumentoSector: 17, codigoPuntoVenta: 1 };
    r.ensureCufd = async () => {};
    r.recepcionBase = (codigoEmision) => ({ codigoAmbiente: 2, codigoDocumentoSector: 17,
      codigoEmision, codigoModalidad: 2, codigoPuntoVenta: 1, codigoSistema: "SIS",
      codigoSucursal: 0, cufd: "CUFD", cuis: "CUIS", nit: "5371375010", tipoFacturaDocumento: 1 });
    r.log = () => {};
    r.checkpoint = () => {};
    let calls = 0;
    r.post = async () => ({ ok: true, parsed: { transaccion: true, codigoEstado: ++calls === 1 ? 902 : 908 } });
    await r.loop("IX", 1, (done) => r.validarRecepcion("IX", "validacion-ds17-pv1", done, "validacionRecepcionMasivaFactura"), { caseId: "validacion-ds17-pv1" });
    assert.equal(calls, 2);
    assert.equal(r.state.etapas.IX.cases["validacion-ds17-pv1"], 1);
  });

  it("retoma una fila parcialmente validada con los recibos NUEVOS y conserva el indice al reiniciar", async () => {
    const key = "validacion-ds17-pv1";
    const partial = structuredClone(portal);
    partial.IX.cases[key] = 5;
    partial.IX.totalCorrectos += 5;
    const r = Object.create(Runner.prototype);
    r.state = applyPortalSnapshot(emptyState(), partial);
    r.combo = { ...DEFAULT_COMBO, codigoDocumentoSector: 17, codigoPuntoVenta: 1 };
    r.ensureCufd = async () => {};
    r.recepcionBase = (codigoEmision) => ({ codigoAmbiente: 2, codigoDocumentoSector: 17,
      codigoEmision, codigoModalidad: 2, codigoPuntoVenta: 1, codigoSistema: "SIS",
      codigoSucursal: 0, cufd: "CUFD", cuis: "CUIS", nit: "5371375010", tipoFacturaDocumento: 1 });
    r.log = () => {};
    r.checkpoint = () => {};
    const sent = [];
    r.post = async (_service, envelope) => {
      sent.push(envelope.match(/<codigoRecepcion>(.*?)<\/codigoRecepcion>/)?.[1]);
      return { ok: true, parsed: { transaccion: true, codigoEstado: 908 } };
    };
    for (const codigoRecepcion of ["NUEVO-1", "NUEVO-2"]) {
      r.guardarRecepcion("IX", key, { ok: true, parsed: { transaccion: true, codigoRecepcion } });
    }
    await r.loop("IX", 6, (done) => r.validarRecepcion("IX", key, done, "validacionRecepcionMasivaFactura"), { caseId: key });
    r.state = migrateState(JSON.parse(JSON.stringify(r.state)));
    await r.loop("IX", 7, (done) => r.validarRecepcion("IX", key, done, "validacionRecepcionMasivaFactura"), { caseId: key });
    assert.deepEqual(sent, ["NUEVO-1", "NUEVO-2"]);
    assert.equal(r.state.etapas.IX.cases[key], 7);
    assert.equal(r.state.etapas.IX.attempts, 2);
  });

  it("un snapshot en cero sustituye el contador global legado y conserva recibos antiguos solo como auditoria", () => {
    const state = emptyState();
    state.etapas.VI = { done: 560, cases: {}, attempts: 560 };
    state.recepcionesLote.VI["validacion-ds17-pv1"] = ["LEGADO"];
    const r = Object.create(Runner.prototype);
    r.state = applyPortalSnapshot(state, { ...portal, VI: { totalCorrectos: 0, cases: {} } });
    assert.equal(r.summary().etapas.find((e) => e.etapa === "VI").hechas, 0);
    assert.deepEqual(r.state.recepcionesLote.VI, {});
    assert.deepEqual(r.state.legacyRecepcionesLote.VI["validacion-ds17-pv1"], ["LEGADO"]);
    assert.deepEqual(state.recepcionesLote.VI["validacion-ds17-pv1"], ["LEGADO"]);
  });

  it("un case de validacion con count 1 no multiplica la meta por motivos o tamanos", async () => {
    for (const stage of ["VI", "IX"]) {
      const r = Object.create(Runner.prototype);
      r.state = applyPortalSnapshot(emptyState(), portal);
      r.combo = { ...DEFAULT_COMBO };
      r.caseFilter = "validacion-ds17-pv1";
      r.log = () => {};
      r.checkpoint = () => {};
      let calls = 0;
      r.validarRecepcion = async () => {
        calls += 1;
        return { ok: true, parsed: { transaccion: true, codigoEstado: 908 } };
      };
      await r.runStage(stage, 1);
      await r.runStage(stage, 1); // meta acumulada: retomar no repite lo terminado
      assert.equal(calls, 1, stage);
      assert.equal(r.state.etapas[stage].cases[r.caseFilter], 1);
    }
  });
});

describe("VI/IX: cada paquete recibido se valida en el acto, aunque la fila de validacion este llena", () => {
  // Por que: el 30-sep no sabiamos si el portal acredita la RECEPCION (901) o solo lo
  // VALIDADO (908). Validar cada paquete apenas se recibe sirve en los dos casos y
  // cuesta 1 SOAP de lectura por paquete.
  const portal = JSON.parse(readFileSync(new URL("../portal-fase1-20260927.json", import.meta.url), "utf8"));
  const CASOS = {
    VI: { caseId: "recepcion-ds1-motivo3-pv0-menor500", valKey: "validacion-ds1-pv0", op: "validacionRecepcionPaqueteFactura" },
    IX: { caseId: "recepcion-ds1-pv0-menor1000", valKey: "validacion-ds1-pv0", op: "validacionRecepcionMasivaFactura" },
  };

  // Runner con red simulada: `estados` es la cola de codigoEstado que devuelve cada validacion.
  const armar = (stage, estados) => {
    const { caseId, valKey } = CASOS[stage];
    const r = Object.create(Runner.prototype);
    r.state = applyPortalSnapshot(emptyState(), portal);
    for (const [id, target] of Object.entries(LOTE_CASE_TARGETS[stage])) r.state.etapas[stage].cases[id] = target;
    r.state.etapas[stage].cases[caseId] = 0;
    r.state.etapas[stage].blockedCases = {};
    r.state.catalogs.eventos = [{ codigoClasificador: 3, descripcion: "CORTE" }];
    r.combo = { ...DEFAULT_COMBO };
    r.caseFilter = caseId;
    r.validacionEsperaMs = 0;
    const logs = [];
    r.log = (e) => logs.push(e);
    r.checkpoint = () => {};
    r.ensureCufd = async () => {};
    r.eventWindowNow = () => ({ inicioMs: Date.now() - 120000, finMs: Date.now() - 1000 });
    r.registrarEvento = async () => ({ ok: true, body: "<codigoRecepcionEventoSignificativo>EV</codigoRecepcionEventoSignificativo>" });
    r.recepcionBase = (codigoEmision) => ({ codigoAmbiente: 2, codigoDocumentoSector: r.combo.codigoDocumentoSector,
      codigoEmision, codigoModalidad: 2, codigoPuntoVenta: r.combo.codigoPuntoVenta,
      codigoSistema: "SIS", codigoSucursal: 0, cufd: "CUFD", cuis: "CUIS", nit: "5371375010", tipoFacturaDocumento: 1 });
    r.sinNow = () => "2026-10-01T00:00:00.000";
    r.buildLote = (count) => ({ archivo: "TEST", hashArchivo: "HASH", cantidad: count });
    const posts = [];
    let n = 0;
    r.post = async (_service, envelope, meta) => {
      posts.push({ op: meta.op, codigo: envelope.match(/<codigoRecepcion>(.*?)<\/codigoRecepcion>/)?.[1] ?? null });
      if (meta.op.startsWith("validacion")) {
        return { ok: true, parsed: { transaccion: true, codigoEstado: estados.shift() ?? 908 } };
      }
      n += 1;
      return { ok: true, parsed: { transaccion: true, codigoEstado: 901, codigoRecepcion: `REC-${n}` } };
    };
    const correr = (count) => (stage === "VI" ? r.etapaVI(count) : r.etapaIX(count));
    return { r, posts, logs, correr, caseId, valKey };
  };

  for (const stage of ["VI", "IX"]) {
    it(`${stage}: valida cada recepcion con su codigo aunque la fila de validacion ya este completa`, async () => {
      const { r, posts, correr, caseId, valKey } = armar(stage, []);
      const filaVal = r.state.etapas[stage].cases[valKey];
      assert.equal(filaVal, LOTE_CASE_TARGETS[stage][valKey], "precondicion: fila de validacion llena");
      await correr(2);
      const ops = posts.map((p) => p.op);
      assert.deepEqual(ops.filter((o) => o.startsWith("validacion")), [CASOS[stage].op, CASOS[stage].op]);
      assert.deepEqual(posts.filter((p) => p.op.startsWith("validacion")).map((p) => p.codigo), ["REC-1", "REC-2"]);
      // cada validacion va DESPUES de su recepcion, no todas al final
      assert.ok(ops.indexOf(CASOS[stage].op) < ops.lastIndexOf(stage === "VI" ? "recepcionPaqueteFactura" : "recepcionMasivaFactura"));
      assert.equal(r.state.etapas[stage].cases[caseId], 2);
      assert.equal(r.state.etapas[stage].cases[valKey], filaVal, "la validacion inmediata no infla la fila de validacion");
      assert.deepEqual(r.state.validacionesInmediatas[stage], { "REC-1": 908, "REC-2": 908 });
    });
  }

  it("901 (pendiente) se reintenta hasta 908 sin reenviar el paquete", async () => {
    const { r, posts, correr, caseId } = armar("VI", [901, 901, 908]);
    await correr(1);
    assert.equal(posts.filter((p) => p.op === "recepcionPaqueteFactura").length, 1);
    assert.equal(posts.filter((p) => p.op === "validacionRecepcionPaqueteFactura").length, 3);
    assert.equal(r.state.validacionesInmediatas.VI["REC-1"], 908);
    assert.equal(r.state.etapas.VI.cases[caseId], 1);
  });

  it("si sigue en 901 tras los reintentos: el paquete cuenta, queda anotado pendiente y la corrida sigue", async () => {
    const { r, posts, correr, caseId } = armar("VI", Array(20).fill(901));
    await correr(1);
    assert.equal(posts.filter((p) => p.op === "recepcionPaqueteFactura").length, 1);
    assert.equal(r.state.validacionesInmediatas.VI["REC-1"], 901);
    assert.equal(r.state.etapas.VI.cases[caseId], 1);
    assert.equal(r.state.etapas.VI.blockedCases[caseId], undefined);
  });

  it("un rechazo (no 908 ni 901) cuenta ESE paquete pero bloquea el caso: no se manda otro igual", async () => {
    const { r, posts, logs, correr, caseId } = armar("VI", [904]);
    await correr(3);
    assert.equal(posts.filter((p) => p.op === "recepcionPaqueteFactura").length, 1);
    assert.equal(r.state.etapas.VI.cases[caseId], 1);
    assert.equal(r.state.validacionesInmediatas.VI["REC-1"], 904);
    assert.equal(r.state.etapas.VI.blockedCases[caseId]?.key, "validacion_rechazada");
    assert.ok(logs.some((l) => l.blocked === "validacion_rechazada"));
  });
});

describe("reintento de casos bloqueados (--retry-blocked)", () => {
  it("parseArgs reconoce el flag (default false)", () => {
    assert.equal(parseArgs([]).retryBlocked, false);
    assert.equal(parseArgs(["--retry-blocked"]).retryBlocked, true);
    assert.equal(parseArgs(["--etapa", "V", "--retry-blocked"]).etapa, "V");
  });

  it("clearBlocked limpia SOLO las etapas pedidas y persiste el checkpoint", async () => {
    const { mkdtempSync, readFileSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join } = await import("node:path");
    const dir = mkdtempSync(join(tmpdir(), "fase1-"));
    const stateFile = join(dir, "state.json");
    const runner = new Runner({
      token: "t",
      nit: "5371375010",
      codigoSistema: "SIS",
      stateFile,
      logFile: join(dir, "log.ndjson"),
      pace: 0,
    });
    runner.state.etapas = {
      V: { done: 0, target: 5, attempts: 35, cases: {}, blockedCases: { "motivo-1": { key: "business:984" } } },
      VI: { done: 10, target: 10, attempts: 25, cases: {}, blockedCases: { x: { key: "k" } } },
    };
    runner.clearBlocked(["V", "VII"]); // VII no existe en el estado: no lanza
    assert.deepEqual(runner.state.etapas.V.blockedCases, {});
    assert.deepEqual(runner.state.etapas.VI.blockedCases, { x: { key: "k" } }); // intacta
    assert.equal(runner.state.etapas.V.done, 0); // el progreso no se toca
    const persisted = JSON.parse(readFileSync(stateFile, "utf8"));
    assert.deepEqual(persisted.etapas.V.blockedCases, {});
  });
});


describe("summary(): el universo son las etapas del SIN, no las claves del checkpoint", () => {
  // Nace de un caso medido el 2026-09-27 contra /opt/onia-siat/fase1-state.json: la
  // etapa VIII entro al runner el 12-sep, el checkpoint vivo arranco antes y el script
  // desplegado solo nombra IV/VII/XI, asi que VIII no tiene fila en `etapas`. summary()
  // derivaba sus filas de Object.entries(state.etapas), o sea del checkpoint: devolvia
  // NUEVE filas todas al 100% con un general de 87%, y quien leia las filas concluia
  // "la Fase 1 esta completa". Una etapa que falta tiene que salir NOMBRADA en 0, no
  // desaparecer: ausente se lee como inexistente, y eso AFIRMA en vez de omitir.
  const runnerDePrueba = (etapas) => {
    const dir = mkdtempSync(join(tmpdir(), "fase1-summary-"));
    const runner = new Runner({
      token: "t",
      nit: "5371375010",
      codigoSistema: "SIS",
      stateFile: join(dir, "state.json"),
      logFile: join(dir, "log.ndjson"),
      pace: 0,
    });
    runner.state.etapas = etapas;
    return { runner, dir };
  };

  it("una etapa de STAGE_ORDER que falta en el checkpoint sale en 0 y marcada, no omitida", () => {
    // Replica del estado vivo: las otras nueve llenas por casos, VIII sin fila.
    const etapas = {};
    for (const id of STAGE_ORDER) {
      if (id === "VIII") continue;
      etapas[id] = {
        done: 0,
        target: STAGE_TARGETS[id],
        attempts: 1,
        cases: { unico: STAGE_TOTALS[id] },
        blockedCases: {},
      };
    }
    const { runner, dir } = runnerDePrueba(etapas);
    try {
      const s = runner.summary();
      assert.deepEqual(
        s.etapas.map((r) => r.etapa),
        STAGE_ORDER,
        "summary() tiene que traer una fila por etapa del SIN, en su orden",
      );
      const viii = s.etapas.find((r) => r.etapa === "VIII");
      assert.ok(viii, "la etapa VIII no puede desaparecer del informe");
      assert.equal(viii.hechas, 0);
      assert.equal(viii.totalSin, STAGE_TOTALS.VIII);
      assert.equal(viii.avance, "0%");
      assert.equal(viii.corrio, false, "hay que poder distinguir 'nunca corrio' de 'corrio y dio 0'");
      // Y el general no se toca: sigue midiendo contra el total del SIN.
      assert.equal(s.general, "5042/5732 (87%)");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("con las diez etapas presentes, ninguna queda marcada como no corrida", () => {
    const etapas = {};
    for (const id of STAGE_ORDER) {
      etapas[id] = {
        done: 0,
        target: STAGE_TARGETS[id],
        attempts: 1,
        cases: { unico: STAGE_TOTALS[id] },
        blockedCases: {},
      };
    }
    const { runner, dir } = runnerDePrueba(etapas);
    try {
      const s = runner.summary();
      assert.equal(s.etapas.length, STAGE_ORDER.length);
      assert.deepEqual(
        s.etapas.filter((r) => !r.corrio).map((r) => r.etapa),
        [],
      );
      assert.equal(s.general, "5732/5732 (100%)");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("una etapa que el checkpoint trae y el SIN no sigue saliendo, para que no se esconda", () => {
    // El reciproco: si alguien deja basura o una etapa retirada en el checkpoint, no se
    // puede perder por derivar de STAGE_ORDER — se nombra al final, con totalSin null.
    const { runner, dir } = runnerDePrueba({
      IV: { done: 0, target: 125, attempts: 1, cases: { unico: 750 }, blockedCases: {} },
      ZZ: { done: 3, target: 3, attempts: 3, cases: {}, blockedCases: {} },
    });
    try {
      const s = runner.summary();
      const ids = s.etapas.map((r) => r.etapa);
      assert.deepEqual(ids.slice(0, STAGE_ORDER.length), STAGE_ORDER);
      assert.ok(ids.includes("ZZ"), "una etapa ajena al SIN no se descarta en silencio");
      const zz = s.etapas.find((r) => r.etapa === "ZZ");
      assert.equal(zz.totalSin, null);
      assert.equal(zz.hechas, 3);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

const RUNNER_CLI = fileURLToPath(new URL("../src/fase1-runner.mjs", import.meta.url));

describe("--solo-informe: leer el avance sin tocar al SIN ni pedir credenciales", () => {
  // Hasta el 2026-09-27 el avance SOLO se imprimia despues de correr una etapa, o sea
  // despues de golpear al SIN. Por eso nadie lo miraba y la etapa que faltaba paso
  // quince dias invisible: preguntar "como va la Fase 1" costaba una corrida real.
  it("parseArgs reconoce el flag (default false)", () => {
    assert.equal(parseArgs([]).soloInforme, false);
    assert.equal(parseArgs(["--solo-informe"]).soloInforme, true);
    assert.equal(parseArgs(["--solo-informe", "--state", "x.json"]).state, "x.json");
  });

  it("imprime el informe con el checkpoint dado, sin credenciales, y NO escribe nada", () => {
    const dir = mkdtempSync(join(tmpdir(), "fase1-informe-"));
    const stateFile = join(dir, "state.json");
    const etapas = {};
    for (const id of STAGE_ORDER) {
      if (id === "VIII") continue;
      etapas[id] = { done: 0, target: STAGE_TARGETS[id], attempts: 1, cases: { unico: STAGE_TOTALS[id] }, blockedCases: {} };
    }
    writeFileSync(stateFile, JSON.stringify({ ...emptyState(), etapas }), "utf8");
    const antes = readFileSync(stateFile, "utf8");
    try {
      const salida = execFileSync(
        process.execPath,
        [RUNNER_CLI, "--solo-informe", "--state", stateFile],
        {
          encoding: "utf8",
          // Sin token, sin nit, sin codigo de sistema: el informe no los necesita.
          env: { PATH: process.env.PATH, HOME: process.env.HOME },
        },
      );
      const informe = JSON.parse(salida);
      assert.equal(informe.general, "5042/5732 (87%)");
      const viii = informe.etapas.find((r) => r.etapa === "VIII");
      assert.equal(viii.corrio, false, "el informe tiene que NOMBRAR la etapa que falta");
      assert.equal(readFileSync(stateFile, "utf8"), antes, "un informe no escribe el checkpoint");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("sin --etapa aborta antes de credenciales, checkpoint y SOAP, incluso con --retry-blocked", () => {
    const dir = mkdtempSync(join(tmpdir(), "fase1-sin-etapa-"));
    const stateFile = join(dir, "state.json");
    const original = JSON.stringify({ etapas: { VI: { cases: { pv0: 280 }, blockedCases: { pv0: { key: "viejo" } } } } });
    writeFileSync(stateFile, original, "utf8");
    try {
      for (const extras of [[], ["--retry-blocked"]]) {
        let fallo = null;
        try {
          execFileSync(process.execPath, [RUNNER_CLI, "--state", stateFile, ...extras], {
            encoding: "utf8",
            env: { PATH: process.env.PATH },
          });
        } catch (err) {
          fallo = err;
        }
        assert.ok(fallo);
        assert.equal(fallo.status, 1);
        assert.match(fallo.stderr, /requiere --etapa explicita/);
        assert.doesNotMatch(fallo.stderr, /faltan SIAT_PILOT_TOKEN/);
        assert.equal(readFileSync(stateFile, "utf8"), original);
        assert.deepEqual(readdirSync(dir), ["state.json"]);
      }
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("sin el flag sigue exigiendo credenciales (no se abrio una puerta que corra al SIN sin token)", () => {
    let fallo = null;
    try {
      execFileSync(process.execPath, [RUNNER_CLI, "--etapa", "I"], {
        encoding: "utf8",
        env: { PATH: process.env.PATH, HOME: process.env.HOME },
      });
    } catch (err) {
      fallo = err;
    }
    assert.ok(fallo, "sin credenciales y sin --solo-informe tiene que salir en rojo");
    assert.equal(fallo.status, 1);
    assert.match(fallo.stderr, /faltan SIAT_PILOT_TOKEN/);
  });
});

describe("matriz de casos del SIN (etapa IV, leida del portal 2026-08-27)", () => {
  it("son 6 combos: 2 puntos de venta x 3 documentos sector", () => {
    assert.deepEqual(PUNTOS_VENTA, [0, 1]);
    assert.deepEqual(DOC_SECTOR_CASES.map((d) => d.codigoDocumentoSector), [1, 17, 24]);
    assert.equal(EMISION_CASES.length, 6);
  });

  it("la nota credito-debito (24) va como documento de AJUSTE (tipo 3)", () => {
    const nota = DOC_SECTOR_CASES.find((d) => d.codigoDocumentoSector === 24);
    assert.equal(nota.tipoFacturaDocumento, 3);
    // Los otros dos son factura con derecho a credito fiscal.
    for (const ds of DOC_SECTOR_CASES.filter((d) => d.codigoDocumentoSector !== 24)) {
      assert.equal(ds.tipoFacturaDocumento, 1);
    }
  });

  it("reproduce exactamente los 6 casos que lista el portal", () => {
    assert.deepEqual(new Set(EMISION_CASES.map(comboId)), new Set([
      "pv0-ds1-tf1", "pv1-ds1-tf1",
      "pv0-ds17-tf1", "pv1-ds17-tf1",
      "pv0-ds24-tf3", "pv1-ds24-tf3",
    ]));
  });

  it("el combo por defecto es el UNICO que el SIN dio por hecho (PdV 0, compra-venta)", () => {
    assert.deepEqual(DEFAULT_COMBO, {
      codigoPuntoVenta: 0, codigoDocumentoSector: 1, tipoFacturaDocumento: 1,
    });
  });

  it("los comboId son unicos (sirven de caseId del checkpoint)", () => {
    assert.equal(new Set(EMISION_CASES.map(comboId)).size, EMISION_CASES.length);
  });
});

describe("matriz de la etapa VIII (firma digital, modalidad electronica)", () => {
  it("son los mismos 6 combos en modalidad 1, con ids -m1 que NO chocan con los computarizados", () => {
    assert.equal(EMISION_CASES_VIII.length, 6);
    for (const c of EMISION_CASES_VIII) {
      assert.equal(c.codigoModalidad, MODALIDAD_ELECTRONICA);
    }
    const ids = EMISION_CASES_VIII.map(comboId);
    assert.deepEqual(new Set(ids), new Set([
      "pv0-ds1-tf1-m1", "pv1-ds1-tf1-m1",
      "pv0-ds17-tf1-m1", "pv1-ds17-tf1-m1",
      "pv0-ds24-tf3-m1", "pv1-ds24-tf3-m1",
    ]));
    const computarizados = new Set(EMISION_CASES.map(comboId));
    for (const id of ids) {
      assert.ok(!computarizados.has(id), `el caseId electronica ${id} pisa uno computarizado`);
    }
  });

  it("cada sector electronica tiene su servicio SOAP mapeado", () => {
    for (const { codigoDocumentoSector } of DOC_SECTOR_CASES) {
      assert.ok(
        SERVICIO_POR_DOC_SECTOR_ELECTRONICA[codigoDocumentoSector],
        `sector ${codigoDocumentoSector} sin servicio electronica`,
      );
    }
  });
});

describe("migracion del checkpoint viejo", () => {
  it("el CUIS/CUFD suelto del 6-ago pasa al mapa del PdV 0", () => {
    const migrado = migrateState({
      cuis: "97DA6A35",
      cufd: { codigo: "ABC", codigoControl: "X-Y" },
      invoices: [{ numero: 1, cuf: "F", anulada: false, revertida: false }],
    });
    assert.equal(migrado.cuisByPv["0"], "97DA6A35");
    assert.equal(migrado.cufdByPv["0"].codigo, "ABC");
    // Y no deja los campos viejos dando vueltas.
    assert.equal(migrado.cuis, undefined);
    assert.equal(migrado.cufd, undefined);
  });

  it("las facturas viejas quedan atribuidas al combo por defecto", () => {
    const migrado = migrateState({ invoices: [{ numero: 7, cuf: "F" }] });
    assert.equal(migrado.invoices[0].combo, comboId(DEFAULT_COMBO));
  });

  it("no pisa un estado que ya viene por punto de venta", () => {
    const migrado = migrateState({ cuis: "VIEJO", cuisByPv: { "0": "NUEVO" } });
    assert.equal(migrado.cuisByPv["0"], "NUEVO");
  });

  it("un estado vacio sobrevive sin inventar claves", () => {
    const migrado = migrateState({});
    assert.deepEqual(migrado.cuisByPv, {});
    assert.deepEqual(migrado.cufdByPv, {});
    assert.deepEqual(migrado.invoices, []);
  });

  it("emptyState ya no tiene cuis/cufd sueltos", () => {
    const vacio = emptyState();
    assert.ok(!("cuis" in vacio), "cuis suelto revive el bug de un solo PdV");
    assert.ok(!("cufd" in vacio), "cufd suelto revive el bug de un solo PdV");
  });
});

describe("el combo manda sobre los parametros del request", () => {
  const runnerDePrueba = () => {
    const r = Object.create(Runner.prototype);
    r.nit = "5371375010";
    r.codigoSistema = "SIS";
    r.state = emptyState();
    r.combo = { ...DEFAULT_COMBO };
    return r;
  };

  it("baseParams y recepcionBase salen del combo actual, no de una constante", () => {
    const r = runnerDePrueba();
    r.combo = { codigoPuntoVenta: 1, codigoDocumentoSector: 24, tipoFacturaDocumento: 3 };
    assert.equal(r.baseParams().codigoPuntoVenta, 1);
    const base = r.recepcionBase();
    assert.equal(base.codigoDocumentoSector, 24);
    assert.equal(base.tipoFacturaDocumento, 3);
  });

  it("CUIS y CUFD se guardan y se leen POR punto de venta", () => {
    const r = runnerDePrueba();
    r.combo = { ...DEFAULT_COMBO, codigoPuntoVenta: 0 };
    r.cuis = "CUIS-PV0";
    r.combo = { ...DEFAULT_COMBO, codigoPuntoVenta: 1 };
    assert.equal(r.cuis, null, "el PdV 1 arranca sin CUIS propio");
    r.cuis = "CUIS-PV1";
    r.combo = { ...DEFAULT_COMBO, codigoPuntoVenta: 0 };
    assert.equal(r.cuis, "CUIS-PV0", "el CUIS del PdV 1 no debe pisar el del 0");
  });

  it("withCombo restaura el combo anterior aunque el callback lance", async () => {
    const r = runnerDePrueba();
    const previo = { ...r.combo };
    await assert.rejects(
      r.withCombo({ codigoPuntoVenta: 1 }, async () => {
        throw new Error("boom");
      }),
      /boom/,
    );
    assert.deepEqual(r.combo, previo);
  });

  it("buildTestInvoice emite bajo el punto de venta que se le pasa", () => {
    const catalogs = {
      productos: [{ codigoProducto: 1, codigoActividad: "620100", descripcionProducto: "Software" }],
      leyendas: [{ codigoActividad: "620100", descripcionLeyenda: "Ley 453" }],
      unidadesMedida: [{ codigoClasificador: 58 }],
      metodosPago: [{ codigoClasificador: 1 }],
      tiposDocIdentidad: [{ codigoClasificador: 5, descripcion: "NIT" }],
    };
    const { payload } = buildTestInvoice({ catalogs, nit: "5371375010", index: 0, codigoPuntoVenta: 1 });
    assert.equal(payload.emisor.puntoVentaCodigo, 1);
  });
});

describe("cobertura de casos end-to-end (el bug que costo la corrida del 6-ago)", () => {
  /** Runner con la red y el disco apagados: solo queremos ver QUE combos pide. */
  function runnerEspia() {
    const r = Object.create(Runner.prototype);
    r.nit = "5371375010";
    r.codigoSistema = "SIS";
    r.pace = 0;
    r.state = emptyState();
    r.state.numeroFactura = 0;
    r.state.catalogs = {
      productos: [{ codigoProducto: 1, codigoActividad: "620100", descripcionProducto: "Software" }],
      leyendas: [{ codigoActividad: "620100", descripcionLeyenda: "Ley 453" }],
      unidadesMedida: [{ codigoClasificador: 58 }],
      metodosPago: [{ codigoClasificador: 1 }],
      tiposDocIdentidad: [{ codigoClasificador: 5, descripcion: "NIT" }],
      motivosAnulacion: [{ codigoClasificador: 1 }],
    };
    r.combo = { ...DEFAULT_COMBO };
    r.vistos = [];
    r.log = () => {};
    r.checkpoint = () => {};
    // Todos los PdV ya tienen CUIS/CUFD: no es lo que se esta probando aca.
    for (const pv of PUNTOS_VENTA) {
      r.state.cuisByPv[String(pv)] = `CUIS-${pv}`;
      r.state.cufdByPv[String(pv)] = {
        codigo: `CUFD-${pv}`,
        codigoControl: "AB-12",
        obtenidoEn: Date.now(),
      };
    }
    r.post = async (service, envelope, meta) => {
      r.vistos.push({ etapa: meta.etapa, combo: comboId(r.combo), service, op: meta.op, envelope });
      return {
        ok: true,
        parsed: { transaccion: true, codigoEstado: 908, codigoRecepcion: "R1" },
      };
    };
    return r;
  }

  /** XML que viajo en <archivo> de un envelope de recepcion (base64 del gzip). */
  function xmlEnviado(envelope) {
    const b64 = /<archivo>([^<]+)<\/archivo>/.exec(envelope)[1];
    return gunzipSync(Buffer.from(b64, "base64")).toString("utf8");
  }

  it("la etapa IV recorre TODOS los combos, no 750 veces el mismo", async () => {
    const r = runnerEspia();
    await r.etapaIV(1); // 1 emision por combo
    const combos = r.vistos.filter((v) => v.etapa === "IV").map((v) => v.combo);
    assert.deepEqual(new Set(combos), new Set(EMISION_CASES.map(comboId)));
    assert.equal(combos.length, 6);
  });

  it("el sector 17 emite con la raiz de hospital/clinica y los campos del medico", async () => {
    const r = runnerEspia();
    await r.etapaIV(1);
    const v = r.vistos.find((x) => x.etapa === "IV" && x.combo === "pv0-ds17-tf1");
    assert.equal(v.service, "FACTURACION_COMPUTARIZADA");
    assert.equal(v.op, "recepcionFactura");
    assert.ok(v.envelope.includes("<codigoDocumentoSector>17</codigoDocumentoSector>"));
    const xml = xmlEnviado(v.envelope);
    assert.ok(xml.includes("<facturaComputarizadaHospitalClinica "), "raiz del sector 17");
    assert.ok(xml.includes("<codigoDocumentoSector>17</codigoDocumentoSector></cabecera>"));
    assert.ok(xml.includes("<nroQuirofanoSalaOperaciones>1</nroQuirofanoSalaOperaciones>"));
    assert.ok(xml.includes("<nitDocumentoMedico>99001</nitDocumentoMedico>"));
  });

  it("el sector 24 emite una nota de ajuste por su servicio, contra una factura del mismo PdV", async () => {
    const r = runnerEspia();
    await r.etapaIV(1);
    const v = r.vistos.find((x) => x.etapa === "IV" && x.combo === "pv0-ds24-tf3");
    assert.equal(v.service, "FACTURACION_DOCUMENTO_AJUSTE");
    assert.equal(v.op, "recepcionDocumentoAjuste");
    assert.ok(v.envelope.includes("<siat:recepcionDocumentoAjuste><SolicitudServicioRecepcionDocumentoAjuste>"));
    assert.ok(v.envelope.includes("<codigoDocumentoSector>24</codigoDocumentoSector>"));
    assert.ok(v.envelope.includes("<tipoFacturaDocumento>3</tipoFacturaDocumento>"));
    const xml = xmlEnviado(v.envelope);
    assert.ok(xml.includes("<notaFiscalComputarizadaCreditoDebito "), "raiz de nota fiscal");
    const original = r.state.invoices.find((f) => f.combo === "pv0-ds1-tf1");
    assert.equal(original.ajustada, true, "la original queda marcada");
    assert.ok(xml.includes(`<numeroAutorizacionCuf>${original.cuf}</numeroAutorizacionCuf>`));
    assert.ok(xml.includes(`<numeroFactura>${original.numero}</numeroFactura>`));
    assert.ok(xml.includes(`<fechaEmisionFactura>${original.datos.fechaEmision}</fechaEmisionFactura>`));
    // Reglas del SIN: original = devuelto = montoTotal; efectivo = 13%.
    const total = original.datos.montoTotal;
    assert.ok(xml.includes(`<montoTotalOriginal>${total}</montoTotalOriginal><montoTotalDevuelto>${total}</montoTotalDevuelto>`));
    assert.ok(xml.includes(`<montoEfectivoCreditoDebito>${Math.round(total * 13) / 100}</montoEfectivoCreditoDebito>`));
    assert.equal((xml.match(/<codigoDetalleTransaccion>1</g) ?? []).length, 1);
    assert.equal((xml.match(/<codigoDetalleTransaccion>2</g) ?? []).length, 1);
  });

  it("si el PdV no tiene una compra-venta con datos, la nota emite una primero", async () => {
    const r = runnerEspia();
    // Una factura vieja del estado (sin `datos`) NO sirve de original.
    r.state.invoices.push({ numero: 1, cuf: "VIEJA", estado: 908, anulada: false, revertida: false, combo: "pv0-ds1-tf1" });
    await r.withCombo(EMISION_CASES[4], () => r.emitOne(0)); // pv0-ds24-tf3
    assert.deepEqual(
      r.vistos.map((v) => [v.combo, v.op]),
      [["pv0-ds1-tf1", "recepcionFactura"], ["pv0-ds24-tf3", "recepcionDocumentoAjuste"]],
    );
    assert.equal(r.state.invoices.length, 3);
    assert.equal(r.state.invoices[0].ajustada, undefined, "la vieja no se toca");
    assert.equal(r.state.invoices[1].ajustada, true);
  });

  it("una original ya ajustada no se reutiliza: cada nota emite su propia compra-venta", async () => {
    const r = runnerEspia();
    await r.withCombo(EMISION_CASES[4], () => r.emitOne(0));
    await r.withCombo(EMISION_CASES[4], () => r.emitOne(1));
    assert.equal(r.state.invoices.filter((f) => f.combo === "pv0-ds1-tf1").length, 2);
    assert.equal(r.state.invoices.filter((f) => f.combo === "pv0-ds24-tf3").length, 2);
  });

  it("anular y revertir una nota usan las operaciones de ajuste", async () => {
    const r = runnerEspia();
    await r.etapaIV(1);
    await r.etapaVII(1);
    await r.etapaXI(1);
    const ops = r.vistos.filter((v) => v.combo === "pv0-ds24-tf3").map((v) => v.op);
    assert.deepEqual(ops, ["recepcionDocumentoAjuste", "anulacionDocumentoAjuste", "reversionAnulacionDocumentoAjuste"]);
    assert.ok(r.vistos.filter((v) => v.combo === "pv0-ds24-tf3").every((v) => v.service === "FACTURACION_DOCUMENTO_AJUSTE"));
  });

  it("cada emision queda etiquetada con su combo", async () => {
    const r = runnerEspia();
    await r.etapaIV(1);
    assert.deepEqual(
      new Set(r.state.invoices.map((f) => f.combo)),
      new Set(EMISION_CASES_SOPORTADOS.map(comboId)),
    );
  });

  it("la anulacion toma una factura del MISMO combo", async () => {
    const r = runnerEspia();
    await r.etapaIV(1);
    await r.etapaVII(1);
    for (const f of r.state.invoices.filter((x) => x.anulada)) {
      const emitidaEn = f.combo;
      // La anulada de cada combo tiene que ser la emitida bajo ese combo.
      assert.ok(EMISION_CASES.map(comboId).includes(emitidaEn));
    }
    assert.equal(r.state.invoices.filter((f) => f.anulada).length, 6);
  });

  it("la reversion tambien respeta el combo", async () => {
    const r = runnerEspia();
    await r.etapaIV(1);
    await r.etapaVII(1);
    await r.etapaXI(1);
    assert.equal(r.state.invoices.filter((f) => f.revertida).length, 6);
  });

  it("anular sin haber emitido en ese combo falla claro, no toma la de otro", async () => {
    const r = runnerEspia();
    // Emitir SOLO en el combo por defecto (el escenario del 6-ago).
    await r.withCombo(DEFAULT_COMBO, () => r.loop("IV", 1, (i) => r.emitOne(i)));
    await assert.rejects(
      r.withCombo(EMISION_CASES[2], () => r.anularOne()),
      /sin facturas validadas del combo/,
    );
  });

  it("la etapa I pide un CUIS por cada punto de venta", async () => {
    const r = runnerEspia();
    r.state.cuisByPv = {};
    r.post = async (_s, _e, meta) => {
      r.vistos.push({ etapa: meta.etapa, combo: comboId(r.combo) });
      return { ok: true, parsed: { transaccion: true, codigo: `CUIS-${r.combo.codigoPuntoVenta}` } };
    };
    await r.etapaI(1);
    const pvs = r.vistos.filter((v) => v.etapa === "I").map((v) => v.combo);
    assert.equal(pvs.length, PUNTOS_VENTA.length);
    assert.deepEqual(Object.keys(r.state.cuisByPv).sort(), ["0", "1"]);
    // Y cada PdV se queda con SU codigo, no con el del ultimo que corrio.
    assert.equal(r.state.cuisByPv["0"], "CUIS-0");
    assert.equal(r.state.cuisByPv["1"], "CUIS-1");
  });

  it("la etapa III pide un CUFD por cada punto de venta", async () => {
    const r = runnerEspia();
    r.state.cufdByPv = {};
    r.post = async (_s, _e, meta) => {
      r.vistos.push({ etapa: meta.etapa, combo: comboId(r.combo) });
      return { ok: true, parsed: { transaccion: true, codigo: "CUFD", codigoControl: "A-1" } };
    };
    await r.etapaIII(1);
    assert.deepEqual(Object.keys(r.state.cufdByPv).sort(), ["0", "1"]);
  });

  // ------------------------- etapa VIII (firma digital) ----------------------

  // Par RSA efimero. El "certificado" es de relleno: el firmador lo embebe sin
  // validarlo (el real de pruebas lo emite AGETIC) y se verifica con la publica.
  const claves = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const publicKeyPem = claves.publicKey.export({ type: "spki", format: "pem" });
  const firmaDePrueba = {
    privateKeyPem: claves.privateKey.export({ type: "pkcs8", format: "pem" }),
    certificatePem: Buffer.from("certificado-de-prueba").toString("base64"),
  };

  it("la etapa VIII recorre los 6 combos electronica con el XML FIRMADO y verificable", async () => {
    const r = runnerEspia();
    r.firma = firmaDePrueba;
    await r.etapaVIII(1);
    const vistos = r.vistos.filter((v) => v.etapa === "VIII");
    assert.deepEqual(new Set(vistos.map((v) => v.combo)), new Set(EMISION_CASES_VIII.map(comboId)));
    for (const v of vistos) {
      assert.ok(
        v.envelope.includes("<codigoModalidad>1</codigoModalidad>"),
        `el request de ${v.combo} no lleva modalidad electronica`,
      );
      const xml = xmlEnviado(v.envelope);
      assert.match(xml, /<(facturaElectronica|notaFiscalElectronica)/, `raiz electronica en ${v.combo}`);
      const check = verifySignedInvoiceXml(xml, { publicKeyPem });
      assert.deepEqual(
        check,
        { digestValid: true, signatureValid: true, valid: true },
        `firma invalida en ${v.combo}`,
      );
    }
  });

  it("cada sector de la VIII viaja por su servicio electronica", async () => {
    const r = runnerEspia();
    r.firma = firmaDePrueba;
    await r.etapaVIII(1);
    const porSector = {};
    for (const v of r.vistos.filter((x) => x.etapa === "VIII")) {
      porSector[/-ds(\d+)-/.exec(v.combo)[1]] = v.service;
    }
    assert.deepEqual(porSector, {
      1: "FACTURACION_COMPRA_VENTA",
      17: "FACTURACION_ELECTRONICA",
      24: "FACTURACION_DOCUMENTO_AJUSTE",
    });
  });

  it("la nota electronica ajusta una original ELECTRONICA del mismo PdV", async () => {
    const r = runnerEspia();
    r.firma = firmaDePrueba;
    await r.withCombo(EMISION_CASES_VIII[4], () => r.emitOne(0)); // pv0-ds24-tf3-m1
    assert.deepEqual(
      r.vistos.map((v) => [v.combo, v.op]),
      [["pv0-ds1-tf1-m1", "recepcionFactura"], ["pv0-ds24-tf3-m1", "recepcionDocumentoAjuste"]],
    );
  });

  it("sin certificado la VIII se salta con log (cero red) y el material lanza claro", async () => {
    const r = runnerEspia();
    const logs = [];
    r.log = (e) => logs.push(e);
    await r.etapaVIII(1);
    assert.equal(r.vistos.length, 0, "una corrida sin certificado no debe tocar la red");
    assert.ok(logs.some((l) => l.etapa === "VIII" && /sin certificado/.test(l.skipped ?? "")));
    await assert.rejects(
      r.withCombo(EMISION_CASES_VIII[0], () => r.emitOne(0)),
      /SIAT_FIRMA_KEY_FILE/,
    );
  });
});

describe("un caso con prerequisito faltante no mata la etapa", () => {
  it("el throw se convierte en error de racha y los demas casos siguen", async () => {
    const r = Object.create(Runner.prototype);
    r.state = emptyState();
    r.combo = { ...DEFAULT_COMBO };
    r.log = () => {};
    r.checkpoint = () => {};
    const corridos = [];
    // El primer caso revienta (como assembleEmission sin cufd.codigoControl);
    // el segundo anda. Antes de la guarda, el primero abortaba la etapa entera.
    for (const caso of ["rompe", "anda"]) {
      await r.loop(
        "IV",
        1,
        async () => {
          corridos.push(caso);
          if (caso === "rompe") throw new Error("assembleEmission requiere cufd.codigoControl");
          return { ok: true, parsed: { transaccion: true } };
        },
        { caseId: caso },
      );
    }
    assert.ok(corridos.includes("anda"), "el segundo caso nunca se intento");
    assert.equal(r.state.etapas.IV.cases.anda, 1);
    assert.ok(!r.state.etapas.IV.cases.rompe, "el caso roto no deberia contar");
    // Y se bloquea EN EL ACTO: un prerequisito faltante no mejora reintentando.
    assert.equal(corridos.filter((c) => c === "rompe").length, 1);
    assert.match(r.state.etapas.IV.blockedCases.rompe.mensaje.descripcion, /codigoControl/);
  });

  it("un StopError sigue abortando (no se lo traga la guarda)", async () => {
    const r = Object.create(Runner.prototype);
    r.state = emptyState();
    r.combo = { ...DEFAULT_COMBO };
    r.log = () => {};
    r.checkpoint = () => {};
    await assert.rejects(
      r.loop("IV", 1, async () => {
        throw new StopError("IV", { key: "x", count: 5 }, null);
      }),
      StopError,
    );
  });
});


describe("cada documento sector tiene su propio servicio SOAP (SIN 995)", () => {
  it("el ruteo cubre los 3 sectores de la solicitud 9473", () => {
    assert.deepEqual(SERVICIO_POR_DOC_SECTOR, {
      1: "FACTURACION_COMPRA_VENTA",
      17: "FACTURACION_COMPUTARIZADA",
      24: "FACTURACION_DOCUMENTO_AJUSTE",
    });
  });

  it("cada sector resuelve su servicio; el 24 ademas cambia de operaciones", () => {
    const r = Object.create(Runner.prototype);
    r.combo = { codigoPuntoVenta: 0, codigoDocumentoSector: 1, tipoFacturaDocumento: 1 };
    assert.equal(r.servicio, "FACTURACION_COMPRA_VENTA");
    assert.equal(r.ops.recepcion.op, "recepcionFactura");
    r.combo = { codigoPuntoVenta: 0, codigoDocumentoSector: 17, tipoFacturaDocumento: 1 };
    assert.equal(r.servicio, "FACTURACION_COMPUTARIZADA");
    assert.equal(r.ops.recepcion.op, "recepcionFactura");
    r.combo = { codigoPuntoVenta: 0, codigoDocumentoSector: 24, tipoFacturaDocumento: 3 };
    assert.equal(r.servicio, "FACTURACION_DOCUMENTO_AJUSTE");
    assert.deepEqual(
      [r.ops.recepcion.op, r.ops.anulacion.op, r.ops.reversion.op],
      ["recepcionDocumentoAjuste", "anulacionDocumentoAjuste", "reversionAnulacionDocumentoAjuste"],
    );
  });

  it("un sector sin mapear no se manda al servicio equivocado", () => {
    const r = Object.create(Runner.prototype);
    r.combo = { codigoPuntoVenta: 0, codigoDocumentoSector: 99, tipoFacturaDocumento: 1 };
    assert.throws(() => r.servicio, /sin servicio SOAP mapeado/);
  });

  it("el servicio de ajuste espera mas: tarda 36-43 s en contestar (medido en el piloto)", () => {
    assert.ok(timeoutFor("FACTURACION_DOCUMENTO_AJUSTE") >= 60_000);
    assert.equal(timeoutFor("FACTURACION_COMPRA_VENTA"), undefined);
    assert.equal(timeoutFor("FACTURACION_COMPUTARIZADA"), undefined);
  });

  it("ya no queda ningun sector sin soporte: los 6 combos se emiten", () => {
    assert.equal(DOC_SECTOR_SIN_SOPORTE.size, 0);
    assert.equal(EMISION_CASES_SOPORTADOS.length, 6);
  });

  it("buildTestInvoice del sector 17 lleva quirofano y medico en la linea y el sector en el documento", () => {
    const catalogs = {
      productos: [{ codigoProducto: 1, codigoActividad: "620100", descripcionProducto: "Consulta" }],
      leyendas: [],
      unidadesMedida: [{ codigoClasificador: 58 }],
      metodosPago: [{ codigoClasificador: 1 }],
      tiposDocIdentidad: [{ codigoClasificador: 5, descripcion: "NIT" }],
    };
    const salud = buildTestInvoice({ catalogs, nit: "5371375010", index: 0, codigoDocumentoSector: 17 });
    assert.equal(salud.payload.documento.tipoDocumentoSector, 17);
    assert.equal(salud.payload.items[0].nroQuirofanoSalaOperaciones, 1);
    assert.equal(salud.payload.items[0].nombreApellidoMedico, "MEDICO DE PRUEBAS");
    assert.equal(salud.payload.items[0].nitDocumentoMedico, "99001");
    const venta = buildTestInvoice({ catalogs, nit: "5371375010", index: 0 });
    assert.equal(venta.payload.documento.tipoDocumentoSector, 1);
    assert.equal(venta.payload.items[0].nroQuirofanoSalaOperaciones, undefined);
  });
});

describe("cufdVencido — el CUFD del dia anterior no sirve", () => {
  const ahora = 1_800_000_000_000;
  const vivo = { codigo: "C", codigoControl: "A-1", obtenidoEn: ahora - 1000 };

  it("un CUFD recien obtenido esta vigente", () => {
    assert.equal(cufdVencido(vivo, ahora), false);
  });

  it("uno de hace mas de 24h esta vencido", () => {
    assert.equal(cufdVencido({ ...vivo, obtenidoEn: ahora - CUFD_VIGENCIA_MS - 1 }, ahora), true);
  });

  it("justo en el limite de 24h ya no sirve (el SIN no da tolerancia)", () => {
    assert.equal(cufdVencido({ ...vivo, obtenidoEn: ahora - CUFD_VIGENCIA_MS }, ahora), true);
  });

  it("sin codigoControl esta vencido: el CUF no se puede armar", () => {
    assert.equal(cufdVencido({ codigo: "C", obtenidoEn: ahora }, ahora), true);
  });

  it("null / indefinido cuentan como vencido", () => {
    assert.equal(cufdVencido(null, ahora), true);
    assert.equal(cufdVencido(undefined, ahora), true);
  });
});

/*
 * El CUFD caduca a las 24h y el estado sobrevive dias. `ensureCufd()` se escribio
 * para eso, pero se cableo SOLO en las etapas que motivaron el arreglo (IV, VII, XI
 * via emitirOne/anularOne/revertirOne). Sus hermanas VI y IX quedaron sin el, y por
 * eso la corrida de volumen del 2026-09-04 dejo IV/VII/XI en 125/125 por combo y a
 * VI clavada en 20/280 y IX en 20/80. Medido contra el piloto el 2026-09-08:
 *   IX -> 123 "CODIGO UNICO DE FACTURACION DIARIA (CUFD) FUERA DE TOLERANCIA"
 *   VI -> "EL EVENTO SIGNIFICATIVO NO CORRESPONDE AL CUFD DEL EVENTO REGISTRADO"
 *         (el paquete y su evento comparten CUFD: con uno vencido, la ventana del
 *          evento se calcula sobre un CUFD muerto y el SIN rechaza el par entero)
 * La invariante es de la CLASE, no de cada etapa: toda etapa que hable con el SIN
 * llevando el CUFD tiene que renovarlo antes de la primera operacion.
 */
describe("el CUFD se renueva en TODAS las etapas que lo usan, no solo en las que motivaron el arreglo", () => {
  /** Espia con el CUFD YA VENCIDO: lo que se prueba es quien lo renueva. */
  function runnerCufdVencido() {
    const r = Object.create(Runner.prototype);
    r.nit = "5371375010";
    r.codigoSistema = "SIS";
    r.pace = 0;
    r.state = emptyState();
    r.state.numeroFactura = 0;
    r.state.etapas.VI = { done: 0, attempts: 0, cases: {}, blockedCases: {}, portalReconciledAt: "2026-09-27" };
    r.state.etapas.IX = { done: 0, attempts: 0, cases: {}, blockedCases: {}, portalReconciledAt: "2026-09-27" };
    r.state.catalogs = {
      productos: [{ codigoProducto: 1, codigoActividad: "620100", descripcionProducto: "Software" }],
      leyendas: [{ codigoActividad: "620100", descripcionLeyenda: "Ley 453" }],
      unidadesMedida: [{ codigoClasificador: 58 }],
      metodosPago: [{ codigoClasificador: 1 }],
      tiposDocIdentidad: [{ codigoClasificador: 5, descripcion: "NIT" }],
      motivosAnulacion: [{ codigoClasificador: 1 }],
      // 1-4 son los de conectividad: los unicos que sirven para un paquete sin CAFC.
      eventos: [{ codigoClasificador: 2, descripcion: "CORTE DEL SERVICIO DE INTERNET" }],
    };
    r.combo = { ...DEFAULT_COMBO };
    r.vistos = [];
    r.log = () => {};
    r.checkpoint = () => {};
    r.buildLote = (cantidad) => ({ archivo: "TEST", hashArchivo: "HASH", cantidad });
    const vencido = Date.now() - CUFD_VIGENCIA_MS - 60_000;
    for (const pv of PUNTOS_VENTA) {
      r.state.cuisByPv[String(pv)] = `CUIS-${pv}`;
      r.state.cufdByPv[String(pv)] = {
        codigo: `CUFD-VIEJO-${pv}`,
        codigoControl: "AB-12",
        obtenidoEn: vencido,
      };
    }
    r.post = async (service, envelope, meta) => {
      r.vistos.push({ etapa: meta.etapa, op: meta.op, combo: comboId(r.combo) });
      if (meta.op === "cufd_refresh") {
        // El SIN devuelve un CUFD nuevo; sin `codigo` ensureCufd lanza.
        return {
          ok: true,
          parsed: {
            codigo: `CUFD-NUEVO-${r.combo.codigoPuntoVenta}`,
            codigoControl: "CD-34",
            // Como el del SIN: vence 24h despues de emitido, y se emitio hace un
            // rato. eventWindowNow deriva la ventana del evento de cufdVigenteDesde,
            // asi que un CUFD que vence EXACTO dentro de 24h deja ventana cero.
            fechaVigencia: formatSinLocal(Date.now() + CUFD_VIGENCIA_MS - 10 * 60_000),
          },
        };
      }
      return {
        ok: true,
        parsed: {
          transaccion: true,
          codigoEstado: 908,
          codigoRecepcion: "R1",
          codigoRecepcionEventoSignificativo: "EV1",
        },
      };
    };
    return r;
  }

  /** La primera operacion contra el SIN de la etapa tiene que ser el refresh. */
  function primeraOpDe(vistos, etapa) {
    const i = vistos.findIndex((v) => v.etapa === etapa);
    assert.ok(i >= 0, `la etapa ${etapa} no hizo ninguna operacion`);
    return vistos[i - 1]?.op ?? null;
  }

  it("la etapa IX (masiva) renueva el CUFD vencido antes de mandar el lote", async () => {
    const r = runnerCufdVencido();
    r.caseFilter = masivaCaseId(MASIVA_CASES[0]);
    await r.etapaIX(1);
    assert.equal(
      primeraOpDe(r.vistos, "IX"),
      "cufd_refresh",
      "la masiva viaja con el CUFD en el CUF de cada factura del lote: sin renovar, el SIN responde 123",
    );
  });

  /*
   * La VI se mide espiando ensureCufd en vez del orden de los posts: el paquete
   * solo sale si eventWindowNow devuelve una ventana util, y esa ventana depende
   * de la vigencia real que el SIN le ponga al CUFD nuevo. Fijarla en el espia
   * probaria mi aritmetica, no la del runner. Lo que importa es la invariante:
   * la etapa renueva ANTES de calcular la ventana del evento.
   */
  it("la etapa VI (paquetes) renueva el CUFD vencido antes de registrar el evento", async () => {
    const r = runnerCufdVencido();
    r.caseFilter = paqueteCaseId(PAQUETE_CASES.find((c) => c.motivo === 2));
    const orden = [];
    const realEnsure = Runner.prototype.ensureCufd.bind(r);
    r.ensureCufd = async () => {
      orden.push("ensureCufd");
      return realEnsure();
    };
    const realWindow = Runner.prototype.eventWindowNow.bind(r);
    r.eventWindowNow = () => {
      orden.push("eventWindowNow");
      return realWindow();
    };
    await r.etapaVI(1).catch(() => {}); // la ventana puede agotarse; el orden ya quedo
    assert.equal(
      orden[0],
      "ensureCufd",
      "el evento y su paquete comparten CUFD: con uno vencido el par entero se rechaza " +
        'con "EL EVENTO SIGNIFICATIVO NO CORRESPONDE AL CUFD DEL EVENTO REGISTRADO"',
    );
    assert.ok(orden.includes("eventWindowNow"), "la etapa tiene que llegar a calcular la ventana");
  });

  it("las tres que ya lo tenian siguen renovandolo (no se rompe lo que andaba)", async () => {
    const r = runnerCufdVencido();
    await r.etapaIV(1);
    assert.equal(primeraOpDe(r.vistos, "IV"), "cufd_refresh");
  });
});

describe("un prerequisito TRANSITORIO no se bloquea para siempre", () => {
  // POR QUE EXISTE, medido el 2026-09-08 contra el piloto del SIN: las etapas VI y
  // IX estuvieron clavadas en 20 casos desde el 6-ago. No fue solo el ensureCufd()
  // que faltaba (a28b3689): al reintentarlas con el runner arreglado, VI freno con
  //   "sin ventana valida para el evento significativo (CUFD o evento previo
  //    demasiado frescos): esperar ~2 min y reintentar"
  // y ese mensaje —que pide explicitamente reintentar— caia en la MISMA rama que un
  // prerequisito determinista ("sin CUIS para el punto de venta 1"), asi que quedaba
  // en blockedCases. Como loop() saltea todo caso ya bloqueado y run-fase1-volumen.sh
  // nunca pasa --retry-blocked, un tropiezo de DOS MINUTOS congelaba la etapa para
  // siempre. El comentario del catch lo justificaba: "un prerequisito faltante es
  // DETERMINISTA". Es cierto para casi todos y falso para este.
  it("el caso NO queda en blockedCases, asi la corrida siguiente lo toma sola", async () => {
    const r = Object.create(Runner.prototype);
    r.state = emptyState();
    r.combo = { ...DEFAULT_COMBO };
    r.log = () => {};
    r.checkpoint = () => {};
    let intentos = 0;
    await r.loop(
      "VI",
      1,
      async () => {
        intentos += 1;
        throw new TransitorioError("CUFD o evento previo demasiado frescos: esperar ~2 min");
      },
      { caseId: "pv0" },
    );
    assert.equal(intentos, 1, "un transitorio tampoco se martilla dentro de la misma corrida");
    assert.deepEqual(
      r.state.etapas.VI.blockedCases,
      {},
      "un prerequisito transitorio NO puede quedar en blockedCases: loop() saltea los bloqueados",
    );
  });

  // El eslabon que ata las dos mitades: sin esto, `loop()` sabria tratar un
  // TransitorioError que NADIE lanza, y el arreglo no se dispararia jamas en
  // produccion. Es el caso que reproduce lo medido contra el piloto del SIN.
  it("eventWindow lanza TransitorioError cuando el CUFD esta demasiado fresco", () => {
    const ahora = Date.now();
    assert.throws(
      () => eventWindow({ nowSinMs: ahora, cufdDesdeMs: ahora, minInicioMs: ahora }),
      (err) => {
        assert.ok(
          err instanceof TransitorioError,
          `la ventana imposible tiene que ser transitoria, vino ${err.constructor.name}`,
        );
        assert.match(err.message, /esperar ~2 min y reintentar/);
        return true;
      },
    );
  });

  it("un prerequisito determinista SIGUE bloqueandose (no se afloja la guarda)", async () => {
    const r = Object.create(Runner.prototype);
    r.state = emptyState();
    r.combo = { ...DEFAULT_COMBO };
    r.log = () => {};
    r.checkpoint = () => {};
    await r.loop(
      "VI",
      1,
      async () => {
        throw new Error("sin CUIS para el punto de venta 1: correr la etapa I antes");
      },
      { caseId: "pv1" },
    );
    assert.match(r.state.etapas.VI.blockedCases.pv1.mensaje.descripcion, /sin CUIS/);
  });
});

describe("los wrappers historicos abortan antes de leer credenciales o enviar SOAP", () => {
  for (const name of ["run-fase1-volumen.sh", "run-fase1-pdv1.sh"]) {
    it(`${name} queda retirado y solo orienta a un caso explicito`, () => {
      const script = fileURLToPath(new URL(`../${name}`, import.meta.url));
      const scriptText = readFileSync(script, "utf8");
      assert.equal(scriptText.includes("\r"), false, "el wrapper debe poder ejecutarse en Linux");
      const commands = scriptText.split(/\r?\n/)
        .map((line) => line.trim()).filter((line) => line && !line.startsWith("#"));
      // Revisar antes de ejecutar: una version vieja no puede alcanzar /opt ni env.
      assert.match(commands[0], /^echo "ABORTA:.*retirado/);
      assert.equal(commands[1], "exit 1");
      const shell = process.platform === "win32"
        ? join(process.env.ProgramFiles ?? "C:/Program Files", "Git/bin/bash.exe")
        : "/bin/sh";
      assert.throws(() => execFileSync(shell, [script], { encoding: "utf8", stdio: "pipe" }), (error) => {
        assert.equal(error.status, 1);
        assert.match(error.stderr, /ABORTA:.*retirado/);
        return true;
      });
    });
  }
});

// 9-oct-2026: los 180 casos que faltan de la VI son los motivos 5/6/7, que piden
// CAFC. El SIN da uno por documento sector y sucursal, cada uno con su RANGO de
// numeros (1047 si una factura cae afuera). Sin red: SIN y evento simulados.
describe("CAFC del piloto por sector y PdV, numerado dentro de su rango", () => {
  const portal = JSON.parse(readFileSync(new URL("../portal-fase1-20260927.json", import.meta.url), "utf8"));
  const catalogos = {
    productos: [{ codigoProducto: 1, codigoActividad: "620100", descripcionProducto: "Software" }],
    leyendas: [{ codigoActividad: "620100", descripcionLeyenda: "Ley 453" }],
    unidadesMedida: [{ codigoClasificador: 58 }],
    metodosPago: [{ codigoClasificador: 1 }],
    tiposDocIdentidad: [{ codigoClasificador: 5, descripcion: "NIT" }],
    eventos: [
      { codigoClasificador: 5, descripcion: "VIRUS INFORMATICO O FALLA DE SOFTWARE" },
      { codigoClasificador: 6, descripcion: "CAMBIO DE INFRAESTRUCTURA DE SISTEMA O FALLA DE HARDWARE" },
      { codigoClasificador: 7, descripcion: "CORTE DE SUMINISTRO DE ENERGIA ELECTRICA" },
    ],
  };

  /** Runner con la fila elegida a un paquete de la meta, y el SIN contestando 908. */
  function runnerVI(caseId, cafcs) {
    const r = Object.create(Runner.prototype);
    r.nit = "5371375010";
    r.cafcs = cafcs;
    r.state = applyPortalSnapshot(emptyState(), portal);
    r.state.numeroFactura = 7000;
    r.state.catalogs = structuredClone(catalogos);
    for (const pv of PUNTOS_VENTA) r.state.cufdByPv[String(pv)] = { codigo: "CUFD", codigoControl: "AB-12" };
    r.combo = { ...DEFAULT_COMBO };
    r.caseFilter = caseId;
    r.validacionEsperaMs = 0;
    r.log = () => {};
    r.checkpoint = () => {};
    r.ensureCufd = async () => {};
    r.sinNow = () => "2026-10-09T12:00:00.000";
    r.eventWindowNow = () => ({ inicioMs: Date.now() - 120000, finMs: Date.now() - 1000 });
    r.eventos = 0;
    r.registrarEvento = async () => {
      r.eventos += 1;
      return { ok: true, body: "<codigoRecepcionEventoSignificativo>EV</codigoRecepcionEventoSignificativo>" };
    };
    r.recepcionBase = (codigoEmision) => ({ codigoAmbiente: 2, codigoDocumentoSector: r.combo.codigoDocumentoSector,
      codigoEmision, codigoModalidad: 2, codigoPuntoVenta: r.combo.codigoPuntoVenta,
      codigoSistema: "SIS", codigoSucursal: 0, cufd: "CUFD", cuis: "CUIS", nit: "5371375010", tipoFacturaDocumento: 1 });
    r.paquetes = [];
    r.post = async (_service, envelope, meta) => {
      if (meta.op === "recepcionPaqueteFactura") {
        const archivo = tagText(envelope, "archivo");
        const tar = gunzipSync(Buffer.from(archivo, "base64")).toString("utf8");
        r.paquetes.push({
          cafc: tagText(envelope, "cafc"),
          numeros: [...tar.matchAll(/<numeroFactura>(\d+)<\/numeroFactura>/g)].map((m) => Number(m[1])),
          cafcXml: [...new Set([...tar.matchAll(/<cafc>([^<]*)<\/cafc>/g)].map((m) => m[1]))],
        });
      }
      return { ok: true, parsed: { transaccion: true, codigoRecepcion: `REC-${r.paquetes.length}`,
        ...(meta.op.startsWith("validacion") ? { codigoEstado: 908 } : {}) } };
    };
    return r;
  }

  it("valida la lista: codigo, enteros, rango y sector/PdV sin repetir", () => {
    assert.deepEqual(parseCafcConfig([{ sector: 1, pv: 0, cafc: " ABC123 ", desde: 1, hasta: 50 }]), [
      { sector: 1, pv: 0, cafc: "ABC123", desde: 1, hasta: 50, reusar: false },
    ]);
    assert.throws(() => parseCafcConfig({ cafc: "X" }), /lista JSON/);
    assert.throws(() => parseCafcConfig([{ sector: 1 }]), /falta el codigo/);
    assert.throws(() => parseCafcConfig([{ cafc: "X", sector: "1" }]), /sector debe ser entero/);
    assert.throws(() => parseCafcConfig([{ cafc: "X", desde: 10, hasta: 5 }]), /rango invalido/);
    assert.throws(() => parseCafcConfig([{ cafc: "X", desde: 1 }]), /rango invalido/);
    assert.throws(() => parseCafcConfig([{ cafc: "X", sector: 17 }, { cafc: "Y", sector: 17 }]), /repetido/);
  });

  it("gana la entrada mas especifica: sector+PdV, despues sector, despues la general", () => {
    const lista = parseCafcConfig([
      { cafc: "GENERAL" },
      { cafc: "DS17", sector: 17 },
      { cafc: "DS17-PV1", sector: 17, pv: 1 },
    ]);
    assert.equal(resolverCafc(lista, { sector: 17, pv: 1 }).cafc, "DS17-PV1");
    assert.equal(resolverCafc(lista, { sector: 17, pv: 0 }).cafc, "DS17");
    assert.equal(resolverCafc(lista, { sector: 1, pv: 0 }).cafc, "GENERAL");
    assert.equal(resolverCafc(parseCafcConfig([{ cafc: "DS1", sector: 1 }]), { sector: 17, pv: 0 }), null);
    assert.equal(resolverCafc(undefined, { sector: 1, pv: 0 }), null);
  });

  it("del ambiente lee el archivo y suma el codigo suelto de siempre", () => {
    const archivo = JSON.stringify([{ cafc: "DS1", sector: 1, desde: 1, hasta: 100 }]);
    const lista = cafcDesdeEnv({ SIAT_PILOT_CAFC_FILE: "/x.json", SIAT_PILOT_CAFC: "SUELTO" }, () => archivo);
    assert.deepEqual(lista.map((e) => e.cafc), ["DS1", "SUELTO"]);
    assert.deepEqual(cafcDesdeEnv({}), []);
    assert.equal(cafcDesdeEnv({ SIAT_PILOT_CAFC: "SUELTO" })[0].desde, null);
  });

  it("cada paquete del motivo 5 lleva el CAFC de SU sector y numeros seguidos de su rango", async () => {
    const caseId = "recepcion-ds17-motivo5-pv0-menor500";
    const r = runnerVI(caseId, parseCafcConfig([
      { cafc: "CAFC-DS1", sector: 1, desde: 1, hasta: 100 },
      { cafc: "CAFC-DS17", sector: 17, desde: 501, hasta: 600 },
    ]));
    r.state.etapas.VI.cases[caseId] = 8;
    await r.etapaVI(10);
    assert.equal(r.state.etapas.VI.cases[caseId], 10);
    assert.deepEqual(r.paquetes.map((p) => p.cafc), ["CAFC-DS17", "CAFC-DS17"]);
    assert.deepEqual(r.paquetes.map((p) => p.numeros), [[501, 502], [503, 504]]);
    assert.deepEqual(r.paquetes.map((p) => p.cafcXml), [["CAFC-DS17"], ["CAFC-DS17"]]);
    assert.equal(r.state.numeroFactura, 7000, "el correlativo de la corrida no se toca");
    assert.equal(r.state.cafcSiguiente["CAFC-DS17"], 505);
  });

  it("sin rango que alcance, bloquea el caso ANTES de gastar un evento", async () => {
    const caseId = "recepcion-ds1-motivo5-pv1-igual500";
    const r = runnerVI(caseId, parseCafcConfig([{ cafc: "CAFC-CHICO", sector: 1, desde: 1, hasta: 700 }]));
    r.state.etapas.VI.cases[caseId] = 8;
    await r.etapaVI(10);
    assert.equal(r.paquetes.length, 1, "entra un paquete de 500; el segundo no");
    assert.deepEqual(r.paquetes[0].numeros.slice(0, 2), [1, 2]);
    assert.equal(r.eventos, 1);
    assert.equal(r.state.etapas.VI.cases[caseId], 9);
    assert.match(r.state.etapas.VI.blockedCases[caseId].mensaje.descripcion, /CAFC CAFC\.\.\.: rango 1-700 agotado/);
  });

  it("con reusar vuelve al inicio del rango; sin CAFC de ese sector, bloquea y lo dice", async () => {
    const reusa = "recepcion-ds1-motivo6-pv0-menor500";
    const r = runnerVI(reusa, parseCafcConfig([{ cafc: "CAFC-R", sector: 1, desde: 1, hasta: 3, reusar: true }]));
    r.state.etapas.VI.cases[reusa] = 8;
    await r.etapaVI(10);
    assert.deepEqual(r.paquetes.map((p) => p.numeros), [[1, 2], [1, 2]]);

    const falta = "recepcion-ds17-motivo7-pv0-menor500";
    const s = runnerVI(falta, parseCafcConfig([{ cafc: "CAFC-DS1", sector: 1 }]));
    s.state.etapas.VI.cases[falta] = 9;
    await s.etapaVI(10);
    assert.equal(s.eventos, 0);
    assert.equal(s.paquetes.length, 0);
    assert.match(s.state.etapas.VI.blockedCases[falta].mensaje.descripcion, /requiere CAFC del piloto \(sector 17, PdV 0\)/);
  });

  it("el codigo suelto sin rango sigue numerando con el correlativo", async () => {
    const caseId = "recepcion-ds1-motivo7-pv0-menor500";
    const r = runnerVI(caseId, parseCafcConfig([{ cafc: "SUELTO" }]));
    r.state.etapas.VI.cases[caseId] = 9;
    await r.etapaVI(10);
    assert.deepEqual(r.paquetes.map((p) => [p.cafc, p.numeros]), [["SUELTO", [7001, 7002]]]);
  });
});
