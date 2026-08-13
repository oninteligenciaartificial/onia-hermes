// ONIA — Chatbot propio: pruebas del MEDIDOR de mensajes salientes.
//   node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"
//
// Lo que se cubre y por que (todo esto es PLATA: si se rompe, se factura mal):
//   1. CLASIFICACION: la categoria sale del registro de plantillas aprobadas, NO de "template_key
//      no es null". M0 / M1b / llm_freeform / null son SERVICIO; M3_PLANTILLA es MARKETING y
//      M9_PLANTILLA es UTILITY. Este es EL error caro: contar guiones como plantillas infla ~6x.
//   2. NO SE COBRA LO QUE NO SALIO: solo `sent`. `simulated`, `skipped` y `failed` no suman un
//      centavo — y los entrantes tampoco, aunque la base los guarde como `sent`.
//   2b. Y EL TOTAL SE PRESENTA COMO TECHO: `sent` se escribe al hacer el POST, pero Meta puede
//      rechazar despues por webhook asincrono (comprobado 2026-08-13: el mensaje 31 de Chatwoot
//      paso a `failed` 9 s mas tarde, error 131042) y esos no los cobra. La fila append-only nunca
//      se entera. Si alguien saca la etiqueta de "techo", estas pruebas fallan.
//   3. TARIFAS: marketing 0,0740 vs utility 0,0113 (6,5x). Servicio GRATIS hasta el 1-oct-2026 y
//      0,0113 desde esa fecha, decidido por la fecha de CADA mensaje.
//   4. NO SE INVENTA TARIFA: una `*_PLANTILLA` sin registrar cae en su propio balde con warning,
//      nunca como servicio.
//   5. Bs: 11,66 del BCB, con override por env.
//   6. Por cliente: hoy todo es `onia`; el agrupador ya separa por `raw.tenant` y por columna.
//   7. Paginado: se lee hasta la pagina VACIA (nunca contar de menos en silencio) y el corte por
//      techo se avisa.
//   8. Tolerancia: sin base, cero + nota. Determinismo: el mes/instante se inyecta.
//
// No hay red real en ninguna prueba: el store se inyecta.

import test from "node:test";
import assert from "node:assert/strict";

import {
  AVISO_HUECO,
  AVISO_TECHO,
  BASIS,
  BOB_POR_USD,
  CATEGORIAS,
  PLANTILLAS_META,
  SERVICIO_SE_COBRA_DESDE,
  TARIFAS_USD,
  bobPorUsd,
  clasificar,
  contarUso,
  costoUsd,
  esCobrable,
  mesDe,
  parseArgs,
  rangoDelMes,
  renderHuman,
  runUsageReport,
  tenantDe,
} from "./usage-run.mjs";

const OCT = "2026-10-15T12:00:00Z"; // servicio YA se cobra
const AGO = "2026-08-15T12:00:00Z"; // servicio todavia gratis

/** Fila de bot_messages tal como la devuelve el select del medidor. */
function row(extra = {}) {
  return {
    conversation_key: "chatwoot:42",
    template_key: "M0",
    delivery_status: "sent",
    created_at: OCT,
    raw: {},
    ...extra,
  };
}

function memoryStore(pages, options = {}) {
  const calls = [];
  const lotes = Array.isArray(pages[0]) ? pages : [pages];
  return {
    calls,
    store: {
      enabled: true,
      warnings: [],
      async listOutboundMessages(from, to, opts) {
        calls.push({ from, to, ...opts });
        if (options.nulo) return null;
        const lote = lotes[calls.length - 1];
        return (lote || []).map((item) => ({ ...item }));
      },
    },
  };
}

const reporte = (pages, options = {}) =>
  runUsageReport(
    { month: options.month || "2026-10", maxRows: options.maxRows },
    { store: options.store || memoryStore(pages, options).store, env: options.env || {} },
  );

// ---------------------------------------------------------------------------
// 1. Clasificacion — el corazon del medidor
// ---------------------------------------------------------------------------

