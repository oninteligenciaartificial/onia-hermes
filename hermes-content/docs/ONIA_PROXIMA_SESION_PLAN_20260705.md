> ⚠️ **SUPERADO.** El estado vigente esta en `hermes-content/docs/ONIA_ESTADO_REAL_20260813.md`
> y la apuesta vigente en `docs/platform/ONIA_DECISION_SAAS_CONSULTORIA_20260813.md`.
> Este documento se conserva como historia: NO tomes decisiones con el.

# Onia — Plan de próxima sesión (2026-07-05)

Fecha: 2026-07-05. Propósito: UN solo plan deduplicado y priorizado del backlog
abierto de Onia. Auditoría read-only de 3 fuentes:

- `onia-core/ONIA_PENDIENTES_HANDOFF_20260704.md` (incl. §0 PROGRESO 2026-07-05)
- `ONIA_SYSTEM_TASKBOARD_2026.md`
- `hermes-content/docs/ONIA_CENTER_SANEAMIENTO_HANDOFF_20260705.md`
  (vive en la rama `claude/dreamy-cartwright-dda93b`, aún NO en la rama de trabajo
  actual `claude/landing-focus` — ver nota de higiene al final)

Lo ya marcado HECHO en §0 del handoff (A4 spam fix deployado, sesión A5, panel
vendedora/cotizador, Arthur, plan prospección Semana 1) NO entra a este plan.
También excluidos como cerrados: A2 (código bridge `/tarea` y `/dentalgest`
mergeado, commit `c8660a38` + doc `HERMES_PRODUCT_BRIDGE_2026.md`) y A3 (plan
SIAT en main, `ONIA_SIAT_CERTIFICACION_PLAN_2026.md`). Sus colas abiertas (claves
en VPS, NIT) quedan como ítems BLOQUEADO-SERGIO abajo.

## Leyenda de categorías

- **(a) AGENTE-YA** — se termina ahora con un subagente dentro de `onia-hermes`,
  sin bloqueo humano ni MCP externo. Lleva prompt self-contained.
- **(b) BLOQUEADO-SERGIO** — requiere acción humana (NIT, secret en n8n, API keys,
  validar precios, columnas TR4 de Saúl, verificación Meta, cambiar password).
- **(c) OTRO-REPO** — vive en otro repo o sesión propia (GestiOS, DentaGest,
  Bolivian Electric).
- **(d) NECESITA-MCP/INFRA** — requiere n8n MCP, VPS/SSH, Supabase, etc.

## Resumen por categoría

| Cat | Ítems | IDs |
|-----|-------|-----|
| (a) AGENTE-YA | 4 | P1-PROPUESTAS, P2-SANEAMIENTO-F2, P3-SANEAMIENTO-F3, P4-SELF-SERVICE-LANDING |
| (b) BLOQUEADO-SERGIO | 9 | S1-PRECIOS, S2-NIT-SIAT, S3-SECRET-INTAKE, S4-TR4-COLS, S5-META, S6-IG-TOKEN, S7-KEYS-TAVILY-FAL, S8-FISCAL, S9-PASSWORD |
| (c) OTRO-REPO | 7 | R1-GESTIOS-CORE, R2-DENTAGEST-UI (✅ cerrado), R3-BE-FASE1, R4-DENTAGEST-SELFSERVE (✅ cerrado), R5-EXTRACT-PKGS, R6-DENTAGEST-MODULES-ADOPTION (✅ cerrado, commit 96b89a9), R7-DENTAGEST-DENTAL-MODULE |
| (d) NECESITA-MCP/INFRA | 6 | M1-SANEAMIENTO-DEPLOY, M2-N8N-AUTONOMIZAR, M3-N8N-CLEANUP, M4-RADAR-WORKITEM, M5-LANDED-COST, M6-HIGIENE-INFRA |

Total ítems abiertos deduplicados: 24 (fusionados ~11 duplicados cruzados entre
fuentes; ver §Notas de deduplicación).

Orden de ejecución sugerido (impacto VENDER/COBRAR primero): **P1 → P2 → P4 → P3**,
luego destrabar S1/S3 con Sergio (2 min c/u), luego infra M1/M2.

---

## Ejecución en paralelo — sesiones y carriles

