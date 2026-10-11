// La campaña «lista para crear» (CAMPANA-1-LISTA-PARA-CREAR.json) no puede contradecir a sus fuentes.
//   node --test scripts/campana-lista.test.mjs
//
// ORIGEN (2026-10-10, pedido de la madre: «que el día que haya tarjeta sea un solo paso»). Una especificación
// ejecutable con 20 números y 6 textos se desactualiza en silencio: el doc de la pauta dice una cosa, el bot
// otra y el JSON la tercera. Mismo patrón que `precargados-de-la-pauta.mjs`: el JSON se LEE contra el doc, el bot y
// el catálogo, no se confía.
//
// Y nace de un fallo real que este mismo cruce habría cazado: el 9-oct se nombraron los anuncios del video y del selfie
// con los códigos «D1V» y «D1S». El motor del bot solo lee LETRA(S) + NÚMERO entre paréntesis (bot-engine.mjs,
// `conCodigoDelAnuncio`): «(D1V)» dejaba `pieceKey = null` y el lead de esos dos anuncios nacía SIN origen, sin que
// nada se pusiera rojo. Por eso acá cada código se prueba contra el motor real y no contra una regex copiada.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { promesasEn } from "../web-factory/apps/onia-platform/scripts/promesa-que-el-producto-cumple.mjs";
import { createState, step } from "../hermes-content/deploy/vps-ops/bot/bot-engine.mjs";
import { configComoProduccion } from "../hermes-content/deploy/vps-ops/bot/config-como-produccion.mjs";

const leer = (ruta) => readFileSync(new URL(`../${ruta}`, import.meta.url), "utf8");
const SPEC_RUTA = "hermes-content/carousels/briefs/ads/CAMPANA-1-LISTA-PARA-CREAR.json";
const spec = JSON.parse(leer(SPEC_RUTA));
const adq = leer("hermes-content/docs/ONIA_ADQUISICION_Y_PAUTA.md");
// Una cifra partida en dos renglones de una cita (`> …`) sigue siendo la misma cifra.
const adqPlano = adq.replace(/\n>\s?/g, " ").replace(/\s+/g, " ");
const conocimiento = JSON.parse(leer("hermes-content/deploy/vps-ops/bot/knowledge.onia.json"));
const campanaBot = conocimiento.campanas.find((c) => c.frase === spec.respuesta_del_bot.frase_prefijo);

const T0 = Date.parse("2026-09-30T19:00:00Z");
const HORARIOS = "jueves 2 de octubre, 14:00@2026-10-02T18:00:00Z|viernes 3 de octubre, 15:00@2026-10-03T19:00:00Z";
const PRODUCCION = configComoProduccion({ horarios: HORARIOS, now: T0 });

const crear = (nombre) => spec.creacion.find((p) => p.herramienta === nombre).args;
const todosLosPasos = () => [...spec.creacion, ...spec.creacion_si_G05_en_verde.pasos].map((p) => p.args ?? {});
const todosLosCreativos = () => [...spec.creacion, ...spec.creacion_si_G05_en_verde.pasos].filter((p) => p.herramienta === "ads_create_creative");
const briefV2 = (id) => JSON.parse(leer(`hermes-content/carousels/briefs/ads/prueba1-v2/${id}.json`));

test("la plata: US$ 56 = US$ 4 × 14 días, en centavos, y por encima del mínimo diario de la cuenta", () => {
  const { plata } = spec;
  assert.equal(plata.total_usd, plata.diario_usd * plata.dias);
  assert.equal(plata.total_centavos, plata.total_usd * 100);
  assert.equal(plata.diario_centavos, plata.diario_usd * 100);
  assert.equal(crear("ads_create_campaign").campaign_lifetime_budget, plata.total_centavos, "el paso 1 usa el total en centavos");
  assert.ok(plata.diario_centavos >= spec.cuenta.min_diario_centavos, "el diario no baja del mínimo de la cuenta (US$ 1)");
  assert.ok(plata.equivalencia_en_bs.a_13_4 <= plata.tope_en_bs, "a Bs 13,4 los 14 días caben en el tope de Bs 750");
  assert.ok(plata.equivalencia_en_bs.a_15 > plata.tope_en_bs, "a Bs 15 NO caben: por eso existe la regla del tipo de cambio");
  assert.ok(plata.tope_en_bs <= plata.techo_total_en_bs);
});

test("la plata del JSON es la del doc de la pauta: US$ 56, 14 días, Bs 750 y techo de Bs 1.400", () => {
  assert.match(adqPlano, /US\$ 56 = US\$ 4 por día durante 14 días/);
  assert.match(adq, /Bs 750 en Meta/);
  assert.match(adq, /Bs 1\.400/);
  assert.match(adq, /Bs 13,4 por dólar/);
});

