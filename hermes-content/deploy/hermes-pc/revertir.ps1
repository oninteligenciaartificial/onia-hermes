# Vuelve atrás lo que hizo aplicar.ps1, desde uno de sus respaldos. PowerShell 5.1. Con Hermes CERRADO:
#   powershell -ExecutionPolicy Bypass -File <repo>\hermes-content\deploy\hermes-pc\revertir.ps1 [-Respaldo <carpeta>] [-QuitarEscrituraSegura]
# Sin -Respaldo usa el pre-orden-* más reciente. Si aplicar.ps1 se corrió más de una vez, el estado de ANTES de la
# primera vez está en el pre-orden-* más viejo.
# Restaura lo que dice el manifest.json del respaldo (config.yaml, SOUL.md, memories\USER.md, skills\onia y, si se
# usó -Codex, ~\.codex\AGENTS.md) y comprueba con sha256 que quede idéntico a lo respaldado. No borra nada: lo que
# reemplaza lo deja dentro del respaldo, en reemplazado-<fecha>\. La carpeta pedidos\ queda.
param(
    [string]$Respaldo,
    [string]$HermesHome = (Join-Path $env:LOCALAPPDATA 'hermes'),
    [switch]$QuitarEscrituraSegura
)
$ErrorActionPreference = 'Stop'
$HermesHome = [IO.Path]::GetFullPath($HermesHome).TrimEnd('\')
$homeReal = [IO.Path]::GetFullPath((Join-Path $env:LOCALAPPDATA 'hermes')).TrimEnd('\')
# Desde una herramienta de Claude, Windows escribe en una copia del paquete MSIX que Hermes no lee (ver aplicar.ps1)
if ($env:CLAUDECODE -and $HermesHome -eq $homeReal) {
    Write-Host 'Esto se corre desde una PowerShell normal o el panel Terminal, no desde una herramienta de Claude.' -ForegroundColor Yellow
    exit 1
}

function Huellas([string]$ruta) {
    # la misma que en aplicar.ps1: sha256 de un archivo, o "ruta relativa|sha256" de cada archivo de una carpeta
    if (Test-Path -LiteralPath $ruta -PathType Leaf) { return @((Get-FileHash -LiteralPath $ruta -Algorithm SHA256).Hash) }
    $raiz = (Get-Item -LiteralPath $ruta).FullName.TrimEnd('\')
    @(Get-ChildItem -LiteralPath $raiz -Recurse -File -Force | Sort-Object FullName | ForEach-Object {
        $_.FullName.Substring($raiz.Length + 1) + '|' + (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash
    })
}

if (-not $Respaldo) {
    $ultimo = Get-ChildItem -Path (Join-Path $HermesHome 'backups') -Directory -Filter 'pre-orden-*' -ErrorAction SilentlyContinue |
        Sort-Object Name -Descending | Select-Object -First 1
    if (-not $ultimo) { throw "No hay respaldos pre-orden-* en $HermesHome\backups" }
    $Respaldo = $ultimo.FullName
}
$manifest = Join-Path $Respaldo 'manifest.json'
if (-not (Test-Path -LiteralPath $manifest)) { throw "No existe $manifest" }
$datos = Get-Content -LiteralPath $manifest -Raw -Encoding UTF8 | ConvertFrom-Json
Write-Host "Respaldo: $Respaldo (del $($datos.fecha))"

if ([IO.Path]::GetFullPath($datos.hermesHome).TrimEnd('\') -eq $homeReal) {
    # lo mismo que en aplicar.ps1: el agente es un python.exe de hermes\tools, no solo hermes.exe
    $abiertos = @(Get-CimInstance Win32_Process | Where-Object {
        $_.ExecutablePath -and $_.Name -ne 'cua-driver.exe' -and
        $_.ExecutablePath.StartsWith($homeReal + '\', [StringComparison]::OrdinalIgnoreCase) })
    if ($abiertos.Count) {
        $lista = ($abiertos | ForEach-Object { '{0} {1}' -f $_.Name, $_.ProcessId }) -join ', '
        Write-Host "Hermes está abierto ($lista). Cerrá todas sus ventanas y volvé a correr esto." -ForegroundColor Yellow
        exit 1
    }
}

# Antes de apartar nada, el respaldo tiene que estar entero: si falta o cambió una copia, no se toca nada
foreach ($item in $datos.items) {
    if (-not $item.existia) { continue }
    $copia = Join-Path $Respaldo $item.copia
    if (-not (Test-Path -LiteralPath $copia) -or (@(Huellas $copia) -join '/') -ne (@($item.huellas) -join '/')) {
        throw "El respaldo de $($item.copia) falta o no coincide con su manifest.json: no se tocó nada"
    }
}

$aparte = Join-Path $Respaldo ('reemplazado-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
$malos = 0
foreach ($item in $datos.items) {
    $copia = Join-Path $Respaldo $item.copia
    # Lo que hay ahora se aparta dentro del respaldo, nunca se borra
    if (Test-Path -LiteralPath $item.origen) {
        $destinoAparte = Join-Path $aparte $item.copia
        New-Item -ItemType Directory -Force -Path (Split-Path $destinoAparte) | Out-Null
        Move-Item -LiteralPath $item.origen -Destination $destinoAparte
    }
    if (-not $item.existia) {
        Write-Host ("{0,-18} no existía antes de aplicar: queda sin él" -f $item.copia)
        continue
    }
    New-Item -ItemType Directory -Force -Path (Split-Path $item.origen) | Out-Null
    Copy-Item -LiteralPath $copia -Destination $item.origen -Recurse
    $igual = (@(Huellas $item.origen) -join '/') -eq (@($item.huellas) -join '/')
    if (-not $igual) { $malos++ }
    Write-Host ("{0,-18} {1}" -f $item.copia, $(if ($igual) { 'restaurado, idéntico al respaldo' } else { 'RESTAURADO PERO DISTINTO al respaldo' }))
}
if (Test-Path -LiteralPath $aparte) { Write-Host "Lo que había antes de revertir quedó en $aparte" }

if ($QuitarEscrituraSegura) {
    # vuelve al valor de antes de aplicar (los respaldos viejos no lo guardaban: ahí se quita)
    [Environment]::SetEnvironmentVariable('HERMES_WRITE_SAFE_ROOT', $datos.escrituraSeguraAntes, 'User')
    if ($datos.escrituraSeguraAntes) { Write-Host "HERMES_WRITE_SAFE_ROOT vuelta a: $($datos.escrituraSeguraAntes)" }
    else { Write-Host 'HERMES_WRITE_SAFE_ROOT quitada de las variables de usuario.' }
}
if ($malos) { Write-Host "$malos elementos no quedaron idénticos al respaldo." -ForegroundColor Red; exit 1 }
Write-Host 'Listo: todo quedó como en el respaldo.'
