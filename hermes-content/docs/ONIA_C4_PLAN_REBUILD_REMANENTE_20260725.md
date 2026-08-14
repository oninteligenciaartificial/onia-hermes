> ⚠️ **SUPERADO.** El estado vigente esta en `hermes-content/docs/ONIA_ESTADO_REAL_20260813.md`
> y la apuesta vigente en `docs/platform/ONIA_DECISION_SAAS_CONSULTORIA_20260813.md`.
> Este documento se conserva como historia: NO tomes decisiones con el.

# C4 — Plan aprobable: remanente onia-center + swap duro

> **Carril C4, fase estructura (read-only, nada ejecutado).** Fecha: 2026-07-25.
> HALLAZGO: el rebuild del monolito YA está hecho y en origin/main (tip 20569df4) — este plan re-scopea C4 a remanente + swap duro.
> Espera aprobación de Sergio (sección STOP al final).

---

# C4 — Plan de continuación del rebuild onia-center (fase ESTRUCTURA — para aprobar, nada ejecutado)

## 0. Estado real del rebuild (dónde está, desde qué base continuar)

**La premisa del carril está desactualizada: el rebuild ya se hizo, ya se swapeó y ya está en `origin/main`** (tip `20569df4`, 2026-07-23; cadena verificada `fbb9d3e6` → `e47b5a7d` swap → J-1..J-5 → `40990266`).

- `page.tsx` = redirect de 7 líneas a `/onia-center/next/hoy`; `operating-workspace.tsx` (~4.250 líneas) **eliminado**; ~40 componentes en `components/{shell,ui,views}/**` (22–260 líneas c/u) + rutas paralelas `next/{hoy,pipeline,agentes,finanzas,negocio}`. Cola de aprobación y agentes Vendedor/Día conservados y vivos.
- **Base para C4: rama nueva desde `origin/main` (`20569df4`).** No desde este worktree (`claude/git-status-935f47`): su árbol onia-center es idéntico a main (`diff` vacío) pero arrastra 9 auto-syncs ajenos y está 2 commits detrás.
- **Prerrequisito bloqueante:** `origin/claude/onia-colaboradores-sin-inversion-d69b19` (11 adelante / 8 detrás) tiene **Estudio de Contenido Fases 0-3 sin mergear** y toca `TopNav.tsx`, `live-runtime.ts`, `styles/tokens.css` y reduce `video-lab/page.tsx` a un redirect. **Mergearla (o rebasarla) a main ANTES de que C4 toque esos archivos.** `video-lab/` NO se reconstruye desde main.
- Ramas `onia-center-fase2` y `register-rebuild-hygiene`: mergeadas / pre-rebuild. Ignorar.

**Re-scope de C4:** no es "descomponer el monolito de 14k" — es (a) descomponer el **remanente** (~13k líneas de data/css/páginas legacy), (b) ejecutar el **swap duro** de rutas (`next/**` → canónicas).

## 1. Mapa de descomposición (tabla monolito → componentes)

**Ya extraído en main (ratificar, no re-hacer):** shell (`AppShell`/`TopNav`/`AssistantChatPanel`/`QuickCapturePanel`), `ui/*`, vistas `hoy` (7 comps + cola de aprobación `ReviewQueueTile`/`ReviewRow`), `pipeline` (8), `agentes` (6), `finanzas` (5), `negocio` (5). Cada `next/<vista>/page.tsx` es server component fino: auth (`lib/onia-center-auth`) + data (`lib/onia-center-store` + `live-runtime` + `operating-engine`) + props a vista client.

**Remanente a descomponer (el trabajo de C4):**

| Remanente | Líneas | Propuesta | Objetivo |
|---|---|---|---|
| `operating-source.ts` | 2.466 | Partir por dominio, solo MOVER (mismos exports): `data/agents.ts` (~350, incluye Vendedor/Día), `data/schedule.ts` (~370), `data/org.ts` (~180), `data/projects.ts` (~500), `data/collab.ts` (~200), `data/integrations.ts` (~950). Barrel de compat re-exporta; importadores intactos | 6 archivos + barrel |
| `live/live-runtime.ts` | 949 | Partir por lectura: `live/finance.ts` (~350), `live/agents.ts` (~400), `live/reviews.ts` (~120), `live/content.ts` (~80). Barrel; test existente sigue verde sin tocar | 4 módulos + barrel |
| `equipo/page.tsx` | 833 | Rebuild como el resto: server page fino + `components/views/equipo/{EquipoView,LeadsAsignados,DisponibilidadCal,ScorecardPanel}`; tokens en vez de css viejo | 4–5 comps de 100–200 |
| `onia-center.css` | 5.366 | NO portar. Muere cuando sus 4 importadores se liberen: `equipo` (rebuild), `login` (128 líneas, restyle trivial), `video-lab` (lo resuelve el merge de la rama Estudio), `web-factory` (carril B: extraer clases a css propio, coordinar) | borrar al final |
| `source.ts` / `engine.ts` / `types.ts` | 1.391 / 491 / 784 | NO reescribir (riesgo/beneficio malo): solo poda de exports muertos post-swap; partir `types.ts` por dominio solo si queda natural al mover data | poda, no rewrite |
| `operating-engine.ts` | 277 | Ya cumple tamaño. Sin cambio | — |

