/*
 * Tests de la LOGICA PURA del runner de fase 1 (sin red): envelopes de las
 * operaciones de fase 1 (orden XSD verificado 2026-08-06), parser de items de
 * sincronizacion, regla de STOP (5 errores identicos consecutivos), tar ustar,
 * reloj del SIN y factura de prueba armada desde el catalogo.
 * Run: node --test hermes-content/integrations/siat/test/fase1-runner.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { gunzipSync } from "node:zlib";

import {
  CUFD_VIGENCIA_MS,
  RUNNER_OPS,
  normalizeCuisResult,
  SYNC_CASES,
  STAGE_TARGETS,
  STAGE_ORDER,
  STOP_THRESHOLD,
  StopError,
  buildRunnerEnvelope,
  buildTar,
  buildTestInvoice,
  computeSinOffset,
  cufdVigenteDesde,
  errorKey,
  eventWindow,
  extractSyncItems,
  formatSinLocal,
  hashFor,
  pickMotivoSinCafc,
  tagText,
  updateStreak,
} from "../src/fase1-runner.mjs";

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
  it("volumenes oficiales fase 1 computarizada (VIII y X no aplican)", () => {
    assert.deepEqual(STAGE_TARGETS, { I: 2, II: 50, III: 100, IV: 500, V: 5, VI: 10, VII: 250, IX: 10, XI: 98 });
    assert.deepEqual(STAGE_ORDER, ["I", "II", "III", "IV", "V", "VI", "VII", "IX", "XI"]);
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
