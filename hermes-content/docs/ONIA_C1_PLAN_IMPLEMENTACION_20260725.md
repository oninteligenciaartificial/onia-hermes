# C1 — Plan de implementación aprobable: capa de plataforma (DentaGest)

> **Carril C1, fase estructura (read-only, nada ejecutado).** Fecha: 2026-07-25.
> Spec que manda: ONIA_C0_ESQUELETO_MAESTRO_20260723.md. Espera aprobación de Sergio (sección STOP al final).

---

# PLAN DE IMPLEMENTACIÓN C1 — Capa de plataforma (DentaGest)

Fase ESTRUCTURA. Nada ejecutado. Repo: `C:\dev\proyectos\DentaGest\dental-saas` · rama `feat/onia-dental-medical-alert` (verificada). Spec que manda: `hermes-content/docs/ONIA_C0_ESQUELETO_MAESTRO_20260723.md` §2/§5/§6 + `ONIA_ARRANQUE_UNA_APP_20260723.md`. Verificado contra prod real (Supabase `kvepqgikokjlacxngkiw`, solo lectura): 9 orgs, 5 migraciones registradas, 4 dormidas, ninguna columna nueva existe.

## 0. Resumen (qué se construye y qué NO)

**Se construye (todo detrás de `PLATFORM_LAYER`, default OFF):**
1. Schema aditivo: `Organization.verticalTrackId` + 4 sockets país (`countryCode/currencyCode/taxIdType/locale`) + tabla `organization_entitlements` — 1 migración, 100% aditiva, sin backfill.
2. `lib/platform/**`: contratos §6 (`getAccountContext`, `resolveVerticalPack`, `hasFeature`, `requireFeature`, `FeatureGate`, `getNavForPack`) + `provisionOrganization`.
3. Mirror `data/onia-core/vertical-packs.json` + `scripts/sync-onia-core.mjs` (nunca editar a mano).
4. Nav ruteada por pack dental tras el flag; con flag off = codepath actual intacto.

**NO se construye en C1:** despertar las 4 migraciones dormidas (commerce/invoicing/accounting/medical_alerts — eso es C2 con su plan de flag+dry-run+backup) · seed de filas `OrganizationEntitlement` (booleanos legacy se traducen en runtime) · recablear `register/route.ts` (P1 aparte) · `Role.DOCTOR` nuevo · render-tests React / visual regression como gate duro (no hay jsdom ni fixture de auth; se hace lo honesto, §3) · tocar `lib/auth.ts`, `Header.tsx`, `QuickActionsFab.tsx`.

**Contradicciones entre las 3 partes — resueltas así:**

| # | Tema | Resolución |
|---|---|---|
| 1 | Layout de archivos (context.ts vs account-context.ts; nav.ts vs vertical-pack.ts; client.tsx vs feature-gate.tsx) | Layout canónico de 7 archivos (§2). `getAccountContext`+`requireFeature` en `context.ts`; `getNavForPack` en `vertical-pack.ts`; provider+`FeatureGate` en `client.tsx`. Los NOMBRES de exports congelados por C0 no cambian |
| 2 | Pack dental: ¿copia de `sidebarNavItems` o referencia? | **Referencia** (mismos objetos, identidad `===`) — byte-idéntico por construcción, una sola fuente |
| 3 | Flag off: ¿provider incondicional o cero llamadas? | **Cero llamadas** a `lib/platform/**` con flag off — ninguna query nueva se ejecuta; rollback más fuerte |
| 4 | Orden deploy: una parte afirma "código primero es seguro con flag off" | **FALSO y se descarta**: el client Prisma regenerado selecciona TODOS los escalares de `Organization` (`include: { organization: true }` en `DashboardGate`) → código nuevo contra DB vieja rompe aunque el flag esté off. **Orden duro: DB primero, código después** |
| 5 | Apply en prod: `apply_migration` del MCP vs SQL quirúrgico | **Prohibido `apply_migration`** (registraría tabla de app en `supabase_migrations`, viola `DATABASE_MIGRATION_BASELINE_2026.md:15-16`). Se aplica por `execute_sql` / conexión directa 5432 session-mode + `prisma migrate resolve --applied` |
| 6 | "Registrar en ambos trackers" | NO. Registro SOLO en `_prisma_migrations` (fuente canónica para tablas de app) |
| 7 | Quién aplica en prod (¿C1 o C5?) | Fuera de los commits de C1. Paso post-merge del runbook (§1.4), dueño único, antes de deployar código nuevo y antes de encender el flag |
| 8 | `QuickActionsFab`: ¿recibe prop items? | Sin cambios en C1 (queda dental hasta C3). El pack ya declara `quickActions` para entonces |
| 9 | Valor del flag: `"1" \|\| "true"` vs `"1"` | Solo `PLATFORM_LAYER === "1"` (un valor documentado en `.env.example`) |
| 10 | Nombre de migración | `20260726000000_add_platform_layer` |
| 11 | 5 vs 8 commits | 7 commits + 2 opcionales (§4) |

