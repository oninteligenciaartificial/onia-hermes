import { describe, expect, it } from "vitest";

import {
  ESTADO_DE_LIMITE,
  MINIMO_PANTALLAS,
  OPACIDAD_PINTADA,
  baseValida,
  esDefecto,
  veredicto,
} from "./mirar-primera-pantalla.mjs";

/**
 * El gate del gate: que `mirar-primera-pantalla.mjs` no pueda fallar ABIERTO.
 *
 * Nace de un suceso medido el 2026-09-05 02:56 La Paz. Los cuatro números del
 * objetivo de este carril daban verde —prohibidos 0, precios fuera de fuente 0,
 * CTA rotos 0 sobre 26 enlaces, favicon 200— y los 366 tests de la app pasaban.
 * Y aun así, en las CUATRO pantallas que mira este script (portada y `/empezar`,
 * escritorio y teléfono) producción cargaba con un 429:
 *
 *   !! 429 https://onia-chatbot-chatwoot.hqdqgh.easypanel.host/widget?website_token=…
 *
 * El script lo VIO —lo imprimió cuatro veces, `4xx/5xx=1` en cada línea— y salió
 * con código 0. Era un reporter, no un gate: nada podía ponerse rojo, así que
 * cualquier cosa que pasara ahí quedaba a la espera de que un humano leyera la
 * salida.
 *
 * Y el desenlace es la otra mitad de la lección, porque casi se reporta al revés:
 * ese 429 NO era un defecto del sitio. Medido pidiendo el widget 20 veces
 * seguidas —`1:200 2:200 3:200 4:429 …`— corta al CUARTO pedido por IP, y este
 * script abre justo cuatro pantallas: se lo provocaba solo. Un lead abre la
 * página una vez y recibe 200. Así que el gate distingue lo que puede atribuir
 * (todo lo demás: rojo) de lo que no (el 429 de un tercero: AVISO con el comando
 * para medirlo en frío), en vez de gritar sobre algo que no sabe.
 *
 * Por qué ningún otro gate podría ver algo así, y por eso el arreglo va acá: el
 * widget no es un `<a href>`, así que `enlaces-vivos.mjs` y el barrido de CTA no
 * lo alcanzan; la página responde 200, así que el chequeo de rutas tampoco; y no
 * es un literal, así que ninguno de los tests de código fuente lo toca. Sólo lo
 * ve quien ABRE la página y escucha lo que pide.
 */
type Fallida = { status: number; url: string };

const rota = (status: number, url: string): Fallida => ({ status, url });
/** El 429 de un tercero: este barrido se lo provoca solo, no es atribuible. */
const limiteDeTercero = (url: string): Fallida => ({ status: 429, url });

