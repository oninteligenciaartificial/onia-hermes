// ONIA — Chatbot propio: pruebas del BANCO DE MEDICION (del instrumento, no del bot).
//   node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"
//
// Un banco que no se testea a si mismo es un numero que nadie puede defender. Aca se prueba:
//   1. que la ruta se LEE de lo que declara el motor (notes), no se re-deduce;
//   2. que los probes de "que dato esta preguntando" salen de config y no de strings copiados
//      — si el guion cambia de texto, estos tests caen antes que la medicion mienta;
//   3. que el juez no es mas permisivo que el bot (un valor distinto NO es un acierto);
//   4. que la clasificacion de fallos es la que dice la taxonomia;
//   5. que la medicion es determinista y que los casos estan bien formados.
//
// Los tests del JUEZ usan turnos sinteticos a proposito: si se probaran contra la salida real
// del bot, estarian afirmando lo que el bot hace HOY y se pondrian en rojo el dia que el bot
// se arregle. Los tests que SI tienen que tocar el motor real estan marcados abajo.

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { STAGES } from "./bot-engine.mjs";
import { createBotConfig } from "./config.mjs";
import { normalize } from "./guardrails.mjs";
import {
  ADVANCED_STAGES,
  ALL_STATUSES,
  BENCH_CONFIG,
  INTENT_HANDOFF_REASONS,
  PRIMARY_ROUTES,
  benchClock,
  evaluateCase,
  fieldsAsked,
  formatBenchReport,
  measuredSources,
  routeOf,
  runConversation,
  summarizeOutcomes,
  validateCases,
} from "./bench.mjs";
import { BENCH_CASES } from "./bench-cases.mjs";

// ---------------------------------------------------------------------------
// Utilidades: turnos sinteticos para probar al juez en aislamiento
// ---------------------------------------------------------------------------

function fakeTurn({ notes = [], replies = [], qualification = {}, botStage = "esperando_calificacion" }) {
  const result = { notes, replies, nextState: { botStage, qualification }, sideEffects: [] };
  return [{ incoming: {}, result, ...routeOf(result) }];
}

const CASO_BASE = {
  id: "sintetico",
  note: "caso de prueba del juez",
  tags: ["test"],
  turns: ["lo que sea"],
  said: {},
  expect: { route: "repregunta", stage: "esperando_calificacion" },
};

const statusOf = (bench, observed) => evaluateCase(bench, BENCH_CONFIG, observed).status;
const kindsOf = (bench, observed) => evaluateCase(bench, BENCH_CONFIG, observed).problems.map((p) => p.kind);

// ---------------------------------------------------------------------------
// 1. La ruta se lee de lo que el motor declara
// ---------------------------------------------------------------------------

test("routeOf lee la ruta de las notes del motor, no del texto de la respuesta", () => {
  assert.deepEqual(routeOf({ notes: ["pregunta_precio"] }), { route: "pregunta_precio", reason: null });
  assert.deepEqual(routeOf({ notes: ["handoff:queja_o_desconfianza"] }), {
    route: "handoff",
    reason: "queja_o_desconfianza",
  });
});

test("routeOf ignora las notas de adorno y se queda con la ruta principal", () => {
  // finalize() apendea 'fuera_de_horario' / 'llm_no_inyectado' DESPUES de la ruta: si el banco
  // leyera la ultima nota, un mensaje de domingo cambiaria de categoria por el horario.
  assert.equal(routeOf({ notes: ["off_guion:1", "llm_no_inyectado", "fuera_de_horario"] }).route, "off_guion");
});

test("routeOf no inventa una ruta cuando el motor no declaro ninguna conocida", () => {
  assert.equal(routeOf({ notes: ["algo_que_no_existe"] }).route, "sin_ruta");
});

