/**
 * Self-check del auditor de rastro de QA. Puro: el `psql` va inyectado, no toca producción.
 *
 * Lo que estos casos defienden es el motivo por el que el auditor existe: el inventario a mano
 * ya falló en vivo (2026-09-12, 4 filas de `audit_logs` sobrevivieron a una limpieza declarada
 * "verificada"). Por eso hay un caso que exige que una tabla que el auditor no conoce entre
 * sola, y otro que exige que la marca escondida dentro de un `jsonb` sea sujeto.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { auditar, clasificar, consultaDeIdsAjenos, consultaDeRastro, esIdAjenoAlProducto, esOrganizacionDePrueba } from './qa_sin_rastro.mjs';

const CATALOGO = [
  { table_name: 'organizations', column_name: 'id', data_type: 'text' },
  { table_name: 'organizations', column_name: 'slug', data_type: 'text' },
  { table_name: 'organizations', column_name: 'name', data_type: 'text' },
  { table_name: 'patients', column_name: 'id', data_type: 'text' },
  { table_name: 'patients', column_name: 'organizationId', data_type: 'text' },
  { table_name: 'patients', column_name: 'name', data_type: 'text' },
  { table_name: 'audit_logs', column_name: 'id', data_type: 'text' },
  { table_name: 'audit_logs', column_name: 'organizationId', data_type: 'text' },
  { table_name: 'audit_logs', column_name: 'newValue', data_type: 'jsonb' },
  { table_name: 'audit_logs', column_name: 'createdAt', data_type: 'timestamp with time zone' },
];

/** Un psql de mentira: contesta según qué le preguntan. */
function psqlFalso({ catalogo = CATALOGO, organizaciones = [], hallazgos = [], idsAjenos = [] } = {}) {
  return (q) => {
    if (q.includes('information_schema')) return catalogo.map((c) => `${c.table_name}|${c.column_name}|${c.data_type}`).join('\n');
    if (q.startsWith('SELECT id, slug, name FROM organizations')) return organizaciones.map((o) => `${o.id}|${o.slug}|${o.name}`).join('\n');
    if (q.includes('AS detector')) return idsAjenos.map((h) => `id-ajeno|${h.tabla}|${h.columna}|${h.fila}|${h.org}|${h.muestra}`).join('\n');
    return hallazgos.map((h) => `${h.tabla}|${h.columna}|${h.fila}|${h.org}|${h.muestra}`).join('\n');
  };
}

test('el universo se DERIVA: una tabla que el auditor no conoce entra sola', () => {
  const conTablaNueva = [
    ...CATALOGO,
    { table_name: 'tabla_que_nadie_previo', column_name: 'id', data_type: 'text' },
    { table_name: 'tabla_que_nadie_previo', column_name: 'organizationId', data_type: 'text' },
    { table_name: 'tabla_que_nadie_previo', column_name: 'detalle', data_type: 'text' },
  ];
  const sql = consultaDeRastro(conTablaNueva);
  assert.match(sql, /FROM "tabla_que_nadie_previo"/, 'una tabla nueva con organizationId tiene que ser sujeto sin tocar este archivo');
  assert.match(sql, /"detalle"::text ~\*/);
});

test('la marca escondida en un jsonb es sujeto — es donde sobrevivió en producción', () => {
  const sql = consultaDeRastro(CATALOGO);
  assert.match(sql, /"newValue"::text ~\*/, 'audit_logs.newValue es jsonb y ahí quedó el rastro que la limpieza no vio');
});

test('una tabla sin organizationId no se mira, y organizations se mira por su propio id', () => {
  const sql = consultaDeRastro([
    ...CATALOGO,
    { table_name: 'tabla_global', column_name: 'nota', data_type: 'text' },
  ]);
  assert.doesNotMatch(sql, /FROM "tabla_global"/);
  assert.match(sql, /SELECT 'organizations'[\s\S]*?"id" AS org[\s\S]*?FROM "organizations"/);
});

test('rastro dentro de una organización REAL: sucio', () => {
  const r = auditar({
    psql: psqlFalso({
      organizaciones: [{ id: 'org-real', slug: 'clinica-sergio-p2ljs', name: 'Clínica Sergio' }],
      hallazgos: [{ tabla: 'audit_logs', columna: 'newValue', fila: 'a1', org: 'org-real', muestra: '{"body":"Hola zz-qa-… Paciente Prueba"}' }],
    }),
  });
  assert.equal(r.estado, 'sucio');
  assert.equal(r.enReales.length, 1);
  assert.equal(r.enReales[0].org.slug, 'clinica-sergio-p2ljs');
});

test('el mismo rastro dentro de una organización de prueba: limpio', () => {
  const r = auditar({
    psql: psqlFalso({
      organizaciones: [{ id: 'org-qa', slug: 'zz-qa-2026-09-12-0413', name: 'zz-qa-2026-09-12-0413 Negocio' }],
      hallazgos: [{ tabla: 'patients', columna: 'name', fila: 'p1', org: 'org-qa', muestra: 'zz-qa-… Paciente' }],
    }),
  });
  assert.equal(r.estado, 'limpio');
  assert.equal(r.enPrueba.length, 1);
});

test('una fila cuya organización no existe NO se absuelve: cuenta como real', () => {
  const { enReales } = clasificar(
    [{ tabla: 'patients', columna: 'name', fila: 'p1', org: 'org-fantasma', muestra: 'zzqa…' }],
    [{ id: 'otra', slug: 'clinica-sergio-p2ljs', name: 'Clínica Sergio' }],
  );
  assert.equal(enReales.length, 1, 'una fila huérfana es peor que una en org real, no mejor');
});