test("la cuenta y la página son las de §5.8, y la cuenta personal no aparece en ningún paso", () => {
  assert.equal(spec.cuenta.ad_account_id, "1073680778314945");
  assert.equal(spec.cuenta.pagina_id, "1140384625819526");
  assert.ok(adq.includes(spec.cuenta.ad_account_id) && adq.includes(spec.cuenta.pagina_id), "el doc tiene los mismos ids");
  const crudo = JSON.stringify(todosLosPasos());
  assert.ok(!crudo.includes("679613631427810"), "ningún paso toca la cuenta personal de Sergio Urcullo");
  for (const paso of spec.creacion.filter((p) => p.args?.ad_account_id)) assert.equal(paso.args.ad_account_id, spec.cuenta.ad_account_id);
});

test("lo que crea es un borrador y lo que enciende exige el OK escrito: no hay un solo paso que gaste antes", () => {
  const herramientas = spec.creacion.map((p) => p.herramienta);
  assert.ok(!herramientas.includes("ads_activate_entity"), "crear no incluye activar");
  assert.equal(spec.activacion.herramienta, "ads_activate_entity");
  for (const requisito of ["tarjeta", "ok_de_gasto", "filas_en_verde", "media_grabada", "eleccion_de_piezas", "bot", "quien_contesta", "duracion_de_la_llamada", "canales_1_y_2", "instagram_decidido", "self_ai_decidido"]) {
    assert.ok(spec.activacion.solo_con.includes(requisito), `activar exige «${requisito}»`);
    assert.ok(spec.no_se_crea_ni_se_enciende_sin.some((c) => c.id === requisito), `«${requisito}» está definido como condición`);
  }
  assert.equal(spec.no_se_crea_ni_se_enciende_sin.find((c) => c.id === "ok_de_gasto").texto_exacto, "US$ 56, 14 días, tope Bs 750");
  assert.match(spec.ojo_con_el_conector, /BORRADORES/);
  assert.match(spec.estado, /NO CREADA/);
});

test("la estructura es la de §5.8: clic a WhatsApp, conversaciones, Santa Cruz 25 km, 25+, un solo conjunto", () => {
  const campana = crear("ads_create_campaign");
  assert.equal(campana.objective, "OUTCOME_LEADS");
  assert.equal(campana.buying_type, "AUCTION");
  assert.equal(campana.special_ad_categories, "[]");
  assert.equal(campana.campaign_name, "ONIA · Dental SCZ · WhatsApp · prueba 1");
  assert.ok(adq.includes(campana.campaign_name), "el nombre de la campaña es el del doc");
  const conjunto = crear("ads_create_ad_set");
  assert.equal(conjunto.optimization_goal, "CONVERSATIONS");
  assert.equal(conjunto.destination_type, "WHATSAPP");
  assert.equal(JSON.parse(conjunto.promoted_object).page_id, spec.cuenta.pagina_id);
  const geo = JSON.parse(conjunto.targeting).geo_locations.custom_locations[0];
  assert.deepEqual([geo.latitude, geo.longitude, geo.radius, geo.distance_unit], [-17.7833, -63.1821, 25, "kilometer"]);
  assert.equal(JSON.parse(conjunto.targeting).age_min, 25);
  assert.ok(!("daily_budget" in conjunto) && !("lifetime_budget" in conjunto), "con presupuesto en la campaña (CBO) el conjunto no lleva el suyo");
  assert.equal(spec.creacion.filter((p) => p.herramienta === "ads_create_ad_set").length, 1, "un solo conjunto");
});

test("cada código de anuncio lo lee el MOTOR REAL del bot como origen (D1V, D1S o D1C no)", () => {
  const anuncios = [...spec.anuncios.entran, ...spec.anuncios.esperan, ...spec.anuncios.reemplazados];
  assert.ok(anuncios.length >= 8, "ancla: se miden los ocho anuncios (4 que entran, 2 que esperan, 3 reemplazados), no una lista vacía");
  const vistos = new Set();
  for (const a of anuncios) {
    assert.equal(a.texto_precargado, `Hola, vi el anuncio de Onia (${a.codigo}). Tengo una clínica dental.`, `${a.id}: el texto lleva su código`);
    assert.ok(!vistos.has(a.codigo), `${a.id}: el código ${a.codigo} no se repite`);
    vistos.add(a.codigo);
    const r = step(createState({ channel: "chatwoot", contactRef: "ad" }), { text: a.texto_precargado, receivedAt: new Date(T0).toISOString() }, { config: PRODUCCION });
    assert.ok(r.replies.some((x) => x.templateKey === "R_CAMPANA"), `${a.id}: el bot reconoce la frase como campaña`);
    assert.equal(r.nextState.pieceKey, `anuncio-${a.codigo}`, `${a.id}: el lead nace con su origen`);
  }
  const sinOrigen = step(createState({ channel: "chatwoot", contactRef: "ad" }), { text: "Hola, vi el anuncio de Onia (D1V). Tengo una clínica dental.", receivedAt: new Date(T0).toISOString() }, { config: PRODUCCION });
  assert.equal(sinOrigen.nextState.pieceKey, null, "el control: un código con letra después del número SE PIERDE; si esto cambia, la regla del JSON se puede aflojar");
});

