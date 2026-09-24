/**
 * EL AVISO DEL LEAD FRIO TIENE QUE LLEGAR DE VERDAD — dos agujeros que lo dejaban mudo.
 *
 * CONTEXTO. El 2026-09-24 se escribio el aviso de la colgada (`followup-run.mjs`,
 * `avisarColgadas`) y quedo verde: `colgada-avisa-una-sola-vez.test.mjs` prueba el contenido, el
 * "una sola vez" y el reintento cuando Telegram se cae. Ese mismo dia entro al pedido de deploy
 * `t_0836a42f` como su punto 3 — *"cuando un lead real se enfria, te LLEGA el aviso"*. Auditando
 * ese punto contra el camino VIVO aparecieron dos defectos que ningun test miraba, y que juntos
 * hacian que la promesa fuera falsa el dia despues de publicarla.
 *
 * ---------------------------------------------------------------------------
 * 1. EL LANZADOR NO PASABA LAS VARIABLES DEL AVISO. `followup-run.sh` no corre con el entorno
 *    del shell: arranca `docker exec` con una LISTA BLANCA de `-e VAR=...`, y la suya tenia seis
 *    entradas — ninguna de Telegram. El hermano que emite el MISMO aviso (`postdemo-run.sh`) si
 *    las pasa, y `webhook-server.sh` tambien: el emisor nuevo nacio en el unico lanzador que se
 *    quedo afuera. Es la misma clase de agujero que `lanzador-pasa-env.test.mjs` tapo el
 *    2026-09-04 para el webhook — y esa leccion no viajo al barrido porque su gate mira UN
 *    archivo por nombre.
 *
 *    POR QUE LOS SUJETOS SE DERIVAN DEL DISCO. Una lista escrita a mano falla ABIERTO: el barrido
 *    que manana importe `aviso-telegram.mjs` no esta en ella y nada se pone rojo. Aca los sujetos
 *    salen de quien IMPORTA el modulo del aviso, y las variables salen del propio
 *    `aviso-telegram.mjs`, asi que una credencial nueva nace cubierta.
 *
 * 2. "APAGADO" SE CONTABA COMO "ENTREGADO", y eso volvia PERMANENTE al defecto 1.
 *    `enviarAvisoTelegram` no tira cuando el canal esta apagado o sin credencial: DEVUELVE
 *    `{ok:false|true, status:"skipped"|"failed"}`. `avisarColgadas` solo miraba el `throw`, asi
 *    que se quedaba con la marca en disco y anotaba el lead en `avisados`. Resultado: el barrido
 *    marcaba "ya avise" por un aviso que nunca salio, y como las marcas de colgada NO se purgan
 *    —a proposito: el silencio del lead no vence— ese lead quedaba silenciado PARA SIEMPRE,
 *    incluso despues de arreglar el entorno. El fixture que lo tapaba devolvia siempre
 *    `status:"sent"`: un canal de mentira que solo sabe salir bien no puede ver esta rama.
 *
 * Correr:  node --test "hermes-content/deploy/vps-ops/bot/aviso-de-colgada-llega-al-proceso.test.mjs"
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { runFollowUpSweep } from "./followup-run.mjs";
import { crearMarcasEnDisco } from "./marcas-en-disco.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const leer = (nombre) => readFileSync(join(AQUI, nombre), "utf8");

// ---------------------------------------------------------------------------
// 1. El lanzador le pasa al proceso lo que el aviso necesita para existir
// ---------------------------------------------------------------------------

/**
 * Las variables que `getAvisoTelegramConfig` lee, derivadas de su cuerpo.
 *
 * Los alias (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) existen para que encender el aviso no
 * obligue a renombrar el token en los archivos que ya lo tienen: basta con que el lanzador pase
 * UNO de cada par, por eso el requisito se expresa por GRUPO y no variable por variable.
 */
export const GRUPOS_DEL_AVISO = Object.freeze([
  Object.freeze(["ONIA_BOT_TG_AVISO"]),
  Object.freeze(["TG_BOT_TOKEN", "TELEGRAM_BOT_TOKEN"]),
  Object.freeze(["TG_CHAT_ID", "TELEGRAM_CHAT_ID"]),
]);