// MOTOR REAL: la ruta que reporta el banco es la que el motor emitio para ese mensaje.
test("el banco corre el motor de produccion: la ruta sale de step(), no de una tabla del banco", () => {
  const observed = runConversation({ id: "t", turns: ["DEMO", "cuanto sale?"] }, BENCH_CONFIG);
  assert.equal(observed[1].route, "pregunta_precio");
  assert.equal(observed[1].result.replies.length > 0, true, "y devuelve las respuestas reales del guion");
});

// MOTOR REAL: si cambia la config, cambia la medicion (prueba de que no hay guion hardcodeado).
test("cambiar la config cambia lo que mide el banco (no hay guion copiado adentro)", () => {
  // Sobre BENCH_CONFIG a proposito: `createBotConfig` sin base parte de DEFAULT_CONFIG, que trae
  // los horarios PLACEHOLDER, y ahi el motor contesta M0_SIN_HORARIOS (correcto) en vez de M0.
  const otra = createBotConfig({ script: { ...BENCH_CONFIG.script, M0: "otro texto de bienvenida" } }, BENCH_CONFIG);
  const observed = runConversation({ id: "t", turns: ["hola"] }, otra);
  assert.match(observed[0].result.replies[0].text, /otro texto de bienvenida/);
});

// ---------------------------------------------------------------------------
// 2. Los probes salen de config (si el guion cambia, el instrumento cae, no miente)
// ---------------------------------------------------------------------------

// MOTOR REAL: el embudo cambio de ORDEN (los 3 datos se piden con la demo YA reservada, en M2),
// pero la garantia que este test protege es la misma de antes: el embudo pide los 3 datos, los
// pide TODOS JUNTOS en un solo mensaje, y el probe reconoce ese pedido en el texto real.
test("el embudo pregunta los 3 datos en M2: la suposicion del probe se verifica contra el motor", () => {
  // fieldsAsked da por hecho que el guion escribe el `missLabel` de cada campo con esas mismas
  // palabras. Si alguien edita el guion y saca una pregunta, este test cae ANTES de que el banco
  // empiece a contar re-preguntas que no existen.
  const observed = runConversation({ id: "t", turns: ["DEMO", "A"] }, BENCH_CONFIG);
  const reservado = observed[1].result.replies;
  assert.deepEqual(reservado.map((reply) => reply.templateKey), ["M2"], "reservar es lo que dispara las preguntas");

  const m2 = normalize(reservado[0].text);
  for (const field of BENCH_CONFIG.qualification.fields) {
    assert.ok(m2.includes(normalize(field.missLabel)), `M2 ya no pregunta ${field.key}`);
  }
  assert.deepEqual([...fieldsAsked(reservado, BENCH_CONFIG)].sort(), ["city", "industry", "teamSize"]);
  assert.match(m2, /a que se dedica/, "la pregunta 1 es el RUBRO: es lo que abre el bot a todos los negocios");
  assert.match(m2, /cuantas personas/, "la pregunta 2 es el TAMAÑO: el unico proxy que entiende cualquier rubro");

  // Y la bienvenida no cobra NI UNA: en el momento de maximo interes se ofrece la reunion, no un
  // formulario. Ese es todo el cambio de orden, medido.
  assert.deepEqual([...fieldsAsked(observed[0].result.replies, BENCH_CONFIG)], []);
});

test("el dato de rama NO se le pregunta a todos: la lista de M2 sigue siendo 3 preguntas", () => {
  // La cuarta pregunta (los sillones) es de rama. Si se colara en el pedido general, el bot
  // volveria a hablarle solo a clinicas dentales — que es lo que este bot vino a arreglar.
  const observed = runConversation({ id: "t", turns: ["DEMO", "A"] }, BENCH_CONFIG);
  assert.equal(BENCH_CONFIG.qualification.fields.length, 3);
  assert.ok(!normalize(observed[1].result.replies[0].text).includes("sillon"), "M2 no puede nombrar el dato de un rubro");
  assert.ok(!normalize(observed[0].result.replies[0].text).includes("sillon"), "y la bienvenida, menos todavia");
  assert.equal(BENCH_CONFIG.qualification.branches.dental.field.key, "chairs");
});

