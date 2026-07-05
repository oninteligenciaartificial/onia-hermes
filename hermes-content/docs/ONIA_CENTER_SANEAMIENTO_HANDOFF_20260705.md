# ONIA Center — Saneamiento y rediseño del panel (HANDOFF)

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
| 1 | Frenar spam de tareas (generador) | ✅ Código listo y verificado, commiteado. Falta DEPLOY + CLEANUP en prod. |
| 2 | Quitar/ocultar módulos vacíos (Leads, Ideas, Audio) | ⏳ Pendiente. Mapa en §Fase 2. |
| 3 | Rediseño visual + quitar rutina personal rígida | ⏳ Pendiente. §Fase 3. |

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

### Cambios hechos (commit `c9f528af`)
- `briefings/daily/route.ts`: ya NO re-prefija; usa `stripPlanPrefixes()` para
  limpiar prefijos apilados/legacy y deduplica tareas + notas por título base.
  Nota de briefing ahora es 1 por rol (sin fecha en el título) → deja de
  acumular. La fecha del plan va en el cuerpo, no en el título.
- `hygiene/daily/route.ts`: misma normalización; `titleExists()` compara título
  base → deja de crear duplicados diarios `[Higiene <fecha>]`.
- `onia-center-store.ts`: nuevos `stripPlanPrefixes()`,
  `countOniaCenterTasksByTitlePatterns()`,
  `deleteOniaCenterTasksByTitlePatterns()` (patrones ILIKE
  `[Plan *`, `[Briefing diario *`, `[Higiene *`).
- **NUEVO** `api/onia-center/maintenance/route.ts`: endpoint POST protegido por
  `ONIA_CENTER_INTERNAL_API_KEY`. `action:"cleanup_generated_tasks"`,
  `commit:false` = cuenta cuántas matchean; `commit:true` = las borra.

Verificado local: `tsc --noEmit` limpio; regex probada contra títulos apilados
y legacy (incluye variantes con/sin espacio entre corchetes).

### PENDIENTE Fase 1 (acciones en producción — requieren OK de Sergio)
1. **Deploy** del código a VPS (ver §Deploy). Sin deploy, el generador sigue
   apilando cada mañana.
2. **Limpiar las 61 acumuladas** — tras deploy, ejecutar el endpoint de
   mantenimiento (borra filas en la DB, irreversible):
   ```bash
   # desde el VPS (donde ONIA_CENTER_INTERNAL_API_KEY vive en el entorno del contenedor)
   # dry-run primero:
   curl -s -X POST https://center.onia.com.bo/api/onia-center/maintenance \
     -H "Authorization: Bearer $ONIA_CENTER_INTERNAL_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"action":"cleanup_generated_tasks","commit":false}'
   # si el conteo es razonable, commit:true para borrar.
   ```
3. (Opcional, mitigación inmediata sin deploy) Desactivar temporalmente el
   workflow n8n `ONIADailyBrief001` para parar la sangría hasta el deploy.

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
