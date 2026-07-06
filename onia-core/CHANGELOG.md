# ONIA Core Changelog

## core/logic — 2026-07-05 (tipo de cambio + numeracion)

- `logic/fx.logic.mjs`: tipo de cambio Bolivia -> `effectiveRate` (VRD + spread),
  `usdToBob`/`bobToUsd`/`convertUsdToBob`/`repriceUsdToBob`. El oficial 6.96 esta
  marcado SOLO para SIAT (no para precios); Binance es referencia. Utilidad
  transversal para commerce (repricing USD/BOB) y accounting (moneda extranjera).
- `logic/numbering.logic.mjs`: correlativos de comprobantes
  (`formatDocNumber`/`parseDocNumber`/`nextSequence`/`nextDocNumber`) para
  factura, asiento, cotizacion, pedido. +9 tests (149 total).

## core/logic — 2026-07-05 (aprobaciones + agenda + vistas)

- `logic/approvals.logic.mjs`: decision one-shot (pending -> approved/rejected,
  no se re-decide), no se aprueba la propia solicitud (salvo allowSelf).
- `logic/scheduling.logic.mjs`: proximos, vencidos y recordatorios de ScheduleEvent.
- `logic/saved-view.logic.mjs`: sanea filtros de SavedView (no sobrescribir el
  tenant/organizationId; evita prototype pollution __proto__/constructor/prototype).
- Con esto el CORE queda con logica canonica en sus capabilities principales:
  work_items, intake, roles, approvals, scheduling y saved views. +10 tests
  (140 total).

## core/logic — 2026-07-05 (intake + roles)

- `logic/intake.logic.mjs`: gobernanza de canal (registrado o alerta de
  gobernanza), dedupe por contacto+canal en 24h, ruteo por routedAreaId/
  routingRule, round-robin por carga y normalizacion a WorkItem draft. Implementa
  las `normalizationRules` del `intakePolicy` del contrato.
- `logic/roles.logic.mjs`: motor de permisos deny-by-default sobre RoleAssignment
  -> asignaciones activas/no vencidas, alcance organizacion/area, union multi-rol
  y wildcard '*'. La matriz de permisos la aporta el vertical, no el core.
  +18 tests (130 total).

## report/verticalReadiness — 2026-07-05 (parar un vertical nuevo)

- `verticalReadiness(contract, modules, trackId)` en `report.mjs`: dice si un
  vertical esta listo para ser un sistema vendible (tiene su pack + sus
  capabilities de capa modulo cubiertas por algun modulo) y que le falta. Guia
  para parar un sistema nuevo tipo ProveeGest sin ir a ojo. +3 tests (115 total).

## core/logic — 2026-07-05 (logica canonica del core: work_items)

- Nueva carpeta `onia-core/logic/`: logica pura canonica del CORE (aditiva, no
  toca el contrato congelado). Cierra el hueco de completitud: las funciones del
  core estaban completas en estructura pero sin logica canonica (cada producto la
  reimplementa, ~15-20K lineas duplicadas).
- `work-items.logic.mjs`: maquina de estados (open/in_progress/done/cancelled con
  reapertura), `applyTransition` inmutable con closedAt, SLA (`slaDueAt`/
  `isOverdue`), `dedupeKey` del intake, `priorityRank` y `comparePending` (orden
  de la cola del panel: vencidos -> prioridad -> antiguedad). +8 tests (112 total).

## modules/bridge — 2026-07-05 (commerce -> contabilidad)

- `bridge.logic.mjs`: convierte una venta/pedido de commerce en su asiento
  contable boliviano con IVA por dentro (debe caja/CxC por el total, haber ventas
  por el neto + IVA debito fiscal), reutilizando `computeQuoteTotal` (commerce) y
  `assertBalanced` (accounting). `saleToJournalEntry` / `orderToJournalEntry`.
  Conecta los dos modulos: una venta genera su asiento cuadrado solo. +4 tests.

## modules/accounting 0.1.0 — 2026-07-05 (contabilidad Bolivia)

