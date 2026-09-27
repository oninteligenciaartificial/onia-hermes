import { describe, expect, it } from "vitest";

import {
  aNumero,
  escaleraDeclarada,
  fallasDeUnidadPartida,
  fallasDelSegundoTurno,
  porMesDeUnAnual,
} from "./precio-tras-el-clic.mjs";

/**
 * El self-check del gate del SEGUNDO TURNO del precio.
 *
 * Lo que mide el `.mjs` vive contra produccion y por eso corre como alias suelto. Lo que
 * se prueba aca es su CRITERIO, que es puro: dado lo declarado y lo que se vio en pantalla,
 * ¿acusa lo que tiene que acusar y calla lo que esta bien?
 *
 * La trampa que este archivo existe para tapar: un gate que solo sabe decir "verde" cuando
 * todo coincide es indistinguible de uno que no mide. Cada caso de abajo le pone delante un
 * defecto REAL que ya podria estar vivo, y exige que lo nombre.
 */
describe("el precio que aparece recien tras el clic", () => {
  const declarada = [
    { mensual: 320, anual: 3200 },
    { mensual: 550, anual: 5500 },
    { mensual: 890, anual: 8900 },
    { mensual: 1290, anual: 12900 },
  ];

  it("lee la escalera del disco y no de una lista escrita a mano", () => {
    const real = escaleraDeclarada();
    expect(real.length).toBeGreaterThanOrEqual(4);
    expect(real.map((p) => p.mensual)).toEqual(expect.arrayContaining([320, 550, 890, 1290]));
    expect(real.map((p) => p.anual)).toEqual(expect.arrayContaining([3200, 5500, 8900, 12900]));
  });

  /**
   * Lo encontro la PRIMERA corrida viva, no el escritorio: el add-on se pinta con el mismo
   * tamaño que un plan, asi que un universo que solo mira la escalera acusa `Bs 390` como
   * precio inventado. Este caso fija la correccion — si alguien vuelve a angostar el
   * universo, el gate acusa al add-on y se vuelve ruido.
   */
  it("mete el add-on en el universo: el lead lo ve igual de grande que un plan", () => {
    const real = escaleraDeclarada();
    expect(real.map((p) => p.mensual)).toContain(390);
    expect(real.map((p) => p.anual)).toContain(3900);
    expect(
      fallasDelSegundoTurno({
        declarada: real,
        mensualesVistos: [320, 550, 890, 1290, 390],
        anualesVistos: [3200, 5500, 8900, 12900, 390],
        porMesVistos: [267, 458, 742, 1075],
      }),
    ).toEqual([]);
  });

  it("no toma por precio un monto que solo vive en un comentario", () => {
    const conNotaVieja = `
      // historico: mensual: 750, anual: 7500 — la escalera de antes del 12-sep
      const ESCALERA = [{ mensual: 320, anual: 3200, }];
    `;
    expect(escaleraDeclarada(conNotaVieja)).toEqual([{ mensual: 320, anual: 3200 }]);
  });

  it("Bs 3.200 del sitio y 3200 de la fuente son el mismo numero", () => {
    expect(aNumero("3.200")).toBe(3200);
    expect(aNumero("12.900")).toBe(12900);
    expect(aNumero("320")).toBe(320);
  });

  it("el unico 'por mes' honesto sobre un total anual es el doceavo", () => {
    expect(porMesDeUnAnual(3200)).toBe(267);
    expect(porMesDeUnAnual(5500)).toBe(458);
    expect(porMesDeUnAnual(8900)).toBe(742);
    expect(porMesDeUnAnual(12900)).toBe(1075);
  });

  it("calla cuando el segundo turno es fiel a la fuente", () => {
    expect(
      fallasDelSegundoTurno({
        declarada,
        mensualesVistos: [320, 550, 890, 1290],
        anualesVistos: [3200, 5500, 8900, 12900],
        porMesVistos: [267, 458, 742, 1075],
      }),
    ).toEqual([]);
  });

  it("acusa un precio ANUAL que el producto no cobra", () => {
    const fallas = fallasDelSegundoTurno({
      declarada,
      mensualesVistos: [320],
      anualesVistos: [3200, 7500],
      porMesVistos: [267],
    });
    expect(fallas).toHaveLength(1);
    expect(fallas[0]).toMatch(/7500/);
    expect(fallas[0]).toMatch(/no lo cobra/);
  });

  /**
   * El add-on se cobra por mes y NO cambia con el toggle: con Anual puesto sigue diciendo
   * "390". Es copy sano. Un gate que lo acusara se apagaria en una semana.
   */
  it("no acusa al add-on por seguir mostrando su precio mensual con el toggle en Anual", () => {
    expect(
      fallasDelSegundoTurno({
        declarada: [...declarada, { mensual: 390, anual: 3900 }], // el add-on, declarado
        mensualesVistos: [320, 390],
        anualesVistos: [3200, 390],
        porMesVistos: [267],
      }),
    ).toEqual([]);
  });

  /**
   * Y el reverso, que es el que protege la plata: si el toggle deja de responder, el cuadro
   * queda IGUAL. Ahi no hay monto inventado que delate nada — el unico sintoma es que nada
   * cambio.
   */
  it("acusa un toggle que responde pero no cambia ni un monto", () => {
    const fallas = fallasDelSegundoTurno({
      declarada,
      mensualesVistos: [320, 550, 890, 1290],
      anualesVistos: [320, 550, 890, 1290],
      porMesVistos: [],
    });
    expect(fallas).toHaveLength(1);
    expect(fallas[0]).toMatch(/no cambio ni un monto/);
  });

  /**
   * El caso que motivo el gate: nadie escribe mal este numero, se CALCULA mal. Con
   * `anual/10` en vez de `anual/12`, el Basico se ofrece a "Bs 320 por mes" pagando el
   * año — el mismo precio que el mensual, o sea el descuento desaparece de la pantalla
   * sin que ningun monto declarado cambie.
   */
  it("acusa un equivalente mensual DERIVADO mal, aunque todos los montos sean legitimos", () => {
    const fallas = fallasDelSegundoTurno({
      declarada,
      mensualesVistos: [320, 550, 890, 1290],
      anualesVistos: [3200, 5500, 8900, 12900],
      porMesVistos: [320, 550, 890, 1290], // anual/10: cada uno existe en la fuente, y aun asi miente
    });
    expect(fallas).toHaveLength(4);
    expect(fallas[0]).toMatch(/por mes/);
    expect(fallas[0]).toMatch(/267/);
  });

  /**
   * Un toggle que deja de responder no deja rastro: la pantalla sigue entera y los montos
   * mensuales siguen bien. Si el gate se callara aca, el lead no podria llegar nunca al
   * precio anual y el carril lo veria verde para siempre.
   */
  it("no se calla cuando el clic no cambio nada", () => {
    const fallas = fallasDelSegundoTurno({
      declarada,
      mensualesVistos: [320, 550, 890, 1290],
      anualesVistos: [],
      porMesVistos: [],
    });
    expect(fallas).toHaveLength(1);
    expect(fallas[0]).toMatch(/no cambio nada/);
  });

  /** Sin sujetos no hay veredicto: "ninguna falla" sobre cero planes se lee como sano. */
  it("se niega a dar por sano un barrido sin planes declarados", () => {
    const fallas = fallasDelSegundoTurno({
      declarada: [],
      mensualesVistos: [320],
      anualesVistos: [3200],
      porMesVistos: [267],
    });
    expect(fallas).toHaveLength(1);
    expect(fallas[0]).toMatch(/NI UN plan/);
  });
});

