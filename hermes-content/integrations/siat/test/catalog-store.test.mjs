import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  CATALOG_NAMES,
  CATALOG_DEFAULTS,
  buildCatalogStore,
  catalogNames,
  getCatalog,
  lookupCode,
  lookupProducto,
  getLeyendas,
  pickLeyenda,
  getMotivoAnulacion,
  isStale,
} from "../src/catalog-store.mjs";

const SYNCED_AT = "2026-06-15T00:00:00.000Z";

// Parametricas de EJEMPLO (forma, no valores oficiales del SIN). Los codigos
// aca son ilustrativos: el store es un contenedor, no la fuente de verdad.
function sampleParametricas() {
  return {
    [CATALOG_NAMES.PRODUCTOS_SERVICIOS]: [
      { codigo: "83131", descripcion: "Servicios de consultoria en informatica", actividadEconomica: "620000" },
      { codigo: 99100, descripcion: "Otros servicios" },
    ],
    [CATALOG_NAMES.UNIDADES_MEDIDA]: [
      { codigo: 57, descripcion: "Unidad (Bienes)" },
      { codigo: 58, descripcion: "Unidad (Servicios)" },
    ],
    [CATALOG_NAMES.LEYENDAS]: [
      { codigo: "1", descripcion: "Ley 453: Tienes derecho a recibir informacion" },
      { codigo: "2", descripcion: "Ley 453: Los bienes garantizan calidad" },
    ],
    [CATALOG_NAMES.MOTIVOS_ANULACION]: [
      { codigo: 1, descripcion: "Factura mal emitida" },
      { codigo: 2, descripcion: "Nota de credito-debito" },
    ],
  };
}

function sampleStore(overrides = {}) {
  return buildCatalogStore(sampleParametricas(), { syncedAt: SYNCED_AT, ...overrides });
}

describe("buildCatalogStore", () => {
  it("construye el store con syncedAt y las parametricas normalizadas", () => {
    const store = sampleStore();
    assert.equal(store.syncedAt, SYNCED_AT);
    assert.equal(store.catalogs[CATALOG_NAMES.PRODUCTOS_SERVICIOS].length, 2);
    assert.equal(store.catalogs[CATALOG_NAMES.UNIDADES_MEDIDA].length, 2);
  });

  it("normaliza cada item al modelo { codigo, descripcion, ...extra }", () => {
    const store = buildCatalogStore(
      { [CATALOG_NAMES.PRODUCTOS_SERVICIOS]: [{ codigo: "1", descripcion: "X", actividadEconomica: "620000" }] },
      { syncedAt: SYNCED_AT },
    );
    assert.deepEqual(store.catalogs[CATALOG_NAMES.PRODUCTOS_SERVICIOS][0], {
      codigo: "1",
      descripcion: "X",
      actividadEconomica: "620000",
    });
  });

  it("rellena codigo/descripcion con null si faltan y conserva extras", () => {
    const store = buildCatalogStore({ custom: [{ simbolo: "kg" }] }, { syncedAt: SYNCED_AT });
    assert.deepEqual(store.catalogs.custom[0], { codigo: null, descripcion: null, simbolo: "kg" });
  });

  it("un valor que no es lista se toma como lista vacia", () => {
    const store = buildCatalogStore({ [CATALOG_NAMES.UNIDADES_MEDIDA]: null }, { syncedAt: SYNCED_AT });
    assert.deepEqual(store.catalogs[CATALOG_NAMES.UNIDADES_MEDIDA], []);
  });

  it("syncedAt por defecto es null (store nunca sincronizado)", () => {
    const store = buildCatalogStore(sampleParametricas());
    assert.equal(store.syncedAt, null);
  });

  it("no muta el input", () => {
    const parametricas = sampleParametricas();
    const store = buildCatalogStore(parametricas, { syncedAt: SYNCED_AT });
    store.catalogs[CATALOG_NAMES.UNIDADES_MEDIDA].push({ codigo: 99 });
    assert.equal(parametricas[CATALOG_NAMES.UNIDADES_MEDIDA].length, 2);
  });

  it("build vacio devuelve store sin catalogos", () => {
    const store = buildCatalogStore();
    assert.deepEqual(store, { syncedAt: null, catalogs: {} });
  });
});

