// ONIA — ¿la marca Onia sobre Chatwoot se sostiene VISTA DESDE AFUERA?
//
// `chatwoot-brand-onia.sh` re-aplica la marca desde adentro del contenedor, cada hora al
// minuto :17. Lo que nadie miraba era el resultado: el 2026-08-31 se midio que BRAND_URL,
// TERMS_URL y PRIVACY_URL decian `www.chatwoot.com` desde el 16-ago — quince dias en el HTML
// publico de https://chat.onia.com.bo/app/login, que es la cara que ve un desconocido. La
// regla dura del carril es que Chatwoot es el MOTOR y esta hecho para NO verse.
//
// El front de Chatwoot embebe su config en la pagina (`window.globalConfig = {...}`), asi que
// esto no necesita el VPS, ni docker, ni un token: es un GET. Corre desde cualquier lado.
//
//   node hermes-content/deploy/vps-ops/chatwoot-marca-publica.mjs
//
// Sale 0 si las nueve claves son las de Onia, 1 nombrando las revertidas si no. No escribe
// nada: quien REPARA es `chatwoot-brand-onia.sh`, este solo mira.
//
// Env opcional: ONIA_CHATWOOT_URL (default https://chat.onia.com.bo/app/login).

/**
 * Las nueve de marca. Tienen que ser IDENTICAS a las que re-aplica
 * `chatwoot-brand-onia.sh` — hay un test que lo fija leyendo el .sh: si las dos listas se
 * separan, el cron defiende una marca y este gate mide otra, y sale verde sobre una clave
 * que nadie re-aplica.
 *
 * DISPLAY_MANIFEST queda afuera a proposito, igual que en el .sh: el reconcile tambien la
 * restaura, pero su valor de fabrica es el que queremos.
 */
export const MARCA = {
  INSTALLATION_NAME: "Onia",
  BRAND_NAME: "Onia",
  BRAND_URL: "https://onia.com.bo",
  WIDGET_BRAND_URL: "https://onia.com.bo",
  TERMS_URL: "https://onia.com.bo/terminos",
  PRIVACY_URL: "https://onia.com.bo/privacidad",
  LOGO: "https://app.onia.com.bo/onia-logo.svg",
  LOGO_DARK: "https://app.onia.com.bo/onia-logo-white.svg",
  LOGO_THUMBNAIL: "https://onia.com.bo/apple-icon.png",
};

/**
 * Saca el objeto de config del HTML. Explota si no esta: un gate que devuelve "todo bien"
 * cuando no pudo leer nada es el fantasma exacto que este carril mide.
 */
export function extraerConfig(html) {
  const linea = html.match(/window\.globalConfig\s*=\s*(\{.*\})/);
  if (!linea) throw new Error("no se encontro `window.globalConfig` en el HTML — ¿cambio el front de Chatwoot, o el GET trajo otra pagina?");
  return JSON.parse(linea[1]);
}

/** Una clave ausente cuenta como perdida: no existir es tan visible como estar mal. */
export function revisarMarca(html) {
  const config = extraerConfig(html);
  const perdidas = Object.entries(MARCA)
    .filter(([clave, esperado]) => config[clave] !== esperado)
    .map(([clave]) => ({ clave, valor: config[clave] ?? null }));
  return { config, perdidas };
}

const URL_LOGIN = process.env.ONIA_CHATWOOT_URL || "https://chat.onia.com.bo/app/login";

/**
 * Se sale con `process.exitCode` y NUNCA con `process.exit()`: en Windows, matar el proceso
 * con los sockets keep-alive de `fetch` todavia abiertos revienta libuv
 * (`Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)`) y devuelve **127** en vez del 1.
 * Un gate que no puede decir su veredicto por el codigo de salida no sirve de gate.
 */
if (process.argv[1]?.endsWith("chatwoot-marca-publica.mjs")) {
  const respuesta = await fetch(URL_LOGIN);
  if (!respuesta.ok) {
    console.error(`[marca-publica] ${URL_LOGIN} respondio ${respuesta.status}`);
    process.exitCode = 1;
  } else {
    const { perdidas } = revisarMarca(await respuesta.text());
    if (perdidas.length === 0) {
      console.log(`[marca-publica] intacta (${Object.keys(MARCA).length} configs) — ${URL_LOGIN}`);
    } else {
      console.error(`[marca-publica] REVERTIDAS ${perdidas.length}/${Object.keys(MARCA).length} en ${URL_LOGIN}:`);
      for (const { clave, valor } of perdidas) console.error(`[marca-publica]   ${clave}: ${JSON.stringify(valor)}`);
      console.error("[marca-publica] repara: /root/bin/chatwoot-brand-onia.sh   (en el VPS)");
      process.exitCode = 1;
    }
  }
}
