import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * ARCHIVO DE LA v1 — la web que estuvo publicada hasta el 2026-08-21.
 *
 * No es una ruta de venta: existe para que la v1 se pueda MIRAR (no solo leer
 * en el diff) si hubiera que volver a ella. Cada página de acá abajo trae su
 * propio <SiteHeader/> y <SiteFooter/>, así que este layout no pone cromo:
 * solo el noindex del árbol entero. `/v1` también está en el disallow de
 * robots.ts y fuera del sitemap.
 *
 * Contenido: `/v1` (la portada), `/v1/precios`, `/v1/chatbot`,
 * `/v1/comparativa`, `/v1/empezar` (el wizard de 3 preguntas),
 * `/v1/prueba-gratis`, `/v1/modulos/dental` y
 * `/v1/funciones/facturacion-electronica-siat`. Sus componentes viven en
 * `src/components/landing-v1/`.
 *
 * CÓMO SE VUELVE A LA v1 — UN comando, desde la raíz del repo:
 *
 *     git checkout a87f811d -- web-factory/apps/onia-platform
 *
 * `a87f811d` es el commit inmediatamente anterior a la publicación: la app
 * entera vuelve a su estado exacto de antes. `/` vuelve a ser la v1,
 * reaparecen `/precios`, `/chatbot`, `/comparativa`, `/empezar`,
 * `/prueba-gratis`, `/modulos/dental` y
 * `/funciones/facturacion-electronica-siat` en sus URLs, se van las
 * redirecciones de next.config.ts y la v3 vuelve a `/preview` con su noindex.
 * Después: `npm run build` y desplegar.
 *
 * Se da como `checkout` de una ruta y no como `git revert <sha>` a propósito:
 * el hook de auto-sync partió este trabajo en más de un commit, así que un
 * revert de un solo sha dejaría el árbol a mitad de camino. Restaurar la
 * carpeta desde un punto conocido no depende de en cuántos commits quedó.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function V1Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
