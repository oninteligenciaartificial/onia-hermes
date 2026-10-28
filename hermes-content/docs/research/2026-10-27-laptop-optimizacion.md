# Laptop de Sergio Urcullo: qué la frena y cómo exprimirla (27-oct-2026)

Pedido suyo (27-oct, de madrugada): optimizar al máximo la laptop para que los procesos de ONIA no sufran cuando se
trabaja en local, y analizar Linux si hace falta. Todo lo de abajo se midió esa madrugada, con unos 3 días encendida
(arrancó el 23-oct, 21:44).

## 1. La máquina

HP Victus 16 (d0xxx), con un i5-11400H de 6 núcleos y 12 hilos, y Windows 11 Home 26300.
- **RAM:** 24 GB, en un módulo de 16 y otro de 8 a 3200 MHz. Al ser de distinto tamaño, una parte trabaja en un
  solo canal.
- **Disco C::** NVMe Kingston de 500 GB, con 66 GB libres. El 26-oct tenía 85.
- **Disco E::** NVMe Kingston de 1 TB, con 490 GB libres. **Es igual de rápido que C:**.
- **Energía:** el procesador va al 100 % con cargador y con batería.

## 2. Qué la frena (medido)

| Qué | Medida | Por qué pesa |
|---|---|---|
| Un `find /` colgado de una sesión de Claude del 26-oct, 21:36 | **un núcleo entero** (5 s de CPU en 5 s) durante horas | Recorre todo el disco. La carga total estaba en 71 % |
| Pool paginado del kernel | **3,3 GB** con 3 días encendida (lo normal es menos de 1 GB) | La fuga ya medida el 9 y el 10-oct, que llegó a 17 GB. El sospechoso es Avast (`equipo-de-agentes` §5). Solo se libera reiniciando |
| Avast (5 procesos) | ~0,9 GB | Además de la sospecha del pool |
| Claude (21 procesos) | 5,1 GB | La app más una sesión por conversación abierta |
| ChatGPT / Codex (14) | 1,8 GB | |
| WebView2 (14) | 1,5 GB | Ventanas web de otras apps |
| Docker Desktop | **32 GB en C:**, y arranca con Windows | No estaba corriendo: el disco está ocupado igual |
| Temporales del usuario | **16 GB** | |
| Datos de la app de Claude | 10,6 GB (más 4,8 GB de transcripciones en `~/.claude/projects`) | |
| Copias del repo en C: | 4 × 5,5 GB | Cada sesión de Claude con worktree copia el repo entero |

Programas que arrancan con Windows: Teams, Microsoft Lists, Edge (autolaunch), OneDrive, Docker Desktop, Razer
Synapse y THX, **Riot Vanguard** (driver de kernel siempre activo), Avast, KeePassXC, Realtek y los dos de ONIA (el
túnel al 3108 y el stack local).

WSL (Ubuntu y docker-desktop) estaba parado. Ollama no corría.

## 3. Lo que se aplicó

Nada. Cerrar el `find` colgado lo frenó el control de permisos, porque el proceso es de otra sesión de Claude. Lo
demás cambia configuración de Windows o borra datos: necesita su OK.

## 4. Propuestas para su OK (en orden de impacto)

Todas se corren en una PowerShell normal o desde Configuración. Ninguna instala nada.

