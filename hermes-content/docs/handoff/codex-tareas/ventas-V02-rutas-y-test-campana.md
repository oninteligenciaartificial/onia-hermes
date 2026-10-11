---
id: ventas-V02
carril: ventas
estado: hecha
modelo: gpt-6-luna
repo: onia-hermes
rama: codex/ventas-v02-rutas-y-test-campana
base: main
pr:
escrita: 2026-10-11 por Ventas y pauta (sesión de la nube, Sonnet 5.5), a pedido de la madre (S05)
actualizada: 2026-10-11 por Ventas y pauta
nota: Ya aplicado por Ventas y pauta en el mismo commit que escribió este contrato; no hace falta lanzarlo. Queda como verificación mecánica si la madre quiere una segunda mirada.
---
# V02 · Rutas rotas de `grabar-captura.mjs` en la cola y el handoff

Sos Codex. Trabajás SOLO en esta carpeta: un worktree de `onia-hermes` que creó la madre, en la rama `codex/ventas-v02-rutas-y-test-campana`.
- No uses git: ni consultas, ni cambio de rama, ni commits. La madre verifica la rama y revisa el diff.
- Nadie contesta preguntas mientras corrés. Sin push, sin npm install, sin producción, sin red. NO commitees.

## META
Que quien siga la cola de Ventas o su handoff encuentre el script de grabación en su ruta real: `.claude/skills/onia-ventas-pauta/scripts/grabar-captura.mjs` (el 11-oct había un nombre desnudo en la cola y una ruta `scripts/…` que no existe en el handoff).

## PRUEBA DE HECHO
Todo lo corre la madre:
1. `grep -nE '(^|[^a-z./-])scripts/grabar-captura' hermes-content/docs/cola/loop/ventas-pauta.md hermes-content/docs/handoff/mercado-y-pauta.md` → sin resultados.
2. `grep -nE '(^|[^/a-z.-])grabar-captura\.mjs' hermes-content/docs/cola/loop/ventas-pauta.md hermes-content/docs/handoff/mercado-y-pauta.md` → sin resultados (el nombre desnudo no aparece; la ruta completa tiene `/` antes).
3. `ls .claude/skills/onia-ventas-pauta/scripts/grabar-captura.mjs` existe.
4. `node --test scripts/campana-lista.test.mjs` sale con código 0.

## REGLA DE PARADA
- Si el grep 1 o el 2 encuentra algo, corregí SOLO esa línea con la ruta completa y volvé a correrlo.
- Si `campana-lista.test.mjs` falla por algo ajeno a las rutas, no lo arregles: reportalo con el mensaje del test.
- No toques ningún otro archivo ni ningún otro renglón.

## ARCHIVOS
- Edita: `hermes-content/docs/cola/loop/ventas-pauta.md` y `hermes-content/docs/handoff/mercado-y-pauta.md` (solo las rutas del script).
- Todo lo demás, prohibido.