**7 carriles cubren el 100% del backlog ejecutable por agente, sin chocar.** El
choque sale de 3 recursos compartidos: los mismos archivos, la rama `main`, y la
infra única (n8n/VPS/Supabase/tokens). Aislás eso y paralelizás.

| # | Sesión (nombre) | Repo · carpeta dueña | Ítems | Nota |
|---|---|---|---|---|
| A | `onia-center-saneamiento` | onia-hermes · `web-factory/apps/site/src/app/onia-center/**` + `api/onia-center/**` | P2 → P3 | P2 y P3 SECUENCIALES (mismos archivos) |
| B | `wf-landing-dentalgest` | onia-hermes · landings `src/app`, `data/clients`, `templates`, `harvester` | P4 + E1-E6 | comparte config raíz con A/C |
| C | `propuestas-v2` | onia-hermes · `hermes-content/propuestas` + `docs` + `skills` | P1 | carpeta aislada, cero choque |
| D | `dentagest-core-ui` | repo DentaGest | R7 (R2/R4/R6 ✅ cerrados) | repo aparte = cero choque; primer producto con adopción completa del core |
| E | `gestios-core` | repo Gestios | R1 → R5 | R5 después de R1 |
| F | `bolivian-electric-fase1` | repo Bolivian Electric | R3 | repo aparte |
| G | `infra-deploy-n8n` | infra (n8n/VPS/Supabase) | M1 → M2 → M3-M6 | UN solo dueño, SERIAL; M1 requiere OK humano |
| H | `contenido-higgsfield` | onia-hermes · `hermes-content/references` + `skills`(video/IG) + `scripts`(video/ig) + `.hermes/video-lab` + assets | producción continua (carruseles, video, IG) | usa Higgsfield MCP + token IG; NO toca código de apps |
| I | `research-estrategia` | onia-hermes · `hermes-content/docs/research/**` (nuevo) + lectura read-only global | analizar productos ganadores + validar ventures | NO codea productos; entrega docs de decisión |
| J | `video-remotion` | onia-hermes · `scripts/remotion` o `apps/video` (nuevo) + skill `remotion` | video programático (React) para marketing/producto | distinto de H (H = generativo Higgsfield) |
| Core | `onia-core` (bajo demanda) | onia-hermes · `onia-core/**` | cambios de contrato/schema/adapters | v0.6.1, CORE COMPLETO (2026-07-06): 18 entidades, 5 módulos (commerce/knowledge/accounting/invoicing/payroll) validados, capa plan-por-negocio. Sigue CONGELADO para instalación en repos producto salvo adopción aprobada; abrir solo para correcciones de datos como R6 |

**Iniciativas nuevas (2026-07-05) — pasan por el carril I antes de construirse:**
- Analizar productos ganadores (Halter, Medvi, etc.) → extraer el patrón que
  gana y qué es replicable por Onia.
- Ventures a validar: (1) importadora automatizada con IA (cruza con M5 landed
  cost / TR4); (2) motor de venta diaria — Onia levanta webs y vende sus
  softwares a todo negocio (ejecución = carril B web-factory + C propuestas + H
  contenido + prospección n8n); (3) empresa tipo Nuvia (storefront productizado).
- "Propuestas dentro del sistema": acción "generar propuesta" desde el panel
  (backlog de carril A/onia-center; hoy es sesión C).
Regla: I decide/valida con fuentes (skills `deep-research`/`office-hours`); si un
venture gana, su ejecución va al carril que corresponde (B, repo nuevo, etc.),
nunca todo en una sesión.

Dos tipos de carril: **backlog** (A-G, cierran ítems P/R/M) y **operación
continua** (H contenido, y el bot Hermes) que no "terminan" — producen a diario.

**Reglas duras (no chocar):**
- 1 carril = 1 worktree = 1 rama = 1 dominio de archivos.
- A/B/C comparten el repo onia-hermes: distinta carpeta, y **AVISAR** antes de
  tocar los 4 archivos raíz de web-factory (`next.config.ts`, `layout.tsx`,
  `globals.css`, `package.json`).
- D/E/F son repos separados → paralelo libre.
- G (infra) = recurso único: **nunca dos sesiones tocando n8n/VPS/DB a la vez.**

