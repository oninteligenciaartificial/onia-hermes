// Los 8 borradores de primer mensaje (sales-kit/PRIMER-MENSAJE-8-CLINICAS-11OCT.md) no pueden contradecir los datos ni las reglas de venta.
//   node --test scripts/primer-mensaje-8-clinicas.test.mjs
//
// ORIGEN (2026-10-11, MADRE MARKETING). Un primer mensaje que dice «desde abril» cuando la Biblioteca dice agosto, o que nombra un minuto de
// llamada que Sergio Urcullo aún no decidió (L-04), o que promete lo que el catálogo no deja (§7/§8), es peor que no escribir. Cada dato
// citado se cruza con CLINICAS-SCZ-CON-PAUTA-11OCT.json; cada texto pasa por el detector de promesas de la web.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { promesasEn } from "../web-factory/apps/onia-platform/scripts/promesa-que-el-producto-cumple.mjs";
import { estadoDeFila, FILAS_DE_LAS_QUE_DEPENDE, MENSAJES_RUTA, render, SALIDA_RUTA } from "../.claude/skills/onia-ventas-pauta/scripts/primer-mensaje-8-clinicas.mjs";

const leer = (ruta) => readFileSync(new URL(`../${ruta}`, import.meta.url), "utf8");
const datos = JSON.parse(leer(MENSAJES_RUTA));
const lista = JSON.parse(leer(datos.meta.fuente_de_datos));
const pagina = new Map(lista.paginas.map((p) => [p.page_id, p]));
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const mesLaPaz = (epoch) => new Date((epoch - 4 * 3600) * 1000).getUTCMonth();

test("el .md versionado es lo que genera el script", () => {
  assert.equal(leer(SALIDA_RUTA), render(), "node .claude/skills/onia-ventas-pauta/scripts/primer-mensaje-8-clinicas.mjs");
});

test("son 8 mensajes, cada uno de una clínica que la lista del día marca candidata o a verificar, y NINGUNO de las que la verificación previa sacó", () => {
  assert.equal(datos.clinicas.length, 8);
  const ids = datos.clinicas.map((c) => c.page_id);
  assert.equal(new Set(ids).size, 8, "page_id repetido");
  for (const c of datos.clinicas) {
    const p = pagina.get(c.page_id);
    assert.ok(p, `${c.nombre}: no está en la lista de clínicas con pauta de hoy`);
    assert.notEqual(p.previo_estado, "SALE", `${c.nombre}: la verificación previa la SACÓ (${p.previo_texto})`);
    assert.ok(["SIGUE", "ESPERA"].includes(p.previo_estado), `${c.nombre}: sin veredicto previo`);
    assert.equal(c.estado, p.previo_estado === "SIGUE" ? "Candidata" : "Condicional", `${c.nombre}: el estado no coincide con el veredicto previo`);
    assert.ok(c.salida && c.salida.length > 20, `${c.nombre}: falta la condición de salida`);
    assert.ok(c.canal.principal && c.canal.fuente && c.canal.alternativa, `${c.nombre}: canal incompleto`);
  }
});

test("los condicionales no se envían: su condición de salida lo dice", () => {
  for (const c of datos.clinicas.filter((x) => x.estado === "Condicional")) assert.match(c.salida, /NO se envía hasta confirmarlo/);
});