test("los precargados del JSON y los del doc de la pauta hablan de los mismos códigos (D1 y D4 son los que el bot vigila)", () => {
  const delDoc = [...adq.matchAll(/`(Hola, vi el anuncio de Onia \(([A-Z]\d+)\)\.[^`]*)`/g)].map((m) => m[2]);
  assert.ok(delDoc.includes("D1"), "el doc trae el precargado de A1-E");
  const delJson = new Set([...spec.anuncios.entran, ...spec.anuncios.esperan, ...spec.anuncios.reemplazados].map((a) => a.codigo));
  assert.ok(delJson.has("D1"), "D1 (A1-E) sigue en el doc de la pauta: el JSON lo conserva como reemplazado");
  for (const codigo of delDoc) assert.ok(delJson.has(codigo) || spec.anuncios.congelados.some((c) => c.id === codigo), `el código ${codigo} del doc está en el JSON o congelado`);
  const creativos = todosLosCreativos();
  assert.equal(creativos.length, 5, "cuatro anuncios que entran y G1-2 condicionado");
  for (const c of creativos) {
    const texto = decodeURIComponent(c.args.link_url.split("text=")[1]);
    assert.match(texto, /^Hola, vi el anuncio de Onia \(D\d+\)\. Tengo una clínica dental\.$/, `${c.para}: el link lleva el precargado con su código`);
    assert.equal(c.args.call_to_action_type, "WHATSAPP_MESSAGE");
  }
});

test("la respuesta del bot es la que está en el conocimiento, y habla de usted", () => {
  assert.ok(campanaBot, "el conocimiento del bot tiene la campaña de la frase-prefijo");
  assert.equal(campanaBot.prefijo, true);
  assert.equal(spec.respuesta_del_bot.texto, campanaBot.respuesta, "el JSON copia el texto del conocimiento, palabra por palabra");
  assert.equal(spec.respuesta_del_bot.version_del_conocimiento, conocimiento.version);
  assert.ok(!/\b(vos|tenés|querés|podés|tu |tus |contame|escribile|sos)\b/i.test(campanaBot.respuesta), "sin voseo ni tuteo");
  assert.ok(campanaBot.respuesta.length < 500, "menos de 500 caracteres");
});

test("el copy de cada anuncio es de usted y no promete lo que el catálogo prohíbe", () => {
  const textos = [...Object.values(spec.copy_de_usted.por_anuncio).flatMap((c) => [c.texto_principal, c.titular]), spec.copy_de_usted.titular, ...todosLosCreativos().flatMap((p) => [p.args.message, p.args.headline])];
  assert.ok(textos.length >= 20, "ancla: se miden los textos de las cinco piezas, no una lista vacía");
  for (const t of textos) {
    assert.deepEqual(promesasEn(t), [], `promete algo prohibido: «${t.slice(0, 70)}…»`);
    assert.ok(!/\b(vos|tenés|querés|podés|tu |tus |contame|escribinos|sos)\b/i.test(t), `voseo o tuteo en «${t.slice(0, 50)}…»`);
    assert.ok(!/\b(tratamientos? a medias|con un toque|factura electr|SIAT|Bs \d|bolivianos al mes)/i.test(t), `texto que el catálogo no deja decir: «${t.slice(0, 50)}…»`);
  }
  for (const [id, c] of Object.entries(spec.copy_de_usted.por_anuncio)) {
    assert.match(c.texto_principal, /usted/i, `${id}: el texto principal le habla de usted`);
    assert.match(c.texto_principal, /Ningún mensaje de Pendientes sale sin que usted lo apruebe/, `${id}: el control acotado a Pendientes, sin «con un toque»`);
  }
});

test("las reglas de corte son las de §5.7: día 3, día 7 y día 14, con Bs 40, Bs 390 y CTR 0,8 %", () => {
  const r = spec.reglas_de_corte;
  assert.ok(r.dia_3.cortar_si.includes("CTR < 0,8 %") && r.dia_3.cortar_si.includes("0 conversaciones"));
  assert.ok(r.dia_7.cortar_si.some((x) => x.includes("Bs 40")));
  assert.ok(r.dia_14.cortar_si.some((x) => x.includes("Bs 390")));
  for (const cifra of ["Bs 40", "Bs 390", "0,8 %", "Bs 1.400"]) assert.ok(adq.includes(cifra), `el doc de la pauta dice «${cifra}»`);
  assert.equal(r.dia_7.bs_40_en_usd.a_13_4, Math.round((40 / 13.4) * 100) / 100, "Bs 40 convertido a 13,4");
  assert.equal(r.dia_14.bs_390_en_usd.a_13_4, Math.round((390 / 13.4) * 100) / 100, "Bs 390 convertido a 13,4");
  assert.ok(r.siempre.some((x) => x.includes("Bs 750")) && r.siempre.some((x) => x.includes("Bs 1.400")));
});

test("el archivo no lleva credenciales, tokens ni teléfonos de pacientes", () => {
  const crudo = leer(SPEC_RUTA);
  assert.ok(!/(password|contraseña|token|secret|EAA[A-Za-z0-9]{20,})/i.test(crudo.replace(/ojo_con_el_conector[\s\S]*?\n/, "")), "sin secretos");
  assert.ok(!/\b591[67]\d{7}\b/.test(crudo), "el número del bot es un marcador {{NUMERO_DEL_BOT}}, no un teléfono pegado");
});

test("el texto, el titular y el precargado de cada anuncio SON los de su brief de la prueba 1 v2, y abren con el filtro de dueños (§5.2)", () => {
  const todos = [...spec.anuncios.entran, ...spec.anuncios.esperan.filter((a) => a.brief)];
  assert.equal(todos.length, 5, "G1-4, G1-3, G1-5, G1-1 y G1-2");
  const creativos = todosLosCreativos();
  for (const a of todos) {
    const brief = briefV2(a.id);
    assert.equal(a.brief, `hermes-content/carousels/briefs/ads/prueba1-v2/${a.id}.json`);
    assert.equal(brief.id, a.id);
    assert.equal(a.texto_precargado, brief.precargado, `${a.id}: el precargado es el del brief`);
    assert.equal(a.codigo, brief.precargado.match(/\((D\d+)\)/)[1], `${a.id}: el código es el del precargado`);
    assert.equal(spec.copy_de_usted.por_anuncio[a.id].texto_principal, brief.texto_principal, `${a.id}: el copy del JSON es el del brief`);
    const c = creativos.find((x) => x.para === a.id);
    assert.ok(c, `${a.id}: tiene su creativo`);
    assert.equal(c.args.message, brief.texto_principal, `${a.id}: el message es el texto principal del brief`);
    assert.equal(c.args.headline, brief.titular, `${a.id}: el titular es el del brief`);
    assert.equal(decodeURIComponent(c.args.link_url.split("text=")[1]), brief.precargado, `${a.id}: el link de WhatsApp lleva el precargado del brief`);
    assert.match(brief.texto_principal, /^Para dueños y dueñas de clínicas dentales de Santa Cruz\./, `${a.id}: abre con el filtro: el cliente ideal es ≲ 0,1 % del público y el anuncio sin filtro trae pacientes`);
    assert.ok(!/con IA/i.test(brief.texto_principal), `${a.id}: el «a quién escribirle» sale de reglas, no de la IA (catálogo §8)`);
    assert.ok(!/\b\d+\s*minutos\b/i.test(brief.texto_principal), `${a.id}: no promete minutos: el bot y /contacto dicen 30 y la agenda 20 (L-04)`);
    assert.equal(c.args.call_to_action_type, "WHATSAPP_MESSAGE");
    assert.equal(c.args.page_id, spec.cuenta.pagina_id);
  }
});

test("quién entra y quién espera: las cuatro que entran no dependen de G-05, G1-2 sí y queda fuera de la creación", () => {
  const entran = spec.anuncios.entran.map((a) => a.id);
  assert.deepEqual(entran.sort(), ["G1-1", "G1-3", "G1-4", "G1-5"]);
  for (const id of entran) {
    const b = briefV2(id);
    assert.match(b.estado, /^sale/, `${id}: su brief dice que sale`);
    assert.ok(!JSON.stringify(b.promesas).includes("G-05"), `${id}: no depende de G-05 («Vuelve a citar» está ⬜)`);
    assert.ok(spec.creacion.some((p) => p.para === id && p.herramienta === "ads_create_ad"), `${id}: tiene su paso de anuncio en la creación`);
  }
  const g12 = briefV2("G1-2");
  assert.match(g12.estado, /^espera/, "G1-2 espera");
  assert.ok(JSON.stringify(g12.promesas).includes("G-05"), "G1-2 depende de G-05");
  assert.ok(!spec.creacion.some((p) => p.para === "G1-2"), "G1-2 no está en la creación: agregarlo después reinicia el aprendizaje");
  assert.ok(spec.creacion_si_G05_en_verde.pasos.every((p) => p.para === "G1-2"), "los pasos condicionados son solo de G1-2");
  assert.equal(spec.anuncios.esperan.find((a) => a.id === "G1-2").codigo, "D8");
  assert.deepEqual(spec.creacion.filter((p) => p.herramienta === "ads_create_ad").length, 4, "cuatro anuncios en la campaña");
  const ids = spec.activacion.args.object_ids;
  assert.equal(ids.length, 2 + 4, "campaña, conjunto y cuatro anuncios se activan juntos");
});

test("cada condición de activación está definida, y cada condición definida se exige", () => {
  const definidas = new Set(spec.no_se_crea_ni_se_enciende_sin.map((c) => c.id));
  for (const id of spec.activacion.solo_con) assert.ok(definidas.has(id), `«${id}» se exige pero no está definida`);
  for (const id of definidas) assert.ok(spec.activacion.solo_con.includes(id), `«${id}» está definida pero no se exige`);
  assert.match(spec.no_se_crea_ni_se_enciende_sin.find((c) => c.id === "captura_nueva").comprobacion, /Enviar yo mismo/, "la captura nueva no muestra el envío a medias (G-03)");
});

test("la subida de medios tiene sus argumentos y cada marcador {{…}} sale de un paso anterior o de «valores_a_resolver»", () => {
  for (const p of [...spec.creacion, ...spec.creacion_si_G05_en_verde.pasos].filter((x) => x.herramienta === "ads_creative_upload_media")) {
    assert.equal(p.args.ad_account_id, spec.cuenta.ad_account_id, `paso ${p.paso}: cuenta`);
    assert.ok(["LOCAL_FILE", "URL"].includes(p.args.upload_source), `paso ${p.paso}: upload_source`);
    assert.equal(p.args_si_es_por_url.upload_source, "URL");
    assert.ok(["IMAGE", "VIDEO"].includes(p.args_si_es_por_url.media_type), `paso ${p.paso}: media_type para la subida por URL`);
  }
  const producidos = new Set(Object.keys(spec.valores_a_resolver).flatMap((k) => k.split(",").map((x) => x.trim())));
  for (const p of [...spec.creacion, ...spec.creacion_si_G05_en_verde.pasos]) for (const g of [p.guarda].flat().filter(Boolean)) producidos.add(g);
  const usados = new Set([...JSON.stringify([spec.creacion, spec.creacion_si_G05_en_verde, spec.activacion]).matchAll(/\{\{([^}]+)\}\}/g)].map((m) => m[1]));
  for (const m of usados) {
    const ok = producidos.has(m) || (m.startsWith("URL_PUBLICA_") && producidos.has("URL_PUBLICA_*")) || (m.startsWith("hash_") || m.startsWith("creative_id_") || m.startsWith("ad_object_id_")) && producidos.has("hash_*");
    assert.ok(ok, `el marcador {{${m}}} no sale de ningún paso ni de «valores_a_resolver»`);
  }
});

test("sin Instagram vinculado, ningún creativo pide posiciones de Instagram (no entregarían)", () => {
  for (const c of todosLosCreativos()) {
    const crudo = JSON.stringify(c.args);
    if (!("instagram_user_id" in c.args)) assert.ok(!/instagram/i.test(crudo), `${c.para}: pide Instagram sin instagram_user_id`);
  }
  assert.ok(spec.no_se_crea_ni_se_enciende_sin.some((c) => c.id === "instagram_decidido"));
});

// ── LISTA PARA MOSTRAR (11-oct, encargo de la madre v4) ──────────────────────────────────────────────────────────────
// El archivo que se le muestra a Sergio Urcullo repite el texto, los códigos y las cifras de la spec. Si uno cambia sin el
// otro, lo que se muestra deja de ser lo que se crea: por eso se lee contra el JSON y el brief, no se confía.
const LISTA_RUTA = "hermes-content/carousels/briefs/ads/CAMPANA-PRUEBA-1-LISTA-PARA-MOSTRAR.md";
const lista = leer(LISTA_RUTA);
const listaPlano = lista.replace(/\s+/g, " ");

test("LISTA PARA MOSTRAR: lleva su título, dice que nada se creó ni se gastó y que el presupuesto está sin aprobar", () => {
  assert.match(lista, /^# LISTA PARA MOSTRAR: campaña prueba 1$/m);
  assert.match(listaPlano, /No se creó nada en Meta, no se gastó nada, no se contactó a nadie/);
  assert.match(listaPlano, /SIN aprobar/);
  assert.equal(spec.lista_para_mostrar.split(" ")[0], LISTA_RUTA, "el JSON apunta a su lista");
});

test("LISTA PARA MOSTRAR: el texto principal y el titular son los del brief, palabra por palabra, y los tres códigos son los de la spec", () => {
  const brief = JSON.parse(leer("hermes-content/carousels/briefs/ads/onia-platform-dental-meta-a1v5-las-diez.json"));
  const bloque = lista.match(/Texto principal, titular y botón[\s\S]*?```\n([\s\S]*?)\n```/);
  assert.ok(bloque, "el bloque de texto principal existe");
  assert.equal(bloque[1], brief.caption, "el texto principal de la lista es el caption del brief");
  assert.ok(lista.includes(`\`${brief.headline_anuncio}\``), "el titular de la lista es el del brief");
  const viejos = spec.anuncios.reemplazados.filter((x) => ["D1", "D2", "D3"].includes(x.codigo));
  assert.equal(viejos.length, 3, "ancla: A1-E, A1-V y A1-S están como reemplazados en la spec");
  for (const a of viejos) {
    assert.ok(lista.includes(a.texto_precargado) || lista.includes(`(${a.codigo})`), `${a.id}: la lista (§1, reemplazado por la v2) nombra su código ${a.codigo}`);
  }
  assert.ok(lista.includes("Hola, vi el anuncio de Onia (D1). Tengo una clínica dental."), "el precargado exacto de D1 está escrito");
});

