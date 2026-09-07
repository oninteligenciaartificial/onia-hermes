import { describe, expect, it } from "vitest";

import { PAGINAS, archivoDe, cadenaHastaTexto } from "./rutas";

/**
 * Ninguna pantalla que el sitio SIRVE dice, en su CUERPO, que algo está por venir.
 *
 * Es la regla de Sergio del 2026-08-20 —*"no entiendo por qué dices si es que estamos
 * construyendo algo que aún no está listo… hace escapar a los clientes porque hacen
 * creer que el sistema no funciona. Como regla nunca hagas eso"*—, dicha sobre los
 * CINCO «muy pronto» que tenía la banda de Módulos de la landing. Es la regla que da
 * nombre a «La venta nunca exhibe obra» en `CLAUDE.md`.
 *
 * POR QUÉ HACÍA FALTA, y es incómodo: la frase que da nombre a la regla no tenía gate.
 * Medido el 2026-09-07 por mutación, que es lo que lo vuelve un hecho y no un
 * argumento: se inyectó `titulo: "Capacitación de equipos (muy pronto)"` en
 * `app/servicios/consultoria/page.tsx` —una página que producción sirve con 200 y que
 * está enlazada desde el pie de TODAS las páginas del sitio— y la suite entera pasó
 * **verde: 44 archivos, 759 tests**. Los dos gates hermanos no podían verlo, cada uno
 * por su motivo, y los dos motivos son correctos:
 *
 *  - `obra.test.ts` mira la **metadata**, no el cuerpo. Nació del `<head>` de
 *    `/terminos`, que es la superficie que no se ve mirando.
 *  - `obra-en-el-cuerpo.test.ts` mira el cuerpo, pero persigue **símbolos** con nombre
 *    (`TODAVIA_NO`, `CONTENDIENTES`) y un patrón que anuncia una carencia. Esa es la
 *    forma CÓMODA del defecto: la lista de huecos puesta en una sección, con título.
 *
 * O sea que el literal desnudo —dos palabras tipeadas dentro de cualquier dato— caía
 * justo en el hueco entre los dos, y cada gate tenía razón por separado. Es el mismo
 * modo de falla que ya mordió a este carril con las raíces escritas a mano de
 * `precios.test.ts` (dejaban afuera `app/v1/**`), un nivel más adentro: acá el sujeto
 * estaba bien y lo que faltaba era la PREGUNTA.
 *
 * ⚠️ **Y no alcanzaba con la medición del objetivo del carril.** Ese `grep -ciE "muy
 * pronto|…"` corre contra el HTML de `onia.com.bo`, o sea contra el build DESPLEGADO.
 * El 2026-09-07 producción servía el build del 2026-09-04 con 28 arreglos varados
 * detrás: un «muy pronto» commiteado hoy no aparecería en esa medición hasta que
 * alguien publique, días después. Una medida que vive del otro lado del deploy no
 * puede cuidar lo que uno acaba de escribir.
 *
 * CÓMO NO FALLA EN VERDE, que es como se muere esta familia de gates:
 *
 *  1. **El sujeto se deriva del disco**: `PAGINAS` recorre `src/app` entero, así que
 *     una página nueva nace cubierta y hay que exceptuarla a mano, a la vista. No se
 *     usa `PAGINAS_PUBLICAS`: restar el `disallow` de `robots.ts` haría fallar ABIERTO
 *     —`robots.txt` manda sobre rastreadores, no apaga la pantalla—, que es el agujero
 *     exacto que `obra.test.ts` documenta haber tenido hasta el 2026-09-04.
 *  2. **Se siguen los imports.** El texto de venta casi nunca vive en el `page.tsx`:
 *     un `grep` sobre `servicios/webs/page.tsx` da CERO sobre la página que ES el
 *     defecto, porque su copy está en `content/webs.ts`. Por eso el recorrido es
 *     `cadenaHastaTexto`, no una lectura del archivo.
 *  3. **Se ancla con un caso que SÍ tiene que encontrar.** Si el resolver de imports
 *     se rompe, el recorrido no visita nada, el patrón no matchea y el gate firma
 *     verde sobre un sitio sin vigilancia. El caso de abajo exige encontrar un texto
 *     que vive a más de un salto de la página.
 *  4. **Se ancla el patrón** contra las formas reales, incluida la acentuada y la que
 *     no lleva acento, porque el copy del sitio usa las dos.
 */

