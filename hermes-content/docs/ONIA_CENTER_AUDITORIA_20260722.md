# ONIA Center — Auditoría de código (2026-07-22)

> Auditoría read-only por subagente sobre `main`: `middleware.ts`, `lib/onia-center-auth.ts`,
> `lib/onia-center-store.ts`, los 11 endpoints `api/onia-center/**`, `live/live-runtime.ts`, las
> páginas server `next/**` y `equipo/page.tsx`. **Estos fixes son código del panel → carril A
> (`onia-center-fase2`), NO este worktree.**

## Veredicto: sólido en lo fundamental. 0 críticos.
Sin secretos hardcodeados, sin `any`, sin `console.log`, sin `dangerouslySetInnerHTML`, sin TODO/FIXME.
Filtrado por rol consistente en lectura; las páginas fallan cerradas (EmptyState, no filtran datos).

## ALTO — atacar antes de sumar más gente al panel
1. **Escalada horizontal de escritura entre mismo rol** · `lib/onia-center-store.ts:842,858,899`
   `updateOniaCenterEntityStatus` filtra el dueño solo por ROL (`owner_role_key=eq.seller`), no por
   `userKey`. Con 2 vendedores, el vendedor A puede hacer PATCH del lead/tarea/idea del vendedor B
   (la LECTURA sí separa por `userKey` → inconsistente). Fix: añadir match por persona al `actorFilter`
   (`raw->>ownerUserKey=eq.{userKey}`) o columna `ownerUserKey`. *(Latente hoy: solo Camila activa.)*
2. **Sin refresh de sesión → logout forzado cada ~1h** · `api/onia-center/auth/login/route.ts:165` + `middleware.ts:142`
   Guarda `refresh_token` (30d) pero no hay ruta de refresh; el middleware ante 401 (~3600s) manda a
   login. El equipo es expulsado cada hora. Fix: `POST /api/onia-center/auth/refresh`
   (`grant_type=refresh_token`) + reintento en middleware antes de redirigir. **Bug operativo diario real.**

## MEDIO
3. Middleware fail-open sin config Supabase + acepta perfil no-`active` (`middleware.ts:106,131`). Filtrar `status=eq.active` + fail-closed en prod.
4. Sin validación de esquema en escrituras (`runtime/route.ts`, `store.ts:700+`): `payload as RuntimeLead` a ciegas. Validar con Zod en los bordes.
5. Briefing LLM aplicado sin validar + commit autónomo (`briefings/daily/route.ts:395`). Si el modelo devuelve forma inválida → 500 o tareas inventadas en DB. Validar contra schema, caer al `base` determinista.
6. URL de idea como href crudo (XSS/redirect) (`equipo/page.tsx:750`). Reusar `normalizeHttpUrl` (ya existe en live-runtime) antes de renderizar el `<a>`.
7. Sin rate-limit ni tope de costo en endpoints IA (`assistant/route.ts`, `audio-intelligence/route.ts`). Choca con "gasto-validar-primero". Añadir guard por `userKey` + contador diario.
8. Doble resolución de identidad por navegación (middleware + cada page): ~4-6 round-trips. Cachear con React `cache()`.
9. Tipos duplicados ya divergidos en `equipo/page.tsx:19-91` (no incluye `visibility`/`actualizacion_servicio`). Importar del store.
10. Cobertura de tests casi nula en lógica sensible (permisos, mappers del store, `canActorSeeScope`). Regla 80%.

## BAJO
11. Comparación de clave interna no constante (`maintenance/route.ts:41`, etc.) — timing attack teórico.
12. Logout no revoca refresh token server-side (`auth/logout`). Llamar `/auth/v1/logout`.
13. Flag `ONIA_AUDIO_INTELLIGENCE_ALLOW_LOCAL=true` abre audio sin login — documentar jamás activar en prod.
14. Archivos >800 líneas: `operating-source.ts` (2300, data OK), `store.ts` (945, lógica → partir mappers/reads/writes).
15. Comentario engañoso "Supabase/RLS" en `equipo/page.tsx:250` (el filtrado es en app con service role; RLS OFF).

## Orden recomendado (carril A)
`#2` (logout horario, molesta a diario) → `#1` (escalada, antes del 2º vendedor) → `#4`/`#5` (validación bordes + salida LLM) → resto incremental.
