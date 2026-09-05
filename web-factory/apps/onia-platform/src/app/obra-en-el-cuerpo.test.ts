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
