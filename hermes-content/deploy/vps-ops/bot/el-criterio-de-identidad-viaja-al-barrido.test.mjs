/**
 * Todo barrido que pregunte "¿esta conversacion somos NOSOTROS?" tiene que recibir el INSUMO
 * con el que ese criterio contesta. Si no, contesta igual — peor y en silencio.
 *
 * EL BUG QUE CIERRA (medido en produccion el 2026-09-19). El criterio unico del repo
 * (`es-nuestra.mjs`) dejo de decidir por la FIRMA del contacto y paso a derivar los inboxes de
 * prueba del NOMBRE que Chatwoot publica (d35bf465, 19-sep 00:50), porque el banco de pruebas
 * llega con nombres anonimos (`purple-bush-931`) y 5 de 6 filas del inbox 7 daban "no somos
 * nosotros". Esa consulta necesita `CHATWOOT_API_TOKEN`. De los CUATRO barridos que importan el
 * criterio, TRES ya lo pasaban —lo necesitaban para postear— y `postdemo-run.sh` NO, porque
 * avisa por Telegram y nunca habia tenido motivo para hablar con Chatwoot:
 *
 *     followup-run.sh    -e CHATWOOT_ACCOUNT_ID -e CHATWOOT_API_TOKEN -e CHATWOOT_BASE_URL  ...
 *     reminder-run.sh    -e CHATWOOT_ACCOUNT_ID -e CHATWOOT_API_TOKEN -e CHATWOOT_BASE_URL  ...
 *     insistencia-run.sh -e CHATWOOT_ACCOUNT_ID -e CHATWOOT_API_TOKEN -e CHATWOOT_BASE_URL  ...
 *     postdemo-run.sh    -e ONIA_BOT_DRY_RUN -e ONIA_BOT_TG_AVISO -e TG_BOT_TOKEN -e TG_CHAT_ID
 *
 * Lo que se vio en el log vivo, 3 de 3 corridas desde que el codigo aterrizo (07:47, 08:47 y
 * 09:47 UTC; las 7 anteriores del dia no lo tenian porque corrian el codigo viejo):
 *
 *     /var/log/onia-bot-postdemo.log
 *     {"ok":true,...,"warnings":["inboxes de prueba: no pude preguntarle a Chatwoot (sin CHATWOOT_API_TOKEN)"]}
 *
 * No es un parpadeo de red: es el estado PERMANENTE de ese barrido. Y `cargarInboxesDePrueba`
 * falla ABIERTO a proposito —deja el conjunto vacio, porque para un barrido que le escribe al
 * prospecto el error caro es saltear a un desconocido—, asi que postdemo vuelve exactamente al
 * criterio viejo: el banco de pruebas pasa como prospecto y recibe el cierre post-demo. Hoy no
 * muerde (`scanned:0`), pero el tri-estado quedo contestando SIEMPRE lo mismo, que es un valor
 * fijo con cara de medicion.
 *
 * POR QUE ESTE GATE Y NO UN CUARTO HERMANO. Ya hay dos de esta familia —
 * `slots-viajan-al-barrido` (ONIA_BOT_SLOTS) e `identidad-del-bot-viaja-al-barrido`
 * (CHATWOOT_BOT_AGENT_ID)— y ninguno lo cazo, por DOS razones que se repiten:
 *
 *   1. cada uno nombra SU variable, tipeada a mano. La quinta variable necesita un quinto gate.
 *      Aca el insumo se DERIVA de lo que `es-nuestra.mjs` lee, agrupando las alternativas
 *      (`A || B` es UN requisito, no dos) y pidiendo solo los grupos SIN default.
 *   2. los dos derivan su universo de "los wrappers que ya pasan la variable" — una lista de
 *      inclusion que falla abierto justo en el sujeto que no la pasa, que es el unico que
 *      importa. Aca el universo sale de quien USA el criterio (importa `es-nuestra.mjs`).
 *
 * POR QUE SE EJECUTA Y NO SE LEE: mirar el texto no distingue "lo pasa" de "lo nombra en un
 * comentario". Cada wrapper se corre de verdad contra un `docker` FALSO que graba sus
 * argumentos, con el entorno limpio, igual que sus dos hermanos.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { cargaElEnvEntero, loQueRecibioDocker } from "./slots-viajan-al-barrido.test.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const CRITERIO = "es-nuestra.mjs";

/**
 * Los grupos de variables que el criterio LEE, derivados de su fuente. Un `A || B` es UN
 * requisito con dos nombres aceptables; un grupo con fallback literal NO vacio tiene default
 * y no se exige (el producto no lo necesita, y un gate que exige de mas tambien miente).
 */
