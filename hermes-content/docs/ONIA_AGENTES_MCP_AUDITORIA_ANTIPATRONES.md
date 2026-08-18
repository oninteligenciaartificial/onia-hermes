# Auditoría de agentes y MCPs de Onia contra los 3 antipatrones (StockPilot)

- **Fecha:** 2026-08-18 · **Tipo:** diagnóstico, cero refactor.
- **Marco:** taller Code w/ Claude — StockPilot (30x menos costo). Ficha:
  `hermes-content/references/video-intake/2026-08-17-code-with-claude-stockpilot.md`.
- **Los 3 antipatrones:** 1) context-dumper (listados crudos al modelo en vez de calcular
  en sandbox y devolver top-N) · 2) subagent-hider que devuelve prosa (dato extraído de
  texto libre en vez de JSON con forma fijada) · 3) trivial write (tool de 3 líneas que un
  bash hace igual) · + scope (no pertenece al dominio → otro servicio).
- **Subagente justificado SOLO si:** (a) mucho Claude en paralelo (research/exploración)
  o (b) mente fresca revisando SIN el contexto del autor.
- **Todo lo listado fue verificado en disco o en el VPS por SSH, no de memoria.**

## Resumen en 3 líneas

1. **68 agentes auditados** (9 proyecto + 43 globales + 13 jobs cron Hermes + 3 de
   producto). **SOBRAN ~37**: 6 de proyecto, ~24 globales, ~7 jobs Hermes fusionables.
   Los 3 de producto son el ÚNICO grupo sin antipatrón (runtime 100% determinista, sin LLM).
2. **~24 servidores MCP externos conectados + 2 configurados sin autenticar (muertos)**,
   ≈560 tools diferidas. **Cero referencias a `mcp__` en agents/skills/docs del repo**:
   nadie los usa de forma escrita. Cloudflare aparece por **6 superficies** distintas.
3. El harness actual **difiere las schemas** (ToolSearch): el costo clásico de "MCP se
   come el contexto" está mitigado — lo que queda en cada sesión es la lista de ~560
   nombres. El costo real en tokens de las schemas **no es medible desde acá** (viven
   server-side).

---

## 1. Inventario verificado

### 1.1 Agentes del proyecto — `.claude/agents/` del worktree (9 + README, 21.054 bytes)

Leídos completos. Ninguno define tools propias (son prompts), así que el antipatrón 3
(trivial write) no aplica literal; su análogo es "agente que hace lo que una skill o un
bash ya hace".

| Agente | Bytes | Model | Tools declaradas | Qué es en realidad |
|---|---|---|---|---|
| onia-orchestrator | 2.878 | opus | Read, Grep, Glob, Bash, **TaskCreate/TaskUpdate/TaskList (no existen en este harness)** | Tabla de ruteo + gates |
| onia-core-guardian | 2.100 | opus | R/G/G/Bash/Edit/Write | Revisor de contrato con invariantes |
| dentalgest-migrations | 2.548 | opus | R/G/G/Bash/Edit/Write | Cápsula de conocimiento de migraciones (con estado fechado 2026-07-03) |
| hermes-automation | 1.669 | sonnet | R/G/G/Bash/Edit/Write | Cápsula n8n (duplica la regla n8n del CLAUDE.md global) |
| onia-integrations | 1.747 | sonnet | R/G/G/Bash/Edit/Write | Cápsula de estado de credenciales (estado ya VENCIDO: dice "Instagram falta token" y eso se resolvió) |
| onia-propuestas | 2.277 | opus | R/G/G/Bash/Edit/Write | Copia de las reglas que ya viven en la skill `onia-propuestas` + generador |
| onia-crm-prospeccion | 1.553 | sonnet | R/G/G/Bash/Edit/Write | Research de prospectos ("pocos y buenos, no listas largas") |
| onia-creative-radar | 1.830 | sonnet | R/G/G/Bash/Edit/Write | Research de tendencias + plan de producción |
| web-factory-builder | 1.968 | opus | R/G/G/Bash/Edit/Write | Identidad de builder que duplica la skill `onia-web-factory` |