test("LISTA PARA MOSTRAR: las cifras son las de la spec (US$ 56, 14 días, Bs 750, techo Bs 1.400, cortes Bs 40, Bs 390 y CTR 0,8 %)", () => {
  const { plata, reglas_de_corte: cortes } = spec;
  assert.ok(listaPlano.includes(`US$ ${plata.total_usd}`));
  assert.ok(listaPlano.includes(`${plata.dias} días`));
  assert.ok(listaPlano.includes(`Bs ${plata.tope_en_bs}`));
  assert.ok(listaPlano.includes("Bs 1.400") && plata.techo_total_en_bs === 1400);
  assert.ok(listaPlano.includes("Bs 40") && cortes.dia_7.cortar_si.some((x) => x.includes("Bs 40")));
  assert.ok(listaPlano.includes("Bs 390") && cortes.dia_14.cortar_si.some((x) => x.includes("Bs 390")));
  assert.ok(listaPlano.includes("0,8 %") && cortes.dia_3.cortar_si.some((x) => x.includes("0,8 %")));
  for (const [bs, cambio] of [["637", "11,37"], ["666", "11,89"], ["750", "13,4"], ["840", "15"]]) {
    assert.ok(listaPlano.includes(`**Bs ${bs}** a ${cambio}`), `la lista trae Bs ${bs} a ${cambio}`);
  }
  assert.ok(!/nada apaga solo/i.test(listaPlano) || /No lo apaga nadie solo/.test(listaPlano), "Bs 750 no es un corte automático");
});

