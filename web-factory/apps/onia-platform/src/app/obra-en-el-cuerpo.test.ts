import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { PAGINAS, archivoDe, cadenaHastaSimbolo, moduloDe } from "./rutas";

/**
 * Ninguna página que el sitio SIRVE enumera lo que al producto le falta.
 *
 * Es la regla de Sergio del 2026-08-20 —*"no entiendo por qué dices si es que
 * estamos construyendo algo que aún no está listo… hace escapar a los
 * clientes"*—, que prohíbe explícitamente las **listas de lo que falta**.
 *
 * El defecto que lo trajo, medido el 2026-09-04 sobre el sitio vivo:
 * `onia.com.bo/v1/comparativa` respondía 200 y su cuerpo traía el bloque
 * titulado *"Y esto todavía no lo hace."* con las tres líneas de `TODAVIA_NO`,
 * incluida *"el pack del rubro **se está construyendo**"*. Y lo que lo hace un
 * defecto y no una decisión de estilo es que la decisión contraria YA estaba
 * tomada y escrita: `(sitio)/comparativa/page.tsx` explica en su cabecera por
 * qué NO se trae ese ledger —"la tercera anuncia obra en curso, que en una
 * superficie de venta está prohibida"—. Se arregló la instancia donde el
 * defecto saltó y su gemela de `/v1` quedó atrás, sirviendo la lista.
 *
 * ⚠️ **El sujeto es el disco ENTERO, sin el corte de `robots.ts`**, y esa es la
 * única diferencia con `obra.test.ts`, que mide lo mismo sobre la metadata.
 * Allá el corte es correcto: lo que Google no indexa, Google no lo lee. Acá no:
 * `/v1` está en `disallow` y aun así responde 200, así que un enlace viejo, un
 * favorito o un reenvío por WhatsApp deja a una persona real leyendo el cuerpo.
 * Un `noindex` no es una pantalla apagada; es una pantalla que no sale en el
 * buscador.
 *
 * ⚠️ **Lo que se prohíbe es la CAPACIDAD, no la palabra.** Un patrón de texto
 * sobre el `page.tsx` no puede ver esto: los tres pendientes no están escritos
 * en la página, se importan. Por eso el sujeto se mide sobre el grafo de
 * imports, igual que `header-camino-de-compra.test.ts`.
 *
 * ⚠️ **Lo que este gate NO prohíbe, a propósito:** que Onia diga de frente que
 * su emisor está EN TRÁMITE ante el SIN. Eso no es una lista de lo que falta:
 * es la advertencia que evita que una clínica compre creyendo que factura, vive
 * donde corresponde (`/facturacion`, `/guia-facturacion`, el bloque fiscal de
 * `/precios` y el veredicto de la fila de Onia en la comparativa) y sacarla
 * convertiría una honestidad en una promesa falsa. El corte no es el
 * vocabulario: es *enumerar huecos del producto* como sección.
 */

/** El símbolo de `lib/proof.ts` que pinta la lista de lo que falta. */
const LISTA_DE_LO_QUE_FALTA = "TODAVIA_NO";
/** El de la tabla de competidores — sólo como ancla del recorredor. */
const TABLA_COMPETIDORES = "CONTENDIENTES";
const PROOF = moduloDe("@/lib/proof");