**Olas (para no abrir 7 de golpe):**
- **Ola 1 (abrir ya — sin bloqueos, cero solape): C, A, D, E** (P1, P2, R2, R1).
- **Ola 2: B, F, G** (P4, R3, M1→…). G corre en paralelo pero **deploya después**
  de que A/C estén en main; no re-publica el n8n `ONIADailyBrief001` hasta M1.

**Cross-deps:** M1 deploy tras P2/P3 en main · M2 no re-publica ONIADailyBrief001
hasta M1 · R1/R4 usan precios firmes (S1) · R5 tras R1 · Sergio destraba S1-S9.

**Cómo terminarlo (cada carril):** rama propia → `git rebase origin/main` antes
de mergear → commits chicos por carpeta → merge frecuente a main (FF) → gates
(`tsc --noEmit`, `pnpm e2e` donde aplique, code-reviewer) antes de cerrar. Un
ítem se cierra cuando su código está en main (y en prod para los M-*). El board
de este doc (§(a)-(d)) es el checklist.

---

## (a) AGENTE-YA — máxima prioridad (vender / cobrar / limpiar lo que Sergio ve)

### P1-PROPUESTAS — Generar propuestas oficiales con precios v2
Prioridad 0. Impacto directo en cerrar ventas. Fusiona PENDIENTES C4 +
TASKBOARD X2. (La validación de precios v2 es aparte → S1; se puede generar el
borrador ya y validar el número antes de enviar al cliente.)

```
Proyecto onia-hermes (C:\dev\proyectos\onia-hermes). Genera propuestas con el
sistema oficial, NUNCA HTML a mano: hermes-content/propuestas/generador/
(node generar-propuestas.js <slug> --pdf; clientes en clientes.json).

Produce dos propuestas:
(1) DentalGest — planes 390 / 890 / 1990 Bs (pymes) + Empresarial E1 (4.900 USD
    setup + 490 USD/mes).
(2) ONIA Empresarial E1/E2 con ancla TR4 (USD 20k).

Reglas OBLIGATORIAS (CLAUDE.md del repo, sección "Propuestas comerciales" +
skill hermes-content/skills/propuestas-comerciales-onia.md):
- 3 niveles diferenciados por SALTO DE VALOR, no por "más páginas":
  N1=estar online, N2=convertir, N3=automatizar. Explicar la diferencia en una
  línea en notaPaquetes.
- resultado por paquete (frase concreta, no lista de features).
- valor[] "Por qué te conviene" con ROI real (automatización, más clientes,
  ahorro de tiempo, autoridad).
- Dominio + hosting a cargo del cliente, a su nombre (nunca en el precio).
- Terceros excluidos: dominio, hosting, comisión pasarela, créditos IA,
  mensajería WhatsApp pagada, pauta.
- WhatsApp: botón click-to-chat INCLUIDO; el chatbot IA es el add-on pago.
- No fabricar datos del cliente; si falta brochure/sector, marcarlo.

Fuente de precios: onia-core/ONIA_CATALOGO_COMERCIAL_2026.md (ancla TR4) y
hermes-content/propuestas/ONIA_CATALOGO_PRECIOS_2026.md (catálogo del kit
vendedora). Si los números difieren entre ambos catálogos, NO inventar: usar
ONIA_CATALOGO_COMERCIAL_2026.md como fuente y dejar una nota TODO para que
Sergio confirme (ver ítem S1-PRECIOS). Verifica: node generar-propuestas.test.js
verde antes de cerrar. Genera los PDF y reporta las rutas de salida.
```

### P2-SANEAMIENTO-F2 — Onia Center: quitar/ocultar módulos vacíos y seeds hardcode
Prioridad 1. Impacto: lo primero que Sergio ve al entrar al panel. Solo edición
de código en `web-factory/apps/site` (sin infra). Del saneamiento handoff Fase 2 +
Anexo. **Depende de M1 (deploy) para verse en prod, pero el código se hace ya.**

