# Copia la base de cookies de un navegador Chromium ABIERTO a un perfil temporal,
# para que yt-dlp pueda leerla. Chrome/Brave/Edge mantienen un lock exclusivo sobre
# Network\Cookies, asi que Copy-Item y `yt-dlp --cookies-from-browser chrome` fallan
# con "Could not copy Chrome cookie database" mientras el navegador corre.
#
# La solucion: abrir el archivo con FileShare::ReadWrite (lectura no exclusiva) y
# copiar los bytes a mano. Se copia tambien "Local State", que guarda la clave DPAPI
# con la que estan cifrados los valores; sin el, yt-dlp no puede descifrar nada.
#
# Uso:
#   powershell -File snapshot-cookies.ps1 -Browser brave -ProfileName "Profile 1"
#   -> imprime la ruta del perfil temporal, lista para:
#      python -m yt_dlp --cookies-from-browser "brave:<ruta>" <url>
#
# El snapshot es una FOTO: si la sesion cambia (login nuevo), hay que rehacerlo.
param(
  [ValidateSet('chrome','brave','edge')][string]$Browser = 'chrome',
  [string]$ProfileName = 'Default',
  [string]$OutDir = "$env:TEMP\claude\cookie-snap"
)

$ErrorActionPreference = 'Stop'

$roots = @{
  chrome = "$env:LOCALAPPDATA\Google\Chrome\User Data"
  brave  = "$env:LOCALAPPDATA\BraveSoftware\Brave-Browser\User Data"
  edge   = "$env:LOCALAPPDATA\Microsoft\Edge\User Data"
}

$userData = $roots[$Browser]
if (-not (Test-Path $userData)) { Write-Error "No existe el User Data de $Browser en $userData"; exit 1 }

$srcCookies = Join-Path $userData "$ProfileName\Network\Cookies"
if (-not (Test-Path $srcCookies)) { Write-Error "No hay Cookies en el perfil '$ProfileName'"; exit 1 }

$srcLocalState = Join-Path $userData 'Local State'
$dest = Join-Path $OutDir "$Browser-$($ProfileName -replace '[^A-Za-z0-9]','_')"
$destProfile = Join-Path $dest 'Default\Network'
New-Item -ItemType Directory -Force -Path $destProfile | Out-Null

# Copia con lectura compartida: es lo unico que sortea el lock del navegador abierto.
function Copy-Locked($from, $to) {
  $in = [System.IO.File]::Open($from, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
  try {
    $out = [System.IO.File]::Create($to)
    try { $in.CopyTo($out) } finally { $out.Close() }
  } finally { $in.Close() }
}

Copy-Locked $srcCookies (Join-Path $destProfile 'Cookies')
if (Test-Path $srcLocalState) { Copy-Locked $srcLocalState (Join-Path $dest 'Local State') }

$size = (Get-Item (Join-Path $destProfile 'Cookies')).Length
Write-Host "OK cookies=$([math]::Round($size/1KB))KB perfil=$dest"
Write-Host "USAR: python -m yt_dlp --cookies-from-browser `"$Browser`:$dest`" <url>"
