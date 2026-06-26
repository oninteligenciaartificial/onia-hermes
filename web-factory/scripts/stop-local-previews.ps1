param(
  [switch]$CleanNext
)

$ErrorActionPreference = "Stop"

$webFactoryRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")).Path
$siteRoot = (Resolve-Path -LiteralPath (Join-Path $webFactoryRoot "apps\site")).Path
$escapedSiteRoot = [regex]::Escape($siteRoot)
$currentPid = $PID

$targets = @(Get-CimInstance Win32_Process | Where-Object {
  $_.ProcessId -ne $currentPid -and
  $_.CommandLine -and
  $_.CommandLine -match $escapedSiteRoot -and
  $_.CommandLine -match "(?i)(next|pnpm|postcss)"
})

foreach ($target in $targets) {
  Write-Host "Stopping Web Factory preview process $($target.ProcessId)"
  Stop-Process -Id $target.ProcessId -Force -ErrorAction SilentlyContinue
}

if ($CleanNext) {
  $nextDir = Join-Path $siteRoot ".next"

  if (Test-Path -LiteralPath $nextDir) {
    $resolvedNext = (Resolve-Path -LiteralPath $nextDir).Path

    if (-not $resolvedNext.StartsWith($siteRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
      throw "Refusing to remove unexpected path: $resolvedNext"
    }

    Remove-Item -LiteralPath $resolvedNext -Recurse -Force
    Write-Host "Removed $resolvedNext"
  }
}

Write-Host "Stopped $($targets.Count) Web Factory preview process(es)."
