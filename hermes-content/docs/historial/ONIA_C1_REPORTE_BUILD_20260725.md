# C1 — Reporte de build + verificación (rama feat/onia-c1-platform-shell)

> Fecha: 2026-07-25. Build completo en el repo DentaGest. NO mergeado, NO pusheado, DB prod NO tocada.
> Espera decisión de Sergio: merge + runbook SQL prod (§Queda para Sergio).
> Plan que ejecutó: ONIA_C1_PLAN_IMPLEMENTACION_20260725.md

---

# REPORTE FINAL — Verificación C1 (paso 4/4)

**Repo/rama:** `C:\dev\proyectos\DentaGest\dental-saas` · `feat/onia-c1-platform-shell` (verificada con `git branch --show-current`) · HEAD `5891d40`. **Sin push, sin merge.** No hizo falta ningún commit de fix.

## Commits de la rama (base `feat/onia-dental-medical-alert`)

| Hash | Mensaje | Diffstat |
|---|---|---|
| `f06378c` | chore(platform): mirror onia-core + sync script | 3 files, +277 |
| `0a1e98f` | feat(platform): schema aditivo + migracion (NO aplicada) | 3 files, +120 |
| `cb7dc22` | feat(platform): contratos puros + tests | 10 files, +883/−1 |
| `ae7a873` | feat(platform): getAccountContext + requireFeature + FeatureGate | 4 files, +448 |
| `c0cd928` | feat(platform): filterNavItems 2nd arg + byte-identical nav snapshot | 5 files, +1181/−5 |
| `25b3617` | feat(platform): route nav through PLATFORM_LAYER flag | 4 files, +53/−7 |
| `5891d40` | feat(platform): provisionOrganization single signup entry point | 2 files, +388 |

Total rama: 29 files, +3347/−10.

## Gates

| Gate | Comando | Resultado |
|---|---|---|
| Lint | `npm run lint` | VERDE |
| Typecheck | `npm run typecheck` (tsc --noEmit) | VERDE |
| Tests C1 + nav | `npx vitest run lib/platform components/layout` | VERDE — 7 files, 74/74 |
| Test suite completa | `npm test` | ROJO — 11 fallos, TODOS preexistentes ajenos a C1 (ver abajo). Resto: 81 files / 949 tests verdes |
| Build | `npm run build` | VERDE (exit 0, standalone completo) |
| Mirror drift | `npm run sync:onia-core -- --check` | VERDE — "mirror matches contract v1.0.0" |
| `npm run ci` | (lint+typecheck+test+build) | Rojo SOLO por el fallo preexistente de `npm test`; sus 4 componentes corridos individualmente: 3 verdes + test con el preexistente |

**Fallo preexistente (NO arreglado, documentado):** los 11 tests rojos viven en `.claude/worktrees/onia-core-sprint5/**` — un git worktree viejo (commit `aa8f211`, rama `claude/onia-core-adoption-sprint5`), gitignored (`.gitignore:52`). El `vitest.config.ts` raíz (`include: ["**/*.test.ts"]`, sin exclude de `.claude/**`) lo barre, y sus copias viejas de tests corren contra el lib ACTUAL vía alias `@` → asserts de precios/constantes viejas fallan (`WHATSAPP_ADDON_SETUP_PRICE` ya no existe, anual 13500→15000, mocks de OpenAI/Resend desalineados). Evidencia de que es ajeno a C1: C1 solo tocó 1 línea de `lib/plan-limits.ts` (agregar `export` a `getPlanId`); los archivos que fallan no están en la rama (untracked/ignored) y fallan igual en cualquier rama. Fix sugerido para un carril de higiene (NO aplicado): `git worktree remove` de los stale o exclude `**/.claude/**` en `vitest.config.ts`.

## Verificaciones punto 2 — confirmación explícita

