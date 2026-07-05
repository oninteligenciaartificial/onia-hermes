# ONIA Core Changelog

## 0.6.0 — 2026-07-05 (vertical packs formalizados)

- Nueva estructura `verticalPacks`: un pack por track vertical con vocabulario
  del rubro (`workItemTypes`, `partnerTypes`, `areas`), `checklists`, `kpis` e
  `intakeChannels`. Onboardear un rubro nuevo = agregar track + pack (datos), no
  codigo de core.
- Aditivo/no-breaking: no toca entidades, capabilities, schema ni adapters, asi
  que los productos en adopcion (DentalGest, Bolivian Electric) no se ven
  afectados.
- Validador: biyeccion track<->pack, `rubro` en el roadmap, `intakeChannels`
  subconjunto de `intakePolicy.channels`, vocabulario/checklists/kpis no vacios y
  KPIs sincronizados con `owner_dashboard.verticalExtensions`.
- Helpers `getVerticalPacks` / `getVerticalPack` / `getVerticalPackByRubro` +
  7 tests nuevos (33 en total).

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
