import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  CHATBOT_SITIO,
  CIFRAS,
  CONSTANTES_CRUZADAS,
  PLANES_EN_ORDEN,
  PRECIOS_SITIO,
  CICLOS_EQUIVALENCIA,
  ciclosCruzados,
  cifrasDelProducto,
  cifrasDelSitio,
  comparar,
  esPromesa,
  excusaDeGrupoSigueValiendo,
  excusasSinSujeto,
  constantesExcusadasSinSujeto,
  CONSTANTES_VERIFICADAS_APARTE,
  leerDelProducto,
  leerDelSitio,
  limitesDelProducto,
  limitesDelSitio,
  numerosPublicados,
  planQueElSitioPrometeParaExportar,
  planesDelProducto,
  planesDelSitio,
  primerPlanCon,
  publicadosSinCruzar,
  mapaLiteral,
  nombresCruzados,
  nombresDelSitio,
} from "./precios-fuente.mjs";

/**
 * El guard de `precios-fuente.mjs`, el cruce que compara lo que el sitio
 * PUBLICA contra lo que el producto COBRA.
 *
 * Este archivo NO mide precios: los mide el script, contra el repo del producto,
 * cada vuelta. Acá se vigila lo único que puede dejar ciego a ese cruce sin que
 * nada se ponga rojo — **que sus patrones dejen de leer el lado del sitio**.
 *
 * Es la trampa de esta familia y en este carril ya costó cuatro veces: un gate
 * que no encuentra a su sujeto no grita, se calla. Si mañana alguien renombra
 * `mensualAddon` o convierte `PLANES` en otra forma, el script pasaría a leer
 * `null` de ese lado y —de no ser por su guarda de ilegibles— cantaría "ninguna
 * cifra difiere". Acá se ancla el parser a los archivos REALES del sitio: el
 * refactor rompe este test, que corre en `prebuild`, antes de romper el cruce.
 *
 * El lado del producto no se puede anclar igual: vive en otro repo
 * (`/root/loops/onia-platform`) que no está en este worktree, y exigirlo pondría
 * rojo por AMBIENTE toda máquina que no lo tenga. Se prueba con fixtures que
 * copian su forma literal.
 */

/** `precios-fuente.mjs` es JS: los mapas llegan sin firma de índice. */
type Cifras = Record<string, number | string | null | undefined>;
type Planes = Record<
  string,
  { mensual: number | null; semanal: number | null; anual: number | null }
>;

describe("el cruce lee de verdad el lado del SITIO", () => {
  const delSitio: Cifras = cifrasDelSitio({
    precios: readFileSync(PRECIOS_SITIO, "utf8"),
    chatbot: readFileSync(CHATBOT_SITIO, "utf8"),
  });

  it("encuentra todas las cifras en los archivos vivos del sitio", () => {
    const ilegibles = CIFRAS.filter((c) => delSitio[c] === null);
    expect(
      ilegibles,
      `No pude leer estas cifras de ${PRECIOS_SITIO} / ${CHATBOT_SITIO}. ` +
        `Si acabás de renombrar una constante o cambiar la forma de PLANES, ` +
        `actualizá los patrones de precios-fuente.mjs: sin eso el cruce contra ` +
        `el producto queda ciego justo en esa cifra.`,
    ).toEqual([]);
  });

  it("los planes salen del array PLANES, no de un literal suelto", () => {
    const planes = planesDelSitio(readFileSync(PRECIOS_SITIO, "utf8")) as Planes;
    // La expectativa se DERIVA de PLANES_EN_ORDEN, no se tipea: cuando entró
    // `crece` (2026-09-12) esta línea decía `["basico","full","pro"]` y se puso
    // roja acusando al sitio de publicar un plan de más. El plan nuevo ya venía
    // alineado con el producto; la que estaba vieja era la expectativa.
    expect(Object.keys(planes).sort()).toEqual(
      PLANES_EN_ORDEN.map((p) => p.sitio).sort(),
    );
    // El Full no se fracciona: si algún día tuviera semanal, el cruce lo compara igual.
    expect(planes.full.semanal).toBeNull();
    for (const p of Object.values(planes)) {
      expect(p.mensual).toBeGreaterThan(0);
      expect(p.anual).toBeGreaterThan(0);
    }
  });
});

describe("el cruce lee la forma literal del PRODUCTO", () => {
  /** Copia textual de `onia-platform/lib/subscription-plans.ts`. */
  const PLANES_FIXTURE = `
export const DEFAULT_PLAN_AMOUNTS: Record<SubscriptionPlan, PlanPriceTable> = {
  basic: { monthly: 320, weekly: 89, annual: 3200 },
  professional: { monthly: 750, weekly: 199, annual: 7500 },
  clinic: { monthly: 1500, annual: 15000 },
  enterprise: { monthly: 2900, annual: 29000 },
};
`;

  it("saca los cuatro planes con sus tres ciclos", () => {
    const p = planesDelProducto(PLANES_FIXTURE) as Planes;
    expect(p.basic).toEqual({ mensual: 320, semanal: 89, anual: 3200 });
    // `clinic` no declara semanal: ausente es `null`, no un cero que compare mal.
    expect(p.clinic).toEqual({ mensual: 1500, semanal: null, anual: 15000 });
    expect(p.enterprise.mensual).toBe(2900);
  });
});