test("las claves del GUION son servicio, no plantillas (template_key != null NO significa plantilla)", () => {
  // Claves reales vistas en la base del VPS el 2026-08-13.
  for (const key of ["M0", "M1b", "M0_DISCLOSURE", "M_AUDIO_FAIL", "llm_freeform", "safe_reply", "M9_RECORDATORIO"]) {
    assert.equal(clasificar({ template_key: key }).categoria, "servicio", `${key} tiene que ser servicio`);
  }
  assert.equal(clasificar({ template_key: null }).categoria, "servicio");
  assert.equal(clasificar({}).categoria, "servicio");
});

test("las DOS plantillas aprobadas caen en su categoria de Meta, con su nombre", () => {
  const marketing = clasificar({ template_key: "M3_PLANTILLA" });
  assert.deepEqual(marketing, { categoria: "marketing", templateKey: "M3_PLANTILLA", templateName: "seguimiento_demo" });

  const utility = clasificar({ template_key: "M9_PLANTILLA" });
  assert.deepEqual(utility, { categoria: "utility", templateKey: "M9_PLANTILLA", templateName: "recordatorio_demo" });
});

test("lo que manda un HUMANO trae el nombre de Meta, no la clave del guion: se resuelve al reves", () => {
  // El bot escribe `template_key: "M3_PLANTILLA"`. Un humano que manda la MISMA plantilla desde
  // Chatwoot no pasa por el guion: el webhook trae `seguimiento_demo` y el adapter lo guarda en
  // `raw.templateName`. Los dos caminos tienen que terminar en la misma categoria (y en el mismo
  // registro: duplicar la tabla de plantillas es como se desincronizan las tarifas).
  assert.deepEqual(clasificar({ template_key: null, raw: { templateName: "seguimiento_demo" } }), {
    categoria: "marketing",
    templateKey: "M3_PLANTILLA",
    templateName: "seguimiento_demo",
  });
  assert.deepEqual(clasificar({ template_key: null, raw: { templateName: "recordatorio_demo" } }), {
    categoria: "utility",
    templateKey: "M9_PLANTILLA",
    templateName: "recordatorio_demo",
  });
});

test("una plantilla mandada a mano que nadie registro cae en la alarma, NUNCA en servicio", () => {
  // Si cayera en `servicio` se cobraria 0,0113 una plantilla de marketing de 0,0740: 6,5x regalado,
  // y sin que nadie se entere. En el balde de alarma se ve y dispara el warning del reporte.
  const rara = clasificar({ template_key: null, raw: { templateName: "promo_navidad_2027" } });
  assert.equal(rara.categoria, "plantilla_sin_tarifa");
  assert.equal(rara.templateName, "promo_navidad_2027", "se dice cual es, para poder registrarla");
});

test("sin `raw.templateName` no cambia nada: el bot y sus guiones siguen siendo servicio", () => {
  for (const raw of [undefined, null, {}, { templateName: "" }, { templateName: "   " }, { tenant: "onia" }]) {
    assert.equal(clasificar({ template_key: "M0", raw }).categoria, "servicio", JSON.stringify(raw));
  }
});

test("el registro de plantillas es el mismo que usan followup-run y reminder-run", () => {
  // Si alguien agrega una plantilla en un barrido y se olvida del medidor, esto no lo caza — pero
  // si alguien CAMBIA la categoria de una existente (utility <-> marketing, 6,5x), si.
  assert.equal(PLANTILLAS_META.M3_PLANTILLA.categoria, "marketing");
  assert.equal(PLANTILLAS_META.M9_PLANTILLA.categoria, "utility");
  assert.equal(Object.keys(PLANTILLAS_META).length, 2, "hay exactamente 2 plantillas aprobadas hoy");
});