/**
 * El otro defecto del segundo turno: el precio es CORRECTO y aun asi se lee mal.
 *
 * El caso vivo, medido en produccion el 2026-09-27 a 1366px: con el interruptor en Anual,
 * la tarjeta "Completo" pinta `12.900` (178px) y ya no le queda lugar para `Bs / año`
 * (60px) en una fila de 216px. La unidad se encoge a 32px y su texto se parte: "Bs /"
 * arriba, "año" abajo.
 *
 * Por que el criterio es el ANCHO y no la cantidad de renglones: la unidad es hijo de un
 * contenedor flex, o sea un bloque, y `getClientRects().length` devuelve 1 aunque su texto
 * ocupe dos renglones. Se comprobo sobre la unidad partida: devolvia 1. Un gate construido
 * sobre esa señal sale verde encima del defecto.
 */
describe("la unidad del precio, entera", () => {
  const entera = { texto: "Bs / año", ciclo: "anual", num: "3.200", ancho: 60, natural: 60 };

  it("acusa la unidad que el navegador tuvo que partir", () => {
    const fallas = fallasDeUnidadPartida([
      entera,
      { texto: "Bs / año", ciclo: "anual", num: "12.900", ancho: 32, natural: 60 },
    ]);
    expect(fallas).toHaveLength(1);
    expect(fallas[0]).toMatch(/12\.900/);
    expect(fallas[0]).toMatch(/32px de los 60px/);
  });

  /** Una unidad que entra justa no es un defecto: el subpixel no puede inventar rojos. */
  it("calla sobre unidades que entran, aunque el ancho no coincida al decimal", () => {
    expect(
      fallasDeUnidadPartida([entera, { ...entera, num: "5.500", ancho: 59.4, natural: 60 }]),
    ).toEqual([]);
  });

  /**
   * El modo de falla que ya mordio a este carril: si alguien renombra la clase o cambia el
   * markup, el lector se queda sin sujetos. "Cero unidades, cero fallas" se lee identico a
   * "todo bien" — y entonces el gate deja de medir sin ponerse rojo ni una vez.
   */
  it("se niega a dar por sana una banda donde no encontro ni una unidad", () => {
    const fallas = fallasDeUnidadPartida([]);
    expect(fallas).toHaveLength(1);
    expect(fallas[0]).toMatch(/NI UNA unidad/);
  });
});
