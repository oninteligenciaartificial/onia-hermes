/*
 * Barrel de la logica canonica del core. Un solo punto de importacion para los
 * productos: `import { workItems, fx } from "@onia/core/logic"`. Namespaced para
 * evitar colisiones de nombres entre modulos.
 */
export * as workItems from "./work-items.logic.mjs";
export * as intake from "./intake.logic.mjs";
export * as roles from "./roles.logic.mjs";
export * as approvals from "./approvals.logic.mjs";
export * as scheduling from "./scheduling.logic.mjs";
export * as savedView from "./saved-view.logic.mjs";
export * as fx from "./fx.logic.mjs";
export * as numbering from "./numbering.logic.mjs";
