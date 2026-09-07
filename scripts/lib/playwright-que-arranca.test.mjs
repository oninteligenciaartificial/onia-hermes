/**
 * playwright-que-arranca.test.mjs — el navegador se elige por el que ARRANCA, no por el
 * primer node_modules que exista.
 *
 * POR QUE EXISTE, con fecha (2026-09-07, nodo-casa):
 * `cargar("playwright")` recorría RAICES y se quedaba con la primera que resolviera el
 * módulo. En nodo-casa la primera es `/root/loops/onia-platform-chatbot/node_modules`, que
 * trae playwright 1.60.0 y pide `chromium_headless_shell-1223`; en disco había 1228 y 1243,
 * o sea el navegador de la SIGUIENTE raíz (1.63.0), que sí arranca. Resultado: TODO script
 * que mira una pantalla desde casa moría con "Executable doesn't exist" — y son los cuatro
 * loops vivos los que corren ahí. El instrumento central del proyecto ("verificar es MIRAR")
 * estaba apagado en la única máquina que corre loops.
 *
 * Es la trampa ya anotada en la memoria compartida ("un gate que busca el repo HERMANO por
 * lista de candidatos y se queda con el primero que exista") aplicada al NAVEGADOR, y con un
 * agravante propio: la presencia del módulo no dice nada sobre la presencia de su navegador,
 * y `existsSync(chromium.executablePath())` tampoco — `executablePath()` devuelve el chromium
 * completo mientras `launch()` arranca el `chromium_headless_shell`, que puede faltar por
 * separado (memoria de web-factory-dev, 2026-09-04). La ÚNICA prueba válida es lanzarlo.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { elegirRaizPlaywright } from "./playwright-que-arranca.mjs";

/** Fabrica un probador: `arrancan` es el conjunto de raíces cuyo navegador SÍ lanza. */
function probador(arrancan, registro = []) {
  return async (raiz) => {
    registro.push(raiz);
    if (arrancan.includes(raiz)) return;
    throw new Error(`Executable doesn't exist (${raiz})`);
  };
}

test("salta la raíz que tiene el módulo y NO tiene su navegador", async () => {
  const registro = [];
  const elegida = await elegirRaizPlaywright({
    raices: ["/sin-navegador", "/con-navegador"],
    resolver: () => ({ chromium: {} }),
    probar: probador(["/con-navegador"], registro),
  });
  assert.equal(elegida.raiz, "/con-navegador");
  // Y la probó de verdad: si no la hubiera lanzado, no podría saberlo.
  assert.deepEqual(registro, ["/sin-navegador", "/con-navegador"]);
});

test("el caso que YA cumple: si la primera arranca, se queda con ella y no prueba las demás", async () => {
  // Sin este caso, un detector que devolviera SIEMPRE la última raíz pasaría el test de
  // arriba. La mutación tiene que fallar en las dos direcciones.
  const registro = [];
  const elegida = await elegirRaizPlaywright({
    raices: ["/primera", "/segunda"],
    resolver: () => ({ chromium: {} }),
    probar: probador(["/primera", "/segunda"], registro),
  });
  assert.equal(elegida.raiz, "/primera");
  assert.deepEqual(registro, ["/primera"], "no debe seguir probando después de encontrar una que arranca");
});

test("una raíz sin el módulo instalado no rompe la búsqueda: se salta", async () => {
  const elegida = await elegirRaizPlaywright({
    raices: ["/sin-modulo", "/con-navegador"],
    resolver: (raiz) => {
      if (raiz === "/sin-modulo") {
        const e = new Error("Cannot find module 'playwright'");
        e.code = "MODULE_NOT_FOUND";
        throw e;
      }
      return { chromium: {} };
    },
    probar: probador(["/con-navegador"]),
  });
  assert.equal(elegida.raiz, "/con-navegador");
});

test("si NINGUNA arranca, falla fuerte y nombra cada raíz con su motivo — no sale verde", async () => {
  await assert.rejects(
    () =>
      elegirRaizPlaywright({
        raices: ["/a", "/b"],
        resolver: () => ({ chromium: {} }),
        probar: probador([]),
      }),
    (e) => {
      // El mensaje tiene que nombrar a las DOS y decir cómo se repara: un fallo que no dice
      // qué falta manda a adivinar, que es como este bug sobrevivió una mudanza entera.
      assert.match(e.message, /\/a/);
      assert.match(e.message, /\/b/);
      assert.match(e.message, /playwright install/);
      return true;
    }
  );
});

test("un error que NO es 'falta el módulo' se propaga: no se confunde con 'esta raíz no sirve'", async () => {
  await assert.rejects(
    () =>
      elegirRaizPlaywright({
        raices: ["/rota"],
        resolver: () => {
          throw new SyntaxError("Unexpected token en el package del paquete");
        },
        probar: probador(["/rota"]),
      }),
    /Unexpected token/
  );
});