test("LISTA PARA MOSTRAR: el go/no-go trae las 9 filas y las condiciones extra de la spec, cada una con su dueño", () => {
  for (let i = 1; i <= 9; i += 1) assert.match(lista, new RegExp(`^\\| ${i} \\|`, "m"), `falta la fila ${i} del go/no-go`);
  for (const id of ["instagram_decidido", "canales_1_y_2", "self_ai_decidido"]) {
    assert.ok(spec.no_se_crea_ni_se_enciende_sin.some((c) => c.id === id), `la spec define ${id}`);
  }
  assert.match(listaPlano, /Instagram vinculado/);
  assert.match(listaPlano, /Canales 1 y 2 contactados/);
  assert.match(listaPlano, /self_ai_disclosure/);
  assert.match(listaPlano, /has_payment_method: false/);
  assert.match(listaPlano, /NO-GO\. 0 de 9 filas en ✅/);
});

test("LISTA PARA MOSTRAR: el guion del selfie no promete lo que el catálogo prohíbe (minutos, «con IA», un toque, ejemplo, tratamiento a medias, SIAT)", () => {
  const guion = lista.match(/\*\*Guion[\s\S]*?\*\*No dice:\*\*/);
  assert.ok(guion, "el guion del selfie existe");
  const lineas = guion[0].split("\n").filter((l) => /^\s+\d\. \(\d+-\d+ s\)/.test(l));
  assert.equal(lineas.length, 4, "ancla: las cuatro frases del guion (la cabecera, que cita lo que se corrigió, no cuenta)");
  const dicho = lineas.flatMap((l) => [...l.matchAll(/«([^»]+)»/g)].map((m) => m[1])).join(" ");
  assert.ok(dicho.length > 150, "ancla: se leyeron las cuatro frases del guion");
  assert.ok(!/\d+\s*minutos/i.test(dicho), "L-04: la duración de la llamada no se promete");
  assert.ok(!/con IA|toque|ejemplo|a medias|SIAT|WhatsApp automático/i.test(dicho.replace("Escríbanos por WhatsApp", "")), "el selfie no promete G-03, L-05, D-03 ni el SIAT");
  assert.ok(!/\b(vos|tenés|querés|decime|escribime|confirmás)\b/i.test(dicho), "el selfie habla de usted");
  assert.match(dicho, /Nada sale sin su OK/);
});

