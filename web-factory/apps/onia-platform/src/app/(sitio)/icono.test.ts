import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * Los iconos que el sitio promete existen de verdad.
 *
 * El 2026-09-03, corriendo el checklist de pre-entrega contra producción —17
 * puntos que nunca se habían ejecutado—, `https://onia.com.bo/favicon.ico`
 * devolvía **404**. No un icono roto: la página de error entera, 29 KB de HTML
 * servidos a quien pidió una imagen de 3 KB.
 *
 * El sitio declaraba `<link rel="icon" href="/icon.svg">` y
 * `<link rel="apple-touch-icon" href="/apple-icon.png">`, y los dos daban 200.
 * Por eso nadie lo vio: **Chromium no pide `/favicon.ico` cuando hay un icono
 * declarado** — medido en vivo, la home dispara exactamente dos peticiones de
 * icono y ninguna es ésa. El que paga es todo cliente que lo pide a pelo sin
 * leer el `<head>`: buscadores, lectores de feeds, gestores de marcadores y
 * navegadores viejos. Es el camino por defecto de la web desde antes de que el
 * `<link rel="icon">` existiera, y nunca dejó de usarse.
 *
 * Había un ICO bueno en el repo —`public/brand/v2/favicon.ico`, 3 tamaños—
 * publicado en `/brand/v2/favicon.ico`. Estaba a un `cp` de la raíz.
 *
 * ⚠️ Este gate mira el DISCO, no la red: corre en `prebuild`
 * (`tsc --noEmit && vitest run`), que es el comando real del deploy, y ahí
 * todavía no hay sitio que consultar. Lo que vigila es la causa —que el archivo
 * esté donde el servidor lo va a buscar— no el síntoma.
 *
 * Y vigila la CLASE, no el archivo de ayer: los TRES iconos que el sitio
 * publica, cada uno con su firma de formato. Un gate que sólo cuidara el
 * favicon pasaría en verde el día que alguien mueva `icon.svg` — que es el
 * mismo defecto, sólo que en el icono que el navegador sí mira.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const APP = dirname(AQUI);
const RAIZ = dirname(dirname(APP));
const PUBLIC = join(RAIZ, "public");

/** Los primeros bytes de un archivo, para preguntarle qué es en vez de creerle a la extensión. */
function firma(ruta: string, largo = 8): Buffer {
  return readFileSync(ruta).subarray(0, largo);
}

/**
 * Cada icono con las DOS raíces desde las que este proyecto puede servirlo, y
 * la prueba de que es lo que dice ser.
 *
 * Se admiten las dos ubicaciones a propósito: `public/x` y la convención de
 * metadata de Next en `app/x` terminan las dos en la misma URL, y el gate no
 * tiene por qué opinar sobre cuál se usa — sólo que el archivo llegue.
 */
const ICONOS = [
  {
    url: "/favicon.ico",
    candidatos: [join(PUBLIC, "favicon.ico"), join(APP, "favicon.ico")],
    // Un ICO real arranca con el header ICONDIR: reservado 0, tipo 1, y al
    // menos una imagen dentro.
    formato: (b: Buffer) =>
      b[0] === 0x00 && b[1] === 0x00 && b[2] === 0x01 && b[3] === 0x00 && (b[4] | (b[5] << 8)) > 0,
    esperado: "un ICO de verdad (header ICONDIR), no un PNG con la extensión cambiada",
  },
  {
    url: "/icon.svg",
    candidatos: [join(PUBLIC, "icon.svg"), join(APP, "icon.svg")],
    formato: (b: Buffer) => /^\s*<(\?xml|svg)/.test(b.toString("utf8")),
    esperado: "un SVG (abre con <svg o <?xml)",
  },
  {
    url: "/apple-icon.png",
    candidatos: [join(PUBLIC, "apple-icon.png"), join(APP, "apple-icon.png")],
    formato: (b: Buffer) => b.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47])),
    esperado: "un PNG (firma \\x89PNG)",
  },
];

describe("los iconos que el sitio publica existen y son del formato que dicen", () => {
  it.each(ICONOS.map((i) => [i.url, i] as const))("%s está en disco", (url, icono) => {
    const encontrado = icono.candidatos.find((c) => existsSync(c));
    expect(
      encontrado,
      `nada sirve ${url}: no está en ninguna de sus dos raíces posibles ` +
        `(${icono.candidatos.join(" ni ")}). Quien pida ${url} se lleva la ` +
        `página de error de 29 KB en vez del icono.`,
    ).toBeDefined();
  });

  it.each(ICONOS.map((i) => [i.url, i] as const))("%s no está vacío", (url, icono) => {
    const encontrado = icono.candidatos.find((c) => existsSync(c));
    if (!encontrado) return; // ya lo grita el caso de arriba
    expect(statSync(encontrado).size, `${url} pesa 0 bytes: sirve 200 y no se ve nada`).toBeGreaterThan(
      100,
    );
  });

  it.each(ICONOS.map((i) => [i.url, i] as const))("%s es %s", (url, icono) => {
    const encontrado = icono.candidatos.find((c) => existsSync(c));
    if (!encontrado) return;
    expect(
      icono.formato(firma(encontrado)),
      `${encontrado} no es ${icono.esperado}. Renombrar un archivo no le cambia ` +
        `el formato, y el que lo pida no lo va a poder dibujar.`,
    ).toBe(true);
  });
});