test("cada dato de su pauta es el de la Biblioteca: cuántos anuncios, desde qué mes y qué titulares", () => {
  for (const c of datos.clinicas) {
    const p = pagina.get(c.page_id);
    const n = p.starts.length;
    const m = c.hecho.match(/^(\d+) anuncios? activos?/);
    if (m) assert.equal(Number(m[1]), n, `${c.nombre}: dice ${m[1]} anuncios y la Biblioteca tiene ${n}`);
    const meses = new Set(p.starts.map(mesLaPaz));
    for (const mm of c.mensaje.matchAll(/desde (?:el \d+ de |fines de )?(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/g)) {
      assert.ok(meses.has(MESES.indexOf(mm[1])), `${c.nombre}: dice «desde ${mm[1]}» y ningún anuncio activo empezó ese mes`);
    }
    for (const t of c.mensaje.matchAll(/«([^»]+)»/g)) {
      if (["Chatea con nosotros"].includes(t[1]) || p.titulos.includes(t[1])) continue;
      assert.fail(`${c.nombre}: cita «${t[1]}» y no es un titular de sus anuncios`);
    }
    const masViejo = MESES[mesLaPaz(p.starts[0])];
    assert.ok(c.hecho.includes(String(new Date((p.starts[0] - 4 * 3600) * 1000).getUTCDate())) || new RegExp(masViejo, "i").test(c.mensaje) || /desde el \d+ de/.test(c.mensaje) || /\d+-(ene|feb|mar|abr|may|jun|jul|ago|sep|oct)/.test(c.hecho), `${c.nombre}: el hecho no menciona la fecha del anuncio más viejo`);
  }
});

test("el mensaje solo afirma lo que sale de la Biblioteca de hoy; lo que viene de posts viejos va en la «línea opcional»", () => {
  for (const c of datos.clinicas) {
    assert.ok(!/WhatsApp|planes de pago|promociones|cupos|valoración sin costo|cuota|Facebook|Instagram/i.test(c.mensaje.replace(/«[^»]+»/g, "")), `${c.nombre}: el mensaje afirma algo que no sale de la Biblioteca de hoy`);
    const titulos = [...c.mensaje.matchAll(/«([^»]+)»/g)].map((m) => m[1]);
    const anuncios = pagina.get(c.page_id).starts.length;
    if (/\bsu anuncio\b/.test(c.mensaje)) assert.equal(anuncios, 1, `${c.nombre}: dice «su anuncio» y tiene ${anuncios}`);
    void titulos;
  }
  assert.ok(datos.clinicas.filter((c) => c.opcional).length >= 3, "las líneas que vienen de posts viejos quedan registradas como opcionales");
});

test("de usted, firmado por Sergio Urcullo, dirigido al dueño y con UNA sola pregunta de calificación", () => {
  for (const c of datos.clinicas) {
    assert.match(c.mensaje, /^Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz\. Este mensaje es para el dueño o la dueña de /, c.nombre);
    // Lo que va entre « » es el titular de SU anuncio («Agenda tu cita»): no es nuestro tratamiento.
    assert.ok(!/\b(vos|tenés|querés|podés|tu|tus|te|contame|escribinos|sos|cobrás|mostrá|fijate)\b/i.test(c.mensaje.replace(/«[^»]+»/g, "")), `voseo o tuteo en ${c.nombre}`);
    assert.equal((c.mensaje.match(/¿/g) ?? []).length, 1, `${c.nombre}: debe llevar UNA pregunta`);
    assert.equal((c.mensaje.match(/\?/g) ?? []).length, 1);
    const pregunta = c.mensaje.match(/¿[^?]*\?/)[0];
    if (c.pregunta === "P1") assert.match(pregunta, /odontólogos|profesionales/, c.nombre);
    else assert.match(pregunta, /agenda/, c.nombre);
    assert.ok(c.mensaje.endsWith(datos.meta.cierre), `${c.nombre}: cierra distinto`);
    assert.ok(c.mensaje.split(/\s+/).length <= 140, `${c.nombre}: muy largo para un primer mensaje`);
  }
});

test("no promete lo que el catálogo no deja: cero promesas del detector de la web, sin precio, minutos, «clínica de ejemplo», IA ni tratamiento a medias", () => {
  for (const c of datos.clinicas) {
    assert.deepEqual(promesasEn(c.mensaje), [], `${c.nombre}: el detector de promesas encontró algo`);
    const sinCitas = c.mensaje.replace(/«[^»]+»/g, ""); // lo que ELLOS anuncian (p. ej. «desde Bs 300») no es una promesa nuestra
    assert.ok(!/\b(Bs|US\$|\$|precio|cuesta|gratis|gratuit)/i.test(sinCitas), `${c.nombre}: precio o gratuidad`);
    assert.ok(!/\bminutos?\b|\bmin\b|\bhoras?\b/i.test(sinCitas), `${c.nombre}: duración de llamada (L-04 sin decidir) o de atención`);
    // \b no entiende las tildes («botón» no es la palabra «bot»): se usan límites de letra Unicode.
    assert.ok(!/(cl[ií]nica|cuenta|negocio) de ejemplo|inteligencia artificial|tratamiento a medias|recall|vuelve a citar|reactiv|automátic|solo por WhatsApp|chatbot|(?<![\p{L}])bot(?![\p{L}])/iu.test(sinCitas) && !/(?<![\p{L}])IA(?![\p{L}])/u.test(sinCitas), `${c.nombre}: promesa prohibida (§7/§8, §5.4)`);
    assert.ok(!/\b(clientes?|casos? de éxito|testimonio|ya lo usan|otras clínicas)\b/i.test(sinCitas), `${c.nombre}: prueba social inexistente (cero clientes pagando)`);
    assert.ok(!/factura|SIAT/i.test(sinCitas) && !/\bSIN\b/.test(sinCitas), `${c.nombre}: factura o SIAT (catálogo §7)`);
  }
});

test("la compuerta se lee del doc de promesas: mientras alguna fila no esté en ✅, el borrador dice «no enviar»", () => {
  const promesas = leer("hermes-content/docs/ONIA_PROMESA_VS_PRODUCTO.md");
  const estados = FILAS_DE_LAS_QUE_DEPENDE.map((id) => estadoDeFila(promesas, id));
  for (const [i, e] of estados.entries()) assert.ok(/^(✅|🟡|❌|🚫|⬜)/u.test(e), `${FILAS_DE_LAS_QUE_DEPENDE[i]}: estado ilegible «${e}»`);
  const md = render();
  if (estados.some((e) => !e.startsWith("✅"))) assert.match(md, /Compuerta abierta: no enviar/);
  else assert.match(md, /Compuerta cerrada/);
});

test("el borrador dice que no se envió nada y que lo decide Sergio Urcullo, y que cambió el pedido (no son las 8 «Alto»)", () => {
  const md = render();
  assert.match(md, /BORRADORES: no se envió nada, nadie fue contactado/);
  assert.match(md, /Enviarlos lo decide Sergio Urcullo/);
  assert.match(md, /no son «las 8 de encaje Alto»/);
  assert.match(md, /^# LISTA PARA MOSTRAR: primer mensaje 8 clínicas/m);
});