test("fieldsAsked deriva las etiquetas de config: con otros missLabel, sigue a la config", () => {
  const otra = createBotConfig({
    qualification: {
      ...BENCH_CONFIG.qualification,
      fields: [
        { key: "ownsClinic", missLabel: "si el consultorio es tuyo" },
        { key: "chairs", missLabel: "cuantas unidades tenes" },
        { key: "city", missLabel: "de que ciudad sos" },
      ],
    },
  });
  const reply = [{ templateKey: "M1a", text: "Me falta sólo cuántas unidades tenés — ¿me lo pasás?" }];
  assert.deepEqual([...fieldsAsked(reply, otra)], ["chairs"]);
  assert.deepEqual([...fieldsAsked(reply, BENCH_CONFIG)], [], "con la config real esa etiqueta no existe");
});

// MOTOR REAL: la etiqueta que el probe busca es la que el guion escribe de verdad.
test("fieldsAsked reconoce la re-pregunta real que sale del motor", () => {
  // Reserva primero (el orden nuevo) y contesta una sola de las 3 preguntas de M2.
  const observed = runConversation({ id: "t", turns: ["DEMO", "A", "tengo una ferreteria"] }, BENCH_CONFIG);
  const asked = fieldsAsked(observed[2].result.replies, BENCH_CONFIG);
  assert.equal(asked.has("city"), true, "el motor pidio la ciudad y el probe lo ve");
  assert.equal(asked.has("industry"), false, "y no cuenta como pedido lo que ya le dieron");
});

// ---------------------------------------------------------------------------
// 3. El juez no puede ser mas permisivo que el bot
// ---------------------------------------------------------------------------

test("un dato guardado con OTRO valor no es un acierto", () => {
  const bench = { ...CASO_BASE, said: { chairs: 2 }, expect: { route: "repregunta" } };
  const outcome = evaluateCase(bench, BENCH_CONFIG, fakeTurn({ notes: ["repregunta:1"], qualification: { chairs: 3 } }));
  assert.equal(outcome.status, "dato_mal_extraido");
  assert.match(outcome.problems[0].detail, /guardo 3, el prospecto dijo 2/);
});

test("un dato que el prospecto NUNCA dijo y quedo guardado es dato inventado", () => {
  const bench = { ...CASO_BASE, said: {}, expect: { route: "repregunta" } };
  const outcome = evaluateCase(bench, BENCH_CONFIG, fakeTurn({ notes: ["repregunta:1"], qualification: { city: "Reunion" } }));
  assert.equal(outcome.status, "dato_mal_extraido");
  assert.match(outcome.problems[0].detail, /nunca lo dijo/);
});

test("un dato que el prospecto dijo y no quedo guardado es dato perdido", () => {
  const bench = { ...CASO_BASE, said: { industry: "dental" }, expect: { route: "repregunta" } };
  const outcome = evaluateCase(bench, BENCH_CONFIG, fakeTurn({ notes: ["repregunta:1"], qualification: {} }));
  assert.match(outcome.problems[0].detail, /no quedo guardado/);
});

test("el dato de RAMA tambien se juzga: perder los sillones de una clinica es un dato perdido", () => {
  // Si el juez mirara solo los 3 universales, el dato de rama se podria perder o inventar sin
  // que la medicion se entere — y es el unico dato con el que Sergio prepara una demo dental.
  const bench = { ...CASO_BASE, said: { chairs: 3 }, expect: { route: "repregunta" } };
  const outcome = evaluateCase(bench, BENCH_CONFIG, fakeTurn({ notes: ["repregunta:1"], qualification: {} }));
  assert.equal(outcome.status, "dato_mal_extraido");
  assert.match(outcome.problems[0].detail, /chairs/);
});

// ---------------------------------------------------------------------------
// 4. La taxonomia de fallos clasifica lo que dice que clasifica
// ---------------------------------------------------------------------------