## 1. Migración de datos (diff + estrategia prod segura)

### 1.1 Diff Prisma (solo aditivo; ninguna línea existente se toca)

En `model Organization` (después de `planEnd`, schema.prisma:39):

```prisma
  verticalTrackId String @default("dentagest-clinical")
  countryCode     String @default("BO")
  currencyCode    String @default("BOB")
  taxIdType       String @default("NIT")
  locale          String @default("es-BO")
```

+ relación `entitlements OrganizationEntitlement[]` + `@@index([verticalTrackId])`. Modelo nuevo al final del schema:

```prisma
model OrganizationEntitlement {
  id               String    @id @default(cuid())
  organizationId   String
  featureKey       String                        // vertical.* | module.* | addon.*
  status           String    @default("active")  // active | suspended | expired
  source           String    @default("manual")  // manual | plan | pack | trial | grant
  limits           Json      @default("{}")
  grantedByAdminId String?
  validUntil       DateTime? @db.Timestamptz(6)
  createdAt        DateTime  @default(now()) @db.Timestamptz(6)
  updatedAt        DateTime  @updatedAt @db.Timestamptz(6)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  @@unique([organizationId, featureKey])
  @@index([organizationId, status])
  @@map("organization_entitlements")
}
```

Única desviación del bloque literal C0 §2.1 (a ratificar en §6): `@db.Timestamptz(6)` en los 3 `DateTime` — convención de la casa desde el baseline (prod usa timestamptz; precedente `OniaDentalMedicalAlert`). Nombres canónicos intactos. **Nada más entra**: ni booleanos legacy (quedan en schema.prisma:31-34), ni tablas de C2.

### 1.2 Generación (dev)

Rama nueva `feat/onia-c1-platform-shell`. `prisma validate` + `prisma generate` → migración con `npx prisma migrate dev --create-only --name add_platform_layer` **contra DB local, NUNCA prod** (con 4 pendientes + frontera `prospect_leads`, `migrate dev` contra prod detecta drift y ofrece RESET destructivo). Carpeta: `prisma/migrations/20260726000000_add_platform_layer/`. Review: 100% aditivo (solo ADD COLUMN / CREATE TABLE / CREATE INDEX / ADD CONSTRAINT; cero DROP/UPDATE).

### 1.3 SQL exacto para prod (apply quirúrgico)

