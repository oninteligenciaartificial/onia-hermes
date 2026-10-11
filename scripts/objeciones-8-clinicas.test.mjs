// Las respuestas a objeciones (sales-kit/OBJECIONES-8-CLINICAS-11OCT.md) no pueden contradecir al código, al catálogo ni al doc de promesas.
//   node --test scripts/objeciones-8-clinicas.test.mjs
//
// ORIGEN (2026-10-11, MADRE MARKETING). Una respuesta de precio con un monto viejo, o una respuesta de factura que insinúa el SIAT, es peor que no
// contestar. Los precios se LEEN de onia-platform (si el repo no está, el test TIRA: no se saltea, igual que `venta-honestidad.test.mjs`).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { promesasEn } from "../web-factory/apps/onia-platform/scripts/promesa-que-el-producto-cumple.mjs";
import { casosDePrecio, conCaso, OBJECIONES_RUTA, planesDelCodigo, render, SALIDA_RUTA } from "../.claude/skills/onia-ventas-pauta/scripts/objeciones-8-clinicas.mjs";
import { estadoDeFila } from "../.claude/skills/onia-ventas-pauta/scripts/primer-mensaje-8-clinicas.mjs";

const leer = (ruta) => readFileSync(new URL(`../${ruta}`, import.meta.url), "utf8");
const datos = JSON.parse(leer(OBJECIONES_RUTA));
const codigo = planesDelCodigo();
const promesas = leer("hermes-content/docs/ONIA_PROMESA_VS_PRODUCTO.md");
const textos = (o) => [o.respuesta, o.pregunta_de_vuelta, o.si_insiste].filter(Boolean);
const rellenados = (o) => (o.id === "precio" ? casosDePrecio(datos, codigo).flatMap((c) => textos(o).map((t) => conCaso(t, c))) : textos(o));

test("el .md versionado es lo que genera el script", () => {
  assert.equal(leer(SALIDA_RUTA), render(), "node .claude/skills/onia-ventas-pauta/scripts/objeciones-8-clinicas.mjs");
});

test("son las 5 objeciones pedidas, en orden", () => {
  assert.deepEqual(datos.objeciones.map((o) => o.id), ["precio", "sistema", "tiempo", "factura", "datos"]);
  assert.deepEqual(datos.objeciones.map((o) => o.objecion), ["¿Cuánto cuesta?", "Ya tengo un sistema / llevo todo en un cuaderno", "No tengo tiempo", "¿Emite factura?", "¿Mis datos dónde quedan?"]);
});

test("el precio sale del código de onia-platform: los 3 planes que se cotizan, con su monto, nombre y tope de usuarios", () => {
  const casos = casosDePrecio(datos, codigo);
  assert.equal(casos.length, 3);
  for (const c of casos) {
    assert.ok(c.precio > 0 && c.plan, `plan ${c.clave} sin precio o nombre en el código`);
    const dicho = conCaso(datos.objeciones[0].respuesta, c);
    assert.match(dicho, new RegExp(`plan ${c.plan}, Bs ${String(c.precio).replace(/\B(?=(\d{3})+(?!\d))/g, "\\.")} al mes`));
  }
  // «hasta 4» → el plan cuyo tope de usuarios alcanza; los topes crecen con el plan.
  assert.ok(casos[0].usuarios >= 4 || casos[0].usuarios < 0, "el primer plan cotizado debe alcanzar para 4 personas");
  assert.ok(casos[1].usuarios >= 5 || casos[1].usuarios < 0);
  assert.ok(casos[2].usuarios < 0, "Completo no tiene tope");
  assert.ok(casos[0].precio < casos[1].precio && casos[1].precio < casos[2].precio);
});

test("todo monto en bolivianos del .md es uno que cobra el código", () => {
  const md = render();
  const validos = new Set(Object.values(codigo.precios));
  for (const m of md.matchAll(/\bBs\.?\s*(\d{1,3}(?:\.\d{3})+|\d+)(?:,\d+)?/g)) {
    const n = Number(m[1].replaceAll(".", ""));
    assert.ok(validos.has(n) || [...validos].some((v) => v * 10 === n), `Bs ${n} no lo cobra el código (${[...validos].join(", ")})`);
  }
});

