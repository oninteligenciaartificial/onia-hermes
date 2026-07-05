# ONIA — Stack de skills + reglas de subagentes (2026-07-05)

Cómo se usa: toda sesión invoca la skill relevante ANTES de trabajar. Si existe
una skill para la tarea, se usa (no reinventar). Estas son las del ecosistema
ONIA por dominio, mapeadas a los carriles (ver `CLAUDE.md` §Desarrollo en paralelo).

## Stack por dominio

### Investigación / estrategia (carril I)
- `deep-research`, `exa-search`, `market-research`, `iterative-retrieval` —
  investigar productos/mercados con fuentes citadas.
- `office-hours` (YC) y `brainstorming` — validar si una idea vale construirse
  ANTES de codear.

### Web / diseño (carriles A, B)
- `impeccable`, `taste-design`, `ui-ux-pro-max`, `frontend-design` — diseño
  anti-template, jerarquía, calidad.
- `design-review`, `design-md`, `image-to-code`, `web-artifacts-builder`,
  `shadcn-ui`, `ui-styling` — derivar, revisar, construir.

### Video (carriles H, J)
- `remotion`, `remotion-video-creation` — video programático en React [carril J].
- `video-editing`, `banner-design` — edición y piezas [carril H].
- Higgsfield MCP = generación; skills del repo (video-lab-higgsfield,
  carruseles-onia, videos-virales-higgsfield, ugc-empresas-higgsfield) [carril H].

### Propuestas / documentos (carril C)
- `article-writing`, `make-pdf`, `slides`, `document-generate` — copy y entregables.
- Generador oficial de propuestas = fuente; NUNCA HTML a mano.

### n8n / automatización (carril G)
- `n8n-workflow-patterns`, `n8n-mcp-tools-expert`, `n8n-node-configuration`,
  `n8n-code-javascript`, `n8n-validation-expert`.

### Backend / DB / API (carriles D, E, y features)
- `postgres-patterns`, `database-migrations`, `backend-patterns`, `api-design`.

### Proceso (todas las sesiones)
- `writing-plans` / `make-plan` — planear multi-paso.
- `test-driven-development`, `verification-before-completion` — calidad.
- `systematic-debugging` / `investigate` — bugs (no adivinar la causa).
- `dispatching-parallel-agents`, `subagent-driven-development` — orquestar subagentes.
- `code-review`, `security-review` — antes de mergear.

## Reglas de subagentes (REGLA)

1. **Un subagente SOLO dentro del dominio de su carril.** Nunca edita archivos de
   otro carril (misma regla de no-choque que las sesiones).
2. **Exploración de código base = subagente read-only** (Explore): devuelve
   conclusiones, no vuelca archivos completos al contexto.
3. **Tareas independientes en paralelo = varios subagentes a la vez**
   (`dispatching-parallel-agents`). Tareas dependientes = secuencial.
4. **Un subagente por dominio de archivos.** Dos subagentes no escriben el mismo
   archivo al mismo tiempo.
5. **Research = subagente con fuentes citadas** (`deep-research`/`exa-search`):
   NO fabrica datos; devuelve un doc/hallazgo accionable.
6. **Antes de spawnear preguntá: ¿ya hay una sesión/carril dueño de esto?** Si sí,
   va en esa sesión, no en un subagente suelto que pise su trabajo.
7. **Mismos gates:** lo que produce un subagente pasa `tsc`/tests/`code-review`
   antes de mergear.
8. **No sobre-spawnear.** Subagente cuando la tarea tiene varios ángulos
   independientes o requiere fan-out; si es lineal y corto, hacelo directo.
