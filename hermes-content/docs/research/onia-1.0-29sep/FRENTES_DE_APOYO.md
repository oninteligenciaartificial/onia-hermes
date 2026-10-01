# Frentes de apoyo a la 1.0 — informe 28-sep-2026 (21:45 La Paz)

Para Sergio Urcullo. Todo en lectura: no se instaló, descargó ni cambió nada en VPS, config global ni cuota Codex.

## 1. Homelab / túnel — CAÍDO, causa en la PC de casa, no en esta laptop

### Hipótesis refutada
"El nodo-casa es probablemente ESTA PC" es **falso**:
- Esta laptop: `$env:COMPUTERNAME` = `DESKTOP-ENV6SDA`, WSL usuario `pc-linux-sergio`; sin procesos ssh/autossh, sin `/var/log/onia-loop-*`, sin tareas programadas de WSL/túnel.
- Nodo-casa: `DESKTOP-0GGGNMF`, usuario `compu_pc_casa_sergio` (`/root/bin/casa.sh` del VPS, handoff 27-sep).
- Desde acá no se puede relanzar nada: la otra punta es otra máquina.

### Evidencia (VPS, solo lectura, 01:37 UTC 29-sep)
| Comando | Resultado |
|---|---|
| `ss -ltnp \| grep :2222` | nada escucha |
| `ls -la /var/log/homelab/` | los 8 logs se tocaron por última vez el 28-sep a las 16:00:04 UTC |
| `journalctl -u ssh` (logins aceptados, agrupados por IP) | IP de casa `192.223.122.114`: 10.934 logins entre el 27-sep 00:00 y el **28-sep 16:00:06 UTC**. Después, cero. Último evento: desconexión limpia a las 16:00:07 |
| `fail2ban-client status sshd` | 0 bloqueadas, 0 en total. `ufw`: 22/tcp abierto a todos |
| `sshd -T` | `clientaliveinterval 0`: por eso el cierre de la sesión del túnel no quedó registrado |

### Causa
En el nodo, el túnel se relanza solo: `crontab` de root con `*/5 * * * * /root/bin/onia-tunel-inverso.sh` + `@reboot` (`scripts/loops/preparar-nodo.sh:60-61`). Si cron hubiera seguido vivo y con internet, el túnel habría vuelto en menos de 5 min. Pero el túnel, el rsync y las llamadas `docker` por ssh de los loops **murieron juntos entre las 16:00:07 y las 16:09 UTC** (12:00–12:09 La Paz). No volvió a entrar `recorrido-cliente` a las :09 ni `chatbot-cola` a las :13.
=> Conclusión: **WSL de casa abajo, la PC apagada o casa sin internet** desde ~12:00 La Paz (~9,7 h). Desde afuera no se puede saber cuál de las tres. Es el mismo patrón documentado del 12-sep y el 17-sep: WSL lo apaga el host y nada lo vuelve a levantar. La tarea `ONIA - WSL despierto (nodo de casa)` (`scripts/loops/homelab-wsl-arranque.ps1`) solo se dispara **al iniciar sesión**.

### Qué hice
Solo diagnóstico. No relancé nada porque el mecanismo existente vive en la otra máquina.

### Qué hace falta YA (una persona en DESKTOP-0GGGNMF)
1. Confirmar que la PC está prendida, con sesión iniciada e internet.
2. En PowerShell: `Start-ScheduledTask -TaskName "ONIA - WSL despierto (nodo de casa)"` (o simplemente abrir Ubuntu).
3. En 5 min o menos, cron relanza el túnel. Verificación (la hago yo si me avisan): `ssh root@187.77.16.63 'ss -ltn | grep 127.0.0.1:2222'`.
4. Leer el forense sin sudo por `casa.sh`: `journalctl -b -1 | tail` y el Event Log por interop, como en el incidente del 17-sep, para saber si fue apagado del host, un reinicio de Windows o un corte de red.

### Arreglo de fondo — PROPUESTA, NO aplicada (requiere aprobación de Sergio Urcullo)
**Archivo:** `scripts/loops/homelab-wsl-arranque.ps1`. Se aplica en casa con `-Aplicar`, que es idempotente y reemplaza la tarea.