test("una *_PLANTILLA sin registrar NO se cuela como servicio: balde propio, tarifa 0 y warning", async () => {
  assert.equal(clasificar({ template_key: "M12_PLANTILLA" }).categoria, "plantilla_sin_tarifa");
  assert.equal(costoUsd("plantilla_sin_tarifa", OCT), null, "no se inventa una tarifa");

  const result = await reporte([row({ template_key: "M12_PLANTILLA" })]);
  assert.equal(result.totales.categorias.plantilla_sin_tarifa.count, 1);
  assert.equal(result.totales.categorias.servicio.count, 0, "no se cuenta como servicio");
  assert.equal(result.totales.usd, 0);
  assert.match(result.warnings.join(" "), /SIN tarifa registrada/);
});

test("la categoria authentication existe aunque hoy no se use", () => {
  assert.ok(CATEGORIAS.includes("authentication"));
  assert.equal(TARIFAS_USD.authentication, 0.0113);
});

// ---------------------------------------------------------------------------
// 2. Solo se cobra lo que salio
// ---------------------------------------------------------------------------

test("solo `sent` es cobrable: simulated / skipped / failed no cuestan un centavo", async () => {
  const result = await reporte([
    row({ delivery_status: "sent" }),
    row({ delivery_status: "simulated" }),
    row({ delivery_status: "skipped" }),
    row({ delivery_status: "failed" }),
  ]);

  assert.equal(result.totales.count, 1, "solo el enviado");
  assert.equal(result.totales.usd, 0.0113);
  assert.deepEqual(result.totales.noCobrables, { simulated: 1, skipped: 1, failed: 1 });
  assert.equal(esCobrable({ delivery_status: "sent" }), true);
  for (const estado of ["simulated", "skipped", "failed", "", null]) {
    assert.equal(esCobrable({ delivery_status: estado }), false, `${estado} no se cobra`);
  }
});

// El recordatorio (M9) escribe la fila ANTES de mandar: ahi la reserva ES el insert, y el estado
// honesto es `reserved`. Si esto vuelve a contar como no-cobrable, cada recordatorio utility real
// desaparece de la cuenta y el medidor reporta menos de lo que Meta cobra. Paso una vez: el valor
// ni siquiera llegaba a la base (`buildMessageRow` lo degradaba a `simulated` en silencio).
test("`reserved` SI se cuenta: es el recordatorio real, no una simulacion", async () => {
  assert.equal(esCobrable({ delivery_status: "reserved" }), true);

  const result = await reporte([
    row({ delivery_status: "reserved", template_key: "M9_PLANTILLA" }),
    row({ delivery_status: "sent", template_key: "M9_PLANTILLA" }),
  ]);

  assert.equal(result.totales.count, 2, "la reservada cuenta igual que la enviada");
  assert.equal(result.totales.noCobrables.simulated, 0, "no se cuela como simulacion");
});

test("un entrante NO se cobra aunque la base lo guarde como `sent` (claimInbound lo hace)", async () => {
  const result = await reporte([row({ direction: "inbound", delivery_status: "sent", template_key: null })]);
  assert.equal(result.totales.count, 0);
  assert.equal(result.totales.usd, 0);
});

test("el total se presenta como TECHO en las dos salidas: el rechazo asincrono de Meta no se ve", async () => {
  // Caso real del 2026-08-13: la fila dice `sent` porque el POST salio, pero Meta la rechazo 9 s
  // despues (131042) y no la cobro. Nuestra fila append-only nunca se entera => se cuenta igual, y
  // por eso el numero DEBE viajar etiquetado. Sacar la etiqueta rompe esta prueba.
  const result = await reporte([row()]);
  assert.equal(result.totales.count, 1, "se cuenta: con lo guardado hoy es indistinguible");
  assert.equal(result.basis, "techo_intentado", "el JSON dice que es un techo, no una factura");
  assert.equal(result.aviso, AVISO_TECHO);
  assert.equal(BASIS, "techo_intentado");
  assert.match(AVISO_TECHO, /131042/, "el aviso nombra el caso comprobado");
  assert.match(renderHuman(result), /TECHO, no factura/);
});

