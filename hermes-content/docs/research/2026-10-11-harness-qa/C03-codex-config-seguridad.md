# C03 — Codex: config.toml y seguridad (H8)

Medido 2026-10-11 en la PC, solo lectura. Ningún valor secreto copiado acá.
Corrección tras verificador: se midió largo y coincidencia por hash, no valor; se corrigieron líneas, se marcaron como no probadas las claves no confirmadas y se agregó el hallazgo de la variable de usuario ya existente.

## Estado medido

| Qué | Valor | Evidencia |
|---|---|---|
| CLI | `codex-cli 0.161.0` | `codex --version` (verificador) |
| Modelo por defecto | `gpt-6.1-sol`, esfuerzo `medium` | `~/.codex/config.toml:1-2` |
| approval_policy | `never` | `config.toml:22` |
| sandbox_mode | `danger-full-access` | `config.toml:24` |
| Sandbox Windows | `elevated` | `config.toml:189` (`[windows]`), `:190` (`sandbox = "elevated"`) |
| Perfiles | ninguno | `grep -n '^\[profiles' config.toml` vacío |
| MCP HTTP | `n8n-mcp`, `stitch`, `higgsfield`, `facebook` | `config.toml:143-155,185`; `codex mcp list` |
| MCP stdio | `agentation` (`npx -y agentation-mcp`), `node_repl` + plugins (`code-review`, `codex_app`, `cua_repl`, `mcp-search`) | `config.toml:157-184`; `codex mcp list` |
| Proyectos `trusted` | 24 rutas, incluidas carpetas temporales `Documents\Codex\2026-*` | `config.toml:192-262` |
| **Secreto en claro** | `[mcp_servers.n8n-mcp.http_headers] Authorization = "Bearer <JWT>"`. Valor de 272 caracteres sin el prefijo `Bearer ` (279 con el prefijo) | `config.toml:147-148`; medido con `awk` (largo, sin imprimir) |
| Mismo secreto en respaldos | 1 línea `Authorization = "Bearer` en `config.toml.bak-before-n8n-global-20260602235220` y en `config.toml.bak-before-stitch-mcp`. `config.toml.bak-20260629154959` y `config.toml.bak-before-n8n-mcp` tienen 0 | conteo por archivo (`grep -c`) |
| **Mismo secreto en variable de usuario** | `N8N_MCP_TOKEN` ya existe como variable de **usuario** de Windows (HKCU\Environment) y en el proceso de esta sesión. Su valor es **idéntico** al de `config.toml:148` (mismo largo, mismo hash SHA-256 prefijo `6AF88687BF0D`) | comparación por hash en PowerShell; no se imprimió ningún valor |
| `bearer_token_env_var` | no usado en el config | `grep` vacío; columna "Bearer Env Var" = `-` en `codex mcp list` |
| Variables de entorno de `code-review` (plugin) | nombres `GH_TOKEN`, `GITHUB_TOKEN`, `CODEX_API_KEY`, `GH_ENTERPRISE_TOKEN` (según `codex mcp list`). En esta sesión no están definidas en usuario, máquina ni proceso | comprobado solo por nombre. **UNKNOWN**: el valor que recibe el plugin dentro de su propio proceso no se midió |
| Otras claves en `env` | `node_repl.env` y `shell_environment_policy.set` tienen rutas, flags y un hash de cliente. No son secretos | `config.toml:167-184,300` |
| Soporte de claves en `codex-cli 0.161` | `bearer_token_env_var`, `sandbox_workspace_write` (con `writable_roots`, `network_access`, `exclude_tmpdir_env_var`) y `profiles` aparecen como cadenas dentro de `codex.exe`. Los valores `on-request` y `danger-full-access` también | `grep -a` sobre `vendor/.../codex.exe`. Indica que la clave existe, **no** que el perfil se parsea como se propone. Prueba pendiente |

Mitigación existente: `scripts/codex-tarea.sh:28` fuerza `-c 'sandbox_mode="workspace-write"' -c 'windows.sandbox="unelevated"'` en las ramas `exec`, `exec resume` y `exec review`. Lo que lanza la madre corre con sandbox. Lo que se abre a mano en la app o en `codex` interactivo corre sin sandbox y sin pedir permiso.

