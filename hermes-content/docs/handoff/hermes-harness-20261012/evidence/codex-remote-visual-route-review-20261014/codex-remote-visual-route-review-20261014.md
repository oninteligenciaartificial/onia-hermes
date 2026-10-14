# Rutas Codex remoto y control visual — revisión acotada

Fecha de consulta: 2026-10-14. Alcance: documentación oficial pública OpenAI, DTO publicado de App Server v0.161.0 y estado local comunicado por la madre Root. No se hizo login, SSH, llamada operativa a CLI/App Server, configuración remota ni cambio de infraestructura.

**META:** determinar qué ruta remota existe y qué permite con PC apagada. **PRUEBA DE HECHO:** fuentes enlazadas y distinción entre documentación, estado reportado e incógnitas. **PARADA:** corrección documental; no ejecutar rutas.

## Hallazgo

**Codex desktop admite conexiones de proyecto por SSH.** La app puede iniciar el Codex App Server remoto por SSH y operar en el filesystem/shell del host remoto. La guía describe requisitos y configuración, pero en esta revisión no se hizo esa configuración ni se probó el VPS de ONIA. [Remote connections](https://learn.chatgpt.com/docs/remote-connections)

**Control desde móvil con la PC apagada:** la documentación requiere un host desktop macOS/Windows disponible, con ChatGPT abierto y conectado. Si ese host inicia SSH al VPS, debe seguir encendido y online. La guía no documenta un VPS Linux como host móvil directo. Otra máquina desktop dedicada podría servir si se configura; no se probó aquí. [Remote connections](https://learn.chatgpt.com/docs/remote-connections)

## Comparación de rutas

| Ruta | Ejecución / PC apagada | UI, sesión e IDs | Estado y límites |
|---|---|---|---|
| **1. Codex Cloud nativo** | Workspace alojado por OpenAI; el trabajo puede continuar sin que la PC local permanezca encendida. | Experiencia Cloud nativa. El mapeo de sus UUID de tarea a sesiones App Server no está demostrado. | Ruta documentada para trabajo PC-off. No usa la CPU/RAM del VPS. Cuotas y facturación dependen del plan y la configuración aplicables; no se verificaron en cuenta. [Cloud environments](https://learn.chatgpt.com/docs/environments/cloud-environments), [pricing](https://learn.chatgpt.com/docs/pricing) |
| **2. Codex desktop → SSH → VPS** | Shell y archivos remotos en VPS. El desktop que origina SSH debe seguir disponible para control móvil; con la única PC apagada, no hay ese host. | La guía documenta conexión desde la app. La guía App Server describe mensajes tipo JSON-RPC 2.0; sin embargo, el DTO publicado para v0.161.0 declara que no envía ni espera el campo `jsonrpc`. `thr_…` es un ejemplo, no evidencia para inferir namespace o formato de IDs. No está demostrado un puente de IDs Cloud nativos a `thread.id`. | La opción SSH está documentada, pero la nueva conexión no se configuró. WebSocket se describe como experimental/no soportado para uso general. Auth efectiva, modelo y costos en el VPS no se observaron. [Remote connections](https://learn.chatgpt.com/docs/remote-connections), [App Server](https://learn.chatgpt.com/docs/app-server), [DTO v0.161.0](https://github.com/openai/codex/blob/rust-v0.161.0/codex-rs/app-server-protocol/src/rpc.rs) |
| **3. Codex CLI en VPS + panel Telegram Hermes** | La combinación podría operar con PC apagada si sus componentes VPS y panel quedan disponibles. | Son sesiones CLI coordinadas por Telegram; equivalencia con la UI, diffs y revisión visual de Codex desktop/Cloud no está demostrada. | Root reportó CLI 0.161 y permiso histórico para autenticación en VPS. Eso no demuestra sesión activa ni auth efectiva. Integración y persistencia end-to-end no se probaron en esta revisión. |

## IDs, RPC y límites de evidencia

- **Reporte de Root, no revalidado:** cinco tareas Cloud nativas con UUID, dos children recientes y `cloud list` en VPS sin tareas/UUID nativos conocidos. No usar estos datos para inferir un contrato de identidad entre productos.
- **Probes App Server:** las pruebas V1 y V2 reportadas fallaron en el parser. Por tanto, no se obtuvo metadata RPC y no se observó cuenta, autenticación efectiva ni sesión. La afirmación anterior de que “App RPC devolvió metadata” era incorrecta.
- **Protocolo:** la guía describe JSON-RPC 2.0. El código fuente oficial de `rust-v0.161.0` aclara que ese protocolo no es JSON-RPC 2.0 estricto: ni envía ni espera `"jsonrpc":"2.0"`. Sus tipos de request/response no contienen ese campo. [App Server](https://learn.chatgpt.com/docs/app-server), [DTO v0.161.0](https://github.com/openai/codex/blob/rust-v0.161.0/codex-rs/app-server-protocol/src/rpc.rs)
- **IDs:** la documentación describe `thread.id` y métodos `thread/start`/`thread/resume`; el ejemplo `thr_…` no prueba el namespace completo ni el formato obligatorio. No hay contrato público consultado que demuestre traducción/importación de UUID de tareas Cloud a IDs App Server.
- **Handoff:** Root reportó que la herramienta disponible en la sesión sólo ofrecía `Local`. Eso no invalida la guía oficial de conexión SSH; tampoco prueba que la versión local ya tenga ese flujo configurado o que el RPC instalado lo implemente.
- **Ruta API aparte:** Agents API con sandbox self-hosted y `codex exec-server` es un producto/contrato distinto. No se debe tratar como acceso a tareas Cloud nativas ni como prueba de equivalencia de UI. [Self-hosted sandboxes](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted)

## Conclusión para decisión de Sergio

1. Para trabajo PC-off con UI Codex, Codex Cloud nativo es la ruta documentada; no se demostró continuidad hacia el VPS ni equivalencia de IDs.
2. Con componentes Hermes ya reportados, la ruta implementable para coordinación PC-off es CLI en VPS + Telegram, condicionada a comprobar que los servicios están disponibles y la sesión/auth funciona.
3. La ruta desktop→SSH está documentada y puede dar control visual cuando exista un Mac/Windows encendido; aquí no se configuró.
4. Sigue pendiente la decisión de Sergio sobre qué ruta quiere operar para trabajo en el VPS y si autoriza configurar un host desktop SSH o prioriza CLI+Telegram.
5. Para cambiar el estado de CLI+Telegram: prueba aislada de sesión CLI real, tarea inocua en copia no productiva, continuidad/reconexión y evidencia observable en Telegram; registrar auth/costo sin exponer secretos.
6. Para cambiar el estado de SSH: configurar conexión en host aprobado y completar prueba visual aislada de lectura/edición en copia no productiva, sin exponer el App Server públicamente.
7. Para afirmar mapping de IDs o paridad, hace falta documentación contractual o prueba controlada que correlacione IDs y comportamiento; el ejemplo `thr_…` no basta.

## Fuentes consultadas

- [Remote connections](https://learn.chatgpt.com/docs/remote-connections) — SSH, desktop host y requisitos; consultado 2026-10-14.
- [Codex App Server](https://learn.chatgpt.com/docs/app-server) — protocolo y sesiones; consultado 2026-10-14.
- [Código App Server v0.161.0](https://github.com/openai/codex/blob/rust-v0.161.0/codex-rs/app-server-protocol/src/rpc.rs) — DTO RPC y ausencia de campo `jsonrpc`.
- [Cloud environments](https://learn.chatgpt.com/docs/environments/cloud-environments) y [pricing](https://learn.chatgpt.com/docs/pricing) — documentación de entornos y precios/cuotas; consultados 2026-10-14.
- [Self-hosted sandboxes](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) — ruta distinta de Agents API; consultado 2026-10-14.