export function insumosQueExigeElCriterio(dir = AQUI) {
  const fuente = readFileSync(join(dir, CRITERIO), "utf8");
  const grupos = [];
  const cadena = /process\.env\.([A-Z_]+)((?:\s*\|\|\s*process\.env\.[A-Z_]+)*)\s*(\|\|\s*("[^"]*"|'[^']*'|`[^`]*`))?/g;
  for (const m of fuente.matchAll(cadena)) {
    const nombres = [m[1], ...[...m[2].matchAll(/process\.env\.([A-Z_]+)/g)].map((x) => x[1])];
    const literal = m[4] ? m[4].slice(1, -1) : null;
    if (literal !== null && literal !== "") continue; // tiene default propio: no es insumo
    const clave = nombres.join("|");
    if (!grupos.some((g) => g.clave === clave)) grupos.push({ clave, nombres });
  }
  return grupos;
}

/** Universo del disco: los barridos que USAN el criterio. readdirSync, no `git ls-files`. */
export function barridosQueUsanElCriterio(dir = AQUI) {
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && /-run\.mjs$/.test(d.name))
    .filter((d) => readFileSync(join(dir, d.name), "utf8").includes(CRITERIO))
    .map((d) => d.name.replace(/\.mjs$/, ".sh"))
    .sort();
}

test("el universo sale de quien USA el criterio, e incluye a los cuatro barridos", () => {
  const universo = barridosQueUsanElCriterio();
  // Caso ancla. Sin esto, un filtro que se estrecha solo vacia el universo y el gate firma
  // verde sin sujetos — y el sujeto del bug es justamente el que NO pasaba la variable, asi
  // que derivar el universo del sintoma lo habria dejado afuera.
  for (const conocido of ["followup-run.sh", "reminder-run.sh", "insistencia-run.sh", "postdemo-run.sh"]) {
    assert.ok(universo.includes(conocido), `${conocido} usa el criterio y tiene que estar en el universo`);
  }
});

test("el insumo se deriva del criterio, agrupando alternativas y salteando los que traen default", () => {
  const grupos = insumosQueExigeElCriterio();
  const claves = grupos.map((g) => g.clave);
  // El token es el que no tiene default: sin el, `listarInboxesDeChatwoot` tira.
  assert.ok(
    claves.includes("CHATWOOT_API_TOKEN|CHATWOOT_TOKEN"),
    `el token tiene que salir como UN grupo de dos nombres, no como dos requisitos. Salio: ${claves.join(", ")}`,
  );
  // Y los que SI traen default no se exigen: pedirlos seria exigir lo que el producto no pide.
  assert.ok(!claves.includes("CHATWOOT_BASE_URL"), "CHATWOOT_BASE_URL trae default en el criterio");
  assert.ok(!claves.includes("CHATWOOT_ACCOUNT_ID"), "CHATWOOT_ACCOUNT_ID trae default en el criterio");
});

test("el insumo del criterio llega al contenedor aunque el cron llame al wrapper pelado", () => {
  const grupos = insumosQueExigeElCriterio();
  assert.ok(grupos.length > 0, "sin insumos derivados el gate no mide nada");
  // Se siembra el entorno COMPLETO que un wrapper sano tiene a mano, para que el gate mida lo
  // unico que esta en discusion: si el wrapper PASA el insumo, no si pudo conseguirlo. El
  // agente va incluido porque los que leen el token de la base no lo buscan sin el.
  const envFile =
    `ONIA_BOT_DRY_RUN=true\nCHATWOOT_BOT_AGENT_ID=3\n` +
    grupos.map((g) => `${g.nombres[0]}=sembrado-${g.nombres[0]}\n`).join("");

  for (const wrapper of barridosQueUsanElCriterio()) {
    const texto = readFileSync(join(AQUI, wrapper), "utf8");
    if (cargaElEnvEntero(texto)) continue; // ya carga webhook.env entero, como el webhook

    // Las DOS fuentes legitimas sembradas a la vez: `webhook.env` y la base de Chatwoot (hay
    // wrappers que sacan el token con `docker exec … psql`). Sembrar una sola acusaria a los
    // que usan la otra, que es como este gate fallo la primera vez que se corrio.
    const recibido = loQueRecibioDocker(wrapper, { envFile, salidaDocker: "token-de-la-base" });
    for (const grupo of grupos) {
      assert.ok(
        grupo.nombres.some((n) => new RegExp(`${n}=[^\\s"']`).test(recibido)),
        `${wrapper}: usa esConversacionNuestra() y el contenedor NO recibio ${grupo.nombres.join(" ni ")}.\n` +
          `Sin eso el criterio no puede preguntarle a Chatwoot por los inboxes de prueba, falla ABIERTO\n` +
          `(conjunto vacio) y el banco de pruebas vuelve a pasar como prospecto real.\n` +
          `Se deriva de webhook.env, igual que ONIA_BOT_DRY_RUN unas lineas mas arriba.\n` +
          `docker recibio:\n${recibido.slice(0, 900) || "(nada)"}`,
      );
    }
  }
});

test("el que llama sigue mandando: un insumo explicito le gana al archivo", () => {
  // Direccion simetrica: la cura no puede pisar lo que el llamador eligio a proposito (es como
  // se prueba contra otra cuenta de Chatwoot sin tocar produccion).
  const mio = "token-del-llamador";
  const recibido = loQueRecibioDocker("postdemo-run.sh", {
    env: { CHATWOOT_API_TOKEN: mio },
    envFile: "ONIA_BOT_DRY_RUN=true\nCHATWOOT_API_TOKEN=el-del-archivo\n",
  });
  assert.ok(recibido.includes(`CHATWOOT_API_TOKEN=${mio}`), "el insumo explicito del llamador tiene que ganar");
});
