/**
 * El bot tiene que postear con SU PROPIA identidad de Chatwoot, tambien desde los barridos.
 *
 * EL BUG QUE CIERRA (medido en produccion el 2026-09-18, sobre el UNICO desconocido real en
 * curso). Los cuatro wrappers de barrido resolvian el agente asi:
 *
 *     CW_AGENT_ID="${CHATWOOT_BOT_AGENT_ID:-2}"
 *
 * y el cron los invoca PELADOS, asi que caian al 2. El 2 no es un default neutro: es `OnIA`
 * (oninteligenciaartificial@gmail.com), la cuenta HUMANA de Sergio Urcullo. El webhook, en
 * cambio, carga `webhook.env` entero (`set -a; . "$ENV_FILE"`) y corre con el 3, que es el
 * agente `Onia Bot` — verificado en el proceso vivo:
 *
 *     docker exec onia-center tr '\0' '\n' < /proc/<pid>/environ | grep CHATWOOT_BOT_AGENT_ID
 *       -> CHATWOOT_BOT_AGENT_ID=3
 *
 * Con los dos lados en desacuerdo, el follow-up se marca a si mismo como humano: el adapter
 * (`chatwoot-adapter.mjs:275`) exime UNICAMENTE al `botAgentId` que el conoce, asi que un
 * saliente del usuario 2 le llega como "lo escribio un humano" y prende `human_takeover`.
 * Lo que se midio en Chatwoot, conversacion 58 (inbox 5, WhatsApp, desconocido real):
 *
 *     msg 1321  09-17 22:50:55  outgoing  User 3   <- el M0 del webhook, bien
 *     msg 1437  09-18 19:17:02  outgoing  User 2   <- el M3 del barrido, como si fuera humano
 *     onia_center.bot_conversations chatwoot:58 -> human_took_over = t  (mismo minuto)
 *
 * El dano no es cosmetico y es PERMANENTE para ese prospecto: `bot-engine.mjs:553` corta con
 * `silencio:humano_a_cargo`, o sea que si esa persona contesta el bot NO le dice NADA, y los
 * cuatro barridos la saltean con `humano_a_cargo` (`followup-run.mjs:145`). El bot se callo
 * solo contra un lead real, escribiendole. Nunca habia pasado porque hasta el 2026-09-17 los
 * barridos estaban en dry-run (02505ade): encender un circuito destapo el desacuerdo.
 *
 * ES LA MISMA CLASE que `ONIA_BOT_DRY_RUN` (2026-09-17) y `ONIA_BOT_SLOTS` (2026-09-18), en
 * los MISMOS archivos: una variable que el wrapper toma del entorno del que llama, con el cron
 * llamando pelado. La cura se escribio dos veces y no viajo a esta tercera hermana — y aca el
 * comentario que la acompaniaba la declaraba inofensiva ("nunca queda sin token"), que era
 * cierto y ademas el problema: el token que conseguia era el de una persona.
 *
 * POR QUE SE EJECUTA Y NO SE LEE: un gate que exija que el archivo NOMBRE a `webhook.env` pasa
 * verde ante cualquier esquive (leerla y no usarla, leerla DESPUES del `docker exec`). Aca cada
 * wrapper se corre de verdad contra un `docker` FALSO que graba sus argumentos, con el entorno
 * limpio. El universo sale del DISCO (readdirSync, no `git ls-files`: el wrapper nuevo sin
 * commitear es justo el sujeto que se quiere cazar).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { cargaElEnvEntero, loQueRecibioDocker } from "./slots-viajan-al-barrido.test.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));

/** El agente del bot en produccion. El 2 es la cuenta humana; el 3 es `Onia Bot`. */
const AGENTE_BOT = "3";
const ENV_CON_AGENTE = `ONIA_BOT_DRY_RUN=true\nCHATWOOT_BOT_AGENT_ID=${AGENTE_BOT}\n`;