test('si no puede preguntar sale no-medido, nunca limpio', () => {
  const r = auditar({ psql: () => { throw new Error('Cannot connect to the Docker daemon'); } });
  assert.equal(r.estado, 'no-medido');
  assert.match(r.motivo, /catálogo/);

  const soloElRastroFalla = auditar({
    psql: (q) => {
      if (q.includes('information_schema')) return CATALOGO.map((c) => `${c.table_name}|${c.column_name}|${c.data_type}`).join('\n');
      if (q.startsWith('SELECT id, slug, name FROM organizations')) return 'org-real|clinica-sergio-p2ljs|Clínica Sergio';
      throw new Error('connection reset');
    },
  });
  assert.equal(soloElRastroFalla.estado, 'no-medido');

  const catalogoVacio = auditar({ psql: () => '' });
  assert.equal(catalogoVacio.estado, 'no-medido', 'un catálogo vacío es no haber podido preguntar, no una base sin tablas');
});

test('una organización es de prueba sólo si ELLA lleva la marca', () => {
  assert.equal(esOrganizacionDePrueba({ slug: 'zz-qa-2026-09-12-0413', name: 'x' }), true);
  assert.equal(esOrganizacionDePrueba({ slug: 'zzqa-loquesea', name: 'x' }), true);
  assert.equal(esOrganizacionDePrueba({ slug: 'clinica-sergio-p2ljs', name: 'Clínica Sergio' }), false);
  assert.equal(esOrganizacionDePrueba(null), false);
});

// ─────────────────────────────────────────────────────────────────────────────
// El segundo detector: el que NO depende de que el carril use la marca acordada.
//
// Nace de que el auditor de arriba dio "limpio" el 2026-09-12 con DOCE filas de prueba dentro
// de `clinica-sergio-p2ljs` — la cuenta real de Sergio Urcullo — porque el carril que las sembró
// las llamó `e2e-agentes-…` y la marca escrita acá era `zz-?qa`. Derivar el universo de TABLAS
// de la base no sirve de nada si después se lo filtra por una lista de marcas escrita a mano:
// la lista falla abierto en la marca nueva, que es justo la que nadie previó.
// ─────────────────────────────────────────────────────────────────────────────

test('una marca que este archivo NO conoce igual aparece: el id no lo generó el producto', () => {
  const r = auditar({
    psql: psqlFalso({
      organizaciones: [{ id: 'org-real', slug: 'clinica-sergio-p2ljs', name: 'Clínica Sergio' }],
      hallazgos: [],
      idsAjenos: [{ tabla: 'invoices', columna: 'id', fila: 'e2e-agentes-factura-1', org: 'org-real', muestra: 'e2e-agentes-factura-1' }],
    }),
  });
  assert.equal(r.estado, 'sucio', 'el caso real del 2026-09-12: 12 filas e2e-agentes-* y el auditor decía limpio');
  assert.equal(r.enReales.length, 1);
  assert.equal(r.enReales[0].detector, 'id-ajeno');
});

test('un id que SÍ generó el producto no es sujeto: el detector no puede gritar por toda la base', () => {
  const sql = consultaDeIdsAjenos(CATALOGO);
  assert.match(sql, /FROM "patients"/);
  for (const idSano of ['cmtxwgzof002d01rwq76hw6sy', 'ab6e629f-f798-4a7f-87df-12ec1c7fac0b', '4f9603d8358efe973f6c0a7ad']) {
    assert.equal(esIdAjenoAlProducto(idSano), false, `${idSano} lo generó un generador conocido (cuid / uuid / hex)`);
  }
  for (const idAMano of ['e2e-agentes-factura-1', 'zzqa20260912pac1', 'prueba-1']) {
    assert.equal(esIdAjenoAlProducto(idAMano), true, `${idAMano} lo escribió una persona o un script`);
  }
});

test('la excusa nombrada absuelve su literal EXACTO y nada más', () => {
  assert.equal(esIdAjenoAlProducto('sergio20260904addonwa001'), false, 'el add-on de WhatsApp otorgado a mano el 4-sep es real, no basura de QA');
  assert.equal(esIdAjenoAlProducto('sergio20260904addonwa002'), true, 'un id parecido NO queda pre-aprobado por la excusa del vecino');
});

test('el detector de ids no mira tablas sin organizationId ni columnas id que no sean texto', () => {
  const sql = consultaDeIdsAjenos([
    ...CATALOGO,
    { table_name: 'tabla_global', column_name: 'id', data_type: 'text' },
    { table_name: 'numerada', column_name: 'id', data_type: 'integer' },
    { table_name: 'numerada', column_name: 'organizationId', data_type: 'text' },
  ]);
  assert.doesNotMatch(sql, /FROM "tabla_global"/);
  assert.doesNotMatch(sql, /FROM "numerada"/);
});

test('si el detector de ids no puede preguntar, el auditor entero sale no-medido', () => {
  const r = auditar({
    psql: (q) => {
      if (q.includes('information_schema')) return CATALOGO.map((c) => `${c.table_name}|${c.column_name}|${c.data_type}`).join('\n');
      if (q.startsWith('SELECT id, slug, name FROM organizations')) return 'org-real|clinica-sergio-p2ljs|Clínica Sergio';
      if (q.includes('AS detector')) throw new Error('connection reset');
      return '';
    },
  });
  assert.equal(r.estado, 'no-medido', 'media auditoría no es una auditoría limpia');
});
