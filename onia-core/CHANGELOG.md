# ONIA Core Changelog

## modules/commerce 0.1.0 — 2026-07-05 (capa de modulos vendibles)

- Nueva capa `onia-core/modules/`: add-ons vendibles activables SOBRE el core,
  FUERA del contrato congelado (el core no es inventario/ventas — asi lo manda el
  gap audit). No requiere entrada en contract.json ni mapeo en adapters.
- `commerce.json`: catalogo + inventario multi-almacen + cotizaciones B2B (9
  entidades `onia_commerce_*`), activa las capabilities de modulo
  `catalog_inventory` y `quotes_b2b` (hoy declaradas pero vacias en el core).
  Primer consumidor: ProveeGest / Bolivian Electric.
- Validador `modules/validate-modules.mjs`: un modulo solo activa capabilities de
  capa modulo (nunca core ni external_gate), depende solo de entidades core
  reales, referencia tracks existentes, sus entidades son tenant-scoped y no
  chocan con ids del core, y cada capability activada tiene al menos una entidad.
  + 7 tests (`modules/modules.test.mjs`).

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