describe("catalogNames", () => {
  it("lista las parametricas presentes", () => {
    const names = catalogNames(sampleStore());
    assert.deepEqual(names.sort(), [
      CATALOG_NAMES.LEYENDAS,
      CATALOG_NAMES.MOTIVOS_ANULACION,
      CATALOG_NAMES.PRODUCTOS_SERVICIOS,
      CATALOG_NAMES.UNIDADES_MEDIDA,
    ].sort());
  });

  it("devuelve [] para un store vacio o nulo", () => {
    assert.deepEqual(catalogNames(buildCatalogStore()), []);
    assert.deepEqual(catalogNames(null), []);
  });
});

describe("getCatalog", () => {
  it("devuelve la lista de una parametrica", () => {
    const lista = getCatalog(sampleStore(), CATALOG_NAMES.UNIDADES_MEDIDA);
    assert.equal(lista.length, 2);
    assert.equal(lista[0].descripcion, "Unidad (Bienes)");
  });

  it("devuelve [] para una parametrica ausente", () => {
    assert.deepEqual(getCatalog(sampleStore(), "inexistente"), []);
  });

  it("devuelve copias: mutar el resultado no afecta al store", () => {
    const store = sampleStore();
    const lista = getCatalog(store, CATALOG_NAMES.UNIDADES_MEDIDA);
    lista[0].descripcion = "hackeado";
    lista.push({ codigo: 99 });
    assert.equal(store.catalogs[CATALOG_NAMES.UNIDADES_MEDIDA][0].descripcion, "Unidad (Bienes)");
    assert.equal(store.catalogs[CATALOG_NAMES.UNIDADES_MEDIDA].length, 2);
  });
});

describe("lookupCode", () => {
  it("encuentra un item por codigo (string)", () => {
    const item = lookupCode(sampleStore(), CATALOG_NAMES.PRODUCTOS_SERVICIOS, "83131");
    assert.equal(item.descripcion, "Servicios de consultoria en informatica");
    assert.equal(item.actividadEconomica, "620000");
  });

  it("compara el codigo como texto (number en el store, string en la busqueda y viceversa)", () => {
    const store = sampleStore();
    assert.equal(lookupCode(store, CATALOG_NAMES.UNIDADES_MEDIDA, "57").descripcion, "Unidad (Bienes)");
    assert.equal(lookupCode(store, CATALOG_NAMES.UNIDADES_MEDIDA, 57).descripcion, "Unidad (Bienes)");
    assert.equal(lookupCode(store, CATALOG_NAMES.PRODUCTOS_SERVICIOS, 99100).descripcion, "Otros servicios");
  });

  it("devuelve null si el codigo no existe", () => {
    assert.equal(lookupCode(sampleStore(), CATALOG_NAMES.UNIDADES_MEDIDA, "999"), null);
  });

  it("devuelve null si la parametrica no existe", () => {
    assert.equal(lookupCode(sampleStore(), "inexistente", "1"), null);
  });

  it("devuelve null si el codigo viene vacio", () => {
    assert.equal(lookupCode(sampleStore(), CATALOG_NAMES.UNIDADES_MEDIDA, ""), null);
    assert.equal(lookupCode(sampleStore(), CATALOG_NAMES.UNIDADES_MEDIDA, null), null);
  });

  it("devuelve una copia (no muta el store)", () => {
    const store = sampleStore();
    const item = lookupCode(store, CATALOG_NAMES.UNIDADES_MEDIDA, 57);
    item.descripcion = "hackeado";
    assert.equal(store.catalogs[CATALOG_NAMES.UNIDADES_MEDIDA][0].descripcion, "Unidad (Bienes)");
  });
});

