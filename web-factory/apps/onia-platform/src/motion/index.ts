/**
 * Motion kit — ONIA Platform (web-factory).
 *
 * Stack decidido (ver web-factory/docs/MOTION_PATTERN_BANK_2026.md):
 * Motion (motion.dev) via LazyMotion + m, MIT, ~4.6 kb sync + ~15 kb async.
 * GSAP queda como especialista SOLO para scroll storytelling con pin real,
 * por dynamic import y nunca en esta app salvo necesidad demostrada.
 *
 * Uso: envolver la pagina con <MotionProvider> una vez, importar el resto
 * desde "@/motion".
 */

export { MotionProvider } from "./motion-provider";
export { Entrada } from "./entrada";
export { Reveal } from "./reveal";
export { SplitTextReveal } from "./split-text";
export {
  StickyScene,
  useSceneProgress,
  useSceneTransform,
} from "./sticky-scene";
export { ScrollList, type ScrollListItem } from "./scroll-list";
export { Coverflow, type CoverflowItem } from "./coverflow";
export { Marquee } from "./marquee";
export { BleedWordmark } from "./bleed-wordmark";
export { StaggerGrid, StaggerItem } from "./stagger-grid";
export { CountUp } from "./count-up";
export { Magnetic, PressableCta } from "./magnetic";
export { ModuleToggle, ModulePower } from "./module-toggle";
export { AgentRescheduleScene } from "./agent-scene";
export {
  springs,
  durations,
  easeOutExpo,
  viewportOnce,
  riseDistance,
  staggerBase,
} from "./tokens";