1. **Exports canónicos §6 presentes, nombres exactos:** `SUPPORTED_VERTICAL_TRACK_IDS`/`VerticalTrackId`/`FeatureKey`/`AccountContext` (con `features: ReadonlySet<FeatureKey>`, `roleKeys`, `baseRole`) en `types.ts` · `getAccountContext` (cache()) + `requireAccountContext` + `requireFeature` + `FeatureNotEnabledError extends AuthError` en `context.ts` · `resolveVerticalPack`/`getNavForPack`/`VERTICAL_PACKS` en `vertical-pack.ts` · `esActivo`/`legacyBooleanFeatures`/`enabledFeatures`/`hasFeature` en `entitlements.ts` · `AccountContextProvider`/`useAccountContext`/`FeatureGate` en `client.tsx` · `provisionOrganization` en `provisioning.ts` · `isPlatformLayerEnabled` en `flags.ts`. Tabla `organization_entitlements` (`@@map`), modelo `OrganizationEntitlement`, `verticalTrackId` — CONFIRMADO.
2. **Snapshot byte-idéntico verde:** `navigation.test.ts` — invariante 16 items sin `requiresFeature`, fixture congelado por 4 roles, identidad `===` item a item con 6 variantes de access, `getNavForPack ≡ filterNavItems` por identidad+deep-equal+JSON, unión ADMIN∪SUPERADMIN cubre los 16 objetos por `===`, snapshots verdes. CONFIRMADO.
3. **Flag off correctamente condicionado:** imports de `lib/platform` en código de app SOLO en `app/(dashboard)/layout.tsx` (imports ESM estáticos, inevitables); TODA llamada está dentro de `if (isPlatformLayerEnabled())`, y `PlatformBoundary` sin account renderiza fragment puro. `Sidebar`/`BottomNav`/`LayoutShell` no importan nada de platform (solo el tipo `NavigationItem` de `navigation.ts`) y caen en `navItems ?? sidebarNavItems`. Cero queries con flag off probado por unit test (`context.test.ts`: getTenantProfile y findUnique NO llamados). CONFIRMADO (delta 5: cero llamadas/queries; los imports estáticos son inherentes al wiring aprobado en el plan §3).
4. **Migración NO aplicada a ninguna DB remota:** verificado READ-ONLY en prod (`list_tables` de Supabase `kvepqgikokjlacxngkiw`): NO existe `organization_entitlements`; `_prisma_migrations` sigue con 5 filas (baseline intacto). `migration.sql` es byte-idéntico al plan §1.3. CONFIRMADO — existe solo como archivo.
5. **Docs ajenos intactos:** `docs/PROJECT_BACKLOG.md` y `docs/SUPABASE_SELFHOST_MIGRATION_PLAN.md` siguen ` M` sin commitear; cero commits de la rama los tocan (`git log <base>..HEAD -- <docs>` vacío). CONFIRMADO.
6. **Cero secretos hardcodeados:** grep del diff completo (`sk-`, `api_key`, `token =`, `Bearer`, `password`, `secret`) sin matches; `.env.example` documenta `PLATFORM_LAYER=""` (solo `"1"` enciende). CONFIRMADO.

## Code review del diff completo (reviewer senior)

**Sin CRITICAL ni HIGH.** Tenant-safety: toda query nueva scoped — `context.ts` `findUnique({where:{id: profile.organizationId}})` del perfil autenticado + entitlements por relación + `effectiveRoleKeys(orgId, profileId)`; `provisioning.ts` escribe todo bajo el org recién creado en un solo `$transaction`. Autoridad server-side (`requireFeature` fail-closed, catálogo cerrado `isFeatureKey` ignora filas DB desconocidas); `FeatureGate` client es cosmético como manda el plan. Sin `console.log` debug (solo el `console.warn` deliberado del fallback del resolver).

| Sev | Hallazgo |
|---|---|
| MEDIUM (preexistente, ajeno a C1) | Worktrees stale bajo `.claude/worktrees/**` rompen `npm test`/`ci` a nivel repo (detalle arriba). Anotar para carril de higiene; no bloquea C1 |
| LOW | `layout.tsx:` `resolveVerticalPack(accountContext.verticalTrackId)` re-resuelve un trackId que `context.ts` ya normalizó (`pack.trackId`) — doble lookup determinístico, inofensivo |
| LOW | `flags.ts` exporta el alias `isPlatformLayerOn` (solo lo usa su propio test) — superficie extra sobre el contrato congelado; candidato a borrar post-C1 |
| NOTE | Con flag on, la nav se filtra server (getNavForPack) y se re-filtra client (filterNavItems) con el mismo rol — idempotente, probado ≡ por tests |
| NOTE | El chunk client de `client.tsx` entra al bundle esté el flag como esté (grafo de módulos); DOM idéntico con flag off — consecuencia aceptada del wiring del plan |

## Queda para Sergio

1. **Decidir el merge** de `feat/onia-c1-platform-shell` a `main` (la rama NO fue pusheada ni mergeada, por regla).
2. **Post-merge, runbook §1.4 (dueño único, orden no negociable):** aplicar en prod el SQL de `prisma/migrations/20260726000000_add_platform_layer/migration.sql` byte a byte vía 5432/session-mode o `execute_sql` (NUNCA `migrate deploy`/`db push`/`apply_migration`) → `npx prisma migrate resolve --applied 20260726000000_add_platform_layer` → verificación (5 columnas × 9 orgs, tabla+índices+FK, `migrate status` = mismas 4 dormidas, smoke login/dashboard/patients) → recién ahí deployar código (flag ausente = off) → encender `PLATFORM_LAYER=1` es decisión separada y reversible con restart. Todo esto quedó también documentado dentro del repo en `docs/DATABASE_MIGRATION_BASELINE_2026.md` (sección CONGELADO + runbook).
3. Pendiente menor opcional: smoke en vivo on→off→on en dev con DB local (el verificador no tiene DB local; la evidencia de flag-off = cero queries está cubierta por unit tests). Y la limpieza de worktrees stale (MEDIUM preexistente).