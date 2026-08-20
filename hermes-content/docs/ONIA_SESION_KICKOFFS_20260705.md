> ⚠️ **SUPERADO.** El estado vigente esta en `hermes-content/docs/ONIA_ESTADO_REAL_20260813.md`
> y la apuesta vigente en `docs/platform/ONIA_DECISION_SAAS_CONSULTORIA_20260813.md`.
> Este documento se conserva como historia: NO tomes decisiones con el.

# Onia — Prompts de arranque por sesión (2026-07-05)

Copiá/pegá el bloque al abrir cada sesión. Cada carril = 1 sesión = 1 worktree =
1 rama = 1 carpeta/repo. Modelo de carriles: `COORDINATION_MANIFEST.md` (arriba).
Backlog e ítems: `hermes-content/docs/ONIA_PROXIMA_SESION_PLAN_20260705.md`.

Regla común a todos: rama propia, `git rebase origin/main` antes de mergear,
commits conventional chicos por carpeta, merge frecuente a main (FF). No tocar
otras carpetas. Un ítem se cierra cuando su código está en main.

---

## OLA 1 (abrir ya — sin bloqueos, cero solape)

### 1) `propuestas-v2` — P1
```
Sos el carril COMERCIAL de ONIA (sesion propuestas-v2). Trabajas SOLO en el repo
onia-hermes (C:\dev\proyectos\onia-hermes), carpetas hermes-content/propuestas +
docs + skills. NO toques web-factory/apps ni onia-center.

Lee primero: hermes-content/docs/ONIA_PROXIMA_SESION_PLAN_20260705.md (item P1),
el CLAUDE.md del repo seccion "Propuestas comerciales" y la skill
hermes-content/skills/propuestas-comerciales-onia.md.

Tarea (P1): genera propuestas con el sistema oficial, NUNCA HTML a mano
(hermes-content/propuestas/generador/, node generar-propuestas.js <slug> --pdf).
Produce dos:
(1) DentalGest — planes 390/890/1990 Bs (pymes) + Empresarial E1 (4.900 USD setup
    + 490 USD/mes).
(2) ONIA Empresarial E1/E2 con ancla TR4 (USD 20k).
Reglas obligatorias: 3 niveles por SALTO DE VALOR (N1 estar online, N2 convertir,
N3 automatizar) explicado en una linea en notaPaquetes; resultado por paquete;
valor[] "Por que te conviene" con ROI real; dominio+hosting a cargo del cliente;
terceros excluidos (dominio, hosting, comision pasarela, creditos IA, WhatsApp
pago, pauta); WhatsApp boton click-to-chat INCLUIDO, chatbot IA es el add-on
pago; NO fabricar datos del cliente (si falta brochure/sector, marcarlo).
Precios: fuente onia-core/ONIA_CATALOGO_COMERCIAL_2026.md +
hermes-content/propuestas/ONIA_CATALOGO_PRECIOS_2026.md. Si difieren, usa
CATALOGO_COMERCIAL y deja TODO para que Sergio confirme (item S1).

Gate: node generar-propuestas.test.js verde. Genera los PDF y reporta las rutas.
Commit conventional; rebase sobre main antes de mergear.
```