/** Los `.mjs` de este directorio que IMPORTAN el modulo del aviso (sin contar los tests). */
function emisoresDeAviso() {
  return readdirSync(AQUI)
    .filter((f) => f.endsWith(".mjs") && !f.endsWith(".test.mjs"))
    .filter((f) => /from\s+["']\.\/aviso-telegram\.mjs["']/.test(leer(f)));
}

test("toda variable del aviso que el modulo lee esta declarada en este gate", () => {
  // Si manana el aviso pide una credencial nueva, este assert nombra al gate antes de que el
  // silencio lo haga. Sin el, la lista de grupos envejece y el test pasa midiendo de menos.
  const fuente = leer("aviso-telegram.mjs");
  const declaradas = new Set(GRUPOS_DEL_AVISO.flat());
  const leidas = new Set(
    [...fuente.matchAll(/env\.([A-Z][A-Z0-9_]+)/g)].map((m) => m[1]),
  );
  for (const nombre of leidas) {
    assert.ok(
      declaradas.has(nombre),
      `aviso-telegram.mjs lee ${nombre} y GRUPOS_DEL_AVISO no lo nombra: el gate quedo corto`,
    );
  }
  assert.ok(leidas.size > 0, "no se pudo derivar ninguna variable: el regex quedo viejo");
});

test("el lanzador de cada barrido que avisa le pasa las credenciales al contenedor", () => {
  const emisores = emisoresDeAviso();
  // Falla ABIERTO si el regex de arriba deja de matchear, asi que se ancla el piso conocido:
  // followup-run.mjs, postdemo-run.mjs y webhook-server.mjs importan el aviso hoy.
  assert.ok(emisores.length >= 3, `se esperaban >=3 emisores de aviso, se derivaron ${emisores.length}`);

  const sinLanzador = [];
  for (const emisor of emisores) {
    const lanzador = emisor.replace(/\.mjs$/, ".sh");
    if (!existsSync(join(AQUI, lanzador))) {
      // Un emisor sin `.sh` propio lo arranca otro (hoy: ninguno). Se nombra en vez de saltarse
      // en silencio: un sujeto que desaparece de la cuenta es como este bug llego a produccion.
      sinLanzador.push(emisor);
      continue;
    }
    const fuente = leer(lanzador);
    for (const grupo of GRUPOS_DEL_AVISO) {
      const pasada = grupo.find((v) => new RegExp(`-e\\s+${v}=`).test(fuente));
      assert.ok(
        pasada,
        `${lanzador} arranca ${emisor} con docker exec y NO le pasa ninguna de ${grupo.join("/")}: ` +
          "el aviso sale 'apagado' o 'falta credencial' y el lead se pierde en silencio",
      );
    }
  }
  assert.deepEqual(sinLanzador, [], "un emisor sin lanzador propio hay que cablearlo a mano");
});

// ---------------------------------------------------------------------------
// 2. Un aviso que NO se entrego no puede quedar marcado como entregado
// ---------------------------------------------------------------------------

const AHORA = "2026-09-24T14:00:00Z";
const dirDeMarcas = () => mkdtempSync(join(tmpdir(), "colgadas-entrega-"));

/** Misma fila que usa `colgada-avisa-una-sola-vez.test.mjs`: un desconocido de WhatsApp. */
function fila({ key, nombre, tel = null, dias, inbox = 5 }) {
  const inbound = new Date(Date.parse(AHORA) - dias * 86400000).toISOString();
  return {
    conversation_key: key,
    display_name: nombre,
    public_contact: tel,
    bot_stage: "esperando_horario",
    followup_step: 1,
    human_took_over: false,
    opt_out_at: null,
    last_inbound_at: inbound,
    last_outbound_at: inbound,
    raw: { inboxId: inbox, publicContact: tel },
  };
}

function store(vencidas = []) {
  return {
    enabled: true,
    warnings: [],
    async sweepFollowUpCandidates() {
      return [];
    },
    async sweepFollowUpVencidas() {
      return vencidas.map((r) => ({ ...r }));
    },
    async reserveFollowUp() {
      return true;
    },
    async insertOutbound(m) {
      return m.length;
    },
    async saveConversation() {
      return true;
    },
  };
}

/**
 * Canal que contesta como el REAL: con un veredicto, no con una excepcion.
 * `status` sale de `enviarAvisoTelegram`: "sent" | "skipped" | "failed".
 */
function canalQueContesta(status, reason) {
  const intentos = [];
  return {
    intentos,
    enviar: async (aviso) => {
      intentos.push(aviso);
      return { ok: status === "sent" || status === "skipped", status, reason };
    },
  };
}

const LEAD = fila({ key: "chatwoot:58", nombre: "+59175755019", tel: "+59175755019", dias: 7 });

for (const [status, reason] of [
  ["skipped", "aviso por Telegram apagado (ONIA_BOT_TG_AVISO)"],
  ["failed", "falta TG_BOT_TOKEN"],
]) {
  test(`aviso '${status}' NO cuenta como entregado: ni marca, ni avisados, y se grita`, async () => {
    const dir = dirDeMarcas();
    const canal = canalQueContesta(status, reason);
    const resultado = await runFollowUpSweep(
      { nowIso: AHORA, emit: true },
      { store: store([LEAD]), aviso: canal, marcas: crearMarcasEnDisco({ dir }) },
    );

    assert.equal(canal.intentos.length, 1, "el barrido tiene que haber intentado avisar");
    assert.equal(
      readdirSync(dir).length,
      0,
      "una marca puesta por un aviso que no salio silencia al lead PARA SIEMPRE: " +
        "las marcas de colgada no se purgan a proposito",
    );
    assert.deepEqual(
      resultado.colgadas.avisados,
      [],
      "anotarlo en `avisados` es reportar como hecho algo que el cliente nunca recibio",
    );
    assert.ok(
      resultado.warnings.some((w) => w.includes("chatwoot:58") && /avis/i.test(w)),
      "perder un lead EN SILENCIO es el bug original: el motivo tiene que salir en warnings",
    );
  });
}

test("con el canal sano el lead si queda marcado y anotado (la rama buena no se rompio)", async () => {
  const dir = dirDeMarcas();
  const canal = canalQueContesta("sent", "");
  const resultado = await runFollowUpSweep(
    { nowIso: AHORA, emit: true },
    { store: store([LEAD]), aviso: canal, marcas: crearMarcasEnDisco({ dir }) },
  );

  assert.deepEqual(resultado.colgadas.avisados, ["chatwoot:58"]);
  assert.equal(readdirSync(dir).length, 1, "un aviso ENTREGADO si tiene que recordarse");
});
