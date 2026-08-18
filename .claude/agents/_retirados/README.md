# Agentes retirados (2026-08-18)

Retirados por la auditoría de antipatrones (`hermes-content/docs/ONIA_AGENTES_MCP_AUDITORIA_ANTIPATRONES.md`),
que aplicó los 3 antipatrones del taller Code w/ Claude a los 68 agentes del sistema.

**Reversible**: `mv _retirados/<agente>.md ..` los revive tal cual.

| Agente | Por qué se retiró | Qué lo reemplaza |
|---|---|---|
| `onia-orchestrator` | Scope: orquestar es rol de la sesión principal ("UNA sesión de control" ya es regla del CLAUDE.md), no de un subagente. Coordinaba leyendo prosa de otros agentes (round-trips) y declaraba herramientas que no existen en el harness | La sesión principal + skill `onia-router` |
| `onia-propuestas` | Duplicaba la skill homónima y las reglas del CLAUDE.md — tres copias de lo mismo para desincronizar | Skill `onia-propuestas` + `generar-propuestas.js` |
| `dentalgest-migrations` | Cápsula de información con estado CONGELADO ("verificado 2026-07-03") — viola fuente única | Skills `onia-db` / `onia-deploy` del producto |
| `hermes-automation` | Duplicaba la regla n8n del CLAUDE.md global y las skills n8n-* públicas | Regla global + skills `n8n-*` |
| `onia-integrations` | Doc de estado disfrazado de agente, y su estado ya estaba vencido (decía "Instagram falta token" — resuelto) | Doc de integraciones editable |
| `web-factory-builder` | Duplicaba la skill `onia-web-factory` + `impeccable` | Skills existentes |

**Los 3 que QUEDAN** (cumplen los casos válidos de subagente):
- `onia-core-guardian` — caso (b): mente fresca que revisa el contrato del core sin el contexto de quien lo escribió.
- `onia-crm-prospeccion` — caso (a): investigación en paralelo con fuentes.
- `onia-creative-radar` — caso (a): investigación de tendencias en paralelo.