### 2) `onia-center-saneamiento` — P2 → P3
```
Sos el carril ONIA CENTER (sesion onia-center-saneamiento). Repo onia-hermes, app
web-factory/apps/site. Dueno SOLO de src/app/onia-center/** y
src/app/api/onia-center/**. Antes de tocar page.tsx / operating-workspace.tsx /
operating-source.ts lee COORDINATION_MANIFEST.md; NO toques los 4 raiz de
web-factory (next.config.ts, layout.tsx, globals.css, package.json) sin avisar.
El panel esta EN PRODUCCION: no romperlo. NO deployar (el deploy es el carril
infra, item M1).

Lee: hermes-content/docs/ONIA_CENTER_SANEAMIENTO_HANDOFF_20260705.md (mapa con
lineas exactas) y el plan maestro items P2 y P3.

Ejecuta P2 primero, luego P3 (secuenciales, mismos archivos):
P2 — mostrar SOLO datos reales. Leads/tasks/ideas/reviews/codexJobs YA estan en
vivo (Supabase, onia-center-store.ts:551-581): NO borrarlos, empty-state honesto
o esconder del nav hasta que se usen. Quitar el seed hardcode starterCodexJobs
(page.tsx:527-590). Revisar operatingProjects (~899) y operatingTasks (~1128) en
operating-source.ts: marcar demo o sacar del summary si confunden. Audio IA (nav
id audio-intelligence, page.tsx:163): esconder del nav hasta usarlo. Sidebar:
navItems page.tsx:158-184, filtrado allowedNavItems page.tsx:550-552.
P3 — quitar del view de trabajo los bloques de rutina PERSONAL de
sergioStrictScheduleBlocks (operating-source.ts): sergio-wake-reset (43-55),
sergio-lunch-reset (107-117), sergio-gym (156-167), sergio-girlfriend (169-180),
sergio-shutdown (182-193), sergio-sleep (195-205). Conservar los de trabajo
(ceo-plan, sales, deep-work, meetings, delivery, admin). Limpiar el render en
operating-workspace.tsx:~3018-3029 y ~3173-3190. En briefings/daily/route.ts:
283-292 quitar "gym" y "personal" del filtro de categorias. Rediseno visual con
skills impeccable / taste-design (jerarquia por escala, anti-template, quitar
relleno uniforme).

Gates: tsc --noEmit limpio; render 200 del panel local; code-reviewer +
typescript-reviewer. Commit conventional; rebase sobre main antes de mergear.
```

### 3) `dentagest-core-ui` — R7 (NUEVO) — R2/R4/R6 YA CERRADOS
```
Sos el carril DENTAGEST. Trabajas en el repo DentaGest
(C:\dev\proyectos\DentaGest\dental-saas), NO en onia-hermes.

ESTADO VERIFICADO 2026-07-08 (por git log real del repo, no por memoria): R2
(UI del core), R4 (self-service) y R6 (adopcion de commerce+accounting+invoicing,
commit 96b89a9 "R6 completo (3/3) -- 24 tablas aditivas") estan LOS TRES
cerrados. DentaGest es el primer producto con adopcion COMPLETA del core
(columna vertebral organizacional + los 3 modulos financieros universales). No
hay que rehacer nada de eso.

IMPORTANTE: todas las rutas `onia-core/...` de este bloque viven en el OTRO repo
(`C:\dev\proyectos\onia-hermes\onia-core\...`), no en DentaGest. Podes leerlas por
ruta absoluta (son de solo lectura para vos: el contrato/schema/modulos siguen
congelados). No asumas que existen relativas a tu cwd.

Estado actual de onia-core (verificalo vos mismo, no confies solo en esto):
v0.7.0 -- 18 entidades core, 6 modulos vendibles (commerce/knowledge/accounting/
invoicing/payroll YA ADOPTADOS por vos en R6/anteriores, mas `dental` -- nuevo,
2026-07-07, TODAVIA NO PROPUESTO a este carril hasta ahora) y los 11 rubros del
roadmap definidos (track+pack). Ver
`C:\dev\proyectos\onia-hermes\onia-core\README.md` +
`C:\dev\proyectos\onia-hermes\onia-core\CHANGELOG.md` (entradas 0.7.0 y
"modules/dental 0.1.0") para el detalle completo.

R7 (NUEVO, propuesto por Sergio 2026-07-08) -- adoptar el modulo `dental`: 6
entidades clinicas confirmadas como GAP real contra tu propio schema (la
verificacion se hizo leyendo tu prisma/schema.prisma en 2026-07-06, no son
teoricas):
- `perio_chart` (periodontograma, 6 puntos por diente -- entidad separada del
  odontograma que ya tenes).
- `treatment_plan` (agrupador de PatientTreatment con costo total y aprobacion
  del paciente -- hoy cada tratamiento tuyo es independiente, sin un "plan"
  que los junte).
- `informed_consent` (consentimiento firmado paciente+profesional antes de
  procedimiento invasivo).
- `medical_alert` (alergia/medicacion ESTRUCTURADA con severidad -- tu
  ClinicalRecord hoy solo tiene texto libre).
- `dental_lab_case` (encargo a laboratorio protesico con estados).
- `tooth_image` (radiografia/foto vinculada a pieza dental y fecha).
NO reconstruye Patient/ClinicalRecord/odontograma/PatientTreatment/Prescription
-- esos siguen siendo tuyos, intactos.
Traduci `C:\dev\proyectos\onia-hermes\onia-core\modules\dental.schema.sql` a
migraciones Prisma (namespace `onia_dental_*`, mismo patron que usaste para
commerce/accounting/invoicing en R6). Logica pura ya escrita y testeada en
`dental.logic.mjs` (21 tests): totales de plan de tratamiento, validez de
consentimiento por firmas (paciente Y profesional, firmadas en o antes del
procedimiento), severidad de alertas, maquina de estados del caso de
laboratorio, resumen de periodontograma -- portala igual que ya portaste
accounting/invoicing-logic en R6 (vos ya resolviste el mecanismo de consumo de
`@onia/core`, reusalo). Umbrales clinicos marcados como referencia de
screening, NO diagnostico (`clinicalConfig.notClinicalAdvice`) -- no
sustituyas juicio clinico en la UI que construyas encima.

Gate: typecheck + tests verdes; si tocas onia-core/adapters/dentagest.json,
`node onia-core/validate.mjs` sigue verde en onia-hermes; push a master del repo
DentaGest. Commit conventional.
```

