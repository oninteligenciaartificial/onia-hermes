# Subagentes ONIA

Actualizado: 2026-09-29 (limpieza por uso real de los últimos 30 días).

Este directorio define los subagentes propios de ONIA (invocables con la tool `Agent` /
`subagent_type`). **Queda uno solo:**

| Agente | Para qué | Por qué se quedó |
|---|---|---|
| `onia-crm-prospeccion` | Prospección y CRM: pocos prospectos buenos con señal de oportunidad, fuentes públicas verificables, nunca contacta sin aprobación | La etapa vigente es vender a 5 clínicas (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §7) y la auditoría de agentes lo conservó por su diseño anti-listas-largas |

Los otros 8 (`onia-orchestrator`, `onia-propuestas`, `dentalgest-migrations`,
`hermes-automation`, `onia-integrations`, `web-factory-builder`, `onia-core-guardian`,
`onia-creative-radar`) se borraron: 0 usos en 30 días y su trabajo lo hacen las skills
(`onia-router`, `onia-propuestas`, `onia-core`, `diseno-contenido-onia`, `editor-videos`,
`onia-web-factory`). Detalle y cómo recuperarlos:
`hermes-content/docs/historial/LIMPIEZA_SKILLS_20260929.md`.

## Generalistas (globales, `~/.claude/agents/`)

Los que se usan de verdad: `general-purpose`, `Explore`, `code-reviewer`, `security-reviewer`.

## Reglas de delegación (de AGENTS.md)
1. Data-first antes de preguntar. 2. Autonomía operativa antes de delegar al
humano. 3. Ejecución cerrada por defecto. 4. Cada pendiente cierra como
ejecutado / automatizado / bloqueado. 5. Gates: no tocar repos producto del core,
publicar, deployar, tocar secretos ni migrar DB real sin aprobación explícita.
