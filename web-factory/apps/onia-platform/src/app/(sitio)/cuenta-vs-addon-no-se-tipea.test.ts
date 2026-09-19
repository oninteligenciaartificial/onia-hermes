import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { CHATBOT_PLAN } from "@/content/chatbot-precios";
import { PLANES, bs, cuentaEnPalabras, cuentaVsAddon, type Plan } from "@/lib/pricing";

/**
 * Ninguna pantalla TIPEA el resultado de una CUENTA entre montos del catálogo: lo deriva.
 *
 * 🔴 **EL DEFECTO, medido el 2026-09-19 sobre `onia.com.bo/precios` SERVIDA** (texto renderizado
 * y leído, no un `grep`). La tarjeta del Completo afirmaba *«la cuenta gana comparada con
 * Profesional más el add-on»*, y la cuenta **pierde**: Profesional Bs 890 + chatbot Bs 390 son
 * Bs 1.280 contra los Bs 1.290 del Completo — Bs 10 más por mes, Bs 100 más por año. Lo decía la
 * página cuyo propio título es «PRECIOS CLAROS», al lado de las dos cifras que lo desmienten.
 *
 * 🔴 **POR QUE NINGUN GATE PODIA VERLO.** Los tres sumandos eran correctos y la suma estaba mal,
 * y ningún instrumento suma: `scripts/precios-fuente.mjs` y `npm run precios:vivos` validan que
 * cada cifra salga de la fuente —890, 390 y 1.290 salen de la fuente, las tres—;
 * `lib/capacidad-incluida.test.ts` prohíbe tipear un nombre de plan junto a una capacidad, y acá
 * el nombre ya venía interpolado; `desbloqueo-que-no-se-tipea.test.ts` y `prueba-vs-plan.test.ts`
 * cierran el cuantificador universal y el alcance total, y esta oración no afirma ninguno.
 *
 * LO QUE SE PROHIBE ES TIPEAR EL RESULTADO, NO EL LITERAL VIEJO. «No digas *la cuenta gana*» se
 * apagaría solo el día que la cuenta efectivamente gane, y puede ganar: basta que el Completo
 * baje o que el add-on suba. Las tres direcciones —más caro, igual, más barato— las decide el
 * signo (caso 4), así que el texto no puede volver a desfasarse de los montos.
 *
 * Se mide sobre el código SIN COMENTARIOS: si no, esta misma bitácora —que cita la frase falsa
 * para que se entienda— pondría el gate rojo, y borrar el registro es como falla esta familia.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
/** `src/` entero: el copy de venta vive en `app/`, `components/`, `lib/` y `content/`. */
const SRC = join(AQUI, "..", "..");

/** El único archivo autorizado a redactarla: el que la deriva. */
const DUEÑA = join("lib", "pricing.ts");

/**
 * La FORMA que envejece: afirmar una comparación de plata contra el add-on. Se ancla en el
 * comparativo, no en el veredicto, porque el veredicto es justo lo que cambia de signo.
 */
const COMPARATIVO = "(?:m[áa]s barat[oa]|m[áa]s car[oa]|sale menos|sale m[áa]s|la cuenta gana|convien[ea])";
/** Armada por concatenación a propósito: escrita entera, este archivo se acusaría solo. */
const FORMA = new RegExp(`${COMPARATIVO}[^.!?]{0,80}\\b` + "add-on" + `|\\b` + "add-on" + `[^.!?]{0,80}${COMPARATIVO}`, "i");

function archivosDeVenta(dir: string, acc: string[] = []): string[] {
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    // La convención `__loquesea__` la usan los gates que siembran su sujeto y lo borran en el
    // finally: un archivo que desaparece mientras lo leés no es superficie de cliente.
    if (/^__.+__$/.test(entrada.name)) continue;
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) {
      if (entrada.name === "node_modules" || entrada.name === ".next") continue;
      archivosDeVenta(ruta, acc);
    } else if (/\.(ts|tsx)$/.test(entrada.name)) {
      acc.push(ruta);
    }
  }
  return acc;
}

/** Comentarios en blanco conservando los saltos de línea: las bitácoras acusan y absuelven. */
function sinComentarios(codigo: string): string {
  return codigo
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/\/\/[^\n]*/g, (m) => m.replace(/[^\n]/g, " "));
}

/** Dos planes de juguete para mover la aritmética sin tocar el catálogo publicado. */
function escalera(mensualAbajo: number, mensualArriba: number): readonly Plan[] {
  const abajo = { ...PLANES[0], id: "abajo", nombre: "Abajo", mensual: mensualAbajo, chatbotIncluido: false };
  const arriba = { ...PLANES[0], id: "arriba", nombre: "Arriba", mensual: mensualArriba, chatbotIncluido: true };
  return [abajo, arriba] as unknown as readonly Plan[];
}