### 4) `gestios-core` — R1 → R5 (APROBADO 2026-07-07)
```
Sos el carril GESTIOS. Repo Gestios (C:\dev\proyectos\Gestios), NO onia-hermes.
Referencia: plan maestro de onia-hermes items R1 y R5, y el plan completo
`C:\dev\proyectos\onia-hermes\onia-core\ONIA_CORE_GESTIOS_ADOPTION_PLAN_2026.md`
(leelo entero antes de arrancar -- tiene el estado real verificado y la decision
que tenes que resolver antes de tocar entidades).

IMPORTANTE: todas las rutas `onia-core/...` de este bloque viven en el OTRO repo
(`C:\dev\proyectos\onia-hermes\onia-core\...`), no en Gestios. Leelas por ruta
absoluta; el contrato/schema/modulos siguen congelados (solo lectura para vos).

Estado: Sergio APROBO la adopcion (2026-07-07) -- `distributionTargets.gestios`
y `adapters/gestios.json` ya estan en `installing`, `validate.mjs` ya tiene
gestios en `TARGET_ADOPTION_APPROVED`/`ADOPTION_APPROVED`. onia-core v0.7.0,
CORE COMPLETO (18 entidades, 6 modulos: commerce/knowledge/accounting/
invoicing/payroll/dental -- este ultimo es vertical, no te aplica a vos --
todos con logica Bolivia real y tests; 11 rubros del roadmap definidos).

PRUEBA DE QUE EL PATRON FUNCIONA EN PRODUCCION: DentaGest (carril D) ya cerro
la MISMA adopcion que R1 te pide (columna vertebral) mas la de commerce/
accounting/invoicing (equivalente a lo que vos decidas en la seccion
siguiente), commit `96b89a9` en su repo "R6 completo (3/3) -- 24 tablas
aditivas". Si te trabas con el mecanismo de portar `@onia/core/modules/
*-logic` (el paquete no esta publicado formalmente entre repos), fijate como
lo resolvio esa sesion antes de reinventar la rueda.

DECISION QUE TENES QUE RESOLVER PRIMERO (con Sergio, no la asumas): GestiOS ya
tiene `lib/fiscal/` (RCV/IVA/balance de comprobacion/calendario NIT, commit
1563731) y `lib/inventory/kardex.ts` (kardex promedio ponderado/FEFO, commit
77172ce) propios, con 544 tests. El core ahora cubre lo mismo via los modulos
`commerce`/`accounting`. ¿Reemplazar esa logica propia por los modulos del core
(consistencia con otros productos, pero tira 544 tests probados) o mantenerla y
adoptar del core SOLO la columna vertebral organizacional (work_items, roles,
comments, documents, approvals, schedule, saved_views, intake)? Mientras se
decide, arranca por la columna vertebral (R1, mismo alcance que DentaGest
Sprints 1-4): no choca con ninguna de las dos opciones.

R1 -- instalar ONIA Core en GestiOS como columna vertebral. Sprint 0 primero:
el baseline de migraciones esta CONFIRMADO sucio (verificado 2026-07-08 en
docs/DATABASE.md, ya no es dato de memoria): varias migraciones aplicadas a
mano a Supabase fuera de `migrate deploy` (cash_registers, email_log), la
ultima es un `.sql` suelto, y NO hay `DATABASE_URL`/`DIRECT_URL` local (se
aplican en Vercel en el build). PRIMER PASO CONCRETO: conseguir esa URL valida
(Vercel env del proyecto o el Supabase de GestiOS) -- sin eso no podes ni
correr `prisma migrate status`. Luego el mismo runbook de baseline que uso
DentaGest en su Sprint 0. Ver el plan completo con todo esto en
`C:\dev\proyectos\onia-hermes\onia-core\ONIA_CORE_GESTIOS_ADOPTION_PLAN_2026.md`
(seccion "Baseline de migraciones — CONFIRMADO 2026-07-08") +
`ONIA_CORE_INSTALL_GUIDE_2026.md`.
OJO datos que YA existen en GestiOS y no hay que reinventar: `Invoice`
(cuis/cufd/cufe -- hubo un intento SIAT "retirado del alcance comercial"),
`QrPayment` (multi-PSP), `OrgAddon`/`PlanType` (empaquetado comercial PROPIO
que NO coincide con business-tiers del core -- no forzar alineacion sin
criterio de Sergio).
NUNCA copies contract.json ni el schema al repo de Gestios -- ya paso una vez
(commit cf57afa, revertido en 3d8aec4) y esta prohibido: se referencia via
adapter + logica portada, no se forkea. Para portar logica del core seguí
`ONIA_CORE_LOGIC_PORTING_RECIPE_2026.md` (guardá el sha256 del manifest
PORTABLE_ARTIFACTS.json en la nota de origen, no solo la version).
R5 (DESPUES de R1) -- extraer paquetes @onia/* (core-db, fiscal, ui). NO antes de
que R1 pruebe los patrones. Fuente: `ONIA_ECOSYSTEM_INVENTORY_20260704.md` (onia-hermes).

Gate: typecheck + tests verdes en Gestios; si tocas
`onia-core/adapters/gestios.json` (avance de status), `node onia-core/validate.mjs`
sigue verde en onia-hermes. Commit conventional.
```