describe("los TOPES y los TIERS del sitio (la mitad que no se cruzaba)", () => {
  const precios = readFileSync(PRECIOS_SITIO, "utf8");
  type Topes = Record<
    string,
    {
      fichas: number | null;
      usuarios: number | null;
      recordatorios: number | null;
      reservas: boolean | null;
    }
  >;

  it("lee los tres topes del Básico, que están escritos en prosa", () => {
    const l = limitesDelSitio(precios) as Topes;
    expect(l.basico.fichas).toBeGreaterThan(0);
    expect(l.basico.usuarios).toBeGreaterThan(0);
    expect(l.basico.recordatorios).toBeGreaterThan(0);
  });

  it('"ilimitado" se lee como -1, que es como lo escribe el producto', () => {
    // El Full no trae cifra ("Usuarios ilimitados"): sin este caso, el tope
    // saldría `null`, el cruce lo llamaría ilegible y taparía a los otros dos.
    const l = limitesDelSitio(precios) as Topes;
    expect(l.full.fichas).toBe(-1);
    expect(l.full.usuarios).toBe(-1);
    expect(l.full.recordatorios).toBe(-1);
  });

  it("lo que el plan NIEGA no cuenta como que lo incluye", () => {
    // La inversión que dejaría el gate verde al revés: un plan nombra la
    // capacidad en su `sinEsto` justamente para decir que NO la trae. Si el
    // parser leyera el plan entero, ese tier daría `true` y el cruce aprobaría
    // un sitio que promete lo que el producto no da.
    //
    // Va con fixture y no con el archivo vivo A PROPÓSITO: hoy el Básico
    // escribe "Reservas online — se agrega como add-on", sin la palabra
    // "incluidas", así que el patrón no lo matchea ni leyendo el plan entero.
    // Escrito contra el archivo vivo, este caso pasaba en VERDE con la guarda
    // ROTA — medido el 2026-09-06. Un texto que hoy no dispara el patrón no
    // prueba la guarda: lo que se prueba es el CORTE.
    const planQueNiega = `
      { id: "basico",
        incluye: ["2 usuarios", "Hasta 300 fichas", "200 recordatorios por email al mes"],
        sinEsto: ["Reservas online incluidas: no, eso viene desde Pro"] },
    `;
    const l = limitesDelSitio(planQueNiega) as Topes;
    expect(l.basico.usuarios).toBe(2); // el `incluye` sí se leyó
    expect(l.basico.reservas).not.toBe(true); // y el `sinEsto` no se contó
  });
});

describe("el cruce lee la forma literal de PLAN_LIMITS", () => {
  /** Copia textual de `onia-platform/lib/plan-catalogo.ts`. */
  const LIMITES_FIXTURE = `
export const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  free: { patients: 30, users: 1, emailsPerMonth: 0, publicBookingIncluded: false, agentsIncluded: false, reportsEnabled: false },
  basic: { patients: 300, users: 2, emailsPerMonth: 200, publicBookingIncluded: false, agentsIncluded: false, reportsEnabled: false },
  crece: { patients: 800, users: 4, emailsPerMonth: 400, publicBookingIncluded: true, agentsIncluded: true, reportsEnabled: false },
  professional: { patients: 1500, users: 5, emailsPerMonth: 800, publicBookingIncluded: true, agentsIncluded: true, reportsEnabled: true },
  clinic: { patients: -1, users: -1, emailsPerMonth: -1, publicBookingIncluded: true, agentsIncluded: true, reportsEnabled: true },
};
`;

  it("saca los topes, incluido el -1 de ilimitado", () => {
    const l = limitesDelProducto(LIMITES_FIXTURE) as Record<
      string,
      { fichas: number; usuarios: number; recordatorios: number }
    >;
    expect(l.basic).toMatchObject({ fichas: 300, usuarios: 2, recordatorios: 200 });
    expect(l.clinic).toMatchObject({ fichas: -1, usuarios: -1, recordatorios: -1 });
  });

  it("el tier es el plan más barato que enciende la capacidad", () => {
    const l = limitesDelProducto(LIMITES_FIXTURE);
    // Desde la escalera C (2026-09-12) el más barato que los enciende es
    // `crece`, no `professional`: es justo el dato que el sitio publica en la
    // tarjeta nueva, y si este tier se quedara en `professional` el cruce
    // acusaría al sitio por decir la verdad.
    expect(primerPlanCon(l, "reservas")).toBe("crece");
    expect(primerPlanCon(l, "agentes")).toBe("crece");
  });

  it("un tier ilegible no se adivina: devuelve null y el cruce lo canta", () => {
    // Sin esto, una capacidad renombrada en el producto se leería como
    // "ningún plan la tiene" y el gate compararía contra un dato inventado.
    const sinLaClave = LIMITES_FIXTURE.replace(/publicBookingIncluded/g, "otraCosa");
    expect(primerPlanCon(limitesDelProducto(sinLaClave), "reservas")).toBeNull();
  });
});

