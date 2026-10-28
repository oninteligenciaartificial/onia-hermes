# Archiva (mueve, no borra) las skills, comandos y agentes de la PC que pisan al repo, se contradicen o no se usan.
# Sale de research/2026-10-26-skills-y-autonomia-hermes.md §4.3 y §5, con las decisiones de Sergio Urcullo del 27-oct:
# limpiar repo y PC, quedarse con las reglas del repo + Ponytail (salen Superpowers y gstack).
# Uso, en una PowerShell normal (no desde una herramienta de Claude):
#   powershell -ExecutionPolicy Bypass -File scripts\pc\ordenar-agentes-pc.ps1            # solo muestra qué movería
#   powershell -ExecutionPolicy Bypass -File scripts\pc\ordenar-agentes-pc.ps1 -Aplicar   # mueve y deja manifiesto
#   powershell -ExecutionPolicy Bypass -File scripts\pc\ordenar-agentes-pc.ps1 -Revertir <manifiesto.json>
# Lo que el router todavía nombra (STACK-POR-DOMINIO.md) NO se toca: se decide aparte, junto con el router.
param([switch]$Aplicar, [string]$Revertir)
$ErrorActionPreference = 'Stop'
# Mirar sí puede cualquiera; mover lo decide Sergio Urcullo y lo corre en una PowerShell normal
if ($env:CLAUDECODE -and ($Aplicar -or $Revertir)) { Write-Host 'Esto lo corre Sergio Urcullo en una PowerShell normal, no una herramienta de Claude.' -ForegroundColor Yellow; exit 1 }

$fecha = Get-Date -Format 'yyyyMMdd-HHmmss'
$claude = Join-Path $HOME '.claude'
$codex = Join-Path $HOME '.codex'

$gstack = 'gstack', 'benchmark-models', 'browse', 'canary', 'context-restore', 'context-save', 'design-consultation', 'design-html',
    'design-review', 'devex-review', 'document-generate', 'health', 'investigate', 'land-and-deploy', 'landing-report', 'office-hours', 'qa', 'review'
$grupos = @(
    @{ carpeta = "$claude\skills"; archivo = "$claude\skills-archivadas-$fecha"; motivo = 'personales: gstack (decidido), caveman, HyperFrames de septiembre, carpetas que no son skills'
       nombres = $gstack + @('caveman-commit', 'caveman-help', 'caveman-review', 'hyperframes-audio', 'hyperframes-studio', 'prompt-optimizer',
                             'everything-claude-code', 'claude-token-eficiente', '.trash') }
    @{ carpeta = "$codex\skills"; archivo = "$codex\skills-archivadas-$fecha"; motivo = 'Codex: copias viejas que pisan ~/.agents/skills (el repo), git/deploy prohibidos, sin uso'
       nombres = @('hyperframes', 'hyperframes-animation', 'hyperframes-cli', 'hyperframes-core', 'hyperframes-creative', 'hyperframes-keyframes',
                   'hyperframes-registry', 'hyperframes-audio', 'hyperframes-studio', 'embedded-captions', 'general-video', 'media-use', 'motion-graphics',
                   'remotion-to-hyperframes', 'slideshow', 'talking-head-recut', 'impeccable',
                   'web-factory-commerce-storefront', 'web-factory-design-director', 'web-factory-visual-intake', 'ecommerce-motion-retention',
                   'deploy-to-vercel', 'vercel-deploy', 'gh-address-comments', 'gh-fix-ci', 'git-workflow-and-versioning', 'security-ownership-map', 'shipping-and-launch',
                   'api-and-interface-design', 'browser-testing-with-devtools', 'code-simplification', 'frontend-ui-engineering', 'incremental-implementation',
                   'performance-optimization', 'planning-and-task-breakdown', 'security-and-hardening', 'sentry', 'source-driven-development', 'taste-skill',
                   'using-agent-skills', 'vercel-optimize', 'web-design-guidelines',
                   'banner-design', 'brand', 'design', 'design-system', 'ui-styling', 'ui-ux-pro-max') }
    @{ carpeta = "$claude\commands"; archivo = "$claude\commands-archivados-$fecha"; motivo = 'comandos sin uso en 30 días: otros lenguajes, multiagente, internos de everything-claude-code'
       nombres = @('cpp-build', 'cpp-review', 'cpp-test', 'flutter-build', 'flutter-review', 'flutter-test', 'go-build', 'go-review', 'go-test', 'gradle-build',
                   'kotlin-build', 'kotlin-review', 'kotlin-test', 'rust-build', 'rust-review', 'rust-test', 'jira',
                   'multi-backend', 'multi-execute', 'multi-frontend', 'multi-plan', 'multi-workflow', 'orchestrate', 'devfleet', 'santa-loop', 'loop-start',
                   'loop-status', 'claw', 'gan-build', 'gan-design',
                   'evolve', 'instinct-export', 'instinct-import', 'instinct-status', 'promote', 'prune', 'projects', 'learn', 'learn-eval', 'skill-create',
                   'skill-health', 'rules-distill', 'harness-audit', 'model-route', 'eval', 'setup-pm', 'pm2', 'context-budget') | ForEach-Object { "$_.md" } }
    @{ carpeta = "$claude\agents"; archivo = "$claude\agents-archivados-$fecha"; motivo = 'agentes sin uso en 30 días (harness-optimizer y loop-operator quedan: los nombra el router)'
       nombres = @('cpp-build-resolver', 'cpp-reviewer', 'csharp-reviewer', 'dart-build-resolver', 'flutter-reviewer', 'go-build-resolver', 'go-reviewer',
                   'java-build-resolver', 'java-reviewer', 'kotlin-build-resolver', 'kotlin-reviewer', 'pytorch-build-resolver', 'rust-build-resolver', 'rust-reviewer',
                   'gan-evaluator', 'gan-generator', 'gan-planner', 'opensource-forker', 'opensource-packager', 'opensource-sanitizer',
                   'market-competitive', 'market-content', 'market-conversion', 'market-strategy', 'market-technical', 'chief-of-staff') | ForEach-Object { "$_.md" } }
)
# Plugins: Superpowers sale de Claude y de Codex (decisión del 27-oct); en Codex también Remotion (jubilado), Vercel y la tercera copia de HyperFrames
$pluginsClaude = @('superpowers@claude-plugins-official')
$pluginsCodex = @('superpowers@claude-plugins-official', 'remotion@openai-curated', 'vercel@openai-curated', 'hyperframes@openai-curated')
$toml = Join-Path $codex 'config.toml'

