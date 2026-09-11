import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  CHATWOOT_BASE_URL,
  CHATWOOT_SDK_PATH,
  CHATWOOT_WEBSITE_TOKEN,
  ESPERA_SIN_GESTO_MS,
  GESTOS_QUE_PIDEN_CHAT,
  chatDiferidoInit,
} from "./chat-diferido";

/**
 * El sitio no se descarga el widget de chat encima del visitante.
 *
 * **El defecto que este gate deja rojo.** Hasta el 2026-09-11 el snippet del
 * layout hacía `window.addEventListener("load", … appendChild(sdk))`: toda
 * visita —el rebote de tres segundos, el bot, el que sólo vino a mirar el
 * precio— se llevaba **1.062 KB de los 1.491 KB** de la portada (71 % del
 * peso, 18 pedidos, medido con Lighthouse ese día). El chat es el canal de
 * contacto del sitio, así que no se saca: se pide cuando el visitante da señal
 * de quererlo.
 *
 * **Por qué se EJECUTA el snippet y no se lo grepea.** Lo que hay que afirmar
 * es un comportamiento —"tras `load` y nada más, no viaja ni un byte"— y
 * ningún patrón de texto lo ve: el snippet viejo y el nuevo comparten cada
 * literal (la URL, el token, `appendChild`) y difieren sólo en CUÁNDO corren.
 * Un grep de `sdk.js` da verde con los dos.
 */

/** Un `<script>` de mentira: sólo lo que el snippet le escribe. */
type ScriptFalso = {
  src?: string;
  defer?: boolean;
  async?: boolean;
  onload?: () => void;
};

type Ventana = {
  /** Los `<script>` que el snippet llegó a colgar del `<body>`. */
  agregados: ScriptFalso[];
  /** Dispara un evento sobre `window` (los que el snippet haya escuchado). */
  disparar: (evento: string) => void;
  /** Corre los `setTimeout` pendientes cuyo retraso sea <= `ms`. */
  avanzarReloj: (ms: number) => void;
  /** Lo que `chatwootSDK.run(...)` recibió, si llegó a correr. */
  corridas: Array<{ websiteToken: string; baseUrl: string }>;
  /** Los retrasos con los que el snippet programó respaldos. */
  retrasos: number[];
};

/**
 * DOM mínimo. No hay jsdom en esta app y no se agrega por un gate: lo que el
 * snippet toca son seis métodos, y escribirlos a mano deja ver exactamente qué
 * se está afirmando.
 */
function correrSnippet(
  snippet: string,
  { readyState = "loading" }: { readyState?: string } = {},
): Ventana {
  const agregados: ScriptFalso[] = [];
  const corridas: Array<{ websiteToken: string; baseUrl: string }> = [];
  const retrasos: number[] = [];
  const oyentes = new Map<string, Set<(...args: unknown[]) => void>>();
  const pendientes: Array<{ ms: number; fn: () => void }> = [];

  const documento = {
    readyState,
    createElement: (): ScriptFalso => ({}),
    body: {
      appendChild: (nodo: ScriptFalso) => {
        agregados.push(nodo);
      },
    },
  };

  const ventana = {
    chatwootSDK: {
      run: (opciones: { websiteToken: string; baseUrl: string }) => {
        corridas.push(opciones);
      },
    },
    addEventListener: (evento: string, fn: (...args: unknown[]) => void) => {
      if (!oyentes.has(evento)) oyentes.set(evento, new Set());
      oyentes.get(evento)!.add(fn);
    },
    removeEventListener: (evento: string, fn: (...args: unknown[]) => void) => {
      oyentes.get(evento)?.delete(fn);
    },
  };

  const setTimeoutFalso = (fn: () => void, ms: number) => {
    retrasos.push(ms);
    pendientes.push({ ms, fn });
    return 0;
  };

  // `window`, `document` y `setTimeout` entran como parámetros: sombrean los
  // globales de node, así que el snippet corre contra este DOM y no contra el
  // del proceso de test.
  new Function("window", "document", "setTimeout", snippet)(
    ventana,
    documento,
    setTimeoutFalso,
  );

  return {
    agregados,
    corridas,
    retrasos,
    disparar: (evento: string) => {
      for (const fn of [...(oyentes.get(evento) ?? [])]) fn();
    },
    avanzarReloj: (ms: number) => {
      for (const tarea of pendientes.filter((t) => t.ms <= ms)) tarea.fn();
    },
  };
}

