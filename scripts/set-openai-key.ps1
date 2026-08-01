# Toma la clave OpenAI del portapapeles, la valida, la escribe en <repo>/.env
# y la prueba contra la API. Nunca imprime el valor de la clave.
#
# Uso: copiar la clave con el boton de copiar del dashboard y ejecutar este script.

$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$envPath = Join-Path $PSScriptRoot '..\.env'
$envPath = [System.IO.Path]::GetFullPath($envPath)

$k = (Get-Clipboard -Raw)
if ($null -eq $k) { $k = '' }
$k = $k.Trim()

# --- Validacion de formato antes de escribir nada ---
if ($k.Length -eq 0) {
    Write-Host "ERROR: el portapapeles esta vacio." -ForegroundColor Red
    Write-Host "Copia la clave con el boton de copiar del dashboard y volve a ejecutar."
    exit 1
}
if ($k -notmatch '^sk-[A-Za-z0-9_\-]+$') {
    Write-Host "ERROR: el portapapeles NO tiene una clave OpenAI." -ForegroundColor Red
    Write-Host ("  largo    : {0} caracteres" -f $k.Length)
    Write-Host ("  empieza  : {0}" -f $k.Substring(0, [Math]::Min(12, $k.Length)))
    Write-Host "No se escribio nada en el .env."
    exit 1
}
if ($k.Length -lt 100) {
    Write-Host ("ERROR: la clave parece incompleta ({0} caracteres, se esperan ~164)." -f $k.Length) -ForegroundColor Red
    Write-Host "No se escribio nada en el .env."
    exit 1
}

# --- Escritura ---
$linea = 'OPENAI_API_KEY=' + $k
(Get-Content $envPath) -replace '^OPENAI_API_KEY=.*$', $linea | Set-Content $envPath -Encoding utf8

Write-Host ("Escrito en {0}" -f $envPath) -ForegroundColor Green
Write-Host ("  largo      : {0} caracteres" -f $k.Length)
Write-Host ("  termina en : {0}" -f $k.Substring($k.Length - 4))

# --- Prueba contra la API (GET /v1/models, sin costo) ---
Write-Host ""
Write-Host "Probando contra api.openai.com ..."
try {
    $r = Invoke-RestMethod -Uri 'https://api.openai.com/v1/models' -Headers @{ Authorization = "Bearer $k" } -TimeoutSec 25
    Write-Host ("CLAVE VALIDA - {0} modelos disponibles" -f $r.data.Count) -ForegroundColor Green
} catch {
    $code = $null
    if ($_.Exception.Response) { $code = [int]$_.Exception.Response.StatusCode }
    Write-Host ("CLAVE RECHAZADA por OpenAI (HTTP {0})" -f $code) -ForegroundColor Red
    Write-Host "La clave quedo escrita igual. Pasale este resultado a Claude."
}