function Plugins-Codex([bool]$prender) {
    $texto = [IO.File]::ReadAllText($toml)
    foreach ($p in $pluginsCodex) {
        $patron = '(\[plugins\."' + [regex]::Escape($p) + '"\]\r?\nenabled = )(true|false)'
        $texto = [regex]::Replace($texto, $patron, '${1}' + $(if ($prender) { 'true' } else { 'false' }))
    }
    [IO.File]::WriteAllText($toml, $texto)
}

if ($Revertir) {
    $m = Get-Content -LiteralPath $Revertir -Raw -Encoding UTF8 | ConvertFrom-Json
    foreach ($x in $m.movidos) { if (-not (Test-Path -LiteralPath $x.origen)) { Move-Item -LiteralPath $x.destino -Destination $x.origen } }
    if ($m.tomlRespaldo) { Copy-Item -LiteralPath $m.tomlRespaldo -Destination $toml -Force }
    foreach ($p in $pluginsClaude) { & claude plugin enable $p --scope user }
    Write-Host "Vuelto atrás: $($m.movidos.Count) elementos, la config de Codex y los plugins de Claude."
    exit 0
}

$movidos = @(); $faltan = 0
foreach ($g in $grupos) {
    $hay = @($g.nombres | Where-Object { Test-Path -LiteralPath (Join-Path $g.carpeta $_) })
    $faltan += $g.nombres.Count - $hay.Count
    Write-Host ''
    Write-Host "== $($g.carpeta): $($hay.Count) a archivar ($($g.motivo))" -ForegroundColor Cyan
    Write-Host ('   ' + ($hay -join ', '))
    if (-not $Aplicar) { continue }
    New-Item -ItemType Directory -Force -Path $g.archivo | Out-Null
    foreach ($n in $hay) {
        $origen = Join-Path $g.carpeta $n; $destino = Join-Path $g.archivo $n
        Move-Item -LiteralPath $origen -Destination $destino   # misma unidad: renombra, no copia ni sigue junctions
        $movidos += [pscustomobject]@{ origen = $origen; destino = $destino }
    }
}
Write-Host ''
Write-Host "Plugins a apagar. Claude: $($pluginsClaude -join ', '). Codex: $($pluginsCodex -join ', ')."
Write-Host "($faltan nombres de la lista ya no estaban.)"
if (-not $Aplicar) { Write-Host 'Nada se movió. Para hacerlo: el mismo comando con -Aplicar.' -ForegroundColor Yellow; exit 0 }

$tomlRespaldo = "$toml.antes-$fecha"
Copy-Item -LiteralPath $toml -Destination $tomlRespaldo
Plugins-Codex $false
foreach ($p in $pluginsClaude) { & claude plugin disable $p --scope user }
$manifiesto = Join-Path $claude "ordenar-agentes-$fecha.json"
[pscustomobject]@{ fecha = $fecha; movidos = $movidos; tomlRespaldo = $tomlRespaldo } | ConvertTo-Json -Depth 4 |
    Set-Content -LiteralPath $manifiesto -Encoding UTF8
Write-Host "Listo: $($movidos.Count) movidos. Para volver atrás: -Revertir `"$manifiesto`"" -ForegroundColor Green
Write-Host 'Abrí sesiones nuevas de Claude y Codex para que tomen la lista nueva.'
