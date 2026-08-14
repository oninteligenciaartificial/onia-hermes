> ⚠️ **SUPERADO.** El estado vigente esta en `hermes-content/docs/ONIA_ESTADO_REAL_20260813.md`
> y la apuesta vigente en `docs/platform/ONIA_DECISION_SAAS_CONSULTORIA_20260813.md`.
> Este documento se conserva como historia: NO tomes decisiones con el.

# Onia Center — Saneamiento y rediseño del panel (HANDOFF)

Fecha: 2026-07-05. Rama de trabajo: `claude/dreamy-cartwright-dda93b`.
Objetivo global: que Sergio entre a `center.onia.com.bo/onia-center` y vea SOLO
datos reales y accionables — limpio, entendible, sin spam de tareas ni módulos
vacíos.

> Panel EN PRODUCCIÓN. No romperlo. Deploy por rebuild en VPS (ver §Deploy).
> Coordinar con `COORDINATION_MANIFEST.md` antes de tocar los archivos grandes
> (page.tsx, operating-workspace.tsx, onia-center.css) — otra sesión edita
> web-factory.

---

## Estado por fase

| Fase | Qué | Estado |
|------|-----|--------|
| 1 | Frenar spam de tareas (generador) | ✅ HECHO EN PROD (2026-07-05): deploy de main + cleanup de 55 tareas + workflow reactivado. Ver §Fase 1 ejecutada. |
| 2 | Quitar/ocultar módulos vacíos (Leads, Ideas, Audio) | ✅ Hecho en rama `claude/great-chandrasekhar-3c99b6` (2026-07-05). Ver §Fase 2 addendum. |
| 3 | Rediseño visual + quitar rutina personal rígida | ✅ Hecho en rama `claude/great-chandrasekhar-3c99b6` (2026-07-05). Ver §Fase 3 addendum. |

