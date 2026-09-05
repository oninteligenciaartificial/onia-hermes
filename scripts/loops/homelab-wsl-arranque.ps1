<#
.SINOPSIS
  Deja WSL arrancando solo y despierto en el nodo de casa, para que `cron` dispare
  sin que nadie abra una ventana de Ubuntu.

.POR-QUE
  El instalador `instalar-homelab.sh` deja el `crontab` perfecto, y en WSL eso NO
  alcanza: WSL vive mientras la sesion de Windows este abierta, y se apaga sola por
  inactividad. Sin esto el nodo queda EXACTAMENTE en el modo de falla que este
  proyecto ya documento tres veces:

      "Un loop puede morir con su cron INTACTO."
      (scripts/loops/README.md)

  Todo verde, nada corriendo, y nadie se entera.

.COMO-FUNCIONA
  Una tarea programada de Windows ejecuta, al iniciar sesion:

      wsl.exe -d Ubuntu -u root -e /bin/sh -c "exec sleep infinity"

  Eso hace dos cosas de una: ARRANCA la maquina virtual, y deja un proceso vivo
  adentro. Un proceso vivo es lo que impide que WSL se suspenda por inactividad,
  asi que no hace falta tocar ninguna clave de configuracion experimental.

.LIMITE-IMPORTANTE
  El disparador es "al iniciar sesion", NO "al arrancar la maquina". Motivo tecnico,
  no pereza: las distros de WSL estan registradas POR USUARIO de Windows. Una tarea
  que corre como SYSTEM no ve el Ubuntu de Sergio Urcullo.

  Para que el nodo sobreviva a un reinicio SIN que nadie inicie sesion hay dos
  caminos, y los dos son decision de Sergio Urcullo:
    (a) marcar "Ejecutar tanto si el usuario inicio sesion como si no" (Windows
        pide y GUARDA la contrasena de la cuenta);
    (b) activar el inicio de sesion automatico de Windows.
  Ninguno se hace desde aca.

.ESCRITO-EN-ASCII-A-PROPOSITO
  Sin acentos, sin emojis, sin rayas largas, y guardado CON BOM. Medido el
  2026-09-05: la version con 220 caracteres no-ASCII y sin BOM la lee Windows
  PowerShell 5.1 como ANSI, destroza cada secuencia multibyte, rompe las comillas
  y termina reportando llaves faltantes que estan perfectamente balanceadas.
  Tampoco se usan `2>` ni `||` dentro de los argumentos que van a wsl.exe: 5.1
  parsea esos operadores AUNQUE esten entre comillas.

.USO
  Abrir PowerShell COMO ADMINISTRADOR y correr:

      # 1) ver que haria, sin tocar nada (por defecto)
      powershell -ExecutionPolicy Bypass -File .\homelab-wsl-arranque.ps1

      # 2) crearla de verdad
      powershell -ExecutionPolicy Bypass -File .\homelab-wsl-arranque.ps1 -Aplicar

      # 3) sacarla
      powershell -ExecutionPolicy Bypass -File .\homelab-wsl-arranque.ps1 -Quitar

  Es idempotente: correrlo dos veces no duplica la tarea.
#>

param(
  [switch]$Aplicar,
  [switch]$Quitar,
  [string]$Distro = "Ubuntu",
  [string]$Tarea  = "ONIA - WSL despierto (nodo de casa)"
)

$ErrorActionPreference = "Stop"

function Info($m)  { Write-Host "  $m" }
function Ok($m)    { Write-Host "OK    $m" -ForegroundColor Green }
function Aviso($m) { Write-Host "AVISO $m" -ForegroundColor Yellow }
function Morir($m) { Write-Host "FALLO $m" -ForegroundColor Red; exit 1 }

