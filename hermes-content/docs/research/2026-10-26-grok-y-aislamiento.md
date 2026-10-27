# Grok y un espacio por agente

> Foto del 26-oct-2026 (investigación de la sesión principal, con verificación al final). No es fuente de verdad:
> lo decidido está en `ONIA_ESTRATEGIA_DE_EMPRESA.md`, `ONIA_HARNESS.md` y `handoff/hermes-local.md`. Las rutas al
> scratchpad de la sesión ya no existen.

26-oct-2026. Trabajo de solo lectura: no se instaló, descargó ni lanzó nada. Sale de los informes de los frentes «grok» y «aislamiento», más dos mediciones propias (`whoami /groups` e `icacls E:\`). Lo que no se comprobó dice **supuesto**.

## 1. Conclusión

1. «Grok bot» son dos productos de xAI. **Grok Build** es el CLI `grok` que Orca sabe lanzar, en beta desde el 25-may-2026. **Grok Bot** son agentes que viven en una computadora en la nube de Cursor. Ninguno de los dos supera a Hermes para ONIA: no tienen canal de Telegram propio, no usan ChatGPT Pro ni Claude Max, piden una suscripción de xAI (Grok Build desde USD 8/mes, Grok Bot desde USD 30/mes) y no tienen sandbox en Windows.
2. Hermes se queda y Grok pasa a pendiente. Si algún día hace falta, se usa desde Hermes, que ya trae el proveedor `xai-oauth` y la skill `grok`.
3. Grok Bot va al revés de «cada empleado con su PC»: todos los bots de una cuenta comparten una sola computadora, con las mismas cookies y credenciales.
4. Hoy los agentes no están separados. Todos corren como el usuario PC, heredan el login de GitHub de Sergio Urcullo (keyring, permisos `repo` y `workflow`) y pueden escribir en todo E:. Windows 11 Home no trae Hyper-V ni Sandbox, y la RAM no alcanza para una VM por agente.
5. La separación real no cuesta nada y tiene cuatro pasos: cerrar los permisos de E:, crear un usuario de Windows para Hermes y otro para la orquesta, darle a cada uno su identidad de GitHub (a Hermes un token fine-grained de la cuenta de Sergio Urcullo que solo escribe issues; a la orquesta una GitHub App) y darle a cada agente su propio perfil de navegador. Una cuenta bot no sirve: en un repo personal privado todo colaborador tiene escritura.

## 2. Grok contra Hermes

### Qué es cada producto

| Producto | Qué es | Dónde corre | Cómo se paga |
|---|---|---|---|
| **Grok Build** (`grok`, el que lanza Orca) | Agente de código con pantalla de terminal, modo sin pantalla (`-p`) y ACP. Código abierto (Apache-2.0, `xai-org/grok-build`). Entra con `grok login` | En la PC. Hay binario para Windows | The X Subscription desde Plus (USD 8/mes, uso básico; Premium USD 30 da 4x). Los planes viejos SuperGrok y X Premium+ siguen valiendo. O por token con `XAI_API_KEY`, que se factura aparte |
| **Grok Bot** | Bots con nombre, tarea y memoria. Usan navegador, terminal y archivos, tienen rutinas y aprobaciones y responden a @bot en X | En una computadora en la nube de Cursor; la doc no ofrece alojarla en un servidor propio. Si se habilita, también corre comandos en la PC local (por defecto pregunta cada vez) | Planes pagos de Cursor, SuperGrok o X Subscription desde Premium (USD 30/mes); Plus no lo incluye |

### Grok Build contra Hermes v0.22.2

| Criterio | Hermes v0.22.2 | Grok Build | Gana |
|---|---|---|---|
| Reglas que lee | Un solo tipo de archivo de proyecto: `.hermes.md`; si no hay, la cadena `AGENTS.md` (raíz → carpeta); si no, el `CLAUDE.md` de la carpeta. Con tope de tamaño. Al tocar una subcarpeta suma su `AGENTS.md` o, si no tiene, su `CLAUDE.md`. En este repo carga `AGENTS.md` | `AGENTS.md`, y además `CLAUDE.md`, `CLAUDE.local.md` y `.claude/rules`, que son de Claude, sin tope de tamaño (salta lo que ignora `.gitignore`) | Hermes |
| Hooks de Claude | No los corre | Lee `.claude/settings.json`. Si se confía en el proyecto (`/hooks-trust` o `--trust`), corre el Stop `git-autosync` | Hermes |
| Bloquear comandos | `approvals.deny`, que no resuelve alias. Hoy corre con `--yolo` y sin `deny` | `deny` gana siempre, modo `dontAsk`, candado de administrador en `/etc/grok` (no está documentado cómo se pone en Windows). Hay un `~/.grok/requirements.toml` por usuario, pero lo puede editar el mismo usuario que corre el agente | Grok en el papel. En Windows ninguno aísla de verdad |
| Sandbox | No tiene | Viene apagado. Usa Landlock (Linux) o Seatbelt (macOS); Windows no figura | Ninguno en Windows |
| Memoria con aprobación | `memory.write_approval` | No documentado | Hermes |
| Delegar en hijos | `delegate`, pero el hijo arranca sin `AGENTS.md` | Subagentes y worktrees. No está documentado si heredan el `deny` (supuesto) | Grok en funciones, sin dato de seguridad |
| Telegram | Sí, canal propio, ya funciona en el VPS | Sin canal propio para hablarle. Grok Bot puede mandar mensajes con un plugin de terceros (Composio) y Grok Build con un MCP | Hermes |
| Usar ChatGPT Pro o Claude Max | ChatGPT sí, por OAuth `openai-codex`. Claude Max: el código acepta `CLAUDE_CODE_OAUTH_TOKEN`, pero `AGENTS.md:120` lo descarta porque solo gasta *extra usage* | Ninguna de las dos: otros modelos solo por clave de API (`base_url` + `env_key`) | Hermes |
| Costo | MIT, nada extra | The X Subscription desde Plus, USD 8/mes con uso básico (x.ai/pricing, 26-oct), o tokens de API aparte | Hermes |
| Madurez | En uso en ONIA | Beta temprana. Repo creado el 14-jul-2026, no acepta contribuciones | Hermes |
| Estado en ONIA | Instalado | No instalado: no hay `grok`, ni `~/.grok`, ni suscripción registrada | Hermes |

### Veredicto

| Opción | Decisión | Por qué |
|---|---|---|
| Cambiar Hermes por Grok Build | **No** | Se perdería Telegram y el uso de ChatGPT Pro, sumaría un gasto y un proveedor más, y es una beta. Además cargaría `CLAUDE.md` y el autosync de Claude: sería un agente más pisando lo de Claude |
| Sumar Grok Build para algo puntual, como buscar en X | **No por ahora, queda pendiente** | X no está en el orden de canales de la etapa (WhatsApp, eventos, Meta). Instalar pide OK |
| Grok Bot para «cada empleado con su PC» | **No** | Todos los bots comparten una computadora; la propia doc dice que las pantallas «not separate security boundaries». Además le entrega los logins a un tercero, y ya se había descartado el 16-oct. Si se le habilita la PC local, corre como el usuario PC, con todo lo que PC ve |
| Si algún día hace falta Grok | Usarlo **desde Hermes** | Con `xai-oauth` y la skill `grok`, en un worktree propio, sin aprobar los hooks del proyecto, sin bypass y en WSL para tener sandbox (supuesto) |

Hay dos ideas de Grok que conviene copiar. La primera es el candado de permisos: lo pone el administrador y el agente no lo puede tocar. Es la barrera que hoy le falta a Hermes. La segunda es el «hecho» votado por revisores, que la orquesta ya tiene porque el revisor es distinto del autor.

## 3. Un espacio por agente

### 3.1 Lo que permite esta PC (medido el 26-oct)

| Qué | Resultado | Qué implica |
|---|---|---|
| Edición | Windows 11 **Home** (`Core`), 26H2, build 26300.9711 | No trae Hyper-V, Windows Sandbox ni escritorio remoto entrante |
| Hyper-V y Sandbox | No existen `vmms.exe` ni `WindowsSandbox.exe`. El hipervisor que se ve es el de WSL2 | Una VM solo sería posible con VMware o VirtualBox, o pasando a Pro |
| CPU y RAM | i5-11400H (6 núcleos, 12 hilos). 23,6 GB en total y **10-11 GB libres** con WSL y Docker apagados | Alcanza para unos 2 trabajadores con navegador a la vez (estimación, supuesto). Una VM con Windows no entra |
| WSL y Docker | WSL 2.7.12 con Ubuntu y docker-desktop, las dos detenidas, y tope de 6 GB. Docker Desktop 29.8 con el motor apagado | En Home, Docker solo corre contenedores Linux por WSL2 |
| Usuarios | `PC`, `CodexSandboxOffline`, `CodexSandboxOnline` y `ASPNET`. No hay usuario para Hermes | La decisión de darle un usuario propio a Hermes no está aplicada ni escrita en el repo (supuesto) |
| GitHub | `gh` logueado como `oninteligenciaartificial` en el keyring, con `repo` y `workflow`. Git usa `credential.helper=manager`, puesto en el gitconfig del sistema (`C:/Program Files/Git/etc/gitconfig`); vale para todo usuario de Windows, pero las credenciales quedan en el Credential Manager de cada uno | Cualquier proceso de PC puede hacer `git push` como Sergio Urcullo. Que `orquesta.mjs:287` saque `GH_TOKEN` no lo impide |
| Tarea «ONIA Orquesta» | Corre como PC, en modo «Solo interactivo» | Los trabajadores de la PC corren con el keyring de Sergio Urcullo |
| Permisos de E: | `E:\` le da **Modificar a `Usuarios autentificados`**, y `E:\onia-wt` y `E:\onia-orquesta` lo heredan | Un usuario nuevo podría escribir en todos los worktrees |
| Cuenta PC | Está en Administradores, pero como «Grupo usado solo para denegar» (UAC). Medido con `whoami /groups` | Sin elevar, **PC escribe en E: gracias a `Usuarios autentificados`**. Si ese permiso se saca sin dar acceso explícito a PC, los agentes pierden sus worktrees |
| Navegadores | Chrome tiene 9 perfiles, todos dentro del `User Data` de PC. También hay Edge, Brave, 4 Chromium de Playwright y `agent-browser` | Esos perfiles no sirven para automatizar: Chrome 136 bloquea la depuración remota sobre la carpeta de datos por defecto |
| Disco | C: 86 GB libres, E: 490 GB libres | Hay lugar para perfiles en E: |

### 3.2 Dónde va cada agente

| Agente | Máquina y usuario | Carpeta | Navegador | Identidad | Qué no ve |
|---|---|---|---|---|---|
| Hermes de la PC | Esta PC, usuario estándar **`onia-hermes`**. Sergio Urcullo le abre la pantalla con `runas` | `E:\onia-wt\hermes-base` en solo lectura. Escribe solo en la carpeta de pedidos y en `docs/handoff` (la ruta exacta de pedidos sale de `cargar-issue.mjs`: supuesto). Su `HERMES_HOME` queda en su propio perfil | Ninguno: trabaja con `gh` y la API | **Token fine-grained de la cuenta de Sergio Urcullo**, solo `onia-hermes`, Contents de lectura e Issues de escritura (el mismo tipo que ya se pidió para el VPS, `handoff/orquesta.md:106`). Una cuenta bot no sirve: `onia-hermes` es un repo privado de cuenta personal, donde todo colaborador tiene escritura y el token fine-grained no funciona para colaboradores. Si hace falta distinguir a Hermes en el historial, una segunda GitHub App. Modelo por OAuth `openai-codex`, guardado en su Credential Manager | `C:\Users\PC` (Chrome, `~/.claude`, `~/.codex`, la bóveda), el keyring de Sergio Urcullo, `E:\onia-orquesta` y el checkout principal |
| Orquesta en la PC | Esta PC, usuario **`onia-orquesta`**, que corre la tarea programada | `E:\onia-orquesta\*` | Ninguno | **GitHub App** (no ocupa asiento y usa tokens de vida corta) con permisos sobre ramas, PR e issues. El token vive en el entorno de `orquesta.mjs`, con el keyring **vacío** | Lo de PC y lo de Hermes |
| Trabajador de plataforma (Codex) | Dentro de `onia-orquesta`, con el sandbox de Codex | Su worktree | Ninguno | Sin GitHub. Login de Codex de `onia-orquesta` | El resto de E: y de C: |
| Trabajador de video (Claude) | Dentro de `onia-orquesta`. Si choca con plataforma, más adelante pasa a `onia-video` | Su worktree | Perfil propio en `E:\onia-perfiles\video`, logueado una vez por Sergio Urcullo (Higgsfield y Biblioteca de anuncios de Meta). Instagram sigue por Buffer (`ig-reel.mjs`), sin navegador | Sin GitHub. Tokens de Higgsfield y de Buffer | El Chrome personal de Sergio Urcullo y `C:\Users\PC\Videos\ONIA-brutos`, salvo el clip que se copia al worktree con OK |
| Trabajadores de la nube | GitHub Actions, sin cambios | `runner.temp` | Ninguno con login | `GITHUB_TOKEN` del workflow y `CLAUDE_CODE_OAUTH_TOKEN` | Todo lo de la PC |
| Codex despachado (`codex-tarea.sh`) | Hoy corre como PC con sandbox `unelevated`, que no permite negar lecturas | Su worktree | Ninguno | El Codex de PC | Hoy lo ve todo. Mejor pedirlo como issue `carril:plataforma` para que corra en `onia-orquesta`, o probar el sandbox `mxc` de Codex (CLI 0.164.0 instalado; la doc pide 0.162.0 o más), que niega lecturas sin cuentas ni setup de administrador. Que esta build tenga MXC no está comprobado (supuesto) |
| Sesión principal de Claude Code | Usuario PC, con Sergio Urcullo presente | Su worktree | Su Chrome, con Claude in Chrome | La de Sergio Urcullo | Es la única con su identidad y no corre sola |
| Hermes del VPS | Hoy en `/root/.hermes`. Pasa a un usuario Linux `hermes`, sin sudo y fuera del grupo docker | `/home/hermes` | Ninguno | El token fine-grained que solo escribe issues, ya previsto en `/root/.config/onia/gh-issues-token` (`ONIA_HARNESS.md:81`), movido a su usuario | El resto del VPS y producción |

### 3.3 Orden de implementación

Se hace en orden. Cada paso dice cuándo está hecho.

**0. Cerrar los permisos de E:** en `E:\onia-wt`, `E:\onia-orquesta` y la futura `E:\onia-perfiles`. **Antes de sacar nada, hay que darle acceso explícito a PC**, porque hoy PC escribe ahí gracias a `Usuarios autentificados` (está medido: su pertenencia a Administradores solo sirve para denegar mientras no se eleva). Lo corre Sergio Urcullo en una PowerShell de administrador. Todavía no se ejecutó:

```powershell
icacls E:\onia-wt /grant "PC:(OI)(CI)M"
icacls E:\onia-wt /inheritance:d
icacls E:\onia-wt /remove:g *S-1-5-11 *S-1-5-32-545
```

Después se repite en `E:\onia-orquesta`.

Está hecho cuando se cumplen tres cosas:
- `icacls` ya no muestra `Usuarios autentificados` ni `Usuarios` en esas carpetas.
- Una sesión normal de Claude sigue pudiendo escribir en su worktree.
- Codex sigue escribiendo en su worktree con el sandbox `unelevated`. Esto no está comprobado (supuesto): si falla, se le da acceso explícito al grupo del sandbox.

**1. Usuario `onia-hermes` y su token.** El usuario se crea con `New-LocalUser` (el módulo `Microsoft.PowerShell.LocalAccounts` está en esta PC Home: medido), es estándar (no administrador) y la clave la escribe Sergio Urcullo. Recibe lectura y ejecución sobre `hermes-base` y Modificar sobre pedidos y handoff. Hermes entra con un token fine-grained de la cuenta de Sergio Urcullo que solo lee el código y escribe issues de `onia-hermes`, guardado en el almacén de credenciales de `onia-hermes`.

Está hecho cuando, desde `onia-hermes`:
- `gh auth status` muestra ese token y no el keyring de PC (la cuenta que figura sigue siendo la de Sergio Urcullo);
- un `git push` falla por permisos;
- `dir C:\Users\PC\AppData` da acceso denegado;
- `node scripts/orquesta/cargar-issue.mjs` carga un issue de prueba con `necesita-ok`.

**2. Usuario `onia-orquesta` y GitHub App.** La tarea «ONIA Orquesta» pasa a correr con ese usuario, y él recibe Modificar sobre `E:\onia-orquesta`. Para que corra sin sesión abierta hace falta guardar su clave en el Programador de tareas o usar S4U (supuesto, falta probarlo).

Está hecho cuando un trabajador que corre `gh auth status` no encuentra sesión y la orquesta igual deja su PR con el token de la App.

**3. Un perfil de navegador por agente** en `E:\onia-perfiles\<agente>`, empezando por video. Se usa `--user-data-dir`, `launchPersistentContext` de Playwright o `agent-browser --profile <ruta>`, y Sergio Urcullo loguea solo lo que ese trabajador necesita.

Está hecho cuando el trabajador de video abre Higgsfield logueado desde su perfil y el Chrome personal de Sergio Urcullo no se tocó.

**Puede esperar:**
- correr `check: cmd` en Docker o en Vercel Sandbox, porque hoy corre fuera de todo sandbox (`orquesta.mjs:288`);
- una distro WSL con sandbox para Claude, con `automount` e `interop` apagados;
- probar el sandbox `mxc` de Codex con el comando de una sola línea que trae su doc (no cambia la configuración guardada) y, si no anda, arreglar el modo `elevated` (`codex-tarea.sh:12-14`);
- sacar a Hermes del VPS de root, en el PR de `aplicar.sh` que ya está pendiente;
- Codespaces, E2B y Daytona;
- seguir el «agent workspace» de Windows, que está en preview privada para Insiders y pide que el agente esté firmado e integrado con Windows; que hoy no sirva para Claude, Codex ni Hermes es un supuesto.

**No se hace:** pasar a Pro ni armar VMs. Hay además dos docs que corregir más adelante: `PLAN_HOMELAB.md:34` recomienda una VM con Hyper-V, y esta PC Home no lo tiene; y `ONIA_HARNESS.md:246` pide «una cuenta de GitHub aparte para Hermes», que en un repo personal privado tendría escritura.

## 4. Lo que le toca a Sergio Urcullo

| Qué | Por qué lo hace él | Costo |
|---|---|---|
| Correr como administrador los `icacls` del paso 0 | Cambia permisos del sistema; un agente no los toca | 0 |
| Crear los usuarios `onia-hermes` y `onia-orquesta`, escribiendo él las claves | Es una configuración del sistema y las claves no pasan por un agente | 0 |
| Crear desde su cuenta el token fine-grained de Hermes: solo `onia-hermes`, Contents de lectura, Issues de escritura, con vencimiento | Los tokens los crea él. No hace falta cuenta bot: en un repo personal privado no existe el colaborador de solo lectura | 0 |
| Crear la GitHub App e instalarla solo en `onia-hermes` y `onia-platform` | Le da permisos sobre sus repos | 0 |
| Hacer el login de los modelos en cada usuario: Hermes con ChatGPT; orquesta con Claude y Codex | Cada usuario de Windows tiene su propio almacén de credenciales | 0. Que la misma suscripción admita otro login en paralelo es un supuesto |
| Loguear el perfil de video (Higgsfield, Meta) con su MFA | Las cookies no se copian (regla de credenciales) | 0. El gasto sigue frenado por el proceso (`generate cost`, `ok: sergio`) |
| Aprobar instalaciones, **solo si hacen falta** | Un usuario nuevo no ve Hermes ni los CLI globales de PC. La propuesta es compartir el código ya instalado en una carpeta de solo lectura sin secretos; si algún CLI no funciona así (no comprobado), se pide ese solo, explicando su origen | 0 |
| **No** pagar Windows Pro (US$99,99 en minoristas de EE.UU.; Microsoft no publica el precio en su página de ayuda y en Bolivia puede variar) ni una suscripción de xAI | No hacen falta para separar a los agentes | 0 |

## 5. Decisiones

1. **¿Qué se hace con Grok?**
   - **Recomendada:** queda Hermes, y Grok pasa a pendiente.
   - Otras opciones: probar Grok Build pagando por token con un tope; cambiar Hermes por Grok.
   - Por qué: Grok no tiene canal de Telegram, no usa ChatGPT Pro ni Claude Max, suma un gasto (desde USD 8/mes), es una beta y en Windows no tiene sandbox. Grok Bot, además, comparte una sola computadora entre todos los bots.
2. **¿Se cierran los permisos de E: antes de crear usuarios?**
   - **Recomendada:** sí, primero se le da acceso explícito a PC y después se saca `Usuarios autentificados`.
   - Otra opción: crear los usuarios sin tocar permisos.
   - Por qué: sin este paso, cualquier usuario nuevo escribe en todos los worktrees y la separación queda solo de nombre. Y si se saca el permiso sin dar acceso a PC, los agentes se quedan sin sus carpetas.
3. **¿Cuántos usuarios de Windows se crean ahora?**
   - **Recomendada:** dos, `onia-hermes` y `onia-orquesta`, con el código ya instalado compartido en solo lectura.
   - Otra opción: uno por carril (`onia-hermes`, `onia-plataforma` y `onia-video`), con instalaciones nuevas.
   - Por qué: la RAM alcanza para unos 2 trabajadores con navegador, y cada usuario nuevo pide logins y quizá instalaciones. Si video y plataforma chocan, video se separa después.
4. **¿Con qué identidad de GitHub trabaja cada uno?**
   - **Recomendada:** Hermes con un token fine-grained de la cuenta de Sergio Urcullo recortado a issues de `onia-hermes`, y la orquesta con una GitHub App.
   - Otras opciones: una segunda GitHub App para Hermes (se distingue en el historial, pero guarda una llave privada en su usuario); pasar los repos a una organización gratis y usar una cuenta bot con rol de lectura; seguir como hoy, con el keyring de Sergio Urcullo a mano de todos.
   - Por qué: `onia-hermes` es privado y de cuenta personal. Ahí no existe el colaborador de solo lectura y el token fine-grained no sirve a colaboradores, así que una cuenta bot tendría que usar un token clásico con push. El token de la propia cuenta, recortado a issues, ya es el patrón pedido para el VPS. La App no ocupa asiento, usa tokens de vida corta y se distingue en el historial. Con la cuenta de Sergio Urcullo sin recortar, hoy cualquier trabajador tiene `repo` y `workflow`.
5. **¿Qué navegador usa el trabajador de video?**
   - **Recomendada:** un perfil propio en `E:\onia-perfiles\video`, que Sergio Urcullo loguea una vez.
   - Otras opciones: seguir con su Chrome personal; dejar el video solo en la sesión principal.
   - Por qué: Chrome 136 y Playwright ya no permiten automatizar el perfil por defecto, y un perfil aparte limita lo que ve el trabajador. El gasto y la cara/voz siguen frenados por el proceso.

## 6. Fuentes

**Medido en esta PC (26-oct-2026)**
- Orca: `%LOCALAPPDATA%/Programs/orca/resources/app.asar.unpacked/out/shared/tui-agent-config.js:292-302` (cómo lanza `grok`); `tui-agent-permissions.js:41-43` y `agent-permission-args.js:30` (`bypassPermissions` y `--yolo`); `agent-session-sign-in.js:9` (`grok login`); `agent-session-option-catalog-grok.js:50-66` (modelos).
- `command -v grok`, `test -d ~/.grok` y `npm ls -g`: Grok no está instalado.
- `gh api repos/xai-org/grok-build`: Apache-2.0, creado el 2026-07-14, último push el 2026-09-29.
- Hermes: `%LOCALAPPDATA%/hermes/hermes-agent`, `git describe` = v0.22.2; `LICENSE:1-3` (MIT); `hermes_cli/auth.py:176,179,213` (OAuth `openai-codex` y `xai-oauth`; `anthropic` acepta `CLAUDE_CODE_OAUTH_TOKEN`); `agent/prompt_builder.py:1858-1859` y `agent/subdirectory_hints.py:20` (qué archivo de reglas carga); `hermes_cli/config_defaults.py:1315-1318` (`memory.write_approval`); `optional-skills/autonomous-ai-agents/grok/SKILL.md:1-20`; `tools/delegate_tool.py:279` (hijos sin `AGENTS.md`).
- `Get-CimInstance Win32_OperatingSystem`, `Win32_Processor` y `Win32_ComputerSystem`; `Test-Path` de `vmms.exe` y `WindowsSandbox.exe`; `wsl -l -v`, `wsl --version` y `C:\Users\PC\.wslconfig`; `docker version`; `Get-LocalUser`; `Get-PSDrive`.
- `gh auth status` (sin mostrar el token) y `git config --show-origin --get-all credential.helper` (con `--global` no devuelve nada: está en el gitconfig del sistema).
- `gh api users/oninteligenciaartificial` (tipo `User`) y `gh repo view` (`onia-hermes` privado, de esa cuenta).
- `Get-Command New-LocalUser` (módulo `Microsoft.PowerShell.LocalAccounts`) y `codex --version` (0.164.0).
- `schtasks /Query /TN "ONIA Orquesta" /V /FO LIST`.
- `icacls` de `E:\`, `E:\onia-wt`, `E:\onia-orquesta` y `C:\Users\PC`.
- `whoami /groups`: Administradores como «Grupo usado solo para denegar».
- Nombres de carpetas de `%LOCALAPPDATA%\Google\Chrome\User Data`, sin abrir su contenido.

**Repo (`E:/onia-wt/hermes-base`)**
- `AGENTS.md:64-65` (instalar pide OK), `:69` (línea de negocio) y `:120` (Claude Max no se usa en Hermes).
- `hermes-content/docs/ONIA_HARNESS.md:46` (Hermes con `--yolo` y sin `deny`), `:245-246` (el `deny` no resuelve alias; la cuenta aparte es la única barrera dura) y §4, líneas 78-81 (Hermes del VPS en `/root`).
- `.claude/settings.json:13-18` (hook Stop `git-autosync`).
- `scripts/orquesta/orquesta.mjs:285-289` (recorte de `GH_TOKEN`; `check: cmd` sin sandbox).
- `scripts/codex-tarea.sh:11-14` (Codex en modo `unelevated`).
- `hermes-content/docs/PLAN_HOMELAB.md:34` (VM con Hyper-V).
- `hermes-content/docs/historial/ONIA_SISTEMA_AUTONOMO.md:257-260` (Grok Bot descartado).
- `hermes-content/docs/ONIA_ADQUISICION_Y_PAUTA.md:311-322` (orden de canales).
- `hermes-content/docs/handoff/orquesta.md:44,184`.
- `hermes-content/skills/seguridad-credenciales.md:159-164`.

**Documentación oficial (consultada el 26-oct-2026, salvo que diga otra fecha)**
- xAI: https://x.ai/news/grok-build-cli (25-may-2026); https://docs.x.ai/build/overview; `/build/features/project-rules`; `/build/features/hooks`; `/build/features/permissions`; `/build/enterprise`; `/build/features/sandbox`; `/build/settings/reference`; `/build/modes-and-commands`; https://docs.x.ai/grok-bot/overview; `/grok-bot/faq`; `/grok-bot/computer-and-apps`; `/grok-bot/approvals-security-and-privacy` (22-oct-2026); https://docs.x.ai/x-subscription/pricing (11-oct-2026); https://docs.x.ai/x-subscription/grok-bot; https://x.ai/pricing (Grok Build desde Plus). Telegram por terceros: https://composio.dev/toolkits/telegram/framework/grok-bot (21-oct-2026, no oficial).
- Microsoft:
  - Windows Sandbox (8-oct-2026): https://learn.microsoft.com/en-us/windows/security/application-security/application-isolation/windows-sandbox/
  - Requisitos de Hyper-V (28-oct-2025): https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/reference/hyper-v-requirements
  - Configuración de WSL (16-oct-2026): https://learn.microsoft.com/en-us/windows/wsl/wsl-config
  - Escritorio remoto: https://support.microsoft.com/en-us/windows/how-to-use-remote-desktop-5fe128d5-8fb1-7a23-3b8a-41e636865e8c
  - Funciones agénticas (16-oct-2025): https://support.microsoft.com/en-us/windows/ai/ai-features/experimental-agentic-features
  - Seguridad agéntica (18-nov-2025): https://learn.microsoft.com/en-us/windows/security/book/operating-system-agentic-security
  - Pasar de Home a Pro: https://support.microsoft.com/en-us/windows/deployment/install-upgrade/upgrade-windows-home-to-windows-pro
- Chrome 136 (17-mar-2025): https://developer.chrome.com/blog/remote-debugging-port. Playwright: https://playwright.dev/docs/api/class-browsertype. agent-browser: https://github.com/vercel-labs/agent-browser.
- Codex: https://learn.chatgpt.com/docs/windows/windows-sandbox (`mxc`, `elevated` y `unelevated`). Windows Pro: precio de Best Buy, US$99,99 (https://www.bestbuy.com/product/microsoft-windows-11-pro-upgrade-from-windows-11-home-english-digital-english/J3ZKK5VKFV/sku/6496033). Claude Code: https://code.claude.com/docs/en/sandboxing.
- GitHub: términos §B.3, vigentes desde el 27-abr-2026 (https://docs.github.com/en/site-policy/github-terms/github-terms-of-service); límites del token fine-grained (https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens); colaboradores de un repo personal (https://docs.github.com/en/account-and-profile/reference/permission-levels-for-a-personal-account-repository); GitHub Apps (https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/deciding-when-to-build-a-github-app); Codespaces (https://docs.github.com/en/billing/concepts/product-billing/github-codespaces).
- Docker: https://docs.docker.com/desktop/setup/install/windows-install/. VMware (11-nov-2024): https://blogs.vmware.com/cloud-foundation/2024/11/11/vmware-fusion-and-workstation-are-now-free-for-all-users/.
- Precios de sandboxes en la nube: https://vercel.com/docs/vercel-sandbox/pricing, https://e2b.dev/pricing y https://www.daytona.io/pricing. Orca: https://www.onorca.dev/docs/ways-to-run.

**Supuestos que quedan por comprobar**
- Que los subagentes de Grok hereden el `deny`.
- Que esta build (26300.9711) tenga MXC para el sandbox `mxc` de Codex.
- El precio de Windows Pro en la Microsoft Store de Bolivia.
- Que la cifra de «unos 2 trabajadores con navegador» se sostenga: es una estimación sobre 10-11 GB libres.
- Que Codex `unelevated` siga escribiendo después del paso 0.
- Que la tarea programada corra con S4U.
- Que la misma suscripción admita logins en varios usuarios de Windows.
- Que los CLI funcionen desde una carpeta compartida.
- Que el «agent workspace» de Windows no sirva para estos agentes.
- La ruta exacta de la carpeta de pedidos.
- Que exista una decisión del 26-oct de darle a Hermes un usuario propio: no está escrita en el repo.

## Verificación

Revisión adversaria del 26-oct-2026: se eligieron las 10 afirmaciones que más pesan en la decisión y se abrió cada fuente para intentar refutarla. Solo lectura; no se instaló ni se lanzó nada.

| # | Afirmación | Fuente abierta | Veredicto |
|---|---|---|---|
| 1 | Grok Build es el CLI `grok`, en beta desde el 25-may-2026, Apache-2.0, repo creado el 14-jul-2026, sin contribuciones externas | https://x.ai/news/grok-build-cli (25-may-2026); `gh api repos/xai-org/grok-build` (Apache-2.0, `created_at` 2026-07-14, `pushed_at` 2026-09-29); README del repo («External contributions are not accepted») | **Confirmada** |
| 2 | Grok Build cuesta una suscripción de xAI de «unos USD 30/mes» (supuesto, de guías no oficiales) | https://x.ai/pricing y https://docs.x.ai/x-subscription/pricing (11-oct-2026) | **Corregida.** Desde el 11-oct rige The X Subscription: Grok Build entra desde Plus, USD 8/mes con uso básico; Premium, USD 30, da 4x y suma Grok Bot. La clave de API se factura aparte. Ya no es supuesto |
| 3 | Grok Bot corre en una computadora en la nube de Cursor, todos los bots comparten esa computadora, las pantallas no son barrera de seguridad, y se paga desde Premium (USD 30) | https://docs.x.ai/grok-bot/overview, `/computer-and-apps` y `/approvals-security-and-privacy` (22-oct-2026); https://docs.x.ai/x-subscription/grok-bot | **Confirmada, con un agregado:** si se habilita, también corre comandos en la PC local (por defecto pregunta cada vez), y ahí actuaría como el usuario PC |
| 4 | Grok Build lee `CLAUDE.md`, `CLAUDE.local.md` y `.claude/rules` sin tope, y los hooks de `.claude/settings.json` (el Stop `git-autosync`) | `/build/features/project-rules` (4-jul-2026), `/build/features/hooks` (2-jul-2026); `.claude/settings.json:13-18` | **Confirmada, con matices:** salta lo que ignora `.gitignore`, y los hooks del proyecto corren solo tras `/hooks-trust` o `--trust`. Además lee parte del `managed-settings.json` de Claude (`/build/enterprise`) |
| 5 | Grok Build no tiene sandbox en Windows; `deny` gana siempre; el candado de administrador vive en `/etc/grok` | `/build/features/sandbox` y `/build/features/permissions` (21-jul-2026), `/build/enterprise` | **Confirmada, con un matiz:** existe `~/.grok/requirements.toml` por usuario, pero lo puede editar el mismo usuario que corre el agente, así que no es candado |
| 6 | Ni Grok Build ni Grok Bot tienen Telegram | Docs de Grok Bot (apps conectadas); https://composio.dev/toolkits/telegram/framework/grok-bot | **Corregida.** No tienen canal propio para hablarles por Telegram, como Hermes. Grok Bot puede mandar mensajes con un plugin de terceros (Composio) y Grok Build con un MCP |
| 7 | Hermes lee solo `AGENTS.md` y no usa Claude Max | `agent/prompt_builder.py:1858-1859`, `agent/subdirectory_hints.py:20`, `hermes_cli/auth.py:213`; `AGENTS.md:120` | **Corregida en parte.** Carga un solo tipo: `.hermes.md`, si no la cadena `AGENTS.md`, si no `CLAUDE.md`, y suma el de cada subcarpeta que toca. En este repo carga `AGENTS.md`. El código acepta `CLAUDE_CODE_OAUTH_TOKEN`; que no se use es regla de `AGENTS.md:120`, no un límite técnico |
| 8 | Windows 11 Home no trae Hyper-V, Windows Sandbox ni escritorio remoto entrante; Docker solo corre contenedores Linux | Microsoft Learn: Windows Sandbox («not supported on Windows Home edition») y requisitos de Hyper-V (solo Pro o Enterprise); Microsoft Support: escritorio remoto (el equipo remoto debe ser Pro); Docker: «Windows Home or Education editions only allow you to run Linux containers». Medido: `EditionID=Core`, sin `vmms.exe` ni `WindowsSandbox.exe` | **Confirmada** |
| 9 | Los comandos de la separación sirven en esta PC: `New-LocalUser` en Home, y los `icacls` del paso 0 sobre E: | `Get-Command New-LocalUser` (módulo `Microsoft.PowerShell.LocalAccounts` presente); `icacls E:\`, `E:\onia-wt` y `E:\onia-orquesta` (Modificar heredado de `Usuarios autentificados`); `whoami /groups` (Administradores solo para denegar). El equipo se llama `DESKTOP-ENV6SDA`, así que `PC` en `/grant` es el usuario | **Confirmada.** La sintaxis de `/remove:g` con varios SID es válida. Sigue como supuesto que Codex `unelevated` escriba después del paso 0. Se agregó una opción que faltaba: el sandbox `mxc` de Codex niega lecturas sin cuentas extra (Codex CLI 0.164.0 instalado) |
| 10 | Hermes con una cuenta bot de GitHub y un PAT fine-grained de solo lectura más issues; la orquesta con una GitHub App sin asiento | Términos de GitHub §B.3 (una cuenta máquina gratis); docs de tokens fine-grained (no sirven a colaboradores de un repo); permisos de un repo personal («Collaborators can't have read-only access»); docs de GitHub Apps (sin asiento, tokens de vida corta). Medido: `onia-hermes` es privado y su dueño es de tipo `User` | **Refutada para Hermes, confirmada para la orquesta.** Una cuenta bot colaboradora en este repo tendría escritura y no podría usar token fine-grained, así que el paso 1 («un `git push` falla») no se cumpliría. Se cambió por un token fine-grained de la propia cuenta de Sergio Urcullo recortado a issues, el mismo patrón ya pedido para el VPS (`handoff/orquesta.md:106`). La cuenta máquina gratis sí existe, pero no resuelve esto |

Otras comprobaciones menores:
- Chrome 136 ignora la depuración remota sobre la carpeta de datos por defecto, y Playwright advierte lo mismo en `launchPersistentContext`. **Confirmada.**
- `credential.helper=manager` está en el gitconfig del sistema, no en el global: el comando citado como fuente no lo mostraba. **Fuente corregida.** El ayudante vale para todo usuario de Windows, pero cada uno guarda sus credenciales en su propio Credential Manager, así que un usuario nuevo arranca sin el login de Sergio Urcullo.
- Windows Pro a US$99: no sale de Microsoft, sino de minoristas de EE.UU. (Best Buy, US$99,99). **Marcado.**
- Grok Bot descartado el 16-oct: está en `historial/ONIA_SISTEMA_AUTONOMO.md:257`, que es historia, no fuente de verdad. **Confirmada como antecedente.**