describe("mirar-primera-pantalla: el veredicto", () => {
  const pantalla = (extra: Record<string, unknown> = {}) => ({
    ruta: "/",
    pantalla: "escritorio",
    archivo: "/tmp/x.png",
    h1: "Cerrás vos. El negocio no.",
    opacidadH1: 1,
    kicker: { medible: true, texto: "UN SOLO SISTEMA", fontSize: 12.8, lineas: 1, dx: 7.7 },
    fallidas: [] as Fallida[],
    ...extra,
  });

  const cuatroSanas = [
    pantalla(),
    pantalla({ ruta: "/empezar" }),
    pantalla({ pantalla: "telefono" }),
    pantalla({ ruta: "/empezar", pantalla: "telefono" }),
  ];

  it("da VERDE cuando las cuatro pantallas pintan y no piden nada roto", () => {
    const r = veredicto(cuatroSanas);
    expect(r.codigo).toBe(0);
  });

  /**
   * El caso REAL del 2026-09-05, y por qué NO es rojo. El script imprimió cuatro
   * veces `!! 429 …/widget?…` y salió en 0. Al medirlo: el widget de Chatwoot
   * corta al CUARTO pedido por IP (`1:200 2:200 3:200 4:429 …`), y este script
   * abre justo cuatro pantallas — se lo provocaba solo. Un lead abre la página
   * UNA vez y recibe 200.
   *
   * Así que sale como AVISO: el defecto no era del sitio, era que el gate no
   * juzgaba. Ponerlo rojo habría sido el vigía que grita mal, al que Sergio dejó
   * de creerle con razón.
   */
  it("el 429 de un tercero sale como AVISO, no como rojo: no es atribuible", () => {
    const w = limiteDeTercero(
      "https://onia-chatbot-chatwoot.hqdqgh.easypanel.host/widget?website_token=9k5i7xnAgCbSse1EZwVChZLw",
    );
    const r = veredicto(
      [
        pantalla({ fallidas: [w] }),
        pantalla({ ruta: "/empezar", fallidas: [w] }),
        pantalla({ pantalla: "telefono", fallidas: [w] }),
        pantalla({ ruta: "/empezar", pantalla: "telefono", fallidas: [w] }),
      ],
      "https://onia.com.bo",
    );
    expect(r.codigo).toBe(0);
    expect(r.lineas.join("\n")).toContain("AVISO");
    // Y no se lo calla: quedarse mudo sobre lo que no supo clasificar es la
    // otra forma de fallar abierto. Deja el comando para medirlo en frío.
    expect(r.lineas.join("\n")).toContain("/widget");
    expect(r.lineas.join("\n")).toContain("curl");
  });

  /**
   * La otra mitad de la misma regla: sobre NUESTRO origen no hay duda que
   * conceder. Los límites de onia.com.bo los ponemos nosotros, así que un 429
   * propio es un defecto de verdad.
   */
  it("el 429 de NUESTRO propio origen sí es rojo", () => {
    const r = veredicto(
      [
        ...cuatroSanas.slice(0, 3),
        pantalla({ fallidas: [{ status: 429, url: "https://onia.com.bo/api/algo" }] }),
      ],
      "https://onia.com.bo",
    );
    expect(r.codigo).not.toBe(0);
  });

  /**
   * El 429 es la ÚNICA excepción, y se prueba por el borde: un 404 o un 503 de
   * un tercero son rojo, porque no se los provoca un barrido — no se arreglan
   * pidiendo menos.
   */
  it("solo el 429 recibe el beneficio de la duda; los demás estados no", () => {
    const base = "https://onia.com.bo";
    expect(ESTADO_DE_LIMITE).toBe(429);
    expect(esDefecto(limiteDeTercero("https://tercero.example/w"), base)).toBe(false);
    for (const s of [404, 403, 500, 503]) {
      expect(esDefecto(rota(s, "https://tercero.example/w"), base)).toBe(true);
    }
  });

  it("da ROJO aunque la pantalla rota sea UNA sola de las cuatro", () => {
    const r = veredicto([
      ...cuatroSanas.slice(0, 3),
      pantalla({ ruta: "/empezar", pantalla: "telefono", fallidas: [rota(503, "https://onia.com.bo/_next/static/chunks/x.js")] }),
    ]);
    expect(r.codigo).not.toBe(0);
  });

  /**
   * Un 5xx de un chunk deja la página EN BLANCO y ya nos costó una vuelta
   * entera (2026-09-03: `/precios` midió 844 px en vez de 6.016). Salvo el 429
   * —la única excepción, y por incapacidad del instrumento, no por indulgencia—
   * de quién sea el servidor no cambia nada: el lead ve lo mismo en los dos
   * casos, así que no hay lista de perdonados por dominio.
   */
  it("no perdona por dominio: un recurso caído es rojo sea nuestro o de un tercero", () => {
    const propio = veredicto([pantalla({ fallidas: [rota(404, "https://onia.com.bo/_next/static/chunks/608.js")] })]);
    const ajeno = veredicto([pantalla({ fallidas: [rota(503, "https://tercero.example/widget")] })]);
    expect(propio.codigo).not.toBe(0);
    expect(ajeno.codigo).not.toBe(0);
  });

  /**
   * La otra mitad de la pantalla: el h1 que nunca terminó de aparecer. El script
   * ya medía la opacidad heredada y también la ignoraba al salir.
   */
  it("da ROJO cuando el título no llegó a pintarse", () => {
    const r = veredicto([pantalla({ opacidadH1: 0 })]);
    expect(r.codigo).not.toBe(0);
    expect(r.lineas.join("\n")).toMatch(/opacidad/i);
  });

  it("da ROJO cuando no encontró el h1 (el selector devolvió -1)", () => {
    const r = veredicto([pantalla({ opacidadH1: -1 })]);
    expect(r.codigo).not.toBe(0);
  });

  /**
   * La trampa de esta familia, y la razón por la que `precios-vivos.mjs` exige
   * un mínimo: si el recorrido no llega a medir NADA, «ninguna pantalla falló»
   * se lee como éxito. Un recorrido que se corta es instrumento roto, no sitio
   * sano.
   */
  /**
   * El defecto real del 2026-09-24, medido en producción con teléfono de 390 px:
   * el rótulo de la portada —"UN SOLO SISTEMA PARA TODO EL NEGOCIO"— parte en
   * dos líneas dentro de un bloque centrado, y el punto verde se quedaba contra
   * el borde izquierdo mientras el texto se centraba: **44 px de vacío** entre
   * el punto y su propia etiqueta, en la PRIMERA pantalla que ve un lead.
   *
   * Los cuatro números del objetivo del carril daban verde ese día (prohibidos
   * 0, precios fuera de fuente 0, CTA rotos 0, favicon 200) y los tests de copy
   * también: `hero.test.ts` lee el TEXTO del titular, y este defecto no cambia
   * una letra. Sólo lo ve quien mide la geometría de lo pintado.
   */
  it("da ROJO cuando el punto del rótulo quedó lejos de su etiqueta", () => {
    const r = veredicto([
      pantalla({
        pantalla: "telefono",
        kicker: {
          medible: true,
          texto: "UN SOLO SISTEMA PARA TODO EL NEGOCIO",
          fontSize: 12.8,
          lineas: 2,
          dx: 44,
        },
      }),
    ]);
    expect(r.codigo).toBe(1);
    expect(r.lineas.join("\n")).toContain("punto del rotulo quedo suelto");
    expect(r.lineas.join("\n")).toContain("44 px de hueco");
  });

  /**
   * El tope es generoso a propósito: `0.6em` pide el CSS y se perdona hasta el
   * doble, así que un ajuste de espaciado no pinta rojo. Lo que no se perdona
   * es un hueco que se vea.
   */
  it("no pinta rojo por un espaciado apenas distinto del que pide el CSS", () => {
    const r = veredicto(
      cuatroSanas.map((p) => ({
        ...p,
        kicker: { medible: true, texto: "EMPEZÁ", fontSize: 12.8, lineas: 1, dx: 12 },
      })),
    );
    expect(r.codigo).toBe(0);
  });

  /**
   * Producción corre un build anterior al `<span>`: ahí el punto es un
   * `::before` y `getBoundingClientRect` no lo alcanza. Eso NO es verde —el
   * defecto puede estar vivo— ni rojo —no se midió nada—: sale 2, que es el
   * código con el que el resto de los gates del carril dice NO MEDIDO.
   */
  it("sale NO MEDIDO (2), no verde, cuando el punto no tiene caja que medir", () => {
    const r = veredicto(
      cuatroSanas.map((p) => ({
        ...p,
        kicker: { medible: false, texto: "UN SOLO SISTEMA", fontSize: 12.8 },
      })),
    );
    expect(r.codigo).toBe(2);
    expect(r.lineas.join("\n")).toContain("NO MEDIDO");
  });

  /**
   * `null` es una respuesta ("esta pantalla no tiene rótulo"); que el campo no
   * llegue es que el instrumento dejó de preguntar, y ese es el modo en que
   * este gate fallaría abierto: seguiría dando verde sobre un dato que no tomó.
   */
  it("distingue una pantalla sin rótulo de una medición que no se hizo", () => {
    expect(veredicto(cuatroSanas.map((p) => ({ ...p, kicker: null }))).codigo).toBe(0);
    const sinPreguntar = veredicto(cuatroSanas.map((p) => ({ ...p, kicker: undefined })));
    expect(sinPreguntar.codigo).toBe(1);
    expect(sinPreguntar.lineas.join("\n")).toContain("sin la medicion del rotulo");
  });

  it("da ROJO con un informe vacío en vez de leer el silencio como éxito", () => {
    expect(veredicto([]).codigo).not.toBe(0);
  });

  it("da ROJO si midió menos pantallas de las que declara mirar", () => {
    expect(MINIMO_PANTALLAS).toBeGreaterThan(1);
    const r = veredicto(cuatroSanas.slice(0, MINIMO_PANTALLAS - 1));
    expect(r.codigo).not.toBe(0);
  });
});