### 1.2 Agentes globales — `C:\Users\PC\.claude\agents\` (43 archivos, 228.436 bytes)

Cada descripción entra al system prompt de **cada** sesión (lista "Available agent
types"). Grupos:

| Grupo | Archivos | Bytes | Relevancia para el stack Onia (TS/Next, Python, SQL) |
|---|---|---|---|
| Reviewers/build-resolvers de lenguajes que Onia NO usa (cpp x2, csharp, dart, flutter, go x2, java x2, kotlin x2, rust x2, pytorch, healthcare) | 15 | ~82 KB | **Ninguna** |
| market-* (competitive, content, conversion, strategy, technical) | 5 | ~26 KB | Sin frontmatter ni tools: probablemente ni registran bien como agentes |
| gan-planner / gan-generator / gan-evaluator | 3 | ~16 KB | El trío hardcodeado es el antipatrón E4 que el taller corrige; solo el evaluator cae en (b) |
| Reviewers que sí aplican (code, security, typescript, database, python) | 5 | ~29 KB | Caso (b) legítimo |
| planner, architect | 2 | ~14 KB | El harness ya trae el agente nativo `Plan` + skill `make-plan` |
| tdd-guide, e2e-runner, doc-updater, refactor-cleaner, build-error-resolver, performance-optimizer | 6 | ~30 KB | Todos tienen skill equivalente instalada (`tdd`, `e2e-testing`, `update-docs`, etc.) |
| opensource-forker/sanitizer/packager | 3 | ~20 KB | Pipeline de 3 etapas; el sanitizer es (b), los otros dos son scripts con prompt |
| chief-of-staff, harness-optimizer, loop-operator, docs-lookup | 4 | ~11 KB | docs-lookup declara `mcp__context7__*` que **no está conectado** (referencia rota); chief-of-staff es otro dominio (email personal) |

### 1.3 Runtimes por cron — verificados en el VPS (SSH, 2026-08-18)

**Crontab real de root** (no de memoria): backups (x3), watchdog del bot,
`run-onia-agents-cron.sh` (Recall+Cobrador → `/api/cron/onia-agents`), trial-drip,
security-watch, **claude-guardia cada 10 min**, y el embudo del chatbot
(followup/reminder/postdemo/usage — wrappers deterministas que llaman a la API del bot).

**Los "runtimes de ONIA Center" (Vendedor/Contenido/Finanzas) NO están en el crontab del
sistema:** viven como **13 jobs del gateway Hermes** en `/root/.hermes/cron/jobs.json`,
todos `enabled=True`, cada uno = prompt + 3-4 skills-doc al modelo del gateway:

| Job | Cron | Rol |
|---|---|---|
| hermes-daily-operational-status | 0 13 diario | Status ops → Telegram |
| hermes-daily-content-video-plan | 0 16 diario | Guiones para 3 páginas |
| hermes-daily-content-arthur | 10 16 diario | Guion diario Arthur |
| hermes-daily-onia-videolab | 0 13 diario | Guion vía script determinista |
| hermes-daily-video-lab-followup | 0 22 diario | Cierre Video Lab |
| hermes-weekday-work-agenda | 30 12 L-V | Agenda del día |
| hermes-weekly-kickoff | 0 12 lunes | Plan semanal |
| hermes-tuesday-prospecting | 30 13 martes | **Vendedor** |
| hermes-wednesday-build-sprint | 0 14 miércoles | Sprint técnico |
| hermes-thursday-content-production | 0 14 jueves | **Contenido** |
| hermes-friday-finance-ops-review | 0 19 viernes | **Finanzas** |
| hermes-saturday-sergio-brand | 0 14 sábado | Marca personal |
| hermes-sunday-weekly-review | 0 21 domingo | Review semanal |

- recordatorio-impuestos (`0 9 13,18 * *`): el prompt le pide al modelo filtrar
  `impuestos.json` por fecha — un filtro de 3 líneas de Python hecho en la cabeza del LLM.

### 1.4 Agentes de producto — `onia-platform/lib/onia-core/modules/agents-runtime.ts` (solo lectura)

Recall, Cobrador (dental + comercio) y Captador. **Hallazgo central: NO hay LLM en el
runtime.** Feeds = queries Prisma acotadas (`take: 1000/500/200`) → evaluadores **puros**
(`evaluateRecallCandidates`, `evaluateCollectorCandidates`, `evaluateLeadCandidates`) →
mensajes por **plantilla** (`buildRecallMessage`, etc.) → cola de aprobación humana con
guardrails, dedupe y máquina de estados. El feed no le dumpea filas a ningún modelo:
calcula primero y persiste drafts con forma fijada (`AgentActionDraft`).

Es **compute-over-context llevado al límite** (todo compute, cero contexto) y **act via
skill** con contrato de datos. Cero antipatrones. Es el patrón de referencia interno.

También positivo: `claude-guardia.sh` calcula en bash (Sentry, estados docker, canarios)
y SOLO invoca Claude headless para el diagnóstico con logs específicos. Correcto.

---

## 2. Juicio por agente — los 4 antipatrones + (a)/(b) + veredicto

### Proyecto (`.claude/agents/`)

| Agente | ¿Dumpea? | ¿Prosa? | ¿Trivial? | ¿Scope? | ¿(a)/(b)? | Veredicto |
|---|---|---|---|---|---|---|
| onia-orchestrator | no | sí — coordina leyendo reportes en prosa de otros subagentes (round-trips) | — | **sí: orquestar es rol de la sesión principal**, no de un subagente ("UNA sesión de control" ya es regla del CLAUDE.md); duplica a la skill `onia-router`; declara tools inexistentes | ni (a) ni (b) | **SOBRA** — su tabla de ruteo se fusiona en `onia-router` |
| onia-core-guardian | no | no (el validador da verde/rojo) | el trabajo duro ya lo hace `npm run validate:onia-core` (compute) | no | **(b)** mente fresca sobre el contrato | **QUEDA** (adelgazado: invariantes ya las impone el validador) |
| dentalgest-migrations | no | sí (reporte) | — | no | ni (a) ni (b) — es información empaquetada, no una mente aparte | **SE VUELVE SKILL** (además arrastra "contexto verificado 2026-07-03" congelado: viola fuente única) |
| hermes-automation | no | sí | — | duplica la regla n8n del CLAUDE.md global y las skills n8n-* públicas | ni (a) ni (b) | **SE VUELVE SKILL** delgada (solo lo Onia-específico) |
| onia-integrations | no | sí | — | es un DOC de estado disfrazado de agente; su estado ya está vencido | ni (a) ni (b) | **SE VUELVE DOC** (fuente de verdad de integraciones, editable) |
| onia-propuestas (agente) | no | no (usa el generador = compute) | — | duplica la skill homónima + reglas del CLAUDE.md (3 copias de las mismas reglas) | ni (a) ni (b) | **SOBRA** — la skill + `generar-propuestas.js` ya son la forma correcta |
| onia-crm-prospeccion | **anti-dumper explícito** ("pocos y buenos, no listas largas") | drafts para humano = ok; registros van al CRM canónico | — | no | **(a)** research en paralelo | **QUEDA** |
| onia-creative-radar | no | plan/guiones para humano = ok | — | roza el solape con los 4 jobs de contenido de Hermes | **(a)** research de tendencias | **QUEDA** (resolver el solape con los jobs) |
| web-factory-builder | no | no | — | duplica la skill `onia-web-factory` + `impeccable` | ni (a) ni (b) — construir lo hace la sesión con la skill | **SE VUELVE SKILL** (ya existe; borrar el agente) |

### Globales (`~/.claude/agents/`)

| Grupo | Juicio | Veredicto |
|---|---|---|
| 15 de lenguajes ajenos (cpp/csharp/dart/flutter/go/java/kotlin/rust/pytorch/healthcare) | **scope**: no pertenecen al dominio; pagan renta en el prompt de cada sesión | **SOBRAN** (15) |
| market-* (5) | sin frontmatter/tools → rotos; contenido = playbooks | **SE VUELVEN SKILLS** (5) |
| gan-planner + gan-generator | el loop de 3 agentes hardcodeados es el antipatrón que el taller corrige (E4) | **SE VUELVEN SKILLS** (2) |
| gan-evaluator | (b) legítimo: evalúa sin el contexto del autor | QUEDA |
| code/security/typescript/database/python-reviewer | **(b)** | QUEDAN (nota: code + typescript se pisan en proyectos TS) |
| planner | duplica al agente nativo `Plan` + skill `make-plan` | **SOBRA** |
| architect | (b) débil (opinión fresca de diseño); solape con `Plan` | QUEDA en observación |
| tdd-guide / e2e-runner / doc-updater | cada uno tiene skill instalada equivalente (`tdd`, `e2e-testing`, `update-docs`); e2e-runner = "correr playwright" (un bash) | **SE VUELVEN SKILLS** (3) |
| build-error-resolver / refactor-cleaner / performance-optimizer | ni (a) ni (b); la sesión principal con la skill hace lo mismo | candidatos a skill (mantener build-error-resolver si se usa como mente fresca sobre builds rotos) |
| opensource-sanitizer | (b): verificación sin contexto del autor | QUEDA; forker/packager → scripts+skill |
| docs-lookup | declara `mcp__context7__*` **no conectado** → roto | **SOBRA** (la skill `documentation-lookup` ya existe) |
| chief-of-staff | scope: dominio personal (email), no Onia | fuera del roster del repo |
| harness-optimizer / loop-operator | mini-prompts operativos (≈1 KB) | QUEDAN (costo ínfimo) |

### Jobs cron de Hermes (gateway, 13)

| Job(s) | Antipatrón | Veredicto |
|---|---|---|
| daily-operational-status, weekday-work-agenda, wednesday-build-sprint | **context-dumper suave**: piden al LLM "revisar estado" de gateway/VideoLab/pendientes — un script debería computar el status y pasarle solo el delta/top-N | consolidar en 1 job con status precomputado |
| recordatorio-impuestos | **context-dumper**: filtro por fecha sobre JSON hecho por el LLM | **SE VUELVE BASH** (python 3 líneas; LLM solo si hay algo que avisar) |
| daily-content-video-plan, daily-content-arthur, thursday-content-production, saturday-sergio-brand | 4 generadores de contenido solapados corriendo con LLM diario/semanal | consolidar en 1-2; prosa es el entregable (humano) = ok |
| weekly-kickoff, sunday-weekly-review | par plan/review razonable | QUEDAN |
| daily-video-lab-followup | ok (resume estado + siguiente comando) | QUEDA con status precomputado |
| daily-onia-videolab | ya delega a script determinista | QUEDA — patrón correcto |
| tuesday-prospecting, friday-finance-ops-review | Vendedor/Finanzas; prosa a humano = ok | QUEDAN |

Neto: **13 → ~6 jobs** sin perder ninguna salida.

### Producto (Recall / Cobrador / Captador)

| Juicio | Resultado |
|---|---|
| ¿Dumpea al LLM? | **No hay LLM.** Feeds → evaluadores puros → plantillas. |
| ¿Prosa? | No: `AgentActionDraft` y approval con metadata tipada (forma fijada). |
| ¿Trivial? | No: guardrails, dedupe, máquina de estados, multi-tenant. |
| ¿Scope? | Correcto (por rubro vía tracks; captador gateado por feature). |
| Veredicto | **QUEDAN los 3. Patrón de referencia.** |

---

## 3. MCPs — lo conectado HOY

### 3.1 Configurado en disco (medible)

`C:\Users\PC\.claude.json`:
- Global: `image-gen` (stdio) · `stitch` (http).
- Proyecto onia-hermes: `meta_developer_tools` (http, **SIN autenticar**) ·
  `cloudflare` (http, **SIN autenticar**) · `cloudflare-docs` (http).
- No hay `.mcp.json` en el repo ni en el worktree.
- Plugin habilitado `cloudflare@cloudflare` (settings global) → 3 servidores más:
  `cloudflare-bindings`, `cloudflare-builds`, `cloudflare-observability`.

### 3.2 Visto en la sesión (conectores claude.ai + harness; config NO está en disco)

14 conectores por UUID: Cloudflare, n8n, Vercel, Meta devtools, Google Drive, Figma,
visualize (duplicado del interno), Gamma, Notion, Google Calendar, Gmail, Higgsfield,
Supabase, Meta Ads. Más con nombre: claude-in-chrome, computer-use, mcp-registry,
scheduled-tasks, stitch, terminal, cloudflare-docs. Internos del harness (no removibles):
ccd_*, Claude_Browser, visualize.

**Total externo auditable: ~24 servidores + 2 muertos sin auth. ≈560 nombres de tools
diferidas** (contadas del listado de la sesión).

### 3.3 Los 4 juicios sobre MCPs

1. **¿Alguien los usa de verdad?** `grep mcp__` en `.claude/agents`, `.claude/skills`,
   `hermes-content/skills` y `hermes-content/docs`: **cero resultados**. La única
   referencia escrita a un MCP en todo el ecosistema es `docs-lookup.md` global →
   context7, que **no está conectado**. Uso real = ad-hoc en sesiones (no medible desde acá),
   más el carril n8n (skills `n8n-mcp-tools-expert` y compañía presumen un servidor n8n).
2. **¿Se pisan?** Sí, exactamente el cuadro del taller:
   - **Cloudflare x6**: conector claude.ai + plugin x3 + `cloudflare` proyecto (sin auth)
     + `cloudflare-docs`. Las tools `d1_*`/`kv_*`/`r2_*` aparecen **duplicadas
     literalmente** (conector vs plugin-bindings). Onia usa Cloudflare solo como DNS.
   - **Meta x2**: `meta_developer_tools` (sin auth, muerto) vs conector devtools vivo.
   - **Browser x3**: Claude_Browser (harness) + claude-in-chrome + computer-use.
   - **Stitch x2** y **visualize x2** (entrada global + conector/harness).
3. **¿Reemplazable por CLI?** (doctrina del taller: primitivas → CLI → MCP último):
   - Cloudflare → `wrangler` o nada (DNS se toca 2 veces al año).
   - Vercel → `vercel` CLI (existe la skill `vercel-cli-with-tokens`).
   - Supabase → **peligro activo**: el conector apunta a Supabase CLOUD y la base de
     producción es self-hosted en el VPS. Es el mismo error del incidente "diagnostiqué
     contra la nube que ya no era producción". Reemplazo: `ssh + psql` (ya se usa).
   - n8n → API REST del VPS o un solo servidor n8n (hoy hay conector + `n8n-mcp` en otro
     proyecto).
   - GitHub → `gh` (ya es la regla del workflow global).
4. **¿Deferred schemas?** Sí: el harness solo lista nombres y carga schemas vía
   ToolSearch. **Esto cambia el veredicto**: el costo por sesión no son las schemas
   completas (como en MCP clásico) sino la lista de ~560 nombres + el riesgo de
   solapamiento. Sacar servidores sigue valiendo, pero por higiene y por el peligro de
   apuntar al sistema equivocado, más que por tokens masivos.

---

## 4. TABLA FINAL

| Agente o MCP | Antipatrón (motivo corto) | ¿(a)/(b)? | Reemplazo propuesto | Ahorro esperado |
|---|---|---|---|---|
| onia-orchestrator | scope: orquestar es de la sesión principal; prosa round-trip; duplica `onia-router`; tools inexistentes | no | fusionar tabla de ruteo en skill `onia-router`; borrar | 2,9 KB/invocación + un salto de agente menos por tarea multi-frente (no medible en tokens) |
| onia-propuestas (agente) | duplica skill homónima (3 copias de las reglas) | no | skill + generador (ya existen) | 2,3 KB + 1 fuente de verdad menos que desincronizar |
| dentalgest-migrations | cápsula de info con estado congelado | no | skill/doc de migraciones | 2,5 KB; elimina estado vencido |
| hermes-automation | duplica regla n8n global | no | skill delgada Onia-n8n | 1,7 KB |
| onia-integrations | doc de estado disfrazado; estado vencido | no | doc fuente de verdad | 1,7 KB |
| web-factory-builder | duplica skill `onia-web-factory` | no | skill (ya existe) | 2,0 KB |
| onia-core-guardian | — (validador hace el compute) | **(b)** | QUEDA | — |
| onia-crm-prospeccion | — (anti-dumper explícito) | **(a)** | QUEDA | — |
| onia-creative-radar | — (solape con jobs Hermes) | **(a)** | QUEDA; dedupe con crons | — |
| 15 agentes globales de lenguajes ajenos | scope: dominio que Onia no toca | no | borrar del roster | ~82 KB en disco + 15 descripciones menos en CADA system prompt (medible al podar) |
| market-* (5) | rotos (sin frontmatter); playbooks, no mentes | no | skills de marketing | ~26 KB |
| gan-planner + gan-generator | trío hardcodeado = E4; el taller lo desarma | no | skills; solo evaluator queda | ~9 KB |
| planner (global) | duplica `Plan` nativo + `make-plan` | no | `Plan` nativo | 7,3 KB |
| tdd-guide / e2e-runner / doc-updater | skill equivalente ya instalada; e2e = un bash | no | skills `tdd`, `e2e-testing`, `update-docs` | ~11 KB |
| docs-lookup (global) | referencia a MCP no conectado (roto) | no | skill `documentation-lookup` | 3,6 KB |
| reviewers aplicables (code/security/ts/db/python) + gan-evaluator + opensource-sanitizer | — | **(b)** | QUEDAN | — |
| Jobs Hermes de status (x3) | context-dumper suave: LLM "revisa estado" sin precomputar | no | script computa status → 1 job con delta | ~2 corridas LLM diarias menos (tokens del gateway: no medibles desde acá) |
| recordatorio-impuestos | context-dumper: filtro de fechas en el LLM | no | python 3 líneas + LLM solo si hay aviso | 1 corrida LLM cada quincena |
| Jobs Hermes de contenido (x4) | solape (4 generadores) | no | consolidar en 1-2 | ~2 corridas LLM diarias menos |
| Recall / Cobrador / Captador (producto) | **ninguno** — determinista, forma fijada, human-in-the-loop | n/a | QUEDAN (patrón de referencia) | — |
| MCP cloudflare (proyecto, sin auth) + meta_developer_tools (sin auth) | peso muerto: configurados y jamás autenticados | — | borrar de `.claude.json` | 2 servidores; riesgo 0 |
| Plugin cloudflare (bindings/builds/observability) + conector Cloudflare | solape literal de tools x2; dominio que no se usa (solo DNS) | — | deshabilitar plugin; `wrangler` si algún día hace falta | 4 servidores, ~62 nombres de tools fuera de la lista |
| MCP Supabase (conector cloud) | **apunta al sistema equivocado** (prod es self-hosted en VPS) | — | `ssh + psql` (ya en uso); desconectar o rotular "solo cloud legacy" | elimina la clase de incidente "diagnostiqué contra la nube" |
| MCP Vercel | reemplazable por CLI (`vercel`, skill ya instalada) | — | CLI; conservar solo si se usan logs/analytics ad-hoc | 35 nombres de tools |
| MCP n8n (conector) + n8n-mcp (otro proyecto) | duplicado potencial | — | dejar UNO (el que usan las skills n8n) | 1 servidor |
| Gamma / Google Drive / stitch duplicado / visualize duplicado | sin uso detectado en repo ni memoria | — | desconectar; reconectar cuando un carril los pida | 4 servidores, ~68 nombres |
| Higgsfield / Meta Ads / Gmail / Calendar / Notion / Figma / chrome / computer-use | con uso real documentado (contenido, ads, correo, ops) | — | QUEDAN | — |
| mcp-registry / scheduled-tasks / terminal / ccd_* / Claude_Browser | internos del harness | — | no removibles desde acá | — |

---

## 5. Cuáles SOBRAN (menos agentes, no más) y orden del refactor

**Sobran — proyecto (6 de 9):** onia-orchestrator · onia-propuestas(agente) ·
dentalgest-migrations · hermes-automation · onia-integrations · web-factory-builder.
Quedan 3: onia-core-guardian (b), onia-crm-prospeccion (a), onia-creative-radar (a).

**Sobran — globales (~24 de 43):** 15 de lenguajes ajenos + 5 market-* + gan-planner +
gan-generator + planner + docs-lookup; y tdd-guide/e2e-runner/doc-updater pasan a sus
skills ya instaladas (3 más si se cuenta la conversión).

**Sobran/fusionan — jobs Hermes (7 de 13):** 3 de status → 1 · 4 de contenido → 1-2 ·
recordatorio-impuestos → bash.

**Sobran — MCPs (~11 de 26):** cloudflare sin auth, meta_developer_tools sin auth,
plugin cloudflare (x3), conector Cloudflare (dejar a lo sumo cloudflare-docs), Supabase
(re-apuntar o desconectar), Vercel (→CLI), un n8n de los dos, Gamma, Drive, stitch o
visualize duplicados.

**Orden sugerido (después, uno por uno — esta sesión NO refactoriza):**

1. Borrar los 2 MCP muertos de `.claude.json` (riesgo cero, 1 minuto).
2. Deshabilitar el plugin cloudflare + desconectar el conector Cloudflare (dominio sin uso).
3. Desconectar/rotular el MCP Supabase (elimina una clase de incidente ya sufrida).
4. Fusionar onia-orchestrator en la skill `onia-router` y borrar el agente.
5. Borrar onia-propuestas(agente) y web-factory-builder (sus skills ya existen).
6. Convertir dentalgest-migrations / hermes-automation / onia-integrations en skill/doc.
7. Podar el roster global (15 lenguajes + market-* + duplicados de skills).
8. Consolidar los 13 jobs Hermes en ~6 con status precomputado por script.
9. Recién entonces: evals (F2) para el agente que más corre, antes de tocar más.

## 6. Qué NO se pudo medir (y se dice)

- **Costo real en tokens de cada servidor MCP**: las schemas viven server-side y el
  harness las difiere; desde disco solo se cuentan nombres (~560) y config local.
- **Config de los conectores claude.ai** (14 servidores UUID): no está en disco.
- **Gasto en tokens de los 13 jobs del gateway Hermes**: no se leyeron logs de consumo
  del gateway (habría que instrumentarlo; hoy no se registra por-job).
- **Evals**: no existe ninguna línea de base para ningún agente — el taller la exige
  antes de declarar mejora (F2 pendiente).
- `hermes-daily-content-video-plan` y hermanos: no se midió cuántos tokens de skills-doc
  cargan por corrida (3-4 skills cada uno; los .md están en el VPS, medible en un paso
  posterior).
