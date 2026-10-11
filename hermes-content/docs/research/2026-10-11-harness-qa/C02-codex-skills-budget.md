# C02 - Codex: presupuesto de skills (K1)

Fecha de medicion: 2026-10-11 (v2, corregida tras verificador). Solo lectura. No se toco Codex, ni git, ni configuracion.

## Estado medido

1. Link de `~/.agents/skills`:
   - PowerShell: `Get-Item "$HOME\.agents\skills"` -> LinkType `Junction`, Target `C:\dev\proyectos\onia-hermes\.agents\skills`.
   - `cmd /c dir /AL C:\Users\PC\.agents` lista `skills` como enlace (junction).
   - Skills (carpetas de primer nivel con `SKILL.md`): **30** en `~/.agents/skills` y **30** en el repo `.agents/skills` (`ls | wc -l` = 30 en ambos).

2. Roots de skills medidos (solo lectura, conteo de primer nivel, sin seguir recursivamente dentro de junctions):

| Root | Carpetas con SKILL.md (nivel 1) | Nota |
|---|---|---|
| `~/.codex/skills` | 61 | 66 `SKILL.md` con profundidad <= 3 (medido antes; la diferencia son anidados) |
| `~/.agents/skills` | 30 | junction al repo |
| `~/.claude/skills` | 108 | (el 1061 de la version anterior era recursivo; no es el conteo que Codex usa) |
| `~/.codex/plugins/cache` | 247 `SKILL.md` (recursivo) | plugins instalados |
| `~/.claude/plugins` | 1190 `SKILL.md` (recursivo) | incluye versiones duplicadas; no se sabe cuales carga Codex |
| `~/.codex/.tmp/plugins` | 536 `SKILL.md` (recursivo) | espejo de marketplaces; posible duplicado |
| `~/.codex/.tmp/marketplaces` | 330 `SKILL.md` (recursivo) | espejo; posible duplicado |

   Los totales recursivos se solapan (espejos y versiones). No se suman.

3. `~/.codex/config.toml` habilita ~25 plugins de marketplaces (lineas 49-121: `openai-curated`, `claude-plugins-official`, `personal`, `openai-bundled`, etc.). Es la fuente candidata mas probable de las skills extra. **No confirmado**: los logs no indican de que root sale cada skill.

4. Aviso `Exceeded skills context budget` (`... 509 additional skills were not included ...`):
   - `~/.codex/sessions`, archivos con mtime en las ultimas 48 h: **50** archivos, **0** con el aviso. Comando: `find ~/.codex/sessions -type f -mtime -2 -print0 | xargs -0 grep -l "skills context budget"` -> 0.
   - `~/.codex/madre-tareas/*/eventos.jsonl`: **49** archivos con el aviso (de 64 carpetas). Cifra de skills omitidas por archivo: **493** (3 archivos), **502** (30), **509** (16). La cifra NO es constante.
   - Desde 2026-10-09 (carpetas con prefijo `20261009` o posterior): **24** carpetas con el aviso. Ultima: `20261010-142956-resume-cx-publicar-2`.
   - No se vuelve a medir si el aviso aparece en corridas del 2026-10-11 (no hubo corridas nuevas en la medicion).

5. Umbral de presupuesto de Codex: **UNKNOWN**. No esta documentado en los archivos medidos.

## Brecha

- El aviso sigue apareciendo en las tareas lanzadas por la madre (`madre-tareas`), no en `~/.codex/sessions` de las ultimas 48 h. La ausencia en sesiones no prueba que el problema este resuelto: esas sesiones no lanzan el mismo flujo.
- Cuando se excede el presupuesto, Codex quita todas las descripciones de skills y omite 493-509 skills. La tarea corre sin las skills que su contrato pide.
- Las 30 skills del repo (y las 61 de `~/.codex/skills`) no explican el total de 493-509. El origen real es UNKNOWN: probablemente plugins habilitados y sus caches, pero no esta medido.
- Por eso **no se puede sostener** que renombrar `~/.codex/skills` reduzca el presupuesto ni que elimine el aviso. Ese cambio se retira como fix firme.

## Configuracion propuesta

Propuesta condicional. **No aplicada.** Paso 1 es solo lectura y decide si hay un paso 2.

Paso 1 (solo lectura, Sergio Urcullo ejecuta en PowerShell): conteo por root sin seguir junctions. Junctions se resuelven a su target y se cuentan una vez.

```powershell
$roots = @(
  "$HOME\.codex\skills",
  "$HOME\.agents\skills",
  "$HOME\.claude\skills",
  "$HOME\.codex\plugins\cache",
  "$HOME\.claude\plugins"
)
foreach ($r in $roots) {
  if (-not (Test-Path -LiteralPath $r)) { "{0,6}  {1}  (no existe)" -f 0, $r; continue }
  $item = Get-Item -LiteralPath $r -Force
  $real = if ($item.LinkType -eq 'Junction' -or $item.LinkType -eq 'SymbolicLink') { $item.Target | Select-Object -First 1 } else { $r }
  $n = @(Get-ChildItem -LiteralPath $real -Directory -Force -ErrorAction SilentlyContinue |
        Where-Object { Test-Path -LiteralPath (Join-Path $_.FullName 'SKILL.md') }).Count
  "{0,6}  {1}  -> {2}" -f $n, $r, $real
}
```

Paso 2 (solo si Paso 1 + evidencia del aviso lo justifican): conteo de avisos por corrida nueva, despues de cada cambio, no un valor fijo:

```powershell
Get-ChildItem "$HOME\.codex\madre-tareas" -Directory | ForEach-Object {
  $f = Join-Path $_.FullName 'eventos.jsonl'
  if (Test-Path $f) { [pscustomobject]@{ Run = $_.Name; Warn = [bool](Select-String -Path $f -Pattern 'skills context budget' -Quiet) } }
} | Where-Object { $_.Run -ge '20261011' } | Format-Table -AutoSize
```

No se propone `Rename-Item` de `~/.codex/skills` como fix. Si Paso 1 muestra que `~/.codex/skills` (61) es el root dominante y la corrida nueva sigue con aviso, la siguiente decision la toma Sergio Urcullo con esa cifra: mover el root a un respaldo reversible (`Rename-Item "$HOME\.codex\skills" "skills-archivadas-$(Get-Date -Format yyyyMMdd)"`, revertir con `Rename-Item` inverso). Mientras no haya cifra, no se toca.

## Quien la aplica

- **Sergio Urcullo**: ejecuta el Paso 1 (solo lectura) y decide si hay Paso 2. Es configuracion local de su PC y mueve archivos que Codex lee, por eso requiere su OK.
- **Madre-dev (Plataforma/Infra/harness)**: lanza una corrida de prueba de la cola `hermes-content/docs/handoff/codex-tareas/` despues del Paso 1 y revisa cuales skills de `~/.codex/skills` usa cada contrato.
- **Madre-marketing**: no aplica.
- **Integrador**: no aplica (no toca `main`).

## Prueba de hecho

- Hecho en la medicion: el Paso 1 registra el conteo por root (cinco cifras) y el origen dominante queda escrito con su numero, no como UNKNOWN.
- Hecho en el problema: tras una corrida nueva de `madre-tareas` con fecha posterior al cambio, el conteo de archivos con `skills context budget` es 0. Comando: `Select-String -Path "$HOME\.codex\madre-tareas\*\eventos.jsonl" -Pattern "skills context budget" | Measure-Object`.
- Si el conteo no baja, el aviso sigue y este punto queda abierto; no se declara resuelto.
