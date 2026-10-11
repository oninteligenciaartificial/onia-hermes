# L01 - Modelo de cada subagente definido

Fecha: 2026-10-11. Punto: L01 del QA del harness. Versión 2 (corregida según verificador). Solo lectura del repo y de ~/.claude/agents; ningún archivo global escrito.

## Estado medido

Comandos:
- Repo: `for f in .claude/agents/*.md; do grep -n -m1 '^model:' "$f"; done`
- Global: `awk` sobre el bloque entre `---` de cada `~/.claude/agents/*.md` (solo el frontmatter, no el cuerpo).

Repo `.claude/agents/` (5 agentes + README.md sin frontmatter):

| Archivo | model | Rol |
|---|---|---|
| code-reviewer.md:5 | sonnet | revisor |
| security-reviewer.md:5 | sonnet | seguridad |
| onia-core-guardian.md:5 | opus | guardián del contrato core |
| onia-creative-radar.md:5 | sonnet | contenido/video |
| onia-crm-prospeccion.md:5 | sonnet | prospección y CRM |

Global `~/.claude/agents/`: 43 archivos `.md`. 38 con `model:` en el frontmatter, 5 sin frontmatter (`market-*`).

Distribución medida en global:
- opus (7): architect, planner, chief-of-staff, healthcare-reviewer, gan-planner, gan-generator, gan-evaluator.
- haiku (1): doc-updater.
- sonnet (30): docs-lookup, build-error-resolver, cpp-build-resolver, dart-build-resolver, go-build-resolver, java-build-resolver, kotlin-build-resolver, pytorch-build-resolver, rust-build-resolver, code-reviewer, security-reviewer, typescript-reviewer, python-reviewer, go-reviewer, rust-reviewer, java-reviewer, kotlin-reviewer, cpp-reviewer, csharp-reviewer, flutter-reviewer, tdd-guide, e2e-runner, refactor-cleaner, performance-optimizer, database-reviewer, harness-optimizer, loop-operator, opensource-forker, opensource-packager, opensource-sanitizer.
- sin model (5): market-competitive, market-content, market-conversion, market-strategy, market-technical.

No existe `dart-reviewer.md` en global. Revisor de Flutter es `flutter-reviewer.md`.

Market (verificado): las cinco primeras líneas son `# Market ... Subagent` y no `---`. Los cinco se describen a sí mismos como uno de "5 parallel subagents launched during a `/market audit`".

## Brecha

1. Cinco agentes `market-*` no tienen frontmatter (sin `name`, `description`, `model`). Efecto exacto en Claude Code: NO VERIFICADO en este punto. Lo medido es solo la ausencia de frontmatter.
2. Cinco agentes de decisión o planeación usan opus y no son decisiones de riesgo: planner, chief-of-staff, gan-planner, gan-generator, gan-evaluator. Architect y healthcare-reviewer quedan en opus por diseño. Coste de opus frente a sonnet: NO MEDIDO (no hay telemetría de tokens por subagente); no se cita multiplicador.
3. Nueve agentes de tarea cerrada y verificable usan sonnet: docs-lookup, build-error-resolver y siete variantes `*-build-resolver` (cpp, dart, go, java, kotlin, pytorch, rust). Pasar a haiku es hipótesis a validar con la prueba funcional, no hecho medido.
4. No hay regla escrita en el repo que obligue `model:` explícito en cada agente. `.claude/agents/README.md` no menciona modelo.
5. Los agentes de repo están bien: ninguno sin `model:`.

## Configuración propuesta

Cambios solo de la línea `model:` en global. Dry-run ejecutado sobre una copia en scratchpad (no sobre ~/.claude): tras el sed, opus queda solo en architect.md y healthcare-reviewer.md; haiku pasa a 10 archivos (doc-updater más los 9 de la brecha 3).

```bash
# Global (~/.claude/agents). NO aplicar sin OK de Sergio Urcullo.
cd ~/.claude/agents
sed -i 's/^model: opus$/model: sonnet/' planner.md chief-of-staff.md gan-planner.md gan-generator.md gan-evaluator.md
sed -i 's/^model: sonnet$/model: haiku/' docs-lookup.md build-error-resolver.md cpp-build-resolver.md dart-build-resolver.md go-build-resolver.md java-build-resolver.md kotlin-build-resolver.md pytorch-build-resolver.md rust-build-resolver.md
```

Frontmatter para los cinco `market-*` (insertar como primeras líneas de cada archivo, antes de `# Market ...`). Modelo `sonnet` por ser análisis de auditoría:

```yaml
---
name: market-competitive
description: Competitive positioning subagent for the /market audit. Evaluates competitive landscape, gaps and advantages of a target website.
model: sonnet
---
```

Para los demás, mismo formato con estos `name` y `description`:
- market-content: "Content and messaging subagent for the /market audit. Evaluates copy quality and persuasion of a target website."
- market-conversion: "Conversion optimization subagent for the /market audit. Evaluates conversion barriers and friction across the user journey."
- market-strategy: "Strategy subagent for the /market audit. Evaluates brand and trust, growth strategy and pricing of a target website."
- market-technical: "Technical marketing subagent for the /market audit. Evaluates SEO, site performance, tracking and content architecture."

Repo `.claude/agents/`: sin cambios obligatorios. Opcional, por PR: en `.claude/agents/README.md` añadir "Cada agente declara `model:` explícito en el frontmatter. Opus solo para decisiones de riesgo (architect, onia-core-guardian, healthcare-reviewer)."

Excepción de alcance: `architect` y `healthcare-reviewer` están en global; el README del repo menciona solo onia-core-guardian. La línea de README debe nombrar solo los agentes del repo si se escribe.

## Quién la aplica

- **Madre-dev (dev-infra)**: prepara el cambio. Edita `~/.claude/agents` solo tras OK, y el `.claude/agents/README.md` por PR.
- **Sergio Urcullo**: aprueba el cambio de modelo de 5 opus a sonnet y 9 sonnet a haiku. Toca su config global y cambia costo y calidad de sus revisiones.
- **Integrador**: mergea el PR del README del repo. No toca el global.
- **Madre-marketing**: decide si los `market-*` siguen en uso. Si sí, aplica el frontmatter. Si no, Sergio decide archivarlos.

## Prueba de hecho

1. `grep -l '^model:' ~/.claude/agents/*.md | wc -l` debe dar 38 antes y 43 después de añadir frontmatter a `market-*`.
2. `grep -l '^model: opus' ~/.claude/agents/*.md` debe listar solo architect.md y healthcare-reviewer.md.
3. `grep -l '^model: haiku' ~/.claude/agents/*.md` debe listar 10 archivos (doc-updater y las nueve de la brecha 3).
4. `head -1 ~/.claude/agents/market-*.md` debe dar `---` en los cinco.
5. Prueba funcional de la hipótesis de haiku: un build roto de prueba, resuelto por build-error-resolver con model haiku; el gate (`tsc --noEmit` o build del proyecto) debe pasar sin cambios de alcance. Si falla, revertir esa línea a sonnet.

UNKNOWN: coste real por agente (sin telemetría); efecto de frontmatter ausente en `market-*` sobre el registro de Claude Code (no probado); calidad de haiku en build-error-resolver (sin medir).
