import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { comoAparece, sinComentarios } from "./monto-en-el-codigo.mjs";

const RAIZ = join(__dirname, "..");

/**
 * Los tres literales REALES que el 2026-09-12 hicieron que `precios-vivos.mjs`
 * acusara al codigo de escribir `Bs 1.500` a mano. Se citan tal como estan en el
 * arbol: si el gate vuelve a leer el numero desnudo, estos tres se ponen rojos.
 */
const FALSOS = [
  {
    de: "src/app/v1/empezar/data.ts",
    // Un tope de fichas del plan, en la MISMA linea que un precio de verdad: la
    // vecindad amplia («hay un Bs cerca») tambien lo daria por precio.
    texto:
      'pro: `Bs ${bs(plan("pro").mensual)}/mes — 5 usuarios y hasta 1.500 fichas. ${ciclos(plan("pro"))}`,',
  },
  {
    de: "src/lib/pricing.ts",
    texto: '"Topes: 1.500 fichas · 5 usuarios · 800 recordatorios por email/mes",',
  },
  {
    de: "src/motion/agent-scene.tsx",
    texto: "const STEP_HOLD_MS = [900, 1500, 1600, 1300, 2800] as const;",
  },
];

describe("un numero no es un precio por ser el mismo numero", () => {
  it.each(FALSOS)("$de: 1.500 esta, pero no como plata", ({ texto }) => {
    // 'numero' y no 'no': la ocurrencia se sigue NOMBRANDO. Perderla seria cambiar
    // un falso rojo por un falso verde.
    expect(comoAparece(texto, 1500)).toBe("numero");
  });

  it("los tres archivos vivos siguen sin declarar 1.500 como precio", () => {
    // El caso de arriba con los archivos de verdad: si manana alguien escribe el
    // precio a mano ahi, este pasa a 'precio' y el gate vuelve a acusar — con razon.
    for (const { de } of FALSOS) {
      const txt = readFileSync(join(RAIZ, de), "utf8");
      expect(comoAparece(txt, 1500), de).not.toBe("precio");
    }
  });
});

describe("un precio escrito a mano SI se acusa", () => {
  it.each([
    ["moneda adelante", "<p>Bs 1.500 / mes</p>"],
    ["moneda atras", "<p>1.500 Bs / mes</p>"],
    ["sin periodicidad", "aria-label={`Bs 1.500`}"],
    // Caso ancla contra reimplementar la nocion de precio con un `/Bs \d+/` propio en
    // vez de importar `montosVisibles`: solo ella admite el salto de linea entre el
    // numero y su moneda.
    ["moneda en el renglon de abajo", "`1.500\nBs / mes`"],
  ])("%s", (_c, texto) => {
    expect(comoAparece(texto, 1500)).toBe("precio");
  });
});

describe("el limite conocido, escrito", () => {
  /**
   * `montosVisibles` lee texto RENDERIZADO: en el DOM, un precio partido en dos nodos
   * llega como `1.500\nBs / mes` y se reconoce. En el CODIGO hay markup en el medio
   * (`</span><span>`) y deja de reconocerse.
   *
   * Se deja asi A PROPOSITO. Tolerar N caracteres entre el numero y la moneda es
   * exactamente lo que devuelve el falso positivo que este modulo existe para matar:
   * en `data.ts` el tope `hasta 1.500 fichas` vive en la MISMA linea que un
   * `Bs ${...}/mes`, a 45 caracteres. Preferir el falso 'numero' al falso 'precio'
   * tiene consecuencias distintas: el monto se sigue reportando en rojo y su archivo
   * se sigue nombrando; lo unico que se pierde es la frase de causa.
   */
  it("un precio partido por markup se NOMBRA igual, aunque no se llame precio", () => {
    expect(comoAparece("<span>1.500</span><span>Bs / mes</span>", 1500)).toBe("numero");
  });
});

describe("los comentarios no acusan ni absuelven", () => {
  it("un comentario que narra la escalera vieja no es un precio publicado", () => {
    const texto = " * 790/1.500/2.900 era una oferta de ARRANQUE vencida el 31-jul-2026.\n";
    expect(comoAparece(`/**\n${texto} */\n`, 1500)).toBe("no");
  });

  it("blanquear conserva los renglones: el informe puede contar lineas", () => {
    const limpio = sinComentarios("const a = 1;\n// Bs 1.500 viejo\nconst b = 2;\n");
    expect(limpio.split("\n")).toHaveLength(4);
    expect(limpio).not.toContain("1.500");
  });

  it("un precio a mano NO se escapa por tener un comentario en la linea de arriba", () => {
    const texto = "// el plan Completo\nconst copy = 'Bs 1.500 / mes';\n";
    expect(comoAparece(texto, 1500)).toBe("precio");
  });
});

describe("limites de digito", () => {
  it("790 no matchea dentro de 7.900", () => {
    expect(comoAparece("const tope = 7900;", 790)).toBe("no");
  });

  it("el mismo numero se reconoce con y sin separador de miles", () => {
    expect(comoAparece("const fichas = 1500;", 1500)).toBe("numero");
    expect(comoAparece("const fichas = 1.500;", 1500)).toBe("numero");
  });
});
