param(
  [int]$Port = 4174,
  [string]$Route = "/nuvia",
  [switch]$SkipBuild,
  [switch]$KeepSiblingSiteProcesses
)

$ErrorActionPreference = "Stop"

function Stop-ProcessTree {
  param([int]$RootProcessId)

  if ($RootProcessId -eq $PID) {
    return
  }

  $children = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
    Where-Object { $_.ParentProcessId -eq $RootProcessId }

  foreach ($child in $children) {
    Stop-ProcessTree -RootProcessId ([int]$child.ProcessId)
  }

  $process = Get-Process -Id $RootProcessId -ErrorAction SilentlyContinue
  if ($process) {
    Stop-Process -Id $RootProcessId -Force -ErrorAction SilentlyContinue
  }
}

function Stop-NuviaPreviewProcesses {
  param(
    [int]$TargetPort,
    [string]$SitePath
  )

  $portText = [string]$TargetPort
  $processes = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
    Where-Object {
      $_.CommandLine -and
      $_.ProcessId -ne $PID -and
      (
        ($_.CommandLine -like "*site-$portText.log*") -or
        ($_.CommandLine -like "*--port*${portText}*") -or
        ($_.CommandLine -like "*-p*${portText}*")
      ) -and
      (
        ($_.CommandLine -like "*web-factory*") -or
        ($_.CommandLine -like "*$SitePath*")
      )
    }

  foreach ($process in $processes) {
    Stop-ProcessTree -RootProcessId ([int]$process.ProcessId)
  }

  $listeners = Get-NetTCPConnection -LocalPort $TargetPort -State Listen -ErrorAction SilentlyContinue
  foreach ($listener in $listeners) {
    $owner = [int]$listener.OwningProcess
    $process = Get-CimInstance Win32_Process -Filter "ProcessId=$owner" -ErrorAction SilentlyContinue
    if (-not $process) {
      continue
    }

    if ($process.CommandLine -and (($process.CommandLine -like "*web-factory*") -or ($process.CommandLine -like "*$SitePath*"))) {
      Stop-ProcessTree -RootProcessId $owner
      continue
    }

    throw "Port $TargetPort is occupied by a non Web Factory process: PID $owner"
  }
}

function Stop-SiblingSiteProcesses {
  param([string]$SitePath)

  $processes = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
    Where-Object {
      $_.CommandLine -and
      $_.ProcessId -ne $PID -and
      $_.CommandLine.IndexOf($SitePath, [System.StringComparison]::OrdinalIgnoreCase) -ge 0 -and
      (
        ($_.CommandLine -like "*next\dist\bin\next*") -or
        ($_.CommandLine -like "*.next\postcss.js*")
      )
    }

  foreach ($process in $processes) {
    Stop-ProcessTree -RootProcessId ([int]$process.ProcessId)
  }
}

function Remove-NextBuild {
  param(
    [string]$SitePath,
    [string]$NextPath
  )

  if (-not (Test-Path -LiteralPath $NextPath)) {
    return
  }

  $resolvedSite = (Resolve-Path -LiteralPath $SitePath).Path
  $resolvedNext = (Resolve-Path -LiteralPath $NextPath).Path

  if (-not $resolvedNext.StartsWith($resolvedSite, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to delete unexpected .next path: $resolvedNext"
  }

  Remove-Item -LiteralPath $resolvedNext -Recurse -Force
}

function Wait-ForPreview {
  param(
    [string]$Url,
    [string]$BaseUrl
  )

  $deadline = (Get-Date).AddSeconds(45)
  $response = $null

  while ((Get-Date) -lt $deadline) {
    try {
      $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 8
      if ($response.StatusCode -eq 200) {
        break
      }
    } catch {
      Start-Sleep -Milliseconds 750
    }
  }

  if (-not $response -or $response.StatusCode -ne 200) {
    throw "Preview did not respond with HTTP 200 at $Url"
  }

  if ($response.Content -notlike "*nuvia-next-page*") {
    throw "Preview HTML loaded, but Nuvia markup was not found."
  }

  $cssMatches = [regex]::Matches($response.Content, 'href="([^"]+\.css[^"]*)"')
  if ($cssMatches.Count -lt 1) {
    throw "Preview HTML has no CSS chunk links."
  }

  $cssOk = $false
  foreach ($match in $cssMatches) {
    $href = $match.Groups[1].Value
    $cssUrl = if ($href.StartsWith("http")) { $href } else { "$BaseUrl$href" }
    $css = Invoke-WebRequest -Uri $cssUrl -UseBasicParsing -TimeoutSec 10
    if ($css.StatusCode -eq 200 -and $css.Content -like "*nuvia-next-page*") {
      $cssOk = $true
      break
    }
  }

  if (-not $cssOk) {
    throw "CSS chunks responded, but the Nuvia stylesheet rules were not found."
  }
}

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$webFactoryRoot = (Resolve-Path -LiteralPath (Join-Path $scriptRoot "..")).Path
$siteDir = (Resolve-Path -LiteralPath (Join-Path $webFactoryRoot "apps\site")).Path
$nextDir = Join-Path $siteDir ".next"
$logFile = Join-Path $webFactoryRoot "site-$Port.log"
$errorLogFile = Join-Path $webFactoryRoot "site-$Port.err.log"
$baseUrl = "http://127.0.0.1:$Port"
$previewUrl = "$baseUrl$Route"

Write-Host "Stopping existing Nuvia preview on port $Port..."
Stop-NuviaPreviewProcesses -TargetPort $Port -SitePath $siteDir

if (-not $KeepSiblingSiteProcesses) {
  Write-Host "Stopping sibling Next processes for the same apps/site build directory..."
  Stop-SiblingSiteProcesses -SitePath $siteDir
}

Write-Host "Cleaning isolated Next build..."
Remove-NextBuild -SitePath $siteDir -NextPath $nextDir

Push-Location $webFactoryRoot
try {
  if (-not $SkipBuild) {
    Write-Host "Building Web Factory site..."
    pnpm --filter site build
    if ($LASTEXITCODE -ne 0) {
      throw "pnpm --filter site build failed with exit code $LASTEXITCODE"
    }

    if (-not $KeepSiblingSiteProcesses) {
      Write-Host "Re-checking for leftover Next processes before start..."
      Stop-SiblingSiteProcesses -SitePath $siteDir
    }
  }

  if (Test-Path -LiteralPath $logFile) {
    Remove-Item -LiteralPath $logFile -Force
  }
  if (Test-Path -LiteralPath $errorLogFile) {
    Remove-Item -LiteralPath $errorLogFile -Force
  }

  Write-Host "Starting Nuvia preview at $previewUrl..."
  Start-Process -FilePath "node" `
    -WorkingDirectory $siteDir `
    -WindowStyle Hidden `
    -ArgumentList @("node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", [string]$Port) `
    -RedirectStandardOutput $logFile `
    -RedirectStandardError $errorLogFile | Out-Null

  Wait-ForPreview -Url $previewUrl -BaseUrl $baseUrl
  Write-Host "Nuvia preview ready: $previewUrl"
  Write-Host "Log file: $logFile"
  Write-Host "Error log file: $errorLogFile"
} finally {
  Pop-Location
}