describe("la cuenta contra el add-on se deriva de los montos, no se tipea", () => {
  it("1. hoy el sujeto existe: hay un plan con el chatbot adentro y debajo uno que no", () => {
    const conAddonAdentro = PLANES.filter((p) => p.chatbotIncluido);
    expect(conAddonAdentro.length).toBeGreaterThan(0);

    // Ancla: si el sujeto conocido saliera del universo, este gate se apagaría en silencio.
    const cuentas = conAddonAdentro.map((p) => cuentaVsAddon(p)).filter((c) => c !== null);
    expect(cuentas.length).toBeGreaterThan(0);
  });

  it("2. lo que la tarjeta PUBLICA coincide con la suma, hecha aparte", () => {
    for (const plan of PLANES) {
      const cuenta = cuentaVsAddon(plan);
      if (!cuenta) continue;

      // La expectativa NO sale del helper: se suma acá, con el precio del add-on leído de su
      // propia fuente. Dos caminos distintos hasta el mismo número, que es lo que evita la
      // tautología de comparar el espejo contra el espejo.
      const armadoAparte = cuenta.contra.mensual + CHATBOT_PLAN.mensual;
      const deMasAparte = plan.mensual - armadoAparte;
      expect(cuenta.armado).toBe(armadoAparte);
      expect(cuenta.deMas).toBe(deMasAparte);

      // Y la prosa publicada tiene que decir esa dirección, con esa cifra.
      const publicada = plan.resultado;
      if (deMasAparte > 0) {
        expect(publicada).toContain(`Bs ${bs(deMasAparte)} más al mes`);
        expect(publicada).not.toMatch(/menos al mes|la cuenta gana/i);
      } else if (deMasAparte === 0) {
        expect(publicada).toContain("lo mismo que");
      } else {
        expect(publicada).toContain(`Bs ${bs(-deMasAparte)} menos al mes`);
        expect(publicada).not.toContain("más al mes");
      }
      expect(publicada).toContain(cuenta.contra.nombre);
    }
  });

  it("3. ninguna pantalla del sitio la tipea — sujetos caminados del disco", () => {
    const universo = archivosDeVenta(SRC);
    const sujetoConocido = join("app", "(sitio)", "precios", "page.tsx");
    // Ancla: si el caminador dejara de llegar a la pantalla de precios, esto se apagaría mudo.
    expect(universo.map((f) => relative(SRC, f))).toContain(sujetoConocido);

    const tipean = universo
      .filter((f) => relative(SRC, f) !== DUEÑA)
      .filter((f) => !f.endsWith(".test.ts") && !f.endsWith(".test.tsx"))
      .filter((f) => FORMA.test(sinComentarios(readFileSync(f, "utf8"))))
      .map((f) => relative(SRC, f));

    expect(tipean, `tipean la comparación en vez de derivarla: ${tipean.join(", ")}`).toEqual([]);
  });

  it("4. las TRES direcciones salen del signo — el caso inalcanzable hoy incluido", () => {
    // Más caro (lo de hoy): arriba 1.290 contra 890 + 390.
    const caro = cuentaVsAddon(escalera(890, 1290)[1], escalera(890, 1290), 390);
    expect(caro?.deMas).toBe(10);
    expect(cuentaEnPalabras(caro!)).toContain("Bs 10 más al mes");

    // Igual: la cuenta empata.
    const igual = cuentaVsAddon(escalera(890, 1280)[1], escalera(890, 1280), 390);
    expect(igual?.deMas).toBe(0);
    expect(cuentaEnPalabras(igual!)).toContain("lo mismo que");

    // Más barato: el día que el plan con el chatbot adentro convenga de verdad, lo dice solo.
    const barato = cuentaVsAddon(escalera(890, 1200)[1], escalera(890, 1200), 390);
    expect(barato?.deMas).toBe(-80);
    expect(cuentaEnPalabras(barato!)).toContain("Bs 80 menos al mes");
  });

  it("5. sin escalón debajo que lo compre aparte, la comparación NO se escribe", () => {
    const losDos = escalera(890, 1290).map((p) => ({ ...p, chatbotIncluido: true })) as unknown as readonly Plan[];
    expect(cuentaVsAddon(losDos[1], losDos, 390)).toBeNull();
    // Y el primero de la escalera nunca tiene contra quién compararse.
    expect(cuentaVsAddon(losDos[0], losDos, 390)).toBeNull();
  });
});
