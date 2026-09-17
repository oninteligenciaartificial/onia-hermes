// ---------------------------------------------------------------------------
// postdemo-avisa-por-el-canal-vivo.test.mjs
//
// QUE FIJA. El cierre post-demo le llega a Sergio Urcullo POR UN CANAL VIVO, y
// no consume el estado si no tiene por donde avisar.
//
// POR QUE EXISTE. Medido el 2026-09-17 en produccion: el cron de las :47 corre
// `postdemo-run.sh` cada hora y el log dice `CERRARIA (0)` — dry-run — desde
// siempre. La causa no era un olvido: `postdemo-run.mjs` decia (lineas 273-276)
// que gatear el CAS con `dryRun` "dejaria el cron encendido y MUDO", y tenia
// razon, porque su unica salida era una linea JSON "para n8n". Y n8n esta
// tapiado: medido en `/proc/<pid>/environ` del webhook vivo dentro de
// `onia-center`, `ONIA_N8N_ENABLED=false` y `ONIA_N8N_EVENT_URL` VACIO.
//
// O sea que la premisa de esa decision era correcta y la conclusion quedo vieja:
// el circuito de avisos GANO un canal vivo (`aviso-telegram.mjs`, con
// `ONIA_BOT_TG_AVISO=true`, token y chat en el mismo proceso) para el camino del
// webhook, y el barrido —la otra superficie del MISMO circuito— nunca lo
// adopto. Es la clase ya anotada en la memoria compartida, en su direccion mas
// cara: la superficie vieja se queda con el canal muerto y ningun gate lo ve,
// porque cada uno mira su propio modulo.
//
// LA GUARDA QUE IMPORTA. Cerrar la fila ES la reserva (CAS irreversible): si se
// cierra y el aviso no sale, la demo queda marcada como avisada y Sergio no se
// entera NUNCA. Por eso el canal se pregunta ANTES de tocar la base — preparar
// es preparar, y un barrido que no puede avisar no barre. El token no viaja solo:
// `docker exec` hereda el entorno del CONTENEDOR, y medido el mismo dia
// `onia-center` NO tiene `TG_BOT_TOKEN` (0 coincidencias); lo pasa el wrapper.
// ---------------------------------------------------------------------------

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { createBotConfig } from "./config.mjs";
import { ETIQUETAS } from "./aviso-telegram.mjs";
import { sinComentarios } from "./aviso-nombra-todo-lo-que-el-motor-emite.test.mjs";
import { DONE_STAGE, canalDeAviso, parseArgs, runPostDemoSweep } from "./postdemo-run.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const CONFIG = createBotConfig({});
const DEMO_AT = "2026-07-30T19:00:00Z";
const NOW = "2026-07-30T21:00:00Z";

function row(extra = {}) {
  return {
    conversation_key: "chatwoot:42",
    channel: "chatwoot",
    contact_ref: "42",
    display_name: "Ana",
    bot_stage: "demo_agendada",
    qualification: { industry: "comercio", teamSize: 5, city: "Santa Cruz" },
    scheduled_at: DEMO_AT,
    calendar_event_id: "uid-abc",
    human_took_over: false,
    opt_out_at: null,
    last_inbound_at: "2026-07-29T20:00:00Z",
    raw: { outboundSeq: 3, scheduledLabel: "jue 30/07 15:00" },
    ...extra,
  };
}

function memoryStore(rows, options = {}) {
  const calls = [];
  const stage = new Map((rows || []).map((item) => [item.conversation_key, item.bot_stage]));
  return {
    calls,
    stage,
    store: {
      enabled: true,
      warnings: [],
      async sweepDemosTerminadas(cutoff, limit) {
        calls.push(`sweep:${cutoff}:${limit}`);
        return (rows || []).map((item) => ({ ...item }));
      },
      async reserveDemoDone(key) {
        calls.push(`reserve:${key}`);
        if (options.reserveNull) return null;
        if (stage.get(key) !== "demo_agendada") return false;
        stage.set(key, DONE_STAGE);
        return true;
      },
    },
  };
}

/** Canal de mentira que anota lo que se le manda y contesta lo que le pidan. */
function canalEspia(resultado = { ok: true, status: "sent", reason: "aviso enviado" }) {
  const enviados = [];
  return {
    enviados,
    aviso: {
      listo: true,
      motivo: null,
      config: { enabled: true, token: "t", chatId: "c" },
      async enviar(aviso) {
        enviados.push(aviso);
        return resultado;
      },
    },
  };
}

// ---------------------------------------------------------------------------
// 1. El aviso SALE por el canal vivo
// ---------------------------------------------------------------------------

