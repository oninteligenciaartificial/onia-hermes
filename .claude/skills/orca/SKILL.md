---
name: orca
description: Invocar antes de usar, configurar o recomendar Orca (stablyai/orca), el tablero local de agentes en paralelo de la PC de Sergio Urcullo. Qué ve y qué no, cómo se usa como tablero, ajustes a corregir y trampas medidas.
---

# Orca — tablero LOCAL de agentes (no es la madre)

Medido el 16-oct-2026 (docs oficiales onorca.dev + instalación de la PC, solo lectura).

## Qué es
- ADE de Stably AI, gratis y MIT. Corre Claude Code, Codex y ~27 CLI más, **cada tarea en su worktree**.
- Usa las suscripciones que ya están logueadas en la PC. No vende nube.
- Instalado: `C:/Users/PC/AppData/Local/Programs/orca` (v1.4.224; la última era 1.4.227 el 16-oct).
  Estado en `C:/Users/PC/AppData/Roaming/orca`. CLI fuera del PATH: `resources/bin/orca.exe`.

## Qué ve y qué NO
- **Ve:** agentes lanzados DENTRO de Orca en la PC, hosts SSH y otros Orca pareados.
- **No ve ni controla la nube:** claude.ai/code (sesiones, Projects, rutinas) ni Codex cloud.
  En el binario hay 0 referencias a `claude.ai/code` y a `chatgpt.com/codex`.
- **Con la PC apagada no sirve**, tampoco la app móvil (es un espejo del escritorio).
- Hermes Agent figura como un CLI más (`hermes --yolo`). No habla con el bot de Telegram.

## Cómo se usa como tablero
- Crear la tarea con el **+** junto al repo y elegir el agente en el combobox. Lanzado a mano
  en la terminal, el agente queda sin indicador de estado.
- **Agents feed** y puntos de la barra lateral: ámbar = espera respuesta, rojo = falló,
  verde = terminó, ruedita = trabajando. Clic en la fila → terminal para hablarle.
- **Uso y límites:** clic en el segmento de uso de la barra de estado. Muestra Claude y Codex,
  ventana de 5 h, diaria y semanal, con alerta al 80 %.
- CLI: `orca worktree ps --json`, `orca status --json`.

## Ajustes a corregir (cada uno con el OK de Sergio Urcullo)
1. **Lanza sin permisos:** `claude --dangerously-skip-permissions` y
   `codex --dangerously-bypass-approvals-and-sandbox` por defecto. Choca con la regla global
   «nunca dangerously-skip-permissions».
2. **Worktrees en C:** (~6 GB cada uno; C: al 97 %). Settings > General > Workspace >
   Workspace Directory → E:. Afecta solo a los nuevos.
3. **Clon huérfano** `C:/Users/PC/orca/onia-hermes` (8,1 GB, índice git vacío, no registrado en Orca).
4. Telemetría anónima encendida (Settings > Privacy). Actualizar es instalar: pide OK.

## No hacer
- No activar Settings > Experimental > Orchestration, Cloud VM ni `orca serve`: sería un segundo
  orquestador o infraestructura remota nueva. La madre es una sola.
- No borrar `ponyfish` (lo maneja Orca) con `git worktree remove`: se borra desde Orca.
- Las capturas de computer-use salen negras con la ventana de Orca: se aprende por la doc y por la CLI.

## Hermes dentro de Orca (medido el 26-oct-2026)
- **Orca lanza `hermes --tui --yolo`** con `Set-Location C:/dev/proyectos/onia-hermes`, es decir, en el checkout de `main` y no en un worktree. Sin approvals: `--yolo` solo respeta `approvals.deny` y la lista fija.
- **Home desdoblada:** en Windows nativo Hermes usa `%LOCALAPPDATA%\hermes` (`hermes_constants.py:51-58`). Orca le pone el plugin `orca-status` en `C:/Users/PC/.hermes`, que Hermes no lee: Orca no recibe su estado.
- **Hermes lee UN solo archivo de proyecto** (`.hermes.md` → `AGENTS.override.md` → `AGENTS.md` → `CLAUDE.md`): con AGENTS.md en la raíz, CLAUDE.md nunca entra. No lee `~/.claude/**` ni `.claude/skills`; para las skills hace falta `skills.external_dirs`, que es ESCRIBIBLE: primero `skills.write_approval: true`.
- **El portal** es `hermes dashboard --no-open` → `127.0.0.1:9119` (entrada `hermes-dashboard` en `.claude/launch.json`). Sesiones, skills y config se leen en solo lectura desde `/api/*`, con `window.__HERMES_SESSION_TOKEN__`.
- **Puerto 6768** de Orca: escucha en `0.0.0.0`, con el firewall abierto en el perfil Público.
- Auditoría completa y plan: `hermes-content/docs/research/2026-10-26-auditoria-hermes-local.md`; estado: `handoff/hermes-local.md`.

Relacionado: skill `onia-sesion-madre` (la madre), proyecto «ONIA · Hermes» en claude.ai/code (madre en la nube).