Cambio en la sección 3, "Crear":
```powershell
$disparo   = New-ScheduledTaskTrigger -AtLogOn -User $usuario
# NUEVO: re-chequeo cada 10 min. Si WSL sigue vivo, la instancia anterior
# (sleep infinity) sigue corriendo y IgnoreNew descarta el disparo: no hace nada.
# Si el host apago WSL, wsl.exe termina, la instancia muere y el proximo
# disparo (<=10 min) lo vuelve a arrancar; luego cron @reboot + */5 rearma el tunel.
$cada10    = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) `
               -RepetitionInterval (New-TimeSpan -Minutes 10)
$ajustes   = New-ScheduledTaskSettingsSet ... (los mismos de hoy) `
               -MultipleInstances IgnoreNew
Register-ScheduledTask ... -Trigger @($disparo, $cada10) ...
```
Actualizar también la línea `Info "Disparador: ..."` para que diga "al iniciar sesion + cada 10 min".

- **Verificación:** `(Get-ScheduledTask -TaskName "ONIA - WSL despierto (nodo de casa)").Triggers` debe mostrar 2 disparadores; el segundo con `Repetition.Interval = PT10M` y `Duration` vacío (indefinido; confirmarlo en esa máquina, depende de la build). Prueba real: `wsl --shutdown`, esperar 10 min sin tocar nada y comprobar `127.0.0.1:2222` desde el VPS.
- **Reversión:** `homelab-wsl-arranque.ps1 -Quitar` y volver a aplicar la versión anterior (o `git revert` del commit del script y `-Aplicar`).
- **Límite que NO cubre:** la tarea es `LogonType Interactive`, así que no corre si Windows se reinicia y nadie inicia sesión. Para eso siguen abiertas las opciones (a) y (b) que ya documenta el script (guardar contraseña o inicio de sesión automático), las dos decisión de Sergio Urcullo.

### Otro dato, sin perseguir
GitHub (`events` de onia-hermes): cero pushes de los loops de casa el 28-sep; el último fue el 27-sep a las 23:42 UTC, aunque los loops corrían hasta las 16:00 UTC. Hay que revisarlo al volver el nodo: puede ser falta de cambios o un push trabado.

## 2. Codex Cloud — 0 jobs; primer job verificado viable desde el domingo 4-oct 16:57 La Paz

| Medición | Resultado |
|---|---|
| Último `rate_limits` en `~/.codex/sessions/…/rollout-2026-09-28T19-14-04-*.jsonl` (registro 01:29:26 UTC = 21:29 La Paz) | `primary.used_percent = 99` (no 97), ventana 10.080 min, `has_credits=false`, `balance=0`, `plan_type=prolite` |
| `resets_at` 1791147457 | **2026-10-04 20:57:37 UTC = domingo 4-oct 16:57 La Paz** (UTC-4) |
| `codex cloud list` (CLI 0.139.0) | `No tasks found.` |
| Entornos | Según el handoff hay 2 (Platform `6abad6a0…`, Hermes `6abad782…`), con setup guardado y **nunca ejecutado**. No los reverifiqué: Chrome no estaba conectado y el CLI no lista entornos |
| Rama del candidato | **Corrige el handoff Cloud:** `wip/v1-integracion-20260928` ya existe en remoto en `1adb750b` (= HEAD local de `codex/v1-integracion-20260927`, árbol limpio, 2 commits sobre `master 9a1afc34`, commiteado el 28-sep a las 21:31 La Paz). El handoff dice "sin commit ni push": quedó viejo |

**Para el "primer job verificado" falta:**
1. **Cuota:** esperar el reset del 4-oct a las 16:57 La Paz o comprar créditos (gasto, requiere aprobación). No verifiqué hoy en la documentación si Cloud y local comparten el mismo límite; hay que asumir que sí.
2. **Aprobación de Sergio Urcullo** para que el setup del entorno Platform instale dependencias (`npm ci`) en el contenedor Cloud. La regla del 28-sep pide aprobar cualquier instalación.
3. Encargo acotado, ya definido en `ONIA_CLOUD_HANDOFF_20260928.md`: rama explícita `wip/v1-integracion-20260928` @ `1adb750b` → checkout, `npm ci`, `tsc --noEmit` y una prueba focal. Entrega: SHA, comandos y resultado.
4. Opcional antes de lanzar: con Chrome conectado, mirar la página de entornos para confirmar que siguen ahí.

## 3. Paperclip — no sirve a la 1.0 hoy. No instalar

