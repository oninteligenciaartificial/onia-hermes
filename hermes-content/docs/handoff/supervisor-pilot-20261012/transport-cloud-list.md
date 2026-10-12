# Transporte cloud list — 12-oct-2026

Worker /root/fuentes_relevo, modelo solicitado gpt-6.1-sol medio; efectivo no observable. Contrato solo lectura; piloto previo cerrado, sin nueva ejecución piloto/scheduler/task.

## Evidencia observada

CLI instalada: codex cloud list --help exit0 confirma --json, --limit1-20, --cursor, --env. No se leyó authcache ni se hizo login. CLI reference oficial y documentación cloud consultadas por herramienta web; fuentes https://developers.openai.com/codex/cli/reference (redirige https://learn.chatgpt.com/docs/developer-commands?surface=cli), https://developers.openai.com/codex/cloud/internet-access (redirige https://learn.chatgpt.com/docs/cloud/internet-access). QA revisa semántica por separado. Ayuda/documentación no acredita login ni correspondencia taskID/durableUUID.

Policy /etc/codex/network-policy.json v1, HTTP restricted. Cero reglas coinciden con host chatgpt.com mediante fnmatch. Dominios git.chatgpt.site/team.site listados son otros destinos; no autorizan chatgpt.com. Un sondeo inicial substring produjo indicador chatgpt_named true: se corrigió con match real, no se usa como wildcard autorizado.

DNS local: proxy→172.31.0.109; chatgpt.com→gaierror Errno-3 Temporary failure in name resolution. No conexión directa al destino; DNS destino local no es requisito demostrado para proxy CONNECT.

ÚNICA request curl al endpoint YA observado CLI:
https://chatgpt.com/backend-api/wham/tasks/list?limit=20&task_filter=current

Usó HTTPS_PROXY heredado http://proxy:8080 y red soportada por comando (with_additional_permissions network.enabledtrue), TLS conservado. Sin credenciales manuales, sin headers/body guardados, sinverbose. connect-timeout4/max-time10.

Comando exit56: `curl: (56) CONNECT tunnel failed, response 403`.
Status HTTP destino000. Chunkcb3f2b. No cloudlist rerun.

## Causa y límite

OBSERVADO: proxy rechaza túnel CONNECT con403 antes de respuesta del endpoint; policyrestricted carece regla chatgpt.com. No se negoció respuesta HTTP de aplicación en este sondeo. No es401/403 de autenticación del endpoint: destino000. No demuestra token inválido, login ausente, fallo TLS del destino o caída ChatGPT. No se recogió cuerpo seguro de razón proxy porque contrato limita status/error; código403 no nombra por sí solo la regla precisa.

INFERENCIA respaldada: bloqueo de destino por allowlist es consistente con proxy403 + hostausente; no se afirma diagnóstico interno exacto del proxy sin su reason metadata.

Intervención concreta para madre/plataforma: revisar y, si corresponde al alcance autorizado, permitir chatgpt.com en configuración de red soportada para esta CLI; verificar regla aplicada/enforced. No editar policyfile, no bypass ni nuevos dominios adivinados. Después, un comando list exacto read-only podrá probar transporte/auth y mapping. Si entonces401/403 de aplicación, parar y tratar autorización con evidencia nueva, sin inspeccionar secretos ni rodear control.

read_gate sigue BLOQUEADO antes de autenticación. wake_gate NO PROBADO; una lista aun exitosa no demuestra wake/scheduler. Árbol principal intacto. Se conservan metadata JSON e informe en misma rama privada piloto, sin main/merge/PR/install/servicios/gasto nuevo.