test("LISTA PARA MOSTRAR: exige las mismas filas que la spec (las del texto del anuncio incluidas) y mide el día 7 como la spec", () => {
  const fila = spec.no_se_crea_ni_se_enciende_sin.find((c) => c.id === "filas_en_verde");
  assert.ok(fila.filas.length >= 10, "la spec exige las filas de lo que dice el texto, no solo las cinco de la primera versión");
  for (const f of fila.filas) assert.ok(lista.includes(f), `la lista nombra la fila ${f}`);
  for (const f of ["B-01", "C-02", "D-01", "E-01", "G-04"]) assert.ok(fila.filas.includes(f), `${f}: el texto dice agenda, ficha con odontograma, tratamientos, cobros y «cada mañana»`);
  const dia7 = spec.reglas_de_corte.dia_7;
  assert.ok(dia7.seguir_si.includes("al menos 1 calificada"));
  assert.match(listaPlano, /costo por conversación ≤ Bs 40 el día 7, con al menos 1 conversación de dueño de clínica/);
  assert.ok(!/costo por conversación de un dueño/.test(listaPlano), "el divisor son todas las conversaciones; lo de dueño es el mínimo de 1");
  assert.match(listaPlano, /No es una prueba A\/B/, "la lista dice que no es A/B");
  assert.ok(!/así la prueba mide el formato/.test(listaPlano), "con US$ 56 no se mide un formato");
});

