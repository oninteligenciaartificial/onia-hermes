/**
 * playwright-que-arranca.mjs — elegir el playwright cuyo NAVEGADOR arranca de verdad.
 *
 * `cargar("playwright")` de `sesion_dueno.mjs` se queda con la primera raíz que resuelva el
 * módulo. Eso alcanza para `@supabase/ssr` (o está o no está) y NO alcanza para playwright:
 * el paquete puede estar instalado y su navegador no, y entonces el fallo llega recién en
 * `chromium.launch()`, con un mensaje que suena a "instalá playwright" cuando el playwright
 * bueno ya estaba en la raíz siguiente.
 *
 * Medido el 2026-09-07 en nodo-casa, la única máquina que hoy corre loops:
 *   /root/loops/onia-platform-chatbot/node_modules -> playwright 1.60.0 (pide shell 1223)
 *   /root/node_modules                             -> playwright 1.63.0 (shell 1243, en disco)
 * y en `~/.cache/ms-playwright` había 1228 y 1243. Ganaba la primera y no arrancaba ninguna
 * pantalla: los scripts que MIRAN producción quedaron ciegos en esa máquina.
 *
 * No se comprueba con `existsSync(chromium.executablePath())`: eso devuelve el chromium
 * completo, mientras `launch()` arranca el `chromium_headless_shell`, que puede faltar por
 * separado — es un falso verde ya medido (web-factory-dev, 2026-09-04). Se comprueba
 * LANZÁNDOLO (~0,3 s por raíz, y se corta en la primera que arranca).
 */
import { createRequire } from "node:module";

/** Las mismas raíces que `sesion_dueno.mjs`, y por el mismo motivo: playwright no vive acá. */
export const RAICES_PLAYWRIGHT = [
  "/root/loops/onia-platform-chatbot/node_modules",
  "/root/loops/onia-platform/node_modules",
  "/root/node_modules",
];

/** Prueba real: arranca el navegador y lo cierra. Es lo único que distingue un módulo de un navegador. */
async function lanzarYCerrar(_raiz, modulo) {
  const navegador = await modulo.chromium.launch({ args: ["--no-sandbox"] });
  await navegador.close();
}

/**
 * Devuelve `{ raiz, modulo }` de la primera raíz cuyo navegador arranca.
 * Falla fuerte nombrando cada raíz con su motivo si ninguna sirve: un instrumento que no
 * puede medir tiene que decirlo, nunca salir verde por defecto.
 */
export async function elegirRaizPlaywright({
  raices = RAICES_PLAYWRIGHT,
  resolver = (raiz) => createRequire(`${raiz}/`)("playwright"),
  probar = lanzarYCerrar,
} = {}) {
  const motivos = [];
  for (const raiz of raices) {
    let modulo;
    try {
      modulo = resolver(raiz);
    } catch (e) {
      // Sólo "no está instalado" es un candidato descartable. Cualquier otro error es un
      // problema real de esa instalación y se propaga: tragárselo deja buscando en silencio.
      if (e?.code !== "MODULE_NOT_FOUND") throw e;
      motivos.push(`${raiz}: no tiene el paquete instalado`);
      continue;
    }
    try {
      await probar(raiz, modulo);
      return { raiz, modulo };
    } catch (e) {
      motivos.push(`${raiz}: el paquete está pero su navegador no arranca — ${e.message.split("\n")[0]}`);
    }
  }
  throw new Error(
    `Ninguna instalación de playwright puede abrir un navegador en esta máquina. Se probó:\n  ` +
      `${motivos.join("\n  ")}\n` +
      `Se repara instalando el navegador de la raíz que quieras usar, p. ej.:\n` +
      `  cd ${raices[raices.length - 1].replace(/\/node_modules$/, "")} && npx playwright install chromium\n` +
      `Sin navegador esto NO puede mirar nada — y no sale verde por defecto.`
  );
}

/** Azúcar para los consumidores: devuelve el `chromium` que sí arranca. */
export async function cargarPlaywright(opciones) {
  const { raiz, modulo } = await elegirRaizPlaywright(opciones);
  return { chromium: modulo.chromium, raiz };
}