## Brecha

1. **CRITICAL — token de n8n en claro en tres lugares**: `config.toml:148`, los dos respaldos con 1 línea de token, y la variable de usuario `N8N_MCP_TOKEN` (HKCU\Environment, texto plano, legible por cualquier proceso del mismo usuario). Ese MCP opera la única instancia viva de n8n (44 workflows activos). Mover el secreto a una variable de usuario **no lo protege**: en Windows queda en texto plano igual que en el archivo. La mitigación real es **rotar** el token y no dejarlo en ningún archivo ni variable. Como estuvo en claro desde junio, se trata como expuesto.
2. **Exposición parcial en esta sesión**: una corrida anterior de esta investigación imprimió los primeros 12 caracteres del JWT (prefijo `eyJ...`). No es el secreto completo, pero el token debe darse por expuesto y rotarse. Este documento no vuelve a imprimirlo.
3. **HIGH — `danger-full-access` + `approval_policy = "never"` como default global.** Fuera de `codex-tarea.sh`, Codex escribe en todo el disco, usa red y corre comandos sin preguntar, con MCPs de n8n, Facebook e Higgsfield (gasto y producción) montados. Una inyección de prompt en un archivo leído es una acción real sin freno. El comportamiento "sin preguntar" es coherente con `approval_policy = never` y `danger-full-access`, pero **no se probó en vivo**.
4. **MEDIUM — `windows.sandbox = "elevated"`** falla siempre (medido 8-oct, comentario en `scripts/codex-tarea.sh:13`: «setup refresh had errors», `node_repl.exe` en uso). Con `unelevated` el sandbox funciona. Por eso el default cayó a `danger-full-access`.
5. **LOW — 24 proyectos `trusted`**, muchos de carpetas temporales.
6. No hay perfiles: no existe un modo "seguro" y otro "abierto" elegible con `-p`.

## Configuración propuesta

Orden obligatorio: **rotar primero, después cargar la variable con el token nuevo**. Si se carga antes, la variable sigue con el token viejo.

### Paso 1 — rotar el token de n8n (Sergio Urcullo, en el panel de n8n)

n8n → Settings → MCP / API → revocar la clave actual del MCP y crear una nueva. La nueva **no** se pega en ningún archivo ni en el chat.

### Paso 2 — reemplazar la variable de usuario `N8N_MCP_TOKEN` con el token nuevo (PowerShell, después del paso 1)

```powershell
# Pide el valor sin mostrarlo. Sobrescribe la variable existente (que tiene el token viejo).
$s = Read-Host "Token MCP de n8n NUEVO" -AsSecureString
$t = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($s))
[Environment]::SetEnvironmentVariable("N8N_MCP_TOKEN", $t, "User")
Remove-Variable s, t
```

Después cerrar y volver a abrir la app de Codex y las terminales. La variable de usuario sigue siendo texto plano en el registro: la mitigación es el paso 1, no esta variable. Alternativa más estricta, sin probar: guardar el token en `C:/Users/PC/BovedaPrivada/Agentes.kdbx` (existencia y puente **UNKNOWN**, no verificados) y exportarlo solo en la terminal que lanza Codex. Esa alternativa no sirve para la app de escritorio.

### Paso 3 — editar `~/.codex/config.toml` (diff)

```diff
-approval_policy = "never"
+approval_policy = "on-request"
 approvals_reviewer = "user"
-sandbox_mode = "danger-full-access"
+sandbox_mode = "workspace-write"
+
+[sandbox_workspace_write]
+network_access = false
@@
 [mcp_servers.n8n-mcp]
 url = "https://n8n-sergio-n8n.hqdqgh.easypanel.host/mcp-server/http"
 startup_timeout_sec = 120.0
-
-[mcp_servers.n8n-mcp.http_headers]
-Authorization = "Bearer <TOKEN_VIEJO>"
+bearer_token_env_var = "N8N_MCP_TOKEN"
@@
 [windows]
-sandbox = "elevated"
+sandbox = "unelevated"
+
+# Modo abierto, solo a propósito: codex -p abierto
+[profiles.abierto]
+approval_policy = "on-request"
+sandbox_mode = "danger-full-access"
```