test("LA BANDEJA YA CUENTA: la plantilla que mando un humano se factura a su tarifa real", async () => {
  // Hasta el 2026-08-13 este envio se guardaba como placeholder ENTRANTE y no se contaba: el
  // medidor media al bot y no a la bandeja (mensajes 30 y 31 del VPS, las dos plantillas reales que
  // existieron). Ahora el traspaso se guarda saliente + `author: 'human'` y entra en la cuenta.
  const result = await reporte([
    row({ direction: "outbound", author: "human", template_key: null, raw: { templateName: "seguimiento_demo" } }),
  ]);

  assert.equal(result.totales.count, 1, "lo que manda Sergio a mano tambien se paga: tiene que contarse");
  assert.equal(result.totales.categorias.marketing.count, 1);
  assert.equal(result.totales.usd, 0.074, "a tarifa de MARKETING, no de servicio (6,5x)");
  assert.equal(result.totales.categorias.servicio.count, 0);
});

test("el hueco que QUEDA se sigue diciendo, no se disimula (las filas viejas y el agente sin configurar)", async () => {
  const result = await reporte([row({ direction: "inbound", delivery_status: "sent", template_key: null })]);
  assert.equal(result.totales.count, 0, "el placeholder entrante viejo sigue sin contarse: es historia, no se reescribe");
  assert.equal(result.avisoHueco, AVISO_HUECO);
  assert.match(AVISO_HUECO, /CHATWOOT_BOT_AGENT_ID/, "el aviso nombra el interruptor que apaga el registro");
  assert.match(renderHuman(result), /PISO/);
});

// Antes el ejemplo de "desconocido" era `reserved` — y era justamente el bug: un estado REAL del
// recordatorio tratado como basura. El caso sigue valiendo, con un valor que de verdad no existe.
test("un delivery_status desconocido no se cobra y queda a la vista en `failed`", async () => {
  const result = await reporte([row({ delivery_status: "en_cola_del_futuro" })]);
  assert.equal(result.totales.count, 0);
  assert.equal(result.totales.noCobrables.failed, 1);
});

// ---------------------------------------------------------------------------
// 3. Tarifas
// ---------------------------------------------------------------------------

test("marketing cuesta 6,5x utility — la diferencia que obliga a facturarlo aparte", async () => {
  const result = await reporte([
    row({ template_key: "M3_PLANTILLA" }),
    row({ template_key: "M9_PLANTILLA" }),
  ]);
  assert.equal(result.totales.categorias.marketing.usd, 0.074);
  assert.equal(result.totales.categorias.utility.usd, 0.0113);
  assert.equal(result.totales.usd, 0.0853);
  assert.ok(TARIFAS_USD.marketing / TARIFAS_USD.utility > 6, "marketing sigue siendo 6,5x");
});

test("el servicio es GRATIS antes del 1-oct-2026 y 0,0113 desde esa fecha", async () => {
  assert.equal(costoUsd("servicio", AGO), 0, "agosto: Meta todavia no lo cobra");
  assert.equal(costoUsd("servicio", OCT), 0.0113);
  // El borde exacto: el primer instante del 1-oct ya se cobra.
  assert.equal(costoUsd("servicio", SERVICIO_SE_COBRA_DESDE), 0.0113);
  assert.equal(costoUsd("servicio", "2026-09-30T23:59:59.999Z"), 0);

  const agosto = await reporte([row({ created_at: AGO })], { month: "2026-08" });
  assert.equal(agosto.totales.count, 1, "se CUENTA igual (sirve para dimensionar la bolsa)");
  assert.equal(agosto.totales.usd, 0, "pero no se le cobra al cliente lo que Meta no cobra");

  const octubre = await reporte([row({ created_at: OCT })]);
  assert.equal(octubre.totales.usd, 0.0113);
});