test("cerrar una demo MANDA el aviso, no solo lo devuelve en el JSON", async () => {
  const memory = memoryStore([row()]);
  const canal = canalEspia();

  const result = await runPostDemoSweep(
    { nowIso: NOW, emit: true },
    { config: CONFIG, store: memory.store, aviso: canal.aviso },
  );

  assert.equal(result.send.length, 1, "la demo se cerro");
  assert.equal(canal.enviados.length, 1, "el aviso NO salio: el cierre post-demo volvio a ser mudo");

  const texto = String(canal.enviados[0]?.texto ?? "");
  assert.match(texto, /chatwoot:42/, "el aviso no dice a quien hay que contestarle");
  assert.match(texto, /CERR[OÓ]|NO VINO|PROPUESTA/, "el aviso no trae las tres salidas que Sergio Urcullo contesta");
  assert.equal(result.send[0].deliveryStatus, "sent", "el resultado del envio no queda registrado");
});

test("si el aviso FALLA, el barrido lo dice con nombre propio y no lo tapa", async () => {
  const memory = memoryStore([row()]);
  const canal = canalEspia({ ok: false, status: "failed", reason: "Telegram 400: chat not found" });

  const result = await runPostDemoSweep(
    { nowIso: NOW, emit: true },
    { config: CONFIG, store: memory.store, aviso: canal.aviso },
  );

  assert.equal(result.send[0].deliveryStatus, "failed");
  assert.match(String(result.send[0].deliveryReason ?? ""), /chat not found/);
  assert.ok(
    result.warnings.some((w) => /aviso/i.test(String(w))),
    "un aviso perdido tiene que quedar a la vista en warnings: la fila ya se cerro y nadie mas va a avisar",
  );
});

// ---------------------------------------------------------------------------
// 2. La guarda: sin canal NO se consume el estado
// ---------------------------------------------------------------------------

test("sin canal de aviso el barrido NO cierra nada: no se quema la reserva", async () => {
  const memory = memoryStore([row()]);

  const result = await runPostDemoSweep(
    { nowIso: NOW, emit: true },
    {
      config: CONFIG,
      store: memory.store,
      aviso: { listo: false, motivo: "falta TG_BOT_TOKEN", async enviar() { throw new Error("no deberia"); } },
    },
  );

  assert.equal(result.ok, false, "un barrido que no puede avisar no puede decir que salio bien");
  assert.match(String(result.error ?? ""), /TG_BOT_TOKEN/, "el motivo tiene que nombrar lo que falta");
  assert.equal(memory.stage.get("chatwoot:42"), "demo_agendada", "la demo quedo cerrada sin que nadie avise");
  assert.ok(!memory.calls.some((c) => c.startsWith("reserve:")), "no se toca la base si no hay a quien avisarle");
});

test("el dry-run no necesita canal: mira sin tocar nada", async () => {
  const memory = memoryStore([row()]);

  const result = await runPostDemoSweep(
    { nowIso: NOW, emit: false },
    { config: CONFIG, store: memory.store, aviso: { listo: false, motivo: "apagado" } },
  );

  assert.equal(result.ok, true);
  assert.equal(result.send.length, 1, "el dry-run tiene que seguir mostrando lo que cerraria");
  assert.equal(memory.stage.get("chatwoot:42"), "demo_agendada");
});

// ---------------------------------------------------------------------------
// 3. El canal se deriva del entorno REAL, no de un booleano suelto
// ---------------------------------------------------------------------------

test("canalDeAviso exige las TRES cosas y nombra la que falta", () => {
  const completo = { ONIA_BOT_TG_AVISO: "true", TG_BOT_TOKEN: "t", TG_CHAT_ID: "c" };

  assert.equal(canalDeAviso(completo).listo, true);
  assert.equal(canalDeAviso({ ...completo, TG_BOT_TOKEN: "" }).listo, false);
  assert.match(canalDeAviso({ ...completo, TG_BOT_TOKEN: "" }).motivo, /TG_BOT_TOKEN/);
  assert.match(canalDeAviso({ ...completo, TG_CHAT_ID: "" }).motivo, /TG_CHAT_ID/);
  assert.match(canalDeAviso({ ...completo, ONIA_BOT_TG_AVISO: "false" }).motivo, /ONIA_BOT_TG_AVISO/);
});

// ---------------------------------------------------------------------------
// 4. El cron existente tiene que poder encenderlo: `--emit` no es el unico camino
// ---------------------------------------------------------------------------
// El wrapper ya le pasa `ONIA_BOT_DRY_RUN=false` (leido de webhook.env) con el
// comentario de que sin eso "el cierre post-demo quedaba registrado como
// 'skipped' para siempre" — pero el .mjs no lo miraba, asi que ese arreglo no
// arreglo nada y el cron lleva meses en dry-run. La precedencia es la de
// siempre: un flag explicito le gana al entorno.

test("--dry-run explicito le gana al entorno, y sin flag manda ONIA_BOT_DRY_RUN", () => {
  assert.equal(parseArgs([]).dryRunExplicito, false, "sin flag, el entorno decide");
  assert.equal(parseArgs(["--dry-run"]).dryRunExplicito, true);
  assert.equal(parseArgs(["--emit"]).emit, true);
});