test("avanzar a ofrecer horarios con un dato inventado es la violacion de la regla de oro", () => {
  const bench = { ...CASO_BASE, said: { industry: "comercio", city: "La Paz" }, expect: { route: "calificado" } };
  const outcome = evaluateCase(
    bench,
    BENCH_CONFIG,
    fakeTurn({ notes: ["calificado"], botStage: "esperando_horario", qualification: { industry: "comercio", teamSize: 1, city: "La Paz" } }),
  );
  assert.equal(outcome.status, "avanzo_sin_dato");
});

test("no detectar la intencion que estaba es intent_missed", () => {
  const bench = { ...CASO_BASE, expect: { route: "pregunta_precio" } };
  assert.equal(statusOf(bench, fakeTurn({ notes: ["off_guion:1"] })), "intent_missed");
});

test("disparar una deteccion que no correspondia es intent_falso_positivo, aunque tambien se perdiera la intencion buena", () => {
  // "no me interesa el precio, quiero ver como funciona": el dano es el opt-out que no era.
  const bench = { ...CASO_BASE, expect: { route: "pregunta_precio" } };
  assert.equal(statusOf(bench, fakeTurn({ notes: ["opt_out"], botStage: "opt_out" })), "intent_falso_positivo");
});

test("derivar por una deteccion que no era (queja) se cuenta como falso positivo, no como handoff de mas", () => {
  const bench = { ...CASO_BASE, expect: { route: "off_guion" } };
  assert.equal(
    statusOf(bench, fakeTurn({ notes: ["handoff:queja_o_desconfianza"], botStage: "handoff_humano" })),
    "intent_falso_positivo",
  );
});

test("derivar por el flujo pudiendo seguir solo es handoff_de_mas (el fallo mas barato: 5 min de Sergio)", () => {
  const bench = { ...CASO_BASE, expect: { route: "cortesia_sin_respuesta" } };
  assert.equal(
    statusOf(bench, fakeTurn({ notes: ["handoff:mensaje_tras_agendar_sin_dolor"], botStage: "handoff_humano" })),
    "handoff_de_mas",
  );
});

test("seguir solo cuando debia derivar es handoff_de_menos", () => {
  const bench = { ...CASO_BASE, expect: { route: "handoff", reason: "detalle_tecnico_de_producto" } };
  assert.equal(statusOf(bench, fakeTurn({ notes: ["off_guion:1"] })), "handoff_de_menos");
});

test("hablarle a quien pidio la baja es hablo_sin_permiso", () => {
  const bench = { ...CASO_BASE, expect: { route: "silencio" } };
  assert.equal(
    statusOf(bench, fakeTurn({ notes: ["reabierto_por_demo"], replies: [{ templateKey: "M0", text: "hola" }] })),
    "hablo_sin_permiso",
  );
});

test("contestar cuando la respuesta correcta era el silencio tambien se marca", () => {
  // Un 'gracias' despues de agendar: la conversacion ya esta calificada y agendada, asi que el
  // unico fallo posible es haber abierto la boca.
  const calificado = { industry: "comercio", teamSize: 5, city: "Santa Cruz" };
  const bench = { ...CASO_BASE, said: calificado, expect: { route: "cortesia_sin_respuesta" } };
  const outcome = evaluateCase(
    bench,
    BENCH_CONFIG,
    fakeTurn({
      notes: ["cortesia_sin_respuesta"],
      replies: [{ templateKey: "M2b", text: "algo" }],
      botStage: "demo_agendada",
      qualification: calificado,
    }),
  );
  assert.equal(outcome.status, "hablo_sin_permiso");
});

test("re-preguntar un dato que el prospecto ya contesto se marca aunque la rama sea la correcta", () => {
  const bench = { ...CASO_BASE, said: { chairs: 2 }, expect: { route: "repregunta" } };
  const observed = fakeTurn({
    notes: ["repregunta:1"],
    qualification: { chairs: 2 },
    replies: [{ templateKey: "M1a", text: "Me falta sólo cuántos sillones tiene — ¿me lo pasa?" }],
  });
  assert.deepEqual(kindsOf(bench, observed), ["repregunta_lo_dicho"]);
});