# --- 0. Guardas -------------------------------------------------------------
$esAdmin = ([Security.Principal.WindowsPrincipal] `
            [Security.Principal.WindowsIdentity]::GetCurrent()
           ).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $esAdmin) {
  Morir "hay que correr esto en un PowerShell ABIERTO COMO ADMINISTRADOR."
}

$wsl = Join-Path $env:SystemRoot "System32\wsl.exe"
if (-not (Test-Path $wsl)) { Morir "no encuentro wsl.exe en $wsl" }

# `wsl -l -q` devuelve UTF-16: hay que limpiar los bytes nulos o ninguna
# comparacion coincide.
$distros = (& $wsl -l -q) -replace "`0","" | ForEach-Object { $_.Trim() } |
           Where-Object { $_ -ne "" }
if ($distros -notcontains $Distro) {
  Morir "la distro '$Distro' no esta registrada. Registradas: $($distros -join ', ')"
}
Ok "distro '$Distro' registrada"

# --- 1. Quitar --------------------------------------------------------------
if ($Quitar) {
  if (Get-ScheduledTask -TaskName $Tarea -ErrorAction SilentlyContinue) {
    Unregister-ScheduledTask -TaskName $Tarea -Confirm:$false
    Ok "tarea '$Tarea' eliminada"
  } else {
    Info "no existia la tarea '$Tarea'"
  }
  exit 0
}

# --- 2. Que se va a crear ---------------------------------------------------
$comando = "-d $Distro -u root -e /bin/sh -c ""exec sleep infinity"""
$usuario = "$env:USERDOMAIN\$env:USERNAME"

Write-Host ""
Write-Host "-- Lo que hace esta tarea -------------------------------------"
Info "Nombre:      $Tarea"
Info "Disparador:  al iniciar sesion de $usuario"
Info "Ejecuta:     $wsl $comando"
Info "Reintento:   cada 1 min, hasta 3 veces si falla"
Info "Corre como:  $usuario (las distros de WSL son por usuario)"
Write-Host "---------------------------------------------------------------"
Write-Host ""

if (-not $Aplicar) {
  Aviso "MODO PRUEBA: no se creo nada. Volve a correrlo con -Aplicar para crearla."
  exit 0
}

# --- 3. Crear ---------------------------------------------------------------
$accion    = New-ScheduledTaskAction -Execute $wsl -Argument $comando
$disparo   = New-ScheduledTaskTrigger -AtLogOn -User $usuario
$principal = New-ScheduledTaskPrincipal -UserId $usuario -LogonType Interactive -RunLevel Limited
$ajustes   = New-ScheduledTaskSettingsSet `
               -AllowStartIfOnBatteries `
               -DontStopIfGoingOnBatteries `
               -StartWhenAvailable `
               -RestartCount 3 `
               -RestartInterval (New-TimeSpan -Minutes 1) `
               -ExecutionTimeLimit ([TimeSpan]::Zero)

if (Get-ScheduledTask -TaskName $Tarea -ErrorAction SilentlyContinue) {
  Unregister-ScheduledTask -TaskName $Tarea -Confirm:$false
  Info "tarea anterior reemplazada (es idempotente)"
}

Register-ScheduledTask -TaskName $Tarea -Action $accion -Trigger $disparo `
  -Principal $principal -Settings $ajustes `
  -Description "Arranca WSL y lo mantiene despierto para que cron dispare los loops de Onia. Ver hermes-content/docs/handoff/onia-dev-node-setup.md" | Out-Null

Ok "tarea '$Tarea' creada"

# --- 4. Verificar de verdad, no suponer -------------------------------------
Write-Host ""
Write-Host "-- Verificacion -----------------------------------------------"
Start-ScheduledTask -TaskName $Tarea
Start-Sleep -Seconds 6

$t = Get-ScheduledTask -TaskName $Tarea
Info "estado de la tarea: $($t.State)"

$vivo  = (& $wsl -d $Distro -u root -e /bin/sh -c 'pgrep -c sleep') -replace "`0",""
$vivoN = 0
if ($vivo) { [void][int]::TryParse((($vivo | Select-Object -First 1) -as [string]).Trim(), [ref]$vivoN) }
if ($vivoN -ge 1) {
  Ok "hay $vivoN proceso(s) vivo(s) dentro de $Distro - WSL no se va a suspender"
} else {
  Aviso "no veo el proceso adentro. Revisar la tarea en taskschd.msc"
}

$cron = (& $wsl -d $Distro -u root -e /bin/sh -c 'systemctl is-active cron') -replace "`0",""
Info "servicio cron: $(($cron | Select-Object -First 1))"

Write-Host "---------------------------------------------------------------"
Write-Host ""
Aviso "FALTA LA PRUEBA DE VERDAD: reiniciar Windows, NO abrir Ubuntu, y confirmar"
Aviso "que 'wsl -l -v' dice Running y que /var/log/onia-loop-*.log avanza."
Aviso "Un cron que no se probo despues de un reinicio no esta probado."
