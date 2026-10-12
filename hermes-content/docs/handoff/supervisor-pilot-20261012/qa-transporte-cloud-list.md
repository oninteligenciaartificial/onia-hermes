# QA documentación y transporte cloud list

12-oct-2026. Agente real /root/qa_independiente. Sol6.1 solicitado/configurable, modelo servido no observable. Solo lectura de ayuda/documentación/evidencias del worker; sin duplicar DNS/proxy/TLS ni rerun cloud list.

## Capacidad oficialmente soportada

Ayuda instalada codex cloud --help y codex cloud status --help, exit0: cloud ofrece list/status sobre tareas cloud; status exige TASK_ID. No se ejecutó status con UUID supuesto.

[Referencia oficial CLI](https://developers.openai.com/codex/cli/reference/) consultada 12-oct; redirige a [Developer commands](https://learn.chatgpt.com/docs/developer-commands?surface=cli). Explica cloud list como listado de chats cloud recientes, filtrable y paginado, JSON tasks más cursor; cada registro contiene id, url, title, status, updated_at, environment_id/environment_label, summary, is_review y attempt_total. Autenticación sigue credenciales de CLI principal. Se confirma capacidad soportada de lectura, no integración activa en esta sesión.

Inferencia acotada: CLI lista cloud tasks/chats y podría servir para lectura de estados SI conecta y los IDs exactos coinciden con fuente. Documentación consultada no establece equivalencia universal TASK_ID con cinco UUID durables proporcionados ni API de wake de esos cinco. No declarar incompatibilidad definitiva ni ausencia universal de API; correspondencia permanece no probada. CLIhelp usa terminología task; docs actuales también chat: no tomar diferencia de palabra como evidencia de productos incompatibles.

[Using Codex Cloud](https://help.openai.com/en/articles/20001545-using-codex-cloud) distingue tareas cloud y permisos de acceso: compartir entorno no entrega automáticamente tareas de otro actor. [Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan) indica ejecución cloud en máquinas gestionadas y continuidad con equipo dormido, y que consumo modelo usa límites/créditos/billing normales. Esto apoya posibilidad de independencia local, no acredita nuestro piloto recurrente, identidad ni costo total cero. No usar comentarios de comunidad como documentación oficial.

## Gates separados

read_gate: capacidad documentada, ejecución actual bloqueada por list request error sin inventario (ver qa-cli-alternativa.md). Error transporte inicial no identifica 401/403 ni login inválido. Fuente worker realiza diagnóstico permitido de endpoint ya observado; QA no lo duplica.

wake_gate: no probado ni ejecutado. List/status de tareas no es scheduler/despertar. No se creó task, cron, loop, worker ni servicio. El piloto previo registra metadatos contractuales y UTC observado en turno existente, no sondeo live5 ni scheduler.

Opción sostenible condicionada: acceso autorizado soportado a lectura/entrega cross-thread sobre IDs exactos, identidad/principal comprobados, registro durable por turno/resultado y scheduler separado con destino/exclusión/consumo probados. Esta es especificación de capacidad requerida, NO integración disponible ni recomendación de instalar/provisionar. No usar endpoints privados inferidos ni autenticación extraída.

## Evidencia transporte pendiente

Se integrará únicamente resultado sanitizado de fuentes_relevo (DNS/policy/proxy/TLS/status) y su hash. Si observa401: acceso necesita identidad/auth soportada; no leer cache ni pedir token por chat. Si observa403: identificar política/permiso con metadata sustentada; no atribuir bloqueo a origen o proxy sin evidencia. Si política excluye host: requiere cambio autorizado de configuración y revisión pertinente, no bypass. No repetir list sin cambio de hipótesis/evidencia.

## Resultado observado del worker — diagnóstico de hipótesis

Leído transport-cloud-list.json del worker, UTC2026-10-12T19:11:18.545159+00:00. Policy v1 restricted sin matching rules chatgpt.com; proxy DNS172.31.0.109, chatgpt.com resolver temporal Errno-3. Request al endpoint previamente emitido por CLI, proxy conservado, permiso de red oficial por comando, TLS verificación activa, sin credenciales manuales ni headers/body guardados: curl exit56, **CONNECT tunnel failed, response403**, destination HTTP **000**.

Causa sustentada: túnel CONNECT rechazado por proxy; el destino no devolvió HTTP401/403 observable. Auth permanece NO OBSERVADA. DNS directo fallido no valida bypass y no se intentó; no desactivar proxy/TLS. La ausencia regla policy concuerda con bloqueo de acceso, pero metadata disponible no entrega explicación explícita del proxy; no afirmar cause header no capturado. read_gate blocked_proxy_connect_403; wake_gate no probado. Sin reruncloudlist, nuevos servicios/scheduler/tasks.

Intervención requerida si se continúa: habilitación de acceso a host por configuración de entorno soportada y revisión autorizada, conservando proxy/TLS. No pedir login antes de que transporte funcione; luego prueba lectura de identidad/IDs exactos. Esto no autoriza cambio de policy por QA ni scheduler.

QA leyó MD final worker: SHA2565386e86b41c264a68f95d3ea24cc53bf094033e07ae2797eafb0dcf86e955c79; JSON SHA256d73a2ec6482059af8b0ac6e791035d777211d45a0cd0990d64b7f71b3d677cc7. Ambos coherentes y sanitizados, separación observado/inferido correcta. MD identifica request única chunkcb3f2b y no reruncloudlist. Aceptado como diagnóstico transporte acotado, no como autenticación o supervisión validada. Copia/commit/push privado por worker fuentes, sin duplicar Git.
