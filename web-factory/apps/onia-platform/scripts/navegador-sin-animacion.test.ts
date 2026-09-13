/**
 * Un medidor que abre el sitio con las animaciones ENCENDIDAS lee numeros a
 * medio contar, y los reporta como si el sitio los pintara.
 *
 * POR QUE EXISTE, medido el 2026-09-12 23:10 La Paz contra produccion.
 * `npm run precios:vivos` salia en ROJO con:
 *
 *     ROJO: Bs 364 pintado en /v1/chatbot y NO declarado por ninguna fuente.
 *       Ninguna fuente de esta rama lo escribe como precio → produccion corre
 *       un build viejo. Falta DESPLEGAR.
 *
 * Las dos mitades eran falsas. `grep -rn 364 src/` da CERO, el publicador de la
 * landing contestaba *"YA ESTA PUBLICADO — el sitio vivo sirve todo lo que main
 * tiene"*, y el 364 no esta en el HTML servido. Sale de
 * `src/app/v1/chatbot/Configurador.tsx:136`, que pinta el precio con `<CountUp>`
 * — un contador que ESCRIBE EN EL DOM cada frame mientras sube. `mirarPantalla`
 * lee `innerText` a los 600 ms del `load`, o sea a mitad de la cuenta.
 *
 * Muestreando esa pantalla cada 40 ms, el DOM pinta 29 "precios" distintos en
 * el camino a 390: `3 40 80 138 173 219 257 277 302 315 332 341 352 360 365 370
 * 373 377 379 381 383 384 386 387 388 389 390`. Abriendo la MISMA pantalla con
 * `reducedMotion: "reduce"`, el DOM pinta exactamente tres: `190 390 3.900` —
 * los tres reales. `CountUp` respeta `prefers-reduced-motion` y salta al valor
 * final (`src/motion/count-up.tsx`), asi que la carrera desaparece por
 * construccion en vez de por un timeout mas largo, que es la misma carrera con
 * una ventana mas grande.
 *
 * POR QUE ES GRAVE Y NO COSMETICO: el rojo venia con un diagnostico que INVIERTE
 * la causa. Obedecerlo significaba abrirle a Sergio Urcullo un pedido de deploy
 * por un defecto inexistente; y mientras tanto la linea `OBJETIVO:` de este
 * carril reportaba "precios fuera de fuente: 1" para siempre.
 *
 * EL SUJETO ES LA CLASE, NO EL ARCHIVO. El defecto no es de `precios-vivos`: es
 * de cualquier medidor que lea un DOM animado. Los seis guiones que levantan
 * chromium comparten la exposicion —los que leen texto y tambien los que sacan
 * capturas, donde un `Bs 364` congelado en un PNG es peor, porque Sergio Urcullo
 * aprueba piezas mirando esas capturas—. El universo sale del DISCO por
 * CONTENIDO (quien llama a `chromium.launch`), no por el nombre del archivo: el
 * gate hermano `medidores-vivos-miran-produccion.test.ts` se acota a
 * `*-vivo.mjs` y por eso no ve a `mirar-venta`, `recorrer-portada`,
 * `mirar-primera-pantalla` ni `verificar-guia-facturacion`, que animan igual.
 *
 * VERIFICADO ANTES DE APLICARLO A LAS CAPTURAS: con y sin `reduce`, `/`,
 * `/precios` y `/rubros` devuelven el MISMO `innerText` (8655 / 5725 / 2458
 * caracteres) y la misma cantidad de nodos con opacidad < 0.9 (31 / 5 / 8).
 * `MotionConfig reducedMotion="user"` apaga transform y deja vivir la opacidad,
 * asi que no se esconde nada: lo unico que cambia es que el frame es el final.
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { sinComentarios } from "./medidores-vivos-miran-produccion.test";

const AQUI = dirname(fileURLToPath(import.meta.url));

/**
 * Los guiones que abren un navegador, derivados del disco por CONTENIDO.
 *
 * Por contenido y no por nombre: `mirar-venta.mjs` no se llama `-vivo` y es de
 * los que sacan las capturas que se miran. Un filtro por nombre habria dejado
 * cuatro de los seis sujetos afuera.
 */
export function medidoresConNavegador(dir: string = AQUI): string[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".mjs"))
    .filter((f) => /chromium[\s\S]{0,400}?\.launch\(/.test(sinComentarios(readFileSync(join(dir, f), "utf8"))))
    .sort();
}

/** Texto del argumento de la llamada que abre en `i` (parentesis balanceados). */
function argumentoDe(codigo: string, i: number): string {
  let nivel = 0;
  for (let j = i; j < codigo.length; j++) {
    if (codigo[j] === "(") nivel++;
    else if (codigo[j] === ")") {
      nivel--;
      if (nivel === 0) return codigo.slice(i + 1, j);
    }
  }
  return codigo.slice(i + 1);
}

