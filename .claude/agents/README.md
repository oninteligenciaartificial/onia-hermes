# Equipo de Agentes ONIA — Roster

Fecha: 2026-07-03. Owner: ONIA / Hermes.

Este directorio define el equipo de subagentes de ONIA (invocables con la tool
`Agent` / `subagent_type`). Curado sobre los mejores generalistas del catalogo +
agentes ONIA-especificos que codifican las reglas de `AGENTS.md` y `CLAUDE.md`.

## Como se usa
- El `onia-orchestrator` es la puerta de entrada para tareas multi-frente:
  descompone, delega al agente correcto y respeta los gates de aprobacion.
- Para trabajo de un solo frente, invocar directo al agente del frente.
- Mapea 1:1 con "Agentes por frente" de `AGENTS.md`.

## Agentes ONIA-especificos (definidos aqui)

| Agente | Frente | Track |
|---|---|---|
| `onia-orchestrator` | Planner/coordinacion multi-frente | Todos |
| `onia-core-guardian` | Contrato/adapters/schema del core | ONIA Core |
| `dentalgest-migrations` | Migraciones Prisma/Supabase, drift, RLS | ONIA Core / DentalGest |
| `hermes-automation` | n8n, crons, gateway VPS | Bot Hermes |
| `onia-integrations` | IG/Tavily/fal.ai/WhatsApp/Chatwoot | Bot Hermes |
| `onia-propuestas` | Propuestas comerciales | Ventas |
| `onia-crm-prospeccion` | Prospeccion y CRM | Ventas |
| `onia-creative-radar` | Contenido, video, Higgsfield | Contenido |
| `web-factory-builder` | Webs de cliente (Next.js) | Web Factory |

## Mejores generalistas del catalogo (reutilizar, no duplicar)

Ya instalados en el sistema; el orchestrator los delega segun el frente:

| Agente | Uso |
|---|---|
| `architect` | Diseno de sistema, decisiones arquitectonicas |
| `database-reviewer` | PostgreSQL/Supabase: schema, queries, RLS, performance |
| `security-reviewer` | Secretos, OWASP, input validation, exposure |
| `tdd-guide` | Tests primero, cobertura 80%+ |
| `code-reviewer` | Calidad de codigo tras cada cambio |
| `typescript-reviewer` | TS/JS: type safety, async, seguridad web |
| `e2e-runner` | E2E / visual regression de webs |
| `doc-updater` | Codemaps y documentacion |
| `build-error-resolver` | Build/type errors verdes rapido |
| `refactor-cleaner` | Dead code y consolidacion |

## Reglas de delegacion (de AGENTS.md)
1. Data-first antes de preguntar. 2. Autonomia operativa antes de delegar al
humano. 3. Ejecucion cerrada por defecto. 4. Cada pendiente cierra como
ejecutado / automatizado / bloqueado. 5. Gates: no tocar repos producto del core,
publicar, deployar, tocar secretos ni migrar DB real sin aprobacion explicita.