/** Universo del disco: todo `.sh` de esta carpeta que le pase la identidad al contenedor. */
export function wrappersQuePasanIdentidad(dir = AQUI) {
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith(".sh"))
    .map((d) => d.name)
    .filter((name) => /-e\s+CHATWOOT_BOT_AGENT_ID=/.test(readFileSync(join(dir, name), "utf8")))
    .sort();
}

test("el universo sale del disco e incluye los barridos que el cron invoca pelados", () => {
  const universo = wrappersQuePasanIdentidad();
  // Caso ancla: los sujetos YA CONOCIDOS tienen que estar. Sin esto, un filtro que se estrecha
  // solo (un regex que deja de matchear) vacia el universo y el gate firma verde sin sujetos.
  for (const conocido of ["followup-run.sh", "reminder-run.sh", "insistencia-run.sh", "chatwoot-adapter.sh"]) {
    assert.ok(universo.includes(conocido), `${conocido} tiene que estar en el universo`);
  }
});

test("la identidad del bot llega al contenedor aunque el que llama no la exporte", () => {
  for (const wrapper of wrappersQuePasanIdentidad()) {
    const texto = readFileSync(join(AQUI, wrapper), "utf8");
    if (cargaElEnvEntero(texto)) continue; // (a): ya carga el archivo entero, como el webhook

    const recibido = loQueRecibioDocker(wrapper, { envFile: ENV_CON_AGENTE });
    assert.ok(
      recibido.includes(`CHATWOOT_BOT_AGENT_ID=${AGENTE_BOT}`),
      `${wrapper}: el cron lo llama pelado y la identidad que llego al contenedor NO es la del bot.\n` +
        `Tiene que derivarla de webhook.env, igual que ONIA_BOT_DRY_RUN unas lineas mas arriba.\n` +
        `docker recibio:\n${recibido.slice(0, 900) || "(nada)"}`,
    );
    assert.ok(
      !/CHATWOOT_BOT_AGENT_ID=2(\s|$)/m.test(recibido),
      `${wrapper}: quedo posteando como el usuario 2, que es la cuenta HUMANA de Sergio Urcullo.\n` +
        `Eso prende human_takeover en el adapter y silencia al bot para ese prospecto para siempre.`,
    );
  }
});

test("el que llama sigue mandando: una identidad explicita le gana al archivo", () => {
  // La direccion simetrica. Sin esto la cura pisaria lo que el llamador eligio a proposito
  // (es como se prueba contra otra cuenta de Chatwoot sin tocar produccion).
  const mia = "77";
  const recibido = loQueRecibioDocker("followup-run.sh", {
    env: { CHATWOOT_BOT_AGENT_ID: mia },
    envFile: ENV_CON_AGENTE,
  });
  assert.ok(recibido.includes(`CHATWOOT_BOT_AGENT_ID=${mia}`), "la identidad explicita del llamador tiene que ganar");
});

test("sin webhook.env no se inventa una identidad: falla CERRADO", () => {
  // La mitad que mas importa, y la que el codigo viejo hacia al reves. Si no hay de donde
  // sacar quien es el bot, el barrido NO puede elegir a una persona: sin identidad no consigue
  // token y no manda, que es el fallo barato. Mandar como humano es el caro, y es irreversible
  // para ese prospecto (lo silencia). "Nunca queda sin token" era justamente el defecto.
  for (const wrapper of wrappersQuePasanIdentidad()) {
    const texto = readFileSync(join(AQUI, wrapper), "utf8");
    if (cargaElEnvEntero(texto)) continue;

    const recibido = loQueRecibioDocker(wrapper, { conEnvFile: false });
    assert.ok(
      !/CHATWOOT_BOT_AGENT_ID=\d/.test(recibido),
      `${wrapper}: sin webhook.env se invento una identidad de Chatwoot en vez de abstenerse.\n` +
        `docker recibio:\n${recibido.slice(0, 900) || "(nada)"}`,
    );
  }
});