- Nuevo modulo `accounting` (Bolivia) que PROVEE capabilities propias
  (`accounting`, `tax_bolivia`): el core deja la contabilidad/fiscal afuera a
  proposito, asi que el modulo las introduce. Nuevo campo `providesCapabilities`
  (una capability nueva que el core no tiene) ademas de `activatesCapabilities`.
- Ciclo contable de doble partida: `account` (plan de cuentas), `fiscal_period`
  (gestion por sector), `journal_entry` + `journal_entry_line` (libro diario; el
  mayor y el balance de comprobacion se DERIVAN de las lineas). Impuestos Bolivia:
  `tax_rate`, `tax_declaration`, `rcv_record` (IVA 13% / IT 3% / IUE 25% / RC-IVA,
  RCV, vencimiento por digito NIT). `bolivianConfig` con tasas, cierres de gestion
  por sector, tabla de vencimientos NIT y umbral de bancarizacion (default
  configurable; NO es asesoria fiscal). + `accounting.schema.sql` (7 tablas).
- Validador: `providesCapabilities` no puede chocar con una capability del core;
  cada capability activada O provista tiene al menos una entidad. +3 tests.
- `accounting.logic.mjs` (funciones puras, referencia canonica): doble partida
  (cuadre debe=haber), libro mayor, balance de comprobacion, libro auxiliar por
  partner (libro menor), estado de resultados y balance general (cuadran por
  construccion), IVA (debito/credito/saldo a favor), IT, IUE, bancarizacion,
  vencimiento por digito NIT y cierre de gestion por sector. 18 tests enlazados al
  bolivianConfig real; alicuotas por parametro. No es asesoria fiscal.
- `accounting.seed.bolivia.json`: plan de cuentas base (PCGA Bolivia, ~46 cuentas
  activo/pasivo/patrimonio/ingreso/gasto/costo con IVA credito/debito, depreciacion
  acumulada y provisiones laborales). Semilla ajustable; sirve de mapa de cuentas
  para los estados financieros. +6 tests. `loadModules` ahora ignora JSON que no
  son modulos (el seed convive en modules/ sin ser un modulo).
- Ajustes de cierre en `accounting.logic.mjs`: depreciacion de linea recta con
  tasas por tipo de activo (DS 24051: edificios 2.5%, muebles 10%, vehiculos 20%,
  computacion 25%...) + acumulada y valor en libros (topeada a la base), y
  provisiones laborales aguinaldo/indemnizacion (sueldo/12, devengado por meses).
  Config `depreciationByAssetType` / `laborProvisions`. 100 tests en total.

## modules/knowledge 0.1.0 — 2026-07-05 (base de conocimiento)

- Nuevo modulo `knowledge` (vertical_extension) que activa la capability
  `knowledge_base` (hasta ahora sin modulo, que el reporte flagueaba como FALTA
  MODULO). Entidades `knowledge_category` + `knowledge_article` (namespace
  `onia_knowledge_*`) + `knowledge.schema.sql`. Con esto ProveeGest/Bolivian
  Electric queda 100% cubierto por modulos (catalog_inventory + quotes_b2b +
  sales_cash + knowledge_base). +1 test.

## modules/commerce 0.2.0 — 2026-07-05 (ventas/caja)

- Capability `sales_cash` agregada al modulo commerce: entidades `order`,
  `order_line` y `payment` (+3 tablas `onia_commerce_*` en el schema). El pedido
  puede nacer de una cotizacion aceptada (`order.quoteId`) y payment es la base de
  cuentas por cobrar. Commerce ahora cubre catalog_inventory + quotes_b2b +
  sales_cash (12 entidades). +1 test (9 en modulos).

## modules/commerce 0.1.0 — 2026-07-05 (capa de modulos vendibles)

- Nueva capa `onia-core/modules/`: add-ons vendibles activables SOBRE el core,
  FUERA del contrato congelado (el core no es inventario/ventas — asi lo manda el
  gap audit). No requiere entrada en contract.json ni mapeo en adapters.
- `commerce.json`: catalogo + inventario multi-almacen + cotizaciones B2B (9
  entidades `onia_commerce_*`), activa las capabilities de modulo
  `catalog_inventory` y `quotes_b2b` (hoy declaradas pero vacias en el core).
  Primer consumidor: ProveeGest / Bolivian Electric.