**Prohibido en prod:** `prisma migrate deploy` (despertaría las 4 dormidas sin el plan de C2) · `db push` (ADR 0009) · `apply_migration` del MCP (resolución #5). Vía: conexión directa 5432/session-mode (script node `pg`, precedente ADR 0011) o MCP `execute_sql`. Idéntico byte a byte al `migration.sql` commiteado:

```sql
BEGIN;
ALTER TABLE "organizations"
  ADD COLUMN "verticalTrackId" TEXT NOT NULL DEFAULT 'dentagest-clinical',
  ADD COLUMN "countryCode"     TEXT NOT NULL DEFAULT 'BO',
  ADD COLUMN "currencyCode"    TEXT NOT NULL DEFAULT 'BOB',
  ADD COLUMN "taxIdType"       TEXT NOT NULL DEFAULT 'NIT',
  ADD COLUMN "locale"          TEXT NOT NULL DEFAULT 'es-BO';

CREATE TABLE "organization_entitlements" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "featureKey" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "source" TEXT NOT NULL DEFAULT 'manual',
    "limits" JSONB NOT NULL DEFAULT '{}',
    "grantedByAdminId" TEXT,
    "validUntil" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "organization_entitlements_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "organization_entitlements_organizationId_featureKey_key"
  ON "organization_entitlements"("organizationId", "featureKey");
CREATE INDEX "organization_entitlements_organizationId_status_idx"
  ON "organization_entitlements"("organizationId", "status");
CREATE INDEX "organizations_verticalTrackId_idx"
  ON "organizations"("verticalTrackId");

ALTER TABLE "organization_entitlements"
  ADD CONSTRAINT "organization_entitlements_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "organizations"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;
```

Inmediatamente después: `npx prisma migrate resolve --applied 20260726000000_add_platform_layer`. Resultado: 6 aplicadas + las mismas 4 dormidas (mismo mecanismo del baseline). ADD COLUMN con default no-volátil en PG15 = metadata-only, sin rewrite (9 orgs).

**Sin backfill**: los `NOT NULL DEFAULT` pueblan las 9 orgs (todas dentales → defaults correctos al 100%). Sin filas seed de entitlements (los traduce `legacyBooleanFeatures()` en runtime — puente sin big-bang, C0 §2.4).

### 1.4 Runbook de secuencia (no negociable)

1. Merge C1 a `main` (commits §4, gates verdes) — prod NO tocada aún.
2. Dueño único aplica el SQL de §1.3 en prod + `resolve --applied`.
3. Verificación: (a) SELECT de las 5 columnas → 9 filas con defaults, cero NULL; (b) tabla+índices+FK en `information_schema`; (c) `prisma migrate status` → pendientes = exactamente las 4 dormidas de antes; (d) `migrate diff` → único drift esperado: `prospect_leads` (frontera, NO tocar) + las 4 dormidas; (e) smoke prod: login+dashboard+/patients idénticos.
4. Recién ahí: deployar código nuevo (flag ausente = off).
5. Encender `PLATFORM_LAYER=1` es decisión separada, posterior, reversible con restart (sin deploy).

## 2. lib/platform (archivos + firmas + mirror)

7 archivos nuevos bajo `lib/platform/**` (dueño C1). Server-only donde hay Prisma; puro donde no.

| Archivo | Exports clave (contrato §6 congelado) |
|---|---|
| `types.ts` (puro) | `SUPPORTED_VERTICAL_TRACK_IDS = ["dentagest-clinical"]` · `VerticalTrackId` · `ModuleId`/`AddonId`/`FeatureKey` (namespace `vertical.*`/`module.*`/`addon.*`, catálogo cerrado C0 §2.3) · `AccountContext { organizationId, verticalTrackId, plan, countryCode, currencyCode, features: ReadonlySet<FeatureKey>, roleKeys, baseRole }` · `AccountContextValue` (serializable) · `VerticalPack` (§2.2 + extensión `quickActions`/`bottomNavHrefs`, a ratificar) · `NavModule` |
| `flags.ts` (puro) | `isPlatformLayerEnabled(): boolean` — `process.env.PLATFORM_LAYER === "1"`; solo server; el client nunca lee env |
| `vertical-pack.ts` (puro) | `VERTICAL_PACKS` · `resolveVerticalPack(id)` (total: id desconocido → fallback dental + `console.warn`, nunca throw en render) · `getNavForPack(pack, ctx)` (filtra por `baseRole` con las reglas de `filterNavItems` + por `requiresFeature` contra `ctx.features`). Pack dental: `nav` **referencia** `sidebarNavItems` (navigation.ts:19-36, sin copiar) · `roleKeys` = `DENTAL_ROLE_KEYS` (roles.ts:11) · `vocabulary/kpis/intakeChannels` del mirror · `includedFeatures = ["vertical.dentagest-clinical","module.dental"]` |
| `entitlements.ts` (puro) | `esActivo(e, now)` (`status === "active"` && `validUntil` null o futuro — C0 §2.1) · `legacyBooleanFeatures(org)` (schema.prisma:31-34 + plan vía `getLimits`: `publicBookingIncluded → module.public_booking`; `whatsappAddon → addon.whatsapp`; `publicBookingAddon → module.public_booking`; `inventoryAddon → addon.inventory_advanced`; `extraUserSeats>0 → addon.extra_seats`) · `enabledFeatures(org, ents, now)` = Set(pack.includedFeatures ∪ ents activos ∪ legacy) · `hasFeature(ctx, key)`. **Envuelve `plan-limits`, no lo toca**: `PLAN_LIMITS` sigue siendo autoridad de límites numéricos; firmas `canUse*`/`check*` intactas. Única edición: exportar `getPlanId` (plan-limits.ts:107, hoy privado) |
| `context.ts` (server) | `getAccountContext(): Promise<AccountContext \| null>` — `cache()`-memoizado (patrón auth.ts:46); envuelve `getTenantProfile` SIN modificarlo + **query propia** `findUnique` (columnas nuevas + entitlements activos, 1 query con include) + `effectiveRoleKeys` (roles.ts:69-84) · `requireAccountContext()` · `requireFeature(key)` → throw `FeatureNotEnabledError extends AuthError` (los catch existentes lo tratan fail-closed; handlers nuevos → 403 `{error:"feature_not_enabled", featureKey}`). En C1 nadie lo llama: contrato publicado para C2/C3 |
| `client.tsx` (`"use client"`) | `AccountContextProvider` · `useAccountContext(): AccountContextValue \| null` · `FeatureGate({feature, fallback?, children})` — fail-closed (sin provider o sin feature → fallback); cosmético, la autoridad es `requireFeature` en server |
| `provisioning.ts` (server) | `provisionOrganization(input): Promise<{organizationId, profileId}>` — ÚNICA función de alta (C0 §2.5), `$transaction`: Organization con defaults + Profile owner + entitlements semilla. Se construye+testea+exporta; NO se recablea `register/route.ts` en C1 |

**Mirror `data/onia-core/vertical-packs.json`:** SOLO campos que EXISTEN en `contract.json` (v1.0.0): `packId`, `rubro`, `vocabulary` (workItemTypes/partnerTypes/areas), `checklists`, `kpis`, `intakeChannels`, `requiredCapabilityIds`, `blockedCapabilityIds` para `dentagest-clinical` + `contractVersion` + `syncedAt`. **Nav/brand/roleKeys/includedFeatures NO van al mirror** (no están en el contrato; son presentación app-side → constantes tipadas en `vertical-pack.ts`). Partición que mantiene "mirror nunca a mano".

**`scripts/sync-onia-core.mjs`:** lee `contract.json` (path por `ONIA_CORE_CONTRACT_PATH` / `--contract`, default relativo a onia-hermes) → valida (pack existe, vocabulary/kpis/intake no vacíos; exit 1 sin escribir si falla; warn en cambio de major) → escribe determinístico (keys ordenadas, LF, newline final). Modo `--check`: compara con el commiteado (ignora `syncedAt`), exit 1 si drift. Scripts npm `sync:onia-core` / `-- --check`. NO entra al `ci` (runners sin checkout de onia-hermes); `--check` es gate local pre-merge.

## 3. Wiring nav + flag + verificación byte-idéntico

**Flujo con `PLATFORM_LAYER=1`:** `DashboardGate` (app/(dashboard)/layout.tsx) → `isPlatformLayerEnabled()` → `getAccountContext()` → `getNavForPack(resolveVerticalPack(ctx.verticalTrackId), ctx)` → prop `navItems` por `LayoutShell` → `Sidebar`/`BottomNav` → `filterNavItems(navItems ?? sidebarNavItems, role, access)` (mismo código de siempre) + `<AccountContextProvider>` montado.

**Flag off (default):** `DashboardGate` no llama NADA de `lib/platform/**`, no ejecuta ninguna query nueva, no pasa `navItems` → cada consumidor cae en `?? sidebarNavItems` — exactamente el código de hoy.

**Cambios a archivos existentes (diff mínimo, exhaustivo):**

| Archivo | Cambio |
|---|---|
| `components/layout/navigation.ts` | `NavigationItem` gana `requiresFeature?: string` opcional; `NavigationAccess` gana `features?: readonly string[]` opcional; `filterNavItems:52-56` reemplaza `void access` por filtro que solo actúa si el item declara `requiresFeature` Y `access?.features` existe — los 16 items no lo declaran → output idéntico. `sidebarNavItems` no se toca ni un byte |
| `components/layout/LayoutShell.tsx` | Prop opcional `navItems?`; reenvía a Sidebar y BottomNav |
| `components/layout/Sidebar.tsx` / `BottomNav.tsx` | Prop opcional + `navItems ?? sidebarNavItems`. JSX intacto |
| `app/(dashboard)/layout.tsx` | `const navItems = isPlatformLayerEnabled() ? getNavForPack(...) : undefined` + provider solo con flag on |
| `lib/plan-limits.ts` | Solo `export` de `getPlanId` |
| `.env.example` | Documentar `PLATFORM_LAYER` (ausente = off) |

`lib/auth.ts`, `Header.tsx`, `QuickActionsFab.tsx`: **cero cambios**.

**Batería byte-idéntico** (`components/layout/navigation.test.ts` + `lib/platform/*.test.ts` — vitest existente, env node, patrón `*.test.ts`):
1. **Identidad de referencia (gate más fuerte):** `getNavForPack(packDental, ctxCompleto)[i] === sidebarNavItems[i]` para los 16 items — mismo objeto en memoria, imposible diferir un byte.
2. Cinturón: `toStrictEqual` + `JSON.stringify` iguales.
3. `filterNavItems(sidebarNavItems, rol)` = fixture congelado, para los 4 roles, con y sin `access.features`.
4. `getNavForPack` ≡ `filterNavItems` para los 4 roles, flag on y off.
5. Flag: `false` con env vacío/`"0"`/undefined; `true` solo con `"1"`.
6. `enabledFeatures`/`esActivo`/`legacyBooleanFeatures`: equivalencia legacy↔features para cada `PlanId` × combinación de booleanos.
7. Item hipotético con `requiresFeature` apagada desaparece; los 16 reales nunca.

**Postura honesta (adoptada):** el gate duro de "byte-idéntico" en C1 = dato-idéntico por referencia + `git diff` de Sidebar/BottomNav solo plumbing (JSX intacto) + `npm run ci` verde + smoke manual on→off→on. Visual regression Playwright = **opcional** (no hay baselines ni fixture de auth hoy; si se exige como gate duro, presupuestar media jornada extra para el fixture). Render-tests React no entran (sin jsdom).

## 4. Orden de commits (cada uno compila) y gates

| # | Commit | Contenido | Gate |
|---|---|---|---|
| 1 | `chore(platform): mirror onia-core + sync script` | `data/onia-core/vertical-packs.json`, `scripts/sync-onia-core.mjs`, scripts npm | `--check` verde · typecheck · test |
| 2 | `feat(platform): schema aditivo + migracion (NO aplicada)` | `prisma/schema.prisma` (§1.1), `prisma/migrations/20260726000000_add_platform_layer/` | `validate`+`generate`+typecheck+test · SQL revisado línea a línea · runbook §1.4 en el commit |
| 3 | `feat(platform): contratos puros + tests` | `types.ts`, `flags.ts`, `vertical-pack.ts`, `entitlements.ts` + tests + export `getPlanId` | typecheck · tests (equivalencia legacy, esActivo, snapshot pack) |
| 4 | `feat(platform): getAccountContext + requireFeature + FeatureGate` | `context.ts`, `client.tsx` + tests (Prisma mockeado) | typecheck · tests |
| 5 | `feat(platform): filterNavItems 2do arg + snapshot nav byte-identico` | `navigation.ts`, `navigation.test.ts` | snapshot nace verde en el mismo commit |
| 6 | `feat(platform): wiring nav tras PLATFORM_LAYER` | `layout.tsx`, `LayoutShell/Sidebar/BottomNav`, `.env.example` | `npm run ci` completo · smoke on→off→on · diff disciplinado (solo plumbing) |
| 7 | `feat(platform): provisionOrganization` | `provisioning.ts` + test | typecheck · tests |
| 8* | *(opcional)* e2e visual sidebar | `e2e/sidebar-platform.spec.ts` | solo si hay DB local seedeada |
| 9* | *(opcional, diferible a C3)* `check*Addon` delegan en `hasFeature` (firma intacta) | `plan-limits.ts` | tests de equivalencia del commit 3 |

**Definición de HECHO de C1:** `git branch --show-current` correcto → `npm run lint` + `typecheck` + `test` + `build` + `ci` verdes · snapshot byte-idéntico verde · exports §6 con nombres canónicos exactos · rollback flag probado con evidencia (dev: `PLATFORM_LAYER=1` → sidebar dental normal; quitar → idéntico; verificar que flag off no ejecuta ninguna query nueva) · code-reviewer pre-merge · merge a `main` como árbol coherente único → habilita C2/C3. La aplicación en prod (runbook §1.4) es post-merge, dueño único.

Total estimado: ~24 archivos (14 nuevos), ~1.400-1.700 líneas, <100 tocan código existente.

## 5. Riesgos y rollback

| # | Riesgo | Mitigación |
|---|---|---|
| R1 | `migrate dev` contra prod → drift detectado → RESET destructivo | `--create-only` siempre; `migrate dev` solo DB local; prod solo recibe SQL §1.3 + `resolve --applied` |
| R2 | Alguien corre `migrate deploy` en prod y despierta las 4 dormidas sin el plan de C2 | Anotar en `DATABASE_MIGRATION_BASELINE_2026.md` que deploy queda congelado hasta C2 (entra en commit 2) |
| R3 | Deploy de código antes del SQL → toda query a `Organization` rompe (Prisma selecciona todos los escalares, incluso con flag off) | Runbook §1.4 DB→código, no negociable (resolución #4) |
| R4 | SQL aplicado ≠ `migration.sql` commiteado → checksum fantasma | Copiar el archivo tal cual; `resolve --applied` inmediato; verificación §1.4.3 |
| R5 | DDL por pooler 6543 falla a medias | Conexión directa 5432/session-mode; todo en una transacción |
| R6 | `migrate diff` sugiere `DropTable prospect_leads` y alguien lo aplica | Frontera documentada; jamás aplicar drops del diff |
| R7 | Choque de schema con C2/C3 | Regla C0: una migración aditiva por carril, orden C1→C2→C3; C1 mergea antes |
| R8 | Registro en `supabase_migrations` vía `apply_migration` rompe la fuente canónica | Prohibido (resolución #5); solo `execute_sql`/5432 + tracker Prisma |
| R9 | Regresión visual en commits 5-6 | Snapshot de identidad + diff solo-plumbing + `npm run ci` + smoke manual |

**Rollback en 2 niveles:**
- **Comportamiento (instantáneo, sin deploy):** quitar `PLATFORM_LAYER` + restart del contenedor → codepath dental hardcodeado, cero queries nuevas.
- **DB (completo; exportar grants manuales si ya hubiera):** `DROP TABLE organization_entitlements` + `DROP INDEX organizations_verticalTrackId_idx` + `DROP COLUMN` de las 5 columnas + `DELETE FROM "_prisma_migrations" WHERE migration_name = '20260726000000_add_platform_layer'` — ensayado en DB local antes de tocar prod.

## 6. STOP — lo que Sergio aprueba para arrancar el build

Con un "OK" se aprueba TODO el bloque; los deltas vs C0 literal se ratifican explícitamente:

1. **Alcance C1** (§0): capa fina + flag, app byte-idéntica; nada de C2/C3.
2. **Runbook DB** (§1): SQL quirúrgico §1.3 por 5432/`execute_sql` + `resolve --applied`; orden duro merge → SQL prod → deploy código → flag; prohibidos `migrate deploy`/`db push`/`apply_migration`.
3. **Delta 1 — `@db.Timestamptz(6)`** en los 3 DateTime de `OrganizationEntitlement` (C0 no lo especifica; convención de la casa). Cambiar = 1 línea antes de generar.
4. **Delta 2 — `quickActions` + `bottomNavHrefs`** en `VerticalPack` (extensión aditiva al §2.2; sin ellas un 2º pack heredaría FAB/bottom-nav dentales).
5. **Delta 3 — export de `getPlanId`** en `plan-limits.ts` (única edición fuera de la lista C0).
6. **Delta 4 — `provisionOrganization` sin recablear `register/route.ts`** (unificar onboardings = P1 aparte).
7. **Delta 5 — flag off = cero llamadas a `lib/platform`** (rollback más fuerte que el provider incondicional).
8. **Gate byte-idéntico honesto** (§3): identidad de referencia + diff plumbing + ci verde + smoke; visual regression opcional (si se exige como gate duro, +media jornada para fixture de auth).

**STOP. No se genera ni aplica nada hasta el OK del orquestador/Sergio.**

Archivos ancla: `C:\dev\proyectos\DentaGest\dental-saas\prisma\schema.prisma` · `C:\dev\proyectos\DentaGest\dental-saas\components\layout\navigation.ts` · `C:\dev\proyectos\DentaGest\dental-saas\app\(dashboard)\layout.tsx` · `C:\dev\proyectos\DentaGest\dental-saas\lib\plan-limits.ts` · `C:\dev\proyectos\DentaGest\dental-saas\docs\DATABASE_MIGRATION_BASELINE_2026.md` · `C:\dev\proyectos\onia-hermes\.claude\worktrees\skills-setup-config-8d4674\hermes-content\docs\ONIA_C0_ESQUELETO_MAESTRO_20260723.md` · `C:\dev\proyectos\onia-hermes\onia-core\contract.json`