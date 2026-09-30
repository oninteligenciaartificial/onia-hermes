# Qué puede y qué no puede hacer una sesión de Claude (nube vs laptop)

> Fuente de verdad del tema, sin fecha: si algo cambia, se EDITA esta tabla.
> Nace del 30-sep-2026. Sergio Urcullo: *«hay veces que tenés que hacer cosas y no podés, tampoco podés
> comunicarte entre sesiones y muchas más cosas, para todo, anotalo»*. Cada fila se MIDIÓ en una
> sesión en la nube (entorno «Onia»), no se supuso.

## Principio de organización

**La nube es la titular de cada carril y la laptop es la excepción.** Una sesión en la nube sigue
trabajando con la PC apagada; una sesión local, no. Por eso **no** se abre una «v2 local» de cada
sesión: dos sesiones en el mismo carril se pisan archivos e infra, y se le cruza la información a
Sergio Urcullo (regla «un objetivo, un dueño» del CLAUDE.md). La laptop queda **solo** para lo que
exige su mano o su login.

## La tabla

| # | Qué | Estado | Cómo se hace hoy | Qué falta y de quién |
|---|---|---|---|---|
| 1 | **Entrar al VPS por SSH** | ✅ resuelto 30-sep | Túnel de Cloudflare `onia-ssh` → `ssh.onia.com.bo`. El hook SessionStart `scripts/nube-ssh-vps.mjs` deja `ssh onia-vps` listo en toda sesión nube. Receta: skill `onia-infra`. | Sergio: secreto `CLOUDFLARE_API_TOKEN` (Access: Apps and Policies + Service Tokens: Edit) para poner Cloudflare Access delante. Hoy protege solo la llave SSH. |
| 2 | **Usar la PC de Sergio desde la nube** (apps, pantalla, navegador con su login) | 🔴 **no existe para sesiones de Code en la nube** (medido 30-sep) | La app Claude desktop de Windows (v2.16120.0) lo dice textual en Sistema → «Uso del computador (Beta)»: *«No disponible en sesiones de Code en la nube, que no se ejecutan en esta computadora»*. El menú **+** de la sesión nube no ofrece «Devices». | Lo que exige su PC lo hace una sesión **en su PC**: la app de escritorio (tiene «Habilitar uso de computadora» ENCENDIDO) o **«Despacho» (Beta)**, que le deja mandarle tareas a su PC desde el teléfono. Condiciones: PC prendida, «Mantener la computadora activa» ON y tapa abierta. Para que sea **autónomo**: la nube deja la tarea en la **cola de tareas locales** (issues con la etiqueta `tarea-local`), y una tarea programada de la app de escritorio la toma sola cada hora. Protocolo: `ONIA_COLA_TAREAS_LOCALES.md`. |
| 3 | **Comunicarse entre sesiones** | ✅ funciona, con forma fija | Rutina de **un disparo** con `persistent_session_id` de la sesión destino (`create_trigger`, `run_once_at` +1-2 min) + registro en `COORDINATION_MANIFEST.md` §EL HILO. Probado ida y vuelta con control el 30-sep. | `ListAgents` NO ve otras sesiones de la nube desde esta (medido: «No reachable agents»), y una sesión local `claude remote-control` tampoco aparece. No usar ese camino. |
| 4 | **Portal del SIAT** (fman.impuestos.gob.bo) | 🔴 prohibido automatizar | Solo Sergio, a mano. Lo que muestra se pide **en capturas**. El tráfico SOAP al piloto desde el runner del VPS sí está autorizado. | Regla en skill `onia-contabilidad-bolivia` (el SIN le mandó un aviso por uso automatizado). |
| 5 | **Paneles con login** (Meta Business / WhatsApp Manager, Cloudflare, Hostinger) | ⚠️ por API cuando hay token | Meta: MCP «Meta Developer Tools» (apps, permisos, webhooks) y «Meta Ads». Plantillas de WhatsApp: Graph API con el token del sistema que ya está en el VPS. Cloudflare: con `CLOUDFLARE_API_TOKEN`. | Lo que no tenga API ni token → fila 2 (su PC) o que él lo haga. |
| 6 | **GitHub Actions** (cancelar corridas, lanzar workflows a mano) | ⚠️ bloqueado | La integración de GitHub devuelve **403** al cancelar o despachar (medido 30-sep en onia-platform y por control en onia-hermes). Leer corridas y logs sí funciona. | Sergio: secreto `GH_ACTIONS_TOKEN` (fine-grained, Actions: read/write en los dos repos) si se quiere. |
| 7 | **Contenedor efímero** | ⚠️ se reinicia | Se reinició 2 veces el 30-sep: lo que vive solo en el scratchpad o en la memoria se pierde, y los resultados de subagentes no llegan solos (se recuperan de `~/.claude/projects/.../subagents/agent-*.jsonl`). | Regla: commitear y pushear seguido; el handoff del carril al día (`docs/handoff/<carril>.md`). |
| 8 | **Docker en la nube** (probar la app aislada, capturas reales) | ✅ funciona | `dockerd &` a mano (no arranca solo). Postgres + GoTrue + mailpit + app, salida a internet bloqueada. Receta en el handoff `onia-1.0-nube.md`. | — |
| 9 | **Tu WhatsApp personal** | 🔴 solo Sergio | Se usa como «paciente» en pruebas. Nunca se conecta a la API: es WhatsApp común. | — |
| 10 | **Gastar plata** (Meta, Higgsfield, ElevenLabs, SMS) | 🔴 con OK explícito | Cada gasto con su costo delante y aprobación. | — |

## Cómo sigue una sesión cuando nadie la mira

1. Handoff del carril commiteado y pusheado.
2. `send_later` o una rutina para su próximo chequeo (se despierta sola).
3. Si necesita algo de otra sesión: rutina de un disparo (fila 3).
4. Si necesita a Sergio Urcullo: lo escribe en el campo «qué depende de Sergio» del handoff y se lo dice
   en su próximo mensaje. Nada de adivinar ni de saltar el paso.
