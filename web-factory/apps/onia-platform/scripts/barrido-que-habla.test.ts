/**
 * Un barrido que no dice por donde va es indistinguible de uno colgado — y se
 * lo mata.
 *
 * POR QUE EXISTE, medido el 2026-09-25 en nodo-casa contra produccion.
 * `mirar-venta.mjs` es la DEFINICION DE HECHO de este carril: el objetivo dice
 * "toda pantalla que ve un cliente se abre y se MIRA renderizada", y este es el
 * guion que la abre. Ese dia lo corri dos veces y lo mate las dos:
 *
 *     timeout 400 node scripts/mirar-venta.mjs   -> Terminated, cero lineas
 *     timeout  25 node scripts/mirar-venta.mjs   -> Terminated, cero lineas
 *
 * La segunda mata a los 25 s ya buscando la causa, porque la primera no dejo
 * NADA con que distinguir "trabajando" de "trabado". Diagnostique un cuelgue,
 * fui a buscar el navegador (arranca en 455 ms) y despues `networkidle` (llega
 * en 2,4 s). Las dos hipotesis eran falsas: el guion no se cuelga, **tarda ~9
 * minutos y es mudo**. Barre 24 rutas x 5 vistas = 120 navegaciones (~22 s por
 * ruta, medido con `--rutas=/`) y su primer `console.log` esta DESPUES del
 * `for`, recien cuando ya cerro el navegador.
 *
 * POR QUE ES GRAVE Y NO COSMETICO. El costo no es la espera, es el veredicto:
 * un gate mudo que se mata se archiva como "el ambiental de siempre", asi que
 * las dos pantallas que ve un lead quedan SIN MIRAR y la linea `OBJETIVO:` del
 * carril igual sale verde — verde de los gates que si hablan (`curl` + `grep`),
 * que es exactamente lo que `CLAUDE.md` prohibe tomar por verificacion. Un
 * `grep` sirve para descartar, nunca para confirmar; el unico instrumento que
 * CONFIRMA es este, y es el que nadie llega a ver terminar.
 *
 * Es la misma clase de defecto que ya costo una vuelta el 2026-09-24 ("un gate
 * puede salir exit 0 y MUDO, y eso se lee igual que una medicion que paso"),
 * pero por el otro lado: aquel no imprimia y terminaba, este no imprime y dura.
 *
 * EL SUJETO ES LA CLASE, NO EL ARCHIVO. Cualquier guion que navegue EN BUCLE
 * hereda la exposicion, porque el costo se multiplica por la cantidad de
 * vueltas. El universo sale del DISCO por CONTENIDO —quien llama a
 * `chromium.launch`, igual que `navegador-sin-animacion.test.ts`— y de ahi se
 * queda con los que tienen un `goto` DENTRO de un bucle: derivarlo por nombre
 * habria dejado afuera a `mirar-venta`, que no se llama `-vivo` ni `barrido`.
 * Al escribirlo eran dos sujetos y los dos estaban mudos: `mirar-venta.mjs` y
 * `mirar-primera-pantalla.mjs`, o sea los DOS que miran pantallas.
 *
 * QUE EXIGE, y por que tan poco: que dentro del bucle que navega haya una
 * emision. No exige formato, ni que sea cada N, ni a que canal: eso lo decide
 * cada guion. Exigir la forma convierte al gate en un corset que se esquiva
 * renombrando; exigir la PROPIEDAD —que el barrido hable mientras barre— es lo
 * que hace que matarlo deje de ser gratis.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { sinComentarios } from "./medidores-vivos-miran-produccion.test";
import { medidoresConNavegador } from "./navegador-sin-animacion.test";

const AQUI = dirname(fileURLToPath(import.meta.url));

/** Emitir por cualquiera de los canales que un humano ve en vivo. */
const EMITE = /console\s*\.\s*(log|error|warn|info)\s*\(|process\s*\.\s*(stdout|stderr)\s*\.\s*write\s*\(/;

/**
 * Los cuerpos `{...}` de cada `for`/`while`, con llaves balanceadas.
 *
 * Balanceadas y no por linea: el cuerpo de un barrido tiene objetos, plantillas
 * y funciones adentro, asi que cortar por indentacion o por la primera `}`
 * termina midiendo un pedazo que no es el bucle. Es la misma leccion que costo
 * una vuelta el 2026-09-24 partiendo `menu.tsx` por un literal: el gate midio
 * el lado equivocado y salio VERDE.
 */
function cuerposDeBucle(codigo: string): string[] {
  const cuerpos: string[] = [];
  for (const m of codigo.matchAll(/\b(for|while)\s*\(/g)) {
    // Saltear la condicion, que puede traer parentesis propios.
    let i = m.index! + m[0].length - 1;
    let nivel = 0;
    for (; i < codigo.length; i++) {
      if (codigo[i] === "(") nivel++;
      else if (codigo[i] === ")") {
        nivel--;
        if (nivel === 0) break;
      }
    }
    const abre = codigo.indexOf("{", i);
    if (abre < 0) continue; // bucle de una sola sentencia: no es un barrido
    let llaves = 0;
    let fin = abre;
    for (; fin < codigo.length; fin++) {
      if (codigo[fin] === "{") llaves++;
      else if (codigo[fin] === "}") {
        llaves--;
        if (llaves === 0) break;
      }
    }
    cuerpos.push(codigo.slice(abre, fin + 1));
  }
  return cuerpos;
}

/** Bucles que navegan y NO emiten nada mientras lo hacen. */
export function barridosMudos(fuente: string): string[] {
  const codigo = sinComentarios(fuente);
  return cuerposDeBucle(codigo)
    .filter((cuerpo) => /\.\s*goto\s*\(/.test(cuerpo))
    .filter((cuerpo) => !EMITE.test(cuerpo))
    .map((cuerpo) => cuerpo.replace(/\s+/g, " ").trim().slice(0, 80));
}

/** Los que navegan en bucle: el universo de este gate. */
function barridos(): string[] {
  return medidoresConNavegador(AQUI).filter((archivo) => {
    const codigo = sinComentarios(readFileSync(join(AQUI, archivo), "utf8"));
    return cuerposDeBucle(codigo).some((cuerpo) => /\.\s*goto\s*\(/.test(cuerpo));
  });
}

describe("un barrido largo dice por donde va", () => {
  it("el universo sale del disco y trae a los dos sujetos que lo delataron", () => {
    const sujetos = barridos();
    // Un gate sobre una lista vacia pasa sin mirar nada: si el detector deja de
    // reconocer la forma del bucle, esto lo dice en vez de cantar verde.
    expect(sujetos).toContain("mirar-venta.mjs");
    expect(sujetos).toContain("mirar-primera-pantalla.mjs");
  });

  it("el detector ve mudo lo que ES mudo, y deja de verlo cuando habla", () => {
    const mudo = `for (const p of PANTALLAS) { const page = await ctx.newPage(); await page.goto(url); }`;
    expect(barridosMudos(mudo)).toHaveLength(1);

    const habla = `for (const p of PANTALLAS) { console.error(p); await page.goto(url); }`;
    expect(barridosMudos(habla)).toHaveLength(0);

    // Un `console.log` en un COMENTARIO no es una emision. Sin esto el gate se
    // absuelve solo con la prosa que explica por que deberia hablar.
    const comentado = `for (const p of PANTALLAS) { /* console.log(p) */ await page.goto(url); }`;
    expect(barridosMudos(comentado)).toHaveLength(1);
  });

  it("ningun barrido navega en silencio", () => {
    for (const archivo of barridos()) {
      const mudos = barridosMudos(readFileSync(join(AQUI, archivo), "utf8"));
      expect(
        mudos,
        `${archivo}: navega en bucle sin emitir una sola linea. Un barrido mudo no se ` +
          `distingue de uno colgado, asi que se lo mata y la pantalla queda SIN MIRAR ` +
          `(pasó el 2026-09-25: dos corridas muertas a los 400 s y a los 25 s). Emití una ` +
          `linea por pantalla medida, con su tiempo.`,
      ).toEqual([]);
    }
  });
});
