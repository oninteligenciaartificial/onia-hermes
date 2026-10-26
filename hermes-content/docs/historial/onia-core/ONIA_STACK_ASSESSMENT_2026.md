# Onia Stack Assessment 2026

Fecha: 2026-07-03.
Estado: evaluacion de arquitectura verificada contra los repos reales.
Owner: Onia / Hermes.

## Veredicto

El stack es correcto y ya cumple el consejo "usar PostgreSQL": **los 3
productos corren PostgreSQL 17** (via Supabase). No hay que cambiar de base.
Los riesgos reales no son de eleccion de producto sino de tres practicas:
aislamiento de tenant, sync offline artesanal y falta de motor compartido.

## Stack real verificado (2026-07-03)

| Capa | DentaGest | GestiOS | Ganadero OS |
|---|---|---|---|
| Framework | Next.js + TS | Next.js + TS | Next.js + TS |
| ORM | Prisma (+adapter-pg) | Prisma (+adapter-pg) | Prisma (+adapter-pg) |
| DB | Postgres 17 Supabase (us-west-2) | Postgres 17 Supabase (us-east-2) | Postgres (Supabase) |
| Auth | Supabase Auth (@supabase/ssr) | Supabase Auth | Supabase Auth |
| Extras | Upstash, Sentry, OpenAI, Remotion, n8n, Chatwoot | Upstash, Sentry, PostHog, Resend, Recharts, Zod | Resend, Zod, sync propio |
| Tests | Vitest (134) + Playwright | — | — |

Uniformidad: **excelente** — los 3 productos comparten el mismo patron. Para
una fabrica de verticales, esa uniformidad vale mas que cualquier optimizacion
puntual de un componente.

## Que mantener (no tocar)

1. **PostgreSQL**: ya esta. Postgres 17 gestionado, RLS habilitado en las 25
   tablas de DentaGest prod (verificado). Es la eleccion correcta y la que
   toda la industria converge.
2. **Next.js + TypeScript**: mainstream, contratable, y el mejor soportado por
   desarrollo asistido con IA. Cambiarlo seria costo sin retorno.
3. **Prisma**: el hype dice Drizzle, pero con 3 productos en Prisma y las
   migraciones recien saneadas (baseline 2026-07-03), migrar de ORM es
   destruir valor. Prisma moderno (driver adapters, typedSQL) rinde bien.
   Regla: no se cambia de ORM sin un dolor medible.
4. **n8n self-hosted en VPS**: correcto por costos; ya operativo.
5. **Vitest + Playwright, Sentry**: correcto.

## Los 3 riesgos reales (por prioridad)

### 1. Aislamiento de tenant (el riesgo #1 del negocio)

Prisma conecta con rol privilegiado: el RLS de Supabase protege el camino
PostgREST, pero **no** las queries de Prisma. Hoy el aislamiento depende de
que cada query lleve `where organizationId` a mano. Un olvido = datos de una
clinica visibles en otra = muerte comercial del SaaS.

Mitigacion (Sprint 1 de la adopcion, ya planificada):

- Tests de tenant safety automatizados.
- **Prisma Client Extension** que inyecte `organizationId` automaticamente en
  cada query de modelos tenant-scoped (patron $extends). Esto convierte el
  aislamiento de disciplina en garantia.
- Mantener RLS como segunda linea de defensa.

### 2. Sync offline artesanal (Ganadero OS)

`SyncDevice/SyncOperation/SyncConflict` hechos a mano son la pieza mas fragil
del portafolio. El sync correcto es un problema resuelto por productos
dedicados. Decision recomendada (ya en external research): evaluar
**PowerSync o ElectricSQL** sobre el mismo Postgres antes de escribir mas
logica de conflictos propia. Gate: no adoptar core en Ganadero hasta decidir.

### 3. Motor compartido inexistente (riesgo de la factory)

Los 3 productos comparten patron pero **cero codigo**. Cada mejora (panel del
dueno, work items, permisos) se copiara a mano entre repos => drift
garantizado y la fabrica de verticales no escala.

Plan: cuando Sprint 1-2 de DentalGest estabilicen los patrones, extraer
paquetes privados:

- `@onia/core-db`: schema Prisma parcial + client extensions (tenant guard,
  work items, approvals).
- `@onia/core-ui`: panel del dueno, cola pending, componentes de aprobacion.
- El contrato (`onia-core/contract.json`) pasa a validar tambien la version
  del paquete instalada en cada producto.

No hacerlo antes: extraer librerias de patrones no probados crea abstraccion
prematura.

## Costos e infraestructura (estrategia)

| Hoy | Cuando crezca |
|---|---|
| Supabase cloud por producto (~US$25/mes/proyecto pro) | Consolidar: el multi-tenant es por `organizationId`, no por proyecto Supabase. 100 clinicas = 1 proyecto DentaGest, no 100. |
| Vercel para deploy rapido | El stack selfhost ya existe (docker-compose.selfhost + VPS Hostinger). Migrar productos maduros al VPS cuando el costo cloud supere el costo de operarlos. |
| Upstash/Resend/Sentry free tiers | Revisar limites al pasar ~50 organizaciones activas. |

Regla: cloud para velocidad de venta, selfhost para margen. El baseline de
migraciones recien hecho es justamente lo que permite mover una DB sin drama.

## Que NO hacer

- No migrar a Drizzle/Kysely/raw SQL "porque es mas rapido".
- No cambiar Next.js por Remix/SvelteKit/etc.
- No adoptar microservicios: monolitos Next.js por producto es correcto a
  esta escala.
- No construir mas sync offline propio.
- No crear un proyecto Supabase por cliente.

## Acciones que salen de este assessment

1. Sprint 1 DentalGest: tenant guard via Prisma Client Extension + tests
   (sube de "tests de tenant safety" a garantia estructural).
2. Decision PowerSync vs ElectricSQL antes del adapter Ganadero.
3. Extraccion de `@onia/core-db` / `@onia/core-ui` despues de Sprint 2.
4. Politica de consolidacion multi-tenant documentada (1 proyecto por
   producto, no por cliente).