const PIDE_REDUCIR = /reducedMotion\s*:\s*(["'])reduce\1/;

/**
 * Contextos que SI piden reducir, por nombre de variable.
 *
 * Solo estos absuelven a un `.newPage()` pelado. Alcanzaba con listar "los que
 * salen de un `newContext`" y era un agujero: un contexto que NO pide la opcion
 * seguia absolviendo a sus paginas, o sea el detector se apagaba justo donde el
 * defecto vive. Lo delato su propio caso ancla.
 */
function contextosQueReducen(codigo: string): Set<string> {
  const nombres = new Set<string>();
  const re = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:await\s+)?[\w$.]*\.?newContext\s*\(/g;
  for (const m of codigo.matchAll(re)) {
    const abre = m.index! + m[0].length - 1;
    if (PIDE_REDUCIR.test(argumentoDe(codigo, abre))) nombres.add(m[1]);
  }
  return nombres;
}

/**
 * Las aperturas de pantalla que NO piden `reducedMotion: "reduce"`.
 *
 * Un `contexto.newPage()` pelado esta bien SI su contexto ya lo pide: la opcion
 * se hereda. Cualquier otro receptor —el navegador, o uno que no se pueda
 * atribuir— tiene que pedirlo el mismo; asi el detector falla CERRADO ante la
 * forma que no supo nombrar, en vez de absolverla.
 */
export function aperturasSinReducir(fuente: string): string[] {
  const codigo = sinComentarios(fuente);
  const contextos = contextosQueReducen(codigo);
  const faltantes: string[] = [];
  for (const m of codigo.matchAll(/([A-Za-z_$][\w$]*)\s*\.\s*(newContext|newPage)\s*\(/g)) {
    const abre = m.index! + m[0].length - 1;
    const arg = argumentoDe(codigo, abre);
    if (PIDE_REDUCIR.test(arg)) continue;
    if (m[2] === "newPage" && contextos.has(m[1])) continue;
    faltantes.push(`${m[1]}.${m[2]}(${arg.replace(/\s+/g, " ").trim().slice(0, 60)})`);
  }
  return faltantes;
}

describe("ningun medidor lee un DOM a medio animar", () => {
  it("el universo sale del disco, por contenido, y trae al sujeto que lo delato", () => {
    const guiones = medidoresConNavegador();
    // Un gate sobre una lista vacia pasa sin mirar nada, y un filtro mal escrito
    // la vacia en silencio: el sujeto del caso medido tiene que estar SIEMPRE.
    expect(guiones).toContain("precios-vivos.mjs");
    expect(guiones.length).toBeGreaterThanOrEqual(5);
  });

  it.each(medidoresConNavegador())("%s abre cada pantalla con las animaciones apagadas", (archivo) => {
    expect(aperturasSinReducir(readFileSync(join(AQUI, archivo), "utf8"))).toEqual([]);
  });

  describe("el detector, probado en las dos direcciones", () => {
    it("acusa el newPage que no lo pide", () => {
      expect(aperturasSinReducir(`const p = await nav.newPage({ viewport: { width: 1280, height: 1000 } });`))
        .toHaveLength(1);
    });

    it("deja pasar el newPage que lo pide", () => {
      expect(
        aperturasSinReducir(
          `const p = await nav.newPage({ viewport: { width: 1280, height: 1000 }, reducedMotion: "reduce" });`,
        ),
      ).toEqual([]);
    });

    it("deja pasar el newPage pelado cuyo contexto ya lo pide", () => {
      const fuente = [
        `const ctx = await navegador.newContext({ reducedMotion: "reduce" });`,
        `const page = await ctx.newPage();`,
      ].join("\n");
      expect(aperturasSinReducir(fuente)).toEqual([]);
    });

    it("acusa el newPage pelado cuando su contexto NO lo pide", () => {
      const fuente = [
        `const ctx = await navegador.newContext({ viewport: { width: 390, height: 844 } });`,
        `const page = await ctx.newPage();`,
      ].join("\n");
      // Dos: el contexto que no lo pide, y la pagina que no puede heredarlo.
      expect(aperturasSinReducir(fuente)).toHaveLength(2);
    });

    it("acusa el newPage pelado de un receptor que no es un contexto", () => {
      // Falla CERRADO: si no se puede atribuir la herencia, se exige la opcion.
      expect(aperturasSinReducir(`const p = await navegador.newPage();`)).toHaveLength(1);
    });

    it("no absuelve por un comentario que nombre la opcion", () => {
      const fuente = [
        `// TODO: pasar reducedMotion: "reduce" aca`,
        `const p = await nav.newPage({ viewport: { width: 1280, height: 1000 } });`,
      ].join("\n");
      expect(aperturasSinReducir(fuente)).toHaveLength(1);
    });

    it("no se marea con un objeto anidado antes de la opcion", () => {
      expect(
        aperturasSinReducir(
          `const p = await nav.newPage({ viewport: { width: 1280, height: 1000 }, extraHTTPHeaders: { a: "b" }, reducedMotion: 'reduce' });`,
        ),
      ).toEqual([]);
    });
  });
});