## 2. Orden de extracción + plan de swap sin romper main

**Orden (data/lib primero, páginas después, css al final, swap al ultimísimo):**

0. **Prerrequisito:** mergear/rebasar `onia-colaboradores-sin-inversion-d69b19` a main (Estudio 0-3 + video-lab redirect).
1. `live-runtime.ts` → 4 módulos + barrel (cero UI, test lo cubre; valida el patrón).
2. `operating-source.ts` → `data/*` + barrel (solo mover data; secuencial con 1 por `types.ts` compartido).
3. `login/page.tsx` a tokens (128 líneas; libera 1 de 4 importadores del css).
4. Rebuild `equipo/` al lado (`components/views/equipo/`), swap de esa página en commit propio.
5. `web-factory/page.tsx`: css propio (solo el css; coordinar con carril B — si no puede, se pospone el paso 6, el resto no se bloquea).
6. Borrar `onia-center.css` recién cuando `grep -rln "onia-center.css"` dé vacío.
7. **Swap duro de rutas** (abajo).
8. Poda post-swap de `source.ts`/`types.ts`/exports muertos.

**Plan de swap:** el swap blando ya ocurrió (`/onia-center` → `next/hoy`; prod ya sirve el panel nuevo). Queda el corte duro, **un solo commit coherente**: `git mv next/<vista>` a rutas canónicas + redirect raíz a `/onia-center/hoy` + actualizar links internos (`TopNav`, login) en el MISMO commit + **stubs `next/<vista>` con `redirect()` por 1–2 semanas** (bookmarks y botones Telegram/n8n apuntan a URLs viejas), luego borrarlos. Ningún paso toca `api/onia-center/**` ni `lib/onia-center-store.ts`. Rollback = revertir el commit del corte (data/API no cambian nunca). Tras el corte: redeploy VPS manual explícito (tarball) además del Vercel automático.

## 3. Gates y riesgos

**Gates por paso y en el corte:** `npx tsc --noEmit` en `web-factory/apps/site` · `pnpm test` (live-runtime + schedule-helpers) · `pnpm build` antes del commit de corte (los route-moves no los atrapa tsc) · smoke manual de 3 acciones (aprobar un review, disparar Vendedor, disparar Día) — hace de e2e mínimo, no hay suite del panel · code-reviewer antes de merge · `git diff --stat` del PR con **cero cambios** bajo `api/onia-center/**` y `lib/onia-center-*` (ningún paso los declara).

**Riesgos:** 1) casing de imports al crear `data/*`/`live/*` (Linux distingue; kebab/lowercase consistente). 2) Autosync FF de main con árbol parcial — archivos movidos + barrel en el MISMO commit ("los dos o ninguno"). 3) URLs viejas `/next/*` en notificaciones ya enviadas — mitigado con stubs. 4) `web-factory/page.tsx` es del carril B — solo con aviso. 5) `equipo/` lo usa la vendedora en vivo — rebuild al lado, swap en commit propio, smoke con rol seller. 6) Doble deploy Vercel + VPS manual — sin redeploy VPS, prod interno queda atrás. 7) No mergear la rama colaboradores primero = conflictos en `TopNav`/`live-runtime`/`tokens.css`.

## 4. STOP — lo que Sergio aprueba para arrancar el build

1. **Re-scope del carril:** C4 pasa de "descomponer el monolito" (ya hecho) a "remanente + swap duro" según este plan. ¿OK?
2. **Base:** rama nueva desde `origin/main` `20569df4` (no este worktree).
3. **Prerrequisito:** mergear `onia-colaboradores-sin-inversion-d69b19` (Estudio 0-3) a main antes de arrancar. ¿Lo mergea C4 o su dueño?
4. **Orden 0–8** y el criterio "poda, no rewrite" para `source.ts`/`engine.ts`/`types.ts`.
5. **Swap duro sí/no** y plazo de los stubs redirect (propuesto: 1–2 semanas).
6. **Coordinación carril B** para el paso 5 (css de web-factory); si no hay dueño disponible, el borrado del css se pospone sin bloquear el resto.

Aprobado esto, C4 arranca por los pasos 1–2 (data/lib, riesgo mínimo). Nada se ejecutó: plan read-only.