// ── Lo que ve el lead después del clic (11-oct): prueba1-v2/BOT-RESPUESTAS-D7-D11.md ─────────────────────────────────
// El anuncio promete poco a propósito; si la respuesta del bot promete lo que el catálogo no deja, el lead lo lee en el primer mensaje.
const textoDe = (r) => r.replies.map((x) => String(x.text ?? x.body ?? "")).join("\n");
const turno = (estado, texto) => step(estado, { text: texto, receivedAt: new Date(T0).toISOString() }, { config: PRODUCCION });

test("lo que ve el lead tras D7, D8, D9, D10 y D11: M0_PERSONA y R_CAMPANA iguales, dice que es un bot y no promete lo prohibido", () => {
  const codigos = ["D7", "D8", "D9", "D10", "D11"];
  const respuestas = codigos.map((c) => turno(createState({ channel: "chatwoot", contactRef: `lead-${c}` }), `Hola, vi el anuncio de Onia (${c}). Tengo una clínica dental.`));
  for (const [i, r] of respuestas.entries()) {
    assert.deepEqual(r.replies.map((x) => x.templateKey), ["M0_PERSONA", "R_CAMPANA"], `${codigos[i]}: dos mensajes, la presentación y la respuesta de la campaña`);
    assert.equal(r.nextState.pieceKey, `anuncio-${codigos[i]}`, `${codigos[i]}: el lead nace con su origen`);
    assert.deepEqual(promesasEn(textoDe(r)), [], `${codigos[i]}: la respuesta del bot no promete nada que el catálogo prohíba`);
  }
  assert.match(textoDe(respuestas[0]), /Sí, un bot/, "D2: se declara bot");
  assert.equal(new Set(respuestas.map(textoDe)).size, 1, "el código solo etiqueta el origen: la respuesta es la misma para los cinco");
  assert.match(textoDe(respuestas[0]), /por acá no damos turnos/, "el paciente que escribe por error recibe la salida cortés");
});

test("el paciente que toca «Busco atención dental» sale con cortesía y sin turno, y el precio solo se dice si preguntan", () => {
  const abierto = turno(createState({ channel: "chatwoot", contactRef: "lead-paciente" }), "Hola, vi el anuncio de Onia (D10). Tengo una clínica dental.");
  const paciente = turno(abierto.nextState, "Busco atención dental");
  assert.deepEqual(paciente.replies.map((x) => x.templateKey), ["M1_PACIENTE"]);
  assert.match(textoDe(paciente), /por acá no le puedo dar un turno/);
  assert.deepEqual(promesasEn(textoDe(paciente)), []);
  assert.ok(!/Bs\s?\d/.test(textoDe(abierto)), "la primera respuesta no trae precios: el anuncio tampoco");
  const precio = turno(abierto.nextState, "¿Cuánto cuesta?");
  assert.match(textoDe(precio), /Bs 320/, "si preguntan, dice los planes públicos");
});

test("sales-kit/07: las respuestas de Sergio Urcullo a un lead de pauta son de usted, sin minutos ni «clínica de ejemplo», y no prometen lo prohibido", () => {
  const guia = leer("hermes-content/sales-kit/07-LEAD-DE-PAUTA-PRIMERAS-24H.md");
  const citas = guia.split("\n").filter((l) => l.startsWith("> Buenas tardes"));
  assert.equal(citas.length, 3, "las tres primeras respuestas (A, B y C) están como cita");
  const filasDeTabla = guia.split("\n").filter((l) => l.startsWith("| «")).flatMap((l) => [...l.matchAll(/\*«([^»]+)»\*/g)].map((m) => m[1]));
  assert.ok(filasDeTabla.length >= 5, "ancla: las respuestas a las preguntas frecuentes están en la tabla");
  for (const t of [...citas, ...filasDeTabla]) {
    assert.deepEqual(promesasEn(t), [], `promete algo prohibido: «${t.slice(0, 70)}…»`);
    assert.ok(!/\b(vos|tenés|querés|podés|tu |tus |contame|escribinos|sos|cobrás)\b/i.test(t), `voseo o tuteo en «${t.slice(0, 50)}…»`);
    assert.ok(!/\b\d+\s*minutos\b/i.test(t), `minutos de llamada sin decidir (L-04): «${t.slice(0, 50)}…»`);
    assert.ok(!/cl[ií]nica de ejemplo|tratamientos? a medias? (que|y) (recupera|encuentra)|con un toque/i.test(t), `promete lo que el catálogo no deja: «${t.slice(0, 50)}…»`);
  }
  assert.match(guia, /apaga el bot/, "la guía dice dónde se contesta para que el bot se calle");
  assert.match(leer("hermes-content/sales-kit/README.md"), /07-LEAD-DE-PAUTA-PRIMERAS-24H\.md/, "el README del kit lo lista");
});

