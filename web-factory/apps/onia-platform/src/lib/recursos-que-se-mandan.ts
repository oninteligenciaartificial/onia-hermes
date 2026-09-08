/**
 * Los archivos de `public/recursos/` que una automatización de AFUERA le manda
 * a un lead, y quién los manda.
 *
 * POR QUÉ EXISTE ESTE ARCHIVO, medido el 2026-09-08:
 * los dos PDF de acá viven en `public/recursos/` de esta app —o sea, en la zona
 * del sitio de venta— y **ninguna página del sitio los enlaza**. Se comprobó con
 * `grep -rn "recursos/" src/ --include=*.tsx --include=*.ts`: cero hits fuera de
 * los tests. Su único consumidor es un workflow de n8n que responde por DM a
 * quien comenta `SISTEMA` o `LISTA` en un post de Lucía.
 *
 * Eso los deja fuera del alcance de TODOS los gates de enlaces del repo, y los
 * tres por el mismo motivo, que es correcto en cada uno: `enlaces.test.ts`,
 * `enlaces-internos.test.ts` y `alcance.test.ts` derivan sus sujetos de las
 * PÁGINAS del sitio. Un archivo que no enlaza ninguna página no es sujeto de
 * nadie — es la misma familia que el «texto de venta muerto» de `cta-sin-obra`,
 * un escalón más afuera: allá el literal estaba en el árbol y no lo usaba nadie
 * TODAVÍA; acá el archivo sí se usa, y el que lo usa está fuera del sitio.
 *
 * Y la clase ya mordió: `hermes-content/docs/ONIA_AUTOMATIZACION_MENSAJES_20260818.md`
 * registra `onia.com.bo/recursos/lista-por-donde-empezar.pdf → 404` y, al lado,
 * la consecuencia — *«por eso el workflow hoy solo acciona con SISTEMA»*. Un imán
 * de leads que dejó de funcionar en silencio: el DM salía igual, el lead abría un
 * 404, y nada en el repo se ponía en rojo. Hoy los dos están vivos (200,
 * `application/pdf`, 306.319 y 258.256 bytes, medidos con curl el 2026-09-08),
 * así que lo que falta no es arreglarlos: es que no se puedan romper callados.
 *
 * ⚠️ **Esto NO es una lista de inclusión.** `recurso-que-se-manda.test.ts` la
 * cruza contra el DISCO en las dos direcciones: un archivo nuevo en
 * `public/recursos/` que nadie declare acá pone el gate en rojo, y una entrada
 * de acá cuyo archivo se borre o se renombre, también. Declarar es a mano —a la
 * vista— y es justamente lo que hace visible que borrar el archivo tiene costo.
 *
 * El cruce contra lo que el material de afuera CITA de verdad no puede vivir en
 * la cadena `npm test`: ese material está en `hermes-content/`, y un worktree con
 * sparse-checkout —o el árbol de la app copiado solo— lo dejaría rojo por
 * AMBIENTE, que traba el merge de los quince carriles. Va como alias suelto,
 * `npm run recursos:vivos`, que sale 2 = NO MEDIDO cuando no alcanza el material.
 */
export type RecursoQueSeManda = {
  /** El archivo, tal cual se llama dentro de `public/recursos/`. */
  readonly archivo: string;
  /** La palabra que lo dispara, si la hay. */
  readonly palabra: string;
  /** Quién lo manda. Si esto deja de ser cierto, la entrada se borra con el archivo. */
  readonly loManda: string;
};

/** Dónde viven, relativo a `public/`. Lo usan el gate y el script. */
export const CARPETA_DE_RECURSOS = "recursos";

export const RECURSOS_QUE_SE_MANDAN: readonly RecursoQueSeManda[] = [
  {
    archivo: "lista-por-donde-empezar.pdf",
    palabra: "LISTA",
    loManda:
      "El workflow de n8n que contesta los comentarios de Instagram de Lucía " +
      "(hermes-content/deploy/vps-ops/n8n-backup-20260820/gWrVHU8OxI9yugc4.json), " +
      "declarado en hermes-content/contenido/README.md sección 5.",
  },
  {
    archivo: "5-herramientas-ia-bolivia.pdf",
    palabra: "HUMO",
    loManda:
      "El DM de Lucía para la palabra HUMO, declarado en " +
      "hermes-content/docs/ONIA_CIRCUITO_COMENTARIO_DM.md.",
  },
];