describe("ninguna página servida enumera lo que al producto le falta", () => {
  /*
   * El ancla. Sin esto el gate falla ABIERTO: si el resolver de imports se
   * rompe —un alias nuevo, una extensión que no contempla—, el recorrido no
   * encuentra nada, las dos aserciones de abajo pasan en verde y el sitio queda
   * sin vigilancia sin que nada se ponga rojo. Acá se afirma lo contrario de lo
   * que el gate persigue: que el recorredor SÍ llega a `lib/proof.ts` a través
   * de un componente intermedio, que es el caso difícil.
   */
  it("el recorredor llega a lib/proof.ts a través de un componente", () => {
    // `/v1/comparativa` y no `/comparativa`: ésta importa `lib/proof` DERECHO,
    // así que encontrarla no probaría que el recorredor da el salto. La de
    // `/v1` llega por `components/sections/proof.tsx`, que es el caso difícil y
    // el único que distingue este gate de un `grep`.
    const porComponente = PAGINAS.find((p) => p.ruta === "/v1/comparativa");
    expect(porComponente, "no existe la página /v1/comparativa").toBeDefined();
    const cadena = cadenaHastaSimbolo(
      archivoDe(porComponente!),
      TABLA_COMPETIDORES,
      PROOF,
    );
    expect(cadena, "el recorredor no encontró CONTENDIENTES: mide en falso").not.toBeNull();
    expect(cadena!.length).toBeGreaterThan(1);
  });

  /*
   * La otra mitad, y la que el recorredor de imports no puede ver: ANUNCIAR el
   * ledger a mano, con el texto escrito en la página.
   *
   * El caso vivo, medido el 2026-09-04 en `onia.com.bo/v1/precios` (HTTP 200):
   * el pie del bloque de planes invitaba a *"Mirá Onia contra todo lo que se
   * vende en Bolivia — con los precios públicos de cada uno y lo que todavía no
   * hacemos, dicho de frente"*. Ninguna de las dos comprobaciones de arriba lo
   * ve: no importa `TODAVIA_NO`, lo escribe. Y es doblemente malo — es obra a
   * la vista, y además es FALSO desde el 2026-09-03, porque manda a leer a
   * `/comparativa` un ledger que esa página decidió no mostrar. El `it.each` de
   * arriba lo prueba: si ninguna pantalla puede pintarlo, prometerlo es mentir.
   *
   * ⚠️ El patrón se ancla en «lo que … no hace/hacemos», que es el TÍTULO del
   * ledger, y no en «todavía no» a secas. Es a propósito: la advertencia fiscal
   * («nuestro emisor … todavía no emite factura con valor fiscal») tiene que
   * poder seguir escrita donde corresponde, y un patrón más ancho obligaría a
   * borrarla — que es exactamente al revés de lo que hay que hacer.
   *
   * ⚠️ Y se leen las páginas SIN sus comentarios: las cabeceras de
   * `(sitio)/comparativa/page.tsx` y `v1/comparativa/page.tsx` citan la frase
   * para explicar por qué se sacó. Un gate que se dispara con la bitácora del
   * arreglo obliga a borrar el registro de lo que pasó, y termina borrado él.
   */
  const ANUNCIA_EL_LEDGER = /lo que (?:onia )?(?:todav[ií]a |a[uú]n )?no (?:lo )?hace(?:mos)?\b/i;

  it("el patrón reconoce la frase que estuvo viva y perdona la fiscal", () => {
    // Sin este ancla, un patrón roto deja el `it.each` de abajo en verde sobre
    // cualquier cosa. Los dos casos son texto REAL de producción.
    expect(
      ANUNCIA_EL_LEDGER.test(
        "con los precios públicos de cada uno y lo que todavía no hacemos, dicho de frente",
      ),
      "el gate dejó de reconocer el anuncio del ledger que lo hizo nacer",
    ).toBe(true);
    expect(
      ANUNCIA_EL_LEDGER.test(
        "nuestro emisor está en trámite de homologación ante el SIN y todavía no emite " +
          "factura con valor fiscal",
      ),
      "el patrón se comió la advertencia fiscal, que SÍ tiene que poder escribirse",
    ).toBe(false);
  });

  it.each(PAGINAS.map((p) => [p.ruta || "/", p] as const))(
    "%s no anuncia el ledger por texto",
    (_ruta, pagina) => {
      const fuente = readFileSync(archivoDe(pagina), "utf8")
        .replace(/\/\*[\s\S]*?\*\//g, " ")
        .replace(/^[ \t]*\/\/.*$/gm, " ");
      // El JSX parte las frases en varias líneas: se aplanan los espacios antes
      // de buscar, o «lo que todavía no\n hacemos» no matchea nada.
      const encontrada = ANUNCIA_EL_LEDGER.exec(fuente.replace(/\s+/g, " "));
      expect(
        encontrada?.[0] ?? null,
        `${pagina.archivo} anuncia por texto la lista de lo que al producto le ` +
          `falta. Ninguna pantalla la pinta, así que además de exhibir obra manda ` +
          `a leer algo que no está.`,
      ).toBeNull();
    },
  );

  it.each(PAGINAS.map((p) => [p.ruta || "/", p] as const))(
    "%s no puede pintar la lista de lo que falta",
    (_ruta, pagina) => {
      const cadena = cadenaHastaSimbolo(
        archivoDe(pagina),
        LISTA_DE_LO_QUE_FALTA,
        PROOF,
      );
      expect(
        cadena,
        cadena
          ? `esta pantalla enumera lo que al producto le falta, por ${cadena.join(" → ")}`
          : "",
      ).toBeNull();
    },
  );
});
