# Auditoría Codex PC — 2026-10-14

- **Meta:** revisar configuración permitida y presencia de WSL; solo lectura.
- **Config:** `%USERPROFILE%/.codex/config.toml`; TOML válido.
- **Ajustes:** model=`gpt-6.1-sol`; reasoning=`medium`; sandbox_mode=`danger-full-access`; approval_policy=`never`; windows.sandbox=`elevated`.
- **Features booleanas:** `hooks=true`, `js_repl=false`, `memories=true`.
- **MCP:** 6 servidores; nombres: n8n-mcp, stitch, higgsfield, agentation, node_repl, facebook. No se leyeron valores.
- **WSL:** `wsl.exe --status` respondió: distro predeterminada Ubuntu, versión 2. WSL2 está presente/configurado; esto no prueba que estuviera ejecutándose ni que el repo viva allí.
- **Recomendación:** para este flujo Windows, usar Codex nativo por defecto. WSL2 solo si se necesita tooling Linux, el repo/workflow ya vive ahí o el sandbox nativo no alcanza. Cloud Codex/VPS Linux no establece una dependencia local de WSL.
- **Seguridad/alcance:** `danger-full-access` está guardado en el config; no se recomienda activarlo ni se modificó. El perfil runtime de esta tarea lo aporta el host, no se deduce del archivo. El valor de modelo guardado tampoco confirma el modelo servido en un chat.
- **Sin cambios:** no instalación, actualización, login, edición de config, cierre de procesos ni edición del repo.
- **Fuentes oficiales:** [Windows sandbox](https://learn.chatgpt.com/docs/windows/windows-sandbox), [WSL](https://learn.chatgpt.com/docs/windows/wsl), [Agents API architecture](https://developers.openai.com/api/docs/guides/agents-api/architecture).