/**
 * Las frases con las que una pantalla admite que algo todavía no está.
 *
 * Se leen SIN comentarios (lo hace `cadenaHastaTexto`) y con los espacios aplanados:
 * si no, la bitácora que explica POR QUÉ salió una de estas palabras pondría el gate
 * en rojo y obligaría a borrar el registro de lo que pasó — este archivo mismo las
 * nombra una docena de veces.
 */
const OBRA =
  /(muy pronto|pr[oó]ximamente|en construcci[oó]n|en desarrollo|estamos construyendo)/i;

describe("ninguna pantalla anuncia obra en su cuerpo", () => {
  /**
   * ANCLA DEL RECORREDOR. Sin esto, un `cadenaHastaTexto` que dejara de resolver
   * imports haría pasar el gate entero en verde: cero visitas, cero matches, cero
   * rojo. Se exige un texto que NO está en el `page.tsx` sino en un módulo importado,
   * así que encontrarlo prueba que el recorrido cruza al menos un salto.
   */
  it("el recorredor cruza imports: encuentra copy que no está en el page.tsx", () => {
    const precios = PAGINAS.find((p) => p.ruta === "/precios");
    expect(precios, "no existe la página /precios").toBeDefined();

    const hallado = cadenaHastaTexto(archivoDe(precios!), /Reservas online/i);
    expect(
      hallado,
      "el recorredor no encontró 'Reservas online', que vive en lib/pricing.ts: " +
        "el resolver de imports está roto y este gate mide en falso",
    ).not.toBeNull();
    expect(
      hallado!.cadena.length,
      "'Reservas online' se encontró en el propio page.tsx: el ancla dejó de probar " +
        "que se cruzan imports",
    ).toBeGreaterThan(1);
  });

  /**
   * ANCLA DEL PATRÓN. Las cinco formas son las que este proyecto vio de verdad: las
   * cuatro de la medición del objetivo del carril más la que usó la landing en 2026.
   * Se prueban con y sin acento porque el copy del sitio escribe las dos.
   */
  it("el patrón reconoce las formas reales y no se come una frase sana", () => {
    for (const vivo of [
      "Historia clínica muy pronto",
      "Próximamente: reservas online",
      "Proximamente: reservas online",
      "Módulo en construcción",
      "Módulo en construccion",
      "Esta pantalla está en desarrollo",
      "Estamos construyendo el módulo de caja",
    ]) {
      expect(OBRA.test(vivo), `el patrón no reconoce: ${vivo}`).toBe(true);
    }

    for (const sano of [
      "Tu negocio deja de vivir en el cuaderno",
      "Construimos los flujos y los dejamos andando en tu operación",
      "Contesta al instante a cualquier hora",
    ]) {
      expect(OBRA.test(sano), `el patrón se come una frase sana: ${sano}`).toBe(false);
    }
  });

  it.each(PAGINAS.map((p) => [p.ruta || "/", p] as const))(
    "%s no anuncia obra",
    (ruta, pagina) => {
      const hallado = cadenaHastaTexto(archivoDe(pagina), OBRA);
      expect(
        hallado,
        hallado
          ? `${ruta} anuncia obra: "${hallado.encontrado}" — llega por ` +
            `${hallado.cadena.join(" → ")}. La venta nunca exhibe obra ` +
            `(CLAUDE.md): lo que no está listo no se nombra.`
          : "",
      ).toBeNull();
    },
  );
});