describe("lookupProducto", () => {
  it("encuentra un producto homologado por su codigo SIN", () => {
    const item = lookupProducto(sampleStore(), "83131");
    assert.equal(item.descripcion, "Servicios de consultoria en informatica");
  });

  it("devuelve null si el codigo de producto no esta homologado", () => {
    assert.equal(lookupProducto(sampleStore(), "00000"), null);
  });
});

describe("getLeyendas / pickLeyenda", () => {
  it("getLeyendas devuelve todas las leyendas", () => {
    const leyendas = getLeyendas(sampleStore());
    assert.equal(leyendas.length, 2);
  });

  it("pickLeyenda es determinista: mismo indice, misma leyenda", () => {
    const store = sampleStore();
    assert.deepEqual(pickLeyenda(store, 0), pickLeyenda(store, 0));
    assert.equal(pickLeyenda(store, 0).codigo, "1");
    assert.equal(pickLeyenda(store, 1).codigo, "2");
  });

  it("pickLeyenda devuelve null fuera de rango o con indice invalido", () => {
    const store = sampleStore();
    assert.equal(pickLeyenda(store, 2), null);
    assert.equal(pickLeyenda(store, -1), null);
    assert.equal(pickLeyenda(store, 1.5), null);
    assert.equal(pickLeyenda(buildCatalogStore(), 0), null);
  });

  it("pickLeyenda devuelve una copia (no muta el store)", () => {
    const store = sampleStore();
    const l = pickLeyenda(store, 0);
    l.descripcion = "hackeado";
    assert.notEqual(store.catalogs[CATALOG_NAMES.LEYENDAS][0].descripcion, "hackeado");
  });
});

describe("getMotivoAnulacion", () => {
  it("encuentra un motivo de anulacion por codigo", () => {
    assert.equal(getMotivoAnulacion(sampleStore(), 1).descripcion, "Factura mal emitida");
    assert.equal(getMotivoAnulacion(sampleStore(), "2").descripcion, "Nota de credito-debito");
  });

  it("devuelve null si el motivo no existe", () => {
    assert.equal(getMotivoAnulacion(sampleStore(), 9), null);
  });
});

describe("isStale", () => {
  it("default maxAgeHours es 24 (sync diaria)", () => {
    assert.equal(CATALOG_DEFAULTS.maxAgeHours, 24);
  });

  it("no esta vencido justo antes de las 24h", () => {
    const now = "2026-06-15T23:59:59.000Z"; // ~24h despues de SYNCED_AT
    assert.equal(isStale(sampleStore(), now), false);
  });

  it("no esta vencido exactamente a las 24h (borde exclusivo)", () => {
    const now = "2026-06-16T00:00:00.000Z"; // exactamente 24h despues
    assert.equal(isStale(sampleStore(), now), false);
  });

  it("esta vencido pasadas las 24h", () => {
    const now = "2026-06-16T00:00:01.000Z"; // 24h + 1s
    assert.equal(isStale(sampleStore(), now), true);
  });

  it("respeta un maxAgeHours custom", () => {
    const now = "2026-06-15T13:00:00.000Z"; // 13h despues
    assert.equal(isStale(sampleStore(), now, { maxAgeHours: 12 }), true);
    assert.equal(isStale(sampleStore(), now, { maxAgeHours: 24 }), false);
  });

  it("un store nunca sincronizado (sin syncedAt) esta vencido", () => {
    assert.equal(isStale(buildCatalogStore(sampleParametricas()), "2026-06-15T01:00:00.000Z"), true);
  });

  it("sin now valido se considera vencido (re-sincronizar)", () => {
    assert.equal(isStale(sampleStore(), "no-es-fecha"), true);
    assert.equal(isStale(sampleStore(), null), true);
  });

  it("un syncedAt en el futuro (skew de reloj) se toma como fresco", () => {
    const now = "2026-06-14T00:00:00.000Z"; // un dia ANTES del syncedAt
    assert.equal(isStale(sampleStore(), now), false);
  });
});