describe("el widget de chat no viaja hasta que el visitante lo pide", () => {
  it("con la página cargada y ningún gesto, no descarga nada", () => {
    const v = correrSnippet(chatDiferidoInit);
    v.disparar("load");

    expect(v.agregados).toHaveLength(0);
  });

  it("al primer gesto trae el SDK y lo arranca con el inbox del sitio", () => {
    const v = correrSnippet(chatDiferidoInit);
    v.disparar("load");
    v.disparar("pointerdown");

    expect(v.agregados).toHaveLength(1);
    const [script] = v.agregados;
    expect(script.src).toBe(CHATWOOT_BASE_URL + CHATWOOT_SDK_PATH);
    // async + defer: el SDK nunca bloquea el parseo, ni siquiera pedido a mano.
    expect(script.async).toBe(true);
    expect(script.defer).toBe(true);

    script.onload?.();
    expect(v.corridas).toEqual([
      { websiteToken: CHATWOOT_WEBSITE_TOKEN, baseUrl: CHATWOOT_BASE_URL },
    ]);
  });

  // Los cinco gestos salen de la constante, no de una lista a mano: agregar uno
  // sin cablearlo deja este caso rojo, que es justo lo que no se ve mirando.
  it.each([...GESTOS_QUE_PIDEN_CHAT])("el gesto %s pide el chat", (gesto) => {
    const v = correrSnippet(chatDiferidoInit);
    v.disparar("load");
    v.disparar(gesto);

    expect(v.agregados).toHaveLength(1);
  });

  it("no escucha eventos que la página se dispara sola", () => {
    // Medido el 2026-09-11 sobre la portada buildeada: con `scroll` en la lista,
    // el SDK salía pedido a los 176 ms y nadie había tocado nada. El diferido
    // quedaba escrito y no existía, con este mismo archivo en verde.
    const v = correrSnippet(chatDiferidoInit);
    v.disparar("load");
    v.disparar("scroll");
    v.disparar("mousemove");

    expect(v.agregados).toHaveLength(0);
    expect(GESTOS_QUE_PIDEN_CHAT).not.toContain("scroll");
    expect(GESTOS_QUE_PIDEN_CHAT).not.toContain("mousemove");
  });

  it("un gesto ANTES del load no compite con la portada: espera al load", () => {
    const v = correrSnippet(chatDiferidoInit);
    v.disparar("wheel");
    expect(v.agregados).toHaveLength(0);

    v.disparar("load");
    expect(v.agregados).toHaveLength(1);
  });

  it("el que ya tiene la página cargada al ejecutarse el snippet no espera un load que no va a venir", () => {
    // `readyState === "complete"`: la vuelta atrás del caso anterior. Si el
    // snippet sólo mirara el evento `load`, en una navegación del router (o con
    // el script inyectado tarde) el chat no aparecería NUNCA.
    const v = correrSnippet(chatDiferidoInit, { readyState: "complete" });
    v.disparar("pointerdown");

    expect(v.agregados).toHaveLength(1);
  });

  it("muchos gestos traen UN solo SDK", () => {
    const v = correrSnippet(chatDiferidoInit);
    v.disparar("load");
    for (const gesto of GESTOS_QUE_PIDEN_CHAT) {
      v.disparar(gesto);
      v.disparar(gesto);
    }
    v.avanzarReloj(ESPERA_SIN_GESTO_MS);

    expect(v.agregados).toHaveLength(1);
  });

  it("al que lee quieto el chat le llega igual por respaldo", () => {
    const v = correrSnippet(chatDiferidoInit);
    v.disparar("load");
    expect(v.agregados).toHaveLength(0);

    v.avanzarReloj(ESPERA_SIN_GESTO_MS);
    expect(v.agregados).toHaveLength(1);
    // El respaldo es el declarado, no un número clavado adentro del snippet:
    // subir la constante sin tocar el texto dejaría el chat esperando el doble.
    expect(v.retrasos).toContain(ESPERA_SIN_GESTO_MS);
  });

  it("el respaldo tampoco se adelanta al load", () => {
    const v = correrSnippet(chatDiferidoInit);
    v.avanzarReloj(ESPERA_SIN_GESTO_MS);
    expect(v.agregados).toHaveLength(0);

    v.disparar("load");
    expect(v.agregados).toHaveLength(1);
  });
});

describe("el layout publica ESTE snippet y no una copia suya", () => {
  const layout = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "..", "app", "layout.tsx"),
    "utf8",
  );

  it("lo importa del módulo", () => {
    expect(layout).toContain("chatDiferidoInit");
    expect(layout).toMatch(/from\s+"@\/lib\/chat-diferido"/);
  });

  it("no guarda su propia copia del arranque de Chatwoot", () => {
    // Una segunda copia en el layout es como vuelve el defecto: el gate
    // seguiría verde midiendo el módulo mientras el sitio publica la otra.
    expect(layout).not.toContain(CHATWOOT_SDK_PATH);
    expect(layout).not.toContain("chatwootSDK");
    expect(layout).not.toContain(CHATWOOT_WEBSITE_TOKEN);
  });
});