test("el estado solo se juzga si la rama fue la correcta (no se cuenta dos veces la misma falla)", () => {
  const bench = { ...CASO_BASE, expect: { route: "demo_agendada", stage: "demo_agendada" } };
  const kinds = kindsOf(bench, fakeTurn({ notes: ["handoff:ningun_horario_le_sirve"], botStage: "handoff_humano" }));
  assert.deepEqual(kinds, ["handoff_de_mas"]);
});

test("replyMustNot atrapa el texto que el prospecto no puede llegar a leer", () => {
  const bench = { ...CASO_BASE, expect: { route: "repregunta", replyMustNot: [/Con 1 sill/i] } };
  const observed = fakeTurn({ notes: ["repregunta:1"], replies: [{ text: "Con 1 sillón en La Paz esto te sirve" }] });
  assert.equal(statusOf(bench, observed), "texto_incorrecto");
});

test("el caso correcto no acumula fallos", () => {
  const bench = { ...CASO_BASE, said: { chairs: 2 }, expect: { route: "repregunta", stage: "esperando_calificacion" } };
  const outcome = evaluateCase(bench, BENCH_CONFIG, fakeTurn({ notes: ["repregunta:1"], qualification: { chairs: 2 } }));
  assert.equal(outcome.status, "hit");
  assert.deepEqual(outcome.problems, []);
});

// ---------------------------------------------------------------------------
// 5. Determinismo, resumen y reporte
// ---------------------------------------------------------------------------

test("la medicion es determinista: el mismo caso medido dos veces da lo mismo", () => {
  const bench = BENCH_CASES.find((item) => item.id === "un-consultorio-no-es-un-sillon");
  assert.deepEqual(evaluateCase(bench, BENCH_CONFIG), evaluateCase(bench, BENCH_CONFIG));
});

test("el reloj se inyecta: los turnos salen de BENCH_T0, no de Date.now()", () => {
  assert.equal(benchClock(0), "2026-07-27T19:00:00.000Z");
  assert.equal(benchClock(2), "2026-07-27T19:04:00.000Z");
});

test("summarizeOutcomes cuenta sin maquillar y separa casos de problemas", () => {
  const outcomes = [
    { id: "a", status: "hit", tags: ["x"], problems: [] },
    {
      id: "b",
      status: "dato_mal_extraido",
      tags: ["x"],
      problems: [
        { kind: "dato_mal_extraido", subkind: "perdido", detail: "chairs: el prospecto lo dijo (2) y no quedo guardado" },
        { kind: "repregunta_lo_dicho", detail: "vuelve a pedir chairs" },
      ],
    },
  ];
  const summary = summarizeOutcomes(outcomes);
  assert.equal(summary.total, 2);
  assert.equal(summary.hits, 1);
  assert.equal(summary.hitRate, 0.5);
  assert.equal(summary.byStatus.dato_mal_extraido, 1);
  assert.equal(summary.byProblem.repregunta_lo_dicho, 1, "el problema se cuenta aunque no sea el mas grave");
  assert.equal(summary.datosPerdidos, 1);
  assert.deepEqual(summary.byTag.x, { total: 2, hits: 1 });
});

test("el reporte pone primero el fallo mas caro para el negocio", () => {
  const outcomes = [
    { id: "barato", status: "handoff_de_mas", tags: [], problems: [], note: "n", lastMessage: "m", expected: "-", actual: "-", qualification: {}, said: {} },
    { id: "caro", status: "avanzo_sin_dato", tags: [], problems: [], note: "n", lastMessage: "m", expected: "-", actual: "-", qualification: {}, said: {} },
  ];
  const report = formatBenchReport(summarizeOutcomes(outcomes), outcomes, 5);
  assert.ok(report.indexOf("avanzo_sin_dato] caro") < report.indexOf("handoff_de_mas] barato"));
});