- `commerce.schema.sql`: SQL base del modulo (tablas `onia_commerce_*` con tenant
  scope, indices y uniques). Cada entidad declara su `table`; el validador exige
  que el schema la defina (mismo patron blueprint->SQL que uso el core).
- Validador `modules/validate-modules.mjs`: un modulo solo activa capabilities de
  capa modulo (nunca core ni external_gate), depende solo de entidades core
  reales, referencia tracks existentes, sus entidades son tenant-scoped y no
  chocan con ids del core, cada capability activada tiene al menos una entidad, y
  si declara `schemaFile` este define la tabla de cada entidad.
  + 8 tests (`modules/modules.test.mjs`).

## 0.6.0 — 2026-07-05 (vertical packs formalizados)

- Nueva estructura `verticalPacks`: un pack por track vertical con vocabulario
  del rubro (`workItemTypes`, `partnerTypes`, `areas`), `checklists`, `kpis` e
  `intakeChannels`. Onboardear un rubro nuevo = agregar track + pack (datos), no
  codigo de core.
- Aditivo/no-breaking: no toca entidades, capabilities, schema ni adapters, asi
  que los productos en adopcion (DentalGest, Bolivian Electric) no se ven
  afectados.
- Validador: biyeccion track<->pack, `rubro` en el roadmap, `intakeChannels`
  subconjunto de `intakePolicy.channels`, vocabulario/checklists/kpis no vacios,
  KPIs sincronizados con `owner_dashboard.verticalExtensions` y coherencia de
  compuerta (un pack no puede alimentar un canal `external_gate` cuya capability
  su track bloquea; ej: intake WhatsApp en un vertical que gatea whatsapp).
- Helpers `getVerticalPacks` / `getVerticalPack` / `getVerticalPackByRubro`.
- Nuevo `report.mjs`: reporte de avance en lenguaje simple (verticales con su
  pack + cuanto del core lleva instalado cada producto); nombra las capabilities
  bloqueadas por vertical. Suite dependency-free (`node:test`): 43 tests.

## 0.5.0 — 2026-07-03 (core finalizado para beta)

- `work_item.channelId` agregado al contrato + `channel_id` al SQL base
  (el intake lo exige; DentaGest ya lo tenia instalado).
- `distributionTargets.dentagest.status` -> `installing` con doble llave
  en el validador (`TARGET_ADOPTION_APPROVED`).
- Nueva `ONIA_CORE_INSTALL_GUIDE_2026.md`: receta repetible destilada de la
  adopcion real (convenciones de traduccion, orden de sprints, reglas duras).
- Policy: core beta congelado para adopcion.

## 0.4.0 — 2026-07-03

- Entidad `CommunicationChannel` (registro de canales oficiales con ruteo) —
  resuelve el caos multi-correo.
- Capability `channels`, canal `email_shared`, regla de gobernanza (canal no
  registrado = alerta), seccion `channels` del owner_dashboard.
- Docs: company backbone (10 piezas) + configurador 7 preguntas +
  self-service (Google -> landing -> checkout -> wizard).

## 0.3.0 — 2026-07-03

- `verticalFactory` (11 rubros; ProveeGest = distribucion B2B multi-rubro).
- `readModels.owner_dashboard` (6 secciones core + extensiones por track).
- `intakePolicy` (canales + reglas de normalizacion).
- Validador: checks para las 3 secciones nuevas.

## 0.2.0 — 2026-07-03 (alpha -> beta)

- 7 entidades transversales: BusinessPartner, RoleAssignment, Comment,
  Document, ApprovalRequest, ScheduleEvent, SavedView + SLA en WorkItem.
- 6 capabilities core nuevas; track dentagest-clinical -> first_beta_active.
- Validador endurecido: 14 tablas + columnas SLA, entidades huerfanas,
  cobertura de las 10 preguntas, semver, adapters mapean todo el core.

## 0.1.0 — 2026-06 (alpha)

- Contrato canonico inicial: 10 entidades, 14 capabilities, 4 tracks,
  3 adapters, SQL base y validador.
