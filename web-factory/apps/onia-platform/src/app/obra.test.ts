import { describe, expect, it } from "vitest";

import { PAGINAS_PUBLICAS, metadataDe } from "./rutas";

/**
 * Ninguna página publicada declara estado de obra en su metadata.
 *
 * Es la regla de Sergio del 2026-08-20 —*"no entiendo por qué dices si es que
 * estamos construyendo algo que aún no está listo… hace escapar a los clientes
 * porque hacen creer que el sistema no funciona"*— aplicada al único texto de
 * cliente que nadie mira: el que el sitio dice de sí mismo cuando otro lo lee.
 *
 * El caso que lo trajo: la `<meta name="description">` de `/terminos` decía
 * *"(borrador, pendiente de revisión por abogado)"* mientras el documento se
 * declaraba `status: "vigente"` en su propio frontmatter
 * (`src/content/legal/terminos.md`). No era sólo obra a la vista: era **falso**.
 *
 * Y el motivo por el que sobrevivió es el que este gate existe para cerrar. El
 * aviso de borrador VISIBLE estaba hardcodeado en `legal-page.tsx`; se arregló
 * ahí para que respetara el frontmatter —una política publicada como "borrador"
 * no sirve para dar de alta una app en Meta—, el frontmatter pasó a `vigente`,
 * el cartel desapareció de la pantalla… y la descripción quedó repitiendo la
 * frase vieja en el `<head>`, invisible para el que mira la página renderizada.
 * Una promesa que cambia se barre en toda la superficie, y la metadata es la
 * parte de la superficie que no se ve mirando.
 *
 * ⚠️ **El corte de sujetos es el disco menos el `disallow` de `robots.ts`**, el
 * mismo de `compartir.test.ts` y por el mismo motivo: una lista de inclusión
 * (el sitemap, un array de rutas) falla ABIERTA — el día que una página sale de
 * esa lista por un motivo no relacionado, deja de tener gate y nada se pone en
 * rojo. Con el disco, una página nueva nace cubierta.
 *
 * ⚠️ **Lo que este gate NO prohíbe, y es deliberado**, porque una lista de
 * palabras que grita de más termina borrada:
 *  - **"borrador" a secas** es una capacidad REAL y vendible del producto —los
 *    agentes dejan un borrador esperando aprobación (`/agentes`)—. Lo que se
 *    persigue es el borrador *de la propia página*, no el que el sistema
 *    produce: por eso el patrón es `pendiente de revisión` / `borrador de
 *    trabajo`, no la palabra suelta.
 *  - **enumerar el alcance de un servicio** —`/servicios/webs` dice "qué lleva
 *    cada una, qué no lleva"— es delimitar lo que se compra, no anunciar un
 *    hueco. Por eso no hay patrón de `no incluye` / `no lleva`.
 *
 * ⚠️ **"todavía no" SÍ está prohibido acá, y hasta el 2026-09-03 no lo estuvo.**
 * El comentario que lo eximía decía que era "honestidad aprobada sobre los
 * límites", y confundía dos superficies distintas:
 *  - El **cuerpo** de `/comparativa` enumera lo que Onia no hace, y así se
 *    queda: la página existe para comparar de frente, y taparlo ahí sería
 *    fabricar. Este gate no lee el cuerpo.
 *  - La **`description`** no es el cuerpo. Es el anzuelo: los ~155 caracteres
 *    que decide el buscador mostrar, y lo único que un lead lee ANTES de entrar.
 *    La que estuvo viva terminaba en *"Y lo que Onia todavía no hace."*, así que
 *    el sitio se anunciaba a sí mismo por su carencia en el único renglón que
 *    tiene para conseguir el clic — y encima con "todavía", que promete el hueco
 *    para más adelante: obra en una palabra. No se ve abriendo la página; se ve
 *    en Google.
 * Honestidad y publicidad negativa no son lo mismo: la primera vive en la
 * página, la segunda no vive en ningún lado.
 */

