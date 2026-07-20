# ONIA Center - Plan del Jarvis (construcción) 2026-07-20

Estado: orden de construcción para dejar el ONIA Center operativo como el "Jarvis".
Fecha: 2026-07-20.
Uso: es lo PRIMERO que se cierra; desde acá se administra todo lo demás.

## Estado real (mapeado 2026-07-20)

Ya vive en Supabase real (schema **`onia_center`**), lee/escribe:
- auth por rol, CRM de leads (kanban), tareas (crear + persiste), cola de reviews,
  finanzas (`finance_summary` + `tax_posture`), estado de agentes (`operating_agents`,
  read-only), vista "Hoy".

**Corrección de schema:** el panel usa `onia_center`, NO `onia_sales` (panel viejo no
cableado). Todo lo nuevo EXTIENDE `onia_center`. "Mi día" se construye sobre la vista
"Hoy" existente, no desde cero.

Falta el cableado que lo vuelve Jarvis: cambiar estado de tareas en el panel nuevo,
alta de lead en el panel nuevo, personas reales + scorecards, chat IA en pantalla,
disparar/auditar agentes.

## Orden de construcción - Fase 1 (Jarvis operativo)

El ONIA Center es UN carril (toca `src/app/onia-center/**`). Las tareas van
**SECUENCIALES** en la sesión del carril A (worktree `onia-center-fase2`) — no se
paralelizan porque todas tocan la misma carpeta. Dentro de esa sesión sí se pueden
usar subagentes (uno construye, code-reviewer revisa), pero de a uno.

| # | Tarea | Cubre | Depende de |
|---|---|---|---|
| **J-1** | Estados de tarea en el panel nuevo | administrar tareas | nada (ya existe el PATCH) |
| **J-2** | Alta de lead en el panel nuevo | CRM | nada |
| **J-3** | Personas reales + scorecards | ver desarrollo de todos | Infra (crear las 3 personas) |
| **J-4** | Chat "Jarvis" en la UI | el asistente | Infra (key OpenAI) |
| **J-5** | Disparar agentes + feed de auditoría | agentes que administran | Infra (webhooks n8n) |

J-1 y J-2 arrancan YA (usan lo que existe). J-3/J-4/J-5 esperan a Infra.

## En paralelo (otros carriles, sí paralelizables)

- **Infra:** extender `onia_center` con personas (Camila, Jerónimo, Arthur) +
  scorecards + comisiones; poner key OpenAI (chat); webhooks n8n de agentes. Desbloquea
  J-3/J-4/J-5.
- **Web-factory (carril B):** rescatar landings de `sad-nash` (material de venta).

## Prompts (copy-paste) - una tarea = una sesión/subagente

### J-1 · estados de tarea
```
Carril A - ONIA Center. Worktree onia-center-fase2. Primero: git branch --show-current + git rebase origin/main.
Dueño: SOLO src/app/onia-center/** + api/onia-center/**.
TAREA ÚNICA: en el panel nuevo (/next/pipeline y /next/hoy) poder cambiar el estado de una tarea
(todo→doing→review→done) + evidencia, como ya se hace en /equipo legacy. Nada más.
Reusar: PATCH /api/onia-center/runtime (ya soporta cambio de estado); patrón en equipo/page.tsx (updateTaskStatus).
Cierre a 'done' solo Sergio (ya enforced). LISTO: se mueve el estado desde /next/pipeline y persiste; tsc+build verdes → merge → PARÁS.
NO HAGAS: chat, agentes, comisiones, alta de lead.
```

### J-2 · alta de lead
```
Carril A - ONIA Center. Worktree onia-center-fase2. git branch --show-current.
TAREA ÚNICA: formulario de alta de lead en /next/pipeline (hoy solo mueve etapas; crear lead solo está en /equipo).
Reusar patrón equipo/page.tsx (createEntity 'lead') + POST runtime. Nada más.
LISTO: se crea un lead desde /next/pipeline, aparece en el kanban y persiste; tsc+build verdes → merge → PARÁS.
NO HAGAS: comisiones, ventas, otras vistas.
```

### J-3 · personas reales + scorecards
```
Carril A - ONIA Center (coordinar con Infra). git branch --show-current.
TAREA ÚNICA: tabla real de personas (Camila, Jerónimo, Arthur) + scorecard por persona en /next/negocio.
Hoy Colaboradores es estático (solo Arthur, en operating-source.ts).
Pasos: leer personas de user_profiles/collaborators (real, no hardcode); scorecard = tareas cerradas + leads + evidencia por persona (de onia_center). Requiere que Infra haya creado las 3 personas.
LISTO: se ven las 3 personas reales con su scorecard; tsc+build verdes → merge → PARÁS.
NO HAGAS: comisiones, chat, agentes.
```

### J-4 · chat Jarvis
```
Carril A - ONIA Center (Infra pone la key). git branch --show-current.
TAREA ÚNICA: cablear el chat "Jarvis" a la UI. El endpoint /api/onia-center/assistant YA existe (OpenAI/Dify,
contexto por rol, guardrails) pero ningún componente lo llama. Agregar una caja de chat en el AppShell/TopNav.
Requiere env ONIA_ASSISTANT_PROVIDER=openai + key (Infra). LISTO: se abre el chat, responde con contexto real; tsc+build verdes → merge → PARÁS.
NO HAGAS: cambiar el endpoint, agentes, scorecards.
```

### J-5 · disparar agentes + auditoría
```
Carril A - ONIA Center (Infra pone webhooks n8n). git branch --show-current.
TAREA ÚNICA: desde el panel de Agentes, disparar un agente (webhook n8n) + feed de corridas (Auditoría hoy = EmptyState).
Reusar: operating_agents (estado), briefings/daily (patrón de trigger con API key interna). LISTO: se dispara el Agente del Día
y aparece su corrida en el feed; tsc+build verdes → merge → PARÁS. NO HAGAS: crear agentes nuevos, chat.
```

## Después del Jarvis

- **Fase 2 - activar el equipo:** alta de Camila/Jerónimo, firmar acuerdos, empezar a vender.
- **Fase 3 - motores:** operar Nuvia, rescate de landings, desarrollo (Arthur/Jerónimo).
