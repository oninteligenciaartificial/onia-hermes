# Onia — Stack de skills + reglas de subagentes

> Fuente de verdad viva — **sin fecha en el nombre a propósito**: esto se EDITA, no se
> reemplaza por una copia nueva. (Creado 2026-07-05, última revisión 2026-09-29.)
> Índice operativo vivo = skill **`onia-router`** (`.claude/skills/onia-router/SKILL.md`).
> Este doc es la versión legible + la spec para los repos separados.

## Las 3 capas de "skills" en Onia (no confundir)

1. **Skills de Claude Code** (`.claude/skills/`) — las que Claude Code auto-descubre e
   invoca al trabajar en el repo. Incluyen las **propias de Onia** (abajo) + las 215
   globales del usuario + plugins.
2. **Subagentes** (`.claude/agents/`) — queda 1 agente Onia: `onia-crm-prospeccion`.
   Los otros 8 se borraron el 2026-09-29 por 0 uso en 30 días
   (`historial/LIMPIEZA_SKILLS_20260929.md`).
3. **Skills-doc de Hermes** (`hermes-content/skills/`) — 28 docs operativos del
   **bot Hermes** (NO son skills de Claude Code). El bot lee su propia copia en el VPS
   (`/root/.hermes/skills/`); la del repo es la versión con historial en git. Fuente de conocimiento a la
   que apuntan las skills propias.

## Cómo se usa
Toda sesión arranca invocando **`onia-router`**: identifica el carril, carga el stack y
respeta las reglas duras. Si existe una skill para la tarea, se usa (no reinventar).

## Skills Onia propias (este repo, `.claude/skills/`)
| Skill | Cuándo | Apunta a |
|---|---|---|
| `onia-router` | inicio de toda sesión; "¿qué skill/agente uso?" | este doc, CLAUDE.md, COORDINATION_MANIFEST |
| `onia-propuestas` | crear/cotizar/enviar propuesta a cliente | `hermes-content/propuestas/generador/`, PRICING_RATIONALE §0 |
| `onia-contabilidad-bolivia` | fiscal/contable Bolivia (propio + features ERP) | skills fiscales + `docs/ONIA_OPTIMIZACION_FISCAL_PROPIA_2026.md`, `integrations/siat/` |
| `onia-core` | tocar/adoptar el núcleo | `onia-core/contract.json`, guardián + validador |
| `onia-web-factory` | construir/rediseñar webs | design-stack, Pattern Bank, gates tsc/E2E |

## Stack de proceso común (TODA sesión)
`using-superpowers` · `brainstorming` · `make-plan`/`writing-plans` ·
`test-driven-development` · `systematic-debugging`/`investigate` ·
`verification-before-completion` · `code-review` · `security-review` ·
`dispatching-parallel-agents` · `using-git-worktrees` · memoria `claude-mem`.

## Mapa por dominio (skills instaladas)

### Investigación / estrategia (carril I)
`deep-research`, `exa-search`, `market-research`, `iterative-retrieval`, `office-hours`,
`brainstorming` — investigar con fuentes citadas; validar la idea antes de codear.

### Web / diseño (carriles A, B) → skill `onia-web-factory`
`impeccable`, `taste-design`, `ui-ux-pro-max`, `frontend-design`, `frontend-patterns`,
`react-components`, `shadcn-ui`, `ui-styling`, `nextjs-turbopack`, `design-review`,
`emil-design-eng`, `minimalist-ui`, `industrial-brutalist-ui`, `image-to-code`,
`web-artifacts-builder`, `landing-report`, `land-and-deploy`, `imagegen-frontend-web`/`-mobile`.

### Video (carriles H, J)
`diseno-contenido-onia` (índice), `editor-videos`, `ver-videos`, `sacar-prompt`, `hyperframes`
(copia global; Remotion está jubilado), `banner-design` (carril H) + Higgsfield. Skills-doc:
video-lab-higgsfield, carruseles-onia, ugc-empresas-higgsfield.

### Propuestas / documentos (carril C) → skill `onia-propuestas`
`article-writing`, `make-pdf`, `slides`, `document-generate`, `brand`/`brandkit`.
Generador oficial = fuente; NUNCA HTML a mano.

### n8n / automatización (carril G)
`n8n-workflow-patterns`, `n8n-mcp-tools-expert`, `n8n-node-configuration`,
`n8n-code-javascript`, `n8n-validation-expert`, `n8n-expression-syntax`,
`docker-patterns`, `deployment-patterns`.

### Backend / DB / API + core (carriles D, E, onia-core) → skill `onia-core`
`postgres-patterns`, `database-migrations`, `backend-patterns`, `api-design`,
`security-review`, `verification-loop`.

### Fiscal / contable (propio + ERPs) → skill `onia-contabilidad-bolivia`
`deep-research` (validar RND/DS vigentes con fuente). Gap: no hay skill pública buena.

## Spec para los repos SEPARADOS (aplicar en SU propia sesión/carril)
Los repos `onia-platform` y Bolivian Electric están fuera de `onia-hermes`; por la
regla de carriles NO se tocan desde la sesión del monorepo. Cuando trabajes DENTRO de
cada uno, crear su `.claude/skills/` con:

- **`onia-platform`** (carril D) — LA plataforma que se vende, con packs por rubro.
  `onia-core` (copia adaptada al namespace del producto), stack backend/DB
  (`database-migrations`, `postgres-patterns`, `api-design`, `security-review`) +
  frontend (`impeccable`, `frontend-design`) + las skills propias de `onia-platform/.claude/skills/`.
  Regla: es producto PROPIO de ONIA → se puede leer el cerebro.
  ⚠️ Antes decía "repo DentaGest", que **no existe en el disco**.
- **Bolivian Electric** (carril F): CLIENTE — solo el stack backend, sin cerebro Onia,
  y no exponer skills internas/comerciales. Solo lectura salvo pedido explícito.
- ⚠️ `Gestios` y `Ganaderos-Os` existen como repos pero **no son productos**: son legado
  del encuadre viejo de cuatro marcas. No se les agrega nada nuevo sin decidir antes si
  se archivan o se absorben como packs.

Copiar allá el bloque de proceso común + la skill de dominio; NO copiar `onia-propuestas`
ni docs comerciales a repos de cliente.

## Reglas de subagentes (REGLA)
1. **Un subagente SOLO dentro del dominio de su carril.** Nunca edita archivos de otro carril.
2. **Exploración de código = subagente read-only** (`Explore`): devuelve conclusiones, no vuelca archivos.
3. **Tareas independientes en paralelo = varios subagentes** (`dispatching-parallel-agents`); dependientes = secuencial.
4. **Un subagente por dominio de archivos.** Dos no escriben el mismo archivo a la vez.
5. **Research = subagente con fuentes citadas** (`deep-research`/`exa-search`): NO fabrica datos.
6. **Antes de spawnear:** ¿ya hay una sesión/carril dueño de esto? Si sí, va ahí.
7. **Mismos gates:** lo que produce un subagente pasa `tsc`/tests/`code-review` antes de mergear.
8. **No sobre-spawnear.** Subagente cuando hay fan-out o varios ángulos; si es lineal y corto, directo.

## Higiene (pendiente, ver auditoría 2026-07-22)
- 8 marketplaces `temp_*` basura en `~/.claude/plugins/marketplaces/` (candidatos a borrar).
- Clon `everything-claude-code` con ~1090 archivos (variantes `.cursor`/`.kiro`/`ja-JP` = ruido).
- `OPENAI_API_KEY` en texto plano en `~/.claude/settings.json` → rotar + mover a env var.