> ADDENDUM 2026-07-05 (rama `great-chandrasekhar-3c99b6`, sobre `main` post-PR#16):
> Fase 2 y 3 ejecutadas. Gates verdes: `tsc --noEmit` (exit 0), `next lint`
> (0 errores), `/onia-center` renderiza HTTP 200 (compilación limpia, sin errores
> de consola). Falta solo el DEPLOY (carril M1/infra) — este PR NO despliega.
>
> **Fase 2 — hecho:**
> - Seeds estáticos que se hacían pasar por datos vivos ELIMINADOS
>   (`starterTasks`, `starterReviews`, `starterCodexJobs` en operating-workspace.tsx).
>   El fallback "si runtime vacío → mostrar seed" se quitó: tasks/reviews/codexJobs
>   ahora usan `runtime.data.*` directo → empty-state honesto. Imports muertos
>   (`operatingTasks`, `collabIngestionItems`) removidos.
> - Empty-state honesto agregado a "Revisión collab" (antes `.map` a secas → en
>   blanco cuando vacío). Ideas/Codex/Tareas-del-día ya tenían guard.
> - **Audio IA** oculto del nav (quitado de `navItems` + `heroActionItems` +
>   import `Mic`); el widget sigue en operating-workspace.tsx, se reactiva
>   re-agregando el item. "Esconder hasta usarlo".
> - `operatingProjects`/`operatingTasks`: REVISADOS, se CONSERVAN. Son el
>   portafolio/roadmap real de Onia (no spam) y alimentan el summary operativo y
>   las vistas de proyectos vía operating-engine. Ya no se filtran a la lista de
>   tareas vivas (eso era `starterTasks`, ahora removido), así que no simulan
>   tareas de usuario.
>
> **Fase 3 — hecho:**
> - `sergioStrictScheduleBlocks`: 6 bloques personales ELIMINADOS (wake-reset,
>   lunch-reset, gym, girlfriend, shutdown, sleep). Quedan 7 bloques de trabajo
>   (categorías planning/sales/deep_work/meetings/admin).
> - Renders reencuadrados de "rutina estricta personal" a "agenda operativa":
>   preview diario (tarjeta "Gym + personal" → "Cierre 16:30-17:15") y pestaña
>   Calendario ("Hora de levantarse" + "Gym + novia + dormir" → "Arranque 07:00"
>   + "Cierre del día"; título "Calendario estricto" → "Agenda operativa").
> - `briefings/daily/route.ts`: filtro de `calendarBlocks` sin "gym"/"personal".
> - Nota: "agenda estricta"/"cronograma estricto" en planes de agentes
>   (page.tsx:872, operating-source.ts:481) se DEJARON — son disciplina de
>   scheduling operativo, no rutina personal.

---

## FASE 1 — Spam de tareas (CÓDIGO HECHO)

### Causa raíz (confirmada)
`briefings/daily/route.ts` → `commitBriefing()` prefijaba cada título con
`[Plan <fecha>]`, pero `pendingTasksForRole()` **re-ingiere tareas existentes**
(incluyendo las que el propio generador creó ayer). Al re-prefijar se apilaba:
`[Plan 2026-07-04] [Plan 2026-07-03] Actualizar CRM…`. El dedup comparaba el
título COMPLETO (con fecha), así que nunca coincidía → tarea nueva cada día.
Resultado: 61+ tareas basura. El workflow n8n `ONIADailyBrief001` (cron 06:45,
`commit:true`) está **activo en prod** (el JSON del repo dice `active:false`
pero es solo la plantilla; runbook confirma `active=true`).

Persistencia real: Supabase self-hosted, schema `onia_center`, tabla `tasks`
(NO `work_items`; NO la base dentalgest-staging que se revisó). Store:
`web-factory/apps/site/src/lib/onia-center-store.ts`.

### IMPORTANTE — otra sesión ya arregló `briefings/daily` en `main`
Commit `3d87f093` (en `main`) resolvió el mismo bug con `basePlanTitle()` +
dedup por título base (mantiene UN prefijo `[Plan <fecha>]`, no lo apila). Ese
mismo commit **también empezó Fase 2/3**: el inicio "Hoy en Onia" en
operating-workspace.tsx ahora sólo muestra bloques operativos
(planning/sales/deep_work/meetings/admin), NO la rutina personal, y oculta las
tarjetas de métricas en 0 (leads/ideas/audio). → No re-hacer eso.

Este PR (rama `claude/dreamy-cartwright-dda93b`, rebasada sobre main) ya NO toca
`briefings/daily` (usa la versión de main). Aporta lo que main NO tiene:
- `hygiene/daily/route.ts`: `titleExists()` compara título base (vía
  `stripPlanPrefixes`) → deja de crear duplicados diarios `[Higiene <fecha>]`.
  (El fix de main no tocó higiene.)
- `onia-center-store.ts`: `stripPlanPrefixes()`,
  `countOniaCenterTasksByTitlePatterns()`,
  `deleteOniaCenterTasksByTitlePatterns()` (patrones ILIKE
  `[Plan *`, `[Briefing diario *`, `[Higiene *`).
- **NUEVO** `api/onia-center/maintenance/route.ts`: endpoint POST protegido por
  `ONIA_CENTER_INTERNAL_API_KEY`. `action:"cleanup_generated_tasks"`,
  `commit:false` = cuenta; `commit:true` = borra las 61 acumuladas. **main
  previene nuevas pero NO limpia las viejas — este endpoint sí.**

Verificado local (post-rebase): `tsc --noEmit` limpio.

### Mitigación aplicada 2026-07-05
- **Workflow n8n `ONIADailyBrief001` DESACTIVADO** (`active:false`, vía n8n MCP).
  Fuente principal del spam (títulos apilados `[Plan …]`) frenada. Re-publicar
  (`publish_workflow`) sólo DESPUÉS de desplegar el fix.
- **Pendiente/secundario:** el GitHub Action `.github/workflows/onia-hygiene-daily.yml`
  (cron `0 10 * * *`, `commit=true` en schedule) sigue activo y crea tareas
  `[Higiene <fecha>]` a diario hasta que se despliegue el fix de higiene.
  Contribuyente menor (≤12/día). Para frenarlo también:
  `gh workflow disable "ONIA Daily Project Hygiene"` (o desplegar el fix). El
  cleanup del maintenance ya borra las `[Higiene *]` acumuladas.

### Fase 1 ejecutada (2026-07-05, sesión infra)
1. **Deploy** de `origin/main` (fbabfe17, incluye el fix 87b0bbb9 + saneamiento
   b0d2747d) al VPS por rebuild standalone. Scripts commiteados en
   `hermes-content/deploy/onia-center/`:
   - `build-and-stage.sh` (build aislado, no toca prod) + `swap-and-verify.sh`
     (backup + swap + restart + health-check con rollback). Paquete = `git archive`
     code-only (excluye `data/references`, `public/nuvia`, `data/clients/nuvia.assets`
     — assets estáticos reusados del runtime vivo). Subida con `scripts/vps-put.js`
     (usar `MSYS_NO_PATHCONV=1` en Git Bash o las rutas remotas se corrompen).
   - Backup del runtime previo: `/opt/onia-center/runtime-next.bak-deploy-20260705185430`.
   - Verificado: login 200, `maintenance` y `briefings/daily` (dry-run) 200.
2. **Cleanup**: 55 tareas auto-generadas borradas vía
   `maintenance-cleanup.js` (`docker exec -e MCHECK_COMMIT=true -i onia-center node -`).
   Dry-run posterior: 0 restantes. El fix desplegado evita que se regeneren.
3. **Reactivado** `ONIADailyBrief001` (`publish_workflow`) → `active:true`. El cron
   06:45 vuelve a correr con `commit:true` sin apilar prefijos.

Re-ejecutar el cleanup a futuro (patrones `[Plan *`/`[Briefing diario *`/`[Higiene *`):
`docker exec -i onia-center node - < /opt/onia-center/_deploy/maintenance-cleanup.js`
(dry-run) y con `-e MCHECK_COMMIT=true` para borrar.

---

## Deploy (rebuild en VPS)

Fuente: `hermes-content/docs/ONIA_CENTER_DAILY_N8N_BRIEFING_RUNBOOK_2026.md` y
memoria `vps-access-and-deploy`.
- VPS 187.77.16.63 (Easypanel), llave `~/.ssh/onia_hermes_vps_ed25519`.
- Deploy por tarball (no git): empaquetar `web-factory/`, subir a
  `/opt/onia-center-src/web-factory`, rebuild con `ONIA_STANDALONE_BUILD=true`,
  promover a `/opt/onia-center/runtime-next` (guardar backup
  `runtime-next.bak-<ts>` como el 2026-06-30). Contenedor manual necesita
  `--env-file` + `PORT=3012`.
- Verificar tras deploy: login 200, `/api/onia-center/briefings/daily`
  `commit:false` responde `daily_briefing_dry_run`, y el maintenance dry-run.

---

## FASE 2 — Módulos vacíos (PENDIENTE)

Objetivo: quitar u ocultar lo que no tiene datos reales (Leads=0, Ideas=0,
Audio/propuestas=0) o conectarlo a datos reales. Preferir empty-states honestos
o eliminar la sección si no aplica.

### Mapa del sidebar (page.tsx)
`navItems` en **page.tsx:158-184** (24 entradas, 7 grupos). Render:
`groupedNavItems` (page.tsx:561-566), filtrado por rol vía `allowedNavItems`
(page.tsx:550-552). Cada item → `/onia-center?view={id}`; nav en
page.tsx:731-760.

| Grupo | Items |
|------|-------|
| Trabajo (159-165) | Hoy, Captura, Calendario, Asistente, **Audio IA**, **Ideas**, Codex |
| Ventas (166-168) | Servicios, Comisiones, Evidencias |
| Entrega (169-172) | Proyectos, Tareas, Collab, Bolivian |
| IA y automatización (173-176) | Agentes, Integraciones, Web Factory, Premium |
| Dinero (177-178) | Finanzas, Nuvia |
| Dirección (179-181) | CEO, Roles, Arthur |
| Archivo (182-183) | Seguridad, Archivo |

### Módulos "vacíos" y su origen
- **Audio IA / propuestas** — nav id `audio-intelligence` (page.tsx:163).
  Widget en operating-workspace.tsx:2685-3196; consume
  `/api/onia-center/audio-intelligence` (op-workspace.tsx:2614). Estado
  `audioFile/audioTranscript/audioResult` (2512-2518). Sin datos = placeholders
  "Sin evaluar / por verificar". → Es real (endpoint existe) pero sin uso;
  decidir: ocultar hasta usarlo o dejar como herramienta de carga.
- **Ideas** — nav id `ideas` (page.tsx:164). Estado `ideas` init vacío
  (page.tsx:1499), fetch runtime (1559). `visibleIdeas` (1662-1664);
  `summary.ideasInbox` (1727). Sin datos = lista vacía silenciosa. → Fuente real
  (Supabase idea_inbox); dejar con empty-state claro o quitar del nav si nunca
  se usa.
- **Leads** — no es nav directo; fluye por Captura y métricas. Estado `leads`
  (page.tsx:1495), fetch runtime (1555). `visibleLeads` (1646-1648);
  `summary.hotLeads` (1721). → Fuente real (Supabase leads); dejar.
- **Codex** — nav id `codex` (page.tsx:165). Estado `codexJobs` (1500) **seed
  con `starterCodexJobs` hardcode (page.tsx:527-590)** → nunca está en cero de
  verdad. `visibleCodexJobs` (1666-1673). → Revisar: el seed hardcode da
  falsa sensación de datos; quitar seed o marcarlo.

Regla de decisión por módulo:
- Tiene fuente real y a veces datos → dejar, con empty-state claro.
- No tiene fuente real / siempre 0 / seed hardcode → quitar del sidebar y del
  render (o quitar el seed).
- Debería tener datos reales (agenda) → conectar (ver Fase 3 / integraciones).

> Origen de datos exacto (static vs runtime) por dominio: se completa con el
> segundo agente (data sources) — anexo abajo.

---

## FASE 3 — Rediseño visual (PENDIENTE)

Aplicar reglas de diseño web del usuario (jerarquía por escala, quitar relleno
uniforme, datos que sirven para decidir; anti-template).
- Simplificar sidebar a lo operativo: agenda real, tareas reales, captura.
- Reducir secciones (Trabajo/Ventas/Entrega/IA/Audio/Ideas) a lo que decide.

### Rutina personal rígida a quitar
Array `sergioStrictScheduleBlocks` en **operating-source.ts:42-206**. Bloques
personales (visibility `sergio_private`) a eliminar del view de trabajo:

| ID | Líneas | Título | Horario |
|----|--------|--------|---------|
| sergio-wake-reset | 43-55 | "Levantarse, agua, aseo, cero telefono" | 06:30-07:00 |
| sergio-lunch-reset | 107-117 | "Almuerzo y reset" | 12:30-13:15 |
| sergio-gym | 156-167 | "Gym protegido" | 17:30-19:00 |
| sergio-girlfriend | 169-180 | "Tiempo novia / vida personal" | 20:00-22:30 |
| sergio-shutdown | 182-193 | "Apagar trabajo, preparar manana" | 22:15-23:00 |
| sergio-sleep | 195-205 | "Dormir" | 23:00-06:30 |

Bloques de trabajo a conservar: sergio-ceo-plan (57-68), sergio-sales-block
(70-81), sergio-deep-work-am (83-93), sergio-meeting-window-am (95-105),
sergio-delivery-block (119-129), sergio-meeting-window-pm (131-141),
sergio-admin-close (143-154).

Render de estos bloques (a filtrar/limpiar, no solo el array):
- operating-workspace.tsx:~3018-3029 (preview daily, `.slice(0,7)`)
- operating-workspace.tsx:~3173-3190 (calendario completo, `.map()`)

Nota: `sergioStrictScheduleBlocks` también lo usa
`briefings/daily/route.ts:283-292` para `calendarBlocks` — al editar el array,
verificar que el briefing siga filtrando por categoría correctamente (ya filtra
por `["planning","sales","deep_work","meetings","admin","gym","personal"]`;
quitar "gym"/"personal" de ese filtro también si se quitan los bloques).

> Archivos grandes — coordinar en COORDINATION_MANIFEST antes de editar:
> page.tsx (1875), operating-workspace.tsx (4208), onia-center.css (93KB).

---

## Reparto sugerido para la próxima sesión (subagentes)

1. **hermes-automation / build-error-resolver** — Deploy Fase 1 al VPS + correr
   maintenance cleanup + verificar. (Requiere SSH; NO delegar a agente sin
   confirmación humana por ser producción + borrado DB.)
2. **web-factory-builder (o edición directa)** — Fase 2: quitar módulos vacíos
   en page.tsx / operating-workspace.tsx según el mapa. Coordinar manifest.
3. **web-factory-builder + design skills (impeccable/taste)** — Fase 3:
   rediseño y quitar rutina personal. Después de Fase 2.
4. **code-reviewer + typescript-reviewer** — revisión tras Fase 2/3 antes de
   deploy.

Orden: terminar Fase 1 en prod → Fase 2 → Fase 3. No mezclar.

---

## ANEXO — Origen de datos por dominio (static vs runtime)

Hallazgo clave: **Leads, Tasks, Reviews, Notes, Ideas, CodexJobs YA están
conectados en vivo** a Supabase (`getOniaCenterRuntime()`,
onia-center-store.ts:551-581, vía `/api/onia-center/runtime`). Están "vacíos"
sólo porque aún no hay registros — NO porque estén desconectados. Decisión Fase
2: dejarlos con empty-state honesto (o esconder del nav hasta que se usen), no
borrarlos.

Lo que SÍ es estático/hardcode (parece dato pero no lo es):

| Dominio | Origen | Ref |
|--------|--------|-----|
| Leads/Tasks/Reviews/Notes/Ideas/CodexJobs | **Runtime Supabase (vivo)** | onia-center-store.ts:551-581 |
| Rutina personal / bloques estrictos | **Static hardcode** | `sergioStrictScheduleBlocks` operating-source.ts:42-206 |
| Ventanas de reunión | **Static hardcode** | `sergioMeetingWindows` operating-source.ts:208-229 |
| Política de booking comercial (Cal.com) | Static config; Cal.com NO sincroniza en UI | `commercialBookingPolicy` operating-source.ts:231-414 |
| Proyectos operativos | **Static seed** (no Supabase) | `operatingProjects` operating-source.ts:~899 |
| Tareas operativas (para summary) | **Static seed** (distinto de tasks runtime) | `operatingTasks` operating-source.ts:~1128 |
| Codex jobs seed | **Static hardcode** (da falso "no-vacío") | `starterCodexJobs` page.tsx:527-590 |
| Agentes / planes mensuales | **Static** | `operatingAgents` ~472, `agentMonthlyPlans` ~643 operating-source.ts |
| Conectores de integración / calendar plans | **Static status docs** ("prepared_pending_connection") | `integrationConnectors` ~1555, `calendarConnectorPlans` ~728 operating-source.ts |
| Centros contables | **Static** | `accountingCenters` source.ts:389-446 |
| Roles / permisos | **Static** | `roleDefinitions` source.ts:448-592 |
| Audio IA / propuestas | API real (`audio-intelligence/route.ts`), pero sólo análisis LLM efímero; NO guarda propuestas | route.ts:302-323 inyecta catálogo estático como contexto |

Agenda real: **NO conectada.** Sólo bloques estáticos + Google Calendar ID
hardcode (`oninteligenciaartificial@gmail.com`, operating-source.ts:238) + plan
n8n marcado "planned". Para "agenda real" (objetivo del brief) hay que
implementar lectura de Cal.com self-hosted (`cal.onia.com.bo`) o Google
Calendar vía n8n → nuevo endpoint runtime.

Implicación Fase 2/3: el mayor ruido no son los módulos runtime vacíos, sino el
contenido estático que aparenta ser dato real (proyectos/tareas operativas seed,
Codex seed, rutina personal). Priorizar: (1) quitar rutina personal del view de
trabajo; (2) quitar/limpiar seeds estáticos o marcarlos como demo; (3) empty-
states honestos en los módulos runtime; (4) conectar agenda real como feature
aparte.