---

## OLA 2 (cuando haya cupo / se destrabe)

### 5) `wf-landing-dentalgest` — P4
```
Sos el carril WEB FACTORY (sesion wf-landing-dentalgest). Repo onia-hermes, app
web-factory. Dueno de landings src/app, data/clients, templates, harvester. NO
toques src/app/onia-center (otro carril). Coordina los 4 raiz de web-factory por
manifest.

Lee: plan maestro item P4 y onia-core/ONIA_COMPANY_BACKBONE_AND_SELF_SERVICE_2026.md.

Tarea (P4): construi la LANDING de captacion de DentalGest self-service: keywords
de dolor dental (agenda, recordatorios, cobros, historia clinica) -> CTA a
registro. Precios del catalogo v2 (390/890/1990 Bs). Usa el pipeline Web Factory
(templates landing/landing-focus, data reusable, brand context, benchmark visual
interno como piso). Mobile-first, a11y WCAG 2.2 AA (light+dark), CWV en verde. NO
implementes pago ni wizard (eso es DentaGest, R4): entregas la superficie de
captacion + el CTA de registro.

Gates: pnpm e2e verde (a11y + visual + perf); sin anti-referencias (demo-catalog,
grids repetidas, estilo template). Commit conventional.
```

### 6) `bolivian-electric-fase1` — R3
```
Sos el carril BOLIVIAN ELECTRIC. Repo Bolivian Electric
(C:\dev\clientes\Bolivian Electric), NO onia-hermes. Referencia: plan maestro
item R3.

R3 — fase 1: migra el inbox Chatwoot a SU PROPIO VPS srv1793230 (NO mezclar con el
VPS de ONIA 187.77.16.63); cerra y documenta un ticket real -> sirve de ancla para
ONIA Empresarial; puente TR4 por planillas. Al cerrar, calibra precios Empresarial
(feedback a Sergio). Diseno de referencia:
hermes-content/docs/BOLIVIAN_ELECTRIC_*.md (viven en onia-hermes; leelos con
git show origin/main:... si trabajas desde el repo del cliente).

Gate: documentar el ticket cerrado + estado de la migracion Chatwoot. Commit
conventional en el repo del cliente.
```