```
Proyecto onia-hermes (C:\dev\proyectos\onia-hermes), app web-factory/apps/site.
Ejecuta la FASE 2 del saneamiento de ONIA Center descrita en
hermes-content/docs/ONIA_CENTER_SANEAMIENTO_HANDOFF_20260705.md (esa rama es
claude/dreamy-cartwright-dda93b; si el archivo no está en tu rama, léelo con
`git show claude/dreamy-cartwright-dda93b:hermes-content/docs/ONIA_CENTER_SANEAMIENTO_HANDOFF_20260705.md`).

ANTES de tocar page.tsx / operating-workspace.tsx / operating-source.ts,
coordina con COORDINATION_MANIFEST.md (archivos grandes, otra sesión edita
web-factory). El panel está EN PRODUCCIÓN: no romperlo.

Objetivo: que el panel muestre SOLO datos reales. Según el Anexo del handoff:
- Leads/Tasks/Reviews/Notes/Ideas/CodexJobs YA están en vivo (Supabase,
  onia-center-store.ts:551-581). NO borrarlos: dejarlos con empty-state honesto,
  o esconderlos del nav hasta que se usen. Decidir por módulo con Sergio si hay
  duda; por defecto empty-state claro.
- Quitar el seed hardcode que finge datos: `starterCodexJobs` (page.tsx:527-590)
  — quitar el seed o marcarlo explícitamente como demo.
- Revisar seeds estáticos que aparentan dato real: `operatingProjects` (~899),
  `operatingTasks` (~1128) en operating-source.ts — marcarlos demo o quitarlos
  del summary si confunden.
- Módulo Audio IA (nav id audio-intelligence, page.tsx:163): endpoint existe pero
  sin uso; ocultar del nav hasta usarlo o dejar como herramienta de carga con
  estado vacío honesto.

Mapa del sidebar: navItems page.tsx:158-184 (24 entradas, 7 grupos), filtrado por
rol allowedNavItems page.tsx:550-552, render page.tsx:731-760.

Gates: tsc --noEmit limpio; render 200 del panel local. Corre code-reviewer +
typescript-reviewer antes de cerrar. Commit conventional. NO deployar (el deploy
a prod es el ítem M1, requiere SSH + OK humano).
```

### P3-SANEAMIENTO-F3 — Onia Center: quitar rutina personal rígida + rediseño
Prioridad 2 (después de P2). Solo código. Saneamiento handoff Fase 3.

```
Proyecto onia-hermes, app web-factory/apps/site. FASE 3 del saneamiento
(hermes-content/docs/ONIA_CENTER_SANEAMIENTO_HANDOFF_20260705.md, rama
claude/dreamy-cartwright-dda93b). Hacer DESPUÉS de la Fase 2 (P2). Coordinar
COORDINATION_MANIFEST antes de tocar archivos grandes.

1. Quitar del view de trabajo los bloques de rutina PERSONAL (visibility
   sergio_private) del array `sergioStrictScheduleBlocks` en
   operating-source.ts:42-206:
   sergio-wake-reset (43-55), sergio-lunch-reset (107-117), sergio-gym (156-167),
   sergio-girlfriend (169-180), sergio-shutdown (182-193), sergio-sleep (195-205).
   CONSERVAR los bloques de trabajo: sergio-ceo-plan (57-68), sergio-sales-block
   (70-81), sergio-deep-work-am (83-93), sergio-meeting-window-am (95-105),
   sergio-delivery-block (119-129), sergio-meeting-window-pm (131-141),
   sergio-admin-close (143-154).
2. Limpiar el render de esos bloques (no solo el array):
   operating-workspace.tsx:~3018-3029 (preview daily, .slice(0,7)) y
   operating-workspace.tsx:~3173-3190 (calendario completo, .map()).
3. briefings/daily/route.ts:283-292 usa el mismo array para calendarBlocks: al
   editar, verificar que el filtro por categoría siga bien; quitar "gym" y
   "personal" del filtro ["planning","sales","deep_work","meetings","admin",
   "gym","personal"] si se quitan esos bloques.
4. Rediseño visual (reglas de diseño web del usuario: jerarquía por escala,
   quitar relleno uniforme, anti-template). Usar skills impeccable / taste-design.
   Simplificar el sidebar a lo operativo (agenda real, tareas reales, captura).

Gates: tsc --noEmit limpio; render 200; code-reviewer + typescript-reviewer.
Commit conventional. NO deployar (M1).
```

