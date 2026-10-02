/**
 * El píxel de Meta del sitio. Módulo hoja, sin imports, a propósito: lo lee
 * también `next.config.ts` para abrir la CSP, y el config no resuelve el
 * alias `@/` que usa `origen-de-campana.ts` (medido: `next build` moría con
 * `Cannot find module './src/app/(sitio)/nav'`).
 */

/** Píxel «ONIA Web» de la cuenta ONIA Ads. No es un secreto: viaja en cada aviso. */
export const PIXEL_DE_META = "1012611478191231";

/** Adónde va cada aviso del píxel. La CSP abre `connect-src` a este origen y a nada más de Meta. */
export const PIXEL_DESTINO = "https://www.facebook.com/tr";