// ---------------------------------------------------------------------------
// 5. La CLASE: todo emisor de avisos del disco tiene etiqueta, no solo el motor
// ---------------------------------------------------------------------------
// `aviso-nombra-todo-lo-que-el-motor-emite.test.mjs` deriva su universo de UN
// archivo (`bot-engine.mjs`), asi que el `kind` de un BARRIDO no es sujeto de
// nadie: `demo_realizada` existe desde que existe este barrido y nunca tuvo
// etiqueta. Aca el universo se camina de la CARPETA — no `git ls-files`, que no
// ve el archivo nuevo sin commitear, que es justo el sujeto que se quiere cazar.

/** Payloads de aviso a Sergio en cualquier archivo del bot: los del motor y los de los barridos. */
export function kindsQueAvisanASergio(codigo) {
  const limpio = sinComentarios(codigo);
  const marcas = [
    ...limpio.matchAll(/type:\s*["']notify_sergio["']/g),
    ...limpio.matchAll(/target:\s*["']sergio["']/g),
  ]
    .map((m) => m.index)
    .sort((a, b) => a - b);

  return marcas.map((inicio, n) => {
    // La ventana arranca en el PAYLOAD, no en la marca: en los barridos el `kind` esta ARRIBA
    // de `target`, y en el motor abajo de `type`. Se toma el objeto entero que las contiene.
    const desde = Math.max(0, inicio - 400);
    const hasta = n + 1 < marcas.length ? marcas[n + 1] : Math.min(limpio.length, inicio + 400);
    const ventana = limpio.slice(desde, hasta);
    const kinds = [...ventana.matchAll(/kind:\s*["']([A-Za-z0-9_]+)["']/g)].map((m) => m[1]);
    return { kind: kinds.length ? kinds[kinds.length - 1] : null, linea: limpio.slice(0, inicio).split("\n").length };
  });
}

const EMISORES = readdirSync(AQUI)
  .filter((n) => n.endsWith(".mjs") && !n.endsWith(".test.mjs"))
  .map((nombre) => ({ nombre, emisiones: kindsQueAvisanASergio(readFileSync(join(AQUI, nombre), "utf8")) }))
  .filter((archivo) => archivo.emisiones.length > 0);

test("el detector ve emisores de MAS DE UN archivo, incluido el barrido", () => {
  const nombres = EMISORES.map((e) => e.nombre);
  assert.ok(nombres.includes("bot-engine.mjs"), `el universo no vio al motor: ${nombres.join(", ")}`);
  assert.ok(
    nombres.includes("postdemo-run.mjs"),
    `el universo no vio al barrido post-demo: ${nombres.join(", ")} — el gate volveria a mirar un solo archivo`,
  );
  const kinds = EMISORES.flatMap((e) => e.emisiones.map((x) => x.kind));
  assert.ok(kinds.includes("demo_realizada"), `el detector no vio "demo_realizada": ${kinds.join(", ")}`);
});

// ---------------------------------------------------------------------------
// 6. El wrapper le pasa las credenciales al contenedor, o nada de esto llega
// ---------------------------------------------------------------------------
// `docker exec` hereda el entorno del CONTENEDOR: medido el 2026-09-17,
// `onia-center` no tiene `TG_BOT_TOKEN` ni `TG_CHAT_ID` (0 coincidencias). Sin
// los `-e`, `canalDeAviso()` dice "falta TG_BOT_TOKEN", la guarda corta y el
// barrido no cierra ni una demo — o sea que el circuito queda igual de mudo que
// antes, pero ahora con todos los tests en verde.

test("el wrapper le pasa las tres variables del aviso al docker exec", () => {
  const wrapper = readFileSync(join(AQUI, "postdemo-run.sh"), "utf8");
  const exec = wrapper.slice(wrapper.indexOf("docker exec \\"));

  for (const variable of ["ONIA_BOT_TG_AVISO", "TG_BOT_TOKEN", "TG_CHAT_ID"]) {
    assert.match(
      exec,
      new RegExp(`-e\\s+${variable}=`),
      `el docker exec no le pasa ${variable}: el barrido corre sin canal y no cierra ninguna demo`,
    );
  }
  assert.match(wrapper, /TG_ENV_FILE/, "las credenciales tienen que salir del archivo, no escritas a mano");
});

test("todo kind que le avisa a Sergio Urcullo tiene su linea en ETIQUETAS", () => {
  const huerfanos = EMISORES.flatMap((archivo) =>
    archivo.emisiones
      .filter((e) => e.kind && !ETIQUETAS[e.kind])
      .map((e) => `${e.kind} (${archivo.nombre}:${e.linea})`),
  );
  assert.deepEqual(
    huerfanos,
    [],
    "hay avisos cuyo encabezado sale con el slug interno en negrita en vez de decir que hay que hacer",
  );
});