### P4-SELF-SERVICE-LANDING — Landing DentalGest self-service (parte web, sin pago)
Prioridad 1 para captar demanda. Parte de PENDIENTES C3 + TASKBOARD (embudo
Google→cliente). La parte de pago QR/pasarela BCP y wizard viven en DentaGest
(→ R4); la LANDING de captación se construye en web-factory ya.

```
Proyecto onia-hermes, web-factory. Construir la LANDING de captación de
DentalGest del embudo self-service descrito en
onia-core/ONIA_COMPANY_BACKBONE_AND_SELF_SERVICE_2026.md: landing con keywords
de dolor del rubro dental (agenda, recordatorios, cobros, historia clínica) ->
CTA a registro. Precios del catálogo v2 (390/890/1990 Bs).

Usa el pipeline de Web Factory (templates landing/landing-focus, data reusable,
brand context, benchmark visual interno como piso de calidad). Mobile-first,
accesible (a11y WCAG 2.2 AA light+dark), CWV en verde (gates de pnpm e2e).
NO implementar aquí el pago ni el wizard /setup (eso es DentaGest, ítem R4);
esta tarea entrega la superficie de captación + el CTA de registro.

Gates del track Web Factory: pnpm e2e verde (a11y + visual + perf), sin
anti-referencias (demo-catalog, grids repetidas, estilo template).
Commit conventional.
```

---

## (b) BLOQUEADO-SERGIO — 2 min de Sergio destraban lo comercial

Ordenados por impacto en vender/cobrar.

