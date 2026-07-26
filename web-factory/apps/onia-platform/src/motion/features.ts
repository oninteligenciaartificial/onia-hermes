/**
 * Bundle de features para LazyMotion — se carga async (code-split), fuera
 * del JS inicial. `domAnimation` (~15 kb gzip) cubre: animaciones, variants,
 * exit (AnimatePresence) y gestos (hover/tap).
 *
 * Si algun dia hace falta layoutId/drag, se cambia a `domMax` (+10 kb) ACA,
 * en un solo lugar — no en cada componente.
 */
export { domAnimation as default } from "motion/react";
