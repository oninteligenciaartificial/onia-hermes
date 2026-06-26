$ErrorActionPreference = "Stop"

$webFactoryRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")).Path

& (Join-Path $PSScriptRoot "stop-local-previews.ps1") -CleanNext

Push-Location $webFactoryRoot
try {
  & pnpm --filter site build
  $exitCode = $LASTEXITCODE

  if ($exitCode -ne 0) {
    Write-Host "First Next build failed after cleanup. Retrying once without deleting .next..."
    & pnpm --filter site build
    $exitCode = $LASTEXITCODE
  }

  exit $exitCode
}
finally {
  Pop-Location
}
