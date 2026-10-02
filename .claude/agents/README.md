# Subagentes ONIA

Actualizado: 2026-10-02 (se restauraron `onia-core-guardian` y `onia-creative-radar`, borrados
en la limpieza del 29-sep; pedido de Sergio Urcullo).

Este directorio define los subagentes propios de ONIA (invocables con la tool `Agent` /
`subagent_type`). **Son tres:**

| Agente | Para qué | Estado |
|---|---|---|
| `onia-crm-prospeccion` | Prospección y CRM: pocos prospectos buenos con señal de oportunidad, fuentes públicas verificables, nunca contacta sin aprobación | La etapa vigente es vender a 5 clínicas (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §7) y la auditoría de agentes lo conservó por su diseño anti-listas-largas |
| `onia-core-guardian` | Guardián del contrato de ONIA Core (`contract.json`, adapters, `base-schema.sql`): invariantes, 3 adapters en sincronía, validador verde antes de commitear | Restaurado 2026-10-02 |
| `onia-creative-radar` | Contenido y video (carruseles, historias, guiones, UGC, Higgsfield): investiga tendencias antes de crear, nunca publica sin aprobación | Restaurado 2026-10-02 |

Los 6 retirados el 2026-08-18 (`onia-orchestrator`, `onia-propuestas`, `dentalgest-migrations`,
`hermes-automation`, `onia-integrations`, `web-factory-builder`) **no se restauraron**: ya estaban
retirados antes de la limpieza y, dentro de `.claude/agents/`, el harness los volvía a ofrecer
(uno se invocó por error el 21-sep). Su trabajo lo hacen las skills (`onia-router`,
`onia-propuestas`, `onia-web-factory`). Detalle y cómo recuperarlos:
`hermes-content/docs/historial/LIMPIEZA_SKILLS_20260929.md`.

## Generalistas (globales, `~/.claude/agents/`)

Los que se usan de verdad: `general-purpose`, `Explore`, `code-reviewer`, `security-reviewer`.

## Reglas de delegación (de AGENTS.md)
1. Data-first antes de preguntar. 2. Autonomía operativa antes de delegar al
humano. 3. Ejecución cerrada por defecto. 4. Cada pendiente cierra como
ejecutado / automatizado / bloqueado. 5. Gates: no tocar repos producto del core,
publicar, deployar, tocar secretos ni migrar DB real sin aprobación explícita.