/**
 * El segundo agujero de la misma vuelta, y el más barato de caer: la base salía
 * de `process.argv[2]` sin validar, así que
 * `node scripts/mirar-primera-pantalla.mjs --out=/tmp/x` tomaba la BANDERA como
 * URL. Y el defecto por defecto: sin argumento apuntaba a `127.0.0.1:3111`, que
 * es exactamente el `next start` local que el 2026-09-04 sirvió un build viejo
 * sin avisar. Un script cuyo trabajo es mirar producción no puede tener como
 * blanco por defecto un puerto de la máquina.
 */
describe("mirar-primera-pantalla: la base", () => {
  it("acepta producción y un servidor local explícito", () => {
    expect(baseValida("https://onia.com.bo")).toBe("https://onia.com.bo");
    expect(baseValida("http://127.0.0.1:3111")).toBe("http://127.0.0.1:3111");
  });

  it("le saca la barra final para que las rutas no queden con doble barra", () => {
    expect(baseValida("https://onia.com.bo/")).toBe("https://onia.com.bo");
  });

  it("RECHAZA una bandera mal tipeada en vez de navegar hacia ella", () => {
    expect(() => baseValida("--out=/tmp/primera")).toThrow();
    expect(() => baseValida("--base=https://onia.com.bo")).toThrow();
  });

  it("RECHAZA lo que no es http(s)", () => {
    expect(() => baseValida("onia.com.bo")).toThrow();
    expect(() => baseValida("file:///tmp/x.html")).toThrow();
  });

  it("sin argumento mira PRODUCCIÓN, no un puerto de esta máquina", () => {
    expect(baseValida(undefined)).toBe("https://onia.com.bo");
  });
});

describe("mirar-primera-pantalla: el umbral de pintado", () => {
  /**
   * `waitForFunction` ya esperaba `>= 0.99`; el veredicto tiene que usar el
   * MISMO número, o el script espera una cosa y juzga otra.
   */
  it("juzga con el mismo umbral con el que espera", () => {
    expect(OPACIDAD_PINTADA).toBe(0.99);
    const justo = (n: number) =>
      Array.from({ length: MINIMO_PANTALLAS }, (_, i) => ({
        ruta: "/",
        pantalla: `p${i}`,
        archivo: "",
        h1: "x",
        opacidadH1: n,
        kicker: null,
        fallidas: [] as Fallida[],
      }));
    // Justo en el umbral pasa; un pelo por debajo, no.
    expect(veredicto(justo(OPACIDAD_PINTADA)).codigo).toBe(0);
    expect(veredicto(justo(OPACIDAD_PINTADA - 0.01)).codigo).not.toBe(0);
  });
});