test("de usted, cortas y sin voseo ni tuteo", () => {
  for (const o of datos.objeciones) {
    for (const t of rellenados(o)) {
      assert.ok(!/\b(vos|tenés|querés|podés|tu|tus|te|contame|escribinos|sos|cobrás|mostrá|fijate|decime)\b/i.test(t), `voseo o tuteo en «${t.slice(0, 50)}»`);
    }
    assert.ok(o.respuesta.split(/\s+/).length <= 75, `${o.id}: la respuesta es larga para un chat`);
  }
});

test("cero promesas del detector de la web en cada respuesta", () => {
  for (const o of datos.objeciones) for (const t of rellenados(o)) assert.deepEqual(promesasEn(t), [], `${o.id}: «${t.slice(0, 60)}…»`);
});

test("la factura SIAT no se promete ni se nombra como futura, y no hay obra a la vista", () => {
  const factura = datos.objeciones.find((o) => o.id === "factura");
  assert.match(factura.respuesta, /Hoy Onia no emite la factura fiscal/);
  for (const o of datos.objeciones) {
    for (const t of rellenados(o)) {
      assert.ok(!/SIAT|electr[oó]nica|\bRND\b|certificaci[oó]n|\bSIN\b/.test(t) || /certificaciones como ISO 27001 no los afirmamos/.test(t), `${o.id}: nombra el SIAT o una certificación`);
      assert.ok(!/muy pronto|pr[oó]ximamente|\bbeta\b|estamos trabajando|en construcci[oó]n|en camino|vamos a (emitir|tener)/i.test(t), `${o.id}: exhibe obra (CLAUDE.md)`);
    }
  }
});

test("sin minutos de llamada, «clínica de ejemplo», IA que atiende ni prueba social inexistente", () => {
  for (const o of datos.objeciones) {
    for (const t of rellenados(o)) {
      assert.ok(!/\bminutos?\b|dos minutos/i.test(t), `${o.id}: duración sin decidir (L-04)`);
      assert.ok(!/(cl[ií]nica|cuenta) de ejemplo|\bIA que\b|asistente con IA|WhatsApp autom|chatbot/i.test(t), `${o.id}: promesa prohibida`);
      assert.ok(!/otras cl[ií]nicas|ya lo usan|nuestros clientes|testimonio|casos? de [eé]xito/i.test(t), `${o.id}: prueba social (cero clientes pagando)`);
    }
  }
});

test("cada fila citada existe en el doc de promesas, y la compuerta se lee de ahí (no se escribe a mano)", () => {
  const md = render();
  for (const o of datos.objeciones) {
    assert.ok(o.filas.length > 0 && o.no_se_dice.length > 0 && o.como_se_usa && o.catalogo, `${o.id}: incompleta`);
    for (const f of o.filas) assert.ok(/^(✅|🟡|❌|🚫|⬜)/u.test(estadoDeFila(promesas, f)), `${o.id}: la fila ${f} no existe o no tiene estado`);
  }
  // Una respuesta que descansa en una fila sin ✅ no puede figurar como «se puede decir hoy».
  const resumen = md.split("## 0.")[1].split("## 1.")[0].split("\n").filter((l) => /^\| \d \|/.test(l));
  for (const [i, o] of datos.objeciones.entries()) {
    const todasVerdes = o.filas.every((f) => estadoDeFila(promesas, f).startsWith("✅")) && o.sin_fila.length === 0;
    assert.equal(/✅ se puede decir hoy/.test(resumen[i]), todasVerdes, `${o.id}: el resumen no coincide con el estado de sus filas`);
  }
});

test("el borrador dice que no se envió nada y trae el título pedido", () => {
  const md = render();
  assert.match(md, /^# LISTA PARA MOSTRAR: objeciones/m);
  assert.match(md, /nada se envió, nadie fue contactado/);
  assert.match(md, /La factura SIAT no se promete ni se nombra como futura/);
});
