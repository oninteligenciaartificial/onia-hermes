# Onia — Stack de skills + reglas de subagentes

> Fuente de verdad viva — **sin fecha en el nombre a propósito**: esto se EDITA, no se
> reemplaza por una copia nueva. (Creado 2026-07-05, última revisión 2026-10-27.)
> Índice operativo vivo = skill **`onia-router`** (`.claude/skills/onia-router/SKILL.md`).
> Este doc guarda las capas, la spec para los repos separados y las reglas de subagentes.

## Las 3 capas de "skills" en Onia (no confundir)

1. **Skills de Claude Code** (`.claude/skills/`) — las que Claude Code auto-descubre e
   invoca al trabajar en el repo. Incluyen las **propias de Onia** (abajo) + las personales del
   usuario (`~/.claude/skills/`: 29 desde la poda del 27-oct, por uso real) + plugins.
2. **Subagentes** (`.claude/agents/`) — 3 agentes Onia: `onia-crm-prospeccion`,
   `onia-core-guardian` y `onia-creative-radar` (estos dos, restaurados el 2026-10-02). Los 6
   retirados el 18-ago siguen fuera (`historial/LIMPIEZA_SKILLS_20260929.md`).
3. **Skills-doc de Hermes** (`hermes-content/skills/`) — 15 docs operativos del
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

## Qué skill cargar
El mapa vive en un solo lugar: `onia-router` (por carril) y
`.claude/skills/onia-router/STACK-POR-DOMINIO.md` (por problema). Acá no se repite: el 27-oct esta copia todavía
mandaba a Superpowers, gstack y a decenas de personales que ya no se usaban.

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

Copiar allá las reglas del repo + la skill de dominio; NO copiar `onia-propuestas`
ni docs comerciales a repos de cliente.

## Reglas de subagentes (REGLA)
1. **Un subagente SOLO dentro del dominio de su carril.** Nunca edita archivos de otro carril.
2. **Exploración de código = subagente read-only** (`Explore`): devuelve conclusiones, no vuelca archivos.
3. **Tareas independientes en paralelo = varios subagentes**; dependientes = secuencial.
4. **Un subagente por dominio de archivos.** Dos no escriben el mismo archivo a la vez.
5. **Research = subagente con fuentes citadas** (`deep-research` + MCP `exa`): NO fabrica datos.
6. **Antes de spawnear:** ¿ya hay una sesión/carril dueño de esto? Si sí, va ahí.
7. **Mismos gates:** lo que produce un subagente pasa `tsc`/tests/agente `code-reviewer` antes de mergear.
8. **No sobre-spawnear.** Subagente cuando hay fan-out o varios ángulos; si es lineal y corto, directo.

## Higiene (pendiente, ver auditoría 2026-07-22)
- 8 marketplaces `temp_*` basura en `~/.claude/plugins/marketplaces/` (candidatos a borrar).
- Clon `everything-claude-code` con ~1090 archivos (variantes `.cursor`/`.kiro`/`ja-JP` = ruido).
- `OPENAI_API_KEY` en texto plano en `~/.claude/settings.json` → rotar + mover a env var.