/** Frases que le dicen al cliente "esto no está listo". */
const OBRA: { patron: RegExp; porque: string }[] = [
  { patron: /\bmuy pronto\b/i, porque: 'la banda de módulos tenía CINCO "muy pronto"' },
  { patron: /pr[oó]ximamente/i, porque: "es 'muy pronto' con otro traje" },
  { patron: /en construcci[oó]n/i, porque: "obra explícita" },
  { patron: /\bbeta\b/i, porque: "beta = 'todavía se rompe'" },
  { patron: /en desarrollo/i, porque: "lo que no está listo no se nombra" },
  { patron: /estamos trabajando/i, porque: "anuncia el hueco en vez de callarlo" },
  {
    patron: /pendiente de revisi[oó]n/i,
    porque: "el documento se publica o no se publica; a medio revisar no se anuncia",
  },
  { patron: /borrador de trabajo/i, porque: "el borrador propio de la página, no el del producto" },
  {
    patron: /\btodav[ií]a no\b/i,
    porque: "anunciar la carencia en el renglón que busca el clic, y 'todavía' promete el hueco",
  },
];

/**
 * La metadata sin sus comentarios: ahí se explica POR QUÉ no se escribe "muy
 * pronto", y un gate que se dispara con su propia justificación se desactiva a
 * la semana. Las líneas de `//` se sacan sólo si empiezan la línea, para no
 * partir una URL con `https://` adentro de un string.
 */
function sinComentarios(meta: string): string {
  return meta.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^[ \t]*\/\/.*$/gm, " ");
}

describe("ninguna página publicada exhibe obra en su metadata", () => {
  it("los patrones detectan de verdad", () => {
    // Sin este ancla, vaciar `OBRA` o romper un patrón dejaría los `it.each` de
    // abajo pasando en verde sobre cualquier cosa. El caso es el texto EXACTO
    // que estuvo vivo en `onia.com.bo/terminos` hasta el 2026-09-03.
    const vivo =
      "Términos y Condiciones de uso de la plataforma Onia " +
      "(borrador, pendiente de revisión por abogado): servicio, planes y pagos en Bs.";
    expect(
      OBRA.filter((f) => f.patron.test(vivo)).map((f) => f.patron.source),
      "el gate dejó de reconocer el defecto que lo hizo nacer",
    ).toContain("pendiente de revisi[oó]n");

    // El segundo caso vivo: la `description` de `/comparativa` hasta el
    // 2026-09-03. Éste no lo dejó pasar un patrón roto sino un comentario que
    // lo declaraba aceptable, así que el ancla tiene que nombrarlo aparte.
    const anzuelo =
      "Precios y capacidades publicados por el Portal del SIN, los facturadores " +
      "bolivianos y el software dental de la región, con fecha de consulta. Y lo " +
      "que Onia todavía no hace.";
    expect(
      OBRA.filter((f) => f.patron.test(anzuelo)).map((f) => f.patron.source),
      "el gate volvió a permitir que el sitio se anuncie por lo que le falta",
    ).toContain("\\btodav[ií]a no\\b");

    expect(OBRA.length, "la lista de frases de obra se vació").toBeGreaterThan(5);
  });

  it.each(PAGINAS_PUBLICAS.map((p) => [p.ruta || "/", p]))(
    "%s no se presenta como obra",
    (rotulo, pagina) => {
      const meta = sinComentarios(metadataDe(pagina));
      const encontradas = OBRA.filter((f) => f.patron.test(meta));
      expect(
        encontradas.map((f) => `${f.patron.source} — ${f.porque}`),
        `${pagina.archivo} (${rotulo}) declara estado de obra en su metadata. Esa ` +
          `frase no se ve abriendo la página: sale en la tarjeta que se comparte, en ` +
          `el buscador y en cualquier lector que use la description.`,
      ).toEqual([]);
    },
  );
});
