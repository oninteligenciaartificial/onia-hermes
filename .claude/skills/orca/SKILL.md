---
name: orca
description: Invocar antes de usar, configurar o recomendar Orca (stablyai/orca), el tablero local de agentes en paralelo de la PC de Sergio Urcullo. Qué ve y qué no, cómo se usa como tablero, ajustes a corregir y trampas medidas.
---

# Orca — tablero LOCAL de agentes (no es el orquestador)

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
  orquestador o infraestructura remota nueva. Orquestan Hermes y `scripts/orquesta/` (`CLAUDE.md`, 19-oct); no hay otro.
- No borrar `ponyfish` (lo maneja Orca) con `git worktree remove`: se borra desde Orca.
- Las capturas de computer-use salen negras con la ventana de Orca: se aprende por la doc y por la CLI.

Relacionado: `scripts/orquesta/README.md` (quién orquesta desde el 19-oct) y `onia-sesion-madre` (historia: canales entre sesiones).