// ── LISTA PARA MOSTRAR: respuestas del bot prueba 1 (frase por frase) ────────────────────────────────────────────────
// La tabla cita al bot palabra por palabra: si el bot cambia una frase y la tabla no, la lista se queda hablando de otra cosa.
const LISTA_BOT_RUTA = "hermes-content/carousels/briefs/ads/prueba1-v2/LISTA-PARA-MOSTRAR-RESPUESTAS-DEL-BOT.md";
const listaBot = leer(LISTA_BOT_RUTA);
const normaliza = (t) => t.replace(/[_*]/g, "").replace(/\s+/g, " ").trim();
const filasDeLaTabla = listaBot.split("\n").filter((l) => /^\| \d+ \| «/.test(l)).map((l) => l.split("|").map((c) => c.trim()).slice(1, -1));

test("LISTA DEL BOT: título, 21 frases y un conteo por estado que es el de la tabla", () => {
  assert.match(listaBot, /^# LISTA PARA MOSTRAR: respuestas del bot prueba 1$/m);
  assert.equal(filasDeLaTabla.length, 21, "21 frases");
  const cuenta = { "✅": 0, "🟡": 0, "⬜": 0, "❌": 0 };
  for (const f of filasDeLaTabla) { assert.ok(f[3] in cuenta, `estado desconocido «${f[3]}» en la fila ${f[0]}`); cuenta[f[3]] += 1; }
  assert.match(listaBot, new RegExp(`\\| \\*\\*${cuenta["✅"]}\\*\\* \\| \\*\\*${cuenta["🟡"]}\\*\\* \\| \\*\\*${cuenta["⬜"]}\\*\\* \\| \\*\\*${cuenta["❌"]}\\*\\* \\|`), "el conteo de arriba es el de la tabla");
  for (const f of filasDeLaTabla.filter((x) => x[3] === "❌")) assert.match(f[2], /J-0?\d|K-1\d/, `la fila ${f[0]} en ❌ nombra su fila de PROMESA`);
  for (const f of filasDeLaTabla.filter((x) => x[3] !== "✅" && /Quitar|Hasta leer|Sacar|Dejarla|«/.test(x[4]) === false)) assert.ok(f[4].length > 2, `la fila ${f[0]} no ✅ trae su corrección o dice que no hay de texto`);
});

test("LISTA DEL BOT: cada frase citada es la que el motor real del bot dice (ad, cuenta su clínica, paciente, Sergio, precio y SIAT)", () => {
  // Miércoles 11:00 en La Paz: FUERA del horario de oficina (arranca a las 14:00), así sale la coletilla M7 que la fila 8 cita.
  const fuera = (estado, texto) => step(estado, { text: texto, receivedAt: "2026-10-14T15:00:00Z" }, { config: PRODUCCION });
  const ad = fuera(createState({ channel: "chatwoot", contactRef: "lista-bot" }), "Hola, vi el anuncio de Onia (D9). Tengo una clínica dental.");
  const dichos = [textoDe(ad)];
  dichos.push(textoDe(fuera(ad.nextState, "Somos 3 odontólogos y la recepcionista agenda las citas")));
  dichos.push(textoDe(fuera(ad.nextState, "Busco atención dental")));
  dichos.push(textoDe(fuera(ad.nextState, "Hablar con Sergio")));
  dichos.push(textoDe(fuera(ad.nextState, "¿Cuánto cuesta?")));
  dichos.push(textoDe(fuera(ad.nextState, "¿Emite factura electrónica del SIAT?")));
  const todo = normaliza(dichos.join(" "));
  for (const f of filasDeLaTabla) {
    const frase = normaliza(f[1].replace(/^«|»$/g, ""));
    assert.ok(todo.includes(frase), `la fila ${f[0]} cita algo que el bot ya no dice: «${frase.slice(0, 80)}…»`);
  }
});

test("LISTA DEL BOT: los textos corregidos no prometen lo prohibido, ni el agente de WhatsApp, ni minutos, ni voseo", () => {
  const secciones = listaBot.split("## 3. Los textos corregidos")[1].split("## 4.")[0];
  const bloques = secciones.split("\n").filter((l) => l.startsWith(">")).map((l) => l.replace(/^>\s?/, "")).filter(Boolean);
  assert.ok(bloques.length >= 4, "ancla: los tres textos corregidos (el de precios en dos párrafos)");
  for (const t of bloques) {
    assert.deepEqual(promesasEn(t), [], `promete algo prohibido: «${t.slice(0, 70)}…»`);
    assert.ok(!/chatbot|agente de WhatsApp|Bs 390|\b\d+\s*minutos\b|SUS n[uú]meros|c[oó]mo quedar[ií]a en SU negocio|RND/i.test(t), `lo que la lista saca vuelve a aparecer: «${t.slice(0, 60)}…»`);
    assert.ok(!/\b(vos|tenés|querés|podés|tu |tus |contame|escribinos|sos)\b/i.test(t), `voseo o tuteo en «${t.slice(0, 50)}…»`);
  }
  assert.ok(bloques.some((t) => /Bs 320.*Bs 1\.290/.test(t)), "el texto de precios conserva los cuatro planes");
});
