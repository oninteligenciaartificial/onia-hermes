// E30 (hermes-jarvis, 11-oct): qué llega de verdad a un campo <input type="number" step="0.01"> cuando se escribe un monto o una cantidad.
// Uso: node campo-numerico.mjs            (idioma de la interfaz del navegador: español, el de un cliente en Bolivia)
//      IDIOMA=en-US node campo-numerico.mjs   (para comparar)
// Lo que importa es input.value: con type="number" el navegador normaliza lo escrito (la coma pasa a punto), así que "1,500" y "1.500"
// llegan iguales y Number()/parseFloat() leen 1,5. El idioma de la INTERFAZ (--lang) cambia el resultado; el locale del contexto, no.
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
const IDIOMA = process.env.IDIOMA ?? "es-BO";
const L = IDIOMA.replace("-", "_"); // en Linux, Chromium toma el idioma de la interfaz de LANGUAGE (con --lang solo no alcanza: medido el 11-oct)
const textos = ["1.500", "1,500", "1,5", "3.000", "1.000", "0,25", "1500", "1.5", "1,250"];
const browser = await chromium.launch({ args: [`--lang=${IDIOMA}`], env: { ...process.env, LANGUAGE: `${L}:${IDIOMA.split("-")[0]}`, LANG: `${L}.UTF-8` } });
const ctx = await browser.newContext({ locale: "es-BO" });
const page = await ctx.newPage();
await page.setContent('<input id="n" type="number" min="0.01" step="0.01">');
console.log(`idioma de la interfaz: ${IDIOMA}`);
for (const t of textos) {
  await page.fill("#n", "");
  await page.click("#n");
  await page.keyboard.type(t);
  const r = await page.$eval("#n", (e) => ({ value: e.value, bad: e.validity.badInput, step: e.validity.stepMismatch }));
  console.log(`${t.padEnd(6)} -> value=${JSON.stringify(r.value).padEnd(8)} Number()=${String(Number(r.value)).padEnd(6)} parseFloat()=${String(parseFloat(r.value)).padEnd(6)} badInput=${r.bad} stepMismatch=${r.step}`);
}
await browser.close();