describe("el tier que se promete en PROSA suelta, no en la tabla de planes", () => {
  /**
   * Los otros tres tiers (agentes, reservas, reportes) viven como una fila
   * dentro del `incluye` de cada plan. La exportación de datos no: vive en
   * `CONDICIONES`, la lista de frases que las dos pantallas de precio
   * renderizan al pie. Por eso era el único tier publicado que nadie cruzaba.
   */
  const condiciones = (frase: string) => `
export const CONDICIONES: readonly string[] = [
  "Los precios están en bolivianos y no llevan IVA por encima.",
  "${frase}",
] as const;
`;

  it("«desde el plan más chico» es el más barato que el sitio VENDE", () => {
    expect(
      planQueElSitioPrometeParaExportar(
        condiciones("Tus datos son tuyos: los exportás en CSV desde el plan más chico."),
      ),
    ).toBe("basic");
  });

  it("una promesa SIN condición de plan se le hace a todos: también el más barato", () => {
    // Es la lectura estricta y la que puede desmentirla: si no dice "desde el
    // Profesional", el que paga el plan más chico la va a cobrar igual.
    expect(
      planQueElSitioPrometeParaExportar(condiciones("Tus datos son tuyos: los exportás en CSV.")),
    ).toBe("basic");
  });

  it("si la frase nombra un plan, ése — y ahí el cruce lo compara contra el producto", () => {
    expect(
      planQueElSitioPrometeParaExportar(
        condiciones("Tus datos son tuyos: los exportás en CSV desde el plan Profesional."),
      ),
    ).toBe("professional");
  });

  it("sin promesa de exportación devuelve null: rojo de instrumento, NUNCA verde", () => {
    // El modo de fallo de esta familia. Si la frase se saca o se reescribe y el
    // patrón deja de matchear, callarse haría que el cruce apruebe cualquier
    // tier del producto sin haber leído el lado del sitio.
    expect(
      planQueElSitioPrometeParaExportar(condiciones("Los planes se cobran por adelantado.")),
    ).toBeNull();
    expect(planQueElSitioPrometeParaExportar("")).toBeNull();
  });

  it("el producto contesta la misma pregunta desde csvExportEnabled", () => {
    const fixture = `
export const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  free: { csvExportEnabled: false },
  basic: { csvExportEnabled: true },
  crece: { csvExportEnabled: true },
  professional: { csvExportEnabled: true },
  clinic: { csvExportEnabled: true },
};
`;
    expect(primerPlanCon(limitesDelProducto(fixture), "exportaCsv")).toBe("basic");
    // Y el día que el producto lo suba de plan, el cruce tiene que verlo: el
    // siguiente escalón es `crece`, no `professional` — el fixture lleva los
    // MISMOS planes que `PLANES_EN_ORDEN` porque `primerPlanCon` se planta en
    // el primero que no puede leer, y uno al que le falte un plan contesta
    // `null` (verde imposible, pero también ciego).
    expect(
      primerPlanCon(
        limitesDelProducto(fixture.replace("basic: { csvExportEnabled: true", "basic: { csvExportEnabled: false")),
        "exportaCsv",
      ),
    ).toBe("crece");
  });
});