// ---------------------------------------------------------------------------
// 6. Los casos del banco estan bien formados (si no, se mide el typo)
// ---------------------------------------------------------------------------

test("todos los casos del banco pasan la validacion estructural", () => {
  assert.deepEqual(validateCases(BENCH_CASES, BENCH_CONFIG), []);
});

test("validateCases rechaza rutas, campos e ids que no existen", () => {
  const errors = validateCases(
    [
      { id: "x", note: "n", tags: ["t"], turns: ["a"], expect: { route: "ruta_inventada" } },
      { id: "x", note: "n", tags: ["t"], turns: ["a"], said: { sillones: 2 }, expect: { route: "bienvenida", stage: "no_existe" } },
      { id: "y", note: "n", tags: ["t"], turns: [], expect: { route: "bienvenida" } },
    ],
    BENCH_CONFIG,
  );
  assert.equal(errors.some((error) => error.includes("ruta desconocida")), true);
  assert.equal(errors.some((error) => error.includes("id repetido")), true);
  assert.equal(errors.some((error) => error.includes("no es un campo de calificacion")), true);
  assert.equal(errors.some((error) => error.includes("estado desconocido")), true);
  assert.equal(errors.some((error) => error.includes("falta turns")), true);
});

test("el banco entero corre y cada caso cae en un estado conocido de la taxonomia", () => {
  const outcomes = BENCH_CASES.map((bench) => evaluateCase(bench, BENCH_CONFIG));
  assert.equal(outcomes.length >= 40, true, "un banco chico no mide nada");
  assert.equal(outcomes.length <= 70, true, "y uno inflado se deja de leer");
  for (const outcome of outcomes) assert.equal(ALL_STATUSES.includes(outcome.status), true, outcome.id);
});

test("las rutas y motivos que el banco clasifica siguen existiendo en el motor", () => {
  // PRIMARY_ROUTES / INTENT_HANDOFF_REASONS son los codigos que bot-engine.mjs escribe en
  // `notes`. Si alguien renombra un motivo, sin este test el banco no lo reconoceria y el
  // reporte diria "el bot empeoro" cuando el que quedo viejo es el juez.
  const engine = readFileSync(new URL("./bot-engine.mjs", import.meta.url), "utf8");
  for (const route of PRIMARY_ROUTES) {
    assert.equal(engine.includes(`"${route}`) || engine.includes(`\`${route}`), true, `el motor ya no emite la ruta ${route}`);
  }
  for (const reason of INTENT_HANDOFF_REASONS) {
    assert.equal(engine.includes(`"${reason}"`), true, `el motor ya no emite el motivo ${reason}`);
  }
  for (const stage of ADVANCED_STAGES) {
    assert.equal(STAGES.includes(stage), true, `${stage} no es un estado del motor`);
  }
});

test("callarse por el motivo equivocado NO se acusa como 'hablo sin permiso'", () => {
  // El bot no emitio una sola respuesta: el fallo es de rama, no de haber abierto la boca.
  const bench = { ...CASO_BASE, expect: { route: "silencio", reason: "opt_out" } };
  assert.equal(statusOf(bench, fakeTurn({ notes: ["silencio:handoff_en_curso"] })), "estado_incorrecto");
});

test("la huella del codigo medido se DERIVA de los imports (incluye lo que el banco no importa directo)", () => {
  const files = measuredSources();
  // intents.mjs no lo importa ningun archivo del banco: entra por bot-engine. Si la lista se
  // mantuviera a mano, un cambio de regex no cambiaria la huella y dos numeros medidos contra
  // codigo distinto pareceria comparables (es el error que ya se pago una vez en BE).
  assert.equal(files.includes("intents.mjs"), true);
  assert.equal(files.includes("guardrails.mjs"), true);
  assert.equal(files.includes("bot-engine.mjs"), true);
  assert.equal(files.includes("config.mjs"), true);
});
