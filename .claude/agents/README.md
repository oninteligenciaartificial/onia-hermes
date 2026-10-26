# Subagentes ONIA

Actualizado: 2026-10-02 (se restauraron `onia-core-guardian` y `onia-creative-radar`, borrados
en la limpieza del 29-sep; pedido de Sergio Urcullo).

Este directorio define los subagentes propios de ONIA (invocables con la tool `Agent` /
`subagent_type`). **Son cinco:** los tres de ONIA de esta tabla, más `code-reviewer` y `security-reviewer`,
que revisan todo PR (`CLAUDE.md` §«Calidad de código»). Área de cada uno (26-oct): `onia-crm-prospeccion` y
`onia-core-guardian` → Onia Platform; `onia-creative-radar` → Marca personal; los dos revisores → todas.

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

`code-reviewer` y `security-reviewer` viven también en este repo (`.claude/agents/`, copia idéntica de la global)
para que la nube los vea (10-oct-2026). Si se edita uno, se edita en los dos sitios.

## Qué agente usar en cada área (revisado el 20-oct-2026)

Se revisaron los 5 del repo, los 43 de `~/.claude/agents/` (casi todos de ECC), los de plugins
(`claude-security`, `superpowers`, `skill-creator`, `understand-anything`) y los integrados (`general-purpose`,
`Explore`, `Plan`). Modelo por rol (`CLAUDE.md`): Haiku cuenta y verifica, Sonnet sintetiza, Opus decide lo riesgoso.
El stack de skills de cada área está en `onia-router` § «Apartados por área».

| Agente | Área | Cuándo y cómo |
|---|---|---|
| `code-reviewer` | toda área que toca código | Antes de cada PR, con el diff. CRITICAL bloquea, HIGH avisa |
| `security-reviewer` | plataforma, infra, scripts | Antes del PR si toca auth, input de usuario, SQL, archivos, APIs externas, cripto o pagos |
| skill `claude-security:claude-security` (plugin, 20-oct) | plataforma | Escaneo profundo de un módulo sensible (cobro, alta, RLS) antes de publicarlo. Lanza varios agentes: lo pide Sergio Urcullo, no va en cada PR |
| `typescript-reviewer` | plataforma, web | PR grande de TypeScript o Next, junto a `code-reviewer` |
| `database-reviewer` | plataforma | Migración, RLS o consulta nueva de Postgres/Supabase |
| `onia-core-guardian` | plataforma (core) | Todo cambio a `contract.json`, adapters o `base-schema.sql` |
| `healthcare-reviewer` | plataforma (dental) | Cambios que tocan historia clínica o datos de pacientes |
| `tdd-guide` | plataforma | Feature o bug nuevo: el test primero |
| `build-error-resolver` | plataforma, web | `tsc` o build rotos: arreglo mínimo, sin rediseñar |
| `e2e-runner` | plataforma, web | Flujo crítico (alta, cobro, agenda) con `agent-browser` |
| `planner` · `architect` | plataforma, infra | Antes de un cambio de varias piezas o de una decisión de arquitectura. Solo leen |
| `performance-optimizer` | plataforma, web | LCP, INP o bundle fuera de meta |
| `refactor-cleaner` · `doc-updater` | plataforma, docs | En una tarea propia, nunca mezclados con una feature |
| `onia-creative-radar` | marca, video, pauta | Plan de pieza o video: investiga tendencias y extrae estructura. Nunca publica |
| `onia-crm-prospeccion` | ventas | Pocos prospectos con señal y fuente pública. Nunca contacta sin el OK del mensaje y el canal |
| `general-purpose` · `Explore` | investigación y todas | Búsqueda con muchos archivos o fuentes. `Explore` solo lee |
| `loop-operator` · `harness-optimizer` | infra/Hermes | Un loop trabado, o sesiones que arrancan pesadas |
| `python-reviewer` | infra | Scripts `.py` del repo |

**No usar**, y por qué:
- Lenguajes que ONIA no tiene: `cpp-*`, `csharp-reviewer`, `dart-build-resolver`, `flutter-reviewer`, `go-*`,
  `java-*`, `kotlin-*`, `rust-*`, `pytorch-build-resolver`. Quedan instalados: Sergio Urcullo no aprobó tocarlos.
- `gan-planner` · `gan-generator` · `gan-evaluator`: otro orquestador; duplica `scripts/orquesta`.
- `chief-of-staff`: triage de correo y chats; eso es de Hermes.
- `opensource-forker` · `-packager` · `-sanitizer`: ONIA no publica repos.
- `docs-lookup`: necesita el MCP Context7, que no está conectado.
- `market-*` (5 en `~/.claude/agents/`): no tienen cabecera, así que el harness no los carga como agentes.
- `superpowers:code-reviewer`: duplica `code-reviewer`. Los agentes de `skill-creator` y `understand-anything`
  son piezas internas de esas skills: no se llaman sueltos.

## Reglas de delegación (de AGENTS.md)
1. Data-first antes de preguntar. 2. Autonomía operativa antes de delegar al
humano. 3. Ejecución cerrada por defecto. 4. Cada pendiente cierra como
ejecutado / automatizado / bloqueado. 5. Gates: no tocar repos producto del core,
publicar, deployar, tocar secretos ni migrar DB real sin aprobación explícita.