describe("un comentario no le puede mentir al cruce (las dos puertas de lectura)", () => {
  /**
   * QUÉ AGUJERO TAPA, y por qué no se ve en el veredicto.
   *
   * Todo este cruce parsea con expresiones regulares sobre el TEXTO del
   * archivo, y para una expresión regular un comentario es codigo. Rompe en las
   * DOS direcciones y la cara ya mordió: el 2026-09-10 este gate salió ROJO
   * diciendo «el producto cobra basic y el sitio publica professional» sobre un
   * sitio que decía exactamente lo correcto. Lo que leyó fue el comentario que
   * explicaba el arreglo del día anterior —«…y la prueba corre con Pro»—, que
   * queda pegado a la frase dentro del trozo que el gate juzga.
   *
   * Y el mensaje del rojo manda a «corregir el sitio»: obedecerlo era volver a
   * poner la condición que le niega al cliente sus propios datos. Un gate que
   * acusa a código sano no es ruido, es una instrucción equivocada.
   *
   * Los casos entran por `leerDelSitio` / `leerDelProducto` y NO llamando a
   * `sinComentarios`: lo que hay que sostener es el CABLEADO. Un self-check
   * puro de la función pasaría igual el día que alguien vuelva a leer con
   * `readFileSync` directo, que es como nació este agujero.
   */
  const conComentario = `
export const CONDICIONES: readonly string[] = [
  // El export no se gatea por plan; la prueba corre con Pro.
  "Tus datos son tuyos: los exportás en CSV cuando quieras, sin importar el plan.",
] as const;
`;

  it("un comentario que NOMBRA un plan no cambia el tier que el sitio promete", () => {
    // El bug del 2026-09-10, exacto. Sin limpiar, el trozo juzgado trae «Pro».
    expect(
      planQueElSitioPrometeParaExportar(leerDelSitio("x", { leer: () => conComentario })!),
    ).toBe("basic");
  });

  it("un comentario tampoco ABSUELVE: no alcanza para dar un tier por incluido", () => {
    // La dirección simétrica, la que nadie audita porque el verde no molesta.
    // `limitesDelSitio` decide el tier por quien lo NOMBRA primero.
    const basicoConComentario = `
  { id: "basico", incluye: [
      // ojo: Reportes completos y Agente Recall vienen aparte
      "2 usuarios",
    ], sinEsto: [] },
  { id: "pro", incluye: ["Reportes completos", "Agente Recall"], sinEsto: [] },
  { id: "full", incluye: ["Todo lo del Pro"], sinEsto: [] },
`;
    const limpio = leerDelSitio("x", { leer: () => basicoConComentario })!;
    const l = limitesDelSitio(limpio) as Record<
      string,
      { reportes: boolean | null }
    >;
    expect(l.basico.reportes).toBeNull();
    expect(l.pro.reportes).toBe(true);
  });

  it("un número escrito en un comentario no cuenta como publicado", () => {
    // Si contara, `publicadosSinCruzar` pediría cruzar una cifra que no existe
    // en la pantalla: rojo eterno sobre un sitio sano.
    const conCifra = `
  { id: "basico", incluye: [
      // antes eran 500 fichas
      "Hasta 300 fichas de clientes o pacientes cargadas",
    ], sinEsto: [] },
`;
    const publicados = numerosPublicados(leerDelSitio("x", { leer: () => conCifra })!);
    expect(publicados.map((n) => n.valor)).toEqual([300]);
  });

  it("`https://` no es un comentario: la limpieza respeta las comillas", () => {
    // La dirección cara de la limpieza. Comerse medio string rompería patrones
    // que hoy leen bien y el gate acusaría al sitio por su propio filtro.
    const conUrl = 'const u = "https://onia.com.bo/precios"; // fuera';
    expect(leerDelSitio("x", { leer: () => conUrl })).toBe(
      'const u = "https://onia.com.bo/precios"; ',
    );
  });

  it("la puerta del PRODUCTO limpia igual que la del sitio", () => {
    // El lado producto entra por otra función y tiene el mismo problema: un
    // comentario en `PLAN_LIMITS` que diga `csvExportEnabled: true` movería el
    // tier que se le exige al sitio.
    // El comentario va DESPUÉS del `basic:` real a propósito: `limitesDelProducto`
    // sobrescribe por clave, así que puesto ANTES lo pisa la línea buena y el
    // caso pasa con la limpieza arrancada — medido, estaba hueco así.
    const fuente = `
export const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  basic: { csvExportEnabled: false },
  // basic: { csvExportEnabled: true },
  crece: { csvExportEnabled: false },
  professional: { csvExportEnabled: true },
  clinic: { csvExportEnabled: true },
};
`;
    const limpio = leerDelProducto("x", { repo: "/y", local: () => fuente })!;
    expect(primerPlanCon(limitesDelProducto(limpio), "exportaCsv")).toBe("professional");
  });

  it("el main entra por las puertas: no vuelve a leer el sitio en crudo", () => {
    // Los casos de arriba llaman a `leerDelSitio` y por eso no pueden ver el
    // modo de falla que ORIGINÓ esto: leer con `readFileSync` directo. Es el
    // caso que mira al LLAMADOR — sin él, la limpieza queda impecable y sin uso.
    const main = readFileSync(
      join(dirname(PRECIOS_SITIO), "..", "..", "scripts", "precios-fuente.mjs"),
      "utf8",
    );
    const bloque = main.slice(main.indexOf("if (process.argv[1]"));
    expect(bloque).not.toBe("");
    expect(bloque).not.toMatch(/readFileSync\(\s*(PRECIOS_SITIO|CHATBOT_SITIO)/);
    expect(bloque).toMatch(/leerDelSitio\(\s*PRECIOS_SITIO/);
    expect(bloque).toMatch(/leerDelSitio\(\s*CHATBOT_SITIO/);
  });

  it("una fuente ausente sigue siendo `null`: no se convierte en texto vacío", () => {
    // Un `""` se leería como "leí el archivo y no dice nada" y el cruce saldría
    // VERDE sin haber medido. Tiene que llegar `null` para que salga NO PUDE MEDIR.
    expect(leerDelSitio("x", { leer: () => null })).toBeNull();
    expect(
      leerDelProducto("x", {
        repo: "/y",
        ref: () => null,
        local: () => null,
        remoto: () => null,
      }),
    ).toBeNull();
  });

  it("el lado producto se lee del REF, no de la carpeta del clon", () => {
    // Medido el 2026-09-12: `/root/loops/onia-platform` estaba 15 commits atrás
    // de `origin/master`, sin el plan `crece` y con los montos viejos. Leer la
    // CARPETA hacía que el cruce acusara al sitio de publicar mal un precio que
    // era el correcto — y ese rojo manda a "arreglar" hacia atrás, que es peor
    // que no medir. El ref lo refresca un `fetch`; la carpeta no la refresca
    // nadie. Si alguien invierte este orden, esto cae.
    expect(
      leerDelProducto("x", {
        repo: "/y",
        ref: () => "const DEL_REF = 1;",
        local: () => "const DE_LA_CARPETA = 1;",
      }),
    ).toContain("DEL_REF");
  });

  it("...pero si el ref no contesta, la carpeta y el SSH siguen sirviendo", () => {
    // La dirección opuesta: una máquina sin el clon (o sin ese ref) tiene que
    // poder medir igual. Sin este caso, "preferir el ref" podría implementarse
    // como "leer SÓLO el ref" y el carril se quedaría sin cruce al mudarse.
    expect(
      leerDelProducto("x", {
        repo: "/y",
        ref: () => null,
        local: () => null,
        remoto: () => "const POR_SSH = 1;",
      }),
    ).toContain("POR_SSH");
  });
});

describe("el veredicto", () => {
  const iguales = { "plan Básico · mensual": 320, "add-on chatbot · mensual": 390 };

  it("difieren nombra la cifra, no sólo que algo cambió", () => {
    const { difieren, ilegibles } = comparar(
      { ...iguales, "plan Básico · mensual": 350 },
      iguales,
    );
    expect(ilegibles).toContain("plan Pro · mensual"); // las que no vinieron
    expect(difieren).toContainEqual({
      cifra: "plan Básico · mensual",
      producto: 350,
      sitio: 320,
    });
  });

  it("distingue el monto de la promesa, para no mandar al archivo equivocado", () => {
    expect(esPromesa("plan Básico · mensual")).toBe(false);
    expect(esPromesa("plan Básico · fichas")).toBe(true);
    expect(esPromesa("primer plan con reservas online incluidas")).toBe(true);
  });

  it("una cifra ilegible NO se cuenta como coincidencia", () => {
    // Es el modo de fallo caro: sin esto, un parser roto se lee como sitio sano.
    const { difieren, ilegibles } = comparar(
      { "plan Básico · mensual": null },
      { "plan Básico · mensual": 320 },
    );
    expect(difieren).toEqual([]);
    expect(ilegibles).toContain("plan Básico · mensual");
  });

  it("con las dos fuentes vacías nada se declara coincidente", () => {
    const vacio = cifrasDelProducto({
      planes: "",
      addons: "",
      prueba: "",
      limites: "",
    });
    const { difieren, ilegibles } = comparar(vacio, vacio);
    expect(difieren).toEqual([]);
    expect(ilegibles).toEqual(CIFRAS);
  });
});

/**
 * La COBERTURA del cruce, que es distinta de su resultado.
 *
 * `CIFRAS` se deriva del lado PRODUCTO, así que el cruce es ciego a un número
 * que el SITIO publique sin clave del otro lado: no entra en la comparación y
 * el script imprime "VERDE: las N cifras" por encima. Medido el 2026-09-07
 * inyectando "Hasta 7 sucursales conectadas" en el `incluye` del Básico —
 * `ilegibles 0 · difieren 0`, verde.
 *
 * Estos casos exigen que un tope nuevo nazca NOMBRADO. Se validaron por
 * mutación en las dos direcciones: con `publicadosSinCruzar` devolviendo `[]`
 * los dos primeros caen, y con el filtro de ya-cruzados apagado cae el tercero
 * (los 8 números vivos saldrían como huecos).
 */
describe("ningún tope que el sitio publica queda fuera del cruce", () => {
  /**
   * Entra por `leerDelSitio` y NO por `readFileSync` — que es como estaba, y es el agujero que
   * la bitácora de más arriba describe con estas palabras: «un self-check puro pasaría igual el
   * día que alguien vuelva a leer con `readFileSync` directo, que es como nació este agujero».
   * Estaba vivo en el mismo archivo que lo advierte.
   *
   * Lo destapó el primer sujeto que le cayó encima (2026-09-18): un comentario dentro del
   * `incluye` del plan Full —explicando por qué esa línea va tercera y no quinta, porque la home
   * renderiza `incluye.slice(0, 4)`— hizo que este caso reportara «0» y «4» como cifras
   * publicadas sin cruzar. El script NO las ve (lee con `leerDelSitio`, que limpia comentarios):
   * o sea el gate acusaba al sitio por algo que en producción no pasa, y el remedio que imprime
   * —«cruzala o excusala»— mandaba a documentar en `TOPES_SIN_CRUCE` un tope inexistente. Un
   * gate que mide una fuente distinta de la que mide el producto no es estricto, es otro gate.
   */
  const real = leerDelSitio(PRECIOS_SITIO)!;

  /**
   * Ancla ESTRUCTURAL (el `incluye: [` del primer plan), no una frase. Las dos
   * inyecciones de abajo estaban pegadas al literal "Hasta 300 fichas de
   * clientes o pacientes cargadas", que la escalera C reescribió a "Topes: 300
   * fichas · 2 usuarios · …": el `replace` dejó de aplicar y los dos casos
   * pasaron a medir el archivo SIN mutar. Los salvó el `not.toEqual(real)` de
   * la línea siguiente — sin esa guarda habrían quedado verdes y mudos, que es
   * el modo de fallo que este archivo entero viene a evitar.
   */
  const inyectarEnIncluye = (fuente: string, linea: string) =>
    fuente.replace(/(id: "basico"[\s\S]*?incluye: \[\n)/, `$1      ${linea}\n`);

  it("hoy no hay ni una cifra publicada sin cruzar", () => {
    expect(
      publicadosSinCruzar(real),
      "El `incluye` de un plan publica una cifra que este cruce no mira: no está " +
        "verificada contra el producto. Cruzala, o excusala con su motivo en TOPES_SIN_CRUCE.",
    ).toEqual([]);
  });

  it("un tope NUEVO tipeado a mano sale nombrado, no en silencio", () => {
    const conTopeNuevo = inyectarEnIncluye(real, '"Hasta 7 sucursales conectadas",');
    expect(conTopeNuevo, "la inyección no se aplicó").not.toEqual(real);
    expect(publicadosSinCruzar(conTopeNuevo)).toContainEqual({
      plan: "basico",
      clase: "número",
      valor: 7,
      linea: "Hasta 7 sucursales conectadas",
    });
  });

  it("una constante NUEVA interpolada tampoco pasa por cruzada", () => {
    // La interpolación es la forma cómoda y por eso la peligrosa: se lee como
    // "sale de una constante, alguien la cuida" y no la cruza nadie.
    const conConstante = inyectarEnIncluye(real, "`Hasta ${SUCURSALES_MAX} sucursales`,");
    expect(conConstante, "la inyección no se aplicó").not.toEqual(real);
    expect(
      publicadosSinCruzar(conConstante).map((n) => n.valor),
    ).toContain("SUCURSALES_MAX");
  });

  it("el cruce sigue leyendo cifras del `incluye`: si deja de ver, esto cae", () => {
    // Sin este caso, `publicadosSinCruzar` podría devolver `[]` por no encontrar
    // NADA y los dos primeros seguirían verdes — el fallo mudo de esta familia.
    expect(numerosPublicados(real).length).toBeGreaterThanOrEqual(6);
  });

  it("ninguna excusa de TOPES_SIN_CRUCE sobra", () => {
    // Una entrada sin sujeto no la mide nadie y PRE-APRUEBA al próximo número
    // que caiga en ese valor. Ya pasó en este carril con HOSTS_PERMITIDOS.
    expect(
      excusasSinSujeto(real),
      "Sobra una excusa en TOPES_SIN_CRUCE: ningún número publicado la usa.",
    ).toEqual([]);
  });

  it("ninguna excusa de CONSTANTES_VERIFICADAS_APARTE sobra", () => {
    // Simétrico del de TOPES_SIN_CRUCE. Una constante excusada que el `incluye`
    // ya no publica queda PRE-APROBADA: el día que alguien vuelva a interpolar
    // ese nombre —con otro significado— entra en verde sin que nadie lo mire.
    expect(
      constantesExcusadasSinSujeto(real),
      "Sobra una excusa en CONSTANTES_VERIFICADAS_APARTE: ningún `incluye` publica esa constante.",
    ).toEqual([]);
  });

  it("cada constante excusada nombra un verificador que EXISTE", () => {
    // La excusa dice «esto lo cruza otro». Si ese otro no existe, la constante
    // no la mide nadie y la excusa es peor que no tenerla: detiene la auditoría.
    for (const c of CONSTANTES_VERIFICADAS_APARTE) {
      // La raíz de la app se DERIVA de PRECIOS_SITIO (…/src/lib/pricing.ts), no
      // se escribe: una ruta a mano acopla el gate al nombre del worktree.
      const raiz = join(dirname(PRECIOS_SITIO), "..", "..");
      expect(
        existsSync(join(raiz, c.cruzadaPor)),
        `CONSTANTES_VERIFICADAS_APARTE excusa ${c.valor} citando ${c.cruzadaPor}, que no existe.`,
      ).toBe(true);
    }
  });

  it("CONSTANTES_CRUZADAS no bendice una constante que el cruce ya no lee", () => {
    // Mismo riesgo que arriba, un nivel más arriba: si `cifrasDelSitio` deja de
    // leer una de estas, la lista la seguiría dando por cruzada.
    const cuerpo = cifrasDelSitio.toString();
    for (const nombre of CONSTANTES_CRUZADAS) {
      expect(cuerpo, `CONSTANTES_CRUZADAS declara ${nombre} y cifrasDelSitio no lo lee`).toContain(
        nombre,
      );
    }
  });
});

/**
 * El segundo eje del cruce: QUE CICLOS se pueden pagar.
 *
 * `comparar` mira CIFRAS, un mapa de claves escritas a mano. Ese mapa OMITE
 * `plan Full · semanal` y `Grupo / Empresarial · semanal`, y la omisión no es un
 * olvido: codifica la creencia "esos dos no se fraccionan". Mientras la creencia
 * sea cierta nadie lo nota; el día que deje de serlo no hay clave que comparar,
 * nada entra en `ilegibles` ni en `difieren`, y el script imprime VERDE con el
 * sitio publicando lo contrario.
 *
 * La disponibilidad es un BOOLEANO, no una cifra — por eso ningún cruce de
 * números puede expresarla — y es lo que decide si el checkout acepta la venta
 * (`isCycleAvailable`, y el "Solo mensual o anual" de CheckoutClient.tsx).
 */
describe("los ciclos que el sitio ofrece son los que el producto cobra", () => {
  const real = readFileSync(PRECIOS_SITIO, "utf8");
  const sitio = planesDelSitio(real) as Planes;

  /**
   * Copia la forma literal de `DEFAULT_PLAN_AMOUNTS`, que vive en el otro repo
   * (medido contra `origin/master` el 2026-09-12, no contra el clon de disco:
   * estaba 15 commits atrás y todavía decía 750/1500).
   */
  const producto = (semanalDelFull: number | null): Planes => ({
    basic: { mensual: 320, semanal: 89, anual: 3200 },
    crece: { mensual: 550, semanal: 145, anual: 5500 },
    professional: { mensual: 890, semanal: 229, anual: 8900 },
    clinic: { mensual: 1290, semanal: semanalDelFull, anual: 12900 },
  });

  it("hoy los cuatro planes comprables coinciden en los dos lados", () => {
    expect(ciclosCruzados(producto(null), sitio)).toEqual({
      ilegibles: [],
      difieren: [],
    });
  });

  it("si el producto le da semanal al Full, el sitio deja de ser cierto", () => {
    // La dirección que hoy NO ve nadie: sin clave en CIFRAS, `comparar` sigue
    // verde y el sitio le esconde al lead la forma más barata de entrar al Full.
    const { difieren } = ciclosCruzados(producto(349), sitio);
    expect(difieren).toEqual([{ plan: "Completo", producto: true, sitio: false }]);
  });

  it("y al revés: si el producto deja de fraccionar el Pro, el sitio lo sigue ofreciendo", () => {
    const p = producto(null);
    p.professional.semanal = null;
    const { difieren } = ciclosCruzados(p, sitio);
    expect(difieren).toEqual([{ plan: "Profesional", producto: false, sitio: true }]);
  });

  it("un plan que no se pudo LEER no se cuenta como «no tiene semanal»", () => {
    // `semanal: null` sólo significa "no se fracciona" si de verdad leímos el
    // plan. Con el patrón roto los dos lados dan null y el cruce coincidiría
    // consigo mismo: el modo de fallo exacto que este archivo viene a evitar.
    const p = producto(null) as Planes;
    delete p.clinic;
    const { ilegibles, difieren } = ciclosCruzados(p, sitio);
    expect(ilegibles).toEqual([{ plan: "Completo", lados: ["producto"] }]);
    expect(difieren).toEqual([]);
  });

  it("cada plan comprable del sitio entra en el cruce", () => {
    // Si mañana nace una cuarta tarjeta comprable, tiene que llegar acá: una
    // equivalencia escrita a mano es lista de inclusión y falla ABIERTA.
    expect(CICLOS_EQUIVALENCIA.map((p) => p.sitio).sort()).toEqual(
      Object.keys(sitio).sort(),
    );
  });

  it("la exención de Grupo se re-mide: vale mientras no afirme un ciclo", () => {
    expect(excusaDeGrupoSigueValiendo(real).vale).toBe(true);
    const conSemanal = real.replace(
      "export const GRUPO = {",
      'export const GRUPO = {\n  semanal: 799,',
    );
    expect(excusaDeGrupoSigueValiendo(conSemanal).vale).toBe(false);
  });
});

describe("las dos pantallas de la compra le dan el MISMO nombre a cada plan", () => {
  const real = readFileSync(PRECIOS_SITIO, "utf8");

  /**
   * Nace de un desacuerdo vivo (2026-09-17): `onia.com.bo` decía "Pro" y "Full" y
   * `app.onia.com.bo` —donde se paga— "Profesional" y "Completo". Ningún gate lo vio porque
   * todos los cruces de plata atan CIFRAS, y el sitio publicaba los Bs correctos.
   */
  it("lee el nombre de los cuatro planes del archivo REAL del sitio", () => {
    const nombres = nombresDelSitio(real) as Record<string, string | null>;
    expect(Object.keys(nombres).sort()).toEqual(
      PLANES_EN_ORDEN.map((p) => p.sitio).sort(),
    );
    for (const p of PLANES_EN_ORDEN) {
      expect(nombres[p.sitio], `no pude leer el nombre del plan ${p.sitio}`).toBeTruthy();
    }
    // El ancla del PARSER, no de los nombres: el trozo del último plan llega hasta el final del
    // archivo, donde vive `GRUPO`, que también tiene `nombre`. Con la forma literal buscada
    // aparte, GRUPO le ganaba y el gate acusaba al sitio de llamar al Full "Grupo /
    // Empresarial" — un rojo falso que manda a "arreglar" un sitio sano.
    expect(nombres.full).not.toBe("Grupo / Empresarial");
  });

  it("lee las DOS formas de escribir el nombre, no sólo la de hoy", () => {
    const conMapa = nombresDelSitio(real) as Record<string, string | null>;
    // La forma vieja (literal) tiene que seguir leyéndose: es justo la que el gate existe para
    // cazar. Un lector que sólo entiende la forma de hoy devuelve `null` ante el defecto.
    const tipeado = real.replace("nombre: NOMBRE_DE_PLAN.pro,", 'nombre: "Pro",');
    expect((nombresDelSitio(tipeado) as Record<string, string>).pro).toBe("Pro");
    expect(conMapa.pro).toBe("Profesional");
  });

  it("se pone ROJO cuando el sitio llama distinto al plan que el producto cobra", () => {
    const producto = { basic: "Básico", crece: "Crece", professional: "Profesional", clinic: "Completo" };
    const { difieren, ilegibles } = nombresCruzados(producto, {
      basico: "Básico",
      crece: "Crece",
      pro: "Pro",
      full: "Completo",
    });
    expect(ilegibles).toEqual([]);
    expect(difieren).toEqual([
      { plan: "pro", producto: "Profesional", sitio: "Pro", donde: "el sitio" },
    ]);
  });

  it("el gate también es sujeto: su propia etiqueta entra al cruce", () => {
    // `PLANES_EN_ORDEN[].etiqueta` decide a qué plan se refiere una frase del sitio
    // (`planQueElSitioPrometeParaExportar`). Con la etiqueta vieja, ese detector busca "Pro" en
    // un sitio que ya dice "Profesional" y no encuentra nada: el gate envejece solo.
    const producto = { basic: "Básico", crece: "Crece", professional: "Profesional", clinic: "Completo" };
    const sitio = { basico: "Básico", crece: "Crece", pro: "Profesional", full: "Completo" };
    const conEtiquetaVieja = PLANES_EN_ORDEN.map((p) =>
      p.sitio === "pro" ? { ...p, etiqueta: "Pro" } : p,
    );
    expect(nombresCruzados(producto, sitio, conEtiquetaVieja).difieren).toEqual([
      {
        plan: "pro",
        producto: "Profesional",
        sitio: "Pro",
        donde: "este gate (PLANES_EN_ORDEN.etiqueta)",
      },
    ]);
    // Y con las etiquetas de hoy, el mismo cruce no inventa diferencias.
    expect(nombresCruzados(producto, sitio).difieren).toEqual([]);
  });

  it("no poder leer un nombre NO es que coincidan", () => {
    const { difieren, ilegibles } = nombresCruzados(
      { basic: "Básico", crece: "Crece", professional: "Profesional", clinic: "Completo" },
      { basico: "Básico", crece: "Crece", pro: null, full: "Completo" },
    );
    expect(difieren).toEqual([]);
    expect(ilegibles).toEqual([{ plan: "pro", lados: ["el sitio"] }]);
  });

  it("el nombre del plan de la prueba se resuelve aunque pase por el mapa", () => {
    // `PRUEBA.planQueCorre` → `PRUEBA_PLAN` → `NOMBRE_DE_PLAN.pro`: dos saltos. Sin el segundo,
    // el cruce sale NO PUDE MEDIR por un cambio que no mueve ni un dato (medido al escribirlo).
    expect(mapaLiteral(real, "NOMBRE_DE_PLAN")).toMatchObject({ pro: "Profesional" });
    const cifras = cifrasDelSitio({
      precios: real,
      chatbot: readFileSync(CHATBOT_SITIO, "utf8"),
    }) as Cifras;
    expect(cifras["prueba gratis · plan que corre"]).toBe("professional");
  });
});
