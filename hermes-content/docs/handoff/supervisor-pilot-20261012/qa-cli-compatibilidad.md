# QA compatibilidad CLI cloud list — 12-oct-2026

Agente /root/qa_independiente; Sol6.1 solicitado, servido no observable. Investigación oficial acotada, sin repetir requests401/403, login, authcache, secretos, instalaciones, endpoints privados ni tareas nuevas.

## Observado y comunicado

Help instalado leído por QA: cloud list lista tareas cloud; status exige TASK_ID; cloud exec crea NEWtask (no wake de UUID existente). Fuente worker obtiene codex-cli0.159.2 con --version/help exit0. Esa versión es evidencia de fuentes_relevo, no versión inferida de docs.

Madre declara piloto nuevo 01a131a1… con cloudallowed y CLI HTTP401. QA no reejecutó ni verificó request; no adjudicar401 a autenticación concreta/cuenta. No asumir que resolver401 demostrará compatibilidad de IDs.

## Documentación oficial y límite

[Developer commands / CLI reference](https://learn.chatgpt.com/docs/developer-commands?surface=cli), secciones codex cloud y cloud list: navegación chats/tareas cloud recientes; JSON tasks con id, url, status, environment_id y otros campos; autenticación principal CLI. No especifica mapeo de ese id a UUIDdurable/thread de sesión nativa ni tabla compatibilidad por versión0.159.2. **Mapping NO DOCUMENTADO en fuentes consultadas**; tampoco prueba que CLI sea incompatible con nativos. Terminología tasks/chats variable no basta para concluir incompatibilidad.

[Cloud environments actual](https://learn.chatgpt.com/docs/environments/cloud-environments), Start a task / Reuse and update saved state: experiencia actual web/mobile/desktop, nueva tarea aislada desde environment publicado; existente conserva working state. [Codex Cloud Legacy](https://learn.chatgpt.com/docs/environments/cloud-environment) documenta experiencia distinta para Code Review/integraciones Linear/GitHub. La distinción oficial existe; las páginas consultadas no etiquetan inequívocamente cloud list0.159.2 como soloLegacy ni entregan conversión nativeUUID↔legacytaskID. No inventar mapping por formato UUID.

[Using Codex Cloud](https://help.openai.com/en/articles/20001545-using-codex-cloud), Prepare an environment / sharing / unavailable work: abrir tarea original y su enlace/ID; sharing environment no otorga tareas de otro actor. Es alternativa oficial de lectura mediante UI del task original, con acceso del actor, sin Work ni copiar login.

## Match requerido y opción sostenible

Antes de considerar auth adicional para supervisor: confirmar por fuente oficial/link de tarea original que el ID específico nativo es addressable por cliente/API soportada. Platform01a12c7e-97e2-7115-8561-0b7658008003; Marca01a13170-b488-71d9-83f8-12663d5a0013; Lucía01a13171-0fdb-72c6-9fdc-81244d7e6006; Ventas01a13171-6ac1-771e-b285-52e7284e203a. HermesUUID no inyectado. Exact match de inventario autorizado o documentación de correspondencia requerida; no confundir automation/jawbone IDs.

Ruta soportada hoy documentalmente: madre lee tareas originales en UI y conserva ID/link/head/estado observado por carril. Automatización futura condicionada a API/cliente oficial autorizado que demuestre lectura/entrega de esos IDs, principal/acceso correcto y auth documentada para esa superficie; no afirmar integración disponible ni fabricar endpoint. Scheduler y registro durable se validan por separado. CLIlist aun exitosa no es wake/supervisor5; cloudexecNEWtask no cumple permisoexistingwake.

Conclusión: **compatibilidad exacta NO DOCUMENTADA/NO PROBADA**, no incompatibilidad definitiva. No resolver con login o traslado de secretos ni nuevas tareas. Handoff mínimo y evidencia quedan con fuentes para misma rama privada. Sin nuevas solicitudes a401; diagnóstico transporte cerrado.

QA leyó HANDOFF-MINIMO.md del worker (hash comunicado c87bb4c8d8b6b889886231e0fa6a1dbf7ad91359361ae175aab079010ae3ea28). Clasifica sintaxis no garantía backend/auth, IDs declarados, Hermes missing,401 comunicado no propio y no repetir; coherente con este veredicto. Versión CLI0.159.2 comprobada por worker chunk16db4a exit0. No exploración adicional de código/API necesaria para declarar límite documental, sin fabricar diagnóstico incompatibilidad.