| # | Qué | Libera | Riesgo | Cómo se deshace |
|---|---|---|---|---|
| 1 | Cerrar el `find` colgado: `Stop-Process -Id 23760,3160,18584` (los PID son de esa madrugada; si cambiaron, el Administrador de tareas los muestra como `find.exe`) | Un núcleo de CPU | Ninguno | No hace falta |
| 2 | **Desinstalar Avast** (Configuración → Aplicaciones). Windows Defender se prende solo | La fuga del pool (3 a 17 GB) y ~0,9 GB | Bajo: Defender protege igual en uso normal | Reinstalar Avast |
| 3 | **Docker Desktop:** si no se usa en local (producción corre en el VPS), desinstalarlo. Si se usa, mover su disco a E: (Docker Desktop → Settings → Resources → Disk image location) y sacarlo del inicio | **32 GB en C:** | Bajo. Ni el stack local, ni el túnel, ni la orquesta lo usan (grep del 27-oct). Otros scripts sueltos: sin verificar | Reinstalar |
| 4 | Sacar del inicio (Administrador de tareas → Aplicaciones de arranque): Teams, Microsoft Lists, Edge, Docker Desktop. También Razer Synapse y THX si no usa periféricos Razer, y Riot Vanguard si no juega | RAM y arranque más rápido. Vanguard es un driver de kernel que corre siempre | Nulo | Volver a habilitarlos ahí |
| 5 | Temporales de más de 7 días: `Get-ChildItem $env:TEMP -Force \| Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } \| Remove-Item -Recurse -Force -ErrorAction SilentlyContinue` | Hasta 16 GB | Bajo. **No se deshace** | — |
| 6 | Cerrar las sesiones de Claude que no se usan, y archivar las viejas en la app | Parte de los 5,1 GB | Nulo | Se reabren |
| 7 | OneDrive: si no lo usa, salir y sacarlo del inicio | ~0,1 GB y la sincronización | Nulo | Volver a abrirlo |
| 8 | Mientras siga Avast: reiniciar una vez por semana | El pool | Nulo | — |
| 9 | **RAM: 2 × 16 GB iguales** (32 GB en doble canal) en lugar de 16 + 8 | +8 GB y más ancho de banda | Es una compra: precio sin verificar | Volver a los módulos actuales |
| 10 | Más adelante: el repo en E: (mismo NVMe, 490 GB libres), así las copias de cada sesión no llenan C: | 5,5 GB por sesión abierta | Medio: hay rutas `C:\dev\proyectos\onia-hermes` fijas en scripts, en la tarea programada y en `aplicar.ps1` | Volver a moverlo |

**Con 1 a 5:** C: pasa de 66 a ~110 GB libres, se recupera un núcleo y se corta la fuga de memoria. Todo sin gastar.

## 5. ¿Linux?

Lo que cambió en 2026: hay versión oficial para Linux de las dos apps que usamos.
- **Claude Desktop:** beta desde el 30-jun para Ubuntu 22.04+ y Debian 12+. Trae Claude Code. Le falta Computer
  Use ([1](https://itbrief.com.au/story/anthropic-launches-claude-desktop-beta-for-linux-users),
  [2](https://pasqualepillitteri.it/es/news/6969/claude-desktop-linux-beta-ubuntu-debian-es)).
- **ChatGPT con Codex:** preview desde el 11-ago para Ubuntu 24.04/26.04, Debian 13 y Fedora. Le falta Computer Use
  y Wayland está verde ([3](https://www.omgubuntu.co.uk/2026/08/chatgpt-desktop-app-linux-preview),
  [4](https://community.openai.com/t/codex-in-chatgpt-desktop-app-for-linux-is-now-in-preview/1390027)).

| Pieza de ONIA | En Linux |
|---|---|
| Claude Code CLI, Codex CLI, la orquesta (`node`), `gh`, git | Sí, nativo |
| Hermes Agent | Sí. Está pensado para Linux: el VPS ya lo corre así |
| HyperFrames, ffmpeg, Playwright, Chrome | Sí, y sin la trampa de `EFTYPE` del Chrome de Windows |
| Sandbox de los agentes | **Mejor:** Claude Code y Codex aíslan de verdad en Linux. En Windows no hay sandbox real: por eso existen la etiqueta y la lista de bloqueos |
| App de Claude y app de Codex | Sí, en beta o preview, sin Computer Use |
| Orca | Probable (es Electron); sin verificar |
| WhatsApp | Solo la web |
| KeePassXC, Telegram | Sí |
| Riot o Valorant | No |
| Avast y la virtualización MSIX de la app de Claude | Desaparecen: menos memoria y ninguna copia escondida de `%LOCALAPPDATA%` |

**Recomendación:**
1. **Ahora:** las propuestas 1 a 5 en Windows. Cuestan cero y resuelven lo que más pesa.
2. **Después del 3-nov:** probar los trabajos sin pantalla (la pasada de la orquesta, Hermes y los renders) en el
   **WSL2 Ubuntu** que ya está instalado. El repo tiene que ir clonado dentro de WSL (en `/mnt/c` es lento), con un
   `.wslconfig` que le ponga tope de memoria. Se gana sandbox real y velocidad sin perder las apps de Windows.
3. **Dual boot o pasarse del todo a Linux** solo si con eso no alcanza. Se pierde WhatsApp de escritorio y los
   juegos, y las apps de IA en Linux todavía son beta. No conviene antes de cobrar los primeros clientes: es un día
   entero de trabajo de él sin ingreso.