| ID | Título | Acción de Sergio | Desbloquea |
|----|--------|------------------|------------|
| **S1-PRECIOS** | Validar precios v2 del catálogo | Confirmar pymes 390/890/1.990 Bs + Empresarial E1 4.900+490 USD; ventana lanzamiento 31-jul | P1 (enviar propuestas), P4, R4 |
| **S3-SECRET-INTAKE** | Pegar secret en n8n "DentalGest - Email Intake" | Nodo POST → credencial "DentalGest Intake Secret" (Name x-intake-secret, Value Ctrl+V) → Publish; probar correo→/pending | Circuito email intake DentalGest completo |
| **S2-NIT-SIAT** | Iniciar formalización NIT Onia | Trámite NIT (bloqueo #1 del plan SIAT) | Certificación SIAT proveedor, facturación |
| **S4-TR4-COLS** | Pedir a Saúl columnas del export TR4 | Columnas exactas del Excel + frecuencia | M5-LANDED-COST (landed cost v1) |
| **S5-META** | Verificación de negocio Meta | Avanzar verificación Meta | WhatsApp→Chatwoot (TASKBOARD B6→B7) |
| **S6-IG-TOKEN** | Token IG long-lived + Business Account ID | Generar token largo + Business Account ID | Publicación IG (TASKBOARD B1/B5) |
| **S7-KEYS-TAVILY-FAL** | API keys Tavily + fal.ai (free tier) | Alta y cargar keys | Prospección con fuentes (Tavily) + imágenes (fal.ai) |
| **S8-FISCAL** | Datos fiscales con contador | NIT/régimen/responsable/calendario validados | Recordatorios fiscales activos (TASKBOARD B9) |
| **S9-PASSWORD** | Cambiar password Onia Center | Cambiar la password (la primera se expuso en chat 2026-07-04) | Higiene de seguridad |

Nota: S5/S6/S7/S8 = PENDIENTES B-bis #7/#8/#9/#10 = TASKBOARD B1/B2/B3/B6/B9
(mismos ítems, deduplicados aquí). S2 y S8 se solapan parcialmente (ambos tocan
datos fiscales); S2 es específicamente el trámite NIT para SIAT, S8 es el set
completo para recordatorios.

---

## (c) OTRO-REPO — sesión propia en su repositorio

| ID | Título | Repo | Notas |
|----|--------|------|-------|
| **R1-GESTIOS-CORE** | Instalar ONIA Core en GestiOS (columna vertebral) | `C:\dev\proyectos\Gestios` | APROBADO por Sergio 2026-07-07 (ver `onia-core/ONIA_CORE_GESTIOS_ADOPTION_PLAN_2026.md`; `distributionTargets.gestios`/`adapters/gestios.json` ya en `installing`, validate.mjs actualizado). Antes: RE-verificar si el baseline de migraciones sigue sucio (dato de memoria, no confirmado esta sesión). Decisión pendiente de Sergio antes de tocar datos: reemplazar `lib/fiscal/`+`lib/inventory/kardex.ts` (544 tests) por los módulos onia-core, o mantenerlos y adoptar solo la columna vertebral organizacional. Desbloquea R5. |
| **R6-DENTAGEST-MODULES-ADOPTION** | Adoptar formalmente commerce+accounting+invoicing en DentaGest | `C:\dev\proyectos\DentaGest\dental-saas` | ✅ CERRADO (2026-07-08, commit `96b89a9` "R6 completo (3/3) — 24 tablas aditivas", sobre commits de commerce/invoicing previos). Verificado por git log real, no memoria. |
| **R2-DENTAGEST-UI** | Completar UI del core en DentaGest (demo-able) | `C:\dev\proyectos\DentaGest\dental-saas` | ✅ CERRADO (verificado por git log real). |
| **R4-DENTAGEST-SELFSERVE** | Pago QR/pasarela BCP + wizard /setup self-service | onia-hermes + DentaGest | ✅ CERRADO (verificado por git log real). |
| **R7-DENTAGEST-DENTAL-MODULE** | Adoptar el módulo `dental` (clínico) en DentaGest | `C:\dev\proyectos\DentaGest\dental-saas` | NUEVO (2026-07-08, propuesto por Sergio tras cerrar R6). 6 entidades gap confirmadas contra el schema real de DentaGest (verificación 2026-07-06): `perio_chart`, `treatment_plan`, `informed_consent`, `medical_alert`, `dental_lab_case`, `tooth_image`. Traducir `onia-core/modules/dental.schema.sql` a Prisma (namespace `onia_dental_*`) + portar `dental.logic.mjs` (21 tests), mismo mecanismo de consumo de `@onia/core` que ya resolvió R6. Gate: typecheck+tests verdes, push master. |
| **R3-BE-FASE1** | Bolivian Electric fase 1 + inbox Chatwoot + puente TR4 | `C:\dev\clientes\Bolivian Electric` | PENDIENTES C8 + TASKBOARD B (ancla Empresarial). Migrar inbox Chatwoot a SU VPS srv1793230 (NO mezclar con VPS Onia); cerrar y documentar ticket real → ancla Onia Empresarial; puente TR4 por planillas. Al cerrar, calibra precios Empresarial (PENDIENTES B#6). |
| **R5-EXTRACT-PKGS** | Extraer paquetes @onia/* (core-db, fiscal, ui) | monorepo/paquetes privados | PENDIENTES C7. **NO antes de que R1 (GestiOS) pruebe los patrones** (regla). Fuente: ONIA_ECOSYSTEM_INVENTORY_20260704.md. |

---

## (d) NECESITA-MCP/INFRA — requiere n8n MCP, VPS/SSH o Supabase

Ordenados por impacto. M1 destraba que Sergio VEA el panel limpio (junto con P2/P3).

### M1-SANEAMIENTO-DEPLOY — Deploy Fase 1 saneamiento a VPS + cleanup de 61 tareas
Infra + borrado en DB de producción. **Requiere SSH + OK humano explícito**
(producción + borrado irreversible). Fusiona saneamiento Fase 1 pendiente +
PENDIENTES A4 "PENDIENTE MENOR limpiar ~61 tareas" + A5 cola.

- Código Fase 1: el fix de `briefings/daily/route.ts` YA está en `main` (commit
  `3d87f093`, otra sesión: `basePlanTitle` + dedup por título base). Lo que falta
  para el cleanup está en **PR #12** (rama `claude/dreamy-cartwright-dda93b`,
  rebasada sobre main, aditivo, CI verde): dedup de `hygiene/daily/route.ts` +
  helpers en `onia-center-store.ts` + nuevo endpoint protegido
  `api/onia-center/maintenance/route.ts` (`action:"cleanup_generated_tasks"`).
  → Mergear PR #12 antes del deploy.
- Deploy por tarball al VPS 187.77.16.63 (Easypanel), llave
  `~/.ssh/onia_hermes_vps_ed25519`: empaquetar web-factory/ →
  `/opt/onia-center-src/web-factory`, rebuild `ONIA_STANDALONE_BUILD=true`,
  promover a `/opt/onia-center/runtime-next` (backup `runtime-next.bak-<ts>`),
  contenedor con `--env-file` + `PORT=3012`.
- Post-deploy: verificar login 200, briefings/daily dry-run
  (`daily_briefing_dry_run`), maintenance dry-run.
- Cleanup: `POST /api/onia-center/maintenance` con
  `{"action":"cleanup_generated_tasks","commit":false}` (dry-run) y si el conteo
  es razonable, `commit:true` para borrar las `[Plan *]`/`[Briefing diario *]`/
  `[Higiene *]` acumuladas.
- Nota: workflow n8n `ONIADailyBrief001` ya está DESACTIVADO (mitigación
  2026-07-05); re-publicar SOLO después del deploy. El GitHub Action
  `ONIA Daily Project Hygiene` (cron 10:00, commit en schedule) sigue creando
  `[Higiene <fecha>]` hasta el deploy del fix — considerar
  `gh workflow disable "ONIA Daily Project Hygiene"` como mitigación.

### M2-N8N-AUTONOMIZAR — Autonomizar workflows restantes + crons faltantes
n8n MCP. PENDIENTES C10, fusiona TASKBOARD B13/B14 (importar
onia-trend-recommendations + encadenar briefings). Regla Sergio: workflows
autónomos, sin Onia Center endpoints ni SearXNG localhost.
- Migrar `onia-center-daily-briefing` (ONIADailyBrief001) y
  `onia-trend-recommendations` al patrón autónomo del workflow de guiones
  `NDXLJiR00ciQx72V` (nodo OpenAI nativo cred "OpenAi account" + telegramApi,
  prompt inline). Validar con execute_workflow.
- Crear crons: prospección 09:00 (skill prospeccion-onia, solo borradores, no
  contacta) y propuestas 12:00 (skill genera-propuesta).
- Tabla horaria canónica: ONIA_CONTENT_FACTORY_ORCHESTRATION_2026.md.
- Cruce con M1: NO re-publicar ONIADailyBrief001 hasta que el fix esté deployado.

### M3-N8N-CLEANUP — Restos de limpieza n8n
n8n MCP. PENDIENTES C11.
- Reparar conexión rota `sendAdminEmail` en 3 workflows GestiOS activos
  (WF-GS-04/03/02: 6oowIHo8G9baBOYc, qOVpQwPZplQKYkMc, xx4wzzzqZBGfu836) y
  taggearlos `gestios`.
- Decidir con Sergio (parte bloqueada): Demo Cliente New Sakura, Atlas YouTube
  Draft, Scheduled Ops Pack, Mara Daily (SSH roto: arreglar credencial SSH key o
  archivar). Estado: ONIA_N8N_CLEANUP_20260703.md.

### M4-RADAR-WORKITEM — Radar normativo → WorkItem automático
n8n MCP. PENDIENTES C6. **Bloqueado hasta que exista org Onia en DentaGest/GestiOS
con intake activo** (depende de R1/R2 + S3). Extender workflow `OovRU4r0o7pvglJP`
para POSTear cada novedad al intake (channel email_shared, "Revisar impacto
RND-X") además de Telegram. Editar vía update_workflow (como el FX).

### M5-LANDED-COST — Landed cost v1 con planilla TR4
n8n MCP. PENDIENTES C5. **Bloqueado por S4** (columnas reales de Saúl). Workflow
que lee la planilla (correo/Drive) → lista sugerida (FX del día + margen; luego
aranceles NANDINA) → Excel repreciado + resumen. Diseño:
ONIA_IMPORT_LANDED_COST_MODULE_2026.md + ONIA_EXCHANGE_RATE_AUTOPRICING_2026.md.

### M6-HIGIENE-INFRA — Higiene infra (corta)
VPS + UI de terceros. PENDIENTES C9.
- Consolidar crons Hermes vs n8n (decidir orquestador único).
- Verificar billing Sentry/PostHog en free tier (solo UI, no automatizable).
- Automatizar backup nocturno Postgres staging (drill 24/24 probado, falta cron).

---

## Web Factory follow-ups (menores, dentro de onia-hermes → AGENTE-YA opcionales)

Roadmap 8/8 HECHO (PENDIENTES §E; TASKBOARD Track C C1-C4 cubierto por el roadmap).
Follow-ups menores, no bloqueantes; se pueden agendar como AGENTE-YA de baja
prioridad si sobra ventana. NO compiten con P1-P4.

| # | Item | Esfuerzo | Estado |
|---|------|----------|--------|
| E1 | Auto-conversión de imágenes con sharp en `generate` (png/jpg→webp/avif+resize) | M | abierto |
| E2 | Optimizar 108 imágenes Nuvia (`nuvia.assets/product-media-cutout/*.png`) | M | task_589d5cca spawneada |
| E3 | Dark mode del template `store` (tokenizar shell; hoy paleta `--nuvia-*` fija, intencional) | M | abierto/opcional |
| E4 | Medir INP en el perf gate (hoy LCP/FCP/CLS) | S | opcional |
| E5 | Estabilizar flakiness E2E bajo carga paralela | S | EN CURSO (subagente 2026-07-05) |
| E6 | Dashboard interactivo real (Astro islands + Tremor) más allá del PoC | L | solo si un cliente pide datos vivos |

---

## Notas de deduplicación (qué se fusionó entre fuentes)

- **Credenciales externas**: PENDIENTES B-bis #7/#8/#9/#10 = TASKBOARD
  B1/B2/B3/B6/B9 → S6/S7/S5/S8 (un ítem cada uno).
- **Propuestas v2**: PENDIENTES C4 = TASKBOARD X2 → P1. La validación de precios
  (PENDIENTES B#2) se separó como S1 (bloqueo de Sergio), no como trabajo de
  agente.
- **Self-service DentalGest**: PENDIENTES C3 se partió en P4 (landing captación,
  web-factory, AGENTE-YA) + R4 (pago/wizard, DentaGest, OTRO-REPO).
- **Saneamiento Onia Center**: A5 (PENDIENTES) + "PENDIENTE MENOR 61 tareas" de
  A4 + Fase 1/2/3 del handoff → M1 (deploy+cleanup, infra), P2 (Fase 2, código),
  P3 (Fase 3, código).
- **n8n briefing autónomo**: PENDIENTES C10 + TASKBOARD B13/B14 + estado n8n del
  saneamiento Fase 1 → M2 (con dependencia cruzada: no re-publicar
  ONIADailyBrief001 hasta deploy M1).
- **GestiOS**: PENDIENTES C1 + A1 (inventario) + TASKBOARD Track A adopción →
  R1 (verificar A1 primero).
- **Web Factory**: PENDIENTES §E (E1-E6) = TASKBOARD Track C (C1-C4 ya cubiertos
  por roadmap 8/8) → sección Web Factory follow-ups.

## Nota de higiene detectada (fuera de scope, para Sergio)

El handoff de saneamiento (`hermes-content/docs/ONIA_CENTER_SANEAMIENTO_HANDOFF_20260705.md`)
está commiteado en la rama `claude/dreamy-cartwright-dda93b` pero NO en la rama de
trabajo actual `claude/landing-focus`. La rama actual sí tiene A4 cerrado (commit
`b2425d59`) que referencia ese handoff. Conviene mergear/FF ambas ramas a main
para que el próximo que abra sesión encuentre el handoff en su árbol (hoy hay que
leerlo con `git show claude/dreamy-cartwright-dda93b:...`). No lo toqué en esta
auditoría (read-only sobre fuentes; solo escribí este archivo).

---

## Camino crítico (qué desbloquea qué)

1. **S1-PRECIOS** (2 min Sergio) → P1 puede ENVIAR propuestas (no solo generarlas)
   y P4/R4 usan precios firmes.
2. **P2 + P3 (código, agente ya) + M1 (deploy, infra+humano)** → Sergio ve el
   panel limpio. P2/P3 no bloquean por infra; M1 sí necesita SSH+OK.
3. **S3-SECRET-INTAKE** (2 min Sergio) → circuito email intake DentalGest completo.
4. **R1-GESTIOS-CORE** → habilita R5 (paquetes @onia/*) y parte de M4.
5. **S4** → M5; **S5** → WhatsApp→Chatwoot; **S6/S7** → IG + prospección con fuentes.
```
