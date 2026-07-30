# ONIA Core Install Guide 2026

Fecha: 2026-07-03.
Estado: receta canonica de instalacion, destilada de la adopcion real en
DentalGest (Sprints 0-4, commits 612a177..6bda56a).
Owner: Onia / Hermes.

Esta guia convierte la adopcion del core en una receta repetible. El proximo
producto (GestiOS, Ganadero OS, ProveeGest) NO investiga: sigue estos pasos.

## Prerrequisitos (gate de entrada)

1. Adapter del producto en `adapters/<producto>.json` con plan aprobado.
2. Proyecto agregado a `ADOPTION_APPROVED` (validate.mjs) y
   `TARGET_ADOPTION_APPROVED` — doble llave, a proposito.
3. **Baseline de migraciones limpio** (Sprint 0 SIEMPRE primero):
   `prisma migrate status` responde "up to date" contra prod. Si hay drift,
   seguir el runbook de `DATABASE_MIGRATION_BASELINE_2026.md` de DentaGest.

## Convenciones de traduccion (contrato -> Prisma del producto)

| Contrato | Producto |
|---|---|
| Tabla `onia_core_x` snake_case | Modelo `OniaCoreX` + `@@map("onia_core_x")` |
| Columnas snake_case del SQL base | camelCase si esa es la convencion del repo (DentaGest lo es) |
| `organizationId` requerido | FK real a Organization con `onDelete: Cascade` + back-relation |
| `ownerId`/`authorId` | FK a Profile (`SetNull` si opcional, `Cascade` si requerido) |
| indices del SQL base | `@@index` equivalentes; siempre lideran con `organizationId` |

Migraciones: NUNCA `migrate dev` contra prod. Flujo probado:

```bash
git show HEAD:prisma/schema.prisma > /tmp/old.prisma
npx prisma migrate diff --from-schema /tmp/old.prisma --to-schema prisma/schema.prisma --script \
  > prisma/migrations/<timestamp>_<nombre>/migration.sql
npx dotenv-cli -e .env -- npx prisma migrate deploy
npx prisma generate
```

## Orden de instalacion (el que funciono)

1. **WorkItem + tenant guard** (`lib/onia-core/tenant-guard.ts` +
   `work-items.ts`): tipos del pack vertical, transiciones, dedupe por item
   abierto (type+entidad), cola pending ordenada por SLA.
2. **Generadores + cron**: funciones puras dominio->CreateWorkItemInput,
   cron diario idempotente (auth por CRON_SECRET, patron del repo).
3. **Collab** (`collab.ts`): Comment/Document/ApprovalRequest con visibilidad
   deny-by-default segun roles del producto; documentos = solo metadata con
   path de bucket (rechazar URLs).
4. **Roles finos + Schedule + SavedViews** (`roles.ts`, `schedule.ts`,
   `saved-views.ts`): matriz de permisos del pack, fallback desde el Role
   base, filtros validados (sin organizationId ni proto pollution).
5. **Intake** (`intake.ts` + `POST /api/onia-core/intake`): intakePolicy del
   contrato — canal no registrado rechazado, gates por add-on de la org,
   match de contacto sin auto-crear, dedupe 24h contacto+canal, round-robin
   por carga. Secret via env (`ONIA_INTAKE_SECRET`, setear en Vercel).
6. **UI minima**: pagina `/pending` (cola con acciones) + prioridades del
   dashboard consumiendo `listPendingForPanel` + cola de aprobaciones para
   quien decide.

## Reglas duras (no negociables, verificadas por tests)

- Toda query core pasa por `tenantWhere()` — cruce de tenant lanza error.
- El dominio del producto NO se toca: el core referencia via
  `relatedEntityType/relatedEntityId`.
- Cada sprint cierra con `typecheck` + tests verdes en el producto y
  `npm run validate:onia-core` verde en Hermes.
- Cada tabla instalada se registra en `adapter.installedEntities`
  (entidad, tabla, migracion, fecha, notas).
- Los tests de logica pura (visibilidad, transiciones, dedupe, ruteo,
  permisos) son obligatorios; integracion con DB puede diferirse.

## Metricas de referencia (DentalGest)

- 5 sprints en 1 dia de trabajo asistido.
- 10 tablas core en prod, 7/8 entidades beta, 166 tests.
- 0 migraciones fallidas usando el flujo diff+deploy.