### 7) `infra-deploy-n8n` — M1 → M6 (SERIAL, un solo dueno)
```
Sos el carril INFRA (sesion infra-deploy-n8n). UNICO dueno de infra: n8n, VPS,
Supabase. Nadie mas toca infra mientras trabajas. Las tareas tocan PRODUCCION:
pedi OK humano explicito antes de deployar o borrar datos.

Lee: plan maestro items M1-M6 y las memorias vps-access-and-deploy y
onia-center-deploy-topology.

Orden serial:
M1 — Deploy Fase 1 saneamiento al VPS + cleanup de ~61 tareas. El codigo ya esta
en main (PR#12: dedup hygiene + endpoint /api/onia-center/maintenance). Deploy por
tarball al VPS 187.77.16.63 (llave ~/.ssh/onia_hermes_vps_ed25519): empaquetar
web-factory/ -> /opt/onia-center-src/web-factory, rebuild ONIA_STANDALONE_BUILD=true,
promover a /opt/onia-center/runtime-next (backup previo runtime-next.bak-<ts>),
contenedor con --env-file + PORT=3012. Post-deploy: login 200, briefings/daily
dry-run, maintenance dry-run; luego cleanup commit:true. El n8n ONIADailyBrief001
esta DESACTIVADO: re-publicar SOLO tras el deploy. Considera
gh workflow disable "ONIA Daily Project Hygiene".
M2 — autonomizar workflows (patron NDXLJiR00ciQx72V: nodo OpenAI nativo cred
"OpenAi account" + telegramApi, prompt inline); crear crons prospeccion 09:00 y
propuestas 12:00. NO re-publicar ONIADailyBrief001 hasta que M1 este deployado.
M3-M6 — cleanup n8n (sendAdminEmail roto en WF-GS-04/03/02), radar->workitem
(bloqueado hasta org con intake), landed cost (bloqueado por S4), higiene infra.

Gate: cada cambio validado (execute_workflow / verificacion post-deploy). NO
avanzar a M2 antes de cerrar M1.
```

### 8) `contenido-higgsfield` — operación continua (no cierra)
```
Sos el carril CONTENIDO/VIDEO (sesion contenido-higgsfield). Repo onia-hermes,
carpetas hermes-content/references + skills (video/IG) + scripts (video/ig) +
.hermes/video-lab + assets. NO toques codigo de apps (web-factory/onia-center). Es
produccion CONTINUA, no un backlog a cerrar.

Lee las skills: carruseles-onia, video-lab-higgsfield, videos-virales-higgsfield,
ugc-empresas-higgsfield, radar-creativo-onia, instagram-publicacion.

Usas Higgsfield MCP para generacion y el pipeline video-lab. La publicacion en IG
requiere token long-lived (item S6, bloqueo de Sergio): si no esta, deja el
contenido aprobado LISTO para publicar. NUNCA publiques ni subas contenido con
cara sin aprobacion de Sergio.

Salida: piezas (carruseles/video) + registro en references/assets. Nada de
secretos en git. Commit conventional para assets/briefs.
```