- **Qué es:** `paperclipai/paperclip` (https://github.com/paperclipai/paperclip, sitio https://paperclip.ing), licencia **MIT**. Servidor Node + UI React para orquestar agentes: tareas, responsables, presupuestos y reservas. Última release `v2026.916.1` (21-sep); npm `paperclipai@2026.916.1`, `dist.shasum ae76d5a27477cfa54e32a7598937613e6992192b`, `engines node >=24.11.0`.
- **Qué instala y qué cambia:** `install.sh` asegura Node ≥24.11, instala un CLI administrado en `~/.paperclip/cli`, arranca el onboarding y puede registrar un servicio en segundo plano. Levanta la API en `localhost:3100` con **Postgres embebido** y almacenamiento de archivos local. La vía sin instalación permanente es `npx … paperclipai onboard` / `test-drive`, y esta última pide `ANTHROPIC_API_KEY`/`OPENAI_API_KEY`, o sea gasto de API. **Telemetría anónima ACTIVADA por defecto**; se apaga con `PAPERCLIP_TELEMETRY_DISABLED=1` o `DO_NOT_TRACK=1`. Acá no está instalado (`~/.paperclip` no existe).
- **Costo:** el software es gratis. El costo real son los tokens de los agentes que despacha (API o cuota de suscripción; Codex está al 99 %) más operar un servidor y una base de datos más.
- **Por qué no sirve a la 1.0:**
  1. Lo que traba la 1.0 es el build + QA autenticada + puente Hermes, y lo que traba el negocio son los clientes (`ONIA_ESTRATEGIA_DE_EMPRESA.md`), no la coordinación de agentes.
  2. Su reserva atómica solo coordina a los workers que usan su API. Los 4 loops de cron+flock y las sesiones Codex/Claude seguirían afuera salvo que se recableen todos. No da gratis la "reserva central de rutas entre hosts" que falta.
  3. Su adaptador de Hermes necesita la API REST/SSE de Hermes, que no está corriendo (solo el gateway de Telegram).
  4. Node ≥24.11: la laptop tiene 24.13, pero el VPS y casa corren 22.
  5. Suma un panel más (va contra la regla de no abrir frentes) y telemetría por defecto.
- **Cuándo reabrirlo:** después del corte de la 1.0, si la reserva central sigue haciendo falta. El diseño del piloto ya está en `hermes-cal-nube-20260928.md` (2 workers, 5–10 tareas sintéticas, sin credenciales reales).

## 4. Ahorro de tokens

### Estado medido (solo metadatos)
| Fuente | Resultado |
|---|---|
| `~/.claude/settings.json` → `enabledPlugins` | `ponytail@ponytail: true`, `caveman@caveman: true`. No hay `statusLine` ni `mcpServers` de ninguno |
| `~/.claude/plugins/installed_plugins.json` | **Ponytail 4.8.4**, commit `16f29800fd26`, scope user, instalado el 1-ago. **Caveman** versión = commit `84cc3c14fa1e`, scopes user (12-ago) y local (30-abr) |
| Hooks del plugin (caché) | Ponytail `hooks/claude-codex-hooks.json`: SessionStart, SubagentStart, UserPromptSubmit. Caveman `plugin.json`: SessionStart, UserPromptSubmit |
| Codex (`~/.codex/config.toml`, `hooks.json`, `plugins/cache`) | No aparece ni Ponytail ni Caveman |
| CBM | No está en PATH, ni en `~/.cache/codebase-memory*`, ni en `.claude.json`/`settings.json`/`config.toml` |

### Por qué un A/B limpio de Ponytail es imposible con la config actual
Los dos plugins están habilitados a nivel usuario y sus hooks inyectan reglas en **cada sesión y cada subagente**. Prueba directa: este mismo subagente recibió "PONYTAIL MODE ACTIVE — level: full" por el hook SubagentStart. Cualquier "baseline" corrido con este perfil ya viene contaminado. El autor de Ponytail reconoce el mismo problema en su propio benchmark (REVIEW.md). Codex está limpio, pero es otro modelo: no sirve de baseline.

Vía posible **sin tocar la config global, NO verificada:** baseline por invocación con `claude -p --settings '{"enabledPlugins":{"ponytail@ponytail":false,"caveman@caveman":false}}'`. Los argumentos de línea de comandos tienen más prioridad que la config de usuario. Se comprueba con un prompt trivial: ver que no aparezca la inyección. La alternativa es `CLAUDE_CONFIG_DIR` apuntando a una carpeta aparte, pero eso exige un login nuevo, así que lo tiene que hacer Sergio Urcullo.

### Propuesta CBM para una carpeta de ensayo aislada — NO descargada; requiere aprobación
- **Nombre y origen:** `codebase-memory-mcp`, de DeusData, https://github.com/DeusData/codebase-memory-mcp, MIT.
- **Release fijado:** `v0.11.0` (15-sep-2026), commit del tag `8972ea69c6ad94b1ef1d4ffbf0a92d78d2db1798`.
- **Artefacto recomendado (Linux dentro de WSL, para poder cortar la red):** `codebase-memory-mcp-linux-amd64.tar.gz`, 39.859.115 B, sha256 `032b33c1833919a2d1de67ff6367fa6ea46aee8689c86ef223c88fae3b6e4536`, más la firma sigstore `…linux-amd64.tar.gz.bundle` (sha256 `15923606fbc4098f80f6b75e5edc11bd07b30e4af44cf2b38a4ee355fc967ac5`). También están `checksums.txt` (sha256 `5e5a3b25…1cf91`) y `sbom.json`.
  - Alternativa Windows: `codebase-memory-mcp-windows-amd64.zip`, 39.858.881 B, sha256 `6eb6beaf261b19e419766e78baf93cbc3cf1c6338cff8fb7c0234859f96d1685`. Es idéntico al zip "ui", o sea que trae UI. La descarto porque en Windows cortarle la red a un solo exe exige una regla de firewall, que es un cambio de seguridad del sistema.
- **Verificación antes de ejecutar:** `sha256sum` contra el digest de arriba y `gh attestation verify <tar.gz> --bundle <.bundle> --repo DeusData/codebase-memory-mcp` (gh ya está instalado). Si cualquiera de las dos falla, no se sigue.
- **Qué cambia:** solo la carpeta de ensayo en WSL, `~/cbm-ensayo/{bin,cache,runtime,repo}`. `repo` es una copia allowlist del candidato Platform, sin `.env`, llaves ni uploads.
  - Variables: `CBM_CACHE_DIR=~/cbm-ensayo/cache`, `CBM_RUNTIME_DIR=~/cbm-ensayo/runtime`, `CBM_ALLOWED_ROOT=~/cbm-ensayo/repo`.
  - `config set watcher_enabled false` y `ui_enabled` apagado; los dos se escriben dentro de `cache`.
  - Nada de `install.ps1`/`install.sh` (tocan PATH y la config de los agentes), nada de `update`, nada de `curl|bash`.
  - Claude lo usaría solo por invocación: `--mcp-config <archivo del ensayo> --strict-mcp-config`, lanzando `wsl.exe -d Ubuntu -e unshare -rn …`. No se toca `~/.claude`.
- **Riesgos de red y telemetría:** según SECURITY.md de v0.11.0, tras el `initialize` de MCP arranca un chequeo de actualizaciones a `api.github.com/repos/DeusData/codebase-memory-mcp/releases/latest` (curl, 5 s). El mismo documento dice que no se envían métricas ni contenido. El README y SECURITY se contradicen: por eso se corre sin red (`unshare -rn`). Antes hay que comprobar que el namespace sin privilegios funciona en esa WSL. El modo MCP levanta un **daemon desacoplado** que sobrevive a la sesión: se detiene con `daemon stop` y se verifica que no quede ningún proceso.
- **Reversión:** `codebase-memory-mcp daemon stop` y borrar `~/cbm-ensayo` y el archivo de mcp-config del ensayo. No hay nada global que revertir.
- **Opinión:** no acelera la 1.0. Conviene ensayarlo después del corte, o por lo menos después del reset de Codex, con el protocolo de 4 brazos de `REVIEW.md`.

## Aprobaciones que necesita Sergio Urcullo
1. **Ya:** que alguien en DESKTOP-0GGGNMF levante WSL (paso 2 de la sección 1). No necesita aprobación, necesita manos. Yo verifico desde el VPS.
2. Aplicar el disparador de 10 min en `homelab-wsl-arranque.ps1` (sección 1). Decidir aparte (a)/(b) para los reinicios sin sesión iniciada.
3. Codex Cloud: aprobar el `npm ci` del setup en el entorno Platform y fijar la fecha (≥ 4-oct 16:57) o comprar créditos.
4. Paperclip: nada que aprobar; la recomendación es no instalar.
5. Ahorro de tokens: aprobar (a) una prueba trivial de `--settings` para el baseline y (b) la descarga del CBM v0.11.0 linux-amd64 (~40 MB) al ensayo aislado, cuando toque.
