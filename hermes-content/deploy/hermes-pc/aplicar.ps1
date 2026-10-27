# Configura Hermes Agent de la PC (v0.22.2) para ONIA con un solo comando. PowerShell 5.1.
# Se corre con Hermes CERRADO y después de mergear el PR #269, desde cualquier copia del repo:
#   powershell -ExecutionPolicy Bypass -File <repo>\hermes-content\deploy\hermes-pc\aplicar.ps1
# Opciones:
#   -EscrituraSegura  crea la variable de usuario HERMES_WRITE_SAFE_ROOT (sin esto, solo imprime el comando)
#   -Codex            copia hermes-content\deploy\codex\AGENTS.global.md en ~\.codex\AGENTS.md (con respaldo)
#   -HermesHome, -Base, -CodexHome, -SinWorktree  para probarlo sobre copias; por defecto, los reales
# Cada paso frena ante cualquier falla. Todo lo que pisa queda en %LOCALAPPDATA%\hermes\backups\pre-orden-<fecha>\
# y se vuelve atrás con revertir.ps1 (por defecto, el respaldo más reciente).
param(
    [string]$HermesHome = (Join-Path $env:LOCALAPPDATA 'hermes'),
    [string]$Base = 'E:\onia-wt\hermes-base',
    [string]$Repo = 'C:\dev\proyectos\onia-hermes',
    [string]$CodexHome = (Join-Path $HOME '.codex'),
    [switch]$SinWorktree,
    [switch]$EscrituraSegura,
    [switch]$Codex
)
$ErrorActionPreference = 'Stop'
$HermesHome = [IO.Path]::GetFullPath($HermesHome).TrimEnd('\')
$Base = [IO.Path]::GetFullPath($Base).TrimEnd('\')
$Repo = [IO.Path]::GetFullPath($Repo).TrimEnd('\')   # PowerShell 5.1 rompe un argumento con espacios que termina en \
$homeReal = [IO.Path]::GetFullPath((Join-Path $env:LOCALAPPDATA 'hermes')).TrimEnd('\')
$deploy = Join-Path $Base 'hermes-content\deploy\hermes-pc'

function Paso([string]$texto) { Write-Host ''; Write-Host "== $texto" -ForegroundColor Cyan }

# Corre un ejecutable externo y frena si sale distinto de 0. Con 'Stop', PowerShell 5.1 puede tomar lo que git
# escribe en stderr (el progreso de fetch) como error, por eso se baja a 'Continue' solo mientras corre.
function Correr([string]$exe, [string[]]$argumentos) {
    $ErrorActionPreference = 'Continue'
    & $exe @argumentos
    $codigo = $LASTEXITCODE
    $ErrorActionPreference = 'Stop'
    if ($codigo -ne 0) { throw "falló ($codigo): $exe $($argumentos -join ' ')" }
}

function Huellas([string]$ruta) {
    # sha256 de un archivo, o "ruta relativa|sha256" de cada archivo de una carpeta, en orden
    if (Test-Path -LiteralPath $ruta -PathType Leaf) { return @((Get-FileHash -LiteralPath $ruta -Algorithm SHA256).Hash) }
    $raiz = (Get-Item -LiteralPath $ruta).FullName.TrimEnd('\')
    @(Get-ChildItem -LiteralPath $raiz -Recurse -File -Force | Sort-Object FullName | ForEach-Object {
        $_.FullName.Substring($raiz.Length + 1) + '|' + (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash
    })
}

# ---------------------------------------------------------------------------------------------------------------
Paso '1. Hermes cerrado'
if ($HermesHome -eq $homeReal) {
    # hermes.exe y hermes-acp.exe solo lanzan: el agente es un python.exe de hermes\tools (y la TUI un node.exe),
    # que puede quedar vivo sin el lanzador. Se frena con cualquier proceso que corra desde la carpeta de Hermes.
    $abiertos = @(Get-CimInstance Win32_Process | Where-Object {
        $_.ExecutablePath -and $_.Name -ne 'cua-driver.exe' -and
        $_.ExecutablePath.StartsWith($homeReal + '\', [StringComparison]::OrdinalIgnoreCase) })
    if ($abiertos.Count) {
        $lista = ($abiertos | ForEach-Object { '{0} {1}' -f $_.Name, $_.ProcessId }) -join ', '
        Write-Host "Hermes está abierto ($lista). Cerrá todas sus ventanas (también la de Orca) y volvé a correr esto." -ForegroundColor Yellow
        exit 1
    }
    Write-Host 'No hay ningún proceso de Hermes corriendo.'
    # Con un perfil activo, Hermes lee profiles\<nombre>\config.yaml y no el que se toca acá
    $perfil = Join-Path $homeReal 'active_profile'
    $activo = if (Test-Path -LiteralPath $perfil) { "$(Get-Content -LiteralPath $perfil -Raw)".Trim() } else { '' }
    if ($activo -notin '', 'default') { throw "Hermes tiene activo el perfil '$activo': su config.yaml no es $HermesHome\config.yaml" }
} else {
    # La variable de usuario es real: con una copia quedaría apuntando a la copia
    if ($EscrituraSegura) { throw '-EscrituraSegura no se usa sobre una copia de -HermesHome' }
    Write-Host "Prueba sobre una copia ($HermesHome): no se mira si Hermes está abierto."
}
if (-not (Test-Path -LiteralPath (Join-Path $HermesHome 'config.yaml'))) { throw "No existe $HermesHome\config.yaml" }

# ---------------------------------------------------------------------------------------------------------------
Paso '2. Python de Hermes'
# El venv activo lo dice installs\*\facts.json (lo mismo que la cabecera de probar-deny.py). El código de Hermes
# siempre se lee de %LOCALAPPDATA%\hermes\hermes-agent, también en las pruebas sobre copias.
$facts = @(Get-ChildItem -Path (Join-Path $homeReal 'installs\*\facts.json') -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending)
if (-not $facts.Count) { throw "No encontré $homeReal\installs\*\facts.json. ¿Está instalado Hermes?" }
if ($facts.Count -gt 1) { Write-Host "Hay $($facts.Count) instalaciones; uso la más reciente: $($facts[0].FullName)" -ForegroundColor Yellow }
$py = (Get-Content -LiteralPath $facts[0].FullName -Raw | ConvertFrom-Json).packages.venv.environment + '\Scripts\python.exe'
if (-not (Test-Path -LiteralPath $py)) { throw "No existe el python de Hermes: $py" }
Write-Host $py

# ---------------------------------------------------------------------------------------------------------------
Paso '3. Respaldo'
$respaldo = Join-Path $HermesHome ('backups\pre-orden-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
New-Item -ItemType Directory -Path $respaldo | Out-Null
$aRespaldar = @('config.yaml', 'SOUL.md', 'memories\USER.md', 'skills\onia') | ForEach-Object { @{ origen = (Join-Path $HermesHome $_); copia = $_ } }
if ($Codex) { $aRespaldar += @{ origen = (Join-Path $CodexHome 'AGENTS.md'); copia = 'codex\AGENTS.md' } }
$items = @()
foreach ($a in $aRespaldar) {
    $existia = Test-Path -LiteralPath $a.origen
    $huellas = @()
    if ($existia) {
        $destino = Join-Path $respaldo $a.copia
        New-Item -ItemType Directory -Force -Path (Split-Path $destino) | Out-Null
        Copy-Item -LiteralPath $a.origen -Destination $destino -Recurse
        $huellas = @(Huellas $a.origen)
        if ((@(Huellas $destino) -join '/') -ne ($huellas -join '/')) { throw "La copia de $($a.origen) no es idéntica" }
    }
    $items += [pscustomobject]@{ origen = $a.origen; copia = $a.copia; existia = $existia; huellas = $huellas }
    Write-Host ("{0,-18} {1}" -f $a.copia, $(if ($existia) { "copiado ($($huellas.Count) archivos)" } else { 'no existía' }))
}
# escrituraSeguraAntes: el valor previo de la variable de usuario, para que revertir.ps1 la deje como estaba
[pscustomobject]@{ fecha = (Get-Date -Format s); hermesHome = $HermesHome; base = $Base; items = $items
    escrituraSeguraAntes = [Environment]::GetEnvironmentVariable('HERMES_WRITE_SAFE_ROOT', 'User') } |
    ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $respaldo 'manifest.json') -Encoding UTF8
Write-Host "Respaldo: $respaldo"

$homeAnterior = $env:HERMES_HOME
$fallo = $null
try {
    # -----------------------------------------------------------------------------------------------------------
    Paso '4. Worktree base'
    if ($SinWorktree) {
        Write-Host "Se salta (-SinWorktree): se usa $Base tal como está."
    } else {
        Correr git @('-C', $Repo, 'fetch', 'origin')
        if (-not (Test-Path -LiteralPath $Base)) {
            Correr git @('-C', $Repo, 'worktree', 'add', '--detach', $Base, 'origin/main')
        } else {
            $ErrorActionPreference = 'Continue'
            $estado = @(& git -C $Base status --porcelain)
            $codigo = $LASTEXITCODE
            $ErrorActionPreference = 'Stop'
            if ($codigo -ne 0) { throw "$Base existe pero git no lo lee como worktree" }
            # Solo se toleran los handoffs que Hermes escribe; cualquier otro cambio frena
            $ajenos = @($estado | Where-Object { $_ -and $_.Substring(3).Trim('"') -notlike 'hermes-content/docs/handoff/*' })
            if ($ajenos.Count) {
                Write-Host "$Base tiene cambios fuera de hermes-content/docs/handoff:" -ForegroundColor Yellow
                $ajenos | ForEach-Object { Write-Host "  $_" }
                throw 'Worktree base con cambios: revisalos antes de seguir'
            }
            Correr git @('-C', $Base, 'checkout', '--detach', 'origin/main')
        }
    }

    # -----------------------------------------------------------------------------------------------------------
    Paso '5. AGENTS.md nuevo en la base'
    $agents = Join-Path $Base 'AGENTS.md'
    if (-not (Test-Path -LiteralPath $agents) -or
        -not (Select-String -LiteralPath $agents -SimpleMatch 'Versión decidida por Sergio Urcullo el 26-oct-2026' -Encoding UTF8 -Quiet)) {
        throw "$agents no es el AGENTS.md nuevo: falta mergear el PR #269"
    }
    foreach ($f in 'config.onia.yaml', 'SOUL.md', 'probar-deny.py') {
        if (-not (Test-Path -LiteralPath (Join-Path $deploy $f))) { throw "Falta $deploy\$f" }
    }
    # Lo del paso 11 se mira acá, antes de escribir nada
    $codexFuente = Join-Path $Base 'hermes-content\deploy\codex\AGENTS.global.md'
    if ($Codex -and -not (Test-Path -LiteralPath $codexFuente)) { throw "Falta $codexFuente" }
    $handoff = Join-Path $Base 'hermes-content\docs\handoff'
    if ($EscrituraSegura -and -not (Test-Path -LiteralPath $handoff -PathType Container)) { throw "Falta $handoff" }
    Write-Host 'Es el AGENTS.md del 26-oct.'

    # -----------------------------------------------------------------------------------------------------------
    Paso '6. config.onia.yaml en config.yaml'
    $env:HERMES_HOME = $HermesHome   # Hermes solo escribe config.yaml dentro de su home
    Correr $py @('-I', (Join-Path $PSScriptRoot 'aplicar_config.py'), (Join-Path $deploy 'config.onia.yaml'), (Join-Path $HermesHome 'config.yaml'))

    # -----------------------------------------------------------------------------------------------------------
    Paso '7. SOUL.md'
    Copy-Item -LiteralPath (Join-Path $deploy 'SOUL.md') -Destination (Join-Path $HermesHome 'SOUL.md') -Force
    Write-Host "Copiado a $HermesHome\SOUL.md"

    # -----------------------------------------------------------------------------------------------------------
    Paso '8. skills\onia fuera de Hermes'
    $skillsOnia = Join-Path $HermesHome 'skills\onia'
    if (Test-Path -LiteralPath $skillsOnia) {
        Move-Item -LiteralPath $skillsOnia -Destination (Join-Path $respaldo 'skills-onia-movida')
        Write-Host "Movida a $respaldo\skills-onia-movida (la copia para revertir está en $respaldo\skills\onia)"
    } else {
        Write-Host 'No había skills\onia.'
    }

    # -----------------------------------------------------------------------------------------------------------
    Paso '9. Carpeta de pedidos'
    New-Item -ItemType Directory -Force -Path (Join-Path $HermesHome 'pedidos'), (Join-Path $HermesHome 'cache\scratch') | Out-Null
    Write-Host "$HermesHome\pedidos"

    # -----------------------------------------------------------------------------------------------------------
    Paso '10. Prueba del deny contra la config viva'
    Correr $py @('-I', (Join-Path $deploy 'probar-deny.py'), (Join-Path $deploy 'config.onia.yaml'), '--vivo')
} catch {
    $fallo = $_.Exception.Message
} finally {
    $env:HERMES_HOME = $homeAnterior   # si lo corrieron con .\aplicar.ps1, la variable quedaría en su ventana
}
if ($fallo) {
    Write-Host ''
    Write-Host "FALLÓ: $fallo" -ForegroundColor Red
    Write-Host 'Para dejar todo como estaba:' -ForegroundColor Yellow
    Write-Host "  powershell -ExecutionPolicy Bypass -File `"$PSScriptRoot\revertir.ps1`" -Respaldo `"$respaldo`""
    exit 1
}

# ---------------------------------------------------------------------------------------------------------------
Paso '11. Escritura segura y Codex'
# 26-oct: ya no toda la home (con ella write_file podía reescribir su SOUL, su memoria y su auth.json). cache\scratch
# queda porque ahí deja sus borradores de trabajo; no le da nada nuevo: desde la terminal ya puede escribir archivos.
$raices = "$handoff;$HermesHome\pedidos;$HermesHome\cache\scratch"
if ($EscrituraSegura) {
    [Environment]::SetEnvironmentVariable('HERMES_WRITE_SAFE_ROOT', $raices, 'User')
    Write-Host "HERMES_WRITE_SAFE_ROOT = $raices (variable de usuario; vale para las ventanas que abras desde ahora)"
} else {
    Write-Host 'HERMES_WRITE_SAFE_ROOT no se tocó. Para crearla (o volvé a correr esto con -EscrituraSegura):'
    Write-Host "  [Environment]::SetEnvironmentVariable('HERMES_WRITE_SAFE_ROOT', '$raices', 'User')"
}
if ($Codex) {
    New-Item -ItemType Directory -Force -Path $CodexHome | Out-Null
    Copy-Item -LiteralPath $codexFuente -Destination (Join-Path $CodexHome 'AGENTS.md') -Force
    Write-Host "Copiado a $CodexHome\AGENTS.md (el anterior quedó en $respaldo\codex)"
} else {
    Write-Host "~\.codex\AGENTS.md no se tocó (para copiarlo, volvé a correr esto con -Codex)."
}

# ---------------------------------------------------------------------------------------------------------------
Paso '12. Listo'
Write-Host "Respaldo: $respaldo  (para volver atrás: revertir.ps1 -Respaldo `"$respaldo`")"
Write-Host 'Para arrancar Hermes, en una ventana nueva de PowerShell:'
Write-Host "  Set-Location '$Base'"
Write-Host '  hermes --tui -m gpt-6.1-sol --provider openai-codex   # la TUI arrancaba con Astra aunque config.yaml diga Sol (26-oct)'
Write-Host 'Sin --yolo. Adentro, corré /context y fijate que aparezca AGENTS.md.'
Write-Host 'Antes, en esa ventana: hermes auth list. Si no hay un openai-codex propio de Hermes, hermes auth add openai-codex'
Write-Host '(con la adopción de logins apagada ya no toma el del Codex CLI). Las filas copilot y anthropic: hermes auth remove.'