test("una plantilla se cobra siempre, tambien antes de octubre (nunca fue gratis)", () => {
  assert.equal(costoUsd("marketing", AGO), 0.074);
  assert.equal(costoUsd("utility", AGO), 0.0113);
});

// ---------------------------------------------------------------------------
// 4. Bolivianos
// ---------------------------------------------------------------------------

test("el costo en Bs usa 11,66 (BCB 13-ago-2026) y se puede pisar por env", async () => {
  assert.equal(BOB_POR_USD, 11.66);
  assert.equal(bobPorUsd({}), 11.66);
  assert.equal(bobPorUsd({ ONIA_BOB_PER_USD: "11.80" }), 11.8);
  assert.equal(bobPorUsd({ ONIA_BOB_PER_USD: "cero" }), 11.66, "basura => se cae al verificado");
  assert.equal(bobPorUsd({ ONIA_BOB_PER_USD: "-3" }), 11.66);

  const result = await reporte(Array.from({ length: 100 }, () => row({ template_key: "M3_PLANTILLA" })));
  assert.equal(result.totales.usd, 7.4);
  assert.equal(result.totales.bob, 86.28, "7,40 USD * 11,66");

  const conOverride = await reporte(Array.from({ length: 100 }, () => row({ template_key: "M3_PLANTILLA" })), {
    env: { ONIA_BOB_PER_USD: "11.80" },
  });
  assert.equal(conOverride.bobPorUsd, 11.8);
  assert.equal(conOverride.totales.bob, 87.32);
});

// ---------------------------------------------------------------------------
// 5. Por cliente (multi-tenant preparado, sin migracion)
// ---------------------------------------------------------------------------

test("hoy todo el consumo es del tenant `onia` (bot_messages no tiene columna de cliente)", async () => {
  const result = await reporte([row(), row({ raw: null })]);
  assert.equal(result.clientes.length, 1);
  assert.equal(result.clientes[0].tenant, "onia");
  assert.equal(result.clientes[0].count, 2);
});

test("el agrupador ya separa por cliente: `raw.tenant` hoy, columna `tenant` el dia que exista", async () => {
  const result = await reporte([
    row({ raw: { tenant: "clinica-x" }, template_key: "M3_PLANTILLA" }),
    row({ raw: { tenant: "clinica-x" } }),
    row({ tenant: "ferreteria-y" }),
    row(),
  ]);

  assert.deepEqual(result.clientes.map((c) => c.tenant), ["clinica-x", "ferreteria-y", "onia"]);
  const x = result.clientes.find((c) => c.tenant === "clinica-x");
  assert.equal(x.count, 2);
  assert.equal(x.categorias.marketing.count, 1);
  assert.equal(x.usd, 0.0853);
  assert.equal(result.totales.count, 4, "el total sigue siendo la suma de todos");
  assert.equal(tenantDe({ raw: { tenant: " clinica-x " } }), "clinica-x");
  assert.equal(tenantDe({ raw: { tenant: "" } }), "onia", "vacio => el de siempre");
});

// ---------------------------------------------------------------------------
// 6. Mes (UTC) y CLI
// ---------------------------------------------------------------------------

test("el mes se traduce a un rango UTC medio abierto [from, to)", () => {
  assert.deepEqual(rangoDelMes("2026-10"), {
    month: "2026-10",
    from: "2026-10-01T00:00:00.000Z",
    to: "2026-11-01T00:00:00.000Z",
  });
  // Diciembre rueda al enero siguiente: el bug clasico de facturar el ultimo mes del anio.
  assert.equal(rangoDelMes("2026-12").to, "2027-01-01T00:00:00.000Z");
  for (const malo of ["2026-13", "2026-00", "2026", "octubre", "", null]) {
    assert.equal(rangoDelMes(malo), null, `${malo} no es un mes`);
  }
  assert.equal(mesDe("2026-10-15T12:00:00Z"), "2026-10");
  assert.equal(mesDe("no-es-fecha"), null);
});

