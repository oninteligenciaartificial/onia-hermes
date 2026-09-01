// ONIA — el guardia del guardia de la marca.
//
// `chatwoot-brand-onia.sh` re-aplica la marca DESDE ADENTRO del contenedor. Nadie miraba
// nunca el resultado desde AFUERA, y por eso BRAND_URL, TERMS_URL y PRIVACY_URL estuvieron
// quince dias diciendo `www.chatwoot.com` en el HTML publico del login sin que saltara nada
// (16-ago -> 31-ago). La regla dura del carril es que Chatwoot no se vea; se veia.
//
// Estos tests corren sobre el parser, con el HTML REAL de produccion del 2026-08-31 — el
// que traia las tres revertidas — para que no puedan pasar por casualidad.

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { MARCA, extraerConfig, revisarMarca } from "./chatwoot-marca-publica.mjs";

const AQUI = path.dirname(fileURLToPath(import.meta.url));

/** Recorte real de https://chat.onia.com.bo/app/login, 2026-08-31: 3 de 9 revertidas. */
const HTML_REVERTIDO = `<!DOCTYPE html><html><head><script>
window.globalConfig = {"LOGO":"https://app.onia.com.bo/onia-logo.svg","LOGO_DARK":"https://app.onia.com.bo/onia-logo-white.svg","LOGO_THUMBNAIL":"https://onia.com.bo/apple-icon.png","INSTALLATION_NAME":"Onia","WIDGET_BRAND_URL":"https://onia.com.bo","TERMS_URL":"https://www.chatwoot.com/terms-of-service","BRAND_URL":"https://www.chatwoot.com","BRAND_NAME":"Onia","PRIVACY_URL":"https://www.chatwoot.com/privacy-policy","DISPLAY_MANIFEST":true,"APP_VERSION":"4.12.1","ALLOWED_LOGIN_METHODS":["email","google_oauth"]}
</script></head><body></body></html>`;

const HTML_LIMPIO = HTML_REVERTIDO
  .replace('"TERMS_URL":"https://www.chatwoot.com/terms-of-service"', '"TERMS_URL":"https://onia.com.bo/terminos"')
  .replace('"BRAND_URL":"https://www.chatwoot.com"', '"BRAND_URL":"https://onia.com.bo"')
  .replace('"PRIVACY_URL":"https://www.chatwoot.com/privacy-policy"', '"PRIVACY_URL":"https://onia.com.bo/privacidad"');

test("el HTML real del 31-ago: nombra las TRES revertidas y ninguna mas", () => {
  const { perdidas } = revisarMarca(HTML_REVERTIDO);
  assert.deepEqual(
    perdidas.map((p) => p.clave).sort(),
    ["BRAND_URL", "PRIVACY_URL", "TERMS_URL"],
  );
  assert.equal(perdidas.find((p) => p.clave === "BRAND_URL").valor, "https://www.chatwoot.com");
});

test("con la marca puesta no reporta nada (el gate tiene que poder salir verde)", () => {
  assert.deepEqual(revisarMarca(HTML_LIMPIO).perdidas, []);
});

test("una clave que FALTA cuenta como perdida — no se perdona por ausencia", () => {
  const sinLogo = HTML_LIMPIO.replace('"LOGO":"https://app.onia.com.bo/onia-logo.svg",', "");
  const claves = revisarMarca(sinLogo).perdidas.map((p) => p.clave);
  assert.ok(claves.includes("LOGO"), `LOGO tenia que salir en ${JSON.stringify(claves)}`);
});

test("HTML sin globalConfig: explota con motivo, NO devuelve 'todo bien'", () => {
  assert.throws(() => extraerConfig("<html><body>login</body></html>"), /globalConfig/);
});

test("el parser no se come el resto de la pagina: DISPLAY_MANIFEST sigue siendo booleano", () => {
  assert.equal(extraerConfig(HTML_REVERTIDO).DISPLAY_MANIFEST, true);
});

test("la lista de MARCA es la MISMA que re-aplica chatwoot-brand-onia.sh", () => {
  // Si las dos listas se separan, el cron defiende una marca y el gate mide otra:
  // el gate saldria verde sobre una clave que nadie re-aplica.
  const sh = readFileSync(path.join(AQUI, "chatwoot-brand-onia.sh"), "utf8");
  const enElSh = Object.fromEntries(
    [...sh.matchAll(/^\s*"([A-Z_]+)"\s*=>\s*"([^"]+)"/gm)].map((m) => [m[1], m[2]]),
  );
  assert.equal(Object.keys(enElSh).length, 9, "el .sh dejo de tener 9 claves de marca");
  assert.deepEqual(MARCA, enElSh);
});

// ---------------------------------------------------------------------------
// El CODIGO DE SALIDA, corrido de verdad: el script se ejecuta contra un Chatwoot de mentira
// y se lee su exit. Guarda que el veredicto VIAJE por el codigo de salida, que es lo unico
// que puede leer un cron.
//
// AVISO, medido y no supuesto: esto NO reproduce el crash que motivo el cambio. La v1 salia
// con `process.exit(1)` y contra el HTTPS real de produccion reventaba libuv con los sockets
// keep-alive de `fetch` abiertos — `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)`,
// **exit 127** con el mensaje correcto ya impreso. Revertido a `process.exit(1)` a proposito,
// estos dos tests siguen VERDES contra el servidor local: la carrera no se da en 127.0.0.1.
// Lo que sostiene el arreglo es el comentario del .mjs, no este test.

import { createServer } from "node:http";
import { execFile } from "node:child_process";

/** Levanta un Chatwoot de mentira que sirve `html`, corre el script contra el, y devuelve el exit. */
function correrContra(html) {
  return new Promise((resolve, reject) => {
    const server = createServer((_req, res) => res.end(html)).listen(0, "127.0.0.1", () => {
      const url = `http://127.0.0.1:${server.address().port}/app/login`;
      execFile(
        process.execPath,
        [path.join(AQUI, "chatwoot-marca-publica.mjs")],
        { env: { ...process.env, ONIA_CHATWOOT_URL: url } },
        (error, stdout, stderr) => {
          server.close();
          if (error && typeof error.code !== "number") return reject(error);
          resolve({ codigo: error ? error.code : 0, salida: `${stdout}${stderr}` });
        },
      );
    });
  });
}

test("con la marca revertida sale 1 y lo dice", async () => {
  const { codigo, salida } = await correrContra(HTML_REVERTIDO);
  assert.equal(codigo, 1, `salio ${codigo}. Salida:\n${salida}`);
  assert.match(salida, /REVERTIDAS 3\/9/);
});

test("con la marca puesta sale 0", async () => {
  const { codigo, salida } = await correrContra(HTML_LIMPIO);
  assert.equal(codigo, 0, `salio ${codigo}. Salida:\n${salida}`);
  assert.match(salida, /intacta \(9 configs\)/);
});