Notas:
- `bearer_token_env_var` está confirmado en 0.161 (`codex mcp add --bearer-token-env-var`, verificador, y cadena en el binario).
- `[sandbox_workspace_write] network_access = false`: la clave aparece en el binario junto a `writable_roots`, así que es **probable pero no probada**. Si una tarea necesita red, usar `-c sandbox_workspace_write.network_access=true` en esa corrida.
- `[profiles.abierto]`: la cadena `profiles` existe en el binario, pero la forma exacta del perfil **no está confirmada**. Antes de depender de `codex -p abierto`, correr la prueba de abajo. Si falla, quitar el bloque. No es necesario para la seguridad.
- Si ya existe la tabla `[sandbox_workspace_write]`, solo agregar la línea.

### Paso 4 — borrar el secreto de los respaldos

```powershell
Remove-Item "$HOME\.codex\config.toml.bak-before-n8n-global-20260602235220", "$HOME\.codex\config.toml.bak-before-stitch-mcp" -Confirm
```

No se deshace. Los dos respaldos son de junio y contienen el token. El respaldo `config.toml.bak-before-n8n-mcp` y `config.toml.bak-20260629154959` no tienen token: no hace falta tocarlos.

### Paso 5 (opcional) — podar `trusted`

Borrar de `config.toml` los bloques `[projects.'c:\users\pc\documents\codex\2026-...']` que no se usan. Dejar `onia-hermes`, `onia-platform`, `hermes` y `bolivian electric`.

`scripts/codex-tarea.sh` no necesita cambios: ya fuerza `workspace-write` y `unelevated`.

## Quién la aplica

**Sergio Urcullo**, pasos 1 a 4. Motivo: `~/.codex` es config personal fuera del repo; rotar el token exige su login en n8n; cambiar una variable de usuario de Windows y borrar respaldos son acciones suyas.
**Madre-dev** verifica después con la prueba de abajo (dueña de harness e infra). No edita `~/.codex`.

## Prueba de hecho

Ninguna salida imprime el token. Ejecutar en Git Bash o PowerShell:

```bash
f=~/.codex/config.toml
grep -c 'Authorization *= *"Bearer ' $f ~/.codex/config.toml.bak-* 2>/dev/null   # todo 0 o archivos inexistentes
grep -nE '^(approval_policy|sandbox_mode)' $f                                    # on-request / workspace-write
grep -n 'bearer_token_env_var' $f                                                # = "N8N_MCP_TOKEN"
grep -A1 '^\[windows\]' $f                                                       # sandbox = "unelevated"
codex mcp list | grep n8n-mcp            # columna "Bearer Env Var" = N8N_MCP_TOKEN, status enabled
```

Comparación de que el token viejo ya no está en la variable (salida solo booleana):

```powershell
$line = (Get-Content "$HOME\.codex\config.toml" -TotalCount 148)[147]
$cfg = [regex]::Match($line, 'Bearer ([^"]+)"').Groups[1].Value
$env_t = [Environment]::GetEnvironmentVariable('N8N_MCP_TOKEN','User')
"variable_igual_a_config=" + ($cfg -eq $env_t)   # esperado: False, y el config ya no tiene token (paso 3)
```

Pruebas en vivo, pendientes (no ejecutadas en este relevamiento):
- Abrir `codex` interactivo y pedir "lista los workflows de n8n": debe responder con el token nuevo.
- Pedir "crea C:/Users/PC/Desktop/prueba.txt": debe pedir aprobación o bloquearlo el sandbox. Hoy lo hace sin preguntar; **no probado**.
- El token viejo debe devolver 401 contra el MCP. **No probado**; comprueba que la rotación fue real.
- Probar `codex -p abierto` y `network_access = false` en un directorio temporal. Esto ejecuta Codex, así que lo hace la madre-dev o Sergio, no este relevamiento.