test("el rango que se le pide a la base es el del mes, no el de todos los tiempos", async () => {
  const fake = memoryStore([[row()], []]);
  await runUsageReport({ month: "2026-10" }, { store: fake.store, env: {} });
  assert.equal(fake.calls[0].from, "2026-10-01T00:00:00.000Z");
  assert.equal(fake.calls[0].to, "2026-11-01T00:00:00.000Z");
});

test("sin --month se usa el mes del --now inyectado (determinismo)", async () => {
  const fake = memoryStore([[row()], []]);
  const result = await runUsageReport({ nowIso: OCT }, { store: fake.store, env: {} });
  assert.equal(result.month, "2026-10");
});

test("un mes invalido no factura nada: ok=false y ni se toca la base", async () => {
  const fake = memoryStore([[row()]]);
  const result = await runUsageReport({ month: "2026-13" }, { store: fake.store, env: {} });
  assert.equal(result.ok, false);
  assert.match(result.error, /mes invalido/);
  assert.equal(fake.calls.length, 0);
});

test("parseArgs entiende las dos formas de cada bandera", () => {
  assert.deepEqual(parseArgs(["--month", "2026-10", "--json"]), { month: "2026-10", now: null, json: true });
  assert.deepEqual(parseArgs(["--month=2026-10"]), { month: "2026-10", now: null, json: false });
  assert.deepEqual(parseArgs(["--now=2026-10-15T12:00:00Z"]), { month: null, now: "2026-10-15T12:00:00Z", json: false });
  assert.deepEqual(parseArgs([]), { month: null, now: null, json: false });
});

// ---------------------------------------------------------------------------
// 7. Paginado y techo
// ---------------------------------------------------------------------------

test("se lee hasta la pagina VACIA: un lote recortado por la base no hace contar de menos", async () => {
  const fake = memoryStore([
    [row(), row()], // la base recorta el lote aunque se pidieron 1000
    [row()],
    [],
  ]);
  const result = await runUsageReport({ month: "2026-10" }, { store: fake.store, env: {} });
  assert.equal(result.scanned, 3, "las 3 filas, no las 2 del primer lote");
  assert.equal(result.totales.count, 3);
  assert.deepEqual(fake.calls.map((call) => call.offset), [0, 2, 3], "el offset avanza por lo que vino");
});

test("cortar por el techo se AVISA: el total pasa a ser un piso", async () => {
  const fake = memoryStore([[row(), row(), row()], []]);
  const result = await runUsageReport({ month: "2026-10", maxRows: 2 }, { store: fake.store, env: {} });
  assert.equal(result.truncated, true);
  assert.match(result.warnings.join(" "), /PISO/);
});

// ---------------------------------------------------------------------------
// 8. Tolerancia y salida
// ---------------------------------------------------------------------------

test("sin base: cero, nota y warning — nunca un cero silencioso", async () => {
  const fake = memoryStore([], { nulo: true });
  fake.store.warnings.push("listOutboundMessages: sin credenciales de Supabase (modo memoria)");
  const result = await runUsageReport({ month: "2026-10" }, { store: fake.store, env: {} });
  assert.equal(result.totales.count, 0);
  assert.ok(result.notes.includes("consulta_sin_resultado"));
  assert.match(result.warnings.join(" "), /sin credenciales/);
});

test("la salida legible dice el mes, el tipo de cambio y la plata de cada categoria", async () => {
  const result = await reporte([
    row({ template_key: "M3_PLANTILLA" }),
    row(),
    row({ delivery_status: "skipped" }),
  ]);
  const texto = renderHuman(result);
  assert.match(texto, /mes 2026-10/);
  assert.match(texto, /11\.66 Bs\/USD/);
  assert.match(texto, /CLIENTE onia/);
  assert.match(texto, /marketing\s+1\s+USD 0\.0740/);
  assert.match(texto, /servicio\s+1\s+USD 0\.0113/);
  assert.match(texto, /no se cobran: simulated 0 · skipped 1 · failed 0/);
});
